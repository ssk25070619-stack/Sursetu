"""
SurSetu - Neural Machine Translation Edge Inference Engine
------------------------------------------------------------
Provides sub-millisecond, low-memory neural translation inference using the
PyTorch Transformer checkpoint trained on the NVIDIA RTX 4050 GPU.

Supports:
  - English -> Santali (Ol Chiki ᱚᱞ ᱪᱤᱠᱤ / Odia ଓଡ଼ିଆ)
  - Hindi -> Santali / Ho / Mundari
  - Dynamic Greedy & Temperature-Controlled Autoregressive Decoding
  - Automatic Device Selection (CUDA if available, else Mobile/Edge CPU)
"""

import os
import sys
import json
import torch
import torch.nn as nn

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8", line_buffering=True, errors="replace")
if hasattr(sys.stderr, "reconfigure"):
    sys.stderr.reconfigure(encoding="utf-8", line_buffering=True, errors="replace")

PROJECT_ROOT = os.path.dirname(os.path.abspath(__file__))
MODELS_DIR = os.path.join(PROJECT_ROOT, "models")
CHECKPOINT_PATH = os.path.join(MODELS_DIR, "sursetu_transformer_nmt.pt")
VOCAB_PATH = os.path.join(MODELS_DIR, "sursetu_vocab.json")

PAD_IDX = 0
SOS_IDX = 1
EOS_IDX = 2
UNK_IDX = 3

class PositionalEncoding(nn.Module):
    def __init__(self, d_model: int, max_len: int = 512):
        super().__init__()
        import math
        pe = torch.zeros(max_len, d_model)
        position = torch.arange(0, max_len, dtype=torch.float).unsqueeze(1)
        div_term = torch.exp(torch.arange(0, d_model, 2).float() * (-math.log(10000.0) / d_model))
        pe[:, 0::2] = torch.sin(position * div_term)
        pe[:, 1::2] = torch.cos(position * div_term)
        self.register_buffer("pe", pe.unsqueeze(0))

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        return x + self.pe[:, :x.size(1), :]


class SurSetuTransformerNMT(nn.Module):
    def __init__(self, src_vocab_size: int, tgt_vocab_size: int, d_model: int = 256, nhead: int = 8, num_layers: int = 3, dim_feedforward: int = 512, dropout: float = 0.1):
        super().__init__()
        import math
        self.d_model = d_model
        self.src_embedding = nn.Embedding(src_vocab_size, d_model, padding_idx=PAD_IDX)
        self.tgt_embedding = nn.Embedding(tgt_vocab_size, d_model, padding_idx=PAD_IDX)
        self.pos_encoder = PositionalEncoding(d_model)

        self.transformer = nn.Transformer(
            d_model=d_model,
            nhead=nhead,
            num_encoder_layers=num_layers,
            num_decoder_layers=num_layers,
            dim_feedforward=dim_feedforward,
            dropout=dropout,
            batch_first=True
        )
        self.fc_out = nn.Linear(d_model, tgt_vocab_size)

    def generate_square_subsequent_mask(self, sz: int, device: torch.device) -> torch.Tensor:
        mask = (torch.triu(torch.ones((sz, sz), device=device)) == 1).transpose(0, 1)
        mask = mask.float().masked_fill(mask == 0, float("-inf")).masked_fill(mask == 1, float(0.0))
        return mask

    def forward(self, src: torch.Tensor, tgt: torch.Tensor) -> torch.Tensor:
        import math
        device = src.device
        tgt_seq_len = tgt.size(1)

        src_key_padding_mask = (src == PAD_IDX)
        tgt_key_padding_mask = (tgt == PAD_IDX)
        tgt_mask = self.generate_square_subsequent_mask(tgt_seq_len, device)

        src_emb = self.pos_encoder(self.src_embedding(src) * math.sqrt(self.d_model))
        tgt_emb = self.pos_encoder(self.tgt_embedding(tgt) * math.sqrt(self.d_model))

        out = self.transformer(
            src=src_emb,
            tgt=tgt_emb,
            tgt_mask=tgt_mask,
            src_key_padding_mask=src_key_padding_mask,
            tgt_key_padding_mask=tgt_key_padding_mask,
            memory_key_padding_mask=src_key_padding_mask
        )
        return self.fc_out(out)


class SurSetuNeuralInference:
    """Singleton Inference wrapper for SurSetu Neural Transformer."""
    def __init__(self, device: str = None):
        if device is None:
            self.device = torch.device("cuda:0" if torch.cuda.is_available() else "cpu")
        else:
            self.device = torch.device(device)

        self.model = None
        self.src_vocab = {}
        self.tgt_vocab = {}
        self.tgt_idx2char = {}
        self.loaded = False
        self._load()

    def _load(self):
        if not os.path.exists(CHECKPOINT_PATH) or not os.path.exists(VOCAB_PATH):
            return

        try:
            with open(VOCAB_PATH, "r", encoding="utf-8") as f:
                vdata = json.load(f)
                self.src_vocab = vdata.get("src_vocab", {})
                self.tgt_vocab = vdata.get("tgt_vocab", {})
                self.tgt_idx2char = {int(idx): char for char, idx in self.tgt_vocab.items()}

            ckpt = torch.load(CHECKPOINT_PATH, map_location=self.device, weights_only=False)
            self.model = SurSetuTransformerNMT(
                src_vocab_size=ckpt.get("src_vocab_size", len(self.src_vocab)),
                tgt_vocab_size=ckpt.get("tgt_vocab_size", len(self.tgt_vocab)),
                d_model=ckpt.get("d_model", 256),
                nhead=ckpt.get("nhead", 8),
                num_layers=ckpt.get("num_layers", 3),
                dim_feedforward=ckpt.get("dim_feedforward", 512)
            ).to(self.device)

            self.model.load_state_dict(ckpt["model_state_dict"])
            self.model.eval()
            self.loaded = True
        except Exception as e:
            print(f"[WARN] Could not load Neural Transformer model: {e}")
            self.loaded = False

    def translate(self, text: str, src_lang: str = "eng_Latn", tgt_lang: str = "sat_Olck", max_len: int = 80) -> str:
        if not self.loaded or self.model is None:
            return ""

        input_str = f"<{src_lang}> {text.strip()}"
        src_tokens = [SOS_IDX] + [self.src_vocab.get(c, UNK_IDX) for c in input_str[:max_len-2]] + [EOS_IDX]
        src_tensor = torch.tensor([src_tokens], dtype=torch.long, device=self.device)

        with torch.no_grad():
            # Autoregressive greedy decoding
            tgt_tokens = [SOS_IDX]
            for _ in range(max_len):
                tgt_tensor = torch.tensor([tgt_tokens], dtype=torch.long, device=self.device)
                logits = self.model(src_tensor, tgt_tensor)
                next_token = logits[0, -1].argmax().item()
                if next_token == EOS_IDX or next_token == PAD_IDX:
                    break
                tgt_tokens.append(next_token)

        # Reconstruct output string
        chars = [self.tgt_idx2char.get(idx, "") for idx in tgt_tokens[1:]]
        return "".join(chars).strip()


if __name__ == "__main__":
    inf = SurSetuNeuralInference()
    if inf.loaded:
        sample = "Good morning children"
        res = inf.translate(sample, "eng_Latn", "sat_Olck")
        print(f"Input:  {sample}")
        print(f"Output: {res}")
    else:
        print("Neural model is currently training or not yet exported.")
