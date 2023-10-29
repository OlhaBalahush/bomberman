// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles

(function (modules, entry, mainEntry, parcelRequireName, globalName) {
  /* eslint-disable no-undef */
  var globalObject =
    typeof globalThis !== 'undefined'
      ? globalThis
      : typeof self !== 'undefined'
      ? self
      : typeof window !== 'undefined'
      ? window
      : typeof global !== 'undefined'
      ? global
      : {};
  /* eslint-enable no-undef */

  // Save the require from previous bundle to this closure if any
  var previousRequire =
    typeof globalObject[parcelRequireName] === 'function' &&
    globalObject[parcelRequireName];

  var cache = previousRequire.cache || {};
  // Do not use `require` to prevent Webpack from trying to bundle this call
  var nodeRequire =
    typeof module !== 'undefined' &&
    typeof module.require === 'function' &&
    module.require.bind(module);

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire =
          typeof globalObject[parcelRequireName] === 'function' &&
          globalObject[parcelRequireName];
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error("Cannot find module '" + name + "'");
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = (cache[name] = new newRequire.Module(name));

      modules[name][0].call(
        module.exports,
        localRequire,
        module,
        module.exports,
        this
      );
    }

    return cache[name].exports;

    function localRequire(x) {
      var res = localRequire.resolve(x);
      return res === false ? {} : newRequire(res);
    }

    function resolve(x) {
      var id = modules[name][1][x];
      return id != null ? id : x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [
      function (require, module) {
        module.exports = exports;
      },
      {},
    ];
  };

  Object.defineProperty(newRequire, 'root', {
    get: function () {
      return globalObject[parcelRequireName];
    },
  });

  globalObject[parcelRequireName] = newRequire;

  for (var i = 0; i < entry.length; i++) {
    newRequire(entry[i]);
  }

  if (mainEntry) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(mainEntry);

    // CommonJS
    if (typeof exports === 'object' && typeof module !== 'undefined') {
      module.exports = mainExports;

      // RequireJS
    } else if (typeof define === 'function' && define.amd) {
      define(function () {
        return mainExports;
      });

      // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }
})({"d8lhj":[function(require,module,exports) {
var global = arguments[3];
var HMR_HOST = null;
var HMR_PORT = null;
var HMR_SECURE = false;
var HMR_ENV_HASH = "d6ea1d42532a7575";
module.bundle.HMR_BUNDLE_ID = "7dd44675b7a05eb9";
"use strict";
/* global HMR_HOST, HMR_PORT, HMR_ENV_HASH, HMR_SECURE, chrome, browser, __parcel__import__, __parcel__importScripts__, ServiceWorkerGlobalScope */ /*::
import type {
  HMRAsset,
  HMRMessage,
} from '@parcel/reporter-dev-server/src/HMRServer.js';
interface ParcelRequire {
  (string): mixed;
  cache: {|[string]: ParcelModule|};
  hotData: {|[string]: mixed|};
  Module: any;
  parent: ?ParcelRequire;
  isParcelRequire: true;
  modules: {|[string]: [Function, {|[string]: string|}]|};
  HMR_BUNDLE_ID: string;
  root: ParcelRequire;
}
interface ParcelModule {
  hot: {|
    data: mixed,
    accept(cb: (Function) => void): void,
    dispose(cb: (mixed) => void): void,
    // accept(deps: Array<string> | string, cb: (Function) => void): void,
    // decline(): void,
    _acceptCallbacks: Array<(Function) => void>,
    _disposeCallbacks: Array<(mixed) => void>,
  |};
}
interface ExtensionContext {
  runtime: {|
    reload(): void,
    getURL(url: string): string;
    getManifest(): {manifest_version: number, ...};
  |};
}
declare var module: {bundle: ParcelRequire, ...};
declare var HMR_HOST: string;
declare var HMR_PORT: string;
declare var HMR_ENV_HASH: string;
declare var HMR_SECURE: boolean;
declare var chrome: ExtensionContext;
declare var browser: ExtensionContext;
declare var __parcel__import__: (string) => Promise<void>;
declare var __parcel__importScripts__: (string) => Promise<void>;
declare var globalThis: typeof self;
declare var ServiceWorkerGlobalScope: Object;
*/ var OVERLAY_ID = "__parcel__error__overlay__";
var OldModule = module.bundle.Module;
function Module(moduleName) {
    OldModule.call(this, moduleName);
    this.hot = {
        data: module.bundle.hotData[moduleName],
        _acceptCallbacks: [],
        _disposeCallbacks: [],
        accept: function(fn) {
            this._acceptCallbacks.push(fn || function() {});
        },
        dispose: function(fn) {
            this._disposeCallbacks.push(fn);
        }
    };
    module.bundle.hotData[moduleName] = undefined;
}
module.bundle.Module = Module;
module.bundle.hotData = {};
var checkedAssets /*: {|[string]: boolean|} */ , assetsToDispose /*: Array<[ParcelRequire, string]> */ , assetsToAccept /*: Array<[ParcelRequire, string]> */ ;
function getHostname() {
    return HMR_HOST || (location.protocol.indexOf("http") === 0 ? location.hostname : "localhost");
}
function getPort() {
    return HMR_PORT || location.port;
}
// eslint-disable-next-line no-redeclare
var parent = module.bundle.parent;
if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== "undefined") {
    var hostname = getHostname();
    var port = getPort();
    var protocol = HMR_SECURE || location.protocol == "https:" && !/localhost|127.0.0.1|0.0.0.0/.test(hostname) ? "wss" : "ws";
    var ws;
    try {
        ws = new WebSocket(protocol + "://" + hostname + (port ? ":" + port : "") + "/");
    } catch (err) {
        if (err.message) console.error(err.message);
        ws = {};
    }
    // Web extension context
    var extCtx = typeof browser === "undefined" ? typeof chrome === "undefined" ? null : chrome : browser;
    // Safari doesn't support sourceURL in error stacks.
    // eval may also be disabled via CSP, so do a quick check.
    var supportsSourceURL = false;
    try {
        (0, eval)('throw new Error("test"); //# sourceURL=test.js');
    } catch (err) {
        supportsSourceURL = err.stack.includes("test.js");
    }
    // $FlowFixMe
    ws.onmessage = async function(event /*: {data: string, ...} */ ) {
        checkedAssets = {} /*: {|[string]: boolean|} */ ;
        assetsToAccept = [];
        assetsToDispose = [];
        var data /*: HMRMessage */  = JSON.parse(event.data);
        if (data.type === "update") {
            // Remove error overlay if there is one
            if (typeof document !== "undefined") removeErrorOverlay();
            let assets = data.assets.filter((asset)=>asset.envHash === HMR_ENV_HASH);
            // Handle HMR Update
            let handled = assets.every((asset)=>{
                return asset.type === "css" || asset.type === "js" && hmrAcceptCheck(module.bundle.root, asset.id, asset.depsByBundle);
            });
            if (handled) {
                console.clear();
                // Dispatch custom event so other runtimes (e.g React Refresh) are aware.
                if (typeof window !== "undefined" && typeof CustomEvent !== "undefined") window.dispatchEvent(new CustomEvent("parcelhmraccept"));
                await hmrApplyUpdates(assets);
                // Dispose all old assets.
                let processedAssets = {} /*: {|[string]: boolean|} */ ;
                for(let i = 0; i < assetsToDispose.length; i++){
                    let id = assetsToDispose[i][1];
                    if (!processedAssets[id]) {
                        hmrDispose(assetsToDispose[i][0], id);
                        processedAssets[id] = true;
                    }
                }
                // Run accept callbacks. This will also re-execute other disposed assets in topological order.
                processedAssets = {};
                for(let i = 0; i < assetsToAccept.length; i++){
                    let id = assetsToAccept[i][1];
                    if (!processedAssets[id]) {
                        hmrAccept(assetsToAccept[i][0], id);
                        processedAssets[id] = true;
                    }
                }
            } else fullReload();
        }
        if (data.type === "error") {
            // Log parcel errors to console
            for (let ansiDiagnostic of data.diagnostics.ansi){
                let stack = ansiDiagnostic.codeframe ? ansiDiagnostic.codeframe : ansiDiagnostic.stack;
                console.error("\uD83D\uDEA8 [parcel]: " + ansiDiagnostic.message + "\n" + stack + "\n\n" + ansiDiagnostic.hints.join("\n"));
            }
            if (typeof document !== "undefined") {
                // Render the fancy html overlay
                removeErrorOverlay();
                var overlay = createErrorOverlay(data.diagnostics.html);
                // $FlowFixMe
                document.body.appendChild(overlay);
            }
        }
    };
    ws.onerror = function(e) {
        if (e.message) console.error(e.message);
    };
    ws.onclose = function() {
        console.warn("[parcel] \uD83D\uDEA8 Connection to the HMR server was lost");
    };
}
function removeErrorOverlay() {
    var overlay = document.getElementById(OVERLAY_ID);
    if (overlay) {
        overlay.remove();
        console.log("[parcel] \u2728 Error resolved");
    }
}
function createErrorOverlay(diagnostics) {
    var overlay = document.createElement("div");
    overlay.id = OVERLAY_ID;
    let errorHTML = '<div style="background: black; opacity: 0.85; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; font-family: Menlo, Consolas, monospace; z-index: 9999;">';
    for (let diagnostic of diagnostics){
        let stack = diagnostic.frames.length ? diagnostic.frames.reduce((p, frame)=>{
            return `${p}
<a href="/__parcel_launch_editor?file=${encodeURIComponent(frame.location)}" style="text-decoration: underline; color: #888" onclick="fetch(this.href); return false">${frame.location}</a>
${frame.code}`;
        }, "") : diagnostic.stack;
        errorHTML += `
      <div>
        <div style="font-size: 18px; font-weight: bold; margin-top: 20px;">
          \u{1F6A8} ${diagnostic.message}
        </div>
        <pre>${stack}</pre>
        <div>
          ${diagnostic.hints.map((hint)=>"<div>\uD83D\uDCA1 " + hint + "</div>").join("")}
        </div>
        ${diagnostic.documentation ? `<div>\u{1F4DD} <a style="color: violet" href="${diagnostic.documentation}" target="_blank">Learn more</a></div>` : ""}
      </div>
    `;
    }
    errorHTML += "</div>";
    overlay.innerHTML = errorHTML;
    return overlay;
}
function fullReload() {
    if ("reload" in location) location.reload();
    else if (extCtx && extCtx.runtime && extCtx.runtime.reload) extCtx.runtime.reload();
}
function getParents(bundle, id) /*: Array<[ParcelRequire, string]> */ {
    var modules = bundle.modules;
    if (!modules) return [];
    var parents = [];
    var k, d, dep;
    for(k in modules)for(d in modules[k][1]){
        dep = modules[k][1][d];
        if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) parents.push([
            bundle,
            k
        ]);
    }
    if (bundle.parent) parents = parents.concat(getParents(bundle.parent, id));
    return parents;
}
function updateLink(link) {
    var href = link.getAttribute("href");
    if (!href) return;
    var newLink = link.cloneNode();
    newLink.onload = function() {
        if (link.parentNode !== null) // $FlowFixMe
        link.parentNode.removeChild(link);
    };
    newLink.setAttribute("href", // $FlowFixMe
    href.split("?")[0] + "?" + Date.now());
    // $FlowFixMe
    link.parentNode.insertBefore(newLink, link.nextSibling);
}
var cssTimeout = null;
function reloadCSS() {
    if (cssTimeout) return;
    cssTimeout = setTimeout(function() {
        var links = document.querySelectorAll('link[rel="stylesheet"]');
        for(var i = 0; i < links.length; i++){
            // $FlowFixMe[incompatible-type]
            var href /*: string */  = links[i].getAttribute("href");
            var hostname = getHostname();
            var servedFromHMRServer = hostname === "localhost" ? new RegExp("^(https?:\\/\\/(0.0.0.0|127.0.0.1)|localhost):" + getPort()).test(href) : href.indexOf(hostname + ":" + getPort());
            var absolute = /^https?:\/\//i.test(href) && href.indexOf(location.origin) !== 0 && !servedFromHMRServer;
            if (!absolute) updateLink(links[i]);
        }
        cssTimeout = null;
    }, 50);
}
function hmrDownload(asset) {
    if (asset.type === "js") {
        if (typeof document !== "undefined") {
            let script = document.createElement("script");
            script.src = asset.url + "?t=" + Date.now();
            if (asset.outputFormat === "esmodule") script.type = "module";
            return new Promise((resolve, reject)=>{
                var _document$head;
                script.onload = ()=>resolve(script);
                script.onerror = reject;
                (_document$head = document.head) === null || _document$head === void 0 || _document$head.appendChild(script);
            });
        } else if (typeof importScripts === "function") {
            // Worker scripts
            if (asset.outputFormat === "esmodule") return import(asset.url + "?t=" + Date.now());
            else return new Promise((resolve, reject)=>{
                try {
                    importScripts(asset.url + "?t=" + Date.now());
                    resolve();
                } catch (err) {
                    reject(err);
                }
            });
        }
    }
}
async function hmrApplyUpdates(assets) {
    global.parcelHotUpdate = Object.create(null);
    let scriptsToRemove;
    try {
        // If sourceURL comments aren't supported in eval, we need to load
        // the update from the dev server over HTTP so that stack traces
        // are correct in errors/logs. This is much slower than eval, so
        // we only do it if needed (currently just Safari).
        // https://bugs.webkit.org/show_bug.cgi?id=137297
        // This path is also taken if a CSP disallows eval.
        if (!supportsSourceURL) {
            let promises = assets.map((asset)=>{
                var _hmrDownload;
                return (_hmrDownload = hmrDownload(asset)) === null || _hmrDownload === void 0 ? void 0 : _hmrDownload.catch((err)=>{
                    // Web extension fix
                    if (extCtx && extCtx.runtime && extCtx.runtime.getManifest().manifest_version == 3 && typeof ServiceWorkerGlobalScope != "undefined" && global instanceof ServiceWorkerGlobalScope) {
                        extCtx.runtime.reload();
                        return;
                    }
                    throw err;
                });
            });
            scriptsToRemove = await Promise.all(promises);
        }
        assets.forEach(function(asset) {
            hmrApply(module.bundle.root, asset);
        });
    } finally{
        delete global.parcelHotUpdate;
        if (scriptsToRemove) scriptsToRemove.forEach((script)=>{
            if (script) {
                var _document$head2;
                (_document$head2 = document.head) === null || _document$head2 === void 0 || _document$head2.removeChild(script);
            }
        });
    }
}
function hmrApply(bundle /*: ParcelRequire */ , asset /*:  HMRAsset */ ) {
    var modules = bundle.modules;
    if (!modules) return;
    if (asset.type === "css") reloadCSS();
    else if (asset.type === "js") {
        let deps = asset.depsByBundle[bundle.HMR_BUNDLE_ID];
        if (deps) {
            if (modules[asset.id]) {
                // Remove dependencies that are removed and will become orphaned.
                // This is necessary so that if the asset is added back again, the cache is gone, and we prevent a full page reload.
                let oldDeps = modules[asset.id][1];
                for(let dep in oldDeps)if (!deps[dep] || deps[dep] !== oldDeps[dep]) {
                    let id = oldDeps[dep];
                    let parents = getParents(module.bundle.root, id);
                    if (parents.length === 1) hmrDelete(module.bundle.root, id);
                }
            }
            if (supportsSourceURL) // Global eval. We would use `new Function` here but browser
            // support for source maps is better with eval.
            (0, eval)(asset.output);
            // $FlowFixMe
            let fn = global.parcelHotUpdate[asset.id];
            modules[asset.id] = [
                fn,
                deps
            ];
        } else if (bundle.parent) hmrApply(bundle.parent, asset);
    }
}
function hmrDelete(bundle, id) {
    let modules = bundle.modules;
    if (!modules) return;
    if (modules[id]) {
        // Collect dependencies that will become orphaned when this module is deleted.
        let deps = modules[id][1];
        let orphans = [];
        for(let dep in deps){
            let parents = getParents(module.bundle.root, deps[dep]);
            if (parents.length === 1) orphans.push(deps[dep]);
        }
        // Delete the module. This must be done before deleting dependencies in case of circular dependencies.
        delete modules[id];
        delete bundle.cache[id];
        // Now delete the orphans.
        orphans.forEach((id)=>{
            hmrDelete(module.bundle.root, id);
        });
    } else if (bundle.parent) hmrDelete(bundle.parent, id);
}
function hmrAcceptCheck(bundle /*: ParcelRequire */ , id /*: string */ , depsByBundle /*: ?{ [string]: { [string]: string } }*/ ) {
    if (hmrAcceptCheckOne(bundle, id, depsByBundle)) return true;
    // Traverse parents breadth first. All possible ancestries must accept the HMR update, or we'll reload.
    let parents = getParents(module.bundle.root, id);
    let accepted = false;
    while(parents.length > 0){
        let v = parents.shift();
        let a = hmrAcceptCheckOne(v[0], v[1], null);
        if (a) // If this parent accepts, stop traversing upward, but still consider siblings.
        accepted = true;
        else {
            // Otherwise, queue the parents in the next level upward.
            let p = getParents(module.bundle.root, v[1]);
            if (p.length === 0) {
                // If there are no parents, then we've reached an entry without accepting. Reload.
                accepted = false;
                break;
            }
            parents.push(...p);
        }
    }
    return accepted;
}
function hmrAcceptCheckOne(bundle /*: ParcelRequire */ , id /*: string */ , depsByBundle /*: ?{ [string]: { [string]: string } }*/ ) {
    var modules = bundle.modules;
    if (!modules) return;
    if (depsByBundle && !depsByBundle[bundle.HMR_BUNDLE_ID]) {
        // If we reached the root bundle without finding where the asset should go,
        // there's nothing to do. Mark as "accepted" so we don't reload the page.
        if (!bundle.parent) return true;
        return hmrAcceptCheck(bundle.parent, id, depsByBundle);
    }
    if (checkedAssets[id]) return true;
    checkedAssets[id] = true;
    var cached = bundle.cache[id];
    assetsToDispose.push([
        bundle,
        id
    ]);
    if (!cached || cached.hot && cached.hot._acceptCallbacks.length) {
        assetsToAccept.push([
            bundle,
            id
        ]);
        return true;
    }
}
function hmrDispose(bundle /*: ParcelRequire */ , id /*: string */ ) {
    var cached = bundle.cache[id];
    bundle.hotData[id] = {};
    if (cached && cached.hot) cached.hot.data = bundle.hotData[id];
    if (cached && cached.hot && cached.hot._disposeCallbacks.length) cached.hot._disposeCallbacks.forEach(function(cb) {
        cb(bundle.hotData[id]);
    });
    delete bundle.cache[id];
}
function hmrAccept(bundle /*: ParcelRequire */ , id /*: string */ ) {
    // Execute the module.
    bundle(id);
    // Run the accept callbacks in the new version of the module.
    var cached = bundle.cache[id];
    if (cached && cached.hot && cached.hot._acceptCallbacks.length) cached.hot._acceptCallbacks.forEach(function(cb) {
        var assetsToAlsoAccept = cb(function() {
            return getParents(module.bundle.root, id);
        });
        if (assetsToAlsoAccept && assetsToAccept.length) {
            assetsToAlsoAccept.forEach(function(a) {
                hmrDispose(a[0], a[1]);
            });
            // $FlowFixMe[method-unbinding]
            assetsToAccept.push.apply(assetsToAccept, assetsToAlsoAccept);
        }
    });
}

},{}],"jeorp":[function(require,module,exports) {
var _usernameView = require("./views/usernameView");
var _lobbyView = require("./views/lobbyView");
var _gameView = require("./views/gameView");
//add your route here
const Routes = {
    "/": (0, _usernameView.usernameView)(),
    "/waiting-room": (0, _lobbyView.lobbyView)(),
    "/game": (0, _gameView.gameView)()
};
const currentURL = document.location.pathname;
if (Routes[currentURL]) document.body.appendChild(Routes[currentURL].element);
else console.log("poor path");

},{"./views/usernameView":"8sy6C","./views/lobbyView":"4I0Vt","./views/gameView":"hwEbf"}],"8sy6C":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "usernameView", ()=>usernameView);
var _miniFramework = require("mini-framework");
const usernameView = ()=>{
    const username = (0, _miniFramework.useStateManager)("");
    const handleChange = (e)=>{
        e.preventDefault();
        username.setState(e.target.value);
    };
    const handleSubmit = async (e)=>{
        e.preventDefault();
        window.location.href = "/waiting-room";
    };
    const startPage = (0, _miniFramework.createDOMElement)("div", {
        class: "w-screen h-screen bg-neutral-600"
    }, [
        (0, _miniFramework.createDOMElement)("div", {
            class: "w-[600px] h-[300px] bg-neutral-200 absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] border-2 border-solid border-black flex flex-col gap-5 items-center justify-center"
        }, [
            (0, _miniFramework.createDOMElement)("h1", {
                class: "font-mono text-6xl font-normal text-black uppercase text-center"
            }, [
                "bomberman"
            ]),
            (0, _miniFramework.createDOMElement)("form", {
                class: "flex flex-col gap-5 items-center justify-center"
            }, [
                (0, _miniFramework.createDOMElement)("input", {
                    class: "px-4 w-[260px] h-[40px] bg-neutral-200 border-2 border-solid border-black",
                    placeholder: "Enter your username",
                    maxLength: 20,
                    required: true,
                    value: username.getState()
                }, []).onChange$(handleChange),
                (0, _miniFramework.createDOMElement)("button", {
                    class: "w-[260px] h-[40px] bg-neutral-200 font-mono text-xl font-normal text-black uppercase border-2 border-solid border-black",
                    type: "submit"
                }, [
                    "start"
                ]).onClick$(handleSubmit)
            ])
        ])
    ]);
    return startPage;
};

},{"mini-framework":"9Vprj","@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"9Vprj":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "createDOMElement", ()=>(0, _domAbstractionJs.createDOMElement));
parcelHelpers.export(exports, "Router", ()=>(0, _routingManagerJs.Router));
parcelHelpers.export(exports, "useStateManager", ()=>(0, _stateManagerJs.useStateManager));
parcelHelpers.export(exports, "onEvent", ()=>(0, _eventManagerJs.onEvent));
parcelHelpers.export(exports, "triggerCustomEvent", ()=>(0, _eventManagerJs.triggerCustomEvent));
parcelHelpers.export(exports, "events", ()=>(0, _eventManagerJs.events));
var _domAbstractionJs = require("./DomAbstraction.js");
var _routingManagerJs = require("./RoutingManager.js");
var _stateManagerJs = require("./StateManager.js");
var _eventManagerJs = require("./EventManager.js");

},{"./DomAbstraction.js":"4SQjh","./RoutingManager.js":"8vPYL","./StateManager.js":"gDCHW","./EventManager.js":"6oOXY","@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"4SQjh":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
/**
 * Create a DOM element with optional attributes and children.
 *
 * @param {string} elementType - The type of DOM element to create (e.g., 'div', 'a', 'p').
 * @param {object} attributes - An object containing element attributes as key-value pairs.
 * @param {Array} children - An array of child elements or text to be appended to the created element.
 * @returns {ElementObject} - An object representing a DOM element with various event handling functions
 */ parcelHelpers.export(exports, "createDOMElement", ()=>createDOMElement);
var _eventManagerJs = require("./EventManager.js");
function createDOMElement(elementType, attributes, children) {
    const element = document.createElement(elementType);
    if (attributes && typeof attributes === "object") for(const key in attributes)element.setAttribute(key, attributes[key]);
    if (children && Array.isArray(children)) children.forEach((child)=>{
        if (typeof child === "object" && "element" in child) child = child.element;
        if (child instanceof HTMLElement) element.appendChild(child);
        else element.appendChild(document.createTextNode(child));
    });
    /**
   * An object representing a DOM element with various event handling functions.
   * @typedef {Object} ElementObject
   * @property {HTMLElement} element - The HTML element associated with the object.
   * @property {(callback: Function) => ElementObject} onClick$ - Adds a click event listener to the associated HTML element.
   * @property {(callback: Function) => ElementObject} onKeyDown$ - Adds a keydown event listener to the associated HTML element.
   * @property {(callback: Function) => ElementObject} onKeyUp$ - Adds a keyup event listener to the associated HTML element.
   * @property {(callback: Function) => ElementObject} onMouseEnter$ - Adds a mouseenter event listener to the associated HTML element.
   * @property {(callback: Function) => ElementObject} onScroll$ - Adds a scroll event listener to the associated HTML element.
   * @property {(callback: Function) => ElementObject} onChange$ - Adds a change event listener to the associated HTML element.
   * @property {(eventName: string, callback: Function) => ElementObject} onCustomEvent$ - Adds a custom event listener to the associated HTML element.
   * @property {(eventName: string, eventDetail?: Object) => ElementObject} triggerCustomEvent$ - Triggers a custom event on the associated HTML element.
   */ const elementObject = {
        element: element,
        onClick$ (callback) {
            (0, _eventManagerJs.onEvent)((0, _eventManagerJs.events).CLICK, this.element, callback);
            return this;
        },
        onKeyDown$ (callback) {
            (0, _eventManagerJs.onEvent)((0, _eventManagerJs.events).KEYDOWN, this.element, callback);
            return this;
        },
        onKeyUp$ (callback) {
            (0, _eventManagerJs.onEvent)((0, _eventManagerJs.events).KEYUP, this.element, callback);
            return this;
        },
        onMouseEnter$ (callback) {
            (0, _eventManagerJs.onEvent)((0, _eventManagerJs.events).MOUSEENTER, this.element, callback);
            return this;
        },
        onScroll$ (callback) {
            (0, _eventManagerJs.onEvent)((0, _eventManagerJs.events).SCROLL, this.element, callback);
            return this;
        },
        onChange$ (callback) {
            (0, _eventManagerJs.onEvent)((0, _eventManagerJs.events).CHANGE, this.element, callback);
            return this;
        },
        onCustomEvent$ (eventName, callback) {
            (0, _eventManagerJs.onEvent)(eventName, this.element, callback);
            return this;
        },
        triggerCustomEvent$ (eventName, eventDetail) {
            (0, _eventManagerJs.triggerCustomEvent)(eventName, this.element, eventDetail);
            return this;
        }
    };
    return elementObject;
}

},{"./EventManager.js":"6oOXY","@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"6oOXY":[function(require,module,exports) {
//more can be added here easily, but need to update DomAbstraction.js as well
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "events", ()=>events);
/**
 * Generic function to add event listener to an HTML node element
 * @param {string} eventType - The type of event to handle (e.g., 'click' or 'change').
 * @param {HTMLElement} element - The HTML element to attach the event to
 * @param {function} callback - The event handler function to execute when the event occurs.
 */ parcelHelpers.export(exports, "onEvent", ()=>onEvent);
/**
 * Triggers a custom event on the specified element
 *
 * @param {string} eventType - The type of custom event to trigger
 * @param {HTMLElement} element - The HTML element on which the custom event is triggered
 * @param {Object} eventDetail - Optional detail to pass with the custom event
 */ parcelHelpers.export(exports, "triggerCustomEvent", ()=>triggerCustomEvent);
const events = {
    CLICK: "click",
    KEYDOWN: "keydown",
    KEYUP: "keyup",
    MOUSEENTER: "mouseenter",
    SCROLL: "scroll",
    CHANGE: "change"
};
function onEvent(eventType, element, callback) {
    if (callback instanceof Function) element.addEventListener(eventType, callback);
    else console.error(`Invalid callBack provided, ${callback} is not a function`);
}
function triggerCustomEvent(eventType, element, eventDetail = null) {
    const customEvent = new CustomEvent(eventType, {
        detail: eventDetail
    });
    element.dispatchEvent(customEvent);
}

},{"@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"gkKU3":[function(require,module,exports) {
exports.interopDefault = function(a) {
    return a && a.__esModule ? a : {
        default: a
    };
};
exports.defineInteropFlag = function(a) {
    Object.defineProperty(a, "__esModule", {
        value: true
    });
};
exports.exportAll = function(source, dest) {
    Object.keys(source).forEach(function(key) {
        if (key === "default" || key === "__esModule" || dest.hasOwnProperty(key)) return;
        Object.defineProperty(dest, key, {
            enumerable: true,
            get: function() {
                return source[key];
            }
        });
    });
    return dest;
};
exports.export = function(dest, destName, get) {
    Object.defineProperty(dest, destName, {
        enumerable: true,
        get: get
    });
};

},{}],"8vPYL":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "Router", ()=>Router);
function Router() {
    this.routes = {};
    this.currentRoute = null;
}
/**
 * Add a route to the router.
 *
 * @param {string} path - The URL path for the route.
 * @param {function} callback - The callback function to execute when the route is navigated to.
 */ Router.prototype.addRoute = function(path, callback) {
    this.routes[path] = callback;
};
/**
 * Navigate to the router
 * 
 * @param {string} path - the URL path of the route.
 */ Router.prototype.navigateTo = function(path) {
    if (this.routes[path]) {
        this.routes[path]();
        this.currentRoute = path;
    } else throw new Error("Route not found");
};
/**
 * Get the current URL path
 * 
 * @returns {string} - The current route URL path.
 */ Router.prototype.getCurrentRoute = function() {
    return this.currentRoute;
};

},{"@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"gDCHW":[function(require,module,exports) {
/**
 * Create a custom state manager for managing application state.
 *
 * @param {any} initialState - The initial state value for the state manager.
 * @returns {object} An object with methods for managing state.
 */ var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "useStateManager", ()=>useStateManager);
function useStateManager(initialState) {
    // Initialize the state and listeners.
    let state = initialState;
    const listeners = [];
    /**
     * Get the current state.
     * @returns {any} The current state.
     */ function getState() {
        return state;
    }
    /**
     * Set the state to a new value and notify subscribers.
     * @param {any} newState - The new state value.
     */ function setState(newState) {
        state = newState;
        listeners.forEach((listener)=>listener(state));
    }
    /**
     * Subscribe to state changes.
     * @param {function} listener - A callback function to be called when the state changes.
     * @returns {function} An unsubscribe function to stop listening to state changes.
     */ function subscribe(listener) {
        listeners.push(listener);
        return ()=>{
            listeners = listeners.filter((l)=>l !== listener);
        };
    }
    return {
        getState,
        setState,
        subscribe
    };
}

},{"@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"4I0Vt":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "lobbyView", ()=>lobbyView);
var _miniFramework = require("mini-framework");
const lobbyView = ()=>{
    let playerCountInLobby = (0, _miniFramework.useStateManager)("1");
    let TimerCountDown = (0, _miniFramework.useStateManager)("0");
    //TODO: change this to the correct port and and endpoint
    fetch("https://localhost:8080/GetLobbyCount").then((response)=>response.json).then((data)=>{
        console.log(data);
    //TODO save the gotten number to the playercountInLobby variable
    });
    const socket = new WebSocket("ws://localhost:8080/ws");
    socket.addEventListener("open", (event)=>{
        console.log("WebSocket connection is open:", event);
        //TODO: send a message to backenc with the Players username
        const PlayersUsername = sessionStorage.getItem("username");
        if (PlayersUsername) socket.send(PlayersUsername);
        else socket.send("Error getting Players username");
    });
    //TODO make sure that everything here works properly because currently it is full of placeholders
    socket.addEventListener("message", (event)=>{
        console.log("WebSocket message received:", event);
        switch(event.type){
            case "startTwentySecondTimer":
                TimerCountDown.setState(event.data);
                const fristTimerText = document.getElementById("firstTimer");
                let isHidden = true;
                if (fristTimerText) isHidden = fristTimerText.classList.contains("hidden");
                if (isHidden && fristTimerText) fristTimerText.classList.toggle("hidden");
                if (!isHidden && event.data === "0" && fristTimerText) fristTimerText.classList.toggle("hidden");
                break;
            case "startTenSecondTimer":
                TimerCountDown.setState(event.data);
                const secondTimer = document.getElementById("secondTimer");
                let isSecondHidden = true;
                if (secondTimer) isSecondHidden = secondTimer.classList.contains("hidden");
                if (isSecondHidden && secondTimer) secondTimer.classList.toggle("hidden");
                break;
            default:
                console.log("error unknow ws connection message type: ", event.type);
        }
    });
    socket.addEventListener("close", (event)=>{
        if (event.wasClean) console.log("WebSocket connection closed cleanly, code:", event.code, "reason:", event.reason);
        else console.error("WebSocket connection abruptly closed");
    });
    socket.addEventListener("error", (event)=>{
        console.error("WebSocket error:", event);
    });
    const HTML = (0, _miniFramework.createDOMElement)("div", {
        class: "min-h-screen flex items-center justify-center bg-neutral-600"
    }, [
        (0, _miniFramework.createDOMElement)("div", {
            class: "flex-column  bg-neutral-200  p-12 w-[600px] h-[400px] shadow-md border-4 border-black text-center"
        }, [
            (0, _miniFramework.createDOMElement)("div", {
                class: "font-mono text-6xl font-normal text-black uppercase"
            }, [
                "Waiting Room"
            ]),
            (0, _miniFramework.createDOMElement)("div", {
                class: "pt-7 font-mono text-1xl font-normal text-black uppercase"
            }, [
                playerCountInLobby.getState() + " user(s) in the lobby right now"
            ]),
            (0, _miniFramework.createDOMElement)("div", {
                class: "py-3 font-mono text-1xl font-normal text-black uppercase"
            }, [
                "the game will start when at least 2 players are in the lobby"
            ]),
            (0, _miniFramework.createDOMElement)("div", {
                class: "py-4 flex items-center justify-center"
            }, [
                (0, _miniFramework.createDOMElement)("img", {
                    src: "https://i.gifer.com/ZKZg.gif",
                    class: "self-center w-[100px] h-[100px]"
                }, [])
            ]),
            (0, _miniFramework.createDOMElement)("div", {
                class: "hidden font-mono text-1xl font-normal text-black uppercase",
                id: "firstTimer"
            }, [
                "the game will start in " + TimerCountDown.getState() + " second"
            ]),
            (0, _miniFramework.createDOMElement)("div", {
                class: "hidden font-mono text-1xl font-normal text-black uppercase",
                id: "secondTimer"
            }, [
                "the countdown will begin in " + TimerCountDown.getState() + " seconds"
            ])
        ])
    ]);
    return HTML;
} // exmpl:  createDOMElement("div", {}, [])
;

},{"@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3","mini-framework":"9Vprj"}],"hwEbf":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "gameView", ()=>gameView);
var _miniFramework = require("mini-framework");
const gameView = ()=>{
    let gameTime = (0, _miniFramework.useStateManager)("240") //TODO connect with be
    ;
    let PlayerHealth = (0, _miniFramework.useStateManager)("3") //TODO connect with be
    ;
    return (0, _miniFramework.createDOMElement)("div", {
        class: "w-screen h-screen flex items-center justify-center bg-neutral-600"
    }, [
        (0, _miniFramework.createDOMElement)("div", {
            class: "p-0 w-[1400px] h-[800px]  border-1 border-black flex flex-col",
            id: "gameBox"
        }, [
            (0, _miniFramework.createDOMElement)("div", {
                class: "h-[55px] flex content-center bg-neutral-200 border-black border-2 p-2 center-text"
            }, [
                (0, _miniFramework.createDOMElement)("div", {
                    class: "pr-[550px] font-mono text-2xl font-normal text-black uppercase"
                }, [
                    "TIME: " + gameTime.getState()
                ]),
                (0, _miniFramework.createDOMElement)("div", {
                    class: "font-mono text-2xl font-normal text-black uppercase"
                }, [
                    "lives: " + PlayerHealth.getState()
                ])
            ]),
            (0, _miniFramework.createDOMElement)("div", {
                class: "flex h-[650px]"
            }, [
                (0, _miniFramework.createDOMElement)("div", {
                    class: "w-[300px] flex flex-col bg-neutral-200  border-black border-2",
                    id: "outter-chat-container"
                }, [
                    (0, _miniFramework.createDOMElement)("div", {
                        class: [
                            "h-[60px] border-b border-black flex items-center justify-center font-mono text-3xl font-normal text-black uppercase"
                        ]
                    }, [
                        "chat"
                    ]),
                    (0, _miniFramework.createDOMElement)("div", {
                        class: "p-4"
                    }, [
                        (0, _miniFramework.createDOMElement)("div", {
                            class: " h-[500px] bg-neutral-600 mb-12"
                        }, []),
                        (0, _miniFramework.createDOMElement)("input", {
                            class: "border-4 border-black"
                        }, []) // input box
                    ]) //inncer container
                ]),
                (0, _miniFramework.createDOMElement)("div", {
                    class: "w-[1100px] bg-neutral-200 border-black border-2 p-2 "
                }, [
                    "Game view"
                ])
            ])
        ])
    ]);
} // exmpl:  createDOMElement("div", {}, [])
;

},{"mini-framework":"9Vprj","@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}]},["d8lhj","jeorp"], "jeorp", "parcelRequiree395")

//# sourceMappingURL=index.b7a05eb9.js.map
