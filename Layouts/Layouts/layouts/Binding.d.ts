declare module layouts {
    class Binding {
        target: DepObject;
        targetProperty: DepProperty;
        path: PropertyPath;
        twoWay: boolean;
        private source;
        private sourceProperty;
        constructor(target: DepObject, targetProperty: DepProperty, path: PropertyPath, twoWay?: boolean);
        private onPathChanged(path);
        private updateTarget();
        private onSourcePropertyChanged(depObject, property, value);
    }
}
