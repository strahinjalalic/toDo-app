const {MongoClient, ObjectID} = require("mongodb");

MongoClient.connect("mongodb://localhost:27017/TodosApp", (err, client) => {
	if(err) {
		return console.log("Konekcija ka MongoDB serveru onemogucena");
	} 
	console.log("Uspesna konekcija ka MongoDB serveru");

	var db = client.db("TodosApp");//uzimanje reference za bazu koja nam treba

    
    db.collection("Todos").findOneAndUpdate({
        _id: new ObjectID('5c86751debd7b81fe8589c21')
    }, {
        $set: {//update operator
            completed: true
        }
    }, {
        returnOriginal: false //false - vraca update-ovan dokument, true - vraca originalan dokument
    }).then((result) => {
        console.log(result);
    })

	//client.close(); //koristi se za testiranje, ukoliko konekcija bude uspesna, odmah ce se i prekinuti => ili ukoliko ubacujemo neke podatke u kolekcije stavljamo ovaj metod na kraju
});