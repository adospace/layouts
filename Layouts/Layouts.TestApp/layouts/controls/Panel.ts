/// <reference path="..\DepProperty.ts" />
/// <reference path="..\DepObject.ts" />
/// <reference path="..\FrameworkElement.ts" /> 
/// <reference path="..\ISupport.ts" /> 

module layouts.controls {
    export class Panel extends FrameworkElement {
        static typeName: string = "layouts.controls.Panel";
        get typeName(): string {
            return Panel.typeName;
        }


        private _children: ObservableCollection<UIElement>;

        get children(): ObservableCollection<UIElement>{
            //if (this._children == null) {
            //    this._children = new ObservableCollection<UIElement>();
            //    this._children.on(this.childrenCollectionChanged);
            //}

            return this._children;
        }

        set children(value: ObservableCollection<UIElement>) {
            if (value == this._children)
                return;

            if (this._children != null) {
                //reset parent on all children
                this._children.forEach(el=> {
                    if (el.parent == this)
                        el.parent = null;
                });

                //remove handler so that resource can be disposed
                this._children.off(this.childrenCollectionChanged);
            }

            this._children = value;

            if (this._children != null) {
                //attach new children here
                this._children.forEach(el=> {

                    if (el.parent != null) {
                        //if already child of a different parent throw error
                        //in future investigate if it can be removed from container automatically
                        throw new Error("Element already child of another element, please remove it first from previous container");
                    }

                    el.parent = this;
                    if (this._divElement != null)
                        el.attachVisual(this._divElement);
                });

                this._children.on(this.childrenCollectionChanged);
            }

            this.invalidateMeasure();
        }

        private childrenCollectionChanged(collection: ObservableCollection<UIElement>, added: UIElement[], removed: UIElement[]) {
            removed.forEach(el=> {
                if (el.parent == this)
                    el.parent = null;
            });
            added.forEach(el=> {
                el.parent = this;
                if (this._divElement != null)
                    el.attachVisual(this._divElement);
            });

            this.invalidateMeasure();
        }

        layoutOverride() {
            super.layoutOverride();

            var background = this.background;
            if (this._visual.style.background != background)
                this._visual.style.background = background;

            this._children.forEach(child => child.layout());
        }

        //virtual items
        virtualItemCount: number = 0;
        virtualOffset: Vector = null;

        protected _divElement: HTMLDivElement;
        attachVisualOverride(elementContainer: HTMLElement) {
            this._visual = this._divElement = document.createElement("div");
            if (this._children != null)
                this._children.forEach(child => child.attachVisual(this._divElement));
            super.attachVisualOverride(elementContainer);
        }
       
        static backgroundProperty = DepObject.registerProperty(Panel.typeName, "Background", null, FrameworkPropertyMetadataOptions.AffectsRender);
        get background(): string {
            return <string>this.getValue(Panel.backgroundProperty);
        }
        set background(value: string) {
            this.setValue(Panel.backgroundProperty, value);
        }

        
    }
} 