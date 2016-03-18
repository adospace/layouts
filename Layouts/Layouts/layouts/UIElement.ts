/// <reference path="DepProperty.ts" />
/// <reference path="DepObject.ts" />

module layouts {
    export class Size {
        constructor(public width: number = 0, public height: number = 0) {
        }

        toRect(): Rect {
            return new Rect(0, 0, this.width, this.height);
        }
    }
    export class Rect {
        constructor(public x: number = 0, public y: number = 0, public width: number = 0, public height: number = 0) {
        }
        get size(): Size {
            return new Size(this.width, this.height);
        }
    }
    export class Vector {
        constructor(public x: number = 0, public y: number = 0) {
        }
        get isEmpty(): boolean {
            return this.x == 0 && this.x == 0;
        }
        add(other: Vector): Vector {
            return new Vector(this.x + other.x, this.y + other.y);
        }
    }

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

    export class ExtendedProperty {
        constructor(public name: string, public value: string) {
        }
    }

    export class UIElement extends DepObject implements ISupportCommandCanExecuteChanged  {

        static typeName: string = "layouts.UIElement";
        get typeName(): string {
            return UIElement.typeName;
        }


        desiredSize: Size;
        renderSize: Size;

        ///Measure Pass
        private previousAvailableSize: Size;
        measure(availableSize: Size): void {

            if (!this.isVisible) {
                this.desiredSize = new Size();
                this.measureDirty = false;
                return;
            }

            var isCloseToPreviousMeasure = this.previousAvailableSize == null ? false : availableSize.width.isCloseTo(this.previousAvailableSize.width) &&
                availableSize.height.isCloseTo(this.previousAvailableSize.height);

            if (!this.measureDirty && isCloseToPreviousMeasure)
                return;

            this.previousAvailableSize = availableSize;
            this.desiredSize = this.measureCore(availableSize);
            if (isNaN(this.desiredSize.width) ||
                !isFinite(this.desiredSize.width) ||
                isNaN(this.desiredSize.height) ||
                !isFinite(this.desiredSize.height))
                throw new Error("measure pass must return valid size");

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
        protected relativeOffset: Vector = null;
        layout(relativeOffset: Vector = null) {
            if (this.layoutInvalid) {
                this.relativeOffset = relativeOffset;
                this.layoutOverride();
                if (this._visual != null &&
                    this.isVisible)
                    //if visual is hidden here means that I just added it hidden to DOM
                    //so restore it visible (see attachVisual() below)
                    this._visual.style.visibility = "";

                this.layoutInvalid = false;

                var layoutUpdated = this.layoutUpdated;
                if (layoutUpdated != null)
                    layoutUpdated.invoke(this);
            }
        }
        protected layoutOverride() {
            if (this._visual != null) {
                if (this.relativeOffset != null) {
                    this._visual.style.marginTop = this.relativeOffset.y.toString() + "px";
                    this._visual.style.marginLeft = this.relativeOffset.x.toString() + "px";
                }

            }
        }



        ///Attach page visual tree (attach to null to remove it from DOM)
        protected _visual: HTMLElement;
        attachVisual(elementContainer: HTMLElement, showImmediately:boolean = false): void {

            //1. if a visual is not yet created and we have a container
            //try create it now
            if (this._visual == null &&
                elementContainer != null) 
                this.attachVisualOverride(elementContainer);

            //1.b if a visual doesn't exists but parent set container to null
            //call attachVisualOverride and let derived class handle the case (i.e. Page)
            if (this._visual == null &&
                elementContainer == null)
                this.attachVisualOverride(null);

            //2. if visual is still null we have done
            if (this._visual == null)
                return;

            //3. if visual is not under container...
            if (elementContainer != this._visual.parentElement) {
                
                //4. remove visual from old container 
                if (this._visual.parentElement != null) {
                    //Note children of this are not removed from DOM
                    //for performance reasons, it would take to much to remove any descendants from DOM
                    var parentElement = this._visual.parentElement;
                    parentElement.removeChild(this._visual);
                    //this will notify any children of removal
                    this.visualDisconnected(parentElement);
                }

                //5. if container is valid (not null) add visual under it
                //note container could be null in this case visual is just detached from DOM
                if (elementContainer != null) {
                    //before add the element to the DOM tree hide to avoid flickering
                    //visual will be restored to visible after it's correctly positioned
                    //see above layout()
                    //NOTE: we use CSS visibility instead of hidden property because with former
                    //element size remains valid 
                    //http://stackoverflow.com/questions/2345784/jquery-get-height-of-hidden-element-in-jquery
                    if (!showImmediately)
                        this._visual.style.visibility = "hidden";

                    //makes layout invalid so to restore any render in case element was just removed and readded to tree
                    this.invalidateMeasure();

                    elementContainer.appendChild(this._visual);
                    if (elementContainer != null)
                        this.visualConnected(elementContainer);
                }
            }
        }

        protected attachVisualOverride(elementContainer: HTMLElement): void {
            if (this._visual == null)
                return;
            
            //apply extended properties to html element
            this._extendedProperties.forEach(ep=> {
                this._visual.style[ep.name] = ep.value;
            });

            this._visual.style.visibility = this.isVisible ? "" : "hidden"
            if (this.command != null)
                this._visual.onmousedown = (ev) => this.onMouseDown(ev);
            if (this.popup != null)
                this._visual.onmouseup = (ev) => this.onMouseUp(ev);

            var name = this.id;
            if (this._visual.id != name &&
                name != null)
                this._visual.id = name;
            var className = this.cssClass;
            if (this._visual.className != className &&
                className != null) {
                this._visual.className = className;
            }

            this._visual.style.position = "absolute";
        }

        protected onMouseDown(ev: MouseEvent) {
            var command = this.command;
            var commandParameter = this.commandParameter;
            if (command != null && command.canExecute(commandParameter)) {
                command.execute(commandParameter);
                this.onCommandCanExecuteChanged(command);
                ev.stopPropagation();
            }
        }

        protected onMouseUp(ev: MouseEvent) {
            var popup = this.popup;
            if (popup != null) {
                LayoutManager.showPopup(popup);
                ev.stopPropagation();
                document.addEventListener("mouseup", function () {
                    this.removeEventListener("mouseup", arguments.callee);
                    LayoutManager.closePopup(popup);
                });
            }

        }


        getBoundingClientRect(): ClientRect {
            if (this._visual == null)
                throw new Error("Unable to get bounding rect for element not linked to DOM");
            return this._visual.getBoundingClientRect();
        }

        protected visualConnected(elementContainer: HTMLElement): void {
            this.parentVisualConnected(this, elementContainer);
        }

        protected parentVisualConnected(parent: UIElement, elementContainer: HTMLElement) {
            if (this._logicalChildren == null)
                return;
            this._logicalChildren.forEach(c => c.parentVisualConnected(parent, elementContainer));
        }

        protected visualDisconnected(elementContainer: HTMLElement): void {
            this.parentVisualDisconnected(this, elementContainer);
        }

        protected parentVisualDisconnected(parent: UIElement, elementContainer: HTMLElement) {
            if (this._logicalChildren == null)
                return;
            this._logicalChildren.forEach(c => c.parentVisualDisconnected(parent, elementContainer));
        }

        protected onDependencyPropertyChanged(property: DepProperty, value: any, oldValue: any) {
            //probably this checks as well as relative properties are to be moved down to FrameworkElement
            if (property == UIElement.commandProperty) {
                if (oldValue != null) {
                    (<Command>oldValue).offCanExecuteChangeNotify(this);
                    if (this._visual != null)
                        this._visual.onmousedown = null;
                }
                if (value != null) {
                    (<Command>value).onCanExecuteChangeNotify(this);
                    if (this._visual != null)
                        this._visual.onmousedown = (ev) => this.onMouseDown(ev);
                }
            }
            else if (property == UIElement.popupProperty) {
                if (oldValue != null) {
                    if (this._visual != null)
                        this._visual.onmouseup = null;
                    if ((<UIElement>oldValue).parent == this)
                        (<UIElement>oldValue).parent = null;
                }
                if (value != null) {
                    if (this._visual != null)
                        this._visual.onmouseup = (ev) => this.onMouseUp(ev);
                    (<UIElement>value).parent = this;
                }
            }
            else if (property == UIElement.isVisibleProperty) {
                if (this._visual != null)
                    this._visual.style.visibility = <boolean>value ? "" : "hidden"
            }
            else if (property == UIElement.classProperty) {
                var className = this.cssClass;
                if (this._visual != null && this._visual.className != className &&
                    className != null) {
                    this._visual.className = className;
                }
            }

            var options = <FrameworkPropertyMetadataOptions>property.options;
            if ((options & FrameworkPropertyMetadataOptions.AffectsMeasure) != 0)
                this.invalidateMeasure();
            if ((options & FrameworkPropertyMetadataOptions.AffectsArrange) != 0)
                this.invalidateArrange();
            if ((options & FrameworkPropertyMetadataOptions.AffectsParentMeasure) != 0 && this._parent != null)
                this._parent.invalidateMeasure();
            if ((options & FrameworkPropertyMetadataOptions.AffectsParentArrange) != 0 && this._parent != null)
                this._parent.invalidateArrange();
            if ((options & FrameworkPropertyMetadataOptions.AffectsRender) != 0)
                this.invalidateLayout();
            if ((options & FrameworkPropertyMetadataOptions.Inherits) != 0 && this._logicalChildren != null)
                //foreach child notify property changing event, unfortunately
                //there is not a more efficient way than walk logical tree down to leaves
                this._logicalChildren.forEach((child) => child.onDependencyPropertyChanged(property, value, oldValue));

            super.onDependencyPropertyChanged(property, value, oldValue);
        }

        onCommandCanExecuteChanged(command: Command) {
        }

        getValue(property: DepProperty): any {
            if (!(property.name in this.localPropertyValueMap)) {
                var options = <FrameworkPropertyMetadataOptions>property.options;
                if (options != null &&
                    this._parent != null &&
                    (options & FrameworkPropertyMetadataOptions.Inherits) != 0) {
                    //search property on parent
                    return this._parent.getValue(property);
                }

                //get default
                return property.getDefaultValue(this);
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

        private _logicalChildren: Array<UIElement>;
        findElementByName(name: string): UIElement {
            if (name == this.id)
                return this;

            if (this._logicalChildren != null) {
                for (var i = 0; i < this._logicalChildren.length; i++) {
                    let child = this._logicalChildren[i];
                    let foundElement = child.findElementByName(name);
                    if (foundElement != null)
                        return foundElement;
                }
            }

            return null;
        }

        private _parent: UIElement;
        get parent(): UIElement {
            return this._parent;
        }

        set parent(newParent: UIElement) {
            if (this._parent != newParent) {
                var oldParent = this._parent;
                if (oldParent != null) {
                    var indexOfElement = oldParent._logicalChildren.indexOf(this);
                    oldParent._logicalChildren.splice(indexOfElement, 1);
                }

                this._parent = newParent;

                if (newParent != null) {
                    if (newParent._logicalChildren == null)
                        newParent._logicalChildren = new Array<UIElement>();
                    newParent._logicalChildren.push(this);
                    if (this.measureDirty)
                        this._parent.invalidateMeasure();
                }

                this.notifyInheritsPropertiesChange();

                this.onParentChanged(oldParent, newParent);
            }
        }

        private notifyInheritsPropertiesChange() {
            for (let propertyName in this.localPropertyValueMap) {
                var property = DepObject.lookupProperty(this, propertyName);
                var options = property == null ? null : <FrameworkPropertyMetadataOptions>property.options;
                if (options != null &&
                    (options & FrameworkPropertyMetadataOptions.Inherits) != 0) {
                    //if my parent changed I need to notify children to update
                    //any binding linked to my properties that has FrameworkPropertyMetadataOptions.Inherits
                    //option (most of cases dataContext)
                    //there is not a real value change, only a notification to allow binding update
                    //so value==oldValue
                    //if (this._logicalChildren != null) {
                    //    var value = this.getValue(property);
                    //    this._logicalChildren.forEach((child) => child.onDependencyPropertyChanged(property, value, value));
                    //}
                    this.onParentDependencyPropertyChanged(property);
                    //if (this._logicalChildren != null) {
                    //    this._logicalChildren.forEach((child) => child.onParentDependencyPropertyChanged(property));
                    //}
                }
            }

            if (this._parent != null)
                this._parent.notifyInheritsPropertiesChange();
        }

        //function called when a parent property changed 
        //(parent property must have FrameworkPropertyMetadataOptions.Inherits option enabled; most of cases is DataContext property)
        private onParentDependencyPropertyChanged(property) {
            if (this._logicalChildren != null) {
                this._logicalChildren.forEach((child) => child.onParentDependencyPropertyChanged(property));
            }
            //just notify subscribers of bindings
            super.onDependencyPropertyChanged(property, null, null);
        }

        protected onParentChanged(oldParent: DepObject, newParent: DepObject) {

        }

        //extended properties are key-value items that loader was unable to assign to element
        //because they didn't not correspond to any property (dependency or native) exposed by element
        protected _extendedProperties: ExtendedProperty[] = [];
        addExtentedProperty(name: string, value: string) {
            this._extendedProperties.push(new ExtendedProperty(name, value));
        }        

        static isVisibleProperty = DepObject.registerProperty(UIElement.typeName, "IsVisible", true, FrameworkPropertyMetadataOptions.AffectsMeasure | FrameworkPropertyMetadataOptions.AffectsParentMeasure | FrameworkPropertyMetadataOptions.AffectsRender);
        get isVisible(): boolean {
            return <boolean>this.getValue(UIElement.isVisibleProperty);
        }
        set isVisible(value: boolean) {
            this.setValue(UIElement.isVisibleProperty, value);
        }
        
        //static styleProperty = DepObject.registerProperty(UIElement.typeName, "cssStyle", Consts.stringEmpty, FrameworkPropertyMetadataOptions.AffectsMeasure | FrameworkPropertyMetadataOptions.AffectsParentMeasure | FrameworkPropertyMetadataOptions.AffectsRender);
        //get cssStyle(): string {
        //    return <string>this.getValue(UIElement.styleProperty);
        //}
        //set cssStyle(value: string) {
        //    this.setValue(UIElement.styleProperty, value);
        //}

        static classProperty = DepObject.registerProperty(UIElement.typeName, "class", null, FrameworkPropertyMetadataOptions.AffectsMeasure | FrameworkPropertyMetadataOptions.AffectsRender);
        get cssClass(): string {
            return <string>this.getValue(UIElement.classProperty);
        }
        set cssClass(value: string) {
            this.setValue(UIElement.classProperty, value);
        }

        //name property
        static idProperty = DepObject.registerProperty(UIElement.typeName, "id", Consts.stringEmpty, FrameworkPropertyMetadataOptions.AffectsRender);
        get id(): string {
            return <string>this.getValue(UIElement.idProperty);
        }
        set id(value: string) {
            this.setValue(UIElement.idProperty, value);
        }

        static commandProperty = DepObject.registerProperty(UIElement.typeName, "Command", null, FrameworkPropertyMetadataOptions.AffectsMeasure | FrameworkPropertyMetadataOptions.AffectsRender);
        get command(): Command {
            return <Command>this.getValue(UIElement.commandProperty);
        }
        set command(value: Command) {
            this.setValue(UIElement.commandProperty, value);
        }

        static commandParameterProperty = DepObject.registerProperty(UIElement.typeName, "CommandParameter", null, FrameworkPropertyMetadataOptions.AffectsMeasure | FrameworkPropertyMetadataOptions.AffectsRender);
        get commandParameter(): any {
            return this.getValue(UIElement.commandParameterProperty);
        }
        set commandParameter(value: any) {
            this.setValue(UIElement.commandParameterProperty, value);
        }
        
        //get or set popup property for the element
        static popupProperty = DepObject.registerProperty(UIElement.typeName, "Popup", null, FrameworkPropertyMetadataOptions.AffectsRender);
        get popup(): any {
            return <string>this.getValue(UIElement.popupProperty);
        }
        set popup(value: any) {
            this.setValue(UIElement.popupProperty, value);
        }

        static layoutUpdatedProperty = DepObject.registerProperty(UIElement.typeName, "LayoutUpdated", null, FrameworkPropertyMetadataOptions.None);
        get layoutUpdated(): EventAction {
            return <EventAction>this.getValue(UIElement.layoutUpdatedProperty);
        }
        set layoutUpdated(value: EventAction) {
            this.setValue(UIElement.layoutUpdatedProperty, value);
        }
    }
} 