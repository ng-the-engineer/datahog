'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _axios = require('axios');

var _axios2 = _interopRequireDefault(_axios);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var requestToAggregationServer = async function requestToAggregationServer(input) {
  var requestId = input.requestId,
      payload = input.payload;

  try {
    var ack = await _axios2.default.post('http://localhost:3200/api/v1/requests?requestId=' + requestId, payload);
  } catch (err) {
    console.log('err:', err);
  }
};

exports.default = requestToAggregationServer;