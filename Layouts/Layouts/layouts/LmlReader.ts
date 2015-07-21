module layouts {

    export class LmlReader {

        private static DefaultNamespace: string = "http://schemas.layouts.com/";

        static Parse(lml: string): any {

            var parser = new DOMParser();
            var doc = parser.parseFromString(lml, "text/xml").documentElement;
            var loader = new InstanceLoader(window);

            return LmlReader.Load(doc, loader);
        }

        static Load(lmlNode: Node, loader: InstanceLoader): any {

            var typeName = lmlNode.localName;

            //resolve namespace to module/typename
            if (lmlNode.namespaceURI == null ||
                lmlNode.namespaceURI == LmlReader.DefaultNamespace)
                typeName = "layouts.controls." + typeName;

            //load object
            var containerObject = loader.getInstance(typeName);
            
            //load properties objects defined by xml attributes
            if (lmlNode.attributes != null) {
                for (var i = 0; i < lmlNode.attributes.length; i++) {
                    var att = lmlNode.attributes[i];
                    //try use FromLml<property-name> if exists
                    //!!!this operation can be expensive!!!
                    if (!LmlReader.TrySetProperty(containerObject, "FromLml" + att.localName, att.value))
                        LmlReader.TrySetProperty(containerObject, att.localName, att.value);//if no property with right name is found go ahead
                }
            }


            var children = Enumerable.From(lmlNode.childNodes).Where(_=> _.nodeType == 1);
            
            if (children.Count() == 0)
                return containerObject;//no children

            //load children or content or items
            var objectWithRightProperty = LmlReader.FindObjectWithProperty(containerObject, ["Content", "Child"]);
            if (objectWithRightProperty != null) {
                //support direct content...try to set content of container object with first child
                //skip any other children of lml node
                var contentPropertyName = objectWithRightProperty.hasOwnProperty("Content") ? "Content" : "Child";
                objectWithRightProperty[contentPropertyName] = LmlReader.Load(children.First(), loader);
            }
            else {
                objectWithRightProperty = LmlReader.FindObjectWithProperty(containerObject, ["Children", "Items"]);
                if (objectWithRightProperty != null) {
                    //if object has a property called Children or Items
                    //load all children from children nodes and set property with resulting list
                    var collectionPropertyName = objectWithRightProperty.hasOwnProperty("Children") ? "Children" : "Items";
                    var listOfChildren: any[];
                    for (var childNode in children) {
                        listOfChildren.push(LmlReader.Load(childNode, loader));
                    }

                    objectWithRightProperty[collectionPropertyName] = listOfChildren;
                }
            }
            
            return containerObject;
        }

        private static TrySetProperty(obj: any, propertyName: string, value: any): boolean {
            //walk up in class hierarchy to find a property with right name
            if (obj == null)
                return false;

            if (!obj.hasOwnProperty(propertyName))
                return LmlReader.TrySetProperty(obj["__proto__"], propertyName, value);

            obj[propertyName] = value;
            return true;
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
 