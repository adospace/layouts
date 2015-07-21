/// <reference path="..\DepProperty.ts" />
/// <reference path="..\DepObject.ts" />
/// <reference path="..\FrameworkElement.ts" /> 
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var tsui;
(function (tsui) {
    var controls;
    (function (controls) {
        var Panel = (function (_super) {
            __extends(Panel, _super);
            function Panel() {
                _super.apply(this, arguments);
            }
            Object.defineProperty(Panel.prototype, "children", {
                get: function () {
                    if (this._children == null) {
                        this._children = new tsui.ObservableCollection();
                        var self = this;
                        this._children.on(function (c, added, removed) {
                            removed.forEach(function (el) {
                                if (el.parent == self)
                                    el.parent = null;
                            });
                            added.forEach(function (el) {
                                el.parent = self;
                                if (self._divElement != null)
                                    el.attachVisual(self._divElement);
                            });
                            self.invalidateMeasure();
                        });
                    }
                    return this._children;
                },
                enumerable: true,
                configurable: true
            });
            Panel.prototype.layoutOverride = function () {
                _super.prototype.layoutOverride.call(this);
                var background = this.background;
                if (this._visual.style.background != background)
                    this._visual.style.background = background;
                this._children.forEach(function (child) { return child.layout(); });
            };
            Panel.prototype.attachVisualOverride = function (elementContainer) {
                this._visual = this._divElement = document.createElement("div");
                var self = this;
                this._children.forEach(function (child) { return child.attachVisual(self._divElement); });
                _super.prototype.attachVisualOverride.call(this, elementContainer);
            };
            Object.defineProperty(Panel.prototype, "background", {
                get: function () {
                    return _super.prototype.getValue.call(this, Panel.backgroundProperty);
                },
                set: function (value) {
                    _super.prototype.setValue.call(this, Panel.backgroundProperty, value);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Panel.prototype, "isItemsHost", {
                get: function () {
                    return _super.prototype.getValue.call(this, Panel.isItemsHostProperty);
                },
                set: function (value) {
                    _super.prototype.setValue.call(this, Panel.isItemsHostProperty, value);
                },
                enumerable: true,
                configurable: true
            });
            Panel.backgroundProperty = (new Panel()).registerProperty("Background", null, 16 /* AffectsRender */);
            Panel.isItemsHostProperty = (new Panel()).registerProperty("IsItemsHost", false, 128 /* NotDataBindable */);
            return Panel;
        })(tsui.FrameworkElement);
        controls.Panel = Panel;
    })(controls = tsui.controls || (tsui.controls = {}));
})(tsui || (tsui = {}));
//# sourceMappingURL=Panel.js.map