const store = require('.');

const getAllNotes = () => store.store.notes;

const appendNote = (note) => {
  const notes = getAllNotes();
  store.set(`notes`, notes.concat(note));
};

module.exports = {
  getAllNotes,
  appendNote,
};
