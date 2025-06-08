import mongoose from 'mongoose';

const budgetSchema = new mongoose.Schema({
  category: { 
    type: String, 
    required: true 
  },
  amount: { 
    type: Number, 
    required: true,
    min: 0
  },
  period: {
    type: String,
    enum: ['monthly', 'yearly'],
    default: 'monthly'
  },
  year: {
    type: Number,
    required: true
  },
  month: {
    type: Number,
    required: function() {
      return this.period === 'monthly';
    },
    min: 1,
    max: 12
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

// Ensure unique budget per category per period
budgetSchema.index({ category: 1, period: 1, year: 1, month: 1 }, { unique: true });

const Budget = mongoose.model('Budget', budgetSchema);

export default Budget;