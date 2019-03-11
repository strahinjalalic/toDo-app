const {MongoClient, ObjectID} = require("mongodb");

MongoClient.connect("mongodb://localhost:27017/TodosApp", (err, client) => {
	if(err) {
		return console.log("Konekcija ka MongoDB serveru onemogucena");
	} 
	console.log("Uspesna konekcija ka MongoDB serveru");

	var db = client.db("TodosApp");//uzimanje reference za bazu koja nam treba

    //deleteMany(vise podataka sa istim vrednostima)
    db.collection("Todos").deleteMany({text: "Lorem ipsum neki tekst"}).then((result) => {
    	console.log(result);//printuje se veliki objekat, bitno je da na vrhu stoji ok: 1 i n: <broj izbrisanih podataka>
    });
    
    //deleteOne(iako ima vise podataka sa istim vrednostima, brise se samo prva instanca)
    db.collection("Todos").deleteOne({text:"Lorem ipsum neki tekst"}).then((result) => {
    	console.log(result);
    });
    
    //findOneAndDelete(najbolji metod, printuje se mali objekat sa ok: 1 i n: 1 vrednostima, kao i value property u kome se skladiste svi podaci koji ce se obrisati)
    db.collection("Todos").findOneAndDelete({text: "Lorem ipsum neki tekst"}).then((result) => {
    	console.log(result);
    });

	//client.close(); //koristi se za testiranje, ukoliko konekcija bude uspesna, odmah ce se i prekinuti => ili ukoliko ubacujemo neke podatke u kolekcije stavljamo ovaj metod na kraju
});