/// <reference path="Extensions.ts" />
/// <reference path="LayoutManager.ts" />
/// <reference path="Controls\Page.ts" />

module layouts {
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

        private _page: layouts.controls.Page;
        get page(): layouts.controls.Page {
            return this._page;
        }

        set page(page: layouts.controls.Page) {
            if (this._page != page) {
                this._page = page;
                LayoutManager.requestLayoutUpdate();
            }
        }

    }
} 