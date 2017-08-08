var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var layouts;
(function (layouts) {
    var controls;
    (function (controls) {
        var GridUnitType;
        (function (GridUnitType) {
            GridUnitType[GridUnitType["Auto"] = 0] = "Auto";
            GridUnitType[GridUnitType["Pixel"] = 1] = "Pixel";
            GridUnitType[GridUnitType["Star"] = 2] = "Star";
        })(GridUnitType = controls.GridUnitType || (controls.GridUnitType = {}));
        var GridLength = (function () {
            function GridLength(value, type) {
                if (type === void 0) { type = GridUnitType.Pixel; }
                if (value.isCloseTo(0))
                    value = 0;
                this._value = value;
                this._type = type;
            }
            GridLength.parseString = function (value) {
                value = value.trim();
                var tokens = value.split(" ");
                return tokens.map(function (token) {
                    token = token.trim();
                    if (token.length == 0)
                        return;
                    if (token[0] == '[') {
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
                        return {
                            length: GridLength.fromString(token)
                        };
                    }
                });
            };
            GridLength.fromString = function (value) {
                if (value == "Auto")
                    return new GridLength(1, GridUnitType.Auto);
                if (value.substr(value.length - 1, 1) == "*") {
                    var starLen = value.length == 1 ? 1 : parseFloat(value.substr(0, value.length - 1));
                    return new GridLength(starLen, GridUnitType.Star);
                }
                return new GridLength(parseFloat(value), GridUnitType.Pixel);
            };
            Object.defineProperty(GridLength.prototype, "value", {
                get: function () {
                    return this._value;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(GridLength.prototype, "type", {
                get: function () {
                    return this._type;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(GridLength.prototype, "isAuto", {
                get: function () {
                    return this._type == GridUnitType.Auto;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(GridLength.prototype, "isFixed", {
                get: function () {
                    return this._type == GridUnitType.Pixel;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(GridLength.prototype, "isStar", {
                get: function () {
                    return this._type == GridUnitType.Star;
                },
                enumerable: true,
                configurable: true
            });
            return GridLength;
        }());
        controls.GridLength = GridLength;
        var GridRow = (function () {
            function GridRow(height, minHeight, maxHeight) {
                if (height === void 0) { height = new GridLength(1, GridUnitType.Star); }
                if (minHeight === void 0) { minHeight = 0; }
                if (maxHeight === void 0) { maxHeight = +Infinity; }
                this.height = height;
                this.minHeight = minHeight;
                this.maxHeight = maxHeight;
            }
            return GridRow;
        }());
        controls.GridRow = GridRow;
        var GridColumn = (function () {
            function GridColumn(width, minWidth, maxWidth) {
                if (width === void 0) { width = new GridLength(1, GridUnitType.Star); }
                if (minWidth === void 0) { minWidth = 0; }
                if (maxWidth === void 0) { maxWidth = +Infinity; }
                this.width = width;
                this.minWidth = minWidth;
                this.maxWidth = maxWidth;
            }
            return GridColumn;
        }());
        controls.GridColumn = GridColumn;
        var RowDef = (function () {
            function RowDef(row, index, vSizeToContent) {
                this.row = row;
                this.index = index;
                this.availHeight = Infinity;
                this._desHeight = 0;
                this._finalHeight = 0;
                this.elements = [];
                this._isAuto = this.row.height.isAuto || (vSizeToContent && this.row.height.isStar);
                this._isStar = this.row.height.isStar && !vSizeToContent;
                this._isFixed = this.row.height.isFixed;
            }
            Object.defineProperty(RowDef.prototype, "desHeight", {
                get: function () {
                    return this._desHeight;
                },
                set: function (newValue) {
                    this._desHeight = newValue.minMax(this.row.minHeight, this.row.maxHeight);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(RowDef.prototype, "finalHeight", {
                get: function () {
                    return this._finalHeight;
                },
                set: function (newValue) {
                    this._finalHeight = newValue.minMax(this.row.minHeight, this.row.maxHeight);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(RowDef.prototype, "isAuto", {
                get: function () {
                    return this._isAuto;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(RowDef.prototype, "isStar", {
                get: function () {
                    return this._isStar;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(RowDef.prototype, "isFixed", {
                get: function () {
                    return this._isFixed;
                },
                enumerable: true,
                configurable: true
            });
            return RowDef;
        }());
        var ColumnDef = (function () {
            function ColumnDef(column, index, hSizeToContent) {
                this.column = column;
                this.index = index;
                this.availWidth = Infinity;
                this._desWidth = 0;
                this._finalWidth = 0;
                this.elements = [];
                this._isAuto = this.column.width.isAuto || (hSizeToContent && this.column.width.isStar);
                this._isStar = this.column.width.isStar && !hSizeToContent;
                this._isFixed = this.column.width.isFixed;
            }
            Object.defineProperty(ColumnDef.prototype, "desWidth", {
                get: function () {
                    return this._desWidth;
                },
                set: function (newValue) {
                    this._desWidth = newValue.minMax(this.column.minWidth, this.column.maxWidth);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(ColumnDef.prototype, "finalWidth", {
                get: function () {
                    return this._finalWidth;
                },
                set: function (newValue) {
                    this._finalWidth = newValue.minMax(this.column.minWidth, this.column.maxWidth);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(ColumnDef.prototype, "isAuto", {
                get: function () {
                    return this._isAuto;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(ColumnDef.prototype, "isStar", {
                get: function () {
                    return this._isStar;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(ColumnDef.prototype, "isFixed", {
                get: function () {
                    return this._isFixed;
                },
                enumerable: true,
                configurable: true
            });
            return ColumnDef;
        }());
        var ElementDef = (function () {
            function ElementDef(element, row, column, rowSpan, columnSpan) {
                this.element = element;
                this.row = row;
                this.column = column;
                this.rowSpan = rowSpan;
                this.columnSpan = columnSpan;
                this.desWidth = NaN;
                this.desHeight = NaN;
                this.cellTopOffset = 0;
                this.cellLeftOffset = 0;
                this._availWidth = new Array(columnSpan);
                for (var i = 0; i < this._availWidth.length; i++)
                    this._availWidth[i] = Infinity;
                this._availHeight = new Array(rowSpan);
                for (var i = 0; i < this._availHeight.length; i++)
                    this._availHeight[i] = Infinity;
            }
            ElementDef.prototype.getAvailWidth = function (column) {
                return this._availWidth[column - this.column];
            };
            ElementDef.prototype.getAllAvailWidth = function () {
                var sum = 0;
                for (var i = 0; i < this._availWidth.length; i++) {
                    if (!isFinite(this._availWidth[i]))
                        return Infinity;
                    sum += this._availWidth[i];
                }
                return sum;
            };
            ElementDef.prototype.setAvailWidth = function (column, value) {
                this._availWidth[column - this.column] = value;
            };
            ElementDef.prototype.getAvailHeight = function (row) {
                return this._availHeight[row - this.row];
            };
            ElementDef.prototype.getAllAvailHeight = function () {
                var sum = 0;
                for (var i = 0; i < this._availHeight.length; i++) {
                    if (!isFinite(this._availHeight[i]))
                        return Infinity;
                    sum += this._availHeight[i];
                }
                return sum;
            };
            ElementDef.prototype.setAvailHeight = function (row, value) {
                this._availHeight[row - this.row] = value;
            };
            return ElementDef;
        }());
        var Grid = (function (_super) {
            __extends(Grid, _super);
            function Grid() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            Object.defineProperty(Grid.prototype, "typeName", {
                get: function () {
                    return Grid.typeName;
                },
                enumerable: true,
                configurable: true
            });
            Grid.prototype.measureOverride = function (constraint) {
                var _this = this;
                var desideredSize = new layouts.Size();
                var hSizeToContent = !isFinite(constraint.width);
                var vSizeToContent = !isFinite(constraint.height);
                var childrenCount = this.children == null ? 0 : this.children.count;
                var rows = this.getRows();
                var columns = this.getColumns();
                this._rowDefs = new Array(Math.max(rows.count, 1));
                this._columnDefs = new Array(Math.max(this.columns.count, 1));
                this._elementDefs = new Array(childrenCount);
                if (rows.count > 0)
                    rows.forEach(function (row, i) { return _this._rowDefs[i] = new RowDef(row, i, vSizeToContent); });
                else
                    this._rowDefs[0] = new RowDef(new GridRow(new GridLength(1, GridUnitType.Star)), 0, vSizeToContent);
                if (columns.count > 0)
                    columns.forEach(function (column, i) { return _this._columnDefs[i] = new ColumnDef(column, i, hSizeToContent); });
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
                for (var iRow = 0; iRow < this._rowDefs.length; iRow++) {
                    var rowDef = this._rowDefs[iRow];
                    var elements = rowDef.elements;
                    if (rowDef.isAuto) {
                        elements.forEach(function (el) { return el.setAvailHeight(iRow, Infinity); });
                    }
                    else if (rowDef.isFixed) {
                        rowDef.desHeight = rowDef.row.height.value;
                        elements.forEach(function (el) { return el.setAvailHeight(iRow, rowDef.desHeight); });
                    }
                    else {
                        elements.forEach(function (el) { return el.measuredWidthFirstPass = true; });
                    }
                }
                for (var iColumn = 0; iColumn < this._columnDefs.length; iColumn++) {
                    var columnDef = this._columnDefs[iColumn];
                    var elements = columnDef.elements;
                    if (columnDef.isAuto) {
                        elements.forEach(function (el) { return el.setAvailWidth(iColumn, Infinity); });
                    }
                    else if (columnDef.isFixed) {
                        columnDef.desWidth = columnDef.column.width.value;
                        elements.forEach(function (el) { return el.setAvailWidth(iColumn, columnDef.desWidth); });
                    }
                    else {
                        elements.forEach(function (el) { return el.measuredHeightFirstPass = true; });
                    }
                }
                this._elementDefs.forEach(function (el) {
                    if (!el.measuredHeightFirstPass ||
                        !el.measuredWidthFirstPass) {
                        el.element.measure(new layouts.Size(el.getAllAvailWidth(), el.getAllAvailHeight()));
                        if (isNaN(el.desWidth))
                            el.desWidth = el.element.desiredSize.width;
                        if (isNaN(el.desHeight))
                            el.desHeight = el.element.desiredSize.height;
                    }
                    el.measuredWidthFirstPass = el.measuredHeightFirstPass = true;
                });
                this._rowDefs.forEach(function (rowDef) {
                    if (!rowDef.isStar)
                        rowDef.elements.forEach(function (el) { return rowDef.desHeight = Math.max(rowDef.desHeight, el.element.desiredSize.height); });
                });
                this._columnDefs.forEach(function (columnDef) {
                    if (!columnDef.isStar)
                        columnDef.elements.forEach(function (el) { return columnDef.desWidth = Math.max(columnDef.desWidth, el.element.desiredSize.width); });
                });
                var elementToMeasure = [];
                var notStarRowsHeight = 0;
                this._rowDefs.forEach(function (r) { return notStarRowsHeight += r.desHeight; });
                var sumRowStars = 0;
                this._rowDefs.forEach(function (r) { if (r.isStar)
                    sumRowStars += r.row.height.value; });
                var vRowMultiplier = (constraint.height - notStarRowsHeight) / sumRowStars;
                this._rowDefs.forEach(function (rowDef) {
                    if (!rowDef.isStar)
                        return;
                    var elements = rowDef.elements;
                    if (!vSizeToContent) {
                        var availHeight = vRowMultiplier * rowDef.row.height.value;
                        rowDef.desHeight = availHeight;
                        elements.forEach(function (el) { el.setAvailHeight(rowDef.index, availHeight); el.measuredHeightFirstPass = false; });
                    }
                    elementToMeasure.push.apply(elementToMeasure, elements);
                });
                var notStarColumnsHeight = 0;
                this._columnDefs.forEach(function (c) { return notStarColumnsHeight += c.desWidth; });
                var sumColumnStars = 0;
                this._columnDefs.forEach(function (c) { if (c.isStar)
                    sumColumnStars += c.column.width.value; });
                var vColumnMultiplier = (constraint.width - notStarColumnsHeight) / sumColumnStars;
                this._columnDefs.forEach(function (columnDef) {
                    if (!columnDef.isStar)
                        return;
                    var elements = columnDef.elements;
                    if (!hSizeToContent) {
                        var availWidth = vColumnMultiplier * columnDef.column.width.value;
                        columnDef.desWidth = availWidth;
                        elements.forEach(function (el) { el.setAvailWidth(columnDef.index, availWidth); el.measuredWidthFirstPass = false; });
                    }
                    elementToMeasure.push.apply(elementToMeasure, elements);
                });
                elementToMeasure.forEach(function (e) {
                    if (!e.measuredHeightFirstPass ||
                        !e.measuredWidthFirstPass) {
                        e.element.measure(new layouts.Size(e.getAllAvailWidth(), e.getAllAvailHeight()));
                        e.desWidth = e.element.desiredSize.width;
                        e.desHeight = e.element.desiredSize.height;
                        e.measuredWidthFirstPass = true;
                        e.measuredHeightFirstPass = true;
                    }
                });
                for (var iElement = 0; iElement < this._elementDefs.length; iElement++) {
                    var elementDef = this._elementDefs[iElement];
                    if (elementDef.rowSpan > 1) {
                        if (this._rowDefs
                            .slice(elementDef.row, elementDef.row + elementDef.rowSpan)
                            .every(function (v, i, a) { return v.isAuto || v.isFixed; })) {
                            var concatHeight = 0;
                            this._rowDefs.slice(elementDef.row, elementDef.row + elementDef.rowSpan).forEach(function (el) { return concatHeight += el.desHeight; });
                            if (concatHeight < elementDef.desHeight) {
                                var diff = elementDef.desHeight - concatHeight;
                                var autoRows = this._rowDefs.filter(function (r) { return r.isAuto; });
                                if (autoRows.length > 0) {
                                    autoRows.forEach(function (c) { return c.desHeight += diff / autoRows.length; });
                                }
                                else {
                                    var starRows = this._rowDefs.filter(function (r) { return r.isStar; });
                                    if (starRows.length > 0) {
                                        starRows.forEach(function (c) { return c.desHeight += diff / autoColumns.length; });
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
                            .every(function (v, i, a) { return v.isAuto || v.isFixed; })) {
                            var concatWidth = 0;
                            this._columnDefs.slice(elementDef.column, elementDef.column + elementDef.columnSpan).forEach(function (el) { return concatWidth += el.desWidth; });
                            if (concatWidth < elementDef.desWidth) {
                                var diff = elementDef.desWidth - concatWidth;
                                var autoColumns = this._columnDefs.filter(function (c) { return c.isAuto; });
                                if (autoColumns.length > 0) {
                                    autoColumns.forEach(function (c) { return c.desWidth += diff / autoColumns.length; });
                                }
                                else {
                                    var starColumns = this._columnDefs.filter(function (c) { return c.isStar; });
                                    if (starColumns.length > 0) {
                                        starColumns.forEach(function (c) { return c.desWidth += diff / autoColumns.length; });
                                    }
                                }
                            }
                            else if (concatWidth > elementDef.desWidth) {
                                elementDef.cellLeftOffset = (concatWidth - elementDef.desWidth) / 2;
                            }
                        }
                    }
                }
                this._rowDefs.forEach(function (r) { return desideredSize.height += r.desHeight; });
                this._columnDefs.forEach(function (c) { return desideredSize.width += c.desWidth; });
                this._lastDesiredSize = desideredSize;
                return desideredSize;
            };
            Grid.prototype.arrangeOverride = function (finalSize) {
                var _this = this;
                var xDiff = finalSize.width - this._lastDesiredSize.width;
                var yDiff = finalSize.height - this._lastDesiredSize.height;
                var starRowCount = 0;
                this._rowDefs.forEach(function (rd) {
                    if (rd.row.height.isStar)
                        starRowCount++;
                });
                var starColumnCount = 0;
                this._columnDefs.forEach(function (cd) {
                    if (cd.column.width.isStar)
                        starColumnCount++;
                });
                this._rowDefs.forEach(function (rd) {
                    if (rd.row.height.isStar)
                        rd.finalHeight = rd.desHeight + yDiff / starRowCount;
                    else
                        rd.finalHeight = rd.desHeight;
                });
                this._columnDefs.forEach(function (cd) {
                    if (cd.column.width.isStar)
                        cd.finalWidth = cd.desWidth + xDiff / starColumnCount;
                    else
                        cd.finalWidth = cd.desWidth;
                });
                this._elementDefs.forEach(function (el) {
                    var finalLeft = 0;
                    _this._columnDefs.slice(0, el.column).forEach(function (c) { return finalLeft += c.finalWidth; });
                    var finalWidth = 0;
                    _this._columnDefs.slice(el.column, el.column + el.columnSpan).forEach(function (c) { return finalWidth += c.finalWidth; });
                    finalWidth -= (el.cellLeftOffset * 2);
                    var finalTop = 0;
                    _this._rowDefs.slice(0, el.row).forEach(function (c) { return finalTop += c.finalHeight; });
                    var finalHeight = 0;
                    _this._rowDefs.slice(el.row, el.row + el.rowSpan).forEach(function (r) { return finalHeight += r.finalHeight; });
                    finalHeight += (el.cellTopOffset * 2);
                    el.element.arrange(new layouts.Rect(finalLeft + el.cellLeftOffset, finalTop + el.cellTopOffset, finalWidth, finalHeight));
                });
                return finalSize;
            };
            Grid.prototype.getRowFinalHeight = function (rowIndex) {
                return this._rowDefs[rowIndex].finalHeight;
            };
            Grid.prototype.getColumnFinalWidth = function (colIndex) {
                return this._columnDefs[colIndex].finalWidth;
            };
            Object.defineProperty(Grid.prototype, "rows", {
                get: function () {
                    return this.getValue(Grid.rowsProperty);
                },
                set: function (value) {
                    this.setValue(Grid.rowsProperty, value);
                },
                enumerable: true,
                configurable: true
            });
            Grid.prototype.getRows = function () {
                var rows = this.rows;
                if (rows == null) {
                    this.rows = rows = new layouts.ObservableCollection();
                    rows.onChangeNotify(this);
                }
                return rows;
            };
            Grid.rowsFromString = function (rows) {
                var listOfRows = new Array();
                GridLength.parseString(rows).forEach(function (rowDef) {
                    listOfRows.push(new GridRow(rowDef.length, rowDef.min, rowDef.max));
                });
                return new layouts.ObservableCollection(listOfRows);
            };
            Object.defineProperty(Grid.prototype, "columns", {
                get: function () {
                    return this.getValue(Grid.columnsProperty);
                },
                set: function (value) {
                    this.setValue(Grid.columnsProperty, value);
                },
                enumerable: true,
                configurable: true
            });
            Grid.prototype.getColumns = function () {
                var columns = this.columns;
                if (columns == null) {
                    this.columns = columns = new layouts.ObservableCollection();
                    columns.onChangeNotify(this);
                }
                return columns;
            };
            Grid.columnsFromString = function (columns) {
                var listOfColumns = new Array();
                GridLength.parseString(columns).forEach(function (columnDef) {
                    listOfColumns.push(new GridColumn(columnDef.length, columnDef.min, columnDef.max));
                });
                return new layouts.ObservableCollection(listOfColumns);
            };
            Grid.prototype.onCollectionChanged = function (collection, added, removed, startRemoveIndex) {
                _super.prototype.invalidateMeasure.call(this);
            };
            Grid.getRow = function (target) {
                return target.getValue(Grid.rowProperty);
            };
            Grid.setRow = function (target, value) {
                target.setValue(Grid.rowProperty, value);
            };
            Grid.getColumn = function (target) {
                return target.getValue(Grid.columnProperty);
            };
            Grid.setColumn = function (target, value) {
                target.setValue(Grid.columnProperty, value);
            };
            Grid.fromString = function (value) {
                var intValue = parseInt(value);
                if (isNaN(intValue) ||
                    !isFinite(intValue))
                    return 0;
                return intValue;
            };
            Grid.getRowSpan = function (target) {
                return target.getValue(Grid.rowSpanProperty);
            };
            Grid.setRowSpan = function (target, value) {
                target.setValue(Grid.rowSpanProperty, value);
            };
            Grid.getColumnSpan = function (target) {
                return target.getValue(Grid.columnSpanProperty);
            };
            Grid.setColumnSpan = function (target, value) {
                target.setValue(Grid.columnSpanProperty, value);
            };
            Grid.spanFromString = function (value) {
                var intValue = parseInt(value);
                if (isNaN(intValue) ||
                    !isFinite(intValue))
                    return 1;
                return intValue;
            };
            return Grid;
        }(controls.Panel));
        Grid.typeName = "layouts.controls.Grid";
        Grid.rowsProperty = layouts.DepObject.registerProperty(Grid.typeName, "Rows", null, layouts.FrameworkPropertyMetadataOptions.AffectsMeasure | layouts.FrameworkPropertyMetadataOptions.AffectsRender, function (v) { return Grid.rowsFromString(v); });
        Grid.columnsProperty = layouts.DepObject.registerProperty(Grid.typeName, "Columns", null, layouts.FrameworkPropertyMetadataOptions.AffectsMeasure | layouts.FrameworkPropertyMetadataOptions.AffectsRender, function (v) { return Grid.columnsFromString(v); });
        Grid.rowProperty = layouts.DepObject.registerProperty(Grid.typeName, "Grid#Row", 0, layouts.FrameworkPropertyMetadataOptions.AffectsMeasure, function (v) { return Grid.fromString(v); });
        Grid.columnProperty = layouts.DepObject.registerProperty(Grid.typeName, "Grid#Column", 0, layouts.FrameworkPropertyMetadataOptions.AffectsMeasure, function (v) { return Grid.fromString(v); });
        Grid.rowSpanProperty = layouts.DepObject.registerProperty(Grid.typeName, "Grid#RowSpan", 1, layouts.FrameworkPropertyMetadataOptions.AffectsMeasure, function (v) { return Grid.spanFromString(v); });
        Grid.columnSpanProperty = layouts.DepObject.registerProperty(Grid.typeName, "Grid#ColumnSpan", 1, layouts.FrameworkPropertyMetadataOptions.AffectsMeasure, function (v) { return Grid.spanFromString(v); });
        controls.Grid = Grid;
    })(controls = layouts.controls || (layouts.controls = {}));
})(layouts || (layouts = {}));
