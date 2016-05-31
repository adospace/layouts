/// <reference path="Extensions.ts" />
/// <reference path="LayoutManager.ts" />
/// <reference path="Controls\Page.ts" />
var layouts;
(function (layouts) {
    var Application = (function () {
        function Application() {
            if (Application._current != null)
                throw new Error("Application already initialized");
            Application._current = this;
        }
        Object.defineProperty(Application, "current", {
            get: function () {
                if (Application._current == null)
                    Application._current = new Application();
                return Application._current;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Application.prototype, "page", {
            get: function () {
                return this._page;
            },
            set: function (page) {
                if (this._page != page) {
                    this._page = page;
                    layouts.LayoutManager.requestLayoutUpdate();
                }
            },
            enumerable: true,
            configurable: true
        });
        return Application;
    })();
    layouts.Application = Application;
})(layouts || (layouts = {}));
