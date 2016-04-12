/// <reference path="..\DepProperty.ts" />
/// <reference path="..\DepObject.ts" />
/// <reference path="..\FrameworkElement.ts" /> 

module layouts.controls {
    export class NavigationContext {
        constructor(public previousPage: Page, public previousUri: string, public nextPage: Page, public nextUri: string, public queryString: {}) {

        }

        public cancel: boolean = false;
        public returnUri: string = null;
    }


    export class Page extends FrameworkElement {
        static typeName: string = "layouts.controls.Page";
        get typeName(): string{
            return Page.typeName;
        }
        
        private tryLoadChildFromServer() {
            var req = new XMLHttpRequest();
            req.onreadystatechange = (ev) => {
                if (req.readyState == 4 && req.status == 200) {
                    let loader = new layouts.XamlReader();
                    this.child = loader.Parse(req.responseText);
                }
            }
            req.open("GET", this.typeName.replace(/\./gi, '/') + ".xml", true);
            req.send();
        }

        protected _container: HTMLElement;
        attachVisualOverride(elementContainer: HTMLElement) {

            this._container = elementContainer;

            var child = this.child;
            if (child != null) {
                child.parent = this;
                child.attachVisual(this._container);
            }
            else {
                this.tryLoadChildFromServer();
            }

            super.attachVisualOverride(elementContainer);
        }

        protected layoutOverride() {
            var child = this.child;
            if (child != null)
                child.layout();
        }

        protected measureOverride(constraint: Size): Size {
            var mySize = new Size();

            var child = this.child;
            if (child != null) {
                child.measure(constraint);
                return child.desiredSize;
            }

            return mySize;
        }

        protected arrangeOverride(finalSize: Size): Size {
            //  arrange child
            var child = this.child;
            if (child != null) {
                child.arrange(new Rect(0, 0, finalSize.width, finalSize.height));
            }

            return finalSize;
        }   

        static childProperty = DepObject.registerProperty(Page.typeName, "Child", null, FrameworkPropertyMetadataOptions.AffectsMeasure | FrameworkPropertyMetadataOptions.AffectsRender);
        get child(): UIElement {
            return <UIElement>this.getValue(Page.childProperty);
        }
        set child(value: UIElement) {
            this.setValue(Page.childProperty, value);
        }

        protected onDependencyPropertyChanged(property: DepProperty, value: any, oldValue: any) {
            if (property == Page.childProperty) {
                var oldChild = <UIElement>oldValue;
                if (oldChild != null && oldChild.parent == this) {
                    oldChild.parent = null;
                    oldChild.attachVisual(null);
                }

                var newChild = <UIElement>value;
                if (newChild != null) {
                    newChild.parent = this;
                    if (this._container != null)
                        newChild.attachVisual(this._container);
                }
            }

            super.onDependencyPropertyChanged(property, value, oldValue);
        }
    

        //SizeToContent property
        static sizeToContentProperty = DepObject.registerProperty(Page.typeName, "SizeToContent", SizeToContent.None, FrameworkPropertyMetadataOptions.AffectsMeasure | FrameworkPropertyMetadataOptions.AffectsRender, (v) => SizeToContent[String(v)]);
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