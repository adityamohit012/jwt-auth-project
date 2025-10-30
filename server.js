import express from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { verifyToken } from "./middleware/authMiddleware.js";

dotenv.config();
const app = express();
app.use(express.json());

// Hardcoded user
const user = {
  id: 1,
  username: "testuser",
  password: "password123"
};

// Login route - generate JWT
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (username === user.username && password === user.password) {
    const token = jwt.sign(
      { id: user.id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    res.json({ token });
  } else {
    res.status(401).json({ message: "Invalid credentials" });
  }
});

// Protected route
app.get("/protected", verifyToken, (req, res) => {
  res.json({
    message: "You have accessed a protected route!",
    user: req.user
  });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Server running at http://localhost:${PORT}`));
