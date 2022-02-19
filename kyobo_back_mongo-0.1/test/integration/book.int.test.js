const request = require("supertest");
const app = require("../../index");
const newBook = require("../data/new-book.json");

let firstBook;

it("Post /books", async () => {
  const response = await request(app).post("/books").send(newBook);

  expect(response.statusCode).toBe(201);
  expect(response.body.title).toBe(newBook.title);
  expect(response.body.author).toBe(newBook.author);
});

it("should return 500 on POST /books", async () => {
  const response = await request(app)
    .post("/books")
    .send({ title: "아무거나 책" });

  expect(response.statusCode).toBe(500);
  expect(response.body).toStrictEqual({
    message: "Book validation failed: author: Path `author` is required.",
  });
});

it("should return allBooks on GET /books", async () => {
  const response = await request(app).get("/books");

  expect(response.statusCode).toBe(200);
  expect(Array.isArray(response.body)).toBeTruthy();
  expect(response.body[0].title).toBeDefined();
  expect(response.body[0].author).toBeDefined();
  firstBook = response.body[0];
});

it("should return getBookById on GET /books:id", async () => {
  const response = await request(app).get("/books/" + firstBook["_id"]);
  expect(response.statusCode).toBe(200);
  expect(response.body).toBeTruthy();
  expect(response.body.title).toBe(firstBook.title);
  expect(response.body.author).toBe(firstBook.author);
});

it("should return 404 code when book doesnt exits", async () => {
  const response = await request(app).get("/books/5f5cb1f145b82ecaf43e3871");
  expect(response.statusCode).toBe(404);
});

it("should updateBookById works", async () => {
  const response = await request(app)
    .put("/books/" + firstBook["_id"])
    .send({ title: "updated title", author: "updated author", price: 3333 });
  expect(response.statusCode).toBe(200);
  expect(response.body.title).toBe("updated title");
  expect(response.body.author).toBe("updated author");
  expect(response.body.price).toBe(3333);
});

it("should return 404 when no book to update", async () => {
  const response = await request(app)
    .put("/books/5f5cb1f145b82ecaf43e4444")
    .send({ title: "updated title", author: "updated author", price: 3333 });
  expect(response.statusCode).toBe(404);
});

it("should return code 200 when book deleted", async () => {
  const response = await request(app)
    .delete("/books/" + firstBook["_id"])
    .send();
  expect(response.statusCode).toBe(200);
});

it("should return code 404 when no bookd to delete", async () => {
  const response = await request(app)
    .delete("/books/" + firstBook["_id"])
    .send();
  expect(response.statusCode).toBe(404);
});
