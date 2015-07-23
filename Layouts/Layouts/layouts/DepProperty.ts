module layouts {
    export class DepProperty {
        name: string;
        defaultValue: any;
        options: any;
        converter: { (value: any): any }
        constructor(name: string, defaultValue: any = null, options: any = null, converter: { (value: any): any } = null ) {
            this.name = name;
            this.defaultValue = defaultValue;
            this.options = options;
            this.converter = converter;
        }


    }
} 