/**
 * Quick script to make a user admin
 * Run: node makeAdmin.js <email>
 * Example: node makeAdmin.js admin@smartgov.com
 */
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

const email = process.argv[2];

if (!email) {
  console.log('❌  Usage: node makeAdmin.js <email>');
  console.log('   Example: node makeAdmin.js alok@example.com');
  process.exit(1);
}

const run = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅  Connected to MongoDB');

    const user = await User.findOne({ email: email.toLowerCase().trim() });

    if (!user) {
      console.log(`❌  User with email "${email}" not found!`);
      process.exit(1);
    }

    if (user.role === 'admin') {
      console.log(`ℹ️   "${user.fullName}" is already an admin!`);
      process.exit(0);
    }

    user.role = 'admin';
    await user.save();

    console.log('='.repeat(50));
    console.log(`🎉  SUCCESS! Admin role granted!`);
    console.log(`👤  Name  : ${user.fullName}`);
    console.log(`📧  Email : ${user.email}`);
    console.log(`🔑  Role  : ${user.role}`);
    console.log('='.repeat(50));
    console.log('Now login at http://localhost:5173/login');
    console.log('Admin panel: http://localhost:5173/admin');

  } catch (err) {
    console.error('❌  Error:', err.message);
  } finally {
    await mongoose.connection.close();
  }
};

run();
