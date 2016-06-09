var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var layouts;
(function (layouts) {
    var controls;
    (function (controls) {
        var ControlTemplateSelector = (function (_super) {
            __extends(ControlTemplateSelector, _super);
            function ControlTemplateSelector() {
                _super.apply(this, arguments);
            }
            Object.defineProperty(ControlTemplateSelector.prototype, "typeName", {
                get: function () {
                    return ControlTemplateSelector.typeName;
                },
                enumerable: true,
                configurable: true
            });
            ControlTemplateSelector.prototype.attachVisualOverride = function (elementContainer) {
                this._container = elementContainer;
                this.setupItem();
                _super.prototype.attachVisualOverride.call(this, elementContainer);
            };
            ControlTemplateSelector.prototype.setupItem = function () {
                if (this._container == null)
                    return;
                if (this._element != null) {
                    this._element.attachVisual(null);
                    this._element.parent = null;
                }
                if (this._templates == null ||
                    this._templates.count == 0)
                    return;
                var contentSource = this.contentSource;
                if (contentSource != null) {
                    var templateForItem = controls.DataTemplate.getTemplateForItem(this._templates.toArray(), contentSource);
                    if (templateForItem == null) {
                        throw new Error("Unable to find a valid template for item");
                    }
                    this._element = templateForItem.createElement();
                    this._element.setValue(layouts.FrameworkElement.dataContextProperty, contentSource);
                }
                if (this._element != null) {
                    this._element.attachVisual(this._container);
                    this._element.parent = this;
                }
                this.invalidateMeasure();
            };
            ControlTemplateSelector.prototype.measureOverride = function (constraint) {
                var child = this._element;
                if (child != null) {
                    child.measure(constraint);
                    return child.desiredSize;
                }
                return new layouts.Size();
            };
            ControlTemplateSelector.prototype.arrangeOverride = function (finalSize) {
                var child = this._element;
                if (child != null)
                    child.arrange(finalSize.toRect());
                return finalSize;
            };
            ControlTemplateSelector.prototype.layoutOverride = function () {
                _super.prototype.layoutOverride.call(this);
                var child = this._element;
                if (child != null) {
                    var childOffset = this.visualOffset;
                    if (this.relativeOffset != null)
                        childOffset = childOffset.add(this.relativeOffset);
                    child.layout(childOffset);
                }
            };
            ControlTemplateSelector.prototype.onDependencyPropertyChanged = function (property, value, oldValue) {
                if (property == ControlTemplateSelector.contentSourceProperty) {
                    this.setupItem();
                }
                _super.prototype.onDependencyPropertyChanged.call(this, property, value, oldValue);
            };
            Object.defineProperty(ControlTemplateSelector.prototype, "contentSource", {
                get: function () {
                    return this.getValue(ControlTemplateSelector.contentSourceProperty);
                },
                set: function (value) {
                    this.setValue(ControlTemplateSelector.contentSourceProperty, value);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(ControlTemplateSelector.prototype, "templates", {
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
            ControlTemplateSelector.prototype.onCollectionChanged = function (collection, added, removed, startRemoveIndex) {
                if (collection == this._templates) {
                    this.setupItem();
                }
                this.invalidateMeasure();
            };
            ControlTemplateSelector.typeName = "layouts.controls.ControlTemplateSelector";
            ControlTemplateSelector.contentSourceProperty = layouts.DepObject.registerProperty(ControlTemplateSelector.typeName, "ContentSource", null, layouts.FrameworkPropertyMetadataOptions.AffectsMeasure | layouts.FrameworkPropertyMetadataOptions.AffectsRender);
            return ControlTemplateSelector;
        }(layouts.FrameworkElement));
        controls.ControlTemplateSelector = ControlTemplateSelector;
    })(controls = layouts.controls || (layouts.controls = {}));
})(layouts || (layouts = {}));
