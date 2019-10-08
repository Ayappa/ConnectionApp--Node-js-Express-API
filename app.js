const axios = require("axios");
const ArrayList = require("arraylist");
var caregoryTitle = ["IT", "Studies", "Software"];
var connectionsList = new ArrayList();
var usersInterestedConnectionList = new ArrayList();

var User = require("./models/User");
var NewConnection = require("./models/NewConnection");
var addConnection = new ArrayList();

usersInterestedConnectionList = [
	{
		conId: 3,
		status: "Going",
		title: "Micro-Organisome",
		category: "Studies"
	}
];

var CreatedConnectionsList = [
	{
		conId: 2,
		upVoted: 5,
		userId: 1
	},
	{
		conId: 4,
		upVoted: 5,
		userId: 2
	},
	{
		conId: 1,
		upVoted: 10,
		userId: 1
	},
	{
		conId: 3,
		upVoted: 15,
		userId: 2
	}
];

const UsersAccount = [
	{
		id: 1,
		firstName: "ayappa",
		lastName: "ganesh",
		email: "kaikai9500@gmail.com",
		gender: "Male",
		city: "Charlotte",
		dob: "13/08/1990",
		password: "123"
	},
	{
		id: 2,
		firstName: "michle",
		lastName: "may",
		email: "michle@gmail.com",
		gender: "Male",
		city: "Charlotte",
		dob: "13/08/1990",
		password: "123"
	},
	{
		id: 3,
		firstName: "Abigna",
		lastName: "sha",
		email: "Abigna@gmail.com",
		gender: "Female",
		city: "New York",
		dob: "13/08/1995",
		password: "123"
	}
];

var getConnectionList = token => {
	return new Promise((resolve, reject) => {
		axios
			.get("http://localhost:5000/api/connection", {
				headers: { "x-auth-token": token }
			})
			.then(res => {
				connectionlist = res.data;
				resolve(connectionlist);
			})
			.catch(err => {
				err = res.data.msg;
				reject(err);
			});
	});
};
var login = (email, password) => {
	// var user = UsersAccount.find(function(User) {
	// 	return User.email === email && User.password === password;
	// });
	var err;
	var token;
	var Uid;
	var person;
	return new Promise((resolve, reject) => {
		axios;

		axios({
			method: "post",
			url: "http://localhost:5000/api/auth",
			data: { email, password }
		})
			.then(res => {
				console.log("token=" + res.data.token);
				console.log("id=" + res.data.Uid);

				token = res.data.token;
				Uid = res.data.Uid;

				if (token) {
					axios({
						method: "get",
						url: "http://localhost:5000/api/auth",
						headers: { "x-auth-token": token }
					})
						.then(user => {
							person = user.data.post.firstName + " " + user.data.post.lastName;
							console.log("user name=" + person);
							console.log("user Uis=" + Uid);

							resolve({ token, person: person, Uid });
						})
						.catch(error => {
							console.log("erroe name=" + error);
							reject(err);
						});
				}
			})
			.catch(err => {
				console.log(err);
				//err = err.data.msg;
				reject(err);
			});
	});
};

var registerUser = (
	first_name,
	last_name,
	email,
	password,
	passwordConfirm,
	city,
	Dob,
	Gender
) => {
	// var user = UsersAccount.find(function(User) {
	// 	return User.email === email;
	// });

	return new Promise((resolve, reject) => {
		// axios
		// 	.post("http://localhost:5000/api/users", {
		// 		firstName: first_name,
		// 		lastName: last_name,
		// 		email: email,
		// 		password: password,
		// 		gender: Gender,
		// 		city: city,
		// 		dob: Dob
		// 	})
		// 	.then(res => {
		// 		console.log(res.data.token);
		// 		token = res.data.token;
		// 		if (token) {
		// 			resolve(token);
		// 		}
		// 	})
		// 	.catch(err => {
		// 		console.log(err);
		// 		err = res.data.msg;
		// 		reject(err);
		// 	});

		axios({
			method: "post",
			url: "http://localhost:5000/api/users",
			data: {
				firstName: first_name,
				lastName: last_name,
				email: email,
				password: password,
				gender: Gender,
				city: city,
				dob: Dob
			}
		})
			.then(res => {
				console.log("token=" + res.data.token);
				console.log("id=" + res.data.Uid);

				token = res.data.token;
				Uid = res.data.Uid;

				if (token) {
					axios({
						method: "get",
						url: "http://localhost:5000/api/auth",
						headers: { "x-auth-token": token }
					})
						.then(user => {
							person = user.data.post.firstName + " " + user.data.post.lastName;
							console.log("user name=" + person);
							console.log("user Uis=" + Uid);

							resolve({ token, person: person, Uid });
						})
						.catch(error => {
							console.log("erroe name=" + error);
							reject(err);
						});
				}
			})
			.catch(err => {
				console.log(err);
				err = res.data.msg;
				reject(err);
			});
	});
};

var newConnection = (
	name,
	token,
	title,
	category,
	address,
	date,
	timeFrom,
	timeTo,
	description
) => {
	console.log("inside before newCon of connection token=" + token);
	console.log("inside before newCon of connection name=" + name);

	return new Promise((resolve, reject) => {
		axios({
			method: "post",
			url: "http://localhost:5000/api/connection",
			headers: { "x-auth-token": token },
			data: {
				name,
				title,
				category,
				address,
				date,
				timeFrom,
				timeTo,
				description
			}
		})
			.then(res => {
				var conId = res.data.conId;
				console.log("conid====" + res.data.conId);

				console.log("inside res token answer=" + token);
				axios({
					method: "post",
					url: "http://localhost:5000/api/createdConnection",
					headers: { "x-auth-token": token },
					data: {
						conId: conId,
						upVoted: "0",
						title,
						category
					}
				})
					.then(msg => {
						console.log(msg);
					})
					.catch(err => {
						console.log(err.msg);
					});
				getConnectionList(token).then(connectionlist => {
					resolve(connectionlist);
				});
			})
			.catch(erro => {
				//var erro = erro.data;
				console.log("error in create connection====" + JSON.stringify(erro));
				reject(erro);
			});
	});
};

var getCreatedConnectionDetails = (conId, token) => {
	console.log("message id1=" + conId);
	// var connectionItem = connectionsList.find(function(connection) {
	// 	return String(connection.conId) === conId;
	// });
	// var connectionDetail = CreatedConnectionsList.find(function(details) {
	// 	return String(details.conId) === conId;
	// });

	return new Promise((resolve, reject) => {
		axios({
			method: "post",
			url: "http://localhost:5000/api/connection/getOne",
			headers: { "x-auth-token": token },
			data: {
				conId: conId
			}
		})
			.then(item => {
				var connectionItem = item.data.item;
				console.log("item retuened from one=" + item.data.item);
				axios({
					method: "post",
					url: "http://localhost:5000/api/createdConnection/getOne",
					headers: { "x-auth-token": token },
					data: {
						conId: conId
					}
				})
					.then(detail => {
						var connectionDetail = detail.data.item;
						console.log("detail retuened from one=" + detail.data.item);
						resolve({ connectionItem, connectionDetail });
					})
					.catch(error => {
						console.log("err retuened from one=" + error.data);
						reject("No record found");
					});
			})
			.catch(err => {
				console.log("message id1err=" + conId);
				console.log("message id1err=" + token);

				console.log("err retuened from one=" + err.data);
				reject("No record found");
			});

		// if (connectionItem && connectionDetail) {
		// 	resolve({ connectionItem, connectionDetail });
		// } else {
		//
		// }
	});
};

var intrestedConnection = (token, status, conId, title, category) => {
	// var connectionItem = connectionsList.find(function(connection) {
	// 	return String(connection.conId) === conId;
	// });
	// var checkingUserConnectionList = usersInterestedConnectionList.find(function(
	// 	item
	// ) {
	// 	return String(item.conId) === conId;
	// });
	// console.log("checkingUserConnectionList==" + checkingUserConnectionList);
	// if (!checkingUserConnectionList) {
	// 	var usersConnectionList = User.userInterestedConnection(
	// 		conId,
	// 		status,
	// 		connectionItem.title,
	// 		connectionItem.category
	// 	);
	// 	usersInterestedConnectionList.push(usersConnectionList);
	// }
	// return new Promise((resolve, reject) => {
	// 	resolve(usersInterestedConnectionList);
	// });

	return new Promise((resolve, reject) => {
		///////////checking status and and adding and deleting upvoted
		axios({
			method: "post",
			url: "http://localhost:5000/api/status/",
			headers: { "x-auth-token": token },
			data: {
				conId: conId,
				flag: status
			}
		})
			///////// for new response ,storing in interestedconnection
			.then(mssg => {
				console.log("///////////////////////////");
				console.log("///////////////////////////");
				console.log("///////////////////////////");

				console.log("before=" + mssg.data.msg);
				if (mssg.data.msg === "your response noted") {
					console.log("before= post");
					axios({
						method: "post",
						url: "http://localhost:5000/api/InterestedConnection",
						headers: { "x-auth-token": token },
						data: {
							conId,
							title,
							category,
							status
						}
					}).then(added => {
						console.log("your response noted " + added.data.msg);

						if (status === "Yes") {
							axios({
								method: "put",
								url: "http://localhost:5000/api/createdConnection",
								headers: { "x-auth-token": token },
								data: {
									conId,
									status: "Yes"
								}
							}).then(m => {
								console.log("your response noted " + m.data.msg);
								axios({
									method: "get",
									url: "http://localhost:5000/api/InterestedConnection",
									headers: { "x-auth-token": token }
								})
									.then(interestedConnection => {
										resolve(interestedConnection.data);
									})
									.catch(e => {
										reject(e);
									});
							});
						}

						axios({
							method: "get",
							url: "http://localhost:5000/api/InterestedConnection",
							headers: { "x-auth-token": token }
						})
							.then(interestedConnection => {
								resolve(interestedConnection.data);
							})
							.catch(e => {
								reject(e);
							});
					});
				} else if (mssg.data.msg === "Your hav changed your  response as Yes") {
					axios({
						method: "put",
						url: "http://localhost:5000/api/createdConnection",
						headers: { "x-auth-token": token },
						data: {
							conId,
							status: "Yes"
						}
					})
						.then(msg => {
							axios({
								method: "put",
								url: "http://localhost:5000/api/InterestedConnection",
								headers: { "x-auth-token": token },
								data: {
									conId,
									status: "Yes"
								}
							}).then(mss => {
								axios({
									method: "get",
									url: "http://localhost:5000/api/InterestedConnection",
									headers: { "x-auth-token": token }
								})
									.then(interestedConnection => {
										console.log(msg.data);

										resolve(interestedConnection.data);
									})
									.catch(e => {
										reject(e);
									});
							});
						})
						.catch(e => {
							console.log(msg.data);
						});
				} else if (mssg.data.msg === "Your hav changed your  response as No") {
					axios({
						method: "put",
						url: "http://localhost:5000/api/createdConnection",
						headers: { "x-auth-token": token },
						data: {
							conId,
							status: "No"
						}
					})
						.then(msg => {
							axios({
								method: "put",
								url: "http://localhost:5000/api/InterestedConnection",
								headers: { "x-auth-token": token },
								data: {
									conId,
									status: "No"
								}
							}).then(mss => {
								axios({
									method: "get",
									url: "http://localhost:5000/api/InterestedConnection",
									headers: { "x-auth-token": token }
								})
									.then(interestedConnection => {
										console.log(msg.data);

										resolve(interestedConnection.data);
									})
									.catch(e => {
										reject(e);
									});
							});
						})
						.catch(e => {
							console.log(msg.data);
						});
				} else if (
					mssg.data.msg === "Your hav changed your  response as Maybe"
				) {
					axios({
						method: "get",
						url: "http://localhost:5000/api/InterestedConnection/getOne",
						headers: { "x-auth-token": token },
						data: {
							conId: conId
						}
					})
						.then(mssg => {
							if (mssg.data.status === "No") {
								axios({
									method: "put",
									url: "http://localhost:5000/api/createdConnection",
									headers: { "x-auth-token": token },
									data: {
										conId,
										status: "Yes"
									}
								}).then(e => {});
							}
							if (mssg.data.status === "Yes") {
								axios({
									method: "put",
									url: "http://localhost:5000/api/createdConnection",
									headers: { "x-auth-token": token },
									data: {
										conId,
										status: "No"
									}
								}).then(e => {});
							}
						})
						.catch(e => {
							console.log("status for maybe==" + e.data);
						});

					axios({
						method: "put",
						url: "http://localhost:5000/api/InterestedConnection",
						headers: { "x-auth-token": token },
						data: {
							conId,
							status: "Maybe"
						}
					}).then(mss => {
						axios({
							method: "get",
							url: "http://localhost:5000/api/InterestedConnection",
							headers: { "x-auth-token": token }
						})
							.then(interestedConnection => {
								resolve(interestedConnection.data);
							})
							.catch(e => {
								reject(e);
							});
					});
				}
			})

			.catch(err => {
				console.log("err retuened from one main reject=" + err);
				reject("No record found");
			});
	});
};

var getConnectionItems = token => {
	return new Promise((resolve, reject) => {
		axios({
			method: "get",
			url: "http://localhost:5000/api/InterestedConnection",
			headers: { "x-auth-token": token }
		})
			.then(interestedConnection => {
				resolve(interestedConnection.data);
			})
			.catch(e => {
				reject(e);
			});
	});
};

var CreatedConnectionDetails = token => {
	// var list = new ArrayList();
	// console.log(id);
	// CreatedConnectionsList.forEach(function(created) {
	// 	console.log(created.conId);
	// 	if (created.userId === id) {
	// 		var connectionItem = connectionsList.find(function(connection) {
	// 			return connection.conId === created.conId;
	// 		});
	// 		var createdObj = User.createdConnection(
	// 			connectionItem.conId,
	// 			connectionItem.title,
	// 			created.upVoted,
	// 			connectionItem.category
	// 		);

	// 		list.push(createdObj);
	// 	}
	// });

	//console.log(list);
	return new Promise((resolve, reject) => {
		axios({
			method: "get",
			url: "http://localhost:5000/api/createdConnection",
			headers: { "x-auth-token": token }
		})
			.then(interestedConnection => {
				resolve(interestedConnection.data);
			})
			.catch(e => {
				reject(e);
			});
	});
};

var intrestedConnectionDelete = (token, conId, uid, status) => {
	return new Promise((resolve, reject) => {
		console.log("///////////////////////////" + token);
		console.log("///////////////////////////" + conId);
		console.log("///////////////////////////" + uid);

		axios({
			method: "delete",
			url: "http://localhost:5000/api/status",
			headers: { "x-auth-token": token },
			data: {
				conId: conId
			}
		})
			.then(mss => {
				console.log("deleting statsus " + mss.data.msg);
				axios({
					method: "delete",
					url: "http://localhost:5000/api/InterestedConnection",
					headers: { "x-auth-token": token },
					data: {
						conId
					}
				}).then(m => {
					console.log("deleting interested " + m.data.msg);
					if (status === "Yes") {
						axios({
							method: "put",
							url: "http://localhost:5000/api/createdConnection",
							headers: { "x-auth-token": token },
							data: {
								conId,
								status: "No"
							}
						}).then(ms => {
							console.log("+ _ interested " + ms.data.msg);

							resolve();
						});
					}
				});
			})
			.catch(e => {
				console.log("error interested " + e);
				//reject();
			});
	});
};

var deleteCreatedConnectionDetails = (token, conId) => {
	// var createdlist = new ArrayList();
	// var connectionlist = new ArrayList();
	// createdlist = CreatedConnectionsList.filter(function(connection) {
	// 	return String(connection.conId) != conId;
	// });
	// CreatedConnectionsList = createdlist;
	// connectionlist = connectionsList.filter(function(connection) {
	// 	return String(connection.conId) != conId;
	// });
	// connectionsList = connectionlist;
	return new Promise((resolve, reject) => {
		axios({
			method: "delete",
			url: "http://localhost:5000/api/createdConnection",
			headers: { "x-auth-token": token },
			data: {
				conId
			}
		}).then(msg => {
			axios({
				method: "delete",
				url: "http://localhost:5000/api/connection",
				headers: { "x-auth-token": token },
				data: {
					conId
				}
			}).then(mss => {
				axios({
					method: "delete",
					url: "http://localhost:5000/api/connection",
					headers: { "x-auth-token": token },
					data: {
						conId
					}
				}).then(messs => {
					axios({
						method: "delete",
						url: "http://localhost:5000/api/InterestedConnection",
						headers: { "x-auth-token": token },
						data: {
							conId
						}
					}).then(res => {
						console.log("deleted a created connection");
						resolve();
					});
				});
			});
		});
	});
};

module.exports = {
	login,
	registerUser,
	newConnection,
	connectionsList,
	getConnectionList,
	getCreatedConnectionDetails,
	intrestedConnection,
	intrestedConnectionDelete,
	getConnectionItems,
	deleteCreatedConnectionDetails,
	CreatedConnectionDetails
};
