/// <reference path="../DepProperty.d.ts" />
/// <reference path="../DepObject.d.ts" />
/// <reference path="../FrameworkElement.d.ts" />
declare module layouts.controls {
    class Button extends FrameworkElement {
        private _child;
        child: UIElement;
        protected _buttonElement: HTMLButtonElement;
        attachVisualOverride(elementContainer: HTMLElement): void;
        protected measureOverride(constraint: Size): Size;
        protected arrangeOverride(finalSize: Size): Size;
        protected layoutOverride(): void;
        static paddingProperty: DepProperty;
        padding: Thickness;
        static textProperty: DepProperty;
        text: string;
    }
}
