/// <reference path="DepProperty.d.ts" />
/// <reference path="DepObject.d.ts" />
declare module layouts {
    class Size {
        width: number;
        height: number;
        constructor(width?: number, height?: number);
    }
    class Rect {
        x: number;
        y: number;
        width: number;
        height: number;
        constructor(x?: number, y?: number, width?: number, height?: number);
        size: Size;
    }
    class Vector {
        x: number;
        y: number;
        constructor(x?: number, y?: number);
    }
    enum FrameworkPropertyMetadataOptions {
        None = 0,
        AffectsMeasure = 1,
        AffectsArrange = 2,
        AffectsParentMeasure = 4,
        AffectsParentArrange = 8,
        AffectsRender = 16,
        Inherits = 32,
        OverridesInheritanceBehavior = 64,
        NotDataBindable = 128,
        BindsTwoWayByDefault = 256,
    }
    class UIElement extends DepObject {
        desideredSize: Size;
        renderSize: Size;
        private previousAvailableSize;
        measure(availableSize: Size): void;
        protected measureCore(availableSize: Size): Size;
        private finalRect;
        private previousFinalRect;
        arrange(finalRect: Rect): void;
        protected arrangeCore(finalRect: Rect): void;
        layout(): void;
        protected layoutOverride(): void;
        protected _visual: HTMLElement;
        attachVisual(elementContainer: HTMLElement): void;
        protected attachVisualOverride(elementContainer: HTMLElement): void;
        protected onPropertyChanged(property: DepProperty, value: any): void;
        getValue(property: DepProperty): any;
        private measureDirty;
        invalidateMeasure(): void;
        private arrangeDirty;
        invalidateArrange(): void;
        private layoutInvalid;
        invalidateLayout(): void;
        private _parent;
        parent: UIElement;
        protected onParentChanged(oldParent: DepObject, newParent: DepObject): void;
        static isVisibleProperty: DepProperty;
        isVisible: boolean;
        static styleProperty: DepProperty;
        cssStyle: string;
        static classProperty: DepProperty;
        cssClass: string;
    }
}
