
module app {
    export class Login extends layouts.controls.Page {
        static typeName: string = "app.Login";
        get typeName(): string {
            return Login.typeName;
        }

        constructor() {
            super();
            this.dataContext = new LoginViewModel(this);
            this.initializeComponent();
        }

        public static get PAGE_DEFINITION(): string {
            return `<?xml version="1.0" encoding="utf-8" ?>
<Stack Orientation="Vertical" VerticalAlignment="Center" HorizontalAlignment="Center">
    <TextBlock Text="Welcome to Login Page" Margin="8"/>
    <TextBox Text="{path:username,mode:twoway}" Placeholder="User name (test)" Margin="8"/>
    <TextBox Text="{path:password,mode:twoway}" Type="password" Placeholder="Password (test)" Margin="8"/>
    <Button Text="Sign In" Command="{path:loginCommand}" Margin="8,16,8,8"/>
</Stack>`;
        }

        protected initializeComponent() {
            let loader = new layouts.XamlReader();
            this.child = loader.Parse(Login.PAGE_DEFINITION);
        }

        public onNavigate(context: layouts.controls.NavigationContext) {

        }

    }
}