module layouts {

    //export interface ISupportContent {
    //    content: any;   
    //}

    //export interface ISupportChild {
    //    child: UIElement;
    //}

    //export interface ISupportChildren {
    //    children: UIElement[];
    //}

    //export interface ISupportItems {
    //    items: any[];
    //}

    export interface ISupportDependencyPropertyChange {
        onChangeDependencyProperty(depObject: DepObject, depProperty: DepProperty, value: any);
    }

    export interface ISupportPropertyChange {
        onChangeProperty(source: any, propertyName: string, value: any);
    }

    export interface INotifyPropertyChanged {
        registerObserver(observer: ISupportPropertyChange);
        unregisterObserver(observer: ISupportPropertyChange);
    }

    export interface ISupportCollectionChanged {
        onCollectionChanged(collection: any, added: any[], removed: any[], startRemoveIndex: number);
    }


    export interface ISupportCommandCanExecuteChanged {
        onCommandCanExecuteChanged(command: Command);
    }
}