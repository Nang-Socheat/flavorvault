import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import BrowseRecipes from './pages/BrowseRecipes';
import RecipeDetail from './pages/RecipeDetail';
import AddEditRecipe from './pages/AddEditRecipe';
import Favorites from './pages/Favorites';
import About from './pages/About';
import PrintRecipe from './pages/PrintRecipe';

function App() {
  return (
    <AppProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
        <Routes>
            <Route path="/print/:id" element={<PrintRecipe />} />
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
                  <Route path="/about" element={<About />} />
                </Routes>
              </>
            } />
          </Routes>
        </div>
      </Router>
    </AppProvider>
  );
}

export default App;
