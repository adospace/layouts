

class CodeViewModel extends layouts.DepObject {
    static typeName: string = "codeViewModel";
    get typeName(): string {
        return CodeViewModel.typeName;
    }

    constructor(public owner: AppViewModel) {
        super();
    }

    _title: string;
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

    _sourceCode: string;
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

    onSourceCodeChanged() {
        try {
            var parser = new DOMParser();
            var doc = parser.parseFromString(this.sourceCode, "text/xml").documentElement;

            var loader = new layouts.XamlReader();
            this.createdControl = loader.Load(doc);
        }
        catch (error)
        {
            return;
        }
    }

    _createdControl: layouts.UIElement;
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

    _view: layouts.controls.Border;
    get view(): layouts.controls.Border {
        if (this._view == null) {
            this._view = CodeView.getView();
            this._view.setValue(layouts.FrameworkElement.dataContextProperty, this);
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
        this.owner.selected = this;
    }

}  