import mongoose from "mongoose";

const ATLAS_URI =
  "mongodb+srv://chaimabounawara:Yassine90%40@cluster0.hatgcie.mongodb.net/Login_auth?retryWrites=true&w=majority";

async function connect() {
  mongoose.set("strictQuery", true);

  try {
    const db = await mongoose.connect(ATLAS_URI);
    console.log("Database Connected");
    return db;
  } catch (error) {
    console.error("Database connection error:", error.message);
    throw error;
  }
}

export default connect;
