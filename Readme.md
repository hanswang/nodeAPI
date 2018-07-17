# Overview

This is a simple Proof-Of-Concept code repo to demonstrate a set of RESTful API using NodeJs. And most importantly having code test coverage as much as possible with both unit testing and API testing.

* [Usage](#usage)
* [Architecture Overview](#archi)
* [Testing](#test)

## Usage

Start `mongodb` with `docker`:

	docker run -d -p 27017:27017 -v <repo>/data:/data/db mongo
    
Choose a DB name:

	use articleDB
    
Just use npm:

	npm install
    npm start

