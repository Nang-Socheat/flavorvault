import { Link } from 'react-router-dom';
import FooterBg from '../assets/Footer.webp';
import FlavorVaultLogo from '../assets/FlavorvaultLogo.png';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative text-white overflow-hidden">
      {/* Blurred Background Image */}
      <div className="absolute inset-0">
        <img
          src={FooterBg}
          alt="Footer background"
          className="w-full h-full object-cover blur-sm scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-gray-900/85 via-gray-900/80 to-gray-900/85"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-[1920px] mx-auto px-2 sm:px-3 md:px-4 lg:px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-6">
          {/* About Section */}
          <div>
            <div className="flex items-center gap-3 mb-3">
              <img
                src={FlavorVaultLogo}
                alt="FlavorVault Logo"
                className="w-12 h-12 drop-shadow-lg"
              />
              <h3 className="text-xl font-bold drop-shadow-lg">FlavorVault</h3>
            </div>
            <p className="text-gray-200 text-sm drop-shadow-md">
              Your personal recipe collection, beautifully organized. Store, discover, and share your favorite recipes.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-bold mb-3 drop-shadow-lg">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="text-gray-200 hover:text-white transition-colors drop-shadow-md">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/recipes" className="text-gray-200 hover:text-white transition-colors drop-shadow-md">
                  Browse Recipes
                </Link>
              </li>
              <li>
                <Link to="/add" className="text-gray-200 hover:text-white transition-colors drop-shadow-md">
                  Add Recipe
                </Link>
              </li>
              <li>
                <Link to="/favorites" className="text-gray-200 hover:text-white transition-colors drop-shadow-md">
                  Favorites
                </Link>
              </li>
              <li>
                <Link to="/meal-planner" className="text-gray-200 hover:text-white transition-colors drop-shadow-md">
                  Meal Planner
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-200 hover:text-white transition-colors drop-shadow-md">
                  About
                </Link>
              </li>
            </ul>
          </div>

          {/* Info */}
          <div>
            <h3 className="text-xl font-bold mb-3 drop-shadow-lg">Information</h3>
            <ul className="space-y-2 text-sm text-gray-200 drop-shadow-md">
              <li>🔒 All data stored locally</li>
              <li>💾 Your privacy is protected</li>
              <li>🆓 Free to use</li>
              <li>📱 Mobile friendly</li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-600/50 pt-6 text-center">
          {/* <div className="flex flex-col items-center gap-3 mb-3">
            <img 
              src={FlavorVaultLogo} 
              alt="FlavorVault Logo" 
              className="w-16 h-16 drop-shadow-xl"
            />
          </div> */}
          <p className="text-sm text-gray-300 drop-shadow-md">
            &copy; {currentYear} FlavorVault. Built for Front-End Web Development Class.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
