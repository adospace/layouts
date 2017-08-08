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
        var ItemsControl = (function (_super) {
            __extends(ItemsControl, _super);
            function ItemsControl() {
                var _this = _super !== null && _super.apply(this, arguments) || this;
                _this._elements = null;
                return _this;
            }
            Object.defineProperty(ItemsControl.prototype, "typeName", {
                get: function () {
                    return ItemsControl.typeName;
                },
                enumerable: true,
                configurable: true
            });
            ItemsControl.initProperties = function () {
                layouts.FrameworkElement.overflowYProperty.overrideDefaultValue(ItemsControl.typeName, "auto");
            };
            ItemsControl.prototype.attachVisualOverride = function (elementContainer) {
                this._visual = this._divElement = document.createElement("div");
                var itemsPanel = this.itemsPanel;
                if (itemsPanel == null)
                    this.itemsPanel = itemsPanel = new controls.Stack();
                itemsPanel.attachVisual(this._visual);
                _super.prototype.attachVisualOverride.call(this, elementContainer);
            };
            ItemsControl.prototype.measureOverride = function (constraint) {
                if (this.itemsPanel != null) {
                    this.itemsPanel.measure(constraint);
                    return this.itemsPanel.desiredSize;
                }
                return new layouts.Size();
            };
            ItemsControl.prototype.arrangeOverride = function (finalSize) {
                if (this.itemsPanel != null)
                    this.itemsPanel.arrange(finalSize.toRect());
                return finalSize;
            };
            ItemsControl.prototype.layoutOverride = function () {
                _super.prototype.layoutOverride.call(this);
                if (this.itemsPanel != null)
                    this.itemsPanel.layout();
            };
            Object.defineProperty(ItemsControl.prototype, "templates", {
                get: function () {
                    return this._templates;
                },
                set: function (value) {
                    if (value == this._templates)
                        return;
                    if (this._templates != null) {
                        this._templates.offChangeNotify(this);
                    }
                    this._templates = value;
                    if (this._templates != null) {
                        this._templates.forEach(function (el) {
                        });
                        this._templates.onChangeNotify(this);
                    }
                },
                enumerable: true,
                configurable: true
            });
            ItemsControl.prototype.onCollectionChanged = function (collection, added, removed, startRemoveIndex) {
                var _this = this;
                if (collection == this._templates) {
                    this.setupItems();
                }
                else if (collection == this.itemsSource) {
                    if (this.itemsPanel == null)
                        return;
                    added.forEach(function (item) {
                        if (item == null)
                            throw new Error("Unable to render null items");
                        var templateForItem = controls.DataTemplate.getTemplateForItem(_this._templates.toArray(), item);
                        if (templateForItem == null) {
                            throw new Error("Unable to find a valid template for item");
                        }
                        var newElement = templateForItem.createElement();
                        newElement.setValue(layouts.FrameworkElement.dataContextProperty, item);
                        _this.itemsPanel.children.add(newElement);
                    });
                    removed.forEach(function (item) {
                        _this.itemsPanel.children.remove(_this.itemsPanel.children.at(startRemoveIndex++));
                    });
                }
                this.invalidateMeasure();
            };
            Object.defineProperty(ItemsControl.prototype, "itemsSource", {
                get: function () {
                    return this.getValue(ItemsControl.itemsSourceProperty);
                },
                set: function (value) {
                    this.setValue(ItemsControl.itemsSourceProperty, value);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(ItemsControl.prototype, "itemsPanel", {
                get: function () {
                    return this.getValue(ItemsControl.itemsPanelProperty);
                },
                set: function (value) {
                    this.setValue(ItemsControl.itemsPanelProperty, value);
                },
                enumerable: true,
                configurable: true
            });
            ItemsControl.prototype.onDependencyPropertyChanged = function (property, value, oldValue) {
                if (property == ItemsControl.itemsSourceProperty) {
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
                else if (property == ItemsControl.itemsPanelProperty) {
                    var oldPanel = oldValue;
                    if (oldPanel != null && oldPanel.parent == this) {
                        oldPanel.children = null;
                        oldPanel.parent = null;
                        oldPanel.attachVisual(null);
                    }
                    var newPanel = value;
                    if (newPanel != null) {
                        newPanel.parent = this;
                        if (this._visual != null)
                            newPanel.attachVisual(this._visual);
                    }
                }
                else if (property == ItemsControl.itemsPanelProperty)
                    this.setupItems();
                _super.prototype.onDependencyPropertyChanged.call(this, property, value, oldValue);
            };
            ItemsControl.prototype.setupItems = function () {
                var _this = this;
                if (this._elements != null) {
                    this.itemsPanel.children = null;
                    this._elements = null;
                }
                if (this._templates == null ||
                    this._templates.count == 0)
                    return;
                var itemsSource = this.itemsSource;
                if (itemsSource != null) {
                    var elements = null;
                    if (Object.prototype.toString.call(itemsSource) == '[object Array]')
                        elements = itemsSource;
                    else
                        elements = itemsSource["elements"];
                    if (elements == null)
                        throw new Error("Unable to get list of elements from itemsSource");
                    this._elements =
                        elements.map(function (item) {
                            var templateForItem = controls.DataTemplate.getTemplateForItem(_this._templates.toArray(), item);
                            if (templateForItem == null) {
                                throw new Error("Unable to find a valid template for item");
                            }
                            var newElement = templateForItem.createElement();
                            newElement.setValue(layouts.FrameworkElement.dataContextProperty, item);
                            return newElement;
                        });
                }
                if (this._elements != null) {
                    if (this.itemsPanel == null) {
                        this.itemsPanel = new controls.Stack();
                        this.itemsPanel.parent = this;
                        if (this._visual != null)
                            this.itemsPanel.attachVisual(this._visual);
                    }
                    this.itemsPanel.children = new layouts.ObservableCollection(this._elements);
                }
                this.invalidateMeasure();
            };
            return ItemsControl;
        }(layouts.FrameworkElement));
        ItemsControl.typeName = "layouts.controls.ItemsControl";
        ItemsControl._init = ItemsControl.initProperties();
        ItemsControl.itemsSourceProperty = layouts.DepObject.registerProperty(ItemsControl.typeName, "ItemsSource", null, layouts.FrameworkPropertyMetadataOptions.AffectsMeasure | layouts.FrameworkPropertyMetadataOptions.AffectsRender);
        ItemsControl.itemsPanelProperty = layouts.DepObject.registerProperty(ItemsControl.typeName, "ItemsPanel", null, layouts.FrameworkPropertyMetadataOptions.AffectsMeasure | layouts.FrameworkPropertyMetadataOptions.AffectsRender);
        controls.ItemsControl = ItemsControl;
    })(controls = layouts.controls || (layouts.controls = {}));
})(layouts || (layouts = {}));
