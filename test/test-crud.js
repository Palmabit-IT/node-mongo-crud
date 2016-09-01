require('dotenv').config({
  path: '.env' + (process.env.NODE_ENV ? '.' + process.env.NODE_ENV : '')
});

process.env.NODE_ENV = 'test';

var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('./../index.js');
var should = chai.should();
var mongojs = require('mongojs');
var faker = require('faker');

chai.use(chaiHttp);

var Crud = require('./../lib/crud'),
  httpMocks = require('node-mocks-http'),
  req = {},
  res = {};

var utils = require('./../lib/utils');
var collection = mongojs(utils.getConnectionString()).collection('test');

var responseAttribute = 'response';
var crud = new Crud('test', responseAttribute);
var data;


describe('Crud middlewares: ', function () {
  collection.drop();

  beforeEach(function (done) {
    data = [
      {
        _id: mongojs.ObjectId('56ab3b913d99cfb631144c70'),
        name: faker.name.findName(),
        email: faker.internet.email()
      },
      {
        _id: mongojs.ObjectId('56ab3b913d99cfb631144c71'),
        name: faker.name.findName(),
        email: faker.internet.email()
      }
    ];


    collection.insert(data, function () {
      done();
    });

    req = httpMocks.createRequest({
      method: 'GET',
      url: '/test/path'
    });

    res = httpMocks.createResponse();
  });

  afterEach(function (done) {
    collection.drop();
    done();
  });

  it('should get result', function(done) {
    crud.find(req, res, function next(err) {
      if (err) {
        throw new Error('Expected not to receive an error');
      }

      if (req[responseAttribute].length !== crud.getResult(req).length) {
        throw new Error('Expected to get results');
      }

      done();
    });
  });

  it('should find data', function(done) {
    crud.find(req, res, function next(err) {
      if (err) {
        throw new Error('Expected not to receive an error');
      }

      if (req[responseAttribute].length !== 2) {
        throw new Error('Expected to receive 2 results');
      }

      done();
    });
  });

  it('should find one data', function(done) {
    req.criteria = {_id: mongojs.ObjectId(data[0]._id)};

    crud.findOne(req, res, function next(err) {
      if (err) {
        throw new Error('Expected not to receive an error');
      }

      if (!req[responseAttribute]._id.equals(data[0]._id)) {
        throw new Error('Expected to receive document');
      }

      done();
    });
  });

  it('should create new data', function(done) {
    req.document = {
      name: faker.name.findName(),
      email: faker.internet.email()
    };

    crud.create(req, res, function next(err) {
      if (err) {
        throw new Error('Expected not to receive an error');
      }

      if (req[responseAttribute].name !== req.document.name) {
        throw new Error('Expected to create document');
      }

      done();
    });
  });

  it('should update an element', function(done) {
    var jobTitle = faker.name.jobTitle();
    req.document = Object.assign({}, data[0], {jobTitle: jobTitle});

    crud.update(req, res, function next(err) {
      if (err) {
        throw new Error('Expected not to receive an error');
      }

      if (req[responseAttribute].jobTitle !== jobTitle) {
        throw new Error('Expected to update a document');
      }

      done();
    });
  });
});