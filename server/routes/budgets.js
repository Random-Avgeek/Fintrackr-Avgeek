import express from 'express';
import Budget from '../models/Budget.js';
import Transaction from '../models/Transaction.js';

const router = express.Router();

// Get all budgets
router.get('/', async (req, res) => {
  try {
    const { year, month } = req.query;
    let query = {};
    
    if (year) query.year = parseInt(year);
    if (month) query.month = parseInt(month);
    
    const budgets = await Budget.find(query).sort({ category: 1 });
    res.status(200).json(budgets);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching budgets', error: error.message });
  }
});

// Get budget vs actual spending comparison
router.get('/comparison', async (req, res) => {
  try {
    const { year = new Date().getFullYear(), month = new Date().getMonth() + 1 } = req.query;
    
    // Get budgets for the specified period
    const budgets = await Budget.find({
      $or: [
        { period: 'yearly', year: parseInt(year) },
        { period: 'monthly', year: parseInt(year), month: parseInt(month) }
      ]
    });

    // Get actual spending for the period
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59);
    
    const actualSpending = await Transaction.aggregate([
      {
        $match: {
          type: 'debit',
          timestamp: { $gte: startDate, $lte: endDate }
        }
      },
      {
        $group: {
          _id: '$category',
          actual: { $sum: '$amount' }
        }
      }
    ]);

    // Combine budget and actual data
    const comparison = budgets.map(budget => {
      const actual = actualSpending.find(a => a._id === budget.category);
      const actualAmount = actual ? actual.actual : 0;
      const percentage = budget.amount > 0 ? (actualAmount / budget.amount) * 100 : 0;
      
      return {
        category: budget.category,
        budgeted: budget.amount,
        actual: actualAmount,
        remaining: budget.amount - actualAmount,
        percentage: Math.round(percentage * 100) / 100,
        status: percentage > 100 ? 'over' : percentage > 80 ? 'warning' : 'good'
      };
    });

    res.status(200).json(comparison);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching budget comparison', error: error.message });
  }
});

// Create a new budget
router.post('/', async (req, res) => {
  try {
    const { category, amount, period, year, month } = req.body;
    
    if (!category || !amount || !period || !year) {
      return res.status(400).json({ message: 'Category, amount, period, and year are required' });
    }
    
    if (period === 'monthly' && !month) {
      return res.status(400).json({ message: 'Month is required for monthly budgets' });
    }
    
    const budgetData = { category, amount, period, year };
    if (period === 'monthly') {
      budgetData.month = month;
    }
    
    const newBudget = new Budget(budgetData);
    const savedBudget = await newBudget.save();
    
    res.status(201).json(savedBudget);
  } catch (error) {
    if (error.code === 11000) {
      res.status(400).json({ message: 'Budget already exists for this category and period' });
    } else {
      res.status(500).json({ message: 'Error creating budget', error: error.message });
    }
  }
});

// Update a budget
router.put('/:id', async (req, res) => {
  try {
    const { category, amount, period, year, month } = req.body;
    
    if (!category || !amount || !period || !year) {
      return res.status(400).json({ message: 'Category, amount, period, and year are required' });
    }
    
    const updateData = { category, amount, period, year };
    if (period === 'monthly') {
      updateData.month = month;
    }
    
    const updatedBudget = await Budget.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!updatedBudget) {
      return res.status(404).json({ message: 'Budget not found' });
    }
    
    res.status(200).json(updatedBudget);
  } catch (error) {
    res.status(500).json({ message: 'Error updating budget', error: error.message });
  }
});

// Delete a budget
router.delete('/:id', async (req, res) => {
  try {
    const deletedBudget = await Budget.findByIdAndDelete(req.params.id);
    
    if (!deletedBudget) {
      return res.status(404).json({ message: 'Budget not found' });
    }
    
    res.status(200).json({ message: 'Budget deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting budget', error: error.message });
  }
});

export default router;