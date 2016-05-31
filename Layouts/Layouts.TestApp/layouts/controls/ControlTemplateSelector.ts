/// <reference path="..\DepProperty.ts" />
/// <reference path="..\DepObject.ts" />
/// <reference path="..\FrameworkElement.ts" /> 
/// <reference path="..\ISupport.ts" /> 

module layouts.controls {
    export class ControlTemplateSelector extends FrameworkElement {
        static typeName: string = "layouts.controls.ControlTemplateSelector";
        get typeName(): string {
            return ControlTemplateSelector.typeName;
        }

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

            var contentSource = this.contentSource;
            if (contentSource != null) {

                var templateForItem = DataTemplate.getTemplateForItem(this._templates.toArray(), contentSource);
                if (templateForItem == null) {
                    throw new Error("Unable to find a valid template for item");
                }

                this._element = templateForItem.createElement();
                this._element.setValue(FrameworkElement.dataContextProperty, contentSource);
            }


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

        protected onDependencyPropertyChanged(property: DepProperty, value: any, oldValue: any) {
            if (property == ControlTemplateSelector.contentSourceProperty) {
                this.setupItem();
            }

            super.onDependencyPropertyChanged(property, value, oldValue);
        }

        static contentSourceProperty = DepObject.registerProperty(ControlTemplateSelector.typeName, "ContentSource", null, FrameworkPropertyMetadataOptions.AffectsMeasure | FrameworkPropertyMetadataOptions.AffectsRender);
        get contentSource(): any {
            return <any>this.getValue(ControlTemplateSelector.contentSourceProperty);
        }
        set contentSource(value: any) {
            this.setValue(ControlTemplateSelector.contentSourceProperty, value);
        }

        //Templates collection
        private _templates: ObservableCollection<DataTemplate>;
        get templates(): ObservableCollection<DataTemplate> {
            return this._templates;
        }
        set templates(value: ObservableCollection<DataTemplate>) {
            if (value == this._templates)
                return;

            if (this._templates != null) {
                //remove handler so that resource can be disposed
                this._templates.offChangeNotify(this);
            }

            this._templates = value;

            if (this._templates != null) {
                this._templates.forEach(el=> {
                    //to do: re-apply templates to children
                });

                this._templates.onChangeNotify(this);
            }
        }

        onCollectionChanged(collection: any, added: Object[], removed: Object[], startRemoveIndex: number) {

            if (collection == this._templates) {
                //templates collection is changed
                this.setupItem();
            }

            this.invalidateMeasure();
        }

    }
}