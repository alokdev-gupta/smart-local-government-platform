require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

const run = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    const users = await User.find({}, 'fullName email role isActive createdAt');
    console.log('\n📋  All Users in Database:');
    console.log('='.repeat(60));
    users.forEach((u, i) => {
      console.log(`${i + 1}. 👤 ${u.fullName}`);
      console.log(`   📧 Email : ${u.email}`);
      console.log(`   🔑 Role  : ${u.role}`);
      console.log(`   ✅ Active: ${u.isActive}`);
      console.log('');
    });
    if (users.length === 0) console.log('No users found!');
  } catch (err) {
    console.error('Error:', err.message);
  } finally {
    await mongoose.connection.close();
  }
};
run();
