
class AddArticleDialogViewModel extends layouts.DepObject {
    static typeName: string = "AddArticleDialogViewModel";
    get typeName(): string {
        return AddArticleDialogViewModel.typeName;
    }

    constructor(public view: AddArticleDialogView, public category: CategoryViewModel) {
        super();
    }
    
    get title(): string {
        return "Add Article";
    }

    private _articleTitle: string;
    get articleTitle(): string {
        return this._articleTitle;
    }
    set articleTitle(value: string) {
        if (this._articleTitle != value) {
            var oldValue = this._articleTitle;
            this._articleTitle = value;
            this.onPropertyChanged("articleTitle", value, oldValue);
            this.addArticleCommand.canExecuteChanged();
      }
    }

    private _closeDialogCommand: layouts.Command;
    get closeDialogCommand(): layouts.Command {
        if (this._closeDialogCommand == null)
            this._closeDialogCommand = new layouts.Command((cmd, p) => this.onCloseDialog(p), (cmd, p) => true);
        return this._closeDialogCommand;
    }

    onCloseDialog(article: ArticleViewModel) {
        layouts.LayoutManager.closeDialog(this.view);
    }

    get appViewModel(): AppViewModel {
        return layouts.Application.current.page.dataContext;
    }


    private _addArticleCommand: layouts.Command;
    get addArticleCommand(): layouts.Command {
        if (this._addArticleCommand == null)
            this._addArticleCommand = new layouts.Command((cmd, p) => this.onAddArticle(p), (cmd, p) => this.articleTitle != null && this.articleTitle.trim().length > 0);
        return this._addArticleCommand;
    }

    onAddArticle(article: ArticleViewModel) {
        var articleAdded = this.category.articles.add(new ArticleViewModel());
        articleAdded.title = this.articleTitle;
        this.appViewModel.openArticle(articleAdded);
        layouts.LayoutManager.closeDialog(this.view);
    }
    

} 