# FlavorVault - Personal Recipe Management System

A modern web application built with React for managing, organizing, and discovering recipes. FlavorVault provides an intuitive interface for home cooks to store their favorite recipes, plan meals, and explore new culinary ideas.

![React](https://img.shields.io/badge/React-18.3.1-blue)
![Vite](https://img.shields.io/badge/Vite-5.4.10-purple)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4.14-cyan)

## ✨ Features

- **Recipe Management**: Browse, search, add, edit, and delete recipes with detailed information
- **Favorites**: Mark and organize your favorite recipes for quick access
- **Meal Planning**: Plan daily and weekly meals with an interactive calendar
- **Responsive Design**: Optimized for mobile, tablet, and desktop devices
- **Print Support**: Print-friendly views for recipes and meal plans
- **Local Storage**: All data saved locally for privacy

## 🛠️ Technologies

- **React 18.3.1** - Component-based UI framework
- **Vite 5.4.10** - Fast build tool and development server
- **React Router 6.27.0** - Client-side routing
- **Tailwind CSS 3.4.14** - Utility-first CSS framework

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Nang-Socheat/flavorvault
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser at `http://localhost:5173`

# Project Deployment: https://flavorvault.vercel.app/

### Build for Production

```bash
npm run build
npm run preview
```

## 📁 Project Structure

```
g11-fp-yourflav/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── Header.jsx       # Navigation header with menu
│   │   ├── Footer.jsx       # Footer with social links
│   │   └── RecipeCard.jsx   # Recipe card component
│   ├── pages/               # Page components
│   │   ├── Home.jsx         # Landing page with hero section
│   │   ├── BrowseRecipes.jsx # Recipe browsing with filters
│   │   ├── RecipeDetail.jsx  # Detailed recipe view
│   │   ├── AddEditRecipe.jsx # Recipe creation/editing form
│   │   ├── Favorites.jsx     # Favorites collection page
│   │   ├── MealPlanner.jsx   # Meal planning calendar
│   │   ├── About.jsx         # About page with info
│   │   ├── PrintRecipe.jsx   # Print-friendly recipe view
│   │   └── PrintMealPlan.jsx # Print-friendly meal plan
│   ├── context/
│   │   └── AppContext.jsx   # Global state management (recipes, favorites, meal plans)
│   ├── utils/
│   │   ├── sampleData.js    # 24 pre-loaded sample recipes
│   │   └── resetData.js     # Data reset utility
│   ├── assets/              # Images (food photos, backgrounds)
│   ├── App.jsx              # Root component with routing
│   ├── main.jsx             # App entry point
│   └── index.css            # Global styles and Tailwind
├── public/                  # Static assets
├── index.html               # HTML template
├── package.json             # Dependencies and scripts
├── vite.config.js           # Vite build configuration
├── tailwind.config.js       # Tailwind CSS configuration
├── postcss.config.js        # PostCSS configuration
├── eslint.config.js         # ESLint linting rules
└── README.md                # Project documentation
```

## 💾 Data Storage

All data is stored in the browser's localStorage:
- `flavorVaultRecipes` - Recipe collection
- `flavorVaultFavorites` - Favorite recipe IDs
- `enhancedMealPlan` - Meal planning data

## 📱 Key Features

### Recipe Management
- Browse recipes with category, difficulty, and time filters
- Search by name or ingredients
- View detailed recipe information including nutrition facts
- Add, edit, and delete recipes
- Print recipes for kitchen use

### Meal Planning
- Day and week calendar views
- Add multiple recipes per meal category
- Organize breakfast, lunch, dinner, and snacks
- Print weekly meal plans

### Mobile Experience
- Touch gestures for recipe navigation
- Responsive design for all screen sizes
- Optimized touch-friendly buttons

## 🎨 Sample Data

The application includes 26 pre-loaded sample recipes across various categories. You can reset to sample data from the About page.

## 👥 Contributors

Group 11 - Fall 2025 Front-End Web Development
Professor: Joe Chea
Team Members: Nang Socheat, Born Kimsan, Prech July

---
