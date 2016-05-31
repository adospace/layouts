/// <reference path="../definitions/linq.d.ts" />
declare module layouts {
    class LmlReader {
        private static DefaultNamespace;
        static Parse(lml: string): any;
        static Load(lmlNode: Node, loader: InstanceLoader): any;
        private static TrySetProperty(obj, propertyName, value);
        private static FindObjectWithProperty(obj, propertyNames);
    }
}
