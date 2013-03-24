var AnnotationParser = require('./AnnotationParser'),
    glob = require('glob'),
    path = require('path'),
    fs = require('fs'),
    Utils = require('./Utils');


var defaultOptions = {
    "annotationJsonName": "Annotations"
};

var REGEX_IS_PATH = /[\/\\:]/;

function DirsParser(opts) {
    this.options = opts || {};
    this.options = Utils.merge(defaultOptions, this.options);
    if (!this.options.hasOwnProperty('dirs')) {
        throw new Error('Error dirs to parse is mandatory');
    } else {
        this.dirs = this.options.dirs;
        if (!Array.isArray(this.options.dirs)) {
            this.dirs = [ this.options.dirs ];
        }

        if (this.options.hasOwnProperty('execDir') && '' !== this.options.execDir.trim()) {
            var execDir = this.options.hasOwnProperty('execDir');
            this.dirs.forEach(function(element, index, array) {
                array[index] = path.resolve(execDir, element);
            });
        }
    }
    this.resultParsing = [];
    this.annotationsParser = new AnnotationParser();
};

DirsParser.prototype.addAnnotation = function(annoPath) {
    var Anno, anno;
    if (REGEX_IS_PATH.test(annoPath)) {
        annoPath = path.resolve(__dirname, annoPath);
    }

    if (annoPath.indexOf('->') !== -1) {
        var split = annoPath.split('->');
        Anno = require(split[0])[split[1]];
    } else {
        Anno = require(annoPath);
    }

    anno = new Anno();
    this.annotationsParser.addAnnotation(anno);
};

DirsParser.prototype.run = function() {
    this._searchAnnotationsDefinitionInDirs();
    this._compile();
};


/**
 * Make compilation (make pasing)
 */
DirsParser.prototype._compile = function() {
    this.dirs.forEach(function(pathSearch) {
        var files = new glob.sync("**/*.js", {cwd : pathSearch});
        this.__compileFiles(files, pathSearch);
    }, this);
};

/**
 * Make compilations of files
 * @param files
 * @param pathSearch
 * @param injectAppContext
 * @private
 */
DirsParser.prototype.__compileFiles = function(files, pathSearch) {
    files.forEach(function(file, i) {
        var fileName = path.basename(file);
        var fileDir = path.dirname(path.resolve(pathSearch, file));
        this.resultParsing.push(this.annotationsParser.extract(fileName, fileDir));
    }, this);
};


DirsParser.prototype._searchAnnotationsDefinitionInDirs = function() {
    this.dirs.forEach(function(pathSearch) {
        var files = new glob.sync("**/" + this.options.annotationJsonName + ".json", {cwd : pathSearch});

        files.forEach(function(file) {
            var pathOfFile = path.resolve(pathSearch, file);
            var dirOfFile = path.dirname(pathOfFile);
            var config = this.__getConfigOnFile(pathOfFile);
            config.Annotations = config.Annotations || [];
            config.Annotations.forEach(function(anno) {
                var annoPath = anno;
                if (REGEX_IS_PATH.test(annoPath)) {
                    annoPath = path.resolve(dirOfFile, anno);
                }
                this.addAnnotation(annoPath);
            }, this);

        }, this);
    }, this);
};


/**
 * Get configuration on file
 * @return {Object}
 * @private
 */
DirsParser.prototype.__getConfigOnFile = function(pathFile) {
    var config = {};
    if (fs.existsSync(pathFile)) {
        var file = fs.readFileSync(pathFile, 'utf8');
        try {
            config = JSON.parse(file);
        } catch (err) {
            console.log(pathFile + ' must be a valid json : ' + err);
        }
    }
    return config;
};

module.exports = DirsParser;