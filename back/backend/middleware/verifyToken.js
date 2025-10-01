import jwt from "jsonwebtoken";

export const protect = (req, res, next) => {
  try {
    const token = req.cookies?.auth_token;
    if (!token) {
      return res.status(401).json({ message: "Non autorisé" });
    }

    const decoded = jwt.verify(token, 'SECRET_KEY');
    req.user = { _id: decoded.id };
    next();
  } catch (error) {
    res.status(401).json({ message: "Authentification invalide" });
  }
};
