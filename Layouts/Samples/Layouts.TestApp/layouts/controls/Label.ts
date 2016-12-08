/// <reference path="..\DepProperty.ts" />
/// <reference path="..\DepObject.ts" />
/// <reference path="TextBlock.ts" /> 

module layouts.controls {
    export class Label extends TextBlock {
        static typeName: string = "layouts.controls.Label";
        get typeName(): string {
            return Label.typeName;
        }

        protected createElement(elementContainer: HTMLElement): HTMLElement {
            var label = document.createElement("label");
            label.htmlFor = this.htmlFor;
            return label;
        }


        static htmlForProperty = DepObject.registerProperty(Label.typeName, "For", null, FrameworkPropertyMetadataOptions.None, (v) => String(v));
        get htmlFor(): string {
            return <string>this.getValue(Label.htmlForProperty);
        }
        set htmlFor(value: string) {
            this.setValue(Label.htmlForProperty, value);
        }


    }
}