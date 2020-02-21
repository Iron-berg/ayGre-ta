const express = require('express');
const router = express.Router();
const { newsAPI, guardianAPI } = require('../services/newsService');

router.get('/services/news', async (req, res, next) => {
	try {
		const apiResponse = await newsAPI.getNews('"greta%20thunberg"OR"climate%20change"OR"environment"&language=en');
		
		const news = apiResponse.data.articles.map(article => {
			return {
				headline: article.title,
				body: article.description,
				pictureUrl: article.urlToImage,
				author: article.author,
				externalUrl: article.url,
				published: article.publishedAt
			};
		});

		res.json({ news });
	} catch (error) {
		console.log(error);
	}
});

router.get('/services/guardian', async (req, res, next) => {
	try {
		const guardianResponse = await guardianAPI.getNews(
			'&section=environment&q="climate%20change"&page-size=20&show-fields=headline,byline,thumbnail,bodyText,trailText'
		);

		const news = guardianResponse.data.response.results.map(article => {
			return {
				headline: article.fields.headline,
				body: article.fields.trailText,
				pictureUrl: article.fields.thumbnail,
				author: article.fields.byline,
				externalUrl: article.webUrl,
				published: article.webPublicationDate
			};
		});

		res.json({ news });
	} catch (error) {
		console.log(error);
	}
});

module.exports = router;
