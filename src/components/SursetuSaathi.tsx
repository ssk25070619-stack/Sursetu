import React, { useState, useEffect } from 'react';
import { Bot, Send, Volume2, Sparkles, BookOpen, Clock, CheckCircle, Copy, Share2, HelpCircle, Mic, MicOff, AlertCircle } from 'lucide-react';
import { generateAssistantResponse } from '../engine/assistantEngine';
import { speechEngine } from '../engine/speechEngine';
import { AssistantResponse, PedagogicalIntent, IndigenousLanguage } from '../types';
import { SUPPORTED_LANGUAGES } from '../data/languages';

interface SursetuSaathiProps {
  initialQuery?: string;
  onNavigateToWorksheets?: (type: string) => void;
  language?: IndigenousLanguage;
}

export const SursetuSaathi: React.FC<SursetuSaathiProps> = ({
  initialQuery,
  onNavigateToWorksheets,
  language = 'santali'
}) => {
  const currentLangConfig = SUPPORTED_LANGUAGES.find(l => l.id === language) || SUPPORTED_LANGUAGES[0];
  const [query, setQuery] = useState(initialQuery || 'कक्षा 1 के लिए पाठ योजना बनाओ');
  const [grade, setGrade] = useState('Grade 1');
  const [response, setResponse] = useState<AssistantResponse>(
    generateAssistantResponse(initialQuery || 'कक्षा 1 के लिए पाठ योजना बनाओ', 'Grade 1', language)
  );
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [copied, setCopied] = useState(false);

  // Real-time Voice-to-Text SpeechRecognition States
  const [isListening, setIsListening] = useState(false);
  const [interimTranscript, setInterimTranscript] = useState('');
  const [speechError, setSpeechError] = useState<string | null>(null);

  // Cleanup speech recognition on unmount
  useEffect(() => {
    return () => {
      speechEngine.stopSpeechRecognition();
    };
  }, []);

  // Automatically update assistant response when language or grade changes
  useEffect(() => {
    const res = generateAssistantResponse(query, grade, language);
    setResponse(res);
  }, [language, grade]);

  const handleSubmit = (q: string = query) => {
    if (!q.trim()) return;
    const res = generateAssistantResponse(q, grade, language);
    setResponse(res);
  };

  // Toggle voice recognition for questions/prompts
  const handleToggleVoiceInput = () => {
    if (isListening) {
      speechEngine.stopSpeechRecognition();
      setIsListening(false);
      setInterimTranscript('');
      return;
    }

    setSpeechError(null);
    setInterimTranscript('');

    const started = speechEngine.startSpeechRecognition({
      lang: 'hi-IN',
      continuous: false,
      interimResults: true,
      onStart: () => {
        setIsListening(true);
        speechEngine.playMandarDrumBeat();
      },
      onResult: (text, isFinal, interim) => {
        setInterimTranscript(interim);
        if (text) {
          setQuery(text);
          if (isFinal) {
            handleSubmit(text);
          }
        }
      },
      onError: (err) => {
        console.warn('SpeechRecognition error in SursetuSaathi:', err);
        setIsListening(false);
        setInterimTranscript('');
        if (err === 'not-allowed') {
          setSpeechError('Microphone permission was denied. Please allow microphone access in browser.');
        } else if (err === 'no-speech') {
          setSpeechError('No speech detected. Please speak clearly into your microphone.');
        } else {
          setSpeechError(`Voice input error: ${err}`);
        }
        setTimeout(() => setSpeechError(null), 4500);
      },
      onEnd: () => {
        setIsListening(false);
        setInterimTranscript('');
      }
    });

    if (!started) {
      setSpeechError('Speech recognition is not supported in this browser. Please use Chrome, Edge, or Safari.');
      setTimeout(() => setSpeechError(null), 4500);
    }
  };

  const handleSpeak = () => {
    if (!response.audio_speak_text && !response.audioSpeakText) return;
    const speakText = response.audio_speak_text || response.audioSpeakText || '';
    setIsSpeaking(true);
    speechEngine.speakText(
      speakText,
      language === 'santali' ? 'sat_Olck' : 'hin_Deva',
      () => {
        setIsSpeaking(false);
      }
    );
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(response.reply_text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Pre-configured classroom prompts tailored by language
  const PROMPTS_BY_LANG: Record<IndigenousLanguage, { label: string; query: string }[]> = {
    english: [
      { label: '📋 Grade 1 Multilingual Lesson Plan', query: 'Create a Grade 1 lesson plan for multilingual tribal learners' },
      { label: '🗣️ Classroom Instructions & Routine Matrix', query: 'How to give bilingual instructions for opening books and circle time' },
      { label: '🎶 Folk Story: The Forest Bird & Sal Tree', query: 'Tell a bilingual folk story about a bird and a sal tree' },
      { label: '🔢 Multilingual 1 to 10 Counting Activity', query: 'Activity to teach numbers 1 to 10 across Santali, Ho, and Mundari' },
      { label: '📊 NIPUN Bharat FLN Oral Assessment Rubric', query: 'Generate NIPUN Bharat oral assessment questions for Grade 1' },
      { label: '🌸 Baha, Maghe & Sarhul Tribal Heritage Note', query: 'Explain the cultural significance of tribal spring festivals' }
    ],
    santali: [

      { label: '📋 कक्षा 1 संथाली पाठ योजना', query: 'कक्षा 1 के लिए पाठ योजना बनाओ' },
      { label: '🗣️ बच्चों से किताब खोलने को कैसे कहें', query: 'बच्चों से किताब खोलने को कैसे कहें' },
      { label: '🎶 चिड़िया और पेड़ की संथाली कहानी', query: 'चिड़िया और पेड़ की कहानी सुनाओ' },
      { label: '🔢 1 से 10 तक संथाली गिनती गतिविधि', query: '1 से 10 तक गिनती सिखाने की गतिविधि' },
      { label: '📊 NIPUN Bharat संथाली मौखिक आकलन', query: 'NIPUN Bharat मौखिक आकलन प्रश्न' },
      { label: '🌸 बाहा परब (Baha Festival) संथाली परंपरा', query: 'बाहा परब (Baha Festival) के बारे में बताओ' }
    ],
    ho: [
      { label: '📋 कक्षा 1 हो (कोल्हान) पाठ योजना', query: 'कक्षा 1 के लिए पाठ योजना बनाओ' },
      { label: '🗣️ हो भाषा में किताब खोलने को कैसे कहें', query: 'बच्चों से किताब खोलने को कैसे कहें' },
      { label: '🎶 हो लोक कथा: चिड़िया और साल पेड़', query: 'चिड़िया और पेड़ की कहानी सुनाओ' },
      { label: '🔢 हो भाषा में 1 से 10 गिनती (Miyad, Baria...)', query: '1 से 10 तक गिनती सिखाने की गतिविधि' },
      { label: '📊 NIPUN Bharat हो मौखिक आकलन प्रश्न', query: 'NIPUN Bharat मौखिक आकलन प्रश्न' },
      { label: '🌸 मागे परब (Maghe Parab) हो संस्कृति', query: 'बाहा परब (Baha Festival) के बारे में बताओ' }
    ],
    kurukh: [
      { label: '📋 कक्षा 1 कुड़ुख़ पाठ योजना (गुमला/लोहरदगा/राँची)', query: 'कक्षा 1 के लिए पाठ योजना बनाओ' },
      { label: '🗣️ कुड़ुख़ में कक्षा अनुशासन निर्देश तालिका', query: 'बच्चों से किताब खोलने को कैसे कहें' },
      { label: '🎶 कुड़ुख़ लोक कथा: नन्हीं चिड़िया और सखुवा', query: 'चिड़िया और पेड़ की कहानी सुनाओ' },
      { label: '🔢 कुड़ुख़ में 1 से 10 गिनती (Ond, Ind, Mund...)', query: '1 से 10 तक गिनती सिखाने की गतिविधि' },
      { label: '📊 NIPUN Bharat कुड़ुख़ मौखिक आकलन', query: 'NIPUN Bharat मौखिक आकलन प्रश्न' },
      { label: '🌸 करम एवं सरहुल (Karam/Sarhul) कुड़ुख़ पर्व', query: 'बाहा परब (Baha Festival) के बारे में बताओ' }
    ],
    mundari: [
      { label: '📋 कक्षा 1 मुण्डारी पाठ योजना (खूंटी/छोटानागपुर)', query: 'कक्षा 1 के लिए पाठ योजना बनाओ' },
      { label: '🗣️ मुण्डारी में अनुशासन निर्देश तालिका', query: 'बच्चों से किताब खोलने को कैसे कहें' },
      { label: '🎶 मुण्डारी लोक कथा: चिड़िया और साल का पेड़', query: 'चिड़िया और पेड़ की कहानी सुनाओ' },
      { label: '🔢 मुण्डारी में 1 से 10 गिनती (Miyad, Mode...)', query: '1 से 10 तक गिनती सिखाने की गतिविधि' },
      { label: '📊 NIPUN Bharat मुण्डारी मौखिक आकलन', query: 'NIPUN Bharat मौखिक आकलन प्रश्न' },
      { label: '🌸 सरहुल एवं बा परब (Sarhul) मुण्डारी पर्व', query: 'बाहा परब (Baha Festival) के बारे में बताओ' }
    ]
  };

  const curatedPrompts = PROMPTS_BY_LANG[language] || PROMPTS_BY_LANG.santali;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-amber-950/30 to-slate-900 border border-amber-500/20 rounded-2xl p-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-xs font-semibold uppercase tracking-wider border border-amber-500/30 flex items-center gap-1.5">
                <span>{currentLangConfig.icon}</span>
                <span>Pedagogical AI Co-Pilot • {currentLangConfig.name}</span>
              </span>
              <span className="text-xs text-slate-400 font-medium">
                {currentLangConfig.nativeName} ({currentLangConfig.region})
              </span>
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight">
              Sur Saathi — Teaching Co-Pilot for Non-Native Educators
            </h2>
            <p className="text-slate-400 text-sm mt-1 max-w-2xl">
              Provides NIPUN Bharat 15-minute lesson matrices, bilingual command tables, folk storytelling, and oral assessment rubrics with 0ms edge response.
            </p>
          </div>

          {/* Grade Selector */}
          <div className="flex items-center gap-2 bg-slate-950 p-1.5 rounded-xl border border-slate-800 text-xs">
            <span className="text-slate-400 pl-2">Target Grade:</span>
            {['Grade 1', 'Grade 2', 'Grade 3'].map((g) => (
              <button
                key={g}
                onClick={() => {
                  setGrade(g);
                  const res = generateAssistantResponse(query, g, language);
                  setResponse(res);
                }}
                className={`px-3 py-1.5 rounded-lg font-medium transition cursor-pointer ${
                  grade === g ? 'bg-amber-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {g}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Query Bar & Curated Chips */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1 flex items-center">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
              placeholder={`Ask Sur Saathi for ${currentLangConfig.name} (e.g. 'कक्षा 1 के लिए पाठ योजना', 'गिनती गतिविधि')...`}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-4 pr-12 py-3 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 text-sm"
            />
            {/* Inline mic toggle button inside input field */}
            <button
              type="button"
              onClick={handleToggleVoiceInput}
              className={`absolute right-2 p-2 rounded-lg transition cursor-pointer ${
                isListening
                  ? 'bg-red-600 text-white animate-pulse shadow-md shadow-red-900/50'
                  : 'bg-slate-900 hover:bg-slate-800 text-amber-400 hover:text-amber-300 border border-slate-800'
              }`}
              title={isListening ? 'Click to stop listening' : 'Click to speak via Web SpeechRecognition API'}
            >
              {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>
          </div>

          {/* Voice query button */}
          <button
            onClick={handleToggleVoiceInput}
            className={`px-4 py-3 rounded-xl border text-sm font-semibold transition cursor-pointer flex items-center justify-center gap-2 ${
              isListening
                ? 'bg-red-600 border-red-500 text-white animate-pulse'
                : 'bg-slate-950 hover:bg-slate-850 text-amber-400 border-amber-500/30'
            }`}
            title="Speech-to-text input"
          >
            {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            <span>{isListening ? 'Listening...' : 'Voice Ask'}</span>
          </button>

          <button
            onClick={() => handleSubmit()}
            className="px-6 py-3 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-semibold text-sm transition shadow-lg shadow-amber-900/40 flex items-center justify-center gap-2 cursor-pointer"
          >
            <Send className="w-4 h-4" />
            <span>Generate Plan</span>
          </button>
        </div>

        {/* Real-time Voice-to-Text Listening Banner */}
        {isListening && (
          <div className="p-3 rounded-xl bg-gradient-to-r from-red-950/70 via-slate-950 to-amber-950/70 border border-red-500/40 flex items-center justify-between text-xs animate-fade-in shadow-inner">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="flex items-end gap-0.5 h-3.5 shrink-0">
                <span className="w-1 bg-red-400 rounded-full animate-pulse h-3" />
                <span className="w-1 bg-amber-400 rounded-full animate-pulse h-3.5 delay-75" />
                <span className="w-1 bg-red-400 rounded-full animate-pulse h-2 delay-150" />
              </div>
              <span className="text-amber-300 font-semibold shrink-0">
                🎙️ Listening Live (बोलें):
              </span>
              <span className="text-white italic truncate font-mono">
                {interimTranscript ? `"${interimTranscript}"` : 'Speak your question in Hindi or English...'}
              </span>
            </div>
            <div className="flex items-center gap-2 shrink-0 ml-2">
              <button
                onClick={() => {
                  speechEngine.stopSpeechRecognition();
                  setIsListening(false);
                  if (query.trim()) handleSubmit(query);
                }}
                className="px-2.5 py-1 rounded-md bg-amber-600 hover:bg-amber-500 text-white text-[11px] font-bold uppercase transition cursor-pointer"
              >
                Send
              </button>
              <button
                onClick={handleToggleVoiceInput}
                className="px-2 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] transition cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Speech Error Banner */}
        {speechError && (
          <div className="p-2.5 rounded-xl bg-red-950/60 border border-red-500/40 text-red-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
            <span>{speechError}</span>
          </div>
        )}

        {/* Curated Prompt Chips */}
        <div className="flex flex-wrap gap-2 pt-1">
          {curatedPrompts.map((item, idx) => (
            <button
              key={idx}
              onClick={() => {
                setQuery(item.query);
                handleSubmit(item.query);
              }}
              className="px-3 py-1.5 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 text-xs text-slate-300 hover:text-amber-300 transition cursor-pointer flex items-center gap-1.5"
            >
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Co-Pilot Generated Response View */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
        {/* Title bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-3">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400">
              Intent: {response.intent}
            </span>
            <h3 className="text-xl font-bold text-white mt-0.5">{response.title}</h3>
          </div>

          <div className="flex items-center gap-2">
            {response.audioSpeakText && (
              <button
                onClick={handleSpeak}
                disabled={isSpeaking}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition cursor-pointer shadow-md shadow-emerald-900/30"
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>{isSpeaking ? 'Speaking...' : 'Speak Tribal Dialogue'}</span>
              </button>
            )}

            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition cursor-pointer"
            >
              {copied ? <CheckCircle className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
        </div>

        {/* Action Steps timeline if available */}
        {response.action_steps && response.action_steps.length > 0 && (
          <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5 mb-3">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              15-Minute Class Flow Timeline
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
              {response.action_steps.map((step, idx) => (
                <div key={idx} className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-xs">
                  <div className="font-semibold text-amber-300 mb-1">Step {idx + 1}</div>
                  <div className="text-slate-300 text-[11px] leading-relaxed">{step}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Main Response Content Display (Formatted Markdown-style) */}
        <div className="bg-slate-950 border border-slate-800 rounded-xl p-6 text-slate-200 text-sm leading-relaxed whitespace-pre-line font-sans">
          {response.replyText}
        </div>

        {/* Suggested Next Action Chips */}
        {response.suggested_chips && response.suggested_chips.length > 0 && (
          <div className="pt-2">
            <span className="text-xs text-slate-400 font-medium block mb-2">
              Next Suggested Steps for Classroom:
            </span>
            <div className="flex flex-wrap gap-2">
              {response.suggested_chips.map((chip, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    if (chip.includes('वर्कशीट') && onNavigateToWorksheets) {
                      onNavigateToWorksheets('matching');
                    } else if (chip.includes('गणित') && onNavigateToWorksheets) {
                      onNavigateToWorksheets('counting');
                    } else {
                      setQuery(chip);
                      handleSubmit(chip);
                    }
                  }}
                  className="px-3 py-1.5 rounded-lg bg-emerald-950/40 hover:bg-emerald-900/50 border border-emerald-500/30 text-emerald-300 text-xs font-medium transition cursor-pointer"
                >
                  {chip}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Co-Pilot Metadata footer */}
        <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-500">
          <span>Dual-Redundancy Engine: Offline Rule-Based Knowledge Engine (0.1ms)</span>
          <span className="text-amber-400 font-mono">NEP 2020 & NIPUN Bharat Verified</span>
        </div>
      </div>
    </div>
  );
};
