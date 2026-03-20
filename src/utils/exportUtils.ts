import { ASPECT_RATIOS } from '@/constants/aspectRatios';
import type { Page } from '@/types';

async function loadFileSaver() {
    const { saveAs } = await import('file-saver');
    return saveAs;
}

async function loadJsZip() {
    const { default: JSZip } = await import('jszip');
    return JSZip;
}

async function loadJsPdf() {
    const { jsPDF } = await import('jspdf');
    return jsPDF;
}

function dataURLtoBlob(dataURL: string): Blob {
    const arr = dataURL.split(',');
    const mime = arr[0].match(/:(.*?);/)?.[1] || 'image/png';
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mime });
}

async function downloadFile(blob: Blob, filename: string): Promise<void> {
    const saveAs = await loadFileSaver();
    saveAs(blob, filename);
}

async function convertToFormat(dataURL: string, format: 'png' | 'webp'): Promise<Blob> {
    if (format === 'png' && dataURL.startsWith('data:image/png')) {
        return dataURLtoBlob(dataURL);
    }

    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            if (!ctx) {
                reject(new Error('Failed to get canvas context'));
                return;
            }
            ctx.drawImage(img, 0, 0);
            canvas.toBlob(
                blob => {
                    if (blob) {
                        resolve(blob);
                    } else {
                        reject(new Error('Failed to convert image'));
                    }
                },
                format === 'webp' ? 'image/webp' : 'image/png',
                0.95,
            );
        };
        img.onerror = () => reject(new Error('Failed to load image'));
        img.src = dataURL;
    });
}

export async function exportAsPNG(pages: Page[], useZip: boolean = false): Promise<void> {
    const pagesWithImages = pages.filter(p => p.generatedImage);

    if (pagesWithImages.length === 0) {
        throw new Error('Please generate at least one manga page before exporting.');
    }

    if (useZip) {
        const JSZip = await loadJsZip();
        const zip = new JSZip();

        for (let i = 0; i < pagesWithImages.length; i++) {
            const page = pagesWithImages[i];
            zip.file(`manga-page-${i + 1}.png`, await convertToFormat(page.generatedImage!, 'png'));
        }

        await downloadFile(await zip.generateAsync({ type: 'blob' }), 'manga-pages.zip');
        return;
    }

    for (let i = 0; i < pagesWithImages.length; i++) {
        const page = pagesWithImages[i];
        await downloadFile(await convertToFormat(page.generatedImage!, 'png'), `manga-page-${i + 1}.png`);
        if (i < pagesWithImages.length - 1) {
            await new Promise(resolve => setTimeout(resolve, 150));
        }
    }
}

export async function exportAsWEBP(pages: Page[], useZip: boolean = false): Promise<void> {
    const pagesWithImages = pages.filter(p => p.generatedImage);

    if (pagesWithImages.length === 0) {
        throw new Error('Please generate at least one manga page before exporting.');
    }

    if (useZip) {
        const JSZip = await loadJsZip();
        const zip = new JSZip();

        for (let i = 0; i < pagesWithImages.length; i++) {
            const page = pagesWithImages[i];
            zip.file(`manga-page-${i + 1}.webp`, await convertToFormat(page.generatedImage!, 'webp'));
        }

        await downloadFile(await zip.generateAsync({ type: 'blob' }), 'manga-pages.zip');
        return;
    }

    for (let i = 0; i < pagesWithImages.length; i++) {
        const page = pagesWithImages[i];
        await downloadFile(await convertToFormat(page.generatedImage!, 'webp'), `manga-page-${i + 1}.webp`);
        if (i < pagesWithImages.length - 1) {
            await new Promise(resolve => setTimeout(resolve, 150));
        }
    }
}

export async function exportAsPDF(pages: Page[], singleFile: boolean = true): Promise<void> {
    const pagesWithImages = pages.filter(p => p.generatedImage);

    if (pagesWithImages.length === 0) {
        throw new Error('Please generate at least one manga page before exporting.');
    }

    const jsPDF = await loadJsPdf();

    if (singleFile) {
        const pdf = new jsPDF({
            orientation: 'portrait',
            unit: 'px',
            format: [595, 842],
        });

        for (let i = 0; i < pagesWithImages.length; i++) {
            const page = pagesWithImages[i];
            const aspectRatio = ASPECT_RATIOS[page.aspectRatio] || ASPECT_RATIOS.A4;

            if (i > 0) {
                pdf.addPage([aspectRatio.w, aspectRatio.h]);
            } else {
                pdf.internal.pageSize.width = aspectRatio.w;
                pdf.internal.pageSize.height = aspectRatio.h;
            }

            const img = new Image();
            await new Promise<void>((resolve, reject) => {
                img.onload = () => {
                    pdf.addImage(page.generatedImage!, 'PNG', 0, 0, aspectRatio.w, aspectRatio.h, undefined, 'FAST');
                    resolve();
                };
                img.onerror = () => reject(new Error(`Failed to load image for page ${i + 1}`));
                img.src = page.generatedImage!;
            });
        }

        pdf.save('manga-pages.pdf');
        return;
    }

    for (let i = 0; i < pagesWithImages.length; i++) {
        const page = pagesWithImages[i];
        const aspectRatio = ASPECT_RATIOS[page.aspectRatio] || ASPECT_RATIOS.A4;
        const pdf = new jsPDF({
            orientation: aspectRatio.h > aspectRatio.w ? 'portrait' : 'landscape',
            unit: 'px',
            format: [aspectRatio.w, aspectRatio.h],
        });

        const img = new Image();
        await new Promise<void>((resolve, reject) => {
            img.onload = () => {
                pdf.addImage(page.generatedImage!, 'PNG', 0, 0, aspectRatio.w, aspectRatio.h, undefined, 'FAST');
                resolve();
            };
            img.onerror = () => reject(new Error(`Failed to load image for page ${i + 1}`));
            img.src = page.generatedImage!;
        });

        pdf.save(`manga-page-${i + 1}.pdf`);

        if (i < pagesWithImages.length - 1) {
            await new Promise(resolve => setTimeout(resolve, 150));
        }
    }
}
