import { Request, Response } from "express";
import { extractTextFromImage } from "../utils/imageUtils";

export const handleOcr = async (req: Request, res: Response) => {
  try {
    const { image } = req.body;
    const result = await extractTextFromImage(image);
    res.status(200).json({ text: result });
  } catch (err) {
    res.status(500).json({ error: err });
  }
};
