const MongoClient = require("mongodb").MongoClient; //iz biblioteke mongodb se uzima MongoClient, zato se chain-uje
//const {MongoClient} = require("mongodb"); => ekvivalentno sa kodom iznad => Object Destruct - uzimanje neke promenljive iz objekta, u ovom slucaju promenljive MongoClient iz mongodb paketa

MongoClient.connect("mongodb://localhost:27017/TodosApp", (err, client) => {
	if(err) {
		return console.log("Konekcija ka MongoDB serveru onemogucena");
	} 
	console.log("Uspesna konekcija ka MongoDB serveru");

	var db = client.db("TodosApp");//uzimanje reference za bazu koja nam treba

	db.collection("Todos").insertOne({//pozivanjem collection() metoda pravimo novu kolekciju i chain-ujemo insertOne() metod za ubacivanje podataka
		text: "Prvi string unutar nove kolekcije",
		completed: false
	//  _id: 123 => potpuno je legalno da sami kreiramo id ukoliko zelimo, a ukoliko ne uradimo to, svakako ce ga mongo sam kreirati. npr: 5fgd65rewrw34
	}, (err, result) => {
        if(err){
        	return console.log("Nije moguce ubaciti podatke unutar kolekcije", err);
        }
        console.log(JSON.stringify(result.ops, undefined, 2));// ops je atribut koji skladisti sve sto je ubaceno insertOne() metodom => moze i bez JSON.stringify metoda
	    // console.log(result.ops[0].getTimeStamp()); printuje se prva instanca kolekcije i vreme kad je ona kreirana
	});
    
	client.close(); //koristi se za testiranje, ukoliko konekcija bude uspesna, odmah ce se i prekinuti => ili ukoliko ubacujemo neke podatke u kolekcije stavljamo ovaj metod na kraju
});