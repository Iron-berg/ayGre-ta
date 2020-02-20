const axios = require('axios');

class newsService {
	constructor(baseURL) {
		this.baseURL = baseURL;
	}

	getNews(query) {
		console.log(`${this.baseURL}&q=${query}`);
		return axios.get(`${this.baseURL}&q=${query}`);
	}
}

const newsAPI = new newsService(`http://newsapi.org/v2/everything?apikey=${process.env.NEWS_APIKEY}`);
const guardianAPI = new newsService(`https://content.guardianapis.com/search?api-key=${process.env.GUARDIAN_APIKEY}`);

module.exports = { newsAPI, guardianAPI };
