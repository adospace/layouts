var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var AddArticleDialogViewModel = (function (_super) {
    __extends(AddArticleDialogViewModel, _super);
    function AddArticleDialogViewModel(view, category) {
        _super.call(this);
        this.view = view;
        this.category = category;
    }
    Object.defineProperty(AddArticleDialogViewModel.prototype, "typeName", {
        get: function () {
            return AddArticleDialogViewModel.typeName;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AddArticleDialogViewModel.prototype, "title", {
        get: function () {
            return "Add Article";
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AddArticleDialogViewModel.prototype, "articleTitle", {
        get: function () {
            return this._articleTitle;
        },
        set: function (value) {
            if (this._articleTitle != value) {
                var oldValue = this._articleTitle;
                this._articleTitle = value;
                this.onPropertyChanged("articleTitle", value, oldValue);
                this.addArticleCommand.canExecuteChanged();
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AddArticleDialogViewModel.prototype, "closeDialogCommand", {
        get: function () {
            var _this = this;
            if (this._closeDialogCommand == null)
                this._closeDialogCommand = new layouts.Command(function (cmd, p) { return _this.onCloseDialog(p); }, function (cmd, p) { return true; });
            return this._closeDialogCommand;
        },
        enumerable: true,
        configurable: true
    });
    AddArticleDialogViewModel.prototype.onCloseDialog = function (article) {
        layouts.LayoutManager.closeDialog(this.view);
    };
    Object.defineProperty(AddArticleDialogViewModel.prototype, "appViewModel", {
        get: function () {
            return layouts.Application.current.page.dataContext;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AddArticleDialogViewModel.prototype, "addArticleCommand", {
        get: function () {
            var _this = this;
            if (this._addArticleCommand == null)
                this._addArticleCommand = new layouts.Command(function (cmd, p) { return _this.onAddArticle(p); }, function (cmd, p) { return _this.articleTitle != null && _this.articleTitle.trim().length > 0; });
            return this._addArticleCommand;
        },
        enumerable: true,
        configurable: true
    });
    AddArticleDialogViewModel.prototype.onAddArticle = function (article) {
        var articleAdded = this.category.articles.add(new ArticleViewModel());
        articleAdded.title = this.articleTitle;
        this.appViewModel.openArticle(articleAdded);
        layouts.LayoutManager.closeDialog(this.view);
    };
    AddArticleDialogViewModel.typeName = "AddArticleDialogViewModel";
    return AddArticleDialogViewModel;
})(layouts.DepObject);
