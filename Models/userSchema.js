import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  token: {
    type: String,
  },
  role: {
    type: String,
    enum: ["user"],
    default: "user",
  },
  resetToken: {
    type: String,
    default: undefined,
  },
  resetTokenExpiry: {
    type: Date,
    default: undefined,
  },
});

export default mongoose.model("User", userSchema);


