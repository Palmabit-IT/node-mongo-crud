"use strict";

var mongojs = require('mongojs');
var json2csv = require('json2csv');
var options = require('./options');
var logger = require('./logger');
var utils = require('./utils');

module.exports = function (collectionName, resultKey) {

  var collection = mongojs(utils.getConnectionString()).collection(collectionName);

  this.getCollection = function () {
    return collection;
  };

  this.getResult = function (req) {
    return req[resultKey];
  };

  this.showResult = function (req, res) {
    res.json(req[resultKey]);
  };

  this.exportResult = function (fields) {
    return function (req, res) {
      var results = Array.isArray(req[resultKey].results) ? req[resultKey].results : req[resultKey];

      if (results) {
        var opts = {
          data: results,
          fields: fields,
          quotes: '',
          del: ';'
        };

        json2csv(opts, function (err, csv) {
          if (err) console.log(err);
          res.send(new Buffer(csv));
        });

      } else {
        res.send(new Buffer({}));
      }
    }
  };

  this.findOne = function (req, res, next) {

    collection.findOne(req.criteria, req.projection, function (err, doc) {

      if (err) {
        logger.error(err);
        return res.status(500).json({
          status: 500,
          message: 'Internal server error'
        });
      }

      if (!doc) {
        return res.status(404).json({
          status: 404,
          message: 'Resource not found'
        });
      }

      req[resultKey] = doc;
      next();
    });
  };

  this.create = function (req, res, next) {

    collection.insert(req.document, function (err, doc) {
      if (err) {
        logger.error(err);
        return res.status(500).json({
          status: 500,
          message: 'Internal server error'
        });
      }

      req[resultKey] = doc;
      next();
    });
  };

  this.remove = function (req, res, next) {

    collection.remove(req.criteria, true, function (err, response) {

      if (err) {
        logger.error(err);
        return res.status(500).json({
          status: 500,
          message: 'Internal server error'
        });
      }

      if (typeof response.n === 'number' && response.n <= 0) {
        return res.status(404).json({
          status: 404,
          message: 'Resource not found'
        });
      }

      res.status(200).json({
        status: 200,
        message: 'Remove successfully.'
      });
    });
  };

  this.update = function (req, res, next) {

    delete req.document._id;

    collection.findAndModify({
      query: req.criteria,
      update: {$set: req.document},
      new: true
    }, function (err, doc, lastErrorObject) {

      if (err) {
        logger.error(err);
        return res.status(500).json({
          status: 500,
          message: 'Cannot update object'
        });
      }

      if (!doc) {
        logger.error(err);
        return res.status(404).json({
          status: 404,
          message: 'Resource not found'
        });
      }

      req[resultKey] = doc;
      next();
    });

  };

  this.find = function (req, res, next) {

    var pagination = options.getPagination(req.query);
    var sort = options.getSort(req.query);
    var search = options.getSearch(req.query);

    req.criteria = req.criteria || {};
    req.criteria = Object.assign(req.criteria, search);

    collection.find(req.criteria, req.projection)
      .sort(sort)
      .limit(pagination.limit)
      .skip(pagination.from, function (err, docs) {

        if (err) {
          logger.error(err);
          return res.status(500).json({
            status: 500,
            message: 'Internal server error'
          });
        }

        if (!pagination.isPaginated) {
          req[resultKey] = docs;
          return next();
        }

        collection.count(req.criteria, function (err, total) {

          if (err) {
            logger.error(err);
            return res.status(500).json({
              status: 500,
              message: 'Internal server error'
            });
          }

          req[resultKey] = options.getPaginatedResponse(docs, pagination, total);
          next();
        });
      });
  };

  this.populate = function (crudRelation, attribute, fields) {
    return function (req, res, next) {
      var id = req[resultKey] ? (req[resultKey][attribute] || null) : null;

      if (!id) {
        next();
      }

      crudRelation.getCollection().findOne({_id: mongojs.ObjectId(id)}, (fields || {}), function (err, doc) {
        if (err) {
          logger.error(err);
          return res.status(500).json({
            status: 500,
            msg: 'Error internal.'
          });
        }

        req[resultKey][attribute] = doc;
        next();
      });
    };
  };

};
