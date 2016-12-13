# NodeJs MongoDB Crud

Crud library for NodeJs and MongoDB

## Installation

```
npm install node-mongo-crud --save
```

Add to your project's **.env** file the variables like in the example (**.env.sample**).

## Usage

```js
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

## Connection to database

Put the `DB_` variables in your environment (see **.env.sample** file).
If the `DB_CONNECT` is present with the full connection string, it will be used. Instead the host, db name and credentials variables will be used.

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
