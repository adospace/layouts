module layouts {
    export class Command {
        private executeHandler: { (command: Command, parameter: any): void }
        private canExecuteHandler: { (command: Command, parameter: any): boolean }

        constructor(executeHandler: { (command: Command, parameter: any): void }, canExecuteHandler?: { (command: Command, parameter: any): boolean }) {
            this.executeHandler = executeHandler;
            this.canExecuteHandler = canExecuteHandler;
        }

        canExecute(parameter: any): boolean {
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