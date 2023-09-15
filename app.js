const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const NotFoundError = require('./errors/not-found-error');
const cors = require('cors');
const PORT = 3001;

const corsOptions = {
    origin: '*',
    optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/', require('./routes/books'));

app.use((req, res, next) => {
    next(new NotFoundError('Запрашиваемая страница не найдена'));
});
app.listen(PORT);