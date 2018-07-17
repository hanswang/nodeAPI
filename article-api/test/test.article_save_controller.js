'use strict';

const expect = require('chai').expect;
const httpMocks = require('node-mocks-http');
const mockery = require('mockery');


describe('Article Controllers save', function() {
    before(function(done) {
        mockery.enable({
            warnOnUnregistered: false,
            warnOnReplace: false,
            useCleanCache: true
        });

        const artickStub = function() {
            this.save = () => {
                return Promise.resolve({message: 'saved in success'});
            };
        };
        mockery.registerMock('../models/article.model.js', artickStub);

        this.articles = require('../app/controllers/article.controller.js');
        done();
    });

    beforeEach(function(done) {
        const dummy_data = {
            method: 'POST',
            url: '/articles',
            body: {
                title: 'u-title',
                date: '2018-07-01',
                body: 'u-body',
                tags: ['u-taga', 'u-tagb']
            }
        };
        this.req = httpMocks.createRequest(dummy_data);
        this.res = httpMocks.createResponse({
            eventEmitter: require('events').EventEmitter
        });
        done();
    });

    afterEach(function(done) {
        this.req = null;
        this.res = null;
        done();
    });

    after(function(done) {
        mockery.disable();
        done();
    });

    it('save article success', function(done) {
        const res = this.res;
        res.on('end', function() {
            expect(res.statusCode).to.equal(200);
            const respData = res._getData();
            expect(res._isEndCalled()).to.be.true;
            expect(respData.message).to.equal('saved in success');
            done();
        });
        this.articles.create(this.req, this.res);
    });

    it('save article failed, invalid date', function(done) {
        this.req.body.date = 'invalid date';

        const res = this.res;
        res.on('end', function() {
            expect(res.statusCode).to.be.equal(400);
            const respData = res._getData();
            expect(res._isEndCalled()).to.be.true;
            expect(respData.message).to.be.equal('Article date is not valid');
            done();
        });
        this.articles.create(this.req, this.res);
    });

    it('save article failed, invalid title', function(done) {
        this.req.body.title = '';

        const res = this.res;
        res.on('end', function() {
            expect(res.statusCode).to.be.equal(400);
            const respData = res._getData();
            expect(res._isEndCalled()).to.be.true;
            expect(respData.message).to.be.equal('Article title is empty');
            done();
        });
        this.articles.create(this.req, this.res);
    });

    it('save article failed, invalid body', function(done) {
        this.req.body.body = '';

        const res = this.res;
        res.on('end', function() {
            expect(res.statusCode).to.be.equal(400);
            const respData = res._getData();
            expect(res._isEndCalled()).to.be.true;
            expect(respData.message).to.be.equal('Article body is empty');
            done();
        });
        this.articles.create(this.req, this.res);
    });

    it('save article failed, invalid tag', function(done) {
        this.req.body.tags = [];

        const res = this.res;
        res.on('end', function() {
            expect(res.statusCode).to.be.equal(400);
            const respData = res._getData();
            expect(res._isEndCalled()).to.be.true;
            expect(respData.message).to.be.equal('Article tags not set');
            done();
        });
        this.articles.create(this.req, this.res);
    });
});