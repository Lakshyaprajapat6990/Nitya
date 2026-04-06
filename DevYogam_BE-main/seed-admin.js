const mongoose = require('mongoose');
require('dotenv').config();
const User = require('./models/User');

const seedAdmin = async () => {
  try {
await mongoose.connect('mongodb+srv://devyogam_user:EljeAI40nT55iGnY@cluster0.eyleqqb.mongodb.net/devyogam');
    
    const adminExists = await User.findOne({ email: 'admin@example.com' });
    if (adminExists) {
      console.log('✅ Admin already exists:', adminExists.email);
      process.exit(0);
    }

const admin = new User({
      phone: '+919876543210',
      email: 'admin@example.com',
      password: 'Aadmin123', // Will be hashed by model if pre-save hook exists
      role: 'admin',
      isVerified: true
    });

    await admin.save();
    console.log('✅ Admin created successfully!');
    console.log('Email: admin@example.com');
    console.log('Password: Aadmin123@');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seed error:', error.message);
    process.exit(1);
  }
};

seedAdmin();

