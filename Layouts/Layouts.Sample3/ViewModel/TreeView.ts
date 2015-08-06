
class TreeView extends layouts.controls.UserControl {
    static typeName: string = "TreeView";
    get typeName(): string {
        return TreeView.typeName;
    }

    public static get PAGE_DEFINITION(): string {
        return `<?xml version="1.0" encoding="utf-8" ?>
<ItemsControl ItemsSource="{categories}" Margin="0,4">
    <DataTemplate>
        <Stack>
            <Border class="category" Height="32" Command="{expandCommand}">
                <Grid Columns="* Auto">
                    <TextBlock Text="{title}" VerticalAlignment="Center" Margin="4,0,0,0"/>
                    <Image class="categoryAddArticle" Source="Images/Plus Math-32.png" Grid.Column="1" Command="{addArticleCommand}"/>
                </Grid>
            </Border>
            <ItemsControl ItemsSource="{articles}" IsVisible="{isExpanded}">
                <DataTemplate>
                    <Border class="article" Height="35" Command="{openArticleCommand}">
                        <TextBlock Text="{title}" VerticalAlignment="Center" Margin="8,0,0,0"/>
                    </Border>
                </DataTemplate>
            </ItemsControl>
        </Stack>
    </DataTemplate>
</ItemsControl>`;
    }

    protected initializeComponent(): layouts.UIElement {
        let loader = new layouts.XamlReader();
        return loader.Parse(TreeView.PAGE_DEFINITION);
    }

} 