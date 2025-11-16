# FlavorVault - Interactive Recipe Book

A modern, full-featured web application for managing your personal recipe collection. Built with React, this app allows you to browse, search, filter, and organize your favorite recipes with an intuitive and beautiful user interface.

## Features

- **Recipe Management**: Add, edit, and delete recipes with ease
- **Smart Search**: Search recipes by name, ingredients, category, or tags
- **Advanced Filtering**: Filter by category, difficulty level, and preparation time
- **Favorites System**: Mark and save your favorite recipes for quick access
- **Photo Support**: Add images to recipes via URL
- **Responsive Design**: Fully responsive UI that works on all devices
- **Data Persistence**: All data is saved locally using browser localStorage
- **6 Distinct Pages**: Home, Browse Recipes, Recipe Detail, Add/Edit Recipe, Favorites, and About

## Tech Stack

- **React 19** - Component-based UI library
- **React Router v7** - Client-side routing
- **React Context API** - Global state management
- **Tailwind CSS v4** - Utility-first CSS framework
- **Vite** - Fast build tool and development server
- **localStorage** - Browser-based data persistence

## Project Structure

```
flavorvault/
├── public/
│   └── _redirects              # Netlify redirect configuration
├── src/
│   ├── components/             # Reusable components
│   │   ├── FilterPanel.jsx
│   │   ├── Loading.jsx
│   │   ├── Navbar.jsx
│   │   ├── RecipeCard.jsx
│   │   └── SearchBar.jsx
│   ├── context/                # React Context
│   │   └── AppContext.jsx
│   ├── data/                   # Sample data
│   │   └── sampleRecipes.js
│   ├── pages/                  # Page components
│   │   ├── About.jsx
│   │   ├── AddEditRecipe.jsx
│   │   ├── BrowseRecipes.jsx
│   │   ├── Favorites.jsx
│   │   ├── Home.jsx
│   │   └── RecipeDetail.jsx
│   ├── utils/                  # Utility functions
│   │   └── localStorage.js
│   ├── App.jsx                 # Main app component
│   ├── index.css               # Global styles
│   └── main.jsx                # App entry point
├── .gitignore
├── package.json
├── README.md
├── tailwind.config.js
├── vercel.json                 # Vercel deployment config
└── vite.config.js
```

## Assignment Requirements Met

### ✅ Minimum 5 Pages/Views
1. **Home/Dashboard** - Welcome page with stats and featured recipes
2. **Browse Recipes** - Main recipe listing with search and filters
3. **Recipe Detail** - Individual recipe view
4. **Add/Edit Recipe** - Form for creating and editing recipes
5. **Favorites** - Collection of favorite recipes
6. **About** - Application information (bonus 6th page)

### ✅ React Context Management
- `AppContext` manages global state for:
  - Recipes collection
  - Favorites list
  - Application settings
  - All CRUD operations

### ✅ React Hooks Implementation
- **useState**: Component state management throughout the app
- **useEffect**: Side effects for data loading and filtering
- **useContext**: Accessing global state via custom `useApp` hook
- **useParams**: Route parameters for recipe detail/edit pages
- **useNavigate**: Programmatic navigation

### ✅ Data Persistence
- **localStorage** implementation for all data:
  - Recipes are saved and loaded automatically
  - Favorites persist between sessions
  - Sample data loaded on first visit
  - All data remains private to the user's browser

### ✅ Deployment Ready
- Configured for **Vercel** (vercel.json)
- Configured for **Netlify** (public/_redirects)
- Also compatible with **GitHub Pages**

### ✅ UX/UI Best Practices
- Responsive design using Tailwind CSS
- Mobile-friendly navigation
- Intuitive user flows
- Clear visual hierarchy
- Accessible form validation
- Loading states and error handling
- Consistent design language

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd flavorvault
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and visit `http://localhost:5173`

### Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

### Preview Production Build

```bash
npm run preview
```

## Deployment

### Vercel

1. Install Vercel CLI: `npm i -g vercel`
2. Run: `vercel`
3. Follow the prompts

Or connect your GitHub repository to Vercel for automatic deployments.

### Netlify

1. Install Netlify CLI: `npm i -g netlify-cli`
2. Run: `netlify deploy`
3. For production: `netlify deploy --prod`

Or drag and drop the `dist` folder to Netlify's web interface.

### GitHub Pages

1. Update `vite.config.js` to set the correct base path
2. Build: `npm run build`
3. Deploy the `dist` folder to GitHub Pages

## Usage Guide

### Adding a Recipe

1. Navigate to "Add Recipe" page
2. Fill in the recipe details:
   - Title and description
   - Prep time, cook time, and servings
   - Category and difficulty
   - Ingredients (add multiple)
   - Step-by-step instructions
   - Optional: Image URL and tags
3. Click "Create Recipe"

### Searching and Filtering

1. Go to "Browse Recipes"
2. Use the search bar to find recipes by keywords
3. Apply filters for category, difficulty, or prep time
4. Click on any recipe card to view details

### Managing Favorites

- Click the heart icon on any recipe card to add/remove from favorites
- View all favorites on the "Favorites" page

### Editing a Recipe

1. Open a recipe detail page
2. Click "Edit Recipe"
3. Make your changes
4. Click "Update Recipe"

## Key React Concepts Demonstrated

1. **Component Composition**: Modular, reusable components
2. **Props & State**: Proper data flow and state management
3. **Context API**: Global state without prop drilling
4. **React Hooks**: useState, useEffect, useContext, custom hooks
5. **React Router**: Client-side routing with dynamic routes
6. **Controlled Components**: Form handling with React state
7. **Conditional Rendering**: Smart UI based on state
8. **Event Handling**: User interactions and form submissions

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

This project was created as a learning exercise for a Front-End Web Development course.

## Acknowledgments

- Sample recipe images from Unsplash
- Icons: Emoji-based for simplicity and cross-platform compatibility
- Built with modern web technologies and best practices
