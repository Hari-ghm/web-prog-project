const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs');

async function seed() {
  const uri = "mongodb://localhost:27017/renewable_energy";
  const client = new MongoClient(uri);
  
  await client.connect();
  const db = client.db("renewable_energy");
  
  // Clear existing
  await db.collection("users").deleteMany({});
  
  // Create admin
  await db.collection("users").insertOne({
    name: "Admin User",
    email: "admin@example.com",
    password: await bcrypt.hash("admin123", 10),
    role: "admin",
    createdAt: new Date()
  });
  
  // Create regular user
  await db.collection("users").insertOne({
    name: "Regular User", 
    email: "user@example.com",
    password: await bcrypt.hash("user123", 10),
    role: "user",
    createdAt: new Date()
  });
  
  console.log("✅ Users created!");
  console.log("Admin: admin@example.com / admin123");
  console.log("User: user@example.com / user123");
  await client.close();
}

seed();