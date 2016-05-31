/// <reference path="../DepProperty.d.ts" />
/// <reference path="../DepObject.d.ts" />
/// <reference path="../FrameworkElement.d.ts" />
declare module layouts.controls {
    class ItemsControl extends FrameworkElement {
        private _items;
        items: ObservableCollection<Object>;
        private _itemsSource;
        itemsSource: INotifyCollectionChanged<Object>;
    }
}
