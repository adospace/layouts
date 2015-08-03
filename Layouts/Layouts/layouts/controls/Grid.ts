/// <reference path="..\DepProperty.ts" />
/// <reference path="..\FrameworkElement.ts" /> 
/// <reference path="Panel.ts" />

module layouts.controls {
    export enum GridUnitType {
        /// The value indicates that content should be calculated without constraints. 
        Auto = 0,
        /// The value is expressed as a pixel.
        Pixel,
        /// The value is expressed as a weighted proportion of available space.
        Star,
    }

    export class GridLength {
        constructor(value: number, type: GridUnitType = GridUnitType.Pixel) {
            this._value = value;
            this._type = type;
        }

        static parseString(value: string): { length: GridLength, min?: number, max?: number }[]{
            //parse a string in the form of:
            // ([number],){0.1},[*|Auto|number],([number],){0.1} --> min*,[...],max*
            // a string that define a series of row/col definition in the form of ([min len)*,(gridlen value),(max len])*
            //ex:
            //Auto [100,2*,200] [,Auto,2000]
            //defines 3 row/col definition:
            //1) auto row/column
            //2) 2* row/column with min 100 pixel and max 200 pixel
            //3) Auto row/olumn with max 2000 pixel

            //TODO: use a regex instead

            value = value.trim();
            var tokens = value.split(" ");
            return Enumerable.From(tokens).Select((token) => {
                token = token.trim();
                if (token.length == 0)
                    return;
                if (token[0] == '[') {
                    //Case "[100,*,]" or "[,Auto,200]"
                    if (token.length < 3 || token[token.length - 1] != ']')
                        throw new Error("GridLength definition error");

                    var subTokens = token.substr(1, token.length - 2).split(",");
                    if (subTokens.length == 1)
                        return {
                            length: GridLength.fromString(subTokens[0])
                        };
                    else if (subTokens.length == 3) {
                        var minSubToken = subTokens[0].trim();
                        var min = minSubToken.length == 0 ? 0 : parseFloat(minSubToken);
                        var maxSubToken = subTokens[2].trim();
                        var max = maxSubToken.length == 0 ? +Infinity : parseFloat(maxSubToken);
                        return {
                            length: GridLength.fromString(subTokens[1]),
                            min: min,
                            max: max
                        };
                    }
                    else
                        throw new Error("GridLength definition error");
                }
                else {
                    //case "*" or "Auto" or "12.3"
                    return {
                        length: GridLength.fromString(token)
                    };
                }
            }).ToArray();
        }

        static fromString(value:string): GridLength {
            if (value == "Auto")
                return new GridLength(1, GridUnitType.Auto);
            if (value.substr(value.length - 1, 1) == "*") {
                var starLen = value.length == 1 ? 1 : parseFloat(value.substr(0, value.length - 1));
                return new GridLength(starLen, GridUnitType.Star);
            }
            return new GridLength(parseFloat(value), GridUnitType.Pixel);
        }

        private _value: number;
        get value(): number {
            return this._value;
        }
        private _type: GridUnitType;
        get type(): GridUnitType {
            return this._type;
        }

        get isAuto(): boolean {
            return this._type == GridUnitType.Auto;
        }

        get isFixed(): boolean {
            return this._type == GridUnitType.Pixel;
        }

        get isStar(): boolean {
            return this._type == GridUnitType.Star;
        }
    }

    export class GridRow {
        constructor(public height: GridLength = new GridLength(1, GridUnitType.Star), public minHeight: number = 0, public maxHeight: number = +Infinity) {
        }
    }

    export class GridColumn {
        constructor(public width: GridLength = new GridLength(1, GridUnitType.Star), public minWidth: number = 0, public maxWidth: number = +Infinity) {
        }
    }

    class RowDef {
        constructor(public row: GridRow, vSizeToContent: boolean) {
            this._isAuto = this.row.height.isAuto || (vSizeToContent && this.row.height.isStar);
            this._isStar = this.row.height.isStar && !vSizeToContent;
            this._isFixed = this.row.height.isFixed;
        }
        availHeight: number = Infinity;
        private _desHeight: number = 0;
        get desHeight(): number {
            return this._desHeight;
        }
        set desHeight(newValue: number) {
            this._desHeight = newValue.minMax(this.row.minHeight, this.row.maxHeight)
        }

        _isAuto: boolean;
        get isAuto(): boolean {
            return this._isAuto;
        }

        _isStar: boolean;
        get isStar(): boolean {
            return this._isStar;
        }

        _isFixed: boolean;
        get isFixed(): boolean {
            return this._isFixed;
        }

        elements: ElementDef[] = [];
    }
    class ColumnDef {
        constructor(public column: GridColumn, hSizeToContent: boolean) {
            this._isAuto = this.column.width.isAuto || (hSizeToContent && this.column.width.isStar);
            this._isStar = this.column.width.isStar && !hSizeToContent;
            this._isFixed = this.column.width.isFixed;
        }
        availWidth: number = Infinity;
        private _desWidth: number = 0;
        get desWidth(): number {
            return this._desWidth;
        }
        set desWidth(newValue: number) {
            this._desWidth = newValue.minMax(this.column.minWidth, this.column.maxWidth)
        }

        _isAuto: boolean;
        get isAuto(): boolean {
            return this._isAuto;
        }

        _isStar: boolean;
        get isStar(): boolean {
            return this._isStar;
        }

        _isFixed: boolean;
        get isFixed(): boolean {
            return this._isFixed;
        }
        elements: ElementDef[] = [];
    }
    class ElementDef {
        constructor(
            public element: UIElement,
            public row: number,
            public column: number,
            public rowSpan: number,
            public columnSpan: number) {
        }
        availWidth: number = Infinity;
        availHeight: number = Infinity;
        desWidth: number = NaN;
        desHeight: number = NaN;
        measuredWidthFirstPass: boolean;
        measuredHeightFirstPass: boolean;
        cellTopOffset: number = 0;
        cellLeftOffset: number = 0;
    }

    export class Grid extends Panel implements ISupportCollectionChanged {
        static typeName: string = "layouts.controls.Grid";
        get typeName(): string {
            return Grid.typeName;
        }


        private rowDefs: RowDef[];
        private columnDefs: ColumnDef[];
        private elementDefs: ElementDef[]; 

        protected measureOverride(constraint: Size): Size {
            var desideredSize = new Size();

            var hSizeToContent = !isFinite(constraint.width);
            var vSizeToContent = !isFinite(constraint.height);

            this.rowDefs = new Array<RowDef>(Math.max(this.rows.count, 1));
            this.columnDefs = new Array<ColumnDef>(Math.max(this.columns.count, 1));
            this.elementDefs = new Array<ElementDef>(this.children.count);
            if (this._rows.count > 0)
                this._rows.forEach((row, i) => this.rowDefs[i] = new RowDef(row, vSizeToContent));
            else
                this.rowDefs[0] = new RowDef(new GridRow(new GridLength(1, GridUnitType.Star)), vSizeToContent);
            if (this._columns.count > 0)
                this._columns.forEach((column, i) => this.columnDefs[i] = new ColumnDef(column, hSizeToContent));
            else
                this.columnDefs[0] = new ColumnDef(new GridColumn(new GridLength(1, GridUnitType.Star)), hSizeToContent);

            for (var iElement = 0; iElement < this.children.count; iElement++) {
                var child = this.children.at(iElement);
                var elRow = Grid.getRow(child).minMax(0, this.rowDefs.length);
                var elColumn = Grid.getColumn(child).minMax(0, this.columnDefs.length);
                var elRowSpan = Grid.getRowSpan(child).minMax(1, this.rowDefs.length - elRow);
                var elColumnSpan = Grid.getColumnSpan(child).minMax(1, this.columnDefs.length - elColumn);

                this.elementDefs[iElement] = new ElementDef(child, elRow, elColumn, elRowSpan, elColumnSpan);

                if (elRowSpan == 1)
                    this.rowDefs[elRow].elements.push(this.elementDefs[iElement]);
                if (elColumnSpan == 1)
                    this.columnDefs[elColumn].elements.push(this.elementDefs[iElement]);
            }

            //measure children full contained auto and fixed size in any row/column (exclude only children that are fully contained in star w/h cells)
            for (var iRow = 0; iRow < this.rowDefs.length; iRow++) {
                var rowDef = this.rowDefs[iRow];
                var elements = rowDef.elements;

                if (rowDef.isAuto) {
                    elements.forEach((el) => el.availHeight = Infinity);
                }
                else if (rowDef.isFixed) {
                    rowDef.desHeight = rowDef.row.height.value;
                    elements.forEach((el) => el.availHeight = rowDef.desHeight);
                }
                else { //isStar
                    elements.forEach((el) => el.measuredWidthFirstPass = true);//elements in this group can still be measured by the other dimension (width or height)
                }
            }
            for (var iColumn = 0; iColumn < this.columnDefs.length; iColumn++) {
                var columnDef = this.columnDefs[iColumn];
                var elements = columnDef.elements;

                if (columnDef.isAuto) {
                    elements.forEach((el) => el.availWidth = +Infinity);
                }
                else if (columnDef.isFixed) {
                    columnDef.desWidth = columnDef.column.width.value;
                    elements.forEach((el) => el.availWidth = columnDef.desWidth);
                }
                else { //isStar
                    elements.forEach((el) => el.measuredHeightFirstPass = true);//elements in this group can still be measured by the other dimension (width or height)
                }
            }
            this.elementDefs.forEach((el) => {
                if (!el.measuredHeightFirstPass ||
                    !el.measuredWidthFirstPass) {
                    el.element.measure(new Size(el.availWidth, el.availHeight));
                    if (isNaN(el.desWidth))
                        el.desWidth = el.element.desideredSize.width;
                    if (isNaN(el.desHeight))
                        el.desHeight = el.element.desideredSize.height;
                }
                el.measuredWidthFirstPass = el.measuredHeightFirstPass = true;
            });

            //than get max of any auto/fixed measured row/column
            this.rowDefs.forEach(rowDef => {
                if (!rowDef.isStar)
                    rowDef.elements.forEach((el) => rowDef.desHeight = Math.max(rowDef.desHeight, el.element.desideredSize.height));
            });

            this.columnDefs.forEach(columnDef => {
                if (!columnDef.isStar)
                    columnDef.elements.forEach((el) => columnDef.desWidth = Math.max(columnDef.desWidth, el.element.desideredSize.width));
            });

            //than adjust width and height to fit children that spans over columns or rows containing auto rows or auto columns
            for (var iElement = 0; iElement < this.elementDefs.length; iElement++) {
                var elementDef = this.elementDefs[iElement];
                if (elementDef.rowSpan > 1) {
                    var concatHeight = 0; this.elementDefs.slice(elementDef.row, elementDef.row + elementDef.rowSpan).forEach((el) => concatHeight += el.desHeight);
                    if (concatHeight < elementDef.desHeight) {
                        var diff = elementDef.desHeight - concatHeight;
                        var autoRows = this.rowDefs.filter(r=> r.isAuto);
                        if (autoRows.length > 0) {
                            autoRows.forEach(c=> c.desHeight += diff / autoRows.length);
                        }
                        else {
                            var starRows = this.rowDefs.filter(r=> r.isStar);
                            if (starRows.length > 0) {
                                starRows.forEach(c=> c.desHeight += diff / autoColumns.length);
                            }
                        }
                    }
                    else if (concatHeight > elementDef.desHeight) {
                        elementDef.cellTopOffset = (concatHeight - elementDef.desHeight) / 2;
                    }
                }
                if (elementDef.columnSpan > 1) {
                    var concatWidth = 0; this.elementDefs.slice(elementDef.column, elementDef.column + elementDef.columnSpan).forEach((el) => concatWidth += el.desWidth);
                    if (concatWidth < elementDef.desWidth) {
                        var diff = elementDef.desWidth - concatWidth;
                        var autoColumns = this.columnDefs.filter(c=> c.isAuto);
                        if (autoColumns.length > 0) {
                            autoColumns.forEach(c=> c.desWidth += diff / autoColumns.length);
                        }
                        else {
                            var starColumns = this.columnDefs.filter(c=> c.isStar);
                            if (starColumns.length > 0) {
                                starColumns.forEach(c=> c.desWidth += diff / autoColumns.length);
                            }
                        }                    
                    }
                    else if (concatWidth > elementDef.desWidth) {
                        elementDef.cellLeftOffset = (concatWidth - elementDef.desWidth) / 2;
                    }
                }
            }

            //now measure any full contained star size row/column
            var elementToMeasure: ElementDef[] = [];
            var notStarRowsHeight = 0; this.rowDefs.forEach((r) => notStarRowsHeight += r.desHeight);
            var sumRowStars = 0; this.rowDefs.forEach(r => { if (r.isStar) sumRowStars += r.row.height.value; });
            var vRowMultiplier = (constraint.height - notStarRowsHeight) / sumRowStars;
            this.rowDefs.forEach(rowDef=> {
                if (!rowDef.isStar)
                    return;

                var elements = rowDef.elements;
                //if size to content horizontally, star rows are treat just like auto rows (same apply to columns of course)
                if (!vSizeToContent) {
                    var availHeight = vRowMultiplier * rowDef.row.height.value;
                    rowDef.desHeight = availHeight;
                    elements.forEach((el) => { el.availHeight = availHeight; el.measuredHeightFirstPass = false });
                }

                elementToMeasure.push.apply(elementToMeasure, elements);                
            });

            var notStarColumnsHeight = 0; this.columnDefs.forEach((c) => notStarColumnsHeight += c.desWidth);
            var sumColumnStars = 0; this.columnDefs.forEach(c => { if (c.isStar) sumColumnStars += c.column.width.value; });
            var vColumnMultiplier = (constraint.width - notStarColumnsHeight) / sumColumnStars;
            this.columnDefs.forEach(columnDef => {
                if (!columnDef.isStar)
                    return;

                var elements = columnDef.elements;
                if (!hSizeToContent) {
                    var availWidth = vColumnMultiplier * columnDef.column.width.value;
                    columnDef.desWidth = availWidth;
                    elements.forEach((el) => { el.availWidth = availWidth; el.measuredWidthFirstPass = false });
                }

                elementToMeasure.push.apply(elementToMeasure, elements);
            });
            elementToMeasure.forEach(e => {
                if (!e.measuredHeightFirstPass ||
                    !e.measuredWidthFirstPass) {
                    e.element.measure(new Size(e.availWidth, e.availHeight));
                    e.desWidth = e.element.desideredSize.width;
                    e.desHeight = e.element.desideredSize.height;
                    e.measuredWidthFirstPass = true;
                    e.measuredHeightFirstPass = true;
                }
            });


            //finally sum up the desidered size
            this.rowDefs.forEach(r => desideredSize.height += r.desHeight);
            this.columnDefs.forEach(c => desideredSize.width += c.desWidth);
            return desideredSize;
        }

        protected arrangeOverride(finalSize: Size): Size {

            this.elementDefs.forEach(el => {
                var finalLeft = 0; this.columnDefs.slice(0, el.column).forEach(c => finalLeft += c.desWidth);
                var finalWidth = 0; this.columnDefs.slice(el.column, el.column + el.columnSpan).forEach(c => finalWidth += c.desWidth);
                finalWidth -= (el.cellLeftOffset * 2);

                var finalTop = 0; this.rowDefs.slice(0, el.row).forEach(c => finalTop += c.desHeight);
                var finalHeight = 0; this.rowDefs.slice(el.row, el.row + el.rowSpan).forEach(r => finalHeight += r.desHeight);
                finalHeight += (el.cellTopOffset * 2);

                el.element.arrange(new Rect(finalLeft + el.cellLeftOffset, finalTop + el.cellTopOffset, finalWidth, finalHeight));
            });



            return finalSize;
        }   



        ///Dependency properties

        //rows
        private _rows: ObservableCollection<GridRow>;
        get rows(): ObservableCollection<GridRow> {
            if (this._rows == null) {
                this._rows = new ObservableCollection<GridRow>();
                this._rows.onChangeNotify(this);
            }

            return this._rows;
        }
        fromLmlRows(rows: string) {
            var listOfRows = new Array<GridRow>();
            GridLength.parseString(rows).forEach((rowDef) => {
                listOfRows.push(new GridRow(rowDef.length, rowDef.min, rowDef.max));
            });
            this._rows = new ObservableCollection(listOfRows);
            super.invalidateMeasure();
        }

        //columns
        private _columns: ObservableCollection<GridColumn>;
        get columns(): ObservableCollection<GridColumn> {
            if (this._columns == null) {
                this._columns = new ObservableCollection<GridColumn>();
                this._columns.onChangeNotify(this);
            }

            return this._columns;
        }
        fromLmlColumns(columns: string) {
            var listOfColumns = new Array<GridColumn>();
            GridLength.parseString(columns).forEach((columnDef) => {
                listOfColumns.push(new GridColumn(columnDef.length, columnDef.min, columnDef.max));
            });
            this._columns = new ObservableCollection(listOfColumns);
            super.invalidateMeasure();
        }


        onCollectionChanged(collection: any, added: Object[], removed: Object[], startRemoveIndex: number) {
            super.invalidateMeasure();
        }

        //Grid.Row property
        static rowProperty = DepObject.registerProperty(Grid.typeName, "Grid#Row", 0, FrameworkPropertyMetadataOptions.AffectsMeasure, (v) => parseInt(v));
        static getRow(target: DepObject): number {
            return <number>target.getValue(Grid.rowProperty);
        }
        static setRow(target: DepObject, value: number) {
            target.setValue(Grid.rowProperty, value);
        }

        //Grid.Column property
        static columnProperty = DepObject.registerProperty(Grid.typeName, "Grid#Column", 0, FrameworkPropertyMetadataOptions.AffectsMeasure, (v) => parseInt(v));
        static getColumn(target: DepObject): number {
            return <number>target.getValue(Grid.columnProperty);
        }
        static setColumn(target: DepObject, value: number) {
            target.setValue(Grid.columnProperty, value);
        }

        //Grid.RowSpan property
        static rowSpanProperty = DepObject.registerProperty(Grid.typeName, "Grid#RowSpan", 1, FrameworkPropertyMetadataOptions.AffectsMeasure, (v) => parseInt(v));
        static getRowSpan(target: DepObject): number {
            return <number>target.getValue(Grid.rowSpanProperty);
        }
        static setRowSpan(target: DepObject, value: number) {
            target.setValue(Grid.rowSpanProperty, value);
        }

        //Grid.ColumnSpan property
        static columnSpanProperty = DepObject.registerProperty(Grid.typeName, "Grid#ColumnSpan", 1, FrameworkPropertyMetadataOptions.AffectsMeasure, (v) => parseInt(v));
        static getColumnSpan(target: DepObject): number {
            return <number>target.getValue(Grid.columnSpanProperty);
        }
        static setColumnSpan(target: DepObject, value: number) {
            target.setValue(Grid.columnSpanProperty, value);
        }

    }
}