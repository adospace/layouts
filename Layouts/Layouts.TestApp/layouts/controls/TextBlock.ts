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
            this._pElement.style.whiteSpace = this.whiteSpace;
            var text = this.format != null ? this.format.format(this.text) : this.text;
            this._pElement.innerHTML = text;

            super.attachVisualOverride(elementContainer);
        }

        //protected measureOverride(constraint: Size): Size {
        //    var text = this.format != null ? this.format.format(this.text) : this.text;
        //    var mySize = new Size();
        //    var pElement = this._pElement;
        //    var txtChanged = (pElement.innerText != text);

        //    if (isFinite(constraint.width))
        //        pElement.style.maxWidth = constraint.width + "px";
        //    if (isFinite(constraint.height))
        //        pElement.style.maxHeight = constraint.height + "px";
        //    pElement.style.width = "auto";
        //    pElement.style.height = "auto";
        //    pElement.style.whiteSpace = this.whiteSpace;
        //    if (txtChanged) {
        //        pElement.innerHTML = text;
        //    }
        //    mySize = new Size(pElement.clientWidth, pElement.clientHeight);

        //    if (txtChanged && this.renderSize != null) {
        //        pElement.style.width = this.renderSize.width.toString() + "px";
        //        pElement.style.height = this.renderSize.height.toString() + "px";
        //    }

        //    return mySize;
        //}

        protected measureOverride(constraint: Size): Size {
            var pElement = this._pElement;
            return new Size(0, pElement.clientHeight);
        }

        protected arrangeOverride(finalSize: Size): Size {

            var pElement = this._pElement;
            pElement.style.width = finalSize.width.toString() + "px";
            pElement.style.height = finalSize.height.toString() + "px";

            return finalSize;
        }

        //protected layoutOverride() {
        //    super.layoutOverride();

        //    this._pElement.style.whiteSpace = this.whiteSpace;
        //}

        protected onDependencyPropertyChanged(property: DepProperty, value: any, oldValue: any) {
            if (property == TextBlock.textProperty ||
                property == TextBlock.formatProperty) {
                var pElement = this._pElement;
                var text = this.format != null ? this.format.format(this.text) : this.text;
                if (pElement != null)
                    pElement.innerHTML = <string>value;
            }
            else if (property == TextBlock.whiteSpaceProperty) {
                var pElement = this._pElement;
                if (pElement != null)
                    pElement.style.whiteSpace = <string>value;
            }
            else if (property == TextBlock.whiteSpaceProperty) {
                var pElement = this._pElement;
                if (pElement != null)
                    pElement.style.whiteSpace = <string>value;
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