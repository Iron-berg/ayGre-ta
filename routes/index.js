const express = require("express");
const router = express.Router();

// use routes
const auth = require("./auth");
router.use("/", auth);
const services = require("./services");
router.use("/", services);
const private = require("./private");
router.use("/", private);

// GET home page
router.get("/", (req, res, next) => {
  res.render("index", { showTitle: true });
});

// GET news page
router.get("/news", (req, res, next) => {
  res.render("news", { showTitle: true });
});

// GET about page
router.get("/about", (req, res, next) => {
  res.render("about");
});

module.exports = router;
