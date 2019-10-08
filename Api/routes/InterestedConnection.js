const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const InterestedConnection = require("../models/IntrestedConnection");
const auth = require("../middleware/auth");

router.get("/", auth, (req, res) => {
	if (res) {
		InterestedConnection.find({}, (err, posts) => {
			return res.json(posts);
		});
	} else {
		return res.status(400).json(err);
	}
});

router.post(
	"/",
	[
		auth,
		check("conId", "Please include a valid connectionID")
			.not()
			.isEmpty(),
		check("title", "Please include a valid number of title")
			.not()
			.isEmpty(),
		check("category", "Please include a valid number of category")
			.not()
			.isEmpty(),
		check("status", "Please include a valid status")
			.not()
			.isEmpty()
	],
	(req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}
		const { conId, title, category, status } = req.body;
		interestedConnection = new InterestedConnection({
			conId,
			title,
			category,
			userId: req.user.id,
			status
		});

		interestedConnection.save(err => {
			if (!err) {
				res.json({ msg: "added one Createdconnection" });
			} else {
				return res.status(400).json({ msg: err });
			}
		});
	}
);

router.put(
	"/",
	[
		auth,
		check("status", "Please include a valid status")
			.not()
			.isEmpty()
	],
	(req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}
		const { conId, status } = req.body;
		InterestedConnection.findOneAndUpdate(
			{ conId, userId: req.user.id },
			{ $set: { status: status } },
			(err, itemList) => {
				if (itemList) {
					console.log(itemList);
					return res.send({ msg: "changed status" });
				} else {
					return res.send({ msg: "err" });
				}
			}
		);
	}
);

router.get(
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
		InterestedConnection.findOne(
			{ conId, userId: req.user.id },
			(err, item) => {
				if (item) {
					return res.json({ status: item.status });
				} else {
					return res.status(400).json({ msg: "Connection Doesnt Exist" });
				}
			}
		);
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
		InterestedConnection.findOneAndRemove({ conId: conId }, err => {
			if (!err) {
				return res.json({ msg: "deleted one conection created by user" });
			} else {
				return res.status(400).json({ errors: err });
			}
		});
	}
);

module.exports = router;
