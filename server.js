const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const pathName = path.join(__dirname, "../assets/");
var app = express();
const ArrayList = require("arraylist");
const querystring = require("querystring");
var User = require("./models/User");
var NewConnection = require("./models/NewConnection");
const appJs = require("./app");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.set("view engine", "ejs");
//app.use("../assets", express.static(path.join(__dirname, "../assets/")));
//app.use(express.static(pathName));
app.use(express.static(path.join(__dirname, "public")));
var newConnection = require("./models/NewConnection");
// var savedConnection = new ArrayList();
var conectionDetail;
var session = require("express-session");
app.set("trust proxy", true); // trust first proxy

app.use(
	session({
		name: "Session",
		resave: false,
		saveUninitialized: true,
		secret: "aaedsvsdbtetgbtae",
		cookie: {
			maxAge: 1000 * 60 * 60,
			sameSite: true,
			secure: false
		}
	})
);

// const UsersAccount = [
// 	{ id: 1, name: "alex", email: "kaikai9500@gmail.com", password: "123" },
// 	{ id: 2, name: "max", email: "max@gmail.com", password: "secret" },
// 	{ id: 3, name: "haggwe", email: "haggwe@gmail.com", password: "secret" }
// ];

const redirectLogin = (req, res, next) => {
	if (!req.session.token) {
		res.redirect("/");
		console.log(req.session.token);
	} else {
		console.log("valid");

		next();
	}
};

app.get("/logout", (req, res) => {
	req.session.destroy();
	// const { userId } = req.session;
	// console.log(userId);
	res.redirect("/");
});

app.get("/", (req, res) => {
	var nav = ["SignUp"];
	var subNav = ["Home"];
	// const { userId } = req.session;
	// console.log(userId);
	res.render("login.ejs", { nav, subNav, flag: 0 });
});

app.post("/", (req, res) => {
	var nav = ["SignUp"];
	var subNav = ["Home"];
	console.log(req.body);
	const {
		first_name,
		last_name,
		email,
		password,
		passwordConfirm,
		city,
		Dob,
		Gender
	} = req.body;
	appJs
		.registerUser(
			first_name,
			last_name,
			email,
			password,
			passwordConfirm,
			city,
			Dob,
			Gender
		)
		.then(
			({ token, Uid, person }) => {
				req.session.token = token;
				req.session.uId = Uid;
				req.session.name = person;
				req.session.del = 0;
				console.log("registered a new user with token=");
				console.log(token);

				req.session.token = token;
				return res.redirect("/home");
			},
			errMessage => {
				console.log(errMessage);
				return res.redirect("/");
			}
		);
});

app.get("/home", redirectLogin, (req, res) => {
	var nav = ["Start a new connection", "logOut"];
	var subNav = [
		"Home",
		"Connections",
		"ConnectionsDetail",
		"ConnectionsCreated"
	];
	const { userId } = req.session;
	console.log(userId);
	var tostLogin;
	console.log("Toastttttttttttt=" + req.session.login);

	if (req.session.login === 0) {
		console.log("iside if ontain" + req.session.login);

		tostLogin = req.session.login;
		req.session.login = 1;
	} else {
		tostLogin = 1;
		console.log("iside if not contains" + tostLogin);
	}
	res.render("index.ejs", { nav, subNav, tostLogin, name: req.session.name });
});

app.post("/home", (req, res) => {
	//console.log(req.body);
	var nav = ["Start a new connection", "logOut"];
	var subNav = [
		"Home",
		"Connections",
		"ConnectionsDetail",
		"ConnectionsCreated"
	];

	const { email, password } = req.body;
	//

	appJs
		.login(email, password)
		.then(({ token, Uid, person }) => {
			req.session.token = token;
			req.session.uId = Uid;
			req.session.name = person;
			req.session.del = 0;
			console.log("token in session=" + token);
			console.log("Uid in session=" + Uid);
			console.log("user name in session=" + person);
			req.session.login = 0;
			console.log("Toastttttttttttt=" + req.session.login);
			res.render("index.ejs", { nav, subNav, flag: 0 });
		})
		.catch(msg => {
			var nav = ["SignUp"];
			var subNav = ["Home"];
			res.render("login.ejs", { nav, subNav, flag: 1 });
		});
});

app.get("/connections", (req, res) => {
	var nav = ["Start a new connection", "logOut"];
	var subNav = [
		"Home",
		"Connections",
		"ConnectionsDetail",
		"ConnectionsCreated"
	];
	//console.log("inside GET of connection" + connectionList.length);
	appJs.getConnectionList(req.session.token).then(connectionList => {
		res.render("connections.ejs", { connectionList, nav, subNav, flag: 0 });
	});
});

app.post("/connections", (req, res) => {
	var nav = ["Start a new connection", "logOut"];
	var subNav = [
		"Home",
		"Connections",
		"ConnectionsDetail",
		"ConnectionsCreated"
	];
	const {
		title,
		category,
		address,
		date,
		timeFrom,
		timeTo,
		description
	} = req.body;
	appJs
		.newConnection(
			req.session.name,
			req.session.token,
			title,
			category,
			address,
			date,
			timeFrom,
			timeTo,
			description
		)
		.then(connectionList => {
			var flag = 1;
			res.render("connections.ejs", { connectionList, nav, subNav, flag });
		})
		.catch(err => {
			res.redirect("/contacts");
		});
});

app.get("/signUp", (req, res) => {
	var nav = ["login"];
	var subNav = ["Home"];
	res.render("signUp.ejs", { nav, subNav });
});

app.get("/connections/connectionDetails/:con", (req, res) => {
	var nav = ["Start a new connection", "logOut"];
	var subNav = [
		"Home",
		"Connections",
		"ConnectionsDetail",
		"ConnectionsCreated"
	];
	// conectionDetail = JSON.parse(req.params.con);
	const token = req.session.token;
	console.log("message id = " + req.params.con);
	console.log("name id = " + req.session.name);

	appJs
		.getCreatedConnectionDetails(req.params.con, token)
		.then(({ connectionItem, connectionDetail }) => {
			console.log("User id = " + connectionItem);
			var flag = req.session.status;
			req.session.status = 0;

			res.render("connectionDetails.ejs", {
				connectionItem,
				connectionDetail,
				nav,
				subNav,
				id: req.session.uId,
				name: req.session.name,
				flag
			});
		})
		.catch(errMsg => {
			console.log("woring" + errMsg);
			res.render("connectionDetails.ejs", {
				connectionItem,
				connectionDetail,
				nav,
				subNav,
				id: req.session.uId,
				name: req.session.name,
				flag: 1
			});
		});

	//res.render("connectionDetails.ejs", { conectionDetail, nav, subNav,id });
});

app.get("/about", (req, res) => {
	var nav = ["Start a new connection", "logOut"];
	var subNav = [
		"Home",
		"Connections",
		"ConnectionsDetail",
		"ConnectionsCreated"
	];
	res.render("about.ejs", { nav, subNav });
});

app.get("/contacts", (req, res) => {
	var nav = ["Start a new connection", "logOut"];
	var subNav = [
		"Home",
		"Connections",
		"ConnectionsDetail",
		"ConnectionsCreated"
	];
	res.render("contacts.ejs", { nav, subNav });
});

app.get(
	"/connections/savedConnections/:status/:title/:category/:conId",
	(req, res) => {
		const { status, conId, title, category } = req.params;
		var nav = ["Start a new connection", "logOut"];
		var subNav = [
			"Home",
			"Connections",
			"ConnectionsDetail",
			"ConnectionsCreated"
		];

		appJs
			.intrestedConnection(req.session.token, status, conId, title, category)
			.then(savedConnection => {
				console.log("savedConnection==123" + savedConnection);
				res.redirect("/savedConnections");
				// res.render("savedConnections.ejs", {
				// 	savedConnection,
				// 	nav,
				// 	subNav,
				// 	flag: 0
				// });
			})
			.catch(err => {
				console.log("err in catch==" + err);
				req.session.status = 1;
				//res.redirect("/about");
				res.redirect("/connections/connectionDetails/" + conId);
			});
	}
);

app.get("/savedConnections", (req, res) => {
	var nav = ["Start a new connection", "logOut"];
	var subNav = [
		"Home",
		"Connections",
		"ConnectionsDetail",
		"ConnectionsCreated"
	];

	appJs.getConnectionItems(req.session.token).then(savedConnection => {
		// console.log("savedConnection==" + savedConnection);
		var flag = req.session.del;
		req.session.del = 0;

		res.render("savedConnections.ejs", {
			savedConnection,
			nav,
			subNav,
			flag
		});
	});
});

app.get("/connections/connectionDetails/:action/:conId", (req, res) => {
	const { action, conId, status } = req.params;
	var nav = ["Start a new connection", "logOut"];
	var subNav = [
		"Home",
		"Connections",
		"ConnectionsDetail",
		"ConnectionsCreated"
	];
	if (action === "update") {
		res.redirect(`/connections/connectionDetails/${conId}`);
	} else {
		appJs
			.intrestedConnectionDelete(
				req.session.token,
				conId,
				req.session.uId,
				status
			)
			.then(() => {
				console.log("indelete==");
				req.session.del = 1;

				res.redirect("/savedConnections");
			});
	}
});

app.get("/createdConnections", (req, res) => {
	var nav = ["Start a new connection", "logOut"];
	var subNav = [
		"Home",
		"Connections",
		"ConnectionsDetail",
		"ConnectionsCreated"
	];
	appJs.CreatedConnectionDetails(req.session.token).then(connections => {
		var flag = req.session.delete;
		req.session.delete = 0;
		res.render("createdConnections.ejs", {
			connections,
			nav,
			subNav,
			flag
		});
	});
});

app.get("/connections/createdConnection/delete/:conId", (req, res) => {
	const { conId } = req.params;

	var nav = ["Start a new connection", "logOut"];
	var subNav = [
		"Home",
		"Connections",
		"ConnectionsDetail",
		"ConnectionsCreated"
	];
	appJs
		.deleteCreatedConnectionDetails(req.session.token, conId)
		.then(connections => {
			req.session.delete = 1;
			res.redirect("/createdConnections");
		});
});

app.listen(3000);
