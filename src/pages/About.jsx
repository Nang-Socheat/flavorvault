import { Link } from 'react-router-dom';

const About = () => {
  const features = [
    {
      icon: '📚',
      title: 'Recipe Management',
      description: 'Easily add, edit, and organize your favorite recipes in one place',
    },
    {
      icon: '🔍',
      title: 'Smart Search',
      description: 'Find recipes quickly by name, ingredients, category, or tags',
    },
    {
      icon: '🔧',
      title: 'Advanced Filtering',
      description: 'Filter recipes by category, difficulty level, and preparation time',
    },
    {
      icon: '❤️',
      title: 'Favorites',
      description: 'Save your most-loved recipes for quick access anytime',
    },
    {
      icon: '📸',
      title: 'Photo Support',
      description: 'Add images to your recipes to make them more appealing',
    },
    {
      icon: '💾',
      title: 'Local Storage',
      description: 'All your data is saved locally in your browser for privacy and persistence',
    },
  ];

  const techStack = [
    { name: 'React', description: 'Component-based UI library' },
    { name: 'React Router', description: 'Client-side routing' },
    { name: 'React Context API', description: 'Global state management' },
    { name: 'Tailwind CSS', description: 'Utility-first CSS framework' },
    { name: 'Vite', description: 'Fast build tool and dev server' },
    { name: 'LocalStorage', description: 'Browser-based data persistence' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-800 mb-4">About FlavorVault</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Your personal digital cookbook for storing, organizing, and discovering delicious recipes
          </p>
        </div>

        {/* Mission Section */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-4 text-center">Our Mission</h2>
          <p className="text-gray-600 text-lg text-center max-w-3xl mx-auto">
            FlavorVault was created to help home cooks and food enthusiasts keep all their recipes
            organized in one beautiful, easy-to-use platform. Whether you're storing family recipes,
            collecting new favorites, or planning your weekly meals, FlavorVault makes it simple and enjoyable.
          </p>
        </div>

        {/* Features */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                <div className="text-4xl mb-3">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Tech Stack */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Built With</h2>
          <div className="bg-white rounded-lg shadow-md p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {techStack.map((tech, index) => (
                <div key={index} className="flex items-start">
                  <div className="bg-blue-100 text-blue-600 rounded-full p-2 mr-4">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">{tech.name}</h3>
                    <p className="text-sm text-gray-600">{tech.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* How It Works */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">How It Works</h2>
          <div className="bg-white rounded-lg shadow-md p-8">
            <div className="space-y-6">
              <div className="flex items-start">
                <div className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold mr-4 flex-shrink-0">
                  1
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-1">Add Your Recipes</h3>
                  <p className="text-gray-600">
                    Use our simple form to add recipes with ingredients, instructions, photos, and more
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold mr-4 flex-shrink-0">
                  2
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-1">Organize & Filter</h3>
                  <p className="text-gray-600">
                    Categorize recipes and use our powerful filters to find exactly what you're looking for
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold mr-4 flex-shrink-0">
                  3
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-1">Save Favorites</h3>
                  <p className="text-gray-600">
                    Mark your favorite recipes with a heart to quickly access them later
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold mr-4 flex-shrink-0">
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
        </div>

        {/* Data Privacy */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-12">
          <div className="flex items-start">
            <span className="text-3xl mr-4">🔒</span>
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Your Data is Private</h3>
              <p className="text-gray-600">
                All your recipes are stored locally in your browser's localStorage. We don't collect,
                store, or share any of your data. Your recipes are yours alone!
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg p-12">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-xl mb-6">
            Begin building your personal recipe collection today
          </p>
          <div className="flex justify-center space-x-4">
            <Link
              to="/add"
              className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Add Your First Recipe
            </Link>
            <Link
              to="/recipes"
              className="bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-800 transition-colors"
            >
              Browse Recipes
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
