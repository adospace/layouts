window.onload = () => {
    var app = new layouts.Application();
    var lmlReader = new layouts.XamlReader();

    var lmlTest = `<?xml version="1.0" encoding="utf-8" ?>
<Page>
    <Grid Rows="48 *" Columns="Auto *">
        <Border Background="Yellow" Grid.ColumnSpan="2"   />
        <Border Background="Red" Grid.Row="1" Grid.Column="0" Width="80"/>
    </Grid>
</Page>
`;

    app.page = lmlReader.Parse(lmlTest);
};