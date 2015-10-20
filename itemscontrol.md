
## ItemsControl

One foundamntal control provided by *Layouts* is ItemsControl. With it you can arrange a list of elements based off a collection of objects. The most obvious example of ItemsControl is classic ListBox.
To start let's create a view-model that expose a collection of objects and a property that returns currently selected item.
```javascript
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
