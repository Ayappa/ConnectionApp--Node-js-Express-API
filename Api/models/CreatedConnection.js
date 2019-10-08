const mongoose = require("mongoose");

const CreatedConnectionSchema = mongoose.Schema({
	conId: {
		type: String,
		unique: true
	},
	upVoted: {
		type: Number,
		required: true,
		minimum: 0
	},
	userId: {
		type: String,
		unique: true
	},
	title: {
		type: String,
		required: true,
	},category: {
		type: String,
		required: true,
	}
});
module.exports = mongoose.model("createdConnection", CreatedConnectionSchema);
