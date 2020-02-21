console.log("connected");

async function getNewsArticles() {
  try {
    const newsApi = await axios.get("/services/news");
    return newsApi.data.news;
  } catch (error) {
    console.log(error);
  }
}

async function getguardianArticles() {
  try {
    const guardianApi = await axios.get("/services/guardian");
    return guardianApi.data.news;
  } catch (error) {
    console.log(error);
  }
}

async function getUvIndex(lat, lng) {
  try {
    const openUvApi = await axios.get("/services/openuv", {
      params: { lat, lng }
    });
    return openUvApi.data.uv;
  } catch (error) {
    console.log(error);
  }
}

async function getContaminationIndex() {
  try {
    const airVisualApi = await axios.get("/services/air");
    return airVisualApi.data.contam;
  } catch (error) {
    console.log(error);
  }
}

async function getEpicPhoto() {
  try {
    const epicApi = await axios.get("/services/epic/lastPhoto");
    return epicApi.data.photoUrl;
  } catch (error) {
    console.log(error);
  }
}
