var DEFAULT_LIMIT_DOC = 20;
var logger = require('./logger');

module.exports = {

  getPagination: function (query) {

    var pag = {
      from: 0,
      limit: 0,
      page: 0,
      isPaginated: false
    };


    if (query.page && parseInt(query.page) > 0) {
      pag.page = parseInt(query.page);

      var numDoc = DEFAULT_LIMIT_DOC;
      if (query.limit && parseInt(query.limit) > 0) {
        numDoc = parseInt(query.limit);
      }

      pag.from = (numDoc * (pag.page - 1));
      pag.limit = numDoc;

      pag.isPaginated = true;
    }

    else if (query.from && query.to && parseInt(query.from) <= parseInt(query.to)) {
      pag.from = parseInt(query.from);
      pag.limit = parseInt(query.to) - pag.from + 1;
    }

    return pag;
  },

  getSort: function (query) {

    var sort = {};

    if (query.sort) {
      try {
        sort = typeof query.sort === 'object' ? query.sort : JSON.parse(query.sort);
      } catch (e) {
        logger.error('error in parsing: ' + typeof query.sort === 'object' ? JSON.stringify(query.sort) : query.sort);
      }
    }

    return sort;
  },

  getSearch: function (query) {
    var search = {};

    if (query.search && query.keywords) {
      var keywords = [];
      var parsedKeywords = typeof query.keywords === 'string' ? JSON.parse(query.keywords) : query.keywords;

      try {

        parsedKeywords.forEach(function (key) {
          var object = {};
          object[key] = {$regex: '.*' + query.search + '.*', $options: "i"};
          keywords.push(object);
        });

      } catch (e) {
        logger.error('error in parsing: ' + query.keywords, e);
      }

      search = {$or: keywords};
    }

    return search;
  },

  getPaginationStages: function (pagination) {
    var stages = [];

    if (pagination && pagination.limit) {
      stages.push({
        $limit: pagination.limit
      });
    }
    if (pagination && pagination.from) {
      stages.push({
        $skip: pagination.from
      });
    }

    return stages;
  },

  getPaginatedResponse: function (docs, pagination, total) {
    var to = pagination.from + pagination.limit;

    if (to > total) {
      to = total;
    }

    var opt = {
      from: pagination.from,
      limit: pagination.limit,
      page: pagination.page
    };

    return {
      options: opt,
      results: docs || [],
      total: total,
      show_prev: pagination.from > 1,
      show_next: to < total
    };
  }
};