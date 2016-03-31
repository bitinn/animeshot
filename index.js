
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
	var name = uploadDirectory + hash + '.jpg'
	var part
	while (part = yield body) {
		part.pipe(fs.createWriteStream(name))
	}
	this.body = 'done'
})

app.use(logger())
app.use(static('public', {
	maxage: 1000 * 60 * 60 * 24
}))
app.use(router.routes())
app.use(router.allowedMethods())

app.listen(8080)
