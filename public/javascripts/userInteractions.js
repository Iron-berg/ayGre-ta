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

// Handle fav button style
const handleFavBtn = () => {
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
const closeModal = () => {
	const modal = document.querySelector('.modal');
	modal.classList.remove('show');
	modal.style.display = 'none';
	document.body.classList.remove('modal-open');
	document.querySelector('.modal-backdrop').remove();
};

const handleFollow = async e => {
	const currentUser = e.target.offsetParent.offsetParent.getAttribute('data-currentuser');
	const id = e.target.getAttribute('data-followerid');

	await addFollowing(id, currentUser);

	const modalResponse = await getUsersFriends(currentUser);
	const modal = document.getElementById('modal');
	modal.remove();
	document.querySelector('.main-section').insertAdjacentHTML('beforeend', modalResponse.data);

	const followingDisplay = document.querySelector('.following-counter');
	followingDisplay.innerHTML = ` <h3 class="following-counter">${Number(followingDisplay.innerText) +
		1} <i class="fas fa-user-check"></i></h3>`;

	// update leaderboard when following new user
	console.log('following, update leaderboard');
	const leaderboardResponse = await updateLeaderboard();
	console.log(leaderboardResponse.data);
	document.querySelector('.ranking-section').innerHTML = leaderboardResponse.data;

	// reset event listeners
	document.querySelectorAll('.follow-btn').forEach(btn => btn.addEventListener('click', handleFollow));
	document.querySelectorAll('.unfollow-btn').forEach(btn => btn.addEventListener('click', handleUnfollow));
};

const handleUnfollow = async e => {
	const currentUser = e.target.offsetParent.offsetParent.getAttribute('data-currentuser');
	const id = e.target.getAttribute('data-followerid');
	console.log(e);

	await removeFollowing(id, currentUser);

	const modalResponse = await getUsersFriends(currentUser);
	const modal = document.getElementById('modal');
	modal.remove();

	document.querySelector('.main-section').insertAdjacentHTML('beforeend', modalResponse.data);

	const followingDisplay = document.querySelector('.following-counter');
	followingDisplay.innerHTML = ` <h3 class="following-counter">${Number(followingDisplay.innerText) -
		1} <i class="fas fa-user-check"></i></h3>`;

	if (e.target.classList.contains('following-tab')) {
		const followingTab = document.getElementById('following-tab');
		const followersTab = document.getElementById('followers-tab');

		// keep following tab open in case it was open before clicking
		document.getElementById('following').classList.add('show', 'active');
		followingTab.classList.add('active');
		followingTab.setAttribute('aria-selected', true);

		document.getElementById('followers').classList.remove('show', 'active');
		followersTab.classList.remove('active');
		followersTab.setAttribute('aria-selected', false);
	}

	// update leaderboard when unfollowing user
	console.log('following, update leaderboard');
	const leaderboardResponse = await updateLeaderboard();
	console.log(leaderboardResponse.data);
	document.querySelector('.ranking-section').innerHTML = leaderboardResponse.data;

	// reset event listeners
	document.querySelectorAll('.follow-btn').forEach(btn => btn.addEventListener('click', handleFollow));
	document.querySelectorAll('.unfollow-btn').forEach(btn => btn.addEventListener('click', handleUnfollow));
};
