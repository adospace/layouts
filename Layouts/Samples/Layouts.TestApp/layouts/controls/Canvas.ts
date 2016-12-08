/// <reference path="..\DepProperty.ts" />
/// <reference path="..\FrameworkElement.ts" /> 
/// <reference path="Panel.ts" />

module layouts.controls {
    export class Canvas extends Panel {
        static typeName: string = "layouts.controls.Canvas";
        get typeName(): string {
            return Canvas.typeName;
        }



        protected measureOverride(constraint: Size): Size {
            var childConstraint = new Size(Infinity, Infinity);

            this.children.forEach(child=> {
                child.measure(childConstraint);
            });

            return new Size();
        }

        protected arrangeOverride(finalSize: Size): Size {
            this.children.forEach(child=> {
                let x = 0;
                let y = 0;

                let left = Canvas.getLeft(child);
                if (!isNaN(left)) {
                    x = left;
                }
                else {
                    let right = Canvas.getRight(child);

                    if (!isNaN(right)) {
                        x = finalSize.width - child.desiredSize.width - right;
                    }
                }

                let top = Canvas.getTop(child);
                if (!isNaN(top)) {
                    y = top;
                }
                else {
                    let bottom = Canvas.getBottom(child);

                    if (!isNaN(bottom)) {
                        y = finalSize.height - child.desiredSize.height - bottom;
                    }
                }

                child.arrange(new Rect(x, y, child.desiredSize.width, child.desiredSize.height));
            });

            return finalSize;

        }





        //properties

        //Canvas.Left property
        static leftProperty = DepObject.registerProperty(Canvas.typeName, "Canvas#Left", NaN, FrameworkPropertyMetadataOptions.AffectsMeasure, (v) => parseFloat(v));
        static getLeft(target: DepObject): number {
            return <number>target.getValue(Canvas.leftProperty);
        }
        static setLeft(target: DepObject, value: number) {
            target.setValue(Canvas.leftProperty, value);
        }
        //Canvas.Top property
        static topProperty = DepObject.registerProperty(Canvas.typeName, "Canvas#Top", NaN, FrameworkPropertyMetadataOptions.AffectsMeasure, (v) => parseFloat(v));
        static getTop(target: DepObject): number {
            return <number>target.getValue(Canvas.topProperty);
        }
        static setTop(target: DepObject, value: number) {
            target.setValue(Canvas.topProperty, value);
        }
        //Canvas.Right property
        static rightProperty = DepObject.registerProperty(Canvas.typeName, "Canvas#Right", NaN, FrameworkPropertyMetadataOptions.AffectsMeasure, (v) => parseFloat(v));
        static getRight(target: DepObject): number {
            return <number>target.getValue(Canvas.rightProperty);
        }
        static setRight(target: DepObject, value: number) {
            target.setValue(Canvas.rightProperty, value);
        }
        //Canvas.Bottom property
        static bottomProperty = DepObject.registerProperty(Canvas.typeName, "Canvas#Bottom", NaN, FrameworkPropertyMetadataOptions.AffectsMeasure, (v) => parseFloat(v));
        static getBottom(target: DepObject): number {
            return <number>target.getValue(Canvas.bottomProperty);
        }
        static setBottom(target: DepObject, value: number) {
            target.setValue(Canvas.bottomProperty, value);
        }
    }
} 