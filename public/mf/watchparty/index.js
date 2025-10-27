import * as R from "react";
import Lt, { useEffect as ue, useRef as Ce, createContext as Vi, useContext as Hi, useState as X, useCallback as Wi, useMemo as Bn } from "react";
import { createRoot as Ki } from "react-dom/client";
function Yi(t, e) {
  for (var r = 0; r < e.length; r++) {
    const n = e[r];
    if (typeof n != "string" && !Array.isArray(n)) {
      for (const i in n)
        if (i !== "default" && !(i in t)) {
          const s = Object.getOwnPropertyDescriptor(n, i);
          s && Object.defineProperty(t, i, s.get ? s : {
            enumerable: !0,
            get: () => n[i]
          });
        }
    }
  }
  return Object.freeze(Object.defineProperty(t, Symbol.toStringTag, { value: "Module" }));
}
function Un(t) {
  return t && t.__esModule && Object.prototype.hasOwnProperty.call(t, "default") ? t.default : t;
}
var Fn = { exports: {} }, tr = {};
/**
 * @license React
 * react-jsx-runtime.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var Ji = Symbol.for("react.transitional.element"), Xi = Symbol.for("react.fragment");
function zn(t, e, r) {
  var n = null;
  if (r !== void 0 && (n = "" + r), e.key !== void 0 && (n = "" + e.key), "key" in e) {
    r = {};
    for (var i in e)
      i !== "key" && (r[i] = e[i]);
  } else r = e;
  return e = r.ref, {
    $$typeof: Ji,
    type: t,
    key: n,
    ref: e !== void 0 ? e : null,
    props: r
  };
}
tr.Fragment = Xi;
tr.jsx = zn;
tr.jsxs = zn;
Fn.exports = tr;
var g = Fn.exports, $n = { exports: {} }, me = {};
/**
 * @license React
 * react-dom.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var Gi = Lt;
function qn(t) {
  var e = "https://react.dev/errors/" + t;
  if (1 < arguments.length) {
    e += "?args[]=" + encodeURIComponent(arguments[1]);
    for (var r = 2; r < arguments.length; r++)
      e += "&args[]=" + encodeURIComponent(arguments[r]);
  }
  return "Minified React error #" + t + "; visit " + e + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings.";
}
function $e() {
}
var pe = {
  d: {
    f: $e,
    r: function() {
      throw Error(qn(522));
    },
    D: $e,
    C: $e,
    L: $e,
    m: $e,
    X: $e,
    S: $e,
    M: $e
  },
  p: 0,
  findDOMNode: null
}, Qi = Symbol.for("react.portal");
function Zi(t, e, r) {
  var n = 3 < arguments.length && arguments[3] !== void 0 ? arguments[3] : null;
  return {
    $$typeof: Qi,
    key: n == null ? null : "" + n,
    children: t,
    containerInfo: e,
    implementation: r
  };
}
var Tt = Gi.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE;
function rr(t, e) {
  if (t === "font") return "";
  if (typeof e == "string")
    return e === "use-credentials" ? e : "";
}
me.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = pe;
me.createPortal = function(t, e) {
  var r = 2 < arguments.length && arguments[2] !== void 0 ? arguments[2] : null;
  if (!e || e.nodeType !== 1 && e.nodeType !== 9 && e.nodeType !== 11)
    throw Error(qn(299));
  return Zi(t, e, null, r);
};
me.flushSync = function(t) {
  var e = Tt.T, r = pe.p;
  try {
    if (Tt.T = null, pe.p = 2, t) return t();
  } finally {
    Tt.T = e, pe.p = r, pe.d.f();
  }
};
me.preconnect = function(t, e) {
  typeof t == "string" && (e ? (e = e.crossOrigin, e = typeof e == "string" ? e === "use-credentials" ? e : "" : void 0) : e = null, pe.d.C(t, e));
};
me.prefetchDNS = function(t) {
  typeof t == "string" && pe.d.D(t);
};
me.preinit = function(t, e) {
  if (typeof t == "string" && e && typeof e.as == "string") {
    var r = e.as, n = rr(r, e.crossOrigin), i = typeof e.integrity == "string" ? e.integrity : void 0, s = typeof e.fetchPriority == "string" ? e.fetchPriority : void 0;
    r === "style" ? pe.d.S(
      t,
      typeof e.precedence == "string" ? e.precedence : void 0,
      {
        crossOrigin: n,
        integrity: i,
        fetchPriority: s
      }
    ) : r === "script" && pe.d.X(t, {
      crossOrigin: n,
      integrity: i,
      fetchPriority: s,
      nonce: typeof e.nonce == "string" ? e.nonce : void 0
    });
  }
};
me.preinitModule = function(t, e) {
  if (typeof t == "string")
    if (typeof e == "object" && e !== null) {
      if (e.as == null || e.as === "script") {
        var r = rr(
          e.as,
          e.crossOrigin
        );
        pe.d.M(t, {
          crossOrigin: r,
          integrity: typeof e.integrity == "string" ? e.integrity : void 0,
          nonce: typeof e.nonce == "string" ? e.nonce : void 0
        });
      }
    } else e == null && pe.d.M(t);
};
me.preload = function(t, e) {
  if (typeof t == "string" && typeof e == "object" && e !== null && typeof e.as == "string") {
    var r = e.as, n = rr(r, e.crossOrigin);
    pe.d.L(t, r, {
      crossOrigin: n,
      integrity: typeof e.integrity == "string" ? e.integrity : void 0,
      nonce: typeof e.nonce == "string" ? e.nonce : void 0,
      type: typeof e.type == "string" ? e.type : void 0,
      fetchPriority: typeof e.fetchPriority == "string" ? e.fetchPriority : void 0,
      referrerPolicy: typeof e.referrerPolicy == "string" ? e.referrerPolicy : void 0,
      imageSrcSet: typeof e.imageSrcSet == "string" ? e.imageSrcSet : void 0,
      imageSizes: typeof e.imageSizes == "string" ? e.imageSizes : void 0,
      media: typeof e.media == "string" ? e.media : void 0
    });
  }
};
me.preloadModule = function(t, e) {
  if (typeof t == "string")
    if (e) {
      var r = rr(e.as, e.crossOrigin);
      pe.d.m(t, {
        as: typeof e.as == "string" && e.as !== "script" ? e.as : void 0,
        crossOrigin: r,
        integrity: typeof e.integrity == "string" ? e.integrity : void 0
      });
    } else pe.d.m(t);
};
me.requestFormReset = function(t) {
  pe.d.r(t);
};
me.unstable_batchedUpdates = function(t, e) {
  return t(e);
};
me.useFormState = function(t, e, r) {
  return Tt.H.useFormState(t, e, r);
};
me.useFormStatus = function() {
  return Tt.H.useHostTransitionStatus();
};
me.version = "19.1.1";
function Vn() {
  if (!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > "u" || typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE != "function"))
    try {
      __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(Vn);
    } catch (t) {
      console.error(t);
    }
}
Vn(), $n.exports = me;
var Hn = $n.exports;
const es = /* @__PURE__ */ Un(Hn), ts = /* @__PURE__ */ Yi({
  __proto__: null,
  default: es
}, [Hn]);
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
function Q() {
  return Q = Object.assign ? Object.assign.bind() : function(t) {
    for (var e = 1; e < arguments.length; e++) {
      var r = arguments[e];
      for (var n in r)
        Object.prototype.hasOwnProperty.call(r, n) && (t[n] = r[n]);
    }
    return t;
  }, Q.apply(this, arguments);
}
var ie;
(function(t) {
  t.Pop = "POP", t.Push = "PUSH", t.Replace = "REPLACE";
})(ie || (ie = {}));
const sn = "popstate";
function rs(t) {
  t === void 0 && (t = {});
  function e(n, i) {
    let {
      pathname: s,
      search: o,
      hash: l
    } = n.location;
    return kt(
      "",
      {
        pathname: s,
        search: o,
        hash: l
      },
      // state defaults to `null` because `window.history.state` does
      i.state && i.state.usr || null,
      i.state && i.state.key || "default"
    );
  }
  function r(n, i) {
    return typeof i == "string" ? i : nt(i);
  }
  return is(e, r, null, t);
}
function V(t, e) {
  if (t === !1 || t === null || typeof t > "u")
    throw new Error(e);
}
function dt(t, e) {
  if (!t) {
    typeof console < "u" && console.warn(e);
    try {
      throw new Error(e);
    } catch {
    }
  }
}
function ns() {
  return Math.random().toString(36).substr(2, 8);
}
function on(t, e) {
  return {
    usr: t.state,
    key: t.key,
    idx: e
  };
}
function kt(t, e, r, n) {
  return r === void 0 && (r = null), Q({
    pathname: typeof t == "string" ? t : t.pathname,
    search: "",
    hash: ""
  }, typeof e == "string" ? We(e) : e, {
    state: r,
    // TODO: This could be cleaned up.  push/replace should probably just take
    // full Locations now and avoid the need to run through this flow at all
    // But that's a pretty big refactor to the current test suite so going to
    // keep as is for the time being and just let any incoming keys take precedence
    key: e && e.key || n || ns()
  });
}
function nt(t) {
  let {
    pathname: e = "/",
    search: r = "",
    hash: n = ""
  } = t;
  return r && r !== "?" && (e += r.charAt(0) === "?" ? r : "?" + r), n && n !== "#" && (e += n.charAt(0) === "#" ? n : "#" + n), e;
}
function We(t) {
  let e = {};
  if (t) {
    let r = t.indexOf("#");
    r >= 0 && (e.hash = t.substr(r), t = t.substr(0, r));
    let n = t.indexOf("?");
    n >= 0 && (e.search = t.substr(n), t = t.substr(0, n)), t && (e.pathname = t);
  }
  return e;
}
function is(t, e, r, n) {
  n === void 0 && (n = {});
  let {
    window: i = document.defaultView,
    v5Compat: s = !1
  } = n, o = i.history, l = ie.Pop, a = null, m = p();
  m == null && (m = 0, o.replaceState(Q({}, o.state, {
    idx: m
  }), ""));
  function p() {
    return (o.state || {
      idx: null
    }).idx;
  }
  function u() {
    l = ie.Pop;
    let C = p(), S = C == null ? null : C - m;
    m = C, a && a({
      action: l,
      location: x.location,
      delta: S
    });
  }
  function y(C, S) {
    l = ie.Push;
    let b = kt(x.location, C, S);
    m = p() + 1;
    let k = on(b, m), E = x.createHref(b);
    try {
      o.pushState(k, "", E);
    } catch (N) {
      if (N instanceof DOMException && N.name === "DataCloneError")
        throw N;
      i.location.assign(E);
    }
    s && a && a({
      action: l,
      location: x.location,
      delta: 1
    });
  }
  function h(C, S) {
    l = ie.Replace;
    let b = kt(x.location, C, S);
    m = p();
    let k = on(b, m), E = x.createHref(b);
    o.replaceState(k, "", E), s && a && a({
      action: l,
      location: x.location,
      delta: 0
    });
  }
  function w(C) {
    let S = i.location.origin !== "null" ? i.location.origin : i.location.href, b = typeof C == "string" ? C : nt(C);
    return b = b.replace(/ $/, "%20"), V(S, "No window.location.(origin|href) available to create URL for href: " + b), new URL(b, S);
  }
  let x = {
    get action() {
      return l;
    },
    get location() {
      return t(i, o);
    },
    listen(C) {
      if (a)
        throw new Error("A history only accepts one active listener");
      return i.addEventListener(sn, u), a = C, () => {
        i.removeEventListener(sn, u), a = null;
      };
    },
    createHref(C) {
      return e(i, C);
    },
    createURL: w,
    encodeLocation(C) {
      let S = w(C);
      return {
        pathname: S.pathname,
        search: S.search,
        hash: S.hash
      };
    },
    push: y,
    replace: h,
    go(C) {
      return o.go(C);
    }
  };
  return x;
}
var J;
(function(t) {
  t.data = "data", t.deferred = "deferred", t.redirect = "redirect", t.error = "error";
})(J || (J = {}));
const ss = /* @__PURE__ */ new Set(["lazy", "caseSensitive", "path", "id", "index", "children"]);
function os(t) {
  return t.index === !0;
}
function Gt(t, e, r, n) {
  return r === void 0 && (r = []), n === void 0 && (n = {}), t.map((i, s) => {
    let o = [...r, String(s)], l = typeof i.id == "string" ? i.id : o.join("-");
    if (V(i.index !== !0 || !i.children, "Cannot specify children on an index route"), V(!n[l], 'Found a route id collision on id "' + l + `".  Route id's must be globally unique within Data Router usages`), os(i)) {
      let a = Q({}, i, e(i), {
        id: l
      });
      return n[l] = a, a;
    } else {
      let a = Q({}, i, e(i), {
        id: l,
        children: void 0
      });
      return n[l] = a, i.children && (a.children = Gt(i.children, e, o, n)), a;
    }
  });
}
function Qe(t, e, r) {
  return r === void 0 && (r = "/"), Ht(t, e, r, !1);
}
function Ht(t, e, r, n) {
  let i = typeof e == "string" ? We(e) : e, s = ht(i.pathname || "/", r);
  if (s == null)
    return null;
  let o = Wn(t);
  ls(o);
  let l = null;
  for (let a = 0; l == null && a < o.length; ++a) {
    let m = bs(s);
    l = ys(o[a], m, n);
  }
  return l;
}
function as(t, e) {
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
function Wn(t, e, r, n) {
  e === void 0 && (e = []), r === void 0 && (r = []), n === void 0 && (n = "");
  let i = (s, o, l) => {
    let a = {
      relativePath: l === void 0 ? s.path || "" : l,
      caseSensitive: s.caseSensitive === !0,
      childrenIndex: o,
      route: s
    };
    a.relativePath.startsWith("/") && (V(a.relativePath.startsWith(n), 'Absolute route path "' + a.relativePath + '" nested under path ' + ('"' + n + '" is not valid. An absolute child route path ') + "must start with the combined path of all its parent routes."), a.relativePath = a.relativePath.slice(n.length));
    let m = Ae([n, a.relativePath]), p = r.concat(a);
    s.children && s.children.length > 0 && (V(
      // Our types know better, but runtime JS may not!
      // @ts-expect-error
      s.index !== !0,
      "Index routes must not have child routes. Please remove " + ('all child routes from route path "' + m + '".')
    ), Wn(s.children, e, p, m)), !(s.path == null && !s.index) && e.push({
      path: m,
      score: ms(m, s.index),
      routesMeta: p
    });
  };
  return t.forEach((s, o) => {
    var l;
    if (s.path === "" || !((l = s.path) != null && l.includes("?")))
      i(s, o);
    else
      for (let a of Kn(s.path))
        i(s, o, a);
  }), e;
}
function Kn(t) {
  let e = t.split("/");
  if (e.length === 0) return [];
  let [r, ...n] = e, i = r.endsWith("?"), s = r.replace(/\?$/, "");
  if (n.length === 0)
    return i ? [s, ""] : [s];
  let o = Kn(n.join("/")), l = [];
  return l.push(...o.map((a) => a === "" ? s : [s, a].join("/"))), i && l.push(...o), l.map((a) => t.startsWith("/") && a === "" ? "/" : a);
}
function ls(t) {
  t.sort((e, r) => e.score !== r.score ? r.score - e.score : gs(e.routesMeta.map((n) => n.childrenIndex), r.routesMeta.map((n) => n.childrenIndex)));
}
const cs = /^:[\w-]+$/, us = 3, ds = 2, fs = 1, hs = 10, ps = -2, an = (t) => t === "*";
function ms(t, e) {
  let r = t.split("/"), n = r.length;
  return r.some(an) && (n += ps), e && (n += ds), r.filter((i) => !an(i)).reduce((i, s) => i + (cs.test(s) ? us : s === "" ? fs : hs), n);
}
function gs(t, e) {
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
function ys(t, e, r) {
  r === void 0 && (r = !1);
  let {
    routesMeta: n
  } = t, i = {}, s = "/", o = [];
  for (let l = 0; l < n.length; ++l) {
    let a = n[l], m = l === n.length - 1, p = s === "/" ? e : e.slice(s.length) || "/", u = ln({
      path: a.relativePath,
      caseSensitive: a.caseSensitive,
      end: m
    }, p), y = a.route;
    if (!u && m && r && !n[n.length - 1].route.index && (u = ln({
      path: a.relativePath,
      caseSensitive: a.caseSensitive,
      end: !1
    }, p)), !u)
      return null;
    Object.assign(i, u.params), o.push({
      // TODO: Can this as be avoided?
      params: i,
      pathname: Ae([s, u.pathname]),
      pathnameBase: _s(Ae([s, u.pathnameBase])),
      route: y
    }), u.pathnameBase !== "/" && (s = Ae([s, u.pathnameBase]));
  }
  return o;
}
function ln(t, e) {
  typeof t == "string" && (t = {
    path: t,
    caseSensitive: !1,
    end: !0
  });
  let [r, n] = vs(t.path, t.caseSensitive, t.end), i = e.match(r);
  if (!i) return null;
  let s = i[0], o = s.replace(/(.)\/+$/, "$1"), l = i.slice(1);
  return {
    params: n.reduce((m, p, u) => {
      let {
        paramName: y,
        isOptional: h
      } = p;
      if (y === "*") {
        let x = l[u] || "";
        o = s.slice(0, s.length - x.length).replace(/(.)\/+$/, "$1");
      }
      const w = l[u];
      return h && !w ? m[y] = void 0 : m[y] = (w || "").replace(/%2F/g, "/"), m;
    }, {}),
    pathname: s,
    pathnameBase: o,
    pattern: t
  };
}
function vs(t, e, r) {
  e === void 0 && (e = !1), r === void 0 && (r = !0), dt(t === "*" || !t.endsWith("*") || t.endsWith("/*"), 'Route path "' + t + '" will be treated as if it were ' + ('"' + t.replace(/\*$/, "/*") + '" because the `*` character must ') + "always follow a `/` in the pattern. To get rid of this warning, " + ('please change the route path to "' + t.replace(/\*$/, "/*") + '".'));
  let n = [], i = "^" + t.replace(/\/*\*?$/, "").replace(/^\/*/, "/").replace(/[\\.*+^${}|()[\]]/g, "\\$&").replace(/\/:([\w-]+)(\?)?/g, (o, l, a) => (n.push({
    paramName: l,
    isOptional: a != null
  }), a ? "/?([^\\/]+)?" : "/([^\\/]+)"));
  return t.endsWith("*") ? (n.push({
    paramName: "*"
  }), i += t === "*" || t === "/*" ? "(.*)$" : "(?:\\/(.+)|\\/*)$") : r ? i += "\\/*$" : t !== "" && t !== "/" && (i += "(?:(?=\\/|$))"), [new RegExp(i, e ? void 0 : "i"), n];
}
function bs(t) {
  try {
    return t.split("/").map((e) => decodeURIComponent(e).replace(/\//g, "%2F")).join("/");
  } catch (e) {
    return dt(!1, 'The URL path "' + t + '" could not be decoded because it is is a malformed URL segment. This is probably due to a bad percent ' + ("encoding (" + e + ").")), t;
  }
}
function ht(t, e) {
  if (e === "/") return t;
  if (!t.toLowerCase().startsWith(e.toLowerCase()))
    return null;
  let r = e.endsWith("/") ? e.length - 1 : e.length, n = t.charAt(r);
  return n && n !== "/" ? null : t.slice(r) || "/";
}
function xs(t, e) {
  e === void 0 && (e = "/");
  let {
    pathname: r,
    search: n = "",
    hash: i = ""
  } = typeof t == "string" ? We(t) : t;
  return {
    pathname: r ? r.startsWith("/") ? r : ws(r, e) : e,
    search: Es(n),
    hash: Ss(i)
  };
}
function ws(t, e) {
  let r = e.replace(/\/+$/, "").split("/");
  return t.split("/").forEach((i) => {
    i === ".." ? r.length > 1 && r.pop() : i !== "." && r.push(i);
  }), r.length > 1 ? r.join("/") : "/";
}
function pr(t, e, r, n) {
  return "Cannot include a '" + t + "' character in a manually specified " + ("`to." + e + "` field [" + JSON.stringify(n) + "].  Please separate it out to the ") + ("`to." + r + "` field. Alternatively you may provide the full path as ") + 'a string in <Link to="..."> and the router will parse it for you.';
}
function Yn(t) {
  return t.filter((e, r) => r === 0 || e.route.path && e.route.path.length > 0);
}
function Pr(t, e) {
  let r = Yn(t);
  return e ? r.map((n, i) => i === r.length - 1 ? n.pathname : n.pathnameBase) : r.map((n) => n.pathnameBase);
}
function Ar(t, e, r, n) {
  n === void 0 && (n = !1);
  let i;
  typeof t == "string" ? i = We(t) : (i = Q({}, t), V(!i.pathname || !i.pathname.includes("?"), pr("?", "pathname", "search", i)), V(!i.pathname || !i.pathname.includes("#"), pr("#", "pathname", "hash", i)), V(!i.search || !i.search.includes("#"), pr("#", "search", "hash", i)));
  let s = t === "" || i.pathname === "", o = s ? "/" : i.pathname, l;
  if (o == null)
    l = r;
  else {
    let u = e.length - 1;
    if (!n && o.startsWith("..")) {
      let y = o.split("/");
      for (; y[0] === ".."; )
        y.shift(), u -= 1;
      i.pathname = y.join("/");
    }
    l = u >= 0 ? e[u] : "/";
  }
  let a = xs(i, l), m = o && o !== "/" && o.endsWith("/"), p = (s || o === ".") && r.endsWith("/");
  return !a.pathname.endsWith("/") && (m || p) && (a.pathname += "/"), a;
}
const Ae = (t) => t.join("/").replace(/\/\/+/g, "/"), _s = (t) => t.replace(/\/+$/, "").replace(/^\/*/, "/"), Es = (t) => !t || t === "?" ? "" : t.startsWith("?") ? t : "?" + t, Ss = (t) => !t || t === "#" ? "" : t.startsWith("#") ? t : "#" + t;
class Qt {
  constructor(e, r, n, i) {
    i === void 0 && (i = !1), this.status = e, this.statusText = r || "", this.internal = i, n instanceof Error ? (this.data = n.toString(), this.error = n) : this.data = n;
  }
}
function Mt(t) {
  return t != null && typeof t.status == "number" && typeof t.statusText == "string" && typeof t.internal == "boolean" && "data" in t;
}
const Jn = ["post", "put", "patch", "delete"], Rs = new Set(Jn), Cs = ["get", ...Jn], Ts = new Set(Cs), ks = /* @__PURE__ */ new Set([301, 302, 303, 307, 308]), Ms = /* @__PURE__ */ new Set([307, 308]), mr = {
  state: "idle",
  location: void 0,
  formMethod: void 0,
  formAction: void 0,
  formEncType: void 0,
  formData: void 0,
  json: void 0,
  text: void 0
}, Ns = {
  state: "idle",
  data: void 0,
  formMethod: void 0,
  formAction: void 0,
  formEncType: void 0,
  formData: void 0,
  json: void 0,
  text: void 0
}, wt = {
  state: "unblocked",
  proceed: void 0,
  reset: void 0,
  location: void 0
}, Or = /^(?:[a-z][a-z0-9+.-]*:|\/\/)/i, Ls = (t) => ({
  hasErrorBoundary: !!t.hasErrorBoundary
}), Xn = "remix-router-transitions";
function Ps(t) {
  const e = t.window ? t.window : typeof window < "u" ? window : void 0, r = typeof e < "u" && typeof e.document < "u" && typeof e.document.createElement < "u", n = !r;
  V(t.routes.length > 0, "You must provide a non-empty routes array to createRouter");
  let i;
  if (t.mapRouteProperties)
    i = t.mapRouteProperties;
  else if (t.detectErrorBoundary) {
    let c = t.detectErrorBoundary;
    i = (f) => ({
      hasErrorBoundary: c(f)
    });
  } else
    i = Ls;
  let s = {}, o = Gt(t.routes, i, void 0, s), l, a = t.basename || "/", m = t.dataStrategy || Ds, p = t.patchRoutesOnNavigation, u = Q({
    v7_fetcherPersist: !1,
    v7_normalizeFormMethod: !1,
    v7_partialHydration: !1,
    v7_prependBasename: !1,
    v7_relativeSplatPath: !1,
    v7_skipActionErrorRevalidation: !1
  }, t.future), y = null, h = /* @__PURE__ */ new Set(), w = null, x = null, C = null, S = t.hydrationData != null, b = Qe(o, t.history.location, a), k = !1, E = null;
  if (b == null && !p) {
    let c = ge(404, {
      pathname: t.history.location.pathname
    }), {
      matches: f,
      route: v
    } = bn(o);
    b = f, E = {
      [v.id]: c
    };
  }
  b && !t.hydrationData && Bt(b, o, t.history.location.pathname).active && (b = null);
  let N;
  if (b)
    if (b.some((c) => c.route.lazy))
      N = !1;
    else if (!b.some((c) => c.route.loader))
      N = !0;
    else if (u.v7_partialHydration) {
      let c = t.hydrationData ? t.hydrationData.loaderData : null, f = t.hydrationData ? t.hydrationData.errors : null;
      if (f) {
        let v = b.findIndex((_) => f[_.route.id] !== void 0);
        N = b.slice(0, v + 1).every((_) => !_r(_.route, c, f));
      } else
        N = b.every((v) => !_r(v.route, c, f));
    } else
      N = t.hydrationData != null;
  else if (N = !1, b = [], u.v7_partialHydration) {
    let c = Bt(null, o, t.history.location.pathname);
    c.active && c.matches && (k = !0, b = c.matches);
  }
  let I, d = {
    historyAction: t.history.action,
    location: t.history.location,
    matches: b,
    initialized: N,
    navigation: mr,
    // Don't restore on initial updateState() if we were SSR'd
    restoreScrollPosition: t.hydrationData != null ? !1 : null,
    preventScrollReset: !1,
    revalidation: "idle",
    loaderData: t.hydrationData && t.hydrationData.loaderData || {},
    actionData: t.hydrationData && t.hydrationData.actionData || null,
    errors: t.hydrationData && t.hydrationData.errors || E,
    fetchers: /* @__PURE__ */ new Map(),
    blockers: /* @__PURE__ */ new Map()
  }, M = ie.Pop, F = !1, D, U = !1, z = /* @__PURE__ */ new Map(), ae = null, le = !1, oe = !1, je = [], we = /* @__PURE__ */ new Set(), re = /* @__PURE__ */ new Map(), Ke = 0, De = -1, Ie = /* @__PURE__ */ new Map(), he = /* @__PURE__ */ new Set(), ke = /* @__PURE__ */ new Map(), Ye = /* @__PURE__ */ new Map(), ve = /* @__PURE__ */ new Set(), Be = /* @__PURE__ */ new Map(), Se = /* @__PURE__ */ new Map(), Ue;
  function Wr() {
    if (y = t.history.listen((c) => {
      let {
        action: f,
        location: v,
        delta: _
      } = c;
      if (Ue) {
        Ue(), Ue = void 0;
        return;
      }
      dt(Se.size === 0 || _ != null, "You are trying to use a blocker on a POP navigation to a location that was not created by @remix-run/router. This will fail silently in production. This can happen if you are navigating outside the router via `window.history.pushState`/`window.location.hash` instead of using router navigation APIs.  This can also happen if you are using createHashRouter and the user manually changes the URL.");
      let T = en({
        currentLocation: d.location,
        nextLocation: v,
        historyAction: f
      });
      if (T && _ != null) {
        let j = new Promise((B) => {
          Ue = B;
        });
        t.history.go(_ * -1), It(T, {
          state: "blocked",
          location: v,
          proceed() {
            It(T, {
              state: "proceeding",
              proceed: void 0,
              reset: void 0,
              location: v
            }), j.then(() => t.history.go(_));
          },
          reset() {
            let B = new Map(d.blockers);
            B.set(T, wt), de({
              blockers: B
            });
          }
        });
        return;
      }
      return Ne(f, v);
    }), r) {
      Xs(e, z);
      let c = () => Gs(e, z);
      e.addEventListener("pagehide", c), ae = () => e.removeEventListener("pagehide", c);
    }
    return d.initialized || Ne(ie.Pop, d.location, {
      initialHydration: !0
    }), I;
  }
  function Ot() {
    y && y(), ae && ae(), h.clear(), D && D.abort(), d.fetchers.forEach((c, f) => Dt(f)), d.blockers.forEach((c, f) => Zr(f));
  }
  function Je(c) {
    return h.add(c), () => h.delete(c);
  }
  function de(c, f) {
    f === void 0 && (f = {}), d = Q({}, d, c);
    let v = [], _ = [];
    u.v7_fetcherPersist && d.fetchers.forEach((T, j) => {
      T.state === "idle" && (ve.has(j) ? _.push(j) : v.push(j));
    }), ve.forEach((T) => {
      !d.fetchers.has(T) && !re.has(T) && _.push(T);
    }), [...h].forEach((T) => T(d, {
      deletedFetchers: _,
      viewTransitionOpts: f.viewTransitionOpts,
      flushSync: f.flushSync === !0
    })), u.v7_fetcherPersist ? (v.forEach((T) => d.fetchers.delete(T)), _.forEach((T) => Dt(T))) : _.forEach((T) => ve.delete(T));
  }
  function Me(c, f, v) {
    var _, T;
    let {
      flushSync: j
    } = v === void 0 ? {} : v, B = d.actionData != null && d.navigation.formMethod != null && _e(d.navigation.formMethod) && d.navigation.state === "loading" && ((_ = c.state) == null ? void 0 : _._isRedirect) !== !0, P;
    f.actionData ? Object.keys(f.actionData).length > 0 ? P = f.actionData : P = null : B ? P = d.actionData : P = null;
    let A = f.loaderData ? yn(d.loaderData, f.loaderData, f.matches || [], f.errors) : d.loaderData, L = d.blockers;
    L.size > 0 && (L = new Map(L), L.forEach((W, fe) => L.set(fe, wt)));
    let O = F === !0 || d.navigation.formMethod != null && _e(d.navigation.formMethod) && ((T = c.state) == null ? void 0 : T._isRedirect) !== !0;
    l && (o = l, l = void 0), le || M === ie.Pop || (M === ie.Push ? t.history.push(c, c.state) : M === ie.Replace && t.history.replace(c, c.state));
    let $;
    if (M === ie.Pop) {
      let W = z.get(d.location.pathname);
      W && W.has(c.pathname) ? $ = {
        currentLocation: d.location,
        nextLocation: c
      } : z.has(c.pathname) && ($ = {
        currentLocation: c,
        nextLocation: d.location
      });
    } else if (U) {
      let W = z.get(d.location.pathname);
      W ? W.add(c.pathname) : (W = /* @__PURE__ */ new Set([c.pathname]), z.set(d.location.pathname, W)), $ = {
        currentLocation: d.location,
        nextLocation: c
      };
    }
    de(Q({}, f, {
      actionData: P,
      loaderData: A,
      historyAction: M,
      location: c,
      initialized: !0,
      navigation: mr,
      revalidation: "idle",
      restoreScrollPosition: rn(c, f.matches || d.matches),
      preventScrollReset: O,
      blockers: L
    }), {
      viewTransitionOpts: $,
      flushSync: j === !0
    }), M = ie.Pop, F = !1, U = !1, le = !1, oe = !1, je = [];
  }
  async function gt(c, f) {
    if (typeof c == "number") {
      t.history.go(c);
      return;
    }
    let v = wr(d.location, d.matches, a, u.v7_prependBasename, c, u.v7_relativeSplatPath, f == null ? void 0 : f.fromRouteId, f == null ? void 0 : f.relative), {
      path: _,
      submission: T,
      error: j
    } = cn(u.v7_normalizeFormMethod, !1, v, f), B = d.location, P = kt(d.location, _, f && f.state);
    P = Q({}, P, t.history.encodeLocation(P));
    let A = f && f.replace != null ? f.replace : void 0, L = ie.Push;
    A === !0 ? L = ie.Replace : A === !1 || T != null && _e(T.formMethod) && T.formAction === d.location.pathname + d.location.search && (L = ie.Replace);
    let O = f && "preventScrollReset" in f ? f.preventScrollReset === !0 : void 0, $ = (f && f.flushSync) === !0, W = en({
      currentLocation: B,
      nextLocation: P,
      historyAction: L
    });
    if (W) {
      It(W, {
        state: "blocked",
        location: P,
        proceed() {
          It(W, {
            state: "proceeding",
            proceed: void 0,
            reset: void 0,
            location: P
          }), gt(c, f);
        },
        reset() {
          let fe = new Map(d.blockers);
          fe.set(W, wt), de({
            blockers: fe
          });
        }
      });
      return;
    }
    return await Ne(L, P, {
      submission: T,
      // Send through the formData serialization error if we have one so we can
      // render at the right error boundary after we match routes
      pendingError: j,
      preventScrollReset: O,
      replace: f && f.replace,
      enableViewTransition: f && f.viewTransition,
      flushSync: $
    });
  }
  function jt() {
    if (ur(), de({
      revalidation: "loading"
    }), d.navigation.state !== "submitting") {
      if (d.navigation.state === "idle") {
        Ne(d.historyAction, d.location, {
          startUninterruptedRevalidation: !0
        });
        return;
      }
      Ne(M || d.historyAction, d.navigation.location, {
        overrideNavigation: d.navigation,
        // Proxy through any rending view transition
        enableViewTransition: U === !0
      });
    }
  }
  async function Ne(c, f, v) {
    D && D.abort(), D = null, M = c, le = (v && v.startUninterruptedRevalidation) === !0, Fi(d.location, d.matches), F = (v && v.preventScrollReset) === !0, U = (v && v.enableViewTransition) === !0;
    let _ = l || o, T = v && v.overrideNavigation, j = v != null && v.initialHydration && d.matches && d.matches.length > 0 && !k ? (
      // `matchRoutes()` has already been called if we're in here via `router.initialize()`
      d.matches
    ) : Qe(_, f, a), B = (v && v.flushSync) === !0;
    if (j && d.initialized && !oe && $s(d.location, f) && !(v && v.submission && _e(v.submission.formMethod))) {
      Me(f, {
        matches: j
      }, {
        flushSync: B
      });
      return;
    }
    let P = Bt(j, _, f.pathname);
    if (P.active && P.matches && (j = P.matches), !j) {
      let {
        error: G,
        notFoundMatches: Y,
        route: Z
      } = dr(f.pathname);
      Me(f, {
        matches: Y,
        loaderData: {},
        errors: {
          [Z.id]: G
        }
      }, {
        flushSync: B
      });
      return;
    }
    D = new AbortController();
    let A = lt(t.history, f, D.signal, v && v.submission), L;
    if (v && v.pendingError)
      L = [Ze(j).route.id, {
        type: J.error,
        error: v.pendingError
      }];
    else if (v && v.submission && _e(v.submission.formMethod)) {
      let G = await lr(A, f, v.submission, j, P.active, {
        replace: v.replace,
        flushSync: B
      });
      if (G.shortCircuited)
        return;
      if (G.pendingActionResult) {
        let [Y, Z] = G.pendingActionResult;
        if (be(Z) && Mt(Z.error) && Z.error.status === 404) {
          D = null, Me(f, {
            matches: G.matches,
            loaderData: {},
            errors: {
              [Y]: Z.error
            }
          });
          return;
        }
      }
      j = G.matches || j, L = G.pendingActionResult, T = gr(f, v.submission), B = !1, P.active = !1, A = lt(t.history, A.url, A.signal);
    }
    let {
      shortCircuited: O,
      matches: $,
      loaderData: W,
      errors: fe
    } = await cr(A, f, j, P.active, T, v && v.submission, v && v.fetcherSubmission, v && v.replace, v && v.initialHydration === !0, B, L);
    O || (D = null, Me(f, Q({
      matches: $ || j
    }, vn(L), {
      loaderData: W,
      errors: fe
    })));
  }
  async function lr(c, f, v, _, T, j) {
    j === void 0 && (j = {}), ur();
    let B = Ys(f, v);
    if (de({
      navigation: B
    }, {
      flushSync: j.flushSync === !0
    }), T) {
      let L = await Ut(_, f.pathname, c.signal);
      if (L.type === "aborted")
        return {
          shortCircuited: !0
        };
      if (L.type === "error") {
        let O = Ze(L.partialMatches).route.id;
        return {
          matches: L.partialMatches,
          pendingActionResult: [O, {
            type: J.error,
            error: L.error
          }]
        };
      } else if (L.matches)
        _ = L.matches;
      else {
        let {
          notFoundMatches: O,
          error: $,
          route: W
        } = dr(f.pathname);
        return {
          matches: O,
          pendingActionResult: [W.id, {
            type: J.error,
            error: $
          }]
        };
      }
    }
    let P, A = Rt(_, f);
    if (!A.route.action && !A.route.lazy)
      P = {
        type: J.error,
        error: ge(405, {
          method: c.method,
          pathname: f.pathname,
          routeId: A.route.id
        })
      };
    else if (P = (await yt("action", d, c, [A], _, null))[A.route.id], c.signal.aborted)
      return {
        shortCircuited: !0
      };
    if (rt(P)) {
      let L;
      return j && j.replace != null ? L = j.replace : L = pn(P.response.headers.get("Location"), new URL(c.url), a) === d.location.pathname + d.location.search, await Xe(c, P, !0, {
        submission: v,
        replace: L
      }), {
        shortCircuited: !0
      };
    }
    if (Ve(P))
      throw ge(400, {
        type: "defer-action"
      });
    if (be(P)) {
      let L = Ze(_, A.route.id);
      return (j && j.replace) !== !0 && (M = ie.Push), {
        matches: _,
        pendingActionResult: [L.route.id, P]
      };
    }
    return {
      matches: _,
      pendingActionResult: [A.route.id, P]
    };
  }
  async function cr(c, f, v, _, T, j, B, P, A, L, O) {
    let $ = T || gr(f, j), W = j || B || wn($), fe = !le && (!u.v7_partialHydration || !A);
    if (_) {
      if (fe) {
        let ee = Kr(O);
        de(Q({
          navigation: $
        }, ee !== void 0 ? {
          actionData: ee
        } : {}), {
          flushSync: L
        });
      }
      let K = await Ut(v, f.pathname, c.signal);
      if (K.type === "aborted")
        return {
          shortCircuited: !0
        };
      if (K.type === "error") {
        let ee = Ze(K.partialMatches).route.id;
        return {
          matches: K.partialMatches,
          loaderData: {},
          errors: {
            [ee]: K.error
          }
        };
      } else if (K.matches)
        v = K.matches;
      else {
        let {
          error: ee,
          notFoundMatches: ot,
          route: xt
        } = dr(f.pathname);
        return {
          matches: ot,
          loaderData: {},
          errors: {
            [xt.id]: ee
          }
        };
      }
    }
    let G = l || o, [Y, Z] = dn(t.history, d, v, W, f, u.v7_partialHydration && A === !0, u.v7_skipActionErrorRevalidation, oe, je, we, ve, ke, he, G, a, O);
    if (fr((K) => !(v && v.some((ee) => ee.route.id === K)) || Y && Y.some((ee) => ee.route.id === K)), De = ++Ke, Y.length === 0 && Z.length === 0) {
      let K = Gr();
      return Me(f, Q({
        matches: v,
        loaderData: {},
        // Commit pending error if we're short circuiting
        errors: O && be(O[1]) ? {
          [O[0]]: O[1].error
        } : null
      }, vn(O), K ? {
        fetchers: new Map(d.fetchers)
      } : {}), {
        flushSync: L
      }), {
        shortCircuited: !0
      };
    }
    if (fe) {
      let K = {};
      if (!_) {
        K.navigation = $;
        let ee = Kr(O);
        ee !== void 0 && (K.actionData = ee);
      }
      Z.length > 0 && (K.fetchers = Ai(Z)), de(K, {
        flushSync: L
      });
    }
    Z.forEach((K) => {
      ze(K.key), K.controller && re.set(K.key, K.controller);
    });
    let st = () => Z.forEach((K) => ze(K.key));
    D && D.signal.addEventListener("abort", st);
    let {
      loaderResults: vt,
      fetcherResults: Pe
    } = await Yr(d, v, Y, Z, c);
    if (c.signal.aborted)
      return {
        shortCircuited: !0
      };
    D && D.signal.removeEventListener("abort", st), Z.forEach((K) => re.delete(K.key));
    let Re = $t(vt);
    if (Re)
      return await Xe(c, Re.result, !0, {
        replace: P
      }), {
        shortCircuited: !0
      };
    if (Re = $t(Pe), Re)
      return he.add(Re.key), await Xe(c, Re.result, !0, {
        replace: P
      }), {
        shortCircuited: !0
      };
    let {
      loaderData: hr,
      errors: bt
    } = gn(d, v, vt, O, Z, Pe, Be);
    Be.forEach((K, ee) => {
      K.subscribe((ot) => {
        (ot || K.done) && Be.delete(ee);
      });
    }), u.v7_partialHydration && A && d.errors && (bt = Q({}, d.errors, bt));
    let Ge = Gr(), Ft = Qr(De), zt = Ge || Ft || Z.length > 0;
    return Q({
      matches: v,
      loaderData: hr,
      errors: bt
    }, zt ? {
      fetchers: new Map(d.fetchers)
    } : {});
  }
  function Kr(c) {
    if (c && !be(c[1]))
      return {
        [c[0]]: c[1].data
      };
    if (d.actionData)
      return Object.keys(d.actionData).length === 0 ? null : d.actionData;
  }
  function Ai(c) {
    return c.forEach((f) => {
      let v = d.fetchers.get(f.key), _ = _t(void 0, v ? v.data : void 0);
      d.fetchers.set(f.key, _);
    }), new Map(d.fetchers);
  }
  function Oi(c, f, v, _) {
    if (n)
      throw new Error("router.fetch() was called during the server render, but it shouldn't be. You are likely calling a useFetcher() method in the body of your component. Try moving it to a useEffect or a callback.");
    ze(c);
    let T = (_ && _.flushSync) === !0, j = l || o, B = wr(d.location, d.matches, a, u.v7_prependBasename, v, u.v7_relativeSplatPath, f, _ == null ? void 0 : _.relative), P = Qe(j, B, a), A = Bt(P, j, B);
    if (A.active && A.matches && (P = A.matches), !P) {
      Le(c, f, ge(404, {
        pathname: B
      }), {
        flushSync: T
      });
      return;
    }
    let {
      path: L,
      submission: O,
      error: $
    } = cn(u.v7_normalizeFormMethod, !0, B, _);
    if ($) {
      Le(c, f, $, {
        flushSync: T
      });
      return;
    }
    let W = Rt(P, L), fe = (_ && _.preventScrollReset) === !0;
    if (O && _e(O.formMethod)) {
      ji(c, f, L, W, P, A.active, T, fe, O);
      return;
    }
    ke.set(c, {
      routeId: f,
      path: L
    }), Di(c, f, L, W, P, A.active, T, fe, O);
  }
  async function ji(c, f, v, _, T, j, B, P, A) {
    ur(), ke.delete(c);
    function L(ne) {
      if (!ne.route.action && !ne.route.lazy) {
        let at = ge(405, {
          method: A.formMethod,
          pathname: v,
          routeId: f
        });
        return Le(c, f, at, {
          flushSync: B
        }), !0;
      }
      return !1;
    }
    if (!j && L(_))
      return;
    let O = d.fetchers.get(c);
    Fe(c, Js(A, O), {
      flushSync: B
    });
    let $ = new AbortController(), W = lt(t.history, v, $.signal, A);
    if (j) {
      let ne = await Ut(T, new URL(W.url).pathname, W.signal, c);
      if (ne.type === "aborted")
        return;
      if (ne.type === "error") {
        Le(c, f, ne.error, {
          flushSync: B
        });
        return;
      } else if (ne.matches) {
        if (T = ne.matches, _ = Rt(T, v), L(_))
          return;
      } else {
        Le(c, f, ge(404, {
          pathname: v
        }), {
          flushSync: B
        });
        return;
      }
    }
    re.set(c, $);
    let fe = Ke, Y = (await yt("action", d, W, [_], T, c))[_.route.id];
    if (W.signal.aborted) {
      re.get(c) === $ && re.delete(c);
      return;
    }
    if (u.v7_fetcherPersist && ve.has(c)) {
      if (rt(Y) || be(Y)) {
        Fe(c, qe(void 0));
        return;
      }
    } else {
      if (rt(Y))
        if (re.delete(c), De > fe) {
          Fe(c, qe(void 0));
          return;
        } else
          return he.add(c), Fe(c, _t(A)), Xe(W, Y, !1, {
            fetcherSubmission: A,
            preventScrollReset: P
          });
      if (be(Y)) {
        Le(c, f, Y.error);
        return;
      }
    }
    if (Ve(Y))
      throw ge(400, {
        type: "defer-action"
      });
    let Z = d.navigation.location || d.location, st = lt(t.history, Z, $.signal), vt = l || o, Pe = d.navigation.state !== "idle" ? Qe(vt, d.navigation.location, a) : d.matches;
    V(Pe, "Didn't find any matches after fetcher action");
    let Re = ++Ke;
    Ie.set(c, Re);
    let hr = _t(A, Y.data);
    d.fetchers.set(c, hr);
    let [bt, Ge] = dn(t.history, d, Pe, A, Z, !1, u.v7_skipActionErrorRevalidation, oe, je, we, ve, ke, he, vt, a, [_.route.id, Y]);
    Ge.filter((ne) => ne.key !== c).forEach((ne) => {
      let at = ne.key, nn = d.fetchers.get(at), qi = _t(void 0, nn ? nn.data : void 0);
      d.fetchers.set(at, qi), ze(at), ne.controller && re.set(at, ne.controller);
    }), de({
      fetchers: new Map(d.fetchers)
    });
    let Ft = () => Ge.forEach((ne) => ze(ne.key));
    $.signal.addEventListener("abort", Ft);
    let {
      loaderResults: zt,
      fetcherResults: K
    } = await Yr(d, Pe, bt, Ge, st);
    if ($.signal.aborted)
      return;
    $.signal.removeEventListener("abort", Ft), Ie.delete(c), re.delete(c), Ge.forEach((ne) => re.delete(ne.key));
    let ee = $t(zt);
    if (ee)
      return Xe(st, ee.result, !1, {
        preventScrollReset: P
      });
    if (ee = $t(K), ee)
      return he.add(ee.key), Xe(st, ee.result, !1, {
        preventScrollReset: P
      });
    let {
      loaderData: ot,
      errors: xt
    } = gn(d, Pe, zt, void 0, Ge, K, Be);
    if (d.fetchers.has(c)) {
      let ne = qe(Y.data);
      d.fetchers.set(c, ne);
    }
    Qr(Re), d.navigation.state === "loading" && Re > De ? (V(M, "Expected pending action"), D && D.abort(), Me(d.navigation.location, {
      matches: Pe,
      loaderData: ot,
      errors: xt,
      fetchers: new Map(d.fetchers)
    })) : (de({
      errors: xt,
      loaderData: yn(d.loaderData, ot, Pe, xt),
      fetchers: new Map(d.fetchers)
    }), oe = !1);
  }
  async function Di(c, f, v, _, T, j, B, P, A) {
    let L = d.fetchers.get(c);
    Fe(c, _t(A, L ? L.data : void 0), {
      flushSync: B
    });
    let O = new AbortController(), $ = lt(t.history, v, O.signal);
    if (j) {
      let Y = await Ut(T, new URL($.url).pathname, $.signal, c);
      if (Y.type === "aborted")
        return;
      if (Y.type === "error") {
        Le(c, f, Y.error, {
          flushSync: B
        });
        return;
      } else if (Y.matches)
        T = Y.matches, _ = Rt(T, v);
      else {
        Le(c, f, ge(404, {
          pathname: v
        }), {
          flushSync: B
        });
        return;
      }
    }
    re.set(c, O);
    let W = Ke, G = (await yt("loader", d, $, [_], T, c))[_.route.id];
    if (Ve(G) && (G = await jr(G, $.signal, !0) || G), re.get(c) === O && re.delete(c), !$.signal.aborted) {
      if (ve.has(c)) {
        Fe(c, qe(void 0));
        return;
      }
      if (rt(G))
        if (De > W) {
          Fe(c, qe(void 0));
          return;
        } else {
          he.add(c), await Xe($, G, !1, {
            preventScrollReset: P
          });
          return;
        }
      if (be(G)) {
        Le(c, f, G.error);
        return;
      }
      V(!Ve(G), "Unhandled fetcher deferred data"), Fe(c, qe(G.data));
    }
  }
  async function Xe(c, f, v, _) {
    let {
      submission: T,
      fetcherSubmission: j,
      preventScrollReset: B,
      replace: P
    } = _ === void 0 ? {} : _;
    f.response.headers.has("X-Remix-Revalidate") && (oe = !0);
    let A = f.response.headers.get("Location");
    V(A, "Expected a Location header on the redirect Response"), A = pn(A, new URL(c.url), a);
    let L = kt(d.location, A, {
      _isRedirect: !0
    });
    if (r) {
      let Y = !1;
      if (f.response.headers.has("X-Remix-Reload-Document"))
        Y = !0;
      else if (Or.test(A)) {
        const Z = t.history.createURL(A);
        Y = // Hard reload if it's an absolute URL to a new origin
        Z.origin !== e.location.origin || // Hard reload if it's an absolute URL that does not match our basename
        ht(Z.pathname, a) == null;
      }
      if (Y) {
        P ? e.location.replace(A) : e.location.assign(A);
        return;
      }
    }
    D = null;
    let O = P === !0 || f.response.headers.has("X-Remix-Replace") ? ie.Replace : ie.Push, {
      formMethod: $,
      formAction: W,
      formEncType: fe
    } = d.navigation;
    !T && !j && $ && W && fe && (T = wn(d.navigation));
    let G = T || j;
    if (Ms.has(f.response.status) && G && _e(G.formMethod))
      await Ne(O, L, {
        submission: Q({}, G, {
          formAction: A
        }),
        // Preserve these flags across redirects
        preventScrollReset: B || F,
        enableViewTransition: v ? U : void 0
      });
    else {
      let Y = gr(L, T);
      await Ne(O, L, {
        overrideNavigation: Y,
        // Send fetcher submissions through for shouldRevalidate
        fetcherSubmission: j,
        // Preserve these flags across redirects
        preventScrollReset: B || F,
        enableViewTransition: v ? U : void 0
      });
    }
  }
  async function yt(c, f, v, _, T, j) {
    let B, P = {};
    try {
      B = await Is(m, c, f, v, _, T, j, s, i);
    } catch (A) {
      return _.forEach((L) => {
        P[L.route.id] = {
          type: J.error,
          error: A
        };
      }), P;
    }
    for (let [A, L] of Object.entries(B))
      if (qs(L)) {
        let O = L.result;
        P[A] = {
          type: J.redirect,
          response: Fs(O, v, A, T, a, u.v7_relativeSplatPath)
        };
      } else
        P[A] = await Us(L);
    return P;
  }
  async function Yr(c, f, v, _, T) {
    let j = c.matches, B = yt("loader", c, T, v, f, null), P = Promise.all(_.map(async (O) => {
      if (O.matches && O.match && O.controller) {
        let W = (await yt("loader", c, lt(t.history, O.path, O.controller.signal), [O.match], O.matches, O.key))[O.match.route.id];
        return {
          [O.key]: W
        };
      } else
        return Promise.resolve({
          [O.key]: {
            type: J.error,
            error: ge(404, {
              pathname: O.path
            })
          }
        });
    })), A = await B, L = (await P).reduce((O, $) => Object.assign(O, $), {});
    return await Promise.all([Ws(f, A, T.signal, j, c.loaderData), Ks(f, L, _)]), {
      loaderResults: A,
      fetcherResults: L
    };
  }
  function ur() {
    oe = !0, je.push(...fr()), ke.forEach((c, f) => {
      re.has(f) && we.add(f), ze(f);
    });
  }
  function Fe(c, f, v) {
    v === void 0 && (v = {}), d.fetchers.set(c, f), de({
      fetchers: new Map(d.fetchers)
    }, {
      flushSync: (v && v.flushSync) === !0
    });
  }
  function Le(c, f, v, _) {
    _ === void 0 && (_ = {});
    let T = Ze(d.matches, f);
    Dt(c), de({
      errors: {
        [T.route.id]: v
      },
      fetchers: new Map(d.fetchers)
    }, {
      flushSync: (_ && _.flushSync) === !0
    });
  }
  function Jr(c) {
    return Ye.set(c, (Ye.get(c) || 0) + 1), ve.has(c) && ve.delete(c), d.fetchers.get(c) || Ns;
  }
  function Dt(c) {
    let f = d.fetchers.get(c);
    re.has(c) && !(f && f.state === "loading" && Ie.has(c)) && ze(c), ke.delete(c), Ie.delete(c), he.delete(c), u.v7_fetcherPersist && ve.delete(c), we.delete(c), d.fetchers.delete(c);
  }
  function Ii(c) {
    let f = (Ye.get(c) || 0) - 1;
    f <= 0 ? (Ye.delete(c), ve.add(c), u.v7_fetcherPersist || Dt(c)) : Ye.set(c, f), de({
      fetchers: new Map(d.fetchers)
    });
  }
  function ze(c) {
    let f = re.get(c);
    f && (f.abort(), re.delete(c));
  }
  function Xr(c) {
    for (let f of c) {
      let v = Jr(f), _ = qe(v.data);
      d.fetchers.set(f, _);
    }
  }
  function Gr() {
    let c = [], f = !1;
    for (let v of he) {
      let _ = d.fetchers.get(v);
      V(_, "Expected fetcher: " + v), _.state === "loading" && (he.delete(v), c.push(v), f = !0);
    }
    return Xr(c), f;
  }
  function Qr(c) {
    let f = [];
    for (let [v, _] of Ie)
      if (_ < c) {
        let T = d.fetchers.get(v);
        V(T, "Expected fetcher: " + v), T.state === "loading" && (ze(v), Ie.delete(v), f.push(v));
      }
    return Xr(f), f.length > 0;
  }
  function Bi(c, f) {
    let v = d.blockers.get(c) || wt;
    return Se.get(c) !== f && Se.set(c, f), v;
  }
  function Zr(c) {
    d.blockers.delete(c), Se.delete(c);
  }
  function It(c, f) {
    let v = d.blockers.get(c) || wt;
    V(v.state === "unblocked" && f.state === "blocked" || v.state === "blocked" && f.state === "blocked" || v.state === "blocked" && f.state === "proceeding" || v.state === "blocked" && f.state === "unblocked" || v.state === "proceeding" && f.state === "unblocked", "Invalid blocker state transition: " + v.state + " -> " + f.state);
    let _ = new Map(d.blockers);
    _.set(c, f), de({
      blockers: _
    });
  }
  function en(c) {
    let {
      currentLocation: f,
      nextLocation: v,
      historyAction: _
    } = c;
    if (Se.size === 0)
      return;
    Se.size > 1 && dt(!1, "A router only supports one blocker at a time");
    let T = Array.from(Se.entries()), [j, B] = T[T.length - 1], P = d.blockers.get(j);
    if (!(P && P.state === "proceeding") && B({
      currentLocation: f,
      nextLocation: v,
      historyAction: _
    }))
      return j;
  }
  function dr(c) {
    let f = ge(404, {
      pathname: c
    }), v = l || o, {
      matches: _,
      route: T
    } = bn(v);
    return fr(), {
      notFoundMatches: _,
      route: T,
      error: f
    };
  }
  function fr(c) {
    let f = [];
    return Be.forEach((v, _) => {
      (!c || c(_)) && (v.cancel(), f.push(_), Be.delete(_));
    }), f;
  }
  function Ui(c, f, v) {
    if (w = c, C = f, x = v || null, !S && d.navigation === mr) {
      S = !0;
      let _ = rn(d.location, d.matches);
      _ != null && de({
        restoreScrollPosition: _
      });
    }
    return () => {
      w = null, C = null, x = null;
    };
  }
  function tn(c, f) {
    return x && x(c, f.map((_) => as(_, d.loaderData))) || c.key;
  }
  function Fi(c, f) {
    if (w && C) {
      let v = tn(c, f);
      w[v] = C();
    }
  }
  function rn(c, f) {
    if (w) {
      let v = tn(c, f), _ = w[v];
      if (typeof _ == "number")
        return _;
    }
    return null;
  }
  function Bt(c, f, v) {
    if (p)
      if (c) {
        if (Object.keys(c[0].params).length > 0)
          return {
            active: !0,
            matches: Ht(f, v, a, !0)
          };
      } else
        return {
          active: !0,
          matches: Ht(f, v, a, !0) || []
        };
    return {
      active: !1,
      matches: null
    };
  }
  async function Ut(c, f, v, _) {
    if (!p)
      return {
        type: "success",
        matches: c
      };
    let T = c;
    for (; ; ) {
      let j = l == null, B = l || o, P = s;
      try {
        await p({
          signal: v,
          path: f,
          matches: T,
          fetcherKey: _,
          patch: (O, $) => {
            v.aborted || hn(O, $, B, P, i);
          }
        });
      } catch (O) {
        return {
          type: "error",
          error: O,
          partialMatches: T
        };
      } finally {
        j && !v.aborted && (o = [...o]);
      }
      if (v.aborted)
        return {
          type: "aborted"
        };
      let A = Qe(B, f, a);
      if (A)
        return {
          type: "success",
          matches: A
        };
      let L = Ht(B, f, a, !0);
      if (!L || T.length === L.length && T.every((O, $) => O.route.id === L[$].route.id))
        return {
          type: "success",
          matches: null
        };
      T = L;
    }
  }
  function zi(c) {
    s = {}, l = Gt(c, i, void 0, s);
  }
  function $i(c, f) {
    let v = l == null;
    hn(c, f, l || o, s, i), v && (o = [...o], de({}));
  }
  return I = {
    get basename() {
      return a;
    },
    get future() {
      return u;
    },
    get state() {
      return d;
    },
    get routes() {
      return o;
    },
    get window() {
      return e;
    },
    initialize: Wr,
    subscribe: Je,
    enableScrollRestoration: Ui,
    navigate: gt,
    fetch: Oi,
    revalidate: jt,
    // Passthrough to history-aware createHref used by useHref so we get proper
    // hash-aware URLs in DOM paths
    createHref: (c) => t.history.createHref(c),
    encodeLocation: (c) => t.history.encodeLocation(c),
    getFetcher: Jr,
    deleteFetcher: Ii,
    dispose: Ot,
    getBlocker: Bi,
    deleteBlocker: Zr,
    patchRoutes: $i,
    _internalFetchControllers: re,
    _internalActiveDeferreds: Be,
    // TODO: Remove setRoutes, it's temporary to avoid dealing with
    // updating the tree while validating the update algorithm.
    _internalSetRoutes: zi
  }, I;
}
function As(t) {
  return t != null && ("formData" in t && t.formData != null || "body" in t && t.body !== void 0);
}
function wr(t, e, r, n, i, s, o, l) {
  let a, m;
  if (o) {
    a = [];
    for (let u of e)
      if (a.push(u), u.route.id === o) {
        m = u;
        break;
      }
  } else
    a = e, m = e[e.length - 1];
  let p = Ar(i || ".", Pr(a, s), ht(t.pathname, r) || t.pathname, l === "path");
  if (i == null && (p.search = t.search, p.hash = t.hash), (i == null || i === "" || i === ".") && m) {
    let u = Dr(p.search);
    if (m.route.index && !u)
      p.search = p.search ? p.search.replace(/^\?/, "?index&") : "?index";
    else if (!m.route.index && u) {
      let y = new URLSearchParams(p.search), h = y.getAll("index");
      y.delete("index"), h.filter((x) => x).forEach((x) => y.append("index", x));
      let w = y.toString();
      p.search = w ? "?" + w : "";
    }
  }
  return n && r !== "/" && (p.pathname = p.pathname === "/" ? r : Ae([r, p.pathname])), nt(p);
}
function cn(t, e, r, n) {
  if (!n || !As(n))
    return {
      path: r
    };
  if (n.formMethod && !Hs(n.formMethod))
    return {
      path: r,
      error: ge(405, {
        method: n.formMethod
      })
    };
  let i = () => ({
    path: r,
    error: ge(400, {
      type: "invalid-body"
    })
  }), s = n.formMethod || "get", o = t ? s.toUpperCase() : s.toLowerCase(), l = Zn(r);
  if (n.body !== void 0) {
    if (n.formEncType === "text/plain") {
      if (!_e(o))
        return i();
      let y = typeof n.body == "string" ? n.body : n.body instanceof FormData || n.body instanceof URLSearchParams ? (
        // https://html.spec.whatwg.org/multipage/form-control-infrastructure.html#plain-text-form-data
        Array.from(n.body.entries()).reduce((h, w) => {
          let [x, C] = w;
          return "" + h + x + "=" + C + `
`;
        }, "")
      ) : String(n.body);
      return {
        path: r,
        submission: {
          formMethod: o,
          formAction: l,
          formEncType: n.formEncType,
          formData: void 0,
          json: void 0,
          text: y
        }
      };
    } else if (n.formEncType === "application/json") {
      if (!_e(o))
        return i();
      try {
        let y = typeof n.body == "string" ? JSON.parse(n.body) : n.body;
        return {
          path: r,
          submission: {
            formMethod: o,
            formAction: l,
            formEncType: n.formEncType,
            formData: void 0,
            json: y,
            text: void 0
          }
        };
      } catch {
        return i();
      }
    }
  }
  V(typeof FormData == "function", "FormData is not available in this environment");
  let a, m;
  if (n.formData)
    a = Er(n.formData), m = n.formData;
  else if (n.body instanceof FormData)
    a = Er(n.body), m = n.body;
  else if (n.body instanceof URLSearchParams)
    a = n.body, m = mn(a);
  else if (n.body == null)
    a = new URLSearchParams(), m = new FormData();
  else
    try {
      a = new URLSearchParams(n.body), m = mn(a);
    } catch {
      return i();
    }
  let p = {
    formMethod: o,
    formAction: l,
    formEncType: n && n.formEncType || "application/x-www-form-urlencoded",
    formData: m,
    json: void 0,
    text: void 0
  };
  if (_e(p.formMethod))
    return {
      path: r,
      submission: p
    };
  let u = We(r);
  return e && u.search && Dr(u.search) && a.append("index", ""), u.search = "?" + a, {
    path: nt(u),
    submission: p
  };
}
function un(t, e, r) {
  r === void 0 && (r = !1);
  let n = t.findIndex((i) => i.route.id === e);
  return n >= 0 ? t.slice(0, r ? n + 1 : n) : t;
}
function dn(t, e, r, n, i, s, o, l, a, m, p, u, y, h, w, x) {
  let C = x ? be(x[1]) ? x[1].error : x[1].data : void 0, S = t.createURL(e.location), b = t.createURL(i), k = r;
  s && e.errors ? k = un(r, Object.keys(e.errors)[0], !0) : x && be(x[1]) && (k = un(r, x[0]));
  let E = x ? x[1].statusCode : void 0, N = o && E && E >= 400, I = k.filter((M, F) => {
    let {
      route: D
    } = M;
    if (D.lazy)
      return !0;
    if (D.loader == null)
      return !1;
    if (s)
      return _r(D, e.loaderData, e.errors);
    if (Os(e.loaderData, e.matches[F], M) || a.some((ae) => ae === M.route.id))
      return !0;
    let U = e.matches[F], z = M;
    return fn(M, Q({
      currentUrl: S,
      currentParams: U.params,
      nextUrl: b,
      nextParams: z.params
    }, n, {
      actionResult: C,
      actionStatus: E,
      defaultShouldRevalidate: N ? !1 : (
        // Forced revalidation due to submission, useRevalidator, or X-Remix-Revalidate
        l || S.pathname + S.search === b.pathname + b.search || // Search params affect all loaders
        S.search !== b.search || Gn(U, z)
      )
    }));
  }), d = [];
  return u.forEach((M, F) => {
    if (s || !r.some((le) => le.route.id === M.routeId) || p.has(F))
      return;
    let D = Qe(h, M.path, w);
    if (!D) {
      d.push({
        key: F,
        routeId: M.routeId,
        path: M.path,
        matches: null,
        match: null,
        controller: null
      });
      return;
    }
    let U = e.fetchers.get(F), z = Rt(D, M.path), ae = !1;
    y.has(F) ? ae = !1 : m.has(F) ? (m.delete(F), ae = !0) : U && U.state !== "idle" && U.data === void 0 ? ae = l : ae = fn(z, Q({
      currentUrl: S,
      currentParams: e.matches[e.matches.length - 1].params,
      nextUrl: b,
      nextParams: r[r.length - 1].params
    }, n, {
      actionResult: C,
      actionStatus: E,
      defaultShouldRevalidate: N ? !1 : l
    })), ae && d.push({
      key: F,
      routeId: M.routeId,
      path: M.path,
      matches: D,
      match: z,
      controller: new AbortController()
    });
  }), [I, d];
}
function _r(t, e, r) {
  if (t.lazy)
    return !0;
  if (!t.loader)
    return !1;
  let n = e != null && e[t.id] !== void 0, i = r != null && r[t.id] !== void 0;
  return !n && i ? !1 : typeof t.loader == "function" && t.loader.hydrate === !0 ? !0 : !n && !i;
}
function Os(t, e, r) {
  let n = (
    // [a] -> [a, b]
    !e || // [a, b] -> [a, c]
    r.route.id !== e.route.id
  ), i = t[r.route.id] === void 0;
  return n || i;
}
function Gn(t, e) {
  let r = t.route.path;
  return (
    // param change for this match, /users/123 -> /users/456
    t.pathname !== e.pathname || // splat param changed, which is not present in match.path
    // e.g. /files/images/avatar.jpg -> files/finances.xls
    r != null && r.endsWith("*") && t.params["*"] !== e.params["*"]
  );
}
function fn(t, e) {
  if (t.route.shouldRevalidate) {
    let r = t.route.shouldRevalidate(e);
    if (typeof r == "boolean")
      return r;
  }
  return e.defaultShouldRevalidate;
}
function hn(t, e, r, n, i) {
  var s;
  let o;
  if (t) {
    let m = n[t];
    V(m, "No route found to patch children into: routeId = " + t), m.children || (m.children = []), o = m.children;
  } else
    o = r;
  let l = e.filter((m) => !o.some((p) => Qn(m, p))), a = Gt(l, i, [t || "_", "patch", String(((s = o) == null ? void 0 : s.length) || "0")], n);
  o.push(...a);
}
function Qn(t, e) {
  return "id" in t && "id" in e && t.id === e.id ? !0 : t.index === e.index && t.path === e.path && t.caseSensitive === e.caseSensitive ? (!t.children || t.children.length === 0) && (!e.children || e.children.length === 0) ? !0 : t.children.every((r, n) => {
    var i;
    return (i = e.children) == null ? void 0 : i.some((s) => Qn(r, s));
  }) : !1;
}
async function js(t, e, r) {
  if (!t.lazy)
    return;
  let n = await t.lazy();
  if (!t.lazy)
    return;
  let i = r[t.id];
  V(i, "No route found in manifest");
  let s = {};
  for (let o in n) {
    let a = i[o] !== void 0 && // This property isn't static since it should always be updated based
    // on the route updates
    o !== "hasErrorBoundary";
    dt(!a, 'Route "' + i.id + '" has a static property "' + o + '" defined but its lazy function is also returning a value for this property. ' + ('The lazy route property "' + o + '" will be ignored.')), !a && !ss.has(o) && (s[o] = n[o]);
  }
  Object.assign(i, s), Object.assign(i, Q({}, e(i), {
    lazy: void 0
  }));
}
async function Ds(t) {
  let {
    matches: e
  } = t, r = e.filter((i) => i.shouldLoad);
  return (await Promise.all(r.map((i) => i.resolve()))).reduce((i, s, o) => Object.assign(i, {
    [r[o].route.id]: s
  }), {});
}
async function Is(t, e, r, n, i, s, o, l, a, m) {
  let p = s.map((h) => h.route.lazy ? js(h.route, a, l) : void 0), u = s.map((h, w) => {
    let x = p[w], C = i.some((b) => b.route.id === h.route.id);
    return Q({}, h, {
      shouldLoad: C,
      resolve: async (b) => (b && n.method === "GET" && (h.route.lazy || h.route.loader) && (C = !0), C ? Bs(e, n, h, x, b, m) : Promise.resolve({
        type: J.data,
        result: void 0
      }))
    });
  }), y = await t({
    matches: u,
    request: n,
    params: s[0].params,
    fetcherKey: o,
    context: m
  });
  try {
    await Promise.all(p);
  } catch {
  }
  return y;
}
async function Bs(t, e, r, n, i, s) {
  let o, l, a = (m) => {
    let p, u = new Promise((w, x) => p = x);
    l = () => p(), e.signal.addEventListener("abort", l);
    let y = (w) => typeof m != "function" ? Promise.reject(new Error("You cannot call the handler for a route which defines a boolean " + ('"' + t + '" [routeId: ' + r.route.id + "]"))) : m({
      request: e,
      params: r.params,
      context: s
    }, ...w !== void 0 ? [w] : []), h = (async () => {
      try {
        return {
          type: "data",
          result: await (i ? i((x) => y(x)) : y())
        };
      } catch (w) {
        return {
          type: "error",
          result: w
        };
      }
    })();
    return Promise.race([h, u]);
  };
  try {
    let m = r.route[t];
    if (n)
      if (m) {
        let p, [u] = await Promise.all([
          // If the handler throws, don't let it immediately bubble out,
          // since we need to let the lazy() execution finish so we know if this
          // route has a boundary that can handle the error
          a(m).catch((y) => {
            p = y;
          }),
          n
        ]);
        if (p !== void 0)
          throw p;
        o = u;
      } else if (await n, m = r.route[t], m)
        o = await a(m);
      else if (t === "action") {
        let p = new URL(e.url), u = p.pathname + p.search;
        throw ge(405, {
          method: e.method,
          pathname: u,
          routeId: r.route.id
        });
      } else
        return {
          type: J.data,
          result: void 0
        };
    else if (m)
      o = await a(m);
    else {
      let p = new URL(e.url), u = p.pathname + p.search;
      throw ge(404, {
        pathname: u
      });
    }
    V(o.result !== void 0, "You defined " + (t === "action" ? "an action" : "a loader") + " for route " + ('"' + r.route.id + "\" but didn't return anything from your `" + t + "` ") + "function. Please return a value or `null`.");
  } catch (m) {
    return {
      type: J.error,
      result: m
    };
  } finally {
    l && e.signal.removeEventListener("abort", l);
  }
  return o;
}
async function Us(t) {
  let {
    result: e,
    type: r
  } = t;
  if (ei(e)) {
    let u;
    try {
      let y = e.headers.get("Content-Type");
      y && /\bapplication\/json\b/.test(y) ? e.body == null ? u = null : u = await e.json() : u = await e.text();
    } catch (y) {
      return {
        type: J.error,
        error: y
      };
    }
    return r === J.error ? {
      type: J.error,
      error: new Qt(e.status, e.statusText, u),
      statusCode: e.status,
      headers: e.headers
    } : {
      type: J.data,
      data: u,
      statusCode: e.status,
      headers: e.headers
    };
  }
  if (r === J.error) {
    if (xn(e)) {
      var n, i;
      if (e.data instanceof Error) {
        var s, o;
        return {
          type: J.error,
          error: e.data,
          statusCode: (s = e.init) == null ? void 0 : s.status,
          headers: (o = e.init) != null && o.headers ? new Headers(e.init.headers) : void 0
        };
      }
      return {
        type: J.error,
        error: new Qt(((n = e.init) == null ? void 0 : n.status) || 500, void 0, e.data),
        statusCode: Mt(e) ? e.status : void 0,
        headers: (i = e.init) != null && i.headers ? new Headers(e.init.headers) : void 0
      };
    }
    return {
      type: J.error,
      error: e,
      statusCode: Mt(e) ? e.status : void 0
    };
  }
  if (Vs(e)) {
    var l, a;
    return {
      type: J.deferred,
      deferredData: e,
      statusCode: (l = e.init) == null ? void 0 : l.status,
      headers: ((a = e.init) == null ? void 0 : a.headers) && new Headers(e.init.headers)
    };
  }
  if (xn(e)) {
    var m, p;
    return {
      type: J.data,
      data: e.data,
      statusCode: (m = e.init) == null ? void 0 : m.status,
      headers: (p = e.init) != null && p.headers ? new Headers(e.init.headers) : void 0
    };
  }
  return {
    type: J.data,
    data: e
  };
}
function Fs(t, e, r, n, i, s) {
  let o = t.headers.get("Location");
  if (V(o, "Redirects returned/thrown from loaders/actions must have a Location header"), !Or.test(o)) {
    let l = n.slice(0, n.findIndex((a) => a.route.id === r) + 1);
    o = wr(new URL(e.url), l, i, !0, o, s), t.headers.set("Location", o);
  }
  return t;
}
function pn(t, e, r) {
  if (Or.test(t)) {
    let n = t, i = n.startsWith("//") ? new URL(e.protocol + n) : new URL(n), s = ht(i.pathname, r) != null;
    if (i.origin === e.origin && s)
      return i.pathname + i.search + i.hash;
  }
  return t;
}
function lt(t, e, r, n) {
  let i = t.createURL(Zn(e)).toString(), s = {
    signal: r
  };
  if (n && _e(n.formMethod)) {
    let {
      formMethod: o,
      formEncType: l
    } = n;
    s.method = o.toUpperCase(), l === "application/json" ? (s.headers = new Headers({
      "Content-Type": l
    }), s.body = JSON.stringify(n.json)) : l === "text/plain" ? s.body = n.text : l === "application/x-www-form-urlencoded" && n.formData ? s.body = Er(n.formData) : s.body = n.formData;
  }
  return new Request(i, s);
}
function Er(t) {
  let e = new URLSearchParams();
  for (let [r, n] of t.entries())
    e.append(r, typeof n == "string" ? n : n.name);
  return e;
}
function mn(t) {
  let e = new FormData();
  for (let [r, n] of t.entries())
    e.append(r, n);
  return e;
}
function zs(t, e, r, n, i) {
  let s = {}, o = null, l, a = !1, m = {}, p = r && be(r[1]) ? r[1].error : void 0;
  return t.forEach((u) => {
    if (!(u.route.id in e))
      return;
    let y = u.route.id, h = e[y];
    if (V(!rt(h), "Cannot handle redirect results in processLoaderData"), be(h)) {
      let w = h.error;
      p !== void 0 && (w = p, p = void 0), o = o || {};
      {
        let x = Ze(t, y);
        o[x.route.id] == null && (o[x.route.id] = w);
      }
      s[y] = void 0, a || (a = !0, l = Mt(h.error) ? h.error.status : 500), h.headers && (m[y] = h.headers);
    } else
      Ve(h) ? (n.set(y, h.deferredData), s[y] = h.deferredData.data, h.statusCode != null && h.statusCode !== 200 && !a && (l = h.statusCode), h.headers && (m[y] = h.headers)) : (s[y] = h.data, h.statusCode && h.statusCode !== 200 && !a && (l = h.statusCode), h.headers && (m[y] = h.headers));
  }), p !== void 0 && r && (o = {
    [r[0]]: p
  }, s[r[0]] = void 0), {
    loaderData: s,
    errors: o,
    statusCode: l || 200,
    loaderHeaders: m
  };
}
function gn(t, e, r, n, i, s, o) {
  let {
    loaderData: l,
    errors: a
  } = zs(e, r, n, o);
  return i.forEach((m) => {
    let {
      key: p,
      match: u,
      controller: y
    } = m, h = s[p];
    if (V(h, "Did not find corresponding fetcher result"), !(y && y.signal.aborted))
      if (be(h)) {
        let w = Ze(t.matches, u == null ? void 0 : u.route.id);
        a && a[w.route.id] || (a = Q({}, a, {
          [w.route.id]: h.error
        })), t.fetchers.delete(p);
      } else if (rt(h))
        V(!1, "Unhandled fetcher revalidation redirect");
      else if (Ve(h))
        V(!1, "Unhandled fetcher deferred data");
      else {
        let w = qe(h.data);
        t.fetchers.set(p, w);
      }
  }), {
    loaderData: l,
    errors: a
  };
}
function yn(t, e, r, n) {
  let i = Q({}, e);
  for (let s of r) {
    let o = s.route.id;
    if (e.hasOwnProperty(o) ? e[o] !== void 0 && (i[o] = e[o]) : t[o] !== void 0 && s.route.loader && (i[o] = t[o]), n && n.hasOwnProperty(o))
      break;
  }
  return i;
}
function vn(t) {
  return t ? be(t[1]) ? {
    // Clear out prior actionData on errors
    actionData: {}
  } : {
    actionData: {
      [t[0]]: t[1].data
    }
  } : {};
}
function Ze(t, e) {
  return (e ? t.slice(0, t.findIndex((n) => n.route.id === e) + 1) : [...t]).reverse().find((n) => n.route.hasErrorBoundary === !0) || t[0];
}
function bn(t) {
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
function ge(t, e) {
  let {
    pathname: r,
    routeId: n,
    method: i,
    type: s,
    message: o
  } = e === void 0 ? {} : e, l = "Unknown Server Error", a = "Unknown @remix-run/router error";
  return t === 400 ? (l = "Bad Request", i && r && n ? a = "You made a " + i + ' request to "' + r + '" but ' + ('did not provide a `loader` for route "' + n + '", ') + "so there is no way to handle the request." : s === "defer-action" ? a = "defer() is not supported in actions" : s === "invalid-body" && (a = "Unable to encode submission body")) : t === 403 ? (l = "Forbidden", a = 'Route "' + n + '" does not match URL "' + r + '"') : t === 404 ? (l = "Not Found", a = 'No route matches URL "' + r + '"') : t === 405 && (l = "Method Not Allowed", i && r && n ? a = "You made a " + i.toUpperCase() + ' request to "' + r + '" but ' + ('did not provide an `action` for route "' + n + '", ') + "so there is no way to handle the request." : i && (a = 'Invalid request method "' + i.toUpperCase() + '"')), new Qt(t || 500, l, new Error(a), !0);
}
function $t(t) {
  let e = Object.entries(t);
  for (let r = e.length - 1; r >= 0; r--) {
    let [n, i] = e[r];
    if (rt(i))
      return {
        key: n,
        result: i
      };
  }
}
function Zn(t) {
  let e = typeof t == "string" ? We(t) : t;
  return nt(Q({}, e, {
    hash: ""
  }));
}
function $s(t, e) {
  return t.pathname !== e.pathname || t.search !== e.search ? !1 : t.hash === "" ? e.hash !== "" : t.hash === e.hash ? !0 : e.hash !== "";
}
function qs(t) {
  return ei(t.result) && ks.has(t.result.status);
}
function Ve(t) {
  return t.type === J.deferred;
}
function be(t) {
  return t.type === J.error;
}
function rt(t) {
  return (t && t.type) === J.redirect;
}
function xn(t) {
  return typeof t == "object" && t != null && "type" in t && "data" in t && "init" in t && t.type === "DataWithResponseInit";
}
function Vs(t) {
  let e = t;
  return e && typeof e == "object" && typeof e.data == "object" && typeof e.subscribe == "function" && typeof e.cancel == "function" && typeof e.resolveData == "function";
}
function ei(t) {
  return t != null && typeof t.status == "number" && typeof t.statusText == "string" && typeof t.headers == "object" && typeof t.body < "u";
}
function Hs(t) {
  return Ts.has(t.toLowerCase());
}
function _e(t) {
  return Rs.has(t.toLowerCase());
}
async function Ws(t, e, r, n, i) {
  let s = Object.entries(e);
  for (let o = 0; o < s.length; o++) {
    let [l, a] = s[o], m = t.find((y) => (y == null ? void 0 : y.route.id) === l);
    if (!m)
      continue;
    let p = n.find((y) => y.route.id === m.route.id), u = p != null && !Gn(p, m) && (i && i[m.route.id]) !== void 0;
    Ve(a) && u && await jr(a, r, !1).then((y) => {
      y && (e[l] = y);
    });
  }
}
async function Ks(t, e, r) {
  for (let n = 0; n < r.length; n++) {
    let {
      key: i,
      routeId: s,
      controller: o
    } = r[n], l = e[i];
    t.find((m) => (m == null ? void 0 : m.route.id) === s) && Ve(l) && (V(o, "Expected an AbortController for revalidating fetcher deferred result"), await jr(l, o.signal, !0).then((m) => {
      m && (e[i] = m);
    }));
  }
}
async function jr(t, e, r) {
  if (r === void 0 && (r = !1), !await t.deferredData.resolveData(e)) {
    if (r)
      try {
        return {
          type: J.data,
          data: t.deferredData.unwrappedData
        };
      } catch (i) {
        return {
          type: J.error,
          error: i
        };
      }
    return {
      type: J.data,
      data: t.deferredData.data
    };
  }
}
function Dr(t) {
  return new URLSearchParams(t).getAll("index").some((e) => e === "");
}
function Rt(t, e) {
  let r = typeof e == "string" ? We(e).search : e.search;
  if (t[t.length - 1].route.index && Dr(r || ""))
    return t[t.length - 1];
  let n = Yn(t);
  return n[n.length - 1];
}
function wn(t) {
  let {
    formMethod: e,
    formAction: r,
    formEncType: n,
    text: i,
    formData: s,
    json: o
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
    if (s != null)
      return {
        formMethod: e,
        formAction: r,
        formEncType: n,
        formData: s,
        json: void 0,
        text: void 0
      };
    if (o !== void 0)
      return {
        formMethod: e,
        formAction: r,
        formEncType: n,
        formData: void 0,
        json: o,
        text: void 0
      };
  }
}
function gr(t, e) {
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
function Ys(t, e) {
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
function _t(t, e) {
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
function Js(t, e) {
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
function qe(t) {
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
function Xs(t, e) {
  try {
    let r = t.sessionStorage.getItem(Xn);
    if (r) {
      let n = JSON.parse(r);
      for (let [i, s] of Object.entries(n || {}))
        s && Array.isArray(s) && e.set(i, new Set(s || []));
    }
  } catch {
  }
}
function Gs(t, e) {
  if (e.size > 0) {
    let r = {};
    for (let [n, i] of e)
      r[n] = [...i];
    try {
      t.sessionStorage.setItem(Xn, JSON.stringify(r));
    } catch (n) {
      dt(!1, "Failed to save applied view transitions in sessionStorage (" + n + ").");
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
function Zt() {
  return Zt = Object.assign ? Object.assign.bind() : function(t) {
    for (var e = 1; e < arguments.length; e++) {
      var r = arguments[e];
      for (var n in r)
        Object.prototype.hasOwnProperty.call(r, n) && (t[n] = r[n]);
    }
    return t;
  }, Zt.apply(this, arguments);
}
const nr = /* @__PURE__ */ R.createContext(null), ti = /* @__PURE__ */ R.createContext(null), it = /* @__PURE__ */ R.createContext(null), Ir = /* @__PURE__ */ R.createContext(null), Oe = /* @__PURE__ */ R.createContext({
  outlet: null,
  matches: [],
  isDataRoute: !1
}), ri = /* @__PURE__ */ R.createContext(null);
function Qs(t, e) {
  let {
    relative: r
  } = e === void 0 ? {} : e;
  Pt() || V(!1);
  let {
    basename: n,
    navigator: i
  } = R.useContext(it), {
    hash: s,
    pathname: o,
    search: l
  } = oi(t, {
    relative: r
  }), a = o;
  return n !== "/" && (a = o === "/" ? n : Ae([n, o])), i.createHref({
    pathname: a,
    search: l,
    hash: s
  });
}
function Pt() {
  return R.useContext(Ir) != null;
}
function At() {
  return Pt() || V(!1), R.useContext(Ir).location;
}
function ni(t) {
  R.useContext(it).static || R.useLayoutEffect(t);
}
function ii() {
  let {
    isDataRoute: t
  } = R.useContext(Oe);
  return t ? ho() : Zs();
}
function Zs() {
  Pt() || V(!1);
  let t = R.useContext(nr), {
    basename: e,
    future: r,
    navigator: n
  } = R.useContext(it), {
    matches: i
  } = R.useContext(Oe), {
    pathname: s
  } = At(), o = JSON.stringify(Pr(i, r.v7_relativeSplatPath)), l = R.useRef(!1);
  return ni(() => {
    l.current = !0;
  }), R.useCallback(function(m, p) {
    if (p === void 0 && (p = {}), !l.current) return;
    if (typeof m == "number") {
      n.go(m);
      return;
    }
    let u = Ar(m, JSON.parse(o), s, p.relative === "path");
    t == null && e !== "/" && (u.pathname = u.pathname === "/" ? e : Ae([e, u.pathname])), (p.replace ? n.replace : n.push)(u, p.state, p);
  }, [e, n, o, s, t]);
}
const eo = /* @__PURE__ */ R.createContext(null);
function to(t) {
  let e = R.useContext(Oe).outlet;
  return e && /* @__PURE__ */ R.createElement(eo.Provider, {
    value: t
  }, e);
}
function si() {
  let {
    matches: t
  } = R.useContext(Oe), e = t[t.length - 1];
  return e ? e.params : {};
}
function oi(t, e) {
  let {
    relative: r
  } = e === void 0 ? {} : e, {
    future: n
  } = R.useContext(it), {
    matches: i
  } = R.useContext(Oe), {
    pathname: s
  } = At(), o = JSON.stringify(Pr(i, n.v7_relativeSplatPath));
  return R.useMemo(() => Ar(t, JSON.parse(o), s, r === "path"), [t, o, s, r]);
}
function ro(t, e, r, n) {
  Pt() || V(!1);
  let {
    navigator: i
  } = R.useContext(it), {
    matches: s
  } = R.useContext(Oe), o = s[s.length - 1], l = o ? o.params : {};
  o && o.pathname;
  let a = o ? o.pathnameBase : "/";
  o && o.route;
  let m = At(), p;
  p = m;
  let u = p.pathname || "/", y = u;
  if (a !== "/") {
    let x = a.replace(/^\//, "").split("/");
    y = "/" + u.replace(/^\//, "").split("/").slice(x.length).join("/");
  }
  let h = Qe(t, {
    pathname: y
  });
  return ao(h && h.map((x) => Object.assign({}, x, {
    params: Object.assign({}, l, x.params),
    pathname: Ae([
      a,
      // Re-encode pathnames that were decoded inside matchRoutes
      i.encodeLocation ? i.encodeLocation(x.pathname).pathname : x.pathname
    ]),
    pathnameBase: x.pathnameBase === "/" ? a : Ae([
      a,
      // Re-encode pathnames that were decoded inside matchRoutes
      i.encodeLocation ? i.encodeLocation(x.pathnameBase).pathname : x.pathnameBase
    ])
  })), s, r, n);
}
function no() {
  let t = fo(), e = Mt(t) ? t.status + " " + t.statusText : t instanceof Error ? t.message : JSON.stringify(t), r = t instanceof Error ? t.stack : null, i = {
    padding: "0.5rem",
    backgroundColor: "rgba(200,200,200, 0.5)"
  };
  return /* @__PURE__ */ R.createElement(R.Fragment, null, /* @__PURE__ */ R.createElement("h2", null, "Unexpected Application Error!"), /* @__PURE__ */ R.createElement("h3", {
    style: {
      fontStyle: "italic"
    }
  }, e), r ? /* @__PURE__ */ R.createElement("pre", {
    style: i
  }, r) : null, null);
}
const io = /* @__PURE__ */ R.createElement(no, null);
class so extends R.Component {
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
    return this.state.error !== void 0 ? /* @__PURE__ */ R.createElement(Oe.Provider, {
      value: this.props.routeContext
    }, /* @__PURE__ */ R.createElement(ri.Provider, {
      value: this.state.error,
      children: this.props.component
    })) : this.props.children;
  }
}
function oo(t) {
  let {
    routeContext: e,
    match: r,
    children: n
  } = t, i = R.useContext(nr);
  return i && i.static && i.staticContext && (r.route.errorElement || r.route.ErrorBoundary) && (i.staticContext._deepestRenderedBoundaryId = r.route.id), /* @__PURE__ */ R.createElement(Oe.Provider, {
    value: e
  }, n);
}
function ao(t, e, r, n) {
  var i;
  if (e === void 0 && (e = []), r === void 0 && (r = null), n === void 0 && (n = null), t == null) {
    var s;
    if (!r)
      return null;
    if (r.errors)
      t = r.matches;
    else if ((s = n) != null && s.v7_partialHydration && e.length === 0 && !r.initialized && r.matches.length > 0)
      t = r.matches;
    else
      return null;
  }
  let o = t, l = (i = r) == null ? void 0 : i.errors;
  if (l != null) {
    let p = o.findIndex((u) => u.route.id && (l == null ? void 0 : l[u.route.id]) !== void 0);
    p >= 0 || V(!1), o = o.slice(0, Math.min(o.length, p + 1));
  }
  let a = !1, m = -1;
  if (r && n && n.v7_partialHydration)
    for (let p = 0; p < o.length; p++) {
      let u = o[p];
      if ((u.route.HydrateFallback || u.route.hydrateFallbackElement) && (m = p), u.route.id) {
        let {
          loaderData: y,
          errors: h
        } = r, w = u.route.loader && y[u.route.id] === void 0 && (!h || h[u.route.id] === void 0);
        if (u.route.lazy || w) {
          a = !0, m >= 0 ? o = o.slice(0, m + 1) : o = [o[0]];
          break;
        }
      }
    }
  return o.reduceRight((p, u, y) => {
    let h, w = !1, x = null, C = null;
    r && (h = l && u.route.id ? l[u.route.id] : void 0, x = u.route.errorElement || io, a && (m < 0 && y === 0 ? (po("route-fallback"), w = !0, C = null) : m === y && (w = !0, C = u.route.hydrateFallbackElement || null)));
    let S = e.concat(o.slice(0, y + 1)), b = () => {
      let k;
      return h ? k = x : w ? k = C : u.route.Component ? k = /* @__PURE__ */ R.createElement(u.route.Component, null) : u.route.element ? k = u.route.element : k = p, /* @__PURE__ */ R.createElement(oo, {
        match: u,
        routeContext: {
          outlet: p,
          matches: S,
          isDataRoute: r != null
        },
        children: k
      });
    };
    return r && (u.route.ErrorBoundary || u.route.errorElement || y === 0) ? /* @__PURE__ */ R.createElement(so, {
      location: r.location,
      revalidation: r.revalidation,
      component: x,
      error: h,
      children: b(),
      routeContext: {
        outlet: null,
        matches: S,
        isDataRoute: !0
      }
    }) : b();
  }, null);
}
var ai = /* @__PURE__ */ function(t) {
  return t.UseBlocker = "useBlocker", t.UseRevalidator = "useRevalidator", t.UseNavigateStable = "useNavigate", t;
}(ai || {}), li = /* @__PURE__ */ function(t) {
  return t.UseBlocker = "useBlocker", t.UseLoaderData = "useLoaderData", t.UseActionData = "useActionData", t.UseRouteError = "useRouteError", t.UseNavigation = "useNavigation", t.UseRouteLoaderData = "useRouteLoaderData", t.UseMatches = "useMatches", t.UseRevalidator = "useRevalidator", t.UseNavigateStable = "useNavigate", t.UseRouteId = "useRouteId", t;
}(li || {});
function lo(t) {
  let e = R.useContext(nr);
  return e || V(!1), e;
}
function co(t) {
  let e = R.useContext(ti);
  return e || V(!1), e;
}
function uo(t) {
  let e = R.useContext(Oe);
  return e || V(!1), e;
}
function ci(t) {
  let e = uo(), r = e.matches[e.matches.length - 1];
  return r.route.id || V(!1), r.route.id;
}
function fo() {
  var t;
  let e = R.useContext(ri), r = co(), n = ci();
  return e !== void 0 ? e : (t = r.errors) == null ? void 0 : t[n];
}
function ho() {
  let {
    router: t
  } = lo(ai.UseNavigateStable), e = ci(li.UseNavigateStable), r = R.useRef(!1);
  return ni(() => {
    r.current = !0;
  }), R.useCallback(function(i, s) {
    s === void 0 && (s = {}), r.current && (typeof i == "number" ? t.navigate(i) : t.navigate(i, Zt({
      fromRouteId: e
    }, s)));
  }, [t, e]);
}
const _n = {};
function po(t, e, r) {
  _n[t] || (_n[t] = !0);
}
function mo(t, e) {
  t == null || t.v7_startTransition, (t == null ? void 0 : t.v7_relativeSplatPath) === void 0 && (!e || e.v7_relativeSplatPath), e && (e.v7_fetcherPersist, e.v7_normalizeFormMethod, e.v7_partialHydration, e.v7_skipActionErrorRevalidation);
}
function go(t) {
  return to(t.context);
}
function yo(t) {
  let {
    basename: e = "/",
    children: r = null,
    location: n,
    navigationType: i = ie.Pop,
    navigator: s,
    static: o = !1,
    future: l
  } = t;
  Pt() && V(!1);
  let a = e.replace(/^\/*/, "/"), m = R.useMemo(() => ({
    basename: a,
    navigator: s,
    static: o,
    future: Zt({
      v7_relativeSplatPath: !1
    }, l)
  }), [a, l, s, o]);
  typeof n == "string" && (n = We(n));
  let {
    pathname: p = "/",
    search: u = "",
    hash: y = "",
    state: h = null,
    key: w = "default"
  } = n, x = R.useMemo(() => {
    let C = ht(p, a);
    return C == null ? null : {
      location: {
        pathname: C,
        search: u,
        hash: y,
        state: h,
        key: w
      },
      navigationType: i
    };
  }, [a, p, u, y, h, w, i]);
  return x == null ? null : /* @__PURE__ */ R.createElement(it.Provider, {
    value: m
  }, /* @__PURE__ */ R.createElement(Ir.Provider, {
    children: r,
    value: x
  }));
}
new Promise(() => {
});
function vo(t) {
  let e = {
    // Note: this check also occurs in createRoutesFromChildren so update
    // there if you change this -- please and thank you!
    hasErrorBoundary: t.ErrorBoundary != null || t.errorElement != null
  };
  return t.Component && Object.assign(e, {
    element: /* @__PURE__ */ R.createElement(t.Component),
    Component: void 0
  }), t.HydrateFallback && Object.assign(e, {
    hydrateFallbackElement: /* @__PURE__ */ R.createElement(t.HydrateFallback),
    HydrateFallback: void 0
  }), t.ErrorBoundary && Object.assign(e, {
    errorElement: /* @__PURE__ */ R.createElement(t.ErrorBoundary),
    ErrorBoundary: void 0
  }), e;
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
function Nt() {
  return Nt = Object.assign ? Object.assign.bind() : function(t) {
    for (var e = 1; e < arguments.length; e++) {
      var r = arguments[e];
      for (var n in r)
        Object.prototype.hasOwnProperty.call(r, n) && (t[n] = r[n]);
    }
    return t;
  }, Nt.apply(this, arguments);
}
function bo(t, e) {
  if (t == null) return {};
  var r = {}, n = Object.keys(t), i, s;
  for (s = 0; s < n.length; s++)
    i = n[s], !(e.indexOf(i) >= 0) && (r[i] = t[i]);
  return r;
}
function xo(t) {
  return !!(t.metaKey || t.altKey || t.ctrlKey || t.shiftKey);
}
function wo(t, e) {
  return t.button === 0 && // Ignore everything but left clicks
  (!e || e === "_self") && // Let browser handle "target=_blank" etc.
  !xo(t);
}
const _o = ["onClick", "relative", "reloadDocument", "replace", "state", "target", "to", "preventScrollReset", "viewTransition"], Eo = "6";
try {
  window.__reactRouterVersion = Eo;
} catch {
}
function So(t, e) {
  return Ps({
    basename: e == null ? void 0 : e.basename,
    future: Nt({}, e == null ? void 0 : e.future, {
      v7_prependBasename: !0
    }),
    history: rs({
      window: e == null ? void 0 : e.window
    }),
    hydrationData: (e == null ? void 0 : e.hydrationData) || Ro(),
    routes: t,
    mapRouteProperties: vo,
    dataStrategy: e == null ? void 0 : e.dataStrategy,
    patchRoutesOnNavigation: e == null ? void 0 : e.patchRoutesOnNavigation,
    window: e == null ? void 0 : e.window
  }).initialize();
}
function Ro() {
  var t;
  let e = (t = window) == null ? void 0 : t.__staticRouterHydrationData;
  return e && e.errors && (e = Nt({}, e, {
    errors: Co(e.errors)
  })), e;
}
function Co(t) {
  if (!t) return null;
  let e = Object.entries(t), r = {};
  for (let [n, i] of e)
    if (i && i.__type === "RouteErrorResponse")
      r[n] = new Qt(i.status, i.statusText, i.data, i.internal === !0);
    else if (i && i.__type === "Error") {
      if (i.__subType) {
        let s = window[i.__subType];
        if (typeof s == "function")
          try {
            let o = new s(i.message);
            o.stack = "", r[n] = o;
          } catch {
          }
      }
      if (r[n] == null) {
        let s = new Error(i.message);
        s.stack = "", r[n] = s;
      }
    } else
      r[n] = i;
  return r;
}
const To = /* @__PURE__ */ R.createContext({
  isTransitioning: !1
}), ko = /* @__PURE__ */ R.createContext(/* @__PURE__ */ new Map()), Mo = "startTransition", En = R[Mo], No = "flushSync", Sn = ts[No];
function Lo(t) {
  En ? En(t) : t();
}
function Et(t) {
  Sn ? Sn(t) : t();
}
class Po {
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
function Ao(t) {
  let {
    fallbackElement: e,
    router: r,
    future: n
  } = t, [i, s] = R.useState(r.state), [o, l] = R.useState(), [a, m] = R.useState({
    isTransitioning: !1
  }), [p, u] = R.useState(), [y, h] = R.useState(), [w, x] = R.useState(), C = R.useRef(/* @__PURE__ */ new Map()), {
    v7_startTransition: S
  } = n || {}, b = R.useCallback((M) => {
    S ? Lo(M) : M();
  }, [S]), k = R.useCallback((M, F) => {
    let {
      deletedFetchers: D,
      flushSync: U,
      viewTransitionOpts: z
    } = F;
    M.fetchers.forEach((le, oe) => {
      le.data !== void 0 && C.current.set(oe, le.data);
    }), D.forEach((le) => C.current.delete(le));
    let ae = r.window == null || r.window.document == null || typeof r.window.document.startViewTransition != "function";
    if (!z || ae) {
      U ? Et(() => s(M)) : b(() => s(M));
      return;
    }
    if (U) {
      Et(() => {
        y && (p && p.resolve(), y.skipTransition()), m({
          isTransitioning: !0,
          flushSync: !0,
          currentLocation: z.currentLocation,
          nextLocation: z.nextLocation
        });
      });
      let le = r.window.document.startViewTransition(() => {
        Et(() => s(M));
      });
      le.finished.finally(() => {
        Et(() => {
          u(void 0), h(void 0), l(void 0), m({
            isTransitioning: !1
          });
        });
      }), Et(() => h(le));
      return;
    }
    y ? (p && p.resolve(), y.skipTransition(), x({
      state: M,
      currentLocation: z.currentLocation,
      nextLocation: z.nextLocation
    })) : (l(M), m({
      isTransitioning: !0,
      flushSync: !1,
      currentLocation: z.currentLocation,
      nextLocation: z.nextLocation
    }));
  }, [r.window, y, p, C, b]);
  R.useLayoutEffect(() => r.subscribe(k), [r, k]), R.useEffect(() => {
    a.isTransitioning && !a.flushSync && u(new Po());
  }, [a]), R.useEffect(() => {
    if (p && o && r.window) {
      let M = o, F = p.promise, D = r.window.document.startViewTransition(async () => {
        b(() => s(M)), await F;
      });
      D.finished.finally(() => {
        u(void 0), h(void 0), l(void 0), m({
          isTransitioning: !1
        });
      }), h(D);
    }
  }, [b, o, p, r.window]), R.useEffect(() => {
    p && o && i.location.key === o.location.key && p.resolve();
  }, [p, y, i.location, o]), R.useEffect(() => {
    !a.isTransitioning && w && (l(w.state), m({
      isTransitioning: !0,
      flushSync: !1,
      currentLocation: w.currentLocation,
      nextLocation: w.nextLocation
    }), x(void 0));
  }, [a.isTransitioning, w]), R.useEffect(() => {
  }, []);
  let E = R.useMemo(() => ({
    createHref: r.createHref,
    encodeLocation: r.encodeLocation,
    go: (M) => r.navigate(M),
    push: (M, F, D) => r.navigate(M, {
      state: F,
      preventScrollReset: D == null ? void 0 : D.preventScrollReset
    }),
    replace: (M, F, D) => r.navigate(M, {
      replace: !0,
      state: F,
      preventScrollReset: D == null ? void 0 : D.preventScrollReset
    })
  }), [r]), N = r.basename || "/", I = R.useMemo(() => ({
    router: r,
    navigator: E,
    static: !1,
    basename: N
  }), [r, E, N]), d = R.useMemo(() => ({
    v7_relativeSplatPath: r.future.v7_relativeSplatPath
  }), [r.future.v7_relativeSplatPath]);
  return R.useEffect(() => mo(n, r.future), [n, r.future]), /* @__PURE__ */ R.createElement(R.Fragment, null, /* @__PURE__ */ R.createElement(nr.Provider, {
    value: I
  }, /* @__PURE__ */ R.createElement(ti.Provider, {
    value: i
  }, /* @__PURE__ */ R.createElement(ko.Provider, {
    value: C.current
  }, /* @__PURE__ */ R.createElement(To.Provider, {
    value: a
  }, /* @__PURE__ */ R.createElement(yo, {
    basename: N,
    location: i.location,
    navigationType: i.historyAction,
    navigator: E,
    future: d
  }, i.initialized || r.future.v7_partialHydration ? /* @__PURE__ */ R.createElement(Oo, {
    routes: r.routes,
    future: r.future,
    state: i
  }) : e))))), null);
}
const Oo = /* @__PURE__ */ R.memo(jo);
function jo(t) {
  let {
    routes: e,
    future: r,
    state: n
  } = t;
  return ro(e, void 0, n, r);
}
const Do = typeof window < "u" && typeof window.document < "u" && typeof window.document.createElement < "u", Io = /^(?:[a-z][a-z0-9+.-]*:|\/\/)/i, ui = /* @__PURE__ */ R.forwardRef(function(e, r) {
  let {
    onClick: n,
    relative: i,
    reloadDocument: s,
    replace: o,
    state: l,
    target: a,
    to: m,
    preventScrollReset: p,
    viewTransition: u
  } = e, y = bo(e, _o), {
    basename: h
  } = R.useContext(it), w, x = !1;
  if (typeof m == "string" && Io.test(m) && (w = m, Do))
    try {
      let k = new URL(window.location.href), E = m.startsWith("//") ? new URL(k.protocol + m) : new URL(m), N = ht(E.pathname, h);
      E.origin === k.origin && N != null ? m = N + E.search + E.hash : x = !0;
    } catch {
    }
  let C = Qs(m, {
    relative: i
  }), S = Bo(m, {
    replace: o,
    state: l,
    target: a,
    preventScrollReset: p,
    relative: i,
    viewTransition: u
  });
  function b(k) {
    n && n(k), k.defaultPrevented || S(k);
  }
  return (
    // eslint-disable-next-line jsx-a11y/anchor-has-content
    /* @__PURE__ */ R.createElement("a", Nt({}, y, {
      href: w || C,
      onClick: x || s ? n : b,
      ref: r,
      target: a
    }))
  );
});
var Rn;
(function(t) {
  t.UseScrollRestoration = "useScrollRestoration", t.UseSubmit = "useSubmit", t.UseSubmitFetcher = "useSubmitFetcher", t.UseFetcher = "useFetcher", t.useViewTransitionState = "useViewTransitionState";
})(Rn || (Rn = {}));
var Cn;
(function(t) {
  t.UseFetcher = "useFetcher", t.UseFetchers = "useFetchers", t.UseScrollRestoration = "useScrollRestoration";
})(Cn || (Cn = {}));
function Bo(t, e) {
  let {
    target: r,
    replace: n,
    state: i,
    preventScrollReset: s,
    relative: o,
    viewTransition: l
  } = e === void 0 ? {} : e, a = ii(), m = At(), p = oi(t, {
    relative: o
  });
  return R.useCallback((u) => {
    if (wo(u, r)) {
      u.preventDefault();
      let y = n !== void 0 ? n : nt(m) === nt(p);
      a(t, {
        replace: y,
        state: i,
        preventScrollReset: s,
        relative: o,
        viewTransition: l
      });
    }
  }, [m, a, p, n, i, r, t, s, o, l]);
}
const Uo = {}, Tn = (t) => {
  let e;
  const r = /* @__PURE__ */ new Set(), n = (p, u) => {
    const y = typeof p == "function" ? p(e) : p;
    if (!Object.is(y, e)) {
      const h = e;
      e = u ?? (typeof y != "object" || y === null) ? y : Object.assign({}, e, y), r.forEach((w) => w(e, h));
    }
  }, i = () => e, a = { setState: n, getState: i, getInitialState: () => m, subscribe: (p) => (r.add(p), () => r.delete(p)), destroy: () => {
    (Uo ? "production" : void 0) !== "production" && console.warn(
      "[DEPRECATED] The `destroy` method will be unsupported in a future version. Instead use unsubscribe function returned by subscribe. Everything will be garbage-collected if store is garbage-collected."
    ), r.clear();
  } }, m = e = t(n, i, a);
  return a;
}, Fo = (t) => t ? Tn(t) : Tn;
var di = { exports: {} }, fi = {}, hi = { exports: {} }, pi = {};
/**
 * @license React
 * use-sync-external-store-shim.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var ft = Lt;
function zo(t, e) {
  return t === e && (t !== 0 || 1 / t === 1 / e) || t !== t && e !== e;
}
var $o = typeof Object.is == "function" ? Object.is : zo, qo = ft.useState, Vo = ft.useEffect, Ho = ft.useLayoutEffect, Wo = ft.useDebugValue;
function Ko(t, e) {
  var r = e(), n = qo({ inst: { value: r, getSnapshot: e } }), i = n[0].inst, s = n[1];
  return Ho(
    function() {
      i.value = r, i.getSnapshot = e, yr(i) && s({ inst: i });
    },
    [t, r, e]
  ), Vo(
    function() {
      return yr(i) && s({ inst: i }), t(function() {
        yr(i) && s({ inst: i });
      });
    },
    [t]
  ), Wo(r), r;
}
function yr(t) {
  var e = t.getSnapshot;
  t = t.value;
  try {
    var r = e();
    return !$o(t, r);
  } catch {
    return !0;
  }
}
function Yo(t, e) {
  return e();
}
var Jo = typeof window > "u" || typeof window.document > "u" || typeof window.document.createElement > "u" ? Yo : Ko;
pi.useSyncExternalStore = ft.useSyncExternalStore !== void 0 ? ft.useSyncExternalStore : Jo;
hi.exports = pi;
var Xo = hi.exports;
/**
 * @license React
 * use-sync-external-store-shim/with-selector.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var ir = Lt, Go = Xo;
function Qo(t, e) {
  return t === e && (t !== 0 || 1 / t === 1 / e) || t !== t && e !== e;
}
var Zo = typeof Object.is == "function" ? Object.is : Qo, ea = Go.useSyncExternalStore, ta = ir.useRef, ra = ir.useEffect, na = ir.useMemo, ia = ir.useDebugValue;
fi.useSyncExternalStoreWithSelector = function(t, e, r, n, i) {
  var s = ta(null);
  if (s.current === null) {
    var o = { hasValue: !1, value: null };
    s.current = o;
  } else o = s.current;
  s = na(
    function() {
      function a(h) {
        if (!m) {
          if (m = !0, p = h, h = n(h), i !== void 0 && o.hasValue) {
            var w = o.value;
            if (i(w, h))
              return u = w;
          }
          return u = h;
        }
        if (w = u, Zo(p, h)) return w;
        var x = n(h);
        return i !== void 0 && i(w, x) ? (p = h, w) : (p = h, u = x);
      }
      var m = !1, p, u, y = r === void 0 ? null : r;
      return [
        function() {
          return a(e());
        },
        y === null ? void 0 : function() {
          return a(y());
        }
      ];
    },
    [e, r, n, i]
  );
  var l = ea(t, s[0], s[1]);
  return ra(
    function() {
      o.hasValue = !0, o.value = l;
    },
    [l]
  ), ia(l), l;
};
di.exports = fi;
var sa = di.exports;
const oa = /* @__PURE__ */ Un(sa), mi = {}, { useDebugValue: aa } = Lt, { useSyncExternalStoreWithSelector: la } = oa;
let kn = !1;
const ca = (t) => t;
function ua(t, e = ca, r) {
  (mi ? "production" : void 0) !== "production" && r && !kn && (console.warn(
    "[DEPRECATED] Use `createWithEqualityFn` instead of `create` or use `useStoreWithEqualityFn` instead of `useStore`. They can be imported from 'zustand/traditional'. https://github.com/pmndrs/zustand/discussions/1937"
  ), kn = !0);
  const n = la(
    t.subscribe,
    t.getState,
    t.getServerState || t.getInitialState,
    e,
    r
  );
  return aa(n), n;
}
const Mn = (t) => {
  (mi ? "production" : void 0) !== "production" && typeof t != "function" && console.warn(
    "[DEPRECATED] Passing a vanilla store will be unsupported in a future version. Instead use `import { useStore } from 'zustand'`."
  );
  const e = typeof t == "function" ? Fo(t) : t, r = (n, i) => ua(e, n, i);
  return Object.assign(r, e), r;
}, da = (t) => t ? Mn(t) : Mn, ct = [
  "frieren",
  "himmel",
  "heiter",
  "eisen",
  "fern",
  "stark",
  "sein",
  "übel"
], fa = {
  frieren: "#7f7c84",
  himmel: "#bddaf9",
  heiter: "#78855e",
  eisen: "#cfccc0",
  fern: "#794983",
  stark: "#af4a33",
  sein: "#936f42",
  übel: "#667240"
};
function Br(t) {
  return `/media/sprites/square_${t}.png`;
}
const q = da((t, e) => ({
  ready: !1,
  name: "",
  sprite: null,
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
    for (const i of ct)
      if (!n.has(i))
        return { name: i, sprite: i };
    return { name: ct[0], sprite: ct[0] };
  }),
  ensureMe: (r) => t((n) => ({ me: { ...n.me, clientId: r } })),
  applySnapshot: (r) => t((n) => {
    const i = { ...n.roster };
    if (r.users)
      for (const s of r.users) i[s.clientId] = s;
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
  addRttSample: (r, n, i) => t((s) => {
    const o = [...s.drift.rtts, r].slice(-5);
    let l = s.drift.offsetMs;
    if (n && i) {
      const a = i + r / 2;
      l = n - a;
    }
    return { drift: { rtts: o, offsetMs: l } };
  }),
  pushToast: (r, n) => t((i) => ({ toasts: [...i.toasts, { id: Math.random().toString(36).slice(2), kind: r, msg: n, ts: Date.now() }].slice(-5) })),
  popToast: (r) => t((n) => ({ toasts: n.toasts.filter((i) => i.id !== r) })),
  setReadiness: (r) => t({ readiness: { mediaId: r.mediaId, ready: r.ready, readyCount: r.readyCount, total: r.total } })
}));
function ha() {
  const t = q((r) => r.toasts), e = q((r) => r.popToast);
  return ue(() => {
    const r = t.map((n) => setTimeout(() => e(n.id), 4e3));
    return () => {
      r.forEach(clearTimeout);
    };
  }, [t, e]), /* @__PURE__ */ g.jsx("div", { className: "fixed bottom-4 left-1/2 -translate-x-1/2 flex flex-col gap-2 z-50", children: t.map((r) => /* @__PURE__ */ g.jsx("div", { className: `px-3 py-2 rounded text-sm shadow font-medium bg-slate-800 border ${r.kind === "error" ? "border-red-500 text-red-300" : "border-slate-600 text-slate-200"}`, children: r.msg }, r.id)) });
}
const pa = 400;
function sr() {
  const t = Ce(null), e = Ce([]);
  return ue(() => {
    const r = t.current;
    if (!r) return;
    const n = r.getContext("2d");
    if (!n) return;
    const i = () => {
      r.width = window.innerWidth, r.height = window.innerHeight;
    };
    i(), window.addEventListener("resize", i);
    let s = 0;
    function o(h) {
      return h < 300 ? { scale: 0.5, demote: 0.5 } : h < 400 ? { scale: 0.6, demote: 0.4 } : h < 500 ? { scale: 0.7, demote: 0.3 } : h < 600 ? { scale: 0.8, demote: 0.2 } : h < 700 ? { scale: 0.9, demote: 0.1 } : { scale: 1, demote: 0 };
    }
    function l(h, w, x = !1, C) {
      let S = Math.random();
      const b = C ?? s;
      C === void 0 && s++;
      const k = x ? o(b) : { scale: 1, demote: 0 };
      let E = S > 0.998, N = !E && S > 0.98;
      k.demote > 0 && (E && Math.random() < k.demote && (E = !1), N && Math.random() < k.demote && (N = !1)), x && (E = !1, N = !1);
      const I = N;
      let d;
      E ? d = 0.92 + Math.random() * 0.08 : N ? d = 0.85 + Math.random() * 0.15 : d = 0.05 + Math.random() ** 2.2 * 0.75;
      const M = (jt, Ne) => {
        const lr = Math.random(), cr = Math.random();
        return jt + (lr + cr) / 2 * (Ne - jt);
      };
      let F = M(0.9, 1.4) + d ** 1.2 * (E ? 5.5 : N ? 4 : 3.2);
      const D = M(0.85, 1.25);
      let U = F * D;
      x && k.scale < 1 && (U *= k.scale);
      let z;
      E ? z = 1.05 + Math.random() * 0.5 : N ? (z = 0.55 + d ** 1.05 * 0.7 + Math.random() * 0.25, z > 1.25 && (z = 1.25)) : (z = 0.15 + d ** 1.05 * 0.6 + Math.random() * 0.15, z > 1.05 && (z = 1.05)), !E && z < 0.15 && (z = 0.15);
      const ae = 0.035 + M(0, 0.08), le = d ** 1.45 * (E ? 4.9 : N ? 1.55 : 1.25);
      let oe = ae + le * M(0.85, 1.3);
      x && k.scale < 1 && (oe *= k.scale);
      const je = Math.min(1, z), we = Math.min(1, (U - 1) / 4.5);
      oe *= 1 + 0.18 * Math.max(je, we), E && oe < 1.25 && (oe = 1.25 + Math.random() * 0.4);
      const re = r.width, Ke = r.height, De = 0.18 + Math.random() * 0.28, Ie = E || Math.random() < 0.18, he = E ? 0.55 : I ? 0.38 : Math.max(0.1, 0.28 - De * 0.25), ke = z * (he + Math.random() * (1 - he)), Ye = z * (he + Math.random() * (1 - he)), ve = (E ? 130 : I ? 160 : 120) + Math.random() * (E ? 140 : 150), Se = Math.min(1, oe / 2.5), Ue = 10, Ot = 120 - Ue;
      let Je = Math.random();
      const de = 0.8 + Se * 1.4;
      Je = Math.pow(Je, de);
      const Me = (1 - Se) * ((40 - Ue) / Ot);
      Je = Je * (1 - Me) + Me;
      const gt = (Ue + Je * Ot) * 1e3;
      return {
        x: h ?? Math.random() * re,
        y: w ?? (x ? Math.random() * Ke : -Math.random() * Ke),
        z: d,
        speed: oe,
        size: U,
        alpha: z,
        colorRare: I,
        colorPhase: Math.random() * Math.PI * 2,
        colorSpeed: 0.01 + Math.random() * 0.02,
        colorMode: Math.random() < 0.5 ? 0 : 1,
        twinkleAmount: De,
        twinkleEnabled: Ie,
        dimFloor: he,
        twinkleStart: ke,
        twinkleTarget: Ye,
        twinkleT: 0,
        twinkleDuration: ve,
        microPhase: Math.random() * Math.PI * 2,
        microSpeed: (E ? 0.18 : 0.1) + Math.random() * 0.05,
        ultraRare: E,
        trail: E ? [] : void 0,
        currentAlpha: ke,
        lifeMsRemaining: gt,
        lifeMsTotal: gt
      };
    }
    if (!e.current.length)
      for (let h = 0; h < pa; h++) e.current.push(l(void 0, void 0, !0, h));
    let a = performance.now();
    function m(h, w, x, C) {
      const k = (0.15 + 0.75 * Math.min(1, C / 2)) * x, E = x, N = x, I = Math.min(k, N * 0.95, E * 0.48), d = h, M = w, F = h + E, D = w + N, U = n;
      U.beginPath(), U.moveTo(d, M), U.lineTo(F, M), U.lineTo(F, D - I), U.quadraticCurveTo(F, D, F - I, D), U.lineTo(d + I, D), U.quadraticCurveTo(d, D, d, D - I), U.lineTo(d, M), U.closePath(), U.fill();
    }
    function p(h, w) {
      if (w > 3 && (w = 3), !h.twinkleEnabled) {
        h.currentAlpha = h.alpha;
        return;
      }
      if (h.twinkleT += w, h.twinkleT >= h.twinkleDuration) {
        h.twinkleStart = h.twinkleTarget, h.twinkleTarget = h.alpha * (h.dimFloor + Math.random() * (1 - h.dimFloor));
        const b = h.ultraRare ? 150 : h.colorRare ? 140 : 110, k = h.ultraRare ? 170 : 140;
        h.twinkleDuration = b + Math.random() * k, h.twinkleT = 0;
      }
      const x = Math.min(1, h.twinkleT / h.twinkleDuration), C = x * x * (3 - 2 * x);
      let S = h.twinkleStart + (h.twinkleTarget - h.twinkleStart) * C;
      if (h.microPhase += h.microSpeed * w, h.ultraRare) {
        const b = Math.sin(h.microPhase) * 0.04;
        S = Math.min(1, Math.max(h.alpha * h.dimFloor, S * (1 + b)));
      }
      h.currentAlpha = S;
    }
    function u(h, w) {
      if (h.ultraRare) {
        h.colorPhase += h.colorSpeed * 2.2 * w;
        const x = [
          [255, 120, 220],
          // pink
          [120, 255, 170],
          // green
          [255, 255, 255]
          // white
        ], C = h.colorPhase % x.length, S = Math.floor(C), b = (S + 1) % x.length, k = C - S, E = x[S], N = x[b], I = Math.round(E[0] + (N[0] - E[0]) * k), d = Math.round(E[1] + (N[1] - E[1]) * k), M = Math.round(E[2] + (N[2] - E[2]) * k);
        return `rgb(${I},${d},${M})`;
      }
      if (h.colorRare) {
        h.colorPhase += h.colorSpeed * w;
        const x = (Math.sin(h.colorPhase) + 1) / 2;
        if (h.colorMode === 0) {
          const C = Math.round(255 - 165 * x), S = Math.round(255 - 105 * x);
          return `rgb(${C},${S},255)`;
        } else {
          const S = Math.round(255 - 175 * x), b = Math.round(255 - 175 * x);
          return `rgb(255,${S},${b})`;
        }
      }
      return "#ffffff";
    }
    const y = () => {
      const h = performance.now(), w = h - a, x = w / 16.666;
      a = h, n.clearRect(0, 0, r.width, r.height), r.width, r.height;
      const C = 220;
      for (let S = 0; S < e.current.length; S++) {
        const b = e.current[S];
        if (b.ultraRare) {
          if (b.trail || (b.trail = []), !b.maxTrail) {
            const F = b.speed * 14, D = Math.min(1, b.speed / 1.9), U = F * (1 + 8 * D);
            b.maxTrail = Math.min(300, Math.floor(U));
          }
          b.trail.push({ x: b.x + b.size / 2, y: b.y + b.size / 2 }), b.trail.length > b.maxTrail && b.trail.splice(0, b.trail.length - b.maxTrail);
        }
        if (b.lifeMsRemaining -= w, b.lifeMsRemaining <= 0) {
          const M = l(Math.random() * r.width, void 0, !1);
          M.y = -M.size - 1, e.current[S] = M;
          continue;
        }
        if (b.y += b.speed * x, b.y - b.size > r.height + C) {
          e.current[S] = l(Math.random() * r.width, -b.size - 1);
          continue;
        }
        p(b, x);
        const k = b.currentAlpha ?? b.alpha, E = 1500, N = b.lifeMsRemaining < E ? Math.max(0, b.lifeMsRemaining / E) : 1, I = k * N;
        let d = u(b, x);
        if (b.ultraRare) {
          const M = I;
          if (b.trail && b.trail.length) {
            const U = b.trail.length;
            for (let z = 0; z < U; z++) {
              const ae = b.trail[U - 1 - z], le = 1 - z / U, oe = Math.pow(le, 3);
              n.globalAlpha = Math.min(1, M) * oe * 0.6;
              const je = 0.35 + 0.65 * oe;
              n.fillStyle = d;
              const we = b.size * je;
              n.fillRect(ae.x - we / 2, ae.y - we / 2, we, we);
            }
          }
          n.globalAlpha = Math.min(1, M * 1.02), n.fillStyle = d;
          const F = b.x - b.size * 0.1, D = b.y - b.size * 0.1;
          if (m(F, D, b.size * 1.2, b.speed), M > 1.02) {
            const U = Math.min(1, (M - 1) * 0.85);
            n.save(), n.globalCompositeOperation = "lighter", n.globalAlpha = U, n.fillStyle = d;
            const z = b.size * 0.75;
            m(F + b.size * 0.225, D + b.size * 0.225, z, b.speed), n.restore();
          }
        } else if (n.globalAlpha = Math.min(1, I), n.fillStyle = d, m(b.x, b.y, b.size, b.speed), I > 1.01) {
          const M = Math.min(0.9, (I - 1) * 0.8);
          n.save(), n.globalCompositeOperation = "lighter", n.globalAlpha = M, n.fillStyle = d;
          const F = b.size * 0.55;
          m(b.x + b.size * 0.225, b.y + b.size * 0.225, F, b.speed), n.restore();
        }
      }
      n.globalAlpha = 1, requestAnimationFrame(y);
    };
    return y(), () => window.removeEventListener("resize", i);
  }, []), /* @__PURE__ */ g.jsx(
    "canvas",
    {
      ref: t,
      "data-darkreader-ignore": !0,
      className: "fixed inset-0 z-0 bg-black pointer-events-none [isolation:isolate]"
    }
  );
}
function ma() {
  const t = ["dev-room-1000"];
  return /* @__PURE__ */ g.jsxs("div", { className: "relative h-full flex flex-col items-center justify-center gap-10 py-24", children: [
    /* @__PURE__ */ g.jsx(sr, {}),
    /* @__PURE__ */ g.jsx("h1", { className: "text-4xl font-bold tracking-tight drop-shadow", children: "Watchparty" }),
    /* @__PURE__ */ g.jsxs("div", { className: "w-full max-w-md space-y-4 z-10", children: [
      /* @__PURE__ */ g.jsx("h2", { className: "text-sm uppercase tracking-wide opacity-70", children: "Rooms" }),
      /* @__PURE__ */ g.jsx("ul", { className: "space-y-2", children: t.map((e) => /* @__PURE__ */ g.jsx("li", { children: /* @__PURE__ */ g.jsxs(ui, { to: `/room/${encodeURIComponent(e)}`, className: "block bg-slate-900/80 backdrop-blur border border-slate-700 hover:border-slate-500 rounded px-4 py-3 transition-colors", children: [
        /* @__PURE__ */ g.jsx("div", { className: "font-medium", children: e }),
        /* @__PURE__ */ g.jsx("div", { className: "text-[11px] opacity-60", children: "Join room" })
      ] }) }, e)) }),
      /* @__PURE__ */ g.jsx("div", { className: "pt-6 text-xs opacity-50", children: "Provide ?roomKey= query param to join directly." })
    ] })
  ] });
}
function ga() {
  const t = q((r) => r.roster), e = Object.values(t);
  return e.length ? /* @__PURE__ */ g.jsx("ul", { className: "text-xs space-y-1", children: e.map((r) => {
    const n = r.name && fa[r.name] || "#cbd5e1";
    return /* @__PURE__ */ g.jsxs("li", { className: "flex items-center gap-2", children: [
      r.sprite ? /* @__PURE__ */ g.jsx("img", { src: Br(r.sprite), alt: r.sprite, className: "w-7 h-7 rounded object-cover" }) : /* @__PURE__ */ g.jsx("span", { className: "inline-block w-7 h-7 bg-slate-700/50 rounded" }),
      /* @__PURE__ */ g.jsx("span", { className: "truncate max-w-[120px] font-medium", style: { color: n }, children: r.name || "Anon" }),
      r.isLeader && /* @__PURE__ */ g.jsx("span", { className: "px-1 rounded bg-emerald-600 text-[9px]", children: "L" })
    ] }, r.clientId);
  }) }) : /* @__PURE__ */ g.jsx("div", { className: "text-xs opacity-50", children: "No users" });
}
const Te = /* @__PURE__ */ Object.create(null);
Te.open = "0";
Te.close = "1";
Te.ping = "2";
Te.pong = "3";
Te.message = "4";
Te.upgrade = "5";
Te.noop = "6";
const Wt = /* @__PURE__ */ Object.create(null);
Object.keys(Te).forEach((t) => {
  Wt[Te[t]] = t;
});
const Sr = { type: "error", data: "parser error" }, gi = typeof Blob == "function" || typeof Blob < "u" && Object.prototype.toString.call(Blob) === "[object BlobConstructor]", yi = typeof ArrayBuffer == "function", vi = (t) => typeof ArrayBuffer.isView == "function" ? ArrayBuffer.isView(t) : t && t.buffer instanceof ArrayBuffer, Ur = ({ type: t, data: e }, r, n) => gi && e instanceof Blob ? r ? n(e) : Nn(e, n) : yi && (e instanceof ArrayBuffer || vi(e)) ? r ? n(e) : Nn(new Blob([e]), n) : n(Te[t] + (e || "")), Nn = (t, e) => {
  const r = new FileReader();
  return r.onload = function() {
    const n = r.result.split(",")[1];
    e("b" + (n || ""));
  }, r.readAsDataURL(t);
};
function Ln(t) {
  return t instanceof Uint8Array ? t : t instanceof ArrayBuffer ? new Uint8Array(t) : new Uint8Array(t.buffer, t.byteOffset, t.byteLength);
}
let vr;
function ya(t, e) {
  if (gi && t.data instanceof Blob)
    return t.data.arrayBuffer().then(Ln).then(e);
  if (yi && (t.data instanceof ArrayBuffer || vi(t.data)))
    return e(Ln(t.data));
  Ur(t, !1, (r) => {
    vr || (vr = new TextEncoder()), e(vr.encode(r));
  });
}
const Pn = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/", Ct = typeof Uint8Array > "u" ? [] : new Uint8Array(256);
for (let t = 0; t < Pn.length; t++)
  Ct[Pn.charCodeAt(t)] = t;
const va = (t) => {
  let e = t.length * 0.75, r = t.length, n, i = 0, s, o, l, a;
  t[t.length - 1] === "=" && (e--, t[t.length - 2] === "=" && e--);
  const m = new ArrayBuffer(e), p = new Uint8Array(m);
  for (n = 0; n < r; n += 4)
    s = Ct[t.charCodeAt(n)], o = Ct[t.charCodeAt(n + 1)], l = Ct[t.charCodeAt(n + 2)], a = Ct[t.charCodeAt(n + 3)], p[i++] = s << 2 | o >> 4, p[i++] = (o & 15) << 4 | l >> 2, p[i++] = (l & 3) << 6 | a & 63;
  return m;
}, ba = typeof ArrayBuffer == "function", Fr = (t, e) => {
  if (typeof t != "string")
    return {
      type: "message",
      data: bi(t, e)
    };
  const r = t.charAt(0);
  return r === "b" ? {
    type: "message",
    data: xa(t.substring(1), e)
  } : Wt[r] ? t.length > 1 ? {
    type: Wt[r],
    data: t.substring(1)
  } : {
    type: Wt[r]
  } : Sr;
}, xa = (t, e) => {
  if (ba) {
    const r = va(t);
    return bi(r, e);
  } else
    return { base64: !0, data: t };
}, bi = (t, e) => {
  switch (e) {
    case "blob":
      return t instanceof Blob ? t : new Blob([t]);
    case "arraybuffer":
    default:
      return t instanceof ArrayBuffer ? t : t.buffer;
  }
}, xi = "", wa = (t, e) => {
  const r = t.length, n = new Array(r);
  let i = 0;
  t.forEach((s, o) => {
    Ur(s, !1, (l) => {
      n[o] = l, ++i === r && e(n.join(xi));
    });
  });
}, _a = (t, e) => {
  const r = t.split(xi), n = [];
  for (let i = 0; i < r.length; i++) {
    const s = Fr(r[i], e);
    if (n.push(s), s.type === "error")
      break;
  }
  return n;
};
function Ea() {
  return new TransformStream({
    transform(t, e) {
      ya(t, (r) => {
        const n = r.length;
        let i;
        if (n < 126)
          i = new Uint8Array(1), new DataView(i.buffer).setUint8(0, n);
        else if (n < 65536) {
          i = new Uint8Array(3);
          const s = new DataView(i.buffer);
          s.setUint8(0, 126), s.setUint16(1, n);
        } else {
          i = new Uint8Array(9);
          const s = new DataView(i.buffer);
          s.setUint8(0, 127), s.setBigUint64(1, BigInt(n));
        }
        t.data && typeof t.data != "string" && (i[0] |= 128), e.enqueue(i), e.enqueue(r);
      });
    }
  });
}
let br;
function qt(t) {
  return t.reduce((e, r) => e + r.length, 0);
}
function Vt(t, e) {
  if (t[0].length === e)
    return t.shift();
  const r = new Uint8Array(e);
  let n = 0;
  for (let i = 0; i < e; i++)
    r[i] = t[0][n++], n === t[0].length && (t.shift(), n = 0);
  return t.length && n < t[0].length && (t[0] = t[0].slice(n)), r;
}
function Sa(t, e) {
  br || (br = new TextDecoder());
  const r = [];
  let n = 0, i = -1, s = !1;
  return new TransformStream({
    transform(o, l) {
      for (r.push(o); ; ) {
        if (n === 0) {
          if (qt(r) < 1)
            break;
          const a = Vt(r, 1);
          s = (a[0] & 128) === 128, i = a[0] & 127, i < 126 ? n = 3 : i === 126 ? n = 1 : n = 2;
        } else if (n === 1) {
          if (qt(r) < 2)
            break;
          const a = Vt(r, 2);
          i = new DataView(a.buffer, a.byteOffset, a.length).getUint16(0), n = 3;
        } else if (n === 2) {
          if (qt(r) < 8)
            break;
          const a = Vt(r, 8), m = new DataView(a.buffer, a.byteOffset, a.length), p = m.getUint32(0);
          if (p > Math.pow(2, 21) - 1) {
            l.enqueue(Sr);
            break;
          }
          i = p * Math.pow(2, 32) + m.getUint32(4), n = 3;
        } else {
          if (qt(r) < i)
            break;
          const a = Vt(r, i);
          l.enqueue(Fr(s ? a : br.decode(a), e)), n = 0;
        }
        if (i === 0 || i > t) {
          l.enqueue(Sr);
          break;
        }
      }
    }
  });
}
const wi = 4;
function se(t) {
  if (t) return Ra(t);
}
function Ra(t) {
  for (var e in se.prototype)
    t[e] = se.prototype[e];
  return t;
}
se.prototype.on = se.prototype.addEventListener = function(t, e) {
  return this._callbacks = this._callbacks || {}, (this._callbacks["$" + t] = this._callbacks["$" + t] || []).push(e), this;
};
se.prototype.once = function(t, e) {
  function r() {
    this.off(t, r), e.apply(this, arguments);
  }
  return r.fn = e, this.on(t, r), this;
};
se.prototype.off = se.prototype.removeListener = se.prototype.removeAllListeners = se.prototype.removeEventListener = function(t, e) {
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
se.prototype.emit = function(t) {
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
se.prototype.emitReserved = se.prototype.emit;
se.prototype.listeners = function(t) {
  return this._callbacks = this._callbacks || {}, this._callbacks["$" + t] || [];
};
se.prototype.hasListeners = function(t) {
  return !!this.listeners(t).length;
};
const or = typeof Promise == "function" && typeof Promise.resolve == "function" ? (e) => Promise.resolve().then(e) : (e, r) => r(e, 0), xe = typeof self < "u" ? self : typeof window < "u" ? window : Function("return this")(), Ca = "arraybuffer";
function _i(t, ...e) {
  return e.reduce((r, n) => (t.hasOwnProperty(n) && (r[n] = t[n]), r), {});
}
const Ta = xe.setTimeout, ka = xe.clearTimeout;
function ar(t, e) {
  e.useNativeTimers ? (t.setTimeoutFn = Ta.bind(xe), t.clearTimeoutFn = ka.bind(xe)) : (t.setTimeoutFn = xe.setTimeout.bind(xe), t.clearTimeoutFn = xe.clearTimeout.bind(xe));
}
const Ma = 1.33;
function Na(t) {
  return typeof t == "string" ? La(t) : Math.ceil((t.byteLength || t.size) * Ma);
}
function La(t) {
  let e = 0, r = 0;
  for (let n = 0, i = t.length; n < i; n++)
    e = t.charCodeAt(n), e < 128 ? r += 1 : e < 2048 ? r += 2 : e < 55296 || e >= 57344 ? r += 3 : (n++, r += 4);
  return r;
}
function Ei() {
  return Date.now().toString(36).substring(3) + Math.random().toString(36).substring(2, 5);
}
function Pa(t) {
  let e = "";
  for (let r in t)
    t.hasOwnProperty(r) && (e.length && (e += "&"), e += encodeURIComponent(r) + "=" + encodeURIComponent(t[r]));
  return e;
}
function Aa(t) {
  let e = {}, r = t.split("&");
  for (let n = 0, i = r.length; n < i; n++) {
    let s = r[n].split("=");
    e[decodeURIComponent(s[0])] = decodeURIComponent(s[1]);
  }
  return e;
}
class Oa extends Error {
  constructor(e, r, n) {
    super(e), this.description = r, this.context = n, this.type = "TransportError";
  }
}
class zr extends se {
  /**
   * Transport abstract constructor.
   *
   * @param {Object} opts - options
   * @protected
   */
  constructor(e) {
    super(), this.writable = !1, ar(this, e), this.opts = e, this.query = e.query, this.socket = e.socket, this.supportsBinary = !e.forceBase64;
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
    return super.emitReserved("error", new Oa(e, r, n)), this;
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
    const r = Fr(e, this.socket.binaryType);
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
    const r = Pa(e);
    return r.length ? "?" + r : "";
  }
}
class ja extends zr {
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
    _a(e, this.socket.binaryType).forEach(r), this.readyState !== "closed" && (this._polling = !1, this.emitReserved("pollComplete"), this.readyState === "open" && this._poll());
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
    this.writable = !1, wa(e, (r) => {
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
    return this.opts.timestampRequests !== !1 && (r[this.opts.timestampParam] = Ei()), !this.supportsBinary && !r.sid && (r.b64 = 1), this.createUri(e, r);
  }
}
let Si = !1;
try {
  Si = typeof XMLHttpRequest < "u" && "withCredentials" in new XMLHttpRequest();
} catch {
}
const Da = Si;
function Ia() {
}
class Ba extends ja {
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
    n.on("success", r), n.on("error", (i, s) => {
      this.onError("xhr post error", i, s);
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
let ut = class Kt extends se {
  /**
   * Request constructor
   *
   * @param {Object} options
   * @package
   */
  constructor(e, r, n) {
    super(), this.createRequest = e, ar(this, n), this._opts = n, this._method = n.method || "GET", this._uri = r, this._data = n.data !== void 0 ? n.data : null, this._create();
  }
  /**
   * Creates the XHR object and sends the request.
   *
   * @private
   */
  _create() {
    var e;
    const r = _i(this._opts, "agent", "pfx", "key", "passphrase", "cert", "ca", "ciphers", "rejectUnauthorized", "autoUnref");
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
    typeof document < "u" && (this._index = Kt.requestsCount++, Kt.requests[this._index] = this);
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
      if (this._xhr.onreadystatechange = Ia, e)
        try {
          this._xhr.abort();
        } catch {
        }
      typeof document < "u" && delete Kt.requests[this._index], this._xhr = null;
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
ut.requestsCount = 0;
ut.requests = {};
if (typeof document < "u") {
  if (typeof attachEvent == "function")
    attachEvent("onunload", An);
  else if (typeof addEventListener == "function") {
    const t = "onpagehide" in xe ? "pagehide" : "unload";
    addEventListener(t, An, !1);
  }
}
function An() {
  for (let t in ut.requests)
    ut.requests.hasOwnProperty(t) && ut.requests[t].abort();
}
const Ua = function() {
  const t = Ri({
    xdomain: !1
  });
  return t && t.responseType !== null;
}();
class Fa extends Ba {
  constructor(e) {
    super(e);
    const r = e && e.forceBase64;
    this.supportsBinary = Ua && !r;
  }
  request(e = {}) {
    return Object.assign(e, { xd: this.xd }, this.opts), new ut(Ri, this.uri(), e);
  }
}
function Ri(t) {
  const e = t.xdomain;
  try {
    if (typeof XMLHttpRequest < "u" && (!e || Da))
      return new XMLHttpRequest();
  } catch {
  }
  if (!e)
    try {
      return new xe[["Active"].concat("Object").join("X")]("Microsoft.XMLHTTP");
    } catch {
    }
}
const Ci = typeof navigator < "u" && typeof navigator.product == "string" && navigator.product.toLowerCase() === "reactnative";
class za extends zr {
  get name() {
    return "websocket";
  }
  doOpen() {
    const e = this.uri(), r = this.opts.protocols, n = Ci ? {} : _i(this.opts, "agent", "perMessageDeflate", "pfx", "key", "passphrase", "cert", "ca", "ciphers", "rejectUnauthorized", "localAddress", "protocolVersion", "origin", "maxPayload", "family", "checkServerIdentity");
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
      Ur(n, this.supportsBinary, (s) => {
        try {
          this.doWrite(n, s);
        } catch {
        }
        i && or(() => {
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
    return this.opts.timestampRequests && (r[this.opts.timestampParam] = Ei()), this.supportsBinary || (r.b64 = 1), this.createUri(e, r);
  }
}
const xr = xe.WebSocket || xe.MozWebSocket;
class $a extends za {
  createSocket(e, r, n) {
    return Ci ? new xr(e, r, n) : r ? new xr(e, r) : new xr(e);
  }
  doWrite(e, r) {
    this.ws.send(r);
  }
}
class qa extends zr {
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
        const r = Sa(Number.MAX_SAFE_INTEGER, this.socket.binaryType), n = e.readable.pipeThrough(r).getReader(), i = Ea();
        i.readable.pipeTo(e.writable), this._writer = i.writable.getWriter();
        const s = () => {
          n.read().then(({ done: l, value: a }) => {
            l || (this.onPacket(a), s());
          }).catch((l) => {
          });
        };
        s();
        const o = { type: "open" };
        this.query.sid && (o.data = `{"sid":"${this.query.sid}"}`), this._writer.write(o).then(() => this.onOpen());
      });
    });
  }
  write(e) {
    this.writable = !1;
    for (let r = 0; r < e.length; r++) {
      const n = e[r], i = r === e.length - 1;
      this._writer.write(n).then(() => {
        i && or(() => {
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
const Va = {
  websocket: $a,
  webtransport: qa,
  polling: Fa
}, Ha = /^(?:(?![^:@\/?#]+:[^:@\/]*@)(http|https|ws|wss):\/\/)?((?:(([^:@\/?#]*)(?::([^:@\/?#]*))?)?@)?((?:[a-f0-9]{0,4}:){2,7}[a-f0-9]{0,4}|[^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/, Wa = [
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
function Rr(t) {
  if (t.length > 8e3)
    throw "URI too long";
  const e = t, r = t.indexOf("["), n = t.indexOf("]");
  r != -1 && n != -1 && (t = t.substring(0, r) + t.substring(r, n).replace(/:/g, ";") + t.substring(n, t.length));
  let i = Ha.exec(t || ""), s = {}, o = 14;
  for (; o--; )
    s[Wa[o]] = i[o] || "";
  return r != -1 && n != -1 && (s.source = e, s.host = s.host.substring(1, s.host.length - 1).replace(/;/g, ":"), s.authority = s.authority.replace("[", "").replace("]", "").replace(/;/g, ":"), s.ipv6uri = !0), s.pathNames = Ka(s, s.path), s.queryKey = Ya(s, s.query), s;
}
function Ka(t, e) {
  const r = /\/{2,9}/g, n = e.replace(r, "/").split("/");
  return (e.slice(0, 1) == "/" || e.length === 0) && n.splice(0, 1), e.slice(-1) == "/" && n.splice(n.length - 1, 1), n;
}
function Ya(t, e) {
  const r = {};
  return e.replace(/(?:^|&)([^&=]*)=?([^&]*)/g, function(n, i, s) {
    i && (r[i] = s);
  }), r;
}
const Cr = typeof addEventListener == "function" && typeof removeEventListener == "function", Yt = [];
Cr && addEventListener("offline", () => {
  Yt.forEach((t) => t());
}, !1);
class He extends se {
  /**
   * Socket constructor.
   *
   * @param {String|Object} uri - uri or options
   * @param {Object} opts - options
   */
  constructor(e, r) {
    if (super(), this.binaryType = Ca, this.writeBuffer = [], this._prevBufferLen = 0, this._pingInterval = -1, this._pingTimeout = -1, this._maxPayload = -1, this._pingTimeoutTime = 1 / 0, e && typeof e == "object" && (r = e, e = null), e) {
      const n = Rr(e);
      r.hostname = n.host, r.secure = n.protocol === "https" || n.protocol === "wss", r.port = n.port, n.query && (r.query = n.query);
    } else r.host && (r.hostname = Rr(r.host).host);
    ar(this, r), this.secure = r.secure != null ? r.secure : typeof location < "u" && location.protocol === "https:", r.hostname && !r.port && (r.port = this.secure ? "443" : "80"), this.hostname = r.hostname || (typeof location < "u" ? location.hostname : "localhost"), this.port = r.port || (typeof location < "u" && location.port ? location.port : this.secure ? "443" : "80"), this.transports = [], this._transportsByName = {}, r.transports.forEach((n) => {
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
    }, r), this.opts.path = this.opts.path.replace(/\/$/, "") + (this.opts.addTrailingSlash ? "/" : ""), typeof this.opts.query == "string" && (this.opts.query = Aa(this.opts.query)), Cr && (this.opts.closeOnBeforeunload && (this._beforeunloadEventListener = () => {
      this.transport && (this.transport.removeAllListeners(), this.transport.close());
    }, addEventListener("beforeunload", this._beforeunloadEventListener, !1)), this.hostname !== "localhost" && (this._offlineEventListener = () => {
      this._onClose("transport close", {
        description: "network connection lost"
      });
    }, Yt.push(this._offlineEventListener))), this.opts.withCredentials && (this._cookieJar = void 0), this._open();
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
    r.EIO = wi, r.transport = e, this.id && (r.sid = this.id);
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
    const e = this.opts.rememberUpgrade && He.priorWebsocketSuccess && this.transports.indexOf("websocket") !== -1 ? "websocket" : this.transports[0];
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
    this.readyState = "open", He.priorWebsocketSuccess = this.transport.name === "websocket", this.emitReserved("open"), this.flush();
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
      if (i && (r += Na(i)), n > 0 && r > this._maxPayload)
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
    return e && (this._pingTimeoutTime = 0, or(() => {
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
    const s = {
      type: e,
      data: r,
      options: n
    };
    this.emitReserved("packetCreate", s), this.writeBuffer.push(s), i && this.once("flush", i), this.flush();
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
    if (He.priorWebsocketSuccess = !1, this.opts.tryAllTransports && this.transports.length > 1 && this.readyState === "opening")
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
      if (this.clearTimeoutFn(this._pingTimeoutTimer), this.transport.removeAllListeners("close"), this.transport.close(), this.transport.removeAllListeners(), Cr && (this._beforeunloadEventListener && removeEventListener("beforeunload", this._beforeunloadEventListener, !1), this._offlineEventListener)) {
        const n = Yt.indexOf(this._offlineEventListener);
        n !== -1 && Yt.splice(n, 1);
      }
      this.readyState = "closed", this.id = null, this.emitReserved("close", e, r), this.writeBuffer = [], this._prevBufferLen = 0;
    }
  }
}
He.protocol = wi;
class Ja extends He {
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
    He.priorWebsocketSuccess = !1;
    const i = () => {
      n || (r.send([{ type: "ping", data: "probe" }]), r.once("packet", (u) => {
        if (!n)
          if (u.type === "pong" && u.data === "probe") {
            if (this.upgrading = !0, this.emitReserved("upgrading", r), !r)
              return;
            He.priorWebsocketSuccess = r.name === "websocket", this.transport.pause(() => {
              n || this.readyState !== "closed" && (p(), this.setTransport(r), r.send([{ type: "upgrade" }]), this.emitReserved("upgrade", r), r = null, this.upgrading = !1, this.flush());
            });
          } else {
            const y = new Error("probe error");
            y.transport = r.name, this.emitReserved("upgradeError", y);
          }
      }));
    };
    function s() {
      n || (n = !0, p(), r.close(), r = null);
    }
    const o = (u) => {
      const y = new Error("probe error: " + u);
      y.transport = r.name, s(), this.emitReserved("upgradeError", y);
    };
    function l() {
      o("transport closed");
    }
    function a() {
      o("socket closed");
    }
    function m(u) {
      r && u.name !== r.name && s();
    }
    const p = () => {
      r.removeListener("open", i), r.removeListener("error", o), r.removeListener("close", l), this.off("close", a), this.off("upgrading", m);
    };
    r.once("open", i), r.once("error", o), r.once("close", l), this.once("close", a), this.once("upgrading", m), this._upgrades.indexOf("webtransport") !== -1 && e !== "webtransport" ? this.setTimeoutFn(() => {
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
let Xa = class extends Ja {
  constructor(e, r = {}) {
    const n = typeof e == "object" ? e : r;
    (!n.transports || n.transports && typeof n.transports[0] == "string") && (n.transports = (n.transports || ["polling", "websocket", "webtransport"]).map((i) => Va[i]).filter((i) => !!i)), super(e, n);
  }
};
function Ga(t, e = "", r) {
  let n = t;
  r = r || typeof location < "u" && location, t == null && (t = r.protocol + "//" + r.host), typeof t == "string" && (t.charAt(0) === "/" && (t.charAt(1) === "/" ? t = r.protocol + t : t = r.host + t), /^(https?|wss?):\/\//.test(t) || (typeof r < "u" ? t = r.protocol + "//" + t : t = "https://" + t), n = Rr(t)), n.port || (/^(http|ws)$/.test(n.protocol) ? n.port = "80" : /^(http|ws)s$/.test(n.protocol) && (n.port = "443")), n.path = n.path || "/";
  const s = n.host.indexOf(":") !== -1 ? "[" + n.host + "]" : n.host;
  return n.id = n.protocol + "://" + s + ":" + n.port + e, n.href = n.protocol + "://" + s + (r && r.port === n.port ? "" : ":" + n.port), n;
}
const Qa = typeof ArrayBuffer == "function", Za = (t) => typeof ArrayBuffer.isView == "function" ? ArrayBuffer.isView(t) : t.buffer instanceof ArrayBuffer, Ti = Object.prototype.toString, el = typeof Blob == "function" || typeof Blob < "u" && Ti.call(Blob) === "[object BlobConstructor]", tl = typeof File == "function" || typeof File < "u" && Ti.call(File) === "[object FileConstructor]";
function $r(t) {
  return Qa && (t instanceof ArrayBuffer || Za(t)) || el && t instanceof Blob || tl && t instanceof File;
}
function Jt(t, e) {
  if (!t || typeof t != "object")
    return !1;
  if (Array.isArray(t)) {
    for (let r = 0, n = t.length; r < n; r++)
      if (Jt(t[r]))
        return !0;
    return !1;
  }
  if ($r(t))
    return !0;
  if (t.toJSON && typeof t.toJSON == "function" && arguments.length === 1)
    return Jt(t.toJSON(), !0);
  for (const r in t)
    if (Object.prototype.hasOwnProperty.call(t, r) && Jt(t[r]))
      return !0;
  return !1;
}
function rl(t) {
  const e = [], r = t.data, n = t;
  return n.data = Tr(r, e), n.attachments = e.length, { packet: n, buffers: e };
}
function Tr(t, e) {
  if (!t)
    return t;
  if ($r(t)) {
    const r = { _placeholder: !0, num: e.length };
    return e.push(t), r;
  } else if (Array.isArray(t)) {
    const r = new Array(t.length);
    for (let n = 0; n < t.length; n++)
      r[n] = Tr(t[n], e);
    return r;
  } else if (typeof t == "object" && !(t instanceof Date)) {
    const r = {};
    for (const n in t)
      Object.prototype.hasOwnProperty.call(t, n) && (r[n] = Tr(t[n], e));
    return r;
  }
  return t;
}
function nl(t, e) {
  return t.data = kr(t.data, e), delete t.attachments, t;
}
function kr(t, e) {
  if (!t)
    return t;
  if (t && t._placeholder === !0) {
    if (typeof t.num == "number" && t.num >= 0 && t.num < e.length)
      return e[t.num];
    throw new Error("illegal attachments");
  } else if (Array.isArray(t))
    for (let r = 0; r < t.length; r++)
      t[r] = kr(t[r], e);
  else if (typeof t == "object")
    for (const r in t)
      Object.prototype.hasOwnProperty.call(t, r) && (t[r] = kr(t[r], e));
  return t;
}
const il = [
  "connect",
  "connect_error",
  "disconnect",
  "disconnecting",
  "newListener",
  "removeListener"
  // used by the Node.js EventEmitter
], sl = 5;
var H;
(function(t) {
  t[t.CONNECT = 0] = "CONNECT", t[t.DISCONNECT = 1] = "DISCONNECT", t[t.EVENT = 2] = "EVENT", t[t.ACK = 3] = "ACK", t[t.CONNECT_ERROR = 4] = "CONNECT_ERROR", t[t.BINARY_EVENT = 5] = "BINARY_EVENT", t[t.BINARY_ACK = 6] = "BINARY_ACK";
})(H || (H = {}));
class ol {
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
    return (e.type === H.EVENT || e.type === H.ACK) && Jt(e) ? this.encodeAsBinary({
      type: e.type === H.EVENT ? H.BINARY_EVENT : H.BINARY_ACK,
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
    return (e.type === H.BINARY_EVENT || e.type === H.BINARY_ACK) && (r += e.attachments + "-"), e.nsp && e.nsp !== "/" && (r += e.nsp + ","), e.id != null && (r += e.id), e.data != null && (r += JSON.stringify(e.data, this.replacer)), r;
  }
  /**
   * Encode packet as 'buffer sequence' by removing blobs, and
   * deconstructing packet into object with placeholders and
   * a list of buffers.
   */
  encodeAsBinary(e) {
    const r = rl(e), n = this.encodeAsString(r.packet), i = r.buffers;
    return i.unshift(n), i;
  }
}
function On(t) {
  return Object.prototype.toString.call(t) === "[object Object]";
}
class qr extends se {
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
      const n = r.type === H.BINARY_EVENT;
      n || r.type === H.BINARY_ACK ? (r.type = n ? H.EVENT : H.ACK, this.reconstructor = new al(r), r.attachments === 0 && super.emitReserved("decoded", r)) : super.emitReserved("decoded", r);
    } else if ($r(e) || e.base64)
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
    if (H[n.type] === void 0)
      throw new Error("unknown packet type " + n.type);
    if (n.type === H.BINARY_EVENT || n.type === H.BINARY_ACK) {
      const s = r + 1;
      for (; e.charAt(++r) !== "-" && r != e.length; )
        ;
      const o = e.substring(s, r);
      if (o != Number(o) || e.charAt(r) !== "-")
        throw new Error("Illegal attachments");
      n.attachments = Number(o);
    }
    if (e.charAt(r + 1) === "/") {
      const s = r + 1;
      for (; ++r && !(e.charAt(r) === "," || r === e.length); )
        ;
      n.nsp = e.substring(s, r);
    } else
      n.nsp = "/";
    const i = e.charAt(r + 1);
    if (i !== "" && Number(i) == i) {
      const s = r + 1;
      for (; ++r; ) {
        const o = e.charAt(r);
        if (o == null || Number(o) != o) {
          --r;
          break;
        }
        if (r === e.length)
          break;
      }
      n.id = Number(e.substring(s, r + 1));
    }
    if (e.charAt(++r)) {
      const s = this.tryParse(e.substr(r));
      if (qr.isPayloadValid(n.type, s))
        n.data = s;
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
      case H.CONNECT:
        return On(r);
      case H.DISCONNECT:
        return r === void 0;
      case H.CONNECT_ERROR:
        return typeof r == "string" || On(r);
      case H.EVENT:
      case H.BINARY_EVENT:
        return Array.isArray(r) && (typeof r[0] == "number" || typeof r[0] == "string" && il.indexOf(r[0]) === -1);
      case H.ACK:
      case H.BINARY_ACK:
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
class al {
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
      const r = nl(this.reconPack, this.buffers);
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
const ll = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Decoder: qr,
  Encoder: ol,
  get PacketType() {
    return H;
  },
  protocol: sl
}, Symbol.toStringTag, { value: "Module" }));
function Ee(t, e, r) {
  return t.on(e, r), function() {
    t.off(e, r);
  };
}
const cl = Object.freeze({
  connect: 1,
  connect_error: 1,
  disconnect: 1,
  disconnecting: 1,
  // EventEmitter reserved events: https://nodejs.org/api/events.html#events_event_newlistener
  newListener: 1,
  removeListener: 1
});
class ki extends se {
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
      Ee(e, "open", this.onopen.bind(this)),
      Ee(e, "packet", this.onpacket.bind(this)),
      Ee(e, "error", this.onerror.bind(this)),
      Ee(e, "close", this.onclose.bind(this))
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
    var n, i, s;
    if (cl.hasOwnProperty(e))
      throw new Error('"' + e.toString() + '" is a reserved event name');
    if (r.unshift(e), this._opts.retries && !this.flags.fromQueue && !this.flags.volatile)
      return this._addToQueue(r), this;
    const o = {
      type: H.EVENT,
      data: r
    };
    if (o.options = {}, o.options.compress = this.flags.compress !== !1, typeof r[r.length - 1] == "function") {
      const p = this.ids++, u = r.pop();
      this._registerAckCallback(p, u), o.id = p;
    }
    const l = (i = (n = this.io.engine) === null || n === void 0 ? void 0 : n.transport) === null || i === void 0 ? void 0 : i.writable, a = this.connected && !(!((s = this.io.engine) === null || s === void 0) && s._hasPingExpired());
    return this.flags.volatile && !l || (a ? (this.notifyOutgoingListeners(o), this.packet(o)) : this.sendBuffer.push(o)), this.flags = {}, this;
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
    const s = this.io.setTimeoutFn(() => {
      delete this.acks[e];
      for (let l = 0; l < this.sendBuffer.length; l++)
        this.sendBuffer[l].id === e && this.sendBuffer.splice(l, 1);
      r.call(this, new Error("operation has timed out"));
    }, i), o = (...l) => {
      this.io.clearTimeoutFn(s), r.apply(this, l);
    };
    o.withError = !0, this.acks[e] = o;
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
      const s = (o, l) => o ? i(o) : n(l);
      s.withError = !0, r.push(s), this.emit(e, ...r);
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
    e.push((i, ...s) => n !== this._queue[0] ? void 0 : (i !== null ? n.tryCount > this._opts.retries && (this._queue.shift(), r && r(i)) : (this._queue.shift(), r && r(null, ...s)), n.pending = !1, this._drainQueue())), this._queue.push(n), this._drainQueue();
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
      type: H.CONNECT,
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
        case H.CONNECT:
          e.data && e.data.sid ? this.onconnect(e.data.sid, e.data.pid) : this.emitReserved("connect_error", new Error("It seems you are trying to reach a Socket.IO server in v2.x with a v3.x client, but they are not compatible (more information here: https://socket.io/docs/v3/migrating-from-2-x-to-3-0/)"));
          break;
        case H.EVENT:
        case H.BINARY_EVENT:
          this.onevent(e);
          break;
        case H.ACK:
        case H.BINARY_ACK:
          this.onack(e);
          break;
        case H.DISCONNECT:
          this.ondisconnect();
          break;
        case H.CONNECT_ERROR:
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
        type: H.ACK,
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
    return this.connected && this.packet({ type: H.DISCONNECT }), this.destroy(), this.connected && this.onclose("io client disconnect"), this;
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
function pt(t) {
  t = t || {}, this.ms = t.min || 100, this.max = t.max || 1e4, this.factor = t.factor || 2, this.jitter = t.jitter > 0 && t.jitter <= 1 ? t.jitter : 0, this.attempts = 0;
}
pt.prototype.duration = function() {
  var t = this.ms * Math.pow(this.factor, this.attempts++);
  if (this.jitter) {
    var e = Math.random(), r = Math.floor(e * this.jitter * t);
    t = Math.floor(e * 10) & 1 ? t + r : t - r;
  }
  return Math.min(t, this.max) | 0;
};
pt.prototype.reset = function() {
  this.attempts = 0;
};
pt.prototype.setMin = function(t) {
  this.ms = t;
};
pt.prototype.setMax = function(t) {
  this.max = t;
};
pt.prototype.setJitter = function(t) {
  this.jitter = t;
};
class Mr extends se {
  constructor(e, r) {
    var n;
    super(), this.nsps = {}, this.subs = [], e && typeof e == "object" && (r = e, e = void 0), r = r || {}, r.path = r.path || "/socket.io", this.opts = r, ar(this, r), this.reconnection(r.reconnection !== !1), this.reconnectionAttempts(r.reconnectionAttempts || 1 / 0), this.reconnectionDelay(r.reconnectionDelay || 1e3), this.reconnectionDelayMax(r.reconnectionDelayMax || 5e3), this.randomizationFactor((n = r.randomizationFactor) !== null && n !== void 0 ? n : 0.5), this.backoff = new pt({
      min: this.reconnectionDelay(),
      max: this.reconnectionDelayMax(),
      jitter: this.randomizationFactor()
    }), this.timeout(r.timeout == null ? 2e4 : r.timeout), this._readyState = "closed", this.uri = e;
    const i = r.parser || ll;
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
    this.engine = new Xa(this.uri, this.opts);
    const r = this.engine, n = this;
    this._readyState = "opening", this.skipReconnect = !1;
    const i = Ee(r, "open", function() {
      n.onopen(), e && e();
    }), s = (l) => {
      this.cleanup(), this._readyState = "closed", this.emitReserved("error", l), e ? e(l) : this.maybeReconnectOnOpen();
    }, o = Ee(r, "error", s);
    if (this._timeout !== !1) {
      const l = this._timeout, a = this.setTimeoutFn(() => {
        i(), s(new Error("timeout")), r.close();
      }, l);
      this.opts.autoUnref && a.unref(), this.subs.push(() => {
        this.clearTimeoutFn(a);
      });
    }
    return this.subs.push(i), this.subs.push(o), this;
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
      Ee(e, "ping", this.onping.bind(this)),
      Ee(e, "data", this.ondata.bind(this)),
      Ee(e, "error", this.onerror.bind(this)),
      Ee(e, "close", this.onclose.bind(this)),
      // @ts-ignore
      Ee(this.decoder, "decoded", this.ondecoded.bind(this))
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
    or(() => {
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
    return n ? this._autoConnect && !n.active && n.connect() : (n = new ki(this, e, r), this.nsps[e] = n), n;
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
const St = {};
function Xt(t, e) {
  typeof t == "object" && (e = t, t = void 0), e = e || {};
  const r = Ga(t, e.path || "/socket.io"), n = r.source, i = r.id, s = r.path, o = St[i] && s in St[i].nsps, l = e.forceNew || e["force new connection"] || e.multiplex === !1 || o;
  let a;
  return l ? a = new Mr(n, e) : (St[i] || (St[i] = new Mr(n, e)), a = St[i]), r.query && !e.query && (e.query = r.queryKey), a.socket(r.path, e);
}
Object.assign(Xt, {
  Manager: Mr,
  Socket: ki,
  io: Xt,
  connect: Xt
});
const er = {
  serverOrigin: "http://localhost:8080",
  defaultRoomKey: "dev-room-1000"
};
let Nr = { ...er };
function ul(t) {
  Nr = { ...Nr, ...t };
}
function Vr() {
  return Nr;
}
const Mi = Vi(er);
function dl() {
  return Hi(Mi);
}
const Ni = (() => {
  try {
    const t = new URLSearchParams(window.location.search);
    if (t.has("verbose") || t.get("v") === "1" || localStorage.getItem("wp_verbose") === "1") return !0;
  } catch {
  }
  return !1;
})();
function te(t, e) {
  Ni && (e !== void 0 ? console.debug("[wp]", t, e) : console.debug("[wp]", t));
}
function ye() {
  return Ni;
}
let ce = null, et = null, jn = null;
function fl(t) {
  const e = mt(), r = q.getState();
  if (r.me.clientId && r.roster[r.me.clientId])
    return (t.name || t.sprite) && (te("identity_update_emit", { name: t.name, sprite: t.sprite }), e.emit("identity_update", { name: t.name, sprite: t.sprite })), e;
  const n = hl(t), i = () => {
    setTimeout(() => {
      const s = q.getState();
      s.name && (te("identity_update_emit_post_join", { name: s.name, sprite: s.sprite }), e.emit("identity_update", { name: s.name, sprite: s.sprite || void 0 }));
    }, 40);
  };
  return e.connected ? (te("join_emit", n), e.emit("join", n), i()) : e.once("connect", () => {
    te("join_emit", n), e.emit("join", n), i();
  }), e;
}
function hl(t) {
  return {
    room_key: t.room_key,
    name: t.name,
    sprite: t.sprite
  };
}
function mt() {
  if (!ce) {
    let e = Vr().serverOrigin || "/";
    if (e === "/" && typeof window < "u") {
      const r = window.location;
      (r.hostname === "localhost" || r.hostname === "127.0.0.1") && r.port === "5173" && (e = `${r.protocol}//${r.hostname}:8080`, te("socket_origin_fallback", { origin: e }));
    }
    ce = Xt(e, { path: "/watchparty/ws", transports: ["websocket"] }), te("socket_init", { origin: e }), ce.on("connect", () => {
      const r = ce == null ? void 0 : ce.id;
      if (te("socket_connect", { id: r }), r)
        try {
          q.getState().ensureMe(r);
        } catch {
        }
    }), ce.on("disconnect", (r) => te("socket_disconnect", { reason: r })), ce.on("connect_error", (r) => te("socket_connect_error", { message: r == null ? void 0 : r.message })), ce.on("reconnect_attempt", (r) => te("socket_reconnect_attempt", { attempt: r })), ce.on("reconnect_failed", () => te("socket_reconnect_failed")), pl(ce);
  }
  return ce;
}
function pl(t) {
  q.getState(), t.on("snapshot", (e) => {
    var i;
    e != null && e.client_id && q.getState().ensureMe(e.client_id);
    const r = ((e == null ? void 0 : e.users) || []).map((s) => ({
      clientId: s.client_id,
      name: s.name || "Anon",
      sprite: s.sprite_id ?? s.sprite ?? null,
      isLeader: s.client_id === e.leader_id
    }));
    q.getState().applySnapshot({
      mediaId: e.media_id ?? null,
      playheadMs: e.playhead_ms || 0,
      playing: !!e.playing,
      serverSeq: e.server_seq || 0,
      leaderId: e.leader_id || null,
      users: r
    });
    const n = q.getState();
    if (!n.name) {
      (i = n.ensureAutoIdentity) == null || i.call(n);
      const s = q.getState();
      s.name && (te("identity_auto_assign", { name: s.name, sprite: s.sprite }), t.emit("identity_update", { name: s.name, sprite: s.sprite || void 0 }));
    }
    te("snapshot", e);
  }), jn || (jn = setInterval(() => {
    ml();
  }, 5e3)), t.on("presence", (e) => {
    var n;
    if (!e) return;
    if (Array.isArray(e.users)) {
      const i = {};
      for (const l of e.users)
        i[l.client_id] = {
          clientId: l.client_id,
          name: l.name || "Anon",
          sprite: l.sprite_id ?? l.sprite ?? null,
          isLeader: l.is_leader
        };
      const s = q.getState(), o = ce == null ? void 0 : ce.id;
      o && i[o] && (s.name && (i[o].name = s.name), s.sprite && (i[o].sprite = s.sprite)), s.roster = i, q.setState({ roster: i });
    } else if (e.kind && e.user)
      if (e.kind === "leave")
        q.getState().removeUser(e.user.client_id);
      else {
        q.getState().upsertUser({
          clientId: e.user.client_id,
          name: e.user.name || "",
          sprite: e.user.sprite_id ?? e.user.sprite ?? null,
          isLeader: e.user.is_leader
        });
        const i = q.getState(), s = ce == null ? void 0 : ce.id;
        s && s === e.user.client_id && i.name && q.getState().upsertUser({
          clientId: s,
          name: i.name,
          sprite: i.sprite,
          isLeader: e.user.is_leader
        });
      }
    te("presence", e);
    const r = q.getState();
    if (!r.name) {
      (n = r.ensureAutoIdentity) == null || n.call(r);
      const i = q.getState();
      i.name && (te("identity_auto_assign_presence", { name: i.name, sprite: i.sprite }), t.emit("identity_update", { name: i.name, sprite: i.sprite || void 0 }));
    }
  }), t.on("control_broadcast", (e) => {
    const r = q.getState();
    if (Object.prototype.hasOwnProperty.call(e, "media_id")) {
      const n = e.media_id ?? null;
      r.snapshot.mediaId !== n && (r.applySnapshot({ mediaId: n }), n && r.setReadiness({ mediaId: n, ready: !1, readyCount: 0, total: 0 }));
    }
    r.updateControlState({
      playheadMs: e.playhead_ms,
      playing: e.playing,
      serverSeq: e.server_seq,
      leaderId: e.leader_id ?? r.snapshot.leaderId
    }), te("control_broadcast", e);
  }), t.on("ready_state", (e) => {
    e && (q.getState().setReadiness({
      mediaId: e.media_id,
      ready: !!e.ready,
      readyCount: e.ready_count ?? e.readyCount ?? 0,
      total: e.total ?? 0
    }), te("ready_state", e));
  }), t.on("control_ack", (e) => {
    typeof (e == null ? void 0 : e.client_seq) == "number" && typeof (e == null ? void 0 : e.server_seq) == "number" && (q.getState().recordAck(e.client_seq, e.server_seq), te("control_ack", e));
  }), t.on("time_ping", (e) => {
    if (t.emit("time_pong", { id: e == null ? void 0 : e.id }), et && et.ts) {
      const r = Date.now() - et.ts;
      q.getState().addRttSample(r, e == null ? void 0 : e.server_time_ms, et.ts), et = null, te("time_rtt", { rtt: r, offset: q.getState().drift.offsetMs });
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
    q.getState().appendChat(r), te("chat", r);
  }), t.on("error", (e) => {
    console.warn("[error]", e);
    const r = (e == null ? void 0 : e.code) || "error/unknown", n = {
      "control/forbidden": "You are not the leader.",
      "control/stale_seq": "Stale control sequence.",
      "control/seq_gap": "Control sequence gap detected.",
      "rate/limited": "Rate limited. Slow down.",
      "payload/too_large": "Payload too large.",
      "room/full": "Room is full.",
      "auth/invalid_key": "Invalid room key.",
      "auth/leader_occupied": "A leader is already connected to this room.",
      origin_block: "Origin not allowed."
    };
    q.getState().pushToast("error", n[r] || r);
  });
}
function Li(t, e) {
  const n = q.getState().allocateClientSeq(), i = { kind: t, client_seq: n, ...e };
  return mt().emit("control", i), n;
}
function ml() {
  et || (et = { ts: Date.now() }, mt().emit("time_ping", {}));
}
function gl(t, e) {
  const r = {};
  r.name = t, e && (r.sprite = e), !(!r.name && !r.sprite) && (te("identity_update_emit", r), mt().emit("identity_update", r));
}
function Hr() {
  return q((t) => !!t.snapshot.leaderId && t.snapshot.leaderId === t.me.clientId);
}
function yl() {
  return q((t) => t.readiness);
}
function vl() {
  return q((t) => t.snapshot);
}
function bl() {
  const t = vl(), e = yl(), r = Hr(), n = !e.ready, i = () => {
    r && Li(t.playing ? "pause" : "play");
  }, s = () => n ? "Waiting for sync..." : r ? t.playing ? "Pause" : "Play" : "Only the leader can control playback";
  return /* @__PURE__ */ g.jsx(
    "button",
    {
      disabled: n || !r,
      onClick: i,
      className: "ctr-btn",
      title: s(),
      "data-active": !n && r && t.playing ? "1" : "0",
      children: t.playing ? "⏸" : "▶"
    }
  );
}
function xl() {
  const t = q((s) => s.snapshot), e = q((s) => s.readiness), r = Ce(null), n = 60 * 60 * 1e3, i = t.playheadMs;
  return /* @__PURE__ */ g.jsx(
    "input",
    {
      type: "range",
      min: 0,
      max: n,
      value: i,
      disabled: !e.ready,
      onChange: (s) => {
        const o = Number(s.target.value);
        Li("seek", { to_ms: o });
      },
      className: "w-full",
      ref: r
    }
  );
}
function wl({ videoRef: t }) {
  const [e, r] = X(1), [n, i] = X(!1);
  ue(() => {
    const p = t.current;
    p && (p.volume = e, p.muted = n);
  }, [e, n, t]);
  const s = (p) => {
    const u = parseFloat(p.target.value);
    r(u), u > 0 && n && i(!1);
  }, o = () => {
    i(!n);
  }, l = () => n || e === 0 ? "🔇" : e < 0.5 ? "🔉" : "🔊", a = n ? 0 : e, m = Math.round(a * 100);
  return /* @__PURE__ */ g.jsxs("div", { className: "flex items-center gap-2", children: [
    /* @__PURE__ */ g.jsx(
      "button",
      {
        onClick: o,
        className: "text-lg hover:opacity-80 transition-opacity",
        title: n ? "Unmute" : "Mute",
        "aria-label": n ? "Unmute" : "Mute",
        children: l()
      }
    ),
    /* @__PURE__ */ g.jsx(
      "input",
      {
        type: "range",
        min: "0",
        max: "1",
        step: "0.05",
        value: a,
        onChange: s,
        className: "volume-slider",
        title: `Volume: ${m}%`,
        "aria-label": "Volume"
      }
    ),
    /* @__PURE__ */ g.jsxs("span", { className: "text-[10px] opacity-60 w-8 text-right", children: [
      m,
      "%"
    ] })
  ] });
}
function _l({ videoRef: t }) {
  const [e, r] = X([]), [n, i] = X([]), [s, o] = X(0), [l, a] = X(-1);
  ue(() => {
    const u = t.current;
    if (!u) return;
    const y = () => {
      const h = u.audioTracks;
      if (h) {
        const x = [];
        for (let C = 0; C < h.length; C++) {
          const S = h[C];
          x.push({
            index: C,
            kind: "audio",
            label: S.label || `Audio ${C + 1}`,
            language: S.language || "unknown"
          });
        }
        r(x);
      }
      const w = u.textTracks;
      if (w) {
        const x = [];
        for (let C = 0; C < w.length; C++) {
          const S = w[C];
          (S.kind === "subtitles" || S.kind === "captions") && x.push({
            index: C,
            kind: S.kind,
            label: S.label || `${S.kind} ${C + 1}`,
            language: S.language || "unknown"
          });
        }
        i(x);
      }
    };
    return u.addEventListener("loadedmetadata", y), y(), () => u.removeEventListener("loadedmetadata", y);
  }, [t]);
  const m = (u) => {
    const y = t.current, h = y == null ? void 0 : y.audioTracks;
    if (h) {
      for (let w = 0; w < h.length; w++)
        h[w].enabled = w === u;
      o(u);
    }
  }, p = (u) => {
    const y = t.current;
    if (y != null && y.textTracks) {
      for (let h = 0; h < y.textTracks.length; h++)
        y.textTracks[h].mode = "disabled";
      u >= 0 && u < y.textTracks.length && (y.textTracks[u].mode = "showing"), a(u);
    }
  };
  return e.length === 0 && n.length === 0 ? null : /* @__PURE__ */ g.jsxs("div", { className: "flex items-center gap-3", children: [
    e.length > 1 && /* @__PURE__ */ g.jsxs("div", { className: "flex items-center gap-2", children: [
      /* @__PURE__ */ g.jsx("span", { className: "text-[10px] opacity-60", children: "Audio:" }),
      /* @__PURE__ */ g.jsx(
        "select",
        {
          value: s,
          onChange: (u) => m(Number(u.target.value)),
          className: "text-xs bg-slate-700 text-slate-200 rounded px-2 py-1 cursor-pointer hover:bg-slate-600",
          title: "Select audio track",
          "aria-label": "Audio track selection",
          children: e.map((u) => /* @__PURE__ */ g.jsx("option", { value: u.index, children: u.label }, u.index))
        }
      )
    ] }),
    n.length > 0 && /* @__PURE__ */ g.jsxs("div", { className: "flex items-center gap-2", children: [
      /* @__PURE__ */ g.jsx("span", { className: "text-[10px] opacity-60", children: "CC:" }),
      /* @__PURE__ */ g.jsxs(
        "select",
        {
          value: l,
          onChange: (u) => p(Number(u.target.value)),
          className: "text-xs bg-slate-700 text-slate-200 rounded px-2 py-1 cursor-pointer hover:bg-slate-600",
          title: "Select closed captions",
          "aria-label": "Closed caption selection",
          children: [
            /* @__PURE__ */ g.jsx("option", { value: -1, children: "Off" }),
            n.map((u) => /* @__PURE__ */ g.jsx("option", { value: u.index, children: u.label }, u.index))
          ]
        }
      )
    ] })
  ] });
}
function El({ videoRef: t }) {
  const [e, r] = X(!1);
  ue(() => {
    const i = () => {
      r(!!document.fullscreenElement);
    };
    return document.addEventListener("fullscreenchange", i), () => document.removeEventListener("fullscreenchange", i);
  }, []);
  const n = async () => {
    const i = t.current;
    if (i)
      try {
        if (document.fullscreenElement)
          document.exitFullscreen && await document.exitFullscreen();
        else {
          const s = i.parentElement;
          s != null && s.requestFullscreen && await s.requestFullscreen();
        }
      } catch (s) {
        console.error("Fullscreen toggle failed:", s);
      }
  };
  return /* @__PURE__ */ g.jsx(
    "button",
    {
      onClick: n,
      className: "ctr-btn",
      title: e ? "Exit Fullscreen" : "Enter Fullscreen",
      children: "⛶"
    }
  );
}
const Sl = 1e4;
function Rl({ videoRef: t, mediaId: e }) {
  const [r, n] = X(!1), i = Ce(null), s = Hr(), o = () => {
    n(!0), a();
  }, l = () => {
    n(!1);
  }, a = () => {
    i.current && clearTimeout(i.current), i.current = setTimeout(() => {
      l();
    }, Sl);
  };
  return ue(() => (e && o(), () => {
    i.current && clearTimeout(i.current);
  }), [e]), e ? /* @__PURE__ */ g.jsxs(
    "div",
    {
      className: `ctr-bar ${r ? "show" : ""}`,
      onMouseEnter: o,
      onMouseMove: o,
      onMouseLeave: l,
      onTouchStart: o,
      children: [
        s && /* @__PURE__ */ g.jsx("div", { className: "cluster", children: /* @__PURE__ */ g.jsx(bl, {}) }),
        s && /* @__PURE__ */ g.jsx("div", { className: "cluster flex-1 max-w-md", children: /* @__PURE__ */ g.jsx(xl, {}) }),
        /* @__PURE__ */ g.jsxs("div", { className: "cluster", children: [
          /* @__PURE__ */ g.jsx(wl, { videoRef: t }),
          /* @__PURE__ */ g.jsx("div", { className: "w-px h-4 bg-wp-border-accent opacity-50" }),
          /* @__PURE__ */ g.jsx(_l, { videoRef: t })
        ] }),
        /* @__PURE__ */ g.jsx("div", { className: "cluster-tight", children: /* @__PURE__ */ g.jsx(El, { videoRef: t }) })
      ]
    }
  ) : null;
}
function Cl({ mediaId: t, visible: e }) {
  if (!t) return null;
  const r = (n) => {
    const i = n.split("/").filter(Boolean);
    return i.length >= 2 ? i.slice(-2).join(" ") : i[i.length - 1] || n;
  };
  return /* @__PURE__ */ g.jsx("div", { className: `media-title ${e ? "show" : ""}`, children: r(t) });
}
function Tl({ mediaUrl: t, indexUrl: e, mediaId: r }) {
  const n = Ce(null), [i, s] = X(!1), [o, l] = X([]), [a, m] = X(null), [p, u] = X(!1), y = q((E) => E.readiness), h = q((E) => E.snapshot), w = Ce(!1), x = Ce(null), C = Ce(null), S = Ce(null);
  ue(() => {
    let E = !1;
    return (async () => {
      var N;
      try {
        const I = await fetch(e, { cache: "no-store" });
        if (!I.ok) return;
        const d = await I.json();
        if (E) return;
        l(d.fragments || []), m(d.duration_ms || null), ye() && console.debug("[wp] index_loaded", { count: (N = d.fragments) == null ? void 0 : N.length, duration: d.duration_ms });
      } catch (I) {
        ye() && console.debug("[wp] index_error", I == null ? void 0 : I.message);
      }
    })(), () => {
      E = !0;
    };
  }, [e]), ue(() => {
    let E = null;
    const N = new MediaSource();
    C.current = N, n.current && (E = URL.createObjectURL(N), n.current.src = E);
    const I = () => {
      try {
        const d = N.addSourceBuffer('video/mp4; codecs="avc1.4d401e, mp4a.40.2"');
        x.current = d, d.addEventListener("error", () => {
          ye() && console.debug("[wp] sb_error");
        }), o.length && b();
      } catch (d) {
        ye() && console.debug("[wp] mse_source_error", d == null ? void 0 : d.message);
      }
    };
    return N.addEventListener("sourceopen", I), () => {
      N.removeEventListener("sourceopen", I), E && URL.revokeObjectURL(E), S.current && S.current.abort();
    };
  }, [t, r]), ue(() => {
    var E;
    ((E = C.current) == null ? void 0 : E.readyState) === "open" && x.current && o.length && !w.current && b();
  }, [o]);
  function b() {
    if (!o.length || !x.current) return;
    const E = o[0], N = `bytes=${E.start_byte}-${E.end_byte}`, I = new AbortController();
    S.current = I, fetch(t, { headers: { Range: N }, signal: I.signal }).then((d) => d.arrayBuffer()).then((d) => {
      x.current && (x.current.addEventListener("updateend", k, { once: !0 }), x.current.appendBuffer(d));
    }).catch((d) => {
      ye() && console.debug("[wp] init_fetch_error", d == null ? void 0 : d.message);
    });
  }
  function k() {
    w.current || (w.current = !0, mt().emit("client_ready", { media_id: r, first_appended: !0 }), ye() && console.debug("[wp] client_ready emitted", { mediaId: r })), s(!0);
  }
  return ue(() => {
    const E = n.current;
    if (!E) return;
    h.playing ? E.paused && E.play().catch(() => {
    }) : E.paused || E.pause();
    const N = h.playheadMs;
    if (typeof N == "number" && i) {
      const I = E.currentTime * 1e3, d = N - I, M = Math.abs(d);
      M > 500 ? (E.currentTime = N / 1e3, ye() && console.debug("[wp] drift_snap", { drift: d })) : M > 80 && (E.currentTime = N / 1e3, ye() && console.debug("[wp] drift_nudge", { drift: d }));
    }
  }, [h.playing, h.playheadMs, i]), /* @__PURE__ */ g.jsxs(
    "div",
    {
      className: "relative w-full h-full bg-black",
      onMouseEnter: () => u(!0),
      onMouseMove: () => u(!0),
      onMouseLeave: () => u(!1),
      children: [
        /* @__PURE__ */ g.jsx("video", { ref: n, className: "w-full h-full", playsInline: !0 }),
        /* @__PURE__ */ g.jsx(Cl, { mediaId: r, visible: p }),
        /* @__PURE__ */ g.jsx(Rl, { videoRef: n, mediaId: r }),
        !y.ready && /* @__PURE__ */ g.jsx("div", { className: "absolute inset-0 flex items-center justify-center pointer-events-none", children: /* @__PURE__ */ g.jsxs("div", { className: "px-4 py-2 rounded bg-wp-surface-2/80 text-xs font-medium", children: [
          "Syncing… (",
          y.readyCount,
          "/",
          y.total,
          ")"
        ] }) }),
        a && /* @__PURE__ */ g.jsxs("div", { className: "absolute bottom-2 left-2 text-[10px] opacity-60 bg-black/40 px-2 py-1 rounded", children: [
          (a / 1e3).toFixed(0),
          "s"
        ] })
      ]
    }
  );
}
let tt = null;
const kl = 6e4;
async function Lr(t = "") {
  var l, a;
  const e = Date.now();
  if (tt && tt.prefix === t && e - tt.ts < kl)
    return tt.data;
  const i = `${Vr().serverOrigin.replace(/\/$/, "")}/api/catalog${t ? `?prefix=${encodeURIComponent(t)}` : ""}`, s = await fetch(i, { cache: "no-store" });
  if (!s.ok) throw new Error(`catalog_http_${s.status}`);
  const o = await s.json();
  return ye() && console.debug("[wp] catalog_fetch", { prefix: t, dirs: (l = o.dirs) == null ? void 0 : l.length, files: (a = o.files) == null ? void 0 : a.length }), tt = { ts: e, prefix: t, data: o }, o;
}
function Ml(t) {
  tt && (tt = null);
}
function Pi(t, e) {
  const n = q.getState().allocateClientSeq(), i = { kind: t, client_seq: n, ...e || {} };
  return mt().emit("control", i), n;
}
function Nl(t) {
  return Pi("load", { media_id: t });
}
function Ll() {
  return Pi("home");
}
async function Pl() {
  if (ye())
    try {
      const t = ["output/fmp4/anime", "output/fmp4/movie", "output/fmp4/tv"];
      for (const e of t) {
        const r = await Lr(e);
        console.debug("[wp][probe] catalog", e, { dirs: r.dirs.length, files: r.files.length });
        const n = r.files[0];
        if (n) {
          const i = Al(), s = `${i}/${n.id}/index.json`.replace(/\\/g, "/"), o = `${i}/${n.id}/output_frag.mp4`.replace(/\\/g, "/");
          await Dn(s, "index"), await Dn(o, "fragment", { headers: { Range: "bytes=0-1023" } });
        }
      }
    } catch (t) {
      console.debug("[wp][probe] error", (t == null ? void 0 : t.message) || String(t));
    }
}
function Al() {
  return "/media";
}
async function Dn(t, e, r) {
  const n = performance.now(), i = await fetch(t, r), s = Math.round(performance.now() - n);
  return console.debug("[wp][probe]", e, { url: t, status: i.status, ms: s, bytes: i.headers.get("content-length") }), i;
}
const Ol = ({ open: t, onClose: e }) => {
  const [r, n] = X(!1), [i, s] = X(null), [o, l] = X([]), [a, m] = X(""), p = Wi(async () => {
    n(!0), s(null);
    try {
      const S = [
        { key: "anime", label: "Anime" },
        { key: "movie", label: "Movie" },
        { key: "tv", label: "TV" }
      ], b = "output/fmp4", k = [];
      for (const E of S) {
        const N = `${b}/${E.key}`;
        let I;
        try {
          I = await Lr(N);
        } catch {
          continue;
        }
        const d = [];
        for (const M of I.dirs) {
          let F;
          try {
            F = await Lr(M.path);
          } catch {
            continue;
          }
          const D = F.files.map((U) => ({ type: "episode", name: U.title, mediaId: U.id }));
          D.length && d.push({ type: "series", name: M.name, episodes: D, expanded: !1 });
        }
        d.length && k.push({ type: "category", name: E.label, series: d, expanded: !0 });
      }
      l(k), ye() && Pl();
    } catch (S) {
      s(S.message || "catalog_error");
    } finally {
      n(!1);
    }
  }, []);
  ue(() => {
    t && p();
  }, [t, p]);
  function u(S) {
    Nl(S), ye() && console.debug("[wp] control_load", S), e();
  }
  function y() {
    Ll(), ye() && console.debug("[wp] control_home"), e();
  }
  function h(S, b) {
    l((k) => k.map((E, N) => N !== S ? E : { ...E, series: E.series.map((I, d) => d !== b ? I : { ...I, expanded: !I.expanded }) }));
  }
  function w(S) {
    l((b) => b.map((k, E) => E !== S ? k : { ...k, expanded: !k.expanded }));
  }
  function x() {
    Ml(), p();
  }
  const C = Bn(() => {
    if (!a.trim()) return o;
    const S = a.toLowerCase();
    return o.map((b) => {
      const k = b.series.map((E) => {
        const N = E.episodes.filter((I) => I.name.toLowerCase().includes(S));
        return N.length ? { ...E, episodes: N, expanded: !0 } : E.name.toLowerCase().includes(S) ? { ...E, expanded: !0 } : null;
      }).filter(Boolean);
      return k.length ? { ...b, series: k, expanded: !0 } : b.name.toLowerCase().includes(S) ? { ...b, expanded: !0 } : null;
    }).filter(Boolean);
  }, [o, a]);
  return t ? /* @__PURE__ */ g.jsx("div", { className: "fixed inset-0 bg-black/40 flex justify-end z-40", children: /* @__PURE__ */ g.jsxs("div", { className: "w-[440px] h-full bg-gray-950 border-l border-gray-800 flex flex-col", children: [
    /* @__PURE__ */ g.jsxs("div", { className: "p-3 border-b border-gray-800 flex items-center gap-2 text-sm", children: [
      /* @__PURE__ */ g.jsx("button", { onClick: e, className: "px-2 py-1 bg-gray-800 hover:bg-gray-700 rounded", children: "Close" }),
      /* @__PURE__ */ g.jsx("button", { onClick: y, className: "px-2 py-1 bg-indigo-600 hover:bg-indigo-500 rounded", children: "Home" }),
      /* @__PURE__ */ g.jsx("button", { onClick: x, className: "px-2 py-1 bg-gray-800 hover:bg-gray-700 rounded", children: "Reload" }),
      /* @__PURE__ */ g.jsx("input", { value: a, onChange: (S) => m(S.target.value), placeholder: "search", className: "ml-auto bg-gray-900 border border-gray-700 focus:border-gray-500 outline-none px-2 py-1 rounded text-xs" })
    ] }),
    r && /* @__PURE__ */ g.jsx("div", { className: "px-4 py-2 text-xs text-gray-500", children: "Loading catalog…" }),
    i && /* @__PURE__ */ g.jsx("div", { className: "px-4 py-2 text-xs text-red-400", children: i }),
    /* @__PURE__ */ g.jsxs("div", { className: "flex-1 overflow-auto text-sm py-2", children: [
      C.map((S, b) => /* @__PURE__ */ g.jsxs("div", { className: "px-3 pb-3", children: [
        /* @__PURE__ */ g.jsxs("div", { className: "flex items-center gap-2 cursor-pointer select-none group", onClick: () => w(b), children: [
          /* @__PURE__ */ g.jsx("span", { className: "text-xs uppercase tracking-wider text-gray-500 group-hover:text-gray-300", children: S.name }),
          /* @__PURE__ */ g.jsx("span", { className: "text-[10px] opacity-50", children: S.expanded ? "−" : "+" })
        ] }),
        S.expanded && /* @__PURE__ */ g.jsxs("div", { className: "mt-2 space-y-2", children: [
          S.series.map((k, E) => /* @__PURE__ */ g.jsxs("div", { children: [
            /* @__PURE__ */ g.jsxs("div", { className: "flex items-center gap-2 cursor-pointer text-gray-300 hover:text-white", onClick: () => h(b, E), children: [
              /* @__PURE__ */ g.jsx("span", { className: "text-xs font-medium", children: k.name }),
              /* @__PURE__ */ g.jsx("span", { className: "text-[10px] opacity-40", children: k.expanded ? "−" : "+" })
            ] }),
            k.expanded && /* @__PURE__ */ g.jsxs("div", { className: "mt-1 ml-3 border-l border-gray-800 pl-3 space-y-1", children: [
              k.episodes.map((N) => /* @__PURE__ */ g.jsxs("button", { onClick: () => u(N.mediaId), className: "w-full text-left px-2 py-1 rounded hover:bg-gray-900 flex items-center gap-2 group", children: [
                /* @__PURE__ */ g.jsx("span", { className: "text-[11px] text-gray-400 group-hover:text-gray-200 truncate", children: N.name }),
                /* @__PURE__ */ g.jsx("span", { className: "ml-auto text-[10px] text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity", children: "Load" })
              ] }, N.mediaId)),
              k.episodes.length === 0 && /* @__PURE__ */ g.jsx("div", { className: "text-[11px] text-gray-600 italic", children: "(no episodes)" })
            ] })
          ] }, k.name)),
          S.series.length === 0 && /* @__PURE__ */ g.jsx("div", { className: "text-[11px] text-gray-600 italic", children: "(empty)" })
        ] })
      ] }, S.name)),
      !r && !C.length && /* @__PURE__ */ g.jsx("div", { className: "px-4 py-6 text-center text-xs text-gray-600", children: "No matches" })
    ] }),
    /* @__PURE__ */ g.jsxs("div", { className: "p-2 text-[10px] text-gray-600 border-t border-gray-900 flex justify-between", children: [
      /* @__PURE__ */ g.jsx("span", { children: "Simple Catalog" }),
      ye() && /* @__PURE__ */ g.jsx("span", { className: "opacity-70", children: "verbose" })
    ] })
  ] }) }) : null;
};
function jl({ open: t, onClose: e }) {
  const { name: r, sprite: n, setIdentity: i } = q(), [s, o] = X(r), [l, a] = X(n), [m, p] = X(t);
  ue(() => {
    if (t)
      p(!0);
    else {
      const y = setTimeout(() => p(!1), 320);
      return () => clearTimeout(y);
    }
  }, [t]);
  const u = () => {
    const y = (s || "").trim().slice(0, 32) || "Guest";
    i(y, l), gl(y, l || void 0), e();
  };
  return m ? /* @__PURE__ */ g.jsxs("div", { "aria-hidden": !t, className: `fixed inset-y-0 right-0 w-80 bg-slate-900/95 backdrop-blur border-l border-slate-700 transition-transform duration-300 z-30 flex flex-col ${t ? "translate-x-0" : "translate-x-full"} ${t ? "" : "pointer-events-none"}`, children: [
    /* @__PURE__ */ g.jsxs("div", { className: "p-4 flex items-center justify-between border-b border-slate-700", children: [
      /* @__PURE__ */ g.jsx("h2", { className: "font-semibold text-sm", children: "Identity" }),
      /* @__PURE__ */ g.jsx("button", { type: "button", onClick: e, role: "button", className: "text-xs opacity-70 hover:opacity-100 select-none", children: "Close" })
    ] }),
    /* @__PURE__ */ g.jsxs("div", { className: "p-4 space-y-4 overflow-y-auto text-sm", children: [
      /* @__PURE__ */ g.jsxs("div", { children: [
        /* @__PURE__ */ g.jsx("label", { className: "block text-xs uppercase tracking-wide mb-1 opacity-70", children: "Display Name" }),
        /* @__PURE__ */ g.jsx("input", { value: s, onChange: (y) => o(y.target.value), className: "w-full bg-slate-800 border border-slate-600 rounded px-2 py-1 text-sm", placeholder: "Your name" })
      ] }),
      /* @__PURE__ */ g.jsxs("div", { children: [
        /* @__PURE__ */ g.jsx("label", { className: "block text-xs uppercase tracking-wide mb-1 opacity-70", children: "Character" }),
        /* @__PURE__ */ g.jsx("div", { className: "grid grid-cols-4 gap-3", children: ct.map((y) => /* @__PURE__ */ g.jsxs("button", { onClick: () => {
          a(y), (!s.trim() || ct.includes(s) || s === "Guest") && o(y);
        }, className: `relative group rounded border ${l === y ? "border-emerald-400" : "border-slate-600 hover:border-slate-400"} p-1 flex flex-col items-center gap-1`, children: [
          /* @__PURE__ */ g.jsx("img", { src: Br(y), alt: y, className: "w-12 h-12 object-cover rounded" }),
          /* @__PURE__ */ g.jsx("span", { className: "text-[10px] opacity-70 group-hover:opacity-100 capitalize", children: y })
        ] }, y)) })
      ] }),
      /* @__PURE__ */ g.jsx("div", { className: "pt-2 flex gap-2 items-center", children: /* @__PURE__ */ g.jsx("button", { onClick: u, className: "bg-emerald-500 hover:bg-emerald-400 text-black font-semibold text-sm px-3 py-1 rounded", children: "Update" }) })
    ] })
  ] }) : null;
}
function Dl({ isOpen: t, onValidKey: e }) {
  const [r, n] = X(""), [i, s] = X(!1), [o, l] = X(null);
  ue(() => {
    t && (n(""), l(null), s(!1));
  }, [t]);
  async function a(m) {
    m.preventDefault();
    const p = r.trim();
    if (p) {
      s(!0), l(null);
      try {
        const h = `${Vr().serverOrigin.replace(/\/$/, "")}/api/rooms/validate/${encodeURIComponent(p)}`, w = await fetch(h, { cache: "no-store" });
        if (w.ok)
          e(p);
        else {
          const x = await w.json().catch(() => ({}));
          w.status === 409 && x.error === "leader_occupied" ? l("A leader is already connected to this room. Please try again later or use a different key.") : w.status === 404 || x.error === "invalid_key" ? l("Invalid room key. Please check your key and try again.") : l("Unable to validate room key. Please try again.");
        }
      } catch (u) {
        console.error("Room key validation error:", u), l("Network error. Please check your connection and try again.");
      } finally {
        s(!1);
      }
    }
  }
  return t ? /* @__PURE__ */ g.jsxs("div", { className: "fixed inset-0 z-50 flex items-center justify-center bg-black", children: [
    /* @__PURE__ */ g.jsx(sr, {}),
    /* @__PURE__ */ g.jsx("div", { className: "relative z-10 max-w-md w-full mx-4", children: /* @__PURE__ */ g.jsxs("div", { className: "bg-slate-900/90 border border-slate-700 rounded-lg p-8 backdrop-blur-sm shadow-2xl", children: [
      /* @__PURE__ */ g.jsx("h1", { className: "text-2xl font-bold text-white mb-2 text-center", children: "Join Watchparty" }),
      /* @__PURE__ */ g.jsx("p", { className: "text-sm text-slate-400 mb-6 text-center", children: "Enter your room key to continue" }),
      /* @__PURE__ */ g.jsxs("form", { onSubmit: a, className: "space-y-4", children: [
        /* @__PURE__ */ g.jsxs("div", { children: [
          /* @__PURE__ */ g.jsx("label", { htmlFor: "roomKey", className: "block text-sm font-medium text-slate-300 mb-2", children: "Room Key" }),
          /* @__PURE__ */ g.jsx(
            "input",
            {
              id: "roomKey",
              type: "text",
              value: r,
              onChange: (m) => n(m.target.value),
              placeholder: "Enter room key...",
              disabled: i,
              className: "w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-md text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed",
              autoFocus: !0,
              autoComplete: "off"
            }
          )
        ] }),
        o && /* @__PURE__ */ g.jsx("div", { className: "p-3 bg-red-900/30 border border-red-700/50 rounded-md text-sm text-red-200", children: o }),
        /* @__PURE__ */ g.jsx(
          "button",
          {
            type: "submit",
            disabled: !r.trim() || i,
            className: "w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-600 disabled:cursor-not-allowed text-white font-medium py-2.5 px-4 rounded-md transition-colors flex items-center justify-center gap-2",
            children: i ? /* @__PURE__ */ g.jsxs(g.Fragment, { children: [
              /* @__PURE__ */ g.jsxs("svg", { className: "animate-spin h-4 w-4", xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", children: [
                /* @__PURE__ */ g.jsx("circle", { className: "opacity-25", cx: "12", cy: "12", r: "10", stroke: "currentColor", strokeWidth: "4" }),
                /* @__PURE__ */ g.jsx("path", { className: "opacity-75", fill: "currentColor", d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" })
              ] }),
              /* @__PURE__ */ g.jsx("span", { children: "Validating..." })
            ] }) : /* @__PURE__ */ g.jsx("span", { children: "Join Room" })
          }
        )
      ] }),
      /* @__PURE__ */ g.jsx("div", { className: "mt-6 text-center text-xs text-slate-500", children: "Need a room key? Contact your room host." })
    ] }) })
  ] }) : null;
}
function Il(t) {
  if (!t) return null;
  const e = `/media/${t}`.replace(/\\/g, "/");
  return { mediaUrl: `${e}/output_frag.mp4`, indexUrl: `${e}/index.json` };
}
function Bl() {
  dl();
  const t = q((k) => k.snapshot), { ensureAutoIdentity: e, name: r, sprite: n } = q(), i = si(), s = Ce(!1), o = Bn(() => Il(t.mediaId), [t.mediaId]), [l, a] = X(!1), [m, p] = X(!1), [u, y] = X(null), h = Hr();
  ue(() => {
    const E = new URLSearchParams(window.location.search).get("roomKey") || i.roomKey || null;
    E && y(E);
  }, [i.roomKey]), ue(() => {
    !u || s.current || (e(), fl({
      room_key: u,
      name: r || void 0,
      sprite: n || void 0
    }), s.current = !0);
  }, [u, e, r, n]);
  function w() {
    p(!1), a(!0);
  }
  function x() {
    a(!1), p(!0);
  }
  function C() {
    a(!1);
  }
  function S() {
    p(!1);
  }
  function b(k) {
    y(k);
  }
  return u ? /* @__PURE__ */ g.jsxs("div", { className: "relative min-h-[calc(100vh-120px)] flex", children: [
    /* @__PURE__ */ g.jsxs("div", { className: "flex-1 relative bg-black", children: [
      o ? /* @__PURE__ */ g.jsx(Tl, { mediaUrl: o.mediaUrl, indexUrl: o.indexUrl, mediaId: t.mediaId }) : /* @__PURE__ */ g.jsxs(g.Fragment, { children: [
        /* @__PURE__ */ g.jsx(sr, {}),
        /* @__PURE__ */ g.jsx("div", { className: "absolute inset-0 flex flex-col items-center justify-center gap-4 p-6", children: /* @__PURE__ */ g.jsx("div", { className: "mt-6 p-3 rounded bg-slate-900/70 border border-slate-700/40 backdrop-blur-sm", children: /* @__PURE__ */ g.jsx(ga, {}) }) })
      ] }),
      h && !l && /* @__PURE__ */ g.jsx("button", { onClick: w, className: "fixed bottom-4 left-1/2 -translate-x-1/2 z-40 bg-indigo-600 hover:bg-indigo-500 text-xs px-4 py-2 rounded shadow", children: "Media" })
    ] }),
    /* @__PURE__ */ g.jsx("aside", { className: "w-80 border-l border-slate-800 p-4 hidden md:block text-xs opacity-70", children: "Chat panel placeholder (Phase 5)" }),
    /* @__PURE__ */ g.jsx(Ol, { open: l, onClose: C }),
    /* @__PURE__ */ g.jsx(jl, { open: m, onClose: S, onJoin: () => {
    } }),
    !m && /* @__PURE__ */ g.jsx("button", { onClick: x, className: "fixed bottom-4 right-4 bg-slate-800/80 hover:bg-slate-700 border border-slate-600 text-xs px-3 py-1 rounded shadow backdrop-blur z-40", children: "Identity" })
  ] }) : /* @__PURE__ */ g.jsx(Dl, { isOpen: !0, onValidKey: b });
}
function Ul() {
  return /* @__PURE__ */ g.jsxs("div", { className: "fixed inset-0 bg-black", children: [
    /* @__PURE__ */ g.jsx(sr, {}),
    /* @__PURE__ */ g.jsx("div", { className: "absolute inset-0 flex items-center justify-center", children: /* @__PURE__ */ g.jsxs("div", { className: "text-center", children: [
      /* @__PURE__ */ g.jsx("h1", { className: "text-4xl font-bold text-white mb-4", children: "API is sleeping..." }),
      /* @__PURE__ */ g.jsx("p", { className: "text-slate-400 text-lg", children: "༼ つ ◕_◕ ༽つ HADOKU TAKE MY ENERGY ༼ つ ◕_◕ ༽つ" })
    ] }) })
  ] });
}
function Fl() {
  const t = At(), e = ii();
  return si(), ue(() => {
    const r = new URLSearchParams(window.location.search), n = r.get("roomKey") || r.get("room");
    n && (t.pathname === "/" || t.pathname === "") && e(`/room/${encodeURIComponent(n)}`, { replace: !0 });
  }, [t.pathname, e]), t.pathname === "/" || t.pathname === "" ? /* @__PURE__ */ g.jsx(ma, {}) : t.pathname.startsWith("/room") ? /* @__PURE__ */ g.jsx(Bl, {}) : /* @__PURE__ */ g.jsx("div", { className: "p-6", children: "Not Found" });
}
function In(t) {
  const [e, r] = X(!1), [n, i] = X(!0), s = {
    serverOrigin: t.serverOrigin || er.serverOrigin,
    defaultRoomKey: t.defaultRoomKey || er.defaultRoomKey
  };
  return ue(() => {
    async function o() {
      const a = s.serverOrigin.replace(/\/$/, "") + "/healthz";
      try {
        (await fetch(a, {
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
  }, [s.serverOrigin]), ue(() => {
    function o() {
      for (const a of ct) {
        const m = new Image();
        m.decoding = "async", m.loading = "eager", m.src = Br(a);
      }
    }
    function l() {
      "requestIdleCallback" in window ? window.requestIdleCallback(o, { timeout: 2e3 }) : setTimeout(o, 600);
    }
    document.readyState === "complete" ? l() : window.addEventListener("load", l, { once: !0 });
  }, []), n ? /* @__PURE__ */ g.jsx("div", { className: "min-h-screen flex items-center justify-center bg-black", children: /* @__PURE__ */ g.jsx("div", { className: "text-slate-400", children: "Checking server status..." }) }) : e ? /* @__PURE__ */ g.jsx(Ul, {}) : /* @__PURE__ */ g.jsx(Mi.Provider, { value: s, children: /* @__PURE__ */ g.jsxs("div", { className: "min-h-screen flex flex-col", children: [
    /* @__PURE__ */ g.jsx("header", { className: "p-3 border-b border-slate-700 flex items-center gap-4 text-sm", children: /* @__PURE__ */ g.jsx(ui, { to: "/", className: "font-semibold", children: "Watchparty" }) }),
    /* @__PURE__ */ g.jsxs("main", { className: "flex-1", children: [
      /* @__PURE__ */ g.jsx(Fl, {}),
      /* @__PURE__ */ g.jsx(go, {})
    ] }),
    /* @__PURE__ */ g.jsx(ha, {})
  ] }) });
}
function zl({ basename: t = "/watchparty", appProps: e } = {}) {
  const r = e ?? {}, n = [
    { path: "/", element: /* @__PURE__ */ g.jsx(In, { ...r }) },
    { path: "/room/:roomKey", element: /* @__PURE__ */ g.jsx(In, { ...r }) }
  ];
  return So(n, { basename: t });
}
function $l(t, e, r) {
  const n = Ki(t), i = r ? /* @__PURE__ */ g.jsx(Lt.StrictMode, { children: e }) : e;
  return n.render(i), n;
}
function Wl(t, e = {}) {
  const { basename: r, strictMode: n = !0, ...i } = e;
  ul({
    serverOrigin: i.serverOrigin,
    defaultRoomKey: i.defaultRoomKey
  });
  const s = t.__watchparty;
  s == null || s.root.unmount();
  const o = zl({
    basename: r,
    appProps: i
  }), a = { root: $l(t, /* @__PURE__ */ g.jsx(Ao, { router: o }), n) };
  return t.__watchparty = a, o;
}
function Kl(t) {
  const e = t.__watchparty;
  e == null || e.root.unmount(), e && delete t.__watchparty;
}
export {
  zl as createWatchpartyRouter,
  Wl as mount,
  Kl as unmount
};
//# sourceMappingURL=index.js.map
