// Functions related to DOM manipulation
const updateLink = () => {
	const navLinks = [ ...document.querySelectorAll('#navbar .nav-link') ];
	const currentLink = document.querySelector('a[href="' + location.pathname + '"]');

	navLinks.forEach(link => link.classList.remove('active'));
	currentLink.classList.add('active');
};

// Home page - Data section
const updateUvIndex = async () => {
	const currentPost = await geolocation;
	let uvIndex = await getUvIndex(currentPost.latitude, currentPost.longitude);
	console.log('The UV Index is: ' + uvIndex);
	if (uvIndex === undefined) uvIndex = 1.6; // FAKE DATA... shhh

	let container = document.createElement('div');
	container.innerHTML = `<p class="legend">UV Index</p>
                         <p><img src="images/sun.png" width="50%" height="50%" align="middle" class="img-fluid" alt="Air pollution"> ${uvIndex}</p>`;

	document.getElementById('data4').appendChild(container);
};

const updateContaminationIndex = async () => {
	let contamIndex = await getContaminationIndex();
	console.log('The air pollution Index is: ' + contamIndex);
	if (contamIndex === undefined) contamIndex = 55; // FAKE DATA... shhh

	let container = document.createElement('div');
	container.innerHTML = `<p class="legend">Air Pollution</p>
                        <p><img src="images/air.png" width="50%" height="50%" align="middle" class="img-fluid" alt="Air pollution"> ${contamIndex}</p>`;
	document.getElementById('data2').appendChild(container);
};

const updateTemperature = async () => {
	let temperature = await getTemperature();
	console.log('The temperature in Celsius is: ' + temperature);
	if (temperature === undefined) temperature = 20; // FAKE DATA... shhh

	let container = document.createElement('div');
	container.innerHTML = `<p class="legend">Temperature</>
                          <p>${temperature} <img src="images/celsius.png" width="30%" height="30%" align="middle" class="img-fluid" alt="Air pollution"></p>`;
	document.getElementById('data3').appendChild(container);
};

const updateEpicPhoto = async () => {
	const urlEpic = await getEpicPhoto();
	console.log('The URL of the Earth pic is: ' + urlEpic);

	let container = document.createElement('div');
	container.innerHTML = `<img src="${urlEpic}" id="earth" class="img-fluid" alt="The Earth">`;
	document.getElementById('data1').appendChild(container);
};

// Home page - News section
const fetchNews = async () => {
	const { news, isLoggedNews } = await getNewsArticles();
	const { guardianNews, isLoggedGuardian } = await getGuardianArticles();
	let articles;
	if (news && guardianNews) {
		articles = [ ...news, ...guardianNews ].sort((a, b) => new Date(b.published) - new Date(a.published));
	} else {
		console.log('not able to get news', guardianNews);
		articles = news
			? news.sort((a, b) => new Date(b.published) - new Date(a.published))
			: guardianNews.sort((a, b) => new Date(b.published) - new Date(a.published));
	}
	return { articles, isLoggedNews, isLoggedGuardian };
};

const populateCarousel = async () => {
	const { articles } = await fetchNews();

	document.getElementById('carousel').removeChild(document.getElementById('spinner'));
	for (let i = 0; i < 5; i++) {
		let container = document.createElement('div');

		container.setAttribute('class', `carousel-item ${i === 0 ? 'active' : ''}`);
		container.innerHTML = `<div class="card text-white">
                              <div class="img-gradient">
															  <img class="d-block w-100" src="${articles[i].pictureUrl}">
                              </div>
                              <div class="carousel-caption">
                                <h4>${articles[i].headline}</h4>
                                ${i === 4 ? '<a href="/news">Discover more in our news section</a>' : ''}
													    </div>
													</div>`;

		document.getElementById('carousel').appendChild(container);
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
	const { articles, isLoggedNews, isLoggedGuardian } = await fetchNews();

	for (let i = 0; i < 6; i++) {
		let container = document.createElement('div');
		container.setAttribute('class', 'col-12 col-md-6 col-lg-4 pt-5');
		container.innerHTML = `<div class="card">
														<img src="${articles[i].pictureUrl}" class="card-img-top">
														<div class="card-body">
															<h5 class="card-title">${articles[i].headline}</h5>
                              <p class="card-text">${articles[i].body}</p>
                              <div id="fav-news" class="row justify-content-between">
                                <a href="${articles[i].externalUrl}" target="blank">Read more</a>
                                ${isLoggedNews || isLoggedGuardian ? '<i class="fas fa-leaf"></i>' : ''}
                              </div>
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
	const { articles, isLoggedNews, isLoggedGuardian } = await fetchNews();

	for (let i = lastLoaded + 1; i <= lastLoaded + 3; i++) {
		if (articles.length === loadedNews.length) {
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
                              <div id="fav-news" class="row justify-content-between">
                                <a href="${articles[i].externalUrl}" target="blank">Read more</a>
                                ${isLoggedNews || isLoggedGuardian ? '<i class="fas fa-leaf"></i>' : ''}
                              </div>
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

// Implement back to top button
const handleArrow = () => {
	window.scrollTo(0, 0);

	document.getElementById('back-to-top').style.visibility = 'hidden';
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
		updateTemperature();
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
	if (window.scrollY > document.documentElement.clientHeight) {
		document.getElementById('back-to-top').style.visibility = 'visible';
	} else {
		document.getElementById('back-to-top').style.visibility = 'hidden';
	}
});

document.getElementById('back-to-top').addEventListener('click', handleArrow);
