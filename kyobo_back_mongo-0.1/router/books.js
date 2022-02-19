const express = require("express");
const router = express.Router();

const Book = require("../models/book");
const bookController = require("../controller/book");

router.get("/", bookController.getAllBooks);
router.get("/:id", bookController.getBookById);
router.post("/", bookController.createBook);
router.put("/:id", bookController.updateBookById);
router.delete("/:id", bookController.deleteBookById);

module.exports = router;
