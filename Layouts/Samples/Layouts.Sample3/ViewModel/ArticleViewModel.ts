
class ArticleViewModel extends layouts.DepObject {
    static typeName: string = "ArticleViewModel";
    get typeName(): string {
        return ArticleViewModel.typeName;
    }

    constructor() {
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

    get appViewModel(): AppViewModel {
        return layouts.Application.current.page.dataContext;
    }

    private _isSelected: boolean = false;
    get isSelected(): boolean {
        return this._isSelected;
    }
    set isSelected(value: boolean) {
        if (this._isSelected != value) {
            var oldValue = this._isSelected;
            this._isSelected = value;
            this.onPropertyChanged("isSelected", value, oldValue);
        }
    }


    get url(): string {
        return "https://en.wikipedia.org/wiki/" + this.title.replace(/ /g, "_");
    }

    private _openArticleCommand: layouts.Command;
    get openArticleCommand(): layouts.Command {
        if (this._openArticleCommand == null)
            this._openArticleCommand = new layouts.Command((cmd, p) => this.onOpenArticle(p), (cmd, p) => true);
        return this._openArticleCommand;
    }

    onOpenArticle(article: ArticleViewModel) {
        this.appViewModel.openArticle(this);
    }


    private _closeArticleCommand: layouts.Command;
    get closeArticleCommand(): layouts.Command {
        if (this._closeArticleCommand == null)
            this._closeArticleCommand = new layouts.Command((cmd, p) => this.onCloseArticle(p), (cmd, p) => true);
        return this._closeArticleCommand;
    }

    onCloseArticle(article: ArticleViewModel) {
        this.appViewModel.closeArticle(this);
    }



}  