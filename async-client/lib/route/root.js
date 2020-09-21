'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _koaRouter = require('koa-router');

var _koaRouter2 = _interopRequireDefault(_koaRouter);

var _requestServer = require('../services/requestServer');

var _requestServer2 = _interopRequireDefault(_requestServer);

var _idGenerator = require('../services/idGenerator');

var _idGenerator2 = _interopRequireDefault(_idGenerator);

var _config = require('../config');

var _config2 = _interopRequireDefault(_config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = (0, _koaRouter2.default)();
var baseUrl = _config2.default.baseUrl;

router.post(baseUrl + '/requests', async function (ctx) {
  var payload = ctx.request.body;
  ctx.assert(payload.providers, 422, 'Body parameter providers is mandatory');
  var requestId = (0, _idGenerator2.default)();
  try {
    await (0, _requestServer2.default)({ requestId: requestId, payload: payload });
    console.info(new Date().toISOString() + ' requestId: ' + requestId + ' placed request');
    createResponse({ ctx: ctx, body: { status: 'REQUEST_PLACED', requestId: requestId }, status: 200 });
  } catch (err) {
    createResponse({ ctx: ctx, body: err, status: 400 });
  }
});

router.post(baseUrl + '/callback', async function (ctx) {
  var payload = ctx.request.body;
  var request = ctx.query;
  ctx.assert(Array.isArray(payload), 422, 'Body require an array');
  ctx.assert(request.requestId, 422, 'Query parameter "requestId" is mandatory');
  try {
    console.info(new Date().toISOString() + ' requestId: ' + request.requestId + ' received callback: ' + JSON.stringify(payload, null, 5));
    createResponse({ ctx: ctx, body: { message: 'CALLBACK_ACKNOWLEDGED' }, status: 200 });
  } catch (err) {
    createResponse({ ctx: ctx, body: err, status: 400 });
  }
});

var createResponse = function createResponse(context) {
  var ctx = context.ctx,
      body = context.body,
      status = context.status;

  ctx.body = body;
  ctx.status = status;
};

exports.default = router;