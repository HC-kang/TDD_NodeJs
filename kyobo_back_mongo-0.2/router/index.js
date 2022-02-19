const express = require('express');
const router = express.Router();
const BookAPI = require('./books');

router.use('/books', BookAPI);

module.exports = router;