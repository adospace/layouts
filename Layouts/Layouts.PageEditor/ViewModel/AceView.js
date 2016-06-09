var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var AceView = (function (_super) {
    __extends(AceView, _super);
    function AceView() {
        _super.apply(this, arguments);
        this._changeTimer = null;
        this._reentrantFlag = false;
    }
    Object.defineProperty(AceView.prototype, "typeName", {
        get: function () {
            return AceView.typeName;
        },
        enumerable: true,
        configurable: true
    });
    AceView.prototype.attachVisualOverride = function (elementContainer) {
        var _this = this;
        this._visual = this._divElement = document.createElement("div");
        _super.prototype.attachVisualOverride.call(this, elementContainer);
        if (this._editor == null) {
            this._editor = ace.edit(this._visual);
            this._editor.setTheme("ace/theme/clouds");
            this._editor.getSession().setMode("ace/mode/xml");
            this._editor.addEventListener("change", function (ev) {
                if (_this._changeTimer == null)
                    _this._changeTimer = new layouts.Timer(function (timer) { return _this.updateSourceProperty(); }, 1000);
                _this._changeTimer.start();
            });
            if (this.sourceCode != null)
                this._editor.setValue(this.sourceCode);
        }
    };
    AceView.prototype.onDocumentChange = function () {
    };
    AceView.prototype.updateSourceProperty = function () {
        this._changeTimer.stop();
        this._reentrantFlag = true;
        this.sourceCode = this._editor.getValue();
        this._reentrantFlag = false;
    };
    Object.defineProperty(AceView.prototype, "sourceCode", {
        get: function () {
            return this.getValue(AceView.sourceCodeProperty);
        },
        set: function (value) {
            this.setValue(AceView.sourceCodeProperty, value);
        },
        enumerable: true,
        configurable: true
    });
    AceView.prototype.onDependencyPropertyChanged = function (property, value, oldValue) {
        if (property == AceView.sourceCodeProperty &&
            this._editor != null &&
            !this._reentrantFlag)
            this._editor.setValue(value == null ? "" : value);
        _super.prototype.onDependencyPropertyChanged.call(this, property, value, oldValue);
    };
    AceView.typeName = "aceEditor";
    AceView.sourceCodeProperty = layouts.DepObject.registerProperty(AceView.typeName, "SourceCode", null);
    return AceView;
}(layouts.FrameworkElement));
