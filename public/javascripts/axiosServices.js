console.log('connected');

async function getNews() {
	try {
		const response = await axios.get('/services/news');
		console.log(response.data);
		return response.data;
	} catch (error) {
		console.log(error);
	}
}
