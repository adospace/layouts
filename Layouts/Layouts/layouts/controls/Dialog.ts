/// <reference path="..\DepProperty.ts" />
/// <reference path="..\DepObject.ts" />
/// <reference path="..\FrameworkElement.ts" /> 

module layouts.controls {

    export class Dialog extends FrameworkElement {
        static typeName: string = "layouts.controls.Dialog";
        get typeName(): string{
            return Dialog.typeName;
        }

        private static _init = Dialog.initProperties();
        private static initProperties() {
            FrameworkElement.horizontalAlignmentProperty.overrideDefaultValue(Dialog.typeName, "Center");
            FrameworkElement.verticalAlignmentProperty.overrideDefaultValue(Dialog.typeName, "Center");
        }

        constructor() {
            super();
            this.child = this.initializeComponent();
        }

        private _child: UIElement;
        get child(): UIElement {
            return this._child;
        }
        set child(value: UIElement) {
            if (this._child != value) {
                if (this._child != null && this._child.parent == this) {
                    this._child.attachVisual(null);
                    this._child.parent = null;
                }
                this._child = value;
                if (this._child != null) {
                    this._child.parent = this;
                    this._child.attachVisual(document.body);
                }
                this.invalidateMeasure();
            }
        }

        protected initializeComponent(): UIElement {
            return null;
        }

        protected layoutOverride() {
            if (this._child != null)
                this._child.layout();
        }

        protected measureOverride(constraint: Size): Size {
            var mySize = new Size();

            if (this._child != null) {
                this._child.measure(constraint);
                return this._child.desideredSize;
            }

            return mySize;
        }

        protected arrangeOverride(finalSize: Size): Size {
            //  arrange child
            var child = this._child;
            if (child != null) {
                child.arrange(new Rect(0, 0, finalSize.width, finalSize.height));
            }

            return finalSize;
        }   


        //SizeToContent property
        static sizeToContentProperty = DepObject.registerProperty(Dialog.typeName, "SizeToContent", SizeToContent.None, FrameworkPropertyMetadataOptions.AffectsMeasure | FrameworkPropertyMetadataOptions.AffectsRender);
        get sizeToContent(): SizeToContent {
            return <SizeToContent>this.getValue(Dialog.sizeToContentProperty);
        }
        set sizeToContent(value: SizeToContent) {
            this.setValue(Dialog.sizeToContentProperty, value);
        }


    }
}