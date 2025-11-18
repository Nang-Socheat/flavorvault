import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Recipe from '../models/Recipe.js';

dotenv.config();

const sampleUsers = [
  {
    email: 'admin@flavorvault.com',
    password: 'admin123',
    name: 'Admin User',
    userType: 'individual',
    role: 'admin',
    isVerified: true
  },
  {
    email: 'chef@flavorvault.com',
    password: 'chef123',
    name: 'Chef Gordon',
    userType: 'individual',
    role: 'expert',
    bio: 'Professional chef with 20 years of experience',
    skills: ['French Cuisine', 'Pastry', 'Molecular Gastronomy'],
    isVerified: true
  },
  {
    email: 'restaurant@flavorvault.com',
    password: 'restaurant123',
    name: 'The Golden Spoon',
    userType: 'restaurant',
    role: 'user',
    shopInfo: {
      businessName: 'The Golden Spoon Restaurant',
      businessType: 'Fine Dining',
      address: {
        street: '123 Main Street',
        city: 'Phnom Penh',
        country: 'Cambodia'
      },
      phone: '+855 12 345 678',
      deliveryAvailable: true
    },
    isVerified: true
  },
  {
    email: 'user@flavorvault.com',
    password: 'user123',
    name: 'Sophia Lee',
    userType: 'individual',
    bio: 'Home cook who loves experimenting with Asian fusion recipes',
    allergies: ['peanuts'],
    dietaryPreferences: ['vegetarian'],
    isVerified: true
  }
];

const sampleRecipes = [
  {
    title: 'Classic Khmer Amok',
    description: 'Traditional Cambodian steamed curry with fish, coconut milk, and aromatic spices',
    prepTime: 30,
    cookTime: 25,
    servings: 4,
    difficulty: 'Medium',
    category: 'Dinner',
    subCategory: ['Seafood'],
    occasion: ['Khmer New Year', 'Family Reunion'],
    cuisineType: 'Khmer',
    origin: {
      country: 'Cambodia',
      region: 'Central Cambodia'
    },
    ingredients: [
      { name: 'Fish fillet', quantity: 500, unit: 'g' },
      { name: 'Coconut milk', quantity: 400, unit: 'ml' },
      { name: 'Kroeung (curry paste)', quantity: 3, unit: 'tbsp' },
      { name: 'Egg', quantity: 2, unit: 'pcs' },
      { name: 'Fish sauce', quantity: 2, unit: 'tbsp' },
      { name: 'Palm sugar', quantity: 1, unit: 'tsp' },
      { name: 'Kaffir lime leaves', quantity: 4, unit: 'leaves' }
    ],
    instructions: [
      { stepNumber: 1, description: 'Cut fish into bite-sized pieces and marinate with kroeung paste' },
      { stepNumber: 2, description: 'Mix coconut milk, eggs, fish sauce, and palm sugar in a bowl' },
      { stepNumber: 3, description: 'Combine fish with coconut mixture and pour into banana leaf cups' },
      { stepNumber: 4, description: 'Top with kaffir lime leaves and steam for 20-25 minutes' },
      { stepNumber: 5, description: 'Serve hot with steamed rice' }
    ],
    nutrition: {
      calories: 320,
      protein: 28,
      carbohydrates: 12,
      fat: 18
    },
    tags: ['Cambodian', 'Traditional', 'Coconut', 'Steamed'],
    isPublic: true,
    status: 'approved'
  },
  {
    title: 'Healthy Buddha Bowl',
    description: 'Nutritious bowl packed with quinoa, roasted vegetables, chickpeas, and tahini dressing',
    prepTime: 20,
    cookTime: 30,
    servings: 2,
    difficulty: 'Easy',
    category: 'Lunch',
    subCategory: ['Vegan', 'Healthy'],
    cuisineType: 'Fusion',
    ingredients: [
      { name: 'Quinoa', quantity: 1, unit: 'cup' },
      { name: 'Sweet potato', quantity: 1, unit: 'large' },
      { name: 'Chickpeas', quantity: 1, unit: 'can (400g)' },
      { name: 'Kale', quantity: 2, unit: 'cups' },
      { name: 'Avocado', quantity: 1, unit: 'pcs' },
      { name: 'Tahini', quantity: 3, unit: 'tbsp' },
      { name: 'Lemon juice', quantity: 2, unit: 'tbsp' }
    ],
    instructions: [
      { stepNumber: 1, description: 'Cook quinoa according to package instructions' },
      { stepNumber: 2, description: 'Roast cubed sweet potato at 200°C for 25 minutes' },
      { stepNumber: 3, description: 'Massage kale with olive oil and roast chickpeas until crispy' },
      { stepNumber: 4, description: 'Mix tahini with lemon juice and water to make dressing' },
      { stepNumber: 5, description: 'Assemble bowl with quinoa, vegetables, chickpeas, and avocado. Drizzle with dressing' }
    ],
    nutrition: {
      calories: 450,
      protein: 15,
      carbohydrates: 55,
      fat: 20
    },
    tags: ['Healthy', 'Vegan', 'Bowl', 'Nutritious'],
    isPublic: true,
    status: 'approved'
  },
  {
    title: 'Chocolate Lava Cake',
    description: 'Decadent individual chocolate cakes with a molten center',
    prepTime: 15,
    cookTime: 12,
    servings: 4,
    difficulty: 'Medium',
    category: 'Dessert',
    subCategory: ['Bakery'],
    cuisineType: 'French',
    ingredients: [
      { name: 'Dark chocolate', quantity: 200, unit: 'g' },
      { name: 'Butter', quantity: 100, unit: 'g' },
      { name: 'Eggs', quantity: 2, unit: 'pcs' },
      { name: 'Egg yolks', quantity: 2, unit: 'pcs' },
      { name: 'Sugar', quantity: 60, unit: 'g' },
      { name: 'Flour', quantity: 40, unit: 'g' },
      { name: 'Vanilla extract', quantity: 1, unit: 'tsp' }
    ],
    instructions: [
      { stepNumber: 1, description: 'Melt chocolate and butter together until smooth' },
      { stepNumber: 2, description: 'Whisk eggs, egg yolks, and sugar until pale and thick' },
      { stepNumber: 3, description: 'Fold chocolate mixture into egg mixture, then add flour' },
      { stepNumber: 4, description: 'Pour into greased ramekins and refrigerate for 30 minutes' },
      { stepNumber: 5, description: 'Bake at 200°C for 12 minutes until edges are set but center is soft' },
      { stepNumber: 6, description: 'Let rest for 1 minute, then invert onto plates and serve immediately' }
    ],
    nutrition: {
      calories: 380,
      protein: 8,
      carbohydrates: 35,
      fat: 24
    },
    tags: ['Chocolate', 'Dessert', 'French', 'Impressive'],
    allergens: ['dairy', 'eggs', 'wheat'],
    isPublic: true,
    status: 'approved'
  }
];

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB connected');

    // Clear existing data
    await User.deleteMany({});
    await Recipe.deleteMany({});
    console.log('Cleared existing data');

    // Create users
    const createdUsers = await User.create(sampleUsers);
    console.log(`Created ${createdUsers.length} users`);

    // Assign recipes to users
    sampleRecipes[0].author = createdUsers[1]._id; // Chef
    sampleRecipes[1].author = createdUsers[3]._id; // Regular user
    sampleRecipes[2].author = createdUsers[1]._id; // Chef

    // Create recipes
    const createdRecipes = await Recipe.create(sampleRecipes);
    console.log(`Created ${createdRecipes.length} recipes`);

    console.log('\n=== Seed Data Summary ===');
    console.log('\nUsers created:');
    createdUsers.forEach(user => {
      console.log(`- ${user.email} (${user.role}, ${user.userType})`);
    });

    console.log('\nRecipes created:');
    createdRecipes.forEach(recipe => {
      console.log(`- ${recipe.title} (${recipe.cuisineType})`);
    });

    console.log('\n=== Login Credentials ===');
    console.log('Admin: admin@flavorvault.com / admin123');
    console.log('Chef: chef@flavorvault.com / chef123');
    console.log('Restaurant: restaurant@flavorvault.com / restaurant123');
    console.log('User: user@flavorvault.com / user123');

    console.log('\nDatabase seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
