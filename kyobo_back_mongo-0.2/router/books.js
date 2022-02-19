const express = require('express');
const router = express.Router();

const BookController = require('../controller/book');

router.get('/', BookController.getBooks);
router.get('/:id', BookController.getBookById);
router.post('/', BookController.createBook);
router.put('/:id', BookController.updateBook);
router.delete('/:id', BookController.deleteBook);

module.exports = router;