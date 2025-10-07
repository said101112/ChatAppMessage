import {getAmis, getUserProfil, SignUp} from "../controller/auth.js";
import {Signin ,logout,AddAmis,getAllmsgs,SendMessage}from "../controller/auth.js";
import { protect } from "../middleware/verifyToken.js";
import { getAllUsers } from "../controller/auth.js";
import user from "../models/user.js";

import express from 'express';

const router =express.Router();

router.post('/signup',SignUp);
router.post('/addAmis',AddAmis);
router.get('/getAmis/:userId',getAmis);
router.post('/signin',Signin);
router.post('/logout',logout);
router.post('/sendMessage/:receverId', protect, SendMessage);
router.get('/getAllmsgs/:selectuserId', protect, getAllmsgs);
router.get('/getAllusers',getAllUsers);
router.get('/user/:id',protect,getUserProfil);
router.get('/verify/:token', async (req, res) => {
  const token = req.params.token;

  const User = await user.findOne({ verifyToken: token });
  if (!User) return res.status(400).send('Token invalide ou expiré');

  User.isVerified = true;
  User.verifyToken = undefined;
  await User.save();

  res.send('Email vérifié avec succès ! Vous pouvez maintenant vous connecter.');
});
router.post('/updateLastLogin', async (req, res) => {
  const { userId } = req.body;
  try {
    const User = await user.findByIdAndUpdate(
      userId,
      { lastSeen: new Date() }, 
      { new: true }
    );
    res.status(200).json({ message: 'Dernière connexion mise à jour', User });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err });
  }
});

export default router;

