/// <reference path="..\DepProperty.ts" />
/// <reference path="..\DepObject.ts" />
/// <reference path="..\FrameworkElement.ts" /> 

module layouts.controls {
    export class NativeElement extends FrameworkElement {
        static typeName: string = "layouts.controls.NativeElement";
        get typeName(): string {
            return NativeElement.typeName;
        }

        public constructor(public elementType: string) {
            super();
        }

        private _child: UIElement;
        get child(): UIElement {
            return this._child;
        }
        set child(value: UIElement) {
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
        }

        invalidateMeasure(): void {
            this._measuredSize = null;
            super.invalidateMeasure();
        }

        attachVisualOverride(elementContainer: HTMLElement) {
            this._visual = document.createElement(this.elementType);
            var text = this.text;
            if (text != null)
                this._visual.innerHTML = text;

            if (this._child != null) {
                var childVisual = this._child.attachVisual(this._visual, true);
                if (childVisual != null && !this.arrangeChild)
                    childVisual.style.position = layouts.Consts.stringEmpty;                
            }


            super.attachVisualOverride(elementContainer);
        }

        protected onDependencyPropertyChanged(property: DepProperty, value: any, oldValue: any) {

            if (property == NativeElement.textProperty && this._visual != null) {
                this._visual.innerHTML = value;
            }

            super.onDependencyPropertyChanged(property, value, oldValue);
        }

        private _measuredSize: Size;
        protected measureOverride(constraint: Size): Size {
            if (this.arrangeChild) {
                if (this._child != null)
                    this._child.measure(constraint);
            }
            var pElement = this._visual;;
            if (this._measuredSize == null) {
                pElement.style.width = "";
                pElement.style.height = "";
                this._measuredSize = new Size(pElement.clientWidth, pElement.clientHeight);
            }
            return new Size(Math.min(constraint.width, this._measuredSize.width), Math.min(constraint.height, this._measuredSize.height));
        }

        protected arrangeOverride(finalSize: Size): Size {

            var pElement = this._visual;
            pElement.style.width = finalSize.width.toString() + "px";
            pElement.style.height = finalSize.height.toString() + "px";

            if (this.arrangeChild) {
                var child = this.child;
                if (child != null) {
                    child.arrange(new Rect(0, 0, finalSize.width, finalSize.height));
                }
            }

            return finalSize;
        }

        static textProperty = DepObject.registerProperty(NativeElement.typeName, "Text", null, FrameworkPropertyMetadataOptions.AffectsMeasure | FrameworkPropertyMetadataOptions.AffectsRender, (v) => String(v));
        get text(): string {
            return <string>this.getValue(NativeElement.textProperty);
        }
        set text(value: string) {
            this.setValue(NativeElement.textProperty, value);
        }

        static arrangeChildProperty = DepObject.registerProperty(NativeElement.typeName, "ArrangeChild", true, FrameworkPropertyMetadataOptions.None, (v) => v != null && v.trim().toLowerCase() == "true");
        get arrangeChild(): boolean {
            return <boolean>this.getValue(NativeElement.arrangeChildProperty);
        }
        set arrangeChild(value: boolean) {
            this.setValue(NativeElement.arrangeChildProperty, value);
        }

    }

    export class div extends NativeElement {
        static typeName: string = "layouts.controls.div";
        get typeName(): string {
            return div.typeName;
        }

        constructor() {
            super("div");
        }
    }

    export class a extends NativeElement {
        static typeName: string = "layouts.controls.a";
        get typeName(): string {
            return a.typeName;
        }

        constructor() {
            super("a");
        }
    }

    export class img extends NativeElement {
        static typeName: string = "layouts.controls.img";
        get typeName(): string {
            return img.typeName;
        }

        constructor() {
            super("img");
        }
    }

    export class i extends NativeElement {
        static typeName: string = "layouts.controls.i";
        get typeName(): string {
            return i.typeName;
        }

        constructor() {
            super("i");
        }
    }

    export class ul extends NativeElement {
        static typeName: string = "layouts.controls.ul";
        get typeName(): string {
            return ul.typeName;
        }

        constructor() {
            super("ul");
        }
    }

    export class li extends NativeElement {
        static typeName: string = "layouts.controls.li";
        get typeName(): string {
            return li.typeName;
        }

        constructor() {
            super("li");
        }
    }

    export class nav extends NativeElement {
        static typeName: string = "layouts.controls.nav";
        get typeName(): string {
            return nav.typeName;
        }

        constructor() {
            super("nav");
        }
    }

    export class span extends NativeElement {
        static typeName: string = "layouts.controls.span";
        get typeName(): string {
            return span.typeName;
        }

        constructor() {
            super("span");
        }
    }
    
    export class h1 extends NativeElement {
        static typeName: string = "layouts.controls.h1";
        get typeName(): string {
            return h1.typeName;
        }

        constructor() {
            super("h1");
        }
    }

    export class h2 extends NativeElement {
        static typeName: string = "layouts.controls.h2";
        get typeName(): string {
            return h2.typeName;
        }

        constructor() {
            super("h2");
        }
    }

    export class h3 extends NativeElement {
        static typeName: string = "layouts.controls.h3";
        get typeName(): string {
            return h3.typeName;
        }

        constructor() {
            super("h3");
        }
    }

    export class h4 extends NativeElement {
        static typeName: string = "layouts.controls.h4";
        get typeName(): string {
            return h4.typeName;
        }

        constructor() {
            super("h4");
        }
    }

    export class h5 extends NativeElement {
        static typeName: string = "layouts.controls.h5";
        get typeName(): string {
            return h5.typeName;
        }

        constructor() {
            super("h5");
        }
    }

    //export class div extends NativeElement {
    //    static typeName: string = "layouts.controls.div";
    //    get typeName(): string {
    //        return div.typeName;
    //    }

    //    constructor() {
    //        super("div");
    //    }
    //}

    //export class a extends NativeElement {
    //    static typeName: string = "layouts.controls.a";
    //    get typeName(): string {
    //        return a.typeName;
    //    }

    //    constructor() {
    //        super("a");
    //    }


    //    protected measureOverride(constraint: Size): Size {
    //        var text = this.text;
    //        var mySize = new Size();
    //        var pElement = <HTMLAnchorElement>this._visual;
    //        var txtChanged = (pElement.innerText != text);

    //        if (isFinite(constraint.width))
    //            pElement.style.maxWidth = constraint.width + "px";
    //        if (isFinite(constraint.height))
    //            pElement.style.maxHeight = constraint.height + "px";
    //        pElement.style.width = "auto";
    //        pElement.style.height = "auto";
    //        if (txtChanged) {
    //            pElement.innerHTML = this.text;
    //        }
    //        mySize = new Size(pElement.clientWidth, pElement.clientHeight);

    //        if (txtChanged && this.renderSize != null) {
    //            pElement.style.width = this.renderSize.width.toString() + "px";
    //            pElement.style.height = this.renderSize.height.toString() + "px";
    //        }

    //        return mySize;
    //    }

    //    static hrefProperty = DepObject.registerProperty(a.typeName, "href", null, FrameworkPropertyMetadataOptions.AffectsMeasure | FrameworkPropertyMetadataOptions.AffectsRender, (v) => String(v));
    //    get href(): string {
    //        return <string>this.getValue(a.hrefProperty);
    //    }
    //    set href(value: string) {
    //        this.setValue(a.hrefProperty, value);
    //    }

    //    static textProperty = DepObject.registerProperty(a.typeName, "Text", null, FrameworkPropertyMetadataOptions.AffectsMeasure | FrameworkPropertyMetadataOptions.AffectsRender, (v) => String(v));
    //    get text(): string {
    //        return <string>this.getValue(a.textProperty);
    //    }
    //    set text(value: string) {
    //        this.setValue(a.textProperty, value);
    //    }
    //}
} 