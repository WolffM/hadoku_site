import * as S from "react";
import Lt, { useEffect as we, useRef as qe, createContext as qi, useContext as Vi, useState as ge, useCallback as Hi, useMemo as Bn } from "react";
import { createRoot as Wi } from "react-dom/client";
function Ki(t, e) {
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
var Yi = Symbol.for("react.transitional.element"), Ji = Symbol.for("react.fragment");
function zn(t, e, r) {
  var n = null;
  if (r !== void 0 && (n = "" + r), e.key !== void 0 && (n = "" + e.key), "key" in e) {
    r = {};
    for (var i in e)
      i !== "key" && (r[i] = e[i]);
  } else r = e;
  return e = r.ref, {
    $$typeof: Yi,
    type: t,
    key: n,
    ref: e !== void 0 ? e : null,
    props: r
  };
}
tr.Fragment = Ji;
tr.jsx = zn;
tr.jsxs = zn;
Fn.exports = tr;
var b = Fn.exports, $n = { exports: {} }, he = {};
/**
 * @license React
 * react-dom.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var Xi = Lt;
function qn(t) {
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
var fe = {
  d: {
    f: ze,
    r: function() {
      throw Error(qn(522));
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
}, Gi = Symbol.for("react.portal");
function Qi(t, e, r) {
  var n = 3 < arguments.length && arguments[3] !== void 0 ? arguments[3] : null;
  return {
    $$typeof: Gi,
    key: n == null ? null : "" + n,
    children: t,
    containerInfo: e,
    implementation: r
  };
}
var Ct = Xi.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE;
function rr(t, e) {
  if (t === "font") return "";
  if (typeof e == "string")
    return e === "use-credentials" ? e : "";
}
he.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = fe;
he.createPortal = function(t, e) {
  var r = 2 < arguments.length && arguments[2] !== void 0 ? arguments[2] : null;
  if (!e || e.nodeType !== 1 && e.nodeType !== 9 && e.nodeType !== 11)
    throw Error(qn(299));
  return Qi(t, e, null, r);
};
he.flushSync = function(t) {
  var e = Ct.T, r = fe.p;
  try {
    if (Ct.T = null, fe.p = 2, t) return t();
  } finally {
    Ct.T = e, fe.p = r, fe.d.f();
  }
};
he.preconnect = function(t, e) {
  typeof t == "string" && (e ? (e = e.crossOrigin, e = typeof e == "string" ? e === "use-credentials" ? e : "" : void 0) : e = null, fe.d.C(t, e));
};
he.prefetchDNS = function(t) {
  typeof t == "string" && fe.d.D(t);
};
he.preinit = function(t, e) {
  if (typeof t == "string" && e && typeof e.as == "string") {
    var r = e.as, n = rr(r, e.crossOrigin), i = typeof e.integrity == "string" ? e.integrity : void 0, s = typeof e.fetchPriority == "string" ? e.fetchPriority : void 0;
    r === "style" ? fe.d.S(
      t,
      typeof e.precedence == "string" ? e.precedence : void 0,
      {
        crossOrigin: n,
        integrity: i,
        fetchPriority: s
      }
    ) : r === "script" && fe.d.X(t, {
      crossOrigin: n,
      integrity: i,
      fetchPriority: s,
      nonce: typeof e.nonce == "string" ? e.nonce : void 0
    });
  }
};
he.preinitModule = function(t, e) {
  if (typeof t == "string")
    if (typeof e == "object" && e !== null) {
      if (e.as == null || e.as === "script") {
        var r = rr(
          e.as,
          e.crossOrigin
        );
        fe.d.M(t, {
          crossOrigin: r,
          integrity: typeof e.integrity == "string" ? e.integrity : void 0,
          nonce: typeof e.nonce == "string" ? e.nonce : void 0
        });
      }
    } else e == null && fe.d.M(t);
};
he.preload = function(t, e) {
  if (typeof t == "string" && typeof e == "object" && e !== null && typeof e.as == "string") {
    var r = e.as, n = rr(r, e.crossOrigin);
    fe.d.L(t, r, {
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
he.preloadModule = function(t, e) {
  if (typeof t == "string")
    if (e) {
      var r = rr(e.as, e.crossOrigin);
      fe.d.m(t, {
        as: typeof e.as == "string" && e.as !== "script" ? e.as : void 0,
        crossOrigin: r,
        integrity: typeof e.integrity == "string" ? e.integrity : void 0
      });
    } else fe.d.m(t);
};
he.requestFormReset = function(t) {
  fe.d.r(t);
};
he.unstable_batchedUpdates = function(t, e) {
  return t(e);
};
he.useFormState = function(t, e, r) {
  return Ct.H.useFormState(t, e, r);
};
he.useFormStatus = function() {
  return Ct.H.useHostTransitionStatus();
};
he.version = "19.1.1";
function Vn() {
  if (!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > "u" || typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE != "function"))
    try {
      __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(Vn);
    } catch (t) {
      console.error(t);
    }
}
Vn(), $n.exports = he;
var Hn = $n.exports;
const Zi = /* @__PURE__ */ Un(Hn), es = /* @__PURE__ */ Ki({
  __proto__: null,
  default: Zi
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
const sn = "popstate";
function ts(t) {
  t === void 0 && (t = {});
  function e(n, i) {
    let {
      pathname: s,
      search: o,
      hash: l
    } = n.location;
    return Mt(
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
  return ns(e, r, null, t);
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
function rs() {
  return Math.random().toString(36).substr(2, 8);
}
function on(t, e) {
  return {
    usr: t.state,
    key: t.key,
    idx: e
  };
}
function Mt(t, e, r, n) {
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
    key: e && e.key || n || rs()
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
function ns(t, e, r, n) {
  n === void 0 && (n = {});
  let {
    window: i = document.defaultView,
    v5Compat: s = !1
  } = n, o = i.history, l = ne.Pop, a = null, h = p();
  h == null && (h = 0, o.replaceState(G({}, o.state, {
    idx: h
  }), ""));
  function p() {
    return (o.state || {
      idx: null
    }).idx;
  }
  function m() {
    l = ne.Pop;
    let k = p(), x = k == null ? null : k - h;
    h = k, a && a({
      action: l,
      location: w.location,
      delta: x
    });
  }
  function v(k, x) {
    l = ne.Push;
    let d = Mt(w.location, k, x);
    h = p() + 1;
    let R = on(d, h), C = w.createHref(d);
    try {
      o.pushState(R, "", C);
    } catch (M) {
      if (M instanceof DOMException && M.name === "DataCloneError")
        throw M;
      i.location.assign(C);
    }
    s && a && a({
      action: l,
      location: w.location,
      delta: 1
    });
  }
  function f(k, x) {
    l = ne.Replace;
    let d = Mt(w.location, k, x);
    h = p();
    let R = on(d, h), C = w.createHref(d);
    o.replaceState(R, "", C), s && a && a({
      action: l,
      location: w.location,
      delta: 0
    });
  }
  function E(k) {
    let x = i.location.origin !== "null" ? i.location.origin : i.location.href, d = typeof k == "string" ? k : nt(k);
    return d = d.replace(/ $/, "%20"), $(x, "No window.location.(origin|href) available to create URL for href: " + d), new URL(d, x);
  }
  let w = {
    get action() {
      return l;
    },
    get location() {
      return t(i, o);
    },
    listen(k) {
      if (a)
        throw new Error("A history only accepts one active listener");
      return i.addEventListener(sn, m), a = k, () => {
        i.removeEventListener(sn, m), a = null;
      };
    },
    createHref(k) {
      return e(i, k);
    },
    createURL: E,
    encodeLocation(k) {
      let x = E(k);
      return {
        pathname: x.pathname,
        search: x.search,
        hash: x.hash
      };
    },
    push: v,
    replace: f,
    go(k) {
      return o.go(k);
    }
  };
  return w;
}
var J;
(function(t) {
  t.data = "data", t.deferred = "deferred", t.redirect = "redirect", t.error = "error";
})(J || (J = {}));
const is = /* @__PURE__ */ new Set(["lazy", "caseSensitive", "path", "id", "index", "children"]);
function ss(t) {
  return t.index === !0;
}
function Qt(t, e, r, n) {
  return r === void 0 && (r = []), n === void 0 && (n = {}), t.map((i, s) => {
    let o = [...r, String(s)], l = typeof i.id == "string" ? i.id : o.join("-");
    if ($(i.index !== !0 || !i.children, "Cannot specify children on an index route"), $(!n[l], 'Found a route id collision on id "' + l + `".  Route id's must be globally unique within Data Router usages`), ss(i)) {
      let a = G({}, i, e(i), {
        id: l
      });
      return n[l] = a, a;
    } else {
      let a = G({}, i, e(i), {
        id: l,
        children: void 0
      });
      return n[l] = a, i.children && (a.children = Qt(i.children, e, o, n)), a;
    }
  });
}
function Qe(t, e, r) {
  return r === void 0 && (r = "/"), Wt(t, e, r, !1);
}
function Wt(t, e, r, n) {
  let i = typeof e == "string" ? We(e) : e, s = ht(i.pathname || "/", r);
  if (s == null)
    return null;
  let o = Wn(t);
  as(o);
  let l = null;
  for (let a = 0; l == null && a < o.length; ++a) {
    let h = vs(s);
    l = gs(o[a], h, n);
  }
  return l;
}
function os(t, e) {
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
    a.relativePath.startsWith("/") && ($(a.relativePath.startsWith(n), 'Absolute route path "' + a.relativePath + '" nested under path ' + ('"' + n + '" is not valid. An absolute child route path ') + "must start with the combined path of all its parent routes."), a.relativePath = a.relativePath.slice(n.length));
    let h = Ae([n, a.relativePath]), p = r.concat(a);
    s.children && s.children.length > 0 && ($(
      // Our types know better, but runtime JS may not!
      // @ts-expect-error
      s.index !== !0,
      "Index routes must not have child routes. Please remove " + ('all child routes from route path "' + h + '".')
    ), Wn(s.children, e, p, h)), !(s.path == null && !s.index) && e.push({
      path: h,
      score: ps(h, s.index),
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
function as(t) {
  t.sort((e, r) => e.score !== r.score ? r.score - e.score : ms(e.routesMeta.map((n) => n.childrenIndex), r.routesMeta.map((n) => n.childrenIndex)));
}
const ls = /^:[\w-]+$/, cs = 3, us = 2, ds = 1, fs = 10, hs = -2, an = (t) => t === "*";
function ps(t, e) {
  let r = t.split("/"), n = r.length;
  return r.some(an) && (n += hs), e && (n += us), r.filter((i) => !an(i)).reduce((i, s) => i + (ls.test(s) ? cs : s === "" ? ds : fs), n);
}
function ms(t, e) {
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
function gs(t, e, r) {
  r === void 0 && (r = !1);
  let {
    routesMeta: n
  } = t, i = {}, s = "/", o = [];
  for (let l = 0; l < n.length; ++l) {
    let a = n[l], h = l === n.length - 1, p = s === "/" ? e : e.slice(s.length) || "/", m = ln({
      path: a.relativePath,
      caseSensitive: a.caseSensitive,
      end: h
    }, p), v = a.route;
    if (!m && h && r && !n[n.length - 1].route.index && (m = ln({
      path: a.relativePath,
      caseSensitive: a.caseSensitive,
      end: !1
    }, p)), !m)
      return null;
    Object.assign(i, m.params), o.push({
      // TODO: Can this as be avoided?
      params: i,
      pathname: Ae([s, m.pathname]),
      pathnameBase: _s(Ae([s, m.pathnameBase])),
      route: v
    }), m.pathnameBase !== "/" && (s = Ae([s, m.pathnameBase]));
  }
  return o;
}
function ln(t, e) {
  typeof t == "string" && (t = {
    path: t,
    caseSensitive: !1,
    end: !0
  });
  let [r, n] = ys(t.path, t.caseSensitive, t.end), i = e.match(r);
  if (!i) return null;
  let s = i[0], o = s.replace(/(.)\/+$/, "$1"), l = i.slice(1);
  return {
    params: n.reduce((h, p, m) => {
      let {
        paramName: v,
        isOptional: f
      } = p;
      if (v === "*") {
        let w = l[m] || "";
        o = s.slice(0, s.length - w.length).replace(/(.)\/+$/, "$1");
      }
      const E = l[m];
      return f && !E ? h[v] = void 0 : h[v] = (E || "").replace(/%2F/g, "/"), h;
    }, {}),
    pathname: s,
    pathnameBase: o,
    pattern: t
  };
}
function ys(t, e, r) {
  e === void 0 && (e = !1), r === void 0 && (r = !0), dt(t === "*" || !t.endsWith("*") || t.endsWith("/*"), 'Route path "' + t + '" will be treated as if it were ' + ('"' + t.replace(/\*$/, "/*") + '" because the `*` character must ') + "always follow a `/` in the pattern. To get rid of this warning, " + ('please change the route path to "' + t.replace(/\*$/, "/*") + '".'));
  let n = [], i = "^" + t.replace(/\/*\*?$/, "").replace(/^\/*/, "/").replace(/[\\.*+^${}|()[\]]/g, "\\$&").replace(/\/:([\w-]+)(\?)?/g, (o, l, a) => (n.push({
    paramName: l,
    isOptional: a != null
  }), a ? "/?([^\\/]+)?" : "/([^\\/]+)"));
  return t.endsWith("*") ? (n.push({
    paramName: "*"
  }), i += t === "*" || t === "/*" ? "(.*)$" : "(?:\\/(.+)|\\/*)$") : r ? i += "\\/*$" : t !== "" && t !== "/" && (i += "(?:(?=\\/|$))"), [new RegExp(i, e ? void 0 : "i"), n];
}
function vs(t) {
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
function bs(t, e) {
  e === void 0 && (e = "/");
  let {
    pathname: r,
    search: n = "",
    hash: i = ""
  } = typeof t == "string" ? We(t) : t;
  return {
    pathname: r ? r.startsWith("/") ? r : ws(r, e) : e,
    search: xs(n),
    hash: Es(i)
  };
}
function ws(t, e) {
  let r = e.replace(/\/+$/, "").split("/");
  return t.split("/").forEach((i) => {
    i === ".." ? r.length > 1 && r.pop() : i !== "." && r.push(i);
  }), r.length > 1 ? r.join("/") : "/";
}
function hr(t, e, r, n) {
  return "Cannot include a '" + t + "' character in a manually specified " + ("`to." + e + "` field [" + JSON.stringify(n) + "].  Please separate it out to the ") + ("`to." + r + "` field. Alternatively you may provide the full path as ") + 'a string in <Link to="..."> and the router will parse it for you.';
}
function Yn(t) {
  return t.filter((e, r) => r === 0 || e.route.path && e.route.path.length > 0);
}
function Ar(t, e) {
  let r = Yn(t);
  return e ? r.map((n, i) => i === r.length - 1 ? n.pathname : n.pathnameBase) : r.map((n) => n.pathnameBase);
}
function Pr(t, e, r, n) {
  n === void 0 && (n = !1);
  let i;
  typeof t == "string" ? i = We(t) : (i = G({}, t), $(!i.pathname || !i.pathname.includes("?"), hr("?", "pathname", "search", i)), $(!i.pathname || !i.pathname.includes("#"), hr("#", "pathname", "hash", i)), $(!i.search || !i.search.includes("#"), hr("#", "search", "hash", i)));
  let s = t === "" || i.pathname === "", o = s ? "/" : i.pathname, l;
  if (o == null)
    l = r;
  else {
    let m = e.length - 1;
    if (!n && o.startsWith("..")) {
      let v = o.split("/");
      for (; v[0] === ".."; )
        v.shift(), m -= 1;
      i.pathname = v.join("/");
    }
    l = m >= 0 ? e[m] : "/";
  }
  let a = bs(i, l), h = o && o !== "/" && o.endsWith("/"), p = (s || o === ".") && r.endsWith("/");
  return !a.pathname.endsWith("/") && (h || p) && (a.pathname += "/"), a;
}
const Ae = (t) => t.join("/").replace(/\/\/+/g, "/"), _s = (t) => t.replace(/\/+$/, "").replace(/^\/*/, "/"), xs = (t) => !t || t === "?" ? "" : t.startsWith("?") ? t : "?" + t, Es = (t) => !t || t === "#" ? "" : t.startsWith("#") ? t : "#" + t;
class Zt {
  constructor(e, r, n, i) {
    i === void 0 && (i = !1), this.status = e, this.statusText = r || "", this.internal = i, n instanceof Error ? (this.data = n.toString(), this.error = n) : this.data = n;
  }
}
function kt(t) {
  return t != null && typeof t.status == "number" && typeof t.statusText == "string" && typeof t.internal == "boolean" && "data" in t;
}
const Jn = ["post", "put", "patch", "delete"], Ss = new Set(Jn), Rs = ["get", ...Jn], Cs = new Set(Rs), Ts = /* @__PURE__ */ new Set([301, 302, 303, 307, 308]), Ms = /* @__PURE__ */ new Set([307, 308]), pr = {
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
}, wt = {
  state: "unblocked",
  proceed: void 0,
  reset: void 0,
  location: void 0
}, Nr = /^(?:[a-z][a-z0-9+.-]*:|\/\/)/i, Os = (t) => ({
  hasErrorBoundary: !!t.hasErrorBoundary
}), Xn = "remix-router-transitions";
function Ls(t) {
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
    i = Os;
  let s = {}, o = Qt(t.routes, i, void 0, s), l, a = t.basename || "/", h = t.dataStrategy || Ds, p = t.patchRoutesOnNavigation, m = G({
    v7_fetcherPersist: !1,
    v7_normalizeFormMethod: !1,
    v7_partialHydration: !1,
    v7_prependBasename: !1,
    v7_relativeSplatPath: !1,
    v7_skipActionErrorRevalidation: !1
  }, t.future), v = null, f = /* @__PURE__ */ new Set(), E = null, w = null, k = null, x = t.hydrationData != null, d = Qe(o, t.history.location, a), R = !1, C = null;
  if (d == null && !p) {
    let c = pe(404, {
      pathname: t.history.location.pathname
    }), {
      matches: u,
      route: y
    } = bn(o);
    d = u, C = {
      [y.id]: c
    };
  }
  d && !t.hydrationData && Ut(d, o, t.history.location.pathname).active && (d = null);
  let M;
  if (d)
    if (d.some((c) => c.route.lazy))
      M = !1;
    else if (!d.some((c) => c.route.loader))
      M = !0;
    else if (m.v7_partialHydration) {
      let c = t.hydrationData ? t.hydrationData.loaderData : null, u = t.hydrationData ? t.hydrationData.errors : null;
      if (u) {
        let y = d.findIndex((_) => u[_.route.id] !== void 0);
        M = d.slice(0, y + 1).every((_) => !xr(_.route, c, u));
      } else
        M = d.every((y) => !xr(y.route, c, u));
    } else
      M = t.hydrationData != null;
  else if (M = !1, d = [], m.v7_partialHydration) {
    let c = Ut(null, o, t.history.location.pathname);
    c.active && c.matches && (R = !0, d = c.matches);
  }
  let q, g = {
    historyAction: t.history.action,
    location: t.history.location,
    matches: d,
    initialized: M,
    navigation: pr,
    // Don't restore on initial updateState() if we were SSR'd
    restoreScrollPosition: t.hydrationData != null ? !1 : null,
    preventScrollReset: !1,
    revalidation: "idle",
    loaderData: t.hydrationData && t.hydrationData.loaderData || {},
    actionData: t.hydrationData && t.hydrationData.actionData || null,
    errors: t.hydrationData && t.hydrationData.errors || C,
    fetchers: /* @__PURE__ */ new Map(),
    blockers: /* @__PURE__ */ new Map()
  }, O = ne.Pop, U = !1, j, B = !1, F = /* @__PURE__ */ new Map(), oe = null, ae = !1, se = !1, Ne = [], _e = /* @__PURE__ */ new Set(), te = /* @__PURE__ */ new Map(), Ke = 0, De = -1, je = /* @__PURE__ */ new Map(), de = /* @__PURE__ */ new Set(), Te = /* @__PURE__ */ new Map(), Ye = /* @__PURE__ */ new Map(), ye = /* @__PURE__ */ new Set(), Ie = /* @__PURE__ */ new Map(), Se = /* @__PURE__ */ new Map(), Be;
  function Wr() {
    if (v = t.history.listen((c) => {
      let {
        action: u,
        location: y,
        delta: _
      } = c;
      if (Be) {
        Be(), Be = void 0;
        return;
      }
      dt(Se.size === 0 || _ != null, "You are trying to use a blocker on a POP navigation to a location that was not created by @remix-run/router. This will fail silently in production. This can happen if you are navigating outside the router via `window.history.pushState`/`window.location.hash` instead of using router navigation APIs.  This can also happen if you are using createHashRouter and the user manually changes the URL.");
      let T = en({
        currentLocation: g.location,
        nextLocation: y,
        historyAction: u
      });
      if (T && _ != null) {
        let D = new Promise((I) => {
          Be = I;
        });
        t.history.go(_ * -1), Bt(T, {
          state: "blocked",
          location: y,
          proceed() {
            Bt(T, {
              state: "proceeding",
              proceed: void 0,
              reset: void 0,
              location: y
            }), D.then(() => t.history.go(_));
          },
          reset() {
            let I = new Map(g.blockers);
            I.set(T, wt), ce({
              blockers: I
            });
          }
        });
        return;
      }
      return ke(u, y);
    }), r) {
      Js(e, F);
      let c = () => Xs(e, F);
      e.addEventListener("pagehide", c), oe = () => e.removeEventListener("pagehide", c);
    }
    return g.initialized || ke(ne.Pop, g.location, {
      initialHydration: !0
    }), q;
  }
  function Dt() {
    v && v(), oe && oe(), f.clear(), j && j.abort(), g.fetchers.forEach((c, u) => It(u)), g.blockers.forEach((c, u) => Zr(u));
  }
  function Je(c) {
    return f.add(c), () => f.delete(c);
  }
  function ce(c, u) {
    u === void 0 && (u = {}), g = G({}, g, c);
    let y = [], _ = [];
    m.v7_fetcherPersist && g.fetchers.forEach((T, D) => {
      T.state === "idle" && (ye.has(D) ? _.push(D) : y.push(D));
    }), ye.forEach((T) => {
      !g.fetchers.has(T) && !te.has(T) && _.push(T);
    }), [...f].forEach((T) => T(g, {
      deletedFetchers: _,
      viewTransitionOpts: u.viewTransitionOpts,
      flushSync: u.flushSync === !0
    })), m.v7_fetcherPersist ? (y.forEach((T) => g.fetchers.delete(T)), _.forEach((T) => It(T))) : _.forEach((T) => ye.delete(T));
  }
  function Me(c, u, y) {
    var _, T;
    let {
      flushSync: D
    } = y === void 0 ? {} : y, I = g.actionData != null && g.navigation.formMethod != null && xe(g.navigation.formMethod) && g.navigation.state === "loading" && ((_ = c.state) == null ? void 0 : _._isRedirect) !== !0, A;
    u.actionData ? Object.keys(u.actionData).length > 0 ? A = u.actionData : A = null : I ? A = g.actionData : A = null;
    let P = u.loaderData ? yn(g.loaderData, u.loaderData, u.matches || [], u.errors) : g.loaderData, L = g.blockers;
    L.size > 0 && (L = new Map(L), L.forEach((H, ue) => L.set(ue, wt)));
    let N = U === !0 || g.navigation.formMethod != null && xe(g.navigation.formMethod) && ((T = c.state) == null ? void 0 : T._isRedirect) !== !0;
    l && (o = l, l = void 0), ae || O === ne.Pop || (O === ne.Push ? t.history.push(c, c.state) : O === ne.Replace && t.history.replace(c, c.state));
    let z;
    if (O === ne.Pop) {
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
    ce(G({}, u, {
      actionData: A,
      loaderData: P,
      historyAction: O,
      location: c,
      initialized: !0,
      navigation: pr,
      revalidation: "idle",
      restoreScrollPosition: rn(c, u.matches || g.matches),
      preventScrollReset: N,
      blockers: L
    }), {
      viewTransitionOpts: z,
      flushSync: D === !0
    }), O = ne.Pop, U = !1, B = !1, ae = !1, se = !1, Ne = [];
  }
  async function mt(c, u) {
    if (typeof c == "number") {
      t.history.go(c);
      return;
    }
    let y = _r(g.location, g.matches, a, m.v7_prependBasename, c, m.v7_relativeSplatPath, u == null ? void 0 : u.fromRouteId, u == null ? void 0 : u.relative), {
      path: _,
      submission: T,
      error: D
    } = cn(m.v7_normalizeFormMethod, !1, y, u), I = g.location, A = Mt(g.location, _, u && u.state);
    A = G({}, A, t.history.encodeLocation(A));
    let P = u && u.replace != null ? u.replace : void 0, L = ne.Push;
    P === !0 ? L = ne.Replace : P === !1 || T != null && xe(T.formMethod) && T.formAction === g.location.pathname + g.location.search && (L = ne.Replace);
    let N = u && "preventScrollReset" in u ? u.preventScrollReset === !0 : void 0, z = (u && u.flushSync) === !0, H = en({
      currentLocation: I,
      nextLocation: A,
      historyAction: L
    });
    if (H) {
      Bt(H, {
        state: "blocked",
        location: A,
        proceed() {
          Bt(H, {
            state: "proceeding",
            proceed: void 0,
            reset: void 0,
            location: A
          }), mt(c, u);
        },
        reset() {
          let ue = new Map(g.blockers);
          ue.set(H, wt), ce({
            blockers: ue
          });
        }
      });
      return;
    }
    return await ke(L, A, {
      submission: T,
      // Send through the formData serialization error if we have one so we can
      // render at the right error boundary after we match routes
      pendingError: D,
      preventScrollReset: N,
      replace: u && u.replace,
      enableViewTransition: u && u.viewTransition,
      flushSync: z
    });
  }
  function jt() {
    if (cr(), ce({
      revalidation: "loading"
    }), g.navigation.state !== "submitting") {
      if (g.navigation.state === "idle") {
        ke(g.historyAction, g.location, {
          startUninterruptedRevalidation: !0
        });
        return;
      }
      ke(O || g.historyAction, g.navigation.location, {
        overrideNavigation: g.navigation,
        // Proxy through any rending view transition
        enableViewTransition: B === !0
      });
    }
  }
  async function ke(c, u, y) {
    j && j.abort(), j = null, O = c, ae = (y && y.startUninterruptedRevalidation) === !0, Ui(g.location, g.matches), U = (y && y.preventScrollReset) === !0, B = (y && y.enableViewTransition) === !0;
    let _ = l || o, T = y && y.overrideNavigation, D = y != null && y.initialHydration && g.matches && g.matches.length > 0 && !R ? (
      // `matchRoutes()` has already been called if we're in here via `router.initialize()`
      g.matches
    ) : Qe(_, u, a), I = (y && y.flushSync) === !0;
    if (D && g.initialized && !se && zs(g.location, u) && !(y && y.submission && xe(y.submission.formMethod))) {
      Me(u, {
        matches: D
      }, {
        flushSync: I
      });
      return;
    }
    let A = Ut(D, _, u.pathname);
    if (A.active && A.matches && (D = A.matches), !D) {
      let {
        error: X,
        notFoundMatches: Y,
        route: Q
      } = ur(u.pathname);
      Me(u, {
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
    let P = lt(t.history, u, j.signal, y && y.submission), L;
    if (y && y.pendingError)
      L = [Ze(D).route.id, {
        type: J.error,
        error: y.pendingError
      }];
    else if (y && y.submission && xe(y.submission.formMethod)) {
      let X = await ar(P, u, y.submission, D, A.active, {
        replace: y.replace,
        flushSync: I
      });
      if (X.shortCircuited)
        return;
      if (X.pendingActionResult) {
        let [Y, Q] = X.pendingActionResult;
        if (ve(Q) && kt(Q.error) && Q.error.status === 404) {
          j = null, Me(u, {
            matches: X.matches,
            loaderData: {},
            errors: {
              [Y]: Q.error
            }
          });
          return;
        }
      }
      D = X.matches || D, L = X.pendingActionResult, T = mr(u, y.submission), I = !1, A.active = !1, P = lt(t.history, P.url, P.signal);
    }
    let {
      shortCircuited: N,
      matches: z,
      loaderData: H,
      errors: ue
    } = await lr(P, u, D, A.active, T, y && y.submission, y && y.fetcherSubmission, y && y.replace, y && y.initialHydration === !0, I, L);
    N || (j = null, Me(u, G({
      matches: z || D
    }, vn(L), {
      loaderData: H,
      errors: ue
    })));
  }
  async function ar(c, u, y, _, T, D) {
    D === void 0 && (D = {}), cr();
    let I = Ks(u, y);
    if (ce({
      navigation: I
    }, {
      flushSync: D.flushSync === !0
    }), T) {
      let L = await Ft(_, u.pathname, c.signal);
      if (L.type === "aborted")
        return {
          shortCircuited: !0
        };
      if (L.type === "error") {
        let N = Ze(L.partialMatches).route.id;
        return {
          matches: L.partialMatches,
          pendingActionResult: [N, {
            type: J.error,
            error: L.error
          }]
        };
      } else if (L.matches)
        _ = L.matches;
      else {
        let {
          notFoundMatches: N,
          error: z,
          route: H
        } = ur(u.pathname);
        return {
          matches: N,
          pendingActionResult: [H.id, {
            type: J.error,
            error: z
          }]
        };
      }
    }
    let A, P = St(_, u);
    if (!P.route.action && !P.route.lazy)
      A = {
        type: J.error,
        error: pe(405, {
          method: c.method,
          pathname: u.pathname,
          routeId: P.route.id
        })
      };
    else if (A = (await gt("action", g, c, [P], _, null))[P.route.id], c.signal.aborted)
      return {
        shortCircuited: !0
      };
    if (rt(A)) {
      let L;
      return D && D.replace != null ? L = D.replace : L = pn(A.response.headers.get("Location"), new URL(c.url), a) === g.location.pathname + g.location.search, await Xe(c, A, !0, {
        submission: y,
        replace: L
      }), {
        shortCircuited: !0
      };
    }
    if (Ve(A))
      throw pe(400, {
        type: "defer-action"
      });
    if (ve(A)) {
      let L = Ze(_, P.route.id);
      return (D && D.replace) !== !0 && (O = ne.Push), {
        matches: _,
        pendingActionResult: [L.route.id, A]
      };
    }
    return {
      matches: _,
      pendingActionResult: [P.route.id, A]
    };
  }
  async function lr(c, u, y, _, T, D, I, A, P, L, N) {
    let z = T || mr(u, D), H = D || I || _n(z), ue = !ae && (!m.v7_partialHydration || !P);
    if (_) {
      if (ue) {
        let Z = Kr(N);
        ce(G({
          navigation: z
        }, Z !== void 0 ? {
          actionData: Z
        } : {}), {
          flushSync: L
        });
      }
      let K = await Ft(y, u.pathname, c.signal);
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
        } = ur(u.pathname);
        return {
          matches: ot,
          loaderData: {},
          errors: {
            [bt.id]: Z
          }
        };
      }
    }
    let X = l || o, [Y, Q] = dn(t.history, g, y, H, u, m.v7_partialHydration && P === !0, m.v7_skipActionErrorRevalidation, se, Ne, _e, ye, Te, de, X, a, N);
    if (dr((K) => !(y && y.some((Z) => Z.route.id === K)) || Y && Y.some((Z) => Z.route.id === K)), De = ++Ke, Y.length === 0 && Q.length === 0) {
      let K = Gr();
      return Me(u, G({
        matches: y,
        loaderData: {},
        // Commit pending error if we're short circuiting
        errors: N && ve(N[1]) ? {
          [N[0]]: N[1].error
        } : null
      }, vn(N), K ? {
        fetchers: new Map(g.fetchers)
      } : {}), {
        flushSync: L
      }), {
        shortCircuited: !0
      };
    }
    if (ue) {
      let K = {};
      if (!_) {
        K.navigation = z;
        let Z = Kr(N);
        Z !== void 0 && (K.actionData = Z);
      }
      Q.length > 0 && (K.fetchers = Ai(Q)), ce(K, {
        flushSync: L
      });
    }
    Q.forEach((K) => {
      Fe(K.key), K.controller && te.set(K.key, K.controller);
    });
    let st = () => Q.forEach((K) => Fe(K.key));
    j && j.signal.addEventListener("abort", st);
    let {
      loaderResults: yt,
      fetcherResults: Le
    } = await Yr(g, y, Y, Q, c);
    if (c.signal.aborted)
      return {
        shortCircuited: !0
      };
    j && j.signal.removeEventListener("abort", st), Q.forEach((K) => te.delete(K.key));
    let Re = qt(yt);
    if (Re)
      return await Xe(c, Re.result, !0, {
        replace: A
      }), {
        shortCircuited: !0
      };
    if (Re = qt(Le), Re)
      return de.add(Re.key), await Xe(c, Re.result, !0, {
        replace: A
      }), {
        shortCircuited: !0
      };
    let {
      loaderData: fr,
      errors: vt
    } = gn(g, y, yt, N, Q, Le, Ie);
    Ie.forEach((K, Z) => {
      K.subscribe((ot) => {
        (ot || K.done) && Ie.delete(Z);
      });
    }), m.v7_partialHydration && P && g.errors && (vt = G({}, g.errors, vt));
    let Ge = Gr(), zt = Qr(De), $t = Ge || zt || Q.length > 0;
    return G({
      matches: y,
      loaderData: fr,
      errors: vt
    }, $t ? {
      fetchers: new Map(g.fetchers)
    } : {});
  }
  function Kr(c) {
    if (c && !ve(c[1]))
      return {
        [c[0]]: c[1].data
      };
    if (g.actionData)
      return Object.keys(g.actionData).length === 0 ? null : g.actionData;
  }
  function Ai(c) {
    return c.forEach((u) => {
      let y = g.fetchers.get(u.key), _ = _t(void 0, y ? y.data : void 0);
      g.fetchers.set(u.key, _);
    }), new Map(g.fetchers);
  }
  function Pi(c, u, y, _) {
    if (n)
      throw new Error("router.fetch() was called during the server render, but it shouldn't be. You are likely calling a useFetcher() method in the body of your component. Try moving it to a useEffect or a callback.");
    Fe(c);
    let T = (_ && _.flushSync) === !0, D = l || o, I = _r(g.location, g.matches, a, m.v7_prependBasename, y, m.v7_relativeSplatPath, u, _ == null ? void 0 : _.relative), A = Qe(D, I, a), P = Ut(A, D, I);
    if (P.active && P.matches && (A = P.matches), !A) {
      Oe(c, u, pe(404, {
        pathname: I
      }), {
        flushSync: T
      });
      return;
    }
    let {
      path: L,
      submission: N,
      error: z
    } = cn(m.v7_normalizeFormMethod, !0, I, _);
    if (z) {
      Oe(c, u, z, {
        flushSync: T
      });
      return;
    }
    let H = St(A, L), ue = (_ && _.preventScrollReset) === !0;
    if (N && xe(N.formMethod)) {
      Ni(c, u, L, H, A, P.active, T, ue, N);
      return;
    }
    Te.set(c, {
      routeId: u,
      path: L
    }), Di(c, u, L, H, A, P.active, T, ue, N);
  }
  async function Ni(c, u, y, _, T, D, I, A, P) {
    cr(), Te.delete(c);
    function L(re) {
      if (!re.route.action && !re.route.lazy) {
        let at = pe(405, {
          method: P.formMethod,
          pathname: y,
          routeId: u
        });
        return Oe(c, u, at, {
          flushSync: I
        }), !0;
      }
      return !1;
    }
    if (!D && L(_))
      return;
    let N = g.fetchers.get(c);
    Ue(c, Ys(P, N), {
      flushSync: I
    });
    let z = new AbortController(), H = lt(t.history, y, z.signal, P);
    if (D) {
      let re = await Ft(T, new URL(H.url).pathname, H.signal, c);
      if (re.type === "aborted")
        return;
      if (re.type === "error") {
        Oe(c, u, re.error, {
          flushSync: I
        });
        return;
      } else if (re.matches) {
        if (T = re.matches, _ = St(T, y), L(_))
          return;
      } else {
        Oe(c, u, pe(404, {
          pathname: y
        }), {
          flushSync: I
        });
        return;
      }
    }
    te.set(c, z);
    let ue = Ke, Y = (await gt("action", g, H, [_], T, c))[_.route.id];
    if (H.signal.aborted) {
      te.get(c) === z && te.delete(c);
      return;
    }
    if (m.v7_fetcherPersist && ye.has(c)) {
      if (rt(Y) || ve(Y)) {
        Ue(c, $e(void 0));
        return;
      }
    } else {
      if (rt(Y))
        if (te.delete(c), De > ue) {
          Ue(c, $e(void 0));
          return;
        } else
          return de.add(c), Ue(c, _t(P)), Xe(H, Y, !1, {
            fetcherSubmission: P,
            preventScrollReset: A
          });
      if (ve(Y)) {
        Oe(c, u, Y.error);
        return;
      }
    }
    if (Ve(Y))
      throw pe(400, {
        type: "defer-action"
      });
    let Q = g.navigation.location || g.location, st = lt(t.history, Q, z.signal), yt = l || o, Le = g.navigation.state !== "idle" ? Qe(yt, g.navigation.location, a) : g.matches;
    $(Le, "Didn't find any matches after fetcher action");
    let Re = ++Ke;
    je.set(c, Re);
    let fr = _t(P, Y.data);
    g.fetchers.set(c, fr);
    let [vt, Ge] = dn(t.history, g, Le, P, Q, !1, m.v7_skipActionErrorRevalidation, se, Ne, _e, ye, Te, de, yt, a, [_.route.id, Y]);
    Ge.filter((re) => re.key !== c).forEach((re) => {
      let at = re.key, nn = g.fetchers.get(at), $i = _t(void 0, nn ? nn.data : void 0);
      g.fetchers.set(at, $i), Fe(at), re.controller && te.set(at, re.controller);
    }), ce({
      fetchers: new Map(g.fetchers)
    });
    let zt = () => Ge.forEach((re) => Fe(re.key));
    z.signal.addEventListener("abort", zt);
    let {
      loaderResults: $t,
      fetcherResults: K
    } = await Yr(g, Le, vt, Ge, st);
    if (z.signal.aborted)
      return;
    z.signal.removeEventListener("abort", zt), je.delete(c), te.delete(c), Ge.forEach((re) => te.delete(re.key));
    let Z = qt($t);
    if (Z)
      return Xe(st, Z.result, !1, {
        preventScrollReset: A
      });
    if (Z = qt(K), Z)
      return de.add(Z.key), Xe(st, Z.result, !1, {
        preventScrollReset: A
      });
    let {
      loaderData: ot,
      errors: bt
    } = gn(g, Le, $t, void 0, Ge, K, Ie);
    if (g.fetchers.has(c)) {
      let re = $e(Y.data);
      g.fetchers.set(c, re);
    }
    Qr(Re), g.navigation.state === "loading" && Re > De ? ($(O, "Expected pending action"), j && j.abort(), Me(g.navigation.location, {
      matches: Le,
      loaderData: ot,
      errors: bt,
      fetchers: new Map(g.fetchers)
    })) : (ce({
      errors: bt,
      loaderData: yn(g.loaderData, ot, Le, bt),
      fetchers: new Map(g.fetchers)
    }), se = !1);
  }
  async function Di(c, u, y, _, T, D, I, A, P) {
    let L = g.fetchers.get(c);
    Ue(c, _t(P, L ? L.data : void 0), {
      flushSync: I
    });
    let N = new AbortController(), z = lt(t.history, y, N.signal);
    if (D) {
      let Y = await Ft(T, new URL(z.url).pathname, z.signal, c);
      if (Y.type === "aborted")
        return;
      if (Y.type === "error") {
        Oe(c, u, Y.error, {
          flushSync: I
        });
        return;
      } else if (Y.matches)
        T = Y.matches, _ = St(T, y);
      else {
        Oe(c, u, pe(404, {
          pathname: y
        }), {
          flushSync: I
        });
        return;
      }
    }
    te.set(c, N);
    let H = Ke, X = (await gt("loader", g, z, [_], T, c))[_.route.id];
    if (Ve(X) && (X = await Dr(X, z.signal, !0) || X), te.get(c) === N && te.delete(c), !z.signal.aborted) {
      if (ye.has(c)) {
        Ue(c, $e(void 0));
        return;
      }
      if (rt(X))
        if (De > H) {
          Ue(c, $e(void 0));
          return;
        } else {
          de.add(c), await Xe(z, X, !1, {
            preventScrollReset: A
          });
          return;
        }
      if (ve(X)) {
        Oe(c, u, X.error);
        return;
      }
      $(!Ve(X), "Unhandled fetcher deferred data"), Ue(c, $e(X.data));
    }
  }
  async function Xe(c, u, y, _) {
    let {
      submission: T,
      fetcherSubmission: D,
      preventScrollReset: I,
      replace: A
    } = _ === void 0 ? {} : _;
    u.response.headers.has("X-Remix-Revalidate") && (se = !0);
    let P = u.response.headers.get("Location");
    $(P, "Expected a Location header on the redirect Response"), P = pn(P, new URL(c.url), a);
    let L = Mt(g.location, P, {
      _isRedirect: !0
    });
    if (r) {
      let Y = !1;
      if (u.response.headers.has("X-Remix-Reload-Document"))
        Y = !0;
      else if (Nr.test(P)) {
        const Q = t.history.createURL(P);
        Y = // Hard reload if it's an absolute URL to a new origin
        Q.origin !== e.location.origin || // Hard reload if it's an absolute URL that does not match our basename
        ht(Q.pathname, a) == null;
      }
      if (Y) {
        A ? e.location.replace(P) : e.location.assign(P);
        return;
      }
    }
    j = null;
    let N = A === !0 || u.response.headers.has("X-Remix-Replace") ? ne.Replace : ne.Push, {
      formMethod: z,
      formAction: H,
      formEncType: ue
    } = g.navigation;
    !T && !D && z && H && ue && (T = _n(g.navigation));
    let X = T || D;
    if (Ms.has(u.response.status) && X && xe(X.formMethod))
      await ke(N, L, {
        submission: G({}, X, {
          formAction: P
        }),
        // Preserve these flags across redirects
        preventScrollReset: I || U,
        enableViewTransition: y ? B : void 0
      });
    else {
      let Y = mr(L, T);
      await ke(N, L, {
        overrideNavigation: Y,
        // Send fetcher submissions through for shouldRevalidate
        fetcherSubmission: D,
        // Preserve these flags across redirects
        preventScrollReset: I || U,
        enableViewTransition: y ? B : void 0
      });
    }
  }
  async function gt(c, u, y, _, T, D) {
    let I, A = {};
    try {
      I = await js(h, c, u, y, _, T, D, s, i);
    } catch (P) {
      return _.forEach((L) => {
        A[L.route.id] = {
          type: J.error,
          error: P
        };
      }), A;
    }
    for (let [P, L] of Object.entries(I))
      if ($s(L)) {
        let N = L.result;
        A[P] = {
          type: J.redirect,
          response: Us(N, y, P, T, a, m.v7_relativeSplatPath)
        };
      } else
        A[P] = await Bs(L);
    return A;
  }
  async function Yr(c, u, y, _, T) {
    let D = c.matches, I = gt("loader", c, T, y, u, null), A = Promise.all(_.map(async (N) => {
      if (N.matches && N.match && N.controller) {
        let H = (await gt("loader", c, lt(t.history, N.path, N.controller.signal), [N.match], N.matches, N.key))[N.match.route.id];
        return {
          [N.key]: H
        };
      } else
        return Promise.resolve({
          [N.key]: {
            type: J.error,
            error: pe(404, {
              pathname: N.path
            })
          }
        });
    })), P = await I, L = (await A).reduce((N, z) => Object.assign(N, z), {});
    return await Promise.all([Hs(u, P, T.signal, D, c.loaderData), Ws(u, L, _)]), {
      loaderResults: P,
      fetcherResults: L
    };
  }
  function cr() {
    se = !0, Ne.push(...dr()), Te.forEach((c, u) => {
      te.has(u) && _e.add(u), Fe(u);
    });
  }
  function Ue(c, u, y) {
    y === void 0 && (y = {}), g.fetchers.set(c, u), ce({
      fetchers: new Map(g.fetchers)
    }, {
      flushSync: (y && y.flushSync) === !0
    });
  }
  function Oe(c, u, y, _) {
    _ === void 0 && (_ = {});
    let T = Ze(g.matches, u);
    It(c), ce({
      errors: {
        [T.route.id]: y
      },
      fetchers: new Map(g.fetchers)
    }, {
      flushSync: (_ && _.flushSync) === !0
    });
  }
  function Jr(c) {
    return Ye.set(c, (Ye.get(c) || 0) + 1), ye.has(c) && ye.delete(c), g.fetchers.get(c) || ks;
  }
  function It(c) {
    let u = g.fetchers.get(c);
    te.has(c) && !(u && u.state === "loading" && je.has(c)) && Fe(c), Te.delete(c), je.delete(c), de.delete(c), m.v7_fetcherPersist && ye.delete(c), _e.delete(c), g.fetchers.delete(c);
  }
  function ji(c) {
    let u = (Ye.get(c) || 0) - 1;
    u <= 0 ? (Ye.delete(c), ye.add(c), m.v7_fetcherPersist || It(c)) : Ye.set(c, u), ce({
      fetchers: new Map(g.fetchers)
    });
  }
  function Fe(c) {
    let u = te.get(c);
    u && (u.abort(), te.delete(c));
  }
  function Xr(c) {
    for (let u of c) {
      let y = Jr(u), _ = $e(y.data);
      g.fetchers.set(u, _);
    }
  }
  function Gr() {
    let c = [], u = !1;
    for (let y of de) {
      let _ = g.fetchers.get(y);
      $(_, "Expected fetcher: " + y), _.state === "loading" && (de.delete(y), c.push(y), u = !0);
    }
    return Xr(c), u;
  }
  function Qr(c) {
    let u = [];
    for (let [y, _] of je)
      if (_ < c) {
        let T = g.fetchers.get(y);
        $(T, "Expected fetcher: " + y), T.state === "loading" && (Fe(y), je.delete(y), u.push(y));
      }
    return Xr(u), u.length > 0;
  }
  function Ii(c, u) {
    let y = g.blockers.get(c) || wt;
    return Se.get(c) !== u && Se.set(c, u), y;
  }
  function Zr(c) {
    g.blockers.delete(c), Se.delete(c);
  }
  function Bt(c, u) {
    let y = g.blockers.get(c) || wt;
    $(y.state === "unblocked" && u.state === "blocked" || y.state === "blocked" && u.state === "blocked" || y.state === "blocked" && u.state === "proceeding" || y.state === "blocked" && u.state === "unblocked" || y.state === "proceeding" && u.state === "unblocked", "Invalid blocker state transition: " + y.state + " -> " + u.state);
    let _ = new Map(g.blockers);
    _.set(c, u), ce({
      blockers: _
    });
  }
  function en(c) {
    let {
      currentLocation: u,
      nextLocation: y,
      historyAction: _
    } = c;
    if (Se.size === 0)
      return;
    Se.size > 1 && dt(!1, "A router only supports one blocker at a time");
    let T = Array.from(Se.entries()), [D, I] = T[T.length - 1], A = g.blockers.get(D);
    if (!(A && A.state === "proceeding") && I({
      currentLocation: u,
      nextLocation: y,
      historyAction: _
    }))
      return D;
  }
  function ur(c) {
    let u = pe(404, {
      pathname: c
    }), y = l || o, {
      matches: _,
      route: T
    } = bn(y);
    return dr(), {
      notFoundMatches: _,
      route: T,
      error: u
    };
  }
  function dr(c) {
    let u = [];
    return Ie.forEach((y, _) => {
      (!c || c(_)) && (y.cancel(), u.push(_), Ie.delete(_));
    }), u;
  }
  function Bi(c, u, y) {
    if (E = c, k = u, w = y || null, !x && g.navigation === pr) {
      x = !0;
      let _ = rn(g.location, g.matches);
      _ != null && ce({
        restoreScrollPosition: _
      });
    }
    return () => {
      E = null, k = null, w = null;
    };
  }
  function tn(c, u) {
    return w && w(c, u.map((_) => os(_, g.loaderData))) || c.key;
  }
  function Ui(c, u) {
    if (E && k) {
      let y = tn(c, u);
      E[y] = k();
    }
  }
  function rn(c, u) {
    if (E) {
      let y = tn(c, u), _ = E[y];
      if (typeof _ == "number")
        return _;
    }
    return null;
  }
  function Ut(c, u, y) {
    if (p)
      if (c) {
        if (Object.keys(c[0].params).length > 0)
          return {
            active: !0,
            matches: Wt(u, y, a, !0)
          };
      } else
        return {
          active: !0,
          matches: Wt(u, y, a, !0) || []
        };
    return {
      active: !1,
      matches: null
    };
  }
  async function Ft(c, u, y, _) {
    if (!p)
      return {
        type: "success",
        matches: c
      };
    let T = c;
    for (; ; ) {
      let D = l == null, I = l || o, A = s;
      try {
        await p({
          signal: y,
          path: u,
          matches: T,
          fetcherKey: _,
          patch: (N, z) => {
            y.aborted || hn(N, z, I, A, i);
          }
        });
      } catch (N) {
        return {
          type: "error",
          error: N,
          partialMatches: T
        };
      } finally {
        D && !y.aborted && (o = [...o]);
      }
      if (y.aborted)
        return {
          type: "aborted"
        };
      let P = Qe(I, u, a);
      if (P)
        return {
          type: "success",
          matches: P
        };
      let L = Wt(I, u, a, !0);
      if (!L || T.length === L.length && T.every((N, z) => N.route.id === L[z].route.id))
        return {
          type: "success",
          matches: null
        };
      T = L;
    }
  }
  function Fi(c) {
    s = {}, l = Qt(c, i, void 0, s);
  }
  function zi(c, u) {
    let y = l == null;
    hn(c, u, l || o, s, i), y && (o = [...o], ce({}));
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
    initialize: Wr,
    subscribe: Je,
    enableScrollRestoration: Bi,
    navigate: mt,
    fetch: Pi,
    revalidate: jt,
    // Passthrough to history-aware createHref used by useHref so we get proper
    // hash-aware URLs in DOM paths
    createHref: (c) => t.history.createHref(c),
    encodeLocation: (c) => t.history.encodeLocation(c),
    getFetcher: Jr,
    deleteFetcher: ji,
    dispose: Dt,
    getBlocker: Ii,
    deleteBlocker: Zr,
    patchRoutes: zi,
    _internalFetchControllers: te,
    _internalActiveDeferreds: Ie,
    // TODO: Remove setRoutes, it's temporary to avoid dealing with
    // updating the tree while validating the update algorithm.
    _internalSetRoutes: Fi
  }, q;
}
function As(t) {
  return t != null && ("formData" in t && t.formData != null || "body" in t && t.body !== void 0);
}
function _r(t, e, r, n, i, s, o, l) {
  let a, h;
  if (o) {
    a = [];
    for (let m of e)
      if (a.push(m), m.route.id === o) {
        h = m;
        break;
      }
  } else
    a = e, h = e[e.length - 1];
  let p = Pr(i || ".", Ar(a, s), ht(t.pathname, r) || t.pathname, l === "path");
  if (i == null && (p.search = t.search, p.hash = t.hash), (i == null || i === "" || i === ".") && h) {
    let m = jr(p.search);
    if (h.route.index && !m)
      p.search = p.search ? p.search.replace(/^\?/, "?index&") : "?index";
    else if (!h.route.index && m) {
      let v = new URLSearchParams(p.search), f = v.getAll("index");
      v.delete("index"), f.filter((w) => w).forEach((w) => v.append("index", w));
      let E = v.toString();
      p.search = E ? "?" + E : "";
    }
  }
  return n && r !== "/" && (p.pathname = p.pathname === "/" ? r : Ae([r, p.pathname])), nt(p);
}
function cn(t, e, r, n) {
  if (!n || !As(n))
    return {
      path: r
    };
  if (n.formMethod && !Vs(n.formMethod))
    return {
      path: r,
      error: pe(405, {
        method: n.formMethod
      })
    };
  let i = () => ({
    path: r,
    error: pe(400, {
      type: "invalid-body"
    })
  }), s = n.formMethod || "get", o = t ? s.toUpperCase() : s.toLowerCase(), l = Zn(r);
  if (n.body !== void 0) {
    if (n.formEncType === "text/plain") {
      if (!xe(o))
        return i();
      let v = typeof n.body == "string" ? n.body : n.body instanceof FormData || n.body instanceof URLSearchParams ? (
        // https://html.spec.whatwg.org/multipage/form-control-infrastructure.html#plain-text-form-data
        Array.from(n.body.entries()).reduce((f, E) => {
          let [w, k] = E;
          return "" + f + w + "=" + k + `
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
          text: v
        }
      };
    } else if (n.formEncType === "application/json") {
      if (!xe(o))
        return i();
      try {
        let v = typeof n.body == "string" ? JSON.parse(n.body) : n.body;
        return {
          path: r,
          submission: {
            formMethod: o,
            formAction: l,
            formEncType: n.formEncType,
            formData: void 0,
            json: v,
            text: void 0
          }
        };
      } catch {
        return i();
      }
    }
  }
  $(typeof FormData == "function", "FormData is not available in this environment");
  let a, h;
  if (n.formData)
    a = Er(n.formData), h = n.formData;
  else if (n.body instanceof FormData)
    a = Er(n.body), h = n.body;
  else if (n.body instanceof URLSearchParams)
    a = n.body, h = mn(a);
  else if (n.body == null)
    a = new URLSearchParams(), h = new FormData();
  else
    try {
      a = new URLSearchParams(n.body), h = mn(a);
    } catch {
      return i();
    }
  let p = {
    formMethod: o,
    formAction: l,
    formEncType: n && n.formEncType || "application/x-www-form-urlencoded",
    formData: h,
    json: void 0,
    text: void 0
  };
  if (xe(p.formMethod))
    return {
      path: r,
      submission: p
    };
  let m = We(r);
  return e && m.search && jr(m.search) && a.append("index", ""), m.search = "?" + a, {
    path: nt(m),
    submission: p
  };
}
function un(t, e, r) {
  r === void 0 && (r = !1);
  let n = t.findIndex((i) => i.route.id === e);
  return n >= 0 ? t.slice(0, r ? n + 1 : n) : t;
}
function dn(t, e, r, n, i, s, o, l, a, h, p, m, v, f, E, w) {
  let k = w ? ve(w[1]) ? w[1].error : w[1].data : void 0, x = t.createURL(e.location), d = t.createURL(i), R = r;
  s && e.errors ? R = un(r, Object.keys(e.errors)[0], !0) : w && ve(w[1]) && (R = un(r, w[0]));
  let C = w ? w[1].statusCode : void 0, M = o && C && C >= 400, q = R.filter((O, U) => {
    let {
      route: j
    } = O;
    if (j.lazy)
      return !0;
    if (j.loader == null)
      return !1;
    if (s)
      return xr(j, e.loaderData, e.errors);
    if (Ps(e.loaderData, e.matches[U], O) || a.some((oe) => oe === O.route.id))
      return !0;
    let B = e.matches[U], F = O;
    return fn(O, G({
      currentUrl: x,
      currentParams: B.params,
      nextUrl: d,
      nextParams: F.params
    }, n, {
      actionResult: k,
      actionStatus: C,
      defaultShouldRevalidate: M ? !1 : (
        // Forced revalidation due to submission, useRevalidator, or X-Remix-Revalidate
        l || x.pathname + x.search === d.pathname + d.search || // Search params affect all loaders
        x.search !== d.search || Gn(B, F)
      )
    }));
  }), g = [];
  return m.forEach((O, U) => {
    if (s || !r.some((ae) => ae.route.id === O.routeId) || p.has(U))
      return;
    let j = Qe(f, O.path, E);
    if (!j) {
      g.push({
        key: U,
        routeId: O.routeId,
        path: O.path,
        matches: null,
        match: null,
        controller: null
      });
      return;
    }
    let B = e.fetchers.get(U), F = St(j, O.path), oe = !1;
    v.has(U) ? oe = !1 : h.has(U) ? (h.delete(U), oe = !0) : B && B.state !== "idle" && B.data === void 0 ? oe = l : oe = fn(F, G({
      currentUrl: x,
      currentParams: e.matches[e.matches.length - 1].params,
      nextUrl: d,
      nextParams: r[r.length - 1].params
    }, n, {
      actionResult: k,
      actionStatus: C,
      defaultShouldRevalidate: M ? !1 : l
    })), oe && g.push({
      key: U,
      routeId: O.routeId,
      path: O.path,
      matches: j,
      match: F,
      controller: new AbortController()
    });
  }), [q, g];
}
function xr(t, e, r) {
  if (t.lazy)
    return !0;
  if (!t.loader)
    return !1;
  let n = e != null && e[t.id] !== void 0, i = r != null && r[t.id] !== void 0;
  return !n && i ? !1 : typeof t.loader == "function" && t.loader.hydrate === !0 ? !0 : !n && !i;
}
function Ps(t, e, r) {
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
    let h = n[t];
    $(h, "No route found to patch children into: routeId = " + t), h.children || (h.children = []), o = h.children;
  } else
    o = r;
  let l = e.filter((h) => !o.some((p) => Qn(h, p))), a = Qt(l, i, [t || "_", "patch", String(((s = o) == null ? void 0 : s.length) || "0")], n);
  o.push(...a);
}
function Qn(t, e) {
  return "id" in t && "id" in e && t.id === e.id ? !0 : t.index === e.index && t.path === e.path && t.caseSensitive === e.caseSensitive ? (!t.children || t.children.length === 0) && (!e.children || e.children.length === 0) ? !0 : t.children.every((r, n) => {
    var i;
    return (i = e.children) == null ? void 0 : i.some((s) => Qn(r, s));
  }) : !1;
}
async function Ns(t, e, r) {
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
    dt(!a, 'Route "' + i.id + '" has a static property "' + o + '" defined but its lazy function is also returning a value for this property. ' + ('The lazy route property "' + o + '" will be ignored.')), !a && !is.has(o) && (s[o] = n[o]);
  }
  Object.assign(i, s), Object.assign(i, G({}, e(i), {
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
async function js(t, e, r, n, i, s, o, l, a, h) {
  let p = s.map((f) => f.route.lazy ? Ns(f.route, a, l) : void 0), m = s.map((f, E) => {
    let w = p[E], k = i.some((d) => d.route.id === f.route.id);
    return G({}, f, {
      shouldLoad: k,
      resolve: async (d) => (d && n.method === "GET" && (f.route.lazy || f.route.loader) && (k = !0), k ? Is(e, n, f, w, d, h) : Promise.resolve({
        type: J.data,
        result: void 0
      }))
    });
  }), v = await t({
    matches: m,
    request: n,
    params: s[0].params,
    fetcherKey: o,
    context: h
  });
  try {
    await Promise.all(p);
  } catch {
  }
  return v;
}
async function Is(t, e, r, n, i, s) {
  let o, l, a = (h) => {
    let p, m = new Promise((E, w) => p = w);
    l = () => p(), e.signal.addEventListener("abort", l);
    let v = (E) => typeof h != "function" ? Promise.reject(new Error("You cannot call the handler for a route which defines a boolean " + ('"' + t + '" [routeId: ' + r.route.id + "]"))) : h({
      request: e,
      params: r.params,
      context: s
    }, ...E !== void 0 ? [E] : []), f = (async () => {
      try {
        return {
          type: "data",
          result: await (i ? i((w) => v(w)) : v())
        };
      } catch (E) {
        return {
          type: "error",
          result: E
        };
      }
    })();
    return Promise.race([f, m]);
  };
  try {
    let h = r.route[t];
    if (n)
      if (h) {
        let p, [m] = await Promise.all([
          // If the handler throws, don't let it immediately bubble out,
          // since we need to let the lazy() execution finish so we know if this
          // route has a boundary that can handle the error
          a(h).catch((v) => {
            p = v;
          }),
          n
        ]);
        if (p !== void 0)
          throw p;
        o = m;
      } else if (await n, h = r.route[t], h)
        o = await a(h);
      else if (t === "action") {
        let p = new URL(e.url), m = p.pathname + p.search;
        throw pe(405, {
          method: e.method,
          pathname: m,
          routeId: r.route.id
        });
      } else
        return {
          type: J.data,
          result: void 0
        };
    else if (h)
      o = await a(h);
    else {
      let p = new URL(e.url), m = p.pathname + p.search;
      throw pe(404, {
        pathname: m
      });
    }
    $(o.result !== void 0, "You defined " + (t === "action" ? "an action" : "a loader") + " for route " + ('"' + r.route.id + "\" but didn't return anything from your `" + t + "` ") + "function. Please return a value or `null`.");
  } catch (h) {
    return {
      type: J.error,
      result: h
    };
  } finally {
    l && e.signal.removeEventListener("abort", l);
  }
  return o;
}
async function Bs(t) {
  let {
    result: e,
    type: r
  } = t;
  if (ei(e)) {
    let m;
    try {
      let v = e.headers.get("Content-Type");
      v && /\bapplication\/json\b/.test(v) ? e.body == null ? m = null : m = await e.json() : m = await e.text();
    } catch (v) {
      return {
        type: J.error,
        error: v
      };
    }
    return r === J.error ? {
      type: J.error,
      error: new Zt(e.status, e.statusText, m),
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
    if (wn(e)) {
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
        error: new Zt(((n = e.init) == null ? void 0 : n.status) || 500, void 0, e.data),
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
  if (qs(e)) {
    var l, a;
    return {
      type: J.deferred,
      deferredData: e,
      statusCode: (l = e.init) == null ? void 0 : l.status,
      headers: ((a = e.init) == null ? void 0 : a.headers) && new Headers(e.init.headers)
    };
  }
  if (wn(e)) {
    var h, p;
    return {
      type: J.data,
      data: e.data,
      statusCode: (h = e.init) == null ? void 0 : h.status,
      headers: (p = e.init) != null && p.headers ? new Headers(e.init.headers) : void 0
    };
  }
  return {
    type: J.data,
    data: e
  };
}
function Us(t, e, r, n, i, s) {
  let o = t.headers.get("Location");
  if ($(o, "Redirects returned/thrown from loaders/actions must have a Location header"), !Nr.test(o)) {
    let l = n.slice(0, n.findIndex((a) => a.route.id === r) + 1);
    o = _r(new URL(e.url), l, i, !0, o, s), t.headers.set("Location", o);
  }
  return t;
}
function pn(t, e, r) {
  if (Nr.test(t)) {
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
  if (n && xe(n.formMethod)) {
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
function Fs(t, e, r, n, i) {
  let s = {}, o = null, l, a = !1, h = {}, p = r && ve(r[1]) ? r[1].error : void 0;
  return t.forEach((m) => {
    if (!(m.route.id in e))
      return;
    let v = m.route.id, f = e[v];
    if ($(!rt(f), "Cannot handle redirect results in processLoaderData"), ve(f)) {
      let E = f.error;
      p !== void 0 && (E = p, p = void 0), o = o || {};
      {
        let w = Ze(t, v);
        o[w.route.id] == null && (o[w.route.id] = E);
      }
      s[v] = void 0, a || (a = !0, l = kt(f.error) ? f.error.status : 500), f.headers && (h[v] = f.headers);
    } else
      Ve(f) ? (n.set(v, f.deferredData), s[v] = f.deferredData.data, f.statusCode != null && f.statusCode !== 200 && !a && (l = f.statusCode), f.headers && (h[v] = f.headers)) : (s[v] = f.data, f.statusCode && f.statusCode !== 200 && !a && (l = f.statusCode), f.headers && (h[v] = f.headers));
  }), p !== void 0 && r && (o = {
    [r[0]]: p
  }, s[r[0]] = void 0), {
    loaderData: s,
    errors: o,
    statusCode: l || 200,
    loaderHeaders: h
  };
}
function gn(t, e, r, n, i, s, o) {
  let {
    loaderData: l,
    errors: a
  } = Fs(e, r, n, o);
  return i.forEach((h) => {
    let {
      key: p,
      match: m,
      controller: v
    } = h, f = s[p];
    if ($(f, "Did not find corresponding fetcher result"), !(v && v.signal.aborted))
      if (ve(f)) {
        let E = Ze(t.matches, m == null ? void 0 : m.route.id);
        a && a[E.route.id] || (a = G({}, a, {
          [E.route.id]: f.error
        })), t.fetchers.delete(p);
      } else if (rt(f))
        $(!1, "Unhandled fetcher revalidation redirect");
      else if (Ve(f))
        $(!1, "Unhandled fetcher deferred data");
      else {
        let E = $e(f.data);
        t.fetchers.set(p, E);
      }
  }), {
    loaderData: l,
    errors: a
  };
}
function yn(t, e, r, n) {
  let i = G({}, e);
  for (let s of r) {
    let o = s.route.id;
    if (e.hasOwnProperty(o) ? e[o] !== void 0 && (i[o] = e[o]) : t[o] !== void 0 && s.route.loader && (i[o] = t[o]), n && n.hasOwnProperty(o))
      break;
  }
  return i;
}
function vn(t) {
  return t ? ve(t[1]) ? {
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
function pe(t, e) {
  let {
    pathname: r,
    routeId: n,
    method: i,
    type: s,
    message: o
  } = e === void 0 ? {} : e, l = "Unknown Server Error", a = "Unknown @remix-run/router error";
  return t === 400 ? (l = "Bad Request", i && r && n ? a = "You made a " + i + ' request to "' + r + '" but ' + ('did not provide a `loader` for route "' + n + '", ') + "so there is no way to handle the request." : s === "defer-action" ? a = "defer() is not supported in actions" : s === "invalid-body" && (a = "Unable to encode submission body")) : t === 403 ? (l = "Forbidden", a = 'Route "' + n + '" does not match URL "' + r + '"') : t === 404 ? (l = "Not Found", a = 'No route matches URL "' + r + '"') : t === 405 && (l = "Method Not Allowed", i && r && n ? a = "You made a " + i.toUpperCase() + ' request to "' + r + '" but ' + ('did not provide an `action` for route "' + n + '", ') + "so there is no way to handle the request." : i && (a = 'Invalid request method "' + i.toUpperCase() + '"')), new Zt(t || 500, l, new Error(a), !0);
}
function qt(t) {
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
  return nt(G({}, e, {
    hash: ""
  }));
}
function zs(t, e) {
  return t.pathname !== e.pathname || t.search !== e.search ? !1 : t.hash === "" ? e.hash !== "" : t.hash === e.hash ? !0 : e.hash !== "";
}
function $s(t) {
  return ei(t.result) && Ts.has(t.result.status);
}
function Ve(t) {
  return t.type === J.deferred;
}
function ve(t) {
  return t.type === J.error;
}
function rt(t) {
  return (t && t.type) === J.redirect;
}
function wn(t) {
  return typeof t == "object" && t != null && "type" in t && "data" in t && "init" in t && t.type === "DataWithResponseInit";
}
function qs(t) {
  let e = t;
  return e && typeof e == "object" && typeof e.data == "object" && typeof e.subscribe == "function" && typeof e.cancel == "function" && typeof e.resolveData == "function";
}
function ei(t) {
  return t != null && typeof t.status == "number" && typeof t.statusText == "string" && typeof t.headers == "object" && typeof t.body < "u";
}
function Vs(t) {
  return Cs.has(t.toLowerCase());
}
function xe(t) {
  return Ss.has(t.toLowerCase());
}
async function Hs(t, e, r, n, i) {
  let s = Object.entries(e);
  for (let o = 0; o < s.length; o++) {
    let [l, a] = s[o], h = t.find((v) => (v == null ? void 0 : v.route.id) === l);
    if (!h)
      continue;
    let p = n.find((v) => v.route.id === h.route.id), m = p != null && !Gn(p, h) && (i && i[h.route.id]) !== void 0;
    Ve(a) && m && await Dr(a, r, !1).then((v) => {
      v && (e[l] = v);
    });
  }
}
async function Ws(t, e, r) {
  for (let n = 0; n < r.length; n++) {
    let {
      key: i,
      routeId: s,
      controller: o
    } = r[n], l = e[i];
    t.find((h) => (h == null ? void 0 : h.route.id) === s) && Ve(l) && ($(o, "Expected an AbortController for revalidating fetcher deferred result"), await Dr(l, o.signal, !0).then((h) => {
      h && (e[i] = h);
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
  let n = Yn(t);
  return n[n.length - 1];
}
function _n(t) {
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
function mr(t, e) {
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
function Ks(t, e) {
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
function Ys(t, e) {
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
function Js(t, e) {
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
function Xs(t, e) {
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
function er() {
  return er = Object.assign ? Object.assign.bind() : function(t) {
    for (var e = 1; e < arguments.length; e++) {
      var r = arguments[e];
      for (var n in r)
        Object.prototype.hasOwnProperty.call(r, n) && (t[n] = r[n]);
    }
    return t;
  }, er.apply(this, arguments);
}
const nr = /* @__PURE__ */ S.createContext(null), ti = /* @__PURE__ */ S.createContext(null), it = /* @__PURE__ */ S.createContext(null), Ir = /* @__PURE__ */ S.createContext(null), Pe = /* @__PURE__ */ S.createContext({
  outlet: null,
  matches: [],
  isDataRoute: !1
}), ri = /* @__PURE__ */ S.createContext(null);
function Gs(t, e) {
  let {
    relative: r
  } = e === void 0 ? {} : e;
  At() || $(!1);
  let {
    basename: n,
    navigator: i
  } = S.useContext(it), {
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
function At() {
  return S.useContext(Ir) != null;
}
function Pt() {
  return At() || $(!1), S.useContext(Ir).location;
}
function ni(t) {
  S.useContext(it).static || S.useLayoutEffect(t);
}
function ii() {
  let {
    isDataRoute: t
  } = S.useContext(Pe);
  return t ? fo() : Qs();
}
function Qs() {
  At() || $(!1);
  let t = S.useContext(nr), {
    basename: e,
    future: r,
    navigator: n
  } = S.useContext(it), {
    matches: i
  } = S.useContext(Pe), {
    pathname: s
  } = Pt(), o = JSON.stringify(Ar(i, r.v7_relativeSplatPath)), l = S.useRef(!1);
  return ni(() => {
    l.current = !0;
  }), S.useCallback(function(h, p) {
    if (p === void 0 && (p = {}), !l.current) return;
    if (typeof h == "number") {
      n.go(h);
      return;
    }
    let m = Pr(h, JSON.parse(o), s, p.relative === "path");
    t == null && e !== "/" && (m.pathname = m.pathname === "/" ? e : Ae([e, m.pathname])), (p.replace ? n.replace : n.push)(m, p.state, p);
  }, [e, n, o, s, t]);
}
const Zs = /* @__PURE__ */ S.createContext(null);
function eo(t) {
  let e = S.useContext(Pe).outlet;
  return e && /* @__PURE__ */ S.createElement(Zs.Provider, {
    value: t
  }, e);
}
function si() {
  let {
    matches: t
  } = S.useContext(Pe), e = t[t.length - 1];
  return e ? e.params : {};
}
function oi(t, e) {
  let {
    relative: r
  } = e === void 0 ? {} : e, {
    future: n
  } = S.useContext(it), {
    matches: i
  } = S.useContext(Pe), {
    pathname: s
  } = Pt(), o = JSON.stringify(Ar(i, n.v7_relativeSplatPath));
  return S.useMemo(() => Pr(t, JSON.parse(o), s, r === "path"), [t, o, s, r]);
}
function to(t, e, r, n) {
  At() || $(!1);
  let {
    navigator: i
  } = S.useContext(it), {
    matches: s
  } = S.useContext(Pe), o = s[s.length - 1], l = o ? o.params : {};
  o && o.pathname;
  let a = o ? o.pathnameBase : "/";
  o && o.route;
  let h = Pt(), p;
  p = h;
  let m = p.pathname || "/", v = m;
  if (a !== "/") {
    let w = a.replace(/^\//, "").split("/");
    v = "/" + m.replace(/^\//, "").split("/").slice(w.length).join("/");
  }
  let f = Qe(t, {
    pathname: v
  });
  return oo(f && f.map((w) => Object.assign({}, w, {
    params: Object.assign({}, l, w.params),
    pathname: Ae([
      a,
      // Re-encode pathnames that were decoded inside matchRoutes
      i.encodeLocation ? i.encodeLocation(w.pathname).pathname : w.pathname
    ]),
    pathnameBase: w.pathnameBase === "/" ? a : Ae([
      a,
      // Re-encode pathnames that were decoded inside matchRoutes
      i.encodeLocation ? i.encodeLocation(w.pathnameBase).pathname : w.pathnameBase
    ])
  })), s, r, n);
}
function ro() {
  let t = uo(), e = kt(t) ? t.status + " " + t.statusText : t instanceof Error ? t.message : JSON.stringify(t), r = t instanceof Error ? t.stack : null, i = {
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
const no = /* @__PURE__ */ S.createElement(ro, null);
class io extends S.Component {
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
    }, /* @__PURE__ */ S.createElement(ri.Provider, {
      value: this.state.error,
      children: this.props.component
    })) : this.props.children;
  }
}
function so(t) {
  let {
    routeContext: e,
    match: r,
    children: n
  } = t, i = S.useContext(nr);
  return i && i.static && i.staticContext && (r.route.errorElement || r.route.ErrorBoundary) && (i.staticContext._deepestRenderedBoundaryId = r.route.id), /* @__PURE__ */ S.createElement(Pe.Provider, {
    value: e
  }, n);
}
function oo(t, e, r, n) {
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
    let p = o.findIndex((m) => m.route.id && (l == null ? void 0 : l[m.route.id]) !== void 0);
    p >= 0 || $(!1), o = o.slice(0, Math.min(o.length, p + 1));
  }
  let a = !1, h = -1;
  if (r && n && n.v7_partialHydration)
    for (let p = 0; p < o.length; p++) {
      let m = o[p];
      if ((m.route.HydrateFallback || m.route.hydrateFallbackElement) && (h = p), m.route.id) {
        let {
          loaderData: v,
          errors: f
        } = r, E = m.route.loader && v[m.route.id] === void 0 && (!f || f[m.route.id] === void 0);
        if (m.route.lazy || E) {
          a = !0, h >= 0 ? o = o.slice(0, h + 1) : o = [o[0]];
          break;
        }
      }
    }
  return o.reduceRight((p, m, v) => {
    let f, E = !1, w = null, k = null;
    r && (f = l && m.route.id ? l[m.route.id] : void 0, w = m.route.errorElement || no, a && (h < 0 && v === 0 ? (ho("route-fallback"), E = !0, k = null) : h === v && (E = !0, k = m.route.hydrateFallbackElement || null)));
    let x = e.concat(o.slice(0, v + 1)), d = () => {
      let R;
      return f ? R = w : E ? R = k : m.route.Component ? R = /* @__PURE__ */ S.createElement(m.route.Component, null) : m.route.element ? R = m.route.element : R = p, /* @__PURE__ */ S.createElement(so, {
        match: m,
        routeContext: {
          outlet: p,
          matches: x,
          isDataRoute: r != null
        },
        children: R
      });
    };
    return r && (m.route.ErrorBoundary || m.route.errorElement || v === 0) ? /* @__PURE__ */ S.createElement(io, {
      location: r.location,
      revalidation: r.revalidation,
      component: w,
      error: f,
      children: d(),
      routeContext: {
        outlet: null,
        matches: x,
        isDataRoute: !0
      }
    }) : d();
  }, null);
}
var ai = /* @__PURE__ */ function(t) {
  return t.UseBlocker = "useBlocker", t.UseRevalidator = "useRevalidator", t.UseNavigateStable = "useNavigate", t;
}(ai || {}), li = /* @__PURE__ */ function(t) {
  return t.UseBlocker = "useBlocker", t.UseLoaderData = "useLoaderData", t.UseActionData = "useActionData", t.UseRouteError = "useRouteError", t.UseNavigation = "useNavigation", t.UseRouteLoaderData = "useRouteLoaderData", t.UseMatches = "useMatches", t.UseRevalidator = "useRevalidator", t.UseNavigateStable = "useNavigate", t.UseRouteId = "useRouteId", t;
}(li || {});
function ao(t) {
  let e = S.useContext(nr);
  return e || $(!1), e;
}
function lo(t) {
  let e = S.useContext(ti);
  return e || $(!1), e;
}
function co(t) {
  let e = S.useContext(Pe);
  return e || $(!1), e;
}
function ci(t) {
  let e = co(), r = e.matches[e.matches.length - 1];
  return r.route.id || $(!1), r.route.id;
}
function uo() {
  var t;
  let e = S.useContext(ri), r = lo(), n = ci();
  return e !== void 0 ? e : (t = r.errors) == null ? void 0 : t[n];
}
function fo() {
  let {
    router: t
  } = ao(ai.UseNavigateStable), e = ci(li.UseNavigateStable), r = S.useRef(!1);
  return ni(() => {
    r.current = !0;
  }), S.useCallback(function(i, s) {
    s === void 0 && (s = {}), r.current && (typeof i == "number" ? t.navigate(i) : t.navigate(i, er({
      fromRouteId: e
    }, s)));
  }, [t, e]);
}
const xn = {};
function ho(t, e, r) {
  xn[t] || (xn[t] = !0);
}
function po(t, e) {
  t == null || t.v7_startTransition, (t == null ? void 0 : t.v7_relativeSplatPath) === void 0 && (!e || e.v7_relativeSplatPath), e && (e.v7_fetcherPersist, e.v7_normalizeFormMethod, e.v7_partialHydration, e.v7_skipActionErrorRevalidation);
}
function mo(t) {
  return eo(t.context);
}
function go(t) {
  let {
    basename: e = "/",
    children: r = null,
    location: n,
    navigationType: i = ne.Pop,
    navigator: s,
    static: o = !1,
    future: l
  } = t;
  At() && $(!1);
  let a = e.replace(/^\/*/, "/"), h = S.useMemo(() => ({
    basename: a,
    navigator: s,
    static: o,
    future: er({
      v7_relativeSplatPath: !1
    }, l)
  }), [a, l, s, o]);
  typeof n == "string" && (n = We(n));
  let {
    pathname: p = "/",
    search: m = "",
    hash: v = "",
    state: f = null,
    key: E = "default"
  } = n, w = S.useMemo(() => {
    let k = ht(p, a);
    return k == null ? null : {
      location: {
        pathname: k,
        search: m,
        hash: v,
        state: f,
        key: E
      },
      navigationType: i
    };
  }, [a, p, m, v, f, E, i]);
  return w == null ? null : /* @__PURE__ */ S.createElement(it.Provider, {
    value: h
  }, /* @__PURE__ */ S.createElement(Ir.Provider, {
    children: r,
    value: w
  }));
}
new Promise(() => {
});
function yo(t) {
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
function Ot() {
  return Ot = Object.assign ? Object.assign.bind() : function(t) {
    for (var e = 1; e < arguments.length; e++) {
      var r = arguments[e];
      for (var n in r)
        Object.prototype.hasOwnProperty.call(r, n) && (t[n] = r[n]);
    }
    return t;
  }, Ot.apply(this, arguments);
}
function vo(t, e) {
  if (t == null) return {};
  var r = {}, n = Object.keys(t), i, s;
  for (s = 0; s < n.length; s++)
    i = n[s], !(e.indexOf(i) >= 0) && (r[i] = t[i]);
  return r;
}
function bo(t) {
  return !!(t.metaKey || t.altKey || t.ctrlKey || t.shiftKey);
}
function wo(t, e) {
  return t.button === 0 && // Ignore everything but left clicks
  (!e || e === "_self") && // Let browser handle "target=_blank" etc.
  !bo(t);
}
const _o = ["onClick", "relative", "reloadDocument", "replace", "state", "target", "to", "preventScrollReset", "viewTransition"], xo = "6";
try {
  window.__reactRouterVersion = xo;
} catch {
}
function Eo(t, e) {
  return Ls({
    basename: e == null ? void 0 : e.basename,
    future: Ot({}, e == null ? void 0 : e.future, {
      v7_prependBasename: !0
    }),
    history: ts({
      window: e == null ? void 0 : e.window
    }),
    hydrationData: (e == null ? void 0 : e.hydrationData) || So(),
    routes: t,
    mapRouteProperties: yo,
    dataStrategy: e == null ? void 0 : e.dataStrategy,
    patchRoutesOnNavigation: e == null ? void 0 : e.patchRoutesOnNavigation,
    window: e == null ? void 0 : e.window
  }).initialize();
}
function So() {
  var t;
  let e = (t = window) == null ? void 0 : t.__staticRouterHydrationData;
  return e && e.errors && (e = Ot({}, e, {
    errors: Ro(e.errors)
  })), e;
}
function Ro(t) {
  if (!t) return null;
  let e = Object.entries(t), r = {};
  for (let [n, i] of e)
    if (i && i.__type === "RouteErrorResponse")
      r[n] = new Zt(i.status, i.statusText, i.data, i.internal === !0);
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
const Co = /* @__PURE__ */ S.createContext({
  isTransitioning: !1
}), To = /* @__PURE__ */ S.createContext(/* @__PURE__ */ new Map()), Mo = "startTransition", En = S[Mo], ko = "flushSync", Sn = es[ko];
function Oo(t) {
  En ? En(t) : t();
}
function xt(t) {
  Sn ? Sn(t) : t();
}
class Lo {
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
  } = t, [i, s] = S.useState(r.state), [o, l] = S.useState(), [a, h] = S.useState({
    isTransitioning: !1
  }), [p, m] = S.useState(), [v, f] = S.useState(), [E, w] = S.useState(), k = S.useRef(/* @__PURE__ */ new Map()), {
    v7_startTransition: x
  } = n || {}, d = S.useCallback((O) => {
    x ? Oo(O) : O();
  }, [x]), R = S.useCallback((O, U) => {
    let {
      deletedFetchers: j,
      flushSync: B,
      viewTransitionOpts: F
    } = U;
    O.fetchers.forEach((ae, se) => {
      ae.data !== void 0 && k.current.set(se, ae.data);
    }), j.forEach((ae) => k.current.delete(ae));
    let oe = r.window == null || r.window.document == null || typeof r.window.document.startViewTransition != "function";
    if (!F || oe) {
      B ? xt(() => s(O)) : d(() => s(O));
      return;
    }
    if (B) {
      xt(() => {
        v && (p && p.resolve(), v.skipTransition()), h({
          isTransitioning: !0,
          flushSync: !0,
          currentLocation: F.currentLocation,
          nextLocation: F.nextLocation
        });
      });
      let ae = r.window.document.startViewTransition(() => {
        xt(() => s(O));
      });
      ae.finished.finally(() => {
        xt(() => {
          m(void 0), f(void 0), l(void 0), h({
            isTransitioning: !1
          });
        });
      }), xt(() => f(ae));
      return;
    }
    v ? (p && p.resolve(), v.skipTransition(), w({
      state: O,
      currentLocation: F.currentLocation,
      nextLocation: F.nextLocation
    })) : (l(O), h({
      isTransitioning: !0,
      flushSync: !1,
      currentLocation: F.currentLocation,
      nextLocation: F.nextLocation
    }));
  }, [r.window, v, p, k, d]);
  S.useLayoutEffect(() => r.subscribe(R), [r, R]), S.useEffect(() => {
    a.isTransitioning && !a.flushSync && m(new Lo());
  }, [a]), S.useEffect(() => {
    if (p && o && r.window) {
      let O = o, U = p.promise, j = r.window.document.startViewTransition(async () => {
        d(() => s(O)), await U;
      });
      j.finished.finally(() => {
        m(void 0), f(void 0), l(void 0), h({
          isTransitioning: !1
        });
      }), f(j);
    }
  }, [d, o, p, r.window]), S.useEffect(() => {
    p && o && i.location.key === o.location.key && p.resolve();
  }, [p, v, i.location, o]), S.useEffect(() => {
    !a.isTransitioning && E && (l(E.state), h({
      isTransitioning: !0,
      flushSync: !1,
      currentLocation: E.currentLocation,
      nextLocation: E.nextLocation
    }), w(void 0));
  }, [a.isTransitioning, E]), S.useEffect(() => {
  }, []);
  let C = S.useMemo(() => ({
    createHref: r.createHref,
    encodeLocation: r.encodeLocation,
    go: (O) => r.navigate(O),
    push: (O, U, j) => r.navigate(O, {
      state: U,
      preventScrollReset: j == null ? void 0 : j.preventScrollReset
    }),
    replace: (O, U, j) => r.navigate(O, {
      replace: !0,
      state: U,
      preventScrollReset: j == null ? void 0 : j.preventScrollReset
    })
  }), [r]), M = r.basename || "/", q = S.useMemo(() => ({
    router: r,
    navigator: C,
    static: !1,
    basename: M
  }), [r, C, M]), g = S.useMemo(() => ({
    v7_relativeSplatPath: r.future.v7_relativeSplatPath
  }), [r.future.v7_relativeSplatPath]);
  return S.useEffect(() => po(n, r.future), [n, r.future]), /* @__PURE__ */ S.createElement(S.Fragment, null, /* @__PURE__ */ S.createElement(nr.Provider, {
    value: q
  }, /* @__PURE__ */ S.createElement(ti.Provider, {
    value: i
  }, /* @__PURE__ */ S.createElement(To.Provider, {
    value: k.current
  }, /* @__PURE__ */ S.createElement(Co.Provider, {
    value: a
  }, /* @__PURE__ */ S.createElement(go, {
    basename: M,
    location: i.location,
    navigationType: i.historyAction,
    navigator: C,
    future: g
  }, i.initialized || r.future.v7_partialHydration ? /* @__PURE__ */ S.createElement(Po, {
    routes: r.routes,
    future: r.future,
    state: i
  }) : e))))), null);
}
const Po = /* @__PURE__ */ S.memo(No);
function No(t) {
  let {
    routes: e,
    future: r,
    state: n
  } = t;
  return to(e, void 0, n, r);
}
const Do = typeof window < "u" && typeof window.document < "u" && typeof window.document.createElement < "u", jo = /^(?:[a-z][a-z0-9+.-]*:|\/\/)/i, ui = /* @__PURE__ */ S.forwardRef(function(e, r) {
  let {
    onClick: n,
    relative: i,
    reloadDocument: s,
    replace: o,
    state: l,
    target: a,
    to: h,
    preventScrollReset: p,
    viewTransition: m
  } = e, v = vo(e, _o), {
    basename: f
  } = S.useContext(it), E, w = !1;
  if (typeof h == "string" && jo.test(h) && (E = h, Do))
    try {
      let R = new URL(window.location.href), C = h.startsWith("//") ? new URL(R.protocol + h) : new URL(h), M = ht(C.pathname, f);
      C.origin === R.origin && M != null ? h = M + C.search + C.hash : w = !0;
    } catch {
    }
  let k = Gs(h, {
    relative: i
  }), x = Io(h, {
    replace: o,
    state: l,
    target: a,
    preventScrollReset: p,
    relative: i,
    viewTransition: m
  });
  function d(R) {
    n && n(R), R.defaultPrevented || x(R);
  }
  return (
    // eslint-disable-next-line jsx-a11y/anchor-has-content
    /* @__PURE__ */ S.createElement("a", Ot({}, v, {
      href: E || k,
      onClick: w || s ? n : d,
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
function Io(t, e) {
  let {
    target: r,
    replace: n,
    state: i,
    preventScrollReset: s,
    relative: o,
    viewTransition: l
  } = e === void 0 ? {} : e, a = ii(), h = Pt(), p = oi(t, {
    relative: o
  });
  return S.useCallback((m) => {
    if (wo(m, r)) {
      m.preventDefault();
      let v = n !== void 0 ? n : nt(h) === nt(p);
      a(t, {
        replace: v,
        state: i,
        preventScrollReset: s,
        relative: o,
        viewTransition: l
      });
    }
  }, [h, a, p, n, i, r, t, s, o, l]);
}
const Bo = {}, Tn = (t) => {
  let e;
  const r = /* @__PURE__ */ new Set(), n = (p, m) => {
    const v = typeof p == "function" ? p(e) : p;
    if (!Object.is(v, e)) {
      const f = e;
      e = m ?? (typeof v != "object" || v === null) ? v : Object.assign({}, e, v), r.forEach((E) => E(e, f));
    }
  }, i = () => e, a = { setState: n, getState: i, getInitialState: () => h, subscribe: (p) => (r.add(p), () => r.delete(p)), destroy: () => {
    (Bo ? "production" : void 0) !== "production" && console.warn(
      "[DEPRECATED] The `destroy` method will be unsupported in a future version. Instead use unsubscribe function returned by subscribe. Everything will be garbage-collected if store is garbage-collected."
    ), r.clear();
  } }, h = e = t(n, i, a);
  return a;
}, Uo = (t) => t ? Tn(t) : Tn;
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
function Fo(t, e) {
  return t === e && (t !== 0 || 1 / t === 1 / e) || t !== t && e !== e;
}
var zo = typeof Object.is == "function" ? Object.is : Fo, $o = ft.useState, qo = ft.useEffect, Vo = ft.useLayoutEffect, Ho = ft.useDebugValue;
function Wo(t, e) {
  var r = e(), n = $o({ inst: { value: r, getSnapshot: e } }), i = n[0].inst, s = n[1];
  return Vo(
    function() {
      i.value = r, i.getSnapshot = e, gr(i) && s({ inst: i });
    },
    [t, r, e]
  ), qo(
    function() {
      return gr(i) && s({ inst: i }), t(function() {
        gr(i) && s({ inst: i });
      });
    },
    [t]
  ), Ho(r), r;
}
function gr(t) {
  var e = t.getSnapshot;
  t = t.value;
  try {
    var r = e();
    return !zo(t, r);
  } catch {
    return !0;
  }
}
function Ko(t, e) {
  return e();
}
var Yo = typeof window > "u" || typeof window.document > "u" || typeof window.document.createElement > "u" ? Ko : Wo;
pi.useSyncExternalStore = ft.useSyncExternalStore !== void 0 ? ft.useSyncExternalStore : Yo;
hi.exports = pi;
var Jo = hi.exports;
/**
 * @license React
 * use-sync-external-store-shim/with-selector.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var ir = Lt, Xo = Jo;
function Go(t, e) {
  return t === e && (t !== 0 || 1 / t === 1 / e) || t !== t && e !== e;
}
var Qo = typeof Object.is == "function" ? Object.is : Go, Zo = Xo.useSyncExternalStore, ea = ir.useRef, ta = ir.useEffect, ra = ir.useMemo, na = ir.useDebugValue;
fi.useSyncExternalStoreWithSelector = function(t, e, r, n, i) {
  var s = ea(null);
  if (s.current === null) {
    var o = { hasValue: !1, value: null };
    s.current = o;
  } else o = s.current;
  s = ra(
    function() {
      function a(f) {
        if (!h) {
          if (h = !0, p = f, f = n(f), i !== void 0 && o.hasValue) {
            var E = o.value;
            if (i(E, f))
              return m = E;
          }
          return m = f;
        }
        if (E = m, Qo(p, f)) return E;
        var w = n(f);
        return i !== void 0 && i(E, w) ? (p = f, E) : (p = f, m = w);
      }
      var h = !1, p, m, v = r === void 0 ? null : r;
      return [
        function() {
          return a(e());
        },
        v === null ? void 0 : function() {
          return a(v());
        }
      ];
    },
    [e, r, n, i]
  );
  var l = Zo(t, s[0], s[1]);
  return ta(
    function() {
      o.hasValue = !0, o.value = l;
    },
    [l]
  ), na(l), l;
};
di.exports = fi;
var ia = di.exports;
const sa = /* @__PURE__ */ Un(ia), mi = {}, { useDebugValue: oa } = Lt, { useSyncExternalStoreWithSelector: aa } = sa;
let Mn = !1;
const la = (t) => t;
function ca(t, e = la, r) {
  (mi ? "production" : void 0) !== "production" && r && !Mn && (console.warn(
    "[DEPRECATED] Use `createWithEqualityFn` instead of `create` or use `useStoreWithEqualityFn` instead of `useStore`. They can be imported from 'zustand/traditional'. https://github.com/pmndrs/zustand/discussions/1937"
  ), Mn = !0);
  const n = aa(
    t.subscribe,
    t.getState,
    t.getServerState || t.getInitialState,
    e,
    r
  );
  return oa(n), n;
}
const kn = (t) => {
  (mi ? "production" : void 0) !== "production" && typeof t != "function" && console.warn(
    "[DEPRECATED] Passing a vanilla store will be unsupported in a future version. Instead use `import { useStore } from 'zustand'`."
  );
  const e = typeof t == "function" ? Uo(t) : t, r = (n, i) => ca(e, n, i);
  return Object.assign(r, e), r;
}, ua = (t) => t ? kn(t) : kn, ct = [
  "frieren",
  "himmel",
  "heiter",
  "eisen",
  "fern",
  "stark",
  "sein",
  "übel"
], da = {
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
const yr = "wp_leader_key", W = ua((t, e) => ({
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
    for (const i of ct)
      if (!n.has(i))
        return { name: i, sprite: i };
    return { name: ct[0], sprite: ct[0] };
  }),
  setAdminKey: (r, n) => {
    n && r ? localStorage.setItem(yr, r) : localStorage.removeItem(yr), t({ adminKey: r, rememberAdmin: n });
  },
  hydrateAdminKey: () => {
    const r = localStorage.getItem(yr);
    r && t({ adminKey: r, rememberAdmin: !0 });
  },
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
function fa() {
  const t = W((r) => r.toasts), e = W((r) => r.popToast);
  return we(() => {
    const r = t.map((n) => setTimeout(() => e(n.id), 4e3));
    return () => {
      r.forEach(clearTimeout);
    };
  }, [t, e]), /* @__PURE__ */ b.jsx("div", { className: "fixed bottom-4 left-1/2 -translate-x-1/2 flex flex-col gap-2 z-50", children: t.map((r) => /* @__PURE__ */ b.jsx("div", { className: `px-3 py-2 rounded text-sm shadow font-medium bg-slate-800 border ${r.kind === "error" ? "border-red-500 text-red-300" : "border-slate-600 text-slate-200"}`, children: r.msg }, r.id)) });
}
const ha = 400;
function Ur() {
  const t = qe(null), e = qe([]);
  return we(() => {
    const r = t.current;
    if (!r) return;
    const n = r.getContext("2d");
    if (!n) return;
    const i = () => {
      r.width = window.innerWidth, r.height = window.innerHeight;
    };
    i(), window.addEventListener("resize", i);
    let s = 0;
    function o(f) {
      return f < 300 ? { scale: 0.5, demote: 0.5 } : f < 400 ? { scale: 0.6, demote: 0.4 } : f < 500 ? { scale: 0.7, demote: 0.3 } : f < 600 ? { scale: 0.8, demote: 0.2 } : f < 700 ? { scale: 0.9, demote: 0.1 } : { scale: 1, demote: 0 };
    }
    function l(f, E, w = !1, k) {
      let x = Math.random();
      const d = k ?? s;
      k === void 0 && s++;
      const R = w ? o(d) : { scale: 1, demote: 0 };
      let C = x > 0.998, M = !C && x > 0.98;
      R.demote > 0 && (C && Math.random() < R.demote && (C = !1), M && Math.random() < R.demote && (M = !1)), w && (C = !1, M = !1);
      const q = M;
      let g;
      C ? g = 0.92 + Math.random() * 0.08 : M ? g = 0.85 + Math.random() * 0.15 : g = 0.05 + Math.random() ** 2.2 * 0.75;
      const O = (jt, ke) => {
        const ar = Math.random(), lr = Math.random();
        return jt + (ar + lr) / 2 * (ke - jt);
      };
      let U = O(0.9, 1.4) + g ** 1.2 * (C ? 5.5 : M ? 4 : 3.2);
      const j = O(0.85, 1.25);
      let B = U * j;
      w && R.scale < 1 && (B *= R.scale);
      let F;
      C ? F = 1.05 + Math.random() * 0.5 : M ? (F = 0.55 + g ** 1.05 * 0.7 + Math.random() * 0.25, F > 1.25 && (F = 1.25)) : (F = 0.15 + g ** 1.05 * 0.6 + Math.random() * 0.15, F > 1.05 && (F = 1.05)), !C && F < 0.15 && (F = 0.15);
      const oe = 0.035 + O(0, 0.08), ae = g ** 1.45 * (C ? 4.9 : M ? 1.55 : 1.25);
      let se = oe + ae * O(0.85, 1.3);
      w && R.scale < 1 && (se *= R.scale);
      const Ne = Math.min(1, F), _e = Math.min(1, (B - 1) / 4.5);
      se *= 1 + 0.18 * Math.max(Ne, _e), C && se < 1.25 && (se = 1.25 + Math.random() * 0.4);
      const te = r.width, Ke = r.height, De = 0.18 + Math.random() * 0.28, je = C || Math.random() < 0.18, de = C ? 0.55 : q ? 0.38 : Math.max(0.1, 0.28 - De * 0.25), Te = F * (de + Math.random() * (1 - de)), Ye = F * (de + Math.random() * (1 - de)), ye = (C ? 130 : q ? 160 : 120) + Math.random() * (C ? 140 : 150), Se = Math.min(1, se / 2.5), Be = 10, Dt = 120 - Be;
      let Je = Math.random();
      const ce = 0.8 + Se * 1.4;
      Je = Math.pow(Je, ce);
      const Me = (1 - Se) * ((40 - Be) / Dt);
      Je = Je * (1 - Me) + Me;
      const mt = (Be + Je * Dt) * 1e3;
      return {
        x: f ?? Math.random() * te,
        y: E ?? (w ? Math.random() * Ke : -Math.random() * Ke),
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
        dimFloor: de,
        twinkleStart: Te,
        twinkleTarget: Ye,
        twinkleT: 0,
        twinkleDuration: ye,
        microPhase: Math.random() * Math.PI * 2,
        microSpeed: (C ? 0.18 : 0.1) + Math.random() * 0.05,
        ultraRare: C,
        trail: C ? [] : void 0,
        currentAlpha: Te,
        lifeMsRemaining: mt,
        lifeMsTotal: mt
      };
    }
    if (!e.current.length)
      for (let f = 0; f < ha; f++) e.current.push(l(void 0, void 0, !0, f));
    let a = performance.now();
    function h(f, E, w, k) {
      const R = (0.15 + 0.75 * Math.min(1, k / 2)) * w, C = w, M = w, q = Math.min(R, M * 0.95, C * 0.48), g = f, O = E, U = f + C, j = E + M, B = n;
      B.beginPath(), B.moveTo(g, O), B.lineTo(U, O), B.lineTo(U, j - q), B.quadraticCurveTo(U, j, U - q, j), B.lineTo(g + q, j), B.quadraticCurveTo(g, j, g, j - q), B.lineTo(g, O), B.closePath(), B.fill();
    }
    function p(f, E) {
      if (E > 3 && (E = 3), !f.twinkleEnabled) {
        f.currentAlpha = f.alpha;
        return;
      }
      if (f.twinkleT += E, f.twinkleT >= f.twinkleDuration) {
        f.twinkleStart = f.twinkleTarget, f.twinkleTarget = f.alpha * (f.dimFloor + Math.random() * (1 - f.dimFloor));
        const d = f.ultraRare ? 150 : f.colorRare ? 140 : 110, R = f.ultraRare ? 170 : 140;
        f.twinkleDuration = d + Math.random() * R, f.twinkleT = 0;
      }
      const w = Math.min(1, f.twinkleT / f.twinkleDuration), k = w * w * (3 - 2 * w);
      let x = f.twinkleStart + (f.twinkleTarget - f.twinkleStart) * k;
      if (f.microPhase += f.microSpeed * E, f.ultraRare) {
        const d = Math.sin(f.microPhase) * 0.04;
        x = Math.min(1, Math.max(f.alpha * f.dimFloor, x * (1 + d)));
      }
      f.currentAlpha = x;
    }
    function m(f, E) {
      if (f.ultraRare) {
        f.colorPhase += f.colorSpeed * 2.2 * E;
        const w = [
          [255, 120, 220],
          // pink
          [120, 255, 170],
          // green
          [255, 255, 255]
          // white
        ], k = f.colorPhase % w.length, x = Math.floor(k), d = (x + 1) % w.length, R = k - x, C = w[x], M = w[d], q = Math.round(C[0] + (M[0] - C[0]) * R), g = Math.round(C[1] + (M[1] - C[1]) * R), O = Math.round(C[2] + (M[2] - C[2]) * R);
        return `rgb(${q},${g},${O})`;
      }
      if (f.colorRare) {
        f.colorPhase += f.colorSpeed * E;
        const w = (Math.sin(f.colorPhase) + 1) / 2;
        if (f.colorMode === 0) {
          const k = Math.round(255 - 165 * w), x = Math.round(255 - 105 * w);
          return `rgb(${k},${x},255)`;
        } else {
          const x = Math.round(255 - 175 * w), d = Math.round(255 - 175 * w);
          return `rgb(255,${x},${d})`;
        }
      }
      return "#ffffff";
    }
    const v = () => {
      const f = performance.now(), E = f - a, w = E / 16.666;
      a = f, n.clearRect(0, 0, r.width, r.height), r.width, r.height;
      const k = 220;
      for (let x = 0; x < e.current.length; x++) {
        const d = e.current[x];
        if (d.ultraRare) {
          if (d.trail || (d.trail = []), !d.maxTrail) {
            const U = d.speed * 14, j = Math.min(1, d.speed / 1.9), B = U * (1 + 8 * j);
            d.maxTrail = Math.min(300, Math.floor(B));
          }
          d.trail.push({ x: d.x + d.size / 2, y: d.y + d.size / 2 }), d.trail.length > d.maxTrail && d.trail.splice(0, d.trail.length - d.maxTrail);
        }
        if (d.lifeMsRemaining -= E, d.lifeMsRemaining <= 0) {
          const O = l(Math.random() * r.width, void 0, !1);
          O.y = -O.size - 1, e.current[x] = O;
          continue;
        }
        if (d.y += d.speed * w, d.y - d.size > r.height + k) {
          e.current[x] = l(Math.random() * r.width, -d.size - 1);
          continue;
        }
        p(d, w);
        const R = d.currentAlpha ?? d.alpha, C = 1500, M = d.lifeMsRemaining < C ? Math.max(0, d.lifeMsRemaining / C) : 1, q = R * M;
        let g = m(d, w);
        if (d.ultraRare) {
          const O = q;
          if (d.trail && d.trail.length) {
            const B = d.trail.length;
            for (let F = 0; F < B; F++) {
              const oe = d.trail[B - 1 - F], ae = 1 - F / B, se = Math.pow(ae, 3);
              n.globalAlpha = Math.min(1, O) * se * 0.6;
              const Ne = 0.35 + 0.65 * se;
              n.fillStyle = g;
              const _e = d.size * Ne;
              n.fillRect(oe.x - _e / 2, oe.y - _e / 2, _e, _e);
            }
          }
          n.globalAlpha = Math.min(1, O * 1.02), n.fillStyle = g;
          const U = d.x - d.size * 0.1, j = d.y - d.size * 0.1;
          if (h(U, j, d.size * 1.2, d.speed), O > 1.02) {
            const B = Math.min(1, (O - 1) * 0.85);
            n.save(), n.globalCompositeOperation = "lighter", n.globalAlpha = B, n.fillStyle = g;
            const F = d.size * 0.75;
            h(U + d.size * 0.225, j + d.size * 0.225, F, d.speed), n.restore();
          }
        } else if (n.globalAlpha = Math.min(1, q), n.fillStyle = g, h(d.x, d.y, d.size, d.speed), q > 1.01) {
          const O = Math.min(0.9, (q - 1) * 0.8);
          n.save(), n.globalCompositeOperation = "lighter", n.globalAlpha = O, n.fillStyle = g;
          const U = d.size * 0.55;
          h(d.x + d.size * 0.225, d.y + d.size * 0.225, U, d.speed), n.restore();
        }
      }
      n.globalAlpha = 1, requestAnimationFrame(v);
    };
    return v(), () => window.removeEventListener("resize", i);
  }, []), /* @__PURE__ */ b.jsx(
    "canvas",
    {
      ref: t,
      "data-darkreader-ignore": !0,
      className: "fixed inset-0 z-0 bg-black pointer-events-none [isolation:isolate]"
    }
  );
}
function pa() {
  const t = ["dev-room-1000"];
  return /* @__PURE__ */ b.jsxs("div", { className: "relative h-full flex flex-col items-center justify-center gap-10 py-24", children: [
    /* @__PURE__ */ b.jsx(Ur, {}),
    /* @__PURE__ */ b.jsx("h1", { className: "text-4xl font-bold tracking-tight drop-shadow", children: "Watchparty" }),
    /* @__PURE__ */ b.jsxs("div", { className: "w-full max-w-md space-y-4 z-10", children: [
      /* @__PURE__ */ b.jsx("h2", { className: "text-sm uppercase tracking-wide opacity-70", children: "Rooms" }),
      /* @__PURE__ */ b.jsx("ul", { className: "space-y-2", children: t.map((e) => /* @__PURE__ */ b.jsx("li", { children: /* @__PURE__ */ b.jsxs(ui, { to: `/room/${encodeURIComponent(e)}`, className: "block bg-slate-900/80 backdrop-blur border border-slate-700 hover:border-slate-500 rounded px-4 py-3 transition-colors", children: [
        /* @__PURE__ */ b.jsx("div", { className: "font-medium", children: e }),
        /* @__PURE__ */ b.jsx("div", { className: "text-[11px] opacity-60", children: "Join room" })
      ] }) }, e)) }),
      /* @__PURE__ */ b.jsx("div", { className: "pt-6 text-xs opacity-50", children: "Provide ?roomKey=&leaderKey= query params to deep link directly." })
    ] })
  ] });
}
function ma() {
  const t = W((r) => r.roster), e = Object.values(t);
  return e.length ? /* @__PURE__ */ b.jsx("ul", { className: "text-xs space-y-1", children: e.map((r) => {
    const n = r.name && da[r.name] || "#cbd5e1";
    return /* @__PURE__ */ b.jsxs("li", { className: "flex items-center gap-2", children: [
      r.sprite ? /* @__PURE__ */ b.jsx("img", { src: Br(r.sprite), alt: r.sprite, className: "w-7 h-7 rounded object-cover" }) : /* @__PURE__ */ b.jsx("span", { className: "inline-block w-7 h-7 bg-slate-700/50 rounded" }),
      /* @__PURE__ */ b.jsx("span", { className: "truncate max-w-[120px] font-medium", style: { color: n }, children: r.name || "Anon" }),
      r.isLeader && /* @__PURE__ */ b.jsx("span", { className: "px-1 rounded bg-emerald-600 text-[9px]", children: "L" })
    ] }, r.clientId);
  }) }) : /* @__PURE__ */ b.jsx("div", { className: "text-xs opacity-50", children: "No users" });
}
const Ce = /* @__PURE__ */ Object.create(null);
Ce.open = "0";
Ce.close = "1";
Ce.ping = "2";
Ce.pong = "3";
Ce.message = "4";
Ce.upgrade = "5";
Ce.noop = "6";
const Kt = /* @__PURE__ */ Object.create(null);
Object.keys(Ce).forEach((t) => {
  Kt[Ce[t]] = t;
});
const Sr = { type: "error", data: "parser error" }, gi = typeof Blob == "function" || typeof Blob < "u" && Object.prototype.toString.call(Blob) === "[object BlobConstructor]", yi = typeof ArrayBuffer == "function", vi = (t) => typeof ArrayBuffer.isView == "function" ? ArrayBuffer.isView(t) : t && t.buffer instanceof ArrayBuffer, Fr = ({ type: t, data: e }, r, n) => gi && e instanceof Blob ? r ? n(e) : On(e, n) : yi && (e instanceof ArrayBuffer || vi(e)) ? r ? n(e) : On(new Blob([e]), n) : n(Ce[t] + (e || "")), On = (t, e) => {
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
function ga(t, e) {
  if (gi && t.data instanceof Blob)
    return t.data.arrayBuffer().then(Ln).then(e);
  if (yi && (t.data instanceof ArrayBuffer || vi(t.data)))
    return e(Ln(t.data));
  Fr(t, !1, (r) => {
    vr || (vr = new TextEncoder()), e(vr.encode(r));
  });
}
const An = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/", Rt = typeof Uint8Array > "u" ? [] : new Uint8Array(256);
for (let t = 0; t < An.length; t++)
  Rt[An.charCodeAt(t)] = t;
const ya = (t) => {
  let e = t.length * 0.75, r = t.length, n, i = 0, s, o, l, a;
  t[t.length - 1] === "=" && (e--, t[t.length - 2] === "=" && e--);
  const h = new ArrayBuffer(e), p = new Uint8Array(h);
  for (n = 0; n < r; n += 4)
    s = Rt[t.charCodeAt(n)], o = Rt[t.charCodeAt(n + 1)], l = Rt[t.charCodeAt(n + 2)], a = Rt[t.charCodeAt(n + 3)], p[i++] = s << 2 | o >> 4, p[i++] = (o & 15) << 4 | l >> 2, p[i++] = (l & 3) << 6 | a & 63;
  return h;
}, va = typeof ArrayBuffer == "function", zr = (t, e) => {
  if (typeof t != "string")
    return {
      type: "message",
      data: bi(t, e)
    };
  const r = t.charAt(0);
  return r === "b" ? {
    type: "message",
    data: ba(t.substring(1), e)
  } : Kt[r] ? t.length > 1 ? {
    type: Kt[r],
    data: t.substring(1)
  } : {
    type: Kt[r]
  } : Sr;
}, ba = (t, e) => {
  if (va) {
    const r = ya(t);
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
}, wi = "", wa = (t, e) => {
  const r = t.length, n = new Array(r);
  let i = 0;
  t.forEach((s, o) => {
    Fr(s, !1, (l) => {
      n[o] = l, ++i === r && e(n.join(wi));
    });
  });
}, _a = (t, e) => {
  const r = t.split(wi), n = [];
  for (let i = 0; i < r.length; i++) {
    const s = zr(r[i], e);
    if (n.push(s), s.type === "error")
      break;
  }
  return n;
};
function xa() {
  return new TransformStream({
    transform(t, e) {
      ga(t, (r) => {
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
function Vt(t) {
  return t.reduce((e, r) => e + r.length, 0);
}
function Ht(t, e) {
  if (t[0].length === e)
    return t.shift();
  const r = new Uint8Array(e);
  let n = 0;
  for (let i = 0; i < e; i++)
    r[i] = t[0][n++], n === t[0].length && (t.shift(), n = 0);
  return t.length && n < t[0].length && (t[0] = t[0].slice(n)), r;
}
function Ea(t, e) {
  br || (br = new TextDecoder());
  const r = [];
  let n = 0, i = -1, s = !1;
  return new TransformStream({
    transform(o, l) {
      for (r.push(o); ; ) {
        if (n === 0) {
          if (Vt(r) < 1)
            break;
          const a = Ht(r, 1);
          s = (a[0] & 128) === 128, i = a[0] & 127, i < 126 ? n = 3 : i === 126 ? n = 1 : n = 2;
        } else if (n === 1) {
          if (Vt(r) < 2)
            break;
          const a = Ht(r, 2);
          i = new DataView(a.buffer, a.byteOffset, a.length).getUint16(0), n = 3;
        } else if (n === 2) {
          if (Vt(r) < 8)
            break;
          const a = Ht(r, 8), h = new DataView(a.buffer, a.byteOffset, a.length), p = h.getUint32(0);
          if (p > Math.pow(2, 21) - 1) {
            l.enqueue(Sr);
            break;
          }
          i = p * Math.pow(2, 32) + h.getUint32(4), n = 3;
        } else {
          if (Vt(r) < i)
            break;
          const a = Ht(r, i);
          l.enqueue(zr(s ? a : br.decode(a), e)), n = 0;
        }
        if (i === 0 || i > t) {
          l.enqueue(Sr);
          break;
        }
      }
    }
  });
}
const _i = 4;
function ie(t) {
  if (t) return Sa(t);
}
function Sa(t) {
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
const sr = typeof Promise == "function" && typeof Promise.resolve == "function" ? (e) => Promise.resolve().then(e) : (e, r) => r(e, 0), be = typeof self < "u" ? self : typeof window < "u" ? window : Function("return this")(), Ra = "arraybuffer";
function xi(t, ...e) {
  return e.reduce((r, n) => (t.hasOwnProperty(n) && (r[n] = t[n]), r), {});
}
const Ca = be.setTimeout, Ta = be.clearTimeout;
function or(t, e) {
  e.useNativeTimers ? (t.setTimeoutFn = Ca.bind(be), t.clearTimeoutFn = Ta.bind(be)) : (t.setTimeoutFn = be.setTimeout.bind(be), t.clearTimeoutFn = be.clearTimeout.bind(be));
}
const Ma = 1.33;
function ka(t) {
  return typeof t == "string" ? Oa(t) : Math.ceil((t.byteLength || t.size) * Ma);
}
function Oa(t) {
  let e = 0, r = 0;
  for (let n = 0, i = t.length; n < i; n++)
    e = t.charCodeAt(n), e < 128 ? r += 1 : e < 2048 ? r += 2 : e < 55296 || e >= 57344 ? r += 3 : (n++, r += 4);
  return r;
}
function Ei() {
  return Date.now().toString(36).substring(3) + Math.random().toString(36).substring(2, 5);
}
function La(t) {
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
class Pa extends Error {
  constructor(e, r, n) {
    super(e), this.description = r, this.context = n, this.type = "TransportError";
  }
}
class $r extends ie {
  /**
   * Transport abstract constructor.
   *
   * @param {Object} opts - options
   * @protected
   */
  constructor(e) {
    super(), this.writable = !1, or(this, e), this.opts = e, this.query = e.query, this.socket = e.socket, this.supportsBinary = !e.forceBase64;
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
    return super.emitReserved("error", new Pa(e, r, n)), this;
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
    const r = zr(e, this.socket.binaryType);
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
    const r = La(e);
    return r.length ? "?" + r : "";
  }
}
class Na extends $r {
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
function ja() {
}
class Ia extends Na {
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
let ut = class Yt extends ie {
  /**
   * Request constructor
   *
   * @param {Object} options
   * @package
   */
  constructor(e, r, n) {
    super(), this.createRequest = e, or(this, n), this._opts = n, this._method = n.method || "GET", this._uri = r, this._data = n.data !== void 0 ? n.data : null, this._create();
  }
  /**
   * Creates the XHR object and sends the request.
   *
   * @private
   */
  _create() {
    var e;
    const r = xi(this._opts, "agent", "pfx", "key", "passphrase", "cert", "ca", "ciphers", "rejectUnauthorized", "autoUnref");
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
    typeof document < "u" && (this._index = Yt.requestsCount++, Yt.requests[this._index] = this);
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
      if (this._xhr.onreadystatechange = ja, e)
        try {
          this._xhr.abort();
        } catch {
        }
      typeof document < "u" && delete Yt.requests[this._index], this._xhr = null;
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
    attachEvent("onunload", Pn);
  else if (typeof addEventListener == "function") {
    const t = "onpagehide" in be ? "pagehide" : "unload";
    addEventListener(t, Pn, !1);
  }
}
function Pn() {
  for (let t in ut.requests)
    ut.requests.hasOwnProperty(t) && ut.requests[t].abort();
}
const Ba = function() {
  const t = Ri({
    xdomain: !1
  });
  return t && t.responseType !== null;
}();
class Ua extends Ia {
  constructor(e) {
    super(e);
    const r = e && e.forceBase64;
    this.supportsBinary = Ba && !r;
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
      return new be[["Active"].concat("Object").join("X")]("Microsoft.XMLHTTP");
    } catch {
    }
}
const Ci = typeof navigator < "u" && typeof navigator.product == "string" && navigator.product.toLowerCase() === "reactnative";
class Fa extends $r {
  get name() {
    return "websocket";
  }
  doOpen() {
    const e = this.uri(), r = this.opts.protocols, n = Ci ? {} : xi(this.opts, "agent", "perMessageDeflate", "pfx", "key", "passphrase", "cert", "ca", "ciphers", "rejectUnauthorized", "localAddress", "protocolVersion", "origin", "maxPayload", "family", "checkServerIdentity");
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
      Fr(n, this.supportsBinary, (s) => {
        try {
          this.doWrite(n, s);
        } catch {
        }
        i && sr(() => {
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
const wr = be.WebSocket || be.MozWebSocket;
class za extends Fa {
  createSocket(e, r, n) {
    return Ci ? new wr(e, r, n) : r ? new wr(e, r) : new wr(e);
  }
  doWrite(e, r) {
    this.ws.send(r);
  }
}
class $a extends $r {
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
        const r = Ea(Number.MAX_SAFE_INTEGER, this.socket.binaryType), n = e.readable.pipeThrough(r).getReader(), i = xa();
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
        i && sr(() => {
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
const qa = {
  websocket: za,
  webtransport: $a,
  polling: Ua
}, Va = /^(?:(?![^:@\/?#]+:[^:@\/]*@)(http|https|ws|wss):\/\/)?((?:(([^:@\/?#]*)(?::([^:@\/?#]*))?)?@)?((?:[a-f0-9]{0,4}:){2,7}[a-f0-9]{0,4}|[^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/, Ha = [
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
  let i = Va.exec(t || ""), s = {}, o = 14;
  for (; o--; )
    s[Ha[o]] = i[o] || "";
  return r != -1 && n != -1 && (s.source = e, s.host = s.host.substring(1, s.host.length - 1).replace(/;/g, ":"), s.authority = s.authority.replace("[", "").replace("]", "").replace(/;/g, ":"), s.ipv6uri = !0), s.pathNames = Wa(s, s.path), s.queryKey = Ka(s, s.query), s;
}
function Wa(t, e) {
  const r = /\/{2,9}/g, n = e.replace(r, "/").split("/");
  return (e.slice(0, 1) == "/" || e.length === 0) && n.splice(0, 1), e.slice(-1) == "/" && n.splice(n.length - 1, 1), n;
}
function Ka(t, e) {
  const r = {};
  return e.replace(/(?:^|&)([^&=]*)=?([^&]*)/g, function(n, i, s) {
    i && (r[i] = s);
  }), r;
}
const Cr = typeof addEventListener == "function" && typeof removeEventListener == "function", Jt = [];
Cr && addEventListener("offline", () => {
  Jt.forEach((t) => t());
}, !1);
class He extends ie {
  /**
   * Socket constructor.
   *
   * @param {String|Object} uri - uri or options
   * @param {Object} opts - options
   */
  constructor(e, r) {
    if (super(), this.binaryType = Ra, this.writeBuffer = [], this._prevBufferLen = 0, this._pingInterval = -1, this._pingTimeout = -1, this._maxPayload = -1, this._pingTimeoutTime = 1 / 0, e && typeof e == "object" && (r = e, e = null), e) {
      const n = Rr(e);
      r.hostname = n.host, r.secure = n.protocol === "https" || n.protocol === "wss", r.port = n.port, n.query && (r.query = n.query);
    } else r.host && (r.hostname = Rr(r.host).host);
    or(this, r), this.secure = r.secure != null ? r.secure : typeof location < "u" && location.protocol === "https:", r.hostname && !r.port && (r.port = this.secure ? "443" : "80"), this.hostname = r.hostname || (typeof location < "u" ? location.hostname : "localhost"), this.port = r.port || (typeof location < "u" && location.port ? location.port : this.secure ? "443" : "80"), this.transports = [], this._transportsByName = {}, r.transports.forEach((n) => {
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
    }, Jt.push(this._offlineEventListener))), this.opts.withCredentials && (this._cookieJar = void 0), this._open();
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
    r.EIO = _i, r.transport = e, this.id && (r.sid = this.id);
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
    return e && (this._pingTimeoutTime = 0, sr(() => {
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
        const n = Jt.indexOf(this._offlineEventListener);
        n !== -1 && Jt.splice(n, 1);
      }
      this.readyState = "closed", this.id = null, this.emitReserved("close", e, r), this.writeBuffer = [], this._prevBufferLen = 0;
    }
  }
}
He.protocol = _i;
class Ya extends He {
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
              n || this.readyState !== "closed" && (p(), this.setTransport(r), r.send([{ type: "upgrade" }]), this.emitReserved("upgrade", r), r = null, this.upgrading = !1, this.flush());
            });
          } else {
            const v = new Error("probe error");
            v.transport = r.name, this.emitReserved("upgradeError", v);
          }
      }));
    };
    function s() {
      n || (n = !0, p(), r.close(), r = null);
    }
    const o = (m) => {
      const v = new Error("probe error: " + m);
      v.transport = r.name, s(), this.emitReserved("upgradeError", v);
    };
    function l() {
      o("transport closed");
    }
    function a() {
      o("socket closed");
    }
    function h(m) {
      r && m.name !== r.name && s();
    }
    const p = () => {
      r.removeListener("open", i), r.removeListener("error", o), r.removeListener("close", l), this.off("close", a), this.off("upgrading", h);
    };
    r.once("open", i), r.once("error", o), r.once("close", l), this.once("close", a), this.once("upgrading", h), this._upgrades.indexOf("webtransport") !== -1 && e !== "webtransport" ? this.setTimeoutFn(() => {
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
let Ja = class extends Ya {
  constructor(e, r = {}) {
    const n = typeof e == "object" ? e : r;
    (!n.transports || n.transports && typeof n.transports[0] == "string") && (n.transports = (n.transports || ["polling", "websocket", "webtransport"]).map((i) => qa[i]).filter((i) => !!i)), super(e, n);
  }
};
function Xa(t, e = "", r) {
  let n = t;
  r = r || typeof location < "u" && location, t == null && (t = r.protocol + "//" + r.host), typeof t == "string" && (t.charAt(0) === "/" && (t.charAt(1) === "/" ? t = r.protocol + t : t = r.host + t), /^(https?|wss?):\/\//.test(t) || (typeof r < "u" ? t = r.protocol + "//" + t : t = "https://" + t), n = Rr(t)), n.port || (/^(http|ws)$/.test(n.protocol) ? n.port = "80" : /^(http|ws)s$/.test(n.protocol) && (n.port = "443")), n.path = n.path || "/";
  const s = n.host.indexOf(":") !== -1 ? "[" + n.host + "]" : n.host;
  return n.id = n.protocol + "://" + s + ":" + n.port + e, n.href = n.protocol + "://" + s + (r && r.port === n.port ? "" : ":" + n.port), n;
}
const Ga = typeof ArrayBuffer == "function", Qa = (t) => typeof ArrayBuffer.isView == "function" ? ArrayBuffer.isView(t) : t.buffer instanceof ArrayBuffer, Ti = Object.prototype.toString, Za = typeof Blob == "function" || typeof Blob < "u" && Ti.call(Blob) === "[object BlobConstructor]", el = typeof File == "function" || typeof File < "u" && Ti.call(File) === "[object FileConstructor]";
function qr(t) {
  return Ga && (t instanceof ArrayBuffer || Qa(t)) || Za && t instanceof Blob || el && t instanceof File;
}
function Xt(t, e) {
  if (!t || typeof t != "object")
    return !1;
  if (Array.isArray(t)) {
    for (let r = 0, n = t.length; r < n; r++)
      if (Xt(t[r]))
        return !0;
    return !1;
  }
  if (qr(t))
    return !0;
  if (t.toJSON && typeof t.toJSON == "function" && arguments.length === 1)
    return Xt(t.toJSON(), !0);
  for (const r in t)
    if (Object.prototype.hasOwnProperty.call(t, r) && Xt(t[r]))
      return !0;
  return !1;
}
function tl(t) {
  const e = [], r = t.data, n = t;
  return n.data = Tr(r, e), n.attachments = e.length, { packet: n, buffers: e };
}
function Tr(t, e) {
  if (!t)
    return t;
  if (qr(t)) {
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
function rl(t, e) {
  return t.data = Mr(t.data, e), delete t.attachments, t;
}
function Mr(t, e) {
  if (!t)
    return t;
  if (t && t._placeholder === !0) {
    if (typeof t.num == "number" && t.num >= 0 && t.num < e.length)
      return e[t.num];
    throw new Error("illegal attachments");
  } else if (Array.isArray(t))
    for (let r = 0; r < t.length; r++)
      t[r] = Mr(t[r], e);
  else if (typeof t == "object")
    for (const r in t)
      Object.prototype.hasOwnProperty.call(t, r) && (t[r] = Mr(t[r], e));
  return t;
}
const nl = [
  "connect",
  "connect_error",
  "disconnect",
  "disconnecting",
  "newListener",
  "removeListener"
  // used by the Node.js EventEmitter
], il = 5;
var V;
(function(t) {
  t[t.CONNECT = 0] = "CONNECT", t[t.DISCONNECT = 1] = "DISCONNECT", t[t.EVENT = 2] = "EVENT", t[t.ACK = 3] = "ACK", t[t.CONNECT_ERROR = 4] = "CONNECT_ERROR", t[t.BINARY_EVENT = 5] = "BINARY_EVENT", t[t.BINARY_ACK = 6] = "BINARY_ACK";
})(V || (V = {}));
class sl {
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
    return (e.type === V.EVENT || e.type === V.ACK) && Xt(e) ? this.encodeAsBinary({
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
    const r = tl(e), n = this.encodeAsString(r.packet), i = r.buffers;
    return i.unshift(n), i;
  }
}
function Nn(t) {
  return Object.prototype.toString.call(t) === "[object Object]";
}
class Vr extends ie {
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
      n || r.type === V.BINARY_ACK ? (r.type = n ? V.EVENT : V.ACK, this.reconstructor = new ol(r), r.attachments === 0 && super.emitReserved("decoded", r)) : super.emitReserved("decoded", r);
    } else if (qr(e) || e.base64)
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
      if (Vr.isPayloadValid(n.type, s))
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
        return Nn(r);
      case V.DISCONNECT:
        return r === void 0;
      case V.CONNECT_ERROR:
        return typeof r == "string" || Nn(r);
      case V.EVENT:
      case V.BINARY_EVENT:
        return Array.isArray(r) && (typeof r[0] == "number" || typeof r[0] == "string" && nl.indexOf(r[0]) === -1);
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
class ol {
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
      const r = rl(this.reconPack, this.buffers);
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
const al = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Decoder: Vr,
  Encoder: sl,
  get PacketType() {
    return V;
  },
  protocol: il
}, Symbol.toStringTag, { value: "Module" }));
function Ee(t, e, r) {
  return t.on(e, r), function() {
    t.off(e, r);
  };
}
const ll = Object.freeze({
  connect: 1,
  connect_error: 1,
  disconnect: 1,
  disconnecting: 1,
  // EventEmitter reserved events: https://nodejs.org/api/events.html#events_event_newlistener
  newListener: 1,
  removeListener: 1
});
class Mi extends ie {
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
    if (ll.hasOwnProperty(e))
      throw new Error('"' + e.toString() + '" is a reserved event name');
    if (r.unshift(e), this._opts.retries && !this.flags.fromQueue && !this.flags.volatile)
      return this._addToQueue(r), this;
    const o = {
      type: V.EVENT,
      data: r
    };
    if (o.options = {}, o.options.compress = this.flags.compress !== !1, typeof r[r.length - 1] == "function") {
      const p = this.ids++, m = r.pop();
      this._registerAckCallback(p, m), o.id = p;
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
class kr extends ie {
  constructor(e, r) {
    var n;
    super(), this.nsps = {}, this.subs = [], e && typeof e == "object" && (r = e, e = void 0), r = r || {}, r.path = r.path || "/socket.io", this.opts = r, or(this, r), this.reconnection(r.reconnection !== !1), this.reconnectionAttempts(r.reconnectionAttempts || 1 / 0), this.reconnectionDelay(r.reconnectionDelay || 1e3), this.reconnectionDelayMax(r.reconnectionDelayMax || 5e3), this.randomizationFactor((n = r.randomizationFactor) !== null && n !== void 0 ? n : 0.5), this.backoff = new pt({
      min: this.reconnectionDelay(),
      max: this.reconnectionDelayMax(),
      jitter: this.randomizationFactor()
    }), this.timeout(r.timeout == null ? 2e4 : r.timeout), this._readyState = "closed", this.uri = e;
    const i = r.parser || al;
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
    this.engine = new Ja(this.uri, this.opts);
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
    sr(() => {
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
    return n ? this._autoConnect && !n.active && n.connect() : (n = new Mi(this, e, r), this.nsps[e] = n), n;
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
function Gt(t, e) {
  typeof t == "object" && (e = t, t = void 0), e = e || {};
  const r = Xa(t, e.path || "/socket.io"), n = r.source, i = r.id, s = r.path, o = Et[i] && s in Et[i].nsps, l = e.forceNew || e["force new connection"] || e.multiplex === !1 || o;
  let a;
  return l ? a = new kr(n, e) : (Et[i] || (Et[i] = new kr(n, e)), a = Et[i]), r.query && !e.query && (e.query = r.queryKey), a.socket(r.path, e);
}
Object.assign(Gt, {
  Manager: kr,
  Socket: Mi,
  io: Gt,
  connect: Gt
});
const Tt = {
  serverOrigin: "http://localhost:8080",
  defaultRoomKey: "dev-room-1000",
};
let Or = { ...Tt };
function cl(t) {
  Or = { ...Or, ...t };
}
function Hr() {
  return Or;
}
const ki = qi(Tt);
function ul() {
  return Vi(ki);
}
const Oi = (() => {
  try {
    const t = new URLSearchParams(window.location.search);
    if (t.has("verbose") || t.get("v") === "1" || localStorage.getItem("wp_verbose") === "1") return !0;
  } catch {
  }
  return !1;
})();
function ee(t, e) {
  Oi && (e !== void 0 ? console.debug("[wp]", t, e) : console.debug("[wp]", t));
}
function me() {
  return Oi;
}
let le = null, et = null, Dn = null;
function dl(t) {
  const e = Nt(), r = W.getState();
  if (r.me.clientId && r.roster[r.me.clientId])
    return (t.name || t.sprite) && (ee("identity_update_emit", { name: t.name, sprite: t.sprite }), e.emit("identity_update", { name: t.name, sprite: t.sprite })), e;
  const n = fl(t), i = () => {
    setTimeout(() => {
      const s = W.getState();
      s.name && (ee("identity_update_emit_post_join", { name: s.name, sprite: s.sprite }), e.emit("identity_update", { name: s.name, sprite: s.sprite || void 0 }));
    }, 40);
  };
  return e.connected ? (ee("join_emit", n), e.emit("join", n), i()) : e.once("connect", () => {
    ee("join_emit", n), e.emit("join", n), i();
  }), e;
}
function fl(t) {
  return {
    room_key: t.room_key,
    leader_key: t.leader_key || void 0,
    override: t.override || void 0,
    name: t.name,
    sprite: t.sprite
  };
}
function Nt() {
  if (!le) {
    let e = Hr().serverOrigin || "/";
    if (e === "/" && typeof window < "u") {
      const r = window.location;
      (r.hostname === "localhost" || r.hostname === "127.0.0.1") && r.port === "5173" && (e = `${r.protocol}//${r.hostname}:8080`, ee("socket_origin_fallback", { origin: e }));
    }
    le = Gt(e, { path: "/watchparty/ws", transports: ["websocket"] }), ee("socket_init", { origin: e }), le.on("connect", () => {
      const r = le == null ? void 0 : le.id;
      if (ee("socket_connect", { id: r }), r)
        try {
          W.getState().ensureMe(r);
        } catch {
        }
    }), le.on("disconnect", (r) => ee("socket_disconnect", { reason: r })), le.on("connect_error", (r) => ee("socket_connect_error", { message: r == null ? void 0 : r.message })), le.on("reconnect_attempt", (r) => ee("socket_reconnect_attempt", { attempt: r })), le.on("reconnect_failed", () => ee("socket_reconnect_failed")), hl(le);
  }
  return le;
}
function hl(t) {
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
  }), Dn || (Dn = setInterval(() => {
    pl();
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
      "auth/invalid_key": "Invalid leader key.",
      origin_block: "Origin not allowed."
    };
    W.getState().pushToast("error", n[r] || r);
  });
}
function pl() {
  et || (et = { ts: Date.now() }, Nt().emit("time_ping", {}));
}
function ml(t, e) {
  const r = {};
  r.name = t, e && (r.sprite = e), !(!r.name && !r.sprite) && (ee("identity_update_emit", r), Nt().emit("identity_update", r));
}
function gl({ mediaUrl: t, indexUrl: e, mediaId: r }) {
  const n = qe(null), [i, s] = ge(!1), [o, l] = ge([]), [a, h] = ge(null), p = W((d) => d.readiness), m = W((d) => d.snapshot), v = qe(!1), f = qe(null), E = qe(null), w = qe(null);
  we(() => {
    let d = !1;
    return (async () => {
      var R;
      try {
        const C = await fetch(e, { cache: "no-store" });
        if (!C.ok) return;
        const M = await C.json();
        if (d) return;
        l(M.fragments || []), h(M.duration_ms || null), me() && console.debug("[wp] index_loaded", { count: (R = M.fragments) == null ? void 0 : R.length, duration: M.duration_ms });
      } catch (C) {
        me() && console.debug("[wp] index_error", C == null ? void 0 : C.message);
      }
    })(), () => {
      d = !0;
    };
  }, [e]), we(() => {
    let d = null;
    const R = new MediaSource();
    E.current = R, n.current && (d = URL.createObjectURL(R), n.current.src = d);
    const C = () => {
      try {
        const M = R.addSourceBuffer('video/mp4; codecs="avc1.4d401e, mp4a.40.2"');
        f.current = M, M.addEventListener("error", () => {
          me() && console.debug("[wp] sb_error");
        }), o.length && k();
      } catch (M) {
        me() && console.debug("[wp] mse_source_error", M == null ? void 0 : M.message);
      }
    };
    return R.addEventListener("sourceopen", C), () => {
      R.removeEventListener("sourceopen", C), d && URL.revokeObjectURL(d), w.current && w.current.abort();
    };
  }, [t, r]), we(() => {
    var d;
    ((d = E.current) == null ? void 0 : d.readyState) === "open" && f.current && o.length && !v.current && k();
  }, [o]);
  function k() {
    if (!o.length || !f.current) return;
    const d = o[0], R = `bytes=${d.start_byte}-${d.end_byte}`, C = new AbortController();
    w.current = C, fetch(t, { headers: { Range: R }, signal: C.signal }).then((M) => M.arrayBuffer()).then((M) => {
      f.current && (f.current.addEventListener("updateend", x, { once: !0 }), f.current.appendBuffer(M));
    }).catch((M) => {
      me() && console.debug("[wp] init_fetch_error", M == null ? void 0 : M.message);
    });
  }
  function x() {
    v.current || (v.current = !0, Nt().emit("client_ready", { media_id: r, first_appended: !0 }), me() && console.debug("[wp] client_ready emitted", { mediaId: r })), s(!0);
  }
  return we(() => {
    const d = n.current;
    if (!d) return;
    m.playing ? d.paused && d.play().catch(() => {
    }) : d.paused || d.pause();
    const R = m.playheadMs;
    if (typeof R == "number" && i) {
      const C = d.currentTime * 1e3, M = R - C, q = Math.abs(M);
      q > 500 ? (d.currentTime = R / 1e3, me() && console.debug("[wp] drift_snap", { drift: M })) : q > 80 && (d.currentTime = R / 1e3, me() && console.debug("[wp] drift_nudge", { drift: M }));
    }
  }, [m.playing, m.playheadMs, i]), /* @__PURE__ */ b.jsxs("div", { className: "relative w-full h-full bg-black", children: [
    /* @__PURE__ */ b.jsx("video", { ref: n, className: "w-full h-full", playsInline: !0, muted: !0 }),
    !p.ready && /* @__PURE__ */ b.jsx("div", { className: "absolute inset-0 flex items-center justify-center pointer-events-none", children: /* @__PURE__ */ b.jsxs("div", { className: "px-4 py-2 rounded bg-slate-900/80 text-xs font-medium", children: [
      "Syncing… (",
      p.readyCount,
      "/",
      p.total,
      ")"
    ] }) }),
    a && /* @__PURE__ */ b.jsxs("div", { className: "absolute bottom-2 right-2 text-[10px] opacity-60 bg-black/40 px-2 py-1 rounded", children: [
      (a / 1e3).toFixed(0),
      "s"
    ] })
  ] });
}
let tt = null;
const yl = 6e4;
async function Lr(t = "") {
  var l, a;
  const e = Date.now();
  if (tt && tt.prefix === t && e - tt.ts < yl)
    return tt.data;
  const i = `${Hr().serverOrigin.replace(/\/$/, "")}/api/catalog${t ? `?prefix=${encodeURIComponent(t)}` : ""}`, s = await fetch(i, { cache: "no-store" });
  if (!s.ok) throw new Error(`catalog_http_${s.status}`);
  const o = await s.json();
  return me() && console.debug("[wp] catalog_fetch", { prefix: t, dirs: (l = o.dirs) == null ? void 0 : l.length, files: (a = o.files) == null ? void 0 : a.length }), tt = { ts: e, prefix: t, data: o }, o;
}
function vl(t) {
  tt && (tt = null);
}
function Li(t, e) {
  const n = W.getState().allocateClientSeq(), i = { kind: t, client_seq: n, ...e || {} };
  return Nt().emit("control", i), n;
}
function bl(t) {
  return Li("load", { media_id: t });
}
function wl() {
  return Li("home");
}
async function _l() {
  if (me())
    try {
      const t = ["output/fmp4/anime", "output/fmp4/movie", "output/fmp4/tv"];
      for (const e of t) {
        const r = await Lr(e);
        console.debug("[wp][probe] catalog", e, { dirs: r.dirs.length, files: r.files.length });
        const n = r.files[0];
        if (n) {
          const i = xl(), s = `${i}/${n.id}/index.json`.replace(/\\/g, "/"), o = `${i}/${n.id}/output_frag.mp4`.replace(/\\/g, "/");
          await jn(s, "index"), await jn(o, "fragment", { headers: { Range: "bytes=0-1023" } });
        }
      }
    } catch (t) {
      console.debug("[wp][probe] error", (t == null ? void 0 : t.message) || String(t));
    }
}
function xl() {
  return Hr().mediaBase;
}
async function jn(t, e, r) {
  const n = performance.now(), i = await fetch(t, r), s = Math.round(performance.now() - n);
  return console.debug("[wp][probe]", e, { url: t, status: i.status, ms: s, bytes: i.headers.get("content-length") }), i;
}
const El = ({ open: t, onClose: e }) => {
  const [r, n] = ge(!1), [i, s] = ge(null), [o, l] = ge([]), [a, h] = ge(""), p = Hi(async () => {
    n(!0), s(null);
    try {
      const x = [
        { key: "anime", label: "Anime" },
        { key: "movie", label: "Movie" },
        { key: "tv", label: "TV" }
      ], d = "output/fmp4", R = [];
      for (const C of x) {
        const M = `${d}/${C.key}`;
        let q;
        try {
          q = await Lr(M);
        } catch {
          continue;
        }
        const g = [];
        for (const O of q.dirs) {
          let U;
          try {
            U = await Lr(O.path);
          } catch {
            continue;
          }
          const j = U.files.map((B) => ({ type: "episode", name: B.title, mediaId: B.id }));
          j.length && g.push({ type: "series", name: O.name, episodes: j, expanded: !1 });
        }
        g.length && R.push({ type: "category", name: C.label, series: g, expanded: !0 });
      }
      l(R), me() && _l();
    } catch (x) {
      s(x.message || "catalog_error");
    } finally {
      n(!1);
    }
  }, []);
  we(() => {
    t && p();
  }, [t, p]);
  function m(x) {
    bl(x), me() && console.debug("[wp] control_load", x), e();
  }
  function v() {
    wl(), me() && console.debug("[wp] control_home"), e();
  }
  function f(x, d) {
    l((R) => R.map((C, M) => M !== x ? C : { ...C, series: C.series.map((q, g) => g !== d ? q : { ...q, expanded: !q.expanded }) }));
  }
  function E(x) {
    l((d) => d.map((R, C) => C !== x ? R : { ...R, expanded: !R.expanded }));
  }
  function w() {
    vl(), p();
  }
  const k = Bn(() => {
    if (!a.trim()) return o;
    const x = a.toLowerCase();
    return o.map((d) => {
      const R = d.series.map((C) => {
        const M = C.episodes.filter((q) => q.name.toLowerCase().includes(x));
        return M.length ? { ...C, episodes: M, expanded: !0 } : C.name.toLowerCase().includes(x) ? { ...C, expanded: !0 } : null;
      }).filter(Boolean);
      return R.length ? { ...d, series: R, expanded: !0 } : d.name.toLowerCase().includes(x) ? { ...d, expanded: !0 } : null;
    }).filter(Boolean);
  }, [o, a]);
  return t ? /* @__PURE__ */ b.jsx("div", { className: "fixed inset-0 bg-black/40 flex justify-end z-40", children: /* @__PURE__ */ b.jsxs("div", { className: "w-[440px] h-full bg-gray-950 border-l border-gray-800 flex flex-col", children: [
    /* @__PURE__ */ b.jsxs("div", { className: "p-3 border-b border-gray-800 flex items-center gap-2 text-sm", children: [
      /* @__PURE__ */ b.jsx("button", { onClick: e, className: "px-2 py-1 bg-gray-800 hover:bg-gray-700 rounded", children: "Close" }),
      /* @__PURE__ */ b.jsx("button", { onClick: v, className: "px-2 py-1 bg-indigo-600 hover:bg-indigo-500 rounded", children: "Home" }),
      /* @__PURE__ */ b.jsx("button", { onClick: w, className: "px-2 py-1 bg-gray-800 hover:bg-gray-700 rounded", children: "Reload" }),
      /* @__PURE__ */ b.jsx("input", { value: a, onChange: (x) => h(x.target.value), placeholder: "search", className: "ml-auto bg-gray-900 border border-gray-700 focus:border-gray-500 outline-none px-2 py-1 rounded text-xs" })
    ] }),
    r && /* @__PURE__ */ b.jsx("div", { className: "px-4 py-2 text-xs text-gray-500", children: "Loading catalog…" }),
    i && /* @__PURE__ */ b.jsx("div", { className: "px-4 py-2 text-xs text-red-400", children: i }),
    /* @__PURE__ */ b.jsxs("div", { className: "flex-1 overflow-auto text-sm py-2", children: [
      k.map((x, d) => /* @__PURE__ */ b.jsxs("div", { className: "px-3 pb-3", children: [
        /* @__PURE__ */ b.jsxs("div", { className: "flex items-center gap-2 cursor-pointer select-none group", onClick: () => E(d), children: [
          /* @__PURE__ */ b.jsx("span", { className: "text-xs uppercase tracking-wider text-gray-500 group-hover:text-gray-300", children: x.name }),
          /* @__PURE__ */ b.jsx("span", { className: "text-[10px] opacity-50", children: x.expanded ? "−" : "+" })
        ] }),
        x.expanded && /* @__PURE__ */ b.jsxs("div", { className: "mt-2 space-y-2", children: [
          x.series.map((R, C) => /* @__PURE__ */ b.jsxs("div", { children: [
            /* @__PURE__ */ b.jsxs("div", { className: "flex items-center gap-2 cursor-pointer text-gray-300 hover:text-white", onClick: () => f(d, C), children: [
              /* @__PURE__ */ b.jsx("span", { className: "text-xs font-medium", children: R.name }),
              /* @__PURE__ */ b.jsx("span", { className: "text-[10px] opacity-40", children: R.expanded ? "−" : "+" })
            ] }),
            R.expanded && /* @__PURE__ */ b.jsxs("div", { className: "mt-1 ml-3 border-l border-gray-800 pl-3 space-y-1", children: [
              R.episodes.map((M) => /* @__PURE__ */ b.jsxs("button", { onClick: () => m(M.mediaId), className: "w-full text-left px-2 py-1 rounded hover:bg-gray-900 flex items-center gap-2 group", children: [
                /* @__PURE__ */ b.jsx("span", { className: "text-[11px] text-gray-400 group-hover:text-gray-200 truncate", children: M.name }),
                /* @__PURE__ */ b.jsx("span", { className: "ml-auto text-[10px] text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity", children: "Load" })
              ] }, M.mediaId)),
              R.episodes.length === 0 && /* @__PURE__ */ b.jsx("div", { className: "text-[11px] text-gray-600 italic", children: "(no episodes)" })
            ] })
          ] }, R.name)),
          x.series.length === 0 && /* @__PURE__ */ b.jsx("div", { className: "text-[11px] text-gray-600 italic", children: "(empty)" })
        ] })
      ] }, x.name)),
      !r && !k.length && /* @__PURE__ */ b.jsx("div", { className: "px-4 py-6 text-center text-xs text-gray-600", children: "No matches" })
    ] }),
    /* @__PURE__ */ b.jsxs("div", { className: "p-2 text-[10px] text-gray-600 border-t border-gray-900 flex justify-between", children: [
      /* @__PURE__ */ b.jsx("span", { children: "Simple Catalog" }),
      me() && /* @__PURE__ */ b.jsx("span", { className: "opacity-70", children: "verbose" })
    ] })
  ] }) }) : null;
};
function Sl({ open: t, onClose: e }) {
  const { name: r, sprite: n, setIdentity: i } = W(), [s, o] = ge(r), [l, a] = ge(n), [h, p] = ge(t);
  we(() => {
    if (t)
      p(!0);
    else {
      const v = setTimeout(() => p(!1), 320);
      return () => clearTimeout(v);
    }
  }, [t]);
  const m = () => {
    const v = (s || "").trim().slice(0, 32) || "Guest";
    i(v, l), ml(v, l || void 0), e();
  };
  return h ? /* @__PURE__ */ b.jsxs("div", { "aria-hidden": !t, className: `fixed inset-y-0 right-0 w-80 bg-slate-900/95 backdrop-blur border-l border-slate-700 transition-transform duration-300 z-30 flex flex-col ${t ? "translate-x-0" : "translate-x-full"} ${t ? "" : "pointer-events-none"}`, children: [
    /* @__PURE__ */ b.jsxs("div", { className: "p-4 flex items-center justify-between border-b border-slate-700", children: [
      /* @__PURE__ */ b.jsx("h2", { className: "font-semibold text-sm", children: "Identity" }),
      /* @__PURE__ */ b.jsx("button", { type: "button", onClick: e, role: "button", className: "text-xs opacity-70 hover:opacity-100 select-none", children: "Close" })
    ] }),
    /* @__PURE__ */ b.jsxs("div", { className: "p-4 space-y-4 overflow-y-auto text-sm", children: [
      /* @__PURE__ */ b.jsxs("div", { children: [
        /* @__PURE__ */ b.jsx("label", { className: "block text-xs uppercase tracking-wide mb-1 opacity-70", children: "Display Name" }),
        /* @__PURE__ */ b.jsx("input", { value: s, onChange: (v) => o(v.target.value), className: "w-full bg-slate-800 border border-slate-600 rounded px-2 py-1 text-sm", placeholder: "Your name" })
      ] }),
      /* @__PURE__ */ b.jsxs("div", { children: [
        /* @__PURE__ */ b.jsx("label", { className: "block text-xs uppercase tracking-wide mb-1 opacity-70", children: "Character" }),
        /* @__PURE__ */ b.jsx("div", { className: "grid grid-cols-4 gap-3", children: ct.map((v) => /* @__PURE__ */ b.jsxs("button", { onClick: () => {
          a(v), (!s.trim() || ct.includes(s) || s === "Guest") && o(v);
        }, className: `relative group rounded border ${l === v ? "border-emerald-400" : "border-slate-600 hover:border-slate-400"} p-1 flex flex-col items-center gap-1`, children: [
          /* @__PURE__ */ b.jsx("img", { src: Br(v), alt: v, className: "w-12 h-12 object-cover rounded" }),
          /* @__PURE__ */ b.jsx("span", { className: "text-[10px] opacity-70 group-hover:opacity-100 capitalize", children: v })
        ] }, v)) })
      ] }),
      /* @__PURE__ */ b.jsx("div", { className: "pt-2 flex gap-2 items-center", children: /* @__PURE__ */ b.jsx("button", { onClick: m, className: "bg-emerald-500 hover:bg-emerald-400 text-black font-semibold text-sm px-3 py-1 rounded", children: "Update" }) })
    ] })
  ] }) : null;
}
function Rl(t, e) {
  if (!t) return null;
  const r = `${e.replace(/\/$/, "")}/${t}`.replace(/\\/g, "/");
  return { mediaUrl: `${r}/output_frag.mp4`, indexUrl: `${r}/index.json` };
}
function Cl() {
  const t = ul(), e = W((x) => x.snapshot), { ensureAutoIdentity: r, name: n, sprite: i } = W(), s = si(), o = qe(!1), l = Bn(() => Rl(e.mediaId, t.mediaBase), [e.mediaId, t.mediaBase]), [a, h] = ge(!1), [p, m] = ge(!1);
  we(() => {
    if (o.current) return;
    const x = new URLSearchParams(window.location.search), d = s.roomKey || x.get("room") || t.defaultRoomKey;
    r();
    const R = x.get("leaderKey") || x.get("leaderkey") || x.get("leader_key") || void 0;
    dl({ room_key: d, leader_key: R || null, name: n || void 0, sprite: i || void 0 }), o.current = !0;
  }, [s.roomKey, r, n, i, t.defaultRoomKey]);
  const v = W((x) => !!x.snapshot.leaderId && x.snapshot.leaderId === x.me.clientId);
  function f() {
    m(!1), h(!0);
  }
  function E() {
    h(!1), m(!0);
  }
  function w() {
    h(!1);
  }
  function k() {
    m(!1);
  }
  return /* @__PURE__ */ b.jsxs("div", { className: "relative min-h-[calc(100vh-120px)] flex", children: [
    /* @__PURE__ */ b.jsxs("div", { className: "flex-1 relative bg-black", children: [
      l ? /* @__PURE__ */ b.jsx(gl, { mediaUrl: l.mediaUrl, indexUrl: l.indexUrl, mediaId: e.mediaId }) : /* @__PURE__ */ b.jsxs(b.Fragment, { children: [
        /* @__PURE__ */ b.jsx(Ur, {}),
        /* @__PURE__ */ b.jsx("div", { className: "absolute inset-0 flex flex-col items-center justify-center gap-4 p-6", children: /* @__PURE__ */ b.jsx("div", { className: "mt-6 p-3 rounded bg-slate-900/70 border border-slate-700/40 backdrop-blur-sm", children: /* @__PURE__ */ b.jsx(ma, {}) }) })
      ] }),
      v && !a && /* @__PURE__ */ b.jsx("button", { onClick: f, className: "fixed bottom-4 left-1/2 -translate-x-1/2 z-40 bg-indigo-600 hover:bg-indigo-500 text-xs px-4 py-2 rounded shadow", children: "Media" })
    ] }),
    /* @__PURE__ */ b.jsx("aside", { className: "w-80 border-l border-slate-800 p-4 hidden md:block text-xs opacity-70", children: "Chat panel placeholder (Phase 5)" }),
    /* @__PURE__ */ b.jsx(El, { open: a, onClose: w }),
    /* @__PURE__ */ b.jsx(Sl, { open: p, onClose: k, onJoin: () => {
    } }),
    !p && /* @__PURE__ */ b.jsx("button", { onClick: E, className: "fixed bottom-4 right-4 bg-slate-800/80 hover:bg-slate-700 border border-slate-600 text-xs px-3 py-1 rounded shadow backdrop-blur z-40", children: "Identity" })
  ] });
}
function Tl() {
  return /* @__PURE__ */ b.jsxs("div", { className: "fixed inset-0 bg-black", children: [
    /* @__PURE__ */ b.jsx(Ur, {}),
    /* @__PURE__ */ b.jsx("div", { className: "absolute inset-0 flex items-center justify-center", children: /* @__PURE__ */ b.jsxs("div", { className: "text-center", children: [
      /* @__PURE__ */ b.jsx("h1", { className: "text-4xl font-bold text-white mb-4", children: "API is sleeping..." }),
      /* @__PURE__ */ b.jsx("p", { className: "text-slate-400 text-lg", children: "༼ つ ◕_◕ ༽つ HADOKU TAKE MY ENERGY ༼ つ ◕_◕ ༽つ" })
    ] }) })
  ] });
}
function Ml() {
  const t = Pt(), e = ii();
  return si(), we(() => {
    const r = new URLSearchParams(window.location.search), n = r.get("roomKey") || r.get("room");
    n && (t.pathname === "/" || t.pathname === "") && e(`/room/${encodeURIComponent(n)}`, { replace: !0 });
  }, [t.pathname, e]), t.pathname === "/" || t.pathname === "" ? /* @__PURE__ */ b.jsx(pa, {}) : t.pathname.startsWith("/room") ? /* @__PURE__ */ b.jsx(Cl, {}) : /* @__PURE__ */ b.jsx("div", { className: "p-6", children: "Not Found" });
}
function In(t) {
  const [e, r] = ge(!1), [n, i] = ge(!0), s = {
    serverOrigin: t.serverOrigin || Tt.serverOrigin,
    defaultRoomKey: t.defaultRoomKey || Tt.defaultRoomKey,
    mediaBase: t.mediaBase || Tt.mediaBase
  };
  return we(() => {
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
  }, [s.serverOrigin]), we(() => {
    function o() {
      for (const a of ct) {
        const h = new Image();
        h.decoding = "async", h.loading = "eager", h.src = Br(a);
      }
    }
    function l() {
      "requestIdleCallback" in window ? window.requestIdleCallback(o, { timeout: 2e3 }) : setTimeout(o, 600);
    }
    document.readyState === "complete" ? l() : window.addEventListener("load", l, { once: !0 });
  }, []), n ? /* @__PURE__ */ b.jsx("div", { className: "min-h-screen flex items-center justify-center bg-black", children: /* @__PURE__ */ b.jsx("div", { className: "text-slate-400", children: "Checking server status..." }) }) : e ? /* @__PURE__ */ b.jsx(Tl, {}) : /* @__PURE__ */ b.jsx(ki.Provider, { value: s, children: /* @__PURE__ */ b.jsxs("div", { className: "min-h-screen flex flex-col", children: [
    /* @__PURE__ */ b.jsx("header", { className: "p-3 border-b border-slate-700 flex items-center gap-4 text-sm", children: /* @__PURE__ */ b.jsx(ui, { to: "/", className: "font-semibold", children: "Watchparty" }) }),
    /* @__PURE__ */ b.jsxs("main", { className: "flex-1", children: [
      /* @__PURE__ */ b.jsx(Ml, {}),
      /* @__PURE__ */ b.jsx(mo, {})
    ] }),
    /* @__PURE__ */ b.jsx(fa, {})
  ] }) });
}
function kl({ basename: t = "/watchparty", appProps: e } = {}) {
  const r = e ?? {}, n = [
    { path: "/", element: /* @__PURE__ */ b.jsx(In, { ...r }) },
    { path: "/room/:roomKey", element: /* @__PURE__ */ b.jsx(In, { ...r }) }
  ];
  return Eo(n, { basename: t });
}
function Ol(t, e, r) {
  const n = Wi(t), i = r ? /* @__PURE__ */ b.jsx(Lt.StrictMode, { children: e }) : e;
  return n.render(i), n;
}
function Nl(t, e = {}) {
  const { basename: r, strictMode: n = !0, ...i } = e;
  cl({
    serverOrigin: i.serverOrigin,
    defaultRoomKey: i.defaultRoomKey,
    mediaBase: i.mediaBase
  });
  const s = t.__watchparty;
  s == null || s.root.unmount();
  const o = kl({
    basename: r,
    appProps: i
  }), a = { root: Ol(t, /* @__PURE__ */ b.jsx(Ao, { router: o }), n) };
  return t.__watchparty = a, o;
}
function Dl(t) {
  const e = t.__watchparty;
  e == null || e.root.unmount(), e && delete t.__watchparty;
}
export {
  kl as createWatchpartyRouter,
  Nl as mount,
  Dl as unmount
};
//# sourceMappingURL=index.js.map
