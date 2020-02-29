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
	console.log('user to follow ', id, 'current user ', currentUser);

	await addFollowing(id, currentUser);

	const modalResponse = await getUsersFriends(currentUser);
	const modal = document.getElementById('modal');
	modal.remove();
	document.querySelector('.main-section').insertAdjacentHTML('beforeend', modalResponse.data);

	const followingDiplay = document.querySelector('.following-counter');
	followingDiplay.innerHTML = ` <h3 class="following-counter">${Number(followingDiplay.innerText) +
		1} <i class="fas fa-user-check"></i></h3>`;

	// reset event listeners
	document.querySelectorAll('.follow-btn').forEach(btn => btn.addEventListener('click', handleFollow));
	document.querySelectorAll('.unfollow-btn').forEach(btn => btn.addEventListener('click', handleUnfollow));
};

const handleUnfollow = async e => {
	const currentUser = e.target.offsetParent.offsetParent.getAttribute('data-currentuser');
	const id = e.target.getAttribute('data-followerid');
	console.log('user to unfollow ', id, 'current user ', currentUser);

	await removeFollowing(id, currentUser);

	const modalResponse = await getUsersFriends(currentUser);
	const modal = document.getElementById('modal');
	modal.remove();

	document.querySelector('.main-section').insertAdjacentHTML('beforeend', modalResponse.data);

	const followingDiplay = document.querySelector('.following-counter');
	followingDiplay.innerHTML = ` <h3 class="following-counter">${Number(followingDiplay.innerText) -
		1} <i class="fas fa-user-check"></i></h3>`;

	// reset event listeners
	document.querySelectorAll('.follow-btn').forEach(btn => btn.addEventListener('click', handleFollow));
	document.querySelectorAll('.unfollow-btn').forEach(btn => btn.addEventListener('click', handleUnfollow));
};
