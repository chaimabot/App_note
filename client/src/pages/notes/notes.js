import axios from "axios";
import { useState } from "react";
import Navbar from "../../components/navbar";
import PropTypes from "prop-types";

const AddNoteModal = ({ onAddNote, onClose }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState("Low");

  const handleAddNote = async () => {
    if (title && content) {
      try {
        const newNote = { title, content, dueDate, priority };
        const response = await axios.post(
          "http://localhost:8000/api/addNote",
          newNote,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            }, // Ajoutez les headers si nécessaire
          }
        );
        onAddNote(response.data.note); // Passe la note ajoutée au parent
        onClose();
      } catch (error) {
        console.error("Error adding note:", error);
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
      <div className="bg-white rounded p-4 max-w-sm w-full">
        <h2 className="text-lg font-bold mb-4">Add New Note</h2>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 mb-2 border border-gray-300 rounded"
        />
        <textarea
          placeholder="Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full p-2 mb-2 border border-gray-300 rounded"
        />
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className="w-full p-2 mb-2 border border-gray-300 rounded"
        />
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          className="w-full p-2 mb-2 border border-gray-300 rounded"
        >
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="mr-2 bg-gray-500 text-white py-1 px-4 rounded"
          >
            Cancel
          </button>
          <button
            onClick={handleAddNote}
            className="bg-indigo-600 text-white py-1 px-4 rounded"
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
};

AddNoteModal.propTypes = {
  onAddNote: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
};

const Notes = () => {
  const [notes, setNotes] = useState([
    {
      id: 1,
      title: "Note Title 1",
      content:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      completed: false,
      dueDate: new Date().toLocaleDateString(),
      priority: "Low",
    },
    {
      id: 2,
      title: "Note Title 2",
      content:
        "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
      completed: true,
      dueDate: new Date().toLocaleDateString(),
      priority: "Medium",
    },
  ]);

  const [expandedNote, setExpandedNote] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);

  const toggleExpand = (id) => {
    setExpandedNote(expandedNote === id ? null : id);
  };

  const toggleCompletion = (id) => {
    setNotes(
      notes.map((note) =>
        note.id === id ? { ...note, completed: !note.completed } : note
      )
    );
  };

  const truncateText = (text) => {
    if (text.length > 21) {
      return text.slice(0, 21) + "...";
    }
    return text;
  };

  const addNote = (newNote) => {
    setNotes([...notes, newNote]);
  };

  const deleteNote = (id) => {
    const updatedNotes = notes.filter((note) => note.id !== id);
    setNotes(updatedNotes);
  };

  const editNote = (id, updatedContent) => {
    const updatedNotes = notes.map((note) =>
      note.id === id ? { ...note, content: updatedContent } : note
    );
    setNotes(updatedNotes);
  };

  return (
    <div>
      <Navbar />
      <div className="bg-gray-100 min-h-screen p-4">
        <div className="max-w-2xl mx-auto relative">
          <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
            My Notes
          </h1>
          <button
            className="absolute top-0 right-0 bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700"
            onClick={() => setShowAddModal(true)}
          >
            Add New Note
          </button>
          <div className="grid grid-cols-2 gap-4">
            {notes.map((note) => (
              <div key={note.id} className="bg-white shadow-md rounded p-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-gray-800">
                        {note.title}
                      </h3>
                      <div className="flex space-x-2 items-center">
                        <span className="text-gray-600">{note.dueDate}</span>
                        <span
                          role="button"
                          className={
                            note.completed ? "text-green-500" : "text-red-500"
                          }
                          onClick={() => toggleCompletion(note.id)}
                        >
                          {note.completed ? "✓" : "✗"}
                        </span>
                        <button
                          className="text-blue-500"
                          onClick={() =>
                            editNote(note.id, "Updated content...")
                          }
                        >
                          ✎
                        </button>
                        <button
                          className="text-red-500"
                          onClick={() => deleteNote(note.id)}
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                    <p
                      className="text-gray-600 cursor-pointer"
                      onClick={() => toggleExpand(note.id)}
                    >
                      {expandedNote === note.id
                        ? note.content
                        : truncateText(note.content)}
                    </p>
                  </div>
                  <button
                    className="ml-2 text-gray-600"
                    onClick={() => toggleExpand(note.id)}
                  >
                    {expandedNote === note.id ? "▲" : "▼"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {showAddModal && (
        <AddNoteModal
          onAddNote={addNote}
          onClose={() => setShowAddModal(false)}
        />
      )}
    </div>
  );
};

export default Notes;
