/// <reference path="../DepProperty.d.ts" />
/// <reference path="../DepObject.d.ts" />
/// <reference path="../FrameworkElement.d.ts" />
declare module layouts.controls {
    class CornerRadius {
        topleft: number;
        topright: number;
        bottomright: number;
        bottomleft: number;
        constructor(topleft?: number, topright?: number, bottomright?: number, bottomleft?: number);
    }
    class Border extends FrameworkElement {
        private _child;
        child: UIElement;
        protected _divElement: HTMLDivElement;
        attachVisualOverride(elementContainer: HTMLElement): void;
        protected measureOverride(constraint: Size): Size;
        protected arrangeOverride(finalSize: Size): Size;
        protected layoutOverride(): void;
        static borderThicknessProperty: DepProperty;
        borderThickness: Thickness;
        static paddingProperty: DepProperty;
        padding: Thickness;
        static backgroundProperty: DepProperty;
        background: string;
        static borderBrushProperty: DepProperty;
        borderBrush: string;
    }
}
