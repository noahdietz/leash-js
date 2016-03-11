'use strict';

var forever = require('forever-monitor');
var exec = require('child_process').exec;
var os = require('os');
var path = require('path');
var fs = require('fs');

var db;

/**
 * this function starts leash's mongodb service, pointing at the provided dbPath
 * @param {string} dbPath path of target mongodb directory
 * @param {Object} options includes 'logs' 'port'
 * @param {function} callback takes an error
 */
function start(dbPath, options, callback) {
  available('mongod', function(err, stdout) {
    if (err) {
      return callback(err);
    }

    var resolvedDb = path.resolve(dbPath);
    var cmd = ['mongod', '--dbpath', resolvedDb, '--logpath'];

    if (options.logs) {
      cmd.push(path.resolve(options.logs));
    } else {
      options.log = path.join(os.tmpdir(), 'mongo.log-'+Date.now());
      fs.openSync(options.log, 'w');
      cmd.push(options.log);

      console.log('leash is logging mongod to', options.log);
    }

    if (options.port) {
      cmd.push('--port');
      cmd.push(options.port);
    }

    try {
      db = forever.start(cmd, {
        uid: 'leash-db',
        silent: true,
        env: options.env ? options.env : {}
      });
    } catch(e) {
      callback(e);
    }

    callback(null);
  });
}

/**
 * stops leash's mongodb service
 * @param {function} callback takes error, called upon completion of stopping
 */
function stop(callback) {
  try {
    db.stop();
  } catch(e) {
    callback(e);
  }

  callback(null);
}

module.exports = {
  start: start,
  stop: stop
}

/**
 * asynchronously checks the availability of a given command
 * @param {string} cmd command to check availability of
 * @param {function} callback takes error and stdout of which call
 */
function available(cmd, callback) {
  exec('/usr/bin/which ' + cmd,
    function(error, stdout, stderr) {
      callback(error, stdout);
    }
  );
}
