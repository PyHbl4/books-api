const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const NotFoundError = require('./errors/not-found-error');
const PORT = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/', require('./routes/books'));

app.use((req, res, next) => {
    next(new NotFoundError('Запрашиваемая страница не найдена'));
});
app.listen(PORT);