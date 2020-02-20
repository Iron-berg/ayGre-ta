console.log('connected');

async function getNewsArticles() {
	try {
		const newsApi = await axios.get('/services/news');
		// console.log(newsApi.data.news);
		return newsApi.data.news;
	} catch (error) {
		console.log(error);
	}
}
