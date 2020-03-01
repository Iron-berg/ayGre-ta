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
const resetModalListeners = () => {
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
};

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

	// update social counters when following new user
	const socialCountersResponse = await updateSocialCounters();
	document.querySelector('.social-counters').innerHTML = socialCountersResponse.data;

	// update leaderboard when following new user
	const leaderboardResponse = await updateLeaderboard();
	document.querySelector('.ranking-section').innerHTML = leaderboardResponse.data;

	// update thunberg board when following new user
	const response = await getUserThunbergs(currentUser);
	document.querySelector('#thunbergsboard').innerHTML = response.data;

	// reset event listeners
	document.querySelectorAll('.follow-btn').forEach(btn => btn.addEventListener('click', handleFollow));
	document.querySelectorAll('.unfollow-btn').forEach(btn => btn.addEventListener('click', handleUnfollow));
	resetModalListeners();
};

const handleUnfollow = async e => {
	const currentUser = e.target.offsetParent.offsetParent.getAttribute('data-currentuser');
	const id = e.target.getAttribute('data-followerid');

	await removeFollowing(id, currentUser);

	const modalResponse = await getUsersFriends(currentUser);
	const modal = document.getElementById('modal');
	modal.remove();

	document.querySelector('.main-section').insertAdjacentHTML('beforeend', modalResponse.data);

	// update social counters when unfollowing  user
	const socialCountersResponse = await updateSocialCounters();
	document.querySelector('.social-counters').innerHTML = socialCountersResponse.data;

	// update thunberg board when following new user
	const response = await getUserThunbergs(currentUser);
	document.querySelector('#thunbergsboard').innerHTML = response.data;

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
	const leaderboardResponse = await updateLeaderboard();
	document.querySelector('.ranking-section').innerHTML = leaderboardResponse.data;

	// reset event listeners
	document.querySelectorAll('.follow-btn').forEach(btn => btn.addEventListener('click', handleFollow));
	document.querySelectorAll('.unfollow-btn').forEach(btn => btn.addEventListener('click', handleUnfollow));
	resetModalListeners();
};
