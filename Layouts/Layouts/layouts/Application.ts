/// <reference path="Extensions.ts" />
/// <reference path="LayoutManager.ts" />
/// <reference path="Controls\Page.ts" />

module layouts {
    export class Application {
                
        constructor()
        {
            if (Application._current != null)
                throw new Error("Application already initialized");
            Application._current = this;
        }

        //singleton application
        private static _current: Application;
        //get current application
        static get current(): Application {
            if (Application._current == null)
                Application._current = new Application();

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