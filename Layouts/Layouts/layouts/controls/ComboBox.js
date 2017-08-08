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
        var ComboBox = (function (_super) {
            __extends(ComboBox, _super);
            function ComboBox() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            Object.defineProperty(ComboBox.prototype, "typeName", {
                get: function () {
                    return ComboBox.typeName;
                },
                enumerable: true,
                configurable: true
            });
            ComboBox.prototype.attachVisualOverride = function (elementContainer) {
                var _this = this;
                this._visual = this._selectElement = document.createElement("select");
                this._selectElement.onchange = function (ev) { return _this.onSelectionChanged(); };
                this.setupItems();
                _super.prototype.attachVisualOverride.call(this, elementContainer);
            };
            ComboBox.prototype.onSelectionChanged = function () {
                if (this._selectElement.selectedIndex == -1) {
                    this.selectItem(null);
                }
                else if (this._elements != null) {
                    this.selectItem(this._elements[this._selectElement.selectedIndex]);
                }
            };
            ComboBox.prototype.arrangeOverride = function (finalSize) {
                this._visual.style.width = finalSize.width + "px";
                this._visual.style.height = finalSize.height + "px";
                return finalSize;
            };
            ComboBox.prototype.selectItem = function (item) {
                this.selectedItem = item;
                if (this.selectMember != null)
                    this.selectedValue = item[this.selectMember];
            };
            ComboBox.prototype.onDependencyPropertyChanged = function (property, value, oldValue) {
                var _this = this;
                if (property == ComboBox.itemsSourceProperty) {
                    if (oldValue != null && oldValue["offChangeNotify"] != null) {
                        var oldItmesSource = oldValue;
                        oldItmesSource.offChangeNotify(this);
                    }
                    this.setupItems();
                    if (value != null && value["onChangeNotify"] != null) {
                        var newItemsSource = value;
                        newItemsSource.onChangeNotify(this);
                    }
                }
                else if (property == ComboBox.selectedItemProperty) {
                    if (this._selectElement != null && this._elements != null)
                        this._selectElement.selectedIndex = value == null ? -1 : this._elements.indexOf(value);
                }
                else if (property == ComboBox.selectedValueProperty) {
                    if (this._selectElement != null && this.selectMember != null && this._elements != null)
                        this.selectedItem = this._elements.firstOrDefault(function (_) { return _[_this.selectMember] == value; }, null);
                }
                _super.prototype.onDependencyPropertyChanged.call(this, property, value, oldValue);
            };
            ComboBox.prototype.setupItems = function () {
                var _this = this;
                var selectElement = this._selectElement;
                if (selectElement == null)
                    return;
                while (selectElement.children.length > 0)
                    selectElement.removeChild(selectElement.firstElementChild);
                var displayMember = this.displayMember;
                var itemsSource = this.itemsSource;
                if (itemsSource != null) {
                    var elements = null;
                    if (Object.prototype.toString.call(itemsSource) == '[object Array]')
                        elements = itemsSource;
                    else
                        elements = itemsSource["elements"];
                    if (elements == null)
                        throw new Error("Unable to get list of elements from itemsSource");
                    elements.forEach(function (el) {
                        var option = document.createElement("option");
                        option.innerHTML = (displayMember != null) ? el[displayMember] : el;
                        selectElement.appendChild(option);
                    });
                    this._elements = elements;
                    var selectedItem = this.selectedItem;
                    if (this.selectMember != null) {
                        var selectedValue = this.selectedValue;
                        selectedItem = this._elements.firstOrDefault(function (_) { return _[_this.selectMember] == selectedValue; }, null);
                    }
                    this._selectElement.selectedIndex = selectedItem == null ? -1 : this._elements.indexOf(selectedItem);
                }
                this.invalidateMeasure();
            };
            ComboBox.prototype.onCollectionChanged = function (collection, added, removed, startRemoveIndex) {
                var _this = this;
                var selectElement = this._selectElement;
                if (selectElement == null)
                    return;
                var displayMember = this.displayMember;
                if (collection == this.itemsSource) {
                    added.forEach(function (item) {
                        var option = document.createElement("option");
                        option.innerHTML = (displayMember != null) ? item[displayMember] : item;
                        selectElement.appendChild(option);
                    });
                    removed.forEach(function (item) {
                        var elementToRemove = selectElement.children[startRemoveIndex];
                        var noneWasSelected = selectElement.selectedIndex == -1;
                        selectElement.removeChild(elementToRemove);
                        if (noneWasSelected)
                            selectElement.selectedIndex = -1;
                        if (item == _this.selectedItem)
                            _this.selectedItem = _this.selectedValue = null;
                        startRemoveIndex++;
                    });
                }
                this.invalidateMeasure();
            };
            Object.defineProperty(ComboBox.prototype, "itemsSource", {
                get: function () {
                    return this.getValue(ComboBox.itemsSourceProperty);
                },
                set: function (value) {
                    this.setValue(ComboBox.itemsSourceProperty, value);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(ComboBox.prototype, "selectedItem", {
                get: function () {
                    return this.getValue(ComboBox.selectedItemProperty);
                },
                set: function (value) {
                    this.setValue(ComboBox.selectedItemProperty, value);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(ComboBox.prototype, "displayMember", {
                get: function () {
                    return this.getValue(ComboBox.displayMemberProperty);
                },
                set: function (value) {
                    this.setValue(ComboBox.displayMemberProperty, value);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(ComboBox.prototype, "selectedValue", {
                get: function () {
                    return this.getValue(ComboBox.selectedValueProperty);
                },
                set: function (value) {
                    this.setValue(ComboBox.selectedValueProperty, value);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(ComboBox.prototype, "selectMember", {
                get: function () {
                    return this.getValue(ComboBox.selectMemberProperty);
                },
                set: function (value) {
                    this.setValue(ComboBox.selectMemberProperty, value);
                },
                enumerable: true,
                configurable: true
            });
            return ComboBox;
        }(layouts.FrameworkElement));
        ComboBox.typeName = "layouts.controls.ComboBox";
        ComboBox.itemsSourceProperty = layouts.DepObject.registerProperty(ComboBox.typeName, "ItemsSource", null, layouts.FrameworkPropertyMetadataOptions.AffectsMeasure | layouts.FrameworkPropertyMetadataOptions.AffectsRender);
        ComboBox.selectedItemProperty = layouts.DepObject.registerProperty(ComboBox.typeName, "SelectedItem", null, layouts.FrameworkPropertyMetadataOptions.AffectsMeasure | layouts.FrameworkPropertyMetadataOptions.AffectsRender);
        ComboBox.displayMemberProperty = layouts.DepObject.registerProperty(ComboBox.typeName, "DisplayMember", null, layouts.FrameworkPropertyMetadataOptions.AffectsMeasure | layouts.FrameworkPropertyMetadataOptions.AffectsRender);
        ComboBox.selectedValueProperty = layouts.DepObject.registerProperty(ComboBox.typeName, "SelectedValue", null, layouts.FrameworkPropertyMetadataOptions.AffectsMeasure | layouts.FrameworkPropertyMetadataOptions.AffectsRender);
        ComboBox.selectMemberProperty = layouts.DepObject.registerProperty(ComboBox.typeName, "SelectMember", null, layouts.FrameworkPropertyMetadataOptions.AffectsMeasure | layouts.FrameworkPropertyMetadataOptions.AffectsRender);
        controls.ComboBox = ComboBox;
    })(controls = layouts.controls || (layouts.controls = {}));
})(layouts || (layouts = {}));
