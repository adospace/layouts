

module layouts {
    export interface IConverter {
        convert(fromValue: any, context: any): any;

        convertBack(fromValue: any, context: any): any;
    }
} 