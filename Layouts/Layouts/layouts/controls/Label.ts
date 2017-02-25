/// <reference path="..\DepProperty.ts" />
/// <reference path="..\DepObject.ts" />
/// <reference path="TextBlock.ts" /> 

module layouts.controls {
    export class Label extends TextBlock {
        static typeName: string = "layouts.controls.Label";
        get typeName(): string {
            return Label.typeName;
        }

        private _label: HTMLLabelElement;

        protected createElement(elementContainer: HTMLElement): HTMLElement {
            this._label = document.createElement("label");
            this._label.htmlFor = this.htmlFor;
            return this._label;
        }


        static htmlForProperty = DepObject.registerProperty(Label.typeName, "For", null, FrameworkPropertyMetadataOptions.None, (v) => String(v));
        get htmlFor(): string {
            return <string>this.getValue(Label.htmlForProperty);
        }
        set htmlFor(value: string) {
            this.setValue(Label.htmlForProperty, value);
        }

        protected onDependencyPropertyChanged(property: DepProperty, value: any, oldValue: any) {
            if (property == Label.htmlForProperty) {
                this._label.htmlFor = this.htmlFor;
            }

            super.onDependencyPropertyChanged(property, value, oldValue);
        }
    }
}