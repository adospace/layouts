
module app.views {
    export class CustomPage extends layouts.controls.Page {
        static typeName: string = "app.views.CustomPage";
        get typeName(): string {
            return CustomPage.typeName;
        }

    }
}  