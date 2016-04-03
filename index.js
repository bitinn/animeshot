
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
var mimetypes = require('mime-types')
var mongo = require('yieldb').connect
var escapeString = require('escape-string-regexp')

var koa = require('koa')
var logger = require('koa-logger')
var bodyParser = require('koa-bodyparser')
var routerFactory = require('koa-router')
var staticFile = require('koa-static')

var templateLoader = require('./templates/marko-template-loader')
var homeTemplate = templateLoader('./home.marko')
var shotTemplate = templateLoader('./shot.marko')
var searchTemplate = templateLoader('./search.marko')
var recentTemplate = templateLoader('./recent.marko')
var analyticsTemplate = templateLoader('./analytics.marko')
var headerTemplate = templateLoader('./header.marko')
var searchBoxTemplate = templateLoader('./search-box.marko')
var pagingTemplate = templateLoader('./paging.marko')
var commonMetaTemplate = templateLoader('./common-meta.marko')

var tmpDirectory = 'upload-tmp/'
var uploadDirectory = 'public/upload/'
var databaseUrl = 'mongodb://localhost:27017/animeshot?w=1'
var siteDomain = 'https://as.bitinn.net'
var assetRevision = 'r2'

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
		return
	}

	try {
		yield next
	} catch (err) {
		this.app.emit('error', err, this)
		this.status = 500
		this.body = 'internal error'
		return
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
		, analytics: analyticsTemplate
		, header: headerTemplate
		, searchBox: searchBoxTemplate
		, meta: commonMetaTemplate
		, rev: assetRevision
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
		, analytics: analyticsTemplate
		, header: headerTemplate
		, searchBox: searchBoxTemplate
		, meta: commonMetaTemplate
		, rev: assetRevision
	}
	this.body = shotTemplate.renderSync(data)
})

// search page
router.get('/search', function *(next) {
	yield next
	var db = this.db
	var Shots = db.col('shots')
	var result
	if (this.query.q.length > 0 && this.query.q.length < 100) {
		result = yield Shots.find({
			text: {
				$regex: new RegExp('(.*)' + escapeString(this.query.q) + '(.*)', 'i')
			}
		}).sort({ created: -1 }).limit(20)
	}
	var data = {
		shots: result
		, q: this.query.q
		, analytics: analyticsTemplate
		, header: headerTemplate
		, searchBox: searchBoxTemplate
		, paging: pagingTemplate
		, meta: commonMetaTemplate
		, rev: assetRevision
		, next: result.length === 20 ? 2 : 1
		, page: 'search'
	}
	this.body = searchTemplate.renderSync(data)
})

// search paging
router.get('/search/page/:page', function *(next) {
	yield next
	var db = this.db
	var page = parseInt(this.params.page, 10) || 1
	if (page < 1) {
		this.redirect('/recent')
		return
	}
	var Shots = db.col('shots')
	var result
	if (this.query.q.length > 0 && this.query.q.length < 100) {
		result = yield Shots.find({
			text: {
				$regex: new RegExp('(.*)' + escapeString(this.query.q) + '(.*)', 'i')
			}
		}).sort({ created: -1 }).limit(20).skip((page - 1) * 20)
	}
	var data = {
		shots: result
		, q: this.query.q
		, analytics: analyticsTemplate
		, header: headerTemplate
		, searchBox: searchBoxTemplate
		, paging: pagingTemplate
		, meta: commonMetaTemplate
		, rev: assetRevision
		, prev: page - 1
		, next: result.length === 20 ? page + 1 : 1
		, page: 'search'
	}
	this.body = searchTemplate.renderSync(data)
})

// recent page
router.get('/recent', function *(next) {
	yield next
	var db = this.db
	var Shots = db.col('shots')
	var result = yield Shots.find().sort({ created: -1 }).limit(20)
	var data = {
		shots: result
		, analytics: analyticsTemplate
		, header: headerTemplate
		, searchBox: searchBoxTemplate
		, paging: pagingTemplate
		, meta: commonMetaTemplate
		, rev: assetRevision
		, next: result.length === 20 ? 2 : 1
		, page: 'recent'
	}
	this.body = recentTemplate.renderSync(data)
})

// recent paging
router.get('/recent/page/:page', function *(next) {
	yield next
	var db = this.db
	var page = parseInt(this.params.page, 10) || 1
	if (page < 1) {
		this.redirect('/recent')
		return
	}
	var Shots = db.col('shots')
	var result = yield Shots.find().sort({ created: -1 }).limit(20).skip((page - 1) * 20)
	var data = {
		shots: result
		, analytics: analyticsTemplate
		, header: headerTemplate
		, searchBox: searchBoxTemplate
		, paging: pagingTemplate
		, meta: commonMetaTemplate
		, rev: assetRevision
		, prev: page - 1
		, next: result.length === 20 ? page + 1 : 1
		, page: 'recent'
	}
	this.body = recentTemplate.renderSync(data)
})

// file upload
router.post('/api/files', function *(next) {
	yield next
	var headers = this.headers
	var body = busboy(this, {
		autoFields: true
		, checkFile: function (fn, file, name, enc, mime) {
			var ext = mimetypes.extension(mime)
			if (ext !== 'jpeg' && ext !== 'png') {
				return new Error('file type not supported')
			}
		}
	})
	var part, p1, p2, p3, hash, s1
	while (part = yield body) {
		hash = cuid()
		s1 = sharp().limitInputPixels(4000 * 4000)
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
	var hash = body.hash.replace(/\W/g, '').substr(0, 25)
	var text = body.text.substr(0, 140)
	var size = [300, 600, 1200]
	var filename
	for (var i = 0; i < size.length; i++) {
		filename = hash + '.' + size[i] + '.jpg'
		yield fs.rename(tmpDirectory + filename, uploadDirectory + filename)
	}
	var Shots = db.col('shots')
	var now = new Date()
	yield Shots.insert({
		sid: hash
		, text: text
		, created: now
		, updated: now
	})
	this.body = 'done'
})

app.use(router.routes())
app.use(router.allowedMethods())

if (app.env === 'dev') {
	app.listen(8080)
} else {
	app.listen(8081)
}
