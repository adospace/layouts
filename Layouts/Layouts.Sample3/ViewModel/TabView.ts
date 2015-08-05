
class TabView extends layouts.controls.UserControl {
    static typeName: string = "TabView";
    get typeName(): string {
        return TabView.typeName;
    }

    public static get PAGE_DEFINITION(): string {
        return `<?xml version="1.0" encoding="utf-8" ?>
<Grid Rows="45 *">
    <ItemsControl ItemsSource="{articles}" Margin="0,4">
        <DataTemplate>
            <Border class="article" Command="{openArticleCommand}" Padding="4">
                <TextBlock Text="{title}" VerticalAlignment="Center"/>
            </Border>
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