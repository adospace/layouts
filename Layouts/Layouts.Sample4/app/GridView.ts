
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
        //private static _defaultCellTemplate: DataTemplate;
        get cellTemplate(): DataTemplate {
            //if (this._cellTemplate == null) {
            //    if (GridViewColumn._defaultCellTemplate == null) {
            //        GridViewColumn._defaultCellTemplate = new DataTemplate();
            //        GridViewColumn._defaultCellTemplate.setInnerXaml("<TextBlock Text='{{0}}'/>".format(this.name));
            //    }
            //    return GridViewColumn._defaultCellTemplate;
            //}
            return this._cellTemplate;
        }
        set cellTemplate(value: DataTemplate) {
            if (this._cellTemplate != value) {
                var oldValue = this._cellTemplate;
                this._cellTemplate = value;
                this.onPropertyChanged("cellTemplate", value, oldValue);
            }
        }
    }

    class GridViewHeader extends DepObject {
        static typeName: string = "app.GridViewHeader";
        get typeName(): string {
            return GridViewHeader.typeName;
        }

        constructor(public column: GridViewColumn, public element: HTMLDivElement) {
            super();
        }

    }

    export class GridView extends FrameworkElement implements ISupportCollectionChanged {
        static typeName: string = "app.GridView";
        get typeName(): string {
            return GridView.typeName;
        }

        private _divElement: HTMLDivElement;
        private _header: Stack;
        private _tableElement: HTMLTableElement;
        private _tableContainerElement: HTMLDivElement;
        private _footer: Stack;

        attachVisualOverride(elementContainer: HTMLElement) {
            //this is the div that will contain the table
            this._visual = this._divElement = document.createElement("div");

            //this is the header columns stack
            this._header = new Stack();
            this._header.orientation = Orientation.Horizontal;
            this._header.parent = this;
            this._header.attachVisual(this._visual);

            //this is the container of table element
            this._tableContainerElement = document.createElement("div");
            this._tableContainerElement.style.overflow = "auto";
            this._tableContainerElement.style.position = "absolute";
            this._visual.appendChild(this._tableContainerElement);

            //this is the footer element
            this._footer = new Stack();
            this._footer.parent = this;
            this._footer.attachVisual(this._visual);

            super.attachVisualOverride(elementContainer);
        }

        resetTable() {

        }
   
        private _headers: UIElement[] = [];
        private _customCells: UIElement[] = [];
        setupTable() {
            if (this.rowsSource == null || this.rowsSource.count == 0 ||
                this.columns == null || this.columns.count == 0)
                return;

            //setup headers
            var columnHeaderTemplate = this.headerTemplate;
            if (columnHeaderTemplate == null) {
                columnHeaderTemplate = new DataTemplate();
                columnHeaderTemplate.setInnerXaml("<TextBlock Text='{title}'/>");
            }
            this._headers = [];
            this.columns.forEach(c=> {
                var headerTemplate = c.headerTemplate == null ? columnHeaderTemplate : c.headerTemplate;
                var columnHeader = headerTemplate.createElement();
                columnHeader.setValue(FrameworkElement.dataContextProperty, c);
                this._headers.push(columnHeader);
            });

            this._header.children = new ObservableCollection<UIElement>(this._headers);

            //setup table
            //this is the table itself
            if (this._tableElement != null) {
                this._tableContainerElement.removeChild(this._tableElement);
            }
            this._tableElement = document.createElement("table");
            this._tableContainerElement.appendChild(this._tableElement);
            
            //the body
            var tbody = document.createElement("tbody");
            this._customCells = [];
            var rowHeight = this.rowHeight;
            this.rowsSource.forEach(row=> {
                let trow = document.createElement("tr");
                trow.style.height = rowHeight + "px";
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

            //footer todo
        }

        protected measureOverride(constraint: Size): Size {
            
            this._header.measure(new Size(Infinity, Infinity));
            this._footer.measure(new Size(Infinity, Infinity));

            if (this._customCells != null)
                this._customCells.forEach(cc=> cc.measure(constraint));//todo measure with column settinsg (auto/fixed/star)

            return new Size(this._header.desideredSize.width, this._header.desideredSize.height);
        }

        protected arrangeOverride(finalSize: Size): Size {

            this._header.arrange(new Rect(0, 0, finalSize.width, Math.min(finalSize.height, this._header.desideredSize.height)));

            var tableHeight = Math.max(0, finalSize.height - this._header.actualHeight);

            this._tableContainerElement.style.top = this._header.actualHeight + "px";
            this._tableContainerElement.style.width = finalSize.width + "px";
            this._tableContainerElement.style.height = finalSize.height + "px";

            if (this._tableElement != null) {
                this._tableElement.style.height = (this.rowsSource != null ? this.rowsSource.count * this.rowHeight : 0) + "px";
                this._tableElement.style.width = this._header.desideredSize.width + "px";
            }

            var footerMaxHeight = Math.max(0, finalSize.height - this._header.actualHeight - tableHeight);
            this._footer.arrange(new Rect(0, this._header.actualHeight + tableHeight, Math.min(footerMaxHeight, this._footer.desideredSize.height)));

            return finalSize;
        }

        layoutOverride() {
            super.layoutOverride();

            if (this._header != null)
                this._header.layout();

            if (this._footer != null)
                this._footer.layout();

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