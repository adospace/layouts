/// <reference path="../DepProperty.d.ts" />
/// <reference path="../DepObject.d.ts" />
/// <reference path="../FrameworkElement.d.ts" />
declare module layouts.controls {
    class Panel extends FrameworkElement {
        private _children;
        children: ObservableCollection<UIElement>;
        layoutOverride(): void;
        protected _divElement: HTMLDivElement;
        attachVisualOverride(elementContainer: HTMLElement): void;
        static backgroundProperty: DepProperty;
        background: string;
        static isItemsHostProperty: DepProperty;
        isItemsHost: boolean;
    }
}
