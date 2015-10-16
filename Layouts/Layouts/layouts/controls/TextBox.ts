﻿/// <reference path="..\DepProperty.ts" />
/// <reference path="..\DepObject.ts" />
/// <reference path="..\FrameworkElement.ts" /> 

module layouts.controls {
    export class TextBox extends FrameworkElement {
        static typeName: string = "layouts.controls.TextBox";
        get typeName(): string {
            return TextBox.typeName;
        }


        private _pElement: HTMLInputElement;
        attachVisualOverride(elementContainer: HTMLElement) {

            this._visual = this._pElement = document.createElement("input");

            this._pElement.value = this.text;
            this._pElement.type = this.type;
            this._pElement.placeholder = this.placeholder;
            this._pElement.oninput = (ev) => this.onTextChanged();
            this._pElement.onchange = (ev) => this.onTextChanged();
            this._pElement.onkeypress = (ev) => this.onTextChanged();
            this._pElement.onpaste = (ev) => this.onTextChanged();
            super.attachVisualOverride(elementContainer);
        }

        onTextChanged() {
            this.text = this._pElement.value;
        }

        private _measuredSize: Size;
        //private _clientSizeOffset: Size;

        //protected measureOverride(constraint: Size): Size {
        //    //if (this._measuredSize == null) {
        //        var text = this.text;
        //        var mySize = new Size();
        //        var pElement = this._pElement;
        //        var txtChanged = (pElement.value != text);

        //        if (isFinite(constraint.width))
        //            pElement.style.maxWidth = constraint.width + "px";
        //        if (isFinite(constraint.height))
        //            pElement.style.maxHeight = constraint.height + "px";
        //        pElement.style.width = "auto";
        //        pElement.style.height = "auto";
        //        if (txtChanged) {
        //            pElement.value = this.text;
        //        }            
            
        //        //client size will maintain internal size of object
        //        //base class FrameworkElement is going to use RenderSize to set
        //        //style dimension of element
        //        this._clientSizeOffset = new Size(pElement.offsetWidth - pElement.clientWidth, pElement.offsetHeight - pElement.clientHeight);
        //        this._measuredSize = new Size(pElement.offsetWidth, pElement.offsetHeight);

        //        //if (txtChanged) {
        //        //    pElement.style.width = this.clientSize.width.toString() + "px";
        //        //    pElement.style.height = this.clientSize.height.toString() + "px";
        //        //}
        //    //}

        //    return this._measuredSize;
        //}


        protected measureOverride(constraint: Size): Size {
            var pElement = this._pElement;
            if (this._measuredSize == null) {
                pElement.style.width = "";
                pElement.style.height = "";
                this._measuredSize = new Size(pElement.offsetWidth, pElement.offsetHeight);
                //this._clientSizeOffset = new Size(pElement.offsetWidth - pElement.clientWidth, pElement.offsetHeight - pElement.clientHeight);
            }
            return new Size(Math.min(constraint.width, this._measuredSize.width), Math.min(constraint.height, this._measuredSize.height));
        }

        //protected arrangeOverride(finalSize: Size): Size {

        //    var pElement = this._pElement;
        //    pElement.style.width = (finalSize.width - this._clientSizeOffset.width) + "px";
        //    pElement.style.height = (finalSize.height - this._clientSizeOffset.height) + "px";

        //    return finalSize;
        //}

        protected layoutOverride() {
            super.layoutOverride();

            //layoutOverride above set style.width and styl.height
            //at that point browser compute new offsetWidth and offetHeight
            //we need to reset style.width/height so that textbox don't exceed space
            //that out parent has reserved for this control
            if (this.renderSize != null) {
                this._pElement.style.width = (this.renderSize.width - (this._pElement.offsetWidth - this.renderSize.width) ) + "px";
                this._pElement.style.height = (this.renderSize.height - (this._pElement.offsetHeight - this.renderSize.height) ) + "px";
            }
        }

        protected onDependencyPropertyChanged(property: DepProperty, value: any, oldValue: any) {
            if (property == TextBox.textProperty) {
                var pElement = this._pElement;
                if (pElement != null) {
                    var text = <string>value;
                    this._pElement.value = text == null || text == "" ? " " : text;
                    this._measuredSize = null;
                }
            }
            else if (property == TextBox.placeholderProperty) {
                var pElement = this._pElement;
                if (pElement != null) {
                    pElement.placeholder = <string>value;
                    this._measuredSize = null;
                }
            }
            else if (property == TextBox.typeProperty) {
                var pElement = this._pElement;
                if (pElement != null) {
                    pElement.type = <string>value;
                    this._measuredSize = null;
                }
            }

            super.onDependencyPropertyChanged(property, value, oldValue);
        }

        //clientSizeOffset: Size;

        //protected measureOverride(constraint: Size): Size {
        //    var text = this.text;
        //    var mySize = new Size();
        //    var pElement = this._pElement;
        //    var txtChanged = (pElement.value != text);

        //    if (isFinite(constraint.width))
        //        pElement.style.maxWidth = constraint.width + "px";
        //    if (isFinite(constraint.height))
        //        pElement.style.maxHeight = constraint.height + "px";
        //    pElement.style.width = "auto";
        //    pElement.style.height = "auto";
        //    if (txtChanged) {
        //        pElement.value = this.text;
        //    }            
            
        //    //client size will maintain internal size of object
        //    //base class FrameworkElement is going to use RenderSize to set
        //    //style dimension of element
        //    this.clientSizeOffset = new Size(pElement.offsetWidth - pElement.clientWidth, pElement.offsetHeight - pElement.clientHeight);
        //    mySize = new Size(pElement.offsetWidth, pElement.offsetHeight);

        //    //if (txtChanged) {
        //    //    pElement.style.width = this.clientSize.width.toString() + "px";
        //    //    pElement.style.height = this.clientSize.height.toString() + "px";
        //    //}

        //    return mySize;
        //}

        //protected layoutOverride() {
        //    super.layoutOverride();

        //    //set appropriate size using saved client size in measure pass
        //    if (this.renderSize != null) {
        //        this._pElement.style.width = (this.renderSize.width - this.clientSizeOffset.width) + "px";
        //        this._pElement.style.height = (this.renderSize.height - this.clientSizeOffset.height) + "px";
        //    }
        //}

        static textProperty = DepObject.registerProperty(TextBox.typeName, "Text", null, FrameworkPropertyMetadataOptions.AffectsMeasure | FrameworkPropertyMetadataOptions.AffectsRender);
        get text(): string {
            return <string>this.getValue(TextBox.textProperty);
        }
        set text(value: string) {
            this.setValue(TextBox.textProperty, value);
        }

        static placeholderProperty = DepObject.registerProperty(TextBox.typeName, "Placeholder", "", FrameworkPropertyMetadataOptions.AffectsMeasure | FrameworkPropertyMetadataOptions.AffectsRender);
        get placeholder(): string {
            return <string>this.getValue(TextBox.placeholderProperty);
        }
        set placeholder(value: string) {
            this.setValue(TextBox.placeholderProperty, value);
        }

        static typeProperty = DepObject.registerProperty(TextBox.typeName, "Type", "text", FrameworkPropertyMetadataOptions.AffectsMeasure | FrameworkPropertyMetadataOptions.AffectsRender);
        get type(): string {
            return <string>this.getValue(TextBox.typeProperty);
        }
        set type(value: string) {
            this.setValue(TextBox.typeProperty, value);
        }
    }
} 