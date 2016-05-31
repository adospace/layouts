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
            if (value.isCloseTo(0))
                value = 0;
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
        constructor(public row: GridRow, public index: number, vSizeToContent: boolean) {
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

        private _finalHeight: number = 0;
        get finalHeight(): number {
            return this._finalHeight;
        }
        set finalHeight(newValue: number) {
            this._finalHeight = newValue.minMax(this.row.minHeight, this.row.maxHeight)
        }

        private _isAuto: boolean;
        get isAuto(): boolean {
            return this._isAuto;
        }

        private _isStar: boolean;
        get isStar(): boolean {
            return this._isStar;
        }

        private _isFixed: boolean;
        get isFixed(): boolean {
            return this._isFixed;
        }

        elements: ElementDef[] = [];
    }
    class ColumnDef {
        constructor(public column: GridColumn, public index: number, hSizeToContent: boolean) {
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

        private _finalWidth: number = 0;
        get finalWidth(): number {
            return this._finalWidth;
        }
        set finalWidth(newValue: number) {
            this._finalWidth = newValue.minMax(this.column.minWidth, this.column.maxWidth)
        }

        private _isAuto: boolean;
        get isAuto(): boolean {
            return this._isAuto;
        }

        private _isStar: boolean;
        get isStar(): boolean {
            return this._isStar;
        }

        private _isFixed: boolean;
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

            this._availWidth = new Array<number>(columnSpan);
            for (var i = 0; i < this._availWidth.length; i++)
                this._availWidth[i] = Infinity;

            this._availHeight = new Array<number>(rowSpan);
            for (var i = 0; i < this._availHeight.length; i++)
                this._availHeight[i] = Infinity;
        }

        private _availWidth: Array<number>;
        getAvailWidth(column: number): number {
            return this._availWidth[column - this.column];
        }
        getAllAvailWidth(): number {
            let sum = 0;
            for (var i = 0; i < this._availWidth.length; i++) {
                if (!isFinite(this._availWidth[i]))
                    return Infinity;
                sum += this._availWidth[i];
            }
            return sum;
        }
        setAvailWidth(column: number, value: number) {
            this._availWidth[column - this.column] = value;
        }

        private _availHeight: Array<number>;
        getAvailHeight(row: number): number {
            return this._availHeight[row - this.row];
        }
        getAllAvailHeight(): number {
            let sum = 0;
            for (var i = 0; i < this._availHeight.length; i++) {
                if (!isFinite(this._availHeight[i]))
                    return Infinity;
                sum += this._availHeight[i];
            }
            return sum;
        }
        setAvailHeight(row: number, value: number) {
            this._availHeight[row - this.row] = value;
        }


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

        private _rowDefs: RowDef[];
        private _columnDefs: ColumnDef[];
        private _elementDefs: ElementDef[]; 
        private _lastDesiredSize: Size;


        protected measureOverride(constraint: Size): Size {
            var desideredSize = new Size();

            var hSizeToContent = !isFinite(constraint.width);
            var vSizeToContent = !isFinite(constraint.height);
            var childrenCount = this.children == null ? 0 : this.children.count;
            var rows = this.getRows();
            var columns = this.getColumns();

            this._rowDefs = new Array<RowDef>(Math.max(rows.count, 1));
            this._columnDefs = new Array<ColumnDef>(Math.max(this.columns.count, 1));
            this._elementDefs = new Array<ElementDef>(childrenCount);
            if (rows.count > 0)
                rows.forEach((row, i) => this._rowDefs[i] = new RowDef(row, i, vSizeToContent));
            else
                this._rowDefs[0] = new RowDef(new GridRow(new GridLength(1, GridUnitType.Star)), 0, vSizeToContent);
            if (columns.count > 0)
                columns.forEach((column, i) => this._columnDefs[i] = new ColumnDef(column, i, hSizeToContent));
            else
                this._columnDefs[0] = new ColumnDef(new GridColumn(new GridLength(1, GridUnitType.Star)), 0, hSizeToContent);

            for (var iElement = 0; iElement < childrenCount; iElement++) {
                var child = this.children.at(iElement);
                var elRow = Grid.getRow(child).minMax(0, this._rowDefs.length - 1);
                var elColumn = Grid.getColumn(child).minMax(0, this._columnDefs.length - 1);
                var elRowSpan = Grid.getRowSpan(child).minMax(1, this._rowDefs.length - elRow);
                var elColumnSpan = Grid.getColumnSpan(child).minMax(1, this._columnDefs.length - elColumn);

                this._elementDefs[iElement] = new ElementDef(child, elRow, elColumn, elRowSpan, elColumnSpan);

                if (elRowSpan == 1) {
                    for (var row = elRow; row < elRow + elRowSpan; row++)
                        this._rowDefs[row].elements.push(this._elementDefs[iElement]);
                }
                if (elColumnSpan == 1) {
                    for (var col = elColumn; col < elColumn + elColumnSpan; col++)
                        this._columnDefs[col].elements.push(this._elementDefs[iElement]);
                }
            }

            //measure children full contained in auto and fixed size row/column (exclude only children that are fully contained in star w/h cells)
            for (var iRow = 0; iRow < this._rowDefs.length; iRow++) {
                var rowDef = this._rowDefs[iRow];
                var elements = rowDef.elements;

                if (rowDef.isAuto) {
                    elements.forEach((el) => el.setAvailHeight(iRow, Infinity));
                }
                else if (rowDef.isFixed) {
                    rowDef.desHeight = rowDef.row.height.value;
                    elements.forEach((el) => el.setAvailHeight(iRow, rowDef.desHeight));
                }
                else { //isStar
                    elements.forEach((el) => el.measuredWidthFirstPass = true);//elements in this group can still be measured by the other dimension (width or height)
                }
            }
            for (var iColumn = 0; iColumn < this._columnDefs.length; iColumn++) {
                var columnDef = this._columnDefs[iColumn];
                var elements = columnDef.elements;

                if (columnDef.isAuto) {
                    elements.forEach((el) => el.setAvailWidth(iColumn, Infinity));
                }
                else if (columnDef.isFixed) {
                    columnDef.desWidth = columnDef.column.width.value;
                    elements.forEach((el) => el.setAvailWidth(iColumn, columnDef.desWidth));
                }
                else { //isStar
                    elements.forEach((el) => el.measuredHeightFirstPass = true);//elements in this group can still be measured by the other dimension (width or height)
                }
            }
            this._elementDefs.forEach((el) => {
                if (!el.measuredHeightFirstPass ||
                    !el.measuredWidthFirstPass) {
                    el.element.measure(new Size(el.getAllAvailWidth(), el.getAllAvailHeight()));
                    if (isNaN(el.desWidth))
                        el.desWidth = el.element.desiredSize.width;
                    if (isNaN(el.desHeight))
                        el.desHeight = el.element.desiredSize.height;
                }
                el.measuredWidthFirstPass = el.measuredHeightFirstPass = true;
            });

            //than get max of any auto/fixed measured row/column
            this._rowDefs.forEach(rowDef => {
                if (!rowDef.isStar)
                    rowDef.elements.forEach((el) => rowDef.desHeight = Math.max(rowDef.desHeight, el.element.desiredSize.height));
            });

            this._columnDefs.forEach(columnDef => {
                if (!columnDef.isStar)
                    columnDef.elements.forEach((el) => columnDef.desWidth = Math.max(columnDef.desWidth, el.element.desiredSize.width));
            });

            //now measure any fully contained star size row/column
            var elementToMeasure: ElementDef[] = [];
            var notStarRowsHeight = 0; this._rowDefs.forEach((r) => notStarRowsHeight += r.desHeight);
            var sumRowStars = 0; this._rowDefs.forEach(r => { if (r.isStar) sumRowStars += r.row.height.value; });
            var vRowMultiplier = (constraint.height - notStarRowsHeight) / sumRowStars;
            this._rowDefs.forEach(rowDef=> {
                if (!rowDef.isStar)
                    return;

                var elements = rowDef.elements;
                //if size to content horizontally, star rows are treat just like auto rows (same apply to columns of course)
                if (!vSizeToContent) {
                    var availHeight = vRowMultiplier * rowDef.row.height.value;
                    rowDef.desHeight = availHeight;
                    elements.forEach((el) => { el.setAvailHeight(rowDef.index, availHeight); el.measuredHeightFirstPass = false });
                }

                elementToMeasure.push.apply(elementToMeasure, elements);                
            });

            var notStarColumnsHeight = 0; this._columnDefs.forEach((c) => notStarColumnsHeight += c.desWidth);
            var sumColumnStars = 0; this._columnDefs.forEach(c => { if (c.isStar) sumColumnStars += c.column.width.value; });
            var vColumnMultiplier = (constraint.width - notStarColumnsHeight) / sumColumnStars;
            this._columnDefs.forEach(columnDef => {
                if (!columnDef.isStar)
                    return;

                var elements = columnDef.elements;
                if (!hSizeToContent) {
                    var availWidth = vColumnMultiplier * columnDef.column.width.value;
                    columnDef.desWidth = availWidth;
                    elements.forEach((el) => { el.setAvailWidth(columnDef.index, availWidth); el.measuredWidthFirstPass = false });
                }

                elementToMeasure.push.apply(elementToMeasure, elements);
            });
            elementToMeasure.forEach(e => {
                if (!e.measuredHeightFirstPass ||
                    !e.measuredWidthFirstPass) {
                    e.element.measure(new Size(e.getAllAvailWidth(), e.getAllAvailHeight()));
                    e.desWidth = e.element.desiredSize.width;
                    e.desHeight = e.element.desiredSize.height;
                    e.measuredWidthFirstPass = true;
                    e.measuredHeightFirstPass = true;
                }
            });

            //than adjust width and height to fit children that spans over columns or rows containing auto rows or auto columns
            for (var iElement = 0; iElement < this._elementDefs.length; iElement++) {
                var elementDef = this._elementDefs[iElement];
                if (elementDef.rowSpan > 1) {
                    if (this._rowDefs
                        .slice(elementDef.row, elementDef.row + elementDef.rowSpan)
                        .every((v, i, a) => v.isAuto || v.isFixed)) {
                        var concatHeight = 0;
                        this._rowDefs.slice(elementDef.row, elementDef.row + elementDef.rowSpan).forEach((el) => concatHeight += el.desHeight);

                        if (concatHeight < elementDef.desHeight) {
                            var diff = elementDef.desHeight - concatHeight;
                            var autoRows = this._rowDefs.filter(r=> r.isAuto);
                            if (autoRows.length > 0) {
                                autoRows.forEach(c=> c.desHeight += diff / autoRows.length);
                            }
                            else {
                                var starRows = this._rowDefs.filter(r=> r.isStar);
                                if (starRows.length > 0) {
                                    starRows.forEach(c=> c.desHeight += diff / autoColumns.length);
                                }
                            }
                        }
                        else if (concatHeight > elementDef.desHeight) {
                            elementDef.cellTopOffset = (concatHeight - elementDef.desHeight) / 2;
                        }
                    }
                }
                if (elementDef.columnSpan > 1) {
                    if (this._columnDefs
                        .slice(elementDef.column, elementDef.column + elementDef.columnSpan)
                        .every((v, i, a) => v.isAuto || v.isFixed)) {
                        var concatWidth = 0;
                        this._columnDefs.slice(elementDef.column, elementDef.column + elementDef.columnSpan).forEach((el) => concatWidth += el.desWidth);
                        if (concatWidth < elementDef.desWidth) {
                            var diff = elementDef.desWidth - concatWidth;
                            var autoColumns = this._columnDefs.filter(c=> c.isAuto);
                            if (autoColumns.length > 0) {
                                autoColumns.forEach(c=> c.desWidth += diff / autoColumns.length);
                            }
                            else {
                                var starColumns = this._columnDefs.filter(c=> c.isStar);
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
            }


            //finally sum up the desidered size
            this._rowDefs.forEach(r => desideredSize.height += r.desHeight);
            this._columnDefs.forEach(c => desideredSize.width += c.desWidth);
            this._lastDesiredSize = desideredSize;
            return desideredSize;
        }

        protected arrangeOverride(finalSize: Size): Size {
            //if finalSize != this.desideredSize we have to
            //to correct row/column with star values to take extra space or viceversa
            //remove space no more available from measure pass
            var xDiff = finalSize.width - this._lastDesiredSize.width;
            var yDiff = finalSize.height - this._lastDesiredSize.height;

            //rd.isStar/cd.isStar take in count also sizeToContent stuff
            //we need here only to know if column is star or not
            //this why we are using rd.row.height.isStar or cd.column.width.isStar
            var starRowCount = 0;
            this._rowDefs.forEach(rd=> {
                if (rd.row.height.isStar)
                    starRowCount++;
            });
            var starColumnCount = 0;
            this._columnDefs.forEach(cd=> {
                if (cd.column.width.isStar)
                    starColumnCount++;
            });

            this._rowDefs.forEach(rd=> {
                //rd.isStar takes in count also sizeToContent stuff
                //we need here only to know if column is star or not
                if (rd.row.height.isStar)
                    rd.finalHeight = rd.desHeight + yDiff / starRowCount;
                else
                    rd.finalHeight = rd.desHeight;
            });

            this._columnDefs.forEach(cd=> {
                if (cd.column.width.isStar)
                    cd.finalWidth = cd.desWidth + xDiff / starColumnCount;
                else
                    cd.finalWidth = cd.desWidth;
            });

            this._elementDefs.forEach(el => {
                let finalLeft = 0; this._columnDefs.slice(0, el.column).forEach(c => finalLeft += c.finalWidth );
                let finalWidth = 0; this._columnDefs.slice(el.column, el.column + el.columnSpan).forEach(c => finalWidth += c.finalWidth );
                finalWidth -= (el.cellLeftOffset * 2) ;

                let finalTop = 0; this._rowDefs.slice(0, el.row).forEach(c => finalTop += c.finalHeight );
                let finalHeight = 0; this._rowDefs.slice(el.row, el.row + el.rowSpan).forEach(r => finalHeight += r.finalHeight );
                finalHeight += (el.cellTopOffset * 2) ;

                el.element.arrange(new Rect(finalLeft + el.cellLeftOffset, finalTop + el.cellTopOffset, finalWidth, finalHeight));
            });

            return finalSize;
        }   

        public getRowFinalHeight(rowIndex: number): number {
            return this._rowDefs[rowIndex].finalHeight;
        }
        public getColumnFinalWidth(colIndex: number): number {
            return this._columnDefs[colIndex].finalWidth;
        }


        ///Dependency properties

        //rows
        static rowsProperty = DepObject.registerProperty(Grid.typeName, "Rows", null, FrameworkPropertyMetadataOptions.AffectsMeasure | FrameworkPropertyMetadataOptions.AffectsRender, (v) => Grid.rowsFromString(v));
        get rows(): ObservableCollection<GridRow> {
            return <ObservableCollection<GridRow>>this.getValue(Grid.rowsProperty);
        }
        set rows(value: ObservableCollection<GridRow>) {
            this.setValue(Grid.rowsProperty, value);
        }

        getRows(): ObservableCollection<GridRow> {
            var rows = this.rows;
            if (rows == null) {
                this.rows = rows = new ObservableCollection<GridRow>();
                rows.onChangeNotify(this);
            }

            return rows;
        }

        private static rowsFromString(rows: string): ObservableCollection<GridRow> {
            var listOfRows = new Array<GridRow>();
            GridLength.parseString(rows).forEach((rowDef) => {
                listOfRows.push(new GridRow(rowDef.length, rowDef.min, rowDef.max));
            });
            return new ObservableCollection(listOfRows);
        }

        //columns
        static columnsProperty = DepObject.registerProperty(Grid.typeName, "Columns", null, FrameworkPropertyMetadataOptions.AffectsMeasure | FrameworkPropertyMetadataOptions.AffectsRender, (v) => Grid.columnsFromString(v));
        get columns(): ObservableCollection<GridColumn> {
            return <ObservableCollection<GridColumn>>this.getValue(Grid.columnsProperty);
        }
        set columns(value: ObservableCollection<GridColumn>) {
            this.setValue(Grid.columnsProperty, value);
        }

        getColumns(): ObservableCollection<GridColumn> {
            var columns = this.columns;
            if (columns == null) {
                this.columns = columns = new ObservableCollection<GridColumn>();
                columns.onChangeNotify(this);
            }

            return columns;
        }
        private static columnsFromString(columns: string) : ObservableCollection<GridColumn> {
            var listOfColumns = new Array<GridColumn>();
            GridLength.parseString(columns).forEach((columnDef) => {
                listOfColumns.push(new GridColumn(columnDef.length, columnDef.min, columnDef.max));
            });
            return new ObservableCollection(listOfColumns);
        }


        onCollectionChanged(collection: any, added: Object[], removed: Object[], startRemoveIndex: number) {
            super.invalidateMeasure();
        }

        //Grid.Row property
        static rowProperty = DepObject.registerProperty(Grid.typeName, "Grid#Row", 0, FrameworkPropertyMetadataOptions.AffectsMeasure, (v) => Grid.fromString(v));
        static getRow(target: DepObject): number {
            return <number>target.getValue(Grid.rowProperty);
        }
        static setRow(target: DepObject, value: number) {
            target.setValue(Grid.rowProperty, value);
        }

        //Grid.Column property
        static columnProperty = DepObject.registerProperty(Grid.typeName, "Grid#Column", 0, FrameworkPropertyMetadataOptions.AffectsMeasure, (v) => Grid.fromString(v));
        static getColumn(target: DepObject): number {
            return <number>target.getValue(Grid.columnProperty);
        }
        static setColumn(target: DepObject, value: number) {
            target.setValue(Grid.columnProperty, value);
        }
        private static fromString(value: string): number {
            var intValue = parseInt(value);

            if (isNaN(intValue) ||
                !isFinite(intValue))
                return 0;

            return intValue;
        }

        //Grid.RowSpan property
        static rowSpanProperty = DepObject.registerProperty(Grid.typeName, "Grid#RowSpan", 1, FrameworkPropertyMetadataOptions.AffectsMeasure, (v) => Grid.spanFromString(v));
        static getRowSpan(target: DepObject): number {
            return <number>target.getValue(Grid.rowSpanProperty);
        }
        static setRowSpan(target: DepObject, value: number) {
            target.setValue(Grid.rowSpanProperty, value);
        }

        //Grid.ColumnSpan property
        static columnSpanProperty = DepObject.registerProperty(Grid.typeName, "Grid#ColumnSpan", 1, FrameworkPropertyMetadataOptions.AffectsMeasure, (v) => Grid.spanFromString(v));
        static getColumnSpan(target: DepObject): number {
            return <number>target.getValue(Grid.columnSpanProperty);
        }
        static setColumnSpan(target: DepObject, value: number) {
            target.setValue(Grid.columnSpanProperty, value);
        }
        private static spanFromString(value: string): number {
            var intValue = parseInt(value);

            if (isNaN(intValue) ||
                !isFinite(intValue))
                return 1;

            return intValue;
        }

    }
}