module tsui {
    export class DepProperty {
        name: string;
        defaultValue: any;
        options: any;
        constructor(name: string, defaultValue: any = null, options: any = null) {
            this.name = name;
            this.defaultValue = defaultValue;
            this.options = options;
        }


    }
} 