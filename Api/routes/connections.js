const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const Connections = require("../models/Connections");
const auth = require("../middleware/auth");

router.get("/", auth, (req, res) => {
	if (res) {
		Connections.find({}, (err, posts) => {
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
		check("title", "title is equiredr")
			.not()
			.isEmpty(),
		check("category", "category is equiredr")
			.not()
			.isEmpty(),
		check("address", "address is equiredr")
			.not()
			.isEmpty(),
		check("date", "date is required")
			.not()
			.isEmpty(),
		check("timeFrom", "timeFrom is equiredr")
			.not()
			.isEmpty(),
		check("description", "City is equiredr")
			.not()
			.isEmpty(),
		check("timeTo", "timeTo is equiredr")
			.not()
			.isEmpty()
	],
	(req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}
		if (res) {
			const userId = req.user.id;
			console.log("user id==" + userId);
			const {
				name,
				title,
				category,
				address,
				date,
				timeFrom,
				timeTo,
				description
			} = req.body;

			connection = new Connections({
				name,
				title,
				category,
				address,
				date,
				timeFrom,
				timeTo,
				description,
				userId: userId
			});
			Connections.find(
				{
					title,
					category,
					address,
					date,
					timeFrom,
					timeTo,
					description,
					userId: userId
				},
				(err, items) => {
					if (items.length > 0) {
						console.log("find of create connection==" + userId);

						res.json({ msg: "Connection already Exists By You" });
					} else {
						connection.save(error => {
							if (!error) {
								console.log("find of create connection not error==" + userId);

								res.json({
									msg: "added one connection",
									conId: connection._id
								});
							} else {
								console.log("find of create connection  error==" + userId);

								res.json({ msg: error });
							}
						});
					}
				}
			);
		} else {
			console.log("inside error id==" + req.user.id);
			res.json({ msg: "something wromg" });
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
		console.log("comId==" + conId);
		Connections.findByIdAndRemove({ _id: conId }, err => {
			if (!err) {
				return res.json({ msg: "deleted one conection " });
			} else {
				return res.status(400).json({ errors: err });
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
		console.log("comId==" + conId);
		Connections.findById({ _id: conId }, (err, item) => {
			if (item) {
				console.log("insid eitem id1=" + conId);

				return res.json({ item: item });
			} else {
				console.log("insid err eitem id1=" + conId);

				return res.status(400).json({ msg: "Connection Doesnt Exist" });
			}
		});
	}
);

module.exports = router;
