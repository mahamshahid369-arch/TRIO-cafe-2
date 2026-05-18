// This script runs automatically when the MongoDB container starts for the first time.
// It creates the triocafe database and seeds it with initial collections.

db = db.getSiblingDB('triocafe');

// Create a products collection with sample data
db.products.insertMany([
  { name: "Espresso", category: "coffee", price: 250, description: "Strong Italian coffee", available: true },
  { name: "Latte", category: "coffee", price: 350, description: "Espresso with steamed milk", available: true },
  { name: "Cappuccino", category: "coffee", price: 320, description: "Classic Italian coffee", available: true },
  { name: "Red Rose Bouquet", category: "flower", price: 1200, description: "Fresh red roses", available: true },
  { name: "Sunflower Bunch", category: "flower", price: 800, description: "Bright sunflowers", available: true },
  { name: "The Alchemist", category: "book", price: 950, description: "By Paulo Coelho", available: true },
  { name: "Atomic Habits", category: "book", price: 1100, description: "By James Clear", available: true }
]);

// Create an orders collection (empty to start)
db.createCollection('orders');

// Create a users collection (empty to start)
db.createCollection('users');

print("✅ Trio Cafe database seeded successfully!");
