var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var layouts;
(function (layouts) {
    var controls;
    (function (controls) {
        var NativeElement = (function (_super) {
            __extends(NativeElement, _super);
            function NativeElement(elementType) {
                _super.call(this);
                this.elementType = elementType;
            }
            Object.defineProperty(NativeElement.prototype, "typeName", {
                get: function () {
                    return NativeElement.typeName;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(NativeElement.prototype, "child", {
                get: function () {
                    return this._child;
                },
                set: function (value) {
                    if (this._child != value) {
                        if (this._child != null && this._child.parent == this) {
                            this._child.parent = null;
                            this._child.attachVisual(null);
                        }
                        this._child = value;
                        if (this._child != null) {
                            this._child.parent = this;
                            if (this._visual != null)
                                this._child.attachVisual(this._visual);
                        }
                        this.invalidateMeasure();
                    }
                },
                enumerable: true,
                configurable: true
            });
            NativeElement.prototype.invalidateMeasure = function () {
                this._measuredSize = null;
                _super.prototype.invalidateMeasure.call(this);
            };
            NativeElement.prototype.attachVisualOverride = function (elementContainer) {
                this._visual = document.createElement(this.elementType);
                this._visual.innerHTML = this.text;
                if (this._child != null) {
                    this._child.attachVisual(this._visual);
                }
                _super.prototype.attachVisualOverride.call(this, elementContainer);
            };
            NativeElement.prototype.onDependencyPropertyChanged = function (property, value, oldValue) {
                if (property == NativeElement.textProperty) {
                    this._visual.innerHTML = value;
                }
                _super.prototype.onDependencyPropertyChanged.call(this, property, value, oldValue);
            };
            NativeElement.prototype.measureOverride = function (constraint) {
                var pElement = this._visual;
                ;
                if (this._measuredSize == null) {
                    pElement.style.width = "";
                    pElement.style.height = "";
                    this._measuredSize = new layouts.Size(pElement.clientWidth, pElement.clientHeight);
                }
                return new layouts.Size(Math.min(constraint.width, this._measuredSize.width), Math.min(constraint.height, this._measuredSize.height));
            };
            NativeElement.prototype.arrangeOverride = function (finalSize) {
                var pElement = this._visual;
                pElement.style.width = finalSize.width.toString() + "px";
                pElement.style.height = finalSize.height.toString() + "px";
                return finalSize;
            };
            Object.defineProperty(NativeElement.prototype, "text", {
                get: function () {
                    return this.getValue(a.textProperty);
                },
                set: function (value) {
                    this.setValue(a.textProperty, value);
                },
                enumerable: true,
                configurable: true
            });
            NativeElement.typeName = "layouts.controls.NativeElement";
            NativeElement.textProperty = layouts.DepObject.registerProperty(a.typeName, "Text", null, layouts.FrameworkPropertyMetadataOptions.AffectsMeasure | layouts.FrameworkPropertyMetadataOptions.AffectsRender, function (v) { return String(v); });
            return NativeElement;
        }(layouts.FrameworkElement));
        controls.NativeElement = NativeElement;
        var div = (function (_super) {
            __extends(div, _super);
            function div() {
                _super.call(this, "div");
            }
            Object.defineProperty(div.prototype, "typeName", {
                get: function () {
                    return i.typeName;
                },
                enumerable: true,
                configurable: true
            });
            div.typeName = "layouts.controls.div";
            return div;
        }(NativeElement));
        controls.div = div;
        var a = (function (_super) {
            __extends(a, _super);
            function a() {
                _super.call(this, "a");
            }
            Object.defineProperty(a.prototype, "typeName", {
                get: function () {
                    return i.typeName;
                },
                enumerable: true,
                configurable: true
            });
            a.typeName = "layouts.controls.a";
            return a;
        }(NativeElement));
        controls.a = a;
        var i = (function (_super) {
            __extends(i, _super);
            function i() {
                _super.call(this, "i");
            }
            Object.defineProperty(i.prototype, "typeName", {
                get: function () {
                    return i.typeName;
                },
                enumerable: true,
                configurable: true
            });
            i.typeName = "layouts.controls.i";
            return i;
        }(NativeElement));
        controls.i = i;
        var ul = (function (_super) {
            __extends(ul, _super);
            function ul() {
                _super.call(this, "ul");
            }
            Object.defineProperty(ul.prototype, "typeName", {
                get: function () {
                    return ul.typeName;
                },
                enumerable: true,
                configurable: true
            });
            ul.typeName = "layouts.controls.ul";
            return ul;
        }(NativeElement));
        controls.ul = ul;
        var li = (function (_super) {
            __extends(li, _super);
            function li() {
                _super.call(this, "li");
            }
            Object.defineProperty(li.prototype, "typeName", {
                get: function () {
                    return li.typeName;
                },
                enumerable: true,
                configurable: true
            });
            li.typeName = "layouts.controls.li";
            return li;
        }(NativeElement));
        controls.li = li;
        var nav = (function (_super) {
            __extends(nav, _super);
            function nav() {
                _super.call(this, "nav");
            }
            Object.defineProperty(nav.prototype, "typeName", {
                get: function () {
                    return nav.typeName;
                },
                enumerable: true,
                configurable: true
            });
            nav.typeName = "layouts.controls.nav";
            return nav;
        }(NativeElement));
        controls.nav = nav;
        var span = (function (_super) {
            __extends(span, _super);
            function span() {
                _super.call(this, "span");
            }
            Object.defineProperty(span.prototype, "typeName", {
                get: function () {
                    return span.typeName;
                },
                enumerable: true,
                configurable: true
            });
            span.typeName = "layouts.controls.span";
            return span;
        }(NativeElement));
        controls.span = span;
    })(controls = layouts.controls || (layouts.controls = {}));
})(layouts || (layouts = {}));
