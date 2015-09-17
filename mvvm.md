## model-view-viewmodel
*layouts* works best if you write code using a MVVM model. I can't here dive too much in MVVM and I'm sure you'll find on internet better resources to learn it. 

*layouts* derives most of its types from DepObject. DepObject provide some basic MVVM functionalities. If you derive a class from DepObject automatically you get some hand features like property changes notifications.

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
As you can see *layouts* REQUIRE that you states the name of the type using a non-standard property 'typeName'. In other words when you derive from DepObject directly or not you must add the typeName part give the type a name. I'll omit typeName section for simplicity.

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
      <TextBox Placeholder="User name (test)" Margin="8"/>
      <TextBox Type="password" Placeholder="Password (test)" Margin="8"/>
      <Button Text="Sign In" Margin="8,16,8,8"/>
  </Stack>
</Page>
```
