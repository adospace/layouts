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
        var Panel = (function (_super) {
            __extends(Panel, _super);
            function Panel() {
                var _this = _super !== null && _super.apply(this, arguments) || this;
                _this.virtualItemCount = 0;
                _this.virtualOffset = null;
                return _this;
            }
            Object.defineProperty(Panel.prototype, "typeName", {
                get: function () {
                    return Panel.typeName;
                },
                enumerable: true,
                configurable: true
            });
            Panel.prototype.attachVisualOverride = function (elementContainer) {
                var _this = this;
                this._visual = this._divElement = document.createElement("div");
                if (this.children != null)
                    this.children.forEach(function (child) { return child.attachVisual(_this._divElement); });
                _super.prototype.attachVisualOverride.call(this, elementContainer);
            };
            Object.defineProperty(Panel.prototype, "children", {
                get: function () {
                    return this._children;
                },
                set: function (value) {
                    var _this = this;
                    if (value == this._children)
                        return;
                    if (this._children != null) {
                        this._children.forEach(function (el) {
                            if (el.parent == _this) {
                                el.parent = null;
                                el.attachVisual(null);
                            }
                        });
                        this._children.offChangeNotify(this);
                    }
                    this._children = value;
                    if (this._children != null) {
                        this._children.forEach(function (el) {
                            if (el.parent != null) {
                                throw new Error("Element already child of another element, please remove it first from previous container");
                            }
                            el.parent = _this;
                            if (_this._visual != null)
                                el.attachVisual(_this._visual);
                        });
                        this._children.onChangeNotify(this);
                    }
                    this.invalidateMeasure();
                },
                enumerable: true,
                configurable: true
            });
            Panel.prototype.onCollectionChanged = function (collection, added, removed, startRemoveIndex) {
                var _this = this;
                removed.forEach(function (el) {
                    var element = el;
                    if (element.parent == _this) {
                        element.parent = null;
                        element.attachVisual(null);
                    }
                });
                added.forEach(function (el) {
                    var element = el;
                    element.parent = _this;
                    if (_this._visual != null)
                        element.attachVisual(_this._visual);
                });
                this.invalidateMeasure();
            };
            Panel.prototype.layoutOverride = function () {
                _super.prototype.layoutOverride.call(this);
                var background = this.background;
                if (this._visual.style.background != background)
                    this._visual.style.background = background;
                if (this._children != null)
                    this._children.forEach(function (child) { return child.layout(); });
            };
            Object.defineProperty(Panel.prototype, "background", {
                get: function () {
                    return this.getValue(Panel.backgroundProperty);
                },
                set: function (value) {
                    this.setValue(Panel.backgroundProperty, value);
                },
                enumerable: true,
                configurable: true
            });
            return Panel;
        }(layouts.FrameworkElement));
        Panel.typeName = "layouts.controls.Panel";
        Panel.backgroundProperty = layouts.DepObject.registerProperty(Panel.typeName, "Background", null, layouts.FrameworkPropertyMetadataOptions.AffectsRender);
        controls.Panel = Panel;
    })(controls = layouts.controls || (layouts.controls = {}));
})(layouts || (layouts = {}));
