/// <reference path="..\DepProperty.ts" />
/// <reference path="..\DepObject.ts" />
/// <reference path="..\FrameworkElement.ts" /> 
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
        (function (Stretch) {
            Stretch[Stretch["None"] = 0] = "None";
            Stretch[Stretch["Fill"] = 1] = "Fill";
            Stretch[Stretch["Uniform"] = 2] = "Uniform";
            Stretch[Stretch["UniformToFill"] = 3] = "UniformToFill";
        })(controls.Stretch || (controls.Stretch = {}));
        var Stretch = controls.Stretch;
        (function (StretchDirection) {
            StretchDirection[StretchDirection["UpOnly"] = 0] = "UpOnly";
            StretchDirection[StretchDirection["DownOnly"] = 1] = "DownOnly";
            StretchDirection[StretchDirection["Both"] = 2] = "Both";
        })(controls.StretchDirection || (controls.StretchDirection = {}));
        var StretchDirection = controls.StretchDirection;
        var Image = (function (_super) {
            __extends(Image, _super);
            function Image() {
                _super.apply(this, arguments);
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
                this._imgElement.onload = function (ev) {
                    _this._imgElement.onload = null;
                    _this.invalidateMeasure();
                };
                _super.prototype.attachVisualOverride.call(this, elementContainer);
            };
            Image.prototype.measureOverride = function (constraint) {
                var src = this.source;
                var mySize = new layouts.Size();
                var imgElement = this._imgElement;
                var srcChanged = (imgElement.src != src);
                if (srcChanged) {
                    imgElement.src = src;
                    imgElement.style.width = isFinite(constraint.width) ? constraint.width.toString() + "px" : "auto";
                    imgElement.style.height = isFinite(constraint.height) ? constraint.height.toString() + "px" : "auto";
                }
                if (imgElement.complete &&
                    imgElement.naturalWidth > 0) {
                    var scaleFactor = Image.computeScaleFactor(constraint, new layouts.Size(imgElement.naturalWidth, imgElement.naturalHeight), this.stretch, this.stretchDirection);
                    mySize = new layouts.Size(imgElement.naturalWidth * scaleFactor.width, imgElement.naturalHeight * scaleFactor.height);
                }
                if (srcChanged && this.renderSize != null) {
                    imgElement.style.width = this.renderSize.width.toString() + "px";
                    imgElement.style.height = this.renderSize.height.toString() + "px";
                }
                return mySize;
            };
            Image.prototype.arrangeOverride = function (finalSize) {
                var imgElement = this._imgElement;
                if (imgElement.complete &&
                    imgElement.naturalWidth > 0) {
                    var scaleFactor = Image.computeScaleFactor(finalSize, new layouts.Size(imgElement.naturalWidth, imgElement.naturalHeight), this.stretch, this.stretchDirection);
                    return new layouts.Size(imgElement.naturalWidth * scaleFactor.width, imgElement.naturalHeight * scaleFactor.height);
                }
                return finalSize;
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
            Image.typeName = "layouts.controls.Image";
            Image.srcProperty = layouts.DepObject.registerProperty(Image.typeName, "Source", null, layouts.FrameworkPropertyMetadataOptions.AffectsMeasure | layouts.FrameworkPropertyMetadataOptions.AffectsRender);
            Image.stretchProperty = layouts.DepObject.registerProperty(Image.typeName, "Stretch", Stretch.None, layouts.FrameworkPropertyMetadataOptions.AffectsMeasure | layouts.FrameworkPropertyMetadataOptions.AffectsRender);
            Image.stretchDirectionProperty = layouts.DepObject.registerProperty(Image.typeName, "StretchDirection", StretchDirection.Both, layouts.FrameworkPropertyMetadataOptions.AffectsMeasure | layouts.FrameworkPropertyMetadataOptions.AffectsRender);
            return Image;
        })(layouts.FrameworkElement);
        controls.Image = Image;
    })(controls = layouts.controls || (layouts.controls = {}));
})(layouts || (layouts = {}));
