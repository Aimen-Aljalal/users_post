const express = require("express");
const postController = require("../controller/postController");
const router = express.Router();
const isAuth = require("../middleware/isAuth");
const { body } = require("express-validator");
const User = require("../models/user");

router.put(
  "/signup",
  [
    body("email")
      .isEmail()
      .isLength({ min: 3 })
      .trim()
      .custom((value) => {
        return User.findOne({ email: value }).then((userDoc) => {
          if (userDoc) {
            return Promise.reject("email is already exist");
          }
        });
      })
      .withMessage(`email isn't valid`),
    body("password").isLength({ min: 3 }),
  ],
  postController.signUp
);
router.put(
  "/login",
  [
    body("email")
      .isEmail()
      .isLength({ min: 3 })
      .trim()
      .withMessage(`email isn't valid`),
    body("password").isLength({ min: 3 }),
  ],
  postController.login
);

router.get("/myposts", isAuth, postController.getUserPost);
router.post(
  "/creatPost",
  [
    body("title")
      .isLength({ min: 3 })
      .trim()
      .withMessage(`title should be valid`),
  ],
  isAuth,
  postController.createPost
);
router.put("/editPost/:postId", isAuth, postController.editPost);
router.delete("/deletePost/:postId", isAuth, postController.deletePost);

module.exports = router;
