/// <reference path="..\DepProperty.ts" />
/// <reference path="..\DepObject.ts" />
/// <reference path="..\FrameworkElement.ts" /> 

module tsui.controls {
    export class TextBlock extends FrameworkElement {

        private _pElement: HTMLParagraphElement;
        attachVisualOverride(elementContainer: HTMLElement) {

            this._visual = this._pElement = document.createElement("p");

            super.attachVisualOverride(elementContainer);
        }

        protected layoutOverride() {
            super.layoutOverride();

            this._pElement.style.whiteSpace = this.whiteSpace;
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
            pElement.style.whiteSpace = this.whiteSpace;
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

        static textProperty = (new TextBlock()).registerProperty("Text", null, FrameworkPropertyMetadataOptions.AffectsMeasure | FrameworkPropertyMetadataOptions.AffectsRender);
        get text(): string {
            return <string>super.getValue(TextBlock.textProperty);
        }
        set text(value: string) {
            super.setValue(TextBlock.textProperty, value);
        }


        static whiteSpaceProperty = (new TextBlock()).registerProperty("WhiteSpace", "pre", FrameworkPropertyMetadataOptions.AffectsMeasure | FrameworkPropertyMetadataOptions.AffectsRender);
        get whiteSpace(): string {
            return <string>super.getValue(TextBlock.whiteSpaceProperty);
        }
        set whiteSpace(value: string) {
            super.setValue(TextBlock.whiteSpaceProperty, value);
        }


    }
}