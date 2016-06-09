window.onload = function () {
    var app = layouts.Application.current;
    app.page = AppView.getMainPage();
    var appViewModel = new AppViewModel();
    appViewModel.loadSavedSamples();
    app.page.dataContext = appViewModel;
};
