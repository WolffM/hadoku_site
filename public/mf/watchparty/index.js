import * as S from "react";
import Nt, { useEffect as ye, useRef as qe, createContext as $i, useContext as qi, useState as ce, useCallback as Vi, useMemo as In } from "react";
import { createRoot as Hi } from "react-dom/client";
function Wi(t, e) {
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
function Bn(t) {
  return t && t.__esModule && Object.prototype.hasOwnProperty.call(t, "default") ? t.default : t;
}
var Un = { exports: {} }, tr = {};
/**
 * @license React
 * react-jsx-runtime.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var Ki = Symbol.for("react.transitional.element"), Yi = Symbol.for("react.fragment");
function Fn(t, e, r) {
  var n = null;
  if (r !== void 0 && (n = "" + r), e.key !== void 0 && (n = "" + e.key), "key" in e) {
    r = {};
    for (var i in e)
      i !== "key" && (r[i] = e[i]);
  } else r = e;
  return e = r.ref, {
    $$typeof: Ki,
    type: t,
    key: n,
    ref: e !== void 0 ? e : null,
    props: r
  };
}
tr.Fragment = Yi;
tr.jsx = Fn;
tr.jsxs = Fn;
Un.exports = tr;
var v = Un.exports, zn = { exports: {} }, pe = {};
/**
 * @license React
 * react-dom.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var Ji = Nt;
function $n(t) {
  var e = "https://react.dev/errors/" + t;
  if (1 < arguments.length) {
    e += "?args[]=" + encodeURIComponent(arguments[1]);
    for (var r = 2; r < arguments.length; r++)
      e += "&args[]=" + encodeURIComponent(arguments[r]);
  }
  return "Minified React error #" + t + "; visit " + e + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings.";
}
function ze() {
}
var he = {
  d: {
    f: ze,
    r: function() {
      throw Error($n(522));
    },
    D: ze,
    C: ze,
    L: ze,
    m: ze,
    X: ze,
    S: ze,
    M: ze
  },
  p: 0,
  findDOMNode: null
}, Xi = Symbol.for("react.portal");
function Gi(t, e, r) {
  var n = 3 < arguments.length && arguments[3] !== void 0 ? arguments[3] : null;
  return {
    $$typeof: Xi,
    key: n == null ? null : "" + n,
    children: t,
    containerInfo: e,
    implementation: r
  };
}
var Ct = Ji.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE;
function rr(t, e) {
  if (t === "font") return "";
  if (typeof e == "string")
    return e === "use-credentials" ? e : "";
}
pe.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = he;
pe.createPortal = function(t, e) {
  var r = 2 < arguments.length && arguments[2] !== void 0 ? arguments[2] : null;
  if (!e || e.nodeType !== 1 && e.nodeType !== 9 && e.nodeType !== 11)
    throw Error($n(299));
  return Gi(t, e, null, r);
};
pe.flushSync = function(t) {
  var e = Ct.T, r = he.p;
  try {
    if (Ct.T = null, he.p = 2, t) return t();
  } finally {
    Ct.T = e, he.p = r, he.d.f();
  }
};
pe.preconnect = function(t, e) {
  typeof t == "string" && (e ? (e = e.crossOrigin, e = typeof e == "string" ? e === "use-credentials" ? e : "" : void 0) : e = null, he.d.C(t, e));
};
pe.prefetchDNS = function(t) {
  typeof t == "string" && he.d.D(t);
};
pe.preinit = function(t, e) {
  if (typeof t == "string" && e && typeof e.as == "string") {
    var r = e.as, n = rr(r, e.crossOrigin), i = typeof e.integrity == "string" ? e.integrity : void 0, s = typeof e.fetchPriority == "string" ? e.fetchPriority : void 0;
    r === "style" ? he.d.S(
      t,
      typeof e.precedence == "string" ? e.precedence : void 0,
      {
        crossOrigin: n,
        integrity: i,
        fetchPriority: s
      }
    ) : r === "script" && he.d.X(t, {
      crossOrigin: n,
      integrity: i,
      fetchPriority: s,
      nonce: typeof e.nonce == "string" ? e.nonce : void 0
    });
  }
};
pe.preinitModule = function(t, e) {
  if (typeof t == "string")
    if (typeof e == "object" && e !== null) {
      if (e.as == null || e.as === "script") {
        var r = rr(
          e.as,
          e.crossOrigin
        );
        he.d.M(t, {
          crossOrigin: r,
          integrity: typeof e.integrity == "string" ? e.integrity : void 0,
          nonce: typeof e.nonce == "string" ? e.nonce : void 0
        });
      }
    } else e == null && he.d.M(t);
};
pe.preload = function(t, e) {
  if (typeof t == "string" && typeof e == "object" && e !== null && typeof e.as == "string") {
    var r = e.as, n = rr(r, e.crossOrigin);
    he.d.L(t, r, {
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
pe.preloadModule = function(t, e) {
  if (typeof t == "string")
    if (e) {
      var r = rr(e.as, e.crossOrigin);
      he.d.m(t, {
        as: typeof e.as == "string" && e.as !== "script" ? e.as : void 0,
        crossOrigin: r,
        integrity: typeof e.integrity == "string" ? e.integrity : void 0
      });
    } else he.d.m(t);
};
pe.requestFormReset = function(t) {
  he.d.r(t);
};
pe.unstable_batchedUpdates = function(t, e) {
  return t(e);
};
pe.useFormState = function(t, e, r) {
  return Ct.H.useFormState(t, e, r);
};
pe.useFormStatus = function() {
  return Ct.H.useHostTransitionStatus();
};
pe.version = "19.1.1";
function qn() {
  if (!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > "u" || typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE != "function"))
    try {
      __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(qn);
    } catch (t) {
      console.error(t);
    }
}
qn(), zn.exports = pe;
var Vn = zn.exports;
const Qi = /* @__PURE__ */ Bn(Vn), Zi = /* @__PURE__ */ Wi({
  __proto__: null,
  default: Qi
}, [Vn]);
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
function G() {
  return G = Object.assign ? Object.assign.bind() : function(t) {
    for (var e = 1; e < arguments.length; e++) {
      var r = arguments[e];
      for (var n in r)
        Object.prototype.hasOwnProperty.call(r, n) && (t[n] = r[n]);
    }
    return t;
  }, G.apply(this, arguments);
}
var ne;
(function(t) {
  t.Pop = "POP", t.Push = "PUSH", t.Replace = "REPLACE";
})(ne || (ne = {}));
const nn = "popstate";
function es(t) {
  t === void 0 && (t = {});
  function e(n, i) {
    let {
      pathname: s,
      search: o,
      hash: l
    } = n.location;
    return Tt(
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
  return rs(e, r, null, t);
}
function $(t, e) {
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
function ts() {
  return Math.random().toString(36).substr(2, 8);
}
function sn(t, e) {
  return {
    usr: t.state,
    key: t.key,
    idx: e
  };
}
function Tt(t, e, r, n) {
  return r === void 0 && (r = null), G({
    pathname: typeof t == "string" ? t : t.pathname,
    search: "",
    hash: ""
  }, typeof e == "string" ? We(e) : e, {
    state: r,
    // TODO: This could be cleaned up.  push/replace should probably just take
    // full Locations now and avoid the need to run through this flow at all
    // But that's a pretty big refactor to the current test suite so going to
    // keep as is for the time being and just let any incoming keys take precedence
    key: e && e.key || n || ts()
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
function rs(t, e, r, n) {
  n === void 0 && (n = {});
  let {
    window: i = document.defaultView,
    v5Compat: s = !1
  } = n, o = i.history, l = ne.Pop, a = null, d = f();
  d == null && (d = 0, o.replaceState(G({}, o.state, {
    idx: d
  }), ""));
  function f() {
    return (o.state || {
      idx: null
    }).idx;
  }
  function m() {
    l = ne.Pop;
    let M = f(), C = M == null ? null : M - d;
    d = M, a && a({
      action: l,
      location: x.location,
      delta: C
    });
  }
  function b(M, C) {
    l = ne.Push;
    let p = Tt(x.location, M, C);
    d = f() + 1;
    let E = sn(p, d), R = x.createHref(p);
    try {
      o.pushState(E, "", R);
    } catch (k) {
      if (k instanceof DOMException && k.name === "DataCloneError")
        throw k;
      i.location.assign(R);
    }
    s && a && a({
      action: l,
      location: x.location,
      delta: 1
    });
  }
  function h(M, C) {
    l = ne.Replace;
    let p = Tt(x.location, M, C);
    d = f();
    let E = sn(p, d), R = x.createHref(p);
    o.replaceState(E, "", R), s && a && a({
      action: l,
      location: x.location,
      delta: 0
    });
  }
  function _(M) {
    let C = i.location.origin !== "null" ? i.location.origin : i.location.href, p = typeof M == "string" ? M : nt(M);
    return p = p.replace(/ $/, "%20"), $(C, "No window.location.(origin|href) available to create URL for href: " + p), new URL(p, C);
  }
  let x = {
    get action() {
      return l;
    },
    get location() {
      return t(i, o);
    },
    listen(M) {
      if (a)
        throw new Error("A history only accepts one active listener");
      return i.addEventListener(nn, m), a = M, () => {
        i.removeEventListener(nn, m), a = null;
      };
    },
    createHref(M) {
      return e(i, M);
    },
    createURL: _,
    encodeLocation(M) {
      let C = _(M);
      return {
        pathname: C.pathname,
        search: C.search,
        hash: C.hash
      };
    },
    push: b,
    replace: h,
    go(M) {
      return o.go(M);
    }
  };
  return x;
}
var J;
(function(t) {
  t.data = "data", t.deferred = "deferred", t.redirect = "redirect", t.error = "error";
})(J || (J = {}));
const ns = /* @__PURE__ */ new Set(["lazy", "caseSensitive", "path", "id", "index", "children"]);
function is(t) {
  return t.index === !0;
}
function Gt(t, e, r, n) {
  return r === void 0 && (r = []), n === void 0 && (n = {}), t.map((i, s) => {
    let o = [...r, String(s)], l = typeof i.id == "string" ? i.id : o.join("-");
    if ($(i.index !== !0 || !i.children, "Cannot specify children on an index route"), $(!n[l], 'Found a route id collision on id "' + l + `".  Route id's must be globally unique within Data Router usages`), is(i)) {
      let a = G({}, i, e(i), {
        id: l
      });
      return n[l] = a, a;
    } else {
      let a = G({}, i, e(i), {
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
  let o = Hn(t);
  os(o);
  let l = null;
  for (let a = 0; l == null && a < o.length; ++a) {
    let d = ys(s);
    l = ms(o[a], d, n);
  }
  return l;
}
function ss(t, e) {
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
function Hn(t, e, r, n) {
  e === void 0 && (e = []), r === void 0 && (r = []), n === void 0 && (n = "");
  let i = (s, o, l) => {
    let a = {
      relativePath: l === void 0 ? s.path || "" : l,
      caseSensitive: s.caseSensitive === !0,
      childrenIndex: o,
      route: s
    };
    a.relativePath.startsWith("/") && ($(a.relativePath.startsWith(n), 'Absolute route path "' + a.relativePath + '" nested under path ' + ('"' + n + '" is not valid. An absolute child route path ') + "must start with the combined path of all its parent routes."), a.relativePath = a.relativePath.slice(n.length));
    let d = Le([n, a.relativePath]), f = r.concat(a);
    s.children && s.children.length > 0 && ($(
      // Our types know better, but runtime JS may not!
      // @ts-expect-error
      s.index !== !0,
      "Index routes must not have child routes. Please remove " + ('all child routes from route path "' + d + '".')
    ), Hn(s.children, e, f, d)), !(s.path == null && !s.index) && e.push({
      path: d,
      score: hs(d, s.index),
      routesMeta: f
    });
  };
  return t.forEach((s, o) => {
    var l;
    if (s.path === "" || !((l = s.path) != null && l.includes("?")))
      i(s, o);
    else
      for (let a of Wn(s.path))
        i(s, o, a);
  }), e;
}
function Wn(t) {
  let e = t.split("/");
  if (e.length === 0) return [];
  let [r, ...n] = e, i = r.endsWith("?"), s = r.replace(/\?$/, "");
  if (n.length === 0)
    return i ? [s, ""] : [s];
  let o = Wn(n.join("/")), l = [];
  return l.push(...o.map((a) => a === "" ? s : [s, a].join("/"))), i && l.push(...o), l.map((a) => t.startsWith("/") && a === "" ? "/" : a);
}
function os(t) {
  t.sort((e, r) => e.score !== r.score ? r.score - e.score : ps(e.routesMeta.map((n) => n.childrenIndex), r.routesMeta.map((n) => n.childrenIndex)));
}
const as = /^:[\w-]+$/, ls = 3, cs = 2, us = 1, ds = 10, fs = -2, on = (t) => t === "*";
function hs(t, e) {
  let r = t.split("/"), n = r.length;
  return r.some(on) && (n += fs), e && (n += cs), r.filter((i) => !on(i)).reduce((i, s) => i + (as.test(s) ? ls : s === "" ? us : ds), n);
}
function ps(t, e) {
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
function ms(t, e, r) {
  r === void 0 && (r = !1);
  let {
    routesMeta: n
  } = t, i = {}, s = "/", o = [];
  for (let l = 0; l < n.length; ++l) {
    let a = n[l], d = l === n.length - 1, f = s === "/" ? e : e.slice(s.length) || "/", m = an({
      path: a.relativePath,
      caseSensitive: a.caseSensitive,
      end: d
    }, f), b = a.route;
    if (!m && d && r && !n[n.length - 1].route.index && (m = an({
      path: a.relativePath,
      caseSensitive: a.caseSensitive,
      end: !1
    }, f)), !m)
      return null;
    Object.assign(i, m.params), o.push({
      // TODO: Can this as be avoided?
      params: i,
      pathname: Le([s, m.pathname]),
      pathnameBase: xs(Le([s, m.pathnameBase])),
      route: b
    }), m.pathnameBase !== "/" && (s = Le([s, m.pathnameBase]));
  }
  return o;
}
function an(t, e) {
  typeof t == "string" && (t = {
    path: t,
    caseSensitive: !1,
    end: !0
  });
  let [r, n] = gs(t.path, t.caseSensitive, t.end), i = e.match(r);
  if (!i) return null;
  let s = i[0], o = s.replace(/(.)\/+$/, "$1"), l = i.slice(1);
  return {
    params: n.reduce((d, f, m) => {
      let {
        paramName: b,
        isOptional: h
      } = f;
      if (b === "*") {
        let x = l[m] || "";
        o = s.slice(0, s.length - x.length).replace(/(.)\/+$/, "$1");
      }
      const _ = l[m];
      return h && !_ ? d[b] = void 0 : d[b] = (_ || "").replace(/%2F/g, "/"), d;
    }, {}),
    pathname: s,
    pathnameBase: o,
    pattern: t
  };
}
function gs(t, e, r) {
  e === void 0 && (e = !1), r === void 0 && (r = !0), dt(t === "*" || !t.endsWith("*") || t.endsWith("/*"), 'Route path "' + t + '" will be treated as if it were ' + ('"' + t.replace(/\*$/, "/*") + '" because the `*` character must ') + "always follow a `/` in the pattern. To get rid of this warning, " + ('please change the route path to "' + t.replace(/\*$/, "/*") + '".'));
  let n = [], i = "^" + t.replace(/\/*\*?$/, "").replace(/^\/*/, "/").replace(/[\\.*+^${}|()[\]]/g, "\\$&").replace(/\/:([\w-]+)(\?)?/g, (o, l, a) => (n.push({
    paramName: l,
    isOptional: a != null
  }), a ? "/?([^\\/]+)?" : "/([^\\/]+)"));
  return t.endsWith("*") ? (n.push({
    paramName: "*"
  }), i += t === "*" || t === "/*" ? "(.*)$" : "(?:\\/(.+)|\\/*)$") : r ? i += "\\/*$" : t !== "" && t !== "/" && (i += "(?:(?=\\/|$))"), [new RegExp(i, e ? void 0 : "i"), n];
}
function ys(t) {
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
function vs(t, e) {
  e === void 0 && (e = "/");
  let {
    pathname: r,
    search: n = "",
    hash: i = ""
  } = typeof t == "string" ? We(t) : t;
  return {
    pathname: r ? r.startsWith("/") ? r : bs(r, e) : e,
    search: ws(n),
    hash: _s(i)
  };
}
function bs(t, e) {
  let r = e.replace(/\/+$/, "").split("/");
  return t.split("/").forEach((i) => {
    i === ".." ? r.length > 1 && r.pop() : i !== "." && r.push(i);
  }), r.length > 1 ? r.join("/") : "/";
}
function pr(t, e, r, n) {
  return "Cannot include a '" + t + "' character in a manually specified " + ("`to." + e + "` field [" + JSON.stringify(n) + "].  Please separate it out to the ") + ("`to." + r + "` field. Alternatively you may provide the full path as ") + 'a string in <Link to="..."> and the router will parse it for you.';
}
function Kn(t) {
  return t.filter((e, r) => r === 0 || e.route.path && e.route.path.length > 0);
}
function Lr(t, e) {
  let r = Kn(t);
  return e ? r.map((n, i) => i === r.length - 1 ? n.pathname : n.pathnameBase) : r.map((n) => n.pathnameBase);
}
function Or(t, e, r, n) {
  n === void 0 && (n = !1);
  let i;
  typeof t == "string" ? i = We(t) : (i = G({}, t), $(!i.pathname || !i.pathname.includes("?"), pr("?", "pathname", "search", i)), $(!i.pathname || !i.pathname.includes("#"), pr("#", "pathname", "hash", i)), $(!i.search || !i.search.includes("#"), pr("#", "search", "hash", i)));
  let s = t === "" || i.pathname === "", o = s ? "/" : i.pathname, l;
  if (o == null)
    l = r;
  else {
    let m = e.length - 1;
    if (!n && o.startsWith("..")) {
      let b = o.split("/");
      for (; b[0] === ".."; )
        b.shift(), m -= 1;
      i.pathname = b.join("/");
    }
    l = m >= 0 ? e[m] : "/";
  }
  let a = vs(i, l), d = o && o !== "/" && o.endsWith("/"), f = (s || o === ".") && r.endsWith("/");
  return !a.pathname.endsWith("/") && (d || f) && (a.pathname += "/"), a;
}
const Le = (t) => t.join("/").replace(/\/\/+/g, "/"), xs = (t) => t.replace(/\/+$/, "").replace(/^\/*/, "/"), ws = (t) => !t || t === "?" ? "" : t.startsWith("?") ? t : "?" + t, _s = (t) => !t || t === "#" ? "" : t.startsWith("#") ? t : "#" + t;
class Qt {
  constructor(e, r, n, i) {
    i === void 0 && (i = !1), this.status = e, this.statusText = r || "", this.internal = i, n instanceof Error ? (this.data = n.toString(), this.error = n) : this.data = n;
  }
}
function kt(t) {
  return t != null && typeof t.status == "number" && typeof t.statusText == "string" && typeof t.internal == "boolean" && "data" in t;
}
const Yn = ["post", "put", "patch", "delete"], Es = new Set(Yn), Ss = ["get", ...Yn], Rs = new Set(Ss), Cs = /* @__PURE__ */ new Set([301, 302, 303, 307, 308]), Ts = /* @__PURE__ */ new Set([307, 308]), mr = {
  state: "idle",
  location: void 0,
  formMethod: void 0,
  formAction: void 0,
  formEncType: void 0,
  formData: void 0,
  json: void 0,
  text: void 0
}, ks = {
  state: "idle",
  data: void 0,
  formMethod: void 0,
  formAction: void 0,
  formEncType: void 0,
  formData: void 0,
  json: void 0,
  text: void 0
}, xt = {
  state: "unblocked",
  proceed: void 0,
  reset: void 0,
  location: void 0
}, Ar = /^(?:[a-z][a-z0-9+.-]*:|\/\/)/i, Ms = (t) => ({
  hasErrorBoundary: !!t.hasErrorBoundary
}), Jn = "remix-router-transitions";
function Ns(t) {
  const e = t.window ? t.window : typeof window < "u" ? window : void 0, r = typeof e < "u" && typeof e.document < "u" && typeof e.document.createElement < "u", n = !r;
  $(t.routes.length > 0, "You must provide a non-empty routes array to createRouter");
  let i;
  if (t.mapRouteProperties)
    i = t.mapRouteProperties;
  else if (t.detectErrorBoundary) {
    let c = t.detectErrorBoundary;
    i = (u) => ({
      hasErrorBoundary: c(u)
    });
  } else
    i = Ms;
  let s = {}, o = Gt(t.routes, i, void 0, s), l, a = t.basename || "/", d = t.dataStrategy || As, f = t.patchRoutesOnNavigation, m = G({
    v7_fetcherPersist: !1,
    v7_normalizeFormMethod: !1,
    v7_partialHydration: !1,
    v7_prependBasename: !1,
    v7_relativeSplatPath: !1,
    v7_skipActionErrorRevalidation: !1
  }, t.future), b = null, h = /* @__PURE__ */ new Set(), _ = null, x = null, M = null, C = t.hydrationData != null, p = Qe(o, t.history.location, a), E = !1, R = null;
  if (p == null && !f) {
    let c = me(404, {
      pathname: t.history.location.pathname
    }), {
      matches: u,
      route: y
    } = vn(o);
    p = u, R = {
      [y.id]: c
    };
  }
  p && !t.hydrationData && Bt(p, o, t.history.location.pathname).active && (p = null);
  let k;
  if (p)
    if (p.some((c) => c.route.lazy))
      k = !1;
    else if (!p.some((c) => c.route.loader))
      k = !0;
    else if (m.v7_partialHydration) {
      let c = t.hydrationData ? t.hydrationData.loaderData : null, u = t.hydrationData ? t.hydrationData.errors : null;
      if (u) {
        let y = p.findIndex((w) => u[w.route.id] !== void 0);
        k = p.slice(0, y + 1).every((w) => !_r(w.route, c, u));
      } else
        k = p.every((y) => !_r(y.route, c, u));
    } else
      k = t.hydrationData != null;
  else if (k = !1, p = [], m.v7_partialHydration) {
    let c = Bt(null, o, t.history.location.pathname);
    c.active && c.matches && (E = !0, p = c.matches);
  }
  let q, g = {
    historyAction: t.history.action,
    location: t.history.location,
    matches: p,
    initialized: k,
    navigation: mr,
    // Don't restore on initial updateState() if we were SSR'd
    restoreScrollPosition: t.hydrationData != null ? !1 : null,
    preventScrollReset: !1,
    revalidation: "idle",
    loaderData: t.hydrationData && t.hydrationData.loaderData || {},
    actionData: t.hydrationData && t.hydrationData.actionData || null,
    errors: t.hydrationData && t.hydrationData.errors || R,
    fetchers: /* @__PURE__ */ new Map(),
    blockers: /* @__PURE__ */ new Map()
  }, N = ne.Pop, U = !1, j, B = !1, F = /* @__PURE__ */ new Map(), oe = null, ae = !1, se = !1, Ae = [], we = /* @__PURE__ */ new Set(), te = /* @__PURE__ */ new Map(), Ke = 0, De = -1, je = /* @__PURE__ */ new Map(), fe = /* @__PURE__ */ new Set(), Te = /* @__PURE__ */ new Map(), Ye = /* @__PURE__ */ new Map(), ve = /* @__PURE__ */ new Set(), Ie = /* @__PURE__ */ new Map(), Se = /* @__PURE__ */ new Map(), Be;
  function Hr() {
    if (b = t.history.listen((c) => {
      let {
        action: u,
        location: y,
        delta: w
      } = c;
      if (Be) {
        Be(), Be = void 0;
        return;
      }
      dt(Se.size === 0 || w != null, "You are trying to use a blocker on a POP navigation to a location that was not created by @remix-run/router. This will fail silently in production. This can happen if you are navigating outside the router via `window.history.pushState`/`window.location.hash` instead of using router navigation APIs.  This can also happen if you are using createHashRouter and the user manually changes the URL.");
      let T = Zr({
        currentLocation: g.location,
        nextLocation: y,
        historyAction: u
      });
      if (T && w != null) {
        let D = new Promise((I) => {
          Be = I;
        });
        t.history.go(w * -1), It(T, {
          state: "blocked",
          location: y,
          proceed() {
            It(T, {
              state: "proceeding",
              proceed: void 0,
              reset: void 0,
              location: y
            }), D.then(() => t.history.go(w));
          },
          reset() {
            let I = new Map(g.blockers);
            I.set(T, xt), ue({
              blockers: I
            });
          }
        });
        return;
      }
      return Me(u, y);
    }), r) {
      Ys(e, F);
      let c = () => Js(e, F);
      e.addEventListener("pagehide", c), oe = () => e.removeEventListener("pagehide", c);
    }
    return g.initialized || Me(ne.Pop, g.location, {
      initialHydration: !0
    }), q;
  }
  function At() {
    b && b(), oe && oe(), h.clear(), j && j.abort(), g.fetchers.forEach((c, u) => jt(u)), g.blockers.forEach((c, u) => Qr(u));
  }
  function Je(c) {
    return h.add(c), () => h.delete(c);
  }
  function ue(c, u) {
    u === void 0 && (u = {}), g = G({}, g, c);
    let y = [], w = [];
    m.v7_fetcherPersist && g.fetchers.forEach((T, D) => {
      T.state === "idle" && (ve.has(D) ? w.push(D) : y.push(D));
    }), ve.forEach((T) => {
      !g.fetchers.has(T) && !te.has(T) && w.push(T);
    }), [...h].forEach((T) => T(g, {
      deletedFetchers: w,
      viewTransitionOpts: u.viewTransitionOpts,
      flushSync: u.flushSync === !0
    })), m.v7_fetcherPersist ? (y.forEach((T) => g.fetchers.delete(T)), w.forEach((T) => jt(T))) : w.forEach((T) => ve.delete(T));
  }
  function ke(c, u, y) {
    var w, T;
    let {
      flushSync: D
    } = y === void 0 ? {} : y, I = g.actionData != null && g.navigation.formMethod != null && _e(g.navigation.formMethod) && g.navigation.state === "loading" && ((w = c.state) == null ? void 0 : w._isRedirect) !== !0, L;
    u.actionData ? Object.keys(u.actionData).length > 0 ? L = u.actionData : L = null : I ? L = g.actionData : L = null;
    let O = u.loaderData ? gn(g.loaderData, u.loaderData, u.matches || [], u.errors) : g.loaderData, P = g.blockers;
    P.size > 0 && (P = new Map(P), P.forEach((H, de) => P.set(de, xt)));
    let A = U === !0 || g.navigation.formMethod != null && _e(g.navigation.formMethod) && ((T = c.state) == null ? void 0 : T._isRedirect) !== !0;
    l && (o = l, l = void 0), ae || N === ne.Pop || (N === ne.Push ? t.history.push(c, c.state) : N === ne.Replace && t.history.replace(c, c.state));
    let z;
    if (N === ne.Pop) {
      let H = F.get(g.location.pathname);
      H && H.has(c.pathname) ? z = {
        currentLocation: g.location,
        nextLocation: c
      } : F.has(c.pathname) && (z = {
        currentLocation: c,
        nextLocation: g.location
      });
    } else if (B) {
      let H = F.get(g.location.pathname);
      H ? H.add(c.pathname) : (H = /* @__PURE__ */ new Set([c.pathname]), F.set(g.location.pathname, H)), z = {
        currentLocation: g.location,
        nextLocation: c
      };
    }
    ue(G({}, u, {
      actionData: L,
      loaderData: O,
      historyAction: N,
      location: c,
      initialized: !0,
      navigation: mr,
      revalidation: "idle",
      restoreScrollPosition: tn(c, u.matches || g.matches),
      preventScrollReset: A,
      blockers: P
    }), {
      viewTransitionOpts: z,
      flushSync: D === !0
    }), N = ne.Pop, U = !1, B = !1, ae = !1, se = !1, Ae = [];
  }
  async function mt(c, u) {
    if (typeof c == "number") {
      t.history.go(c);
      return;
    }
    let y = wr(g.location, g.matches, a, m.v7_prependBasename, c, m.v7_relativeSplatPath, u == null ? void 0 : u.fromRouteId, u == null ? void 0 : u.relative), {
      path: w,
      submission: T,
      error: D
    } = ln(m.v7_normalizeFormMethod, !1, y, u), I = g.location, L = Tt(g.location, w, u && u.state);
    L = G({}, L, t.history.encodeLocation(L));
    let O = u && u.replace != null ? u.replace : void 0, P = ne.Push;
    O === !0 ? P = ne.Replace : O === !1 || T != null && _e(T.formMethod) && T.formAction === g.location.pathname + g.location.search && (P = ne.Replace);
    let A = u && "preventScrollReset" in u ? u.preventScrollReset === !0 : void 0, z = (u && u.flushSync) === !0, H = Zr({
      currentLocation: I,
      nextLocation: L,
      historyAction: P
    });
    if (H) {
      It(H, {
        state: "blocked",
        location: L,
        proceed() {
          It(H, {
            state: "proceeding",
            proceed: void 0,
            reset: void 0,
            location: L
          }), mt(c, u);
        },
        reset() {
          let de = new Map(g.blockers);
          de.set(H, xt), ue({
            blockers: de
          });
        }
      });
      return;
    }
    return await Me(P, L, {
      submission: T,
      // Send through the formData serialization error if we have one so we can
      // render at the right error boundary after we match routes
      pendingError: D,
      preventScrollReset: A,
      replace: u && u.replace,
      enableViewTransition: u && u.viewTransition,
      flushSync: z
    });
  }
  function Dt() {
    if (ur(), ue({
      revalidation: "loading"
    }), g.navigation.state !== "submitting") {
      if (g.navigation.state === "idle") {
        Me(g.historyAction, g.location, {
          startUninterruptedRevalidation: !0
        });
        return;
      }
      Me(N || g.historyAction, g.navigation.location, {
        overrideNavigation: g.navigation,
        // Proxy through any rending view transition
        enableViewTransition: B === !0
      });
    }
  }
  async function Me(c, u, y) {
    j && j.abort(), j = null, N = c, ae = (y && y.startUninterruptedRevalidation) === !0, Bi(g.location, g.matches), U = (y && y.preventScrollReset) === !0, B = (y && y.enableViewTransition) === !0;
    let w = l || o, T = y && y.overrideNavigation, D = y != null && y.initialHydration && g.matches && g.matches.length > 0 && !E ? (
      // `matchRoutes()` has already been called if we're in here via `router.initialize()`
      g.matches
    ) : Qe(w, u, a), I = (y && y.flushSync) === !0;
    if (D && g.initialized && !se && Fs(g.location, u) && !(y && y.submission && _e(y.submission.formMethod))) {
      ke(u, {
        matches: D
      }, {
        flushSync: I
      });
      return;
    }
    let L = Bt(D, w, u.pathname);
    if (L.active && L.matches && (D = L.matches), !D) {
      let {
        error: X,
        notFoundMatches: Y,
        route: Q
      } = dr(u.pathname);
      ke(u, {
        matches: Y,
        loaderData: {},
        errors: {
          [Q.id]: X
        }
      }, {
        flushSync: I
      });
      return;
    }
    j = new AbortController();
    let O = lt(t.history, u, j.signal, y && y.submission), P;
    if (y && y.pendingError)
      P = [Ze(D).route.id, {
        type: J.error,
        error: y.pendingError
      }];
    else if (y && y.submission && _e(y.submission.formMethod)) {
      let X = await lr(O, u, y.submission, D, L.active, {
        replace: y.replace,
        flushSync: I
      });
      if (X.shortCircuited)
        return;
      if (X.pendingActionResult) {
        let [Y, Q] = X.pendingActionResult;
        if (be(Q) && kt(Q.error) && Q.error.status === 404) {
          j = null, ke(u, {
            matches: X.matches,
            loaderData: {},
            errors: {
              [Y]: Q.error
            }
          });
          return;
        }
      }
      D = X.matches || D, P = X.pendingActionResult, T = gr(u, y.submission), I = !1, L.active = !1, O = lt(t.history, O.url, O.signal);
    }
    let {
      shortCircuited: A,
      matches: z,
      loaderData: H,
      errors: de
    } = await cr(O, u, D, L.active, T, y && y.submission, y && y.fetcherSubmission, y && y.replace, y && y.initialHydration === !0, I, P);
    A || (j = null, ke(u, G({
      matches: z || D
    }, yn(P), {
      loaderData: H,
      errors: de
    })));
  }
  async function lr(c, u, y, w, T, D) {
    D === void 0 && (D = {}), ur();
    let I = Ws(u, y);
    if (ue({
      navigation: I
    }, {
      flushSync: D.flushSync === !0
    }), T) {
      let P = await Ut(w, u.pathname, c.signal);
      if (P.type === "aborted")
        return {
          shortCircuited: !0
        };
      if (P.type === "error") {
        let A = Ze(P.partialMatches).route.id;
        return {
          matches: P.partialMatches,
          pendingActionResult: [A, {
            type: J.error,
            error: P.error
          }]
        };
      } else if (P.matches)
        w = P.matches;
      else {
        let {
          notFoundMatches: A,
          error: z,
          route: H
        } = dr(u.pathname);
        return {
          matches: A,
          pendingActionResult: [H.id, {
            type: J.error,
            error: z
          }]
        };
      }
    }
    let L, O = St(w, u);
    if (!O.route.action && !O.route.lazy)
      L = {
        type: J.error,
        error: me(405, {
          method: c.method,
          pathname: u.pathname,
          routeId: O.route.id
        })
      };
    else if (L = (await gt("action", g, c, [O], w, null))[O.route.id], c.signal.aborted)
      return {
        shortCircuited: !0
      };
    if (rt(L)) {
      let P;
      return D && D.replace != null ? P = D.replace : P = hn(L.response.headers.get("Location"), new URL(c.url), a) === g.location.pathname + g.location.search, await Xe(c, L, !0, {
        submission: y,
        replace: P
      }), {
        shortCircuited: !0
      };
    }
    if (Ve(L))
      throw me(400, {
        type: "defer-action"
      });
    if (be(L)) {
      let P = Ze(w, O.route.id);
      return (D && D.replace) !== !0 && (N = ne.Push), {
        matches: w,
        pendingActionResult: [P.route.id, L]
      };
    }
    return {
      matches: w,
      pendingActionResult: [O.route.id, L]
    };
  }
  async function cr(c, u, y, w, T, D, I, L, O, P, A) {
    let z = T || gr(u, D), H = D || I || xn(z), de = !ae && (!m.v7_partialHydration || !O);
    if (w) {
      if (de) {
        let Z = Wr(A);
        ue(G({
          navigation: z
        }, Z !== void 0 ? {
          actionData: Z
        } : {}), {
          flushSync: P
        });
      }
      let K = await Ut(y, u.pathname, c.signal);
      if (K.type === "aborted")
        return {
          shortCircuited: !0
        };
      if (K.type === "error") {
        let Z = Ze(K.partialMatches).route.id;
        return {
          matches: K.partialMatches,
          loaderData: {},
          errors: {
            [Z]: K.error
          }
        };
      } else if (K.matches)
        y = K.matches;
      else {
        let {
          error: Z,
          notFoundMatches: ot,
          route: bt
        } = dr(u.pathname);
        return {
          matches: ot,
          loaderData: {},
          errors: {
            [bt.id]: Z
          }
        };
      }
    }
    let X = l || o, [Y, Q] = un(t.history, g, y, H, u, m.v7_partialHydration && O === !0, m.v7_skipActionErrorRevalidation, se, Ae, we, ve, Te, fe, X, a, A);
    if (fr((K) => !(y && y.some((Z) => Z.route.id === K)) || Y && Y.some((Z) => Z.route.id === K)), De = ++Ke, Y.length === 0 && Q.length === 0) {
      let K = Xr();
      return ke(u, G({
        matches: y,
        loaderData: {},
        // Commit pending error if we're short circuiting
        errors: A && be(A[1]) ? {
          [A[0]]: A[1].error
        } : null
      }, yn(A), K ? {
        fetchers: new Map(g.fetchers)
      } : {}), {
        flushSync: P
      }), {
        shortCircuited: !0
      };
    }
    if (de) {
      let K = {};
      if (!w) {
        K.navigation = z;
        let Z = Wr(A);
        Z !== void 0 && (K.actionData = Z);
      }
      Q.length > 0 && (K.fetchers = Pi(Q)), ue(K, {
        flushSync: P
      });
    }
    Q.forEach((K) => {
      Fe(K.key), K.controller && te.set(K.key, K.controller);
    });
    let st = () => Q.forEach((K) => Fe(K.key));
    j && j.signal.addEventListener("abort", st);
    let {
      loaderResults: yt,
      fetcherResults: Pe
    } = await Kr(g, y, Y, Q, c);
    if (c.signal.aborted)
      return {
        shortCircuited: !0
      };
    j && j.signal.removeEventListener("abort", st), Q.forEach((K) => te.delete(K.key));
    let Re = $t(yt);
    if (Re)
      return await Xe(c, Re.result, !0, {
        replace: L
      }), {
        shortCircuited: !0
      };
    if (Re = $t(Pe), Re)
      return fe.add(Re.key), await Xe(c, Re.result, !0, {
        replace: L
      }), {
        shortCircuited: !0
      };
    let {
      loaderData: hr,
      errors: vt
    } = mn(g, y, yt, A, Q, Pe, Ie);
    Ie.forEach((K, Z) => {
      K.subscribe((ot) => {
        (ot || K.done) && Ie.delete(Z);
      });
    }), m.v7_partialHydration && O && g.errors && (vt = G({}, g.errors, vt));
    let Ge = Xr(), Ft = Gr(De), zt = Ge || Ft || Q.length > 0;
    return G({
      matches: y,
      loaderData: hr,
      errors: vt
    }, zt ? {
      fetchers: new Map(g.fetchers)
    } : {});
  }
  function Wr(c) {
    if (c && !be(c[1]))
      return {
        [c[0]]: c[1].data
      };
    if (g.actionData)
      return Object.keys(g.actionData).length === 0 ? null : g.actionData;
  }
  function Pi(c) {
    return c.forEach((u) => {
      let y = g.fetchers.get(u.key), w = wt(void 0, y ? y.data : void 0);
      g.fetchers.set(u.key, w);
    }), new Map(g.fetchers);
  }
  function Li(c, u, y, w) {
    if (n)
      throw new Error("router.fetch() was called during the server render, but it shouldn't be. You are likely calling a useFetcher() method in the body of your component. Try moving it to a useEffect or a callback.");
    Fe(c);
    let T = (w && w.flushSync) === !0, D = l || o, I = wr(g.location, g.matches, a, m.v7_prependBasename, y, m.v7_relativeSplatPath, u, w == null ? void 0 : w.relative), L = Qe(D, I, a), O = Bt(L, D, I);
    if (O.active && O.matches && (L = O.matches), !L) {
      Ne(c, u, me(404, {
        pathname: I
      }), {
        flushSync: T
      });
      return;
    }
    let {
      path: P,
      submission: A,
      error: z
    } = ln(m.v7_normalizeFormMethod, !0, I, w);
    if (z) {
      Ne(c, u, z, {
        flushSync: T
      });
      return;
    }
    let H = St(L, P), de = (w && w.preventScrollReset) === !0;
    if (A && _e(A.formMethod)) {
      Oi(c, u, P, H, L, O.active, T, de, A);
      return;
    }
    Te.set(c, {
      routeId: u,
      path: P
    }), Ai(c, u, P, H, L, O.active, T, de, A);
  }
  async function Oi(c, u, y, w, T, D, I, L, O) {
    ur(), Te.delete(c);
    function P(re) {
      if (!re.route.action && !re.route.lazy) {
        let at = me(405, {
          method: O.formMethod,
          pathname: y,
          routeId: u
        });
        return Ne(c, u, at, {
          flushSync: I
        }), !0;
      }
      return !1;
    }
    if (!D && P(w))
      return;
    let A = g.fetchers.get(c);
    Ue(c, Ks(O, A), {
      flushSync: I
    });
    let z = new AbortController(), H = lt(t.history, y, z.signal, O);
    if (D) {
      let re = await Ut(T, new URL(H.url).pathname, H.signal, c);
      if (re.type === "aborted")
        return;
      if (re.type === "error") {
        Ne(c, u, re.error, {
          flushSync: I
        });
        return;
      } else if (re.matches) {
        if (T = re.matches, w = St(T, y), P(w))
          return;
      } else {
        Ne(c, u, me(404, {
          pathname: y
        }), {
          flushSync: I
        });
        return;
      }
    }
    te.set(c, z);
    let de = Ke, Y = (await gt("action", g, H, [w], T, c))[w.route.id];
    if (H.signal.aborted) {
      te.get(c) === z && te.delete(c);
      return;
    }
    if (m.v7_fetcherPersist && ve.has(c)) {
      if (rt(Y) || be(Y)) {
        Ue(c, $e(void 0));
        return;
      }
    } else {
      if (rt(Y))
        if (te.delete(c), De > de) {
          Ue(c, $e(void 0));
          return;
        } else
          return fe.add(c), Ue(c, wt(O)), Xe(H, Y, !1, {
            fetcherSubmission: O,
            preventScrollReset: L
          });
      if (be(Y)) {
        Ne(c, u, Y.error);
        return;
      }
    }
    if (Ve(Y))
      throw me(400, {
        type: "defer-action"
      });
    let Q = g.navigation.location || g.location, st = lt(t.history, Q, z.signal), yt = l || o, Pe = g.navigation.state !== "idle" ? Qe(yt, g.navigation.location, a) : g.matches;
    $(Pe, "Didn't find any matches after fetcher action");
    let Re = ++Ke;
    je.set(c, Re);
    let hr = wt(O, Y.data);
    g.fetchers.set(c, hr);
    let [vt, Ge] = un(t.history, g, Pe, O, Q, !1, m.v7_skipActionErrorRevalidation, se, Ae, we, ve, Te, fe, yt, a, [w.route.id, Y]);
    Ge.filter((re) => re.key !== c).forEach((re) => {
      let at = re.key, rn = g.fetchers.get(at), zi = wt(void 0, rn ? rn.data : void 0);
      g.fetchers.set(at, zi), Fe(at), re.controller && te.set(at, re.controller);
    }), ue({
      fetchers: new Map(g.fetchers)
    });
    let Ft = () => Ge.forEach((re) => Fe(re.key));
    z.signal.addEventListener("abort", Ft);
    let {
      loaderResults: zt,
      fetcherResults: K
    } = await Kr(g, Pe, vt, Ge, st);
    if (z.signal.aborted)
      return;
    z.signal.removeEventListener("abort", Ft), je.delete(c), te.delete(c), Ge.forEach((re) => te.delete(re.key));
    let Z = $t(zt);
    if (Z)
      return Xe(st, Z.result, !1, {
        preventScrollReset: L
      });
    if (Z = $t(K), Z)
      return fe.add(Z.key), Xe(st, Z.result, !1, {
        preventScrollReset: L
      });
    let {
      loaderData: ot,
      errors: bt
    } = mn(g, Pe, zt, void 0, Ge, K, Ie);
    if (g.fetchers.has(c)) {
      let re = $e(Y.data);
      g.fetchers.set(c, re);
    }
    Gr(Re), g.navigation.state === "loading" && Re > De ? ($(N, "Expected pending action"), j && j.abort(), ke(g.navigation.location, {
      matches: Pe,
      loaderData: ot,
      errors: bt,
      fetchers: new Map(g.fetchers)
    })) : (ue({
      errors: bt,
      loaderData: gn(g.loaderData, ot, Pe, bt),
      fetchers: new Map(g.fetchers)
    }), se = !1);
  }
  async function Ai(c, u, y, w, T, D, I, L, O) {
    let P = g.fetchers.get(c);
    Ue(c, wt(O, P ? P.data : void 0), {
      flushSync: I
    });
    let A = new AbortController(), z = lt(t.history, y, A.signal);
    if (D) {
      let Y = await Ut(T, new URL(z.url).pathname, z.signal, c);
      if (Y.type === "aborted")
        return;
      if (Y.type === "error") {
        Ne(c, u, Y.error, {
          flushSync: I
        });
        return;
      } else if (Y.matches)
        T = Y.matches, w = St(T, y);
      else {
        Ne(c, u, me(404, {
          pathname: y
        }), {
          flushSync: I
        });
        return;
      }
    }
    te.set(c, A);
    let H = Ke, X = (await gt("loader", g, z, [w], T, c))[w.route.id];
    if (Ve(X) && (X = await Dr(X, z.signal, !0) || X), te.get(c) === A && te.delete(c), !z.signal.aborted) {
      if (ve.has(c)) {
        Ue(c, $e(void 0));
        return;
      }
      if (rt(X))
        if (De > H) {
          Ue(c, $e(void 0));
          return;
        } else {
          fe.add(c), await Xe(z, X, !1, {
            preventScrollReset: L
          });
          return;
        }
      if (be(X)) {
        Ne(c, u, X.error);
        return;
      }
      $(!Ve(X), "Unhandled fetcher deferred data"), Ue(c, $e(X.data));
    }
  }
  async function Xe(c, u, y, w) {
    let {
      submission: T,
      fetcherSubmission: D,
      preventScrollReset: I,
      replace: L
    } = w === void 0 ? {} : w;
    u.response.headers.has("X-Remix-Revalidate") && (se = !0);
    let O = u.response.headers.get("Location");
    $(O, "Expected a Location header on the redirect Response"), O = hn(O, new URL(c.url), a);
    let P = Tt(g.location, O, {
      _isRedirect: !0
    });
    if (r) {
      let Y = !1;
      if (u.response.headers.has("X-Remix-Reload-Document"))
        Y = !0;
      else if (Ar.test(O)) {
        const Q = t.history.createURL(O);
        Y = // Hard reload if it's an absolute URL to a new origin
        Q.origin !== e.location.origin || // Hard reload if it's an absolute URL that does not match our basename
        ht(Q.pathname, a) == null;
      }
      if (Y) {
        L ? e.location.replace(O) : e.location.assign(O);
        return;
      }
    }
    j = null;
    let A = L === !0 || u.response.headers.has("X-Remix-Replace") ? ne.Replace : ne.Push, {
      formMethod: z,
      formAction: H,
      formEncType: de
    } = g.navigation;
    !T && !D && z && H && de && (T = xn(g.navigation));
    let X = T || D;
    if (Ts.has(u.response.status) && X && _e(X.formMethod))
      await Me(A, P, {
        submission: G({}, X, {
          formAction: O
        }),
        // Preserve these flags across redirects
        preventScrollReset: I || U,
        enableViewTransition: y ? B : void 0
      });
    else {
      let Y = gr(P, T);
      await Me(A, P, {
        overrideNavigation: Y,
        // Send fetcher submissions through for shouldRevalidate
        fetcherSubmission: D,
        // Preserve these flags across redirects
        preventScrollReset: I || U,
        enableViewTransition: y ? B : void 0
      });
    }
  }
  async function gt(c, u, y, w, T, D) {
    let I, L = {};
    try {
      I = await Ds(d, c, u, y, w, T, D, s, i);
    } catch (O) {
      return w.forEach((P) => {
        L[P.route.id] = {
          type: J.error,
          error: O
        };
      }), L;
    }
    for (let [O, P] of Object.entries(I))
      if (zs(P)) {
        let A = P.result;
        L[O] = {
          type: J.redirect,
          response: Bs(A, y, O, T, a, m.v7_relativeSplatPath)
        };
      } else
        L[O] = await Is(P);
    return L;
  }
  async function Kr(c, u, y, w, T) {
    let D = c.matches, I = gt("loader", c, T, y, u, null), L = Promise.all(w.map(async (A) => {
      if (A.matches && A.match && A.controller) {
        let H = (await gt("loader", c, lt(t.history, A.path, A.controller.signal), [A.match], A.matches, A.key))[A.match.route.id];
        return {
          [A.key]: H
        };
      } else
        return Promise.resolve({
          [A.key]: {
            type: J.error,
            error: me(404, {
              pathname: A.path
            })
          }
        });
    })), O = await I, P = (await L).reduce((A, z) => Object.assign(A, z), {});
    return await Promise.all([Vs(u, O, T.signal, D, c.loaderData), Hs(u, P, w)]), {
      loaderResults: O,
      fetcherResults: P
    };
  }
  function ur() {
    se = !0, Ae.push(...fr()), Te.forEach((c, u) => {
      te.has(u) && we.add(u), Fe(u);
    });
  }
  function Ue(c, u, y) {
    y === void 0 && (y = {}), g.fetchers.set(c, u), ue({
      fetchers: new Map(g.fetchers)
    }, {
      flushSync: (y && y.flushSync) === !0
    });
  }
  function Ne(c, u, y, w) {
    w === void 0 && (w = {});
    let T = Ze(g.matches, u);
    jt(c), ue({
      errors: {
        [T.route.id]: y
      },
      fetchers: new Map(g.fetchers)
    }, {
      flushSync: (w && w.flushSync) === !0
    });
  }
  function Yr(c) {
    return Ye.set(c, (Ye.get(c) || 0) + 1), ve.has(c) && ve.delete(c), g.fetchers.get(c) || ks;
  }
  function jt(c) {
    let u = g.fetchers.get(c);
    te.has(c) && !(u && u.state === "loading" && je.has(c)) && Fe(c), Te.delete(c), je.delete(c), fe.delete(c), m.v7_fetcherPersist && ve.delete(c), we.delete(c), g.fetchers.delete(c);
  }
  function Di(c) {
    let u = (Ye.get(c) || 0) - 1;
    u <= 0 ? (Ye.delete(c), ve.add(c), m.v7_fetcherPersist || jt(c)) : Ye.set(c, u), ue({
      fetchers: new Map(g.fetchers)
    });
  }
  function Fe(c) {
    let u = te.get(c);
    u && (u.abort(), te.delete(c));
  }
  function Jr(c) {
    for (let u of c) {
      let y = Yr(u), w = $e(y.data);
      g.fetchers.set(u, w);
    }
  }
  function Xr() {
    let c = [], u = !1;
    for (let y of fe) {
      let w = g.fetchers.get(y);
      $(w, "Expected fetcher: " + y), w.state === "loading" && (fe.delete(y), c.push(y), u = !0);
    }
    return Jr(c), u;
  }
  function Gr(c) {
    let u = [];
    for (let [y, w] of je)
      if (w < c) {
        let T = g.fetchers.get(y);
        $(T, "Expected fetcher: " + y), T.state === "loading" && (Fe(y), je.delete(y), u.push(y));
      }
    return Jr(u), u.length > 0;
  }
  function ji(c, u) {
    let y = g.blockers.get(c) || xt;
    return Se.get(c) !== u && Se.set(c, u), y;
  }
  function Qr(c) {
    g.blockers.delete(c), Se.delete(c);
  }
  function It(c, u) {
    let y = g.blockers.get(c) || xt;
    $(y.state === "unblocked" && u.state === "blocked" || y.state === "blocked" && u.state === "blocked" || y.state === "blocked" && u.state === "proceeding" || y.state === "blocked" && u.state === "unblocked" || y.state === "proceeding" && u.state === "unblocked", "Invalid blocker state transition: " + y.state + " -> " + u.state);
    let w = new Map(g.blockers);
    w.set(c, u), ue({
      blockers: w
    });
  }
  function Zr(c) {
    let {
      currentLocation: u,
      nextLocation: y,
      historyAction: w
    } = c;
    if (Se.size === 0)
      return;
    Se.size > 1 && dt(!1, "A router only supports one blocker at a time");
    let T = Array.from(Se.entries()), [D, I] = T[T.length - 1], L = g.blockers.get(D);
    if (!(L && L.state === "proceeding") && I({
      currentLocation: u,
      nextLocation: y,
      historyAction: w
    }))
      return D;
  }
  function dr(c) {
    let u = me(404, {
      pathname: c
    }), y = l || o, {
      matches: w,
      route: T
    } = vn(y);
    return fr(), {
      notFoundMatches: w,
      route: T,
      error: u
    };
  }
  function fr(c) {
    let u = [];
    return Ie.forEach((y, w) => {
      (!c || c(w)) && (y.cancel(), u.push(w), Ie.delete(w));
    }), u;
  }
  function Ii(c, u, y) {
    if (_ = c, M = u, x = y || null, !C && g.navigation === mr) {
      C = !0;
      let w = tn(g.location, g.matches);
      w != null && ue({
        restoreScrollPosition: w
      });
    }
    return () => {
      _ = null, M = null, x = null;
    };
  }
  function en(c, u) {
    return x && x(c, u.map((w) => ss(w, g.loaderData))) || c.key;
  }
  function Bi(c, u) {
    if (_ && M) {
      let y = en(c, u);
      _[y] = M();
    }
  }
  function tn(c, u) {
    if (_) {
      let y = en(c, u), w = _[y];
      if (typeof w == "number")
        return w;
    }
    return null;
  }
  function Bt(c, u, y) {
    if (f)
      if (c) {
        if (Object.keys(c[0].params).length > 0)
          return {
            active: !0,
            matches: Ht(u, y, a, !0)
          };
      } else
        return {
          active: !0,
          matches: Ht(u, y, a, !0) || []
        };
    return {
      active: !1,
      matches: null
    };
  }
  async function Ut(c, u, y, w) {
    if (!f)
      return {
        type: "success",
        matches: c
      };
    let T = c;
    for (; ; ) {
      let D = l == null, I = l || o, L = s;
      try {
        await f({
          signal: y,
          path: u,
          matches: T,
          fetcherKey: w,
          patch: (A, z) => {
            y.aborted || fn(A, z, I, L, i);
          }
        });
      } catch (A) {
        return {
          type: "error",
          error: A,
          partialMatches: T
        };
      } finally {
        D && !y.aborted && (o = [...o]);
      }
      if (y.aborted)
        return {
          type: "aborted"
        };
      let O = Qe(I, u, a);
      if (O)
        return {
          type: "success",
          matches: O
        };
      let P = Ht(I, u, a, !0);
      if (!P || T.length === P.length && T.every((A, z) => A.route.id === P[z].route.id))
        return {
          type: "success",
          matches: null
        };
      T = P;
    }
  }
  function Ui(c) {
    s = {}, l = Gt(c, i, void 0, s);
  }
  function Fi(c, u) {
    let y = l == null;
    fn(c, u, l || o, s, i), y && (o = [...o], ue({}));
  }
  return q = {
    get basename() {
      return a;
    },
    get future() {
      return m;
    },
    get state() {
      return g;
    },
    get routes() {
      return o;
    },
    get window() {
      return e;
    },
    initialize: Hr,
    subscribe: Je,
    enableScrollRestoration: Ii,
    navigate: mt,
    fetch: Li,
    revalidate: Dt,
    // Passthrough to history-aware createHref used by useHref so we get proper
    // hash-aware URLs in DOM paths
    createHref: (c) => t.history.createHref(c),
    encodeLocation: (c) => t.history.encodeLocation(c),
    getFetcher: Yr,
    deleteFetcher: Di,
    dispose: At,
    getBlocker: ji,
    deleteBlocker: Qr,
    patchRoutes: Fi,
    _internalFetchControllers: te,
    _internalActiveDeferreds: Ie,
    // TODO: Remove setRoutes, it's temporary to avoid dealing with
    // updating the tree while validating the update algorithm.
    _internalSetRoutes: Ui
  }, q;
}
function Ps(t) {
  return t != null && ("formData" in t && t.formData != null || "body" in t && t.body !== void 0);
}
function wr(t, e, r, n, i, s, o, l) {
  let a, d;
  if (o) {
    a = [];
    for (let m of e)
      if (a.push(m), m.route.id === o) {
        d = m;
        break;
      }
  } else
    a = e, d = e[e.length - 1];
  let f = Or(i || ".", Lr(a, s), ht(t.pathname, r) || t.pathname, l === "path");
  if (i == null && (f.search = t.search, f.hash = t.hash), (i == null || i === "" || i === ".") && d) {
    let m = jr(f.search);
    if (d.route.index && !m)
      f.search = f.search ? f.search.replace(/^\?/, "?index&") : "?index";
    else if (!d.route.index && m) {
      let b = new URLSearchParams(f.search), h = b.getAll("index");
      b.delete("index"), h.filter((x) => x).forEach((x) => b.append("index", x));
      let _ = b.toString();
      f.search = _ ? "?" + _ : "";
    }
  }
  return n && r !== "/" && (f.pathname = f.pathname === "/" ? r : Le([r, f.pathname])), nt(f);
}
function ln(t, e, r, n) {
  if (!n || !Ps(n))
    return {
      path: r
    };
  if (n.formMethod && !qs(n.formMethod))
    return {
      path: r,
      error: me(405, {
        method: n.formMethod
      })
    };
  let i = () => ({
    path: r,
    error: me(400, {
      type: "invalid-body"
    })
  }), s = n.formMethod || "get", o = t ? s.toUpperCase() : s.toLowerCase(), l = Qn(r);
  if (n.body !== void 0) {
    if (n.formEncType === "text/plain") {
      if (!_e(o))
        return i();
      let b = typeof n.body == "string" ? n.body : n.body instanceof FormData || n.body instanceof URLSearchParams ? (
        // https://html.spec.whatwg.org/multipage/form-control-infrastructure.html#plain-text-form-data
        Array.from(n.body.entries()).reduce((h, _) => {
          let [x, M] = _;
          return "" + h + x + "=" + M + `
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
          text: b
        }
      };
    } else if (n.formEncType === "application/json") {
      if (!_e(o))
        return i();
      try {
        let b = typeof n.body == "string" ? JSON.parse(n.body) : n.body;
        return {
          path: r,
          submission: {
            formMethod: o,
            formAction: l,
            formEncType: n.formEncType,
            formData: void 0,
            json: b,
            text: void 0
          }
        };
      } catch {
        return i();
      }
    }
  }
  $(typeof FormData == "function", "FormData is not available in this environment");
  let a, d;
  if (n.formData)
    a = Er(n.formData), d = n.formData;
  else if (n.body instanceof FormData)
    a = Er(n.body), d = n.body;
  else if (n.body instanceof URLSearchParams)
    a = n.body, d = pn(a);
  else if (n.body == null)
    a = new URLSearchParams(), d = new FormData();
  else
    try {
      a = new URLSearchParams(n.body), d = pn(a);
    } catch {
      return i();
    }
  let f = {
    formMethod: o,
    formAction: l,
    formEncType: n && n.formEncType || "application/x-www-form-urlencoded",
    formData: d,
    json: void 0,
    text: void 0
  };
  if (_e(f.formMethod))
    return {
      path: r,
      submission: f
    };
  let m = We(r);
  return e && m.search && jr(m.search) && a.append("index", ""), m.search = "?" + a, {
    path: nt(m),
    submission: f
  };
}
function cn(t, e, r) {
  r === void 0 && (r = !1);
  let n = t.findIndex((i) => i.route.id === e);
  return n >= 0 ? t.slice(0, r ? n + 1 : n) : t;
}
function un(t, e, r, n, i, s, o, l, a, d, f, m, b, h, _, x) {
  let M = x ? be(x[1]) ? x[1].error : x[1].data : void 0, C = t.createURL(e.location), p = t.createURL(i), E = r;
  s && e.errors ? E = cn(r, Object.keys(e.errors)[0], !0) : x && be(x[1]) && (E = cn(r, x[0]));
  let R = x ? x[1].statusCode : void 0, k = o && R && R >= 400, q = E.filter((N, U) => {
    let {
      route: j
    } = N;
    if (j.lazy)
      return !0;
    if (j.loader == null)
      return !1;
    if (s)
      return _r(j, e.loaderData, e.errors);
    if (Ls(e.loaderData, e.matches[U], N) || a.some((oe) => oe === N.route.id))
      return !0;
    let B = e.matches[U], F = N;
    return dn(N, G({
      currentUrl: C,
      currentParams: B.params,
      nextUrl: p,
      nextParams: F.params
    }, n, {
      actionResult: M,
      actionStatus: R,
      defaultShouldRevalidate: k ? !1 : (
        // Forced revalidation due to submission, useRevalidator, or X-Remix-Revalidate
        l || C.pathname + C.search === p.pathname + p.search || // Search params affect all loaders
        C.search !== p.search || Xn(B, F)
      )
    }));
  }), g = [];
  return m.forEach((N, U) => {
    if (s || !r.some((ae) => ae.route.id === N.routeId) || f.has(U))
      return;
    let j = Qe(h, N.path, _);
    if (!j) {
      g.push({
        key: U,
        routeId: N.routeId,
        path: N.path,
        matches: null,
        match: null,
        controller: null
      });
      return;
    }
    let B = e.fetchers.get(U), F = St(j, N.path), oe = !1;
    b.has(U) ? oe = !1 : d.has(U) ? (d.delete(U), oe = !0) : B && B.state !== "idle" && B.data === void 0 ? oe = l : oe = dn(F, G({
      currentUrl: C,
      currentParams: e.matches[e.matches.length - 1].params,
      nextUrl: p,
      nextParams: r[r.length - 1].params
    }, n, {
      actionResult: M,
      actionStatus: R,
      defaultShouldRevalidate: k ? !1 : l
    })), oe && g.push({
      key: U,
      routeId: N.routeId,
      path: N.path,
      matches: j,
      match: F,
      controller: new AbortController()
    });
  }), [q, g];
}
function _r(t, e, r) {
  if (t.lazy)
    return !0;
  if (!t.loader)
    return !1;
  let n = e != null && e[t.id] !== void 0, i = r != null && r[t.id] !== void 0;
  return !n && i ? !1 : typeof t.loader == "function" && t.loader.hydrate === !0 ? !0 : !n && !i;
}
function Ls(t, e, r) {
  let n = (
    // [a] -> [a, b]
    !e || // [a, b] -> [a, c]
    r.route.id !== e.route.id
  ), i = t[r.route.id] === void 0;
  return n || i;
}
function Xn(t, e) {
  let r = t.route.path;
  return (
    // param change for this match, /users/123 -> /users/456
    t.pathname !== e.pathname || // splat param changed, which is not present in match.path
    // e.g. /files/images/avatar.jpg -> files/finances.xls
    r != null && r.endsWith("*") && t.params["*"] !== e.params["*"]
  );
}
function dn(t, e) {
  if (t.route.shouldRevalidate) {
    let r = t.route.shouldRevalidate(e);
    if (typeof r == "boolean")
      return r;
  }
  return e.defaultShouldRevalidate;
}
function fn(t, e, r, n, i) {
  var s;
  let o;
  if (t) {
    let d = n[t];
    $(d, "No route found to patch children into: routeId = " + t), d.children || (d.children = []), o = d.children;
  } else
    o = r;
  let l = e.filter((d) => !o.some((f) => Gn(d, f))), a = Gt(l, i, [t || "_", "patch", String(((s = o) == null ? void 0 : s.length) || "0")], n);
  o.push(...a);
}
function Gn(t, e) {
  return "id" in t && "id" in e && t.id === e.id ? !0 : t.index === e.index && t.path === e.path && t.caseSensitive === e.caseSensitive ? (!t.children || t.children.length === 0) && (!e.children || e.children.length === 0) ? !0 : t.children.every((r, n) => {
    var i;
    return (i = e.children) == null ? void 0 : i.some((s) => Gn(r, s));
  }) : !1;
}
async function Os(t, e, r) {
  if (!t.lazy)
    return;
  let n = await t.lazy();
  if (!t.lazy)
    return;
  let i = r[t.id];
  $(i, "No route found in manifest");
  let s = {};
  for (let o in n) {
    let a = i[o] !== void 0 && // This property isn't static since it should always be updated based
    // on the route updates
    o !== "hasErrorBoundary";
    dt(!a, 'Route "' + i.id + '" has a static property "' + o + '" defined but its lazy function is also returning a value for this property. ' + ('The lazy route property "' + o + '" will be ignored.')), !a && !ns.has(o) && (s[o] = n[o]);
  }
  Object.assign(i, s), Object.assign(i, G({}, e(i), {
    lazy: void 0
  }));
}
async function As(t) {
  let {
    matches: e
  } = t, r = e.filter((i) => i.shouldLoad);
  return (await Promise.all(r.map((i) => i.resolve()))).reduce((i, s, o) => Object.assign(i, {
    [r[o].route.id]: s
  }), {});
}
async function Ds(t, e, r, n, i, s, o, l, a, d) {
  let f = s.map((h) => h.route.lazy ? Os(h.route, a, l) : void 0), m = s.map((h, _) => {
    let x = f[_], M = i.some((p) => p.route.id === h.route.id);
    return G({}, h, {
      shouldLoad: M,
      resolve: async (p) => (p && n.method === "GET" && (h.route.lazy || h.route.loader) && (M = !0), M ? js(e, n, h, x, p, d) : Promise.resolve({
        type: J.data,
        result: void 0
      }))
    });
  }), b = await t({
    matches: m,
    request: n,
    params: s[0].params,
    fetcherKey: o,
    context: d
  });
  try {
    await Promise.all(f);
  } catch {
  }
  return b;
}
async function js(t, e, r, n, i, s) {
  let o, l, a = (d) => {
    let f, m = new Promise((_, x) => f = x);
    l = () => f(), e.signal.addEventListener("abort", l);
    let b = (_) => typeof d != "function" ? Promise.reject(new Error("You cannot call the handler for a route which defines a boolean " + ('"' + t + '" [routeId: ' + r.route.id + "]"))) : d({
      request: e,
      params: r.params,
      context: s
    }, ..._ !== void 0 ? [_] : []), h = (async () => {
      try {
        return {
          type: "data",
          result: await (i ? i((x) => b(x)) : b())
        };
      } catch (_) {
        return {
          type: "error",
          result: _
        };
      }
    })();
    return Promise.race([h, m]);
  };
  try {
    let d = r.route[t];
    if (n)
      if (d) {
        let f, [m] = await Promise.all([
          // If the handler throws, don't let it immediately bubble out,
          // since we need to let the lazy() execution finish so we know if this
          // route has a boundary that can handle the error
          a(d).catch((b) => {
            f = b;
          }),
          n
        ]);
        if (f !== void 0)
          throw f;
        o = m;
      } else if (await n, d = r.route[t], d)
        o = await a(d);
      else if (t === "action") {
        let f = new URL(e.url), m = f.pathname + f.search;
        throw me(405, {
          method: e.method,
          pathname: m,
          routeId: r.route.id
        });
      } else
        return {
          type: J.data,
          result: void 0
        };
    else if (d)
      o = await a(d);
    else {
      let f = new URL(e.url), m = f.pathname + f.search;
      throw me(404, {
        pathname: m
      });
    }
    $(o.result !== void 0, "You defined " + (t === "action" ? "an action" : "a loader") + " for route " + ('"' + r.route.id + "\" but didn't return anything from your `" + t + "` ") + "function. Please return a value or `null`.");
  } catch (d) {
    return {
      type: J.error,
      result: d
    };
  } finally {
    l && e.signal.removeEventListener("abort", l);
  }
  return o;
}
async function Is(t) {
  let {
    result: e,
    type: r
  } = t;
  if (Zn(e)) {
    let m;
    try {
      let b = e.headers.get("Content-Type");
      b && /\bapplication\/json\b/.test(b) ? e.body == null ? m = null : m = await e.json() : m = await e.text();
    } catch (b) {
      return {
        type: J.error,
        error: b
      };
    }
    return r === J.error ? {
      type: J.error,
      error: new Qt(e.status, e.statusText, m),
      statusCode: e.status,
      headers: e.headers
    } : {
      type: J.data,
      data: m,
      statusCode: e.status,
      headers: e.headers
    };
  }
  if (r === J.error) {
    if (bn(e)) {
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
        statusCode: kt(e) ? e.status : void 0,
        headers: (i = e.init) != null && i.headers ? new Headers(e.init.headers) : void 0
      };
    }
    return {
      type: J.error,
      error: e,
      statusCode: kt(e) ? e.status : void 0
    };
  }
  if ($s(e)) {
    var l, a;
    return {
      type: J.deferred,
      deferredData: e,
      statusCode: (l = e.init) == null ? void 0 : l.status,
      headers: ((a = e.init) == null ? void 0 : a.headers) && new Headers(e.init.headers)
    };
  }
  if (bn(e)) {
    var d, f;
    return {
      type: J.data,
      data: e.data,
      statusCode: (d = e.init) == null ? void 0 : d.status,
      headers: (f = e.init) != null && f.headers ? new Headers(e.init.headers) : void 0
    };
  }
  return {
    type: J.data,
    data: e
  };
}
function Bs(t, e, r, n, i, s) {
  let o = t.headers.get("Location");
  if ($(o, "Redirects returned/thrown from loaders/actions must have a Location header"), !Ar.test(o)) {
    let l = n.slice(0, n.findIndex((a) => a.route.id === r) + 1);
    o = wr(new URL(e.url), l, i, !0, o, s), t.headers.set("Location", o);
  }
  return t;
}
function hn(t, e, r) {
  if (Ar.test(t)) {
    let n = t, i = n.startsWith("//") ? new URL(e.protocol + n) : new URL(n), s = ht(i.pathname, r) != null;
    if (i.origin === e.origin && s)
      return i.pathname + i.search + i.hash;
  }
  return t;
}
function lt(t, e, r, n) {
  let i = t.createURL(Qn(e)).toString(), s = {
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
function pn(t) {
  let e = new FormData();
  for (let [r, n] of t.entries())
    e.append(r, n);
  return e;
}
function Us(t, e, r, n, i) {
  let s = {}, o = null, l, a = !1, d = {}, f = r && be(r[1]) ? r[1].error : void 0;
  return t.forEach((m) => {
    if (!(m.route.id in e))
      return;
    let b = m.route.id, h = e[b];
    if ($(!rt(h), "Cannot handle redirect results in processLoaderData"), be(h)) {
      let _ = h.error;
      f !== void 0 && (_ = f, f = void 0), o = o || {};
      {
        let x = Ze(t, b);
        o[x.route.id] == null && (o[x.route.id] = _);
      }
      s[b] = void 0, a || (a = !0, l = kt(h.error) ? h.error.status : 500), h.headers && (d[b] = h.headers);
    } else
      Ve(h) ? (n.set(b, h.deferredData), s[b] = h.deferredData.data, h.statusCode != null && h.statusCode !== 200 && !a && (l = h.statusCode), h.headers && (d[b] = h.headers)) : (s[b] = h.data, h.statusCode && h.statusCode !== 200 && !a && (l = h.statusCode), h.headers && (d[b] = h.headers));
  }), f !== void 0 && r && (o = {
    [r[0]]: f
  }, s[r[0]] = void 0), {
    loaderData: s,
    errors: o,
    statusCode: l || 200,
    loaderHeaders: d
  };
}
function mn(t, e, r, n, i, s, o) {
  let {
    loaderData: l,
    errors: a
  } = Us(e, r, n, o);
  return i.forEach((d) => {
    let {
      key: f,
      match: m,
      controller: b
    } = d, h = s[f];
    if ($(h, "Did not find corresponding fetcher result"), !(b && b.signal.aborted))
      if (be(h)) {
        let _ = Ze(t.matches, m == null ? void 0 : m.route.id);
        a && a[_.route.id] || (a = G({}, a, {
          [_.route.id]: h.error
        })), t.fetchers.delete(f);
      } else if (rt(h))
        $(!1, "Unhandled fetcher revalidation redirect");
      else if (Ve(h))
        $(!1, "Unhandled fetcher deferred data");
      else {
        let _ = $e(h.data);
        t.fetchers.set(f, _);
      }
  }), {
    loaderData: l,
    errors: a
  };
}
function gn(t, e, r, n) {
  let i = G({}, e);
  for (let s of r) {
    let o = s.route.id;
    if (e.hasOwnProperty(o) ? e[o] !== void 0 && (i[o] = e[o]) : t[o] !== void 0 && s.route.loader && (i[o] = t[o]), n && n.hasOwnProperty(o))
      break;
  }
  return i;
}
function yn(t) {
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
function vn(t) {
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
function me(t, e) {
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
function Qn(t) {
  let e = typeof t == "string" ? We(t) : t;
  return nt(G({}, e, {
    hash: ""
  }));
}
function Fs(t, e) {
  return t.pathname !== e.pathname || t.search !== e.search ? !1 : t.hash === "" ? e.hash !== "" : t.hash === e.hash ? !0 : e.hash !== "";
}
function zs(t) {
  return Zn(t.result) && Cs.has(t.result.status);
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
function bn(t) {
  return typeof t == "object" && t != null && "type" in t && "data" in t && "init" in t && t.type === "DataWithResponseInit";
}
function $s(t) {
  let e = t;
  return e && typeof e == "object" && typeof e.data == "object" && typeof e.subscribe == "function" && typeof e.cancel == "function" && typeof e.resolveData == "function";
}
function Zn(t) {
  return t != null && typeof t.status == "number" && typeof t.statusText == "string" && typeof t.headers == "object" && typeof t.body < "u";
}
function qs(t) {
  return Rs.has(t.toLowerCase());
}
function _e(t) {
  return Es.has(t.toLowerCase());
}
async function Vs(t, e, r, n, i) {
  let s = Object.entries(e);
  for (let o = 0; o < s.length; o++) {
    let [l, a] = s[o], d = t.find((b) => (b == null ? void 0 : b.route.id) === l);
    if (!d)
      continue;
    let f = n.find((b) => b.route.id === d.route.id), m = f != null && !Xn(f, d) && (i && i[d.route.id]) !== void 0;
    Ve(a) && m && await Dr(a, r, !1).then((b) => {
      b && (e[l] = b);
    });
  }
}
async function Hs(t, e, r) {
  for (let n = 0; n < r.length; n++) {
    let {
      key: i,
      routeId: s,
      controller: o
    } = r[n], l = e[i];
    t.find((d) => (d == null ? void 0 : d.route.id) === s) && Ve(l) && ($(o, "Expected an AbortController for revalidating fetcher deferred result"), await Dr(l, o.signal, !0).then((d) => {
      d && (e[i] = d);
    }));
  }
}
async function Dr(t, e, r) {
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
function jr(t) {
  return new URLSearchParams(t).getAll("index").some((e) => e === "");
}
function St(t, e) {
  let r = typeof e == "string" ? We(e).search : e.search;
  if (t[t.length - 1].route.index && jr(r || ""))
    return t[t.length - 1];
  let n = Kn(t);
  return n[n.length - 1];
}
function xn(t) {
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
function Ws(t, e) {
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
function wt(t, e) {
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
function Ks(t, e) {
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
function $e(t) {
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
function Ys(t, e) {
  try {
    let r = t.sessionStorage.getItem(Jn);
    if (r) {
      let n = JSON.parse(r);
      for (let [i, s] of Object.entries(n || {}))
        s && Array.isArray(s) && e.set(i, new Set(s || []));
    }
  } catch {
  }
}
function Js(t, e) {
  if (e.size > 0) {
    let r = {};
    for (let [n, i] of e)
      r[n] = [...i];
    try {
      t.sessionStorage.setItem(Jn, JSON.stringify(r));
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
const nr = /* @__PURE__ */ S.createContext(null), ei = /* @__PURE__ */ S.createContext(null), it = /* @__PURE__ */ S.createContext(null), Ir = /* @__PURE__ */ S.createContext(null), Oe = /* @__PURE__ */ S.createContext({
  outlet: null,
  matches: [],
  isDataRoute: !1
}), ti = /* @__PURE__ */ S.createContext(null);
function Xs(t, e) {
  let {
    relative: r
  } = e === void 0 ? {} : e;
  Pt() || $(!1);
  let {
    basename: n,
    navigator: i
  } = S.useContext(it), {
    hash: s,
    pathname: o,
    search: l
  } = si(t, {
    relative: r
  }), a = o;
  return n !== "/" && (a = o === "/" ? n : Le([n, o])), i.createHref({
    pathname: a,
    search: l,
    hash: s
  });
}
function Pt() {
  return S.useContext(Ir) != null;
}
function Lt() {
  return Pt() || $(!1), S.useContext(Ir).location;
}
function ri(t) {
  S.useContext(it).static || S.useLayoutEffect(t);
}
function ni() {
  let {
    isDataRoute: t
  } = S.useContext(Oe);
  return t ? uo() : Gs();
}
function Gs() {
  Pt() || $(!1);
  let t = S.useContext(nr), {
    basename: e,
    future: r,
    navigator: n
  } = S.useContext(it), {
    matches: i
  } = S.useContext(Oe), {
    pathname: s
  } = Lt(), o = JSON.stringify(Lr(i, r.v7_relativeSplatPath)), l = S.useRef(!1);
  return ri(() => {
    l.current = !0;
  }), S.useCallback(function(d, f) {
    if (f === void 0 && (f = {}), !l.current) return;
    if (typeof d == "number") {
      n.go(d);
      return;
    }
    let m = Or(d, JSON.parse(o), s, f.relative === "path");
    t == null && e !== "/" && (m.pathname = m.pathname === "/" ? e : Le([e, m.pathname])), (f.replace ? n.replace : n.push)(m, f.state, f);
  }, [e, n, o, s, t]);
}
const Qs = /* @__PURE__ */ S.createContext(null);
function Zs(t) {
  let e = S.useContext(Oe).outlet;
  return e && /* @__PURE__ */ S.createElement(Qs.Provider, {
    value: t
  }, e);
}
function ii() {
  let {
    matches: t
  } = S.useContext(Oe), e = t[t.length - 1];
  return e ? e.params : {};
}
function si(t, e) {
  let {
    relative: r
  } = e === void 0 ? {} : e, {
    future: n
  } = S.useContext(it), {
    matches: i
  } = S.useContext(Oe), {
    pathname: s
  } = Lt(), o = JSON.stringify(Lr(i, n.v7_relativeSplatPath));
  return S.useMemo(() => Or(t, JSON.parse(o), s, r === "path"), [t, o, s, r]);
}
function eo(t, e, r, n) {
  Pt() || $(!1);
  let {
    navigator: i
  } = S.useContext(it), {
    matches: s
  } = S.useContext(Oe), o = s[s.length - 1], l = o ? o.params : {};
  o && o.pathname;
  let a = o ? o.pathnameBase : "/";
  o && o.route;
  let d = Lt(), f;
  f = d;
  let m = f.pathname || "/", b = m;
  if (a !== "/") {
    let x = a.replace(/^\//, "").split("/");
    b = "/" + m.replace(/^\//, "").split("/").slice(x.length).join("/");
  }
  let h = Qe(t, {
    pathname: b
  });
  return so(h && h.map((x) => Object.assign({}, x, {
    params: Object.assign({}, l, x.params),
    pathname: Le([
      a,
      // Re-encode pathnames that were decoded inside matchRoutes
      i.encodeLocation ? i.encodeLocation(x.pathname).pathname : x.pathname
    ]),
    pathnameBase: x.pathnameBase === "/" ? a : Le([
      a,
      // Re-encode pathnames that were decoded inside matchRoutes
      i.encodeLocation ? i.encodeLocation(x.pathnameBase).pathname : x.pathnameBase
    ])
  })), s, r, n);
}
function to() {
  let t = co(), e = kt(t) ? t.status + " " + t.statusText : t instanceof Error ? t.message : JSON.stringify(t), r = t instanceof Error ? t.stack : null, i = {
    padding: "0.5rem",
    backgroundColor: "rgba(200,200,200, 0.5)"
  };
  return /* @__PURE__ */ S.createElement(S.Fragment, null, /* @__PURE__ */ S.createElement("h2", null, "Unexpected Application Error!"), /* @__PURE__ */ S.createElement("h3", {
    style: {
      fontStyle: "italic"
    }
  }, e), r ? /* @__PURE__ */ S.createElement("pre", {
    style: i
  }, r) : null, null);
}
const ro = /* @__PURE__ */ S.createElement(to, null);
class no extends S.Component {
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
    return this.state.error !== void 0 ? /* @__PURE__ */ S.createElement(Oe.Provider, {
      value: this.props.routeContext
    }, /* @__PURE__ */ S.createElement(ti.Provider, {
      value: this.state.error,
      children: this.props.component
    })) : this.props.children;
  }
}
function io(t) {
  let {
    routeContext: e,
    match: r,
    children: n
  } = t, i = S.useContext(nr);
  return i && i.static && i.staticContext && (r.route.errorElement || r.route.ErrorBoundary) && (i.staticContext._deepestRenderedBoundaryId = r.route.id), /* @__PURE__ */ S.createElement(Oe.Provider, {
    value: e
  }, n);
}
function so(t, e, r, n) {
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
    let f = o.findIndex((m) => m.route.id && (l == null ? void 0 : l[m.route.id]) !== void 0);
    f >= 0 || $(!1), o = o.slice(0, Math.min(o.length, f + 1));
  }
  let a = !1, d = -1;
  if (r && n && n.v7_partialHydration)
    for (let f = 0; f < o.length; f++) {
      let m = o[f];
      if ((m.route.HydrateFallback || m.route.hydrateFallbackElement) && (d = f), m.route.id) {
        let {
          loaderData: b,
          errors: h
        } = r, _ = m.route.loader && b[m.route.id] === void 0 && (!h || h[m.route.id] === void 0);
        if (m.route.lazy || _) {
          a = !0, d >= 0 ? o = o.slice(0, d + 1) : o = [o[0]];
          break;
        }
      }
    }
  return o.reduceRight((f, m, b) => {
    let h, _ = !1, x = null, M = null;
    r && (h = l && m.route.id ? l[m.route.id] : void 0, x = m.route.errorElement || ro, a && (d < 0 && b === 0 ? (fo("route-fallback"), _ = !0, M = null) : d === b && (_ = !0, M = m.route.hydrateFallbackElement || null)));
    let C = e.concat(o.slice(0, b + 1)), p = () => {
      let E;
      return h ? E = x : _ ? E = M : m.route.Component ? E = /* @__PURE__ */ S.createElement(m.route.Component, null) : m.route.element ? E = m.route.element : E = f, /* @__PURE__ */ S.createElement(io, {
        match: m,
        routeContext: {
          outlet: f,
          matches: C,
          isDataRoute: r != null
        },
        children: E
      });
    };
    return r && (m.route.ErrorBoundary || m.route.errorElement || b === 0) ? /* @__PURE__ */ S.createElement(no, {
      location: r.location,
      revalidation: r.revalidation,
      component: x,
      error: h,
      children: p(),
      routeContext: {
        outlet: null,
        matches: C,
        isDataRoute: !0
      }
    }) : p();
  }, null);
}
var oi = /* @__PURE__ */ function(t) {
  return t.UseBlocker = "useBlocker", t.UseRevalidator = "useRevalidator", t.UseNavigateStable = "useNavigate", t;
}(oi || {}), ai = /* @__PURE__ */ function(t) {
  return t.UseBlocker = "useBlocker", t.UseLoaderData = "useLoaderData", t.UseActionData = "useActionData", t.UseRouteError = "useRouteError", t.UseNavigation = "useNavigation", t.UseRouteLoaderData = "useRouteLoaderData", t.UseMatches = "useMatches", t.UseRevalidator = "useRevalidator", t.UseNavigateStable = "useNavigate", t.UseRouteId = "useRouteId", t;
}(ai || {});
function oo(t) {
  let e = S.useContext(nr);
  return e || $(!1), e;
}
function ao(t) {
  let e = S.useContext(ei);
  return e || $(!1), e;
}
function lo(t) {
  let e = S.useContext(Oe);
  return e || $(!1), e;
}
function li(t) {
  let e = lo(), r = e.matches[e.matches.length - 1];
  return r.route.id || $(!1), r.route.id;
}
function co() {
  var t;
  let e = S.useContext(ti), r = ao(), n = li();
  return e !== void 0 ? e : (t = r.errors) == null ? void 0 : t[n];
}
function uo() {
  let {
    router: t
  } = oo(oi.UseNavigateStable), e = li(ai.UseNavigateStable), r = S.useRef(!1);
  return ri(() => {
    r.current = !0;
  }), S.useCallback(function(i, s) {
    s === void 0 && (s = {}), r.current && (typeof i == "number" ? t.navigate(i) : t.navigate(i, Zt({
      fromRouteId: e
    }, s)));
  }, [t, e]);
}
const wn = {};
function fo(t, e, r) {
  wn[t] || (wn[t] = !0);
}
function ho(t, e) {
  t == null || t.v7_startTransition, (t == null ? void 0 : t.v7_relativeSplatPath) === void 0 && (!e || e.v7_relativeSplatPath), e && (e.v7_fetcherPersist, e.v7_normalizeFormMethod, e.v7_partialHydration, e.v7_skipActionErrorRevalidation);
}
function po(t) {
  return Zs(t.context);
}
function mo(t) {
  let {
    basename: e = "/",
    children: r = null,
    location: n,
    navigationType: i = ne.Pop,
    navigator: s,
    static: o = !1,
    future: l
  } = t;
  Pt() && $(!1);
  let a = e.replace(/^\/*/, "/"), d = S.useMemo(() => ({
    basename: a,
    navigator: s,
    static: o,
    future: Zt({
      v7_relativeSplatPath: !1
    }, l)
  }), [a, l, s, o]);
  typeof n == "string" && (n = We(n));
  let {
    pathname: f = "/",
    search: m = "",
    hash: b = "",
    state: h = null,
    key: _ = "default"
  } = n, x = S.useMemo(() => {
    let M = ht(f, a);
    return M == null ? null : {
      location: {
        pathname: M,
        search: m,
        hash: b,
        state: h,
        key: _
      },
      navigationType: i
    };
  }, [a, f, m, b, h, _, i]);
  return x == null ? null : /* @__PURE__ */ S.createElement(it.Provider, {
    value: d
  }, /* @__PURE__ */ S.createElement(Ir.Provider, {
    children: r,
    value: x
  }));
}
new Promise(() => {
});
function go(t) {
  let e = {
    // Note: this check also occurs in createRoutesFromChildren so update
    // there if you change this -- please and thank you!
    hasErrorBoundary: t.ErrorBoundary != null || t.errorElement != null
  };
  return t.Component && Object.assign(e, {
    element: /* @__PURE__ */ S.createElement(t.Component),
    Component: void 0
  }), t.HydrateFallback && Object.assign(e, {
    hydrateFallbackElement: /* @__PURE__ */ S.createElement(t.HydrateFallback),
    HydrateFallback: void 0
  }), t.ErrorBoundary && Object.assign(e, {
    errorElement: /* @__PURE__ */ S.createElement(t.ErrorBoundary),
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
function Mt() {
  return Mt = Object.assign ? Object.assign.bind() : function(t) {
    for (var e = 1; e < arguments.length; e++) {
      var r = arguments[e];
      for (var n in r)
        Object.prototype.hasOwnProperty.call(r, n) && (t[n] = r[n]);
    }
    return t;
  }, Mt.apply(this, arguments);
}
function yo(t, e) {
  if (t == null) return {};
  var r = {}, n = Object.keys(t), i, s;
  for (s = 0; s < n.length; s++)
    i = n[s], !(e.indexOf(i) >= 0) && (r[i] = t[i]);
  return r;
}
function vo(t) {
  return !!(t.metaKey || t.altKey || t.ctrlKey || t.shiftKey);
}
function bo(t, e) {
  return t.button === 0 && // Ignore everything but left clicks
  (!e || e === "_self") && // Let browser handle "target=_blank" etc.
  !vo(t);
}
const xo = ["onClick", "relative", "reloadDocument", "replace", "state", "target", "to", "preventScrollReset", "viewTransition"], wo = "6";
try {
  window.__reactRouterVersion = wo;
} catch {
}
function _o(t, e) {
  return Ns({
    basename: e == null ? void 0 : e.basename,
    future: Mt({}, e == null ? void 0 : e.future, {
      v7_prependBasename: !0
    }),
    history: es({
      window: e == null ? void 0 : e.window
    }),
    hydrationData: (e == null ? void 0 : e.hydrationData) || Eo(),
    routes: t,
    mapRouteProperties: go,
    dataStrategy: e == null ? void 0 : e.dataStrategy,
    patchRoutesOnNavigation: e == null ? void 0 : e.patchRoutesOnNavigation,
    window: e == null ? void 0 : e.window
  }).initialize();
}
function Eo() {
  var t;
  let e = (t = window) == null ? void 0 : t.__staticRouterHydrationData;
  return e && e.errors && (e = Mt({}, e, {
    errors: So(e.errors)
  })), e;
}
function So(t) {
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
const Ro = /* @__PURE__ */ S.createContext({
  isTransitioning: !1
}), Co = /* @__PURE__ */ S.createContext(/* @__PURE__ */ new Map()), To = "startTransition", _n = S[To], ko = "flushSync", En = Zi[ko];
function Mo(t) {
  _n ? _n(t) : t();
}
function _t(t) {
  En ? En(t) : t();
}
class No {
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
function Po(t) {
  let {
    fallbackElement: e,
    router: r,
    future: n
  } = t, [i, s] = S.useState(r.state), [o, l] = S.useState(), [a, d] = S.useState({
    isTransitioning: !1
  }), [f, m] = S.useState(), [b, h] = S.useState(), [_, x] = S.useState(), M = S.useRef(/* @__PURE__ */ new Map()), {
    v7_startTransition: C
  } = n || {}, p = S.useCallback((N) => {
    C ? Mo(N) : N();
  }, [C]), E = S.useCallback((N, U) => {
    let {
      deletedFetchers: j,
      flushSync: B,
      viewTransitionOpts: F
    } = U;
    N.fetchers.forEach((ae, se) => {
      ae.data !== void 0 && M.current.set(se, ae.data);
    }), j.forEach((ae) => M.current.delete(ae));
    let oe = r.window == null || r.window.document == null || typeof r.window.document.startViewTransition != "function";
    if (!F || oe) {
      B ? _t(() => s(N)) : p(() => s(N));
      return;
    }
    if (B) {
      _t(() => {
        b && (f && f.resolve(), b.skipTransition()), d({
          isTransitioning: !0,
          flushSync: !0,
          currentLocation: F.currentLocation,
          nextLocation: F.nextLocation
        });
      });
      let ae = r.window.document.startViewTransition(() => {
        _t(() => s(N));
      });
      ae.finished.finally(() => {
        _t(() => {
          m(void 0), h(void 0), l(void 0), d({
            isTransitioning: !1
          });
        });
      }), _t(() => h(ae));
      return;
    }
    b ? (f && f.resolve(), b.skipTransition(), x({
      state: N,
      currentLocation: F.currentLocation,
      nextLocation: F.nextLocation
    })) : (l(N), d({
      isTransitioning: !0,
      flushSync: !1,
      currentLocation: F.currentLocation,
      nextLocation: F.nextLocation
    }));
  }, [r.window, b, f, M, p]);
  S.useLayoutEffect(() => r.subscribe(E), [r, E]), S.useEffect(() => {
    a.isTransitioning && !a.flushSync && m(new No());
  }, [a]), S.useEffect(() => {
    if (f && o && r.window) {
      let N = o, U = f.promise, j = r.window.document.startViewTransition(async () => {
        p(() => s(N)), await U;
      });
      j.finished.finally(() => {
        m(void 0), h(void 0), l(void 0), d({
          isTransitioning: !1
        });
      }), h(j);
    }
  }, [p, o, f, r.window]), S.useEffect(() => {
    f && o && i.location.key === o.location.key && f.resolve();
  }, [f, b, i.location, o]), S.useEffect(() => {
    !a.isTransitioning && _ && (l(_.state), d({
      isTransitioning: !0,
      flushSync: !1,
      currentLocation: _.currentLocation,
      nextLocation: _.nextLocation
    }), x(void 0));
  }, [a.isTransitioning, _]), S.useEffect(() => {
  }, []);
  let R = S.useMemo(() => ({
    createHref: r.createHref,
    encodeLocation: r.encodeLocation,
    go: (N) => r.navigate(N),
    push: (N, U, j) => r.navigate(N, {
      state: U,
      preventScrollReset: j == null ? void 0 : j.preventScrollReset
    }),
    replace: (N, U, j) => r.navigate(N, {
      replace: !0,
      state: U,
      preventScrollReset: j == null ? void 0 : j.preventScrollReset
    })
  }), [r]), k = r.basename || "/", q = S.useMemo(() => ({
    router: r,
    navigator: R,
    static: !1,
    basename: k
  }), [r, R, k]), g = S.useMemo(() => ({
    v7_relativeSplatPath: r.future.v7_relativeSplatPath
  }), [r.future.v7_relativeSplatPath]);
  return S.useEffect(() => ho(n, r.future), [n, r.future]), /* @__PURE__ */ S.createElement(S.Fragment, null, /* @__PURE__ */ S.createElement(nr.Provider, {
    value: q
  }, /* @__PURE__ */ S.createElement(ei.Provider, {
    value: i
  }, /* @__PURE__ */ S.createElement(Co.Provider, {
    value: M.current
  }, /* @__PURE__ */ S.createElement(Ro.Provider, {
    value: a
  }, /* @__PURE__ */ S.createElement(mo, {
    basename: k,
    location: i.location,
    navigationType: i.historyAction,
    navigator: R,
    future: g
  }, i.initialized || r.future.v7_partialHydration ? /* @__PURE__ */ S.createElement(Lo, {
    routes: r.routes,
    future: r.future,
    state: i
  }) : e))))), null);
}
const Lo = /* @__PURE__ */ S.memo(Oo);
function Oo(t) {
  let {
    routes: e,
    future: r,
    state: n
  } = t;
  return eo(e, void 0, n, r);
}
const Ao = typeof window < "u" && typeof window.document < "u" && typeof window.document.createElement < "u", Do = /^(?:[a-z][a-z0-9+.-]*:|\/\/)/i, ci = /* @__PURE__ */ S.forwardRef(function(e, r) {
  let {
    onClick: n,
    relative: i,
    reloadDocument: s,
    replace: o,
    state: l,
    target: a,
    to: d,
    preventScrollReset: f,
    viewTransition: m
  } = e, b = yo(e, xo), {
    basename: h
  } = S.useContext(it), _, x = !1;
  if (typeof d == "string" && Do.test(d) && (_ = d, Ao))
    try {
      let E = new URL(window.location.href), R = d.startsWith("//") ? new URL(E.protocol + d) : new URL(d), k = ht(R.pathname, h);
      R.origin === E.origin && k != null ? d = k + R.search + R.hash : x = !0;
    } catch {
    }
  let M = Xs(d, {
    relative: i
  }), C = jo(d, {
    replace: o,
    state: l,
    target: a,
    preventScrollReset: f,
    relative: i,
    viewTransition: m
  });
  function p(E) {
    n && n(E), E.defaultPrevented || C(E);
  }
  return (
    // eslint-disable-next-line jsx-a11y/anchor-has-content
    /* @__PURE__ */ S.createElement("a", Mt({}, b, {
      href: _ || M,
      onClick: x || s ? n : p,
      ref: r,
      target: a
    }))
  );
});
var Sn;
(function(t) {
  t.UseScrollRestoration = "useScrollRestoration", t.UseSubmit = "useSubmit", t.UseSubmitFetcher = "useSubmitFetcher", t.UseFetcher = "useFetcher", t.useViewTransitionState = "useViewTransitionState";
})(Sn || (Sn = {}));
var Rn;
(function(t) {
  t.UseFetcher = "useFetcher", t.UseFetchers = "useFetchers", t.UseScrollRestoration = "useScrollRestoration";
})(Rn || (Rn = {}));
function jo(t, e) {
  let {
    target: r,
    replace: n,
    state: i,
    preventScrollReset: s,
    relative: o,
    viewTransition: l
  } = e === void 0 ? {} : e, a = ni(), d = Lt(), f = si(t, {
    relative: o
  });
  return S.useCallback((m) => {
    if (bo(m, r)) {
      m.preventDefault();
      let b = n !== void 0 ? n : nt(d) === nt(f);
      a(t, {
        replace: b,
        state: i,
        preventScrollReset: s,
        relative: o,
        viewTransition: l
      });
    }
  }, [d, a, f, n, i, r, t, s, o, l]);
}
const Io = {}, Cn = (t) => {
  let e;
  const r = /* @__PURE__ */ new Set(), n = (f, m) => {
    const b = typeof f == "function" ? f(e) : f;
    if (!Object.is(b, e)) {
      const h = e;
      e = m ?? (typeof b != "object" || b === null) ? b : Object.assign({}, e, b), r.forEach((_) => _(e, h));
    }
  }, i = () => e, a = { setState: n, getState: i, getInitialState: () => d, subscribe: (f) => (r.add(f), () => r.delete(f)), destroy: () => {
    (Io ? "production" : void 0) !== "production" && console.warn(
      "[DEPRECATED] The `destroy` method will be unsupported in a future version. Instead use unsubscribe function returned by subscribe. Everything will be garbage-collected if store is garbage-collected."
    ), r.clear();
  } }, d = e = t(n, i, a);
  return a;
}, Bo = (t) => t ? Cn(t) : Cn;
var ui = { exports: {} }, di = {}, fi = { exports: {} }, hi = {};
/**
 * @license React
 * use-sync-external-store-shim.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var ft = Nt;
function Uo(t, e) {
  return t === e && (t !== 0 || 1 / t === 1 / e) || t !== t && e !== e;
}
var Fo = typeof Object.is == "function" ? Object.is : Uo, zo = ft.useState, $o = ft.useEffect, qo = ft.useLayoutEffect, Vo = ft.useDebugValue;
function Ho(t, e) {
  var r = e(), n = zo({ inst: { value: r, getSnapshot: e } }), i = n[0].inst, s = n[1];
  return qo(
    function() {
      i.value = r, i.getSnapshot = e, yr(i) && s({ inst: i });
    },
    [t, r, e]
  ), $o(
    function() {
      return yr(i) && s({ inst: i }), t(function() {
        yr(i) && s({ inst: i });
      });
    },
    [t]
  ), Vo(r), r;
}
function yr(t) {
  var e = t.getSnapshot;
  t = t.value;
  try {
    var r = e();
    return !Fo(t, r);
  } catch {
    return !0;
  }
}
function Wo(t, e) {
  return e();
}
var Ko = typeof window > "u" || typeof window.document > "u" || typeof window.document.createElement > "u" ? Wo : Ho;
hi.useSyncExternalStore = ft.useSyncExternalStore !== void 0 ? ft.useSyncExternalStore : Ko;
fi.exports = hi;
var Yo = fi.exports;
/**
 * @license React
 * use-sync-external-store-shim/with-selector.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var ir = Nt, Jo = Yo;
function Xo(t, e) {
  return t === e && (t !== 0 || 1 / t === 1 / e) || t !== t && e !== e;
}
var Go = typeof Object.is == "function" ? Object.is : Xo, Qo = Jo.useSyncExternalStore, Zo = ir.useRef, ea = ir.useEffect, ta = ir.useMemo, ra = ir.useDebugValue;
di.useSyncExternalStoreWithSelector = function(t, e, r, n, i) {
  var s = Zo(null);
  if (s.current === null) {
    var o = { hasValue: !1, value: null };
    s.current = o;
  } else o = s.current;
  s = ta(
    function() {
      function a(h) {
        if (!d) {
          if (d = !0, f = h, h = n(h), i !== void 0 && o.hasValue) {
            var _ = o.value;
            if (i(_, h))
              return m = _;
          }
          return m = h;
        }
        if (_ = m, Go(f, h)) return _;
        var x = n(h);
        return i !== void 0 && i(_, x) ? (f = h, _) : (f = h, m = x);
      }
      var d = !1, f, m, b = r === void 0 ? null : r;
      return [
        function() {
          return a(e());
        },
        b === null ? void 0 : function() {
          return a(b());
        }
      ];
    },
    [e, r, n, i]
  );
  var l = Qo(t, s[0], s[1]);
  return ea(
    function() {
      o.hasValue = !0, o.value = l;
    },
    [l]
  ), ra(l), l;
};
ui.exports = di;
var na = ui.exports;
const ia = /* @__PURE__ */ Bn(na), pi = {}, { useDebugValue: sa } = Nt, { useSyncExternalStoreWithSelector: oa } = ia;
let Tn = !1;
const aa = (t) => t;
function la(t, e = aa, r) {
  (pi ? "production" : void 0) !== "production" && r && !Tn && (console.warn(
    "[DEPRECATED] Use `createWithEqualityFn` instead of `create` or use `useStoreWithEqualityFn` instead of `useStore`. They can be imported from 'zustand/traditional'. https://github.com/pmndrs/zustand/discussions/1937"
  ), Tn = !0);
  const n = oa(
    t.subscribe,
    t.getState,
    t.getServerState || t.getInitialState,
    e,
    r
  );
  return sa(n), n;
}
const kn = (t) => {
  (pi ? "production" : void 0) !== "production" && typeof t != "function" && console.warn(
    "[DEPRECATED] Passing a vanilla store will be unsupported in a future version. Instead use `import { useStore } from 'zustand'`."
  );
  const e = typeof t == "function" ? Bo(t) : t, r = (n, i) => la(e, n, i);
  return Object.assign(r, e), r;
}, ca = (t) => t ? kn(t) : kn, ct = [
  "frieren",
  "himmel",
  "heiter",
  "eisen",
  "fern",
  "stark",
  "sein",
  "übel"
], ua = {
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
const W = ca((t, e) => ({
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
function da() {
  const t = W((r) => r.toasts), e = W((r) => r.popToast);
  return ye(() => {
    const r = t.map((n) => setTimeout(() => e(n.id), 4e3));
    return () => {
      r.forEach(clearTimeout);
    };
  }, [t, e]), /* @__PURE__ */ v.jsx("div", { className: "fixed bottom-4 left-1/2 -translate-x-1/2 flex flex-col gap-2 z-50", children: t.map((r) => /* @__PURE__ */ v.jsx("div", { className: `px-3 py-2 rounded text-sm shadow font-medium bg-slate-800 border ${r.kind === "error" ? "border-red-500 text-red-300" : "border-slate-600 text-slate-200"}`, children: r.msg }, r.id)) });
}
const fa = 400;
function sr() {
  const t = qe(null), e = qe([]);
  return ye(() => {
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
    function l(h, _, x = !1, M) {
      let C = Math.random();
      const p = M ?? s;
      M === void 0 && s++;
      const E = x ? o(p) : { scale: 1, demote: 0 };
      let R = C > 0.998, k = !R && C > 0.98;
      E.demote > 0 && (R && Math.random() < E.demote && (R = !1), k && Math.random() < E.demote && (k = !1)), x && (R = !1, k = !1);
      const q = k;
      let g;
      R ? g = 0.92 + Math.random() * 0.08 : k ? g = 0.85 + Math.random() * 0.15 : g = 0.05 + Math.random() ** 2.2 * 0.75;
      const N = (Dt, Me) => {
        const lr = Math.random(), cr = Math.random();
        return Dt + (lr + cr) / 2 * (Me - Dt);
      };
      let U = N(0.9, 1.4) + g ** 1.2 * (R ? 5.5 : k ? 4 : 3.2);
      const j = N(0.85, 1.25);
      let B = U * j;
      x && E.scale < 1 && (B *= E.scale);
      let F;
      R ? F = 1.05 + Math.random() * 0.5 : k ? (F = 0.55 + g ** 1.05 * 0.7 + Math.random() * 0.25, F > 1.25 && (F = 1.25)) : (F = 0.15 + g ** 1.05 * 0.6 + Math.random() * 0.15, F > 1.05 && (F = 1.05)), !R && F < 0.15 && (F = 0.15);
      const oe = 0.035 + N(0, 0.08), ae = g ** 1.45 * (R ? 4.9 : k ? 1.55 : 1.25);
      let se = oe + ae * N(0.85, 1.3);
      x && E.scale < 1 && (se *= E.scale);
      const Ae = Math.min(1, F), we = Math.min(1, (B - 1) / 4.5);
      se *= 1 + 0.18 * Math.max(Ae, we), R && se < 1.25 && (se = 1.25 + Math.random() * 0.4);
      const te = r.width, Ke = r.height, De = 0.18 + Math.random() * 0.28, je = R || Math.random() < 0.18, fe = R ? 0.55 : q ? 0.38 : Math.max(0.1, 0.28 - De * 0.25), Te = F * (fe + Math.random() * (1 - fe)), Ye = F * (fe + Math.random() * (1 - fe)), ve = (R ? 130 : q ? 160 : 120) + Math.random() * (R ? 140 : 150), Se = Math.min(1, se / 2.5), Be = 10, At = 120 - Be;
      let Je = Math.random();
      const ue = 0.8 + Se * 1.4;
      Je = Math.pow(Je, ue);
      const ke = (1 - Se) * ((40 - Be) / At);
      Je = Je * (1 - ke) + ke;
      const mt = (Be + Je * At) * 1e3;
      return {
        x: h ?? Math.random() * te,
        y: _ ?? (x ? Math.random() * Ke : -Math.random() * Ke),
        z: g,
        speed: se,
        size: B,
        alpha: F,
        colorRare: q,
        colorPhase: Math.random() * Math.PI * 2,
        colorSpeed: 0.01 + Math.random() * 0.02,
        colorMode: Math.random() < 0.5 ? 0 : 1,
        twinkleAmount: De,
        twinkleEnabled: je,
        dimFloor: fe,
        twinkleStart: Te,
        twinkleTarget: Ye,
        twinkleT: 0,
        twinkleDuration: ve,
        microPhase: Math.random() * Math.PI * 2,
        microSpeed: (R ? 0.18 : 0.1) + Math.random() * 0.05,
        ultraRare: R,
        trail: R ? [] : void 0,
        currentAlpha: Te,
        lifeMsRemaining: mt,
        lifeMsTotal: mt
      };
    }
    if (!e.current.length)
      for (let h = 0; h < fa; h++) e.current.push(l(void 0, void 0, !0, h));
    let a = performance.now();
    function d(h, _, x, M) {
      const E = (0.15 + 0.75 * Math.min(1, M / 2)) * x, R = x, k = x, q = Math.min(E, k * 0.95, R * 0.48), g = h, N = _, U = h + R, j = _ + k, B = n;
      B.beginPath(), B.moveTo(g, N), B.lineTo(U, N), B.lineTo(U, j - q), B.quadraticCurveTo(U, j, U - q, j), B.lineTo(g + q, j), B.quadraticCurveTo(g, j, g, j - q), B.lineTo(g, N), B.closePath(), B.fill();
    }
    function f(h, _) {
      if (_ > 3 && (_ = 3), !h.twinkleEnabled) {
        h.currentAlpha = h.alpha;
        return;
      }
      if (h.twinkleT += _, h.twinkleT >= h.twinkleDuration) {
        h.twinkleStart = h.twinkleTarget, h.twinkleTarget = h.alpha * (h.dimFloor + Math.random() * (1 - h.dimFloor));
        const p = h.ultraRare ? 150 : h.colorRare ? 140 : 110, E = h.ultraRare ? 170 : 140;
        h.twinkleDuration = p + Math.random() * E, h.twinkleT = 0;
      }
      const x = Math.min(1, h.twinkleT / h.twinkleDuration), M = x * x * (3 - 2 * x);
      let C = h.twinkleStart + (h.twinkleTarget - h.twinkleStart) * M;
      if (h.microPhase += h.microSpeed * _, h.ultraRare) {
        const p = Math.sin(h.microPhase) * 0.04;
        C = Math.min(1, Math.max(h.alpha * h.dimFloor, C * (1 + p)));
      }
      h.currentAlpha = C;
    }
    function m(h, _) {
      if (h.ultraRare) {
        h.colorPhase += h.colorSpeed * 2.2 * _;
        const x = [
          [255, 120, 220],
          // pink
          [120, 255, 170],
          // green
          [255, 255, 255]
          // white
        ], M = h.colorPhase % x.length, C = Math.floor(M), p = (C + 1) % x.length, E = M - C, R = x[C], k = x[p], q = Math.round(R[0] + (k[0] - R[0]) * E), g = Math.round(R[1] + (k[1] - R[1]) * E), N = Math.round(R[2] + (k[2] - R[2]) * E);
        return `rgb(${q},${g},${N})`;
      }
      if (h.colorRare) {
        h.colorPhase += h.colorSpeed * _;
        const x = (Math.sin(h.colorPhase) + 1) / 2;
        if (h.colorMode === 0) {
          const M = Math.round(255 - 165 * x), C = Math.round(255 - 105 * x);
          return `rgb(${M},${C},255)`;
        } else {
          const C = Math.round(255 - 175 * x), p = Math.round(255 - 175 * x);
          return `rgb(255,${C},${p})`;
        }
      }
      return "#ffffff";
    }
    const b = () => {
      const h = performance.now(), _ = h - a, x = _ / 16.666;
      a = h, n.clearRect(0, 0, r.width, r.height), r.width, r.height;
      const M = 220;
      for (let C = 0; C < e.current.length; C++) {
        const p = e.current[C];
        if (p.ultraRare) {
          if (p.trail || (p.trail = []), !p.maxTrail) {
            const U = p.speed * 14, j = Math.min(1, p.speed / 1.9), B = U * (1 + 8 * j);
            p.maxTrail = Math.min(300, Math.floor(B));
          }
          p.trail.push({ x: p.x + p.size / 2, y: p.y + p.size / 2 }), p.trail.length > p.maxTrail && p.trail.splice(0, p.trail.length - p.maxTrail);
        }
        if (p.lifeMsRemaining -= _, p.lifeMsRemaining <= 0) {
          const N = l(Math.random() * r.width, void 0, !1);
          N.y = -N.size - 1, e.current[C] = N;
          continue;
        }
        if (p.y += p.speed * x, p.y - p.size > r.height + M) {
          e.current[C] = l(Math.random() * r.width, -p.size - 1);
          continue;
        }
        f(p, x);
        const E = p.currentAlpha ?? p.alpha, R = 1500, k = p.lifeMsRemaining < R ? Math.max(0, p.lifeMsRemaining / R) : 1, q = E * k;
        let g = m(p, x);
        if (p.ultraRare) {
          const N = q;
          if (p.trail && p.trail.length) {
            const B = p.trail.length;
            for (let F = 0; F < B; F++) {
              const oe = p.trail[B - 1 - F], ae = 1 - F / B, se = Math.pow(ae, 3);
              n.globalAlpha = Math.min(1, N) * se * 0.6;
              const Ae = 0.35 + 0.65 * se;
              n.fillStyle = g;
              const we = p.size * Ae;
              n.fillRect(oe.x - we / 2, oe.y - we / 2, we, we);
            }
          }
          n.globalAlpha = Math.min(1, N * 1.02), n.fillStyle = g;
          const U = p.x - p.size * 0.1, j = p.y - p.size * 0.1;
          if (d(U, j, p.size * 1.2, p.speed), N > 1.02) {
            const B = Math.min(1, (N - 1) * 0.85);
            n.save(), n.globalCompositeOperation = "lighter", n.globalAlpha = B, n.fillStyle = g;
            const F = p.size * 0.75;
            d(U + p.size * 0.225, j + p.size * 0.225, F, p.speed), n.restore();
          }
        } else if (n.globalAlpha = Math.min(1, q), n.fillStyle = g, d(p.x, p.y, p.size, p.speed), q > 1.01) {
          const N = Math.min(0.9, (q - 1) * 0.8);
          n.save(), n.globalCompositeOperation = "lighter", n.globalAlpha = N, n.fillStyle = g;
          const U = p.size * 0.55;
          d(p.x + p.size * 0.225, p.y + p.size * 0.225, U, p.speed), n.restore();
        }
      }
      n.globalAlpha = 1, requestAnimationFrame(b);
    };
    return b(), () => window.removeEventListener("resize", i);
  }, []), /* @__PURE__ */ v.jsx(
    "canvas",
    {
      ref: t,
      "data-darkreader-ignore": !0,
      className: "fixed inset-0 z-0 bg-black pointer-events-none [isolation:isolate]"
    }
  );
}
function ha() {
  const t = ["dev-room-1000"];
  return /* @__PURE__ */ v.jsxs("div", { className: "relative h-full flex flex-col items-center justify-center gap-10 py-24", children: [
    /* @__PURE__ */ v.jsx(sr, {}),
    /* @__PURE__ */ v.jsx("h1", { className: "text-4xl font-bold tracking-tight drop-shadow", children: "Watchparty" }),
    /* @__PURE__ */ v.jsxs("div", { className: "w-full max-w-md space-y-4 z-10", children: [
      /* @__PURE__ */ v.jsx("h2", { className: "text-sm uppercase tracking-wide opacity-70", children: "Rooms" }),
      /* @__PURE__ */ v.jsx("ul", { className: "space-y-2", children: t.map((e) => /* @__PURE__ */ v.jsx("li", { children: /* @__PURE__ */ v.jsxs(ci, { to: `/room/${encodeURIComponent(e)}`, className: "block bg-slate-900/80 backdrop-blur border border-slate-700 hover:border-slate-500 rounded px-4 py-3 transition-colors", children: [
        /* @__PURE__ */ v.jsx("div", { className: "font-medium", children: e }),
        /* @__PURE__ */ v.jsx("div", { className: "text-[11px] opacity-60", children: "Join room" })
      ] }) }, e)) }),
      /* @__PURE__ */ v.jsx("div", { className: "pt-6 text-xs opacity-50", children: "Provide ?roomKey= query param to join directly." })
    ] })
  ] });
}
function pa() {
  const t = W((r) => r.roster), e = Object.values(t);
  return e.length ? /* @__PURE__ */ v.jsx("ul", { className: "text-xs space-y-1", children: e.map((r) => {
    const n = r.name && ua[r.name] || "#cbd5e1";
    return /* @__PURE__ */ v.jsxs("li", { className: "flex items-center gap-2", children: [
      r.sprite ? /* @__PURE__ */ v.jsx("img", { src: Br(r.sprite), alt: r.sprite, className: "w-7 h-7 rounded object-cover" }) : /* @__PURE__ */ v.jsx("span", { className: "inline-block w-7 h-7 bg-slate-700/50 rounded" }),
      /* @__PURE__ */ v.jsx("span", { className: "truncate max-w-[120px] font-medium", style: { color: n }, children: r.name || "Anon" }),
      r.isLeader && /* @__PURE__ */ v.jsx("span", { className: "px-1 rounded bg-emerald-600 text-[9px]", children: "L" })
    ] }, r.clientId);
  }) }) : /* @__PURE__ */ v.jsx("div", { className: "text-xs opacity-50", children: "No users" });
}
const Ce = /* @__PURE__ */ Object.create(null);
Ce.open = "0";
Ce.close = "1";
Ce.ping = "2";
Ce.pong = "3";
Ce.message = "4";
Ce.upgrade = "5";
Ce.noop = "6";
const Wt = /* @__PURE__ */ Object.create(null);
Object.keys(Ce).forEach((t) => {
  Wt[Ce[t]] = t;
});
const Sr = { type: "error", data: "parser error" }, mi = typeof Blob == "function" || typeof Blob < "u" && Object.prototype.toString.call(Blob) === "[object BlobConstructor]", gi = typeof ArrayBuffer == "function", yi = (t) => typeof ArrayBuffer.isView == "function" ? ArrayBuffer.isView(t) : t && t.buffer instanceof ArrayBuffer, Ur = ({ type: t, data: e }, r, n) => mi && e instanceof Blob ? r ? n(e) : Mn(e, n) : gi && (e instanceof ArrayBuffer || yi(e)) ? r ? n(e) : Mn(new Blob([e]), n) : n(Ce[t] + (e || "")), Mn = (t, e) => {
  const r = new FileReader();
  return r.onload = function() {
    const n = r.result.split(",")[1];
    e("b" + (n || ""));
  }, r.readAsDataURL(t);
};
function Nn(t) {
  return t instanceof Uint8Array ? t : t instanceof ArrayBuffer ? new Uint8Array(t) : new Uint8Array(t.buffer, t.byteOffset, t.byteLength);
}
let vr;
function ma(t, e) {
  if (mi && t.data instanceof Blob)
    return t.data.arrayBuffer().then(Nn).then(e);
  if (gi && (t.data instanceof ArrayBuffer || yi(t.data)))
    return e(Nn(t.data));
  Ur(t, !1, (r) => {
    vr || (vr = new TextEncoder()), e(vr.encode(r));
  });
}
const Pn = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/", Rt = typeof Uint8Array > "u" ? [] : new Uint8Array(256);
for (let t = 0; t < Pn.length; t++)
  Rt[Pn.charCodeAt(t)] = t;
const ga = (t) => {
  let e = t.length * 0.75, r = t.length, n, i = 0, s, o, l, a;
  t[t.length - 1] === "=" && (e--, t[t.length - 2] === "=" && e--);
  const d = new ArrayBuffer(e), f = new Uint8Array(d);
  for (n = 0; n < r; n += 4)
    s = Rt[t.charCodeAt(n)], o = Rt[t.charCodeAt(n + 1)], l = Rt[t.charCodeAt(n + 2)], a = Rt[t.charCodeAt(n + 3)], f[i++] = s << 2 | o >> 4, f[i++] = (o & 15) << 4 | l >> 2, f[i++] = (l & 3) << 6 | a & 63;
  return d;
}, ya = typeof ArrayBuffer == "function", Fr = (t, e) => {
  if (typeof t != "string")
    return {
      type: "message",
      data: vi(t, e)
    };
  const r = t.charAt(0);
  return r === "b" ? {
    type: "message",
    data: va(t.substring(1), e)
  } : Wt[r] ? t.length > 1 ? {
    type: Wt[r],
    data: t.substring(1)
  } : {
    type: Wt[r]
  } : Sr;
}, va = (t, e) => {
  if (ya) {
    const r = ga(t);
    return vi(r, e);
  } else
    return { base64: !0, data: t };
}, vi = (t, e) => {
  switch (e) {
    case "blob":
      return t instanceof Blob ? t : new Blob([t]);
    case "arraybuffer":
    default:
      return t instanceof ArrayBuffer ? t : t.buffer;
  }
}, bi = "", ba = (t, e) => {
  const r = t.length, n = new Array(r);
  let i = 0;
  t.forEach((s, o) => {
    Ur(s, !1, (l) => {
      n[o] = l, ++i === r && e(n.join(bi));
    });
  });
}, xa = (t, e) => {
  const r = t.split(bi), n = [];
  for (let i = 0; i < r.length; i++) {
    const s = Fr(r[i], e);
    if (n.push(s), s.type === "error")
      break;
  }
  return n;
};
function wa() {
  return new TransformStream({
    transform(t, e) {
      ma(t, (r) => {
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
function _a(t, e) {
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
          const a = Vt(r, 8), d = new DataView(a.buffer, a.byteOffset, a.length), f = d.getUint32(0);
          if (f > Math.pow(2, 21) - 1) {
            l.enqueue(Sr);
            break;
          }
          i = f * Math.pow(2, 32) + d.getUint32(4), n = 3;
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
const xi = 4;
function ie(t) {
  if (t) return Ea(t);
}
function Ea(t) {
  for (var e in ie.prototype)
    t[e] = ie.prototype[e];
  return t;
}
ie.prototype.on = ie.prototype.addEventListener = function(t, e) {
  return this._callbacks = this._callbacks || {}, (this._callbacks["$" + t] = this._callbacks["$" + t] || []).push(e), this;
};
ie.prototype.once = function(t, e) {
  function r() {
    this.off(t, r), e.apply(this, arguments);
  }
  return r.fn = e, this.on(t, r), this;
};
ie.prototype.off = ie.prototype.removeListener = ie.prototype.removeAllListeners = ie.prototype.removeEventListener = function(t, e) {
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
ie.prototype.emit = function(t) {
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
ie.prototype.emitReserved = ie.prototype.emit;
ie.prototype.listeners = function(t) {
  return this._callbacks = this._callbacks || {}, this._callbacks["$" + t] || [];
};
ie.prototype.hasListeners = function(t) {
  return !!this.listeners(t).length;
};
const or = typeof Promise == "function" && typeof Promise.resolve == "function" ? (e) => Promise.resolve().then(e) : (e, r) => r(e, 0), xe = typeof self < "u" ? self : typeof window < "u" ? window : Function("return this")(), Sa = "arraybuffer";
function wi(t, ...e) {
  return e.reduce((r, n) => (t.hasOwnProperty(n) && (r[n] = t[n]), r), {});
}
const Ra = xe.setTimeout, Ca = xe.clearTimeout;
function ar(t, e) {
  e.useNativeTimers ? (t.setTimeoutFn = Ra.bind(xe), t.clearTimeoutFn = Ca.bind(xe)) : (t.setTimeoutFn = xe.setTimeout.bind(xe), t.clearTimeoutFn = xe.clearTimeout.bind(xe));
}
const Ta = 1.33;
function ka(t) {
  return typeof t == "string" ? Ma(t) : Math.ceil((t.byteLength || t.size) * Ta);
}
function Ma(t) {
  let e = 0, r = 0;
  for (let n = 0, i = t.length; n < i; n++)
    e = t.charCodeAt(n), e < 128 ? r += 1 : e < 2048 ? r += 2 : e < 55296 || e >= 57344 ? r += 3 : (n++, r += 4);
  return r;
}
function _i() {
  return Date.now().toString(36).substring(3) + Math.random().toString(36).substring(2, 5);
}
function Na(t) {
  let e = "";
  for (let r in t)
    t.hasOwnProperty(r) && (e.length && (e += "&"), e += encodeURIComponent(r) + "=" + encodeURIComponent(t[r]));
  return e;
}
function Pa(t) {
  let e = {}, r = t.split("&");
  for (let n = 0, i = r.length; n < i; n++) {
    let s = r[n].split("=");
    e[decodeURIComponent(s[0])] = decodeURIComponent(s[1]);
  }
  return e;
}
class La extends Error {
  constructor(e, r, n) {
    super(e), this.description = r, this.context = n, this.type = "TransportError";
  }
}
class zr extends ie {
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
    return super.emitReserved("error", new La(e, r, n)), this;
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
    const r = Na(e);
    return r.length ? "?" + r : "";
  }
}
class Oa extends zr {
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
    xa(e, this.socket.binaryType).forEach(r), this.readyState !== "closed" && (this._polling = !1, this.emitReserved("pollComplete"), this.readyState === "open" && this._poll());
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
    this.writable = !1, ba(e, (r) => {
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
    return this.opts.timestampRequests !== !1 && (r[this.opts.timestampParam] = _i()), !this.supportsBinary && !r.sid && (r.b64 = 1), this.createUri(e, r);
  }
}
let Ei = !1;
try {
  Ei = typeof XMLHttpRequest < "u" && "withCredentials" in new XMLHttpRequest();
} catch {
}
const Aa = Ei;
function Da() {
}
class ja extends Oa {
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
let ut = class Kt extends ie {
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
    const r = wi(this._opts, "agent", "pfx", "key", "passphrase", "cert", "ca", "ciphers", "rejectUnauthorized", "autoUnref");
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
      if (this._xhr.onreadystatechange = Da, e)
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
    attachEvent("onunload", Ln);
  else if (typeof addEventListener == "function") {
    const t = "onpagehide" in xe ? "pagehide" : "unload";
    addEventListener(t, Ln, !1);
  }
}
function Ln() {
  for (let t in ut.requests)
    ut.requests.hasOwnProperty(t) && ut.requests[t].abort();
}
const Ia = function() {
  const t = Si({
    xdomain: !1
  });
  return t && t.responseType !== null;
}();
class Ba extends ja {
  constructor(e) {
    super(e);
    const r = e && e.forceBase64;
    this.supportsBinary = Ia && !r;
  }
  request(e = {}) {
    return Object.assign(e, { xd: this.xd }, this.opts), new ut(Si, this.uri(), e);
  }
}
function Si(t) {
  const e = t.xdomain;
  try {
    if (typeof XMLHttpRequest < "u" && (!e || Aa))
      return new XMLHttpRequest();
  } catch {
  }
  if (!e)
    try {
      return new xe[["Active"].concat("Object").join("X")]("Microsoft.XMLHTTP");
    } catch {
    }
}
const Ri = typeof navigator < "u" && typeof navigator.product == "string" && navigator.product.toLowerCase() === "reactnative";
class Ua extends zr {
  get name() {
    return "websocket";
  }
  doOpen() {
    const e = this.uri(), r = this.opts.protocols, n = Ri ? {} : wi(this.opts, "agent", "perMessageDeflate", "pfx", "key", "passphrase", "cert", "ca", "ciphers", "rejectUnauthorized", "localAddress", "protocolVersion", "origin", "maxPayload", "family", "checkServerIdentity");
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
    return this.opts.timestampRequests && (r[this.opts.timestampParam] = _i()), this.supportsBinary || (r.b64 = 1), this.createUri(e, r);
  }
}
const xr = xe.WebSocket || xe.MozWebSocket;
class Fa extends Ua {
  createSocket(e, r, n) {
    return Ri ? new xr(e, r, n) : r ? new xr(e, r) : new xr(e);
  }
  doWrite(e, r) {
    this.ws.send(r);
  }
}
class za extends zr {
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
        const r = _a(Number.MAX_SAFE_INTEGER, this.socket.binaryType), n = e.readable.pipeThrough(r).getReader(), i = wa();
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
const $a = {
  websocket: Fa,
  webtransport: za,
  polling: Ba
}, qa = /^(?:(?![^:@\/?#]+:[^:@\/]*@)(http|https|ws|wss):\/\/)?((?:(([^:@\/?#]*)(?::([^:@\/?#]*))?)?@)?((?:[a-f0-9]{0,4}:){2,7}[a-f0-9]{0,4}|[^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/, Va = [
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
  let i = qa.exec(t || ""), s = {}, o = 14;
  for (; o--; )
    s[Va[o]] = i[o] || "";
  return r != -1 && n != -1 && (s.source = e, s.host = s.host.substring(1, s.host.length - 1).replace(/;/g, ":"), s.authority = s.authority.replace("[", "").replace("]", "").replace(/;/g, ":"), s.ipv6uri = !0), s.pathNames = Ha(s, s.path), s.queryKey = Wa(s, s.query), s;
}
function Ha(t, e) {
  const r = /\/{2,9}/g, n = e.replace(r, "/").split("/");
  return (e.slice(0, 1) == "/" || e.length === 0) && n.splice(0, 1), e.slice(-1) == "/" && n.splice(n.length - 1, 1), n;
}
function Wa(t, e) {
  const r = {};
  return e.replace(/(?:^|&)([^&=]*)=?([^&]*)/g, function(n, i, s) {
    i && (r[i] = s);
  }), r;
}
const Cr = typeof addEventListener == "function" && typeof removeEventListener == "function", Yt = [];
Cr && addEventListener("offline", () => {
  Yt.forEach((t) => t());
}, !1);
class He extends ie {
  /**
   * Socket constructor.
   *
   * @param {String|Object} uri - uri or options
   * @param {Object} opts - options
   */
  constructor(e, r) {
    if (super(), this.binaryType = Sa, this.writeBuffer = [], this._prevBufferLen = 0, this._pingInterval = -1, this._pingTimeout = -1, this._maxPayload = -1, this._pingTimeoutTime = 1 / 0, e && typeof e == "object" && (r = e, e = null), e) {
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
    }, r), this.opts.path = this.opts.path.replace(/\/$/, "") + (this.opts.addTrailingSlash ? "/" : ""), typeof this.opts.query == "string" && (this.opts.query = Pa(this.opts.query)), Cr && (this.opts.closeOnBeforeunload && (this._beforeunloadEventListener = () => {
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
    r.EIO = xi, r.transport = e, this.id && (r.sid = this.id);
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
      if (i && (r += ka(i)), n > 0 && r > this._maxPayload)
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
He.protocol = xi;
class Ka extends He {
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
      n || (r.send([{ type: "ping", data: "probe" }]), r.once("packet", (m) => {
        if (!n)
          if (m.type === "pong" && m.data === "probe") {
            if (this.upgrading = !0, this.emitReserved("upgrading", r), !r)
              return;
            He.priorWebsocketSuccess = r.name === "websocket", this.transport.pause(() => {
              n || this.readyState !== "closed" && (f(), this.setTransport(r), r.send([{ type: "upgrade" }]), this.emitReserved("upgrade", r), r = null, this.upgrading = !1, this.flush());
            });
          } else {
            const b = new Error("probe error");
            b.transport = r.name, this.emitReserved("upgradeError", b);
          }
      }));
    };
    function s() {
      n || (n = !0, f(), r.close(), r = null);
    }
    const o = (m) => {
      const b = new Error("probe error: " + m);
      b.transport = r.name, s(), this.emitReserved("upgradeError", b);
    };
    function l() {
      o("transport closed");
    }
    function a() {
      o("socket closed");
    }
    function d(m) {
      r && m.name !== r.name && s();
    }
    const f = () => {
      r.removeListener("open", i), r.removeListener("error", o), r.removeListener("close", l), this.off("close", a), this.off("upgrading", d);
    };
    r.once("open", i), r.once("error", o), r.once("close", l), this.once("close", a), this.once("upgrading", d), this._upgrades.indexOf("webtransport") !== -1 && e !== "webtransport" ? this.setTimeoutFn(() => {
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
let Ya = class extends Ka {
  constructor(e, r = {}) {
    const n = typeof e == "object" ? e : r;
    (!n.transports || n.transports && typeof n.transports[0] == "string") && (n.transports = (n.transports || ["polling", "websocket", "webtransport"]).map((i) => $a[i]).filter((i) => !!i)), super(e, n);
  }
};
function Ja(t, e = "", r) {
  let n = t;
  r = r || typeof location < "u" && location, t == null && (t = r.protocol + "//" + r.host), typeof t == "string" && (t.charAt(0) === "/" && (t.charAt(1) === "/" ? t = r.protocol + t : t = r.host + t), /^(https?|wss?):\/\//.test(t) || (typeof r < "u" ? t = r.protocol + "//" + t : t = "https://" + t), n = Rr(t)), n.port || (/^(http|ws)$/.test(n.protocol) ? n.port = "80" : /^(http|ws)s$/.test(n.protocol) && (n.port = "443")), n.path = n.path || "/";
  const s = n.host.indexOf(":") !== -1 ? "[" + n.host + "]" : n.host;
  return n.id = n.protocol + "://" + s + ":" + n.port + e, n.href = n.protocol + "://" + s + (r && r.port === n.port ? "" : ":" + n.port), n;
}
const Xa = typeof ArrayBuffer == "function", Ga = (t) => typeof ArrayBuffer.isView == "function" ? ArrayBuffer.isView(t) : t.buffer instanceof ArrayBuffer, Ci = Object.prototype.toString, Qa = typeof Blob == "function" || typeof Blob < "u" && Ci.call(Blob) === "[object BlobConstructor]", Za = typeof File == "function" || typeof File < "u" && Ci.call(File) === "[object FileConstructor]";
function $r(t) {
  return Xa && (t instanceof ArrayBuffer || Ga(t)) || Qa && t instanceof Blob || Za && t instanceof File;
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
function el(t) {
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
function tl(t, e) {
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
const rl = [
  "connect",
  "connect_error",
  "disconnect",
  "disconnecting",
  "newListener",
  "removeListener"
  // used by the Node.js EventEmitter
], nl = 5;
var V;
(function(t) {
  t[t.CONNECT = 0] = "CONNECT", t[t.DISCONNECT = 1] = "DISCONNECT", t[t.EVENT = 2] = "EVENT", t[t.ACK = 3] = "ACK", t[t.CONNECT_ERROR = 4] = "CONNECT_ERROR", t[t.BINARY_EVENT = 5] = "BINARY_EVENT", t[t.BINARY_ACK = 6] = "BINARY_ACK";
})(V || (V = {}));
class il {
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
    return (e.type === V.EVENT || e.type === V.ACK) && Jt(e) ? this.encodeAsBinary({
      type: e.type === V.EVENT ? V.BINARY_EVENT : V.BINARY_ACK,
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
    return (e.type === V.BINARY_EVENT || e.type === V.BINARY_ACK) && (r += e.attachments + "-"), e.nsp && e.nsp !== "/" && (r += e.nsp + ","), e.id != null && (r += e.id), e.data != null && (r += JSON.stringify(e.data, this.replacer)), r;
  }
  /**
   * Encode packet as 'buffer sequence' by removing blobs, and
   * deconstructing packet into object with placeholders and
   * a list of buffers.
   */
  encodeAsBinary(e) {
    const r = el(e), n = this.encodeAsString(r.packet), i = r.buffers;
    return i.unshift(n), i;
  }
}
function On(t) {
  return Object.prototype.toString.call(t) === "[object Object]";
}
class qr extends ie {
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
      const n = r.type === V.BINARY_EVENT;
      n || r.type === V.BINARY_ACK ? (r.type = n ? V.EVENT : V.ACK, this.reconstructor = new sl(r), r.attachments === 0 && super.emitReserved("decoded", r)) : super.emitReserved("decoded", r);
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
    if (V[n.type] === void 0)
      throw new Error("unknown packet type " + n.type);
    if (n.type === V.BINARY_EVENT || n.type === V.BINARY_ACK) {
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
      case V.CONNECT:
        return On(r);
      case V.DISCONNECT:
        return r === void 0;
      case V.CONNECT_ERROR:
        return typeof r == "string" || On(r);
      case V.EVENT:
      case V.BINARY_EVENT:
        return Array.isArray(r) && (typeof r[0] == "number" || typeof r[0] == "string" && rl.indexOf(r[0]) === -1);
      case V.ACK:
      case V.BINARY_ACK:
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
class sl {
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
      const r = tl(this.reconPack, this.buffers);
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
const ol = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Decoder: qr,
  Encoder: il,
  get PacketType() {
    return V;
  },
  protocol: nl
}, Symbol.toStringTag, { value: "Module" }));
function Ee(t, e, r) {
  return t.on(e, r), function() {
    t.off(e, r);
  };
}
const al = Object.freeze({
  connect: 1,
  connect_error: 1,
  disconnect: 1,
  disconnecting: 1,
  // EventEmitter reserved events: https://nodejs.org/api/events.html#events_event_newlistener
  newListener: 1,
  removeListener: 1
});
class Ti extends ie {
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
    if (al.hasOwnProperty(e))
      throw new Error('"' + e.toString() + '" is a reserved event name');
    if (r.unshift(e), this._opts.retries && !this.flags.fromQueue && !this.flags.volatile)
      return this._addToQueue(r), this;
    const o = {
      type: V.EVENT,
      data: r
    };
    if (o.options = {}, o.options.compress = this.flags.compress !== !1, typeof r[r.length - 1] == "function") {
      const f = this.ids++, m = r.pop();
      this._registerAckCallback(f, m), o.id = f;
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
      type: V.CONNECT,
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
        case V.CONNECT:
          e.data && e.data.sid ? this.onconnect(e.data.sid, e.data.pid) : this.emitReserved("connect_error", new Error("It seems you are trying to reach a Socket.IO server in v2.x with a v3.x client, but they are not compatible (more information here: https://socket.io/docs/v3/migrating-from-2-x-to-3-0/)"));
          break;
        case V.EVENT:
        case V.BINARY_EVENT:
          this.onevent(e);
          break;
        case V.ACK:
        case V.BINARY_ACK:
          this.onack(e);
          break;
        case V.DISCONNECT:
          this.ondisconnect();
          break;
        case V.CONNECT_ERROR:
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
        type: V.ACK,
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
    return this.connected && this.packet({ type: V.DISCONNECT }), this.destroy(), this.connected && this.onclose("io client disconnect"), this;
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
class Mr extends ie {
  constructor(e, r) {
    var n;
    super(), this.nsps = {}, this.subs = [], e && typeof e == "object" && (r = e, e = void 0), r = r || {}, r.path = r.path || "/socket.io", this.opts = r, ar(this, r), this.reconnection(r.reconnection !== !1), this.reconnectionAttempts(r.reconnectionAttempts || 1 / 0), this.reconnectionDelay(r.reconnectionDelay || 1e3), this.reconnectionDelayMax(r.reconnectionDelayMax || 5e3), this.randomizationFactor((n = r.randomizationFactor) !== null && n !== void 0 ? n : 0.5), this.backoff = new pt({
      min: this.reconnectionDelay(),
      max: this.reconnectionDelayMax(),
      jitter: this.randomizationFactor()
    }), this.timeout(r.timeout == null ? 2e4 : r.timeout), this._readyState = "closed", this.uri = e;
    const i = r.parser || ol;
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
    this.engine = new Ya(this.uri, this.opts);
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
    return n ? this._autoConnect && !n.active && n.connect() : (n = new Ti(this, e, r), this.nsps[e] = n), n;
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
const Et = {};
function Xt(t, e) {
  typeof t == "object" && (e = t, t = void 0), e = e || {};
  const r = Ja(t, e.path || "/socket.io"), n = r.source, i = r.id, s = r.path, o = Et[i] && s in Et[i].nsps, l = e.forceNew || e["force new connection"] || e.multiplex === !1 || o;
  let a;
  return l ? a = new Mr(n, e) : (Et[i] || (Et[i] = new Mr(n, e)), a = Et[i]), r.query && !e.query && (e.query = r.queryKey), a.socket(r.path, e);
}
Object.assign(Xt, {
  Manager: Mr,
  Socket: Ti,
  io: Xt,
  connect: Xt
});
const er = {
  serverOrigin: "http://localhost:8080",
  defaultRoomKey: "dev-room-1000"
};
let Nr = { ...er };
function ll(t) {
  Nr = { ...Nr, ...t };
}
function Vr() {
  return Nr;
}
const ki = $i(er);
function cl() {
  return qi(ki);
}
const Mi = (() => {
  try {
    const t = new URLSearchParams(window.location.search);
    if (t.has("verbose") || t.get("v") === "1" || localStorage.getItem("wp_verbose") === "1") return !0;
  } catch {
  }
  return !1;
})();
function ee(t, e) {
  Mi && (e !== void 0 ? console.debug("[wp]", t, e) : console.debug("[wp]", t));
}
function ge() {
  return Mi;
}
let le = null, et = null, An = null;
function ul(t) {
  const e = Ot(), r = W.getState();
  if (r.me.clientId && r.roster[r.me.clientId])
    return (t.name || t.sprite) && (ee("identity_update_emit", { name: t.name, sprite: t.sprite }), e.emit("identity_update", { name: t.name, sprite: t.sprite })), e;
  const n = dl(t), i = () => {
    setTimeout(() => {
      const s = W.getState();
      s.name && (ee("identity_update_emit_post_join", { name: s.name, sprite: s.sprite }), e.emit("identity_update", { name: s.name, sprite: s.sprite || void 0 }));
    }, 40);
  };
  return e.connected ? (ee("join_emit", n), e.emit("join", n), i()) : e.once("connect", () => {
    ee("join_emit", n), e.emit("join", n), i();
  }), e;
}
function dl(t) {
  return {
    room_key: t.room_key,
    name: t.name,
    sprite: t.sprite
  };
}
function Ot() {
  if (!le) {
    let e = Vr().serverOrigin || "/";
    if (e === "/" && typeof window < "u") {
      const r = window.location;
      (r.hostname === "localhost" || r.hostname === "127.0.0.1") && r.port === "5173" && (e = `${r.protocol}//${r.hostname}:8080`, ee("socket_origin_fallback", { origin: e }));
    }
    le = Xt(e, { path: "/watchparty/ws", transports: ["websocket"] }), ee("socket_init", { origin: e }), le.on("connect", () => {
      const r = le == null ? void 0 : le.id;
      if (ee("socket_connect", { id: r }), r)
        try {
          W.getState().ensureMe(r);
        } catch {
        }
    }), le.on("disconnect", (r) => ee("socket_disconnect", { reason: r })), le.on("connect_error", (r) => ee("socket_connect_error", { message: r == null ? void 0 : r.message })), le.on("reconnect_attempt", (r) => ee("socket_reconnect_attempt", { attempt: r })), le.on("reconnect_failed", () => ee("socket_reconnect_failed")), fl(le);
  }
  return le;
}
function fl(t) {
  W.getState(), t.on("snapshot", (e) => {
    var i;
    e != null && e.client_id && W.getState().ensureMe(e.client_id);
    const r = ((e == null ? void 0 : e.users) || []).map((s) => ({
      clientId: s.client_id,
      name: s.name || "Anon",
      sprite: s.sprite_id ?? s.sprite ?? null,
      isLeader: s.client_id === e.leader_id
    }));
    W.getState().applySnapshot({
      mediaId: e.media_id ?? null,
      playheadMs: e.playhead_ms || 0,
      playing: !!e.playing,
      serverSeq: e.server_seq || 0,
      leaderId: e.leader_id || null,
      users: r
    });
    const n = W.getState();
    if (!n.name) {
      (i = n.ensureAutoIdentity) == null || i.call(n);
      const s = W.getState();
      s.name && (ee("identity_auto_assign", { name: s.name, sprite: s.sprite }), t.emit("identity_update", { name: s.name, sprite: s.sprite || void 0 }));
    }
    ee("snapshot", e);
  }), An || (An = setInterval(() => {
    hl();
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
      const s = W.getState(), o = le == null ? void 0 : le.id;
      o && i[o] && (s.name && (i[o].name = s.name), s.sprite && (i[o].sprite = s.sprite)), s.roster = i, W.setState({ roster: i });
    } else if (e.kind && e.user)
      if (e.kind === "leave")
        W.getState().removeUser(e.user.client_id);
      else {
        W.getState().upsertUser({
          clientId: e.user.client_id,
          name: e.user.name || "",
          sprite: e.user.sprite_id ?? e.user.sprite ?? null,
          isLeader: e.user.is_leader
        });
        const i = W.getState(), s = le == null ? void 0 : le.id;
        s && s === e.user.client_id && i.name && W.getState().upsertUser({
          clientId: s,
          name: i.name,
          sprite: i.sprite,
          isLeader: e.user.is_leader
        });
      }
    ee("presence", e);
    const r = W.getState();
    if (!r.name) {
      (n = r.ensureAutoIdentity) == null || n.call(r);
      const i = W.getState();
      i.name && (ee("identity_auto_assign_presence", { name: i.name, sprite: i.sprite }), t.emit("identity_update", { name: i.name, sprite: i.sprite || void 0 }));
    }
  }), t.on("control_broadcast", (e) => {
    const r = W.getState();
    if (Object.prototype.hasOwnProperty.call(e, "media_id")) {
      const n = e.media_id ?? null;
      r.snapshot.mediaId !== n && (r.applySnapshot({ mediaId: n }), n && r.setReadiness({ mediaId: n, ready: !1, readyCount: 0, total: 0 }));
    }
    r.updateControlState({
      playheadMs: e.playhead_ms,
      playing: e.playing,
      serverSeq: e.server_seq,
      leaderId: e.leader_id ?? r.snapshot.leaderId
    }), ee("control_broadcast", e);
  }), t.on("ready_state", (e) => {
    e && (W.getState().setReadiness({
      mediaId: e.media_id,
      ready: !!e.ready,
      readyCount: e.ready_count ?? e.readyCount ?? 0,
      total: e.total ?? 0
    }), ee("ready_state", e));
  }), t.on("control_ack", (e) => {
    typeof (e == null ? void 0 : e.client_seq) == "number" && typeof (e == null ? void 0 : e.server_seq) == "number" && (W.getState().recordAck(e.client_seq, e.server_seq), ee("control_ack", e));
  }), t.on("time_ping", (e) => {
    if (t.emit("time_pong", { id: e == null ? void 0 : e.id }), et && et.ts) {
      const r = Date.now() - et.ts;
      W.getState().addRttSample(r, e == null ? void 0 : e.server_time_ms, et.ts), et = null, ee("time_rtt", { rtt: r, offset: W.getState().drift.offsetMs });
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
    W.getState().appendChat(r), ee("chat", r);
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
    W.getState().pushToast("error", n[r] || r);
  });
}
function hl() {
  et || (et = { ts: Date.now() }, Ot().emit("time_ping", {}));
}
function pl(t, e) {
  const r = {};
  r.name = t, e && (r.sprite = e), !(!r.name && !r.sprite) && (ee("identity_update_emit", r), Ot().emit("identity_update", r));
}
function ml({ mediaUrl: t, indexUrl: e, mediaId: r }) {
  const n = qe(null), [i, s] = ce(!1), [o, l] = ce([]), [a, d] = ce(null), f = W((p) => p.readiness), m = W((p) => p.snapshot), b = qe(!1), h = qe(null), _ = qe(null), x = qe(null);
  ye(() => {
    let p = !1;
    return (async () => {
      var E;
      try {
        const R = await fetch(e, { cache: "no-store" });
        if (!R.ok) return;
        const k = await R.json();
        if (p) return;
        l(k.fragments || []), d(k.duration_ms || null), ge() && console.debug("[wp] index_loaded", { count: (E = k.fragments) == null ? void 0 : E.length, duration: k.duration_ms });
      } catch (R) {
        ge() && console.debug("[wp] index_error", R == null ? void 0 : R.message);
      }
    })(), () => {
      p = !0;
    };
  }, [e]), ye(() => {
    let p = null;
    const E = new MediaSource();
    _.current = E, n.current && (p = URL.createObjectURL(E), n.current.src = p);
    const R = () => {
      try {
        const k = E.addSourceBuffer('video/mp4; codecs="avc1.4d401e, mp4a.40.2"');
        h.current = k, k.addEventListener("error", () => {
          ge() && console.debug("[wp] sb_error");
        }), o.length && M();
      } catch (k) {
        ge() && console.debug("[wp] mse_source_error", k == null ? void 0 : k.message);
      }
    };
    return E.addEventListener("sourceopen", R), () => {
      E.removeEventListener("sourceopen", R), p && URL.revokeObjectURL(p), x.current && x.current.abort();
    };
  }, [t, r]), ye(() => {
    var p;
    ((p = _.current) == null ? void 0 : p.readyState) === "open" && h.current && o.length && !b.current && M();
  }, [o]);
  function M() {
    if (!o.length || !h.current) return;
    const p = o[0], E = `bytes=${p.start_byte}-${p.end_byte}`, R = new AbortController();
    x.current = R, fetch(t, { headers: { Range: E }, signal: R.signal }).then((k) => k.arrayBuffer()).then((k) => {
      h.current && (h.current.addEventListener("updateend", C, { once: !0 }), h.current.appendBuffer(k));
    }).catch((k) => {
      ge() && console.debug("[wp] init_fetch_error", k == null ? void 0 : k.message);
    });
  }
  function C() {
    b.current || (b.current = !0, Ot().emit("client_ready", { media_id: r, first_appended: !0 }), ge() && console.debug("[wp] client_ready emitted", { mediaId: r })), s(!0);
  }
  return ye(() => {
    const p = n.current;
    if (!p) return;
    m.playing ? p.paused && p.play().catch(() => {
    }) : p.paused || p.pause();
    const E = m.playheadMs;
    if (typeof E == "number" && i) {
      const R = p.currentTime * 1e3, k = E - R, q = Math.abs(k);
      q > 500 ? (p.currentTime = E / 1e3, ge() && console.debug("[wp] drift_snap", { drift: k })) : q > 80 && (p.currentTime = E / 1e3, ge() && console.debug("[wp] drift_nudge", { drift: k }));
    }
  }, [m.playing, m.playheadMs, i]), /* @__PURE__ */ v.jsxs("div", { className: "relative w-full h-full bg-black", children: [
    /* @__PURE__ */ v.jsx("video", { ref: n, className: "w-full h-full", playsInline: !0, muted: !0 }),
    !f.ready && /* @__PURE__ */ v.jsx("div", { className: "absolute inset-0 flex items-center justify-center pointer-events-none", children: /* @__PURE__ */ v.jsxs("div", { className: "px-4 py-2 rounded bg-slate-900/80 text-xs font-medium", children: [
      "Syncing… (",
      f.readyCount,
      "/",
      f.total,
      ")"
    ] }) }),
    a && /* @__PURE__ */ v.jsxs("div", { className: "absolute bottom-2 right-2 text-[10px] opacity-60 bg-black/40 px-2 py-1 rounded", children: [
      (a / 1e3).toFixed(0),
      "s"
    ] })
  ] });
}
let tt = null;
const gl = 6e4;
async function Pr(t = "") {
  var l, a;
  const e = Date.now();
  if (tt && tt.prefix === t && e - tt.ts < gl)
    return tt.data;
  const i = `${Vr().serverOrigin.replace(/\/$/, "")}/api/catalog${t ? `?prefix=${encodeURIComponent(t)}` : ""}`, s = await fetch(i, { cache: "no-store" });
  if (!s.ok) throw new Error(`catalog_http_${s.status}`);
  const o = await s.json();
  return ge() && console.debug("[wp] catalog_fetch", { prefix: t, dirs: (l = o.dirs) == null ? void 0 : l.length, files: (a = o.files) == null ? void 0 : a.length }), tt = { ts: e, prefix: t, data: o }, o;
}
function yl(t) {
  tt && (tt = null);
}
function Ni(t, e) {
  const n = W.getState().allocateClientSeq(), i = { kind: t, client_seq: n, ...e || {} };
  return Ot().emit("control", i), n;
}
function vl(t) {
  return Ni("load", { media_id: t });
}
function bl() {
  return Ni("home");
}
async function xl() {
  if (ge())
    try {
      const t = ["output/fmp4/anime", "output/fmp4/movie", "output/fmp4/tv"];
      for (const e of t) {
        const r = await Pr(e);
        console.debug("[wp][probe] catalog", e, { dirs: r.dirs.length, files: r.files.length });
        const n = r.files[0];
        if (n) {
          const i = wl(), s = `${i}/${n.id}/index.json`.replace(/\\/g, "/"), o = `${i}/${n.id}/output_frag.mp4`.replace(/\\/g, "/");
          await Dn(s, "index"), await Dn(o, "fragment", { headers: { Range: "bytes=0-1023" } });
        }
      }
    } catch (t) {
      console.debug("[wp][probe] error", (t == null ? void 0 : t.message) || String(t));
    }
}
function wl() {
  return "/media";
}
async function Dn(t, e, r) {
  const n = performance.now(), i = await fetch(t, r), s = Math.round(performance.now() - n);
  return console.debug("[wp][probe]", e, { url: t, status: i.status, ms: s, bytes: i.headers.get("content-length") }), i;
}
const _l = ({ open: t, onClose: e }) => {
  const [r, n] = ce(!1), [i, s] = ce(null), [o, l] = ce([]), [a, d] = ce(""), f = Vi(async () => {
    n(!0), s(null);
    try {
      const C = [
        { key: "anime", label: "Anime" },
        { key: "movie", label: "Movie" },
        { key: "tv", label: "TV" }
      ], p = "output/fmp4", E = [];
      for (const R of C) {
        const k = `${p}/${R.key}`;
        let q;
        try {
          q = await Pr(k);
        } catch {
          continue;
        }
        const g = [];
        for (const N of q.dirs) {
          let U;
          try {
            U = await Pr(N.path);
          } catch {
            continue;
          }
          const j = U.files.map((B) => ({ type: "episode", name: B.title, mediaId: B.id }));
          j.length && g.push({ type: "series", name: N.name, episodes: j, expanded: !1 });
        }
        g.length && E.push({ type: "category", name: R.label, series: g, expanded: !0 });
      }
      l(E), ge() && xl();
    } catch (C) {
      s(C.message || "catalog_error");
    } finally {
      n(!1);
    }
  }, []);
  ye(() => {
    t && f();
  }, [t, f]);
  function m(C) {
    vl(C), ge() && console.debug("[wp] control_load", C), e();
  }
  function b() {
    bl(), ge() && console.debug("[wp] control_home"), e();
  }
  function h(C, p) {
    l((E) => E.map((R, k) => k !== C ? R : { ...R, series: R.series.map((q, g) => g !== p ? q : { ...q, expanded: !q.expanded }) }));
  }
  function _(C) {
    l((p) => p.map((E, R) => R !== C ? E : { ...E, expanded: !E.expanded }));
  }
  function x() {
    yl(), f();
  }
  const M = In(() => {
    if (!a.trim()) return o;
    const C = a.toLowerCase();
    return o.map((p) => {
      const E = p.series.map((R) => {
        const k = R.episodes.filter((q) => q.name.toLowerCase().includes(C));
        return k.length ? { ...R, episodes: k, expanded: !0 } : R.name.toLowerCase().includes(C) ? { ...R, expanded: !0 } : null;
      }).filter(Boolean);
      return E.length ? { ...p, series: E, expanded: !0 } : p.name.toLowerCase().includes(C) ? { ...p, expanded: !0 } : null;
    }).filter(Boolean);
  }, [o, a]);
  return t ? /* @__PURE__ */ v.jsx("div", { className: "fixed inset-0 bg-black/40 flex justify-end z-40", children: /* @__PURE__ */ v.jsxs("div", { className: "w-[440px] h-full bg-gray-950 border-l border-gray-800 flex flex-col", children: [
    /* @__PURE__ */ v.jsxs("div", { className: "p-3 border-b border-gray-800 flex items-center gap-2 text-sm", children: [
      /* @__PURE__ */ v.jsx("button", { onClick: e, className: "px-2 py-1 bg-gray-800 hover:bg-gray-700 rounded", children: "Close" }),
      /* @__PURE__ */ v.jsx("button", { onClick: b, className: "px-2 py-1 bg-indigo-600 hover:bg-indigo-500 rounded", children: "Home" }),
      /* @__PURE__ */ v.jsx("button", { onClick: x, className: "px-2 py-1 bg-gray-800 hover:bg-gray-700 rounded", children: "Reload" }),
      /* @__PURE__ */ v.jsx("input", { value: a, onChange: (C) => d(C.target.value), placeholder: "search", className: "ml-auto bg-gray-900 border border-gray-700 focus:border-gray-500 outline-none px-2 py-1 rounded text-xs" })
    ] }),
    r && /* @__PURE__ */ v.jsx("div", { className: "px-4 py-2 text-xs text-gray-500", children: "Loading catalog…" }),
    i && /* @__PURE__ */ v.jsx("div", { className: "px-4 py-2 text-xs text-red-400", children: i }),
    /* @__PURE__ */ v.jsxs("div", { className: "flex-1 overflow-auto text-sm py-2", children: [
      M.map((C, p) => /* @__PURE__ */ v.jsxs("div", { className: "px-3 pb-3", children: [
        /* @__PURE__ */ v.jsxs("div", { className: "flex items-center gap-2 cursor-pointer select-none group", onClick: () => _(p), children: [
          /* @__PURE__ */ v.jsx("span", { className: "text-xs uppercase tracking-wider text-gray-500 group-hover:text-gray-300", children: C.name }),
          /* @__PURE__ */ v.jsx("span", { className: "text-[10px] opacity-50", children: C.expanded ? "−" : "+" })
        ] }),
        C.expanded && /* @__PURE__ */ v.jsxs("div", { className: "mt-2 space-y-2", children: [
          C.series.map((E, R) => /* @__PURE__ */ v.jsxs("div", { children: [
            /* @__PURE__ */ v.jsxs("div", { className: "flex items-center gap-2 cursor-pointer text-gray-300 hover:text-white", onClick: () => h(p, R), children: [
              /* @__PURE__ */ v.jsx("span", { className: "text-xs font-medium", children: E.name }),
              /* @__PURE__ */ v.jsx("span", { className: "text-[10px] opacity-40", children: E.expanded ? "−" : "+" })
            ] }),
            E.expanded && /* @__PURE__ */ v.jsxs("div", { className: "mt-1 ml-3 border-l border-gray-800 pl-3 space-y-1", children: [
              E.episodes.map((k) => /* @__PURE__ */ v.jsxs("button", { onClick: () => m(k.mediaId), className: "w-full text-left px-2 py-1 rounded hover:bg-gray-900 flex items-center gap-2 group", children: [
                /* @__PURE__ */ v.jsx("span", { className: "text-[11px] text-gray-400 group-hover:text-gray-200 truncate", children: k.name }),
                /* @__PURE__ */ v.jsx("span", { className: "ml-auto text-[10px] text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity", children: "Load" })
              ] }, k.mediaId)),
              E.episodes.length === 0 && /* @__PURE__ */ v.jsx("div", { className: "text-[11px] text-gray-600 italic", children: "(no episodes)" })
            ] })
          ] }, E.name)),
          C.series.length === 0 && /* @__PURE__ */ v.jsx("div", { className: "text-[11px] text-gray-600 italic", children: "(empty)" })
        ] })
      ] }, C.name)),
      !r && !M.length && /* @__PURE__ */ v.jsx("div", { className: "px-4 py-6 text-center text-xs text-gray-600", children: "No matches" })
    ] }),
    /* @__PURE__ */ v.jsxs("div", { className: "p-2 text-[10px] text-gray-600 border-t border-gray-900 flex justify-between", children: [
      /* @__PURE__ */ v.jsx("span", { children: "Simple Catalog" }),
      ge() && /* @__PURE__ */ v.jsx("span", { className: "opacity-70", children: "verbose" })
    ] })
  ] }) }) : null;
};
function El({ open: t, onClose: e }) {
  const { name: r, sprite: n, setIdentity: i } = W(), [s, o] = ce(r), [l, a] = ce(n), [d, f] = ce(t);
  ye(() => {
    if (t)
      f(!0);
    else {
      const b = setTimeout(() => f(!1), 320);
      return () => clearTimeout(b);
    }
  }, [t]);
  const m = () => {
    const b = (s || "").trim().slice(0, 32) || "Guest";
    i(b, l), pl(b, l || void 0), e();
  };
  return d ? /* @__PURE__ */ v.jsxs("div", { "aria-hidden": !t, className: `fixed inset-y-0 right-0 w-80 bg-slate-900/95 backdrop-blur border-l border-slate-700 transition-transform duration-300 z-30 flex flex-col ${t ? "translate-x-0" : "translate-x-full"} ${t ? "" : "pointer-events-none"}`, children: [
    /* @__PURE__ */ v.jsxs("div", { className: "p-4 flex items-center justify-between border-b border-slate-700", children: [
      /* @__PURE__ */ v.jsx("h2", { className: "font-semibold text-sm", children: "Identity" }),
      /* @__PURE__ */ v.jsx("button", { type: "button", onClick: e, role: "button", className: "text-xs opacity-70 hover:opacity-100 select-none", children: "Close" })
    ] }),
    /* @__PURE__ */ v.jsxs("div", { className: "p-4 space-y-4 overflow-y-auto text-sm", children: [
      /* @__PURE__ */ v.jsxs("div", { children: [
        /* @__PURE__ */ v.jsx("label", { className: "block text-xs uppercase tracking-wide mb-1 opacity-70", children: "Display Name" }),
        /* @__PURE__ */ v.jsx("input", { value: s, onChange: (b) => o(b.target.value), className: "w-full bg-slate-800 border border-slate-600 rounded px-2 py-1 text-sm", placeholder: "Your name" })
      ] }),
      /* @__PURE__ */ v.jsxs("div", { children: [
        /* @__PURE__ */ v.jsx("label", { className: "block text-xs uppercase tracking-wide mb-1 opacity-70", children: "Character" }),
        /* @__PURE__ */ v.jsx("div", { className: "grid grid-cols-4 gap-3", children: ct.map((b) => /* @__PURE__ */ v.jsxs("button", { onClick: () => {
          a(b), (!s.trim() || ct.includes(s) || s === "Guest") && o(b);
        }, className: `relative group rounded border ${l === b ? "border-emerald-400" : "border-slate-600 hover:border-slate-400"} p-1 flex flex-col items-center gap-1`, children: [
          /* @__PURE__ */ v.jsx("img", { src: Br(b), alt: b, className: "w-12 h-12 object-cover rounded" }),
          /* @__PURE__ */ v.jsx("span", { className: "text-[10px] opacity-70 group-hover:opacity-100 capitalize", children: b })
        ] }, b)) })
      ] }),
      /* @__PURE__ */ v.jsx("div", { className: "pt-2 flex gap-2 items-center", children: /* @__PURE__ */ v.jsx("button", { onClick: m, className: "bg-emerald-500 hover:bg-emerald-400 text-black font-semibold text-sm px-3 py-1 rounded", children: "Update" }) })
    ] })
  ] }) : null;
}
function Sl({ isOpen: t, onValidKey: e }) {
  const [r, n] = ce(""), [i, s] = ce(!1), [o, l] = ce(null);
  ye(() => {
    t && (n(""), l(null), s(!1));
  }, [t]);
  async function a(d) {
    d.preventDefault();
    const f = r.trim();
    if (f) {
      s(!0), l(null);
      try {
        const h = `${Vr().serverOrigin.replace(/\/$/, "")}/api/rooms/validate/${encodeURIComponent(f)}`, _ = await fetch(h, { cache: "no-store" });
        if (_.ok)
          e(f);
        else {
          const x = await _.json().catch(() => ({}));
          _.status === 409 && x.error === "leader_occupied" ? l("A leader is already connected to this room. Please try again later or use a different key.") : _.status === 404 || x.error === "invalid_key" ? l("Invalid room key. Please check your key and try again.") : l("Unable to validate room key. Please try again.");
        }
      } catch (m) {
        console.error("Room key validation error:", m), l("Network error. Please check your connection and try again.");
      } finally {
        s(!1);
      }
    }
  }
  return t ? /* @__PURE__ */ v.jsxs("div", { className: "fixed inset-0 z-50 flex items-center justify-center bg-black", children: [
    /* @__PURE__ */ v.jsx(sr, {}),
    /* @__PURE__ */ v.jsx("div", { className: "relative z-10 max-w-md w-full mx-4", children: /* @__PURE__ */ v.jsxs("div", { className: "bg-slate-900/90 border border-slate-700 rounded-lg p-8 backdrop-blur-sm shadow-2xl", children: [
      /* @__PURE__ */ v.jsx("h1", { className: "text-2xl font-bold text-white mb-2 text-center", children: "Join Watchparty" }),
      /* @__PURE__ */ v.jsx("p", { className: "text-sm text-slate-400 mb-6 text-center", children: "Enter your room key to continue" }),
      /* @__PURE__ */ v.jsxs("form", { onSubmit: a, className: "space-y-4", children: [
        /* @__PURE__ */ v.jsxs("div", { children: [
          /* @__PURE__ */ v.jsx("label", { htmlFor: "roomKey", className: "block text-sm font-medium text-slate-300 mb-2", children: "Room Key" }),
          /* @__PURE__ */ v.jsx(
            "input",
            {
              id: "roomKey",
              type: "text",
              value: r,
              onChange: (d) => n(d.target.value),
              placeholder: "Enter room key...",
              disabled: i,
              className: "w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-md text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed",
              autoFocus: !0,
              autoComplete: "off"
            }
          )
        ] }),
        o && /* @__PURE__ */ v.jsx("div", { className: "p-3 bg-red-900/30 border border-red-700/50 rounded-md text-sm text-red-200", children: o }),
        /* @__PURE__ */ v.jsx(
          "button",
          {
            type: "submit",
            disabled: !r.trim() || i,
            className: "w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-600 disabled:cursor-not-allowed text-white font-medium py-2.5 px-4 rounded-md transition-colors flex items-center justify-center gap-2",
            children: i ? /* @__PURE__ */ v.jsxs(v.Fragment, { children: [
              /* @__PURE__ */ v.jsxs("svg", { className: "animate-spin h-4 w-4", xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", children: [
                /* @__PURE__ */ v.jsx("circle", { className: "opacity-25", cx: "12", cy: "12", r: "10", stroke: "currentColor", strokeWidth: "4" }),
                /* @__PURE__ */ v.jsx("path", { className: "opacity-75", fill: "currentColor", d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" })
              ] }),
              /* @__PURE__ */ v.jsx("span", { children: "Validating..." })
            ] }) : /* @__PURE__ */ v.jsx("span", { children: "Join Room" })
          }
        )
      ] }),
      /* @__PURE__ */ v.jsx("div", { className: "mt-6 text-center text-xs text-slate-500", children: "Need a room key? Contact your room host." })
    ] }) })
  ] }) : null;
}
function Rl(t) {
  if (!t) return null;
  const e = `/media/${t}`.replace(/\\/g, "/");
  return { mediaUrl: `${e}/output_frag.mp4`, indexUrl: `${e}/index.json` };
}
function Cl() {
  cl();
  const t = W((E) => E.snapshot), { ensureAutoIdentity: e, name: r, sprite: n } = W(), i = ii(), s = qe(!1), o = In(() => Rl(t.mediaId), [t.mediaId]), [l, a] = ce(!1), [d, f] = ce(!1), [m, b] = ce(null);
  ye(() => {
    const R = new URLSearchParams(window.location.search).get("roomKey") || i.roomKey || null;
    R && b(R);
  }, [i.roomKey]), ye(() => {
    !m || s.current || (e(), ul({
      room_key: m,
      name: r || void 0,
      sprite: n || void 0
    }), s.current = !0);
  }, [m, e, r, n]);
  const h = W((E) => !!E.snapshot.leaderId && E.snapshot.leaderId === E.me.clientId);
  function _() {
    f(!1), a(!0);
  }
  function x() {
    a(!1), f(!0);
  }
  function M() {
    a(!1);
  }
  function C() {
    f(!1);
  }
  function p(E) {
    b(E);
  }
  return m ? /* @__PURE__ */ v.jsxs("div", { className: "relative min-h-[calc(100vh-120px)] flex", children: [
    /* @__PURE__ */ v.jsxs("div", { className: "flex-1 relative bg-black", children: [
      o ? /* @__PURE__ */ v.jsx(ml, { mediaUrl: o.mediaUrl, indexUrl: o.indexUrl, mediaId: t.mediaId }) : /* @__PURE__ */ v.jsxs(v.Fragment, { children: [
        /* @__PURE__ */ v.jsx(sr, {}),
        /* @__PURE__ */ v.jsx("div", { className: "absolute inset-0 flex flex-col items-center justify-center gap-4 p-6", children: /* @__PURE__ */ v.jsx("div", { className: "mt-6 p-3 rounded bg-slate-900/70 border border-slate-700/40 backdrop-blur-sm", children: /* @__PURE__ */ v.jsx(pa, {}) }) })
      ] }),
      h && !l && /* @__PURE__ */ v.jsx("button", { onClick: _, className: "fixed bottom-4 left-1/2 -translate-x-1/2 z-40 bg-indigo-600 hover:bg-indigo-500 text-xs px-4 py-2 rounded shadow", children: "Media" })
    ] }),
    /* @__PURE__ */ v.jsx("aside", { className: "w-80 border-l border-slate-800 p-4 hidden md:block text-xs opacity-70", children: "Chat panel placeholder (Phase 5)" }),
    /* @__PURE__ */ v.jsx(_l, { open: l, onClose: M }),
    /* @__PURE__ */ v.jsx(El, { open: d, onClose: C, onJoin: () => {
    } }),
    !d && /* @__PURE__ */ v.jsx("button", { onClick: x, className: "fixed bottom-4 right-4 bg-slate-800/80 hover:bg-slate-700 border border-slate-600 text-xs px-3 py-1 rounded shadow backdrop-blur z-40", children: "Identity" })
  ] }) : /* @__PURE__ */ v.jsx(Sl, { isOpen: !0, onValidKey: p });
}
function Tl() {
  return /* @__PURE__ */ v.jsxs("div", { className: "fixed inset-0 bg-black", children: [
    /* @__PURE__ */ v.jsx(sr, {}),
    /* @__PURE__ */ v.jsx("div", { className: "absolute inset-0 flex items-center justify-center", children: /* @__PURE__ */ v.jsxs("div", { className: "text-center", children: [
      /* @__PURE__ */ v.jsx("h1", { className: "text-4xl font-bold text-white mb-4", children: "API is sleeping..." }),
      /* @__PURE__ */ v.jsx("p", { className: "text-slate-400 text-lg", children: "༼ つ ◕_◕ ༽つ HADOKU TAKE MY ENERGY ༼ つ ◕_◕ ༽つ" })
    ] }) })
  ] });
}
function kl() {
  const t = Lt(), e = ni();
  return ii(), ye(() => {
    const r = new URLSearchParams(window.location.search), n = r.get("roomKey") || r.get("room");
    n && (t.pathname === "/" || t.pathname === "") && e(`/room/${encodeURIComponent(n)}`, { replace: !0 });
  }, [t.pathname, e]), t.pathname === "/" || t.pathname === "" ? /* @__PURE__ */ v.jsx(ha, {}) : t.pathname.startsWith("/room") ? /* @__PURE__ */ v.jsx(Cl, {}) : /* @__PURE__ */ v.jsx("div", { className: "p-6", children: "Not Found" });
}
function jn(t) {
  const [e, r] = ce(!1), [n, i] = ce(!0), s = {
    serverOrigin: t.serverOrigin || er.serverOrigin,
    defaultRoomKey: t.defaultRoomKey || er.defaultRoomKey
  };
  return ye(() => {
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
  }, [s.serverOrigin]), ye(() => {
    function o() {
      for (const a of ct) {
        const d = new Image();
        d.decoding = "async", d.loading = "eager", d.src = Br(a);
      }
    }
    function l() {
      "requestIdleCallback" in window ? window.requestIdleCallback(o, { timeout: 2e3 }) : setTimeout(o, 600);
    }
    document.readyState === "complete" ? l() : window.addEventListener("load", l, { once: !0 });
  }, []), n ? /* @__PURE__ */ v.jsx("div", { className: "min-h-screen flex items-center justify-center bg-black", children: /* @__PURE__ */ v.jsx("div", { className: "text-slate-400", children: "Checking server status..." }) }) : e ? /* @__PURE__ */ v.jsx(Tl, {}) : /* @__PURE__ */ v.jsx(ki.Provider, { value: s, children: /* @__PURE__ */ v.jsxs("div", { className: "min-h-screen flex flex-col", children: [
    /* @__PURE__ */ v.jsx("header", { className: "p-3 border-b border-slate-700 flex items-center gap-4 text-sm", children: /* @__PURE__ */ v.jsx(ci, { to: "/", className: "font-semibold", children: "Watchparty" }) }),
    /* @__PURE__ */ v.jsxs("main", { className: "flex-1", children: [
      /* @__PURE__ */ v.jsx(kl, {}),
      /* @__PURE__ */ v.jsx(po, {})
    ] }),
    /* @__PURE__ */ v.jsx(da, {})
  ] }) });
}
function Ml({ basename: t = "/watchparty", appProps: e } = {}) {
  const r = e ?? {}, n = [
    { path: "/", element: /* @__PURE__ */ v.jsx(jn, { ...r }) },
    { path: "/room/:roomKey", element: /* @__PURE__ */ v.jsx(jn, { ...r }) }
  ];
  return _o(n, { basename: t });
}
function Nl(t, e, r) {
  const n = Hi(t), i = r ? /* @__PURE__ */ v.jsx(Nt.StrictMode, { children: e }) : e;
  return n.render(i), n;
}
function Al(t, e = {}) {
  const { basename: r, strictMode: n = !0, ...i } = e;
  ll({
    serverOrigin: i.serverOrigin,
    defaultRoomKey: i.defaultRoomKey
  });
  const s = t.__watchparty;
  s == null || s.root.unmount();
  const o = Ml({
    basename: r,
    appProps: i
  }), a = { root: Nl(t, /* @__PURE__ */ v.jsx(Po, { router: o }), n) };
  return t.__watchparty = a, o;
}
function Dl(t) {
  const e = t.__watchparty;
  e == null || e.root.unmount(), e && delete t.__watchparty;
}
export {
  Ml as createWatchpartyRouter,
  Al as mount,
  Dl as unmount
};
//# sourceMappingURL=index.js.map
