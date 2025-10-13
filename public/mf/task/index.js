import { jsxs as A, jsx as h, Fragment as Me } from "react/jsx-runtime";
import { createRoot as Le } from "react-dom/client";
import { useState as O, useEffect as oe, useRef as _e } from "react";
function Re() {
  const e = Date.now().toString(36).toUpperCase().padStart(8, "0"), t = Array.from(crypto.getRandomValues(new Uint8Array(16))).map((n) => (n % 36).toString(36).toUpperCase()).join("");
  return e + t.slice(0, 18);
}
function W(e, t, n = 50) {
  setTimeout(() => {
    try {
      const a = new BroadcastChannel("tasks");
      a.postMessage({ type: e, ...t }), a.close();
    } catch (a) {
      console.error("[localStorageApi] Broadcast failed:", a);
    }
  }, n);
}
const he = (e, t, n) => `${e}-${t}-${n}-tasks`, ke = (e, t, n) => `${e}-${t}-${n}-stats`, Se = (e, t) => `${e}-${t}-boards`;
function ae(e = "public", t = "public", n = "main") {
  const a = localStorage.getItem(he(e, t, n));
  return a ? JSON.parse(a) : {
    version: 1,
    updatedAt: (/* @__PURE__ */ new Date()).toISOString(),
    tasks: []
  };
}
function ne(e, t = "public", n = "public", a = "main") {
  e.updatedAt = (/* @__PURE__ */ new Date()).toISOString(), localStorage.setItem(he(t, n, a), JSON.stringify(e));
}
function fe(e = "public", t = "public", n = "main") {
  const a = localStorage.getItem(ke(e, t, n));
  return a ? JSON.parse(a) : {
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
function pe(e, t = "public", n = "public", a = "main") {
  e.updatedAt = (/* @__PURE__ */ new Date()).toISOString(), localStorage.setItem(ke(t, n, a), JSON.stringify(e));
}
function ie(e, t, n = "public", a = "public", s = "main") {
  const o = fe(n, a, s);
  o.counters[e]++, o.timeline.push({
    t: (/* @__PURE__ */ new Date()).toISOString(),
    event: e,
    id: t.id
  }), o.tasks[t.id] = {
    id: t.id,
    title: t.title,
    tag: t.tag,
    state: t.state,
    createdAt: t.createdAt,
    updatedAt: t.updatedAt,
    closedAt: t.closedAt
  }, pe(o, n, a, s);
}
function Q(e = "public", t = "public") {
  const n = localStorage.getItem(Se(e, t));
  return n ? JSON.parse(n) : { version: 1, updatedAt: (/* @__PURE__ */ new Date()).toISOString(), boards: [] };
}
function Z(e, t = "public", n = "public") {
  e.updatedAt = (/* @__PURE__ */ new Date()).toISOString(), localStorage.setItem(Se(t, n), JSON.stringify(e));
}
function Pe(e = "public", t = "public") {
  return {
    async getBoards() {
      const n = Q(e, t);
      if (!n.boards || n.boards.length === 0) {
        const s = { id: "main", name: "main", tasks: [], stats: void 0, tags: [] };
        n.boards = [s], Z(n, e, t), ne({ version: 1, updatedAt: (/* @__PURE__ */ new Date()).toISOString(), tasks: [] }, e, t, "main"), pe({ version: 2, updatedAt: (/* @__PURE__ */ new Date()).toISOString(), counters: { created: 0, completed: 0, edited: 0, deleted: 0 }, timeline: [], tasks: {} }, e, t, "main");
      }
      const a = { version: n.version, updatedAt: n.updatedAt, boards: [] };
      for (const s of n.boards) {
        const o = ae(e, t, s.id), c = fe(e, t, s.id), g = { id: s.id, name: s.name, tasks: o.tasks, stats: c, tags: s.tags || [] };
        a.boards.push(g);
      }
      return a;
    },
    async createBoard(n) {
      const a = Q(e, t);
      if (console.debug("[localStorageApi] createBoard", { userType: e, userId: t, boardId: n, existing: a.boards.map((o) => o.id) }), a.boards.find((o) => o.id === n))
        throw new Error("Board already exists");
      const s = { id: n, name: n, tasks: [], stats: void 0, tags: [] };
      return a.boards.push(s), Z(a, e, t), ne({ version: 1, updatedAt: (/* @__PURE__ */ new Date()).toISOString(), tasks: [] }, e, t, n), pe({ version: 2, updatedAt: (/* @__PURE__ */ new Date()).toISOString(), counters: { created: 0, completed: 0, edited: 0, deleted: 0 }, timeline: [], tasks: {} }, e, t, n), W("boards-updated", { sessionId: L, userType: e, userId: t }), s;
    },
    async deleteBoard(n) {
      const a = Q(e, t), s = a.boards.findIndex((o) => o.id === n);
      if (s === -1) throw new Error("Board not found");
      a.boards.splice(s, 1), Z(a, e, t), localStorage.removeItem(he(e, t, n)), localStorage.removeItem(ke(e, t, n)), W("boards-updated", { sessionId: L, userType: e, userId: t });
    },
    async getTasks(n = "main") {
      return ae(e, t, n);
    },
    async getStats(n = "main") {
      return fe(e, t, n);
    },
    async createTask(n, a = "main", s = !1) {
      const o = ae(e, t, a), c = (/* @__PURE__ */ new Date()).toISOString(), g = {
        id: Re(),
        title: n.title,
        tag: n.tag || null,
        state: "Active",
        createdAt: c,
        updatedAt: c,
        closedAt: null
      };
      if (o.tasks.push(g), ne(o, e, t, a), n.tag) {
        const _ = Q(e, t), p = _.boards.find((b) => b.id === a);
        if (p) {
          const b = p.tags || [], S = n.tag.split(" ").filter(Boolean).filter((C) => !b.includes(C));
          S.length && (p.tags = [...b, ...S], Z(_, e, t));
        }
      }
      return ie("created", g, e, t, a), s ? console.log("[localStorageApi] createTask: broadcast suppressed") : (console.log("[localStorageApi] createTask: broadcasting update", { sessionId: L, boardId: a, taskId: g.id }), W("tasks-updated", { sessionId: L, userType: e, userId: t, boardId: a })), g;
    },
    async patchTask(n, a, s = "main", o = !1) {
      const c = ae(e, t, s), g = c.tasks.find((_) => _.id === n);
      if (!g)
        throw new Error("Task not found");
      if (a.title !== void 0 && (g.title = a.title), a.tag !== void 0 && (g.tag = a.tag), a.tag !== void 0) {
        const _ = Q(e, t), p = _.boards.find((b) => b.id === s);
        if (p) {
          const b = p.tags || [], S = (a.tag || "").split(" ").filter(Boolean).filter((C) => !b.includes(C));
          S.length && (p.tags = [...b, ...S], Z(_, e, t));
        }
      }
      return g.updatedAt = (/* @__PURE__ */ new Date()).toISOString(), ne(c, e, t, s), ie("edited", g, e, t, s), o || W("tasks-updated", { sessionId: L, userType: e, userId: t, boardId: s }), g;
    },
    async completeTask(n, a = "main") {
      const s = ae(e, t, a), o = s.tasks.find((g) => g.id === n);
      if (!o)
        throw new Error("Task not found");
      const c = (/* @__PURE__ */ new Date()).toISOString();
      return o.state = "Completed", o.updatedAt = c, o.closedAt = c, ne(s, e, t, a), ie("completed", o, e, t, a), W("tasks-updated", { sessionId: L, userType: e, userId: t, boardId: a }), o;
    },
    async deleteTask(n, a = "main", s = !1) {
      console.log("[localStorageApi] deleteTask START", { id: n, boardId: a, suppressBroadcast: s, sessionId: L });
      const o = ae(e, t, a), c = o.tasks.find((_) => _.id === n);
      if (!c)
        throw new Error("Task not found");
      const g = (/* @__PURE__ */ new Date()).toISOString();
      return c.state = "Deleted", c.updatedAt = g, c.closedAt = g, ne(o, e, t, a), ie("deleted", c, e, t, a), s ? console.log("[localStorageApi] deleteTask: broadcast suppressed") : (console.log("[localStorageApi] deleteTask: broadcasting", { sessionId: L }), W("tasks-updated", { sessionId: L, userType: e, userId: t, boardId: a })), console.log("[localStorageApi] deleteTask END"), c;
    },
    async createTag(n, a = "main") {
      const s = Q(e, t), o = s.boards.find((g) => g.id === a);
      if (!o) throw new Error("Board not found");
      const c = o.tags || [];
      c.includes(n) || (o.tags = [...c, n], Z(s, e, t), W("boards-updated", { sessionId: L, userType: e, userId: t, boardId: a }));
    },
    async deleteTag(n, a = "main") {
      const s = Q(e, t), o = s.boards.find((g) => g.id === a);
      if (!o) throw new Error("Board not found");
      const c = o.tags || [];
      o.tags = c.filter((g) => g !== n), Z(s, e, t), W("boards-updated", { sessionId: L, userType: e, userId: t, boardId: a });
    }
  };
}
function G(e, t) {
  const n = {
    "Content-Type": "application/json",
    "X-User-Type": e
  };
  return t && (n["X-User-Id"] = t), n;
}
function Ue(e = "public", t = "public") {
  const n = Pe(e, t);
  return e === "public" ? n : {
    // Return all boards and tasks for this user. Local first, then background sync.
    async getBoards() {
      const a = await n.getBoards();
      return fetch(`/task/api/boards?userType=${e}&userId=${encodeURIComponent(t)}`).then((s) => s.json()).then(() => console.log("[api] Background sync: getBoards completed")).catch((s) => console.error("[api] Background sync failed (getBoards):", s)), a;
    },
    async getStats(a = "main") {
      const s = await n.getStats(a);
      return fetch(`/task/api/stats?userType=${e}&userId=${encodeURIComponent(t)}&boardId=${encodeURIComponent(a)}`).then((o) => o.json()).then(() => console.log("[api] Background sync: getStats completed")).catch((o) => console.error("[api] Background sync failed (getStats):", o)), s;
    },
    async createTask(a, s = "main", o = !1) {
      const c = await n.createTask(a, s, o);
      return fetch("/task/api", {
        method: "POST",
        headers: G(e, t),
        body: JSON.stringify({ ...a, boardId: s })
      }).then(() => console.log("[api] Background sync: createTask completed")).catch((g) => console.error("[api] Failed to sync createTask:", g)), c;
    },
    async createTag(a, s = "main") {
      const o = await n.createTag(a, s);
      return fetch("/task/api/tags", {
        method: "POST",
        headers: G(e, t),
        body: JSON.stringify({ boardId: s, tag: a })
      }).then(() => console.log("[api] Background sync: createTag completed")).catch((c) => console.error("[api] Failed to sync createTag:", c)), o;
    },
    async deleteTag(a, s = "main") {
      const o = await n.deleteTag(a, s);
      return fetch("/task/api/tags", {
        method: "DELETE",
        headers: G(e, t),
        body: JSON.stringify({ boardId: s, tag: a })
      }).then(() => console.log("[api] Background sync: deleteTag completed")).catch((c) => console.error("[api] Failed to sync deleteTag:", c)), o;
    },
    async patchTask(a, s, o = "main", c = !1) {
      const g = await n.patchTask(a, s, o, c);
      return fetch(`/task/api/${a}`, {
        method: "PATCH",
        headers: G(e, t),
        body: JSON.stringify({ ...s, boardId: o })
      }).then(() => console.log("[api] Background sync: patchTask completed")).catch((_) => console.error("[api] Failed to sync patchTask:", _)), g;
    },
    async completeTask(a, s = "main") {
      const o = await n.completeTask(a, s);
      return fetch(`/task/api/${a}/complete`, {
        method: "POST",
        headers: G(e, t),
        body: JSON.stringify({ boardId: s })
      }).then(() => console.log("[api] Background sync: completeTask completed")).catch((c) => console.error("[api] Failed to sync completeTask:", c)), o;
    },
    async deleteTask(a, s = "main", o = !1) {
      await n.deleteTask(a, s, o), fetch(`/task/api/${a}`, {
        method: "DELETE",
        headers: G(e, t),
        body: JSON.stringify({ boardId: s })
      }).then(() => console.log("[api] Background sync: deleteTask completed")).catch((c) => console.error("[api] Failed to sync deleteTask:", c));
    },
    // Board operations
    async createBoard(a) {
      const s = await n.createBoard(a);
      return fetch("/task/api/boards", {
        method: "POST",
        headers: G(e, t),
        body: JSON.stringify({ boardId: a })
      }).then(() => console.log("[api] Background sync: createBoard completed")).catch((o) => console.error("[api] Failed to sync createBoard:", o)), s;
    },
    async deleteBoard(a) {
      const s = await n.deleteBoard(a);
      return fetch(`/task/api/boards/${encodeURIComponent(a)}`, {
        method: "DELETE",
        headers: G(e, t)
      }).then(() => console.log("[api] Background sync: deleteBoard completed")).catch((o) => console.error("[api] Failed to sync deleteBoard:", o)), s;
    },
    async getTasks(a = "main") {
      const s = await n.getTasks(a);
      return fetch(`/task/api/tasks?userType=${e}&userId=${encodeURIComponent(t)}&boardId=${encodeURIComponent(a)}`).then((o) => o.json()).then(() => console.log("[api] Background sync: getTasks completed")).catch((o) => console.error("[api] Background sync failed (getTasks):", o)), s;
    }
  };
}
function je(e) {
  e = e.trim();
  const t = (s) => s.trim().replace(/\s+/g, "-"), n = e.match(/^["']([^"']+)["']\s*(.*)$/);
  if (n) {
    const s = n[1].trim(), c = n[2].match(/#[^\s#]+/g)?.map((g) => t(g.slice(1))).filter(Boolean) || [];
    return { title: s, tag: c.length ? c.join(" ") : void 0 };
  }
  const a = e.match(/^(.+?)\s+(#.+)$/);
  if (a) {
    const s = a[1].trim(), c = a[2].match(/#[^\s#]+/g)?.map((g) => t(g.slice(1))).filter(Boolean) || [];
    return { title: s, tag: c.length ? c.join(" ") : void 0 };
  }
  return { title: e.trim() };
}
function Je(e, t = 6, n = []) {
  const a = e.flatMap((o) => o.tag?.split(" ") || []).filter(Boolean), s = {};
  return a.forEach((o) => s[o] = (s[o] || 0) + 1), n.filter(Boolean).forEach((o) => {
    s[o] || (s[o] = 0);
  }), Object.entries(s).sort((o, c) => c[1] - o[1]).slice(0, t).map(([o]) => o);
}
function ye(e, t) {
  return e.filter((n) => n.tag?.split(" ").includes(t));
}
function He(e, t, n) {
  const a = Array.isArray(n) && n.length > 0;
  return e.filter((s) => {
    const o = s.tag?.split(" ") || [];
    return a ? n.some((g) => o.includes(g)) && !t.some((g) => o.includes(g)) : !t.some((c) => o.includes(c));
  });
}
function le(e) {
  return Array.from(new Set(e.flatMap((t) => t.tag?.split(" ") || []).filter(Boolean)));
}
const L = `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
function de(e, t, n, a = 50) {
  setTimeout(() => {
    try {
      const s = new BroadcastChannel("tasks");
      s.postMessage({ type: "tasks-updated", sessionId: e, userType: t, userId: n }), s.close();
    } catch (s) {
      console.error("[useTasks] Broadcast failed:", s);
    }
  }, a);
}
function Xe({ userType: e, userId: t }) {
  const [n, a] = O([]), [s, o] = O(/* @__PURE__ */ new Set()), c = Ue(e, t || "public"), [g, _] = O(null), [p, b] = O("main");
  async function S() {
    console.log("[useTasks] initialLoad called"), await C();
  }
  async function C() {
    console.log("[useTasks] reload called", { currentBoardId: p, stack: new Error().stack?.split(`
`).slice(1, 4).join(`
`) });
    const d = await c.getBoards();
    _(d);
    const r = d.boards.find((i) => i.id === p);
    r ? (console.log("[useTasks] reload: found current board", { boardId: r.id, taskCount: r.tasks?.length || 0 }), a((r.tasks || []).filter((i) => i.state === "Active"))) : (console.log("[useTasks] reload: board not found", { currentBoardId: p }), a([]));
  }
  oe(() => {
    console.log("[useTasks] Setting up BroadcastChannel listener", { currentBoardId: p });
    try {
      const d = new BroadcastChannel("tasks");
      return d.onmessage = (r) => {
        const i = r.data || {};
        if (console.log("[useTasks] BroadcastChannel message received", { msg: i, sessionId: L, currentBoardId: p }), i.sessionId === L) {
          console.log("[useTasks] Ignoring own broadcast message");
          return;
        }
        (i.type === "tasks-updated" || i.type === "boards-updated") && (console.log("[useTasks] BroadcastChannel: triggering reload for currentBoardId =", p), C());
      }, () => {
        console.log("[useTasks] Cleaning up BroadcastChannel listener", { currentBoardId: p }), d.close();
      };
    } catch (d) {
      console.error("[useTasks] Failed to setup BroadcastChannel", d);
    }
  }, [p]);
  async function F(d) {
    if (d = d.trim(), !!d)
      try {
        const r = je(d);
        return await c.createTask(r, p), await C(), !0;
      } catch (r) {
        return alert(r.message || "Failed to create task"), !1;
      }
  }
  async function ee(d) {
    const r = `complete-${d}`;
    if (!s.has(r)) {
      o((i) => /* @__PURE__ */ new Set([...i, r]));
      try {
        await c.completeTask(d, p), await C();
      } catch (i) {
        i?.message?.includes("404") || alert(i.message || "Failed to complete task");
      } finally {
        o((i) => {
          const m = new Set(i);
          return m.delete(r), m;
        });
      }
    }
  }
  async function R(d) {
    console.log("[useTasks] deleteTask START", { taskId: d, currentBoardId: p });
    const r = `delete-${d}`;
    if (s.has(r)) {
      console.log("[useTasks] deleteTask: already pending, skipping", { operationKey: r });
      return;
    }
    o((i) => /* @__PURE__ */ new Set([...i, r]));
    try {
      console.log("[useTasks] deleteTask: calling api.deleteTask", { taskId: d, currentBoardId: p }), await c.deleteTask(d, p), console.log("[useTasks] deleteTask: calling reload"), await C(), console.log("[useTasks] deleteTask END");
    } catch (i) {
      i?.message?.includes("404") || alert(i.message || "Failed to delete task");
    } finally {
      o((i) => {
        const m = new Set(i);
        return m.delete(r), m;
      });
    }
  }
  async function P(d) {
    const r = prompt("Enter tag (without #):");
    if (!r) return;
    const i = r.trim().replace(/^#+/, "").replace(/\s+/g, "-"), m = n.find((f) => f.id === d);
    if (!m) return;
    const T = m.tag?.split(" ") || [];
    if (T.includes(i)) return;
    const w = [...T, i].join(" ");
    try {
      await c.patchTask(d, { tag: w }, p), await C();
    } catch (f) {
      alert(f.message || "Failed to add tag");
    }
  }
  async function X(d, r, i = {}) {
    const { suppressBroadcast: m = !1, skipReload: T = !1 } = i;
    try {
      await c.patchTask(d, r, p, m), T || await C();
    } catch (w) {
      throw w;
    }
  }
  async function N(d) {
    console.log("[useTasks] bulkUpdateTaskTags START", { count: d.length });
    try {
      for (const { taskId: r, tag: i } of d)
        await c.patchTask(r, { tag: i }, p, !0);
      console.log("[useTasks] bulkUpdateTaskTags: broadcasting bulk update with delay"), de(L, e, t), console.log("[useTasks] bulkUpdateTaskTags: calling reload"), await C(), console.log("[useTasks] bulkUpdateTaskTags END");
    } catch (r) {
      throw console.error("[useTasks] bulkUpdateTaskTags ERROR", r), r;
    }
  }
  async function U(d) {
    console.log("[useTasks] clearTasksByTag START", { tag: d, currentBoardId: p, taskCount: n.length });
    const r = n.filter((i) => i.tag?.split(" ").includes(d));
    if (console.log("[useTasks] clearTasksByTag: found tasks with tag", { tag: d, count: r.length }), r.length === 0) {
      console.log("[useTasks] clearTasksByTag: no tasks found with this tag, just deleting tag");
      try {
        await c.deleteTag(d, p), await C(), console.log("[useTasks] clearTasksByTag END (no tasks to clear)");
      } catch (i) {
        console.error("[useTasks] clearTasksByTag ERROR", i), console.error("[useTasks] clearTasksByTag: Please fix this error:", i.message);
      }
      return;
    }
    console.log("[useTasks] clearTasksByTag: proceeding without confirmation (dialogs blocked)", { taskCount: r.length });
    try {
      console.log("[useTasks] clearTasksByTag: starting to patch tasks");
      for (const i of r) {
        const m = i.tag?.split(" ") || [], T = m.filter((f) => f !== d), w = T.length > 0 ? T.join(" ") : null;
        console.log("[useTasks] clearTasksByTag: patching task", { taskId: i.id, oldTags: m, newTags: T }), await c.patchTask(i.id, { tag: w }, p, !0);
      }
      console.log("[useTasks] clearTasksByTag: deleting tag from board", { tag: d, currentBoardId: p }), await c.deleteTag(d, p), console.log("[useTasks] clearTasksByTag: broadcasting bulk update with delay"), de(L, e, t), console.log("[useTasks] clearTasksByTag: calling reload"), await C(), console.log("[useTasks] clearTasksByTag END");
    } catch (i) {
      console.error("[useTasks] clearTasksByTag ERROR", i), alert(i.message || "Failed to remove tag from tasks");
    }
  }
  async function Y(d) {
    if (confirm("Clear all remaining tasks?"))
      try {
        for (const r of d)
          await c.deleteTask(r.id, p);
        await C();
      } catch (r) {
        alert(r.message || "Failed to clear remaining tasks");
      }
  }
  async function E(d) {
    await c.createBoard(d), b(d);
    const r = await c.getBoards();
    _(r);
    const i = r.boards.find((m) => m.id === d);
    i ? (console.log("[useTasks] createBoard: switched to new board", { boardId: d, taskCount: i.tasks?.length || 0 }), a((i.tasks || []).filter((m) => m.state === "Active"))) : (console.log("[useTasks] createBoard: new board not found (should be empty)", { boardId: d }), a([]));
  }
  async function j(d, r) {
    if (console.log("[useTasks] moveTasksToBoard START", { targetBoardId: d, ids: r, currentBoardId: p }), !g) return;
    const i = [];
    for (const w of g.boards)
      for (const f of w.tasks || [])
        r.includes(f.id) && i.push({ id: f.id, title: f.title, tag: f.tag || void 0, boardId: w.id });
    console.log("[useTasks] moveTasksToBoard: found tasks to move", { count: i.length });
    for (const w of i)
      await c.createTask({ title: w.title, tag: w.tag }, d, !0), await c.deleteTask(w.id, w.boardId, !0);
    console.log("[useTasks] moveTasksToBoard: broadcasting bulk update with delay"), de(L, e, t), console.log("[useTasks] moveTasksToBoard: switching to target board", { targetBoardId: d }), b(d);
    const m = await c.getBoards();
    _(m);
    const T = m.boards.find((w) => w.id === d);
    T && (console.log("[useTasks] moveTasksToBoard: loaded target board tasks", { count: T.tasks?.length || 0 }), a((T.tasks || []).filter((w) => w.state === "Active"))), console.log("[useTasks] moveTasksToBoard END");
  }
  async function z(d) {
    if (await c.deleteBoard(d), p === d) {
      b("main");
      const r = await c.getBoards();
      _(r);
      const i = r.boards.find((m) => m.id === "main");
      i ? (console.log("[useTasks] deleteBoard: switched to main board", { taskCount: i.tasks?.length || 0 }), a((i.tasks || []).filter((m) => m.state === "Active"))) : (console.log("[useTasks] deleteBoard: main board not found"), a([]));
    } else
      await C();
  }
  async function J(d) {
    await c.createTag(d, p), await C();
  }
  async function V(d) {
    await c.deleteTag(d, p), await C();
  }
  function K(d) {
    b(d);
    const r = g?.boards.find((i) => i.id === d);
    r ? a((r.tasks || []).filter((i) => i.state === "Active")) : C();
  }
  return {
    // Task state
    tasks: n,
    pendingOperations: s,
    // Task operations
    addTask: F,
    completeTask: ee,
    deleteTask: R,
    addTagToTask: P,
    updateTaskTags: X,
    bulkUpdateTaskTags: N,
    clearTasksByTag: U,
    clearRemainingTasks: Y,
    // Board state
    boards: g,
    currentBoardId: p,
    // Board operations
    createBoard: E,
    deleteBoard: z,
    switchBoard: K,
    moveTasksToBoard: j,
    createTagOnBoard: J,
    deleteTagOnBoard: V,
    // Lifecycle
    initialLoad: S,
    reload: C
  };
}
function qe({ tasks: e, onTaskUpdate: t, onBulkUpdate: n }) {
  const [a, s] = O(null), [o, c] = O(null), [g, _] = O(/* @__PURE__ */ new Set()), [p, b] = O(!1), [S, C] = O(null), [F, ee] = O(null), R = _e(null);
  function P(r, i) {
    const m = g.has(i) && g.size > 0 ? Array.from(g) : [i];
    console.log("[useDragAndDrop] onDragStart", { taskId: i, idsToDrag: m, selectedCount: g.size }), r.dataTransfer.setData("text/plain", m[0]);
    try {
      r.dataTransfer.setData("application/x-hadoku-task-ids", JSON.stringify(m));
    } catch {
    }
    r.dataTransfer.effectAllowed = "copyMove";
    try {
      const T = r.currentTarget, w = T.closest && T.closest(".task-app__item") ? T.closest(".task-app__item") : T;
      w.classList.add("dragging");
      const f = w.cloneNode(!0);
      f.style.boxSizing = "border-box", f.style.width = `${w.offsetWidth}px`, f.style.height = `${w.offsetHeight}px`, f.style.opacity = "0.95", f.style.transform = "none", f.style.filter = "drop-shadow(0 6px 18px rgba(0,0,0,0.12))", f.classList.add("drag-image"), f.style.position = "absolute", f.style.top = "-9999px", f.style.left = "-9999px", document.body.appendChild(f), w.__dragImage = f, _((u) => {
        if (u.has(i)) return new Set(u);
        const B = new Set(u);
        return B.add(i), B;
      });
      try {
        const u = w.closest(".task-app__tag-column");
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
        const u = w.getBoundingClientRect();
        let B = Math.round(r.clientX - u.left), D = Math.round(r.clientY - u.top);
        B = Math.max(0, Math.min(Math.round(f.offsetWidth - 1), B)), D = Math.max(0, Math.min(Math.round(f.offsetHeight - 1), D)), r.dataTransfer.setDragImage(f, B, D);
      } catch {
        r.dataTransfer.setDragImage(f, 0, 0);
      }
    } catch {
    }
  }
  function X(r) {
    try {
      const i = r.currentTarget;
      i.classList.remove("dragging");
      const m = i.__dragImage;
      m && m.parentNode && m.parentNode.removeChild(m), m && delete i.__dragImage;
    } catch {
    }
    try {
      E();
    } catch {
    }
  }
  function N(r) {
    if (r.button === 0) {
      try {
        const i = r.target;
        if (!i || i.closest && i.closest(".task-app__item, .task-app__controls, button, input, textarea, .task-app__item-actions"))
          return;
      } catch {
      }
      b(!0), R.current = { x: r.clientX, y: r.clientY }, C({ x: r.clientX, y: r.clientY, w: 0, h: 0 }), _(/* @__PURE__ */ new Set());
      try {
        document.body.classList.add("marquee-selecting");
      } catch {
      }
    }
  }
  function U(r) {
    if (!p || !R.current) return;
    const i = R.current.x, m = R.current.y, T = r.clientX, w = r.clientY, f = Math.min(i, T), u = Math.min(m, w), B = Math.abs(T - i), D = Math.abs(w - m);
    C({ x: f, y: u, w: B, h: D });
    const $ = Array.from(document.querySelectorAll(".task-app__item")), M = /* @__PURE__ */ new Set();
    for (const H of $) {
      const te = H.getBoundingClientRect();
      if (!(te.right < f || te.left > f + B || te.bottom < u || te.top > u + D)) {
        const re = H.getAttribute("data-task-id");
        re && M.add(re), H.classList.add("selected");
      } else
        H.classList.remove("selected");
    }
    _(M);
  }
  function Y(r) {
    b(!1), C(null), R.current = null;
    try {
      document.body.classList.remove("marquee-selecting");
    } catch {
    }
    try {
      ee(Date.now());
    } catch {
    }
  }
  function E() {
    _(/* @__PURE__ */ new Set()), Array.from(document.querySelectorAll(".task-app__item.selected")).forEach((i) => i.classList.remove("selected"));
  }
  oe(() => {
    function r(T) {
      if (T.button !== 0) return;
      const w = { target: T.target, clientX: T.clientX, clientY: T.clientY, button: T.button };
      try {
        N(w);
      } catch {
      }
    }
    function i(T) {
      const w = { clientX: T.clientX, clientY: T.clientY };
      try {
        U(w);
      } catch {
      }
    }
    function m(T) {
      const w = { clientX: T.clientX, clientY: T.clientY };
      try {
        Y(w);
      } catch {
      }
    }
    return document.addEventListener("mousedown", r), document.addEventListener("mousemove", i), document.addEventListener("mouseup", m), () => {
      document.removeEventListener("mousedown", r), document.removeEventListener("mousemove", i), document.removeEventListener("mouseup", m);
    };
  }, []);
  function j(r, i) {
    r.preventDefault(), r.dataTransfer.dropEffect = "copy", s(i);
  }
  function z(r) {
    r.currentTarget.contains(r.relatedTarget) || s(null);
  }
  async function J(r, i) {
    r.preventDefault(), s(null), console.log("[useDragAndDrop] onDrop START", { targetTag: i });
    let m = [];
    try {
      const f = r.dataTransfer.getData("application/x-hadoku-task-ids");
      f && (m = JSON.parse(f));
    } catch {
    }
    if (m.length === 0) {
      const f = r.dataTransfer.getData("text/plain");
      f && (m = [f]);
    }
    if (m.length === 0) return;
    let T = null;
    try {
      const f = r.dataTransfer.getData("application/x-hadoku-task-source");
      f && (T = f);
    } catch {
    }
    console.log("[useDragAndDrop] onDrop: processing", { targetTag: i, ids: m, srcTag: T, taskCount: m.length });
    const w = [];
    for (const f of m) {
      const u = e.find((H) => H.id === f);
      if (!u) continue;
      const B = u.tag?.split(" ").filter(Boolean) || [];
      if (i === "other") {
        if (B.length === 0) continue;
        w.push({ taskId: f, tag: "" });
        continue;
      }
      const D = B.includes(i);
      let $ = B.slice();
      D || $.push(i), T && T !== i && ($ = $.filter((H) => H !== T));
      const M = $.join(" ").trim();
      w.push({ taskId: f, tag: M });
    }
    console.log("[useDragAndDrop] onDrop: updating tasks", { updateCount: w.length });
    try {
      await n(w), console.log("[useDragAndDrop] onDrop: updates complete, clearing selection");
      try {
        E();
      } catch {
      }
    } catch (f) {
      console.error("Failed to add tag to one or more tasks:", f), alert(f.message || "Failed to add tags");
    }
    console.log("[useDragAndDrop] onDrop END");
  }
  function V(r, i) {
    r.preventDefault(), r.dataTransfer.dropEffect = "copy", c(i);
  }
  function K(r) {
    r.currentTarget.contains(r.relatedTarget) || c(null);
  }
  async function d(r, i) {
    r.preventDefault(), c(null);
    const m = r.dataTransfer.getData("text/plain"), T = e.find((u) => u.id === m);
    if (!T) return;
    const w = T.tag?.split(" ") || [];
    if (w.includes(i)) {
      console.log(`Task already has tag: ${i}`);
      return;
    }
    const f = [...w, i].join(" ");
    console.log(`Adding tag "${i}" to task "${T.title}" via filter drop. New tags: "${f}"`);
    try {
      await t(m, { tag: f });
      try {
        E();
      } catch {
      }
    } catch (u) {
      console.error("Failed to add tag via filter drop:", u), alert(u.message || "Failed to add tag");
    }
  }
  return {
    dragOverTag: a,
    dragOverFilter: o,
    setDragOverFilter: c,
    selectedIds: g,
    isSelecting: p,
    marqueeRect: S,
    selectionJustEndedAt: F,
    // selection handlers
    selectionStartHandler: N,
    selectionMoveHandler: U,
    selectionEndHandler: Y,
    clearSelection: E,
    onDragStart: P,
    onDragEnd: X,
    onDragOver: j,
    onDragLeave: z,
    onDrop: J,
    onFilterDragOver: V,
    onFilterDragLeave: K,
    onFilterDrop: d
  };
}
function Ye() {
  const [e, t] = O({});
  function n(c) {
    t((g) => {
      const p = (g[c] || "desc") === "desc" ? "asc" : "desc";
      return { ...g, [c]: p };
    });
  }
  function a(c, g) {
    return [...c].sort((_, p) => {
      const b = new Date(_.createdAt).getTime(), S = new Date(p.createdAt).getTime();
      return g === "asc" ? b - S : S - b;
    });
  }
  function s(c) {
    return c === "asc" ? "↑" : "↓";
  }
  function o(c) {
    return c === "asc" ? "Sorted by age (oldest first) - click to sort newest first" : "Sorted by age (newest first) - click to sort oldest first";
  }
  return {
    sortDirections: e,
    toggleSort: n,
    sortTasksByAge: a,
    getSortIcon: s,
    getSortTitle: o
  };
}
function Ke(e) {
  const t = /* @__PURE__ */ new Date(), n = new Date(e), a = t.getTime() - n.getTime(), s = Math.floor(a / 1e3), o = Math.floor(s / 60), c = Math.floor(o / 60), g = Math.floor(c / 24);
  return s < 60 ? `${s}s ago` : o < 60 ? `${o}m ago` : c < 24 ? `${c}h ago` : `${g}d ago`;
}
function ge({
  task: e,
  isDraggable: t = !0,
  pendingOperations: n,
  onComplete: a,
  onDelete: s,
  onAddTag: o,
  onDragStart: c,
  onDragEnd: g,
  selected: _ = !1
}) {
  const p = n.has(`complete-${e.id}`), b = n.has(`delete-${e.id}`);
  return /* @__PURE__ */ A(
    "li",
    {
      className: `task-app__item ${_ ? "selected" : ""}`,
      "data-task-id": e.id,
      draggable: t,
      onDragStart: c ? (S) => c(S, e.id) : void 0,
      onDragEnd: (S) => {
        if (S.currentTarget.classList.remove("dragging"), g)
          try {
            g(S);
          } catch {
          }
      },
      children: [
        /* @__PURE__ */ A("div", { className: "task-app__item-content", children: [
          /* @__PURE__ */ h("div", { className: "task-app__item-title", title: e.title, children: e.title }),
          /* @__PURE__ */ A("div", { className: "task-app__item-meta-row", children: [
            e.tag ? /* @__PURE__ */ h("div", { className: "task-app__item-tag", children: e.tag.split(" ").map((S) => `#${S}`).join(" ") }) : /* @__PURE__ */ h("div", {}),
            /* @__PURE__ */ h("div", { className: "task-app__item-age", children: Ke(e.createdAt) })
          ] })
        ] }),
        /* @__PURE__ */ A("div", { className: "task-app__item-actions", children: [
          /* @__PURE__ */ h(
            "button",
            {
              className: "task-app__action-btn task-app__complete-btn",
              onClick: () => a(e.id),
              title: "Complete task",
              disabled: p || b,
              children: p ? "⏳" : "✓"
            }
          ),
          /* @__PURE__ */ h(
            "button",
            {
              className: "task-app__action-btn task-app__delete-btn",
              onClick: () => s(e.id),
              title: "Delete task",
              disabled: p || b,
              children: b ? "⏳" : "×"
            }
          )
        ] })
      ]
    }
  );
}
function ve(e) {
  return e === 0 ? { useTags: 0, maxPerColumn: 1 / 0, rows: [] } : e === 1 ? {
    useTags: 1,
    maxPerColumn: 1 / 0,
    rows: [{ columns: 1, tagIndices: [0] }]
  } : e === 2 ? {
    useTags: 2,
    maxPerColumn: 1 / 0,
    rows: [{ columns: 2, tagIndices: [0, 1] }]
  } : e === 3 ? {
    useTags: 3,
    maxPerColumn: 1 / 0,
    rows: [{ columns: 3, tagIndices: [0, 1, 2] }]
  } : e === 4 ? {
    useTags: 4,
    maxPerColumn: 10,
    rows: [
      { columns: 3, tagIndices: [0, 1, 2] },
      { columns: 1, tagIndices: [3] }
    ]
  } : e === 5 ? {
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
function ze({
  tasks: e,
  topTags: t,
  filters: n,
  sortDirections: a,
  dragOverTag: s,
  pendingOperations: o,
  onComplete: c,
  onDelete: g,
  onAddTag: _,
  onDragStart: p,
  onDragEnd: b,
  selectedIds: S,
  onSelectionStart: C,
  onSelectionMove: F,
  onSelectionEnd: ee,
  onDragOver: R,
  onDragLeave: P,
  onDrop: X,
  toggleSort: N,
  sortTasksByAge: U,
  getSortIcon: Y,
  getSortTitle: E,
  clearTasksByTag: j,
  clearRemainingTasks: z,
  onDeletePersistedTag: J
}) {
  const V = (u, B) => /* @__PURE__ */ A(
    "div",
    {
      className: `task-app__tag-column ${s === u ? "task-app__tag-column--drag-over" : ""}`,
      onDragOver: (D) => R(D, u),
      onDragLeave: P,
      onDrop: (D) => X(D, u),
      children: [
        /* @__PURE__ */ A("div", { className: "task-app__tag-header-row", children: [
          /* @__PURE__ */ A("h3", { className: "task-app__tag-header", children: [
            "#",
            u
          ] }),
          /* @__PURE__ */ A("div", { className: "task-app__header-actions", children: [
            /* @__PURE__ */ h(
              "button",
              {
                className: "task-app__sort-btn task-app__sort-btn--active",
                onClick: () => N(u),
                title: E(a[u] || "desc"),
                children: Y(a[u] || "desc")
              }
            ),
            /* @__PURE__ */ h(
              "button",
              {
                className: "task-app__clear-tag-btn",
                onClick: () => j(u),
                title: `Clear all #${u} tasks`,
                children: "🗑️"
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ h("ul", { className: "task-app__list task-app__list--column", children: U(B, a[u] || "desc").map((D) => /* @__PURE__ */ h(
          ge,
          {
            task: D,
            isDraggable: !0,
            pendingOperations: o,
            onComplete: c,
            onDelete: g,
            onAddTag: _,
            onDragStart: p,
            onDragEnd: b,
            selected: S ? S.has(D.id) : !1
          },
          D.id
        )) })
      ]
    },
    u
  ), K = (u, B) => {
    let D = ye(e, u);
    return r && (D = D.filter(($) => {
      const M = $.tag?.split(" ") || [];
      return n.some((H) => M.includes(H));
    })), D.slice(0, B);
  }, d = t.length, r = Array.isArray(n) && n.length > 0, i = e.filter((u) => {
    if (!r) return !0;
    const B = u.tag?.split(" ") || [];
    return n.some((D) => B.includes(D));
  }), m = ve(d), T = r ? t.filter((u) => ye(e, u).some((D) => {
    const $ = D.tag?.split(" ") || [];
    return n.some((M) => $.includes(M));
  })) : t.slice(0, m.useTags);
  if (T.length === 0)
    return /* @__PURE__ */ h("ul", { className: "task-app__list", children: i.map((u) => /* @__PURE__ */ h(
      ge,
      {
        task: u,
        pendingOperations: o,
        onComplete: c,
        onDelete: g,
        onAddTag: _,
        onDragStart: p,
        onDragEnd: b,
        selected: S ? S.has(u.id) : !1
      },
      u.id
    )) });
  const w = He(e, t, n).filter((u) => {
    if (!r) return !0;
    const B = u.tag?.split(" ") || [];
    return n.some((D) => B.includes(D));
  }), f = ve(T.length);
  return /* @__PURE__ */ A("div", { className: "task-app__dynamic-layout", children: [
    f.rows.length > 0 && /* @__PURE__ */ h(Me, { children: f.rows.map((u, B) => /* @__PURE__ */ h("div", { className: `task-app__tag-grid task-app__tag-grid--${u.columns}col`, children: u.tagIndices.map((D) => {
      const $ = T[D];
      return $ ? V($, K($, f.maxPerColumn)) : null;
    }) }, B)) }),
    w.length > 0 && /* @__PURE__ */ A(
      "div",
      {
        className: `task-app__remaining ${s === "other" ? "task-app__tag-column--drag-over" : ""}`,
        onDragOver: (u) => {
          u.preventDefault(), u.dataTransfer.dropEffect = "move", R(u, "other");
        },
        onDragLeave: (u) => P(u),
        onDrop: (u) => X(u, "other"),
        children: [
          /* @__PURE__ */ A("div", { className: "task-app__tag-header-row", children: [
            /* @__PURE__ */ h("h3", { className: "task-app__remaining-header", children: "Other Tasks" }),
            /* @__PURE__ */ A("div", { className: "task-app__header-actions", children: [
              /* @__PURE__ */ h(
                "button",
                {
                  className: "task-app__sort-btn task-app__sort-btn--active",
                  onClick: () => N("other"),
                  title: E(a.other || "desc"),
                  children: Y(a.other || "desc")
                }
              ),
              /* @__PURE__ */ h(
                "button",
                {
                  className: "task-app__clear-tag-btn",
                  onClick: () => z(w),
                  title: "Clear all remaining tasks",
                  children: "🗑️"
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ h("ul", { className: "task-app__list", children: U(w, a.other || "desc").map((u) => /* @__PURE__ */ h(
            ge,
            {
              task: u,
              pendingOperations: o,
              onComplete: c,
              onDelete: g,
              onAddTag: _,
              onDragStart: p,
              onDragEnd: b,
              selected: S ? S.has(u.id) : !1
            },
            u.id
          )) })
        ]
      }
    )
  ] });
}
function ue({
  isOpen: e,
  title: t,
  onClose: n,
  onConfirm: a,
  children: s,
  inputValue: o,
  onInputChange: c,
  inputPlaceholder: g,
  confirmLabel: _ = "Confirm",
  cancelLabel: p = "Cancel",
  confirmDisabled: b = !1,
  confirmDanger: S = !1
}) {
  return e ? /* @__PURE__ */ h(
    "div",
    {
      className: "modal-overlay",
      onClick: n,
      children: /* @__PURE__ */ A(
        "div",
        {
          className: "modal-card",
          onClick: (F) => F.stopPropagation(),
          children: [
            /* @__PURE__ */ h("h3", { children: t }),
            s,
            c && /* @__PURE__ */ h(
              "input",
              {
                type: "text",
                className: "modal-input",
                value: o || "",
                onChange: (F) => c(F.target.value),
                placeholder: g,
                autoFocus: !0,
                onKeyDown: (F) => {
                  F.key === "Enter" && !b && (F.preventDefault(), a()), F.key === "Escape" && (F.preventDefault(), n());
                }
              }
            ),
            /* @__PURE__ */ A("div", { className: "modal-actions", children: [
              /* @__PURE__ */ h(
                "button",
                {
                  className: "modal-button",
                  onClick: n,
                  children: p
                }
              ),
              /* @__PURE__ */ h(
                "button",
                {
                  className: `modal-button ${S ? "modal-button--danger" : "modal-button--primary"}`,
                  onClick: a,
                  disabled: b,
                  children: _
                }
              )
            ] })
          ]
        }
      )
    }
  ) : null;
}
function be({ isOpen: e, x: t, y: n, items: a }) {
  return e ? /* @__PURE__ */ h(
    "div",
    {
      className: "board-context-menu",
      style: {
        position: "fixed",
        left: `${t}px`,
        top: `${n}px`
      },
      children: a.map((s, o) => /* @__PURE__ */ h(
        "button",
        {
          className: `context-menu-item ${s.isDanger ? "context-menu-item--danger" : ""}`,
          onClick: s.onClick,
          children: s.label
        },
        o
      ))
    }
  ) : null;
}
function me(e) {
  let t = [];
  try {
    const n = e.getData("application/x-hadoku-task-ids");
    n && (t = JSON.parse(n));
  } catch {
  }
  if (t.length === 0) {
    const n = e.getData("text/plain");
    n && (t = [n]);
  }
  return t;
}
function Ve(e = {}) {
  const { basename: t = "/task", apiUrl: n, environment: a, userType: s = "public", userId: o = "public" } = e, [c, g] = O(/* @__PURE__ */ new Set()), [_, p] = O([]), [b, S] = O(null), [C, F] = O(!1), [ee, R] = O(!1), [P, X] = O(""), [N, U] = O("light"), [Y, E] = O(!1), [j, z] = O(null), [J, V] = O(null), K = _e(null), {
    tasks: d,
    pendingOperations: r,
    initialLoad: i,
    addTask: m,
    completeTask: T,
    deleteTask: w,
    addTagToTask: f,
    updateTaskTags: u,
    bulkUpdateTaskTags: B,
    clearTasksByTag: D,
    clearRemainingTasks: $,
    // board API
    boards: M,
    currentBoardId: H,
    createBoard: te,
    deleteBoard: Te,
    switchBoard: re,
    moveTasksToBoard: we,
    createTagOnBoard: De,
    deleteTagOnBoard: Be
  } = Xe({ userType: s, userId: o }), v = qe({
    tasks: d,
    onTaskUpdate: u,
    onBulkUpdate: B
  }), se = Ye();
  oe(() => {
    i(), K.current?.focus();
  }, [s]), oe(() => {
    document.documentElement.setAttribute("data-theme", N);
  }, [N]), oe(() => {
    if (!Y && !j && !J) return;
    const l = (k) => {
      const y = k.target;
      y.closest(".theme-picker") || E(!1), y.closest(".board-context-menu") || z(null), y.closest(".tag-context-menu") || V(null);
    };
    return document.addEventListener("mousedown", l), () => document.removeEventListener("mousedown", l);
  }, [Y, j, J]);
  async function Ce(l) {
    await m(l) && K.current && (K.current.value = "", K.current.focus());
  }
  function Ae(l) {
    const k = d.filter((y) => y.tag?.split(" ").includes(l));
    S({ tag: l, count: k.length });
  }
  async function Ne(l) {
    const k = l.trim().replace(/\s+/g, "-");
    try {
      await De(k);
      const y = window.__pendingTagTaskIds;
      if (y && y.length > 0) {
        const I = y.map((x) => {
          const ce = d.find((Fe) => Fe.id === x)?.tag?.split(" ").filter(Boolean) || [], $e = [.../* @__PURE__ */ new Set([...ce, k])];
          return { taskId: x, tag: $e.join(" ") };
        });
        await B(I), v.clearSelection(), delete window.__pendingTagTaskIds;
      }
    } catch (y) {
      throw console.error("[App] Failed to create tag:", y), y;
    }
  }
  async function xe(l) {
    const k = l.trim();
    try {
      const y = window.__pendingBoardTaskIds;
      await te(k), y && y.length > 0 && (await we(k, y), v.clearSelection(), delete window.__pendingBoardTaskIds);
    } catch (y) {
      throw console.error("[App] Failed to create board:", y), y;
    }
  }
  const Oe = M?.boards?.find((l) => l.id === H)?.tags || [], Ee = Je(d, 6);
  return /* @__PURE__ */ h(
    "div",
    {
      style: { minHeight: "100vh", width: "100%" },
      onMouseDown: v.selectionStartHandler,
      onMouseMove: v.selectionMoveHandler,
      onMouseUp: v.selectionEndHandler,
      onMouseLeave: v.selectionEndHandler,
      onClick: (l) => {
        try {
          const k = l.target;
          if (!k.closest || !k.closest(".task-app__item")) {
            try {
              const y = v.selectionJustEndedAt;
              if (y && Date.now() - y < 300)
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
          /* @__PURE__ */ h("h1", { className: "task-app__header", children: "Tasks" }),
          /* @__PURE__ */ A("div", { className: "theme-picker", children: [
            /* @__PURE__ */ h(
              "button",
              {
                className: "theme-toggle-btn",
                onClick: () => E(!Y),
                "aria-label": "Choose theme",
                title: "Choose theme",
                children: N === "light" ? "☀️" : N === "dark" ? "🌙" : N === "strawberry" ? "🍓" : N === "ocean" ? "🌊" : N === "cyberpunk" ? "🤖" : N === "coffee" ? "☕" : "🪻"
              }
            ),
            Y && /* @__PURE__ */ A("div", { className: "theme-picker__dropdown", children: [
              /* @__PURE__ */ h(
                "button",
                {
                  className: `theme-picker__option ${N === "light" ? "active" : ""}`,
                  onClick: () => {
                    U("light"), E(!1);
                  },
                  title: "Light theme",
                  children: "☀️"
                }
              ),
              /* @__PURE__ */ h(
                "button",
                {
                  className: `theme-picker__option ${N === "dark" ? "active" : ""}`,
                  onClick: () => {
                    U("dark"), E(!1);
                  },
                  title: "Dark theme",
                  children: "🌙"
                }
              ),
              /* @__PURE__ */ h(
                "button",
                {
                  className: `theme-picker__option ${N === "strawberry" ? "active" : ""}`,
                  onClick: () => {
                    U("strawberry"), E(!1);
                  },
                  title: "Strawberry theme",
                  children: "🍓"
                }
              ),
              /* @__PURE__ */ h(
                "button",
                {
                  className: `theme-picker__option ${N === "ocean" ? "active" : ""}`,
                  onClick: () => {
                    U("ocean"), E(!1);
                  },
                  title: "Ocean theme",
                  children: "🌊"
                }
              ),
              /* @__PURE__ */ h(
                "button",
                {
                  className: `theme-picker__option ${N === "cyberpunk" ? "active" : ""}`,
                  onClick: () => {
                    U("cyberpunk"), E(!1);
                  },
                  title: "Cyberpunk theme",
                  children: "🤖"
                }
              ),
              /* @__PURE__ */ h(
                "button",
                {
                  className: `theme-picker__option ${N === "coffee" ? "active" : ""}`,
                  onClick: () => {
                    U("coffee"), E(!1);
                  },
                  title: "Coffee theme",
                  children: "☕"
                }
              ),
              /* @__PURE__ */ h(
                "button",
                {
                  className: `theme-picker__option ${N === "lavender" ? "active" : ""}`,
                  onClick: () => {
                    U("lavender"), E(!1);
                  },
                  title: "Lavender theme",
                  children: "🪻"
                }
              )
            ] })
          ] })
        ] }),
        /* @__PURE__ */ A("div", { className: "task-app__boards", children: [
          /* @__PURE__ */ h("div", { className: "task-app__board-list", children: (M && M.boards ? M.boards.slice(0, 5) : [{ id: "main", name: "main" }]).map((l) => /* @__PURE__ */ h(
            "button",
            {
              className: `board-btn ${H === l.id ? "board-btn--active" : ""} ${v.dragOverFilter === `board:${l.id}` ? "board-btn--drag-over" : ""}`,
              onClick: () => re(l.id),
              onContextMenu: (k) => {
                k.preventDefault(), l.id !== "main" && z({ boardId: l.id, x: k.clientX, y: k.clientY });
              },
              onTouchStart: (k) => {
                if (l.id === "main") return;
                const y = setTimeout(() => {
                  const I = k.touches[0];
                  z({ boardId: l.id, x: I.clientX, y: I.clientY });
                }, 500);
                k.currentTarget.__longPressTimer = y;
              },
              onTouchEnd: (k) => {
                const y = k.currentTarget.__longPressTimer;
                y && (clearTimeout(y), k.currentTarget.__longPressTimer = null);
              },
              onTouchMove: (k) => {
                const y = k.currentTarget.__longPressTimer;
                y && (clearTimeout(y), k.currentTarget.__longPressTimer = null);
              },
              "aria-pressed": H === l.id,
              onDragOver: (k) => {
                k.preventDefault(), k.dataTransfer.dropEffect = "move";
                try {
                  v.setDragOverFilter?.(`board:${l.id}`);
                } catch {
                }
              },
              onDragLeave: (k) => {
                try {
                  v.setDragOverFilter?.(null);
                } catch {
                }
              },
              onDrop: async (k) => {
                k.preventDefault();
                try {
                  v.setDragOverFilter?.(null);
                } catch {
                }
                const y = me(k.dataTransfer);
                if (y.length !== 0)
                  try {
                    await we(l.id, y);
                    try {
                      v.clearSelection();
                    } catch {
                    }
                  } catch (I) {
                    console.error("Failed moving tasks to board", I), alert(I.message || "Failed to move tasks");
                  }
              },
              children: l.name
            },
            l.id
          )) }),
          /* @__PURE__ */ h("div", { className: "task-app__board-actions", children: (!M || M.boards && M.boards.length < 5) && /* @__PURE__ */ h(
            "button",
            {
              className: `board-add-btn ${v.dragOverFilter === "add-board" ? "board-btn--drag-over" : ""}`,
              onClick: () => {
                X(""), F(!0);
              },
              onDragOver: (l) => {
                l.preventDefault(), l.dataTransfer.dropEffect = "move";
                try {
                  v.setDragOverFilter?.("add-board");
                } catch {
                }
              },
              onDragLeave: (l) => {
                try {
                  v.setDragOverFilter?.(null);
                } catch {
                }
              },
              onDrop: async (l) => {
                l.preventDefault();
                try {
                  v.setDragOverFilter?.(null);
                } catch {
                }
                const k = me(l.dataTransfer);
                k.length > 0 && (X(""), window.__pendingBoardTaskIds = k, F(!0));
              },
              "aria-label": "Create board",
              children: "＋"
            }
          ) })
        ] }),
        /* @__PURE__ */ h("div", { className: "task-app__controls", children: /* @__PURE__ */ h(
          "input",
          {
            ref: K,
            className: "task-app__input",
            placeholder: "Type a task and press Enter…",
            onKeyDown: (l) => {
              l.key === "Enter" && !l.shiftKey && (l.preventDefault(), Ce(l.target.value)), l.key === "k" && (l.ctrlKey || l.metaKey) && (l.preventDefault(), K.current?.focus());
            }
          }
        ) }),
        /* @__PURE__ */ A("div", { className: "task-app__filters", children: [
          (() => {
            const l = le(d);
            return Array.from(/* @__PURE__ */ new Set([...Oe, ...l, ..._])).map((y) => {
              const I = c.has(y);
              return /* @__PURE__ */ A(
                "button",
                {
                  onClick: () => {
                    g((x) => {
                      const q = new Set(x);
                      return q.has(y) ? q.delete(y) : q.add(y), q;
                    });
                  },
                  onContextMenu: (x) => {
                    x.preventDefault(), V({ tag: y, x: x.clientX, y: x.clientY });
                  },
                  onTouchStart: (x) => {
                    const q = setTimeout(() => {
                      const ce = x.touches[0];
                      V({ tag: y, x: ce.clientX, y: ce.clientY });
                    }, 500);
                    x.currentTarget.__longPressTimer = q;
                  },
                  onTouchEnd: (x) => {
                    const q = x.currentTarget.__longPressTimer;
                    q && (clearTimeout(q), x.currentTarget.__longPressTimer = null);
                  },
                  onTouchMove: (x) => {
                    const q = x.currentTarget.__longPressTimer;
                    q && (clearTimeout(q), x.currentTarget.__longPressTimer = null);
                  },
                  className: `${I ? "on" : ""} ${v.dragOverFilter === y ? "task-app__filter-drag-over" : ""}`,
                  onDragOver: (x) => v.onFilterDragOver(x, y),
                  onDragLeave: v.onFilterDragLeave,
                  onDrop: (x) => v.onFilterDrop(x, y),
                  children: [
                    "#",
                    y
                  ]
                },
                y
              );
            });
          })(),
          /* @__PURE__ */ h(
            "button",
            {
              className: `task-app__filter-add ${v.dragOverFilter === "add-tag" ? "task-app__filter-drag-over" : ""}`,
              onClick: () => {
                X(""), R(!0);
              },
              onDragOver: (l) => {
                l.preventDefault(), l.dataTransfer.dropEffect = "copy", v.onFilterDragOver(l, "add-tag");
              },
              onDragLeave: v.onFilterDragLeave,
              onDrop: async (l) => {
                l.preventDefault(), v.onFilterDragLeave(l);
                const k = me(l.dataTransfer);
                k.length > 0 && (X(""), window.__pendingTagTaskIds = k, R(!0));
              },
              "aria-label": "Add tag",
              children: "＋"
            }
          )
        ] }),
        /* @__PURE__ */ h(
          ze,
          {
            tasks: d,
            topTags: Ee,
            filters: Array.from(c),
            selectedIds: v.selectedIds,
            onSelectionStart: v.selectionStartHandler,
            onSelectionMove: v.selectionMoveHandler,
            onSelectionEnd: v.selectionEndHandler,
            sortDirections: se.sortDirections,
            dragOverTag: v.dragOverTag,
            pendingOperations: r,
            onComplete: T,
            onDelete: w,
            onAddTag: f,
            onDragStart: v.onDragStart,
            onDragEnd: v.onDragEnd,
            onDragOver: v.onDragOver,
            onDragLeave: v.onDragLeave,
            onDrop: v.onDrop,
            toggleSort: se.toggleSort,
            sortTasksByAge: se.sortTasksByAge,
            getSortIcon: se.getSortIcon,
            getSortTitle: se.getSortTitle,
            clearTasksByTag: Ae,
            clearRemainingTasks: $,
            onDeletePersistedTag: Be
          }
        ),
        v.isSelecting && v.marqueeRect && /* @__PURE__ */ h("div", { className: "marquee-overlay", style: { left: v.marqueeRect.x, top: v.marqueeRect.y, width: v.marqueeRect.w, height: v.marqueeRect.h } }),
        /* @__PURE__ */ h(
          ue,
          {
            isOpen: !!b,
            title: `Clear Tag #${b?.tag}?`,
            onClose: () => S(null),
            onConfirm: async () => {
              if (!b) return;
              const l = b.tag;
              S(null), await D(l);
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
        /* @__PURE__ */ h(
          ue,
          {
            isOpen: C,
            title: "Create New Board",
            onClose: () => {
              F(!1), delete window.__pendingBoardTaskIds;
            },
            onConfirm: async () => {
              if (P.trim()) {
                F(!1);
                try {
                  await xe(P);
                } catch (l) {
                  console.error("[App] Failed to create board:", l);
                }
              }
            },
            inputValue: P,
            onInputChange: X,
            inputPlaceholder: "Board name",
            confirmLabel: "Create",
            confirmDisabled: !P.trim(),
            children: (() => {
              const l = window.__pendingBoardTaskIds;
              return l && l.length > 0 ? /* @__PURE__ */ A("p", { className: "modal-hint", children: [
                l.length,
                " task",
                l.length > 1 ? "s" : "",
                " will be moved to this board"
              ] }) : null;
            })()
          }
        ),
        /* @__PURE__ */ A(
          ue,
          {
            isOpen: ee,
            title: "Create New Tag",
            onClose: () => {
              R(!1), delete window.__pendingTagTaskIds;
            },
            onConfirm: async () => {
              if (P.trim()) {
                R(!1);
                try {
                  await Ne(P);
                } catch (l) {
                  console.error("[App] Failed to create tag:", l);
                }
              }
            },
            inputValue: P,
            onInputChange: X,
            inputPlaceholder: "Enter new tag name",
            confirmLabel: "Create",
            confirmDisabled: !P.trim(),
            children: [
              (() => {
                const l = window.__pendingTagTaskIds;
                return l && l.length > 0 ? /* @__PURE__ */ A("p", { className: "modal-hint", children: [
                  "This tag will be applied to ",
                  l.length,
                  " task",
                  l.length > 1 ? "s" : ""
                ] }) : null;
              })(),
              le(d).length > 0 && /* @__PURE__ */ A("div", { className: "modal-section", children: [
                /* @__PURE__ */ h("label", { className: "modal-label", children: "Existing tags:" }),
                /* @__PURE__ */ h("div", { className: "modal-tags-list", children: le(d).map((l) => /* @__PURE__ */ A("span", { className: "modal-tag-chip", children: [
                  "#",
                  l
                ] }, l)) })
              ] })
            ]
          }
        ),
        /* @__PURE__ */ h(
          be,
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
                  const l = M?.boards?.find((k) => k.id === j.boardId)?.name || j.boardId;
                  if (confirm(`Delete board "${l}"? All tasks on this board will be permanently deleted.`))
                    try {
                      await Te(j.boardId), z(null);
                    } catch (k) {
                      console.error("[App] Failed to delete board:", k), alert(k.message || "Failed to delete board");
                    }
                }
              }
            ]
          }
        ),
        /* @__PURE__ */ h(
          be,
          {
            isOpen: !!J,
            x: J?.x || 0,
            y: J?.y || 0,
            items: [
              {
                label: "🗑️ Delete Tag",
                isDanger: !0,
                onClick: async () => {
                  if (!J) return;
                  const l = d.filter((k) => k.tag?.split(" ").includes(J.tag));
                  if (confirm(`Delete tag "${J.tag}" and remove it from ${l.length} task(s)?`))
                    try {
                      await D(J.tag), V(null);
                    } catch (k) {
                      console.error("[App] Failed to delete tag:", k), alert(k.message || "Failed to delete tag");
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
function Ze(e, t = {}) {
  const n = new URLSearchParams(window.location.search), a = t.userType || n.get("userType") || "public", s = t.userId || n.get("userId") || "public", o = { ...t, userType: a, userId: s }, c = Le(e);
  c.render(/* @__PURE__ */ h(Ve, { ...o })), e.__root = c, console.log("[task-app] Mounted successfully", o);
}
function et(e) {
  e.__root?.unmount();
}
export {
  Ze as mount,
  et as unmount
};
