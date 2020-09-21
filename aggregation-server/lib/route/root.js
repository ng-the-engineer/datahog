'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _koaRouter = require('koa-router');

var _koaRouter2 = _interopRequireDefault(_koaRouter);

var _datahog = require('../controllers/datahog');

var _datahog2 = _interopRequireDefault(_datahog);

var _config = require('../config');

var _config2 = _interopRequireDefault(_config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = (0, _koaRouter2.default)();
var baseUrl = _config2.default.baseUrl;

router.post(baseUrl + '/requests', async function (ctx) {
  var requestId = ctx.query.requestId;
  var providers = ctx.request.body.providers;
  console.log('callback url:', ctx.request.body);
  var callbackUrl = ctx.request.body.callbackUrl;

  ctx.assert(requestId, 422, 'Query parameter "requestId" is mandatory');
  ctx.assert(providers, 422, 'Body parameter "providers" is mandatory');
  ctx.assert(callbackUrl, 422, 'Body parameter "callbackUrl" is mandatory');

  try {
    var record = (0, _datahog2.default)({ requestId: requestId, providers: providers, callbackUrl: callbackUrl });
    createResponse({ ctx: ctx, body: record, status: 200 });
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