import { Request, Response } from "express";
import { extractTextFromImage } from "../utils/imageUtils";
import { fetchReport } from "../togetherai/api";
import User, { IUser } from "../models/User";
import { sendErrorResponse } from "../utils/errorUtils";

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
    return sendErrorResponse(res, 400, "Image is required");
  }

  try {
    const text = await _handleOcr(image);
    if (!text) {
      return sendErrorResponse(res, 400, "No text found in image");
    }

    const userEmail = req.user;
    const user: IUser | null = await User.findOne({ email: userEmail });
    if (!user) {
      return sendErrorResponse(res, 400, "User not found");
    }

    const report = await fetchReport(text, user);

    res.status(200).json(report);
  } catch (err) {
    return sendErrorResponse(res, 500, "Internal server error");
  }
};
