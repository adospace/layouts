
class TabView extends layouts.controls.UserControl {
    static typeName: string = "TabView";
    get typeName(): string {
        return TabView.typeName;
    }

    public static get PAGE_DEFINITION(): string {
        return `<?xml version="1.0" encoding="utf-8" ?>
<Grid Rows="Auto *">
    <ItemsControl id="mainAreaHeader" ItemsSource="{articles}">
        <ItemsControl.ItemsPanel>
            <Stack Orientation="Horizontal"/>
        </ItemsControl.ItemsPanel>
        <DataTemplate>
            <Grid Columns="* Auto" class="{isSelected,converter:ArticleClassConverter}" Command="{openArticleCommand}" Margin="0,2">
                <TextBlock Text="{title}" VerticalAlignment="Center" Margin="4"/>
                <Image Source="Images/Delete Sign-32.png" Grid.Column="1" IsVisible="{isSelected}" Command="{closeArticleCommand}" Margin="2,4,4,4"/>
            </Grid>
        </DataTemplate>
    </ItemsControl>
    <ContentTemplate Content="{selectedArticle}" Grid.Row="1">
        <Frame Source="{url}"/>
    </ContentTemplate>
</Grid>`;
    }

    protected initializeComponent(): layouts.UIElement {
        let loader = new layouts.XamlReader();
        return loader.Parse(TabView.PAGE_DEFINITION);
    }

}  