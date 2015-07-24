

class AppView {
    private static _page: layouts.controls.Page;

    public static get PAGE_DEFINITION(): string {
        return `<?xml version="1.0" encoding="utf-8" ?>
<Page>  
  <Grid Rows="48 *" Columns="250 *">
    <!-- Header -->
    <Border Name="header" Grid.Column="1">
        
    </Border>

    <!-- Logo Area -->
    <Border Name="logo" >
        <TextBlock Text="Layouts Page Editor" VerticalAlignment="Center" HorizontalAlignment="Center"/>
    </Border>

    <!-- Left Side -->
    <Border Name="leftSide" Grid.Row="1">

    </Border>

    <!-- Main Area -->
    <Border Name="mainArea" Grid.Row="1" Grid.Column="1">
        
    </Border>

  </Grid>
</Page>`;
    }


    static getMainPage(): layouts.controls.Page {
        if (AppView._page == null) {
            let loader = new layouts.LmlReader();
            AppView._page = loader.Parse(AppView.PAGE_DEFINITION);
        }

        return AppView._page;
    }

} 