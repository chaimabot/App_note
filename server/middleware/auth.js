import jwt from "jsonwebtoken";

// Exemple de fonction Auth pour vérifier les tokens
const Auth = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "No token provided" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: "Invalid token" });
    }

    req.user = decoded;
    next();
  });
};

// Exemple de fonction localVariables (si nécessaire)
export const localVariables = (req, res, next) => {
  // Définir des variables locales ou initialiser des paramètres
  req.app.locals = {
    OTP: null,
    resetSession: false,
  };
  next();
};

// Exporter uniquement Auth si localVariables n'est pas nécessaire
export default Auth;
