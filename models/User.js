import mongoose from "mongoose";
import AutoIncrementFactory from "mongoose-sequence";

const AutoIncrement = AutoIncrementFactory(mongoose);

const userSchema = new mongoose.Schema({
  id: { type: Number, unique: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  allergies: { type: [String], default: [] },
});

userSchema.plugin(AutoIncrement, { inc_field: "id" });

const User = mongoose.model("User", userSchema);

export default User;
