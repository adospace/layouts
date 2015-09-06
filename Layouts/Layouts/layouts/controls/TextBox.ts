/// <reference path="..\DepProperty.ts" />
/// <reference path="..\DepObject.ts" />
/// <reference path="..\FrameworkElement.ts" /> 

module layouts.controls {
    export class TextBox extends FrameworkElement {
        static typeName: string = "layouts.controls.TextBox";
        get typeName(): string {
            return TextBox.typeName;
        }


        private _pElement: HTMLInputElement;
        attachVisualOverride(elementContainer: HTMLElement) {

            this._visual = this._pElement = document.createElement("input");

            this._pElement.type = this.type;
            this._pElement.oninput = (ev) => this.onTextChanged();
            this._pElement.onchange = (ev) => this.onTextChanged();
            this._pElement.onkeypress = (ev) => this.onTextChanged();
            this._pElement.onpaste = (ev) => this.onTextChanged();
            this._pElement.placeholder = this.placeholder;

            super.attachVisualOverride(elementContainer);
        }

        onTextChanged() {
            this.text = this._pElement.value;
        }

        clientSizeOffset: Size;

        protected measureOverride(constraint: Size): Size {
            var text = this.text;
            var mySize = new Size();
            var pElement = this._pElement;
            var txtChanged = (pElement.value != text);

            if (isFinite(constraint.width))
                pElement.style.maxWidth = constraint.width + "px";
            if (isFinite(constraint.height))
                pElement.style.maxHeight = constraint.height + "px";
            pElement.style.width = "auto";
            pElement.style.height = "auto";
            if (txtChanged) {
                pElement.value = this.text;
            }            
            
            //client size will maintain internal size of object
            //base class FrameworkElement is going to use RenderSize to set
            //style dimension of element
            this.clientSizeOffset = new Size(pElement.offsetWidth - pElement.clientWidth, pElement.offsetHeight - pElement.clientHeight);
            mySize = new Size(pElement.offsetWidth, pElement.offsetHeight);

            //if (txtChanged) {
            //    pElement.style.width = this.clientSize.width.toString() + "px";
            //    pElement.style.height = this.clientSize.height.toString() + "px";
            //}

            return mySize;
        }

        protected layoutOverride() {
            super.layoutOverride();

            //set appropriate size using saved client size in measure pass
            if (this.renderSize != null) {
                this._pElement.style.width = (this.renderSize.width - this.clientSizeOffset.width) + "px";
                this._pElement.style.height = (this.renderSize.height - this.clientSizeOffset.height) + "px";
            }
        }

        static textProperty = DepObject.registerProperty(TextBox.typeName, "Text", null, FrameworkPropertyMetadataOptions.AffectsMeasure | FrameworkPropertyMetadataOptions.AffectsRender);
        get text(): string {
            return <string>this.getValue(TextBox.textProperty);
        }
        set text(value: string) {
            this.setValue(TextBox.textProperty, value);
        }

        static placeholderProperty = DepObject.registerProperty(TextBox.typeName, "Placeholder", null, FrameworkPropertyMetadataOptions.AffectsMeasure | FrameworkPropertyMetadataOptions.AffectsRender);
        get placeholder(): string {
            return <string>this.getValue(TextBox.placeholderProperty);
        }
        set placeholder(value: string) {
            this.setValue(TextBox.placeholderProperty, value);
        }

        static typeProperty = DepObject.registerProperty(TextBox.typeName, "Type", "text", FrameworkPropertyMetadataOptions.AffectsMeasure | FrameworkPropertyMetadataOptions.AffectsRender);
        get type(): string {
            return <string>this.getValue(TextBox.typeProperty);
        }
        set type(value: string) {
            this.setValue(TextBox.typeProperty, value);
        }
    }
} 