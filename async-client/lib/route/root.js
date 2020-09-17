"use strict";

var _koaRouter = require("koa-router");

var _koaRouter2 = _interopRequireDefault(_koaRouter);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = (0, _koaRouter2.default)();
var baseUrl = '/api/v1';

router.get("" + baseUrl, async function (ctx) {
  ctx.body = {
    'message': 'Hello world'
  };
});

router.post(baseUrl + "/requests", async function (ctx) {
  var body = ctx.request.body;

  ctx.assert(body.providers, 422, 'Body parameter providers is mandatory');

  try {
    var record = {
      status: 'Acknowledged',
      requestId: 999
    };
    ctx.body = record;
    ctx.status = 200;
  } catch (err) {
    ctx.body = err;
    ctx.status = 400;
  }
});

router.post(baseUrl + "/callback", async function (ctx) {
  var body = ctx.request.body;
  var request = ctx.query;

  ctx.assert(body.provider, 422, 'Body parameter "provider" is mandatory');
  ctx.assert(body.records, 422, 'Body parameter "records" is mandatory');
  ctx.assert(request.requestId, 422, 'Query parameter "requestId" is mandatory');

  try {
    var result = {
      provider: 'gas',
      records: []
    };
    ctx.body = result;
    ctx.status = 200;
  } catch (err) {
    ctx.body = err;
    ctx.status = 400;
  }
});

module.exports = router;