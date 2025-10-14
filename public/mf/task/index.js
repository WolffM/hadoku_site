import { jsxs as A, jsx as k, Fragment as Pt } from "react/jsx-runtime";
import { createRoot as Rt } from "react-dom/client";
import { useState as N, useMemo as Jt, useEffect as st, useRef as pt } from "react";
function Ut() {
  const t = Date.now().toString(36).toUpperCase().padStart(8, "0"), e = Array.from(crypto.getRandomValues(new Uint8Array(16))).map((a) => (a % 36).toString(36).toUpperCase()).join("");
  return t + e.slice(0, 18);
}
function I(t, e, a = 50) {
  setTimeout(() => {
    try {
      const s = new BroadcastChannel("tasks");
      s.postMessage({ type: t, ...e }), s.close();
    } catch (s) {
      console.error("[localStorageApi] Broadcast failed:", s);
    }
  }, a);
}
const Tt = (t, e, a) => `${t}-${e}-${a}-tasks`, wt = (t, e, a) => `${t}-${e}-${a}-stats`, _t = (t, e) => `${t}-${e}-boards`;
function at(t = "public", e = "public", a = "main") {
  const s = localStorage.getItem(Tt(t, e, a));
  return s ? JSON.parse(s) : {
    version: 1,
    updatedAt: (/* @__PURE__ */ new Date()).toISOString(),
    tasks: []
  };
}
function nt(t, e = "public", a = "public", s = "main") {
  t.updatedAt = (/* @__PURE__ */ new Date()).toISOString(), localStorage.setItem(Tt(e, a, s), JSON.stringify(t));
}
function ht(t = "public", e = "public", a = "main") {
  const s = localStorage.getItem(wt(t, e, a));
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
function kt(t, e = "public", a = "public", s = "main") {
  t.updatedAt = (/* @__PURE__ */ new Date()).toISOString(), localStorage.setItem(wt(e, a, s), JSON.stringify(t));
}
function lt(t, e, a = "public", s = "public", n = "main") {
  const r = ht(a, s, n);
  r.counters[t]++, r.timeline.push({
    t: (/* @__PURE__ */ new Date()).toISOString(),
    event: t,
    id: e.id
  }), r.tasks[e.id] = {
    id: e.id,
    title: e.title,
    tag: e.tag,
    state: e.state,
    createdAt: e.createdAt,
    updatedAt: e.updatedAt,
    closedAt: e.closedAt
  }, kt(r, a, s, n);
}
function tt(t = "public", e = "public") {
  const a = localStorage.getItem(_t(t, e));
  return a ? JSON.parse(a) : { version: 1, updatedAt: (/* @__PURE__ */ new Date()).toISOString(), boards: [] };
}
function et(t, e = "public", a = "public") {
  t.updatedAt = (/* @__PURE__ */ new Date()).toISOString(), localStorage.setItem(_t(e, a), JSON.stringify(t));
}
function jt(t = "public", e = "public") {
  return {
    async getBoards() {
      const a = tt(t, e);
      if (!a.boards || a.boards.length === 0) {
        const n = { id: "main", name: "main", tasks: [], stats: void 0, tags: [] };
        a.boards = [n], et(a, t, e), nt({ version: 1, updatedAt: (/* @__PURE__ */ new Date()).toISOString(), tasks: [] }, t, e, "main"), kt({ version: 2, updatedAt: (/* @__PURE__ */ new Date()).toISOString(), counters: { created: 0, completed: 0, edited: 0, deleted: 0 }, timeline: [], tasks: {} }, t, e, "main");
      }
      const s = { version: a.version, updatedAt: a.updatedAt, boards: [] };
      for (const n of a.boards) {
        const r = at(t, e, n.id), i = ht(t, e, n.id), c = { id: n.id, name: n.name, tasks: r.tasks, stats: i, tags: n.tags || [] };
        s.boards.push(c);
      }
      return s;
    },
    async createBoard(a) {
      const s = tt(t, e);
      if (console.debug("[localStorageApi] createBoard", { userType: t, userId: e, boardId: a, existing: s.boards.map((r) => r.id) }), s.boards.find((r) => r.id === a))
        throw new Error("Board already exists");
      const n = { id: a, name: a, tasks: [], stats: void 0, tags: [] };
      return s.boards.push(n), et(s, t, e), nt({ version: 1, updatedAt: (/* @__PURE__ */ new Date()).toISOString(), tasks: [] }, t, e, a), kt({ version: 2, updatedAt: (/* @__PURE__ */ new Date()).toISOString(), counters: { created: 0, completed: 0, edited: 0, deleted: 0 }, timeline: [], tasks: {} }, t, e, a), I("boards-updated", { sessionId: E, userType: t, userId: e }), n;
    },
    async deleteBoard(a) {
      const s = tt(t, e), n = s.boards.findIndex((r) => r.id === a);
      if (n === -1) throw new Error("Board not found");
      s.boards.splice(n, 1), et(s, t, e), localStorage.removeItem(Tt(t, e, a)), localStorage.removeItem(wt(t, e, a)), I("boards-updated", { sessionId: E, userType: t, userId: e });
    },
    async getTasks(a = "main") {
      return at(t, e, a);
    },
    async getStats(a = "main") {
      return ht(t, e, a);
    },
    async createTask(a, s = "main", n = !1) {
      const r = at(t, e, s), i = (/* @__PURE__ */ new Date()).toISOString(), c = {
        id: Ut(),
        title: a.title,
        tag: a.tag || null,
        state: "Active",
        createdAt: i,
        updatedAt: i,
        closedAt: null
      };
      if (r.tasks.push(c), nt(r, t, e, s), a.tag) {
        const T = tt(t, e), S = T.boards.find((p) => p.id === s);
        if (S) {
          const p = S.tags || [], b = a.tag.split(" ").filter(Boolean).filter(($) => !p.includes($));
          b.length && (S.tags = [...p, ...b], et(T, t, e));
        }
      }
      return lt("created", c, t, e, s), n ? console.log("[localStorageApi] createTask: broadcast suppressed") : (console.log("[localStorageApi] createTask: broadcasting update", { sessionId: E, boardId: s, taskId: c.id }), I("tasks-updated", { sessionId: E, userType: t, userId: e, boardId: s })), c;
    },
    async patchTask(a, s, n = "main", r = !1) {
      const i = at(t, e, n), c = i.tasks.find((T) => T.id === a);
      if (!c)
        throw new Error("Task not found");
      if (s.title !== void 0 && (c.title = s.title), s.tag !== void 0 && (c.tag = s.tag), s.tag !== void 0) {
        const T = tt(t, e), S = T.boards.find((p) => p.id === n);
        if (S) {
          const p = S.tags || [], b = (s.tag || "").split(" ").filter(Boolean).filter(($) => !p.includes($));
          b.length && (S.tags = [...p, ...b], et(T, t, e));
        }
      }
      return c.updatedAt = (/* @__PURE__ */ new Date()).toISOString(), nt(i, t, e, n), lt("edited", c, t, e, n), r || I("tasks-updated", { sessionId: E, userType: t, userId: e, boardId: n }), c;
    },
    async completeTask(a, s = "main") {
      const n = at(t, e, s), r = n.tasks.find((c) => c.id === a);
      if (!r)
        throw new Error("Task not found");
      const i = (/* @__PURE__ */ new Date()).toISOString();
      return r.state = "Completed", r.updatedAt = i, r.closedAt = i, nt(n, t, e, s), lt("completed", r, t, e, s), I("tasks-updated", { sessionId: E, userType: t, userId: e, boardId: s }), r;
    },
    async deleteTask(a, s = "main", n = !1) {
      console.log("[localStorageApi] deleteTask START", { id: a, boardId: s, suppressBroadcast: n, sessionId: E });
      const r = at(t, e, s), i = r.tasks.find((T) => T.id === a);
      if (!i)
        throw new Error("Task not found");
      const c = (/* @__PURE__ */ new Date()).toISOString();
      return i.state = "Deleted", i.updatedAt = c, i.closedAt = c, nt(r, t, e, s), lt("deleted", i, t, e, s), n ? console.log("[localStorageApi] deleteTask: broadcast suppressed") : (console.log("[localStorageApi] deleteTask: broadcasting", { sessionId: E }), I("tasks-updated", { sessionId: E, userType: t, userId: e, boardId: s })), console.log("[localStorageApi] deleteTask END"), i;
    },
    async createTag(a, s = "main") {
      const n = tt(t, e), r = n.boards.find((c) => c.id === s);
      if (!r) throw new Error("Board not found");
      const i = r.tags || [];
      i.includes(a) || (r.tags = [...i, a], et(n, t, e), I("boards-updated", { sessionId: E, userType: t, userId: e, boardId: s }));
    },
    async deleteTag(a, s = "main") {
      const n = tt(t, e), r = n.boards.find((c) => c.id === s);
      if (!r) throw new Error("Board not found");
      const i = r.tags || [];
      r.tags = i.filter((c) => c !== a), et(n, t, e), I("boards-updated", { sessionId: E, userType: t, userId: e, boardId: s });
    }
  };
}
async function Xt(t, e, a, s) {
  for (const i of e.boards || []) {
    const c = i.id;
    if (i.tasks && i.tasks.length > 0) {
      const T = `${a}-${s}-${c}-tasks`, S = {
        version: 1,
        updatedAt: e.updatedAt || (/* @__PURE__ */ new Date()).toISOString(),
        tasks: i.tasks
      };
      window.localStorage.setItem(T, JSON.stringify(S));
    }
    if (i.stats) {
      const T = `${a}-${s}-${c}-stats`;
      window.localStorage.setItem(T, JSON.stringify(i.stats));
    }
  }
  const n = `${a}-${s}-boards`, r = {
    version: 1,
    updatedAt: e.updatedAt || (/* @__PURE__ */ new Date()).toISOString(),
    boards: e.boards.map((i) => ({
      id: i.id,
      name: i.name,
      tags: i.tags || []
    }))
  };
  window.localStorage.setItem(n, JSON.stringify(r)), console.log("[api] Synced API data to localStorage:", {
    boards: e.boards?.length || 0,
    totalTasks: e.boards?.reduce((i, c) => i + (c.tasks?.length || 0), 0) || 0
  });
}
function Z(t, e, a) {
  const s = {
    "Content-Type": "application/json",
    "X-User-Type": t
  };
  return e && (s["X-User-Id"] = e), a && (s["X-Session-Id"] = a), s;
}
function Ht(t = "public", e = "public", a) {
  const s = jt(t, e);
  return t === "public" ? s : {
    // Get boards - returns localStorage immediately (optimistic)
    async getBoards() {
      return await s.getBoards();
    },
    // Sync from API - called once on initial page load to get server state
    async syncFromApi() {
      try {
        console.log("[api] Syncing from API...");
        const n = await fetch(`/task/api/boards?userType=${t}&userId=${encodeURIComponent(e)}`, {
          headers: Z(t, e, a)
        });
        if (!n.ok)
          throw new Error(`API returned ${n.status}`);
        const r = await n.json();
        console.log("[api] Synced from API:", { boards: r.boards?.length || 0, totalTasks: r.boards?.reduce((i, c) => i + (c.tasks?.length || 0), 0) || 0 }), await Xt(s, r, t, e);
      } catch (n) {
        console.error("[api] Sync from API failed:", n);
      }
    },
    async getStats(n = "main") {
      return await s.getStats(n);
    },
    async createTask(n, r = "main", i = !1) {
      const c = await s.createTask(n, r, i);
      return fetch("/task/api", {
        method: "POST",
        headers: Z(t, e, a),
        body: JSON.stringify({
          id: c.id,
          // Send client ID to server
          ...n,
          boardId: r
        })
      }).then((T) => T.json()).then((T) => {
        T.ok && (T.id === c.id ? console.log("[api] Background sync: createTask completed (ID matched)") : console.warn("[api] Server returned different ID (unexpected):", { client: c.id, server: T.id }));
      }).catch((T) => console.error("[api] Failed to sync createTask:", T)), c;
    },
    async createTag(n, r = "main") {
      const i = await s.createTag(n, r);
      return fetch("/task/api/tags", {
        method: "POST",
        headers: Z(t, e, a),
        body: JSON.stringify({ boardId: r, tag: n })
      }).then(() => console.log("[api] Background sync: createTag completed")).catch((c) => console.error("[api] Failed to sync createTag:", c)), i;
    },
    async deleteTag(n, r = "main") {
      const i = await s.deleteTag(n, r);
      return fetch("/task/api/tags", {
        method: "DELETE",
        headers: Z(t, e, a),
        body: JSON.stringify({ boardId: r, tag: n })
      }).then(() => console.log("[api] Background sync: deleteTag completed")).catch((c) => console.error("[api] Failed to sync deleteTag:", c)), i;
    },
    async patchTask(n, r, i = "main", c = !1) {
      const T = await s.patchTask(n, r, i, c);
      return fetch(`/task/api/${n}`, {
        method: "PATCH",
        headers: Z(t, e, a),
        body: JSON.stringify({ ...r, boardId: i })
      }).then(() => console.log("[api] Background sync: patchTask completed")).catch((S) => console.error("[api] Failed to sync patchTask:", S)), T;
    },
    async completeTask(n, r = "main") {
      const i = await s.completeTask(n, r);
      return fetch(`/task/api/${n}/complete`, {
        method: "POST",
        headers: Z(t, e, a),
        body: JSON.stringify({ boardId: r })
      }).then(() => console.log("[api] Background sync: completeTask completed")).catch((c) => console.error("[api] Failed to sync completeTask:", c)), i;
    },
    async deleteTask(n, r = "main", i = !1) {
      await s.deleteTask(n, r, i), fetch(`/task/api/${n}`, {
        method: "DELETE",
        headers: Z(t, e, a),
        body: JSON.stringify({ boardId: r })
      }).then(() => console.log("[api] Background sync: deleteTask completed")).catch((c) => console.error("[api] Failed to sync deleteTask:", c));
    },
    // Board operations
    async createBoard(n) {
      const r = await s.createBoard(n);
      return fetch("/task/api/boards", {
        method: "POST",
        headers: Z(t, e, a),
        body: JSON.stringify({ boardId: n })
      }).then(() => console.log("[api] Background sync: createBoard completed")).catch((i) => console.error("[api] Failed to sync createBoard:", i)), r;
    },
    async deleteBoard(n) {
      const r = await s.deleteBoard(n);
      return fetch(`/task/api/boards/${encodeURIComponent(n)}`, {
        method: "DELETE",
        headers: Z(t, e, a)
      }).then(() => console.log("[api] Background sync: deleteBoard completed")).catch((i) => console.error("[api] Failed to sync deleteBoard:", i)), r;
    },
    async getTasks(n = "main") {
      return await s.getTasks(n);
    }
  };
}
function qt(t) {
  t = t.trim();
  const e = (n) => n.trim().replace(/\s+/g, "-"), a = t.match(/^["']([^"']+)["']\s*(.*)$/);
  if (a) {
    const n = a[1].trim(), i = a[2].match(/#[^\s#]+/g)?.map((c) => e(c.slice(1))).filter(Boolean) || [];
    return { title: n, tag: i.length ? i.join(" ") : void 0 };
  }
  const s = t.match(/^(.+?)\s+(#.+)$/);
  if (s) {
    const n = s[1].trim(), i = s[2].match(/#[^\s#]+/g)?.map((c) => e(c.slice(1))).filter(Boolean) || [];
    return { title: n, tag: i.length ? i.join(" ") : void 0 };
  }
  return { title: t.trim() };
}
function Yt(t, e = 6, a = []) {
  const s = t.flatMap((r) => r.tag?.split(" ") || []).filter(Boolean), n = {};
  return s.forEach((r) => n[r] = (n[r] || 0) + 1), a.filter(Boolean).forEach((r) => {
    n[r] || (n[r] = 0);
  }), Object.entries(n).sort((r, i) => i[1] - r[1]).slice(0, e).map(([r]) => r);
}
function vt(t, e) {
  return t.filter((a) => a.tag?.split(" ").includes(e));
}
function Kt(t, e, a) {
  const s = Array.isArray(a) && a.length > 0;
  return t.filter((n) => {
    const r = n.tag?.split(" ") || [];
    return s ? a.some((c) => r.includes(c)) && !e.some((c) => r.includes(c)) : !e.some((i) => r.includes(i));
  });
}
function dt(t) {
  return Array.from(new Set(t.flatMap((e) => e.tag?.split(" ") || []).filter(Boolean)));
}
const E = `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
function gt(t, e, a, s = 50) {
  setTimeout(() => {
    try {
      const n = new BroadcastChannel("tasks");
      n.postMessage({ type: "tasks-updated", sessionId: t, userType: e, userId: a }), n.close();
    } catch (n) {
      console.error("[useTasks] Broadcast failed:", n);
    }
  }, s);
}
function zt({ userType: t, userId: e, sessionId: a }) {
  const [s, n] = N([]), [r, i] = N(/* @__PURE__ */ new Set()), c = Jt(
    () => Ht(t, e || "public", a),
    [t, e, a]
  ), [T, S] = N(null), [p, b] = N("main");
  async function $() {
    console.log("[useTasks] initialLoad called"), "syncFromApi" in c && await c.syncFromApi(), await _();
  }
  async function _() {
    console.log("[useTasks] reload called", { currentBoardId: p, stack: new Error().stack?.split(`
`).slice(1, 4).join(`
`) });
    const o = await c.getBoards();
    S(o);
    const l = o.boards.find((d) => d.id === p);
    l ? (console.log("[useTasks] reload: found current board", { boardId: l.id, taskCount: l.tasks?.length || 0 }), n((l.tasks || []).filter((d) => d.state === "Active"))) : (console.log("[useTasks] reload: board not found", { currentBoardId: p }), n([]));
  }
  st(() => {
    console.log("[useTasks] User context changed, clearing state and reloading", { userType: t, userId: e }), n([]), i(/* @__PURE__ */ new Set()), S(null), b("main"), _();
  }, [t, e]), st(() => {
    console.log("[useTasks] Setting up BroadcastChannel listener", { currentBoardId: p, userType: t, userId: e });
    try {
      const o = new BroadcastChannel("tasks");
      return o.onmessage = (l) => {
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
        console.log("[useTasks] Cleaning up BroadcastChannel listener", { currentBoardId: p }), o.close();
      };
    } catch (o) {
      console.error("[useTasks] Failed to setup BroadcastChannel", o);
    }
  }, [p, t, e]);
  async function W(o) {
    if (o = o.trim(), !!o)
      try {
        const l = qt(o);
        return await c.createTask(l, p), await _(), !0;
      } catch (l) {
        return alert(l.message || "Failed to create task"), !1;
      }
  }
  async function H(o) {
    const l = `complete-${o}`;
    if (!r.has(l)) {
      i((d) => /* @__PURE__ */ new Set([...d, l]));
      try {
        await c.completeTask(o, p), await _();
      } catch (d) {
        d?.message?.includes("404") || alert(d.message || "Failed to complete task");
      } finally {
        i((d) => {
          const m = new Set(d);
          return m.delete(l), m;
        });
      }
    }
  }
  async function K(o) {
    console.log("[useTasks] deleteTask START", { taskId: o, currentBoardId: p });
    const l = `delete-${o}`;
    if (r.has(l)) {
      console.log("[useTasks] deleteTask: already pending, skipping", { operationKey: l });
      return;
    }
    i((d) => /* @__PURE__ */ new Set([...d, l]));
    try {
      console.log("[useTasks] deleteTask: calling api.deleteTask", { taskId: o, currentBoardId: p }), await c.deleteTask(o, p), console.log("[useTasks] deleteTask: calling reload"), await _(), console.log("[useTasks] deleteTask END");
    } catch (d) {
      d?.message?.includes("404") || alert(d.message || "Failed to delete task");
    } finally {
      i((d) => {
        const m = new Set(d);
        return m.delete(l), m;
      });
    }
  }
  async function F(o) {
    const l = prompt("Enter tag (without #):");
    if (!l) return;
    const d = l.trim().replace(/^#+/, "").replace(/\s+/g, "-"), m = s.find((u) => u.id === o);
    if (!m) return;
    const y = m.tag?.split(" ") || [];
    if (y.includes(d)) return;
    const f = [...y, d].join(" ");
    try {
      await c.patchTask(o, { tag: f }, p), await _();
    } catch (u) {
      alert(u.message || "Failed to add tag");
    }
  }
  async function P(o, l, d = {}) {
    const { suppressBroadcast: m = !1, skipReload: y = !1 } = d;
    try {
      await c.patchTask(o, l, p, m), y || await _();
    } catch (f) {
      throw f;
    }
  }
  async function x(o) {
    console.log("[useTasks] bulkUpdateTaskTags START", { count: o.length });
    try {
      for (const { taskId: l, tag: d } of o)
        await c.patchTask(l, { tag: d }, p, !0);
      console.log("[useTasks] bulkUpdateTaskTags: broadcasting bulk update with delay"), gt(E, t, e), console.log("[useTasks] bulkUpdateTaskTags: calling reload"), await _(), console.log("[useTasks] bulkUpdateTaskTags END");
    } catch (l) {
      throw console.error("[useTasks] bulkUpdateTaskTags ERROR", l), l;
    }
  }
  async function M(o) {
    console.log("[useTasks] clearTasksByTag START", { tag: o, currentBoardId: p, taskCount: s.length });
    const l = s.filter((d) => d.tag?.split(" ").includes(o));
    if (console.log("[useTasks] clearTasksByTag: found tasks with tag", { tag: o, count: l.length }), l.length === 0) {
      console.log("[useTasks] clearTasksByTag: no tasks found with this tag, just deleting tag");
      try {
        await c.deleteTag(o, p), await _(), console.log("[useTasks] clearTasksByTag END (no tasks to clear)");
      } catch (d) {
        console.error("[useTasks] clearTasksByTag ERROR", d), console.error("[useTasks] clearTasksByTag: Please fix this error:", d.message);
      }
      return;
    }
    console.log("[useTasks] clearTasksByTag: proceeding without confirmation (dialogs blocked)", { taskCount: l.length });
    try {
      console.log("[useTasks] clearTasksByTag: starting to patch tasks");
      for (const d of l) {
        const m = d.tag?.split(" ") || [], y = m.filter((u) => u !== o), f = y.length > 0 ? y.join(" ") : null;
        console.log("[useTasks] clearTasksByTag: patching task", { taskId: d.id, oldTags: m, newTags: y }), await c.patchTask(d.id, { tag: f }, p, !0);
      }
      console.log("[useTasks] clearTasksByTag: deleting tag from board", { tag: o, currentBoardId: p }), await c.deleteTag(o, p), console.log("[useTasks] clearTasksByTag: broadcasting bulk update with delay"), gt(E, t, e), console.log("[useTasks] clearTasksByTag: calling reload"), await _(), console.log("[useTasks] clearTasksByTag END");
    } catch (d) {
      console.error("[useTasks] clearTasksByTag ERROR", d), alert(d.message || "Failed to remove tag from tasks");
    }
  }
  async function R(o) {
    if (confirm("Clear all remaining tasks?"))
      try {
        for (const l of o)
          await c.deleteTask(l.id, p);
        await _();
      } catch (l) {
        alert(l.message || "Failed to clear remaining tasks");
      }
  }
  async function J(o) {
    await c.createBoard(o), b(o);
    const l = await c.getBoards();
    S(l);
    const d = l.boards.find((m) => m.id === o);
    d ? (console.log("[useTasks] createBoard: switched to new board", { boardId: o, taskCount: d.tasks?.length || 0 }), n((d.tasks || []).filter((m) => m.state === "Active"))) : (console.log("[useTasks] createBoard: new board not found (should be empty)", { boardId: o }), n([]));
  }
  async function U(o, l) {
    if (console.log("[useTasks] moveTasksToBoard START", { targetBoardId: o, ids: l, currentBoardId: p }), !T) return;
    const d = [];
    for (const f of T.boards)
      for (const u of f.tasks || [])
        l.includes(u.id) && d.push({ id: u.id, title: u.title, tag: u.tag || void 0, boardId: f.id });
    console.log("[useTasks] moveTasksToBoard: found tasks to move", { count: d.length });
    for (const f of d)
      await c.createTask({ title: f.title, tag: f.tag }, o, !0), await c.deleteTask(f.id, f.boardId, !0);
    console.log("[useTasks] moveTasksToBoard: broadcasting bulk update with delay"), gt(E, t, e), console.log("[useTasks] moveTasksToBoard: switching to target board", { targetBoardId: o }), b(o);
    const m = await c.getBoards();
    S(m);
    const y = m.boards.find((f) => f.id === o);
    y && (console.log("[useTasks] moveTasksToBoard: loaded target board tasks", { count: y.tasks?.length || 0 }), n((y.tasks || []).filter((f) => f.state === "Active"))), console.log("[useTasks] moveTasksToBoard END");
  }
  async function G(o) {
    if (await c.deleteBoard(o), p === o) {
      b("main");
      const l = await c.getBoards();
      S(l);
      const d = l.boards.find((m) => m.id === "main");
      d ? (console.log("[useTasks] deleteBoard: switched to main board", { taskCount: d.tasks?.length || 0 }), n((d.tasks || []).filter((m) => m.state === "Active"))) : (console.log("[useTasks] deleteBoard: main board not found"), n([]));
    } else
      await _();
  }
  async function L(o) {
    await c.createTag(o, p), await _();
  }
  async function V(o) {
    await c.deleteTag(o, p), await _();
  }
  function q(o) {
    b(o);
    const l = T?.boards.find((d) => d.id === o);
    l ? n((l.tasks || []).filter((d) => d.state === "Active")) : _();
  }
  return {
    // Task state
    tasks: s,
    pendingOperations: r,
    // Task operations
    addTask: W,
    completeTask: H,
    deleteTask: K,
    addTagToTask: F,
    updateTaskTags: P,
    bulkUpdateTaskTags: x,
    clearTasksByTag: M,
    clearRemainingTasks: R,
    // Board state
    boards: T,
    currentBoardId: p,
    // Board operations
    createBoard: J,
    deleteBoard: G,
    switchBoard: q,
    moveTasksToBoard: U,
    createTagOnBoard: L,
    deleteTagOnBoard: V,
    // Lifecycle
    initialLoad: $,
    reload: _
  };
}
function Vt({ tasks: t, onTaskUpdate: e, onBulkUpdate: a }) {
  const [s, n] = N(null), [r, i] = N(null), [c, T] = N(/* @__PURE__ */ new Set()), [S, p] = N(!1), [b, $] = N(null), [_, W] = N(null), H = pt(null);
  function K(o, l) {
    const d = c.has(l) && c.size > 0 ? Array.from(c) : [l];
    console.log("[useDragAndDrop] onDragStart", { taskId: l, idsToDrag: d, selectedCount: c.size }), o.dataTransfer.setData("text/plain", d[0]);
    try {
      o.dataTransfer.setData("application/x-hadoku-task-ids", JSON.stringify(d));
    } catch {
    }
    o.dataTransfer.effectAllowed = "copyMove";
    try {
      const m = o.currentTarget, y = m.closest && m.closest(".task-app__item") ? m.closest(".task-app__item") : m;
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
          const B = u.querySelector(".task-app__tag-header") || u.querySelector("h3"), O = (B && B.textContent || "").trim().replace(/^#/, "");
          if (O)
            try {
              o.dataTransfer.setData("application/x-hadoku-task-source", O);
            } catch {
            }
        }
      } catch {
      }
      try {
        const u = y.getBoundingClientRect();
        let B = Math.round(o.clientX - u.left), D = Math.round(o.clientY - u.top);
        B = Math.max(0, Math.min(Math.round(f.offsetWidth - 1), B)), D = Math.max(0, Math.min(Math.round(f.offsetHeight - 1), D)), o.dataTransfer.setDragImage(f, B, D);
      } catch {
        o.dataTransfer.setDragImage(f, 0, 0);
      }
    } catch {
    }
  }
  function F(o) {
    try {
      const l = o.currentTarget;
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
  function P(o) {
    if (o.button === 0) {
      try {
        const l = o.target;
        if (!l || l.closest && l.closest(".task-app__item, .task-app__controls, button, input, textarea, .task-app__item-actions"))
          return;
      } catch {
      }
      p(!0), H.current = { x: o.clientX, y: o.clientY }, $({ x: o.clientX, y: o.clientY, w: 0, h: 0 }), T(/* @__PURE__ */ new Set());
      try {
        document.body.classList.add("marquee-selecting");
      } catch {
      }
    }
  }
  function x(o) {
    if (!S || !H.current) return;
    const l = H.current.x, d = H.current.y, m = o.clientX, y = o.clientY, f = Math.min(l, m), u = Math.min(d, y), B = Math.abs(m - l), D = Math.abs(y - d);
    $({ x: f, y: u, w: B, h: D });
    const O = Array.from(document.querySelectorAll(".task-app__item")), z = /* @__PURE__ */ new Set();
    for (const Y of O) {
      const j = Y.getBoundingClientRect();
      if (!(j.right < f || j.left > f + B || j.bottom < u || j.top > u + D)) {
        const ct = Y.getAttribute("data-task-id");
        ct && z.add(ct), Y.classList.add("selected");
      } else
        Y.classList.remove("selected");
    }
    T(z);
  }
  function M(o) {
    p(!1), $(null), H.current = null;
    try {
      document.body.classList.remove("marquee-selecting");
    } catch {
    }
    try {
      W(Date.now());
    } catch {
    }
  }
  function R() {
    T(/* @__PURE__ */ new Set()), Array.from(document.querySelectorAll(".task-app__item.selected")).forEach((l) => l.classList.remove("selected"));
  }
  st(() => {
    function o(m) {
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
        x(y);
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
    return document.addEventListener("mousedown", o), document.addEventListener("mousemove", l), document.addEventListener("mouseup", d), () => {
      document.removeEventListener("mousedown", o), document.removeEventListener("mousemove", l), document.removeEventListener("mouseup", d);
    };
  }, []);
  function J(o, l) {
    o.preventDefault(), o.dataTransfer.dropEffect = "copy", n(l);
  }
  function U(o) {
    o.currentTarget.contains(o.relatedTarget) || n(null);
  }
  async function G(o, l) {
    o.preventDefault(), n(null), console.log("[useDragAndDrop] onDrop START", { targetTag: l });
    let d = [];
    try {
      const f = o.dataTransfer.getData("application/x-hadoku-task-ids");
      f && (d = JSON.parse(f));
    } catch {
    }
    if (d.length === 0) {
      const f = o.dataTransfer.getData("text/plain");
      f && (d = [f]);
    }
    if (d.length === 0) return;
    let m = null;
    try {
      const f = o.dataTransfer.getData("application/x-hadoku-task-source");
      f && (m = f);
    } catch {
    }
    console.log("[useDragAndDrop] onDrop: processing", { targetTag: l, ids: d, srcTag: m, taskCount: d.length });
    const y = [];
    for (const f of d) {
      const u = t.find((Y) => Y.id === f);
      if (!u) continue;
      const B = u.tag?.split(" ").filter(Boolean) || [];
      if (l === "other") {
        if (B.length === 0) continue;
        y.push({ taskId: f, tag: "" });
        continue;
      }
      const D = B.includes(l);
      let O = B.slice();
      D || O.push(l), m && m !== l && (O = O.filter((Y) => Y !== m));
      const z = O.join(" ").trim();
      y.push({ taskId: f, tag: z });
    }
    console.log("[useDragAndDrop] onDrop: updating tasks", { updateCount: y.length });
    try {
      await a(y), console.log("[useDragAndDrop] onDrop: updates complete, clearing selection");
      try {
        R();
      } catch {
      }
    } catch (f) {
      console.error("Failed to add tag to one or more tasks:", f), alert(f.message || "Failed to add tags");
    }
    console.log("[useDragAndDrop] onDrop END");
  }
  function L(o, l) {
    o.preventDefault(), o.dataTransfer.dropEffect = "copy", i(l);
  }
  function V(o) {
    o.currentTarget.contains(o.relatedTarget) || i(null);
  }
  async function q(o, l) {
    o.preventDefault(), i(null);
    const d = o.dataTransfer.getData("text/plain"), m = t.find((u) => u.id === d);
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
    dragOverFilter: r,
    setDragOverFilter: i,
    selectedIds: c,
    isSelecting: S,
    marqueeRect: b,
    selectionJustEndedAt: _,
    // selection handlers
    selectionStartHandler: P,
    selectionMoveHandler: x,
    selectionEndHandler: M,
    clearSelection: R,
    onDragStart: K,
    onDragEnd: F,
    onDragOver: J,
    onDragLeave: U,
    onDrop: G,
    onFilterDragOver: L,
    onFilterDragLeave: V,
    onFilterDrop: q
  };
}
function Wt() {
  const [t, e] = N({});
  function a(i) {
    e((c) => {
      const S = (c[i] || "desc") === "desc" ? "asc" : "desc";
      return { ...c, [i]: S };
    });
  }
  function s(i, c) {
    return [...i].sort((T, S) => {
      const p = new Date(T.createdAt).getTime(), b = new Date(S.createdAt).getTime();
      return c === "asc" ? p - b : b - p;
    });
  }
  function n(i) {
    return i === "asc" ? "↑" : "↓";
  }
  function r(i) {
    return i === "asc" ? "Sorted by age (oldest first) - click to sort newest first" : "Sorted by age (newest first) - click to sort oldest first";
  }
  return {
    sortDirections: t,
    toggleSort: a,
    sortTasksByAge: s,
    getSortIcon: n,
    getSortTitle: r
  };
}
function Gt(t) {
  const e = /* @__PURE__ */ new Date(), a = new Date(t), s = e.getTime() - a.getTime(), n = Math.floor(s / 1e3), r = Math.floor(n / 60), i = Math.floor(r / 60), c = Math.floor(i / 24);
  return n < 60 ? `${n}s ago` : r < 60 ? `${r}m ago` : i < 24 ? `${i}h ago` : `${c}d ago`;
}
function ut({
  task: t,
  isDraggable: e = !0,
  pendingOperations: a,
  onComplete: s,
  onDelete: n,
  onAddTag: r,
  onDragStart: i,
  onDragEnd: c,
  selected: T = !1
}) {
  const S = a.has(`complete-${t.id}`), p = a.has(`delete-${t.id}`);
  return /* @__PURE__ */ A(
    "li",
    {
      className: `task-app__item ${T ? "selected" : ""}`,
      "data-task-id": t.id,
      draggable: e,
      onDragStart: i ? (b) => i(b, t.id) : void 0,
      onDragEnd: (b) => {
        if (b.currentTarget.classList.remove("dragging"), c)
          try {
            c(b);
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
              onClick: () => n(t.id),
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
  filters: a,
  sortDirections: s,
  dragOverTag: n,
  pendingOperations: r,
  onComplete: i,
  onDelete: c,
  onAddTag: T,
  onDragStart: S,
  onDragEnd: p,
  selectedIds: b,
  onSelectionStart: $,
  onSelectionMove: _,
  onSelectionEnd: W,
  onDragOver: H,
  onDragLeave: K,
  onDrop: F,
  toggleSort: P,
  sortTasksByAge: x,
  getSortIcon: M,
  getSortTitle: R,
  clearTasksByTag: J,
  clearRemainingTasks: U,
  onDeletePersistedTag: G
}) {
  const L = (u, B) => /* @__PURE__ */ A(
    "div",
    {
      className: `task-app__tag-column ${n === u ? "task-app__tag-column--drag-over" : ""}`,
      onDragOver: (D) => H(D, u),
      onDragLeave: K,
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
        /* @__PURE__ */ k("ul", { className: "task-app__list task-app__list--column", children: x(B, s[u] || "desc").map((D) => /* @__PURE__ */ k(
          ut,
          {
            task: D,
            isDraggable: !0,
            pendingOperations: r,
            onComplete: i,
            onDelete: c,
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
  ), V = (u, B) => {
    let D = vt(t, u);
    return o && (D = D.filter((O) => {
      const z = O.tag?.split(" ") || [];
      return a.some((Y) => z.includes(Y));
    })), D.slice(0, B);
  }, q = e.length, o = Array.isArray(a) && a.length > 0, l = t.filter((u) => {
    if (!o) return !0;
    const B = u.tag?.split(" ") || [];
    return a.some((D) => B.includes(D));
  }), d = bt(q), m = o ? e.filter((u) => vt(t, u).some((D) => {
    const O = D.tag?.split(" ") || [];
    return a.some((z) => O.includes(z));
  })) : e.slice(0, d.useTags);
  if (m.length === 0)
    return /* @__PURE__ */ k("ul", { className: "task-app__list", children: l.map((u) => /* @__PURE__ */ k(
      ut,
      {
        task: u,
        pendingOperations: r,
        onComplete: i,
        onDelete: c,
        onAddTag: T,
        onDragStart: S,
        onDragEnd: p,
        selected: b ? b.has(u.id) : !1
      },
      u.id
    )) });
  const y = Kt(t, e, a).filter((u) => {
    if (!o) return !0;
    const B = u.tag?.split(" ") || [];
    return a.some((D) => B.includes(D));
  }), f = bt(m.length);
  return /* @__PURE__ */ A("div", { className: "task-app__dynamic-layout", children: [
    f.rows.length > 0 && /* @__PURE__ */ k(Pt, { children: f.rows.map((u, B) => /* @__PURE__ */ k("div", { className: `task-app__tag-grid task-app__tag-grid--${u.columns}col`, children: u.tagIndices.map((D) => {
      const O = m[D];
      return O ? L(O, V(O, f.maxPerColumn)) : null;
    }) }, B)) }),
    y.length > 0 && /* @__PURE__ */ A(
      "div",
      {
        className: `task-app__remaining ${n === "other" ? "task-app__tag-column--drag-over" : ""}`,
        onDragOver: (u) => {
          u.preventDefault(), u.dataTransfer.dropEffect = "move", H(u, "other");
        },
        onDragLeave: (u) => K(u),
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
          /* @__PURE__ */ k("ul", { className: "task-app__list", children: x(y, s.other || "desc").map((u) => /* @__PURE__ */ k(
            ut,
            {
              task: u,
              pendingOperations: r,
              onComplete: i,
              onDelete: c,
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
  onClose: a,
  onConfirm: s,
  children: n,
  inputValue: r,
  onInputChange: i,
  inputPlaceholder: c,
  confirmLabel: T = "Confirm",
  cancelLabel: S = "Cancel",
  confirmDisabled: p = !1,
  confirmDanger: b = !1
}) {
  return t ? /* @__PURE__ */ k(
    "div",
    {
      className: "modal-overlay",
      onClick: a,
      children: /* @__PURE__ */ A(
        "div",
        {
          className: "modal-card",
          onClick: (_) => _.stopPropagation(),
          children: [
            /* @__PURE__ */ k("h3", { children: e }),
            n,
            i && /* @__PURE__ */ k(
              "input",
              {
                type: "text",
                className: "modal-input",
                value: r || "",
                onChange: (_) => i(_.target.value),
                placeholder: c,
                autoFocus: !0,
                onKeyDown: (_) => {
                  _.key === "Enter" && !p && (_.preventDefault(), s()), _.key === "Escape" && (_.preventDefault(), a());
                }
              }
            ),
            /* @__PURE__ */ A("div", { className: "modal-actions", children: [
              /* @__PURE__ */ k(
                "button",
                {
                  className: "modal-button",
                  onClick: a,
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
function St({ isOpen: t, x: e, y: a, items: s }) {
  return t ? /* @__PURE__ */ k(
    "div",
    {
      className: "board-context-menu",
      style: {
        left: `${e}px`,
        top: `${a}px`
      },
      children: s.map((n, r) => /* @__PURE__ */ k(
        "button",
        {
          className: `context-menu-item ${n.isDanger ? "context-menu-item--danger" : ""}`,
          onClick: n.onClick,
          children: n.label
        },
        r
      ))
    }
  ) : null;
}
function mt(t) {
  let e = [];
  try {
    const a = t.getData("application/x-hadoku-task-ids");
    a && (e = JSON.parse(a));
  } catch {
  }
  if (e.length === 0) {
    const a = t.getData("text/plain");
    a && (e = [a]);
  }
  return e;
}
function Zt(t = {}) {
  const { basename: e = "/task", apiUrl: a, environment: s, userType: n = "public", userId: r = "public", sessionId: i } = t, [c, T] = N(/* @__PURE__ */ new Set()), [S, p] = N([]), [b, $] = N(null), [_, W] = N(!1), [H, K] = N(!1), [F, P] = N(""), [x, M] = N("light"), [R, J] = N(!1), [U, G] = N(null), [L, V] = N(null), q = pt(null), o = pt(null), {
    tasks: l,
    pendingOperations: d,
    initialLoad: m,
    addTask: y,
    completeTask: f,
    deleteTask: u,
    addTagToTask: B,
    updateTaskTags: D,
    bulkUpdateTaskTags: O,
    clearTasksByTag: z,
    clearRemainingTasks: Y,
    // board API
    boards: j,
    currentBoardId: rt,
    createBoard: ct,
    deleteBoard: Dt,
    switchBoard: Bt,
    moveTasksToBoard: yt,
    createTagOnBoard: At,
    deleteTagOnBoard: xt
  } = zt({ userType: n, userId: r, sessionId: i }), v = Vt({
    tasks: l,
    onTaskUpdate: D,
    onBulkUpdate: O
  }), ot = Wt();
  st(() => {
    console.log("[App] User context changed, initializing...", { userType: n, userId: r }), m(), q.current?.focus();
  }, [n, r]), st(() => {
    o.current && o.current.setAttribute("data-theme", x);
  }, [x]), st(() => {
    if (!R && !U && !L) return;
    const g = (h) => {
      const w = h.target;
      w.closest(".theme-picker") || J(!1), w.closest(".board-context-menu") || G(null), w.closest(".tag-context-menu") || V(null);
    };
    return document.addEventListener("mousedown", g), () => document.removeEventListener("mousedown", g);
  }, [R, U, L]);
  async function Ct(g) {
    await y(g) && q.current && (q.current.value = "", q.current.focus());
  }
  function Nt(g) {
    const h = l.filter((w) => w.tag?.split(" ").includes(g));
    $({ tag: g, count: h.length });
  }
  async function Ot(g) {
    const h = g.trim().replace(/\s+/g, "-");
    try {
      await At(h);
      const w = window.__pendingTagTaskIds;
      if (w && w.length > 0) {
        const Q = w.map((C) => {
          const it = l.find((Lt) => Lt.id === C)?.tag?.split(" ").filter(Boolean) || [], Mt = [.../* @__PURE__ */ new Set([...it, h])];
          return { taskId: C, tag: Mt.join(" ") };
        });
        await O(Q), v.clearSelection(), delete window.__pendingTagTaskIds;
      }
    } catch (w) {
      throw console.error("[App] Failed to create tag:", w), w;
    }
  }
  async function $t(g) {
    const h = g.trim();
    try {
      const w = window.__pendingBoardTaskIds;
      await ct(h), w && w.length > 0 && (await yt(h, w), v.clearSelection(), delete window.__pendingBoardTaskIds);
    } catch (w) {
      throw console.error("[App] Failed to create board:", w), w;
    }
  }
  const Et = j?.boards?.find((g) => g.id === rt)?.tags || [], Ft = Yt(l, 6);
  return /* @__PURE__ */ k(
    "div",
    {
      ref: o,
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
                onClick: () => J(!R),
                "aria-label": "Choose theme",
                title: "Choose theme",
                children: x === "light" ? "☀️" : x === "dark" ? "🌙" : x === "strawberry" ? "🍓" : x === "ocean" ? "🌊" : x === "cyberpunk" ? "🤖" : x === "coffee" ? "☕" : "🪻"
              }
            ),
            R && /* @__PURE__ */ A("div", { className: "theme-picker__dropdown", children: [
              /* @__PURE__ */ k(
                "button",
                {
                  className: `theme-picker__option ${x === "light" ? "active" : ""}`,
                  onClick: () => {
                    M("light"), J(!1);
                  },
                  title: "Light theme",
                  children: "☀️"
                }
              ),
              /* @__PURE__ */ k(
                "button",
                {
                  className: `theme-picker__option ${x === "dark" ? "active" : ""}`,
                  onClick: () => {
                    M("dark"), J(!1);
                  },
                  title: "Dark theme",
                  children: "🌙"
                }
              ),
              /* @__PURE__ */ k(
                "button",
                {
                  className: `theme-picker__option ${x === "strawberry" ? "active" : ""}`,
                  onClick: () => {
                    M("strawberry"), J(!1);
                  },
                  title: "Strawberry theme",
                  children: "🍓"
                }
              ),
              /* @__PURE__ */ k(
                "button",
                {
                  className: `theme-picker__option ${x === "ocean" ? "active" : ""}`,
                  onClick: () => {
                    M("ocean"), J(!1);
                  },
                  title: "Ocean theme",
                  children: "🌊"
                }
              ),
              /* @__PURE__ */ k(
                "button",
                {
                  className: `theme-picker__option ${x === "cyberpunk" ? "active" : ""}`,
                  onClick: () => {
                    M("cyberpunk"), J(!1);
                  },
                  title: "Cyberpunk theme",
                  children: "🤖"
                }
              ),
              /* @__PURE__ */ k(
                "button",
                {
                  className: `theme-picker__option ${x === "coffee" ? "active" : ""}`,
                  onClick: () => {
                    M("coffee"), J(!1);
                  },
                  title: "Coffee theme",
                  children: "☕"
                }
              ),
              /* @__PURE__ */ k(
                "button",
                {
                  className: `theme-picker__option ${x === "lavender" ? "active" : ""}`,
                  onClick: () => {
                    M("lavender"), J(!1);
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
                h.preventDefault(), g.id !== "main" && G({ boardId: g.id, x: h.clientX, y: h.clientY });
              },
              onTouchStart: (h) => {
                if (g.id === "main") return;
                const w = setTimeout(() => {
                  const Q = h.touches[0];
                  G({ boardId: g.id, x: Q.clientX, y: Q.clientY });
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
                  } catch (Q) {
                    console.error("Failed moving tasks to board", Q), alert(Q.message || "Failed to move tasks");
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
                P(""), W(!0);
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
                h.length > 0 && (P(""), window.__pendingBoardTaskIds = h, W(!0));
              },
              "aria-label": "Create board",
              children: "＋"
            }
          ) })
        ] }),
        /* @__PURE__ */ k("div", { className: "task-app__controls", children: /* @__PURE__ */ k(
          "input",
          {
            ref: q,
            className: "task-app__input",
            placeholder: "Type a task and press Enter…",
            onKeyDown: (g) => {
              g.key === "Enter" && !g.shiftKey && (g.preventDefault(), Ct(g.target.value)), g.key === "k" && (g.ctrlKey || g.metaKey) && (g.preventDefault(), q.current?.focus());
            }
          }
        ) }),
        /* @__PURE__ */ A("div", { className: "task-app__filters", children: [
          (() => {
            const g = dt(l);
            return Array.from(/* @__PURE__ */ new Set([...Et, ...g, ...S])).map((w) => {
              const Q = c.has(w);
              return /* @__PURE__ */ A(
                "button",
                {
                  onClick: () => {
                    T((C) => {
                      const X = new Set(C);
                      return X.has(w) ? X.delete(w) : X.add(w), X;
                    });
                  },
                  onContextMenu: (C) => {
                    C.preventDefault(), V({ tag: w, x: C.clientX, y: C.clientY });
                  },
                  onTouchStart: (C) => {
                    const X = setTimeout(() => {
                      const it = C.touches[0];
                      V({ tag: w, x: it.clientX, y: it.clientY });
                    }, 500);
                    C.currentTarget.__longPressTimer = X;
                  },
                  onTouchEnd: (C) => {
                    const X = C.currentTarget.__longPressTimer;
                    X && (clearTimeout(X), C.currentTarget.__longPressTimer = null);
                  },
                  onTouchMove: (C) => {
                    const X = C.currentTarget.__longPressTimer;
                    X && (clearTimeout(X), C.currentTarget.__longPressTimer = null);
                  },
                  className: `${Q ? "on" : ""} ${v.dragOverFilter === w ? "task-app__filter-drag-over" : ""}`,
                  onDragOver: (C) => v.onFilterDragOver(C, w),
                  onDragLeave: v.onFilterDragLeave,
                  onDrop: (C) => v.onFilterDrop(C, w),
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
                P(""), K(!0);
              },
              onDragOver: (g) => {
                g.preventDefault(), g.dataTransfer.dropEffect = "copy", v.onFilterDragOver(g, "add-tag");
              },
              onDragLeave: v.onFilterDragLeave,
              onDrop: async (g) => {
                g.preventDefault(), v.onFilterDragLeave(g);
                const h = mt(g.dataTransfer);
                h.length > 0 && (P(""), window.__pendingTagTaskIds = h, K(!0));
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
            filters: Array.from(c),
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
            clearRemainingTasks: Y,
            onDeletePersistedTag: xt
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
            onClose: () => $(null),
            onConfirm: async () => {
              if (!b) return;
              const g = b.tag;
              $(null), await z(g);
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
              W(!1), delete window.__pendingBoardTaskIds;
            },
            onConfirm: async () => {
              if (F.trim()) {
                W(!1);
                try {
                  await $t(F);
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
              K(!1), delete window.__pendingTagTaskIds;
            },
            onConfirm: async () => {
              if (F.trim()) {
                K(!1);
                try {
                  await Ot(F);
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
            isOpen: !!U,
            x: U?.x || 0,
            y: U?.y || 0,
            items: [
              {
                label: "🗑️ Delete Board",
                isDanger: !0,
                onClick: async () => {
                  if (!U) return;
                  const g = j?.boards?.find((h) => h.id === U.boardId)?.name || U.boardId;
                  if (confirm(`Delete board "${g}"? All tasks on this board will be permanently deleted.`))
                    try {
                      await Dt(U.boardId), G(null);
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
                      await z(L.tag), V(null);
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
  const a = new URLSearchParams(window.location.search), s = e.userType || a.get("userType") || "public", n = e.userId || a.get("userId") || "public", r = e.sessionId, i = { ...e, userType: s, userId: n, sessionId: r }, c = Rt(t);
  c.render(/* @__PURE__ */ k(Zt, { ...i })), t.__root = c, console.log("[task-app] Mounted successfully", i);
}
function se(t) {
  t.__root?.unmount();
}
export {
  ne as mount,
  se as unmount
};
