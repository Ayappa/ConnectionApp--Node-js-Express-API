var NewConnections = (
	_Id,
	title,
	category,
	address,
	date,
	timeFrom,
	timeTo,
	description,
	userId
) => {
	return {
		_Id,
		title,
		category,
		address,
		date,
		timeFrom,
		timeTo,
		description,
		userId
	};
};


var addCon=(title,going,category)=>{
	return{
		title,going,category
	};

	

}

module.exports = { NewConnections,addCon };
