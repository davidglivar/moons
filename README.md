Moons
=====

**Orbiting utilities.**

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
