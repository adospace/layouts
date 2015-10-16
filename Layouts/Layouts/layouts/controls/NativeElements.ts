/// <reference path="..\DepProperty.ts" />
/// <reference path="..\DepObject.ts" />
/// <reference path="..\FrameworkElement.ts" /> 

module layouts.controls {
    export class div extends FrameworkElement {
        static typeName: string = "layouts.controls.div";
        get typeName(): string {
            return div.typeName;
        }

        //constructor(public tagName: string) {
        //    super();
        //}

        attachVisualOverride(elementContainer: HTMLElement) {
            this._visual = document.createElement("div");
            this._visual.innerHTML = this._innerXaml;
            super.attachVisualOverride(elementContainer);
        }

        private _innerXaml: string;
        setInnerXaml(value: string) {
            this._innerXaml = value;
        }

        private _measuredSize: Size;
        protected measureOverride(constraint: Size): Size {
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

            return finalSize;
        }

        //protected measureOverride(constraint: Size): Size {
        //    var mySize = new Size();
        //    var pElement = this._visual;

        //    if (isFinite(constraint.width))
        //        pElement.style.maxWidth = constraint.width + "px";
        //    if (isFinite(constraint.height))
        //        pElement.style.maxHeight = constraint.height + "px";
        //    pElement.style.width = "auto";
        //    pElement.style.height = "auto";

        //    pElement.innerHTML = this._innerXaml;

        //    mySize = new Size(pElement.clientWidth, pElement.clientHeight);

        //    if (this.renderSize != null) {
        //        pElement.style.width = this.renderSize.width.toString() + "px";
        //        pElement.style.height = this.renderSize.height.toString() + "px";
        //    }

        //    return mySize;
        //}

    }

    //export class i extends NativeElement {
    //    static typeName: string = "layouts.controls.i";
    //    get typeName(): string {
    //        return i.typeName;
    //    }

    //    constructor() {
    //        super("i");
    //    }
    //}

    //export class ul extends NativeElement {
    //    static typeName: string = "layouts.controls.ul";
    //    get typeName(): string {
    //        return ul.typeName;
    //    }

    //    constructor() {
    //        super("ul");
    //    }

    //}

    //export class li extends NativeElement {
    //    static typeName: string = "layouts.controls.li";
    //    get typeName(): string {
    //        return li.typeName;
    //    }

    //    constructor() {
    //        super("li");
    //    }
    //}

    //export class nav extends NativeElement {
    //    static typeName: string = "layouts.controls.nav";
    //    get typeName(): string {
    //        return nav.typeName;
    //    }

    //    constructor() {
    //        super("nav");
    //    }
    //}

    //export class span extends NativeElement {
    //    static typeName: string = "layouts.controls.span";
    //    get typeName(): string {
    //        return span.typeName;
    //    }

    //    constructor() {
    //        super("span");
    //    }
    //}

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