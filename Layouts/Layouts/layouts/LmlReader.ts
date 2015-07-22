module layouts {

    export class LmlReader {

        private static DefaultNamespace: string = "http://schemas.layouts.com/";
        private static DefaultNamespaceResolver(xmlNs: string): string
        {
            if (xmlNs == null ||
                xmlNs == LmlReader.DefaultNamespace)
                return "layouts.controls";

            throw new Error("Unable to resolve Xml Namespace");
        }

        constructor(public instanceLoader?: InstanceLoader,
            public namespaceResolver?: { (xmlNs: string): string }) {

            if (this.instanceLoader == null)
                this.instanceLoader = new InstanceLoader(window)

            if (this.namespaceResolver == null)
                this.namespaceResolver = LmlReader.DefaultNamespaceResolver;
        }

        Parse(lml: string): any {

            var parser = new DOMParser();
            var doc = parser.parseFromString(lml, "text/xml").documentElement;
            return this.Load(doc);
        }

        Load(lmlNode: Node): any {

            //resolve namespace to module/typename
            var typeName = this.namespaceResolver(lmlNode.namespaceURI) + "." + lmlNode.localName;

            //load object
            var containerObject = this.instanceLoader.getInstance(typeName);
            
            //load properties objects defined by xml attributes
            if (lmlNode.attributes != null) {
                for (var i = 0; i < lmlNode.attributes.length; i++) {
                    var att = lmlNode.attributes[i];
                    var propertyName = att.localName;
                    //try use FromLml<property-name> if exists
                    //!!!this operation can be expensive!!!
                    if (!LmlReader.TryCallMethod(containerObject, "FromLml" + propertyName, att.value))
                        LmlReader.TrySetProperty(containerObject, propertyName, this.namespaceResolver(att.namespaceURI), att.value);//if no property with right name is found go ahead
                }
            }


            var children = Enumerable.From(lmlNode.childNodes).Where(_=> _.nodeType == 1);
            
            if (children.Count() == 0)
                return containerObject;//no children

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

                    var listOfChildren = children.Select((childNode) => {
                        return this.Load(childNode);
                    }).ToArray();

                    containerObject[collectionPropertyName] = new ObservableCollection(listOfChildren);
                }
            }
            
            return containerObject;
        }

        LoadChildren(lmlNode: Node, parentPanel: controls.Panel) {
            var children = Enumerable.From(lmlNode.childNodes).Where(_=> _.nodeType == 1).ToArray();

            if (children.length == 0)
                return;//no children


            this.Load(lmlNode);


        }

        private static TrySetProperty(obj: any, propertyName: string, propertyNameSpace: string, value: any): boolean {
            //walk up in class hierarchy to find a property with right name
            if (obj == null)
                return false;

            if (obj instanceof DepObject) {
                //if obj is a dependency object look for a dependency property 
                var depObject = <DepObject>obj
                var typeName = <string>depObject["typeName"];

                //if an attached property find the property on publisher object
                //for example if Grid.Row-> lloks for property Grid#Row in Grid type
                var indexOfDot = propertyName.indexOf(".");
                if (indexOfDot > -1) {
                    typeName = propertyNameSpace + "." + propertyName.substr(0, indexOfDot);
                    propertyName = propertyName.replace(".", "#");
                    var attachedDepProperty = DepObject.getProperty(typeName, propertyName);
                    if (attachedDepProperty != null) {
                        depObject.setValue(attachedDepProperty, value);
                        return true;
                    }
                }

                var depProperty = DepObject.lookupProperty(depObject, propertyName);
                if (depProperty != null) {
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

        private static FindObjectWithProperty(obj: any, propertyNames: string[]): any {
            //walk up in class hierarchy to find a property with right name than return the object
            //that has it
            if (obj == null)
                return null;

            for (var i = 0; i < propertyNames.length; i++) {
                if (obj.hasOwnProperty(propertyNames[i]))
                    return obj;
            }

            return LmlReader.FindObjectWithProperty(obj["__proto__"], propertyNames);
        }

    }


}
 