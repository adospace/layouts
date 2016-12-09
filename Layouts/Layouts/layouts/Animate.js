var layouts;
(function (layouts) {
    var Animate = (function () {
        function Animate(easeFunction, duration) {
            this.easeFunction = easeFunction;
        }
        return Animate;
    }());
    layouts.Animate = Animate;
})(layouts || (layouts = {}));
