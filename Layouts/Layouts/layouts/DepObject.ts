/// <reference path="DepProperty.ts" />
/// <reference path="PropertyMap.ts" />
/// <reference path="Consts.ts" />
/// <reference path="IConverter.ts" />

module layouts {
    export class DepObject {
        ///Map of properties for each dependency object
        private static globalPropertyMap: { [typeName: string]: PropertyMap; } = {};

        ///Register a dependency property for the object
        static registerProperty(typeName: string, name: string, defaultValue?: any, options?: any, converter?: { (value: string): any }): DepProperty {
            if (DepObject.globalPropertyMap[typeName] == null)
                DepObject.globalPropertyMap[typeName] = new PropertyMap();

            var newProperty = new DepProperty(name, defaultValue, options, converter);
            DepObject.globalPropertyMap[typeName].register(name, newProperty);
            return newProperty;
        }

        ///Get the dependency property registered with this type of object (or null if property doesn't exist on object)
        static getProperty(typeName: string, name: string): DepProperty {
            if (DepObject.globalPropertyMap[typeName] == null)
                return null;

            return DepObject.globalPropertyMap[typeName].getProperty(name);
        }

        ///Get only dependency properties registered with this type of object
        static getProperties(typeName: string): DepProperty[] {
            if (DepObject.globalPropertyMap[typeName] == null)
                return null;

            return DepObject.globalPropertyMap[typeName].all();
        }

        ///Iterate over all dependency properties registered with this type of object and its ancestors
        static forAllProperties(obj: DepObject, callback: (depProperty: DepProperty) => void) {
            if (obj == null)
                throw new Error("obj == null");

            var typeName = <string>obj["typeName"];
            if (DepObject.globalPropertyMap[typeName] == null)
                return;

            DepObject.getProperties(typeName).forEach(_=> callback(_));

            if (DepObject.globalPropertyMap[typeName] == null)
                return;

            if (obj["__proto__"] != null)
                DepObject.forAllProperties(obj["__proto__"], callback);
        }

        static lookupProperty(obj: DepObject, name: string): DepProperty {
            if (obj == null)
                throw new Error("obj == null");

            var typeName = <string>obj["typeName"];
            var property = DepObject.globalPropertyMap[typeName] == null ? null : DepObject.globalPropertyMap[typeName].getProperty(name);
            if (property == null && obj["__proto__"] != null)
                return DepObject.lookupProperty(obj["__proto__"], name);

            return property;
        }

        protected localPropertyValueMap: { [propertyName: string]: any; } = {};
        //Get property value for this object
        getValue(property: DepProperty): any {
            if (this.localPropertyValueMap[property.name] == null) {
                return property.getDefaultValue(this);
            }

            return this.localPropertyValueMap[property.name];
        }

        //set property value to this object
        setValue(property: DepProperty, value: any) {
            if (value != this.localPropertyValueMap[property.name]) {
                var valueToSet = property.converter != null && Ext.isString(value) ? property.converter(value) : value;
                var oldValue = this.localPropertyValueMap[property.name];
                this.localPropertyValueMap[property.name] = valueToSet;
                this.onDependencyPropertyChanged(property, valueToSet, oldValue);
            }
        }

        //Called when a value of a dependency is changed (manually or by a binding)
        protected onDependencyPropertyChanged(property: DepProperty, value: any, oldValue: any) {
            this.dpcHandlers.forEach((h) => {
                h.onChangeDependencyProperty(this, property, value);
            });

            this.bindings.forEach((b) => {
                if (b.twoWay && b.targetProperty == property)
                    b.path.setValue(value);//update source if two way binding
            });
        }

        private dpcHandlers: ISupportDependencyPropertyChange[] = [];

        //subscribe to dep property change events
        subscribeDependencyPropertyChanges(observer: ISupportDependencyPropertyChange) {
            if (this.dpcHandlers.indexOf(observer) == -1)
                this.dpcHandlers.push(observer);
        }

        //unsubscribe from dep property change events
        unsubscribeDependencyPropertyChanges(observer: ISupportDependencyPropertyChange) {
            var index = this.dpcHandlers.indexOf(observer, 0);
            if (index != -1) {
                this.dpcHandlers.splice(index, 1);
            }
        }

        //Called when a value of a plain property is changed
        protected onPropertyChanged(propertyName: string, value: any, oldValue: any) {
            this.pcHandlers.forEach((h) => {
                h.onChangeProperty(this, propertyName, value);
            });
        }

        private pcHandlers: ISupportPropertyChange[] = [];

        //subscribe to property change events
        subscribePropertyChanges(observer: ISupportPropertyChange) {
            if (this.pcHandlers.indexOf(observer) == -1)
                this.pcHandlers.push(observer);
        }

        //unsubscribe from property change events
        unsubscribePropertyChanges(observer: ISupportPropertyChange) {
            var index = this.pcHandlers.indexOf(observer, 0);
            if (index != -1) {
                this.pcHandlers.splice(index, 1);
            }
        }

        private bindings: Array<Binding> = new Array<Binding>();

        //bind a property of this object to a source object thru a path
        bind(property: DepProperty, propertyPath: string, twoway: boolean, source: DepObject, converter: IConverter) {
            var newBinding = new Binding(this, property, propertyPath, source, twoway, converter);
            this.bindings.push(newBinding);
        }
    } 

    class Binding implements ISupportDependencyPropertyChange {
        target: DepObject;
        targetProperty: DepProperty;
        path: PropertyPath;
        twoWay: boolean = false;
        converter: IConverter = null

        private source: DepObject;
        private sourceProperty: DepProperty;

        constructor(target: DepObject, targetProperty: DepProperty, propertyPath: string, source: DepObject, twoWay: boolean = false, converter: IConverter = null) {
            this.target = target;
            this.targetProperty = targetProperty;
            this.path = new PropertyPath(this, propertyPath, source);
            this.twoWay = twoWay;
            this.converter = converter;

            this.updateTarget();

            if (this.twoWay)
                this.target.subscribeDependencyPropertyChanges(this);
        }

        updateTarget(): void {
            var retValue = this.path.getValue();

            if (retValue.success) {
                this.source = retValue.source;
                this.sourceProperty = retValue.sourceProperty;
                this.target.setValue(this.targetProperty, this.converter != null ? this.converter.convert(retValue.value, null) : retValue.value);//update target
            }
        }

        onChangeDependencyProperty(depObject: DepObject, depProperty: DepProperty, value: any) {
            if (depObject == this.target &&
                depProperty == this.targetProperty &&
                this.twoWay) {
                //if target property value is changed than update source
                //(twoway mode on)
                this.path.setValue(this.converter != null ? this.converter.convertBack(value, null) : value);
            }
        }
    }

    class PropertyPath implements ISupportDependencyPropertyChange, ISupportPropertyChange {
        owner: Binding;
        path: string;
        name: string;
        source: DepObject;
        private next: PropertyPath;
        private prev: PropertyPath;
        sourceProperty: DepProperty;

        constructor(owner: Binding, path: string, source: DepObject) {
            this.owner = owner;
            this.path = path;
            this.source = source;
            this.build();
            this.attachShource();
        }

        private attachShource(): void {
            if (this.sourceProperty == null) {
                if (this.source.subscribePropertyChanges != null)
                    this.source.subscribePropertyChanges(this);
            }
            //if source is not a depObject I can't subscribe/unsubscribe to its property changes
            else if (this.source["unsubscribeDependencyPropertyChanges"] != null)
                this.source.subscribeDependencyPropertyChanges(this);
        }

        private detachSource(): void {
            if (this.source.unsubscribePropertyChanges != null)
                this.source.unsubscribePropertyChanges(this);
            //if source is not a depObject I can't subscribe/unsubscribe to its property changes
            if (this.source["unsubscribeDependencyPropertyChanges"] != null)
                this.source.unsubscribeDependencyPropertyChanges(this);
        }

        private build(): void {
            var oldNext = this.next;

            if (this.next != null) {
                this.next.detachSource();
                this.next.prev = null;
            }

            if (this.path == Consts.stringEmpty ||
                this.path == ".") {
                this.name = ".";
                this.next = null;
            }
            else {
                var dotIndex = this.path.indexOf(".");
                if (dotIndex > -1) {
                    //first token of path is the name of property to look in source object
                    this.name = this.path.substring(0, dotIndex);
                    this.sourceProperty = DepObject.lookupProperty(this.source, this.name);

                    //NOTE: this.source can be n UIElement(quite often) and it has custom getValue method that looks for parent values
                    //for the same property given it has FrameworkPropertyMetadataOptions.Inherits as option defined for property
                    //see UEelement.ts/getValue
                    var sourcePropertyValue = (this.sourceProperty != null) ?
                        this.source.getValue(this.sourceProperty) : //if it's a dep property get value using DepObject hierarchy
                        this.source[this.name];//otherwise try using normal property lookup method

                    if (sourcePropertyValue != null) {
                        //is source value is not null means I can go further in search...
                        var nextPath = this.path.substring(dotIndex + 1);
                        if (this.next == null ||
                            this.next.path != nextPath ||
                            this.next.source != sourcePropertyValue)
                            this.next = new PropertyPath(this.owner, this.path.substring(dotIndex + 1), sourcePropertyValue);
                        else if (this.next != null)
                            this.next.build();
                    }
                    else
                        this.next = null;
                }
                else {
                    this.name = this.path;
                    this.sourceProperty = DepObject.lookupProperty(this.source, this.name);
                    this.next = null;
                }
            }

            if (this.next != null) {
                this.next.attachShource();//attachSource() test if already attached
                this.next.prev = this;
            }

            if (this.next != oldNext)
                this.onPathChanged();
        }

        private onPathChanged(): void {
            if (this.prev != null)
                this.prev.onPathChanged();
            else {
                this.owner.updateTarget();
            }
        }

        getValue(): any {
            if (this.next != null)
                return this.next.getValue();
            else if (this.name == ".")
                return {
                    success: true,
                    value: this.source,
                    source: this.source,
                    property: null
                };
            else if (this.name != null && this.path.indexOf(".") == -1) //if path contains a dot but next is null binding is not connected
                return {
                    success: true,
                    value: this.sourceProperty != null ? this.source.getValue(this.sourceProperty) : this.source[this.name],
                    source: this.source,
                    property: this.sourceProperty
                };
            else
                return {
                    success: false
                };
        }

        setValue(value: any) {
            if (this.next != null)
                this.next.setValue(value);
            else if (this.name != null && this.path.indexOf(".") == -1) {
                if (this.sourceProperty != null)
                    this.source.setValue(this.sourceProperty, value);
                else
                    this.source[this.name] = value;//try update source using default property lookup access
            }
        }

        onChangeDependencyProperty(depObject: DepObject, depProperty: DepProperty, value: any) {
            if (depObject == this.source &&
                depProperty.name == this.name) {
                this.build();
                this.owner.updateTarget();
            }
        }

        onChangeProperty(source: any, propertyName: string, value: any) {
            if (source == this.source &&
                propertyName == this.name) {
                this.build();
                this.owner.updateTarget();
            }
        }

    }

}
