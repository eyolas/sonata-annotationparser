/**
 * Abstract annotation
 * @constructor
 */
function AbstractAnnotation() {
    this.tagName = null;
}

AbstractAnnotation.prototype = {
    run: function(value, target, file, filePath) {},
    getTagName: function(){return this.tagName;}
};

module.exports = AbstractAnnotation;