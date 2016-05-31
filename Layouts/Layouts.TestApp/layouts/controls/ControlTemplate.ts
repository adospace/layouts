/// <reference path="..\DepProperty.ts" />
/// <reference path="..\DepObject.ts" />
/// <reference path="..\FrameworkElement.ts" /> 
/// <reference path="..\ISupport.ts" /> 

module layouts.controls {
    export class ControlTemplate extends FrameworkElement {
        static typeName: string = "layouts.controls.ControlTemplate";
        get typeName(): string {
            return ControlTemplate.typeName;
        }

        protected _container: HTMLElement;
        attachVisualOverride(elementContainer: HTMLElement) {

            this._container = elementContainer;

            var child = this.content;
            if (child != null) {
                child.parent = this;
                child.attachVisual(this._container);
            }

            super.attachVisualOverride(elementContainer);
        }

        protected measureOverride(constraint: Size): Size {

            var child = this.content;
            if (child != null) {
                child.measure(constraint);
                return child.desiredSize;
            }

            return new Size();
        }

        protected arrangeOverride(finalSize: Size): Size {
            var child = this.content;
            if (child != null) 
                child.arrange(finalSize.toRect());

            return finalSize;
        }

        protected layoutOverride() {
            super.layoutOverride();
            var child = this.content;
            if (child != null) {
                var childOffset = this.visualOffset;
                if (this.relativeOffset != null)
                    childOffset = childOffset.add(this.relativeOffset);

                child.layout(childOffset);
            }
        }

        protected onDependencyPropertyChanged(property: DepProperty, value: any, oldValue: any) {
            if (property == ControlTemplate.contentProperty) {
                var oldChild = <UIElement>oldValue;
                if (oldChild != null && oldChild.parent == this) {
                    oldChild.attachVisual(null);
                    oldChild.parent = null;
                }

                var newChild = <UIElement>value;
                if (newChild != null) {
                    //NOTE: change parent AFTER attachVisual because changing parent will raise
                    //notifications to binding to DataContext
                    if (this._container != null)
                        newChild.attachVisual(this._container);
                    newChild.parent = this;
                }
            }


            super.onDependencyPropertyChanged(property, value, oldValue);
        }

        static contentProperty = DepObject.registerProperty(ControlTemplate.typeName, "Content", null, FrameworkPropertyMetadataOptions.AffectsMeasure | FrameworkPropertyMetadataOptions.AffectsRender);
        get content(): UIElement {
            return <UIElement>this.getValue(ControlTemplate.contentProperty);
        }
        set content(value: UIElement) {
            this.setValue(ControlTemplate.contentProperty, value);
        }

    }
}