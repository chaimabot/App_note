// generateSecret.js
import crypto from "crypto";

// Générer une clé secrète de 64 octets encodée en hexadécimal
const secret = crypto.randomBytes(64).toString("hex");
console.log(secret);
