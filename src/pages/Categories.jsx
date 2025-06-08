import React, { useState } from 'react';
import { useTransactionContext } from '../context/TransactionContext';
import { PlusCircle, Tag, Edit2, Trash2 } from 'lucide-react';
import CategoryModal from '../components/categories/CategoryModal';

const Categories = () => {
  const { 
    categories, 
    addCategory, 
    updateCategory, 
    deleteCategory 
  } = useTransactionContext();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentCategory, setCurrentCategory] = useState(null);

  const handleAddCategory = async (data) => {
    try {
      await addCategory(data);
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error adding category:', error);
    }
  };

  const handleEditCategory = (category) => {
    setCurrentCategory(category);
    setIsModalOpen(true);
  };

  const handleUpdateCategory = async (data) => {
    try {
      await updateCategory(currentCategory._id, data);
      setIsModalOpen(false);
      setCurrentCategory(null);
    } catch (error) {
      console.error('Error updating category:', error);
    }
  };

  const handleDeleteCategory = async (id) => {
    if (window.confirm('Are you sure you want to delete this category? This action cannot be undone.')) {
      try {
        await deleteCategory(id);
      } catch (error) {
        console.error('Error deleting category:', error);
      }
    }
  };

  const handleModalSubmit = (data) => {
    if (currentCategory) {
      handleUpdateCategory(data);
    } else {
      handleAddCategory(data);
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setCurrentCategory(null);
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'income':
        return 'bg-success-100 dark:bg-success-900/40 text-success-700 dark:text-success-400';
      case 'expense':
        return 'bg-danger-100 dark:bg-danger-900/40 text-danger-700 dark:text-danger-400';
      default:
        return 'bg-primary-100 dark:bg-primary-900/40 text-primary-700 dark:text-primary-400';
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white transition-colors duration-300">
          Category Management
        </h1>
        <button 
          className="btn btn-primary flex items-center"
          onClick={() => setIsModalOpen(true)}
        >
          <PlusCircle size={18} className="mr-1" />
          Add Category
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => (
          <div 
            key={category._id} 
            className="bg-white dark:bg-gray-800 rounded-lg shadow-card p-5 transition-colors duration-300"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <div 
                  className="w-10 h-10 rounded-full flex items-center justify-center mr-3"
                  style={{ backgroundColor: category.color + '20' }}
                >
                  <Tag 
                    size={20} 
                    style={{ color: category.color }}
                  />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    {category.name}
                  </h3>
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getTypeColor(category.type)}`}>
                    {category.type}
                  </span>
                </div>
              </div>
              
              {!category.isDefault && (
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEditCategory(category)}
                    className="text-primary-600 dark:text-primary-400 hover:text-primary-900 dark:hover:text-primary-300 transition-colors duration-200"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    onClick={() => handleDeleteCategory(category._id)}
                    className="text-danger-600 dark:text-danger-400 hover:text-danger-900 dark:hover:text-danger-300 transition-colors duration-200"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              )}
            </div>

            {category.isDefault && (
              <div className="mt-3 p-2 bg-gray-50 dark:bg-gray-700/50 rounded-md">
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Default category - cannot be deleted
                </p>
              </div>
            )}
          </div>
        ))}
      </div>

      {categories.length === 0 && (
        <div className="text-center py-10">
          <Tag className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No categories found</h3>
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            Start by creating your first custom category.
          </p>
          <button 
            className="btn btn-primary"
            onClick={() => setIsModalOpen(true)}
          >
            Create Category
          </button>
        </div>
      )}

      <CategoryModal 
        isOpen={isModalOpen}
        onClose={handleModalClose}
        category={currentCategory}
        onSubmit={handleModalSubmit}
      />
    </div>
  );
};

export default Categories;