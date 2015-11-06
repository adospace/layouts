module layouts {
    export class EventAction {
        constructor(public invokeHandler?: { (event: EventAction, parameter: any): void }) {
        }

        invoke(parameter: any) {
            this.invokeHandler(this, parameter);
        }

    }

} 