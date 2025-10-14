import { jsxs as C, jsx as k, Fragment as Rt } from "react/jsx-runtime";
import { createRoot as Pt } from "react-dom/client";
import { useState as N, useMemo as Ut, useEffect as st, useRef as pt } from "react";
function jt() {
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
const Tt = (t, e, a) => `${t}-${e}-${a}-tasks`, wt = (t, e, a) => `${t}-${e}-${a}-stats`, St = (t, e) => `${t}-${e}-boards`;
function tt(t = "public", e = "public", a = "main") {
  const s = localStorage.getItem(Tt(t, e, a));
  return s ? JSON.parse(s) : {
    version: 1,
    updatedAt: (/* @__PURE__ */ new Date()).toISOString(),
    tasks: []
  };
}
function et(t, e = "public", a = "public", s = "main") {
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
function at(t = "public", e = "public") {
  const a = localStorage.getItem(St(t, e));
  return a ? JSON.parse(a) : { version: 1, updatedAt: (/* @__PURE__ */ new Date()).toISOString(), boards: [] };
}
function nt(t, e = "public", a = "public") {
  t.updatedAt = (/* @__PURE__ */ new Date()).toISOString(), localStorage.setItem(St(e, a), JSON.stringify(t));
}
function Jt(t = "public", e = "public") {
  return {
    async getBoards() {
      const a = at(t, e);
      if (!a.boards || a.boards.length === 0) {
        const n = { id: "main", name: "main", tasks: [], stats: void 0, tags: [] };
        a.boards = [n], nt(a, t, e), et({ version: 1, updatedAt: (/* @__PURE__ */ new Date()).toISOString(), tasks: [] }, t, e, "main"), kt({ version: 2, updatedAt: (/* @__PURE__ */ new Date()).toISOString(), counters: { created: 0, completed: 0, edited: 0, deleted: 0 }, timeline: [], tasks: {} }, t, e, "main");
      }
      const s = { version: a.version, updatedAt: a.updatedAt, boards: [] };
      for (const n of a.boards) {
        const r = tt(t, e, n.id), c = ht(t, e, n.id), l = { id: n.id, name: n.name, tasks: r.tasks, stats: c, tags: n.tags || [] };
        s.boards.push(l);
      }
      return s;
    },
    async createBoard(a) {
      const s = at(t, e);
      if (console.debug("[localStorageApi] createBoard", { userType: t, userId: e, boardId: a, existing: s.boards.map((r) => r.id) }), s.boards.find((r) => r.id === a))
        throw new Error("Board already exists");
      const n = { id: a, name: a, tasks: [], stats: void 0, tags: [] };
      return s.boards.push(n), nt(s, t, e), et({ version: 1, updatedAt: (/* @__PURE__ */ new Date()).toISOString(), tasks: [] }, t, e, a), kt({ version: 2, updatedAt: (/* @__PURE__ */ new Date()).toISOString(), counters: { created: 0, completed: 0, edited: 0, deleted: 0 }, timeline: [], tasks: {} }, t, e, a), I("boards-updated", { sessionId: $, userType: t, userId: e }), n;
    },
    async deleteBoard(a) {
      const s = at(t, e), n = s.boards.findIndex((r) => r.id === a);
      if (n === -1) throw new Error("Board not found");
      s.boards.splice(n, 1), nt(s, t, e), localStorage.removeItem(Tt(t, e, a)), localStorage.removeItem(wt(t, e, a)), I("boards-updated", { sessionId: $, userType: t, userId: e });
    },
    async getTasks(a = "main") {
      return tt(t, e, a);
    },
    async getStats(a = "main") {
      return ht(t, e, a);
    },
    async createTask(a, s = "main", n = !1) {
      const r = tt(t, e, s), c = (/* @__PURE__ */ new Date()).toISOString(), l = {
        id: jt(),
        title: a.title,
        tag: a.tag || null,
        state: "Active",
        createdAt: c,
        updatedAt: c,
        closedAt: null
      };
      if (r.tasks.push(l), et(r, t, e, s), a.tag) {
        const T = at(t, e), _ = T.boards.find((p) => p.id === s);
        if (_) {
          const p = _.tags || [], b = a.tag.split(" ").filter(Boolean).filter((E) => !p.includes(E));
          b.length && (_.tags = [...p, ...b], nt(T, t, e));
        }
      }
      return lt("created", l, t, e, s), n ? console.log("[localStorageApi] createTask: broadcast suppressed") : (console.log("[localStorageApi] createTask: broadcasting update", { sessionId: $, boardId: s, taskId: l.id }), I("tasks-updated", { sessionId: $, userType: t, userId: e, boardId: s })), l;
    },
    async patchTask(a, s, n = "main", r = !1) {
      const c = tt(t, e, n), l = c.tasks.find((T) => T.id === a);
      if (!l)
        throw new Error("Task not found");
      if (s.title !== void 0 && (l.title = s.title), s.tag !== void 0 && (l.tag = s.tag), s.tag !== void 0) {
        const T = at(t, e), _ = T.boards.find((p) => p.id === n);
        if (_) {
          const p = _.tags || [], b = (s.tag || "").split(" ").filter(Boolean).filter((E) => !p.includes(E));
          b.length && (_.tags = [...p, ...b], nt(T, t, e));
        }
      }
      return l.updatedAt = (/* @__PURE__ */ new Date()).toISOString(), et(c, t, e, n), lt("edited", l, t, e, n), r || I("tasks-updated", { sessionId: $, userType: t, userId: e, boardId: n }), l;
    },
    async completeTask(a, s = "main") {
      const n = tt(t, e, s), r = n.tasks.find((l) => l.id === a);
      if (!r)
        throw new Error("Task not found");
      const c = (/* @__PURE__ */ new Date()).toISOString();
      return r.state = "Completed", r.updatedAt = c, r.closedAt = c, et(n, t, e, s), lt("completed", r, t, e, s), I("tasks-updated", { sessionId: $, userType: t, userId: e, boardId: s }), r;
    },
    async deleteTask(a, s = "main", n = !1) {
      console.log("[localStorageApi] deleteTask START", { id: a, boardId: s, suppressBroadcast: n, sessionId: $ });
      const r = tt(t, e, s), c = r.tasks.find((T) => T.id === a);
      if (!c)
        throw new Error("Task not found");
      const l = (/* @__PURE__ */ new Date()).toISOString();
      return c.state = "Deleted", c.updatedAt = l, c.closedAt = l, et(r, t, e, s), lt("deleted", c, t, e, s), n ? console.log("[localStorageApi] deleteTask: broadcast suppressed") : (console.log("[localStorageApi] deleteTask: broadcasting", { sessionId: $ }), I("tasks-updated", { sessionId: $, userType: t, userId: e, boardId: s })), console.log("[localStorageApi] deleteTask END"), c;
    },
    async createTag(a, s = "main") {
      const n = at(t, e), r = n.boards.find((l) => l.id === s);
      if (!r) throw new Error("Board not found");
      const c = r.tags || [];
      c.includes(a) || (r.tags = [...c, a], nt(n, t, e), I("boards-updated", { sessionId: $, userType: t, userId: e, boardId: s }));
    },
    async deleteTag(a, s = "main") {
      const n = at(t, e), r = n.boards.find((l) => l.id === s);
      if (!r) throw new Error("Board not found");
      const c = r.tags || [];
      r.tags = c.filter((l) => l !== a), nt(n, t, e), I("boards-updated", { sessionId: $, userType: t, userId: e, boardId: s });
    },
    /**
     * Update a task's ID (used when syncing client-generated ID with server-generated ID)
     * @internal This is for API sync purposes only
     */
    async updateTaskId(a, s, n = "main", r = !1) {
      const c = tt(t, e, n), l = c.tasks.findIndex((T) => T.id === a);
      if (l < 0) {
        console.warn("[localStorageApi] updateTaskId: old task not found", { oldId: a, newId: s, boardId: n });
        return;
      }
      c.tasks[l].id = s, et(c, t, e, n), r || I("tasks-updated", { sessionId: $, userType: t, userId: e, boardId: n }), console.log("[localStorageApi] updateTaskId: synced client ID → server ID", { oldId: a, newId: s, boardId: n });
    }
  };
}
function V(t, e, a) {
  const s = {
    "Content-Type": "application/json",
    "X-User-Type": t
  };
  return e && (s["X-User-Id"] = e), a && (s["X-Session-Id"] = a), s;
}
function Xt(t = "public", e = "public", a) {
  const s = Jt(t, e);
  return t === "public" ? s : {
    // Return all boards and tasks for this user. Local first, then background sync.
    async getBoards() {
      const n = await s.getBoards();
      return fetch(`/task/api/boards?userType=${t}&userId=${encodeURIComponent(e)}`, {
        headers: V(t, e, a)
      }).then((r) => r.json()).then(() => console.log("[api] Background sync: getBoards completed")).catch((r) => console.error("[api] Background sync failed (getBoards):", r)), n;
    },
    async getStats(n = "main") {
      const r = await s.getStats(n);
      return fetch(`/task/api/stats?userType=${t}&userId=${encodeURIComponent(e)}&boardId=${encodeURIComponent(n)}`, {
        headers: V(t, e, a)
      }).then((c) => c.json()).then(() => console.log("[api] Background sync: getStats completed")).catch((c) => console.error("[api] Background sync failed (getStats):", c)), r;
    },
    async createTask(n, r = "main", c = !1) {
      const l = await s.createTask(n, r, c);
      return fetch("/task/api", {
        method: "POST",
        headers: V(t, e, a),
        body: JSON.stringify({ ...n, boardId: r })
      }).then((T) => T.json()).then(async (T) => {
        T.ok && T.id !== l.id ? (console.log("[api] Syncing task ID: client=" + l.id + " → server=" + T.id), await s.updateTaskId(l.id, T.id, r, !0), console.log("[api] Background sync: createTask ID updated")) : console.log("[api] Background sync: createTask completed");
      }).catch((T) => console.error("[api] Failed to sync createTask:", T)), l;
    },
    async createTag(n, r = "main") {
      const c = await s.createTag(n, r);
      return fetch("/task/api/tags", {
        method: "POST",
        headers: V(t, e, a),
        body: JSON.stringify({ boardId: r, tag: n })
      }).then(() => console.log("[api] Background sync: createTag completed")).catch((l) => console.error("[api] Failed to sync createTag:", l)), c;
    },
    async deleteTag(n, r = "main") {
      const c = await s.deleteTag(n, r);
      return fetch("/task/api/tags", {
        method: "DELETE",
        headers: V(t, e, a),
        body: JSON.stringify({ boardId: r, tag: n })
      }).then(() => console.log("[api] Background sync: deleteTag completed")).catch((l) => console.error("[api] Failed to sync deleteTag:", l)), c;
    },
    async patchTask(n, r, c = "main", l = !1) {
      const T = await s.patchTask(n, r, c, l);
      return fetch(`/task/api/${n}`, {
        method: "PATCH",
        headers: V(t, e, a),
        body: JSON.stringify({ ...r, boardId: c })
      }).then(() => console.log("[api] Background sync: patchTask completed")).catch((_) => console.error("[api] Failed to sync patchTask:", _)), T;
    },
    async completeTask(n, r = "main") {
      const c = await s.completeTask(n, r);
      return fetch(`/task/api/${n}/complete`, {
        method: "POST",
        headers: V(t, e, a),
        body: JSON.stringify({ boardId: r })
      }).then(() => console.log("[api] Background sync: completeTask completed")).catch((l) => console.error("[api] Failed to sync completeTask:", l)), c;
    },
    async deleteTask(n, r = "main", c = !1) {
      await s.deleteTask(n, r, c), fetch(`/task/api/${n}`, {
        method: "DELETE",
        headers: V(t, e, a),
        body: JSON.stringify({ boardId: r })
      }).then(() => console.log("[api] Background sync: deleteTask completed")).catch((l) => console.error("[api] Failed to sync deleteTask:", l));
    },
    // Board operations
    async createBoard(n) {
      const r = await s.createBoard(n);
      return fetch("/task/api/boards", {
        method: "POST",
        headers: V(t, e, a),
        body: JSON.stringify({ boardId: n })
      }).then(() => console.log("[api] Background sync: createBoard completed")).catch((c) => console.error("[api] Failed to sync createBoard:", c)), r;
    },
    async deleteBoard(n) {
      const r = await s.deleteBoard(n);
      return fetch(`/task/api/boards/${encodeURIComponent(n)}`, {
        method: "DELETE",
        headers: V(t, e, a)
      }).then(() => console.log("[api] Background sync: deleteBoard completed")).catch((c) => console.error("[api] Failed to sync deleteBoard:", c)), r;
    },
    async getTasks(n = "main") {
      const r = await s.getTasks(n);
      return fetch(`/task/api/tasks?userType=${t}&userId=${encodeURIComponent(e)}&boardId=${encodeURIComponent(n)}`, {
        headers: V(t, e, a)
      }).then((c) => c.json()).then(() => console.log("[api] Background sync: getTasks completed")).catch((c) => console.error("[api] Background sync failed (getTasks):", c)), r;
    }
  };
}
function Ht(t) {
  t = t.trim();
  const e = (n) => n.trim().replace(/\s+/g, "-"), a = t.match(/^["']([^"']+)["']\s*(.*)$/);
  if (a) {
    const n = a[1].trim(), c = a[2].match(/#[^\s#]+/g)?.map((l) => e(l.slice(1))).filter(Boolean) || [];
    return { title: n, tag: c.length ? c.join(" ") : void 0 };
  }
  const s = t.match(/^(.+?)\s+(#.+)$/);
  if (s) {
    const n = s[1].trim(), c = s[2].match(/#[^\s#]+/g)?.map((l) => e(l.slice(1))).filter(Boolean) || [];
    return { title: n, tag: c.length ? c.join(" ") : void 0 };
  }
  return { title: t.trim() };
}
function qt(t, e = 6, a = []) {
  const s = t.flatMap((r) => r.tag?.split(" ") || []).filter(Boolean), n = {};
  return s.forEach((r) => n[r] = (n[r] || 0) + 1), a.filter(Boolean).forEach((r) => {
    n[r] || (n[r] = 0);
  }), Object.entries(n).sort((r, c) => c[1] - r[1]).slice(0, e).map(([r]) => r);
}
function vt(t, e) {
  return t.filter((a) => a.tag?.split(" ").includes(e));
}
function Yt(t, e, a) {
  const s = Array.isArray(a) && a.length > 0;
  return t.filter((n) => {
    const r = n.tag?.split(" ") || [];
    return s ? a.some((l) => r.includes(l)) && !e.some((l) => r.includes(l)) : !e.some((c) => r.includes(c));
  });
}
function dt(t) {
  return Array.from(new Set(t.flatMap((e) => e.tag?.split(" ") || []).filter(Boolean)));
}
const $ = `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
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
function Kt({ userType: t, userId: e, sessionId: a }) {
  const [s, n] = N([]), [r, c] = N(/* @__PURE__ */ new Set()), l = Ut(
    () => Xt(t, e || "public", a),
    [t, e, a]
  ), [T, _] = N(null), [p, b] = N("main");
  async function E() {
    console.log("[useTasks] initialLoad called"), await S();
  }
  async function S() {
    console.log("[useTasks] reload called", { currentBoardId: p, stack: new Error().stack?.split(`
`).slice(1, 4).join(`
`) });
    const o = await l.getBoards();
    _(o);
    const i = o.boards.find((d) => d.id === p);
    i ? (console.log("[useTasks] reload: found current board", { boardId: i.id, taskCount: i.tasks?.length || 0 }), n((i.tasks || []).filter((d) => d.state === "Active"))) : (console.log("[useTasks] reload: board not found", { currentBoardId: p }), n([]));
  }
  st(() => {
    console.log("[useTasks] User context changed, clearing state and reloading", { userType: t, userId: e }), n([]), c(/* @__PURE__ */ new Set()), _(null), b("main"), S();
  }, [t, e]), st(() => {
    console.log("[useTasks] Setting up BroadcastChannel listener", { currentBoardId: p, userType: t, userId: e });
    try {
      const o = new BroadcastChannel("tasks");
      return o.onmessage = (i) => {
        const d = i.data || {};
        if (console.log("[useTasks] BroadcastChannel message received", { msg: d, sessionId: $, currentBoardId: p, currentContext: { userType: t, userId: e } }), d.sessionId === $) {
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
        (d.type === "tasks-updated" || d.type === "boards-updated") && (console.log("[useTasks] BroadcastChannel: triggering reload for currentBoardId =", p), S());
      }, () => {
        console.log("[useTasks] Cleaning up BroadcastChannel listener", { currentBoardId: p }), o.close();
      };
    } catch (o) {
      console.error("[useTasks] Failed to setup BroadcastChannel", o);
    }
  }, [p, t, e]);
  async function G(o) {
    if (o = o.trim(), !!o)
      try {
        const i = Ht(o);
        return await l.createTask(i, p), await S(), !0;
      } catch (i) {
        return alert(i.message || "Failed to create task"), !1;
      }
  }
  async function H(o) {
    const i = `complete-${o}`;
    if (!r.has(i)) {
      c((d) => /* @__PURE__ */ new Set([...d, i]));
      try {
        await l.completeTask(o, p), await S();
      } catch (d) {
        d?.message?.includes("404") || alert(d.message || "Failed to complete task");
      } finally {
        c((d) => {
          const m = new Set(d);
          return m.delete(i), m;
        });
      }
    }
  }
  async function K(o) {
    console.log("[useTasks] deleteTask START", { taskId: o, currentBoardId: p });
    const i = `delete-${o}`;
    if (r.has(i)) {
      console.log("[useTasks] deleteTask: already pending, skipping", { operationKey: i });
      return;
    }
    c((d) => /* @__PURE__ */ new Set([...d, i]));
    try {
      console.log("[useTasks] deleteTask: calling api.deleteTask", { taskId: o, currentBoardId: p }), await l.deleteTask(o, p), console.log("[useTasks] deleteTask: calling reload"), await S(), console.log("[useTasks] deleteTask END");
    } catch (d) {
      d?.message?.includes("404") || alert(d.message || "Failed to delete task");
    } finally {
      c((d) => {
        const m = new Set(d);
        return m.delete(i), m;
      });
    }
  }
  async function F(o) {
    const i = prompt("Enter tag (without #):");
    if (!i) return;
    const d = i.trim().replace(/^#+/, "").replace(/\s+/g, "-"), m = s.find((u) => u.id === o);
    if (!m) return;
    const y = m.tag?.split(" ") || [];
    if (y.includes(d)) return;
    const f = [...y, d].join(" ");
    try {
      await l.patchTask(o, { tag: f }, p), await S();
    } catch (u) {
      alert(u.message || "Failed to add tag");
    }
  }
  async function R(o, i, d = {}) {
    const { suppressBroadcast: m = !1, skipReload: y = !1 } = d;
    try {
      await l.patchTask(o, i, p, m), y || await S();
    } catch (f) {
      throw f;
    }
  }
  async function x(o) {
    console.log("[useTasks] bulkUpdateTaskTags START", { count: o.length });
    try {
      for (const { taskId: i, tag: d } of o)
        await l.patchTask(i, { tag: d }, p, !0);
      console.log("[useTasks] bulkUpdateTaskTags: broadcasting bulk update with delay"), gt($, t, e), console.log("[useTasks] bulkUpdateTaskTags: calling reload"), await S(), console.log("[useTasks] bulkUpdateTaskTags END");
    } catch (i) {
      throw console.error("[useTasks] bulkUpdateTaskTags ERROR", i), i;
    }
  }
  async function M(o) {
    console.log("[useTasks] clearTasksByTag START", { tag: o, currentBoardId: p, taskCount: s.length });
    const i = s.filter((d) => d.tag?.split(" ").includes(o));
    if (console.log("[useTasks] clearTasksByTag: found tasks with tag", { tag: o, count: i.length }), i.length === 0) {
      console.log("[useTasks] clearTasksByTag: no tasks found with this tag, just deleting tag");
      try {
        await l.deleteTag(o, p), await S(), console.log("[useTasks] clearTasksByTag END (no tasks to clear)");
      } catch (d) {
        console.error("[useTasks] clearTasksByTag ERROR", d), console.error("[useTasks] clearTasksByTag: Please fix this error:", d.message);
      }
      return;
    }
    console.log("[useTasks] clearTasksByTag: proceeding without confirmation (dialogs blocked)", { taskCount: i.length });
    try {
      console.log("[useTasks] clearTasksByTag: starting to patch tasks");
      for (const d of i) {
        const m = d.tag?.split(" ") || [], y = m.filter((u) => u !== o), f = y.length > 0 ? y.join(" ") : null;
        console.log("[useTasks] clearTasksByTag: patching task", { taskId: d.id, oldTags: m, newTags: y }), await l.patchTask(d.id, { tag: f }, p, !0);
      }
      console.log("[useTasks] clearTasksByTag: deleting tag from board", { tag: o, currentBoardId: p }), await l.deleteTag(o, p), console.log("[useTasks] clearTasksByTag: broadcasting bulk update with delay"), gt($, t, e), console.log("[useTasks] clearTasksByTag: calling reload"), await S(), console.log("[useTasks] clearTasksByTag END");
    } catch (d) {
      console.error("[useTasks] clearTasksByTag ERROR", d), alert(d.message || "Failed to remove tag from tasks");
    }
  }
  async function P(o) {
    if (confirm("Clear all remaining tasks?"))
      try {
        for (const i of o)
          await l.deleteTask(i.id, p);
        await S();
      } catch (i) {
        alert(i.message || "Failed to clear remaining tasks");
      }
  }
  async function U(o) {
    await l.createBoard(o), b(o);
    const i = await l.getBoards();
    _(i);
    const d = i.boards.find((m) => m.id === o);
    d ? (console.log("[useTasks] createBoard: switched to new board", { boardId: o, taskCount: d.tasks?.length || 0 }), n((d.tasks || []).filter((m) => m.state === "Active"))) : (console.log("[useTasks] createBoard: new board not found (should be empty)", { boardId: o }), n([]));
  }
  async function j(o, i) {
    if (console.log("[useTasks] moveTasksToBoard START", { targetBoardId: o, ids: i, currentBoardId: p }), !T) return;
    const d = [];
    for (const f of T.boards)
      for (const u of f.tasks || [])
        i.includes(u.id) && d.push({ id: u.id, title: u.title, tag: u.tag || void 0, boardId: f.id });
    console.log("[useTasks] moveTasksToBoard: found tasks to move", { count: d.length });
    for (const f of d)
      await l.createTask({ title: f.title, tag: f.tag }, o, !0), await l.deleteTask(f.id, f.boardId, !0);
    console.log("[useTasks] moveTasksToBoard: broadcasting bulk update with delay"), gt($, t, e), console.log("[useTasks] moveTasksToBoard: switching to target board", { targetBoardId: o }), b(o);
    const m = await l.getBoards();
    _(m);
    const y = m.boards.find((f) => f.id === o);
    y && (console.log("[useTasks] moveTasksToBoard: loaded target board tasks", { count: y.tasks?.length || 0 }), n((y.tasks || []).filter((f) => f.state === "Active"))), console.log("[useTasks] moveTasksToBoard END");
  }
  async function Q(o) {
    if (await l.deleteBoard(o), p === o) {
      b("main");
      const i = await l.getBoards();
      _(i);
      const d = i.boards.find((m) => m.id === "main");
      d ? (console.log("[useTasks] deleteBoard: switched to main board", { taskCount: d.tasks?.length || 0 }), n((d.tasks || []).filter((m) => m.state === "Active"))) : (console.log("[useTasks] deleteBoard: main board not found"), n([]));
    } else
      await S();
  }
  async function L(o) {
    await l.createTag(o, p), await S();
  }
  async function W(o) {
    await l.deleteTag(o, p), await S();
  }
  function q(o) {
    b(o);
    const i = T?.boards.find((d) => d.id === o);
    i ? n((i.tasks || []).filter((d) => d.state === "Active")) : S();
  }
  return {
    // Task state
    tasks: s,
    pendingOperations: r,
    // Task operations
    addTask: G,
    completeTask: H,
    deleteTask: K,
    addTagToTask: F,
    updateTaskTags: R,
    bulkUpdateTaskTags: x,
    clearTasksByTag: M,
    clearRemainingTasks: P,
    // Board state
    boards: T,
    currentBoardId: p,
    // Board operations
    createBoard: U,
    deleteBoard: Q,
    switchBoard: q,
    moveTasksToBoard: j,
    createTagOnBoard: L,
    deleteTagOnBoard: W,
    // Lifecycle
    initialLoad: E,
    reload: S
  };
}
function zt({ tasks: t, onTaskUpdate: e, onBulkUpdate: a }) {
  const [s, n] = N(null), [r, c] = N(null), [l, T] = N(/* @__PURE__ */ new Set()), [_, p] = N(!1), [b, E] = N(null), [S, G] = N(null), H = pt(null);
  function K(o, i) {
    const d = l.has(i) && l.size > 0 ? Array.from(l) : [i];
    console.log("[useDragAndDrop] onDragStart", { taskId: i, idsToDrag: d, selectedCount: l.size }), o.dataTransfer.setData("text/plain", d[0]);
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
        if (u.has(i)) return new Set(u);
        const B = new Set(u);
        return B.add(i), B;
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
      const i = o.currentTarget;
      i.classList.remove("dragging");
      const d = i.__dragImage;
      d && d.parentNode && d.parentNode.removeChild(d), d && delete i.__dragImage;
    } catch {
    }
    try {
      P();
    } catch {
    }
  }
  function R(o) {
    if (o.button === 0) {
      try {
        const i = o.target;
        if (!i || i.closest && i.closest(".task-app__item, .task-app__controls, button, input, textarea, .task-app__item-actions"))
          return;
      } catch {
      }
      p(!0), H.current = { x: o.clientX, y: o.clientY }, E({ x: o.clientX, y: o.clientY, w: 0, h: 0 }), T(/* @__PURE__ */ new Set());
      try {
        document.body.classList.add("marquee-selecting");
      } catch {
      }
    }
  }
  function x(o) {
    if (!_ || !H.current) return;
    const i = H.current.x, d = H.current.y, m = o.clientX, y = o.clientY, f = Math.min(i, m), u = Math.min(d, y), B = Math.abs(m - i), D = Math.abs(y - d);
    E({ x: f, y: u, w: B, h: D });
    const O = Array.from(document.querySelectorAll(".task-app__item")), z = /* @__PURE__ */ new Set();
    for (const Y of O) {
      const J = Y.getBoundingClientRect();
      if (!(J.right < f || J.left > f + B || J.bottom < u || J.top > u + D)) {
        const ct = Y.getAttribute("data-task-id");
        ct && z.add(ct), Y.classList.add("selected");
      } else
        Y.classList.remove("selected");
    }
    T(z);
  }
  function M(o) {
    p(!1), E(null), H.current = null;
    try {
      document.body.classList.remove("marquee-selecting");
    } catch {
    }
    try {
      G(Date.now());
    } catch {
    }
  }
  function P() {
    T(/* @__PURE__ */ new Set()), Array.from(document.querySelectorAll(".task-app__item.selected")).forEach((i) => i.classList.remove("selected"));
  }
  st(() => {
    function o(m) {
      if (m.button !== 0) return;
      const y = { target: m.target, clientX: m.clientX, clientY: m.clientY, button: m.button };
      try {
        R(y);
      } catch {
      }
    }
    function i(m) {
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
    return document.addEventListener("mousedown", o), document.addEventListener("mousemove", i), document.addEventListener("mouseup", d), () => {
      document.removeEventListener("mousedown", o), document.removeEventListener("mousemove", i), document.removeEventListener("mouseup", d);
    };
  }, []);
  function U(o, i) {
    o.preventDefault(), o.dataTransfer.dropEffect = "copy", n(i);
  }
  function j(o) {
    o.currentTarget.contains(o.relatedTarget) || n(null);
  }
  async function Q(o, i) {
    o.preventDefault(), n(null), console.log("[useDragAndDrop] onDrop START", { targetTag: i });
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
    console.log("[useDragAndDrop] onDrop: processing", { targetTag: i, ids: d, srcTag: m, taskCount: d.length });
    const y = [];
    for (const f of d) {
      const u = t.find((Y) => Y.id === f);
      if (!u) continue;
      const B = u.tag?.split(" ").filter(Boolean) || [];
      if (i === "other") {
        if (B.length === 0) continue;
        y.push({ taskId: f, tag: "" });
        continue;
      }
      const D = B.includes(i);
      let O = B.slice();
      D || O.push(i), m && m !== i && (O = O.filter((Y) => Y !== m));
      const z = O.join(" ").trim();
      y.push({ taskId: f, tag: z });
    }
    console.log("[useDragAndDrop] onDrop: updating tasks", { updateCount: y.length });
    try {
      await a(y), console.log("[useDragAndDrop] onDrop: updates complete, clearing selection");
      try {
        P();
      } catch {
      }
    } catch (f) {
      console.error("Failed to add tag to one or more tasks:", f), alert(f.message || "Failed to add tags");
    }
    console.log("[useDragAndDrop] onDrop END");
  }
  function L(o, i) {
    o.preventDefault(), o.dataTransfer.dropEffect = "copy", c(i);
  }
  function W(o) {
    o.currentTarget.contains(o.relatedTarget) || c(null);
  }
  async function q(o, i) {
    o.preventDefault(), c(null);
    const d = o.dataTransfer.getData("text/plain"), m = t.find((u) => u.id === d);
    if (!m) return;
    const y = m.tag?.split(" ") || [];
    if (y.includes(i)) {
      console.log(`Task already has tag: ${i}`);
      return;
    }
    const f = [...y, i].join(" ");
    console.log(`Adding tag "${i}" to task "${m.title}" via filter drop. New tags: "${f}"`);
    try {
      await e(d, { tag: f });
      try {
        P();
      } catch {
      }
    } catch (u) {
      console.error("Failed to add tag via filter drop:", u), alert(u.message || "Failed to add tag");
    }
  }
  return {
    dragOverTag: s,
    dragOverFilter: r,
    setDragOverFilter: c,
    selectedIds: l,
    isSelecting: _,
    marqueeRect: b,
    selectionJustEndedAt: S,
    // selection handlers
    selectionStartHandler: R,
    selectionMoveHandler: x,
    selectionEndHandler: M,
    clearSelection: P,
    onDragStart: K,
    onDragEnd: F,
    onDragOver: U,
    onDragLeave: j,
    onDrop: Q,
    onFilterDragOver: L,
    onFilterDragLeave: W,
    onFilterDrop: q
  };
}
function Vt() {
  const [t, e] = N({});
  function a(c) {
    e((l) => {
      const _ = (l[c] || "desc") === "desc" ? "asc" : "desc";
      return { ...l, [c]: _ };
    });
  }
  function s(c, l) {
    return [...c].sort((T, _) => {
      const p = new Date(T.createdAt).getTime(), b = new Date(_.createdAt).getTime();
      return l === "asc" ? p - b : b - p;
    });
  }
  function n(c) {
    return c === "asc" ? "↑" : "↓";
  }
  function r(c) {
    return c === "asc" ? "Sorted by age (oldest first) - click to sort newest first" : "Sorted by age (newest first) - click to sort oldest first";
  }
  return {
    sortDirections: t,
    toggleSort: a,
    sortTasksByAge: s,
    getSortIcon: n,
    getSortTitle: r
  };
}
function Wt(t) {
  const e = /* @__PURE__ */ new Date(), a = new Date(t), s = e.getTime() - a.getTime(), n = Math.floor(s / 1e3), r = Math.floor(n / 60), c = Math.floor(r / 60), l = Math.floor(c / 24);
  return n < 60 ? `${n}s ago` : r < 60 ? `${r}m ago` : c < 24 ? `${c}h ago` : `${l}d ago`;
}
function ut({
  task: t,
  isDraggable: e = !0,
  pendingOperations: a,
  onComplete: s,
  onDelete: n,
  onAddTag: r,
  onDragStart: c,
  onDragEnd: l,
  selected: T = !1
}) {
  const _ = a.has(`complete-${t.id}`), p = a.has(`delete-${t.id}`);
  return /* @__PURE__ */ C(
    "li",
    {
      className: `task-app__item ${T ? "selected" : ""}`,
      "data-task-id": t.id,
      draggable: e,
      onDragStart: c ? (b) => c(b, t.id) : void 0,
      onDragEnd: (b) => {
        if (b.currentTarget.classList.remove("dragging"), l)
          try {
            l(b);
          } catch {
          }
      },
      children: [
        /* @__PURE__ */ C("div", { className: "task-app__item-content", children: [
          /* @__PURE__ */ k("div", { className: "task-app__item-title", title: t.title, children: t.title }),
          /* @__PURE__ */ C("div", { className: "task-app__item-meta-row", children: [
            t.tag ? /* @__PURE__ */ k("div", { className: "task-app__item-tag", children: t.tag.split(" ").map((b) => `#${b}`).join(" ") }) : /* @__PURE__ */ k("div", {}),
            /* @__PURE__ */ k("div", { className: "task-app__item-age", children: Wt(t.createdAt) })
          ] })
        ] }),
        /* @__PURE__ */ C("div", { className: "task-app__item-actions", children: [
          /* @__PURE__ */ k(
            "button",
            {
              className: "task-app__action-btn task-app__complete-btn",
              onClick: () => s(t.id),
              title: "Complete task",
              disabled: _ || p,
              children: _ ? "⏳" : "✓"
            }
          ),
          /* @__PURE__ */ k(
            "button",
            {
              className: "task-app__action-btn task-app__delete-btn",
              onClick: () => n(t.id),
              title: "Delete task",
              disabled: _ || p,
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
function Gt({
  tasks: t,
  topTags: e,
  filters: a,
  sortDirections: s,
  dragOverTag: n,
  pendingOperations: r,
  onComplete: c,
  onDelete: l,
  onAddTag: T,
  onDragStart: _,
  onDragEnd: p,
  selectedIds: b,
  onSelectionStart: E,
  onSelectionMove: S,
  onSelectionEnd: G,
  onDragOver: H,
  onDragLeave: K,
  onDrop: F,
  toggleSort: R,
  sortTasksByAge: x,
  getSortIcon: M,
  getSortTitle: P,
  clearTasksByTag: U,
  clearRemainingTasks: j,
  onDeletePersistedTag: Q
}) {
  const L = (u, B) => /* @__PURE__ */ C(
    "div",
    {
      className: `task-app__tag-column ${n === u ? "task-app__tag-column--drag-over" : ""}`,
      onDragOver: (D) => H(D, u),
      onDragLeave: K,
      onDrop: (D) => F(D, u),
      children: [
        /* @__PURE__ */ C("div", { className: "task-app__tag-header-row", children: [
          /* @__PURE__ */ C("h3", { className: "task-app__tag-header", children: [
            "#",
            u
          ] }),
          /* @__PURE__ */ k(
            "button",
            {
              className: "task-app__sort-btn task-app__sort-btn--active",
              onClick: () => R(u),
              title: P(s[u] || "desc"),
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
            onComplete: c,
            onDelete: l,
            onAddTag: T,
            onDragStart: _,
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
    return o && (D = D.filter((O) => {
      const z = O.tag?.split(" ") || [];
      return a.some((Y) => z.includes(Y));
    })), D.slice(0, B);
  }, q = e.length, o = Array.isArray(a) && a.length > 0, i = t.filter((u) => {
    if (!o) return !0;
    const B = u.tag?.split(" ") || [];
    return a.some((D) => B.includes(D));
  }), d = bt(q), m = o ? e.filter((u) => vt(t, u).some((D) => {
    const O = D.tag?.split(" ") || [];
    return a.some((z) => O.includes(z));
  })) : e.slice(0, d.useTags);
  if (m.length === 0)
    return /* @__PURE__ */ k("ul", { className: "task-app__list", children: i.map((u) => /* @__PURE__ */ k(
      ut,
      {
        task: u,
        pendingOperations: r,
        onComplete: c,
        onDelete: l,
        onAddTag: T,
        onDragStart: _,
        onDragEnd: p,
        selected: b ? b.has(u.id) : !1
      },
      u.id
    )) });
  const y = Yt(t, e, a).filter((u) => {
    if (!o) return !0;
    const B = u.tag?.split(" ") || [];
    return a.some((D) => B.includes(D));
  }), f = bt(m.length);
  return /* @__PURE__ */ C("div", { className: "task-app__dynamic-layout", children: [
    f.rows.length > 0 && /* @__PURE__ */ k(Rt, { children: f.rows.map((u, B) => /* @__PURE__ */ k("div", { className: `task-app__tag-grid task-app__tag-grid--${u.columns}col`, children: u.tagIndices.map((D) => {
      const O = m[D];
      return O ? L(O, W(O, f.maxPerColumn)) : null;
    }) }, B)) }),
    y.length > 0 && /* @__PURE__ */ C(
      "div",
      {
        className: `task-app__remaining ${n === "other" ? "task-app__tag-column--drag-over" : ""}`,
        onDragOver: (u) => {
          u.preventDefault(), u.dataTransfer.dropEffect = "move", H(u, "other");
        },
        onDragLeave: (u) => K(u),
        onDrop: (u) => F(u, "other"),
        children: [
          /* @__PURE__ */ C("div", { className: "task-app__tag-header-row", children: [
            /* @__PURE__ */ k("h3", { className: "task-app__remaining-header", children: "Other Tasks" }),
            /* @__PURE__ */ k(
              "button",
              {
                className: "task-app__sort-btn task-app__sort-btn--active",
                onClick: () => R("other"),
                title: P(s.other || "desc"),
                children: M(s.other || "desc")
              }
            )
          ] }),
          /* @__PURE__ */ k("ul", { className: "task-app__list", children: x(y, s.other || "desc").map((u) => /* @__PURE__ */ k(
            ut,
            {
              task: u,
              pendingOperations: r,
              onComplete: c,
              onDelete: l,
              onAddTag: T,
              onDragStart: _,
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
  onInputChange: c,
  inputPlaceholder: l,
  confirmLabel: T = "Confirm",
  cancelLabel: _ = "Cancel",
  confirmDisabled: p = !1,
  confirmDanger: b = !1
}) {
  return t ? /* @__PURE__ */ k(
    "div",
    {
      className: "modal-overlay",
      onClick: a,
      children: /* @__PURE__ */ C(
        "div",
        {
          className: "modal-card",
          onClick: (S) => S.stopPropagation(),
          children: [
            /* @__PURE__ */ k("h3", { children: e }),
            n,
            c && /* @__PURE__ */ k(
              "input",
              {
                type: "text",
                className: "modal-input",
                value: r || "",
                onChange: (S) => c(S.target.value),
                placeholder: l,
                autoFocus: !0,
                onKeyDown: (S) => {
                  S.key === "Enter" && !p && (S.preventDefault(), s()), S.key === "Escape" && (S.preventDefault(), a());
                }
              }
            ),
            /* @__PURE__ */ C("div", { className: "modal-actions", children: [
              /* @__PURE__ */ k(
                "button",
                {
                  className: "modal-button",
                  onClick: a,
                  children: _
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
function _t({ isOpen: t, x: e, y: a, items: s }) {
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
function Qt(t = {}) {
  const { basename: e = "/task", apiUrl: a, environment: s, userType: n = "public", userId: r = "public", sessionId: c } = t, [l, T] = N(/* @__PURE__ */ new Set()), [_, p] = N([]), [b, E] = N(null), [S, G] = N(!1), [H, K] = N(!1), [F, R] = N(""), [x, M] = N("light"), [P, U] = N(!1), [j, Q] = N(null), [L, W] = N(null), q = pt(null), o = pt(null), {
    tasks: i,
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
    boards: J,
    currentBoardId: rt,
    createBoard: ct,
    deleteBoard: Dt,
    switchBoard: Bt,
    moveTasksToBoard: yt,
    createTagOnBoard: Ct,
    deleteTagOnBoard: xt
  } = Kt({ userType: n, userId: r, sessionId: c }), v = zt({
    tasks: i,
    onTaskUpdate: D,
    onBulkUpdate: O
  }), ot = Vt();
  st(() => {
    console.log("[App] User context changed, initializing...", { userType: n, userId: r }), m(), q.current?.focus();
  }, [n, r]), st(() => {
    o.current && o.current.setAttribute("data-theme", x);
  }, [x]), st(() => {
    if (!P && !j && !L) return;
    const g = (h) => {
      const w = h.target;
      w.closest(".theme-picker") || U(!1), w.closest(".board-context-menu") || Q(null), w.closest(".tag-context-menu") || W(null);
    };
    return document.addEventListener("mousedown", g), () => document.removeEventListener("mousedown", g);
  }, [P, j, L]);
  async function At(g) {
    await y(g) && q.current && (q.current.value = "", q.current.focus());
  }
  function Nt(g) {
    const h = i.filter((w) => w.tag?.split(" ").includes(g));
    E({ tag: g, count: h.length });
  }
  async function Ot(g) {
    const h = g.trim().replace(/\s+/g, "-");
    try {
      await Ct(h);
      const w = window.__pendingTagTaskIds;
      if (w && w.length > 0) {
        const Z = w.map((A) => {
          const it = i.find((Lt) => Lt.id === A)?.tag?.split(" ").filter(Boolean) || [], Mt = [.../* @__PURE__ */ new Set([...it, h])];
          return { taskId: A, tag: Mt.join(" ") };
        });
        await O(Z), v.clearSelection(), delete window.__pendingTagTaskIds;
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
  const Et = J?.boards?.find((g) => g.id === rt)?.tags || [], Ft = qt(i, 6);
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
      children: /* @__PURE__ */ C("div", { className: "task-app", children: [
        /* @__PURE__ */ C("div", { className: "task-app__header-container", children: [
          /* @__PURE__ */ k("h1", { className: "task-app__header", children: "Tasks" }),
          /* @__PURE__ */ C("div", { className: "theme-picker", children: [
            /* @__PURE__ */ k(
              "button",
              {
                className: "theme-toggle-btn",
                onClick: () => U(!P),
                "aria-label": "Choose theme",
                title: "Choose theme",
                children: x === "light" ? "☀️" : x === "dark" ? "🌙" : x === "strawberry" ? "🍓" : x === "ocean" ? "🌊" : x === "cyberpunk" ? "🤖" : x === "coffee" ? "☕" : "🪻"
              }
            ),
            P && /* @__PURE__ */ C("div", { className: "theme-picker__dropdown", children: [
              /* @__PURE__ */ k(
                "button",
                {
                  className: `theme-picker__option ${x === "light" ? "active" : ""}`,
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
                  className: `theme-picker__option ${x === "dark" ? "active" : ""}`,
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
                  className: `theme-picker__option ${x === "strawberry" ? "active" : ""}`,
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
                  className: `theme-picker__option ${x === "ocean" ? "active" : ""}`,
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
                  className: `theme-picker__option ${x === "cyberpunk" ? "active" : ""}`,
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
                  className: `theme-picker__option ${x === "coffee" ? "active" : ""}`,
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
                  className: `theme-picker__option ${x === "lavender" ? "active" : ""}`,
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
        /* @__PURE__ */ C("div", { className: "task-app__boards", children: [
          /* @__PURE__ */ k("div", { className: "task-app__board-list", children: (J && J.boards ? J.boards.slice(0, 5) : [{ id: "main", name: "main" }]).map((g) => /* @__PURE__ */ k(
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
          /* @__PURE__ */ k("div", { className: "task-app__board-actions", children: (!J || J.boards && J.boards.length < 5) && /* @__PURE__ */ k(
            "button",
            {
              className: `board-add-btn ${v.dragOverFilter === "add-board" ? "board-btn--drag-over" : ""}`,
              onClick: () => {
                R(""), G(!0);
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
                h.length > 0 && (R(""), window.__pendingBoardTaskIds = h, G(!0));
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
              g.key === "Enter" && !g.shiftKey && (g.preventDefault(), At(g.target.value)), g.key === "k" && (g.ctrlKey || g.metaKey) && (g.preventDefault(), q.current?.focus());
            }
          }
        ) }),
        /* @__PURE__ */ C("div", { className: "task-app__filters", children: [
          (() => {
            const g = dt(i);
            return Array.from(/* @__PURE__ */ new Set([...Et, ...g, ..._])).map((w) => {
              const Z = l.has(w);
              return /* @__PURE__ */ C(
                "button",
                {
                  onClick: () => {
                    T((A) => {
                      const X = new Set(A);
                      return X.has(w) ? X.delete(w) : X.add(w), X;
                    });
                  },
                  onContextMenu: (A) => {
                    A.preventDefault(), W({ tag: w, x: A.clientX, y: A.clientY });
                  },
                  onTouchStart: (A) => {
                    const X = setTimeout(() => {
                      const it = A.touches[0];
                      W({ tag: w, x: it.clientX, y: it.clientY });
                    }, 500);
                    A.currentTarget.__longPressTimer = X;
                  },
                  onTouchEnd: (A) => {
                    const X = A.currentTarget.__longPressTimer;
                    X && (clearTimeout(X), A.currentTarget.__longPressTimer = null);
                  },
                  onTouchMove: (A) => {
                    const X = A.currentTarget.__longPressTimer;
                    X && (clearTimeout(X), A.currentTarget.__longPressTimer = null);
                  },
                  className: `${Z ? "on" : ""} ${v.dragOverFilter === w ? "task-app__filter-drag-over" : ""}`,
                  onDragOver: (A) => v.onFilterDragOver(A, w),
                  onDragLeave: v.onFilterDragLeave,
                  onDrop: (A) => v.onFilterDrop(A, w),
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
                R(""), K(!0);
              },
              onDragOver: (g) => {
                g.preventDefault(), g.dataTransfer.dropEffect = "copy", v.onFilterDragOver(g, "add-tag");
              },
              onDragLeave: v.onFilterDragLeave,
              onDrop: async (g) => {
                g.preventDefault(), v.onFilterDragLeave(g);
                const h = mt(g.dataTransfer);
                h.length > 0 && (R(""), window.__pendingTagTaskIds = h, K(!0));
              },
              "aria-label": "Add tag",
              children: "＋"
            }
          )
        ] }),
        /* @__PURE__ */ k(
          Gt,
          {
            tasks: i,
            topTags: Ft,
            filters: Array.from(l),
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
            onClose: () => E(null),
            onConfirm: async () => {
              if (!b) return;
              const g = b.tag;
              E(null), await z(g);
            },
            confirmLabel: "Clear Tag",
            confirmDanger: !0,
            children: b && /* @__PURE__ */ C("p", { children: [
              "This will remove ",
              /* @__PURE__ */ C("strong", { children: [
                "#",
                b.tag
              ] }),
              " from",
              " ",
              /* @__PURE__ */ C("strong", { children: [
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
            isOpen: S,
            title: "Create New Board",
            onClose: () => {
              G(!1), delete window.__pendingBoardTaskIds;
            },
            onConfirm: async () => {
              if (F.trim()) {
                G(!1);
                try {
                  await $t(F);
                } catch (g) {
                  console.error("[App] Failed to create board:", g);
                }
              }
            },
            inputValue: F,
            onInputChange: R,
            inputPlaceholder: "Board name",
            confirmLabel: "Create",
            confirmDisabled: !F.trim(),
            children: (() => {
              const g = window.__pendingBoardTaskIds;
              return g && g.length > 0 ? /* @__PURE__ */ C("p", { className: "modal-hint", children: [
                g.length,
                " task",
                g.length > 1 ? "s" : "",
                " will be moved to this board"
              ] }) : null;
            })()
          }
        ),
        /* @__PURE__ */ C(
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
            onInputChange: R,
            inputPlaceholder: "Enter new tag name",
            confirmLabel: "Create",
            confirmDisabled: !F.trim(),
            children: [
              (() => {
                const g = window.__pendingTagTaskIds;
                return g && g.length > 0 ? /* @__PURE__ */ C("p", { className: "modal-hint", children: [
                  "This tag will be applied to ",
                  g.length,
                  " task",
                  g.length > 1 ? "s" : ""
                ] }) : null;
              })(),
              dt(i).length > 0 && /* @__PURE__ */ C("div", { className: "modal-section", children: [
                /* @__PURE__ */ k("label", { className: "modal-label", children: "Existing tags:" }),
                /* @__PURE__ */ k("div", { className: "modal-tags-list", children: dt(i).map((g) => /* @__PURE__ */ C("span", { className: "modal-tag-chip", children: [
                  "#",
                  g
                ] }, g)) })
              ] })
            ]
          }
        ),
        /* @__PURE__ */ k(
          _t,
          {
            isOpen: !!j,
            x: j?.x || 0,
            y: j?.y || 0,
            items: [
              {
                label: "🗑️ Delete Board",
                isDanger: !0,
                onClick: async () => {
                  if (!j) return;
                  const g = J?.boards?.find((h) => h.id === j.boardId)?.name || j.boardId;
                  if (confirm(`Delete board "${g}"? All tasks on this board will be permanently deleted.`))
                    try {
                      await Dt(j.boardId), Q(null);
                    } catch (h) {
                      console.error("[App] Failed to delete board:", h), alert(h.message || "Failed to delete board");
                    }
                }
              }
            ]
          }
        ),
        /* @__PURE__ */ k(
          _t,
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
                  const g = i.filter((h) => h.tag?.split(" ").includes(L.tag));
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
function ae(t, e = {}) {
  const a = new URLSearchParams(window.location.search), s = e.userType || a.get("userType") || "public", n = e.userId || a.get("userId") || "public", r = e.sessionId, c = { ...e, userType: s, userId: n, sessionId: r }, l = Pt(t);
  l.render(/* @__PURE__ */ k(Qt, { ...c })), t.__root = l, console.log("[task-app] Mounted successfully", c);
}
function ne(t) {
  t.__root?.unmount();
}
export {
  ae as mount,
  ne as unmount
};
