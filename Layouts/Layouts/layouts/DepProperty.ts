module layouts {
    export class DepProperty {
        name: string;
        private _defaultValue: any;
        options: any;
        converter: { (value: any): any }
        constructor(name: string, defaultValue: any = null, options: any = null, converter: { (value: any): any } = null ) {
            this.name = name;
            this._defaultValue = defaultValue;
            this.options = options;
            this.converter = converter;
        }

        //default value map
        private _defaultValueMap: { [typeName: string]: any; } = {};
        overrideDefaultValue(typeName: string, defaultValue: any) {
            this._defaultValueMap[typeName] = defaultValue;
        }

        //get default value of this property for passed object
        getDefaultValue(depObject: DepObject) {
            var typeName = depObject["typeName"];
            if (typeName in this._defaultValueMap)
                return this._defaultValueMap[typeName];

            return this._defaultValue;
        }
    }
} 