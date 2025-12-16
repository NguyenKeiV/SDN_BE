const express = require("express");
const router = express.Router();
const axios = require("axios");

const API_URL = process.env.API_URL || "http://localhost:3000/api";

// GET - List all quizzes
router.get("/", async (req, res) => {
  try {
    const response = await axios.get(`${API_URL}/quizzes`);
    res.render("quiz/list", {
      quizzes: response.data,
      title: "Quiz List",
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});

// GET - Show create quiz form
router.get("/create", (req, res) => {
  res.render("quiz/create", {
    title: "Create New Quiz",
  });
});

// POST - Create new quiz
router.post("/", async (req, res) => {
  try {
    await axios.post(`${API_URL}/quizzes`, req.body);
    res.redirect("/quizzes");
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});

// GET - Show quiz detail
router.get("/:id", async (req, res) => {
  try {
    const response = await axios.get(`${API_URL}/quizzes/${req.params.id}`);
    res.render("quiz/detail", {
      quiz: response.data,
      title: "Quiz Detail",
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});

// GET - Show add questions form (select from existing questions)
router.get("/:id/add-questions", async (req, res) => {
  try {
    const [quizResponse, questionsResponse] = await Promise.all([
      axios.get(`${API_URL}/quizzes/${req.params.id}`),
      axios.get(`${API_URL}/questions`),
    ]);

    const quiz = quizResponse.data;
    const allQuestions = questionsResponse.data;

    // ✅ FIX: Đổi quiz.questionIds thành quiz.questions
    const existingQuestionIds = quiz.questions
      ? quiz.questions.map((q) => (typeof q === "object" ? q._id : q))
      : [];

    const availableQuestions = allQuestions.filter(
      (q) => !existingQuestionIds.includes(q._id)
    );

    res.render("quiz/addQuestions", {
      quiz: quiz,
      questions: availableQuestions,
      title: `Add Questions to ${quiz.title}`,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});

// POST - Add selected questions to quiz
router.post("/:id/add-questions", async (req, res) => {
  try {
    const questionIds = Array.isArray(req.body.questionIds)
      ? req.body.questionIds
      : [req.body.questionIds];

    // ✅ FIX: Gọi đúng endpoint mới /add-questions
    await axios.post(
      `${API_URL}/quizzes/${req.params.id}/add-questions`,
      questionIds
    );

    res.redirect(`/quizzes/${req.params.id}`);
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});

// GET - Show edit quiz form
router.get("/:id/edit", async (req, res) => {
  try {
    const response = await axios.get(`${API_URL}/quizzes/${req.params.id}`);
    res.render("quiz/edit", {
      quiz: response.data,
      title: "Edit Quiz",
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});

// PUT - Update quiz
router.put("/:id", async (req, res) => {
  try {
    await axios.put(`${API_URL}/quizzes/${req.params.id}`, req.body);
    res.redirect("/quizzes");
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});

// DELETE - Delete quiz
router.delete("/:id", async (req, res) => {
  try {
    await axios.delete(`${API_URL}/quizzes/${req.params.id}`);
    res.redirect("/quizzes");
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
