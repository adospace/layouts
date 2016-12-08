window.onload = function () {
    var app = new layouts.Application();
    var lmlReader = new layouts.XamlReader();
    var lmlTest = "<?xml version=\"1.0\" encoding=\"utf-8\" ?>\n<Page>\n    <div VerticalAlignment=\"Stretch\" HorizontalAlignment=\"Left\">\n        <nav>\n\t        <ul>\n\t\t        <li><a href=\"home.html\">Home</a></li>\n\t\t        <li>\n\t\t\t        <a href=\"products.html\">Products <span class=\"caret\"></span></a>\n\t\t\t        <div>\n\t\t\t\t        <ul>\n\t\t\t\t\t        <li><a href=\"products.html#chair\">Chair</a></li>\n\t\t\t\t\t        <li><a href=\"products.html#table\">Table</a></li>\n\t\t\t\t\t        <li><a href=\"cooker.html\">Cooker</a></li>\n\t\t\t\t        </ul>\n\t\t\t        </div>\n\t\t        </li>\n\t\t        <li><a href=\"about.html\">About</a></li>\n\t\t        <li><a href=\"help.html\">Help</a></li>\n\t        </ul>\n        </nav>\n    </div>\n</Page>\n";
    app.page = lmlReader.Parse(lmlTest);
};
