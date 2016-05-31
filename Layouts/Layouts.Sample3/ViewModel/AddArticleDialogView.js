var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var AddArticleDialogView = (function (_super) {
    __extends(AddArticleDialogView, _super);
    function AddArticleDialogView() {
        _super.apply(this, arguments);
    }
    Object.defineProperty(AddArticleDialogView.prototype, "typeName", {
        get: function () {
            return AddArticleDialogView.typeName;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AddArticleDialogView, "PAGE_DEFINITION", {
        get: function () {
            return "<?xml version=\"1.0\" encoding=\"utf-8\" ?>\n<Grid class=\"dialog\" Rows=\"32 *\" VerticalAlignment=\"Center\" HorizontalAlignment=\"Center\" Width=\"400\" Height=\"150\" >\n    <Border class=\"dialogHeader\">\n        <Grid Columns=\"* Auto\">\n            <TextBlock VerticalAlignment=\"Center\" Margin=\"4\" Text=\"{title}\"/>\n            <Image class=\"dialogHeaderCloseButton\" Command=\"{closeDialogCommand}\" Source=\"Images/Delete Sign-32.png\" Grid.Column=\"1\"/>\n        </Grid>\n    </Border>\n    \n    <Grid class=\"dialogContent\" Rows=\"* Auto\" Grid.Row=\"1\">\n    \n        <TextBox class=\"textBox\" Text=\"{articleTitle,twoway}\" Placeholder=\"Input title here...\" Margin=\"8\" VerticalAlignment=\"Center\"/>\n\n        <Stack Orientation=\"Horizontal\" Grid.Row=\"1\" HorizontalAlignment=\"Right\" Margin=\"4\">\n            <Button class=\"buttonSecondary\" Text=\"Close\" Command=\"{closeDialogCommand}\" Height=\"24\" Width=\"80\" Margin=\"4,0\" VerticalAlignment=\"Center\"/>\n            <Button class=\"buttonPrimary\" Text=\"Add\" Command=\"{addArticleCommand}\" Height=\"24\" Width=\"80\" VerticalAlignment=\"Center\"/>\n        </Stack>\n\n    </Grid>\n</Grid>\n";
        },
        enumerable: true,
        configurable: true
    });
    AddArticleDialogView.prototype.initializeComponent = function () {
        var loader = new layouts.XamlReader();
        return loader.Parse(AddArticleDialogView.PAGE_DEFINITION);
    };
    AddArticleDialogView.typeName = "AddArticleDialogView";
    return AddArticleDialogView;
})(layouts.controls.Dialog);
