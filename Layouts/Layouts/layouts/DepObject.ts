/// <reference path="DepProperty.ts" />
/// <reference path="PropertyMap.ts" />
/// <reference path="Consts.ts" />

module layouts {
    export class DepObject {
        ///Map of properties for each dependency object
        private static globalPropertyMap: { [typeName: string]: PropertyMap; } = {};

        ///Register a dependency property for the object
        static registerProperty(typeName: string, name: string, defaultValue?: any, options?: any, converter?: { (value: any): any }): DepProperty {
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
                var valueToSet = property.converter != null ? property.converter(value) : value;
                this.localPropertyValueMap[property.name] = valueToSet;
                this.onPropertyChanged(property, valueToSet);
            }
        }

        //Called when a value of a dependency is changed (manually or by a binding)
        protected onPropertyChanged(property: DepProperty, value: any) {
            this.pcHandlers.forEach((h) => {
                h.onChangeDependencyProperty(this, property, value);
            });

            this.bindings.forEach((b) => {
                if (b.twoWay && b.targetProperty == property)
                    b.path.setValue(value);//update source if two way binding
            });
        }

        private pcHandlers: ISupportDependencyPropertyChange[] = [];

        //subscribe to property change events
        subscribePropertyChanges(observer: ISupportDependencyPropertyChange) {
            if (this.pcHandlers.indexOf(observer) == -1)
                this.pcHandlers.push(observer);
        }

        //unsubscribe from property change events
        unsubscribePropertyChanges(observer: ISupportDependencyPropertyChange) {
            var index = this.pcHandlers.indexOf(observer, 0);
            if (index != -1) {
                this.pcHandlers.splice(index, 1);
            }
        }

        private bindings: Array<Binding> = new Array<Binding>();
        private pathBindings: Array<PropertyPath> = new Array<PropertyPath>();

        //bind a property of this object to a source object thru a path
        bind(property: DepProperty, propertyPath: string, twoway: boolean, source: DepObject) {
            var newBinding = new Binding(this, property, propertyPath, source, twoway);
            this.bindings.push(newBinding);
        }
    } 

    class Binding implements ISupportDependencyPropertyChange {
        target: DepObject;
        targetProperty: DepProperty;
        path: PropertyPath;
        twoWay: boolean = false;

        private source: DepObject;
        private sourceProperty: DepProperty;

        constructor(target: DepObject, targetProperty: DepProperty, propertyPath:string, source: DepObject, twoWay: boolean = false) {
            this.target = target;
            this.targetProperty = targetProperty;
            this.path = new PropertyPath(this, propertyPath, source);
            this.twoWay = twoWay;

            this.updateTarget();

            if (this.twoWay)
                this.target.subscribePropertyChanges(this);
        }

        updateTarget(): void {
            var retValue = this.path.getValue();

            if (retValue.success) {
                this.source = retValue.source;
                this.sourceProperty = retValue.sourceProperty;
                this.target.setValue(this.targetProperty, retValue.value);//update target
            }
        }

        onChangeDependencyProperty(depObject: DepObject, depProperty: DepProperty, value: any) {
            if (depObject == this.target &&
                depProperty == this.targetProperty &&
                this.twoWay) {
                //if target property value is changed than update source
                //(twoway mode on)
                this.path.setValue(value);
            }
        }
    }

    class PropertyPath implements ISupportDependencyPropertyChange {
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
            this.source.subscribePropertyChanges(this);
        }

        private detachSource(): void {
            this.source.unsubscribePropertyChanges(this);
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
                    if (this.sourceProperty != null) {
                        //NOTE: this.source can be n UIElement(quite often) and it has custom getValue method that looks for parent values
                        //for the same property given it has FrameworkPropertyMetadataOptions.Inherits as option defined for property
                        //see UEelement.ts/getValue
                        var sourcePropertyValue = this.source.getValue(this.sourceProperty);
                        if (sourcePropertyValue instanceof DepObject) {
                            var nextPath = this.path.substring(dotIndex + 1);
                            if (this.next == null ||
                                (this.next.path != nextPath || this.next.source != sourcePropertyValue))
                                this.next = new PropertyPath(this.owner, this.path.substring(dotIndex + 1), sourcePropertyValue);
                            else
                                this.next.build();
                        }
                        else
                            this.next = null;
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
                return { success: true, value: this.source.getValue(this.sourceProperty), source: this.source, property: null };
            else if (this.name != null && this.path.indexOf(".") == -1) //if path contains a dot but next is null binding is not connected
                return { success: true, value: this.source.getValue(this.sourceProperty), source: this.source, property: this.sourceProperty };
            else
                return { success: false };
        }

        setValue(value: any) {
            if (this.next != null)
                this.next.setValue(value);
            else if (this.name != null && this.path.indexOf(".") == -1)
                this.source.setValue(this.sourceProperty, value);
        }

        onChangeDependencyProperty(depObject: DepObject, depProperty: DepProperty, value: any) {
            if (depObject == this.source &&
                depProperty.name == this.name) {
                this.build();
                this.owner.updateTarget();
            }
        }

    }

}
