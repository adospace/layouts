
module tsui {
    export class PropertyMap {
        constructor() {
        }

        private propertyMap: { [propertyName: string]: DepProperty; } = {};

        getProperty(name: string): DepProperty {
            return this.propertyMap[name];
        }

        register(name: string, property: DepProperty) {
            if (this.propertyMap[name] != null)
                throw new Error("property already registered");
            this.propertyMap[name] = property;
        }
    }
} 