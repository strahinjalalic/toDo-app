const {ObjectID} = require("mongodb");

const {mongoose} = require("./../server/db/mongoose");
const {Todo} = require("./../server/models/todo");

var id = "5c87f4c7bee0711c8c0774d1";

if(!ObjectID.isValid(id)) {
	console.log("ID not valid!");
}

Todo.find({
	_id: id
}).then((todos) => {
	console.log("Todos", todos);
});

Todo.findOne({
	_id: id
}).then((todo) => {
	console.log("Todo", todo);
});

Todo.findById(id).then((todo) => {
	if(!todo) {
		return console.log("Id not found");
	}
	console.log("TodoById", todo);
}).catch((e) => console.log(e));