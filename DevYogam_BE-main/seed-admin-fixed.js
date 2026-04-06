const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
mongoose.set('strictQuery', false);

async function seedAdmin() {
  try {
    await mongoose.connect('mongodb+srv://devyogam_user:EljeAI40nT55iGnY@cluster0.eyleqqb.mongodb.net/devyogam');
    const User = require('./models/User');
    
    const adminExists = await User.findOne({ email: 'admin@example.com' });
    if (adminExists) {
      console.log('✅ Admin already exists');
      process.exit(0);
    }

    const hashedPassword = await bcrypt.hash('Aadmin123', 10);
    const admin = new User({
      phone: '+919876543210',
      email: 'admin@example.com',

      password: hashedPassword,
      role: 'admin',
      isVerified: true
    });

    await admin.save();
    console.log('✅ Admin created!');
    console.log('Login: admin@example.com / admin123');
    mongoose.connection.close();
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

seedAdmin();

