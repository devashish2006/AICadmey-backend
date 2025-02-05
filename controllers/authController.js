// controllers/authController.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
      // Check if user exists
      const user = await User.findOne({ email });
      if (!user) {
          return res.status(400).json({ message: "Invalid credentials" });
      }

      // Compare passwords
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
          return res.status(400).json({ message: "Invalid credentials" });
      }

      // Generate JWT token
      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
          expiresIn: "7d",
      });

      // Set token in an HTTP-only cookie (More Secure)
      res.cookie("token", token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      // Respond with user info
      res.json({
          token, // Optional if using cookies
          user: {
              name: user.name,
              email: user.email,
          },
      });
  } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
  }
};;
  


exports.registerUser = async (req, res) => {
    try {
      const { name, email, password } = req.body;
  
      // Check if user already exists
      let user = await User.findOne({ email });
      if (user) return res.status(400).json({ message: "User already exists" });
  
      // Create new user
      user = new User({ name, email, password });
      await user.save();
  
      // Generate JWT token
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "7d",
      });
  
      res.status(201).json({
        message: "Signup successful",
        token,
        user: { id: user._id, name: user.name, email: user.email },
      });
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  };


  exports.getCurrentUser = async (req, res) => {
    console.log("getCurrentUser called"); // Confirm the function is being executed

    try {
        console.log("User from authMiddleware:", req.user);

        if (!req.user) {
            console.log("No user found in request (authMiddleware failed)");
            return res.status(401).json({ message: "Unauthorized" });
        }

        const user = await User.findById(req.user._id).select("-password");
        if (!user) {
            console.log("User not found in the database for ID:", req.user._id);
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json(user);
    } catch (error) {
        console.error("Error fetching current user:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};



