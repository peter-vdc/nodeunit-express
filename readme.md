### nodeunit-express

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

## Tester
```js
var testerInitializer = require('nodeunit-express/tester');
var app = require('../app');

var globalOptions = {
    prepare: function (res) {
        if (res.body != null) {
            res.body = JSON.parse(res.body);
        }

        return res;
    }
};

var tester = testerInitializer(globalOptions);

module.exports['test test'] = tester(app, {
    method: 'POST',
    uri: '/user/123/',
    headers: {
        'some-header-key': 'some-header-value'
    },
    body: {
        "first_name": "Mike",
        "last_name": "Portnoy"
    }

    expect: {
        // any response property what you need check

        // statusCode
        statusCode: 400

        // expect body as object. By default all specified expected properties compare deeply by test.deepEqual
        body: {
            error: {
                name: "ValidationError",
                rule: "required"
            }
        }

        // expect body as function if you need check not all property
        body: function (body, response, options, args) {
            // args: tester returns a function. args is called function arguments. for example for nodeunit first argument is "test"
            // response: response object
            // options: compiled options
            var test = args[0];

            test.strictEqual(body.error.name, 'ValidationError');
        }
    }
});
```