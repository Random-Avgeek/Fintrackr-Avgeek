import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 30
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    // Password is now required only if the user does NOT have a Google ID.
    // This allows users to sign up exclusively via Google without setting a local password.
    required: function() {
      return !this.googleId; // Password is required if googleId is not present or is null/empty
    },
    minlength: 6
  },
  // --- New Field: Google User ID ---
  // This field will store the unique 'sub' claim from Google's ID token.
  // 'unique: true' ensures no two users have the same Google ID.
  // 'sparse: true' allows multiple documents to have a null 'googleId' field,
  // which is crucial for traditional email/password users who won't have a Google ID.
  googleId: {
    type: String,
    unique: true,
    sparse: true
  },
  firstName: {
    type: String,
    required: true,
    trim: true,
    maxlength: 50
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
    maxlength: 50
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: {
    type: Date,
    default: Date.now // Default to current time for last login, or can be set explicitly on login
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Hash password before saving:
// This pre-save hook will only run if the 'password' field has been modified
// and if 'this.password' actually contains a value (i.e., not null/undefined from Google login).
userSchema.pre('save', async function(next) {
  if (this.isModified('password') && this.password) {
    try {
      const salt = await bcrypt.genSalt(12); // Higher salt rounds for better security
      this.password = await bcrypt.hash(this.password, salt);
      next();
    } catch (error) {
      next(error); // Pass any error to the next middleware
    }
  } else {
    next(); // Continue if password is not modified or is null (for Google-only users)
  }
});

// Compare password method:
// This method is used to verify a user's entered password against their hashed password.
// It also handles cases where a user might not have a local password (e.g., Google-only accounts).
userSchema.methods.comparePassword = async function(candidatePassword) {
  // If the user document does not have a password field, return false immediately.
  // This ensures that Google-only accounts cannot be logged into via local password.
  if (!this.password) {
    return false;
  }
  return bcrypt.compare(candidatePassword, this.password);
};

// Transform output:
// This method runs whenever a Mongoose document is converted to JSON (e.g., when sending to frontend).
// It removes the 'password' field for security, so it's never accidentally exposed.
userSchema.methods.toJSON = function() {
  const userObject = this.toObject();
  delete userObject.password; // Remove the password field
  return userObject;
};

const User = mongoose.model('User', userSchema);

export default User;
