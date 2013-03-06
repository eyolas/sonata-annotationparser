/**
 * merge 2 object
 * @param {Object} a
 * @param {Object} b
 * @return {Object}
 */
exports.merge = function (a, b) {
    for (var i in b) {
        a[i] = b[i];
    }

    return a;
}