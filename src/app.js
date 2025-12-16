const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const methodOverride = require("method-override");
const passport = require("passport");
const cors = require("cors"); // ⭐ NEW

const app = express();

// ⭐ CORS Configuration - Cho phép Frontend gọi API
app.use(
  cors({
    origin: "http://localhost:3001", // React app chạy ở port 3001
    credentials: true,
  })
);

// View engine setup - CHỈ dùng EJS
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "../views"));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "../public")));

// Passport middleware
app.use(passport.initialize());

// API Routes (từ Assignment 1-3)
const apiQuizRoutes = require("./routes/api/quizRoutes");
const apiQuestionRoutes = require("./routes/api/questionRoutes");
const apiUserRoutes = require("./routes/api/userRoutes");

app.use("/api/quizzes", apiQuizRoutes);
app.use("/api/questions", apiQuestionRoutes);
app.use("/api/users", apiUserRoutes);

// Web Routes (Assignment 2) - Optional, có thể giữ hoặc bỏ
const webQuizRoutes = require("./routes/web/quizWebRoutes");
const webQuestionRoutes = require("./routes/web/questionWebRoutes");

app.use("/quizzes", webQuizRoutes);
app.use("/questions", webQuestionRoutes);

// Root route
app.get("/", (req, res) => {
  res.json({ message: "Quiz API Server" });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message,
    error: process.env.NODE_ENV === "development" ? err : {},
  });
});

module.exports = app;
