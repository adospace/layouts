﻿/// <reference path="DepProperty.ts" />
/// <reference path="DepObject.ts" />
/// <reference path="UIElement.ts" />

module layouts {
    export enum VerticalAlignment { Top, Center, Bottom, Stretch }
    export enum HorizontalAlignment { Left, Center, Right, Stretch }
    export class Thickness { constructor(public left: number = 0, public top: number = 0, public right: number = 0, public bottom: number = 0) { } }

    class MinMax {
        maxHeight: number;
        minHeight: number;
        height: number;

        maxWidth: number;
        minWidth: number;
        width: number;

        constructor(e: FrameworkElement) {
            this.maxHeight = e.maxHeight;
            this.minHeight = e.minHeight;
            var l = e.height;

            this.height = isNaN(l) ? Infinity : l;
            this.maxHeight = Math.max(Math.min(this.height, this.maxHeight), this.minHeight);

            this.height = isNaN(l) ? 0 : l;
            this.minHeight = Math.max(Math.min(this.maxHeight, this.height), this. minHeight);

            this.maxWidth = e.maxWidth;
            this.minWidth = e.minWidth;
            l = e.width;

            this.width = isNaN(l) ? Infinity : l;
            this.maxWidth = Math.max(Math.min(this.width, this.maxWidth), this.minWidth);

            this.width = isNaN(l) ? 0 : l;
            this.minWidth = Math.max(Math.min(this.maxWidth, this.width), this.minWidth);
        }
    }

    export class FrameworkElement extends UIElement {

        private unclippedDesiredSize: Size;
        private needClipBounds: boolean;
        protected visualOffset: Vector = new Vector();

        protected measureCore(availableSize: Size): Size {
            var margin = this.margin;
            var marginWidth = margin.left + margin.right;
            var marginHeight = margin.top + margin.bottom;

            var frameworkAvailableSize = new Size(
                Math.max(availableSize.width - marginWidth, 0),
                Math.max(availableSize.height - marginHeight, 0));

            var mm = new MinMax(this);

            frameworkAvailableSize.width = Math.max(mm.minWidth, Math.min(frameworkAvailableSize.width, mm.maxWidth));
            frameworkAvailableSize.height = Math.max(mm.minHeight, Math.min(frameworkAvailableSize.height, mm.maxHeight));
 
            var desideredSize = this.measureOverride(frameworkAvailableSize);

            desideredSize = new Size(
                Math.max(desideredSize.width, mm.minWidth),
                Math.max(desideredSize.height, mm.minHeight));

            this.unclippedDesiredSize = desideredSize;

            var clipped = false;

            if (desideredSize.width > mm.maxWidth) {
                desideredSize.width = mm.maxWidth;
                clipped = true;
            }

            if (desideredSize.height > mm.maxHeight) {
                desideredSize.height = mm.maxHeight;
                clipped = true;
            }

            var clippedDesiredWidth = desideredSize.width + marginWidth;
            var clippedDesiredHeight = desideredSize.height + marginHeight;

            if (clippedDesiredWidth > availableSize.width) {
                clippedDesiredWidth = availableSize.width;
                clipped = true;
            }

            if (clippedDesiredHeight > availableSize.height) {
                clippedDesiredHeight = availableSize.height;
                clipped = true;
            }

            return new Size(Math.max(0, clippedDesiredWidth), Math.max(0, clippedDesiredHeight));
        }
        
        protected measureOverride(availableSize: Size): Size {
            return new Size();
        }

        protected arrangeCore(finalRect: Rect): void {
            var arrangeSize = finalRect.size;
 
            var margin = this.margin;
            var marginWidth = margin.left + margin.right;
            var marginHeight = margin.top + margin.bottom;

            arrangeSize.width = Math.max(0, arrangeSize.width - marginWidth);
            arrangeSize.height = Math.max(0, arrangeSize.height - marginHeight);

            this.needClipBounds = false;

            if (arrangeSize.width.isCloseTo(this.unclippedDesiredSize.width) ||
                arrangeSize.width < this.unclippedDesiredSize.width) {
                this.needClipBounds = true;
                arrangeSize.width = this.unclippedDesiredSize.width;
            }

            if (arrangeSize.height.isCloseTo(this.unclippedDesiredSize.height) ||
                arrangeSize.height < this.unclippedDesiredSize.height) {
                this.needClipBounds = true;
                arrangeSize.height = this.unclippedDesiredSize.height;
            }

            if (this.horizontalAlignment != HorizontalAlignment.Stretch) {
                arrangeSize.width = this.unclippedDesiredSize.width;
            }

            if (this.verticalAlignment != VerticalAlignment.Stretch) {
                arrangeSize.height = this.unclippedDesiredSize.height;
            }

            var mm = new MinMax(this);

            var effectiveMaxWidth = Math.max(this.unclippedDesiredSize.width, mm.maxWidth);
            if (effectiveMaxWidth.isCloseTo(arrangeSize.width) ||
                effectiveMaxWidth < arrangeSize.width) {
                this.needClipBounds = true;
                arrangeSize.width = effectiveMaxWidth;
            }
 
            var effectiveMaxHeight = Math.max(this.unclippedDesiredSize.height, mm.maxHeight);
            if (effectiveMaxHeight.isCloseTo(arrangeSize.height) ||
                effectiveMaxHeight < arrangeSize.height) {
                this.needClipBounds = true;
                arrangeSize.height = effectiveMaxHeight;
            }

            var oldRenderSize = this.renderSize;
            var innerInkSize = this.arrangeOverride(arrangeSize);

            this.renderSize = innerInkSize;
            this.setActualWidth(innerInkSize.width);
            this.setActualHeight(innerInkSize.height);

            var clippedInkSize = new Size(Math.min(innerInkSize.width, mm.maxWidth),
                Math.min(innerInkSize.height, mm.maxHeight));

            this.needClipBounds = this.needClipBounds ||
                clippedInkSize.width.isCloseTo(innerInkSize.width) || clippedInkSize.width < innerInkSize.width ||
                clippedInkSize.height.isCloseTo(innerInkSize.height) || clippedInkSize.height < innerInkSize.height;

            var clientSize = new Size(Math.max(0, finalRect.width - marginWidth),
                Math.max(0, finalRect.height - marginHeight));

            this.needClipBounds = this.needClipBounds ||
                clientSize.width.isCloseTo(clippedInkSize.width) || clientSize.width < clippedInkSize.width ||
            clientSize.height.isCloseTo(clippedInkSize.height) || clientSize.height < clippedInkSize.height;

            var offset = this.computeAlignmentOffset(clientSize, clippedInkSize);

            offset.x += finalRect.x + margin.left;
            offset.y += finalRect.y + margin.top;

            var oldOffset = this.visualOffset;
            if (!oldOffset.x.isCloseTo(offset.x) ||
                !oldOffset.y.isCloseTo(offset.y)) {
                this.visualOffset = offset;
            }
        }

        private computeAlignmentOffset(clientSize: Size, inkSize: Size) : Vector {
            var offset = new Vector();
 
            var ha = this.horizontalAlignment;
            var va = this.verticalAlignment;


            if (ha == HorizontalAlignment.Stretch
                && inkSize.width > clientSize.width) {
                ha = HorizontalAlignment.Left;
            }

            if (va == VerticalAlignment.Stretch
                && inkSize.height > clientSize.height) {
                va = VerticalAlignment.Top;
            }

            if (ha == HorizontalAlignment.Center
                || ha == HorizontalAlignment.Stretch) {
                offset.x = (clientSize.width - inkSize.width) * 0.5;
            }
            else if (ha == HorizontalAlignment.Right) {
                offset.x = clientSize.width - inkSize.width;
            }
            else {
                offset.x = 0;
            }

            if (va == VerticalAlignment.Center
                || va == VerticalAlignment.Stretch) {
                offset.y = (clientSize.height - inkSize.height) * 0.5;
            }
            else if (va == VerticalAlignment.Bottom) {
                offset.y = clientSize.height - inkSize.height;
            }
            else {
                offset.y = 0;
            }

            return offset;
        }

        protected arrangeOverride(finalSize: Size): Size {
            return finalSize;
        }

        protected layoutOverride() {
            super.layoutOverride();

            var name = this.name;
            if (this._visual.id != name)
                this._visual.id = name;
            var className = this.cssClass;
            if (this._visual.className != className)
                this._visual.className = className;

            this._visual.style.cssText = this.cssStyle;
            this._visual.style.position = "absolute";
            this._visual.style.visibility = this.isVisible ? "visible" : "collapsed";
            this._visual.style.top = this.visualOffset.y.toString() + "px";
            this._visual.style.left = this.visualOffset.x.toString() + "px";
            this._visual.style.width = this.renderSize.width.toString() + "px";
            this._visual.style.height = this.renderSize.height.toString() + "px";
        }

        protected attachVisualOverride(elementContainer: HTMLElement): void {
            this._visual.style.position = "absolute";
        }

        //width property
        static widthProperty = (new FrameworkElement()).registerProperty("Width", Number.NaN, FrameworkPropertyMetadataOptions.AffectsMeasure);
        get width(): number {
            return <number>super.getValue(FrameworkElement.widthProperty);
        }
        set width(value: number) {
            super.setValue(FrameworkElement.widthProperty, value);
        }

        //height property
        static heightProperty = (new FrameworkElement()).registerProperty("Height", Number.NaN, FrameworkPropertyMetadataOptions.AffectsMeasure);
        get height(): number {
            return <number>super.getValue(FrameworkElement.heightProperty);
        }
        set height(value: number) {
            super.setValue(FrameworkElement.heightProperty, value);
        }

        //actualWidth property
        static actualWidthProperty = (new FrameworkElement()).registerProperty("ActualWidth", 0);
        get actualWidth(): number {
            return <number>super.getValue(FrameworkElement.actualWidthProperty);
        }
        private setActualWidth(value: number) {
            super.setValue(FrameworkElement.actualWidthProperty, value);
        }

        //actualHeight property
        static actualHeightProperty = (new FrameworkElement()).registerProperty("ActualHeight", 0);
        get actualHeight(): number {
            return <number>super.getValue(FrameworkElement.actualHeightProperty);
        }
        private setActualHeight(value: number) {
            super.setValue(FrameworkElement.actualHeightProperty, value);
        }

        //minWidth property
        static minWidthProperty = (new FrameworkElement()).registerProperty("MinWidth", 0, FrameworkPropertyMetadataOptions.AffectsMeasure);
        get minWidth(): number {
            return <number>super.getValue(FrameworkElement.minWidthProperty);
        }
        set minWidth(value: number) {
            super.setValue(FrameworkElement.minWidthProperty, value);
        }

        //minHeight property
        static minHeightProperty = (new FrameworkElement()).registerProperty("MinHeight", 0, FrameworkPropertyMetadataOptions.AffectsMeasure);
        get minHeight(): number {
            return <number>super.getValue(FrameworkElement.minHeightProperty);
        }
        set minHeight(value: number) {
            super.setValue(FrameworkElement.minHeightProperty, value);
        }

        //maxWidth property
        static maxWidthProperty = (new FrameworkElement()).registerProperty("MaxWidth", Infinity, FrameworkPropertyMetadataOptions.AffectsMeasure);
        get maxWidth(): number {
            return <number>super.getValue(FrameworkElement.maxWidthProperty);
        }
        set maxWidth(value: number) {
            super.setValue(FrameworkElement.maxWidthProperty, value);
        }

        //maxHeight property
        static maxHeightProperty = (new FrameworkElement()).registerProperty("MaxHeight", Infinity, FrameworkPropertyMetadataOptions.AffectsMeasure);
        get maxHeight(): number {
            return <number>super.getValue(FrameworkElement.maxHeightProperty);
        }
        set maxHeight(value: number) {
            super.setValue(FrameworkElement.maxHeightProperty, value);
        }

        //verticalAlignment property
        static verticalAlignmentProperty = (new FrameworkElement()).registerProperty("VerticalAlignment", VerticalAlignment.Stretch, FrameworkPropertyMetadataOptions.AffectsArrange);
        get verticalAlignment(): VerticalAlignment {
            return <VerticalAlignment>super.getValue(FrameworkElement.verticalAlignmentProperty);
        }
        set verticalAlignment(value: VerticalAlignment) {
            super.setValue(FrameworkElement.verticalAlignmentProperty, value);
        }

        //horizontalAlignment property
        static horizontalAlignmentProperty = (new FrameworkElement()).registerProperty("HorizontalAlignment", HorizontalAlignment.Stretch, FrameworkPropertyMetadataOptions.AffectsArrange);
        get horizontalAlignment(): HorizontalAlignment {
            return <HorizontalAlignment>super.getValue(FrameworkElement.horizontalAlignmentProperty);
        }
        set horizontalAlignment(value: HorizontalAlignment) {
            super.setValue(FrameworkElement.horizontalAlignmentProperty, value);
        }

        //margin property
        static marginProperty = (new FrameworkElement()).registerProperty("Margin", new Thickness(), FrameworkPropertyMetadataOptions.AffectsMeasure);
        get margin(): Thickness {
            return <Thickness>super.getValue(FrameworkElement.marginProperty);
        }
        set margin(value: Thickness) {
            super.setValue(FrameworkElement.marginProperty, value);
        }

        //dataContext property
        static dataContextProperty = (new FrameworkElement()).registerProperty("DataContext", null, FrameworkPropertyMetadataOptions.Inherits);
        get dataContext(): any {
            return super.getValue(FrameworkElement.dataContextProperty);
        }
        set dataContext(value: any) {
            super.setValue(FrameworkElement.dataContextProperty, value);
        }

        //name property
        static nameProperty = (new FrameworkElement()).registerProperty("Name", "", FrameworkPropertyMetadataOptions.AffectsRender);
        get name(): string {
            return <string>super.getValue(FrameworkElement.nameProperty);
        }
        set name(value: string) {
            super.setValue(FrameworkElement.nameProperty, value);
        }

        //tag property
        static tagProperty = (new FrameworkElement()).registerProperty("Tag");
        get tag(): any {
            return <string>super.getValue(FrameworkElement.tagProperty);
        }
        set tag(value: any) {
            super.setValue(FrameworkElement.tagProperty, value);
        }
    }
       
} 