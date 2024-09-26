import { createWorker } from "tesseract.js";
import path from "path";

export const extractTextFromImage = async (
  image: Buffer,
): Promise<string | undefined> => {
  const wasmDirectory = path.join(__dirname, "..", "tesseract-core");

  console.log("wasmDirectory: ", wasmDirectory);

  try {
    const worker = await createWorker("eng", 1, {
      corePath: wasmDirectory,
    });

    const {
      data: { text },
    } = await worker.recognize(image);

    await worker.terminate();

    return text;
  } catch (error) {
    console.error("Error extracting text from image: ", error);
    return undefined;
  }
};
