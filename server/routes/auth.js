import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import auth from '../middleware/auth.js';
import { OAuth2Client } from 'google-auth-library'; // Import Google OAuth2Client

const router = express.Router();

// Initialize Google OAuth2Client with your backend's Google Client ID
// This MUST match the client ID you set up in your Google Cloud Console for "Web application"
// and that you used on the frontend (VITE_GOOGLE_CLIENT_ID).
// Ensure GOOGLE_CLIENT_ID is set in your Render environment variables.
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const client = new OAuth2Client(GOOGLE_CLIENT_ID);

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET || 'your-secret-key', // Use your secret key from environment variables
    { expiresIn: '7d' } // Token expiration
  );
};

// Register new user (traditional email/password)
router.post('/register', async (req, res) => {
  try {
    const { username, email, password, firstName, lastName } = req.body;

    // Validate required fields
    if (!username || !email || !password || !firstName || !lastName) {
      return res.status(400).json({
        message: 'All fields are required: username, email, password, firstName, lastName'
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { username }]
    });

    if (existingUser) {
      return res.status(400).json({
        message: existingUser.email === email
          ? 'User with this email already exists'
          : 'Username already taken'
      });
    }

    // Create new user
    const user = new User({
      username,
      email,
      password, // Password will be hashed by pre-save hook in User model
      firstName,
      lastName
    });

    await user.save(); // Save the new user to the database

    // Generate token
    const token = generateToken(user._id);

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName
      }
    });
  } catch (error) {
    if (error.code === 11000) { // MongoDB duplicate key error
      const field = Object.keys(error.keyPattern)[0];
      return res.status(400).json({
        message: `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`
      });
    }

    if (error.name === 'ValidationError') { // Mongoose validation error
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ message: messages.join(', ') });
    }

    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error during registration' });
  }
});

// Login user (traditional email/username and password)
router.post('/login', async (req, res) => {
  try {
    const { login, password } = req.body;

    if (!login || !password) {
      return res.status(400).json({ message: 'Email/username and password are required' });
    }

    // Find user by email or username
    const user = await User.findOne({
      $or: [
        { email: login.toLowerCase() },
        { username: login }
      ]
    });

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    if (!user.isActive) {
      return res.status(401).json({ message: 'Account is deactivated' });
    }

    // Check password using method defined in User model
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Update last login timestamp
    user.lastLogin = new Date();
    await user.save();

    // Generate token
    const token = generateToken(user._id);

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        lastLogin: user.lastLogin
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
});

// --- New Google Login Endpoint ---
router.post('/google-login', async (req, res) => {
  try {
    const { idToken } = req.body; // Google ID token from frontend

    if (!idToken) {
      return res.status(400).json({ message: 'Google ID token is required' });
    }

    // 1. Verify the ID token with Google
    const ticket = await client.verifyIdToken({
      idToken: idToken,
      audience: GOOGLE_CLIENT_ID, // Ensure audience matches your Google Client ID
    });

    const payload = ticket.getPayload(); // Contains user information from Google
    const googleId = payload['sub']; // Unique Google user ID (subject)
    const email = payload['email'];
    const name = payload['name']; // Full name
    const firstName = payload['given_name'];
    const lastName = payload['family_name'];

    // 2. Find or create user in your database
    let user = await User.findOne({ googleId }); // Try finding by Google ID first

    if (!user) {
      // If not found by googleId, check if a user with this email already exists (e.g., traditional signup)
      user = await User.findOne({ email });

      if (user) {
        // User found by email, link Google ID to existing account
        user.googleId = googleId;
        // Optionally update other profile details from Google data if they are missing
        if (!user.firstName && firstName) user.firstName = firstName;
        if (!user.lastName && lastName) user.lastName = lastName;
        await user.save();
      } else {
        // No existing user found, create a brand new account linked to Google
        user = new User({
          username: email.split('@')[0], // Derive a default username from email
          email,
          firstName: firstName || name.split(' ')[0] || 'Google User', // Use given name, then full name part, then fallback
          lastName: lastName || name.split(' ')[1] || '', // Use family name, then full name part, then fallback
          googleId, // Store Google ID
          isActive: true, // Default to active
          // No password needed as it's Google-authenticated
        });
        await user.save();
      }
    }

    // Update last login timestamp for existing or newly created user
    user.lastLogin = new Date();
    await user.save();

    // 3. Generate and send back your own local JWT
    const token = generateToken(user._id);

    res.json({
      message: 'Google login successful',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        lastLogin: user.lastLogin,
      }
    });

  } catch (error) {
    console.error('Google login backend error:', error);
    res.status(500).json({ message: 'Google login failed on server', error: error.message });
  }
});

// Get current user profile
router.get('/profile', auth, async (req, res) => {
  try {
    res.json({
      user: {
        id: req.user._id,
        username: req.user.username,
        email: req.user.email,
        firstName: req.user.firstName,
        lastName: req.user.lastName,
        lastLogin: req.user.lastLogin,
        createdAt: req.user.createdAt
      }
    });
  } catch (error) {
    console.error('Profile fetch error:', error);
    res.status(500).json({ message: 'Server error fetching profile' });
  }
});

// Update user profile
router.put('/profile', auth, async (req, res) => {
  try {
    const { firstName, lastName, email } = req.body;
    const userId = req.user._id;

    // Check if email is being changed and if it's already taken
    if (email && email !== req.user.email) {
      const existingUser = await User.findOne({ email, _id: { $ne: userId } });
      if (existingUser) {
        return res.status(400).json({ message: 'Email already in use' });
      }
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        ...(firstName && { firstName }),
        ...(lastName && { lastName }),
        ...(email && { email })
      },
      { new: true, runValidators: true }
    ).select('-password');

    res.json({
      message: 'Profile updated successfully',
      user: updatedUser
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ message: messages.join(', ') });
    }

    console.error('Profile update error:', error);
    res.status(500).json({ message: 'Server error updating profile' });
  }
});

// Change password (only for users with a local password)
router.put('/change-password', auth, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Current password and new password are required' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'New password must be at least 6 characters long' });
    }

    const user = await User.findById(req.user._id);

    // If user has a googleId but no local password, they can't change password this way
    if (!user.password && user.googleId) {
      return res.status(400).json({ message: 'Password cannot be changed for Google-authenticated accounts without a local password.' });
    }
    
    // Verify current password
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({ message: 'Current password is incorrect' });
    }

    // Update password
    user.password = newPassword; // Pre-save hook will hash this
    await user.save();

    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    console.error('Password change error:', error);
    res.status(500).json({ message: 'Server error changing password' });
  }
});

// Logout (client-side token removal, but we can track it)
router.post('/logout', auth, async (req, res) => {
  try {
    // In a more sophisticated setup, you might want to blacklist the token
    // For now, we'll just send a success response
    res.json({ message: 'Logout successful' });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ message: 'Server error during logout' });
  }
});

export default router;
