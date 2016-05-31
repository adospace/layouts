declare module layouts {
    class PropertyPath {
        path: string;
        name: string;
        source: DepObject;
        private next;
        private prev;
        sourceProperty: DepProperty;
        constructor(path: string, source: DepObject);
        private attachShource();
        private detachSource();
        private build();
        private onPathChanged();
        private pcHandlers;
        subscribePathChanges(handler: {
            (path: PropertyPath): void;
        }): void;
        unsubscribePathChanges(handler: {
            (path: PropertyPath): void;
        }): void;
        getValue(): any;
        setValue(value: any): void;
        private onPropertyChanged(depObject, property, value);
    }
}
