/// <reference path="..\DepProperty.ts" />
/// <reference path="..\DepObject.ts" />
/// <reference path="..\FrameworkElement.ts" /> 
/// <reference path="..\ISupport.ts" /> 

module layouts.controls {
    export class ItemsControl extends FrameworkElement {

        private _items: ObservableCollection<Object>;

        get items(): Array<Object> {
            if (this._items == null) {
                this._items = new ObservableCollection<Object>();
                this._items.on(this.itemsCollectionChanged);
            }

            return this._items.toArray();
        }

        set items(value: Array<Object>) {

            if (this._items != null) {
                //remove handler so that resource can be disposed
                this._items.off(this.itemsCollectionChanged);
            }

            this._items = new ObservableCollection<Object>(value);
            this._items.on(this.itemsCollectionChanged);
        }

        private itemsCollectionChanged(collection: ObservableCollection<Object>, added: Object[], removed: Object[]) {
            this.invalidateMeasure();
        }


        private _itemsSource: INotifyCollectionChanged<Object>;

        get ItemsSource(): INotifyCollectionChanged<Object> {
            return this._itemsSource;
        }

        set ItemsSource(value: INotifyCollectionChanged<Object>) {
            if (this._itemsSource == value)
                return;

            if (this._itemsSource != null) {
                this._itemsSource.off(this.itemsSourceCollectionChanged);
            }

            this._itemsSource.on(this.itemsSourceCollectionChanged);
        }

        private itemsSourceCollectionChanged(collection: ObservableCollection<Object>, added: Object[], removed: Object[]) {
            this.invalidateMeasure();
        }
    }
}