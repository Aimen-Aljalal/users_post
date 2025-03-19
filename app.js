const express = require("express");
require("dotenv").config();
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const http = require("http");
const route = require("./routes/route");
const multer = require("multer");
const post = require("./models/post");
const socket = require("./socket");

const app = express();

app.use(express.json());

const uri = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@cluster0.w0tz2.mongodb.net/simplePost?retryWrites=true&w=majority&appName=Cluster0`;

app.use(
  cors({
    origin: "*",
    allowedHeaders: ["Content-Type", "Authorization"],
    methods: ["Post", "Get", "Delete", "Put"],
  })
);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/png"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

app.use("/images", express.static(path.join(__dirname, "images")));

app.use(
  multer({
    fileFilter: fileFilter,
    storage: storage,
  }).single("image")
);
app.use((error, req, res, next) => {
  console.error(error);

  const status = error.statusCode || 500;
  const message = error.message || "something is wrong";
  res.status(status).json({ message: message });
});

app.use("/api", route);

const server = http.createServer(app);

mongoose
  .connect(uri)
  .then(() => {
    socket.init(server);
    server.listen(process.env.PORT || 4444, () => {
      console.log("server user 4444 port");
    });
  })
  .catch((err) => {
    console.log(err);
  });
