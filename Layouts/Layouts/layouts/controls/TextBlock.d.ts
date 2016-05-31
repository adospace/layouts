/// <reference path="../DepProperty.d.ts" />
/// <reference path="../DepObject.d.ts" />
/// <reference path="../FrameworkElement.d.ts" />
declare module layouts.controls {
    class TextBlock extends FrameworkElement {
        private _pElement;
        attachVisualOverride(elementContainer: HTMLElement): void;
        protected layoutOverride(): void;
        protected measureOverride(constraint: Size): Size;
        static textProperty: DepProperty;
        text: string;
        static whiteSpaceProperty: DepProperty;
        whiteSpace: string;
    }
}
