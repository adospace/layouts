﻿module layouts {
    export class ObservableCollection<T> implements INotifyCollectionChanged<T> {
        constructor(elements?: Array<T>) {
            this.elements = elements == null ? new Array<T>() : elements;
        }

        elements: T[];

        toArray(): T[]{
            //return underling item list
            return this.elements;
        }

        add(element: T) {
            var iElement = this.elements.indexOf(element);
            if (iElement == -1) {
                this.elements.push(element);
                //make a copy of handlers list before invoke functions
                //because this.pcHandlers could be modified by user code
                this.pcHandlers.slice(0).forEach((h) => {
                    h(this, [element], []);
                });
            }
        }

        remove(element: T) {
            var iElement = this.elements.indexOf(element);
            if (iElement != -1) {
                this.elements.splice(iElement, 1);
                //make a copy of handlers list before invoke functions
                //because this.pcHandlers could be modified by user code
                this.pcHandlers.slice(0).forEach((h) => {
                    h(this, [], [element]);
                });
            }
        }

        at(index: number): T {
            return this.elements[index];
        }

        get count(): number {
            return this.elements.length;
        }

        forEach(action: (value: T, index: number, array: T[]) => void) {
            this.elements.forEach(action);
        }

        private pcHandlers: { (collection: ObservableCollection<T>, added: T[], removed: T[]): void }[] = [];

        //subscribe to collection changes
        on(handler: { (collection: ObservableCollection<T>, added: T[], removed: T[]): void }) {
            if (this.pcHandlers.indexOf(handler) == -1)
                this.pcHandlers.push(handler);
        }

        //unsubscribe from collection changes
        off(handler: { (collection: ObservableCollection<T>, added: T[], removed: T[]): void }) {
            var index = this.pcHandlers.indexOf(handler, 0);
            if (index != -1) {
                this.pcHandlers.splice(index, 1);
            }
        }
    }
}