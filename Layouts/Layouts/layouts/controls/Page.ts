/// <reference path="..\DepProperty.ts" />
/// <reference path="..\DepObject.ts" />
/// <reference path="..\FrameworkElement.ts" /> 

module layouts.controls {
    export enum SizeToContent {
        None = 0,
        Both = 1,
        Vertical = 2,
        Horizontal = 3
    }

    export class Page extends FrameworkElement {

        private _child: UIElement;
        get Child(): UIElement {
            return this._child;
        }
        set Child(value: UIElement) {
            if (this._child != value) {
                if (this._child != null && this._child.parent == this)
                    this._child.parent = null;
                this._child = value;
                if (this._child != null) {
                    this._child.parent = this;
                    this._child.attachVisual(document.body);
                }
                this.invalidateMeasure();
            }
        }


        protected layoutOverride() {
            if (this._child != null)
                this._child.layout();
        }

        protected measureOverride(constraint: Size): Size {
            var mySize = new Size();

            if (this._child != null) {
                this._child.measure(constraint);
                return this._child.desideredSize;
            }

            return mySize;
        }

        protected arrangeOverride(finalSize: Size): Size {
            //  arrange child
            var child = this._child;
            if (child != null) {
                child.arrange(new Rect(0, 0, finalSize.width, finalSize.height));
            }

            return finalSize;
        }   


        SizeToContent: SizeToContent = SizeToContent.None;

    }
}