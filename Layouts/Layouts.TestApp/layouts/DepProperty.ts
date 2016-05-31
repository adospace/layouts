module layouts {
    export class DepProperty {
        private _defaultValue: any;
        constructor(public name: string, public typeName:string, defaultValue: any = null, public options: any = null, public converter: { (value: string): any } = null ) {
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