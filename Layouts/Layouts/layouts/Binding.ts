module layouts {
    export class Binding {
        target: DepObject;
        targetProperty: DepProperty;
        path: PropertyPath;
        twoWay: boolean = false;

        private source: DepObject;
        private sourceProperty: DepProperty;

        constructor(target: DepObject, targetProperty: DepProperty, path: PropertyPath, twoWay: boolean = false) {
            this.target = target;
            this.targetProperty = targetProperty;
            this.path = path;
            this.twoWay = twoWay;

            this.path.subscribePathChanges(this.onPathChanged);
            this.updateTarget();
        }

        private onPathChanged(path: PropertyPath): void {
            this.updateTarget();
        }

        private updateTarget(): void {
            if (this.source != null)
                this.source.unsubscribePropertyChanges(this.onSourcePropertyChanged);

            var retValue = this.path.getValue();

            if (retValue.success) {
                this.source = retValue.source;
                this.sourceProperty = retValue.sourceProperty;
                this.target.setValue(this.targetProperty, retValue.value);//update target
            }

            if (this.source != null)
                this.source.subscribePropertyChanges(this.onSourcePropertyChanged);
        }

        private onSourcePropertyChanged(depObject: DepObject, property: DepProperty, value: any) {
            if (property == this.sourceProperty) {
                var retValue = this.path.getValue();

                if (retValue.success) {
                    this.target.setValue(this.targetProperty, retValue.value);//update target
                }
            }
        }

        //updateOnSourceValueChanged(objChanged: DepObject, propertyChanged: DepProperty, newValue: any) {
        //    if (this.path.updateOnValueChanged(objChanged, propertyChanged, newValue)) {
        //        if (this.target == objChanged && this.targetProperty == propertyChanged && this.twoWay)
        //            this.path.setValue(newValue);//update source
        //        else
        //            this.target.setValue(this.targetProperty, this.path.getValue());//update target
        //    }
        //}

        //updateOnPathChanged() {
        //    this.path.build();

        //}
    }
}