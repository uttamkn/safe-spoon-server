import { Request, Response } from "express";
import UserModel from "../models/User";
import { sendErrorResponse } from "../utils/errorUtils";

// /api/profile/get-user-profile
export const getProfile = async (req: Request, res: Response) => {
  try {
    const user = await UserModel.findOne({ email: req.user });

    if (!user) {
      return sendErrorResponse(res, 400, "User not found");
    }

    const { password, _id, __v, ...userWithoutPassword } = user.toObject();
    res.status(200).json({
      user: userWithoutPassword,
    });
  } catch (err) {
    console.error("Error getting user profile: ", err);
    return sendErrorResponse(res, 500, "Internal server error");
  }
};

// /api/profile/update-user-profile
export const updateProfile = async (req: Request, res: Response) => {
  const { username, age, gender, weight, allergies, diseases } = req.body;

  if (!username || !age || !gender || !weight || !allergies || !diseases) {
    return sendErrorResponse(
      res,
      400,
      "Required fields: username, age, gender, weight, allergies, diseases",
    );
  }

  try {
    const user = await UserModel.findOne({ email: req.user });

    if (!user) {
      return sendErrorResponse(res, 400, "User not found");
    }

    user.username = username;
    user.age = age;
    user.gender = gender;
    user.weight = weight;
    user.allergies = allergies;
    user.diseases = diseases;

    await user.save();
    res.status(200).json({
      message: "Profile updated successfully",
    });
  } catch (err) {
    return sendErrorResponse(res, 500, "Internal server error");
  }
};
