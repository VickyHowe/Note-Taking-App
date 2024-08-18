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
  console.log("Req body:", req.body); 
  try {
    const newNote = new Notes({
      user_id:req.user._id,
      title:req.body.title,
      noteBody:req.body.noteBody,
    });
    await newNote.save();
    console.log("Note created:", newNote); 
    res.redirect("/dashboard");
  } catch (err) {
    next(err);
  }
});

// Get note Page
router.get("/dashboard/note-create", isAuth, async(req, res) => {
  res.render("note-create", {
    layout: "../views/layouts/dashboardFrame",
    info: {
      title: "Create A Note",
      description: "Create a Note - Note Taking App ",
    },
  });
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
      const err = new Error(`Note not found with ID ${id}`);
      err.status = 404;
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
      const err = new Error(`Note not found with ID ${id}`);
      err.status = 404;
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
      const err = new Error(`Note not found with ID ${id}`);
      err.status = 404;
      next(err);
    }
  } catch (err) {
    next(err);
  }
});

// // This route is for testing notes in database
// router.get('/notes', async (req, res) => {
//   try {
//     const notes = await Notes.find(); 
//     res.send(notes);
//   } catch (err) {
//     res.status(500).send('Error fetching notes');
//   }
// });

module.exports = router;
