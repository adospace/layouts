/// <reference path="..\DepProperty.ts" />
/// <reference path="..\DepObject.ts" />
/// <reference path="..\FrameworkElement.ts" /> 

module tsui.controls {
    export class ItemsControl extends FrameworkElement {

        private _items: ObservableCollection<Object>;

        get items(): ObservableCollection<Object> {
            if (this._items == null) {
                this._items = new ObservableCollection<Object>();
                var self = this;
                this._items.on((c, added, removed) => {
                    self.invalidateMeasure();
                });
            }

            return this._items;
        }

        private _itemsSource: INotifyCollectionChanged<Object>;

        get itemsSource(): INotifyCollectionChanged<Object> {
            return this._itemsSource;
        }
        set itemsSource(value: INotifyCollectionChanged<Object>) {
            if (this._itemsSource != null) {
                
            }
        }


    }
}