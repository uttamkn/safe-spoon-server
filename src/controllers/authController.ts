import { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import UserModel, { EmailModel, IUser } from "../models/User";
import bcrypt from "bcryptjs";
import { signJwt } from "../utils/authUtils";
import { sendOtp } from "../mailtrap/email";

// /api/auth/send-email-verification
export const sendEmailVerification = async (req: Request, res: Response) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({
      error: "Bad request",
      requiredFields: "email is required",
    });
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
    return res.status(500).json({ error: "Internal server error" });
  }
};

// /api/auth/verify-email
export const verifyEmail = async (req: Request, res: Response) => {
  const { verificationCode } = req.body;

  if (!verificationCode) {
    return res.status(400).json({
      error: "Bad request",
      requiredFields: " verificationCode",
    });
  }

  try {
    const user = await EmailModel.findOneAndDelete({
      verificationCode,
      verificationCodeExpiresAt: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(401).json({ error: "Invalid verification code" });
    }

    return res.status(200).json({ message: "Email verified" });
  } catch (err) {
    console.error("Error verifying email: ", err);
    return res.status(500).json({ error: "Internal server error" });
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
    return res.status(400).json({
      error: "Bad request",
      requiredFields: "username, password, age, gender, email",
    });
  }

  try {
    const existingUser = await UserModel.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
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
    return res.status(500).json({ error: "Internal server error" });
  }
};

// /api/auth/sign-in
export const signIn = async (req: Request, res: Response) => {
  console.log(req.body);
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ error: "Bad request", requiredFields: "email, password" });
  }

  try {
    const user = await UserModel.findOne({ email: email });

    if (!user) {
      return res.status(401).json({ error: "Invalid Email" });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: "Invalid Password" });
    }

    const token = signJwt(user.email);
    {
      return res.status(200).json({
        token,
      });
    }
  } catch (err) {
    console.error("Error authenticating user: ", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// /api/auth/user
export const getUser = async (req: Request, res: Response) => {
  try {
    const user = await UserModel.findOne({ email: req.user });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const { __v, password, ...userData } = user.toObject();
    res.status(200).json({
      user: userData,
    });
  } catch (err) {
    console.error("Error fetching user data:", err);
    res.status(500).json({ message: "Server error" });
  }
};
