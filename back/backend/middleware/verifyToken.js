import jwt from "jsonwebtoken";
import dotenv from 'dotenv'
dotenv.config();
export const protect =async (req, res, next) => {
  try {
    const token = req.cookies?.auth_token;
    if (!token) {
      return res.status(401).json({ message: "Non autorisé" });
    }

    const decoded = jwt.verify(token,process.env.JWT_SECRET );
     const currentUser = await user.findById(decoded.id).select('username _id');
    if (!currentUser) return res.status(401).json({ message: "Utilisateur introuvable" });
    req.user = { _id: decoded.id ,username:decoded.username};
    next();
  } catch (error) {
    res.status(401).json({ message: "Authentification invalide" });
  }
};
