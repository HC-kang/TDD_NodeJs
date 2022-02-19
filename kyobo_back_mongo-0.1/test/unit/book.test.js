const bookController = require("../../controller/book");
const Book = require("../../models/book");
const httpMocks = require("node-mocks-http");
const newBook = require("../data/new-book.json");
const allBooks = require("../data/all-book.json");

const bookId = "62108b2b7fe8ce1bc0932ab8";
const updatedBook = {
  title: "책",
  author: "나",
  price: 3000,
};

// Book Model Mock 생성
Book.create = jest.fn();
Book.findAll = jest.fn();
Book.findById = jest.fn();
Book.updateBookById = jest.fn();
Book.deleteBookById = jest.fn();

let req, res, next;
beforeEach(() => {
  req = httpMocks.createRequest();
  res = httpMocks.createResponse();
  next = jest.fn();
});

describe("about createBook", () => {
  it("should call Book.create", () => {
    req.body = newBook;

    bookController.createBook(req, res);
    expect(Book.create).toBeCalledWith(newBook);
  });

  it("should return 201 response code", async () => {
    await bookController.createBook(req, res, next);
    expect(res.statusCode).toBe(201);
    // 결과값이 잘 전송되었는지는 isEndCalled로 확인
    expect(res._isEndCalled()).toBeTruthy();
  });

  it("should return json body in response", async () => {
    // mockReturnValue를 활용하면(리턴값)
    // 가짜 함수가 어떤 값을 리턴할지 정할 수 있음.
    Book.create.mockReturnValue(newBook);
    await bookController.createBook(req, res, next);
    // node-mock-http 모듈의 _getJsonData() 를 사용해
    // response 객체에 전달된 JSON 데이터를 참조 할 수 있음.
    // toStrictEqual() Matcher의 경우
    // toEqual()보다 엄격하며, undefined를 허용 않음.
    expect(res._getJSONData()).toStrictEqual(newBook);
  });

  it("should handle errors", async () => {
    const errorMessage = { message: "description property missing" };
    const rejectedPromise = Promise.reject(errorMessage);
    // mockReturnValue를 통해 reject를 가짜 함수를 통해 반환함.
    Book.create.mockReturnValue(rejectedPromise);
    await bookController.createBook(req, res, next);
    expect(next).toBeCalledWith(errorMessage);
  });
});

describe("about getAllBooks", () => {
  it("should have a getAllBooks function", () => {
    expect(typeof bookController.getAllBooks).toBe("function");
  });

  it("should return 200 response code", async () => {
    await bookController.getAllBooks(req, res, next);
    expect(res.statusCode).toBe(200);
    expect(res._isEndCalled()).toBeTruthy();
  });

  it("should return json body in response", async () => {
    Book.findAll.mockReturnValue(allBooks);
    await bookController.getAllBooks(req, res, next);
    expect(res._getJSONData()).toStrictEqual(allBooks);
  });

  it("should handle errors", async () => {
    const errorMessage = { message: "Error finding book data" };
    const rejectedPromise = Promise.reject(errorMessage);
    Book.findAll.mockReturnValue(rejectedPromise);
    await bookController.getAllBooks(req, res, next);
    expect(next).toBeCalledWith(errorMessage);
  });
});

describe("about getBookById", () => {
  it("should have a getBookById function", () => {
    expect(typeof bookController.getBookById).toBe("function");
  });

  it("should return 200 response code", async () => {
    Book.findById.mockReturnValue(newBook);
    await bookController.getBookById(req, res, next);
    expect(res.statusCode).toBe(200);
    expect(res._isEndCalled()).toBeTruthy();
  });

  it("should use Mongoose.findById query", async () => {
    req.params.id = bookId;
    await bookController.getBookById(req, res, next);
    expect(Book.findById).toBeCalledWith(bookId);
  });

  it("should return json body in response", async () => {
    Book.findById.mockReturnValue(newBook);
    await bookController.getBookById(req, res, next);
    expect(res._getJSONData()).toStrictEqual(newBook);
  });

  it("shold return 404 response code when book doent exist", async () => {
    Book.findById.mockReturnValue(null);
    await bookController.getBookById(req, res, next);
    expect(res.statusCode).toBe(404);
    expect(res._isEndCalled()).toBeTruthy();
  });

  it("should handle errors", async () => {
    const errorMessage = { message: "Error" };
    const rejectedPromise = Promise.reject(errorMessage);
    Book.findById.mockReturnValue(rejectedPromise);
    await bookController.getBookById(req, res, next);
    expect(next).toBeCalledWith(errorMessage);
  });
});

describe("about update", () => {
  it("should have a updateBookById function", () => {
    expect(typeof bookController.updateBookById).toBe("function");
  });

  it("should have object in updateBookById", async () => {
    req.params.id = bookId;
    req.body = updatedBook;
    await bookController.updateBookById(req, res, next);
    expect(Book.updateBookById).toHaveBeenCalledWith(bookId, updatedBook);
  });

  it("should return json body and response code 200", async () => {
    req.params.id = bookId;
    req.body = updatedBook;
    Book.updateBookById.mockReturnValue(updatedBook);
    await bookController.updateBookById(req, res, next);
    expect(res._isEndCalled()).toBeTruthy;
    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toStrictEqual(updatedBook);
  });

  it("should return 404 response code when book doent exist", async () => {
    req.params.id = bookId;
    req.body = updatedBook;
    Book.updateBookById.mockReturnValue(null);
    await bookController.updateBookById(req, res, next);
    expect(res.statusCode).toBe(404);
  });

  it("should handle errors", async () => {
    const errorMessage = { message: "Error" };
    const rejectedPromise = Promise.reject(errorMessage);
    Book.updateBookById.mockReturnValue(rejectedPromise);
    await bookController.updateBookById(req, res, next);
    expect(next).toBeCalledWith(errorMessage);
  });
});

describe("about delete", () => {
  it("should have a deleteBookById function", () => {
    expect(typeof bookController.deleteBookById).toBe("function");
  });

  it("should call deleteBookById", async () => {
    req.params.id = bookId;
    await bookController.deleteBookById(req, res, next);
    expect(Book.deleteBookById).toBeCalledWith(bookId);
  });

  it("should return 200 response code", async () => {
    req.params.id = bookId;
    Book.deleteBookById.mockReturnValue(true);
    await bookController.deleteBookById(req, res, next);
    expect(res._isEndCalled()).toBeTruthy;
    expect(res.statusCode).toBe(200);
  });

  it("should return 404 response code when book doesnt exist", async () => {
    req.params.id = bookId;
    Book.deleteBookById.mockReturnValue(null);
    await bookController.deleteBookById(req, res, next);
    expect(res._isEndCalled()).toBeTruthy;
    expect(res.statusCode).toBe(404);
  });

  it("should handle errors", async () => {
    const errorMessage = { message: "Error" };
    const rejectedPromise = Promise.reject(errorMessage);
    Book.deleteBookById.mockReturnValue(rejectedPromise);
    await bookController.deleteBookById(req, res, next);
    expect(next).toBeCalledWith(errorMessage);
  });
});

// const bookController = require("../../controller/books");

// describe("Book Controller Create", () => {
//   it("Should have a create Book function", () => {
//     expect(typeof bookController.createBook).toBe("function");
//   });
// });

// describe("Calculation", () => {
//   it("Two plus two is four", () => {
//     expect(2 + 2).toBe(4);
//   });

//   it("Two plus two is not five", () => {
//     expect(2 + 2).not.toBe(5);
//   });
// });
