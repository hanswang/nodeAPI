'use strict';

const request = require('supertest');
const app = require('../server');
const Article = require('../app/models/article.model.js');
const expect = require('chai').expect;

describe('POST /articles', function() {
    const articleData = {
        title: 'API Test Data Dummy title by POST',
        date: '2015-05-06',
        body: 'API Test Data Dummy body by POST',
        tags: ['API', 'Test', 'Dummy', 'POST'],
    };

    after(function(done) {
        Article.deleteMany({ title: articleData.title }, done);
    });

    it('success create article', function testSuccess(done) {
        request(app)
            .post('/articles')
            .send(articleData)
            .expect('Content-Type', /json/)
            .expect(200)
            .expect(resp => {
                expect(resp.body.body).to.equal('API Test Data Dummy body by POST');
                expect(resp.body.title).to.equal('API Test Data Dummy title by POST');
                expect(resp.body.date).to.equal('2015-05-06');
                expect(resp.body.tags).to.eql(['API', 'Test', 'Dummy', 'POST']);
            })
            .end(done);
    });

    it('fail of article create, date invalid', function test400(done) {
        articleData.date = 'invalid date';
        request(app)
            .post('/articles')
            .send(articleData)
            .expect(400, {
                message: 'Article date is not valid'
            }, done);
    });
});