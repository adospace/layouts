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

            var newProperty = new DepProperty(name, typeName, defaultValue, options, converter);
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
            if (property.name in this.localPropertyValueMap) {
                return this.localPropertyValueMap[property.name];
            }

            return property.getDefaultValue(this);
        }

        //set property value to this object
        setValue(property: DepProperty, value: any) {
            var oldValue = this.getValue(property);
            var valueToSet = property.converter != null && Ext.isString(value) ? property.converter(value) : value;
            if (oldValue != valueToSet) {
                this.localPropertyValueMap[property.name] = valueToSet;
                this.onDependencyPropertyChanged(property, valueToSet, oldValue);
            }
        }

        //reset property value to its default
        resetValue(property: DepProperty) {
            if (property.name in this.localPropertyValueMap) {
                var oldValue = this.getValue(property);
                delete this.localPropertyValueMap[property.name];
                this.onDependencyPropertyChanged(property, null, oldValue);
            }
        }

        //Called when a value of a dependency property is changed (manually or by a binding)
        protected onDependencyPropertyChanged(property: DepProperty, value: any, oldValue: any) {
            this.dpcHandlers.forEach((h) => {
                h.onDependencyPropertyChanged(this, property);
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
        bind(property: DepProperty, propertyPath: string, twoway: boolean, source: DepObject, converter?: IConverter, converterParameter?: any, format?: string) {
            var newBinding = new Binding(this, property, propertyPath, source, twoway, converter, converterParameter, format);
            this.bindings.push(newBinding);
        }

        static logBindingTraceToConsole: boolean = false;
    } 

    class Binding implements ISupportDependencyPropertyChange {
        target: DepObject;
        targetProperty: DepProperty;
        path: PropertyPath;
        twoWay: boolean = false;
        converter: IConverter = null
        converterParameter: any = null
        format: string = null;

        private source: DepObject;
        private sourceProperty: DepProperty;

        constructor(target: DepObject, targetProperty: DepProperty, propertyPath: string, source: DepObject, twoWay: boolean = false, converter: IConverter = null, converterParameter: any = null, format: string = null) {
            this.target = target;
            this.targetProperty = targetProperty;
            this.path = new PropertyPath(this, propertyPath, source);
            this.twoWay = twoWay;
            this.converter = converter;
            this.converterParameter = converterParameter;
            this.format = format;

            this.updateTarget();

            if (this.twoWay)
                this.target.subscribeDependencyPropertyChanges(this);
        }

        updateTarget(): void {
            var retValue = this.path.getValue();

            if (retValue.success) {
                this.source = retValue.source;
                this.sourceProperty = retValue.sourceProperty;
                var valueToSet = this.converter != null ? this.converter.convert(retValue.value,
                    {
                        source: this.source,
                        sourceProperty: this.sourceProperty,
                        target: this.target,
                        targetProperty: this.targetProperty,
                        parameter: this.converterParameter
                    }) : retValue.value;
                this.target.setValue(this.targetProperty, this.format != null ? this.format.format(valueToSet) : valueToSet);//update target
            }
            else if (this.source != null) {
                //if source is not null and retValue.success is false
                //means that something in binding to original source has broken
                //I need to reset the source and update target property to its default value
                this.target.resetValue(this.targetProperty)
                this.source = null;
                this.sourceProperty = null;
            }
        }

        onDependencyPropertyChanged(depObject: DepObject, depProperty: DepProperty) {
            if (depObject == this.target &&
                depProperty == this.targetProperty &&
                this.twoWay) {
                //if target property value is changed than update source
                //(twoway mode on)
                var value = depObject.getValue(depProperty);
                this.path.setValue(this.converter != null ? this.converter.convertBack(value, {
                    source: this.source,
                    sourceProperty: this.sourceProperty,
                    target: this.target,
                    targetProperty: this.targetProperty,
                    parameter: this.converterParameter
                }) : value);
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
        indexers: string[];

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

        private lookForIndexers() {
            var re = /([\w_]+)(\[([\w_]+)\])/gmi;
            var m;
            var nameStr = this.name;

            if ((m = re.exec(nameStr)) !== null) {
                if (m.index === re.lastIndex) {
                    re.lastIndex++;
                }
                // View your result using the m-variable.
                // eg m[0] etc.
                //there is at least an indexer in the form property[...]...
                //property name is returned in m[1]
                this.name = m[1];

                //so get the first indexer and save it in this.indexers
                this.indexers = [];
                this.indexers.push(m[3]);

                //for now support up to 2 indexer like 'property[..][..]'
                //search for a second indexer if exists
                re = /([\w_]+)(\[([\w_]+)\])(\[([\w_]+)\])/gmi;

                if ((m = re.exec(nameStr)) !== null) {
                    if (m.index === re.lastIndex) {
                        re.lastIndex++;
                    }
                    this.indexers.push(m[5]);
                }

            } else
                this.indexers = null;
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
                    this.lookForIndexers();

                    this.sourceProperty = DepObject.lookupProperty(this.source, this.name);

                    //NOTE: this.source can be n UIElement(quite often) and it has custom getValue method that looks for parent values
                    //for the same property given it has FrameworkPropertyMetadataOptions.Inherits as option defined for property
                    //see UEelement.ts/getValue
                    var sourcePropertyValue = (this.sourceProperty != null) ?
                        this.source.getValue(this.sourceProperty) : //if it's a dep property get value using DepObject hierarchy
                        this.source[this.name];//otherwise try using normal property lookup method


                    //if an indexer list is defined (binding to something like 'property[...]...')
                    //go deeper to property value accessed with the indexer
                    if (this.indexers != null && sourcePropertyValue != null) {
                        sourcePropertyValue = sourcePropertyValue[this.indexers[0]];
                        if (this.indexers.length > 1 && sourcePropertyValue != null)
                            sourcePropertyValue = sourcePropertyValue[this.indexers[1]];
                    }

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
                    else {
                        this.next = null;
                    }
                }
                else {
                    this.name = this.path;
                    this.lookForIndexers();
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
            else if (this.name != null && this.path.indexOf(".") == -1) { //if path contains a dot but next is null binding is not connected
                if (DepObject.logBindingTraceToConsole) 
                    if (this.sourceProperty == null && (!(this.name in this.source)))
                        console.log("[Bindings] Unable to find property '{0}' on type '{1}'".format(this.name, this.source["typeName"] == null ? "<noneType>" : this.source["typeName"]));

                var sourcePropertyValue = (this.sourceProperty != null) ?
                    this.source.getValue(this.sourceProperty) : //if it's a dep property get value using DepObject hierarchy
                    this.source[this.name];//otherwise try using normal property lookup method


                //if an indexer list is defined (binding to something like 'property[...]...')
                //go deeper to property value accessed with the indexer
                if (this.indexers != null && sourcePropertyValue != null) {
                    sourcePropertyValue = sourcePropertyValue[this.indexers[0]];
                    if (this.indexers.length > 1 && sourcePropertyValue != null)
                        sourcePropertyValue = sourcePropertyValue[this.indexers[1]];
                }

                return {
                    success: true,
                    value: sourcePropertyValue,
                    source: this.source,
                    property: this.sourceProperty
                };
            }
            else
                return {
                    success: false
                };
        }

        setValue(value: any) {
            if (this.next != null)
                this.next.setValue(value);
            else if (this.name != null && this.path.indexOf(".") == -1) {

                if (this.indexers != null)
                    throw new Error("Unable to update source when indexers are specified in binding path");

                if (this.sourceProperty != null)
                    this.source.setValue(this.sourceProperty, value);
                else
                    this.source[this.name] = value;//try update source using default property lookup access
            }
        }

        onDependencyPropertyChanged(depObject: DepObject, depProperty: DepProperty) {
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
