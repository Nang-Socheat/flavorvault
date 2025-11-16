import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

const AddEditRecipe = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addRecipe, updateRecipe, getRecipeById } = useApp();

  const isEditMode = Boolean(id);
  const existingRecipe = isEditMode ? getRecipeById(id) : null;

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image: '',
    prepTime: '',
    cookTime: '',
    servings: '',
    difficulty: 'Easy',
    category: 'Italian',
    ingredients: [''],
    instructions: [''],
    tags: '',
  });

  const [errors, setErrors] = useState({});

  // Load existing recipe data in edit mode (useEffect for side effects)
  useEffect(() => {
    if (isEditMode && existingRecipe) {
      setFormData({
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
      });
    }
  }, [isEditMode, existingRecipe]);

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
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            {isEditMode ? 'Edit Recipe' : 'Add New Recipe'}
          </h1>
          <p className="text-gray-600">
            {isEditMode ? 'Update your recipe details' : 'Create a new recipe to add to your collection'}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-8">
          {/* Title */}
          <div className="mb-6">
            <label className="block text-gray-700 font-semibold mb-2">
              Recipe Title *
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
              Description *
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

          {/* Image URL */}
          <div className="mb-6">
            <label className="block text-gray-700 font-semibold mb-2">
              Image URL
            </label>
            <input
              type="url"
              name="image"
              value={formData.image}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="https://example.com/image.jpg (or leave blank for default)"
            />
            <p className="text-gray-500 text-sm mt-1">
              Paste a URL to an image (e.g., from Unsplash or your own hosting)
            </p>
          </div>

          {/* Time and Servings Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Prep Time (min) *
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
                Cook Time (min) *
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
                Servings *
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
                Category *
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Italian">Italian</option>
                <option value="Indian">Indian</option>
                <option value="Mexican">Mexican</option>
                <option value="Dessert">Dessert</option>
                <option value="Breakfast">Breakfast</option>
                <option value="Salad">Salad</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Difficulty *
              </label>
              <select
                name="difficulty"
                value={formData.difficulty}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
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
  );
};

export default AddEditRecipe;
