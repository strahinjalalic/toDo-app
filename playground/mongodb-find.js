const {MongoClient, ObjectID} = require("mongodb");

MongoClient.connect("mongodb://localhost:27017/TodosApp", (err, client) => {
	if(err) {
		return console.log("Konekcija ka MongoDB serveru onemogucena");
	} 
	console.log("Uspesna konekcija ka MongoDB serveru");

	var db = client.db("TodosApp");//uzimanje reference za bazu koja nam treba

	db.collection("Todos").find({_id: new ObjectID('5c867c1308c8931ff0dae609')}).toArray().then((docs) =>{//printuje sve podatke(i one koji su kreirani unutar Compasa) => ukoliko zelimo posebne upite da pravimo menjamo find metod: find({completed: true}) => za _id potrebno kreirati instancu ObjectID-a
       console.log("Todos");
       console.log(JSON.stringify(docs, undefined, 2));
	}, (err) => {
       if(err) {
       	console.log("Nemoguce je povuci podatke iz baze", err);
       }
	});

	//client.close(); //koristi se za testiranje, ukoliko konekcija bude uspesna, odmah ce se i prekinuti => ili ukoliko ubacujemo neke podatke u kolekcije stavljamo ovaj metod na kraju
});