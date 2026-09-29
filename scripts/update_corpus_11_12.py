# -*- coding: utf-8 -*-
with open("src/data/corpus.ts", "r", encoding="utf-8") as f:
    content = f.read()

target = "  'गाँव के मेले में दूर-दूर से लोग अपनी कलाकृतियाँ बेचने आते हैं': {\n    sat_Olck: 'ᱟᱹᱛᱩ ᱨᱮᱱᱟᱜ ᱯᱟᱛᱟ ᱨᱮ ᱥᱟᱺᱜᱤᱧᱼᱥᱟᱺᱜᱤᱧ ᱠᱷᱚᱱ ᱦᱚᱲ ᱠᱚ ᱟᱠᱚᱣᱟᱜ ᱵᱟᱰᱚᱦᱤ ᱥᱟᱯᱟᱵ ᱠᱚ ᱟᱹᱠᱷᱨᱤᱧ ᱞᱟᱹᱜᱤᱫ ᱠᱚ ᱦᱤᱡᱩᱜᱼᱟ᱾',\n    sat_Orya: 'ଆ଼ତୁ ରେନାଗ ପାତା ᱨେ ସାଁଗିᱧ-ସାଁଗିᱧ ଖନ ହଡ଼ କ ଆକୱାଗ ବାଡହି ସାପᱟବ କ ଆ଼ଖରିᱧ ଲା଼ଗᱤଦ କ ହିଜୁଗ-ଆ।',\n    sat_Deva: 'आ़तु रेनाग पाता रे साँगिञ-साँगिञ खन होड़ को आकोवाग बाडोहि सापाब को आ़खरिञ लागिद को हिजुग-आ।',\n    sat_Latn: 'atu renag pata re sanginj-sanginj khon hor ko akowag badohi sapab ko akhrijn lagid ko hijug-a.'\n  }\n};"

replacement = """  'गाँव के मेले में दूर-दूर से लोग अपनी कलाकृतियाँ बेचने आते हैं': {
    sat_Olck: 'ᱟᱹᱛᱩ ᱨᱮᱱᱟᱜ ᱯᱟᱛᱟ ᱨᱮ ᱥᱟᱺᱜᱤᱧᱼᱥᱟᱺᱜᱤᱧ ᱠᱷᱚᱱ ᱦᱚᱲ ᱠᱚ ᱟᱠᱚᱣᱟᱜ ᱵᱟᱰᱚᱦᱤ ᱥᱟᱯᱟᱵ ᱠᱚ ᱟᱹᱠᱷᱨᱤᱧ ᱞᱟᱹᱜᱤᱫ ᱠᱚ ᱦᱤᱡᱩᱜᱼᱟ᱾',
    sat_Orya: 'ଆ଼ତୁ ରେନାଗ ପାତା ᱨେ ସାଁଗିᱧ-ସାଁଗିᱧ ଖନ ହଡ଼ କ ଆକୱାଗ ବାଡହି ସାପᱟବ କ ଆ଼ଖରିᱧ ଲା଼ଗିଦ କ ହିଜୁଗ-ଆ।',
    sat_Deva: 'आ़तु रेनाग पाता रे साँगिञ-साँगिञ खन होड़ को आकोवाग बाडोहि सापाब को आ़खरिञ लागिद को हिजुग-आ।',
    sat_Latn: 'atu renag pata re sanginj-sanginj khon hor ko akowag badohi sapab ko akhrijn lagid ko hijug-a.'
  },
  'कल बहुत तेज़ बारिश हुई थी, इसलिए कल स्कूल बंद रहेगा': {
    sat_Olck: 'ᱦᱚᱞᱟ ᱟᱹᱰᱤ ᱡᱩᱨ ᱫᱟᱜ ᱡᱟᱹᱯᱩᱫ ᱦᱩᱭ ᱞᱮᱱᱟ, ᱚᱱᱟᱛᱮ ᱜᱟᱯᱟ ᱤᱛᱩᱱ ᱟᱥᱲᱟ ᱵᱚᱸᱫᱚ ᱛᱟᱦᱮᱸᱱᱟ᱾',
    sat_Orya: 'ହୋଲା ଆ଼ଡି ଜୁର ଦାଗ ଜା଼ପୁᱫ ହୁୟ ଲେନା, ଅନାତେ ଗାପା ଇତୁନ ଆସଡ଼ା ବୋନ୍ଦୋ ତାହେଁନା।',
    sat_Deva: 'होला आ़डि जुर दाग जा़पुद हुय लेना, अनाते गापा इतुन आसड़ा बोंदो ताहेँना।',
    sat_Latn: 'hola adi jur dag japud huy lena, onate gapa itun asra bondo tahena.'
  },
  'इस साल हमारे गाँव में साल के दस नए पेड़ लगाए गए': {
    sat_Olck: 'ᱱᱤᱭᱟᱹ ᱥᱮᱨᱢᱟ ᱟᱞᱮᱭᱟᱜ ᱟᱹᱛᱩ ᱨᱮ ᱥᱟᱨᱡᱚᱢ ᱨᱮᱱᱟᱜ ᱜᱮᱞ ᱜᱚᱴᱟᱝ ᱱᱟᱣᱟ ᱫᱟᱨᱮ ᱠᱚ ᱨᱚᱦᱚᱭ ᱠᱮᱫᱼᱟ᱾',
    sat_Orya: 'ନିୟା଼ ସେରମା ଆଲେୟାଗ ଆ଼ତୁ ରେ ସାରଜମ ରେନାଗ ଗେଲ ଗଟାଙ ନାୱᱟ ଦାରେ କ ରହୟ କେଦ-ଆ।',
    sat_Deva: 'निया़ सेरमा आलेयाग आ़तु रे सारजम रेनाग गेल गटां नावा दारे को रहय केद-आ।',
    sat_Latn: 'niya serma aleyag atu re sarjom renag gel gotang nawa dare ko rohoy ked-a.'
  }
};"""

idx = content.rfind("};")
if idx != -1:
    last_block = content[:idx].rstrip() + ",\n  'कल बहुत तेज़ बारिश हुई थी, इसलिए कल स्कूल बंद रहेगा': {\n    sat_Olck: 'ᱦᱚᱞᱟ ᱟᱹᱰᱤ ᱡᱩᱨ ᱫᱟᱜ ᱡᱟᱹᱯᱩᱫ ᱦᱩᱭ ᱞᱮᱱᱟ, ᱚᱱᱟᱛᱮ ᱜᱟᱯᱟ ᱤᱛᱩᱱ ᱟᱥᱲᱟ ᱵᱚᱸᱫᱚ ᱛᱟᱦᱮᱸᱱᱟ᱾',\n    sat_Orya: 'ହୋଲା ଆ଼ଡି ଜୁର ଦାଗ ଜା଼ପୁଦ ହୁୟ ଲେନା, ଅନାତେ ଗାପା ଇତୁନ ଆସଡ଼ା ବୋନ୍ଦୋ ତାହେଁନା।',\n    sat_Deva: 'होला आ़डि जुर दाग जा़पुद हुय लेना, अनाते गापा इतुन आसड़ा बोंदो ताहेँना।',\n    sat_Latn: 'hola adi jur dag japud huy lena, onate gapa itun asra bondo tahena.'\n  },\n  'इस साल हमारे गाँव में साल के दस नए पेड़ लगाए गए': {\n    sat_Olck: 'ᱱᱤᱭᱟᱹ ᱥᱮᱨᱢᱟ ᱟᱞᱮᱭᱟᱜ ᱟᱹᱛᱩ ᱨᱮ ᱥᱟᱨᱡᱚᱢ ᱨᱮᱱᱟᱜ ᱜᱮᱞ ᱜᱚᱴᱟᱝ ᱱᱟᱣᱟ ᱫᱟᱨᱮ ᱠᱚ ᱨᱚᱦᱚᱭ ᱠᱮᱫᱼᱟ᱾',\n    sat_Orya: 'ନିୟା଼ ସେରମା ଆଲେୟᱟଗ ଆ଼ତୁ ᱨᱮ ସାରଜମ ରେନାଗ ଗେଲ ଗଟାଙ ନାୱᱟ ଦାରେ କ ରହୟ କେଦ-ଆ।',\n    sat_Deva: 'निया़ सेरमा आलेयाग आ़तु रे सारजम रेनाग गेल गटां नावा दारे को रहय केद-आ।',\n    sat_Latn: 'niya serma aleyag atu re sarjom renag gel gotang nawa dare ko rohoy ked-a.'\n  }\n};\n"
    with open("src/data/corpus.ts", "w", encoding="utf-8") as f:
        f.write(last_block)
    print("Updated src/data/corpus.ts successfully!")
else:
    print("Could not find };")
