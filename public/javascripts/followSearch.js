let input = document.getElementById('followUser');
let logedUser = input.getAttribute('data-userid');

autocomplete({
	input: input,
	fetch: async function(text, update) {
		text = text.toLowerCase();
		let data = await getUsersByName(text);

		names = JSON.parse(data.data);

		let suggestions = names.filter(n => n.username.toLowerCase().startsWith(text));

		let newSuggestions = suggestions.map(item => {
			let user = {};
			user.label = item.username;
			user.value = item._id;
			return user;
		});

		update(newSuggestions);
	},
	onSelect: async function(item) {
		input.value = item.label;

		let res = await addFollowing(item.value, logedUser);
		$('#followUser').val('');

		// update leaderboard upon following user
		const leaderboardResponse = await updateLeaderboard();
		document.querySelector('.ranking-section').innerHTML = leaderboardResponse.data;

		// update social counters when following new user
		const socialCountersResponse = await updateSocialCounters();
		document.querySelector('.social-counters').innerHTML = socialCountersResponse.data;

		// update thunberg board when following new user
		const response = await getUserThunbergs(logedUser);
		document.querySelector('#thunbergsboard').innerHTML = response.data;

		if (res.data.status == 'ko') {
			document.getElementById('follow-message-ko').style.display = 'block';
			document.getElementById('message-alert-ko').innerHTML = res.data.msg;
			window.setTimeout(function() {
				document.getElementById('follow-message-ko').style.display = 'none';
			}, 2000);
		}

		if (res.data.status == 'ok') {
			document.getElementById('follow-message-ok').style.display = 'block';
			document.getElementById('message-alert-ok').innerHTML = res.data.msg;
			window.setTimeout(function() {
				document.getElementById('follow-message-ok').style.display = 'none';
			}, 2000);
		}

		// update modal when following new user
		const modalResponse = await getUsersFriends(logedUser);
		const modal = document.getElementById('modal');
		modal.remove();
		document.querySelector('.main-section').insertAdjacentHTML('beforeend', modalResponse.data);
		document.querySelectorAll('.follow-btn').forEach(btn => btn.addEventListener('click', handleFollow));
		document.querySelectorAll('.unfollow-btn').forEach(btn => btn.addEventListener('click', handleUnfollow));
		resetModalListeners();
		closeModal();
	}
});
