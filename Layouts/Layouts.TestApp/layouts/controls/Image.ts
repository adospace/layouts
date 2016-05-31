/// <reference path="..\DepProperty.ts" />
/// <reference path="..\DepObject.ts" />
/// <reference path="..\FrameworkElement.ts" /> 

module layouts.controls {
    /// <summary>
    ///     Stretch - Enum which descibes how a source rect should be stretched to fit a 
    ///     destination rect.
    /// </summary>
    export enum Stretch {
        /// <summary>
        ///     None - Preserve original size
        /// </summary>
        None = 0,

        /// <summary>
        ///     Fill - Aspect ratio is not preserved, source rect fills destination rect.
        /// </summary>
        Fill = 1,

        /// <summary>
        ///     Uniform - Aspect ratio is preserved, Source rect is uniformly scaled as large as 
        ///     possible such that both width and height fit within destination rect.  This will 
        ///     not cause source clipping, but it may result in unfilled areas of the destination 
        ///     rect, if the aspect ratio of source and destination are different.
        /// </summary>
        Uniform = 2,

        /// <summary>
        ///     UniformToFill - Aspect ratio is preserved, Source rect is uniformly scaled as small 
        ///     as possible such that the entire destination rect is filled.  This can cause source 
        ///     clipping, if the aspect ratio of source and destination are different.
        /// </summary>
        UniformToFill = 3,
    }   

    /// <summary>
    /// StretchDirection - Enum which describes when scaling should be used on the content of a Viewbox. This
    /// enum restricts the scaling factors along various axes.
    /// </summary>
    /// <seealso cref="Viewbox" />
    export enum StretchDirection {
        /// <summary>
        /// Only scales the content upwards when the content is smaller than the Viewbox.
        /// If the content is larger, no scaling downwards is done.
        /// </summary>
        UpOnly,

        /// <summary>
        /// Only scales the content downwards when the content is larger than the Viewbox.
        /// If the content is smaller, no scaling upwards is done.
        /// </summary>
        DownOnly,

        /// <summary>
        /// Always stretches to fit the Viewbox according to the stretch mode.
        /// </summary>
        Both
    } 

    export class Image extends FrameworkElement {
        static typeName: string = "layouts.controls.Image";
        get typeName(): string {
            return Image.typeName;
        }


        private _imgElement: HTMLImageElement;
        attachVisualOverride(elementContainer: HTMLElement) {
            this._visual = this._imgElement = document.createElement("img");
            this._visual.style.msUserSelect =
                this._visual.style.webkitUserSelect = "none";

            var imgElement = this._imgElement;
            imgElement.onload = (ev) => {
                this.invalidateMeasure();
            };
            var source = this.source;
            if (source != null &&
                source.trim().length > 0)
                imgElement.src = source;

            super.attachVisualOverride(elementContainer);
        }

        protected measureOverride(constraint: Size): Size {
            var imgElement = this._imgElement;
            if (imgElement.complete &&
                imgElement.naturalWidth > 0) {
                return new Size(imgElement.naturalWidth, imgElement.naturalHeight);
            }

            return new Size();
        }

        protected arrangeOverride(finalSize: Size): Size {
            var imgElement = this._imgElement;
            if (imgElement.complete &&
                imgElement.naturalWidth > 0) {
                var scaleFactor = Image.computeScaleFactor(finalSize,
                    new Size(imgElement.naturalWidth, imgElement.naturalHeight),
                    this.stretch,
                    this.stretchDirection);
                var scaledSize = new Size(imgElement.naturalWidth * scaleFactor.width, imgElement.naturalHeight * scaleFactor.height);
                if (scaleFactor.width != 1.0 ||
                    scaleFactor.height != 1.0) {
                    imgElement.style.width = scaledSize.width.toString() + "px";
                    imgElement.style.height = scaledSize.height.toString() + "px";
                }

                return scaledSize;
            }

            return super.arrangeOverride(finalSize);
        }

        //protected measureOverride(constraint: Size): Size {
        //    var src = this.source;
        //    var mySize = new Size();
        //    var imgElement = this._imgElement;
        //    var srcChanged = (imgElement.src != src);
        //    if (srcChanged) {
        //        imgElement.src = src;
        //        imgElement.style.width = isFinite(constraint.width) ? constraint.width.toString() + "px" : "auto";
        //        imgElement.style.height = isFinite(constraint.height) ? constraint.height.toString() + "px" : "auto";
        //    }

        //    //if image is already loaded than report its size, otherwise the loaded event will invalidate my measure
        //    if (imgElement.complete &&
        //        imgElement.naturalWidth > 0) {
        //        var scaleFactor = Image.computeScaleFactor(constraint,
        //            new Size(imgElement.naturalWidth, imgElement.naturalHeight),
        //            this.stretch,
        //            this.stretchDirection);
        //        mySize = new Size(imgElement.naturalWidth * scaleFactor.width, imgElement.naturalHeight * scaleFactor.height);
        //    }

        //    if (srcChanged && this.renderSize != null) {
        //        imgElement.style.width = this.renderSize.width.toString() + "px";
        //        imgElement.style.height = this.renderSize.height.toString() + "px";
        //    }            

        //    return mySize;
        //}

        //protected arrangeOverride(finalSize: Size): Size {
        //    var imgElement = this._imgElement;
        //    if (imgElement.complete &&
        //        imgElement.naturalWidth > 0) {
        //        var scaleFactor = Image.computeScaleFactor(finalSize,
        //            new Size(imgElement.naturalWidth, imgElement.naturalHeight),
        //            this.stretch,
        //            this.stretchDirection);
        //        return new Size(imgElement.naturalWidth * scaleFactor.width, imgElement.naturalHeight * scaleFactor.height);
        //    }

        //    return finalSize;
        //}

        /// <summary>
        /// Helper function that computes scale factors depending on a target size and a content size
        /// </summary>
        /// <param name="availableSize">Size into which the content is being fitted.</param>
        /// <param name="contentSize">Size of the content, measured natively (unconstrained).</param>
        /// <param name="stretch">Value of the Stretch property on the element.</param>
        /// <param name="stretchDirection">Value of the StretchDirection property on the element.</param>
        static computeScaleFactor(availableSize: Size,
            contentSize: Size,
            stretch: Stretch,
            stretchDirection: StretchDirection): Size {
            // Compute scaling factors to use for axes
            var scaleX = 1.0;
            var scaleY = 1.0;

            var isConstrainedWidth = isFinite(availableSize.width);
            var isConstrainedHeight = isFinite(availableSize.height);

            if ((stretch == Stretch.Uniform || stretch == Stretch.UniformToFill || stretch == Stretch.Fill)
                && (isConstrainedWidth || isConstrainedHeight)) {
                // Compute scaling factors for both axes
                scaleX = (contentSize.width.isCloseTo(0)) ? 0.0 : availableSize.width / contentSize.width;
                scaleY = (contentSize.height.isCloseTo(0)) ? 0.0 : availableSize.height / contentSize.height;

                if (!isConstrainedWidth) scaleX = scaleY;
                else if (!isConstrainedHeight) scaleY = scaleX;
                else {
                    // If not preserving aspect ratio, then just apply transform to fit
                    switch (stretch) {
                        case Stretch.Uniform: {      //Find minimum scale that we use for both axes
                            var minscale = scaleX < scaleY ? scaleX : scaleY;
                            scaleX = scaleY = minscale;
                        }
                            break;

                        case Stretch.UniformToFill: { //Find maximum scale that we use for both axes
                            var maxscale = scaleX > scaleY ? scaleX : scaleY;
                            scaleX = scaleY = maxscale;
                        }
                            break;

                        case Stretch.Fill:          //We already computed the fill scale factors above, so just use them
                            break;
                    }
                }

                //Apply stretch direction by bounding scales.
                //In the uniform case, scaleX=scaleY, so this sort of clamping will maintain aspect ratio
                //In the uniform fill case, we have the same result too.
                //In the fill case, note that we change aspect ratio, but that is okay
                switch (stretchDirection) {
                    case StretchDirection.UpOnly:
                        if (scaleX < 1.0) scaleX = 1.0;
                        if (scaleY < 1.0) scaleY = 1.0;
                        break;

                    case StretchDirection.DownOnly:
                        if (scaleX > 1.0) scaleX = 1.0;
                        if (scaleY > 1.0) scaleY = 1.0;
                        break;

                    case StretchDirection.Both:
                        break;

                    default:
                        break;
                }
            }
            //Return this as a size now
            return new Size(scaleX, scaleY);
        }

        protected onDependencyPropertyChanged(property: DepProperty, value: any, oldValue: any) {
            if (property == Image.srcProperty) {
                var imgElement = this._imgElement;
                if (imgElement != null) {
                    imgElement.src = value == null ? layouts.Consts.stringEmpty : value;
                }
            }

            super.onDependencyPropertyChanged(property, value, oldValue);
        }

        static srcProperty = DepObject.registerProperty(Image.typeName, "Source", null, FrameworkPropertyMetadataOptions.AffectsMeasure | FrameworkPropertyMetadataOptions.AffectsRender);
        get source(): string {
            return <string>this.getValue(Image.srcProperty);
        }
        set source(value: string) {
            this.setValue(Image.srcProperty, value);
        }

        static stretchProperty = DepObject.registerProperty(Image.typeName, "Stretch", Stretch.None, FrameworkPropertyMetadataOptions.AffectsMeasure | FrameworkPropertyMetadataOptions.AffectsRender, (v) => Stretch[String(v)]);
        get stretch(): Stretch {
            return <Stretch>this.getValue(Image.stretchProperty);
        }
        set stretch(value: Stretch) {
            this.setValue(Image.stretchProperty, value);
        }

        static stretchDirectionProperty = DepObject.registerProperty(Image.typeName, "StretchDirection", StretchDirection.Both, FrameworkPropertyMetadataOptions.AffectsMeasure | FrameworkPropertyMetadataOptions.AffectsRender, (v) => StretchDirection[String(v)]);
        get stretchDirection(): StretchDirection {
            return <StretchDirection>this.getValue(Image.stretchDirectionProperty);
        }
        set stretchDirection(value: StretchDirection) {
            this.setValue(Image.stretchDirectionProperty, value);
        }
    }
} 