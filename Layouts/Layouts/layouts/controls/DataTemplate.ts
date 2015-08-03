module layouts.controls {
    export class DataTemplate extends DepObject {
        static typeName: string = "layouts.controls.DataTemplate";
        get typeName(): string {
            return DataTemplate.typeName;
        }

        ///returns the type datatemplate is suited for
        ///if null it means it's a generic template utilizzable for any object of any type
        targetType: string = null;


        private _innerXaml: string;
        set innerXaml(value: string) {
            this._innerXaml = value;
        }

        private _xamlLoader: XamlReader;
        set xamlLoader(loader: XamlReader) {
            this._xamlLoader = loader;
        }

        createElement(): UIElement {
            return this._xamlLoader.Parse(this._innerXaml);
        }
    }


} 