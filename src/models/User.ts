import mongoose, { Document, Schema } from "mongoose";

export interface IUser extends Document {
  username: string;
  password: string;
  allergies: string[];
  gender: string;
  age: number;
  weight: number;
  diseases: string[];
}

const UserSchema: Schema = new Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  allergies: { type: [String], default: [] },
  gender: { type: String, required: true },
  age: { type: Number, required: true },
  weight: { type: Number },
  diseases: { type: [String] },
});

export default mongoose.model<IUser>("UserModel", UserSchema);
