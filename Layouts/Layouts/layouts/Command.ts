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


    }

} 