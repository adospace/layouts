module layouts {
    export class Command {
        constructor(public executeHandler?: { (command: Command, parameter: any): void }, public canExecuteHandler?: { (command: Command, parameter: any): boolean }) {
        }

        canExecute(parameter: any): boolean {
            if (this.executeHandler == null)
                return false;

            if (this.canExecuteHandler != null)
                return this.canExecuteHandler(this, parameter);

            return true;
        }

        execute(parameter: any) {
            if (this.canExecute(parameter))
                this.executeHandler(this, parameter);
        }

        private handlers: ISupportCommandCanExecuteChanged[] = [];

        //subscribe to command canExecute change events
        onCanExecuteChangeNotify(handler: ISupportCommandCanExecuteChanged) {
            if (this.handlers.indexOf(handler) == -1)
                this.handlers.push(handler);
        }

        //unsubscribe to command canExecute change events
        offCanExecuteChangeNotify(handler: ISupportCommandCanExecuteChanged) {
            var index = this.handlers.indexOf(handler, 0);
            if (index != -1) {
                this.handlers.splice(index, 1);
            }
        }

        canExecuteChanged() {
            this.handlers.slice(0).forEach((h) => {
                h.onCommandCanExecuteChanged(this);
            });
        }
    }

} 