import NoteModel from "../model/Note.model.js";
export async function AddNotes(req, res) {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { title, content, priority } = req.body;

    if (!title || !content) {
      return res.status(400).json({ error: "Title and content are required" });
    }

    const newNote = new NoteModel({
      title,
      content,
      priority: priority || "medium",
      createdBy: req.user.userId,
    });

    const savedNote = await newNote.save();

    res.status(201).json({
      message: "Note added successfully!",
      note: savedNote,
    });
  } catch (error) {
    console.error("Error adding note:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
