'use strict';

const moment = require('moment');

const Article = require('../models/article.model.js');

exports.create = (req, res) => {
    // validation
    if (!req.body.title) {
        return res.status(400).send({
            message: 'Article title is empty'
        });
    }

    if (!req.body.body) {
        return res.status(400).send({
            message: 'Article body is empty'
        });
    }

    if (!req.body.date || !moment(req.body.date, 'YYYY-MM-DD', true).isValid()) {
        return res.status(400).send({
            message: 'Article date is not valid'
        });
    }

    if (req.body.tags.length <= 0) {
        return res.status(400).send({
            message: 'Article tags not set'
        });
    }

    const article = new Article({
        title: req.body.title,
        date: moment(req.body.date).format('YYYY-MM-DD'),
        body: req.body.body,
        tags: req.body.tags,
    });

    article.save().then(data => {
        res.send(data);
    }).catch(err => {
        res.status(500).send({
            message: err.message
        });
    });
};

exports.findOne = (req, res) => {
    Article.findOne({ id: req.params.id }, '-_id id title date body tags').then(article => {
        if (!article) {
            return res.status(404).send({
                message: 'Article not found with id ' + req.params.id
            });
        }
        res.send(article);
    }).catch(err => {
        if (err.kind === 'ObjectId') {
            return res.status(404).send({
                message: 'Article not found with id ' + req.params.id
            });
        }
        return res.status(500).send({
            message: 'Error retrieving article with id ' + req.params.id
        });
    });
};
