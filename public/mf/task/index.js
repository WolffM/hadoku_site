import { jsx as l, jsxs as w, Fragment as kt } from "react/jsx-runtime";
import { createRoot as Tt } from "react-dom/client";
import g, { useState as I, useEffect as te, useCallback as Te, useMemo as be, useRef as ye, Component as yt } from "react";
const Z = {
  width: 20,
  height: 20,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round"
}, wt = () => g.createElement(
  "svg",
  { ...Z },
  g.createElement("circle", { cx: "12", cy: "12", r: "5" }),
  g.createElement("line", { x1: "12", y1: "1", x2: "12", y2: "3" }),
  g.createElement("line", { x1: "12", y1: "21", x2: "12", y2: "23" }),
  g.createElement("line", { x1: "4.22", y1: "4.22", x2: "5.64", y2: "5.64" }),
  g.createElement("line", { x1: "18.36", y1: "18.36", x2: "19.78", y2: "19.78" }),
  g.createElement("line", { x1: "1", y1: "12", x2: "3", y2: "12" }),
  g.createElement("line", { x1: "21", y1: "12", x2: "23", y2: "12" }),
  g.createElement("line", { x1: "4.22", y1: "19.78", x2: "5.64", y2: "18.36" }),
  g.createElement("line", { x1: "18.36", y1: "5.64", x2: "19.78", y2: "4.22" })
), qe = () => g.createElement(
  "svg",
  { ...Z },
  g.createElement("path", { d: "M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" })
), Me = () => g.createElement(
  "svg",
  { ...Z },
  g.createElement("path", { d: "M12 21 C12 21 6.5 15 6.5 11 C6.5 8.5 8 7 10 7 C11 7 12 7.5 12 7.5 C12 7.5 13 7 14 7 C16 7 17.5 8.5 17.5 11 C17.5 15 12 21 12 21 Z", fill: "currentColor" }),
  g.createElement("path", { d: "M9.5 7.5 L9 5 L11 5.5 Z", fill: "currentColor" }),
  g.createElement("path", { d: "M14.5 7.5 L15 5 L13 5.5 Z", fill: "currentColor" }),
  g.createElement("path", { d: "M12 7.5 L12 4 L12 5", stroke: "currentColor", strokeWidth: "1.5", fill: "none" }),
  g.createElement("line", { x1: "10", y1: "10", x2: "10", y2: "11", stroke: "currentColor", strokeWidth: "1", opacity: "0.4" }),
  g.createElement("line", { x1: "14", y1: "10", x2: "14", y2: "11", stroke: "currentColor", strokeWidth: "1", opacity: "0.4" }),
  g.createElement("line", { x1: "9", y1: "13", x2: "9", y2: "14", stroke: "currentColor", strokeWidth: "1", opacity: "0.4" }),
  g.createElement("line", { x1: "15", y1: "13", x2: "15", y2: "14", stroke: "currentColor", strokeWidth: "1", opacity: "0.4" }),
  g.createElement("line", { x1: "11", y1: "16", x2: "11", y2: "17", stroke: "currentColor", strokeWidth: "1", opacity: "0.4" }),
  g.createElement("line", { x1: "13", y1: "16", x2: "13", y2: "17", stroke: "currentColor", strokeWidth: "1", opacity: "0.4" })
), Ie = () => g.createElement(
  "svg",
  { ...Z },
  g.createElement("path", { d: "M2 12c2-2 4-2 6 0s4 2 6 0 4-2 6 0" }),
  g.createElement("path", { d: "M2 17c2-2 4-2 6 0s4 2 6 0 4-2 6 0" }),
  g.createElement("path", { d: "M2 7c2-2 4-2 6 0s4 2 6 0 4-2 6 0" })
), _e = () => g.createElement(
  "svg",
  { ...Z },
  g.createElement("polygon", { points: "13 2 3 14 12 14 11 22 21 10 12 10 13 2" })
), Le = () => g.createElement(
  "svg",
  { ...Z },
  g.createElement("path", { d: "M18 8h1a4 4 0 0 1 0 8h-1" }),
  g.createElement("path", { d: "M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" }),
  g.createElement("line", { x1: "6", y1: "1", x2: "6", y2: "4" }),
  g.createElement("line", { x1: "10", y1: "1", x2: "10", y2: "4" }),
  g.createElement("line", { x1: "14", y1: "1", x2: "14", y2: "4" })
), Oe = () => g.createElement(
  "svg",
  { ...Z },
  g.createElement("circle", { cx: "12", cy: "12", r: "2", fill: "currentColor" }),
  g.createElement("circle", { cx: "12", cy: "6", r: "2.5", fill: "none", stroke: "currentColor", strokeWidth: "2" }),
  g.createElement("circle", { cx: "18", cy: "10", r: "2.5", fill: "none", stroke: "currentColor", strokeWidth: "2" }),
  g.createElement("circle", { cx: "16", cy: "16", r: "2.5", fill: "none", stroke: "currentColor", strokeWidth: "2" }),
  g.createElement("circle", { cx: "8", cy: "16", r: "2.5", fill: "none", stroke: "currentColor", strokeWidth: "2" }),
  g.createElement("circle", { cx: "6", cy: "10", r: "2.5", fill: "none", stroke: "currentColor", strokeWidth: "2" })
), $e = () => g.createElement(
  "svg",
  { ...Z },
  g.createElement("path", { d: "M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z", fill: "currentColor" })
), Pe = () => g.createElement(
  "svg",
  { ...Z },
  g.createElement("path", { d: "M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z", fill: "currentColor" }),
  g.createElement("path", { d: "M2 21c0-3 1.85-5.36 5.08-6C9 14.5 11 14 11 20", stroke: "currentColor", strokeWidth: "2", fill: "none" }),
  g.createElement("path", { d: "M11 8c3 2 5 4 7 7", stroke: "white", strokeWidth: "1.5", opacity: "0.4" })
), vt = () => g.createElement(
  "svg",
  { ...Z },
  g.createElement("rect", { x: "11", y: "1", width: "2", height: "3", fill: "currentColor" }),
  g.createElement("rect", { x: "16.5", y: "3.5", width: "3", height: "2", fill: "currentColor", transform: "rotate(45 18 4.5)" }),
  g.createElement("rect", { x: "19", y: "11", width: "3", height: "2", fill: "currentColor" }),
  g.createElement("rect", { x: "16.5", y: "18.5", width: "3", height: "2", fill: "currentColor", transform: "rotate(-45 18 19.5)" }),
  g.createElement("rect", { x: "11", y: "20", width: "2", height: "3", fill: "currentColor" }),
  g.createElement("rect", { x: "4.5", y: "18.5", width: "3", height: "2", fill: "currentColor", transform: "rotate(45 6 19.5)" }),
  g.createElement("rect", { x: "2", y: "11", width: "3", height: "2", fill: "currentColor" }),
  g.createElement("rect", { x: "4.5", y: "3.5", width: "3", height: "2", fill: "currentColor", transform: "rotate(-45 6 4.5)" }),
  g.createElement("circle", { cx: "12", cy: "12", r: "7", fill: "currentColor" }),
  g.createElement("circle", { cx: "12", cy: "12", r: "4", fill: "var(--color-bg-card, #ffffff)" })
), St = () => g.createElement(
  "svg",
  { ...Z, width: 16, height: 16, viewBox: "0 0 20 20" },
  g.createElement("path", { d: "M2 4 L12 4 L16 10 L12 16 L2 16 Z", fill: "currentColor" }),
  g.createElement("circle", { cx: "6", cy: "10", r: "1.5", fill: "white" })
), Fe = () => g.createElement(
  "svg",
  { ...Z },
  g.createElement("path", { d: "M8 2c0 1.5-1 2.5-1 4s1 2.5 1 4", fill: "none", stroke: "currentColor", strokeWidth: "1.5", opacity: "0.6" }),
  g.createElement("path", { d: "M12 2c0 1.5-1 2.5-1 4s1 2.5 1 4", fill: "none", stroke: "currentColor", strokeWidth: "1.5", opacity: "0.6" }),
  g.createElement("path", { d: "M16 2c0 1.5-1 2.5-1 4s1 2.5 1 4", fill: "none", stroke: "currentColor", strokeWidth: "1.5", opacity: "0.6" }),
  g.createElement("path", { d: "M4 14c0-3 1.5-4 4-4s4 1 4 4v4c0 2-1 2-4 2s-4 0-4-2v-4z", fill: "none", stroke: "currentColor", strokeWidth: "2" }),
  g.createElement("ellipse", { cx: "8", cy: "14", rx: "4", ry: "1.5", fill: "currentColor", opacity: "0.3" }),
  g.createElement("circle", { cx: "17", cy: "18", r: "2", fill: "currentColor", opacity: "0.4" }),
  g.createElement("circle", { cx: "20", cy: "16", r: "1.5", fill: "currentColor", opacity: "0.4" })
);
function bt({ message: n, type: t = "info", duration: e = 3e3, onClose: a }) {
  const [s, r] = I(!1);
  te(() => {
    const i = setTimeout(() => {
      r(!0);
    }, 50), u = setTimeout(() => {
      r(!1), setTimeout(a, 500);
    }, e);
    return () => {
      clearTimeout(i), clearTimeout(u);
    };
  }, [e, a]);
  const o = () => {
    switch (t) {
      case "success":
        return g.createElement(
          "svg",
          { className: "toast__icon", width: "20", height: "20", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2" },
          g.createElement("path", { d: "M20 6L9 17l-5-5" })
        );
      case "error":
        return g.createElement(
          "svg",
          { className: "toast__icon", width: "20", height: "20", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2" },
          g.createElement("circle", { cx: "12", cy: "12", r: "10" }),
          g.createElement("line", { x1: "15", y1: "9", x2: "9", y2: "15" }),
          g.createElement("line", { x1: "9", y1: "9", x2: "15", y2: "15" })
        );
      case "warning":
        return g.createElement(
          "svg",
          { className: "toast__icon", width: "20", height: "20", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2" },
          g.createElement("path", { d: "M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" }),
          g.createElement("line", { x1: "12", y1: "9", x2: "12", y2: "13" }),
          g.createElement("line", { x1: "12", y1: "17", x2: "12.01", y2: "17" })
        );
      case "info":
      default:
        return g.createElement(
          "svg",
          { className: "toast__icon", width: "20", height: "20", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2" },
          g.createElement("circle", { cx: "12", cy: "12", r: "10" }),
          g.createElement("line", { x1: "12", y1: "16", x2: "12", y2: "12" }),
          g.createElement("line", { x1: "12", y1: "8", x2: "12.01", y2: "8" })
        );
    }
  };
  return g.createElement(
    "div",
    { className: `toast toast--${t} ${s ? "toast--visible" : ""}` },
    o(),
    g.createElement("span", { className: "toast__message" }, n)
  );
}
function Et({ toasts: n, onDismiss: t, position: e = "bottom-center" }) {
  return g.createElement("div", { className: `toast-container toast-container--${e}` }, n.map((a) => g.createElement(bt, { key: a.id, message: a.message, type: a.type, duration: a.duration, onClose: () => t(a.id) })));
}
let Ct = 0;
function xt() {
  const [n, t] = I([]), e = Te((r, o = "info", i = 3e3) => {
    const u = ++Ct;
    t((d) => [...d, { id: u, message: r, type: o, duration: i }]);
  }, []), a = Te((r) => {
    t((o) => o.filter((i) => i.id !== r));
  }, []), s = Te(() => {
    t([]);
  }, []);
  return {
    toasts: n,
    showToast: e,
    dismissToast: a,
    clearAll: s
  };
}
class le {
  constructor() {
    this.isAdmin = !1, this.prefix = "[UI]", this.isDevelopment = typeof window < "u" ? window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1" : !1, this.checkAdminStatus();
  }
  static getInstance() {
    return le.instance || (le.instance = new le()), le.instance;
  }
  /**
   * Check if current user has admin status in localStorage
   */
  checkAdminStatus() {
    typeof window > "u" || (this.isAdmin = localStorage.getItem("isAdmin") === "true");
  }
  /**
   * Set admin status (should be called after authentication)
   * Persists to localStorage
   */
  setAdminStatus(t) {
    this.isAdmin = t, typeof window < "u" && (localStorage.setItem("isAdmin", t ? "true" : "false"), t && console.log(`${this.prefix} Admin mode enabled - all logs visible`));
  }
  /**
   * Check if logging is enabled (development or admin)
   */
  shouldLog() {
    return this.isDevelopment || this.isAdmin;
  }
  /**
   * Format log message with timestamp and context
   */
  formatMessage(t, e, a) {
    const s = (/* @__PURE__ */ new Date()).toISOString(), r = a ? ` ${JSON.stringify(a)}` : "";
    return `${this.prefix} [${s}] [${t}] ${e}${r}`;
  }
  /**
   * Log error message (always shown)
   */
  error(t, e) {
    const a = this.formatMessage("ERROR", t, e);
    console.error(a);
  }
  /**
   * Log warning message (development or admin only)
   */
  warn(t, e) {
    if (!this.shouldLog())
      return;
    const a = this.formatMessage("WARN", t, e);
    console.warn(a);
  }
  /**
   * Log info message (development or admin only)
   */
  info(t, e) {
    if (!this.shouldLog())
      return;
    const a = this.formatMessage("INFO", t, e);
    console.log(a);
  }
  /**
   * Log debug message (development or admin only)
   */
  debug(t, e) {
    if (!this.shouldLog())
      return;
    const a = this.formatMessage("DEBUG", t, e);
    console.log(a);
  }
  /**
   * Log component lifecycle event (development or admin only)
   */
  component(t, e, a) {
    this.shouldLog() && this.debug(`Component ${e} ${t}`, a);
  }
  /**
   * Log theme change (development or admin only)
   */
  theme(t, e) {
    this.shouldLog() && this.info(`Theme changed: ${t}`, e);
  }
  /**
   * Log preference change (development or admin only)
   */
  preference(t, e) {
    this.shouldLog() && this.info(`Preference changed: ${t}`, { value: e });
  }
  /**
   * Log API request (development or admin only)
   */
  apiRequest(t, e, a) {
    this.shouldLog() && this.info(`API ${t} ${e}`, a);
  }
  /**
   * Log API response (development or admin only, errors always shown)
   */
  apiResponse(t, e, a, s) {
    a >= 400 ? this.error(`API ${t} ${e} failed with ${a}`, s) : this.shouldLog() && this.info(`API ${t} ${e} → ${a}`, s);
  }
  /**
   * Log fallback/retry (development or admin only)
   */
  fallback(t, e) {
    this.shouldLog() && this.warn(`FALLBACK: ${t}`, e);
  }
}
const c = le.getInstance(), X = `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
function Ee() {
  return localStorage.getItem("currentSessionId");
}
function ve(n) {
  localStorage.setItem("currentSessionId", n), c.info("[Session] Stored sessionId", { sessionId: n });
}
async function Dt(n, t) {
  const e = Ee();
  if (t === "public") {
    if (e)
      return c.info("[Session] Public user - using existing sessionId", { oldSessionId: e }), null;
    const a = `public-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    return ve(a), c.info("[Session] Public user - created stable sessionId", { publicSessionId: a }), null;
  }
  c.info("[Session] Performing handshake...", { oldSessionId: e, newSessionId: n, userType: t });
  try {
    const a = await fetch("/task/api/session/handshake", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-User-Type": t,
        "X-Session-Id": n
      },
      body: JSON.stringify({
        oldSessionId: e,
        newSessionId: n
      })
    });
    if (!a.ok)
      throw new Error(`Handshake failed: ${a.status}`);
    const s = await a.json();
    return c.info("[Session] Handshake successful", { data: s }), ve(n), s.preferences;
  } catch (a) {
    return c.error("[Session] Handshake failed", {
      error: a instanceof Error ? a.message : String(a)
    }), ve(n), null;
  }
}
function Bt(n, t) {
  if (!n) return;
  const e = [];
  for (let a = 0; a < localStorage.length; a++) {
    const s = localStorage.key(a);
    s && s.includes(`${t}-${n}-`) && e.push(s);
  }
  c.info("[Session] Clearing old storage keys", { count: e.length }), e.forEach((a) => {
    c.info("[Session] Removing key", { key: a }), localStorage.removeItem(a);
  });
}
class Nt {
  constructor(t = "public", e = "public") {
    this.userType = t, this.sessionId = e;
  }
  // --- Storage Keys ---
  // Note: Always use the userType from constructor, not the one passed to methods
  // This ensures data stays in the same localStorage location regardless of authContext
  getTasksKey(t, e, a) {
    return `${this.userType}-${e || this.sessionId}-${a || "main"}-tasks`;
  }
  getStatsKey(t, e, a) {
    return `${this.userType}-${e || this.sessionId}-${a || "main"}-stats`;
  }
  getBoardsKey(t, e) {
    return `${this.userType}-${e || this.sessionId}-boards`;
  }
  // --- Tasks Operations ---
  async getTasks(t, e, a) {
    const s = this.getTasksKey(t, e, a), r = localStorage.getItem(s);
    return r ? JSON.parse(r) : {
      version: 1,
      updatedAt: (/* @__PURE__ */ new Date()).toISOString(),
      tasks: []
    };
  }
  async saveTasks(t, e, a, s) {
    const r = this.getTasksKey(t, e, a);
    s.updatedAt = (/* @__PURE__ */ new Date()).toISOString(), localStorage.setItem(r, JSON.stringify(s));
  }
  // --- Stats Operations ---
  async getStats(t, e, a) {
    const s = this.getStatsKey(t, e, a), r = localStorage.getItem(s);
    return r ? JSON.parse(r) : {
      version: 2,
      updatedAt: (/* @__PURE__ */ new Date()).toISOString(),
      counters: {
        created: 0,
        completed: 0,
        edited: 0,
        deleted: 0
      },
      timeline: [],
      tasks: {}
    };
  }
  async saveStats(t, e, a, s) {
    const r = this.getStatsKey(t, e, a);
    s.updatedAt = (/* @__PURE__ */ new Date()).toISOString(), localStorage.setItem(r, JSON.stringify(s));
  }
  // --- Boards Operations ---
  async getBoards(t, e) {
    const a = this.getBoardsKey(t, e), s = localStorage.getItem(a);
    if (s)
      return JSON.parse(s);
    const r = {
      version: 1,
      updatedAt: (/* @__PURE__ */ new Date()).toISOString(),
      boards: [
        {
          id: "main",
          name: "Main",
          tasks: [],
          tags: []
        }
      ]
    };
    return await this.saveBoards(t, r, e), r;
  }
  async saveBoards(t, e, a) {
    const s = this.getBoardsKey(t, a);
    e.updatedAt = (/* @__PURE__ */ new Date()).toISOString(), localStorage.setItem(s, JSON.stringify(e));
  }
  // --- Cleanup Operations ---
  async deleteBoardData(t, e, a) {
    const s = this.getTasksKey(t, e, a), r = this.getStatsKey(t, e, a);
    localStorage.removeItem(s), localStorage.removeItem(r);
  }
}
function At() {
  const n = Date.now().toString(36).toUpperCase().padStart(8, "0"), t = crypto.getRandomValues(new Uint8Array(18)), e = Array.from(t).map((a) => (a % 36).toString(36).toUpperCase()).join("");
  return n + e;
}
function Xe(n, t) {
  const e = n.tasks.findIndex((a) => a.id === t);
  if (e < 0)
    throw new Error("Task not found");
  return { task: n.tasks[e], index: e };
}
function we(n, t) {
  const e = n.boards.findIndex((a) => a.id === t);
  if (e < 0)
    throw new Error(`Board ${t} not found`);
  return { board: n.boards[e], index: e };
}
function Ce(n, t, e, a) {
  return {
    ...n,
    updatedAt: a,
    boards: [
      ...n.boards.slice(0, t),
      e,
      ...n.boards.slice(t + 1)
    ]
  };
}
function Mt(n, t, e, a) {
  return {
    ...n,
    updatedAt: a,
    counters: {
      ...n.counters,
      [e]: n.counters[e] + 1
    },
    timeline: [...n.timeline, { t: a, event: e, id: t.id }],
    tasks: {
      ...n.tasks,
      [t.id]: { ...t }
    }
  };
}
function Ye(n, t, e, a) {
  const { task: s, index: r } = Xe(n, t), o = {
    ...s,
    state: e,
    closedAt: a,
    updatedAt: a
  }, i = [...n.tasks];
  return i.splice(r, 1), {
    updatedTasks: {
      ...n,
      tasks: i,
      updatedAt: a
    },
    closedTask: o
  };
}
async function ue(n, t, e, a) {
  const s = (/* @__PURE__ */ new Date()).toISOString(), [r, o] = await Promise.all([
    n.getTasks(t.userType, t.sessionId, e),
    n.getStats(t.userType, t.sessionId, e)
  ]), { updatedTasks: i, statsEvents: u, result: d } = a(r, o, s);
  let h = o;
  for (const { task: f, eventType: k } of u)
    h = Mt(h, f, k, s);
  return await Promise.all([
    n.saveTasks(t.userType, t.sessionId, e, i),
    n.saveStats(t.userType, t.sessionId, e, h)
  ]), d;
}
async function me(n, t, e) {
  const a = (/* @__PURE__ */ new Date()).toISOString(), s = await n.getBoards(t.userType, t.sessionId), { updatedBoards: r, result: o } = e(s, a);
  return await n.saveBoards(t.userType, r, t.sessionId), o;
}
async function It(n, t) {
  const e = await n.getBoards(t.userType, t.sessionId), a = await Promise.all(
    e.boards.map(async (s) => {
      const r = await n.getTasks(t.userType, t.sessionId, s.id), o = await n.getStats(t.userType, t.sessionId, s.id);
      return {
        ...s,
        tasks: r.tasks,
        stats: o
      };
    })
  );
  return {
    ...e,
    boards: a
  };
}
async function _t(n, t, e, a = "main") {
  return ue(n, t, a, (s, r, o) => {
    const i = e.id || At(), u = e.createdAt || o, d = {
      id: i,
      title: e.title,
      tag: e.tag ?? null,
      state: "Active",
      createdAt: u
    };
    return {
      updatedTasks: {
        ...s,
        tasks: [d, ...s.tasks],
        updatedAt: o
      },
      statsEvents: [{ task: d, eventType: "created" }],
      result: { ok: !0, id: i }
    };
  });
}
async function Lt(n, t, e, a, s = "main") {
  return ue(n, t, s, (r, o, i) => {
    const { task: u, index: d } = Xe(r, e), h = {
      ...u,
      ...a,
      updatedAt: i
    }, f = [...r.tasks];
    return f[d] = h, {
      updatedTasks: {
        ...r,
        tasks: f,
        updatedAt: i
      },
      statsEvents: [{ task: h, eventType: "edited" }],
      result: { ok: !0, message: `Task ${e} updated` }
    };
  });
}
async function Ot(n, t, e, a = "main") {
  return ue(n, t, a, (s, r, o) => {
    const { updatedTasks: i, closedTask: u } = Ye(s, e, "Completed", o);
    return {
      updatedTasks: i,
      statsEvents: [{ task: u, eventType: "completed" }],
      result: { ok: !0, message: `Task ${e} completed` }
    };
  });
}
async function $t(n, t, e, a = "main") {
  return ue(n, t, a, (s, r, o) => {
    const { updatedTasks: i, closedTask: u } = Ye(s, e, "Deleted", o);
    return {
      updatedTasks: i,
      statsEvents: [{ task: u, eventType: "deleted" }],
      result: { ok: !0, message: `Task ${e} deleted` }
    };
  });
}
async function Pt(n, t, e) {
  return me(n, t, (a, s) => {
    if (a.boards.find((i) => i.id === e.id))
      throw new Error(`Board ${e.id} already exists`);
    const r = {
      id: e.id,
      name: e.name,
      tasks: [],
      tags: []
    };
    return {
      updatedBoards: {
        ...a,
        updatedAt: s,
        boards: [...a.boards, r]
      },
      result: { ok: !0, board: r }
    };
  });
}
async function Ft(n, t, e) {
  if (e === "main")
    throw new Error("Cannot delete the main board");
  return me(n, t, (a, s) => (we(a, e), {
    updatedBoards: {
      ...a,
      updatedAt: s,
      boards: a.boards.filter((o) => o.id !== e)
    },
    result: { ok: !0, message: `Board ${e} deleted` }
  }));
}
async function Rt(n, t, e) {
  return me(n, t, (a, s) => {
    const { board: r, index: o } = we(a, e.boardId), i = r.tags || [];
    if (i.includes(e.tag))
      return {
        updatedBoards: a,
        // No changes needed
        result: { ok: !0, message: `Tag ${e.tag} already exists` }
      };
    const u = {
      ...r,
      tags: [...i, e.tag]
    };
    return {
      updatedBoards: Ce(a, o, u, s),
      result: { ok: !0, message: `Tag ${e.tag} added to board ${e.boardId}` }
    };
  });
}
async function Kt(n, t, e) {
  return me(n, t, (a, s) => {
    const { board: r, index: o } = we(a, e.boardId), i = r.tags || [], u = {
      ...r,
      tags: i.filter((d) => d !== e.tag)
    };
    return {
      updatedBoards: Ce(a, o, u, s),
      result: { ok: !0, message: `Tag ${e.tag} removed from board ${e.boardId}` }
    };
  });
}
async function Ut(n, t, e) {
  return ue(n, t, e.boardId, (a, s, r) => {
    let o = 0;
    const i = a.tasks.map((h) => {
      const f = e.updates.find((k) => k.taskId === h.id);
      return f ? (o++, {
        ...h,
        tag: f.tag || void 0,
        updatedAt: r
      }) : h;
    }), u = {
      ...a,
      tasks: i,
      updatedAt: r
    }, d = i.filter((h) => e.updates.find((f) => f.taskId === h.id)).map((h) => ({ task: h, eventType: "edited" }));
    return {
      updatedTasks: u,
      statsEvents: d,
      result: {
        ok: !0,
        message: `Updated ${o} task(s) on board ${e.boardId}`,
        updated: o
      }
    };
  });
}
async function Wt(n, t, e) {
  const a = await ue(
    n,
    t,
    e.boardId,
    (s, r, o) => {
      let i = 0;
      const u = s.tasks.map((f) => {
        if (e.taskIds.includes(f.id) && f.tag) {
          const v = f.tag.split(" ").filter(Boolean).filter((S) => S !== e.tag);
          return i++, {
            ...f,
            tag: v.length > 0 ? v.join(" ") : void 0,
            updatedAt: o
          };
        }
        return f;
      }), d = {
        ...s,
        tasks: u,
        updatedAt: o
      }, h = u.filter((f) => e.taskIds.includes(f.id)).map((f) => ({ task: f, eventType: "edited" }));
      return {
        updatedTasks: d,
        statsEvents: h,
        result: { clearedCount: i }
      };
    }
  );
  return await me(n, t, (s, r) => {
    const { board: o, index: i } = we(s, e.boardId), u = o.tags || [], d = {
      ...o,
      tags: u.filter((h) => h !== e.tag)
    };
    return {
      updatedBoards: Ce(s, i, d, r),
      result: { ok: !0 }
    };
  }), {
    ok: !0,
    message: `Cleared tag ${e.tag} from ${a.clearedCount} task(s) on board ${e.boardId}`,
    cleared: a.clearedCount
  };
}
function ee(n, t = {}, e = 50) {
  setTimeout(() => {
    try {
      const a = new BroadcastChannel("tasks");
      a.postMessage({ type: n, ...t }), a.close();
    } catch (a) {
      c.error("[broadcast] Failed to broadcast", {
        error: a instanceof Error ? a.message : String(a)
      });
    }
  }, e);
}
function Ht(n = "public", t = "public") {
  const e = new Nt(n, t), a = { userType: "registered", sessionId: t };
  return {
    async getBoards() {
      const s = await It(e, a), r = {
        version: s.version,
        updatedAt: s.updatedAt,
        boards: []
      };
      for (const o of s.boards) {
        const i = await e.getTasks(n, t, o.id), u = await e.getStats(n, t, o.id);
        r.boards.push({
          id: o.id,
          name: o.name,
          tasks: i.tasks,
          stats: u,
          tags: o.tags || []
        });
      }
      return r;
    },
    async createBoard(s) {
      c.info("[localStorageApi] createBoard (using handler)", { userType: n, sessionId: t, boardId: s });
      const r = await Pt(e, a, {
        id: s,
        name: s
      });
      return await e.saveTasks(n, t, s, {
        version: 1,
        updatedAt: (/* @__PURE__ */ new Date()).toISOString(),
        tasks: []
      }), await e.saveStats(n, t, s, {
        version: 2,
        updatedAt: (/* @__PURE__ */ new Date()).toISOString(),
        counters: { created: 0, completed: 0, edited: 0, deleted: 0 },
        timeline: [],
        tasks: {}
      }), ee("boards-updated", { sessionId: X, userType: n }), r.board;
    },
    async deleteBoard(s) {
      await Ft(e, a, s), await e.deleteBoardData(n, t, s), ee("boards-updated", { sessionId: X, userType: n });
    },
    async getTasks(s = "main") {
      return e.getTasks(n, t, s);
    },
    async getStats(s = "main") {
      return e.getStats(n, t, s);
    },
    async createTask(s, r = "main", o = !1) {
      c.info("[localStorageApi] createTask (using handler)", {
        data: s,
        boardId: r,
        suppressBroadcast: o
      });
      const i = await _t(e, a, s, r), d = (await e.getTasks(n, t, r)).tasks.find((h) => h.id === i.id);
      if (!d)
        throw new Error("Task creation failed - task not found after creation");
      return o ? c.info("[localStorageApi] createTask: broadcast suppressed") : (c.info("[localStorageApi] createTask: broadcasting", {
        sessionId: X,
        boardId: r,
        taskId: i.id
      }), ee("tasks-updated", { sessionId: X, userType: n, boardId: r })), d;
    },
    async patchTask(s, r, o = "main", i = !1) {
      const u = {};
      r.title !== void 0 && (u.title = r.title), r.tag !== void 0 && r.tag !== null && (u.tag = r.tag), await Lt(e, a, s, u, o), i || ee("tasks-updated", { sessionId: X, userType: n, boardId: o });
      const h = (await e.getTasks(n, t, o)).tasks.find((f) => f.id === s);
      if (!h)
        throw new Error("Task not found after update");
      return h;
    },
    async completeTask(s, r = "main") {
      const i = (await e.getTasks(n, t, r)).tasks.find((u) => u.id === s);
      if (!i)
        throw new Error("Task not found");
      return await Ot(e, a, s, r), ee("tasks-updated", { sessionId: X, userType: n, boardId: r }), {
        ...i,
        state: "Completed",
        closedAt: (/* @__PURE__ */ new Date()).toISOString(),
        updatedAt: (/* @__PURE__ */ new Date()).toISOString()
      };
    },
    async deleteTask(s, r = "main", o = !1) {
      c.info("[localStorageApi] deleteTask (using handler)", {
        id: s,
        boardId: r,
        suppressBroadcast: o
      });
      const u = (await e.getTasks(n, t, r)).tasks.find((d) => d.id === s);
      if (!u)
        throw new Error("Task not found");
      return await $t(e, a, s, r), o ? c.info("[localStorageApi] deleteTask: broadcast suppressed") : (c.info("[localStorageApi] deleteTask: broadcasting", { sessionId: X }), ee("tasks-updated", { sessionId: X, userType: n, boardId: r })), {
        ...u,
        state: "Deleted",
        closedAt: (/* @__PURE__ */ new Date()).toISOString(),
        updatedAt: (/* @__PURE__ */ new Date()).toISOString()
      };
    },
    async createTag(s, r = "main") {
      await Rt(e, a, { boardId: r, tag: s }), ee("boards-updated", { sessionId: X, userType: n, boardId: r });
    },
    async deleteTag(s, r = "main") {
      await Kt(e, a, { boardId: r, tag: s }), ee("boards-updated", { sessionId: X, userType: n, boardId: r });
    },
    // User preferences (includes device-specific settings like theme)
    async getPreferences() {
      const s = `${n}-${t}-preferences`, r = localStorage.getItem(s);
      if (r)
        return JSON.parse(r);
      const o = typeof window < "u" && window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
      return {
        version: 1,
        updatedAt: (/* @__PURE__ */ new Date()).toISOString(),
        theme: o ? "dark" : "light",
        showCompleteButton: !0,
        showDeleteButton: !0,
        showTagButton: !1
      };
    },
    async savePreferences(s) {
      const r = `${n}-${t}-preferences`, i = {
        ...await this.getPreferences(),
        ...s,
        version: 1,
        updatedAt: (/* @__PURE__ */ new Date()).toISOString()
      };
      localStorage.setItem(r, JSON.stringify(i));
    },
    // Batch operations
    async batchMoveTasks(s, r, o) {
      const i = await this.getBoards(), u = i.boards.find((S) => S.id === s), d = i.boards.find((S) => S.id === r);
      if (!u)
        throw new Error(`Source board ${s} not found`);
      if (!d)
        throw new Error(`Target board ${r} not found`);
      const h = u.tasks.filter((S) => o.includes(S.id));
      u.tasks = u.tasks.filter((S) => !o.includes(S.id)), d.tasks = [...d.tasks, ...h], i.updatedAt = (/* @__PURE__ */ new Date()).toISOString();
      const f = `${n}-${t}-boards`;
      localStorage.setItem(f, JSON.stringify(i));
      const k = `${n}-${t}-${s}-tasks`, v = `${n}-${t}-${r}-tasks`;
      return localStorage.setItem(
        k,
        JSON.stringify({
          version: 1,
          updatedAt: i.updatedAt,
          tasks: u.tasks
        })
      ), localStorage.setItem(
        v,
        JSON.stringify({
          version: 1,
          updatedAt: i.updatedAt,
          tasks: d.tasks
        })
      ), ee("boards-updated", { sessionId: X, userType: n }), { ok: !0, moved: h.length };
    },
    async batchUpdateTags(s, r) {
      c.info("[localStorageApi] batchUpdateTags", { boardId: s, updates: r }), await Ut(e, a, { boardId: s, updates: r }), ee("tasks-updated", { sessionId: X, userType: n, boardId: s });
    },
    async batchClearTag(s, r, o) {
      c.info("[localStorageApi] batchClearTag START", {
        boardId: s,
        tag: r,
        taskIds: o,
        taskCount: o.length
      });
      const i = await Wt(e, a, {
        boardId: s,
        tag: r,
        taskIds: o
      });
      c.info("[localStorageApi] batchClearTag result", { result: i }), ee("boards-updated", { sessionId: X, userType: n, boardId: s }), c.info("[localStorageApi] batchClearTag END");
    },
    // User Management (localStorage only - no-op for validation)
    async validateKey(s) {
      return !s || s.length < 10 ? (c.warn("[localStorageApi] validateKey: Key too short (must be at least 10 characters)"), !1) : !0;
    },
    async setUserId(s) {
      return { ok: !0 };
    }
  };
}
async function Jt(n, t, e, a) {
  for (const o of t.boards || []) {
    const i = o.id;
    if (o.tasks && o.tasks.length > 0) {
      const u = `${e}-${a}-${i}-tasks`, d = {
        version: 1,
        updatedAt: t.updatedAt || (/* @__PURE__ */ new Date()).toISOString(),
        tasks: o.tasks
      };
      window.localStorage.setItem(u, JSON.stringify(d));
    }
    if (o.stats) {
      const u = `${e}-${a}-${i}-stats`;
      window.localStorage.setItem(u, JSON.stringify(o.stats));
    }
  }
  const s = `${e}-${a}-boards`, r = {
    version: 1,
    updatedAt: t.updatedAt || (/* @__PURE__ */ new Date()).toISOString(),
    boards: (t.boards || []).map((o) => ({
      id: o.id,
      name: o.name,
      tags: o.tags || []
    }))
  };
  window.localStorage.setItem(s, JSON.stringify(r)), c.info("[api] Synced API data to localStorage", {
    boards: t.boards?.length || 0,
    totalTasks: t.boards?.reduce((o, i) => o + (i.tasks?.length || 0), 0) || 0
  });
}
function G(n, t) {
  const e = {
    "Content-Type": "application/json",
    "X-User-Type": n
  };
  return t && (e["X-Session-Id"] = t), e;
}
function de(n = "public", t = "public") {
  const e = Ht(n, t);
  return n === "public" ? e : {
    // Get boards - returns localStorage immediately (optimistic)
    async getBoards() {
      return await e.getBoards();
    },
    // Sync from API - called once on initial page load to get server state
    async syncFromApi() {
      try {
        c.info("[api] Syncing from API...");
        const a = await fetch(
          `/task/api/boards?userType=${n}&sessionId=${encodeURIComponent(t)}`,
          {
            headers: G(n, t)
          }
        );
        if (!a.ok)
          throw new Error(`API returned ${a.status}`);
        const s = await a.json();
        if (!s || !s.boards || !Array.isArray(s.boards)) {
          c.error("[api] Invalid response structure", { apiData: s });
          return;
        }
        c.info("[api] Synced from API", {
          boards: s.boards.length,
          totalTasks: s.boards.reduce((r, o) => r + (o.tasks?.length || 0), 0)
        }), await Jt(e, s, n, t);
      } catch (a) {
        c.error("[api] Sync from API failed", {
          error: a instanceof Error ? a.message : String(a)
        });
      }
    },
    async createTask(a, s = "main", r = !1) {
      const o = await e.createTask(a, s, r);
      return fetch("/task/api", {
        method: "POST",
        headers: G(n, t),
        body: JSON.stringify({
          id: a.id || o.id,
          // Use provided ID (for moves) or client-generated ID
          ...a,
          boardId: s
        })
      }).then((i) => i.json()).then((i) => {
        i.ok && (i.id === o.id ? c.info("[api] Background sync: createTask completed (ID matched)") : c.warn("[api] Server returned different ID (unexpected)", {
          client: o.id,
          server: i.id
        }));
      }).catch(
        (i) => c.error("[api] Failed to sync createTask", {
          error: i instanceof Error ? i.message : String(i)
        })
      ), o;
    },
    async createTag(a, s = "main") {
      const r = await e.createTag(a, s);
      return fetch("/task/api/tags", {
        method: "POST",
        headers: G(n, t),
        body: JSON.stringify({ boardId: s, tag: a })
      }).then(() => c.info("[api] Background sync: createTag completed")).catch(
        (o) => c.error("[api] Failed to sync createTag", {
          error: o instanceof Error ? o.message : String(o)
        })
      ), r;
    },
    async deleteTag(a, s = "main") {
      const r = await e.deleteTag(a, s);
      return fetch("/task/api/tags/delete", {
        method: "POST",
        headers: G(n, t),
        body: JSON.stringify({ boardId: s, tag: a })
      }).then(() => c.info("[api] Background sync: deleteTag completed")).catch(
        (o) => c.error("[api] Failed to sync deleteTag", {
          error: o instanceof Error ? o.message : String(o)
        })
      ), r;
    },
    async patchTask(a, s, r = "main", o = !1) {
      const i = await e.patchTask(a, s, r, o);
      return fetch(`/task/api/${a}`, {
        method: "PATCH",
        headers: G(n, t),
        body: JSON.stringify({ ...s, boardId: r })
      }).then(() => c.info("[api] Background sync: patchTask completed")).catch(
        (u) => c.error("[api] Failed to sync patchTask", {
          error: u instanceof Error ? u.message : String(u)
        })
      ), i;
    },
    async completeTask(a, s = "main") {
      const r = await e.completeTask(a, s);
      return fetch(`/task/api/${a}/complete`, {
        method: "POST",
        headers: G(n, t),
        body: JSON.stringify({ boardId: s })
      }).then((o) => {
        if (!o.ok) throw new Error(`HTTP ${o.status}`);
        c.info("[api] Background sync: completeTask completed");
      }).catch(
        (o) => c.error("[api] Failed to sync completeTask", {
          error: o instanceof Error ? o.message : String(o)
        })
      ), r;
    },
    async deleteTask(a, s = "main", r = !1) {
      await e.deleteTask(a, s, r), fetch(`/task/api/${a}`, {
        method: "DELETE",
        headers: G(n, t),
        body: JSON.stringify({ boardId: s })
      }).then((o) => {
        if (!o.ok) throw new Error(`HTTP ${o.status}`);
        c.info("[api] Background sync: deleteTask completed");
      }).catch(
        (o) => c.error("[api] Failed to sync deleteTask", {
          error: o instanceof Error ? o.message : String(o)
        })
      );
    },
    // Board operations
    async createBoard(a) {
      const s = await e.createBoard(a);
      return fetch("/task/api/boards", {
        method: "POST",
        headers: G(n, t),
        body: JSON.stringify({ id: a, name: a })
      }).then(() => c.info("[api] Background sync: createBoard completed")).catch(
        (r) => c.error("[api] Failed to sync createBoard", {
          error: r instanceof Error ? r.message : String(r)
        })
      ), s;
    },
    async deleteBoard(a) {
      const s = await e.deleteBoard(a);
      return fetch(`/task/api/boards/${encodeURIComponent(a)}`, {
        method: "DELETE",
        headers: G(n, t)
      }).then(() => c.info("[api] Background sync: deleteBoard completed")).catch(
        (r) => c.error("[api] Failed to sync deleteBoard", {
          error: r instanceof Error ? r.message : String(r)
        })
      ), s;
    },
    // User preferences
    async getPreferences() {
      if (n !== "public")
        try {
          const a = await fetch("/task/api/preferences", {
            headers: G(n, t)
          });
          if (a.ok) {
            const s = await a.json();
            return c.info("[api] Fetched preferences from server", { serverPrefs: s }), await e.savePreferences(s), s;
          }
        } catch (a) {
          c.warn("[api] Failed to fetch preferences from server, using localStorage", {
            error: a instanceof Error ? a.message : String(a)
          });
        }
      return await e.getPreferences();
    },
    async savePreferences(a) {
      await e.savePreferences(a), n !== "public" && fetch("/task/api/preferences", {
        method: "PUT",
        headers: G(n, t),
        body: JSON.stringify(a)
      }).then(() => c.info("[api] Background sync: savePreferences completed")).catch(
        (s) => c.error("[api] Failed to sync savePreferences", {
          error: s instanceof Error ? s.message : String(s)
        })
      );
    },
    // Batch operations
    async batchUpdateTags(a, s) {
      await e.batchUpdateTags(a, s), fetch("/task/api/batch-tag", {
        method: "PATCH",
        headers: G(n, t),
        body: JSON.stringify({ boardId: a, updates: s })
      }).then(() => c.info("[api] Background sync: batchUpdateTags completed")).catch(
        (r) => c.error("[api] Failed to sync batchUpdateTags", {
          error: r instanceof Error ? r.message : String(r)
        })
      );
    },
    async batchMoveTasks(a, s, r) {
      const o = await e.batchMoveTasks(a, s, r);
      return fetch("/task/api/batch-move", {
        method: "POST",
        headers: G(n, t),
        body: JSON.stringify({ sourceBoardId: a, targetBoardId: s, taskIds: r })
      }).then(() => c.info("[api] Background sync: batchMoveTasks completed")).catch(
        (i) => c.error("[api] Failed to sync batchMoveTasks", {
          error: i instanceof Error ? i.message : String(i)
        })
      ), o;
    },
    async batchClearTag(a, s, r) {
      await e.batchClearTag(a, s, r), fetch("/task/api/batch-clear-tag", {
        method: "POST",
        headers: G(n, t),
        body: JSON.stringify({ boardId: a, tag: s, taskIds: r })
      }).then(() => c.info("[api] Background sync: batchClearTag completed")).catch(
        (o) => c.error("[api] Failed to sync batchClearTag", {
          error: o instanceof Error ? o.message : String(o)
        })
      );
    },
    // User Management
    async validateKey(a) {
      try {
        return (await fetch("/task/api/validate-key", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ key: a })
        })).ok;
      } catch (s) {
        return c.error("[api] Failed to validate key", {
          error: s instanceof Error ? s.message : String(s)
        }), !1;
      }
    }
  };
}
function Vt(n) {
  n = n.trim();
  const t = (s) => s.trim().replace(/\s+/g, "-"), e = n.match(/^["']([^"']+)["']\s*(.*)$/);
  if (e) {
    const s = e[1].trim(), o = e[2].match(/#[^\s#]+/g)?.map((i) => t(i.slice(1))).filter(Boolean) || [];
    return { title: s, tag: o.length ? o.join(" ") : void 0 };
  }
  const a = n.match(/^(.+?)\s+(#.+)$/);
  if (a) {
    const s = a[1].trim(), o = a[2].match(/#[^\s#]+/g)?.map((i) => t(i.slice(1))).filter(Boolean) || [];
    return { title: s, tag: o.length ? o.join(" ") : void 0 };
  }
  return { title: n.trim() };
}
function jt(n, t = 6, e = []) {
  const a = n.flatMap((r) => r.tag?.split(" ") || []).filter(Boolean), s = {};
  return a.forEach((r) => s[r] = (s[r] || 0) + 1), e.filter(Boolean).forEach((r) => {
    s[r] || (s[r] = 0);
  }), Object.entries(s).sort((r, o) => o[1] - r[1]).slice(0, t).map(([r]) => r);
}
function Re(n, t) {
  return n.filter((e) => e.tag?.split(" ").includes(t));
}
function zt(n, t, e) {
  const a = Array.isArray(e) && e.length > 0;
  return n.filter((s) => {
    const r = s.tag?.split(" ") || [];
    return !a || !e ? !t.some((o) => r.includes(o)) : e.some((i) => r.includes(i)) && !t.some((i) => r.includes(i));
  });
}
function Ge(n) {
  return Array.from(new Set(n.flatMap((t) => t.tag?.split(" ") || []).filter(Boolean)));
}
async function Ke(n, t, e, a, s = {}) {
  const { onError: r, suppress404: o = !0 } = s;
  if (t.has(n)) {
    c.info("[withPendingOperation] Operation already pending", { operationKey: n });
    return;
  }
  e((i) => /* @__PURE__ */ new Set([...i, n]));
  try {
    return await a();
  } catch (i) {
    const u = i instanceof Error ? i.message : String(i);
    o && u.includes("404") || (r ? r(i) : c.error("[withPendingOperation] Error in operation", {
      operationKey: n,
      error: u
    }));
    return;
  } finally {
    e((i) => {
      const u = new Set(i);
      return u.delete(n), u;
    });
  }
}
function fe(n, t) {
  const e = n?.boards?.find((a) => a.id === t);
  return e ? (c.info("[extractBoardTasks] Found board", {
    boardId: t,
    taskCount: e.tasks?.length || 0
  }), {
    tasks: (e.tasks || []).filter((a) => a.state === "Active"),
    foundBoard: !0
  }) : (c.info("[extractBoardTasks] Board not found", { boardId: t }), {
    tasks: [],
    foundBoard: !1
  });
}
function qt({ userType: n, sessionId: t }) {
  const [e, a] = I([]), [s, r] = I(/* @__PURE__ */ new Set()), o = be(
    () => de(n, t || "public"),
    [n, t]
  ), [i, u] = I(null), [d, h] = I("main");
  async function f() {
    c.info("[useTasks] initialLoad called"), "syncFromApi" in o && await o.syncFromApi(), await k();
  }
  async function k() {
    c.info("[useTasks] reload called", {
      currentBoardId: d,
      stack: new Error().stack?.split(`
`).slice(1, 4).join(`
`)
    });
    const T = await o.getBoards();
    u(T);
    const { tasks: E } = fe(T, d);
    a(E);
  }
  te(() => {
    c.info("[useTasks] User context changed, clearing state and reloading", {
      userType: n,
      sessionId: t
    }), a([]), r(/* @__PURE__ */ new Set()), u(null), h("main"), k();
  }, [n, t]), te(() => {
    c.info("[useTasks] Setting up BroadcastChannel listener", {
      currentBoardId: d,
      userType: n,
      sessionId: t
    });
    try {
      const T = new BroadcastChannel("tasks");
      return T.onmessage = (E) => {
        const x = E.data || {};
        if (c.info("[useTasks] BroadcastChannel message received", {
          msg: x,
          sessionId: X,
          currentBoardId: d,
          currentContext: { userType: n, sessionId: t }
        }), x.sessionId === X) {
          c.info("[useTasks] Ignoring own broadcast message");
          return;
        }
        if (x.userType !== n || x.sessionId !== t) {
          c.info("[useTasks] Ignoring message for different user context", {
            msgContext: { userType: x.userType, sessionId: x.sessionId },
            currentContext: { userType: n, sessionId: t }
          });
          return;
        }
        (x.type === "tasks-updated" || x.type === "boards-updated") && (c.info("[useTasks] BroadcastChannel: triggering reload for currentBoardId", {
          currentBoardId: d
        }), k());
      }, () => {
        c.info("[useTasks] Cleaning up BroadcastChannel listener", { currentBoardId: d }), T.close();
      };
    } catch (T) {
      c.error("[useTasks] Failed to setup BroadcastChannel", {
        error: T instanceof Error ? T.message : String(T)
      });
    }
  }, [d, n, t]);
  async function v(T) {
    if (T = T.trim(), !!T)
      try {
        const E = Vt(T);
        return await o.createTask(E, d), await k(), !0;
      } catch (E) {
        return alert(E.message || "Failed to create task"), !1;
      }
  }
  async function S(T) {
    await Ke(
      `complete-${T}`,
      s,
      r,
      async () => {
        await o.completeTask(T, d), await k();
      },
      {
        onError: (E) => alert(E.message || "Failed to complete task")
      }
    );
  }
  async function _(T) {
    c.info("[useTasks] deleteTask START", { taskId: T, currentBoardId: d }), await Ke(
      `delete-${T}`,
      s,
      r,
      async () => {
        c.info("[useTasks] deleteTask: calling api.deleteTask", { taskId: T, currentBoardId: d }), await o.deleteTask(T, d), c.info("[useTasks] deleteTask: calling reload"), await k(), c.info("[useTasks] deleteTask END");
      },
      {
        onError: (E) => alert(E.message || "Failed to delete task")
      }
    );
  }
  async function D(T) {
    const E = prompt("Enter tag (without #):");
    if (!E) return;
    const x = E.trim().replace(/^#+/, "").replace(/\s+/g, "-"), p = e.find((M) => M.id === T);
    if (!p) return;
    const y = p.tag?.split(" ") || [];
    if (y.includes(x)) return;
    const B = [...y, x].join(" ");
    try {
      await o.patchTask(T, { tag: B }, d), await k();
    } catch (M) {
      alert(M.message || "Failed to add tag");
    }
  }
  async function j(T, E, x = {}) {
    const { suppressBroadcast: p = !1, skipReload: y = !1 } = x;
    await o.patchTask(T, E, d, p), y || await k();
  }
  async function F(T) {
    c.info("[useTasks] bulkUpdateTaskTags START", { count: T.length });
    try {
      await o.batchUpdateTags(
        d,
        T.map((E) => ({ taskId: E.taskId, tag: E.tag || null }))
      ), c.info("[useTasks] bulkUpdateTaskTags: calling reload"), await k(), c.info("[useTasks] bulkUpdateTaskTags END");
    } catch (E) {
      throw c.error("[useTasks] bulkUpdateTaskTags ERROR", {
        error: E instanceof Error ? E.message : String(E)
      }), E;
    }
  }
  async function H(T) {
    c.info("[useTasks] deleteTag START", { tag: T, currentBoardId: d, taskCount: e.length });
    const E = e.filter((x) => x.tag?.split(" ").includes(T));
    if (c.info("[useTasks] deleteTag: found tasks with tag", { tag: T, count: E.length }), E.length === 0) {
      c.info("[useTasks] deleteTag: no tasks found with this tag, just deleting tag");
      try {
        await o.deleteTag(T, d), await k(), c.info("[useTasks] deleteTag END (no tasks to clear)");
      } catch (x) {
        c.error("[useTasks] deleteTag ERROR", {
          error: x instanceof Error ? x.message : String(x)
        }), c.error("[useTasks] deleteTag: Please fix this error", {
          errorMessage: x.message
        });
      }
      return;
    }
    try {
      c.info("[useTasks] deleteTag: starting batch clear"), await o.batchClearTag(
        d,
        T,
        E.map((x) => x.id)
      ), c.info("[useTasks] deleteTag: calling reload"), await k(), c.info("[useTasks] deleteTag END");
    } catch (x) {
      c.error("[useTasks] deleteTag ERROR", {
        error: x instanceof Error ? x.message : String(x)
      }), alert(x.message || "Failed to remove tag from tasks");
    }
  }
  async function z(T) {
    await o.createBoard(T), h(T);
    const E = await o.getBoards();
    u(E);
    const { tasks: x } = fe(E, T);
    a(x);
  }
  async function J(T, E) {
    if (c.info("[useTasks] moveTasksToBoard START", { targetBoardId: T, ids: E, currentBoardId: d }), !i) return;
    const x = /* @__PURE__ */ new Set();
    for (const p of i.boards)
      for (const y of p.tasks || [])
        E.includes(y.id) && x.add(p.id);
    c.info("[useTasks] moveTasksToBoard: source boards", {
      sourceBoardIds: Array.from(x)
    });
    try {
      if (x.size === 1) {
        const B = Array.from(x)[0];
        c.info("[useTasks] moveTasksToBoard: using batch API"), await o.batchMoveTasks(B, T, E);
      } else
        throw c.error("[useTasks] moveTasksToBoard: Cannot move tasks from multiple boards at once"), new Error("Cannot move tasks from multiple boards at once");
      c.info("[useTasks] moveTasksToBoard: switching to target board", { targetBoardId: T }), h(T);
      const p = await o.getBoards();
      u(p);
      const { tasks: y } = fe(p, T);
      a(y), c.info("[useTasks] moveTasksToBoard END");
    } catch (p) {
      c.error("[useTasks] moveTasksToBoard ERROR", {
        error: p instanceof Error ? p.message : String(p)
      }), alert(p.message || "Failed to move tasks");
    }
  }
  async function q(T) {
    if (await o.deleteBoard(T), d === T) {
      h("main");
      const E = await o.getBoards();
      u(E);
      const { tasks: x } = fe(E, "main");
      a(x);
    } else
      await k();
  }
  async function re(T) {
    await o.createTag(T, d), await k();
  }
  async function ie(T) {
    await o.deleteTag(T, d), await k();
  }
  function ae(T) {
    h(T);
    const { tasks: E, foundBoard: x } = fe(i, T);
    x ? a(E) : k();
  }
  return {
    // Task state
    tasks: e,
    pendingOperations: s,
    // Task operations
    addTask: v,
    completeTask: S,
    deleteTask: _,
    addTagToTask: D,
    updateTaskTags: j,
    bulkUpdateTaskTags: F,
    deleteTag: H,
    // Board state
    boards: i,
    currentBoardId: d,
    // Board operations
    createBoard: z,
    deleteBoard: q,
    switchBoard: ae,
    moveTasksToBoard: J,
    createTagOnBoard: re,
    deleteTagOnBoard: ie,
    // Lifecycle
    initialLoad: f,
    reload: k
  };
}
function Xt({ tasks: n, onTaskUpdate: t, onBulkUpdate: e }) {
  const [a, s] = I(null), [r, o] = I(null), [i, u] = I(/* @__PURE__ */ new Set()), [d, h] = I(!1), [f, k] = I(null), [v, S] = I(null), _ = ye(null);
  function D(p) {
    let y = [];
    try {
      const B = p.dataTransfer.getData("application/x-hadoku-task-ids");
      B && (y = JSON.parse(B));
    } catch {
    }
    if (y.length === 0) {
      const B = p.dataTransfer.getData("text/plain");
      B && (y = [B]);
    }
    return y;
  }
  function j(p, y) {
    const B = i.has(y) && i.size > 0 ? Array.from(i) : [y];
    c.info("[useDragAndDrop] onDragStart", {
      taskId: y,
      idsToDrag: B,
      selectedCount: i.size
    }), p.dataTransfer.setData("text/plain", B[0]);
    try {
      p.dataTransfer.setData("application/x-hadoku-task-ids", JSON.stringify(B));
    } catch {
    }
    p.dataTransfer.effectAllowed = "copyMove";
    try {
      const M = p.currentTarget, N = M.closest && M.closest(".task-app__item") ? M.closest(".task-app__item") : M;
      N.classList.add("dragging");
      const A = N.cloneNode(!0);
      A.style.boxSizing = "border-box", A.style.width = `${N.offsetWidth}px`, A.style.height = `${N.offsetHeight}px`, A.style.opacity = "0.95", A.style.transform = "none", A.style.filter = "drop-shadow(0 6px 18px rgba(0,0,0,0.12))", A.classList.add("drag-image"), A.style.position = "absolute", A.style.top = "-9999px", A.style.left = "-9999px", document.body.appendChild(A), N.__dragImage = A, u((R) => {
        if (R.has(y)) return new Set(R);
        const U = new Set(R);
        return U.add(y), U;
      });
      try {
        const R = N.closest(".task-app__tag-column");
        if (R) {
          const U = R.querySelector(".task-app__tag-header") || R.querySelector("h3"), K = (U && U.textContent || "").trim().replace(/^#/, "");
          if (K)
            try {
              p.dataTransfer.setData("application/x-hadoku-task-source", K);
            } catch {
            }
        }
      } catch {
      }
      try {
        const R = N.getBoundingClientRect(), U = p;
        let b = Math.round(U.clientX - R.left), K = Math.round(U.clientY - R.top);
        b = Math.max(0, Math.min(Math.round(A.offsetWidth - 1), b)), K = Math.max(0, Math.min(Math.round(A.offsetHeight - 1), K)), p.dataTransfer.setDragImage(A, b, K);
      } catch {
        p.dataTransfer.setDragImage(A, 0, 0);
      }
    } catch {
    }
  }
  function F(p) {
    try {
      const y = p.currentTarget;
      y.classList.remove("dragging");
      const B = y.__dragImage;
      B?.parentNode && B.parentNode.removeChild(B), B && delete y.__dragImage;
    } catch {
    }
    try {
      q();
    } catch {
    }
  }
  function H(p) {
    if (p.button === 0) {
      try {
        const y = p.target;
        if (!y || y.closest && y.closest(".task-app__item, .task-app__controls, button, input, textarea, .task-app__item-actions"))
          return;
      } catch {
      }
      h(!0), _.current = { x: p.clientX, y: p.clientY }, k({ x: p.clientX, y: p.clientY, w: 0, h: 0 }), u(/* @__PURE__ */ new Set());
      try {
        document.body.classList.add("marquee-selecting");
      } catch {
      }
    }
  }
  function z(p) {
    if (!d || !_.current) return;
    const y = _.current.x, B = _.current.y, M = p.clientX, N = p.clientY, A = Math.min(y, M), R = Math.min(B, N), U = Math.abs(M - y), b = Math.abs(N - B);
    k({ x: A, y: R, w: U, h: b });
    const K = Array.from(document.querySelectorAll(".task-app__item")), P = /* @__PURE__ */ new Set();
    for (const V of K) {
      const Q = V.getBoundingClientRect();
      if (!(Q.right < A || Q.left > A + U || Q.bottom < R || Q.top > R + b)) {
        const oe = V.getAttribute("data-task-id");
        oe && P.add(oe), V.classList.add("selected");
      } else
        V.classList.remove("selected");
    }
    u(P);
  }
  function J(p) {
    h(!1), k(null), _.current = null;
    try {
      document.body.classList.remove("marquee-selecting");
    } catch {
    }
    try {
      S(Date.now());
    } catch {
    }
  }
  function q() {
    u(/* @__PURE__ */ new Set()), Array.from(document.querySelectorAll(".task-app__item.selected")).forEach((y) => y.classList.remove("selected"));
  }
  te(() => {
    function p(M) {
      if (M.button !== 0) return;
      const N = {
        target: M.target,
        clientX: M.clientX,
        clientY: M.clientY,
        button: M.button
      };
      try {
        H(N);
      } catch {
      }
    }
    function y(M) {
      const N = { clientX: M.clientX, clientY: M.clientY };
      try {
        z(N);
      } catch {
      }
    }
    function B(M) {
      const N = { clientX: M.clientX, clientY: M.clientY };
      try {
        J(N);
      } catch {
      }
    }
    return document.addEventListener("mousedown", p), document.addEventListener("mousemove", y), document.addEventListener("mouseup", B), () => {
      document.removeEventListener("mousedown", p), document.removeEventListener("mousemove", y), document.removeEventListener("mouseup", B);
    };
  }, []);
  function re(p, y) {
    p.preventDefault(), p.dataTransfer.dropEffect = "copy", s(y);
  }
  function ie(p) {
    p.currentTarget.contains(p.relatedTarget) || s(null);
  }
  async function ae(p, y) {
    p.preventDefault(), s(null), c.info("[useDragAndDrop] onDrop START", { targetTag: y });
    const B = D(p);
    if (B.length === 0) return;
    let M = null;
    try {
      const A = p.dataTransfer.getData("application/x-hadoku-task-source");
      A && (M = A);
    } catch {
    }
    c.info("[useDragAndDrop] onDrop: processing", {
      targetTag: y,
      ids: B,
      srcTag: M,
      taskCount: B.length
    });
    const N = [];
    for (const A of B) {
      const R = n.find((V) => V.id === A);
      if (!R) continue;
      const U = R.tag?.split(" ").filter(Boolean) || [];
      if (y === "other") {
        if (U.length === 0) continue;
        N.push({ taskId: A, tag: "" });
        continue;
      }
      const b = U.includes(y);
      let K = U.slice();
      b || K.push(y), M && M !== y && (K = K.filter((V) => V !== M));
      const P = K.join(" ").trim();
      N.push({ taskId: A, tag: P });
    }
    c.info("[useDragAndDrop] onDrop: updating tasks", { updateCount: N.length });
    try {
      await e(N), c.info("[useDragAndDrop] onDrop: updates complete, clearing selection");
      try {
        q();
      } catch {
      }
    } catch (A) {
      c.error("[useDragAndDrop] Failed to add tag to one or more tasks", {
        error: A instanceof Error ? A.message : String(A)
      }), alert(A.message || "Failed to add tags");
    }
    c.info("[useDragAndDrop] onDrop END");
  }
  function T(p, y) {
    p.preventDefault(), p.dataTransfer.dropEffect = "copy", o(y);
  }
  function E(p) {
    p.currentTarget.contains(p.relatedTarget) || o(null);
  }
  async function x(p, y) {
    p.preventDefault(), o(null);
    const B = D(p);
    if (B.length === 0) return;
    c.info("[useDragAndDrop] onFilterDrop", { filterTag: y, ids: B, taskCount: B.length });
    const M = [];
    for (const N of B) {
      const A = n.find((b) => b.id === N);
      if (!A) continue;
      const R = A.tag?.split(" ").filter(Boolean) || [];
      if (R.includes(y)) {
        c.info("[useDragAndDrop] Task already has tag", { taskId: N, filterTag: y });
        continue;
      }
      const U = [...R, y].join(" ");
      M.push({ taskId: N, tag: U });
    }
    if (M.length === 0) {
      c.info("[useDragAndDrop] No updates needed - all tasks already have this tag");
      return;
    }
    c.info("[useDragAndDrop] Adding tag via filter drop", {
      filterTag: y,
      updateCount: M.length
    });
    try {
      await e(M);
      try {
        q();
      } catch {
      }
    } catch (N) {
      c.error("[useDragAndDrop] Failed to add tag via filter drop", {
        error: N instanceof Error ? N.message : String(N)
      }), alert(N.message || "Failed to add tag");
    }
  }
  return {
    dragOverTag: a,
    dragOverFilter: r,
    setDragOverFilter: o,
    selectedIds: i,
    isSelecting: d,
    marqueeRect: f,
    selectionJustEndedAt: v,
    // selection handlers
    selectionStartHandler: H,
    selectionMoveHandler: z,
    selectionEndHandler: J,
    clearSelection: q,
    onDragStart: j,
    onDragEnd: F,
    onDragOver: re,
    onDragLeave: ie,
    onDrop: ae,
    onFilterDragOver: T,
    onFilterDragLeave: E,
    onFilterDrop: x
  };
}
function Yt() {
  const [n, t] = I({});
  function e(o) {
    t((i) => {
      const d = (i[o] || "desc") === "desc" ? "asc" : "desc";
      return { ...i, [o]: d };
    });
  }
  function a(o, i) {
    return [...o].sort((u, d) => {
      const h = new Date(u.createdAt).getTime(), f = new Date(d.createdAt).getTime();
      return i === "asc" ? h - f : f - h;
    });
  }
  function s(o) {
    return o === "asc" ? "↑" : "↓";
  }
  function r(o) {
    return o === "asc" ? "Sorted by age (oldest first) - click to sort newest first" : "Sorted by age (newest first) - click to sort oldest first";
  }
  return {
    sortDirections: n,
    toggleSort: e,
    sortTasksByAge: a,
    getSortIcon: s,
    getSortTitle: r
  };
}
const Ue = 5, Gt = 300, ke = "1.0", We = "task-storage-version", Zt = [
  /^tasks-/,
  // tasks-main, tasks-work
  /^stats-/,
  // stats-main, stats-work
  /^boards$/,
  // boards (without prefix)
  /^preferences$/
  // preferences (without prefix)
];
function Qt() {
  return typeof window < "u" && window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}
const ea = {
  version: 1,
  updatedAt: (/* @__PURE__ */ new Date()).toISOString(),
  experimentalThemes: !1,
  alwaysVerticalLayout: !1,
  theme: Qt(),
  showCompleteButton: !0,
  showDeleteButton: !0,
  showTagButton: !1
};
function ta(n, t) {
  const e = window.localStorage.getItem(We);
  e !== ke && (c.info("[Preferences] Storage version mismatch, cleaning up orphaned keys", {
    current: e,
    expected: ke
  }), Object.keys(window.localStorage).forEach((a) => {
    const s = Zt.some((o) => o.test(a)), r = a.includes(`${n}-${t}`);
    s && !r && (c.info("[Preferences] Removing orphaned key", { key: a }), window.localStorage.removeItem(a));
  }), window.localStorage.setItem(We, ke), c.info("[Preferences] Storage upgraded to version", { version: ke }));
}
function aa(n) {
  try {
    const t = sessionStorage.getItem("theme"), e = sessionStorage.getItem("showCompleteButton"), a = sessionStorage.getItem("showDeleteButton"), s = sessionStorage.getItem("showTagButton"), r = {};
    return t && !n.theme && (r.theme = t), e !== null && n.showCompleteButton === void 0 && (r.showCompleteButton = e === "true"), a !== null && n.showDeleteButton === void 0 && (r.showDeleteButton = a === "true"), s !== null && n.showTagButton === void 0 && (r.showTagButton = s === "true"), Object.keys(r).length > 0 ? (c.info("[Preferences] Migrating settings from sessionStorage to localStorage", {
      migrations: r
    }), sessionStorage.removeItem("theme"), sessionStorage.removeItem("showCompleteButton"), sessionStorage.removeItem("showDeleteButton"), sessionStorage.removeItem("showTagButton"), r) : null;
  } catch (t) {
    return c.warn("[Preferences] Failed to migrate settings", {
      error: t instanceof Error ? t.message : String(t)
    }), null;
  }
}
function na(n, t, e = !1) {
  const [a, s] = I(ea), [r, o] = I(!1);
  te(() => {
    if (e)
      return;
    (async () => {
      ta(n, t), c.info("[usePreferences] Loading preferences...", { userType: n, sessionId: t });
      const h = de(n, t), f = await h.getPreferences();
      if (c.info("[usePreferences] Loaded preferences", { prefs: f }), f) {
        const k = aa(f);
        if (k) {
          const v = { ...f, ...k, updatedAt: (/* @__PURE__ */ new Date()).toISOString() };
          s(v), await h.savePreferences(v), c.info("[usePreferences] Applied and saved migrations");
        } else
          s(f), c.info("[usePreferences] Applied preferences to state");
      }
      o(!0);
    })();
  }, [n, t, e]);
  const i = async (d) => {
    const h = { ...a, ...d, updatedAt: (/* @__PURE__ */ new Date()).toISOString() };
    s(h), await de(n, t).savePreferences(h);
  }, u = a.theme?.endsWith("-dark") || a.theme === "dark";
  return {
    preferences: a,
    savePreferences: i,
    preferencesLoaded: r,
    isDarkTheme: u,
    setPreferences: s,
    setPreferencesLoaded: o
  };
}
const He = [
  {
    lightIcon: /* @__PURE__ */ l(wt, {}),
    darkIcon: /* @__PURE__ */ l(qe, {}),
    lightTheme: "light",
    darkTheme: "dark",
    lightLabel: "Light",
    darkLabel: "Dark"
  },
  {
    lightIcon: /* @__PURE__ */ l(Le, {}),
    darkIcon: /* @__PURE__ */ l(Le, {}),
    lightTheme: "coffee-light",
    darkTheme: "coffee-dark",
    lightLabel: "Coffee Light",
    darkLabel: "Coffee Dark"
  },
  {
    lightIcon: /* @__PURE__ */ l(Pe, {}),
    darkIcon: /* @__PURE__ */ l(Pe, {}),
    lightTheme: "nature-light",
    darkTheme: "nature-dark",
    lightLabel: "Nature Light",
    darkLabel: "Nature Dark"
  },
  {
    lightIcon: /* @__PURE__ */ l(Oe, {}),
    darkIcon: /* @__PURE__ */ l(Oe, {}),
    lightTheme: "lavender-light",
    darkTheme: "lavender-dark",
    lightLabel: "Lavender Light",
    darkLabel: "Lavender Dark"
  },
  {
    lightIcon: /* @__PURE__ */ l(Me, {}),
    darkIcon: /* @__PURE__ */ l(Me, {}),
    lightTheme: "strawberry-light",
    darkTheme: "strawberry-dark",
    lightLabel: "Strawberry Light",
    darkLabel: "Strawberry Dark"
  },
  {
    lightIcon: /* @__PURE__ */ l(Ie, {}),
    darkIcon: /* @__PURE__ */ l(Ie, {}),
    lightTheme: "ocean-light",
    darkTheme: "ocean-dark",
    lightLabel: "Ocean Light",
    darkLabel: "Ocean Dark"
  }
], sa = [
  {
    lightIcon: /* @__PURE__ */ l(_e, {}),
    darkIcon: /* @__PURE__ */ l(_e, {}),
    lightTheme: "cyberpunk-light",
    darkTheme: "cyberpunk-dark",
    lightLabel: "Cyberpunk Light",
    darkLabel: "Cyberpunk Dark"
  },
  {
    lightIcon: /* @__PURE__ */ l($e, {}),
    darkIcon: /* @__PURE__ */ l($e, {}),
    lightTheme: "pink-light",
    darkTheme: "pink-dark",
    lightLabel: "Pink Light",
    darkLabel: "Pink Dark"
  },
  {
    lightIcon: /* @__PURE__ */ l(Fe, {}),
    darkIcon: /* @__PURE__ */ l(Fe, {}),
    lightTheme: "izakaya-light",
    darkTheme: "izakaya-dark",
    lightLabel: "Izakaya Light",
    darkLabel: "Izakaya Dark"
  }
];
function xe(n) {
  return n ? [...He, ...sa] : He;
}
function ra(n, t) {
  const a = xe(t).find((s) => s.lightTheme === n || s.darkTheme === n);
  return a ? n.endsWith("-dark") || n === "dark" ? a.darkIcon : a.lightIcon : /* @__PURE__ */ l(qe, {});
}
function oa(n, t) {
  return n ? xe(t).some((a) => a.lightTheme === n || a.darkTheme === n) : !1;
}
function ia(n, t, e, a = !0) {
  const [s, r] = I(!1), [o, i] = I(!1), [u, d] = I(!0), f = typeof window < "u" && window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light", k = be(
    () => xe(n.experimentalThemes || !1),
    [n.experimentalThemes]
  ), v = be(() => {
    const _ = n.theme;
    if (oa(_, n.experimentalThemes || !1))
      return _;
    if (_) {
      const j = _.endsWith("-dark") || _ === "dark" ? "dark" : "light";
      return a && c.info(
        `[useTheme] Theme '${_}' not available, falling back to '${j}'`,
        {
          experimentalEnabled: n.experimentalThemes || !1
        }
      ), j;
    }
    return f;
  }, [n.theme, n.experimentalThemes, f, a]), S = Te(
    (_) => t({ theme: _ }),
    [t]
  );
  return te(() => {
    if (document.documentElement.setAttribute("data-theme", v), e.current && e.current.setAttribute("data-theme", v), c.info(`[useTheme] Applied theme: ${v}`, { preferencesLoaded: a }), u) {
      const _ = setTimeout(() => {
        i(!0), d(!1);
      }, 50);
      return () => clearTimeout(_);
    } else
      i(!0);
  }, [v, e, a, u]), te(() => {
    const _ = window.matchMedia("(prefers-color-scheme: dark)"), D = (j) => {
      const F = j.matches, H = v.replace(/-light$|-dark$/, ""), z = v.endsWith("-dark") ? "dark" : v.endsWith("-light") ? "light" : null;
      if (z && H !== "light" && H !== "dark") {
        const J = F ? "dark" : "light";
        if (z !== J) {
          const q = `${H}-${J}`;
          c.info(`[Theme] Auto-switching from ${v} to ${q} (system preference)`), S(q);
        }
      }
    };
    return _.addEventListener ? _.addEventListener("change", D) : _.addListener(D), () => {
      _.removeEventListener ? _.removeEventListener("change", D) : _.removeListener(D);
    };
  }, [v, S]), {
    theme: v,
    showThemePicker: s,
    setShowThemePicker: r,
    THEME_FAMILIES: k,
    setTheme: S,
    isThemeReady: o,
    isInitialThemeLoad: u
  };
}
function Je(n, t, e, a) {
  te(() => {
    if (!t) return;
    const s = (r) => {
      const o = r.target;
      n.current && n.current.contains(o) || a && o.closest(a) || e();
    };
    return document.addEventListener("mousedown", s), () => document.removeEventListener("mousedown", s);
  }, [n, t, e, a]);
}
function ca() {
  const [n, t] = I(
    null
  ), [e, a] = I(!1), [s, r] = I(!1), [o, i] = I(!1), [u, d] = I(null), [h, f] = I(""), [k, v] = I(null), [S, _] = I(null), [D, j] = I(""), [F, H] = I(null), [z, J] = I(
    null
  );
  return {
    confirmClearTag: n,
    setConfirmClearTag: t,
    showNewBoardDialog: e,
    setShowNewBoardDialog: a,
    showNewTagDialog: s,
    setShowNewTagDialog: r,
    showSettingsModal: o,
    setShowSettingsModal: i,
    editTagModal: u,
    setEditTagModal: d,
    editTagInput: h,
    setEditTagInput: f,
    boardContextMenu: k,
    setBoardContextMenu: v,
    tagContextMenu: S,
    setTagContextMenu: _,
    inputValue: D,
    setInputValue: j,
    validationError: F,
    setValidationError: H,
    pendingTaskOperation: z,
    setPendingTaskOperation: J
  };
}
const Ve = 768;
function la() {
  const [n, t] = I(() => typeof window > "u" ? !1 : window.innerWidth < Ve);
  return te(() => {
    if (typeof window > "u") return;
    const e = window.matchMedia(`(max-width: ${Ve - 1}px)`), a = (s) => {
      t(s.matches);
    };
    return e.addEventListener ? e.addEventListener("change", a) : e.addListener(a), a(e), () => {
      e.removeEventListener ? e.removeEventListener("change", a) : e.removeListener(a);
    };
  }, []), n;
}
function da({ isDarkTheme: n }) {
  return /* @__PURE__ */ l("div", { className: "task-app-loading", "data-dark-theme": n ? "true" : "false", children: /* @__PURE__ */ w("div", { className: "task-app-loading__skeleton", children: [
    /* @__PURE__ */ w("div", { className: "skeleton-header-row", children: [
      /* @__PURE__ */ l("div", { className: "skeleton-header" }),
      /* @__PURE__ */ l("div", { className: "skeleton-theme-button" })
    ] }),
    /* @__PURE__ */ w("div", { className: "skeleton-boards", children: [
      /* @__PURE__ */ l("div", { className: "skeleton-board" }),
      /* @__PURE__ */ l("div", { className: "skeleton-board" }),
      /* @__PURE__ */ l("div", { className: "skeleton-board-add" })
    ] }),
    /* @__PURE__ */ l("div", { className: "skeleton-input" }),
    /* @__PURE__ */ w("div", { className: "skeleton-filters", children: [
      /* @__PURE__ */ l("div", { className: "skeleton-filter" }),
      /* @__PURE__ */ l("div", { className: "skeleton-filter" }),
      /* @__PURE__ */ l("div", { className: "skeleton-filter" }),
      /* @__PURE__ */ l("div", { className: "skeleton-filter-add" })
    ] }),
    /* @__PURE__ */ w("div", { className: "skeleton-column", children: [
      /* @__PURE__ */ l("div", { className: "skeleton-column-header" }),
      /* @__PURE__ */ l("div", { className: "skeleton-task" }),
      /* @__PURE__ */ l("div", { className: "skeleton-task" }),
      /* @__PURE__ */ l("div", { className: "skeleton-task" })
    ] })
  ] }) });
}
function ua({
  theme: n,
  experimentalThemes: t,
  showThemePicker: e,
  onThemePickerToggle: a,
  onThemeChange: s,
  onSettingsClick: r,
  THEME_FAMILIES: o
}) {
  return /* @__PURE__ */ w("div", { className: "task-app__header-container", children: [
    /* @__PURE__ */ l(
      "h1",
      {
        className: "task-app__header",
        onClick: r,
        style: { cursor: "pointer" },
        title: "Settings",
        children: "Tasks"
      }
    ),
    /* @__PURE__ */ w("div", { className: "theme-picker", children: [
      /* @__PURE__ */ l(
        "button",
        {
          className: "theme-toggle-btn",
          onClick: a,
          "aria-label": "Choose theme",
          title: "Choose theme",
          children: ra(n, t)
        }
      ),
      e && /* @__PURE__ */ w("div", { className: "theme-picker__dropdown", onClick: (i) => i.stopPropagation(), children: [
        /* @__PURE__ */ l("div", { className: "theme-picker__pills", children: o.map((i, u) => /* @__PURE__ */ w("div", { className: "theme-pill", children: [
          /* @__PURE__ */ l(
            "button",
            {
              className: `theme-pill__btn theme-pill__btn--light ${n === i.lightTheme ? "active" : ""}`,
              onClick: () => s(i.lightTheme),
              title: i.lightLabel,
              "aria-label": i.lightLabel,
              children: /* @__PURE__ */ l("div", { className: "theme-pill__icon", children: i.lightIcon })
            }
          ),
          /* @__PURE__ */ l(
            "button",
            {
              className: `theme-pill__btn theme-pill__btn--dark ${n === i.darkTheme ? "active" : ""}`,
              onClick: () => s(i.darkTheme),
              title: i.darkLabel,
              "aria-label": i.darkLabel,
              children: /* @__PURE__ */ l("div", { className: "theme-pill__icon", children: i.darkIcon })
            }
          )
        ] }, u)) }),
        /* @__PURE__ */ l(
          "button",
          {
            className: "theme-picker__settings-icon",
            onClick: () => {
              r(), a();
            },
            "aria-label": "Settings",
            title: "Settings",
            children: /* @__PURE__ */ l(vt, {})
          }
        )
      ] })
    ] }),
    e && /* @__PURE__ */ l("div", { className: "theme-picker__overlay", onClick: a })
  ] });
}
function Ze({ onLongPress: n, delay: t = 500 }) {
  const e = ye(null);
  return {
    onTouchStart: (o) => {
      const i = o.touches[0];
      e.current = window.setTimeout(() => {
        n(i.clientX, i.clientY);
      }, t);
    },
    onTouchEnd: () => {
      e.current && (clearTimeout(e.current), e.current = null);
    },
    onTouchMove: () => {
      e.current && (clearTimeout(e.current), e.current = null);
    }
  };
}
function De(n) {
  let t = [];
  try {
    const e = n.getData("application/x-hadoku-task-ids");
    e && (t = JSON.parse(e));
  } catch {
  }
  if (t.length === 0) {
    const e = n.getData("text/plain");
    e && (t = [e]);
  }
  return t;
}
function ga({
  board: n,
  isActive: t,
  isDragOver: e,
  onSwitch: a,
  onContextMenu: s,
  onDragOverFilter: r,
  onMoveTasksToBoard: o,
  onClearSelection: i
}) {
  const u = Ze({
    onLongPress: (h, f) => s(n.id, h, f)
  }), d = n.id === "main";
  return /* @__PURE__ */ l(
    "button",
    {
      className: `board-btn ${t ? "board-btn--active" : ""} ${e ? "board-btn--drag-over" : ""}`,
      onClick: () => a(n.id),
      onContextMenu: (h) => {
        h.preventDefault(), !d && s(n.id, h.clientX, h.clientY);
      },
      ...d ? {} : u,
      "aria-pressed": t ? "true" : "false",
      onDragOver: (h) => {
        h.preventDefault(), h.dataTransfer.dropEffect = "move", r(`board:${n.id}`);
      },
      onDragLeave: (h) => {
        r(null);
      },
      onDrop: async (h) => {
        h.preventDefault(), r(null);
        const f = De(h.dataTransfer);
        if (f.length !== 0)
          try {
            await o(n.id, f);
            try {
              i();
            } catch {
            }
          } catch (k) {
            c.error("[BoardButton] Failed moving tasks to board", {
              error: k instanceof Error ? k.message : String(k),
              boardId: n.id,
              taskCount: f.length
            }), alert(k.message || "Failed to move tasks");
          }
      },
      children: n.name
    }
  );
}
function ha({
  boards: n,
  currentBoardId: t,
  userType: e,
  dragOverFilter: a,
  onBoardSwitch: s,
  onBoardContextMenu: r,
  onDragOverFilter: o,
  onMoveTasksToBoard: i,
  onClearSelection: u,
  onCreateBoardClick: d,
  onPendingOperation: h,
  onInitialLoad: f,
  onShowToast: k
}) {
  const [v, S] = I(!1), _ = n && n.boards ? n.boards.slice(0, Ue) : [{ id: "main", name: "main", tasks: [], tags: [] }], D = !n || n.boards && n.boards.length < Ue, j = async (F) => {
    if (v) return;
    c.info("[BoardsSection] Manual refresh triggered"), S(!0);
    const H = F.currentTarget, z = new Promise((J, q) => {
      setTimeout(() => q(new Error("Sync timeout")), 5e3);
    });
    try {
      await Promise.race([f(), z]), c.info("[BoardsSection] Sync completed successfully"), k?.("Refresh successful", "success");
    } catch (J) {
      c.error("[BoardsSection] Sync failed", {
        error: J instanceof Error ? J.message : String(J)
      }), k?.("Refresh failed", "error");
    } finally {
      S(!1), H?.blur();
    }
  };
  return /* @__PURE__ */ w("div", { className: "task-app__boards", children: [
    /* @__PURE__ */ l("div", { className: "task-app__board-list", children: _.map((F) => /* @__PURE__ */ l(
      ga,
      {
        board: F,
        isActive: t === F.id,
        isDragOver: a === `board:${F.id}`,
        onSwitch: s,
        onContextMenu: r,
        onDragOverFilter: o,
        onMoveTasksToBoard: i,
        onClearSelection: u
      },
      F.id
    )) }),
    /* @__PURE__ */ w("div", { className: "task-app__board-actions", children: [
      D && /* @__PURE__ */ l(
        "button",
        {
          className: `board-add-btn ${a === "add-board" ? "board-btn--drag-over" : ""}`,
          onClick: d,
          onDragOver: (F) => {
            F.preventDefault(), F.dataTransfer.dropEffect = "move", o("add-board");
          },
          onDragLeave: () => o(null),
          onDrop: (F) => {
            F.preventDefault(), o(null);
            const H = De(F.dataTransfer);
            H.length > 0 && (h({ type: "move-to-board", taskIds: H }), d());
          },
          "aria-label": "Create board",
          children: "＋"
        }
      ),
      e !== "public" && /* @__PURE__ */ l(
        "button",
        {
          className: `sync-btn ${v ? "spinning" : ""}`,
          onClick: j,
          disabled: v,
          title: "Sync from server",
          "aria-label": "Sync from server",
          children: /* @__PURE__ */ w(
            "svg",
            {
              width: "16",
              height: "16",
              viewBox: "0 0 24 24",
              fill: "none",
              stroke: "currentColor",
              strokeWidth: "2",
              strokeLinecap: "round",
              strokeLinejoin: "round",
              children: [
                /* @__PURE__ */ l("polyline", { points: "23 4 23 10 17 10" }),
                /* @__PURE__ */ l("polyline", { points: "1 20 1 14 7 14" }),
                /* @__PURE__ */ l("path", { d: "M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" })
              ]
            }
          )
        }
      )
    ] })
  ] });
}
function fa({
  tag: n,
  isActive: t,
  isDragOver: e,
  onToggle: a,
  onContextMenu: s,
  onDragOver: r,
  onDragLeave: o,
  onDrop: i
}) {
  const u = Ze({
    onLongPress: (d, h) => s(n, d, h)
  });
  return /* @__PURE__ */ w(
    "button",
    {
      onClick: () => a(n),
      onContextMenu: (d) => {
        d.preventDefault(), s(n, d.clientX, d.clientY);
      },
      ...u,
      className: `${t ? "on" : ""} ${e ? "task-app__filter-drag-over" : ""}`,
      onDragOver: (d) => r(d, n),
      onDragLeave: o,
      onDrop: (d) => i(d, n),
      children: [
        "#",
        n
      ]
    }
  );
}
function ma({
  tags: n,
  selectedFilters: t,
  dragOverFilter: e,
  onToggleFilter: a,
  onTagContextMenu: s,
  onDragOver: r,
  onDragLeave: o,
  onDrop: i,
  onCreateTagClick: u,
  onPendingOperation: d
}) {
  const h = (f) => {
    f.preventDefault(), o(f);
    const k = De(f.dataTransfer);
    k.length > 0 && (d({ type: "apply-tag", taskIds: k }), u());
  };
  return /* @__PURE__ */ w("div", { className: "task-app__filters", children: [
    n.map((f) => /* @__PURE__ */ l(
      fa,
      {
        tag: f,
        isActive: t.has(f),
        isDragOver: e === f,
        onToggle: a,
        onContextMenu: s,
        onDragOver: r,
        onDragLeave: o,
        onDrop: i
      },
      f
    )),
    /* @__PURE__ */ l(
      "button",
      {
        className: `task-app__filter-add ${e === "add-tag" ? "task-app__filter-drag-over" : ""}`,
        onClick: u,
        onDragOver: (f) => {
          f.preventDefault(), f.dataTransfer.dropEffect = "copy", r(f, "add-tag");
        },
        onDragLeave: o,
        onDrop: h,
        "aria-label": "Add tag",
        children: "＋"
      }
    )
  ] });
}
function pa(n) {
  const t = /* @__PURE__ */ new Date(), e = new Date(n), a = t.getTime() - e.getTime(), s = Math.floor(a / 1e3), r = Math.floor(s / 60), o = Math.floor(r / 60), i = Math.floor(o / 24);
  return s < 60 ? `${s}s ago` : r < 60 ? `${r}m ago` : o < 24 ? `${o}h ago` : `${i}d ago`;
}
function Se({
  task: n,
  isDraggable: t = !0,
  pendingOperations: e,
  onComplete: a,
  onDelete: s,
  onEditTag: r,
  onDragStart: o,
  onDragEnd: i,
  selected: u = !1,
  showCompleteButton: d = !0,
  showDeleteButton: h = !0,
  showTagButton: f = !1
}) {
  const k = e.has(`complete-${n.id}`), v = e.has(`delete-${n.id}`);
  return /* @__PURE__ */ w(
    "li",
    {
      className: `task-app__item ${u ? "selected" : ""}`,
      "data-task-id": n.id,
      draggable: t,
      onDragStart: o ? (S) => o(S, n.id) : void 0,
      onDragEnd: (S) => {
        if (S.currentTarget.classList.remove("dragging"), i)
          try {
            i(S);
          } catch {
          }
      },
      children: [
        /* @__PURE__ */ w("div", { className: "task-app__item-content", children: [
          /* @__PURE__ */ l("div", { className: "task-app__item-title", title: n.title, children: n.title }),
          /* @__PURE__ */ w("div", { className: "task-app__item-meta-row", children: [
            n.tag ? /* @__PURE__ */ l("div", { className: "task-app__item-tag", children: n.tag.split(" ").sort().map((S) => `#${S}`).join(" ") }) : /* @__PURE__ */ l("div", {}),
            /* @__PURE__ */ l("div", { className: "task-app__item-age", children: pa(n.createdAt) })
          ] })
        ] }),
        /* @__PURE__ */ w("div", { className: "task-app__item-actions", children: [
          f && /* @__PURE__ */ l(
            "button",
            {
              className: "task-app__action-btn task-app__edit-tag-btn",
              onClick: () => r(n.id),
              title: "Edit tags",
              disabled: k || v,
              children: /* @__PURE__ */ l(St, {})
            }
          ),
          d && /* @__PURE__ */ l(
            "button",
            {
              className: "task-app__action-btn task-app__complete-btn",
              onClick: () => a(n.id),
              title: "Complete task",
              disabled: k || v,
              children: k ? "⏳" : "✓"
            }
          ),
          h && /* @__PURE__ */ l(
            "button",
            {
              className: "task-app__action-btn task-app__delete-btn",
              onClick: () => s(n.id),
              title: "Delete task",
              disabled: k || v,
              children: v ? "⏳" : "×"
            }
          )
        ] })
      ]
    }
  );
}
function je(n, t = !1) {
  if (n === 0)
    return { useTags: 0, maxPerColumn: 1 / 0, rows: [] };
  if (t) {
    const e = Array.from({ length: n }, (a, s) => ({
      columns: 1,
      tagIndices: [s]
    }));
    return {
      useTags: n,
      maxPerColumn: 1 / 0,
      rows: e
    };
  }
  return n === 1 ? {
    useTags: 1,
    maxPerColumn: 1 / 0,
    rows: [{ columns: 1, tagIndices: [0] }]
  } : n === 2 ? {
    useTags: 2,
    maxPerColumn: 1 / 0,
    rows: [{ columns: 2, tagIndices: [0, 1] }]
  } : n === 3 ? {
    useTags: 3,
    maxPerColumn: 1 / 0,
    rows: [{ columns: 3, tagIndices: [0, 1, 2] }]
  } : n === 4 ? {
    useTags: 4,
    maxPerColumn: 10,
    rows: [
      { columns: 3, tagIndices: [0, 1, 2] },
      { columns: 1, tagIndices: [3] }
    ]
  } : n === 5 ? {
    useTags: 5,
    maxPerColumn: 10,
    rows: [
      { columns: 3, tagIndices: [0, 1, 2] },
      { columns: 2, tagIndices: [3, 4] }
    ]
  } : {
    useTags: 6,
    maxPerColumn: 10,
    rows: [
      { columns: 3, tagIndices: [0, 1, 2] },
      { columns: 3, tagIndices: [3, 4, 5] }
    ]
  };
}
function ka({
  tasks: n,
  topTags: t,
  isMobile: e = !1,
  filters: a,
  sortDirections: s,
  dragOverTag: r,
  pendingOperations: o,
  onComplete: i,
  onDelete: u,
  onEditTag: d,
  onDragStart: h,
  onDragEnd: f,
  selectedIds: k,
  onSelectionStart: v,
  onSelectionMove: S,
  onSelectionEnd: _,
  onDragOver: D,
  onDragLeave: j,
  onDrop: F,
  toggleSort: H,
  sortTasksByAge: z,
  getSortIcon: J,
  getSortTitle: q,
  deleteTag: re,
  onDeletePersistedTag: ie,
  showCompleteButton: ae = !0,
  showDeleteButton: T = !0,
  showTagButton: E = !1
}) {
  const x = (b, K) => /* @__PURE__ */ w(
    "div",
    {
      className: `task-app__tag-column ${r === b ? "task-app__tag-column--drag-over" : ""}`,
      onDragOver: (P) => D(P, b),
      onDragLeave: j,
      onDrop: (P) => F(P, b),
      children: [
        /* @__PURE__ */ w("div", { className: "task-app__tag-header-row", children: [
          /* @__PURE__ */ w("h3", { className: "task-app__tag-header", children: [
            "#",
            b
          ] }),
          /* @__PURE__ */ l(
            "button",
            {
              className: "task-app__sort-btn task-app__sort-btn--active",
              onClick: () => H(b),
              title: q(s[b] || "desc"),
              children: J(s[b] || "desc")
            }
          )
        ] }),
        /* @__PURE__ */ l("ul", { className: "task-app__list task-app__list--column", children: z(K, s[b] || "desc").map((P) => /* @__PURE__ */ l(
          Se,
          {
            task: P,
            isDraggable: !0,
            pendingOperations: o,
            onComplete: i,
            onDelete: u,
            onEditTag: d,
            onDragStart: h,
            onDragEnd: f,
            selected: k ? k.has(P.id) : !1,
            showCompleteButton: ae,
            showDeleteButton: T,
            showTagButton: E
          },
          P.id
        )) })
      ]
    },
    b
  ), p = (b, K) => {
    let P = Re(n, b);
    return B && a && (P = P.filter((V) => {
      const Q = V.tag?.split(" ") || [];
      return a.some((ne) => Q.includes(ne));
    })), P.slice(0, K);
  }, y = t.length, B = Array.isArray(a) && a.length > 0, M = n.filter((b) => {
    if (!B || !a) return !0;
    const K = b.tag?.split(" ") || [];
    return a.some((P) => K.includes(P));
  }), N = je(y, e), A = B && a ? t.filter((b) => Re(n, b).some((P) => {
    const V = P.tag?.split(" ") || [];
    return a.some((Q) => V.includes(Q));
  })) : t.slice(0, N.useTags);
  if (A.length === 0)
    return /* @__PURE__ */ l("ul", { className: "task-app__list", children: M.map((b) => /* @__PURE__ */ l(
      Se,
      {
        task: b,
        pendingOperations: o,
        onComplete: i,
        onDelete: u,
        onEditTag: d,
        onDragStart: h,
        onDragEnd: f,
        selected: k ? k.has(b.id) : !1,
        showCompleteButton: ae,
        showDeleteButton: T,
        showTagButton: E
      },
      b.id
    )) });
  const R = zt(n, t, a).filter((b) => {
    if (!B || !a) return !0;
    const K = b.tag?.split(" ") || [];
    return a.some((P) => K.includes(P));
  }), U = je(A.length, e);
  return /* @__PURE__ */ w("div", { className: "task-app__dynamic-layout", children: [
    U.rows.length > 0 && /* @__PURE__ */ l(kt, { children: U.rows.map((b, K) => /* @__PURE__ */ l(
      "div",
      {
        className: `task-app__tag-grid task-app__tag-grid--${b.columns}col`,
        children: b.tagIndices.map((P) => {
          const V = A[P];
          return V ? x(V, p(V, U.maxPerColumn)) : null;
        })
      },
      K
    )) }),
    R.length > 0 && /* @__PURE__ */ w(
      "div",
      {
        className: `task-app__remaining ${r === "other" ? "task-app__tag-column--drag-over" : ""}`,
        onDragOver: (b) => {
          b.preventDefault(), b.dataTransfer.dropEffect = "move", D(b, "other");
        },
        onDragLeave: (b) => j(b),
        onDrop: (b) => F(b, "other"),
        children: [
          /* @__PURE__ */ w("div", { className: "task-app__tag-header-row", children: [
            /* @__PURE__ */ l("h3", { className: "task-app__remaining-header", children: "Other Tasks" }),
            /* @__PURE__ */ l(
              "button",
              {
                className: "task-app__sort-btn task-app__sort-btn--active",
                onClick: () => H("other"),
                title: q(s.other || "desc"),
                children: J(s.other || "desc")
              }
            )
          ] }),
          /* @__PURE__ */ l("ul", { className: "task-app__list", children: z(R, s.other || "desc").map((b) => /* @__PURE__ */ l(
            Se,
            {
              task: b,
              pendingOperations: o,
              onComplete: i,
              onDelete: u,
              onEditTag: d,
              onDragStart: h,
              onDragEnd: f,
              selected: k ? k.has(b.id) : !1,
              showCompleteButton: ae,
              showDeleteButton: T,
              showTagButton: E
            },
            b.id
          )) })
        ]
      }
    )
  ] });
}
function pe({
  isOpen: n,
  title: t,
  onClose: e,
  onConfirm: a,
  children: s,
  inputValue: r,
  onInputChange: o,
  inputPlaceholder: i,
  confirmLabel: u = "Confirm",
  cancelLabel: d = "Cancel",
  confirmDisabled: h = !1,
  confirmDanger: f = !1
}) {
  return n ? /* @__PURE__ */ l("div", { className: "modal-overlay", onClick: e, children: /* @__PURE__ */ w("div", { className: "modal-card", onClick: (v) => v.stopPropagation(), children: [
    /* @__PURE__ */ l("h3", { children: t }),
    s,
    o && /* @__PURE__ */ l(
      "input",
      {
        type: "text",
        className: "modal-input",
        value: r || "",
        onChange: (v) => o(v.target.value),
        placeholder: i,
        autoFocus: !0,
        onKeyDown: (v) => {
          v.key === "Enter" && !h && (v.preventDefault(), a()), v.key === "Escape" && (v.preventDefault(), e());
        }
      }
    ),
    /* @__PURE__ */ w("div", { className: "modal-actions", children: [
      /* @__PURE__ */ l("button", { className: "modal-button", onClick: e, children: d }),
      /* @__PURE__ */ l(
        "button",
        {
          className: `modal-button ${f ? "modal-button--danger" : "modal-button--primary"}`,
          onClick: a,
          disabled: h,
          children: u
        }
      )
    ] })
  ] }) }) : null;
}
function Ta({ tag: n, count: t, isOpen: e, onClose: a, onConfirm: s }) {
  const r = async () => {
    n && (await s(n), a());
  };
  return /* @__PURE__ */ l(
    pe,
    {
      isOpen: e,
      title: `Clear Tag #${n}?`,
      onClose: a,
      onConfirm: r,
      confirmLabel: "Clear Tag",
      confirmDanger: !0,
      children: n && /* @__PURE__ */ w("p", { children: [
        "This will remove ",
        /* @__PURE__ */ w("strong", { children: [
          "#",
          n
        ] }),
        " from ",
        /* @__PURE__ */ w("strong", { children: [
          t,
          " task(s)"
        ] }),
        " and delete the tag from the board."
      ] })
    }
  );
}
function ya({
  isOpen: n,
  inputValue: t,
  validationError: e,
  pendingTaskOperation: a,
  onClose: s,
  onConfirm: r,
  onInputChange: o,
  validateBoardName: i
}) {
  const u = async () => {
    !t.trim() || i(t) || await r(t);
  }, d = !t.trim() || i(t) !== null;
  return /* @__PURE__ */ w(
    pe,
    {
      isOpen: n,
      title: "Create New Board",
      onClose: s,
      onConfirm: u,
      inputValue: t,
      onInputChange: o,
      inputPlaceholder: "Board name",
      confirmLabel: "Create",
      confirmDisabled: d,
      children: [
        a?.type === "move-to-board" && a.taskIds.length > 0 && /* @__PURE__ */ w("p", { className: "modal-hint", children: [
          a.taskIds.length,
          " task",
          a.taskIds.length > 1 ? "s" : "",
          " will be moved to this board"
        ] }),
        e && /* @__PURE__ */ l(
          "p",
          {
            className: "modal-error",
            style: { color: "var(--error-color, #d32f2f)", marginTop: "0.5rem" },
            children: e
          }
        )
      ]
    }
  );
}
function wa({
  isOpen: n,
  inputValue: t,
  tasks: e,
  pendingTaskOperation: a,
  onClose: s,
  onConfirm: r,
  onInputChange: o
}) {
  const i = async () => {
    if (t.trim())
      try {
        await r(t);
      } catch (d) {
        c.error("[CreateTagModal] Failed to create tag", {
          error: d instanceof Error ? d.message : String(d),
          tagName: t
        });
      }
  }, u = Ge(e);
  return /* @__PURE__ */ w(
    pe,
    {
      isOpen: n,
      title: "Create New Tag",
      onClose: s,
      onConfirm: i,
      inputValue: t,
      onInputChange: o,
      inputPlaceholder: "Enter new tag name",
      confirmLabel: "Create",
      confirmDisabled: !t.trim(),
      children: [
        a?.type === "apply-tag" && a.taskIds.length > 0 && /* @__PURE__ */ w("p", { className: "modal-hint", children: [
          "This tag will be applied to ",
          a.taskIds.length,
          " task",
          a.taskIds.length > 1 ? "s" : ""
        ] }),
        u.length > 0 && /* @__PURE__ */ w("div", { className: "modal-section", children: [
          /* @__PURE__ */ l("label", { className: "modal-label", children: "Existing tags:" }),
          /* @__PURE__ */ l("div", { className: "modal-tags-list", children: u.map((d) => /* @__PURE__ */ w("span", { className: "modal-tag-chip", children: [
            "#",
            d
          ] }, d)) })
        ] })
      ]
    }
  );
}
async function va(n, t) {
  const e = n.trim();
  if (!e)
    return { success: !1, error: "Key cannot be empty" };
  try {
    if (await t(e)) {
      const s = new URL(window.location.href);
      s.searchParams.set("key", e);
      const r = s.toString();
      return window.parent !== window && (c.info("[Auth] Notifying mobile app of URL change", { url: r }), window.parent.postMessage(
        {
          type: "urlChange",
          url: r
        },
        "*"
      )), window.location.href = r, { success: !0 };
    } else
      return { success: !1, error: "Invalid key" };
  } catch (a) {
    return c.error("[Auth] Key validation failed", {
      error: a instanceof Error ? a.message : String(a)
    }), { success: !1, error: "Failed to validate key" };
  }
}
function Sa({
  isOpen: n,
  preferences: t,
  showCompleteButton: e,
  showDeleteButton: a,
  showTagButton: s,
  onClose: r,
  onSavePreferences: o,
  onValidateKey: i,
  onShowToast: u
}) {
  const [d, h] = I(""), [f, k] = I(null), [v, S] = I(!1), _ = async () => {
    if (!d.trim() || v) return;
    S(!0), k(null), u?.("Validating access key...", "info");
    const D = await va(d, i);
    D.success || (k(D.error || "Failed to validate key"), u?.(D.error || "Invalid access key", "error"), S(!1));
  };
  return /* @__PURE__ */ w(
    pe,
    {
      isOpen: n,
      title: "Settings",
      onClose: r,
      onConfirm: r,
      confirmLabel: "Close",
      cancelLabel: "Close",
      children: [
        /* @__PURE__ */ w("div", { className: "settings-section", children: [
          /* @__PURE__ */ l("h4", { className: "settings-section-title", children: "User Management" }),
          /* @__PURE__ */ w("div", { className: "settings-field", children: [
            /* @__PURE__ */ l("label", { className: "settings-field-label", children: "Enter New Key" }),
            /* @__PURE__ */ w("div", { className: "settings-field-input-group", children: [
              /* @__PURE__ */ l(
                "input",
                {
                  type: "password",
                  name: "key",
                  autoComplete: "key",
                  className: "settings-text-input",
                  value: d,
                  onChange: (D) => {
                    h(D.target.value), k(null);
                  },
                  onKeyDown: (D) => {
                    D.key === "Enter" && d && !v && _();
                  },
                  placeholder: "Enter authentication key",
                  disabled: v
                }
              ),
              d && /* @__PURE__ */ l(
                "button",
                {
                  className: "settings-field-button",
                  onClick: _,
                  disabled: v,
                  children: v ? /* @__PURE__ */ l("span", { className: "spinner" }) : "↵"
                }
              )
            ] }),
            f && /* @__PURE__ */ l("span", { className: "settings-error", children: f })
          ] })
        ] }),
        /* @__PURE__ */ w("div", { className: "settings-section", children: [
          /* @__PURE__ */ l("h4", { className: "settings-section-title", children: "Preferences" }),
          /* @__PURE__ */ w("label", { className: "settings-option", children: [
            /* @__PURE__ */ l(
              "input",
              {
                type: "checkbox",
                checked: t.experimentalThemes || !1,
                onChange: (D) => {
                  o({ experimentalThemes: D.target.checked });
                }
              }
            ),
            /* @__PURE__ */ w("span", { className: "settings-label", children: [
              /* @__PURE__ */ l("strong", { children: "Experimental Themes" }),
              /* @__PURE__ */ l("span", { className: "settings-description", children: "Enable access to experimental theme options" })
            ] })
          ] }),
          /* @__PURE__ */ w("label", { className: "settings-option", children: [
            /* @__PURE__ */ l(
              "input",
              {
                type: "checkbox",
                checked: t.alwaysVerticalLayout || !1,
                onChange: (D) => {
                  o({ alwaysVerticalLayout: D.target.checked });
                }
              }
            ),
            /* @__PURE__ */ w("span", { className: "settings-label", children: [
              /* @__PURE__ */ l("strong", { children: "Always Use Vertical Layout" }),
              /* @__PURE__ */ l("span", { className: "settings-description", children: "Use mobile-style vertical task layout on all devices" })
            ] })
          ] }),
          /* @__PURE__ */ w("label", { className: "settings-option", children: [
            /* @__PURE__ */ l(
              "input",
              {
                type: "checkbox",
                checked: !e,
                onChange: (D) => {
                  o({ showCompleteButton: !D.target.checked });
                }
              }
            ),
            /* @__PURE__ */ w("span", { className: "settings-label", children: [
              /* @__PURE__ */ l("strong", { children: "Disable Complete Button" }),
              /* @__PURE__ */ l("span", { className: "settings-description", children: "Hide the checkmark (✓) button on task items" })
            ] })
          ] }),
          /* @__PURE__ */ w("label", { className: "settings-option", children: [
            /* @__PURE__ */ l(
              "input",
              {
                type: "checkbox",
                checked: !a,
                onChange: (D) => {
                  o({ showDeleteButton: !D.target.checked });
                }
              }
            ),
            /* @__PURE__ */ w("span", { className: "settings-label", children: [
              /* @__PURE__ */ l("strong", { children: "Disable Delete Button" }),
              /* @__PURE__ */ l("span", { className: "settings-description", children: "Hide the delete (×) button on task items" })
            ] })
          ] }),
          /* @__PURE__ */ w("label", { className: "settings-option", children: [
            /* @__PURE__ */ l(
              "input",
              {
                type: "checkbox",
                checked: s,
                onChange: (D) => {
                  o({ showTagButton: D.target.checked });
                }
              }
            ),
            /* @__PURE__ */ w("span", { className: "settings-label", children: [
              /* @__PURE__ */ l("strong", { children: "Enable Tag Button" }),
              /* @__PURE__ */ l("span", { className: "settings-description", children: "Show tag button on task items" })
            ] })
          ] })
        ] })
      ]
    }
  );
}
function ba({
  isOpen: n,
  taskId: t,
  currentTag: e,
  editTagInput: a,
  boards: s,
  currentBoardId: r,
  onClose: o,
  onConfirm: i,
  onInputChange: u,
  onToggleTagPill: d
}) {
  const f = s?.boards?.find((S) => S.id === r)?.tags || [], k = e?.split(" ").filter(Boolean) || [], v = (S) => {
    S.key === "Enter" && (S.preventDefault(), i());
  };
  return /* @__PURE__ */ l(
    pe,
    {
      isOpen: n,
      title: "Edit Tags",
      onClose: o,
      onConfirm: i,
      confirmLabel: "Save",
      cancelLabel: "Cancel",
      children: /* @__PURE__ */ w("div", { className: "edit-tag-modal", children: [
        f.length > 0 && /* @__PURE__ */ w("div", { className: "edit-tag-pills", children: [
          /* @__PURE__ */ l("label", { className: "edit-tag-label", children: "Select Tags" }),
          /* @__PURE__ */ l("div", { className: "edit-tag-pills-container", children: [...f].sort().map((S) => {
            const _ = k.includes(S);
            return /* @__PURE__ */ w(
              "button",
              {
                className: `edit-tag-pill ${_ ? "active" : ""}`,
                onClick: () => d(S),
                type: "button",
                children: [
                  "#",
                  S
                ]
              },
              S
            );
          }) })
        ] }),
        /* @__PURE__ */ w("div", { className: "edit-tag-field", children: [
          /* @__PURE__ */ l("label", { className: "edit-tag-label", children: "Add New Tag" }),
          /* @__PURE__ */ l(
            "input",
            {
              type: "text",
              className: "edit-tag-input",
              value: a,
              onChange: (S) => u(S.target.value),
              onKeyDown: v,
              placeholder: "Enter a tag",
              autoFocus: !0
            }
          ),
          /* @__PURE__ */ w("div", { className: "edit-tag-hint", children: [
            /* @__PURE__ */ l("div", { children: '"one tag" → #one-tag' }),
            /* @__PURE__ */ l("div", { children: '"#two #tags" → #two #tags' })
          ] })
        ] })
      ] })
    }
  );
}
function Qe({
  isOpen: n,
  x: t,
  y: e,
  items: a,
  className: s = "board-context-menu"
}) {
  return n ? /* @__PURE__ */ l(
    "div",
    {
      className: s,
      style: {
        left: `${t}px`,
        top: `${e}px`
      },
      children: a.map((r, o) => /* @__PURE__ */ l(
        "button",
        {
          className: `context-menu-item ${r.isDanger ? "context-menu-item--danger" : ""}`,
          onClick: r.onClick,
          children: r.label
        },
        o
      ))
    }
  ) : null;
}
function Ea({
  isOpen: n,
  boardId: t,
  x: e,
  y: a,
  boards: s,
  onClose: r,
  onDeleteBoard: o
}) {
  return /* @__PURE__ */ l(
    Qe,
    {
      isOpen: n,
      x: e,
      y: a,
      items: [
        {
          label: "🗑️ Delete Board",
          isDanger: !0,
          onClick: async () => {
            if (!t) return;
            const u = s?.boards?.find((d) => d.id === t)?.name || t;
            if (confirm(`Delete board "${u}"? All tasks on this board will be permanently deleted.`))
              try {
                await o(t), r();
              } catch (d) {
                c.error("[BoardContextMenu] Failed to delete board", {
                  error: d instanceof Error ? d.message : String(d),
                  boardId: t
                }), alert(d.message || "Failed to delete board");
              }
          }
        }
      ]
    }
  );
}
function Ca({ isOpen: n, tag: t, x: e, y: a, onClose: s, onDeleteTag: r }) {
  return /* @__PURE__ */ l(
    Qe,
    {
      isOpen: n,
      x: e,
      y: a,
      className: "tag-context-menu",
      items: [
        {
          label: "🗑️ Delete Tag",
          isDanger: !0,
          onClick: async () => {
            if (c.info("[TagContextMenu] Delete Tag clicked", { tag: t }), !t) {
              c.error("[TagContextMenu] No tag when Delete clicked");
              return;
            }
            try {
              c.info("[TagContextMenu] Calling deleteTag", { tag: t }), await r(t), c.info("[TagContextMenu] deleteTag completed successfully", { tag: t }), s();
            } catch (i) {
              c.error("[TagContextMenu] Failed to delete tag", {
                error: i instanceof Error ? i.message : String(i),
                tag: t
              }), alert(i.message || "Failed to delete tag");
            }
          }
        }
      ]
    }
  );
}
const ze = [
  // Everyday tasks
  "Pick up kids after school...",
  "Buy groceries for the week...",
  "Call mom...",
  "Schedule dentist appointment...",
  "Water the plants...",
  "Take out the trash...",
  "Walk the dog...",
  "Do the laundry...",
  "Clean the kitchen...",
  "Pay electric bill...",
  "Reply to emails...",
  "Vacuum the living room...",
  "Change air filters...",
  "Organize closet...",
  "Return library books...",
  // Work/Professional
  "Finish quarterly report...",
  "Review PR #847...",
  "Prepare presentation slides...",
  "Update project documentation...",
  "Schedule team meeting...",
  "Follow up with client...",
  "Review design mockups...",
  "Deploy to production...",
  "Write unit tests...",
  "Refactor authentication module...",
  "Update dependencies...",
  "Fix that annoying bug...",
  "Optimize database queries...",
  "Code review for Sarah's PR...",
  "Update README with new features...",
  // Health & Fitness
  "Go for a 30-minute run...",
  "Meal prep for the week...",
  "Take vitamins...",
  "Stretch for 10 minutes...",
  "Drink 8 glasses of water...",
  "Go to the gym...",
  "Try that new yoga class...",
  "Book physical checkup...",
  // Learning & Development
  "Read one chapter of that book...",
  "Watch TypeScript tutorial...",
  "Practice guitar for 20 minutes...",
  "Complete online course module...",
  "Learn 10 new vocabulary words...",
  "Study for certification exam...",
  "Watch conference talk on React...",
  "Read research paper on AI...",
  // Gaming & Entertainment
  "Beat Elden Ring...",
  "Finish that side quest...",
  "Watch new episode of favorite show...",
  "Catch up on Twitch streams...",
  "Beat that boss fight...",
  "100% completion on Tears of the Kingdom...",
  "Platinum trophy for God of War...",
  "Finally finish Baldur's Gate 3...",
  "Stream that new indie game...",
  // Creative Projects
  "Write blog post about productivity...",
  "Edit vacation photos...",
  "Record podcast episode...",
  "Design new logo concept...",
  "Sketch character ideas...",
  "Compose that song stuck in my head...",
  "Paint the sunset from last week...",
  "Write 500 words of the novel...",
  // Home Projects
  "Fix squeaky door hinge...",
  "Install smart light switches...",
  "Paint the bedroom...",
  "Assemble new bookshelf...",
  "Hang picture frames...",
  "Organize garage...",
  "Plant herb garden...",
  "Repair leaky faucet...",
  // Social & Relationships
  "Text friend about coffee meetup...",
  "Plan date night...",
  "Buy birthday present for Alex...",
  "Write thank you note...",
  "Call grandma...",
  "RSVP to wedding invite...",
  "Organize game night...",
  "Catch up with old college roommate...",
  // Financial
  "Review monthly budget...",
  "File expense reports...",
  "Update investment portfolio...",
  "Cancel unused subscriptions...",
  "Set up auto-pay for utilities...",
  "Check credit score...",
  "Research new credit cards...",
  // Travel & Adventure
  "Book flight for summer vacation...",
  "Research hotels in Tokyo...",
  "Apply for passport renewal...",
  "Create packing list...",
  "Download offline maps...",
  "Learn basic phrases in Spanish...",
  // Tech & Gadgets
  "Back up phone photos to cloud...",
  "Clean up desktop files...",
  "Update all passwords...",
  "Set up two-factor authentication...",
  "Organize browser bookmarks...",
  "Clear out old emails...",
  "Install security updates...",
  "Configure smart home routines...",
  // Random & Funny
  "Become internet famous...",
  "Invent time travel...",
  "Learn to juggle chainsaws...",
  "Train cat to use toilet...",
  "Perfect sourdough starter...",
  "Win argument with internet stranger...",
  "Convince plants I'm a good parent...",
  "Finally understand Git rebase...",
  "Achieve inbox zero (impossible)...",
  "Resist buying another mechanical keyboard...",
  "Stop adding tasks and actually do them..."
];
function xa() {
  return ze[Math.floor(Math.random() * ze.length)];
}
function Da(n, t) {
  const e = n.trim();
  return e ? t.map((s) => s.id.toLowerCase()).includes(e.toLowerCase()) ? `Board "${e}" already exists` : null : "Board name cannot be empty";
}
function Ba(n = {}) {
  const {
    userType: t = "public",
    sessionId: e = "public",
    userName: a,
    onKeyValidation: s
  } = n, r = ye(null), o = ye(null), [i] = I(() => typeof window < "u" && window.matchMedia ? window.matchMedia("(prefers-color-scheme: dark)").matches : !1), u = la(), [d] = I(() => xa()), [h, f] = I(/* @__PURE__ */ new Set()), [k, v] = I(!1), [S, _] = I(() => t === "public" && (typeof window < "u" ? localStorage.getItem("currentSessionId") : null) || e), {
    preferences: D,
    savePreferences: j,
    preferencesLoaded: F,
    isDarkTheme: H,
    setPreferences: z,
    setPreferencesLoaded: J
  } = na(t, S, !0), {
    theme: q,
    showThemePicker: re,
    setShowThemePicker: ie,
    THEME_FAMILIES: ae,
    setTheme: T,
    isThemeReady: E,
    isInitialThemeLoad: x
  } = ia(D, j, o, F), p = u || D.alwaysVerticalLayout || !1, y = D.showCompleteButton ?? !0, B = D.showDeleteButton ?? !0, M = D.showTagButton ?? !1, {
    tasks: N,
    pendingOperations: A,
    initialLoad: R,
    addTask: U,
    completeTask: b,
    deleteTask: K,
    updateTaskTags: P,
    bulkUpdateTaskTags: V,
    deleteTag: Q,
    boards: ne,
    currentBoardId: oe,
    createBoard: et,
    deleteBoard: tt,
    switchBoard: at,
    moveTasksToBoard: Be,
    createTagOnBoard: Ne,
    deleteTagOnBoard: nt
  } = qt({ userType: t, sessionId: S }), O = Xt({
    tasks: N,
    onTaskUpdate: P,
    onBulkUpdate: V
  }), ge = Yt(), m = ca(), { toasts: st, showToast: he, dismissToast: rt } = xt();
  Je(
    { current: null },
    // Board context menu doesn't need a ref
    !!m.boardContextMenu,
    () => m.setBoardContextMenu(null),
    ".board-context-menu"
  ), Je(
    { current: null },
    // Tag context menu doesn't need a ref
    !!m.tagContextMenu,
    () => m.setTagContextMenu(null),
    ".tag-context-menu"
  ), te(() => {
    f(/* @__PURE__ */ new Set());
  }, [oe]), te(() => {
    async function C() {
      c.info("[App] Initializing session...", { userType: t, sessionId: e });
      const L = Ee(), $ = await Dt(e, t);
      let W = e;
      if (t === "public") {
        W = Ee() || e;
        const Y = await de("public", W).getPreferences();
        Y && z(Y), J(!0);
      } else {
        W = e;
        const ce = de(t, W), Y = await ce.getPreferences();
        Y && Y.updatedAt !== void 0 ? (c.info("[App] Using device-specific localStorage preferences"), z(Y)) : $ && (c.info("[App] No localStorage data, using server preferences"), z($), await ce.savePreferences($)), J(!0), L && L !== e && (c.info("[App] SessionId changed, clearing old storage"), Bt(L, t)), a ? he(`Welcome back, ${a}`, "success") : t === "friend" ? he("Welcome back!", "success") : t === "admin" && he("Welcome back, Admin", "success");
      }
      W !== S && _(W), await R(), v(!0);
    }
    C();
  }, [t, e]);
  const ot = async (C) => {
    await U(C) && r.current && (r.current.value = "", r.current.focus());
  }, it = (C) => {
    const L = N.filter(($) => $.tag?.split(" ").includes(C));
    m.setConfirmClearTag({ tag: C, count: L.length });
  }, ct = async (C) => {
    const L = C.trim().replace(/\s+/g, "-");
    try {
      if (await Ne(L), m.pendingTaskOperation?.type === "apply-tag" && m.pendingTaskOperation.taskIds.length > 0) {
        const $ = m.pendingTaskOperation.taskIds.map((W) => {
          const Y = N.find((pt) => pt.id === W)?.tag?.split(" ").filter(Boolean) || [], se = [.../* @__PURE__ */ new Set([...Y, L])];
          return { taskId: W, tag: se.join(" ") };
        });
        await V($), O.clearSelection();
      }
      m.setPendingTaskOperation(null), m.setShowNewTagDialog(!1), m.setInputValue("");
    } catch ($) {
      throw c.error("[App] Failed to create tag", {
        error: $ instanceof Error ? $.message : String($)
      }), $;
    }
  }, lt = (C) => {
    const L = N.find(($) => $.id === C);
    L && (m.setEditTagModal({ taskId: C, currentTag: L.tag || null }), m.setEditTagInput(""));
  }, dt = async () => {
    if (!m.editTagModal) return;
    const { taskId: C, currentTag: L } = m.editTagModal, $ = L?.split(" ").filter(Boolean) || [], W = m.editTagInput.trim() ? m.editTagInput.trim().replace(/\s+/g, "-").split("#").filter(Boolean).map((se) => se.trim()) : [];
    for (const se of W)
      await Ne(se);
    const Y = [.../* @__PURE__ */ new Set([...$, ...W])].sort().join(" ");
    await P(C, { tag: Y }), m.setEditTagModal(null), m.setEditTagInput("");
  }, ut = (C) => {
    if (!m.editTagModal) return;
    const { taskId: L, currentTag: $ } = m.editTagModal, W = $?.split(" ").filter(Boolean) || [];
    if (W.includes(C)) {
      const Y = W.filter((se) => se !== C).sort().join(" ");
      m.setEditTagModal({ taskId: L, currentTag: Y });
    } else {
      const Y = [...W, C].sort().join(" ");
      m.setEditTagModal({ taskId: L, currentTag: Y });
    }
  }, Ae = (C) => Da(C, ne?.boards || []), gt = async (C) => {
    const L = C.trim(), $ = Ae(L);
    if ($) {
      m.setValidationError($);
      return;
    }
    try {
      await et(L), m.pendingTaskOperation?.type === "move-to-board" && m.pendingTaskOperation.taskIds.length > 0 && (await Be(L, m.pendingTaskOperation.taskIds), O.clearSelection()), m.setPendingTaskOperation(null), m.setValidationError(null), m.setShowNewBoardDialog(!1), m.setInputValue("");
    } catch (W) {
      c.error("[App] Failed to create board", {
        error: W instanceof Error ? W.message : String(W)
      }), m.setValidationError(W.message || "Failed to create board");
    }
  }, ht = ne?.boards?.find((C) => C.id === oe)?.tags || [], ft = Array.from(/* @__PURE__ */ new Set([...ht, ...Ge(N)])), mt = jt(N, p ? 3 : 6);
  return !k || x && !E || !F ? /* @__PURE__ */ l(da, { isDarkTheme: i }) : /* @__PURE__ */ l(
    "div",
    {
      ref: o,
      className: "task-app-container task-app-fade-in",
      "data-dark-theme": H ? "true" : "false",
      onMouseDown: O.selectionStartHandler,
      onMouseMove: O.selectionMoveHandler,
      onMouseUp: O.selectionEndHandler,
      onMouseLeave: O.selectionEndHandler,
      onClick: (C) => {
        try {
          const L = C.target;
          if (L.closest && L.closest(".theme-picker"))
            return;
          if (!L.closest || !L.closest(".task-app__item")) {
            if (O.selectionJustEndedAt && Date.now() - O.selectionJustEndedAt < Gt)
              return;
            O.clearSelection();
          }
        } catch {
        }
      },
      children: /* @__PURE__ */ w("div", { className: "task-app", children: [
        /* @__PURE__ */ l(
          ua,
          {
            theme: q,
            experimentalThemes: D.experimentalThemes || !1,
            showThemePicker: re,
            onThemePickerToggle: () => ie(!re),
            onThemeChange: T,
            onSettingsClick: () => m.setShowSettingsModal(!0),
            THEME_FAMILIES: ae
          }
        ),
        /* @__PURE__ */ l(
          ha,
          {
            boards: ne,
            currentBoardId: oe,
            userType: t,
            dragOverFilter: O.dragOverFilter,
            onBoardSwitch: at,
            onBoardContextMenu: (C, L, $) => m.setBoardContextMenu({ boardId: C, x: L, y: $ }),
            onDragOverFilter: O.setDragOverFilter,
            onMoveTasksToBoard: Be,
            onClearSelection: O.clearSelection,
            onCreateBoardClick: () => {
              m.setInputValue(""), m.setValidationError(null), m.setShowNewBoardDialog(!0);
            },
            onPendingOperation: m.setPendingTaskOperation,
            onInitialLoad: R,
            onShowToast: he
          }
        ),
        /* @__PURE__ */ l("div", { className: "task-app__controls", children: /* @__PURE__ */ l(
          "input",
          {
            ref: r,
            className: "task-app__input",
            placeholder: d,
            onKeyDown: (C) => {
              C.key === "Enter" && !C.shiftKey && (C.preventDefault(), ot(C.target.value)), C.key === "k" && (C.ctrlKey || C.metaKey) && (C.preventDefault(), r.current?.focus());
            }
          }
        ) }),
        /* @__PURE__ */ l(
          ma,
          {
            tags: ft,
            selectedFilters: h,
            dragOverFilter: O.dragOverFilter,
            onToggleFilter: (C) => {
              f((L) => {
                const $ = new Set(L);
                return $.has(C) ? $.delete(C) : $.add(C), $;
              });
            },
            onTagContextMenu: (C, L, $) => m.setTagContextMenu({ tag: C, x: L, y: $ }),
            onDragOver: O.onFilterDragOver,
            onDragLeave: O.onFilterDragLeave,
            onDrop: O.onFilterDrop,
            onCreateTagClick: () => {
              m.setInputValue(""), m.setShowNewTagDialog(!0);
            },
            onPendingOperation: m.setPendingTaskOperation
          }
        ),
        /* @__PURE__ */ l(
          ka,
          {
            tasks: N,
            topTags: mt,
            isMobile: p,
            filters: Array.from(h),
            selectedIds: O.selectedIds,
            onSelectionStart: O.selectionStartHandler,
            onSelectionMove: O.selectionMoveHandler,
            onSelectionEnd: O.selectionEndHandler,
            sortDirections: ge.sortDirections,
            dragOverTag: O.dragOverTag,
            pendingOperations: A,
            onComplete: b,
            onDelete: K,
            onEditTag: lt,
            onDragStart: O.onDragStart,
            onDragEnd: O.onDragEnd,
            onDragOver: O.onDragOver,
            onDragLeave: O.onDragLeave,
            onDrop: O.onDrop,
            toggleSort: ge.toggleSort,
            sortTasksByAge: ge.sortTasksByAge,
            getSortIcon: ge.getSortIcon,
            getSortTitle: ge.getSortTitle,
            deleteTag: it,
            onDeletePersistedTag: nt,
            showCompleteButton: y,
            showDeleteButton: B,
            showTagButton: M
          }
        ),
        O.isSelecting && O.marqueeRect && /* @__PURE__ */ l(
          "div",
          {
            className: "marquee-overlay",
            style: {
              left: `${O.marqueeRect.x}px`,
              top: `${O.marqueeRect.y}px`,
              width: `${O.marqueeRect.w}px`,
              height: `${O.marqueeRect.h}px`
            }
          }
        ),
        /* @__PURE__ */ l(
          Ta,
          {
            tag: m.confirmClearTag?.tag || null,
            count: m.confirmClearTag?.count || 0,
            isOpen: !!m.confirmClearTag,
            onClose: () => m.setConfirmClearTag(null),
            onConfirm: Q
          }
        ),
        /* @__PURE__ */ l(
          ya,
          {
            isOpen: m.showNewBoardDialog,
            inputValue: m.inputValue,
            validationError: m.validationError,
            pendingTaskOperation: m.pendingTaskOperation,
            onClose: () => {
              m.setShowNewBoardDialog(!1), m.setPendingTaskOperation(null), m.setValidationError(null);
            },
            onConfirm: gt,
            onInputChange: (C) => {
              m.setInputValue(C), m.setValidationError(null);
            },
            validateBoardName: Ae
          }
        ),
        /* @__PURE__ */ l(
          wa,
          {
            isOpen: m.showNewTagDialog,
            inputValue: m.inputValue,
            tasks: N,
            pendingTaskOperation: m.pendingTaskOperation,
            onClose: () => {
              m.setShowNewTagDialog(!1), m.setPendingTaskOperation(null);
            },
            onConfirm: ct,
            onInputChange: m.setInputValue
          }
        ),
        /* @__PURE__ */ l(
          Sa,
          {
            isOpen: m.showSettingsModal,
            preferences: D,
            showCompleteButton: y,
            showDeleteButton: B,
            showTagButton: M,
            onClose: () => m.setShowSettingsModal(!1),
            onSavePreferences: j,
            onValidateKey: async (C) => await de(t, S).validateKey(C),
            onShowToast: he
          }
        ),
        /* @__PURE__ */ l(
          ba,
          {
            isOpen: !!m.editTagModal,
            taskId: m.editTagModal?.taskId || null,
            currentTag: m.editTagModal?.currentTag || null,
            editTagInput: m.editTagInput,
            boards: ne,
            currentBoardId: oe,
            onClose: () => {
              m.setEditTagModal(null), m.setEditTagInput("");
            },
            onConfirm: dt,
            onInputChange: m.setEditTagInput,
            onToggleTagPill: ut
          }
        ),
        /* @__PURE__ */ l(
          Ea,
          {
            isOpen: !!m.boardContextMenu,
            boardId: m.boardContextMenu?.boardId || null,
            x: m.boardContextMenu?.x || 0,
            y: m.boardContextMenu?.y || 0,
            boards: ne,
            onClose: () => m.setBoardContextMenu(null),
            onDeleteBoard: tt
          }
        ),
        /* @__PURE__ */ l(
          Ca,
          {
            isOpen: !!m.tagContextMenu,
            tag: m.tagContextMenu?.tag || null,
            x: m.tagContextMenu?.x || 0,
            y: m.tagContextMenu?.y || 0,
            onClose: () => m.setTagContextMenu(null),
            onDeleteTag: Q
          }
        ),
        /* @__PURE__ */ l(Et, { toasts: st, onDismiss: rt, position: "bottom-center" })
      ] })
    }
  );
}
class Na extends yt {
  constructor(t) {
    super(t), this.state = { hasError: !1 };
  }
  static getDerivedStateFromError(t) {
    return { hasError: !0, error: t };
  }
  componentDidCatch(t, e) {
    c.error("[ErrorBoundary] Caught error", {
      error: t.message,
      stack: t.stack,
      componentStack: e.componentStack
    });
  }
  render() {
    return this.state.hasError ? this.props.fallback ? this.props.fallback : /* @__PURE__ */ w(
      "div",
      {
        style: {
          padding: "20px",
          textAlign: "center",
          color: "var(--color-text-primary, #333)"
        },
        children: [
          /* @__PURE__ */ l("h2", { children: "Something went wrong" }),
          /* @__PURE__ */ l("p", { style: { color: "var(--color-text-secondary, #666)" }, children: this.state.error?.message || "An unexpected error occurred" }),
          /* @__PURE__ */ l(
            "button",
            {
              onClick: () => window.location.reload(),
              style: {
                marginTop: "12px",
                padding: "8px 16px",
                background: "var(--color-primary, #3b82f6)",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer"
              },
              children: "Reload Page"
            }
          )
        ]
      }
    ) : this.props.children;
  }
}
function La(n, t = {}) {
  const e = new URLSearchParams(window.location.search), a = t.userType || e.get("userType") || "admin", s = t.sessionId || "public-session", r = { ...t, userType: a, sessionId: s }, o = Tt(n);
  o.render(
    /* @__PURE__ */ l(Na, { children: /* @__PURE__ */ l(Ba, { ...r }) })
  ), n.__root = o, c.info("[task-app] Mounted successfully", r);
}
function Oa(n) {
  n.__root?.unmount();
}
export {
  La as mount,
  Oa as unmount
};
