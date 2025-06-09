import express from 'express';
import Transaction from '../models/Transaction.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// Apply authentication middleware to all routes
router.use(auth);

// Get all transactions with advanced filtering and pagination
router.get('/', async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 50, 
      type, 
      category, 
      search, 
      sortBy = 'timestamp', 
      sortOrder = 'desc',
      startDate,
      endDate
    } = req.query;

    // Build filter object - always include userId
    const filter = { userId: req.user._id };
    if (type) filter.type = type;
    if (category) filter.category = category;
    if (search) {
      filter.$or = [
        { category: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    if (startDate || endDate) {
      filter.timestamp = {};
      if (startDate) filter.timestamp.$gte = new Date(startDate);
      if (endDate) filter.timestamp.$lte = new Date(endDate);
    }

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Execute query
    const transactions = await Transaction.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit));

    // Get total count for pagination
    const total = await Transaction.countDocuments(filter);

    res.status(200).json({
      transactions,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching transactions', error: error.message });
  }
});

// Get monthly summary
router.get('/monthly-summary', async (req, res) => {
  try {
    const monthlySummary = await Transaction.aggregate([
      {
        $match: { userId: req.user._id }
      },
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

// Get yearly summary
router.get('/yearly-summary', async (req, res) => {
  try {
    const yearlySummary = await Transaction.aggregate([
      {
        $match: { userId: req.user._id }
      },
      {
        $group: {
          _id: {
            year: { $year: "$timestamp" },
            type: "$type"
          },
          total: { $sum: "$amount" }
        }
      },
      {
        $group: {
          _id: "$_id.year",
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
          year: "$_id",
          summary: 1
        }
      },
      {
        $sort: {
          year: -1
        }
      }
    ]);

    res.status(200).json(yearlySummary);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching yearly summary', error: error.message });
  }
});

// Get category breakdown
router.get('/category-breakdown', async (req, res) => {
  try {
    const { startDate, endDate, type } = req.query;
    
    const filter = { userId: req.user._id };
    if (type) filter.type = type;
    if (startDate || endDate) {
      filter.timestamp = {};
      if (startDate) filter.timestamp.$gte = new Date(startDate);
      if (endDate) filter.timestamp.$lte = new Date(endDate);
    }

    const breakdown = await Transaction.aggregate([
      { $match: filter },
      {
        $group: {
          _id: {
            category: "$category",
            type: "$type"
          },
          total: { $sum: "$amount" },
          count: { $sum: 1 }
        }
      },
      {
        $project: {
          _id: 0,
          category: "$_id.category",
          type: "$_id.type",
          total: 1,
          count: 1
        }
      },
      {
        $sort: {
          total: -1
        }
      }
    ]);

    res.status(200).json(breakdown);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching category breakdown', error: error.message });
  }
});

// Get a single transaction by ID
router.get('/:id', async (req, res) => {
  try {
    const transaction = await Transaction.findOne({ 
      _id: req.params.id, 
      userId: req.user._id 
    });
    
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
      userId: req.user._id,
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
    
    const updatedTransaction = await Transaction.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
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
    const deletedTransaction = await Transaction.findOneAndDelete({ 
      _id: req.params.id, 
      userId: req.user._id 
    });
    
    if (!deletedTransaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }
    
    res.status(200).json({ message: 'Transaction deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting transaction', error: error.message });
  }
});

export default router;