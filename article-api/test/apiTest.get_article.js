'use strict';

const request = require('supertest');
const app = require('../server');
const Article = require('../app/models/article.model.js');

describe('GET /articles/:id', function() {
    const articleData = {
        title: 'API Test Data Dummy title',
        date: '2015-05-05',
        body: 'API Test Data Dummy body',
        tags: ['API', 'Test', 'Dummy'],
    };

    beforeEach(function(done) {
        Article.create(articleData, done);
    });

    afterEach(function(done) {
        Article.deleteMany({ title: articleData.title }, done);
    });

    it('respondes success', function testSuccess(done) {
        Article.findOne({ title: articleData.title }).then(article => {
            request(app)
                .get('/articles/' + article.id)
                .expect('Content-Type', /json/)
                .expect(200, {
                    'body': 'API Test Data Dummy body',
                    'date': '2015-05-05',
                    'id': article.id,
                    'tags': ['API', 'Test', 'Dummy'],
                    'title': 'API Test Data Dummy title'
                }, done);
        });
    });

    it('respondes 404', function test404(done) {
        Article.findOne({ title: articleData.title }).then(article => {
            Article.deleteMany({ id: article.id }).then(() => {
                request(app)
                    .get('/articles/' + article.id)
                    .expect(404, {
                        message: 'Article not found with id ' + article.id
                    }, done);
            });
        });
    });
});