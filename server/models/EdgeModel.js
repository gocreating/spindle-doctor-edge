'use strict';

module.exports = function(EdgeModel) {
  EdgeModel.remoteMethod('deploy', {
    description: 'Fetches trained model from cloud server',
    accepts: [{
      arg: 'ctx',
      type: 'object',
      http: { source: 'context' },
    }, {
      arg: 'modelName',
      type: 'any',
      required: true,
      description: 'Model name',
    }],
    returns: {
      arg: 'deployResult', type: 'object', root: true,
    },
    http: {
      verb: 'post',
      path: '/:modelName/deploy',
    },
  });
};
