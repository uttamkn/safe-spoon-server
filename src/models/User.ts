import mongoose, { Document, Schema } from "mongoose";

export interface IUser extends Document {
  _id: string;
  username: string;
  password: string;
  email: string;
  allergies: string[];
  gender: string;
  age: number;
  weight: number;
  diseases: string[];
}

const UserSchema: Schema = new Schema({
  _id: { type: String, required: true },
  username: { type: String, required: true },
  password: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  allergies: { type: [String], default: [] },
  gender: { type: String, required: true },
  age: { type: Number, required: true },
  weight: { type: Number },
  diseases: { type: [String] },
});

const EmailSchema: Schema = new Schema({
  email: { type: String, required: true, unique: true },
  verificationCode: String,
  verificationCodeExpiresAt: Date,
});

export const EmailModel = mongoose.model("EmailModel", EmailSchema);

export default mongoose.model<IUser>("UserModel", UserSchema);
