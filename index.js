
'use strict';

/**
 * index.js
 *
 * App entry point
 */

var fs = require('mz/fs')
var cuid = require('cuid')
var sharp = require('sharp')
var busboy = require('co-busboy')
var mongo = require('yieldb').connect;

var koa = require('koa')
var logger = require('koa-logger')
var bodyParser = require('koa-bodyparser');
var routerFactory = require('koa-router')
var staticFile = require('koa-static')

var templateLoader = require('./templates/marko-template-loader')
var homeTemplate = templateLoader('./home.marko')
var shotTemplate = templateLoader('./shot.marko')
var searchTemplate = templateLoader('./search.marko')

var tmpDirectory = 'upload-tmp/'
var uploadDirectory = 'public/upload/'
var databaseUrl = 'mongodb://localhost:27017/animeshot?w=1'
var siteDomain = 'https://as.bitinn.net'

var app = koa()
var router = routerFactory()
var mongoConnection

app.use(logger())

// only serve file from node.js during development
if (app.env === 'dev') {
	app.use(staticFile('public', {
		maxage: 1000 * 60 * 60 * 24
	}))
}

// database connection
app.use(function *(next) {
	try {
		if (!mongoConnection) {
			mongoConnection = yield mongo(databaseUrl)
		}
		this.db = mongoConnection
	} catch(err) {
		this.db = false
		this.app.emit('error', err, this)
	}

	yield next
})

// error handler
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

// home page
router.get('/', function *(next) {
	yield next
	var db = this.db
	var Shots = db.col('shots')
	var result = yield Shots.find().sort({ created: -1 }).limit(4)
	var data = {
		shots: result
	}
	this.body = homeTemplate.renderSync(data)
})

// shot page
router.get('/shots/:id', function *(next) {
	yield next
	var db = this.db
	var Shots = db.col('shots')
	var shot = yield Shots.findOne({ sid: this.params.id })
	var data = {
		text: shot.text
		, sid: shot.sid
		, size: ['300', '600', '1200']
		, domain: siteDomain
	}
	this.body = shotTemplate.renderSync(data)
})

// search page
router.get('/search', function *(next) {
	yield next
	var db = this.db
	var Shots = db.col('shots')
	var result = yield Shots.find({
		text: {
			$regex: new RegExp('(.*)' + this.query.q + '(.*)', 'i')
		}
	})
	var data = {
		shots: result
		, q: this.query.q
	}
	this.body = searchTemplate.renderSync(data)
})

// file upload
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

// create shot
router.post('/api/shots', function *(next) {
	yield next
	var db = this.db
	var body = this.request.body
	var size = [300, 600, 1200]
	var filename
	for (var i = 0; i < size.length; i++) {
		filename = body.hash + '.' + size[i] + '.jpg'
		yield fs.rename(tmpDirectory + filename, uploadDirectory + filename)
	}
	var Shots = db.col('shots')
	var now = new Date()
	yield Shots.insert({
		sid: body.hash
		, text: body.text
		, created: now
		, updated: now
	})
	this.body = 'done'
})

app.use(router.routes())
app.use(router.allowedMethods())

app.listen(8080)
