# Frontend-Backend Integration Guide

This guide helps frontend developers integrate the React frontend with the new backend API.

## Quick Start

### 1. Install Backend Dependencies

```bash
cd server
npm install
```

### 2. Configure Environment

```bash
cd server
cp .env.example .env
```

Update `.env` with your configuration:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/flavorvault
JWT_SECRET=your_secret_key_here
OPENAI_API_KEY=your_openai_api_key
# ... other configs
```

### 3. Start MongoDB

Ensure MongoDB is running on your system:
```bash
mongod
```

### 4. Seed Database

```bash
cd server
npm run seed
```

### 5. Start Backend Server

```bash
cd server
npm run dev
```

Server will run on `http://localhost:5000`

### 6. Start Frontend

```bash
# From project root
npm run dev
```

Frontend runs on `http://localhost:5173`

---

## API Client Setup

### Install Axios

```bash
npm install axios
```

### Create API Client

Create `src/utils/api.js`:

```javascript
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Unauthorized - clear token and redirect to login
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
```

### Environment Variable

Create `.env` in project root:
```env
VITE_API_URL=http://localhost:5000/api
```

---

## Authentication Integration

### Update AppContext

Replace localStorage-only context with API calls:

```javascript
import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../utils/api';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);

  // Check if user is logged in on mount
  useEffect(() => {
    if (token) {
      getCurrentUser();
    }
  }, [token]);

  // Get current user
  const getCurrentUser = async () => {
    try {
      const response = await api.get('/auth/me');
      setUser(response.data.user);
    } catch (error) {
      console.error('Get user error:', error);
      setToken(null);
      localStorage.removeItem('token');
    }
  };

  // Login
  const login = async (email, password) => {
    try {
      setLoading(true);
      const response = await api.post('/auth/login', { email, password });
      const { token, user } = response.data;

      localStorage.setItem('token', token);
      setToken(token);
      setUser(user);

      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Login failed'
      };
    } finally {
      setLoading(false);
    }
  };

  // Register
  const register = async (name, email, password, userType = 'individual') => {
    try {
      setLoading(true);
      const response = await api.post('/auth/register', {
        name,
        email,
        password,
        userType
      });
      const { token, user } = response.data;

      localStorage.setItem('token', token);
      setToken(token);
      setUser(user);

      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Registration failed'
      };
    } finally {
      setLoading(false);
    }
  };

  // Logout
  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  // Fetch recipes
  const fetchRecipes = async (filters = {}) => {
    try {
      setLoading(true);
      const response = await api.get('/recipes', { params: filters });
      setRecipes(response.data.recipes);
      return response.data;
    } catch (error) {
      console.error('Fetch recipes error:', error);
      return { success: false, recipes: [] };
    } finally {
      setLoading(false);
    }
  };

  // Create recipe
  const createRecipe = async (recipeData) => {
    try {
      setLoading(true);
      const response = await api.post('/recipes', recipeData);
      return { success: true, recipe: response.data.recipe };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to create recipe'
      };
    } finally {
      setLoading(false);
    }
  };

  // Update recipe
  const updateRecipe = async (id, recipeData) => {
    try {
      setLoading(true);
      const response = await api.put(`/recipes/${id}`, recipeData);
      return { success: true, recipe: response.data.recipe };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to update recipe'
      };
    } finally {
      setLoading(false);
    }
  };

  // Delete recipe
  const deleteRecipe = async (id) => {
    try {
      setLoading(true);
      await api.delete(`/recipes/${id}`);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to delete recipe'
      };
    } finally {
      setLoading(false);
    }
  };

  // Toggle favorite
  const toggleFavorite = async (recipeId) => {
    try {
      const isFavorite = user?.favorites?.includes(recipeId);

      if (isFavorite) {
        await api.delete(`/users/favorites/${recipeId}`);
      } else {
        await api.post(`/users/favorites/${recipeId}`);
      }

      // Refresh user data
      await getCurrentUser();
      return { success: true };
    } catch (error) {
      return { success: false };
    }
  };

  const value = {
    user,
    token,
    recipes,
    loading,
    login,
    register,
    logout,
    fetchRecipes,
    createRecipe,
    updateRecipe,
    deleteRecipe,
    toggleFavorite,
    getCurrentUser
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};
```

---

## Example Component Integrations

### Login Page

```javascript
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, loading } = useApp();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const result = await login(email, password);

    if (result.success) {
      navigate('/');
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-6">Login</h2>

      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block mb-2">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border rounded"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block mb-2">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border rounded"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );
};

export default Login;
```

### Browse Recipes with Backend

```javascript
import React, { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';
import api from '../utils/api';

const BrowseRecipes = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    difficulty: '',
    page: 1,
    limit: 12
  });

  useEffect(() => {
    fetchRecipes();
  }, [filters]);

  const fetchRecipes = async () => {
    try {
      setLoading(true);
      const response = await api.get('/recipes', { params: filters });
      setRecipes(response.data.recipes);
    } catch (error) {
      console.error('Error fetching recipes:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Filters */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search recipes..."
          value={filters.search}
          onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          className="px-4 py-2 border rounded"
        />
      </div>

      {/* Recipe Grid */}
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {recipes.map((recipe) => (
            <RecipeCard key={recipe._id} recipe={recipe} />
          ))}
        </div>
      )}
    </div>
  );
};
```

### AI Features Example

```javascript
import React, { useState } from 'react';
import api from '../utils/api';

const AIRecipeSuggestions = () => {
  const [ingredients, setIngredients] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);

  const getSuggestions = async () => {
    try {
      setLoading(true);
      const response = await api.post('/ai/suggest-recipes', {
        ingredients: ingredients.split(',').map(i => i.trim()),
        preferences: 'delicious',
        mood: 'something quick'
      });
      setSuggestions(response.data.suggestions);
    } catch (error) {
      console.error('Error getting suggestions:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">AI Recipe Suggestions</h2>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Enter ingredients (comma separated)"
          value={ingredients}
          onChange={(e) => setIngredients(e.target.value)}
          className="w-full px-4 py-2 border rounded"
        />
      </div>

      <button
        onClick={getSuggestions}
        disabled={loading}
        className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
      >
        {loading ? 'Getting Suggestions...' : 'Get Suggestions'}
      </button>

      {suggestions.length > 0 && (
        <div className="mt-6">
          {suggestions.map((suggestion, index) => (
            <div key={index} className="bg-white p-4 rounded shadow mb-4">
              <h3 className="font-bold">{suggestion.name}</h3>
              <p className="text-gray-600">{suggestion.description}</p>
              <p className="text-sm text-gray-500 mt-2">{suggestion.reason}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
```

---

## Common API Patterns

### Error Handling

```javascript
try {
  const response = await api.get('/recipes');
  // Handle success
} catch (error) {
  if (error.response) {
    // Server responded with error
    console.error('Error:', error.response.data.message);
  } else if (error.request) {
    // Request made but no response
    console.error('Network error');
  } else {
    // Other errors
    console.error('Error:', error.message);
  }
}
```

### Pagination

```javascript
const [page, setPage] = useState(1);
const [totalPages, setTotalPages] = useState(1);

const fetchRecipes = async () => {
  const response = await api.get('/recipes', {
    params: { page, limit: 12 }
  });

  setRecipes(response.data.recipes);
  setTotalPages(response.data.pagination.pages);
};
```

### File Upload

```javascript
const uploadImage = async (file) => {
  const formData = new FormData();
  formData.append('image', file);

  const response = await api.post('/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });

  return response.data.imageUrl;
};
```

### PDF Download

```javascript
const downloadRecipePDF = async (recipeId) => {
  try {
    const response = await api.get(`/recipes/${recipeId}/pdf`, {
      responseType: 'blob'
    });

    // Create download link
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `recipe-${recipeId}.pdf`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  } catch (error) {
    console.error('Download error:', error);
  }
};
```

---

## Protected Routes

```javascript
import { Navigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

const ProtectedRoute = ({ children, requiredRole }) => {
  const { user, token } = useApp();

  if (!token) {
    return <Navigate to="/login" />;
  }

  if (requiredRole && user?.role !== requiredRole) {
    return <Navigate to="/" />;
  }

  return children;
};

// Usage in routes
<Route
  path="/admin"
  element={
    <ProtectedRoute requiredRole="admin">
      <AdminDashboard />
    </ProtectedRoute>
  }
/>
```

---

## WebSocket Integration (Real-time)

```javascript
import { io } from 'socket.io-client';

const socket = io('http://localhost:5000');

// Join order room for updates
socket.emit('join-order-room', orderId);

// Listen for order updates
socket.on('order-status-updated', (data) => {
  console.log('Order updated:', data);
  // Update UI
});

// Join forum for real-time discussions
socket.emit('join-forum', forumId);

socket.on('new-reply', (data) => {
  console.log('New reply:', data);
  // Add reply to UI
});
```

---

## Testing Endpoints

Use these test credentials after seeding:

- **Admin**: `admin@flavorvault.com` / `admin123`
- **Chef (Expert)**: `chef@flavorvault.com` / `chef123`
- **Restaurant**: `restaurant@flavorvault.com` / `restaurant123`
- **User**: `user@flavorvault.com` / `user123`

---

## Deployment

### Environment Variables for Production

```env
NODE_ENV=production
PORT=5000
MONGODB_URI=your_production_mongodb_uri
JWT_SECRET=your_strong_secret_key
FRONTEND_URL=https://your-frontend-domain.com
OPENAI_API_KEY=your_openai_key
# ... other production configs
```

### CORS Configuration

Update `server/server.js` CORS origin for production:

```javascript
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));
```

---

## Troubleshooting

### Common Issues

1. **CORS errors**: Ensure backend CORS is configured with frontend URL
2. **401 Unauthorized**: Check if token is properly stored and sent
3. **Connection refused**: Ensure backend server is running
4. **MongoDB connection failed**: Check if MongoDB is running

### Debug Tips

```javascript
// Enable request/response logging
api.interceptors.request.use((config) => {
  console.log('Request:', config);
  return config;
});

api.interceptors.response.use((response) => {
  console.log('Response:', response);
  return response;
});
```

---

## Next Steps

1. ✅ Set up backend server
2. ✅ Create API client
3. ✅ Update AppContext with API calls
4. Create authentication pages (Login/Register)
5. Update existing components to use API
6. Implement new features (AI, Forums, Meal Planning, etc.)
7. Add real-time features with Socket.io
8. Test all features
9. Deploy to production

Happy coding! 🚀
