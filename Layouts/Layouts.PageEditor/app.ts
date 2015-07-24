

window.onload = () => {
    var app = layouts.Application.current;
    app.page = AppView.getMainPage();

    var appViewModel = new AppViewModel();
    app.page.dataContext = appViewModel;
};