var mongoose = require("mongoose");

var Todo = mongoose.model("Todo", {
	text: {
     type: String,
     required: true, //mongoose validators
     minlength: 1,
     trim: true //brise sve "spejsove" na pocetku i kraju stringa
	},
	completed: {
    type: Boolean,
    default: false
	},
	completedAt: {
     type: Number,
     default: null
	},
    _creator: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    }
});

module.exports = {Todo};




// var newTodo = new Todo({
//  text: "Spremi dorucak"
// });
// newTodo.save().then((doc) => {
//    console.log("Todo zapamcen", doc);
// }, (e) => {
//   console.log("Nemoguce zapamtiti todo");
// });