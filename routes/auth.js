const express = require("express");
const router = express.Router();
const User = require("../models/user");
const { hashPassword } = require("../lib/hashing");
const passport = require("passport");

router.post("/", async (req, res) => {
  try {
    const { username, password } = req.body;
    const registeredUser = await User.findOne({ username });

    if (registeredUser) {
      console.log(`User ${registeredUser.username} already exists`);
      return res.redirect("/");
    } else {
      const newUser = await User.create({
        username,
        password: hashPassword(password)
      });
      console.log(`${newUser} created`);
      return res.redirect("/");
    }
  } catch (error) {
    console.log("Credentials are necessary");
    return res.redirect("/");
  }
});

router.get("/login/facebook", passport.authenticate("facebook"));

router.get(
  "/auth/facebook/callback",
  passport.authenticate("facebook", {
    failureRedirect: "/" // here will redirect to login page
  }),
  function(req, res) {
    // Successful authentication, redirect private page.
    console.log("Succesfully logged with Facebook");
    res.redirect("/");
  }
);

router.get("/logout", (req, res) => {
  req.logout();
  console.log("User logged out");
  res.redirect("/");
});

module.exports = router;
