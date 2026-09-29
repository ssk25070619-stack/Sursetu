import React, { useState } from 'react';
import {
  Volume2,
  Sparkles,
  BookOpen,
  Layers,
  Search,
  Filter,
  Printer,
  CheckCircle2,
  ArrowRight,
  Hash,
  Calculator,
  Info
} from 'lucide-react';
import { BARAKHADI_CONSONANTS, BARAKHADI_VOWELS, BarakhadiRow } from '../data/barakhadiData';
import {
  OL_CHIKI_DIGITS,
  COMPOUND_NUMBERS_GUIDE,
  transduceDigitsToOlChiki,
  formatSantaliNumberWords
} from '../data/santaliNumerals';
import { transduceDevaToOlChiki } from '../engine/nlpEngine';
import { speechEngine } from '../engine/speechEngine';
import { StrokeTracingModal } from './StrokeTracingModal';

export const BarakhadiWallChart: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'barakhadi' | 'numerals'>('barakhadi');
  const [selectedVarga, setSelectedVarga] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeCell, setActiveCell] = useState<{ deva: string; olchiki: string; roman: string } | null>(null);

  // Interactive Letter Tracing Modal State
  const [tracingLetter, setTracingLetter] = useState<BarakhadiRow | null>(null);

  // Number Converter Interactive State
  const [calcInput, setCalcInput] = useState<string>('2026');

  const VARGAS = [
    'all',
    'क-वर्ग (Velar)',
    'च-वर्ग (Palatal)',
    'ट-वर्ग (Retroflex)',
    'त-वर्ग (Dental)',
    'प-वर्ग (Labial)',
    'अन्तःस्थ (Semivowels)',
    'ऊष्म (Sibilants)',
    'संयुक्त (Conjuncts)'
  ];

  const filteredConsonants = BARAKHADI_CONSONANTS.filter(row => {
    const matchesVarga = selectedVarga === 'all' || row.varga === selectedVarga;
    const matchesSearch =
      !searchQuery ||
      row.devaConsonant.includes(searchQuery) ||
      row.olchikiBase.includes(searchQuery) ||
      row.roman.toLowerCase().includes(searchQuery.toLowerCase()) ||
      row.sound.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesVarga && matchesSearch;
  });

  const handlePlaySound = (devaText: string, olchikiText: string) => {
    setActiveCell({ deva: devaText, olchiki: olchikiText, roman: '' });
    speechEngine.speakText(devaText, 'hin_Deva');
  };

  const parsedCalcNumber = parseInt(calcInput, 10);
  const formattedCalcWords = !isNaN(parsedCalcNumber)
    ? formatSantaliNumberWords(parsedCalcNumber)
    : null;
  const calcOlChikiDigits = transduceDigitsToOlChiki(calcInput);

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-emerald-950/40 to-slate-900 border border-emerald-500/20 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold uppercase tracking-wider border border-emerald-500/30">
                Phonetic Orthography & Numeracy Pedagogy
              </span>
              <span className="text-xs text-slate-400">
                {activeTab === 'barakhadi'
                  ? 'Devanagari ⇄ Ol Chiki (ᱥᱟᱱᱛᱟᱲᱤ) Barakhadi'
                  : 'Santali Native Numerals (᱐-᱙ / U+1C50–U+1C59)'}
              </span>
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight">
              {activeTab === 'barakhadi'
                ? 'Hindi ⇄ Santali Barakhadi Wall Chart & Matrix'
                : 'Santali Native Numerals (ᱮᱞ ᱟᱨ ᱞᱮᱠᱷᱟ) & Compound Counting'}
            </h2>
            <p className="text-slate-400 text-sm mt-1 max-w-3xl">
              {activeTab === 'barakhadi'
                ? 'Complete letter-by-letter consonant base sound and 12-vowel form matrix. Trained on exact phonological mappings (sibilant collapse, aspirate digraphs, and diphthong glides).'
                : 'Full Unicode Ol Chiki digits (U+1C50–U+1C59), compound numeral building, vigesimal (base-20 "isi") structure, and live digit transducer.'}
            </p>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            {/* Tab Switcher */}
            <div className="flex bg-slate-950/80 p-1 rounded-xl border border-slate-800">
              <button
                onClick={() => setActiveTab('barakhadi')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer ${
                  activeTab === 'barakhadi'
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-950'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Barakhadi Chart</span>
              </button>
              <button
                onClick={() => setActiveTab('numerals')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer ${
                  activeTab === 'numerals'
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-950'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Hash className="w-3.5 h-3.5" />
                <span>Numerals (᱐–᱙) & Counting</span>
              </button>
            </div>

            <button
              onClick={() => window.print()}
              className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-semibold transition flex items-center gap-2 cursor-pointer shadow-sm"
            >
              <Printer className="w-3.5 h-3.5 text-emerald-400" />
              <span>Print Classroom Chart</span>
            </button>
          </div>
        </div>

        {/* Filter & Search Bar (Only shown on Barakhadi tab) */}
        {activeTab === 'barakhadi' && (
          <div className="mt-6 flex flex-col sm:flex-row items-center gap-3">
            {/* Search Box */}
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search letter (e.g., क, ᱠ, k, kha, ᱛ)..."
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-950/80 border border-slate-800 text-slate-200 placeholder-slate-500 text-xs focus:outline-none focus:border-emerald-500 transition"
              />
            </div>

            {/* Varga Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
              {VARGAS.map(v => (
                <button
                  key={v}
                  onClick={() => setSelectedVarga(v)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition cursor-pointer ${
                    selectedVarga === v
                      ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-900/40'
                      : 'bg-slate-900 text-slate-400 hover:text-slate-200 hover:bg-slate-800 border border-slate-800'
                  }`}
                >
                  {v === 'all' ? 'All Letters' : v.split(' ')[0]}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: BARAKHADI MATRIX */}
      {/* ========================================================================= */}
      {activeTab === 'barakhadi' && (
        <>
          {/* Rules & Linguistic Insights Pill Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 flex items-start gap-3">
              <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 font-bold text-sm">1</div>
              <div>
                <h4 className="text-xs font-semibold text-slate-200">Aspirate Digraphs (kh, gh, etc.)</h4>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Santali builds aspirated sounds using the <b>Oh (ᱷ)</b> modifier glyph: ᱠᱷ (ख), ᱜᱷ (घ), ᱪᱷ (छ), ᱛᱷ (थ), ᱫᱷ (ध), ᱯᱷ (फ), ᱵᱷ (भ).
                </p>
              </div>
            </div>

            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 flex items-start gap-3">
              <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 font-bold text-sm">2</div>
              <div>
                <h4 className="text-xs font-semibold text-slate-200">Sibilant & Vowel Collapse</h4>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Hindi श, ष, स all collapse to single Santali sibilant <b>ᱥ</b>. Short vs long vowels (ि/ी, ु/ू) merge to <b>ᱤ</b> and <b>ᱩ</b>.
                </p>
              </div>
            </div>

            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 flex items-start gap-3">
              <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 font-bold text-sm">3</div>
              <div>
                <h4 className="text-xs font-semibold text-slate-200">Diphthongs & Sanskrit Conjuncts</h4>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  कै/कौ map via semi-vowel glides: <b>ᱠᱚᱭ</b> (ai) & <b>ᱠᱚᱣ</b> (au). Conjuncts map sequentially: क्ष (ᱠᱥ), त्र (ᱛᱨ), ज्ञ (ᱡᱧ), श्र (ᱥᱨ).
                </p>
              </div>
            </div>
          </div>

          {/* Interactive Barakhadi Matrix Table */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
            <div className="p-4 bg-slate-950/70 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-emerald-400" />
                <span className="text-sm font-semibold text-slate-200">
                  Devanagari Consonants × 12 Vowel Forms Matrix
                </span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-400">
                  {filteredConsonants.length} Consonants
                </span>
              </div>
              <span className="text-xs text-slate-500 hidden sm:inline">
                Click any cell to hear pronunciation
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-center border-collapse">
                <thead>
                  <tr className="bg-slate-950/90 border-b border-slate-800 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    <th className="p-3 text-left sticky left-0 bg-slate-950 z-10 min-w-[120px]">
                      Consonant / वर्ण
                    </th>
                    {BARAKHADI_VOWELS.map(v => (
                      <th key={v.deva} className="p-3 min-w-[70px]">
                        <div className="text-slate-200 font-bold">{v.deva}</div>
                        <div className="text-[10px] text-emerald-400 font-mono">+{v.olchikiSuffix}</div>
                        <div className="text-[9px] text-slate-500 font-normal">{v.sound}</div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-xs">
                  {filteredConsonants.map(row => {
                    return (
                      <tr key={row.devaConsonant} className="hover:bg-slate-800/40 transition">
                        {/* Sticky Consonant Header Column */}
                        <td className="p-3 text-left sticky left-0 bg-slate-900/95 z-10 border-r border-slate-800">
                          <div className="flex items-center justify-between gap-2">
                            <div>
                              <span className="text-lg font-bold text-white mr-1.5">
                                {row.devaConsonant}
                              </span>
                              <span className="text-base font-bold text-amber-400 mr-1.5">
                                {row.olchikiBase}
                              </span>
                              <span className="text-[11px] text-slate-400">({row.sound})</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => setTracingLetter(row)}
                                className="px-1.5 py-0.5 rounded bg-emerald-500/20 hover:bg-emerald-500/40 text-emerald-300 text-[10px] font-bold border border-emerald-500/30 transition cursor-pointer"
                                title="Practice drawing this letter"
                              >
                                ✍️ Trace
                              </button>
                              <button
                                onClick={() => handlePlaySound(row.devaConsonant, row.olchikiBase)}
                                className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-emerald-400 transition cursor-pointer"
                                title="Play Audio"
                              >
                                <Volume2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                          {row.notes && (
                            <div className="text-[10px] text-slate-500 mt-0.5 leading-tight">{row.notes}</div>
                          )}
                        </td>

                        {/* 12 Barakhadi Vowel Form Cells */}
                        {BARAKHADI_VOWELS.map(v => {
                          const devaCombination =
                            v.matra === ''
                              ? row.devaConsonant
                              : row.devaConsonant + v.matra;

                          const olchikiForm = transduceDevaToOlChiki(devaCombination);

                          return (
                            <td
                              key={v.deva}
                              onClick={() => handlePlaySound(devaCombination, olchikiForm)}
                              className="p-2.5 hover:bg-emerald-950/40 cursor-pointer transition group border-r border-slate-800/30"
                            >
                              <div className="font-semibold text-slate-200 group-hover:text-emerald-300 text-sm">
                                {devaCombination}
                              </div>
                              <div className="font-bold text-amber-300 text-sm mt-0.5">
                                {olchikiForm}
                              </div>
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: SANTALI NUMERALS & COUNTING */}
      {/* ========================================================================= */}
      {activeTab === 'numerals' && (
        <div className="space-y-6">
          {/* 3 Core Takeaways for Numeracy */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 flex items-start gap-3">
              <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 font-bold text-sm">1</div>
              <div>
                <h4 className="text-xs font-semibold text-slate-200">Native Unicode Digits (᱐–᱙)</h4>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Ol Chiki uses distinct Unicode codepoints (<b>U+1C50–U+1C59</b>) rather than Hindu-Arabic digits for dates, page numbers, and quantities.
                </p>
              </div>
            </div>

            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 flex items-start gap-3">
              <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 font-bold text-sm">2</div>
              <div>
                <h4 className="text-xs font-semibold text-slate-200">Base-20 Vigesimal System ("isi")</h4>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  20 has its own root word <b>ᱤᱥᱤ (isi)</b>. 40 can be counted as "four-ten" (<b>ᱯᱩᱱ ᱜᱮᱞ</b>) or "two-twenty" (<b>ᱵᱟᱨ ᱤᱥᱤ</b>).
                </p>
              </div>
            </div>

            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 flex items-start gap-3">
              <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 font-bold text-sm">3</div>
              <div>
                <h4 className="text-xs font-semibold text-slate-200">Compound Counting Past 10</h4>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  11 to 19 build as <b>Ten + Unit</b> (ᱜᱮᱞ ᱢᱤᱫ, ᱜᱮᱞ ᱢᱚᱬᱮ). Higher numbers use <b>ᱥᱟᱭ (100)</b>, <b>ᱦᱟᱡᱟᱨ (1,000)</b>, <b>ᱞᱟᱠᱷ</b>, <b>ᱠᱚᱨᱚᱲ</b>.
                </p>
              </div>
            </div>
          </div>

          {/* Interactive Number Transducer & Converter */}
          <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950/30 border border-emerald-500/30 rounded-2xl p-6 shadow-xl">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  <Calculator className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Live Santali Number & Digit Transducer</h3>
                  <p className="text-xs text-slate-400">Type any number to convert into Ol Chiki native digits and spoken compound words</p>
                </div>
              </div>

              <div className="flex items-center gap-2 w-full md:w-auto">
                <input
                  type="number"
                  value={calcInput}
                  onChange={e => setCalcInput(e.target.value)}
                  placeholder="Enter number (e.g., 2026, 45, 100)..."
                  className="w-full md:w-48 px-4 py-2 rounded-xl bg-slate-950 border border-emerald-500/40 text-white font-mono text-sm focus:outline-none focus:border-emerald-400 transition"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-5">
              <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Ol Chiki Numeral Digits</span>
                <div className="text-3xl font-bold text-emerald-400 font-mono my-2">{calcOlChikiDigits || '—'}</div>
                <span className="text-[10px] text-slate-500">Unicode U+1C50–U+1C59 transliteration</span>
              </div>

              <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Spoken Ol Chiki Word</span>
                <div className="text-2xl font-bold text-amber-300 my-2">{formattedCalcWords?.olchiki || '—'}</div>
                <span className="text-[10px] text-slate-500">Devanagari: {formattedCalcWords?.deva || '—'}</span>
              </div>

              <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Phonetic Roman Pronunciation</span>
                <div className="text-xl font-bold text-cyan-300 font-mono my-2">{formattedCalcWords?.roman || '—'}</div>
                <button
                  onClick={() => formattedCalcWords?.deva && speechEngine.speakText(formattedCalcWords.deva, 'hin_Deva')}
                  className="mt-1 px-3 py-1.5 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer transition w-fit"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>Pronounce Word</span>
                </button>
              </div>
            </div>
          </div>

          {/* Table 1: Base Digits 0 - 10 */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
            <div className="p-4 bg-slate-950/70 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Hash className="w-4 h-4 text-emerald-400" />
                <span className="text-sm font-semibold text-slate-200">
                  Base Digits (0 to 10) — Native Ol Chiki Numerals & Words
                </span>
              </div>
              <span className="text-xs text-slate-500">
                Tap speaker to listen
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-950/90 border-b border-slate-800 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    <th className="p-3.5">Standard Digit</th>
                    <th className="p-3.5">Ol Chiki Numeral</th>
                    <th className="p-3.5">Unicode Hex</th>
                    <th className="p-3.5">Santali Word (Ol Chiki)</th>
                    <th className="p-3.5">Roman Transliteration</th>
                    <th className="p-3.5">Hindi / English</th>
                    <th className="p-3.5 text-right">Audio</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {OL_CHIKI_DIGITS.map(item => (
                    <tr key={item.digit} className="hover:bg-slate-800/40 transition">
                      <td className="p-3.5 font-mono text-sm text-slate-300 font-bold">
                        {item.digit}
                      </td>
                      <td className="p-3.5">
                        <span className="text-2xl font-bold text-emerald-400 font-mono">
                          {item.olChikiDigit}
                        </span>
                      </td>
                      <td className="p-3.5 font-mono text-slate-500 text-[11px]">
                        {item.unicodeHex}
                      </td>
                      <td className="p-3.5 font-bold text-amber-300 text-base">
                        {item.wordOlChiki}
                      </td>
                      <td className="p-3.5 font-mono text-cyan-300">
                        {item.wordRoman}
                      </td>
                      <td className="p-3.5 text-slate-300">
                        <div>{item.wordHindi}</div>
                        <div className="text-[10px] text-slate-500">{item.wordEnglish}</div>
                      </td>
                      <td className="p-3.5 text-right">
                        <button
                          onClick={() => speechEngine.speakText(item.wordDeva, 'hin_Deva')}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-emerald-600 hover:text-white text-slate-400 transition cursor-pointer"
                          title="Play Pronunciation"
                        >
                          <Volume2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Table 2: Compound Counting Guide Past 10 */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
            <div className="p-4 bg-slate-950/70 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-emerald-400" />
                <span className="text-sm font-semibold text-slate-200">
                  Compound Counting Past 10 — Vigesimal Structure & Higher Units
                </span>
              </div>
              <span className="text-xs text-slate-500">
                11 to 1,00,00,000 (Crore)
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-950/90 border-b border-slate-800 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    <th className="p-3.5">Value</th>
                    <th className="p-3.5">Ol Chiki Digits</th>
                    <th className="p-3.5">Ol Chiki Words</th>
                    <th className="p-3.5">Roman Pronunciation</th>
                    <th className="p-3.5">Compound Pattern & Structure</th>
                    <th className="p-3.5 text-right">Audio</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {COMPOUND_NUMBERS_GUIDE.map(item => (
                    <tr key={item.value} className="hover:bg-slate-800/40 transition">
                      <td className="p-3.5 font-mono text-sm text-slate-300 font-bold">
                        {item.value.toLocaleString()}
                      </td>
                      <td className="p-3.5 font-mono text-lg font-bold text-emerald-400">
                        {item.olChikiDigits}
                      </td>
                      <td className="p-3.5 font-bold text-amber-300 text-sm">
                        {item.wordOlChiki}
                      </td>
                      <td className="p-3.5 font-mono text-cyan-300">
                        {item.wordRoman}
                      </td>
                      <td className="p-3.5 text-slate-300">
                        <div className="font-medium text-slate-200">{item.pattern}</div>
                        {item.note && (
                          <div className="text-[10px] text-amber-400/90 mt-0.5">{item.note}</div>
                        )}
                      </td>
                      <td className="p-3.5 text-right">
                        <button
                          onClick={() => speechEngine.speakText(item.wordDeva, 'hin_Deva')}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-emerald-600 hover:text-white text-slate-400 transition cursor-pointer"
                          title="Play Pronunciation"
                        >
                          <Volume2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Interactive Letter Tracing Practice Modal */}
      {tracingLetter && (
        <StrokeTracingModal
          initialLetter={tracingLetter}
          allLetters={BARAKHADI_CONSONANTS}
          onClose={() => setTracingLetter(null)}
        />
      )}
    </div>
  );
};

