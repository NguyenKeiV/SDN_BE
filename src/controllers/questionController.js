const Question = require("../models/Question");

// GET all questions (Public)
exports.getAllQuestions = async (req, res) => {
  try {
    const questions = await Question.find().populate("author", "username");
    res.status(200).json(questions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET question by ID (Public)
exports.getQuestionById = async (req, res) => {
  try {
    const question = await Question.findById(req.params.questionId).populate(
      "author",
      "username"
    );
    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }
    res.status(200).json(question);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST create new question (Logged-in users)
exports.createQuestion = async (req, res) => {
  try {
    const questionData = {
      ...req.body,
      author: req.user._id, // Tự động gán author từ user đã đăng nhập
    };

    const question = new Question(questionData);
    const savedQuestion = await question.save();

    // Populate author trước khi trả về
    const populatedQuestion = await Question.findById(
      savedQuestion._id
    ).populate("author", "username");

    res.status(201).json(populatedQuestion);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// PUT update question (Author only)
exports.updateQuestion = async (req, res) => {
  try {
    // Không cho phép update author field
    delete req.body.author;

    const updatedQuestion = await Question.findByIdAndUpdate(
      req.params.questionId,
      req.body,
      { new: true, runValidators: true }
    ).populate("author", "username");

    if (!updatedQuestion) {
      return res.status(404).json({ message: "Question not found" });
    }

    res.status(200).json(updatedQuestion);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// DELETE question (Author only)
exports.deleteQuestion = async (req, res) => {
  try {
    const deletedQuestion = await Question.findByIdAndDelete(
      req.params.questionId
    );

    if (!deletedQuestion) {
      return res.status(404).json({ message: "Question not found" });
    }

    res.status(200).json({ message: "Question deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
