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
    const existingUser = await UserModel.findOne({ username });

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
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ error: "Bad request", requiredFields: "username, password" });
  }

  try {
    const user = await UserModel.findOne({ username });

    if (!user) {
      return res.status(401).json({ error: "Invalid Username" });
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

    const token = jwt.sign({ username: user.username }, jwtsecret, {
      expiresIn: "1h",
    });

    res.status(200).json({
      token,
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        age: user.age,
        gender: user.gender,
        weight: user.weight,
        allergies: user.allergies,
        diseases: user.diseases,
      },
    });
  } catch (err) {
    console.error("Error authenticating user: ", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const getUser = () => {};
