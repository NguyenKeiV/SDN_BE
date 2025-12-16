const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const User = require("../models/User");
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const jwt = require("jsonwebtoken");
const Question = require("../models/Question");

require("dotenv").config();

// Passport Local Strategy
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Tạo JWT Token
exports.getToken = (user) => {
  return jwt.sign(user, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "1h",
  });
};

// JWT Strategy Options
const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET,
};

// Passport JWT Strategy
passport.use(
  new JwtStrategy(opts, async (jwt_payload, done) => {
    try {
      const user = await User.findById(jwt_payload._id);
      if (user) {
        return done(null, user);
      } else {
        return done(null, false);
      }
    } catch (err) {
      return done(err, false);
    }
  })
);

// Middleware: Verify User (đã đăng nhập)
exports.verifyUser = passport.authenticate("jwt", { session: false });

// Middleware: Verify Admin
exports.verifyAdmin = (req, res, next) => {
  if (req.user && req.user.admin === true) {
    return next();
  } else {
    const err = new Error("You are not authorized to perform this operation!");
    err.status = 403;
    return next(err);
  }
};

// Middleware: Verify Author (tác giả của question)
exports.verifyAuthor = async (req, res, next) => {
  try {
    const question = await Question.findById(req.params.questionId);

    if (!question) {
      const err = new Error("Question not found");
      err.status = 404;
      return next(err);
    }

    // So sánh author ID với user ID
    if (question.author.toString() === req.user._id.toString()) {
      return next();
    } else {
      const err = new Error("You are not the author of this question!");
      err.status = 403;
      return next(err);
    }
  } catch (err) {
    return next(err);
  }
};
