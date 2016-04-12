/// <reference path="IConverter.ts" />

module layouts {

    export class XamlReader {

        private static DefaultNamespace: string = "http://schemas.layouts.com/";

        constructor(public instanceLoader?: InstanceLoader,
            public namespaceResolver?: { (xmlNs: string): string }) {

            if (this.instanceLoader == null)
                this.instanceLoader = new InstanceLoader(window)
        }

        private _createdObjectsWithId: { [objectId: string]: any; } = {};
        
        Parse(lml: string): any {
            var parser = new DOMParser();
            var doc = parser.parseFromString(lml, "text/xml").documentElement;
            return this.Load(doc);
        }

        resolveNameSpace(xmlns: string): string {
            if (xmlns == null ||
                xmlns == XamlReader.DefaultNamespace)
                return "layouts.controls";

            if (this.namespaceResolver != null)
                return this.namespaceResolver(xmlns);

            return xmlns;
        }

        Load(xamlNode: Node): any {

            //resolve namespace to module/typename
            var ns = this.resolveNameSpace(xamlNode.namespaceURI);
            var typeName = ns != null ? ns + "." + xamlNode.localName : xamlNode.localName;

            //load object
            var containerObject = this.instanceLoader.getInstance(typeName);

            if (containerObject == null)
                throw new Error("Unable to create instance of '{0}'".format(typeName));
            
            //load properties objects defined by xml attributes
            if (xamlNode.attributes != null) {
                for (var i = 0; i < xamlNode.attributes.length; i++) {
                    let att = xamlNode.attributes[i];
                    let propertyName = att.localName;

                    if (!this.trySetProperty(containerObject, propertyName, this.resolveNameSpace(att.namespaceURI), att.value))
                        if (containerObject["addExtentedProperty"] != null)
                            containerObject["addExtentedProperty"](propertyName, att.value);//if no property with right name put it in extented properties collection
                    
                    if (propertyName == "id")
                        this._createdObjectsWithId[att.value] = containerObject;
                }
            }

            var childrenProperties = Enumerable.From(xamlNode.childNodes).Where(_=> _.nodeType == 1 && _.localName.indexOf(".") > -1);

            childrenProperties.ForEach(childNode => {
                var indexOfDot = childNode.localName.indexOf(".");
                if (childNode.localName.substr(0, indexOfDot) == xamlNode.localName) {
                    let propertyName = childNode.localName.substr(indexOfDot + 1);
                    let childOfChild = Enumerable.From(childNode.childNodes).FirstOrDefault(null, _=> _.nodeType == 1);
                    let valueToSet = childOfChild == null ? null : this.Load(childOfChild);
                    this.trySetProperty(containerObject, propertyName, this.resolveNameSpace(childNode.namespaceURI), valueToSet);
                }
            });

            var children = Enumerable.From(xamlNode.childNodes).Where(_=> _.nodeType == 1 && _.localName.indexOf(".") == -1);

            if (containerObject["setInnerXaml"] != null) {
                if (children.Count() > 0)
                    containerObject["setInnerXaml"]((new XMLSerializer()).serializeToString(children.ToArray()[0]));
                if (containerObject["setXamlLoader"] != null)
                    containerObject["setXamlLoader"](this);
                return containerObject;
            }

            if (children.Count() == 0)
                return containerObject;//no children

            //load children or content or items
            if (Ext.hasProperty(containerObject, "content") || Ext.hasProperty(containerObject, "child")) {
                //support direct content...try to set content of container object with first child
                //skip any other children of lml node
                var contentPropertyName = Ext.hasProperty(containerObject, "content") ? "content" : "child";
                containerObject[contentPropertyName] = this.Load(children.First());
            }
            else {

                var collectionPropertyName = null;
                if (Ext.hasProperty(containerObject, "children"))
                    collectionPropertyName = "children";
                if (Ext.hasProperty(containerObject, "items"))
                    collectionPropertyName = "items";
                if (Ext.hasProperty(containerObject, "templates"))
                    collectionPropertyName = "templates";

                if (collectionPropertyName != null) {
                    //if object has a property called Children or Items
                    //load all children from children nodes and set property with resulting list
                    var listOfChildren = children.Select(childNode => this.Load(childNode)).ToArray();

                    containerObject[collectionPropertyName] = new ObservableCollection(listOfChildren);
                }
            }
            
            return containerObject;
        }

        static compareXml(nodeLeft: Node, nodeRight: Node): boolean {
            if (nodeLeft == null && nodeRight == null)
                return true;
            if (nodeLeft.localName != nodeRight.localName ||
                nodeLeft.namespaceURI != nodeRight.namespaceURI)
                return false;
            if (nodeLeft.attributes != null &&
                nodeRight.attributes != null &&
                nodeLeft.attributes.length != nodeRight.attributes.length)
                return false;
            for (var i = 0; i < nodeLeft.attributes.length; i++) {
                var attLeft = nodeLeft.attributes[i];
                var attRight = nodeRight.attributes[i];
                if (attLeft.name != attRight.name ||
                    attLeft.namespaceURI != attRight.namespaceURI ||
                    attLeft.value != attRight.value)
                    return false;
            }

            
            var childrenLeft = Enumerable.From(nodeLeft.childNodes).Where(_=> _.nodeType == 1);
            var childrenRight = Enumerable.From(nodeRight.childNodes).Where(_=> _.nodeType == 1);

            if (childrenLeft.Count() != childrenRight.Count())
                return false;

            var arrayOfChildrenLeft = childrenLeft.ToArray();
            var arrayOfChildrenRight = childrenRight.ToArray();

            for (var i = 0; i < childrenLeft.Count(); i++) {
                var childNodeLeft = arrayOfChildrenLeft[i];
                var childNodeRight = arrayOfChildrenRight[i];
                if (!XamlReader.compareXml(childNodeLeft, childNodeRight))
                    return false;
            }

            return true;
        }

        private trySetProperty(obj: any, propertyName: string, propertyNameSpace: string, value: string): boolean {
            //walk up in class hierarchy to find a property with right name
            if (obj == null)
                return false;

            if (obj instanceof DepObject) {
                //if obj is a dependency object look for a dependency property 
                var depObject = <DepObject>obj
                var typeName = <string>depObject["typeName"];

                var depProperty: DepProperty;

                //if an attached property find the property on publisher object
                //for example if Grid.Row-> looks for property Grid#Row in Grid type
                var indexOfDot = propertyName.indexOf(".");
                if (indexOfDot > -1) {
                    typeName = propertyNameSpace == null ? propertyName.substr(0, indexOfDot) : propertyNameSpace + "." + propertyName.substr(0, indexOfDot);
                    propertyName = propertyName.replace(".", "#");
                    depProperty = DepObject.getProperty(typeName, propertyName);
                }
                else
                    depProperty = DepObject.lookupProperty(depObject, propertyName);

                if (depProperty != null) {
                    //ok we have a depProperty and a depObject
                    //test if value is actually a Binding object
                    var bindingDef = Ext.isString(value) ? XamlReader.tryParseBinding(value) : null;
                    if (bindingDef != null) {
                        //here I should check the source of binding (not yet implemented)
                        //by default if source == DataContext binding just connect to
                        //"DataContext." + original path and source is depObject itself
                        var converter: IConverter = bindingDef.converter == null ? null : this.instanceLoader.getInstance(bindingDef.converter);
                        if (converter == null &&
                            bindingDef.converter != null)
                            throw new Error("Unable to create converter from '{0}'".format(bindingDef.converter));
                        //at moment we'll support only 2 modes:
                        //1) default -> connect to DataContext
                        //2) self -> connect to object itself
                        //3) {element} -> source is an element reference
                        var isDCProperty = depProperty == FrameworkElement.dataContextProperty;
                        var isElementNameDefined = bindingDef.element != null;
                        var bindingPath =
                            bindingDef.source == "self" || isElementNameDefined ? bindingDef.path :
                            isDCProperty ? "parentDataContext." + bindingDef.path : 
                            bindingDef.path == "." ? "DataContext" :
                                        "DataContext." + bindingDef.path;

                        var source = depObject;
                        if (isElementNameDefined) {
                            if (!(bindingDef.element in this._createdObjectsWithId))
                                console.log("[Bindings] Unable to find element with id '{0}'".format(bindingDef.element));
                            else
                                source = this._createdObjectsWithId[bindingDef.element];
                        }

                        depObject.bind(
                            depProperty,
                            bindingPath,
                            bindingDef.mode != null && bindingDef.mode.toLowerCase() == "twoway",
                            source,
                            converter,
                            bindingDef.converterParameter,
                            bindingDef.format);
                    }
                    else
                        depObject.setValue(depProperty, value);
                    return true;
                }
                else if (obj.hasOwnProperty(propertyName)) {
                    obj[propertyName] = value;
                    return true;
                }
                else
                    return this.trySetProperty(obj["__proto__"], propertyName, propertyNameSpace, value);

            }

            if (obj.hasOwnProperty(propertyName)) {
                obj[propertyName] = value;
                return true;
            }

            return false;
        }

        private static tryCallMethod(obj: any, methodName: string, value: any): boolean {
            //walk up in class hierarchy to find a property with right name
            if (obj == null)
                return false;

            if (obj[methodName] != null) {
                obj[methodName](value);
                return true;
            }

            return false;
        }

        private static tryParseBinding(value: string):
            {
                path?: string,
                mode?: string,
                source?: string,
                converter?: string,
                converterParameter?: string,
                element?: string,
                format?: string
            } {

            var bindingValue =  value.trim();
            if (bindingValue.length >= 3 && //again here maybe better a regex
                bindingValue[0] == '{' &&
                bindingValue[bindingValue.length-1] == '}') {

                try {
                    var bindingDef: any = new Object();
                    var tokens = bindingValue.substr(1, bindingValue.length - 2).split(",");
                    tokens.forEach(t => {
                        var keyValue = t.split(":");
                        if (keyValue.length == 2) {
                            var value = keyValue[1].trim();
                            if (value.length > 2 &&
                                value[0] == '\'' &&
                                value[value.length - 1] == '\'')
                                value = value.substr(1, value.length - 2);
                            bindingDef[keyValue[0].trim()] = value;
                        }
                        else if (keyValue.length == 1)
                            bindingDef["path"] = keyValue[0].trim();
                        else
                            throw Error("syntax error");
                    });
                    return bindingDef;
                }
                catch (e) {
                    //swallow error here because it could be simply a syntax error
                    //just signal it on console
                    console.log("[Bindings] Unable to parse '{0}' as binding definition".format(bindingValue));
                }

                //var tokens = bindingValue.substr(1, bindingValue.length-2).split(",");
                //var path = tokens[0]; //ex. '.' or 'Name'
                //var twoway = tokens.length > 1 ? (tokens[1] == "twoway") : false;
                //var source = tokens.length > 2 ? tokens[2] : null; //todo convert to source=>self, element etc
                //var converter = tokens.length > 3 ? tokens[3] : null; //converter (typename) to use when updating the target
                //var converterParameter = tokens.length > 4 ? tokens[4] : null;//converter parameter to pass to converter as context
                //return { path: path, twoway: twoway, source: source, converter: converter, converterParameter: converterParameter };
            }

            return null;
        }

    }


}
 