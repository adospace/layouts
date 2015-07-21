/// <reference path="definitions\layouts.d.ts" />



window.onload = () => {
    var app = new layouts.Application();
    //app.page = new TypeScriptUI.testDialog();

    var testObj = layouts.LmlReader.Parse(`<?xml version="1.0" encoding="utf-8" ?>
<Page Name="testPage" SizeToContent="Vertical" xmlns="http://schemas.layouts.com/">  
  <Grid>
    <!--<Grid.Rows>
      <GridRow Height="*" />
      <GridRow Height="Auto"/>
    </Grid.Rows>
    <Grid.Columns>
      <GridColumn Width="Auto"/>
      <GridColumn Width="*" />
    </Grid.Columns>-->
  
    <Stack Orientation="Vertical" Height="1000">
      <Border Grid.Row="0" Background="red" Height="80"/>
      <Border Grid.Column="1" Background="yellow" Height="100"/>
      <Border Grid.Row="1" Grid.ColumnSpan="2" Background="gray" Width="150"/>
      <TextBlock Text="TEST TEST2" Grid.ColumnSpan="0"/>
      <Image src="http://2.bp.blogspot.com/-tRdfCkaPO0A/Ui-PRJLDZlI/AAAAAAABMI8/8L9maIUroq8/s640/google-new-logo.png" Grid.Column="1" Stretch="Uniform"/>
    </Stack>
  </Grid>
</Page>`);




};