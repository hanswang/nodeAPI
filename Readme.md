# Overview

This is a simple Proof-Of-Concept code repo to demonstrate a set of RESTful API using NodeJs. And most importantly having code test coverage as much as possible with both unit testing and API testing.

* [Usage](#usage)
* [Architecture Overview](#archi)
* [Testing & QA](#test)

## Usage

Start `mongodb` with `docker`:

	docker run -d -p 27017:27017 -v <repo>/data:/data/db mongo
    
Choose a DB name:

	use articleDB
    
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
                   
                   
## Testing

##### Lint
As first part of quality assure, we want to make sure all the code is following the same coding standard. So `eslint` is introduced as part of `npm` script by running,

	npm run lint
    
##### Unit test
First part of test start with unit testing. Just use `npm` below,

	npm run test:unit
    
This unit test is covering every model & controller we have created so far.

##### API test
As extension of testing after unit test, API testing is created in aspects of end-to-end covering what has been invoked during the process. To run this, it actually starts a server, and connects to mongoDB in the backend, try to test on the given URL endpoints and expects the results to be either successfully inserted, or successfully fetched. To invoke, run

	npm run test:api

