/// <reference path="DepProperty.ts" />
/// <reference path="PropertyMap.ts" />

module layouts {
    export class DepObject {
        ///Map of properties for each dependency object
        private static globalPropertyMap: { [typeName: string]: PropertyMap; } = {};

        ///Register a dependency property for the object
        static registerProperty(typeName: string, name: string, defaultValue?: any, options?: any): DepProperty {
            if (DepObject.globalPropertyMap[typeName] == null)
                DepObject.globalPropertyMap[typeName] = new PropertyMap();

            var newProperty = new DepProperty(name, defaultValue, options);
            DepObject.globalPropertyMap[typeName].register(name, newProperty);
            return newProperty;
        }

        ///Get the dependency property registered with this type of object (or null if property doesn't exist on object)
        static getProperty(typeName: string, name: string): DepProperty {
            if (DepObject.globalPropertyMap[typeName] == null)
                return null;

            return DepObject.globalPropertyMap[typeName].getProperty(name);
        }

        static lookupProperty(obj: DepObject, name: string): DepProperty {
            if (obj == null)
                return null;

            var typeName = <string>obj["typeName"];
            if (DepObject.globalPropertyMap[typeName] == null)
                return null;

            var property = DepObject.globalPropertyMap[typeName].getProperty(name);
            if (property == null)
                return DepObject.lookupProperty(obj["__proto__"], name);

            return property;
        }

        protected localPropertyValueMap: { [propertyName: string]: any; } = {};

        //Get property value for this object
        getValue(property: DepProperty): any {
            if (this.localPropertyValueMap[property.name] == null)
                return property.defaultValue;

            return this.localPropertyValueMap[property.name];
        }

        //set property value to this object
        setValue(property: DepProperty, value: any) {
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
