module layouts.controls {
    export class MediaTemplateSelector extends FrameworkElement {
        static typeName: string = "layouts.controls.MediaTemplateSelector";
        get typeName(): string {
            return MediaTemplateSelector.typeName;
        }


        //private _innerXaml: string;
        //setInnerXaml(value: string) {
        //    this._innerXaml = value;
        //}

        //private _xamlLoader: XamlReader;
        //setXamlLoader(loader: XamlReader) {
        //    this._xamlLoader = loader;
        //}

        //protected _container: HTMLElement;
        //private _child: UIElement;

        //private _mediaQueryEvaluated: boolean;
        //private _mediaQueryMatch: boolean;

        //private setupChild() {
        //    if (this._container == null)
        //        return;//not yet ready to create content element

        //    if (this.media == null ||
        //        this.media.trim().length == 0) {
        //        this._mediaQueryEvaluated = true;
        //        this._mediaQueryMatch = true;
        //    }

        //    if (!this._mediaQueryEvaluated) {
        //        this._mediaQueryEvaluated = true;
        //        this._mediaQueryMatch = window.matchMedia(this.media).matches;
        //    }

        //    if (!this._mediaQueryMatch)
        //        return;

        //    var child = this._child;

        //    if (child == null) {
        //        if (this._innerXaml != null &&
        //            this._xamlLoader != null) {
        //            this._child = child = this._xamlLoader.Parse(this._innerXaml);
        //        }
        //    }

        //    if (child != null) {
        //        child.parent = this;
        //        child.attachVisual(this._container);
        //    }
        //}

        //attachVisualOverride(elementContainer: HTMLElement) {

        //    this._container = elementContainer;

        //    this.setupChild();

        //    super.attachVisualOverride(elementContainer);
        //}

        //protected measureOverride(constraint: Size): Size {

        //    var child = this._child;
        //    if (child != null) {
        //        child.measure(constraint);
        //        return child.desiredSize;
        //    }

        //    return new Size();
        //}

        //protected arrangeOverride(finalSize: Size): Size {
        //    var child = this._child;
        //    if (child != null)
        //        child.arrange(finalSize.toRect());

        //    return finalSize;
        //}

        //protected layoutOverride() {
        //    super.layoutOverride();
        //    var child = this._child;
        //    if (child != null)
        //        child.layout(this.visualOffset);
        //}

        protected _container: HTMLElement;
        attachVisualOverride(elementContainer: HTMLElement) {

            this._container = elementContainer;

            this.setupItem();

            super.attachVisualOverride(elementContainer);
        }

        private _element: UIElement;

        private setupItem() {
            if (this._container == null)
                return;

            if (this._element != null) {
                this._element.attachVisual(null);
                this._element.parent = null;
            }

            if (this._templates == null ||
                this._templates.count == 0)
                return;

            var templateForItem = DataTemplate.getTemplateForMedia(this._templates.toArray());
            if (templateForItem == null) {
                throw new Error("Unable to find a valid template for this media");
            }

            this._element = templateForItem.createElement();

            if (this._element != null) {
                this._element.attachVisual(this._container);
                this._element.parent = this;
            }

            this.invalidateMeasure();
        }

        protected measureOverride(constraint: Size): Size {

            var child = this._element;
            if (child != null) {
                child.measure(constraint);
                return child.desiredSize;
            }

            return new Size();
        }

        protected arrangeOverride(finalSize: Size): Size {
            var child = this._element;
            if (child != null)
                child.arrange(finalSize.toRect());

            return finalSize;
        }

        protected layoutOverride() {
            super.layoutOverride();
            var child = this._element;
            if (child != null) {
                var childOffset = this.visualOffset;
                if (this.relativeOffset != null)
                    childOffset = childOffset.add(this.relativeOffset);

                child.layout(childOffset);
            }
        }

        //Templates collection
        private _templates: ObservableCollection<DataTemplate>;
        get templates(): ObservableCollection<DataTemplate> {
            return this._templates;
        }
        set templates(value: ObservableCollection<DataTemplate>) {
            this._templates = value;
        }

    }


} 