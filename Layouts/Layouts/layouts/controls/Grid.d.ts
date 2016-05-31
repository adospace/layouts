/// <reference path="../DepProperty.d.ts" />
/// <reference path="../FrameworkElement.d.ts" />
/// <reference path="Panel.d.ts" />
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
