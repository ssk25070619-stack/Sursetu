import React, { useState } from 'react';
import { X, Sparkles, Check, BookPlus, Trash2 } from 'lucide-react';
import { saveLearnedWord, loadLearnedWords, refreshVocabTrie, LearnedWord } from '../engine/nlpEngine';

interface DynamicLearnModalProps {
  isOpen: boolean;
  onClose: () => void;
  onWordAdded: () => void;
}

export const DynamicLearnModal: React.FC<DynamicLearnModalProps> = ({
  isOpen,
  onClose,
  onWordAdded
}) => {
  const [hindi, setHindi] = useState('');
  const [santaliOlchiki, setSantaliOlchiki] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [learnedList, setLearnedList] = useState<LearnedWord[]>(loadLearnedWords());

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!hindi.trim() || !santaliOlchiki.trim()) return;

    saveLearnedWord(hindi, santaliOlchiki);
    refreshVocabTrie();

    setSuccessMsg(`Successfully learned: "${hindi}" ➔ "${santaliOlchiki}"!`);
    setHindi('');
    setSantaliOlchiki('');
    setLearnedList(loadLearnedWords());
    onWordAdded();

    setTimeout(() => {
      setSuccessMsg('');
    }, 2800);
  };

  const handleClearHistory = () => {
    localStorage.removeItem('sursetu_setu_learned_words_v1');
    refreshVocabTrie();
    setLearnedList([]);
    onWordAdded();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-lg shadow-2xl p-6 sm:p-8 space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Dynamic Edge Memory</h3>
              <p className="text-xs text-slate-400">Continuous Vocabulary Learning (Layer 3)</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Success Alert */}
        {successMsg && (
          <div className="p-3 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs font-semibold flex items-center gap-2">
            <Check className="w-4 h-4" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">
              Hindi or English Word / Phrase
            </label>
            <input
              type="text"
              required
              value={hindi}
              onChange={(e) => setHindi(e.target.value)}
              placeholder="e.g. स्मार्टफोन, कंप्यूटर, बैग..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">
              Santali Translation (Ol Chiki ᱚᱞ ᱪᱤᱠᱤ)
            </label>
            <input
              type="text"
              required
              value={santaliOlchiki}
              onChange={(e) => setSantaliOlchiki(e.target.value)}
              placeholder="e.g. ᱥᱢᱟᱨᱴᱯᱷᱚᱱ (Smart phone)..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm font-olchiki text-emerald-300 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-600 to-emerald-600 hover:from-amber-500 hover:to-emerald-500 text-white font-semibold text-xs tracking-wider uppercase transition shadow-lg shadow-amber-900/40 cursor-pointer flex items-center justify-center gap-2"
          >
            <BookPlus className="w-4 h-4" />
            <span>Register Word into Edge Memory</span>
          </button>
        </form>

        {/* Recently Learned Words History */}
        <div className="pt-2 border-t border-slate-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-400 font-semibold">
              Learned Local Words ({learnedList.length})
            </span>
            {learnedList.length > 0 && (
              <button
                onClick={handleClearHistory}
                className="text-[11px] text-red-400 hover:text-red-300 transition cursor-pointer flex items-center gap-1"
              >
                <Trash2 className="w-3 h-3" />
                <span>Clear</span>
              </button>
            )}
          </div>

          <div className="max-h-36 overflow-y-auto space-y-1.5 pr-1">
            {learnedList.length > 0 ? (
              learnedList.map((item, idx) => (
                <div
                  key={idx}
                  className="p-2 rounded-lg bg-slate-950 border border-slate-800/80 flex items-center justify-between text-xs"
                >
                  <span className="text-slate-300">{item.hindi}</span>
                  <span className="text-emerald-300 font-bold font-olchiki">
                    {item.santali_olchiki}
                  </span>
                </div>
              ))
            ) : (
              <div className="text-xs text-slate-600 text-center py-4 italic">
                No custom words learned yet. Add above!
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
