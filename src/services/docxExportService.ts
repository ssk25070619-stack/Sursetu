/**
 * SurSetu 3.0 - Word (.docx) Worksheet Export Service
 * ------------------------------------------------------
 * Generates formatted Microsoft Word (.docx) documents with:
 * 1. Noto Sans Ol Chiki & Noto Sans Oriya font family metadata
 * 2. Formatted tables, student marks section, and bilingual items
 * 3. Answer keys and teacher remedial guides
 */

export interface DocxWorksheetOptions {
  title: string;
  grade: string;
  langLabel: string;
  schoolName?: string;
  items: Array<{
    num: number | string;
    prompt: string;
    promptNative: string;
    answerLine?: string;
  }>;
  answerKey?: string[];
}

export class DocxExportService {
  /**
   * Export a worksheet as a downloadable Word document (.doc / .docx compatible XML)
   */
  public static exportWorksheetDocx(options: DocxWorksheetOptions) {
    const school = options.schoolName || 'Govt. Primary Tribal Ashram School, Mayurbhanj';
    const dateStr = new Date().toLocaleDateString();

    const itemsXml = options.items
      .map(
        (item) => `
        <tr style="border-bottom: 1px solid #cbd5e1;">
          <td style="padding: 10px; width: 40px; font-weight: bold; color: #047857;">${item.num}</td>
          <td style="padding: 10px; font-size: 14pt;">
            <div style="font-weight: bold; color: #0f172a; margin-bottom: 4px;">${item.prompt}</div>
            <div style="font-family: 'Noto Sans Ol Chiki', 'Noto Sans Oriya', 'Arial Unicode MS', sans-serif; font-size: 16pt; color: #b45309; font-weight: bold;">${item.promptNative}</div>
          </td>
          <td style="padding: 10px; width: 140px; border-left: 1px dashed #cbd5e1; text-align: center; color: #94a3b8;">
            ${item.answerLine || '____________________'}
          </td>
        </tr>
      `
      )
      .join('');

    const answerKeyHtml =
      options.answerKey && options.answerKey.length > 0
        ? `
        <div style="margin-top: 30px; padding: 15px; background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px;">
          <h3 style="font-size: 12pt; color: #0f172a; margin-top: 0;">Teacher Answer Key (ಶಿಕ್ಷಕರ ಉತ್ತರ / शिक्षक उत्तर कुंजी)</h3>
          <ol style="margin-bottom: 0; padding-left: 20px; font-size: 10pt; color: #334155;">
            ${options.answerKey.map((ans) => `<li>${ans}</li>`).join('')}
          </ol>
        </div>
      `
        : '';

    const fullDocumentHtml = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
      <head>
        <meta charset="utf-8">
        <title>${options.title}</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+Devanagari:wght@400;700&family=Noto+Sans+Ol+Chiki:wght@400;700&family=Noto+Sans+Oriya:wght@400;700&display=swap');
          body {
            font-family: 'Segoe UI', 'Noto Sans Devanagari', 'Noto Sans Ol Chiki', 'Noto Sans Oriya', sans-serif;
            margin: 20px;
            color: #0f172a;
          }
          .header-table {
            width: 100%;
            border-bottom: 2px solid #047857;
            padding-bottom: 10px;
            margin-bottom: 20px;
          }
          .worksheet-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 15px;
          }
        </style>
      </head>
      <body>
        <table class="header-table">
          <tr>
            <td>
              <h1 style="font-size: 16pt; color: #047857; margin: 0;">🌿 SurSetu 3.0 — NIPUN Bharat FLN Study Material</h1>
              <div style="font-size: 11pt; color: #475569; margin-top: 4px;"><strong>School:</strong> ${school}</div>
              <div style="font-size: 10pt; color: #64748b;"><strong>Subject / Medium:</strong> ${options.langLabel} • <strong>Grade:</strong> ${options.grade}</div>
            </td>
            <td style="text-align: right; vertical-align: top;">
              <div style="border: 1px solid #047857; padding: 6px 12px; display: inline-block; border-radius: 6px; font-size: 10pt;">
                <strong>Date:</strong> ${dateStr}<br>
                <strong>Score:</strong> _____ / 10
              </div>
            </td>
          </tr>
        </table>

        <div style="background-color: #ecfdf5; border-left: 4px solid #047857; padding: 10px; margin-bottom: 20px;">
          <h2 style="font-size: 14pt; margin: 0; color: #065f46;">${options.title}</h2>
          <p style="font-size: 9.5pt; color: #047857; margin: 3px 0 0 0;">Instructions: Solve each bilingual question carefully. Fill in the blank box with the correct answer.</p>
        </div>

        <table class="worksheet-table">
          ${itemsXml}
        </table>

        ${answerKeyHtml}

        <div style="margin-top: 40px; text-align: center; font-size: 8pt; color: #94a3b8; border-top: 1px solid #e2e8f0; padding-top: 8px;">
          SurSetu 3.0 — 100% Offline Indigenous Language AI Engine • Eastern India Tribal Primary Schools
        </div>
      </body>
      </html>
    `;

    const blob = new Blob(['\ufeff', fullDocumentHtml], {
      type: 'application/msword;charset=utf-8',
    });

    const url = URL.createObjectURL(blob);
    const downloadLink = document.createElement('a');
    downloadLink.href = url;
    downloadLink.download = `SurSetu_${options.title.replace(/\s+/g, '_')}_${options.grade}.doc`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
    URL.revokeObjectURL(url);
  }
}
