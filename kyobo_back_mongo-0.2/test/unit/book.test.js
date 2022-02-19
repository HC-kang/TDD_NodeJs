const bookController = require("../../controller/book");
const Book = require("../../models/book");
const httpMocks = require("node-mocks-http");
const newBook = require("../data/new-book.json");
const allBooks = require("../data/all-books.json");

// 가상의 데이터 조회
const bookId = "620f551aae178ac69eec1272";
const updatedBook = {
  title: "이상한 과자 가게 전천당",
  author: "히로시마 레이코",
  price: 10800,
};

// Book Model Mock 생성
Book.create = jest.fn();
Book.findAll = jest.fn();
Book.findById = jest.fn();
Book.updateById = jest.fn();
Book.deleteById = jest.fn();

let req, res, next;
beforeEach(() => {
  req = httpMocks.createRequest();
  res = httpMocks.createResponse();
  next = jest.fn();
});

describe("Book Controller Create", () => {
  beforeEach(() => {
    req.body = newBook;
  });
  it("should have a createBook function", () => {
    expect(typeof bookController.createBook).toBe("function");
  });

  it("should call Book.create", async () => {
    await bookController.createBook(req, res, next);
    expect(Book.create).toBeCalledWith(newBook);
  });

  it("should return 201 response code", async () => {
    await bookController.createBook(req, res, next);
    expect(res.statusCode).toBe(201);
    // 결과값이 잘 전송됐는지 확인은 node-mocks-http 모듈의
    // isEndCalled 로 확인할 수 있음
    expect(res._isEndCalled()).toBeTruthy();
  });

  it("should return json body in response", async () => {
    // mockReturnValue(리턴 값) 함수를 이용하면
    // 가짜 함수가 어떤 값을 리턴해야할지 설정해줄 수 있음
    Book.create.mockReturnValue(newBook);
    await bookController.createBook(req, res, next);
    // node-mock-http모듈의 _getJSONData() 사용하면
    // response 객체에 전달된 JSON 데이터를 참조할 수 있음
    // toStrictEqual() Matcher의 경우
    // toEqual()보다 더 엄격하며 undefined를 허용하지 않음
    expect(res._getJSONData()).toStrictEqual(newBook);
  });
  it("should handle errors", async () => {
    const errorMessage = { message: "description property missing" };
    const rejectedPromise = Promise.reject(errorMessage);
    // mockReturnValue 를 통해 reject를 가짜 함수를 통해 반환함
    Book.create.mockReturnValue(rejectedPromise);
    await bookController.createBook(req, res, next);
    expect(next).toBeCalledWith(errorMessage);
  });
});

describe("Book Controller Get", () => {
  it("should have a getBooks function", () => {
    expect(typeof bookController.getBooks).toBe("function");
  });
  it("should return 200 response", async () => {
    await bookController.getBooks(req, res, next);
    expect(res.statusCode).toBe(200);
    expect(res._isEndCalled).toBeTruthy();
  });
  it("should return json body in response", async () => {
    Book.findAll.mockReturnValue(allBooks);
    await bookController.getBooks(req, res, next);
    expect(res._getJSONData()).toStrictEqual(allBooks);
  });
  it("should handle errors", async () => {
    const errorMessage = { message: "Error finding book data" };
    const rejectedPromise = Promise.reject(errorMessage);
    Book.findAll.mockReturnValue(rejectedPromise);
    await bookController.getBooks(req, res, next);
    expect(next).toHaveBeenCalledWith(errorMessage);
  });
});

describe("Book Controller GetById", () => {
  it("should have a getBookById", () => {
    expect(typeof bookController.getBookById).toBe("function");
  });
  it("should call Book.findById", async () => {
    req.params.id = bookId;
    await bookController.getBookById(req, res, next);
    expect(Book.findById).toBeCalledWith(bookId);
  });
  it("should return json body and reponse code 200", async () => {
    Book.findById.mockReturnValue(newBook);
    await bookController.getBookById(req, res, next);
    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toStrictEqual(newBook);
    expect(res._isEndCalled()).toBeTruthy();
  });
  it("should return 404 when item doesnt exist", async () => {
    Book.findById.mockReturnValue(null);
    await bookController.getBookById(req, res, next);
    expect(res.statusCode).toBe(404);
    expect(res._isEndCalled()).toBeTruthy();
  });
  it("should handle errors", async () => {
    const errorMessage = { message: "error" };
    const rejectedPromise = Promise.reject(errorMessage);
    Book.findById.mockReturnValue(rejectedPromise);
    await bookController.getBookById(req, res, next);
    expect(next).toHaveBeenCalledWith(errorMessage);
  });
});

describe("Book Controller Update", () => {
  it("should have an updateBook function", () => {
    expect(typeof bookController.updateBook).toBe("function");
  });
  it("should call Book.updateById", async () => {
    req.params.id = bookId;
    req.body = updatedBook;
    await bookController.updateBook(req, res, next);
    expect(Book.updateById).toHaveBeenCalledWith(bookId, updatedBook);
  });

  it("should return json body and response code 200", async () => {
    req.params.bookId = bookId;
    req.body = updatedBook;
    Book.updateById.mockReturnValue(updatedBook);
    await bookController.updateBook(req, res, next);
    expect(res._isEndCalled()).toBeTruthy();
    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toStrictEqual(updatedBook);
  });

  it("should handle 404 when item doesnt exist", async () => {
    Book.updateById.mockReturnValue(null);
    await bookController.updateBook(req, res, next);
    expect(res.statusCode).toBe(404);
    expect(res._isEndCalled()).toBeTruthy();
  });

  it("should handle errors", async () => {
    const errorMessage = { message: "error" };
    const rejectedPromise = Promise.reject(errorMessage);
    Book.updateById.mockReturnValue(rejectedPromise);
    await bookController.updateBook(req, res, next);
    expect(next).toHaveBeenCalledWith(errorMessage);
  });
});

describe("Book Controller Delete", () => {
  it("should have a deleteBook function", () => {
    expect(typeof bookController.deleteBook).toBe("function");
  });

  it("should call Book.deleteById", async () => {
    req.params.id = bookId;
    await bookController.deleteBook(req, res, next);
    expect(Book.deleteById).toBeCalledWith(bookId);
  });
  it("should return 200 response ", async () => {
    req.params.id = bookId;
    Book.deleteById.mockReturnValue(bookId);
    await bookController.deleteBook(req, res, next);
    expect(res.statusCode).toBe(200);
    expect(res._isEndCalled()).toBeTruthy();
  });
  it("should handle 404 when item doenst exist", async () => {
    Book.deleteById.mockReturnValue(null);
    await bookController.deleteBook(req, res, next);
    expect(res.statusCode).toBe(404);
    expect(res._isEndCalled()).toBeTruthy();
  });

  it("should handle errors", async () => {
    const errorMessage = { message: "Error deleting" };
    const rejectedPromise = Promise.reject(errorMessage);
    Book.deleteById.mockReturnValue(rejectedPromise);
    await bookController.deleteBook(req, res, next);
    expect(next).toHaveBeenCalledWith(errorMessage);
  });
});
