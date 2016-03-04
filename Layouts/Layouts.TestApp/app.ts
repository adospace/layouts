//class TestViewModelItem extends layouts.DepObject {
//    static typeName: string = "TestViewModelItem";
//    get typeName(): string {
//        return TestViewModelItem.typeName;
//    }

//    constructor(public itemName: string, public itemValue?: any) {
//        super();
//    }

//    private _testCommand: layouts.Command;
//    get testCommand(): layouts.Command {
//        if (this._testCommand == null)
//            this._testCommand = new layouts.Command((cmd, p) => this.onTest(), (cmd, p) => true);
//        return this._testCommand;
//    }

//    onTest() {
//        alert("Test Command");
//    }
//}

//class TestViewModel extends layouts.DepObject {
//    static typeName: string = "TestViewModel";
//    get typeName(): string {
//        return TestViewModel.typeName;
//    }

//    constructor() {
//        super();
//        this.itemsCollection = new layouts.ObservableCollection<TestViewModelItem>(
//            [
//                new TestViewModelItem("item1", 12),
//                new TestViewModelItem("item2", "I'm a string"),
//                new TestViewModelItem("item3", 34),
//            ]);
//        this._currentItem = this.itemsCollection.at(0);
//    }

//    static nameProperty = layouts.DepObject.registerProperty(TestViewModel.typeName, "name", "test string");
//    get name(): string {
//        return <string>this.getValue(TestViewModel.nameProperty);
//    }
//    set name(value: string) {
//        this.setValue(TestViewModel.nameProperty, value);
//    }

//    static countProperty = layouts.DepObject.registerProperty(TestViewModel.typeName, "count", 3, (v) => parseInt(v));
//    get count(): number {
//        return <number>this.getValue(TestViewModel.countProperty);
//    }
//    set count(value: number) {
//        this.setValue(TestViewModel.countProperty, value);
//    }


//    static dateProperty = layouts.DepObject.registerProperty(TestViewModel.typeName, "date", new Date(), (v) => Date.parse(v));
//    get date(): Date {
//        return <Date>this.getValue(TestViewModel.dateProperty);
//    }
//    set date(value: Date) {
//        this.setValue(TestViewModel.dateProperty, value);
//    }

//    private _incrementCommand: layouts.Command;
//    get incrementCommand(): layouts.Command {
//        if (this._incrementCommand == null)
//            this._incrementCommand = new layouts.Command((cmd, p) => this.onIncrement(), (cmd, p) => true);
//        return this._incrementCommand;
//    }

//    onIncrement() {
//        this.count++;
//        this.itemsCollection.add(new TestViewModelItem("item" + this.count));
//        this.decrementCommand.canExecuteChanged();
//    }

//    private _decrementCommand: layouts.Command;
//    get decrementCommand(): layouts.Command {
//        if (this._decrementCommand == null)
//            this._decrementCommand = new layouts.Command((cmd, p) => this.onDecrement(), (cmd, p) => this.itemsCollection.count > 0);
//        return this._decrementCommand;
//    }

//    onDecrement() {
//        this.count--;
//        this.itemsCollection.remove(
//            this.itemsCollection.last());
//    }

//    itemsCollection: layouts.ObservableCollection<TestViewModelItem>;

//    private _currentItem: TestViewModelItem;
//    get currentItem(): TestViewModelItem {
//        return this._currentItem;
//    }
//    set currentItem(value: TestViewModelItem) {
//        if (this._currentItem != value) {
//            var oldValue = this._currentItem;
//            this._currentItem = value;
//            this.onPropertyChanged("currentItem", value, oldValue);
//        }
//    }

//    private _currentItemName: string;
//    get currentItemName(): string {
//        return this._currentItemName;
//    }
//    set currentItemName(value: string) {
//        if (this._currentItemName != value) {
//            var oldValue = this._currentItemName;
//            this._currentItemName = value;
//            this.onPropertyChanged("currentItemName", value, oldValue);
//        }
//    }

//    private _layoutUpdatedEvent: layouts.EventAction;
//    get layoutUpdated(): layouts.EventAction {
//        if (this._layoutUpdatedEvent == null)
//            this._layoutUpdatedEvent = new layouts.EventAction((ev, p) => this.onLayoutUpdated(p));
//        return this._layoutUpdatedEvent;
//    }

//    onLayoutUpdated(p: any) {
//        console.log("onLayoutUpdated");
//    }
//}

//class TestShowHideViewModel extends layouts.DepObject {
//    static typeName: string = "TestShowHideViewModel";
//    get typeName(): string {
//        return TestShowHideViewModel.typeName;
//    }

//    static isVisibleProperty = layouts.DepObject.registerProperty(TestShowHideViewModel.typeName, "IsVisible", true);
//    get isVisible(): boolean {
//        return <boolean>this.getValue(TestShowHideViewModel.isVisibleProperty);
//    }
//    set isVisible(value: boolean) {
//        this.setValue(TestShowHideViewModel.isVisibleProperty, value);
//    }

//    private _showHideCommand: layouts.Command;
//    get showHideCommand(): layouts.Command {
//        if (this._showHideCommand == null)
//            this._showHideCommand = new layouts.Command((cmd, p) => this.onShowHide(), (cmd, p) => true);
//        return this._showHideCommand;
//    }

//    onShowHide() {
//        this.isVisible = !this.isVisible;
//    }
//}

//class TestDataContextParentViewModel extends layouts.DepObject {
//    static typeName: string = "TestDataContextParentViewModel";
//    get typeName(): string {
//        return TestDataContextParentViewModel.typeName;
//    }

//    get title(): string {
//        return "parent";
//    }

//    _child: TestDataContextChildViewModel;
//    get child(): TestDataContextChildViewModel {
//        return this._child;
//    }
//    set child(value: TestDataContextChildViewModel) {
//        if (this._child != value) {
//            var oldValue = this._child;
//            this._child = value;
//            this.onPropertyChanged("child", value, oldValue);
//        }
//    }

//    private _showHideChildCommand: layouts.Command;
//    get showHideChildCommand(): layouts.Command {
//        if (this._showHideChildCommand == null)
//            this._showHideChildCommand = new layouts.Command((cmd, p) => this.onShowHideChild(), (cmd, p) => true);
//        return this._showHideChildCommand;
//    }

//    onShowHideChild() {
//        this.child = new TestDataContextChildViewModel();
//    }
//}

//class TestDataContextChildViewModel extends layouts.DepObject {
//    static typeName: string = "TestDataContextChildViewModel";
//    get typeName(): string {
//        return TestDataContextChildViewModel.typeName;
//    }

//    get title(): string {
//        return "child";
//    }
//}

window.onload = () => {
    var app = new layouts.Application();
    var lmlReader = new layouts.XamlReader();

    //app.page = new TypeScriptUI.testDialog();
    //var testPage = new layouts.controls.Page();
    //testPage.sizeToContent = layouts.controls.SizeToContent.Both;
    /*
        <Grid Rows="Auto Auto" Columns="Auto Auto Auto" VerticalAlignment="Center" HorizontalAlignment="Center">
      
              <TextBox Text="{path:count,twoway}"/>
              <Button Text="Increment" Command="{path:incrementCommand}" Grid.Column="1"/>
              <Button Text="Decrement" Command="{path:decrementCommand}" Grid.Column="2"/>
      

              <ItemsControl ItemsSource="{path:itemsCollection}" Grid.Row="1" Grid.ColumnSpan="3">
                <DataTemplate>
                    <TextBlock Text="{path:itemName}"/>
                </DataTemplate>
              </ItemsControl>
          </Grid>    
    */

//    var lmlTest = `<?xml version="1.0" encoding="utf-8" ?>
//<Page Name="testPage">  
//    <Grid Columns="* Auto 100" Width="200" Height="50" VerticalAlignment="Center" HorizontalAlignment="Center">
//        <TextBlock Text="Centered"  VerticalAlignment="Center" HorizontalAlignment="Center"/>
//        <TextBlock Text="--" IsVisible="{path:IsVisible}" Grid.Column="1"/>
//        <Button Text="Show/Hide" Command="{path:showHideCommand}" Grid.Column="2"/>
//    </Grid>
//</Page>`;

//    var lmlTest = `<?xml version="1.0" encoding="utf-8" ?>
//<Page Name="testPage">
//    <Stack VerticalAlignment="Center" HorizontalAlignment="Center">
//        <TextBlock DataContext="{path:child}" Text="{title}"/>
//        <Button Text="Show/Hide" Command="{path:showHideChildCommand}" Grid.Column="2"/>
//    </Stack>
//</Page>`;

//        var lmlTest = `<?xml version="1.0" encoding="utf-8" ?>
//<Page Name="testPage">
//    <Stack VerticalAlignment="Center" HorizontalAlignment="Center" Orientation="Horizontal">
//        <!--<ComboBox Width="150" Height="30" ItemsSource="{itemsCollection}" DisplayMember="itemName" SelectedItem="{path:currentItem,mode:twoway}"/>-->
//        <ComboBox Width="150" Height="30" ItemsSource="{itemsCollection}" DisplayMember="itemName" SelectMember="itemName" SelectedValue="{path:currentItemName,mode:twoway}"/>
//        <Button Text="Increment" Command="{incrementCommand}"/>
//        <Button Text="Decrement" Command="{decrementCommand}"/>
//    </Stack>
//</Page>`;

//    var lmlTest = `<?xml version="1.0" encoding="utf-8" ?>
//<Page Name="testPage">
//    <ControlTemplateSelector ContentSource="{.}" VerticalAlignment="Center" HorizontalAlignment="Center">
//        <DataTemplate TargetMember="name" TargetType="string">
//            <Stack>
//                <TextBlock Text="{name,format:'{0} => I\'m a string!'}"/>
//                <TextBox Text="{name,mode:twoway}" Margin="0,0,0,0"/>
//            </Stack>
//        </DataTemplate>
//        <DataTemplate TargetMember="name" TargetType="number">
//            <TextBlock Text="{name,format:'{0} => I\'m a number!'}"/>
//        </DataTemplate>
//        <DataTemplate TargetMember="name" TargetType="date">
//            <TextBlock Text="{name,format:'{0} => I\'m a date!'}"/>
//        </DataTemplate>
//    </ControlTemplateSelector>
//</Page>`;


//        var lmlTest = `<?xml version= "1.0" encoding= "utf-8" ?>
//<Stack Orientation="Vertical" VerticalAlignment= "Center" HorizontalAlignment= "Center">
//    <TextBlock Text="Welcome to Login Page" Margin= "8" />
//    <TextBox Placeholder= "User name" Margin= "8" />
//    <TextBox Type= "password" Placeholder= "Password" Margin= "8" />
//    <Grid Columns="* Auto" Margin= "8,16,8,8" MaxWidth="300">
//        <Button Text="Sign In" />
//        <TextBlock Text="Not yet registered?" Grid.Column="1" Margin="10,0,0,0"/>
//    </Grid>
//</Stack>
//`;

//    var lmlTest = `<?xml version= "1.0" encoding= "utf-8" ?>
//<ItemsControl ItemsSource="{itemsCollection}" SelectedItem="{currentItem,mode:twoway}" LayoutUpdated="{layoutUpdated}" VerticalAlignment= "Center" HorizontalAlignment= "Center">
//    <DataTemplate TargetType="number" TargetMember="itemValue">
//        <TextBlock Text="{itemValue}" Command="{testCommand}"/>
//    </DataTemplate>
//    <DataTemplate TargetType="string" TargetMember="itemValue">
//        <TextBox Text="{itemValue,mode:twoway}"/>
//    </DataTemplate>  
//</ItemsControl>
//`;

    var lmlTest = `<?xml version= "1.0" encoding= "utf-8" ?>
<Grid Margin="100" Rows="100 * * 50">
    <Border Background="Red" Margin="0,0,0,8" BorderBrush="Cyan" BorderThickness="2"/>
    <GridSplitter VerticalAlignment="Bottom" Height="8" Grid.Row="0" Background="Black"/>
    <Border Background="Blue" Grid.Row="1" Margin="0,0,0,0"/>
    <GridSplitter VerticalAlignment="Top" Height="8" Grid.Row="2"/>
    <Border Background="Gray" Grid.Row="2" Margin="0,8,0,0"/>
    <GridSplitter VerticalAlignment="Top" Height="8" Grid.Row="3"/>
    <Border Background="Green" Grid.Row="3" Margin="0,8,0,0"/>
</Grid>
`;

    app.page = lmlReader.Parse(lmlTest);
//    app.page.dataContext = new TestViewModel();
};