const {ObjectID} = require("mongodb");

const {mongoose} = require("./../server/db/mongoose");
const {Todo} = require("./../server/models/todo");

Todo.remove({}).then((result) => { //uvek se prosledjuje prazan objekat{} => takodje se dobija veliki objekat na cijem su vrhu ok:1 i n: n property-es
     console.log(result);
});

Todo.removeOneAndRemove({_id: '5c87f4c7bee0711c8c0734d1'}).then((todo) => { //printuje se dokument koji se brise, moze bilo koji key/value par da se navede
	console.log(todo);
})


Todo.findByIdAndRemove('5c87f4c7bee0711c8c0734d1').then((todo) => { //printuje se dokument koji se brise
	console.log(todo);
});
