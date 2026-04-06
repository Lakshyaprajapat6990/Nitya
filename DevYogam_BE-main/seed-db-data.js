const mongoose = require('mongoose');

async function seedData() {
  try {
await mongoose.connect('mongodb+srv://devyogam_user:EljeAI40nT55iGnY@cluster0.eyleqqb.mongodb.net/?retryWrites=true&w=majority');
    
    const User = require('./models/User');
    
    // Create admin (plain password since no bcrypt)
    const adminExists = await User.findOne({ email: 'admin@example.com' });
    if (!adminExists) {
      const admin = new User({
        phone: '+919876543210',
        email: 'admin@example.com',
        password: 'admin123', // Plain text for current auth
        role: 'admin',
        isVerified: true
      });
      await admin.save();
      console.log('✅ Admin created');
    }

    console.log('✅ Seed complete - Login: admin@example.com/admin123');
    mongoose.connection.close();
  } catch (error) {
    console.error('Seed error:', error.message);
  }
}

seedData();

