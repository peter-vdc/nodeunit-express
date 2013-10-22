### express-mock-request

nodeunit-express is a utility function to make it easy to write tests for Node.JS [Express](https://github.com/visionmedia/express) applications.
It is based on the https://github.com/rubymaverick/express-mock-request project, which I could not get to work properly.

#### How to use:

First, install using npm:

    npm install nodeunit-express

Then require it in your test file like so:

```javascript
var request = require('nodeunit-express');
```

Let's say you want to test this simple express app to make sure it returns the proper status, body, and headers:

```javascript
var express = require('express')
var app = module.exports = express();

app.get('/', function(req, res) {
  res.send("ok", {'Content-Type': 'text/html'}, 200);
});

// Only start listening on 8080 when this file is run directly i.e.: node app.js
if(!module.parent) {
  app.listen(8080);
}
```

You could write your test like so:

```javascript
var request = require('nodeunit-express');
// require the express application, notice how we exported the express app using `module.exports` above
var app = require('../app');

// This is a nodeunit test example
exports.testGet = function(test){
  var express = request(app);
  express.get('/').expect(function(response) {
    // response is the response from hitting '/'
    test.equal(response.body, "ok");
    test.equal(response.statusCode, 200);
    test.equal(response.headers['content-type'], "text/html");
    test.done();
    express.close();
  });
}
```
