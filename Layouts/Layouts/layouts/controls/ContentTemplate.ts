/// <reference path="..\DepProperty.ts" />
/// <reference path="..\DepObject.ts" />
/// <reference path="..\FrameworkElement.ts" /> 
/// <reference path="..\ISupport.ts" /> 

module layouts.controls {
    export class ContentTemplate extends FrameworkElement {
        static typeName: string = "layouts.controls.ContentTemplate";
        get typeName(): string {
            return ContentTemplate.typeName;
        }


        private _innerXaml: string;
        setInnerXaml(value: string) {
            this._innerXaml = value;
        }

        private _xamlLoader: XamlReader;
        setXamlLoader(loader: XamlReader) {
            this._xamlLoader = loader;
        }

        protected _container: HTMLElement;
        private _child: UIElement;

        private setupChild() {
            if (this._container == null)
                return;//not yet ready to create content element

            var content = this.content;
            var child = this._child;
            if (content == null &&
                child == null)
                return;

            if (content != null &&
                child == null) {
                if (this._innerXaml != null &&
                    this._xamlLoader != null) {
                    this._child = child = this._xamlLoader.Parse(this._innerXaml);
                }
            }

            if (content != null &&
                child != null) {
                child.setValue(FrameworkElement.dataContextProperty, content);
                //NOTE: Set datacontext before attach element to DOM
                //If it's attached without datacontext, bindings will target parent datacontext (ie my datacontext)
                //and when the correct datacontext is attached again to content, bindings will re-target to 
                //new context
                child.parent = this;
                child.attachVisual(this._container);
            }

            if (content == null &&
                child != null) {
                if (child.parent == this) {
                    child.parent = null;
                    child.attachVisual(null);
                }
            }

        }

        attachVisualOverride(elementContainer: HTMLElement) {

            this._container = elementContainer;

            this.setupChild();

            super.attachVisualOverride(elementContainer);
        }

        protected measureOverride(constraint: Size): Size {

            var child = this._child;
            if (child != null) {
                child.measure(constraint);
                return child.desiredSize;
            }

            return new Size();
        }

        protected arrangeOverride(finalSize: Size): Size {
            var child = this._child;
            if (child != null)
                child.arrange(finalSize.toRect());

            return finalSize;
        }

        protected layoutOverride() {
            super.layoutOverride();
            var child = this._child;
            if (child != null)
                child.layout(this.visualOffset);
        }

        static contentProperty = DepObject.registerProperty(ContentTemplate.typeName, "Content", null, FrameworkPropertyMetadataOptions.AffectsMeasure | FrameworkPropertyMetadataOptions.AffectsRender);
        get content(): any {
            return <any>this.getValue(ContentTemplate.contentProperty);
        }
        set content(value: any) {
            this.setValue(ContentTemplate.contentProperty, value);
        }

        protected onDependencyPropertyChanged(property: DepProperty, value: any, oldValue: any) {
            if (property == ContentTemplate.contentProperty) {
                this.setupChild();
            }

            super.onDependencyPropertyChanged(property, value, oldValue);
        }

    }
} 