/// <reference path="..\DepProperty.ts" />
/// <reference path="..\DepObject.ts" />
/// <reference path="..\FrameworkElement.ts" /> 

module layouts.controls {
    export class UserControl extends FrameworkElement {
        static typeName: string = "layouts.controls.UserControl";
        get typeName(): string {
            return UserControl.typeName;
        }

        private _content: UIElement;
        protected initializeComponent(): UIElement {
            return null;
        }

        private tryLoadChildFromServer() {
            var req = new XMLHttpRequest();
            req.onreadystatechange = (ev) => {
                if (req.readyState == 4 && req.status == 200) {
                    let loader = new layouts.XamlReader();
                    //loader.namespaceResolver = (ns) => {
                    //    if (ns == "localViews")
                    //        return "app.views";

                    //    return null;
                    //};
                    this.setupChild(loader.Parse(req.responseText));
                }
            }
            //req.open("GET", "data/records.txt", true);
            //app.views.CustomView
            req.open("GET", this.typeName.replace(/\./gi, '/') + ".xml", true);
            req.send();
        }

        protected _container: HTMLElement;
        attachVisualOverride(elementContainer: HTMLElement) {

            this._container = elementContainer;

            this.setupChild(this.initializeComponent());

            super.attachVisualOverride(elementContainer);
        }

        private setupChild(content: UIElement) {
            var child = this._content;
            if (child == null) {
                this._content = child = content;

                if (child != null)
                    child.parent = this;
            }

            child = this._content;
            if (child != null) {
                child.attachVisual(this._container);
            }
            else {
                this.tryLoadChildFromServer();
            }
        }

        protected measureOverride(constraint: Size): Size {

            var child = this._content;
            if (child != null) {
                child.measure(constraint);
                return child.desiredSize;
            }

            return new Size();
        }

        protected arrangeOverride(finalSize: Size): Size {
            var child = this._content;
            if (child != null)
                child.arrange(finalSize.toRect());

            return finalSize;
        }

        protected layoutOverride() {
            super.layoutOverride();
            var child = this._content;
            if (child != null) {
                var childOffset = this.visualOffset;
                if (this.relativeOffset != null)
                    childOffset = childOffset.add(this.relativeOffset);

                child.layout(childOffset);
            }
            
        }
    }
}
     