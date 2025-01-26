import Tesseract from "tesseract.js";

export const extractTextFromImage = async (
  image: Buffer,
): Promise<string | undefined> => {
  try {
    const {
      data: { text },
    } = await Tesseract.recognize(image, "eng", {});

    return text;
  } catch (error) {
    console.error("OCR Error:", error);
    return undefined;
  }
};
