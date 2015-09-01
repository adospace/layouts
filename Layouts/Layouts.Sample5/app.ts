var userLogged: boolean = false;

window.onload = () => {
    var app = layouts.Application.current;
    app.map("/login", "app/Login");//case sensitive!!
    app.map("/page1/{user}", "app/Page1");
    app.map("/page2/{parameter}", "app/Page2");

    app.onBeforeNavigate = (ctx) => {
        if (ctx.nextUri != "/login" &&
            !userLogged) {
            ctx.cancel = true;
            app.navigate("/login");
        }
    };

    app.navigate("/login");
};