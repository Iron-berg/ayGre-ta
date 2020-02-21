const express = require("express");
const router = express.Router();

// use routes
const auth = require("./auth");
router.use("/", auth);
const services = require("./services");
router.use("/", services);

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});

// GET news page
router.get('/news', (req, res, next)=>{
  res.render('news')
})

module.exports = router;
