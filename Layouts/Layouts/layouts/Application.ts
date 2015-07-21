/// <reference path="LayoutManager.ts" />
/// <reference path="Controls\Page.ts" />

module tsui {
    export class Application {

        constructor() {
            Application._current = this;
        }
                
        //singleton application
        private static _current: Application;
        //get current application
        static get current(): Application {
            return Application._current;
        }

        private _page: tsui.controls.Page;
        get page(): tsui.controls.Page {
            return this._page;
        }

        set page(page: tsui.controls.Page) {
            if (this._page != page) {
                this._page = page;
                LayoutManager.requestLayoutUpdate();
            }
        }

    }
} 