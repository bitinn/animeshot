
/**
 * migration.js
 *
 * Standalone script to migrate database schema
 */

var co = require('co')
var databaseUrl = 'mongodb://localhost:27017/animeshot?w=1'
var mongo = require('yieldb').connect;

function *migration() {
	console.log('migration started')

	var db = yield mongo(databaseUrl)

	var Shots = db.col('shots')

	yield Shots.index({
		sid: 1
	}, {
		unique: true
	})

	yield Shots.index({
		created: -1
	})
};

co(migration).then(function() {
	console.log('migration done')
	process.exit()
}).catch(function(err) {
	console.error(err.stack)
	process.exit()
});
