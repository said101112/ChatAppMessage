
import user from '../models/user.js'
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { io,onlineUser } from '../index.js';
import dotenv from 'dotenv';
dotenv.config();

export const SignUp = async (req,res)=>{
  try{
  const { username,email,password,phone } = req.body;
  const hashedpwd = await bcrypt.hash(password,10);
  if (!username || !email || !password) {
    return res.status(400).json({ message: 'Missing fields' });
  }

  if( await user.findOne({email}) ){
     return res.status(400).json({ error: 'Email déjà utilisé.' });
  }
  if( await user.findOne({username}) ){
     return res.status(400).json({ error: 'username déjà utilisé.' });
  }
  const newuser = new user({
    username,
    password: hashedpwd,
    email,
    phone,
   
  })
   await newuser.save();


res.status(201).json({ msg : 'Created Seccesfully'});
}catch(err){
   res.status(400).json({ error: err.message });
}
  
}



export const Signin = async(req,res)=>{

    
   try {
    const { email, password } = req.body;

  
    const existingUser = await user.findOne({ email });
    if (!existingUser) {
      return res.status(400).json({ msg: "Email n'existe pas." });
    }

   
    const validPassword = await bcrypt.compare(password, existingUser.password);
        if (!validPassword) {
      return res.status(400).json({ msg: "Mot de passe incorrect." });
         }
 
    const token = jwt.sign({ id: existingUser._id }, process.env.JWT_SECRET , { expiresIn: "7m" });
   res.cookie('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 jours
    });
    
    return res.status(200).json({ msg: "Connexion réussie", role: existingUser.role,id:existingUser._id });
    }catch (err) {
    res.status(500).json({ error: err.message });
  }                
    
}

export const logout= async(req,res)=>{
  try{
  res.clearCookie('auth_token', {
      httpOnly: true,
      sameSite: 'strict',
      secure: false 
    });
    res.status(200).json({ msg: "Déconnexion réussie !" });
  }catch (err) {
    res.status(500).json({ error: err.message });
  }   
  
}



export const getAdminProfil= async(req,res)=>{
      try{
    const {id}=req.params;

    const admin= await user.findOne({id});

    if(!admin){
      return res.status(404).json({msg:'Utilisateur non trouvé'});
    }
    res.status(200).json(admin);


    res.status(200).json({ msg: "Déconnexion réussie !" });
  }catch (err) {
    res.status(500).json({ error: err.message });
  }

}


export const getAllUsers= async(req,res)=>{
      try{
    const users=await user.find({role:'user'});

   if(users.length === 0){
    return res.status(400).json({msg: "no data found"});
   }
    res.status(200).json(users);
  }catch (err) {
    res.status(500).json({ error: err.message });
  }

}
// adapte le chemin si besoin

import message from '../models/message.js'

export const AddAmis = async (req, res) => {
  const { input, currentUserId } = req.body;

  if (!input || !currentUserId) {
    return res.status(400).json({ msg: 'Champs requis' });
  }

  try {
    // Vérifie si l'input est un email
    const isEmail = /\S+@\S+\.\S+/.test(input);

    // Trouver l'utilisateur à ajouter
    const amis = await user.findOne(
      isEmail ? { email: input } : { username: input }
    );

    if (!amis) {
      return res.status(404).json({ msg: "Utilisateur non trouvé" });
    }

    // Empêche l'utilisateur de s'ajouter lui-même
    if (amis._id.toString() === currentUserId) {
      return res.status(400).json({ msg: "Tu ne peux pas t'ajouter toi-même" });
    }

    // Ajouter l'ami dans la liste de l'utilisateur connecté
    await user.findByIdAndUpdate(
      currentUserId,
      { $addToSet: { amis: amis._id } },
      { new: true }
    );

    res.status(200).json({ message: "Ami ajouté avec succès" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

export const getAmis = async (req, res) => {
  const { userId } = req.params;

  try {
    const utilisateur = await user.findById(userId).populate('amis', 'username email phone'); 

    if (!utilisateur) {
      return res.status(404).json({ msg: 'Utilisateur non trouvé' });
    }
    const unseenMessage={};
    const LastMessages={};
    const promises = utilisateur.amis.map(async(user)=>{
       const messages = await message.find({senderId:user._id,receverId:userId , Seen:false})
       if(messages.length > 0){
        unseenMessage[user._id]=messages.length;
       }

     const lastmessage=  await message.findOne({
      $or :[{    senderId:user._id,receverId:userId     },{
                 senderId:userId,receverId:user.Id      }]}).sort({ createdAt: -1 });
                 LastMessages[user._id]=lastmessage;

    });

     await Promise.all(promises);

     res.status(200).json({ amis: utilisateur.amis , unseenMessage ,LastMessages});

  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Erreur serveur' });
  }
}

export const getAllmsgs = async (req,res)=>{
   const {selectuserId}=req.params;
   const MyId=req.user._id;

  try{

    const messages = await message.find({
      $or :[{    senderId:MyId,receverId:selectuserId      },{
                 senderId:selectuserId,receverId:MyId      }]})

    await message.updateMany({
      senderId:selectuserId , receverId:MyId
      },{ Seen : true });
    
    res.json({msg:'get all msg',messages});


  }catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Erreur serveur' });
  }
}


export const SendMessage = async (req, res) => {
  const { receverId } = req.params;
  const senderId = req.user._id; // ou req.body.senderId si pas d'auth middleware
  const { text } = req.body;

  try {
    // ✅ Créer le message en base de données
    const newMsg = await message.create({ senderId, receverId, text, status: 'sent', timestamp: Date.now() });

    // ✅ Répondre à la requête REST
    res.status(200).json({
      msg: 'Message envoyé avec succès',
      message: newMsg,
    });

    // ✅ Émettre le message par Socket.IO
    const receiverSocketId = onlineUser[receverId];
    if (receiverSocketId) {
      io.to(receiverSocketId).emit('newMessage', newMsg);
      newMsg.status='delivered';
      await newMsg.save();
      console.log('📤 Message émis via socket à', receverId);
    } else {
      console.log('ℹ️ Destinataire hors ligne ou socket non trouvé');
    }
  } catch (error) {
    console.error('❌ Erreur SendMessage:', error);
    res.status(500).json({ msg: 'Erreur serveur lors de l’envoi du message' });
  }
};

