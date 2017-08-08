var AppView = (function () {
    function AppView() {
    }
    Object.defineProperty(AppView, "PAGE_DEFINITION", {
        get: function () {
            return "<?xml version=\"1.0\" encoding=\"utf-8\" ?>\n<Page xmlns:localViews=\"Layouts.Sample3\">\n  <Grid Rows=\"48 *\" Columns=\"Auto *\">\n    <Border id=\"leftSideLogo\" IsVisible=\"{isMenuVisible}\"/>\n\n    <!-- Header -->\n    <Border id=\"header\" Grid.ColumnSpan=\"2\">\n        <!-- Logo Area -->\n        <Image Command=\"{toggleMenuCommand}\" class=\"headerButton\" Source=\"Images/Menu-32.png\" VerticalAlignment=\"Center\" HorizontalAlignment=\"Left\" Margin=\"4\"/>\n    </Border>\n\n    <!-- Left Side -->\n    <Border id=\"leftSide\" IsVisible=\"{isMenuVisible}\" Grid.Row=\"1\" Width=\"250\">\n        <localViews:TreeView />\n    </Border>\n\n\n    <!-- Main Area -->\n    <Border id=\"mainArea\" Grid.Column=\"1\" Grid.Row=\"1\">\n        <localViews:TabView/>\n    </Border>\n  </Grid>\n</Page>";
        },
        enumerable: true,
        configurable: true
    });
    AppView.getMainPage = function () {
        if (AppView._page == null) {
            var loader = new layouts.XamlReader();
            loader.namespaceResolver = function (ns) {
                if (ns == "Layouts.Sample3")
                    return null;
                return null;
            };
            AppView._page = loader.Parse(AppView.PAGE_DEFINITION);
        }
        return AppView._page;
    };
    return AppView;
})();
