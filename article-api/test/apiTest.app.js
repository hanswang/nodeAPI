'use strict';

const request = require('supertest');
const app = require('../server');

describe('loading application', function() {
    it('respondes to /', function testRoot(done) {
        request(app)
            .get('/')
            .expect('Content-Type', /json/)
            .expect(200, {
                message: 'Welcome to articles api'
            }, done);
    });

    it('404 to arbitrary path', function test404(done) {
        request(app)
            .get('/foo/bar')
            .expect(404, done);
    });
});