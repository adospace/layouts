module layouts {
    export class EasingFunctions {
        // t: current time, b: begInnIng value, c: change In value, d: duration

        static linearTween(t: number, b: number, c: number, d: number): number {
            return c * t / d + b;
        };
        static easeInQuad(t: number, b: number, c: number, d: number): number {
            t /= d;
            return c * t * t + b;
        };
        static easeOutQuad(t: number, b: number, c: number, d: number): number {
            t /= d;
            return -c * t * (t - 2) + b;
        };
        static easeInOutQuad(t: number, b: number, c: number, d: number): number {
            t /= d / 2;
            if (t < 1) return c / 2 * t * t + b;
            t--;
            return -c / 2 * (t * (t - 2) - 1) + b;
        };
        static easeInCubic(t: number, b: number, c: number, d: number): number {
            t /= d;
            return c * t * t * t + b;
        };
        static easeOutCubic(t: number, b: number, c: number, d: number): number {
            t /= d;
            t--;
            return c * (t * t * t + 1) + b;
        };
        static easeInOutCubic(t: number, b: number, c: number, d: number): number {
            t /= d / 2;
            if (t < 1) return c / 2 * t * t * t + b;
            t -= 2;
            return c / 2 * (t * t * t + 2) + b;
        };
        static easeInQuart(t: number, b: number, c: number, d: number): number {
            t /= d;
            return c * t * t * t * t + b;
        };
        static easeOutQuart(t: number, b: number, c: number, d: number): number {
            t /= d;
            t--;
            return -c * (t * t * t * t - 1) + b;
        };
        static easeInOutQuart(t: number, b: number, c: number, d: number): number {
            t /= d / 2;
            if (t < 1) return c / 2 * t * t * t * t + b;
            t -= 2;
            return -c / 2 * (t * t * t * t - 2) + b;
        };
        static easeInQuint(t: number, b: number, c: number, d: number): number {
            t /= d;
            return c * t * t * t * t * t + b;
        };
        static easeOutQuint(t: number, b: number, c: number, d: number): number {
            t /= d;
            t--;
            return c * (t * t * t * t * t + 1) + b;
        };
        static easeInOutQuint(t: number, b: number, c: number, d: number): number {
            t /= d / 2;
            if (t < 1) return c / 2 * t * t * t * t * t + b;
            t -= 2;
            return c / 2 * (t * t * t * t * t + 2) + b;
        };
        static easeInSine(t: number, b: number, c: number, d: number): number {
            return -c * Math.cos(t / d * (Math.PI / 2)) + c + b;
        };
        static easeOutSine (t: number, b: number, c: number, d: number): number {
            return c * Math.sin(t / d * (Math.PI / 2)) + b;
        };
        static easeInOutSine(t: number, b: number, c: number, d: number): number {
            return -c / 2 * (Math.cos(Math.PI * t / d) - 1) + b;
        };
        static easeInExpo (t: number, b: number, c: number, d: number): number {
            return c * Math.pow(2, 10 * (t / d - 1)) + b;
        };
        static easeOutExpo(t: number, b: number, c: number, d: number): number {
            return c * (-Math.pow(2, -10 * t / d) + 1) + b;
        };
        static easeInOutExpo(t: number, b: number, c: number, d: number): number {
            t /= d / 2;
            if (t < 1) return c / 2 * Math.pow(2, 10 * (t - 1)) + b;
            t--;
            return c / 2 * (-Math.pow(2, -10 * t) + 2) + b;
        };
        static easeInCirc(t: number, b: number, c: number, d: number): number {
            t /= d;
            return -c * (Math.sqrt(1 - t * t) - 1) + b;
        };
        static easeOutCirc(t: number, b: number, c: number, d: number): number {
            t /= d;
            t--;
            return c * Math.sqrt(1 - t * t) + b;
        };
        static easeInOutCirc(t: number, b: number, c: number, d: number): number {
            t /= d / 2;
            if (t < 1) return -c / 2 * (Math.sqrt(1 - t * t) - 1) + b;
            t -= 2;
            return c / 2 * (Math.sqrt(1 - t * t) + 1) + b;
        };
    }
} 