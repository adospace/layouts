/// <reference path="Extensions.ts" />
/// <reference path="LayoutManager.ts" />
/// <reference path="Controls\Page.ts" />

module layouts {
    export class UriMapping {
        constructor(public uri: string, mapping: string) {
            this.mapping = mapping;
        }

        private _mapping: string;
        get mapping(): string {
            return this._mapping;
        }
        set mapping(value: string) {
            var re = /(\/|\\)/gi;
            this._mapping = value.replace(re, '.');
        }

        private static _rxMapping: RegExp = new RegExp("\{([\w\d_&$]+)\}", "gi");

        private _compiled: boolean = false;
        private _compiledUri: RegExp;
        private _queryStringTokens: string[] = new Array<string>();
        compile() : void {
            if (!this._compiled) {
                ///example:
                ///   /Product/{value1}/{value2}/{value3}
                ///compile in:
                ///   \/Product\/([\w\d_$]+)\/([\w\d_$]+)\/([\w\d_$]+)
                //var re = /\{([\w\d_$]+)\}/gi;
                var re = new RegExp("\\{([\\w\\d_&$-]+)\\}", "gi");
                var s = this.uri;
                var m;
                var rx = this.uri.split("/").join("\\/");

                do {
                    m = re.exec(s);
                    if (m) {
                        //console.log(m[0], m[1]);
                        rx = rx.replace(m[0], "([\\w\\d_&$-]+)");
                        this._queryStringTokens.push(m[1]);
                    }
                } while (m);

                this._compiledUri = new RegExp(rx, "gi");
                this._compiled = true;
            }
        }

        test(uri: string): boolean {
            this.compile();
            this._compiledUri.lastIndex = 0;
            return this._compiledUri.test(uri);
        }

        resolve(uriToResolve: string): {} {
            this.compile();
            var match;
            var re = this._compiledUri;
            var result = {};
            var i = 0;
            
            this._compiledUri.lastIndex = 0;
            var m = re.exec(uriToResolve);

            for (var i = 1; i < m.length; i++) {
                result[this._queryStringTokens[i - 1]] = m[i];
            }

            return result;
        }
    }

    class NavigationItem {
        constructor(public uri: string) { }

        public cachedPage: controls.Page;
    }

    export class Application {
                
        constructor()
        {
            if (Application._current != null)
                throw new Error("Application already initialized");
            Application._current = this;

            if ("onhashchange" in window) { // event supported?
                window.onhashchange = ev =>
                    this.hashChanged(window.location.hash);
                
            }
            else { // event not supported:
                var storedHash = window.location.hash;
                window.setInterval(()=> {
                    if (window.location.hash != storedHash) {
                        storedHash = window.location.hash;
                        this.hashChanged(storedHash);
                    }
                }, 100);
            }         
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
                if (this._page != null)
                    this._page.attachVisual(null);

                this._page = page;

                if (this._page != null)
                    this._page.attachVisual(document.body);

                Application.requestAnimationFrame();
            }
        }

        //Dispatcher Thread
        private static requestAnimationFrame() {
            requestAnimationFrame(Application.onAnimationFrame);
        }

        private static onAnimationFrame() {
            LayoutManager.updateLayout();
            Application._beginInvokeActions.forEach((action) => { action() });
            Application._beginInvokeActions = [];
            requestAnimationFrame(Application.onAnimationFrame);
        }

        private static _beginInvokeActions: (() => void)[] = [];
        static beginInvoke(action: () => void) {
            Application._beginInvokeActions.push(action);
        }

        private _mappings: UriMapping[] = [];
        get mappings(): UriMapping[] {
            return this._mappings;
        }

        public map(uri: string, mappedUri: string) : UriMapping {
            var mappings = Enumerable.From(this._mappings);
            var uriMapping = mappings.FirstOrDefault(null, (m) => m.uri == uri);
            if (uriMapping == null) {
                uriMapping = new UriMapping(uri, mappedUri);
                this._mappings.push(uriMapping);   
            }

            uriMapping.mapping = mappedUri;

            return uriMapping;
        }

        private _navigationStack: NavigationItem[] = new Array<NavigationItem>();
        private _currentNavigationitem: NavigationItem;
        private _returnUri: string;

        public onBeforeNavigate: (ctx: controls.NavigationContext) => void;
        public onAfterNavigate: (ctx: controls.NavigationContext) => void;

        public navigate(uri?: string, loader?: InstanceLoader): boolean {
            if (uri == null) {
                uri = window.location.hash.length > 0 ?
                    window.location.hash.slice(1) : Consts.stringEmpty;
            }

            if (this._currentNavigationitem != null &&
                this._currentNavigationitem.uri == uri)
                return true;

            var mappings = Enumerable.From(this._mappings);
            var uriMapping = mappings.FirstOrDefault(null, (m) => m.test(uri));

            if (uriMapping != null) {
                var queryString = uriMapping.resolve(uri);

                if (this._currentNavigationitem != null) {
                    var currentNavigationItem = this._currentNavigationitem;
                    var navigationStack = this._navigationStack;

                    while (navigationStack.length > 0 &&
                        navigationStack[navigationStack.length - 1] != currentNavigationItem) {
                        navigationStack.pop();
                    }

                    //save page if required
                    if (this.page.cachePage)
                        this._currentNavigationitem.cachedPage = this.page;
                }

                var previousPage = this.page;
                var previousUri = this._currentNavigationitem != null ? this._currentNavigationitem.uri : null;                

                if (loader == null)
                    loader = new InstanceLoader(window);

                var targetPage = loader.getInstance(uriMapping.mapping);

                if (targetPage == null) {
                    throw new Error("Unable to navigate to page '{0}'".format(uriMapping.mapping));
                }

                var navContext = new controls.NavigationContext(
                    previousPage,
                    previousUri,
                    targetPage,
                    uri,
                    queryString
                    );
                navContext.returnUri = this._returnUri;

                if (this.onBeforeNavigate != null) {
                    var nextUri = navContext.nextUri;
                    this.onBeforeNavigate(navContext);
                    if (navContext.cancel) {
                        if (previousUri != null &&
                            window.location.hash != "#" + previousUri)
                            window.location.hash = "#" + previousUri;
                        this._returnUri = navContext.returnUri;
                        if (nextUri != navContext.nextUri)
                            this.navigate(navContext.nextUri);
                        return false;
                    }
                }

                this._currentNavigationitem = new NavigationItem(uri);
                this._navigationStack.push(this._currentNavigationitem);

                this.page = targetPage;
                this.page.onNavigate(navContext);

                if (window.location.hash != "#" + uri)
                    window.location.hash = "#" + uri;

                if (this.onAfterNavigate != null) {
                    this.onAfterNavigate(navContext);
                }

            }

            return (uriMapping != null);
        }

        private hashChanged(hash: string) {
            this.navigate(hash.slice(1));
        }
    }
} 