
/**
 * index.js
 *
 * App entry point
 */

var fs = require('fs')
var cuid = require('cuid')
var sharp = require('sharp')
var koa = require('koa')
var logger = require('koa-logger')
var router = require('koa-router')()
var static = require('koa-static')
var busboy = require('co-busboy')
var templateLoader = require('./templates/marko-template-loader')
var homeTemplate = templateLoader('./main.marko')
var createStream = require('stream').PassThrough

var uploadDirectory = 'upload-tmp/'

var app = koa()

router.get('/', function *(next) {
	yield next
	this.body = homeTemplate.renderSync()
})

router.post('/api/files', function *(next) {
	yield next
	var body = busboy(this, {
		autoFields: true
	})
	var hash = cuid()
	var s1 = sharp()
	var part, p1, p2, p3
	while (part = yield body) {
		s1 = part.pipe(s1)
		p1 = s1.clone().resize(300).quality(95).toFile(uploadDirectory + hash + '.300.jpg')
		p2 = s1.clone().resize(600).quality(95).toFile(uploadDirectory + hash + '.600.jpg')
		p3 = s1.clone().resize(1200).quality(95).toFile(uploadDirectory + hash + '.1200.jpg')
		yield Promise.all([p1, p2, p3])
	}
	this.body = hash
})

app.use(logger())
app.use(static('public', {
	maxage: 1000 * 60 * 60 * 24
}))
app.use(router.routes())
app.use(router.allowedMethods())

app.listen(8080)
