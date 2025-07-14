const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors()); // Allow frontend access
app.use(express.json()); // Parse JSON body

// Connect to MongoDB (replace with your real MongoDB URI)
mongoose.connect('mongodb://localhost:27017/notepad')
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// Define Note Schema
const noteSchema = new mongoose.Schema({
  content: String,
  createdAt: Date,
  updatedAt: Date,
});

const Note = mongoose.model('Note', noteSchema);

// --- API Routes ---

// Get all notes
app.get('/notes', async (req, res) => {
  const notes = await Note.find().sort({ updatedAt: -1 });
  res.json(notes);
});

// Create new note
app.post('/notes', async (req, res) => {
  const { content } = req.body;
  const now = new Date();
  const note = new Note({ content, createdAt: now, updatedAt: now });
  await note.save();
  res.status(201).json(note);
});

app.put('/notes/:id', async (req, res) => {
  const { id } = req.params;
  const { content } = req.body;
  const updatedNote = await Note.findByIdAndUpdate(
    id,
    { content, updatedAt: new Date() },
    { new: true } // Return the updated document
  );
  res.json(updatedNote);
});
// Delete note
app.delete('/notes/:id', async (req, res) => {
  const { id } = req.params;
  await Note.findByIdAndDelete(id);
  res.status(204).send();
});

// Start Server
app.listen(3000, () => {
  console.log('API running at http://localhost:3000');
});
