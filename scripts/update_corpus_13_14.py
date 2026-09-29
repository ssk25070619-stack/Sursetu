# -*- coding: utf-8 -*-
with open("src/data/corpus.ts", "r", encoding="utf-8") as f:
    content = f.read()

idx = content.rfind("};")
if idx != -1:
    addition = """,
  'इतना महंगा सोना खरीदकर भी वह रात को चैन से सोना भूल गया': {
    sat_Olck: 'ᱩᱱᱟᱹᱜ ᱢᱟᱦᱨᱚᱜ ᱥᱚᱱᱟ ᱠᱤᱨᱤᱧ ᱠᱟᱛᱮ ᱦᱚᱸ ᱩᱱᱤ ᱧᱤᱫᱟᱹ ᱥᱩᱠ ᱛᱮ ᱡᱟᱹᱯᱤᱫ ᱮ ᱦᱤᱲᱤᱧ ᱠᱮᱫᱼᱟ᱾',
    sat_Orya: 'ଉନା଼ଗ ମାହରଗ ସନା କିରିᱧ କାତେ ହଁ ଉନି ଞିଦା଼ ସୁକ ତେ ଜା଼ପିଦ ଏ ହିଡ଼ିᱧ କେଦ-ଆ।',
    sat_Deva: 'उना़ग माह्रोग सोना किरिञ काते हों उनि ञिदा़ सुक ते जा़पिद ए हिड़िञ केद-आ।',
    sat_Latn: 'unag mahrog sona kirinj kate hon uni nyida suk te japid e hirin ked-a.'
  },
  'यह कोई आम बात नहीं है कि इस मौसम में इतने मीठे आम मिल रहे हैं': {
    sat_Olck: 'ᱱᱚᱶᱟ ᱫᱚ ᱡᱟᱦᱟᱸᱱ ᱥᱟᱫᱷᱟᱨᱚᱱ ᱠᱟᱛᱷᱟ ᱵᱟᱝ ᱠᱟᱱᱟ ᱡᱮ ᱱᱤᱭᱟᱹ ᱨᱤᱛᱩ ᱨᱮ ᱩᱱᱟᱹᱜ ᱦᱮᱲᱮᱢ ᱩᱞ ᱧᱟᱢᱚᱜ ᱠᱟᱱᱟ᱾',
    sat_Orya: 'ନୋୱା ଦ ଜାହାଁନ ସାଧାରନ କାଥା ବାଙ କାନା ଜେ ନିୟା଼ ରିତୁ ରେ ଉନା଼ଗ ହେଡ଼େମ ଉଲ ଞାମଗ କାନା।',
    sat_Deva: 'नोवा दो जाहाँन साधारोन काथा बां काना जे निया़ रितु रे उना़ग हेड़ेम उल ञामोग काना।',
    sat_Latn: 'nowa do jahan sadharon katha bang kana je niya ritu re unag herem ul nyamog kana.'
  }
};
"""
    new_content = content[:idx].rstrip() + addition
    with open("src/data/corpus.ts", "w", encoding="utf-8") as f:
        f.write(new_content)
    print("Updated src/data/corpus.ts with Sentences 13 & 14!")
