const express = require("express");
const router = express.Router();
const ensureLogin = require("connect-ensure-login");
const mongoThunbergService = require("../services/mongoThunbergService");

// GET user private page
router.get("/user", ensureLogin.ensureLoggedIn(), async (req, res, next) => {
  // Pre-load the thunbergs posts
  // const thunbergs = [
  //   { message: "This is a test", author: "José Angel", likes: "5" },
  //   { message: "Soy una petarda", author: "Ana", likes: "3" },
  //   { message: "Ola ke ase", author: "Lady Frameworks", likes: "1" }
  // ];
  const thunbergs = await mongoThunbergService.getRelatedThunbergs(req.user.id);
  console.log(
    "LA RESPESTA MONGOLA " + thunbergs + "TAMANO " + thunbergs.length
  );

  res.render("user", { thunbergs });
});

module.exports = router;
