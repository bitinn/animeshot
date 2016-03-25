
/**
 * index.js
 *
 * App entry point
 */

var koa = require('koa');
var logger = require('koa-logger');
var router = require('koa-router')();

var app = koa();

router.get('/', function *(next) {
	this.body = 'hello';
});

app.use(logger());
app.use(router.routes());
app.use(router.allowedMethods());

app.listen(8080);
