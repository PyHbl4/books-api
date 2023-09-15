const router = require('express').Router();
const { getBooks, editBook, addBook, editAuthor } = require('../controllers/books.js');

router.get('/books', getBooks);
router.post('/books', addBook);
router.patch('/books/:bookId', editBook);
router.patch('/books/authors/:authorId', editAuthor);

module.exports = router;