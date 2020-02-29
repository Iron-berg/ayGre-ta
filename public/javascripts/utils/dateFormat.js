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
