// Functions related to DOM manipulation
const updateLink = () => {
	const navLinks = [ ...document.querySelectorAll('#navbarNav .nav-link') ];
	const currentLink = document.querySelector('#navbarNav a[href="' + location.pathname + '"]');

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
	const { news, isLoggedNews, uniqueIdsApi } = await getNewsArticles();
	const { guardianNews, isLoggedGuardian, uniqueIdsGuardian, newsSaved } = await getGuardianArticles();

	let fetchedArticles;
	if (news && guardianNews) {
		fetchedArticles = [ ...news, ...guardianNews ].sort((a, b) => new Date(b.published) - new Date(a.published));
	} else {
		console.log('not able to get news', guardianNews);
		console.log('not able to get news', news);
		fetchedArticles = news
			? news.sort((a, b) => new Date(b.published) - new Date(a.published))
			: guardianNews.sort((a, b) => new Date(b.published) - new Date(a.published));
	}
	return { fetchedArticles, isLoggedNews, isLoggedGuardian, uniqueIdsGuardian, uniqueIdsApi, newsSaved };
};

const articles = [];
const populateCarousel = async () => {
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

// News date formatting
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

// Mark favorites - news page
const handleFavorites = e => {
	const pictureUrl = e.target.offsetParent.children[0].src;
	const headline = e.target.offsetParent.children[1].children[0].innerText;
	const author = e.target.offsetParent.children[1].children[1].innerText.slice(3);
	const body = e.target.offsetParent.children[1].children[2].innerText;
	const externalUrl = e.target.offsetParent.children[1].children[3].firstElementChild.href;
	const published = e.target.offsetParent.children[2].innerText.slice(13);

	axios
		.post('/favorite', {
			pictureUrl,
			headline,
			author: author.toLowerCase(),
			body,
			externalUrl,
			published,
			favorite: !e.target.classList.contains('favorite')
		})
		.then(res => {
			e.target.classList.toggle('favorite');
			e.target.previousElementSibling.innerText = e.target.classList.contains('favorite')
				? Number(e.target.previousElementSibling.innerText) + 1
				: Number(e.target.previousElementSibling.innerText) - 1;
		})
		.catch(err => console.log('something went wrong', err));
};

// News page
let loadedNews = [];
let lastLoaded,
	isLoggedNewsGlobal,
	isLoggedGuardianGlobal,
	uniqueIdsApiGlobal,
	uniqueIdsGuardianGlobal,
	newsSavedGlobal;
const populateCards = async () => {
	document.getElementById('news-container').removeChild(document.getElementById('spinner'));

	for (let i = 0; i < 6; i++) {
		let counter = newsSavedGlobal.find(news => news.externalUrl === articles[i].externalUrl)
			? newsSavedGlobal.find(news => news.externalUrl === articles[i].externalUrl).timesFavorited
			: '0';
		let isFavorite =
			uniqueIdsGuardianGlobal.includes(articles[i].externalUrl) ||
			uniqueIdsApiGlobal.includes(articles[i].externalUrl)
				? 'favorite'
				: '';

		let container = document.createElement('div');
		container.setAttribute('class', 'col-12 col-md-6 col-lg-4 pt-5');
		container.innerHTML = `<div class="card">
														<img src="${articles[i].pictureUrl}" class="card-img-top">
														<div class="card-body">
															<h5 class="card-title">${articles[i].headline}</h5>
                              <small class="card-text text-muted author">By ${articles[i].author}</small>
                              <p class="card-text pt-3">${articles[i].body}</p>
                              <div id="fav-news" class="row justify-content-between">
                                <a href="${articles[i].externalUrl}" target="blank">Read more</a>
                                <div class="btn-container ${!isLoggedGuardianGlobal || !isLoggedNewsGlobal
									? 'btn-container-hidden'
									: ''}">
                                  <p class="counter">${counter}</p>
                                  <i class="fas fa-leaf fav-btn ${isFavorite}"></i>
                                </div>
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
	document.querySelectorAll('.fav-btn').forEach(button => button.addEventListener('click', handleFavorites));
};

// Lazy load implementation
const loadCards = async () => {
	for (let i = lastLoaded + 1; i <= lastLoaded + 3; i++) {
		if (articles.length === loadedNews.length) {
			break;
		}

		let counter = newsSavedGlobal.find(news => news.externalUrl === articles[i].externalUrl)
			? newsSavedGlobal.find(news => news.externalUrl === articles[i].externalUrl).timesFavorited
			: '0';
		let isFavorite =
			uniqueIdsGuardianGlobal.includes(articles[i].externalUrl) ||
			uniqueIdsApiGlobal.includes(articles[i].externalUrl)
				? 'favorite'
				: '';

		if (!loadedNews.includes(articles[i])) {
			let container = document.createElement('div');
			container.setAttribute('class', 'col-12 col-md-6 col-lg-4 pt-5');
			container.innerHTML = `<div class="card">
														<img src="${articles[i].pictureUrl}" class="card-img-top">
														<div class="card-body">
                              <h5 class="card-title">${articles[i].headline}</h5>
                              <small class="card-text text-muted author">By ${articles[i].author}</small>
															<p class="card-text">${articles[i].body}</p>
                              <div id="fav-news" class="row justify-content-between">
                                <a href="${articles[i].externalUrl}" target="blank">Read more</a>
                                <div class="btn-container ${!isLoggedGuardianGlobal || !isLoggedNewsGlobal
									? 'btn-container-hidden'
									: ''}">
                                  <p class="counter">${counter}</p>
                                  <i class="fas fa-leaf fav-btn ${isFavorite}"></i>
                                </div>
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

	document.querySelectorAll('.fav-btn').forEach(button => button.addEventListener('click', handleFavorites));
};

// Implement back to top button
const handleArrow = () => {
	window.scrollTo(0, 0);

	document.getElementById('back-to-top').style.visibility = 'hidden';
};

// Handle fav button style
const handleBtn = () => {
	document.querySelectorAll('.user-fav').forEach(btn => {
		btn.addEventListener('mouseenter', e => {
			e.target.classList.remove('favorite');
		});
	});

	document.querySelectorAll('.user-fav').forEach(btn => {
		btn.addEventListener('mouseleave', e => {
			e.target.classList.add('favorite');
		});
	});
};

// Handle user's favorites
const handleUserFavs = e => {
	axios
		.post('/user/favs', { externalUrl: e.target.offsetParent.children[1].children[3].firstElementChild.href })
		.then(res => {
			e.target.classList.toggle('favorite');
			e.target.offsetParent.offsetParent.remove();
		})
		.catch(error => console.log(error));
};

// User's social interactions
document.querySelectorAll('.follow-btn').forEach(btn =>
	btn.addEventListener('click', async e => {
		const currentUser = e.target.offsetParent.offsetParent.getAttribute('data-currentuser');
		const id = e.target.getAttribute('data-followerid');
		console.log('user to follow ', id, 'current user ', currentUser);

		await addFollowing(id, currentUser);
	})
);

// THIS SHOULD BE MOVED TO axiosServices.js ❗️
async function removeFollowing(userToUnfollow, currentUser) {
	try {
		const response = await axios.post('/ddbb/removeFollowing', {
			userToUnfollow,
			currentUser
		});
		return response;
	} catch (error) {
		console.log(error);
	}
}

// ========================================
document.querySelectorAll('.unfollow-btn').forEach(btn => {
	btn.addEventListener('click', async e => {
		console.log(e);
		const currentUser = e.target.offsetParent.offsetParent.getAttribute('data-currentuser');
		const id = e.target.getAttribute('data-followerid');
		console.log('user to unfollow ', id, 'current user ', currentUser);

		await removeFollowing(id, currentUser);
	});
});

// Set up event listeners
document.addEventListener(
	'DOMContentLoaded',
	async () => {
		console.log('IronGenerator JS imported successfully!');
		updateLink();
		updateUvIndex();
		updateContaminationIndex();
		updateEpicPhoto();
		updateTemperature();

		if (location.pathname === '/' || location.pathname === '/news') {
			const {
				fetchedArticles,
				isLoggedNews,
				isLoggedGuardian,
				uniqueIdsGuardian,
				uniqueIdsApi,
				newsSaved
			} = await fetchNews();

			// assign value to global variables
			isLoggedNewsGlobal = isLoggedNews;
			isLoggedGuardianGlobal = isLoggedGuardian;
			uniqueIdsApiGlobal = uniqueIdsApi;
			uniqueIdsGuardianGlobal = uniqueIdsGuardian;
			newsSavedGlobal = newsSaved;

			articles.push(...fetchedArticles);
			console.log('articles fetched from APIs ', articles);
		}
		if (location.pathname === '/') {
			populateCarousel();
		}
		if (location.pathname === '/news') {
			populateCards();
		}

		document.querySelectorAll('.user-fav').forEach(btn => {
			btn.addEventListener('click', handleUserFavs);
		});

		handleBtn();
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

document.querySelectorAll('.user-detail [data-toggle="modal"]').forEach(toggle =>
	toggle.addEventListener('click', e => {
		const followingContent = document.getElementById('following');
		const followingTab = document.getElementById('following-tab');
		const followersTab = document.getElementById('followers-tab');
		const followersContent = document.getElementById('followers');

		if (e.target.id === 'following-label') {
			followingContent.classList.add('show', 'active');
			followingTab.classList.add('active');
			followingTab.setAttribute('aria-selected', true);

			followersContent.classList.remove('show', 'active');
			followersTab.classList.remove('active');
			followersTab.setAttribute('aria-selected', false);
		} else {
			followersContent.classList.add('show', 'active');
			followersTab.classList.add('active');
			followersTab.setAttribute('aria-selected', true);

			followingContent.classList.remove('show', 'active');
			followingTab.classList.remove('active');
			followingTab.setAttribute('aria-selected', false);
		}
	})
);

// NO PASAR!!!!!! NO TRESPASS!!!!!
document.getElementById('back-to-top').addEventListener('click', handleArrow);
