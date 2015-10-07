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
            this._myCommand = new layouts.Command((cmd, p) => this.onMyCommand(), (cmd, p) => true);
        return this._myCommand;
    }

    onMyCommand() {
    }
}
