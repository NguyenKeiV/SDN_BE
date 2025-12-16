const express = require("express");
const router = express.Router();
const axios = require("axios");

const API_URL = process.env.API_URL || "http://localhost:3000/api";

// GET - List all questions
router.get("/", async (req, res) => {
  try {
    const response = await axios.get(`${API_URL}/questions`);
    res.render("question/list", {
      questions: response.data,
      title: "Question List",
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});

// GET - Show create question form
router.get("/create", (req, res) => {
  res.render("question/create", {
    title: "Create New Question",
  });
});

// POST - Create new question
router.post("/", async (req, res) => {
  try {
    const options = [
      req.body.option1,
      req.body.option2,
      req.body.option3,
      req.body.option4,
    ].filter((opt) => opt && opt.trim() !== "");

    const keywords = req.body.keywords
      ? req.body.keywords.split(",").map((k) => k.trim())
      : [];

    const questionData = {
      text: req.body.text,
      options: options,
      keywords: keywords,
      correctAnswerIndex: parseInt(req.body.correctAnswerIndex),
    };

    await axios.post(`${API_URL}/questions`, questionData);
    res.redirect("/questions");
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});

// GET - Show question detail
router.get("/:id", async (req, res) => {
  try {
    const response = await axios.get(`${API_URL}/questions/${req.params.id}`);
    res.render("question/detail", {
      question: response.data,
      title: "Question Detail",
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});

// GET - Show edit question form
router.get("/:id/edit", async (req, res) => {
  try {
    const response = await axios.get(`${API_URL}/questions/${req.params.id}`);
    const question = response.data;
    question.keywordsString = question.keywords
      ? question.keywords.join(", ")
      : "";

    res.render("question/edit", {
      question: question,
      title: "Edit Question",
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});

// PUT - Update question
router.put("/:id", async (req, res) => {
  try {
    const options = [
      req.body.option1,
      req.body.option2,
      req.body.option3,
      req.body.option4,
    ].filter((opt) => opt && opt.trim() !== "");

    const keywords = req.body.keywords
      ? req.body.keywords.split(",").map((k) => k.trim())
      : [];

    const questionData = {
      text: req.body.text,
      options: options,
      keywords: keywords,
      correctAnswerIndex: parseInt(req.body.correctAnswerIndex),
    };

    await axios.put(`${API_URL}/questions/${req.params.id}`, questionData);
    res.redirect("/questions");
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});

// DELETE - Delete question
router.delete("/:id", async (req, res) => {
  try {
    await axios.delete(`${API_URL}/questions/${req.params.id}`);
    res.redirect("/questions");
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
