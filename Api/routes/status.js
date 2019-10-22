const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const Status = require("../models/Status");
const auth = require("../middleware/auth");

router.post(
	"/",
	[
		auth,
		check("conId", "conId is equiredr")
			.not()
			.isEmpty(),
		check("flag", "status is equiredr")
			.not()
			.isEmpty()
	],
	(req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			console.log("inside validation error");
			return res.status(400).json({ errors: errors.array() });
		}
		if (res) {
			const { conId, flag } = req.body;
			Status.findOne({ userId: req.user.id, conId }, (err, post) => {
				console.log("inside findOne ");

				if (post) {
					if (post.flag === flag) {
						console.log("inside post present ==" + post.flag);
						console.log("inside post present 1==" + flag);

						return res.json({
							msg: "Your hav already showed your response as " + flag,
							status: post.flag
						});
					} else {
						console.log("inside post not  present ");
						console.log("inside post present ==" + post.flag);
						console.log("inside post present 1==" + flag);
						Status.findOneAndUpdate(
							{ userId: req.user.id, conId, flag: post.flag },
							{ $set: { userId: req.user.id, conId, flag } },
							(erro, updated) => {
								if (updated) {
									return res.json({
										msg: "Your hav changed your  response as " + flag,
										status: post.flag
									});
								} else {
									return res.json({
										msg: erro
									});
								}
							}
						);
					}
				} else {
					console.log("inside err present ");

					connectionstatus = new Status({ conId, userId: req.user.id, flag });
					connectionstatus.save(erro => {
						if (!erro) {
							console.log("inside not err of err present ");

							return res.json({ msg: "your response noted" });
						} else {
							return res.status(400).json(erro);
						}
					});
				}
			});
		}
	}
);

router.delete(
	"/",
	[
		auth,
		check("conId", "conId is equiredr")
			.not()
			.isEmpty()
	],
	(req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			console.log("inside validation error");
			return res.status(400).json({ errors: errors.array() });
		}
		if (res) {
			const { conId } = req.body;
			console.log("inside validation error=" + conId);
			console.log("inside validation userId=" + req.user.id);

			Status.findOneAndRemove({ conId, userId: req.user.id }, err => {
				if (!err) {
					return res.json({ msg: "deleted all status" });
				} else {
					return res.status(400).json(err);
				}
			});
		}
	}
);
module.exports = router;
