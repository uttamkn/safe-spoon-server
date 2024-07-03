const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);

const userSchema = new mongoose.Schema({
  id: { type: Number, unique: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  allergies: { type: [String], default: [] },
});

userSchema.plugin(AutoIncrement, { inc_field: "id" });

module.exports = mongoose.model("User", userSchema);
