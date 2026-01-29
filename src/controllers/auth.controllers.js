const userModel = require("../models/user-model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const JWT_SECRET = process.env.JWT_SECRET;

module.exports.registerUser = async function (req, res) {
  try {
    const data = req.body;

    // Basic validation
    if (!data.email || !data.password || !data.termsAccepted) {
      return res.status(400).json({
        message: "Required fields missing",
      });
    }

    // Check if user already exists
    const existingUser = await userModel.findOne({ email: data.email });
    if (existingUser) {
      return res.status(409).json({
        message: "User already exists",
      });
    }

    // Hash password
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(data.password, salt, async (err, hash) => {
        let user = await userModel.create({
          ...data,
          password: hash,
        });

        // Generate JWT token
        const token = jwt.sign(
          { userId: user._id, email: user.email },
          JWT_SECRET,
          { expiresIn: "7d" },
        );

        // Send user data (exclude password)
        const userData = user.toObject();
        delete userData.password;

        res.status(201).json({
          success: true,
          message: "Registration successful",
          token,
          user: userData,
        });
      });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports.loginUser = async function (req, res) {
  try {
    const { email, password, role } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }
    
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    // Validate role - check if selected role matches user's actual role
    const userRole = user.role || "student";
    if (role && role !== userRole) {
      return res
        .status(403)
        .json({
          message: `You are not authorized as ${role}. Your role is ${userRole}.`,
        });
    }
    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email, role: userRole },
      JWT_SECRET,
      { expiresIn: "7d" },
    );
    // Send user data (exclude password)
    const userData = user.toObject();
    delete userData.password;
    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      role: userRole,
      user: userData,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
