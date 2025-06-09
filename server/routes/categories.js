import express from 'express';
import Category from '../models/Category.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// Apply authentication middleware to all routes
router.use(auth);

// Get all categories (user's custom categories + default categories)
router.get('/', async (req, res) => {
  try {
    const categories = await Category.find({
      $or: [
        { userId: req.user._id },
        { isDefault: true }
      ]
    }).sort({ name: 1 });
    
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching categories', error: error.message });
  }
});

// Create a new category
router.post('/', async (req, res) => {
  try {
    const { name, type, color, icon } = req.body;
    
    if (!name) {
      return res.status(400).json({ message: 'Category name is required' });
    }
    
    // Check if category name already exists for this user
    const existingCategory = await Category.findOne({
      $or: [
        { userId: req.user._id, name: name.trim() },
        { isDefault: true, name: name.trim() }
      ]
    });
    
    if (existingCategory) {
      return res.status(400).json({ message: 'Category with this name already exists' });
    }
    
    const newCategory = new Category({
      userId: req.user._id,
      name: name.trim(),
      type: type || 'both',
      color: color || '#6366f1',
      icon: icon || 'tag'
    });
    
    const savedCategory = await newCategory.save();
    res.status(201).json(savedCategory);
  } catch (error) {
    if (error.code === 11000) {
      res.status(400).json({ message: 'Category already exists' });
    } else {
      res.status(500).json({ message: 'Error creating category', error: error.message });
    }
  }
});

// Update a category
router.put('/:id', async (req, res) => {
  try {
    const { name, type, color, icon } = req.body;
    
    if (!name) {
      return res.status(400).json({ message: 'Category name is required' });
    }
    
    // Check if this is a default category
    const category = await Category.findOne({ 
      _id: req.params.id,
      $or: [
        { userId: req.user._id },
        { isDefault: true }
      ]
    });
    
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    
    if (category.isDefault) {
      return res.status(400).json({ message: 'Cannot modify default categories' });
    }
    
    // Check if new name conflicts with existing categories
    const existingCategory = await Category.findOne({
      _id: { $ne: req.params.id },
      $or: [
        { userId: req.user._id, name: name.trim() },
        { isDefault: true, name: name.trim() }
      ]
    });
    
    if (existingCategory) {
      return res.status(400).json({ message: 'Category with this name already exists' });
    }
    
    const updatedCategory = await Category.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { 
        name: name.trim(), 
        type: type || 'both',
        color: color || '#6366f1',
        icon: icon || 'tag'
      },
      { new: true, runValidators: true }
    );
    
    if (!updatedCategory) {
      return res.status(404).json({ message: 'Category not found or access denied' });
    }
    
    res.status(200).json(updatedCategory);
  } catch (error) {
    if (error.code === 11000) {
      res.status(400).json({ message: 'Category name already exists' });
    } else {
      res.status(500).json({ message: 'Error updating category', error: error.message });
    }
  }
});

// Delete a category
router.delete('/:id', async (req, res) => {
  try {
    const category = await Category.findOne({ 
      _id: req.params.id,
      $or: [
        { userId: req.user._id },
        { isDefault: true }
      ]
    });
    
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    
    if (category.isDefault) {
      return res.status(400).json({ message: 'Cannot delete default category' });
    }
    
    await Category.findOneAndDelete({ 
      _id: req.params.id, 
      userId: req.user._id 
    });
    
    res.status(200).json({ message: 'Category deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting category', error: error.message });
  }
});

// Initialize default categories for new users
router.post('/initialize', async (req, res) => {
  try {
    const defaultCategories = [
      { name: 'Food', type: 'expense', color: '#ef4444', icon: 'utensils', isDefault: true },
      { name: 'Travel', type: 'expense', color: '#3b82f6', icon: 'plane', isDefault: true },
      { name: 'Billing', type: 'expense', color: '#f59e0b', icon: 'receipt', isDefault: true },
      { name: 'Shopping', type: 'expense', color: '#8b5cf6', icon: 'shopping-bag', isDefault: true },
      { name: 'Entertainment', type: 'expense', color: '#ec4899', icon: 'music', isDefault: true },
      { name: 'Salary', type: 'income', color: '#10b981', icon: 'dollar-sign', isDefault: true },
      { name: 'Freelance', type: 'income', color: '#06b6d4', icon: 'briefcase', isDefault: true },
      { name: 'Others', type: 'both', color: '#6b7280', icon: 'more-horizontal', isDefault: true }
    ];

    // Check if default categories already exist
    const existingDefaults = await Category.find({ isDefault: true });
    
    if (existingDefaults.length === 0) {
      await Category.insertMany(defaultCategories);
      res.status(201).json({ message: 'Default categories initialized' });
    } else {
      res.status(200).json({ message: 'Default categories already exist' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error initializing categories', error: error.message });
  }
});

export default router;