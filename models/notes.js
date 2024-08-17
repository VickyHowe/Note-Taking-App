const mongoose = require("mongoose");


const notesSchema = mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
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
    default: Date.now(),
  },
});

const Notes = mongoose.model("Notes", notesSchema);

module.exports = Notes;
