declare module layouts {
    class Ext {
        static hasProperty(obj: any, propertyName: string): boolean;
    }
}
interface String {
    format(...replacements: string[]): string;
    toUpperFirstLetter(): string;
    toLowerFirstLetter(): string;
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
        private _defaultValue;
        options: any;
        converter: {
            (value: any): any;
        };
        constructor(name: string, defaultValue?: any, options?: any, converter?: {
            (value: any): any;
        });
        private _defaultValueMap;
        overrideDefaultValue(typeName: string, defaultValue: any): void;
        getDefaultValue(depObject: DepObject): any;
    }
}
declare module layouts {
    class PropertyMap {
        constructor();
        private propertyMap;
        getProperty(name: string): DepProperty;
        all(): DepProperty[];
        register(name: string, property: DepProperty): void;
    }
}
declare module layouts {
    class Consts {
        static stringEmpty: string;
    }
}
declare module layouts {
    class DepObject {
        private static globalPropertyMap;
        static registerProperty(typeName: string, name: string, defaultValue?: any, options?: any, converter?: {
            (value: any): any;
        }): DepProperty;
        static getProperty(typeName: string, name: string): DepProperty;
        static getProperties(typeName: string): DepProperty[];
        static lookupProperty(obj: DepObject, name: string): DepProperty;
        protected localPropertyValueMap: {
            [propertyName: string]: any;
        };
        getValue(property: DepProperty): any;
        setValue(property: DepProperty, value: any): void;
        protected onDependencyPropertyChanged(property: DepProperty, value: any, oldValue: any): void;
        private dpcHandlers;
        subscribeDependencyPropertyChanges(observer: ISupportDependencyPropertyChange): void;
        unsubscribeDependencyPropertyChanges(observer: ISupportDependencyPropertyChange): void;
        protected onPropertyChanged(propertyName: string, value: any, oldValue: any): void;
        private pcHandlers;
        subscribePropertyChanges(observer: ISupportPropertyChange): void;
        unsubscribePropertyChanges(observer: ISupportPropertyChange): void;
        private bindings;
        bind(property: DepProperty, propertyPath: string, twoway: boolean, source: DepObject): void;
        clone(): DepObject;
        protected createClone(elementToClone: DepObject): DepObject;
        protected cloneOverride(elementCloned: DepObject): void;
    }
}
declare module layouts {
    class Size {
        width: number;
        height: number;
        constructor(width?: number, height?: number);
        toRect(): Rect;
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
        static typeName: string;
        typeName: string;
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
        protected visualConnected(elementContainer: HTMLElement): void;
        protected visualDisconnected(elementContainer: HTMLElement): void;
        protected onDependencyPropertyChanged(property: DepProperty, value: any, oldValue: any): void;
        getValue(property: DepProperty): any;
        private measureDirty;
        invalidateMeasure(): void;
        private arrangeDirty;
        invalidateArrange(): void;
        private layoutInvalid;
        invalidateLayout(): void;
        private _logicalChildren;
        findElementByName(name: string): UIElement;
        private _parent;
        parent: UIElement;
        private notifyInheritsPropertiesChange();
        protected onParentChanged(oldParent: DepObject, newParent: DepObject): void;
        static isVisibleProperty: DepProperty;
        isVisible: boolean;
        static styleProperty: DepProperty;
        cssStyle: string;
        static classProperty: DepProperty;
        cssClass: string;
        static nameProperty: DepProperty;
        name: string;
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
        static fromString(v: string): Thickness;
    }
    class FrameworkElement extends UIElement {
        static typeName: string;
        typeName: string;
        private unclippedDesiredSize;
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
        static tagProperty: DepProperty;
        tag: any;
        static overflowXProperty: DepProperty;
        overflowX: any;
        static overflowYProperty: DepProperty;
        overflowY: any;
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
        static typeName: string;
        typeName: string;
        private _child;
        child: UIElement;
        protected layoutOverride(): void;
        protected measureOverride(constraint: Size): Size;
        protected arrangeOverride(finalSize: Size): Size;
        static sizeToContentProperty: DepProperty;
        sizeToContent: SizeToContent;
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
    interface ISupportDependencyPropertyChange {
        onChangeDependencyProperty(depObject: DepObject, depProperty: DepProperty, value: any): any;
    }
    interface ISupportPropertyChange {
        onChangeProperty(source: any, propertyName: string, value: any): any;
    }
    interface INotifyPropertyChanged {
        registerObserver(observer: ISupportPropertyChange): any;
        unregisterObserver(observer: ISupportPropertyChange): any;
    }
    interface ISupportCollectionChanged {
        onCollectionChanged(collection: any, added: any[], removed: any[], startRemoveIndex: number): any;
    }
    interface ISupportCommandCanExecuteChanged {
        onCommandCanExecuteChanged(command: Command): any;
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
        static typeName: string;
        typeName: string;
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
declare module layouts {
    class Command {
        private executeHandler;
        private canExecuteHandler;
        constructor(executeHandler: {
            (command: Command, parameter: any): void;
        }, canExecuteHandler?: {
            (command: Command, parameter: any): boolean;
        });
        canExecute(parameter: any): boolean;
        execute(parameter: any): void;
        private handlers;
        onCanExecuteChangeNotify(handler: ISupportCommandCanExecuteChanged): void;
        offCanExecuteChangeNotify(handler: ISupportCommandCanExecuteChanged): void;
        canExecuteChanged(): void;
    }
}
declare module layouts.controls {
    class Button extends FrameworkElement implements ISupportCommandCanExecuteChanged {
        static typeName: string;
        typeName: string;
        private _child;
        child: UIElement;
        protected _buttonElement: HTMLButtonElement;
        attachVisualOverride(elementContainer: HTMLElement): void;
        private onCLick();
        protected measureOverride(constraint: Size): Size;
        protected arrangeOverride(finalSize: Size): Size;
        protected layoutOverride(): void;
        protected onDependencyPropertyChanged(property: DepProperty, value: any, oldValue: any): void;
        onCommandCanExecuteChanged(command: Command): void;
        static paddingProperty: DepProperty;
        padding: Thickness;
        static textProperty: DepProperty;
        text: string;
        static commandProperty: DepProperty;
        command: Command;
        static commandParameterProperty: DepProperty;
        commandParameter: any;
    }
}
declare module layouts.controls {
    class ControlTemplate extends FrameworkElement {
        static typeName: string;
        typeName: string;
        protected _container: HTMLElement;
        attachVisualOverride(elementContainer: HTMLElement): void;
        protected measureOverride(constraint: Size): Size;
        protected arrangeOverride(finalSize: Size): Size;
        protected layoutOverride(): void;
        static contentProperty: DepProperty;
        content: UIElement;
        protected onDependencyPropertyChanged(property: DepProperty, value: any, oldValue: any): void;
    }
}
declare module layouts.controls {
    class Panel extends FrameworkElement implements ISupportCollectionChanged {
        static typeName: string;
        typeName: string;
        private _children;
        children: ObservableCollection<UIElement>;
        onCollectionChanged(collection: any, added: Object[], removed: Object[], startRemoveIndex: number): void;
        layoutOverride(): void;
        virtualItemCount: number;
        virtualOffset: Vector;
        protected _divElement: HTMLDivElement;
        attachVisualOverride(elementContainer: HTMLElement): void;
        static backgroundProperty: DepProperty;
        background: string;
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
        static parseString(value: string): {
            length: GridLength;
            min?: number;
            max?: number;
        }[];
        static fromString(value: string): GridLength;
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
    class Grid extends Panel implements ISupportCollectionChanged {
        static typeName: string;
        typeName: string;
        private rowDefs;
        private columnDefs;
        private elementDefs;
        protected measureOverride(constraint: Size): Size;
        protected arrangeOverride(finalSize: Size): Size;
        private _rows;
        rows: ObservableCollection<GridRow>;
        fromLmlRows(rows: string): void;
        private _columns;
        columns: ObservableCollection<GridColumn>;
        fromLmlColumns(columns: string): void;
        onCollectionChanged(collection: any, added: Object[], removed: Object[], startRemoveIndex: number): void;
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
        static typeName: string;
        typeName: string;
        private _imgElement;
        attachVisualOverride(elementContainer: HTMLElement): void;
        protected measureOverride(constraint: Size): Size;
        protected arrangeOverride(finalSize: Size): Size;
        static computeScaleFactor(availableSize: Size, contentSize: Size, stretch: Stretch, stretchDirection: StretchDirection): Size;
        static srcProperty: DepProperty;
        source: string;
        static stretchProperty: DepProperty;
        stretch: Stretch;
        static stretchDirectionProperty: DepProperty;
        stretchDirection: StretchDirection;
    }
}
declare module layouts.controls {
    class i extends FrameworkElement {
        static typeName: string;
        typeName: string;
        private _pElement;
        attachVisualOverride(elementContainer: HTMLElement): void;
        protected layoutOverride(): void;
        protected measureOverride(constraint: Size): Size;
        static textProperty: DepProperty;
        text: string;
    }
}
declare module layouts.controls {
    class ItemsControl extends FrameworkElement implements ISupportCollectionChanged {
        static typeName: string;
        typeName: string;
        protected _elements: Array<UIElement>;
        protected _divElement: HTMLDivElement;
        attachVisualOverride(elementContainer: HTMLElement): void;
        protected measureOverride(constraint: Size): Size;
        protected arrangeOverride(finalSize: Size): Size;
        protected layoutOverride(): void;
        private _templates;
        templates: ObservableCollection<DataTemplate>;
        onCollectionChanged(collection: any, added: Object[], removed: Object[], startRemoveIndex: number): void;
        static itemsSourceProperty: DepProperty;
        itemsSource: ObservableCollection<Object>;
        static itemsPanelProperty: DepProperty;
        itemsPanel: Panel;
        protected onDependencyPropertyChanged(property: DepProperty, value: any, oldValue: any): void;
        private getTemplateForItem(item);
        private setupItems();
    }
}
declare module layouts.controls {
    enum Orientation {
        Horizontal = 0,
        Vertical = 1,
    }
    class Stack extends Panel {
        static typeName: string;
        typeName: string;
        private static _init;
        private static initProperties();
        protected measureOverride(constraint: Size): Size;
        protected arrangeOverride(finalSize: Size): Size;
        static orientationProperty: DepProperty;
        orientation: Orientation;
    }
}
declare module layouts.controls {
    class TextBlock extends FrameworkElement {
        static typeName: string;
        typeName: string;
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
declare module layouts.controls {
    class TextBox extends FrameworkElement {
        static typeName: string;
        typeName: string;
        private _pElement;
        attachVisualOverride(elementContainer: HTMLElement): void;
        onTextChanged(): void;
        clientSize: Size;
        protected measureOverride(constraint: Size): Size;
        protected layoutOverride(): void;
        static textProperty: DepProperty;
        text: string;
    }
}
declare module layouts.controls {
    class DataTemplate extends DepObject {
        static typeName: string;
        typeName: string;
        targetType: string;
        private _child;
        child: UIElement;
    }
}
declare module layouts {
}
declare module layouts {
    class ObservableCollection<T> {
        constructor(elements?: Array<T>);
        elements: T[];
        toArray(): T[];
        add(element: T): void;
        remove(element: T): void;
        at(index: number): T;
        first(): T;
        last(): T;
        count: number;
        forEach(action: (value: T, index: number, array: T[]) => void): void;
        private pcHandlers;
        onChangeNotify(handler: ISupportCollectionChanged): void;
        offChangeNotify(handler: ISupportCollectionChanged): void;
    }
}
declare module layouts {
    class LmlReader {
        instanceLoader: InstanceLoader;
        namespaceResolver: {
            (xmlNs: string): string;
        };
        private static DefaultNamespace;
        constructor(instanceLoader?: InstanceLoader, namespaceResolver?: {
            (xmlNs: string): string;
        });
        Parse(lml: string): any;
        resolveNameSpace(xmlns: string): string;
        Load(lmlNode: Node): any;
        private static TrySetProperty(obj, propertyName, propertyNameSpace, value);
        private static TryCallMethod(obj, methodName, value);
        private static tryParseBinding(value);
    }
}
