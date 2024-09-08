import { Request, Response } from "express";
import UserModel, { IUser } from "../models/User";
import bcrypt from "bcryptjs";

type SignUpBody = {
  username: string;
  password: string;
  age: number;
  gender: string;
  weight: number;
  allergies: string[];
  diseases: string[];
};

export const signUp = async (req: Request, res: Response) => {
  const {
    username,
    password,
    age,
    gender,
    weight,
    allergies,
    diseases,
  }: SignUpBody = req.body;

  if (!username || !password || !age || !gender) {
    return res.status(400).json({
      error: "Bad request",
      requiredFields: "username, password, age, gender",
    });
  }

  try {
    const existingUser = await UserModel.findOne({ username });

    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser: IUser = new UserModel({
      username,
      password: hashedPassword,
      age,
      gender,
      weight,
      allergies,
      diseases,
    });

    await newUser.save();
    res.status(201).json({ message: "User created successfully" });
  } catch (err) {
    console.error("Error creating user: ", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

//TODO: Implement sign in
export const signIn = async (req: Request, res: Response) => {
  const { username, password } = req.body;
};
