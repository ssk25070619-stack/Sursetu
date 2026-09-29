import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { WorksheetData } from '../types';

export interface PdfExportOptions {
  filename?: string;
  dpiScale?: number;
  quality?: number;
  orientation?: 'portrait' | 'landscape';
  onProgress?: (percent: number, message: string) => void;
}

/**
 * Service to export generated FLN study materials as PDF files,
 * preserving exact A4 print-friendly typography, Ol Chiki Unicode fonts,
 * tactile counters, and student answer sections.
 */
export class PdfExportService {
  /**
   * Generates a standardized, clean filename for the worksheet
   */
  public generateFilename(worksheet: WorksheetData): string {
    const cleanTitle = worksheet.title
      .replace(/[^a-zA-Z0-9_\u1C50-\u1C7F]/g, '_')
      .replace(/_+/g, '_')
      .slice(0, 35);
    const grade = worksheet.grade.replace(/\s+/g, '-');
    const lang = worksheet.target_lang.replace('sat_', '');
    const timestamp = new Date().toISOString().slice(0, 10);

    return `PALASH_${grade}_${worksheet.type.toUpperCase()}_${lang}_${timestamp}.pdf`;
  }

  /**
   * Exports an HTML printable element into an A4 PDF document
   */
  public async exportToPdf(
    element: HTMLElement,
    worksheet: WorksheetData,
    options: PdfExportOptions = {}
  ): Promise<string> {
    const {
      dpiScale = 2,
      quality = 0.98,
      orientation = 'portrait',
      onProgress,
    } = options;

    const filename = options.filename || this.generateFilename(worksheet);

    try {
      if (onProgress) onProgress(15, 'Preparing print-friendly typography & fonts...');

      // Ensure web fonts (Noto Sans Ol Chiki, Noto Sans Oriya, Outfit) are fully loaded
      if (document.fonts && document.fonts.ready) {
        await document.fonts.ready;
      }

      if (onProgress) onProgress(35, 'Capturing high-DPI raster representation...');

      // Render the worksheet DOM node using html2canvas
      const canvas = await html2canvas(element, {
        scale: dpiScale,
        useCORS: true,
        allowTaint: true,
        logging: false,
        backgroundColor: '#ffffff',
        windowWidth: 1024,
        onclone: (clonedDoc) => {
          // Ensure cloned printable sheet has high contrast and clean white background
          const clonedSheet = clonedDoc.querySelector('.printable-sheet') as HTMLElement;
          if (clonedSheet) {
            clonedSheet.style.boxShadow = 'none';
            clonedSheet.style.borderRadius = '0';
            clonedSheet.style.border = '2px solid #334155';
            clonedSheet.style.backgroundColor = '#ffffff';
            clonedSheet.style.color = '#0f172a';
          }
        },
      });

      if (onProgress) onProgress(70, 'Compiling A4 PDF document pages...');

      const imgData = canvas.toDataURL('image/jpeg', quality);

      // Standard A4 dimensions in mm
      const a4Width = orientation === 'portrait' ? 210 : 297;
      const a4Height = orientation === 'portrait' ? 297 : 210;

      const pdf = new jsPDF({
        orientation,
        unit: 'mm',
        format: 'a4',
        compress: true,
      });

      // Calculate scaled image height to fit A4 width
      const imgWidth = a4Width;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      let heightLeft = imgHeight;
      let position = 0;

      // Add the first page
      pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight, undefined, 'FAST');
      heightLeft -= a4Height;

      // Add extra pages if content overflows A4 height
      let pageNumber = 1;
      while (heightLeft > 2) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pageNumber++;
        pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight, undefined, 'FAST');
        heightLeft -= a4Height;
      }

      // Embed PDF Metadata for institutional verification
      pdf.setProperties({
        title: worksheet.title,
        subject: `SurSetu NIPUN Bharat FLN Study Material - ${worksheet.grade}`,
        author: 'SurSetu MTB-MLE Education Initiative',
        keywords: 'NIPUN Bharat, FLN, Ol Chiki, Santali, Tribal Education, NEP 2020',
        creator: 'SurSetu WorksheetStudio',
      });

      if (onProgress) onProgress(90, 'Finalizing download package...');

      // Trigger download
      pdf.save(filename);

      if (onProgress) onProgress(100, 'PDF downloaded successfully!');

      return filename;
    } catch (error) {
      console.error('Error generating PDF:', error);
      throw error;
    }
  }
}

export const pdfExportService = new PdfExportService();
