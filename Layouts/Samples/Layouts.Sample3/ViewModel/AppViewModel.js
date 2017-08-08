var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var AppViewModel = (function (_super) {
    __extends(AppViewModel, _super);
    function AppViewModel() {
        _super.apply(this, arguments);
        this._articles = new layouts.ObservableCollection();
        this._categories = new layouts.ObservableCollection();
        this._isMenuVisible = true;
    }
    Object.defineProperty(AppViewModel.prototype, "typeName", {
        get: function () {
            return AppViewModel.typeName;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AppViewModel.prototype, "articles", {
        get: function () {
            return this._articles;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AppViewModel.prototype, "selectedArticle", {
        get: function () {
            return this._selectedArticle;
        },
        set: function (value) {
            if (this._selectedArticle != value) {
                var oldValue = this._selectedArticle;
                if (oldValue != null)
                    oldValue.isSelected = false;
                this._selectedArticle = value;
                if (value != null)
                    value.isSelected = true;
                this.onPropertyChanged("selectedArticle", value, oldValue);
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AppViewModel.prototype, "categories", {
        get: function () {
            return this._categories;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AppViewModel.prototype, "selectedCategory", {
        get: function () {
            return this._selectedCategory;
        },
        set: function (value) {
            if (this._selectedCategory != value) {
                var oldValue = this._selectedCategory;
                this._selectedCategory = value;
                this.onPropertyChanged("selectedCategory", value, oldValue);
            }
        },
        enumerable: true,
        configurable: true
    });
    AppViewModel.prototype.openArticle = function (article) {
        if (article != null) {
            if (this._articles.elements.indexOf(article) == -1)
                this._articles.add(article);
        }
        this.selectedArticle = article;
    };
    AppViewModel.prototype.closeArticle = function (article) {
        var indexOfArticle = this._articles.elements.indexOf(article);
        this._articles.remove(article);
        if (indexOfArticle == this._articles.count)
            indexOfArticle--;
        this.openArticle(indexOfArticle == -1 ? null : this._articles.at(indexOfArticle));
    };
    Object.defineProperty(AppViewModel.prototype, "toggleMenuCommand", {
        get: function () {
            var _this = this;
            if (this._toggleMenuCommand == null)
                this._toggleMenuCommand = new layouts.Command(function (cmd, p) { return _this.ontoggleMenu(); }, function (cmd, p) { return true; });
            return this._toggleMenuCommand;
        },
        enumerable: true,
        configurable: true
    });
    AppViewModel.prototype.ontoggleMenu = function () {
        this.isMenuVisible = !this.isMenuVisible;
    };
    Object.defineProperty(AppViewModel.prototype, "isMenuVisible", {
        get: function () {
            return this._isMenuVisible;
        },
        set: function (value) {
            if (this._isMenuVisible != value) {
                var oldValue = this._isMenuVisible;
                this._isMenuVisible = value;
                this.onPropertyChanged("isMenuVisible", value, oldValue);
            }
        },
        enumerable: true,
        configurable: true
    });
    AppViewModel.typeName = "appViewModel";
    return AppViewModel;
})(layouts.DepObject);
