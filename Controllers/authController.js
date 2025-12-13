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
    // read name, email, password from request
    const { name, email, password } = req.body;

    // ensure email not already used
    const exists = await User.findOne({ email });
    if (exists)
      return res.status(400).json({ message: "User already exists" });

    // hash user's password before saving
    const hashed = await bcrypt.hash(password, 10);

    // create user in DB
    const user = await User.create({ name, email, password: hashed });

    // respond with created user info (non-sensitive)
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
    // read email & password sent by client
    const { email, password } = req.body;

    // find user record by email
    const user = await User.findOne({ email });
    if (!user)
      return res.status(404).json({ message: "User not found" });

    // verify provided password with hash
    const valid = await bcrypt.compare(password, user.password);
    if (!valid)
      return res.status(401).json({ message: "Invalid password" });

    // generate JWT for session
    const token = jwt.sign(
      { _id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // save token on user (optional, used by client)
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
    const { email } = req.body;

    if (!email)
      return res.status(400).json({ message: "Email is required" });

    // fetch user by email
    const user = await User.findOne({ email });
    if (!user)
      return res.status(404).json({ message: "User not found" });

    // create a secure random token for reset
    const resetToken = crypto.randomBytes(32).toString("hex");
    // store token and expiry on user for later verification
    user.resetToken = resetToken;
    user.resetTokenExpiry = new Date(Date.now() + RESET_EXPIRY_MINUTES * 60000);
    await user.save();

    // build reset link for the frontend app
    const frontendURL = "https://frontend-3tar.vercel.app"; 
    const url = `${frontendURL}/reset-password/${user._id}/${resetToken}`;

    // Attempt to send email - we don't want to crash on SMTP failure
    await sendmail(
      email,
      "Password Reset",
      `You are receiving this email because you have requested to reset your password.
      Please click the following link to reset your password:\n\n${url}\n\n If you did not request this, please ignore this email.
      \n\nThis link expires in ${RESET_EXPIRY_MINUTES} minute(s).`
    );

    // reply with success message and expiry seconds
    res.json({
      message: "Reset link generated. Check your email if SMTP works.",
      expiresInSeconds: RESET_EXPIRY_MINUTES * 60,
    });
  } catch (error) {
    // log errors for debugging
    console.error("Forgot Password Error:", error);
    // Only throw 500 if something unrelated to email fails
    res.status(500).json({ message: "Server error" });
  }
};

// VERIFY RESET TOKEN
// Verify if reset token is valid and not expired
export const verifyResetToken = async (req, res) => {
  try {
    // extract ID and token from URL params
    const { id, token } = req.params;

    // find the user record by ID
    const user = await User.findById(id);
    if (!user)
      return res.status(404).json({ message: "User not found" });

    // ensure user has a pending reset token
    if (!user.resetToken || !user.resetTokenExpiry)
      return res.status(400).json({ message: "No reset request found" });

    if (user.resetToken !== token)
      return res.status(401).json({ message: "Invalid token" });

    // compute how many ms remain until expiry
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
    // read id, token, and new password from request
    const { id, token } = req.params;
    const { password } = req.body;

    // find user by id
    const user = await User.findById(id);
    if (!user)
      return res.status(404).json({ message: "User not found" });

    // validate token matches stored token
    if (user.resetToken !== token)
      return res.status(401).json({ message: "Invalid token" });

    // verify token hasn't expired
    if (user.resetTokenExpiry < Date.now())
      return res.status(410).json({ message: "Link expired" });

    // hash and set the new password; clear token fields
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





