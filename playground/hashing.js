var {SHA256} = require("crypto-js");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

var password = "123abc!";

bcrypt.genSalt(10, (err, salt) => {// 10 => generise koliko puta se hashira vrednost(znatno teze hackovati)
	bcrypt.hash(password, salt, (err, hash) => {
		console.log(hash);
	});
});

var hashedPass = "$2a$10$ESkYqa0x6ofw7onv/McxguyTrQ9uEFIaAMUocoRLctBgp3AjXt.fG";

bcrypt.compare(password, hashedPass, (err, res) => {
	console.log(res);//rezultat je true ukoliko se poklapaju ove vrednosti
});

//==================================================================================================================================================================================

var data = {
	id: 10
};

var token = jwt.sign(data, '123abc');
console.log(token);

var decoded = jwt.verify(token, '123abc');
console.log(decoded);

//================================================================================================================================================================


var message = "Poruka koja ce biti kriptovana!";
var hash = SHA256(message).toString(); //poziva se toString() metod zato sto je rezultat u vidu objekta

console.log(`Message: ${message}`);
console.log(`Hash: ${hash}`);

//================================================================================================================================================================
var data = {
	id: 4
};

var token = {
	data,
	hash: SHA256(JSON.stringify(data) + 'somesecret').toString()
};

token.data.id = 5;
token.hash = SHA256(JSON.stringify(data)).toString();


var resultHash = SHA256(JSON.stringify(token.data) + 'somesecret').toString();

if(resultHash === token.hash) { //proveravamo da li je na kraju hashirana vrednost jednaka pocetnoj iz objekta(korismo saulting za verifikovanje=> 'somesecret')
	console.log("Data has not been changed");
} else {
	console.log("Data has been changed!");
}
//ceo ovaj postupak se zove JWT(JSONWebToken) i mnogo ga je lakse koristiti preko biblioteke jsonwebtoken

