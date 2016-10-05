
module app {
    export class Page1 extends layouts.controls.Page {
        static typeName: string = "app.Page1";
        get typeName(): string {
            return Page1.typeName;
        }

        constructor() {
            super();
            this.initializeComponent();
            this.cachePage = true;
        }

        public static get PAGE_DEFINITION(): string {
            return `<?xml version="1.0" encoding="utf-8" ?>
<Stack Orientation="Vertical" VerticalAlignment="Center" HorizontalAlignment="Center">
    <TextBlock Text="{path:username}" Format="Welcome to Page1 user {0}" Margin="8"/>
    <TextBox Text="{path:parameter,twoway}" Placeholder="Parameter for page 2" Margin="8"/>
    <Button Text="Goto Page 2" Command="{path:gotoPage2Command}" Margin="8,16,8,8"/>
</Stack>`;
        }

        protected initializeComponent() {
            let loader = new layouts.XamlReader();
            this.child = loader.Parse(Page1.PAGE_DEFINITION);
        }

        public onNavigate(context: layouts.controls.NavigationContext) {

            this.dataContext = new Page1ViewModel(this, context.queryString["user"]);

        }

    }
}