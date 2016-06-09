window.onload = function () {
    var app = new layouts.Application();
    var loader = new layouts.XamlReader();
    var lmlTest = "<?xml version=\"1.0\" encoding=\"utf-8\" ?>\n<Page Name=\"testPage\">\n    <Stack VerticalAlignment=\"Center\" HorizontalAlignment=\"Right\" Orientation=\"Horizontal\" Margin=\"10,20\">\n        <Button Text=\"Test Popup\">\n            <Button.Popup>\n                <Popup Position=\"Bottom\">\n                    <Stack class=\"popup\">\n                        <TextBlock Text=\"{title}\" Command=\"{myCommand}\" Margin=\"8\"/>\n                        <TextBlock Text=\"Menu2\" Margin=\"8\"/>\n                        <TextBlock Text=\"Menu3\" Margin=\"8\"/>\n                    </Stack>\n                </Popup>\n            </Button.Popup>\n        </Button>\n    </Stack>\n</Page>";
    loader.namespaceResolver = function (ns) {
        if (ns == "localControls")
            return "app";
        return null;
    };
    app.page = loader.Parse(lmlTest);
    app.page.dataContext = new TestViewModel();
};
