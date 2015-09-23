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
        this._currentItem = this.itemsCollection[0]
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

    private _currentItem: TestViewModelItem;
    get currentItem(): TestViewModelItem {
        return this._currentItem;
    }
}

class TestShowHideViewModel extends layouts.DepObject {
    static typeName: string = "TestShowHideViewModel";
    get typeName(): string {
        return TestShowHideViewModel.typeName;
    }

    static isVisibleProperty = layouts.DepObject.registerProperty(TestShowHideViewModel.typeName, "IsVisible", true);
    get isVisible(): boolean {
        return <boolean>this.getValue(TestShowHideViewModel.isVisibleProperty);
    }
    set isVisible(value: boolean) {
        this.setValue(TestShowHideViewModel.isVisibleProperty, value);
    }

    private _showHideCommand: layouts.Command;
    get showHideCommand(): layouts.Command {
        if (this._showHideCommand == null)
            this._showHideCommand = new layouts.Command((cmd, p) => this.onShowHide(), (cmd, p) => true);
        return this._showHideCommand;
    }

    onShowHide() {
        this.isVisible = !this.isVisible;
    }
}

class TestDataContextParentViewModel extends layouts.DepObject {
    static typeName: string = "TestDataContextParentViewModel";
    get typeName(): string {
        return TestDataContextParentViewModel.typeName;
    }

    get title(): string {
        return "parent";
    }

    _child: TestDataContextChildViewModel;
    get child(): TestDataContextChildViewModel {
        return this._child;
    }
    set child(value: TestDataContextChildViewModel) {
        if (this._child != value) {
            var oldValue = this._child;
            this._child = value;
            this.onPropertyChanged("child", value, oldValue);
        }
    }

    private _showHideChildCommand: layouts.Command;
    get showHideChildCommand(): layouts.Command {
        if (this._showHideChildCommand == null)
            this._showHideChildCommand = new layouts.Command((cmd, p) => this.onShowHideChild(), (cmd, p) => true);
        return this._showHideChildCommand;
    }

    onShowHideChild() {
        this.child = new TestDataContextChildViewModel();
    }
}

class TestDataContextChildViewModel extends layouts.DepObject {
    static typeName: string = "TestDataContextChildViewModel";
    get typeName(): string {
        return TestDataContextChildViewModel.typeName;
    }

    get title(): string {
        return "child";
    }
}

window.onload = () => {
    var app = new layouts.Application();
    var lmlReader = new layouts.XamlReader();

    //app.page = new TypeScriptUI.testDialog();
    //var testPage = new layouts.controls.Page();
    //testPage.sizeToContent = layouts.controls.SizeToContent.Both;
    /*
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
    */

//    var lmlTest = `<?xml version="1.0" encoding="utf-8" ?>
//<Page Name="testPage">  
//    <Grid Columns="* Auto 100" Width="200" Height="50" VerticalAlignment="Center" HorizontalAlignment="Center">
//        <TextBlock Text="Centered"  VerticalAlignment="Center" HorizontalAlignment="Center"/>
//        <TextBlock Text="--" IsVisible="{IsVisible}" Grid.Column="1"/>
//        <Button Text="Show/Hide" Command="{showHideCommand}" Grid.Column="2"/>
//    </Grid>
//</Page>`;

    var lmlTest = `<?xml version="1.0" encoding="utf-8" ?>
<Page Name="testPage">
    <Stack VerticalAlignment="Center" HorizontalAlignment="Center">
        <TextBlock DataContext="{child}" Text="{title}"/>
        <Button Text="Show/Hide" Command="{showHideChildCommand}" Grid.Column="2"/>
    </Stack>
</Page>`;

    app.page = lmlReader.Parse(lmlTest);
    app.page.dataContext = new TestDataContextParentViewModel();
};