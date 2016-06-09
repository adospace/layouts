/// <reference path="..\DepProperty.ts" />
/// <reference path="..\DepObject.ts" />
/// <reference path="..\FrameworkElement.ts" /> 

module layouts.controls {

    export enum PopupPosition {
        Center,
        Left,
        LeftTop,
        LeftBottom,
        Top,
        TopLeft,
        TopRight,
        Right,
        RightTop,
        RightBottom,
        Bottom,     
        BottomLeft,       
        BottomRight,       
    }

    export class Popup extends FrameworkElement {
        static typeName: string = "layouts.controls.Popup";
        get typeName(): string {
            return Popup.typeName;
        }

        private static _init = Popup.initProperties();
        private static initProperties() {
            FrameworkElement.horizontalAlignmentProperty.overrideDefaultValue(Popup.typeName, "Center");
            FrameworkElement.verticalAlignmentProperty.overrideDefaultValue(Popup.typeName, "Center");
        }

        constructor() {
            super();
        }

        private tryLoadChildFromServer() {
            var req = new XMLHttpRequest();
            req.onreadystatechange = (ev) => {
                if (req.readyState == 4 && req.status == 200) {
                    let loader = new layouts.XamlReader();
                    this._child = loader.Parse(req.responseText);
                    if (this._child != null) {
                        this._child.parent = this;
                        this._child.attachVisual(document.body);
                    }
                }
            }
            req.open("GET", this.typeName.replace(/\./gi, '/') + ".xml", true);
            req.send();
        }

        attachVisualOverride(elementContainer: HTMLElement) {



            super.attachVisualOverride(elementContainer);
        }


        private _child: UIElement;
        get child(): UIElement {
            return this._child;
        }
        set child(value: UIElement) {
            if (this._child != value) {
                this._child = value;
                this.invalidateMeasure();
            }
        }

        onShow() {
            if (this._child == null)
                this._child = this.initializeComponent();
            if (this._child != null) {
                this._child.parent = this;
                this._child.attachVisual(document.body);
            }
            else
                this.tryLoadChildFromServer();
        }

        onClose() {
            if (this._child != null && this._child.parent == this) {
                this._child.attachVisual(null);
                this._child.parent = null;
            }
        }

        protected initializeComponent(): UIElement {
            return null;
        }

        protected layoutOverride() {
            super.layoutOverride();
            var child = this.child;
            if (child != null) {
                var childOffset = this.visualOffset;
                if (this.relativeOffset != null)
                    childOffset = childOffset.add(this.relativeOffset);

                child.layout(childOffset);
            }

        }

        protected measureOverride(constraint: Size): Size {
            var mySize = new Size();

            if (this._child != null) {
                this._child.measure(constraint);
                return this._child.desiredSize;
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
        static sizeToContentProperty = DepObject.registerProperty(Popup.typeName, "SizeToContent", SizeToContent.Both, FrameworkPropertyMetadataOptions.AffectsMeasure | FrameworkPropertyMetadataOptions.AffectsRender, (v) => SizeToContent[String(v)]);
        get sizeToContent(): SizeToContent {
            return <SizeToContent>this.getValue(Popup.sizeToContentProperty);
        }
        set sizeToContent(value: SizeToContent) {
            this.setValue(Popup.sizeToContentProperty, value);
        }        

        static positionProperty = DepObject.registerProperty(Popup.typeName, "Position", PopupPosition.Center, FrameworkPropertyMetadataOptions.AffectsMeasure | FrameworkPropertyMetadataOptions.AffectsRender, (v) => PopupPosition[String(v)]);
        get position(): PopupPosition {
            return <PopupPosition>this.getValue(Popup.positionProperty);
        }
        set position(value: PopupPosition) {
            this.setValue(Popup.positionProperty, value);
        }
    }
}