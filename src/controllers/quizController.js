const Quiz = require("../models/Quiz");
const Question = require("../models/Question");

// GET all quizzes with populated questions
exports.getAllQuizzes = async (req, res) => {
  try {
    const quizzes = await Quiz.find().populate({
      path: "questions",
      populate: { path: "author", select: "username" },
    });
    res.status(200).json(quizzes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET quiz by ID
exports.getQuizById = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.quizId).populate({
      path: "questions",
      populate: { path: "author", select: "username" },
    });
    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }
    res.status(200).json(quiz);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST create new quiz (Admin only)
exports.createQuiz = async (req, res) => {
  try {
    const quiz = new Quiz(req.body);
    const savedQuiz = await quiz.save();
    res.status(201).json(savedQuiz);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// PUT update quiz (Admin only)
exports.updateQuiz = async (req, res) => {
  try {
    const updatedQuiz = await Quiz.findByIdAndUpdate(
      req.params.quizId,
      req.body,
      { new: true, runValidators: true }
    ).populate({
      path: "questions",
      populate: { path: "author", select: "username" },
    });
    if (!updatedQuiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }
    res.status(200).json(updatedQuiz);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// DELETE quiz (Admin only)
exports.deleteQuiz = async (req, res) => {
  try {
    const deletedQuiz = await Quiz.findByIdAndDelete(req.params.quizId);
    if (!deletedQuiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }
    res.status(200).json({ message: "Quiz deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET quiz with questions matching keyword "capital"
exports.getQuizWithCapitalKeyword = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.quizId).populate({
      path: "questions",
      match: { keywords: "capital" },
      populate: { path: "author", select: "username" },
    });
    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }
    res.status(200).json(quiz);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST create one NEW question in quiz (Admin only)
// ⭐ QUAN TRỌNG: Phải có author khi tạo question
exports.addQuestionToQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.quizId);
    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    // ⭐ Thêm author từ user đang đăng nhập (Admin)
    const questionData = {
      ...req.body,
      author: req.user._id,
    };

    const question = new Question(questionData);
    const savedQuestion = await question.save();

    quiz.questions.push(savedQuestion._id);
    await quiz.save();

    const updatedQuiz = await Quiz.findById(quiz._id).populate({
      path: "questions",
      populate: { path: "author", select: "username" },
    });
    res.status(201).json(updatedQuiz);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// POST create many NEW questions in quiz (Admin only)
// ⭐ QUAN TRỌNG: Phải có author cho mỗi question
exports.addMultipleQuestionsToQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.quizId);
    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    // ⭐ Thêm author vào mỗi question
    const questionsWithAuthor = req.body.map((q) => ({
      ...q,
      author: req.user._id,
    }));

    const questions = await Question.insertMany(questionsWithAuthor);
    const questionIds = questions.map((q) => q._id);

    quiz.questions.push(...questionIds);
    await quiz.save();

    const updatedQuiz = await Quiz.findById(quiz._id).populate({
      path: "questions",
      populate: { path: "author", select: "username" },
    });
    res.status(201).json(updatedQuiz);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// POST add EXISTING questions to quiz (Admin only)
exports.addExistingQuestionsToQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.quizId);
    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    const questionIds = Array.isArray(req.body) ? req.body : [req.body];

    // Kiểm tra tất cả question IDs có tồn tại không
    const existingQuestions = await Question.find({
      _id: { $in: questionIds },
    });

    if (existingQuestions.length !== questionIds.length) {
      return res.status(400).json({
        message: "Some question IDs are invalid or do not exist",
      });
    }

    // Lọc ra những question đã có trong quiz
    const currentQuestionIds = quiz.questions.map((id) => id.toString());
    const newQuestionIds = questionIds.filter(
      (id) => !currentQuestionIds.includes(id)
    );

    if (newQuestionIds.length === 0) {
      return res.status(400).json({
        message: "All selected questions are already in this quiz",
      });
    }

    quiz.questions.push(...newQuestionIds);
    await quiz.save();

    const updatedQuiz = await Quiz.findById(quiz._id).populate({
      path: "questions",
      populate: { path: "author", select: "username" },
    });
    res.status(200).json(updatedQuiz);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
