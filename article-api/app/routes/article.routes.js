'use strict';

module.exports = (app) => {
    const articles = require('../controllers/article.controller.js');
    const tags = require('../controllers/tag.controller.js');

    app.post('/articles', articles.create);

    app.get('/articles/:id', articles.findOne);

    app.get('/tags/:tagName/:date', tags.findAll);
};