const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");

dotenv.config({ path: ".env.local" });

const User = require("./models/User");

const app = express();

const session = require("express-session");

app.use(session({
  secret: "secret-key",
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false, 
    httpOnly: true
  }
}));

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));

app.use(express.json());

// MongoDB connection
const mongodbUri = process.env.MONGODB_URI; // "mongodb://127.0.0.1:27017/authDB";
mongoose.connect(mongodbUri)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));


app.post("/signup", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.json({ message: "All fields required" });
  }

  const existing = await User.findOne({ email });
  if (existing) {
    return res.json({ message: "User already exists" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = new User({
    email,
    password: hashedPassword
  });

  await user.save();

  res.json({ message: "Signup successful" });
});


app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    return res.json({ message: "User not found" });
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    return res.json({ message: "Wrong password" });
  }

  req.session.user = {
    email: user.email
  };

  res.json({ message: "Login successful" });
});


app.get("/me", (req, res) => {
  if (req.session.user) {
    return res.json({ user: req.session.user });
  } else {
    return res.status(401).json({ message: "Not logged in" });
  }
});


app.post("/logout", (req, res) => {
  req.session.destroy();
  res.json({ message: "Logged out" });
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});