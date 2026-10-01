import React, { useState, useEffect, useRef } from 'react';
import { Printer, Download, Sparkles, CheckSquare, RefreshCw, FileText, Database, CheckCircle2, FileDown } from 'lucide-react';
import { generateWorksheet } from '../engine/worksheetGenerator';
import { WorksheetType, TargetScript, WorksheetData } from '../types';
import { offlineStorage } from '../services/offlineStorageService';
import { pdfExportService } from '../services/pdfExportService';

export const WorksheetStudio: React.FC<{ initialType?: string }> = ({ initialType }) => {
  const [selectedType, setSelectedType] = useState<WorksheetType>((initialType as WorksheetType) || 'counting');
  const [targetScript, setTargetScript] = useState<TargetScript>('sat_Olck');
  const [grade, setGrade] = useState('Grade 1');
  const [isCached, setIsCached] = useState<boolean>(true);
  const [cacheNotice, setCacheNotice] = useState<string | null>(null);

  // PDF Export States
  const [isExportingPdf, setIsExportingPdf] = useState<boolean>(false);
  const [pdfProgress, setPdfProgress] = useState<{ percent: number; message: string } | null>(null);
  const [pdfSuccess, setPdfSuccess] = useState<string | null>(null);
  const sheetRef = useRef<HTMLDivElement>(null);

  const worksheet: WorksheetData = generateWorksheet(selectedType, grade, 'school', targetScript);

  // Automatically ensure current worksheet is cached into Cache Storage
  useEffect(() => {
    offlineStorage.getNipunMaterial(selectedType, grade, targetScript);
  }, [selectedType, grade, targetScript]);

  const handleCacheAll = async () => {
    setCacheNotice('Caching all 9 NIPUN formats into Cache Storage...');
    await offlineStorage.precacheAllMaterialsAndFlashcards();
    setCacheNotice('All 9 NIPUN formats (Grades 1-3) 100% saved in Cache Storage!');
    setTimeout(() => setCacheNotice(null), 4000);
  };

  const handleExportPdf = async () => {
    if (!sheetRef.current) return;
    try {
      setIsExportingPdf(true);
      setPdfSuccess(null);
      setPdfProgress({ percent: 10, message: 'Initializing PDF engine...' });

      const filename = await pdfExportService.exportToPdf(sheetRef.current, worksheet, {
        dpiScale: 2,
        onProgress: (percent, message) => {
          setPdfProgress({ percent, message });
        },
      });

      setPdfSuccess(`PDF exported successfully: ${filename}`);
      setTimeout(() => setPdfSuccess(null), 6000);
    } catch (err) {
      console.error('PDF export failed:', err);
      alert('Could not generate PDF directly. Please use "Print A4 Worksheet" and choose "Save as PDF".');
    } finally {
      setIsExportingPdf(false);
      setPdfProgress(null);
    }
  };

  const FORMATS: { type: WorksheetType; label: string; icon: string; desc: string }[] = [
    { type: 'counting', label: '1. Math Counting & Digits', icon: '🔢', desc: 'Ol Chiki & Odia numerals with tactile leaves' },
    { type: 'matching', label: '2. Vocab & Picture Match', icon: '🧩', desc: 'Bilingual connecting line exercises' },
    { type: 'flashcards', label: '3. Cut & Fold Flashcard Grid', icon: '🃏', desc: '2x4 pocket cards for students' },
    { type: 'tracing', label: '4. Script Tracing Sheets', icon: '✍️', desc: 'Ol Chiki stroke & dotted letter guides' },
    { type: 'fill_blanks', label: '5. Sentence Fill-in-Blanks', icon: '📝', desc: 'Contextual sentence completion with word bank' },
    { type: 'lesson_script', label: '6. 15-Min Lesson Script', icon: '📜', desc: 'Step-by-step classroom action guide' },
    { type: 'rhyme', label: '7. Bilingual Folk Rhyme', icon: '🎶', desc: 'Action song sheet with cultural lyrics' },
    { type: 'assessment', label: '8. Diagnostic Assessment', icon: '📋', desc: 'FLN oral evaluation scorecard & rubrics' },
    { type: 'board_game', label: '9. Tribal Forest Board Game', icon: '🎲', desc: 'A4 safari board game with village paths' }
  ];

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Top Controls Banner (Hidden in Print) */}
      <div className="no-print bg-gradient-to-r from-slate-900 via-emerald-950/30 to-slate-900 border border-emerald-500/20 rounded-2xl p-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold uppercase tracking-wider border border-emerald-500/30">
                NIPUN Bharat & NEP 2020 Aligned
              </span>
              <span className="text-xs text-slate-400">Printable A4 Teaching Learning Materials (TLMs)</span>
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight">
              FLN Study Material & Worksheet Generator
            </h2>
            <p className="text-slate-400 text-sm mt-1 max-w-2xl">
              Generates Mother Tongue-Based Multilingual Education (MTB-MLE) worksheets formatted for standard classroom printers with zero font tofu boxes.
            </p>
          </div>

          {/* Action Row */}
          <div className="flex items-center gap-2.5 flex-wrap">
            <button
              onClick={handleCacheAll}
              className="px-3.5 py-2.5 rounded-xl bg-slate-950/80 hover:bg-slate-900 border border-emerald-500/40 text-emerald-300 font-semibold text-xs transition flex items-center gap-1.5 cursor-pointer shadow-sm"
              title="Ensure all 9 NIPUN formats are stored in browser Cache Storage"
            >
              <Database className="w-3.5 h-3.5 text-emerald-400" />
              <span>Cache All 9 Formats</span>
            </button>

            {/* Export as PDF Button */}
            <button
              onClick={handleExportPdf}
              disabled={isExportingPdf}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white font-semibold text-xs transition shadow-lg shadow-teal-900/40 flex items-center gap-2 cursor-pointer disabled:opacity-50"
              title="Export generated study material directly as a print-friendly A4 PDF file"
            >
              {isExportingPdf ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-teal-200" />
                  <span>Generating PDF...</span>
                </>
              ) : (
                <>
                  <FileDown className="w-4 h-4 text-teal-200" />
                  <span>Export as PDF</span>
                </>
              )}
            </button>

            {/* Browser Print Button */}
            <button
              onClick={handlePrint}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs transition border border-slate-700 shadow-sm flex items-center gap-2 cursor-pointer"
              title="Send directly to local physical printer via browser print dialog"
            >
              <Printer className="w-4 h-4 text-slate-300" />
              <span>Print A4</span>
            </button>
          </div>
        </div>

        {/* Live PDF Export Progress Banner */}
        {pdfProgress && (
          <div className="mt-4 p-3 rounded-xl bg-slate-950 border border-teal-500/40 text-xs text-teal-200 space-y-1.5 animate-fade-in shadow-inner">
            <div className="flex items-center justify-between">
              <span className="font-semibold flex items-center gap-2">
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-teal-400" />
                <span>{pdfProgress.message}</span>
              </span>
              <span className="font-mono font-bold text-teal-400">{pdfProgress.percent}%</span>
            </div>
            <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-teal-500 to-emerald-400 transition-all duration-300 ease-out"
                style={{ width: `${pdfProgress.percent}%` }}
              />
            </div>
          </div>
        )}

        {/* PDF Export Success Notice */}
        {pdfSuccess && (
          <div className="mt-4 p-2.5 rounded-xl bg-teal-950/80 border border-teal-500/60 text-teal-200 text-xs flex items-center gap-2 animate-fade-in">
            <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0" />
            <span className="font-medium">{pdfSuccess}</span>
          </div>
        )}

        {/* Cache feedback banner */}
        {cacheNotice && (
          <div className="mt-4 p-2.5 rounded-xl bg-emerald-950/80 border border-emerald-500/50 text-emerald-200 text-xs flex items-center gap-2 animate-fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{cacheNotice}</span>
          </div>
        )}

        {/* Filter Controls */}
        <div className="mt-5 pt-4 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-slate-400">Class Grade:</span>
            {['Grade 1', 'Grade 2', 'Grade 3'].map((g) => (
              <button
                key={g}
                onClick={() => setGrade(g)}
                className={`px-3 py-1 rounded-lg font-medium transition cursor-pointer ${
                  grade === g ? 'bg-emerald-600 text-white' : 'bg-slate-950 text-slate-400 border border-slate-800'
                }`}
              >
                {g}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-slate-400">Target Script:</span>
            <select
              value={targetScript}
              onChange={(e) => setTargetScript(e.target.value as TargetScript)}
              className="bg-slate-950 border border-slate-800 text-emerald-300 rounded-lg px-2.5 py-1 text-xs cursor-pointer font-medium"
            >
              <optgroup label="Santali (ᱥᱟᱱᱛᱟᱲᱤ)">
                <option value="sat_Olck">Santali - Ol Chiki (ᱚᱞ ᱪᱤᱠᱤ)</option>
                <option value="sat_Orya">Santali - Odia Script (ଓଡ଼ିଆ)</option>
                <option value="sat_Deva">Santali - Devanagari (संताली)</option>
                <option value="sat_Latn">Santali - Latin Roman</option>
              </optgroup>
              <optgroup label="Ho (हो भाषा)">
                <option value="ho_Wara">Ho - Warang Citi (𑢹𑣉𑣉 𑣎𑣂𑣑𑣂)</option>
                <option value="ho_Deva">Ho - Devanagari (हो)</option>
                <option value="ho_Latn">Ho - Latin Roman</option>
              </optgroup>
              <optgroup label="Mundari (मुण्डारी)">
                <option value="mun_Bani">Mundari - Mundari Bani (𞓚𞓝𞓙𞓞)</option>
                <option value="mun_Deva">Mundari - Devanagari (मुण्डारी)</option>
                <option value="mun_Latn">Mundari - Latin Roman</option>
              </optgroup>
              <optgroup label="Kurukh (कुड़ुख़ / Oraon)">
                <option value="kru_Deva">Kurukh - Devanagari (कुड़ुख़)</option>
                <option value="kru_Tolo">Kurukh - Tolong Siki (𑑎𑑚𑑎𑑙)</option>
                <option value="kru_Latn">Kurukh - Latin Roman</option>
              </optgroup>
            </select>
          </div>
        </div>
      </div>

      {/* Format Selector Pills (Hidden in Print) */}
      <div className="no-print grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-9 gap-2">
        {FORMATS.map((f) => (
          <button
            key={f.type}
            onClick={() => setSelectedType(f.type)}
            className={`p-2.5 rounded-xl border text-left transition flex flex-col justify-between cursor-pointer ${
              selectedType === f.type
                ? 'bg-emerald-950/70 border-emerald-500/60 shadow-md shadow-emerald-950'
                : 'bg-slate-900/60 border-slate-800 hover:bg-slate-900'
            }`}
          >
            <div className="text-xl mb-1">{f.icon}</div>
            <div className="text-xs font-semibold text-white leading-tight">{f.label.split('. ')[1]}</div>
          </button>
        ))}
      </div>

      {/* Print-Ready A4 Sheet Container */}
      <div
        ref={sheetRef}
        className="printable-sheet bg-white text-slate-900 rounded-2xl p-8 sm:p-12 shadow-2xl border border-slate-200 min-h-[900px]"
      >
        {/* Printable Header */}
        <div className="border-b-2 border-slate-800 pb-4 mb-6">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 uppercase tracking-wider mb-1">
                <span>🌿 SurSetu — Indigenous MTB-MLE Primary Education</span>
                <span>•</span>
                <span>NIPUN BHARAT MISSION</span>
              </div>
              <h1 className="text-2xl font-extrabold text-slate-950">{worksheet.title}</h1>
              <p className="text-xs text-slate-600 mt-0.5">
                Target Language Script: <strong className="text-slate-900">{worksheet.lang_label}</strong> | Curriculum: Mother Tongue-Based Multilingual Education (NEP 2020)
              </p>
            </div>
            <div className="text-right text-xs text-slate-600 space-y-0.5">
              <div>Date: {worksheet.generated_at}</div>
              <div className="font-semibold text-slate-900">{worksheet.grade}</div>
              <div className="no-print pt-1">
                <button
                  onClick={handleExportPdf}
                  disabled={isExportingPdf}
                  className="inline-flex items-center gap-1 text-[11px] text-emerald-700 hover:text-emerald-900 font-semibold cursor-pointer border border-emerald-300 rounded px-1.5 py-0.5 bg-emerald-50 hover:bg-emerald-100 transition disabled:opacity-50"
                  title="Direct PDF download"
                >
                  <FileDown className="w-3 h-3 text-emerald-700" />
                  <span>{isExportingPdf ? 'Exporting...' : 'Quick PDF'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Student Fill-in Box */}
          <div className="mt-4 pt-3 border-t border-dashed border-slate-300 grid grid-cols-3 gap-4 text-xs font-medium text-slate-700">
            <div>
              <span>Student Name (विद्यार्थी का नाम): </span>
              <span className="border-b border-dotted border-slate-400 inline-block w-36"></span>
            </div>
            <div>
              <span>Roll No (क्रमांक): </span>
              <span className="border-b border-dotted border-slate-400 inline-block w-24"></span>
            </div>
            <div>
              <span>Village / School (विद्यालय): </span>
              <span className="border-b border-dotted border-slate-400 inline-block w-36"></span>
            </div>
          </div>
        </div>

        {/* Dynamic Sheet Body Based on Format */}
        <div className="py-2">
          {/* Format 1: Counting */}
          {worksheet.type === 'counting' && (
            <div className="space-y-4">
              <div className="text-xs font-semibold text-slate-700 bg-slate-100 p-2.5 rounded-lg border border-slate-200">
                👉 <strong>निर्देश (Instructions):</strong> बाएं दिए गए संथाली अंकों को पहचानें, स्थानीय पत्तों को गिनें, और सामने दिए गए खाली बॉक्स में अंक लिखें।
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {worksheet.items?.map((item, idx) => (
                  <div key={idx} className="p-3 border-2 border-slate-300 rounded-xl flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg bg-emerald-50 border border-emerald-300 flex items-center justify-center text-2xl font-bold font-olchiki text-emerald-900">
                        {item.olchiki}
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 text-sm">
                          {item.name} ({item.hindi})
                        </div>
                        <div className="text-lg tracking-wider pt-0.5">{item.tactile}</div>
                      </div>
                    </div>

                    <div className="w-12 h-12 border-2 border-dashed border-slate-400 rounded-lg flex items-center justify-center text-xs text-slate-400">
                      Trace
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Format 2: Matching */}
          {worksheet.type === 'matching' && (
            <div className="space-y-4">
              <div className="text-xs font-semibold text-slate-700 bg-slate-100 p-2.5 rounded-lg border border-slate-200">
                👉 <strong>निर्देश (Instructions):</strong> चित्र व हिंदी शब्द को पहचानकर सही संथाली (Ol Chiki) शब्द से मिलान करें (Match with lines).
              </div>

              <div className="grid grid-cols-2 gap-12 pt-4">
                {/* Left Column: Picture + Hindi */}
                <div className="space-y-4">
                  <div className="font-bold text-xs uppercase text-slate-500 border-b pb-1">
                    वस्तु एवं चित्र (Column A)
                  </div>
                  {worksheet.items?.map((item, idx) => (
                    <div key={idx} className="p-3 border-2 border-slate-300 rounded-xl flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{item.emoji}</span>
                        <div>
                          <span className="font-bold text-sm text-slate-900">{item.hindi}</span>
                          <span className="text-xs text-slate-500 block">({item.english})</span>
                        </div>
                      </div>
                      <div className="w-4 h-4 rounded-full border-2 border-slate-400"></div>
                    </div>
                  ))}
                </div>

                {/* Right Column: Ol Chiki (Shuffled visually) */}
                <div className="space-y-4">
                  <div className="font-bold text-xs uppercase text-slate-500 border-b pb-1">
                    संथाली शब्द (Column B)
                  </div>
                  {worksheet.items?.slice().reverse().map((item, idx) => (
                    <div key={idx} className="p-3 border-2 border-emerald-300 bg-emerald-50/50 rounded-xl flex items-center justify-between">
                      <div className="w-4 h-4 rounded-full border-2 border-emerald-600 bg-white"></div>
                      <div className="text-right">
                        <span className="font-bold text-base text-emerald-950 font-olchiki block">
                          {item.santali}
                        </span>
                        <span className="text-xs text-slate-600 font-mono italic">
                          "{item.phonetic}"
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Format 3: Cut and Fold Flashcard Grid */}
          {worksheet.type === 'flashcards' && (
            <div className="space-y-4">
              <div className="text-xs font-semibold text-slate-700 bg-slate-100 p-2.5 rounded-lg border border-slate-200">
                👉 <strong>निर्देश:</strong> बिंदीदार रेखाओं (Dotted lines) पर कैंची से काटें और मोड़कर पॉकेट फ्लैशकार्ड बनाएं।
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                {worksheet.items?.map((item, idx) => (
                  <div key={idx} className="border-2 border-dashed border-slate-400 p-4 rounded-lg flex flex-col items-center justify-between text-center min-h-[160px]">
                    <span className="text-3xl">{item.emoji}</span>
                    <div className="py-2">
                      <div className="text-xl font-bold font-olchiki text-emerald-900">{item.olchiki}</div>
                      <div className="text-xs font-semibold text-slate-800">{item.hindi}</div>
                    </div>
                    <div className="text-[10px] text-slate-500 font-mono italic border-t pt-1 w-full">
                      {item.phonetic}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Format 4: Tracing */}
          {worksheet.type === 'tracing' && (
            <div className="space-y-4">
              <div className="text-xs font-semibold text-slate-700 bg-slate-100 p-2.5 rounded-lg border border-slate-200">
                👉 <strong>निर्देश:</strong> पंडित रघुनाथ मुर्मू द्वारा रचित ᱚᱞ ᱪᱤᱠᱤ वर्णमाला के अक्षरों को बिंदुओं के ऊपर पेंसिल चलाकर अभ्यास करें।
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                {worksheet.items?.map((item, idx) => (
                  <div key={idx} className="p-3 border-2 border-slate-300 rounded-xl flex items-center justify-between">
                    <div>
                      <div className="text-sm font-bold text-slate-900">{item.name}</div>
                      <div className="text-xs text-slate-600">प्राकृतिक रूप: {item.meaning}</div>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center text-3xl font-bold font-olchiki text-slate-900 border">
                        {item.glyph}
                      </div>
                      <div className="w-12 h-12 border-2 border-dashed border-slate-400 rounded-lg flex items-center justify-center text-2xl font-bold font-olchiki text-slate-300">
                        {item.glyph}
                      </div>
                      <div className="w-12 h-12 border-2 border-dashed border-slate-300 rounded-lg"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Format 5: Fill in Blanks */}
          {worksheet.type === 'fill_blanks' && (
            <div className="space-y-4">
              <div className="text-xs font-semibold text-slate-700 bg-slate-100 p-2.5 rounded-lg border border-slate-200">
                👉 <strong>निर्देश:</strong> दिए गए शब्द बैंक (Word Bank) से उपयुक्त संथाली शब्द चुनकर खाली स्थान भरें।
              </div>

              <div className="space-y-4 pt-2">
                {worksheet.items?.map((item, idx) => (
                  <div key={idx} className="p-4 border-2 border-slate-300 rounded-xl">
                    <div className="text-base font-bold text-slate-900 font-olchiki mb-1">
                      {idx + 1}. {item.sentence}
                    </div>
                    <div className="flex items-center gap-3 text-xs text-slate-600 pt-2 border-t border-slate-200">
                      <span>विकल्प (Options):</span>
                      {item.options.map((opt: string, i: number) => (
                        <span key={i} className="px-2 py-0.5 bg-slate-100 border border-slate-300 rounded font-olchiki font-bold">
                          {opt}
                        </span>
                      ))}
                      <span className="text-slate-400 ml-auto">संकेत: {item.hint}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Format 6: Lesson Script */}
          {worksheet.type === 'lesson_script' && (
            <div className="space-y-4">
              <div className="text-xs font-semibold text-slate-700 bg-slate-100 p-2.5 rounded-lg border border-slate-200">
                👉 <strong>शिक्षक मार्गदर्शिका:</strong> 15-मिनट की त्रिभाषी पाठ योजना (NIPUN Bharat MTB-MLE).
              </div>

              <div className="space-y-3 pt-2">
                {worksheet.items?.map((item, idx) => (
                  <div key={idx} className="p-4 border-2 border-slate-300 rounded-xl">
                    <div className="font-bold text-sm text-emerald-900 mb-1">{item.step}</div>
                    <div className="text-xs text-slate-800 leading-relaxed font-medium">{item.action}</div>
                    <div className="text-[11px] text-slate-500 mt-2 pt-1 border-t border-slate-200">
                      <strong>उद्देश्य:</strong> {item.objective}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Format 7: Rhyme */}
          {worksheet.type === 'rhyme' && (
            <div className="space-y-4">
              <div className="text-xs font-semibold text-slate-700 bg-slate-100 p-2.5 rounded-lg border border-slate-200">
                👉 <strong>निर्देश:</strong> सभी बच्चे लय व हावभाव (TPR) के साथ कविता गाएं।
              </div>

              <div className="p-6 border-2 border-slate-300 rounded-xl text-slate-900 whitespace-pre-line leading-relaxed text-sm bg-amber-50/30">
                {worksheet.content}
              </div>
            </div>
          )}

          {/* Format 8: Assessment */}
          {worksheet.type === 'assessment' && (
            <div className="space-y-4">
              <div className="text-xs font-semibold text-slate-700 bg-slate-100 p-2.5 rounded-lg border border-slate-200">
                👉 <strong>NIPUN Bharat मौखिक आकलन रूब्रिक:</strong> बच्चों के भयमुक्त वातावरण में अधिगम स्तर की जांच करें।
              </div>

              <div className="space-y-3 pt-2">
                {worksheet.items?.map((item, idx) => (
                  <div key={idx} className="p-4 border-2 border-slate-300 rounded-xl">
                    <div className="font-bold text-sm text-slate-900">{item.criterion}</div>
                    <div className="text-xs text-emerald-900 font-semibold my-1">{item.prompt}</div>
                    <div className="text-xs text-slate-600 bg-slate-50 p-2 rounded border border-slate-200">
                      {item.rubric}
                    </div>
                    <div className="mt-2 flex items-center justify-end gap-3 text-xs font-semibold">
                      <span>अंक / ग्रेड: [ &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; ]</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Format 9: Board Game */}
          {worksheet.type === 'board_game' && (
            <div className="space-y-4">
              <div className="text-xs font-semibold text-slate-700 bg-slate-100 p-2.5 rounded-lg border border-slate-200">
                👉 <strong>ट्राइबल फॉरेस्ट सफारी बोर्ड गेम:</strong> पासा (Dice) फेंकें, कदम बढ़ाएं और संथाली भाषा में दी गई चुनौती पूरी करें!
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 pt-2">
                {worksheet.items?.map((item, idx) => (
                  <div key={idx} className="p-4 border-2 border-slate-400 rounded-xl flex flex-col justify-between min-h-[140px] bg-slate-50">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-bold text-slate-500">Step {item.step}</span>
                        <span className="text-xs font-semibold text-emerald-800">{item.reward}</span>
                      </div>
                      <div className="text-base font-extrabold text-slate-900 font-olchiki">{item.title}</div>
                      <div className="text-xs text-slate-700 mt-2 leading-tight">{item.task}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Printable Footer */}
        <div className="mt-12 pt-6 border-t-2 border-slate-800 flex items-center justify-between text-xs text-slate-600">
          <div>
            <span>Teacher Evaluation Signature: ______________________</span>
          </div>
          <div>
            <span>SurSetu MTB-MLE Framework | 100% Offline Edge Verified</span>
          </div>
        </div>
      </div>
    </div>
  );
};
