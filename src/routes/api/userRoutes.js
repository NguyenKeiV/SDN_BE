const express = require("express");
const router = express.Router();
const passport = require("passport");
const userController = require("../../controllers/userController");
const authenticate = require("../../config/authenticate");

// POST /users/signup - Đăng ký
router.post("/signup", userController.signup);

// POST /users/login - Đăng nhập
router.post(
  "/login",
  passport.authenticate("local", { session: false }),
  userController.login
);

// GET /users - Lấy danh sách users (chỉ Admin)
router.get(
  "/",
  authenticate.verifyUser,
  authenticate.verifyAdmin,
  userController.getAllUsers
);

// GET /users/checkJWTtoken - Kiểm tra token
router.get("/checkJWTtoken", userController.checkJWTtoken);

module.exports = router;
