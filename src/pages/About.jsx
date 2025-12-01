import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { resetToSampleData } from '../utils/resetData';
import Food1 from '../assets/Food1.jpg';
import Ingredient2 from '../assets/Ingredient2.jpg';
import Vegetables1 from '../assets/vegetables1.jpg';
import ChristmasDay from '../assets/ChristmasDay.jpg';
import Amok from '../assets/Amok.jpg';

const About = () => {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const features = [
    {
      icon: '📚',
      title: 'Recipe Management',
      description: 'Easily add, edit, and organize your favorite recipes in one place',
      gradient: 'from-blue-500 to-indigo-500',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
    },
    {
      icon: '🔍',
      title: 'Smart Search',
      description: 'Find recipes quickly by name, ingredients, category, or tags',
      gradient: 'from-purple-500 to-pink-500',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200',
    },
    {
      icon: '🔧',
      title: 'Advanced Filtering',
      description: 'Filter recipes by category, difficulty level, and preparation time',
      gradient: 'from-green-500 to-emerald-500',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
    },
    {
      icon: '❤️',
      title: 'Favorites',
      description: 'Save your most-loved recipes for quick access anytime',
      gradient: 'from-red-500 to-pink-500',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
    },
    {
      icon: '📸',
      title: 'Photo Support',
      description: 'Add images to your recipes to make them more appealing',
      gradient: 'from-orange-500 to-amber-500',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200',
    },
    {
      icon: '💾',
      title: 'Local Storage',
      description: 'All your data is saved locally in your browser for privacy and persistence',
      gradient: 'from-cyan-500 to-blue-500',
      bgColor: 'bg-cyan-50',
      borderColor: 'border-cyan-200',
    },
  ];


  return (
    <div className="min-h-screen bg-gray-50 py-8 md:py-12 relative overflow-hidden">
      {/* Scroll to Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-all duration-300 transform hover:scale-110 z-50 animate-[fadeInUp_0.3s_ease-out]"
          aria-label="Scroll to top"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 10l7-7m0 0l7 7m-7-7v18"
            />
          </svg>
        </button>
      )}

      {/* Animated Blurry Background Images */}
      <div className="fixed inset-0 pointer-events-none opacity-20 z-0">
        <div className="absolute top-10 -right-20 w-96 h-96 animate-[float_20s_ease-in-out_infinite]">
          <img
            src={ChristmasDay}
            alt=""
            className="w-full h-full object-cover rounded-full blur-3xl"
          />
        </div>
        <div className="absolute bottom-20 -left-20 w-80 h-80 animate-[float_25s_ease-in-out_infinite_reverse]">
          <img
            src={Amok}
            alt=""
            className="w-full h-full object-cover rounded-full blur-3xl"
          />
        </div>
      </div>

      <div className="max-w-[1920px] mx-auto px-2 sm:px-3 md:px-4 lg:px-6 relative z-10">
        {/* Header - Enhanced with gradient and animations */}
        <div className="text-center mb-8 md:mb-12 relative">
          {/* Decorative circles */}
          <div className="absolute -top-10 left-1/4 w-20 h-20 bg-blue-200 rounded-full blur-2xl opacity-50 animate-pulse"></div>
          <div className="absolute -top-5 right-1/4 w-16 h-16 bg-purple-200 rounded-full blur-2xl opacity-50 animate-pulse" style={{animationDelay: '1s'}}></div>
          
          <div className="inline-block mb-4">
            <div className="flex items-center gap-3 justify-center">
              <span className="text-5xl md:text-6xl animate-bounce">🍳</span>
              <h1 className="text-3xl sm:text-4xl md:text-6xl font-extrabold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent animate-[fadeIn_1s_ease-out]">
                About FlavorVault
              </h1>
              <span className="text-5xl md:text-6xl animate-bounce" style={{animationDelay: '0.2s'}}>📖</span>
            </div>
          </div>
          
          <div className="relative inline-block">
            <p className="text-base md:text-xl lg:text-2xl text-gray-700 max-w-3xl mx-auto px-4 leading-relaxed font-medium">
              Your personal digital cookbook for 
              <span className="text-blue-600 font-bold"> storing</span>,
              <span className="text-purple-600 font-bold"> organizing</span>, and
              <span className="text-pink-600 font-bold"> discovering</span> delicious recipes
            </p>
            {/* Decorative underline */}
            <div className="mt-4 flex justify-center gap-2">
              <div className="w-12 h-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full"></div>
              <div className="w-12 h-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full"></div>
              <div className="w-12 h-1 bg-gradient-to-r from-pink-600 to-red-600 rounded-full"></div>
            </div>
          </div>
        </div>

        {/* Mission Section with Image - Enhanced */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8 md:mb-12 items-center">
          <div className="bg-gradient-to-br from-white via-blue-50 to-purple-50 rounded-2xl shadow-xl p-6 md:p-8 border-2 border-blue-200 transform hover:scale-105 transition-all duration-300">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-4xl">🎯</span>
              <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Our Mission</h2>
            </div>
            <p className="text-sm md:text-base lg:text-lg text-gray-700 leading-relaxed">
              FlavorVault was created to help home cooks and food enthusiasts keep all their recipes
              organized in one beautiful, easy-to-use platform. Whether you're storing family recipes,
              collecting new favorites, or planning your weekly meals, FlavorVault makes it simple and enjoyable.
            </p>
            {/* Decorative element */}
            <div className="mt-4 flex gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
              <div className="w-2 h-2 bg-pink-500 rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
            </div>
          </div>
          <div className="overflow-hidden rounded-2xl shadow-2xl border-4 border-white transform hover:scale-105 hover:rotate-1 transition-all duration-500">
            <img
              src={Food1}
              alt="Delicious food"
              className="w-full h-full object-cover transform transition-transform duration-700 hover:scale-110"
            />
          </div>
        </div>

        {/* Features */}
        <div className="mb-8 md:mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6 md:mb-8 text-center">Features</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className={`${feature.bgColor} ${feature.borderColor} border-2 rounded-lg shadow-md p-5 md:p-6 hover:shadow-xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 animate-[fadeInUp_0.6s_ease-out]`} 
                style={{animationDelay: `${index * 0.1}s`}}
              >
                <div className={`text-3xl md:text-4xl mb-3 bg-gradient-to-br ${feature.gradient} bg-clip-text text-transparent font-bold inline-block transform hover:scale-110 transition-transform`}>
                  {feature.icon}
                </div>
                <h3 className="text-lg md:text-xl font-semibold text-gray-800 mb-2">{feature.title}</h3>
                <p className="text-sm md:text-base text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* How It Works with Image */}
        <div className="mb-8 md:mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            {/* Steps Section with Heading */}
            <div className="bg-white rounded-lg shadow-md p-6 md:p-8">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">How It Works</h2>
              <div className="space-y-6">
                <div className="flex items-start transform transition-transform duration-300 hover:translate-x-2">
                  <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold mr-4 flex-shrink-0 shadow-lg">
                    1
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-1">Add Your Recipes</h3>
                    <p className="text-gray-600">
                      Use our simple form to add recipes with ingredients, instructions, photos, and more
                    </p>
                  </div>
                </div>
                <div className="flex items-start transform transition-transform duration-300 hover:translate-x-2">
                  <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold mr-4 flex-shrink-0 shadow-lg">
                    2
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-1">Organize & Filter</h3>
                    <p className="text-gray-600">
                      Categorize recipes and use our powerful filters to find exactly what you're looking for
                    </p>
                  </div>
                </div>
                <div className="flex items-start transform transition-transform duration-300 hover:translate-x-2">
                  <div className="bg-gradient-to-r from-pink-500 to-orange-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold mr-4 flex-shrink-0 shadow-lg">
                    3
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-1">Save Favorites</h3>
                    <p className="text-gray-600">
                      Mark your favorite recipes with a heart to quickly access them later
                    </p>
                  </div>
                </div>
                <div className="flex items-start transform transition-transform duration-300 hover:translate-x-2">
                  <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold mr-4 flex-shrink-0 shadow-lg">
                    4
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-1">Cook & Enjoy!</h3>
                    <p className="text-gray-600">
                      Follow step-by-step instructions and create delicious meals with ease
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Image Section - Below steps on mobile, next to steps on desktop */}
            <div className="overflow-hidden rounded-2xl shadow-2xl max-h-[500px] group">
              <img
                src={Vegetables1}
                alt="Fresh vegetables"
                className="w-full h-full object-cover object-center transform transition-all duration-700 group-hover:scale-110 group-hover:rotate-1 animate-[subtle-zoom_8s_ease-in-out_infinite]"
              />
            </div>
          </div>
        </div>

        {/* Data Privacy */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-5 md:p-6 mb-8 md:mb-12">
          <div className="flex items-start">
            <span className="text-2xl md:text-3xl mr-3 md:mr-4 flex-shrink-0">🔒</span>
            <div>
              <h3 className="text-lg md:text-xl font-semibold text-gray-800 mb-2">Your Data is Private</h3>
              <p className="text-sm md:text-base text-gray-600">
                All your recipes are stored locally in your browser's localStorage. We don't collect,
                store, or share any of your data. Your recipes are yours alone!
              </p>
            </div>
          </div>
        </div>

        {/* Developer Tools */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-5 md:p-6 mb-8 md:mb-12">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-start">
              <span className="text-2xl md:text-3xl mr-3 md:mr-4 flex-shrink-0">🔧</span>
              <div>
                <h3 className="text-lg md:text-xl font-semibold text-gray-800 mb-2">Reset Sample Data</h3>
                <p className="text-sm md:text-base text-gray-600">
                  Want to start fresh? Reset your collection to the default 24 sample recipes.
                  This will clear all your custom recipes and favorites.
                </p>
              </div>
            </div>
            <button
              onClick={resetToSampleData}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transform hover:scale-105 transition-all duration-300 shadow-lg whitespace-nowrap"
            >
              Reset to Sample Data
            </button>
          </div>
        </div>

        {/* CTA */}
        <div className="relative text-center rounded-lg overflow-hidden p-8 md:p-12">
          {/* Background Image */}
          <div className="absolute inset-0 z-0">
            <img
              src={Ingredient2}
              alt="Cooking ingredients"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 via-purple-900/85 to-indigo-900/90"></div>
          </div>
          
          {/* Content */}
          <div className="relative z-10">
            <h2 className="text-2xl md:text-3xl font-bold mb-3 md:mb-4 text-white drop-shadow-lg">Ready to Get Started?</h2>
            <p className="text-base md:text-xl mb-6 px-4 text-white/95 drop-shadow-md">
              Begin building your personal recipe collection today
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-3 md:gap-4">
              <Link
                to="/add"
                className="bg-white text-blue-600 px-6 md:px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                Add Your First Recipe
              </Link>
              <Link
                to="/recipes"
                className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 md:px-8 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 transform hover:scale-105 shadow-lg border-2 border-white/30"
              >
                Browse Recipes
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Keyframe Animations */}
      <style>{`
        @keyframes subtle-zoom {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
        }
      `}</style>
    </div>
  );
};

export default About;
