import { jsxs as C, jsx as k, Fragment as Re } from "react/jsx-runtime";
import { createRoot as Pe } from "react-dom/client";
import { useState as N, useMemo as Ue, useEffect as se, useRef as pe } from "react";
function je() {
  const e = Date.now().toString(36).toUpperCase().padStart(8, "0"), t = Array.from(crypto.getRandomValues(new Uint8Array(16))).map((a) => (a % 36).toString(36).toUpperCase()).join("");
  return e + t.slice(0, 18);
}
function I(e, t, a = 50) {
  setTimeout(() => {
    try {
      const o = new BroadcastChannel("tasks");
      o.postMessage({ type: e, ...t }), o.close();
    } catch (o) {
      console.error("[localStorageApi] Broadcast failed:", o);
    }
  }, a);
}
const Te = (e, t, a) => `${e}-${t}-${a}-tasks`, we = (e, t, a) => `${e}-${t}-${a}-stats`, Se = (e, t) => `${e}-${t}-boards`;
function ae(e = "public", t = "public", a = "main") {
  const o = localStorage.getItem(Te(e, t, a));
  return o ? JSON.parse(o) : {
    version: 1,
    updatedAt: (/* @__PURE__ */ new Date()).toISOString(),
    tasks: []
  };
}
function ne(e, t = "public", a = "public", o = "main") {
  e.updatedAt = (/* @__PURE__ */ new Date()).toISOString(), localStorage.setItem(Te(t, a, o), JSON.stringify(e));
}
function he(e = "public", t = "public", a = "main") {
  const o = localStorage.getItem(we(e, t, a));
  return o ? JSON.parse(o) : {
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
function ke(e, t = "public", a = "public", o = "main") {
  e.updatedAt = (/* @__PURE__ */ new Date()).toISOString(), localStorage.setItem(we(t, a, o), JSON.stringify(e));
}
function le(e, t, a = "public", o = "public", n = "main") {
  const r = he(a, o, n);
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
  }, ke(r, a, o, n);
}
function ee(e = "public", t = "public") {
  const a = localStorage.getItem(Se(e, t));
  return a ? JSON.parse(a) : { version: 1, updatedAt: (/* @__PURE__ */ new Date()).toISOString(), boards: [] };
}
function te(e, t = "public", a = "public") {
  e.updatedAt = (/* @__PURE__ */ new Date()).toISOString(), localStorage.setItem(Se(t, a), JSON.stringify(e));
}
function Je(e = "public", t = "public") {
  return {
    async getBoards() {
      const a = ee(e, t);
      if (!a.boards || a.boards.length === 0) {
        const n = { id: "main", name: "main", tasks: [], stats: void 0, tags: [] };
        a.boards = [n], te(a, e, t), ne({ version: 1, updatedAt: (/* @__PURE__ */ new Date()).toISOString(), tasks: [] }, e, t, "main"), ke({ version: 2, updatedAt: (/* @__PURE__ */ new Date()).toISOString(), counters: { created: 0, completed: 0, edited: 0, deleted: 0 }, timeline: [], tasks: {} }, e, t, "main");
      }
      const o = { version: a.version, updatedAt: a.updatedAt, boards: [] };
      for (const n of a.boards) {
        const r = ae(e, t, n.id), i = he(e, t, n.id), l = { id: n.id, name: n.name, tasks: r.tasks, stats: i, tags: n.tags || [] };
        o.boards.push(l);
      }
      return o;
    },
    async createBoard(a) {
      const o = ee(e, t);
      if (console.debug("[localStorageApi] createBoard", { userType: e, userId: t, boardId: a, existing: o.boards.map((r) => r.id) }), o.boards.find((r) => r.id === a))
        throw new Error("Board already exists");
      const n = { id: a, name: a, tasks: [], stats: void 0, tags: [] };
      return o.boards.push(n), te(o, e, t), ne({ version: 1, updatedAt: (/* @__PURE__ */ new Date()).toISOString(), tasks: [] }, e, t, a), ke({ version: 2, updatedAt: (/* @__PURE__ */ new Date()).toISOString(), counters: { created: 0, completed: 0, edited: 0, deleted: 0 }, timeline: [], tasks: {} }, e, t, a), I("boards-updated", { sessionId: E, userType: e, userId: t }), n;
    },
    async deleteBoard(a) {
      const o = ee(e, t), n = o.boards.findIndex((r) => r.id === a);
      if (n === -1) throw new Error("Board not found");
      o.boards.splice(n, 1), te(o, e, t), localStorage.removeItem(Te(e, t, a)), localStorage.removeItem(we(e, t, a)), I("boards-updated", { sessionId: E, userType: e, userId: t });
    },
    async getTasks(a = "main") {
      return ae(e, t, a);
    },
    async getStats(a = "main") {
      return he(e, t, a);
    },
    async createTask(a, o = "main", n = !1) {
      const r = ae(e, t, o), i = (/* @__PURE__ */ new Date()).toISOString(), l = {
        id: je(),
        title: a.title,
        tag: a.tag || null,
        state: "Active",
        createdAt: i,
        updatedAt: i,
        closedAt: null
      };
      if (r.tasks.push(l), ne(r, e, t, o), a.tag) {
        const b = ee(e, t), _ = b.boards.find((p) => p.id === o);
        if (_) {
          const p = _.tags || [], v = a.tag.split(" ").filter(Boolean).filter(($) => !p.includes($));
          v.length && (_.tags = [...p, ...v], te(b, e, t));
        }
      }
      return le("created", l, e, t, o), n ? console.log("[localStorageApi] createTask: broadcast suppressed") : (console.log("[localStorageApi] createTask: broadcasting update", { sessionId: E, boardId: o, taskId: l.id }), I("tasks-updated", { sessionId: E, userType: e, userId: t, boardId: o })), l;
    },
    async patchTask(a, o, n = "main", r = !1) {
      const i = ae(e, t, n), l = i.tasks.find((b) => b.id === a);
      if (!l)
        throw new Error("Task not found");
      if (o.title !== void 0 && (l.title = o.title), o.tag !== void 0 && (l.tag = o.tag), o.tag !== void 0) {
        const b = ee(e, t), _ = b.boards.find((p) => p.id === n);
        if (_) {
          const p = _.tags || [], v = (o.tag || "").split(" ").filter(Boolean).filter(($) => !p.includes($));
          v.length && (_.tags = [...p, ...v], te(b, e, t));
        }
      }
      return l.updatedAt = (/* @__PURE__ */ new Date()).toISOString(), ne(i, e, t, n), le("edited", l, e, t, n), r || I("tasks-updated", { sessionId: E, userType: e, userId: t, boardId: n }), l;
    },
    async completeTask(a, o = "main") {
      const n = ae(e, t, o), r = n.tasks.find((l) => l.id === a);
      if (!r)
        throw new Error("Task not found");
      const i = (/* @__PURE__ */ new Date()).toISOString();
      return r.state = "Completed", r.updatedAt = i, r.closedAt = i, ne(n, e, t, o), le("completed", r, e, t, o), I("tasks-updated", { sessionId: E, userType: e, userId: t, boardId: o }), r;
    },
    async deleteTask(a, o = "main", n = !1) {
      console.log("[localStorageApi] deleteTask START", { id: a, boardId: o, suppressBroadcast: n, sessionId: E });
      const r = ae(e, t, o), i = r.tasks.find((b) => b.id === a);
      if (!i)
        throw new Error("Task not found");
      const l = (/* @__PURE__ */ new Date()).toISOString();
      return i.state = "Deleted", i.updatedAt = l, i.closedAt = l, ne(r, e, t, o), le("deleted", i, e, t, o), n ? console.log("[localStorageApi] deleteTask: broadcast suppressed") : (console.log("[localStorageApi] deleteTask: broadcasting", { sessionId: E }), I("tasks-updated", { sessionId: E, userType: e, userId: t, boardId: o })), console.log("[localStorageApi] deleteTask END"), i;
    },
    async createTag(a, o = "main") {
      const n = ee(e, t), r = n.boards.find((l) => l.id === o);
      if (!r) throw new Error("Board not found");
      const i = r.tags || [];
      i.includes(a) || (r.tags = [...i, a], te(n, e, t), I("boards-updated", { sessionId: E, userType: e, userId: t, boardId: o }));
    },
    async deleteTag(a, o = "main") {
      const n = ee(e, t), r = n.boards.find((l) => l.id === o);
      if (!r) throw new Error("Board not found");
      const i = r.tags || [];
      r.tags = i.filter((l) => l !== a), te(n, e, t), I("boards-updated", { sessionId: E, userType: e, userId: t, boardId: o });
    }
  };
}
function V(e, t, a) {
  const o = {
    "Content-Type": "application/json",
    "X-User-Type": e
  };
  return t && (o["X-User-Id"] = t), a && (o["X-Session-Id"] = a), o;
}
function Xe(e = "public", t = "public", a) {
  const o = Je(e, t);
  return e === "public" ? o : {
    // Return all boards and tasks for this user. Local first, then background sync.
    async getBoards() {
      const n = await o.getBoards();
      return fetch(`/task/api/boards?userType=${e}&userId=${encodeURIComponent(t)}`, {
        headers: V(e, t, a)
      }).then((r) => r.json()).then(() => console.log("[api] Background sync: getBoards completed")).catch((r) => console.error("[api] Background sync failed (getBoards):", r)), n;
    },
    async getStats(n = "main") {
      const r = await o.getStats(n);
      return fetch(`/task/api/stats?userType=${e}&userId=${encodeURIComponent(t)}&boardId=${encodeURIComponent(n)}`, {
        headers: V(e, t, a)
      }).then((i) => i.json()).then(() => console.log("[api] Background sync: getStats completed")).catch((i) => console.error("[api] Background sync failed (getStats):", i)), r;
    },
    async createTask(n, r = "main", i = !1) {
      const l = await o.createTask(n, r, i);
      return fetch("/task/api", {
        method: "POST",
        headers: V(e, t, a),
        body: JSON.stringify({ ...n, boardId: r })
      }).then(() => console.log("[api] Background sync: createTask completed")).catch((b) => console.error("[api] Failed to sync createTask:", b)), l;
    },
    async createTag(n, r = "main") {
      const i = await o.createTag(n, r);
      return fetch("/task/api/tags", {
        method: "POST",
        headers: V(e, t, a),
        body: JSON.stringify({ boardId: r, tag: n })
      }).then(() => console.log("[api] Background sync: createTag completed")).catch((l) => console.error("[api] Failed to sync createTag:", l)), i;
    },
    async deleteTag(n, r = "main") {
      const i = await o.deleteTag(n, r);
      return fetch("/task/api/tags", {
        method: "DELETE",
        headers: V(e, t, a),
        body: JSON.stringify({ boardId: r, tag: n })
      }).then(() => console.log("[api] Background sync: deleteTag completed")).catch((l) => console.error("[api] Failed to sync deleteTag:", l)), i;
    },
    async patchTask(n, r, i = "main", l = !1) {
      const b = await o.patchTask(n, r, i, l);
      return fetch(`/task/api/${n}`, {
        method: "PATCH",
        headers: V(e, t, a),
        body: JSON.stringify({ ...r, boardId: i })
      }).then(() => console.log("[api] Background sync: patchTask completed")).catch((_) => console.error("[api] Failed to sync patchTask:", _)), b;
    },
    async completeTask(n, r = "main") {
      const i = await o.completeTask(n, r);
      return fetch(`/task/api/${n}/complete`, {
        method: "POST",
        headers: V(e, t, a),
        body: JSON.stringify({ boardId: r })
      }).then(() => console.log("[api] Background sync: completeTask completed")).catch((l) => console.error("[api] Failed to sync completeTask:", l)), i;
    },
    async deleteTask(n, r = "main", i = !1) {
      await o.deleteTask(n, r, i), fetch(`/task/api/${n}`, {
        method: "DELETE",
        headers: V(e, t, a),
        body: JSON.stringify({ boardId: r })
      }).then(() => console.log("[api] Background sync: deleteTask completed")).catch((l) => console.error("[api] Failed to sync deleteTask:", l));
    },
    // Board operations
    async createBoard(n) {
      const r = await o.createBoard(n);
      return fetch("/task/api/boards", {
        method: "POST",
        headers: V(e, t, a),
        body: JSON.stringify({ boardId: n })
      }).then(() => console.log("[api] Background sync: createBoard completed")).catch((i) => console.error("[api] Failed to sync createBoard:", i)), r;
    },
    async deleteBoard(n) {
      const r = await o.deleteBoard(n);
      return fetch(`/task/api/boards/${encodeURIComponent(n)}`, {
        method: "DELETE",
        headers: V(e, t, a)
      }).then(() => console.log("[api] Background sync: deleteBoard completed")).catch((i) => console.error("[api] Failed to sync deleteBoard:", i)), r;
    },
    async getTasks(n = "main") {
      const r = await o.getTasks(n);
      return fetch(`/task/api/tasks?userType=${e}&userId=${encodeURIComponent(t)}&boardId=${encodeURIComponent(n)}`, {
        headers: V(e, t, a)
      }).then((i) => i.json()).then(() => console.log("[api] Background sync: getTasks completed")).catch((i) => console.error("[api] Background sync failed (getTasks):", i)), r;
    }
  };
}
function He(e) {
  e = e.trim();
  const t = (n) => n.trim().replace(/\s+/g, "-"), a = e.match(/^["']([^"']+)["']\s*(.*)$/);
  if (a) {
    const n = a[1].trim(), i = a[2].match(/#[^\s#]+/g)?.map((l) => t(l.slice(1))).filter(Boolean) || [];
    return { title: n, tag: i.length ? i.join(" ") : void 0 };
  }
  const o = e.match(/^(.+?)\s+(#.+)$/);
  if (o) {
    const n = o[1].trim(), i = o[2].match(/#[^\s#]+/g)?.map((l) => t(l.slice(1))).filter(Boolean) || [];
    return { title: n, tag: i.length ? i.join(" ") : void 0 };
  }
  return { title: e.trim() };
}
function qe(e, t = 6, a = []) {
  const o = e.flatMap((r) => r.tag?.split(" ") || []).filter(Boolean), n = {};
  return o.forEach((r) => n[r] = (n[r] || 0) + 1), a.filter(Boolean).forEach((r) => {
    n[r] || (n[r] = 0);
  }), Object.entries(n).sort((r, i) => i[1] - r[1]).slice(0, t).map(([r]) => r);
}
function ve(e, t) {
  return e.filter((a) => a.tag?.split(" ").includes(t));
}
function Ye(e, t, a) {
  const o = Array.isArray(a) && a.length > 0;
  return e.filter((n) => {
    const r = n.tag?.split(" ") || [];
    return o ? a.some((l) => r.includes(l)) && !t.some((l) => r.includes(l)) : !t.some((i) => r.includes(i));
  });
}
function de(e) {
  return Array.from(new Set(e.flatMap((t) => t.tag?.split(" ") || []).filter(Boolean)));
}
const E = `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
function ge(e, t, a, o = 50) {
  setTimeout(() => {
    try {
      const n = new BroadcastChannel("tasks");
      n.postMessage({ type: "tasks-updated", sessionId: e, userType: t, userId: a }), n.close();
    } catch (n) {
      console.error("[useTasks] Broadcast failed:", n);
    }
  }, o);
}
function Ke({ userType: e, userId: t, sessionId: a }) {
  const [o, n] = N([]), [r, i] = N(/* @__PURE__ */ new Set()), l = Ue(
    () => Xe(e, t || "public", a),
    [e, t, a]
  ), [b, _] = N(null), [p, v] = N("main");
  async function $() {
    console.log("[useTasks] initialLoad called"), await S();
  }
  async function S() {
    console.log("[useTasks] reload called", { currentBoardId: p, stack: new Error().stack?.split(`
`).slice(1, 4).join(`
`) });
    const s = await l.getBoards();
    _(s);
    const c = s.boards.find((d) => d.id === p);
    c ? (console.log("[useTasks] reload: found current board", { boardId: c.id, taskCount: c.tasks?.length || 0 }), n((c.tasks || []).filter((d) => d.state === "Active"))) : (console.log("[useTasks] reload: board not found", { currentBoardId: p }), n([]));
  }
  se(() => {
    console.log("[useTasks] User context changed, clearing state and reloading", { userType: e, userId: t }), n([]), i(/* @__PURE__ */ new Set()), _(null), v("main"), S();
  }, [e, t]), se(() => {
    console.log("[useTasks] Setting up BroadcastChannel listener", { currentBoardId: p, userType: e, userId: t });
    try {
      const s = new BroadcastChannel("tasks");
      return s.onmessage = (c) => {
        const d = c.data || {};
        if (console.log("[useTasks] BroadcastChannel message received", { msg: d, sessionId: E, currentBoardId: p, currentContext: { userType: e, userId: t } }), d.sessionId === E) {
          console.log("[useTasks] Ignoring own broadcast message");
          return;
        }
        if (d.userType !== e || d.userId !== t) {
          console.log("[useTasks] Ignoring message for different user context", {
            msgContext: { userType: d.userType, userId: d.userId },
            currentContext: { userType: e, userId: t }
          });
          return;
        }
        (d.type === "tasks-updated" || d.type === "boards-updated") && (console.log("[useTasks] BroadcastChannel: triggering reload for currentBoardId =", p), S());
      }, () => {
        console.log("[useTasks] Cleaning up BroadcastChannel listener", { currentBoardId: p }), s.close();
      };
    } catch (s) {
      console.error("[useTasks] Failed to setup BroadcastChannel", s);
    }
  }, [p, e, t]);
  async function G(s) {
    if (s = s.trim(), !!s)
      try {
        const c = He(s);
        return await l.createTask(c, p), await S(), !0;
      } catch (c) {
        return alert(c.message || "Failed to create task"), !1;
      }
  }
  async function H(s) {
    const c = `complete-${s}`;
    if (!r.has(c)) {
      i((d) => /* @__PURE__ */ new Set([...d, c]));
      try {
        await l.completeTask(s, p), await S();
      } catch (d) {
        d?.message?.includes("404") || alert(d.message || "Failed to complete task");
      } finally {
        i((d) => {
          const m = new Set(d);
          return m.delete(c), m;
        });
      }
    }
  }
  async function K(s) {
    console.log("[useTasks] deleteTask START", { taskId: s, currentBoardId: p });
    const c = `delete-${s}`;
    if (r.has(c)) {
      console.log("[useTasks] deleteTask: already pending, skipping", { operationKey: c });
      return;
    }
    i((d) => /* @__PURE__ */ new Set([...d, c]));
    try {
      console.log("[useTasks] deleteTask: calling api.deleteTask", { taskId: s, currentBoardId: p }), await l.deleteTask(s, p), console.log("[useTasks] deleteTask: calling reload"), await S(), console.log("[useTasks] deleteTask END");
    } catch (d) {
      d?.message?.includes("404") || alert(d.message || "Failed to delete task");
    } finally {
      i((d) => {
        const m = new Set(d);
        return m.delete(c), m;
      });
    }
  }
  async function F(s) {
    const c = prompt("Enter tag (without #):");
    if (!c) return;
    const d = c.trim().replace(/^#+/, "").replace(/\s+/g, "-"), m = o.find((u) => u.id === s);
    if (!m) return;
    const w = m.tag?.split(" ") || [];
    if (w.includes(d)) return;
    const f = [...w, d].join(" ");
    try {
      await l.patchTask(s, { tag: f }, p), await S();
    } catch (u) {
      alert(u.message || "Failed to add tag");
    }
  }
  async function R(s, c, d = {}) {
    const { suppressBroadcast: m = !1, skipReload: w = !1 } = d;
    try {
      await l.patchTask(s, c, p, m), w || await S();
    } catch (f) {
      throw f;
    }
  }
  async function x(s) {
    console.log("[useTasks] bulkUpdateTaskTags START", { count: s.length });
    try {
      for (const { taskId: c, tag: d } of s)
        await l.patchTask(c, { tag: d }, p, !0);
      console.log("[useTasks] bulkUpdateTaskTags: broadcasting bulk update with delay"), ge(E, e, t), console.log("[useTasks] bulkUpdateTaskTags: calling reload"), await S(), console.log("[useTasks] bulkUpdateTaskTags END");
    } catch (c) {
      throw console.error("[useTasks] bulkUpdateTaskTags ERROR", c), c;
    }
  }
  async function M(s) {
    console.log("[useTasks] clearTasksByTag START", { tag: s, currentBoardId: p, taskCount: o.length });
    const c = o.filter((d) => d.tag?.split(" ").includes(s));
    if (console.log("[useTasks] clearTasksByTag: found tasks with tag", { tag: s, count: c.length }), c.length === 0) {
      console.log("[useTasks] clearTasksByTag: no tasks found with this tag, just deleting tag");
      try {
        await l.deleteTag(s, p), await S(), console.log("[useTasks] clearTasksByTag END (no tasks to clear)");
      } catch (d) {
        console.error("[useTasks] clearTasksByTag ERROR", d), console.error("[useTasks] clearTasksByTag: Please fix this error:", d.message);
      }
      return;
    }
    console.log("[useTasks] clearTasksByTag: proceeding without confirmation (dialogs blocked)", { taskCount: c.length });
    try {
      console.log("[useTasks] clearTasksByTag: starting to patch tasks");
      for (const d of c) {
        const m = d.tag?.split(" ") || [], w = m.filter((u) => u !== s), f = w.length > 0 ? w.join(" ") : null;
        console.log("[useTasks] clearTasksByTag: patching task", { taskId: d.id, oldTags: m, newTags: w }), await l.patchTask(d.id, { tag: f }, p, !0);
      }
      console.log("[useTasks] clearTasksByTag: deleting tag from board", { tag: s, currentBoardId: p }), await l.deleteTag(s, p), console.log("[useTasks] clearTasksByTag: broadcasting bulk update with delay"), ge(E, e, t), console.log("[useTasks] clearTasksByTag: calling reload"), await S(), console.log("[useTasks] clearTasksByTag END");
    } catch (d) {
      console.error("[useTasks] clearTasksByTag ERROR", d), alert(d.message || "Failed to remove tag from tasks");
    }
  }
  async function P(s) {
    if (confirm("Clear all remaining tasks?"))
      try {
        for (const c of s)
          await l.deleteTask(c.id, p);
        await S();
      } catch (c) {
        alert(c.message || "Failed to clear remaining tasks");
      }
  }
  async function U(s) {
    await l.createBoard(s), v(s);
    const c = await l.getBoards();
    _(c);
    const d = c.boards.find((m) => m.id === s);
    d ? (console.log("[useTasks] createBoard: switched to new board", { boardId: s, taskCount: d.tasks?.length || 0 }), n((d.tasks || []).filter((m) => m.state === "Active"))) : (console.log("[useTasks] createBoard: new board not found (should be empty)", { boardId: s }), n([]));
  }
  async function j(s, c) {
    if (console.log("[useTasks] moveTasksToBoard START", { targetBoardId: s, ids: c, currentBoardId: p }), !b) return;
    const d = [];
    for (const f of b.boards)
      for (const u of f.tasks || [])
        c.includes(u.id) && d.push({ id: u.id, title: u.title, tag: u.tag || void 0, boardId: f.id });
    console.log("[useTasks] moveTasksToBoard: found tasks to move", { count: d.length });
    for (const f of d)
      await l.createTask({ title: f.title, tag: f.tag }, s, !0), await l.deleteTask(f.id, f.boardId, !0);
    console.log("[useTasks] moveTasksToBoard: broadcasting bulk update with delay"), ge(E, e, t), console.log("[useTasks] moveTasksToBoard: switching to target board", { targetBoardId: s }), v(s);
    const m = await l.getBoards();
    _(m);
    const w = m.boards.find((f) => f.id === s);
    w && (console.log("[useTasks] moveTasksToBoard: loaded target board tasks", { count: w.tasks?.length || 0 }), n((w.tasks || []).filter((f) => f.state === "Active"))), console.log("[useTasks] moveTasksToBoard END");
  }
  async function Q(s) {
    if (await l.deleteBoard(s), p === s) {
      v("main");
      const c = await l.getBoards();
      _(c);
      const d = c.boards.find((m) => m.id === "main");
      d ? (console.log("[useTasks] deleteBoard: switched to main board", { taskCount: d.tasks?.length || 0 }), n((d.tasks || []).filter((m) => m.state === "Active"))) : (console.log("[useTasks] deleteBoard: main board not found"), n([]));
    } else
      await S();
  }
  async function L(s) {
    await l.createTag(s, p), await S();
  }
  async function W(s) {
    await l.deleteTag(s, p), await S();
  }
  function q(s) {
    v(s);
    const c = b?.boards.find((d) => d.id === s);
    c ? n((c.tasks || []).filter((d) => d.state === "Active")) : S();
  }
  return {
    // Task state
    tasks: o,
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
    boards: b,
    currentBoardId: p,
    // Board operations
    createBoard: U,
    deleteBoard: Q,
    switchBoard: q,
    moveTasksToBoard: j,
    createTagOnBoard: L,
    deleteTagOnBoard: W,
    // Lifecycle
    initialLoad: $,
    reload: S
  };
}
function ze({ tasks: e, onTaskUpdate: t, onBulkUpdate: a }) {
  const [o, n] = N(null), [r, i] = N(null), [l, b] = N(/* @__PURE__ */ new Set()), [_, p] = N(!1), [v, $] = N(null), [S, G] = N(null), H = pe(null);
  function K(s, c) {
    const d = l.has(c) && l.size > 0 ? Array.from(l) : [c];
    console.log("[useDragAndDrop] onDragStart", { taskId: c, idsToDrag: d, selectedCount: l.size }), s.dataTransfer.setData("text/plain", d[0]);
    try {
      s.dataTransfer.setData("application/x-hadoku-task-ids", JSON.stringify(d));
    } catch {
    }
    s.dataTransfer.effectAllowed = "copyMove";
    try {
      const m = s.currentTarget, w = m.closest && m.closest(".task-app__item") ? m.closest(".task-app__item") : m;
      w.classList.add("dragging");
      const f = w.cloneNode(!0);
      f.style.boxSizing = "border-box", f.style.width = `${w.offsetWidth}px`, f.style.height = `${w.offsetHeight}px`, f.style.opacity = "0.95", f.style.transform = "none", f.style.filter = "drop-shadow(0 6px 18px rgba(0,0,0,0.12))", f.classList.add("drag-image"), f.style.position = "absolute", f.style.top = "-9999px", f.style.left = "-9999px", document.body.appendChild(f), w.__dragImage = f, b((u) => {
        if (u.has(c)) return new Set(u);
        const B = new Set(u);
        return B.add(c), B;
      });
      try {
        const u = w.closest(".task-app__tag-column");
        if (u) {
          const B = u.querySelector(".task-app__tag-header") || u.querySelector("h3"), O = (B && B.textContent || "").trim().replace(/^#/, "");
          if (O)
            try {
              s.dataTransfer.setData("application/x-hadoku-task-source", O);
            } catch {
            }
        }
      } catch {
      }
      try {
        const u = w.getBoundingClientRect();
        let B = Math.round(s.clientX - u.left), D = Math.round(s.clientY - u.top);
        B = Math.max(0, Math.min(Math.round(f.offsetWidth - 1), B)), D = Math.max(0, Math.min(Math.round(f.offsetHeight - 1), D)), s.dataTransfer.setDragImage(f, B, D);
      } catch {
        s.dataTransfer.setDragImage(f, 0, 0);
      }
    } catch {
    }
  }
  function F(s) {
    try {
      const c = s.currentTarget;
      c.classList.remove("dragging");
      const d = c.__dragImage;
      d && d.parentNode && d.parentNode.removeChild(d), d && delete c.__dragImage;
    } catch {
    }
    try {
      P();
    } catch {
    }
  }
  function R(s) {
    if (s.button === 0) {
      try {
        const c = s.target;
        if (!c || c.closest && c.closest(".task-app__item, .task-app__controls, button, input, textarea, .task-app__item-actions"))
          return;
      } catch {
      }
      p(!0), H.current = { x: s.clientX, y: s.clientY }, $({ x: s.clientX, y: s.clientY, w: 0, h: 0 }), b(/* @__PURE__ */ new Set());
      try {
        document.body.classList.add("marquee-selecting");
      } catch {
      }
    }
  }
  function x(s) {
    if (!_ || !H.current) return;
    const c = H.current.x, d = H.current.y, m = s.clientX, w = s.clientY, f = Math.min(c, m), u = Math.min(d, w), B = Math.abs(m - c), D = Math.abs(w - d);
    $({ x: f, y: u, w: B, h: D });
    const O = Array.from(document.querySelectorAll(".task-app__item")), z = /* @__PURE__ */ new Set();
    for (const Y of O) {
      const J = Y.getBoundingClientRect();
      if (!(J.right < f || J.left > f + B || J.bottom < u || J.top > u + D)) {
        const ce = Y.getAttribute("data-task-id");
        ce && z.add(ce), Y.classList.add("selected");
      } else
        Y.classList.remove("selected");
    }
    b(z);
  }
  function M(s) {
    p(!1), $(null), H.current = null;
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
    b(/* @__PURE__ */ new Set()), Array.from(document.querySelectorAll(".task-app__item.selected")).forEach((c) => c.classList.remove("selected"));
  }
  se(() => {
    function s(m) {
      if (m.button !== 0) return;
      const w = { target: m.target, clientX: m.clientX, clientY: m.clientY, button: m.button };
      try {
        R(w);
      } catch {
      }
    }
    function c(m) {
      const w = { clientX: m.clientX, clientY: m.clientY };
      try {
        x(w);
      } catch {
      }
    }
    function d(m) {
      const w = { clientX: m.clientX, clientY: m.clientY };
      try {
        M(w);
      } catch {
      }
    }
    return document.addEventListener("mousedown", s), document.addEventListener("mousemove", c), document.addEventListener("mouseup", d), () => {
      document.removeEventListener("mousedown", s), document.removeEventListener("mousemove", c), document.removeEventListener("mouseup", d);
    };
  }, []);
  function U(s, c) {
    s.preventDefault(), s.dataTransfer.dropEffect = "copy", n(c);
  }
  function j(s) {
    s.currentTarget.contains(s.relatedTarget) || n(null);
  }
  async function Q(s, c) {
    s.preventDefault(), n(null), console.log("[useDragAndDrop] onDrop START", { targetTag: c });
    let d = [];
    try {
      const f = s.dataTransfer.getData("application/x-hadoku-task-ids");
      f && (d = JSON.parse(f));
    } catch {
    }
    if (d.length === 0) {
      const f = s.dataTransfer.getData("text/plain");
      f && (d = [f]);
    }
    if (d.length === 0) return;
    let m = null;
    try {
      const f = s.dataTransfer.getData("application/x-hadoku-task-source");
      f && (m = f);
    } catch {
    }
    console.log("[useDragAndDrop] onDrop: processing", { targetTag: c, ids: d, srcTag: m, taskCount: d.length });
    const w = [];
    for (const f of d) {
      const u = e.find((Y) => Y.id === f);
      if (!u) continue;
      const B = u.tag?.split(" ").filter(Boolean) || [];
      if (c === "other") {
        if (B.length === 0) continue;
        w.push({ taskId: f, tag: "" });
        continue;
      }
      const D = B.includes(c);
      let O = B.slice();
      D || O.push(c), m && m !== c && (O = O.filter((Y) => Y !== m));
      const z = O.join(" ").trim();
      w.push({ taskId: f, tag: z });
    }
    console.log("[useDragAndDrop] onDrop: updating tasks", { updateCount: w.length });
    try {
      await a(w), console.log("[useDragAndDrop] onDrop: updates complete, clearing selection");
      try {
        P();
      } catch {
      }
    } catch (f) {
      console.error("Failed to add tag to one or more tasks:", f), alert(f.message || "Failed to add tags");
    }
    console.log("[useDragAndDrop] onDrop END");
  }
  function L(s, c) {
    s.preventDefault(), s.dataTransfer.dropEffect = "copy", i(c);
  }
  function W(s) {
    s.currentTarget.contains(s.relatedTarget) || i(null);
  }
  async function q(s, c) {
    s.preventDefault(), i(null);
    const d = s.dataTransfer.getData("text/plain"), m = e.find((u) => u.id === d);
    if (!m) return;
    const w = m.tag?.split(" ") || [];
    if (w.includes(c)) {
      console.log(`Task already has tag: ${c}`);
      return;
    }
    const f = [...w, c].join(" ");
    console.log(`Adding tag "${c}" to task "${m.title}" via filter drop. New tags: "${f}"`);
    try {
      await t(d, { tag: f });
      try {
        P();
      } catch {
      }
    } catch (u) {
      console.error("Failed to add tag via filter drop:", u), alert(u.message || "Failed to add tag");
    }
  }
  return {
    dragOverTag: o,
    dragOverFilter: r,
    setDragOverFilter: i,
    selectedIds: l,
    isSelecting: _,
    marqueeRect: v,
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
function Ve() {
  const [e, t] = N({});
  function a(i) {
    t((l) => {
      const _ = (l[i] || "desc") === "desc" ? "asc" : "desc";
      return { ...l, [i]: _ };
    });
  }
  function o(i, l) {
    return [...i].sort((b, _) => {
      const p = new Date(b.createdAt).getTime(), v = new Date(_.createdAt).getTime();
      return l === "asc" ? p - v : v - p;
    });
  }
  function n(i) {
    return i === "asc" ? "↑" : "↓";
  }
  function r(i) {
    return i === "asc" ? "Sorted by age (oldest first) - click to sort newest first" : "Sorted by age (newest first) - click to sort oldest first";
  }
  return {
    sortDirections: e,
    toggleSort: a,
    sortTasksByAge: o,
    getSortIcon: n,
    getSortTitle: r
  };
}
function We(e) {
  const t = /* @__PURE__ */ new Date(), a = new Date(e), o = t.getTime() - a.getTime(), n = Math.floor(o / 1e3), r = Math.floor(n / 60), i = Math.floor(r / 60), l = Math.floor(i / 24);
  return n < 60 ? `${n}s ago` : r < 60 ? `${r}m ago` : i < 24 ? `${i}h ago` : `${l}d ago`;
}
function ue({
  task: e,
  isDraggable: t = !0,
  pendingOperations: a,
  onComplete: o,
  onDelete: n,
  onAddTag: r,
  onDragStart: i,
  onDragEnd: l,
  selected: b = !1
}) {
  const _ = a.has(`complete-${e.id}`), p = a.has(`delete-${e.id}`);
  return /* @__PURE__ */ C(
    "li",
    {
      className: `task-app__item ${b ? "selected" : ""}`,
      "data-task-id": e.id,
      draggable: t,
      onDragStart: i ? (v) => i(v, e.id) : void 0,
      onDragEnd: (v) => {
        if (v.currentTarget.classList.remove("dragging"), l)
          try {
            l(v);
          } catch {
          }
      },
      children: [
        /* @__PURE__ */ C("div", { className: "task-app__item-content", children: [
          /* @__PURE__ */ k("div", { className: "task-app__item-title", title: e.title, children: e.title }),
          /* @__PURE__ */ C("div", { className: "task-app__item-meta-row", children: [
            e.tag ? /* @__PURE__ */ k("div", { className: "task-app__item-tag", children: e.tag.split(" ").map((v) => `#${v}`).join(" ") }) : /* @__PURE__ */ k("div", {}),
            /* @__PURE__ */ k("div", { className: "task-app__item-age", children: We(e.createdAt) })
          ] })
        ] }),
        /* @__PURE__ */ C("div", { className: "task-app__item-actions", children: [
          /* @__PURE__ */ k(
            "button",
            {
              className: "task-app__action-btn task-app__complete-btn",
              onClick: () => o(e.id),
              title: "Complete task",
              disabled: _ || p,
              children: _ ? "⏳" : "✓"
            }
          ),
          /* @__PURE__ */ k(
            "button",
            {
              className: "task-app__action-btn task-app__delete-btn",
              onClick: () => n(e.id),
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
function Ge({
  tasks: e,
  topTags: t,
  filters: a,
  sortDirections: o,
  dragOverTag: n,
  pendingOperations: r,
  onComplete: i,
  onDelete: l,
  onAddTag: b,
  onDragStart: _,
  onDragEnd: p,
  selectedIds: v,
  onSelectionStart: $,
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
              title: P(o[u] || "desc"),
              children: M(o[u] || "desc")
            }
          )
        ] }),
        /* @__PURE__ */ k("ul", { className: "task-app__list task-app__list--column", children: x(B, o[u] || "desc").map((D) => /* @__PURE__ */ k(
          ue,
          {
            task: D,
            isDraggable: !0,
            pendingOperations: r,
            onComplete: i,
            onDelete: l,
            onAddTag: b,
            onDragStart: _,
            onDragEnd: p,
            selected: v ? v.has(D.id) : !1
          },
          D.id
        )) })
      ]
    },
    u
  ), W = (u, B) => {
    let D = ve(e, u);
    return s && (D = D.filter((O) => {
      const z = O.tag?.split(" ") || [];
      return a.some((Y) => z.includes(Y));
    })), D.slice(0, B);
  }, q = t.length, s = Array.isArray(a) && a.length > 0, c = e.filter((u) => {
    if (!s) return !0;
    const B = u.tag?.split(" ") || [];
    return a.some((D) => B.includes(D));
  }), d = be(q), m = s ? t.filter((u) => ve(e, u).some((D) => {
    const O = D.tag?.split(" ") || [];
    return a.some((z) => O.includes(z));
  })) : t.slice(0, d.useTags);
  if (m.length === 0)
    return /* @__PURE__ */ k("ul", { className: "task-app__list", children: c.map((u) => /* @__PURE__ */ k(
      ue,
      {
        task: u,
        pendingOperations: r,
        onComplete: i,
        onDelete: l,
        onAddTag: b,
        onDragStart: _,
        onDragEnd: p,
        selected: v ? v.has(u.id) : !1
      },
      u.id
    )) });
  const w = Ye(e, t, a).filter((u) => {
    if (!s) return !0;
    const B = u.tag?.split(" ") || [];
    return a.some((D) => B.includes(D));
  }), f = be(m.length);
  return /* @__PURE__ */ C("div", { className: "task-app__dynamic-layout", children: [
    f.rows.length > 0 && /* @__PURE__ */ k(Re, { children: f.rows.map((u, B) => /* @__PURE__ */ k("div", { className: `task-app__tag-grid task-app__tag-grid--${u.columns}col`, children: u.tagIndices.map((D) => {
      const O = m[D];
      return O ? L(O, W(O, f.maxPerColumn)) : null;
    }) }, B)) }),
    w.length > 0 && /* @__PURE__ */ C(
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
                title: P(o.other || "desc"),
                children: M(o.other || "desc")
              }
            )
          ] }),
          /* @__PURE__ */ k("ul", { className: "task-app__list", children: x(w, o.other || "desc").map((u) => /* @__PURE__ */ k(
            ue,
            {
              task: u,
              pendingOperations: r,
              onComplete: i,
              onDelete: l,
              onAddTag: b,
              onDragStart: _,
              onDragEnd: p,
              selected: v ? v.has(u.id) : !1
            },
            u.id
          )) })
        ]
      }
    )
  ] });
}
function fe({
  isOpen: e,
  title: t,
  onClose: a,
  onConfirm: o,
  children: n,
  inputValue: r,
  onInputChange: i,
  inputPlaceholder: l,
  confirmLabel: b = "Confirm",
  cancelLabel: _ = "Cancel",
  confirmDisabled: p = !1,
  confirmDanger: v = !1
}) {
  return e ? /* @__PURE__ */ k(
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
            /* @__PURE__ */ k("h3", { children: t }),
            n,
            i && /* @__PURE__ */ k(
              "input",
              {
                type: "text",
                className: "modal-input",
                value: r || "",
                onChange: (S) => i(S.target.value),
                placeholder: l,
                autoFocus: !0,
                onKeyDown: (S) => {
                  S.key === "Enter" && !p && (S.preventDefault(), o()), S.key === "Escape" && (S.preventDefault(), a());
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
                  className: `modal-button ${v ? "modal-button--danger" : "modal-button--primary"}`,
                  onClick: o,
                  disabled: p,
                  children: b
                }
              )
            ] })
          ]
        }
      )
    }
  ) : null;
}
function _e({ isOpen: e, x: t, y: a, items: o }) {
  return e ? /* @__PURE__ */ k(
    "div",
    {
      className: "board-context-menu",
      style: {
        left: `${t}px`,
        top: `${a}px`
      },
      children: o.map((n, r) => /* @__PURE__ */ k(
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
function me(e) {
  let t = [];
  try {
    const a = e.getData("application/x-hadoku-task-ids");
    a && (t = JSON.parse(a));
  } catch {
  }
  if (t.length === 0) {
    const a = e.getData("text/plain");
    a && (t = [a]);
  }
  return t;
}
function Qe(e = {}) {
  const { basename: t = "/task", apiUrl: a, environment: o, userType: n = "public", userId: r = "public", sessionId: i } = e, [l, b] = N(/* @__PURE__ */ new Set()), [_, p] = N([]), [v, $] = N(null), [S, G] = N(!1), [H, K] = N(!1), [F, R] = N(""), [x, M] = N("light"), [P, U] = N(!1), [j, Q] = N(null), [L, W] = N(null), q = pe(null), s = pe(null), {
    tasks: c,
    pendingOperations: d,
    initialLoad: m,
    addTask: w,
    completeTask: f,
    deleteTask: u,
    addTagToTask: B,
    updateTaskTags: D,
    bulkUpdateTaskTags: O,
    clearTasksByTag: z,
    clearRemainingTasks: Y,
    // board API
    boards: J,
    currentBoardId: re,
    createBoard: ce,
    deleteBoard: De,
    switchBoard: Be,
    moveTasksToBoard: ye,
    createTagOnBoard: Ce,
    deleteTagOnBoard: xe
  } = Ke({ userType: n, userId: r, sessionId: i }), y = ze({
    tasks: c,
    onTaskUpdate: D,
    onBulkUpdate: O
  }), oe = Ve();
  se(() => {
    console.log("[App] User context changed, initializing...", { userType: n, userId: r }), m(), q.current?.focus();
  }, [n, r]), se(() => {
    s.current && s.current.setAttribute("data-theme", x);
  }, [x]), se(() => {
    if (!P && !j && !L) return;
    const g = (h) => {
      const T = h.target;
      T.closest(".theme-picker") || U(!1), T.closest(".board-context-menu") || Q(null), T.closest(".tag-context-menu") || W(null);
    };
    return document.addEventListener("mousedown", g), () => document.removeEventListener("mousedown", g);
  }, [P, j, L]);
  async function Ae(g) {
    await w(g) && q.current && (q.current.value = "", q.current.focus());
  }
  function Ne(g) {
    const h = c.filter((T) => T.tag?.split(" ").includes(g));
    $({ tag: g, count: h.length });
  }
  async function Oe(g) {
    const h = g.trim().replace(/\s+/g, "-");
    try {
      await Ce(h);
      const T = window.__pendingTagTaskIds;
      if (T && T.length > 0) {
        const Z = T.map((A) => {
          const ie = c.find((Le) => Le.id === A)?.tag?.split(" ").filter(Boolean) || [], Me = [.../* @__PURE__ */ new Set([...ie, h])];
          return { taskId: A, tag: Me.join(" ") };
        });
        await O(Z), y.clearSelection(), delete window.__pendingTagTaskIds;
      }
    } catch (T) {
      throw console.error("[App] Failed to create tag:", T), T;
    }
  }
  async function $e(g) {
    const h = g.trim();
    try {
      const T = window.__pendingBoardTaskIds;
      await ce(h), T && T.length > 0 && (await ye(h, T), y.clearSelection(), delete window.__pendingBoardTaskIds);
    } catch (T) {
      throw console.error("[App] Failed to create board:", T), T;
    }
  }
  const Ee = J?.boards?.find((g) => g.id === re)?.tags || [], Fe = qe(c, 6);
  return /* @__PURE__ */ k(
    "div",
    {
      ref: s,
      className: "task-app-container",
      onMouseDown: y.selectionStartHandler,
      onMouseMove: y.selectionMoveHandler,
      onMouseUp: y.selectionEndHandler,
      onMouseLeave: y.selectionEndHandler,
      onClick: (g) => {
        try {
          const h = g.target;
          if (!h.closest || !h.closest(".task-app__item")) {
            try {
              const T = y.selectionJustEndedAt;
              if (T && Date.now() - T < 300)
                return;
            } catch {
            }
            y.clearSelection();
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
              className: `board-btn ${re === g.id ? "board-btn--active" : ""} ${y.dragOverFilter === `board:${g.id}` ? "board-btn--drag-over" : ""}`,
              onClick: () => Be(g.id),
              onContextMenu: (h) => {
                h.preventDefault(), g.id !== "main" && Q({ boardId: g.id, x: h.clientX, y: h.clientY });
              },
              onTouchStart: (h) => {
                if (g.id === "main") return;
                const T = setTimeout(() => {
                  const Z = h.touches[0];
                  Q({ boardId: g.id, x: Z.clientX, y: Z.clientY });
                }, 500);
                h.currentTarget.__longPressTimer = T;
              },
              onTouchEnd: (h) => {
                const T = h.currentTarget.__longPressTimer;
                T && (clearTimeout(T), h.currentTarget.__longPressTimer = null);
              },
              onTouchMove: (h) => {
                const T = h.currentTarget.__longPressTimer;
                T && (clearTimeout(T), h.currentTarget.__longPressTimer = null);
              },
              "aria-pressed": re === g.id ? "true" : "false",
              onDragOver: (h) => {
                h.preventDefault(), h.dataTransfer.dropEffect = "move";
                try {
                  y.setDragOverFilter?.(`board:${g.id}`);
                } catch {
                }
              },
              onDragLeave: (h) => {
                try {
                  y.setDragOverFilter?.(null);
                } catch {
                }
              },
              onDrop: async (h) => {
                h.preventDefault();
                try {
                  y.setDragOverFilter?.(null);
                } catch {
                }
                const T = me(h.dataTransfer);
                if (T.length !== 0)
                  try {
                    await ye(g.id, T);
                    try {
                      y.clearSelection();
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
              className: `board-add-btn ${y.dragOverFilter === "add-board" ? "board-btn--drag-over" : ""}`,
              onClick: () => {
                R(""), G(!0);
              },
              onDragOver: (g) => {
                g.preventDefault(), g.dataTransfer.dropEffect = "move";
                try {
                  y.setDragOverFilter?.("add-board");
                } catch {
                }
              },
              onDragLeave: (g) => {
                try {
                  y.setDragOverFilter?.(null);
                } catch {
                }
              },
              onDrop: async (g) => {
                g.preventDefault();
                try {
                  y.setDragOverFilter?.(null);
                } catch {
                }
                const h = me(g.dataTransfer);
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
              g.key === "Enter" && !g.shiftKey && (g.preventDefault(), Ae(g.target.value)), g.key === "k" && (g.ctrlKey || g.metaKey) && (g.preventDefault(), q.current?.focus());
            }
          }
        ) }),
        /* @__PURE__ */ C("div", { className: "task-app__filters", children: [
          (() => {
            const g = de(c);
            return Array.from(/* @__PURE__ */ new Set([...Ee, ...g, ..._])).map((T) => {
              const Z = l.has(T);
              return /* @__PURE__ */ C(
                "button",
                {
                  onClick: () => {
                    b((A) => {
                      const X = new Set(A);
                      return X.has(T) ? X.delete(T) : X.add(T), X;
                    });
                  },
                  onContextMenu: (A) => {
                    A.preventDefault(), W({ tag: T, x: A.clientX, y: A.clientY });
                  },
                  onTouchStart: (A) => {
                    const X = setTimeout(() => {
                      const ie = A.touches[0];
                      W({ tag: T, x: ie.clientX, y: ie.clientY });
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
                  className: `${Z ? "on" : ""} ${y.dragOverFilter === T ? "task-app__filter-drag-over" : ""}`,
                  onDragOver: (A) => y.onFilterDragOver(A, T),
                  onDragLeave: y.onFilterDragLeave,
                  onDrop: (A) => y.onFilterDrop(A, T),
                  children: [
                    "#",
                    T
                  ]
                },
                T
              );
            });
          })(),
          /* @__PURE__ */ k(
            "button",
            {
              className: `task-app__filter-add ${y.dragOverFilter === "add-tag" ? "task-app__filter-drag-over" : ""}`,
              onClick: () => {
                R(""), K(!0);
              },
              onDragOver: (g) => {
                g.preventDefault(), g.dataTransfer.dropEffect = "copy", y.onFilterDragOver(g, "add-tag");
              },
              onDragLeave: y.onFilterDragLeave,
              onDrop: async (g) => {
                g.preventDefault(), y.onFilterDragLeave(g);
                const h = me(g.dataTransfer);
                h.length > 0 && (R(""), window.__pendingTagTaskIds = h, K(!0));
              },
              "aria-label": "Add tag",
              children: "＋"
            }
          )
        ] }),
        /* @__PURE__ */ k(
          Ge,
          {
            tasks: c,
            topTags: Fe,
            filters: Array.from(l),
            selectedIds: y.selectedIds,
            onSelectionStart: y.selectionStartHandler,
            onSelectionMove: y.selectionMoveHandler,
            onSelectionEnd: y.selectionEndHandler,
            sortDirections: oe.sortDirections,
            dragOverTag: y.dragOverTag,
            pendingOperations: d,
            onComplete: f,
            onDelete: u,
            onAddTag: B,
            onDragStart: y.onDragStart,
            onDragEnd: y.onDragEnd,
            onDragOver: y.onDragOver,
            onDragLeave: y.onDragLeave,
            onDrop: y.onDrop,
            toggleSort: oe.toggleSort,
            sortTasksByAge: oe.sortTasksByAge,
            getSortIcon: oe.getSortIcon,
            getSortTitle: oe.getSortTitle,
            clearTasksByTag: Ne,
            clearRemainingTasks: Y,
            onDeletePersistedTag: xe
          }
        ),
        y.isSelecting && y.marqueeRect && /* @__PURE__ */ k(
          "div",
          {
            className: "marquee-overlay",
            style: {
              left: `${y.marqueeRect.x}px`,
              top: `${y.marqueeRect.y}px`,
              width: `${y.marqueeRect.w}px`,
              height: `${y.marqueeRect.h}px`
            }
          }
        ),
        /* @__PURE__ */ k(
          fe,
          {
            isOpen: !!v,
            title: `Clear Tag #${v?.tag}?`,
            onClose: () => $(null),
            onConfirm: async () => {
              if (!v) return;
              const g = v.tag;
              $(null), await z(g);
            },
            confirmLabel: "Clear Tag",
            confirmDanger: !0,
            children: v && /* @__PURE__ */ C("p", { children: [
              "This will remove ",
              /* @__PURE__ */ C("strong", { children: [
                "#",
                v.tag
              ] }),
              " from",
              " ",
              /* @__PURE__ */ C("strong", { children: [
                v.count,
                " task(s)"
              ] }),
              " and delete the tag from the board."
            ] })
          }
        ),
        /* @__PURE__ */ k(
          fe,
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
                  await $e(F);
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
          fe,
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
                  await Oe(F);
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
              de(c).length > 0 && /* @__PURE__ */ C("div", { className: "modal-section", children: [
                /* @__PURE__ */ k("label", { className: "modal-label", children: "Existing tags:" }),
                /* @__PURE__ */ k("div", { className: "modal-tags-list", children: de(c).map((g) => /* @__PURE__ */ C("span", { className: "modal-tag-chip", children: [
                  "#",
                  g
                ] }, g)) })
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
                  const g = J?.boards?.find((h) => h.id === j.boardId)?.name || j.boardId;
                  if (confirm(`Delete board "${g}"? All tasks on this board will be permanently deleted.`))
                    try {
                      await De(j.boardId), Q(null);
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
            isOpen: !!L,
            x: L?.x || 0,
            y: L?.y || 0,
            items: [
              {
                label: "🗑️ Delete Tag",
                isDanger: !0,
                onClick: async () => {
                  if (!L) return;
                  const g = c.filter((h) => h.tag?.split(" ").includes(L.tag));
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
function at(e, t = {}) {
  const a = new URLSearchParams(window.location.search), o = t.userType || a.get("userType") || "public", n = t.userId || a.get("userId") || "public", r = t.sessionId, i = { ...t, userType: o, userId: n, sessionId: r }, l = Pe(e);
  l.render(/* @__PURE__ */ k(Qe, { ...i })), e.__root = l, console.log("[task-app] Mounted successfully", i);
}
function nt(e) {
  e.__root?.unmount();
}
export {
  at as mount,
  nt as unmount
};
