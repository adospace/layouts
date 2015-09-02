
module layouts.controls {
    export class GridViewColumn extends DepObject {
        static typeName: string = "app.GridViewColumn";
        get typeName(): string {
            return GridViewColumn.typeName;
        }

        //name property
        private _name: string;
        get name(): string {
            return this._name;
        }
        set name(value: string) {
            if (this._name != value) {
                var oldValue = this._name;
                this._name = value;
                this.onPropertyChanged("name", value, oldValue);
            }
        }

        //title property
        private _title: string;
        get title(): string {
            if (this._title == null)
                return this._name;
            return this._title;
        }
        set title(value: string) {
            if (this._title != value) {
                var oldValue = this._title;
                this._title = value;
                this.onPropertyChanged("title", value, oldValue);
            }
        }

        //column header template property
        private _headerTemplate: DataTemplate;
        get headerTemplate(): DataTemplate {
            return this._headerTemplate;
        }
        set headerTemplate(value: DataTemplate) {
            if (this._headerTemplate != value) {
                var oldValue = this._headerTemplate;
                this._headerTemplate = value;
                this.onPropertyChanged("headerTemplate", value, oldValue);
            }
        }

        //cell template property
        private _cellTemplate: DataTemplate;
        get cellTemplate(): DataTemplate {
            return this._cellTemplate;
        }
        set cellTemplate(value: DataTemplate) {
            if (this._cellTemplate != value) {
                var oldValue = this._cellTemplate;
                this._cellTemplate = value;
                this.onPropertyChanged("cellTemplate", value, oldValue);
            }
        }

        //width property
        private _width: GridLength = new GridLength(1, GridUnitType.Star);
        get width(): GridLength {
            return this._width;
        }
        set width(value: GridLength) {
            if (this._width != value) {
                var oldValue = this._width;
                this._width = value;
                this.onPropertyChanged("width", value, oldValue);
            }
        }

    }

    class GridViewColumnHeader extends DepObject {
        static typeName: string = "app.GridViewColumnHeader";
        get typeName(): string {
            return GridViewColumnHeader.typeName;
        }

        constructor(public header: GridViewHeader, public column: GridViewColumn, public element: UIElement) {
            super();
        }

        computedColumnWidth: number = NaN;
    }

    class GridViewHeader extends FrameworkElement implements ISupportCollectionChanged {
        static typeName: string = "app.GridViewHeader";
        get typeName(): string {
            return GridViewHeader.typeName;
        }

        private _gridView: GridView;
        private _headers: GridViewColumnHeader[] = [];
        get headers(): GridViewColumnHeader[] {
            return this._headers;
        }

        constructor(gridView: GridView) {
            super();

            this._gridView = gridView;
        }

        setupHeader() {
            var columnHeaderTemplate = this._gridView.headerTemplate;
            if (columnHeaderTemplate == null) {
                columnHeaderTemplate = new DataTemplate();
                columnHeaderTemplate.setInnerXaml("<TextBlock Text='{title}'/>");
            }
            this._gridView.columns.forEach(c=> {
                var headerTemplate = c.headerTemplate == null ? columnHeaderTemplate : c.headerTemplate;
                var columnHeader = headerTemplate.createElement();
                columnHeader.setValue(FrameworkElement.dataContextProperty, c);
                this._headers.push(new GridViewColumnHeader(this,  c, columnHeader));
            });

            this._headers.forEach(h=> {
                h.element.parent = this;
                h.element.attachVisual(this._visual);
            });
        }

        attachVisualOverride(elementContainer: HTMLElement) {
            //this is the div that will contain the table
            this._visual = document.createElement("div");


            super.attachVisualOverride(elementContainer);
        }

        protected measureOverride(constraint: Size): Size {
            var desiredHeight = 0;
            var totalWidthOfAutoAndFixedColumns = 0;
            var sumOfStars = 0;
            this._headers.forEach(h => {
                if (h.column.width.isFixed)
                    h.element.measure(new Size(h.column.width.value, Infinity));
                else if (h.column.width.isAuto || !isFinite(constraint.width)) {
                    
                    h.element.measure(new Size(h.computedColumnWidth, Infinity));

                }
                else if (h.column.width.isStar)
                    sumOfStars += h.column.width.value;

                totalWidthOfAutoAndFixedColumns += h.element.desideredSize.width;
                desiredHeight = Math.max(desiredHeight, h.element.desideredSize.height);
            });

            var totalWidth = totalWidthOfAutoAndFixedColumns;
            if (isFinite(constraint.width)) {
                this._headers.forEach(h => {
                    if (h.column.width.isStar) {
                        h.element.measure(new Size(Math.max(0, h.column.width.value / sumOfStars * (constraint.width - totalWidthOfAutoAndFixedColumns)), Infinity));
                        totalWidth += h.element.desideredSize.width;
                        desiredHeight = Math.max(desiredHeight, h.element.desideredSize.height);
                    }
                });
            }

            return new Size(totalWidth, desiredHeight);
        }

        protected arrangeOverride(finalSize: Size): Size {
            var totalWidthOfAutoAndFixedColumns = 0;
            var sumOfStars = 0;

            this._headers.forEach(h => {
                if (h.column.width.isFixed)
                    totalWidthOfAutoAndFixedColumns += h.column.width.value;
                else if (h.column.width.isAuto)
                    totalWidthOfAutoAndFixedColumns += h.computedColumnWidth;
                else if (h.column.width.isStar)
                    sumOfStars += h.column.width.value;
            });



            var totalWidth = totalWidthOfAutoAndFixedColumns;
            var leftOffset = 0;
            this._headers.forEach(h => {
                if (h.column.width.isFixed) {
                    h.element.arrange(new Rect(leftOffset, 0, h.column.width.value, finalSize.height));
                }
                else if (h.column.width.isAuto) {
                    h.element.arrange(new Rect(leftOffset, 0, h.computedColumnWidth, finalSize.height));
                }
                else if (h.column.width.isStar) {
                    h.element.arrange(new Rect(leftOffset, 0, Math.max(0, h.column.width.value / sumOfStars * (finalSize.width - totalWidthOfAutoAndFixedColumns)), finalSize.width));
                }

                leftOffset += h.element.renderSize.width;
            });

            return finalSize;
        }

        layoutOverride() {
            super.layoutOverride();

            this._headers.forEach(h=> h.element.layout());
        }


        onCollectionChanged(collection: any, added: any[], removed: any[], startRemoveIndex: number)
        { }
   }

    export class GridView extends FrameworkElement implements ISupportCollectionChanged {
        static typeName: string = "app.GridView";
        get typeName(): string {
            return GridView.typeName;
        }

        private _divElement: HTMLDivElement;
        private _header: GridViewHeader;
        private _tableElement: HTMLTableElement;
        private _tableContainerElement: HTMLDivElement;
        private _tableFirstRowElement: HTMLTableRowElement;
        private _tableTHead: HTMLTableHeaderCellElement;
        
        attachVisualOverride(elementContainer: HTMLElement) {
            //this is the div that will contain the table
            this._visual = this._divElement = document.createElement("div");

            //this is the header columns stack
            this._header = new GridViewHeader(this);
            this._header.parent = this;
            this._header.attachVisual(this._visual);

            //this is the container of table element
            this._tableContainerElement = document.createElement("div");
            this._tableContainerElement.style.overflow = "auto";
            this._tableContainerElement.style.position = "absolute";
            this._visual.appendChild(this._tableContainerElement);

            super.attachVisualOverride(elementContainer);
        }

        resetTable() {

        }
   
        private _customCells: UIElement[] = [];
        setupTable() {
            if (this.rowsSource == null || this.rowsSource.count == 0 ||
                this.columns == null || this.columns.count == 0)
                return;

            //setup headers
            this._header.setupHeader();

            //setup table
            //this is the table itself
            if (this._tableElement != null) {
                this._tableContainerElement.removeChild(this._tableElement);
            }
            this._tableElement = document.createElement("table");
            this._tableElement.style.tableLayout = "fixed";
            this._tableContainerElement.appendChild(this._tableElement);

            //thead
            var thead = this._tableElement.createTHead();
            this._tableFirstRowElement = document.createElement("tr");
            this.columns.forEach(c=> {
                let th = document.createElement("th");
                this._tableFirstRowElement.appendChild(th);
            });
            thead.appendChild(this._tableFirstRowElement);
            this._tableElement.appendChild(thead);

            
            //the body
            var tbody = document.createElement("tbody");
            this._customCells = [];
            var rowHeight = this.rowHeight;
            this.rowsSource.forEach(row=> {
                let trow = document.createElement("tr");
                trow.style.height = rowHeight + "px";
                trow.style.whiteSpace = "pre";
                this.columns.forEach(c=> {
                    let td = document.createElement("td");
                    let cellTemplate = c.cellTemplate;
                    if (cellTemplate != null) {
                        let cellElement = cellTemplate.createElement();
                        cellElement.parent = this;
                        cellElement.attachVisual(td, true);
                        cellElement.setValue(FrameworkElement.dataContextProperty, row);
                        this._customCells.push(cellElement);
                    }
                    else {
                        td.innerHTML = row[c.name];
                    }
                    trow.appendChild(td);
                });
                tbody.appendChild(trow);
            });
            this._tableElement.appendChild(tbody);
        }

        protected measureOverride(constraint: Size): Size {
            
            if (this.columns != null && this._tableFirstRowElement != null) {
                this.columns.forEach((c,i) => {
                    if (c.width.isAuto) {
                        this._header.headers[i].computedColumnWidth =
                            this._tableFirstRowElement.cells[i].clientWidth;
                    }
                });
            }


            this._header.measure(new Size(Infinity, Infinity));

            if (this._customCells != null)
                this._customCells.forEach(cc=> cc.measure(constraint));//todo measure with column settinsg (auto/fixed/star)

            return new Size(this._header.desideredSize.width, this._header.desideredSize.height);
        }

        protected arrangeOverride(finalSize: Size): Size {

            this._header.arrange(new Rect(0, 0, finalSize.width, Math.min(finalSize.height, this._header.desideredSize.height)));

            var tableHeight = Math.max(0, finalSize.height - this._header.actualHeight);

            this._tableContainerElement.style.top = this._header.actualHeight + "px";
            this._tableContainerElement.style.width = finalSize.width + "px";
            this._tableContainerElement.style.height = (finalSize.height - this._header.actualHeight) + "px";

            if (this._tableFirstRowElement != null && this.columns != null) {
                for (var i = 0; i < this._tableFirstRowElement.children.length; i++) {
                    var child = <HTMLTableHeaderCellElement>this._tableFirstRowElement.children[i];
                    if (!this.columns.at(i).width.isAuto)
                        child.style.width = this._header.headers[i].element.renderSize.width + "px";                    
                }   
            }

            if (this._tableElement != null) {
                this._tableElement.style.height = (this.rowsSource != null ? this.rowsSource.count * this.rowHeight : 0) + "px";
                this._tableElement.style.width = this._header.desideredSize.width + "px";
            }

            var footerMaxHeight = Math.max(0, finalSize.height - this._header.actualHeight - tableHeight);

            return finalSize;
        }

        layoutOverride() {
            super.layoutOverride();

            if (this._header != null)
                this._header.layout();

            this._customCells.forEach(_=> _.layout());
        }

        protected onDependencyPropertyChanged(property: DepProperty, value: any, oldValue: any) {
            if (property == GridView.columnsProperty) {
                if (oldValue != null) {
                    var oldColumns = <ObservableCollection<GridViewColumn>>oldValue;
                    oldColumns.offChangeNotify(this);
                }

                this.setupTable();

                if (value != null) {
                    var newColumns = <ObservableCollection<GridViewColumn>>value;
                    newColumns.onChangeNotify(this);
                }
            }
            else if (property == GridView.rowsSourceProperty) {
                if (oldValue != null) {
                    var oldRows = <ObservableCollection<Object>>oldValue;
                    oldRows.offChangeNotify(this);
                }

                this.setupTable();

                if (value != null) {
                    var newRows = <ObservableCollection<Object>>value;
                    newRows.onChangeNotify(this);
                }
            }


            super.onDependencyPropertyChanged(property, value, oldValue);
        }

        onCollectionChanged(collection: any, added: any[], removed: any[], startRemoveIndex: number)
        { }


        //rowsSource property
        static rowsSourceProperty = DepObject.registerProperty(ItemsControl.typeName, "RowsSource", null, FrameworkPropertyMetadataOptions.AffectsMeasure);
        get rowsSource(): ObservableCollection<Object> {
            return <ObservableCollection<Object>>this.getValue(GridView.rowsSourceProperty);
        }
        set rowsSource(value: ObservableCollection<Object>) {
            this.setValue(GridView.rowsSourceProperty, value);
        }

        //columns property
        static columnsProperty = DepObject.registerProperty(ItemsControl.typeName, "Columns", null, FrameworkPropertyMetadataOptions.AffectsMeasure);
        get columns(): ObservableCollection<GridViewColumn> {
            return <ObservableCollection<GridViewColumn>>this.getValue(GridView.columnsProperty);
        }
        set columns(value: ObservableCollection<GridViewColumn>) {
            this.setValue(GridView.columnsProperty, value);
        }

        //header template property
        static headerTemplateProperty = DepObject.registerProperty(ItemsControl.typeName, "HeaderTemplate", null, FrameworkPropertyMetadataOptions.AffectsArrange);
        get headerTemplate(): DataTemplate {
            return <DataTemplate>this.getValue(GridView.headerTemplateProperty);
        }
        set headerTemplate(value: DataTemplate) {
            this.setValue(GridView.headerTemplateProperty, value);
        }

        //row height property
        static rowHeightProperty = DepObject.registerProperty(ItemsControl.typeName, "RowHeight", 32, FrameworkPropertyMetadataOptions.AffectsMeasure);
        get rowHeight(): number {
            return <number>this.getValue(GridView.rowHeightProperty);
        }
        set rowHeight(value: number) {
            this.setValue(GridView.rowHeightProperty, value);
        }

    }
} 