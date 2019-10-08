const mongoose = require("mongoose");

const ConnectionSchema = mongoose.Schema({
	name: {
		type: String,
		required: true
	},
	title: {
		type: String,
		required: true
	},
	category: {
		type: String,
		required: true
	},
	address: {
		type: String,
		required: true
	},
	date: {
		type: String,
		required: true
	},
	timeFrom: {
		type: String,
		required: true
	},
	timeTo: {
		type: String,
		required: true
	},
	description: {
		type: String,
		required: true
	},
	userId: {
		type: String,
		required: true
	}
});

module.exports = mongoose.model("connection", ConnectionSchema);
