declare module layouts {
    class PropertyMap {
        constructor();
        private propertyMap;
        getProperty(name: string): DepProperty;
        register(name: string, property: DepProperty): void;
    }
}
