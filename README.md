sonata-annotationparser
=======================

Annotation parser for [Node](http://nodejs.org).

## Installation

    $ npm install sonata-annotationparser

Install from source code repository:

    $ git clone git@github.com:eyolas/sonata-annotationparser.git
    $ cd sonata-annotationparser
    $ npm install

## Usage parse one file
### Definition of annotation in files

* Must be in comment who start by `/**` and finish by `*/`
* start by `@`
* value must be wrapped in `(` `)`

### Parsing a file without class of annotation

Create a new annotation parser.

    var annotationsParser = require('sonata-annotationparser').AnnotationParser;
    var parser = new annotationsParser();
    var results = parser.extract(fileName, fileDir);

### Parsing with annotation's class

#### Create an annotation

TestAnnotation.js
Property tagName define the annotion

    var AbstractAnnotation = require('sonata-annotationparser').AbstractAnnotation,
        Utils = require('sonata-annotationparser').UtilsAnnotations,

    function TestAnnotation() {
        TestAnnotation.super_.call(this);
        this.tagName = 'Test';
    }

    inherits(TestAnnotation, AbstractAnnotation);

    TestAnnotation.prototype.run = function(value, target, file, filePath) {
        //you process
    };

    module.exports = ScopeAnnotation;

#### Instanciate parser, instanciate annotation, add annotation and extract

    var annotationsParser = require('sonata-annotationparser').AnnotationParser;
    var parser = new annotationsParser();
    va myAnno = new require('TestAnnotation')();
    parser.addAnnotation(myAnno);
    var results = parser.extract(fileName, fileDir);


## Parser of dir

#### Instanciate parser and run

    var Parser = require('sonata-annotationparser').dirParser;

    var parse = new Parser({"dirs": './lib', "execDir": __dirname});
    parse.run();

if you want add annotation, you can add an Annotation.json in dir

sample Annotations.json

    {
        "Annotations": [
            "../../lib/Annotations/RessourceAnnotation.js",
            "../../lib/Annotations/ScopeAnnotation.js"
        ]
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