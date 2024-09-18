import { Request, Response } from "express";
import { extractTextFromImage } from "../utils/imageUtils";
import { fetchReport } from "../togetherai/api";
import User, { IUser } from "../models/User";

const _handleOcr = async (image: Buffer) => {
  try {
    const result: string | undefined = await extractTextFromImage(image);
    return result;
  } catch (err) {
    throw new Error("Error extracting text from image");
  }
};

export const getReport = async (req: Request, res: Response) => {
  const { image } = req.body;
  if (!image) {
    res.status(400).json({ error: "Image is required" });
    return;
  }

  try {
    const text = await _handleOcr(image);
    if (!text) {
      res.status(400).json({ error: "No text found in image" });
      return;
    }

    const userEmail = req.user;
    const user: IUser | null = await User.findOne({ email: userEmail });
    if (!user) {
      res.status(400).json({ error: "User not found" });
      return;
    }

    const report = await fetchReport(text, user);

    res.status(200).json(report);
  } catch (err) {
    res.status(500).json({ error: err });
  }
};
