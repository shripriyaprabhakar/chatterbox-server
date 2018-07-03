var request = require('request');
var expect = require('chai').expect;

describe('server', function() {
  it('should respond to GET requests for /classes/messages with a 200 status code', function(done) {
    request('http://127.0.0.1:3000/classes/messages', function(error, response, body) {
      expect(response.statusCode).to.equal(200);
      done();
      //The testing framework needs to know when the asynchronous operation 
      //is finished so it can check that the test passed. So Mocha gives 
      //you a done() function that you call to let it know.
    });
  });

  it('should send back parsable stringified JSON', function(done) {
    request('http://127.0.0.1:3000/classes/messages', function(error, response, body) {
      expect(JSON.parse.bind(this, body)).to.not.throw();
      done();
    });
  });

  it('should send back an object', function(done) {
    request('http://127.0.0.1:3000/classes/messages', function(error, response, body) {
      var parsedBody = JSON.parse(body);
      expect(parsedBody).to.be.an('object');
      done();
    });
  });

  it('should send an object containing a `results` array', function(done) {
    request('http://127.0.0.1:3000/classes/messages', function(error, response, body) {
      var parsedBody = JSON.parse(body);
      expect(parsedBody).to.be.an('object');
      expect(parsedBody.results).to.be.an('array');
      done();
    });
  });

  it('should accept POST requests to /classes/messages', function(done) {
    var requestParams = {method: 'POST',
      uri: 'http://127.0.0.1:3000/classes/messages',
      json: {
        username: 'Jono',
        text: 'Do my bidding!'}
    };

    request(requestParams, function(error, response, body) {
      expect(response.statusCode).to.equal(201);
      done();
    });
  });

  it('should respond with messages that were previously posted', function(done) {
    var requestParams = {method: 'POST',
      uri: 'http://127.0.0.1:3000/classes/messages',
      json: {
        username: 'Jono',
        text: 'Do my bidding!'}
    };

    request(requestParams, function(error, response, body) {
      // Now if we request the log, that message we posted should be there:
      request('http://127.0.0.1:3000/classes/messages', function(error, response, body) {
        var messages = JSON.parse(body).results;
        expect(messages[0].username).to.equal('Jono');
        expect(messages[0].text).to.equal('Do my bidding!');
        done();
      });
    });
  });

  it('Should 404 when asked for a nonexistent endpoint', function(done) {
    request('http://127.0.0.1:3000/arglebargle', function(error, response, body) {
      expect(response.statusCode).to.equal(404);
      done();
    });
  });


});


/*
Mocha is able to handle synchronous and asynchronous tests. When you run a synchronous test, you can just pass it as an anonymous function to it and you don't have to do anything else: Mocha knows the test is over when the function returns. However, if you are running an asynchronous test, you have to tell Mocha that the test is asynchronous. There are two ways to do this:

Declare that the anonymous function you pass to it takes a parameter. Mocha will call your anonymous function with a single parameter which is a function you must call to indicate that your test is over. (This parameter is called done due to tradition. You could call it complete, cb or platypus and it would work just the same.) If you call done without a value, the test is successful. With a value, the test is a failure and the value should be an Error object or an object derived from Error.
Return a promise: Mocha will wait for the promise to be resolved or rejected. If resolved, the test is successful. If rejected, the test failed.
The code you see when you do done.toString() is just the code of the function that Mocha passes to your test when you declare it to take a parameter. You can see in it some of what I mentioned above (e.g. if you pass a parameter to done it should be an Error or derived from Error). The done in there is another done function which is private to Mocha.

*/
