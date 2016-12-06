var assert = require('assert');
var rewire = require("rewire");
var fhauth = rewire('../../lib/fh-auth.js');
var mockAPI = require('../fixtures/mockAPI.js');

exports.it_shoudld_test_auth_success = function (finish) {
  var opts = {
    localAuth: {
      status: 401,
      body: {
        "message": "not authorised"
      }
    }
  };

  var req = {
    pause: function () { },
    resume: function () { }
  };

  var res = {
    status: function (status) {
      assert.equal(status, opts.localAuth.status)
      return res;
    },
    json: function (body) {
      assert.equal(body.message, opts.localAuth.body.message)
      finish();
    }
  };

  fhauth.__set__("fh", mockAPI);
  var performAuth = fhauth.__get__("performAuth");
  var authCall = performAuth(opts);
  mockAPI.auth.performAuth = function (req, localAuth, cb) {
    return cb(null, opts.localAuth);
  };

  authCall(req, res, function (err, resp) {
    return finish();
  });
};

exports.it_shoudld_test_auth_failure = function (finish) {
  var opts = { localAuth: {} };

  var req = {
    pause: function () { },
    resume: function () { }
  };

  var res = {
    status: function (status) {
      return res;
    },
    json: function (body) {
      finish();
    }
  };

  var error = {
    body: {
      "message": "error occured"
    }
  };

  fhauth.__set__("fh", mockAPI);
  var performAuth = fhauth.__get__("performAuth");
  var authCall = performAuth(opts);
  mockAPI.auth.performAuth = function (req, localAuth, cb) {
    return cb(error);
  };

  authCall(req, res, function (err, resp) {
    assert.equal(err, error);
    return finish();
  });
};

exports.it_shoudld_test_auth_not_found = function (finish) {
  var opts = { localAuth: {} };

  var req = {
    pause: function () { },
    resume: function () { }
  };

  var res = {
    status: function (status) {
      assert.equal(status, 404);
      return res;
    },
    end: function () {
      finish();
    }
  };

  var performAuth = fhauth.__get__("performAuth");
  var authCall = performAuth(opts);
  mockAPI.auth.performAuth = null;

  authCall(req, res, function (err, resp) {
    return finish();
  });
};