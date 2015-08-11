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
        setInnerXaml(value: string) {
            this._innerXaml = value;
        }

        private _xamlLoader: XamlReader;
        setXamlLoader(loader: XamlReader) {
            this._xamlLoader = loader;
        }

        createElement(): UIElement {
            var reader = this._xamlLoader;
            if (reader == null)
                reader = new XamlReader();

            return reader.Parse(this._innerXaml);
        }
    }


} 