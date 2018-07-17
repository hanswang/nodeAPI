'use strict';

const request = require('supertest');
const app = require('../server');
const Article = require('../app/models/article.model.js');

describe('GET /tags/:tagName/:date', function() {
    const articleData = {
        title: 'API Test Data Dummy title by TAG',
        date: '2015-05-07',
        body: 'API Test Data Dummy body by TAG',
        tags: ['API', 'Test', 'Dummy', 'UniqTAG'],
    };


    before(function(done) {
        Article.deleteMany({ tags: 'UniqTAG' });
        Article.create(articleData, done);
    });
    after(function(done) {
        Article.deleteMany({ title: articleData.title }, done);
    });

    it('success find article', function testSuccess(done) {
        Article.findOne({ title: articleData.title }).then(article => {
            request(app)
                .get('/tags/UniqTAG/20150507')
                .expect('Content-Type', /json/)
                .expect(200, {
                    tag: 'UniqTAG',
                    count: 1,
                    articles: [article.id],
                    related_tags: ['API', 'Test', 'Dummy']
                }, done);
        });
    });

    it('success not find article with uniq tag', function testSuccess(done) {
        Article.findOne({ title: articleData.title }).then(article => {
            request(app)
                .get('/tags/ATAG/20150507')
                .expect('Content-Type', /json/)
                .expect(200, {
                    tag: 'ATAG',
                    count: 0,
                    articles: [article.id],
                    related_tags: []
                }, done);
        });
    });

    it('success not find article with diff date', function testSuccess(done) {
        request(app)
            .get('/tags/UniqTAG/20150508')
            .expect('Content-Type', /json/)
            .expect(404, {
                message: 'Articles not found with date 20150508'
            }, done);
    });

    it('fail of tag search, date invalid', function test400(done) {
        articleData.date = 'invalid date';
        request(app)
            .get('/tags/UniqTAG/2015-05-08')
            .expect('Content-Type', /json/)
            .expect(400, {
                message: 'Date is not valid format of yyyymmdd'
            }, done);
    });
});