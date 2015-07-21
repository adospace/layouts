/// <reference path="DepProperty.ts" />
/// <reference path="PropertyMap.ts" />

module layouts {
    export class DepObject {
        ///Map of properties for each dependency object
        private static globalPropertyMap: { [typeName: string]: PropertyMap; } = {};

        ///Register a dependency property for the object
        registerProperty(name: string, defaultValue?: any, options?: any): DepProperty {
            if (DepObject.globalPropertyMap[this.typeName] == null)
                DepObject.globalPropertyMap[this.typeName] = new PropertyMap();

            var newProperty = new DepProperty(name, defaultValue, options);
            DepObject.globalPropertyMap[this.typeName].register(name, newProperty);
            return newProperty;
        }

        ///Returns the type name of object
        private internalTypeName: string = null;
        get typeName(): string {
            if (this.internalTypeName == null)
                this.internalTypeName = this.getTypeName();
            return this.internalTypeName;
        }

        ///Get the dependency property registered with this type of object
        static getProperty(typeName: string, name: string): DepProperty {
            return DepObject.globalPropertyMap[typeName].getProperty(name);
        }

        protected localPropertyValueMap: { [propertyName: string]: any; } = {};

        //Get property value for this object
        getValue(property: DepProperty): any {
            if (this.localPropertyValueMap[property.name] == null)
                return property.defaultValue;

            return this.localPropertyValueMap[property.name];
        }

        //set property value to this object
        setValue(property: DepProperty, value : any) {
            if (value != this.localPropertyValueMap[property.name]) {
                this.localPropertyValueMap[property.name] = value;
                this.onPropertyChanged(property, value);
            }
        }

        //Called when a value of a dependency is changed (manually or by a binding)
        protected onPropertyChanged(property: DepProperty, value: any) {
            this.pcHandlers.forEach((h) => {
                h(this, property, value);
            });

            this.bindings.forEach((b) => {
                if (b.twoWay && b.targetProperty == property)
                    b.path.setValue(value);//update source if two way binding
            });
        }

        private pcHandlers: { (depObject: DepObject, depProperty: DepProperty, value: any): void }[] = [];

        //subscribe to property change events
        subscribePropertyChanges(handler: { (depObject: DepObject, depProperty: DepProperty, value: any): void }) {
            if (this.pcHandlers.indexOf(handler) == -1)
                this.pcHandlers.push(handler);
        }

        //unsubscribe from property change events
        unsubscribePropertyChanges(handler: { (depObject: DepObject, depProperty: DepProperty, value: any): void }) {
            var index = this.pcHandlers.indexOf(handler, 0);
            if (index != -1) {
                this.pcHandlers.splice(index, 1);
            }
        }


        private bindings: Array<Binding> = new Array<Binding>();
        private pathBindings: Array<PropertyPath> = new Array<PropertyPath>();

        //bind a property of this object to a source object thru a path
        bind(property: DepProperty, propertyPath: string, source: DepObject): Binding {
            var newBinding = new Binding(this, property, new PropertyPath(propertyPath, source));
            this.bindings.push(newBinding);

            return newBinding;
        }



    } 
}
