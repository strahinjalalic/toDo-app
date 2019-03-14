const expect = require("expect");
const request = require("supertest");
const {ObjectID} = require("mongodb");

const {app} = require("./../server");
const {Todo} = require("./../models/todo");

var todos = [{
	_id: new ObjectID(),
	text: "First test todo"
}, {
	_id: new ObjectID(),
	text: "Second test todo",
	completed: true,
	completedAt: 333
}];

beforeEach((done) => { //dole u kodu pretpostavljamo da je baza prazna, ovim kodom je zapravo praznimo => metod ce se pokretati pre svakog testiranja
	Todo.remove({}).then(() => {
		return Todo.insertMany(todos);
	}).then(() => done()); 
});


describe("POST /todos", () => {
	it("should create a new todo", (done) => {
		var text = "Test todo text";

		request(app)
		 .post("/todos")
		 .send({text})
		 .expect(200)
		 .expect((res) => {
		 	expect(res.body.text).toBe(text)
		 })
		 .end((err, res) => {
		 	if(err) {
		 		return done(err);
		 	}

		 	Todo.find({text}).then((todos) => {
		 		expect(todos.length).toBe(1);
                expect(todos[0].text).toBe(text);
                done();
		 	}).catch((e) => done(e));
		 });
	});
});


describe("GET /todos", () => {
	it("should get all todos", (done) => {
		request(app)
		 .get("/todos")
		 .expect(200)
		 .expect((res) => {
		 	expect(res.body.todos.length).toBe(2)
		 })
		 .end(done);
	});
});


describe("GET /todos/:id", () => {
	it("should get todo with specified id", (done) => {
		request(app)
		 .get(`/todos/${todos[0]._id.toHexString()}`)//toHexString() konvertuje ObjectID u Sting
		 .expect(200)
		 .expect((res) => {
		 	expect(res.body.todo.text).toBe(todos[0].text)
		 })
		 .end(done);
	});

	it("should get 404 if todo not found", (done) => {
        var hexId = new ObjectID().toHexString();

		request(app)
		 .get(`/todos/${todos[0].hexId}`)
		 .expect(404)
		 .end(done);
		
	});

	it("should return 404 for non-object ids", (done) => {
		request(app)
		 .get("/todos/2314")
		 .expect(404)
		 .end(done);
	})
});


describe("DELETE /todos/:id", () => {
	it("should remove todo", (done) => {
      var hexId = todos[1]._id.toHexString();

      request(app)
       .delete(`/todos/${hexId}`)
       .expect(200)
       .expect((res) => {
       	 expect(res.body.todo._id).toBe(hexId)
       })
       .end((err, res) => {
       	 if(err) {
       	 	return done(err);
       	 }

       	 Todo.findById(hexId).then((todo) => {
       	 	expect(todo).toNotExist();
       	 	done();
       	 });
       });
	});
});


describe("PATCH /todos/:id", () => {
	it("should update todo", (done) => {
		var hexId = todos[0]._id.toHexString();
        var text = "Updated Text in first item";
        

        request(app)
         .patch(`/todos/${hexId}`)
         .send({
         	completed: true,
         	text
         })
         .expect(200)
         .expect((res) => {
         	expect(res.body.todo.text).toBe(text);
         	expect(res.body.todo.completed).toBe(true);
         	expect(res.body.todo.completedAt).toBeA("number");
         }).end(done);
	});
});