sonata-annotationParser
=======================

Annotation parser for [Node](http://nodejs.org).

## Installation

    $ npm install sonata-annotationParser

Install from source code repository:

    $ git clone git@github.com:eyolas/sonata-annotationParser.git
    $ cd sonata-annotationParser
    $ npm install

## Usage

### Parsing without class of annotation

Create a new annotation parser.

    var annotationsParser = require('sonata-annotationParser').annotationsParser;
    var parser = new annotationsParser();
    var results = parser.extract(fileName, fileDir);

### Parsing with annotation's class

#### Create an annotation

TestAnnotation.js

    var AbstractAnnotation = require('sonata-annotationParser').AbstractAnnotation,
        Utils = require('sonata-annotationParser').UtilsAnnotations,
        inherits = require('util').inherits;

    function TestAnnotation() {
        TestAnnotation.super_.call(this);
        this.tagName = 'Test';
    }

    inherits(TestAnnotation, AbstractAnnotation);

    TestAnnotation.prototype.run = function(value, target, file, filePath) {
        if (Utils.isString(value) || (value === Object(value) && value.hasOwnProperty('name'))) {
            //...
        }
    };

    module.exports = ScopeAnnotation;

An object class

    /**
     * @Test
     */
    function object() {

    }



## Credits

  - [David Touzet](http://github.com/eyolas)

## License

(The MIT License)

Copyright (c) 2013 Touzet David

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
the Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.