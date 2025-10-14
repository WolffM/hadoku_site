import { jsxs as A, jsx as k, Fragment as Pt } from "react/jsx-runtime";
import { createRoot as Rt } from "react-dom/client";
import { useState as N, useMemo as Ut, useEffect as st, useRef as pt } from "react";
function Jt() {
  const t = Date.now().toString(36).toUpperCase().padStart(8, "0"), e = Array.from(crypto.getRandomValues(new Uint8Array(16))).map((n) => (n % 36).toString(36).toUpperCase()).join("");
  return t + e.slice(0, 18);
}
function I(t, e, n = 50) {
  setTimeout(() => {
    try {
      const s = new BroadcastChannel("tasks");
      s.postMessage({ type: t, ...e }), s.close();
    } catch (s) {
      console.error("[localStorageApi] Broadcast failed:", s);
    }
  }, n);
}
const Tt = (t, e, n) => `${t}-${e}-${n}-tasks`, wt = (t, e, n) => `${t}-${e}-${n}-stats`, _t = (t, e) => `${t}-${e}-boards`;
function at(t = "public", e = "public", n = "main") {
  const s = localStorage.getItem(Tt(t, e, n));
  return s ? JSON.parse(s) : {
    version: 1,
    updatedAt: (/* @__PURE__ */ new Date()).toISOString(),
    tasks: []
  };
}
function nt(t, e = "public", n = "public", s = "main") {
  t.updatedAt = (/* @__PURE__ */ new Date()).toISOString(), localStorage.setItem(Tt(e, n, s), JSON.stringify(t));
}
function ht(t = "public", e = "public", n = "main") {
  const s = localStorage.getItem(wt(t, e, n));
  return s ? JSON.parse(s) : {
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
function kt(t, e = "public", n = "public", s = "main") {
  t.updatedAt = (/* @__PURE__ */ new Date()).toISOString(), localStorage.setItem(wt(e, n, s), JSON.stringify(t));
}
function lt(t, e, n = "public", s = "public", a = "main") {
  const o = ht(n, s, a);
  o.counters[t]++, o.timeline.push({
    t: (/* @__PURE__ */ new Date()).toISOString(),
    event: t,
    id: e.id
  }), o.tasks[e.id] = {
    id: e.id,
    title: e.title,
    tag: e.tag,
    state: e.state,
    createdAt: e.createdAt,
    updatedAt: e.updatedAt,
    closedAt: e.closedAt
  }, kt(o, n, s, a);
}
function tt(t = "public", e = "public") {
  const n = localStorage.getItem(_t(t, e));
  return n ? JSON.parse(n) : { version: 1, updatedAt: (/* @__PURE__ */ new Date()).toISOString(), boards: [] };
}
function et(t, e = "public", n = "public") {
  t.updatedAt = (/* @__PURE__ */ new Date()).toISOString(), localStorage.setItem(_t(e, n), JSON.stringify(t));
}
function jt(t = "public", e = "public") {
  return {
    async getBoards() {
      const n = tt(t, e);
      if (!n.boards || n.boards.length === 0) {
        const a = { id: "main", name: "main", tasks: [], stats: void 0, tags: [] };
        n.boards = [a], et(n, t, e), nt({ version: 1, updatedAt: (/* @__PURE__ */ new Date()).toISOString(), tasks: [] }, t, e, "main"), kt({ version: 2, updatedAt: (/* @__PURE__ */ new Date()).toISOString(), counters: { created: 0, completed: 0, edited: 0, deleted: 0 }, timeline: [], tasks: {} }, t, e, "main");
      }
      const s = { version: n.version, updatedAt: n.updatedAt, boards: [] };
      for (const a of n.boards) {
        const o = at(t, e, a.id), c = ht(t, e, a.id), i = { id: a.id, name: a.name, tasks: o.tasks, stats: c, tags: a.tags || [] };
        s.boards.push(i);
      }
      return s;
    },
    async createBoard(n) {
      const s = tt(t, e);
      if (console.debug("[localStorageApi] createBoard", { userType: t, userId: e, boardId: n, existing: s.boards.map((o) => o.id) }), s.boards.find((o) => o.id === n))
        throw new Error("Board already exists");
      const a = { id: n, name: n, tasks: [], stats: void 0, tags: [] };
      return s.boards.push(a), et(s, t, e), nt({ version: 1, updatedAt: (/* @__PURE__ */ new Date()).toISOString(), tasks: [] }, t, e, n), kt({ version: 2, updatedAt: (/* @__PURE__ */ new Date()).toISOString(), counters: { created: 0, completed: 0, edited: 0, deleted: 0 }, timeline: [], tasks: {} }, t, e, n), I("boards-updated", { sessionId: E, userType: t, userId: e }), a;
    },
    async deleteBoard(n) {
      const s = tt(t, e), a = s.boards.findIndex((o) => o.id === n);
      if (a === -1) throw new Error("Board not found");
      s.boards.splice(a, 1), et(s, t, e), localStorage.removeItem(Tt(t, e, n)), localStorage.removeItem(wt(t, e, n)), I("boards-updated", { sessionId: E, userType: t, userId: e });
    },
    async getTasks(n = "main") {
      return at(t, e, n);
    },
    async getStats(n = "main") {
      return ht(t, e, n);
    },
    async createTask(n, s = "main", a = !1) {
      const o = at(t, e, s), c = (/* @__PURE__ */ new Date()).toISOString(), i = {
        id: Jt(),
        title: n.title,
        tag: n.tag || null,
        state: "Active",
        createdAt: c,
        updatedAt: c,
        closedAt: null
      };
      if (o.tasks.push(i), nt(o, t, e, s), n.tag) {
        const T = tt(t, e), S = T.boards.find((p) => p.id === s);
        if (S) {
          const p = S.tags || [], b = n.tag.split(" ").filter(Boolean).filter((O) => !p.includes(O));
          b.length && (S.tags = [...p, ...b], et(T, t, e));
        }
      }
      return lt("created", i, t, e, s), a ? console.log("[localStorageApi] createTask: broadcast suppressed") : (console.log("[localStorageApi] createTask: broadcasting update", { sessionId: E, boardId: s, taskId: i.id }), I("tasks-updated", { sessionId: E, userType: t, userId: e, boardId: s })), i;
    },
    async patchTask(n, s, a = "main", o = !1) {
      const c = at(t, e, a), i = c.tasks.find((T) => T.id === n);
      if (!i)
        throw new Error("Task not found");
      if (s.title !== void 0 && (i.title = s.title), s.tag !== void 0 && (i.tag = s.tag), s.tag !== void 0) {
        const T = tt(t, e), S = T.boards.find((p) => p.id === a);
        if (S) {
          const p = S.tags || [], b = (s.tag || "").split(" ").filter(Boolean).filter((O) => !p.includes(O));
          b.length && (S.tags = [...p, ...b], et(T, t, e));
        }
      }
      return i.updatedAt = (/* @__PURE__ */ new Date()).toISOString(), nt(c, t, e, a), lt("edited", i, t, e, a), o || I("tasks-updated", { sessionId: E, userType: t, userId: e, boardId: a }), i;
    },
    async completeTask(n, s = "main") {
      const a = at(t, e, s), o = a.tasks.find((i) => i.id === n);
      if (!o)
        throw new Error("Task not found");
      const c = (/* @__PURE__ */ new Date()).toISOString();
      return o.state = "Completed", o.updatedAt = c, o.closedAt = c, nt(a, t, e, s), lt("completed", o, t, e, s), I("tasks-updated", { sessionId: E, userType: t, userId: e, boardId: s }), o;
    },
    async deleteTask(n, s = "main", a = !1) {
      console.log("[localStorageApi] deleteTask START", { id: n, boardId: s, suppressBroadcast: a, sessionId: E });
      const o = at(t, e, s), c = o.tasks.find((T) => T.id === n);
      if (!c)
        throw new Error("Task not found");
      const i = (/* @__PURE__ */ new Date()).toISOString();
      return c.state = "Deleted", c.updatedAt = i, c.closedAt = i, nt(o, t, e, s), lt("deleted", c, t, e, s), a ? console.log("[localStorageApi] deleteTask: broadcast suppressed") : (console.log("[localStorageApi] deleteTask: broadcasting", { sessionId: E }), I("tasks-updated", { sessionId: E, userType: t, userId: e, boardId: s })), console.log("[localStorageApi] deleteTask END"), c;
    },
    async createTag(n, s = "main") {
      const a = tt(t, e), o = a.boards.find((i) => i.id === s);
      if (!o) throw new Error("Board not found");
      const c = o.tags || [];
      c.includes(n) || (o.tags = [...c, n], et(a, t, e), I("boards-updated", { sessionId: E, userType: t, userId: e, boardId: s }));
    },
    async deleteTag(n, s = "main") {
      const a = tt(t, e), o = a.boards.find((i) => i.id === s);
      if (!o) throw new Error("Board not found");
      const c = o.tags || [];
      o.tags = c.filter((i) => i !== n), et(a, t, e), I("boards-updated", { sessionId: E, userType: t, userId: e, boardId: s });
    }
  };
}
async function Xt(t, e, n, s) {
  for (const c of e.boards || []) {
    const i = c.id;
    if (c.tasks && c.tasks.length > 0) {
      const T = `${n}-${s}-${i}-tasks`, S = {
        version: 1,
        updatedAt: e.updatedAt || (/* @__PURE__ */ new Date()).toISOString(),
        tasks: c.tasks
      };
      localStorage.setItem(T, JSON.stringify(S));
    }
    if (c.stats) {
      const T = `${n}-${s}-${i}-stats`;
      localStorage.setItem(T, JSON.stringify(c.stats));
    }
  }
  const a = `${n}-${s}-boards`, o = {
    version: 1,
    updatedAt: e.updatedAt || (/* @__PURE__ */ new Date()).toISOString(),
    boards: e.boards.map((c) => ({
      id: c.id,
      name: c.name,
      tags: c.tags || []
    }))
  };
  localStorage.setItem(a, JSON.stringify(o)), console.log("[api] Synced API data to localStorage:", {
    boards: e.boards?.length || 0,
    totalTasks: e.boards?.reduce((c, i) => c + (i.tasks?.length || 0), 0) || 0
  });
}
function V(t, e, n) {
  const s = {
    "Content-Type": "application/json",
    "X-User-Type": t
  };
  return e && (s["X-User-Id"] = e), n && (s["X-Session-Id"] = n), s;
}
function Ht(t = "public", e = "public", n) {
  const s = jt(t, e);
  return t === "public" ? s : {
    // Fetch boards from API, sync to localStorage, return fresh data
    async getBoards() {
      try {
        const a = await fetch(`/task/api/boards?userType=${t}&userId=${encodeURIComponent(e)}`, {
          headers: V(t, e, n)
        });
        if (!a.ok)
          throw new Error(`API returned ${a.status}`);
        const o = await a.json();
        return console.log("[api] Fetched from API:", { boards: o.boards?.length || 0 }), await Xt(s, o, t, e), o;
      } catch (a) {
        return console.warn("[api] API fetch failed, falling back to localStorage:", a), await s.getBoards();
      }
    },
    async getStats(a = "main") {
      try {
        const o = await fetch(`/task/api/stats?userType=${t}&userId=${encodeURIComponent(e)}&boardId=${encodeURIComponent(a)}`, {
          headers: V(t, e, n)
        });
        if (!o.ok)
          throw new Error(`API returned ${o.status}`);
        const c = await o.json();
        console.log("[api] Fetched stats from API:", { boardId: a, counters: c.counters });
        const i = `${t}-${e}-${a}-stats`;
        return s.setItem(i, JSON.stringify(c)), c;
      } catch (o) {
        return console.warn("[api] API fetch failed, falling back to localStorage:", o), await s.getStats(a);
      }
    },
    async createTask(a, o = "main", c = !1) {
      const i = await s.createTask(a, o, c);
      return fetch("/task/api", {
        method: "POST",
        headers: V(t, e, n),
        body: JSON.stringify({
          id: i.id,
          // Send client ID to server
          ...a,
          boardId: o
        })
      }).then((T) => T.json()).then((T) => {
        T.ok && (T.id === i.id ? console.log("[api] Background sync: createTask completed (ID matched)") : console.warn("[api] Server returned different ID (unexpected):", { client: i.id, server: T.id }));
      }).catch((T) => console.error("[api] Failed to sync createTask:", T)), i;
    },
    async createTag(a, o = "main") {
      const c = await s.createTag(a, o);
      return fetch("/task/api/tags", {
        method: "POST",
        headers: V(t, e, n),
        body: JSON.stringify({ boardId: o, tag: a })
      }).then(() => console.log("[api] Background sync: createTag completed")).catch((i) => console.error("[api] Failed to sync createTag:", i)), c;
    },
    async deleteTag(a, o = "main") {
      const c = await s.deleteTag(a, o);
      return fetch("/task/api/tags", {
        method: "DELETE",
        headers: V(t, e, n),
        body: JSON.stringify({ boardId: o, tag: a })
      }).then(() => console.log("[api] Background sync: deleteTag completed")).catch((i) => console.error("[api] Failed to sync deleteTag:", i)), c;
    },
    async patchTask(a, o, c = "main", i = !1) {
      const T = await s.patchTask(a, o, c, i);
      return fetch(`/task/api/${a}`, {
        method: "PATCH",
        headers: V(t, e, n),
        body: JSON.stringify({ ...o, boardId: c })
      }).then(() => console.log("[api] Background sync: patchTask completed")).catch((S) => console.error("[api] Failed to sync patchTask:", S)), T;
    },
    async completeTask(a, o = "main") {
      const c = await s.completeTask(a, o);
      return fetch(`/task/api/${a}/complete`, {
        method: "POST",
        headers: V(t, e, n),
        body: JSON.stringify({ boardId: o })
      }).then(() => console.log("[api] Background sync: completeTask completed")).catch((i) => console.error("[api] Failed to sync completeTask:", i)), c;
    },
    async deleteTask(a, o = "main", c = !1) {
      await s.deleteTask(a, o, c), fetch(`/task/api/${a}`, {
        method: "DELETE",
        headers: V(t, e, n),
        body: JSON.stringify({ boardId: o })
      }).then(() => console.log("[api] Background sync: deleteTask completed")).catch((i) => console.error("[api] Failed to sync deleteTask:", i));
    },
    // Board operations
    async createBoard(a) {
      const o = await s.createBoard(a);
      return fetch("/task/api/boards", {
        method: "POST",
        headers: V(t, e, n),
        body: JSON.stringify({ boardId: a })
      }).then(() => console.log("[api] Background sync: createBoard completed")).catch((c) => console.error("[api] Failed to sync createBoard:", c)), o;
    },
    async deleteBoard(a) {
      const o = await s.deleteBoard(a);
      return fetch(`/task/api/boards/${encodeURIComponent(a)}`, {
        method: "DELETE",
        headers: V(t, e, n)
      }).then(() => console.log("[api] Background sync: deleteBoard completed")).catch((c) => console.error("[api] Failed to sync deleteBoard:", c)), o;
    },
    async getTasks(a = "main") {
      try {
        const o = await fetch(`/task/api/tasks?userType=${t}&userId=${encodeURIComponent(e)}&boardId=${encodeURIComponent(a)}`, {
          headers: V(t, e, n)
        });
        if (!o.ok)
          throw new Error(`API returned ${o.status}`);
        const c = await o.json();
        console.log("[api] Fetched tasks from API:", { boardId: a, tasks: c.tasks?.length || 0 });
        const i = `${t}-${e}-${a}-tasks`;
        return s.setItem(i, JSON.stringify(c)), c;
      } catch (o) {
        return console.warn("[api] API fetch failed, falling back to localStorage:", o), await s.getTasks(a);
      }
    }
  };
}
function Kt(t) {
  t = t.trim();
  const e = (a) => a.trim().replace(/\s+/g, "-"), n = t.match(/^["']([^"']+)["']\s*(.*)$/);
  if (n) {
    const a = n[1].trim(), c = n[2].match(/#[^\s#]+/g)?.map((i) => e(i.slice(1))).filter(Boolean) || [];
    return { title: a, tag: c.length ? c.join(" ") : void 0 };
  }
  const s = t.match(/^(.+?)\s+(#.+)$/);
  if (s) {
    const a = s[1].trim(), c = s[2].match(/#[^\s#]+/g)?.map((i) => e(i.slice(1))).filter(Boolean) || [];
    return { title: a, tag: c.length ? c.join(" ") : void 0 };
  }
  return { title: t.trim() };
}
function qt(t, e = 6, n = []) {
  const s = t.flatMap((o) => o.tag?.split(" ") || []).filter(Boolean), a = {};
  return s.forEach((o) => a[o] = (a[o] || 0) + 1), n.filter(Boolean).forEach((o) => {
    a[o] || (a[o] = 0);
  }), Object.entries(a).sort((o, c) => c[1] - o[1]).slice(0, e).map(([o]) => o);
}
function vt(t, e) {
  return t.filter((n) => n.tag?.split(" ").includes(e));
}
function Yt(t, e, n) {
  const s = Array.isArray(n) && n.length > 0;
  return t.filter((a) => {
    const o = a.tag?.split(" ") || [];
    return s ? n.some((i) => o.includes(i)) && !e.some((i) => o.includes(i)) : !e.some((c) => o.includes(c));
  });
}
function dt(t) {
  return Array.from(new Set(t.flatMap((e) => e.tag?.split(" ") || []).filter(Boolean)));
}
const E = `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
function gt(t, e, n, s = 50) {
  setTimeout(() => {
    try {
      const a = new BroadcastChannel("tasks");
      a.postMessage({ type: "tasks-updated", sessionId: t, userType: e, userId: n }), a.close();
    } catch (a) {
      console.error("[useTasks] Broadcast failed:", a);
    }
  }, s);
}
function zt({ userType: t, userId: e, sessionId: n }) {
  const [s, a] = N([]), [o, c] = N(/* @__PURE__ */ new Set()), i = Ut(
    () => Ht(t, e || "public", n),
    [t, e, n]
  ), [T, S] = N(null), [p, b] = N("main");
  async function O() {
    console.log("[useTasks] initialLoad called"), await _();
  }
  async function _() {
    console.log("[useTasks] reload called", { currentBoardId: p, stack: new Error().stack?.split(`
`).slice(1, 4).join(`
`) });
    const r = await i.getBoards();
    S(r);
    const l = r.boards.find((d) => d.id === p);
    l ? (console.log("[useTasks] reload: found current board", { boardId: l.id, taskCount: l.tasks?.length || 0 }), a((l.tasks || []).filter((d) => d.state === "Active"))) : (console.log("[useTasks] reload: board not found", { currentBoardId: p }), a([]));
  }
  st(() => {
    console.log("[useTasks] User context changed, clearing state and reloading", { userType: t, userId: e }), a([]), c(/* @__PURE__ */ new Set()), S(null), b("main"), _();
  }, [t, e]), st(() => {
    console.log("[useTasks] Setting up BroadcastChannel listener", { currentBoardId: p, userType: t, userId: e });
    try {
      const r = new BroadcastChannel("tasks");
      return r.onmessage = (l) => {
        const d = l.data || {};
        if (console.log("[useTasks] BroadcastChannel message received", { msg: d, sessionId: E, currentBoardId: p, currentContext: { userType: t, userId: e } }), d.sessionId === E) {
          console.log("[useTasks] Ignoring own broadcast message");
          return;
        }
        if (d.userType !== t || d.userId !== e) {
          console.log("[useTasks] Ignoring message for different user context", {
            msgContext: { userType: d.userType, userId: d.userId },
            currentContext: { userType: t, userId: e }
          });
          return;
        }
        (d.type === "tasks-updated" || d.type === "boards-updated") && (console.log("[useTasks] BroadcastChannel: triggering reload for currentBoardId =", p), _());
      }, () => {
        console.log("[useTasks] Cleaning up BroadcastChannel listener", { currentBoardId: p }), r.close();
      };
    } catch (r) {
      console.error("[useTasks] Failed to setup BroadcastChannel", r);
    }
  }, [p, t, e]);
  async function G(r) {
    if (r = r.trim(), !!r)
      try {
        const l = Kt(r);
        return await i.createTask(l, p), await _(), !0;
      } catch (l) {
        return alert(l.message || "Failed to create task"), !1;
      }
  }
  async function H(r) {
    const l = `complete-${r}`;
    if (!o.has(l)) {
      c((d) => /* @__PURE__ */ new Set([...d, l]));
      try {
        await i.completeTask(r, p), await _();
      } catch (d) {
        d?.message?.includes("404") || alert(d.message || "Failed to complete task");
      } finally {
        c((d) => {
          const m = new Set(d);
          return m.delete(l), m;
        });
      }
    }
  }
  async function Y(r) {
    console.log("[useTasks] deleteTask START", { taskId: r, currentBoardId: p });
    const l = `delete-${r}`;
    if (o.has(l)) {
      console.log("[useTasks] deleteTask: already pending, skipping", { operationKey: l });
      return;
    }
    c((d) => /* @__PURE__ */ new Set([...d, l]));
    try {
      console.log("[useTasks] deleteTask: calling api.deleteTask", { taskId: r, currentBoardId: p }), await i.deleteTask(r, p), console.log("[useTasks] deleteTask: calling reload"), await _(), console.log("[useTasks] deleteTask END");
    } catch (d) {
      d?.message?.includes("404") || alert(d.message || "Failed to delete task");
    } finally {
      c((d) => {
        const m = new Set(d);
        return m.delete(l), m;
      });
    }
  }
  async function F(r) {
    const l = prompt("Enter tag (without #):");
    if (!l) return;
    const d = l.trim().replace(/^#+/, "").replace(/\s+/g, "-"), m = s.find((u) => u.id === r);
    if (!m) return;
    const y = m.tag?.split(" ") || [];
    if (y.includes(d)) return;
    const f = [...y, d].join(" ");
    try {
      await i.patchTask(r, { tag: f }, p), await _();
    } catch (u) {
      alert(u.message || "Failed to add tag");
    }
  }
  async function P(r, l, d = {}) {
    const { suppressBroadcast: m = !1, skipReload: y = !1 } = d;
    try {
      await i.patchTask(r, l, p, m), y || await _();
    } catch (f) {
      throw f;
    }
  }
  async function C(r) {
    console.log("[useTasks] bulkUpdateTaskTags START", { count: r.length });
    try {
      for (const { taskId: l, tag: d } of r)
        await i.patchTask(l, { tag: d }, p, !0);
      console.log("[useTasks] bulkUpdateTaskTags: broadcasting bulk update with delay"), gt(E, t, e), console.log("[useTasks] bulkUpdateTaskTags: calling reload"), await _(), console.log("[useTasks] bulkUpdateTaskTags END");
    } catch (l) {
      throw console.error("[useTasks] bulkUpdateTaskTags ERROR", l), l;
    }
  }
  async function M(r) {
    console.log("[useTasks] clearTasksByTag START", { tag: r, currentBoardId: p, taskCount: s.length });
    const l = s.filter((d) => d.tag?.split(" ").includes(r));
    if (console.log("[useTasks] clearTasksByTag: found tasks with tag", { tag: r, count: l.length }), l.length === 0) {
      console.log("[useTasks] clearTasksByTag: no tasks found with this tag, just deleting tag");
      try {
        await i.deleteTag(r, p), await _(), console.log("[useTasks] clearTasksByTag END (no tasks to clear)");
      } catch (d) {
        console.error("[useTasks] clearTasksByTag ERROR", d), console.error("[useTasks] clearTasksByTag: Please fix this error:", d.message);
      }
      return;
    }
    console.log("[useTasks] clearTasksByTag: proceeding without confirmation (dialogs blocked)", { taskCount: l.length });
    try {
      console.log("[useTasks] clearTasksByTag: starting to patch tasks");
      for (const d of l) {
        const m = d.tag?.split(" ") || [], y = m.filter((u) => u !== r), f = y.length > 0 ? y.join(" ") : null;
        console.log("[useTasks] clearTasksByTag: patching task", { taskId: d.id, oldTags: m, newTags: y }), await i.patchTask(d.id, { tag: f }, p, !0);
      }
      console.log("[useTasks] clearTasksByTag: deleting tag from board", { tag: r, currentBoardId: p }), await i.deleteTag(r, p), console.log("[useTasks] clearTasksByTag: broadcasting bulk update with delay"), gt(E, t, e), console.log("[useTasks] clearTasksByTag: calling reload"), await _(), console.log("[useTasks] clearTasksByTag END");
    } catch (d) {
      console.error("[useTasks] clearTasksByTag ERROR", d), alert(d.message || "Failed to remove tag from tasks");
    }
  }
  async function R(r) {
    if (confirm("Clear all remaining tasks?"))
      try {
        for (const l of r)
          await i.deleteTask(l.id, p);
        await _();
      } catch (l) {
        alert(l.message || "Failed to clear remaining tasks");
      }
  }
  async function U(r) {
    await i.createBoard(r), b(r);
    const l = await i.getBoards();
    S(l);
    const d = l.boards.find((m) => m.id === r);
    d ? (console.log("[useTasks] createBoard: switched to new board", { boardId: r, taskCount: d.tasks?.length || 0 }), a((d.tasks || []).filter((m) => m.state === "Active"))) : (console.log("[useTasks] createBoard: new board not found (should be empty)", { boardId: r }), a([]));
  }
  async function J(r, l) {
    if (console.log("[useTasks] moveTasksToBoard START", { targetBoardId: r, ids: l, currentBoardId: p }), !T) return;
    const d = [];
    for (const f of T.boards)
      for (const u of f.tasks || [])
        l.includes(u.id) && d.push({ id: u.id, title: u.title, tag: u.tag || void 0, boardId: f.id });
    console.log("[useTasks] moveTasksToBoard: found tasks to move", { count: d.length });
    for (const f of d)
      await i.createTask({ title: f.title, tag: f.tag }, r, !0), await i.deleteTask(f.id, f.boardId, !0);
    console.log("[useTasks] moveTasksToBoard: broadcasting bulk update with delay"), gt(E, t, e), console.log("[useTasks] moveTasksToBoard: switching to target board", { targetBoardId: r }), b(r);
    const m = await i.getBoards();
    S(m);
    const y = m.boards.find((f) => f.id === r);
    y && (console.log("[useTasks] moveTasksToBoard: loaded target board tasks", { count: y.tasks?.length || 0 }), a((y.tasks || []).filter((f) => f.state === "Active"))), console.log("[useTasks] moveTasksToBoard END");
  }
  async function Q(r) {
    if (await i.deleteBoard(r), p === r) {
      b("main");
      const l = await i.getBoards();
      S(l);
      const d = l.boards.find((m) => m.id === "main");
      d ? (console.log("[useTasks] deleteBoard: switched to main board", { taskCount: d.tasks?.length || 0 }), a((d.tasks || []).filter((m) => m.state === "Active"))) : (console.log("[useTasks] deleteBoard: main board not found"), a([]));
    } else
      await _();
  }
  async function L(r) {
    await i.createTag(r, p), await _();
  }
  async function W(r) {
    await i.deleteTag(r, p), await _();
  }
  function K(r) {
    b(r);
    const l = T?.boards.find((d) => d.id === r);
    l ? a((l.tasks || []).filter((d) => d.state === "Active")) : _();
  }
  return {
    // Task state
    tasks: s,
    pendingOperations: o,
    // Task operations
    addTask: G,
    completeTask: H,
    deleteTask: Y,
    addTagToTask: F,
    updateTaskTags: P,
    bulkUpdateTaskTags: C,
    clearTasksByTag: M,
    clearRemainingTasks: R,
    // Board state
    boards: T,
    currentBoardId: p,
    // Board operations
    createBoard: U,
    deleteBoard: Q,
    switchBoard: K,
    moveTasksToBoard: J,
    createTagOnBoard: L,
    deleteTagOnBoard: W,
    // Lifecycle
    initialLoad: O,
    reload: _
  };
}
function Vt({ tasks: t, onTaskUpdate: e, onBulkUpdate: n }) {
  const [s, a] = N(null), [o, c] = N(null), [i, T] = N(/* @__PURE__ */ new Set()), [S, p] = N(!1), [b, O] = N(null), [_, G] = N(null), H = pt(null);
  function Y(r, l) {
    const d = i.has(l) && i.size > 0 ? Array.from(i) : [l];
    console.log("[useDragAndDrop] onDragStart", { taskId: l, idsToDrag: d, selectedCount: i.size }), r.dataTransfer.setData("text/plain", d[0]);
    try {
      r.dataTransfer.setData("application/x-hadoku-task-ids", JSON.stringify(d));
    } catch {
    }
    r.dataTransfer.effectAllowed = "copyMove";
    try {
      const m = r.currentTarget, y = m.closest && m.closest(".task-app__item") ? m.closest(".task-app__item") : m;
      y.classList.add("dragging");
      const f = y.cloneNode(!0);
      f.style.boxSizing = "border-box", f.style.width = `${y.offsetWidth}px`, f.style.height = `${y.offsetHeight}px`, f.style.opacity = "0.95", f.style.transform = "none", f.style.filter = "drop-shadow(0 6px 18px rgba(0,0,0,0.12))", f.classList.add("drag-image"), f.style.position = "absolute", f.style.top = "-9999px", f.style.left = "-9999px", document.body.appendChild(f), y.__dragImage = f, T((u) => {
        if (u.has(l)) return new Set(u);
        const B = new Set(u);
        return B.add(l), B;
      });
      try {
        const u = y.closest(".task-app__tag-column");
        if (u) {
          const B = u.querySelector(".task-app__tag-header") || u.querySelector("h3"), $ = (B && B.textContent || "").trim().replace(/^#/, "");
          if ($)
            try {
              r.dataTransfer.setData("application/x-hadoku-task-source", $);
            } catch {
            }
        }
      } catch {
      }
      try {
        const u = y.getBoundingClientRect();
        let B = Math.round(r.clientX - u.left), D = Math.round(r.clientY - u.top);
        B = Math.max(0, Math.min(Math.round(f.offsetWidth - 1), B)), D = Math.max(0, Math.min(Math.round(f.offsetHeight - 1), D)), r.dataTransfer.setDragImage(f, B, D);
      } catch {
        r.dataTransfer.setDragImage(f, 0, 0);
      }
    } catch {
    }
  }
  function F(r) {
    try {
      const l = r.currentTarget;
      l.classList.remove("dragging");
      const d = l.__dragImage;
      d && d.parentNode && d.parentNode.removeChild(d), d && delete l.__dragImage;
    } catch {
    }
    try {
      R();
    } catch {
    }
  }
  function P(r) {
    if (r.button === 0) {
      try {
        const l = r.target;
        if (!l || l.closest && l.closest(".task-app__item, .task-app__controls, button, input, textarea, .task-app__item-actions"))
          return;
      } catch {
      }
      p(!0), H.current = { x: r.clientX, y: r.clientY }, O({ x: r.clientX, y: r.clientY, w: 0, h: 0 }), T(/* @__PURE__ */ new Set());
      try {
        document.body.classList.add("marquee-selecting");
      } catch {
      }
    }
  }
  function C(r) {
    if (!S || !H.current) return;
    const l = H.current.x, d = H.current.y, m = r.clientX, y = r.clientY, f = Math.min(l, m), u = Math.min(d, y), B = Math.abs(m - l), D = Math.abs(y - d);
    O({ x: f, y: u, w: B, h: D });
    const $ = Array.from(document.querySelectorAll(".task-app__item")), z = /* @__PURE__ */ new Set();
    for (const q of $) {
      const j = q.getBoundingClientRect();
      if (!(j.right < f || j.left > f + B || j.bottom < u || j.top > u + D)) {
        const ct = q.getAttribute("data-task-id");
        ct && z.add(ct), q.classList.add("selected");
      } else
        q.classList.remove("selected");
    }
    T(z);
  }
  function M(r) {
    p(!1), O(null), H.current = null;
    try {
      document.body.classList.remove("marquee-selecting");
    } catch {
    }
    try {
      G(Date.now());
    } catch {
    }
  }
  function R() {
    T(/* @__PURE__ */ new Set()), Array.from(document.querySelectorAll(".task-app__item.selected")).forEach((l) => l.classList.remove("selected"));
  }
  st(() => {
    function r(m) {
      if (m.button !== 0) return;
      const y = { target: m.target, clientX: m.clientX, clientY: m.clientY, button: m.button };
      try {
        P(y);
      } catch {
      }
    }
    function l(m) {
      const y = { clientX: m.clientX, clientY: m.clientY };
      try {
        C(y);
      } catch {
      }
    }
    function d(m) {
      const y = { clientX: m.clientX, clientY: m.clientY };
      try {
        M(y);
      } catch {
      }
    }
    return document.addEventListener("mousedown", r), document.addEventListener("mousemove", l), document.addEventListener("mouseup", d), () => {
      document.removeEventListener("mousedown", r), document.removeEventListener("mousemove", l), document.removeEventListener("mouseup", d);
    };
  }, []);
  function U(r, l) {
    r.preventDefault(), r.dataTransfer.dropEffect = "copy", a(l);
  }
  function J(r) {
    r.currentTarget.contains(r.relatedTarget) || a(null);
  }
  async function Q(r, l) {
    r.preventDefault(), a(null), console.log("[useDragAndDrop] onDrop START", { targetTag: l });
    let d = [];
    try {
      const f = r.dataTransfer.getData("application/x-hadoku-task-ids");
      f && (d = JSON.parse(f));
    } catch {
    }
    if (d.length === 0) {
      const f = r.dataTransfer.getData("text/plain");
      f && (d = [f]);
    }
    if (d.length === 0) return;
    let m = null;
    try {
      const f = r.dataTransfer.getData("application/x-hadoku-task-source");
      f && (m = f);
    } catch {
    }
    console.log("[useDragAndDrop] onDrop: processing", { targetTag: l, ids: d, srcTag: m, taskCount: d.length });
    const y = [];
    for (const f of d) {
      const u = t.find((q) => q.id === f);
      if (!u) continue;
      const B = u.tag?.split(" ").filter(Boolean) || [];
      if (l === "other") {
        if (B.length === 0) continue;
        y.push({ taskId: f, tag: "" });
        continue;
      }
      const D = B.includes(l);
      let $ = B.slice();
      D || $.push(l), m && m !== l && ($ = $.filter((q) => q !== m));
      const z = $.join(" ").trim();
      y.push({ taskId: f, tag: z });
    }
    console.log("[useDragAndDrop] onDrop: updating tasks", { updateCount: y.length });
    try {
      await n(y), console.log("[useDragAndDrop] onDrop: updates complete, clearing selection");
      try {
        R();
      } catch {
      }
    } catch (f) {
      console.error("Failed to add tag to one or more tasks:", f), alert(f.message || "Failed to add tags");
    }
    console.log("[useDragAndDrop] onDrop END");
  }
  function L(r, l) {
    r.preventDefault(), r.dataTransfer.dropEffect = "copy", c(l);
  }
  function W(r) {
    r.currentTarget.contains(r.relatedTarget) || c(null);
  }
  async function K(r, l) {
    r.preventDefault(), c(null);
    const d = r.dataTransfer.getData("text/plain"), m = t.find((u) => u.id === d);
    if (!m) return;
    const y = m.tag?.split(" ") || [];
    if (y.includes(l)) {
      console.log(`Task already has tag: ${l}`);
      return;
    }
    const f = [...y, l].join(" ");
    console.log(`Adding tag "${l}" to task "${m.title}" via filter drop. New tags: "${f}"`);
    try {
      await e(d, { tag: f });
      try {
        R();
      } catch {
      }
    } catch (u) {
      console.error("Failed to add tag via filter drop:", u), alert(u.message || "Failed to add tag");
    }
  }
  return {
    dragOverTag: s,
    dragOverFilter: o,
    setDragOverFilter: c,
    selectedIds: i,
    isSelecting: S,
    marqueeRect: b,
    selectionJustEndedAt: _,
    // selection handlers
    selectionStartHandler: P,
    selectionMoveHandler: C,
    selectionEndHandler: M,
    clearSelection: R,
    onDragStart: Y,
    onDragEnd: F,
    onDragOver: U,
    onDragLeave: J,
    onDrop: Q,
    onFilterDragOver: L,
    onFilterDragLeave: W,
    onFilterDrop: K
  };
}
function Wt() {
  const [t, e] = N({});
  function n(c) {
    e((i) => {
      const S = (i[c] || "desc") === "desc" ? "asc" : "desc";
      return { ...i, [c]: S };
    });
  }
  function s(c, i) {
    return [...c].sort((T, S) => {
      const p = new Date(T.createdAt).getTime(), b = new Date(S.createdAt).getTime();
      return i === "asc" ? p - b : b - p;
    });
  }
  function a(c) {
    return c === "asc" ? "↑" : "↓";
  }
  function o(c) {
    return c === "asc" ? "Sorted by age (oldest first) - click to sort newest first" : "Sorted by age (newest first) - click to sort oldest first";
  }
  return {
    sortDirections: t,
    toggleSort: n,
    sortTasksByAge: s,
    getSortIcon: a,
    getSortTitle: o
  };
}
function Gt(t) {
  const e = /* @__PURE__ */ new Date(), n = new Date(t), s = e.getTime() - n.getTime(), a = Math.floor(s / 1e3), o = Math.floor(a / 60), c = Math.floor(o / 60), i = Math.floor(c / 24);
  return a < 60 ? `${a}s ago` : o < 60 ? `${o}m ago` : c < 24 ? `${c}h ago` : `${i}d ago`;
}
function ut({
  task: t,
  isDraggable: e = !0,
  pendingOperations: n,
  onComplete: s,
  onDelete: a,
  onAddTag: o,
  onDragStart: c,
  onDragEnd: i,
  selected: T = !1
}) {
  const S = n.has(`complete-${t.id}`), p = n.has(`delete-${t.id}`);
  return /* @__PURE__ */ A(
    "li",
    {
      className: `task-app__item ${T ? "selected" : ""}`,
      "data-task-id": t.id,
      draggable: e,
      onDragStart: c ? (b) => c(b, t.id) : void 0,
      onDragEnd: (b) => {
        if (b.currentTarget.classList.remove("dragging"), i)
          try {
            i(b);
          } catch {
          }
      },
      children: [
        /* @__PURE__ */ A("div", { className: "task-app__item-content", children: [
          /* @__PURE__ */ k("div", { className: "task-app__item-title", title: t.title, children: t.title }),
          /* @__PURE__ */ A("div", { className: "task-app__item-meta-row", children: [
            t.tag ? /* @__PURE__ */ k("div", { className: "task-app__item-tag", children: t.tag.split(" ").map((b) => `#${b}`).join(" ") }) : /* @__PURE__ */ k("div", {}),
            /* @__PURE__ */ k("div", { className: "task-app__item-age", children: Gt(t.createdAt) })
          ] })
        ] }),
        /* @__PURE__ */ A("div", { className: "task-app__item-actions", children: [
          /* @__PURE__ */ k(
            "button",
            {
              className: "task-app__action-btn task-app__complete-btn",
              onClick: () => s(t.id),
              title: "Complete task",
              disabled: S || p,
              children: S ? "⏳" : "✓"
            }
          ),
          /* @__PURE__ */ k(
            "button",
            {
              className: "task-app__action-btn task-app__delete-btn",
              onClick: () => a(t.id),
              title: "Delete task",
              disabled: S || p,
              children: p ? "⏳" : "×"
            }
          )
        ] })
      ]
    }
  );
}
function bt(t) {
  return t === 0 ? { useTags: 0, maxPerColumn: 1 / 0, rows: [] } : t === 1 ? {
    useTags: 1,
    maxPerColumn: 1 / 0,
    rows: [{ columns: 1, tagIndices: [0] }]
  } : t === 2 ? {
    useTags: 2,
    maxPerColumn: 1 / 0,
    rows: [{ columns: 2, tagIndices: [0, 1] }]
  } : t === 3 ? {
    useTags: 3,
    maxPerColumn: 1 / 0,
    rows: [{ columns: 3, tagIndices: [0, 1, 2] }]
  } : t === 4 ? {
    useTags: 4,
    maxPerColumn: 10,
    rows: [
      { columns: 3, tagIndices: [0, 1, 2] },
      { columns: 1, tagIndices: [3] }
    ]
  } : t === 5 ? {
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
function Qt({
  tasks: t,
  topTags: e,
  filters: n,
  sortDirections: s,
  dragOverTag: a,
  pendingOperations: o,
  onComplete: c,
  onDelete: i,
  onAddTag: T,
  onDragStart: S,
  onDragEnd: p,
  selectedIds: b,
  onSelectionStart: O,
  onSelectionMove: _,
  onSelectionEnd: G,
  onDragOver: H,
  onDragLeave: Y,
  onDrop: F,
  toggleSort: P,
  sortTasksByAge: C,
  getSortIcon: M,
  getSortTitle: R,
  clearTasksByTag: U,
  clearRemainingTasks: J,
  onDeletePersistedTag: Q
}) {
  const L = (u, B) => /* @__PURE__ */ A(
    "div",
    {
      className: `task-app__tag-column ${a === u ? "task-app__tag-column--drag-over" : ""}`,
      onDragOver: (D) => H(D, u),
      onDragLeave: Y,
      onDrop: (D) => F(D, u),
      children: [
        /* @__PURE__ */ A("div", { className: "task-app__tag-header-row", children: [
          /* @__PURE__ */ A("h3", { className: "task-app__tag-header", children: [
            "#",
            u
          ] }),
          /* @__PURE__ */ k(
            "button",
            {
              className: "task-app__sort-btn task-app__sort-btn--active",
              onClick: () => P(u),
              title: R(s[u] || "desc"),
              children: M(s[u] || "desc")
            }
          )
        ] }),
        /* @__PURE__ */ k("ul", { className: "task-app__list task-app__list--column", children: C(B, s[u] || "desc").map((D) => /* @__PURE__ */ k(
          ut,
          {
            task: D,
            isDraggable: !0,
            pendingOperations: o,
            onComplete: c,
            onDelete: i,
            onAddTag: T,
            onDragStart: S,
            onDragEnd: p,
            selected: b ? b.has(D.id) : !1
          },
          D.id
        )) })
      ]
    },
    u
  ), W = (u, B) => {
    let D = vt(t, u);
    return r && (D = D.filter(($) => {
      const z = $.tag?.split(" ") || [];
      return n.some((q) => z.includes(q));
    })), D.slice(0, B);
  }, K = e.length, r = Array.isArray(n) && n.length > 0, l = t.filter((u) => {
    if (!r) return !0;
    const B = u.tag?.split(" ") || [];
    return n.some((D) => B.includes(D));
  }), d = bt(K), m = r ? e.filter((u) => vt(t, u).some((D) => {
    const $ = D.tag?.split(" ") || [];
    return n.some((z) => $.includes(z));
  })) : e.slice(0, d.useTags);
  if (m.length === 0)
    return /* @__PURE__ */ k("ul", { className: "task-app__list", children: l.map((u) => /* @__PURE__ */ k(
      ut,
      {
        task: u,
        pendingOperations: o,
        onComplete: c,
        onDelete: i,
        onAddTag: T,
        onDragStart: S,
        onDragEnd: p,
        selected: b ? b.has(u.id) : !1
      },
      u.id
    )) });
  const y = Yt(t, e, n).filter((u) => {
    if (!r) return !0;
    const B = u.tag?.split(" ") || [];
    return n.some((D) => B.includes(D));
  }), f = bt(m.length);
  return /* @__PURE__ */ A("div", { className: "task-app__dynamic-layout", children: [
    f.rows.length > 0 && /* @__PURE__ */ k(Pt, { children: f.rows.map((u, B) => /* @__PURE__ */ k("div", { className: `task-app__tag-grid task-app__tag-grid--${u.columns}col`, children: u.tagIndices.map((D) => {
      const $ = m[D];
      return $ ? L($, W($, f.maxPerColumn)) : null;
    }) }, B)) }),
    y.length > 0 && /* @__PURE__ */ A(
      "div",
      {
        className: `task-app__remaining ${a === "other" ? "task-app__tag-column--drag-over" : ""}`,
        onDragOver: (u) => {
          u.preventDefault(), u.dataTransfer.dropEffect = "move", H(u, "other");
        },
        onDragLeave: (u) => Y(u),
        onDrop: (u) => F(u, "other"),
        children: [
          /* @__PURE__ */ A("div", { className: "task-app__tag-header-row", children: [
            /* @__PURE__ */ k("h3", { className: "task-app__remaining-header", children: "Other Tasks" }),
            /* @__PURE__ */ k(
              "button",
              {
                className: "task-app__sort-btn task-app__sort-btn--active",
                onClick: () => P("other"),
                title: R(s.other || "desc"),
                children: M(s.other || "desc")
              }
            )
          ] }),
          /* @__PURE__ */ k("ul", { className: "task-app__list", children: C(y, s.other || "desc").map((u) => /* @__PURE__ */ k(
            ut,
            {
              task: u,
              pendingOperations: o,
              onComplete: c,
              onDelete: i,
              onAddTag: T,
              onDragStart: S,
              onDragEnd: p,
              selected: b ? b.has(u.id) : !1
            },
            u.id
          )) })
        ]
      }
    )
  ] });
}
function ft({
  isOpen: t,
  title: e,
  onClose: n,
  onConfirm: s,
  children: a,
  inputValue: o,
  onInputChange: c,
  inputPlaceholder: i,
  confirmLabel: T = "Confirm",
  cancelLabel: S = "Cancel",
  confirmDisabled: p = !1,
  confirmDanger: b = !1
}) {
  return t ? /* @__PURE__ */ k(
    "div",
    {
      className: "modal-overlay",
      onClick: n,
      children: /* @__PURE__ */ A(
        "div",
        {
          className: "modal-card",
          onClick: (_) => _.stopPropagation(),
          children: [
            /* @__PURE__ */ k("h3", { children: e }),
            a,
            c && /* @__PURE__ */ k(
              "input",
              {
                type: "text",
                className: "modal-input",
                value: o || "",
                onChange: (_) => c(_.target.value),
                placeholder: i,
                autoFocus: !0,
                onKeyDown: (_) => {
                  _.key === "Enter" && !p && (_.preventDefault(), s()), _.key === "Escape" && (_.preventDefault(), n());
                }
              }
            ),
            /* @__PURE__ */ A("div", { className: "modal-actions", children: [
              /* @__PURE__ */ k(
                "button",
                {
                  className: "modal-button",
                  onClick: n,
                  children: S
                }
              ),
              /* @__PURE__ */ k(
                "button",
                {
                  className: `modal-button ${b ? "modal-button--danger" : "modal-button--primary"}`,
                  onClick: s,
                  disabled: p,
                  children: T
                }
              )
            ] })
          ]
        }
      )
    }
  ) : null;
}
function St({ isOpen: t, x: e, y: n, items: s }) {
  return t ? /* @__PURE__ */ k(
    "div",
    {
      className: "board-context-menu",
      style: {
        left: `${e}px`,
        top: `${n}px`
      },
      children: s.map((a, o) => /* @__PURE__ */ k(
        "button",
        {
          className: `context-menu-item ${a.isDanger ? "context-menu-item--danger" : ""}`,
          onClick: a.onClick,
          children: a.label
        },
        o
      ))
    }
  ) : null;
}
function mt(t) {
  let e = [];
  try {
    const n = t.getData("application/x-hadoku-task-ids");
    n && (e = JSON.parse(n));
  } catch {
  }
  if (e.length === 0) {
    const n = t.getData("text/plain");
    n && (e = [n]);
  }
  return e;
}
function Zt(t = {}) {
  const { basename: e = "/task", apiUrl: n, environment: s, userType: a = "public", userId: o = "public", sessionId: c } = t, [i, T] = N(/* @__PURE__ */ new Set()), [S, p] = N([]), [b, O] = N(null), [_, G] = N(!1), [H, Y] = N(!1), [F, P] = N(""), [C, M] = N("light"), [R, U] = N(!1), [J, Q] = N(null), [L, W] = N(null), K = pt(null), r = pt(null), {
    tasks: l,
    pendingOperations: d,
    initialLoad: m,
    addTask: y,
    completeTask: f,
    deleteTask: u,
    addTagToTask: B,
    updateTaskTags: D,
    bulkUpdateTaskTags: $,
    clearTasksByTag: z,
    clearRemainingTasks: q,
    // board API
    boards: j,
    currentBoardId: rt,
    createBoard: ct,
    deleteBoard: Dt,
    switchBoard: Bt,
    moveTasksToBoard: yt,
    createTagOnBoard: At,
    deleteTagOnBoard: Ct
  } = zt({ userType: a, userId: o, sessionId: c }), v = Vt({
    tasks: l,
    onTaskUpdate: D,
    onBulkUpdate: $
  }), ot = Wt();
  st(() => {
    console.log("[App] User context changed, initializing...", { userType: a, userId: o }), m(), K.current?.focus();
  }, [a, o]), st(() => {
    r.current && r.current.setAttribute("data-theme", C);
  }, [C]), st(() => {
    if (!R && !J && !L) return;
    const g = (h) => {
      const w = h.target;
      w.closest(".theme-picker") || U(!1), w.closest(".board-context-menu") || Q(null), w.closest(".tag-context-menu") || W(null);
    };
    return document.addEventListener("mousedown", g), () => document.removeEventListener("mousedown", g);
  }, [R, J, L]);
  async function xt(g) {
    await y(g) && K.current && (K.current.value = "", K.current.focus());
  }
  function Nt(g) {
    const h = l.filter((w) => w.tag?.split(" ").includes(g));
    O({ tag: g, count: h.length });
  }
  async function $t(g) {
    const h = g.trim().replace(/\s+/g, "-");
    try {
      await At(h);
      const w = window.__pendingTagTaskIds;
      if (w && w.length > 0) {
        const Z = w.map((x) => {
          const it = l.find((Lt) => Lt.id === x)?.tag?.split(" ").filter(Boolean) || [], Mt = [.../* @__PURE__ */ new Set([...it, h])];
          return { taskId: x, tag: Mt.join(" ") };
        });
        await $(Z), v.clearSelection(), delete window.__pendingTagTaskIds;
      }
    } catch (w) {
      throw console.error("[App] Failed to create tag:", w), w;
    }
  }
  async function Ot(g) {
    const h = g.trim();
    try {
      const w = window.__pendingBoardTaskIds;
      await ct(h), w && w.length > 0 && (await yt(h, w), v.clearSelection(), delete window.__pendingBoardTaskIds);
    } catch (w) {
      throw console.error("[App] Failed to create board:", w), w;
    }
  }
  const Et = j?.boards?.find((g) => g.id === rt)?.tags || [], Ft = qt(l, 6);
  return /* @__PURE__ */ k(
    "div",
    {
      ref: r,
      className: "task-app-container",
      onMouseDown: v.selectionStartHandler,
      onMouseMove: v.selectionMoveHandler,
      onMouseUp: v.selectionEndHandler,
      onMouseLeave: v.selectionEndHandler,
      onClick: (g) => {
        try {
          const h = g.target;
          if (!h.closest || !h.closest(".task-app__item")) {
            try {
              const w = v.selectionJustEndedAt;
              if (w && Date.now() - w < 300)
                return;
            } catch {
            }
            v.clearSelection();
          }
        } catch {
        }
      },
      children: /* @__PURE__ */ A("div", { className: "task-app", children: [
        /* @__PURE__ */ A("div", { className: "task-app__header-container", children: [
          /* @__PURE__ */ k("h1", { className: "task-app__header", children: "Tasks" }),
          /* @__PURE__ */ A("div", { className: "theme-picker", children: [
            /* @__PURE__ */ k(
              "button",
              {
                className: "theme-toggle-btn",
                onClick: () => U(!R),
                "aria-label": "Choose theme",
                title: "Choose theme",
                children: C === "light" ? "☀️" : C === "dark" ? "🌙" : C === "strawberry" ? "🍓" : C === "ocean" ? "🌊" : C === "cyberpunk" ? "🤖" : C === "coffee" ? "☕" : "🪻"
              }
            ),
            R && /* @__PURE__ */ A("div", { className: "theme-picker__dropdown", children: [
              /* @__PURE__ */ k(
                "button",
                {
                  className: `theme-picker__option ${C === "light" ? "active" : ""}`,
                  onClick: () => {
                    M("light"), U(!1);
                  },
                  title: "Light theme",
                  children: "☀️"
                }
              ),
              /* @__PURE__ */ k(
                "button",
                {
                  className: `theme-picker__option ${C === "dark" ? "active" : ""}`,
                  onClick: () => {
                    M("dark"), U(!1);
                  },
                  title: "Dark theme",
                  children: "🌙"
                }
              ),
              /* @__PURE__ */ k(
                "button",
                {
                  className: `theme-picker__option ${C === "strawberry" ? "active" : ""}`,
                  onClick: () => {
                    M("strawberry"), U(!1);
                  },
                  title: "Strawberry theme",
                  children: "🍓"
                }
              ),
              /* @__PURE__ */ k(
                "button",
                {
                  className: `theme-picker__option ${C === "ocean" ? "active" : ""}`,
                  onClick: () => {
                    M("ocean"), U(!1);
                  },
                  title: "Ocean theme",
                  children: "🌊"
                }
              ),
              /* @__PURE__ */ k(
                "button",
                {
                  className: `theme-picker__option ${C === "cyberpunk" ? "active" : ""}`,
                  onClick: () => {
                    M("cyberpunk"), U(!1);
                  },
                  title: "Cyberpunk theme",
                  children: "🤖"
                }
              ),
              /* @__PURE__ */ k(
                "button",
                {
                  className: `theme-picker__option ${C === "coffee" ? "active" : ""}`,
                  onClick: () => {
                    M("coffee"), U(!1);
                  },
                  title: "Coffee theme",
                  children: "☕"
                }
              ),
              /* @__PURE__ */ k(
                "button",
                {
                  className: `theme-picker__option ${C === "lavender" ? "active" : ""}`,
                  onClick: () => {
                    M("lavender"), U(!1);
                  },
                  title: "Lavender theme",
                  children: "🪻"
                }
              )
            ] })
          ] })
        ] }),
        /* @__PURE__ */ A("div", { className: "task-app__boards", children: [
          /* @__PURE__ */ k("div", { className: "task-app__board-list", children: (j && j.boards ? j.boards.slice(0, 5) : [{ id: "main", name: "main" }]).map((g) => /* @__PURE__ */ k(
            "button",
            {
              className: `board-btn ${rt === g.id ? "board-btn--active" : ""} ${v.dragOverFilter === `board:${g.id}` ? "board-btn--drag-over" : ""}`,
              onClick: () => Bt(g.id),
              onContextMenu: (h) => {
                h.preventDefault(), g.id !== "main" && Q({ boardId: g.id, x: h.clientX, y: h.clientY });
              },
              onTouchStart: (h) => {
                if (g.id === "main") return;
                const w = setTimeout(() => {
                  const Z = h.touches[0];
                  Q({ boardId: g.id, x: Z.clientX, y: Z.clientY });
                }, 500);
                h.currentTarget.__longPressTimer = w;
              },
              onTouchEnd: (h) => {
                const w = h.currentTarget.__longPressTimer;
                w && (clearTimeout(w), h.currentTarget.__longPressTimer = null);
              },
              onTouchMove: (h) => {
                const w = h.currentTarget.__longPressTimer;
                w && (clearTimeout(w), h.currentTarget.__longPressTimer = null);
              },
              "aria-pressed": rt === g.id ? "true" : "false",
              onDragOver: (h) => {
                h.preventDefault(), h.dataTransfer.dropEffect = "move";
                try {
                  v.setDragOverFilter?.(`board:${g.id}`);
                } catch {
                }
              },
              onDragLeave: (h) => {
                try {
                  v.setDragOverFilter?.(null);
                } catch {
                }
              },
              onDrop: async (h) => {
                h.preventDefault();
                try {
                  v.setDragOverFilter?.(null);
                } catch {
                }
                const w = mt(h.dataTransfer);
                if (w.length !== 0)
                  try {
                    await yt(g.id, w);
                    try {
                      v.clearSelection();
                    } catch {
                    }
                  } catch (Z) {
                    console.error("Failed moving tasks to board", Z), alert(Z.message || "Failed to move tasks");
                  }
              },
              children: g.name
            },
            g.id
          )) }),
          /* @__PURE__ */ k("div", { className: "task-app__board-actions", children: (!j || j.boards && j.boards.length < 5) && /* @__PURE__ */ k(
            "button",
            {
              className: `board-add-btn ${v.dragOverFilter === "add-board" ? "board-btn--drag-over" : ""}`,
              onClick: () => {
                P(""), G(!0);
              },
              onDragOver: (g) => {
                g.preventDefault(), g.dataTransfer.dropEffect = "move";
                try {
                  v.setDragOverFilter?.("add-board");
                } catch {
                }
              },
              onDragLeave: (g) => {
                try {
                  v.setDragOverFilter?.(null);
                } catch {
                }
              },
              onDrop: async (g) => {
                g.preventDefault();
                try {
                  v.setDragOverFilter?.(null);
                } catch {
                }
                const h = mt(g.dataTransfer);
                h.length > 0 && (P(""), window.__pendingBoardTaskIds = h, G(!0));
              },
              "aria-label": "Create board",
              children: "＋"
            }
          ) })
        ] }),
        /* @__PURE__ */ k("div", { className: "task-app__controls", children: /* @__PURE__ */ k(
          "input",
          {
            ref: K,
            className: "task-app__input",
            placeholder: "Type a task and press Enter…",
            onKeyDown: (g) => {
              g.key === "Enter" && !g.shiftKey && (g.preventDefault(), xt(g.target.value)), g.key === "k" && (g.ctrlKey || g.metaKey) && (g.preventDefault(), K.current?.focus());
            }
          }
        ) }),
        /* @__PURE__ */ A("div", { className: "task-app__filters", children: [
          (() => {
            const g = dt(l);
            return Array.from(/* @__PURE__ */ new Set([...Et, ...g, ...S])).map((w) => {
              const Z = i.has(w);
              return /* @__PURE__ */ A(
                "button",
                {
                  onClick: () => {
                    T((x) => {
                      const X = new Set(x);
                      return X.has(w) ? X.delete(w) : X.add(w), X;
                    });
                  },
                  onContextMenu: (x) => {
                    x.preventDefault(), W({ tag: w, x: x.clientX, y: x.clientY });
                  },
                  onTouchStart: (x) => {
                    const X = setTimeout(() => {
                      const it = x.touches[0];
                      W({ tag: w, x: it.clientX, y: it.clientY });
                    }, 500);
                    x.currentTarget.__longPressTimer = X;
                  },
                  onTouchEnd: (x) => {
                    const X = x.currentTarget.__longPressTimer;
                    X && (clearTimeout(X), x.currentTarget.__longPressTimer = null);
                  },
                  onTouchMove: (x) => {
                    const X = x.currentTarget.__longPressTimer;
                    X && (clearTimeout(X), x.currentTarget.__longPressTimer = null);
                  },
                  className: `${Z ? "on" : ""} ${v.dragOverFilter === w ? "task-app__filter-drag-over" : ""}`,
                  onDragOver: (x) => v.onFilterDragOver(x, w),
                  onDragLeave: v.onFilterDragLeave,
                  onDrop: (x) => v.onFilterDrop(x, w),
                  children: [
                    "#",
                    w
                  ]
                },
                w
              );
            });
          })(),
          /* @__PURE__ */ k(
            "button",
            {
              className: `task-app__filter-add ${v.dragOverFilter === "add-tag" ? "task-app__filter-drag-over" : ""}`,
              onClick: () => {
                P(""), Y(!0);
              },
              onDragOver: (g) => {
                g.preventDefault(), g.dataTransfer.dropEffect = "copy", v.onFilterDragOver(g, "add-tag");
              },
              onDragLeave: v.onFilterDragLeave,
              onDrop: async (g) => {
                g.preventDefault(), v.onFilterDragLeave(g);
                const h = mt(g.dataTransfer);
                h.length > 0 && (P(""), window.__pendingTagTaskIds = h, Y(!0));
              },
              "aria-label": "Add tag",
              children: "＋"
            }
          )
        ] }),
        /* @__PURE__ */ k(
          Qt,
          {
            tasks: l,
            topTags: Ft,
            filters: Array.from(i),
            selectedIds: v.selectedIds,
            onSelectionStart: v.selectionStartHandler,
            onSelectionMove: v.selectionMoveHandler,
            onSelectionEnd: v.selectionEndHandler,
            sortDirections: ot.sortDirections,
            dragOverTag: v.dragOverTag,
            pendingOperations: d,
            onComplete: f,
            onDelete: u,
            onAddTag: B,
            onDragStart: v.onDragStart,
            onDragEnd: v.onDragEnd,
            onDragOver: v.onDragOver,
            onDragLeave: v.onDragLeave,
            onDrop: v.onDrop,
            toggleSort: ot.toggleSort,
            sortTasksByAge: ot.sortTasksByAge,
            getSortIcon: ot.getSortIcon,
            getSortTitle: ot.getSortTitle,
            clearTasksByTag: Nt,
            clearRemainingTasks: q,
            onDeletePersistedTag: Ct
          }
        ),
        v.isSelecting && v.marqueeRect && /* @__PURE__ */ k(
          "div",
          {
            className: "marquee-overlay",
            style: {
              left: `${v.marqueeRect.x}px`,
              top: `${v.marqueeRect.y}px`,
              width: `${v.marqueeRect.w}px`,
              height: `${v.marqueeRect.h}px`
            }
          }
        ),
        /* @__PURE__ */ k(
          ft,
          {
            isOpen: !!b,
            title: `Clear Tag #${b?.tag}?`,
            onClose: () => O(null),
            onConfirm: async () => {
              if (!b) return;
              const g = b.tag;
              O(null), await z(g);
            },
            confirmLabel: "Clear Tag",
            confirmDanger: !0,
            children: b && /* @__PURE__ */ A("p", { children: [
              "This will remove ",
              /* @__PURE__ */ A("strong", { children: [
                "#",
                b.tag
              ] }),
              " from",
              " ",
              /* @__PURE__ */ A("strong", { children: [
                b.count,
                " task(s)"
              ] }),
              " and delete the tag from the board."
            ] })
          }
        ),
        /* @__PURE__ */ k(
          ft,
          {
            isOpen: _,
            title: "Create New Board",
            onClose: () => {
              G(!1), delete window.__pendingBoardTaskIds;
            },
            onConfirm: async () => {
              if (F.trim()) {
                G(!1);
                try {
                  await Ot(F);
                } catch (g) {
                  console.error("[App] Failed to create board:", g);
                }
              }
            },
            inputValue: F,
            onInputChange: P,
            inputPlaceholder: "Board name",
            confirmLabel: "Create",
            confirmDisabled: !F.trim(),
            children: (() => {
              const g = window.__pendingBoardTaskIds;
              return g && g.length > 0 ? /* @__PURE__ */ A("p", { className: "modal-hint", children: [
                g.length,
                " task",
                g.length > 1 ? "s" : "",
                " will be moved to this board"
              ] }) : null;
            })()
          }
        ),
        /* @__PURE__ */ A(
          ft,
          {
            isOpen: H,
            title: "Create New Tag",
            onClose: () => {
              Y(!1), delete window.__pendingTagTaskIds;
            },
            onConfirm: async () => {
              if (F.trim()) {
                Y(!1);
                try {
                  await $t(F);
                } catch (g) {
                  console.error("[App] Failed to create tag:", g);
                }
              }
            },
            inputValue: F,
            onInputChange: P,
            inputPlaceholder: "Enter new tag name",
            confirmLabel: "Create",
            confirmDisabled: !F.trim(),
            children: [
              (() => {
                const g = window.__pendingTagTaskIds;
                return g && g.length > 0 ? /* @__PURE__ */ A("p", { className: "modal-hint", children: [
                  "This tag will be applied to ",
                  g.length,
                  " task",
                  g.length > 1 ? "s" : ""
                ] }) : null;
              })(),
              dt(l).length > 0 && /* @__PURE__ */ A("div", { className: "modal-section", children: [
                /* @__PURE__ */ k("label", { className: "modal-label", children: "Existing tags:" }),
                /* @__PURE__ */ k("div", { className: "modal-tags-list", children: dt(l).map((g) => /* @__PURE__ */ A("span", { className: "modal-tag-chip", children: [
                  "#",
                  g
                ] }, g)) })
              ] })
            ]
          }
        ),
        /* @__PURE__ */ k(
          St,
          {
            isOpen: !!J,
            x: J?.x || 0,
            y: J?.y || 0,
            items: [
              {
                label: "🗑️ Delete Board",
                isDanger: !0,
                onClick: async () => {
                  if (!J) return;
                  const g = j?.boards?.find((h) => h.id === J.boardId)?.name || J.boardId;
                  if (confirm(`Delete board "${g}"? All tasks on this board will be permanently deleted.`))
                    try {
                      await Dt(J.boardId), Q(null);
                    } catch (h) {
                      console.error("[App] Failed to delete board:", h), alert(h.message || "Failed to delete board");
                    }
                }
              }
            ]
          }
        ),
        /* @__PURE__ */ k(
          St,
          {
            isOpen: !!L,
            x: L?.x || 0,
            y: L?.y || 0,
            items: [
              {
                label: "🗑️ Delete Tag",
                isDanger: !0,
                onClick: async () => {
                  if (!L) return;
                  const g = l.filter((h) => h.tag?.split(" ").includes(L.tag));
                  if (confirm(`Delete tag "${L.tag}" and remove it from ${g.length} task(s)?`))
                    try {
                      await z(L.tag), W(null);
                    } catch (h) {
                      console.error("[App] Failed to delete tag:", h), alert(h.message || "Failed to delete tag");
                    }
                }
              }
            ]
          }
        )
      ] })
    }
  );
}
function ne(t, e = {}) {
  const n = new URLSearchParams(window.location.search), s = e.userType || n.get("userType") || "public", a = e.userId || n.get("userId") || "public", o = e.sessionId, c = { ...e, userType: s, userId: a, sessionId: o }, i = Rt(t);
  i.render(/* @__PURE__ */ k(Zt, { ...c })), t.__root = i, console.log("[task-app] Mounted successfully", c);
}
function se(t) {
  t.__root?.unmount();
}
export {
  ne as mount,
  se as unmount
};
