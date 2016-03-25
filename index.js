
/**
 * index.js
 *
 * App entry point
 */

var koa = require('koa')
var logger = require('koa-logger')
var router = require('koa-router')()
var static = require('koa-static')

var app = koa()

router.get('/', function *(next) {
	this.body = 'hello';
})

app.use(logger())
app.use(static('public', {
	maxage: 1000 * 60 * 60 * 24
}))
app.use(router.routes())
app.use(router.allowedMethods())

app.listen(8080)
