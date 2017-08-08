var ArticleClassConverter = (function () {
    function ArticleClassConverter() {
    }
    ArticleClassConverter.prototype.convert = function (fromValue, context) {
        return fromValue ? "articleSelected" : "article";
    };
    ArticleClassConverter.prototype.convertBack = function (fromValue, context) {
        return fromValue;
    };
    return ArticleClassConverter;
})();
