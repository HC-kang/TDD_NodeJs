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
    .send({ title: "트렌드 코리아 2022" });
  expect(response.statusCode).toBe(500);
  expect(response.body).toStrictEqual({
    message: "Book validation failed: author: Path `author` is required.",
  });
});

it("GET /books", async () => {
  const response = await request(app).get("/books");
  expect(response.statusCode).toBe(200);
  expect(Array.isArray(response.body)).toBeTruthy();
  expect(response.body[0].title).toBeDefined();
  expect(response.body[0].author).toBeDefined();
  firstBook = response.body[0];
});

it("GET /books/:id", async () => {
  const response = await request(app).get("/books/" + firstBook["_id"]);
  console.log(response);
  expect(response.statusCode).toBe(200);
  expect(response.body.title).toBe(firstBook.title);
  expect(response.body.author).toBe(firstBook.author);
});

it("GET id doenst exist /books/:id", async () => {
  const response = await request(app).get("/books/5f5cb1f145b82ecaf43e3877");
  expect(response.statusCode).toBe(404);
});

it("PUT /books", async () => {
  const response = await request(app)
    .put("/books/" + firstBook["_id"])
    .send({ title: "updated title", price: 3000 });
  expect(response.statusCode).toBe(200);
  expect(response.body.title).toBe("updated title");
  expect(response.body.price).toBe(3000);
});

it("should return 404 on PUT /api/products", async () => {
  const res = await request(app)
    .put("/books/" + "5f5d79abdc3acb1b95e0eb99")
    .send({ title: "updated title", price: 3000 });
  expect(res.statusCode).toBe(404);
});

it("DELETE /books", async () => {
  const res = await request(app)
    .delete("/books/" + firstBook["_id"])
    .send();
  expect(res.statusCode).toBe(200);
});

it("DELETE id doenst exist /books/:id", async () => {
  const res = await request(app)
    .delete("/books/" + firstBook["_id"])
    .send();
  expect(res.statusCode).toBe(404);
});
