

module layouts {
    export class ConverterContext {
        constructor(public source: DepObject,
            public sourceProperty: DepProperty,
            public target: DepObject,
            public targetProperty: DepProperty,
            public parameter: any) {
        }
    }

    export interface IConverter {
        convert(fromValue: any, context: ConverterContext): any;

        convertBack(fromValue: any, context: ConverterContext): any;
    }
} 