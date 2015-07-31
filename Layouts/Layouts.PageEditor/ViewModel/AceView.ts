
class AceView extends layouts.FrameworkElement {
    static typeName: string = "aceEditor";
    get typeName(): string {
        return AceView.typeName;
    }

    static _counter: number = 0;
    current: number;

    private _editor: AceAjax.Editor;
    protected _divElement: HTMLDivElement;
    attachVisualOverride(elementContainer: HTMLElement) {

        this._visual = this._divElement = document.createElement("div");
        super.attachVisualOverride(elementContainer);

        if (this._editor == null) {
            this._editor = ace.edit(this._visual);
            this._editor.setTheme("ace/theme/clouds");
            this._editor.getSession().setMode("ace/mode/xml");
            this._editor.setFontSize("16px");
        }

        this.current = AceView._counter++;
    }

    //protected measureOverride(constraint: layouts.Size): layouts.Size {
    //    var mySize = new layouts.Size(100,100);



    //    return mySize;
    //}

    //protected arrangeOverride(finalSize: layouts.Size): layouts.Size {

    //    return finalSize;
    //}


}
