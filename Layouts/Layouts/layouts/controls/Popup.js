var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var layouts;
(function (layouts) {
    var controls;
    (function (controls) {
        (function (PopupPosition) {
            PopupPosition[PopupPosition["Center"] = 0] = "Center";
            PopupPosition[PopupPosition["Left"] = 1] = "Left";
            PopupPosition[PopupPosition["LeftTop"] = 2] = "LeftTop";
            PopupPosition[PopupPosition["LeftBottom"] = 3] = "LeftBottom";
            PopupPosition[PopupPosition["Top"] = 4] = "Top";
            PopupPosition[PopupPosition["TopLeft"] = 5] = "TopLeft";
            PopupPosition[PopupPosition["TopRight"] = 6] = "TopRight";
            PopupPosition[PopupPosition["Right"] = 7] = "Right";
            PopupPosition[PopupPosition["RightTop"] = 8] = "RightTop";
            PopupPosition[PopupPosition["RightBottom"] = 9] = "RightBottom";
            PopupPosition[PopupPosition["Bottom"] = 10] = "Bottom";
            PopupPosition[PopupPosition["BottomLeft"] = 11] = "BottomLeft";
            PopupPosition[PopupPosition["BottomRight"] = 12] = "BottomRight";
        })(controls.PopupPosition || (controls.PopupPosition = {}));
        var PopupPosition = controls.PopupPosition;
        var Popup = (function (_super) {
            __extends(Popup, _super);
            function Popup() {
                _super.call(this);
            }
            Object.defineProperty(Popup.prototype, "typeName", {
                get: function () {
                    return Popup.typeName;
                },
                enumerable: true,
                configurable: true
            });
            Popup.initProperties = function () {
                layouts.FrameworkElement.horizontalAlignmentProperty.overrideDefaultValue(Popup.typeName, "Center");
                layouts.FrameworkElement.verticalAlignmentProperty.overrideDefaultValue(Popup.typeName, "Center");
            };
            Popup.prototype.tryLoadChildFromServer = function () {
                var _this = this;
                var req = new XMLHttpRequest();
                req.onreadystatechange = function (ev) {
                    if (req.readyState == 4 && req.status == 200) {
                        var loader = new layouts.XamlReader();
                        _this._child = loader.Parse(req.responseText);
                        if (_this._child != null) {
                            _this._child.parent = _this;
                            _this._child.attachVisual(document.body);
                        }
                    }
                };
                req.open("GET", this.typeName.replace(/\./gi, '/') + ".xml", true);
                req.send();
            };
            Popup.prototype.attachVisualOverride = function (elementContainer) {
                _super.prototype.attachVisualOverride.call(this, elementContainer);
            };
            Object.defineProperty(Popup.prototype, "child", {
                get: function () {
                    return this._child;
                },
                set: function (value) {
                    if (this._child != value) {
                        this._child = value;
                        this.invalidateMeasure();
                    }
                },
                enumerable: true,
                configurable: true
            });
            Popup.prototype.onShow = function () {
                if (this._child == null)
                    this._child = this.initializeComponent();
                if (this._child != null) {
                    this._child.parent = this;
                    this._child.attachVisual(document.body);
                }
                else
                    this.tryLoadChildFromServer();
            };
            Popup.prototype.onClose = function () {
                if (this._child != null && this._child.parent == this) {
                    this._child.attachVisual(null);
                    this._child.parent = null;
                }
            };
            Popup.prototype.initializeComponent = function () {
                return null;
            };
            Popup.prototype.layoutOverride = function () {
                _super.prototype.layoutOverride.call(this);
                var child = this.child;
                if (child != null) {
                    var childOffset = this.visualOffset;
                    if (this.relativeOffset != null)
                        childOffset = childOffset.add(this.relativeOffset);
                    child.layout(childOffset);
                }
            };
            Popup.prototype.measureOverride = function (constraint) {
                var mySize = new layouts.Size();
                if (this._child != null) {
                    this._child.measure(constraint);
                    return this._child.desiredSize;
                }
                return mySize;
            };
            Popup.prototype.arrangeOverride = function (finalSize) {
                var child = this._child;
                if (child != null) {
                    child.arrange(new layouts.Rect(0, 0, finalSize.width, finalSize.height));
                }
                return finalSize;
            };
            Object.defineProperty(Popup.prototype, "sizeToContent", {
                get: function () {
                    return this.getValue(Popup.sizeToContentProperty);
                },
                set: function (value) {
                    this.setValue(Popup.sizeToContentProperty, value);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Popup.prototype, "position", {
                get: function () {
                    return this.getValue(Popup.positionProperty);
                },
                set: function (value) {
                    this.setValue(Popup.positionProperty, value);
                },
                enumerable: true,
                configurable: true
            });
            Popup.typeName = "layouts.controls.Popup";
            Popup._init = Popup.initProperties();
            Popup.sizeToContentProperty = layouts.DepObject.registerProperty(Popup.typeName, "SizeToContent", layouts.SizeToContent.Both, layouts.FrameworkPropertyMetadataOptions.AffectsMeasure | layouts.FrameworkPropertyMetadataOptions.AffectsRender, function (v) { return layouts.SizeToContent[String(v)]; });
            Popup.positionProperty = layouts.DepObject.registerProperty(Popup.typeName, "Position", PopupPosition.Center, layouts.FrameworkPropertyMetadataOptions.AffectsMeasure | layouts.FrameworkPropertyMetadataOptions.AffectsRender, function (v) { return PopupPosition[String(v)]; });
            return Popup;
        }(layouts.FrameworkElement));
        controls.Popup = Popup;
    })(controls = layouts.controls || (layouts.controls = {}));
})(layouts || (layouts = {}));
