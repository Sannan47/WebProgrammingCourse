const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// Mongoose Schema
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

// Mongoose Model
const UserModel = mongoose.model('User', userSchema);

// User Class
class User {
  constructor(username, password) {
    this.username = username;
    this.password = password;
  }

  // Register method
  async register() {
    try {
      // Check if user already exists
      const existingUser = await UserModel.findOne({ username: this.username });
      if (existingUser) {
        throw new Error('Username already exists');
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(this.password, 10);

      // Create new user
      const newUser = new UserModel({
        username: this.username,
        password: hashedPassword
      });

      // Save to database
      await newUser.save();
      return { success: true, message: 'User registered successfully' };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  // Login method
  async login() {
    try {
      // Find user in database
      const user = await UserModel.findOne({ username: this.username });
      
      if (!user) {
        throw new Error('Invalid username or password');
      }

      // Compare passwords
      const isPasswordValid = await bcrypt.compare(this.password, user.password);
      
      if (!isPasswordValid) {
        throw new Error('Invalid username or password');
      }

      return { success: true, message: 'Login successful', user: { username: user.username } };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }
}

module.exports = { User, UserModel };
