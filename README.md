# FlavorVault - Personal Recipe Management System

A modern, feature-rich web application built with React for managing, organizing, and discovering recipes. FlavorVault provides an intuitive interface for home cooks to store their favorite recipes, plan meals, and explore new culinary ideas.

![React](https://img.shields.io/badge/React-18.3.1-blue)
![Vite](https://img.shields.io/badge/Vite-5.4.10-purple)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4.14-cyan)
![License](https://img.shields.io/badge/License-MIT-green)

## 🌟 Features

### Recipe Management
- **Browse & Search**: Filter recipes by category, difficulty, cooking time, and search by name or ingredients
- **Recipe Details**: View comprehensive recipe information including ingredients, instructions, nutrition facts, and cooking tips
- **Add/Edit Recipes**: Create and modify recipes with an intuitive form interface
- **Favorites**: Mark recipes as favorites for quick access
- **Print Recipes**: Print-friendly recipe view for kitchen use

### Meal Planning
- **Weekly Planner**: Drag-and-drop meal planning interface
- **Multiple Meal Types**: Organize breakfast, lunch, dinner, and snacks
- **Calendar View**: Day and week views for flexible planning
- **Print Meal Plans**: Generate printable weekly meal plans

### User Experience
- **Responsive Design**: Optimized for mobile, tablet, and desktop devices
- **Swipe Navigation**: Touch gestures for mobile recipe browsing
- **Dark Mode Ready**: Clean, modern UI with gradient designs
- **Local Storage**: All data saved locally for privacy and offline access
- **Smart Scroll**: Returns to last viewed recipe when navigating back

## 🛠️ Technologies Used

### Core Technologies
- **React 18.3.1**: Component-based UI with hooks and context
- **Vite 5.4.10**: Fast build tool and development server
- **React Router 6.27.0**: Client-side routing and navigation
- **Tailwind CSS 3.4.14**: Utility-first CSS framework

### Development Tools
- **ESLint**: Code linting and quality checks
- **PostCSS**: CSS processing with Autoprefixer
- **React DnD**: Drag-and-drop functionality for meal planning

## 📁 Project Structure

```
g11-fp-yourflav/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── Header.jsx       # Navigation bar
│   │   ├── Footer.jsx       # Footer with links
│   │   ├── RecipeCard.jsx   # Recipe card display
│   │   └── ...
│   ├── pages/               # Page components
│   │   ├── Home.jsx         # Landing page
│   │   ├── BrowseRecipes.jsx # Recipe browsing
│   │   ├── RecipeDetail.jsx  # Recipe details
│   │   ├── AddEditRecipe.jsx # Recipe form
│   │   ├── Favorites.jsx     # Favorites list
│   │   ├── About.jsx         # About page
│   │   ├── MealPlanner.jsx   # Meal planning
│   │   └── Print*.jsx        # Print views
│   ├── context/
│   │   └── AppContext.jsx   # Global state management
│   ├── utils/
│   │   ├── sampleData.js    # Sample recipes
│   │   └── resetData.js     # Data reset utility
│   ├── assets/              # Images and media
│   ├── App.jsx              # Root component
│   ├── main.jsx             # Entry point
│   └── index.css            # Global styles
├── public/                  # Static assets
├── index.html               # HTML template
├── package.json             # Dependencies
├── vite.config.js           # Vite configuration
├── tailwind.config.js       # Tailwind configuration
└── README.md                # This file
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd g11-fp-yourflav
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to:
```
http://localhost:5173
```

### Build for Production

```bash
npm run build
```

The optimized production build will be in the `dist` folder.

### Preview Production Build

```bash
npm run preview
```

## 🎯 Key React Concepts Implementation

### Context API
The application uses React Context for global state management:

**AppContext** (`src/context/AppContext.jsx`):
- Centralized state for recipes, favorites, and meal plans
- Provides functions for CRUD operations
- Manages local storage synchronization
- Used throughout the app to avoid prop drilling

```javascript
// Example usage
const { recipes, addRecipe, toggleFavorite } = useApp();
```

### React Hooks

**useState**: Component-level state management
- Form inputs in AddEditRecipe
- Modal visibility states
- Search and filter states
- View mode toggles

**useEffect**: Side effects and lifecycle management
- Loading data from localStorage on mount
- Saving data to localStorage on changes
- Scroll position restoration
- Event listener management

**useCallback**: Performance optimization
- Memoized navigation functions in RecipeDetail
- Prevents unnecessary re-renders
- Optimizes swipe gesture handlers

**useRef**: Direct DOM access and value persistence
- Touch gesture coordinates
- Scroll position tracking
- Input focus management

**useNavigate**: Programmatic navigation
- Route navigation after actions
- Back button functionality
- Context-aware routing (browse/favorites)

**useParams**: Route parameter extraction
- Recipe ID from URL
- Dynamic recipe loading

**useSearchParams**: URL query parameters
- Category filtering from URL
- Search state persistence

### Custom Hook
**useApp**: Custom hook wrapping AppContext
- Simplifies context consumption
- Provides type safety
- Encapsulates context logic

## 📱 Responsive Design

The application is fully responsive with mobile-first design:

### Breakpoints
- **Mobile**: < 640px
- **Small**: 640px - 767px
- **Medium**: 768px - 1023px (Tablets)
- **Large**: 1024px - 1279px
- **XL**: 1280px+ (Desktops)

### Mobile Features
- Touch-friendly buttons (min 44x44px)
- Swipe gestures for recipe navigation
- Hamburger menu
- Optimized card layouts
- Stack navigation

### Desktop Features
- Multi-column grid layouts
- Hover effects
- Keyboard navigation
- Previous/Next buttons

## 💾 Data Persistence

All data is stored in the browser's localStorage:

**Storage Keys**:
- `flavorVaultRecipes`: Recipe collection
- `flavorVaultFavorites`: Favorite recipe IDs
- `enhancedMealPlan`: Meal planning data
- `lastViewedRecipeId`: Navigation state
- `recipeSourcePage`: Context tracking

**Benefits**:
- No backend required
- Works offline
- Privacy-focused
- Fast data access

## 🎨 Design Features

### UI/UX Highlights
- Gradient backgrounds and buttons
- Smooth animations and transitions
- Card-based layouts
- Color-coded categories
- Visual feedback on interactions
- Loading states and error handling

### Accessibility
- Semantic HTML
- ARIA labels
- Keyboard navigation
- Touch-friendly targets
- Readable font sizes
- High contrast ratios

## 📊 Sample Data

The application comes with 24 pre-loaded sample recipes covering various categories:
- Breakfast
- Lunch
- Dinner
- Dessert
- Snacks
- Beverages

Users can reset to sample data anytime from the About page.

## 🔄 Key User Flows

### Adding a Recipe
1. Navigate to Add Recipe
2. Fill in recipe details (title, ingredients, instructions, etc.)
3. Upload optional image
4. Add tags and nutrition information
5. Save recipe

### Meal Planning
1. Navigate to Meal Planner
2. Select day view or week view
3. Click "+" to add recipes to meal slots
4. Search and select recipes from modal
5. Drag to reorder (desktop)
6. Print meal plan

### Recipe Navigation
1. Browse recipes with filters
2. Click recipe card to view details
3. Use Previous/Next buttons (desktop) or swipe (mobile)
4. Click "Back to Browse" to return to last position

## 🏆 Advanced Features

### Smart Navigation
- Context-aware back button (Browse/Favorites)
- Scroll position preservation
- Smooth scroll-to-recipe on return

### Responsive Text Handling
- Line clamping for long titles
- Tooltips on hover for full text
- Adaptive font sizes

### Touch Gestures
- Swipe left for next recipe
- Swipe right for previous recipe
- Mobile-optimized interactions

### Print Views
- Printer-friendly recipe layout
- Formatted meal plan printing
- Remove unnecessary UI elements

## 🐛 Known Limitations

- Data is stored locally (not synchronized across devices)
- Image uploads are stored as base64 (may impact storage)
- No user authentication
- No recipe sharing functionality
- Limited to browser storage capacity

## 🔮 Future Enhancements

- Cloud synchronization
- User accounts
- Recipe sharing and social features
- Shopping list generation
- Nutritional analysis
- Recipe import from URLs
- Multi-language support
- Recipe scaling calculator

## 📝 Development

### Code Quality
- ESLint configuration for code quality
- Consistent coding style
- Component-based architecture
- Reusable utility functions

### Performance
- Lazy loading considered
- Optimized re-renders with useCallback
- Efficient state updates
- Minimal dependencies

## 📄 License

This project is licensed under the MIT License.

## 👥 Contributors

- Group 11 - Fall 2025 Front-End Web Development

## 🙏 Acknowledgments

- Sample recipe data curated for demonstration
- Images sourced from public domain
- Built as a final project for Front-End Web Development course

---

**Made with ❤️ using React and Tailwind CSS**
