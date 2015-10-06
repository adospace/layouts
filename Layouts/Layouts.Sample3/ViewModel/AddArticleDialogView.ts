class AddArticleDialogView extends layouts.controls.Popup {
    static typeName: string = "AddArticleDialogView";
    get typeName(): string {
        return AddArticleDialogView.typeName;
    }

    public static get PAGE_DEFINITION(): string {
        return `<?xml version="1.0" encoding="utf-8" ?>
<Grid class="dialog" Rows="32 *" VerticalAlignment="Center" HorizontalAlignment="Center" Width="400" Height="150" >
    <Border class="dialogHeader">
        <Grid Columns="* Auto">
            <TextBlock VerticalAlignment="Center" Margin="4" Text="{path:title}"/>
            <Image class="dialogHeaderCloseButton" Command="{path:closeDialogCommand}" Source="Images/Delete Sign-32.png" Grid.Column="1"/>
        </Grid>
    </Border>
    
    <Grid class="dialogContent" Rows="* Auto" Grid.Row="1">
    
        <TextBox class="textBox" Text="{path:articleTitle,mode:twoway}" Placeholder="Input title here..." Margin="8" VerticalAlignment="Center"/>

        <Stack Orientation="Horizontal" Grid.Row="1" HorizontalAlignment="Right" Margin="4">
            <Button class="buttonSecondary" Text="Close" Command="{path:closeDialogCommand}" Height="24" Width="80" Margin="4,0" VerticalAlignment="Center"/>
            <Button class="buttonPrimary" Text="Add" Command="{path:addArticleCommand}" Height="24" Width="80" VerticalAlignment="Center"/>
        </Stack>

    </Grid>
</Grid>
`;
    }

    protected initializeComponent(): layouts.UIElement {
        let loader = new layouts.XamlReader();
        return loader.Parse(AddArticleDialogView.PAGE_DEFINITION);
    }

}   