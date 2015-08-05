
class AppViewModel extends layouts.DepObject {
    static typeName: string = "appViewModel";
    get typeName(): string {
        return AppViewModel.typeName;
    }

    //open articles in main area
    _articles: layouts.ObservableCollection<ArticleViewModel> = new layouts.ObservableCollection<ArticleViewModel>();

    get articles(): layouts.ObservableCollection<ArticleViewModel> {
        return this._articles;
    }

    //currently open article in main area
    _selectedArticle: ArticleViewModel;
    get selectedArticle(): ArticleViewModel {
        return this._selectedArticle;
    }
    set selectedArticle(value: ArticleViewModel) {
        if (this._selectedArticle != value) {
            var oldValue = this._selectedCategory;
            this._selectedArticle = value;
            this.onPropertyChanged("selectedArticle", value, oldValue);
        }
    }

    //list of all categories
    _categories: layouts.ObservableCollection<CategoryViewModel> = new layouts.ObservableCollection<CategoryViewModel>();

    get categories(): layouts.ObservableCollection<CategoryViewModel> {
        return this._categories;
    }

    //selected category in side bar menu
    _selectedCategory: CategoryViewModel;
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
        if (this._articles.elements.indexOf(article) == -1)
            this._articles.add(article);
        this.selectedArticle = article;
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