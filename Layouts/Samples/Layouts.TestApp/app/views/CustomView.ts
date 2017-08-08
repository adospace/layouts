
module app.views {
    export class CustomView extends layouts.controls.UserControl {
        static typeName: string = "app.views.CustomView";
        get typeName(): string {
            return CustomView.typeName;
        }

    }
}  