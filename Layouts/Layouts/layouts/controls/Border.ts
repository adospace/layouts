﻿/// <reference path="..\DepProperty.ts" />
/// <reference path="..\DepObject.ts" />
/// <reference path="..\FrameworkElement.ts" /> 

module tsui.controls {
    export class CornerRadius {
        constructor(public topleft: number = 0, public topright: number = null, public bottomright: number = null, public bottomleft: number = null) {
            if (topright == null)
                topright = this.topleft;
            if (bottomright == null)
                bottomright = this.topleft;
            if (bottomleft == null)
                bottomleft = this.topleft;
        }
    }

    export class Border extends FrameworkElement {

        private _child: UIElement;
        get child(): UIElement {
            return this._child;
        }
        set child(value: UIElement) {
            if (this._child != value) {
                if (this._child != null && this._child.parent == this)
                    this._child.parent = null;
                this._child = value;
                if (this._child != null) {
                    this._child.parent = this;
                    if (this._divElement != null)
                        this._child.attachVisual(this._divElement);
                }
                this.invalidateMeasure();
            }
        }

        protected _divElement: HTMLDivElement;
        attachVisualOverride(elementContainer: HTMLElement) {

            this._visual = this._divElement = document.createElement("div");

            if (this._child != null) {
                this._child.attachVisual(this._divElement);
            }

            super.attachVisualOverride(elementContainer);
        }

        protected measureOverride(constraint: Size) : Size {
            var mySize = new Size();

            // Compute the chrome size added by the various elements
            var border = new Size(this.borderThickness.left + this.borderThickness.right, this.borderThickness.top + this.borderThickness.bottom);
            var padding = new Size(this.padding.left + this.padding.right, this.padding.top + this.padding.bottom);

            //If we have a child
            if (this._child != null) {
                // Combine into total decorating size
                var combined = new Size(border.width + padding.width, border.height + padding.height);

                // Remove size of border only from child's reference size.
                var childConstraint = new Size(Math.max(0.0, constraint.width - combined.width),
                    Math.max(0.0, constraint.height - combined.height));


                this._child.measure(childConstraint);
                var childSize = this._child.desideredSize;

                // Now use the returned size to drive our size, by adding back the margins, etc.
                mySize.width = childSize.width + combined.width;
                mySize.height = childSize.height + combined.height;
            }
            else {
                // Combine into total decorating size
                mySize = new Size(border.width + padding.width, border.height + padding.height);
            }

            return mySize;
        }    

        protected arrangeOverride(finalSize: Size): Size {
            var borders = this.borderThickness;
            var boundRect = new Rect(0,0,finalSize.width, finalSize.height);
            var innerRect = new Rect(boundRect.x + borders.left,
                boundRect.y + borders.top,
                Math.max(0.0, boundRect.width - borders.left - borders.right),
                Math.max(0.0, boundRect.height - borders.top - borders.bottom));

            var borderBrush = this.borderBrush;

            //  arrange child
            var child = this._child;
            var padding = this.padding;
            if (child != null) {
                var childRect = new Rect(innerRect.x + padding.left,
                    innerRect.y + padding.top,
                    Math.max(0.0, innerRect.width - padding.left - padding.right),
                    Math.max(0.0, innerRect.height - padding.top - padding.bottom));

                child.arrange(childRect);
            }

            return finalSize;
        }   

        protected layoutOverride() {
            super.layoutOverride();

            var background = this.background;
            if (this._visual.style.background != background)
                this._visual.style.background = background;

            if (this._child != null)
                this._child.layout();
        }

        static borderThicknessProperty = (new Border()).registerProperty("BorderThickness", new Thickness(), FrameworkPropertyMetadataOptions.AffectsMeasure | FrameworkPropertyMetadataOptions.AffectsRender);
        get borderThickness(): Thickness {
            return <Thickness>super.getValue(Border.borderThicknessProperty);
        }
        set borderThickness(value: Thickness) {
            super.setValue(Border.borderThicknessProperty, value);
        }

        static paddingProperty = (new Border()).registerProperty("Padding", new Thickness(), FrameworkPropertyMetadataOptions.AffectsMeasure | FrameworkPropertyMetadataOptions.AffectsRender);
        get padding(): Thickness {
            return <Thickness>super.getValue(Border.paddingProperty);
        }
        set padding(value: Thickness) {
            super.setValue(Border.paddingProperty, value);
        }

        static backgroundProperty = (new Border()).registerProperty("Background", null, FrameworkPropertyMetadataOptions.AffectsRender);
        get background(): string {
            return <string>super.getValue(Border.backgroundProperty);
        }
        set background(value: string) {
            super.setValue(Border.backgroundProperty, value);
        }

        static borderBrushProperty = (new Border()).registerProperty("BorderBrush", null, FrameworkPropertyMetadataOptions.AffectsRender);
        get borderBrush(): string {
            return <string>super.getValue(Border.borderBrushProperty);
        }
        set borderBrush(value: string) {
            super.setValue(Border.borderBrushProperty, value);
        }
    }
}