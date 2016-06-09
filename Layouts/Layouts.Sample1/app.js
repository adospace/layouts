window.onload = function () {
    var app = new layouts.Application();
    var lmlReader = new layouts.XamlReader();
    var lmlTest = "<?xml version=\"1.0\" encoding=\"utf-8\" ?>\n<Page>\n    <Grid Rows=\"48 *\" Columns=\"Auto *\">\n        <Border Background=\"Yellow\" Grid.ColumnSpan=\"2\"   />\n        <Border Background=\"Red\" Grid.Row=\"1\" Grid.Column=\"0\" Width=\"80\"/>\n    </Grid>\n</Page>\n";
    app.page = lmlReader.Parse(lmlTest);
};
