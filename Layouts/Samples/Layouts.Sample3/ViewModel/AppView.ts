

class AppView {
    private static _page: layouts.controls.Page;

    public static get PAGE_DEFINITION(): string {
        return `<?xml version="1.0" encoding="utf-8" ?>
<Page xmlns:localViews="Layouts.Sample3">
  <Grid Rows="48 *" Columns="Auto *">
    <Border id="leftSideLogo" IsVisible="{path:isMenuVisible}"/>

    <!-- Header -->
    <Border id="header" Grid.ColumnSpan="2">
        <!-- Logo Area -->
        <Image Command="{path:toggleMenuCommand}" class="headerButton" Source="Images/Menu-32.png" VerticalAlignment="Center" HorizontalAlignment="Left" Margin="4"/>
    </Border>

    <!-- Left Side -->
    <Border id="leftSide" IsVisible="{path:isMenuVisible}" Grid.Row="1" Width="250">
        <localViews:TreeView />
    </Border>


    <!-- Main Area -->
    <Border id="mainArea" Grid.Column="1" Grid.Row="1">
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