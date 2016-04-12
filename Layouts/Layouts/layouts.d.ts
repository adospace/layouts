declare module layouts {
    class Ext {
        static hasProperty(obj: any, propertyName: string): boolean;
        static isString(obj: any): boolean;
    }
}
interface String {
    format(...replacements: string[]): string;
    toUpperFirstLetter(): string;
    toLowerFirstLetter(): string;
    startsWith(other: string): boolean;
}
interface Number {
    isEpsilon(): boolean;
    isCloseTo(other: number): boolean;
    isLessThen(other: number): boolean;
    isGreaterThen(other: number): boolean;
    isCloseTo(other: number): boolean;
    minMax(min: number, max: number): any;
}
declare class InstanceLoader {
    private context;
    constructor(context: Object);
    getInstance(name: string, ...args: any[]): any;
}
declare module layouts {
    class DepProperty {
        name: string;
        typeName: string;
        options: any;
        converter: {
            (value: string): any;
        };
        private _defaultValue;
        constructor(name: string, typeName: string, defaultValue?: any, options?: any, converter?: {
            (value: string): any;
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
    class ConverterContext {
        source: DepObject;
        sourceProperty: DepProperty;
        target: DepObject;
        targetProperty: DepProperty;
        parameter: any;
        constructor(source: DepObject, sourceProperty: DepProperty, target: DepObject, targetProperty: DepProperty, parameter: any);
    }
    interface IConverter {
        convert(fromValue: any, context: ConverterContext): any;
        convertBack(fromValue: any, context: ConverterContext): any;
    }
}
declare module layouts {
    class DepObject {
        private static globalPropertyMap;
        static registerProperty(typeName: string, name: string, defaultValue?: any, options?: any, converter?: {
            (value: string): any;
        }): DepProperty;
        static getProperty(typeName: string, name: string): DepProperty;
        static getProperties(typeName: string): DepProperty[];
        static forAllProperties(obj: DepObject, callback: (depProperty: DepProperty) => void): void;
        static lookupProperty(obj: DepObject, name: string): DepProperty;
        protected localPropertyValueMap: {
            [propertyName: string]: any;
        };
        getValue(property: DepProperty): any;
        setValue(property: DepProperty, value: any): void;
        resetValue(property: DepProperty): void;
        protected onDependencyPropertyChanged(property: DepProperty, value: any, oldValue: any): void;
        private dpcHandlers;
        subscribeDependencyPropertyChanges(observer: ISupportDependencyPropertyChange): void;
        unsubscribeDependencyPropertyChanges(observer: ISupportDependencyPropertyChange): void;
        protected onPropertyChanged(propertyName: string, value: any, oldValue: any): void;
        private pcHandlers;
        subscribePropertyChanges(observer: ISupportPropertyChange): void;
        unsubscribePropertyChanges(observer: ISupportPropertyChange): void;
        private bindings;
        bind(property: DepProperty, propertyPath: string, twoway: boolean, source: DepObject, converter?: IConverter, converterParameter?: any, format?: string): void;
        static logBindingTraceToConsole: boolean;
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
        isEmpty: boolean;
        add(other: Vector): Vector;
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
    class ExtendedProperty {
        name: string;
        value: string;
        constructor(name: string, value: string);
    }
    class UIElement extends DepObject implements ISupportCommandCanExecuteChanged {
        static typeName: string;
        typeName: string;
        desiredSize: Size;
        renderSize: Size;
        private previousAvailableSize;
        measure(availableSize: Size): void;
        protected measureCore(availableSize: Size): Size;
        private finalRect;
        private previousFinalRect;
        arrange(finalRect: Rect): void;
        protected arrangeCore(finalRect: Rect): void;
        protected relativeOffset: Vector;
        layout(relativeOffset?: Vector): void;
        protected layoutOverride(): void;
        protected _visual: HTMLElement;
        attachVisual(elementContainer: HTMLElement, showImmediately?: boolean): void;
        protected attachVisualOverride(elementContainer: HTMLElement): void;
        protected onMouseDown(ev: MouseEvent): void;
        protected onMouseUp(ev: MouseEvent): void;
        getBoundingClientRect(): ClientRect;
        protected visualConnected(elementContainer: HTMLElement): void;
        protected parentVisualConnected(parent: UIElement, elementContainer: HTMLElement): void;
        protected visualDisconnected(elementContainer: HTMLElement): void;
        protected parentVisualDisconnected(parent: UIElement, elementContainer: HTMLElement): void;
        protected onDependencyPropertyChanged(property: DepProperty, value: any, oldValue: any): void;
        onCommandCanExecuteChanged(command: Command): void;
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
        private onParentDependencyPropertyChanged(property);
        protected onParentChanged(oldParent: DepObject, newParent: DepObject): void;
        protected _extendedProperties: ExtendedProperty[];
        addExtentedProperty(name: string, value: string): void;
        static isVisibleProperty: DepProperty;
        isVisible: boolean;
        static classProperty: DepProperty;
        cssClass: string;
        static idProperty: DepProperty;
        id: string;
        static commandProperty: DepProperty;
        command: Command;
        static commandParameterProperty: DepProperty;
        commandParameter: any;
        static popupProperty: DepProperty;
        popup: any;
        static layoutUpdatedProperty: DepProperty;
        layoutUpdated: EventAction;
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
    enum SizeToContent {
        None = 0,
        Both = 1,
        Vertical = 2,
        Horizontal = 3,
    }
    class Thickness {
        left: number;
        top: number;
        right: number;
        bottom: number;
        constructor(left?: number, top?: number, right?: number, bottom?: number);
        static fromString(v: string): Thickness;
        isSameWidth: boolean;
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
        parentDataContext: any;
        protected onDependencyPropertyChanged(property: DepProperty, value: any, oldValue: any): void;
        protected onParentChanged(oldParent: DepObject, newParent: DepObject): void;
        static tagProperty: DepProperty;
        tag: any;
        static overflowXProperty: DepProperty;
        overflowX: any;
        static overflowYProperty: DepProperty;
        overflowY: any;
    }
}
declare module layouts.controls {
    enum PopupPosition {
        Center = 0,
        Left = 1,
        LeftTop = 2,
        LeftBottom = 3,
        Top = 4,
        TopLeft = 5,
        TopRight = 6,
        Right = 7,
        RightTop = 8,
        RightBottom = 9,
        Bottom = 10,
        BottomLeft = 11,
        BottomRight = 12,
    }
    class Popup extends FrameworkElement {
        static typeName: string;
        typeName: string;
        private static _init;
        private static initProperties();
        constructor();
        private tryLoadChildFromServer();
        attachVisualOverride(elementContainer: HTMLElement): void;
        private _child;
        child: UIElement;
        onShow(): void;
        onClose(): void;
        protected initializeComponent(): UIElement;
        protected layoutOverride(): void;
        protected measureOverride(constraint: Size): Size;
        protected arrangeOverride(finalSize: Size): Size;
        static sizeToContentProperty: DepProperty;
        sizeToContent: SizeToContent;
        static positionProperty: DepProperty;
        position: PopupPosition;
    }
}
declare module layouts {
    class LayoutManager {
        static updateLayout(): void;
        private static popups;
        static showPopup(popup: layouts.controls.Popup): void;
        static closePopup(popup?: layouts.controls.Popup): void;
    }
}
declare module layouts.controls {
    class NavigationContext {
        previousPage: Page;
        previousUri: string;
        nextPage: Page;
        nextUri: string;
        queryString: {};
        constructor(previousPage: Page, previousUri: string, nextPage: Page, nextUri: string, queryString: {});
        cancel: boolean;
        returnUri: string;
    }
    class Page extends FrameworkElement {
        static typeName: string;
        typeName: string;
        private tryLoadChildFromServer();
        protected _container: HTMLElement;
        attachVisualOverride(elementContainer: HTMLElement): void;
        protected layoutOverride(): void;
        protected measureOverride(constraint: Size): Size;
        protected arrangeOverride(finalSize: Size): Size;
        static childProperty: DepProperty;
        child: UIElement;
        protected onDependencyPropertyChanged(property: DepProperty, value: any, oldValue: any): void;
        static sizeToContentProperty: DepProperty;
        sizeToContent: SizeToContent;
        cachePage: boolean;
        onNavigate(context: NavigationContext): void;
    }
}
declare module layouts {
    class UriMapping {
        uri: string;
        constructor(uri: string, mapping: string);
        private _mapping;
        mapping: string;
        private static _rxMapping;
        private _compiled;
        private _compiledUri;
        private _queryStringTokens;
        compile(): void;
        test(uri: string): boolean;
        resolve(uriToResolve: string): {};
    }
    class Application {
        constructor();
        private static _current;
        static current: Application;
        private _page;
        page: layouts.controls.Page;
        private static requestAnimationFrame();
        private static onAnimationFrame();
        private static _beginInvokeActions;
        static beginInvoke(action: () => void): void;
        private _mappings;
        mappings: UriMapping[];
        map(uri: string, mappedUri: string): UriMapping;
        private _navigationStack;
        private _currentNavigationitem;
        private _returnUri;
        onBeforeNavigate: (ctx: controls.NavigationContext) => void;
        onAfterNavigate: (ctx: controls.NavigationContext) => void;
        navigate(uri?: string, loader?: InstanceLoader): boolean;
        private hashChanged(hash);
    }
}
declare module layouts {
    interface ISupportDependencyPropertyChange {
        onDependencyPropertyChanged(depObject: DepObject, depProperty: DepProperty): any;
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
        updateVisualProperties(): void;
        protected onDependencyPropertyChanged(property: DepProperty, value: any, oldValue: any): void;
        static borderThicknessProperty: DepProperty;
        borderThickness: Thickness;
        static paddingProperty: DepProperty;
        padding: Thickness;
        static backgroundProperty: DepProperty;
        background: string;
        static borderBrushProperty: DepProperty;
        borderBrush: string;
        static borderStyleProperty: DepProperty;
        borderStyle: string;
    }
}
declare module layouts {
    class Command {
        executeHandler: {
            (command: Command, parameter: any): void;
        };
        canExecuteHandler: {
            (command: Command, parameter: any): boolean;
        };
        constructor(executeHandler?: {
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
    class Button extends FrameworkElement {
        static typeName: string;
        typeName: string;
        private _child;
        child: UIElement;
        protected _buttonElement: HTMLButtonElement;
        attachVisualOverride(elementContainer: HTMLElement): void;
        protected measureOverride(constraint: Size): Size;
        protected arrangeOverride(finalSize: Size): Size;
        protected layoutOverride(): void;
        protected onDependencyPropertyChanged(property: DepProperty, value: any, oldValue: any): void;
        onCommandCanExecuteChanged(command: Command): void;
        static paddingProperty: DepProperty;
        padding: Thickness;
        static textProperty: DepProperty;
        text: string;
        static whiteSpaceProperty: DepProperty;
        whiteSpace: string;
        static isEnabledProperty: DepProperty;
        isEnabled: boolean;
    }
}
declare module layouts.controls {
    class Panel extends FrameworkElement implements ISupportCollectionChanged {
        static typeName: string;
        typeName: string;
        protected _divElement: HTMLDivElement;
        attachVisualOverride(elementContainer: HTMLElement): void;
        private _children;
        children: ObservableCollection<UIElement>;
        onCollectionChanged(collection: any, added: Object[], removed: Object[], startRemoveIndex: number): void;
        layoutOverride(): void;
        virtualItemCount: number;
        virtualOffset: Vector;
        static backgroundProperty: DepProperty;
        background: string;
    }
}
declare module layouts.controls {
    class Canvas extends Panel {
        static typeName: string;
        typeName: string;
        protected measureOverride(constraint: Size): Size;
        protected arrangeOverride(finalSize: Size): Size;
        static leftProperty: DepProperty;
        static getLeft(target: DepObject): number;
        static setLeft(target: DepObject, value: number): void;
        static topProperty: DepProperty;
        static getTop(target: DepObject): number;
        static setTop(target: DepObject, value: number): void;
        static rightProperty: DepProperty;
        static getRight(target: DepObject): number;
        static setRight(target: DepObject, value: number): void;
        static bottomProperty: DepProperty;
        static getBottom(target: DepObject): number;
        static setBottom(target: DepObject, value: number): void;
    }
}
declare module layouts.controls {
    class ContentTemplate extends FrameworkElement {
        static typeName: string;
        typeName: string;
        private _innerXaml;
        setInnerXaml(value: string): void;
        private _xamlLoader;
        setXamlLoader(loader: XamlReader): void;
        protected _container: HTMLElement;
        private _child;
        private setupChild();
        attachVisualOverride(elementContainer: HTMLElement): void;
        protected measureOverride(constraint: Size): Size;
        protected arrangeOverride(finalSize: Size): Size;
        protected layoutOverride(): void;
        static contentProperty: DepProperty;
        content: any;
        protected onDependencyPropertyChanged(property: DepProperty, value: any, oldValue: any): void;
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
        protected onDependencyPropertyChanged(property: DepProperty, value: any, oldValue: any): void;
        static contentProperty: DepProperty;
        content: UIElement;
    }
}
declare module layouts.controls {
    class ControlTemplateSelector extends FrameworkElement {
        static typeName: string;
        typeName: string;
        protected _container: HTMLElement;
        attachVisualOverride(elementContainer: HTMLElement): void;
        private _element;
        private setupItem();
        protected measureOverride(constraint: Size): Size;
        protected arrangeOverride(finalSize: Size): Size;
        protected layoutOverride(): void;
        protected onDependencyPropertyChanged(property: DepProperty, value: any, oldValue: any): void;
        static contentSourceProperty: DepProperty;
        contentSource: any;
        private _templates;
        templates: ObservableCollection<DataTemplate>;
        onCollectionChanged(collection: any, added: Object[], removed: Object[], startRemoveIndex: number): void;
    }
}
declare module layouts.controls {
    class Frame extends FrameworkElement {
        static typeName: string;
        typeName: string;
        _frameElement: HTMLFrameElement;
        attachVisualOverride(elementContainer: HTMLElement): void;
        protected measureOverride(constraint: Size): Size;
        static sourceProperty: DepProperty;
        Source: string;
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
        private _rowDefs;
        private _columnDefs;
        private _elementDefs;
        private _lastDesiredSize;
        protected measureOverride(constraint: Size): Size;
        protected arrangeOverride(finalSize: Size): Size;
        getRowFinalHeight(rowIndex: number): number;
        getColumnFinalWidth(colIndex: number): number;
        static rowsProperty: DepProperty;
        rows: ObservableCollection<GridRow>;
        getRows(): ObservableCollection<GridRow>;
        private static rowsFromString(rows);
        static columnsProperty: DepProperty;
        columns: ObservableCollection<GridColumn>;
        getColumns(): ObservableCollection<GridColumn>;
        private static columnsFromString(columns);
        onCollectionChanged(collection: any, added: Object[], removed: Object[], startRemoveIndex: number): void;
        static rowProperty: DepProperty;
        static getRow(target: DepObject): number;
        static setRow(target: DepObject, value: number): void;
        static columnProperty: DepProperty;
        static getColumn(target: DepObject): number;
        static setColumn(target: DepObject, value: number): void;
        private static fromString(value);
        static rowSpanProperty: DepProperty;
        static getRowSpan(target: DepObject): number;
        static setRowSpan(target: DepObject, value: number): void;
        static columnSpanProperty: DepProperty;
        static getColumnSpan(target: DepObject): number;
        static setColumnSpan(target: DepObject, value: number): void;
        private static spanFromString(value);
    }
}
declare module layouts.controls {
    class GridSplitter extends Border {
        static typeName: string;
        typeName: string;
        constructor();
        attachVisualOverride(elementContainer: HTMLElement): void;
        private onSplitterMouseDown(ev);
        private updateCursor();
        private _draggingCurrentPoint;
        private _draggingStartPoint;
        private _draggingVirtualOffset;
        private _draggingVirtualOffsetMin;
        private _draggingVirtualOffsetMax;
        private initializeDrag(ev);
        private _dragSplitterTimeoutHandle;
        private onSplitterMouseMove;
        private moveGhost(ev);
        private onSplitterMouseUp;
        private dragSplitter(evX, evY);
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
        protected onDependencyPropertyChanged(property: DepProperty, value: any, oldValue: any): void;
        static srcProperty: DepProperty;
        source: string;
        static stretchProperty: DepProperty;
        stretch: Stretch;
        static stretchDirectionProperty: DepProperty;
        stretchDirection: StretchDirection;
    }
}
declare module layouts.controls {
    class MediaTemplateSelector extends FrameworkElement {
        static typeName: string;
        typeName: string;
        protected _container: HTMLElement;
        attachVisualOverride(elementContainer: HTMLElement): void;
        private _element;
        private setupItem();
        protected measureOverride(constraint: Size): Size;
        protected arrangeOverride(finalSize: Size): Size;
        protected layoutOverride(): void;
        private _templates;
        templates: ObservableCollection<DataTemplate>;
    }
}
declare module layouts.controls {
    class div extends FrameworkElement {
        static typeName: string;
        typeName: string;
        attachVisualOverride(elementContainer: HTMLElement): void;
        private _innerXaml;
        setInnerXaml(value: string): void;
        private _measuredSize;
        protected measureOverride(constraint: Size): Size;
        protected arrangeOverride(finalSize: Size): Size;
    }
}
declare module layouts.controls {
    class ItemsControl extends FrameworkElement implements ISupportCollectionChanged {
        static typeName: string;
        typeName: string;
        private static _init;
        private static initProperties();
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
        itemsSource: any;
        static itemsPanelProperty: DepProperty;
        itemsPanel: Panel;
        protected onDependencyPropertyChanged(property: DepProperty, value: any, oldValue: any): void;
        private setupItems();
    }
}
declare module layouts.controls {
    class ComboBox extends FrameworkElement implements ISupportCollectionChanged {
        static typeName: string;
        typeName: string;
        private _selectElement;
        private _elements;
        attachVisualOverride(elementContainer: HTMLElement): void;
        onSelectionChanged(): void;
        protected arrangeOverride(finalSize: Size): Size;
        private selectItem(item);
        protected onDependencyPropertyChanged(property: DepProperty, value: any, oldValue: any): void;
        private setupItems();
        onCollectionChanged(collection: any, added: Object[], removed: Object[], startRemoveIndex: number): void;
        static itemsSourceProperty: DepProperty;
        itemsSource: any;
        static selectedItemProperty: DepProperty;
        selectedItem: any;
        static displayMemberProperty: DepProperty;
        displayMember: string;
        static selectedValueProperty: DepProperty;
        selectedValue: any;
        static selectMemberProperty: DepProperty;
        selectMember: string;
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
        private _measuredSize;
        protected measureOverride(constraint: Size): Size;
        protected arrangeOverride(finalSize: Size): Size;
        protected onDependencyPropertyChanged(property: DepProperty, value: any, oldValue: any): void;
        static textProperty: DepProperty;
        text: string;
        static whiteSpaceProperty: DepProperty;
        whiteSpace: string;
        static formatProperty: DepProperty;
        format: string;
    }
}
declare module layouts.controls {
    class TextBox extends FrameworkElement {
        static typeName: string;
        typeName: string;
        private _pElement;
        attachVisualOverride(elementContainer: HTMLElement): void;
        onTextChanged(): void;
        private _measuredSize;
        protected measureOverride(constraint: Size): Size;
        protected layoutOverride(): void;
        protected onDependencyPropertyChanged(property: DepProperty, value: any, oldValue: any): void;
        static textProperty: DepProperty;
        text: string;
        static placeholderProperty: DepProperty;
        placeholder: string;
        static typeProperty: DepProperty;
        type: string;
        static isReadonlyProperty: DepProperty;
        isReadonly: boolean;
    }
}
declare module layouts.controls {
    class DataTemplate extends DepObject {
        static typeName: string;
        typeName: string;
        private _innerXaml;
        setInnerXaml(value: string): void;
        private _xamlLoader;
        setXamlLoader(loader: XamlReader): void;
        createElement(): UIElement;
        static getTemplateForItem(templates: DataTemplate[], item: any): DataTemplate;
        static getTemplateForMedia(templates: DataTemplate[]): DataTemplate;
        static targetTypeProperty: DepProperty;
        targetType: string;
        static targetMemberProperty: DepProperty;
        targetMember: string;
        static mediaProperty: DepProperty;
        media: string;
    }
}
declare module layouts.controls {
    class UserControl extends FrameworkElement {
        static typeName: string;
        typeName: string;
        private _content;
        protected initializeComponent(): UIElement;
        private tryLoadChildFromServer();
        protected _container: HTMLElement;
        attachVisualOverride(elementContainer: HTMLElement): void;
        private setupChild(content);
        protected measureOverride(constraint: Size): Size;
        protected arrangeOverride(finalSize: Size): Size;
        protected layoutOverride(): void;
    }
}
declare module layouts {
    class EventAction {
        invokeHandler: {
            (event: EventAction, parameter: any): void;
        };
        constructor(invokeHandler?: {
            (event: EventAction, parameter: any): void;
        });
        invoke(parameter: any): void;
    }
}
declare module layouts {
    interface IComparer {
        compare(x: any, y: any): number;
    }
}
declare module layouts {
}
declare module layouts {
    class ObservableCollection<T> {
        constructor(elements?: Array<T>);
        elements: T[];
        toArray(): T[];
        add(element: T): T;
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
    class XamlReader {
        instanceLoader: InstanceLoader;
        namespaceResolver: {
            (xmlNs: string): string;
        };
        private static DefaultNamespace;
        constructor(instanceLoader?: InstanceLoader, namespaceResolver?: {
            (xmlNs: string): string;
        });
        private _createdObjectsWithId;
        Parse(lml: string): any;
        resolveNameSpace(xmlns: string): string;
        Load(xamlNode: Node): any;
        static compareXml(nodeLeft: Node, nodeRight: Node): boolean;
        private trySetProperty(obj, propertyName, propertyNameSpace, value);
        private static tryCallMethod(obj, methodName, value);
        private static tryParseBinding(value);
    }
}
declare module layouts {
    class Timer {
        handler: (timer: Timer) => void;
        millisecond: number;
        constructor(handler: (timer: Timer) => void, millisecond: number);
        private timerId;
        start(): void;
        stop(): void;
    }
}
