// server/model/Note.model.js
import mongoose from "mongoose";

const NoteSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Please provide a title for the note"],
    trim: true,
  },
  content: {
    type: String,
    required: [true, "Please provide content for the note"],
    trim: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  priority: {
    type: String,
    enum: ["low", "medium", "high"],
    default: "medium",
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Associe la note à un utilisateur
    required: true,
  },
});

export default mongoose.model("Note", NoteSchema);
