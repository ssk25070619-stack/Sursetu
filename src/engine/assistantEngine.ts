import { AssistantResponse, PedagogicalIntent, IndigenousLanguage } from '../types';

interface IntentPattern {
  intent: PedagogicalIntent;
  keywords: string[];
}

const INTENT_PATTERNS: IntentPattern[] = [
  {
    intent: 'LESSON_PLAN',
    keywords: ['पाठ योजना', 'lesson plan', 'योजना', 'पीरियड', 'class plan', '15 min', 'nipun plan', 'कक्षा 1', 'कक्षा 2']
  },
  {
    intent: 'CLASSROOM_COMMAND',
    keywords: ['किताब खोलने', 'बैठने', 'खड़े', 'आदेश', 'command', 'instruction', 'अनुशासन', 'कहें', 'बोलें', 'कैसे कहें', 'चुप रहो', 'हाथ उठाओ']
  },
  {
    intent: 'STORY_RHYME',
    keywords: ['कहानी', 'कविता', 'rhyme', 'गीत', 'story', 'चिड़िया', 'पेड़', 'बाहा', 'सरहुल', 'लोमड़ी', 'कौआ', 'tale', 'गीत']
  },
  {
    intent: 'MATH_NUMERACY',
    keywords: ['गिनती', 'math', 'संख्या', 'अंक', '1 से 10', 'numeracy', 'जोड़', 'fln math', 'काउंटिंग', 'digits', 'पत्ते']
  },
  {
    intent: 'ASSESSMENT',
    keywords: ['आकलन', 'assessment', 'मूल्यांकन', 'टेस्ट', 'मौखिक', 'rubric', 'grading', 'जांच', 'nipun assessment']
  },
  {
    intent: 'CULTURE_FESTIVAL',
    keywords: ['बाहा', 'सरहुल', 'सोहराय', 'करम', 'festival', 'त्यौहार', 'परब', 'संस्कृति', 'जाहेर थान', 'culture', 'मांडर', 'माघे', 'हेरो']
  }
];

export function classifyIntent(query: string): PedagogicalIntent {
  const q = query.toLowerCase();
  for (const item of INTENT_PATTERNS) {
    if (item.keywords.some(kw => q.includes(kw))) {
      return item.intent;
    }
  }
  return 'LESSON_PLAN'; // Default fallback
}

export function generateAssistantResponse(
  query: string,
  grade: string = 'Grade 1',
  language: IndigenousLanguage = 'santali'
): AssistantResponse {
  const startTime = performance.now();
  const intent = classifyIntent(query);

  let title = '';
  let replyText = '';
  let suggestedChips: string[] = [];
  let audioSpeakText = '';
  let actionSteps: string[] = [];

  switch (intent) {
    case 'LESSON_PLAN':
      if (language === 'ho') {
        title = '📋 NIPUN Bharat Ho (Kolhan) 15-Minute Lesson Plan';
        audioSpeakText = 'जोहार गिदरा को! बुगिया ते मेनापेया? तेहें दो आबू सर्जम दारू अड़ो बाहा बबत् तेबू पढ़ावेया!';
        actionSteps = [
          '0-3 min: Welcome Circle & Daily Greeting in Ho (जोहार गिदरा को!)',
          '3-8 min: Object Identification (साल पत्ता: सर्जम साकाम, पेड़: दारू)',
          '8-12 min: TPR Action Rhyme with Kolhan rhythmic hand clapping',
          '12-15 min: Quick oral comprehension in Ho language'
        ];
        replyText = `### 🎯 NIPUN Bharat 15-Minute MTB-MLE Lesson Plan — Ho Language (${grade})
**क्षेत्रीय संवर्ग (Context):** कोल्हान प्रमंडल (प० सिंहभूम, पूर्वी सिंहभूम व मयूरभंज)
**विषय (Theme):** परिवेशीय जुड़ाव एवं हो भाषा सेतु (Nature & Vocabulary Bridge)

#### ⏱️ चरणबद्ध कक्षा समय-सारिणी (Action Schedule):
1. **00:00 - 03:00 | स्वागत वृत्त (Welcome Circle):**
   - **शिक्षक उद्बोधन (Ho):** *जोहार गिदरा को! बुगिया ते मेनापेया?* (Johar gidra ko! Bugiya te menapeya? - सुप्रभात बच्चों! सब कुशल हैं?)
   - **छात्र उत्तर:** *जोहार गुरुजी! बुगिया गेयाले!* (Johar guruji! Bugiya geyale! - जोहार गुरुजी, हम सब कुशल हैं!)

2. **03:00 - 08:00 | वस्तु पहचान व शब्द सेतु (Object Bridge in Ho):**
   - शिक्षक हाथ में साल का पत्ता दिखाकर पूछें:
   - *"नेया दो चिनाः तनाः?"* (Neya do china tanag? - यह क्या है?)
   - छात्र सहज उत्तर देंगे: *"सर्जम साकाम"* (Sarjam sakam) अथवा *"दारू साकाम"* (Daru sakam).
   - शिक्षक तुरंत हिंदी शब्द 'पत्ता' व 'पेड़' से सम्बद्ध करें।

3. **08:00 - 12:00 | गतिज कविता व खेल (TPR Action Rhyme):**
   - *"दारू दारू हरियर दारू, चेणें हिजुः दार रे!"*
   - (पेड़ पेड़ हरा पेड़, चिड़िया आए डाल पर!) — पंखों की तरह हाथ फड़फड़ाने का अभिनय।

4. **12:00 - 15:00 | त्वरित मौखिक आकलन (Quick Oral Check):**
   - 2 बच्चों से 'पेड़' को हो भाषा में बोलने को कहें (*दारू / Daru*)।`;
        suggestedChips = ['🔢 हो भाषा 1 से 10 गिनती', '🗣️ हो कक्षा निर्देश', '📝 हो वर्कशीट प्रिंट करें', '🌸 माघे परब जानकारी'];
      } else if (language === 'mundari') {
        title = '📋 NIPUN Bharat Mundari 15-Minute Lesson Plan';
        audioSpeakText = 'जोहार होन को! चिलका मेनापिया? तेहेंज दो आबु सरजम दारु अड़ो बाहा बबत् तेबु पढ़ावेया!';
        actionSteps = [
          '0-3 min: Welcome Circle & Daily Greeting in Mundari (जोहार होन को!)',
          '3-8 min: Object Identification (साल पत्ता: सरजम साकम, पेड़: दारु)',
          '8-12 min: TPR Action Rhyme with Chota Nagpur rhythmic beats',
          '12-15 min: Quick oral comprehension check in Mundari'
        ];
        replyText = `### 🎯 NIPUN Bharat 15-Minute MTB-MLE Lesson Plan — Mundari (${grade})
**क्षेत्रीय संवर्ग (Context):** छोटानागपुर प्रमंडल (खूंटी, रांची व सिमडेगा क्षेत्र)
**विषय (Theme):** बिरसा मातृभाषा सेतु एवं परिवेशीय ज्ञान (Nature & Mundari Bridge)

#### ⏱️ चरणबद्ध कक्षा समय-सारिणी (Action Schedule):
1. **00:00 - 03:00 | स्वागत वृत्त (Welcome Circle):**
   - **शिक्षक उद्बोधन (Mundari):** *जोहार होन को! चिलका मेनापिया?* (Johar hon ko! Chilka menapiya? - जोहार बच्चों! कैसे हो?)
   - **छात्र उत्तर:** *जोहार गुरुजी! बुगी गेयाले!* (Johar guruji! Bugi geyale! - जोहार गुरुजी, अच्छे हैं!)

2. **03:00 - 08:00 | वस्तु पहचान व शब्द सेतु (Object Bridge in Mundari):**
   - शिक्षक हाथ में साल पत्ता (सरजम साकम) दिखाकर पूछें:
   - *"नेया दो चिनाः तनाः?"* (Neya do china tanag? - यह क्या है?)
   - छात्र सहज उत्तर देंगे: *"साकम / दारु"* (Sakam / Daru).
   - शिक्षक तुरंत हिंदी शब्द 'पत्ता' व 'पेड़' से सम्बद्ध करें।

3. **08:00 - 12:00 | गतिज कविता व खेल (TPR Action Rhyme):**
   - *"दारु दारु हरियर दारु, चेणें हिजुः गाड़ा पारे!"*
   - (पेड़ पेड़ हरा पेड़, चिड़िया आए नदी पार से!) — अभिनय सहित गायन।

4. **12:00 - 15:00 | त्वरित मौखिक आकलन (Quick Oral Check):**
   - 2 बच्चों से 'पेड़' को मुण्डारी में बोलने को कहें (*दारु / Daru*)।`;
        suggestedChips = ['🔢 मुण्डारी 1 से 10 गिनती', '🗣️ मुण्डारी कक्षा निर्देश', '📝 मुण्डारी वर्कशीट प्रिंट करें', '🌸 सरहुल परब जानकारी'];
      } else {
        title = '📋 NIPUN Bharat MTB-MLE 15-Minute Lesson Plan (Santali)';
        audioSpeakText = 'ᱥᱟᱹᱜᱩᱱ ᱥᱮᱛᱟᱜ ᱜᱤᱫᱽᱨᱟᱹ ᱠᱚ! ᱛᱮᱦᱮᱧ ᱫᱚ ᱟᱵᱚ ᱫᱟᱨᱮ ᱟᱨ ᱵᱟᱦᱟ ᱵᱟᱵᱚᱛ ᱛᱮᱵᱚ ᱯᱟᱲᱦᱟᱣᱜᱼᱟ᱾';
        actionSteps = [
          '0-3 min: Welcome Circle & Daily Greeting in Mother Tongue (ᱥᱟᱹᱜᱩᱱ ᱥᱮᱛᱟᱜ)',
          '3-8 min: Tactile Object Identification (Tree leaves, twigs, stones)',
          '8-12 min: TPR Action Rhyme with physical gestures',
          '12-15 min: Quick 2-question oral comprehension check'
        ];
        replyText = `### 🎯 NIPUN Bharat 15-Minute MTB-MLE Lesson Plan (${grade})
**विषय (Theme):** परिवेशीय जुड़ाव एवं भाषा सेतु (Nature & Vocabulary Bridge)

#### ⏱️ चरणबद्ध कक्षा समय-सारिणी (Action Schedule):
1. **00:00 - 03:00 | स्वागत वृत्त (Welcome Circle):**
   - **शिक्षक उद्बोधन (Santali):** *ᱥᱟᱹᱜᱩᱱ ᱥᱮᱛᱟᱜ ᱜᱤᱫᱽᱨᱟᱹ ᱠᱚ!* (Sagun setag gidra ko! - सुप्रभात बच्चों!)
   - **छात्र उत्तर:** *ᱥᱟᱹᱜᱩᱱ ᱥᱮᱛᱟᱜ ᱜᱩᱨᱩᱡᱤ!* (Sagun setag guruji!)

2. **03:00 - 08:00 | वस्तु पहचान व शब्द सेतु (Object Bridge):**
   - शिक्षक हाथ में साल का पत्ता (ᱥᱟᱨᱡᱚᱢ ᱥᱟᱠᱟᱢ) दिखाकर पूछें:
   - *"ᱱᱚᱶᱟ ᱫᱚ ᱪᱮᱫ ᱠᱟᱱᱟ?"* (Nowa do ched kana? - यह क्या है?)
   - छात्र सहज उत्तर देंगे: *"ᱥᱟᱠᱟᱢ / ᱫᱟᱨᱮ"* (Sakam / Dare).
   - शिक्षक तुरंत हिंदी शब्द 'पत्ता' व 'पेड़' से सम्बद्ध करें।

3. **08:00 - 12:00 | गतिज कविता व खेल (TPR Action Rhyme):**
   - *"ᱫᱟᱨᱮ ᱫᱟᱨᱮ ᱦᱟᱹᱨᱤᱭᱟᱹᱲ ᱫᱟᱨᱮ, ᱪᱮᱬᱮ ᱦᱤᱡᱩᱜ ᱰᱟᱹᱨ ᱨᱮ!"*
   - (पेड़ पेड़ हरा पेड़, चिड़िया आए डाल पर!) — हाथों से पंख फड़फड़ाने का अभिनय।

4. **12:00 - 15:00 | त्वरित मौखिक आकलन (Quick Oral Check):**
   - 2 बच्चों से 'पेड़' को संथाली में बोलने को कहें (*ᱫᱟᱨᱮ*)।`;
        suggestedChips = ['🔢 1 से 10 गणित गतिविधि', '🃏 3D फ्लैशकार्ड देखें', '📝 वर्कशीट प्रिंट करें', '🗣️ कक्षा अनुशासन निर्देश'];
      }
      break;

    case 'CLASSROOM_COMMAND':
      if (language === 'ho') {
        title = '🗣️ Bilingual Classroom Commands Guide (Ho Language)';
        audioSpeakText = 'अमाः पुथि झिज में! नेरे दुबुं में! आयूम में!';
        actionSteps = [
          'Display gesture first (open palms like a book)',
          'Speak the Ho command clearly with native intonation',
          'Encourage peer repetition in unison',
          'Provide instant reinforcement (बुगिया / Shabash)'
        ];
        replyText = `### 🏫 प्राथमिक कक्षा अनुशासन एवं निर्देश तालिका — Ho (हो भाषा)
कोल्हान क्षेत्र के गैर-जनजातीय शिक्षकों हेतु द्विभाषी निर्देश मार्गदर्शिका:

| हिंदी निर्देश | Ho (वारंग क्षिती/देवनागरी) | उच्चारण (Phonetics) | संकेत/मुद्रा (TPR Gesture) |
| :--- | :--- | :--- | :--- |
| **किताब खोलो** | अमाः पुथि झिज में | *Amag puthi jhij me* | दोनों हथेलियों को किताब की तरह खोलें |
| **यहाँ बैठो** | नेरे दुबुं में | *Nere dubun me* | हाथ नीचे की ओर दबाएं |
| **खड़े हो जाओ** | तिंगु में | *Tingu me* | हाथ ऊपर उठाएं |
| **ध्यान से सुनो** | आयूम में | *Ayum me* | कान के पास हाथ रखें |
| **कॉपी में लिखो** | ओल में | *Ol me* | लिखने का अभिनय करें |
| **पानी पी लो** | दाः नुइ में | *Dag nui me* | पीने का इशारा करें |
| **बहुत अच्छा!** | बुगिया! | *Bugiya!* | थम्स-अप व ताली बजाएं |`;
        suggestedChips = ['📋 15-मिनट हो पाठ योजना', '🎶 हो लोक कविता', '🎲 ट्राइबल गेम'];
      } else if (language === 'mundari') {
        title = '🗣️ Bilingual Classroom Commands Guide (Mundari)';
        audioSpeakText = 'अमाः पुथी झिज में! नेताः दुबुं में! आयूम में!';
        actionSteps = [
          'Display gesture first (open palms like a book)',
          'Speak the Mundari command clearly',
          'Encourage peer repetition in chorus',
          'Provide instant positive praise (मार बुगी / Shabash)'
        ];
        replyText = `### 🏫 प्राथमिक कक्षा अनुशासन एवं निर्देश तालिका — Mundari (मुण्डारी)
छोटा नागपुर क्षेत्र के शिक्षकों हेतु द्विभाषी मुण्डारी निर्देश मार्गदर्शिका:

| हिंदी निर्देश | Mundari (मुण्डारी/देवनागरी) | उच्चारण (Phonetics) | संकेत/मुद्रा (TPR Gesture) |
| :--- | :--- | :--- | :--- |
| **किताब खोलो** | अमाः पुथी झिज में | *Amag puthi jhij me* | दोनों हथेलियों को किताब की तरह खोलें |
| **यहाँ बैठो** | नेताः दुबुं में | *Netag dubun me* | हाथ नीचे की ओर दबाएं |
| **खड़े हो जाओ** | तिंगुन में | *Tingun me* | हाथ ऊपर उठाएं |
| **ध्यान से सुनो** | आयूम में | *Ayum me* | कान के पास हाथ रखें |
| **कॉपी में लिखो** | ओल में | *Ol me* | लिखने का अभिनय करें |
| **पानी पी लो** | दाः नुइ में | *Dag nui me* | पीने का इशारा करें |
| **बहुत अच्छा!** | मार बुगी! | *Mar bugi!* | थम्स-अप व ताली बजाएं |`;
        suggestedChips = ['📋 15-मिनट मुण्डारी पाठ योजना', '🎶 मुण्डारी लोक कविता', '🎲 ट्राइबल गेम'];
      } else {
        title = '🗣️ Bilingual Classroom Commands & Gestures Guide (Santali)';
        audioSpeakText = 'ᱟᱢᱟᱜ ᱯᱩᱛᱷᱤ ᱡᱷᱤᱡᱽ ᱢᱮ! ᱱᱟᱯᱟᱭ ᱛᱮ ᱫᱩᱲᱩᱵ ᱢᱮ᱾';
        actionSteps = [
          'Display gesture first (open palms like a book)',
          'Speak the Santali phrase clearly with phonetic accent',
          'Encourage peer repetition in unison',
          'Provide instant positive reinforcement (ᱟᱹᱰᱤ ᱱᱟᱯᱟᱭ / Shabash)'
        ];
        replyText = `### 🏫 प्राथमिक कक्षा अनुशासन एवं निर्देश तालिका (Commands Table)
गैर-जनजातीय शिक्षकों के लिए बच्चों से सहज संवाद हेतु त्रिभाषी मार्गदर्शिका:

| हिंदी निर्देश | Santali (Ol Chiki) | उच्चारण (Phonetics) | संकेत/मुद्रा (TPR Gesture) | Ho / Mundari |
| :--- | :--- | :--- | :--- | :--- |
| **किताब खोलो** | ᱟᱢᱟᱜ ᱯᱩᱛᱷᱤ ᱡᱷᱤᱡᱽ ᱢᱮ | *Amag puthi jhij me* | दोनों हथेलियों को किताब की तरह खोलें | *अमाः पुथि झिज में* |
| **यहाँ बैठो** | ᱱᱚᱸᱰᱮ ᱫᱩᱲᱩᱵ ᱢᱮ | *Nonde durub me* | हाथ नीचे की ओर दबाएं | *नेरे दुबुं में* |
| **खड़े हो जाओ** | ᱛᱤᱸᱜᱩᱱ ᱢᱮ | *Tingun me* | हाथ ऊपर उठाएं | *तिंगु में* |
| **ध्यान से सुनो** | ᱱᱟᱯᱟᱭ ᱛᱮ ᱟᱧᱡᱚᱢ ᱢᱮ | *Napay te anjom me* | कान के पास हाथ रखें | *आयूम में* |
| **कॉपी में लिखो** | ᱠᱷᱟᱛᱟ ᱨᱮ ᱚᱞ ᱢᱮ | *Khata re ol me* | लिखने का अभिनय करें | *ओल में* |
| **पानी पी लो** | ᱫᱟᱜ ᱧᱩᱭ ᱢᱮ | *Dag nyuy me* | पीने का इशारा करें | *दाः नुइ में* |
| **बहुत अच्छा!** | ᱟᱹᱰᱤ ᱱᱟᱯᱟᱭ! | *Adi napay!* | थम्स-अप व ताली बजाएं | *बुगिया!* |`;
        suggestedChips = ['📋 15-मिनट पाठ योजना', '🎶 बच्चों की लोक कविता', '🎲 ट्राइबल बोर्ड गेम'];
      }
      break;

    case 'STORY_RHYME':
      if (language === 'ho') {
        title = '🎶 Ho Bilingual Folk Story & Action Rhyme';
        audioSpeakText = 'मियाद् बुरु रे मियाद् चेणें ताएकेना। सर्जम दारू रे अयगाः तुकाए बए केदा।';
        actionSteps = [
          'Read story in Ho then translate into simple Hindi',
          'Encourage kids to produce bird chirps (चेणें राग / Che-che)',
          'Link story to tree protection in Kolhan forests'
        ];
        replyText = `### 🌳 हो लोक कथा: नन्हीं चिड़िया और साल का पेड़ (चेणें अड़ो सर्जम दारू)

#### पैरा 1:
- **Ho:** *मियाद् बुरु रे मियाद् हुड़िं चेणें ताएकेना।*
- **उच्चारण:** *Miyad buru re miyad hudin chene taekena.*
- **हिंदी अनुवाद:** एक घने पहाड़ पर एक नन्हीं चिड़िया रहती थी।

#### पैरा 2:
- **Ho:** *अय सर्जम दारू रे अयगाः तुकाए बए केदा।*
- **उच्चारण:** *Ay sarjam daru re aygag tukae bae keda.*
- **हिंदी अनुवाद:** उसने विशाल साल के पेड़ पर अपना प्यारा घोंसला बनाया था।

---
### 🎵 अभिनय गीत (Ho Action Rhyme):
> *"बाहा साबाः सर्जम दारू रे, (फूल खिले साल पेड़ पर)*  
> *गिदरा को इनूं तना हातु रे! (बच्चे खेल रहे गांव में!)"*`;
        suggestedChips = ['🃏 हो फ्लैशकार्ड देखें', '📝 हो वर्कशीट बनाएं', '🏹 बिरसा तीरंदाजी गेम'];
      } else if (language === 'mundari') {
        title = '🎶 Mundari Bilingual Folk Story & Action Rhyme';
        audioSpeakText = 'मियाद बिर रे मियाद हुड़िंग चेणें ताएकेना। सरजम दारु रे आजगाः तुकाए बाइ केदा।';
        actionSteps = [
          'Read story chunks in Mundari with animated expressions',
          'Have children mimic bird sounds together',
          'Reinforce love for sacred Sal trees'
        ];
        replyText = `### 🌳 मुण्डारी लोक कथा: नन्हीं चिड़िया और साल का पेड़ (चेणें अड़ो सरजम दारु)

#### पैरा 1:
- **Mundari:** *मियाद बिर रे मियाद हुड़िंग चेणें ताएकेना।*
- **उच्चारण:** *Miyad bir re miyad huding chene taekena.*
- **हिंदी अनुवाद:** एक घने जंगल में एक नन्हीं चिड़िया रहती थी।

#### पैरा 2:
- **Mundari:** *आए सरजम दारु रे आजगाः तुकाए बाइ केदा।*
- **उच्चारण:** *Ae sarjam daru re ajgag tukae bai keda.*
- **हिंदी अनुवाद:** उसने विशाल साल के पेड़ पर अपना प्यारा घोंसला बनाया।

---
### 🎵 अभिनय गीत (Mundari Action Song):
> *"बाहा बाहा सरजम बाहा, (फूल खिले साल के फूल)*  
> *होन को सुसुन तना जाहेर रे! (बच्चे नाच रहे जाहेर थान में!)"*`;
        suggestedChips = ['🃏 मुण्डारी फ्लैशकार्ड', '📝 मुण्डारी वर्कशीट बनाएं', '🏹 तीरंदाजी गेम'];
      } else {
        title = '🎶 Bilingual Folk Story & Action Rhyme (Santali)';
        audioSpeakText = 'ᱢᱤᱫᱴᱟᱹᱝ ᱵᱤᱨ ᱨᱮ ᱢᱤᱫ ᱪᱮᱬᱮᱭ ᱛᱟᱦᱮᱸ ᱠᱟᱱᱟ᱾ ᱥᱟᱨᱡᱚᱢ ᱫᱟᱨᱮ ᱨᱮ ᱩᱱᱤ ᱛᱩᱠᱟᱹᱭ ᱵᱮᱱᱟᱣ ᱞᱮᱫᱼᱟ᱾';
        actionSteps = [
          'Read story in 2-line chunks (Santali then Hindi)',
          'Have children mimic bird sounds (ᱪᱮᱬᱮ ᱨᱟᱜ / Che-che)',
          'Connect theme to tree protection and nature love'
        ];
        replyText = `### 🌳 लोक कथा: नन्हीं चिड़िया और साल का पेड़ (ᱪᱮᱬᱮ ᱟᱨ ᱥᱟᱨᱡᱚᱢ ᱫᱟᱨᱮ)

#### पैरा 1:
- **Santali (Ol Chiki):** *ᱢᱤᱫᱴᱟᱹᱝ ᱵᱤᱨ ᱨᱮ ᱢᱤᱫ ᱦᱩᱰᱤᱧ ᱪᱮᱬᱮᱭ ᱛᱟᱦᱮᱸ ᱠᱟᱱᱟ᱾*
- **उच्चारण (Phonetics):** *Midtang bir re mid hudinj chenrey tahe kana.*
- **हिंदी अनुवाद:** एक घने जंगल में एक नन्हीं चिड़िया रहती थी।

#### पैरा 2:
- **Santali (Ol Chiki):** *ᱩᱱᱤ ᱫᱚ ᱥᱟᱨᱡᱚᱢ ᱫᱟᱨᱮ ᱨᱮ ᱟᱡᱟᱜ ᱛᱩᱠᱟᱹᱭ ᱵᱮᱱᱟᱣ ᱞᱮᱫᱼᱟ᱾*
- **उच्चारण (Phonetics):** *Uni do sarjom dare re ajag tukay benaw leda.*
- **हिंदी अनुवाद:** उसने एक विशाल साल के पेड़ पर अपना प्यारा घोंसला बनाया था।

#### पैरा 3 (सीख / Lesson):
- **Santali (Ol Chiki):** *ᱫᱟᱨᱮ ᱫᱚ ᱟᱵᱚᱣᱟᱜ ᱡᱤᱣᱤ ᱠᱟᱱᱟ, ᱱᱚᱶᱟ ᱫᱚ ᱵᱟᱵᱚᱱ ᱢᱟᱜᱼᱟ᱾*
- **हिंदी अनुवाद:** पेड़ हमारा जीवन हैं, हमें उन्हें कभी काटना नहीं चाहिए।

---
### 🎵 अभिनय गीत (Action Song):
> *"ᱵᱟᱦᱟ ᱯᱷᱩᱴᱟᱹᱣ ᱮᱱᱟ ᱥᱟᱨᱡᱚᱢ ᱫᱟᱨᱮ ᱨᱮ, (फूल खिले साल पेड़ पर)*  
> *ᱜᱤᱫᱽᱨᱟᱹ ᱠᱚ ᱠᱷᱮᱞᱚᱜ ᱠᱟᱱᱟ ᱟᱹᱛᱩ ᱨᱮ! (बच्चे खेल रहे गांव में!)"*`;
        suggestedChips = ['🃏 फ्लैशकार्ड देखें', '📝 कविता वर्कशीट बनाएं', '🏹 बिरसा तीरंदाजी गेम खेलें'];
      }
      break;

    case 'MATH_NUMERACY':
      if (language === 'ho') {
        title = '🔢 NIPUN Bharat FLN Math — Ho Counting Guide';
        audioSpeakText = 'मियाद्, बारिया, आपिया, उपुन, मोया! मियाद् साकाम, बारिया साकाम! बुगिया!';
        actionSteps = [
          'Gather 10 Sal leaves or seeds',
          'Count sequentially using Ho oral numbers',
          'Trace numbers in sand/flour tray'
        ];
        replyText = `### 🔢 FLN गणित: 1 से 10 तक स्थानीय 'हो' गिनती (Ho Numbers)
स्थानीय पत्तों, कंकड़ों व बीजों की सहायता से मूर्त से अमूर्त की ओर अधिगम:

| संख्या | Ho (वारंग क्षिती/देवनागरी) | उच्चारण | मूर्त गतिविधि (Tactile Count) |
| :--- | :--- | :--- | :--- |
| **1** | मियाद् (Miyad) | *मीयाद* | 🍃 1 साल पत्ता |
| **2** | बारिया (Baria) | *बारिया* | 🍃🍃 2 पत्ते |
| **3** | आपिया (Apiya) | *आपिया* | 🍃🍃🍃 3 महुआ फूल |
| **4** | उपुन (Upun) | *उपुन* | 🍃🍃🍃🍃 4 कंकड़ |
| **5** | मोया (Moya) | *मोया* | ✋ 5 उंगलियां |
| **6** | तुरूइ (Turui) | *तुरुइ* | 🍃x6 6 छोटे बीज |
| **7** | ऐया (Aiya) | *ऐया* | 🍃x7 7 दाने |
| **8** | इरिल (Iril) | *इरिल* | 🍃x8 8 टहनियां |
| **9** | आरे (Are) | *आरे* | 🍃x9 9 कंकड़ |
| **10** | गेल (Gel) | *गेल* | 👐 दोनों हाथों की 10 उंगलियां |

💡 **कक्षा खेल:** शिक्षक ताली बजाएं (उदा. 3 बार), बच्चे कोरस में कहें: *"आपिया (Apiya)!"*`;
        suggestedChips = ['📝 हो गणित वर्कशीट बनाएं', '🃏 अंक फ्लैशकार्ड', '🎲 सफारी गेम'];
      } else if (language === 'mundari') {
        title = '🔢 NIPUN Bharat FLN Math — Mundari Counting Guide';
        audioSpeakText = 'मियाद, बारिया, आपिया, उपुन, मोड़े! मियाद साकम, बारिया साकम! मार बुगी!';
        actionSteps = [
          'Gather pebbles and twigs from school grounds',
          'Chant Mundari numbers in rhythm with clapping',
          'Interactive counting pairs'
        ];
        replyText = `### 🔢 FLN गणित: 1 से 10 तक स्थानीय 'मुण्डारी' गिनती (Mundari Numbers)
स्थानीय परिवेशीय सामग्री से प्राकृतिक संख्या ज्ञान:

| संख्या | Mundari (मुण्डारी) | उच्चारण | मूर्त गतिविधि (Tactile Count) |
| :--- | :--- | :--- | :--- |
| **1** | मियाद (Miyad) | *मीयाद* | 🍃 1 पत्ता |
| **2** | बारिया (Baria) | *बारिया* | 🍃🍃 2 पत्ते |
| **3** | आपिया (Apiya) | *आपिया* | 🍃🍃🍃 3 फूल |
| **4** | उपुन (Upun) | *उपुन* | 🍃🍃🍃🍃 4 कंकड़ |
| **5** | मोड़े (Mode) | *मोड़े* | ✋ 5 उंगलियां |
| **6** | तुरूइ (Turui) | *तुरुइ* | 🍃x6 6 बीज |
| **7** | एया (Eya) | *एया* | 🍃x7 7 दाने |
| **8** | इराल (Iral) | *इराल* | 🍃x8 8 टहनियां |
| **9** | आरे (Are) | *आरे* | 🍃x9 9 कंकड़ |
| **10** | गेल (Gel) | *गेल* | 👐 10 उंगलियां |

💡 **कक्षा खेल:** शिक्षक उंगली दिखाएं (उदा. 4), बच्चे कहें: *"उपुन (Upun)!"*`;
        suggestedChips = ['📝 मुण्डारी गणित वर्कशीट', '🃏 अंक फ्लैशकार्ड', '🎲 खेल खेलें'];
      } else {
        title = '🔢 NIPUN Bharat FLN Math & Tactile Counting Guide (Santali)';
        audioSpeakText = 'ᱢᱤᱫ, ᱵᱟᱨ, ᱯᱮ, ᱯᱩᱱ, ᱢᱚᱬᱮ! ᱢᱤᱫᱴᱟᱹᱝ ᱥᱟᱠᱟᱢ, ᱵᱟᱨᱭᱟ ᱥᱟᱠᱟᱢ! ᱟᱹᱰᱤ ᱱᱟᱯᱟᱭ!';
        actionSteps = [
          'Gather 10 Sal leaves or small river pebbles',
          'Place objects one by one while chanting Ol Chiki numbers',
          'Trace numbers in sand/flour tray'
        ];
        replyText = `### 🔢 FLN गणित: 1 से 10 तक स्थानीय संथाली गिनती
स्थानीय पत्तों, कंकड़ों व बीजों की सहायता से मूर्त से अमूर्त की ओर अधिगम:

| संख्या | Ol Chiki | संथाली नाम | उच्चारण | मूर्त गतिविधि (Tactile Count) |
| :--- | :--- | :--- | :--- | :--- |
| **1** | ᱑ | ᱢᱤᱫ (Mid) | *मीद* | 🍃 1 साल का पत्ता |
| **2** | ᱒ | ᱵᱟᱨ (Bar) | *बार* | 🍃🍃 2 पत्ते |
| **3** | ᱓ | ᱯᱮ (Pe) | *पे* | 🍃🍃🍃 3 महुआ फूल |
| **4** | ᱔ | ᱯᱩᱱ (Pun) | *पून* | 🍃🍃🍃🍃 4 कंकड़ |
| **5** | ᱕ | ᱢᱚᱬᱮ (Mone) | *मोणे* | ✋ एक हाथ की 5 उंगलियां |
| **6** | ᱖ | ᱛᱩᱨᱩᱭ (Turuy) | *तुरुय* | 🍃x6 6 छोटे बीज |
| **7** | ᱗ | ᱮᱭᱟᱭ (Eyay) | *एयाय* | 🍃x7 7 दाने |
| **8** | ᱘ | ᱤᱨᱟᱹᱞ (Iral) | *इरौल* | 🍃x8 8 टहनियां |
| **9** | ᱙ | ᱟᱨᱮ (Are) | *आरे* | 🍃x9 9 कंकड़ |
| **10** | ᱑᱐ | ᱜᱮᱞ (Gel) | *गेल* | 👐 दोनों हाथों की 10 उंगलियां |

💡 **कक्षा खेल:** शिक्षक ताली बजाएं (उदा. 3 बार), बच्चे कोरस में कहें: *"ᱯᱮ (Pe)!"*`;
        suggestedChips = ['📝 गणित वर्कशीट बनाएं', '🃏 अंक फ्लैशकार्ड', '🎲 सफारी बोर्ड गेम'];
      }
      break;

    case 'ASSESSMENT':
      if (language === 'ho') {
        title = '📋 NIPUN Bharat Ho Oral Diagnostic Rubric';
        audioSpeakText = 'नेया चितिर रे चिनाः लेल तनाम? अमाः नुतुम चिनाः?';
        actionSteps = [
          'Conduct assessment in warm, friendly Ho dialogue',
          'Accept answer in Ho, Hindi, or mixed code',
          'Score: Level 3 (Mastered), Level 2 (Developing), Level 1 (Emerging)'
        ];
        replyText = `### 📊 कक्षा 1-3 NIPUN Bharat मौखिक आकलन — Ho (हो भाषा)
मातृभाषा आधारित समझ का मूल्यांकन (No-Stress Diagnostic Check):

1. **प्रश्न 1 (व्यक्तिगत परिचय / Self Identity):**
   - **शिक्षक पूछें:** *"अमाः नुतुम चिनाः?"* (Amag nutum china? - तुम्हारा नाम क्या है?)
   - **अपेक्षित उत्तर:** *"अइंग्आः नुतुम [नाम] तनाः"* या केवल नाम।
   - **ग्रेडिंग:** 🟢 स्तर 3 (पूर्ण वाक्य) | 🟡 स्तर 2 (केवल नाम) | 🔴 स्तर 1 (मौन/संकोच)

2. **प्रश्न 2 (वस्तु पहचान / Environmental Lexicon):**
   - शिक्षक किताब दिखाकर पूछें: *"नेया दो चिनाः तनाः?"*
   - **अपेक्षित उत्तर:** *"पुथि"* (Puthi) अथवा "किताब/Book".

3. **प्रश्न 3 (कार्यात्मक निर्देश पालन / Command Comprehension):**
   - शिक्षक कहें: *"अमाः पुथि झिज में"* (Open your book).
   - **अपेक्षित क्रिया:** बच्चा बिना अनुवाद के अपनी पुस्तक खोले।`;
        suggestedChips = ['📝 हो आकलन पत्रक', '📋 हो पाठ योजना देखें'];
      } else if (language === 'mundari') {
        title = '📋 NIPUN Bharat Mundari Oral Diagnostic Rubric';
        audioSpeakText = 'नेया चितिर रे चिनाः नेले तनाम? अमाः नुतुम चिनाः?';
        actionSteps = [
          'Conduct friendly diagnostic chat in Mundari',
          'Celebrate child’s self-expression in mother tongue',
          'Document mastery on 3-tier NIPUN scale'
        ];
        replyText = `### 📊 कक्षा 1-3 NIPUN Bharat मौखिक आकलन — Mundari (मुण्डारी)
मातृभाषा आधारित समझ का मूल्यांकन (No-Stress Diagnostic Check):

1. **प्रश्न 1 (व्यक्तिगत परिचय / Self Identity):**
   - **शिक्षक पूछें:** *"अमाः नुतुम चिनाः?"* (Amag nutum china? - तुम्हारा नाम क्या है?)
   - **अपेक्षित उत्तर:** *"अइंग्आः नुतुम [नाम] तनाः"* या केवल नाम।
   - **ग्रेडिंग:** 🟢 स्तर 3 (पूर्ण वाक्य) | 🟡 स्तर 2 (केवल नाम) | 🔴 स्तर 1 (मौन/संकोच)

2. **प्रश्न 2 (वस्तु पहचान / Environmental Lexicon):**
   - शिक्षक किताब दिखाकर पूछें: *"नेया दो चिनाः तनाः?"*
   - **अपेक्षित उत्तर:** *"पुथी"* (Puthi) अथवा "किताब/Book".

3. **प्रश्न 3 (कार्यात्मक निर्देश पालन / Command Comprehension):**
   - शिक्षक कहें: *"अमाः पुथी झिज में"* (Open your book).
   - **अपेक्षित क्रिया:** बच्चा बिना अनुवाद के अपनी पुस्तक खोले।`;
        suggestedChips = ['📝 मुण्डारी आकलन पत्रक', '📋 पाठ योजना देखें'];
      } else {
        title = '📋 NIPUN Bharat MTB-MLE Oral Diagnostic Rubric (Santali)';
        audioSpeakText = 'ᱱᱚᱶᱟ ᱪᱤᱛᱟᱹᱨ ᱨᱮ ᱪᱮᱫ ᱮᱢ ᱧᱮᱞᱮᱫᱼᱟ? ᱟᱢᱟᱜ ᱧᱩᱛᱩᱢ ᱪᱮᱫ?';
        actionSteps = [
          'Conduct assessment in friendly 1-on-1 dialogue',
          'Allow response in mother tongue, Hindi, or mixed code',
          'Record mastery level: Emerging, Progressing, Mastered'
        ];
        replyText = `### 📊 कक्षा 1-3 NIPUN Bharat मौखिक आकलन प्रश्नोत्तरी
मातृभाषा आधारित समझ का मूल्यांकन (No-Stress Diagnostic Check):

1. **प्रश्न 1 (व्यक्तिगत परिचय / Self Identity):**
   - **शिक्षक पूछें:** *"ᱟᱢᱟᱜ ᱧᱩᱛᱩᱢ ᱫᱚ ᱪᱮᱫ?"* (Amag nyutum do ched?)
   - **अपेक्षित उत्तर:** *"ᱤᱧᱟᱜ ᱧᱩᱛᱩᱢ ᱫᱚ [नाम] ᱠᱟᱱᱟ"* या केवल नाम।
   - **ग्रेडिंग:** 🟢 स्तर 3 (पूर्ण वाक्य) | 🟡 स्तर 2 (केवल नाम) | 🔴 स्तर 1 (मौन/संकोच)

2. **प्रश्न 2 (वस्तु पहचान / Environmental Lexicon):**
   - शिक्षक किताब दिखाकर पूछें: *"ᱱᱚᱶᱟ ᱫᱚ ᱪᱮᱫ ᱠᱟᱱᱟ?"*
   - **अपेक्षित उत्तर:** *"ᱯᱩᱛᱷᱤ"* (Puthi) अथवा "किताब/Book".

3. **प्रश्न 3 (कार्यात्मक निर्देश पालन / Command Comprehension):**
   - शिक्षक कहें: *"ᱟᱢᱟᱜ ᱯᱩᱛᱷᱤ ᱡᱷᱤᱡᱽ ᱢᱮ"* (Open your book).
   - **अपेक्षित क्रिया:** बच्चा बिना अनुवाद के अपनी पुस्तक खोले।`;
        suggestedChips = ['📝 आकलन पत्रक प्रिंट करें', '📋 पाठ योजना देखें'];
      }
      break;

    case 'CULTURE_FESTIVAL':
      if (language === 'ho') {
        title = '🌸 Maghe & Hero Parab (Ho Indigenous Festivals)';
        audioSpeakText = 'सनाम कोगे मागे परब रेनाः बुगिया जोहार!';
        actionSteps = [
          'Introduce the sacred Maghe festival of Kolhan',
          'Explain Desawali and Jaher worship traditions',
          'Demonstrate traditional flute and drum beats'
        ];
        replyText = `### 🌸 मागे परब (Maghe Parab) एवं हेरो परब — हो समुदाय का महान प्रकृति उत्सव
कोल्हान (प० सिंहभूम) के 'हो' समुदाय का सर्वाधिक पावन नववर्ष व कृषि पर्व:

- **महत्व:** माघ मास में जब धान कटाई पूरी होती है, तब प्रकृति व पूर्वजों के प्रति आभार व्यक्त करने हेतु मागे परब मनाया जाता है।
- **पारंपरिक अभिवादन:**
  - *"सनाम कोगे मागे परब रेनाः बुगिया जोहार!"*  
    (सभी को मागे परब की हार्दिक शुभकामनाएं व जोहार!)
- **कक्षा गतिविधि विचार:**
  - बच्चों से उनके गांव के 'देउरी' (पुजारी) और 'देशाउली' (पवित्र उपवन) के बारे में चर्चा करें।
  - मिट्टी या पत्तों से पारंपरिक 'दमा' व 'रुतुम' (बांसुरी) का चित्र बनवाएं।`;
        suggestedChips = ['🎶 मागे लोक गीत', '🃏 संस्कृति फ्लैशकार्ड'];
      } else if (language === 'mundari') {
        title = '🌸 Sarhul & Karam Parab (Mundari Heritage Festivals)';
        audioSpeakText = 'सनाम कोगे बा परब अड़ो सरहुल रेनाः जोहार!';
        actionSteps = [
          'Introduce Sarhul (Baa Parab) and blooming Sal flowers',
          'Narrate Bhagwan Birsa Munda’s inspiring teachings',
          'Sing community greeting: Johar!'
        ];
        replyText = `### 🌸 सरहुल (बा परब / Sarhul) — मुण्डारी संस्कृति का वसंतोत्सव
मुण्डा समुदाय का सर्वाधिक पावन प्रकृति पर्व:

- **महत्व:** जब फागुन-चैत्र में साल के वृक्षों पर नए श्वेत फूल (सरजम बाहा) खिलते हैं, तब पाहन द्वारा 'जाहेर एड़ा' में पूजा कर धरती और सूर्य के विवाह का प्रतीक पर्व मनाया जाता है।
- **पारंपरिक अभिवादन:**
  - *"सनाम कोगे बा परब अड़ो सरहुल रेनाः जोहार!"*  
    (सभी को सरहुल एवं बा परब का पावन जोहार!)
- **कक्षा गतिविधि विचार:**
  - भगवान बिरसा मुंडा के जीवन मूल्यों और जल-जंगल-ज़मीन के संरक्षण पर 5 मिनट की प्रेरक चर्चा।
  - साल के पत्तों की थाली (साकम पातर) बनाने की हस्तकला गतिविधि।`;
        suggestedChips = ['🎶 सरहुल लोक गीत', '🃏 संस्कृति फ्लैशकार्ड'];
      } else {
        title = '🌺 Baha Parab (Spring Flower Festival) Guide (Santali)';
        audioSpeakText = 'ᱥᱟᱱᱟᱢ ᱠᱚᱜᱮ ᱵᱟᱦᱟ ᱯᱚᱨᱚᱵᱽ ᱨᱮᱱᱟᱜ ᱞᱟᱥᱟᱬᱦᱮᱫ ᱡᱚᱦᱟᱨ!';
        actionSteps = [
          'Introduce the sacred Sal blossom (ᱥᱟᱨᱡᱚᱢ ᱵᱟᱦᱟ)',
          'Explain Jaher Than sacred grove reverence',
          'Sing community greeting: Johar!'
        ];
        replyText = `### 🌸 बाहा परब (Baha Parab) — आदि संस्कृति का वसंतोत्सव
संथाल, हो और मुंडा जनजातियों का सर्वाधिक पवित्र प्रकृति पर्व:

- **महत्व:** जब फागुन-चैत में साल (Sarjom) और महुआ (Matkom) के पेड़ों में नए फूल खिलते हैं, तब प्रकृति को धन्यवाद देकर ही नए फल-फूल ग्रहण किए जाते हैं।
- **पारंपरिक अभिवादन:**
  - *"ᱥᱟᱱᱟᱢ ᱠᱚᱜᱮ ᱵᱟᱦᱟ ᱯᱚᱨᱚᱵᱽ ᱨᱮᱱᱟᱜ ᱥᱟᱹᱜᱩᱱ ᱡᱚᱦᱟᱨ!"*  
    (Sanam koge Baha Porob renag sagun johar! - सभी को बाहा पर्व का सगुन जोहार!)
- **कक्षा गतिविधि विचार:**
  - कक्षा में ताजे साल या महुआ के फूल लाकर बच्चों से उनके संथाली नाम पूछें।
  - मिट्टी या कागज से पारंपरिक 'मांडर' (Mandar) ढोल का मॉडल बनवाएं।`;
        suggestedChips = ['🎶 बाहा लोक गीत सुनें', '🃏 संस्कृति फ्लैशकार्ड'];
      }
      break;
  }

  const latency = Math.max(0.25, +(performance.now() - startTime).toFixed(2));

  return {
    title,
    reply_text: replyText,
    replyText,
    suggested_chips: suggestedChips,
    audio_speak_text: audioSpeakText,
    audioSpeakText,
    intent,
    latency_ms: latency,
    grade,
    target_lang: language,
    action_steps: actionSteps
  };
}
