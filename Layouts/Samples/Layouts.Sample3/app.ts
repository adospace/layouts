window.onload = () => {
    var app = layouts.Application.current;
    app.page = AppView.getMainPage();

    var appViewModel = new AppViewModel();

    var cat1 = new CategoryViewModel();
    cat1.title = "Category 1";
    cat1.articles.add(new ArticleViewModel()).title = "Henry I of England";
    cat1.articles.add(new ArticleViewModel()).title = "William the Conqueror";
    cat1.articles.add(new ArticleViewModel()).title = "Article 1.3";
    appViewModel.categories.push(cat1);

    var cat2 = new CategoryViewModel();
    cat2.title = "Category 2";
    cat2.articles.add(new ArticleViewModel()).title = "Article 2.1";
    cat2.articles.add(new ArticleViewModel()).title = "Article 2.2";
    appViewModel.categories.push(cat2);
   

    //appViewModel.loadSavedSamples();
    app.page.dataContext = appViewModel;
};