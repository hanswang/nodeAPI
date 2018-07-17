'use strict';

const expect = require('chai').expect;
const sinon = require('sinon');

const Article = require('../app/models/article.model.js');

describe('Article Model', function() {
    it('should be invalid if data is empty', function(done) {
        const a = new Article();

        a.validate((err) => {
            expect(err.errors.title).to.exist;
            expect(err.errors.body).to.exist;
            expect(err.errors.date).to.exist;
            done();
        });
    });

    describe('Mock on database', function() {
        var articleMock;

        beforeEach(function (done) {
            articleMock = sinon.mock(Article);
            done();
        });

        afterEach(function (done) {
            articleMock.restore();
            done();
        });

        it('save on model', function(done) {
            const dummy_data = {
                title: 'u-title',
                date: 'u-date',
                body: 'u-body',
                tags: ['u-taga', 'u-tagb']
            };
            articleMock = sinon.mock(new Article());
            const article = articleMock.object;
            articleMock
                .expects('save').once().withArgs(dummy_data)
                .resolves('SAVED');

            article.save(dummy_data).then((res) => {
                articleMock.verify();
                expect(res).to.be.equal('SAVED');
                done();
            });
        });

        it('find by ID', function(done) {
            const dummy_data = {
                id: 123
            };
            articleMock
                .expects('findOne').once().withArgs(dummy_data)
                .resolves('FOUND');

            Article.findOne(dummy_data).then((res) => {
                articleMock.verify();
                expect(res).to.be.equal('FOUND');
                done();
            });
        });

        it('find by TAG', function(done) {
            const dummy_data = {
                tag: 'dummy'
            };
            articleMock
                .expects('find').once().withArgs(dummy_data)
                .resolves('FOUND');

            Article.find(dummy_data).then((res) => {
                articleMock.verify();
                expect(res).to.be.equal('FOUND');
                done();
            });
        });
    });
});