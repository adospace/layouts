

module layouts.controls {
    export class ComboBox extends FrameworkElement implements ISupportCollectionChanged {
        static typeName: string = "layouts.controls.ComboBox";
        get typeName(): string {
            return ComboBox.typeName;
        }


        private _selectElement: HTMLSelectElement;
        private _elements: any[];

        attachVisualOverride(elementContainer: HTMLElement) {

            this._visual = this._selectElement = document.createElement("select");

            this._selectElement.onchange = (ev) => this.onSelectionChanged();

            this.setupItems();

            super.attachVisualOverride(elementContainer);
        }

        onSelectionChanged() {
            if (this._selectElement.selectedIndex == -1) {
                this.selectItem(null);
            }
            else if (this._elements != null) {
                this.selectItem(this._elements[this._selectElement.selectedIndex]);
            }
        }

        protected arrangeOverride(finalSize: Size): Size {
            this._visual.style.width = finalSize.width + "px";
            this._visual.style.height = finalSize.height + "px";

            return finalSize;
        }

        private selectItem(item: any) {
            this.selectedItem = item;
            if (this.selectMember != null)
                this.selectedValue = item[this.selectMember];
        }

        protected onDependencyPropertyChanged(property: DepProperty, value: any, oldValue: any) {
            if (property == ComboBox.itemsSourceProperty) {
                if (oldValue != null && oldValue["offChangeNotify"] != null) {
                    var oldItmesSource = <ObservableCollection<Object>>oldValue;
                    oldItmesSource.offChangeNotify(this);
                }

                this.setupItems();

                if (value != null && value["onChangeNotify"] != null) {
                    var newItemsSource = <ObservableCollection<Object>>value;
                    newItemsSource.onChangeNotify(this);
                }
            }
            else if (property == ComboBox.selectedItemProperty) {
                if (this._selectElement != null && this._elements != null)
                    this._selectElement.selectedIndex = value == null ? -1 : this._elements.indexOf(value);
            }
            else if (property == ComboBox.selectedValueProperty) {
                if (this._selectElement != null && this.selectMember != null && this._elements != null)
                    this.selectedItem = Enumerable.From(this._elements).FirstOrDefault(null, _=> _[this.selectMember] == value);
            }

            super.onDependencyPropertyChanged(property, value, oldValue);
        }

        private setupItems() {

            var selectElement = this._selectElement;
            if (selectElement == null)
                return;

            while (selectElement.children.length > 0)
                selectElement.removeChild(selectElement.firstElementChild);

            var displayMember = this.displayMember;
            var itemsSource = this.itemsSource;
            if (itemsSource != null) {

                var elements: any[] = null;
                if (Object.prototype.toString.call(itemsSource) == '[object Array]')
                    elements = <any[]>itemsSource;
                else
                    elements = <any[]>itemsSource["elements"];

                if (elements == null)
                    throw new Error("Unable to get list of elements from itemsSource");

                elements.forEach(el=> {
                    var option = document.createElement("option");
                    option.innerHTML = (displayMember != null) ? el[displayMember] : el;
                    selectElement.appendChild(option);
                });
                //point local _elements variable to itemsource cast
                this._elements = elements;
                var selectedItem = this.selectedItem;
                if (this.selectMember != null) {
                    var selectedValue = this.selectedValue;
                    selectedItem = Enumerable.From(this._elements).FirstOrDefault(null, _=> _[this.selectMember] == selectedValue);
                }

                this._selectElement.selectedIndex = selectedItem == null ? -1 : this._elements.indexOf(selectedItem);
            }

            this.invalidateMeasure();
        }

        onCollectionChanged(collection: any, added: Object[], removed: Object[], startRemoveIndex: number) {
            var selectElement = this._selectElement;
            if (selectElement == null)
                return;

            var displayMember = this.displayMember;

            if (collection == this.itemsSource) {
                //some items were added/removed from itemssouurce
                added.forEach(item=> {
                    var option = document.createElement("option");
                    option.innerHTML = (displayMember != null) ? item[displayMember] : item;
                    selectElement.appendChild(option);
                });

                removed.forEach(item=> {
                    var elementToRemove = selectElement.children[startRemoveIndex];
                    var noneWasSelected = selectElement.selectedIndex == -1;
                    selectElement.removeChild(elementToRemove);
                    if (noneWasSelected)
                        //removeChild reset selected index to 0 if no item was selected, so restore previous selected index
                        selectElement.selectedIndex = -1;

                    if (item == this.selectedItem)
                        this.selectedItem = this.selectedValue = null;
                    startRemoveIndex++;
                });
            }

            this.invalidateMeasure();
        }


        //itemsSource property
        static itemsSourceProperty = DepObject.registerProperty(ComboBox.typeName, "ItemsSource", null, FrameworkPropertyMetadataOptions.AffectsMeasure | FrameworkPropertyMetadataOptions.AffectsRender);
        get itemsSource(): any {
            return <any>this.getValue(ComboBox.itemsSourceProperty);
        }
        set itemsSource(value: any) {
            this.setValue(ComboBox.itemsSourceProperty, value);
        }

        //selectedItem property
        static selectedItemProperty = DepObject.registerProperty(ComboBox.typeName, "SelectedItem", null, FrameworkPropertyMetadataOptions.AffectsMeasure | FrameworkPropertyMetadataOptions.AffectsRender);
        get selectedItem(): any {
            return <any>this.getValue(ComboBox.selectedItemProperty);
        }
        set selectedItem(value: any) {
            this.setValue(ComboBox.selectedItemProperty, value);
        }
        
        //displayMember property
        static displayMemberProperty = DepObject.registerProperty(ComboBox.typeName, "DisplayMember", null, FrameworkPropertyMetadataOptions.AffectsMeasure | FrameworkPropertyMetadataOptions.AffectsRender);
        get displayMember(): string {
            return <string>this.getValue(ComboBox.displayMemberProperty);
        }
        set displayMember(value: string) {
            this.setValue(ComboBox.displayMemberProperty, value);
        }

        //selectValue property
        static selectedValueProperty = DepObject.registerProperty(ComboBox.typeName, "SelectedValue", null, FrameworkPropertyMetadataOptions.AffectsMeasure | FrameworkPropertyMetadataOptions.AffectsRender);
        get selectedValue(): any {
            return <any>this.getValue(ComboBox.selectedValueProperty);
        }
        set selectedValue(value: any) {
            this.setValue(ComboBox.selectedValueProperty, value);
        }

        //selectMember property
        static selectMemberProperty = DepObject.registerProperty(ComboBox.typeName, "SelectMember", null, FrameworkPropertyMetadataOptions.AffectsMeasure | FrameworkPropertyMetadataOptions.AffectsRender);
        get selectMember(): string {
            return <string>this.getValue(ComboBox.selectMemberProperty);
        }
        set selectMember(value: string) {
            this.setValue(ComboBox.selectMemberProperty, value);
        }
    }
}  

