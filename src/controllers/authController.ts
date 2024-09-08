import { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import UserModel, { IUser } from "../models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

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
    res.status(201).json({ message: "User created successfully" });
  } catch (err) {
    console.error("Error creating user: ", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const signIn = async (req: Request, res: Response) => {
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

    const jwtsecret = process.env.JWT_SECRET;

    if (!jwtsecret) {
      console.error("JWT_SECRET not found in environment variables");
      return res
        .status(500)
        .json({ error: "Internal server error (env variables)" });
    }

    const token = jwt.sign({ email: user.email }, jwtsecret, {
      expiresIn: "1h",
    });

    {
      const { __v, password, ...userData } = user.toObject();
      res.status(200).json({
        token,
        user: userData,
      });
    }
  } catch (err) {
    console.error("Error authenticating user: ", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const getUser = async (req: Request, res: Response) => {
  try {
    const user = await UserModel.findOne({ email: req.user });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const { __v, password, ...userData } = user.toObject();
    res.json({
      user: userData,
    });
  } catch (err) {
    console.error("Error fetching user data:", err);
    res.status(500).json({ message: "Server error" });
  }
};
