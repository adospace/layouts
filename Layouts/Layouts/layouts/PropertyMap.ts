
module layouts {
    export class PropertyMap {
        constructor() {
        }

        private propertyMap: { [propertyName: string]: DepProperty; } = {};

        getProperty(name: string): DepProperty {
            return this.propertyMap[name];
        }

        all(): DepProperty[]{
            var keys = Object.keys(this.propertyMap);
            return keys.map(v => this.propertyMap[v]);
        }

        register(name: string, property: DepProperty) {
            if (this.propertyMap[name] != null)
                throw new Error("property already registered");
            this.propertyMap[name] = property;
        }
    }
} 