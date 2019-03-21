var jwt = require("jsonwebtoken");
const {ObjectID} = require("mongodb");
const {Todo} = require("./../../models/todo");
const {User} = require("./../../models/user");

var userOneId = new ObjectID();
var userTwoId = new ObjectID();


var users = [{
	_id: userOneId,
	email: "strahinjalalic@yahoo.com",
	password: "userOnePass",
	tokens: [{
		access: "auth",
		token: jwt.sign({_id: userOneId, access: "auth"}, "123abc").toString()
	}]
}, {
	_id: userTwoId,
	email: "stralelale@example.com",
	password: "userTwoPass",
	tokens: [{
		access: "auth",
		token: jwt.sign({_id: userTwoId, access: "auth"}, "123abc").toString()
	}]
}];


var todos = [{
	_id: new ObjectID(),
	text: "First test todo",
	_creator: userOneId
}, {
	_id: new ObjectID(),
	text: "Second test todo",
	completed: true,
	completedAt: 333,
	_creator: userTwoId
}];


const populateTodos = (done) => { //dole u kodu pretpostavljamo da je baza prazna, ovim kodom je zapravo praznimo => metod ce se pokretati pre svakog testiranja
	Todo.remove({}).then(() => {
		return Todo.insertMany(todos);
	}).then(() => done()); 
};


const populateUsers = (done) => {
	User.remove({}).then(() => {
		var userOne = new User(users[0]).save();
		var userTwo = new User(users[1]).save();

		return Promise.all([userOne, userTwo]);//metod koji ceka da se resolve-uju svi clanovi niza
	}).then(() => done());
};

module.exports = {todos, populateTodos, users, populateUsers};