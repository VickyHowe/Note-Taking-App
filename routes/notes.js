const express = require("express");
const router = express.Router();
const User = require("../models/user");
const Notes = require("../models/notes");
const { isAuth } = require("../middlewares/authorizedUser");


// Load Dashboard
router.get("/dashboard", isAuth, (req, res, next) => {
    res.render("dashboard", {
      user: req.user.username,
      layout: "../views/layouts/dashboardFrame",
      info: {
        title: "Dashboard",
        description: "Dashboard - Note Taking App ",
      },
    });
  });



// Gets all the notes
router.get('/notes',isAuth, async(req, res) => {
  try {
    const notes = await Notes.find().exec();
    res.json(Notes);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching notes' });
  }

});

// Get specific note by ID
router.get('/notes/:id', isAuth, async (req, res) => {
  try {
    const id = req.params.id;
    const note = await Notes.findById(id).exec();
    if (note) {
      res.json(note);
    } else {
      res.status(404).json({ message: `Note not found with ID ${id}` });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching note' });
  }
});

// Create a new note
router.post('/notes', isAuth, async (req, res) => {
  try {
    const { title, content } = req.body;
    const note = new Notes({ title, content, userId: req.user.id });
    await note.save();
    res.json(note);
  } catch (error) {
    res.status(500).json({ message: 'Error creating note' });
  }
});

// Update a note by ID
router.put('/notes/:id', isAuth, async (req, res) => {
  try {
    const id = req.params.id;
    const note = await Notes.findByIdAndUpdate(id, req.body, { new: true }).exec();
    if (note) {
      res.json(note);
    } else {
      res.status(404).json({ message: `Note with ID ${id} not found` });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error updating note' });
  }
});

// Delete a note by ID
router.delete('/notes/:id', isAuth, async (req, res) => {
  try {
    const id = req.params.id;
    const note = await Notes.findByIdAndRemove(id).exec();
    if (note) {
      res.json({ message: `Note with ID ${id} deleted successfully` });
    } else {
      res.status(404).json({ message: `Note with ID ${id} not found` });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error deleting note' });
  }
});
module.exports = router;
