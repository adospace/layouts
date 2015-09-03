
class AppViewModel extends layouts.DepObject {
    static typeName: string = "appViewModel";
    get typeName(): string {
        return AppViewModel.typeName;
    }

    //open articles in main area
    private _articles: layouts.ObservableCollection<ArticleViewModel> = new layouts.ObservableCollection<ArticleViewModel>();

    get articles(): layouts.ObservableCollection<ArticleViewModel> {
        return this._articles;
    }

    //currently open article in main area
    private _selectedArticle: ArticleViewModel;
    get selectedArticle(): ArticleViewModel {
        return this._selectedArticle;
    }
    set selectedArticle(value: ArticleViewModel) {
        if (this._selectedArticle != value) {
            var oldValue = this._selectedArticle;
            if (oldValue != null)
                oldValue.isSelected = false;
            this._selectedArticle = value;
            if (value != null)
                value.isSelected = true;
            this.onPropertyChanged("selectedArticle", value, oldValue);
        }
    }

    //list of all categories
    private _categories = new Array<CategoryViewModel>();

    get categories(): Array<CategoryViewModel> {
        return this._categories;
    }

    //selected category in side bar menu
    private _selectedCategory: CategoryViewModel;
    get selectedCategory(): CategoryViewModel {
        return this._selectedCategory;
    }
    set selectedCategory(value: CategoryViewModel) {
        if (this._selectedCategory != value) {
            var oldValue = this._selectedCategory;
            this._selectedCategory = value;
            this.onPropertyChanged("selectedCategory", value, oldValue);
        }
    }

    openArticle(article: ArticleViewModel) {
        if (article != null) {
            if (this._articles.elements.indexOf(article) == -1)
                this._articles.add(article);
        }
        this.selectedArticle = article;
    }

    closeArticle(article: ArticleViewModel) {
        var indexOfArticle = this._articles.elements.indexOf(article);
        this._articles.remove(article);
        if (indexOfArticle == this._articles.count)
            indexOfArticle--;

        this.openArticle(indexOfArticle == -1 ? null : this._articles.at(indexOfArticle));
    }
        
    private _toggleMenuCommand: layouts.Command;
    get toggleMenuCommand(): layouts.Command {
        if (this._toggleMenuCommand == null)
            this._toggleMenuCommand = new layouts.Command((cmd, p) => this.ontoggleMenu(), (cmd, p) => true);
        return this._toggleMenuCommand;
    }

    ontoggleMenu() {
        this.isMenuVisible = !this.isMenuVisible;
    }

    private _isMenuVisible: boolean = true;
    get isMenuVisible(): boolean {
        return this._isMenuVisible;
    }
    set isMenuVisible(value: boolean) {
        if (this._isMenuVisible != value) {
            var oldValue = this._isMenuVisible;
            this._isMenuVisible = value;
            this.onPropertyChanged("isMenuVisible", value, oldValue);
        }
    }

    //loadSavedSamples() {
    //    for (var i = 0; i < localStorage.length; i++) {
    //        var sample = new CodeViewModel(this);
    //        sample.title = "Code " + (i + 1);
    //        sample.sourceCode = localStorage.getItem(sample.title);
    //        this._items.add(sample);
    //    }

    //    this.selected = this._items.first();
    //}


} 