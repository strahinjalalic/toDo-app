var express = require("express");
var app = express();
var bodyParser = require("body-parser");
const {ObjectID} = require("mongodb");

app.use(bodyParser.json());

var {mongoose} = require("./db/mongoose");
var {Todo} = require("./models/todo");
var {User} = require("./models/user");


app.post("/todos", (req, res) => {
      // console.log(req.body); //salje se preko postmana
      var todo = new Todo({
      	text: req.body.text//odnosi se na zahtev koji saljemo preko postmana kada sami pisemo "text":"vrednost"
      });
      todo.save().then((doc) => {
      	res.send(doc);
      }, (err) => {
      	res.status(400).send(err);
      });
});


app.get("/todos", (req, res) => {
	Todo.find().then((todos) => {
		res.send({todos})//bolje je slati ovaj niz unutar objekta, jer bi tako mogli da saljemo jos neke stvari u buducnosti, a ako ga ostavimo kao niz(res.send(todos)) => nista necemo moci da saljemo
	}, (err) => {
		res.status(400).send(err);
	})
});


app.get("/todos/:id", (req, res) => {
    var id = req.params.id;

    if(!ObjectID.isValid(id)) {
      res.status(404).send();
    } else {
      Todo.findById(id).then((todo) => {
            if(!todo) {
                  res.status(404).send();
            } else {
                  res.send({todo});
            }
      }, () => {
            res.status(400).send();
      });
    }
});

app.listen(3000, () => {
	console.log("Server je pokrenut!");
});


module.exports = {app};



