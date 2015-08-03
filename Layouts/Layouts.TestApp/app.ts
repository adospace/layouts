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

    static countProperty = layouts.DepObject.registerProperty(TestViewModel.typeName, "count", 3, (v) => parseInt(v));
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
        this.itemsCollection.add(new TestViewModelItem("item" + this.count));
        this.decrementCommand.canExecuteChanged();
    }

    private _decrementCommand: layouts.Command;
    get decrementCommand(): layouts.Command {
        if (this._decrementCommand == null)
            this._decrementCommand = new layouts.Command((cmd, p) => this.onDecrement(), (cmd, p) => this.itemsCollection.count > 0);
        return this._decrementCommand;
    }

    onDecrement() {
        this.count--;
        this.itemsCollection.remove(
            this.itemsCollection.last());
    }

    itemsCollection: layouts.ObservableCollection<TestViewModelItem>;
}



window.onload = () => {
    var app = new layouts.Application();
    var lmlReader = new layouts.XamlReader();

    //app.page = new TypeScriptUI.testDialog();
    //var testPage = new layouts.controls.Page();
    //testPage.sizeToContent = layouts.controls.SizeToContent.Both;

    var lmlTest = `<?xml version="1.0" encoding="utf-8" ?>
<Page Name="testPage">  
  <Grid Rows="Auto Auto" Columns="Auto Auto Auto" VerticalAlignment="Center" HorizontalAlignment="Center">
      
      <TextBox Text="{count,twoway}"/>
      <Button Text="Increment" Command="{incrementCommand}" Grid.Column="1"/>
      <Button Text="Decrement" Command="{decrementCommand}" Grid.Column="2"/>
      

      <ItemsControl ItemsSource="{itemsCollection}" Grid.Row="1" Grid.ColumnSpan="3">
        <DataTemplate>
            <TextBlock Text="{itemName}"/>
        </DataTemplate>
      </ItemsControl>
  </Grid>
</Page>`;

    app.page = lmlReader.Parse(lmlTest);
    app.page.dataContext = new TestViewModel();
};