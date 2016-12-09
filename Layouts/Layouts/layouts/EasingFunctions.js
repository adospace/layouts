var layouts;
(function (layouts) {
    var EasingFunctions = (function () {
        function EasingFunctions() {
        }
        EasingFunctions.linearTween = function (t, b, c, d) {
            return c * t / d + b;
        };
        ;
        EasingFunctions.easeInQuad = function (t, b, c, d) {
            t /= d;
            return c * t * t + b;
        };
        ;
        EasingFunctions.easeOutQuad = function (t, b, c, d) {
            t /= d;
            return -c * t * (t - 2) + b;
        };
        ;
        EasingFunctions.easeInOutQuad = function (t, b, c, d) {
            t /= d / 2;
            if (t < 1)
                return c / 2 * t * t + b;
            t--;
            return -c / 2 * (t * (t - 2) - 1) + b;
        };
        ;
        EasingFunctions.easeInCubic = function (t, b, c, d) {
            t /= d;
            return c * t * t * t + b;
        };
        ;
        EasingFunctions.easeOutCubic = function (t, b, c, d) {
            t /= d;
            t--;
            return c * (t * t * t + 1) + b;
        };
        ;
        EasingFunctions.easeInOutCubic = function (t, b, c, d) {
            t /= d / 2;
            if (t < 1)
                return c / 2 * t * t * t + b;
            t -= 2;
            return c / 2 * (t * t * t + 2) + b;
        };
        ;
        EasingFunctions.easeInQuart = function (t, b, c, d) {
            t /= d;
            return c * t * t * t * t + b;
        };
        ;
        EasingFunctions.easeOutQuart = function (t, b, c, d) {
            t /= d;
            t--;
            return -c * (t * t * t * t - 1) + b;
        };
        ;
        EasingFunctions.easeInOutQuart = function (t, b, c, d) {
            t /= d / 2;
            if (t < 1)
                return c / 2 * t * t * t * t + b;
            t -= 2;
            return -c / 2 * (t * t * t * t - 2) + b;
        };
        ;
        EasingFunctions.easeInQuint = function (t, b, c, d) {
            t /= d;
            return c * t * t * t * t * t + b;
        };
        ;
        EasingFunctions.easeOutQuint = function (t, b, c, d) {
            t /= d;
            t--;
            return c * (t * t * t * t * t + 1) + b;
        };
        ;
        EasingFunctions.easeInOutQuint = function (t, b, c, d) {
            t /= d / 2;
            if (t < 1)
                return c / 2 * t * t * t * t * t + b;
            t -= 2;
            return c / 2 * (t * t * t * t * t + 2) + b;
        };
        ;
        EasingFunctions.easeInSine = function (t, b, c, d) {
            return -c * Math.cos(t / d * (Math.PI / 2)) + c + b;
        };
        ;
        EasingFunctions.easeOutSine = function (t, b, c, d) {
            return c * Math.sin(t / d * (Math.PI / 2)) + b;
        };
        ;
        EasingFunctions.easeInOutSine = function (t, b, c, d) {
            return -c / 2 * (Math.cos(Math.PI * t / d) - 1) + b;
        };
        ;
        EasingFunctions.easeInExpo = function (t, b, c, d) {
            return c * Math.pow(2, 10 * (t / d - 1)) + b;
        };
        ;
        EasingFunctions.easeOutExpo = function (t, b, c, d) {
            return c * (-Math.pow(2, -10 * t / d) + 1) + b;
        };
        ;
        EasingFunctions.easeInOutExpo = function (t, b, c, d) {
            t /= d / 2;
            if (t < 1)
                return c / 2 * Math.pow(2, 10 * (t - 1)) + b;
            t--;
            return c / 2 * (-Math.pow(2, -10 * t) + 2) + b;
        };
        ;
        EasingFunctions.easeInCirc = function (t, b, c, d) {
            t /= d;
            return -c * (Math.sqrt(1 - t * t) - 1) + b;
        };
        ;
        EasingFunctions.easeOutCirc = function (t, b, c, d) {
            t /= d;
            t--;
            return c * Math.sqrt(1 - t * t) + b;
        };
        ;
        EasingFunctions.easeInOutCirc = function (t, b, c, d) {
            t /= d / 2;
            if (t < 1)
                return -c / 2 * (Math.sqrt(1 - t * t) - 1) + b;
            t -= 2;
            return c / 2 * (Math.sqrt(1 - t * t) + 1) + b;
        };
        ;
        return EasingFunctions;
    }());
    layouts.EasingFunctions = EasingFunctions;
})(layouts || (layouts = {}));
