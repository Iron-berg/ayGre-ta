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

async function getguardianArticles() {
	try {
		const guardianApi = await axios.get('/services/guardian');
		// console.log(guardianApi.data.news);
		return guardianApi.data.news;
	} catch (error) {
		console.log(error);
	}
}
