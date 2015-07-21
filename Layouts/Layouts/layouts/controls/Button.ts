/// <reference path="..\DepProperty.ts" />
/// <reference path="..\DepObject.ts" />
/// <reference path="..\FrameworkElement.ts" /> 

module tsui.controls {
    export class Button extends FrameworkElement {

        private _child: UIElement;
        get child(): UIElement {
            return this._child;
        }
        set child(value: UIElement) {
            if (this._child != value) {
                if (this._child != null && this._child.parent == this)
                    this._child.parent = null;
                this._child = value;
                if (this._child != null) {
                    this._child.parent = this;
                    if (this._buttonElement != null)
                        this._child.attachVisual(this._buttonElement);
                }
                this.invalidateMeasure();
            }
        }

        protected _buttonElement: HTMLButtonElement;
        attachVisualOverride(elementContainer: HTMLElement) {

            this._visual = this._buttonElement = document.createElement("button");

            if (this._child != null) {
                this._child.attachVisual(this._buttonElement);
            }

            super.attachVisualOverride(elementContainer);
        }

        protected measureOverride(constraint: Size): Size {
            var mySize = new Size();

            // Compute the chrome size added by padding
            var padding = new Size(this.padding.left + this.padding.right, this.padding.top + this.padding.bottom);

            //If we have a child
            if (this._child != null) {

                // Remove size of padding only from child's reference size.
                var childConstraint = new Size(Math.max(0.0, constraint.width - padding.width),
                    Math.max(0.0, constraint.height - padding.height));


                this._child.measure(childConstraint);
                var childSize = this._child.desideredSize;

                // Now use the returned size to drive our size, by adding back the margins, etc.
                mySize.width = childSize.width + padding.width;
                mySize.height = childSize.height + padding.height;
            }
            else if (this.text != null)
            {
                var text = this.text;
                var mySize = new Size();
                var pElement = this._buttonElement;
                var txtChanged = (pElement.innerText != text);

                if (isFinite(constraint.width))
                    pElement.style.maxWidth = constraint.width + "px";
                if (isFinite(constraint.height))
                    pElement.style.maxHeight = constraint.height + "px";
                pElement.style.width = "auto";
                pElement.style.height = "auto";
                
                if (txtChanged) {
                    pElement.innerHTML = this.text;
                }
                mySize = new Size(pElement.clientWidth, pElement.clientHeight);

                if (txtChanged && this.renderSize != null) {
                    pElement.style.width = this.renderSize.width.toString() + "px";
                    pElement.style.height = this.renderSize.height.toString() + "px";
                }

                return mySize;
            }
            else {
                // Combine into total decorating size
                mySize = new Size(padding.width, padding.height);
            }

            return mySize;
        }

        protected arrangeOverride(finalSize: Size): Size {
            //  arrange child
            var child = this._child;
            var padding = this.padding;
            if (child != null) {
                var childRect = new Rect(padding.left,
                    padding.top,
                    Math.max(0.0, finalSize.width - padding.left - padding.right),
                    Math.max(0.0, finalSize.height - padding.top - padding.bottom));

                child.arrange(childRect);
            }

            return finalSize;
        }   

        protected layoutOverride() {
            super.layoutOverride();
            if (this._child != null)
                this._child.layout();
        }

        //Dependency properties

        static paddingProperty = (new Button()).registerProperty("Padding", new Thickness(), FrameworkPropertyMetadataOptions.AffectsMeasure | FrameworkPropertyMetadataOptions.AffectsRender);
        get padding(): Thickness {
            return <Thickness>super.getValue(Button.paddingProperty);
        }
        set padding(value: Thickness) {
            super.setValue(Button.paddingProperty, value);
        }


        static textProperty = (new Button()).registerProperty("Text", null, FrameworkPropertyMetadataOptions.AffectsMeasure | FrameworkPropertyMetadataOptions.AffectsRender);
        get text(): string {
            return <string>super.getValue(Button.textProperty);
        }
        set text(value: string) {
            super.setValue(Button.textProperty, value);
        }

    }
}