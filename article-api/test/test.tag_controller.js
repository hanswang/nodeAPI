'use strict';

const expect = require('chai').expect;
const httpMocks = require('node-mocks-http');
const mockery = require('mockery');

describe('Tag Controller search', function() {
    before(function(done) {
        mockery.enable({
            warnOnUnregistered: false,
            warnOnReplace: false,
            useCleanCache: true
        });

        const findStub = {
            find: (cond) => {
                if (cond.date === '2017-07-07') {
                    const resArcs = [...Array(15).keys()].map(i => {
                        return {
                            id: i,
                            tags: [...Array(i).keys()].map(x => 't' + x)
                        };
                    });
                    return Promise.resolve(resArcs);
                } else if (cond.date === '2017-07-08') {
                    return Promise.resolve([]);
                } else if (cond.date === '2017-07-09') {
                    return Promise.reject({ kind: 'ObjectId' });
                } else {
                    return Promise.reject('internal error');
                }
            }
        };
        mockery.registerMock('../models/article.model.js', findStub);

        this.tags = require('../app/controllers/tag.controller.js');
        done();
    });

    beforeEach(function(done) {
        const dummy_data = {
            method: 'GET',
            url: '/articles/t6/20170707',
            params: {
                tagName: 't6',
                date: '20170707'
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
            expect(respData.tag).to.equal('t6');
            expect(respData.count).to.equal(8);
            expect(respData.articles).to.eql(
                [13, 14, 2, 3, 4, 5, 6, 7, 8, 9]
            );
            expect(respData.related_tags).to.eql(
                ['t0','t1','t2','t3','t4','t5','t7','t8','t9','t10','t11','t12','t13']
            );
            done();
        });
        this.tags.findAll(this.req, this.res);
    });

    it('get article failed, invalid date', function(done) {
        this.req.params.date = 'invalid date';

        const res = this.res;
        res.on('end', function() {
            const respData = res._getData();
            expect(res.statusCode).to.equal(400);
            expect(res._isEndCalled()).to.be.true;
            expect(respData).to.eql({
                message: 'Date is not valid format of yyyymmdd'
            });
            done();
        });
        this.tags.findAll(this.req, this.res);
    });

    it('get article failed, no article found', function(done) {
        this.req.params.date = '20170708';

        const res = this.res;
        res.on('end', function() {
            const respData = res._getData();
            expect(res.statusCode).to.equal(404);
            expect(res._isEndCalled()).to.be.true;
            expect(respData).to.eql({
                message: 'Articles not found with date 20170708'
            });
            done();
        });
        this.tags.findAll(this.req, this.res);
    });

    it('get article failed, no article found rejected', function(done) {
        this.req.params.date = '20170709';

        const res = this.res;
        res.on('end', function() {
            const respData = res._getData();
            expect(res.statusCode).to.equal(404);
            expect(res._isEndCalled()).to.be.true;
            expect(respData).to.eql({
                message: 'Articles not found with tagname t6 and date 20170709'
            });
            done();
        });
        this.tags.findAll(this.req, this.res);
    });

    it('get article failed, internal error', function(done) {
        this.req.params.date = '20170710';

        const res = this.res;
        res.on('end', function() {
            const respData = res._getData();
            expect(res.statusCode).to.equal(500);
            expect(res._isEndCalled()).to.be.true;
            expect(respData).to.eql({
                message: 'Error in retrieving articles with tagname t6 and date 20170710'
            });
            done();
        });
        this.tags.findAll(this.req, this.res);
    });
});