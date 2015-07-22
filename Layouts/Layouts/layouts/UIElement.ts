/// <reference path="DepProperty.ts" />
/// <reference path="DepObject.ts" />

module layouts {
    export class Size { constructor(public width: number = 0, public height: number = 0) { } }
    export class Rect { constructor(public x: number = 0, public y: number = 0, public width: number = 0, public height: number = 0) { } get size(): Size { return new Size(this.width, this.height); } }
    export class Vector { constructor(public x: number = 0, public y: number = 0) { } }

    export enum FrameworkPropertyMetadataOptions {
        /// No flags
        None = 0x000,

        /// This property affects measurement
        AffectsMeasure = 0x001,

        /// This property affects arragement
        AffectsArrange = 0x002,

        /// This property affects parent's measurement
        AffectsParentMeasure = 0x004,

        /// This property affects parent's arrangement
        AffectsParentArrange = 0x008,

        /// This property affects rendering
        AffectsRender = 0x010,

        /// This property inherits to children
        Inherits = 0x020,

        /// NOT SUPPORTED: 
        /// This property causes inheritance and resource lookup to override values 
        /// of InheritanceBehavior that may be set on any FE in the path of lookup
        OverridesInheritanceBehavior = 0x040,

        /// This property does not support data binding
        NotDataBindable = 0x080,

        /// Data bindings on this property default to two-way
        BindsTwoWayByDefault = 0x100,
    }

    export class UIElement extends DepObject {

        static typeName: string = "layouts.UIElement";
        get typeName(): string {
            return UIElement.typeName;
        }


        desideredSize: Size;
        renderSize: Size;

        ///Measure Pass
        private previousAvailableSize: Size;
        measure(availableSize: Size): void {

            if (!this.isVisible) {
                this.desideredSize = new Size();
                return;
            }

            var isCloseToPreviousMeasure = this.previousAvailableSize == null ? false : availableSize.width.isCloseTo(this.previousAvailableSize.width) &&
                availableSize.height.isCloseTo(this.previousAvailableSize.height);

            if (!this.measureDirty && isCloseToPreviousMeasure)
                return;

            this.previousAvailableSize = availableSize;
            this.desideredSize = this.measureCore(availableSize);
            this.measureDirty = false;
        }
        protected measureCore(availableSize: Size): Size {
            return new Size();
        }

        ///Arrange Pass
        private finalRect: Rect;
        private previousFinalRect: Rect;
        arrange(finalRect: Rect): void {
            if (this.measureDirty)
                this.measure(finalRect.size);

            if (!this.isVisible)
                return;

            var isCloseToPreviousArrange = this.previousFinalRect == null ? false :
                finalRect.x.isCloseTo(this.previousFinalRect.x) &&
                finalRect.y.isCloseTo(this.previousFinalRect.y) &&
                finalRect.width.isCloseTo(this.previousFinalRect.width) &&
                finalRect.height.isCloseTo(this.previousFinalRect.height);

            if (!this.arrangeDirty && isCloseToPreviousArrange)
                return;

            this.layoutInvalid = true;
            this.previousFinalRect = finalRect;
            this.arrangeCore(finalRect);

            this.finalRect = finalRect;

            this.arrangeDirty = false;
        }
        protected arrangeCore(finalRect: Rect): void {
            this.renderSize = finalRect.size;
        }

        ///Render Pass
        layout() {
            if (this.layoutInvalid) {
                this.layoutOverride();
                this.layoutInvalid = false;
            }
        }
        protected layoutOverride() {

        }

        ///Attach page visual tree
        protected _visual: HTMLElement;
        attachVisual(elementContainer: HTMLElement): void {
            if (elementContainer != null &&
                this._visual != null &&
                this._visual.parentElement != null &&
                this._visual.parentElement != elementContainer)
                this._visual.parentElement.removeChild(this._visual);

            if (this._visual == null) {
                this.attachVisualOverride(elementContainer);
                elementContainer.appendChild(this._visual);
            }
        }

        protected attachVisualOverride(elementContainer: HTMLElement): void {

        }

        protected onPropertyChanged(property: DepProperty, value: any) {
            var options = <FrameworkPropertyMetadataOptions>property.options;
            if (options != null)
            {
                if ((options & FrameworkPropertyMetadataOptions.AffectsMeasure) != 0)
                    this.invalidateMeasure();
                else if ((options & FrameworkPropertyMetadataOptions.AffectsArrange) != 0)
                    this.invalidateArrange();
                else if ((options & FrameworkPropertyMetadataOptions.AffectsParentMeasure) != 0 && this._parent != null)
                    this._parent.invalidateMeasure();
                else if ((options & FrameworkPropertyMetadataOptions.AffectsParentArrange) != 0 && this._parent != null)
                    this._parent.invalidateArrange();
                else if ((options & FrameworkPropertyMetadataOptions.AffectsRender) != 0)
                    this.invalidateLayout();
            }
        }

        getValue(property: DepProperty): any {
            if (this.localPropertyValueMap[property.name] == null) {
                var options = <FrameworkPropertyMetadataOptions>property.options;
                if (options != null &&
                    parent != null &&
                    (options & FrameworkPropertyMetadataOptions.Inherits) != 0) {
                    //search property on parent
                    return this._parent.getValue(property);
                }

                //get default
                return property.defaultValue;
            }

            //there is a local value
            return this.localPropertyValueMap[property.name];
        }

        private measureDirty: boolean = true;
        invalidateMeasure(): void {
            if (!this.measureDirty) {
                this.measureDirty = true;
                this.arrangeDirty = true;
                this.layoutInvalid = true;
                if (this._parent != null)
                    this._parent.invalidateMeasure();
            }
        }

        private arrangeDirty: boolean = true;
        invalidateArrange(): void {
            if (!this.arrangeDirty) {
                this.arrangeDirty = true;
                this.layoutInvalid = true;
                if (this._parent != null)
                    this._parent.invalidateArrange();
            }
        }

        private layoutInvalid: boolean = true;
        invalidateLayout(): void {
            if (!this.layoutInvalid) {
                this.layoutInvalid = true;
                if (this._parent != null)
                    this._parent.invalidateLayout();
            }
        }
        private _parent: UIElement;
        get parent(): UIElement {
            return this._parent;
        }

        set parent(newParent: UIElement) {
            if (this._parent != newParent) {
                var oldParent = this._parent;
                this._parent = newParent;
                this.onParentChanged(oldParent, newParent);
            }
        }

        protected onParentChanged(oldParent: DepObject, newParent: DepObject) {

        }

        static isVisibleProperty = DepObject.registerProperty(UIElement.typeName, "IsVisible", true, FrameworkPropertyMetadataOptions.AffectsParentMeasure | FrameworkPropertyMetadataOptions.AffectsRender);
        get isVisible(): boolean {
            return <boolean>this.getValue(UIElement.isVisibleProperty);
        }
        set isVisible(value: boolean) {
            this.setValue(UIElement.isVisibleProperty, value);
        }
        
        static styleProperty = DepObject.registerProperty(UIElement.typeName, "cssStyle", "", FrameworkPropertyMetadataOptions.AffectsMeasure | FrameworkPropertyMetadataOptions.AffectsRender);
        get cssStyle(): string {
            return <string>this.getValue(UIElement.styleProperty);
        }
        set cssStyle(value: string) {
            this.setValue(UIElement.styleProperty, value);
        }

        static classProperty = DepObject.registerProperty(UIElement.typeName, "cssClass", "", FrameworkPropertyMetadataOptions.AffectsMeasure | FrameworkPropertyMetadataOptions.AffectsRender);
        get cssClass(): string {
            return <string>this.getValue(UIElement.classProperty);
        }
        set cssClass(value: string) {
            this.setValue(UIElement.classProperty, value);
        }

    }
} 