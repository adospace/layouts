var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var AppViewModel = (function (_super) {
    __extends(AppViewModel, _super);
    function AppViewModel() {
        _super.apply(this, arguments);
        this._items = new layouts.ObservableCollection();
    }
    Object.defineProperty(AppViewModel.prototype, "typeName", {
        get: function () {
            return AppViewModel.typeName;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AppViewModel.prototype, "items", {
        get: function () {
            return this._items;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AppViewModel.prototype, "selected", {
        get: function () {
            return this._selected;
        },
        set: function (value) {
            if (this._selected != value) {
                var oldValue = this._selected;
                this._selected = value;
                this.onPropertyChanged("selected", value, oldValue);
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AppViewModel.prototype, "addCommand", {
        get: function () {
            var _this = this;
            if (this._addCommand == null)
                this._addCommand = new layouts.Command(function (cmd, p) { return _this.onAddItem(); }, function (cmd, p) { return true; });
            return this._addCommand;
        },
        enumerable: true,
        configurable: true
    });
    AppViewModel.prototype.onAddItem = function () {
        this._items.add(new CodeViewModel(this));
        this.selected = this._items.last();
        this.selected.title = "Code " + this._items.count;
    };
    AppViewModel.prototype.loadSavedSamples = function () {
        var _this = this;
        var jsonFile = new XMLHttpRequest();
        jsonFile.onreadystatechange = function (ev) {
            if (jsonFile.readyState == 4 && jsonFile.status == 200) {
                var jsonContent = JSON.parse(jsonFile.responseText);
                var samples = jsonContent;
                for (var i = 0; i < samples.length; i++) {
                    var sample = new CodeViewModel(_this, true);
                    sample.title = samples[i].Title;
                    sample.sourceCode = samples[i].Code;
                    _this._items.add(sample);
                }
                for (var i = 0; i < localStorage.length; i++) {
                    var sample = new CodeViewModel(_this);
                    sample.title = "Code " + (i + 1);
                    sample.sourceCode = localStorage.getItem(sample.title);
                    _this._items.add(sample);
                }
                _this.selected = _this._items.first();
            }
        };
        jsonFile.open("GET", "Samples.txt", true);
        jsonFile.send();
    };
    AppViewModel.typeName = "appViewModel";
    return AppViewModel;
}(layouts.DepObject));
