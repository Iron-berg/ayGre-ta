console.log('connected');

async function getNewsArticles() {
	try {
		const newsApi = await axios.get('/services/news');
		return newsApi.data.news;
	} catch (error) {
		console.log(error);
	}
}

async function getGuardianArticles() {
	try {
		const guardianApi = await axios.get('/services/guardian');
		return guardianApi.data.news;
	} catch (error) {
		console.log(error);
	}
}
