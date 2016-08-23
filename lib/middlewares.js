var mongojs = require('mongojs');
var logger = require('./logger');

module.exports = {

  setId: function (req, res, next) {
    var id = req.params.id;

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      logger.error("Not MongoId Object");
      return res.status(404).json({
        status: 404,
        message: 'Resource not found'
      });
    }

    req.criteria = req.criteria || {};
    req.criteria = Object.assign(req.criteria, {_id: mongojs.ObjectId(id)});
    next();
  }
};

