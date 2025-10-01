
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import User from './models/user.js'; 


async function createAdmin() {
  try {
    await mongoose.connect('mongodb://localhost:27017/ecom'); // adapte ici

    const hashedPassword = await bcrypt.hash('admin123', 10); // sécurise le mot de passe

    const admin = new User({
      fname: 'Admin',
      lname: 'User',
      adress: '1 rue Admin',
      codePostal: '75000',
      phone: '0123456789',
      email: 'admin@gmail.com',
      password: hashedPassword,
      role: 'admin'
    });

    await admin.save();
    console.log('✅ Utilisateur admin créé avec succès');
  } catch (err) {
    console.error('❌ Erreur lors de la création de l\'admin :', err.message);
  } finally {
    mongoose.disconnect();
  }
}

createAdmin()