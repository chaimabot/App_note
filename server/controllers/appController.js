import UserModel from "../model/User.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import otpGenerator from "otp-generator";
import crypto from "crypto";
import ENV from "../config.js"; // Assurez-vous que le chemin est correct

/** Register user */
export const register = async (req, res) => {
  try {
    const { email, username, password } = req.body;

    // Check if email already exists
    const existingUserByEmail = await UserModel.findOne({ email });
    if (existingUserByEmail) {
      return res.status(400).json({ error: "Email already exists" });
    }

    // Check if username already exists
    const existingUserByUsername = await UserModel.findOne({ username });
    if (existingUserByUsername) {
      return res.status(400).json({ error: "Username already exists" });
    }

    // Create a new user
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new UserModel({
      email,
      username,
      password: hashedPassword,
    });
    await newUser.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

/** Verify user */
export async function verifyUser(req, res, next) {
  try {
    const { username } = req.method === "GET" ? req.query : req.body;

    // Check if user exists
    const userExists = await UserModel.findOne({ username });

    if (userExists) {
      // Proceed to next middleware or controller function
      next();
    } else {
      return res
        .status(404)
        .json({ userExists: false, error: "Can't find User!" });
    }
  } catch (error) {
    console.error("Error verifying user:", error);
    return res.status(500).json({ error: "Authentication Error" });
  }
}

/** Login user */
export async function login(req, res) {
  const { email, password } = req.body;

  try {
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ userExists: false, error: "User not found" });
    }

    const passwordCheck = await bcrypt.compare(password, user.password);
    if (!passwordCheck) {
      return res
        .status(400)
        .json({ userExists: true, error: "Password does not match" });
    }

    // Create JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      ENV.JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.status(200).json({
      msg: "Login Successful!",
      userExists: true,
      email: user.email,
      token,
    });
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

/** Get user details */
export async function getUser(req, res) {
  const { username } = req.params;

  try {
    if (!username) return res.status(400).json({ error: "Invalid Username" });

    const user = await UserModel.findOne({ username });
    if (!user) return res.status(404).json({ error: "Couldn't Find the User" });

    // Remove password from user object
    const { password, ...rest } = user.toObject();
    res.status(200).json(rest);
  } catch (error) {
    console.error("Error fetching user data:", error);
    res.status(500).json({ error: "Cannot Find User Data" });
  }
}

/** Update user profile */
export async function updateUser(req, res) {
  try {
    const { userId } = req.user;
    if (!userId) return res.status(401).json({ error: "User Not Found" });

    const body = req.body;
    const result = await UserModel.updateOne({ _id: userId }, body);

    if (result.nModified === 0)
      return res.status(404).json({ error: "No changes made" });

    res.status(200).json({ msg: "Record Updated!" });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

/** Generate OTP */
export async function generateOTP(req, res) {
  try {
    const otp = otpGenerator.generate(6, {
      lowerCaseAlphabets: false,
      upperCaseAlphabets: false,
      specialChars: false,
    });
    req.app.locals.OTP = otp;
    res.status(200).json({ code: otp });
  } catch (error) {
    console.error("Error generating OTP:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

/** Verify OTP */
export async function verifyOTP(req, res) {
  const { code } = req.query;
  if (parseInt(req.app.locals.OTP) === parseInt(code)) {
    req.app.locals.OTP = null; // Reset the OTP value
    req.app.locals.resetSession = true; // Start session for password reset
    res.status(200).json({ msg: "Verified Successfully!" });
  } else {
    res.status(400).json({ error: "Invalid OTP" });
  }
}

/** Create reset session */
export async function createResetSession(req, res) {
  if (req.app.locals.resetSession) {
    res.status(200).json({ flag: req.app.locals.resetSession });
  } else {
    res.status(440).json({ error: "Session expired!" });
  }
}

/** Reset password */
export async function resetPassword(req, res) {
  if (!req.app.locals.resetSession)
    return res.status(440).json({ error: "Session expired!" });

  const { username, password } = req.body;

  try {
    const user = await UserModel.findOne({ username });
    if (!user) return res.status(404).json({ error: "Username not Found" });

    const hashedPassword = await bcrypt.hash(password, 10);
    await UserModel.updateOne(
      { username: user.username },
      { password: hashedPassword }
    );

    req.app.locals.resetSession = false; // Reset session
    res.status(200).json({ msg: "Password updated successfully" });
  } catch (error) {
    console.error("Error resetting password:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
