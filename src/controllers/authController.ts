import { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import UserModel, { EmailModel, IUser } from "../models/User";
import bcrypt from "bcryptjs";
import { signJwt } from "../utils/authUtils";
import { sendOtp } from "../mailtrap/email";
import { sendErrorResponse } from "../utils/errorUtils";

// /api/auth/send-email-verification
export const sendEmailVerification = async (req: Request, res: Response) => {
  const { email } = req.body;

  if (!email) {
    return sendErrorResponse(res, 400, "Email is required");
  }

  const verificationCode = Math.floor(
    100000 + Math.random() * 900000,
  ).toString();

  try {
    let existingEmail = await EmailModel.findOne({ email });

    // If email already exists, update the verification code and expiry
    if (existingEmail) {
      existingEmail.verificationCode = verificationCode;
      existingEmail.verificationCodeExpiresAt = Date.now() + 15 * 60 * 1000;
    } else {
      existingEmail = new EmailModel({
        email,
        verificationCode,
        verificationCodeExpiresAt: Date.now() + 15 * 60 * 1000,
      });
    }

    await sendOtp(email, verificationCode);

    await existingEmail.save();

    return res.status(201).json({ message: "Email sent" });
  } catch (err) {
    console.error("Error sending email verification: ", err);
    return sendErrorResponse(res, 500, "Internal server error");
  }
};

// /api/auth/verify-email
export const verifyEmail = async (req: Request, res: Response) => {
  const { verificationCode } = req.body;

  if (!verificationCode) {
    return sendErrorResponse(res, 400, "Verification code is required");
  }

  try {
    const user = await EmailModel.findOneAndDelete({
      verificationCode,
      verificationCodeExpiresAt: { $gt: Date.now() },
    });

    if (!user) {
      return sendErrorResponse(
        res,
        400,
        "Invalid or expired verification code",
      );
    }

    return res.status(200).json({ message: "Email verified" });
  } catch (err) {
    console.error("Error verifying email: ", err);
    return sendErrorResponse(res, 500, "Internal server error");
  }
};

// /api/auth/sign-up
export const signUp = async (req: Request, res: Response) => {
  const {
    username,
    password,
    email,
    age,
    gender,
    weight,
    allergies,
    diseases,
  } = req.body;

  if (!username || !password || !age || !gender || !email) {
    return sendErrorResponse(
      res,
      400,
      "Required fields: username, password, age, gender, email",
    );
  }

  try {
    const existingUser = await UserModel.findOne({ email });

    if (existingUser) {
      return sendErrorResponse(res, 400, "Email already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser: IUser = new UserModel({
      _id: uuidv4(),
      username,
      password: hashedPassword,
      email,
      age,
      gender,
      weight,
      allergies,
      diseases,
    });

    await newUser.save();

    const token = signJwt(newUser.email);
    return res.status(201).json({
      token,
    });
  } catch (err) {
    console.error("Error creating user: ", err);
    return sendErrorResponse(res, 500, "Internal server error");
  }
};

// /api/auth/sign-in
export const signIn = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return sendErrorResponse(res, 400, "Required fields: email, password");
  }

  try {
    const user = await UserModel.findOne({ email: email });

    if (!user) {
      return res.status(401).json({ error: "Invalid Email" });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return sendErrorResponse(res, 401, "Invalid password");
    }

    const token = signJwt(user.email);
    {
      return res.status(200).json({
        token,
      });
    }
  } catch (err) {
    console.error("Error authenticating user: ", err);
    return sendErrorResponse(res, 500, "Internal server error");
  }
};

// /api/auth/user
export const getUser = async (req: Request, res: Response) => {
  try {
    const user = await UserModel.findOne({ email: req.user });

    if (!user) {
      return sendErrorResponse(res, 400, "User not found");
    }

    const { __v, password, ...userData } = user.toObject();
    res.status(200).json({
      user: userData,
    });
  } catch (err) {
    console.error("Error fetching user data:", err);
    return sendErrorResponse(res, 500, "Internal server error");
  }
};
