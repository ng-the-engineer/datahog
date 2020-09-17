"use strict";

var _koa = require("koa");

var _koa2 = _interopRequireDefault(_koa);

var _koaBodyparser = require("koa-bodyparser");

var _koaBodyparser2 = _interopRequireDefault(_koaBodyparser);

var _root = require("./route/root");

var _root2 = _interopRequireDefault(_root);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var app = new _koa2.default();

app.use((0, _koaBodyparser2.default)());
app.use((0, _koaBodyparser2.default)());
app.use(_root2.default.routes());

app.listen(3200, async function () {
  console.log('start listening on 3200');
});