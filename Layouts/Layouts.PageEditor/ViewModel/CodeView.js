var CodeView = (function () {
    function CodeView() {
    }
    Object.defineProperty(CodeView, "PAGE_DEFINITION", {
        get: function () {
            return "<?xml version=\"1.0\" encoding=\"utf-8\" ?>\n<Border xmlns:localViews=\"Layouts.PageEditor\">\n  <Grid Columns=\"* *\">\n    <!-- Ace Editor -->\n    <localViews:AceView SourceCode=\"{path:sourceCode,mode:twoway}\"/>\n\n    <!-- Run Area -->\n    <Border id=\"runArea\" Grid.Column=\"1\">\n        <ControlTemplate Content=\"{createdControl}\"/>\n    </Border>\n\n  </Grid>\n</Border>";
        },
        enumerable: true,
        configurable: true
    });
    CodeView.getView = function () {
        var loader = new layouts.XamlReader();
        loader.namespaceResolver = function (ns) {
            if (ns == "Layouts.PageEditor")
                return null;
            return null;
        };
        return loader.Parse(CodeView.PAGE_DEFINITION);
    };
    return CodeView;
}());
