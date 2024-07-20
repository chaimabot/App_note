import { Router } from "express";
const router = Router();

/** Import all controllers */
import * as controller from "../controllers/appController.js";
import * as noteController from "../controllers/noteController.js";
import { registerMail } from "../controllers/mailer.js";
import Auth from "../middleware/auth.js";

/** POST Methods */
router.post("/register", controller.register); // Register user
router.post("/registerMail", registerMail); // Send the email
router.post("/login", controller.login); // Login in app
router.post("/addNote", Auth, noteController.AddNotes); // Add note (protected route)

/** GET Methods */
router.get("/user/:username", controller.getUser); // User with username
// Generate random OTP
router.get("/verifyOTP", controller.verifyOTP); // Verify generated OTP
router.get("/createResetSession", controller.createResetSession); // Create reset session
router.route("/generateOTP").get(Auth, controller.generateOTP);
/** PUT Methods */
router.put("/updateuser", Auth, controller.updateUser); // Update the user profile
router.put("/resetPassword", controller.verifyUser, controller.resetPassword); // Reset password

export default router;
