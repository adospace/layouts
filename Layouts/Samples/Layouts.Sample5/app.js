var userLogged = false;
window.onload = function () {
    var app = layouts.Application.current;
    app.map("/login", "app/Login");
    app.map("/page1/{user}", "app/Page1");
    app.map("/page2/{parameter}", "app/Page2");
    app.navigate("/page1/myuser&-test");
    app.navigate("/page1/john");
};
