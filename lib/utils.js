"use strict";

/*
 * getNextSequence
 */
exports.getNextSequence = function (name, collection, callback) {
  collection.findAndModify({
      query: {_id: name},
      update: {$inc: {seq: 1}},
      new: true
    },
    function (err, doc) {

      if (err) {
        return callback(err, null);
      }

      let counter = (doc && doc.seq) ? doc.seq : null;
      callback(null, counter);

    }
  );
};


/**
 * Get DB connection string
 * @returns {string}
 */
exports.getConnectionString = function () {
  let hasConnectString = process.env.DB_CONNECT && process.env.DB_CONNECT.length > 0;
  return hasConnectString ? process.env.DB_CONNECT : ('mongodb://' + process.env.DB_HOST + ':' + process.env.DB_PORT + '/' + process.env.DB_NAME);
};


/**
 * Get nested object by key
 * @returns {string|object}
 */
exports.getNestedObject = function (o, key) {
  if (key.indexOf('.') < 0) {
    return typeof o === 'object' ? o[key] : undefined;
  }

  key = key.replace(/\[(\w+)\]/g, '.$1'); // convert indexes to properties
  key = key.replace(/^\./, '');           // strip a leading dot

  var a = key.split('.');

  for (let i = 0, n = a.length; i < n; i += 1) {
    var k = a[i];

    if (k in o) {
      o = o[k];
    } else {
      return;
    }
  }

  return o;
};


/**
 * Set nested object by key
 */
exports.setNestedObject = function (o, key, value) {
  if (key.indexOf('.') < 0) {
    if (typeof o === 'object') {
      o[key] = value;
    }
    return;
  }

  var pList = key.split('.');
  var len = pList.length;

  for(var i = 0; i < len-1; i += 1) {
    let elem = pList[i];
    if(!o[elem]) o[elem] = {}
    o = o[elem];
  }

  return o[pList[len-1]] = value;
};