var AppView = (function () {
    function AppView() {
    }
    Object.defineProperty(AppView, "PAGE_DEFINITION", {
        get: function () {
            return "<?xml version=\"1.0\" encoding=\"utf-8\" ?>\n<Page>  \n  <Grid Rows=\"48 *\" Columns=\"150 *\">\n    <!-- Header -->\n    <Border id=\"header\" Grid.Column=\"1\">\n        \n    </Border>\n\n    <!-- Logo Area -->\n    <Border id=\"logo\" >\n        <TextBlock Text=\"Layouts Page Editor\" VerticalAlignment=\"Center\" HorizontalAlignment=\"Center\"/>\n    </Border>\n\n    <!-- Left Side -->\n    <Border id=\"leftSide\" Grid.Row=\"1\">\n        <Grid Rows=\"Auto *\">\n            <Button Text=\"New...\" Command=\"{addCommand}\" Margin=\"4\"/>\n            <ItemsControl Grid.Row=\"1\" ItemsSource=\"{items}\" Margin=\"4,0,4,4\">\n                <DataTemplate>\n                    <Button Text=\"{title}\" Command=\"{selectCommand}\" Margin=\"4\"/>\n                </DataTemplate>                \n            </ItemsControl>\n        </Grid>\n    </Border>\n\n    <!-- Main Area -->\n    <Border id=\"mainArea\" Grid.Row=\"1\" Grid.Column=\"1\">\n        <ControlTemplate DataContext=\"{selected}\" Content=\"{view}\"/>\n    </Border>\n\n  </Grid>\n</Page>";
        },
        enumerable: true,
        configurable: true
    });
    AppView.getMainPage = function () {
        if (AppView._page == null) {
            var loader = new layouts.XamlReader();
            AppView._page = loader.Parse(AppView.PAGE_DEFINITION);
        }
        return AppView._page;
    };
    return AppView;
}());
