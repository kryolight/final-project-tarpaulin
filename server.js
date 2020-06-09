const express = require('express');
const morgan = require('morgan');

const api = require('./api');

const {
    connectToDB
} = require('./lib/mongo');

const app = express();
const port = process.env.PORT || 8000;


app.use(morgan('dev'));

app.use(express.json());
app.use(express.static('public'));

app.use('/', (req, res) => {
    res.status(200).send({
        msg: "Hello, World"
    });
});

connectToDB(() => {
    app.listen(port, () => {
        console.log(`== Server is running on port ${port}`);
    });
});
