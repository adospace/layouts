var layouts;
(function (layouts) {
    var UriMapping = (function () {
        function UriMapping(uri, mapping) {
            this.uri = uri;
            this._compiled = false;
            this._queryStringTokens = new Array();
            this.mapping = mapping;
        }
        Object.defineProperty(UriMapping.prototype, "mapping", {
            get: function () {
                return this._mapping;
            },
            set: function (value) {
                var re = /(\/|\\)/gi;
                this._mapping = value.replace(re, '.');
            },
            enumerable: true,
            configurable: true
        });
        UriMapping.prototype.compile = function () {
            if (!this._compiled) {
                var re = new RegExp("\\{([\\w\\d_&$-]+)\\}", "gi");
                var s = this.uri;
                var m;
                var rx = this.uri.split("/").join("\\/");
                do {
                    m = re.exec(s);
                    if (m) {
                        rx = rx.replace(m[0], "([\\w\\d_&$-]+)");
                        this._queryStringTokens.push(m[1]);
                    }
                } while (m);
                this._compiledUri = new RegExp(rx, "gi");
                this._compiled = true;
            }
        };
        UriMapping.prototype.test = function (uri) {
            this.compile();
            this._compiledUri.lastIndex = 0;
            return this._compiledUri.test(uri);
        };
        UriMapping.prototype.resolve = function (uriToResolve) {
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
        };
        return UriMapping;
    }());
    UriMapping._rxMapping = new RegExp("\{([\w\d_&$]+)\}", "gi");
    layouts.UriMapping = UriMapping;
    var NavigationItem = (function () {
        function NavigationItem(uri) {
            this.uri = uri;
        }
        return NavigationItem;
    }());
    var Application = (function () {
        function Application() {
            var _this = this;
            this._mappings = [];
            this._cachedPages = {};
            if (Application._current != null)
                throw new Error("Application already initialized");
            Application._current = this;
            if ("onhashchange" in window) {
                window.onhashchange = function (ev) {
                    return _this.hashChanged(window.location.hash);
                };
            }
            else {
                var storedHash = window.location.hash;
                window.setInterval(function () {
                    if (window.location.hash != storedHash) {
                        storedHash = window.location.hash;
                        _this.hashChanged(storedHash);
                    }
                }, 100);
            }
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
                    if (this._page != null)
                        this._page.attachVisual(null);
                    this._page = page;
                    if (this._page != null)
                        this._page.attachVisual(document.body);
                    Application.requestAnimationFrame();
                }
            },
            enumerable: true,
            configurable: true
        });
        Application.requestAnimationFrame = function () {
            requestAnimationFrame(Application.onAnimationFrame);
        };
        Application.onAnimationFrame = function () {
            layouts.LayoutManager.updateLayout();
            Application._beginInvokeActions.forEach(function (action) { action(); });
            Application._beginInvokeActions = [];
            requestAnimationFrame(Application.onAnimationFrame);
        };
        Application.beginInvoke = function (action) {
            Application._beginInvokeActions.push(action);
        };
        Object.defineProperty(Application.prototype, "mappings", {
            get: function () {
                return this._mappings;
            },
            enumerable: true,
            configurable: true
        });
        Application.prototype.map = function (uri, mappedUri) {
            var uriMapping = this._mappings.firstOrDefault(function (m) { return m.uri == uri; }, null);
            if (uriMapping == null) {
                uriMapping = new UriMapping(uri, mappedUri);
                this._mappings.push(uriMapping);
            }
            uriMapping.mapping = mappedUri;
            return uriMapping;
        };
        Application.prototype.navigate = function (uri, loader) {
            if (uri == null) {
                uri = window.location.hash.length > 0 ?
                    window.location.hash.slice(1) : layouts.Consts.stringEmpty;
            }
            if (this._currentUri == uri)
                return true;
            var uriMapping = this._mappings.firstOrDefault(function (m) { return m.test(uri); }, null);
            if (uriMapping != null) {
                var queryString = uriMapping.resolve(uri);
                var previousPage = this.page;
                var previousUri = this._currentUri;
                var targetPage = null;
                if (uriMapping.mapping in this._cachedPages)
                    targetPage = this._cachedPages[uriMapping.mapping];
                else {
                    if (loader == null)
                        loader = new InstanceLoader(window);
                    targetPage = loader.getInstance(uriMapping.mapping);
                    if (targetPage == null) {
                        throw new Error("Unable to navigate to page '{0}'".format(uriMapping.mapping));
                    }
                }
                if (targetPage.cachePage) {
                    if (!(targetPage.typeName in this._cachedPages))
                        this._cachedPages[uriMapping.mapping] = targetPage;
                }
                var navContext = new layouts.controls.NavigationContext(previousPage, previousUri, targetPage, uri, queryString);
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
                this._currentUri = uri;
                this.page = targetPage;
                this.page.onNavigate(navContext);
                if (window.location.hash != "#" + uri)
                    window.location.hash = "#" + uri;
                if (this.onAfterNavigate != null) {
                    this.onAfterNavigate(navContext);
                }
            }
            return (uriMapping != null);
        };
        Application.prototype.hashChanged = function (hash) {
            this.navigate(hash.slice(1));
        };
        return Application;
    }());
    Application._beginInvokeActions = [];
    layouts.Application = Application;
})(layouts || (layouts = {}));
