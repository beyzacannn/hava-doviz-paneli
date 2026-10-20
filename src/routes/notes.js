const express = require('express');
const {
  createNote,
  getNotes,
  getNoteById,
  updateNote,
  deleteNote,
} = require('../services/noteService');

const router = express.Router();

// Create: veri body'den gelir
router.post('/', async (req, res) => {
  const { city, text } = req.body || {};

  try {
    const note = await createNote({ city, text });
    res.status(201).json(note);
  } catch (error) {
    res.status(error.status || 500).json({ error: error.message });
  }
});

// Read (liste): filtre query'den gelir, ör. ?city=Istanbul
router.get('/', async (req, res) => {
  const { city } = req.query;

  try {
    const notes = await getNotes(city);
    res.json(notes);
  } catch (error) {
    res.status(error.status || 500).json({ error: error.message });
  }
});

// Read (tek not): id adresten (params) gelir, ör. /api/notes/1
router.get('/:id', async (req, res) => {
  try {
    const note = await getNoteById(req.params.id);
    res.json(note);
  } catch (error) {
    res.status(error.status || 500).json({ error: error.message });
  }
});

// Update: id params'tan, yeni değerler body'den gelir
router.put('/:id', async (req, res) => {
  const { city, text } = req.body || {};

  try {
    const note = await updateNote(req.params.id, { city, text });
    res.json(note);
  } catch (error) {
    res.status(error.status || 500).json({ error: error.message });
  }
});

// Delete: id params'tan gelir
router.delete('/:id', async (req, res) => {
  try {
    await deleteNote(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(error.status || 500).json({ error: error.message });
  }
});

module.exports = router;