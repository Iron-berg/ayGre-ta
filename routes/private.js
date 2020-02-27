const express = require('express');
const router = express.Router();
const ensureLogin = require('connect-ensure-login');
const mongoThunbergService = require('../services/mongoThunbergService');
const User = require('../models/user');

// GET user private page
router.get('/user', ensureLogin.ensureLoggedIn(), async (req, res, next) => {
	try {
		const thunbergs = await mongoThunbergService.getRelatedThunbergs(req.user.id);
		const users = await User.find().sort({ gretaPoints: -1 });
		const platformUsers = users.map((user, index) => {
			return {
				username: user.username,
				followers: user.followers.length,
				gretaPoints: user.gretaPoints,
				likes: user.gretaPoints > 0 ? (user.gretaPoints - user.followers.length) / 2 : 0,
				isCurrentUser: req.user.username === user.username ? true : false,
				isTopUser: index < 5
			};
		});

		const currentUser = platformUsers.find(user => user.username === req.user.username);

		User.findById(req.user.id).populate('followings').populate('followers').exec((err, user) => {
			if (err) {
				console.log("something went wrong while populating user's followings", err);
			} else {
				console.log('successfully populated fields');

				res.render('user', {
					platformUser: platformUsers.slice(0, 5),
					currentUser,
					numOfFavs: req.user.favoriteNews.length,
					thunbergs,
					follower: user.followers.map(user => user.username),
					following: user.followings.map(user => user.username)
				});
			}
		});
	} catch (error) {
		console.log(error);
	}
});

module.exports = router;
