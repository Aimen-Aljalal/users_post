const User = require("../models/user");
const Post = require("../models/post");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const io = require("../socket");
exports.signUp = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(422).json({
      message: `you can't sign up `,
      errors: errors.array(),
    });
  }
  const email = req.body.email;
  const isExist = await User.findOne({ email: email });
  if (isExist) {
    return res.status(500).json({ message: `email or password can't be used` });
  }
  try {
    const password = req.body.password;
    const name = req.body.name;
    const hashedPass = await bcrypt.hash(password, 12);
    const user = new User({
      email: email,
      password: hashedPass,
      name: name,
    });
    await user.save();
    return res.status(201).json({ message: `created succful`, user });
  } catch (err) {
    console.log(err);
  }
};

exports.login = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(422).json({
      message: `you can't login `,
      errors: errors.array(),
    });
  }
  const email = req.body.email;
  const password = req.body.password;
  const user = await User.findOne({ email: email });
  if (!user) {
    return res.status(401).json({ message: `login doesn't work no email` });
  }
  try {
    const isEqual = await bcrypt.compare(password, user.password);
    if (!isEqual) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    const token = jwt.sign(
      {
        email: user.email,
        userId: user._id,
      },
      "Secret_key",
      { expiresIn: "1h" }
    );
    res.status(201).json({ message: "login is correct", token });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: `login doesn't working`,
    });
  }
};

exports.createPost = async (req, res, next) => {
  try {
    const post = new Post({
      title: req.body.title,
      content: req.body.content,
      creator: req.userId,
    });
    await post.save();
    io.getIO().emit("post-added", post);
    res.status(201).json({ message: "done creating post", post: post });
  } catch (err) {
    console.log(err);
    res.status(401).json({ message: "err in create post" });
  }
};

exports.deletePost = async (req, res, next) => {
  try {
    const postId = req.params.postId;
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "no post to delete" });
    }
    if (post.creator._id.toString() !== req.userId.toString()) {
      return res
        .status(403)
        .json({ message: "this user not allowed to do that" });
    }
    await Post.findByIdAndDelete(postId);
    return res.status(200).json({ message: "post deleted" });
  } catch (err) {
    console.log(err);

    res.status(500).json({ message: "err in delete post" });
  }
};

exports.editPost = async (req, res, next) => {
  try {
    const postId = req.params.postId;
    const title = req.body.title;
    const content = req.body.content;
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "no post to edit" });
    }
    if (post.creator._id.toString() !== req.userId.toString()) {
      return res
        .status(403)
        .json({ message: "this user not allowed to do that" });
    }
    post.title = title || post.title;
    post.content = content || post.content;
    await post.save();
    return res.status(200).json({ message: "post edited" });
  } catch (err) {
    console.log(err);

    return res.status(500).json({ message: "err in editing post" });
  }
};

exports.getUserPost = async (req, res, next) => {
  const userId = req.userId;

  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const posts = await Post.find({ creator: userId }).skip(skip).limit(limit);
  const totalPosts = await Post.countDocuments({ creator: userId });
  if (!posts) {
    return res.status(500).json({ message: "err in getting post" });
  }
  return res.status(200).json({
    message: "all your posts",
    posts,
    totalPosts,
    currentPage: page,
    totalPages: Math.ceil(totalPosts / limit),
  });
};
