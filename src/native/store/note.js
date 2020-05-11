const store = require('.');

const getAllNotes = () => store.store.notes;

const appendNote = (note) => {
  const notes = getAllNotes();
  store.set(
    `notes`,
    notes.concat({
      ...note,
      createdAt: new Date(),
    }),
  );
};

const deleteNote = ($$id) => {
  const notes = getAllNotes();
  const n = notes.filter((i) => i.$$id !== $$id);
  store.set(`notes`, n);
};

module.exports = {
  getAllNotes,
  appendNote,
  deleteNote,
};
