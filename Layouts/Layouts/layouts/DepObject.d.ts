/// <reference path="DepProperty.d.ts" />
/// <reference path="PropertyMap.d.ts" />
declare module layouts {
    class DepObject {
        private static globalPropertyMap;
        registerProperty(name: string, defaultValue?: any, options?: any): DepProperty;
        private internalTypeName;
        typeName: string;
        static getProperty(typeName: string, name: string): DepProperty;
        protected localPropertyValueMap: {
            [propertyName: string]: any;
        };
        getValue(property: DepProperty): any;
        setValue(property: DepProperty, value: any): void;
        protected onPropertyChanged(property: DepProperty, value: any): void;
        private pcHandlers;
        subscribePropertyChanges(handler: {
            (depObject: DepObject, depProperty: DepProperty, value: any): void;
        }): void;
        unsubscribePropertyChanges(handler: {
            (depObject: DepObject, depProperty: DepProperty, value: any): void;
        }): void;
        private bindings;
        private pathBindings;
        bind(property: DepProperty, propertyPath: string, source: DepObject): Binding;
    }
}
