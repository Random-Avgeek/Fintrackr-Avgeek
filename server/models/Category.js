import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: function() {
      return !this.isDefault;
    }
  },
  name: { 
    type: String, 
    required: true,
    trim: true
  },
  type: {
    type: String,
    enum: ['expense', 'income', 'both'],
    default: 'both'
  },
  color: {
    type: String,
    default: '#6366f1'
  },
  icon: {
    type: String,
    default: 'tag'
  },
  isDefault: {
    type: Boolean,
    default: false
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

// Ensure unique category names per user (excluding default categories)
categorySchema.index({ 
  userId: 1, 
  name: 1 
}, { 
  unique: true,
  partialFilterExpression: { isDefault: { $ne: true } }
});

const Category = mongoose.model('Category', categorySchema);

export default Category;