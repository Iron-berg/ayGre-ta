const express = require("express");
const router = express.Router();
const ensureLogin = require("connect-ensure-login");
const mongoThunbergService = require("../services/mongoThunbergService");
const User = require("../models/user");

// GET user private page
router.get("/user", ensureLogin.ensureLoggedIn("/"), async (req, res, next) => {
  try {
    const thunbergs = await mongoThunbergService.getRelatedThunbergs(
      req.user.id
    );
    const users = await User.find().sort({ gretaPoints: -1 });
    const platformUsers = users.map((user, index) => {
      return {
        username: user.username,
        followers: user.followers.length,
        gretaPoints: user.gretaPoints,
        likes:
          user.gretaPoints > 0
            ? (user.gretaPoints - user.followers.length) / 2
            : 0,
        isCurrentUser: req.user.username === user.username ? true : false,
        isTopUser: index < 5
      };
    });
    const currentUser = platformUsers.find(
      user => user.username === req.user.username
    );

    User.findById(req.user.id)
      .populate("followings")
      .populate("followers")
      .exec((err, user) => {
        if (err) {
          console.log(
            "something went wrong while populating user's followings",
            err
          );
        } else {
          console.log("successfully populated fields");

          res.render("user", {
            platformUser: platformUsers.slice(0, 5),
            currentUser,
            numOfFavs: req.user.favoriteNews.length,
            thunbergs,
            follower: user.followers.map(user => ({
              id: user._id,
              username: user.username,
              mutuals: req.user.followings.includes(user._id)
            })),
            following: user.followings.map(user => ({
              id: user._id,
              username: user.username,
              mutuals: user.followings.includes(req.user._id)
            }))
          });
        }
      });
  } catch (error) {
    console.log(error);
  }
});

// POST - remove following * this should be moved to services.js *

const mongoUserService = require("../services/mongoUserService"); // temporary import

router.post("/ddbb/removeFollowing", async (req, res, next) => {
  const response = await mongoUserService.removeFollowing(
    req.body.userToUnfollow,
    req.body.currentUser
  );
  res.json(response);
});

router.get("/ddbb/getUsersFriends", async (req, res, next) => {
  try {
    await User.findById(req.query.userid)
      .populate("followings")
      .populate("followers")
      .exec((err, user) => {
        console.log("user updated in DDBB", user);
        res.render("partials/modal", {
          layout: false,
          follower: user.followers.map(user => ({
            id: user._id,
            username: user.username,
            mutuals: req.user.followings.includes(user._id)
          })),
          following: user.followings.map(user => ({
            id: user._id,
            username: user.username,
            mutuals: user.followings.includes(req.user._id)
          })),
          modalTitle: "Folks of ayGre-ta",
          firstTab: "Followers",
          firstID: "followers",
          secondTab: "Following",
          secondID: "following",
          activeModal: true
        });
      });
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
