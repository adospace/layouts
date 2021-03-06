﻿module layouts.controls {
    export class DataTemplate extends DepObject {
        static typeName: string = "layouts.controls.DataTemplate";
        get typeName(): string {
            return DataTemplate.typeName;
        }

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

        public static getTemplateForItem(templates: DataTemplate[], item: any, name: string = null): DataTemplate {
            if (templates == null ||
                templates.length == 0)
                return null;

            var foundTemplate =
                templates.firstOrDefault(template => {
                    if (name != null &&
                        template.name != null &&
                        template.name.toLowerCase() == name.toLowerCase())
                        return true;

                    if (template.targetType == null)
                        return false;

                    var itemForTemplate = item;
                    if (template.targetMember != null &&
                        template.targetMember != "")
                        itemForTemplate = itemForTemplate[template.targetMember];

                    var typeName: string = typeof itemForTemplate;
                    if (Ext.hasProperty(itemForTemplate, "typeName"))
                        typeName = itemForTemplate["typeName"];
                    else {
                        if (itemForTemplate instanceof Date)//detect date type
                            typeName = "date";
                    }

                    if (typeName != null &&
                        template.targetType != null &&
                        template.targetType.toLowerCase() == typeName.toLowerCase())
                        return true;

                    return false;
                }, null);

            if (foundTemplate != null)
                return foundTemplate;

            return templates.firstOrDefault(dt => dt.targetType == null, null);
        }

        public static getTemplateForMedia(templates: DataTemplate[]): DataTemplate {
            if (templates == null ||
                templates.length == 0)
                return null;

            var foundTemplate =
                templates.firstOrDefault(template => {
                    if (template.media == null ||
                        template.media.trim().length == 0) {
                        return true;
                    }

                    return window.matchMedia(template.media).matches;
                }, null);

            if (foundTemplate != null)
                return foundTemplate;

            return templates.firstOrDefault(dt => dt.targetType == null, null);
        }


        ///returns the type datatemplate is suited for
        ///if null it means it's a generic template usable for any object of any type
        static targetTypeProperty = DepObject.registerProperty(DataTemplate.typeName, "TargetType", null);
        get targetType(): string {
            return <string>this.getValue(DataTemplate.targetTypeProperty);
        }
        set targetType(value: string) {
            this.setValue(DataTemplate.targetTypeProperty, value);
        }

        static targetMemberProperty = DepObject.registerProperty(DataTemplate.typeName, "TargetMember", null);
        get targetMember(): string {
            return <string>this.getValue(DataTemplate.targetMemberProperty);
        }
        set targetMember(value: string) {
            this.setValue(DataTemplate.targetMemberProperty, value);
        }

        static mediaProperty = DepObject.registerProperty(DataTemplate.typeName, "Media", null);
        get media(): string {
            return <string>this.getValue(DataTemplate.mediaProperty);
        }
        set media(value: string) {
            this.setValue(DataTemplate.mediaProperty, value);
        }

        static nameProperty = DepObject.registerProperty(DataTemplate.typeName, "Name", null);
        get name(): string {
            return <string>this.getValue(DataTemplate.nameProperty);
        }
        set name(value: string) {
            this.setValue(DataTemplate.nameProperty, value);
        }
    }


} 