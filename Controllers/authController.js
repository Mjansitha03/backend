import dotenv from "dotenv";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import User from "../Models/userSchema.js";
import sendmail from "../Utils/mailer.js";

dotenv.config();


// SIGNUP
// Register new user
export const signup = async (req, res) => {
  try {
    // get user input
    const { name, email, password } = req.body;

    // look for existing user
    const exists = await User.findOne({ email });
    if (exists)
      return res.status(400).json({ message: "User already exists" });

    // hash the password
    const hashed = await bcrypt.hash(password, 10);

    // save new user
    const user = await User.create({ name, email, password: hashed });

    // send success response
    res.status(201).json({
      message: "User registered successfully",
      data: { id: user._id, name, email },
    });
  } catch (error) {
    console.error("Signup Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};


// SIGNIN
// User login
export const signin = async (req, res) => {
  try {
    // get credentials
    const { email, password } = req.body;

    // find user
    const user = await User.findOne({ email });
    if (!user)
      return res.status(404).json({ message: "User not found" });

    // verify password
    const valid = await bcrypt.compare(password, user.password);
    if (!valid)
      return res.status(401).json({ message: "Invalid password" });

    // create token
    const token = jwt.sign(
      { _id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    user.token = token;
    await user.save();

    res.json({
      message: "Login successful",
      token,
      role: user.role,
    });
  } catch (error) {
    console.error("Signin Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};


// FORGOT PASSWORD
// minutes the reset link stays valid
const RESET_EXPIRY_MINUTES = 1;

// Forgot password: create and email reset link
export const forgotPassword = async (req, res) => {
  try {
    // get email from client
    const { email } = req.body;

    if (!email)
      return res.status(400).json({ message: "Email is required" });

    // find user by email
    const user = await User.findOne({ email });
    if (!user)
      return res.status(404).json({ message: "User not found" });

    // generate a random token
    const resetToken = crypto.randomBytes(32).toString("hex");

    // set token and expiry on user
    user.resetToken = resetToken;
    user.resetTokenExpiry = new Date(Date.now() + RESET_EXPIRY_MINUTES * 60000);
    await user.save();

    // *** LOCALHOST REACT FRONTEND ***
    // frontend URL for reset link
    const frontendURL = "https://frontend-3tar.vercel.app";
    const url = `${frontendURL}/reset-password/${user._id}/${resetToken}`;

    // send email with link
    await sendmail(
      email,
      "Password Reset",
      `Reset your password using the link:\n\n${url}\n\nThis link expires in ${RESET_EXPIRY_MINUTES} minute.`
    );

    res.json({
      message: "Reset link sent",
      expiresInSeconds: RESET_EXPIRY_MINUTES * 60,
    });
  } catch (error) {
    console.error("Forgot Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// VERIFY RESET TOKEN
// Verify if reset token is valid and not expired
export const verifyResetToken = async (req, res) => {
  try {
    // read id and token from params
    const { id, token } = req.params;

    // find the user by id
    const user = await User.findById(id);
    if (!user)
      return res.status(404).json({ message: "User not found" });

    // no reset request stored
    if (!user.resetToken || !user.resetTokenExpiry)
      return res.status(400).json({ message: "No reset request found" });

    if (user.resetToken !== token)
      return res.status(401).json({ message: "Invalid token" });

    // compute remaining time
    const remaining = user.resetTokenExpiry - Date.now();
    if (remaining <= 0)
      return res.status(410).json({ message: "Reset link expired" });

    res.json({
      message: "Token valid",
      expiresInSeconds: Math.ceil(remaining / 1000),
    });
  } catch (error) {
    console.error("Verify Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// RESET PASSWORD
// Reset password action after token is verified
export const resetPassword = async (req, res) => {
  try {
    // get id, token and new password
    const { id, token } = req.params;
    const { password } = req.body;

    // find user by id
    const user = await User.findById(id);
    if (!user)
      return res.status(404).json({ message: "User not found" });

    // token must match
    if (user.resetToken !== token)
      return res.status(401).json({ message: "Invalid token" });

    // check if token expired
    if (user.resetTokenExpiry < Date.now())
      return res.status(410).json({ message: "Link expired" });

    // hash and set new password
    user.password = await bcrypt.hash(password, 10);
    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;

    await user.save();

    res.json({ message: "Password reset successful" });
  } catch (error) {
    console.error("Reset Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};


