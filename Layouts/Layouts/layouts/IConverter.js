var layouts;
(function (layouts) {
    var ConverterContext = (function () {
        function ConverterContext(source, sourceProperty, target, targetProperty, parameter) {
            this.source = source;
            this.sourceProperty = sourceProperty;
            this.target = target;
            this.targetProperty = targetProperty;
            this.parameter = parameter;
        }
        return ConverterContext;
    }());
    layouts.ConverterContext = ConverterContext;
})(layouts || (layouts = {}));
