var fs = require("fs"),
    path = require("path"),
    util = require('util'),
    AbstractAnnotation = require('./AbstractAnnotation.js');

/**
 * Regex
 */
var REGEX_START_COMMENT = /^\s*\/\*\*/,
    REGEX_END_COMMENT = /\*\/\s*$/,
    REGEX_LINE_HEAD_CHAR = /^\s*\*/,
    REGEX_LINES = /\r\n|\n/,
    REGEX_TRIM = /^\s+|\s+$/g,
    REGEX_TARGET = /(this\.|var\s)*(\w*)(\s|:|=|;)/,
    REGEX_ANNOTATION_WITH_VALUE = /(?:^|\n)\s*@(\w*)\(([^\)]*)\)/,
    REGEX_ANNOTATION_WITH_NO_VALUE = /(?:^|\n)\s*@(\w*)/;

/**
 * Annotation parser
 * @constructor
 */
function AnnotationsParser(){
    this.annotations = {};
}

AnnotationsParser.prototype = {
    /**
     * Add an annotation (must be an instance of AbstractAnnotation)
     * @param annotation
     */
    addAnnotation: function(annotation) {
        if (annotation instanceof AbstractAnnotation) {
            var tagName = annotation.getTagName();
            if (!this.annotations.hasOwnProperty(tagName)) {
                this.annotations[tagName] = annotation;
            }
        }
    },

    /**
     * Get map of comment and call annotations
     * @param comment
     * @param filename
     * @param filePath
     * @return {*}
     * @private
     */
    __getCommentMap: function(comment, filename, filePath) {
        var lines = comment.split(REGEX_LINES),
            target = lines.pop(),
            len = lines.length,
            tag,
            results = [],
            lineHeadCharRegex = REGEX_LINE_HEAD_CHAR,
            hasLineHeadChar = lines[0] && lineHeadCharRegex.test(lines[0]);

        if (hasLineHeadChar) {
            target = target.replace(lineHeadCharRegex, '');
        }

        target = target.replace(REGEX_TRIM, "").match(REGEX_TARGET);

        if (null === target || undefined === target[2]) {
            return null;
        }

        target = target[2];

        for (var i = 0; i < len; i++) {
            var value = {},
                mapping = [],
                parts;

            if (hasLineHeadChar) {
                lines[i] = lines[i].replace(lineHeadCharRegex, '');
            }
            lines[i] = lines[i].replace(REGEX_TRIM, "");
            if (lines[i] === '' || lines[i].substr(0, 1) !== '@') {
                continue;
            }

            parts = lines[i].match(REGEX_ANNOTATION_WITH_VALUE);

            if (null !== parts) {
                tag = parts[1];

                mapping = parts[2].split(',');
                for (var j = 0, maplen = mapping.length; j < maplen; j++) {
                    if (mapping[j].lastIndexOf("=") !== -1) {
                        var vals = mapping[j].split('=');
                        value[vals[0].replace(REGEX_TRIM, "")] = vals[1].replace(REGEX_TRIM, "");
                    } else {
                        var vals = mapping[j].replace(REGEX_TRIM, "");
                        if (maplen === 1){
                            value = vals;
                        } else {
                            value[vals] = vals;
                        }
                    }
                }
            } else {
                parts = lines[i].match(REGEX_ANNOTATION_WITH_NO_VALUE);
                if (null === parts) {
                    continue;
                }
                tag = parts[1];
                value = '';
            }

            results.push({
                filename: filename,
                target: target,
                value: value,
                tag: tag
            });

            if (this.annotations.hasOwnProperty(tag)) {
                this.annotations[tag].run(value, target, filename, filePath);
            }

        }

        return results;
    },

    /**
     * Extract annotations
     * @param filename
     * @param dirname
     * @return {Array}
     */
    extract: function(filename, dirname) {
        var commentmap = [],
            extract,
            filePath = path.resolve(dirname, filename),
            code = fs.readFileSync(path.resolve(dirname, filename), 'utf-8'),
            commentlines, comment,
            lines = code.split(REGEX_LINES),
            len = lines.length, i, linenum;

        for (i = 0; i < len; i++) {
            line = lines[i];
            if(REGEX_START_COMMENT.test(line)) {
                commentlines = [];

                linenum = i + 1;

                while (i < len && (!REGEX_END_COMMENT.test(line))) {
                    commentlines.push(line);
                    i++;
                    line = lines[i];
                }

                i++;
                line = lines[i];
                commentlines.push(line);

                commentlines.shift();
                comment = commentlines.join('\n');

                commentmap = commentmap || [];
                extract = this.__getCommentMap(comment, filename, filePath);
                if (null !== extract) {
                    commentmap.push(extract);
                }

            }
        }

        return commentmap;
    }
};

module.exports = AnnotationsParser;