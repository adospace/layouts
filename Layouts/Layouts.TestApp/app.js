window.onload = function () {
    var app = new layouts.Application();
    //app.page = new TypeScriptUI.testDialog();
    var testObj = layouts.LmlReader.Parse("<?xml version=\"1.0\" encoding=\"utf-8\" ?>\n<Page Name=\"testPage\" SizeToContent=\"Vertical\" xmlns=\"http://schemas.typescriptui.com/\">  \n  <Grid>\n    <!--<Grid.Rows>\n      <GridRow Height=\"*\" />\n      <GridRow Height=\"Auto\"/>\n    </Grid.Rows>\n    <Grid.Columns>\n      <GridColumn Width=\"Auto\"/>\n      <GridColumn Width=\"*\" />\n    </Grid.Columns>-->\n  \n    <Stack Orientation=\"Vertical\" Height=\"1000\">\n      <Border Grid.Row=\"0\" Background=\"red\" Height=\"80\"/>\n      <Border Grid.Column=\"1\" Background=\"yellow\" Height=\"100\"/>\n      <Border Grid.Row=\"1\" Grid.ColumnSpan=\"2\" Background=\"gray\" Width=\"150\"/>\n      <TextBlock Text=\"TEST TEST2\" Grid.ColumnSpan=\"0\"/>\n      <Image src=\"http://2.bp.blogspot.com/-tRdfCkaPO0A/Ui-PRJLDZlI/AAAAAAABMI8/8L9maIUroq8/s640/google-new-logo.png\" Grid.Column=\"1\" Stretch=\"Uniform\"/>\n    </Stack>\n  </Grid>\n</Page>");
};
//# sourceMappingURL=app.js.map