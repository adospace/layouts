/// <reference path="Extensions.d.ts" />
/// <reference path="LayoutManager.d.ts" />
/// <reference path="Controls/Page.d.ts" />
declare module layouts {
    class Application {
        constructor();
        private static _current;
        static current: Application;
        private _page;
        page: layouts.controls.Page;
    }
}
