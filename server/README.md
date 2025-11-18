# FlavorVault Backend API

Complete backend API for the FlavorVault Recipe Book application with advanced features including AI integration, user management, recipe management, meal planning, shopping lists, orders, and more.

## Features

### 1. User Management
- **User Types**: Individual, Shop, Restaurant
- **Authentication**: JWT-based authentication
- **User Profiles**: Bio, avatar, skills, social media links
- **Dietary Preferences**: Vegan, vegetarian, halal, gluten-free, etc.
- **Allergy Tracking**: Track and alert for allergens
- **Measurement Preferences**: Metric/Imperial units
- **Theme Customization**: Custom colors and backgrounds

### 2. Recipe Management
- **CRUD Operations**: Create, Read, Update, Delete recipes
- **Smart Categorization**:
  - Categories: Breakfast, Lunch, Dinner, Snacks, etc.
  - Sub-categories: Meat, Vegan, Vegetarian, Seafood, etc.
  - Occasions: Khmer New Year, Pchum Ben, Water Festival, etc.
- **Rich Recipe Data**:
  - Ingredients with quantities and units
  - Step-by-step instructions
  - Nutrition information
  - Cooking times and difficulty levels
  - Images and videos
  - Origin and cuisine type
- **Privacy Controls**: Public/Private recipes
- **Expert Approval System**: Recipes require approval before publishing
- **Trending Recipes**: Most liked and viewed recipes
- **Random Recipe Generator**: Surprise recipe feature
- **PDF Export**: Single recipe and recipe book PDFs

### 3. AI Features
- **Ingredient Pairing Suggestions**: AI-powered ingredient recommendations
- **Recipe Suggestions**: Based on available ingredients, preferences, and mood
- **AI Chef**: Create unique, original recipes
- **Recipe Scanner**: Convert receipts/handwritten notes to structured recipes
- **Food Image Recognition**: Identify food and find similar recipes
- **Toxic Ingredient Detection**: Check for harmful ingredient combinations
- **Allergen Detection**: Automatic allergen alerts based on user allergies

### 4. Review & Rating System
- **Star Ratings**: 1-5 star rating system
- **Written Reviews**: Detailed recipe reviews
- **Review Images**: Upload photos of cooked dishes
- **Helpful Votes**: Mark reviews as helpful
- **Author Response**: Recipe authors can respond to reviews
- **Verified Purchases**: Mark reviews from actual customers

### 5. Collections & Favorites
- **Favorites**: Save favorite recipes
- **Custom Collections**: Create recipe playlists
- **Public/Private Collections**: Share or keep private
- **Collection Following**: Follow other users' collections

### 6. Meal Planning
- **Meal Calendar**: Plan meals for days/weeks
- **Meal Types**: Breakfast, lunch, dinner, snacks
- **Google Calendar Integration**: Sync with Google Calendar
- **Nutrition Tracking**: Track total nutrition per day
- **Meal Completion**: Mark meals as completed

### 7. Shopping Lists
- **From Recipes**: Generate shopping lists from recipes
- **Auto-Consolidation**: Automatically sum identical ingredients
- **Custom Items**: Add custom items to list
- **Checkable Items**: Check off items as you shop
- **PDF Export**: Print shopping lists

### 8. Community Forums
- **Discussion Topics**: General, techniques, ingredients, equipment, etc.
- **Related Recipes**: Link discussions to specific recipes
- **Real-time Replies**: Socket.io powered real-time discussions
- **Likes & Voting**: Like posts and replies
- **Pinned Posts**: Pin important discussions
- **Search & Filter**: Find relevant discussions

### 9. Shop/Restaurant Features
- **Menu Builder**: Create custom menus
- **Menu Customization**: Custom cover page, colors, logo
- **Item Availability**: Set availability by day/time
- **Pricing**: Set prices for menu items
- **Menu PDF Export**: Generate printable menus
- **Order Management**: Receive and manage orders
- **Business Info**: Store hours, location, delivery options

### 10. Order System
- **Food Orders**: Order food from restaurants
- **Ingredient Orders**: Order ingredients in sets
- **Customization**: Customize orders, exclude ingredients
- **Special Instructions**: Add notes for the chef
- **Live Price Calculator**: Real-time price updates
- **Order Tracking**: Track order status in real-time
- **Order History**: View past orders
- **Payment Integration**: Support for multiple payment methods

### 11. Admin Dashboard
- **Recipe Approval**: Review and approve/reject recipes
- **User Management**: Manage users, roles, and permissions
- **Featured Recipes**: Feature recipes on homepage
- **Statistics Dashboard**: View platform statistics
- **Content Moderation**: Moderate user content

## Technology Stack

- **Runtime**: Node.js with ES Modules
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcryptjs
- **File Upload**: Multer + Cloudinary
- **PDF Generation**: Puppeteer
- **AI Integration**: OpenAI API (GPT-4)
- **Real-time**: Socket.io
- **Email**: Nodemailer
- **Payments**: Stripe
- **Security**: Helmet, Rate Limiting
- **Validation**: express-validator

## Installation

### Prerequisites
- Node.js 18+ and npm
- MongoDB 6+
- OpenAI API key (for AI features)
- Cloudinary account (for image uploads)
- Stripe account (for payments)

### Setup

1. Install dependencies:
```bash
cd server
npm install
```

2. Create `.env` file:
```bash
cp .env.example .env
```

3. Update `.env` with your credentials:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/flavorvault
JWT_SECRET=your_secret_key
OPENAI_API_KEY=your_openai_key
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
# ... other configuration
```

4. Seed the database (optional):
```bash
npm run seed
```

5. Start the server:
```bash
# Development
npm run dev

# Production
npm start
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/update-password` - Update password

### Users
- `GET /api/users/profile/:id` - Get user profile
- `PUT /api/users/profile` - Update profile
- `PUT /api/users/shop-info` - Update shop info
- `POST /api/users/favorites/:recipeId` - Add to favorites
- `DELETE /api/users/favorites/:recipeId` - Remove from favorites
- `GET /api/users/favorites` - Get favorites

### Recipes
- `GET /api/recipes` - Get all recipes (with filters)
- `GET /api/recipes/:id` - Get single recipe
- `POST /api/recipes` - Create recipe
- `PUT /api/recipes/:id` - Update recipe
- `DELETE /api/recipes/:id` - Delete recipe
- `GET /api/recipes/trending` - Get trending recipes
- `GET /api/recipes/random` - Get random recipe
- `GET /api/recipes/new-feed` - Get new recipes
- `GET /api/recipes/:id/pdf` - Generate recipe PDF
- `POST /api/recipes/recipe-book/pdf` - Generate recipe book PDF

### Reviews
- `GET /api/reviews/recipe/:recipeId` - Get recipe reviews
- `POST /api/reviews` - Create review
- `PUT /api/reviews/:id` - Update review
- `DELETE /api/reviews/:id` - Delete review
- `POST /api/reviews/:id/helpful` - Mark as helpful
- `POST /api/reviews/:id/response` - Respond to review

### Collections
- `GET /api/collections` - Get user collections
- `GET /api/collections/:id` - Get collection
- `POST /api/collections` - Create collection
- `PUT /api/collections/:id` - Update collection
- `DELETE /api/collections/:id` - Delete collection
- `POST /api/collections/:id/recipes/:recipeId` - Add recipe
- `DELETE /api/collections/:id/recipes/:recipeId` - Remove recipe

### Meal Plans
- `GET /api/meal-plans` - Get meal plans
- `GET /api/meal-plans/:id` - Get meal plan
- `POST /api/meal-plans` - Create meal plan
- `PUT /api/meal-plans/:id` - Update meal plan
- `DELETE /api/meal-plans/:id` - Delete meal plan
- `POST /api/meal-plans/:id/meals` - Add meal
- `DELETE /api/meal-plans/:id/meals/:mealId` - Remove meal

### Shopping Lists
- `GET /api/shopping-lists` - Get shopping lists
- `GET /api/shopping-lists/:id` - Get shopping list
- `POST /api/shopping-lists` - Create shopping list
- `POST /api/shopping-lists/:id/from-recipes` - Generate from recipes
- `POST /api/shopping-lists/:id/custom-items` - Add custom item
- `PATCH /api/shopping-lists/:id/items/:itemId/check` - Toggle item
- `DELETE /api/shopping-lists/:id` - Delete shopping list

### Forums
- `GET /api/forums` - Get forum posts
- `GET /api/forums/:id` - Get forum post
- `POST /api/forums` - Create post
- `POST /api/forums/:id/replies` - Add reply
- `POST /api/forums/:id/like` - Like post
- `POST /api/forums/:forumId/replies/:replyId/like` - Like reply

### Orders
- `GET /api/orders` - Get orders
- `GET /api/orders/:id` - Get order
- `POST /api/orders` - Create order
- `PUT /api/orders/:id/status` - Update status
- `PUT /api/orders/:id/cancel` - Cancel order
- `POST /api/orders/calculate-price` - Calculate price

### Menus
- `GET /api/menus/shop/:shopId` - Get shop menus
- `GET /api/menus/my` - Get my menus
- `GET /api/menus/:id` - Get menu
- `POST /api/menus` - Create menu
- `PUT /api/menus/:id` - Update menu
- `DELETE /api/menus/:id` - Delete menu
- `POST /api/menus/:id/publish` - Publish menu
- `GET /api/menus/:id/pdf` - Generate menu PDF

### AI
- `POST /api/ai/suggest-ingredients` - Get ingredient suggestions
- `POST /api/ai/suggest-recipes` - Get recipe suggestions
- `POST /api/ai/create-recipe` - AI chef create recipe
- `POST /api/ai/scan-receipt` - Scan receipt to recipe
- `POST /api/ai/recognize-food` - Recognize food from image
- `POST /api/ai/check-toxic-ingredients` - Check toxic combinations
- `POST /api/ai/detect-allergens` - Detect allergens

### Admin
- `GET /api/admin/pending-recipes` - Get pending recipes
- `PUT /api/admin/recipes/:id/approve` - Approve recipe
- `PUT /api/admin/recipes/:id/reject` - Reject recipe
- `POST /api/admin/recipes/:id/feature` - Feature recipe
- `GET /api/admin/users` - Get all users
- `PUT /api/admin/users/:id/role` - Update user role
- `PUT /api/admin/users/:id/status` - Update user status
- `GET /api/admin/stats` - Get dashboard stats

## Database Models

### User
- Email, password, name
- User type (individual, shop, restaurant)
- Profile: bio, avatar, skills, experience
- Social media links
- Allergies and dietary preferences
- Measurement preferences
- Theme preferences
- Shop/restaurant info
- Role (user, expert, admin)

### Recipe
- Title, description, images, videos
- Author reference
- Ingredients with quantities
- Step-by-step instructions
- Nutrition information
- Categorization (category, sub-category, occasion)
- Origin and cuisine type
- Difficulty and timing
- Privacy and approval status
- Engagement metrics

### Review
- Recipe and user references
- Rating (1-5 stars)
- Title and comment
- Images
- Modifications made
- Helpful votes
- Author response

### Collection
- User reference
- Name, description, cover image
- Recipe references
- Public/private status

### MealPlan
- User reference
- Date range
- Meals with recipes
- Google Calendar integration

### ShoppingList
- User reference
- Recipe items
- Custom items
- Consolidated items

### Forum
- Title, content, author
- Category, tags
- Related recipe
- Replies with likes

### Order
- Customer and shop references
- Order type (food/ingredients)
- Items with customizations
- Pricing and delivery
- Status tracking

### Menu
- Shop reference
- Menu sections with items
- Cover page design
- Availability settings

## Security Features

- JWT authentication
- Password hashing with bcrypt
- Rate limiting
- Helmet.js security headers
- Input validation
- Role-based access control
- CORS configuration

## Real-time Features

- Order status updates (Socket.io)
- Forum discussions (Socket.io)
- Live notifications

## Development

### Running Tests
```bash
npm test
```

### Database Seeding
```bash
npm run seed
```

### Environment Variables
See `.env.example` for all required variables.

## Deployment

1. Set NODE_ENV to 'production'
2. Configure production MongoDB URI
3. Set up proper CORS origins
4. Configure production API keys
5. Use process manager (PM2, Docker)

## Default Login Credentials (After Seeding)

- **Admin**: admin@flavorvault.com / admin123
- **Chef**: chef@flavorvault.com / chef123
- **Restaurant**: restaurant@flavorvault.com / restaurant123
- **User**: user@flavorvault.com / user123

## License

MIT
