import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import logo from '../assets/FlavorvaultLogo.png';

const Navbar = () => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { path: '/', label: 'Home', icon: '🏠' },
    { path: '/recipes', label: 'Browse', icon: '📖' },
    { path: '/favorites', label: 'Favorites', icon: '❤️' },
    { path: '/add', label: 'Add Recipe', icon: '➕', isGreen: true },
    { path: '/meal-planner', label: 'Meal Planner', icon: '📅' },
    { path: '/about', label: 'About', icon: 'ℹ️' },
  ];

  const isActive = (path) => {
    return location.pathname === path;
  };

  const handleLinkClick = (path) => {
    setIsMobileMenuOpen(false);
    
    // If clicking on the current page, scroll to top
    if (location.pathname === path) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Close menu on escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') setIsMobileMenuOpen(false);
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  return (
    <>
      <nav className="bg-white shadow-lg sticky top-0 z-50">
        <div className="max-w-[1920px] mx-auto px-2 sm:px-3 md:px-4 lg:px-6">
          <div className="flex justify-between items-center h-14 sm:h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-1.5 sm:space-x-2" onClick={() => handleLinkClick('/')}>
              <img src={logo} alt="FlavorVault Logo" className="h-10 w-10 sm:h-12 sm:w-12 object-contain" />
              <span className="text-base sm:text-lg md:text-xl font-bold text-gray-800 truncate">FlavorVault</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex space-x-1">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => handleLinkClick(link.path)}
                  className={`px-3 xl:px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                    isActive(link.path)
                      ? 'bg-blue-500 text-white shadow-md'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-gray-700 hover:bg-gray-100 transition-all duration-200 active:scale-95"
              aria-label="Toggle menu"
              aria-expanded={isMobileMenuOpen}
            >
              <svg
                className="w-6 h-6 transition-transform duration-300"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
                style={{ transform: isMobileMenuOpen ? 'rotate(90deg)' : 'rotate(0deg)' }}
              >
                {isMobileMenuOpen ? (
                  <path d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => handleLinkClick(location.pathname)}
          aria-hidden="true"
        />
      )}

      {/* Mobile Navigation Dropdown */}
      <div
        className={`fixed top-14 sm:top-16 left-0 right-0 z-50 lg:hidden transform transition-all duration-300 ease-out ${
          isMobileMenuOpen 
            ? 'translate-y-0 opacity-100' 
            : '-translate-y-full opacity-0 pointer-events-none'
        }`}
      >
        <div className="max-w-[1920px] mx-auto px-2 sm:px-3 md:px-4">
          <div className="bg-white rounded-b-2xl shadow-2xl overflow-hidden border-t border-gray-100">
            <div className="py-2 max-h-[calc(100vh-8rem)] overflow-y-auto">
              {navLinks.map((link, index) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => handleLinkClick(link.path)}
                  className={`flex items-center space-x-3 px-4 py-3.5 font-medium transition-all duration-200 border-l-4 ${
                    isActive(link.path)
                      ? 'bg-gradient-to-r from-blue-50 to-blue-100 border-blue-500 text-blue-700 shadow-sm'
                      : 'border-transparent text-gray-700 hover:bg-gray-50 hover:border-gray-300'
                  }`}
                  style={{
                    animationDelay: `${index * 50}ms`,
                    animation: isMobileMenuOpen ? 'slideInRight 0.3s ease-out forwards' : 'none',
                  }}
                >
                  <span className={`text-xl ${link.isGreen ? 'text-green-500' : ''}`}>{link.icon}</span>
                  <span className="text-base">{link.label}</span>
                  {isActive(link.path) && (
                    <span className="ml-auto">
                      <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </span>
                  )}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </>
  );
};

export default Navbar;
