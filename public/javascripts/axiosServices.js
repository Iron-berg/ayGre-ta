console.log("connected");

async function getNewsArticles() {
  try {
    const newsApi = await axios.get("/services/news");
    return newsApi.data.news;
  } catch (error) {
    console.log(error);
  }
}

async function getGuardianArticles() {
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
    const airVisualApiCont = await axios.get("/services/air");
    return airVisualApiCont.data.contam;
  } catch (error) {
    console.log(error);
  }
}

async function getTemperature() {
  try {
    const airVisualApiTemp = await axios.get("/services/temperature");
    return airVisualApiTemp.data.temp;
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

async function getUsersByName(name) {
  try {
    const users = await axios.get("/ddbb/findUsersByName/" + name);
    return users;
  } catch (error) {
    console.log(error);
  }
}

async function addFollowing(following, currentUser) {
  try {
    const response = await axios.get("/ddbb/addFollowing", {
      params: { following, currentUser }
    });
    return response;
  } catch (error) {
    console.log(error);
  }
}

async function postThunberg(message, author) {
  try {
    const response = await axios.post("/ddbb/postThunberg", {
      message,
      author
    });
    return response;
  } catch (error) {
    console.log(error);
  }
}
