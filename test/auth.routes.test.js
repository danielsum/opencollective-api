/**
 * Dependencies.
 */
var expect    = require('chai').expect
  , request   = require('supertest')
  , _         = require('lodash')
  , jwt       = require('jsonwebtoken')
  , app       = require('../index')
  , utils     = require('../test/utils.js')()
  , config    = require('config')
  ;

/**
 * Variables.
 */
var userData = utils.data('user1');
var models = app.set('models');

/**
 * Tests.
 */
describe('auth.routes.test.js', function() {

  beforeEach(function(done) {
    utils.cleanAllDb(done);
  });

  beforeEach(function(done) {
    models.User.create(userData).done(done);
  });

  describe('#authenticate', function() {

    it('fails authenticate if no password', function(done) {
      request(app)
        .post('/authenticate')
        .send({
            api_key : config.application.api_key
          , username: userData.username
        })
        .expect(400)
        .end(function(e, res) {
          expect(e).to.not.exist;
          done();
        });
    });

    it('fails authenticate if bad password', function(done) {
      request(app)
        .post('/authenticate')
        .send({
            api_key : config.application.api_key
          , username: userData.username
          , password: 'bad'
        })
        .expect(400)
        .end(function(e, res) {
          expect(e).to.not.exist;
          done();
        });
    });

    it('successfully authenticate with username', function(done) {
      request(app)
        .post('/authenticate')
        .send({
            api_key : config.application.api_key
          , username: userData.username
          , password: userData.password
        })
        .expect(200)
        .end(function(e, res) {
          expect(e).to.not.exist;
          expect(res.body).to.have.property('access_token');
          expect(res.body).to.have.property('refresh_token');
          var data = jwt.decode(res.body.access_token);
          expect(data).to.have.property('id');
          expect(data).to.have.property('username');
          expect(data).to.have.property('name');
          expect(data).to.have.property('iat');
          expect(data).to.have.property('exp');
          expect(data).to.have.property('aud');
          expect(data).to.have.property('iss');
          expect(data).to.have.property('sub');
          done();
        });
    });

    it('successfully authenticate with email', function(done) {
      request(app)
        .post('/authenticate')
        .send({
            api_key : config.application.api_key
          , email: userData.email
          , password: userData.password
        })
        .expect(200)
        .end(function(e, res) {
          expect(e).to.not.exist;
          expect(res.body).to.have.property('access_token');
          expect(res.body).to.have.property('refresh_token');
          done();
        });
    });

  });

});
