const User = require("../models/User");
const passport = require("passport");
const authenticate = require("../config/authenticate");

// POST /api/users/signup - Đăng ký user mới
exports.signup = async (req, res) => {
  try {
    const { username, password, admin } = req.body;

    // Tạo user mới (chưa lưu password)
    const user = new User({
      username,
      admin: admin || false, // Cho phép set admin khi đăng ký (chỉ để test)
    });

    // passport-local-mongoose sẽ hash password và lưu
    await User.register(user, password);

    // Tự động đăng nhập sau khi đăng ký
    passport.authenticate("local")(req, res, () => {
      res.status(200).json({
        success: true,
        message: "Registration successful!",
        user: {
          _id: user._id,
          username: user.username,
          admin: user.admin,
        },
      });
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// POST /api/users/login - Đăng nhập
exports.login = (req, res) => {
  // req.user đã được passport.authenticate('local') set sẵn
  const token = authenticate.getToken({
    _id: req.user._id,
    username: req.user.username,
    admin: req.user.admin,
  });

  res.status(200).json({
    success: true,
    token: token,
    message: "Login successful!",
    user: {
      _id: req.user._id,
      username: req.user.username,
      admin: req.user.admin,
    },
  });
};

// GET /api/users - Lấy danh sách tất cả users (chỉ Admin)
exports.getAllUsers = async (req, res) => {
  try {
    // Không trả về hash và salt (password)
    const users = await User.find().select("-hash -salt");

    res.status(200).json({
      success: true,
      count: users.length,
      users: users,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// GET /api/users/checkJWTtoken - Kiểm tra JWT token
exports.checkJWTtoken = (req, res) => {
  passport.authenticate("jwt", { session: false }, (err, user, info) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: err.message,
      });
    }
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "JWT invalid!",
        info: info,
      });
    }
    return res.status(200).json({
      success: true,
      message: "JWT valid!",
      user: {
        _id: user._id,
        username: user.username,
        admin: user.admin,
      },
    });
  })(req, res);
};
