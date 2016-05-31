var AppView = (function () {
    function AppView() {
    }
    Object.defineProperty(AppView, "PAGE_DEFINITION", {
        get: function () {
            return "<?xml version=\"1.0\" encoding=\"utf-8\" ?>\n<Page>  \n  <Grid Rows=\"24 *\" Columns=\"250 *\">\n    <!- Header -->\n    <Border cssClass=\"header\">\n        \n    </Border>\n\n    <!-- Left Side -->\n    <Border cssClass=\"leftSide\">\n\n    </Border>\n\n    <!-- Main Area -->\n    <Border cssClass=\"mainArea\">\n        \n    </Border>\n\n  </Grid>\n</Page>";
        },
        enumerable: true,
        configurable: true
    });
    AppView.getMainPage = function () {
        if (AppView._page == null) {
            var loader = new layouts.LmlReader();
            AppView._page = loader.Parse(AppView.PAGE_DEFINITION);
        }
        return AppView._page;
    };
    return AppView;
})();
//# sourceMappingURL=AppView.js.map