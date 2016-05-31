/// <reference path="IConverter.ts" />
var layouts;
(function (layouts) {
    var XamlReader = (function () {
        function XamlReader(instanceLoader, namespaceResolver) {
            this.instanceLoader = instanceLoader;
            this.namespaceResolver = namespaceResolver;
            if (this.instanceLoader == null)
                this.instanceLoader = new InstanceLoader(window);
        }
        XamlReader.prototype.Parse = function (lml) {
            var parser = new DOMParser();
            var doc = parser.parseFromString(lml, "text/xml").documentElement;
            return this.Load(doc);
        };
        XamlReader.prototype.resolveNameSpace = function (xmlns) {
            if (xmlns == null ||
                xmlns == XamlReader.DefaultNamespace)
                return "layouts.controls";
            if (this.namespaceResolver != null)
                return this.namespaceResolver(xmlns);
            return null;
        };
        XamlReader.prototype.Load = function (xamlNode) {
            var _this = this;
            var ns = this.resolveNameSpace(xamlNode.namespaceURI);
            var typeName = ns != null ? ns + "." + xamlNode.localName : xamlNode.localName;
            var containerObject = this.instanceLoader.getInstance(typeName);
            if (containerObject == null)
                throw new Error("Unable to create instance of '{0}'".format(typeName));
            if (xamlNode.attributes != null) {
                for (var i = 0; i < xamlNode.attributes.length; i++) {
                    var att = xamlNode.attributes[i];
                    var propertyName = att.localName;
                    if (!this.trySetProperty(containerObject, propertyName, this.resolveNameSpace(att.namespaceURI), att.value))
                        if (containerObject["addExtentedProperty"] != null)
                            containerObject["addExtentedProperty"](propertyName, att.value);
                }
            }
            var childrenProperties = Enumerable.From(xamlNode.childNodes).Where(function (_) { return _.nodeType == 1 && _.localName.indexOf(".") > -1; });
            childrenProperties.ForEach(function (childNode) {
                var indexOfDot = childNode.localName.indexOf(".");
                if (childNode.localName.substr(0, indexOfDot) == xamlNode.localName) {
                    var propertyName = childNode.localName.substr(indexOfDot + 1);
                    var childOfChild = Enumerable.From(childNode.childNodes).FirstOrDefault(null, function (_) { return _.nodeType == 1; });
                    var valueToSet = childOfChild == null ? null : _this.Load(childOfChild);
                    _this.trySetProperty(containerObject, propertyName, _this.resolveNameSpace(childNode.namespaceURI), valueToSet);
                }
            });
            var children = Enumerable.From(xamlNode.childNodes).Where(function (_) { return _.nodeType == 1 && _.localName.indexOf(".") == -1; });
            if (containerObject["setInnerXaml"] != null) {
                if (children.Count() > 0)
                    containerObject["setInnerXaml"]((new XMLSerializer()).serializeToString(children.ToArray()[0]));
                if (containerObject["setXamlLoader"] != null)
                    containerObject["setXamlLoader"](this);
                return containerObject;
            }
            if (children.Count() == 0)
                return containerObject;
            if (layouts.Ext.hasProperty(containerObject, "content") || layouts.Ext.hasProperty(containerObject, "child")) {
                var contentPropertyName = layouts.Ext.hasProperty(containerObject, "content") ? "content" : "child";
                containerObject[contentPropertyName] = this.Load(children.First());
            }
            else {
                var collectionPropertyName = null;
                if (layouts.Ext.hasProperty(containerObject, "children"))
                    collectionPropertyName = "children";
                if (layouts.Ext.hasProperty(containerObject, "items"))
                    collectionPropertyName = "items";
                if (layouts.Ext.hasProperty(containerObject, "templates"))
                    collectionPropertyName = "templates";
                if (collectionPropertyName != null) {
                    var listOfChildren = children.Select(function (childNode) { return _this.Load(childNode); }).ToArray();
                    containerObject[collectionPropertyName] = new layouts.ObservableCollection(listOfChildren);
                }
            }
            return containerObject;
        };
        XamlReader.compareXml = function (nodeLeft, nodeRight) {
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
            var childrenLeft = Enumerable.From(nodeLeft.childNodes).Where(function (_) { return _.nodeType == 1; });
            var childrenRight = Enumerable.From(nodeRight.childNodes).Where(function (_) { return _.nodeType == 1; });
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
        };
        XamlReader.prototype.trySetProperty = function (obj, propertyName, propertyNameSpace, value) {
            if (obj == null)
                return false;
            if (obj instanceof layouts.DepObject) {
                var depObject = obj;
                var typeName = depObject["typeName"];
                var depProperty;
                var indexOfDot = propertyName.indexOf(".");
                if (indexOfDot > -1) {
                    typeName = propertyNameSpace == null ? propertyName.substr(0, indexOfDot) : propertyNameSpace + "." + propertyName.substr(0, indexOfDot);
                    propertyName = propertyName.replace(".", "#");
                    depProperty = layouts.DepObject.getProperty(typeName, propertyName);
                }
                else
                    depProperty = layouts.DepObject.lookupProperty(depObject, propertyName);
                if (depProperty != null) {
                    var bingingDef = layouts.Ext.isString(value) ? XamlReader.tryParseBinding(value) : null;
                    if (bingingDef != null) {
                        var converter = bingingDef.converter == null ? null : this.instanceLoader.getInstance(bingingDef.converter);
                        var bindingPath = bingingDef.source == "self" ? bingingDef.path : "DataContext." + bingingDef.path;
                        depObject.bind(depProperty, bindingPath, bingingDef.twoway, depObject, converter);
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
        };
        XamlReader.tryCallMethod = function (obj, methodName, value) {
            if (obj == null)
                return false;
            if (obj[methodName] != null) {
                obj[methodName](value);
                return true;
            }
            return false;
        };
        XamlReader.tryParseBinding = function (value) {
            var bindingValue = value.trim();
            if (bindingValue.length >= 3 &&
                bindingValue[0] == '{' &&
                bindingValue[bindingValue.length - 1] == '}') {
                var tokens = bindingValue.substr(1, bindingValue.length - 2).split(",");
                var path = tokens[0];
                var twoway = tokens.length > 1 ? (tokens[1] == "twoway") : false;
                var source = tokens.length > 2 ? tokens[2] : null;
                var converter = tokens.length > 3 ? tokens[3] : null;
                return { path: path, twoway: twoway, source: source, converter: converter };
            }
            return null;
        };
        XamlReader.DefaultNamespace = "http://schemas.layouts.com/";
        return XamlReader;
    })();
    layouts.XamlReader = XamlReader;
})(layouts || (layouts = {}));
