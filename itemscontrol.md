
## ItemsControl

One fundamental control provided by *Layouts* is ItemsControl. With it you can arrange a list of elements based on a collection of objects. The most obvious example of ItemsControl is the classic ListBox.
To start let's create a view-model that expose a collection of objects and a property that returns currently selected item.
```javascript
class TestViewModelItem extends layouts.DepObject {
    static typeName: string = "TestViewModelItem";
    get typeName(): string {
        return TestViewModelItem.typeName;
    }

    constructor(public itemName: string, public itemValue?:any) {
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
                new TestViewModelItem("item1", 1),
                new TestViewModelItem("item2", "I'm a string"),
                new TestViewModelItem("item3", 34),
            ]);
        this._currentItem = this.itemsCollection.at(0);
    }

    itemsCollection: layouts.ObservableCollection<TestViewModelItem>;

    private _currentItem: TestViewModelItem;
    get currentItem(): TestViewModelItem {
        return this._currentItem;
    }
    set currentItem(value: TestViewModelItem) {
        if (this._currentItem != value) {
            var oldValue = this._currentItem;
            this._currentItem = value;
            this.onPropertyChanged("currentItem", value, oldValue);
        }
    }
}
```
Then write a xaml with an ItemsControl bound to above collection:
```javascript
var lmlTest = `<?xml version= "1.0" encoding= "utf-8" ?>
<ItemsControl ItemsSource="{itemsCollection}" SelectedItem="{currentItem,mode:twoway}" VerticalAlignment= "Center" HorizontalAlignment= "Center">
    <DataTemplate>
        <TextBlock Text="{itemName}"/>
    </DataTemplate>
</ItemsControl>
`;

app.page = lmlReader.Parse(lmlTest);
app.page.dataContext = new TestViewModel();
```
Running the application you should see 3 items displayed in center of page. Looking at above sample we're attaching ItemsSource property of ItemsControl to our itemsCollection property of view-model. 
But more interesting we're specify that SelectedItem is linked in two-way mode to currentItem property. Mode can be one-way (default) and two-way. When latter is specified *layouts* will update target from source AND viceversa: so if user select an item property currentItem is updated but also if you change currentItem in code or in another manner itemsControl.selectedItem is updated accordingly.
Now look at DataTemplate: we're defining how items objects of itemsCollection must be rendered in xaml/html. For example we could change it to:
```xml
<TextBox Text="{itemName,mode:twoway}"/>
```
to have a textbox for each item able to modify the itemName property of TestViewModelItem (note again mode:twoway).
ItemsControl has one nice properties like ItemsPanel that allows you to specify which panel ItemsControl must use to arrange children elements. By default ItemsControl uses a Stack panel with Vertical orientation.
For example try use a Stack with Horizontal orientation:
```xml
<ItemsControl ItemsSource="{itemsCollection}" SelectedItem="{currentItem,mode:twoway}" VerticalAlignment= "Center" HorizontalAlignment= "Center">
    <ItemsControl.ItemsPanel>
        <Stack Orientation="Horizontal"/>
    </ItemsControl.ItemsPanel>
    <DataTemplate>
        <TextBlock Text="{itemName}"/>
    </DataTemplate>
</ItemsControl>
```
Bonus value is that you can create your custom panel and plug it like shown above. Creating custom panels or custom controls will be shown in next chapters.
DataTemplate has some nice features too. TargetType let you specify which type of object should be rendered with that DataTemplate. TargetMember let specify a property of item type to use to select the object to render.
For examples change xaml specifing 2 different DataTemplate for types number and string:
```xml
<ItemsControl ItemsSource="{itemsCollection}" SelectedItem="{currentItem,mode:twoway}" VerticalAlignment= "Center" HorizontalAlignment= "Center">
    <DataTemplate TargetType="number" TargetMember="itemValue">
        <TextBlock Text="{itemValue}"/>
    </DataTemplate>
    <DataTemplate TargetType="string" TargetMember="itemValue">
        <TextBox Text="{itemValue,mode:twoway}"/>
    </DataTemplate>    
</ItemsControl>
```
Take a look at TabView.ts and TreeView.ts from Layouts.Sample3 project to discover how is easy to build tabbed-views and tree-views using ItemsControl.
