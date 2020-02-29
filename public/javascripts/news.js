// Home page - News section
const articles = []; //global variable; holds news from APIs

const fetchNews = async () => {
	const { news, isLoggedNews, uniqueIdsApi } = await getNewsArticles();
	const { guardianNews, isLoggedGuardian, uniqueIdsGuardian, newsSaved } = await getGuardianArticles();
	let fetchedArticles;
	if (news && guardianNews) {
		fetchedArticles = [ ...news, ...guardianNews ].sort((a, b) => new Date(b.published) - new Date(a.published));
	} else {
		fetchedArticles = news
			? news.sort((a, b) => new Date(b.published) - new Date(a.published))
			: guardianNews.sort((a, b) => new Date(b.published) - new Date(a.published));
	}

	return {
		fetchedArticles: fetchedArticles.map(news => ({ ...news, author: news.author ? news.author : 'unknown' })),
		isLoggedNews,
		isLoggedGuardian,
		uniqueIdsGuardian,
		uniqueIdsApi,
		newsSaved
	};
};

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
			: '0'; //set counter news saved in database to the number of favorites and to 0 otherwise
		let isFavorite =
			uniqueIdsGuardianGlobal.includes(articles[i].externalUrl) ||
			uniqueIdsApiGlobal.includes(articles[i].externalUrl)
				? 'favorite'
				: ''; //check whether news has been favorited by current user and set required class

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

	// set up event listener
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

	// set up event listener
	document.querySelectorAll('.fav-btn').forEach(button => button.addEventListener('click', handleFavorites));
};
