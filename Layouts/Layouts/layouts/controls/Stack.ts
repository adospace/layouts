/// <reference path="..\DepProperty.ts" />
/// <reference path="..\FrameworkElement.ts" /> 
/// <reference path="Panel.ts" />

module layouts.controls {
    /// <summary>
    /// Orientation indicates a direction of a control/layout that can exist in a horizontal or vertical state.
    /// Examples of these elements include: <see cref="Slider" /> and <see cref="Primitives.ScrollBar" />.
    /// </summary>
    export enum Orientation {
        /// <summary>
        /// Control/Layout should be horizontally oriented.
        /// </summary>
        Horizontal,
        /// <summary>
        /// Control/Layout should be vertically oriented.
        /// </summary>
        Vertical,
    }

    export class Stack extends Panel {
        static typeName: string = "layouts.controls.Stack";
        get typeName(): string {
            return Stack.typeName;
        }

        private static _init = Stack.initProperties();
        private static initProperties() {
            FrameworkElement.overflowXProperty.overrideDefaultValue(Stack.typeName, "auto");
            FrameworkElement.overflowYProperty.overrideDefaultValue(Stack.typeName, "auto");
        }



        protected measureOverride(constraint: Size): Size {
            var mySize = new Size();
            var orientation = this.orientation;

            if (this.children == null)
                return mySize;

            this.children.forEach(child=>
            {
                if (orientation == Orientation.Horizontal) {
                    child.measure(new Size(Infinity, constraint.height));
                    mySize.width += child.desideredSize.width;
                    mySize.height = Math.max(mySize.height, child.desideredSize.height);
                }
                else {
                    child.measure(new Size(constraint.width, Infinity));
                    mySize.width = Math.max(mySize.width, child.desideredSize.width);
                    mySize.height += child.desideredSize.height;
                }
            });

            if (this.virtualItemCount > this.children.count) {
                if (orientation == Orientation.Horizontal)
                    mySize.width += (mySize.width / this.children.count) * (this.virtualItemCount - this.children.count);
                else
                    mySize.height += (mySize.height / this.children.count) * (this.virtualItemCount - this.children.count);
            }

            return mySize;
        }

        protected arrangeOverride(finalSize: Size): Size {
            var orientation = this.orientation;
            var rcChild = new Rect(0, 0, finalSize.width, finalSize.height);
            var previousChildSize = 0.0;

            if (this.virtualOffset != null && 
                this.virtualItemCount > this.children.count)
                previousChildSize = (orientation == Orientation.Horizontal) ? this.virtualOffset.x : this.virtualOffset.y;

            if (this.children != null) {
                this.children.forEach((child) => {
                    if (orientation == Orientation.Horizontal) {
                        rcChild.x += previousChildSize;
                        previousChildSize = child.desideredSize.width;
                        rcChild.width = previousChildSize;
                        rcChild.height = Math.max(finalSize.height, child.desideredSize.height);
                    }
                    else {
                        rcChild.y += previousChildSize;
                        previousChildSize = child.desideredSize.height;
                        rcChild.height = previousChildSize;
                        rcChild.width = Math.max(finalSize.width, child.desideredSize.width);
                    }

                    child.arrange(rcChild);
                });
            }

            return finalSize;
        }

        static orientationProperty = DepObject.registerProperty(Stack.typeName, "Orientation", Orientation.Vertical, FrameworkPropertyMetadataOptions.AffectsMeasure);
        get orientation(): Orientation {
            return <Orientation>this.getValue(Stack.orientationProperty);
        }
        set orientation(value: Orientation) {
            this.setValue(Stack.orientationProperty, value);
        }

    }
} 