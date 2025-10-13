import { jsxs as A, jsx as k, Fragment as Le } from "react/jsx-runtime";
import { createRoot as Re } from "react-dom/client";
import { useState as O, useEffect as oe, useRef as me } from "react";
function Pe() {
  const e = Date.now().toString(36).toUpperCase().padStart(8, "0"), t = Array.from(crypto.getRandomValues(new Uint8Array(16))).map((n) => (n % 36).toString(36).toUpperCase()).join("");
  return e + t.slice(0, 18);
}
function G(e, t, n = 50) {
  setTimeout(() => {
    try {
      const a = new BroadcastChannel("tasks");
      a.postMessage({ type: e, ...t }), a.close();
    } catch (a) {
      console.error("[localStorageApi] Broadcast failed:", a);
    }
  }, n);
}
const ke = (e, t, n) => `${e}-${t}-${n}-tasks`, Te = (e, t, n) => `${e}-${t}-${n}-stats`, Se = (e, t) => `${e}-${t}-boards`;
function ae(e = "public", t = "public", n = "main") {
  const a = localStorage.getItem(ke(e, t, n));
  return a ? JSON.parse(a) : {
    version: 1,
    updatedAt: (/* @__PURE__ */ new Date()).toISOString(),
    tasks: []
  };
}
function ne(e, t = "public", n = "public", a = "main") {
  e.updatedAt = (/* @__PURE__ */ new Date()).toISOString(), localStorage.setItem(ke(t, n, a), JSON.stringify(e));
}
function pe(e = "public", t = "public", n = "main") {
  const a = localStorage.getItem(Te(e, t, n));
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
function he(e, t = "public", n = "public", a = "main") {
  e.updatedAt = (/* @__PURE__ */ new Date()).toISOString(), localStorage.setItem(Te(t, n, a), JSON.stringify(e));
}
function ie(e, t, n = "public", a = "public", s = "main") {
  const r = pe(n, a, s);
  r.counters[e]++, r.timeline.push({
    t: (/* @__PURE__ */ new Date()).toISOString(),
    event: e,
    id: t.id
  }), r.tasks[t.id] = {
    id: t.id,
    title: t.title,
    tag: t.tag,
    state: t.state,
    createdAt: t.createdAt,
    updatedAt: t.updatedAt,
    closedAt: t.closedAt
  }, he(r, n, a, s);
}
function Z(e = "public", t = "public") {
  const n = localStorage.getItem(Se(e, t));
  return n ? JSON.parse(n) : { version: 1, updatedAt: (/* @__PURE__ */ new Date()).toISOString(), boards: [] };
}
function ee(e, t = "public", n = "public") {
  e.updatedAt = (/* @__PURE__ */ new Date()).toISOString(), localStorage.setItem(Se(t, n), JSON.stringify(e));
}
function Ue(e = "public", t = "public") {
  return {
    async getBoards() {
      const n = Z(e, t);
      if (!n.boards || n.boards.length === 0) {
        const s = { id: "main", name: "main", tasks: [], stats: void 0, tags: [] };
        n.boards = [s], ee(n, e, t), ne({ version: 1, updatedAt: (/* @__PURE__ */ new Date()).toISOString(), tasks: [] }, e, t, "main"), he({ version: 2, updatedAt: (/* @__PURE__ */ new Date()).toISOString(), counters: { created: 0, completed: 0, edited: 0, deleted: 0 }, timeline: [], tasks: {} }, e, t, "main");
      }
      const a = { version: n.version, updatedAt: n.updatedAt, boards: [] };
      for (const s of n.boards) {
        const r = ae(e, t, s.id), c = pe(e, t, s.id), g = { id: s.id, name: s.name, tasks: r.tasks, stats: c, tags: s.tags || [] };
        a.boards.push(g);
      }
      return a;
    },
    async createBoard(n) {
      const a = Z(e, t);
      if (console.debug("[localStorageApi] createBoard", { userType: e, userId: t, boardId: n, existing: a.boards.map((r) => r.id) }), a.boards.find((r) => r.id === n))
        throw new Error("Board already exists");
      const s = { id: n, name: n, tasks: [], stats: void 0, tags: [] };
      return a.boards.push(s), ee(a, e, t), ne({ version: 1, updatedAt: (/* @__PURE__ */ new Date()).toISOString(), tasks: [] }, e, t, n), he({ version: 2, updatedAt: (/* @__PURE__ */ new Date()).toISOString(), counters: { created: 0, completed: 0, edited: 0, deleted: 0 }, timeline: [], tasks: {} }, e, t, n), G("boards-updated", { sessionId: L, userType: e, userId: t }), s;
    },
    async deleteBoard(n) {
      const a = Z(e, t), s = a.boards.findIndex((r) => r.id === n);
      if (s === -1) throw new Error("Board not found");
      a.boards.splice(s, 1), ee(a, e, t), localStorage.removeItem(ke(e, t, n)), localStorage.removeItem(Te(e, t, n)), G("boards-updated", { sessionId: L, userType: e, userId: t });
    },
    async getTasks(n = "main") {
      return ae(e, t, n);
    },
    async getStats(n = "main") {
      return pe(e, t, n);
    },
    async createTask(n, a = "main", s = !1) {
      const r = ae(e, t, a), c = (/* @__PURE__ */ new Date()).toISOString(), g = {
        id: Pe(),
        title: n.title,
        tag: n.tag || null,
        state: "Active",
        createdAt: c,
        updatedAt: c,
        closedAt: null
      };
      if (r.tasks.push(g), ne(r, e, t, a), n.tag) {
        const _ = Z(e, t), p = _.boards.find((b) => b.id === a);
        if (p) {
          const b = p.tags || [], S = n.tag.split(" ").filter(Boolean).filter((B) => !b.includes(B));
          S.length && (p.tags = [...b, ...S], ee(_, e, t));
        }
      }
      return ie("created", g, e, t, a), s ? console.log("[localStorageApi] createTask: broadcast suppressed") : (console.log("[localStorageApi] createTask: broadcasting update", { sessionId: L, boardId: a, taskId: g.id }), G("tasks-updated", { sessionId: L, userType: e, userId: t, boardId: a })), g;
    },
    async patchTask(n, a, s = "main", r = !1) {
      const c = ae(e, t, s), g = c.tasks.find((_) => _.id === n);
      if (!g)
        throw new Error("Task not found");
      if (a.title !== void 0 && (g.title = a.title), a.tag !== void 0 && (g.tag = a.tag), a.tag !== void 0) {
        const _ = Z(e, t), p = _.boards.find((b) => b.id === s);
        if (p) {
          const b = p.tags || [], S = (a.tag || "").split(" ").filter(Boolean).filter((B) => !b.includes(B));
          S.length && (p.tags = [...b, ...S], ee(_, e, t));
        }
      }
      return g.updatedAt = (/* @__PURE__ */ new Date()).toISOString(), ne(c, e, t, s), ie("edited", g, e, t, s), r || G("tasks-updated", { sessionId: L, userType: e, userId: t, boardId: s }), g;
    },
    async completeTask(n, a = "main") {
      const s = ae(e, t, a), r = s.tasks.find((g) => g.id === n);
      if (!r)
        throw new Error("Task not found");
      const c = (/* @__PURE__ */ new Date()).toISOString();
      return r.state = "Completed", r.updatedAt = c, r.closedAt = c, ne(s, e, t, a), ie("completed", r, e, t, a), G("tasks-updated", { sessionId: L, userType: e, userId: t, boardId: a }), r;
    },
    async deleteTask(n, a = "main", s = !1) {
      console.log("[localStorageApi] deleteTask START", { id: n, boardId: a, suppressBroadcast: s, sessionId: L });
      const r = ae(e, t, a), c = r.tasks.find((_) => _.id === n);
      if (!c)
        throw new Error("Task not found");
      const g = (/* @__PURE__ */ new Date()).toISOString();
      return c.state = "Deleted", c.updatedAt = g, c.closedAt = g, ne(r, e, t, a), ie("deleted", c, e, t, a), s ? console.log("[localStorageApi] deleteTask: broadcast suppressed") : (console.log("[localStorageApi] deleteTask: broadcasting", { sessionId: L }), G("tasks-updated", { sessionId: L, userType: e, userId: t, boardId: a })), console.log("[localStorageApi] deleteTask END"), c;
    },
    async createTag(n, a = "main") {
      const s = Z(e, t), r = s.boards.find((g) => g.id === a);
      if (!r) throw new Error("Board not found");
      const c = r.tags || [];
      c.includes(n) || (r.tags = [...c, n], ee(s, e, t), G("boards-updated", { sessionId: L, userType: e, userId: t, boardId: a }));
    },
    async deleteTag(n, a = "main") {
      const s = Z(e, t), r = s.boards.find((g) => g.id === a);
      if (!r) throw new Error("Board not found");
      const c = r.tags || [];
      r.tags = c.filter((g) => g !== n), ee(s, e, t), G("boards-updated", { sessionId: L, userType: e, userId: t, boardId: a });
    }
  };
}
function Q(e, t) {
  const n = {
    "Content-Type": "application/json",
    "X-User-Type": e
  };
  return t && (n["X-User-Id"] = t), n;
}
function je(e = "public", t = "public") {
  const n = Ue(e, t);
  return e === "public" ? n : {
    // Return all boards and tasks for this user. Local first, then background sync.
    async getBoards() {
      const a = await n.getBoards();
      return fetch(`/task/api/boards?userType=${e}&userId=${encodeURIComponent(t)}`).then((s) => s.json()).then(() => console.log("[api] Background sync: getBoards completed")).catch((s) => console.error("[api] Background sync failed (getBoards):", s)), a;
    },
    async getStats(a = "main") {
      const s = await n.getStats(a);
      return fetch(`/task/api/stats?userType=${e}&userId=${encodeURIComponent(t)}&boardId=${encodeURIComponent(a)}`).then((r) => r.json()).then(() => console.log("[api] Background sync: getStats completed")).catch((r) => console.error("[api] Background sync failed (getStats):", r)), s;
    },
    async createTask(a, s = "main", r = !1) {
      const c = await n.createTask(a, s, r);
      return fetch("/task/api", {
        method: "POST",
        headers: Q(e, t),
        body: JSON.stringify({ ...a, boardId: s })
      }).then(() => console.log("[api] Background sync: createTask completed")).catch((g) => console.error("[api] Failed to sync createTask:", g)), c;
    },
    async createTag(a, s = "main") {
      const r = await n.createTag(a, s);
      return fetch("/task/api/tags", {
        method: "POST",
        headers: Q(e, t),
        body: JSON.stringify({ boardId: s, tag: a })
      }).then(() => console.log("[api] Background sync: createTag completed")).catch((c) => console.error("[api] Failed to sync createTag:", c)), r;
    },
    async deleteTag(a, s = "main") {
      const r = await n.deleteTag(a, s);
      return fetch("/task/api/tags", {
        method: "DELETE",
        headers: Q(e, t),
        body: JSON.stringify({ boardId: s, tag: a })
      }).then(() => console.log("[api] Background sync: deleteTag completed")).catch((c) => console.error("[api] Failed to sync deleteTag:", c)), r;
    },
    async patchTask(a, s, r = "main", c = !1) {
      const g = await n.patchTask(a, s, r, c);
      return fetch(`/task/api/${a}`, {
        method: "PATCH",
        headers: Q(e, t),
        body: JSON.stringify({ ...s, boardId: r })
      }).then(() => console.log("[api] Background sync: patchTask completed")).catch((_) => console.error("[api] Failed to sync patchTask:", _)), g;
    },
    async completeTask(a, s = "main") {
      const r = await n.completeTask(a, s);
      return fetch(`/task/api/${a}/complete`, {
        method: "POST",
        headers: Q(e, t),
        body: JSON.stringify({ boardId: s })
      }).then(() => console.log("[api] Background sync: completeTask completed")).catch((c) => console.error("[api] Failed to sync completeTask:", c)), r;
    },
    async deleteTask(a, s = "main", r = !1) {
      await n.deleteTask(a, s, r), fetch(`/task/api/${a}`, {
        method: "DELETE",
        headers: Q(e, t),
        body: JSON.stringify({ boardId: s })
      }).then(() => console.log("[api] Background sync: deleteTask completed")).catch((c) => console.error("[api] Failed to sync deleteTask:", c));
    },
    // Board operations
    async createBoard(a) {
      const s = await n.createBoard(a);
      return fetch("/task/api/boards", {
        method: "POST",
        headers: Q(e, t),
        body: JSON.stringify({ boardId: a })
      }).then(() => console.log("[api] Background sync: createBoard completed")).catch((r) => console.error("[api] Failed to sync createBoard:", r)), s;
    },
    async deleteBoard(a) {
      const s = await n.deleteBoard(a);
      return fetch(`/task/api/boards/${encodeURIComponent(a)}`, {
        method: "DELETE",
        headers: Q(e, t)
      }).then(() => console.log("[api] Background sync: deleteBoard completed")).catch((r) => console.error("[api] Failed to sync deleteBoard:", r)), s;
    },
    async getTasks(a = "main") {
      const s = await n.getTasks(a);
      return fetch(`/task/api/tasks?userType=${e}&userId=${encodeURIComponent(t)}&boardId=${encodeURIComponent(a)}`).then((r) => r.json()).then(() => console.log("[api] Background sync: getTasks completed")).catch((r) => console.error("[api] Background sync failed (getTasks):", r)), s;
    }
  };
}
function Je(e) {
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
function Xe(e, t = 6, n = []) {
  const a = e.flatMap((r) => r.tag?.split(" ") || []).filter(Boolean), s = {};
  return a.forEach((r) => s[r] = (s[r] || 0) + 1), n.filter(Boolean).forEach((r) => {
    s[r] || (s[r] = 0);
  }), Object.entries(s).sort((r, c) => c[1] - r[1]).slice(0, t).map(([r]) => r);
}
function ve(e, t) {
  return e.filter((n) => n.tag?.split(" ").includes(t));
}
function He(e, t, n) {
  const a = Array.isArray(n) && n.length > 0;
  return e.filter((s) => {
    const r = s.tag?.split(" ") || [];
    return a ? n.some((g) => r.includes(g)) && !t.some((g) => r.includes(g)) : !t.some((c) => r.includes(c));
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
function qe({ userType: e, userId: t }) {
  const [n, a] = O([]), [s, r] = O(/* @__PURE__ */ new Set()), c = je(e, t || "public"), [g, _] = O(null), [p, b] = O("main");
  async function S() {
    console.log("[useTasks] initialLoad called"), await B();
  }
  async function B() {
    console.log("[useTasks] reload called", { currentBoardId: p, stack: new Error().stack?.split(`
`).slice(1, 4).join(`
`) });
    const d = await c.getBoards();
    _(d);
    const o = d.boards.find((i) => i.id === p);
    o ? (console.log("[useTasks] reload: found current board", { boardId: o.id, taskCount: o.tasks?.length || 0 }), a((o.tasks || []).filter((i) => i.state === "Active"))) : (console.log("[useTasks] reload: board not found", { currentBoardId: p }), a([]));
  }
  oe(() => {
    console.log("[useTasks] Setting up BroadcastChannel listener", { currentBoardId: p });
    try {
      const d = new BroadcastChannel("tasks");
      return d.onmessage = (o) => {
        const i = o.data || {};
        if (console.log("[useTasks] BroadcastChannel message received", { msg: i, sessionId: L, currentBoardId: p }), i.sessionId === L) {
          console.log("[useTasks] Ignoring own broadcast message");
          return;
        }
        (i.type === "tasks-updated" || i.type === "boards-updated") && (console.log("[useTasks] BroadcastChannel: triggering reload for currentBoardId =", p), B());
      }, () => {
        console.log("[useTasks] Cleaning up BroadcastChannel listener", { currentBoardId: p }), d.close();
      };
    } catch (d) {
      console.error("[useTasks] Failed to setup BroadcastChannel", d);
    }
  }, [p]);
  async function M(d) {
    if (d = d.trim(), !!d)
      try {
        const o = Je(d);
        return await c.createTask(o, p), await B(), !0;
      } catch (o) {
        return alert(o.message || "Failed to create task"), !1;
      }
  }
  async function te(d) {
    const o = `complete-${d}`;
    if (!s.has(o)) {
      r((i) => /* @__PURE__ */ new Set([...i, o]));
      try {
        await c.completeTask(d, p), await B();
      } catch (i) {
        i?.message?.includes("404") || alert(i.message || "Failed to complete task");
      } finally {
        r((i) => {
          const f = new Set(i);
          return f.delete(o), f;
        });
      }
    }
  }
  async function R(d) {
    console.log("[useTasks] deleteTask START", { taskId: d, currentBoardId: p });
    const o = `delete-${d}`;
    if (s.has(o)) {
      console.log("[useTasks] deleteTask: already pending, skipping", { operationKey: o });
      return;
    }
    r((i) => /* @__PURE__ */ new Set([...i, o]));
    try {
      console.log("[useTasks] deleteTask: calling api.deleteTask", { taskId: d, currentBoardId: p }), await c.deleteTask(d, p), console.log("[useTasks] deleteTask: calling reload"), await B(), console.log("[useTasks] deleteTask END");
    } catch (i) {
      i?.message?.includes("404") || alert(i.message || "Failed to delete task");
    } finally {
      r((i) => {
        const f = new Set(i);
        return f.delete(o), f;
      });
    }
  }
  async function P(d) {
    const o = prompt("Enter tag (without #):");
    if (!o) return;
    const i = o.trim().replace(/^#+/, "").replace(/\s+/g, "-"), f = n.find((m) => m.id === d);
    if (!f) return;
    const T = f.tag?.split(" ") || [];
    if (T.includes(i)) return;
    const w = [...T, i].join(" ");
    try {
      await c.patchTask(d, { tag: w }, p), await B();
    } catch (m) {
      alert(m.message || "Failed to add tag");
    }
  }
  async function X(d, o, i = {}) {
    const { suppressBroadcast: f = !1, skipReload: T = !1 } = i;
    try {
      await c.patchTask(d, o, p, f), T || await B();
    } catch (w) {
      throw w;
    }
  }
  async function N(d) {
    console.log("[useTasks] bulkUpdateTaskTags START", { count: d.length });
    try {
      for (const { taskId: o, tag: i } of d)
        await c.patchTask(o, { tag: i }, p, !0);
      console.log("[useTasks] bulkUpdateTaskTags: broadcasting bulk update with delay"), de(L, e, t), console.log("[useTasks] bulkUpdateTaskTags: calling reload"), await B(), console.log("[useTasks] bulkUpdateTaskTags END");
    } catch (o) {
      throw console.error("[useTasks] bulkUpdateTaskTags ERROR", o), o;
    }
  }
  async function U(d) {
    console.log("[useTasks] clearTasksByTag START", { tag: d, currentBoardId: p, taskCount: n.length });
    const o = n.filter((i) => i.tag?.split(" ").includes(d));
    if (console.log("[useTasks] clearTasksByTag: found tasks with tag", { tag: d, count: o.length }), o.length === 0) {
      console.log("[useTasks] clearTasksByTag: no tasks found with this tag, just deleting tag");
      try {
        await c.deleteTag(d, p), await B(), console.log("[useTasks] clearTasksByTag END (no tasks to clear)");
      } catch (i) {
        console.error("[useTasks] clearTasksByTag ERROR", i), console.error("[useTasks] clearTasksByTag: Please fix this error:", i.message);
      }
      return;
    }
    console.log("[useTasks] clearTasksByTag: proceeding without confirmation (dialogs blocked)", { taskCount: o.length });
    try {
      console.log("[useTasks] clearTasksByTag: starting to patch tasks");
      for (const i of o) {
        const f = i.tag?.split(" ") || [], T = f.filter((m) => m !== d), w = T.length > 0 ? T.join(" ") : null;
        console.log("[useTasks] clearTasksByTag: patching task", { taskId: i.id, oldTags: f, newTags: T }), await c.patchTask(i.id, { tag: w }, p, !0);
      }
      console.log("[useTasks] clearTasksByTag: deleting tag from board", { tag: d, currentBoardId: p }), await c.deleteTag(d, p), console.log("[useTasks] clearTasksByTag: broadcasting bulk update with delay"), de(L, e, t), console.log("[useTasks] clearTasksByTag: calling reload"), await B(), console.log("[useTasks] clearTasksByTag END");
    } catch (i) {
      console.error("[useTasks] clearTasksByTag ERROR", i), alert(i.message || "Failed to remove tag from tasks");
    }
  }
  async function q(d) {
    if (confirm("Clear all remaining tasks?"))
      try {
        for (const o of d)
          await c.deleteTask(o.id, p);
        await B();
      } catch (o) {
        alert(o.message || "Failed to clear remaining tasks");
      }
  }
  async function E(d) {
    await c.createBoard(d), b(d);
    const o = await c.getBoards();
    _(o);
    const i = o.boards.find((f) => f.id === d);
    i ? (console.log("[useTasks] createBoard: switched to new board", { boardId: d, taskCount: i.tasks?.length || 0 }), a((i.tasks || []).filter((f) => f.state === "Active"))) : (console.log("[useTasks] createBoard: new board not found (should be empty)", { boardId: d }), a([]));
  }
  async function j(d, o) {
    if (console.log("[useTasks] moveTasksToBoard START", { targetBoardId: d, ids: o, currentBoardId: p }), !g) return;
    const i = [];
    for (const w of g.boards)
      for (const m of w.tasks || [])
        o.includes(m.id) && i.push({ id: m.id, title: m.title, tag: m.tag || void 0, boardId: w.id });
    console.log("[useTasks] moveTasksToBoard: found tasks to move", { count: i.length });
    for (const w of i)
      await c.createTask({ title: w.title, tag: w.tag }, d, !0), await c.deleteTask(w.id, w.boardId, !0);
    console.log("[useTasks] moveTasksToBoard: broadcasting bulk update with delay"), de(L, e, t), console.log("[useTasks] moveTasksToBoard: switching to target board", { targetBoardId: d }), b(d);
    const f = await c.getBoards();
    _(f);
    const T = f.boards.find((w) => w.id === d);
    T && (console.log("[useTasks] moveTasksToBoard: loaded target board tasks", { count: T.tasks?.length || 0 }), a((T.tasks || []).filter((w) => w.state === "Active"))), console.log("[useTasks] moveTasksToBoard END");
  }
  async function V(d) {
    if (await c.deleteBoard(d), p === d) {
      b("main");
      const o = await c.getBoards();
      _(o);
      const i = o.boards.find((f) => f.id === "main");
      i ? (console.log("[useTasks] deleteBoard: switched to main board", { taskCount: i.tasks?.length || 0 }), a((i.tasks || []).filter((f) => f.state === "Active"))) : (console.log("[useTasks] deleteBoard: main board not found"), a([]));
    } else
      await B();
  }
  async function J(d) {
    await c.createTag(d, p), await B();
  }
  async function K(d) {
    await c.deleteTag(d, p), await B();
  }
  function Y(d) {
    b(d);
    const o = g?.boards.find((i) => i.id === d);
    o ? a((o.tasks || []).filter((i) => i.state === "Active")) : B();
  }
  return {
    // Task state
    tasks: n,
    pendingOperations: s,
    // Task operations
    addTask: M,
    completeTask: te,
    deleteTask: R,
    addTagToTask: P,
    updateTaskTags: X,
    bulkUpdateTaskTags: N,
    clearTasksByTag: U,
    clearRemainingTasks: q,
    // Board state
    boards: g,
    currentBoardId: p,
    // Board operations
    createBoard: E,
    deleteBoard: V,
    switchBoard: Y,
    moveTasksToBoard: j,
    createTagOnBoard: J,
    deleteTagOnBoard: K,
    // Lifecycle
    initialLoad: S,
    reload: B
  };
}
function Ye({ tasks: e, onTaskUpdate: t, onBulkUpdate: n }) {
  const [a, s] = O(null), [r, c] = O(null), [g, _] = O(/* @__PURE__ */ new Set()), [p, b] = O(!1), [S, B] = O(null), [M, te] = O(null), R = me(null);
  function P(o, i) {
    const f = g.has(i) && g.size > 0 ? Array.from(g) : [i];
    console.log("[useDragAndDrop] onDragStart", { taskId: i, idsToDrag: f, selectedCount: g.size }), o.dataTransfer.setData("text/plain", f[0]);
    try {
      o.dataTransfer.setData("application/x-hadoku-task-ids", JSON.stringify(f));
    } catch {
    }
    o.dataTransfer.effectAllowed = "copyMove";
    try {
      const T = o.currentTarget, w = T.closest && T.closest(".task-app__item") ? T.closest(".task-app__item") : T;
      w.classList.add("dragging");
      const m = w.cloneNode(!0);
      m.style.boxSizing = "border-box", m.style.width = `${w.offsetWidth}px`, m.style.height = `${w.offsetHeight}px`, m.style.opacity = "0.95", m.style.transform = "none", m.style.filter = "drop-shadow(0 6px 18px rgba(0,0,0,0.12))", m.classList.add("drag-image"), m.style.position = "absolute", m.style.top = "-9999px", m.style.left = "-9999px", document.body.appendChild(m), w.__dragImage = m, _((u) => {
        if (u.has(i)) return new Set(u);
        const C = new Set(u);
        return C.add(i), C;
      });
      try {
        const u = w.closest(".task-app__tag-column");
        if (u) {
          const C = u.querySelector(".task-app__tag-header") || u.querySelector("h3"), $ = (C && C.textContent || "").trim().replace(/^#/, "");
          if ($)
            try {
              o.dataTransfer.setData("application/x-hadoku-task-source", $);
            } catch {
            }
        }
      } catch {
      }
      try {
        const u = w.getBoundingClientRect();
        let C = Math.round(o.clientX - u.left), D = Math.round(o.clientY - u.top);
        C = Math.max(0, Math.min(Math.round(m.offsetWidth - 1), C)), D = Math.max(0, Math.min(Math.round(m.offsetHeight - 1), D)), o.dataTransfer.setDragImage(m, C, D);
      } catch {
        o.dataTransfer.setDragImage(m, 0, 0);
      }
    } catch {
    }
  }
  function X(o) {
    try {
      const i = o.currentTarget;
      i.classList.remove("dragging");
      const f = i.__dragImage;
      f && f.parentNode && f.parentNode.removeChild(f), f && delete i.__dragImage;
    } catch {
    }
    try {
      E();
    } catch {
    }
  }
  function N(o) {
    if (o.button === 0) {
      try {
        const i = o.target;
        if (!i || i.closest && i.closest(".task-app__item, .task-app__controls, button, input, textarea, .task-app__item-actions"))
          return;
      } catch {
      }
      b(!0), R.current = { x: o.clientX, y: o.clientY }, B({ x: o.clientX, y: o.clientY, w: 0, h: 0 }), _(/* @__PURE__ */ new Set());
      try {
        document.body.classList.add("marquee-selecting");
      } catch {
      }
    }
  }
  function U(o) {
    if (!p || !R.current) return;
    const i = R.current.x, f = R.current.y, T = o.clientX, w = o.clientY, m = Math.min(i, T), u = Math.min(f, w), C = Math.abs(T - i), D = Math.abs(w - f);
    B({ x: m, y: u, w: C, h: D });
    const $ = Array.from(document.querySelectorAll(".task-app__item")), z = /* @__PURE__ */ new Set();
    for (const F of $) {
      const W = F.getBoundingClientRect();
      if (!(W.right < m || W.left > m + C || W.bottom < u || W.top > u + D)) {
        const re = F.getAttribute("data-task-id");
        re && z.add(re), F.classList.add("selected");
      } else
        F.classList.remove("selected");
    }
    _(z);
  }
  function q(o) {
    b(!1), B(null), R.current = null;
    try {
      document.body.classList.remove("marquee-selecting");
    } catch {
    }
    try {
      te(Date.now());
    } catch {
    }
  }
  function E() {
    _(/* @__PURE__ */ new Set()), Array.from(document.querySelectorAll(".task-app__item.selected")).forEach((i) => i.classList.remove("selected"));
  }
  oe(() => {
    function o(T) {
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
    function f(T) {
      const w = { clientX: T.clientX, clientY: T.clientY };
      try {
        q(w);
      } catch {
      }
    }
    return document.addEventListener("mousedown", o), document.addEventListener("mousemove", i), document.addEventListener("mouseup", f), () => {
      document.removeEventListener("mousedown", o), document.removeEventListener("mousemove", i), document.removeEventListener("mouseup", f);
    };
  }, []);
  function j(o, i) {
    o.preventDefault(), o.dataTransfer.dropEffect = "copy", s(i);
  }
  function V(o) {
    o.currentTarget.contains(o.relatedTarget) || s(null);
  }
  async function J(o, i) {
    o.preventDefault(), s(null), console.log("[useDragAndDrop] onDrop START", { targetTag: i });
    let f = [];
    try {
      const m = o.dataTransfer.getData("application/x-hadoku-task-ids");
      m && (f = JSON.parse(m));
    } catch {
    }
    if (f.length === 0) {
      const m = o.dataTransfer.getData("text/plain");
      m && (f = [m]);
    }
    if (f.length === 0) return;
    let T = null;
    try {
      const m = o.dataTransfer.getData("application/x-hadoku-task-source");
      m && (T = m);
    } catch {
    }
    console.log("[useDragAndDrop] onDrop: processing", { targetTag: i, ids: f, srcTag: T, taskCount: f.length });
    const w = [];
    for (const m of f) {
      const u = e.find((F) => F.id === m);
      if (!u) continue;
      const C = u.tag?.split(" ").filter(Boolean) || [];
      if (i === "other") {
        if (C.length === 0) continue;
        w.push({ taskId: m, tag: "" });
        continue;
      }
      const D = C.includes(i);
      let $ = C.slice();
      D || $.push(i), T && T !== i && ($ = $.filter((F) => F !== T));
      const z = $.join(" ").trim();
      w.push({ taskId: m, tag: z });
    }
    console.log("[useDragAndDrop] onDrop: updating tasks", { updateCount: w.length });
    try {
      await n(w), console.log("[useDragAndDrop] onDrop: updates complete, clearing selection");
      try {
        E();
      } catch {
      }
    } catch (m) {
      console.error("Failed to add tag to one or more tasks:", m), alert(m.message || "Failed to add tags");
    }
    console.log("[useDragAndDrop] onDrop END");
  }
  function K(o, i) {
    o.preventDefault(), o.dataTransfer.dropEffect = "copy", c(i);
  }
  function Y(o) {
    o.currentTarget.contains(o.relatedTarget) || c(null);
  }
  async function d(o, i) {
    o.preventDefault(), c(null);
    const f = o.dataTransfer.getData("text/plain"), T = e.find((u) => u.id === f);
    if (!T) return;
    const w = T.tag?.split(" ") || [];
    if (w.includes(i)) {
      console.log(`Task already has tag: ${i}`);
      return;
    }
    const m = [...w, i].join(" ");
    console.log(`Adding tag "${i}" to task "${T.title}" via filter drop. New tags: "${m}"`);
    try {
      await t(f, { tag: m });
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
    dragOverFilter: r,
    setDragOverFilter: c,
    selectedIds: g,
    isSelecting: p,
    marqueeRect: S,
    selectionJustEndedAt: M,
    // selection handlers
    selectionStartHandler: N,
    selectionMoveHandler: U,
    selectionEndHandler: q,
    clearSelection: E,
    onDragStart: P,
    onDragEnd: X,
    onDragOver: j,
    onDragLeave: V,
    onDrop: J,
    onFilterDragOver: K,
    onFilterDragLeave: Y,
    onFilterDrop: d
  };
}
function Ke() {
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
  function r(c) {
    return c === "asc" ? "Sorted by age (oldest first) - click to sort newest first" : "Sorted by age (newest first) - click to sort oldest first";
  }
  return {
    sortDirections: e,
    toggleSort: n,
    sortTasksByAge: a,
    getSortIcon: s,
    getSortTitle: r
  };
}
function ze(e) {
  const t = /* @__PURE__ */ new Date(), n = new Date(e), a = t.getTime() - n.getTime(), s = Math.floor(a / 1e3), r = Math.floor(s / 60), c = Math.floor(r / 60), g = Math.floor(c / 24);
  return s < 60 ? `${s}s ago` : r < 60 ? `${r}m ago` : c < 24 ? `${c}h ago` : `${g}d ago`;
}
function ge({
  task: e,
  isDraggable: t = !0,
  pendingOperations: n,
  onComplete: a,
  onDelete: s,
  onAddTag: r,
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
          /* @__PURE__ */ k("div", { className: "task-app__item-title", title: e.title, children: e.title }),
          /* @__PURE__ */ A("div", { className: "task-app__item-meta-row", children: [
            e.tag ? /* @__PURE__ */ k("div", { className: "task-app__item-tag", children: e.tag.split(" ").map((S) => `#${S}`).join(" ") }) : /* @__PURE__ */ k("div", {}),
            /* @__PURE__ */ k("div", { className: "task-app__item-age", children: ze(e.createdAt) })
          ] })
        ] }),
        /* @__PURE__ */ A("div", { className: "task-app__item-actions", children: [
          /* @__PURE__ */ k(
            "button",
            {
              className: "task-app__action-btn task-app__complete-btn",
              onClick: () => a(e.id),
              title: "Complete task",
              disabled: p || b,
              children: p ? "⏳" : "✓"
            }
          ),
          /* @__PURE__ */ k(
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
function be(e) {
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
function Ve({
  tasks: e,
  topTags: t,
  filters: n,
  sortDirections: a,
  dragOverTag: s,
  pendingOperations: r,
  onComplete: c,
  onDelete: g,
  onAddTag: _,
  onDragStart: p,
  onDragEnd: b,
  selectedIds: S,
  onSelectionStart: B,
  onSelectionMove: M,
  onSelectionEnd: te,
  onDragOver: R,
  onDragLeave: P,
  onDrop: X,
  toggleSort: N,
  sortTasksByAge: U,
  getSortIcon: q,
  getSortTitle: E,
  clearTasksByTag: j,
  clearRemainingTasks: V,
  onDeletePersistedTag: J
}) {
  const K = (u, C) => /* @__PURE__ */ A(
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
          /* @__PURE__ */ k(
            "button",
            {
              className: "task-app__sort-btn task-app__sort-btn--active",
              onClick: () => N(u),
              title: E(a[u] || "desc"),
              children: q(a[u] || "desc")
            }
          )
        ] }),
        /* @__PURE__ */ k("ul", { className: "task-app__list task-app__list--column", children: U(C, a[u] || "desc").map((D) => /* @__PURE__ */ k(
          ge,
          {
            task: D,
            isDraggable: !0,
            pendingOperations: r,
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
  ), Y = (u, C) => {
    let D = ve(e, u);
    return o && (D = D.filter(($) => {
      const z = $.tag?.split(" ") || [];
      return n.some((F) => z.includes(F));
    })), D.slice(0, C);
  }, d = t.length, o = Array.isArray(n) && n.length > 0, i = e.filter((u) => {
    if (!o) return !0;
    const C = u.tag?.split(" ") || [];
    return n.some((D) => C.includes(D));
  }), f = be(d), T = o ? t.filter((u) => ve(e, u).some((D) => {
    const $ = D.tag?.split(" ") || [];
    return n.some((z) => $.includes(z));
  })) : t.slice(0, f.useTags);
  if (T.length === 0)
    return /* @__PURE__ */ k("ul", { className: "task-app__list", children: i.map((u) => /* @__PURE__ */ k(
      ge,
      {
        task: u,
        pendingOperations: r,
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
    if (!o) return !0;
    const C = u.tag?.split(" ") || [];
    return n.some((D) => C.includes(D));
  }), m = be(T.length);
  return /* @__PURE__ */ A("div", { className: "task-app__dynamic-layout", children: [
    m.rows.length > 0 && /* @__PURE__ */ k(Le, { children: m.rows.map((u, C) => /* @__PURE__ */ k("div", { className: `task-app__tag-grid task-app__tag-grid--${u.columns}col`, children: u.tagIndices.map((D) => {
      const $ = T[D];
      return $ ? K($, Y($, m.maxPerColumn)) : null;
    }) }, C)) }),
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
            /* @__PURE__ */ k("h3", { className: "task-app__remaining-header", children: "Other Tasks" }),
            /* @__PURE__ */ k(
              "button",
              {
                className: "task-app__sort-btn task-app__sort-btn--active",
                onClick: () => N("other"),
                title: E(a.other || "desc"),
                children: q(a.other || "desc")
              }
            )
          ] }),
          /* @__PURE__ */ k("ul", { className: "task-app__list", children: U(w, a.other || "desc").map((u) => /* @__PURE__ */ k(
            ge,
            {
              task: u,
              pendingOperations: r,
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
  inputValue: r,
  onInputChange: c,
  inputPlaceholder: g,
  confirmLabel: _ = "Confirm",
  cancelLabel: p = "Cancel",
  confirmDisabled: b = !1,
  confirmDanger: S = !1
}) {
  return e ? /* @__PURE__ */ k(
    "div",
    {
      className: "modal-overlay",
      onClick: n,
      children: /* @__PURE__ */ A(
        "div",
        {
          className: "modal-card",
          onClick: (M) => M.stopPropagation(),
          children: [
            /* @__PURE__ */ k("h3", { children: t }),
            s,
            c && /* @__PURE__ */ k(
              "input",
              {
                type: "text",
                className: "modal-input",
                value: r || "",
                onChange: (M) => c(M.target.value),
                placeholder: g,
                autoFocus: !0,
                onKeyDown: (M) => {
                  M.key === "Enter" && !b && (M.preventDefault(), a()), M.key === "Escape" && (M.preventDefault(), n());
                }
              }
            ),
            /* @__PURE__ */ A("div", { className: "modal-actions", children: [
              /* @__PURE__ */ k(
                "button",
                {
                  className: "modal-button",
                  onClick: n,
                  children: p
                }
              ),
              /* @__PURE__ */ k(
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
function _e({ isOpen: e, x: t, y: n, items: a }) {
  return e ? /* @__PURE__ */ k(
    "div",
    {
      className: "board-context-menu",
      style: {
        left: `${t}px`,
        top: `${n}px`
      },
      children: a.map((s, r) => /* @__PURE__ */ k(
        "button",
        {
          className: `context-menu-item ${s.isDanger ? "context-menu-item--danger" : ""}`,
          onClick: s.onClick,
          children: s.label
        },
        r
      ))
    }
  ) : null;
}
function fe(e) {
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
function Ie(e = {}) {
  const { basename: t = "/task", apiUrl: n, environment: a, userType: s = "public", userId: r = "public" } = e, [c, g] = O(/* @__PURE__ */ new Set()), [_, p] = O([]), [b, S] = O(null), [B, M] = O(!1), [te, R] = O(!1), [P, X] = O(""), [N, U] = O("light"), [q, E] = O(!1), [j, V] = O(null), [J, K] = O(null), Y = me(null), d = me(null), {
    tasks: o,
    pendingOperations: i,
    initialLoad: f,
    addTask: T,
    completeTask: w,
    deleteTask: m,
    addTagToTask: u,
    updateTaskTags: C,
    bulkUpdateTaskTags: D,
    clearTasksByTag: $,
    clearRemainingTasks: z,
    // board API
    boards: F,
    currentBoardId: W,
    createBoard: we,
    deleteBoard: re,
    switchBoard: De,
    moveTasksToBoard: ye,
    createTagOnBoard: Be,
    deleteTagOnBoard: Ce
  } = qe({ userType: s, userId: r }), v = Ye({
    tasks: o,
    onTaskUpdate: C,
    onBulkUpdate: D
  }), se = Ke();
  oe(() => {
    f(), Y.current?.focus();
  }, [s]), oe(() => {
    d.current && d.current.setAttribute("data-theme", N);
  }, [N]), oe(() => {
    if (!q && !j && !J) return;
    const l = (h) => {
      const y = h.target;
      y.closest(".theme-picker") || E(!1), y.closest(".board-context-menu") || V(null), y.closest(".tag-context-menu") || K(null);
    };
    return document.addEventListener("mousedown", l), () => document.removeEventListener("mousedown", l);
  }, [q, j, J]);
  async function Ae(l) {
    await T(l) && Y.current && (Y.current.value = "", Y.current.focus());
  }
  function Ne(l) {
    const h = o.filter((y) => y.tag?.split(" ").includes(l));
    S({ tag: l, count: h.length });
  }
  async function xe(l) {
    const h = l.trim().replace(/\s+/g, "-");
    try {
      await Be(h);
      const y = window.__pendingTagTaskIds;
      if (y && y.length > 0) {
        const I = y.map((x) => {
          const ce = o.find((Me) => Me.id === x)?.tag?.split(" ").filter(Boolean) || [], Fe = [.../* @__PURE__ */ new Set([...ce, h])];
          return { taskId: x, tag: Fe.join(" ") };
        });
        await D(I), v.clearSelection(), delete window.__pendingTagTaskIds;
      }
    } catch (y) {
      throw console.error("[App] Failed to create tag:", y), y;
    }
  }
  async function Oe(l) {
    const h = l.trim();
    try {
      const y = window.__pendingBoardTaskIds;
      await we(h), y && y.length > 0 && (await ye(h, y), v.clearSelection(), delete window.__pendingBoardTaskIds);
    } catch (y) {
      throw console.error("[App] Failed to create board:", y), y;
    }
  }
  const $e = F?.boards?.find((l) => l.id === W)?.tags || [], Ee = Xe(o, 6);
  return /* @__PURE__ */ k(
    "div",
    {
      ref: d,
      className: "task-app-container",
      onMouseDown: v.selectionStartHandler,
      onMouseMove: v.selectionMoveHandler,
      onMouseUp: v.selectionEndHandler,
      onMouseLeave: v.selectionEndHandler,
      onClick: (l) => {
        try {
          const h = l.target;
          if (!h.closest || !h.closest(".task-app__item")) {
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
          /* @__PURE__ */ k("h1", { className: "task-app__header", children: "Tasks" }),
          /* @__PURE__ */ A("div", { className: "theme-picker", children: [
            /* @__PURE__ */ k(
              "button",
              {
                className: "theme-toggle-btn",
                onClick: () => E(!q),
                "aria-label": "Choose theme",
                title: "Choose theme",
                children: N === "light" ? "☀️" : N === "dark" ? "🌙" : N === "strawberry" ? "🍓" : N === "ocean" ? "🌊" : N === "cyberpunk" ? "🤖" : N === "coffee" ? "☕" : "🪻"
              }
            ),
            q && /* @__PURE__ */ A("div", { className: "theme-picker__dropdown", children: [
              /* @__PURE__ */ k(
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
              /* @__PURE__ */ k(
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
              /* @__PURE__ */ k(
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
              /* @__PURE__ */ k(
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
              /* @__PURE__ */ k(
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
              /* @__PURE__ */ k(
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
              /* @__PURE__ */ k(
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
          /* @__PURE__ */ k("div", { className: "task-app__board-list", children: (F && F.boards ? F.boards.slice(0, 5) : [{ id: "main", name: "main" }]).map((l) => /* @__PURE__ */ k(
            "button",
            {
              className: `board-btn ${W === l.id ? "board-btn--active" : ""} ${v.dragOverFilter === `board:${l.id}` ? "board-btn--drag-over" : ""}`,
              onClick: () => De(l.id),
              onContextMenu: (h) => {
                h.preventDefault(), l.id !== "main" && V({ boardId: l.id, x: h.clientX, y: h.clientY });
              },
              onTouchStart: (h) => {
                if (l.id === "main") return;
                const y = setTimeout(() => {
                  const I = h.touches[0];
                  V({ boardId: l.id, x: I.clientX, y: I.clientY });
                }, 500);
                h.currentTarget.__longPressTimer = y;
              },
              onTouchEnd: (h) => {
                const y = h.currentTarget.__longPressTimer;
                y && (clearTimeout(y), h.currentTarget.__longPressTimer = null);
              },
              onTouchMove: (h) => {
                const y = h.currentTarget.__longPressTimer;
                y && (clearTimeout(y), h.currentTarget.__longPressTimer = null);
              },
              "aria-pressed": W === l.id ? "true" : "false",
              onDragOver: (h) => {
                h.preventDefault(), h.dataTransfer.dropEffect = "move";
                try {
                  v.setDragOverFilter?.(`board:${l.id}`);
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
                const y = fe(h.dataTransfer);
                if (y.length !== 0)
                  try {
                    await ye(l.id, y);
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
          /* @__PURE__ */ k("div", { className: "task-app__board-actions", children: (!F || F.boards && F.boards.length < 5) && /* @__PURE__ */ k(
            "button",
            {
              className: `board-add-btn ${v.dragOverFilter === "add-board" ? "board-btn--drag-over" : ""}`,
              onClick: () => {
                X(""), M(!0);
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
                const h = fe(l.dataTransfer);
                h.length > 0 && (X(""), window.__pendingBoardTaskIds = h, M(!0));
              },
              "aria-label": "Create board",
              children: "＋"
            }
          ) })
        ] }),
        /* @__PURE__ */ k("div", { className: "task-app__controls", children: /* @__PURE__ */ k(
          "input",
          {
            ref: Y,
            className: "task-app__input",
            placeholder: "Type a task and press Enter…",
            onKeyDown: (l) => {
              l.key === "Enter" && !l.shiftKey && (l.preventDefault(), Ae(l.target.value)), l.key === "k" && (l.ctrlKey || l.metaKey) && (l.preventDefault(), Y.current?.focus());
            }
          }
        ) }),
        /* @__PURE__ */ A("div", { className: "task-app__filters", children: [
          (() => {
            const l = le(o);
            return Array.from(/* @__PURE__ */ new Set([...$e, ...l, ..._])).map((y) => {
              const I = c.has(y);
              return /* @__PURE__ */ A(
                "button",
                {
                  onClick: () => {
                    g((x) => {
                      const H = new Set(x);
                      return H.has(y) ? H.delete(y) : H.add(y), H;
                    });
                  },
                  onContextMenu: (x) => {
                    x.preventDefault(), K({ tag: y, x: x.clientX, y: x.clientY });
                  },
                  onTouchStart: (x) => {
                    const H = setTimeout(() => {
                      const ce = x.touches[0];
                      K({ tag: y, x: ce.clientX, y: ce.clientY });
                    }, 500);
                    x.currentTarget.__longPressTimer = H;
                  },
                  onTouchEnd: (x) => {
                    const H = x.currentTarget.__longPressTimer;
                    H && (clearTimeout(H), x.currentTarget.__longPressTimer = null);
                  },
                  onTouchMove: (x) => {
                    const H = x.currentTarget.__longPressTimer;
                    H && (clearTimeout(H), x.currentTarget.__longPressTimer = null);
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
          /* @__PURE__ */ k(
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
                const h = fe(l.dataTransfer);
                h.length > 0 && (X(""), window.__pendingTagTaskIds = h, R(!0));
              },
              "aria-label": "Add tag",
              children: "＋"
            }
          )
        ] }),
        /* @__PURE__ */ k(
          Ve,
          {
            tasks: o,
            topTags: Ee,
            filters: Array.from(c),
            selectedIds: v.selectedIds,
            onSelectionStart: v.selectionStartHandler,
            onSelectionMove: v.selectionMoveHandler,
            onSelectionEnd: v.selectionEndHandler,
            sortDirections: se.sortDirections,
            dragOverTag: v.dragOverTag,
            pendingOperations: i,
            onComplete: w,
            onDelete: m,
            onAddTag: u,
            onDragStart: v.onDragStart,
            onDragEnd: v.onDragEnd,
            onDragOver: v.onDragOver,
            onDragLeave: v.onDragLeave,
            onDrop: v.onDrop,
            toggleSort: se.toggleSort,
            sortTasksByAge: se.sortTasksByAge,
            getSortIcon: se.getSortIcon,
            getSortTitle: se.getSortTitle,
            clearTasksByTag: Ne,
            clearRemainingTasks: z,
            onDeletePersistedTag: Ce
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
          ue,
          {
            isOpen: !!b,
            title: `Clear Tag #${b?.tag}?`,
            onClose: () => S(null),
            onConfirm: async () => {
              if (!b) return;
              const l = b.tag;
              S(null), await $(l);
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
          ue,
          {
            isOpen: B,
            title: "Create New Board",
            onClose: () => {
              M(!1), delete window.__pendingBoardTaskIds;
            },
            onConfirm: async () => {
              if (P.trim()) {
                M(!1);
                try {
                  await Oe(P);
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
            isOpen: te,
            title: "Create New Tag",
            onClose: () => {
              R(!1), delete window.__pendingTagTaskIds;
            },
            onConfirm: async () => {
              if (P.trim()) {
                R(!1);
                try {
                  await xe(P);
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
              le(o).length > 0 && /* @__PURE__ */ A("div", { className: "modal-section", children: [
                /* @__PURE__ */ k("label", { className: "modal-label", children: "Existing tags:" }),
                /* @__PURE__ */ k("div", { className: "modal-tags-list", children: le(o).map((l) => /* @__PURE__ */ A("span", { className: "modal-tag-chip", children: [
                  "#",
                  l
                ] }, l)) })
              ] })
            ]
          }
        ),
        /* @__PURE__ */ k(
          _e,
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
                  const l = F?.boards?.find((h) => h.id === j.boardId)?.name || j.boardId;
                  if (confirm(`Delete board "${l}"? All tasks on this board will be permanently deleted.`))
                    try {
                      await re(j.boardId), V(null);
                    } catch (h) {
                      console.error("[App] Failed to delete board:", h), alert(h.message || "Failed to delete board");
                    }
                }
              }
            ]
          }
        ),
        /* @__PURE__ */ k(
          _e,
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
                  const l = o.filter((h) => h.tag?.split(" ").includes(J.tag));
                  if (confirm(`Delete tag "${J.tag}" and remove it from ${l.length} task(s)?`))
                    try {
                      await $(J.tag), K(null);
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
function et(e, t = {}) {
  const n = new URLSearchParams(window.location.search), a = t.userType || n.get("userType") || "public", s = t.userId || n.get("userId") || "public", r = { ...t, userType: a, userId: s }, c = Re(e);
  c.render(/* @__PURE__ */ k(Ie, { ...r })), e.__root = c, console.log("[task-app] Mounted successfully", r);
}
function tt(e) {
  e.__root?.unmount();
}
export {
  et as mount,
  tt as unmount
};
