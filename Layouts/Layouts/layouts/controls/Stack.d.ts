/// <reference path="../DepProperty.d.ts" />
/// <reference path="../FrameworkElement.d.ts" />
/// <reference path="Panel.d.ts" />
declare module layouts.controls {
    enum Orientation {
        Horizontal = 0,
        Vertical = 1,
    }
    class Stack extends Panel {
        protected measureOverride(constraint: Size): Size;
        protected arrangeOverride(finalSize: Size): Size;
        static orientationProperty: DepProperty;
        orientation: Orientation;
    }
}
