class TestViewModelItem extends layouts.DepObject {
    static typeName: string = "TestViewModelItem";
    get typeName(): string {
        return TestViewModelItem.typeName;
    }

    constructor(public itemName: string) {
        super();
    }
}

class TestViewModel extends layouts.DepObject {
    static typeName: string = "TestViewModel";
    get typeName(): string {
        return TestViewModel.typeName;
    }

    constructor() {
        super();
        this.itemsCollection = new layouts.ObservableCollection<TestViewModelItem>(
            [
                new TestViewModelItem("item1"),
                new TestViewModelItem("item2"),
                new TestViewModelItem("item3"),
            ]);
    }

    static nameProperty = layouts.DepObject.registerProperty(TestViewModel.typeName, "name", "test string");
    get name(): string {
        return <string>this.getValue(TestViewModel.nameProperty);
    }
    set name(value: string) {
        this.setValue(TestViewModel.nameProperty, value);
    }

    static countProperty = layouts.DepObject.registerProperty(TestViewModel.typeName, "count", 0, (v) => parseInt(v));
    get count(): number {
        return <number>this.getValue(TestViewModel.countProperty);
    }
    set count(value: number) {
        this.setValue(TestViewModel.countProperty, value);
    }

    private _incrementCommand: layouts.Command;
    get incrementCommand(): layouts.Command {
        if (this._incrementCommand == null)
            this._incrementCommand = new layouts.Command((cmd, p) => this.onIncrement(), (cmd, p) => true);
        return this._incrementCommand;
    }

    onIncrement() {
        this.count++;
    }

    itemsCollection: layouts.ObservableCollection<TestViewModelItem>;
}



window.onload = () => {
    var app = new layouts.Application();
    var lmlReader = new layouts.LmlReader();

    //app.page = new TypeScriptUI.testDialog();
    //var testPage = new layouts.controls.Page();
    //testPage.sizeToContent = layouts.controls.SizeToContent.Both;

    var lmlTest = `<?xml version="1.0" encoding="utf-8" ?>
<Page Name="testPage">  
  <Grid Rows="Auto Auto" Columns="Auto 299" VerticalAlignment="Center" HorizontalAlignment="Center">
      <!--
      <TextBox Text="{count,twoway}"/>
      <Button Text="Increment" Command="{incrementCommand}" Grid.Column="1"/>
      -->

      <ItemsControl ItemsSource="{itemsCollection}" Grid.Row="1">
        <DataTemplate>
            <TextBlock Text="{itemName}"/>
        </DataTemplate>
      </ItemsControl>
  </Grid>
</Page>`;

    app.page = lmlReader.Parse(lmlTest);
    app.page.dataContext = new TestViewModel();
};