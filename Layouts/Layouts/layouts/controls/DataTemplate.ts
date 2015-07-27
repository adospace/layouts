module layouts.controls {
    export class DataTemplate extends DepObject {
        static typeName: string = "layouts.controls.DataTemplate";
        get typeName(): string {
            return DataTemplate.typeName;
        }

        ///returns the type datatemplate is suited for
        ///if null it means it's a generic template utilizzable for any object of any type
        targetType: string = null;

        ///returns the root of the visual tree that represents the template
        private _child: UIElement;
        get child(): UIElement {
            return this._child;
        }
        set child(value: UIElement) {
            this._child = value;
        }

    }


} 