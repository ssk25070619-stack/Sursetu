# -*- coding: utf-8 -*-
"""
Updater script for translation_engine.py and nlpEngine.ts
"""
import re

LEXICON_BLOCK = '''GRAMMAR_LEXICON = {
    # Pronouns (Hindi -> {Ol Chiki, Odia, Deva, Eng})
    "मैं": {"ol": "ᱤᱧ", "odia": "ଇଞ", "deva": "इञ", "eng": "i"},
    "मुझे": {"ol": "ᱤᱧ", "odia": "ଇଞ", "deva": "इञ", "eng": "me"},
    "मेरा": {"ol": "ᱤᱧᱟᱜ", "odia": "ଇଞାଗ", "deva": "इञाग", "eng": "my"},
    "मेरी": {"ol": "ᱤᱧᱟᱜ", "odia": "ଇଞାଗ", "deva": "इञाग", "eng": "my"},
    "मेरे": {"ol": "ᱤᱧᱟᱜ", "odia": "ଇଞାଗ", "deva": "इञाग", "eng": "my"},
    "हम": {"ol": "ᱟᱵᱚ", "odia": "ଆବୋ", "deva": "आबो", "eng": "we"},
    "हमारा": {"ol": "ᱟᱞᱮᱭᱟᱜ", "odia": "ଆଲେୟᱟଗ", "deva": "आलेयाग", "eng": "our"},
    "हमारी": {"ol": "ᱟᱞᱮᱭᱟᱜ", "odia": "ଆଲେୟᱟଗ", "deva": "आलेयाग", "eng": "our"},
    "हमारे": {"ol": "ᱟᱞᱮᱭᱟᱜ", "odia": "ଆଲେୟᱟଗ", "deva": "आलेयाग", "eng": "our"},
    "हमारे गाँव": {"ol": "ᱟᱞᱮᱭᱟᱜ ᱟᱹᱛᱩ", "odia": "ଆଲେୟᱟଗ ଆତୁ", "deva": "आलेयाग आतु", "eng": "our village"},
    "हमारा गाँव": {"ol": "ᱟᱞᱮᱭᱟᱜ ᱟᱹᱛᱩ", "odia": "ଆଲେୟᱟଗ ଆତୁ", "deva": "आलेयाग आतु", "eng": "our village"},
    "तुम": {"ol": "ᱟᱢ", "odia": "ଆᱢ", "deva": "आम", "eng": "you"},
    "आप": {"ol": "ᱟᱢ", "odia": "ଆᱢ", "deva": "आम", "eng": "you"},
    "तुम्हारा": {"ol": "ᱟᱢᱟᱜ", "odia": "ଆᱢᱟଗ", "deva": "आमाग", "eng": "your"},
    "तुम्हारी": {"ol": "ᱟᱢᱟᱜ", "odia": "ଆᱢᱟଗ", "deva": "आमाग", "eng": "your"},
    "तुम्हारे": {"ol": "ᱟᱢᱟᱜ", "odia": "ଆᱢᱟᱜ", "deva": "आमाग", "eng": "your"},
    "आपका": {"ol": "ᱟᱢᱟᱜ", "odia": "ଆᱢᱟଗ", "deva": "आमाग", "eng": "your"},
    "आपकी": {"ol": "ᱟᱢᱟᱜ", "odia": "ଆᱢᱟଗ", "deva": "आमाग", "eng": "your"},
    "आपके": {"ol": "ᱟᱢᱟᱜ", "odia": "ଆᱢᱟଗ", "deva": "आमाग", "eng": "your"},
    "आप लोग": {"ol": "ᱟᱯᱮ", "odia": "ଆପେ", "deva": "आपे", "eng": "you all"},
    "तुम लोग": {"ol": "ᱟᱯᱮ", "odia": "ଆᱯᱮ", "deva": "आपे", "eng": "you all"},
    "वह": {"ol": "ᱩᱱᱤ", "odia": "ଉନି", "deva": "उनि", "eng": "he/she"},
    "उसका": {"ol": "ᱩᱱᱤᱭᱟᱜ", "odia": "ଉନିୟᱟଗ", "deva": "उनियाग", "eng": "his/her"},
    "उसकी": {"ol": "ᱩᱱᱤᱭᱟᱜ", "odia": "ଉନᱤୟᱟଗ", "deva": "उनियाग", "eng": "his/her"},
    "उसके": {"ol": "ᱩᱱᱤᱭᱟᱜ", "odia": "ଉନᱤୟᱟଗ", "deva": "उनियाग", "eng": "his/her"},
    "वे": {"ol": "ᱩᱱᱠᱩ", "odia": "ଉନକୁ", "deva": "उनकु", "eng": "they"},
    "उनका": {"ol": "ᱩᱱᱠᱩᱣᱟᱜ", "odia": "ଉନକୁୱᱟଗ", "deva": "उनकुवाग", "eng": "their"},
    "उनकी": {"ol": "ᱩᱱᱠᱩᱣᱟᱜ", "odia": "ଉନକୁୱᱟଗ", "deva": "उनकुवाग", "eng": "their"},
    "उनके": {"ol": "ᱩᱱᱠᱩᱣᱟᱜ", "odia": "ଉନକୁୱᱟଗ", "deva": "उनकुवाग", "eng": "their"},
    "यह": {"ol": "ᱱᱚᱶᱟ", "odia": "ନୋୱା", "deva": "नोवा", "eng": "this"},
    "ये": {"ol": "ᱱᱚᱶᱟ ᱠᱚ", "odia": "ନୋୱା କୋ", "deva": "नोवा को", "eng": "these"},
    "वो": {"ol": "ᱦᱟᱱᱟ", "odia": "ᱦᱟᱱᱟ", "deva": "हाना", "eng": "that"},
    "वे सब": {"ol": "ᱚᱱᱟ ᱠᱚ", "odia": "ଅନା କୋ", "deva": "अना को", "eng": "those"},

    # Interrogatives (Questions)
    "क्या": {"ol": "ᱪᱮᱫ", "odia": "ଚେଦ", "deva": "चेद", "eng": "what"},
    "कौन": {"ol": "ᱚᱠᱚᱭ", "odia": "ଅକୋୟ", "deva": "अकोय", "eng": "who"},
    "कहाँ": {"ol": "ᱚᱠᱟᱨᱮ", "odia": "ଅକାରᱮ", "deva": "अकारे", "eng": "where"},
    "कहा": {"ol": "ᱚᱠᱟᱨᱮ", "odia": "ଅକାରᱮ", "deva": "अकारे", "eng": "where"},
    "क्यों": {"ol": "ᱪᱮᱫᱟᱜ", "odia": "ᱪᱮଦᱟଗ", "deva": "चेदाग", "eng": "why"},
    "कब": {"ol": "ᱛᱤᱥ", "odia": "ତିସ", "deva": "तिस", "eng": "when"},
    "कैसे": {"ol": "ᱪᱮᱫ ᱞᱮᱠᱟ", "odia": "ଚେଦ ଲେକା", "deva": "चेद लेका", "eng": "how"},
    "कैसा": {"ol": "ᱪᱮᱫ ᱞᱮᱠᱟ", "odia": "ଚେଦ ଲେକᱟ", "deva": "चेद लेका", "eng": "how"},
    "कितना": {"ol": "ᱛᱤᱱᱟᱹᱜ", "odia": "ତିନାଗ", "deva": "तिनाग", "eng": "how much"},
    "कितने": {"ol": "ᱛᱤᱱᱟᱹᱜ", "odia": "ତିନାଗ", "deva": "तिनाग", "eng": "how many"},

    # Multi-Word Locative & Spatial Expressions
    "के चारों ओर": {"ol": "ᱵᱮᱲᱦᱟᱭ ᱛᱮ", "odia": "ବେଡ଼ହାୟ ତେ", "deva": "बेड़हाय ते", "eng": "around"},
    "चारों ओर": {"ol": "ᱵᱮᱲᱦᱟᱭ ᱛᱮ", "odia": "ବେଡ଼ହାୟ ତେ", "deva": "बेड़हाय ते", "eng": "all around"},
    "चारों तरफ": {"ol": "ᱵᱮᱲᱦᱟᱭ ᱛᱮ", "odia": "ବେଡ଼ହାୟ ତେ", "deva": "बेड़हाय ते", "eng": "all sides"},
    "के चारों तरफ": {"ol": "ᱵᱮᱲᱦᱟᱭ ᱛᱮ", "odia": "ବᱮଡ଼ହାୟ ତେ", "deva": "बेड़हाय ते", "eng": "all around"},
    "हरे-भरे": {"ol": "ᱦᱟᱹᱨᱭᱟᱹᱲ", "odia": "ହାରୟାଡ଼", "deva": "हारयाड़", "eng": "lush green"},
    "हरा-भरा": {"ol": "ᱦᱟᱹᱨᱭᱟᱹᱲ", "odia": "ହାରୟାଡ଼", "deva": "हारयाड़", "eng": "lush green"},
    "हरा भरा": {"ol": "ᱦᱟᱹᱨᱭᱟᱹᱲ", "odia": "ହାରୟᱟଡ଼", "deva": "हारयाड़", "eng": "green"},
    "हरे भरे": {"ol": "ᱦᱟᱹᱨᱭᱟᱹᱲ", "odia": "ହାରୟᱟଡ଼", "deva": "हारयाड़", "eng": "green"},
    "हरा": {"ol": "ᱦᱟᱹᱨᱭᱟᱹᱲ", "odia": "ହାରୟᱟଡ଼", "deva": "हारयाड़", "eng": "green"},
    "हरी": {"ol": "ᱦᱟᱹᱨᱭᱟᱹᱲ", "odia": "ହାରୟᱟଡ଼", "deva": "हारयाड़", "eng": "green"},
    "पहाड़": {"ol": "ᱵᱩᱨᱩ", "odia": "ବୁᱨᱩ", "deva": "बुरु", "eng": "mountain"},
    "पहाड़": {"ol": "ᱵᱩᱨᱩ", "odia": "ବୁᱨᱩ", "deva": "बुरु", "eng": "mountain"},
    "पहाड़ और": {"ol": "ᱵᱩᱨᱩ ᱟᱨ", "odia": "ବୁᱨᱩ ଆᱨ", "deva": "बुरु आर", "eng": "mountains and"},
    "पहाड़ और": {"ol": "ᱵᱩᱨᱩ ᱟᱨ", "odia": "ବᱩᱨᱩ ଆᱨ", "deva": "बुरु आर", "eng": "mountains and"},
    "घने जंगल": {"ol": "ᱜᱟᱡᱟᱲ ᱵᱤᱨ", "odia": "ଗାଜାଡ଼ ବୀର", "deva": "गाजाड़ बीर", "eng": "dense forests"},
    "घना जंगल": {"ol": "ᱜᱟᱡᱟᱲ ᱵᱤᱨ", "odia": "ଗାଜାଡ଼ ବୀର", "deva": "गाजाड़ बीर", "eng": "dense forest"},
    "घने": {"ol": "ᱜᱟᱡᱟᱲ", "odia": "ଗାଜାଡ଼", "deva": "गाजाड़", "eng": "dense"},
    "घना": {"ol": "ᱜᱟᱡᱟᱲ", "odia": "ଗᱟଜାଡ଼", "deva": "गाजाड़", "eng": "dense"},
    "जंगल": {"ol": "ᱵᱤᱨ", "odia": "ବୀର", "deva": "बीर", "eng": "forest"},
    "वन": {"ol": "ᱵᱤᱨ", "odia": "ବୀର", "deva": "बीर", "eng": "forest"},

    # Farmers, Dawn & Agriculture
    "किसान": {"ol": "ᱪᱟᱹᱥᱤ", "odia": "ଚାସି", "deva": "चासि", "eng": "farmer"},
    "किसानों": {"ol": "ᱪᱟᱹᱥᱤ ᱠᱚ", "odia": "ଚାସି କୋ", "deva": "चासि को", "eng": "farmers"},
    "किसान लोग": {"ol": "ᱪᱟᱹᱥᱤ ᱠᱚ", "odia": "ଚᱟସି କୋ", "deva": "चासि को", "eng": "farmers"},
    "किसान सब": {"ol": "ᱪᱟᱹᱥᱤ ᱠᱚ", "odia": "ଚᱟସି କୋ", "deva": "चासि को", "eng": "farmers"},
    "सुबह": {"ol": "ᱥᱮᱛᱟᱜ", "odia": "ᱥᱮତାଗ", "deva": "सेताग", "eng": "morning"},
    "सूरज": {"ol": "ᱵᱮᱲᱟ", "odia": "ᱵᱮଡ଼ᱟ", "deva": "बेड़ा", "eng": "sun"},
    "सूर्य": {"ol": "ᱵᱮᱲᱟ", "odia": "ᱵᱮଡ଼ᱟ", "deva": "बेड़ा", "eng": "sun"},
    "सूरज उगने से पहले ही": {"ol": "ᱵᱮᱲᱟ ᱨᱟᱠᱟᱵ ᱞᱟᱦᱟ ᱨᱮᱜᱮ", "odia": "ବେଡ଼ା ରାକାବ ଲାହା ᱨᱮଗେ", "deva": "बेड़ा राकाब लाहा रेगे", "eng": "before sunrise itself"},
    "सूर्य उगने से पहले ही": {"ol": "ᱵᱮᱲᱟ ᱨᱟᱠᱟᱵ ᱞᱟᱦᱟ ᱨᱮᱜᱮ", "odia": "ବେଡ଼ା ରାକାବ ଲାହା ᱨᱮଗେ", "deva": "बेड़ा राकाब लाहा रेगे", "eng": "before sunrise itself"},
    "सूरज उगने से पहले": {"ol": "ᱵᱮᱲᱟ ᱨᱟᱠᱟᱵ ᱞᱟᱦᱟ ᱨᱮ", "odia": "ବେଡ଼ା ରାକାବ ଲାହା ᱨᱮ", "deva": "बेड़ा राकाब लाहा रे", "eng": "before sunrise"},
    "सूर्य उगने से पहले": {"ol": "ᱵᱮᱲᱟ ᱨᱟᱠᱟᱵ ᱞᱟᱦᱟ ᱨᱮ", "odia": "ବେଡ଼ᱟ ରାକାବ ଲାହା ᱨᱮ", "deva": "बेड़ा राकाब लाहा रे", "eng": "before sunrise"},
    "उगने से पहले ही": {"ol": "ᱨᱟᱠᱟᱵ ᱞᱟᱦᱟ ᱨᱮᱜᱮ", "odia": "ରାକᱟବ ଲାହା ᱨᱮଗେ", "deva": "राकाब लाहा रेगे", "eng": "before rising"},
    "उगने से पहले": {"ol": "ᱨᱟᱠᱟᱵ ᱞᱟᱦᱟ ᱨᱮ", "odia": "ରାକᱟବ ଲାହା ᱨᱮ", "deva": "राकाब लाहा रे", "eng": "before rising"},
    "पहले ही": {"ol": "ᱞᱟᱦᱟ ᱨᱮᱜᱮ", "odia": "ଲାହା ᱨᱮଗେ", "deva": "लाहा रेगे", "eng": "already / prior"},
    "पहले": {"ol": "ᱞᱟᱦᱟ ᱨᱮ", "odia": "ଲାହା ᱨᱮ", "deva": "लाहा रे", "eng": "before / earlier"},
    "खेतों में": {"ol": "ᱵᱟᱹᱫᱽ ᱨᱮ", "odia": "ବାଦ ରେ", "deva": "बाद रे", "eng": "in fields"},
    "खेत में": {"ol": "ᱵᱟᱹᱫᱽ ᱨᱮ", "odia": "ବାଦ ରେ", "deva": "बाद रे", "eng": "in the field"},
    "खेत": {"ol": "ᱵᱟᱹᱫᱽ", "odia": "ବାଦ", "deva": "बाद", "eng": "field"},
    "खेतों": {"ol": "ᱵᱟᱹᱫᱽ ᱠᱚ", "odia": "ବାଦ କୋ", "deva": "बाद को", "eng": "fields"},
    "काम करने के लिए": {"ol": "ᱠᱟᱹᱢᱤ ᱞᱟᱹᱜᱤᱫ", "odia": "କାମି ଲାଗିଦ", "deva": "कामि लागिद", "eng": "to work"},
    "काम करने": {"ol": "ᱠᱟᱹᱢᱤ ᱞᱟᱹᱜᱤᱫ", "odia": "କାମି ଲାଗିଦ", "deva": "कामि लागिद", "eng": "to work"},
    "काम करना": {"ol": "ᱠᱟᱹᱢᱤ", "odia": "କାମି", "deva": "कामि", "eng": "work"},
    "काम": {"ol": "ᱠᱟᱹᱢᱤ", "odia": "କାମᱤ", "deva": "कामि", "eng": "work"},
    "चले गए": {"ol": "ᱠᱚ ᱪᱟᱞᱟᱣ ᱮᱱᱟ", "odia": "କୋ ଚାଲାୱ ଏନା", "deva": "को चालाव एना", "eng": "went"},
    "चले गये": {"ol": "ᱠᱚ ᱪᱟᱞᱟᱣ ᱮᱱᱟ", "odia": "କୋ ଚାଲାୱ ଏନା", "deva": "को चालाव एना", "eng": "went"},
    "चला गया": {"ol": "ᱪᱟᱞᱟᱣ ᱮᱱᱟ", "odia": "ᱪାଲାୱ ଏନା", "deva": "चालाव एना", "eng": "went"},

    # Water, River, Clarity & Perception
    "नदी": {"ol": "ᱜᱟᱰᱟ", "odia": "ଗାଡ଼ା", "deva": "गाड़ा", "eng": "river"},
    "नदियाँ": {"ol": "ᱜᱟᱰᱟ ᱠᱚ", "odia": "ଗାଡ଼ା କୋ", "deva": "गाड़ा को", "eng": "rivers"},
    "नदी का": {"ol": "ᱜᱟᱰᱟ ᱨᱮᱱᱟᱜ", "odia": "ଗାଡ଼ା ରେନାଗ", "deva": "गाड़ा रेनाग", "eng": "river's"},
    "नदी की": {"ol": "ᱜᱟᱰᱟ ᱨᱮᱱᱟᱜ", "odia": "ଗାଡ଼ା ରେନାଗ", "deva": "गाड़ा रेनाग", "eng": "river's"},
    "नदी के": {"ol": "ᱜᱟᱰᱟ ᱨᱮᱱ", "odia": "ଗାଡ଼ା ରିଣ", "deva": "गाड़ा रेन", "eng": "river's"},
    "पानी": {"ol": "ᱫᱟᱜ", "odia": "ᱫᱟଗ", "deva": "दाग", "eng": "water"},
    "जल": {"ol": "ᱫᱟᱜ", "odia": "ᱫᱟᱜ", "deva": "दाग", "eng": "water"},
    "इतना": {"ol": "ᱩᱱᱟᱹᱜ", "odia": "ଉନାଗ", "deva": "उनाग", "eng": "so / this much"},
    "इतनी": {"ol": "ᱩᱱᱟᱹᱜ", "odia": "ଉନାଗ", "deva": "उनाग", "eng": "so / this much"},
    "इतना साफ़": {"ol": "ᱩᱱᱟᱹᱜ ᱯᱷᱟᱨᱪᱟ", "odia": "ଉନାଗ ଫାରଚା", "deva": "उनाग फारचा", "eng": "so clear"},
    "इतना साफ": {"ol": "ᱩᱱᱟᱹᱜ ᱯᱷᱟᱨᱪᱟ", "odia": "ଉନାଗ ଫାରଚା", "deva": "उनाग फारचा", "eng": "so clean"},
    "साफ़": {"ol": "ᱯᱷᱟᱨᱪᱟ", "odia": "ଫାରଚା", "deva": "फारचा", "eng": "clean / clear"},
    "साफ": {"ol": "ᱯᱷᱟᱨᱪᱟ", "odia": "ᱯᱷାରଚା", "deva": "फारचा", "eng": "clean / clear"},
    "स्वच्छ": {"ol": "ᱯᱷᱟᱨᱪᱟ", "odia": "ଫାରଚା", "deva": "फारचा", "eng": "clean"},
    "था": {"ol": "ᱛᱟᱦᱮᱸ ᱠᱟᱱᱟ", "odia": "ତାହେଁ କାନା", "deva": "ताहेँ काना", "eng": "was"},
    "थी": {"ol": "ᱛᱟᱦᱮᱸ ᱠᱟᱱᱟ", "odia": "ତାହେଁ କାନᱟ", "deva": "ताहेँ काना", "eng": "was"},
    "थे": {"ol": "ᱛᱟᱦᱮᱸ ᱠᱟᱱᱟ", "odia": "ତାହେଁ କାନା", "deva": "ताहेँ काना", "eng": "were"},
    "कि": {"ol": "ᱡᱮ", "odia": "ଜେ", "deva": "जे", "eng": "that"},
    "नीचे": {"ol": "ᱞᱟᱛᱟᱨ", "odia": "ଲାତାର", "deva": "लातार", "eng": "below / bottom"},
    "नीचे के": {"ol": "ᱞᱟᱛᱟᱨ ᱨᱮᱱᱟᱜ", "odia": "ଲାତାର ରେନାଗ", "deva": "लातार रेनाग", "eng": "of the bottom"},
    "नीचे का": {"ol": "ᱞᱟᱛᱟᱨ ᱨᱮᱱᱟᱜ", "odia": "ଲାତାର ରେନାଗ", "deva": "लातार रेनाग", "eng": "of the bottom"},
    "पत्थर": {"ol": "ᱫᱷᱤᱨᱤ", "odia": "ଧିରି", "deva": "धिरि", "eng": "stone"},
    "पत्थर सब": {"ol": "ᱫᱷᱤᱨᱤ ᱠᱚ", "odia": "ଧିରି କୋ", "deva": "धिरि को", "eng": "stones"},
    "पत्थरों": {"ol": "ᱫᱷᱤᱨᱤ ᱠᱚ", "odia": "ଧିରି କୋ", "deva": "धिरि को", "eng": "stones"},
    "साफ़ दिखाई दे रहे थे": {"ol": "ᱯᱩᱥᱴᱟᱹᱣ ᱧᱮᱞᱚᱜ ᱠᱟᱱ ᱛᱟᱦᱮᱸ ᱠᱟᱱᱟ", "odia": "ପୁଷ୍ଟାୱ ଞେଲୋଗ କାନ ତାହେଁ କାନା", "deva": "पुष्टाव ञेलोग कान ताहेँ काना", "eng": "were clearly visible"},
    "साफ़ दिखाई दे रहे थे": {"ol": "ᱯᱩᱥᱴᱟᱹᱣ ᱧᱮᱞᱚᱜ ᱠᱟᱱ ᱛᱟᱦᱮᱸ ᱠᱟᱱᱟ", "odia": "ପୁଷ୍ଟᱟୱ ଞେଲୋଗ କାନ ତାହେଁ କାନᱟ", "deva": "पुष्टाव ञेलोग कान ताहेँ काना", "eng": "were clearly visible"},
    "दिखाई दे रहे थे": {"ol": "ᱧᱮᱞᱚᱜ ᱠᱟᱱ ᱛᱟᱦᱮᱸ ᱠᱟᱱᱟ", "odia": "ଞେଲୋଗ କାନ ତାହେଁ କାନା", "deva": "ञेलोग कान ताहेँ काना", "eng": "were visible"},
    "दिखाई दे रहा था": {"ol": "ᱧᱮᱞᱚᱜ ᱠᱟᱱ ᱛᱟᱦᱮᱸ ᱠᱟᱱᱟ", "odia": "ଞେଲୋଗ କାନ ତାହେଁ କାନା", "deva": "ञेलोग कान ताहेँ काना", "eng": "was visible"},
    "दिखाई देना": {"ol": "ᱧᱮᱞᱚᱜ", "odia": "ଞେଲୋଗ", "deva": "ञेलोग", "eng": "appear / visible"},
    "दिखना": {"ol": "ᱧᱮᱞᱚᱜ", "odia": "ଞେଲୋଗ", "deva": "ञेलोग", "eng": "appear"},
    "स्पष्ट": {"ol": "ᱯᱩᱥᱴᱟᱹᱣ", "odia": "ପୁଷ୍ଟᱟୱ", "deva": "पुष्टाव", "eng": "clearly"},

    # Season, Rain & Harvest
    "इस बार": {"ol": "ᱱᱤᱭᱟᱹ ᱫᱷᱟᱣ", "odia": "ନିୟା ଧାୱ", "deva": "निया धाव", "eng": "this time"},
    "इस समय": {"ol": "ᱱᱤᱭᱟᱹ ᱚᱠᱛᱚ", "odia": "ନିୟା ଅକ୍ତୋ", "deva": "निया अक्तो", "eng": "this time"},
    "अच्छी बारिश": {"ol": "ᱱᱟᱯᱟᱭ ᱫᱟᱜ", "odia": "ନାପାୟ ଦାଗ", "deva": "नापाय दाग", "eng": "good rain"},
    "अच्छा बारिश": {"ol": "ᱱᱟᱯᱟᱭ ᱫᱟᱜ", "odia": "ନାପାୟ ଦᱟଗ", "deva": "नापाय दाग", "eng": "good rain"},
    "बारिश": {"ol": "ᱫᱟᱜ", "odia": "ᱫᱟᱜ", "deva": "दाग", "eng": "rain"},
    "वर्षा": {"ol": "ᱫᱟᱜ", "odia": "ᱫᱟᱜ", "deva": "दाग", "eng": "rain"},
    "बरसात": {"ol": "ᱫᱟᱜ", "odia": "ᱫᱟᱜ", "deva": "दाग", "eng": "rain"},
    "होने के कारण": {"ol": "ᱦᱩᱭ ᱮᱱ ᱠᱷᱟᱹᱛᱤᱨ", "odia": "ᱦᱩୟ ଏନ ଖାତିᱨ", "deva": "हुय एन खातिर", "eng": "due to happening"},
    "होने से": {"ol": "ᱦᱩᱭ ᱮᱱ ᱠᱷᱟᱹᱛᱤᱨ", "odia": "ᱦᱩୟ ଏନ ଖାତିᱨ", "deva": "हुय एन खातिर", "eng": "because of"},
    "के कारण": {"ol": "ᱠᱷᱟᱹᱛᱤᱨ", "odia": "ଖାତିᱨ", "deva": "खातिर", "eng": "because of"},
    "के चलते": {"ol": "ᱠᱷᱟᱹᱛᱤᱨ", "odia": "ଖାତିᱨ", "deva": "खातिर", "eng": "due to"},
    "धान": {"ol": "ᱦᱳᱲᱳ", "odia": "ᱦୋଡ଼ୋ", "deva": "होड़ो", "eng": "paddy / rice crop"},
    "धान की फ़सल": {"ol": "ᱦᱳᱲᱳ ᱨᱮᱱᱟᱜ ᱯᱷᱚᱥᱚᱞ", "odia": "ᱦୋଡ଼ୋ ରେନାଗ ଫସଲ", "deva": "होड़ो रेनाग फसल", "eng": "paddy crop"},
    "धान की फसल": {"ol": "ᱦᱳᱲᱳ ᱨᱮᱱᱟᱜ ᱯᱷᱚᱥᱚᱞ", "odia": "ᱦୋଡ଼ୋ ରେନାଗ ଫସଲ", "deva": "होड़ो रेनाग फसल", "eng": "paddy crop"},
    "फ़सल": {"ol": "ᱯᱷᱚᱥᱚᱞ", "odia": "ଫସଲ", "deva": "फसल", "eng": "crop"},
    "फसल": {"ol": "ᱯᱷᱚᱥᱚᱞ", "odia": "ଫସଲ", "deva": "फसल", "eng": "crop"},
    "उपज": {"ol": "ᱟᱨᱡᱟᱣ", "odia": "ଆᱨᱡᱟୱ", "deva": "आरजाव", "eng": "harvest / yield"},
    "बहुत अच्छी": {"ol": "ᱟᱹᱰᱤ ᱱᱟᱯᱟᱭ", "odia": "ଆଡ଼ᱤ ନᱟପାୟ", "deva": "आड़ि नापाय", "eng": "very good"},
    "बहुत अच्छा": {"ol": "ᱟᱹᱰᱤ ᱱᱟᱯᱟᱭ", "odia": "ଆଡ଼ᱤ ନᱟପାୟ", "deva": "आड़ि नापाय", "eng": "very good"},
    "हुई है": {"ol": "ᱦᱩᱭ ᱟᱠᱟᱱᱟ", "odia": "ᱦᱩୟ ଆକାନା", "deva": "हुय आकाना", "eng": "has happened"},
    "हुआ है": {"ol": "ᱦᱩᱭ ᱟᱠᱟᱱᱟ", "odia": "ᱦᱩୟ ଆକାନᱟ", "deva": "हुय आकाना", "eng": "has happened"},

    # Common Conjunctions & Adverbs
    "और": {"ol": "ᱟᱨ", "odia": "ଆᱨ", "deva": "आर", "eng": "and"},
    "तथा": {"ol": "ᱟᱨ", "odia": "ଆᱨ", "deva": "आर", "eng": "and"},
    "लेकिन": {"ol": "ᱢᱮᱱᱠᱷᱟᱱ", "odia": "ᱢᱮᱱଖାନ", "deva": "मेनखान", "eng": "but"},
    "परंतु": {"ol": "ᱢᱮᱱᱠᱷᱟᱱ", "odia": "ᱢᱮᱱଖାନ", "deva": "मेनखान", "eng": "but"},
    "भी": {"ol": "ᱦᱚᱸ", "odia": "ᱦୋଁ", "deva": "हों", "eng": "also"},
    "यहाँ": {"ol": "ᱱᱚᱸᱰᱮ", "odia": "ନୋନ୍ଦେ", "deva": "नोंडे", "eng": "here"},
    "वहाँ": {"ol": "ᱦᱟᱸᱰᱮ", "odia": "ᱦᱟନ୍ଦେ", "deva": "हांडे", "eng": "there"},
    "आज": {"ol": "ᱛᱮᱦᱮᱧ", "odia": "ᱛᱮᱦᱮଞ", "deva": "तेहेञ", "eng": "today"},
    "कल": {"ol": "ᱜᱟᱯᱟ", "odia": "ଗାପᱟ", "deva": "गापा", "eng": "tomorrow"},
    "बीता कल": {"ol": "ᱦᱚᱞᱟ", "odia": "ᱦୋଲା", "deva": "होला", "eng": "yesterday"},
    "अभी": {"ol": "ᱱᱤᱛᱚᱜ", "odia": "ᱱᱤᱛᱚᱜ", "deva": "नितोग", "eng": "now"},
    "अच्छा": {"ol": "ᱵᱷᱟᱹᱜᱤ", "odia": "ଭାଗି", "deva": "भागि", "eng": "good"},
    "अच्छी": {"ol": "ᱱᱟᱯᱟᱭ", "odia": "ନାପାୟ", "deva": "नापाय", "eng": "good"},
    "बहुत": {"ol": "ᱟᱹᱰᱤ", "odia": "ଆଡ଼ᱤ", "deva": "आड़ि", "eng": "very"},
    "सुंदर": {"ol": "ᱪᱚᱨᱚᱠ", "odia": "ᱪୋᱨᱚᱠ", "deva": "चोरोक", "eng": "beautiful"},
    "गाँव": {"ol": "ᱟᱹᱛᱩ", "odia": "ଆତୁ", "deva": "आतु", "eng": "village"},
    "घर": {"ol": "ᱚᱲᱟᱜ", "odia": "ଅଡ଼ᱟଗ", "deva": "अड़ाग", "eng": "house"},
    "स्कूल": {"ol": "ᱤᱛᱩᱱ ᱟᱥᱲᱟ", "odia": "ଇତୁନ ଆସଡ଼ା", "deva": "इतुन आसड़ा", "eng": "school"},

    # Core Action Verbs & Imperatives
    "खोलो": {"ol": "ᱡᱷᱤᱡᱽ ᱢᱮ", "odia": "ଝିଜ ମେ", "deva": "झिज मे", "eng": "open"},
    "खोलना": {"ol": "ᱡᱷᱤᱡᱽ", "odia": "ଝିᱡ", "deva": "झिज", "eng": "open"},
    "बंद करो": {"ol": "ᱵᱚᱸᱫᱽ ᱢᱮ", "odia": "ବନ୍ଦ ମେ", "deva": "बंद मे", "eng": "close"},
    "पढ़ो": {"ol": "ᱯᱟᱲᱦᱟᱣ ᱢᱮ", "odia": "ପାଡ଼ହାୱ ମେ", "deva": "पाड़हाव मे", "eng": "read"},
    "लिखो": {"ol": "ᱚᱞ ᱢᱮ", "odia": "ଅଲ ମᱮ", "deva": "अल मे", "eng": "write"},
    "बैठो": {"ol": "ᱫᱩᱲᱩᱵ ᱢᱮ", "odia": "ᱫᱩଡ଼ᱩᱵ ମେ", "deva": "दुड़ुब मे", "eng": "sit"},
    "बैठ जाओ": {"ol": "ᱫᱩᱲᱩᱵ ᱯᱮ", "odia": "ᱫᱩଡ଼ᱩᱵ ପᱮ", "deva": "दुड़ुब पे", "eng": "sit down"},
    "खड़े हो जाओ": {"ol": "ᱛᱤᱸᱜᱩᱱ ᱯᱮ", "odia": "ତିଙ୍ଗᱩନ ପᱮ", "deva": "तिंगुन पे", "eng": "stand up"},
    "आओ": {"ol": "ᱦᱤᱡᱩᱜ ᱢᱮ", "odia": "ହିᱡᱩଗ ମେ", "deva": "हिजुग मे", "eng": "come"},
    "जाओ": {"ol": "ᱥᱮᱱᱚᱜ ᱢᱮ", "odia": "ᱥᱮᱱᱚᱜ ᱢᱮ", "deva": "सेनोंग मे", "eng": "go"},
    "खाओ": {"ol": "ᱡᱚᱢ ᱢᱮ", "odia": "ᱡᱚᱢ ᱢᱮ", "deva": "जोम मे", "eng": "eat"},
    "पिओ": {"ol": "ᱧᱩᱭ ᱢᱮ", "odia": "ଞୁୟ ମᱮ", "deva": "ञुय मे", "eng": "drink"},
    "लाओ": {"ol": "ᱟᱹᱜᱩᱭ ᱢᱮ", "odia": "ଆᱜᱩୟ ମେ", "deva": "आगुय मे", "eng": "bring"},
    "देखो": {"ol": "ᱧᱮᱞ ᱢᱮ", "odia": "ଞᱮᱞ ମେ", "deva": "ञेल मे", "eng": "see / look"},
    "सुनो": {"ol": "ᱟᱸᱡᱚᱢ ᱢᱮ", "odia": "ଆଞ୍ᱡᱚᱢ ମେ", "deva": "आंजोम मे", "eng": "listen"},
    "है": {"ol": "ᱢᱮᱱᱟᱜᱼᱟ", "odia": "ᱢᱮᱱᱟᱜ-ᱟ", "deva": "मेनाग-आ", "eng": "is"},
    "हैं": {"ol": "ᱢᱮᱱᱟᱜᱼᱟ", "odia": "ᱢᱮᱱᱟᱜ-ᱟ", "deva": "मेनाग-आ", "eng": "are"},

    # Numbers & Quantities (Hindi & English -> Santali Ol Chiki, Odia, Deva)
    "zero": {"ol": "᱐", "odia": "୦", "deva": "सुन्नो", "eng": "zero"},
    "शून्य": {"ol": "᱐", "odia": "୦", "deva": "सुन्नो", "eng": "zero"},
    "एक": {"ol": "ᱢᱤᱫ", "odia": "ମିଦ", "deva": "मिद", "eng": "one"},
    "one": {"ol": "ᱢᱤᱫ", "odia": "ମିଦ", "deva": "मिद", "eng": "one"},
    "दो": {"ol": "ᱵᱟᱨ", "odia": "ବାର", "deva": "बार", "eng": "two"},
    "two": {"ol": "ᱵᱟᱨ", "odia": "ବାର", "deva": "बार", "eng": "two"},
    "तीन": {"ol": "ᱯᱮ", "odia": "ᱯᱮ", "deva": "पे", "eng": "three"},
    "three": {"ol": "ᱯᱮ", "odia": "ᱯᱮ", "deva": "पे", "eng": "three"},
    "चार": {"ol": "ᱯᱩᱱ", "odia": "ᱯᱩନ", "deva": "पुन", "eng": "four"},
    "four": {"ol": "ᱯᱩᱱ", "odia": "ᱯᱩନ", "deva": "पुन", "eng": "four"},
    "पांच": {"ol": "ᱢᱚᱬᱮ", "odia": "ᱢୋଣᱮ", "deva": "मोणे", "eng": "five"},
    "पाँच": {"ol": "ᱢᱚᱬᱮ", "odia": "ᱢୋଣᱮ", "deva": "मोणे", "eng": "five"},
    "five": {"ol": "ᱢᱚᱬᱮ", "odia": "ᱢୋଣᱮ", "deva": "मोणे", "eng": "five"},
    "छह": {"ol": "ᱛᱩᱨᱩᱭ", "odia": "ᱛᱩᱨᱩୟ", "deva": "तुरुय", "eng": "six"},
    "छः": {"ol": "ᱛᱩᱨᱩᱭ", "odia": "ᱛᱩᱨᱩୟ", "deva": "तुरुय", "eng": "six"},
    "six": {"ol": "ᱛᱩᱨᱩᱭ", "odia": "ᱛᱩᱨᱩୟ", "deva": "तुरुय", "eng": "six"},
    "सात": {"ol": "ᱮᱭᱟᱭ", "odia": "ଏୟᱟୟ", "deva": "एयाय", "eng": "seven"},
    "seven": {"ol": "ᱮᱭᱟᱭ", "odia": "ଏୟᱟୟ", "deva": "एयाय", "eng": "seven"},
    "आठ": {"ol": "ᱤᱨᱟᱹᱞ", "odia": "ଇରାଲ", "deva": "इरल", "eng": "eight"},
    "eight": {"ol": "ᱤᱨᱟᱹᱞ", "odia": "ଇରାଲ", "deva": "इरल", "eng": "eight"},
    "नौ": {"ol": "ᱟᱨᱮ", "odia": "ଆରେ", "deva": "आरे", "eng": "nine"},
    "nine": {"ol": "ᱟᱨᱮ", "odia": "ଆରେ", "deva": "आरे", "eng": "nine"},
    "दस": {"ol": "ᱜᱮᱞ", "odia": "ଗᱮᱞ", "deva": "गेल", "eng": "ten"},
    "ten": {"ol": "ᱜᱮᱞ", "odia": "ଗᱮᱞ", "deva": "गेल", "eng": "ten"},
    "ग्यारह": {"ol": "ᱜᱮᱞ ᱢᱤᱫ", "odia": "ଗᱮᱞ ମିଦ", "deva": "गेल मिद", "eng": "eleven"},
    "eleven": {"ol": "ᱜᱮᱞ ᱢᱤᱫ", "odia": "ଗᱮᱞ ମିଦ", "deva": "गेल मिद", "eng": "eleven"},
    "बारह": {"ol": "ᱜᱮᱞ ᱵᱟᱨ", "odia": "ଗᱮᱞ ବାର", "deva": "गेल बार", "eng": "twelve"},
    "twelve": {"ol": "ᱜᱮᱞ ᱵᱟᱨ", "odia": "ଗᱮᱞ ବାର", "deva": "गेल बार", "eng": "twelve"},
    "पंद्रह": {"ol": "ᱜᱮᱞ ᱢᱚᱬᱮ", "odia": "ଗᱮᱞ ମୋଣᱮ", "deva": "गेल मोणे", "eng": "fifteen"},
    "fifteen": {"ol": "ᱜᱮᱞ ᱢᱚᱬᱮ", "odia": "ଗᱮᱞ ମୋଣᱮ", "deva": "गेल मोणे", "eng": "fifteen"},
    "उन्नीस": {"ol": "ᱜᱮᱞ ᱟᱨᱮ", "odia": "ଗᱮᱞ ଆରେ", "deva": "गेल आरे", "eng": "nineteen"},
    "nineteen": {"ol": "ᱜᱮᱞ ᱟᱨᱮ", "odia": "ଗᱮᱞ ଆରେ", "deva": "गेल आरे", "eng": "nineteen"},
    "बीस": {"ol": "ᱤᱥᱤ", "odia": "ଇସᱤ", "deva": "इसी", "eng": "twenty"},
    "twenty": {"ol": "ᱤᱥᱤ", "odia": "ଇସᱤ", "deva": "इसी", "eng": "twenty"},
    "इक्कीस": {"ol": "ᱤᱥᱤ ᱢᱤᱫ", "odia": "ଇସᱤ ମିଦ", "deva": "इसी मिद", "eng": "twenty-one"},
    "twenty-one": {"ol": "ᱤᱥᱤ ᱢᱤᱫ", "odia": "ଇସᱤ ମିଦ", "deva": "इसी मिद", "eng": "twenty-one"},
    "पच्चीस": {"ol": "ᱤᱥᱤ ᱢᱚᱬᱮ", "odia": "ଇᱥᱤ ମୋଣᱮ", "deva": "इसी मोणे", "eng": "twenty-five"},
    "twenty-five": {"ol": "ᱤᱥᱤ ᱢᱚᱬᱮ", "odia": "ଇᱥᱤ ମୋଣᱮ", "deva": "इसी मोणे", "eng": "twenty-five"},
    "तीस": {"ol": "ᱯᱮ ᱜᱮᱞ", "odia": "ᱯᱮ ᱜᱮᱞ", "deva": "पे गेल", "eng": "thirty"},
    "thirty": {"ol": "ᱯᱮ ᱜᱮᱞ", "odia": "ᱯᱮ ᱜᱮᱞ", "deva": "पे गेल", "eng": "thirty"},
    "चालीस": {"ol": "ᱯᱩᱱ ᱜᱮᱞ", "odia": "ᱯᱩᱱ ᱜᱮᱞ", "deva": "पुन गेल", "eng": "forty"},
    "forty": {"ol": "ᱯᱩᱱ ᱜᱮᱞ", "odia": "ᱯᱩᱱ ᱜᱮᱞ", "deva": "पुन गेल", "eng": "forty"},
    "पचास": {"ol": "ᱢᱚᱬᱮ ᱜᱮᱞ", "odia": "ᱢୋଣᱮ ᱜᱮଲ", "deva": "मोणे गेल", "eng": "fifty"},
    "fifty": {"ol": "ᱢᱚᱬᱮ ᱜᱮᱞ", "odia": "ᱢୋଣᱮ ᱜᱮଲ", "deva": "मोणे गेल", "eng": "fifty"},
    "साठ": {"ol": "ᱛᱩᱨᱩᱭ ᱜᱮᱞ", "odia": "ᱛᱩᱨᱩୟ ᱜᱮଲ", "deva": "तुरुय गेल", "eng": "sixty"},
    "sixty": {"ol": "ᱛᱩᱨᱩᱭ ᱜᱮᱞ", "odia": "ᱛᱩᱨᱩୟ ᱜᱮଲ", "deva": "तुरुय गेल", "eng": "sixty"},
    "सौ": {"ol": "ᱥᱟᱭ", "odia": "ᱥᱟୟ", "deva": "साय", "eng": "hundred"},
    "hundred": {"ol": "ᱥᱟᱭ", "odia": "ᱥᱟୟ", "deva": "साय", "eng": "hundred"},
    "हजार": {"ol": "ᱦᱟᱡᱟᱨ", "odia": "ହାଜାର", "deva": "हाजार", "eng": "thousand"},
    "हज़ार": {"ol": "ᱦᱟᱡᱟᱨ", "odia": "ହାଜାର", "deva": "हाजार", "eng": "thousand"},
    "thousand": {"ol": "ᱦᱟᱡᱟᱨ", "odia": "ହାଜାର", "deva": "हाजार", "eng": "thousand"},
    "लाख": {"ol": "ᱞᱟᱠᱷ", "odia": "ଲାଖ", "deva": "लाख", "eng": "lakh"},
    "lakh": {"ol": "ᱞᱟᱠᱷ", "odia": "ଲାଖ", "deva": "लाख", "eng": "lakh"},
    "करोड़": {"ol": "ᱠᱚᱨᱚᱲ", "odia": "କୋରୋଡ", "deva": "करोड़", "eng": "crore"},
    "crore": {"ol": "ᱠᱚᱨᱚᱲ", "odia": "କୋରୋଡ", "deva": "करोड़", "eng": "crore"},
}'''

def update_py():
    with open("translation_engine.py", "r", encoding="utf-8") as f:
        content = f.read()

    # 1. Replace GRAMMAR_LEXICON
    lex_pattern = r"GRAMMAR_LEXICON\s*=\s*\{.*?\n\}\n\n# Hindi Postpositions"
    content = re.sub(lex_pattern, LEXICON_BLOCK + "\n\n# Hindi Postpositions", content, flags=re.DOTALL)

    # 2. Reorder translation loop in `def translate`
    # Replace Tier 4 loop in translation_engine.py
    old_tier4_pattern = r"# --- TIER 4: Multi-Word Sliding Window with Preposition/Postposition Grammar Fusion ---.*?(?=avg_confidence\s*=)"
    
    new_tier4 = '''# --- TIER 4: Multi-Word Sliding Window with Preposition/Postposition Grammar Fusion ---
        tokens = text_clean.split()
        n = len(tokens)
        translated_segments = []
        confidences = []
        modes = []

        vocab_combined = self._combined_vocab_cache.get(src_lang, {}).get("sat_Olck", {})

        i = 0
        while i < n:
            matched = False

            # 1. First attempt O(K) longest prefix match with PrefixTrie (MULTI-WORD PHRASES FIRST)
            trie = self._trie_indices.get(src_lang, {}).get("sat_Olck")
            if trie:
                match_val, match_len = trie.longest_match(tokens, i)
                if match_val and match_len > 1:
                    translated_segments.append(match_val)
                    confidences.append(1.0)
                    modes.append("MULTI_WORD_PHRASE")
                    i += match_len
                    matched = True
                    continue

            # 2. Greedy sliding window fallback (5 down to 2)
            for window in range(min(5, n - i), 1, -1):
                chunk = " ".join(tokens[i : i + window])
                chunk_clean = chunk.rstrip("।,!?.")
                chunk_lower = chunk_clean.lower()
                
                # Check corpus or pre-indexed vocab
                if chunk_lower in self.parallel_corpus:
                    ol_c, _ = self.parallel_corpus[chunk_lower]
                    translated_segments.append(ol_c)
                    confidences.append(1.0)
                    modes.append("CORPUS_PHRASE")
                    i += window
                    matched = True
                    break
                elif chunk_clean in vocab_combined:
                    translated_segments.append(vocab_combined[chunk_clean])
                    confidences.append(1.0)
                    modes.append("MULTI_WORD_PHRASE")
                    i += window
                    matched = True
                    break
                elif chunk_lower in vocab_combined:
                    translated_segments.append(vocab_combined[chunk_lower])
                    confidences.append(1.0)
                    modes.append("MULTI_WORD_PHRASE")
                    i += window
                    matched = True
                    break

            if matched:
                continue

            # 3. English Preposition + Noun construct: e.g., "in school", "from village"
            if src_lang == "eng_Latn" or not any(ord(c) > 255 for c in text_clean):
                t_lower = tokens[i].lower().rstrip(".,!?")
                if t_lower in ENGLISH_PREPOSITIONS and i + 1 < n:
                    noun_idx = i + 1
                    if tokens[noun_idx].lower() in ["the", "a", "an"] and i + 2 < n:
                        noun_idx = i + 2
                    
                    noun_token = tokens[noun_idx].rstrip(".,!?")
                    noun_res = self.translate_token(noun_token, "eng_Latn", "sat_Olck")
                    prep_info = ENGLISH_PREPOSITIONS[t_lower]
                    combined_word = noun_res["text"] + prep_info["ol"]
                    translated_segments.append(combined_word)
                    confidences.append(0.95)
                    modes.append("ENGLISH_PREPOSITION_POSTPOSITION")
                    i = noun_idx + 1
                    continue

            # 4. Hindi Postposition construct: e.g. 'स्कूल में', 'घर से', 'किताब का'
            if i + 1 < n and tokens[i + 1] in HINDI_POSTPOSITIONS:
                base_token_res = self.translate_token(tokens[i], src_lang, "sat_Olck")
                postpos_suffix = HINDI_POSTPOSITIONS[tokens[i + 1]]["ol"]
                combined_word = base_token_res["text"] + postpos_suffix
                translated_segments.append(combined_word)
                confidences.append(0.95)
                modes.append("GRAMMAR_POSTPOSITION")
                i += 2
                continue

            # 5. Single Token Translation
            res = self.translate_token(tokens[i], src_lang, "sat_Olck")
            translated_segments.append(res["text"])
            modes.append(res["mode"])
            confidences.append(res["confidence"])
            i += 1

        '''
    
    content = re.sub(old_tier4_pattern, new_tier4, content, flags=re.DOTALL)

    with open("translation_engine.py", "w", encoding="utf-8") as f:
        f.write(content)

    print("translation_engine.py successfully updated!")

if __name__ == "__main__":
    update_py()
