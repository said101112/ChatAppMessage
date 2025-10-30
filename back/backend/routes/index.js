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

 res.send(`
      <html>
        <head>
          <meta http-equiv="refresh" content="1;url=http://localhost:4200/login" />
        </head>
        <body style="font-family: sans-serif; text-align:center; margin-top: 100px;">
          <h2>Email vérifié avec succès ✅</h2>
          <p>Redirection vers la page de connexion...</p>
        </body>
      </html>
    `);
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
router.post('/me/pubkey', protect, async (req, res) => {
  const { publicKey } = req.body; 
  if (!publicKey) return res.status(400).send({ msg: 'publicKey required' });
  await user.findByIdAndUpdate(req.user._id, { publicKey });
  res.send({ json:'okkkkkkkkkkkkkkkkkkk', ok: true });
});
router.get('/user/:id/pubkey',protect, async (req, res) => {
  const u = await user.findById(req.params.id).select('publicKey');
  if (!u) return res.status(404).send({ msg: 'no user' });
  res.send({ publicKey: u.publicKey });
});

export default router;

