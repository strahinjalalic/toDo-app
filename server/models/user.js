const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const _ = require("lodash");


var userSchema = new mongoose.Schema({
	email: {
		type: String,
		required: true,
		trim: true,
		minlength: 1,
		unique: true, //ne moze se isti e-mail pojaviti vise od jedanput u bazi
		validate: {
			validator: validator.isEmail, //uzima vrednost i vraca true ukoliko je ta vrednost e-mail ili vraca false ukoliko nije
			message: '{VALUE} is not a valid e-mail'
		}
	},
	password: {
		type: String,
		require: true,
		minlength: 6
	},
	tokens: [{
		access: {
			type: String,
			require: true
		},
		token: {
			type: String,
			require: true
		}
	}]
});


userSchema.methods.toJSON = function() {
    var user = this;
    var userObject = user.toObject(); //promenljivu prebacujemo u objekat da bi koristili pick() metod

    return _.pick(userObject, ["_id", "email"]); //vracaju nam se samo ova dva propertyja kada posaljemo zahtev
};


userSchema.methods.generateAuthToken = function() {
	var user = this;
	var access = "auth";
	var token = jwt.sign({_id: user._id.toHexString(), access}, "123abc").toString();

	user.tokens = user.tokens.concat([{access, token}]);//moze i user.tokens.push({access, token}) ali je ovo sigurniji metod

	return user.save().then(() => {//return i ovde da bi se mogao chainovati Promise u server.js fajlu
		return token;
	});
};


var User = mongoose.model("User", userSchema);

module.exports = {User};