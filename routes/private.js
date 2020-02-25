const express = require('express');
const router = express.Router();
const ensureLogin = require('connect-ensure-login');
const User = require('../models/user');

// GET user private page
router.get('/user', ensureLogin.ensureLoggedIn(), async (req, res, next) => {
	try {
		const users = await User.find();
		const platformUsers = users
			.map(user => {
				return {
					username: user.username,
					followers: user.followers,
					gretaPoints: user.gretaPoints,
					likes: user.gretaPoints > 0 ? (user.gretaPoints - user.followers) / 2 : 0,
					isCurrentUser: req.user.username === user.username ? true : false
				};
			})
			.sort((a, b) => b.gretaPoints - a.gretaPoints);

		res.render('user', { platformUser: platformUsers });
	} catch (error) {
		console.log(error);
	}
});

module.exports = router;
