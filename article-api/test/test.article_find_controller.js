'use strict';

const expect = require('chai').expect;
const httpMocks = require('node-mocks-http');
const mockery = require('mockery');


describe('Article Controllers fetch', function() {
    before(function(done) {
        mockery.enable({
            warnOnUnregistered: false,
            warnOnReplace: false,
            useCleanCache: true
        });

        const findStub = {
            findOne: (cond, select) => {
                if (cond.id === 123) {
                    return Promise.resolve(select);
                } else {
                    return Promise.resolve('');
                }
            }
        };
        mockery.registerMock('../models/article.model.js', findStub);

        this.articles = require('../app/controllers/article.controller.js');
        done();
    });

    beforeEach(function(done) {
        const dummy_data = {
            method: 'GET',
            url: '/articles/123',
            params: {
                id: 123
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
        mockery.deregisterMock('../models/article.model.js');
        mockery.disable();
        done();
    });

    it('get article success', function(done) {
        const res = this.res;
        res.on('end', function() {
            const respData = res._getData();
            expect(res.statusCode).to.equal(200);
            expect(res._isEndCalled()).to.be.true;
            expect(respData).to.equal('-_id id title date body tags');
            done();
        });
        this.articles.findOne(this.req, this.res);
    });

    it('get article failed, invalid id', function(done) {
        this.req.params.id = 321;

        const res = this.res;
        res.on('end', function() {
            const respData = res._getData();
            expect(res.statusCode).to.equal(404);
            expect(res._isEndCalled()).to.be.true;
            expect(respData).to.eql({
                message: 'Article not found with id 321'
            });
            done();
        });
        this.articles.findOne(this.req, this.res);
    });
});