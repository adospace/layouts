window.onload = function () {
    var app = layouts.Application.current;
    app.page = AppView.getMainPage();
    var appViewModel = new AppViewModel();
    app.page.dataContext = appViewModel;
};
//# sourceMappingURL=app.js.map