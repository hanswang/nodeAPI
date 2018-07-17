'use strict';

const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

app.use(bodyParser.json());

// db connection
const dbConfig = require('./config/db.config.js');
const mongoose = require('mongoose');

/* eslint-disable no-console */
mongoose.connect(dbConfig.url, {
    useNewUrlParser: true
}).then(() => {
    console.log('Successfully connected to db');
}).catch(err => {
    console.log(err);
    console.log('Could not connect to the database, existing now...');
    process.exit();
});

// simple route
app.get('/', (req, res) => {
    res.json({
        'message': 'Welcome to articles api'
    });
});

require('./app/routes/article.routes.js')(app);

// listen req
const server = app.listen(3000, () => {
    console.log('Server is listening on port 3000');
});
/* eslint-enable no-console */

module.exports = server;