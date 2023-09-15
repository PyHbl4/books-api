const DB = require('../utils/data.json');
const sha1 = require('js-sha1');
const fs = require('fs');
const NotFoundError = require('../errors/not-found-error');
const path = require('path');

const dataFilePath = path.resolve(__dirname, '../utils/data.json');

function parseBooks(data) {
    const result = [];
    data.books.forEach(book => {
        const author = data.authors.find((author) => author.authorStrId === book.authorStrId);
        result.push({
            id: book.id,
            title: book.title,
            author: author ? author.author : "Неизвестный автор",
            authorStrId: book.authorStrId,
            authorBio: author ? author.bio : "Описание отсутствует",
        });
    });
    return result;
}

function saveDataToFile(data) {
    fs.writeFile(dataFilePath, JSON.stringify(data, null, 2), err => {
        if (err) throw err;
        console.log('Данные успешно сохранены в файл.');
    });
}

module.exports.getBooks = (req, res) => {
    const result = parseBooks(DB);
    if (result.length > 0) {
        res.status(200).send(result);
    } else {
        res.status(204).send('ошибка');
    }
}

module.exports.editBook = (req, res, next) => {
    const book = DB.books.find((book) => book.id === +req.params.bookId);
    if (book) {
        book.title = req.body.title;
        saveDataToFile(DB);
        res.status(200).send(book);
    } else {
        next(new NotFoundError('Книга не найдена'));
    }
}

module.exports.editAuthor = (req, res, next) => {
    const author = DB.authors.find((author) => author.authorStrId === req.params.authorId);
    if (author) {
        if (req.body.bio) {
            author.bio = req.body.bio;
        }
        if (req.body.author) {
            author.author = req.body.author;
        }
        saveDataToFile(DB);
        res.status(200).send(author);
    } else {
        next(new NotFoundError('Автор не найден'));
    }
}

module.exports.addBook = (req, res) => {
    const author = DB.authors.find((author) => author.author === req.body.author.trim());
    if (author) {
        DB.books.push(
            {
                id: DB.books.length + 1,
                authorStrId: author.authorStrId,
                title: req.body.title
            }
        );
    } else {
        const newAuthor = {
            id: DB.authors.length + 1,
            author: req.body.author,
            bio: "Описание пока отсутствует. Вы можете заполнить его самостоятельно. Для этого кликните по Ф.И.О. автора",
            authorStrId: sha1(req.body.author)
        }
        DB.authors.push(newAuthor);
        DB.books.push(
            {
                id: DB.books.length + 1,
                authorStrId: newAuthor.authorStrId,
                title: req.body.title
            }
        );
    }
    saveDataToFile(DB);
    const result = parseBooks(DB);
    res.status(200).send(result);
}
