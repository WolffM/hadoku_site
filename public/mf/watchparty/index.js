import * as S from "react";
import We, { useEffect as Ne, useRef as Xe, createContext as lo, useContext as co, useState as Re, useCallback as uo, useMemo as fi } from "react";
import { createRoot as fo } from "react-dom/client";
function ho(t, e) {
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
function hi(t) {
  return t && t.__esModule && Object.prototype.hasOwnProperty.call(t, "default") ? t.default : t;
}
var Pr = { exports: {} }, Rt = {};
/**
 * @license React
 * react-jsx-runtime.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var Rn;
function po() {
  if (Rn) return Rt;
  Rn = 1;
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
var On;
function mo() {
  return On || (On = 1, process.env.NODE_ENV !== "production" && function() {
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
        case O:
          return "StrictMode";
        case N:
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
          case R:
            return (T.displayName || "Context") + ".Provider";
          case m:
            return (T._context.displayName || "Context") + ".Consumer";
          case w:
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
    var s = We, f = Symbol.for("react.transitional.element"), b = Symbol.for("react.portal"), v = Symbol.for("react.fragment"), O = Symbol.for("react.strict_mode"), E = Symbol.for("react.profiler"), m = Symbol.for("react.consumer"), R = Symbol.for("react.context"), w = Symbol.for("react.forward_ref"), N = Symbol.for("react.suspense"), M = Symbol.for("react.suspense_list"), y = Symbol.for("react.memo"), D = Symbol.for("react.lazy"), q = Symbol.for("react.activity"), j = Symbol.for("react.client.reference"), F = s.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE, H = Object.prototype.hasOwnProperty, ue = Array.isArray, oe = console.createTask ? console.createTask : function() {
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
process.env.NODE_ENV === "production" ? Pr.exports = po() : Pr.exports = mo();
var x = Pr.exports, jr = { exports: {} }, _e = {};
/**
 * @license React
 * react-dom.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var Tn;
function go() {
  if (Tn) return _e;
  Tn = 1;
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
var Cn;
function yo() {
  return Cn || (Cn = 1, process.env.NODE_ENV !== "production" && function() {
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
        var f = s.as, b = n(f, s.crossOrigin), v = typeof s.integrity == "string" ? s.integrity : void 0, O = typeof s.fetchPriority == "string" ? s.fetchPriority : void 0;
        f === "style" ? l.d.S(
          u,
          typeof s.precedence == "string" ? s.precedence : void 0,
          {
            crossOrigin: b,
            integrity: v,
            fetchPriority: O
          }
        ) : f === "script" && l.d.X(u, {
          crossOrigin: b,
          integrity: v,
          fetchPriority: O,
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
function pi() {
  if (!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > "u" || typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE != "function")) {
    if (process.env.NODE_ENV !== "production")
      throw new Error("^_^");
    try {
      __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(pi);
    } catch (t) {
      console.error(t);
    }
  }
}
process.env.NODE_ENV === "production" ? (pi(), jr.exports = go()) : jr.exports = yo();
var mi = jr.exports;
const vo = /* @__PURE__ */ hi(mi), _o = /* @__PURE__ */ ho({
  __proto__: null,
  default: vo
}, [mi]);
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
const Nn = "popstate";
function bo(t) {
  t === void 0 && (t = {});
  function e(n, i) {
    let {
      pathname: o,
      search: a,
      hash: d
    } = n.location;
    return Mt(
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
  return wo(e, r, null, t);
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
function Eo() {
  return Math.random().toString(36).substr(2, 8);
}
function Dn(t, e) {
  return {
    usr: t.state,
    key: t.key,
    idx: e
  };
}
function Mt(t, e, r, n) {
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
    key: e && e.key || n || Eo()
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
function wo(t, e, r, n) {
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
    let O = h(), E = O == null ? null : O - c;
    c = O, l && l({
      action: d,
      location: v.location,
      delta: E
    });
  }
  function s(O, E) {
    d = fe.Push;
    let m = Mt(v.location, O, E);
    c = h() + 1;
    let R = Dn(m, c), w = v.createHref(m);
    try {
      a.pushState(R, "", w);
    } catch (N) {
      if (N instanceof DOMException && N.name === "DataCloneError")
        throw N;
      i.location.assign(w);
    }
    o && l && l({
      action: d,
      location: v.location,
      delta: 1
    });
  }
  function f(O, E) {
    d = fe.Replace;
    let m = Mt(v.location, O, E);
    c = h();
    let R = Dn(m, c), w = v.createHref(m);
    a.replaceState(R, "", w), o && l && l({
      action: d,
      location: v.location,
      delta: 0
    });
  }
  function b(O) {
    let E = i.location.origin !== "null" ? i.location.origin : i.location.href, m = typeof O == "string" ? O : et(O);
    return m = m.replace(/ $/, "%20"), U(E, "No window.location.(origin|href) available to create URL for href: " + m), new URL(m, E);
  }
  let v = {
    get action() {
      return d;
    },
    get location() {
      return t(i, a);
    },
    listen(O) {
      if (l)
        throw new Error("A history only accepts one active listener");
      return i.addEventListener(Nn, u), l = O, () => {
        i.removeEventListener(Nn, u), l = null;
      };
    },
    createHref(O) {
      return e(i, O);
    },
    createURL: b,
    encodeLocation(O) {
      let E = b(O);
      return {
        pathname: E.pathname,
        search: E.search,
        hash: E.hash
      };
    },
    push: s,
    replace: f,
    go(O) {
      return a.go(O);
    }
  };
  return v;
}
var Q;
(function(t) {
  t.data = "data", t.deferred = "deferred", t.redirect = "redirect", t.error = "error";
})(Q || (Q = {}));
const xo = /* @__PURE__ */ new Set(["lazy", "caseSensitive", "path", "id", "index", "children"]);
function So(t) {
  return t.index === !0;
}
function ar(t, e, r, n) {
  return r === void 0 && (r = []), n === void 0 && (n = {}), t.map((i, o) => {
    let a = [...r, String(o)], d = typeof i.id == "string" ? i.id : a.join("-");
    if (U(i.index !== !0 || !i.children, "Cannot specify children on an index route"), U(!n[d], 'Found a route id collision on id "' + d + `".  Route id's must be globally unique within Data Router usages`), So(i)) {
      let l = ne({}, i, e(i), {
        id: d
      });
      return n[d] = l, l;
    } else {
      let l = ne({}, i, e(i), {
        id: d,
        children: void 0
      });
      return n[d] = l, i.children && (l.children = ar(i.children, e, a, n)), l;
    }
  });
}
function ot(t, e, r) {
  return r === void 0 && (r = "/"), Qt(t, e, r, !1);
}
function Qt(t, e, r, n) {
  let i = typeof e == "string" ? rt(e) : e, o = Le(i.pathname || "/", r);
  if (o == null)
    return null;
  let a = gi(t);
  Oo(a);
  let d = null;
  for (let l = 0; d == null && l < a.length; ++l) {
    let c = Io(o);
    d = Po(a[l], c, n);
  }
  return d;
}
function Ro(t, e) {
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
function gi(t, e, r, n) {
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
    ), gi(o.children, e, h, c)), !(o.path == null && !o.index) && e.push({
      path: c,
      score: Lo(c, o.index),
      routesMeta: h
    });
  };
  return t.forEach((o, a) => {
    var d;
    if (o.path === "" || !((d = o.path) != null && d.includes("?")))
      i(o, a);
    else
      for (let l of yi(o.path))
        i(o, a, l);
  }), e;
}
function yi(t) {
  let e = t.split("/");
  if (e.length === 0) return [];
  let [r, ...n] = e, i = r.endsWith("?"), o = r.replace(/\?$/, "");
  if (n.length === 0)
    return i ? [o, ""] : [o];
  let a = yi(n.join("/")), d = [];
  return d.push(...a.map((l) => l === "" ? o : [o, l].join("/"))), i && d.push(...a), d.map((l) => t.startsWith("/") && l === "" ? "/" : l);
}
function Oo(t) {
  t.sort((e, r) => e.score !== r.score ? r.score - e.score : Mo(e.routesMeta.map((n) => n.childrenIndex), r.routesMeta.map((n) => n.childrenIndex)));
}
const To = /^:[\w-]+$/, Co = 3, No = 2, Do = 1, Ao = 10, ko = -2, An = (t) => t === "*";
function Lo(t, e) {
  let r = t.split("/"), n = r.length;
  return r.some(An) && (n += ko), e && (n += No), r.filter((i) => !An(i)).reduce((i, o) => i + (To.test(o) ? Co : o === "" ? Do : Ao), n);
}
function Mo(t, e) {
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
function Po(t, e, r) {
  r === void 0 && (r = !1);
  let {
    routesMeta: n
  } = t, i = {}, o = "/", a = [];
  for (let d = 0; d < n.length; ++d) {
    let l = n[d], c = d === n.length - 1, h = o === "/" ? e : e.slice(o.length) || "/", u = sr({
      path: l.relativePath,
      caseSensitive: l.caseSensitive,
      end: c
    }, h), s = l.route;
    if (!u && c && r && !n[n.length - 1].route.index && (u = sr({
      path: l.relativePath,
      caseSensitive: l.caseSensitive,
      end: !1
    }, h)), !u)
      return null;
    Object.assign(i, u.params), a.push({
      // TODO: Can this as be avoided?
      params: i,
      pathname: Be([o, u.pathname]),
      pathnameBase: Fo(Be([o, u.pathnameBase])),
      route: s
    }), u.pathnameBase !== "/" && (o = Be([o, u.pathnameBase]));
  }
  return a;
}
function sr(t, e) {
  typeof t == "string" && (t = {
    path: t,
    caseSensitive: !1,
    end: !0
  });
  let [r, n] = jo(t.path, t.caseSensitive, t.end), i = e.match(r);
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
function jo(t, e, r) {
  e === void 0 && (e = !1), r === void 0 && (r = !0), me(t === "*" || !t.endsWith("*") || t.endsWith("/*"), 'Route path "' + t + '" will be treated as if it were ' + ('"' + t.replace(/\*$/, "/*") + '" because the `*` character must ') + "always follow a `/` in the pattern. To get rid of this warning, " + ('please change the route path to "' + t.replace(/\*$/, "/*") + '".'));
  let n = [], i = "^" + t.replace(/\/*\*?$/, "").replace(/^\/*/, "/").replace(/[\\.*+^${}|()[\]]/g, "\\$&").replace(/\/:([\w-]+)(\?)?/g, (a, d, l) => (n.push({
    paramName: d,
    isOptional: l != null
  }), l ? "/?([^\\/]+)?" : "/([^\\/]+)"));
  return t.endsWith("*") ? (n.push({
    paramName: "*"
  }), i += t === "*" || t === "/*" ? "(.*)$" : "(?:\\/(.+)|\\/*)$") : r ? i += "\\/*$" : t !== "" && t !== "/" && (i += "(?:(?=\\/|$))"), [new RegExp(i, e ? void 0 : "i"), n];
}
function Io(t) {
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
function Bo(t, e) {
  e === void 0 && (e = "/");
  let {
    pathname: r,
    search: n = "",
    hash: i = ""
  } = typeof t == "string" ? rt(t) : t;
  return {
    pathname: r ? r.startsWith("/") ? r : Uo(r, e) : e,
    search: Vo(n),
    hash: zo(i)
  };
}
function Uo(t, e) {
  let r = e.replace(/\/+$/, "").split("/");
  return t.split("/").forEach((i) => {
    i === ".." ? r.length > 1 && r.pop() : i !== "." && r.push(i);
  }), r.length > 1 ? r.join("/") : "/";
}
function xr(t, e, r, n) {
  return "Cannot include a '" + t + "' character in a manually specified " + ("`to." + e + "` field [" + JSON.stringify(n) + "].  Please separate it out to the ") + ("`to." + r + "` field. Alternatively you may provide the full path as ") + 'a string in <Link to="..."> and the router will parse it for you.';
}
function vi(t) {
  return t.filter((e, r) => r === 0 || e.route.path && e.route.path.length > 0);
}
function Gr(t, e) {
  let r = vi(t);
  return e ? r.map((n, i) => i === r.length - 1 ? n.pathname : n.pathnameBase) : r.map((n) => n.pathnameBase);
}
function Jr(t, e, r, n) {
  n === void 0 && (n = !1);
  let i;
  typeof t == "string" ? i = rt(t) : (i = ne({}, t), U(!i.pathname || !i.pathname.includes("?"), xr("?", "pathname", "search", i)), U(!i.pathname || !i.pathname.includes("#"), xr("#", "pathname", "hash", i)), U(!i.search || !i.search.includes("#"), xr("#", "search", "hash", i)));
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
  let l = Bo(i, d), c = a && a !== "/" && a.endsWith("/"), h = (o || a === ".") && r.endsWith("/");
  return !l.pathname.endsWith("/") && (c || h) && (l.pathname += "/"), l;
}
const Be = (t) => t.join("/").replace(/\/\/+/g, "/"), Fo = (t) => t.replace(/\/+$/, "").replace(/^\/*/, "/"), Vo = (t) => !t || t === "?" ? "" : t.startsWith("?") ? t : "?" + t, zo = (t) => !t || t === "#" ? "" : t.startsWith("#") ? t : "#" + t;
class lr {
  constructor(e, r, n, i) {
    i === void 0 && (i = !1), this.status = e, this.statusText = r || "", this.internal = i, n instanceof Error ? (this.data = n.toString(), this.error = n) : this.data = n;
  }
}
function Pt(t) {
  return t != null && typeof t.status == "number" && typeof t.statusText == "string" && typeof t.internal == "boolean" && "data" in t;
}
const _i = ["post", "put", "patch", "delete"], qo = new Set(_i), Ho = ["get", ..._i], $o = new Set(Ho), Wo = /* @__PURE__ */ new Set([301, 302, 303, 307, 308]), Ko = /* @__PURE__ */ new Set([307, 308]), Sr = {
  state: "idle",
  location: void 0,
  formMethod: void 0,
  formAction: void 0,
  formEncType: void 0,
  formData: void 0,
  json: void 0,
  text: void 0
}, Yo = {
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
}, Xr = /^(?:[a-z][a-z0-9+.-]*:|\/\/)/i, Go = (t) => ({
  hasErrorBoundary: !!t.hasErrorBoundary
}), bi = "remix-router-transitions";
function Jo(t) {
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
    i = Go;
  let o = {}, a = ar(t.routes, i, void 0, o), d, l = t.basename || "/", c = t.dataStrategy || ea, h = t.patchRoutesOnNavigation, u = ne({
    v7_fetcherPersist: !1,
    v7_normalizeFormMethod: !1,
    v7_partialHydration: !1,
    v7_prependBasename: !1,
    v7_relativeSplatPath: !1,
    v7_skipActionErrorRevalidation: !1
  }, t.future), s = null, f = /* @__PURE__ */ new Set(), b = null, v = null, O = null, E = t.hydrationData != null, m = ot(a, t.history.location, l), R = !1, w = null;
  if (m == null && !h) {
    let p = xe(404, {
      pathname: t.history.location.pathname
    }), {
      matches: g,
      route: _
    } = zn(a);
    m = g, w = {
      [_.id]: p
    };
  }
  m && !t.hydrationData && qt(m, a, t.history.location.pathname).active && (m = null);
  let N;
  if (m)
    if (m.some((p) => p.route.lazy))
      N = !1;
    else if (!m.some((p) => p.route.loader))
      N = !0;
    else if (u.v7_partialHydration) {
      let p = t.hydrationData ? t.hydrationData.loaderData : null, g = t.hydrationData ? t.hydrationData.errors : null;
      if (g) {
        let _ = m.findIndex((C) => g[C.route.id] !== void 0);
        N = m.slice(0, _ + 1).every((C) => !Br(C.route, p, g));
      } else
        N = m.every((_) => !Br(_.route, p, g));
    } else
      N = t.hydrationData != null;
  else if (N = !1, m = [], u.v7_partialHydration) {
    let p = qt(null, a, t.history.location.pathname);
    p.active && p.matches && (R = !0, m = p.matches);
  }
  let M, y = {
    historyAction: t.history.action,
    location: t.history.location,
    matches: m,
    initialized: N,
    navigation: Sr,
    // Don't restore on initial updateState() if we were SSR'd
    restoreScrollPosition: t.hydrationData != null ? !1 : null,
    preventScrollReset: !1,
    revalidation: "idle",
    loaderData: t.hydrationData && t.hydrationData.loaderData || {},
    actionData: t.hydrationData && t.hydrationData.actionData || null,
    errors: t.hydrationData && t.hydrationData.errors || w,
    fetchers: /* @__PURE__ */ new Map(),
    blockers: /* @__PURE__ */ new Map()
  }, D = fe.Pop, q = !1, j, F = !1, H = /* @__PURE__ */ new Map(), ue = null, oe = !1, ae = !1, De = [], Ee = /* @__PURE__ */ new Set(), ie = /* @__PURE__ */ new Map(), je = 0, T = -1, V = /* @__PURE__ */ new Map(), W = /* @__PURE__ */ new Set(), Z = /* @__PURE__ */ new Map(), ve = /* @__PURE__ */ new Map(), re = /* @__PURE__ */ new Set(), Te = /* @__PURE__ */ new Map(), we = /* @__PURE__ */ new Map(), te;
  function Fe() {
    if (s = t.history.listen((p) => {
      let {
        action: g,
        location: _,
        delta: C
      } = p;
      if (te) {
        te(), te = void 0;
        return;
      }
      me(we.size === 0 || C != null, "You are trying to use a blocker on a POP navigation to a location that was not created by @remix-run/router. This will fail silently in production. This can happen if you are navigating outside the router via `window.history.pushState`/`window.location.hash` instead of using router navigation APIs.  This can also happen if you are using createHashRouter and the user manually changes the URL.");
      let A = En({
        currentLocation: y.location,
        nextLocation: _,
        historyAction: g
      });
      if (A && C != null) {
        let B = new Promise((z) => {
          te = z;
        });
        t.history.go(C * -1), zt(A, {
          state: "blocked",
          location: _,
          proceed() {
            zt(A, {
              state: "proceeding",
              proceed: void 0,
              reset: void 0,
              location: _
            }), B.then(() => t.history.go(C));
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
      pa(e, H);
      let p = () => ma(e, H);
      e.addEventListener("pagehide", p), ue = () => e.removeEventListener("pagehide", p);
    }
    return y.initialized || qe(fe.Pop, y.location, {
      initialHydration: !0
    }), M;
  }
  function Ke() {
    s && s(), ue && ue(), f.clear(), j && j.abort(), y.fetchers.forEach((p, g) => Vt(g)), y.blockers.forEach((p, g) => bn(g));
  }
  function Ve(p) {
    return f.add(p), () => f.delete(p);
  }
  function ge(p, g) {
    g === void 0 && (g = {}), y = ne({}, y, p);
    let _ = [], C = [];
    u.v7_fetcherPersist && y.fetchers.forEach((A, B) => {
      A.state === "idle" && (re.has(B) ? C.push(B) : _.push(B));
    }), re.forEach((A) => {
      !y.fetchers.has(A) && !ie.has(A) && C.push(A);
    }), [...f].forEach((A) => A(y, {
      deletedFetchers: C,
      viewTransitionOpts: g.viewTransitionOpts,
      flushSync: g.flushSync === !0
    })), u.v7_fetcherPersist ? (_.forEach((A) => y.fetchers.delete(A)), C.forEach((A) => Vt(A))) : C.forEach((A) => re.delete(A));
  }
  function ze(p, g, _) {
    var C, A;
    let {
      flushSync: B
    } = _ === void 0 ? {} : _, z = y.actionData != null && y.navigation.formMethod != null && Ae(y.navigation.formMethod) && y.navigation.state === "loading" && ((C = p.state) == null ? void 0 : C._isRedirect) !== !0, L;
    g.actionData ? Object.keys(g.actionData).length > 0 ? L = g.actionData : L = null : z ? L = y.actionData : L = null;
    let P = g.loaderData ? Fn(y.loaderData, g.loaderData, g.matches || [], g.errors) : y.loaderData, k = y.blockers;
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
      navigation: Sr,
      revalidation: "idle",
      restoreScrollPosition: xn(p, g.matches || y.matches),
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
    let _ = Ir(y.location, y.matches, l, u.v7_prependBasename, p, u.v7_relativeSplatPath, g == null ? void 0 : g.fromRouteId, g == null ? void 0 : g.relative), {
      path: C,
      submission: A,
      error: B
    } = kn(u.v7_normalizeFormMethod, !1, _, g), z = y.location, L = Mt(y.location, C, g && g.state);
    L = ne({}, L, t.history.encodeLocation(L));
    let P = g && g.replace != null ? g.replace : void 0, k = fe.Push;
    P === !0 ? k = fe.Replace : P === !1 || A != null && Ae(A.formMethod) && A.formAction === y.location.pathname + y.location.search && (k = fe.Replace);
    let I = g && "preventScrollReset" in g ? g.preventScrollReset === !0 : void 0, $ = (g && g.flushSync) === !0, Y = En({
      currentLocation: z,
      nextLocation: L,
      historyAction: k
    });
    if (Y) {
      zt(Y, {
        state: "blocked",
        location: L,
        proceed() {
          zt(Y, {
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
  function Ft() {
    if (_r(), ge({
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
    j && j.abort(), j = null, D = p, oe = (_ && _.startUninterruptedRevalidation) === !0, io(y.location, y.matches), q = (_ && _.preventScrollReset) === !0, F = (_ && _.enableViewTransition) === !0;
    let C = d || a, A = _ && _.overrideNavigation, B = _ != null && _.initialHydration && y.matches && y.matches.length > 0 && !R ? (
      // `matchRoutes()` has already been called if we're in here via `router.initialize()`
      y.matches
    ) : ot(C, g, l), z = (_ && _.flushSync) === !0;
    if (B && y.initialized && !ae && aa(y.location, g) && !(_ && _.submission && Ae(_.submission.formMethod))) {
      ze(g, {
        matches: B
      }, {
        flushSync: z
      });
      return;
    }
    let L = qt(B, C, g.pathname);
    if (L.active && L.matches && (B = L.matches), !B) {
      let {
        error: ee,
        notFoundMatches: X,
        route: se
      } = br(g.pathname);
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
      let ee = await yr(P, g, _.submission, B, L.active, {
        replace: _.replace,
        flushSync: z
      });
      if (ee.shortCircuited)
        return;
      if (ee.pendingActionResult) {
        let [X, se] = ee.pendingActionResult;
        if (Oe(se) && Pt(se.error) && se.error.status === 404) {
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
      B = ee.matches || B, k = ee.pendingActionResult, A = Rr(g, _.submission), z = !1, L.active = !1, P = pt(t.history, P.url, P.signal);
    }
    let {
      shortCircuited: I,
      matches: $,
      loaderData: Y,
      errors: ye
    } = await vr(P, g, B, L.active, A, _ && _.submission, _ && _.fetcherSubmission, _ && _.replace, _ && _.initialHydration === !0, z, k);
    I || (j = null, ze(g, ne({
      matches: $ || B
    }, Vn(k), {
      loaderData: Y,
      errors: ye
    })));
  }
  async function yr(p, g, _, C, A, B) {
    B === void 0 && (B = {}), _r();
    let z = fa(g, _);
    if (ge({
      navigation: z
    }, {
      flushSync: B.flushSync === !0
    }), A) {
      let k = await Ht(C, g.pathname, p.signal);
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
        C = k.matches;
      else {
        let {
          notFoundMatches: I,
          error: $,
          route: Y
        } = br(g.pathname);
        return {
          matches: I,
          pendingActionResult: [Y.id, {
            type: Q.error,
            error: $
          }]
        };
      }
    }
    let L, P = At(C, g);
    if (!P.route.action && !P.route.lazy)
      L = {
        type: Q.error,
        error: xe(405, {
          method: p.method,
          pathname: g.pathname,
          routeId: P.route.id
        })
      };
    else if (L = (await Et("action", y, p, [P], C, null))[P.route.id], p.signal.aborted)
      return {
        shortCircuited: !0
      };
    if (ct(L)) {
      let k;
      return B && B.replace != null ? k = B.replace : k = In(L.response.headers.get("Location"), new URL(p.url), l) === y.location.pathname + y.location.search, await nt(p, L, !0, {
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
      let k = at(C, P.route.id);
      return (B && B.replace) !== !0 && (D = fe.Push), {
        matches: C,
        pendingActionResult: [k.route.id, L]
      };
    }
    return {
      matches: C,
      pendingActionResult: [P.route.id, L]
    };
  }
  async function vr(p, g, _, C, A, B, z, L, P, k, I) {
    let $ = A || Rr(g, B), Y = B || z || Hn($), ye = !oe && (!u.v7_partialHydration || !P);
    if (C) {
      if (ye) {
        let le = pn(I);
        ge(ne({
          navigation: $
        }, le !== void 0 ? {
          actionData: le
        } : {}), {
          flushSync: k
        });
      }
      let J = await Ht(_, g.pathname, p.signal);
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
        } = br(g.pathname);
        return {
          matches: ft,
          loaderData: {},
          errors: {
            [St.id]: le
          }
        };
      }
    }
    let ee = d || a, [X, se] = Mn(t.history, y, _, Y, g, u.v7_partialHydration && P === !0, u.v7_skipActionErrorRevalidation, ae, De, Ee, re, Z, W, ee, l, I);
    if (Er((J) => !(_ && _.some((le) => le.route.id === J)) || X && X.some((le) => le.route.id === J)), T = ++je, X.length === 0 && se.length === 0) {
      let J = vn();
      return ze(g, ne({
        matches: _,
        loaderData: {},
        // Commit pending error if we're short circuiting
        errors: I && Oe(I[1]) ? {
          [I[0]]: I[1].error
        } : null
      }, Vn(I), J ? {
        fetchers: new Map(y.fetchers)
      } : {}), {
        flushSync: k
      }), {
        shortCircuited: !0
      };
    }
    if (ye) {
      let J = {};
      if (!C) {
        J.navigation = $;
        let le = pn(I);
        le !== void 0 && (J.actionData = le);
      }
      se.length > 0 && (J.fetchers = Xi(se)), ge(J, {
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
    } = await mn(y, _, X, se, p);
    if (p.signal.aborted)
      return {
        shortCircuited: !0
      };
    j && j.signal.removeEventListener("abort", dt), se.forEach((J) => ie.delete(J.key));
    let Ie = Kt(wt);
    if (Ie)
      return await nt(p, Ie.result, !0, {
        replace: L
      }), {
        shortCircuited: !0
      };
    if (Ie = Kt($e), Ie)
      return W.add(Ie.key), await nt(p, Ie.result, !0, {
        replace: L
      }), {
        shortCircuited: !0
      };
    let {
      loaderData: wr,
      errors: xt
    } = Un(y, _, wt, I, se, $e, Te);
    Te.forEach((J, le) => {
      J.subscribe((ft) => {
        (ft || J.done) && Te.delete(le);
      });
    }), u.v7_partialHydration && P && y.errors && (xt = ne({}, y.errors, xt));
    let it = vn(), $t = _n(T), Wt = it || $t || se.length > 0;
    return ne({
      matches: _,
      loaderData: wr,
      errors: xt
    }, Wt ? {
      fetchers: new Map(y.fetchers)
    } : {});
  }
  function pn(p) {
    if (p && !Oe(p[1]))
      return {
        [p[0]]: p[1].data
      };
    if (y.actionData)
      return Object.keys(y.actionData).length === 0 ? null : y.actionData;
  }
  function Xi(p) {
    return p.forEach((g) => {
      let _ = y.fetchers.get(g.key), C = Ct(void 0, _ ? _.data : void 0);
      y.fetchers.set(g.key, C);
    }), new Map(y.fetchers);
  }
  function Qi(p, g, _, C) {
    if (n)
      throw new Error("router.fetch() was called during the server render, but it shouldn't be. You are likely calling a useFetcher() method in the body of your component. Try moving it to a useEffect or a callback.");
    Ge(p);
    let A = (C && C.flushSync) === !0, B = d || a, z = Ir(y.location, y.matches, l, u.v7_prependBasename, _, u.v7_relativeSplatPath, g, C == null ? void 0 : C.relative), L = ot(B, z, l), P = qt(L, B, z);
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
    } = kn(u.v7_normalizeFormMethod, !0, z, C);
    if ($) {
      He(p, g, $, {
        flushSync: A
      });
      return;
    }
    let Y = At(L, k), ye = (C && C.preventScrollReset) === !0;
    if (I && Ae(I.formMethod)) {
      Zi(p, g, k, Y, L, P.active, A, ye, I);
      return;
    }
    Z.set(p, {
      routeId: g,
      path: k
    }), eo(p, g, k, Y, L, P.active, A, ye, I);
  }
  async function Zi(p, g, _, C, A, B, z, L, P) {
    _r(), Z.delete(p);
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
    if (!B && k(C))
      return;
    let I = y.fetchers.get(p);
    Ye(p, ha(P, I), {
      flushSync: z
    });
    let $ = new AbortController(), Y = pt(t.history, _, $.signal, P);
    if (B) {
      let de = await Ht(A, new URL(Y.url).pathname, Y.signal, p);
      if (de.type === "aborted")
        return;
      if (de.type === "error") {
        He(p, g, de.error, {
          flushSync: z
        });
        return;
      } else if (de.matches) {
        if (A = de.matches, C = At(A, _), k(C))
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
    let ye = je, X = (await Et("action", y, Y, [C], A, p))[C.route.id];
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
          return W.add(p), Ye(p, Ct(P)), nt(Y, X, !1, {
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
    let wr = Ct(P, X.data);
    y.fetchers.set(p, wr);
    let [xt, it] = Mn(t.history, y, $e, P, se, !1, u.v7_skipActionErrorRevalidation, ae, De, Ee, re, Z, W, wt, l, [C.route.id, X]);
    it.filter((de) => de.key !== p).forEach((de) => {
      let ht = de.key, Sn = y.fetchers.get(ht), so = Ct(void 0, Sn ? Sn.data : void 0);
      y.fetchers.set(ht, so), Ge(ht), de.controller && ie.set(ht, de.controller);
    }), ge({
      fetchers: new Map(y.fetchers)
    });
    let $t = () => it.forEach((de) => Ge(de.key));
    $.signal.addEventListener("abort", $t);
    let {
      loaderResults: Wt,
      fetcherResults: J
    } = await mn(y, $e, xt, it, dt);
    if ($.signal.aborted)
      return;
    $.signal.removeEventListener("abort", $t), V.delete(p), ie.delete(p), it.forEach((de) => ie.delete(de.key));
    let le = Kt(Wt);
    if (le)
      return nt(dt, le.result, !1, {
        preventScrollReset: L
      });
    if (le = Kt(J), le)
      return W.add(le.key), nt(dt, le.result, !1, {
        preventScrollReset: L
      });
    let {
      loaderData: ft,
      errors: St
    } = Un(y, $e, Wt, void 0, it, J, Te);
    if (y.fetchers.has(p)) {
      let de = Je(X.data);
      y.fetchers.set(p, de);
    }
    _n(Ie), y.navigation.state === "loading" && Ie > T ? (U(D, "Expected pending action"), j && j.abort(), ze(y.navigation.location, {
      matches: $e,
      loaderData: ft,
      errors: St,
      fetchers: new Map(y.fetchers)
    })) : (ge({
      errors: St,
      loaderData: Fn(y.loaderData, ft, $e, St),
      fetchers: new Map(y.fetchers)
    }), ae = !1);
  }
  async function eo(p, g, _, C, A, B, z, L, P) {
    let k = y.fetchers.get(p);
    Ye(p, Ct(P, k ? k.data : void 0), {
      flushSync: z
    });
    let I = new AbortController(), $ = pt(t.history, _, I.signal);
    if (B) {
      let X = await Ht(A, new URL($.url).pathname, $.signal, p);
      if (X.type === "aborted")
        return;
      if (X.type === "error") {
        He(p, g, X.error, {
          flushSync: z
        });
        return;
      } else if (X.matches)
        A = X.matches, C = At(A, _);
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
    let Y = je, ee = (await Et("loader", y, $, [C], A, p))[C.route.id];
    if (Qe(ee) && (ee = await Qr(ee, $.signal, !0) || ee), ie.get(p) === I && ie.delete(p), !$.signal.aborted) {
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
  async function nt(p, g, _, C) {
    let {
      submission: A,
      fetcherSubmission: B,
      preventScrollReset: z,
      replace: L
    } = C === void 0 ? {} : C;
    g.response.headers.has("X-Remix-Revalidate") && (ae = !0);
    let P = g.response.headers.get("Location");
    U(P, "Expected a Location header on the redirect Response"), P = In(P, new URL(p.url), l);
    let k = Mt(y.location, P, {
      _isRedirect: !0
    });
    if (r) {
      let X = !1;
      if (g.response.headers.has("X-Remix-Reload-Document"))
        X = !0;
      else if (Xr.test(P)) {
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
    !A && !B && $ && Y && ye && (A = Hn(y.navigation));
    let ee = A || B;
    if (Ko.has(g.response.status) && ee && Ae(ee.formMethod))
      await qe(I, k, {
        submission: ne({}, ee, {
          formAction: P
        }),
        // Preserve these flags across redirects
        preventScrollReset: z || q,
        enableViewTransition: _ ? F : void 0
      });
    else {
      let X = Rr(k, A);
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
  async function Et(p, g, _, C, A, B) {
    let z, L = {};
    try {
      z = await ta(c, p, g, _, C, A, B, o, i);
    } catch (P) {
      return C.forEach((k) => {
        L[k.route.id] = {
          type: Q.error,
          error: P
        };
      }), L;
    }
    for (let [P, k] of Object.entries(z))
      if (sa(k)) {
        let I = k.result;
        L[P] = {
          type: Q.redirect,
          response: ia(I, _, P, A, l, u.v7_relativeSplatPath)
        };
      } else
        L[P] = await na(k);
    return L;
  }
  async function mn(p, g, _, C, A) {
    let B = p.matches, z = Et("loader", p, A, _, g, null), L = Promise.all(C.map(async (I) => {
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
    return await Promise.all([ua(g, P, A.signal, B, p.loaderData), da(g, k, C)]), {
      loaderResults: P,
      fetcherResults: k
    };
  }
  function _r() {
    ae = !0, De.push(...Er()), Z.forEach((p, g) => {
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
  function He(p, g, _, C) {
    C === void 0 && (C = {});
    let A = at(y.matches, g);
    Vt(p), ge({
      errors: {
        [A.route.id]: _
      },
      fetchers: new Map(y.fetchers)
    }, {
      flushSync: (C && C.flushSync) === !0
    });
  }
  function gn(p) {
    return ve.set(p, (ve.get(p) || 0) + 1), re.has(p) && re.delete(p), y.fetchers.get(p) || Yo;
  }
  function Vt(p) {
    let g = y.fetchers.get(p);
    ie.has(p) && !(g && g.state === "loading" && V.has(p)) && Ge(p), Z.delete(p), V.delete(p), W.delete(p), u.v7_fetcherPersist && re.delete(p), Ee.delete(p), y.fetchers.delete(p);
  }
  function to(p) {
    let g = (ve.get(p) || 0) - 1;
    g <= 0 ? (ve.delete(p), re.add(p), u.v7_fetcherPersist || Vt(p)) : ve.set(p, g), ge({
      fetchers: new Map(y.fetchers)
    });
  }
  function Ge(p) {
    let g = ie.get(p);
    g && (g.abort(), ie.delete(p));
  }
  function yn(p) {
    for (let g of p) {
      let _ = gn(g), C = Je(_.data);
      y.fetchers.set(g, C);
    }
  }
  function vn() {
    let p = [], g = !1;
    for (let _ of W) {
      let C = y.fetchers.get(_);
      U(C, "Expected fetcher: " + _), C.state === "loading" && (W.delete(_), p.push(_), g = !0);
    }
    return yn(p), g;
  }
  function _n(p) {
    let g = [];
    for (let [_, C] of V)
      if (C < p) {
        let A = y.fetchers.get(_);
        U(A, "Expected fetcher: " + _), A.state === "loading" && (Ge(_), V.delete(_), g.push(_));
      }
    return yn(g), g.length > 0;
  }
  function ro(p, g) {
    let _ = y.blockers.get(p) || Tt;
    return we.get(p) !== g && we.set(p, g), _;
  }
  function bn(p) {
    y.blockers.delete(p), we.delete(p);
  }
  function zt(p, g) {
    let _ = y.blockers.get(p) || Tt;
    U(_.state === "unblocked" && g.state === "blocked" || _.state === "blocked" && g.state === "blocked" || _.state === "blocked" && g.state === "proceeding" || _.state === "blocked" && g.state === "unblocked" || _.state === "proceeding" && g.state === "unblocked", "Invalid blocker state transition: " + _.state + " -> " + g.state);
    let C = new Map(y.blockers);
    C.set(p, g), ge({
      blockers: C
    });
  }
  function En(p) {
    let {
      currentLocation: g,
      nextLocation: _,
      historyAction: C
    } = p;
    if (we.size === 0)
      return;
    we.size > 1 && me(!1, "A router only supports one blocker at a time");
    let A = Array.from(we.entries()), [B, z] = A[A.length - 1], L = y.blockers.get(B);
    if (!(L && L.state === "proceeding") && z({
      currentLocation: g,
      nextLocation: _,
      historyAction: C
    }))
      return B;
  }
  function br(p) {
    let g = xe(404, {
      pathname: p
    }), _ = d || a, {
      matches: C,
      route: A
    } = zn(_);
    return Er(), {
      notFoundMatches: C,
      route: A,
      error: g
    };
  }
  function Er(p) {
    let g = [];
    return Te.forEach((_, C) => {
      (!p || p(C)) && (_.cancel(), g.push(C), Te.delete(C));
    }), g;
  }
  function no(p, g, _) {
    if (b = p, O = g, v = _ || null, !E && y.navigation === Sr) {
      E = !0;
      let C = xn(y.location, y.matches);
      C != null && ge({
        restoreScrollPosition: C
      });
    }
    return () => {
      b = null, O = null, v = null;
    };
  }
  function wn(p, g) {
    return v && v(p, g.map((C) => Ro(C, y.loaderData))) || p.key;
  }
  function io(p, g) {
    if (b && O) {
      let _ = wn(p, g);
      b[_] = O();
    }
  }
  function xn(p, g) {
    if (b) {
      let _ = wn(p, g), C = b[_];
      if (typeof C == "number")
        return C;
    }
    return null;
  }
  function qt(p, g, _) {
    if (h)
      if (p) {
        if (Object.keys(p[0].params).length > 0)
          return {
            active: !0,
            matches: Qt(g, _, l, !0)
          };
      } else
        return {
          active: !0,
          matches: Qt(g, _, l, !0) || []
        };
    return {
      active: !1,
      matches: null
    };
  }
  async function Ht(p, g, _, C) {
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
          fetcherKey: C,
          patch: (I, $) => {
            _.aborted || jn(I, $, z, L, i);
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
      let k = Qt(z, g, l, !0);
      if (!k || A.length === k.length && A.every((I, $) => I.route.id === k[$].route.id))
        return {
          type: "success",
          matches: null
        };
      A = k;
    }
  }
  function oo(p) {
    o = {}, d = ar(p, i, void 0, o);
  }
  function ao(p, g) {
    let _ = d == null;
    jn(p, g, d || a, o, i), _ && (a = [...a], ge({}));
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
    enableScrollRestoration: no,
    navigate: bt,
    fetch: Qi,
    revalidate: Ft,
    // Passthrough to history-aware createHref used by useHref so we get proper
    // hash-aware URLs in DOM paths
    createHref: (p) => t.history.createHref(p),
    encodeLocation: (p) => t.history.encodeLocation(p),
    getFetcher: gn,
    deleteFetcher: to,
    dispose: Ke,
    getBlocker: ro,
    deleteBlocker: bn,
    patchRoutes: ao,
    _internalFetchControllers: ie,
    _internalActiveDeferreds: Te,
    // TODO: Remove setRoutes, it's temporary to avoid dealing with
    // updating the tree while validating the update algorithm.
    _internalSetRoutes: oo
  }, M;
}
function Xo(t) {
  return t != null && ("formData" in t && t.formData != null || "body" in t && t.body !== void 0);
}
function Ir(t, e, r, n, i, o, a, d) {
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
  let h = Jr(i || ".", Gr(l, o), Le(t.pathname, r) || t.pathname, d === "path");
  if (i == null && (h.search = t.search, h.hash = t.hash), (i == null || i === "" || i === ".") && c) {
    let u = Zr(h.search);
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
function kn(t, e, r, n) {
  if (!n || !Xo(n))
    return {
      path: r
    };
  if (n.formMethod && !ca(n.formMethod))
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
  }), o = n.formMethod || "get", a = t ? o.toUpperCase() : o.toLowerCase(), d = xi(r);
  if (n.body !== void 0) {
    if (n.formEncType === "text/plain") {
      if (!Ae(a))
        return i();
      let s = typeof n.body == "string" ? n.body : n.body instanceof FormData || n.body instanceof URLSearchParams ? (
        // https://html.spec.whatwg.org/multipage/form-control-infrastructure.html#plain-text-form-data
        Array.from(n.body.entries()).reduce((f, b) => {
          let [v, O] = b;
          return "" + f + v + "=" + O + `
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
    l = Ur(n.formData), c = n.formData;
  else if (n.body instanceof FormData)
    l = Ur(n.body), c = n.body;
  else if (n.body instanceof URLSearchParams)
    l = n.body, c = Bn(l);
  else if (n.body == null)
    l = new URLSearchParams(), c = new FormData();
  else
    try {
      l = new URLSearchParams(n.body), c = Bn(l);
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
  return e && u.search && Zr(u.search) && l.append("index", ""), u.search = "?" + l, {
    path: et(u),
    submission: h
  };
}
function Ln(t, e, r) {
  r === void 0 && (r = !1);
  let n = t.findIndex((i) => i.route.id === e);
  return n >= 0 ? t.slice(0, r ? n + 1 : n) : t;
}
function Mn(t, e, r, n, i, o, a, d, l, c, h, u, s, f, b, v) {
  let O = v ? Oe(v[1]) ? v[1].error : v[1].data : void 0, E = t.createURL(e.location), m = t.createURL(i), R = r;
  o && e.errors ? R = Ln(r, Object.keys(e.errors)[0], !0) : v && Oe(v[1]) && (R = Ln(r, v[0]));
  let w = v ? v[1].statusCode : void 0, N = a && w && w >= 400, M = R.filter((D, q) => {
    let {
      route: j
    } = D;
    if (j.lazy)
      return !0;
    if (j.loader == null)
      return !1;
    if (o)
      return Br(j, e.loaderData, e.errors);
    if (Qo(e.loaderData, e.matches[q], D) || l.some((ue) => ue === D.route.id))
      return !0;
    let F = e.matches[q], H = D;
    return Pn(D, ne({
      currentUrl: E,
      currentParams: F.params,
      nextUrl: m,
      nextParams: H.params
    }, n, {
      actionResult: O,
      actionStatus: w,
      defaultShouldRevalidate: N ? !1 : (
        // Forced revalidation due to submission, useRevalidator, or X-Remix-Revalidate
        d || E.pathname + E.search === m.pathname + m.search || // Search params affect all loaders
        E.search !== m.search || Ei(F, H)
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
    s.has(q) ? ue = !1 : c.has(q) ? (c.delete(q), ue = !0) : F && F.state !== "idle" && F.data === void 0 ? ue = d : ue = Pn(H, ne({
      currentUrl: E,
      currentParams: e.matches[e.matches.length - 1].params,
      nextUrl: m,
      nextParams: r[r.length - 1].params
    }, n, {
      actionResult: O,
      actionStatus: w,
      defaultShouldRevalidate: N ? !1 : d
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
function Br(t, e, r) {
  if (t.lazy)
    return !0;
  if (!t.loader)
    return !1;
  let n = e != null && e[t.id] !== void 0, i = r != null && r[t.id] !== void 0;
  return !n && i ? !1 : typeof t.loader == "function" && t.loader.hydrate === !0 ? !0 : !n && !i;
}
function Qo(t, e, r) {
  let n = (
    // [a] -> [a, b]
    !e || // [a, b] -> [a, c]
    r.route.id !== e.route.id
  ), i = t[r.route.id] === void 0;
  return n || i;
}
function Ei(t, e) {
  let r = t.route.path;
  return (
    // param change for this match, /users/123 -> /users/456
    t.pathname !== e.pathname || // splat param changed, which is not present in match.path
    // e.g. /files/images/avatar.jpg -> files/finances.xls
    r != null && r.endsWith("*") && t.params["*"] !== e.params["*"]
  );
}
function Pn(t, e) {
  if (t.route.shouldRevalidate) {
    let r = t.route.shouldRevalidate(e);
    if (typeof r == "boolean")
      return r;
  }
  return e.defaultShouldRevalidate;
}
function jn(t, e, r, n, i) {
  var o;
  let a;
  if (t) {
    let c = n[t];
    U(c, "No route found to patch children into: routeId = " + t), c.children || (c.children = []), a = c.children;
  } else
    a = r;
  let d = e.filter((c) => !a.some((h) => wi(c, h))), l = ar(d, i, [t || "_", "patch", String(((o = a) == null ? void 0 : o.length) || "0")], n);
  a.push(...l);
}
function wi(t, e) {
  return "id" in t && "id" in e && t.id === e.id ? !0 : t.index === e.index && t.path === e.path && t.caseSensitive === e.caseSensitive ? (!t.children || t.children.length === 0) && (!e.children || e.children.length === 0) ? !0 : t.children.every((r, n) => {
    var i;
    return (i = e.children) == null ? void 0 : i.some((o) => wi(r, o));
  }) : !1;
}
async function Zo(t, e, r) {
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
    me(!l, 'Route "' + i.id + '" has a static property "' + a + '" defined but its lazy function is also returning a value for this property. ' + ('The lazy route property "' + a + '" will be ignored.')), !l && !xo.has(a) && (o[a] = n[a]);
  }
  Object.assign(i, o), Object.assign(i, ne({}, e(i), {
    lazy: void 0
  }));
}
async function ea(t) {
  let {
    matches: e
  } = t, r = e.filter((i) => i.shouldLoad);
  return (await Promise.all(r.map((i) => i.resolve()))).reduce((i, o, a) => Object.assign(i, {
    [r[a].route.id]: o
  }), {});
}
async function ta(t, e, r, n, i, o, a, d, l, c) {
  let h = o.map((f) => f.route.lazy ? Zo(f.route, l, d) : void 0), u = o.map((f, b) => {
    let v = h[b], O = i.some((m) => m.route.id === f.route.id);
    return ne({}, f, {
      shouldLoad: O,
      resolve: async (m) => (m && n.method === "GET" && (f.route.lazy || f.route.loader) && (O = !0), O ? ra(e, n, f, v, m, c) : Promise.resolve({
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
async function ra(t, e, r, n, i, o) {
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
async function na(t) {
  let {
    result: e,
    type: r
  } = t;
  if (Si(e)) {
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
      error: new lr(e.status, e.statusText, u),
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
    if (qn(e)) {
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
        error: new lr(((n = e.init) == null ? void 0 : n.status) || 500, void 0, e.data),
        statusCode: Pt(e) ? e.status : void 0,
        headers: (i = e.init) != null && i.headers ? new Headers(e.init.headers) : void 0
      };
    }
    return {
      type: Q.error,
      error: e,
      statusCode: Pt(e) ? e.status : void 0
    };
  }
  if (la(e)) {
    var d, l;
    return {
      type: Q.deferred,
      deferredData: e,
      statusCode: (d = e.init) == null ? void 0 : d.status,
      headers: ((l = e.init) == null ? void 0 : l.headers) && new Headers(e.init.headers)
    };
  }
  if (qn(e)) {
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
function ia(t, e, r, n, i, o) {
  let a = t.headers.get("Location");
  if (U(a, "Redirects returned/thrown from loaders/actions must have a Location header"), !Xr.test(a)) {
    let d = n.slice(0, n.findIndex((l) => l.route.id === r) + 1);
    a = Ir(new URL(e.url), d, i, !0, a, o), t.headers.set("Location", a);
  }
  return t;
}
function In(t, e, r) {
  if (Xr.test(t)) {
    let n = t, i = n.startsWith("//") ? new URL(e.protocol + n) : new URL(n), o = Le(i.pathname, r) != null;
    if (i.origin === e.origin && o)
      return i.pathname + i.search + i.hash;
  }
  return t;
}
function pt(t, e, r, n) {
  let i = t.createURL(xi(e)).toString(), o = {
    signal: r
  };
  if (n && Ae(n.formMethod)) {
    let {
      formMethod: a,
      formEncType: d
    } = n;
    o.method = a.toUpperCase(), d === "application/json" ? (o.headers = new Headers({
      "Content-Type": d
    }), o.body = JSON.stringify(n.json)) : d === "text/plain" ? o.body = n.text : d === "application/x-www-form-urlencoded" && n.formData ? o.body = Ur(n.formData) : o.body = n.formData;
  }
  return new Request(i, o);
}
function Ur(t) {
  let e = new URLSearchParams();
  for (let [r, n] of t.entries())
    e.append(r, typeof n == "string" ? n : n.name);
  return e;
}
function Bn(t) {
  let e = new FormData();
  for (let [r, n] of t.entries())
    e.append(r, n);
  return e;
}
function oa(t, e, r, n, i) {
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
      o[s] = void 0, l || (l = !0, d = Pt(f.error) ? f.error.status : 500), f.headers && (c[s] = f.headers);
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
function Un(t, e, r, n, i, o, a) {
  let {
    loaderData: d,
    errors: l
  } = oa(e, r, n, a);
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
function Fn(t, e, r, n) {
  let i = ne({}, e);
  for (let o of r) {
    let a = o.route.id;
    if (e.hasOwnProperty(a) ? e[a] !== void 0 && (i[a] = e[a]) : t[a] !== void 0 && o.route.loader && (i[a] = t[a]), n && n.hasOwnProperty(a))
      break;
  }
  return i;
}
function Vn(t) {
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
function zn(t) {
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
  return t === 400 ? (d = "Bad Request", i && r && n ? l = "You made a " + i + ' request to "' + r + '" but ' + ('did not provide a `loader` for route "' + n + '", ') + "so there is no way to handle the request." : o === "defer-action" ? l = "defer() is not supported in actions" : o === "invalid-body" && (l = "Unable to encode submission body")) : t === 403 ? (d = "Forbidden", l = 'Route "' + n + '" does not match URL "' + r + '"') : t === 404 ? (d = "Not Found", l = 'No route matches URL "' + r + '"') : t === 405 && (d = "Method Not Allowed", i && r && n ? l = "You made a " + i.toUpperCase() + ' request to "' + r + '" but ' + ('did not provide an `action` for route "' + n + '", ') + "so there is no way to handle the request." : i && (l = 'Invalid request method "' + i.toUpperCase() + '"')), new lr(t || 500, d, new Error(l), !0);
}
function Kt(t) {
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
function xi(t) {
  let e = typeof t == "string" ? rt(t) : t;
  return et(ne({}, e, {
    hash: ""
  }));
}
function aa(t, e) {
  return t.pathname !== e.pathname || t.search !== e.search ? !1 : t.hash === "" ? e.hash !== "" : t.hash === e.hash ? !0 : e.hash !== "";
}
function sa(t) {
  return Si(t.result) && Wo.has(t.result.status);
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
function qn(t) {
  return typeof t == "object" && t != null && "type" in t && "data" in t && "init" in t && t.type === "DataWithResponseInit";
}
function la(t) {
  let e = t;
  return e && typeof e == "object" && typeof e.data == "object" && typeof e.subscribe == "function" && typeof e.cancel == "function" && typeof e.resolveData == "function";
}
function Si(t) {
  return t != null && typeof t.status == "number" && typeof t.statusText == "string" && typeof t.headers == "object" && typeof t.body < "u";
}
function ca(t) {
  return $o.has(t.toLowerCase());
}
function Ae(t) {
  return qo.has(t.toLowerCase());
}
async function ua(t, e, r, n, i) {
  let o = Object.entries(e);
  for (let a = 0; a < o.length; a++) {
    let [d, l] = o[a], c = t.find((s) => (s == null ? void 0 : s.route.id) === d);
    if (!c)
      continue;
    let h = n.find((s) => s.route.id === c.route.id), u = h != null && !Ei(h, c) && (i && i[c.route.id]) !== void 0;
    Qe(l) && u && await Qr(l, r, !1).then((s) => {
      s && (e[d] = s);
    });
  }
}
async function da(t, e, r) {
  for (let n = 0; n < r.length; n++) {
    let {
      key: i,
      routeId: o,
      controller: a
    } = r[n], d = e[i];
    t.find((c) => (c == null ? void 0 : c.route.id) === o) && Qe(d) && (U(a, "Expected an AbortController for revalidating fetcher deferred result"), await Qr(d, a.signal, !0).then((c) => {
      c && (e[i] = c);
    }));
  }
}
async function Qr(t, e, r) {
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
function Zr(t) {
  return new URLSearchParams(t).getAll("index").some((e) => e === "");
}
function At(t, e) {
  let r = typeof e == "string" ? rt(e).search : e.search;
  if (t[t.length - 1].route.index && Zr(r || ""))
    return t[t.length - 1];
  let n = vi(t);
  return n[n.length - 1];
}
function Hn(t) {
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
function Rr(t, e) {
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
function fa(t, e) {
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
function Ct(t, e) {
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
function ha(t, e) {
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
function pa(t, e) {
  try {
    let r = t.sessionStorage.getItem(bi);
    if (r) {
      let n = JSON.parse(r);
      for (let [i, o] of Object.entries(n || {}))
        o && Array.isArray(o) && e.set(i, new Set(o || []));
    }
  } catch {
  }
}
function ma(t, e) {
  if (e.size > 0) {
    let r = {};
    for (let [n, i] of e)
      r[n] = [...i];
    try {
      t.sessionStorage.setItem(bi, JSON.stringify(r));
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
function cr() {
  return cr = Object.assign ? Object.assign.bind() : function(t) {
    for (var e = 1; e < arguments.length; e++) {
      var r = arguments[e];
      for (var n in r)
        Object.prototype.hasOwnProperty.call(r, n) && (t[n] = r[n]);
    }
    return t;
  }, cr.apply(this, arguments);
}
const vt = /* @__PURE__ */ S.createContext(null);
process.env.NODE_ENV !== "production" && (vt.displayName = "DataRouter");
const dr = /* @__PURE__ */ S.createContext(null);
process.env.NODE_ENV !== "production" && (dr.displayName = "DataRouterState");
const ga = /* @__PURE__ */ S.createContext(null);
process.env.NODE_ENV !== "production" && (ga.displayName = "Await");
const Me = /* @__PURE__ */ S.createContext(null);
process.env.NODE_ENV !== "production" && (Me.displayName = "Navigation");
const fr = /* @__PURE__ */ S.createContext(null);
process.env.NODE_ENV !== "production" && (fr.displayName = "Location");
const Pe = /* @__PURE__ */ S.createContext({
  outlet: null,
  matches: [],
  isDataRoute: !1
});
process.env.NODE_ENV !== "production" && (Pe.displayName = "Route");
const en = /* @__PURE__ */ S.createContext(null);
process.env.NODE_ENV !== "production" && (en.displayName = "RouteError");
function ya(t, e) {
  let {
    relative: r
  } = e === void 0 ? {} : e;
  It() || (process.env.NODE_ENV !== "production" ? U(
    !1,
    // TODO: This error is probably because they somehow have 2 versions of the
    // router loaded. We can help them understand how to avoid that.
    "useHref() may be used only in the context of a <Router> component."
  ) : U(!1));
  let {
    basename: n,
    navigator: i
  } = S.useContext(Me), {
    hash: o,
    pathname: a,
    search: d
  } = Bt(t, {
    relative: r
  }), l = a;
  return n !== "/" && (l = a === "/" ? n : Be([n, a])), i.createHref({
    pathname: l,
    search: d,
    hash: o
  });
}
function It() {
  return S.useContext(fr) != null;
}
function ut() {
  return It() || (process.env.NODE_ENV !== "production" ? U(
    !1,
    // TODO: This error is probably because they somehow have 2 versions of the
    // router loaded. We can help them understand how to avoid that.
    "useLocation() may be used only in the context of a <Router> component."
  ) : U(!1)), S.useContext(fr).location;
}
const Ri = "You should call navigate() in a React.useEffect(), not when your component is first rendered.";
function Oi(t) {
  S.useContext(Me).static || S.useLayoutEffect(t);
}
function Ti() {
  let {
    isDataRoute: t
  } = S.useContext(Pe);
  return t ? ka() : va();
}
function va() {
  It() || (process.env.NODE_ENV !== "production" ? U(
    !1,
    // TODO: This error is probably because they somehow have 2 versions of the
    // router loaded. We can help them understand how to avoid that.
    "useNavigate() may be used only in the context of a <Router> component."
  ) : U(!1));
  let t = S.useContext(vt), {
    basename: e,
    future: r,
    navigator: n
  } = S.useContext(Me), {
    matches: i
  } = S.useContext(Pe), {
    pathname: o
  } = ut(), a = JSON.stringify(Gr(i, r.v7_relativeSplatPath)), d = S.useRef(!1);
  return Oi(() => {
    d.current = !0;
  }), S.useCallback(function(c, h) {
    if (h === void 0 && (h = {}), process.env.NODE_ENV !== "production" && me(d.current, Ri), !d.current) return;
    if (typeof c == "number") {
      n.go(c);
      return;
    }
    let u = Jr(c, JSON.parse(a), o, h.relative === "path");
    t == null && e !== "/" && (u.pathname = u.pathname === "/" ? e : Be([e, u.pathname])), (h.replace ? n.replace : n.push)(u, h.state, h);
  }, [e, n, a, o, t]);
}
const _a = /* @__PURE__ */ S.createContext(null);
function ba(t) {
  let e = S.useContext(Pe).outlet;
  return e && /* @__PURE__ */ S.createElement(_a.Provider, {
    value: t
  }, e);
}
function Ci() {
  let {
    matches: t
  } = S.useContext(Pe), e = t[t.length - 1];
  return e ? e.params : {};
}
function Bt(t, e) {
  let {
    relative: r
  } = e === void 0 ? {} : e, {
    future: n
  } = S.useContext(Me), {
    matches: i
  } = S.useContext(Pe), {
    pathname: o
  } = ut(), a = JSON.stringify(Gr(i, n.v7_relativeSplatPath));
  return S.useMemo(() => Jr(t, JSON.parse(a), o, r === "path"), [t, a, o, r]);
}
function Ea(t, e, r, n) {
  It() || (process.env.NODE_ENV !== "production" ? U(
    !1,
    // TODO: This error is probably because they somehow have 2 versions of the
    // router loaded. We can help them understand how to avoid that.
    "useRoutes() may be used only in the context of a <Router> component."
  ) : U(!1));
  let {
    navigator: i
  } = S.useContext(Me), {
    matches: o
  } = S.useContext(Pe), a = o[o.length - 1], d = a ? a.params : {}, l = a ? a.pathname : "/", c = a ? a.pathnameBase : "/", h = a && a.route;
  if (process.env.NODE_ENV !== "production") {
    let E = h && h.path || "";
    Di(l, !h || E.endsWith("*"), "You rendered descendant <Routes> (or called `useRoutes()`) at " + ('"' + l + '" (under <Route path="' + E + '">) but the ') + `parent route path has no trailing "*". This means if you navigate deeper, the parent won't match anymore and therefore the child routes will never render.

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
  return process.env.NODE_ENV !== "production" && (process.env.NODE_ENV !== "production" && me(h || v != null, 'No routes matched location "' + s.pathname + s.search + s.hash + '" '), process.env.NODE_ENV !== "production" && me(v == null || v[v.length - 1].route.element !== void 0 || v[v.length - 1].route.Component !== void 0 || v[v.length - 1].route.lazy !== void 0, 'Matched leaf route at location "' + s.pathname + s.search + s.hash + '" does not have an element or Component. This means it will render an <Outlet /> with a null value by default resulting in an "empty" page.')), Oa(v && v.map((E) => Object.assign({}, E, {
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
function wa() {
  let t = Aa(), e = Pt(t) ? t.status + " " + t.statusText : t instanceof Error ? t.message : JSON.stringify(t), r = t instanceof Error ? t.stack : null, n = "rgba(200,200,200, 0.5)", i = {
    padding: "0.5rem",
    backgroundColor: n
  }, o = {
    padding: "2px 4px",
    backgroundColor: n
  }, a = null;
  return process.env.NODE_ENV !== "production" && (console.error("Error handled by React Router default ErrorBoundary:", t), a = /* @__PURE__ */ S.createElement(S.Fragment, null, /* @__PURE__ */ S.createElement("p", null, "💿 Hey developer 👋"), /* @__PURE__ */ S.createElement("p", null, "You can provide a way better UX than this when your app throws errors by providing your own ", /* @__PURE__ */ S.createElement("code", {
    style: o
  }, "ErrorBoundary"), " or", " ", /* @__PURE__ */ S.createElement("code", {
    style: o
  }, "errorElement"), " prop on your route."))), /* @__PURE__ */ S.createElement(S.Fragment, null, /* @__PURE__ */ S.createElement("h2", null, "Unexpected Application Error!"), /* @__PURE__ */ S.createElement("h3", {
    style: {
      fontStyle: "italic"
    }
  }, e), r ? /* @__PURE__ */ S.createElement("pre", {
    style: i
  }, r) : null, a);
}
const xa = /* @__PURE__ */ S.createElement(wa, null);
class Sa extends S.Component {
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
    return this.state.error !== void 0 ? /* @__PURE__ */ S.createElement(Pe.Provider, {
      value: this.props.routeContext
    }, /* @__PURE__ */ S.createElement(en.Provider, {
      value: this.state.error,
      children: this.props.component
    })) : this.props.children;
  }
}
function Ra(t) {
  let {
    routeContext: e,
    match: r,
    children: n
  } = t, i = S.useContext(vt);
  return i && i.static && i.staticContext && (r.route.errorElement || r.route.ErrorBoundary) && (i.staticContext._deepestRenderedBoundaryId = r.route.id), /* @__PURE__ */ S.createElement(Pe.Provider, {
    value: e
  }, n);
}
function Oa(t, e, r, n) {
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
    let f, b = !1, v = null, O = null;
    r && (f = d && u.route.id ? d[u.route.id] : void 0, v = u.route.errorElement || xa, l && (c < 0 && s === 0 ? (Di("route-fallback", !1, "No `HydrateFallback` element provided to render during initial hydration"), b = !0, O = null) : c === s && (b = !0, O = u.route.hydrateFallbackElement || null)));
    let E = e.concat(a.slice(0, s + 1)), m = () => {
      let R;
      return f ? R = v : b ? R = O : u.route.Component ? R = /* @__PURE__ */ S.createElement(u.route.Component, null) : u.route.element ? R = u.route.element : R = h, /* @__PURE__ */ S.createElement(Ra, {
        match: u,
        routeContext: {
          outlet: h,
          matches: E,
          isDataRoute: r != null
        },
        children: R
      });
    };
    return r && (u.route.ErrorBoundary || u.route.errorElement || s === 0) ? /* @__PURE__ */ S.createElement(Sa, {
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
var Ni = /* @__PURE__ */ function(t) {
  return t.UseBlocker = "useBlocker", t.UseRevalidator = "useRevalidator", t.UseNavigateStable = "useNavigate", t;
}(Ni || {}), jt = /* @__PURE__ */ function(t) {
  return t.UseBlocker = "useBlocker", t.UseLoaderData = "useLoaderData", t.UseActionData = "useActionData", t.UseRouteError = "useRouteError", t.UseNavigation = "useNavigation", t.UseRouteLoaderData = "useRouteLoaderData", t.UseMatches = "useMatches", t.UseRevalidator = "useRevalidator", t.UseNavigateStable = "useNavigate", t.UseRouteId = "useRouteId", t;
}(jt || {});
function tn(t) {
  return t + " must be used within a data router.  See https://reactrouter.com/v6/routers/picking-a-router.";
}
function Ta(t) {
  let e = S.useContext(vt);
  return e || (process.env.NODE_ENV !== "production" ? U(!1, tn(t)) : U(!1)), e;
}
function Ca(t) {
  let e = S.useContext(dr);
  return e || (process.env.NODE_ENV !== "production" ? U(!1, tn(t)) : U(!1)), e;
}
function Na(t) {
  let e = S.useContext(Pe);
  return e || (process.env.NODE_ENV !== "production" ? U(!1, tn(t)) : U(!1)), e;
}
function rn(t) {
  let e = Na(t), r = e.matches[e.matches.length - 1];
  return r.route.id || (process.env.NODE_ENV !== "production" ? U(!1, t + ' can only be used on routes that contain a unique "id"') : U(!1)), r.route.id;
}
function Da() {
  return rn(jt.UseRouteId);
}
function Aa() {
  var t;
  let e = S.useContext(en), r = Ca(jt.UseRouteError), n = rn(jt.UseRouteError);
  return e !== void 0 ? e : (t = r.errors) == null ? void 0 : t[n];
}
function ka() {
  let {
    router: t
  } = Ta(Ni.UseNavigateStable), e = rn(jt.UseNavigateStable), r = S.useRef(!1);
  return Oi(() => {
    r.current = !0;
  }), S.useCallback(function(i, o) {
    o === void 0 && (o = {}), process.env.NODE_ENV !== "production" && me(r.current, Ri), r.current && (typeof i == "number" ? t.navigate(i) : t.navigate(i, cr({
      fromRouteId: e
    }, o)));
  }, [t, e]);
}
const $n = {};
function Di(t, e, r) {
  !e && !$n[t] && ($n[t] = !0, process.env.NODE_ENV !== "production" && me(!1, r));
}
const Wn = {};
function La(t, e) {
  process.env.NODE_ENV !== "production" && !Wn[e] && (Wn[e] = !0, console.warn(e));
}
const mt = (t, e, r) => La(t, "⚠️ React Router Future Flag Warning: " + e + ". " + ("You can use the `" + t + "` future flag to opt-in early. ") + ("For more information, see " + r + "."));
function Ma(t, e) {
  (t == null ? void 0 : t.v7_startTransition) === void 0 && mt("v7_startTransition", "React Router will begin wrapping state updates in `React.startTransition` in v7", "https://reactrouter.com/v6/upgrading/future#v7_starttransition"), (t == null ? void 0 : t.v7_relativeSplatPath) === void 0 && (!e || e.v7_relativeSplatPath === void 0) && mt("v7_relativeSplatPath", "Relative route resolution within Splat routes is changing in v7", "https://reactrouter.com/v6/upgrading/future#v7_relativesplatpath"), e && (e.v7_fetcherPersist === void 0 && mt("v7_fetcherPersist", "The persistence behavior of fetchers is changing in v7", "https://reactrouter.com/v6/upgrading/future#v7_fetcherpersist"), e.v7_normalizeFormMethod === void 0 && mt("v7_normalizeFormMethod", "Casing of `formMethod` fields is being normalized to uppercase in v7", "https://reactrouter.com/v6/upgrading/future#v7_normalizeformmethod"), e.v7_partialHydration === void 0 && mt("v7_partialHydration", "`RouterProvider` hydration behavior is changing in v7", "https://reactrouter.com/v6/upgrading/future#v7_partialhydration"), e.v7_skipActionErrorRevalidation === void 0 && mt("v7_skipActionErrorRevalidation", "The revalidation behavior after 4xx/5xx `action` responses is changing in v7", "https://reactrouter.com/v6/upgrading/future#v7_skipactionerrorrevalidation"));
}
function Pa(t) {
  return ba(t.context);
}
function ja(t) {
  let {
    basename: e = "/",
    children: r = null,
    location: n,
    navigationType: i = fe.Pop,
    navigator: o,
    static: a = !1,
    future: d
  } = t;
  It() && (process.env.NODE_ENV !== "production" ? U(!1, "You cannot render a <Router> inside another <Router>. You should never have more than one in your app.") : U(!1));
  let l = e.replace(/^\/*/, "/"), c = S.useMemo(() => ({
    basename: l,
    navigator: o,
    static: a,
    future: cr({
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
  } = n, v = S.useMemo(() => {
    let O = Le(h, l);
    return O == null ? null : {
      location: {
        pathname: O,
        search: u,
        hash: s,
        state: f,
        key: b
      },
      navigationType: i
    };
  }, [l, h, u, s, f, b, i]);
  return process.env.NODE_ENV !== "production" && me(v != null, '<Router basename="' + l + '"> is not able to match the URL ' + ('"' + h + u + s + '" because it does not start with the ') + "basename, so the <Router> won't render anything."), v == null ? null : /* @__PURE__ */ S.createElement(Me.Provider, {
    value: c
  }, /* @__PURE__ */ S.createElement(fr.Provider, {
    children: r,
    value: v
  }));
}
new Promise(() => {
});
function Ia(t) {
  let e = {
    // Note: this check also occurs in createRoutesFromChildren so update
    // there if you change this -- please and thank you!
    hasErrorBoundary: t.ErrorBoundary != null || t.errorElement != null
  };
  return t.Component && (process.env.NODE_ENV !== "production" && t.element && process.env.NODE_ENV !== "production" && me(!1, "You should not include both `Component` and `element` on your route - `Component` will be used."), Object.assign(e, {
    element: /* @__PURE__ */ S.createElement(t.Component),
    Component: void 0
  })), t.HydrateFallback && (process.env.NODE_ENV !== "production" && t.hydrateFallbackElement && process.env.NODE_ENV !== "production" && me(!1, "You should not include both `HydrateFallback` and `hydrateFallbackElement` on your route - `HydrateFallback` will be used."), Object.assign(e, {
    hydrateFallbackElement: /* @__PURE__ */ S.createElement(t.HydrateFallback),
    HydrateFallback: void 0
  })), t.ErrorBoundary && (process.env.NODE_ENV !== "production" && t.errorElement && process.env.NODE_ENV !== "production" && me(!1, "You should not include both `ErrorBoundary` and `errorElement` on your route - `ErrorBoundary` will be used."), Object.assign(e, {
    errorElement: /* @__PURE__ */ S.createElement(t.ErrorBoundary),
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
function nn(t, e) {
  if (t == null) return {};
  var r = {}, n = Object.keys(t), i, o;
  for (o = 0; o < n.length; o++)
    i = n[o], !(e.indexOf(i) >= 0) && (r[i] = t[i]);
  return r;
}
const Zt = "get", er = "application/x-www-form-urlencoded";
function hr(t) {
  return t != null && typeof t.tagName == "string";
}
function Ba(t) {
  return hr(t) && t.tagName.toLowerCase() === "button";
}
function Ua(t) {
  return hr(t) && t.tagName.toLowerCase() === "form";
}
function Fa(t) {
  return hr(t) && t.tagName.toLowerCase() === "input";
}
function Va(t) {
  return !!(t.metaKey || t.altKey || t.ctrlKey || t.shiftKey);
}
function za(t, e) {
  return t.button === 0 && // Ignore everything but left clicks
  (!e || e === "_self") && // Let browser handle "target=_blank" etc.
  !Va(t);
}
let Yt = null;
function qa() {
  if (Yt === null)
    try {
      new FormData(
        document.createElement("form"),
        // @ts-expect-error if FormData supports the submitter parameter, this will throw
        0
      ), Yt = !1;
    } catch {
      Yt = !0;
    }
  return Yt;
}
const Ha = /* @__PURE__ */ new Set(["application/x-www-form-urlencoded", "multipart/form-data", "text/plain"]);
function Or(t) {
  return t != null && !Ha.has(t) ? (process.env.NODE_ENV !== "production" && me(!1, '"' + t + '" is not a valid `encType` for `<Form>`/`<fetcher.Form>` ' + ('and will default to "' + er + '"')), null) : t;
}
function $a(t, e) {
  let r, n, i, o, a;
  if (Ua(t)) {
    let d = t.getAttribute("action");
    n = d ? Le(d, e) : null, r = t.getAttribute("method") || Zt, i = Or(t.getAttribute("enctype")) || er, o = new FormData(t);
  } else if (Ba(t) || Fa(t) && (t.type === "submit" || t.type === "image")) {
    let d = t.form;
    if (d == null)
      throw new Error('Cannot submit a <button> or <input type="submit"> without a <form>');
    let l = t.getAttribute("formaction") || d.getAttribute("action");
    if (n = l ? Le(l, e) : null, r = t.getAttribute("formmethod") || d.getAttribute("method") || Zt, i = Or(t.getAttribute("formenctype")) || Or(d.getAttribute("enctype")) || er, o = new FormData(d, t), !qa()) {
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
    if (hr(t))
      throw new Error('Cannot submit element that is not <form>, <button>, or <input type="submit|image">');
    r = Zt, n = null, i = er, a = t;
  }
  return o && i === "text/plain" && (a = o, o = void 0), {
    action: n,
    method: r.toLowerCase(),
    encType: i,
    formData: o,
    body: a
  };
}
const Wa = ["onClick", "relative", "reloadDocument", "replace", "state", "target", "to", "preventScrollReset", "viewTransition"], Ka = ["aria-current", "caseSensitive", "className", "end", "style", "to", "viewTransition", "children"], Ya = ["fetcherKey", "navigate", "reloadDocument", "replace", "state", "method", "action", "onSubmit", "relative", "preventScrollReset", "viewTransition"], Ga = "6";
try {
  window.__reactRouterVersion = Ga;
} catch {
}
function Ja(t, e) {
  return Jo({
    basename: e == null ? void 0 : e.basename,
    future: tt({}, e == null ? void 0 : e.future, {
      v7_prependBasename: !0
    }),
    history: bo({
      window: e == null ? void 0 : e.window
    }),
    hydrationData: (e == null ? void 0 : e.hydrationData) || Xa(),
    routes: t,
    mapRouteProperties: Ia,
    dataStrategy: e == null ? void 0 : e.dataStrategy,
    patchRoutesOnNavigation: e == null ? void 0 : e.patchRoutesOnNavigation,
    window: e == null ? void 0 : e.window
  }).initialize();
}
function Xa() {
  var t;
  let e = (t = window) == null ? void 0 : t.__staticRouterHydrationData;
  return e && e.errors && (e = tt({}, e, {
    errors: Qa(e.errors)
  })), e;
}
function Qa(t) {
  if (!t) return null;
  let e = Object.entries(t), r = {};
  for (let [n, i] of e)
    if (i && i.__type === "RouteErrorResponse")
      r[n] = new lr(i.status, i.statusText, i.data, i.internal === !0);
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
const on = /* @__PURE__ */ S.createContext({
  isTransitioning: !1
});
process.env.NODE_ENV !== "production" && (on.displayName = "ViewTransition");
const Ai = /* @__PURE__ */ S.createContext(/* @__PURE__ */ new Map());
process.env.NODE_ENV !== "production" && (Ai.displayName = "Fetchers");
const Za = "startTransition", Kn = S[Za], es = "flushSync", Yn = _o[es];
function ts(t) {
  Kn ? Kn(t) : t();
}
function Nt(t) {
  Yn ? Yn(t) : t();
}
class rs {
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
function ns(t) {
  let {
    fallbackElement: e,
    router: r,
    future: n
  } = t, [i, o] = S.useState(r.state), [a, d] = S.useState(), [l, c] = S.useState({
    isTransitioning: !1
  }), [h, u] = S.useState(), [s, f] = S.useState(), [b, v] = S.useState(), O = S.useRef(/* @__PURE__ */ new Map()), {
    v7_startTransition: E
  } = n || {}, m = S.useCallback((D) => {
    E ? ts(D) : D();
  }, [E]), R = S.useCallback((D, q) => {
    let {
      deletedFetchers: j,
      flushSync: F,
      viewTransitionOpts: H
    } = q;
    D.fetchers.forEach((oe, ae) => {
      oe.data !== void 0 && O.current.set(ae, oe.data);
    }), j.forEach((oe) => O.current.delete(oe));
    let ue = r.window == null || r.window.document == null || typeof r.window.document.startViewTransition != "function";
    if (!H || ue) {
      F ? Nt(() => o(D)) : m(() => o(D));
      return;
    }
    if (F) {
      Nt(() => {
        s && (h && h.resolve(), s.skipTransition()), c({
          isTransitioning: !0,
          flushSync: !0,
          currentLocation: H.currentLocation,
          nextLocation: H.nextLocation
        });
      });
      let oe = r.window.document.startViewTransition(() => {
        Nt(() => o(D));
      });
      oe.finished.finally(() => {
        Nt(() => {
          u(void 0), f(void 0), d(void 0), c({
            isTransitioning: !1
          });
        });
      }), Nt(() => f(oe));
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
  }, [r.window, s, h, O, m]);
  S.useLayoutEffect(() => r.subscribe(R), [r, R]), S.useEffect(() => {
    l.isTransitioning && !l.flushSync && u(new rs());
  }, [l]), S.useEffect(() => {
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
  }, [m, a, h, r.window]), S.useEffect(() => {
    h && a && i.location.key === a.location.key && h.resolve();
  }, [h, s, i.location, a]), S.useEffect(() => {
    !l.isTransitioning && b && (d(b.state), c({
      isTransitioning: !0,
      flushSync: !1,
      currentLocation: b.currentLocation,
      nextLocation: b.nextLocation
    }), v(void 0));
  }, [l.isTransitioning, b]), S.useEffect(() => {
    process.env.NODE_ENV !== "production" && me(e == null || !r.future.v7_partialHydration, "`<RouterProvider fallbackElement>` is deprecated when using `v7_partialHydration`, use a `HydrateFallback` component instead");
  }, []);
  let w = S.useMemo(() => ({
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
  }), [r]), N = r.basename || "/", M = S.useMemo(() => ({
    router: r,
    navigator: w,
    static: !1,
    basename: N
  }), [r, w, N]), y = S.useMemo(() => ({
    v7_relativeSplatPath: r.future.v7_relativeSplatPath
  }), [r.future.v7_relativeSplatPath]);
  return S.useEffect(() => Ma(n, r.future), [n, r.future]), /* @__PURE__ */ S.createElement(S.Fragment, null, /* @__PURE__ */ S.createElement(vt.Provider, {
    value: M
  }, /* @__PURE__ */ S.createElement(dr.Provider, {
    value: i
  }, /* @__PURE__ */ S.createElement(Ai.Provider, {
    value: O.current
  }, /* @__PURE__ */ S.createElement(on.Provider, {
    value: l
  }, /* @__PURE__ */ S.createElement(ja, {
    basename: N,
    location: i.location,
    navigationType: i.historyAction,
    navigator: w,
    future: y
  }, i.initialized || r.future.v7_partialHydration ? /* @__PURE__ */ S.createElement(is, {
    routes: r.routes,
    future: r.future,
    state: i
  }) : e))))), null);
}
const is = /* @__PURE__ */ S.memo(os);
function os(t) {
  let {
    routes: e,
    future: r,
    state: n
  } = t;
  return Ea(e, void 0, n, r);
}
process.env.NODE_ENV;
const as = typeof window < "u" && typeof window.document < "u" && typeof window.document.createElement < "u", ss = /^(?:[a-z][a-z0-9+.-]*:|\/\/)/i, pr = /* @__PURE__ */ S.forwardRef(function(e, r) {
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
  } = e, s = nn(e, Wa), {
    basename: f
  } = S.useContext(Me), b, v = !1;
  if (typeof c == "string" && ss.test(c) && (b = c, as))
    try {
      let R = new URL(window.location.href), w = c.startsWith("//") ? new URL(R.protocol + c) : new URL(c), N = Le(w.pathname, f);
      w.origin === R.origin && N != null ? c = N + w.search + w.hash : v = !0;
    } catch {
      process.env.NODE_ENV !== "production" && me(!1, '<Link to="' + c + '"> contains an invalid URL which will probably break when clicked - please update to a valid URL path.');
    }
  let O = ya(c, {
    relative: i
  }), E = ds(c, {
    replace: a,
    state: d,
    target: l,
    preventScrollReset: h,
    relative: i,
    viewTransition: u
  });
  function m(R) {
    n && n(R), R.defaultPrevented || E(R);
  }
  return (
    // eslint-disable-next-line jsx-a11y/anchor-has-content
    /* @__PURE__ */ S.createElement("a", tt({}, s, {
      href: b || O,
      onClick: v || o ? n : m,
      ref: r,
      target: l
    }))
  );
});
process.env.NODE_ENV !== "production" && (pr.displayName = "Link");
const ls = /* @__PURE__ */ S.forwardRef(function(e, r) {
  let {
    "aria-current": n = "page",
    caseSensitive: i = !1,
    className: o = "",
    end: a = !1,
    style: d,
    to: l,
    viewTransition: c,
    children: h
  } = e, u = nn(e, Ka), s = Bt(l, {
    relative: u.relative
  }), f = ut(), b = S.useContext(dr), {
    navigator: v,
    basename: O
  } = S.useContext(Me), E = b != null && // Conditional usage is OK here because the usage of a data router is static
  // eslint-disable-next-line react-hooks/rules-of-hooks
  ys(s) && c === !0, m = v.encodeLocation ? v.encodeLocation(s).pathname : s.pathname, R = f.pathname, w = b && b.navigation && b.navigation.location ? b.navigation.location.pathname : null;
  i || (R = R.toLowerCase(), w = w ? w.toLowerCase() : null, m = m.toLowerCase()), w && O && (w = Le(w, O) || w);
  const N = m !== "/" && m.endsWith("/") ? m.length - 1 : m.length;
  let M = R === m || !a && R.startsWith(m) && R.charAt(N) === "/", y = w != null && (w === m || !a && w.startsWith(m) && w.charAt(m.length) === "/"), D = {
    isActive: M,
    isPending: y,
    isTransitioning: E
  }, q = M ? n : void 0, j;
  typeof o == "function" ? j = o(D) : j = [o, M ? "active" : null, y ? "pending" : null, E ? "transitioning" : null].filter(Boolean).join(" ");
  let F = typeof d == "function" ? d(D) : d;
  return /* @__PURE__ */ S.createElement(pr, tt({}, u, {
    "aria-current": q,
    className: j,
    ref: r,
    style: F,
    to: l,
    viewTransition: c
  }), typeof h == "function" ? h(D) : h);
});
process.env.NODE_ENV !== "production" && (ls.displayName = "NavLink");
const cs = /* @__PURE__ */ S.forwardRef((t, e) => {
  let {
    fetcherKey: r,
    navigate: n,
    reloadDocument: i,
    replace: o,
    state: a,
    method: d = Zt,
    action: l,
    onSubmit: c,
    relative: h,
    preventScrollReset: u,
    viewTransition: s
  } = t, f = nn(t, Ya), b = ms(), v = gs(l, {
    relative: h
  }), O = d.toLowerCase() === "get" ? "get" : "post", E = (m) => {
    if (c && c(m), m.defaultPrevented) return;
    m.preventDefault();
    let R = m.nativeEvent.submitter, w = (R == null ? void 0 : R.getAttribute("formmethod")) || d;
    b(R || m.currentTarget, {
      fetcherKey: r,
      method: w,
      navigate: n,
      replace: o,
      state: a,
      relative: h,
      preventScrollReset: u,
      viewTransition: s
    });
  };
  return /* @__PURE__ */ S.createElement("form", tt({
    ref: e,
    method: O,
    action: v,
    onSubmit: i ? c : E
  }, f));
});
process.env.NODE_ENV !== "production" && (cs.displayName = "Form");
process.env.NODE_ENV;
var ur;
(function(t) {
  t.UseScrollRestoration = "useScrollRestoration", t.UseSubmit = "useSubmit", t.UseSubmitFetcher = "useSubmitFetcher", t.UseFetcher = "useFetcher", t.useViewTransitionState = "useViewTransitionState";
})(ur || (ur = {}));
var Gn;
(function(t) {
  t.UseFetcher = "useFetcher", t.UseFetchers = "useFetchers", t.UseScrollRestoration = "useScrollRestoration";
})(Gn || (Gn = {}));
function us(t) {
  return t + " must be used within a data router.  See https://reactrouter.com/v6/routers/picking-a-router.";
}
function ki(t) {
  let e = S.useContext(vt);
  return e || (process.env.NODE_ENV !== "production" ? U(!1, us(t)) : U(!1)), e;
}
function ds(t, e) {
  let {
    target: r,
    replace: n,
    state: i,
    preventScrollReset: o,
    relative: a,
    viewTransition: d
  } = e === void 0 ? {} : e, l = Ti(), c = ut(), h = Bt(t, {
    relative: a
  });
  return S.useCallback((u) => {
    if (za(u, r)) {
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
function fs() {
  if (typeof document > "u")
    throw new Error("You are calling submit during the server render. Try calling submit within a `useEffect` or callback instead.");
}
let hs = 0, ps = () => "__" + String(++hs) + "__";
function ms() {
  let {
    router: t
  } = ki(ur.UseSubmit), {
    basename: e
  } = S.useContext(Me), r = Da();
  return S.useCallback(function(n, i) {
    i === void 0 && (i = {}), fs();
    let {
      action: o,
      method: a,
      encType: d,
      formData: l,
      body: c
    } = $a(n, e);
    if (i.navigate === !1) {
      let h = i.fetcherKey || ps();
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
function gs(t, e) {
  let {
    relative: r
  } = e === void 0 ? {} : e, {
    basename: n
  } = S.useContext(Me), i = S.useContext(Pe);
  i || (process.env.NODE_ENV !== "production" ? U(!1, "useFormAction must be used inside a RouteContext") : U(!1));
  let [o] = i.matches.slice(-1), a = tt({}, Bt(t || ".", {
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
function ys(t, e) {
  e === void 0 && (e = {});
  let r = S.useContext(on);
  r == null && (process.env.NODE_ENV !== "production" ? U(!1, "`useViewTransitionState` must be used within `react-router-dom`'s `RouterProvider`.  Did you accidentally import `RouterProvider` from `react-router`?") : U(!1));
  let {
    basename: n
  } = ki(ur.useViewTransitionState), i = Bt(t, {
    relative: e.relative
  });
  if (!r.isTransitioning)
    return !1;
  let o = Le(r.currentLocation.pathname, n) || r.currentLocation.pathname, a = Le(r.nextLocation.pathname, n) || r.nextLocation.pathname;
  return sr(i.pathname, a) != null || sr(i.pathname, o) != null;
}
const vs = {}, Jn = (t) => {
  let e;
  const r = /* @__PURE__ */ new Set(), n = (h, u) => {
    const s = typeof h == "function" ? h(e) : h;
    if (!Object.is(s, e)) {
      const f = e;
      e = u ?? (typeof s != "object" || s === null) ? s : Object.assign({}, e, s), r.forEach((b) => b(e, f));
    }
  }, i = () => e, l = { setState: n, getState: i, getInitialState: () => c, subscribe: (h) => (r.add(h), () => r.delete(h)), destroy: () => {
    (vs ? "production" : void 0) !== "production" && console.warn(
      "[DEPRECATED] The `destroy` method will be unsupported in a future version. Instead use unsubscribe function returned by subscribe. Everything will be garbage-collected if store is garbage-collected."
    ), r.clear();
  } }, c = e = t(n, i, l);
  return l;
}, _s = (t) => t ? Jn(t) : Jn;
var Fr = { exports: {} }, Tr = {}, Gt = { exports: {} }, Cr = {};
/**
 * @license React
 * use-sync-external-store-shim.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var Xn;
function bs() {
  if (Xn) return Cr;
  Xn = 1;
  var t = We;
  function e(u, s) {
    return u === s && (u !== 0 || 1 / u === 1 / s) || u !== u && s !== s;
  }
  var r = typeof Object.is == "function" ? Object.is : e, n = t.useState, i = t.useEffect, o = t.useLayoutEffect, a = t.useDebugValue;
  function d(u, s) {
    var f = s(), b = n({ inst: { value: f, getSnapshot: s } }), v = b[0].inst, O = b[1];
    return o(
      function() {
        v.value = f, v.getSnapshot = s, l(v) && O({ inst: v });
      },
      [u, f, s]
    ), i(
      function() {
        return l(v) && O({ inst: v }), u(function() {
          l(v) && O({ inst: v });
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
  return Cr.useSyncExternalStore = t.useSyncExternalStore !== void 0 ? t.useSyncExternalStore : h, Cr;
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
var Qn;
function Es() {
  return Qn || (Qn = 1, process.env.NODE_ENV !== "production" && function() {
    function t(f, b) {
      return f === b && (f !== 0 || 1 / f === 1 / b) || f !== f && b !== b;
    }
    function e(f, b) {
      h || i.startTransition === void 0 || (h = !0, console.error(
        "You are using an outdated, pre-release alpha of React 18 that does not support useSyncExternalStore. The use-sync-external-store shim will not work correctly. Upgrade to a newer pre-release."
      ));
      var v = b();
      if (!u) {
        var O = b();
        o(v, O) || (console.error(
          "The result of getSnapshot should be cached to avoid an infinite loop"
        ), u = !0);
      }
      O = a({
        inst: { value: v, getSnapshot: b }
      });
      var E = O[0].inst, m = O[1];
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
var Zn;
function Li() {
  return Zn || (Zn = 1, process.env.NODE_ENV === "production" ? Gt.exports = bs() : Gt.exports = Es()), Gt.exports;
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
var ei;
function ws() {
  if (ei) return Tr;
  ei = 1;
  var t = We, e = Li();
  function r(c, h) {
    return c === h && (c !== 0 || 1 / c === 1 / h) || c !== c && h !== h;
  }
  var n = typeof Object.is == "function" ? Object.is : r, i = e.useSyncExternalStore, o = t.useRef, a = t.useEffect, d = t.useMemo, l = t.useDebugValue;
  return Tr.useSyncExternalStoreWithSelector = function(c, h, u, s, f) {
    var b = o(null);
    if (b.current === null) {
      var v = { hasValue: !1, value: null };
      b.current = v;
    } else v = b.current;
    b = d(
      function() {
        function E(M) {
          if (!m) {
            if (m = !0, R = M, M = s(M), f !== void 0 && v.hasValue) {
              var y = v.value;
              if (f(y, M))
                return w = y;
            }
            return w = M;
          }
          if (y = w, n(R, M)) return y;
          var D = s(M);
          return f !== void 0 && f(y, D) ? (R = M, y) : (R = M, w = D);
        }
        var m = !1, R, w, N = u === void 0 ? null : u;
        return [
          function() {
            return E(h());
          },
          N === null ? void 0 : function() {
            return E(N());
          }
        ];
      },
      [h, u, s, f]
    );
    var O = i(c, b[0], b[1]);
    return a(
      function() {
        v.hasValue = !0, v.value = O;
      },
      [O]
    ), l(O), O;
  }, Tr;
}
var Dr = {};
/**
 * @license React
 * use-sync-external-store-shim/with-selector.development.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var ti;
function xs() {
  return ti || (ti = 1, process.env.NODE_ENV !== "production" && function() {
    function t(c, h) {
      return c === h && (c !== 0 || 1 / c === 1 / h) || c !== c && h !== h;
    }
    typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u" && typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart == "function" && __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart(Error());
    var e = We, r = Li(), n = typeof Object.is == "function" ? Object.is : t, i = r.useSyncExternalStore, o = e.useRef, a = e.useEffect, d = e.useMemo, l = e.useDebugValue;
    Dr.useSyncExternalStoreWithSelector = function(c, h, u, s, f) {
      var b = o(null);
      if (b.current === null) {
        var v = { hasValue: !1, value: null };
        b.current = v;
      } else v = b.current;
      b = d(
        function() {
          function E(M) {
            if (!m) {
              if (m = !0, R = M, M = s(M), f !== void 0 && v.hasValue) {
                var y = v.value;
                if (f(y, M))
                  return w = y;
              }
              return w = M;
            }
            if (y = w, n(R, M))
              return y;
            var D = s(M);
            return f !== void 0 && f(y, D) ? (R = M, y) : (R = M, w = D);
          }
          var m = !1, R, w, N = u === void 0 ? null : u;
          return [
            function() {
              return E(h());
            },
            N === null ? void 0 : function() {
              return E(N());
            }
          ];
        },
        [h, u, s, f]
      );
      var O = i(c, b[0], b[1]);
      return a(
        function() {
          v.hasValue = !0, v.value = O;
        },
        [O]
      ), l(O), O;
    }, typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u" && typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop == "function" && __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop(Error());
  }()), Dr;
}
process.env.NODE_ENV === "production" ? Fr.exports = ws() : Fr.exports = xs();
var Ss = Fr.exports;
const Rs = /* @__PURE__ */ hi(Ss), Mi = {}, { useDebugValue: Os } = We, { useSyncExternalStoreWithSelector: Ts } = Rs;
let ri = !1;
const Cs = (t) => t;
function Ns(t, e = Cs, r) {
  (Mi ? "production" : void 0) !== "production" && r && !ri && (console.warn(
    "[DEPRECATED] Use `createWithEqualityFn` instead of `create` or use `useStoreWithEqualityFn` instead of `useStore`. They can be imported from 'zustand/traditional'. https://github.com/pmndrs/zustand/discussions/1937"
  ), ri = !0);
  const n = Ts(
    t.subscribe,
    t.getState,
    t.getServerState || t.getInitialState,
    e,
    r
  );
  return Os(n), n;
}
const ni = (t) => {
  (Mi ? "production" : void 0) !== "production" && typeof t != "function" && console.warn(
    "[DEPRECATED] Passing a vanilla store will be unsupported in a future version. Instead use `import { useStore } from 'zustand'`."
  );
  const e = typeof t == "function" ? _s(t) : t, r = (n, i) => Ns(e, n, i);
  return Object.assign(r, e), r;
}, Ds = (t) => t ? ni(t) : ni, gt = [
  "frieren",
  "himmel",
  "heiter",
  "eisen",
  "fern",
  "stark",
  "sein",
  "übel"
], As = {
  frieren: "#7f7c84",
  himmel: "#bddaf9",
  heiter: "#78855e",
  eisen: "#cfccc0",
  fern: "#794983",
  stark: "#af4a33",
  sein: "#936f42",
  übel: "#667240"
};
function an(t) {
  return `/media/sprites/square_${t}.png`;
}
const Ar = "wp_leader_key", G = Ds((t, e) => ({
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
    n && r ? localStorage.setItem(Ar, r) : localStorage.removeItem(Ar), t({ adminKey: r, rememberAdmin: n });
  },
  hydrateAdminKey: () => {
    const r = localStorage.getItem(Ar);
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
function ks() {
  const t = G((r) => r.toasts), e = G((r) => r.popToast);
  return Ne(() => {
    const r = t.map((n) => setTimeout(() => e(n.id), 4e3));
    return () => {
      r.forEach(clearTimeout);
    };
  }, [t, e]), /* @__PURE__ */ x.jsx("div", { className: "fixed bottom-4 left-1/2 -translate-x-1/2 flex flex-col gap-2 z-50", children: t.map((r) => /* @__PURE__ */ x.jsx("div", { className: `px-3 py-2 rounded text-sm shadow font-medium bg-slate-800 border ${r.kind === "error" ? "border-red-500 text-red-300" : "border-slate-600 text-slate-200"}`, children: r.msg }, r.id)) });
}
const Ls = 400;
function sn() {
  const t = Xe(null), e = Xe([]);
  return Ne(() => {
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
    function d(f, b, v = !1, O) {
      let E = Math.random();
      const m = O ?? o;
      O === void 0 && o++;
      const R = v ? a(m) : { scale: 1, demote: 0 };
      let w = E > 0.998, N = !w && E > 0.98;
      R.demote > 0 && (w && Math.random() < R.demote && (w = !1), N && Math.random() < R.demote && (N = !1)), v && (w = !1, N = !1);
      const M = N;
      let y;
      w ? y = 0.92 + Math.random() * 0.08 : N ? y = 0.85 + Math.random() * 0.15 : y = 0.05 + Math.random() ** 2.2 * 0.75;
      const D = (Ft, qe) => {
        const yr = Math.random(), vr = Math.random();
        return Ft + (yr + vr) / 2 * (qe - Ft);
      };
      let q = D(0.9, 1.4) + y ** 1.2 * (w ? 5.5 : N ? 4 : 3.2);
      const j = D(0.85, 1.25);
      let F = q * j;
      v && R.scale < 1 && (F *= R.scale);
      let H;
      w ? H = 1.05 + Math.random() * 0.5 : N ? (H = 0.55 + y ** 1.05 * 0.7 + Math.random() * 0.25, H > 1.25 && (H = 1.25)) : (H = 0.15 + y ** 1.05 * 0.6 + Math.random() * 0.15, H > 1.05 && (H = 1.05)), !w && H < 0.15 && (H = 0.15);
      const ue = 0.035 + D(0, 0.08), oe = y ** 1.45 * (w ? 4.9 : N ? 1.55 : 1.25);
      let ae = ue + oe * D(0.85, 1.3);
      v && R.scale < 1 && (ae *= R.scale);
      const De = Math.min(1, H), Ee = Math.min(1, (F - 1) / 4.5);
      ae *= 1 + 0.18 * Math.max(De, Ee), w && ae < 1.25 && (ae = 1.25 + Math.random() * 0.4);
      const ie = r.width, je = r.height, T = 0.18 + Math.random() * 0.28, V = w || Math.random() < 0.18, W = w ? 0.55 : M ? 0.38 : Math.max(0.1, 0.28 - T * 0.25), Z = H * (W + Math.random() * (1 - W)), ve = H * (W + Math.random() * (1 - W)), re = (w ? 130 : M ? 160 : 120) + Math.random() * (w ? 140 : 150), we = Math.min(1, ae / 2.5), te = 10, Ke = 120 - te;
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
        microSpeed: (w ? 0.18 : 0.1) + Math.random() * 0.05,
        ultraRare: w,
        trail: w ? [] : void 0,
        currentAlpha: Z,
        lifeMsRemaining: bt,
        lifeMsTotal: bt
      };
    }
    if (!e.current.length)
      for (let f = 0; f < Ls; f++) e.current.push(d(void 0, void 0, !0, f));
    let l = performance.now();
    function c(f, b, v, O) {
      const R = (0.15 + 0.75 * Math.min(1, O / 2)) * v, w = v, N = v, M = Math.min(R, N * 0.95, w * 0.48), y = f, D = b, q = f + w, j = b + N, F = n;
      F.beginPath(), F.moveTo(y, D), F.lineTo(q, D), F.lineTo(q, j - M), F.quadraticCurveTo(q, j, q - M, j), F.lineTo(y + M, j), F.quadraticCurveTo(y, j, y, j - M), F.lineTo(y, D), F.closePath(), F.fill();
    }
    function h(f, b) {
      if (b > 3 && (b = 3), !f.twinkleEnabled) {
        f.currentAlpha = f.alpha;
        return;
      }
      if (f.twinkleT += b, f.twinkleT >= f.twinkleDuration) {
        f.twinkleStart = f.twinkleTarget, f.twinkleTarget = f.alpha * (f.dimFloor + Math.random() * (1 - f.dimFloor));
        const m = f.ultraRare ? 150 : f.colorRare ? 140 : 110, R = f.ultraRare ? 170 : 140;
        f.twinkleDuration = m + Math.random() * R, f.twinkleT = 0;
      }
      const v = Math.min(1, f.twinkleT / f.twinkleDuration), O = v * v * (3 - 2 * v);
      let E = f.twinkleStart + (f.twinkleTarget - f.twinkleStart) * O;
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
        ], O = f.colorPhase % v.length, E = Math.floor(O), m = (E + 1) % v.length, R = O - E, w = v[E], N = v[m], M = Math.round(w[0] + (N[0] - w[0]) * R), y = Math.round(w[1] + (N[1] - w[1]) * R), D = Math.round(w[2] + (N[2] - w[2]) * R);
        return `rgb(${M},${y},${D})`;
      }
      if (f.colorRare) {
        f.colorPhase += f.colorSpeed * b;
        const v = (Math.sin(f.colorPhase) + 1) / 2;
        if (f.colorMode === 0) {
          const O = Math.round(255 - 165 * v), E = Math.round(255 - 105 * v);
          return `rgb(${O},${E},255)`;
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
      const O = 220;
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
        if (m.y += m.speed * v, m.y - m.size > r.height + O) {
          e.current[E] = d(Math.random() * r.width, -m.size - 1);
          continue;
        }
        h(m, v);
        const R = m.currentAlpha ?? m.alpha, w = 1500, N = m.lifeMsRemaining < w ? Math.max(0, m.lifeMsRemaining / w) : 1, M = R * N;
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
  }, []), /* @__PURE__ */ x.jsx(
    "canvas",
    {
      ref: t,
      "data-darkreader-ignore": !0,
      className: "fixed inset-0 z-0 bg-black pointer-events-none [isolation:isolate]"
    }
  );
}
function Ms() {
  const t = ["dev-room-1000"];
  return /* @__PURE__ */ x.jsxs("div", { className: "relative h-full flex flex-col items-center justify-center gap-10 py-24", children: [
    /* @__PURE__ */ x.jsx(sn, {}),
    /* @__PURE__ */ x.jsx("h1", { className: "text-4xl font-bold tracking-tight drop-shadow", children: "Watchparty" }),
    /* @__PURE__ */ x.jsxs("div", { className: "w-full max-w-md space-y-4 z-10", children: [
      /* @__PURE__ */ x.jsx("h2", { className: "text-sm uppercase tracking-wide opacity-70", children: "Rooms" }),
      /* @__PURE__ */ x.jsx("ul", { className: "space-y-2", children: t.map((e) => /* @__PURE__ */ x.jsx("li", { children: /* @__PURE__ */ x.jsxs(pr, { to: `/room/${encodeURIComponent(e)}`, className: "block bg-slate-900/80 backdrop-blur border border-slate-700 hover:border-slate-500 rounded px-4 py-3 transition-colors", children: [
        /* @__PURE__ */ x.jsx("div", { className: "font-medium", children: e }),
        /* @__PURE__ */ x.jsx("div", { className: "text-[11px] opacity-60", children: "Join room" })
      ] }) }, e)) }),
      /* @__PURE__ */ x.jsx("div", { className: "pt-6 text-xs opacity-50", children: "Provide ?roomKey=&leaderKey= query params to deep link directly." })
    ] })
  ] });
}
function Ps() {
  const t = G((r) => r.roster), e = Object.values(t);
  return e.length ? /* @__PURE__ */ x.jsx("ul", { className: "text-xs space-y-1", children: e.map((r) => {
    const n = r.name && As[r.name] || "#cbd5e1";
    return /* @__PURE__ */ x.jsxs("li", { className: "flex items-center gap-2", children: [
      r.sprite ? /* @__PURE__ */ x.jsx("img", { src: an(r.sprite), alt: r.sprite, className: "w-7 h-7 rounded object-cover" }) : /* @__PURE__ */ x.jsx("span", { className: "inline-block w-7 h-7 bg-slate-700/50 rounded" }),
      /* @__PURE__ */ x.jsx("span", { className: "truncate max-w-[120px] font-medium", style: { color: n }, children: r.name || "Anon" }),
      r.isLeader && /* @__PURE__ */ x.jsx("span", { className: "px-1 rounded bg-emerald-600 text-[9px]", children: "L" })
    ] }, r.clientId);
  }) }) : /* @__PURE__ */ x.jsx("div", { className: "text-xs opacity-50", children: "No users" });
}
const Ue = /* @__PURE__ */ Object.create(null);
Ue.open = "0";
Ue.close = "1";
Ue.ping = "2";
Ue.pong = "3";
Ue.message = "4";
Ue.upgrade = "5";
Ue.noop = "6";
const tr = /* @__PURE__ */ Object.create(null);
Object.keys(Ue).forEach((t) => {
  tr[Ue[t]] = t;
});
const Vr = { type: "error", data: "parser error" }, Pi = typeof Blob == "function" || typeof Blob < "u" && Object.prototype.toString.call(Blob) === "[object BlobConstructor]", ji = typeof ArrayBuffer == "function", Ii = (t) => typeof ArrayBuffer.isView == "function" ? ArrayBuffer.isView(t) : t && t.buffer instanceof ArrayBuffer, ln = ({ type: t, data: e }, r, n) => Pi && e instanceof Blob ? r ? n(e) : ii(e, n) : ji && (e instanceof ArrayBuffer || Ii(e)) ? r ? n(e) : ii(new Blob([e]), n) : n(Ue[t] + (e || "")), ii = (t, e) => {
  const r = new FileReader();
  return r.onload = function() {
    const n = r.result.split(",")[1];
    e("b" + (n || ""));
  }, r.readAsDataURL(t);
};
function oi(t) {
  return t instanceof Uint8Array ? t : t instanceof ArrayBuffer ? new Uint8Array(t) : new Uint8Array(t.buffer, t.byteOffset, t.byteLength);
}
let kr;
function js(t, e) {
  if (Pi && t.data instanceof Blob)
    return t.data.arrayBuffer().then(oi).then(e);
  if (ji && (t.data instanceof ArrayBuffer || Ii(t.data)))
    return e(oi(t.data));
  ln(t, !1, (r) => {
    kr || (kr = new TextEncoder()), e(kr.encode(r));
  });
}
const ai = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/", kt = typeof Uint8Array > "u" ? [] : new Uint8Array(256);
for (let t = 0; t < ai.length; t++)
  kt[ai.charCodeAt(t)] = t;
const Is = (t) => {
  let e = t.length * 0.75, r = t.length, n, i = 0, o, a, d, l;
  t[t.length - 1] === "=" && (e--, t[t.length - 2] === "=" && e--);
  const c = new ArrayBuffer(e), h = new Uint8Array(c);
  for (n = 0; n < r; n += 4)
    o = kt[t.charCodeAt(n)], a = kt[t.charCodeAt(n + 1)], d = kt[t.charCodeAt(n + 2)], l = kt[t.charCodeAt(n + 3)], h[i++] = o << 2 | a >> 4, h[i++] = (a & 15) << 4 | d >> 2, h[i++] = (d & 3) << 6 | l & 63;
  return c;
}, Bs = typeof ArrayBuffer == "function", cn = (t, e) => {
  if (typeof t != "string")
    return {
      type: "message",
      data: Bi(t, e)
    };
  const r = t.charAt(0);
  return r === "b" ? {
    type: "message",
    data: Us(t.substring(1), e)
  } : tr[r] ? t.length > 1 ? {
    type: tr[r],
    data: t.substring(1)
  } : {
    type: tr[r]
  } : Vr;
}, Us = (t, e) => {
  if (Bs) {
    const r = Is(t);
    return Bi(r, e);
  } else
    return { base64: !0, data: t };
}, Bi = (t, e) => {
  switch (e) {
    case "blob":
      return t instanceof Blob ? t : new Blob([t]);
    case "arraybuffer":
    default:
      return t instanceof ArrayBuffer ? t : t.buffer;
  }
}, Ui = "", Fs = (t, e) => {
  const r = t.length, n = new Array(r);
  let i = 0;
  t.forEach((o, a) => {
    ln(o, !1, (d) => {
      n[a] = d, ++i === r && e(n.join(Ui));
    });
  });
}, Vs = (t, e) => {
  const r = t.split(Ui), n = [];
  for (let i = 0; i < r.length; i++) {
    const o = cn(r[i], e);
    if (n.push(o), o.type === "error")
      break;
  }
  return n;
};
function zs() {
  return new TransformStream({
    transform(t, e) {
      js(t, (r) => {
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
let Lr;
function Jt(t) {
  return t.reduce((e, r) => e + r.length, 0);
}
function Xt(t, e) {
  if (t[0].length === e)
    return t.shift();
  const r = new Uint8Array(e);
  let n = 0;
  for (let i = 0; i < e; i++)
    r[i] = t[0][n++], n === t[0].length && (t.shift(), n = 0);
  return t.length && n < t[0].length && (t[0] = t[0].slice(n)), r;
}
function qs(t, e) {
  Lr || (Lr = new TextDecoder());
  const r = [];
  let n = 0, i = -1, o = !1;
  return new TransformStream({
    transform(a, d) {
      for (r.push(a); ; ) {
        if (n === 0) {
          if (Jt(r) < 1)
            break;
          const l = Xt(r, 1);
          o = (l[0] & 128) === 128, i = l[0] & 127, i < 126 ? n = 3 : i === 126 ? n = 1 : n = 2;
        } else if (n === 1) {
          if (Jt(r) < 2)
            break;
          const l = Xt(r, 2);
          i = new DataView(l.buffer, l.byteOffset, l.length).getUint16(0), n = 3;
        } else if (n === 2) {
          if (Jt(r) < 8)
            break;
          const l = Xt(r, 8), c = new DataView(l.buffer, l.byteOffset, l.length), h = c.getUint32(0);
          if (h > Math.pow(2, 21) - 1) {
            d.enqueue(Vr);
            break;
          }
          i = h * Math.pow(2, 32) + c.getUint32(4), n = 3;
        } else {
          if (Jt(r) < i)
            break;
          const l = Xt(r, i);
          d.enqueue(cn(o ? l : Lr.decode(l), e)), n = 0;
        }
        if (i === 0 || i > t) {
          d.enqueue(Vr);
          break;
        }
      }
    }
  });
}
const Fi = 4;
function he(t) {
  if (t) return Hs(t);
}
function Hs(t) {
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
const mr = typeof Promise == "function" && typeof Promise.resolve == "function" ? (e) => Promise.resolve().then(e) : (e, r) => r(e, 0), Ce = typeof self < "u" ? self : typeof window < "u" ? window : Function("return this")(), $s = "arraybuffer";
function Vi(t, ...e) {
  return e.reduce((r, n) => (t.hasOwnProperty(n) && (r[n] = t[n]), r), {});
}
const Ws = Ce.setTimeout, Ks = Ce.clearTimeout;
function gr(t, e) {
  e.useNativeTimers ? (t.setTimeoutFn = Ws.bind(Ce), t.clearTimeoutFn = Ks.bind(Ce)) : (t.setTimeoutFn = Ce.setTimeout.bind(Ce), t.clearTimeoutFn = Ce.clearTimeout.bind(Ce));
}
const Ys = 1.33;
function Gs(t) {
  return typeof t == "string" ? Js(t) : Math.ceil((t.byteLength || t.size) * Ys);
}
function Js(t) {
  let e = 0, r = 0;
  for (let n = 0, i = t.length; n < i; n++)
    e = t.charCodeAt(n), e < 128 ? r += 1 : e < 2048 ? r += 2 : e < 55296 || e >= 57344 ? r += 3 : (n++, r += 4);
  return r;
}
function zi() {
  return Date.now().toString(36).substring(3) + Math.random().toString(36).substring(2, 5);
}
function Xs(t) {
  let e = "";
  for (let r in t)
    t.hasOwnProperty(r) && (e.length && (e += "&"), e += encodeURIComponent(r) + "=" + encodeURIComponent(t[r]));
  return e;
}
function Qs(t) {
  let e = {}, r = t.split("&");
  for (let n = 0, i = r.length; n < i; n++) {
    let o = r[n].split("=");
    e[decodeURIComponent(o[0])] = decodeURIComponent(o[1]);
  }
  return e;
}
class Zs extends Error {
  constructor(e, r, n) {
    super(e), this.description = r, this.context = n, this.type = "TransportError";
  }
}
class un extends he {
  /**
   * Transport abstract constructor.
   *
   * @param {Object} opts - options
   * @protected
   */
  constructor(e) {
    super(), this.writable = !1, gr(this, e), this.opts = e, this.query = e.query, this.socket = e.socket, this.supportsBinary = !e.forceBase64;
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
    return super.emitReserved("error", new Zs(e, r, n)), this;
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
    const r = cn(e, this.socket.binaryType);
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
    const r = Xs(e);
    return r.length ? "?" + r : "";
  }
}
class el extends un {
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
    Vs(e, this.socket.binaryType).forEach(r), this.readyState !== "closed" && (this._polling = !1, this.emitReserved("pollComplete"), this.readyState === "open" && this._poll());
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
    this.writable = !1, Fs(e, (r) => {
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
    return this.opts.timestampRequests !== !1 && (r[this.opts.timestampParam] = zi()), !this.supportsBinary && !r.sid && (r.b64 = 1), this.createUri(e, r);
  }
}
let qi = !1;
try {
  qi = typeof XMLHttpRequest < "u" && "withCredentials" in new XMLHttpRequest();
} catch {
}
const tl = qi;
function rl() {
}
class nl extends el {
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
let yt = class rr extends he {
  /**
   * Request constructor
   *
   * @param {Object} options
   * @package
   */
  constructor(e, r, n) {
    super(), this.createRequest = e, gr(this, n), this._opts = n, this._method = n.method || "GET", this._uri = r, this._data = n.data !== void 0 ? n.data : null, this._create();
  }
  /**
   * Creates the XHR object and sends the request.
   *
   * @private
   */
  _create() {
    var e;
    const r = Vi(this._opts, "agent", "pfx", "key", "passphrase", "cert", "ca", "ciphers", "rejectUnauthorized", "autoUnref");
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
    typeof document < "u" && (this._index = rr.requestsCount++, rr.requests[this._index] = this);
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
      if (this._xhr.onreadystatechange = rl, e)
        try {
          this._xhr.abort();
        } catch {
        }
      typeof document < "u" && delete rr.requests[this._index], this._xhr = null;
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
    attachEvent("onunload", si);
  else if (typeof addEventListener == "function") {
    const t = "onpagehide" in Ce ? "pagehide" : "unload";
    addEventListener(t, si, !1);
  }
}
function si() {
  for (let t in yt.requests)
    yt.requests.hasOwnProperty(t) && yt.requests[t].abort();
}
const il = function() {
  const t = Hi({
    xdomain: !1
  });
  return t && t.responseType !== null;
}();
class ol extends nl {
  constructor(e) {
    super(e);
    const r = e && e.forceBase64;
    this.supportsBinary = il && !r;
  }
  request(e = {}) {
    return Object.assign(e, { xd: this.xd }, this.opts), new yt(Hi, this.uri(), e);
  }
}
function Hi(t) {
  const e = t.xdomain;
  try {
    if (typeof XMLHttpRequest < "u" && (!e || tl))
      return new XMLHttpRequest();
  } catch {
  }
  if (!e)
    try {
      return new Ce[["Active"].concat("Object").join("X")]("Microsoft.XMLHTTP");
    } catch {
    }
}
const $i = typeof navigator < "u" && typeof navigator.product == "string" && navigator.product.toLowerCase() === "reactnative";
class al extends un {
  get name() {
    return "websocket";
  }
  doOpen() {
    const e = this.uri(), r = this.opts.protocols, n = $i ? {} : Vi(this.opts, "agent", "perMessageDeflate", "pfx", "key", "passphrase", "cert", "ca", "ciphers", "rejectUnauthorized", "localAddress", "protocolVersion", "origin", "maxPayload", "family", "checkServerIdentity");
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
      ln(n, this.supportsBinary, (o) => {
        try {
          this.doWrite(n, o);
        } catch {
        }
        i && mr(() => {
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
    return this.opts.timestampRequests && (r[this.opts.timestampParam] = zi()), this.supportsBinary || (r.b64 = 1), this.createUri(e, r);
  }
}
const Mr = Ce.WebSocket || Ce.MozWebSocket;
class sl extends al {
  createSocket(e, r, n) {
    return $i ? new Mr(e, r, n) : r ? new Mr(e, r) : new Mr(e);
  }
  doWrite(e, r) {
    this.ws.send(r);
  }
}
class ll extends un {
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
        const r = qs(Number.MAX_SAFE_INTEGER, this.socket.binaryType), n = e.readable.pipeThrough(r).getReader(), i = zs();
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
        i && mr(() => {
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
const cl = {
  websocket: sl,
  webtransport: ll,
  polling: ol
}, ul = /^(?:(?![^:@\/?#]+:[^:@\/]*@)(http|https|ws|wss):\/\/)?((?:(([^:@\/?#]*)(?::([^:@\/?#]*))?)?@)?((?:[a-f0-9]{0,4}:){2,7}[a-f0-9]{0,4}|[^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/, dl = [
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
function zr(t) {
  if (t.length > 8e3)
    throw "URI too long";
  const e = t, r = t.indexOf("["), n = t.indexOf("]");
  r != -1 && n != -1 && (t = t.substring(0, r) + t.substring(r, n).replace(/:/g, ";") + t.substring(n, t.length));
  let i = ul.exec(t || ""), o = {}, a = 14;
  for (; a--; )
    o[dl[a]] = i[a] || "";
  return r != -1 && n != -1 && (o.source = e, o.host = o.host.substring(1, o.host.length - 1).replace(/;/g, ":"), o.authority = o.authority.replace("[", "").replace("]", "").replace(/;/g, ":"), o.ipv6uri = !0), o.pathNames = fl(o, o.path), o.queryKey = hl(o, o.query), o;
}
function fl(t, e) {
  const r = /\/{2,9}/g, n = e.replace(r, "/").split("/");
  return (e.slice(0, 1) == "/" || e.length === 0) && n.splice(0, 1), e.slice(-1) == "/" && n.splice(n.length - 1, 1), n;
}
function hl(t, e) {
  const r = {};
  return e.replace(/(?:^|&)([^&=]*)=?([^&]*)/g, function(n, i, o) {
    i && (r[i] = o);
  }), r;
}
const qr = typeof addEventListener == "function" && typeof removeEventListener == "function", nr = [];
qr && addEventListener("offline", () => {
  nr.forEach((t) => t());
}, !1);
class Ze extends he {
  /**
   * Socket constructor.
   *
   * @param {String|Object} uri - uri or options
   * @param {Object} opts - options
   */
  constructor(e, r) {
    if (super(), this.binaryType = $s, this.writeBuffer = [], this._prevBufferLen = 0, this._pingInterval = -1, this._pingTimeout = -1, this._maxPayload = -1, this._pingTimeoutTime = 1 / 0, e && typeof e == "object" && (r = e, e = null), e) {
      const n = zr(e);
      r.hostname = n.host, r.secure = n.protocol === "https" || n.protocol === "wss", r.port = n.port, n.query && (r.query = n.query);
    } else r.host && (r.hostname = zr(r.host).host);
    gr(this, r), this.secure = r.secure != null ? r.secure : typeof location < "u" && location.protocol === "https:", r.hostname && !r.port && (r.port = this.secure ? "443" : "80"), this.hostname = r.hostname || (typeof location < "u" ? location.hostname : "localhost"), this.port = r.port || (typeof location < "u" && location.port ? location.port : this.secure ? "443" : "80"), this.transports = [], this._transportsByName = {}, r.transports.forEach((n) => {
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
    }, r), this.opts.path = this.opts.path.replace(/\/$/, "") + (this.opts.addTrailingSlash ? "/" : ""), typeof this.opts.query == "string" && (this.opts.query = Qs(this.opts.query)), qr && (this.opts.closeOnBeforeunload && (this._beforeunloadEventListener = () => {
      this.transport && (this.transport.removeAllListeners(), this.transport.close());
    }, addEventListener("beforeunload", this._beforeunloadEventListener, !1)), this.hostname !== "localhost" && (this._offlineEventListener = () => {
      this._onClose("transport close", {
        description: "network connection lost"
      });
    }, nr.push(this._offlineEventListener))), this.opts.withCredentials && (this._cookieJar = void 0), this._open();
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
    r.EIO = Fi, r.transport = e, this.id && (r.sid = this.id);
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
      if (i && (r += Gs(i)), n > 0 && r > this._maxPayload)
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
    return e && (this._pingTimeoutTime = 0, mr(() => {
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
      if (this.clearTimeoutFn(this._pingTimeoutTimer), this.transport.removeAllListeners("close"), this.transport.close(), this.transport.removeAllListeners(), qr && (this._beforeunloadEventListener && removeEventListener("beforeunload", this._beforeunloadEventListener, !1), this._offlineEventListener)) {
        const n = nr.indexOf(this._offlineEventListener);
        n !== -1 && nr.splice(n, 1);
      }
      this.readyState = "closed", this.id = null, this.emitReserved("close", e, r), this.writeBuffer = [], this._prevBufferLen = 0;
    }
  }
}
Ze.protocol = Fi;
class pl extends Ze {
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
let ml = class extends pl {
  constructor(e, r = {}) {
    const n = typeof e == "object" ? e : r;
    (!n.transports || n.transports && typeof n.transports[0] == "string") && (n.transports = (n.transports || ["polling", "websocket", "webtransport"]).map((i) => cl[i]).filter((i) => !!i)), super(e, n);
  }
};
function gl(t, e = "", r) {
  let n = t;
  r = r || typeof location < "u" && location, t == null && (t = r.protocol + "//" + r.host), typeof t == "string" && (t.charAt(0) === "/" && (t.charAt(1) === "/" ? t = r.protocol + t : t = r.host + t), /^(https?|wss?):\/\//.test(t) || (typeof r < "u" ? t = r.protocol + "//" + t : t = "https://" + t), n = zr(t)), n.port || (/^(http|ws)$/.test(n.protocol) ? n.port = "80" : /^(http|ws)s$/.test(n.protocol) && (n.port = "443")), n.path = n.path || "/";
  const o = n.host.indexOf(":") !== -1 ? "[" + n.host + "]" : n.host;
  return n.id = n.protocol + "://" + o + ":" + n.port + e, n.href = n.protocol + "://" + o + (r && r.port === n.port ? "" : ":" + n.port), n;
}
const yl = typeof ArrayBuffer == "function", vl = (t) => typeof ArrayBuffer.isView == "function" ? ArrayBuffer.isView(t) : t.buffer instanceof ArrayBuffer, Wi = Object.prototype.toString, _l = typeof Blob == "function" || typeof Blob < "u" && Wi.call(Blob) === "[object BlobConstructor]", bl = typeof File == "function" || typeof File < "u" && Wi.call(File) === "[object FileConstructor]";
function dn(t) {
  return yl && (t instanceof ArrayBuffer || vl(t)) || _l && t instanceof Blob || bl && t instanceof File;
}
function ir(t, e) {
  if (!t || typeof t != "object")
    return !1;
  if (Array.isArray(t)) {
    for (let r = 0, n = t.length; r < n; r++)
      if (ir(t[r]))
        return !0;
    return !1;
  }
  if (dn(t))
    return !0;
  if (t.toJSON && typeof t.toJSON == "function" && arguments.length === 1)
    return ir(t.toJSON(), !0);
  for (const r in t)
    if (Object.prototype.hasOwnProperty.call(t, r) && ir(t[r]))
      return !0;
  return !1;
}
function El(t) {
  const e = [], r = t.data, n = t;
  return n.data = Hr(r, e), n.attachments = e.length, { packet: n, buffers: e };
}
function Hr(t, e) {
  if (!t)
    return t;
  if (dn(t)) {
    const r = { _placeholder: !0, num: e.length };
    return e.push(t), r;
  } else if (Array.isArray(t)) {
    const r = new Array(t.length);
    for (let n = 0; n < t.length; n++)
      r[n] = Hr(t[n], e);
    return r;
  } else if (typeof t == "object" && !(t instanceof Date)) {
    const r = {};
    for (const n in t)
      Object.prototype.hasOwnProperty.call(t, n) && (r[n] = Hr(t[n], e));
    return r;
  }
  return t;
}
function wl(t, e) {
  return t.data = $r(t.data, e), delete t.attachments, t;
}
function $r(t, e) {
  if (!t)
    return t;
  if (t && t._placeholder === !0) {
    if (typeof t.num == "number" && t.num >= 0 && t.num < e.length)
      return e[t.num];
    throw new Error("illegal attachments");
  } else if (Array.isArray(t))
    for (let r = 0; r < t.length; r++)
      t[r] = $r(t[r], e);
  else if (typeof t == "object")
    for (const r in t)
      Object.prototype.hasOwnProperty.call(t, r) && (t[r] = $r(t[r], e));
  return t;
}
const xl = [
  "connect",
  "connect_error",
  "disconnect",
  "disconnecting",
  "newListener",
  "removeListener"
  // used by the Node.js EventEmitter
], Sl = 5;
var K;
(function(t) {
  t[t.CONNECT = 0] = "CONNECT", t[t.DISCONNECT = 1] = "DISCONNECT", t[t.EVENT = 2] = "EVENT", t[t.ACK = 3] = "ACK", t[t.CONNECT_ERROR = 4] = "CONNECT_ERROR", t[t.BINARY_EVENT = 5] = "BINARY_EVENT", t[t.BINARY_ACK = 6] = "BINARY_ACK";
})(K || (K = {}));
class Rl {
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
    return (e.type === K.EVENT || e.type === K.ACK) && ir(e) ? this.encodeAsBinary({
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
    const r = El(e), n = this.encodeAsString(r.packet), i = r.buffers;
    return i.unshift(n), i;
  }
}
function li(t) {
  return Object.prototype.toString.call(t) === "[object Object]";
}
class fn extends he {
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
      n || r.type === K.BINARY_ACK ? (r.type = n ? K.EVENT : K.ACK, this.reconstructor = new Ol(r), r.attachments === 0 && super.emitReserved("decoded", r)) : super.emitReserved("decoded", r);
    } else if (dn(e) || e.base64)
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
      if (fn.isPayloadValid(n.type, o))
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
        return li(r);
      case K.DISCONNECT:
        return r === void 0;
      case K.CONNECT_ERROR:
        return typeof r == "string" || li(r);
      case K.EVENT:
      case K.BINARY_EVENT:
        return Array.isArray(r) && (typeof r[0] == "number" || typeof r[0] == "string" && xl.indexOf(r[0]) === -1);
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
class Ol {
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
      const r = wl(this.reconPack, this.buffers);
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
const Tl = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Decoder: fn,
  Encoder: Rl,
  get PacketType() {
    return K;
  },
  protocol: Sl
}, Symbol.toStringTag, { value: "Module" }));
function ke(t, e, r) {
  return t.on(e, r), function() {
    t.off(e, r);
  };
}
const Cl = Object.freeze({
  connect: 1,
  connect_error: 1,
  disconnect: 1,
  disconnecting: 1,
  // EventEmitter reserved events: https://nodejs.org/api/events.html#events_event_newlistener
  newListener: 1,
  removeListener: 1
});
class Ki extends he {
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
    if (Cl.hasOwnProperty(e))
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
class Wr extends he {
  constructor(e, r) {
    var n;
    super(), this.nsps = {}, this.subs = [], e && typeof e == "object" && (r = e, e = void 0), r = r || {}, r.path = r.path || "/socket.io", this.opts = r, gr(this, r), this.reconnection(r.reconnection !== !1), this.reconnectionAttempts(r.reconnectionAttempts || 1 / 0), this.reconnectionDelay(r.reconnectionDelay || 1e3), this.reconnectionDelayMax(r.reconnectionDelayMax || 5e3), this.randomizationFactor((n = r.randomizationFactor) !== null && n !== void 0 ? n : 0.5), this.backoff = new _t({
      min: this.reconnectionDelay(),
      max: this.reconnectionDelayMax(),
      jitter: this.randomizationFactor()
    }), this.timeout(r.timeout == null ? 2e4 : r.timeout), this._readyState = "closed", this.uri = e;
    const i = r.parser || Tl;
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
    this.engine = new ml(this.uri, this.opts);
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
    mr(() => {
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
    return n ? this._autoConnect && !n.active && n.connect() : (n = new Ki(this, e, r), this.nsps[e] = n), n;
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
function or(t, e) {
  typeof t == "object" && (e = t, t = void 0), e = e || {};
  const r = gl(t, e.path || "/socket.io"), n = r.source, i = r.id, o = r.path, a = Dt[i] && o in Dt[i].nsps, d = e.forceNew || e["force new connection"] || e.multiplex === !1 || a;
  let l;
  return d ? l = new Wr(n, e) : (Dt[i] || (Dt[i] = new Wr(n, e)), l = Dt[i]), r.query && !e.query && (e.query = r.queryKey), l.socket(r.path, e);
}
Object.assign(or, {
  Manager: Wr,
  Socket: Ki,
  io: or,
  connect: or
});
const Lt = {
  serverOrigin: "http://localhost:8080",
  defaultRoomKey: "dev-room-1000",
  mediaBase: "/media"
};
let Kr = { ...Lt };
function Nl(t) {
  Kr = { ...Kr, ...t };
}
function hn() {
  return Kr;
}
const Yi = lo(Lt);
function Dl() {
  return co(Yi);
}
const Gi = (() => {
  try {
    const t = new URLSearchParams(window.location.search);
    if (t.has("verbose") || t.get("v") === "1" || localStorage.getItem("wp_verbose") === "1") return !0;
  } catch {
  }
  return !1;
})();
function ce(t, e) {
  Gi && (e !== void 0 ? console.debug("[wp]", t, e) : console.debug("[wp]", t));
}
function Se() {
  return Gi;
}
let pe = null, st = null, ci = null;
function Al(t) {
  const e = Ut(), r = G.getState();
  if (r.me.clientId && r.roster[r.me.clientId])
    return (t.name || t.sprite) && (ce("identity_update_emit", { name: t.name, sprite: t.sprite }), e.emit("identity_update", { name: t.name, sprite: t.sprite })), e;
  const n = kl(t), i = () => {
    setTimeout(() => {
      const o = G.getState();
      o.name && (ce("identity_update_emit_post_join", { name: o.name, sprite: o.sprite }), e.emit("identity_update", { name: o.name, sprite: o.sprite || void 0 }));
    }, 40);
  };
  return e.connected ? (ce("join_emit", n), e.emit("join", n), i()) : e.once("connect", () => {
    ce("join_emit", n), e.emit("join", n), i();
  }), e;
}
function kl(t) {
  return {
    room_key: t.room_key,
    leader_key: t.leader_key || void 0,
    override: t.override || void 0,
    name: t.name,
    sprite: t.sprite
  };
}
function Ut() {
  if (!pe) {
    let e = hn().serverOrigin || "/";
    if (e === "/" && typeof window < "u") {
      const r = window.location;
      (r.hostname === "localhost" || r.hostname === "127.0.0.1") && r.port === "5173" && (e = `${r.protocol}//${r.hostname}:8080`, ce("socket_origin_fallback", { origin: e }));
    }
    pe = or(e, { path: "/watchparty/ws", transports: ["websocket"] }), ce("socket_init", { origin: e }), pe.on("connect", () => {
      const r = pe == null ? void 0 : pe.id;
      if (ce("socket_connect", { id: r }), r)
        try {
          G.getState().ensureMe(r);
        } catch {
        }
    }), pe.on("disconnect", (r) => ce("socket_disconnect", { reason: r })), pe.on("connect_error", (r) => ce("socket_connect_error", { message: r == null ? void 0 : r.message })), pe.on("reconnect_attempt", (r) => ce("socket_reconnect_attempt", { attempt: r })), pe.on("reconnect_failed", () => ce("socket_reconnect_failed")), Ll(pe);
  }
  return pe;
}
function Ll(t) {
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
  }), ci || (ci = setInterval(() => {
    Ml();
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
function Ml() {
  st || (st = { ts: Date.now() }, Ut().emit("time_ping", {}));
}
function Pl(t, e) {
  const r = {};
  r.name = t, e && (r.sprite = e), !(!r.name && !r.sprite) && (ce("identity_update_emit", r), Ut().emit("identity_update", r));
}
function jl({ mediaUrl: t, indexUrl: e, mediaId: r }) {
  const n = Xe(null), [i, o] = Re(!1), [a, d] = Re([]), [l, c] = Re(null), h = G((m) => m.readiness), u = G((m) => m.snapshot), s = Xe(!1), f = Xe(null), b = Xe(null), v = Xe(null);
  Ne(() => {
    let m = !1;
    return (async () => {
      var R;
      try {
        const w = await fetch(e, { cache: "no-store" });
        if (!w.ok) return;
        const N = await w.json();
        if (m) return;
        d(N.fragments || []), c(N.duration_ms || null), Se() && console.debug("[wp] index_loaded", { count: (R = N.fragments) == null ? void 0 : R.length, duration: N.duration_ms });
      } catch (w) {
        Se() && console.debug("[wp] index_error", w == null ? void 0 : w.message);
      }
    })(), () => {
      m = !0;
    };
  }, [e]), Ne(() => {
    let m = null;
    const R = new MediaSource();
    b.current = R, n.current && (m = URL.createObjectURL(R), n.current.src = m);
    const w = () => {
      try {
        const N = R.addSourceBuffer('video/mp4; codecs="avc1.4d401e, mp4a.40.2"');
        f.current = N, N.addEventListener("error", () => {
          Se() && console.debug("[wp] sb_error");
        }), a.length && O();
      } catch (N) {
        Se() && console.debug("[wp] mse_source_error", N == null ? void 0 : N.message);
      }
    };
    return R.addEventListener("sourceopen", w), () => {
      R.removeEventListener("sourceopen", w), m && URL.revokeObjectURL(m), v.current && v.current.abort();
    };
  }, [t, r]), Ne(() => {
    var m;
    ((m = b.current) == null ? void 0 : m.readyState) === "open" && f.current && a.length && !s.current && O();
  }, [a]);
  function O() {
    if (!a.length || !f.current) return;
    const m = a[0], R = `bytes=${m.start_byte}-${m.end_byte}`, w = new AbortController();
    v.current = w, fetch(t, { headers: { Range: R }, signal: w.signal }).then((N) => N.arrayBuffer()).then((N) => {
      f.current && (f.current.addEventListener("updateend", E, { once: !0 }), f.current.appendBuffer(N));
    }).catch((N) => {
      Se() && console.debug("[wp] init_fetch_error", N == null ? void 0 : N.message);
    });
  }
  function E() {
    s.current || (s.current = !0, Ut().emit("client_ready", { media_id: r, first_appended: !0 }), Se() && console.debug("[wp] client_ready emitted", { mediaId: r })), o(!0);
  }
  return Ne(() => {
    const m = n.current;
    if (!m) return;
    u.playing ? m.paused && m.play().catch(() => {
    }) : m.paused || m.pause();
    const R = u.playheadMs;
    if (typeof R == "number" && i) {
      const w = m.currentTime * 1e3, N = R - w, M = Math.abs(N);
      M > 500 ? (m.currentTime = R / 1e3, Se() && console.debug("[wp] drift_snap", { drift: N })) : M > 80 && (m.currentTime = R / 1e3, Se() && console.debug("[wp] drift_nudge", { drift: N }));
    }
  }, [u.playing, u.playheadMs, i]), /* @__PURE__ */ x.jsxs("div", { className: "relative w-full h-full bg-black", children: [
    /* @__PURE__ */ x.jsx("video", { ref: n, className: "w-full h-full", playsInline: !0, muted: !0 }),
    !h.ready && /* @__PURE__ */ x.jsx("div", { className: "absolute inset-0 flex items-center justify-center pointer-events-none", children: /* @__PURE__ */ x.jsxs("div", { className: "px-4 py-2 rounded bg-slate-900/80 text-xs font-medium", children: [
      "Syncing… (",
      h.readyCount,
      "/",
      h.total,
      ")"
    ] }) }),
    l && /* @__PURE__ */ x.jsxs("div", { className: "absolute bottom-2 right-2 text-[10px] opacity-60 bg-black/40 px-2 py-1 rounded", children: [
      (l / 1e3).toFixed(0),
      "s"
    ] })
  ] });
}
let lt = null;
const Il = 6e4;
async function Yr(t = "") {
  var d, l;
  const e = Date.now();
  if (lt && lt.prefix === t && e - lt.ts < Il)
    return lt.data;
  const i = `${hn().serverOrigin.replace(/\/$/, "")}/api/catalog${t ? `?prefix=${encodeURIComponent(t)}` : ""}`, o = await fetch(i, { cache: "no-store" });
  if (!o.ok) throw new Error(`catalog_http_${o.status}`);
  const a = await o.json();
  return Se() && console.debug("[wp] catalog_fetch", { prefix: t, dirs: (d = a.dirs) == null ? void 0 : d.length, files: (l = a.files) == null ? void 0 : l.length }), lt = { ts: e, prefix: t, data: a }, a;
}
function Bl(t) {
  lt && (lt = null);
}
function Ji(t, e) {
  const n = G.getState().allocateClientSeq(), i = { kind: t, client_seq: n, ...e || {} };
  return Ut().emit("control", i), n;
}
function Ul(t) {
  return Ji("load", { media_id: t });
}
function Fl() {
  return Ji("home");
}
async function Vl() {
  if (Se())
    try {
      const t = ["output/fmp4/anime", "output/fmp4/movie", "output/fmp4/tv"];
      for (const e of t) {
        const r = await Yr(e);
        console.debug("[wp][probe] catalog", e, { dirs: r.dirs.length, files: r.files.length });
        const n = r.files[0];
        if (n) {
          const i = zl(), o = `${i}/${n.id}/index.json`.replace(/\\/g, "/"), a = `${i}/${n.id}/output_frag.mp4`.replace(/\\/g, "/");
          await ui(o, "index"), await ui(a, "fragment", { headers: { Range: "bytes=0-1023" } });
        }
      }
    } catch (t) {
      console.debug("[wp][probe] error", (t == null ? void 0 : t.message) || String(t));
    }
}
function zl() {
  return hn().mediaBase;
}
async function ui(t, e, r) {
  const n = performance.now(), i = await fetch(t, r), o = Math.round(performance.now() - n);
  return console.debug("[wp][probe]", e, { url: t, status: i.status, ms: o, bytes: i.headers.get("content-length") }), i;
}
const ql = ({ open: t, onClose: e }) => {
  const [r, n] = Re(!1), [i, o] = Re(null), [a, d] = Re([]), [l, c] = Re(""), h = uo(async () => {
    n(!0), o(null);
    try {
      const E = [
        { key: "anime", label: "Anime" },
        { key: "movie", label: "Movie" },
        { key: "tv", label: "TV" }
      ], m = "output/fmp4", R = [];
      for (const w of E) {
        const N = `${m}/${w.key}`;
        let M;
        try {
          M = await Yr(N);
        } catch {
          continue;
        }
        const y = [];
        for (const D of M.dirs) {
          let q;
          try {
            q = await Yr(D.path);
          } catch {
            continue;
          }
          const j = q.files.map((F) => ({ type: "episode", name: F.title, mediaId: F.id }));
          j.length && y.push({ type: "series", name: D.name, episodes: j, expanded: !1 });
        }
        y.length && R.push({ type: "category", name: w.label, series: y, expanded: !0 });
      }
      d(R), Se() && Vl();
    } catch (E) {
      o(E.message || "catalog_error");
    } finally {
      n(!1);
    }
  }, []);
  Ne(() => {
    t && h();
  }, [t, h]);
  function u(E) {
    Ul(E), Se() && console.debug("[wp] control_load", E), e();
  }
  function s() {
    Fl(), Se() && console.debug("[wp] control_home"), e();
  }
  function f(E, m) {
    d((R) => R.map((w, N) => N !== E ? w : { ...w, series: w.series.map((M, y) => y !== m ? M : { ...M, expanded: !M.expanded }) }));
  }
  function b(E) {
    d((m) => m.map((R, w) => w !== E ? R : { ...R, expanded: !R.expanded }));
  }
  function v() {
    Bl(), h();
  }
  const O = fi(() => {
    if (!l.trim()) return a;
    const E = l.toLowerCase();
    return a.map((m) => {
      const R = m.series.map((w) => {
        const N = w.episodes.filter((M) => M.name.toLowerCase().includes(E));
        return N.length ? { ...w, episodes: N, expanded: !0 } : w.name.toLowerCase().includes(E) ? { ...w, expanded: !0 } : null;
      }).filter(Boolean);
      return R.length ? { ...m, series: R, expanded: !0 } : m.name.toLowerCase().includes(E) ? { ...m, expanded: !0 } : null;
    }).filter(Boolean);
  }, [a, l]);
  return t ? /* @__PURE__ */ x.jsx("div", { className: "fixed inset-0 bg-black/40 flex justify-end z-40", children: /* @__PURE__ */ x.jsxs("div", { className: "w-[440px] h-full bg-gray-950 border-l border-gray-800 flex flex-col", children: [
    /* @__PURE__ */ x.jsxs("div", { className: "p-3 border-b border-gray-800 flex items-center gap-2 text-sm", children: [
      /* @__PURE__ */ x.jsx("button", { onClick: e, className: "px-2 py-1 bg-gray-800 hover:bg-gray-700 rounded", children: "Close" }),
      /* @__PURE__ */ x.jsx("button", { onClick: s, className: "px-2 py-1 bg-indigo-600 hover:bg-indigo-500 rounded", children: "Home" }),
      /* @__PURE__ */ x.jsx("button", { onClick: v, className: "px-2 py-1 bg-gray-800 hover:bg-gray-700 rounded", children: "Reload" }),
      /* @__PURE__ */ x.jsx("input", { value: l, onChange: (E) => c(E.target.value), placeholder: "search", className: "ml-auto bg-gray-900 border border-gray-700 focus:border-gray-500 outline-none px-2 py-1 rounded text-xs" })
    ] }),
    r && /* @__PURE__ */ x.jsx("div", { className: "px-4 py-2 text-xs text-gray-500", children: "Loading catalog…" }),
    i && /* @__PURE__ */ x.jsx("div", { className: "px-4 py-2 text-xs text-red-400", children: i }),
    /* @__PURE__ */ x.jsxs("div", { className: "flex-1 overflow-auto text-sm py-2", children: [
      O.map((E, m) => /* @__PURE__ */ x.jsxs("div", { className: "px-3 pb-3", children: [
        /* @__PURE__ */ x.jsxs("div", { className: "flex items-center gap-2 cursor-pointer select-none group", onClick: () => b(m), children: [
          /* @__PURE__ */ x.jsx("span", { className: "text-xs uppercase tracking-wider text-gray-500 group-hover:text-gray-300", children: E.name }),
          /* @__PURE__ */ x.jsx("span", { className: "text-[10px] opacity-50", children: E.expanded ? "−" : "+" })
        ] }),
        E.expanded && /* @__PURE__ */ x.jsxs("div", { className: "mt-2 space-y-2", children: [
          E.series.map((R, w) => /* @__PURE__ */ x.jsxs("div", { children: [
            /* @__PURE__ */ x.jsxs("div", { className: "flex items-center gap-2 cursor-pointer text-gray-300 hover:text-white", onClick: () => f(m, w), children: [
              /* @__PURE__ */ x.jsx("span", { className: "text-xs font-medium", children: R.name }),
              /* @__PURE__ */ x.jsx("span", { className: "text-[10px] opacity-40", children: R.expanded ? "−" : "+" })
            ] }),
            R.expanded && /* @__PURE__ */ x.jsxs("div", { className: "mt-1 ml-3 border-l border-gray-800 pl-3 space-y-1", children: [
              R.episodes.map((N) => /* @__PURE__ */ x.jsxs("button", { onClick: () => u(N.mediaId), className: "w-full text-left px-2 py-1 rounded hover:bg-gray-900 flex items-center gap-2 group", children: [
                /* @__PURE__ */ x.jsx("span", { className: "text-[11px] text-gray-400 group-hover:text-gray-200 truncate", children: N.name }),
                /* @__PURE__ */ x.jsx("span", { className: "ml-auto text-[10px] text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity", children: "Load" })
              ] }, N.mediaId)),
              R.episodes.length === 0 && /* @__PURE__ */ x.jsx("div", { className: "text-[11px] text-gray-600 italic", children: "(no episodes)" })
            ] })
          ] }, R.name)),
          E.series.length === 0 && /* @__PURE__ */ x.jsx("div", { className: "text-[11px] text-gray-600 italic", children: "(empty)" })
        ] })
      ] }, E.name)),
      !r && !O.length && /* @__PURE__ */ x.jsx("div", { className: "px-4 py-6 text-center text-xs text-gray-600", children: "No matches" })
    ] }),
    /* @__PURE__ */ x.jsxs("div", { className: "p-2 text-[10px] text-gray-600 border-t border-gray-900 flex justify-between", children: [
      /* @__PURE__ */ x.jsx("span", { children: "Simple Catalog" }),
      Se() && /* @__PURE__ */ x.jsx("span", { className: "opacity-70", children: "verbose" })
    ] })
  ] }) }) : null;
};
function Hl({ open: t, onClose: e }) {
  const { name: r, sprite: n, setIdentity: i } = G(), [o, a] = Re(r), [d, l] = Re(n), [c, h] = Re(t);
  Ne(() => {
    if (t)
      h(!0);
    else {
      const s = setTimeout(() => h(!1), 320);
      return () => clearTimeout(s);
    }
  }, [t]);
  const u = () => {
    const s = (o || "").trim().slice(0, 32) || "Guest";
    i(s, d), Pl(s, d || void 0), e();
  };
  return c ? /* @__PURE__ */ x.jsxs("div", { "aria-hidden": !t, className: `fixed inset-y-0 right-0 w-80 bg-slate-900/95 backdrop-blur border-l border-slate-700 transition-transform duration-300 z-30 flex flex-col ${t ? "translate-x-0" : "translate-x-full"} ${t ? "" : "pointer-events-none"}`, children: [
    /* @__PURE__ */ x.jsxs("div", { className: "p-4 flex items-center justify-between border-b border-slate-700", children: [
      /* @__PURE__ */ x.jsx("h2", { className: "font-semibold text-sm", children: "Identity" }),
      /* @__PURE__ */ x.jsx("button", { type: "button", onClick: e, role: "button", className: "text-xs opacity-70 hover:opacity-100 select-none", children: "Close" })
    ] }),
    /* @__PURE__ */ x.jsxs("div", { className: "p-4 space-y-4 overflow-y-auto text-sm", children: [
      /* @__PURE__ */ x.jsxs("div", { children: [
        /* @__PURE__ */ x.jsx("label", { className: "block text-xs uppercase tracking-wide mb-1 opacity-70", children: "Display Name" }),
        /* @__PURE__ */ x.jsx("input", { value: o, onChange: (s) => a(s.target.value), className: "w-full bg-slate-800 border border-slate-600 rounded px-2 py-1 text-sm", placeholder: "Your name" })
      ] }),
      /* @__PURE__ */ x.jsxs("div", { children: [
        /* @__PURE__ */ x.jsx("label", { className: "block text-xs uppercase tracking-wide mb-1 opacity-70", children: "Character" }),
        /* @__PURE__ */ x.jsx("div", { className: "grid grid-cols-4 gap-3", children: gt.map((s) => /* @__PURE__ */ x.jsxs("button", { onClick: () => {
          l(s), (!o.trim() || gt.includes(o) || o === "Guest") && a(s);
        }, className: `relative group rounded border ${d === s ? "border-emerald-400" : "border-slate-600 hover:border-slate-400"} p-1 flex flex-col items-center gap-1`, children: [
          /* @__PURE__ */ x.jsx("img", { src: an(s), alt: s, className: "w-12 h-12 object-cover rounded" }),
          /* @__PURE__ */ x.jsx("span", { className: "text-[10px] opacity-70 group-hover:opacity-100 capitalize", children: s })
        ] }, s)) })
      ] }),
      /* @__PURE__ */ x.jsx("div", { className: "pt-2 flex gap-2 items-center", children: /* @__PURE__ */ x.jsx("button", { onClick: u, className: "bg-emerald-500 hover:bg-emerald-400 text-black font-semibold text-sm px-3 py-1 rounded", children: "Update" }) })
    ] })
  ] }) : null;
}
function $l(t, e) {
  if (!t) return null;
  const r = `${e.replace(/\/$/, "")}/${t}`.replace(/\\/g, "/");
  return { mediaUrl: `${r}/output_frag.mp4`, indexUrl: `${r}/index.json` };
}
function Wl() {
  const t = Dl(), e = G((E) => E.snapshot), { ensureAutoIdentity: r, name: n, sprite: i } = G(), o = Ci(), a = Xe(!1), d = fi(() => $l(e.mediaId, t.mediaBase), [e.mediaId, t.mediaBase]), [l, c] = Re(!1), [h, u] = Re(!1);
  Ne(() => {
    if (a.current) return;
    const E = new URLSearchParams(window.location.search), m = o.roomKey || E.get("room") || t.defaultRoomKey;
    r();
    const R = E.get("leaderKey") || E.get("leaderkey") || E.get("leader_key") || void 0;
    Al({ room_key: m, leader_key: R || null, name: n || void 0, sprite: i || void 0 }), a.current = !0;
  }, [o.roomKey, r, n, i, t.defaultRoomKey]);
  const s = G((E) => !!E.snapshot.leaderId && E.snapshot.leaderId === E.me.clientId);
  function f() {
    u(!1), c(!0);
  }
  function b() {
    c(!1), u(!0);
  }
  function v() {
    c(!1);
  }
  function O() {
    u(!1);
  }
  return /* @__PURE__ */ x.jsxs("div", { className: "relative min-h-[calc(100vh-120px)] flex", children: [
    /* @__PURE__ */ x.jsxs("div", { className: "flex-1 relative bg-black", children: [
      d ? /* @__PURE__ */ x.jsx(jl, { mediaUrl: d.mediaUrl, indexUrl: d.indexUrl, mediaId: e.mediaId }) : /* @__PURE__ */ x.jsxs(x.Fragment, { children: [
        /* @__PURE__ */ x.jsx(sn, {}),
        /* @__PURE__ */ x.jsx("div", { className: "absolute inset-0 flex flex-col items-center justify-center gap-4 p-6", children: /* @__PURE__ */ x.jsx("div", { className: "mt-6 p-3 rounded bg-slate-900/70 border border-slate-700/40 backdrop-blur-sm", children: /* @__PURE__ */ x.jsx(Ps, {}) }) })
      ] }),
      s && !l && /* @__PURE__ */ x.jsx("button", { onClick: f, className: "fixed bottom-4 left-1/2 -translate-x-1/2 z-40 bg-indigo-600 hover:bg-indigo-500 text-xs px-4 py-2 rounded shadow", children: "Media" })
    ] }),
    /* @__PURE__ */ x.jsx("aside", { className: "w-80 border-l border-slate-800 p-4 hidden md:block text-xs opacity-70", children: "Chat panel placeholder (Phase 5)" }),
    /* @__PURE__ */ x.jsx(ql, { open: l, onClose: v }),
    /* @__PURE__ */ x.jsx(Hl, { open: h, onClose: O, onJoin: () => {
    } }),
    !h && /* @__PURE__ */ x.jsx("button", { onClick: b, className: "fixed bottom-4 right-4 bg-slate-800/80 hover:bg-slate-700 border border-slate-600 text-xs px-3 py-1 rounded shadow backdrop-blur z-40", children: "Identity" })
  ] });
}
function Kl() {
  return /* @__PURE__ */ x.jsxs("div", { className: "fixed inset-0 bg-black", children: [
    /* @__PURE__ */ x.jsx(sn, {}),
    /* @__PURE__ */ x.jsx("div", { className: "absolute inset-0 flex items-center justify-center", children: /* @__PURE__ */ x.jsxs("div", { className: "text-center", children: [
      /* @__PURE__ */ x.jsx("h1", { className: "text-4xl font-bold text-white mb-4", children: "API is sleeping..." }),
      /* @__PURE__ */ x.jsx("p", { className: "text-slate-400 text-lg", children: "༼ つ ◕_◕ ༽つ HADOKU TAKE MY ENERGY ༼ つ ◕_◕ ༽つ" })
    ] }) })
  ] });
}
function Yl() {
  const t = ut(), e = Ti();
  return Ci(), Ne(() => {
    const r = new URLSearchParams(window.location.search), n = r.get("roomKey") || r.get("room");
    n && (t.pathname === "/" || t.pathname === "") && e(`/room/${encodeURIComponent(n)}`, { replace: !0 });
  }, [t.pathname, e]), t.pathname === "/" || t.pathname === "" ? /* @__PURE__ */ x.jsx(Ms, {}) : t.pathname.startsWith("/room") ? /* @__PURE__ */ x.jsx(Wl, {}) : /* @__PURE__ */ x.jsx("div", { className: "p-6", children: "Not Found" });
}
function di(t) {
  const [e, r] = Re(!1), [n, i] = Re(!0), o = {
    serverOrigin: t.serverOrigin || Lt.serverOrigin,
    defaultRoomKey: t.defaultRoomKey || Lt.defaultRoomKey,
    mediaBase: t.mediaBase || Lt.mediaBase
  };
  return Ne(() => {
    async function a() {
      const l = o.serverOrigin.replace(/\/$/, "") + "/healthz";
      try {
        (await fetch(l, {
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
    a();
  }, [o.serverOrigin]), Ne(() => {
    function a() {
      for (const l of gt) {
        const c = new Image();
        c.decoding = "async", c.loading = "eager", c.src = an(l);
      }
    }
    function d() {
      "requestIdleCallback" in window ? window.requestIdleCallback(a, { timeout: 2e3 }) : setTimeout(a, 600);
    }
    document.readyState === "complete" ? d() : window.addEventListener("load", d, { once: !0 });
  }, []), n ? /* @__PURE__ */ x.jsx("div", { className: "min-h-screen flex items-center justify-center bg-black", children: /* @__PURE__ */ x.jsx("div", { className: "text-slate-400", children: "Checking server status..." }) }) : e ? /* @__PURE__ */ x.jsx(Kl, {}) : /* @__PURE__ */ x.jsx(Yi.Provider, { value: o, children: /* @__PURE__ */ x.jsxs("div", { className: "min-h-screen flex flex-col", children: [
    /* @__PURE__ */ x.jsx("header", { className: "p-3 border-b border-slate-700 flex items-center gap-4 text-sm", children: /* @__PURE__ */ x.jsx(pr, { to: "/", className: "font-semibold", children: "Watchparty" }) }),
    /* @__PURE__ */ x.jsxs("main", { className: "flex-1", children: [
      /* @__PURE__ */ x.jsx(Yl, {}),
      /* @__PURE__ */ x.jsx(Pa, {})
    ] }),
    /* @__PURE__ */ x.jsx(ks, {})
  ] }) });
}
function Gl({ basename: t = "/watchparty", appProps: e } = {}) {
  const r = e ?? {}, n = [
    { path: "/", element: /* @__PURE__ */ x.jsx(di, { ...r }) },
    { path: "/room/:roomKey", element: /* @__PURE__ */ x.jsx(di, { ...r }) }
  ];
  return Ja(n, { basename: t });
}
function Jl(t, e, r) {
  const n = fo(t), i = r ? /* @__PURE__ */ x.jsx(We.StrictMode, { children: e }) : e;
  return n.render(i), n;
}
function ec(t, e = {}) {
  const { basename: r, strictMode: n = !0, ...i } = e;
  Nl({
    serverOrigin: i.serverOrigin,
    defaultRoomKey: i.defaultRoomKey,
    mediaBase: i.mediaBase
  });
  const o = t.__watchparty;
  o == null || o.root.unmount();
  const a = Gl({
    basename: r,
    appProps: i
  }), l = { root: Jl(t, /* @__PURE__ */ x.jsx(ns, { router: a }), n) };
  return t.__watchparty = l, a;
}
function tc(t) {
  const e = t.__watchparty;
  e == null || e.root.unmount(), e && delete t.__watchparty;
}
export {
  Gl as createWatchpartyRouter,
  ec as mount,
  tc as unmount
};
//# sourceMappingURL=index.js.map
