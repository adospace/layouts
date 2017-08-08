var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var TabView = (function (_super) {
    __extends(TabView, _super);
    function TabView() {
        _super.apply(this, arguments);
    }
    Object.defineProperty(TabView.prototype, "typeName", {
        get: function () {
            return TabView.typeName;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TabView, "PAGE_DEFINITION", {
        get: function () {
            return "<?xml version=\"1.0\" encoding=\"utf-8\" ?>\n<Grid Rows=\"Auto *\">\n    <ItemsControl id=\"mainAreaHeader\" ItemsSource=\"{articles}\">\n        <ItemsControl.ItemsPanel>\n            <Stack Orientation=\"Horizontal\"/>\n        </ItemsControl.ItemsPanel>\n        <DataTemplate>\n            <Grid Columns=\"* Auto\" class=\"{isSelected,oneway,detaContext,ArticleClassConverter}\" Command=\"{openArticleCommand}\" Margin=\"0,2\">\n                <TextBlock Text=\"{title}\" VerticalAlignment=\"Center\" Margin=\"8\"/>\n                <Image Source=\"Images/Delete Sign-32.png\" Grid.Column=\"1\" IsVisible=\"{isSelected}\" Command=\"{closeArticleCommand}\" Margin=\"4,8,8,8\"/>\n            </Grid>\n        </DataTemplate>\n    </ItemsControl>\n    <ContentTemplate Content=\"{selectedArticle}\" Grid.Row=\"1\">\n        <Frame Source=\"{url}\"/>\n    </ContentTemplate>\n</Grid>";
        },
        enumerable: true,
        configurable: true
    });
    TabView.prototype.initializeComponent = function () {
        var loader = new layouts.XamlReader();
        return loader.Parse(TabView.PAGE_DEFINITION);
    };
    TabView.typeName = "TabView";
    return TabView;
})(layouts.controls.UserControl);
