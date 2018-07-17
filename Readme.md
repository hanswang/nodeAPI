# Overview

This is a simple Proof-Of-Concept code repo to demonstrate a set of RESTful API using NodeJs. And most importantly having code test coverage as much as possible with both unit testing and API testing.

* [Usage](#usage)
* [Architecture Overview](#archi)
* [Testing & QA](#test)

## Usage

Start `mongodb` with `docker`:

	docker run -d -p 27017:27017 -v <repo>/data:/data/db mongo

    
Just use npm:

	npm install
    npm start
    
## Architecture Overview


                                                                 +-----------------+
    Route  GET         Route  POST       Route GET               |                 |   +
    /articles/id       /articles         /tags/tagName/date      |  Routes         |   |
                                                                 +-----------------+   |
          ^                ^                 ^                                         |
          |                |                 |                                         |
          +----+-----------+                 |                   +-----------------+   |
               |                             |                   |                 |   |
               +                             +                   |  Controllers    |   |
           Article   <-----+    +-----> Tag                      |                 |   |
           Controller      |    |       Controller               +-----------------+   |
                           |    |                                                      |
                           +    +                                +-----------------+   |
                         Article Model                           |                 |   |
                             ^                                   |  Model          |   |
                             |                                   +-----------------+   |
                             |                                                         |
                   +---------+-------+                           +-----------------+   |
                   | Docker          |                           |                 |   v
                   |-----------------|                           |  Database       |
                   |                 |                           +-----------------+
                   |     MongoDB     |
                   +-----------------+
                   

Above is the simple diagram to illustrate the architecture details of this repo code. To put it in a simple way, 

* The underlying data schema is using MongoDB to store JSON formatted data as article data definition.
* Mongoose is chosen to map article db with article model in NodeJs to handle database in ORM mode
* On top of Model, its standard MVC-like design. So we have controllers to handle the process on Model
* On user end, we have routes build-up on ExpressJs API to wire controller action with API endpoints

## Testing

##### Lint
As first part of quality assure, we want to make sure all the code is following the same coding standard. So `eslint` is introduced as part of `npm` script by running,

	npm run lint
    
##### Unit test
First part of test start with unit testing. Just use `npm` below,

	npm run test:unit
    
This unit test is covering every model & controller we have created so far. And we have mocked the database using `sinon` and `mockery` (for runtime dependency injection). Also we choose `node-mocks-http` as testing framework to mock HTTP server.

##### API test
As extension of testing after unit test, API testing is created in aspects of end-to-end covering what has been invoked during the process. To run this, it actually starts a server, and connects to mongoDB in the backend, try to test on the given URL endpoints and expects the results to be either successfully inserted, or successfully fetched. To invoke, run

	npm run test:api

##### Coverage
Best part comes last, the `istanbul` package provides handy tool to track how well unit-tests exercise the codebase. So we simple add `nyc` into the package repo and added on top of `mocha`.

	"test:api": "nyc mocha --exit \"./test/apiTest.*.js\"",
    "test:unit": "nyc mocha \"./test/test.*.js\"",
    
To combine things together, we have

	npm run test 
    # equivalent to npm run test:unit && npm run test:api
