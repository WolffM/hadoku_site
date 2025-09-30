import * as R from "react";
import We, { useEffect as Ce, useRef as Xe, useState as Re, useCallback as io, useMemo as ci } from "react";
import { createRoot as oo } from "react-dom/client";
function ao(t, e) {
  for (var r = 0; r < e.length; r++) {
    const n = e[r];
    if (typeof n != "string" && !Array.isArray(n)) {
      for (const i in n)
        if (i !== "default" && !(i in t)) {
          const o = Object.getOwnPropertyDescriptor(n, i);
          o && Object.defineProperty(t, i, o.get ? o : {
            enumerable: !0,
            get: () => n[i]
          });
        }
    }
  }
  return Object.freeze(Object.defineProperty(t, Symbol.toStringTag, { value: "Module" }));
}
function ui(t) {
  return t && t.__esModule && Object.prototype.hasOwnProperty.call(t, "default") ? t.default : t;
}
var Mr = { exports: {} }, Rt = {};
/**
 * @license React
 * react-jsx-runtime.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var wn;
function so() {
  if (wn) return Rt;
  wn = 1;
  var t = Symbol.for("react.transitional.element"), e = Symbol.for("react.fragment");
  function r(n, i, o) {
    var a = null;
    if (o !== void 0 && (a = "" + o), i.key !== void 0 && (a = "" + i.key), "key" in i) {
      o = {};
      for (var d in i)
        d !== "key" && (o[d] = i[d]);
    } else o = i;
    return i = o.ref, {
      $$typeof: t,
      type: n,
      key: a,
      ref: i !== void 0 ? i : null,
      props: o
    };
  }
  return Rt.Fragment = e, Rt.jsx = r, Rt.jsxs = r, Rt;
}
var Ot = {};
/**
 * @license React
 * react-jsx-runtime.development.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var xn;
function lo() {
  return xn || (xn = 1, process.env.NODE_ENV !== "production" && function() {
    function t(T) {
      if (T == null) return null;
      if (typeof T == "function")
        return T.$$typeof === j ? null : T.displayName || T.name || null;
      if (typeof T == "string") return T;
      switch (T) {
        case v:
          return "Fragment";
        case E:
          return "Profiler";
        case w:
          return "StrictMode";
        case C:
          return "Suspense";
        case M:
          return "SuspenseList";
        case q:
          return "Activity";
      }
      if (typeof T == "object")
        switch (typeof T.tag == "number" && console.error(
          "Received an unexpected object in getComponentNameFromType(). This is likely a bug in React. Please file an issue."
        ), T.$$typeof) {
          case b:
            return "Portal";
          case O:
            return (T.displayName || "Context") + ".Provider";
          case m:
            return (T._context.displayName || "Context") + ".Consumer";
          case x:
            var V = T.render;
            return T = T.displayName, T || (T = V.displayName || V.name || "", T = T !== "" ? "ForwardRef(" + T + ")" : "ForwardRef"), T;
          case y:
            return V = T.displayName || null, V !== null ? V : t(T.type) || "Memo";
          case D:
            V = T._payload, T = T._init;
            try {
              return t(T(V));
            } catch {
            }
        }
      return null;
    }
    function e(T) {
      return "" + T;
    }
    function r(T) {
      try {
        e(T);
        var V = !1;
      } catch {
        V = !0;
      }
      if (V) {
        V = console;
        var W = V.error, Z = typeof Symbol == "function" && Symbol.toStringTag && T[Symbol.toStringTag] || T.constructor.name || "Object";
        return W.call(
          V,
          "The provided key is an unsupported type %s. This value must be coerced to a string before using it here.",
          Z
        ), e(T);
      }
    }
    function n(T) {
      if (T === v) return "<>";
      if (typeof T == "object" && T !== null && T.$$typeof === D)
        return "<...>";
      try {
        var V = t(T);
        return V ? "<" + V + ">" : "<...>";
      } catch {
        return "<...>";
      }
    }
    function i() {
      var T = F.A;
      return T === null ? null : T.getOwner();
    }
    function o() {
      return Error("react-stack-top-frame");
    }
    function a(T) {
      if (H.call(T, "key")) {
        var V = Object.getOwnPropertyDescriptor(T, "key").get;
        if (V && V.isReactWarning) return !1;
      }
      return T.key !== void 0;
    }
    function d(T, V) {
      function W() {
        ae || (ae = !0, console.error(
          "%s: `key` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://react.dev/link/special-props)",
          V
        ));
      }
      W.isReactWarning = !0, Object.defineProperty(T, "key", {
        get: W,
        configurable: !0
      });
    }
    function l() {
      var T = t(this.type);
      return De[T] || (De[T] = !0, console.error(
        "Accessing element.ref was removed in React 19. ref is now a regular prop. It will be removed from the JSX Element type in a future release."
      )), T = this.props.ref, T !== void 0 ? T : null;
    }
    function c(T, V, W, Z, ve, re, Te, we) {
      return W = re.ref, T = {
        $$typeof: f,
        type: T,
        key: V,
        props: re,
        _owner: ve
      }, (W !== void 0 ? W : null) !== null ? Object.defineProperty(T, "ref", {
        enumerable: !1,
        get: l
      }) : Object.defineProperty(T, "ref", { enumerable: !1, value: null }), T._store = {}, Object.defineProperty(T._store, "validated", {
        configurable: !1,
        enumerable: !1,
        writable: !0,
        value: 0
      }), Object.defineProperty(T, "_debugInfo", {
        configurable: !1,
        enumerable: !1,
        writable: !0,
        value: null
      }), Object.defineProperty(T, "_debugStack", {
        configurable: !1,
        enumerable: !1,
        writable: !0,
        value: Te
      }), Object.defineProperty(T, "_debugTask", {
        configurable: !1,
        enumerable: !1,
        writable: !0,
        value: we
      }), Object.freeze && (Object.freeze(T.props), Object.freeze(T)), T;
    }
    function h(T, V, W, Z, ve, re, Te, we) {
      var te = V.children;
      if (te !== void 0)
        if (Z)
          if (ue(te)) {
            for (Z = 0; Z < te.length; Z++)
              u(te[Z]);
            Object.freeze && Object.freeze(te);
          } else
            console.error(
              "React.jsx: Static children should always be an array. You are likely explicitly calling React.jsxs or React.jsxDEV. Use the Babel transform instead."
            );
        else u(te);
      if (H.call(V, "key")) {
        te = t(T);
        var Fe = Object.keys(V).filter(function(Ve) {
          return Ve !== "key";
        });
        Z = 0 < Fe.length ? "{key: someKey, " + Fe.join(": ..., ") + ": ...}" : "{key: someKey}", je[te + Z] || (Fe = 0 < Fe.length ? "{" + Fe.join(": ..., ") + ": ...}" : "{}", console.error(
          `A props object containing a "key" prop is being spread into JSX:
  let props = %s;
  <%s {...props} />
React keys must be passed directly to JSX without using spread:
  let props = %s;
  <%s key={someKey} {...props} />`,
          Z,
          te,
          Fe,
          te
        ), je[te + Z] = !0);
      }
      if (te = null, W !== void 0 && (r(W), te = "" + W), a(V) && (r(V.key), te = "" + V.key), "key" in V) {
        W = {};
        for (var Ke in V)
          Ke !== "key" && (W[Ke] = V[Ke]);
      } else W = V;
      return te && d(
        W,
        typeof T == "function" ? T.displayName || T.name || "Unknown" : T
      ), c(
        T,
        te,
        re,
        ve,
        i(),
        W,
        Te,
        we
      );
    }
    function u(T) {
      typeof T == "object" && T !== null && T.$$typeof === f && T._store && (T._store.validated = 1);
    }
    var s = We, f = Symbol.for("react.transitional.element"), b = Symbol.for("react.portal"), v = Symbol.for("react.fragment"), w = Symbol.for("react.strict_mode"), E = Symbol.for("react.profiler"), m = Symbol.for("react.consumer"), O = Symbol.for("react.context"), x = Symbol.for("react.forward_ref"), C = Symbol.for("react.suspense"), M = Symbol.for("react.suspense_list"), y = Symbol.for("react.memo"), D = Symbol.for("react.lazy"), q = Symbol.for("react.activity"), j = Symbol.for("react.client.reference"), F = s.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE, H = Object.prototype.hasOwnProperty, ue = Array.isArray, oe = console.createTask ? console.createTask : function() {
      return null;
    };
    s = {
      react_stack_bottom_frame: function(T) {
        return T();
      }
    };
    var ae, De = {}, Ee = s.react_stack_bottom_frame.bind(
      s,
      o
    )(), ie = oe(n(o)), je = {};
    Ot.Fragment = v, Ot.jsx = function(T, V, W, Z, ve) {
      var re = 1e4 > F.recentlyCreatedOwnerStacks++;
      return h(
        T,
        V,
        W,
        !1,
        Z,
        ve,
        re ? Error("react-stack-top-frame") : Ee,
        re ? oe(n(T)) : ie
      );
    }, Ot.jsxs = function(T, V, W, Z, ve) {
      var re = 1e4 > F.recentlyCreatedOwnerStacks++;
      return h(
        T,
        V,
        W,
        !0,
        Z,
        ve,
        re ? Error("react-stack-top-frame") : Ee,
        re ? oe(n(T)) : ie
      );
    };
  }()), Ot;
}
process.env.NODE_ENV === "production" ? Mr.exports = so() : Mr.exports = lo();
var S = Mr.exports, Pr = { exports: {} }, _e = {};
/**
 * @license React
 * react-dom.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var Sn;
function co() {
  if (Sn) return _e;
  Sn = 1;
  var t = We;
  function e(l) {
    var c = "https://react.dev/errors/" + l;
    if (1 < arguments.length) {
      c += "?args[]=" + encodeURIComponent(arguments[1]);
      for (var h = 2; h < arguments.length; h++)
        c += "&args[]=" + encodeURIComponent(arguments[h]);
    }
    return "Minified React error #" + l + "; visit " + c + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings.";
  }
  function r() {
  }
  var n = {
    d: {
      f: r,
      r: function() {
        throw Error(e(522));
      },
      D: r,
      C: r,
      L: r,
      m: r,
      X: r,
      S: r,
      M: r
    },
    p: 0,
    findDOMNode: null
  }, i = Symbol.for("react.portal");
  function o(l, c, h) {
    var u = 3 < arguments.length && arguments[3] !== void 0 ? arguments[3] : null;
    return {
      $$typeof: i,
      key: u == null ? null : "" + u,
      children: l,
      containerInfo: c,
      implementation: h
    };
  }
  var a = t.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE;
  function d(l, c) {
    if (l === "font") return "";
    if (typeof c == "string")
      return c === "use-credentials" ? c : "";
  }
  return _e.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = n, _e.createPortal = function(l, c) {
    var h = 2 < arguments.length && arguments[2] !== void 0 ? arguments[2] : null;
    if (!c || c.nodeType !== 1 && c.nodeType !== 9 && c.nodeType !== 11)
      throw Error(e(299));
    return o(l, c, null, h);
  }, _e.flushSync = function(l) {
    var c = a.T, h = n.p;
    try {
      if (a.T = null, n.p = 2, l) return l();
    } finally {
      a.T = c, n.p = h, n.d.f();
    }
  }, _e.preconnect = function(l, c) {
    typeof l == "string" && (c ? (c = c.crossOrigin, c = typeof c == "string" ? c === "use-credentials" ? c : "" : void 0) : c = null, n.d.C(l, c));
  }, _e.prefetchDNS = function(l) {
    typeof l == "string" && n.d.D(l);
  }, _e.preinit = function(l, c) {
    if (typeof l == "string" && c && typeof c.as == "string") {
      var h = c.as, u = d(h, c.crossOrigin), s = typeof c.integrity == "string" ? c.integrity : void 0, f = typeof c.fetchPriority == "string" ? c.fetchPriority : void 0;
      h === "style" ? n.d.S(
        l,
        typeof c.precedence == "string" ? c.precedence : void 0,
        {
          crossOrigin: u,
          integrity: s,
          fetchPriority: f
        }
      ) : h === "script" && n.d.X(l, {
        crossOrigin: u,
        integrity: s,
        fetchPriority: f,
        nonce: typeof c.nonce == "string" ? c.nonce : void 0
      });
    }
  }, _e.preinitModule = function(l, c) {
    if (typeof l == "string")
      if (typeof c == "object" && c !== null) {
        if (c.as == null || c.as === "script") {
          var h = d(
            c.as,
            c.crossOrigin
          );
          n.d.M(l, {
            crossOrigin: h,
            integrity: typeof c.integrity == "string" ? c.integrity : void 0,
            nonce: typeof c.nonce == "string" ? c.nonce : void 0
          });
        }
      } else c == null && n.d.M(l);
  }, _e.preload = function(l, c) {
    if (typeof l == "string" && typeof c == "object" && c !== null && typeof c.as == "string") {
      var h = c.as, u = d(h, c.crossOrigin);
      n.d.L(l, h, {
        crossOrigin: u,
        integrity: typeof c.integrity == "string" ? c.integrity : void 0,
        nonce: typeof c.nonce == "string" ? c.nonce : void 0,
        type: typeof c.type == "string" ? c.type : void 0,
        fetchPriority: typeof c.fetchPriority == "string" ? c.fetchPriority : void 0,
        referrerPolicy: typeof c.referrerPolicy == "string" ? c.referrerPolicy : void 0,
        imageSrcSet: typeof c.imageSrcSet == "string" ? c.imageSrcSet : void 0,
        imageSizes: typeof c.imageSizes == "string" ? c.imageSizes : void 0,
        media: typeof c.media == "string" ? c.media : void 0
      });
    }
  }, _e.preloadModule = function(l, c) {
    if (typeof l == "string")
      if (c) {
        var h = d(c.as, c.crossOrigin);
        n.d.m(l, {
          as: typeof c.as == "string" && c.as !== "script" ? c.as : void 0,
          crossOrigin: h,
          integrity: typeof c.integrity == "string" ? c.integrity : void 0
        });
      } else n.d.m(l);
  }, _e.requestFormReset = function(l) {
    n.d.r(l);
  }, _e.unstable_batchedUpdates = function(l, c) {
    return l(c);
  }, _e.useFormState = function(l, c, h) {
    return a.H.useFormState(l, c, h);
  }, _e.useFormStatus = function() {
    return a.H.useHostTransitionStatus();
  }, _e.version = "19.1.1", _e;
}
var be = {};
/**
 * @license React
 * react-dom.development.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var Rn;
function uo() {
  return Rn || (Rn = 1, process.env.NODE_ENV !== "production" && function() {
    function t() {
    }
    function e(u) {
      return "" + u;
    }
    function r(u, s, f) {
      var b = 3 < arguments.length && arguments[3] !== void 0 ? arguments[3] : null;
      try {
        e(b);
        var v = !1;
      } catch {
        v = !0;
      }
      return v && (console.error(
        "The provided key is an unsupported type %s. This value must be coerced to a string before using it here.",
        typeof Symbol == "function" && Symbol.toStringTag && b[Symbol.toStringTag] || b.constructor.name || "Object"
      ), e(b)), {
        $$typeof: c,
        key: b == null ? null : "" + b,
        children: u,
        containerInfo: s,
        implementation: f
      };
    }
    function n(u, s) {
      if (u === "font") return "";
      if (typeof s == "string")
        return s === "use-credentials" ? s : "";
    }
    function i(u) {
      return u === null ? "`null`" : u === void 0 ? "`undefined`" : u === "" ? "an empty string" : 'something with type "' + typeof u + '"';
    }
    function o(u) {
      return u === null ? "`null`" : u === void 0 ? "`undefined`" : u === "" ? "an empty string" : typeof u == "string" ? JSON.stringify(u) : typeof u == "number" ? "`" + u + "`" : 'something with type "' + typeof u + '"';
    }
    function a() {
      var u = h.H;
      return u === null && console.error(
        `Invalid hook call. Hooks can only be called inside of the body of a function component. This could happen for one of the following reasons:
1. You might have mismatching versions of React and the renderer (such as React DOM)
2. You might be breaking the Rules of Hooks
3. You might have more than one copy of React in the same app
See https://react.dev/link/invalid-hook-call for tips about how to debug and fix this problem.`
      ), u;
    }
    typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u" && typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart == "function" && __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart(Error());
    var d = We, l = {
      d: {
        f: t,
        r: function() {
          throw Error(
            "Invalid form element. requestFormReset must be passed a form that was rendered by React."
          );
        },
        D: t,
        C: t,
        L: t,
        m: t,
        X: t,
        S: t,
        M: t
      },
      p: 0,
      findDOMNode: null
    }, c = Symbol.for("react.portal"), h = d.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE;
    typeof Map == "function" && Map.prototype != null && typeof Map.prototype.forEach == "function" && typeof Set == "function" && Set.prototype != null && typeof Set.prototype.clear == "function" && typeof Set.prototype.forEach == "function" || console.error(
      "React depends on Map and Set built-in types. Make sure that you load a polyfill in older browsers. https://reactjs.org/link/react-polyfills"
    ), be.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = l, be.createPortal = function(u, s) {
      var f = 2 < arguments.length && arguments[2] !== void 0 ? arguments[2] : null;
      if (!s || s.nodeType !== 1 && s.nodeType !== 9 && s.nodeType !== 11)
        throw Error("Target container is not a DOM element.");
      return r(u, s, null, f);
    }, be.flushSync = function(u) {
      var s = h.T, f = l.p;
      try {
        if (h.T = null, l.p = 2, u)
          return u();
      } finally {
        h.T = s, l.p = f, l.d.f() && console.error(
          "flushSync was called from inside a lifecycle method. React cannot flush when React is already rendering. Consider moving this call to a scheduler task or micro task."
        );
      }
    }, be.preconnect = function(u, s) {
      typeof u == "string" && u ? s != null && typeof s != "object" ? console.error(
        "ReactDOM.preconnect(): Expected the `options` argument (second) to be an object but encountered %s instead. The only supported option at this time is `crossOrigin` which accepts a string.",
        o(s)
      ) : s != null && typeof s.crossOrigin != "string" && console.error(
        "ReactDOM.preconnect(): Expected the `crossOrigin` option (second argument) to be a string but encountered %s instead. Try removing this option or passing a string value instead.",
        i(s.crossOrigin)
      ) : console.error(
        "ReactDOM.preconnect(): Expected the `href` argument (first) to be a non-empty string but encountered %s instead.",
        i(u)
      ), typeof u == "string" && (s ? (s = s.crossOrigin, s = typeof s == "string" ? s === "use-credentials" ? s : "" : void 0) : s = null, l.d.C(u, s));
    }, be.prefetchDNS = function(u) {
      if (typeof u != "string" || !u)
        console.error(
          "ReactDOM.prefetchDNS(): Expected the `href` argument (first) to be a non-empty string but encountered %s instead.",
          i(u)
        );
      else if (1 < arguments.length) {
        var s = arguments[1];
        typeof s == "object" && s.hasOwnProperty("crossOrigin") ? console.error(
          "ReactDOM.prefetchDNS(): Expected only one argument, `href`, but encountered %s as a second argument instead. This argument is reserved for future options and is currently disallowed. It looks like the you are attempting to set a crossOrigin property for this DNS lookup hint. Browsers do not perform DNS queries using CORS and setting this attribute on the resource hint has no effect. Try calling ReactDOM.prefetchDNS() with just a single string argument, `href`.",
          o(s)
        ) : console.error(
          "ReactDOM.prefetchDNS(): Expected only one argument, `href`, but encountered %s as a second argument instead. This argument is reserved for future options and is currently disallowed. Try calling ReactDOM.prefetchDNS() with just a single string argument, `href`.",
          o(s)
        );
      }
      typeof u == "string" && l.d.D(u);
    }, be.preinit = function(u, s) {
      if (typeof u == "string" && u ? s == null || typeof s != "object" ? console.error(
        "ReactDOM.preinit(): Expected the `options` argument (second) to be an object with an `as` property describing the type of resource to be preinitialized but encountered %s instead.",
        o(s)
      ) : s.as !== "style" && s.as !== "script" && console.error(
        'ReactDOM.preinit(): Expected the `as` property in the `options` argument (second) to contain a valid value describing the type of resource to be preinitialized but encountered %s instead. Valid values for `as` are "style" and "script".',
        o(s.as)
      ) : console.error(
        "ReactDOM.preinit(): Expected the `href` argument (first) to be a non-empty string but encountered %s instead.",
        i(u)
      ), typeof u == "string" && s && typeof s.as == "string") {
        var f = s.as, b = n(f, s.crossOrigin), v = typeof s.integrity == "string" ? s.integrity : void 0, w = typeof s.fetchPriority == "string" ? s.fetchPriority : void 0;
        f === "style" ? l.d.S(
          u,
          typeof s.precedence == "string" ? s.precedence : void 0,
          {
            crossOrigin: b,
            integrity: v,
            fetchPriority: w
          }
        ) : f === "script" && l.d.X(u, {
          crossOrigin: b,
          integrity: v,
          fetchPriority: w,
          nonce: typeof s.nonce == "string" ? s.nonce : void 0
        });
      }
    }, be.preinitModule = function(u, s) {
      var f = "";
      if (typeof u == "string" && u || (f += " The `href` argument encountered was " + i(u) + "."), s !== void 0 && typeof s != "object" ? f += " The `options` argument encountered was " + i(s) + "." : s && "as" in s && s.as !== "script" && (f += " The `as` option encountered was " + o(s.as) + "."), f)
        console.error(
          "ReactDOM.preinitModule(): Expected up to two arguments, a non-empty `href` string and, optionally, an `options` object with a valid `as` property.%s",
          f
        );
      else
        switch (f = s && typeof s.as == "string" ? s.as : "script", f) {
          case "script":
            break;
          default:
            f = o(f), console.error(
              'ReactDOM.preinitModule(): Currently the only supported "as" type for this function is "script" but received "%s" instead. This warning was generated for `href` "%s". In the future other module types will be supported, aligning with the import-attributes proposal. Learn more here: (https://github.com/tc39/proposal-import-attributes)',
              f,
              u
            );
        }
      typeof u == "string" && (typeof s == "object" && s !== null ? (s.as == null || s.as === "script") && (f = n(
        s.as,
        s.crossOrigin
      ), l.d.M(u, {
        crossOrigin: f,
        integrity: typeof s.integrity == "string" ? s.integrity : void 0,
        nonce: typeof s.nonce == "string" ? s.nonce : void 0
      })) : s == null && l.d.M(u));
    }, be.preload = function(u, s) {
      var f = "";
      if (typeof u == "string" && u || (f += " The `href` argument encountered was " + i(u) + "."), s == null || typeof s != "object" ? f += " The `options` argument encountered was " + i(s) + "." : typeof s.as == "string" && s.as || (f += " The `as` option encountered was " + i(s.as) + "."), f && console.error(
        'ReactDOM.preload(): Expected two arguments, a non-empty `href` string and an `options` object with an `as` property valid for a `<link rel="preload" as="..." />` tag.%s',
        f
      ), typeof u == "string" && typeof s == "object" && s !== null && typeof s.as == "string") {
        f = s.as;
        var b = n(
          f,
          s.crossOrigin
        );
        l.d.L(u, f, {
          crossOrigin: b,
          integrity: typeof s.integrity == "string" ? s.integrity : void 0,
          nonce: typeof s.nonce == "string" ? s.nonce : void 0,
          type: typeof s.type == "string" ? s.type : void 0,
          fetchPriority: typeof s.fetchPriority == "string" ? s.fetchPriority : void 0,
          referrerPolicy: typeof s.referrerPolicy == "string" ? s.referrerPolicy : void 0,
          imageSrcSet: typeof s.imageSrcSet == "string" ? s.imageSrcSet : void 0,
          imageSizes: typeof s.imageSizes == "string" ? s.imageSizes : void 0,
          media: typeof s.media == "string" ? s.media : void 0
        });
      }
    }, be.preloadModule = function(u, s) {
      var f = "";
      typeof u == "string" && u || (f += " The `href` argument encountered was " + i(u) + "."), s !== void 0 && typeof s != "object" ? f += " The `options` argument encountered was " + i(s) + "." : s && "as" in s && typeof s.as != "string" && (f += " The `as` option encountered was " + i(s.as) + "."), f && console.error(
        'ReactDOM.preloadModule(): Expected two arguments, a non-empty `href` string and, optionally, an `options` object with an `as` property valid for a `<link rel="modulepreload" as="..." />` tag.%s',
        f
      ), typeof u == "string" && (s ? (f = n(
        s.as,
        s.crossOrigin
      ), l.d.m(u, {
        as: typeof s.as == "string" && s.as !== "script" ? s.as : void 0,
        crossOrigin: f,
        integrity: typeof s.integrity == "string" ? s.integrity : void 0
      })) : l.d.m(u));
    }, be.requestFormReset = function(u) {
      l.d.r(u);
    }, be.unstable_batchedUpdates = function(u, s) {
      return u(s);
    }, be.useFormState = function(u, s, f) {
      return a().useFormState(u, s, f);
    }, be.useFormStatus = function() {
      return a().useHostTransitionStatus();
    }, be.version = "19.1.1", typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u" && typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop == "function" && __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop(Error());
  }()), be;
}
function di() {
  if (!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > "u" || typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE != "function")) {
    if (process.env.NODE_ENV !== "production")
      throw new Error("^_^");
    try {
      __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(di);
    } catch (t) {
      console.error(t);
    }
  }
}
process.env.NODE_ENV === "production" ? (di(), Pr.exports = co()) : Pr.exports = uo();
var fi = Pr.exports;
const fo = /* @__PURE__ */ ui(fi), ho = /* @__PURE__ */ ao({
  __proto__: null,
  default: fo
}, [fi]);
/**
 * @remix-run/router v1.23.0
 *
 * Copyright (c) Remix Software Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.md file in the root directory of this source tree.
 *
 * @license MIT
 */
function ne() {
  return ne = Object.assign ? Object.assign.bind() : function(t) {
    for (var e = 1; e < arguments.length; e++) {
      var r = arguments[e];
      for (var n in r)
        Object.prototype.hasOwnProperty.call(r, n) && (t[n] = r[n]);
    }
    return t;
  }, ne.apply(this, arguments);
}
var fe;
(function(t) {
  t.Pop = "POP", t.Push = "PUSH", t.Replace = "REPLACE";
})(fe || (fe = {}));
const On = "popstate";
function po(t) {
  t === void 0 && (t = {});
  function e(n, i) {
    let {
      pathname: o,
      search: a,
      hash: d
    } = n.location;
    return Lt(
      "",
      {
        pathname: o,
        search: a,
        hash: d
      },
      // state defaults to `null` because `window.history.state` does
      i.state && i.state.usr || null,
      i.state && i.state.key || "default"
    );
  }
  function r(n, i) {
    return typeof i == "string" ? i : et(i);
  }
  return go(e, r, null, t);
}
function U(t, e) {
  if (t === !1 || t === null || typeof t > "u")
    throw new Error(e);
}
function me(t, e) {
  if (!t) {
    typeof console < "u" && console.warn(e);
    try {
      throw new Error(e);
    } catch {
    }
  }
}
function mo() {
  return Math.random().toString(36).substr(2, 8);
}
function Tn(t, e) {
  return {
    usr: t.state,
    key: t.key,
    idx: e
  };
}
function Lt(t, e, r, n) {
  return r === void 0 && (r = null), ne({
    pathname: typeof t == "string" ? t : t.pathname,
    search: "",
    hash: ""
  }, typeof e == "string" ? rt(e) : e, {
    state: r,
    // TODO: This could be cleaned up.  push/replace should probably just take
    // full Locations now and avoid the need to run through this flow at all
    // But that's a pretty big refactor to the current test suite so going to
    // keep as is for the time being and just let any incoming keys take precedence
    key: e && e.key || n || mo()
  });
}
function et(t) {
  let {
    pathname: e = "/",
    search: r = "",
    hash: n = ""
  } = t;
  return r && r !== "?" && (e += r.charAt(0) === "?" ? r : "?" + r), n && n !== "#" && (e += n.charAt(0) === "#" ? n : "#" + n), e;
}
function rt(t) {
  let e = {};
  if (t) {
    let r = t.indexOf("#");
    r >= 0 && (e.hash = t.substr(r), t = t.substr(0, r));
    let n = t.indexOf("?");
    n >= 0 && (e.search = t.substr(n), t = t.substr(0, n)), t && (e.pathname = t);
  }
  return e;
}
function go(t, e, r, n) {
  n === void 0 && (n = {});
  let {
    window: i = document.defaultView,
    v5Compat: o = !1
  } = n, a = i.history, d = fe.Pop, l = null, c = h();
  c == null && (c = 0, a.replaceState(ne({}, a.state, {
    idx: c
  }), ""));
  function h() {
    return (a.state || {
      idx: null
    }).idx;
  }
  function u() {
    d = fe.Pop;
    let w = h(), E = w == null ? null : w - c;
    c = w, l && l({
      action: d,
      location: v.location,
      delta: E
    });
  }
  function s(w, E) {
    d = fe.Push;
    let m = Lt(v.location, w, E);
    c = h() + 1;
    let O = Tn(m, c), x = v.createHref(m);
    try {
      a.pushState(O, "", x);
    } catch (C) {
      if (C instanceof DOMException && C.name === "DataCloneError")
        throw C;
      i.location.assign(x);
    }
    o && l && l({
      action: d,
      location: v.location,
      delta: 1
    });
  }
  function f(w, E) {
    d = fe.Replace;
    let m = Lt(v.location, w, E);
    c = h();
    let O = Tn(m, c), x = v.createHref(m);
    a.replaceState(O, "", x), o && l && l({
      action: d,
      location: v.location,
      delta: 0
    });
  }
  function b(w) {
    let E = i.location.origin !== "null" ? i.location.origin : i.location.href, m = typeof w == "string" ? w : et(w);
    return m = m.replace(/ $/, "%20"), U(E, "No window.location.(origin|href) available to create URL for href: " + m), new URL(m, E);
  }
  let v = {
    get action() {
      return d;
    },
    get location() {
      return t(i, a);
    },
    listen(w) {
      if (l)
        throw new Error("A history only accepts one active listener");
      return i.addEventListener(On, u), l = w, () => {
        i.removeEventListener(On, u), l = null;
      };
    },
    createHref(w) {
      return e(i, w);
    },
    createURL: b,
    encodeLocation(w) {
      let E = b(w);
      return {
        pathname: E.pathname,
        search: E.search,
        hash: E.hash
      };
    },
    push: s,
    replace: f,
    go(w) {
      return a.go(w);
    }
  };
  return v;
}
var Q;
(function(t) {
  t.data = "data", t.deferred = "deferred", t.redirect = "redirect", t.error = "error";
})(Q || (Q = {}));
const yo = /* @__PURE__ */ new Set(["lazy", "caseSensitive", "path", "id", "index", "children"]);
function vo(t) {
  return t.index === !0;
}
function or(t, e, r, n) {
  return r === void 0 && (r = []), n === void 0 && (n = {}), t.map((i, o) => {
    let a = [...r, String(o)], d = typeof i.id == "string" ? i.id : a.join("-");
    if (U(i.index !== !0 || !i.children, "Cannot specify children on an index route"), U(!n[d], 'Found a route id collision on id "' + d + `".  Route id's must be globally unique within Data Router usages`), vo(i)) {
      let l = ne({}, i, e(i), {
        id: d
      });
      return n[d] = l, l;
    } else {
      let l = ne({}, i, e(i), {
        id: d,
        children: void 0
      });
      return n[d] = l, i.children && (l.children = or(i.children, e, a, n)), l;
    }
  });
}
function ot(t, e, r) {
  return r === void 0 && (r = "/"), Xt(t, e, r, !1);
}
function Xt(t, e, r, n) {
  let i = typeof e == "string" ? rt(e) : e, o = Le(i.pathname || "/", r);
  if (o == null)
    return null;
  let a = hi(t);
  bo(a);
  let d = null;
  for (let l = 0; d == null && l < a.length; ++l) {
    let c = Ao(o);
    d = Co(a[l], c, n);
  }
  return d;
}
function _o(t, e) {
  let {
    route: r,
    pathname: n,
    params: i
  } = t;
  return {
    id: r.id,
    pathname: n,
    params: i,
    data: e[r.id],
    handle: r.handle
  };
}
function hi(t, e, r, n) {
  e === void 0 && (e = []), r === void 0 && (r = []), n === void 0 && (n = "");
  let i = (o, a, d) => {
    let l = {
      relativePath: d === void 0 ? o.path || "" : d,
      caseSensitive: o.caseSensitive === !0,
      childrenIndex: a,
      route: o
    };
    l.relativePath.startsWith("/") && (U(l.relativePath.startsWith(n), 'Absolute route path "' + l.relativePath + '" nested under path ' + ('"' + n + '" is not valid. An absolute child route path ') + "must start with the combined path of all its parent routes."), l.relativePath = l.relativePath.slice(n.length));
    let c = Be([n, l.relativePath]), h = r.concat(l);
    o.children && o.children.length > 0 && (U(
      // Our types know better, but runtime JS may not!
      // @ts-expect-error
      o.index !== !0,
      "Index routes must not have child routes. Please remove " + ('all child routes from route path "' + c + '".')
    ), hi(o.children, e, h, c)), !(o.path == null && !o.index) && e.push({
      path: c,
      score: To(c, o.index),
      routesMeta: h
    });
  };
  return t.forEach((o, a) => {
    var d;
    if (o.path === "" || !((d = o.path) != null && d.includes("?")))
      i(o, a);
    else
      for (let l of pi(o.path))
        i(o, a, l);
  }), e;
}
function pi(t) {
  let e = t.split("/");
  if (e.length === 0) return [];
  let [r, ...n] = e, i = r.endsWith("?"), o = r.replace(/\?$/, "");
  if (n.length === 0)
    return i ? [o, ""] : [o];
  let a = pi(n.join("/")), d = [];
  return d.push(...a.map((l) => l === "" ? o : [o, l].join("/"))), i && d.push(...a), d.map((l) => t.startsWith("/") && l === "" ? "/" : l);
}
function bo(t) {
  t.sort((e, r) => e.score !== r.score ? r.score - e.score : No(e.routesMeta.map((n) => n.childrenIndex), r.routesMeta.map((n) => n.childrenIndex)));
}
const Eo = /^:[\w-]+$/, wo = 3, xo = 2, So = 1, Ro = 10, Oo = -2, Nn = (t) => t === "*";
function To(t, e) {
  let r = t.split("/"), n = r.length;
  return r.some(Nn) && (n += Oo), e && (n += xo), r.filter((i) => !Nn(i)).reduce((i, o) => i + (Eo.test(o) ? wo : o === "" ? So : Ro), n);
}
function No(t, e) {
  return t.length === e.length && t.slice(0, -1).every((n, i) => n === e[i]) ? (
    // If two routes are siblings, we should try to match the earlier sibling
    // first. This allows people to have fine-grained control over the matching
    // behavior by simply putting routes with identical paths in the order they
    // want them tried.
    t[t.length - 1] - e[e.length - 1]
  ) : (
    // Otherwise, it doesn't really make sense to rank non-siblings by index,
    // so they sort equally.
    0
  );
}
function Co(t, e, r) {
  r === void 0 && (r = !1);
  let {
    routesMeta: n
  } = t, i = {}, o = "/", a = [];
  for (let d = 0; d < n.length; ++d) {
    let l = n[d], c = d === n.length - 1, h = o === "/" ? e : e.slice(o.length) || "/", u = ar({
      path: l.relativePath,
      caseSensitive: l.caseSensitive,
      end: c
    }, h), s = l.route;
    if (!u && c && r && !n[n.length - 1].route.index && (u = ar({
      path: l.relativePath,
      caseSensitive: l.caseSensitive,
      end: !1
    }, h)), !u)
      return null;
    Object.assign(i, u.params), a.push({
      // TODO: Can this as be avoided?
      params: i,
      pathname: Be([o, u.pathname]),
      pathnameBase: Mo(Be([o, u.pathnameBase])),
      route: s
    }), u.pathnameBase !== "/" && (o = Be([o, u.pathnameBase]));
  }
  return a;
}
function ar(t, e) {
  typeof t == "string" && (t = {
    path: t,
    caseSensitive: !1,
    end: !0
  });
  let [r, n] = Do(t.path, t.caseSensitive, t.end), i = e.match(r);
  if (!i) return null;
  let o = i[0], a = o.replace(/(.)\/+$/, "$1"), d = i.slice(1);
  return {
    params: n.reduce((c, h, u) => {
      let {
        paramName: s,
        isOptional: f
      } = h;
      if (s === "*") {
        let v = d[u] || "";
        a = o.slice(0, o.length - v.length).replace(/(.)\/+$/, "$1");
      }
      const b = d[u];
      return f && !b ? c[s] = void 0 : c[s] = (b || "").replace(/%2F/g, "/"), c;
    }, {}),
    pathname: o,
    pathnameBase: a,
    pattern: t
  };
}
function Do(t, e, r) {
  e === void 0 && (e = !1), r === void 0 && (r = !0), me(t === "*" || !t.endsWith("*") || t.endsWith("/*"), 'Route path "' + t + '" will be treated as if it were ' + ('"' + t.replace(/\*$/, "/*") + '" because the `*` character must ') + "always follow a `/` in the pattern. To get rid of this warning, " + ('please change the route path to "' + t.replace(/\*$/, "/*") + '".'));
  let n = [], i = "^" + t.replace(/\/*\*?$/, "").replace(/^\/*/, "/").replace(/[\\.*+^${}|()[\]]/g, "\\$&").replace(/\/:([\w-]+)(\?)?/g, (a, d, l) => (n.push({
    paramName: d,
    isOptional: l != null
  }), l ? "/?([^\\/]+)?" : "/([^\\/]+)"));
  return t.endsWith("*") ? (n.push({
    paramName: "*"
  }), i += t === "*" || t === "/*" ? "(.*)$" : "(?:\\/(.+)|\\/*)$") : r ? i += "\\/*$" : t !== "" && t !== "/" && (i += "(?:(?=\\/|$))"), [new RegExp(i, e ? void 0 : "i"), n];
}
function Ao(t) {
  try {
    return t.split("/").map((e) => decodeURIComponent(e).replace(/\//g, "%2F")).join("/");
  } catch (e) {
    return me(!1, 'The URL path "' + t + '" could not be decoded because it is is a malformed URL segment. This is probably due to a bad percent ' + ("encoding (" + e + ").")), t;
  }
}
function Le(t, e) {
  if (e === "/") return t;
  if (!t.toLowerCase().startsWith(e.toLowerCase()))
    return null;
  let r = e.endsWith("/") ? e.length - 1 : e.length, n = t.charAt(r);
  return n && n !== "/" ? null : t.slice(r) || "/";
}
function ko(t, e) {
  e === void 0 && (e = "/");
  let {
    pathname: r,
    search: n = "",
    hash: i = ""
  } = typeof t == "string" ? rt(t) : t;
  return {
    pathname: r ? r.startsWith("/") ? r : Lo(r, e) : e,
    search: Po(n),
    hash: jo(i)
  };
}
function Lo(t, e) {
  let r = e.replace(/\/+$/, "").split("/");
  return t.split("/").forEach((i) => {
    i === ".." ? r.length > 1 && r.pop() : i !== "." && r.push(i);
  }), r.length > 1 ? r.join("/") : "/";
}
function wr(t, e, r, n) {
  return "Cannot include a '" + t + "' character in a manually specified " + ("`to." + e + "` field [" + JSON.stringify(n) + "].  Please separate it out to the ") + ("`to." + r + "` field. Alternatively you may provide the full path as ") + 'a string in <Link to="..."> and the router will parse it for you.';
}
function mi(t) {
  return t.filter((e, r) => r === 0 || e.route.path && e.route.path.length > 0);
}
function Kr(t, e) {
  let r = mi(t);
  return e ? r.map((n, i) => i === r.length - 1 ? n.pathname : n.pathnameBase) : r.map((n) => n.pathnameBase);
}
function Yr(t, e, r, n) {
  n === void 0 && (n = !1);
  let i;
  typeof t == "string" ? i = rt(t) : (i = ne({}, t), U(!i.pathname || !i.pathname.includes("?"), wr("?", "pathname", "search", i)), U(!i.pathname || !i.pathname.includes("#"), wr("#", "pathname", "hash", i)), U(!i.search || !i.search.includes("#"), wr("#", "search", "hash", i)));
  let o = t === "" || i.pathname === "", a = o ? "/" : i.pathname, d;
  if (a == null)
    d = r;
  else {
    let u = e.length - 1;
    if (!n && a.startsWith("..")) {
      let s = a.split("/");
      for (; s[0] === ".."; )
        s.shift(), u -= 1;
      i.pathname = s.join("/");
    }
    d = u >= 0 ? e[u] : "/";
  }
  let l = ko(i, d), c = a && a !== "/" && a.endsWith("/"), h = (o || a === ".") && r.endsWith("/");
  return !l.pathname.endsWith("/") && (c || h) && (l.pathname += "/"), l;
}
const Be = (t) => t.join("/").replace(/\/\/+/g, "/"), Mo = (t) => t.replace(/\/+$/, "").replace(/^\/*/, "/"), Po = (t) => !t || t === "?" ? "" : t.startsWith("?") ? t : "?" + t, jo = (t) => !t || t === "#" ? "" : t.startsWith("#") ? t : "#" + t;
class sr {
  constructor(e, r, n, i) {
    i === void 0 && (i = !1), this.status = e, this.statusText = r || "", this.internal = i, n instanceof Error ? (this.data = n.toString(), this.error = n) : this.data = n;
  }
}
function Mt(t) {
  return t != null && typeof t.status == "number" && typeof t.statusText == "string" && typeof t.internal == "boolean" && "data" in t;
}
const gi = ["post", "put", "patch", "delete"], Io = new Set(gi), Bo = ["get", ...gi], Uo = new Set(Bo), Fo = /* @__PURE__ */ new Set([301, 302, 303, 307, 308]), Vo = /* @__PURE__ */ new Set([307, 308]), xr = {
  state: "idle",
  location: void 0,
  formMethod: void 0,
  formAction: void 0,
  formEncType: void 0,
  formData: void 0,
  json: void 0,
  text: void 0
}, zo = {
  state: "idle",
  data: void 0,
  formMethod: void 0,
  formAction: void 0,
  formEncType: void 0,
  formData: void 0,
  json: void 0,
  text: void 0
}, Tt = {
  state: "unblocked",
  proceed: void 0,
  reset: void 0,
  location: void 0
}, Gr = /^(?:[a-z][a-z0-9+.-]*:|\/\/)/i, qo = (t) => ({
  hasErrorBoundary: !!t.hasErrorBoundary
}), yi = "remix-router-transitions";
function Ho(t) {
  const e = t.window ? t.window : typeof window < "u" ? window : void 0, r = typeof e < "u" && typeof e.document < "u" && typeof e.document.createElement < "u", n = !r;
  U(t.routes.length > 0, "You must provide a non-empty routes array to createRouter");
  let i;
  if (t.mapRouteProperties)
    i = t.mapRouteProperties;
  else if (t.detectErrorBoundary) {
    let p = t.detectErrorBoundary;
    i = (g) => ({
      hasErrorBoundary: p(g)
    });
  } else
    i = qo;
  let o = {}, a = or(t.routes, i, void 0, o), d, l = t.basename || "/", c = t.dataStrategy || Yo, h = t.patchRoutesOnNavigation, u = ne({
    v7_fetcherPersist: !1,
    v7_normalizeFormMethod: !1,
    v7_partialHydration: !1,
    v7_prependBasename: !1,
    v7_relativeSplatPath: !1,
    v7_skipActionErrorRevalidation: !1
  }, t.future), s = null, f = /* @__PURE__ */ new Set(), b = null, v = null, w = null, E = t.hydrationData != null, m = ot(a, t.history.location, l), O = !1, x = null;
  if (m == null && !h) {
    let p = xe(404, {
      pathname: t.history.location.pathname
    }), {
      matches: g,
      route: _
    } = Un(a);
    m = g, x = {
      [_.id]: p
    };
  }
  m && !t.hydrationData && zt(m, a, t.history.location.pathname).active && (m = null);
  let C;
  if (m)
    if (m.some((p) => p.route.lazy))
      C = !1;
    else if (!m.some((p) => p.route.loader))
      C = !0;
    else if (u.v7_partialHydration) {
      let p = t.hydrationData ? t.hydrationData.loaderData : null, g = t.hydrationData ? t.hydrationData.errors : null;
      if (g) {
        let _ = m.findIndex((N) => g[N.route.id] !== void 0);
        C = m.slice(0, _ + 1).every((N) => !Ir(N.route, p, g));
      } else
        C = m.every((_) => !Ir(_.route, p, g));
    } else
      C = t.hydrationData != null;
  else if (C = !1, m = [], u.v7_partialHydration) {
    let p = zt(null, a, t.history.location.pathname);
    p.active && p.matches && (O = !0, m = p.matches);
  }
  let M, y = {
    historyAction: t.history.action,
    location: t.history.location,
    matches: m,
    initialized: C,
    navigation: xr,
    // Don't restore on initial updateState() if we were SSR'd
    restoreScrollPosition: t.hydrationData != null ? !1 : null,
    preventScrollReset: !1,
    revalidation: "idle",
    loaderData: t.hydrationData && t.hydrationData.loaderData || {},
    actionData: t.hydrationData && t.hydrationData.actionData || null,
    errors: t.hydrationData && t.hydrationData.errors || x,
    fetchers: /* @__PURE__ */ new Map(),
    blockers: /* @__PURE__ */ new Map()
  }, D = fe.Pop, q = !1, j, F = !1, H = /* @__PURE__ */ new Map(), ue = null, oe = !1, ae = !1, De = [], Ee = /* @__PURE__ */ new Set(), ie = /* @__PURE__ */ new Map(), je = 0, T = -1, V = /* @__PURE__ */ new Map(), W = /* @__PURE__ */ new Set(), Z = /* @__PURE__ */ new Map(), ve = /* @__PURE__ */ new Map(), re = /* @__PURE__ */ new Set(), Te = /* @__PURE__ */ new Map(), we = /* @__PURE__ */ new Map(), te;
  function Fe() {
    if (s = t.history.listen((p) => {
      let {
        action: g,
        location: _,
        delta: N
      } = p;
      if (te) {
        te(), te = void 0;
        return;
      }
      me(we.size === 0 || N != null, "You are trying to use a blocker on a POP navigation to a location that was not created by @remix-run/router. This will fail silently in production. This can happen if you are navigating outside the router via `window.history.pushState`/`window.location.hash` instead of using router navigation APIs.  This can also happen if you are using createHashRouter and the user manually changes the URL.");
      let A = vn({
        currentLocation: y.location,
        nextLocation: _,
        historyAction: g
      });
      if (A && N != null) {
        let B = new Promise((z) => {
          te = z;
        });
        t.history.go(N * -1), Vt(A, {
          state: "blocked",
          location: _,
          proceed() {
            Vt(A, {
              state: "proceeding",
              proceed: void 0,
              reset: void 0,
              location: _
            }), B.then(() => t.history.go(N));
          },
          reset() {
            let z = new Map(y.blockers);
            z.set(A, Tt), ge({
              blockers: z
            });
          }
        });
        return;
      }
      return qe(g, _);
    }), r) {
      la(e, H);
      let p = () => ca(e, H);
      e.addEventListener("pagehide", p), ue = () => e.removeEventListener("pagehide", p);
    }
    return y.initialized || qe(fe.Pop, y.location, {
      initialHydration: !0
    }), M;
  }
  function Ke() {
    s && s(), ue && ue(), f.clear(), j && j.abort(), y.fetchers.forEach((p, g) => Ft(g)), y.blockers.forEach((p, g) => yn(g));
  }
  function Ve(p) {
    return f.add(p), () => f.delete(p);
  }
  function ge(p, g) {
    g === void 0 && (g = {}), y = ne({}, y, p);
    let _ = [], N = [];
    u.v7_fetcherPersist && y.fetchers.forEach((A, B) => {
      A.state === "idle" && (re.has(B) ? N.push(B) : _.push(B));
    }), re.forEach((A) => {
      !y.fetchers.has(A) && !ie.has(A) && N.push(A);
    }), [...f].forEach((A) => A(y, {
      deletedFetchers: N,
      viewTransitionOpts: g.viewTransitionOpts,
      flushSync: g.flushSync === !0
    })), u.v7_fetcherPersist ? (_.forEach((A) => y.fetchers.delete(A)), N.forEach((A) => Ft(A))) : N.forEach((A) => re.delete(A));
  }
  function ze(p, g, _) {
    var N, A;
    let {
      flushSync: B
    } = _ === void 0 ? {} : _, z = y.actionData != null && y.navigation.formMethod != null && Ae(y.navigation.formMethod) && y.navigation.state === "loading" && ((N = p.state) == null ? void 0 : N._isRedirect) !== !0, L;
    g.actionData ? Object.keys(g.actionData).length > 0 ? L = g.actionData : L = null : z ? L = y.actionData : L = null;
    let P = g.loaderData ? In(y.loaderData, g.loaderData, g.matches || [], g.errors) : y.loaderData, k = y.blockers;
    k.size > 0 && (k = new Map(k), k.forEach((Y, ye) => k.set(ye, Tt)));
    let I = q === !0 || y.navigation.formMethod != null && Ae(y.navigation.formMethod) && ((A = p.state) == null ? void 0 : A._isRedirect) !== !0;
    d && (a = d, d = void 0), oe || D === fe.Pop || (D === fe.Push ? t.history.push(p, p.state) : D === fe.Replace && t.history.replace(p, p.state));
    let $;
    if (D === fe.Pop) {
      let Y = H.get(y.location.pathname);
      Y && Y.has(p.pathname) ? $ = {
        currentLocation: y.location,
        nextLocation: p
      } : H.has(p.pathname) && ($ = {
        currentLocation: p,
        nextLocation: y.location
      });
    } else if (F) {
      let Y = H.get(y.location.pathname);
      Y ? Y.add(p.pathname) : (Y = /* @__PURE__ */ new Set([p.pathname]), H.set(y.location.pathname, Y)), $ = {
        currentLocation: y.location,
        nextLocation: p
      };
    }
    ge(ne({}, g, {
      actionData: L,
      loaderData: P,
      historyAction: D,
      location: p,
      initialized: !0,
      navigation: xr,
      revalidation: "idle",
      restoreScrollPosition: bn(p, g.matches || y.matches),
      preventScrollReset: I,
      blockers: k
    }), {
      viewTransitionOpts: $,
      flushSync: B === !0
    }), D = fe.Pop, q = !1, F = !1, oe = !1, ae = !1, De = [];
  }
  async function bt(p, g) {
    if (typeof p == "number") {
      t.history.go(p);
      return;
    }
    let _ = jr(y.location, y.matches, l, u.v7_prependBasename, p, u.v7_relativeSplatPath, g == null ? void 0 : g.fromRouteId, g == null ? void 0 : g.relative), {
      path: N,
      submission: A,
      error: B
    } = Cn(u.v7_normalizeFormMethod, !1, _, g), z = y.location, L = Lt(y.location, N, g && g.state);
    L = ne({}, L, t.history.encodeLocation(L));
    let P = g && g.replace != null ? g.replace : void 0, k = fe.Push;
    P === !0 ? k = fe.Replace : P === !1 || A != null && Ae(A.formMethod) && A.formAction === y.location.pathname + y.location.search && (k = fe.Replace);
    let I = g && "preventScrollReset" in g ? g.preventScrollReset === !0 : void 0, $ = (g && g.flushSync) === !0, Y = vn({
      currentLocation: z,
      nextLocation: L,
      historyAction: k
    });
    if (Y) {
      Vt(Y, {
        state: "blocked",
        location: L,
        proceed() {
          Vt(Y, {
            state: "proceeding",
            proceed: void 0,
            reset: void 0,
            location: L
          }), bt(p, g);
        },
        reset() {
          let ye = new Map(y.blockers);
          ye.set(Y, Tt), ge({
            blockers: ye
          });
        }
      });
      return;
    }
    return await qe(k, L, {
      submission: A,
      // Send through the formData serialization error if we have one so we can
      // render at the right error boundary after we match routes
      pendingError: B,
      preventScrollReset: I,
      replace: g && g.replace,
      enableViewTransition: g && g.viewTransition,
      flushSync: $
    });
  }
  function Ut() {
    if (vr(), ge({
      revalidation: "loading"
    }), y.navigation.state !== "submitting") {
      if (y.navigation.state === "idle") {
        qe(y.historyAction, y.location, {
          startUninterruptedRevalidation: !0
        });
        return;
      }
      qe(D || y.historyAction, y.navigation.location, {
        overrideNavigation: y.navigation,
        // Proxy through any rending view transition
        enableViewTransition: F === !0
      });
    }
  }
  async function qe(p, g, _) {
    j && j.abort(), j = null, D = p, oe = (_ && _.startUninterruptedRevalidation) === !0, eo(y.location, y.matches), q = (_ && _.preventScrollReset) === !0, F = (_ && _.enableViewTransition) === !0;
    let N = d || a, A = _ && _.overrideNavigation, B = _ != null && _.initialHydration && y.matches && y.matches.length > 0 && !O ? (
      // `matchRoutes()` has already been called if we're in here via `router.initialize()`
      y.matches
    ) : ot(N, g, l), z = (_ && _.flushSync) === !0;
    if (B && y.initialized && !ae && ea(y.location, g) && !(_ && _.submission && Ae(_.submission.formMethod))) {
      ze(g, {
        matches: B
      }, {
        flushSync: z
      });
      return;
    }
    let L = zt(B, N, g.pathname);
    if (L.active && L.matches && (B = L.matches), !B) {
      let {
        error: ee,
        notFoundMatches: X,
        route: se
      } = _r(g.pathname);
      ze(g, {
        matches: X,
        loaderData: {},
        errors: {
          [se.id]: ee
        }
      }, {
        flushSync: z
      });
      return;
    }
    j = new AbortController();
    let P = pt(t.history, g, j.signal, _ && _.submission), k;
    if (_ && _.pendingError)
      k = [at(B).route.id, {
        type: Q.error,
        error: _.pendingError
      }];
    else if (_ && _.submission && Ae(_.submission.formMethod)) {
      let ee = await gr(P, g, _.submission, B, L.active, {
        replace: _.replace,
        flushSync: z
      });
      if (ee.shortCircuited)
        return;
      if (ee.pendingActionResult) {
        let [X, se] = ee.pendingActionResult;
        if (Oe(se) && Mt(se.error) && se.error.status === 404) {
          j = null, ze(g, {
            matches: ee.matches,
            loaderData: {},
            errors: {
              [X]: se.error
            }
          });
          return;
        }
      }
      B = ee.matches || B, k = ee.pendingActionResult, A = Sr(g, _.submission), z = !1, L.active = !1, P = pt(t.history, P.url, P.signal);
    }
    let {
      shortCircuited: I,
      matches: $,
      loaderData: Y,
      errors: ye
    } = await yr(P, g, B, L.active, A, _ && _.submission, _ && _.fetcherSubmission, _ && _.replace, _ && _.initialHydration === !0, z, k);
    I || (j = null, ze(g, ne({
      matches: $ || B
    }, Bn(k), {
      loaderData: Y,
      errors: ye
    })));
  }
  async function gr(p, g, _, N, A, B) {
    B === void 0 && (B = {}), vr();
    let z = aa(g, _);
    if (ge({
      navigation: z
    }, {
      flushSync: B.flushSync === !0
    }), A) {
      let k = await qt(N, g.pathname, p.signal);
      if (k.type === "aborted")
        return {
          shortCircuited: !0
        };
      if (k.type === "error") {
        let I = at(k.partialMatches).route.id;
        return {
          matches: k.partialMatches,
          pendingActionResult: [I, {
            type: Q.error,
            error: k.error
          }]
        };
      } else if (k.matches)
        N = k.matches;
      else {
        let {
          notFoundMatches: I,
          error: $,
          route: Y
        } = _r(g.pathname);
        return {
          matches: I,
          pendingActionResult: [Y.id, {
            type: Q.error,
            error: $
          }]
        };
      }
    }
    let L, P = At(N, g);
    if (!P.route.action && !P.route.lazy)
      L = {
        type: Q.error,
        error: xe(405, {
          method: p.method,
          pathname: g.pathname,
          routeId: P.route.id
        })
      };
    else if (L = (await Et("action", y, p, [P], N, null))[P.route.id], p.signal.aborted)
      return {
        shortCircuited: !0
      };
    if (ct(L)) {
      let k;
      return B && B.replace != null ? k = B.replace : k = Mn(L.response.headers.get("Location"), new URL(p.url), l) === y.location.pathname + y.location.search, await nt(p, L, !0, {
        submission: _,
        replace: k
      }), {
        shortCircuited: !0
      };
    }
    if (Qe(L))
      throw xe(400, {
        type: "defer-action"
      });
    if (Oe(L)) {
      let k = at(N, P.route.id);
      return (B && B.replace) !== !0 && (D = fe.Push), {
        matches: N,
        pendingActionResult: [k.route.id, L]
      };
    }
    return {
      matches: N,
      pendingActionResult: [P.route.id, L]
    };
  }
  async function yr(p, g, _, N, A, B, z, L, P, k, I) {
    let $ = A || Sr(g, B), Y = B || z || Vn($), ye = !oe && (!u.v7_partialHydration || !P);
    if (N) {
      if (ye) {
        let le = dn(I);
        ge(ne({
          navigation: $
        }, le !== void 0 ? {
          actionData: le
        } : {}), {
          flushSync: k
        });
      }
      let J = await qt(_, g.pathname, p.signal);
      if (J.type === "aborted")
        return {
          shortCircuited: !0
        };
      if (J.type === "error") {
        let le = at(J.partialMatches).route.id;
        return {
          matches: J.partialMatches,
          loaderData: {},
          errors: {
            [le]: J.error
          }
        };
      } else if (J.matches)
        _ = J.matches;
      else {
        let {
          error: le,
          notFoundMatches: ft,
          route: St
        } = _r(g.pathname);
        return {
          matches: ft,
          loaderData: {},
          errors: {
            [St.id]: le
          }
        };
      }
    }
    let ee = d || a, [X, se] = An(t.history, y, _, Y, g, u.v7_partialHydration && P === !0, u.v7_skipActionErrorRevalidation, ae, De, Ee, re, Z, W, ee, l, I);
    if (br((J) => !(_ && _.some((le) => le.route.id === J)) || X && X.some((le) => le.route.id === J)), T = ++je, X.length === 0 && se.length === 0) {
      let J = mn();
      return ze(g, ne({
        matches: _,
        loaderData: {},
        // Commit pending error if we're short circuiting
        errors: I && Oe(I[1]) ? {
          [I[0]]: I[1].error
        } : null
      }, Bn(I), J ? {
        fetchers: new Map(y.fetchers)
      } : {}), {
        flushSync: k
      }), {
        shortCircuited: !0
      };
    }
    if (ye) {
      let J = {};
      if (!N) {
        J.navigation = $;
        let le = dn(I);
        le !== void 0 && (J.actionData = le);
      }
      se.length > 0 && (J.fetchers = Ki(se)), ge(J, {
        flushSync: k
      });
    }
    se.forEach((J) => {
      Ge(J.key), J.controller && ie.set(J.key, J.controller);
    });
    let dt = () => se.forEach((J) => Ge(J.key));
    j && j.signal.addEventListener("abort", dt);
    let {
      loaderResults: wt,
      fetcherResults: $e
    } = await fn(y, _, X, se, p);
    if (p.signal.aborted)
      return {
        shortCircuited: !0
      };
    j && j.signal.removeEventListener("abort", dt), se.forEach((J) => ie.delete(J.key));
    let Ie = Wt(wt);
    if (Ie)
      return await nt(p, Ie.result, !0, {
        replace: L
      }), {
        shortCircuited: !0
      };
    if (Ie = Wt($e), Ie)
      return W.add(Ie.key), await nt(p, Ie.result, !0, {
        replace: L
      }), {
        shortCircuited: !0
      };
    let {
      loaderData: Er,
      errors: xt
    } = jn(y, _, wt, I, se, $e, Te);
    Te.forEach((J, le) => {
      J.subscribe((ft) => {
        (ft || J.done) && Te.delete(le);
      });
    }), u.v7_partialHydration && P && y.errors && (xt = ne({}, y.errors, xt));
    let it = mn(), Ht = gn(T), $t = it || Ht || se.length > 0;
    return ne({
      matches: _,
      loaderData: Er,
      errors: xt
    }, $t ? {
      fetchers: new Map(y.fetchers)
    } : {});
  }
  function dn(p) {
    if (p && !Oe(p[1]))
      return {
        [p[0]]: p[1].data
      };
    if (y.actionData)
      return Object.keys(y.actionData).length === 0 ? null : y.actionData;
  }
  function Ki(p) {
    return p.forEach((g) => {
      let _ = y.fetchers.get(g.key), N = Nt(void 0, _ ? _.data : void 0);
      y.fetchers.set(g.key, N);
    }), new Map(y.fetchers);
  }
  function Yi(p, g, _, N) {
    if (n)
      throw new Error("router.fetch() was called during the server render, but it shouldn't be. You are likely calling a useFetcher() method in the body of your component. Try moving it to a useEffect or a callback.");
    Ge(p);
    let A = (N && N.flushSync) === !0, B = d || a, z = jr(y.location, y.matches, l, u.v7_prependBasename, _, u.v7_relativeSplatPath, g, N == null ? void 0 : N.relative), L = ot(B, z, l), P = zt(L, B, z);
    if (P.active && P.matches && (L = P.matches), !L) {
      He(p, g, xe(404, {
        pathname: z
      }), {
        flushSync: A
      });
      return;
    }
    let {
      path: k,
      submission: I,
      error: $
    } = Cn(u.v7_normalizeFormMethod, !0, z, N);
    if ($) {
      He(p, g, $, {
        flushSync: A
      });
      return;
    }
    let Y = At(L, k), ye = (N && N.preventScrollReset) === !0;
    if (I && Ae(I.formMethod)) {
      Gi(p, g, k, Y, L, P.active, A, ye, I);
      return;
    }
    Z.set(p, {
      routeId: g,
      path: k
    }), Ji(p, g, k, Y, L, P.active, A, ye, I);
  }
  async function Gi(p, g, _, N, A, B, z, L, P) {
    vr(), Z.delete(p);
    function k(de) {
      if (!de.route.action && !de.route.lazy) {
        let ht = xe(405, {
          method: P.formMethod,
          pathname: _,
          routeId: g
        });
        return He(p, g, ht, {
          flushSync: z
        }), !0;
      }
      return !1;
    }
    if (!B && k(N))
      return;
    let I = y.fetchers.get(p);
    Ye(p, sa(P, I), {
      flushSync: z
    });
    let $ = new AbortController(), Y = pt(t.history, _, $.signal, P);
    if (B) {
      let de = await qt(A, new URL(Y.url).pathname, Y.signal, p);
      if (de.type === "aborted")
        return;
      if (de.type === "error") {
        He(p, g, de.error, {
          flushSync: z
        });
        return;
      } else if (de.matches) {
        if (A = de.matches, N = At(A, _), k(N))
          return;
      } else {
        He(p, g, xe(404, {
          pathname: _
        }), {
          flushSync: z
        });
        return;
      }
    }
    ie.set(p, $);
    let ye = je, X = (await Et("action", y, Y, [N], A, p))[N.route.id];
    if (Y.signal.aborted) {
      ie.get(p) === $ && ie.delete(p);
      return;
    }
    if (u.v7_fetcherPersist && re.has(p)) {
      if (ct(X) || Oe(X)) {
        Ye(p, Je(void 0));
        return;
      }
    } else {
      if (ct(X))
        if (ie.delete(p), T > ye) {
          Ye(p, Je(void 0));
          return;
        } else
          return W.add(p), Ye(p, Nt(P)), nt(Y, X, !1, {
            fetcherSubmission: P,
            preventScrollReset: L
          });
      if (Oe(X)) {
        He(p, g, X.error);
        return;
      }
    }
    if (Qe(X))
      throw xe(400, {
        type: "defer-action"
      });
    let se = y.navigation.location || y.location, dt = pt(t.history, se, $.signal), wt = d || a, $e = y.navigation.state !== "idle" ? ot(wt, y.navigation.location, l) : y.matches;
    U($e, "Didn't find any matches after fetcher action");
    let Ie = ++je;
    V.set(p, Ie);
    let Er = Nt(P, X.data);
    y.fetchers.set(p, Er);
    let [xt, it] = An(t.history, y, $e, P, se, !1, u.v7_skipActionErrorRevalidation, ae, De, Ee, re, Z, W, wt, l, [N.route.id, X]);
    it.filter((de) => de.key !== p).forEach((de) => {
      let ht = de.key, En = y.fetchers.get(ht), no = Nt(void 0, En ? En.data : void 0);
      y.fetchers.set(ht, no), Ge(ht), de.controller && ie.set(ht, de.controller);
    }), ge({
      fetchers: new Map(y.fetchers)
    });
    let Ht = () => it.forEach((de) => Ge(de.key));
    $.signal.addEventListener("abort", Ht);
    let {
      loaderResults: $t,
      fetcherResults: J
    } = await fn(y, $e, xt, it, dt);
    if ($.signal.aborted)
      return;
    $.signal.removeEventListener("abort", Ht), V.delete(p), ie.delete(p), it.forEach((de) => ie.delete(de.key));
    let le = Wt($t);
    if (le)
      return nt(dt, le.result, !1, {
        preventScrollReset: L
      });
    if (le = Wt(J), le)
      return W.add(le.key), nt(dt, le.result, !1, {
        preventScrollReset: L
      });
    let {
      loaderData: ft,
      errors: St
    } = jn(y, $e, $t, void 0, it, J, Te);
    if (y.fetchers.has(p)) {
      let de = Je(X.data);
      y.fetchers.set(p, de);
    }
    gn(Ie), y.navigation.state === "loading" && Ie > T ? (U(D, "Expected pending action"), j && j.abort(), ze(y.navigation.location, {
      matches: $e,
      loaderData: ft,
      errors: St,
      fetchers: new Map(y.fetchers)
    })) : (ge({
      errors: St,
      loaderData: In(y.loaderData, ft, $e, St),
      fetchers: new Map(y.fetchers)
    }), ae = !1);
  }
  async function Ji(p, g, _, N, A, B, z, L, P) {
    let k = y.fetchers.get(p);
    Ye(p, Nt(P, k ? k.data : void 0), {
      flushSync: z
    });
    let I = new AbortController(), $ = pt(t.history, _, I.signal);
    if (B) {
      let X = await qt(A, new URL($.url).pathname, $.signal, p);
      if (X.type === "aborted")
        return;
      if (X.type === "error") {
        He(p, g, X.error, {
          flushSync: z
        });
        return;
      } else if (X.matches)
        A = X.matches, N = At(A, _);
      else {
        He(p, g, xe(404, {
          pathname: _
        }), {
          flushSync: z
        });
        return;
      }
    }
    ie.set(p, I);
    let Y = je, ee = (await Et("loader", y, $, [N], A, p))[N.route.id];
    if (Qe(ee) && (ee = await Jr(ee, $.signal, !0) || ee), ie.get(p) === I && ie.delete(p), !$.signal.aborted) {
      if (re.has(p)) {
        Ye(p, Je(void 0));
        return;
      }
      if (ct(ee))
        if (T > Y) {
          Ye(p, Je(void 0));
          return;
        } else {
          W.add(p), await nt($, ee, !1, {
            preventScrollReset: L
          });
          return;
        }
      if (Oe(ee)) {
        He(p, g, ee.error);
        return;
      }
      U(!Qe(ee), "Unhandled fetcher deferred data"), Ye(p, Je(ee.data));
    }
  }
  async function nt(p, g, _, N) {
    let {
      submission: A,
      fetcherSubmission: B,
      preventScrollReset: z,
      replace: L
    } = N === void 0 ? {} : N;
    g.response.headers.has("X-Remix-Revalidate") && (ae = !0);
    let P = g.response.headers.get("Location");
    U(P, "Expected a Location header on the redirect Response"), P = Mn(P, new URL(p.url), l);
    let k = Lt(y.location, P, {
      _isRedirect: !0
    });
    if (r) {
      let X = !1;
      if (g.response.headers.has("X-Remix-Reload-Document"))
        X = !0;
      else if (Gr.test(P)) {
        const se = t.history.createURL(P);
        X = // Hard reload if it's an absolute URL to a new origin
        se.origin !== e.location.origin || // Hard reload if it's an absolute URL that does not match our basename
        Le(se.pathname, l) == null;
      }
      if (X) {
        L ? e.location.replace(P) : e.location.assign(P);
        return;
      }
    }
    j = null;
    let I = L === !0 || g.response.headers.has("X-Remix-Replace") ? fe.Replace : fe.Push, {
      formMethod: $,
      formAction: Y,
      formEncType: ye
    } = y.navigation;
    !A && !B && $ && Y && ye && (A = Vn(y.navigation));
    let ee = A || B;
    if (Vo.has(g.response.status) && ee && Ae(ee.formMethod))
      await qe(I, k, {
        submission: ne({}, ee, {
          formAction: P
        }),
        // Preserve these flags across redirects
        preventScrollReset: z || q,
        enableViewTransition: _ ? F : void 0
      });
    else {
      let X = Sr(k, A);
      await qe(I, k, {
        overrideNavigation: X,
        // Send fetcher submissions through for shouldRevalidate
        fetcherSubmission: B,
        // Preserve these flags across redirects
        preventScrollReset: z || q,
        enableViewTransition: _ ? F : void 0
      });
    }
  }
  async function Et(p, g, _, N, A, B) {
    let z, L = {};
    try {
      z = await Go(c, p, g, _, N, A, B, o, i);
    } catch (P) {
      return N.forEach((k) => {
        L[k.route.id] = {
          type: Q.error,
          error: P
        };
      }), L;
    }
    for (let [P, k] of Object.entries(z))
      if (ta(k)) {
        let I = k.result;
        L[P] = {
          type: Q.redirect,
          response: Qo(I, _, P, A, l, u.v7_relativeSplatPath)
        };
      } else
        L[P] = await Xo(k);
    return L;
  }
  async function fn(p, g, _, N, A) {
    let B = p.matches, z = Et("loader", p, A, _, g, null), L = Promise.all(N.map(async (I) => {
      if (I.matches && I.match && I.controller) {
        let Y = (await Et("loader", p, pt(t.history, I.path, I.controller.signal), [I.match], I.matches, I.key))[I.match.route.id];
        return {
          [I.key]: Y
        };
      } else
        return Promise.resolve({
          [I.key]: {
            type: Q.error,
            error: xe(404, {
              pathname: I.path
            })
          }
        });
    })), P = await z, k = (await L).reduce((I, $) => Object.assign(I, $), {});
    return await Promise.all([ia(g, P, A.signal, B, p.loaderData), oa(g, k, N)]), {
      loaderResults: P,
      fetcherResults: k
    };
  }
  function vr() {
    ae = !0, De.push(...br()), Z.forEach((p, g) => {
      ie.has(g) && Ee.add(g), Ge(g);
    });
  }
  function Ye(p, g, _) {
    _ === void 0 && (_ = {}), y.fetchers.set(p, g), ge({
      fetchers: new Map(y.fetchers)
    }, {
      flushSync: (_ && _.flushSync) === !0
    });
  }
  function He(p, g, _, N) {
    N === void 0 && (N = {});
    let A = at(y.matches, g);
    Ft(p), ge({
      errors: {
        [A.route.id]: _
      },
      fetchers: new Map(y.fetchers)
    }, {
      flushSync: (N && N.flushSync) === !0
    });
  }
  function hn(p) {
    return ve.set(p, (ve.get(p) || 0) + 1), re.has(p) && re.delete(p), y.fetchers.get(p) || zo;
  }
  function Ft(p) {
    let g = y.fetchers.get(p);
    ie.has(p) && !(g && g.state === "loading" && V.has(p)) && Ge(p), Z.delete(p), V.delete(p), W.delete(p), u.v7_fetcherPersist && re.delete(p), Ee.delete(p), y.fetchers.delete(p);
  }
  function Xi(p) {
    let g = (ve.get(p) || 0) - 1;
    g <= 0 ? (ve.delete(p), re.add(p), u.v7_fetcherPersist || Ft(p)) : ve.set(p, g), ge({
      fetchers: new Map(y.fetchers)
    });
  }
  function Ge(p) {
    let g = ie.get(p);
    g && (g.abort(), ie.delete(p));
  }
  function pn(p) {
    for (let g of p) {
      let _ = hn(g), N = Je(_.data);
      y.fetchers.set(g, N);
    }
  }
  function mn() {
    let p = [], g = !1;
    for (let _ of W) {
      let N = y.fetchers.get(_);
      U(N, "Expected fetcher: " + _), N.state === "loading" && (W.delete(_), p.push(_), g = !0);
    }
    return pn(p), g;
  }
  function gn(p) {
    let g = [];
    for (let [_, N] of V)
      if (N < p) {
        let A = y.fetchers.get(_);
        U(A, "Expected fetcher: " + _), A.state === "loading" && (Ge(_), V.delete(_), g.push(_));
      }
    return pn(g), g.length > 0;
  }
  function Qi(p, g) {
    let _ = y.blockers.get(p) || Tt;
    return we.get(p) !== g && we.set(p, g), _;
  }
  function yn(p) {
    y.blockers.delete(p), we.delete(p);
  }
  function Vt(p, g) {
    let _ = y.blockers.get(p) || Tt;
    U(_.state === "unblocked" && g.state === "blocked" || _.state === "blocked" && g.state === "blocked" || _.state === "blocked" && g.state === "proceeding" || _.state === "blocked" && g.state === "unblocked" || _.state === "proceeding" && g.state === "unblocked", "Invalid blocker state transition: " + _.state + " -> " + g.state);
    let N = new Map(y.blockers);
    N.set(p, g), ge({
      blockers: N
    });
  }
  function vn(p) {
    let {
      currentLocation: g,
      nextLocation: _,
      historyAction: N
    } = p;
    if (we.size === 0)
      return;
    we.size > 1 && me(!1, "A router only supports one blocker at a time");
    let A = Array.from(we.entries()), [B, z] = A[A.length - 1], L = y.blockers.get(B);
    if (!(L && L.state === "proceeding") && z({
      currentLocation: g,
      nextLocation: _,
      historyAction: N
    }))
      return B;
  }
  function _r(p) {
    let g = xe(404, {
      pathname: p
    }), _ = d || a, {
      matches: N,
      route: A
    } = Un(_);
    return br(), {
      notFoundMatches: N,
      route: A,
      error: g
    };
  }
  function br(p) {
    let g = [];
    return Te.forEach((_, N) => {
      (!p || p(N)) && (_.cancel(), g.push(N), Te.delete(N));
    }), g;
  }
  function Zi(p, g, _) {
    if (b = p, w = g, v = _ || null, !E && y.navigation === xr) {
      E = !0;
      let N = bn(y.location, y.matches);
      N != null && ge({
        restoreScrollPosition: N
      });
    }
    return () => {
      b = null, w = null, v = null;
    };
  }
  function _n(p, g) {
    return v && v(p, g.map((N) => _o(N, y.loaderData))) || p.key;
  }
  function eo(p, g) {
    if (b && w) {
      let _ = _n(p, g);
      b[_] = w();
    }
  }
  function bn(p, g) {
    if (b) {
      let _ = _n(p, g), N = b[_];
      if (typeof N == "number")
        return N;
    }
    return null;
  }
  function zt(p, g, _) {
    if (h)
      if (p) {
        if (Object.keys(p[0].params).length > 0)
          return {
            active: !0,
            matches: Xt(g, _, l, !0)
          };
      } else
        return {
          active: !0,
          matches: Xt(g, _, l, !0) || []
        };
    return {
      active: !1,
      matches: null
    };
  }
  async function qt(p, g, _, N) {
    if (!h)
      return {
        type: "success",
        matches: p
      };
    let A = p;
    for (; ; ) {
      let B = d == null, z = d || a, L = o;
      try {
        await h({
          signal: _,
          path: g,
          matches: A,
          fetcherKey: N,
          patch: (I, $) => {
            _.aborted || Ln(I, $, z, L, i);
          }
        });
      } catch (I) {
        return {
          type: "error",
          error: I,
          partialMatches: A
        };
      } finally {
        B && !_.aborted && (a = [...a]);
      }
      if (_.aborted)
        return {
          type: "aborted"
        };
      let P = ot(z, g, l);
      if (P)
        return {
          type: "success",
          matches: P
        };
      let k = Xt(z, g, l, !0);
      if (!k || A.length === k.length && A.every((I, $) => I.route.id === k[$].route.id))
        return {
          type: "success",
          matches: null
        };
      A = k;
    }
  }
  function to(p) {
    o = {}, d = or(p, i, void 0, o);
  }
  function ro(p, g) {
    let _ = d == null;
    Ln(p, g, d || a, o, i), _ && (a = [...a], ge({}));
  }
  return M = {
    get basename() {
      return l;
    },
    get future() {
      return u;
    },
    get state() {
      return y;
    },
    get routes() {
      return a;
    },
    get window() {
      return e;
    },
    initialize: Fe,
    subscribe: Ve,
    enableScrollRestoration: Zi,
    navigate: bt,
    fetch: Yi,
    revalidate: Ut,
    // Passthrough to history-aware createHref used by useHref so we get proper
    // hash-aware URLs in DOM paths
    createHref: (p) => t.history.createHref(p),
    encodeLocation: (p) => t.history.encodeLocation(p),
    getFetcher: hn,
    deleteFetcher: Xi,
    dispose: Ke,
    getBlocker: Qi,
    deleteBlocker: yn,
    patchRoutes: ro,
    _internalFetchControllers: ie,
    _internalActiveDeferreds: Te,
    // TODO: Remove setRoutes, it's temporary to avoid dealing with
    // updating the tree while validating the update algorithm.
    _internalSetRoutes: to
  }, M;
}
function $o(t) {
  return t != null && ("formData" in t && t.formData != null || "body" in t && t.body !== void 0);
}
function jr(t, e, r, n, i, o, a, d) {
  let l, c;
  if (a) {
    l = [];
    for (let u of e)
      if (l.push(u), u.route.id === a) {
        c = u;
        break;
      }
  } else
    l = e, c = e[e.length - 1];
  let h = Yr(i || ".", Kr(l, o), Le(t.pathname, r) || t.pathname, d === "path");
  if (i == null && (h.search = t.search, h.hash = t.hash), (i == null || i === "" || i === ".") && c) {
    let u = Xr(h.search);
    if (c.route.index && !u)
      h.search = h.search ? h.search.replace(/^\?/, "?index&") : "?index";
    else if (!c.route.index && u) {
      let s = new URLSearchParams(h.search), f = s.getAll("index");
      s.delete("index"), f.filter((v) => v).forEach((v) => s.append("index", v));
      let b = s.toString();
      h.search = b ? "?" + b : "";
    }
  }
  return n && r !== "/" && (h.pathname = h.pathname === "/" ? r : Be([r, h.pathname])), et(h);
}
function Cn(t, e, r, n) {
  if (!n || !$o(n))
    return {
      path: r
    };
  if (n.formMethod && !na(n.formMethod))
    return {
      path: r,
      error: xe(405, {
        method: n.formMethod
      })
    };
  let i = () => ({
    path: r,
    error: xe(400, {
      type: "invalid-body"
    })
  }), o = n.formMethod || "get", a = t ? o.toUpperCase() : o.toLowerCase(), d = bi(r);
  if (n.body !== void 0) {
    if (n.formEncType === "text/plain") {
      if (!Ae(a))
        return i();
      let s = typeof n.body == "string" ? n.body : n.body instanceof FormData || n.body instanceof URLSearchParams ? (
        // https://html.spec.whatwg.org/multipage/form-control-infrastructure.html#plain-text-form-data
        Array.from(n.body.entries()).reduce((f, b) => {
          let [v, w] = b;
          return "" + f + v + "=" + w + `
`;
        }, "")
      ) : String(n.body);
      return {
        path: r,
        submission: {
          formMethod: a,
          formAction: d,
          formEncType: n.formEncType,
          formData: void 0,
          json: void 0,
          text: s
        }
      };
    } else if (n.formEncType === "application/json") {
      if (!Ae(a))
        return i();
      try {
        let s = typeof n.body == "string" ? JSON.parse(n.body) : n.body;
        return {
          path: r,
          submission: {
            formMethod: a,
            formAction: d,
            formEncType: n.formEncType,
            formData: void 0,
            json: s,
            text: void 0
          }
        };
      } catch {
        return i();
      }
    }
  }
  U(typeof FormData == "function", "FormData is not available in this environment");
  let l, c;
  if (n.formData)
    l = Br(n.formData), c = n.formData;
  else if (n.body instanceof FormData)
    l = Br(n.body), c = n.body;
  else if (n.body instanceof URLSearchParams)
    l = n.body, c = Pn(l);
  else if (n.body == null)
    l = new URLSearchParams(), c = new FormData();
  else
    try {
      l = new URLSearchParams(n.body), c = Pn(l);
    } catch {
      return i();
    }
  let h = {
    formMethod: a,
    formAction: d,
    formEncType: n && n.formEncType || "application/x-www-form-urlencoded",
    formData: c,
    json: void 0,
    text: void 0
  };
  if (Ae(h.formMethod))
    return {
      path: r,
      submission: h
    };
  let u = rt(r);
  return e && u.search && Xr(u.search) && l.append("index", ""), u.search = "?" + l, {
    path: et(u),
    submission: h
  };
}
function Dn(t, e, r) {
  r === void 0 && (r = !1);
  let n = t.findIndex((i) => i.route.id === e);
  return n >= 0 ? t.slice(0, r ? n + 1 : n) : t;
}
function An(t, e, r, n, i, o, a, d, l, c, h, u, s, f, b, v) {
  let w = v ? Oe(v[1]) ? v[1].error : v[1].data : void 0, E = t.createURL(e.location), m = t.createURL(i), O = r;
  o && e.errors ? O = Dn(r, Object.keys(e.errors)[0], !0) : v && Oe(v[1]) && (O = Dn(r, v[0]));
  let x = v ? v[1].statusCode : void 0, C = a && x && x >= 400, M = O.filter((D, q) => {
    let {
      route: j
    } = D;
    if (j.lazy)
      return !0;
    if (j.loader == null)
      return !1;
    if (o)
      return Ir(j, e.loaderData, e.errors);
    if (Wo(e.loaderData, e.matches[q], D) || l.some((ue) => ue === D.route.id))
      return !0;
    let F = e.matches[q], H = D;
    return kn(D, ne({
      currentUrl: E,
      currentParams: F.params,
      nextUrl: m,
      nextParams: H.params
    }, n, {
      actionResult: w,
      actionStatus: x,
      defaultShouldRevalidate: C ? !1 : (
        // Forced revalidation due to submission, useRevalidator, or X-Remix-Revalidate
        d || E.pathname + E.search === m.pathname + m.search || // Search params affect all loaders
        E.search !== m.search || vi(F, H)
      )
    }));
  }), y = [];
  return u.forEach((D, q) => {
    if (o || !r.some((oe) => oe.route.id === D.routeId) || h.has(q))
      return;
    let j = ot(f, D.path, b);
    if (!j) {
      y.push({
        key: q,
        routeId: D.routeId,
        path: D.path,
        matches: null,
        match: null,
        controller: null
      });
      return;
    }
    let F = e.fetchers.get(q), H = At(j, D.path), ue = !1;
    s.has(q) ? ue = !1 : c.has(q) ? (c.delete(q), ue = !0) : F && F.state !== "idle" && F.data === void 0 ? ue = d : ue = kn(H, ne({
      currentUrl: E,
      currentParams: e.matches[e.matches.length - 1].params,
      nextUrl: m,
      nextParams: r[r.length - 1].params
    }, n, {
      actionResult: w,
      actionStatus: x,
      defaultShouldRevalidate: C ? !1 : d
    })), ue && y.push({
      key: q,
      routeId: D.routeId,
      path: D.path,
      matches: j,
      match: H,
      controller: new AbortController()
    });
  }), [M, y];
}
function Ir(t, e, r) {
  if (t.lazy)
    return !0;
  if (!t.loader)
    return !1;
  let n = e != null && e[t.id] !== void 0, i = r != null && r[t.id] !== void 0;
  return !n && i ? !1 : typeof t.loader == "function" && t.loader.hydrate === !0 ? !0 : !n && !i;
}
function Wo(t, e, r) {
  let n = (
    // [a] -> [a, b]
    !e || // [a, b] -> [a, c]
    r.route.id !== e.route.id
  ), i = t[r.route.id] === void 0;
  return n || i;
}
function vi(t, e) {
  let r = t.route.path;
  return (
    // param change for this match, /users/123 -> /users/456
    t.pathname !== e.pathname || // splat param changed, which is not present in match.path
    // e.g. /files/images/avatar.jpg -> files/finances.xls
    r != null && r.endsWith("*") && t.params["*"] !== e.params["*"]
  );
}
function kn(t, e) {
  if (t.route.shouldRevalidate) {
    let r = t.route.shouldRevalidate(e);
    if (typeof r == "boolean")
      return r;
  }
  return e.defaultShouldRevalidate;
}
function Ln(t, e, r, n, i) {
  var o;
  let a;
  if (t) {
    let c = n[t];
    U(c, "No route found to patch children into: routeId = " + t), c.children || (c.children = []), a = c.children;
  } else
    a = r;
  let d = e.filter((c) => !a.some((h) => _i(c, h))), l = or(d, i, [t || "_", "patch", String(((o = a) == null ? void 0 : o.length) || "0")], n);
  a.push(...l);
}
function _i(t, e) {
  return "id" in t && "id" in e && t.id === e.id ? !0 : t.index === e.index && t.path === e.path && t.caseSensitive === e.caseSensitive ? (!t.children || t.children.length === 0) && (!e.children || e.children.length === 0) ? !0 : t.children.every((r, n) => {
    var i;
    return (i = e.children) == null ? void 0 : i.some((o) => _i(r, o));
  }) : !1;
}
async function Ko(t, e, r) {
  if (!t.lazy)
    return;
  let n = await t.lazy();
  if (!t.lazy)
    return;
  let i = r[t.id];
  U(i, "No route found in manifest");
  let o = {};
  for (let a in n) {
    let l = i[a] !== void 0 && // This property isn't static since it should always be updated based
    // on the route updates
    a !== "hasErrorBoundary";
    me(!l, 'Route "' + i.id + '" has a static property "' + a + '" defined but its lazy function is also returning a value for this property. ' + ('The lazy route property "' + a + '" will be ignored.')), !l && !yo.has(a) && (o[a] = n[a]);
  }
  Object.assign(i, o), Object.assign(i, ne({}, e(i), {
    lazy: void 0
  }));
}
async function Yo(t) {
  let {
    matches: e
  } = t, r = e.filter((i) => i.shouldLoad);
  return (await Promise.all(r.map((i) => i.resolve()))).reduce((i, o, a) => Object.assign(i, {
    [r[a].route.id]: o
  }), {});
}
async function Go(t, e, r, n, i, o, a, d, l, c) {
  let h = o.map((f) => f.route.lazy ? Ko(f.route, l, d) : void 0), u = o.map((f, b) => {
    let v = h[b], w = i.some((m) => m.route.id === f.route.id);
    return ne({}, f, {
      shouldLoad: w,
      resolve: async (m) => (m && n.method === "GET" && (f.route.lazy || f.route.loader) && (w = !0), w ? Jo(e, n, f, v, m, c) : Promise.resolve({
        type: Q.data,
        result: void 0
      }))
    });
  }), s = await t({
    matches: u,
    request: n,
    params: o[0].params,
    fetcherKey: a,
    context: c
  });
  try {
    await Promise.all(h);
  } catch {
  }
  return s;
}
async function Jo(t, e, r, n, i, o) {
  let a, d, l = (c) => {
    let h, u = new Promise((b, v) => h = v);
    d = () => h(), e.signal.addEventListener("abort", d);
    let s = (b) => typeof c != "function" ? Promise.reject(new Error("You cannot call the handler for a route which defines a boolean " + ('"' + t + '" [routeId: ' + r.route.id + "]"))) : c({
      request: e,
      params: r.params,
      context: o
    }, ...b !== void 0 ? [b] : []), f = (async () => {
      try {
        return {
          type: "data",
          result: await (i ? i((v) => s(v)) : s())
        };
      } catch (b) {
        return {
          type: "error",
          result: b
        };
      }
    })();
    return Promise.race([f, u]);
  };
  try {
    let c = r.route[t];
    if (n)
      if (c) {
        let h, [u] = await Promise.all([
          // If the handler throws, don't let it immediately bubble out,
          // since we need to let the lazy() execution finish so we know if this
          // route has a boundary that can handle the error
          l(c).catch((s) => {
            h = s;
          }),
          n
        ]);
        if (h !== void 0)
          throw h;
        a = u;
      } else if (await n, c = r.route[t], c)
        a = await l(c);
      else if (t === "action") {
        let h = new URL(e.url), u = h.pathname + h.search;
        throw xe(405, {
          method: e.method,
          pathname: u,
          routeId: r.route.id
        });
      } else
        return {
          type: Q.data,
          result: void 0
        };
    else if (c)
      a = await l(c);
    else {
      let h = new URL(e.url), u = h.pathname + h.search;
      throw xe(404, {
        pathname: u
      });
    }
    U(a.result !== void 0, "You defined " + (t === "action" ? "an action" : "a loader") + " for route " + ('"' + r.route.id + "\" but didn't return anything from your `" + t + "` ") + "function. Please return a value or `null`.");
  } catch (c) {
    return {
      type: Q.error,
      result: c
    };
  } finally {
    d && e.signal.removeEventListener("abort", d);
  }
  return a;
}
async function Xo(t) {
  let {
    result: e,
    type: r
  } = t;
  if (Ei(e)) {
    let u;
    try {
      let s = e.headers.get("Content-Type");
      s && /\bapplication\/json\b/.test(s) ? e.body == null ? u = null : u = await e.json() : u = await e.text();
    } catch (s) {
      return {
        type: Q.error,
        error: s
      };
    }
    return r === Q.error ? {
      type: Q.error,
      error: new sr(e.status, e.statusText, u),
      statusCode: e.status,
      headers: e.headers
    } : {
      type: Q.data,
      data: u,
      statusCode: e.status,
      headers: e.headers
    };
  }
  if (r === Q.error) {
    if (Fn(e)) {
      var n, i;
      if (e.data instanceof Error) {
        var o, a;
        return {
          type: Q.error,
          error: e.data,
          statusCode: (o = e.init) == null ? void 0 : o.status,
          headers: (a = e.init) != null && a.headers ? new Headers(e.init.headers) : void 0
        };
      }
      return {
        type: Q.error,
        error: new sr(((n = e.init) == null ? void 0 : n.status) || 500, void 0, e.data),
        statusCode: Mt(e) ? e.status : void 0,
        headers: (i = e.init) != null && i.headers ? new Headers(e.init.headers) : void 0
      };
    }
    return {
      type: Q.error,
      error: e,
      statusCode: Mt(e) ? e.status : void 0
    };
  }
  if (ra(e)) {
    var d, l;
    return {
      type: Q.deferred,
      deferredData: e,
      statusCode: (d = e.init) == null ? void 0 : d.status,
      headers: ((l = e.init) == null ? void 0 : l.headers) && new Headers(e.init.headers)
    };
  }
  if (Fn(e)) {
    var c, h;
    return {
      type: Q.data,
      data: e.data,
      statusCode: (c = e.init) == null ? void 0 : c.status,
      headers: (h = e.init) != null && h.headers ? new Headers(e.init.headers) : void 0
    };
  }
  return {
    type: Q.data,
    data: e
  };
}
function Qo(t, e, r, n, i, o) {
  let a = t.headers.get("Location");
  if (U(a, "Redirects returned/thrown from loaders/actions must have a Location header"), !Gr.test(a)) {
    let d = n.slice(0, n.findIndex((l) => l.route.id === r) + 1);
    a = jr(new URL(e.url), d, i, !0, a, o), t.headers.set("Location", a);
  }
  return t;
}
function Mn(t, e, r) {
  if (Gr.test(t)) {
    let n = t, i = n.startsWith("//") ? new URL(e.protocol + n) : new URL(n), o = Le(i.pathname, r) != null;
    if (i.origin === e.origin && o)
      return i.pathname + i.search + i.hash;
  }
  return t;
}
function pt(t, e, r, n) {
  let i = t.createURL(bi(e)).toString(), o = {
    signal: r
  };
  if (n && Ae(n.formMethod)) {
    let {
      formMethod: a,
      formEncType: d
    } = n;
    o.method = a.toUpperCase(), d === "application/json" ? (o.headers = new Headers({
      "Content-Type": d
    }), o.body = JSON.stringify(n.json)) : d === "text/plain" ? o.body = n.text : d === "application/x-www-form-urlencoded" && n.formData ? o.body = Br(n.formData) : o.body = n.formData;
  }
  return new Request(i, o);
}
function Br(t) {
  let e = new URLSearchParams();
  for (let [r, n] of t.entries())
    e.append(r, typeof n == "string" ? n : n.name);
  return e;
}
function Pn(t) {
  let e = new FormData();
  for (let [r, n] of t.entries())
    e.append(r, n);
  return e;
}
function Zo(t, e, r, n, i) {
  let o = {}, a = null, d, l = !1, c = {}, h = r && Oe(r[1]) ? r[1].error : void 0;
  return t.forEach((u) => {
    if (!(u.route.id in e))
      return;
    let s = u.route.id, f = e[s];
    if (U(!ct(f), "Cannot handle redirect results in processLoaderData"), Oe(f)) {
      let b = f.error;
      h !== void 0 && (b = h, h = void 0), a = a || {};
      {
        let v = at(t, s);
        a[v.route.id] == null && (a[v.route.id] = b);
      }
      o[s] = void 0, l || (l = !0, d = Mt(f.error) ? f.error.status : 500), f.headers && (c[s] = f.headers);
    } else
      Qe(f) ? (n.set(s, f.deferredData), o[s] = f.deferredData.data, f.statusCode != null && f.statusCode !== 200 && !l && (d = f.statusCode), f.headers && (c[s] = f.headers)) : (o[s] = f.data, f.statusCode && f.statusCode !== 200 && !l && (d = f.statusCode), f.headers && (c[s] = f.headers));
  }), h !== void 0 && r && (a = {
    [r[0]]: h
  }, o[r[0]] = void 0), {
    loaderData: o,
    errors: a,
    statusCode: d || 200,
    loaderHeaders: c
  };
}
function jn(t, e, r, n, i, o, a) {
  let {
    loaderData: d,
    errors: l
  } = Zo(e, r, n, a);
  return i.forEach((c) => {
    let {
      key: h,
      match: u,
      controller: s
    } = c, f = o[h];
    if (U(f, "Did not find corresponding fetcher result"), !(s && s.signal.aborted))
      if (Oe(f)) {
        let b = at(t.matches, u == null ? void 0 : u.route.id);
        l && l[b.route.id] || (l = ne({}, l, {
          [b.route.id]: f.error
        })), t.fetchers.delete(h);
      } else if (ct(f))
        U(!1, "Unhandled fetcher revalidation redirect");
      else if (Qe(f))
        U(!1, "Unhandled fetcher deferred data");
      else {
        let b = Je(f.data);
        t.fetchers.set(h, b);
      }
  }), {
    loaderData: d,
    errors: l
  };
}
function In(t, e, r, n) {
  let i = ne({}, e);
  for (let o of r) {
    let a = o.route.id;
    if (e.hasOwnProperty(a) ? e[a] !== void 0 && (i[a] = e[a]) : t[a] !== void 0 && o.route.loader && (i[a] = t[a]), n && n.hasOwnProperty(a))
      break;
  }
  return i;
}
function Bn(t) {
  return t ? Oe(t[1]) ? {
    // Clear out prior actionData on errors
    actionData: {}
  } : {
    actionData: {
      [t[0]]: t[1].data
    }
  } : {};
}
function at(t, e) {
  return (e ? t.slice(0, t.findIndex((n) => n.route.id === e) + 1) : [...t]).reverse().find((n) => n.route.hasErrorBoundary === !0) || t[0];
}
function Un(t) {
  let e = t.length === 1 ? t[0] : t.find((r) => r.index || !r.path || r.path === "/") || {
    id: "__shim-error-route__"
  };
  return {
    matches: [{
      params: {},
      pathname: "",
      pathnameBase: "",
      route: e
    }],
    route: e
  };
}
function xe(t, e) {
  let {
    pathname: r,
    routeId: n,
    method: i,
    type: o,
    message: a
  } = e === void 0 ? {} : e, d = "Unknown Server Error", l = "Unknown @remix-run/router error";
  return t === 400 ? (d = "Bad Request", i && r && n ? l = "You made a " + i + ' request to "' + r + '" but ' + ('did not provide a `loader` for route "' + n + '", ') + "so there is no way to handle the request." : o === "defer-action" ? l = "defer() is not supported in actions" : o === "invalid-body" && (l = "Unable to encode submission body")) : t === 403 ? (d = "Forbidden", l = 'Route "' + n + '" does not match URL "' + r + '"') : t === 404 ? (d = "Not Found", l = 'No route matches URL "' + r + '"') : t === 405 && (d = "Method Not Allowed", i && r && n ? l = "You made a " + i.toUpperCase() + ' request to "' + r + '" but ' + ('did not provide an `action` for route "' + n + '", ') + "so there is no way to handle the request." : i && (l = 'Invalid request method "' + i.toUpperCase() + '"')), new sr(t || 500, d, new Error(l), !0);
}
function Wt(t) {
  let e = Object.entries(t);
  for (let r = e.length - 1; r >= 0; r--) {
    let [n, i] = e[r];
    if (ct(i))
      return {
        key: n,
        result: i
      };
  }
}
function bi(t) {
  let e = typeof t == "string" ? rt(t) : t;
  return et(ne({}, e, {
    hash: ""
  }));
}
function ea(t, e) {
  return t.pathname !== e.pathname || t.search !== e.search ? !1 : t.hash === "" ? e.hash !== "" : t.hash === e.hash ? !0 : e.hash !== "";
}
function ta(t) {
  return Ei(t.result) && Fo.has(t.result.status);
}
function Qe(t) {
  return t.type === Q.deferred;
}
function Oe(t) {
  return t.type === Q.error;
}
function ct(t) {
  return (t && t.type) === Q.redirect;
}
function Fn(t) {
  return typeof t == "object" && t != null && "type" in t && "data" in t && "init" in t && t.type === "DataWithResponseInit";
}
function ra(t) {
  let e = t;
  return e && typeof e == "object" && typeof e.data == "object" && typeof e.subscribe == "function" && typeof e.cancel == "function" && typeof e.resolveData == "function";
}
function Ei(t) {
  return t != null && typeof t.status == "number" && typeof t.statusText == "string" && typeof t.headers == "object" && typeof t.body < "u";
}
function na(t) {
  return Uo.has(t.toLowerCase());
}
function Ae(t) {
  return Io.has(t.toLowerCase());
}
async function ia(t, e, r, n, i) {
  let o = Object.entries(e);
  for (let a = 0; a < o.length; a++) {
    let [d, l] = o[a], c = t.find((s) => (s == null ? void 0 : s.route.id) === d);
    if (!c)
      continue;
    let h = n.find((s) => s.route.id === c.route.id), u = h != null && !vi(h, c) && (i && i[c.route.id]) !== void 0;
    Qe(l) && u && await Jr(l, r, !1).then((s) => {
      s && (e[d] = s);
    });
  }
}
async function oa(t, e, r) {
  for (let n = 0; n < r.length; n++) {
    let {
      key: i,
      routeId: o,
      controller: a
    } = r[n], d = e[i];
    t.find((c) => (c == null ? void 0 : c.route.id) === o) && Qe(d) && (U(a, "Expected an AbortController for revalidating fetcher deferred result"), await Jr(d, a.signal, !0).then((c) => {
      c && (e[i] = c);
    }));
  }
}
async function Jr(t, e, r) {
  if (r === void 0 && (r = !1), !await t.deferredData.resolveData(e)) {
    if (r)
      try {
        return {
          type: Q.data,
          data: t.deferredData.unwrappedData
        };
      } catch (i) {
        return {
          type: Q.error,
          error: i
        };
      }
    return {
      type: Q.data,
      data: t.deferredData.data
    };
  }
}
function Xr(t) {
  return new URLSearchParams(t).getAll("index").some((e) => e === "");
}
function At(t, e) {
  let r = typeof e == "string" ? rt(e).search : e.search;
  if (t[t.length - 1].route.index && Xr(r || ""))
    return t[t.length - 1];
  let n = mi(t);
  return n[n.length - 1];
}
function Vn(t) {
  let {
    formMethod: e,
    formAction: r,
    formEncType: n,
    text: i,
    formData: o,
    json: a
  } = t;
  if (!(!e || !r || !n)) {
    if (i != null)
      return {
        formMethod: e,
        formAction: r,
        formEncType: n,
        formData: void 0,
        json: void 0,
        text: i
      };
    if (o != null)
      return {
        formMethod: e,
        formAction: r,
        formEncType: n,
        formData: o,
        json: void 0,
        text: void 0
      };
    if (a !== void 0)
      return {
        formMethod: e,
        formAction: r,
        formEncType: n,
        formData: void 0,
        json: a,
        text: void 0
      };
  }
}
function Sr(t, e) {
  return e ? {
    state: "loading",
    location: t,
    formMethod: e.formMethod,
    formAction: e.formAction,
    formEncType: e.formEncType,
    formData: e.formData,
    json: e.json,
    text: e.text
  } : {
    state: "loading",
    location: t,
    formMethod: void 0,
    formAction: void 0,
    formEncType: void 0,
    formData: void 0,
    json: void 0,
    text: void 0
  };
}
function aa(t, e) {
  return {
    state: "submitting",
    location: t,
    formMethod: e.formMethod,
    formAction: e.formAction,
    formEncType: e.formEncType,
    formData: e.formData,
    json: e.json,
    text: e.text
  };
}
function Nt(t, e) {
  return t ? {
    state: "loading",
    formMethod: t.formMethod,
    formAction: t.formAction,
    formEncType: t.formEncType,
    formData: t.formData,
    json: t.json,
    text: t.text,
    data: e
  } : {
    state: "loading",
    formMethod: void 0,
    formAction: void 0,
    formEncType: void 0,
    formData: void 0,
    json: void 0,
    text: void 0,
    data: e
  };
}
function sa(t, e) {
  return {
    state: "submitting",
    formMethod: t.formMethod,
    formAction: t.formAction,
    formEncType: t.formEncType,
    formData: t.formData,
    json: t.json,
    text: t.text,
    data: e ? e.data : void 0
  };
}
function Je(t) {
  return {
    state: "idle",
    formMethod: void 0,
    formAction: void 0,
    formEncType: void 0,
    formData: void 0,
    json: void 0,
    text: void 0,
    data: t
  };
}
function la(t, e) {
  try {
    let r = t.sessionStorage.getItem(yi);
    if (r) {
      let n = JSON.parse(r);
      for (let [i, o] of Object.entries(n || {}))
        o && Array.isArray(o) && e.set(i, new Set(o || []));
    }
  } catch {
  }
}
function ca(t, e) {
  if (e.size > 0) {
    let r = {};
    for (let [n, i] of e)
      r[n] = [...i];
    try {
      t.sessionStorage.setItem(yi, JSON.stringify(r));
    } catch (n) {
      me(!1, "Failed to save applied view transitions in sessionStorage (" + n + ").");
    }
  }
}
/**
 * React Router v6.30.1
 *
 * Copyright (c) Remix Software Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.md file in the root directory of this source tree.
 *
 * @license MIT
 */
function lr() {
  return lr = Object.assign ? Object.assign.bind() : function(t) {
    for (var e = 1; e < arguments.length; e++) {
      var r = arguments[e];
      for (var n in r)
        Object.prototype.hasOwnProperty.call(r, n) && (t[n] = r[n]);
    }
    return t;
  }, lr.apply(this, arguments);
}
const vt = /* @__PURE__ */ R.createContext(null);
process.env.NODE_ENV !== "production" && (vt.displayName = "DataRouter");
const ur = /* @__PURE__ */ R.createContext(null);
process.env.NODE_ENV !== "production" && (ur.displayName = "DataRouterState");
const ua = /* @__PURE__ */ R.createContext(null);
process.env.NODE_ENV !== "production" && (ua.displayName = "Await");
const Me = /* @__PURE__ */ R.createContext(null);
process.env.NODE_ENV !== "production" && (Me.displayName = "Navigation");
const dr = /* @__PURE__ */ R.createContext(null);
process.env.NODE_ENV !== "production" && (dr.displayName = "Location");
const Pe = /* @__PURE__ */ R.createContext({
  outlet: null,
  matches: [],
  isDataRoute: !1
});
process.env.NODE_ENV !== "production" && (Pe.displayName = "Route");
const Qr = /* @__PURE__ */ R.createContext(null);
process.env.NODE_ENV !== "production" && (Qr.displayName = "RouteError");
function da(t, e) {
  let {
    relative: r
  } = e === void 0 ? {} : e;
  jt() || (process.env.NODE_ENV !== "production" ? U(
    !1,
    // TODO: This error is probably because they somehow have 2 versions of the
    // router loaded. We can help them understand how to avoid that.
    "useHref() may be used only in the context of a <Router> component."
  ) : U(!1));
  let {
    basename: n,
    navigator: i
  } = R.useContext(Me), {
    hash: o,
    pathname: a,
    search: d
  } = It(t, {
    relative: r
  }), l = a;
  return n !== "/" && (l = a === "/" ? n : Be([n, a])), i.createHref({
    pathname: l,
    search: d,
    hash: o
  });
}
function jt() {
  return R.useContext(dr) != null;
}
function ut() {
  return jt() || (process.env.NODE_ENV !== "production" ? U(
    !1,
    // TODO: This error is probably because they somehow have 2 versions of the
    // router loaded. We can help them understand how to avoid that.
    "useLocation() may be used only in the context of a <Router> component."
  ) : U(!1)), R.useContext(dr).location;
}
const wi = "You should call navigate() in a React.useEffect(), not when your component is first rendered.";
function xi(t) {
  R.useContext(Me).static || R.useLayoutEffect(t);
}
function Si() {
  let {
    isDataRoute: t
  } = R.useContext(Pe);
  return t ? Oa() : fa();
}
function fa() {
  jt() || (process.env.NODE_ENV !== "production" ? U(
    !1,
    // TODO: This error is probably because they somehow have 2 versions of the
    // router loaded. We can help them understand how to avoid that.
    "useNavigate() may be used only in the context of a <Router> component."
  ) : U(!1));
  let t = R.useContext(vt), {
    basename: e,
    future: r,
    navigator: n
  } = R.useContext(Me), {
    matches: i
  } = R.useContext(Pe), {
    pathname: o
  } = ut(), a = JSON.stringify(Kr(i, r.v7_relativeSplatPath)), d = R.useRef(!1);
  return xi(() => {
    d.current = !0;
  }), R.useCallback(function(c, h) {
    if (h === void 0 && (h = {}), process.env.NODE_ENV !== "production" && me(d.current, wi), !d.current) return;
    if (typeof c == "number") {
      n.go(c);
      return;
    }
    let u = Yr(c, JSON.parse(a), o, h.relative === "path");
    t == null && e !== "/" && (u.pathname = u.pathname === "/" ? e : Be([e, u.pathname])), (h.replace ? n.replace : n.push)(u, h.state, h);
  }, [e, n, a, o, t]);
}
const ha = /* @__PURE__ */ R.createContext(null);
function pa(t) {
  let e = R.useContext(Pe).outlet;
  return e && /* @__PURE__ */ R.createElement(ha.Provider, {
    value: t
  }, e);
}
function Ri() {
  let {
    matches: t
  } = R.useContext(Pe), e = t[t.length - 1];
  return e ? e.params : {};
}
function It(t, e) {
  let {
    relative: r
  } = e === void 0 ? {} : e, {
    future: n
  } = R.useContext(Me), {
    matches: i
  } = R.useContext(Pe), {
    pathname: o
  } = ut(), a = JSON.stringify(Kr(i, n.v7_relativeSplatPath));
  return R.useMemo(() => Yr(t, JSON.parse(a), o, r === "path"), [t, a, o, r]);
}
function ma(t, e, r, n) {
  jt() || (process.env.NODE_ENV !== "production" ? U(
    !1,
    // TODO: This error is probably because they somehow have 2 versions of the
    // router loaded. We can help them understand how to avoid that.
    "useRoutes() may be used only in the context of a <Router> component."
  ) : U(!1));
  let {
    navigator: i
  } = R.useContext(Me), {
    matches: o
  } = R.useContext(Pe), a = o[o.length - 1], d = a ? a.params : {}, l = a ? a.pathname : "/", c = a ? a.pathnameBase : "/", h = a && a.route;
  if (process.env.NODE_ENV !== "production") {
    let E = h && h.path || "";
    Ti(l, !h || E.endsWith("*"), "You rendered descendant <Routes> (or called `useRoutes()`) at " + ('"' + l + '" (under <Route path="' + E + '">) but the ') + `parent route path has no trailing "*". This means if you navigate deeper, the parent won't match anymore and therefore the child routes will never render.

` + ('Please change the parent <Route path="' + E + '"> to <Route ') + ('path="' + (E === "/" ? "*" : E + "/*") + '">.'));
  }
  let u = ut(), s;
  s = u;
  let f = s.pathname || "/", b = f;
  if (c !== "/") {
    let E = c.replace(/^\//, "").split("/");
    b = "/" + f.replace(/^\//, "").split("/").slice(E.length).join("/");
  }
  let v = ot(t, {
    pathname: b
  });
  return process.env.NODE_ENV !== "production" && (process.env.NODE_ENV !== "production" && me(h || v != null, 'No routes matched location "' + s.pathname + s.search + s.hash + '" '), process.env.NODE_ENV !== "production" && me(v == null || v[v.length - 1].route.element !== void 0 || v[v.length - 1].route.Component !== void 0 || v[v.length - 1].route.lazy !== void 0, 'Matched leaf route at location "' + s.pathname + s.search + s.hash + '" does not have an element or Component. This means it will render an <Outlet /> with a null value by default resulting in an "empty" page.')), ba(v && v.map((E) => Object.assign({}, E, {
    params: Object.assign({}, d, E.params),
    pathname: Be([
      c,
      // Re-encode pathnames that were decoded inside matchRoutes
      i.encodeLocation ? i.encodeLocation(E.pathname).pathname : E.pathname
    ]),
    pathnameBase: E.pathnameBase === "/" ? c : Be([
      c,
      // Re-encode pathnames that were decoded inside matchRoutes
      i.encodeLocation ? i.encodeLocation(E.pathnameBase).pathname : E.pathnameBase
    ])
  })), o, r, n);
}
function ga() {
  let t = Ra(), e = Mt(t) ? t.status + " " + t.statusText : t instanceof Error ? t.message : JSON.stringify(t), r = t instanceof Error ? t.stack : null, n = "rgba(200,200,200, 0.5)", i = {
    padding: "0.5rem",
    backgroundColor: n
  }, o = {
    padding: "2px 4px",
    backgroundColor: n
  }, a = null;
  return process.env.NODE_ENV !== "production" && (console.error("Error handled by React Router default ErrorBoundary:", t), a = /* @__PURE__ */ R.createElement(R.Fragment, null, /* @__PURE__ */ R.createElement("p", null, "💿 Hey developer 👋"), /* @__PURE__ */ R.createElement("p", null, "You can provide a way better UX than this when your app throws errors by providing your own ", /* @__PURE__ */ R.createElement("code", {
    style: o
  }, "ErrorBoundary"), " or", " ", /* @__PURE__ */ R.createElement("code", {
    style: o
  }, "errorElement"), " prop on your route."))), /* @__PURE__ */ R.createElement(R.Fragment, null, /* @__PURE__ */ R.createElement("h2", null, "Unexpected Application Error!"), /* @__PURE__ */ R.createElement("h3", {
    style: {
      fontStyle: "italic"
    }
  }, e), r ? /* @__PURE__ */ R.createElement("pre", {
    style: i
  }, r) : null, a);
}
const ya = /* @__PURE__ */ R.createElement(ga, null);
class va extends R.Component {
  constructor(e) {
    super(e), this.state = {
      location: e.location,
      revalidation: e.revalidation,
      error: e.error
    };
  }
  static getDerivedStateFromError(e) {
    return {
      error: e
    };
  }
  static getDerivedStateFromProps(e, r) {
    return r.location !== e.location || r.revalidation !== "idle" && e.revalidation === "idle" ? {
      error: e.error,
      location: e.location,
      revalidation: e.revalidation
    } : {
      error: e.error !== void 0 ? e.error : r.error,
      location: r.location,
      revalidation: e.revalidation || r.revalidation
    };
  }
  componentDidCatch(e, r) {
    console.error("React Router caught the following error during render", e, r);
  }
  render() {
    return this.state.error !== void 0 ? /* @__PURE__ */ R.createElement(Pe.Provider, {
      value: this.props.routeContext
    }, /* @__PURE__ */ R.createElement(Qr.Provider, {
      value: this.state.error,
      children: this.props.component
    })) : this.props.children;
  }
}
function _a(t) {
  let {
    routeContext: e,
    match: r,
    children: n
  } = t, i = R.useContext(vt);
  return i && i.static && i.staticContext && (r.route.errorElement || r.route.ErrorBoundary) && (i.staticContext._deepestRenderedBoundaryId = r.route.id), /* @__PURE__ */ R.createElement(Pe.Provider, {
    value: e
  }, n);
}
function ba(t, e, r, n) {
  var i;
  if (e === void 0 && (e = []), r === void 0 && (r = null), n === void 0 && (n = null), t == null) {
    var o;
    if (!r)
      return null;
    if (r.errors)
      t = r.matches;
    else if ((o = n) != null && o.v7_partialHydration && e.length === 0 && !r.initialized && r.matches.length > 0)
      t = r.matches;
    else
      return null;
  }
  let a = t, d = (i = r) == null ? void 0 : i.errors;
  if (d != null) {
    let h = a.findIndex((u) => u.route.id && (d == null ? void 0 : d[u.route.id]) !== void 0);
    h >= 0 || (process.env.NODE_ENV !== "production" ? U(!1, "Could not find a matching route for errors on route IDs: " + Object.keys(d).join(",")) : U(!1)), a = a.slice(0, Math.min(a.length, h + 1));
  }
  let l = !1, c = -1;
  if (r && n && n.v7_partialHydration)
    for (let h = 0; h < a.length; h++) {
      let u = a[h];
      if ((u.route.HydrateFallback || u.route.hydrateFallbackElement) && (c = h), u.route.id) {
        let {
          loaderData: s,
          errors: f
        } = r, b = u.route.loader && s[u.route.id] === void 0 && (!f || f[u.route.id] === void 0);
        if (u.route.lazy || b) {
          l = !0, c >= 0 ? a = a.slice(0, c + 1) : a = [a[0]];
          break;
        }
      }
    }
  return a.reduceRight((h, u, s) => {
    let f, b = !1, v = null, w = null;
    r && (f = d && u.route.id ? d[u.route.id] : void 0, v = u.route.errorElement || ya, l && (c < 0 && s === 0 ? (Ti("route-fallback", !1, "No `HydrateFallback` element provided to render during initial hydration"), b = !0, w = null) : c === s && (b = !0, w = u.route.hydrateFallbackElement || null)));
    let E = e.concat(a.slice(0, s + 1)), m = () => {
      let O;
      return f ? O = v : b ? O = w : u.route.Component ? O = /* @__PURE__ */ R.createElement(u.route.Component, null) : u.route.element ? O = u.route.element : O = h, /* @__PURE__ */ R.createElement(_a, {
        match: u,
        routeContext: {
          outlet: h,
          matches: E,
          isDataRoute: r != null
        },
        children: O
      });
    };
    return r && (u.route.ErrorBoundary || u.route.errorElement || s === 0) ? /* @__PURE__ */ R.createElement(va, {
      location: r.location,
      revalidation: r.revalidation,
      component: v,
      error: f,
      children: m(),
      routeContext: {
        outlet: null,
        matches: E,
        isDataRoute: !0
      }
    }) : m();
  }, null);
}
var Oi = /* @__PURE__ */ function(t) {
  return t.UseBlocker = "useBlocker", t.UseRevalidator = "useRevalidator", t.UseNavigateStable = "useNavigate", t;
}(Oi || {}), Pt = /* @__PURE__ */ function(t) {
  return t.UseBlocker = "useBlocker", t.UseLoaderData = "useLoaderData", t.UseActionData = "useActionData", t.UseRouteError = "useRouteError", t.UseNavigation = "useNavigation", t.UseRouteLoaderData = "useRouteLoaderData", t.UseMatches = "useMatches", t.UseRevalidator = "useRevalidator", t.UseNavigateStable = "useNavigate", t.UseRouteId = "useRouteId", t;
}(Pt || {});
function Zr(t) {
  return t + " must be used within a data router.  See https://reactrouter.com/v6/routers/picking-a-router.";
}
function Ea(t) {
  let e = R.useContext(vt);
  return e || (process.env.NODE_ENV !== "production" ? U(!1, Zr(t)) : U(!1)), e;
}
function wa(t) {
  let e = R.useContext(ur);
  return e || (process.env.NODE_ENV !== "production" ? U(!1, Zr(t)) : U(!1)), e;
}
function xa(t) {
  let e = R.useContext(Pe);
  return e || (process.env.NODE_ENV !== "production" ? U(!1, Zr(t)) : U(!1)), e;
}
function en(t) {
  let e = xa(t), r = e.matches[e.matches.length - 1];
  return r.route.id || (process.env.NODE_ENV !== "production" ? U(!1, t + ' can only be used on routes that contain a unique "id"') : U(!1)), r.route.id;
}
function Sa() {
  return en(Pt.UseRouteId);
}
function Ra() {
  var t;
  let e = R.useContext(Qr), r = wa(Pt.UseRouteError), n = en(Pt.UseRouteError);
  return e !== void 0 ? e : (t = r.errors) == null ? void 0 : t[n];
}
function Oa() {
  let {
    router: t
  } = Ea(Oi.UseNavigateStable), e = en(Pt.UseNavigateStable), r = R.useRef(!1);
  return xi(() => {
    r.current = !0;
  }), R.useCallback(function(i, o) {
    o === void 0 && (o = {}), process.env.NODE_ENV !== "production" && me(r.current, wi), r.current && (typeof i == "number" ? t.navigate(i) : t.navigate(i, lr({
      fromRouteId: e
    }, o)));
  }, [t, e]);
}
const zn = {};
function Ti(t, e, r) {
  !e && !zn[t] && (zn[t] = !0, process.env.NODE_ENV !== "production" && me(!1, r));
}
const qn = {};
function Ta(t, e) {
  process.env.NODE_ENV !== "production" && !qn[e] && (qn[e] = !0, console.warn(e));
}
const mt = (t, e, r) => Ta(t, "⚠️ React Router Future Flag Warning: " + e + ". " + ("You can use the `" + t + "` future flag to opt-in early. ") + ("For more information, see " + r + "."));
function Na(t, e) {
  (t == null ? void 0 : t.v7_startTransition) === void 0 && mt("v7_startTransition", "React Router will begin wrapping state updates in `React.startTransition` in v7", "https://reactrouter.com/v6/upgrading/future#v7_starttransition"), (t == null ? void 0 : t.v7_relativeSplatPath) === void 0 && (!e || e.v7_relativeSplatPath === void 0) && mt("v7_relativeSplatPath", "Relative route resolution within Splat routes is changing in v7", "https://reactrouter.com/v6/upgrading/future#v7_relativesplatpath"), e && (e.v7_fetcherPersist === void 0 && mt("v7_fetcherPersist", "The persistence behavior of fetchers is changing in v7", "https://reactrouter.com/v6/upgrading/future#v7_fetcherpersist"), e.v7_normalizeFormMethod === void 0 && mt("v7_normalizeFormMethod", "Casing of `formMethod` fields is being normalized to uppercase in v7", "https://reactrouter.com/v6/upgrading/future#v7_normalizeformmethod"), e.v7_partialHydration === void 0 && mt("v7_partialHydration", "`RouterProvider` hydration behavior is changing in v7", "https://reactrouter.com/v6/upgrading/future#v7_partialhydration"), e.v7_skipActionErrorRevalidation === void 0 && mt("v7_skipActionErrorRevalidation", "The revalidation behavior after 4xx/5xx `action` responses is changing in v7", "https://reactrouter.com/v6/upgrading/future#v7_skipactionerrorrevalidation"));
}
function Ca(t) {
  return pa(t.context);
}
function Da(t) {
  let {
    basename: e = "/",
    children: r = null,
    location: n,
    navigationType: i = fe.Pop,
    navigator: o,
    static: a = !1,
    future: d
  } = t;
  jt() && (process.env.NODE_ENV !== "production" ? U(!1, "You cannot render a <Router> inside another <Router>. You should never have more than one in your app.") : U(!1));
  let l = e.replace(/^\/*/, "/"), c = R.useMemo(() => ({
    basename: l,
    navigator: o,
    static: a,
    future: lr({
      v7_relativeSplatPath: !1
    }, d)
  }), [l, d, o, a]);
  typeof n == "string" && (n = rt(n));
  let {
    pathname: h = "/",
    search: u = "",
    hash: s = "",
    state: f = null,
    key: b = "default"
  } = n, v = R.useMemo(() => {
    let w = Le(h, l);
    return w == null ? null : {
      location: {
        pathname: w,
        search: u,
        hash: s,
        state: f,
        key: b
      },
      navigationType: i
    };
  }, [l, h, u, s, f, b, i]);
  return process.env.NODE_ENV !== "production" && me(v != null, '<Router basename="' + l + '"> is not able to match the URL ' + ('"' + h + u + s + '" because it does not start with the ') + "basename, so the <Router> won't render anything."), v == null ? null : /* @__PURE__ */ R.createElement(Me.Provider, {
    value: c
  }, /* @__PURE__ */ R.createElement(dr.Provider, {
    children: r,
    value: v
  }));
}
new Promise(() => {
});
function Aa(t) {
  let e = {
    // Note: this check also occurs in createRoutesFromChildren so update
    // there if you change this -- please and thank you!
    hasErrorBoundary: t.ErrorBoundary != null || t.errorElement != null
  };
  return t.Component && (process.env.NODE_ENV !== "production" && t.element && process.env.NODE_ENV !== "production" && me(!1, "You should not include both `Component` and `element` on your route - `Component` will be used."), Object.assign(e, {
    element: /* @__PURE__ */ R.createElement(t.Component),
    Component: void 0
  })), t.HydrateFallback && (process.env.NODE_ENV !== "production" && t.hydrateFallbackElement && process.env.NODE_ENV !== "production" && me(!1, "You should not include both `HydrateFallback` and `hydrateFallbackElement` on your route - `HydrateFallback` will be used."), Object.assign(e, {
    hydrateFallbackElement: /* @__PURE__ */ R.createElement(t.HydrateFallback),
    HydrateFallback: void 0
  })), t.ErrorBoundary && (process.env.NODE_ENV !== "production" && t.errorElement && process.env.NODE_ENV !== "production" && me(!1, "You should not include both `ErrorBoundary` and `errorElement` on your route - `ErrorBoundary` will be used."), Object.assign(e, {
    errorElement: /* @__PURE__ */ R.createElement(t.ErrorBoundary),
    ErrorBoundary: void 0
  })), e;
}
/**
 * React Router DOM v6.30.1
 *
 * Copyright (c) Remix Software Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.md file in the root directory of this source tree.
 *
 * @license MIT
 */
function tt() {
  return tt = Object.assign ? Object.assign.bind() : function(t) {
    for (var e = 1; e < arguments.length; e++) {
      var r = arguments[e];
      for (var n in r)
        Object.prototype.hasOwnProperty.call(r, n) && (t[n] = r[n]);
    }
    return t;
  }, tt.apply(this, arguments);
}
function tn(t, e) {
  if (t == null) return {};
  var r = {}, n = Object.keys(t), i, o;
  for (o = 0; o < n.length; o++)
    i = n[o], !(e.indexOf(i) >= 0) && (r[i] = t[i]);
  return r;
}
const Qt = "get", Zt = "application/x-www-form-urlencoded";
function fr(t) {
  return t != null && typeof t.tagName == "string";
}
function ka(t) {
  return fr(t) && t.tagName.toLowerCase() === "button";
}
function La(t) {
  return fr(t) && t.tagName.toLowerCase() === "form";
}
function Ma(t) {
  return fr(t) && t.tagName.toLowerCase() === "input";
}
function Pa(t) {
  return !!(t.metaKey || t.altKey || t.ctrlKey || t.shiftKey);
}
function ja(t, e) {
  return t.button === 0 && // Ignore everything but left clicks
  (!e || e === "_self") && // Let browser handle "target=_blank" etc.
  !Pa(t);
}
let Kt = null;
function Ia() {
  if (Kt === null)
    try {
      new FormData(
        document.createElement("form"),
        // @ts-expect-error if FormData supports the submitter parameter, this will throw
        0
      ), Kt = !1;
    } catch {
      Kt = !0;
    }
  return Kt;
}
const Ba = /* @__PURE__ */ new Set(["application/x-www-form-urlencoded", "multipart/form-data", "text/plain"]);
function Rr(t) {
  return t != null && !Ba.has(t) ? (process.env.NODE_ENV !== "production" && me(!1, '"' + t + '" is not a valid `encType` for `<Form>`/`<fetcher.Form>` ' + ('and will default to "' + Zt + '"')), null) : t;
}
function Ua(t, e) {
  let r, n, i, o, a;
  if (La(t)) {
    let d = t.getAttribute("action");
    n = d ? Le(d, e) : null, r = t.getAttribute("method") || Qt, i = Rr(t.getAttribute("enctype")) || Zt, o = new FormData(t);
  } else if (ka(t) || Ma(t) && (t.type === "submit" || t.type === "image")) {
    let d = t.form;
    if (d == null)
      throw new Error('Cannot submit a <button> or <input type="submit"> without a <form>');
    let l = t.getAttribute("formaction") || d.getAttribute("action");
    if (n = l ? Le(l, e) : null, r = t.getAttribute("formmethod") || d.getAttribute("method") || Qt, i = Rr(t.getAttribute("formenctype")) || Rr(d.getAttribute("enctype")) || Zt, o = new FormData(d, t), !Ia()) {
      let {
        name: c,
        type: h,
        value: u
      } = t;
      if (h === "image") {
        let s = c ? c + "." : "";
        o.append(s + "x", "0"), o.append(s + "y", "0");
      } else c && o.append(c, u);
    }
  } else {
    if (fr(t))
      throw new Error('Cannot submit element that is not <form>, <button>, or <input type="submit|image">');
    r = Qt, n = null, i = Zt, a = t;
  }
  return o && i === "text/plain" && (a = o, o = void 0), {
    action: n,
    method: r.toLowerCase(),
    encType: i,
    formData: o,
    body: a
  };
}
const Fa = ["onClick", "relative", "reloadDocument", "replace", "state", "target", "to", "preventScrollReset", "viewTransition"], Va = ["aria-current", "caseSensitive", "className", "end", "style", "to", "viewTransition", "children"], za = ["fetcherKey", "navigate", "reloadDocument", "replace", "state", "method", "action", "onSubmit", "relative", "preventScrollReset", "viewTransition"], qa = "6";
try {
  window.__reactRouterVersion = qa;
} catch {
}
function Ha(t, e) {
  return Ho({
    basename: e == null ? void 0 : e.basename,
    future: tt({}, e == null ? void 0 : e.future, {
      v7_prependBasename: !0
    }),
    history: po({
      window: e == null ? void 0 : e.window
    }),
    hydrationData: (e == null ? void 0 : e.hydrationData) || $a(),
    routes: t,
    mapRouteProperties: Aa,
    dataStrategy: e == null ? void 0 : e.dataStrategy,
    patchRoutesOnNavigation: e == null ? void 0 : e.patchRoutesOnNavigation,
    window: e == null ? void 0 : e.window
  }).initialize();
}
function $a() {
  var t;
  let e = (t = window) == null ? void 0 : t.__staticRouterHydrationData;
  return e && e.errors && (e = tt({}, e, {
    errors: Wa(e.errors)
  })), e;
}
function Wa(t) {
  if (!t) return null;
  let e = Object.entries(t), r = {};
  for (let [n, i] of e)
    if (i && i.__type === "RouteErrorResponse")
      r[n] = new sr(i.status, i.statusText, i.data, i.internal === !0);
    else if (i && i.__type === "Error") {
      if (i.__subType) {
        let o = window[i.__subType];
        if (typeof o == "function")
          try {
            let a = new o(i.message);
            a.stack = "", r[n] = a;
          } catch {
          }
      }
      if (r[n] == null) {
        let o = new Error(i.message);
        o.stack = "", r[n] = o;
      }
    } else
      r[n] = i;
  return r;
}
const rn = /* @__PURE__ */ R.createContext({
  isTransitioning: !1
});
process.env.NODE_ENV !== "production" && (rn.displayName = "ViewTransition");
const Ni = /* @__PURE__ */ R.createContext(/* @__PURE__ */ new Map());
process.env.NODE_ENV !== "production" && (Ni.displayName = "Fetchers");
const Ka = "startTransition", Hn = R[Ka], Ya = "flushSync", $n = ho[Ya];
function Ga(t) {
  Hn ? Hn(t) : t();
}
function Ct(t) {
  $n ? $n(t) : t();
}
class Ja {
  constructor() {
    this.status = "pending", this.promise = new Promise((e, r) => {
      this.resolve = (n) => {
        this.status === "pending" && (this.status = "resolved", e(n));
      }, this.reject = (n) => {
        this.status === "pending" && (this.status = "rejected", r(n));
      };
    });
  }
}
function Xa(t) {
  let {
    fallbackElement: e,
    router: r,
    future: n
  } = t, [i, o] = R.useState(r.state), [a, d] = R.useState(), [l, c] = R.useState({
    isTransitioning: !1
  }), [h, u] = R.useState(), [s, f] = R.useState(), [b, v] = R.useState(), w = R.useRef(/* @__PURE__ */ new Map()), {
    v7_startTransition: E
  } = n || {}, m = R.useCallback((D) => {
    E ? Ga(D) : D();
  }, [E]), O = R.useCallback((D, q) => {
    let {
      deletedFetchers: j,
      flushSync: F,
      viewTransitionOpts: H
    } = q;
    D.fetchers.forEach((oe, ae) => {
      oe.data !== void 0 && w.current.set(ae, oe.data);
    }), j.forEach((oe) => w.current.delete(oe));
    let ue = r.window == null || r.window.document == null || typeof r.window.document.startViewTransition != "function";
    if (!H || ue) {
      F ? Ct(() => o(D)) : m(() => o(D));
      return;
    }
    if (F) {
      Ct(() => {
        s && (h && h.resolve(), s.skipTransition()), c({
          isTransitioning: !0,
          flushSync: !0,
          currentLocation: H.currentLocation,
          nextLocation: H.nextLocation
        });
      });
      let oe = r.window.document.startViewTransition(() => {
        Ct(() => o(D));
      });
      oe.finished.finally(() => {
        Ct(() => {
          u(void 0), f(void 0), d(void 0), c({
            isTransitioning: !1
          });
        });
      }), Ct(() => f(oe));
      return;
    }
    s ? (h && h.resolve(), s.skipTransition(), v({
      state: D,
      currentLocation: H.currentLocation,
      nextLocation: H.nextLocation
    })) : (d(D), c({
      isTransitioning: !0,
      flushSync: !1,
      currentLocation: H.currentLocation,
      nextLocation: H.nextLocation
    }));
  }, [r.window, s, h, w, m]);
  R.useLayoutEffect(() => r.subscribe(O), [r, O]), R.useEffect(() => {
    l.isTransitioning && !l.flushSync && u(new Ja());
  }, [l]), R.useEffect(() => {
    if (h && a && r.window) {
      let D = a, q = h.promise, j = r.window.document.startViewTransition(async () => {
        m(() => o(D)), await q;
      });
      j.finished.finally(() => {
        u(void 0), f(void 0), d(void 0), c({
          isTransitioning: !1
        });
      }), f(j);
    }
  }, [m, a, h, r.window]), R.useEffect(() => {
    h && a && i.location.key === a.location.key && h.resolve();
  }, [h, s, i.location, a]), R.useEffect(() => {
    !l.isTransitioning && b && (d(b.state), c({
      isTransitioning: !0,
      flushSync: !1,
      currentLocation: b.currentLocation,
      nextLocation: b.nextLocation
    }), v(void 0));
  }, [l.isTransitioning, b]), R.useEffect(() => {
    process.env.NODE_ENV !== "production" && me(e == null || !r.future.v7_partialHydration, "`<RouterProvider fallbackElement>` is deprecated when using `v7_partialHydration`, use a `HydrateFallback` component instead");
  }, []);
  let x = R.useMemo(() => ({
    createHref: r.createHref,
    encodeLocation: r.encodeLocation,
    go: (D) => r.navigate(D),
    push: (D, q, j) => r.navigate(D, {
      state: q,
      preventScrollReset: j == null ? void 0 : j.preventScrollReset
    }),
    replace: (D, q, j) => r.navigate(D, {
      replace: !0,
      state: q,
      preventScrollReset: j == null ? void 0 : j.preventScrollReset
    })
  }), [r]), C = r.basename || "/", M = R.useMemo(() => ({
    router: r,
    navigator: x,
    static: !1,
    basename: C
  }), [r, x, C]), y = R.useMemo(() => ({
    v7_relativeSplatPath: r.future.v7_relativeSplatPath
  }), [r.future.v7_relativeSplatPath]);
  return R.useEffect(() => Na(n, r.future), [n, r.future]), /* @__PURE__ */ R.createElement(R.Fragment, null, /* @__PURE__ */ R.createElement(vt.Provider, {
    value: M
  }, /* @__PURE__ */ R.createElement(ur.Provider, {
    value: i
  }, /* @__PURE__ */ R.createElement(Ni.Provider, {
    value: w.current
  }, /* @__PURE__ */ R.createElement(rn.Provider, {
    value: l
  }, /* @__PURE__ */ R.createElement(Da, {
    basename: C,
    location: i.location,
    navigationType: i.historyAction,
    navigator: x,
    future: y
  }, i.initialized || r.future.v7_partialHydration ? /* @__PURE__ */ R.createElement(Qa, {
    routes: r.routes,
    future: r.future,
    state: i
  }) : e))))), null);
}
const Qa = /* @__PURE__ */ R.memo(Za);
function Za(t) {
  let {
    routes: e,
    future: r,
    state: n
  } = t;
  return ma(e, void 0, n, r);
}
process.env.NODE_ENV;
const es = typeof window < "u" && typeof window.document < "u" && typeof window.document.createElement < "u", ts = /^(?:[a-z][a-z0-9+.-]*:|\/\/)/i, hr = /* @__PURE__ */ R.forwardRef(function(e, r) {
  let {
    onClick: n,
    relative: i,
    reloadDocument: o,
    replace: a,
    state: d,
    target: l,
    to: c,
    preventScrollReset: h,
    viewTransition: u
  } = e, s = tn(e, Fa), {
    basename: f
  } = R.useContext(Me), b, v = !1;
  if (typeof c == "string" && ts.test(c) && (b = c, es))
    try {
      let O = new URL(window.location.href), x = c.startsWith("//") ? new URL(O.protocol + c) : new URL(c), C = Le(x.pathname, f);
      x.origin === O.origin && C != null ? c = C + x.search + x.hash : v = !0;
    } catch {
      process.env.NODE_ENV !== "production" && me(!1, '<Link to="' + c + '"> contains an invalid URL which will probably break when clicked - please update to a valid URL path.');
    }
  let w = da(c, {
    relative: i
  }), E = os(c, {
    replace: a,
    state: d,
    target: l,
    preventScrollReset: h,
    relative: i,
    viewTransition: u
  });
  function m(O) {
    n && n(O), O.defaultPrevented || E(O);
  }
  return (
    // eslint-disable-next-line jsx-a11y/anchor-has-content
    /* @__PURE__ */ R.createElement("a", tt({}, s, {
      href: b || w,
      onClick: v || o ? n : m,
      ref: r,
      target: l
    }))
  );
});
process.env.NODE_ENV !== "production" && (hr.displayName = "Link");
const rs = /* @__PURE__ */ R.forwardRef(function(e, r) {
  let {
    "aria-current": n = "page",
    caseSensitive: i = !1,
    className: o = "",
    end: a = !1,
    style: d,
    to: l,
    viewTransition: c,
    children: h
  } = e, u = tn(e, Va), s = It(l, {
    relative: u.relative
  }), f = ut(), b = R.useContext(ur), {
    navigator: v,
    basename: w
  } = R.useContext(Me), E = b != null && // Conditional usage is OK here because the usage of a data router is static
  // eslint-disable-next-line react-hooks/rules-of-hooks
  ds(s) && c === !0, m = v.encodeLocation ? v.encodeLocation(s).pathname : s.pathname, O = f.pathname, x = b && b.navigation && b.navigation.location ? b.navigation.location.pathname : null;
  i || (O = O.toLowerCase(), x = x ? x.toLowerCase() : null, m = m.toLowerCase()), x && w && (x = Le(x, w) || x);
  const C = m !== "/" && m.endsWith("/") ? m.length - 1 : m.length;
  let M = O === m || !a && O.startsWith(m) && O.charAt(C) === "/", y = x != null && (x === m || !a && x.startsWith(m) && x.charAt(m.length) === "/"), D = {
    isActive: M,
    isPending: y,
    isTransitioning: E
  }, q = M ? n : void 0, j;
  typeof o == "function" ? j = o(D) : j = [o, M ? "active" : null, y ? "pending" : null, E ? "transitioning" : null].filter(Boolean).join(" ");
  let F = typeof d == "function" ? d(D) : d;
  return /* @__PURE__ */ R.createElement(hr, tt({}, u, {
    "aria-current": q,
    className: j,
    ref: r,
    style: F,
    to: l,
    viewTransition: c
  }), typeof h == "function" ? h(D) : h);
});
process.env.NODE_ENV !== "production" && (rs.displayName = "NavLink");
const ns = /* @__PURE__ */ R.forwardRef((t, e) => {
  let {
    fetcherKey: r,
    navigate: n,
    reloadDocument: i,
    replace: o,
    state: a,
    method: d = Qt,
    action: l,
    onSubmit: c,
    relative: h,
    preventScrollReset: u,
    viewTransition: s
  } = t, f = tn(t, za), b = cs(), v = us(l, {
    relative: h
  }), w = d.toLowerCase() === "get" ? "get" : "post", E = (m) => {
    if (c && c(m), m.defaultPrevented) return;
    m.preventDefault();
    let O = m.nativeEvent.submitter, x = (O == null ? void 0 : O.getAttribute("formmethod")) || d;
    b(O || m.currentTarget, {
      fetcherKey: r,
      method: x,
      navigate: n,
      replace: o,
      state: a,
      relative: h,
      preventScrollReset: u,
      viewTransition: s
    });
  };
  return /* @__PURE__ */ R.createElement("form", tt({
    ref: e,
    method: w,
    action: v,
    onSubmit: i ? c : E
  }, f));
});
process.env.NODE_ENV !== "production" && (ns.displayName = "Form");
process.env.NODE_ENV;
var cr;
(function(t) {
  t.UseScrollRestoration = "useScrollRestoration", t.UseSubmit = "useSubmit", t.UseSubmitFetcher = "useSubmitFetcher", t.UseFetcher = "useFetcher", t.useViewTransitionState = "useViewTransitionState";
})(cr || (cr = {}));
var Wn;
(function(t) {
  t.UseFetcher = "useFetcher", t.UseFetchers = "useFetchers", t.UseScrollRestoration = "useScrollRestoration";
})(Wn || (Wn = {}));
function is(t) {
  return t + " must be used within a data router.  See https://reactrouter.com/v6/routers/picking-a-router.";
}
function Ci(t) {
  let e = R.useContext(vt);
  return e || (process.env.NODE_ENV !== "production" ? U(!1, is(t)) : U(!1)), e;
}
function os(t, e) {
  let {
    target: r,
    replace: n,
    state: i,
    preventScrollReset: o,
    relative: a,
    viewTransition: d
  } = e === void 0 ? {} : e, l = Si(), c = ut(), h = It(t, {
    relative: a
  });
  return R.useCallback((u) => {
    if (ja(u, r)) {
      u.preventDefault();
      let s = n !== void 0 ? n : et(c) === et(h);
      l(t, {
        replace: s,
        state: i,
        preventScrollReset: o,
        relative: a,
        viewTransition: d
      });
    }
  }, [c, l, h, n, i, r, t, o, a, d]);
}
function as() {
  if (typeof document > "u")
    throw new Error("You are calling submit during the server render. Try calling submit within a `useEffect` or callback instead.");
}
let ss = 0, ls = () => "__" + String(++ss) + "__";
function cs() {
  let {
    router: t
  } = Ci(cr.UseSubmit), {
    basename: e
  } = R.useContext(Me), r = Sa();
  return R.useCallback(function(n, i) {
    i === void 0 && (i = {}), as();
    let {
      action: o,
      method: a,
      encType: d,
      formData: l,
      body: c
    } = Ua(n, e);
    if (i.navigate === !1) {
      let h = i.fetcherKey || ls();
      t.fetch(h, r, i.action || o, {
        preventScrollReset: i.preventScrollReset,
        formData: l,
        body: c,
        formMethod: i.method || a,
        formEncType: i.encType || d,
        flushSync: i.flushSync
      });
    } else
      t.navigate(i.action || o, {
        preventScrollReset: i.preventScrollReset,
        formData: l,
        body: c,
        formMethod: i.method || a,
        formEncType: i.encType || d,
        replace: i.replace,
        state: i.state,
        fromRouteId: r,
        flushSync: i.flushSync,
        viewTransition: i.viewTransition
      });
  }, [t, e, r]);
}
function us(t, e) {
  let {
    relative: r
  } = e === void 0 ? {} : e, {
    basename: n
  } = R.useContext(Me), i = R.useContext(Pe);
  i || (process.env.NODE_ENV !== "production" ? U(!1, "useFormAction must be used inside a RouteContext") : U(!1));
  let [o] = i.matches.slice(-1), a = tt({}, It(t || ".", {
    relative: r
  })), d = ut();
  if (t == null) {
    a.search = d.search;
    let l = new URLSearchParams(a.search), c = l.getAll("index");
    if (c.some((u) => u === "")) {
      l.delete("index"), c.filter((s) => s).forEach((s) => l.append("index", s));
      let u = l.toString();
      a.search = u ? "?" + u : "";
    }
  }
  return (!t || t === ".") && o.route.index && (a.search = a.search ? a.search.replace(/^\?/, "?index&") : "?index"), n !== "/" && (a.pathname = a.pathname === "/" ? n : Be([n, a.pathname])), et(a);
}
function ds(t, e) {
  e === void 0 && (e = {});
  let r = R.useContext(rn);
  r == null && (process.env.NODE_ENV !== "production" ? U(!1, "`useViewTransitionState` must be used within `react-router-dom`'s `RouterProvider`.  Did you accidentally import `RouterProvider` from `react-router`?") : U(!1));
  let {
    basename: n
  } = Ci(cr.useViewTransitionState), i = It(t, {
    relative: e.relative
  });
  if (!r.isTransitioning)
    return !1;
  let o = Le(r.currentLocation.pathname, n) || r.currentLocation.pathname, a = Le(r.nextLocation.pathname, n) || r.nextLocation.pathname;
  return ar(i.pathname, a) != null || ar(i.pathname, o) != null;
}
const fs = {}, Kn = (t) => {
  let e;
  const r = /* @__PURE__ */ new Set(), n = (h, u) => {
    const s = typeof h == "function" ? h(e) : h;
    if (!Object.is(s, e)) {
      const f = e;
      e = u ?? (typeof s != "object" || s === null) ? s : Object.assign({}, e, s), r.forEach((b) => b(e, f));
    }
  }, i = () => e, l = { setState: n, getState: i, getInitialState: () => c, subscribe: (h) => (r.add(h), () => r.delete(h)), destroy: () => {
    (fs ? "production" : void 0) !== "production" && console.warn(
      "[DEPRECATED] The `destroy` method will be unsupported in a future version. Instead use unsubscribe function returned by subscribe. Everything will be garbage-collected if store is garbage-collected."
    ), r.clear();
  } }, c = e = t(n, i, l);
  return l;
}, hs = (t) => t ? Kn(t) : Kn;
var Ur = { exports: {} }, Or = {}, Yt = { exports: {} }, Tr = {};
/**
 * @license React
 * use-sync-external-store-shim.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var Yn;
function ps() {
  if (Yn) return Tr;
  Yn = 1;
  var t = We;
  function e(u, s) {
    return u === s && (u !== 0 || 1 / u === 1 / s) || u !== u && s !== s;
  }
  var r = typeof Object.is == "function" ? Object.is : e, n = t.useState, i = t.useEffect, o = t.useLayoutEffect, a = t.useDebugValue;
  function d(u, s) {
    var f = s(), b = n({ inst: { value: f, getSnapshot: s } }), v = b[0].inst, w = b[1];
    return o(
      function() {
        v.value = f, v.getSnapshot = s, l(v) && w({ inst: v });
      },
      [u, f, s]
    ), i(
      function() {
        return l(v) && w({ inst: v }), u(function() {
          l(v) && w({ inst: v });
        });
      },
      [u]
    ), a(f), f;
  }
  function l(u) {
    var s = u.getSnapshot;
    u = u.value;
    try {
      var f = s();
      return !r(u, f);
    } catch {
      return !0;
    }
  }
  function c(u, s) {
    return s();
  }
  var h = typeof window > "u" || typeof window.document > "u" || typeof window.document.createElement > "u" ? c : d;
  return Tr.useSyncExternalStore = t.useSyncExternalStore !== void 0 ? t.useSyncExternalStore : h, Tr;
}
var Nr = {};
/**
 * @license React
 * use-sync-external-store-shim.development.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var Gn;
function ms() {
  return Gn || (Gn = 1, process.env.NODE_ENV !== "production" && function() {
    function t(f, b) {
      return f === b && (f !== 0 || 1 / f === 1 / b) || f !== f && b !== b;
    }
    function e(f, b) {
      h || i.startTransition === void 0 || (h = !0, console.error(
        "You are using an outdated, pre-release alpha of React 18 that does not support useSyncExternalStore. The use-sync-external-store shim will not work correctly. Upgrade to a newer pre-release."
      ));
      var v = b();
      if (!u) {
        var w = b();
        o(v, w) || (console.error(
          "The result of getSnapshot should be cached to avoid an infinite loop"
        ), u = !0);
      }
      w = a({
        inst: { value: v, getSnapshot: b }
      });
      var E = w[0].inst, m = w[1];
      return l(
        function() {
          E.value = v, E.getSnapshot = b, r(E) && m({ inst: E });
        },
        [f, v, b]
      ), d(
        function() {
          return r(E) && m({ inst: E }), f(function() {
            r(E) && m({ inst: E });
          });
        },
        [f]
      ), c(v), v;
    }
    function r(f) {
      var b = f.getSnapshot;
      f = f.value;
      try {
        var v = b();
        return !o(f, v);
      } catch {
        return !0;
      }
    }
    function n(f, b) {
      return b();
    }
    typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u" && typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart == "function" && __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart(Error());
    var i = We, o = typeof Object.is == "function" ? Object.is : t, a = i.useState, d = i.useEffect, l = i.useLayoutEffect, c = i.useDebugValue, h = !1, u = !1, s = typeof window > "u" || typeof window.document > "u" || typeof window.document.createElement > "u" ? n : e;
    Nr.useSyncExternalStore = i.useSyncExternalStore !== void 0 ? i.useSyncExternalStore : s, typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u" && typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop == "function" && __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop(Error());
  }()), Nr;
}
var Jn;
function Di() {
  return Jn || (Jn = 1, process.env.NODE_ENV === "production" ? Yt.exports = ps() : Yt.exports = ms()), Yt.exports;
}
/**
 * @license React
 * use-sync-external-store-shim/with-selector.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var Xn;
function gs() {
  if (Xn) return Or;
  Xn = 1;
  var t = We, e = Di();
  function r(c, h) {
    return c === h && (c !== 0 || 1 / c === 1 / h) || c !== c && h !== h;
  }
  var n = typeof Object.is == "function" ? Object.is : r, i = e.useSyncExternalStore, o = t.useRef, a = t.useEffect, d = t.useMemo, l = t.useDebugValue;
  return Or.useSyncExternalStoreWithSelector = function(c, h, u, s, f) {
    var b = o(null);
    if (b.current === null) {
      var v = { hasValue: !1, value: null };
      b.current = v;
    } else v = b.current;
    b = d(
      function() {
        function E(M) {
          if (!m) {
            if (m = !0, O = M, M = s(M), f !== void 0 && v.hasValue) {
              var y = v.value;
              if (f(y, M))
                return x = y;
            }
            return x = M;
          }
          if (y = x, n(O, M)) return y;
          var D = s(M);
          return f !== void 0 && f(y, D) ? (O = M, y) : (O = M, x = D);
        }
        var m = !1, O, x, C = u === void 0 ? null : u;
        return [
          function() {
            return E(h());
          },
          C === null ? void 0 : function() {
            return E(C());
          }
        ];
      },
      [h, u, s, f]
    );
    var w = i(c, b[0], b[1]);
    return a(
      function() {
        v.hasValue = !0, v.value = w;
      },
      [w]
    ), l(w), w;
  }, Or;
}
var Cr = {};
/**
 * @license React
 * use-sync-external-store-shim/with-selector.development.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var Qn;
function ys() {
  return Qn || (Qn = 1, process.env.NODE_ENV !== "production" && function() {
    function t(c, h) {
      return c === h && (c !== 0 || 1 / c === 1 / h) || c !== c && h !== h;
    }
    typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u" && typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart == "function" && __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart(Error());
    var e = We, r = Di(), n = typeof Object.is == "function" ? Object.is : t, i = r.useSyncExternalStore, o = e.useRef, a = e.useEffect, d = e.useMemo, l = e.useDebugValue;
    Cr.useSyncExternalStoreWithSelector = function(c, h, u, s, f) {
      var b = o(null);
      if (b.current === null) {
        var v = { hasValue: !1, value: null };
        b.current = v;
      } else v = b.current;
      b = d(
        function() {
          function E(M) {
            if (!m) {
              if (m = !0, O = M, M = s(M), f !== void 0 && v.hasValue) {
                var y = v.value;
                if (f(y, M))
                  return x = y;
              }
              return x = M;
            }
            if (y = x, n(O, M))
              return y;
            var D = s(M);
            return f !== void 0 && f(y, D) ? (O = M, y) : (O = M, x = D);
          }
          var m = !1, O, x, C = u === void 0 ? null : u;
          return [
            function() {
              return E(h());
            },
            C === null ? void 0 : function() {
              return E(C());
            }
          ];
        },
        [h, u, s, f]
      );
      var w = i(c, b[0], b[1]);
      return a(
        function() {
          v.hasValue = !0, v.value = w;
        },
        [w]
      ), l(w), w;
    }, typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u" && typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop == "function" && __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop(Error());
  }()), Cr;
}
process.env.NODE_ENV === "production" ? Ur.exports = gs() : Ur.exports = ys();
var vs = Ur.exports;
const _s = /* @__PURE__ */ ui(vs), Ai = {}, { useDebugValue: bs } = We, { useSyncExternalStoreWithSelector: Es } = _s;
let Zn = !1;
const ws = (t) => t;
function xs(t, e = ws, r) {
  (Ai ? "production" : void 0) !== "production" && r && !Zn && (console.warn(
    "[DEPRECATED] Use `createWithEqualityFn` instead of `create` or use `useStoreWithEqualityFn` instead of `useStore`. They can be imported from 'zustand/traditional'. https://github.com/pmndrs/zustand/discussions/1937"
  ), Zn = !0);
  const n = Es(
    t.subscribe,
    t.getState,
    t.getServerState || t.getInitialState,
    e,
    r
  );
  return bs(n), n;
}
const ei = (t) => {
  (Ai ? "production" : void 0) !== "production" && typeof t != "function" && console.warn(
    "[DEPRECATED] Passing a vanilla store will be unsupported in a future version. Instead use `import { useStore } from 'zustand'`."
  );
  const e = typeof t == "function" ? hs(t) : t, r = (n, i) => xs(e, n, i);
  return Object.assign(r, e), r;
}, Ss = (t) => t ? ei(t) : ei, gt = [
  "frieren",
  "himmel",
  "heiter",
  "eisen",
  "fern",
  "stark",
  "sein",
  "übel"
], Rs = {
  frieren: "#7f7c84",
  himmel: "#bddaf9",
  heiter: "#78855e",
  eisen: "#cfccc0",
  fern: "#794983",
  stark: "#af4a33",
  sein: "#936f42",
  übel: "#667240"
};
function nn(t) {
  return `/media/sprites/square_${t}.png`;
}
const Dr = "wp_leader_key", G = Ss((t, e) => ({
  ready: !1,
  name: "",
  sprite: null,
  adminKey: null,
  rememberAdmin: !1,
  me: { clientId: null, nextClientSeq: 1 },
  snapshot: { mediaId: null, playheadMs: 0, playing: !1, serverSeq: 0, leaderId: null },
  roster: {},
  chat: [],
  drift: { rtts: [], offsetMs: 0 },
  readiness: { mediaId: null, ready: !1, readyCount: 0, total: 0 },
  seqMap: {},
  toasts: [],
  setReady: () => t({ ready: !0 }),
  setIdentity: (r, n) => t({ name: r, sprite: n }),
  ensureAutoIdentity: () => t((r) => {
    if (r.name) return {};
    const n = new Set(Object.values(r.roster).map((i) => i.name).filter(Boolean));
    for (const i of gt)
      if (!n.has(i))
        return { name: i, sprite: i };
    return { name: gt[0], sprite: gt[0] };
  }),
  setAdminKey: (r, n) => {
    n && r ? localStorage.setItem(Dr, r) : localStorage.removeItem(Dr), t({ adminKey: r, rememberAdmin: n });
  },
  hydrateAdminKey: () => {
    const r = localStorage.getItem(Dr);
    r && t({ adminKey: r, rememberAdmin: !0 });
  },
  ensureMe: (r) => t((n) => ({ me: { ...n.me, clientId: r } })),
  applySnapshot: (r) => t((n) => {
    const i = { ...n.roster };
    if (r.users)
      for (const o of r.users) i[o.clientId] = o;
    return {
      snapshot: {
        mediaId: r.mediaId ?? n.snapshot.mediaId,
        playheadMs: r.playheadMs ?? n.snapshot.playheadMs,
        playing: r.playing ?? n.snapshot.playing,
        serverSeq: r.serverSeq ?? n.snapshot.serverSeq,
        leaderId: r.leaderId ?? n.snapshot.leaderId
      },
      roster: i
    };
  }),
  upsertUser: (r) => t((n) => ({ roster: { ...n.roster, [r.clientId]: r } })),
  removeUser: (r) => t((n) => {
    const i = { ...n.roster };
    return delete i[r], { roster: i };
  }),
  appendChat: (r) => t((n) => ({ chat: [...n.chat, r].slice(-500) })),
  recordAck: (r, n) => t((i) => ({ seqMap: { ...i.seqMap, [r]: n } })),
  allocateClientSeq: () => {
    const r = e().me.nextClientSeq;
    return t((n) => ({ me: { ...n.me, nextClientSeq: r + 1 } })), r;
  },
  updateControlState: (r) => t((n) => ({
    snapshot: { ...n.snapshot, ...r }
  })),
  addRttSample: (r, n, i) => t((o) => {
    const a = [...o.drift.rtts, r].slice(-5);
    let d = o.drift.offsetMs;
    if (n && i) {
      const l = i + r / 2;
      d = n - l;
    }
    return { drift: { rtts: a, offsetMs: d } };
  }),
  pushToast: (r, n) => t((i) => ({ toasts: [...i.toasts, { id: Math.random().toString(36).slice(2), kind: r, msg: n, ts: Date.now() }].slice(-5) })),
  popToast: (r) => t((n) => ({ toasts: n.toasts.filter((i) => i.id !== r) })),
  setReadiness: (r) => t({ readiness: { mediaId: r.mediaId, ready: r.ready, readyCount: r.readyCount, total: r.total } })
}));
function Os() {
  const t = G((r) => r.toasts), e = G((r) => r.popToast);
  return Ce(() => {
    const r = t.map((n) => setTimeout(() => e(n.id), 4e3));
    return () => {
      r.forEach(clearTimeout);
    };
  }, [t, e]), /* @__PURE__ */ S.jsx("div", { className: "fixed bottom-4 left-1/2 -translate-x-1/2 flex flex-col gap-2 z-50", children: t.map((r) => /* @__PURE__ */ S.jsx("div", { className: `px-3 py-2 rounded text-sm shadow font-medium bg-slate-800 border ${r.kind === "error" ? "border-red-500 text-red-300" : "border-slate-600 text-slate-200"}`, children: r.msg }, r.id)) });
}
const Ts = 400;
function on() {
  const t = Xe(null), e = Xe([]);
  return Ce(() => {
    const r = t.current;
    if (!r) return;
    const n = r.getContext("2d");
    if (!n) return;
    const i = () => {
      r.width = window.innerWidth, r.height = window.innerHeight;
    };
    i(), window.addEventListener("resize", i);
    let o = 0;
    function a(f) {
      return f < 300 ? { scale: 0.5, demote: 0.5 } : f < 400 ? { scale: 0.6, demote: 0.4 } : f < 500 ? { scale: 0.7, demote: 0.3 } : f < 600 ? { scale: 0.8, demote: 0.2 } : f < 700 ? { scale: 0.9, demote: 0.1 } : { scale: 1, demote: 0 };
    }
    function d(f, b, v = !1, w) {
      let E = Math.random();
      const m = w ?? o;
      w === void 0 && o++;
      const O = v ? a(m) : { scale: 1, demote: 0 };
      let x = E > 0.998, C = !x && E > 0.98;
      O.demote > 0 && (x && Math.random() < O.demote && (x = !1), C && Math.random() < O.demote && (C = !1)), v && (x = !1, C = !1);
      const M = C;
      let y;
      x ? y = 0.92 + Math.random() * 0.08 : C ? y = 0.85 + Math.random() * 0.15 : y = 0.05 + Math.random() ** 2.2 * 0.75;
      const D = (Ut, qe) => {
        const gr = Math.random(), yr = Math.random();
        return Ut + (gr + yr) / 2 * (qe - Ut);
      };
      let q = D(0.9, 1.4) + y ** 1.2 * (x ? 5.5 : C ? 4 : 3.2);
      const j = D(0.85, 1.25);
      let F = q * j;
      v && O.scale < 1 && (F *= O.scale);
      let H;
      x ? H = 1.05 + Math.random() * 0.5 : C ? (H = 0.55 + y ** 1.05 * 0.7 + Math.random() * 0.25, H > 1.25 && (H = 1.25)) : (H = 0.15 + y ** 1.05 * 0.6 + Math.random() * 0.15, H > 1.05 && (H = 1.05)), !x && H < 0.15 && (H = 0.15);
      const ue = 0.035 + D(0, 0.08), oe = y ** 1.45 * (x ? 4.9 : C ? 1.55 : 1.25);
      let ae = ue + oe * D(0.85, 1.3);
      v && O.scale < 1 && (ae *= O.scale);
      const De = Math.min(1, H), Ee = Math.min(1, (F - 1) / 4.5);
      ae *= 1 + 0.18 * Math.max(De, Ee), x && ae < 1.25 && (ae = 1.25 + Math.random() * 0.4);
      const ie = r.width, je = r.height, T = 0.18 + Math.random() * 0.28, V = x || Math.random() < 0.18, W = x ? 0.55 : M ? 0.38 : Math.max(0.1, 0.28 - T * 0.25), Z = H * (W + Math.random() * (1 - W)), ve = H * (W + Math.random() * (1 - W)), re = (x ? 130 : M ? 160 : 120) + Math.random() * (x ? 140 : 150), we = Math.min(1, ae / 2.5), te = 10, Ke = 120 - te;
      let Ve = Math.random();
      const ge = 0.8 + we * 1.4;
      Ve = Math.pow(Ve, ge);
      const ze = (1 - we) * ((40 - te) / Ke);
      Ve = Ve * (1 - ze) + ze;
      const bt = (te + Ve * Ke) * 1e3;
      return {
        x: f ?? Math.random() * ie,
        y: b ?? (v ? Math.random() * je : -Math.random() * je),
        z: y,
        speed: ae,
        size: F,
        alpha: H,
        colorRare: M,
        colorPhase: Math.random() * Math.PI * 2,
        colorSpeed: 0.01 + Math.random() * 0.02,
        colorMode: Math.random() < 0.5 ? 0 : 1,
        twinkleAmount: T,
        twinkleEnabled: V,
        dimFloor: W,
        twinkleStart: Z,
        twinkleTarget: ve,
        twinkleT: 0,
        twinkleDuration: re,
        microPhase: Math.random() * Math.PI * 2,
        microSpeed: (x ? 0.18 : 0.1) + Math.random() * 0.05,
        ultraRare: x,
        trail: x ? [] : void 0,
        currentAlpha: Z,
        lifeMsRemaining: bt,
        lifeMsTotal: bt
      };
    }
    if (!e.current.length)
      for (let f = 0; f < Ts; f++) e.current.push(d(void 0, void 0, !0, f));
    let l = performance.now();
    function c(f, b, v, w) {
      const O = (0.15 + 0.75 * Math.min(1, w / 2)) * v, x = v, C = v, M = Math.min(O, C * 0.95, x * 0.48), y = f, D = b, q = f + x, j = b + C, F = n;
      F.beginPath(), F.moveTo(y, D), F.lineTo(q, D), F.lineTo(q, j - M), F.quadraticCurveTo(q, j, q - M, j), F.lineTo(y + M, j), F.quadraticCurveTo(y, j, y, j - M), F.lineTo(y, D), F.closePath(), F.fill();
    }
    function h(f, b) {
      if (b > 3 && (b = 3), !f.twinkleEnabled) {
        f.currentAlpha = f.alpha;
        return;
      }
      if (f.twinkleT += b, f.twinkleT >= f.twinkleDuration) {
        f.twinkleStart = f.twinkleTarget, f.twinkleTarget = f.alpha * (f.dimFloor + Math.random() * (1 - f.dimFloor));
        const m = f.ultraRare ? 150 : f.colorRare ? 140 : 110, O = f.ultraRare ? 170 : 140;
        f.twinkleDuration = m + Math.random() * O, f.twinkleT = 0;
      }
      const v = Math.min(1, f.twinkleT / f.twinkleDuration), w = v * v * (3 - 2 * v);
      let E = f.twinkleStart + (f.twinkleTarget - f.twinkleStart) * w;
      if (f.microPhase += f.microSpeed * b, f.ultraRare) {
        const m = Math.sin(f.microPhase) * 0.04;
        E = Math.min(1, Math.max(f.alpha * f.dimFloor, E * (1 + m)));
      }
      f.currentAlpha = E;
    }
    function u(f, b) {
      if (f.ultraRare) {
        f.colorPhase += f.colorSpeed * 2.2 * b;
        const v = [
          [255, 120, 220],
          // pink
          [120, 255, 170],
          // green
          [255, 255, 255]
          // white
        ], w = f.colorPhase % v.length, E = Math.floor(w), m = (E + 1) % v.length, O = w - E, x = v[E], C = v[m], M = Math.round(x[0] + (C[0] - x[0]) * O), y = Math.round(x[1] + (C[1] - x[1]) * O), D = Math.round(x[2] + (C[2] - x[2]) * O);
        return `rgb(${M},${y},${D})`;
      }
      if (f.colorRare) {
        f.colorPhase += f.colorSpeed * b;
        const v = (Math.sin(f.colorPhase) + 1) / 2;
        if (f.colorMode === 0) {
          const w = Math.round(255 - 165 * v), E = Math.round(255 - 105 * v);
          return `rgb(${w},${E},255)`;
        } else {
          const E = Math.round(255 - 175 * v), m = Math.round(255 - 175 * v);
          return `rgb(255,${E},${m})`;
        }
      }
      return "#ffffff";
    }
    const s = () => {
      const f = performance.now(), b = f - l, v = b / 16.666;
      l = f, n.clearRect(0, 0, r.width, r.height), r.width, r.height;
      const w = 220;
      for (let E = 0; E < e.current.length; E++) {
        const m = e.current[E];
        if (m.ultraRare) {
          if (m.trail || (m.trail = []), !m.maxTrail) {
            const q = m.speed * 14, j = Math.min(1, m.speed / 1.9), F = q * (1 + 8 * j);
            m.maxTrail = Math.min(300, Math.floor(F));
          }
          m.trail.push({ x: m.x + m.size / 2, y: m.y + m.size / 2 }), m.trail.length > m.maxTrail && m.trail.splice(0, m.trail.length - m.maxTrail);
        }
        if (m.lifeMsRemaining -= b, m.lifeMsRemaining <= 0) {
          const D = d(Math.random() * r.width, void 0, !1);
          D.y = -D.size - 1, e.current[E] = D;
          continue;
        }
        if (m.y += m.speed * v, m.y - m.size > r.height + w) {
          e.current[E] = d(Math.random() * r.width, -m.size - 1);
          continue;
        }
        h(m, v);
        const O = m.currentAlpha ?? m.alpha, x = 1500, C = m.lifeMsRemaining < x ? Math.max(0, m.lifeMsRemaining / x) : 1, M = O * C;
        let y = u(m, v);
        if (m.ultraRare) {
          const D = M;
          if (m.trail && m.trail.length) {
            const F = m.trail.length;
            for (let H = 0; H < F; H++) {
              const ue = m.trail[F - 1 - H], oe = 1 - H / F, ae = Math.pow(oe, 3);
              n.globalAlpha = Math.min(1, D) * ae * 0.6;
              const De = 0.35 + 0.65 * ae;
              n.fillStyle = y;
              const Ee = m.size * De;
              n.fillRect(ue.x - Ee / 2, ue.y - Ee / 2, Ee, Ee);
            }
          }
          n.globalAlpha = Math.min(1, D * 1.02), n.fillStyle = y;
          const q = m.x - m.size * 0.1, j = m.y - m.size * 0.1;
          if (c(q, j, m.size * 1.2, m.speed), D > 1.02) {
            const F = Math.min(1, (D - 1) * 0.85);
            n.save(), n.globalCompositeOperation = "lighter", n.globalAlpha = F, n.fillStyle = y;
            const H = m.size * 0.75;
            c(q + m.size * 0.225, j + m.size * 0.225, H, m.speed), n.restore();
          }
        } else if (n.globalAlpha = Math.min(1, M), n.fillStyle = y, c(m.x, m.y, m.size, m.speed), M > 1.01) {
          const D = Math.min(0.9, (M - 1) * 0.8);
          n.save(), n.globalCompositeOperation = "lighter", n.globalAlpha = D, n.fillStyle = y;
          const q = m.size * 0.55;
          c(m.x + m.size * 0.225, m.y + m.size * 0.225, q, m.speed), n.restore();
        }
      }
      n.globalAlpha = 1, requestAnimationFrame(s);
    };
    return s(), () => window.removeEventListener("resize", i);
  }, []), /* @__PURE__ */ S.jsx(
    "canvas",
    {
      ref: t,
      "data-darkreader-ignore": !0,
      className: "fixed inset-0 z-0 bg-black pointer-events-none [isolation:isolate]"
    }
  );
}
function Ns() {
  const t = ["dev-room-1000"];
  return /* @__PURE__ */ S.jsxs("div", { className: "relative h-full flex flex-col items-center justify-center gap-10 py-24", children: [
    /* @__PURE__ */ S.jsx(on, {}),
    /* @__PURE__ */ S.jsx("h1", { className: "text-4xl font-bold tracking-tight drop-shadow", children: "Watchparty" }),
    /* @__PURE__ */ S.jsxs("div", { className: "w-full max-w-md space-y-4 z-10", children: [
      /* @__PURE__ */ S.jsx("h2", { className: "text-sm uppercase tracking-wide opacity-70", children: "Rooms" }),
      /* @__PURE__ */ S.jsx("ul", { className: "space-y-2", children: t.map((e) => /* @__PURE__ */ S.jsx("li", { children: /* @__PURE__ */ S.jsxs(hr, { to: `/room/${encodeURIComponent(e)}`, className: "block bg-slate-900/80 backdrop-blur border border-slate-700 hover:border-slate-500 rounded px-4 py-3 transition-colors", children: [
        /* @__PURE__ */ S.jsx("div", { className: "font-medium", children: e }),
        /* @__PURE__ */ S.jsx("div", { className: "text-[11px] opacity-60", children: "Join room" })
      ] }) }, e)) }),
      /* @__PURE__ */ S.jsx("div", { className: "pt-6 text-xs opacity-50", children: "Provide ?roomKey=&leaderKey= query params to deep link directly." })
    ] })
  ] });
}
function Cs() {
  const t = G((r) => r.roster), e = Object.values(t);
  return e.length ? /* @__PURE__ */ S.jsx("ul", { className: "text-xs space-y-1", children: e.map((r) => {
    const n = r.name && Rs[r.name] || "#cbd5e1";
    return /* @__PURE__ */ S.jsxs("li", { className: "flex items-center gap-2", children: [
      r.sprite ? /* @__PURE__ */ S.jsx("img", { src: nn(r.sprite), alt: r.sprite, className: "w-7 h-7 rounded object-cover" }) : /* @__PURE__ */ S.jsx("span", { className: "inline-block w-7 h-7 bg-slate-700/50 rounded" }),
      /* @__PURE__ */ S.jsx("span", { className: "truncate max-w-[120px] font-medium", style: { color: n }, children: r.name || "Anon" }),
      r.isLeader && /* @__PURE__ */ S.jsx("span", { className: "px-1 rounded bg-emerald-600 text-[9px]", children: "L" })
    ] }, r.clientId);
  }) }) : /* @__PURE__ */ S.jsx("div", { className: "text-xs opacity-50", children: "No users" });
}
const Ue = /* @__PURE__ */ Object.create(null);
Ue.open = "0";
Ue.close = "1";
Ue.ping = "2";
Ue.pong = "3";
Ue.message = "4";
Ue.upgrade = "5";
Ue.noop = "6";
const er = /* @__PURE__ */ Object.create(null);
Object.keys(Ue).forEach((t) => {
  er[Ue[t]] = t;
});
const Fr = { type: "error", data: "parser error" }, ki = typeof Blob == "function" || typeof Blob < "u" && Object.prototype.toString.call(Blob) === "[object BlobConstructor]", Li = typeof ArrayBuffer == "function", Mi = (t) => typeof ArrayBuffer.isView == "function" ? ArrayBuffer.isView(t) : t && t.buffer instanceof ArrayBuffer, an = ({ type: t, data: e }, r, n) => ki && e instanceof Blob ? r ? n(e) : ti(e, n) : Li && (e instanceof ArrayBuffer || Mi(e)) ? r ? n(e) : ti(new Blob([e]), n) : n(Ue[t] + (e || "")), ti = (t, e) => {
  const r = new FileReader();
  return r.onload = function() {
    const n = r.result.split(",")[1];
    e("b" + (n || ""));
  }, r.readAsDataURL(t);
};
function ri(t) {
  return t instanceof Uint8Array ? t : t instanceof ArrayBuffer ? new Uint8Array(t) : new Uint8Array(t.buffer, t.byteOffset, t.byteLength);
}
let Ar;
function Ds(t, e) {
  if (ki && t.data instanceof Blob)
    return t.data.arrayBuffer().then(ri).then(e);
  if (Li && (t.data instanceof ArrayBuffer || Mi(t.data)))
    return e(ri(t.data));
  an(t, !1, (r) => {
    Ar || (Ar = new TextEncoder()), e(Ar.encode(r));
  });
}
const ni = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/", kt = typeof Uint8Array > "u" ? [] : new Uint8Array(256);
for (let t = 0; t < ni.length; t++)
  kt[ni.charCodeAt(t)] = t;
const As = (t) => {
  let e = t.length * 0.75, r = t.length, n, i = 0, o, a, d, l;
  t[t.length - 1] === "=" && (e--, t[t.length - 2] === "=" && e--);
  const c = new ArrayBuffer(e), h = new Uint8Array(c);
  for (n = 0; n < r; n += 4)
    o = kt[t.charCodeAt(n)], a = kt[t.charCodeAt(n + 1)], d = kt[t.charCodeAt(n + 2)], l = kt[t.charCodeAt(n + 3)], h[i++] = o << 2 | a >> 4, h[i++] = (a & 15) << 4 | d >> 2, h[i++] = (d & 3) << 6 | l & 63;
  return c;
}, ks = typeof ArrayBuffer == "function", sn = (t, e) => {
  if (typeof t != "string")
    return {
      type: "message",
      data: Pi(t, e)
    };
  const r = t.charAt(0);
  return r === "b" ? {
    type: "message",
    data: Ls(t.substring(1), e)
  } : er[r] ? t.length > 1 ? {
    type: er[r],
    data: t.substring(1)
  } : {
    type: er[r]
  } : Fr;
}, Ls = (t, e) => {
  if (ks) {
    const r = As(t);
    return Pi(r, e);
  } else
    return { base64: !0, data: t };
}, Pi = (t, e) => {
  switch (e) {
    case "blob":
      return t instanceof Blob ? t : new Blob([t]);
    case "arraybuffer":
    default:
      return t instanceof ArrayBuffer ? t : t.buffer;
  }
}, ji = "", Ms = (t, e) => {
  const r = t.length, n = new Array(r);
  let i = 0;
  t.forEach((o, a) => {
    an(o, !1, (d) => {
      n[a] = d, ++i === r && e(n.join(ji));
    });
  });
}, Ps = (t, e) => {
  const r = t.split(ji), n = [];
  for (let i = 0; i < r.length; i++) {
    const o = sn(r[i], e);
    if (n.push(o), o.type === "error")
      break;
  }
  return n;
};
function js() {
  return new TransformStream({
    transform(t, e) {
      Ds(t, (r) => {
        const n = r.length;
        let i;
        if (n < 126)
          i = new Uint8Array(1), new DataView(i.buffer).setUint8(0, n);
        else if (n < 65536) {
          i = new Uint8Array(3);
          const o = new DataView(i.buffer);
          o.setUint8(0, 126), o.setUint16(1, n);
        } else {
          i = new Uint8Array(9);
          const o = new DataView(i.buffer);
          o.setUint8(0, 127), o.setBigUint64(1, BigInt(n));
        }
        t.data && typeof t.data != "string" && (i[0] |= 128), e.enqueue(i), e.enqueue(r);
      });
    }
  });
}
let kr;
function Gt(t) {
  return t.reduce((e, r) => e + r.length, 0);
}
function Jt(t, e) {
  if (t[0].length === e)
    return t.shift();
  const r = new Uint8Array(e);
  let n = 0;
  for (let i = 0; i < e; i++)
    r[i] = t[0][n++], n === t[0].length && (t.shift(), n = 0);
  return t.length && n < t[0].length && (t[0] = t[0].slice(n)), r;
}
function Is(t, e) {
  kr || (kr = new TextDecoder());
  const r = [];
  let n = 0, i = -1, o = !1;
  return new TransformStream({
    transform(a, d) {
      for (r.push(a); ; ) {
        if (n === 0) {
          if (Gt(r) < 1)
            break;
          const l = Jt(r, 1);
          o = (l[0] & 128) === 128, i = l[0] & 127, i < 126 ? n = 3 : i === 126 ? n = 1 : n = 2;
        } else if (n === 1) {
          if (Gt(r) < 2)
            break;
          const l = Jt(r, 2);
          i = new DataView(l.buffer, l.byteOffset, l.length).getUint16(0), n = 3;
        } else if (n === 2) {
          if (Gt(r) < 8)
            break;
          const l = Jt(r, 8), c = new DataView(l.buffer, l.byteOffset, l.length), h = c.getUint32(0);
          if (h > Math.pow(2, 21) - 1) {
            d.enqueue(Fr);
            break;
          }
          i = h * Math.pow(2, 32) + c.getUint32(4), n = 3;
        } else {
          if (Gt(r) < i)
            break;
          const l = Jt(r, i);
          d.enqueue(sn(o ? l : kr.decode(l), e)), n = 0;
        }
        if (i === 0 || i > t) {
          d.enqueue(Fr);
          break;
        }
      }
    }
  });
}
const Ii = 4;
function he(t) {
  if (t) return Bs(t);
}
function Bs(t) {
  for (var e in he.prototype)
    t[e] = he.prototype[e];
  return t;
}
he.prototype.on = he.prototype.addEventListener = function(t, e) {
  return this._callbacks = this._callbacks || {}, (this._callbacks["$" + t] = this._callbacks["$" + t] || []).push(e), this;
};
he.prototype.once = function(t, e) {
  function r() {
    this.off(t, r), e.apply(this, arguments);
  }
  return r.fn = e, this.on(t, r), this;
};
he.prototype.off = he.prototype.removeListener = he.prototype.removeAllListeners = he.prototype.removeEventListener = function(t, e) {
  if (this._callbacks = this._callbacks || {}, arguments.length == 0)
    return this._callbacks = {}, this;
  var r = this._callbacks["$" + t];
  if (!r) return this;
  if (arguments.length == 1)
    return delete this._callbacks["$" + t], this;
  for (var n, i = 0; i < r.length; i++)
    if (n = r[i], n === e || n.fn === e) {
      r.splice(i, 1);
      break;
    }
  return r.length === 0 && delete this._callbacks["$" + t], this;
};
he.prototype.emit = function(t) {
  this._callbacks = this._callbacks || {};
  for (var e = new Array(arguments.length - 1), r = this._callbacks["$" + t], n = 1; n < arguments.length; n++)
    e[n - 1] = arguments[n];
  if (r) {
    r = r.slice(0);
    for (var n = 0, i = r.length; n < i; ++n)
      r[n].apply(this, e);
  }
  return this;
};
he.prototype.emitReserved = he.prototype.emit;
he.prototype.listeners = function(t) {
  return this._callbacks = this._callbacks || {}, this._callbacks["$" + t] || [];
};
he.prototype.hasListeners = function(t) {
  return !!this.listeners(t).length;
};
const pr = typeof Promise == "function" && typeof Promise.resolve == "function" ? (e) => Promise.resolve().then(e) : (e, r) => r(e, 0), Ne = typeof self < "u" ? self : typeof window < "u" ? window : Function("return this")(), Us = "arraybuffer";
function Bi(t, ...e) {
  return e.reduce((r, n) => (t.hasOwnProperty(n) && (r[n] = t[n]), r), {});
}
const Fs = Ne.setTimeout, Vs = Ne.clearTimeout;
function mr(t, e) {
  e.useNativeTimers ? (t.setTimeoutFn = Fs.bind(Ne), t.clearTimeoutFn = Vs.bind(Ne)) : (t.setTimeoutFn = Ne.setTimeout.bind(Ne), t.clearTimeoutFn = Ne.clearTimeout.bind(Ne));
}
const zs = 1.33;
function qs(t) {
  return typeof t == "string" ? Hs(t) : Math.ceil((t.byteLength || t.size) * zs);
}
function Hs(t) {
  let e = 0, r = 0;
  for (let n = 0, i = t.length; n < i; n++)
    e = t.charCodeAt(n), e < 128 ? r += 1 : e < 2048 ? r += 2 : e < 55296 || e >= 57344 ? r += 3 : (n++, r += 4);
  return r;
}
function Ui() {
  return Date.now().toString(36).substring(3) + Math.random().toString(36).substring(2, 5);
}
function $s(t) {
  let e = "";
  for (let r in t)
    t.hasOwnProperty(r) && (e.length && (e += "&"), e += encodeURIComponent(r) + "=" + encodeURIComponent(t[r]));
  return e;
}
function Ws(t) {
  let e = {}, r = t.split("&");
  for (let n = 0, i = r.length; n < i; n++) {
    let o = r[n].split("=");
    e[decodeURIComponent(o[0])] = decodeURIComponent(o[1]);
  }
  return e;
}
class Ks extends Error {
  constructor(e, r, n) {
    super(e), this.description = r, this.context = n, this.type = "TransportError";
  }
}
class ln extends he {
  /**
   * Transport abstract constructor.
   *
   * @param {Object} opts - options
   * @protected
   */
  constructor(e) {
    super(), this.writable = !1, mr(this, e), this.opts = e, this.query = e.query, this.socket = e.socket, this.supportsBinary = !e.forceBase64;
  }
  /**
   * Emits an error.
   *
   * @param {String} reason
   * @param description
   * @param context - the error context
   * @return {Transport} for chaining
   * @protected
   */
  onError(e, r, n) {
    return super.emitReserved("error", new Ks(e, r, n)), this;
  }
  /**
   * Opens the transport.
   */
  open() {
    return this.readyState = "opening", this.doOpen(), this;
  }
  /**
   * Closes the transport.
   */
  close() {
    return (this.readyState === "opening" || this.readyState === "open") && (this.doClose(), this.onClose()), this;
  }
  /**
   * Sends multiple packets.
   *
   * @param {Array} packets
   */
  send(e) {
    this.readyState === "open" && this.write(e);
  }
  /**
   * Called upon open
   *
   * @protected
   */
  onOpen() {
    this.readyState = "open", this.writable = !0, super.emitReserved("open");
  }
  /**
   * Called with data.
   *
   * @param {String} data
   * @protected
   */
  onData(e) {
    const r = sn(e, this.socket.binaryType);
    this.onPacket(r);
  }
  /**
   * Called with a decoded packet.
   *
   * @protected
   */
  onPacket(e) {
    super.emitReserved("packet", e);
  }
  /**
   * Called upon close.
   *
   * @protected
   */
  onClose(e) {
    this.readyState = "closed", super.emitReserved("close", e);
  }
  /**
   * Pauses the transport, in order not to lose packets during an upgrade.
   *
   * @param onPause
   */
  pause(e) {
  }
  createUri(e, r = {}) {
    return e + "://" + this._hostname() + this._port() + this.opts.path + this._query(r);
  }
  _hostname() {
    const e = this.opts.hostname;
    return e.indexOf(":") === -1 ? e : "[" + e + "]";
  }
  _port() {
    return this.opts.port && (this.opts.secure && +(this.opts.port !== 443) || !this.opts.secure && Number(this.opts.port) !== 80) ? ":" + this.opts.port : "";
  }
  _query(e) {
    const r = $s(e);
    return r.length ? "?" + r : "";
  }
}
class Ys extends ln {
  constructor() {
    super(...arguments), this._polling = !1;
  }
  get name() {
    return "polling";
  }
  /**
   * Opens the socket (triggers polling). We write a PING message to determine
   * when the transport is open.
   *
   * @protected
   */
  doOpen() {
    this._poll();
  }
  /**
   * Pauses polling.
   *
   * @param {Function} onPause - callback upon buffers are flushed and transport is paused
   * @package
   */
  pause(e) {
    this.readyState = "pausing";
    const r = () => {
      this.readyState = "paused", e();
    };
    if (this._polling || !this.writable) {
      let n = 0;
      this._polling && (n++, this.once("pollComplete", function() {
        --n || r();
      })), this.writable || (n++, this.once("drain", function() {
        --n || r();
      }));
    } else
      r();
  }
  /**
   * Starts polling cycle.
   *
   * @private
   */
  _poll() {
    this._polling = !0, this.doPoll(), this.emitReserved("poll");
  }
  /**
   * Overloads onData to detect payloads.
   *
   * @protected
   */
  onData(e) {
    const r = (n) => {
      if (this.readyState === "opening" && n.type === "open" && this.onOpen(), n.type === "close")
        return this.onClose({ description: "transport closed by the server" }), !1;
      this.onPacket(n);
    };
    Ps(e, this.socket.binaryType).forEach(r), this.readyState !== "closed" && (this._polling = !1, this.emitReserved("pollComplete"), this.readyState === "open" && this._poll());
  }
  /**
   * For polling, send a close packet.
   *
   * @protected
   */
  doClose() {
    const e = () => {
      this.write([{ type: "close" }]);
    };
    this.readyState === "open" ? e() : this.once("open", e);
  }
  /**
   * Writes a packets payload.
   *
   * @param {Array} packets - data packets
   * @protected
   */
  write(e) {
    this.writable = !1, Ms(e, (r) => {
      this.doWrite(r, () => {
        this.writable = !0, this.emitReserved("drain");
      });
    });
  }
  /**
   * Generates uri for connection.
   *
   * @private
   */
  uri() {
    const e = this.opts.secure ? "https" : "http", r = this.query || {};
    return this.opts.timestampRequests !== !1 && (r[this.opts.timestampParam] = Ui()), !this.supportsBinary && !r.sid && (r.b64 = 1), this.createUri(e, r);
  }
}
let Fi = !1;
try {
  Fi = typeof XMLHttpRequest < "u" && "withCredentials" in new XMLHttpRequest();
} catch {
}
const Gs = Fi;
function Js() {
}
class Xs extends Ys {
  /**
   * XHR Polling constructor.
   *
   * @param {Object} opts
   * @package
   */
  constructor(e) {
    if (super(e), typeof location < "u") {
      const r = location.protocol === "https:";
      let n = location.port;
      n || (n = r ? "443" : "80"), this.xd = typeof location < "u" && e.hostname !== location.hostname || n !== e.port;
    }
  }
  /**
   * Sends data.
   *
   * @param {String} data to send.
   * @param {Function} called upon flush.
   * @private
   */
  doWrite(e, r) {
    const n = this.request({
      method: "POST",
      data: e
    });
    n.on("success", r), n.on("error", (i, o) => {
      this.onError("xhr post error", i, o);
    });
  }
  /**
   * Starts a poll cycle.
   *
   * @private
   */
  doPoll() {
    const e = this.request();
    e.on("data", this.onData.bind(this)), e.on("error", (r, n) => {
      this.onError("xhr poll error", r, n);
    }), this.pollXhr = e;
  }
}
let yt = class tr extends he {
  /**
   * Request constructor
   *
   * @param {Object} options
   * @package
   */
  constructor(e, r, n) {
    super(), this.createRequest = e, mr(this, n), this._opts = n, this._method = n.method || "GET", this._uri = r, this._data = n.data !== void 0 ? n.data : null, this._create();
  }
  /**
   * Creates the XHR object and sends the request.
   *
   * @private
   */
  _create() {
    var e;
    const r = Bi(this._opts, "agent", "pfx", "key", "passphrase", "cert", "ca", "ciphers", "rejectUnauthorized", "autoUnref");
    r.xdomain = !!this._opts.xd;
    const n = this._xhr = this.createRequest(r);
    try {
      n.open(this._method, this._uri, !0);
      try {
        if (this._opts.extraHeaders) {
          n.setDisableHeaderCheck && n.setDisableHeaderCheck(!0);
          for (let i in this._opts.extraHeaders)
            this._opts.extraHeaders.hasOwnProperty(i) && n.setRequestHeader(i, this._opts.extraHeaders[i]);
        }
      } catch {
      }
      if (this._method === "POST")
        try {
          n.setRequestHeader("Content-type", "text/plain;charset=UTF-8");
        } catch {
        }
      try {
        n.setRequestHeader("Accept", "*/*");
      } catch {
      }
      (e = this._opts.cookieJar) === null || e === void 0 || e.addCookies(n), "withCredentials" in n && (n.withCredentials = this._opts.withCredentials), this._opts.requestTimeout && (n.timeout = this._opts.requestTimeout), n.onreadystatechange = () => {
        var i;
        n.readyState === 3 && ((i = this._opts.cookieJar) === null || i === void 0 || i.parseCookies(
          // @ts-ignore
          n.getResponseHeader("set-cookie")
        )), n.readyState === 4 && (n.status === 200 || n.status === 1223 ? this._onLoad() : this.setTimeoutFn(() => {
          this._onError(typeof n.status == "number" ? n.status : 0);
        }, 0));
      }, n.send(this._data);
    } catch (i) {
      this.setTimeoutFn(() => {
        this._onError(i);
      }, 0);
      return;
    }
    typeof document < "u" && (this._index = tr.requestsCount++, tr.requests[this._index] = this);
  }
  /**
   * Called upon error.
   *
   * @private
   */
  _onError(e) {
    this.emitReserved("error", e, this._xhr), this._cleanup(!0);
  }
  /**
   * Cleans up house.
   *
   * @private
   */
  _cleanup(e) {
    if (!(typeof this._xhr > "u" || this._xhr === null)) {
      if (this._xhr.onreadystatechange = Js, e)
        try {
          this._xhr.abort();
        } catch {
        }
      typeof document < "u" && delete tr.requests[this._index], this._xhr = null;
    }
  }
  /**
   * Called upon load.
   *
   * @private
   */
  _onLoad() {
    const e = this._xhr.responseText;
    e !== null && (this.emitReserved("data", e), this.emitReserved("success"), this._cleanup());
  }
  /**
   * Aborts the request.
   *
   * @package
   */
  abort() {
    this._cleanup();
  }
};
yt.requestsCount = 0;
yt.requests = {};
if (typeof document < "u") {
  if (typeof attachEvent == "function")
    attachEvent("onunload", ii);
  else if (typeof addEventListener == "function") {
    const t = "onpagehide" in Ne ? "pagehide" : "unload";
    addEventListener(t, ii, !1);
  }
}
function ii() {
  for (let t in yt.requests)
    yt.requests.hasOwnProperty(t) && yt.requests[t].abort();
}
const Qs = function() {
  const t = Vi({
    xdomain: !1
  });
  return t && t.responseType !== null;
}();
class Zs extends Xs {
  constructor(e) {
    super(e);
    const r = e && e.forceBase64;
    this.supportsBinary = Qs && !r;
  }
  request(e = {}) {
    return Object.assign(e, { xd: this.xd }, this.opts), new yt(Vi, this.uri(), e);
  }
}
function Vi(t) {
  const e = t.xdomain;
  try {
    if (typeof XMLHttpRequest < "u" && (!e || Gs))
      return new XMLHttpRequest();
  } catch {
  }
  if (!e)
    try {
      return new Ne[["Active"].concat("Object").join("X")]("Microsoft.XMLHTTP");
    } catch {
    }
}
const zi = typeof navigator < "u" && typeof navigator.product == "string" && navigator.product.toLowerCase() === "reactnative";
class el extends ln {
  get name() {
    return "websocket";
  }
  doOpen() {
    const e = this.uri(), r = this.opts.protocols, n = zi ? {} : Bi(this.opts, "agent", "perMessageDeflate", "pfx", "key", "passphrase", "cert", "ca", "ciphers", "rejectUnauthorized", "localAddress", "protocolVersion", "origin", "maxPayload", "family", "checkServerIdentity");
    this.opts.extraHeaders && (n.headers = this.opts.extraHeaders);
    try {
      this.ws = this.createSocket(e, r, n);
    } catch (i) {
      return this.emitReserved("error", i);
    }
    this.ws.binaryType = this.socket.binaryType, this.addEventListeners();
  }
  /**
   * Adds event listeners to the socket
   *
   * @private
   */
  addEventListeners() {
    this.ws.onopen = () => {
      this.opts.autoUnref && this.ws._socket.unref(), this.onOpen();
    }, this.ws.onclose = (e) => this.onClose({
      description: "websocket connection closed",
      context: e
    }), this.ws.onmessage = (e) => this.onData(e.data), this.ws.onerror = (e) => this.onError("websocket error", e);
  }
  write(e) {
    this.writable = !1;
    for (let r = 0; r < e.length; r++) {
      const n = e[r], i = r === e.length - 1;
      an(n, this.supportsBinary, (o) => {
        try {
          this.doWrite(n, o);
        } catch {
        }
        i && pr(() => {
          this.writable = !0, this.emitReserved("drain");
        }, this.setTimeoutFn);
      });
    }
  }
  doClose() {
    typeof this.ws < "u" && (this.ws.onerror = () => {
    }, this.ws.close(), this.ws = null);
  }
  /**
   * Generates uri for connection.
   *
   * @private
   */
  uri() {
    const e = this.opts.secure ? "wss" : "ws", r = this.query || {};
    return this.opts.timestampRequests && (r[this.opts.timestampParam] = Ui()), this.supportsBinary || (r.b64 = 1), this.createUri(e, r);
  }
}
const Lr = Ne.WebSocket || Ne.MozWebSocket;
class tl extends el {
  createSocket(e, r, n) {
    return zi ? new Lr(e, r, n) : r ? new Lr(e, r) : new Lr(e);
  }
  doWrite(e, r) {
    this.ws.send(r);
  }
}
class rl extends ln {
  get name() {
    return "webtransport";
  }
  doOpen() {
    try {
      this._transport = new WebTransport(this.createUri("https"), this.opts.transportOptions[this.name]);
    } catch (e) {
      return this.emitReserved("error", e);
    }
    this._transport.closed.then(() => {
      this.onClose();
    }).catch((e) => {
      this.onError("webtransport error", e);
    }), this._transport.ready.then(() => {
      this._transport.createBidirectionalStream().then((e) => {
        const r = Is(Number.MAX_SAFE_INTEGER, this.socket.binaryType), n = e.readable.pipeThrough(r).getReader(), i = js();
        i.readable.pipeTo(e.writable), this._writer = i.writable.getWriter();
        const o = () => {
          n.read().then(({ done: d, value: l }) => {
            d || (this.onPacket(l), o());
          }).catch((d) => {
          });
        };
        o();
        const a = { type: "open" };
        this.query.sid && (a.data = `{"sid":"${this.query.sid}"}`), this._writer.write(a).then(() => this.onOpen());
      });
    });
  }
  write(e) {
    this.writable = !1;
    for (let r = 0; r < e.length; r++) {
      const n = e[r], i = r === e.length - 1;
      this._writer.write(n).then(() => {
        i && pr(() => {
          this.writable = !0, this.emitReserved("drain");
        }, this.setTimeoutFn);
      });
    }
  }
  doClose() {
    var e;
    (e = this._transport) === null || e === void 0 || e.close();
  }
}
const nl = {
  websocket: tl,
  webtransport: rl,
  polling: Zs
}, il = /^(?:(?![^:@\/?#]+:[^:@\/]*@)(http|https|ws|wss):\/\/)?((?:(([^:@\/?#]*)(?::([^:@\/?#]*))?)?@)?((?:[a-f0-9]{0,4}:){2,7}[a-f0-9]{0,4}|[^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/, ol = [
  "source",
  "protocol",
  "authority",
  "userInfo",
  "user",
  "password",
  "host",
  "port",
  "relative",
  "path",
  "directory",
  "file",
  "query",
  "anchor"
];
function Vr(t) {
  if (t.length > 8e3)
    throw "URI too long";
  const e = t, r = t.indexOf("["), n = t.indexOf("]");
  r != -1 && n != -1 && (t = t.substring(0, r) + t.substring(r, n).replace(/:/g, ";") + t.substring(n, t.length));
  let i = il.exec(t || ""), o = {}, a = 14;
  for (; a--; )
    o[ol[a]] = i[a] || "";
  return r != -1 && n != -1 && (o.source = e, o.host = o.host.substring(1, o.host.length - 1).replace(/;/g, ":"), o.authority = o.authority.replace("[", "").replace("]", "").replace(/;/g, ":"), o.ipv6uri = !0), o.pathNames = al(o, o.path), o.queryKey = sl(o, o.query), o;
}
function al(t, e) {
  const r = /\/{2,9}/g, n = e.replace(r, "/").split("/");
  return (e.slice(0, 1) == "/" || e.length === 0) && n.splice(0, 1), e.slice(-1) == "/" && n.splice(n.length - 1, 1), n;
}
function sl(t, e) {
  const r = {};
  return e.replace(/(?:^|&)([^&=]*)=?([^&]*)/g, function(n, i, o) {
    i && (r[i] = o);
  }), r;
}
const zr = typeof addEventListener == "function" && typeof removeEventListener == "function", rr = [];
zr && addEventListener("offline", () => {
  rr.forEach((t) => t());
}, !1);
class Ze extends he {
  /**
   * Socket constructor.
   *
   * @param {String|Object} uri - uri or options
   * @param {Object} opts - options
   */
  constructor(e, r) {
    if (super(), this.binaryType = Us, this.writeBuffer = [], this._prevBufferLen = 0, this._pingInterval = -1, this._pingTimeout = -1, this._maxPayload = -1, this._pingTimeoutTime = 1 / 0, e && typeof e == "object" && (r = e, e = null), e) {
      const n = Vr(e);
      r.hostname = n.host, r.secure = n.protocol === "https" || n.protocol === "wss", r.port = n.port, n.query && (r.query = n.query);
    } else r.host && (r.hostname = Vr(r.host).host);
    mr(this, r), this.secure = r.secure != null ? r.secure : typeof location < "u" && location.protocol === "https:", r.hostname && !r.port && (r.port = this.secure ? "443" : "80"), this.hostname = r.hostname || (typeof location < "u" ? location.hostname : "localhost"), this.port = r.port || (typeof location < "u" && location.port ? location.port : this.secure ? "443" : "80"), this.transports = [], this._transportsByName = {}, r.transports.forEach((n) => {
      const i = n.prototype.name;
      this.transports.push(i), this._transportsByName[i] = n;
    }), this.opts = Object.assign({
      path: "/engine.io",
      agent: !1,
      withCredentials: !1,
      upgrade: !0,
      timestampParam: "t",
      rememberUpgrade: !1,
      addTrailingSlash: !0,
      rejectUnauthorized: !0,
      perMessageDeflate: {
        threshold: 1024
      },
      transportOptions: {},
      closeOnBeforeunload: !1
    }, r), this.opts.path = this.opts.path.replace(/\/$/, "") + (this.opts.addTrailingSlash ? "/" : ""), typeof this.opts.query == "string" && (this.opts.query = Ws(this.opts.query)), zr && (this.opts.closeOnBeforeunload && (this._beforeunloadEventListener = () => {
      this.transport && (this.transport.removeAllListeners(), this.transport.close());
    }, addEventListener("beforeunload", this._beforeunloadEventListener, !1)), this.hostname !== "localhost" && (this._offlineEventListener = () => {
      this._onClose("transport close", {
        description: "network connection lost"
      });
    }, rr.push(this._offlineEventListener))), this.opts.withCredentials && (this._cookieJar = void 0), this._open();
  }
  /**
   * Creates transport of the given type.
   *
   * @param {String} name - transport name
   * @return {Transport}
   * @private
   */
  createTransport(e) {
    const r = Object.assign({}, this.opts.query);
    r.EIO = Ii, r.transport = e, this.id && (r.sid = this.id);
    const n = Object.assign({}, this.opts, {
      query: r,
      socket: this,
      hostname: this.hostname,
      secure: this.secure,
      port: this.port
    }, this.opts.transportOptions[e]);
    return new this._transportsByName[e](n);
  }
  /**
   * Initializes transport to use and starts probe.
   *
   * @private
   */
  _open() {
    if (this.transports.length === 0) {
      this.setTimeoutFn(() => {
        this.emitReserved("error", "No transports available");
      }, 0);
      return;
    }
    const e = this.opts.rememberUpgrade && Ze.priorWebsocketSuccess && this.transports.indexOf("websocket") !== -1 ? "websocket" : this.transports[0];
    this.readyState = "opening";
    const r = this.createTransport(e);
    r.open(), this.setTransport(r);
  }
  /**
   * Sets the current transport. Disables the existing one (if any).
   *
   * @private
   */
  setTransport(e) {
    this.transport && this.transport.removeAllListeners(), this.transport = e, e.on("drain", this._onDrain.bind(this)).on("packet", this._onPacket.bind(this)).on("error", this._onError.bind(this)).on("close", (r) => this._onClose("transport close", r));
  }
  /**
   * Called when connection is deemed open.
   *
   * @private
   */
  onOpen() {
    this.readyState = "open", Ze.priorWebsocketSuccess = this.transport.name === "websocket", this.emitReserved("open"), this.flush();
  }
  /**
   * Handles a packet.
   *
   * @private
   */
  _onPacket(e) {
    if (this.readyState === "opening" || this.readyState === "open" || this.readyState === "closing")
      switch (this.emitReserved("packet", e), this.emitReserved("heartbeat"), e.type) {
        case "open":
          this.onHandshake(JSON.parse(e.data));
          break;
        case "ping":
          this._sendPacket("pong"), this.emitReserved("ping"), this.emitReserved("pong"), this._resetPingTimeout();
          break;
        case "error":
          const r = new Error("server error");
          r.code = e.data, this._onError(r);
          break;
        case "message":
          this.emitReserved("data", e.data), this.emitReserved("message", e.data);
          break;
      }
  }
  /**
   * Called upon handshake completion.
   *
   * @param {Object} data - handshake obj
   * @private
   */
  onHandshake(e) {
    this.emitReserved("handshake", e), this.id = e.sid, this.transport.query.sid = e.sid, this._pingInterval = e.pingInterval, this._pingTimeout = e.pingTimeout, this._maxPayload = e.maxPayload, this.onOpen(), this.readyState !== "closed" && this._resetPingTimeout();
  }
  /**
   * Sets and resets ping timeout timer based on server pings.
   *
   * @private
   */
  _resetPingTimeout() {
    this.clearTimeoutFn(this._pingTimeoutTimer);
    const e = this._pingInterval + this._pingTimeout;
    this._pingTimeoutTime = Date.now() + e, this._pingTimeoutTimer = this.setTimeoutFn(() => {
      this._onClose("ping timeout");
    }, e), this.opts.autoUnref && this._pingTimeoutTimer.unref();
  }
  /**
   * Called on `drain` event
   *
   * @private
   */
  _onDrain() {
    this.writeBuffer.splice(0, this._prevBufferLen), this._prevBufferLen = 0, this.writeBuffer.length === 0 ? this.emitReserved("drain") : this.flush();
  }
  /**
   * Flush write buffers.
   *
   * @private
   */
  flush() {
    if (this.readyState !== "closed" && this.transport.writable && !this.upgrading && this.writeBuffer.length) {
      const e = this._getWritablePackets();
      this.transport.send(e), this._prevBufferLen = e.length, this.emitReserved("flush");
    }
  }
  /**
   * Ensure the encoded size of the writeBuffer is below the maxPayload value sent by the server (only for HTTP
   * long-polling)
   *
   * @private
   */
  _getWritablePackets() {
    if (!(this._maxPayload && this.transport.name === "polling" && this.writeBuffer.length > 1))
      return this.writeBuffer;
    let r = 1;
    for (let n = 0; n < this.writeBuffer.length; n++) {
      const i = this.writeBuffer[n].data;
      if (i && (r += qs(i)), n > 0 && r > this._maxPayload)
        return this.writeBuffer.slice(0, n);
      r += 2;
    }
    return this.writeBuffer;
  }
  /**
   * Checks whether the heartbeat timer has expired but the socket has not yet been notified.
   *
   * Note: this method is private for now because it does not really fit the WebSocket API, but if we put it in the
   * `write()` method then the message would not be buffered by the Socket.IO client.
   *
   * @return {boolean}
   * @private
   */
  /* private */
  _hasPingExpired() {
    if (!this._pingTimeoutTime)
      return !0;
    const e = Date.now() > this._pingTimeoutTime;
    return e && (this._pingTimeoutTime = 0, pr(() => {
      this._onClose("ping timeout");
    }, this.setTimeoutFn)), e;
  }
  /**
   * Sends a message.
   *
   * @param {String} msg - message.
   * @param {Object} options.
   * @param {Function} fn - callback function.
   * @return {Socket} for chaining.
   */
  write(e, r, n) {
    return this._sendPacket("message", e, r, n), this;
  }
  /**
   * Sends a message. Alias of {@link Socket#write}.
   *
   * @param {String} msg - message.
   * @param {Object} options.
   * @param {Function} fn - callback function.
   * @return {Socket} for chaining.
   */
  send(e, r, n) {
    return this._sendPacket("message", e, r, n), this;
  }
  /**
   * Sends a packet.
   *
   * @param {String} type: packet type.
   * @param {String} data.
   * @param {Object} options.
   * @param {Function} fn - callback function.
   * @private
   */
  _sendPacket(e, r, n, i) {
    if (typeof r == "function" && (i = r, r = void 0), typeof n == "function" && (i = n, n = null), this.readyState === "closing" || this.readyState === "closed")
      return;
    n = n || {}, n.compress = n.compress !== !1;
    const o = {
      type: e,
      data: r,
      options: n
    };
    this.emitReserved("packetCreate", o), this.writeBuffer.push(o), i && this.once("flush", i), this.flush();
  }
  /**
   * Closes the connection.
   */
  close() {
    const e = () => {
      this._onClose("forced close"), this.transport.close();
    }, r = () => {
      this.off("upgrade", r), this.off("upgradeError", r), e();
    }, n = () => {
      this.once("upgrade", r), this.once("upgradeError", r);
    };
    return (this.readyState === "opening" || this.readyState === "open") && (this.readyState = "closing", this.writeBuffer.length ? this.once("drain", () => {
      this.upgrading ? n() : e();
    }) : this.upgrading ? n() : e()), this;
  }
  /**
   * Called upon transport error
   *
   * @private
   */
  _onError(e) {
    if (Ze.priorWebsocketSuccess = !1, this.opts.tryAllTransports && this.transports.length > 1 && this.readyState === "opening")
      return this.transports.shift(), this._open();
    this.emitReserved("error", e), this._onClose("transport error", e);
  }
  /**
   * Called upon transport close.
   *
   * @private
   */
  _onClose(e, r) {
    if (this.readyState === "opening" || this.readyState === "open" || this.readyState === "closing") {
      if (this.clearTimeoutFn(this._pingTimeoutTimer), this.transport.removeAllListeners("close"), this.transport.close(), this.transport.removeAllListeners(), zr && (this._beforeunloadEventListener && removeEventListener("beforeunload", this._beforeunloadEventListener, !1), this._offlineEventListener)) {
        const n = rr.indexOf(this._offlineEventListener);
        n !== -1 && rr.splice(n, 1);
      }
      this.readyState = "closed", this.id = null, this.emitReserved("close", e, r), this.writeBuffer = [], this._prevBufferLen = 0;
    }
  }
}
Ze.protocol = Ii;
class ll extends Ze {
  constructor() {
    super(...arguments), this._upgrades = [];
  }
  onOpen() {
    if (super.onOpen(), this.readyState === "open" && this.opts.upgrade)
      for (let e = 0; e < this._upgrades.length; e++)
        this._probe(this._upgrades[e]);
  }
  /**
   * Probes a transport.
   *
   * @param {String} name - transport name
   * @private
   */
  _probe(e) {
    let r = this.createTransport(e), n = !1;
    Ze.priorWebsocketSuccess = !1;
    const i = () => {
      n || (r.send([{ type: "ping", data: "probe" }]), r.once("packet", (u) => {
        if (!n)
          if (u.type === "pong" && u.data === "probe") {
            if (this.upgrading = !0, this.emitReserved("upgrading", r), !r)
              return;
            Ze.priorWebsocketSuccess = r.name === "websocket", this.transport.pause(() => {
              n || this.readyState !== "closed" && (h(), this.setTransport(r), r.send([{ type: "upgrade" }]), this.emitReserved("upgrade", r), r = null, this.upgrading = !1, this.flush());
            });
          } else {
            const s = new Error("probe error");
            s.transport = r.name, this.emitReserved("upgradeError", s);
          }
      }));
    };
    function o() {
      n || (n = !0, h(), r.close(), r = null);
    }
    const a = (u) => {
      const s = new Error("probe error: " + u);
      s.transport = r.name, o(), this.emitReserved("upgradeError", s);
    };
    function d() {
      a("transport closed");
    }
    function l() {
      a("socket closed");
    }
    function c(u) {
      r && u.name !== r.name && o();
    }
    const h = () => {
      r.removeListener("open", i), r.removeListener("error", a), r.removeListener("close", d), this.off("close", l), this.off("upgrading", c);
    };
    r.once("open", i), r.once("error", a), r.once("close", d), this.once("close", l), this.once("upgrading", c), this._upgrades.indexOf("webtransport") !== -1 && e !== "webtransport" ? this.setTimeoutFn(() => {
      n || r.open();
    }, 200) : r.open();
  }
  onHandshake(e) {
    this._upgrades = this._filterUpgrades(e.upgrades), super.onHandshake(e);
  }
  /**
   * Filters upgrades, returning only those matching client transports.
   *
   * @param {Array} upgrades - server upgrades
   * @private
   */
  _filterUpgrades(e) {
    const r = [];
    for (let n = 0; n < e.length; n++)
      ~this.transports.indexOf(e[n]) && r.push(e[n]);
    return r;
  }
}
let cl = class extends ll {
  constructor(e, r = {}) {
    const n = typeof e == "object" ? e : r;
    (!n.transports || n.transports && typeof n.transports[0] == "string") && (n.transports = (n.transports || ["polling", "websocket", "webtransport"]).map((i) => nl[i]).filter((i) => !!i)), super(e, n);
  }
};
function ul(t, e = "", r) {
  let n = t;
  r = r || typeof location < "u" && location, t == null && (t = r.protocol + "//" + r.host), typeof t == "string" && (t.charAt(0) === "/" && (t.charAt(1) === "/" ? t = r.protocol + t : t = r.host + t), /^(https?|wss?):\/\//.test(t) || (typeof r < "u" ? t = r.protocol + "//" + t : t = "https://" + t), n = Vr(t)), n.port || (/^(http|ws)$/.test(n.protocol) ? n.port = "80" : /^(http|ws)s$/.test(n.protocol) && (n.port = "443")), n.path = n.path || "/";
  const o = n.host.indexOf(":") !== -1 ? "[" + n.host + "]" : n.host;
  return n.id = n.protocol + "://" + o + ":" + n.port + e, n.href = n.protocol + "://" + o + (r && r.port === n.port ? "" : ":" + n.port), n;
}
const dl = typeof ArrayBuffer == "function", fl = (t) => typeof ArrayBuffer.isView == "function" ? ArrayBuffer.isView(t) : t.buffer instanceof ArrayBuffer, qi = Object.prototype.toString, hl = typeof Blob == "function" || typeof Blob < "u" && qi.call(Blob) === "[object BlobConstructor]", pl = typeof File == "function" || typeof File < "u" && qi.call(File) === "[object FileConstructor]";
function cn(t) {
  return dl && (t instanceof ArrayBuffer || fl(t)) || hl && t instanceof Blob || pl && t instanceof File;
}
function nr(t, e) {
  if (!t || typeof t != "object")
    return !1;
  if (Array.isArray(t)) {
    for (let r = 0, n = t.length; r < n; r++)
      if (nr(t[r]))
        return !0;
    return !1;
  }
  if (cn(t))
    return !0;
  if (t.toJSON && typeof t.toJSON == "function" && arguments.length === 1)
    return nr(t.toJSON(), !0);
  for (const r in t)
    if (Object.prototype.hasOwnProperty.call(t, r) && nr(t[r]))
      return !0;
  return !1;
}
function ml(t) {
  const e = [], r = t.data, n = t;
  return n.data = qr(r, e), n.attachments = e.length, { packet: n, buffers: e };
}
function qr(t, e) {
  if (!t)
    return t;
  if (cn(t)) {
    const r = { _placeholder: !0, num: e.length };
    return e.push(t), r;
  } else if (Array.isArray(t)) {
    const r = new Array(t.length);
    for (let n = 0; n < t.length; n++)
      r[n] = qr(t[n], e);
    return r;
  } else if (typeof t == "object" && !(t instanceof Date)) {
    const r = {};
    for (const n in t)
      Object.prototype.hasOwnProperty.call(t, n) && (r[n] = qr(t[n], e));
    return r;
  }
  return t;
}
function gl(t, e) {
  return t.data = Hr(t.data, e), delete t.attachments, t;
}
function Hr(t, e) {
  if (!t)
    return t;
  if (t && t._placeholder === !0) {
    if (typeof t.num == "number" && t.num >= 0 && t.num < e.length)
      return e[t.num];
    throw new Error("illegal attachments");
  } else if (Array.isArray(t))
    for (let r = 0; r < t.length; r++)
      t[r] = Hr(t[r], e);
  else if (typeof t == "object")
    for (const r in t)
      Object.prototype.hasOwnProperty.call(t, r) && (t[r] = Hr(t[r], e));
  return t;
}
const yl = [
  "connect",
  "connect_error",
  "disconnect",
  "disconnecting",
  "newListener",
  "removeListener"
  // used by the Node.js EventEmitter
], vl = 5;
var K;
(function(t) {
  t[t.CONNECT = 0] = "CONNECT", t[t.DISCONNECT = 1] = "DISCONNECT", t[t.EVENT = 2] = "EVENT", t[t.ACK = 3] = "ACK", t[t.CONNECT_ERROR = 4] = "CONNECT_ERROR", t[t.BINARY_EVENT = 5] = "BINARY_EVENT", t[t.BINARY_ACK = 6] = "BINARY_ACK";
})(K || (K = {}));
class _l {
  /**
   * Encoder constructor
   *
   * @param {function} replacer - custom replacer to pass down to JSON.parse
   */
  constructor(e) {
    this.replacer = e;
  }
  /**
   * Encode a packet as a single string if non-binary, or as a
   * buffer sequence, depending on packet type.
   *
   * @param {Object} obj - packet object
   */
  encode(e) {
    return (e.type === K.EVENT || e.type === K.ACK) && nr(e) ? this.encodeAsBinary({
      type: e.type === K.EVENT ? K.BINARY_EVENT : K.BINARY_ACK,
      nsp: e.nsp,
      data: e.data,
      id: e.id
    }) : [this.encodeAsString(e)];
  }
  /**
   * Encode packet as string.
   */
  encodeAsString(e) {
    let r = "" + e.type;
    return (e.type === K.BINARY_EVENT || e.type === K.BINARY_ACK) && (r += e.attachments + "-"), e.nsp && e.nsp !== "/" && (r += e.nsp + ","), e.id != null && (r += e.id), e.data != null && (r += JSON.stringify(e.data, this.replacer)), r;
  }
  /**
   * Encode packet as 'buffer sequence' by removing blobs, and
   * deconstructing packet into object with placeholders and
   * a list of buffers.
   */
  encodeAsBinary(e) {
    const r = ml(e), n = this.encodeAsString(r.packet), i = r.buffers;
    return i.unshift(n), i;
  }
}
function oi(t) {
  return Object.prototype.toString.call(t) === "[object Object]";
}
class un extends he {
  /**
   * Decoder constructor
   *
   * @param {function} reviver - custom reviver to pass down to JSON.stringify
   */
  constructor(e) {
    super(), this.reviver = e;
  }
  /**
   * Decodes an encoded packet string into packet JSON.
   *
   * @param {String} obj - encoded packet
   */
  add(e) {
    let r;
    if (typeof e == "string") {
      if (this.reconstructor)
        throw new Error("got plaintext data when reconstructing a packet");
      r = this.decodeString(e);
      const n = r.type === K.BINARY_EVENT;
      n || r.type === K.BINARY_ACK ? (r.type = n ? K.EVENT : K.ACK, this.reconstructor = new bl(r), r.attachments === 0 && super.emitReserved("decoded", r)) : super.emitReserved("decoded", r);
    } else if (cn(e) || e.base64)
      if (this.reconstructor)
        r = this.reconstructor.takeBinaryData(e), r && (this.reconstructor = null, super.emitReserved("decoded", r));
      else
        throw new Error("got binary data when not reconstructing a packet");
    else
      throw new Error("Unknown type: " + e);
  }
  /**
   * Decode a packet String (JSON data)
   *
   * @param {String} str
   * @return {Object} packet
   */
  decodeString(e) {
    let r = 0;
    const n = {
      type: Number(e.charAt(0))
    };
    if (K[n.type] === void 0)
      throw new Error("unknown packet type " + n.type);
    if (n.type === K.BINARY_EVENT || n.type === K.BINARY_ACK) {
      const o = r + 1;
      for (; e.charAt(++r) !== "-" && r != e.length; )
        ;
      const a = e.substring(o, r);
      if (a != Number(a) || e.charAt(r) !== "-")
        throw new Error("Illegal attachments");
      n.attachments = Number(a);
    }
    if (e.charAt(r + 1) === "/") {
      const o = r + 1;
      for (; ++r && !(e.charAt(r) === "," || r === e.length); )
        ;
      n.nsp = e.substring(o, r);
    } else
      n.nsp = "/";
    const i = e.charAt(r + 1);
    if (i !== "" && Number(i) == i) {
      const o = r + 1;
      for (; ++r; ) {
        const a = e.charAt(r);
        if (a == null || Number(a) != a) {
          --r;
          break;
        }
        if (r === e.length)
          break;
      }
      n.id = Number(e.substring(o, r + 1));
    }
    if (e.charAt(++r)) {
      const o = this.tryParse(e.substr(r));
      if (un.isPayloadValid(n.type, o))
        n.data = o;
      else
        throw new Error("invalid payload");
    }
    return n;
  }
  tryParse(e) {
    try {
      return JSON.parse(e, this.reviver);
    } catch {
      return !1;
    }
  }
  static isPayloadValid(e, r) {
    switch (e) {
      case K.CONNECT:
        return oi(r);
      case K.DISCONNECT:
        return r === void 0;
      case K.CONNECT_ERROR:
        return typeof r == "string" || oi(r);
      case K.EVENT:
      case K.BINARY_EVENT:
        return Array.isArray(r) && (typeof r[0] == "number" || typeof r[0] == "string" && yl.indexOf(r[0]) === -1);
      case K.ACK:
      case K.BINARY_ACK:
        return Array.isArray(r);
    }
  }
  /**
   * Deallocates a parser's resources
   */
  destroy() {
    this.reconstructor && (this.reconstructor.finishedReconstruction(), this.reconstructor = null);
  }
}
class bl {
  constructor(e) {
    this.packet = e, this.buffers = [], this.reconPack = e;
  }
  /**
   * Method to be called when binary data received from connection
   * after a BINARY_EVENT packet.
   *
   * @param {Buffer | ArrayBuffer} binData - the raw binary data received
   * @return {null | Object} returns null if more binary data is expected or
   *   a reconstructed packet object if all buffers have been received.
   */
  takeBinaryData(e) {
    if (this.buffers.push(e), this.buffers.length === this.reconPack.attachments) {
      const r = gl(this.reconPack, this.buffers);
      return this.finishedReconstruction(), r;
    }
    return null;
  }
  /**
   * Cleans up binary packet reconstruction variables.
   */
  finishedReconstruction() {
    this.reconPack = null, this.buffers = [];
  }
}
const El = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Decoder: un,
  Encoder: _l,
  get PacketType() {
    return K;
  },
  protocol: vl
}, Symbol.toStringTag, { value: "Module" }));
function ke(t, e, r) {
  return t.on(e, r), function() {
    t.off(e, r);
  };
}
const wl = Object.freeze({
  connect: 1,
  connect_error: 1,
  disconnect: 1,
  disconnecting: 1,
  // EventEmitter reserved events: https://nodejs.org/api/events.html#events_event_newlistener
  newListener: 1,
  removeListener: 1
});
class Hi extends he {
  /**
   * `Socket` constructor.
   */
  constructor(e, r, n) {
    super(), this.connected = !1, this.recovered = !1, this.receiveBuffer = [], this.sendBuffer = [], this._queue = [], this._queueSeq = 0, this.ids = 0, this.acks = {}, this.flags = {}, this.io = e, this.nsp = r, n && n.auth && (this.auth = n.auth), this._opts = Object.assign({}, n), this.io._autoConnect && this.open();
  }
  /**
   * Whether the socket is currently disconnected
   *
   * @example
   * const socket = io();
   *
   * socket.on("connect", () => {
   *   console.log(socket.disconnected); // false
   * });
   *
   * socket.on("disconnect", () => {
   *   console.log(socket.disconnected); // true
   * });
   */
  get disconnected() {
    return !this.connected;
  }
  /**
   * Subscribe to open, close and packet events
   *
   * @private
   */
  subEvents() {
    if (this.subs)
      return;
    const e = this.io;
    this.subs = [
      ke(e, "open", this.onopen.bind(this)),
      ke(e, "packet", this.onpacket.bind(this)),
      ke(e, "error", this.onerror.bind(this)),
      ke(e, "close", this.onclose.bind(this))
    ];
  }
  /**
   * Whether the Socket will try to reconnect when its Manager connects or reconnects.
   *
   * @example
   * const socket = io();
   *
   * console.log(socket.active); // true
   *
   * socket.on("disconnect", (reason) => {
   *   if (reason === "io server disconnect") {
   *     // the disconnection was initiated by the server, you need to manually reconnect
   *     console.log(socket.active); // false
   *   }
   *   // else the socket will automatically try to reconnect
   *   console.log(socket.active); // true
   * });
   */
  get active() {
    return !!this.subs;
  }
  /**
   * "Opens" the socket.
   *
   * @example
   * const socket = io({
   *   autoConnect: false
   * });
   *
   * socket.connect();
   */
  connect() {
    return this.connected ? this : (this.subEvents(), this.io._reconnecting || this.io.open(), this.io._readyState === "open" && this.onopen(), this);
  }
  /**
   * Alias for {@link connect()}.
   */
  open() {
    return this.connect();
  }
  /**
   * Sends a `message` event.
   *
   * This method mimics the WebSocket.send() method.
   *
   * @see https://developer.mozilla.org/en-US/docs/Web/API/WebSocket/send
   *
   * @example
   * socket.send("hello");
   *
   * // this is equivalent to
   * socket.emit("message", "hello");
   *
   * @return self
   */
  send(...e) {
    return e.unshift("message"), this.emit.apply(this, e), this;
  }
  /**
   * Override `emit`.
   * If the event is in `events`, it's emitted normally.
   *
   * @example
   * socket.emit("hello", "world");
   *
   * // all serializable datastructures are supported (no need to call JSON.stringify)
   * socket.emit("hello", 1, "2", { 3: ["4"], 5: Uint8Array.from([6]) });
   *
   * // with an acknowledgement from the server
   * socket.emit("hello", "world", (val) => {
   *   // ...
   * });
   *
   * @return self
   */
  emit(e, ...r) {
    var n, i, o;
    if (wl.hasOwnProperty(e))
      throw new Error('"' + e.toString() + '" is a reserved event name');
    if (r.unshift(e), this._opts.retries && !this.flags.fromQueue && !this.flags.volatile)
      return this._addToQueue(r), this;
    const a = {
      type: K.EVENT,
      data: r
    };
    if (a.options = {}, a.options.compress = this.flags.compress !== !1, typeof r[r.length - 1] == "function") {
      const h = this.ids++, u = r.pop();
      this._registerAckCallback(h, u), a.id = h;
    }
    const d = (i = (n = this.io.engine) === null || n === void 0 ? void 0 : n.transport) === null || i === void 0 ? void 0 : i.writable, l = this.connected && !(!((o = this.io.engine) === null || o === void 0) && o._hasPingExpired());
    return this.flags.volatile && !d || (l ? (this.notifyOutgoingListeners(a), this.packet(a)) : this.sendBuffer.push(a)), this.flags = {}, this;
  }
  /**
   * @private
   */
  _registerAckCallback(e, r) {
    var n;
    const i = (n = this.flags.timeout) !== null && n !== void 0 ? n : this._opts.ackTimeout;
    if (i === void 0) {
      this.acks[e] = r;
      return;
    }
    const o = this.io.setTimeoutFn(() => {
      delete this.acks[e];
      for (let d = 0; d < this.sendBuffer.length; d++)
        this.sendBuffer[d].id === e && this.sendBuffer.splice(d, 1);
      r.call(this, new Error("operation has timed out"));
    }, i), a = (...d) => {
      this.io.clearTimeoutFn(o), r.apply(this, d);
    };
    a.withError = !0, this.acks[e] = a;
  }
  /**
   * Emits an event and waits for an acknowledgement
   *
   * @example
   * // without timeout
   * const response = await socket.emitWithAck("hello", "world");
   *
   * // with a specific timeout
   * try {
   *   const response = await socket.timeout(1000).emitWithAck("hello", "world");
   * } catch (err) {
   *   // the server did not acknowledge the event in the given delay
   * }
   *
   * @return a Promise that will be fulfilled when the server acknowledges the event
   */
  emitWithAck(e, ...r) {
    return new Promise((n, i) => {
      const o = (a, d) => a ? i(a) : n(d);
      o.withError = !0, r.push(o), this.emit(e, ...r);
    });
  }
  /**
   * Add the packet to the queue.
   * @param args
   * @private
   */
  _addToQueue(e) {
    let r;
    typeof e[e.length - 1] == "function" && (r = e.pop());
    const n = {
      id: this._queueSeq++,
      tryCount: 0,
      pending: !1,
      args: e,
      flags: Object.assign({ fromQueue: !0 }, this.flags)
    };
    e.push((i, ...o) => n !== this._queue[0] ? void 0 : (i !== null ? n.tryCount > this._opts.retries && (this._queue.shift(), r && r(i)) : (this._queue.shift(), r && r(null, ...o)), n.pending = !1, this._drainQueue())), this._queue.push(n), this._drainQueue();
  }
  /**
   * Send the first packet of the queue, and wait for an acknowledgement from the server.
   * @param force - whether to resend a packet that has not been acknowledged yet
   *
   * @private
   */
  _drainQueue(e = !1) {
    if (!this.connected || this._queue.length === 0)
      return;
    const r = this._queue[0];
    r.pending && !e || (r.pending = !0, r.tryCount++, this.flags = r.flags, this.emit.apply(this, r.args));
  }
  /**
   * Sends a packet.
   *
   * @param packet
   * @private
   */
  packet(e) {
    e.nsp = this.nsp, this.io._packet(e);
  }
  /**
   * Called upon engine `open`.
   *
   * @private
   */
  onopen() {
    typeof this.auth == "function" ? this.auth((e) => {
      this._sendConnectPacket(e);
    }) : this._sendConnectPacket(this.auth);
  }
  /**
   * Sends a CONNECT packet to initiate the Socket.IO session.
   *
   * @param data
   * @private
   */
  _sendConnectPacket(e) {
    this.packet({
      type: K.CONNECT,
      data: this._pid ? Object.assign({ pid: this._pid, offset: this._lastOffset }, e) : e
    });
  }
  /**
   * Called upon engine or manager `error`.
   *
   * @param err
   * @private
   */
  onerror(e) {
    this.connected || this.emitReserved("connect_error", e);
  }
  /**
   * Called upon engine `close`.
   *
   * @param reason
   * @param description
   * @private
   */
  onclose(e, r) {
    this.connected = !1, delete this.id, this.emitReserved("disconnect", e, r), this._clearAcks();
  }
  /**
   * Clears the acknowledgement handlers upon disconnection, since the client will never receive an acknowledgement from
   * the server.
   *
   * @private
   */
  _clearAcks() {
    Object.keys(this.acks).forEach((e) => {
      if (!this.sendBuffer.some((n) => String(n.id) === e)) {
        const n = this.acks[e];
        delete this.acks[e], n.withError && n.call(this, new Error("socket has been disconnected"));
      }
    });
  }
  /**
   * Called with socket packet.
   *
   * @param packet
   * @private
   */
  onpacket(e) {
    if (e.nsp === this.nsp)
      switch (e.type) {
        case K.CONNECT:
          e.data && e.data.sid ? this.onconnect(e.data.sid, e.data.pid) : this.emitReserved("connect_error", new Error("It seems you are trying to reach a Socket.IO server in v2.x with a v3.x client, but they are not compatible (more information here: https://socket.io/docs/v3/migrating-from-2-x-to-3-0/)"));
          break;
        case K.EVENT:
        case K.BINARY_EVENT:
          this.onevent(e);
          break;
        case K.ACK:
        case K.BINARY_ACK:
          this.onack(e);
          break;
        case K.DISCONNECT:
          this.ondisconnect();
          break;
        case K.CONNECT_ERROR:
          this.destroy();
          const n = new Error(e.data.message);
          n.data = e.data.data, this.emitReserved("connect_error", n);
          break;
      }
  }
  /**
   * Called upon a server event.
   *
   * @param packet
   * @private
   */
  onevent(e) {
    const r = e.data || [];
    e.id != null && r.push(this.ack(e.id)), this.connected ? this.emitEvent(r) : this.receiveBuffer.push(Object.freeze(r));
  }
  emitEvent(e) {
    if (this._anyListeners && this._anyListeners.length) {
      const r = this._anyListeners.slice();
      for (const n of r)
        n.apply(this, e);
    }
    super.emit.apply(this, e), this._pid && e.length && typeof e[e.length - 1] == "string" && (this._lastOffset = e[e.length - 1]);
  }
  /**
   * Produces an ack callback to emit with an event.
   *
   * @private
   */
  ack(e) {
    const r = this;
    let n = !1;
    return function(...i) {
      n || (n = !0, r.packet({
        type: K.ACK,
        id: e,
        data: i
      }));
    };
  }
  /**
   * Called upon a server acknowledgement.
   *
   * @param packet
   * @private
   */
  onack(e) {
    const r = this.acks[e.id];
    typeof r == "function" && (delete this.acks[e.id], r.withError && e.data.unshift(null), r.apply(this, e.data));
  }
  /**
   * Called upon server connect.
   *
   * @private
   */
  onconnect(e, r) {
    this.id = e, this.recovered = r && this._pid === r, this._pid = r, this.connected = !0, this.emitBuffered(), this.emitReserved("connect"), this._drainQueue(!0);
  }
  /**
   * Emit buffered events (received and emitted).
   *
   * @private
   */
  emitBuffered() {
    this.receiveBuffer.forEach((e) => this.emitEvent(e)), this.receiveBuffer = [], this.sendBuffer.forEach((e) => {
      this.notifyOutgoingListeners(e), this.packet(e);
    }), this.sendBuffer = [];
  }
  /**
   * Called upon server disconnect.
   *
   * @private
   */
  ondisconnect() {
    this.destroy(), this.onclose("io server disconnect");
  }
  /**
   * Called upon forced client/server side disconnections,
   * this method ensures the manager stops tracking us and
   * that reconnections don't get triggered for this.
   *
   * @private
   */
  destroy() {
    this.subs && (this.subs.forEach((e) => e()), this.subs = void 0), this.io._destroy(this);
  }
  /**
   * Disconnects the socket manually. In that case, the socket will not try to reconnect.
   *
   * If this is the last active Socket instance of the {@link Manager}, the low-level connection will be closed.
   *
   * @example
   * const socket = io();
   *
   * socket.on("disconnect", (reason) => {
   *   // console.log(reason); prints "io client disconnect"
   * });
   *
   * socket.disconnect();
   *
   * @return self
   */
  disconnect() {
    return this.connected && this.packet({ type: K.DISCONNECT }), this.destroy(), this.connected && this.onclose("io client disconnect"), this;
  }
  /**
   * Alias for {@link disconnect()}.
   *
   * @return self
   */
  close() {
    return this.disconnect();
  }
  /**
   * Sets the compress flag.
   *
   * @example
   * socket.compress(false).emit("hello");
   *
   * @param compress - if `true`, compresses the sending data
   * @return self
   */
  compress(e) {
    return this.flags.compress = e, this;
  }
  /**
   * Sets a modifier for a subsequent event emission that the event message will be dropped when this socket is not
   * ready to send messages.
   *
   * @example
   * socket.volatile.emit("hello"); // the server may or may not receive it
   *
   * @returns self
   */
  get volatile() {
    return this.flags.volatile = !0, this;
  }
  /**
   * Sets a modifier for a subsequent event emission that the callback will be called with an error when the
   * given number of milliseconds have elapsed without an acknowledgement from the server:
   *
   * @example
   * socket.timeout(5000).emit("my-event", (err) => {
   *   if (err) {
   *     // the server did not acknowledge the event in the given delay
   *   }
   * });
   *
   * @returns self
   */
  timeout(e) {
    return this.flags.timeout = e, this;
  }
  /**
   * Adds a listener that will be fired when any event is emitted. The event name is passed as the first argument to the
   * callback.
   *
   * @example
   * socket.onAny((event, ...args) => {
   *   console.log(`got ${event}`);
   * });
   *
   * @param listener
   */
  onAny(e) {
    return this._anyListeners = this._anyListeners || [], this._anyListeners.push(e), this;
  }
  /**
   * Adds a listener that will be fired when any event is emitted. The event name is passed as the first argument to the
   * callback. The listener is added to the beginning of the listeners array.
   *
   * @example
   * socket.prependAny((event, ...args) => {
   *   console.log(`got event ${event}`);
   * });
   *
   * @param listener
   */
  prependAny(e) {
    return this._anyListeners = this._anyListeners || [], this._anyListeners.unshift(e), this;
  }
  /**
   * Removes the listener that will be fired when any event is emitted.
   *
   * @example
   * const catchAllListener = (event, ...args) => {
   *   console.log(`got event ${event}`);
   * }
   *
   * socket.onAny(catchAllListener);
   *
   * // remove a specific listener
   * socket.offAny(catchAllListener);
   *
   * // or remove all listeners
   * socket.offAny();
   *
   * @param listener
   */
  offAny(e) {
    if (!this._anyListeners)
      return this;
    if (e) {
      const r = this._anyListeners;
      for (let n = 0; n < r.length; n++)
        if (e === r[n])
          return r.splice(n, 1), this;
    } else
      this._anyListeners = [];
    return this;
  }
  /**
   * Returns an array of listeners that are listening for any event that is specified. This array can be manipulated,
   * e.g. to remove listeners.
   */
  listenersAny() {
    return this._anyListeners || [];
  }
  /**
   * Adds a listener that will be fired when any event is emitted. The event name is passed as the first argument to the
   * callback.
   *
   * Note: acknowledgements sent to the server are not included.
   *
   * @example
   * socket.onAnyOutgoing((event, ...args) => {
   *   console.log(`sent event ${event}`);
   * });
   *
   * @param listener
   */
  onAnyOutgoing(e) {
    return this._anyOutgoingListeners = this._anyOutgoingListeners || [], this._anyOutgoingListeners.push(e), this;
  }
  /**
   * Adds a listener that will be fired when any event is emitted. The event name is passed as the first argument to the
   * callback. The listener is added to the beginning of the listeners array.
   *
   * Note: acknowledgements sent to the server are not included.
   *
   * @example
   * socket.prependAnyOutgoing((event, ...args) => {
   *   console.log(`sent event ${event}`);
   * });
   *
   * @param listener
   */
  prependAnyOutgoing(e) {
    return this._anyOutgoingListeners = this._anyOutgoingListeners || [], this._anyOutgoingListeners.unshift(e), this;
  }
  /**
   * Removes the listener that will be fired when any event is emitted.
   *
   * @example
   * const catchAllListener = (event, ...args) => {
   *   console.log(`sent event ${event}`);
   * }
   *
   * socket.onAnyOutgoing(catchAllListener);
   *
   * // remove a specific listener
   * socket.offAnyOutgoing(catchAllListener);
   *
   * // or remove all listeners
   * socket.offAnyOutgoing();
   *
   * @param [listener] - the catch-all listener (optional)
   */
  offAnyOutgoing(e) {
    if (!this._anyOutgoingListeners)
      return this;
    if (e) {
      const r = this._anyOutgoingListeners;
      for (let n = 0; n < r.length; n++)
        if (e === r[n])
          return r.splice(n, 1), this;
    } else
      this._anyOutgoingListeners = [];
    return this;
  }
  /**
   * Returns an array of listeners that are listening for any event that is specified. This array can be manipulated,
   * e.g. to remove listeners.
   */
  listenersAnyOutgoing() {
    return this._anyOutgoingListeners || [];
  }
  /**
   * Notify the listeners for each packet sent
   *
   * @param packet
   *
   * @private
   */
  notifyOutgoingListeners(e) {
    if (this._anyOutgoingListeners && this._anyOutgoingListeners.length) {
      const r = this._anyOutgoingListeners.slice();
      for (const n of r)
        n.apply(this, e.data);
    }
  }
}
function _t(t) {
  t = t || {}, this.ms = t.min || 100, this.max = t.max || 1e4, this.factor = t.factor || 2, this.jitter = t.jitter > 0 && t.jitter <= 1 ? t.jitter : 0, this.attempts = 0;
}
_t.prototype.duration = function() {
  var t = this.ms * Math.pow(this.factor, this.attempts++);
  if (this.jitter) {
    var e = Math.random(), r = Math.floor(e * this.jitter * t);
    t = Math.floor(e * 10) & 1 ? t + r : t - r;
  }
  return Math.min(t, this.max) | 0;
};
_t.prototype.reset = function() {
  this.attempts = 0;
};
_t.prototype.setMin = function(t) {
  this.ms = t;
};
_t.prototype.setMax = function(t) {
  this.max = t;
};
_t.prototype.setJitter = function(t) {
  this.jitter = t;
};
class $r extends he {
  constructor(e, r) {
    var n;
    super(), this.nsps = {}, this.subs = [], e && typeof e == "object" && (r = e, e = void 0), r = r || {}, r.path = r.path || "/socket.io", this.opts = r, mr(this, r), this.reconnection(r.reconnection !== !1), this.reconnectionAttempts(r.reconnectionAttempts || 1 / 0), this.reconnectionDelay(r.reconnectionDelay || 1e3), this.reconnectionDelayMax(r.reconnectionDelayMax || 5e3), this.randomizationFactor((n = r.randomizationFactor) !== null && n !== void 0 ? n : 0.5), this.backoff = new _t({
      min: this.reconnectionDelay(),
      max: this.reconnectionDelayMax(),
      jitter: this.randomizationFactor()
    }), this.timeout(r.timeout == null ? 2e4 : r.timeout), this._readyState = "closed", this.uri = e;
    const i = r.parser || El;
    this.encoder = new i.Encoder(), this.decoder = new i.Decoder(), this._autoConnect = r.autoConnect !== !1, this._autoConnect && this.open();
  }
  reconnection(e) {
    return arguments.length ? (this._reconnection = !!e, e || (this.skipReconnect = !0), this) : this._reconnection;
  }
  reconnectionAttempts(e) {
    return e === void 0 ? this._reconnectionAttempts : (this._reconnectionAttempts = e, this);
  }
  reconnectionDelay(e) {
    var r;
    return e === void 0 ? this._reconnectionDelay : (this._reconnectionDelay = e, (r = this.backoff) === null || r === void 0 || r.setMin(e), this);
  }
  randomizationFactor(e) {
    var r;
    return e === void 0 ? this._randomizationFactor : (this._randomizationFactor = e, (r = this.backoff) === null || r === void 0 || r.setJitter(e), this);
  }
  reconnectionDelayMax(e) {
    var r;
    return e === void 0 ? this._reconnectionDelayMax : (this._reconnectionDelayMax = e, (r = this.backoff) === null || r === void 0 || r.setMax(e), this);
  }
  timeout(e) {
    return arguments.length ? (this._timeout = e, this) : this._timeout;
  }
  /**
   * Starts trying to reconnect if reconnection is enabled and we have not
   * started reconnecting yet
   *
   * @private
   */
  maybeReconnectOnOpen() {
    !this._reconnecting && this._reconnection && this.backoff.attempts === 0 && this.reconnect();
  }
  /**
   * Sets the current transport `socket`.
   *
   * @param {Function} fn - optional, callback
   * @return self
   * @public
   */
  open(e) {
    if (~this._readyState.indexOf("open"))
      return this;
    this.engine = new cl(this.uri, this.opts);
    const r = this.engine, n = this;
    this._readyState = "opening", this.skipReconnect = !1;
    const i = ke(r, "open", function() {
      n.onopen(), e && e();
    }), o = (d) => {
      this.cleanup(), this._readyState = "closed", this.emitReserved("error", d), e ? e(d) : this.maybeReconnectOnOpen();
    }, a = ke(r, "error", o);
    if (this._timeout !== !1) {
      const d = this._timeout, l = this.setTimeoutFn(() => {
        i(), o(new Error("timeout")), r.close();
      }, d);
      this.opts.autoUnref && l.unref(), this.subs.push(() => {
        this.clearTimeoutFn(l);
      });
    }
    return this.subs.push(i), this.subs.push(a), this;
  }
  /**
   * Alias for open()
   *
   * @return self
   * @public
   */
  connect(e) {
    return this.open(e);
  }
  /**
   * Called upon transport open.
   *
   * @private
   */
  onopen() {
    this.cleanup(), this._readyState = "open", this.emitReserved("open");
    const e = this.engine;
    this.subs.push(
      ke(e, "ping", this.onping.bind(this)),
      ke(e, "data", this.ondata.bind(this)),
      ke(e, "error", this.onerror.bind(this)),
      ke(e, "close", this.onclose.bind(this)),
      // @ts-ignore
      ke(this.decoder, "decoded", this.ondecoded.bind(this))
    );
  }
  /**
   * Called upon a ping.
   *
   * @private
   */
  onping() {
    this.emitReserved("ping");
  }
  /**
   * Called with data.
   *
   * @private
   */
  ondata(e) {
    try {
      this.decoder.add(e);
    } catch (r) {
      this.onclose("parse error", r);
    }
  }
  /**
   * Called when parser fully decodes a packet.
   *
   * @private
   */
  ondecoded(e) {
    pr(() => {
      this.emitReserved("packet", e);
    }, this.setTimeoutFn);
  }
  /**
   * Called upon socket error.
   *
   * @private
   */
  onerror(e) {
    this.emitReserved("error", e);
  }
  /**
   * Creates a new socket for the given `nsp`.
   *
   * @return {Socket}
   * @public
   */
  socket(e, r) {
    let n = this.nsps[e];
    return n ? this._autoConnect && !n.active && n.connect() : (n = new Hi(this, e, r), this.nsps[e] = n), n;
  }
  /**
   * Called upon a socket close.
   *
   * @param socket
   * @private
   */
  _destroy(e) {
    const r = Object.keys(this.nsps);
    for (const n of r)
      if (this.nsps[n].active)
        return;
    this._close();
  }
  /**
   * Writes a packet.
   *
   * @param packet
   * @private
   */
  _packet(e) {
    const r = this.encoder.encode(e);
    for (let n = 0; n < r.length; n++)
      this.engine.write(r[n], e.options);
  }
  /**
   * Clean up transport subscriptions and packet buffer.
   *
   * @private
   */
  cleanup() {
    this.subs.forEach((e) => e()), this.subs.length = 0, this.decoder.destroy();
  }
  /**
   * Close the current socket.
   *
   * @private
   */
  _close() {
    this.skipReconnect = !0, this._reconnecting = !1, this.onclose("forced close");
  }
  /**
   * Alias for close()
   *
   * @private
   */
  disconnect() {
    return this._close();
  }
  /**
   * Called when:
   *
   * - the low-level engine is closed
   * - the parser encountered a badly formatted packet
   * - all sockets are disconnected
   *
   * @private
   */
  onclose(e, r) {
    var n;
    this.cleanup(), (n = this.engine) === null || n === void 0 || n.close(), this.backoff.reset(), this._readyState = "closed", this.emitReserved("close", e, r), this._reconnection && !this.skipReconnect && this.reconnect();
  }
  /**
   * Attempt a reconnection.
   *
   * @private
   */
  reconnect() {
    if (this._reconnecting || this.skipReconnect)
      return this;
    const e = this;
    if (this.backoff.attempts >= this._reconnectionAttempts)
      this.backoff.reset(), this.emitReserved("reconnect_failed"), this._reconnecting = !1;
    else {
      const r = this.backoff.duration();
      this._reconnecting = !0;
      const n = this.setTimeoutFn(() => {
        e.skipReconnect || (this.emitReserved("reconnect_attempt", e.backoff.attempts), !e.skipReconnect && e.open((i) => {
          i ? (e._reconnecting = !1, e.reconnect(), this.emitReserved("reconnect_error", i)) : e.onreconnect();
        }));
      }, r);
      this.opts.autoUnref && n.unref(), this.subs.push(() => {
        this.clearTimeoutFn(n);
      });
    }
  }
  /**
   * Called upon successful reconnect.
   *
   * @private
   */
  onreconnect() {
    const e = this.backoff.attempts;
    this._reconnecting = !1, this.backoff.reset(), this.emitReserved("reconnect", e);
  }
}
const Dt = {};
function ir(t, e) {
  typeof t == "object" && (e = t, t = void 0), e = e || {};
  const r = ul(t, e.path || "/socket.io"), n = r.source, i = r.id, o = r.path, a = Dt[i] && o in Dt[i].nsps, d = e.forceNew || e["force new connection"] || e.multiplex === !1 || a;
  let l;
  return d ? l = new $r(n, e) : (Dt[i] || (Dt[i] = new $r(n, e)), l = Dt[i]), r.query && !e.query && (e.query = r.queryKey), l.socket(r.path, e);
}
Object.assign(ir, {
  Manager: $r,
  Socket: Hi,
  io: ir,
  connect: ir
});
const $i = (() => {
  try {
    const t = new URLSearchParams(window.location.search);
    if (t.has("verbose") || t.get("v") === "1" || localStorage.getItem("wp_verbose") === "1") return !0;
  } catch {
  }
  return !1;
})();
function ce(t, e) {
  $i && (e !== void 0 ? console.debug("[wp]", t, e) : console.debug("[wp]", t));
}
function Se() {
  return $i;
}
let pe = null, st = null, ai = null;
function xl(t) {
  const e = Bt(), r = G.getState();
  if (r.me.clientId && r.roster[r.me.clientId])
    return (t.name || t.sprite) && (ce("identity_update_emit", { name: t.name, sprite: t.sprite }), e.emit("identity_update", { name: t.name, sprite: t.sprite })), e;
  const n = Sl(t), i = () => {
    setTimeout(() => {
      const o = G.getState();
      o.name && (ce("identity_update_emit_post_join", { name: o.name, sprite: o.sprite }), e.emit("identity_update", { name: o.name, sprite: o.sprite || void 0 }));
    }, 40);
  };
  return e.connected ? (ce("join_emit", n), e.emit("join", n), i()) : e.once("connect", () => {
    ce("join_emit", n), e.emit("join", n), i();
  }), e;
}
function Sl(t) {
  return {
    room_key: t.room_key,
    leader_key: t.leader_key || void 0,
    override: t.override || void 0,
    name: t.name,
    sprite: t.sprite
  };
}
function Bt() {
  if (!pe) {
    let t = "/";
    if (t === "/" && typeof window < "u") {
      const e = window.location;
      (e.hostname === "localhost" || e.hostname === "127.0.0.1") && e.port === "5173" && (t = `${e.protocol}//${e.hostname}:8080`, ce("socket_origin_fallback", { origin: t }));
    }
    pe = ir(t, { path: "/watchparty/ws", transports: ["websocket"] }), ce("socket_init", { origin: t }), pe.on("connect", () => {
      const e = pe == null ? void 0 : pe.id;
      if (ce("socket_connect", { id: e }), e)
        try {
          G.getState().ensureMe(e);
        } catch {
        }
    }), pe.on("disconnect", (e) => ce("socket_disconnect", { reason: e })), pe.on("connect_error", (e) => ce("socket_connect_error", { message: e == null ? void 0 : e.message })), pe.on("reconnect_attempt", (e) => ce("socket_reconnect_attempt", { attempt: e })), pe.on("reconnect_failed", () => ce("socket_reconnect_failed")), Rl(pe);
  }
  return pe;
}
function Rl(t) {
  G.getState(), t.on("snapshot", (e) => {
    var i;
    e != null && e.client_id && G.getState().ensureMe(e.client_id);
    const r = ((e == null ? void 0 : e.users) || []).map((o) => ({
      clientId: o.client_id,
      name: o.name || "Anon",
      sprite: o.sprite_id ?? o.sprite ?? null,
      isLeader: o.client_id === e.leader_id
    }));
    G.getState().applySnapshot({
      mediaId: e.media_id ?? null,
      playheadMs: e.playhead_ms || 0,
      playing: !!e.playing,
      serverSeq: e.server_seq || 0,
      leaderId: e.leader_id || null,
      users: r
    });
    const n = G.getState();
    if (!n.name) {
      (i = n.ensureAutoIdentity) == null || i.call(n);
      const o = G.getState();
      o.name && (ce("identity_auto_assign", { name: o.name, sprite: o.sprite }), t.emit("identity_update", { name: o.name, sprite: o.sprite || void 0 }));
    }
    ce("snapshot", e);
  }), ai || (ai = setInterval(() => {
    Ol();
  }, 5e3)), t.on("presence", (e) => {
    var n;
    if (!e) return;
    if (Array.isArray(e.users)) {
      const i = {};
      for (const d of e.users)
        i[d.client_id] = {
          clientId: d.client_id,
          name: d.name || "Anon",
          sprite: d.sprite_id ?? d.sprite ?? null,
          isLeader: d.is_leader
        };
      const o = G.getState(), a = pe == null ? void 0 : pe.id;
      a && i[a] && (o.name && (i[a].name = o.name), o.sprite && (i[a].sprite = o.sprite)), o.roster = i, G.setState({ roster: i });
    } else if (e.kind && e.user)
      if (e.kind === "leave")
        G.getState().removeUser(e.user.client_id);
      else {
        G.getState().upsertUser({
          clientId: e.user.client_id,
          name: e.user.name || "",
          sprite: e.user.sprite_id ?? e.user.sprite ?? null,
          isLeader: e.user.is_leader
        });
        const i = G.getState(), o = pe == null ? void 0 : pe.id;
        o && o === e.user.client_id && i.name && G.getState().upsertUser({
          clientId: o,
          name: i.name,
          sprite: i.sprite,
          isLeader: e.user.is_leader
        });
      }
    ce("presence", e);
    const r = G.getState();
    if (!r.name) {
      (n = r.ensureAutoIdentity) == null || n.call(r);
      const i = G.getState();
      i.name && (ce("identity_auto_assign_presence", { name: i.name, sprite: i.sprite }), t.emit("identity_update", { name: i.name, sprite: i.sprite || void 0 }));
    }
  }), t.on("control_broadcast", (e) => {
    const r = G.getState();
    if (Object.prototype.hasOwnProperty.call(e, "media_id")) {
      const n = e.media_id ?? null;
      r.snapshot.mediaId !== n && (r.applySnapshot({ mediaId: n }), n && r.setReadiness({ mediaId: n, ready: !1, readyCount: 0, total: 0 }));
    }
    r.updateControlState({
      playheadMs: e.playhead_ms,
      playing: e.playing,
      serverSeq: e.server_seq,
      leaderId: e.leader_id ?? r.snapshot.leaderId
    }), ce("control_broadcast", e);
  }), t.on("ready_state", (e) => {
    e && (G.getState().setReadiness({
      mediaId: e.media_id,
      ready: !!e.ready,
      readyCount: e.ready_count ?? e.readyCount ?? 0,
      total: e.total ?? 0
    }), ce("ready_state", e));
  }), t.on("control_ack", (e) => {
    typeof (e == null ? void 0 : e.client_seq) == "number" && typeof (e == null ? void 0 : e.server_seq) == "number" && (G.getState().recordAck(e.client_seq, e.server_seq), ce("control_ack", e));
  }), t.on("time_ping", (e) => {
    if (t.emit("time_pong", { id: e == null ? void 0 : e.id }), st && st.ts) {
      const r = Date.now() - st.ts;
      G.getState().addRttSample(r, e == null ? void 0 : e.server_time_ms, st.ts), st = null, ce("time_rtt", { rtt: r, offset: G.getState().drift.offsetMs });
    }
  }), t.on("chat_broadcast", (e) => {
    const r = {
      id: String(e.id ?? e.server_seq ?? Date.now()),
      clientId: e.client_id,
      name: e.name || "Anon",
      sprite: e.sprite ?? null,
      text: e.text || "",
      ts: e.ts || Date.now()
    };
    G.getState().appendChat(r), ce("chat", r);
  }), t.on("error", (e) => {
    console.warn("[error]", e);
    const r = (e == null ? void 0 : e.code) || "error/unknown", n = {
      "control/forbidden": "You are not the leader.",
      "control/stale_seq": "Stale control sequence.",
      "control/seq_gap": "Control sequence gap detected.",
      "rate/limited": "Rate limited. Slow down.",
      "payload/too_large": "Payload too large.",
      "room/full": "Room is full.",
      "auth/invalid_key": "Invalid leader key.",
      origin_block: "Origin not allowed."
    };
    G.getState().pushToast("error", n[r] || r);
  });
}
function Ol() {
  st || (st = { ts: Date.now() }, Bt().emit("time_ping", {}));
}
function Tl(t, e) {
  const r = {};
  r.name = t, e && (r.sprite = e), !(!r.name && !r.sprite) && (ce("identity_update_emit", r), Bt().emit("identity_update", r));
}
function Nl({ mediaUrl: t, indexUrl: e, mediaId: r }) {
  const n = Xe(null), [i, o] = Re(!1), [a, d] = Re([]), [l, c] = Re(null), h = G((m) => m.readiness), u = G((m) => m.snapshot), s = Xe(!1), f = Xe(null), b = Xe(null), v = Xe(null);
  Ce(() => {
    let m = !1;
    return (async () => {
      var O;
      try {
        const x = await fetch(e, { cache: "no-store" });
        if (!x.ok) return;
        const C = await x.json();
        if (m) return;
        d(C.fragments || []), c(C.duration_ms || null), Se() && console.debug("[wp] index_loaded", { count: (O = C.fragments) == null ? void 0 : O.length, duration: C.duration_ms });
      } catch (x) {
        Se() && console.debug("[wp] index_error", x == null ? void 0 : x.message);
      }
    })(), () => {
      m = !0;
    };
  }, [e]), Ce(() => {
    let m = null;
    const O = new MediaSource();
    b.current = O, n.current && (m = URL.createObjectURL(O), n.current.src = m);
    const x = () => {
      try {
        const C = O.addSourceBuffer('video/mp4; codecs="avc1.4d401e, mp4a.40.2"');
        f.current = C, C.addEventListener("error", () => {
          Se() && console.debug("[wp] sb_error");
        }), a.length && w();
      } catch (C) {
        Se() && console.debug("[wp] mse_source_error", C == null ? void 0 : C.message);
      }
    };
    return O.addEventListener("sourceopen", x), () => {
      O.removeEventListener("sourceopen", x), m && URL.revokeObjectURL(m), v.current && v.current.abort();
    };
  }, [t, r]), Ce(() => {
    var m;
    ((m = b.current) == null ? void 0 : m.readyState) === "open" && f.current && a.length && !s.current && w();
  }, [a]);
  function w() {
    if (!a.length || !f.current) return;
    const m = a[0], O = `bytes=${m.start_byte}-${m.end_byte}`, x = new AbortController();
    v.current = x, fetch(t, { headers: { Range: O }, signal: x.signal }).then((C) => C.arrayBuffer()).then((C) => {
      f.current && (f.current.addEventListener("updateend", E, { once: !0 }), f.current.appendBuffer(C));
    }).catch((C) => {
      Se() && console.debug("[wp] init_fetch_error", C == null ? void 0 : C.message);
    });
  }
  function E() {
    s.current || (s.current = !0, Bt().emit("client_ready", { media_id: r, first_appended: !0 }), Se() && console.debug("[wp] client_ready emitted", { mediaId: r })), o(!0);
  }
  return Ce(() => {
    const m = n.current;
    if (!m) return;
    u.playing ? m.paused && m.play().catch(() => {
    }) : m.paused || m.pause();
    const O = u.playheadMs;
    if (typeof O == "number" && i) {
      const x = m.currentTime * 1e3, C = O - x, M = Math.abs(C);
      M > 500 ? (m.currentTime = O / 1e3, Se() && console.debug("[wp] drift_snap", { drift: C })) : M > 80 && (m.currentTime = O / 1e3, Se() && console.debug("[wp] drift_nudge", { drift: C }));
    }
  }, [u.playing, u.playheadMs, i]), /* @__PURE__ */ S.jsxs("div", { className: "relative w-full h-full bg-black", children: [
    /* @__PURE__ */ S.jsx("video", { ref: n, className: "w-full h-full", playsInline: !0, muted: !0 }),
    !h.ready && /* @__PURE__ */ S.jsx("div", { className: "absolute inset-0 flex items-center justify-center pointer-events-none", children: /* @__PURE__ */ S.jsxs("div", { className: "px-4 py-2 rounded bg-slate-900/80 text-xs font-medium", children: [
      "Syncing… (",
      h.readyCount,
      "/",
      h.total,
      ")"
    ] }) }),
    l && /* @__PURE__ */ S.jsxs("div", { className: "absolute bottom-2 right-2 text-[10px] opacity-60 bg-black/40 px-2 py-1 rounded", children: [
      (l / 1e3).toFixed(0),
      "s"
    ] })
  ] });
}
let lt = null;
const Cl = 6e4;
async function Wr(t = "") {
  var a, d;
  const e = Date.now();
  if (lt && lt.prefix === t && e - lt.ts < Cl)
    return lt.data;
  const n = `${"http://localhost:8080".replace(/\/$/, "")}/api/catalog${t ? `?prefix=${encodeURIComponent(t)}` : ""}`, i = await fetch(n, { cache: "no-store" });
  if (!i.ok) throw new Error(`catalog_http_${i.status}`);
  const o = await i.json();
  return Se() && console.debug("[wp] catalog_fetch", { prefix: t, dirs: (a = o.dirs) == null ? void 0 : a.length, files: (d = o.files) == null ? void 0 : d.length }), lt = { ts: e, prefix: t, data: o }, o;
}
function Dl(t) {
  lt && (lt = null);
}
function Wi(t, e) {
  const n = G.getState().allocateClientSeq(), i = { kind: t, client_seq: n, ...e || {} };
  return Bt().emit("control", i), n;
}
function Al(t) {
  return Wi("load", { media_id: t });
}
function kl() {
  return Wi("home");
}
async function Ll() {
  if (Se())
    try {
      const t = ["output/fmp4/anime", "output/fmp4/movie", "output/fmp4/tv"];
      for (const e of t) {
        const r = await Wr(e);
        console.debug("[wp][probe] catalog", e, { dirs: r.dirs.length, files: r.files.length });
        const n = r.files[0];
        if (n) {
          const i = Ml(), o = `${i}/${n.id}/index.json`.replace(/\\/g, "/"), a = `${i}/${n.id}/output_frag.mp4`.replace(/\\/g, "/");
          await si(o, "index"), await si(a, "fragment", { headers: { Range: "bytes=0-1023" } });
        }
      }
    } catch (t) {
      console.debug("[wp][probe] error", (t == null ? void 0 : t.message) || String(t));
    }
}
function Ml() {
  return "/media";
}
async function si(t, e, r) {
  const n = performance.now(), i = await fetch(t, r), o = Math.round(performance.now() - n);
  return console.debug("[wp][probe]", e, { url: t, status: i.status, ms: o, bytes: i.headers.get("content-length") }), i;
}
const Pl = ({ open: t, onClose: e }) => {
  const [r, n] = Re(!1), [i, o] = Re(null), [a, d] = Re([]), [l, c] = Re(""), h = io(async () => {
    n(!0), o(null);
    try {
      const E = [
        { key: "anime", label: "Anime" },
        { key: "movie", label: "Movie" },
        { key: "tv", label: "TV" }
      ], m = "output/fmp4", O = [];
      for (const x of E) {
        const C = `${m}/${x.key}`;
        let M;
        try {
          M = await Wr(C);
        } catch {
          continue;
        }
        const y = [];
        for (const D of M.dirs) {
          let q;
          try {
            q = await Wr(D.path);
          } catch {
            continue;
          }
          const j = q.files.map((F) => ({ type: "episode", name: F.title, mediaId: F.id }));
          j.length && y.push({ type: "series", name: D.name, episodes: j, expanded: !1 });
        }
        y.length && O.push({ type: "category", name: x.label, series: y, expanded: !0 });
      }
      d(O), Se() && Ll();
    } catch (E) {
      o(E.message || "catalog_error");
    } finally {
      n(!1);
    }
  }, []);
  Ce(() => {
    t && h();
  }, [t, h]);
  function u(E) {
    Al(E), Se() && console.debug("[wp] control_load", E), e();
  }
  function s() {
    kl(), Se() && console.debug("[wp] control_home"), e();
  }
  function f(E, m) {
    d((O) => O.map((x, C) => C !== E ? x : { ...x, series: x.series.map((M, y) => y !== m ? M : { ...M, expanded: !M.expanded }) }));
  }
  function b(E) {
    d((m) => m.map((O, x) => x !== E ? O : { ...O, expanded: !O.expanded }));
  }
  function v() {
    Dl(), h();
  }
  const w = ci(() => {
    if (!l.trim()) return a;
    const E = l.toLowerCase();
    return a.map((m) => {
      const O = m.series.map((x) => {
        const C = x.episodes.filter((M) => M.name.toLowerCase().includes(E));
        return C.length ? { ...x, episodes: C, expanded: !0 } : x.name.toLowerCase().includes(E) ? { ...x, expanded: !0 } : null;
      }).filter(Boolean);
      return O.length ? { ...m, series: O, expanded: !0 } : m.name.toLowerCase().includes(E) ? { ...m, expanded: !0 } : null;
    }).filter(Boolean);
  }, [a, l]);
  return t ? /* @__PURE__ */ S.jsx("div", { className: "fixed inset-0 bg-black/40 flex justify-end z-40", children: /* @__PURE__ */ S.jsxs("div", { className: "w-[440px] h-full bg-gray-950 border-l border-gray-800 flex flex-col", children: [
    /* @__PURE__ */ S.jsxs("div", { className: "p-3 border-b border-gray-800 flex items-center gap-2 text-sm", children: [
      /* @__PURE__ */ S.jsx("button", { onClick: e, className: "px-2 py-1 bg-gray-800 hover:bg-gray-700 rounded", children: "Close" }),
      /* @__PURE__ */ S.jsx("button", { onClick: s, className: "px-2 py-1 bg-indigo-600 hover:bg-indigo-500 rounded", children: "Home" }),
      /* @__PURE__ */ S.jsx("button", { onClick: v, className: "px-2 py-1 bg-gray-800 hover:bg-gray-700 rounded", children: "Reload" }),
      /* @__PURE__ */ S.jsx("input", { value: l, onChange: (E) => c(E.target.value), placeholder: "search", className: "ml-auto bg-gray-900 border border-gray-700 focus:border-gray-500 outline-none px-2 py-1 rounded text-xs" })
    ] }),
    r && /* @__PURE__ */ S.jsx("div", { className: "px-4 py-2 text-xs text-gray-500", children: "Loading catalog…" }),
    i && /* @__PURE__ */ S.jsx("div", { className: "px-4 py-2 text-xs text-red-400", children: i }),
    /* @__PURE__ */ S.jsxs("div", { className: "flex-1 overflow-auto text-sm py-2", children: [
      w.map((E, m) => /* @__PURE__ */ S.jsxs("div", { className: "px-3 pb-3", children: [
        /* @__PURE__ */ S.jsxs("div", { className: "flex items-center gap-2 cursor-pointer select-none group", onClick: () => b(m), children: [
          /* @__PURE__ */ S.jsx("span", { className: "text-xs uppercase tracking-wider text-gray-500 group-hover:text-gray-300", children: E.name }),
          /* @__PURE__ */ S.jsx("span", { className: "text-[10px] opacity-50", children: E.expanded ? "−" : "+" })
        ] }),
        E.expanded && /* @__PURE__ */ S.jsxs("div", { className: "mt-2 space-y-2", children: [
          E.series.map((O, x) => /* @__PURE__ */ S.jsxs("div", { children: [
            /* @__PURE__ */ S.jsxs("div", { className: "flex items-center gap-2 cursor-pointer text-gray-300 hover:text-white", onClick: () => f(m, x), children: [
              /* @__PURE__ */ S.jsx("span", { className: "text-xs font-medium", children: O.name }),
              /* @__PURE__ */ S.jsx("span", { className: "text-[10px] opacity-40", children: O.expanded ? "−" : "+" })
            ] }),
            O.expanded && /* @__PURE__ */ S.jsxs("div", { className: "mt-1 ml-3 border-l border-gray-800 pl-3 space-y-1", children: [
              O.episodes.map((C) => /* @__PURE__ */ S.jsxs("button", { onClick: () => u(C.mediaId), className: "w-full text-left px-2 py-1 rounded hover:bg-gray-900 flex items-center gap-2 group", children: [
                /* @__PURE__ */ S.jsx("span", { className: "text-[11px] text-gray-400 group-hover:text-gray-200 truncate", children: C.name }),
                /* @__PURE__ */ S.jsx("span", { className: "ml-auto text-[10px] text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity", children: "Load" })
              ] }, C.mediaId)),
              O.episodes.length === 0 && /* @__PURE__ */ S.jsx("div", { className: "text-[11px] text-gray-600 italic", children: "(no episodes)" })
            ] })
          ] }, O.name)),
          E.series.length === 0 && /* @__PURE__ */ S.jsx("div", { className: "text-[11px] text-gray-600 italic", children: "(empty)" })
        ] })
      ] }, E.name)),
      !r && !w.length && /* @__PURE__ */ S.jsx("div", { className: "px-4 py-6 text-center text-xs text-gray-600", children: "No matches" })
    ] }),
    /* @__PURE__ */ S.jsxs("div", { className: "p-2 text-[10px] text-gray-600 border-t border-gray-900 flex justify-between", children: [
      /* @__PURE__ */ S.jsx("span", { children: "Simple Catalog" }),
      Se() && /* @__PURE__ */ S.jsx("span", { className: "opacity-70", children: "verbose" })
    ] })
  ] }) }) : null;
};
function jl({ open: t, onClose: e }) {
  const { name: r, sprite: n, setIdentity: i } = G(), [o, a] = Re(r), [d, l] = Re(n), [c, h] = Re(t);
  Ce(() => {
    if (t)
      h(!0);
    else {
      const s = setTimeout(() => h(!1), 320);
      return () => clearTimeout(s);
    }
  }, [t]);
  const u = () => {
    const s = (o || "").trim().slice(0, 32) || "Guest";
    i(s, d), Tl(s, d || void 0), e();
  };
  return c ? /* @__PURE__ */ S.jsxs("div", { "aria-hidden": !t, className: `fixed inset-y-0 right-0 w-80 bg-slate-900/95 backdrop-blur border-l border-slate-700 transition-transform duration-300 z-30 flex flex-col ${t ? "translate-x-0" : "translate-x-full"} ${t ? "" : "pointer-events-none"}`, children: [
    /* @__PURE__ */ S.jsxs("div", { className: "p-4 flex items-center justify-between border-b border-slate-700", children: [
      /* @__PURE__ */ S.jsx("h2", { className: "font-semibold text-sm", children: "Identity" }),
      /* @__PURE__ */ S.jsx("button", { type: "button", onClick: e, role: "button", className: "text-xs opacity-70 hover:opacity-100 select-none", children: "Close" })
    ] }),
    /* @__PURE__ */ S.jsxs("div", { className: "p-4 space-y-4 overflow-y-auto text-sm", children: [
      /* @__PURE__ */ S.jsxs("div", { children: [
        /* @__PURE__ */ S.jsx("label", { className: "block text-xs uppercase tracking-wide mb-1 opacity-70", children: "Display Name" }),
        /* @__PURE__ */ S.jsx("input", { value: o, onChange: (s) => a(s.target.value), className: "w-full bg-slate-800 border border-slate-600 rounded px-2 py-1 text-sm", placeholder: "Your name" })
      ] }),
      /* @__PURE__ */ S.jsxs("div", { children: [
        /* @__PURE__ */ S.jsx("label", { className: "block text-xs uppercase tracking-wide mb-1 opacity-70", children: "Character" }),
        /* @__PURE__ */ S.jsx("div", { className: "grid grid-cols-4 gap-3", children: gt.map((s) => /* @__PURE__ */ S.jsxs("button", { onClick: () => {
          l(s), (!o.trim() || gt.includes(o) || o === "Guest") && a(s);
        }, className: `relative group rounded border ${d === s ? "border-emerald-400" : "border-slate-600 hover:border-slate-400"} p-1 flex flex-col items-center gap-1`, children: [
          /* @__PURE__ */ S.jsx("img", { src: nn(s), alt: s, className: "w-12 h-12 object-cover rounded" }),
          /* @__PURE__ */ S.jsx("span", { className: "text-[10px] opacity-70 group-hover:opacity-100 capitalize", children: s })
        ] }, s)) })
      ] }),
      /* @__PURE__ */ S.jsx("div", { className: "pt-2 flex gap-2 items-center", children: /* @__PURE__ */ S.jsx("button", { onClick: u, className: "bg-emerald-500 hover:bg-emerald-400 text-black font-semibold text-sm px-3 py-1 rounded", children: "Update" }) })
    ] })
  ] }) : null;
}
function Il(t) {
  if (!t) return null;
  const r = `${"/media".replace(/\/$/, "")}/${t}`.replace(/\\/g, "/");
  return { mediaUrl: `${r}/output_frag.mp4`, indexUrl: `${r}/index.json` };
}
function Bl() {
  const t = G((w) => w.snapshot), { ensureAutoIdentity: e, name: r, sprite: n } = G(), i = Ri(), o = Xe(!1), a = ci(() => Il(t.mediaId), [t.mediaId]), [d, l] = Re(!1), [c, h] = Re(!1);
  Ce(() => {
    if (o.current) return;
    const w = new URLSearchParams(window.location.search), E = i.roomKey || w.get("room") || "dev-room-1000";
    e();
    const m = w.get("leaderKey") || w.get("leaderkey") || w.get("leader_key") || void 0;
    xl({ room_key: E, leader_key: m || null, name: r || void 0, sprite: n || void 0 }), o.current = !0;
  }, [i.roomKey, e, r, n]);
  const u = G((w) => !!w.snapshot.leaderId && w.snapshot.leaderId === w.me.clientId);
  function s() {
    h(!1), l(!0);
  }
  function f() {
    l(!1), h(!0);
  }
  function b() {
    l(!1);
  }
  function v() {
    h(!1);
  }
  return /* @__PURE__ */ S.jsxs("div", { className: "relative min-h-[calc(100vh-120px)] flex", children: [
    /* @__PURE__ */ S.jsxs("div", { className: "flex-1 relative bg-black", children: [
      a ? /* @__PURE__ */ S.jsx(Nl, { mediaUrl: a.mediaUrl, indexUrl: a.indexUrl, mediaId: t.mediaId }) : /* @__PURE__ */ S.jsxs(S.Fragment, { children: [
        /* @__PURE__ */ S.jsx(on, {}),
        /* @__PURE__ */ S.jsx("div", { className: "absolute inset-0 flex flex-col items-center justify-center gap-4 p-6", children: /* @__PURE__ */ S.jsx("div", { className: "mt-6 p-3 rounded bg-slate-900/70 border border-slate-700/40 backdrop-blur-sm", children: /* @__PURE__ */ S.jsx(Cs, {}) }) })
      ] }),
      u && !d && /* @__PURE__ */ S.jsx("button", { onClick: s, className: "fixed bottom-4 left-1/2 -translate-x-1/2 z-40 bg-indigo-600 hover:bg-indigo-500 text-xs px-4 py-2 rounded shadow", children: "Media" })
    ] }),
    /* @__PURE__ */ S.jsx("aside", { className: "w-80 border-l border-slate-800 p-4 hidden md:block text-xs opacity-70", children: "Chat panel placeholder (Phase 5)" }),
    /* @__PURE__ */ S.jsx(Pl, { open: d, onClose: b }),
    /* @__PURE__ */ S.jsx(jl, { open: c, onClose: v, onJoin: () => {
    } }),
    !c && /* @__PURE__ */ S.jsx("button", { onClick: f, className: "fixed bottom-4 right-4 bg-slate-800/80 hover:bg-slate-700 border border-slate-600 text-xs px-3 py-1 rounded shadow backdrop-blur z-40", children: "Identity" })
  ] });
}
function Ul() {
  return /* @__PURE__ */ S.jsxs("div", { className: "fixed inset-0 bg-black", children: [
    /* @__PURE__ */ S.jsx(on, {}),
    /* @__PURE__ */ S.jsx("div", { className: "absolute inset-0 flex items-center justify-center", children: /* @__PURE__ */ S.jsxs("div", { className: "text-center", children: [
      /* @__PURE__ */ S.jsx("h1", { className: "text-4xl font-bold text-white mb-4", children: "API is sleeping..." }),
      /* @__PURE__ */ S.jsx("p", { className: "text-slate-400 text-lg", children: "༼ つ ◕_◕ ༽つ HADOKU TAKE MY ENERGY ༼ つ ◕_◕ ༽つ" })
    ] }) })
  ] });
}
function Fl() {
  const t = ut(), e = Si();
  return Ri(), Ce(() => {
    const r = new URLSearchParams(window.location.search), n = r.get("roomKey") || r.get("room");
    n && (t.pathname === "/" || t.pathname === "") && e(`/room/${encodeURIComponent(n)}`, { replace: !0 });
  }, [t.pathname, e]), t.pathname === "/" || t.pathname === "" ? /* @__PURE__ */ S.jsx(Ns, {}) : t.pathname.startsWith("/room") ? /* @__PURE__ */ S.jsx(Bl, {}) : /* @__PURE__ */ S.jsx("div", { className: "p-6", children: "Not Found" });
}
function li(t) {
  const [e, r] = Re(!1), [n, i] = Re(!0);
  return Ce(() => {
    async function o() {
      const d = "http://localhost:8080".replace(/\/$/, "") + "/healthz";
      try {
        (await fetch(d, {
          cache: "no-store",
          signal: AbortSignal.timeout(5e3)
          // 5s timeout
        })).ok ? r(!1) : r(!0);
      } catch {
        r(!0);
      } finally {
        i(!1);
      }
    }
    o();
  }, []), Ce(() => {
    function o() {
      for (const d of gt) {
        const l = new Image();
        l.decoding = "async", l.loading = "eager", l.src = nn(d);
      }
    }
    function a() {
      "requestIdleCallback" in window ? window.requestIdleCallback(o, { timeout: 2e3 }) : setTimeout(o, 600);
    }
    document.readyState === "complete" ? a() : window.addEventListener("load", a, { once: !0 });
  }, []), n ? /* @__PURE__ */ S.jsx("div", { className: "min-h-screen flex items-center justify-center bg-black", children: /* @__PURE__ */ S.jsx("div", { className: "text-slate-400", children: "Checking server status..." }) }) : e ? /* @__PURE__ */ S.jsx(Ul, {}) : /* @__PURE__ */ S.jsxs("div", { className: "min-h-screen flex flex-col", children: [
    /* @__PURE__ */ S.jsx("header", { className: "p-3 border-b border-slate-700 flex items-center gap-4 text-sm", children: /* @__PURE__ */ S.jsx(hr, { to: "/", className: "font-semibold", children: "Watchparty" }) }),
    /* @__PURE__ */ S.jsxs("main", { className: "flex-1", children: [
      /* @__PURE__ */ S.jsx(Fl, {}),
      /* @__PURE__ */ S.jsx(Ca, {})
    ] }),
    /* @__PURE__ */ S.jsx(Os, {})
  ] });
}
function Vl({ basename: t = "/watchparty", appProps: e } = {}) {
  const r = e ?? {}, n = [
    { path: "/", element: /* @__PURE__ */ S.jsx(li, { ...r }) },
    { path: "/room/:roomKey", element: /* @__PURE__ */ S.jsx(li, { ...r }) }
  ];
  return Ha(n, { basename: t });
}
function zl(t, e, r) {
  const n = oo(t), i = r ? /* @__PURE__ */ S.jsx(We.StrictMode, { children: e }) : e;
  return n.render(i), n;
}
function Wl(t, e = {}) {
  const { basename: r, strictMode: n = !0, ...i } = e, o = t.__watchparty;
  o == null || o.root.unmount();
  const a = Vl({
    basename: r,
    appProps: i
  }), l = { root: zl(t, /* @__PURE__ */ S.jsx(Xa, { router: a }), n) };
  return t.__watchparty = l, a;
}
function Kl(t) {
  const e = t.__watchparty;
  e == null || e.root.unmount(), e && delete t.__watchparty;
}
export {
  Vl as createWatchpartyRouter,
  Wl as mount,
  Kl as unmount
};
//# sourceMappingURL=index.js.map
