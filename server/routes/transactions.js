import express from 'express';
import Transaction from '../models/Transaction.js';

const router = express.Router();

// Get all transactions
router.get('/', async (req, res) => {
  try {
    const transactions = await Transaction.find().sort({ timestamp: -1 });
    res.status(200).json(transactions);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching transactions', error: error.message });
  }
});

// Get monthly summary
router.get('/monthly-summary', async (req, res) => {
  try {
    const monthlySummary = await Transaction.aggregate([
      {
        $group: {
          _id: {
            year: { $year: "$timestamp" },
            month: { $month: "$timestamp" },
            type: "$type"
          },
          total: { $sum: "$amount" }
        }
      },
      {
        $group: {
          _id: {
            year: "$_id.year",
            month: "$_id.month"
          },
          summary: {
            $push: {
              type: "$_id.type",
              total: "$total"
            }
          }
        }
      },
      {
        $project: {
          _id: 0,
          year: "$_id.year",
          month: "$_id.month",
          summary: 1
        }
      },
      {
        $sort: {
          year: -1,
          month: -1
        }
      }
    ]);

    res.status(200).json(monthlySummary);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching monthly summary', error: error.message });
  }
});

// Get a single transaction by ID
router.get('/:id', async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);
    
    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }
    
    res.status(200).json(transaction);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching transaction', error: error.message });
  }
});

// Create a new transaction
router.post('/', async (req, res) => {
  try {
    const { type, amount, category, description } = req.body;
    
    // Validate required fields
    if (!type || !amount || !category) {
      return res.status(400).json({ message: 'Type, amount, and category are required' });
    }
    
    // Validate transaction type
    if (type !== 'credit' && type !== 'debit') {
      return res.status(400).json({ message: 'Type must be credit or debit' });
    }
    
    // Validate amount
    if (isNaN(amount) || amount <= 0) {
      return res.status(400).json({ message: 'Amount must be a positive number' });
    }
    
    const newTransaction = new Transaction({
      type,
      amount,
      category,
      description,
      timestamp: new Date()
    });
    
    const savedTransaction = await newTransaction.save();
    res.status(201).json(savedTransaction);
  } catch (error) {
    res.status(500).json({ message: 'Error creating transaction', error: error.message });
  }
});

// Update a transaction
router.put('/:id', async (req, res) => {
  try {
    const { type, amount, category, description } = req.body;
    
    // Validate required fields
    if (!type || !amount || !category) {
      return res.status(400).json({ message: 'Type, amount, and category are required' });
    }
    
    // Validate transaction type
    if (type !== 'credit' && type !== 'debit') {
      return res.status(400).json({ message: 'Type must be credit or debit' });
    }
    
    // Validate amount
    if (isNaN(amount) || amount <= 0) {
      return res.status(400).json({ message: 'Amount must be a positive number' });
    }
    
    const updatedTransaction = await Transaction.findByIdAndUpdate(
      req.params.id,
      { type, amount, category, description },
      { new: true, runValidators: true }
    );
    
    if (!updatedTransaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }
    
    res.status(200).json(updatedTransaction);
  } catch (error) {
    res.status(500).json({ message: 'Error updating transaction', error: error.message });
  }
});

// Delete a transaction
router.delete('/:id', async (req, res) => {
  try {
    const deletedTransaction = await Transaction.findByIdAndDelete(req.params.id);
    
    if (!deletedTransaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }
    
    res.status(200).json({ message: 'Transaction deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting transaction', error: error.message });
  }
});

export default router;