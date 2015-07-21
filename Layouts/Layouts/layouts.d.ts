interface String {
    format(...replacements: string[]): string;
}
interface Object {
    getTypeName(): string;
}
interface Number {
    isEpsilon(): boolean;
    isCloseTo(other: number): boolean;
    minMax(min: number, max: number): any;
}
declare class InstanceLoader {
    private context;
    constructor(context: Object);
    getInstance(name: string, ...args: any[]): any;
}
declare module layouts {
    class LayoutManager {
        static requestLayoutUpdate(): void;
        static updateLayout(): void;
    }
}
declare module layouts {
    class DepProperty {
        name: string;
        defaultValue: any;
        options: any;
        constructor(name: string, defaultValue?: any, options?: any);
    }
}
declare module layouts {
    class PropertyMap {
        constructor();
        private propertyMap;
        getProperty(name: string): DepProperty;
        register(name: string, property: DepProperty): void;
    }
}
declare module layouts {
    class DepObject {
        private static globalPropertyMap;
        registerProperty(name: string, defaultValue?: any, options?: any): DepProperty;
        private internalTypeName;
        typeName: string;
        static getProperty(typeName: string, name: string): DepProperty;
        protected localPropertyValueMap: {
            [propertyName: string]: any;
        };
        getValue(property: DepProperty): any;
        setValue(property: DepProperty, value: any): void;
        protected onPropertyChanged(property: DepProperty, value: any): void;
        private pcHandlers;
        subscribePropertyChanges(handler: {
            (depObject: DepObject, depProperty: DepProperty, value: any): void;
        }): void;
        unsubscribePropertyChanges(handler: {
            (depObject: DepObject, depProperty: DepProperty, value: any): void;
        }): void;
        private bindings;
        private pathBindings;
        bind(property: DepProperty, propertyPath: string, source: DepObject): Binding;
    }
}
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
declare module layouts {
    class Application {
        constructor();
        private static _current;
        static current: Application;
        private _page;
        page: layouts.controls.Page;
    }
}
declare module layouts {
    class Binding {
        target: DepObject;
        targetProperty: DepProperty;
        path: PropertyPath;
        twoWay: boolean;
        private source;
        private sourceProperty;
        constructor(target: DepObject, targetProperty: DepProperty, path: PropertyPath, twoWay?: boolean);
        private onPathChanged(path);
        private updateTarget();
        private onSourcePropertyChanged(depObject, property, value);
    }
}
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
declare module layouts.controls {
    enum GridUnitType {
        Auto = 0,
        Pixel = 1,
        Star = 2,
    }
    class GridLength {
        constructor(value: number, type?: GridUnitType);
        private _value;
        value: number;
        private _type;
        type: GridUnitType;
        isAuto: boolean;
        isFixed: boolean;
        isStar: boolean;
    }
    class GridRow {
        height: GridLength;
        minHeight: number;
        maxHeight: number;
        constructor(height?: GridLength, minHeight?: number, maxHeight?: number);
    }
    class GridColumn {
        width: GridLength;
        minWidth: number;
        maxWidth: number;
        constructor(width?: GridLength, minWidth?: number, maxWidth?: number);
    }
    class Grid extends Panel {
        private rowDefs;
        private columnDefs;
        private elementDefs;
        protected measureOverride(constraint: Size): Size;
        protected arrangeOverride(finalSize: Size): Size;
        private _rows;
        rows: ObservableCollection<GridRow>;
        onRowsChanged(collection: ObservableCollection<GridRow>, added: GridRow[], removed: GridRow[]): void;
        private _columns;
        columns: ObservableCollection<GridColumn>;
        onColumnsChanged(collection: ObservableCollection<GridColumn>, added: GridColumn[], removed: GridColumn[]): void;
        static rowProperty: DepProperty;
        static getRow(target: DepObject): number;
        static setRow(target: DepObject, value: number): void;
        static columnProperty: DepProperty;
        static getColumn(target: DepObject): number;
        static setColumn(target: DepObject, value: number): void;
        static rowSpanProperty: DepProperty;
        static getRowSpan(target: DepObject): number;
        static setRowSpan(target: DepObject, value: number): void;
        static columnSpanProperty: DepProperty;
        static getColumnSpan(target: DepObject): number;
        static setColumnSpan(target: DepObject, value: number): void;
    }
}
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
declare module layouts.controls {
    class ItemsControl extends FrameworkElement {
        private _items;
        items: ObservableCollection<Object>;
        private _itemsSource;
        itemsSource: INotifyCollectionChanged<Object>;
    }
}
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
declare module layouts {
    interface INotifyCollectionChanged<T> {
        on(handler: {
            (collection: INotifyCollectionChanged<T>, added: T[], removed: T[]): void;
        }): any;
        off(handler: {
            (collection: INotifyCollectionChanged<T>, added: T[], removed: T[]): void;
        }): any;
    }
}
declare module layouts {
    class ObservableCollection<T> implements INotifyCollectionChanged<T> {
        private elements;
        add(element: T): void;
        remove(element: T): void;
        at(index: number): T;
        count: number;
        forEach(action: (value: T, index: number, array: T[]) => void): void;
        private pcHandlers;
        on(handler: {
            (collection: ObservableCollection<T>, added: T[], removed: T[]): void;
        }): void;
        off(handler: {
            (collection: ObservableCollection<T>, added: T[], removed: T[]): void;
        }): void;
    }
}
declare module layouts {
    class LmlReader {
        private static DefaultNamespace;
        static Parse(lml: string): any;
        static Load(lmlNode: Node, loader: InstanceLoader): any;
        private static TrySetProperty(obj, propertyName, value);
        private static FindObjectWithProperty(obj, propertyNames);
    }
}
declare module layouts {
    class PropertyPath {
        path: string;
        name: string;
        source: DepObject;
        private next;
        private prev;
        sourceProperty: DepProperty;
        constructor(path: string, source: DepObject);
        private attachShource();
        private detachSource();
        private build();
        private onPathChanged();
        private pcHandlers;
        subscribePathChanges(handler: {
            (path: PropertyPath): void;
        }): void;
        unsubscribePathChanges(handler: {
            (path: PropertyPath): void;
        }): void;
        getValue(): any;
        setValue(value: any): void;
        private onPropertyChanged(depObject, property, value);
    }
}
