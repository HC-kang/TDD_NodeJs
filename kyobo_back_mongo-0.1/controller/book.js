const Book = require("../models/book");

exports.createBook = async (req, res, next) => {
  try {
    const createdBook = await Book.create(req.body);
    res.status(201).json(createdBook);
  } catch (error) {
    next(error);
  }
};

exports.getAllBooks = async (req, res, next) => {
  try {
    const allBooks = await Book.findAll();
    res.status(200).json(allBooks);
  } catch (error) {
    next(error);
  }
};

exports.getBookById = async (req, res, next) => {
  try {
    const book = await Book.findById(req.params.id);
    if (book) {
      res.status(200).json(book);
    } else {
      res.status(404).json({ err: "Book doesn't exist" });
    }
  } catch (error) {
    next(error);
  }
};

exports.updateBookById = async (req, res, next) => {
  try {
    const updatedBook = await Book.updateBookById(req.params.id, req.body);
    if (updatedBook) {
      res.status(200).json(updatedBook);
    } else {
      res.status(404).send();
    }
  } catch (error) {
    next(error);
  }
};

exports.deleteBookById = async (req, res, next) => {
  try {
    const deletedBook = await Book.deleteBookById(req.params.id);
    if (deletedBook) {
      res.status(200).json(deletedBook);
    } else {
      res.status(404).send();
    }
  } catch (error) {
    next(error);
  }
};
