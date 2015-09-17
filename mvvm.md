## model-view-viewmodel
*layouts* works best if you write code using a MVVM model. I can't dive here too much in MVVM and I'm sure you'll find on internet better resources to learn it. 

*layouts* derives most of its types from DepObject. DepObject provide some basic MVVM functionalities. If you derive a class from DepObject automatically you get some handy features like property changes notifications.

For example say we want to build a fully working login page:
```javascript
window.onload = () => {
    var app = new layouts.Application();
    var lmlReader = new layouts.XamlReader();

    var lmlTest = `<?xml version="1.0" encoding="utf-8" ?>
<Page>
  <Stack Orientation="Vertical" VerticalAlignment="Center" HorizontalAlignment="Center">
      <TextBlock Text="Welcome to Login Page" Margin="8"/>
      <TextBox Placeholder="User name (test)" Margin="8"/>
      <TextBox Type="password" Placeholder="Password (test)" Margin="8"/>
      <Button Text="Sign In" Margin="8,16,8,8"/>
  </Stack>
</Page>
`;
    app.page = lmlReader.Parse(lmlTest);
};
```
Start creating the viewmodel:
```javascript
export class LoginViewModel extends layouts.DepObject {
    static typeName: string = "app.LoginViewModel";
    get typeName(): string {
        return LoginViewModel.typeName;
    }
}
```
As you can see *layouts* REQUIRE that you states the name of the type using a non-standard property 'typeName'. In other words when you derive from DepObject directly or not you must add the typeName part giving a name to the type. I'll omit typeName section for simplicity below.

Now let's add a property called 'username':
```javascript
export class LoginViewModel extends layouts.DepObject {
    ///typeName section
    
    private _username: string;
    get username(): string {
        return this._username;
    }
    set username(value: string) {
        if (this._username != value) {
            var oldValue = this._username;
            this._username = value;
            this.onPropertyChanged("username", value, oldValue);
        }
    }
}
```
username is defined as public property of type string that has an important call in the set accessor: this.onPropertyChanged(). This call to base DebOpject.onPropertyChanged() protected function notifies any object connect to username changes (most of times is a view class that need to render properly the change).

Now connect the view (in our case the page) with the viewmodel using the dataContext property:
```javascript
window.onload = () => {
    var app = new layouts.Application();
    var lmlReader = new layouts.XamlReader();
    var lmlTest = `..<omitted>...`;
    
    app.page = lmlReader.Parse(lmlTest);
    //important: the viewModel becames now the "data context" of the page
    //from this point on any connection or "binding" defined in the page will target by default
    //our viewmodel LoginViewModel
    app.dataContext = new LoginViewModel();
};
```
Finally change the page xaml so to connect or better said 'bind' username textbox to username property of our viewmodel:
```xml
<Page>
  <Stack Orientation="Vertical" VerticalAlignment="Center" HorizontalAlignment="Center">
      <TextBlock Text="Welcome to Login Page" Margin="8"/>
      <TextBox Text="{username,twoway}" Placeholder="User name (test)" Margin="8"/>
      <TextBox Type="password" Placeholder="Password (test)" Margin="8"/>
      <Button Text="Sign In" Margin="8,16,8,8"/>
  </Stack>
</Page>
```
We're actually declaring a binding between dependency property called "Text" of a TextBox UI element (called target) to a a property of a DepObject-derived object (that is called source).  Any changes made to property username of the viemodel is transmitted to property Text of TextBox object. As binding is defined as "twoway" also changes to Text property of the TextBox is propagated to Text property of the ViewModel.

### datacontext
DataContext is a foundamental dependency property. When is created, a Binding by default looks for a source using the DataContext property. Any element of the UI (derived from UIElement and in turn from DepObject) has the DataContext property. If you look above with set the DataContext property of the Page object that is actually the grand parent of TextBox. DataContext "inherit" from page to its descendants or better when binding tries to access TextBox DataContext it bubble up to its parent Stack and then to Page where it finally find a not-null DataContext. This means that you can for example set Stack DataContext to a different value and TextBox automatically will connect to that object.

### bindings
Now let's complete our viewmodel and view with password property and binding:
```javascript
export class LoginViewModel extends layouts.DepObject {
    ///typeName section
    
    private _username: string;
    get username(): string {
        return this._username;
    }
    set username(value: string) {
        if (this._username != value) {
            var oldValue = this._username;
            this._username = value;
            this.onPropertyChanged("username", value, oldValue);
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
        }
    }
}
```
```xml
<Page>
  <Stack Orientation="Vertical" VerticalAlignment="Center" HorizontalAlignment="Center">
      <TextBlock Text="Welcome to Login Page" Margin="8"/>
      <TextBox Text="{username,twoway}" Placeholder="User name (test)" Margin="8"/>
      <TextBox Text="{password,twoway}" Type="password" Placeholder="Password (test)" Margin="8"/>
      <Button Text="Sign In" Margin="8,16,8,8"/>
  </Stack>
</Page>
```
So now when user types some text in username and password our viewmodel is promptly notified and we'll have the _username and _password fields always updated with the view.

Last step is to respond to user click to SignIn button. In MVVM this is solved elegantly with the Command pattern, and of course *layouts* fully support it. Command is a special object that let you respond to events of the view in the viewmodel maintening the viewmodel completely separated by view implementation.

This is the command definition:
```javascript
export class LoginViewModel extends layouts.DepObject {
    ///typeName section
    ///username and password properties omitted

    private _loginCommand: layouts.Command;
    get loginCommand(): layouts.Command {
        if (this._loginCommand == null)
            this._loginCommand = new layouts.Command((cmd, p) => this.onLogin(), (cmd, p) => this.canLogin());
        return this._loginCommand;
    }

    onLogin() {
        if (this._username == "test" &&
            this._password == "test") {
            alert("Logged in!");
        }
        else
            alert("Unable to login!");
    }

    canLogin(): boolean {
        return this._username != null && this._username.trim().length > 0 &&
            this._password != null && this._password.trim().length > 0;
    }
    
}
```
and this is how signin button bound to command:
```xml
<Stack Orientation="Vertical" VerticalAlignment="Center" HorizontalAlignment="Center">
    <!-- omitted  -->
    <Button Text="Sign In" Command="{loginCommand}" Margin="8,16,8,8"/>
</Stack>
```
Actually we're not doing any different from username/password bindings above. We're binding to the property loginCommand that return a Command object. 

Button is now fully working:
- When user click the button it just call the method "execute" of the Command that in turn call the onLogin() method of the viewmodel.
- Button calls Command.canExecute that in turn calls the canLogin() method of the viewmodel when it needs to know its state (enabled or enabled).

Maybe you're thinking how button knows WHEN it needs to call Command.canExecute. In the snippet below I'll show you the complete viewmodel and you should notice that now set accessors of properties username and password have also a call to _loginCommand.canExecuteChanged(). This call allows the command to notify its observers that something in the canExecute logic may be changed. In fact if you see the canLogin method you'll find that username and password are tested to not be empty.
