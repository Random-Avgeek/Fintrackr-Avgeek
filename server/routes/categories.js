import express from 'express';
import Category from '../models/Category.js';

const router = express.Router();

// Get all categories
router.get('/', async (req, res) => {
  try {
    const categories = await Category.find().sort({ name: 1 });
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
    
    const newCategory = new Category({
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
    
    const updatedCategory = await Category.findByIdAndUpdate(
      req.params.id,
      { 
        name: name.trim(), 
        type: type || 'both',
        color: color || '#6366f1',
        icon: icon || 'tag'
      },
      { new: true, runValidators: true }
    );
    
    if (!updatedCategory) {
      return res.status(404).json({ message: 'Category not found' });
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
    const category = await Category.findById(req.params.id);
    
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    
    if (category.isDefault) {
      return res.status(400).json({ message: 'Cannot delete default category' });
    }
    
    await Category.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Category deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting category', error: error.message });
  }
});

// Initialize default categories
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

    const existingCategories = await Category.find();
    
    if (existingCategories.length === 0) {
      await Category.insertMany(defaultCategories);
      res.status(201).json({ message: 'Default categories initialized' });
    } else {
      res.status(200).json({ message: 'Categories already exist' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error initializing categories', error: error.message });
  }
});

export default router;