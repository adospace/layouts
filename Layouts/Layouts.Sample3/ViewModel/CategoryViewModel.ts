
class CategoryViewModel extends layouts.DepObject {
    static typeName: string = "CategoryViewModel";
    get typeName(): string {
        return CategoryViewModel.typeName;
    }

    private _articles: layouts.ObservableCollection<ArticleViewModel> = new layouts.ObservableCollection<ArticleViewModel>();

    get articles(): layouts.ObservableCollection<ArticleViewModel> {
        return this._articles;
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

    private _isExpanded: boolean = false;
    get isExpanded(): boolean {
        return this._isExpanded;
    }
    set isExpanded(value: boolean) {
        if (this._isExpanded != value) {
            var oldValue = this._isExpanded;
            this._isExpanded = value;
            this.onPropertyChanged("isExpanded", value, oldValue);
        }
    }

    private _expandCommand: layouts.Command;
    get expandCommand(): layouts.Command {
        if (this._expandCommand == null)
            this._expandCommand = new layouts.Command((cmd, p) => this.onToggleExpansion(), (cmd, p) => true);
        return this._expandCommand;
    }

    onToggleExpansion() {
        this.isExpanded = !this.isExpanded;
    }
    
    private _addArticleCommand: layouts.Command;
    get addArticleCommand(): layouts.Command {
        if (this._addArticleCommand == null)
            this._addArticleCommand = new layouts.Command((cmd, p) => this.onAddArticle(), (cmd, p) => true);
        return this._addArticleCommand;
    }

    onAddArticle() {
        var dlg = new AddArticleDialogView();
        dlg.dataContext = new AddArticleDialogViewModel(dlg, this);
        layouts.LayoutManager.showDialog(dlg);
    }
} 