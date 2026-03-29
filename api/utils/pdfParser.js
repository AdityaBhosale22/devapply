import * as pdfjs from "pdfjs-dist/legacy/build/pdf.mjs";

export const extractTextFromPDF = async (buffer) => {
    try {
        const uint8Array = new Uint8Array(buffer);

        const loadingTask = pdfjs.getDocument({ data: uint8Array });
        const pdf = await loadingTask.promise;

        let fullText = "";

        for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const content = await page.getTextContent();

            const pageText = content.items
                .map(item => item.str)
                .join(" ");

            fullText += pageText + "\n";
        }

        if (!fullText.trim()) {
            throw new Error("No text found in PDF");
        }

        return fullText;

    } catch (error) {
        console.error("❌ PDF Parsing Error:", error);
        throw new Error("Failed to extract text from PDF.");
    }
};