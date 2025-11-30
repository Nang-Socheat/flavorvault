import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import Ingredient2 from '../assets/Ingredient2.jpg';

const AddEditRecipe = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addRecipe, updateRecipe, getRecipeById, recipes } = useApp();

  // Get all existing categories from recipes
  const existingCategories = [...new Set(recipes.map(r => r.category))].sort();

  const isEditMode = Boolean(id);

  // Initialize form data with lazy initializer to avoid setState in effect
  const [formData, setFormData] = useState(() => {
    if (id) {
      const existingRecipe = getRecipeById(id);
      if (existingRecipe) {
        return {
          title: existingRecipe.title,
          description: existingRecipe.description,
          image: existingRecipe.image || '',
          prepTime: existingRecipe.prepTime.toString(),
          cookTime: existingRecipe.cookTime.toString(),
          servings: existingRecipe.servings.toString(),
          difficulty: existingRecipe.difficulty,
          category: existingRecipe.category,
          ingredients: existingRecipe.ingredients,
          instructions: existingRecipe.instructions,
          tags: existingRecipe.tags ? existingRecipe.tags.join(', ') : '',
        };
      }
    }
    return {
      title: '',
      description: '',
      image: '',
      prepTime: '',
      cookTime: '',
      servings: '',
      difficulty: 'Easy',
      category: existingCategories[0] || 'Italian',
      ingredients: [''],
      instructions: [''],
      tags: '',
    };
  });

  const [errors, setErrors] = useState({});
  const [imageUploadMethod, setImageUploadMethod] = useState('url'); // 'url' or 'file'

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Convert image to base64
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          image: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleArrayItemChange = (index, value, arrayName) => {
    setFormData(prev => ({
      ...prev,
      [arrayName]: prev[arrayName].map((item, i) => (i === index ? value : item)),
    }));
  };

  const addArrayItem = (arrayName) => {
    setFormData(prev => ({
      ...prev,
      [arrayName]: [...prev[arrayName], ''],
    }));
  };

  const removeArrayItem = (index, arrayName) => {
    if (formData[arrayName].length > 1) {
      setFormData(prev => ({
        ...prev,
        [arrayName]: prev[arrayName].filter((_, i) => i !== index),
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.prepTime || formData.prepTime <= 0) newErrors.prepTime = 'Prep time must be greater than 0';
    if (!formData.cookTime || formData.cookTime <= 0) newErrors.cookTime = 'Cook time must be greater than 0';
    if (!formData.servings || formData.servings <= 0) newErrors.servings = 'Servings must be greater than 0';

    const validIngredients = formData.ingredients.filter(ing => ing.trim());
    if (validIngredients.length === 0) newErrors.ingredients = 'At least one ingredient is required';

    const validInstructions = formData.instructions.filter(inst => inst.trim());
    if (validInstructions.length === 0) newErrors.instructions = 'At least one instruction is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const recipeData = {
      title: formData.title.trim(),
      description: formData.description.trim(),
      image: formData.image.trim() || 'https://via.placeholder.com/400x300?text=Recipe',
      prepTime: parseInt(formData.prepTime),
      cookTime: parseInt(formData.cookTime),
      servings: parseInt(formData.servings),
      difficulty: formData.difficulty,
      category: formData.category,
      ingredients: formData.ingredients.filter(ing => ing.trim()),
      instructions: formData.instructions.filter(inst => inst.trim()),
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
    };

    if (isEditMode) {
      updateRecipe(id, recipeData);
    } else {
      addRecipe(recipeData);
    }

    navigate('/recipes');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 pb-0">
      <div className="max-w-[1920px] mx-auto px-2 sm:px-3 md:px-4 lg:px-6 py-6 md:py-8">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="mb-6 md:mb-8 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 transform transition-all duration-300 hover:shadow-xl">
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2 animate-[fadeInUp_0.6s_ease-out]">
              {isEditMode ? 'Edit Recipe ✏️' : 'Add New Recipe 🍳'}
            </h1>
            <p className="text-sm md:text-base text-gray-600">
              {isEditMode ? 'Update your recipe details' : 'Create a new recipe to add to your collection'}
            </p>
          </div>

          {/* Decorative Image Banner */}
          <div className="mb-6 overflow-hidden rounded-2xl shadow-xl relative h-32 md:h-40">
            <img
              src={Ingredient2}
              alt="Fresh ingredients"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-blue-900/70 via-blue-900/50 to-transparent flex items-center">
              <div className="px-6 md:px-8">
                <h2 className="text-lg md:text-xl font-bold text-white">Share Your Culinary Creation</h2>
              </div>
            </div>
          </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-4 sm:p-6 md:p-8">
          {/* Title */}
          <div className="mb-6">
            <label className="block text-gray-700 font-semibold mb-2">
              Recipe Title <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.title ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="e.g., Chocolate Chip Cookies"
            />
            {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
          </div>

          {/* Description */}
          <div className="mb-6">
            <label className="block text-gray-700 font-semibold mb-2">
              Description <span className="text-red-600">*</span>
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows="3"
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.description ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Brief description of your recipe"
            />
            {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
          </div>

          {/* Image Upload/URL */}
          <div className="mb-6">
            <label className="block text-gray-700 font-semibold mb-2">
              Recipe Image
            </label>
            
            {/* Toggle buttons for upload method */}
            <div className="flex gap-2 mb-3">
              <button
                type="button"
                onClick={() => setImageUploadMethod('url')}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  imageUploadMethod === 'url'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                🔗 URL
              </button>
              <button
                type="button"
                onClick={() => setImageUploadMethod('file')}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  imageUploadMethod === 'file'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                📁 Upload File
              </button>
            </div>

            {imageUploadMethod === 'url' ? (
              <>
                <input
                  type="url"
                  name="image"
                  value={formData.image}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="https://example.com/image.jpg"
                />
                <p className="text-gray-500 text-sm mt-1">
                  Paste a URL to an image (e.g., from Unsplash or your own hosting)
                </p>
              </>
            ) : (
              <>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
                <p className="text-gray-500 text-sm mt-1">
                  Upload an image from your computer (JPG, PNG, etc.)
                </p>
              </>
            )}

            {/* Image preview */}
            {formData.image && (
              <div className="mt-3">
                <img
                  src={formData.image}
                  alt="Recipe preview"
                  className="w-full h-48 object-cover rounded-lg border-2 border-gray-300"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/400x300?text=Invalid+Image';
                  }}
                />
              </div>
            )}
          </div>

          {/* Time and Servings Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Prep Time (min) <span className="text-red-600">*</span>
              </label>
              <input
                type="number"
                name="prepTime"
                value={formData.prepTime}
                onChange={handleInputChange}
                min="1"
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.prepTime ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.prepTime && <p className="text-red-500 text-sm mt-1">{errors.prepTime}</p>}
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Cook Time (min) <span className="text-red-600">*</span>
              </label>
              <input
                type="number"
                name="cookTime"
                value={formData.cookTime}
                onChange={handleInputChange}
                min="1"
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.cookTime ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.cookTime && <p className="text-red-500 text-sm mt-1">{errors.cookTime}</p>}
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Servings <span className="text-red-600">*</span>
              </label>
              <input
                type="number"
                name="servings"
                value={formData.servings}
                onChange={handleInputChange}
                min="1"
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.servings ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.servings && <p className="text-red-500 text-sm mt-1">{errors.servings}</p>}
            </div>
          </div>

          {/* Category and Difficulty */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Category <span className="text-red-600">*</span>
              </label>
              <div className="relative">
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white font-medium text-gray-700 cursor-pointer hover:border-blue-400 transition-colors"
                >
                  {existingCategories.map(category => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none">
                  <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
              <p className="text-gray-500 text-xs mt-1">
                🍽️ Select from existing categories
              </p>
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Difficulty <span className="text-red-600">*</span>
              </label>
              <div className="relative">
                <select
                  name="difficulty"
                  value={formData.difficulty}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white font-medium text-gray-700 cursor-pointer hover:border-blue-400 transition-colors"
                >
                  <option value="Easy">🟢 Easy</option>
                  <option value="Medium">🟡 Medium</option>
                  <option value="Hard">🔴 Hard</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none">
                  <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Tags */}
          <div className="mb-6">
            <label className="block text-gray-700 font-semibold mb-2">
              Tags (comma-separated)
            </label>
            <input
              type="text"
              name="tags"
              value={formData.tags}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., vegetarian, quick, healthy"
            />
          </div>

          {/* Ingredients */}
          <div className="mb-6">
            <label className="block text-gray-700 font-semibold mb-2">
              Ingredients *
            </label>
            {formData.ingredients.map((ingredient, index) => (
              <div key={index} className="flex mb-2">
                <input
                  type="text"
                  value={ingredient}
                  onChange={(e) => handleArrayItemChange(index, e.target.value, 'ingredients')}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder={`Ingredient ${index + 1}`}
                />
                <button
                  type="button"
                  onClick={() => removeArrayItem(index, 'ingredients')}
                  className="ml-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                  disabled={formData.ingredients.length === 1}
                >
                  ✕
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => addArrayItem('ingredients')}
              className="mt-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
            >
              + Add Ingredient
            </button>
            {errors.ingredients && <p className="text-red-500 text-sm mt-1">{errors.ingredients}</p>}
          </div>

          {/* Instructions */}
          <div className="mb-6">
            <label className="block text-gray-700 font-semibold mb-2">
              Instructions *
            </label>
            {formData.instructions.map((instruction, index) => (
              <div key={index} className="flex mb-2">
                <textarea
                  value={instruction}
                  onChange={(e) => handleArrayItemChange(index, e.target.value, 'instructions')}
                  rows="2"
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder={`Step ${index + 1}`}
                />
                <button
                  type="button"
                  onClick={() => removeArrayItem(index, 'instructions')}
                  className="ml-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                  disabled={formData.instructions.length === 1}
                >
                  ✕
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => addArrayItem('instructions')}
              className="mt-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
            >
              + Add Step
            </button>
            {errors.instructions && <p className="text-red-500 text-sm mt-1">{errors.instructions}</p>}
          </div>

          {/* Submit Buttons */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-3 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition-colors"
            >
              {isEditMode ? 'Update Recipe' : 'Create Recipe'}
            </button>
          </div>
        </form>
        </div>
      </div>
    </div>
  );
};

export default AddEditRecipe;
