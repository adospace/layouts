var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var layouts;
(function (layouts) {
    var controls;
    (function (controls) {
        var ContentTemplate = (function (_super) {
            __extends(ContentTemplate, _super);
            function ContentTemplate() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            Object.defineProperty(ContentTemplate.prototype, "typeName", {
                get: function () {
                    return ContentTemplate.typeName;
                },
                enumerable: true,
                configurable: true
            });
            ContentTemplate.prototype.setInnerXaml = function (value) {
                this._innerXaml = value;
            };
            ContentTemplate.prototype.setXamlLoader = function (loader) {
                this._xamlLoader = loader;
            };
            ContentTemplate.prototype.setupChild = function () {
                if (this._container == null)
                    return;
                var content = this.content;
                var child = this._child;
                if (content == null &&
                    child == null)
                    return;
                if (content != null &&
                    child == null) {
                    if (this._innerXaml != null &&
                        this._xamlLoader != null) {
                        this._child = child = this._xamlLoader.Parse(this._innerXaml);
                    }
                }
                if (content != null &&
                    child != null) {
                    child.setValue(layouts.FrameworkElement.dataContextProperty, content);
                    child.parent = this;
                    child.attachVisual(this._container);
                }
                if (content == null &&
                    child != null) {
                    if (child.parent == this) {
                        child.parent = null;
                        child.attachVisual(null);
                    }
                }
            };
            ContentTemplate.prototype.attachVisualOverride = function (elementContainer) {
                this._container = elementContainer;
                this.setupChild();
                _super.prototype.attachVisualOverride.call(this, elementContainer);
            };
            ContentTemplate.prototype.measureOverride = function (constraint) {
                var child = this._child;
                if (child != null) {
                    child.measure(constraint);
                    return child.desiredSize;
                }
                return new layouts.Size();
            };
            ContentTemplate.prototype.arrangeOverride = function (finalSize) {
                var child = this._child;
                if (child != null)
                    child.arrange(finalSize.toRect());
                return finalSize;
            };
            ContentTemplate.prototype.layoutOverride = function () {
                _super.prototype.layoutOverride.call(this);
                var child = this._child;
                if (child != null)
                    child.layout(this.visualOffset);
            };
            Object.defineProperty(ContentTemplate.prototype, "content", {
                get: function () {
                    return this.getValue(ContentTemplate.contentProperty);
                },
                set: function (value) {
                    this.setValue(ContentTemplate.contentProperty, value);
                },
                enumerable: true,
                configurable: true
            });
            ContentTemplate.prototype.onDependencyPropertyChanged = function (property, value, oldValue) {
                if (property == ContentTemplate.contentProperty) {
                    this.setupChild();
                }
                _super.prototype.onDependencyPropertyChanged.call(this, property, value, oldValue);
            };
            return ContentTemplate;
        }(layouts.FrameworkElement));
        ContentTemplate.typeName = "layouts.controls.ContentTemplate";
        ContentTemplate.contentProperty = layouts.DepObject.registerProperty(ContentTemplate.typeName, "Content", null, layouts.FrameworkPropertyMetadataOptions.AffectsMeasure | layouts.FrameworkPropertyMetadataOptions.AffectsRender);
        controls.ContentTemplate = ContentTemplate;
    })(controls = layouts.controls || (layouts.controls = {}));
})(layouts || (layouts = {}));
