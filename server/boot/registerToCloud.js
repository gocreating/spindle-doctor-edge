'use strict';

var superagent = require('superagent');
var edge = require('../initial-data/edges.json').edges[0];

module.exports = function registerToCloud(app) {
  var cloud = app.get('cloud');
  var remoteEndpoint = `http://${cloud.host}:${cloud.port}/api`;

  superagent
    .post(remoteEndpoint + '/edges')
    .send(edge)
    .set('Accept', 'application/json')
    .set('Content-Type', 'application/json')
    .end(function(err, res) {
      if (!(err && res.body.error && res.body.error.statusCode === 422)) {
        throw err;
      }

      superagent
        .post(remoteEndpoint + '/edges/login')
        .send({
          email: edge.email,
          password: edge.password,
        })
        .set('Accept', 'application/json')
        .set('Content-Type', 'application/json')
        .end(function(err, res) {
          if (err) { throw err; }

          app.set('edgeId', res.body.userId);
          app.set('edgeToken', res.body.id);
        });
    });
};
