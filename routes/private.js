const express = require('express');
const router = express.Router();
const ensureLogin = require('connect-ensure-login');
const User = require('../models/user');

// GET user private page
router.get('/user', ensureLogin.ensureLoggedIn(), async (req, res, next) => {
	try {
		const users = await User.find().sort({ gretaPoints: -1 });
		const platformUsers = users.map((user, index) => {
			return {
				username: user.username,
				followers: user.followers,
				gretaPoints: user.gretaPoints,
				likes: user.gretaPoints > 0 ? (user.gretaPoints - user.followers) / 2 : 0,
				isCurrentUser: req.user.username === user.username ? true : false,
				isTopUser: index < 5
			};
		});

		console.log(platformUsers);
		const currentUser = platformUsers.find(user => user.username === req.user.username);

		res.render('user', { platformUser: platformUsers.slice(0, 5), currentUser });
	} catch (error) {
		console.log(error);
	}
});

module.exports = router;
