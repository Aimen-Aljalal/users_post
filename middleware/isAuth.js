const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: "header is wrong" });
  }
  try {
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, "Secret_key");

    req.userId = decoded.userId;
    next();
  } catch (err) {
    console.log(err);

    return res.status(500).json({ message: "catch is wrong" });
  }
};
