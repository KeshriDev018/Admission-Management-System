const userModel = require('../models/user-model');

const bcrypt = require("bcrypt");

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
        res.status(201).json({
          success: true,
          message: "Registration successful",
          userId: user._id,
        });
      });
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
