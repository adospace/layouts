

class AppView {
    private static _page: layouts.controls.Page;

    public static get PAGE_DEFINITION(): string {
        return `<?xml version="1.0" encoding="utf-8" ?>
<Page>  
  <Grid Rows="48 *" Columns="250 *">
    <!-- Header -->
    <Border id="header" Grid.Column="1">
        
    </Border>

    <!-- Logo Area -->
    <Border id="logo" >
        <TextBlock Text="Layouts Page Editor" VerticalAlignment="Center" HorizontalAlignment="Center"/>
    </Border>

    <!-- Left Side -->
    <Border id="leftSide" Grid.Row="1">
        <Grid Rows="Auto *">
            <Button Text="New..." Command="{path:addCommand}" Margin="4"/>
            <ItemsControl Grid.Row="1" ItemsSource="{path:items}" Margin="4,0,4,4">
                <DataTemplate>
                    <Button Text="{path:title}" Command="{path:selectCommand}" Margin="4"/>
                </DataTemplate>                
            </ItemsControl>
        </Grid>
    </Border>

    <!-- Main Area -->
    <Border id="mainArea" Grid.Row="1" Grid.Column="1">
        <ControlTemplate DataContext="{path:selected}" Content="{view}"/>
    </Border>

  </Grid>
</Page>`;
    }


    static getMainPage(): layouts.controls.Page {
        if (AppView._page == null) {
            let loader = new layouts.XamlReader();
            AppView._page = loader.Parse(AppView.PAGE_DEFINITION);
        }

        return AppView._page;
    }

} 