import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true,
    unique: true,
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

const Category = mongoose.model('Category', categorySchema);

export default Category;