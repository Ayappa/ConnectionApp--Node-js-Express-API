var UserSignUp = (id, firstName, lastName, email, gender, city, dob, password) => {
	return { id, firstName, lastName, email, gender, city, dob ,password };
};

var UserLogin = (email, password) => {
	return {
		email,
		password
	};
};

var userInterestedConnection =(conId,status,title,category)=>{
return{
	conId,status,title,category
}

}

var UserCreatedConnection=(conId,upVoted,status,uId)=>{
return{
	conId,upVoted,status,uId
}
}

var createdConnection=(conId,title,status,category)=>{
	return{
		conId,title,status,category
	};
}


module.exports = { UserSignUp, UserLogin ,UserCreatedConnection,userInterestedConnection,createdConnection};
