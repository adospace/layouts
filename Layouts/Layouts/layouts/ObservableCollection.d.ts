declare module layouts {
    class ObservableCollection<T> implements INotifyCollectionChanged<T> {
        private elements;
        add(element: T): void;
        remove(element: T): void;
        at(index: number): T;
        count: number;
        forEach(action: (value: T, index: number, array: T[]) => void): void;
        private pcHandlers;
        on(handler: {
            (collection: ObservableCollection<T>, added: T[], removed: T[]): void;
        }): void;
        off(handler: {
            (collection: ObservableCollection<T>, added: T[], removed: T[]): void;
        }): void;
    }
}
