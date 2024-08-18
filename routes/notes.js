const express = require("express");
const router = express.Router();
const User = require("../models/user");
const Notes = require("../models/notes");
const { isAuth } = require("../middlewares/authorizedUser");

/**
 * @swagger
 * /dashboard:
 *   get:
 *     summary: Load Dashboard
 *     description: Renders the dashboard for authenticated users
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Dashboard rendered successfully
 */
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


/**
 * @swagger
 * /dashboard/note-create:
 *   post:
 *     summary: Create a new note
 *     description: Creates a new note for authenticated users
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - noteBody
 *             properties:
 *               title:
 *                 type: string
 *               noteBody:
 *                 type: string
 *     responses:
 *       201:
 *         description: Note created successfully
 */
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


/**
 * @swagger
 * /dashboard/note-create:
 *   get:
 *     summary: Get note creation page
 *     description: Renders the note creation page for authenticated users
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Note creation page rendered successfully
 */
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


/**
 * @swagger
 * /dashboard/notes/{id}:
 *   get:
 *     summary: Get specific note by ID
 *     description: Retrieves a specific note by ID for authenticated users
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Note retrieved successfully
 *       404:
 *         description: Note not found
 */
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


/**
 * @swagger
 * /dashboard/notes/{id}:
 *   put:
 *     summary: Update a note by ID
 *     description: Updates a specific note by ID for authenticated users
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - noteBody
 *             properties:
 *               title:
 *                 type: string
 *               noteBody:
 *                 type: string
 *     responses:
 *       200:
 *         description: Note updated successfully
 *       404:
 *         description: Note not found
 */
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


/**
 * @swagger
 * /dashboard/notes/{id}:
 *   delete:
 *     summary: Delete a note by ID
 *     description: Deletes a specific note by ID for authenticated users
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Note deleted successfully
 *       404:
 *         description: Note not found
 */
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


/**
 * @swagger
 * /dashboard/note-search:
 *   get:
 *     summary: Get Search Note Page
 *     description: Renders the search note page for authenticated users
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Search note page rendered successfully
 */
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



/**
 * @swagger
 * /dashboard/note-search:
 *   post:
 *     summary: Search for Notes
 *     description: Searches for notes based on the search term for authenticated users
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - searchTerm
 *             properties:
 *               searchTerm:
 *                 type: string
 *     responses:
 *       200:
 *         description: Search results rendered successfully
 */
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
