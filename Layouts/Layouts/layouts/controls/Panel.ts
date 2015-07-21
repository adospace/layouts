/// <reference path="..\DepProperty.ts" />
/// <reference path="..\DepObject.ts" />
/// <reference path="..\FrameworkElement.ts" /> 

module tsui.controls {
    export class Panel extends FrameworkElement {

        private _children: ObservableCollection<UIElement>;

        get children(): ObservableCollection<UIElement>{
            if (this._children == null)
            {
                this._children = new ObservableCollection<UIElement>();
                var self = this;
                this._children.on((c, added, removed) => {
                    removed.forEach(el=> {
                        if (el.parent == self)
                            el.parent = null;
                    });
                    added.forEach(el=> {
                        el.parent = self;
                        if (self._divElement != null)
                            el.attachVisual(self._divElement);
                    });

                    self.invalidateMeasure();
                });
            }

            return this._children;
        }

        layoutOverride() {
            super.layoutOverride();

            var background = this.background;
            if (this._visual.style.background != background)
                this._visual.style.background = background;

            this._children.forEach(child => child.layout());
        }

        protected _divElement: HTMLDivElement;
        attachVisualOverride(elementContainer: HTMLElement) {
            this._visual = this._divElement = document.createElement("div");
            var self = this;
            this._children.forEach(child => child.attachVisual(self._divElement));
            super.attachVisualOverride(elementContainer);
        }
       
        static backgroundProperty = (new Panel()).registerProperty("Background", null, FrameworkPropertyMetadataOptions.AffectsRender);
        get background(): string {
            return <string>super.getValue(Panel.backgroundProperty);
        }
        set background(value: string) {
            super.setValue(Panel.backgroundProperty, value);
        }

        static isItemsHostProperty = (new Panel()).registerProperty("IsItemsHost", false, FrameworkPropertyMetadataOptions.NotDataBindable);
        get isItemsHost(): boolean {
            return <boolean>super.getValue(Panel.isItemsHostProperty);
        }
        set isItemsHost(value: boolean) {
            super.setValue(Panel.isItemsHostProperty, value);
        }
    }
} 