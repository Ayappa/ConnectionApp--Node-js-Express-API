// conId: 3,
// 		status: "Going",
// 		title: "Micro-Organisome",
// 		category: "Studies"
const mongoose = require("mongoose");

const IntrestedConnectionSchema = mongoose.Schema({
	conId: {
		type: String
	},

	title: {
		type: String,
		required: true
	},
	category: {
		type: String,
		required: true
	},
	userId: {
		type: String,
		required: true
	},
	status: {
		type: String
	}
});

module.exports = mongoose.model(
	"interestedConnection",
	IntrestedConnectionSchema
);
