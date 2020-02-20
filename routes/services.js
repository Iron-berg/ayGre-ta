const express = require('express');
const router = express.Router();
const { newsAPI, guardianAPI } = require('../services/newsService');

router.get('/services/news', async (req, res, next) => {
	try {
		const news = await newsAPI.getNews('"greta%20thunberg"OR"climate%20change"OR"environment"&language=en');
		res.json({ news: news.data.articles });
	} catch (error) {
		console.log(error);
	}
});

router.get('/services/guardian', async (req, res, next)=>{
	try {
		const news = await guardianAPI.getNews('&section=environment&q="climate%20change"&page-size=20&show-fields=headline,byline,thumbnail,bodyText,trailText')
		res.json({news: news.data.response.results})
	}catch(error){
		console.log(error)
	}
})

module.exports = router;
