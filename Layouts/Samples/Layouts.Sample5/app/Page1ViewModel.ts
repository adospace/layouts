
module app {
    export class Page1ViewModel extends layouts.DepObject {
        static typeName: string = "app.Page1ViewModel";
        get typeName(): string {
            return Page1ViewModel.typeName;
        }

        constructor(public view: app.Page1, username: string) {
            super();
            this._username = username;
        }

        private _username: string;
        get username(): string {
            return this._username;
        }

        private _parameter: string;
        get parameter(): string {
            return this._parameter;
        }
        set parameter(value: string) {
            if (this._parameter != value) {
                var oldValue = this._parameter;
                this._parameter = value;
                this.onPropertyChanged("parameter", value, oldValue);
                this._gotoPage2Command.canExecuteChanged();
            }
        }

        private _gotoPage2Command: layouts.Command;
        get gotoPage2Command(): layouts.Command {
            if (this._gotoPage2Command == null)
                this._gotoPage2Command = new layouts.Command((cmd, p) => this.onGotoPage2(), (cmd, p) => this.parameter != null && this.parameter.trim().length > 0);
            return this._gotoPage2Command;
        }

        onGotoPage2() {
            layouts.Application.current.navigate("/Page2/" + this.parameter);
        }


    }
}