# -*- coding: utf-8 -*-
import json

memory_file = "datasets/learned_memory.json"
with open(memory_file, "r", encoding="utf-8") as f:
    data = json.load(f)

# Correct high quality translations
corrections = {
    "आँगन में लगे महुआ के पेड़ के नीचे बच्चे खेल रहे हैं।": "ᱨᱟᱪᱟ ᱨᱮ ᱢᱮᱱᱟᱜ ᱢᱟᱛᱠᱚᱢ ᱫᱟᱨᱮ ᱵᱩᱴᱟᱹ ᱨᱮ ᱜᱤᱫᱽᱨᱟᱹ ᱠᱚ ᱮᱱᱮᱡ ᱠᱟᱱᱟ ᱠᱚ᱾",
    "आँगन में लगे महुआ के पेड़ के नीचे बच्चे खेल रहे हैं": "ᱨᱟᱪᱟ ᱨᱮ ᱢᱮᱱᱟᱜ ᱢᱟᱛᱠᱚᱢ ᱫᱟᱨᱮ ᱵᱩᱴᱟᱹ ᱨᱮ ᱜᱤᱫᱽᱨᱟᱹ ᱠᱚ ᱮᱱᱮᱡ ᱠᱟᱱᱟ ᱠᱚ᱾",
    "बाज़ार से लौटते समय अचानक तेज़ आंधी और बारिश शुरू हो गई।": "ᱦᱟᱴ ᱠᱷᱚᱱ ᱨᱩᱣᱟᱹᱲ ᱚᱠᱛᱚ ᱚᱪᱠᱟ ᱜᱮ ᱟᱹᱰᱤ ᱡᱩᱨ ᱦᱩᱫᱩᱲ ᱟᱨ ᱫᱟᱜ ᱮᱦᱚᱵ ᱮᱱᱟ᱾",
    "बाज़ार से लौटते समय अचानक तेज़ आंधी और बारिश शुरू हो गई": "ᱦᱟᱴ ᱠᱷᱚᱱ ᱨᱩᱣᱟᱹᱲ ᱚᱠᱛᱚ ᱚᱪᱠᱟ ᱜᱮ ᱟᱹᱰᱤ ᱡᱩᱨ ᱦᱩᱫᱩᱲ ᱟᱨ ᱫᱟᱜ ᱮᱦᱚᱵ ᱮᱱᱟ᱾"
}

if "hin_Deva" in data:
    if "sat_Olck" in data["hin_Deva"]:
        for k, v in corrections.items():
            data["hin_Deva"]["sat_Olck"][k] = v
    if "sat_Orya" in data["hin_Deva"]:
        for k in corrections.keys():
            if k in data["hin_Deva"]["sat_Orya"]:
                del data["hin_Deva"]["sat_Orya"][k]
    if "sat_Deva" in data["hin_Deva"]:
        for k in corrections.keys():
            if k in data["hin_Deva"]["sat_Deva"]:
                del data["hin_Deva"]["sat_Deva"][k]

with open(memory_file, "w", encoding="utf-8") as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print("Successfully cleaned and updated learned_memory.json")
