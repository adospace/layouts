declare module layouts {
    interface INotifyCollectionChanged<T> {
        on(handler: {
            (collection: INotifyCollectionChanged<T>, added: T[], removed: T[]): void;
        }): any;
        off(handler: {
            (collection: INotifyCollectionChanged<T>, added: T[], removed: T[]): void;
        }): any;
    }
}
