import { createWorker } from "tesseract.js";

export const extractTextFromImage = async (image: Buffer) => {
  try {
    const worker = await createWorker("eng", 1, {
      legacyCore: true,
      legacyLang: true,
    });
    const ret = await worker.recognize(image);
    await worker.terminate();
    return ret.data.text;
  } catch (error) {
    console.error("Error extracting text from image: ", error);
  }
};
