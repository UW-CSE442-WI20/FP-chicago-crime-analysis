// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
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

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
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
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"d3-tip.js":[function(require,module,exports) {
// d3.tip
// Copyright (c) 2013 Justin Palmer
// ES6 / D3 v4 Adaption Copyright (c) 2016 Constantin Gavrilete
// Removal of ES6 for D3 v4 Adaption Copyright (c) 2016 David Gotz
//
// Tooltips for d3.js SVG visualizations
d3.functor = function functor(v) {
  return typeof v === "function" ? v : function () {
    return v;
  };
};

d3.tip = function () {
  var direction = d3_tip_direction,
      offset = d3_tip_offset,
      html = d3_tip_html,
      node = initNode(),
      svg = null,
      point = null,
      target = null;

  function tip(vis) {
    svg = getSVGNode(vis);
    point = svg.createSVGPoint();
    document.body.appendChild(node);
  } // Public - show the tooltip on the screen
  //
  // Returns a tip


  tip.show = function () {
    var args = Array.prototype.slice.call(arguments);
    if (args[args.length - 1] instanceof SVGElement) target = args.pop();
    var content = html.apply(this, args),
        poffset = offset.apply(this, args),
        dir = direction.apply(this, args),
        nodel = getNodeEl(),
        i = directions.length,
        coords,
        scrollTop = document.documentElement.scrollTop || document.body.scrollTop,
        scrollLeft = document.documentElement.scrollLeft || document.body.scrollLeft;
    nodel.html(content).style('position', 'absolute').style('opacity', 1).style('pointer-events', 'all');

    while (i--) {
      nodel.classed(directions[i], false);
    }

    coords = direction_callbacks[dir].apply(this);
    nodel.classed(dir, true).style('top', coords.top + poffset[0] + scrollTop + 'px').style('left', coords.left + poffset[1] + scrollLeft + 'px');
    return tip;
  }; // Public - hide the tooltip
  //
  // Returns a tip


  tip.hide = function () {
    var nodel = getNodeEl();
    nodel.style('opacity', 0).style('pointer-events', 'none');
    return tip;
  }; // Public: Proxy attr calls to the d3 tip container.  Sets or gets attribute value.
  //
  // n - name of the attribute
  // v - value of the attribute
  //
  // Returns tip or attribute value


  tip.attr = function (n, v) {
    if (arguments.length < 2 && typeof n === 'string') {
      return getNodeEl().attr(n);
    } else {
      var args = Array.prototype.slice.call(arguments);
      d3.selection.prototype.attr.apply(getNodeEl(), args);
    }

    return tip;
  }; // Public: Proxy style calls to the d3 tip container.  Sets or gets a style value.
  //
  // n - name of the property
  // v - value of the property
  //
  // Returns tip or style property value


  tip.style = function (n, v) {
    // debugger;
    if (arguments.length < 2 && typeof n === 'string') {
      return getNodeEl().style(n);
    } else {
      var args = Array.prototype.slice.call(arguments);

      if (args.length === 1) {
        var styles = args[0];
        Object.keys(styles).forEach(function (key) {
          return d3.selection.prototype.style.apply(getNodeEl(), [key, styles[key]]);
        });
      }
    }

    return tip;
  }; // Public: Set or get the direction of the tooltip
  //
  // v - One of n(north), s(south), e(east), or w(west), nw(northwest),
  //     sw(southwest), ne(northeast) or se(southeast)
  //
  // Returns tip or direction


  tip.direction = function (v) {
    if (!arguments.length) return direction;
    direction = v == null ? v : d3.functor(v);
    return tip;
  }; // Public: Sets or gets the offset of the tip
  //
  // v - Array of [x, y] offset
  //
  // Returns offset or


  tip.offset = function (v) {
    if (!arguments.length) return offset;
    offset = v == null ? v : d3.functor(v);
    return tip;
  }; // Public: sets or gets the html value of the tooltip
  //
  // v - String value of the tip
  //
  // Returns html value or tip


  tip.html = function (v) {
    if (!arguments.length) return html;
    html = v == null ? v : d3.functor(v);
    return tip;
  }; // Public: destroys the tooltip and removes it from the DOM
  //
  // Returns a tip


  tip.destroy = function () {
    if (node) {
      getNodeEl().remove();
      node = null;
    }

    return tip;
  };

  function d3_tip_direction() {
    return 'n';
  }

  function d3_tip_offset() {
    return [0, 0];
  }

  function d3_tip_html() {
    return ' ';
  }

  var direction_callbacks = {
    n: direction_n,
    s: direction_s,
    e: direction_e,
    w: direction_w,
    nw: direction_nw,
    ne: direction_ne,
    sw: direction_sw,
    se: direction_se
  };
  var directions = Object.keys(direction_callbacks);

  function direction_n() {
    var bbox = getScreenBBox();
    return {
      top: bbox.n.y - node.offsetHeight,
      left: bbox.n.x - node.offsetWidth / 2
    };
  }

  function direction_s() {
    var bbox = getScreenBBox();
    return {
      top: bbox.s.y,
      left: bbox.s.x - node.offsetWidth / 2
    };
  }

  function direction_e() {
    var bbox = getScreenBBox();
    return {
      top: bbox.e.y - node.offsetHeight / 2,
      left: bbox.e.x
    };
  }

  function direction_w() {
    var bbox = getScreenBBox();
    return {
      top: bbox.w.y - node.offsetHeight / 2,
      left: bbox.w.x - node.offsetWidth
    };
  }

  function direction_nw() {
    var bbox = getScreenBBox();
    return {
      top: bbox.nw.y - node.offsetHeight,
      left: bbox.nw.x - node.offsetWidth
    };
  }

  function direction_ne() {
    var bbox = getScreenBBox();
    return {
      top: bbox.ne.y - node.offsetHeight,
      left: bbox.ne.x
    };
  }

  function direction_sw() {
    var bbox = getScreenBBox();
    return {
      top: bbox.sw.y,
      left: bbox.sw.x - node.offsetWidth
    };
  }

  function direction_se() {
    var bbox = getScreenBBox();
    return {
      top: bbox.se.y,
      left: bbox.e.x
    };
  }

  function initNode() {
    var node = d3.select(document.createElement('div'));
    node.style('position', 'absolute').style('top', '0').style('opacity', '0').style('pointer-events', 'none').style('box-sizing', 'border-box');
    return node.node();
  }

  function getSVGNode(el) {
    el = el.node();
    if (el.tagName.toLowerCase() === 'svg') return el;
    return el.ownerSVGElement;
  }

  function getNodeEl() {
    if (node === null) {
      node = initNode(); // re-add node to DOM

      document.body.appendChild(node);
    }

    ;
    return d3.select(node);
  } // Private - gets the screen coordinates of a shape
  //
  // Given a shape on the screen, will return an SVGPoint for the directions
  // n(north), s(south), e(east), w(west), ne(northeast), se(southeast), nw(northwest),
  // sw(southwest).
  //
  //    +-+-+
  //    |   |
  //    +   +
  //    |   |
  //    +-+-+
  //
  // Returns an Object {n, s, e, w, nw, sw, ne, se}


  function getScreenBBox() {
    var targetel = target || d3.event.target;

    while ('undefined' === typeof targetel.getScreenCTM && 'undefined' === targetel.parentNode) {
      targetel = targetel.parentNode;
    }

    var bbox = {},
        matrix = targetel.getScreenCTM(),
        tbbox = targetel.getBBox(),
        width = tbbox.width,
        height = tbbox.height,
        x = tbbox.x,
        y = tbbox.y;
    point.x = x;
    point.y = y;
    bbox.nw = point.matrixTransform(matrix);
    point.x += width;
    bbox.ne = point.matrixTransform(matrix);
    point.y += height;
    bbox.se = point.matrixTransform(matrix);
    point.x -= width;
    bbox.sw = point.matrixTransform(matrix);
    point.y -= height / 2;
    bbox.w = point.matrixTransform(matrix);
    point.x += width;
    bbox.e = point.matrixTransform(matrix);
    point.x -= width / 2;
    point.y -= height / 2;
    bbox.n = point.matrixTransform(matrix);
    point.y += height;
    bbox.s = point.matrixTransform(matrix);
    return bbox;
  }

  return tip;
};
},{}],"../node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "57175" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["../node_modules/parcel-bundler/src/builtins/hmr-runtime.js","d3-tip.js"], null)
//# sourceMappingURL=/d3-tip.65519a84.js.map