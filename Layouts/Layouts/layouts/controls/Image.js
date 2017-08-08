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
        var Stretch;
        (function (Stretch) {
            Stretch[Stretch["None"] = 0] = "None";
            Stretch[Stretch["Fill"] = 1] = "Fill";
            Stretch[Stretch["Uniform"] = 2] = "Uniform";
            Stretch[Stretch["UniformToFill"] = 3] = "UniformToFill";
        })(Stretch = controls.Stretch || (controls.Stretch = {}));
        var StretchDirection;
        (function (StretchDirection) {
            StretchDirection[StretchDirection["UpOnly"] = 0] = "UpOnly";
            StretchDirection[StretchDirection["DownOnly"] = 1] = "DownOnly";
            StretchDirection[StretchDirection["Both"] = 2] = "Both";
        })(StretchDirection = controls.StretchDirection || (controls.StretchDirection = {}));
        var Image = (function (_super) {
            __extends(Image, _super);
            function Image() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            Object.defineProperty(Image.prototype, "typeName", {
                get: function () {
                    return Image.typeName;
                },
                enumerable: true,
                configurable: true
            });
            Image.prototype.attachVisualOverride = function (elementContainer) {
                var _this = this;
                this._visual = this._imgElement = document.createElement("img");
                this._visual.style.msUserSelect =
                    this._visual.style.webkitUserSelect = "none";
                var imgElement = this._imgElement;
                imgElement.onload = function (ev) {
                    _this.invalidateMeasure();
                };
                var source = this.source;
                if (source != null &&
                    source.trim().length > 0)
                    imgElement.src = source;
                _super.prototype.attachVisualOverride.call(this, elementContainer);
            };
            Image.prototype.measureOverride = function (constraint) {
                var imgElement = this._imgElement;
                if (imgElement.complete &&
                    imgElement.naturalWidth > 0) {
                    return new layouts.Size(imgElement.naturalWidth, imgElement.naturalHeight);
                }
                return new layouts.Size();
            };
            Image.prototype.arrangeOverride = function (finalSize) {
                var imgElement = this._imgElement;
                if (imgElement.complete &&
                    imgElement.naturalWidth > 0) {
                    var scaleFactor = Image.computeScaleFactor(finalSize, new layouts.Size(imgElement.naturalWidth, imgElement.naturalHeight), this.stretch, this.stretchDirection);
                    var scaledSize = new layouts.Size(imgElement.naturalWidth * scaleFactor.width, imgElement.naturalHeight * scaleFactor.height);
                    if (scaleFactor.width != 1.0 ||
                        scaleFactor.height != 1.0) {
                        imgElement.style.width = scaledSize.width.toString() + "px";
                        imgElement.style.height = scaledSize.height.toString() + "px";
                    }
                    return scaledSize;
                }
                return _super.prototype.arrangeOverride.call(this, finalSize);
            };
            Image.computeScaleFactor = function (availableSize, contentSize, stretch, stretchDirection) {
                var scaleX = 1.0;
                var scaleY = 1.0;
                var isConstrainedWidth = isFinite(availableSize.width);
                var isConstrainedHeight = isFinite(availableSize.height);
                if ((stretch == Stretch.Uniform || stretch == Stretch.UniformToFill || stretch == Stretch.Fill)
                    && (isConstrainedWidth || isConstrainedHeight)) {
                    scaleX = (contentSize.width.isCloseTo(0)) ? 0.0 : availableSize.width / contentSize.width;
                    scaleY = (contentSize.height.isCloseTo(0)) ? 0.0 : availableSize.height / contentSize.height;
                    if (!isConstrainedWidth)
                        scaleX = scaleY;
                    else if (!isConstrainedHeight)
                        scaleY = scaleX;
                    else {
                        switch (stretch) {
                            case Stretch.Uniform:
                                {
                                    var minscale = scaleX < scaleY ? scaleX : scaleY;
                                    scaleX = scaleY = minscale;
                                }
                                break;
                            case Stretch.UniformToFill:
                                {
                                    var maxscale = scaleX > scaleY ? scaleX : scaleY;
                                    scaleX = scaleY = maxscale;
                                }
                                break;
                            case Stretch.Fill:
                                break;
                        }
                    }
                    switch (stretchDirection) {
                        case StretchDirection.UpOnly:
                            if (scaleX < 1.0)
                                scaleX = 1.0;
                            if (scaleY < 1.0)
                                scaleY = 1.0;
                            break;
                        case StretchDirection.DownOnly:
                            if (scaleX > 1.0)
                                scaleX = 1.0;
                            if (scaleY > 1.0)
                                scaleY = 1.0;
                            break;
                        case StretchDirection.Both:
                            break;
                        default:
                            break;
                    }
                }
                return new layouts.Size(scaleX, scaleY);
            };
            Image.prototype.onDependencyPropertyChanged = function (property, value, oldValue) {
                if (property == Image.srcProperty) {
                    var imgElement = this._imgElement;
                    if (imgElement != null) {
                        imgElement.src = value == null ? layouts.Consts.stringEmpty : value;
                    }
                }
                _super.prototype.onDependencyPropertyChanged.call(this, property, value, oldValue);
            };
            Object.defineProperty(Image.prototype, "source", {
                get: function () {
                    return this.getValue(Image.srcProperty);
                },
                set: function (value) {
                    this.setValue(Image.srcProperty, value);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Image.prototype, "stretch", {
                get: function () {
                    return this.getValue(Image.stretchProperty);
                },
                set: function (value) {
                    this.setValue(Image.stretchProperty, value);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Image.prototype, "stretchDirection", {
                get: function () {
                    return this.getValue(Image.stretchDirectionProperty);
                },
                set: function (value) {
                    this.setValue(Image.stretchDirectionProperty, value);
                },
                enumerable: true,
                configurable: true
            });
            return Image;
        }(layouts.FrameworkElement));
        Image.typeName = "layouts.controls.Image";
        Image.srcProperty = layouts.DepObject.registerProperty(Image.typeName, "Source", null, layouts.FrameworkPropertyMetadataOptions.AffectsMeasure | layouts.FrameworkPropertyMetadataOptions.AffectsRender);
        Image.stretchProperty = layouts.DepObject.registerProperty(Image.typeName, "Stretch", Stretch.None, layouts.FrameworkPropertyMetadataOptions.AffectsMeasure | layouts.FrameworkPropertyMetadataOptions.AffectsRender, function (v) { return Stretch[String(v)]; });
        Image.stretchDirectionProperty = layouts.DepObject.registerProperty(Image.typeName, "StretchDirection", StretchDirection.Both, layouts.FrameworkPropertyMetadataOptions.AffectsMeasure | layouts.FrameworkPropertyMetadataOptions.AffectsRender, function (v) { return StretchDirection[String(v)]; });
        controls.Image = Image;
    })(controls = layouts.controls || (layouts.controls = {}));
})(layouts || (layouts = {}));
