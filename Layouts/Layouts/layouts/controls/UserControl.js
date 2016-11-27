var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var layouts;
(function (layouts) {
    var controls;
    (function (controls) {
        var UserControl = (function (_super) {
            __extends(UserControl, _super);
            function UserControl() {
                _super.apply(this, arguments);
            }
            Object.defineProperty(UserControl.prototype, "typeName", {
                get: function () {
                    return UserControl.typeName;
                },
                enumerable: true,
                configurable: true
            });
            UserControl.prototype.initializeComponent = function () {
                return null;
            };
            UserControl.prototype.tryLoadChildFromServer = function () {
                var _this = this;
                var req = new XMLHttpRequest();
                req.onreadystatechange = function (ev) {
                    if (req.readyState == 4 && req.status == 200) {
                        var loader = new layouts.XamlReader();
                        _this.setupChild(loader.Parse(req.responseText));
                    }
                };
                req.open("GET", this.typeName.replace(/\./gi, '/') + ".xml", true);
                req.send();
            };
            UserControl.prototype.attachVisualOverride = function (elementContainer) {
                this._container = elementContainer;
                this.setupChild(this.initializeComponent());
                _super.prototype.attachVisualOverride.call(this, elementContainer);
            };
            UserControl.prototype.setupChild = function (content) {
                var child = this._content;
                if (child == null) {
                    this._content = child = content;
                    if (child != null)
                        child.parent = this;
                }
                child = this._content;
                if (child != null) {
                    child.attachVisual(this._container);
                }
                else {
                    this.tryLoadChildFromServer();
                }
            };
            UserControl.prototype.invalidateMeasure = function () {
                _super.prototype.invalidateMeasure.call(this);
                var child = this._content;
                if (child != null) {
                    child.invalidateMeasure();
                }
            };
            UserControl.prototype.invalidateArrange = function () {
                _super.prototype.invalidateArrange.call(this);
                var child = this._content;
                if (child != null) {
                    child.invalidateArrange();
                }
            };
            UserControl.prototype.invalidateLayout = function () {
                _super.prototype.invalidateLayout.call(this);
                var child = this._content;
                if (child != null) {
                    child.invalidateLayout();
                }
            };
            UserControl.prototype.measureOverride = function (constraint) {
                var child = this._content;
                if (child != null) {
                    child.measure(constraint);
                    return child.desiredSize;
                }
                return new layouts.Size();
            };
            UserControl.prototype.arrangeOverride = function (finalSize) {
                var child = this._content;
                if (child != null) {
                    child.arrange(finalSize.toRect());
                }
                this.invalidateLayout();
                return finalSize;
            };
            UserControl.prototype.layoutOverride = function () {
                _super.prototype.layoutOverride.call(this);
                var child = this._content;
                if (child != null) {
                    var childOffset = this.visualOffset;
                    if (this.relativeOffset != null)
                        childOffset = childOffset.add(this.relativeOffset);
                    child.layout(childOffset);
                }
            };
            UserControl.typeName = "layouts.controls.UserControl";
            return UserControl;
        }(layouts.FrameworkElement));
        controls.UserControl = UserControl;
    })(controls = layouts.controls || (layouts.controls = {}));
})(layouts || (layouts = {}));
