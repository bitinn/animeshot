
'use strict';

/**
 * index.js
 *
 * App entry point
 */

var fs = require('mz/fs')
var cuid = require('cuid')
var sharp = require('sharp')
var koa = require('koa')
var logger = require('koa-logger')
var bodyParser = require('koa-bodyparser');
var routerFactory = require('koa-router')
var staticFile = require('koa-static')
var busboy = require('co-busboy')
var templateLoader = require('./templates/marko-template-loader')
var homeTemplate = templateLoader('./main.marko')
var createStream = require('stream').PassThrough
var mongo = require('yieldb').connect;

var tmpDirectory = 'upload-tmp/'
var uploadDirectory = 'public/upload/'
var databaseUrl = 'mongodb://localhost:27017/animeshot?w=1'

var app = koa()
var router = routerFactory()
var db

router.get('/', function *(next) {
	yield next
	this.body = homeTemplate.renderSync()
})

router.post('/api/files', function *(next) {
	yield next
	var body = busboy(this, {
		autoFields: true
	})
	var part, p1, p2, p3, hash, s1
	while (part = yield body) {
		hash = cuid()
		s1 = sharp()
		s1 = part.pipe(s1)
		p1 = s1.clone().resize(300).quality(95).toFile(tmpDirectory + hash + '.300.jpg')
		p2 = s1.clone().resize(600).quality(95).toFile(tmpDirectory + hash + '.600.jpg')
		p3 = s1.clone().resize(1200).quality(95).toFile(tmpDirectory + hash + '.1200.jpg')
		yield Promise.all([p1, p2, p3])
	}
	this.body = hash
})

router.post('/api/shots', function *(next) {
	yield next
	var body = this.request.body
	var size = [300, 600, 1200]
	var filename
	for (var i = 0; i < size.length; i++) {
		filename = body.hash + '.' + size[i] + '.jpg'
		yield fs.rename(tmpDirectory + filename, uploadDirectory + filename)
	}
	this.body = 'done'
})

app.use(logger())
app.use(staticFile('public', {
	maxage: 1000 * 60 * 60 * 24
}))

app.use(function *(next) {
	try {
		if (!db) {
			db = yield mongo(databaseUrl)
		}
		this.db = db
	} catch(err) {
		this.db = false
		this.app.emit('error', err, this)
	}

	yield next
})

app.use(function *(next) {
	if (this.db === false) {
		this.status = 500
		this.body = 'mongodb down'
		return;
	}

	try {
		yield next;
	} catch (err) {
		this.app.emit('error', err, this);
		this.status = 500
		this.body = 'internal error'
		return;
	}
})

app.use(bodyParser())
app.use(router.routes())
app.use(router.allowedMethods())

app.listen(8080)
