/// <reference path="../DepProperty.d.ts" />
/// <reference path="../DepObject.d.ts" />
/// <reference path="../FrameworkElement.d.ts" />
declare module layouts.controls {
    enum Stretch {
        None = 0,
        Fill = 1,
        Uniform = 2,
        UniformToFill = 3,
    }
    enum StretchDirection {
        UpOnly = 0,
        DownOnly = 1,
        Both = 2,
    }
    class Image extends FrameworkElement {
        private _imgElement;
        attachVisualOverride(elementContainer: HTMLElement): void;
        protected measureOverride(constraint: Size): Size;
        protected arrangeOverride(finalSize: Size): Size;
        static computeScaleFactor(availableSize: Size, contentSize: Size, stretch: Stretch, stretchDirection: StretchDirection): Size;
        static srcProperty: DepProperty;
        src: string;
        static stretchProperty: DepProperty;
        stretch: Stretch;
        static stretchDirectionProperty: DepProperty;
        stretchDirection: StretchDirection;
    }
}
