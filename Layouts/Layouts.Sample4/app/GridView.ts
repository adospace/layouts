/// <reference path="..\Scripts\typings\jquery.dataTables\jquery.dataTables-1.9.4.d.ts" /> 


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
    }

    export class GridView extends FrameworkElement implements ISupportCollectionChanged {
        static typeName: string = "app.GridView";
        get typeName(): string {
            return GridView.typeName;
        }


        attachVisualOverride(elementContainer: HTMLElement) {
            //this is the div that will contain the table
            this._visual = this._tableContainer = document.createElement("div");

            super.attachVisualOverride(elementContainer);
        }

        resetTable() {

        }
   
        private _tableContainer: HTMLDivElement;
        private _tableElement: HTMLTableElement;
        private _tableHeader: HTMLTableSectionElement;
        private _tableHeaderRow: HTMLTableRowElement;
        private _dataTable: DataTables.DataTable;

        private _customCells: UIElement[] = [];
        setupTable() {
            if (this.rowsSource == null || this.rowsSource.count == 0 ||
                this.columns == null || this.columns.count == 0)
                return;

            //clear table
            if (this._tableElement != null) {
                this._tableContainer.removeChild(this._tableElement);
                this._tableElement = null;
            }

            this._tableElement = document.createElement("table");
            this._tableElement.className = "display nowrap";
            this._tableElement.cellSpacing = "0";
            //this._tableElement.width = "100%";

            //setup table

            //setup headers
            var columnHeaderTemplate = this.headerTemplate;
            this._tableHeader = document.createElement("thead");
            this._tableHeaderRow = document.createElement("tr");

            this.columns.forEach(c=> {
                let headerCell = document.createElement("th");
                var headerTemplate = c.headerTemplate == null ? columnHeaderTemplate : c.headerTemplate;
                if (headerTemplate != null) {
                    var columnHeader = headerTemplate.createElement();
                    columnHeader.setValue(FrameworkElement.dataContextProperty, c);
                    columnHeader.parent = this;
                    columnHeader.attachVisual(headerCell);
                }
                else {
                    headerCell.innerHTML = c.title;
                }
                this._tableHeaderRow.appendChild(headerCell);
            });

            this._tableHeader.appendChild(this._tableHeaderRow);
            this._tableElement.appendChild(this._tableHeader);

          
            //the body
            var tbody = document.createElement("tbody");
            this._customCells = [];
            var rowHeight = this.rowHeight;
            this.rowsSource.forEach(row=> {
                let trow = document.createElement("tr");
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

            this._tableContainer.appendChild(this._tableElement);


            this._dataTable = $(this._tableElement).dataTable();
            
        }

        protected measureOverride(constraint: Size): Size {

            return new Size();
        }

        protected arrangeOverride(finalSize: Size): Size {

            if (this._tableElement != null) {
                this._tableContainer.style.height = finalSize.height + "px";
                this._tableContainer.style.width = finalSize.width + "px";
            }

            return finalSize;
        }

        layoutOverride() {
            super.layoutOverride();
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