import html2canvas from 'html2canvas-pro';
import { jsPDF } from 'jspdf';

export interface GeneratedPdfResult {
  blob: Blob;
  fileName: string;
  pageCount: number;
}

/**
 * Generates a multi-page A4 PDF document from a medical report DOM element.
 * Supports Arabic RTL typography, Tailwind v4 colors (oklch), and D3 SVG charts.
 */
export async function generateMedicalReportPdf(
  element: HTMLElement,
  patientName?: string
): Promise<GeneratedPdfResult> {
  if (document.fonts && document.fonts.ready) {
    await document.fonts.ready;
  }

  const sanitizedPatient = (patientName || 'Patient')
    .trim()
    .replace(/[^\u0600-\u06FFa-zA-Z0-9_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 32);

  const today = new Date().toISOString().slice(0, 10);
  const fileName = `Passant-Medical-Report-${sanitizedPatient || 'Record'}-${today}.pdf`;

  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    allowTaint: false,
    backgroundColor: '#ffffff',
    logging: false,
    windowWidth: 860,
    ignoreElements: (el) => el.getAttribute('data-pdf-ignore') === 'true',
    onclone: (_clonedDoc, clonedEl) => {
      // Ensure full height/width without modal scroll clipping
      let cursor: HTMLElement | null = clonedEl;
      while (cursor && cursor.tagName !== 'BODY') {
        cursor.style.maxHeight = 'none';
        cursor.style.height = 'auto';
        cursor.style.overflow = 'visible';
        cursor = cursor.parentElement;
      }

      clonedEl.style.width = '820px';
      clonedEl.style.maxWidth = '820px';
      clonedEl.style.padding = '20px 24px';
      clonedEl.style.margin = '0';
      clonedEl.style.borderRadius = '0';
      clonedEl.style.boxShadow = 'none';
      clonedEl.style.border = 'none';
      clonedEl.style.backgroundColor = '#ffffff';
      clonedEl.setAttribute('dir', 'rtl');

      // Reveal PDF-only header/footer elements
      const pdfOnlyNodes = clonedEl.querySelectorAll<HTMLElement>('[data-pdf-show="true"]');
      pdfOnlyNodes.forEach((node) => {
        node.classList.remove('hidden');
        node.style.display = node.dataset.pdfDisplay || 'flex';
      });

      // Ensure D3 / inline SVG charts have explicit pixel dimensions for sharp rendering
      const svgNodes = clonedEl.querySelectorAll<SVGSVGElement>('svg');
      svgNodes.forEach((svg) => {
        const viewBox = svg.getAttribute('viewBox');
        if (viewBox) {
          const parts = viewBox.trim().split(/[\s,]+/).map(Number);
          if (parts.length === 4 && parts[2] > 0 && parts[3] > 0) {
            const targetWidth = 730;
            const targetHeight = Math.round((targetWidth * parts[3]) / parts[2]);
            svg.setAttribute('width', String(targetWidth));
            svg.setAttribute('height', String(targetHeight));
            svg.style.width = '100%';
            svg.style.minWidth = '0';
            svg.style.height = 'auto';
          }
        }
      });

      // Remove horizontal overflow scrollbars around charts
      const scrollContainers = clonedEl.querySelectorAll<HTMLElement>('.overflow-x-auto');
      scrollContainers.forEach((container) => {
        container.style.overflow = 'visible';
      });
    },
  });

  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
    compress: true,
  });

  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const marginX = 10;
  const marginTop = 10;
  const marginBottom = 12;
  const contentWidth = pageWidth - marginX * 2;
  const contentHeight = pageHeight - marginTop - marginBottom;

  const pxPerMm = canvas.width / contentWidth;
  const pageSliceHeightPx = Math.max(1, Math.floor(contentHeight * pxPerMm));
  const totalPages = Math.max(1, Math.ceil(canvas.height / pageSliceHeightPx));

  let offsetY = 0;
  let pageIndex = 0;

  while (offsetY < canvas.height) {
    const remainingPx = canvas.height - offsetY;
    const sliceHeightPx = Math.min(pageSliceHeightPx, remainingPx);

    const pageCanvas = document.createElement('canvas');
    pageCanvas.width = canvas.width;
    pageCanvas.height = sliceHeightPx;

    const ctx = pageCanvas.getContext('2d');
    if (ctx) {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, pageCanvas.width, pageCanvas.height);
      ctx.drawImage(
        canvas,
        0,
        offsetY,
        canvas.width,
        sliceHeightPx,
        0,
        0,
        canvas.width,
        sliceHeightPx
      );
    }

    const sliceImgData = pageCanvas.toDataURL('image/jpeg', 0.94);
    const sliceHeightMm = sliceHeightPx / pxPerMm;

    if (pageIndex > 0) {
      pdf.addPage();
    }

    pdf.addImage(
      sliceImgData,
      'JPEG',
      marginX,
      marginTop,
      contentWidth,
      sliceHeightMm,
      undefined,
      'FAST'
    );

    pdf.setFontSize(8);
    pdf.setTextColor(148, 163, 184);
    pdf.text(
      `Passant Healthcare Medical Record  |  ${today}  |  Page ${pageIndex + 1} / ${totalPages}`,
      pageWidth / 2,
      pageHeight - 5,
      { align: 'center' }
    );

    offsetY += sliceHeightPx;
    pageIndex += 1;
  }

  const blob = pdf.output('blob');
  return {
    blob,
    fileName,
    pageCount: totalPages,
  };
}

export function triggerPdfDownload(blob: Blob, fileName: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.setTimeout(() => URL.revokeObjectURL(url), 1500);
}
