const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const CreatedConnections = require("../models/CreatedConnection");
const auth = require("../middleware/auth");

router.get("/", auth, (req, res) => {
	if (res) {
		console.log(res);
		//	const { userId } = req.body;
		CreatedConnections.find({ userId: req.user.id }, (err, post) => {
			return res.json(post);
		});
	} else {
		return res.status(400).json(err);
	}
	("{");
});

router.post(
	"/",
	[
		auth,
		check("conId", "Please include a valid connectionID")
			.not()
			.isEmpty(),
		check("upVoted", "Please include a valid number of upVotes")
			.not()
			.isEmpty()
	],
	(req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}
		const userId = req.user.id;
		const { conId, upVoted,title,category } = req.body;
		createdConnection = new CreatedConnections({ conId, upVoted, userId ,title,category});
		createdConnection.save(err => {
			if (!err) {
				res.json({ msg: "added one Createdconnection" });
			} else {
				return res.status(400).json({ errors: err });
			}
		});
	}
);

router.put(
	"/",
	[
		auth,
		check("conId", "Please include a valid connectionID")
			.not()
			.isEmpty()
	],
	(req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}
		const userId = req.user.id;
		const { conId, status } = req.body;
		if (status === "Yes") {
			CreatedConnections.findOneAndUpdate(
				{ conId },

				{ $inc: { upVoted: 1 } },
				(err, itemList) => {
					if (itemList) {
						console.log(itemList);
						return res.send({ msg: "incremented one" });
					} else {
						return res.send({ msg: "no updates" });
					}
				}
			);
		} else if (status === "No") {
			CreatedConnections.findOneAndUpdate(
				{ conId },

				{ $inc: { upVoted: -1 } },
				(err, itemList) => {
					if (itemList) {
						console.log(itemList);
						return res.send({ msg: "decremented one" });
					} else {
						return res.send({ msg: "no updates" });
					}
				}
			);
		}
	}
);

router.delete(
	"/",
	[
		auth,
		check("conId", "Please include a valid connectionID")
			.not()
			.isEmpty()
	],
	(req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}

		const { conId } = req.body;
		CreatedConnections.findOneAndRemove({ conId: conId }, err => {
			if (!err) {
				return res.json({ msg: "deleted one conection created by user" });
			}
		});
	}
);

router.post(
	"/getOne",
	[
		auth,
		check("conId", "Please include a valid connectionID")
			.not()
			.isEmpty()
	],
	(req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}

		const { conId } = req.body;
		CreatedConnections.findOne({ conId }, (err, item) => {
			if (item) {
				return res.json({ item: item });
			} else {
				return res.status(400).json({ msg: "Connection Doesnt Exist" });
			}
		});
	}
);
module.exports = router;
