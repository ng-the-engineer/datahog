"use strict";

var _koa = require("koa");

var _koa2 = _interopRequireDefault(_koa);

var _koaBodyparser = require("koa-bodyparser");

var _koaBodyparser2 = _interopRequireDefault(_koaBodyparser);

var _koaLogger = require("koa-logger");

var _koaLogger2 = _interopRequireDefault(_koaLogger);

var _root = require("./route/root");

var _root2 = _interopRequireDefault(_root);

var _config = require("./config");

var _config2 = _interopRequireDefault(_config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var app = new _koa2.default();
var port = _config2.default.port || 3100;

app.use((0, _koaBodyparser2.default)());
app.use((0, _koaLogger2.default)());
app.use(_root2.default.routes());

app.listen(port, async function () {
  console.info("Aysnc Client starts listening on port " + port);
});