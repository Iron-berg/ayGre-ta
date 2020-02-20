const axios = require('axios');

class newsApi {
	constructor(baseURL) {
		this.baseURL = baseURL;
	}

	getNews(query, language) {
		console.log(`${this.baseURL}&q=${query}&language=${language}`);
		return axios.get(`${this.baseURL}&q=${query}&language=${language}`);
	}
}

module.exports = new newsApi(`http://newsapi.org/v2/everything?apikey=${process.env.NEWS_APIKEY}`);
