// Functions related to DOM manipulation
const updateLink = () => {
  const navLinks = [...document.querySelectorAll("#navbar .nav-link")];
  const currentLink = document.querySelector(
    'a[href="' + location.pathname + '"]'
  );
  navLinks.forEach(link => link.classList.remove("active"));
  if (location.pathname !== "/") {
    currentLink.classList.add("active");
  }
};

// Home page - Data section
const updateUvIndex = async () => {
  const currentPost = await geolocation;
  const uvIndex = await getUvIndex(currentPost.latitude, currentPost.longitude);
  console.log("The UV Index is: " + uvIndex);
  // HERE GOES DOM MANIPULATION
};

const updateContaminationIndex = async () => {
  const contamIndex = await getContaminationIndex();
  console.log("The air pollution Index is: " + contamIndex);
  // HERE GOES DOM MANIPULATION
};

const updateEpicPhoto = async () => {
  const urlEpic = await getEpicPhoto();
  console.log("The URL of the Earth pic is: " + urlEpic);
  // HERE GOES DOM MANIPULATION
};

// Home page - News section
const fetchNews = async () => {
	const articlesApi = await getNewsArticles();
	const articlesGuardian = await getGuardianArticles();
	return [ ...articlesApi, ...articlesGuardian ].sort((a, b) => new Date(b.published) - new Date(a.published));
};

const populateCarousel = async () => {
	const articles = await fetchNews();
	for (let i = 0; i < 5; i++) {
		let container = document.createElement('div');

    container.setAttribute("class", `carousel-item ${i === 0 ? "active" : ""}`);
    container.innerHTML = `<div class="card text-white">
															<img class="d-block w-100" src="${articles[i].pictureUrl}">
															<div class="carousel-caption">
																<h4>${articles[i].headline}</h4>
															</div>
													</div>`;
    document.getElementById("carousel").appendChild(container);
  }
};

// News page
const formatDate = date => {
	const Months = [
		'January',
		'February',
		'March',
		'April',
		'May',
		'June',
		'July',
		'August',
		'September',
		'October',
		'November',
		'December'
	];
	const dateStr = new Date(date);
	const month = Months[dateStr.getUTCMonth()];
	const day = dateStr.getUTCDate();
	const year = dateStr.getUTCFullYear();

	return `Published on ${month} ${day}, ${year}`;
};

let loadedNews = [];
let lastLoaded;
const populateCards = async () => {
	const articles = await fetchNews();
	for (let i = 0; i < 6; i++) {
		let container = document.createElement('div');
		container.setAttribute('class', 'col-12 col-md-6 col-lg-4 pt-5');
		container.innerHTML = `<div class="card">
														<img src="${articles[i].pictureUrl}" class="card-img-top">
														<div class="card-body">
															<h5 class="card-title">${articles[i].headline}</h5>
															<p class="card-text">${articles[i].body}</p>
															<a href="${articles[i].externalUrl}" target="blank">Read more</a>
														</div>
														<div class="card-footer">
															<small>${formatDate(articles[i].published)}</small>
														</div>
													</div>`;
		document.getElementById('news').appendChild(container);

		loadedNews.push(articles[i]);
		lastLoaded = articles.indexOf(articles[i]);
	}
};

// News page - lazy load implementation
const loadCards = async () => {
	const articles = await fetchNews();
	for (let i = lastLoaded + 1; i <= lastLoaded + 3; i++) {
		if (articles.length === loadedNews.length) {
			console.log('everything is loaded');
			break;
		}
		if (!loadedNews.includes(articles[i])) {
			let container = document.createElement('div');
			container.setAttribute('class', 'col-12 col-md-6 col-lg-4 pt-5');
			container.innerHTML = `<div class="card">
														<img src="${articles[i].pictureUrl}" class="card-img-top">
														<div class="card-body">
															<h5 class="card-title">${articles[i].headline}</h5>
															<p class="card-text">${articles[i].body}</p>
															<a href="${articles[i].externalUrl}" target="blank">Read more</a>
														</div>
														<div class="card-footer">
															<small>${formatDate(articles[i].published)}</small>
														</div>
													</div>`;
			document.getElementById('news').appendChild(container);

			loadedNews.push(articles[i]);
		}
	}
	lastLoaded = articles.indexOf(loadedNews[loadedNews.length - 1]);
};

// Set up event listeners
document.addEventListener(
	'DOMContentLoaded',
	() => {
		console.log('IronGenerator JS imported successfully!');
		updateLink();
    updateUvIndex();
    updateContaminationIndex();
    updateEpicPhoto();
		if (location.pathname === '/') {
			populateCarousel();
		}
		if (location.pathname === '/news') {
			populateCards();
		}
	},
	false
);

window.addEventListener('scroll', () => {
	if (window.innerHeight + window.scrollY >= document.body.clientHeight) {
		loadCards();
	}
});
