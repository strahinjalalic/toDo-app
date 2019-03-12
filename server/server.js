var express = require("express");
var app = express();
var bodyParser = require("body-parser");

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



app.listen(3000, () => {
	console.log("Server je pokrenut!");
});




