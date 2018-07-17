'use strict';

const moment = require('moment');

const Article = require('../models/article.model.js');

exports.findAll = (req, res) => {
    // validation date
    if (!moment(req.params.date, 'YYYYMMDD', true).isValid()) {
        return res.status(400).send({
            message: 'Date is not valid format of yyyymmdd'
        });
    }

    const query_date = moment(req.params.date, 'YYYYMMDD').format('YYYY-MM-DD');

    Article.find({ date: query_date }, '-_id id title date body tags').then(articles => {
        if (articles.length === 0) {
            return res.status(404).send({
                message: 'Articles not found with date ' + req.params.date
            });
        }

        const count = articles.reduce((sum, iter) => {
            return sum + iter.tags.filter(tag => tag === req.params.tagName).length;
        }, 0);

        const article_list = articles.reduce((coll, iter) => {
            coll.push(iter.id);
            return coll;
        }, []);

        const related_tags = articles.reduce((coll, iter) => {
            if (iter.tags.indexOf(req.params.tagName) !== -1) {
                iter.tags.forEach(tag => {
                    if (tag === req.params.tagName) {
                        return;
                    }
                    if (coll.indexOf(tag) === -1) {
                        coll.push(tag);
                    }
                });
            }

            return coll;
        }, []);

        res.send({
            'tag': req.params.tagName,
            'count': count,
            'articles': article_list.sort().slice(-10),
            'related_tags': related_tags
        });
    }).catch(err => {
        if (err.kind === 'ObjectId') {
            return res.status(404).send({
                message: 'Articles not found with tagname ' + req.params.tagName + ' and date ' + req.params.date
            });
        }
        return res.status(500).send({
            message: 'Error in retrieving articles with tagname ' + req.params.tagName + ' and date ' + req.params.date
        });
    });
};
