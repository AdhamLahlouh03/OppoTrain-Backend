// src/scripts/createAdmin.js
require('dotenv').config();
const { auth, db } = require('../config/firebase-admin'); // ← Admin SDK (مهم)
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, (answer) => resolve(answer.trim()));
  });
}


async function createAdminUser() {
  try {
    console.log('🚀 OppoTrain Backend - Admin Only\n');
    console.log('Creating new admin user for the system\n');
    
    const email = await question('Enter admin email: ');
    const password = await question('Enter admin password (minimum 8 characters): ');
    const displayName = await question('Enter admin name: ');
    const phoneNumber = await question('Enter admin phone number (optional, press Enter to skip): ');

    if (!email || !password || !displayName) {
      console.log('❌ All required fields must be provided!');
      return;
    }
    if (password.length < 8) {
      console.log('❌ Password must be at least 8 characters long!');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      console.log('❌ Please enter a valid email address!');
      return;
    }

    try {
      const existing = await auth.getUserByEmail(email);
      if (existing) {
        console.log('❌ User already exists!');
        return;
      }
    } catch (_) {
    }

    const userRecord = await auth.createUser({
      email,
      password,
      displayName,
      phoneNumber: phoneNumber || undefined,
      emailVerified: true
    });

    await auth.setCustomUserClaims(userRecord.uid, {
      role: 'admin',
      createdBy: 'script',
      createdAt: new Date().toISOString()
    });

    const adminData = {
      email: userRecord.email,
      displayName,
      phoneNumber: phoneNumber || null,
      role: 'admin',
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      lastSignInTime: null,
      createdBy: 'script'
    };

    await db.collection('admins').doc(userRecord.uid).set(adminData); // ← هنا التغيير

    console.log('\n✅ Admin created successfully!');
    console.log(`📧 Email: ${email}`);
    console.log(`👤 Name: ${displayName}`);
    console.log(`🆔 User ID: ${userRecord.uid}`);
    console.log(`🔑 Role: Admin`);
    console.log('\n💡 You can now login using these credentials.');
  } catch (error) {
    console.error('❌ Error creating admin:', error.message);
    if (error.code === 'auth/email-already-exists') {
      console.log('💡 Email already exists.');
    } else if (error.code === 'auth/invalid-email') {
      console.log('💡 Invalid email address.');
    } else if (error.code === 'auth/weak-password') {
      console.log('💡 Password is too weak.');
    }
  } finally {
    rl.close();
  }
}

if (require.main === module) {
  createAdminUser();
}

module.exports = { createAdminUser };
