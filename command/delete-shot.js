
/**
 * delete-shot.js
 *
 * Standalone script to delete a single shot
 */

var co = require('co')
var fs = require('mz/fs')
var mongo = require('yieldb').connect
var opts = require('minimist')(process.argv.slice(2))

var uploadDirectory = 'public/upload/'
var databaseUrl = 'mongodb://localhost:27017/animeshot?w=1'

function *migration() {
	console.log('deletion start')
	var db = yield mongo(databaseUrl)
	var Shots = db.col('shots')
	var sid = opts._[0]

	yield Shots.remove({
		sid: sid
	})

	yield fs.unlink(uploadDirectory + sid + '.300.jpg')
	yield fs.unlink(uploadDirectory + sid + '.600.jpg')
	yield fs.unlink(uploadDirectory + sid + '.1200.jpg')
}

co(migration).then(function() {
	console.log('deletion done')
	process.exit()
}).catch(function(err) {
	console.error(err.stack)
	process.exit()
})
