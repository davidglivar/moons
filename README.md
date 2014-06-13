Moons
=====

**Orbiting utilities.**

[![wercker status](https://app.wercker.com/status/5ce13e450e6486f3cf55069f48a02b1d/m "wercker status")](https://app.wercker.com/project/bykey/5ce13e450e6486f3cf55069f48a02b1d)

Moons is a frontend javascript utility library that is written for projects 
utilizing [browserify](http://browserify.org/). Getting started with moons is
easy. You can install globally through npm if you want quick access to the `init`
command line tool.

    npm i [-g] moons

Move to your project directory and add the moons modules.

    [./node_modules/.bin/]moons init src/javascripts

You're now ready to begin requiring individual moons into your javascripts.

Development
-----------

### Setup

Clone this repository.

    npm i

This project uses the [gulp](http://gulpjs.com/) task runner. Get it with
    
    npm i -g gulp

### Testing

To run the internal moons tests, run either `gulp test` or `npm test`.

Styleguide
----------

Douglas Crockford's [recommendation](http://javascript.crockford.com/code.html)
is the basis for conventions in this project. However, there are some exceptions.

**(Soft)Tab size**

Use 2 spaces for indentation.

**Comma-First variable declarations**

Best shown through example:

    var bar = true
      , foo = false
      , key;

Each variable gets its own line, even for declarations without assignments.

**Variables in context**

Declare all variables at the start of each scope. Variables at the first scope
level should be prepended with an `_` (underscore).

    (function () {
      var _bar = true
        , _foo = false;

      function init() {
        var key;
        for (key in someGlobalObject) {
          if (someGlobalObject.hasOwnProperty(key)) {
            if (_bar) {
              someGlobalObject[key] = _foo;
            }
          }
        }
        return someGlobalObject;
      }
    }());

Prepending the `_` to variable in the first scope level makes it very clear in
your module which variables are meant to be used in deeper scopes and helps to
avoid naming collisions.

For Objects and Arrays, use Crockford's recommendation.

**Alphabetize**

Order your variables, functions, properties, and methods in alphabetical order.

An exception to this rule is when a variable is dependent on another. Static 
'init' methods are also an exception.

**Documentation**

Use [jsdoc](http://usejsdoc.org/); thoroughly.
