import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { generateAccessToken, generateRefreshToken } from "../utils/token.js";
import jwt from "jsonwebtoken";

export const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user) return res.status(400).json({ message: "Invalid credentials" });

  const match = await bcrypt.compare(password, user.password);

  if (!match) return res.status(400).json({ message: "Invalid credentials" });

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  // Send refresh token as HTTP-only cookie (BEST PRACTICE)
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: false, // true in production (HTTPS)
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.json({
    accessToken,
    role: user.role,
    name: user.name,
  });
};



export const refreshAccessToken = (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken)
    return res.status(401).json({
      message: "Refresh token missing",
    });

  try {
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

    const newAccessToken = generateAccessToken(decoded);

    res.json({ accessToken: newAccessToken });
  } catch (err) {
    return res.status(403).json({
      message: "Invalid refresh token",
    });
  }
};

export const logout = (req, res) => {
  res.clearCookie("refreshToken");

  res.json({ message: "Logged out successfully" });
};
