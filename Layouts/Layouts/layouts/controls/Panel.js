/// <reference path="..\DepProperty.ts" />
/// <reference path="..\DepObject.ts" />
/// <reference path="..\FrameworkElement.ts" /> 
/// <reference path="..\ISupport.ts" /> 
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var layouts;
(function (layouts) {
    var controls;
    (function (controls) {
        var Panel = (function (_super) {
            __extends(Panel, _super);
            function Panel() {
                _super.apply(this, arguments);
            }
            Object.defineProperty(Panel.prototype, "typeName", {
                get: function () {
                    return Panel.typeName;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Panel.prototype, "children", {
                get: function () {
                    //if (this._children == null) {
                    //    this._children = new ObservableCollection<UIElement>();
                    //    this._children.on(this.childrenCollectionChanged);
                    //}
                    return this._children;
                },
                set: function (value) {
                    var _this = this;
                    if (value == this._children)
                        return;
                    if (this._children != null) {
                        //reset parent on all children
                        this._children.forEach(function (el) {
                            if (el.parent == _this)
                                el.parent = null;
                        });
                        //remove handler so that resource can be disposed
                        this._children.off(this.childrenCollectionChanged);
                    }
                    this._children = value;
                    //attach new children here
                    this._children.forEach(function (el) {
                        if (el.parent != null) {
                            //if already child of a different parent throw error
                            //in future investigate if it can be removed from container automatically
                            throw new Error("Element already child of another element, please remove it first from previous container");
                        }
                        el.parent = _this;
                        if (_this._divElement != null)
                            el.attachVisual(_this._divElement);
                    });
                    this._children.on(this.childrenCollectionChanged);
                },
                enumerable: true,
                configurable: true
            });
            Panel.prototype.childrenCollectionChanged = function (collection, added, removed) {
                var _this = this;
                removed.forEach(function (el) {
                    if (el.parent == _this)
                        el.parent = null;
                });
                added.forEach(function (el) {
                    el.parent = _this;
                    if (_this._divElement != null)
                        el.attachVisual(_this._divElement);
                });
                this.invalidateMeasure();
            };
            Panel.prototype.layoutOverride = function () {
                _super.prototype.layoutOverride.call(this);
                var background = this.background;
                if (this._visual.style.background != background)
                    this._visual.style.background = background;
                this._children.forEach(function (child) { return child.layout(); });
            };
            Panel.prototype.attachVisualOverride = function (elementContainer) {
                var _this = this;
                this._visual = this._divElement = document.createElement("div");
                this._children.forEach(function (child) { return child.attachVisual(_this._divElement); });
                _super.prototype.attachVisualOverride.call(this, elementContainer);
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
            Object.defineProperty(Panel.prototype, "isItemsHost", {
                get: function () {
                    return this.getValue(Panel.isItemsHostProperty);
                },
                set: function (value) {
                    this.setValue(Panel.isItemsHostProperty, value);
                },
                enumerable: true,
                configurable: true
            });
            Panel.typeName = "layouts.controls.Panel";
            Panel.backgroundProperty = layouts.DepObject.registerProperty(Panel.typeName, "Background", null, layouts.FrameworkPropertyMetadataOptions.AffectsRender);
            Panel.isItemsHostProperty = layouts.DepObject.registerProperty(Panel.typeName, "IsItemsHost", false, layouts.FrameworkPropertyMetadataOptions.NotDataBindable);
            return Panel;
        })(layouts.FrameworkElement);
        controls.Panel = Panel;
    })(controls = layouts.controls || (layouts.controls = {}));
})(layouts || (layouts = {}));
//# sourceMappingURL=Panel.js.map