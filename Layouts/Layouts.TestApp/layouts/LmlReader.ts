module layouts {

    export class LmlReader {

        private static DefaultNamespace: string = "http://schemas.layouts.com/";

        constructor(public instanceLoader?: InstanceLoader,
            public namespaceResolver?: { (xmlNs: string): string }) {

            if (this.instanceLoader == null)
                this.instanceLoader = new InstanceLoader(window)
        }

        Parse(lml: string): any {

            var parser = new DOMParser();
            var doc = parser.parseFromString(lml, "text/xml").documentElement;
            return this.Load(doc);
        }

        resolveNameSpace(xmlns: string): string {
            if (xmlns == null ||
                xmlns == LmlReader.DefaultNamespace)
                return "layouts.controls";

            if (this.namespaceResolver != null)
                return this.namespaceResolver(xmlns);

            return null;
        }

        Load(lmlNode: Node): any {

            //resolve namespace to module/typename
            var ns = this.resolveNameSpace(lmlNode.namespaceURI);
            var typeName = ns != null ? ns + "." + lmlNode.localName : lmlNode.localName;

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
                        LmlReader.TrySetProperty(containerObject, propertyName, this.resolveNameSpace(att.namespaceURI), att.value);//if no property with right name is found go ahead
                }
            }


            var children = Enumerable.From(lmlNode.childNodes).Where(_=> _.nodeType == 1);
            
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

        private static TrySetProperty(obj: any, propertyName: string, propertyNameSpace: string, value: string): boolean {
            //walk up in class hierarchy to find a property with right name
            if (obj == null)
                return false;

            if (obj instanceof DepObject) {
                //if obj is a dependency object look for a dependency property 
                var depObject = <DepObject>obj
                var typeName = <string>depObject["typeName"];

                var depProperty: DepProperty;

                //if an attached property find the property on publisher object
                //for example if Grid.Row-> lloks for property Grid#Row in Grid type
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
        }

        private static TryCallMethod(obj: any, methodName: string, value: any): boolean {
            //walk up in class hierarchy to find a property with right name
            if (obj == null)
                return false;

            if (obj[methodName] != null) {
                obj[methodName](value);
                return true;
            }

            return false;
        }


        private static tryParseBinding(value: string): { path: string, twoway: boolean } {
            var bindingValue = value.trim();
            if (bindingValue.length >= 3 && //again here maybe better a regex
                bindingValue[0] == '{' &&
                bindingValue[bindingValue.length-1] == '}') {

                var tokens = bindingValue.substr(1, bindingValue.length-2).split(",");
                var path = tokens[0]; //ex. '.' or 'Name'
                var twoway = tokens.length > 1 ? (tokens[1] == "twoway" || tokens[1] == "<>") : false;
                var source = tokens.length > 2 ? tokens[2] : null; //todo convert to source=>self, element etc

                return { path: path, twoway: twoway };
            }

            return null;
        }

    }


}
 