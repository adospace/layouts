

class AppView {
    private static _page: layouts.controls.Page;

    public static get PAGE_DEFINITION(): string {
        return `<?xml version="1.0" encoding="utf-8" ?>
<Page xmlns:localViews="Layouts.Sample3">  
  <Grid Rows="48 *" Columns="250 *">
    <!-- Header -->
    <Border id="header" Grid.Column="1">
        
    </Border>

    <!-- Logo Area -->
    <Border id="logo" >
        <Image Source="Images/Menu-32.png" VerticalAlignment="Center" HorizontalAlignment="Left" Margin="4"/>
    </Border>

    <!-- Left Side -->
    <Border id="leftSide" Grid.Row="1">
        <Grid Rows="Auto *">
            <localViews:TreeView Grid.Row="1" />
        </Grid>
    </Border>

    <!-- Main Area -->
    <Border id="mainArea" Grid.Row="1" Grid.Column="1">
        <localViews:TabView/>
    </Border>

  </Grid>
</Page>`;
    }


    static getMainPage(): layouts.controls.Page {
        if (AppView._page == null) {
            let loader = new layouts.XamlReader();
            loader.namespaceResolver = (ns) => {
                if (ns == "Layouts.Sample3")
                    return null;//means empty namespace (TreeView is in global/empty namespace)

                return null;
            };
            AppView._page = loader.Parse(AppView.PAGE_DEFINITION);
        }

        return AppView._page;
    }

} 