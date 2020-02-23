const express = require("express");
const router = express.Router();
const ensureLogin = require("connect-ensure-login");

// GET user private page
router.get("/user", ensureLogin.ensureLoggedIn(), (req, res, next) => {
  res.render("user");
});

module.exports = router;
