
window.onload = () => {
    var app = new layouts.Application();
    var loader = new layouts.XamlReader();

    var lmlTest = `<?xml version="1.0" encoding="utf-8" ?>
<Page Name="testPage">
    <Stack VerticalAlignment="Center" HorizontalAlignment="Center" Orientation="Horizontal">
        <Button Text="Test Popup">
            <Button.Popup>
                <Popup Position="Bottom">
                    <Stack class="popup">
                        <TextBlock Text="Menu1" Margin="8"/>
                        <TextBlock Text="Menu2" Margin="8"/>
                        <TextBlock Text="Menu3" Margin="8"/>
                    </Stack>
                </Popup>
            </Button.Popup>
        </Button>
    </Stack>
</Page>`;

    loader.namespaceResolver = (ns) => {
        if (ns == "localControls")
            return "app";

        return null;
    };

    app.page = loader.Parse(lmlTest);
    //app.page.dataContext = new TestViewModel();
};