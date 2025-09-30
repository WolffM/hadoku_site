import He, { useState as Ze, useRef as Ir, useEffect as Cr } from "react";
import { createRoot as fr } from "react-dom/client";
var $ = { exports: {} }, K = {};
/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var Be;
function yr() {
  if (Be) return K;
  Be = 1;
  var s = He, I = Symbol.for("react.element"), p = Symbol.for("react.fragment"), v = Object.prototype.hasOwnProperty, B = s.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner, S = { key: !0, ref: !0, __self: !0, __source: !0 };
  function R(h, u, m) {
    var C, t = {}, Z = null, E = null;
    m !== void 0 && (Z = "" + m), u.key !== void 0 && (Z = "" + u.key), u.ref !== void 0 && (E = u.ref);
    for (C in u) v.call(u, C) && !S.hasOwnProperty(C) && (t[C] = u[C]);
    if (h && h.defaultProps) for (C in u = h.defaultProps, u) t[C] === void 0 && (t[C] = u[C]);
    return { $$typeof: I, type: h, key: Z, ref: E, props: t, _owner: B.current };
  }
  return K.Fragment = p, K.jsx = R, K.jsxs = R, K;
}
var N = {};
/**
 * @license React
 * react-jsx-runtime.development.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var Ye;
function br() {
  return Ye || (Ye = 1, process.env.NODE_ENV !== "production" && function() {
    var s = He, I = Symbol.for("react.element"), p = Symbol.for("react.portal"), v = Symbol.for("react.fragment"), B = Symbol.for("react.strict_mode"), S = Symbol.for("react.profiler"), R = Symbol.for("react.provider"), h = Symbol.for("react.context"), u = Symbol.for("react.forward_ref"), m = Symbol.for("react.suspense"), C = Symbol.for("react.suspense_list"), t = Symbol.for("react.memo"), Z = Symbol.for("react.lazy"), E = Symbol.for("react.offscreen"), q = Symbol.iterator, Se = "@@iterator";
    function Ve(e) {
      if (e === null || typeof e != "object")
        return null;
      var r = q && e[q] || e[Se];
      return typeof r == "function" ? r : null;
    }
    var V = s.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED;
    function f(e) {
      {
        for (var r = arguments.length, n = new Array(r > 1 ? r - 1 : 0), a = 1; a < r; a++)
          n[a - 1] = arguments[a];
        We("error", e, n);
      }
    }
    function We(e, r, n) {
      {
        var a = V.ReactDebugCurrentFrame, c = a.getStackAddendum();
        c !== "" && (r += "%s", n = n.concat([c]));
        var g = n.map(function(i) {
          return String(i);
        });
        g.unshift("Warning: " + r), Function.prototype.apply.call(console[e], console, g);
      }
    }
    var ke = !1, Fe = !1, we = !1, Ke = !1, Ne = !1, ee;
    ee = Symbol.for("react.module.reference");
    function Ee(e) {
      return !!(typeof e == "string" || typeof e == "function" || e === v || e === S || Ne || e === B || e === m || e === C || Ke || e === E || ke || Fe || we || typeof e == "object" && e !== null && (e.$$typeof === Z || e.$$typeof === t || e.$$typeof === R || e.$$typeof === h || e.$$typeof === u || // This needs to include all possible module reference object
      // types supported by any Flight configuration anywhere since
      // we don't know which Flight build this will end up being used
      // with.
      e.$$typeof === ee || e.getModuleId !== void 0));
    }
    function Te(e, r, n) {
      var a = e.displayName;
      if (a)
        return a;
      var c = r.displayName || r.name || "";
      return c !== "" ? n + "(" + c + ")" : n;
    }
    function re(e) {
      return e.displayName || "Context";
    }
    function Y(e) {
      if (e == null)
        return null;
      if (typeof e.tag == "number" && f("Received an unexpected object in getComponentNameFromType(). This is likely a bug in React. Please file an issue."), typeof e == "function")
        return e.displayName || e.name || null;
      if (typeof e == "string")
        return e;
      switch (e) {
        case v:
          return "Fragment";
        case p:
          return "Portal";
        case S:
          return "Profiler";
        case B:
          return "StrictMode";
        case m:
          return "Suspense";
        case C:
          return "SuspenseList";
      }
      if (typeof e == "object")
        switch (e.$$typeof) {
          case h:
            var r = e;
            return re(r) + ".Consumer";
          case R:
            var n = e;
            return re(n._context) + ".Provider";
          case u:
            return Te(e, e.render, "ForwardRef");
          case t:
            var a = e.displayName || null;
            return a !== null ? a : Y(e.type) || "Memo";
          case Z: {
            var c = e, g = c._payload, i = c._init;
            try {
              return Y(i(g));
            } catch {
              return null;
            }
          }
        }
      return null;
    }
    var X = Object.assign, F = 0, ne, ae, te, oe, ie, ce, se;
    function ge() {
    }
    ge.__reactDisabledLog = !0;
    function Qe() {
      {
        if (F === 0) {
          ne = console.log, ae = console.info, te = console.warn, oe = console.error, ie = console.group, ce = console.groupCollapsed, se = console.groupEnd;
          var e = {
            configurable: !0,
            enumerable: !0,
            value: ge,
            writable: !0
          };
          Object.defineProperties(console, {
            info: e,
            log: e,
            warn: e,
            error: e,
            group: e,
            groupCollapsed: e,
            groupEnd: e
          });
        }
        F++;
      }
    }
    function Je() {
      {
        if (F--, F === 0) {
          var e = {
            configurable: !0,
            enumerable: !0,
            writable: !0
          };
          Object.defineProperties(console, {
            log: X({}, e, {
              value: ne
            }),
            info: X({}, e, {
              value: ae
            }),
            warn: X({}, e, {
              value: te
            }),
            error: X({}, e, {
              value: oe
            }),
            group: X({}, e, {
              value: ie
            }),
            groupCollapsed: X({}, e, {
              value: ce
            }),
            groupEnd: X({}, e, {
              value: se
            })
          });
        }
        F < 0 && f("disabledDepth fell below zero. This is a bug in React. Please file an issue.");
      }
    }
    var j = V.ReactCurrentDispatcher, P;
    function T(e, r, n) {
      {
        if (P === void 0)
          try {
            throw Error();
          } catch (c) {
            var a = c.stack.trim().match(/\n( *(at )?)/);
            P = a && a[1] || "";
          }
        return `
` + P + e;
      }
    }
    var L = !1, Q;
    {
      var ze = typeof WeakMap == "function" ? WeakMap : Map;
      Q = new ze();
    }
    function ue(e, r) {
      if (!e || L)
        return "";
      {
        var n = Q.get(e);
        if (n !== void 0)
          return n;
      }
      var a;
      L = !0;
      var c = Error.prepareStackTrace;
      Error.prepareStackTrace = void 0;
      var g;
      g = j.current, j.current = null, Qe();
      try {
        if (r) {
          var i = function() {
            throw Error();
          };
          if (Object.defineProperty(i.prototype, "props", {
            set: function() {
              throw Error();
            }
          }), typeof Reflect == "object" && Reflect.construct) {
            try {
              Reflect.construct(i, []);
            } catch (b) {
              a = b;
            }
            Reflect.construct(e, [], i);
          } else {
            try {
              i.call();
            } catch (b) {
              a = b;
            }
            e.call(i.prototype);
          }
        } else {
          try {
            throw Error();
          } catch (b) {
            a = b;
          }
          e();
        }
      } catch (b) {
        if (b && a && typeof b.stack == "string") {
          for (var o = b.stack.split(`
`), y = a.stack.split(`
`), l = o.length - 1, d = y.length - 1; l >= 1 && d >= 0 && o[l] !== y[d]; )
            d--;
          for (; l >= 1 && d >= 0; l--, d--)
            if (o[l] !== y[d]) {
              if (l !== 1 || d !== 1)
                do
                  if (l--, d--, d < 0 || o[l] !== y[d]) {
                    var A = `
` + o[l].replace(" at new ", " at ");
                    return e.displayName && A.includes("<anonymous>") && (A = A.replace("<anonymous>", e.displayName)), typeof e == "function" && Q.set(e, A), A;
                  }
                while (l >= 1 && d >= 0);
              break;
            }
        }
      } finally {
        L = !1, j.current = g, Je(), Error.prepareStackTrace = c;
      }
      var k = e ? e.displayName || e.name : "", H = k ? T(k) : "";
      return typeof e == "function" && Q.set(e, H), H;
    }
    function je(e, r, n) {
      return ue(e, !1);
    }
    function Pe(e) {
      var r = e.prototype;
      return !!(r && r.isReactComponent);
    }
    function J(e, r, n) {
      if (e == null)
        return "";
      if (typeof e == "function")
        return ue(e, Pe(e));
      if (typeof e == "string")
        return T(e);
      switch (e) {
        case m:
          return T("Suspense");
        case C:
          return T("SuspenseList");
      }
      if (typeof e == "object")
        switch (e.$$typeof) {
          case u:
            return je(e.render);
          case t:
            return J(e.type, r, n);
          case Z: {
            var a = e, c = a._payload, g = a._init;
            try {
              return J(g(c), r, n);
            } catch {
            }
          }
        }
      return "";
    }
    var w = Object.prototype.hasOwnProperty, le = {}, de = V.ReactDebugCurrentFrame;
    function z(e) {
      if (e) {
        var r = e._owner, n = J(e.type, e._source, r ? r.type : null);
        de.setExtraStackFrame(n);
      } else
        de.setExtraStackFrame(null);
    }
    function Le(e, r, n, a, c) {
      {
        var g = Function.call.bind(w);
        for (var i in e)
          if (g(e, i)) {
            var o = void 0;
            try {
              if (typeof e[i] != "function") {
                var y = Error((a || "React class") + ": " + n + " type `" + i + "` is invalid; it must be a function, usually from the `prop-types` package, but received `" + typeof e[i] + "`.This often happens because of typos such as `PropTypes.function` instead of `PropTypes.func`.");
                throw y.name = "Invariant Violation", y;
              }
              o = e[i](r, i, a, n, null, "SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED");
            } catch (l) {
              o = l;
            }
            o && !(o instanceof Error) && (z(c), f("%s: type specification of %s `%s` is invalid; the type checker function must return `null` or an `Error` but returned a %s. You may have forgotten to pass an argument to the type checker creator (arrayOf, instanceOf, objectOf, oneOf, oneOfType, and shape all require an argument).", a || "React class", n, i, typeof o), z(null)), o instanceof Error && !(o.message in le) && (le[o.message] = !0, z(c), f("Failed %s type: %s", n, o.message), z(null));
          }
      }
    }
    var xe = Array.isArray;
    function x(e) {
      return xe(e);
    }
    function Oe(e) {
      {
        var r = typeof Symbol == "function" && Symbol.toStringTag, n = r && e[Symbol.toStringTag] || e.constructor.name || "Object";
        return n;
      }
    }
    function _e(e) {
      try {
        return Ie(e), !1;
      } catch {
        return !0;
      }
    }
    function Ie(e) {
      return "" + e;
    }
    function Ce(e) {
      if (_e(e))
        return f("The provided key is an unsupported type %s. This value must be coerced to a string before before using it here.", Oe(e)), Ie(e);
    }
    var fe = V.ReactCurrentOwner, De = {
      key: !0,
      ref: !0,
      __self: !0,
      __source: !0
    }, ye, be;
    function Ue(e) {
      if (w.call(e, "ref")) {
        var r = Object.getOwnPropertyDescriptor(e, "ref").get;
        if (r && r.isReactWarning)
          return !1;
      }
      return e.ref !== void 0;
    }
    function Me(e) {
      if (w.call(e, "key")) {
        var r = Object.getOwnPropertyDescriptor(e, "key").get;
        if (r && r.isReactWarning)
          return !1;
      }
      return e.key !== void 0;
    }
    function $e(e, r) {
      typeof e.ref == "string" && fe.current;
    }
    function qe(e, r) {
      {
        var n = function() {
          ye || (ye = !0, f("%s: `key` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://reactjs.org/link/special-props)", r));
        };
        n.isReactWarning = !0, Object.defineProperty(e, "key", {
          get: n,
          configurable: !0
        });
      }
    }
    function er(e, r) {
      {
        var n = function() {
          be || (be = !0, f("%s: `ref` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://reactjs.org/link/special-props)", r));
        };
        n.isReactWarning = !0, Object.defineProperty(e, "ref", {
          get: n,
          configurable: !0
        });
      }
    }
    var rr = function(e, r, n, a, c, g, i) {
      var o = {
        // This tag allows us to uniquely identify this as a React Element
        $$typeof: I,
        // Built-in properties that belong on the element
        type: e,
        key: r,
        ref: n,
        props: i,
        // Record the component responsible for creating this element.
        _owner: g
      };
      return o._store = {}, Object.defineProperty(o._store, "validated", {
        configurable: !1,
        enumerable: !1,
        writable: !0,
        value: !1
      }), Object.defineProperty(o, "_self", {
        configurable: !1,
        enumerable: !1,
        writable: !1,
        value: a
      }), Object.defineProperty(o, "_source", {
        configurable: !1,
        enumerable: !1,
        writable: !1,
        value: c
      }), Object.freeze && (Object.freeze(o.props), Object.freeze(o)), o;
    };
    function nr(e, r, n, a, c) {
      {
        var g, i = {}, o = null, y = null;
        n !== void 0 && (Ce(n), o = "" + n), Me(r) && (Ce(r.key), o = "" + r.key), Ue(r) && (y = r.ref, $e(r, c));
        for (g in r)
          w.call(r, g) && !De.hasOwnProperty(g) && (i[g] = r[g]);
        if (e && e.defaultProps) {
          var l = e.defaultProps;
          for (g in l)
            i[g] === void 0 && (i[g] = l[g]);
        }
        if (o || y) {
          var d = typeof e == "function" ? e.displayName || e.name || "Unknown" : e;
          o && qe(i, d), y && er(i, d);
        }
        return rr(e, o, y, c, a, fe.current, i);
      }
    }
    var O = V.ReactCurrentOwner, Ge = V.ReactDebugCurrentFrame;
    function W(e) {
      if (e) {
        var r = e._owner, n = J(e.type, e._source, r ? r.type : null);
        Ge.setExtraStackFrame(n);
      } else
        Ge.setExtraStackFrame(null);
    }
    var _;
    _ = !1;
    function D(e) {
      return typeof e == "object" && e !== null && e.$$typeof === I;
    }
    function Ae() {
      {
        if (O.current) {
          var e = Y(O.current.type);
          if (e)
            return `

Check the render method of \`` + e + "`.";
        }
        return "";
      }
    }
    function ar(e) {
      return "";
    }
    var pe = {};
    function tr(e) {
      {
        var r = Ae();
        if (!r) {
          var n = typeof e == "string" ? e : e.displayName || e.name;
          n && (r = `

Check the top-level render call using <` + n + ">.");
        }
        return r;
      }
    }
    function Re(e, r) {
      {
        if (!e._store || e._store.validated || e.key != null)
          return;
        e._store.validated = !0;
        var n = tr(r);
        if (pe[n])
          return;
        pe[n] = !0;
        var a = "";
        e && e._owner && e._owner !== O.current && (a = " It was passed a child from " + Y(e._owner.type) + "."), W(e), f('Each child in a list should have a unique "key" prop.%s%s See https://reactjs.org/link/warning-keys for more information.', n, a), W(null);
      }
    }
    function he(e, r) {
      {
        if (typeof e != "object")
          return;
        if (x(e))
          for (var n = 0; n < e.length; n++) {
            var a = e[n];
            D(a) && Re(a, r);
          }
        else if (D(e))
          e._store && (e._store.validated = !0);
        else if (e) {
          var c = Ve(e);
          if (typeof c == "function" && c !== e.entries)
            for (var g = c.call(e), i; !(i = g.next()).done; )
              D(i.value) && Re(i.value, r);
        }
      }
    }
    function or(e) {
      {
        var r = e.type;
        if (r == null || typeof r == "string")
          return;
        var n;
        if (typeof r == "function")
          n = r.propTypes;
        else if (typeof r == "object" && (r.$$typeof === u || // Note: Memo only checks outer props here.
        // Inner props are checked in the reconciler.
        r.$$typeof === t))
          n = r.propTypes;
        else
          return;
        if (n) {
          var a = Y(r);
          Le(n, e.props, "prop", a, e);
        } else if (r.PropTypes !== void 0 && !_) {
          _ = !0;
          var c = Y(r);
          f("Component %s declared `PropTypes` instead of `propTypes`. Did you misspell the property assignment?", c || "Unknown");
        }
        typeof r.getDefaultProps == "function" && !r.getDefaultProps.isReactClassApproved && f("getDefaultProps is only used on classic React.createClass definitions. Use a static property named `defaultProps` instead.");
      }
    }
    function ir(e) {
      {
        for (var r = Object.keys(e.props), n = 0; n < r.length; n++) {
          var a = r[n];
          if (a !== "children" && a !== "key") {
            W(e), f("Invalid prop `%s` supplied to `React.Fragment`. React.Fragment can only have `key` and `children` props.", a), W(null);
            break;
          }
        }
        e.ref !== null && (W(e), f("Invalid attribute `ref` supplied to `React.Fragment`."), W(null));
      }
    }
    var me = {};
    function ve(e, r, n, a, c, g) {
      {
        var i = Ee(e);
        if (!i) {
          var o = "";
          (e === void 0 || typeof e == "object" && e !== null && Object.keys(e).length === 0) && (o += " You likely forgot to export your component from the file it's defined in, or you might have mixed up default and named imports.");
          var y = ar();
          y ? o += y : o += Ae();
          var l;
          e === null ? l = "null" : x(e) ? l = "array" : e !== void 0 && e.$$typeof === I ? (l = "<" + (Y(e.type) || "Unknown") + " />", o = " Did you accidentally export a JSX literal instead of a component?") : l = typeof e, f("React.jsx: type is invalid -- expected a string (for built-in components) or a class/function (for composite components) but got: %s.%s", l, o);
        }
        var d = nr(e, r, n, c, g);
        if (d == null)
          return d;
        if (i) {
          var A = r.children;
          if (A !== void 0)
            if (a)
              if (x(A)) {
                for (var k = 0; k < A.length; k++)
                  he(A[k], e);
                Object.freeze && Object.freeze(A);
              } else
                f("React.jsx: Static children should always be an array. You are likely explicitly calling React.jsxs or React.jsxDEV. Use the Babel transform instead.");
            else
              he(A, e);
        }
        if (w.call(r, "key")) {
          var H = Y(e), b = Object.keys(r).filter(function(dr) {
            return dr !== "key";
          }), U = b.length > 0 ? "{key: someKey, " + b.join(": ..., ") + ": ...}" : "{key: someKey}";
          if (!me[H + U]) {
            var lr = b.length > 0 ? "{" + b.join(": ..., ") + ": ...}" : "{}";
            f(`A props object containing a "key" prop is being spread into JSX:
  let props = %s;
  <%s {...props} />
React keys must be passed directly to JSX without using spread:
  let props = %s;
  <%s key={someKey} {...props} />`, U, H, lr, H), me[H + U] = !0;
          }
        }
        return e === v ? ir(d) : or(d), d;
      }
    }
    function cr(e, r, n) {
      return ve(e, r, n, !0);
    }
    function sr(e, r, n) {
      return ve(e, r, n, !1);
    }
    var gr = sr, ur = cr;
    N.Fragment = v, N.jsx = gr, N.jsxs = ur;
  }()), N;
}
process.env.NODE_ENV === "production" ? $.exports = yr() : $.exports = br();
var G = $.exports;
function M() {
  return {
    "Content-Type": "application/json",
    "X-Admin-Key": localStorage.getItem("TASK_ADMIN_KEY") || ""
  };
}
const Xe = {
  async getTasks() {
    return (await fetch("/api/task")).json();
  },
  async getStats() {
    return (await fetch("/api/stats")).json();
  },
  async createTask(s) {
    return (await fetch("/api/task", { method: "POST", headers: M(), body: JSON.stringify(s) })).json();
  },
  async patchTask(s, I) {
    return (await fetch(`/api/task/${s}`, { method: "PATCH", headers: M(), body: JSON.stringify(I) })).json();
  },
  async deleteTask(s) {
    return (await fetch(`/api/task/${s}`, { method: "DELETE", headers: M() })).json();
  },
  // Called by your Settings UI after you paste keys
  async configureSW(s) {
    const I = s.branch || "main", p = s.tasksPath || "task/data/tasks.json", v = s.statsPath || "task/data/stats.json";
    localStorage.setItem("TASK_ADMIN_KEY", s.adminKey), localStorage.setItem("TASK_GH_PAT", s.pat), (await navigator.serviceWorker.ready).active?.postMessage({
      type: "CONFIG",
      repoOwner: s.repoOwner,
      repoName: s.repoName,
      branch: I,
      dataPaths: { tasks: p, stats: v },
      adminKey: s.adminKey,
      githubPAT: s.pat
    });
  }
};
function Gr(s = {}) {
  const { basename: I = "/task", apiUrl: p, environment: v } = s, [B, S] = Ze([]), [R, h] = Ze(void 0), u = Ir(null);
  Cr(() => {
    m(), u.current?.focus();
    try {
      const t = new BroadcastChannel("tasks");
      return t.onmessage = (Z) => {
        Z.data?.type === "tasks-updated" && m();
      }, () => t.close();
    } catch {
    }
  }, []);
  async function m() {
    const t = await Xe.getTasks();
    S(t.tasks || []);
  }
  async function C(t) {
    t = t.trim(), t && (await Xe.createTask({ title: t }), await m(), u.current && (u.current.value = "", u.current.focus()));
  }
  return /* @__PURE__ */ G.jsxs("div", { className: "wrap", style: { maxWidth: 720, margin: "40px auto", padding: "0 16px", fontFamily: "system-ui, Segoe UI, Arial" }, children: [
    /* @__PURE__ */ G.jsx("h1", { style: { fontSize: 24, marginBottom: 12 }, children: "Tasks" }),
    /* @__PURE__ */ G.jsxs("div", { className: "bar", style: { display: "flex", gap: 8, marginBottom: 12 }, children: [
      /* @__PURE__ */ G.jsx(
        "input",
        {
          ref: u,
          style: { flex: 1, padding: "10px 12px", borderRadius: 8, border: "1px solid #ddd", fontSize: 16 },
          placeholder: "Type a task and press Enter…",
          onKeyDown: (t) => {
            t.key === "Enter" && !t.shiftKey && (t.preventDefault(), C(t.target.value)), t.key === "k" && (t.ctrlKey || t.metaKey) && (t.preventDefault(), u.current?.focus());
          }
        }
      ),
      /* @__PURE__ */ G.jsx("button", { onClick: () => u.current?.focus(), style: { padding: "10px 12px" }, children: "Focus" })
    ] }),
    /* @__PURE__ */ G.jsxs("div", { className: "filters", style: { display: "flex", gap: 8, marginBottom: 12 }, children: [
      /* @__PURE__ */ G.jsx("button", { onClick: () => h(void 0), className: R ? "" : "on", children: "All" }),
      Array.from(new Set(B.map((t) => t.tag).filter(Boolean))).map(
        (t) => /* @__PURE__ */ G.jsxs("button", { onClick: () => h(t), className: R === t ? "on" : "", children: [
          "#",
          t
        ] }, t)
      )
    ] }),
    /* @__PURE__ */ G.jsx("ul", { className: "list", style: { listStyle: "none", padding: 0, margin: 0, display: "grid", gap: 8 }, children: B.filter((t) => !R || !t.tag || R === t.tag).map((t) => /* @__PURE__ */ G.jsxs("li", { style: { padding: "12px", border: "1px solid #eee", borderRadius: 8 }, children: [
      /* @__PURE__ */ G.jsx("div", { style: { fontWeight: 500 }, children: t.title }),
      t.tag && /* @__PURE__ */ G.jsxs("div", { style: { fontSize: 12, color: "#666", marginTop: 4 }, children: [
        "#",
        t.tag
      ] })
    ] }, t.id)) })
  ] });
}
"serviceWorker" in navigator && navigator.serviceWorker.register(new URL("data:video/mp2t;base64,Ly8vIDxyZWZlcmVuY2UgbGliPSJXZWJXb3JrZXIiIC8+CmV4cG9ydCB7fQoKdHlwZSBDZmcgPSB7CiAgcmVwb093bmVyOiBzdHJpbmc7IHJlcG9OYW1lOiBzdHJpbmc7IGJyYW5jaDogc3RyaW5nOwogIGRhdGFQYXRoczogeyB0YXNrczogc3RyaW5nOyBzdGF0czogc3RyaW5nIH07CiAgYWRtaW5LZXk6IHN0cmluZzsgZ2l0aHViUEFUOiBzdHJpbmc7Cn0KbGV0IGNmZzogQ2ZnIHwgbnVsbCA9IG51bGwKCnNlbGYuYWRkRXZlbnRMaXN0ZW5lcignbWVzc2FnZScsIChlOiBNZXNzYWdlRXZlbnQpID0+IHsKICBpZiAoZS5kYXRhPy50eXBlID09PSAnQ09ORklHJykgY2ZnID0gZS5kYXRhIGFzIENmZwp9KQoKY29uc3QgR0hQID0gJ2h0dHBzOi8vYXBpLmdpdGh1Yi5jb20nCmFzeW5jIGZ1bmN0aW9uIGdoR2V0RmlsZShwYXRoOiBzdHJpbmcpIHsKICBjb25zdCB1cmwgPSBgJHtHSFB9L3JlcG9zLyR7Y2ZnIS5yZXBvT3duZXJ9LyR7Y2ZnIS5yZXBvTmFtZX0vY29udGVudHMvJHtwYXRofT9yZWY9JHtjZmchLmJyYW5jaH1gCiAgY29uc3QgciA9IGF3YWl0IGZldGNoKHVybCwgeyBoZWFkZXJzOiB7IEFjY2VwdDogJ2FwcGxpY2F0aW9uL3ZuZC5naXRodWIranNvbicsIEF1dGhvcml6YXRpb246IGBCZWFyZXIgJHtjZmchLmdpdGh1YlBBVH1gIH19KQogIGlmICghci5vaykgdGhyb3cgbmV3IEVycm9yKGBHRVQgJHtwYXRofSAke3Iuc3RhdHVzfWApCiAgY29uc3QgaiA9IGF3YWl0IHIuanNvbigpCiAgY29uc3QgY29udGVudCA9IGF0b2Ioai5jb250ZW50LnJlcGxhY2UoL1xuL2csICcnKSkKICByZXR1cm4geyB0ZXh0OiBjb250ZW50LCBzaGE6IGouc2hhIH0KfQphc3luYyBmdW5jdGlvbiBnaFB1dEZpbGUocGF0aDogc3RyaW5nLCB0ZXh0OiBzdHJpbmcsIHNoYT86IHN0cmluZywgbXNnPSd1cGRhdGUgZGF0YScpIHsKICBjb25zdCB1cmwgPSBgJHtHSFB9L3JlcG9zLyR7Y2ZnIS5yZXBvT3duZXJ9LyR7Y2ZnIS5yZXBvTmFtZX0vY29udGVudHMvJHtwYXRofWAKICBjb25zdCBib2R5ID0gewogICAgbWVzc2FnZTogbXNnLAogICAgY29udGVudDogYnRvYSh1bmVzY2FwZShlbmNvZGVVUklDb21wb25lbnQodGV4dCkpKSwKICAgIGJyYW5jaDogY2ZnIS5icmFuY2gsCiAgICAuLi4oc2hhID8geyBzaGEgfSA6IHt9KQogIH0KICBjb25zdCByID0gYXdhaXQgZmV0Y2godXJsLCB7CiAgICBtZXRob2Q6ICdQVVQnLAogICAgaGVhZGVyczogewogICAgICBBY2NlcHQ6ICdhcHBsaWNhdGlvbi92bmQuZ2l0aHViK2pzb24nLAogICAgICBBdXRob3JpemF0aW9uOiBgQmVhcmVyICR7Y2ZnIS5naXRodWJQQVR9YCwKICAgICAgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJwogICAgfSwKICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KGJvZHkpCiAgfSkKICBpZiAoIXIub2spIHRocm93IG5ldyBFcnJvcihgUFVUICR7cGF0aH0gJHtyLnN0YXR1c31gKQogIHJldHVybiByLmpzb24oKQp9CgpzZWxmLmFkZEV2ZW50TGlzdGVuZXIoJ2ZldGNoJywgKGV2ZW50OiBGZXRjaEV2ZW50KSA9PiB7CiAgY29uc3QgdXJsID0gbmV3IFVSTChldmVudC5yZXF1ZXN0LnVybCkKICBpZiAoIXVybC5wYXRobmFtZS5zdGFydHNXaXRoKCcvYXBpLycpKSByZXR1cm4KICBldmVudC5yZXNwb25kV2l0aChoYW5kbGVBcGkoZXZlbnQucmVxdWVzdCkpCn0pCgpmdW5jdGlvbiBqc29uKGJvZHk6IGFueSwgc3RhdHVzPTIwMCkgewogIHJldHVybiBuZXcgUmVzcG9uc2UodHlwZW9mIGJvZHkgPT09ICdzdHJpbmcnID8gYm9keSA6IEpTT04uc3RyaW5naWZ5KGJvZHkpLCB7CiAgICBzdGF0dXMsCiAgICBoZWFkZXJzOiB7ICdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24vanNvbicgfQogIH0pCn0KCmZ1bmN0aW9uIGJjUG9zdChtc2c6IGFueSkgewogIHRyeSB7CiAgICBjb25zdCBiYyA9IChzZWxmIGFzIGFueSkuQnJvYWRjYXN0Q2hhbm5lbCA/IG5ldyAoc2VsZiBhcyBhbnkpLkJyb2FkY2FzdENoYW5uZWwoJ3Rhc2tzJykgOiBudWxsCiAgICBiYz8ucG9zdE1lc3NhZ2UobXNnKQogIH0gY2F0Y2gge30KfQoKZnVuY3Rpb24gdWxpZCgpIHsKICBjb25zdCB0ID0gRGF0ZS5ub3coKS50b1N0cmluZygzNikudG9VcHBlckNhc2UoKS5wYWRTdGFydCg4LCcwJykKICBjb25zdCByID0gQXJyYXkuZnJvbShjcnlwdG8uZ2V0UmFuZG9tVmFsdWVzKG5ldyBVaW50OEFycmF5KDE2KSkpCiAgICAubWFwKGIgPT4gKGIgJSAzNikudG9TdHJpbmcoMzYpLnRvVXBwZXJDYXNlKCkpLmpvaW4oJycpCiAgcmV0dXJuIHQgKyByLnNsaWNlKDAsIDE4KQp9Cgphc3luYyBmdW5jdGlvbiBoYW5kbGVBcGkocmVxOiBSZXF1ZXN0KTogUHJvbWlzZTxSZXNwb25zZT4gewogIGlmICghY2ZnKSByZXR1cm4ganNvbih7IGVycm9yOiAnTm90IGNvbmZpZ3VyZWQnIH0sIDUwMCkKCiAgY29uc3QgeyBwYXRobmFtZSB9ID0gbmV3IFVSTChyZXEudXJsKQogIGNvbnN0IGlzV3JpdGUgPSByZXEubWV0aG9kICE9PSAnR0VUJwogIGNvbnN0IGF1dGggPSByZXEuaGVhZGVycy5nZXQoJ1gtQWRtaW4tS2V5JykgfHwgJycKICBpZiAoaXNXcml0ZSAmJiBhdXRoICE9PSBjZmcuYWRtaW5LZXkpIHJldHVybiBqc29uKHsgZXJyb3I6ICdGb3JiaWRkZW4nIH0sIDQwMykKCiAgdHJ5IHsKICAgIGlmIChyZXEubWV0aG9kID09PSAnR0VUJyAmJiBwYXRobmFtZSA9PT0gJy9hcGkvdGFzaycpIHsKICAgICAgY29uc3QgeyB0ZXh0IH0gPSBhd2FpdCBnaEdldEZpbGUoY2ZnLmRhdGFQYXRocy50YXNrcykKICAgICAgcmV0dXJuIGpzb24oSlNPTi5wYXJzZSh0ZXh0KSkKICAgIH0KICAgIGlmIChyZXEubWV0aG9kID09PSAnR0VUJyAmJiBwYXRobmFtZSA9PT0gJy9hcGkvc3RhdHMnKSB7CiAgICAgIGNvbnN0IHsgdGV4dCB9ID0gYXdhaXQgZ2hHZXRGaWxlKGNmZy5kYXRhUGF0aHMuc3RhdHMpCiAgICAgIHJldHVybiBqc29uKEpTT04ucGFyc2UodGV4dCkpCiAgICB9CgogICAgLy8gTXV0YXRpb25zIHVwZGF0ZSB0YXNrcy5qc29uIGFuZCBzdGF0cy5qc29uICh2MikgaW5jbHVkaW5nIHRhc2sgcmVjb3JkcwogICAgaWYgKHJlcS5tZXRob2QgPT09ICdQT1NUJyAmJiBwYXRobmFtZSA9PT0gJy9hcGkvdGFzaycpIHsKICAgICAgY29uc3QgcGF5bG9hZCA9IGF3YWl0IHJlcS5qc29uKCkgLy8geyB0aXRsZSwgdGFnPywgcHJvamVjdD8gfQogICAgICBjb25zdCBub3cgPSBuZXcgRGF0ZSgpLnRvSVNPU3RyaW5nKCkKCiAgICAgIGNvbnN0IHsgdGV4dDogdFRleHQsIHNoYTogdFNoYSB9ID0gYXdhaXQgZ2hHZXRGaWxlKGNmZy5kYXRhUGF0aHMudGFza3MpCiAgICAgIGNvbnN0IHRhc2tzID0gSlNPTi5wYXJzZSh0VGV4dCkKICAgICAgY29uc3QgaWQgPSB1bGlkKCkKICAgICAgY29uc3QgdGFzayA9IHsgaWQsIHRpdGxlOiBwYXlsb2FkLnRpdGxlLCB0YWc6IHBheWxvYWQudGFnID8/IG51bGwsIHByb2plY3Q6IHBheWxvYWQucHJvamVjdCA/PyBudWxsLCBjcmVhdGVkQXQ6IG5vdyB9CiAgICAgIHRhc2tzLnRhc2tzID0gW3Rhc2ssIC4uLih0YXNrcy50YXNrcyB8fCBbXSldCiAgICAgIHRhc2tzLnVwZGF0ZWRBdCA9IG5vdwoKICAgICAgY29uc3QgeyB0ZXh0OiBzVGV4dCwgc2hhOiBzU2hhIH0gPSBhd2FpdCBnaEdldEZpbGUoY2ZnLmRhdGFQYXRocy5zdGF0cykKICAgICAgY29uc3Qgc3RhdHMgPSBKU09OLnBhcnNlKHNUZXh0KQogICAgICBzdGF0cy5jb3VudGVycy5jcmVhdGVkKysKICAgICAgc3RhdHMudGltZWxpbmUucHVzaCh7IHQ6IG5vdywgZXZlbnQ6ICdjcmVhdGUnLCBpZCB9KQogICAgICBzdGF0cy50YXNrc1tpZF0gPSB7IGlkLCB0aXRsZTogdGFzay50aXRsZSwgdGFnOiB0YXNrLnRhZywgcHJvamVjdDogdGFzay5wcm9qZWN0LCBjcmVhdGVkQXQ6IG5vdywgdXBkYXRlZEF0OiBudWxsLCBjb21wbGV0ZWRBdDogbnVsbCwgZGVsZXRlZEF0OiBudWxsLCBzdGF0ZTogJ2FjdGl2ZScgfQogICAgICBzdGF0cy51cGRhdGVkQXQgPSBub3cKCiAgICAgIGF3YWl0IGdoUHV0RmlsZShjZmcuZGF0YVBhdGhzLnRhc2tzLCBKU09OLnN0cmluZ2lmeSh0YXNrcywgbnVsbCwgMiksIHRTaGEsICd0YXNrOiBjcmVhdGUnKQogICAgICBhd2FpdCBnaFB1dEZpbGUoY2ZnLmRhdGFQYXRocy5zdGF0cywgIEpTT04uc3RyaW5naWZ5KHN0YXRzLCAgbnVsbCwgMiksIHNTaGEsICdzdGF0czogY3JlYXRlJykKICAgICAgYmNQb3N0KHsgdHlwZTogJ3Rhc2tzLXVwZGF0ZWQnIH0pCiAgICAgIHJldHVybiBqc29uKHsgb2s6IFRydWUsIGlkIH0pCiAgICB9CgogICAgaWYgKHJlcS5tZXRob2QgPT09ICdQQVRDSCcgJiYgcGF0aG5hbWUuc3RhcnRzV2l0aCgnL2FwaS90YXNrLycpKSB7CiAgICAgIGNvbnN0IGlkID0gcGF0aG5hbWUuc3BsaXQoJy8nKS5wb3AoKSEKICAgICAgY29uc3QgcGF0Y2ggPSBhd2FpdCByZXEuanNvbigpCiAgICAgIGNvbnN0IG5vdyA9IG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKQoKICAgICAgY29uc3QgeyB0ZXh0OiB0VGV4dCwgc2hhOiB0U2hhIH0gPSBhd2FpdCBnaEdldEZpbGUoY2ZnLmRhdGFQYXRocy50YXNrcykKICAgICAgY29uc3QgdGFza3MgPSBKU09OLnBhcnNlKHRUZXh0KQogICAgICBjb25zdCBpZHggPSAodGFza3MudGFza3MgfHwgW10pLmZpbmRJbmRleCgoeDogYW55KSA9PiB4LmlkID09PSBpZCkKICAgICAgaWYgKGlkeCA8IDApIHJldHVybiBqc29uKHsgZXJyb3I6ICdOb3QgZm91bmQnIH0sIDQwNCkKICAgICAgY29uc3QgdCA9IHRhc2tzLnRhc2tzW2lkeF0KICAgICAgT2JqZWN0LmFzc2lnbih0LCBwYXRjaCkKICAgICAgaWYgKHBhdGNoLmNvbXBsZXRlZCA9PT0gdHJ1ZSkgdC5jb21wbGV0ZWRBdCA9IG5vdwogICAgICB0LnVwZGF0ZWRBdCA9IG5vdwogICAgICB0YXNrcy51cGRhdGVkQXQgPSBub3cKCiAgICAgIGNvbnN0IHsgdGV4dDogc1RleHQsIHNoYTogc1NoYSB9ID0gYXdhaXQgZ2hHZXRGaWxlKGNmZy5kYXRhUGF0aHMuc3RhdHMpCiAgICAgIGNvbnN0IHN0YXRzID0gSlNPTi5wYXJzZShzVGV4dCkKICAgICAgY29uc3QgcmVjID0gc3RhdHMudGFza3NbaWRdIHx8IHsgaWQsIHRpdGxlOiB0LnRpdGxlLCB0YWc6IHQudGFnID8/IG51bGwsIHByb2plY3Q6IHQucHJvamVjdCA/PyBudWxsLCBjcmVhdGVkQXQ6IHQuY3JlYXRlZEF0LCB1cGRhdGVkQXQ6IG51bGwsIGNvbXBsZXRlZEF0OiBudWxsLCBkZWxldGVkQXQ6IG51bGwsIHN0YXRlOiAnYWN0aXZlJyB9CiAgICAgIC8vIFVwZGF0ZSByZWNvcmQKICAgICAgcmVjLnRpdGxlID0gdC50aXRsZQogICAgICByZWMudGFnID0gdC50YWcgPz8gbnVsbAogICAgICByZWMucHJvamVjdCA9IHQucHJvamVjdCA/PyBudWxsCiAgICAgIHJlYy51cGRhdGVkQXQgPSBub3cKICAgICAgaWYgKHBhdGNoLmNvbXBsZXRlZCA9PT0gdHJ1ZSkgewogICAgICAgIHJlYy5jb21wbGV0ZWRBdCA9IG5vdwogICAgICAgIHJlYy5zdGF0ZSA9ICdjb21wbGV0ZWQnCiAgICAgIH0gZWxzZSBpZiAocGF0Y2guY29tcGxldGVkID09PSBmYWxzZSkgewogICAgICAgIHJlYy5jb21wbGV0ZWRBdCA9IG51bGwKICAgICAgICByZWMuc3RhdGUgPSAnYWN0aXZlJwogICAgICB9CiAgICAgIHN0YXRzLnRhc2tzW2lkXSA9IHJlYwogICAgICBzdGF0cy5jb3VudGVyc1twYXRjaC5jb21wbGV0ZWQgPyAnY29tcGxldGVkJyA6ICdlZGl0ZWQnXSsrCiAgICAgIHN0YXRzLnRpbWVsaW5lLnB1c2goeyB0OiBub3csIGV2ZW50OiBwYXRjaC5jb21wbGV0ZWQgPyAnY29tcGxldGUnIDogJ2VkaXQnLCBpZCB9KQogICAgICBzdGF0cy51cGRhdGVkQXQgPSBub3cKCiAgICAgIGF3YWl0IGdoUHV0RmlsZShjZmcuZGF0YVBhdGhzLnRhc2tzLCBKU09OLnN0cmluZ2lmeSh0YXNrcywgbnVsbCwgMiksIHRTaGEsICd0YXNrOiB1cGRhdGUnKQogICAgICBhd2FpdCBnaFB1dEZpbGUoY2ZnLmRhdGFQYXRocy5zdGF0cywgIEpTT04uc3RyaW5naWZ5KHN0YXRzLCAgbnVsbCwgMiksIHNTaGEsICdzdGF0czogdXBkYXRlJykKICAgICAgYmNQb3N0KHsgdHlwZTogJ3Rhc2tzLXVwZGF0ZWQnIH0pCiAgICAgIHJldHVybiBqc29uKHsgb2s6IFRydWUgfSkKICAgIH0KCiAgICBpZiAocmVxLm1ldGhvZCA9PT0gJ0RFTEVURScgJiYgcGF0aG5hbWUuc3RhcnRzV2l0aCgnL2FwaS90YXNrLycpKSB7CiAgICAgIGNvbnN0IGlkID0gcGF0aG5hbWUuc3BsaXQoJy8nKS5wb3AoKSEKICAgICAgY29uc3Qgbm93ID0gbmV3IERhdGUoKS50b0lTT1N0cmluZygpCgogICAgICBjb25zdCB7IHRleHQ6IHRUZXh0LCBzaGE6IHRTaGEgfSA9IGF3YWl0IGdoR2V0RmlsZShjZmcuZGF0YVBhdGhzLnRhc2tzKQogICAgICBjb25zdCB0YXNrcyA9IEpTT04ucGFyc2UodFRleHQpCiAgICAgIGNvbnN0IGlkeCA9ICh0YXNrcy50YXNrcyB8fCBbXSkuZmluZEluZGV4KCh4OiBhbnkpID0+IHguaWQgPT09IGlkKQogICAgICBpZiAoaWR4IDwgMCkgcmV0dXJuIGpzb24oeyBlcnJvcjogJ05vdCBmb3VuZCcgfSwgNDA0KQogICAgICB0YXNrcy50YXNrcy5zcGxpY2UoaWR4LCAxKQogICAgICB0YXNrcy51cGRhdGVkQXQgPSBub3cKCiAgICAgIGNvbnN0IHsgdGV4dDogc1RleHQsIHNoYTogc1NoYSB9ID0gYXdhaXQgZ2hHZXRGaWxlKGNmZy5kYXRhUGF0aHMuc3RhdHMpCiAgICAgIGNvbnN0IHN0YXRzID0gSlNPTi5wYXJzZShzVGV4dCkKICAgICAgY29uc3QgcmVjID0gc3RhdHMudGFza3NbaWRdIHx8IHsgaWQsIHRpdGxlOiAnKHVua25vd24pJywgY3JlYXRlZEF0OiBub3cgfQogICAgICBzdGF0cy50YXNrc1tpZF0gPSB7CiAgICAgICAgaWQsCiAgICAgICAgdGl0bGU6IHJlYy50aXRsZSwKICAgICAgICB0YWc6IHJlYy50YWcgPz8gbnVsbCwKICAgICAgICBwcm9qZWN0OiByZWMucHJvamVjdCA/PyBudWxsLAogICAgICAgIGNyZWF0ZWRBdDogcmVjLmNyZWF0ZWRBdCA/PyBub3csCiAgICAgICAgdXBkYXRlZEF0OiBub3csCiAgICAgICAgY29tcGxldGVkQXQ6IHJlYy5jb21wbGV0ZWRBdCA/PyBudWxsLAogICAgICAgIGRlbGV0ZWRBdDogbm93LAogICAgICAgIHN0YXRlOiAnZGVsZXRlZCcKICAgICAgfQogICAgICBzdGF0cy5jb3VudGVycy5kZWxldGVkKysKICAgICAgc3RhdHMudGltZWxpbmUucHVzaCh7IHQ6IG5vdywgZXZlbnQ6ICdkZWxldGUnLCBpZCB9KQogICAgICBzdGF0cy51cGRhdGVkQXQgPSBub3cKCiAgICAgIGF3YWl0IGdoUHV0RmlsZShjZmcuZGF0YVBhdGhzLnRhc2tzLCBKU09OLnN0cmluZ2lmeSh0YXNrcywgbnVsbCwgMiksIHRTaGEsICd0YXNrOiBkZWxldGUnKQogICAgICBhd2FpdCBnaFB1dEZpbGUoY2ZnLmRhdGFQYXRocy5zdGF0cywgIEpTT04uc3RyaW5naWZ5KHN0YXRzLCAgbnVsbCwgMiksIHNTaGEsICdzdGF0czogZGVsZXRlJykKICAgICAgYmNQb3N0KHsgdHlwZTogJ3Rhc2tzLXVwZGF0ZWQnIH0pCiAgICAgIHJldHVybiBqc29uKHsgb2s6IFRydWUgfSkKICAgIH0KCiAgICByZXR1cm4ganNvbih7IGVycm9yOiAnTm90IGZvdW5kJyB9LCA0MDQpCiAgfSBjYXRjaCAoZTogYW55KSB7CiAgICByZXR1cm4ganNvbih7IGVycm9yOiBTdHJpbmcoZT8ubWVzc2FnZSB8fCBlKSB9LCA1MDApCiAgfQp9Cg==", import.meta.url), { type: "module" });
function Rr(s, I = {}) {
  const p = fr(s);
  p.render(/* @__PURE__ */ G.jsx(Gr, { ...I })), s.__root = p, console.log("[task-app] Mounted successfully", I);
}
function hr(s) {
  s.__root?.unmount();
}
export {
  Rr as mount,
  hr as unmount
};
