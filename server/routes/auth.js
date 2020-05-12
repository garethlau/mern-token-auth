const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const User = mongoose.model("User");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../config/keys");
const middlewares = require("../middlewares");

function sendRefreshToken(res, token) {
  res.cookie("app_rtoken", token, { httpOnly: true });
}

function clearRefreshToken(res) {
  res.clearCookie("app_rtoken", { httpOnly: true });
}

router.get("/", (req, res) => {
  res.send("auth");
});

router.get("/protected", middlewares.auth, (req, res) => {
  res.send("You've reached the protected endpoint.");
});

router.post("/logout", (req, res) => {
  clearRefreshToken(res);
  return res.status(200).send();
});

router.post("/logout-all", async (req, res) => {
  const token = req.cookies.app_rtoken;
  if (!token) {
    return res.status(401).send({ message: "No token" });
  }

  let payload = null;
  try {
    payload = jwt.verify(token, keys.REFRESH_TOKEN_SECRET);
  } catch (err) {
    console.log(err.message);
    return res.status(401).send({ message: "Invalid token" });
  }

  try {
    const user = await User.findByIdAndUpdate(payload.ID, {
      $inc: {
        tokenVersion: 1,
      },
    }).exec();
    console.log("User's token version is now: " + user.tokenVersion);
    return res.status(200).send();
  } catch (err) {
    console.log(err.message);
    return res.status(500).send();
  }
});
router.post("/refresh-token", async (req, res) => {
  // Step 1
  const token = req.cookies.app_rtoken;
  if (!token) {
    return res.status(401).send({ accessToken: "" });
  }
  // Step 2
  let payload = null;
  try {
    payload = jwt.verify(token, keys.REFRESH_TOKEN_SECRET);
  } catch (err) {
    console.log(err.message);
    return res.status(401).send({ accessToken: "" });
  }
  // Step 3
  const user = await User.findById(payload.ID).exec();
  if (!user) {
    return res.status(401).send({ accessToken: "" });
  }
  // Step 4
  if (user.tokenVersion !== payload.tokenVersion) {
    return res.status(401).send({ accessToken: "" });
  }
  // Step 5
  let accessToken = await user.generateAccessToken();
  let refreshToken = await user.generateRefreshToken();
  sendRefreshToken(res, refreshToken);

  return res.status(201).send({ accessToken });
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  // Step 1 - Check if the username exists
  try {
    const user = await User.findOne({ username }).exec();
    if (!user) {
      return res.status(404).send({ message: "User does not exist." });
    }

    // Step 2 - Compare passwords
    const isPasswordMatch = await bcryptjs.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(401).send({ message: "Incorrect password" });
    }

    // Step 3 - Generate access token
    const accessToken = await user.generateAccessToken();
    // Step 4 - Generate refresh token
    const refreshToken = await user.generateRefreshToken();
    // Step 5 - Send refresh token
    sendRefreshToken(res, refreshToken);
    // Step 6 - Send access token
    return res.send({ user, accessToken });
  } catch (err) {
    console.log(err.message);
    return res.status(500).send({ err: err.message });
  }
});

router.post("/signup", async (req, res) => {
  const { username, password } = req.body;
  // Step 1 - Create and save the user
  try {
    const user = await new User({
      username: username,
      password: password,
      tokenVersion: 0,
    }).save();

    // Step 2 - Generate access token
    const accessToken = user.generateAccessToken();

    // Step 3 - Generate refresh token
    const refreshToken = user.generateRefreshToken();

    // Step 4 - Send the refresh token
    sendRefreshToken(res, refreshToken);

    // Step 5 - Send the access token (and user)
    return res.status(201).send({ user, accessToken });
  } catch (err) {
    console.log(err.message);
    return res.status(400).send(err);
  }
});
module.exports = router;
