

class CodeViewModel extends layouts.DepObject {
    static typeName: string = "codeViewModel";
    get typeName(): string {
        return CodeViewModel.typeName;
    }

    constructor(public owner: AppViewModel) {
        super();
    }

    private _title: string;
    get title(): string {
        return this._title;
    }
    set title(value: string) {
        if (this._title != value) {
            var oldValue = this._title;
            this._title = value;
            this.onPropertyChanged("title", value, oldValue);
        }
    }

    private _sourceCode: string;
    get sourceCode(): string {
        return this._sourceCode;
    }
    set sourceCode(value: string) {
        if (this._sourceCode != value) {
            var oldValue = this._sourceCode;
            this._sourceCode = value;
            this.onPropertyChanged("sourceCode", value, oldValue);
            this.onSourceCodeChanged();
        }
    }

    private _oldParsedDocument: HTMLElement;
    onSourceCodeChanged() {
        try {
            var parser = new DOMParser();
            var doc = parser.parseFromString(this.sourceCode, "text/xml").documentElement;

            if (this._oldParsedDocument == null ||
                !layouts.XamlReader.compareXml(this._oldParsedDocument, doc)) {
                this._oldParsedDocument = doc;
                var loader = new layouts.XamlReader();
                this.createdControl = loader.Load(doc);
                localStorage.setItem(this.title, this.sourceCode);
            }
        }
        catch (error)
        {
            return;
        }
    }

    private _createdControl: layouts.UIElement;
    get createdControl(): layouts.UIElement {
        return this._createdControl;
    }
    set createdControl(value: layouts.UIElement) {
        if (this._createdControl != value) {
            var oldValue = this._createdControl;
            this._createdControl = value;
            this.onPropertyChanged("createdControl", value, oldValue);
        }
    }

    private _view: layouts.controls.Border;
    get view(): layouts.controls.Border {
        if (this._view == null) {
            this._view = CodeView.getView();
        }

        return this._view;
    }

    private _selectCommand: layouts.Command;
    get selectCommand(): layouts.Command {
        if (this._selectCommand == null)
            this._selectCommand = new layouts.Command((cmd, p) => this.onSelectItem(), (cmd, p) => true);
        return this._selectCommand;
    }

    onSelectItem() {
        //reset selected to null will force layouts to reset main area (Controltemplate)
        //this.owner.selected = null;
        this.owner.selected = this;
    }

}  