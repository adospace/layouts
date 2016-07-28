/// <reference path="..\DepProperty.ts" />
/// <reference path="..\DepObject.ts" />
/// <reference path="..\FrameworkElement.ts" /> 

module layouts.controls {
    export class CheckBox extends FrameworkElement {
        static typeName: string = "layouts.controls.CheckBox";
        get typeName(): string {
            return CheckBox.typeName;
        }


        private _pElementInput: HTMLInputElement;


        attachVisualOverride(elementContainer: HTMLElement) {

            this._visual = this._pElementInput = document.createElement("input");

            this._pElementInput.type = this.type;
            this._pElementInput.checked = this.isChecked;
            this._pElementInput.onclick = (ev) => this.onCheckChanged();

            super.attachVisualOverride(elementContainer);
        }

        onCheckChanged() {
            this.isChecked = this._pElementInput.checked;
        }

        private _measuredSize: Size;

        protected measureOverride(constraint: Size): Size {
            var pElement = this._pElementInput;
            if (this._measuredSize == null) {
                pElement.style.width = "";
                pElement.style.height = "";
                this._measuredSize = new Size(pElement.offsetWidth, pElement.offsetHeight);
            }
            return new Size(Math.min(constraint.width, this._measuredSize.width), Math.min(constraint.height, this._measuredSize.height));
        }

        //protected layoutOverride() {
        //    super.layoutOverride();

        //    //layoutOverride above set style.width and styl.height
        //    //at that point browser compute new offsetWidth and offetHeight
        //    //we need to reset style.width/height so that textbox don't exceed space
        //    //that out parent has reserved for this control
        //    if (this.renderSize != null) {
        //        this._pElement.style.width = (this.renderSize.width - (this._pElement.offsetWidth - this.renderSize.width)) + "px";
        //        this._pElement.style.height = (this.renderSize.height - (this._pElement.offsetHeight - this.renderSize.height)) + "px";
        //    }
        //}

        protected onDependencyPropertyChanged(property: DepProperty, value: any, oldValue: any) {
            if (property == CheckBox.nameProperty) {
                var pElement = this._pElementInput;
                if (pElement != null) {
                    this._pElementInput.name = <string>value;
                    this._measuredSize = null;
                }
            }
            else if (property == CheckBox.typeProperty) {
                var pElement = this._pElementInput;
                if (pElement != null) {
                    this._pElementInput.type = <string>value;
                    this._measuredSize = null;
                }
            }
            else if (property == CheckBox.isCheckedProperty) {
                var pElement = this._pElementInput;
                if (pElement != null) {
                    this._pElementInput.checked = <boolean>value;
                }
            }


            super.onDependencyPropertyChanged(property, value, oldValue);
        }

        static isCheckedProperty = DepObject.registerProperty(CheckBox.typeName, "IsChecked", false, FrameworkPropertyMetadataOptions.None);
        get isChecked(): boolean {
            return <boolean>this.getValue(CheckBox.isCheckedProperty);
        }
        set isChecked(value: boolean) {
            this.setValue(CheckBox.isCheckedProperty, value);
        }


        static nameProperty = DepObject.registerProperty(CheckBox.typeName, "Name", "", FrameworkPropertyMetadataOptions.AffectsMeasure | FrameworkPropertyMetadataOptions.AffectsRender);
        get name(): string {
            return <string>this.getValue(CheckBox.nameProperty);
        }
        set placeholder(value: string) {
            this.setValue(CheckBox.nameProperty, value);
        }

        static typeProperty = DepObject.registerProperty(CheckBox.typeName, "Type", "checkbox", FrameworkPropertyMetadataOptions.AffectsMeasure | FrameworkPropertyMetadataOptions.AffectsRender);
        get type(): string {
            return <string>this.getValue(CheckBox.typeProperty);
        }
        set type(value: string) {
            this.setValue(CheckBox.typeProperty, value);
        }

    }
} 