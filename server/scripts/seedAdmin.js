const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const dns = require('dns'); // Import Node built-in DNS module
const User = require('../models/User');

// Force Node.js to use Google Public DNS to prevent querySrv ECONNREFUSED lookup errors
dns.setServers(['8.8.8.8', '8.8.4.4']);

// Load .env explicitly from the server root directory
dotenv.config({ path: path.join(__dirname, '../.env') });

const seedAdmin = async () => {
  try {
    const mongoUri =
      process.env.MONGODB_URI ||
      process.env.MONGO_URI ||
      process.env.DATABASE_URL;

    if (!mongoUri) {
      throw new Error(
        'MongoDB connection string is missing. Please ensure MONGODB_URI is set in server/.env'
      );
    }

    await mongoose.connect(mongoUri);
    console.log('MongoDB Connected...');

    const adminEmail = process.argv[2] || 'admin@example.com';
    const adminPassword = process.argv[3] || 'Admin@123456';
    const adminName = process.argv[4] || 'System Admin';

    let user = await User.findOne({ email: adminEmail });

    if (user) {
      user.role = 'admin';
      await user.save();
      console.log(`Existing user (${adminEmail}) successfully promoted to ADMIN.`);
    } else {
      user = await User.create({
        name: adminName,
        email: adminEmail,
        password: adminPassword,
        role: 'admin',
      });
      console.log(`New Admin created successfully: ${adminEmail}`);
    }

    process.exit(0);
  } catch (error) {
    console.error('Error seeding admin user:', error);
    process.exit(1);
  }
};

seedAdmin();