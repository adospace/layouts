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
        var NativeElement = (function (_super) {
            __extends(NativeElement, _super);
            function NativeElement(elementType) {
                var _this = _super.call(this) || this;
                _this.elementType = elementType;
                return _this;
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
                                this._child.attachVisual(this._visual, true);
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
                var text = this.text;
                if (text != null)
                    this._visual.innerHTML = text;
                if (this._child != null) {
                    var childVisual = this._child.attachVisual(this._visual, true);
                    if (childVisual != null && !this.arrangeChild)
                        childVisual.style.position = layouts.Consts.stringEmpty;
                }
                _super.prototype.attachVisualOverride.call(this, elementContainer);
            };
            NativeElement.prototype.onDependencyPropertyChanged = function (property, value, oldValue) {
                if (property == NativeElement.textProperty && this._visual != null) {
                    this._visual.innerHTML = value;
                }
                _super.prototype.onDependencyPropertyChanged.call(this, property, value, oldValue);
            };
            NativeElement.prototype.measureOverride = function (constraint) {
                if (this.arrangeChild) {
                    if (this._child != null)
                        this._child.measure(constraint);
                }
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
                if (this.arrangeChild) {
                    var child = this.child;
                    if (child != null) {
                        child.arrange(new layouts.Rect(0, 0, finalSize.width, finalSize.height));
                    }
                }
                return finalSize;
            };
            Object.defineProperty(NativeElement.prototype, "text", {
                get: function () {
                    return this.getValue(NativeElement.textProperty);
                },
                set: function (value) {
                    this.setValue(NativeElement.textProperty, value);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(NativeElement.prototype, "arrangeChild", {
                get: function () {
                    return this.getValue(NativeElement.arrangeChildProperty);
                },
                set: function (value) {
                    this.setValue(NativeElement.arrangeChildProperty, value);
                },
                enumerable: true,
                configurable: true
            });
            return NativeElement;
        }(layouts.FrameworkElement));
        NativeElement.typeName = "layouts.controls.NativeElement";
        NativeElement.textProperty = layouts.DepObject.registerProperty(NativeElement.typeName, "Text", null, layouts.FrameworkPropertyMetadataOptions.AffectsMeasure | layouts.FrameworkPropertyMetadataOptions.AffectsRender, function (v) { return String(v); });
        NativeElement.arrangeChildProperty = layouts.DepObject.registerProperty(NativeElement.typeName, "ArrangeChild", true, layouts.FrameworkPropertyMetadataOptions.None, function (v) { return v != null && v.trim().toLowerCase() == "true"; });
        controls.NativeElement = NativeElement;
        var div = (function (_super) {
            __extends(div, _super);
            function div() {
                return _super.call(this, "div") || this;
            }
            Object.defineProperty(div.prototype, "typeName", {
                get: function () {
                    return div.typeName;
                },
                enumerable: true,
                configurable: true
            });
            return div;
        }(NativeElement));
        div.typeName = "layouts.controls.div";
        controls.div = div;
        var a = (function (_super) {
            __extends(a, _super);
            function a() {
                return _super.call(this, "a") || this;
            }
            Object.defineProperty(a.prototype, "typeName", {
                get: function () {
                    return a.typeName;
                },
                enumerable: true,
                configurable: true
            });
            return a;
        }(NativeElement));
        a.typeName = "layouts.controls.a";
        controls.a = a;
        var img = (function (_super) {
            __extends(img, _super);
            function img() {
                return _super.call(this, "img") || this;
            }
            Object.defineProperty(img.prototype, "typeName", {
                get: function () {
                    return img.typeName;
                },
                enumerable: true,
                configurable: true
            });
            return img;
        }(NativeElement));
        img.typeName = "layouts.controls.img";
        controls.img = img;
        var i = (function (_super) {
            __extends(i, _super);
            function i() {
                return _super.call(this, "i") || this;
            }
            Object.defineProperty(i.prototype, "typeName", {
                get: function () {
                    return i.typeName;
                },
                enumerable: true,
                configurable: true
            });
            return i;
        }(NativeElement));
        i.typeName = "layouts.controls.i";
        controls.i = i;
        var ul = (function (_super) {
            __extends(ul, _super);
            function ul() {
                return _super.call(this, "ul") || this;
            }
            Object.defineProperty(ul.prototype, "typeName", {
                get: function () {
                    return ul.typeName;
                },
                enumerable: true,
                configurable: true
            });
            return ul;
        }(NativeElement));
        ul.typeName = "layouts.controls.ul";
        controls.ul = ul;
        var li = (function (_super) {
            __extends(li, _super);
            function li() {
                return _super.call(this, "li") || this;
            }
            Object.defineProperty(li.prototype, "typeName", {
                get: function () {
                    return li.typeName;
                },
                enumerable: true,
                configurable: true
            });
            return li;
        }(NativeElement));
        li.typeName = "layouts.controls.li";
        controls.li = li;
        var nav = (function (_super) {
            __extends(nav, _super);
            function nav() {
                return _super.call(this, "nav") || this;
            }
            Object.defineProperty(nav.prototype, "typeName", {
                get: function () {
                    return nav.typeName;
                },
                enumerable: true,
                configurable: true
            });
            return nav;
        }(NativeElement));
        nav.typeName = "layouts.controls.nav";
        controls.nav = nav;
        var span = (function (_super) {
            __extends(span, _super);
            function span() {
                return _super.call(this, "span") || this;
            }
            Object.defineProperty(span.prototype, "typeName", {
                get: function () {
                    return span.typeName;
                },
                enumerable: true,
                configurable: true
            });
            return span;
        }(NativeElement));
        span.typeName = "layouts.controls.span";
        controls.span = span;
        var h1 = (function (_super) {
            __extends(h1, _super);
            function h1() {
                return _super.call(this, "h1") || this;
            }
            Object.defineProperty(h1.prototype, "typeName", {
                get: function () {
                    return h1.typeName;
                },
                enumerable: true,
                configurable: true
            });
            return h1;
        }(NativeElement));
        h1.typeName = "layouts.controls.h1";
        controls.h1 = h1;
        var h2 = (function (_super) {
            __extends(h2, _super);
            function h2() {
                return _super.call(this, "h2") || this;
            }
            Object.defineProperty(h2.prototype, "typeName", {
                get: function () {
                    return h2.typeName;
                },
                enumerable: true,
                configurable: true
            });
            return h2;
        }(NativeElement));
        h2.typeName = "layouts.controls.h2";
        controls.h2 = h2;
        var h3 = (function (_super) {
            __extends(h3, _super);
            function h3() {
                return _super.call(this, "h3") || this;
            }
            Object.defineProperty(h3.prototype, "typeName", {
                get: function () {
                    return h3.typeName;
                },
                enumerable: true,
                configurable: true
            });
            return h3;
        }(NativeElement));
        h3.typeName = "layouts.controls.h3";
        controls.h3 = h3;
        var h4 = (function (_super) {
            __extends(h4, _super);
            function h4() {
                return _super.call(this, "h4") || this;
            }
            Object.defineProperty(h4.prototype, "typeName", {
                get: function () {
                    return h4.typeName;
                },
                enumerable: true,
                configurable: true
            });
            return h4;
        }(NativeElement));
        h4.typeName = "layouts.controls.h4";
        controls.h4 = h4;
        var h5 = (function (_super) {
            __extends(h5, _super);
            function h5() {
                return _super.call(this, "h5") || this;
            }
            Object.defineProperty(h5.prototype, "typeName", {
                get: function () {
                    return h5.typeName;
                },
                enumerable: true,
                configurable: true
            });
            return h5;
        }(NativeElement));
        h5.typeName = "layouts.controls.h5";
        controls.h5 = h5;
    })(controls = layouts.controls || (layouts.controls = {}));
})(layouts || (layouts = {}));
