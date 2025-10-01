import {getAmis, SignUp} from "../controller/auth.js";
import {Signin ,logout,AddAmis,getAllmsgs,SendMessage}from "../controller/auth.js";
import { protect } from "../middleware/verifyToken.js";
import { getAllUsers } from "../controller/auth.js";


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


export default router;

