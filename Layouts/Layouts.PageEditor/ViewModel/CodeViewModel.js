var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var CodeViewModel = (function (_super) {
    __extends(CodeViewModel, _super);
    function CodeViewModel(owner, isSampleCode) {
        if (isSampleCode === void 0) { isSampleCode = false; }
        _super.call(this);
        this.owner = owner;
        this._isSampleCode = false;
        this._isSampleCode = isSampleCode;
    }
    Object.defineProperty(CodeViewModel.prototype, "typeName", {
        get: function () {
            return CodeViewModel.typeName;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CodeViewModel.prototype, "title", {
        get: function () {
            return this._title;
        },
        set: function (value) {
            if (this._title != value) {
                var oldValue = this._title;
                this._title = value;
                this.onPropertyChanged("title", value, oldValue);
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CodeViewModel.prototype, "sourceCode", {
        get: function () {
            return this._sourceCode;
        },
        set: function (value) {
            if (this._sourceCode != value) {
                var oldValue = this._sourceCode;
                this._sourceCode = value;
                this.onPropertyChanged("sourceCode", value, oldValue);
                this.onSourceCodeChanged();
            }
        },
        enumerable: true,
        configurable: true
    });
    CodeViewModel.prototype.onSourceCodeChanged = function () {
        try {
            var parser = new DOMParser();
            var doc = parser.parseFromString(this.sourceCode, "text/xml").documentElement;
            if (this._oldParsedDocument == null ||
                !layouts.XamlReader.compareXml(this._oldParsedDocument, doc)) {
                this._oldParsedDocument = doc;
                var loader = new layouts.XamlReader();
                this.createdControl = loader.Load(doc);
                if (!this._isSampleCode)
                    localStorage.setItem(this.title, this.sourceCode);
            }
        }
        catch (error) {
            return;
        }
    };
    Object.defineProperty(CodeViewModel.prototype, "createdControl", {
        get: function () {
            return this._createdControl;
        },
        set: function (value) {
            if (this._createdControl != value) {
                var oldValue = this._createdControl;
                this._createdControl = value;
                this.onPropertyChanged("createdControl", value, oldValue);
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CodeViewModel.prototype, "view", {
        get: function () {
            if (this._view == null) {
                this._view = CodeView.getView();
            }
            return this._view;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CodeViewModel.prototype, "selectCommand", {
        get: function () {
            var _this = this;
            if (this._selectCommand == null)
                this._selectCommand = new layouts.Command(function (cmd, p) { return _this.onSelectItem(); }, function (cmd, p) { return true; });
            return this._selectCommand;
        },
        enumerable: true,
        configurable: true
    });
    CodeViewModel.prototype.onSelectItem = function () {
        this.owner.selected = this;
    };
    CodeViewModel.typeName = "codeViewModel";
    return CodeViewModel;
}(layouts.DepObject));
