import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { AppProvider } from './context/AppContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import BrowseRecipes from './pages/BrowseRecipes';
import RecipeDetail from './pages/RecipeDetail';
import AddEditRecipe from './pages/AddEditRecipe';
import Favorites from './pages/Favorites';
import MealPlanner from './pages/MealPlanner';
import About from './pages/About';
import PrintRecipe from './pages/PrintRecipe';
import PrintMealPlan from './pages/PrintMealPlan';

// Component to scroll to top on route change and page load
function ScrollToTop() {
  const { pathname } = useLocation();

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  // Disable browser's scroll restoration and scroll to top on mount
  useEffect(() => {
    // Disable automatic scroll restoration
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
    
    // Scroll to top immediately
    window.scrollTo(0, 0);
    
    // Also scroll after a small delay to ensure content is loaded
    const timer = setTimeout(() => {
      window.scrollTo(0, 0);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  return null;
}

function App() {
  return (
    <AppProvider>
      <Router>
        <ScrollToTop />
        <div className="min-h-screen bg-gray-50">
        <Routes>
            <Route path="/print/:id" element={<PrintRecipe />} />
            <Route path="/print-meal-plan" element={<PrintMealPlan />} />
            <Route path="*" element={
              <>
                <Navbar />
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/recipes" element={<BrowseRecipes />} />
                  <Route path="/recipe/:id" element={<RecipeDetail />} />
                  <Route path="/add" element={<AddEditRecipe />} />
                  <Route path="/edit/:id" element={<AddEditRecipe />} />
                  <Route path="/favorites" element={<Favorites />} />
                  <Route path="/meal-planner" element={<MealPlanner />} />
                  <Route path="/about" element={<About />} />
                </Routes>
                <Footer />
              </>
            } />
          </Routes>
        </div>
      </Router>
    </AppProvider>
  );
}

export default App;
