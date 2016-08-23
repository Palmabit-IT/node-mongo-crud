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
  return 'mongodb://' + process.env.DB_HOST + ':' + process.env.DB_PORT + '/' + process.env.DB_NAME;
};