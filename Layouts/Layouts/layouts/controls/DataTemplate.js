var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var layouts;
(function (layouts) {
    var controls;
    (function (controls) {
        var DataTemplate = (function (_super) {
            __extends(DataTemplate, _super);
            function DataTemplate() {
                _super.apply(this, arguments);
            }
            Object.defineProperty(DataTemplate.prototype, "typeName", {
                get: function () {
                    return DataTemplate.typeName;
                },
                enumerable: true,
                configurable: true
            });
            DataTemplate.prototype.setInnerXaml = function (value) {
                this._innerXaml = value;
            };
            DataTemplate.prototype.setXamlLoader = function (loader) {
                this._xamlLoader = loader;
            };
            DataTemplate.prototype.createElement = function () {
                var reader = this._xamlLoader;
                if (reader == null)
                    reader = new layouts.XamlReader();
                return reader.Parse(this._innerXaml);
            };
            DataTemplate.getTemplateForItem = function (templates, item, name) {
                if (name === void 0) { name = null; }
                if (templates == null ||
                    templates.length == 0)
                    return null;
                var foundTemplate = Enumerable.From(templates).FirstOrDefault(null, function (template) {
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
                    var typeName = typeof itemForTemplate;
                    if (layouts.Ext.hasProperty(itemForTemplate, "typeName"))
                        typeName = itemForTemplate["typeName"];
                    else {
                        if (itemForTemplate instanceof Date)
                            typeName = "date";
                    }
                    if (typeName != null &&
                        template.targetType != null &&
                        template.targetType.toLowerCase() == typeName.toLowerCase())
                        return true;
                    return false;
                });
                if (foundTemplate != null)
                    return foundTemplate;
                return Enumerable.From(templates).FirstOrDefault(null, function (dt) { return dt.targetType == null; });
            };
            DataTemplate.getTemplateForMedia = function (templates) {
                if (templates == null ||
                    templates.length == 0)
                    return null;
                var foundTemplate = Enumerable.From(templates).FirstOrDefault(null, function (template) {
                    if (template.media == null ||
                        template.media.trim().length == 0) {
                        return true;
                    }
                    return window.matchMedia(template.media).matches;
                });
                if (foundTemplate != null)
                    return foundTemplate;
                return Enumerable.From(templates).FirstOrDefault(null, function (dt) { return dt.targetType == null; });
            };
            Object.defineProperty(DataTemplate.prototype, "targetType", {
                get: function () {
                    return this.getValue(DataTemplate.targetTypeProperty);
                },
                set: function (value) {
                    this.setValue(DataTemplate.targetTypeProperty, value);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(DataTemplate.prototype, "targetMember", {
                get: function () {
                    return this.getValue(DataTemplate.targetMemberProperty);
                },
                set: function (value) {
                    this.setValue(DataTemplate.targetMemberProperty, value);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(DataTemplate.prototype, "media", {
                get: function () {
                    return this.getValue(DataTemplate.mediaProperty);
                },
                set: function (value) {
                    this.setValue(DataTemplate.mediaProperty, value);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(DataTemplate.prototype, "name", {
                get: function () {
                    return this.getValue(DataTemplate.nameProperty);
                },
                set: function (value) {
                    this.setValue(DataTemplate.nameProperty, value);
                },
                enumerable: true,
                configurable: true
            });
            DataTemplate.typeName = "layouts.controls.DataTemplate";
            DataTemplate.targetTypeProperty = layouts.DepObject.registerProperty(DataTemplate.typeName, "TargetType", null);
            DataTemplate.targetMemberProperty = layouts.DepObject.registerProperty(DataTemplate.typeName, "TargetMember", null);
            DataTemplate.mediaProperty = layouts.DepObject.registerProperty(DataTemplate.typeName, "Media", null);
            DataTemplate.nameProperty = layouts.DepObject.registerProperty(DataTemplate.typeName, "Name", null);
            return DataTemplate;
        }(layouts.DepObject));
        controls.DataTemplate = DataTemplate;
    })(controls = layouts.controls || (layouts.controls = {}));
})(layouts || (layouts = {}));
