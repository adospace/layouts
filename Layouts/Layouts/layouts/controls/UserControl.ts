/// <reference path="..\DepProperty.ts" />
/// <reference path="..\DepObject.ts" />
/// <reference path="..\FrameworkElement.ts" /> 

module layouts.controls {
    export class UserControl extends FrameworkElement {
        static typeName: string = "layouts.controls.UserControl";
        get typeName(): string {
            return UserControl.typeName;
        }

        private _content: UIElement;
        protected initializeComponent(): UIElement {
            return null;
        }

        protected _container: HTMLElement;
        attachVisualOverride(elementContainer: HTMLElement) {

            this._container = elementContainer;

            var child = this._content;
            if (child == null) {
                this._content = child = this.initializeComponent();
                if (child != null)
                    child.parent = this;
            }

            if (child != null) {
                child.attachVisual(this._container);
            }

            super.attachVisualOverride(elementContainer);
        }

        protected measureOverride(constraint: Size): Size {

            var child = this._content;
            if (child != null) {
                child.measure(constraint);
                return child.desideredSize;
            }

            return new Size();
        }

        protected arrangeOverride(finalSize: Size): Size {
            var child = this._content;
            if (child != null)
                child.arrange(finalSize.toRect());

            return finalSize;
        }

        protected layoutOverride() {
            super.layoutOverride();
            var child = this._content;
            if (child != null) {
                var childOffset = this.visualOffset;
                if (this.relativeOffset != null)
                    childOffset = childOffset.add(this.relativeOffset);

                child.layout(childOffset);
            }
            
        }
    }
}
     