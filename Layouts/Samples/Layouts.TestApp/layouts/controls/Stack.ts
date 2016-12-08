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

        
        protected measureOverride(constraint: Size): Size {
            var mySize = new Size();
            var orientation = this.orientation;

            if (this.children == null)
                return mySize;

            this.children.forEach(child=>
            {
                if (orientation == Orientation.Horizontal) {
                    child.measure(new Size(Infinity, constraint.height));
                    mySize.width += child.desiredSize.width;
                    mySize.height = Math.max(mySize.height, child.desiredSize.height);
                }
                else {
                    child.measure(new Size(constraint.width, Infinity));
                    mySize.width = Math.max(mySize.width, child.desiredSize.width);
                    mySize.height += child.desiredSize.height;
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
            var posChild = new Vector();
            var childrenSize = new Size();

            if (this.children != null) {
                this.children.forEach((child) => {
                    var sizeChild = new Size();
                    if (orientation == Orientation.Horizontal) {
                        sizeChild.width = child.desiredSize.width;
                        sizeChild.height = Math.max(finalSize.height, child.desiredSize.height);
                    }
                    else {
                        sizeChild.height = child.desiredSize.height;
                        sizeChild.width = Math.max(finalSize.width, child.desiredSize.width);
                    }

                    child.arrange(new Rect(posChild.x, posChild.y, sizeChild.width, sizeChild.height));

                    if (orientation == Orientation.Horizontal) {
                        posChild.x += sizeChild.width;
                        childrenSize.width += sizeChild.width;
                        childrenSize.height = Math.max(childrenSize.height, sizeChild.height);
                    }
                    else {
                        posChild.y += sizeChild.height;
                        childrenSize.width = Math.max(childrenSize.width, sizeChild.width);
                        childrenSize.height += sizeChild.height;
                    }
                });
            }

            if (orientation == Orientation.Horizontal)
                return new Size(Math.max(finalSize.width, childrenSize.width), finalSize.height);
            else
                return new Size(finalSize.width, Math.max(finalSize.height, childrenSize.height));
        }

        static orientationProperty = DepObject.registerProperty(Stack.typeName, "Orientation", Orientation.Vertical, FrameworkPropertyMetadataOptions.AffectsMeasure, (v) => Orientation[String(v)]);
        get orientation(): Orientation {
            return <Orientation>this.getValue(Stack.orientationProperty);
        }
        set orientation(value: Orientation) {
            this.setValue(Stack.orientationProperty, value);
        }

    }
} 