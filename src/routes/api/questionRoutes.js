const express = require("express");
const router = express.Router();
const questionController = require("../../controllers/questionController");
const authenticate = require("../../config/authenticate");

// GET all questions - Public
router.get("/", questionController.getAllQuestions);

// GET question by ID - Public
router.get("/:questionId", questionController.getQuestionById);

// POST create question - Logged-in users only
router.post("/", authenticate.verifyUser, questionController.createQuestion);

// PUT update question - Author only
router.put(
  "/:questionId",
  authenticate.verifyUser,
  authenticate.verifyAuthor,
  questionController.updateQuestion
);

// DELETE question - Author only
router.delete(
  "/:questionId",
  authenticate.verifyUser,
  authenticate.verifyAuthor,
  questionController.deleteQuestion
);

module.exports = router;
