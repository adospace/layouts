var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var TreeView = (function (_super) {
    __extends(TreeView, _super);
    function TreeView() {
        _super.apply(this, arguments);
    }
    Object.defineProperty(TreeView.prototype, "typeName", {
        get: function () {
            return TreeView.typeName;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TreeView, "PAGE_DEFINITION", {
        get: function () {
            return "<?xml version=\"1.0\" encoding=\"utf-8\" ?>\n<ItemsControl ItemsSource=\"{categories}\" Margin=\"0,4\">\n    <DataTemplate>\n        <Stack>\n            <Grid Columns=\"* Auto\" class=\"category\" Height=\"32\" Command=\"{expandCommand}\">\n                <TextBlock Text=\"{title}\" VerticalAlignment=\"Center\" Margin=\"4,0,0,0\" />\n                <Image class=\"categoryAddArticle\" Source=\"Images/Plus Math-32.png\" Grid.Column=\"1\" Command=\"{addArticleCommand}\"/>\n            </Grid>\n            <ItemsControl ItemsSource=\"{articles}\" IsVisible=\"{isExpanded}\">\n                <DataTemplate>\n                    <Border class=\"article\" Height=\"35\" Command=\"{openArticleCommand}\">\n                        <TextBlock Text=\"{title}\" VerticalAlignment=\"Center\" Margin=\"8,0,0,0\"/>\n                    </Border>\n                </DataTemplate>\n            </ItemsControl>\n        </Stack>\n    </DataTemplate>\n</ItemsControl>";
        },
        enumerable: true,
        configurable: true
    });
    TreeView.prototype.initializeComponent = function () {
        var loader = new layouts.XamlReader();
        return loader.Parse(TreeView.PAGE_DEFINITION);
    };
    TreeView.typeName = "TreeView";
    return TreeView;
})(layouts.controls.UserControl);
