// server.js

// Load environment variables from .env file
require('dotenv').config(); // <-- ADDED LINE

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors()); // Allow frontend access
app.use(express.json()); // Parse JSON body

// Connect to MongoDB using environment variable or local fallback
// process.env.MONGODB_URI will be set on deployment platforms like Render/Heroku
// The fallback 'mongodb://localhost:27017/notepad' is for local development
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/notepad') // <-- MODIFIED LINE
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// Define Note Schema
const noteSchema = new mongoose.Schema({
  content: String,
  createdAt: { type: Date, default: Date.now }, // Added default for createdAt
  updatedAt: { type: Date, default: Date.now }, // Added default for updatedAt
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
  try { // Added try-catch for error handling
    const notes = await Note.find().sort({ updatedAt: -1 });
    res.json(notes);
  } catch (error) {
    console.error('Error fetching notes:', error);
    res.status(500).json({ message: 'Error fetching notes' });
  }
});

// Create new note
app.post('/notes', async (req, res) => {
  try { // Added try-catch for error handling
    const { content } = req.body;
    // createdAt and updatedAt defaults are handled by schema now
    const note = new Note({ content });
    await note.save();
    res.status(201).json(note);
  } catch (error) {
    console.error('Error creating note:', error);
    res.status(500).json({ message: 'Error creating note' });
  }
});

// Update existing note
app.put('/notes/:id', async (req, res) => {
  try { // Added try-catch for error handling
    const { id } = req.params;
    const { content } = req.body;
    // updatedAt is handled by schema pre-hook for findByIdAndUpdate
    const updatedNote = await Note.findByIdAndUpdate(
      id,
      { content }, // Removed explicit updatedAt: new Date()
      { new: true, runValidators: true } // Return the updated document, run schema validators
    );

    if (!updatedNote) {
      return res.status(404).json({ message: 'Note not found' });
    }
    res.json(updatedNote);
  } catch (error) {
    console.error('Error updating note:', error);
    res.status(500).json({ message: 'Error updating note' });
  }
});

// Delete note
app.delete('/notes/:id', async (req, res) => {
  try { // Added try-catch for error handling
    const { id } = req.params;
    const deletedNote = await Note.findByIdAndDelete(id);

    if (!deletedNote) {
      return res.status(404).json({ message: 'Note not found' });
    }
    res.status(204).send(); // 204 No Content for successful deletion
  } catch (error) {
    console.error('Error deleting note:', error);
    res.status(500).json({ message: 'Error deleting note' });
  }
});

// Set the port for the server. Uses environment variable `PORT` or defaults to 3000.
const PORT = process.env.PORT || 3000; // <-- MODIFIED LINE

// Start Server
app.listen(PORT, () => { // <-- MODIFIED LINE
  console.log(`API running at http://localhost:${PORT}`); // <-- MODIFIED LINE
});