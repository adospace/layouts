
window.onload = () => {
    var app = new layouts.Application();
    var loader = new layouts.XamlReader();

    var lmlTest = `<?xml version="1.0" encoding="utf-8" ?>
<Page Name="testPage">
    <Stack VerticalAlignment="Center" HorizontalAlignment="Center" Orientation="Vertical" Margin="10,20">
        <Button Text="Test Popup">
            <Button.Popup>
                <Popup Position="Bottom">
                    <Stack class="popup">
                        <!--TextBlock Text="{title}" Command="{myCommand}" Margin="8"/-->
                        <TextBlock Text="Menu2" Command="{myCommand}"  IsVisible="{IsEnabled,source:self}" Margin="8"/>
                        <TextBlock Text="Menu3" Margin="8"/>
                    </Stack>
                </Popup>
            </Button.Popup>
        </Button>
        <Stack HorizontalAlignment="Center" Orientation="Horizontal">
            <Label For="ch" Text="Enable/Disable Command" Margin="4"/>
            <CheckBox id="ch" IsChecked="{cmdEnabled,mode:twoway}"/>
            <a Command="{toggleSideBarCommand}" ArrangeChild="false">
              <Stack Orientation="Horizontal">
                <Image class="img-circle" Source="../Images/people/user-14.png" Width="32" Stretch="Uniform"/>
                <span class="font-grey-cararra" Text="{securityService.user.matricola}" Margin="2,0" VerticalAlignment="Center"/>
                <i class="fa fa-angle-down font-grey-cararra" VerticalAlignment="Center"/>
              </Stack>
            </a>
        </Stack>
    </Stack>
</Page>`;

    loader.namespaceResolver = (ns) => {
        if (ns == "localControls")
            return "app";

        return null;
    };

    app.page = loader.Parse(lmlTest);
    app.page.dataContext = new TestViewModel();
};