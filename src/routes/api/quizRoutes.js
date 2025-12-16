const express = require("express");
const router = express.Router();
const quizController = require("../../controllers/quizController");
const authenticate = require("../../config/authenticate");

// ✅ CRITICAL: Đặt TẤT CẢ routes cụ thể TRƯỚC các routes có :quizId

// Special routes - phải đặt TRƯỚC /:quizId
router.post(
  "/:quizId/add-questions",
  authenticate.verifyUser,
  authenticate.verifyAdmin,
  quizController.addExistingQuestionsToQuiz
);

router.post(
  "/:quizId/question",
  authenticate.verifyUser,
  authenticate.verifyAdmin,
  quizController.addQuestionToQuiz
);

router.post(
  "/:quizId/questions",
  authenticate.verifyUser,
  authenticate.verifyAdmin,
  quizController.addMultipleQuestionsToQuiz
);

router.get("/:quizId/populate", quizController.getQuizWithCapitalKeyword);

// Basic CRUD routes
// GET - Public (ai cũng xem được)
router.get("/", quizController.getAllQuizzes);
router.get("/:quizId", quizController.getQuizById);

// POST, PUT, DELETE - Chỉ Admin
router.post(
  "/",
  authenticate.verifyUser,
  authenticate.verifyAdmin,
  quizController.createQuiz
);

router.put(
  "/:quizId",
  authenticate.verifyUser,
  authenticate.verifyAdmin,
  quizController.updateQuiz
);

router.delete(
  "/:quizId",
  authenticate.verifyUser,
  authenticate.verifyAdmin,
  quizController.deleteQuiz
);

module.exports = router;
