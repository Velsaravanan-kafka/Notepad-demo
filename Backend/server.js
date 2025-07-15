// server.js

// Load environment variables from .env file
require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB using environment variable or local fallback
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/notepad')
  .then(() => {
    // console.log('✅ MongoDB connected'); // Commented out
  })
  .catch(err => {
    // console.error('❌ MongoDB connection error:', err); // Commented out
  });

// Define Note Schema
const noteSchema = new mongoose.Schema({
  content: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Update middleware to automatically update `updatedAt` on save
noteSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Update middleware for findByIdAndUpdate to automatically update `updatedAt`
noteSchema.pre('findOneAndUpdate', function(next) {
  this.set({ updatedAt: Date.now() });
  next();
});

const Note = mongoose.model('Note', noteSchema);

// --- API Routes ---

// Get all notes
app.get('/notes', async (req, res) => {
  try {
    const notes = await Note.find().sort({ updatedAt: -1 });
    res.json(notes);
  } catch (error) {
    // console.error('Error fetching notes:', error); // Commented out
    res.status(500).json({ message: 'Error fetching notes' });
  }
});

// Create new note
app.post('/notes', async (req, res) => {
  try {
    const { content } = req.body;
    const note = new Note({ content });
    await note.save();
    res.status(201).json(note);
  } catch (error) {
    // console.error('Error creating note:', error); // Commented out
    res.status(500).json({ message: 'Error creating note' });
  }
});

// Update existing note
app.put('/notes/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body;
    const updatedNote = await Note.findByIdAndUpdate(
      id,
      { content },
      { new: true, runValidators: true }
    );

    if (!updatedNote) {
      return res.status(404).json({ message: 'Note not found' });
    }
    res.json(updatedNote);
  } catch (error) {
    // console.error('Error updating note:', error); // Commented out
    res.status(500).json({ message: 'Error updating note' });
  }
});

// Delete note
app.delete('/notes/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deletedNote = await Note.findByIdAndDelete(id);

    if (!deletedNote) {
      return res.status(404).json({ message: 'Note not found' });
    }
    res.status(204).send();
  } catch (error) {
    // console.error('Error deleting note:', error); // Commented out
    res.status(500).json({ message: 'Error deleting note' });
  }
});

// Set the port for the server. Uses environment variable `PORT` or defaults to 3000.
const PORT = process.env.PORT || 3000;

// Start Server
app.listen(PORT, () => {
  // console.log(`API running at http://localhost:${PORT}`); // Commented out
});