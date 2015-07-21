module tsui {
    export class PropertyPath
    {
        path: string;
        name: string;
        source: DepObject;
        private next: PropertyPath;
        private prev: PropertyPath;
        sourceProperty: DepProperty;

        constructor(path: string, source: DepObject) {
            this.path = path;
            this.source = source;
            this.build();
            this.attachShource();
        }

        private attachShource(): void
        {
            this.source.subscribePropertyChanges(this.onPropertyChanged);
        }

        private detachSource(): void {
            this.source.unsubscribePropertyChanges(this.onPropertyChanged);
        }

        private build(): void {
            var oldNext = this.next;

            if (this.next != null) {
                this.next.detachSource();
                this.next.prev = null;
            }

            if (this.path == "" ||
                this.path == ".") {
                this.name = ".";
                this.next = null;
            }
            else {
                var dotIndex = this.path.indexOf(".");
                if (dotIndex > -1) {
                    this.name = this.path.substring(0, dotIndex);
                    this.sourceProperty = DepObject.getProperty(this.source.typeName, this.name);
                    var sourcePropertyValue = <DepObject>this.source.getValue(this.sourceProperty);
                    if (sourcePropertyValue != null) {
                        var nextPath = this.path.substring(dotIndex + 1);
                        if (this.next != null &&
                            (this.next.path != nextPath || this.next.source != sourcePropertyValue))
                            this.next = new PropertyPath(this.path.substring(dotIndex + 1), sourcePropertyValue);
                        else
                            this.next.build();
                    }
                    else
                        this.next = null;
                }
                else {
                    this.name = this.path;
                    this.next = null;
                }
            }

            if (this.next != null) {
                this.next.attachShource();
                this.next.prev = this;
            }

            if (oldNext != this.next) {
                this.onPathChanged();
            }
        }

        private onPathChanged(): void {
            if (this.prev != null)
                this.prev.onPathChanged();
            else {
                this.pcHandlers.forEach((h) => {
                    h(this);
                });
            }
        }

        private pcHandlers: { (path: PropertyPath): void }[] = [];

        //subscribe to path change event
        subscribePathChanges(handler: { (path: PropertyPath): void }) {
            if (this.pcHandlers.indexOf(handler) == -1)
                this.pcHandlers.push(handler);
        }

        //unsubscribe from path change event
        unsubscribePathChanges(handler: { (path: PropertyPath): void }) {
            var index = this.pcHandlers.indexOf(handler, 0);
            if (index != -1) {
                this.pcHandlers.splice(index, 1);
            }
        }

        getValue(): any {
            if (this.next != null)
                return this.next.getValue();
            else if (this.name == ".")
                return { success: true, value: this.source.getValue(this.sourceProperty), source: this.source, property: null };
            else if (this.name != null)
                return { success: true, value: this.source.getValue(this.sourceProperty), source: this.source, property: this.sourceProperty };
            else
                return { success: false };
        }

        setValue(value: any) {
            if (this.next != null)
                this.next.setValue(value);
            else if (this.name != null)
                this.source.setValue(this.sourceProperty, value);
        }

        private onPropertyChanged(depObject: DepObject, property: DepProperty, value: any)
        {
            if (depObject == this.source &&
                property.name == this.name) {
                this.build();
            }
        }

    }
} 