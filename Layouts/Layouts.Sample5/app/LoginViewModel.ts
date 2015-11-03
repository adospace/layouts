
module app {
    export class LoginViewModel extends layouts.DepObject {
        static typeName: string = "app.LoginViewModel";
        get typeName(): string {
            return LoginViewModel.typeName;
        }

        constructor(public view: app.Login) {
            super();
        }

        private _username: string;
        get username(): string {
            return this._username;
        }
        set username(value: string) {
            if (this._username != value) {
                var oldValue = this._username;
                this._username = value;
                this.onPropertyChanged("username", value, oldValue);
                layouts.Application.beginInvoke(() =>
                    this._loginCommand.canExecuteChanged());
            }
        }

        private _password: string;
        get password(): string {
            return this._password;
        }
        set password(value: string) {
            if (this._password != value) {
                var oldValue = this._password;
                this._password = value;
                this.onPropertyChanged("password", value, oldValue);
                this._loginCommand.canExecuteChanged();
            }
        }

        private _loginCommand: layouts.Command;
        get loginCommand(): layouts.Command {
            if (this._loginCommand == null)
                this._loginCommand = new layouts.Command((cmd, p) => this.onLogin(), (cmd, p) => this.canLogin());
            return this._loginCommand;
        }

        onLogin() {
            if (this._username == "test" &&
                this._password == "test") {
                userLogged = true;
                layouts.Application.current.navigate("/page1/" + this._username);
            }
            else
                alert("Unable to login!");
        }

        canLogin(): boolean {
            return this._username != null && this._username.trim().length > 0 &&
                this._password != null && this._password.trim().length > 0;
        }

    }
}