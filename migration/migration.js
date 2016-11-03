
/**
 * migration.js
 *
 * Standalone script to migrate database schema
 */

var co = require('co')
var mongo = require('yieldb').connect
var pinyin = require('pinyin')

var databaseUrl = 'mongodb://localhost:27017/animeshot?w=1'
var databaseRevision = 3;

function *migration() {
	console.log('migration started')

	var db = yield mongo(databaseUrl)

	var Revision = db.col('revision')

	var ver = yield Revision.findOne()

	if (ver && ver.currentVersion >= databaseRevision) {
		return false
	}

	yield Revision.update({}, { currentVersion: databaseRevision }, { upsert: true })

	var Shots = db.col('shots')

	yield Shots.index({
		sid: 1
	}, {
		unique: true
	})

	yield Shots.index({
		created: -1
	})

	var shots = yield Shots.find()

	// slow but we will take it for now
	for (var i = 0; i < shots.length; i++) {
		var normalized = [].concat.apply([], pinyin(shots[i].text))
		yield Shots.update({ sid: shots[i].sid }, { normalized: normalized.join(' ') })
	}

	return true
}

co(migration).then(function(state) {
	if (state) {
		console.log('migration done, updated')
	} else {
		console.log('migration done, no update')
	}
	process.exit()
}).catch(function(err) {
	console.error(err.stack)
	process.exit()
})
