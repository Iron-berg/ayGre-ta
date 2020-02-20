const express = require('express');
const router = express.Router();
const newsService = require('../services/newsService');

router.get('/services/news', async (req, res, next) => {
	try {
		const news = await newsService.getNews('"greta%20thunberg"OR"climate%20change"', 'en');
		const articles = news.data.articles.map(article => article);
		res.json({ articles });
	} catch (error) {
		console.log(error);
	}
});

module.exports = router;
