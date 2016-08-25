# NodeJs MongoDB Crud

Crud library for NodeJs and MongoDB

## Installation

```
npm install node-mongo-crud --save
```

Add to your project's **.env** file the variables like in the example (**.env.sample**).

## Usage

```
var Crud = require('node-mongo-crud').Crud;

var crud = new Crud('collection_name', 'result_key_name');

//Find one middleware
crud.findOne(req, res, next);

//Find middleware
crud.find(req, res, next);

//Populate middleware
crud.populate(req, res, next);

//Create middleware
crud.create(req, res, next);

//Update middleware
crud.update(req, res, next);

//Delete middleware
crud.remove(req, res, next);

//Show results middleware (return results)
crud.showResult(req, res);

//Results are in **res['result_key_name']** attribute
```

## Test

### Setup

* Create **.env.test** file (copy and rename .env.sample).
* Create **logs/test.log file**.

### Run tests
```
npm test
```

### Coverage

```
npm run-script test-travis
```

## License

[MIT license](LICENSE)
