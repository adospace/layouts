
module layouts {
    export class Ext {
        static hasProperty(obj: any, propertyName: string) : boolean {
            var proto = obj.__proto__ || obj.constructor.prototype;
            if (proto == "")
                return;
            return (propertyName in obj) || (propertyName in proto);
        }

        static isString(obj: any): boolean {
            return (typeof obj == "string" || obj instanceof String)
        }
    }

}

interface String {
    format(...replacements: string[]): string;
    toUpperFirstLetter(): string;
    toLowerFirstLetter(): string;
    startsWith(other: string): boolean;
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

if (!String.prototype.toUpperFirstLetter) {
    String.prototype.toUpperFirstLetter = function () {
        return this.charAt(0).toUpperCase() + this.slice(1);
    }
}

if (!String.prototype.toLowerFirstLetter) {
    String.prototype.toLowerFirstLetter = function () {
        return this.charAt(0).toLowerCase() + this.slice(1);
    }
}

if (!String.prototype.startsWith) {
    String.prototype.startsWith = function (other) {
        return this.charAt(0).toLowerCase() + this.slice(1);
    }
}

interface Number {
    isEpsilon(): boolean;
    isCloseTo(other: number): boolean;
    isLessThen(other: number): boolean;
    isGreaterThen(other: number): boolean;
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
Number.prototype.isLessThen = function (other) {
    return (this - other) < 1e-10;
}
Number.prototype.isGreaterThen = function (other) {
    return (this - other) > 1e-10;
}


class InstanceLoader {
    constructor(private context: Object) {

    }

    getInstance(name: string, ...args: any[]) {
        //find namespaces if any
        var tokens = name.split(".");
        var iterationObject = this.context[tokens[0]];
        if (iterationObject == null)
            return null;

        for (var i = 1; i < tokens.length; i++) {
            iterationObject = iterationObject[tokens[i]];
            if (iterationObject == null)
                return null;
        }

        var instance = Object.create(iterationObject.prototype);
        instance.constructor.apply(instance, args);
        return instance;
    }
}
