class TestViewModel extends layouts.DepObject {
    static typeName: string = "TestViewModel";
    get typeName(): string {
        return TestViewModel.typeName;
    }

    get title(): string {
        return "TestTitle";
    }

    private _myCommand: layouts.Command;
    get myCommand(): layouts.Command {
        if (this._myCommand == null)
            this._myCommand = new layouts.Command((cmd, p) => this.onMyCommand(), (cmd, p) => this.cmdEnabled);
        return this._myCommand;
    }

    onMyCommand() {
        alert("OnMyCommand!");
    }

    private _cmdEnabled: boolean = true;
    get cmdEnabled(): boolean {
        return this._cmdEnabled;
    }
    set cmdEnabled(value: boolean) {
        if (this._cmdEnabled != value) {
            var oldValue = this._cmdEnabled;
            this._cmdEnabled = value;
            this.onPropertyChanged("cmdEnabled", value, oldValue);
            this.myCommand.canExecuteChanged();
        }
    }
}
