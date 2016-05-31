

module layouts {
    export class ObservableCollection<T> { // implements INotifyCollectionChanged<T> 
        constructor(elements?: Array<T>) {
            this.elements = elements == null ? new Array<T>() : elements;
        }

        elements: T[];

        toArray(): T[]{
            //return underling item list
            return this.elements;
        }

        add(element: T): T {
            if (element == null)
                throw new Error("element null");

            var iElement = this.elements.indexOf(element);
            if (iElement == -1) {
                this.elements.push(element);
                //make a copy of handlers list before invoke functions
                //because this.pcHandlers could be modified by user code
                this.pcHandlers.slice(0).forEach((h) => {
                    h.onCollectionChanged(this, [element], [], 0);
                });

                return element;
            }

            return this.elements[iElement];
        }

        remove(element: T) {
            if (element == null)
                throw new Error("element null");

            var iElement = this.elements.indexOf(element);
            if (iElement != -1) {
                this.elements.splice(iElement, 1);
                //make a copy of handlers list before invoke functions
                //because this.pcHandlers could be modified by user code
                this.pcHandlers.slice(0).forEach((h) => {
                    h.onCollectionChanged(this, [], [element], iElement);
                });
            }
        }

        at(index: number): T {
            return this.elements[index];
        }

        first(): T {
            return this.elements[0];
        }

        last(): T {
            return this.elements[this.elements.length - 1];
        }

        get count(): number {
            return this.elements.length;
        }

        forEach(action: (value: T, index: number, array: T[]) => void) {
            this.elements.forEach(action);
        }

        private pcHandlers: ISupportCollectionChanged[] = [];

        //subscribe to collection changes
        onChangeNotify(handler: ISupportCollectionChanged) {
            if (this.pcHandlers.indexOf(handler) == -1)
                this.pcHandlers.push(handler);
        }

        //unsubscribe from collection changes
        offChangeNotify(handler: ISupportCollectionChanged) {
            var index = this.pcHandlers.indexOf(handler, 0);
            if (index != -1) {
                this.pcHandlers.splice(index, 1);
            }
        }
    }
}