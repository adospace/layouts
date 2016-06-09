var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var layouts;
(function (layouts) {
    var controls;
    (function (controls) {
        var NavigationContext = (function () {
            function NavigationContext(previousPage, previousUri, nextPage, nextUri, queryString) {
                this.previousPage = previousPage;
                this.previousUri = previousUri;
                this.nextPage = nextPage;
                this.nextUri = nextUri;
                this.queryString = queryString;
                this.cancel = false;
                this.returnUri = null;
            }
            return NavigationContext;
        }());
        controls.NavigationContext = NavigationContext;
        var Page = (function (_super) {
            __extends(Page, _super);
            function Page() {
                _super.apply(this, arguments);
                this.cachePage = false;
            }
            Object.defineProperty(Page.prototype, "typeName", {
                get: function () {
                    return Page.typeName;
                },
                enumerable: true,
                configurable: true
            });
            Page.prototype.tryLoadChildFromServer = function () {
                var _this = this;
                var req = new XMLHttpRequest();
                req.onreadystatechange = function (ev) {
                    if (req.readyState == 4 && req.status == 200) {
                        var loader = new layouts.XamlReader();
                        _this.child = loader.Parse(req.responseText);
                    }
                };
                req.open("GET", this.typeName.replace(/\./gi, '/') + ".xml", true);
                req.send();
            };
            Page.prototype.attachVisualOverride = function (elementContainer) {
                this._container = elementContainer;
                var child = this.child;
                if (child != null) {
                    child.parent = this;
                    child.attachVisual(this._container);
                }
                else {
                    this.tryLoadChildFromServer();
                }
                _super.prototype.attachVisualOverride.call(this, elementContainer);
            };
            Page.prototype.layoutOverride = function () {
                var child = this.child;
                if (child != null)
                    child.layout();
            };
            Page.prototype.measureOverride = function (constraint) {
                var mySize = new layouts.Size();
                var child = this.child;
                if (child != null) {
                    child.measure(constraint);
                    return child.desiredSize;
                }
                return mySize;
            };
            Page.prototype.arrangeOverride = function (finalSize) {
                var child = this.child;
                if (child != null) {
                    child.arrange(new layouts.Rect(0, 0, finalSize.width, finalSize.height));
                }
                return finalSize;
            };
            Object.defineProperty(Page.prototype, "child", {
                get: function () {
                    return this.getValue(Page.childProperty);
                },
                set: function (value) {
                    this.setValue(Page.childProperty, value);
                },
                enumerable: true,
                configurable: true
            });
            Page.prototype.onDependencyPropertyChanged = function (property, value, oldValue) {
                if (property == Page.childProperty) {
                    var oldChild = oldValue;
                    if (oldChild != null && oldChild.parent == this) {
                        oldChild.parent = null;
                        oldChild.attachVisual(null);
                    }
                    var newChild = value;
                    if (newChild != null) {
                        newChild.parent = this;
                        if (this._container != null)
                            newChild.attachVisual(this._container);
                    }
                }
                _super.prototype.onDependencyPropertyChanged.call(this, property, value, oldValue);
            };
            Object.defineProperty(Page.prototype, "sizeToContent", {
                get: function () {
                    return this.getValue(Page.sizeToContentProperty);
                },
                set: function (value) {
                    this.setValue(Page.sizeToContentProperty, value);
                },
                enumerable: true,
                configurable: true
            });
            Page.prototype.onNavigate = function (context) {
            };
            Page.typeName = "layouts.controls.Page";
            Page.childProperty = layouts.DepObject.registerProperty(Page.typeName, "Child", null, layouts.FrameworkPropertyMetadataOptions.AffectsMeasure | layouts.FrameworkPropertyMetadataOptions.AffectsRender);
            Page.sizeToContentProperty = layouts.DepObject.registerProperty(Page.typeName, "SizeToContent", layouts.SizeToContent.None, layouts.FrameworkPropertyMetadataOptions.AffectsMeasure | layouts.FrameworkPropertyMetadataOptions.AffectsRender, function (v) { return layouts.SizeToContent[String(v)]; });
            return Page;
        }(layouts.FrameworkElement));
        controls.Page = Page;
    })(controls = layouts.controls || (layouts.controls = {}));
})(layouts || (layouts = {}));
