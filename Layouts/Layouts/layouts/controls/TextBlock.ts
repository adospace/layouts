/// <reference path="..\DepProperty.ts" />
/// <reference path="..\DepObject.ts" />
/// <reference path="..\FrameworkElement.ts" /> 

module layouts.controls {
    export class TextBlock extends FrameworkElement {
        static typeName: string = "layouts.controls.TextBlock";
        get typeName(): string {
            return TextBlock.typeName;
        }


        private _pElement: HTMLParagraphElement;
        attachVisualOverride(elementContainer: HTMLElement) {

            this._visual = this._pElement = document.createElement("p");
            this._visual.style.msUserSelect =
                this._visual.style.webkitUserSelect = "none";
            this._pElement.style.whiteSpace = this.whiteSpace;
            var text = this.text;
            var format = this.format;
            text = format != null && text != null && text != Consts.stringEmpty ? format.format(text) : text;
            this._pElement.innerHTML = text == null ? layouts.Consts.stringEmpty : text;

            super.attachVisualOverride(elementContainer);
        }

        private _measuredSize: Size;
        protected measureOverride(constraint: Size): Size {
            var pElement = this._pElement;
            if (this._measuredSize == null) {
                pElement.style.width = "";
                pElement.style.height = "";
                this._measuredSize = new Size(pElement.clientWidth, pElement.clientHeight);
            }
            return new Size(Math.min(constraint.width, this._measuredSize.width), Math.min(constraint.height, this._measuredSize.height));
        }

        protected arrangeOverride(finalSize: Size): Size {

            var pElement = this._pElement;
            pElement.style.width = finalSize.width.toString() + "px";
            pElement.style.height = finalSize.height.toString() + "px";

            return finalSize;
        }

        protected onDependencyPropertyChanged(property: DepProperty, value: any, oldValue: any) {
            if (property == TextBlock.textProperty ||
                property == TextBlock.formatProperty) {
                var pElement = this._pElement;
                var text = <string>value;
                var format = this.format;
                text = format != null && text != null && text != Consts.stringEmpty ? format.format(text) : text;
                if (pElement != null) {
                    pElement.innerHTML = text == null ? layouts.Consts.stringEmpty : text;
                    this._measuredSize = null;
                }
            }
            else if (property == TextBlock.whiteSpaceProperty) {
                var pElement = this._pElement;
                if (pElement != null) {
                    pElement.style.whiteSpace = <string>value;
                    this._measuredSize = null;
                }
            }

            super.onDependencyPropertyChanged(property, value, oldValue);
        }


        static textProperty = DepObject.registerProperty(TextBlock.typeName, "Text", null, FrameworkPropertyMetadataOptions.AffectsMeasure | FrameworkPropertyMetadataOptions.AffectsRender, (v) => String(v));
        get text(): string {
            return <string>this.getValue(TextBlock.textProperty);
        }
        set text(value: string) {
            this.setValue(TextBlock.textProperty, value);
        }

        static whiteSpaceProperty = DepObject.registerProperty(TextBlock.typeName, "WhiteSpace", "pre", FrameworkPropertyMetadataOptions.AffectsMeasure | FrameworkPropertyMetadataOptions.AffectsRender);
        get whiteSpace(): string {
            return <string>this.getValue(TextBlock.whiteSpaceProperty);
        }
        set whiteSpace(value: string) {
            this.setValue(TextBlock.whiteSpaceProperty, value);
        }

        static formatProperty = DepObject.registerProperty(TextBlock.typeName, "Format", null, FrameworkPropertyMetadataOptions.AffectsMeasure | FrameworkPropertyMetadataOptions.AffectsRender, (v) => String(v));
        get format(): string {
            return <string>this.getValue(TextBlock.formatProperty);
        }
        set format(value: string) {
            this.setValue(TextBlock.formatProperty, value);
        }


    }
}