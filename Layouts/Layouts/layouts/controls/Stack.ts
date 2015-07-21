﻿/// <reference path="..\DepProperty.ts" />
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

        protected measureOverride(constraint: Size): Size {
            var mySize = new Size();
            var orientation = this.orientation;

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

            return mySize;
        }

        protected arrangeOverride(finalSize: Size): Size {
            var orientation = this.orientation;
            var rcChild = new Rect(0, 0, finalSize.width, finalSize.height);
            var previousChildSize = 0.0;

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

            return finalSize;
        }

        static orientationProperty = (new Stack()).registerProperty("Orientation", Orientation.Vertical, FrameworkPropertyMetadataOptions.AffectsMeasure);
        get orientation(): Orientation {
            return <Orientation>super.getValue(Stack.orientationProperty);
        }
        set orientation(value: Orientation) {
            super.setValue(Stack.orientationProperty, value);
        }

    }
} 