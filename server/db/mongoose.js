var mongoose = require("mongoose");

mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/TodosApp");// MONGODB_URI se dobija komandom u terminalu(heroku config)

module.exports = {mongoose};
