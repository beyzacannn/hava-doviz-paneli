const fs = require('fs/promises');
const path = require('path');

const DATA_DIR = path.join(__dirname, '../../data');
const DATA_FILE = path.join(DATA_DIR, 'notes.json');

async function readNotes() {
  try {
    const content = await fs.readFile(DATA_FILE, 'utf-8');
    return JSON.parse(content);
  } catch (error) {
    if (error.code === 'ENOENT') {
      return [];
    }
    throw error;
  }
}

async function writeNotes(notes) {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(DATA_FILE, JSON.stringify(notes, null, 2), 'utf-8');
}

// Adresten gelen id metin olarak gelir ("1"), onu sayıya çevirip kontrol eder
function parseId(id) {
  const parsed = Number(id);
  if (!Number.isInteger(parsed) || parsed < 1) {
    const error = new Error('Geçersiz id');
    error.status = 400;
    throw error;
  }
  return parsed;
}

function notFound(id) {
  const error = new Error(`${id} numaralı not bulunamadı`);
  error.status = 404;
  return error;
}

function validateText(value, fieldName) {
  if (!value || typeof value !== 'string' || !value.trim()) {
    const error = new Error(`${fieldName} alanı gerekli`);
    error.status = 400;
    throw error;
  }
}

async function createNote({ city, text }) {
  validateText(city, 'city');
  validateText(text, 'text');

  const notes = await readNotes();

  const newNote = {
    id: notes.length > 0 ? Math.max(...notes.map((n) => n.id)) + 1 : 1,
    city: city.trim(),
    text: text.trim(),
    createdAt: new Date().toISOString(),
  };

  notes.push(newNote);
  await writeNotes(notes);

  return newNote;
}

async function getNotes(city) {
  const notes = await readNotes();

  if (!city) {
    return notes;
  }

  return notes.filter((n) => n.city.toLowerCase() === city.trim().toLowerCase());
}

async function getNoteById(id) {
  const noteId = parseId(id);
  const notes = await readNotes();

  const note = notes.find((n) => n.id === noteId);
  if (!note) {
    throw notFound(noteId);
  }

  return note;
}

async function updateNote(id, { city, text }) {
  const noteId = parseId(id);

  if (city === undefined && text === undefined) {
    const error = new Error('Güncellemek için city veya text gönder');
    error.status = 400;
    throw error;
  }
  if (city !== undefined) validateText(city, 'city');
  if (text !== undefined) validateText(text, 'text');

  const notes = await readNotes();
  const index = notes.findIndex((n) => n.id === noteId);
  if (index === -1) {
    throw notFound(noteId);
  }

  if (city !== undefined) notes[index].city = city.trim();
  if (text !== undefined) notes[index].text = text.trim();
  notes[index].updatedAt = new Date().toISOString();

  await writeNotes(notes);
  return notes[index];
}

async function deleteNote(id) {
  const noteId = parseId(id);

  const notes = await readNotes();
  const index = notes.findIndex((n) => n.id === noteId);
  if (index === -1) {
    throw notFound(noteId);
  }

  notes.splice(index, 1);
  await writeNotes(notes);
}

module.exports = { createNote, getNotes, getNoteById, updateNote, deleteNote };