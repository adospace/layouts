/// <reference path="..\DepProperty.ts" />
/// <reference path="..\DepObject.ts" />
/// <reference path="..\FrameworkElement.ts" /> 

module layouts.controls {
    export class NavigationContext {
        constructor(public previousPage: Page, public previousUri: string, public nextPage: Page, public nextUri: string, public queryString: {}) {

        }

        public cancel: boolean = false;
    }


    export class Page extends FrameworkElement {
        static typeName: string = "layouts.controls.Page";
        get typeName(): string{
            return Page.typeName;
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
        static sizeToContentProperty = DepObject.registerProperty(Page.typeName, "SizeToContent", SizeToContent.None, FrameworkPropertyMetadataOptions.AffectsMeasure | FrameworkPropertyMetadataOptions.AffectsRender);
        get sizeToContent(): SizeToContent {
            return <SizeToContent>this.getValue(Page.sizeToContentProperty);
        }
        set sizeToContent(value: SizeToContent) {
            this.setValue(Page.sizeToContentProperty, value);
        }

        //navigation system

        //if cachePage is true navigation system reuse already loaded page
        public cachePage: boolean = false;

        //onNavigate method is called also for reused/cached pages
        public onNavigate(context: NavigationContext) {

        }


    }
}