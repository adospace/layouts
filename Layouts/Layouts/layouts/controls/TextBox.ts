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

            this._pElement.type = "text";
            this._pElement.oninput = (ev) => this.onTextChanged();
            this._pElement.onchange = (ev) => this.onTextChanged();
            this._pElement.onkeypress = (ev) => this.onTextChanged();
            this._pElement.onpaste = (ev) => this.onTextChanged();

            super.attachVisualOverride(elementContainer);
        }

        onTextChanged() {
            this.text = this._pElement.value;
        }

        protected layoutOverride() {
            super.layoutOverride();

        }


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
            mySize = new Size(pElement.offsetWidth, pElement.clientHeight);

            if (txtChanged && this.renderSize != null) {
                pElement.style.width = this.renderSize.width.toString() + "px";
                pElement.style.height = this.renderSize.height.toString() + "px";
            }

            return mySize;
        }

        static textProperty = DepObject.registerProperty(TextBox.typeName, "Text", null, FrameworkPropertyMetadataOptions.AffectsMeasure | FrameworkPropertyMetadataOptions.AffectsRender, (v) => String(v));
        get text(): string {
            return <string>this.getValue(TextBox.textProperty);
        }
        set text(value: string) {
            this.setValue(TextBox.textProperty, value);
        }

    }
} 