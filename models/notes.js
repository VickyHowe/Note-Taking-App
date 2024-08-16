const mongoose = require('mongoose');

const notesSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
  title: {
    type: String,
    required: true
  },
  noteBody: {
    type: String,
    required: true
  },
  dateCreated: {
    type: Date,
    default: Date.now()
  }
});
const Notes = mongoose.model("Notes", notesSchema);
module.exports = Notes;