/// <reference path="..\DepProperty.ts" />
/// <reference path="..\DepObject.ts" />
/// <reference path="..\FrameworkElement.ts" /> 
/// <reference path="..\ISupport.ts" /> 
/// <reference path="..\Command.ts" /> 

module layouts.controls {
    export class Button extends FrameworkElement {
        static typeName: string = "layouts.controls.Button";
        get typeName(): string {
            return Button.typeName;
        }


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

            this._buttonElement.onclick = (ev) => this.onCLick();

            if (this._child != null) {
                this._child.attachVisual(this._buttonElement);
            }

            super.attachVisualOverride(elementContainer);
        }

        private onCLick() {
            if (this.command != null &&
                this.command.canExecute(this.commandParameter))
                this.command.execute(this.commandParameter);
        }

        protected measureOverride(constraint: Size): Size {
            this._buttonElement.disabled = this.command == null || !this.command.canExecute(this.commandParameter);

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

        static paddingProperty = DepObject.registerProperty(Button.typeName, "Padding", new Thickness(), FrameworkPropertyMetadataOptions.AffectsMeasure | FrameworkPropertyMetadataOptions.AffectsRender);
        get padding(): Thickness {
            return <Thickness>this.getValue(Button.paddingProperty);
        }
        set padding(value: Thickness) {
            this.setValue(Button.paddingProperty, value);
        }


        static textProperty = DepObject.registerProperty(Button.typeName, "Text", null, FrameworkPropertyMetadataOptions.AffectsMeasure | FrameworkPropertyMetadataOptions.AffectsRender);
        get text(): string {
            return <string>this.getValue(Button.textProperty);
        }
        set text(value: string) {
            this.setValue(Button.textProperty, value);
        }

        static commandProperty = DepObject.registerProperty(Button.typeName, "Command", null, FrameworkPropertyMetadataOptions.AffectsMeasure | FrameworkPropertyMetadataOptions.AffectsRender);
        get command(): Command {
            return <Command>this.getValue(Button.commandProperty);
        }
        set command(value: Command) {
            this.setValue(Button.commandProperty, value);
        }

        static commandParameterProperty = DepObject.registerProperty(Button.typeName, "commandParameter", null, FrameworkPropertyMetadataOptions.AffectsMeasure | FrameworkPropertyMetadataOptions.AffectsRender);
        get commandParameter(): any {
            return this.getValue(Button.commandParameterProperty);
        }
        set commandParameter(value: any) {
            this.setValue(Button.commandParameterProperty, value);
        }

    }
}