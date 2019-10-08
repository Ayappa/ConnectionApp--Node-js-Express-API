const mongoose = require("mongoose");

const statusSchema = mongoose.Schema({
	conId: {
		type: String,
		required: true
	},
	userId: {
		type: String,
		required: true
	},
	flag: {
		type: String,
		required: true
	}
});

module.exports = mongoose.model("Status", statusSchema);
