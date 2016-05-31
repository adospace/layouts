/// <reference path="../DepProperty.d.ts" />
/// <reference path="../DepObject.d.ts" />
/// <reference path="../FrameworkElement.d.ts" />
declare module layouts.controls {
    enum SizeToContent {
        None = 0,
        Both = 1,
        Vertical = 2,
        Horizontal = 3,
    }
    class Page extends FrameworkElement {
        private _child;
        Child: UIElement;
        protected layoutOverride(): void;
        protected measureOverride(constraint: Size): Size;
        protected arrangeOverride(finalSize: Size): Size;
        SizeToContent: SizeToContent;
    }
}
