var layouts;
(function (layouts) {
    var LmlReader = (function () {
        function LmlReader(instanceLoader, namespaceResolver) {
            this.instanceLoader = instanceLoader;
            this.namespaceResolver = namespaceResolver;
            if (this.instanceLoader == null)
                this.instanceLoader = new InstanceLoader(window);
            if (this.namespaceResolver == null)
                this.namespaceResolver = LmlReader.DefaultNamespaceResolver;
        }
        LmlReader.DefaultNamespaceResolver = function (xmlNs) {
            if (xmlNs == null ||
                xmlNs == LmlReader.DefaultNamespace)
                return "layouts.controls";
            throw new Error("Unable to resolve Xml Namespace");
        };
        LmlReader.prototype.Parse = function (lml) {
            var parser = new DOMParser();
            var doc = parser.parseFromString(lml, "text/xml").documentElement;
            return this.Load(doc);
        };
        LmlReader.prototype.Load = function (lmlNode) {
            var _this = this;
            //resolve namespace to module/typename
            var ns = this.namespaceResolver(lmlNode.namespaceURI);
            var typeName = ns != layouts.Consts.stringEmpty ? ns + "." + lmlNode.localName : lmlNode.localName;
            //load object
            var containerObject = this.instanceLoader.getInstance(typeName);
            //load properties objects defined by xml attributes
            if (lmlNode.attributes != null) {
                for (var i = 0; i < lmlNode.attributes.length; i++) {
                    var att = lmlNode.attributes[i];
                    var propertyName = att.localName;
                    //try use FromLml<property-name> if exists
                    //!!!this operation can be expensive!!!
                    if (!LmlReader.TryCallMethod(containerObject, "fromLml" + propertyName, att.value))
                        LmlReader.TrySetProperty(containerObject, propertyName, this.namespaceResolver(att.namespaceURI), att.value); //if no property with right name is found go ahead
                }
            }
            var children = Enumerable.From(lmlNode.childNodes).Where(function (_) { return _.nodeType == 1; });
            if (children.Count() == 0)
                return containerObject; //no children
            //load children or content or items
            if (containerObject.hasProperty("content") || containerObject.hasProperty("child")) {
                //support direct content...try to set content of container object with first child
                //skip any other children of lml node
                var contentPropertyName = containerObject.hasProperty("content") ? "content" : "child";
                containerObject[contentPropertyName] = this.Load(children.First());
            }
            else {
                if (containerObject.hasProperty("children") || containerObject.hasProperty("items")) {
                    //if object has a property called Children or Items
                    //load all children from children nodes and set property with resulting list
                    var collectionPropertyName = containerObject.hasProperty("children") ? "children" : "items";
                    //var childrenCollection = objectWithRightProperty[collectionPropertyName];
                    //childrenCollection.add(this.Load(children.First()));
                    //var listOfChildren = new Array<Object>();
                    //for (var i = 0; i < children.length; i++) {
                    //    var childNode = children[i];
                    //    listOfChildren.push(this.Load(childNode));
                    //};
                    var listOfChildren = children.Select(function (childNode) {
                        return _this.Load(childNode);
                    }).ToArray();
                    containerObject[collectionPropertyName] = new layouts.ObservableCollection(listOfChildren);
                }
            }
            return containerObject;
        };
        LmlReader.TrySetProperty = function (obj, propertyName, propertyNameSpace, value) {
            //walk up in class hierarchy to find a property with right name
            if (obj == null)
                return false;
            if (obj instanceof layouts.DepObject) {
                //if obj is a dependency object look for a dependency property 
                var depObject = obj;
                var typeName = depObject["typeName"];
                var depProperty;
                //if an attached property find the property on publisher object
                //for example if Grid.Row-> lloks for property Grid#Row in Grid type
                var indexOfDot = propertyName.indexOf(".");
                if (indexOfDot > -1) {
                    typeName = propertyNameSpace + "." + propertyName.substr(0, indexOfDot);
                    propertyName = propertyName.replace(".", "#");
                    depProperty = layouts.DepObject.getProperty(typeName, propertyName);
                }
                else
                    depProperty = layouts.DepObject.lookupProperty(depObject, propertyName);
                if (depProperty != null) {
                    //ok we have a depProperty and a depObject
                    //test if value is actually a Binding object
                    var bingingDef = LmlReader.tryParseBinding(value);
                    if (bingingDef != null) {
                        //here I should check the source of binding (not yet implemented)
                        //by default if source == DataContext binding just connect to
                        //"DataContext." + original path and source is depObject itself
                        depObject.bind(depProperty, "DataContext." + bingingDef.path, bingingDef.twoway, depObject);
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
                    return LmlReader.TrySetProperty(obj["__proto__"], propertyName, propertyNameSpace, value);
            }
            if (obj.hasOwnProperty(propertyName)) {
                obj[propertyName] = value;
                return true;
            }
            return false;
        };
        LmlReader.TryCallMethod = function (obj, methodName, value) {
            //walk up in class hierarchy to find a property with right name
            if (obj == null)
                return false;
            if (obj[methodName] != null) {
                obj[methodName](value);
                return true;
            }
            return false;
        };
        LmlReader.tryParseBinding = function (value) {
            var bindingValue = value.trim();
            if (bindingValue.length >= 3 &&
                bindingValue[0] == '{' &&
                bindingValue[bindingValue.length - 1] == '}') {
                var tokens = bindingValue.substr(1, bindingValue.length - 2).split(",");
                var path = tokens[0]; //ex. '.' or 'Name'
                var twoway = tokens.length > 1 ? (tokens[1] == "twoway" || tokens[1] == "<>") : false;
                var source = tokens.length > 2 ? tokens[2] : null; //todo convert to source=>self, element etc
                return { path: path, twoway: twoway };
            }
            return null;
        };
        LmlReader.DefaultNamespace = "http://schemas.layouts.com/";
        return LmlReader;
    })();
    layouts.LmlReader = LmlReader;
})(layouts || (layouts = {}));
//# sourceMappingURL=LmlReader.js.map