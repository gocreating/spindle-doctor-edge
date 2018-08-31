'use strict';

var fs = require('fs');
var mkdirp = require('mkdirp');
var rimraf = require('rimraf');
var path = require('path');
var async = require('async');
var superagent = require('superagent');

function fetch(host, localDir, filename) {
  return function(cb) {
    var stream = fs.createWriteStream(path.join(
      localDir,
      filename
    ));
    var req = superagent
      .get(`${host}/${filename}`)
      .timeout({
        response: 5000,  // Wait 5 seconds for the server to start sending,
        deadline: 10000, // but allow 1 minute for the file to finish loading.
      });

    stream.on('finish', () => {
      cb(null);
    });
    stream.on('error', (err) => {
      cb(err);
    });
    req.pipe(stream);
  };
}

module.exports = function defineRemoteMethods(app) {
  var EdgeModel = app.models.EdgeModel;
  var cloud = app.get('cloud');

  EdgeModel.deploy = function(ctx, modelName, cb) {
    var remoteEndpoint = `http://${cloud.host}:${cloud.port}/models/${modelName}`;
    var modelRootDir = path.join(
      '..', 'spindle-doctor', 'build', 'models', 'edge-server'
    );
    var tmpDir = path.join(modelRootDir, 'tmp-model');
    var modelDir = path.join(modelRootDir, 'deployed-model');

    // prepare directory
    try {
      if (!fs.existsSync(tmpDir)) {
        mkdirp.sync(tmpDir);
      } else {
        rimraf.sync(tmpDir);
        mkdirp.sync(tmpDir);
      }
    } catch (e) {
      cb(e);
    }

    // fetch new model
    async.parallel([
      fetch(remoteEndpoint, tmpDir, 'checkpoint'),
      fetch(remoteEndpoint, tmpDir, 'model.data-00000-of-00001'),
      fetch(remoteEndpoint, tmpDir, 'model.index'),
      fetch(remoteEndpoint, tmpDir, 'model.meta'),
    ], function onModelDownloaded(err, results) {
      if (err) return cb(err);

      // replace old model
      try {
        if (fs.existsSync(modelDir)) {
          rimraf.sync(modelDir);
        }
        fs.rename(tmpDir, modelDir, function onModelReplaced(err) {
          if (err) return cb(err);

          cb(null, {
            modelName: modelName,
          });
        });
      } catch (e) {
        cb(e);
      }
    });
  };
};
