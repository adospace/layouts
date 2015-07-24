/// <reference path="..\DepProperty.ts" />
/// <reference path="..\DepObject.ts" />
/// <reference path="..\FrameworkElement.ts" /> 

module layouts.controls {
    export class i extends FrameworkElement {
        static typeName: string = "layouts.controls.i";
        get typeName(): string {
            return i.typeName;
        }


        private _pElement: HTMLPhraseElement;
        attachVisualOverride(elementContainer: HTMLElement) {

            this._visual = this._pElement = document.createElement("i");

            super.attachVisualOverride(elementContainer);
        }

        protected layoutOverride() {
            super.layoutOverride();

        }


        protected measureOverride(constraint: Size): Size {
            var text = this.text;
            var mySize = new Size();
            var pElement = this._pElement;
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

        static textProperty = DepObject.registerProperty(TextBlock.typeName, "Text", null, FrameworkPropertyMetadataOptions.AffectsMeasure | FrameworkPropertyMetadataOptions.AffectsRender, (v) => String(v));
        get text(): string {
            return <string>this.getValue(TextBlock.textProperty);
        }
        set text(value: string) {
            this.setValue(TextBlock.textProperty, value);
        }

    }
} 