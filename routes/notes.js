const express = require("express");
const router = express.Router();
const User = require("../models/user");
const Notes = require("../models/notes");
const { isAuth } = require("../middlewares/authorizedUser");

// /dashboard route
router.get("/dashboard", isAuth, async (req, res, next) => {
  try {
    const notes = await Notes.aggregate([
      {
        $match: {
          user_id: req.user._id,
        },
      },
      {
        $project: {
          title: { $substr: ['$title', 0, 20] },
          noteBody: { $substr: ['$noteBody', 0, 200] },
        },
      },
    ]);
    res.render("dashboard", {
      user: req.user.username,
      userId: req.user._id,
      notes,
      layout: "../views/layouts/dashboardFrame",
      info: {
        title: "Dashboard",
        description: "Dashboard - Note Taking App",
      },
    });
  } catch (err) {
    next(err);
  }
});


// Create a new note
router.post("/dashboard/note-create", isAuth, async (req, res, next) => {
  try {
    const newNote = new Notes({
      user_id:req.user._id,
      title:req.body.title,
      noteBody:req.body.noteBody,
    });
    await newNote.save();
    res.redirect("/dashboard");
  } catch (err) {
    next(err);
  }
});


// Get note Page
router.get("/dashboard/note-create", isAuth, async(req, res, next) => {
  try {
  res.render("note-create", {
    layout: "../views/layouts/dashboardFrame",
    info: {
      title: "Create A Note",
      description: "Create a Note - Note Taking App ",
    },
  });
} catch (err) {
  next(err);
}
});


// Get specific note by ID
router.get("/dashboard/notes/:id", isAuth, async (req, res, next) => {
  try {
    const id = req.params.id;
    const note = await Notes.findOne({ _id: id, user_id: req.user._id });
    if (note) {
      res.render("note-view", {
        noteID: req.params.id,
        note,
        layout: "../views/layouts/dashboardFrame",
        info: {
          title: "Note Page",
          description: "Note Page - Note Taking App ",
        },
      });
    } else {
      res.status(404).send(`Note not found with ID ${id}`);
      next(err);
    }
  } catch (err) {
    next(err);
  }
});


// Update a note by ID
router.put("/dashboard/notes/:id", isAuth, async (req, res, next) => {
  try {
    const id = req.params.id;
    const note = await Notes.findOneAndUpdate({ _id: id, user_id: req.user._id }, req.body, {
      new: true,
      runValidators: true,
    });
    if (note) {
      res.redirect('/dashboard');
    } else {
      res.status(404).send(`Note not found with ID ${id}`);
      next(err);
    }
  } catch (err) {
    next(err);
  }
});


// Delete a note by ID
router.delete("/dashboard/notes/:id", isAuth, async (req, res, next) => {
  try {
    const id = req.params.id;
    const note = await Notes.findOneAndDelete({ _id: id, user_id: req.user._id });
    if (note) {
      res.redirect('/dashboard');
    } else {
      res.status(404).send(`Note not found with ID ${id}`);
      next(err);
    }
  } catch (err) {
    next(err);
  }
});


// Get Search Note
router.get("/dashboard/note-search", isAuth, async(req, res, next) => {
  try {
    res.render("note-search", {
      noteID: "", // Initialize noteID as an empty string
      layout: "../views/layouts/dashboardFrame",
      results: "",
      info: {
        title: "Search for A Note",
        description: "Create a Note - Note Taking App ",
      },
    });
  } catch (err) {
    next(err);
  }
});



// Post Search Note
router.post("/dashboard/note-search", isAuth, async (req, res, next) => {
  try {
    let searchTerm = req.body.searchTerm;
    const removeSpecialChars = searchTerm.replace(/[^a-zA-Z0-9]/g, "");
    const searchResults = await Notes.find({
      user_id: req.user._id,
      $or: [
        { title: { $regex: removeSpecialChars, $options: 'i' } },
        { noteBody: { $regex: removeSpecialChars, $options: 'i' } }
      ]
    });
    res.render('note-search', {
      noteID: "",
      results: searchResults,
      layout: "../views/layouts/dashboardFrame",
      info: {
        title: "Search for A Note",
        description: "Create a Note - Note Taking App ",
      },
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
