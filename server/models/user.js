const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const _ = require("lodash");
const bcrypt = require("bcryptjs");


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


userSchema.methods.toJSON = function() {//methods objekat sve funkcije pretvara u instance metode, statics objekat sve metode pretvara u modalne metode
    var user = this;
    var userObject = user.toObject(); //promenljivu prebacujemo u objekat da bi koristili pick() metod

    return _.pick(userObject, ["_id", "email"]); //vracaju nam se samo ova dva propertyja kada posaljemo zahtev
};


userSchema.methods.generateAuthToken = function() {
	var user = this;//userSchema je parent objekat
	var access = "auth";
	var token = jwt.sign({_id: user._id.toHexString(), access}, process.env.JWT_SECRET).toString();

	user.tokens = user.tokens.concat([{access, token}]);//moze i user.tokens.push({access, token}) ali je ovo sigurniji metod

	return user.save().then(() => {//return i ovde da bi se mogao chainovati Promise u server.js fajlu
		return token;
	});
};


userSchema.methods.removeToken = function(token) {
	var user = this;

	return user.update({
		$pull: {//izvlaci token iz niza, ukoliko se matchuje sa tokenom koji prosledjujemo => brise ga
			tokens: {token}
		}
	});
};

userSchema.statics.findByToken = function(token) {
  var User = this;
  var decoded; 

  try {
  	decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch(e) {
    // return new Promise((resolve, reject) => {
    // 	reject(); }
    return Promise.reject();
  }

  return User.findOne({
  	_id: decoded._id,
  	'tokens.token': token,
  	'tokens.access': 'auth'
  });
};


userSchema.statics.findByCredentials = function(email, password) {
	var User = this;

	return User.findOne({email}).then((user) => {
		if(!user) {
			return Promise.reject();
		}

		return new Promise((resolve, reject) => {//bcrypt metodi idu sa callbackovima, zato moramo da napravimo novi Promise
			bcrypt.compare(password, user.password, (err, res) => {
				if(res){
				 resolve(user);
				} 
			     reject();
			});
		});
	});
};

userSchema.pre("save", function(next) {//mongoose middleware => ovakvi metodi nam dopustaju da odradimo nesto pre ili nakon nekog eventa => u ovom slucaju pisemo kod koji ce se izvrsiti pre 'save'eventa
	var user = this;

	if(user.isModified("password")) {
		bcrypt.genSalt(10, (err, salt) => {
			bcrypt.hash(user.password, salt, (err, hash) => {
				user.password = hash;
				next();
			});
		});

	} else {
		next();
	}
});

var User = mongoose.model("User", userSchema);

module.exports = {User};