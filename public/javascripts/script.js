// Implement active link in navbar
const updateLink = () => {
	const navLinks = [ ...document.querySelectorAll('#navbarNav .nav-link') ];
	const currentLink = document.querySelector('#navbarNav a[href="' + location.pathname + '"]');

	navLinks.forEach(link => link.classList.remove('active'));
	currentLink.classList.add('active');
};

// Implement back to top button
const handleArrow = () => {
	window.scrollTo(0, 0);

	document.getElementById('back-to-top').style.visibility = 'hidden';
};

// Set up event listeners
document.addEventListener(
	'DOMContentLoaded',
	async () => {
		console.log('IronGenerator JS imported successfully!');
		updateLink();

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
		}
		if (location.pathname === '/') {
			populateCarousel();
			updateUvIndex();
			updateContaminationIndex();
			updateEpicPhoto();
			updateTemperature();
		}
		if (location.pathname === '/news') {
			populateCards();
		}

		document.querySelectorAll('.user-fav').forEach(btn => {
			btn.addEventListener('click', handleUserFavs);
		});

		handleFavBtn();
	},
	false
);

// Initial set up for social buttons
document.querySelectorAll('.unfollow-btn').forEach(btn => btn.addEventListener('click', handleUnfollow));
document.querySelectorAll('.follow-btn').forEach(btn => btn.addEventListener('click', handleFollow));

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
