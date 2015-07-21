
interface String {
    format(...replacements: string[]): string;
}

if (!String.prototype.format) {
    String.prototype.format = function () {
        var args = arguments;
        return this.replace(/{(\d+)}/g, function (match, number) {
            return typeof args[number] != 'undefined'
                ? args[number]
                : match
                ;
        });
    };
}

interface Object {
    getTypeName(): string;
}

Object.prototype.getTypeName = function () {
    var funcNameRegex = /function (.{1,})\(/;
    var results = (funcNameRegex).exec((this).constructor.toString());
    return (results && results.length > 1) ? results[1] : "";
};

interface Number {
    isEpsilon(): boolean;
    isCloseTo(other: number): boolean;
    minMax(min: number, max: number);
}

Number.prototype.isEpsilon = function () {
    return Math.abs(this) < 1e-10;
};
Number.prototype.isCloseTo = function (other) {
    if (!isFinite(other) && !isFinite(this))
        return true;
    return Math.abs(this - other) < 1e-10;
};
Number.prototype.minMax = function (min: number, max: number) {
    return Math.max(min, Math.min(this, max));
};
