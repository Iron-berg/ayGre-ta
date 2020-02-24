const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const newsSchema = new Schema(
	{
		timesFavorited: { type: Number, default: 0 },
		headline: String,
		body: String,
		pictureUrl: String,
		author: String,
		externalUrl: String,
		published: String
	},
	{
		timestamps: true
	}
);

const News = mongoose.model('News', newsSchema);

module.exports = News;
