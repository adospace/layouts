/// <reference path="DepProperty.d.ts" />
/// <reference path="DepObject.d.ts" />
/// <reference path="UIElement.d.ts" />
declare module layouts {
    enum VerticalAlignment {
        Top = 0,
        Center = 1,
        Bottom = 2,
        Stretch = 3,
    }
    enum HorizontalAlignment {
        Left = 0,
        Center = 1,
        Right = 2,
        Stretch = 3,
    }
    class Thickness {
        left: number;
        top: number;
        right: number;
        bottom: number;
        constructor(left?: number, top?: number, right?: number, bottom?: number);
    }
    class FrameworkElement extends UIElement {
        private unclippedDesiredSize;
        private needClipBounds;
        protected visualOffset: Vector;
        protected measureCore(availableSize: Size): Size;
        protected measureOverride(availableSize: Size): Size;
        protected arrangeCore(finalRect: Rect): void;
        private computeAlignmentOffset(clientSize, inkSize);
        protected arrangeOverride(finalSize: Size): Size;
        protected layoutOverride(): void;
        protected attachVisualOverride(elementContainer: HTMLElement): void;
        static widthProperty: DepProperty;
        width: number;
        static heightProperty: DepProperty;
        height: number;
        static actualWidthProperty: DepProperty;
        actualWidth: number;
        private setActualWidth(value);
        static actualHeightProperty: DepProperty;
        actualHeight: number;
        private setActualHeight(value);
        static minWidthProperty: DepProperty;
        minWidth: number;
        static minHeightProperty: DepProperty;
        minHeight: number;
        static maxWidthProperty: DepProperty;
        maxWidth: number;
        static maxHeightProperty: DepProperty;
        maxHeight: number;
        static verticalAlignmentProperty: DepProperty;
        verticalAlignment: VerticalAlignment;
        static horizontalAlignmentProperty: DepProperty;
        horizontalAlignment: HorizontalAlignment;
        static marginProperty: DepProperty;
        margin: Thickness;
        static dataContextProperty: DepProperty;
        dataContext: any;
        static nameProperty: DepProperty;
        name: string;
        static tagProperty: DepProperty;
        tag: any;
    }
}
