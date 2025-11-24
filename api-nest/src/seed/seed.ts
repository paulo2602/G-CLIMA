import * as mongoose from 'mongoose';
import * as bcrypt from 'bcrypt';

async function seed() {
  try {
    // Connect directly to MongoDB
    const connection = await mongoose.connect('mongodb://localhost:27017/clima_db');
    console.log('Connected to MongoDB');

    // Get the users collection
    const usersCollection = connection.connection.collection('users');

    // Users to seed
    const usersToCreate = [
      {
        email: 'admin@example.com',
        password: '123456',
        name: 'Admin User',
      },
      {
        email: 'isaque123@gmail.com',
        password: 'isaque123',
        name: 'Isaque',
      },
    ];

    for (const userData of usersToCreate) {
      const existingUser = await usersCollection.findOne({ email: userData.email });
      
      if (existingUser) {
        console.log(`User ${userData.email} already exists. Skipping...`);
        continue;
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(userData.password, 10);

      // Create user
      const newUser = {
        email: userData.email,
        password: hashedPassword,
        name: userData.name,
        preferences: {
          locations: ['São Paulo'],
          units: 'metric',
          notifications: true,
        },
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const result = await usersCollection.insertOne(newUser);
      console.log(`User ${userData.email} created successfully with ID:`, result.insertedId);
    }

    await mongoose.disconnect();
    console.log('Seeding completed!');
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seed();
