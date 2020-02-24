console.log('connected');

async function getNewsArticles() {
	try {
		const newsApi = await axios.get('/services/news');
		const { news, isLoggedNews, uniqueIdsApi } = newsApi.data;
		return { news, isLoggedNews, uniqueIdsApi };
	} catch (error) {
		console.log(error);
	}
}

async function getGuardianArticles() {
	try {
		const guardianApi = await axios.get('/services/guardian');
		const { guardianNews, isLoggedGuardian, uniqueIdsGuardian } = guardianApi.data;
		return { guardianNews, isLoggedGuardian, uniqueIdsGuardian };
	} catch (error) {
		console.log(error);
	}
}

async function getUvIndex(lat, lng) {
	try {
		const openUvApi = await axios.get('/services/openuv', {
			params: { lat, lng }
		});
		return openUvApi.data.uv;
	} catch (error) {
		console.log(error);
	}
}

async function getContaminationIndex() {
	try {
		const airVisualApiCont = await axios.get('/services/air');
		return airVisualApiCont.data.contam;
	} catch (error) {
		console.log(error);
	}
}

async function getTemperature() {
	try {
		const airVisualApiTemp = await axios.get('/services/temperature');
		return airVisualApiTemp.data.temp;
	} catch (error) {
		console.log(error);
	}
}

async function getEpicPhoto() {
	try {
		const epicApi = await axios.get('/services/epic/lastPhoto');
		return epicApi.data.photoUrl;
	} catch (error) {
		console.log(error);
	}
}
