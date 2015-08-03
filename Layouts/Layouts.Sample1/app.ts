window.onload = () => {
    var app = new layouts.Application();
    var lmlReader = new layouts.XamlReader();

    var lmlTest = `<?xml version="1.0" encoding="utf-8" ?>
<Page>
<Border Background="Red" Width="10">

</Border>
</Page>
`;

    app.page = lmlReader.Parse(lmlTest);
};