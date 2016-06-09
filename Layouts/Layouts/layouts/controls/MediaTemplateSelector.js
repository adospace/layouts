var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var layouts;
(function (layouts) {
    var controls;
    (function (controls) {
        var MediaTemplateSelector = (function (_super) {
            __extends(MediaTemplateSelector, _super);
            function MediaTemplateSelector() {
                _super.apply(this, arguments);
            }
            Object.defineProperty(MediaTemplateSelector.prototype, "typeName", {
                get: function () {
                    return MediaTemplateSelector.typeName;
                },
                enumerable: true,
                configurable: true
            });
            MediaTemplateSelector.prototype.attachVisualOverride = function (elementContainer) {
                this._container = elementContainer;
                this.setupItem();
                _super.prototype.attachVisualOverride.call(this, elementContainer);
            };
            MediaTemplateSelector.prototype.setupItem = function () {
                if (this._container == null)
                    return;
                if (this._element != null) {
                    this._element.attachVisual(null);
                    this._element.parent = null;
                }
                if (this._templates == null ||
                    this._templates.count == 0)
                    return;
                var templateForItem = controls.DataTemplate.getTemplateForMedia(this._templates.toArray());
                if (templateForItem == null) {
                    throw new Error("Unable to find a valid template for this media");
                }
                this._element = templateForItem.createElement();
                if (this._element != null) {
                    this._element.attachVisual(this._container);
                    this._element.parent = this;
                }
                this.invalidateMeasure();
            };
            MediaTemplateSelector.prototype.measureOverride = function (constraint) {
                var child = this._element;
                if (child != null) {
                    child.measure(constraint);
                    return child.desiredSize;
                }
                return new layouts.Size();
            };
            MediaTemplateSelector.prototype.arrangeOverride = function (finalSize) {
                var child = this._element;
                if (child != null)
                    child.arrange(finalSize.toRect());
                return finalSize;
            };
            MediaTemplateSelector.prototype.layoutOverride = function () {
                _super.prototype.layoutOverride.call(this);
                var child = this._element;
                if (child != null) {
                    var childOffset = this.visualOffset;
                    if (this.relativeOffset != null)
                        childOffset = childOffset.add(this.relativeOffset);
                    child.layout(childOffset);
                }
            };
            Object.defineProperty(MediaTemplateSelector.prototype, "templates", {
                get: function () {
                    return this._templates;
                },
                set: function (value) {
                    this._templates = value;
                },
                enumerable: true,
                configurable: true
            });
            MediaTemplateSelector.typeName = "layouts.controls.MediaTemplateSelector";
            return MediaTemplateSelector;
        }(layouts.FrameworkElement));
        controls.MediaTemplateSelector = MediaTemplateSelector;
    })(controls = layouts.controls || (layouts.controls = {}));
})(layouts || (layouts = {}));
