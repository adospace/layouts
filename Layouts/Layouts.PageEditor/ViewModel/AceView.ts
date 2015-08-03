
class AceView extends layouts.FrameworkElement {
    static typeName: string = "aceEditor";
    get typeName(): string {
        return AceView.typeName;
    }

    private _editor: AceAjax.Editor;
    protected _divElement: HTMLDivElement;
    attachVisualOverride(elementContainer: HTMLElement) {

        this._visual = this._divElement = document.createElement("div");
        super.attachVisualOverride(elementContainer);

        if (this._editor == null) {
            this._editor = ace.edit(this._visual);
            this._editor.setTheme("ace/theme/clouds");
            this._editor.getSession().setMode("ace/mode/xml");
            this._editor.addEventListener("change", (ev) =>
                {
                    if (this._changeTimer == null)
                        this._changeTimer = new layouts.Timer((timer) => this.updateSourceProperty(), 1000);

                    this._changeTimer.start();
            });

            if (this.sourceCode != null)
                this._editor.setValue(this.sourceCode);
        }

    }

    _changeTimer: layouts.Timer = null;
    onDocumentChange(): any {
    }

    _reentrantFlag = false;
    updateSourceProperty() {
        this._changeTimer.stop();
        this._reentrantFlag = true;
        this.sourceCode = this._editor.getValue()
        this._reentrantFlag = false;
    }

    //sourceCode property
    static sourceCodeProperty = layouts.DepObject.registerProperty(AceView.typeName, "SourceCode", null);
    get sourceCode(): string {
        return <string>this.getValue(AceView.sourceCodeProperty);
    }
    set sourceCode(value: string) {
        this.setValue(AceView.sourceCodeProperty, value);
    }

    protected onDependencyPropertyChanged(property: layouts.DepProperty, value: any, oldValue: any) {
        if (property == AceView.sourceCodeProperty &&
            this._editor != null &&
            !this._reentrantFlag)
            this._editor.setValue(value);

        super.onDependencyPropertyChanged(property, value, oldValue);
    }


}
