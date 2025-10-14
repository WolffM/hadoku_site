import { jsxs as A, jsx as k, Fragment as Re } from "react/jsx-runtime";
import { createRoot as Je } from "react-dom/client";
import { useState as N, useMemo as Ue, useEffect as ee, useRef as pe } from "react";
function je() {
  const e = Date.now().toString(36).toUpperCase().padStart(8, "0"), t = Array.from(crypto.getRandomValues(new Uint8Array(16))).map((a) => (a % 36).toString(36).toUpperCase()).join("");
  return e + t.slice(0, 18);
}
const F = `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
function I(e, t, a = 50) {
  setTimeout(() => {
    try {
      const s = new BroadcastChannel("tasks");
      s.postMessage({ type: e, ...t }), s.close();
    } catch (s) {
      console.error("[localStorageApi] Broadcast failed:", s);
    }
  }, a);
}
const we = (e, t, a) => `${e}-${t}-${a}-tasks`, ye = (e, t, a) => `${e}-${t}-${a}-stats`, De = (e, t) => `${e}-${t}-boards`;
function ne(e = "public", t = "public", a = "main") {
  const s = localStorage.getItem(we(e, t, a));
  return s ? JSON.parse(s) : {
    version: 1,
    updatedAt: (/* @__PURE__ */ new Date()).toISOString(),
    tasks: []
  };
}
function se(e, t = "public", a = "public", s = "main") {
  e.updatedAt = (/* @__PURE__ */ new Date()).toISOString(), localStorage.setItem(we(t, a, s), JSON.stringify(e));
}
function he(e = "public", t = "public", a = "main") {
  const s = localStorage.getItem(ye(e, t, a));
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
function ke(e, t = "public", a = "public", s = "main") {
  e.updatedAt = (/* @__PURE__ */ new Date()).toISOString(), localStorage.setItem(ye(t, a, s), JSON.stringify(e));
}
function le(e, t, a = "public", s = "public", n = "main") {
  const o = he(a, s, n);
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
  }, ke(o, a, s, n);
}
function te(e = "public", t = "public") {
  const a = localStorage.getItem(De(e, t));
  return a ? JSON.parse(a) : { version: 1, updatedAt: (/* @__PURE__ */ new Date()).toISOString(), boards: [] };
}
function ae(e, t = "public", a = "public") {
  e.updatedAt = (/* @__PURE__ */ new Date()).toISOString(), localStorage.setItem(De(t, a), JSON.stringify(e));
}
function Xe(e = "public", t = "public") {
  return {
    async getBoards() {
      const a = te(e, t);
      if (!a.boards || a.boards.length === 0) {
        const n = { id: "main", name: "main", tasks: [], stats: void 0, tags: [] };
        a.boards = [n], ae(a, e, t), se({ version: 1, updatedAt: (/* @__PURE__ */ new Date()).toISOString(), tasks: [] }, e, t, "main"), ke({ version: 2, updatedAt: (/* @__PURE__ */ new Date()).toISOString(), counters: { created: 0, completed: 0, edited: 0, deleted: 0 }, timeline: [], tasks: {} }, e, t, "main");
      }
      const s = { version: a.version, updatedAt: a.updatedAt, boards: [] };
      for (const n of a.boards) {
        const o = ne(e, t, n.id), c = he(e, t, n.id), i = { id: n.id, name: n.name, tasks: o.tasks, stats: c, tags: n.tags || [] };
        s.boards.push(i);
      }
      return s;
    },
    async createBoard(a) {
      const s = te(e, t);
      if (console.debug("[localStorageApi] createBoard", { userType: e, userId: t, boardId: a, existing: s.boards.map((o) => o.id) }), s.boards.find((o) => o.id === a))
        throw new Error("Board already exists");
      const n = { id: a, name: a, tasks: [], stats: void 0, tags: [] };
      return s.boards.push(n), ae(s, e, t), se({ version: 1, updatedAt: (/* @__PURE__ */ new Date()).toISOString(), tasks: [] }, e, t, a), ke({ version: 2, updatedAt: (/* @__PURE__ */ new Date()).toISOString(), counters: { created: 0, completed: 0, edited: 0, deleted: 0 }, timeline: [], tasks: {} }, e, t, a), I("boards-updated", { sessionId: F, userType: e, userId: t }), n;
    },
    async deleteBoard(a) {
      const s = te(e, t), n = s.boards.findIndex((o) => o.id === a);
      if (n === -1) throw new Error("Board not found");
      s.boards.splice(n, 1), ae(s, e, t), localStorage.removeItem(we(e, t, a)), localStorage.removeItem(ye(e, t, a)), I("boards-updated", { sessionId: F, userType: e, userId: t });
    },
    async getTasks(a = "main") {
      return ne(e, t, a);
    },
    async getStats(a = "main") {
      return he(e, t, a);
    },
    async createTask(a, s = "main", n = !1) {
      const o = ne(e, t, s), c = (/* @__PURE__ */ new Date()).toISOString(), i = {
        id: je(),
        title: a.title,
        tag: a.tag || null,
        state: "Active",
        createdAt: c,
        updatedAt: c,
        closedAt: null
      };
      if (o.tasks.push(i), se(o, e, t, s), a.tag) {
        const T = te(e, t), S = T.boards.find((p) => p.id === s);
        if (S) {
          const p = S.tags || [], b = a.tag.split(" ").filter(Boolean).filter(($) => !p.includes($));
          b.length && (S.tags = [...p, ...b], ae(T, e, t));
        }
      }
      return le("created", i, e, t, s), n ? console.log("[localStorageApi] createTask: broadcast suppressed") : (console.log("[localStorageApi] createTask: broadcasting update", { sessionId: F, boardId: s, taskId: i.id }), I("tasks-updated", { sessionId: F, userType: e, userId: t, boardId: s })), i;
    },
    async patchTask(a, s, n = "main", o = !1) {
      const c = ne(e, t, n), i = c.tasks.find((T) => T.id === a);
      if (!i)
        throw new Error("Task not found");
      if (s.title !== void 0 && (i.title = s.title), s.tag !== void 0 && (i.tag = s.tag), s.tag !== void 0) {
        const T = te(e, t), S = T.boards.find((p) => p.id === n);
        if (S) {
          const p = S.tags || [], b = (s.tag || "").split(" ").filter(Boolean).filter(($) => !p.includes($));
          b.length && (S.tags = [...p, ...b], ae(T, e, t));
        }
      }
      return i.updatedAt = (/* @__PURE__ */ new Date()).toISOString(), se(c, e, t, n), le("edited", i, e, t, n), o || I("tasks-updated", { sessionId: F, userType: e, userId: t, boardId: n }), i;
    },
    async completeTask(a, s = "main") {
      const n = ne(e, t, s), o = n.tasks.find((i) => i.id === a);
      if (!o)
        throw new Error("Task not found");
      const c = (/* @__PURE__ */ new Date()).toISOString();
      return o.state = "Completed", o.updatedAt = c, o.closedAt = c, se(n, e, t, s), le("completed", o, e, t, s), I("tasks-updated", { sessionId: F, userType: e, userId: t, boardId: s }), o;
    },
    async deleteTask(a, s = "main", n = !1) {
      console.log("[localStorageApi] deleteTask START", { id: a, boardId: s, suppressBroadcast: n, sessionId: F });
      const o = ne(e, t, s), c = o.tasks.find((T) => T.id === a);
      if (!c)
        throw new Error("Task not found");
      const i = (/* @__PURE__ */ new Date()).toISOString();
      return c.state = "Deleted", c.updatedAt = i, c.closedAt = i, se(o, e, t, s), le("deleted", c, e, t, s), n ? console.log("[localStorageApi] deleteTask: broadcast suppressed") : (console.log("[localStorageApi] deleteTask: broadcasting", { sessionId: F }), I("tasks-updated", { sessionId: F, userType: e, userId: t, boardId: s })), console.log("[localStorageApi] deleteTask END"), c;
    },
    async createTag(a, s = "main") {
      const n = te(e, t), o = n.boards.find((i) => i.id === s);
      if (!o) throw new Error("Board not found");
      const c = o.tags || [];
      c.includes(a) || (o.tags = [...c, a], ae(n, e, t), I("boards-updated", { sessionId: F, userType: e, userId: t, boardId: s }));
    },
    async deleteTag(a, s = "main") {
      const n = te(e, t), o = n.boards.find((i) => i.id === s);
      if (!o) throw new Error("Board not found");
      const c = o.tags || [];
      o.tags = c.filter((i) => i !== a), ae(n, e, t), I("boards-updated", { sessionId: F, userType: e, userId: t, boardId: s });
    },
    // User preferences
    async getPreferences() {
      const a = `${e}-${t}-preferences`, s = localStorage.getItem(a);
      return s ? JSON.parse(s) : {
        version: 1,
        updatedAt: (/* @__PURE__ */ new Date()).toISOString(),
        theme: "light"
      };
    },
    async savePreferences(a) {
      const s = `${e}-${t}-preferences`, o = {
        ...await this.getPreferences(),
        ...a,
        updatedAt: (/* @__PURE__ */ new Date()).toISOString()
      };
      localStorage.setItem(s, JSON.stringify(o));
    }
  };
}
async function He(e, t, a, s) {
  for (const c of t.boards || []) {
    const i = c.id;
    if (c.tasks && c.tasks.length > 0) {
      const T = `${a}-${s}-${i}-tasks`, S = {
        version: 1,
        updatedAt: t.updatedAt || (/* @__PURE__ */ new Date()).toISOString(),
        tasks: c.tasks
      };
      window.localStorage.setItem(T, JSON.stringify(S));
    }
    if (c.stats) {
      const T = `${a}-${s}-${i}-stats`;
      window.localStorage.setItem(T, JSON.stringify(c.stats));
    }
  }
  const n = `${a}-${s}-boards`, o = {
    version: 1,
    updatedAt: t.updatedAt || (/* @__PURE__ */ new Date()).toISOString(),
    boards: t.boards.map((c) => ({
      id: c.id,
      name: c.name,
      tags: c.tags || []
    }))
  };
  window.localStorage.setItem(n, JSON.stringify(o)), console.log("[api] Synced API data to localStorage:", {
    boards: t.boards?.length || 0,
    totalTasks: t.boards?.reduce((c, i) => c + (i.tasks?.length || 0), 0) || 0
  });
}
function W(e, t, a) {
  const s = {
    "Content-Type": "application/json",
    "X-User-Type": e
  };
  return t && (s["X-User-Id"] = t), a && (s["X-Session-Id"] = a), s;
}
function Te(e = "public", t = "public", a) {
  const s = Xe(e, t);
  return e === "public" ? s : {
    // Get boards - returns localStorage immediately (optimistic)
    async getBoards() {
      return await s.getBoards();
    },
    // Sync from API - called once on initial page load to get server state
    async syncFromApi() {
      try {
        console.log("[api] Syncing from API...");
        const n = await fetch(`/task/api/boards?userType=${e}&userId=${encodeURIComponent(t)}`, {
          headers: W(e, t, a)
        });
        if (!n.ok)
          throw new Error(`API returned ${n.status}`);
        const o = await n.json();
        console.log("[api] Synced from API:", { boards: o.boards?.length || 0, totalTasks: o.boards?.reduce((c, i) => c + (i.tasks?.length || 0), 0) || 0 }), await He(s, o, e, t);
      } catch (n) {
        console.error("[api] Sync from API failed:", n);
      }
    },
    async createTask(n, o = "main", c = !1) {
      const i = await s.createTask(n, o, c);
      return fetch("/task/api", {
        method: "POST",
        headers: W(e, t, a),
        body: JSON.stringify({
          id: i.id,
          // Send client ID to server
          ...n,
          boardId: o
        })
      }).then((T) => T.json()).then((T) => {
        T.ok && (T.id === i.id ? console.log("[api] Background sync: createTask completed (ID matched)") : console.warn("[api] Server returned different ID (unexpected):", { client: i.id, server: T.id }));
      }).catch((T) => console.error("[api] Failed to sync createTask:", T)), i;
    },
    async createTag(n, o = "main") {
      const c = await s.createTag(n, o);
      return fetch("/task/api/tags", {
        method: "POST",
        headers: W(e, t, a),
        body: JSON.stringify({ boardId: o, tag: n })
      }).then(() => console.log("[api] Background sync: createTag completed")).catch((i) => console.error("[api] Failed to sync createTag:", i)), c;
    },
    async deleteTag(n, o = "main") {
      const c = await s.deleteTag(n, o);
      return fetch("/task/api/tags", {
        method: "DELETE",
        headers: W(e, t, a),
        body: JSON.stringify({ boardId: o, tag: n })
      }).then(() => console.log("[api] Background sync: deleteTag completed")).catch((i) => console.error("[api] Failed to sync deleteTag:", i)), c;
    },
    async patchTask(n, o, c = "main", i = !1) {
      const T = await s.patchTask(n, o, c, i);
      return fetch(`/task/api/${n}`, {
        method: "PATCH",
        headers: W(e, t, a),
        body: JSON.stringify({ ...o, boardId: c })
      }).then(() => console.log("[api] Background sync: patchTask completed")).catch((S) => console.error("[api] Failed to sync patchTask:", S)), T;
    },
    async completeTask(n, o = "main") {
      const c = await s.completeTask(n, o);
      return fetch(`/task/api/${n}/complete`, {
        method: "POST",
        headers: W(e, t, a),
        body: JSON.stringify({ boardId: o })
      }).then(() => console.log("[api] Background sync: completeTask completed")).catch((i) => console.error("[api] Failed to sync completeTask:", i)), c;
    },
    async deleteTask(n, o = "main", c = !1) {
      await s.deleteTask(n, o, c), fetch(`/task/api/${n}`, {
        method: "DELETE",
        headers: W(e, t, a),
        body: JSON.stringify({ boardId: o })
      }).then(() => console.log("[api] Background sync: deleteTask completed")).catch((i) => console.error("[api] Failed to sync deleteTask:", i));
    },
    // Board operations
    async createBoard(n) {
      const o = await s.createBoard(n);
      return fetch("/task/api/boards", {
        method: "POST",
        headers: W(e, t, a),
        body: JSON.stringify({ id: n, name: n })
      }).then(() => console.log("[api] Background sync: createBoard completed")).catch((c) => console.error("[api] Failed to sync createBoard:", c)), o;
    },
    async deleteBoard(n) {
      const o = await s.deleteBoard(n);
      return fetch(`/task/api/boards/${encodeURIComponent(n)}`, {
        method: "DELETE",
        headers: W(e, t, a)
      }).then(() => console.log("[api] Background sync: deleteBoard completed")).catch((c) => console.error("[api] Failed to sync deleteBoard:", c)), o;
    },
    // User preferences
    async getPreferences() {
      return await s.getPreferences();
    },
    async savePreferences(n) {
      await s.savePreferences(n), fetch("/task/api/preferences", {
        method: "PUT",
        headers: W(e, t, a),
        body: JSON.stringify(n)
      }).then(() => console.log("[api] Background sync: savePreferences completed")).catch((o) => console.error("[api] Failed to sync savePreferences:", o));
    }
  };
}
function qe(e) {
  e = e.trim();
  const t = (n) => n.trim().replace(/\s+/g, "-"), a = e.match(/^["']([^"']+)["']\s*(.*)$/);
  if (a) {
    const n = a[1].trim(), c = a[2].match(/#[^\s#]+/g)?.map((i) => t(i.slice(1))).filter(Boolean) || [];
    return { title: n, tag: c.length ? c.join(" ") : void 0 };
  }
  const s = e.match(/^(.+?)\s+(#.+)$/);
  if (s) {
    const n = s[1].trim(), c = s[2].match(/#[^\s#]+/g)?.map((i) => t(i.slice(1))).filter(Boolean) || [];
    return { title: n, tag: c.length ? c.join(" ") : void 0 };
  }
  return { title: e.trim() };
}
function Ye(e, t = 6, a = []) {
  const s = e.flatMap((o) => o.tag?.split(" ") || []).filter(Boolean), n = {};
  return s.forEach((o) => n[o] = (n[o] || 0) + 1), a.filter(Boolean).forEach((o) => {
    n[o] || (n[o] = 0);
  }), Object.entries(n).sort((o, c) => c[1] - o[1]).slice(0, t).map(([o]) => o);
}
function be(e, t) {
  return e.filter((a) => a.tag?.split(" ").includes(t));
}
function Ke(e, t, a) {
  const s = Array.isArray(a) && a.length > 0;
  return e.filter((n) => {
    const o = n.tag?.split(" ") || [];
    return s ? a.some((i) => o.includes(i)) && !t.some((i) => o.includes(i)) : !t.some((c) => o.includes(c));
  });
}
function de(e) {
  return Array.from(new Set(e.flatMap((t) => t.tag?.split(" ") || []).filter(Boolean)));
}
function ge(e, t, a, s = 50) {
  setTimeout(() => {
    try {
      const n = new BroadcastChannel("tasks");
      n.postMessage({ type: "tasks-updated", sessionId: e, userType: t, userId: a }), n.close();
    } catch (n) {
      console.error("[useTasks] Broadcast failed:", n);
    }
  }, s);
}
function ze({ userType: e, userId: t, sessionId: a }) {
  const [s, n] = N([]), [o, c] = N(/* @__PURE__ */ new Set()), i = Ue(
    () => Te(e, t || "public", a),
    [e, t, a]
  ), [T, S] = N(null), [p, b] = N("main");
  async function $() {
    console.log("[useTasks] initialLoad called"), "syncFromApi" in i && await i.syncFromApi(), await _();
  }
  async function _() {
    console.log("[useTasks] reload called", { currentBoardId: p, stack: new Error().stack?.split(`
`).slice(1, 4).join(`
`) });
    const r = await i.getBoards();
    S(r);
    const l = r.boards.find((d) => d.id === p);
    l ? (console.log("[useTasks] reload: found current board", { boardId: l.id, taskCount: l.tasks?.length || 0 }), n((l.tasks || []).filter((d) => d.state === "Active"))) : (console.log("[useTasks] reload: board not found", { currentBoardId: p }), n([]));
  }
  ee(() => {
    console.log("[useTasks] User context changed, clearing state and reloading", { userType: e, userId: t }), n([]), c(/* @__PURE__ */ new Set()), S(null), b("main"), _();
  }, [e, t]), ee(() => {
    console.log("[useTasks] Setting up BroadcastChannel listener", { currentBoardId: p, userType: e, userId: t });
    try {
      const r = new BroadcastChannel("tasks");
      return r.onmessage = (l) => {
        const d = l.data || {};
        if (console.log("[useTasks] BroadcastChannel message received", { msg: d, sessionId: F, currentBoardId: p, currentContext: { userType: e, userId: t } }), d.sessionId === F) {
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
        (d.type === "tasks-updated" || d.type === "boards-updated") && (console.log("[useTasks] BroadcastChannel: triggering reload for currentBoardId =", p), _());
      }, () => {
        console.log("[useTasks] Cleaning up BroadcastChannel listener", { currentBoardId: p }), r.close();
      };
    } catch (r) {
      console.error("[useTasks] Failed to setup BroadcastChannel", r);
    }
  }, [p, e, t]);
  async function G(r) {
    if (r = r.trim(), !!r)
      try {
        const l = qe(r);
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
  async function K(r) {
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
  async function M(r) {
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
  async function L(r, l, d = {}) {
    const { suppressBroadcast: m = !1, skipReload: y = !1 } = d;
    try {
      await i.patchTask(r, l, p, m), y || await _();
    } catch (f) {
      throw f;
    }
  }
  async function x(r) {
    console.log("[useTasks] bulkUpdateTaskTags START", { count: r.length });
    try {
      for (const { taskId: l, tag: d } of r)
        await i.patchTask(l, { tag: d }, p, !0);
      console.log("[useTasks] bulkUpdateTaskTags: broadcasting bulk update with delay"), ge(F, e, t), console.log("[useTasks] bulkUpdateTaskTags: calling reload"), await _(), console.log("[useTasks] bulkUpdateTaskTags END");
    } catch (l) {
      throw console.error("[useTasks] bulkUpdateTaskTags ERROR", l), l;
    }
  }
  async function E(r) {
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
      console.log("[useTasks] clearTasksByTag: deleting tag from board", { tag: r, currentBoardId: p }), await i.deleteTag(r, p), console.log("[useTasks] clearTasksByTag: broadcasting bulk update with delay"), ge(F, e, t), console.log("[useTasks] clearTasksByTag: calling reload"), await _(), console.log("[useTasks] clearTasksByTag END");
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
  async function J(r) {
    await i.createBoard(r), b(r);
    const l = await i.getBoards();
    S(l);
    const d = l.boards.find((m) => m.id === r);
    d ? (console.log("[useTasks] createBoard: switched to new board", { boardId: r, taskCount: d.tasks?.length || 0 }), n((d.tasks || []).filter((m) => m.state === "Active"))) : (console.log("[useTasks] createBoard: new board not found (should be empty)", { boardId: r }), n([]));
  }
  async function U(r, l) {
    if (console.log("[useTasks] moveTasksToBoard START", { targetBoardId: r, ids: l, currentBoardId: p }), !T) return;
    const d = [];
    for (const f of T.boards)
      for (const u of f.tasks || [])
        l.includes(u.id) && d.push({ id: u.id, title: u.title, tag: u.tag || void 0, boardId: f.id });
    console.log("[useTasks] moveTasksToBoard: found tasks to move", { count: d.length });
    for (const f of d)
      await i.createTask({ title: f.title, tag: f.tag }, r, !0), await i.deleteTask(f.id, f.boardId, !0);
    console.log("[useTasks] moveTasksToBoard: broadcasting bulk update with delay"), ge(F, e, t), console.log("[useTasks] moveTasksToBoard: switching to target board", { targetBoardId: r }), b(r);
    const m = await i.getBoards();
    S(m);
    const y = m.boards.find((f) => f.id === r);
    y && (console.log("[useTasks] moveTasksToBoard: loaded target board tasks", { count: y.tasks?.length || 0 }), n((y.tasks || []).filter((f) => f.state === "Active"))), console.log("[useTasks] moveTasksToBoard END");
  }
  async function Q(r) {
    if (await i.deleteBoard(r), p === r) {
      b("main");
      const l = await i.getBoards();
      S(l);
      const d = l.boards.find((m) => m.id === "main");
      d ? (console.log("[useTasks] deleteBoard: switched to main board", { taskCount: d.tasks?.length || 0 }), n((d.tasks || []).filter((m) => m.state === "Active"))) : (console.log("[useTasks] deleteBoard: main board not found"), n([]));
    } else
      await _();
  }
  async function P(r) {
    await i.createTag(r, p), await _();
  }
  async function V(r) {
    await i.deleteTag(r, p), await _();
  }
  function q(r) {
    b(r);
    const l = T?.boards.find((d) => d.id === r);
    l ? n((l.tasks || []).filter((d) => d.state === "Active")) : _();
  }
  return {
    // Task state
    tasks: s,
    pendingOperations: o,
    // Task operations
    addTask: G,
    completeTask: H,
    deleteTask: K,
    addTagToTask: M,
    updateTaskTags: L,
    bulkUpdateTaskTags: x,
    clearTasksByTag: E,
    clearRemainingTasks: R,
    // Board state
    boards: T,
    currentBoardId: p,
    // Board operations
    createBoard: J,
    deleteBoard: Q,
    switchBoard: q,
    moveTasksToBoard: U,
    createTagOnBoard: P,
    deleteTagOnBoard: V,
    // Lifecycle
    initialLoad: $,
    reload: _
  };
}
function Ve({ tasks: e, onTaskUpdate: t, onBulkUpdate: a }) {
  const [s, n] = N(null), [o, c] = N(null), [i, T] = N(/* @__PURE__ */ new Set()), [S, p] = N(!1), [b, $] = N(null), [_, G] = N(null), H = pe(null);
  function K(r, l) {
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
          const B = u.querySelector(".task-app__tag-header") || u.querySelector("h3"), O = (B && B.textContent || "").trim().replace(/^#/, "");
          if (O)
            try {
              r.dataTransfer.setData("application/x-hadoku-task-source", O);
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
  function M(r) {
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
  function L(r) {
    if (r.button === 0) {
      try {
        const l = r.target;
        if (!l || l.closest && l.closest(".task-app__item, .task-app__controls, button, input, textarea, .task-app__item-actions"))
          return;
      } catch {
      }
      p(!0), H.current = { x: r.clientX, y: r.clientY }, $({ x: r.clientX, y: r.clientY, w: 0, h: 0 }), T(/* @__PURE__ */ new Set());
      try {
        document.body.classList.add("marquee-selecting");
      } catch {
      }
    }
  }
  function x(r) {
    if (!S || !H.current) return;
    const l = H.current.x, d = H.current.y, m = r.clientX, y = r.clientY, f = Math.min(l, m), u = Math.min(d, y), B = Math.abs(m - l), D = Math.abs(y - d);
    $({ x: f, y: u, w: B, h: D });
    const O = Array.from(document.querySelectorAll(".task-app__item")), z = /* @__PURE__ */ new Set();
    for (const Y of O) {
      const j = Y.getBoundingClientRect();
      if (!(j.right < f || j.left > f + B || j.bottom < u || j.top > u + D)) {
        const ce = Y.getAttribute("data-task-id");
        ce && z.add(ce), Y.classList.add("selected");
      } else
        Y.classList.remove("selected");
    }
    T(z);
  }
  function E(r) {
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
  function R() {
    T(/* @__PURE__ */ new Set()), Array.from(document.querySelectorAll(".task-app__item.selected")).forEach((l) => l.classList.remove("selected"));
  }
  ee(() => {
    function r(m) {
      if (m.button !== 0) return;
      const y = { target: m.target, clientX: m.clientX, clientY: m.clientY, button: m.button };
      try {
        L(y);
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
        E(y);
      } catch {
      }
    }
    return document.addEventListener("mousedown", r), document.addEventListener("mousemove", l), document.addEventListener("mouseup", d), () => {
      document.removeEventListener("mousedown", r), document.removeEventListener("mousemove", l), document.removeEventListener("mouseup", d);
    };
  }, []);
  function J(r, l) {
    r.preventDefault(), r.dataTransfer.dropEffect = "copy", n(l);
  }
  function U(r) {
    r.currentTarget.contains(r.relatedTarget) || n(null);
  }
  async function Q(r, l) {
    r.preventDefault(), n(null), console.log("[useDragAndDrop] onDrop START", { targetTag: l });
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
      const u = e.find((Y) => Y.id === f);
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
  function P(r, l) {
    r.preventDefault(), r.dataTransfer.dropEffect = "copy", c(l);
  }
  function V(r) {
    r.currentTarget.contains(r.relatedTarget) || c(null);
  }
  async function q(r, l) {
    r.preventDefault(), c(null);
    const d = r.dataTransfer.getData("text/plain"), m = e.find((u) => u.id === d);
    if (!m) return;
    const y = m.tag?.split(" ") || [];
    if (y.includes(l)) {
      console.log(`Task already has tag: ${l}`);
      return;
    }
    const f = [...y, l].join(" ");
    console.log(`Adding tag "${l}" to task "${m.title}" via filter drop. New tags: "${f}"`);
    try {
      await t(d, { tag: f });
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
    selectionStartHandler: L,
    selectionMoveHandler: x,
    selectionEndHandler: E,
    clearSelection: R,
    onDragStart: K,
    onDragEnd: M,
    onDragOver: J,
    onDragLeave: U,
    onDrop: Q,
    onFilterDragOver: P,
    onFilterDragLeave: V,
    onFilterDrop: q
  };
}
function We() {
  const [e, t] = N({});
  function a(c) {
    t((i) => {
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
  function n(c) {
    return c === "asc" ? "↑" : "↓";
  }
  function o(c) {
    return c === "asc" ? "Sorted by age (oldest first) - click to sort newest first" : "Sorted by age (newest first) - click to sort oldest first";
  }
  return {
    sortDirections: e,
    toggleSort: a,
    sortTasksByAge: s,
    getSortIcon: n,
    getSortTitle: o
  };
}
function Ge(e) {
  const t = /* @__PURE__ */ new Date(), a = new Date(e), s = t.getTime() - a.getTime(), n = Math.floor(s / 1e3), o = Math.floor(n / 60), c = Math.floor(o / 60), i = Math.floor(c / 24);
  return n < 60 ? `${n}s ago` : o < 60 ? `${o}m ago` : c < 24 ? `${c}h ago` : `${i}d ago`;
}
function ue({
  task: e,
  isDraggable: t = !0,
  pendingOperations: a,
  onComplete: s,
  onDelete: n,
  onAddTag: o,
  onDragStart: c,
  onDragEnd: i,
  selected: T = !1
}) {
  const S = a.has(`complete-${e.id}`), p = a.has(`delete-${e.id}`);
  return /* @__PURE__ */ A(
    "li",
    {
      className: `task-app__item ${T ? "selected" : ""}`,
      "data-task-id": e.id,
      draggable: t,
      onDragStart: c ? (b) => c(b, e.id) : void 0,
      onDragEnd: (b) => {
        if (b.currentTarget.classList.remove("dragging"), i)
          try {
            i(b);
          } catch {
          }
      },
      children: [
        /* @__PURE__ */ A("div", { className: "task-app__item-content", children: [
          /* @__PURE__ */ k("div", { className: "task-app__item-title", title: e.title, children: e.title }),
          /* @__PURE__ */ A("div", { className: "task-app__item-meta-row", children: [
            e.tag ? /* @__PURE__ */ k("div", { className: "task-app__item-tag", children: e.tag.split(" ").map((b) => `#${b}`).join(" ") }) : /* @__PURE__ */ k("div", {}),
            /* @__PURE__ */ k("div", { className: "task-app__item-age", children: Ge(e.createdAt) })
          ] })
        ] }),
        /* @__PURE__ */ A("div", { className: "task-app__item-actions", children: [
          /* @__PURE__ */ k(
            "button",
            {
              className: "task-app__action-btn task-app__complete-btn",
              onClick: () => s(e.id),
              title: "Complete task",
              disabled: S || p,
              children: S ? "⏳" : "✓"
            }
          ),
          /* @__PURE__ */ k(
            "button",
            {
              className: "task-app__action-btn task-app__delete-btn",
              onClick: () => n(e.id),
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
function Se(e) {
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
function Qe({
  tasks: e,
  topTags: t,
  filters: a,
  sortDirections: s,
  dragOverTag: n,
  pendingOperations: o,
  onComplete: c,
  onDelete: i,
  onAddTag: T,
  onDragStart: S,
  onDragEnd: p,
  selectedIds: b,
  onSelectionStart: $,
  onSelectionMove: _,
  onSelectionEnd: G,
  onDragOver: H,
  onDragLeave: K,
  onDrop: M,
  toggleSort: L,
  sortTasksByAge: x,
  getSortIcon: E,
  getSortTitle: R,
  clearTasksByTag: J,
  clearRemainingTasks: U,
  onDeletePersistedTag: Q
}) {
  const P = (u, B) => /* @__PURE__ */ A(
    "div",
    {
      className: `task-app__tag-column ${n === u ? "task-app__tag-column--drag-over" : ""}`,
      onDragOver: (D) => H(D, u),
      onDragLeave: K,
      onDrop: (D) => M(D, u),
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
              onClick: () => L(u),
              title: R(s[u] || "desc"),
              children: E(s[u] || "desc")
            }
          )
        ] }),
        /* @__PURE__ */ k("ul", { className: "task-app__list task-app__list--column", children: x(B, s[u] || "desc").map((D) => /* @__PURE__ */ k(
          ue,
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
  ), V = (u, B) => {
    let D = be(e, u);
    return r && (D = D.filter((O) => {
      const z = O.tag?.split(" ") || [];
      return a.some((Y) => z.includes(Y));
    })), D.slice(0, B);
  }, q = t.length, r = Array.isArray(a) && a.length > 0, l = e.filter((u) => {
    if (!r) return !0;
    const B = u.tag?.split(" ") || [];
    return a.some((D) => B.includes(D));
  }), d = Se(q), m = r ? t.filter((u) => be(e, u).some((D) => {
    const O = D.tag?.split(" ") || [];
    return a.some((z) => O.includes(z));
  })) : t.slice(0, d.useTags);
  if (m.length === 0)
    return /* @__PURE__ */ k("ul", { className: "task-app__list", children: l.map((u) => /* @__PURE__ */ k(
      ue,
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
  const y = Ke(e, t, a).filter((u) => {
    if (!r) return !0;
    const B = u.tag?.split(" ") || [];
    return a.some((D) => B.includes(D));
  }), f = Se(m.length);
  return /* @__PURE__ */ A("div", { className: "task-app__dynamic-layout", children: [
    f.rows.length > 0 && /* @__PURE__ */ k(Re, { children: f.rows.map((u, B) => /* @__PURE__ */ k("div", { className: `task-app__tag-grid task-app__tag-grid--${u.columns}col`, children: u.tagIndices.map((D) => {
      const O = m[D];
      return O ? P(O, V(O, f.maxPerColumn)) : null;
    }) }, B)) }),
    y.length > 0 && /* @__PURE__ */ A(
      "div",
      {
        className: `task-app__remaining ${n === "other" ? "task-app__tag-column--drag-over" : ""}`,
        onDragOver: (u) => {
          u.preventDefault(), u.dataTransfer.dropEffect = "move", H(u, "other");
        },
        onDragLeave: (u) => K(u),
        onDrop: (u) => M(u, "other"),
        children: [
          /* @__PURE__ */ A("div", { className: "task-app__tag-header-row", children: [
            /* @__PURE__ */ k("h3", { className: "task-app__remaining-header", children: "Other Tasks" }),
            /* @__PURE__ */ k(
              "button",
              {
                className: "task-app__sort-btn task-app__sort-btn--active",
                onClick: () => L("other"),
                title: R(s.other || "desc"),
                children: E(s.other || "desc")
              }
            )
          ] }),
          /* @__PURE__ */ k("ul", { className: "task-app__list", children: x(y, s.other || "desc").map((u) => /* @__PURE__ */ k(
            ue,
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
function fe({
  isOpen: e,
  title: t,
  onClose: a,
  onConfirm: s,
  children: n,
  inputValue: o,
  onInputChange: c,
  inputPlaceholder: i,
  confirmLabel: T = "Confirm",
  cancelLabel: S = "Cancel",
  confirmDisabled: p = !1,
  confirmDanger: b = !1
}) {
  return e ? /* @__PURE__ */ k(
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
            /* @__PURE__ */ k("h3", { children: t }),
            n,
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
function _e({ isOpen: e, x: t, y: a, items: s }) {
  return e ? /* @__PURE__ */ k(
    "div",
    {
      className: "board-context-menu",
      style: {
        left: `${t}px`,
        top: `${a}px`
      },
      children: s.map((n, o) => /* @__PURE__ */ k(
        "button",
        {
          className: `context-menu-item ${n.isDanger ? "context-menu-item--danger" : ""}`,
          onClick: n.onClick,
          children: n.label
        },
        o
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
function Ze(e = {}) {
  const { basename: t = "/task", apiUrl: a, environment: s, userType: n = "public", userId: o = "public", sessionId: c } = e, [i, T] = N(/* @__PURE__ */ new Set()), [S, p] = N([]), [b, $] = N(null), [_, G] = N(!1), [H, K] = N(!1), [M, L] = N(""), [x, E] = N("light"), [R, J] = N(!1), [U, Q] = N(null), [P, V] = N(null), q = pe(null), r = pe(null), {
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
    currentBoardId: re,
    createBoard: ce,
    deleteBoard: Be,
    switchBoard: Ae,
    moveTasksToBoard: ve,
    createTagOnBoard: xe,
    deleteTagOnBoard: Ce
  } = ze({ userType: n, userId: o, sessionId: c }), v = Ve({
    tasks: l,
    onTaskUpdate: D,
    onBulkUpdate: O
  }), oe = We();
  ee(() => {
    Te(n, o, c).getPreferences().then((h) => {
      E(h.theme);
    });
  }, [n, o, c]), ee(() => {
    Te(n, o, c).savePreferences({ theme: x });
  }, [x, n, o, c]), ee(() => {
    console.log("[App] User context changed, initializing...", { userType: n, userId: o }), m(), q.current?.focus();
  }, [n, o]), ee(() => {
    r.current && r.current.setAttribute("data-theme", x);
  }, [x]), ee(() => {
    if (!R && !U && !P) return;
    const g = (h) => {
      const w = h.target;
      w.closest(".theme-picker") || J(!1), w.closest(".board-context-menu") || Q(null), w.closest(".tag-context-menu") || V(null);
    };
    return document.addEventListener("mousedown", g), () => document.removeEventListener("mousedown", g);
  }, [R, U, P]);
  async function Ne(g) {
    await y(g) && q.current && (q.current.value = "", q.current.focus());
  }
  function Oe(g) {
    const h = l.filter((w) => w.tag?.split(" ").includes(g));
    $({ tag: g, count: h.length });
  }
  async function $e(g) {
    const h = g.trim().replace(/\s+/g, "-");
    try {
      await xe(h);
      const w = window.__pendingTagTaskIds;
      if (w && w.length > 0) {
        const Z = w.map((C) => {
          const ie = l.find((Le) => Le.id === C)?.tag?.split(" ").filter(Boolean) || [], Pe = [.../* @__PURE__ */ new Set([...ie, h])];
          return { taskId: C, tag: Pe.join(" ") };
        });
        await O(Z), v.clearSelection(), delete window.__pendingTagTaskIds;
      }
    } catch (w) {
      throw console.error("[App] Failed to create tag:", w), w;
    }
  }
  async function Ee(g) {
    const h = g.trim();
    try {
      const w = window.__pendingBoardTaskIds;
      await ce(h), w && w.length > 0 && (await ve(h, w), v.clearSelection(), delete window.__pendingBoardTaskIds);
    } catch (w) {
      throw console.error("[App] Failed to create board:", w), w;
    }
  }
  const Fe = j?.boards?.find((g) => g.id === re)?.tags || [], Me = Ye(l, 6);
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
                    E("light"), J(!1);
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
                    E("dark"), J(!1);
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
                    E("strawberry"), J(!1);
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
                    E("ocean"), J(!1);
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
                    E("cyberpunk"), J(!1);
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
                    E("coffee"), J(!1);
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
                    E("lavender"), J(!1);
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
              className: `board-btn ${re === g.id ? "board-btn--active" : ""} ${v.dragOverFilter === `board:${g.id}` ? "board-btn--drag-over" : ""}`,
              onClick: () => Ae(g.id),
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
              "aria-pressed": re === g.id ? "true" : "false",
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
                const w = me(h.dataTransfer);
                if (w.length !== 0)
                  try {
                    await ve(g.id, w);
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
                L(""), G(!0);
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
                const h = me(g.dataTransfer);
                h.length > 0 && (L(""), window.__pendingBoardTaskIds = h, G(!0));
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
              g.key === "Enter" && !g.shiftKey && (g.preventDefault(), Ne(g.target.value)), g.key === "k" && (g.ctrlKey || g.metaKey) && (g.preventDefault(), q.current?.focus());
            }
          }
        ) }),
        /* @__PURE__ */ A("div", { className: "task-app__filters", children: [
          (() => {
            const g = de(l);
            return Array.from(/* @__PURE__ */ new Set([...Fe, ...g, ...S])).map((w) => {
              const Z = i.has(w);
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
                      const ie = C.touches[0];
                      V({ tag: w, x: ie.clientX, y: ie.clientY });
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
                  className: `${Z ? "on" : ""} ${v.dragOverFilter === w ? "task-app__filter-drag-over" : ""}`,
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
                L(""), K(!0);
              },
              onDragOver: (g) => {
                g.preventDefault(), g.dataTransfer.dropEffect = "copy", v.onFilterDragOver(g, "add-tag");
              },
              onDragLeave: v.onFilterDragLeave,
              onDrop: async (g) => {
                g.preventDefault(), v.onFilterDragLeave(g);
                const h = me(g.dataTransfer);
                h.length > 0 && (L(""), window.__pendingTagTaskIds = h, K(!0));
              },
              "aria-label": "Add tag",
              children: "＋"
            }
          )
        ] }),
        /* @__PURE__ */ k(
          Qe,
          {
            tasks: l,
            topTags: Me,
            filters: Array.from(i),
            selectedIds: v.selectedIds,
            onSelectionStart: v.selectionStartHandler,
            onSelectionMove: v.selectionMoveHandler,
            onSelectionEnd: v.selectionEndHandler,
            sortDirections: oe.sortDirections,
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
            toggleSort: oe.toggleSort,
            sortTasksByAge: oe.sortTasksByAge,
            getSortIcon: oe.getSortIcon,
            getSortTitle: oe.getSortTitle,
            clearTasksByTag: Oe,
            clearRemainingTasks: Y,
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
          fe,
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
          fe,
          {
            isOpen: _,
            title: "Create New Board",
            onClose: () => {
              G(!1), delete window.__pendingBoardTaskIds;
            },
            onConfirm: async () => {
              if (M.trim()) {
                G(!1);
                try {
                  await Ee(M);
                } catch (g) {
                  console.error("[App] Failed to create board:", g);
                }
              }
            },
            inputValue: M,
            onInputChange: L,
            inputPlaceholder: "Board name",
            confirmLabel: "Create",
            confirmDisabled: !M.trim(),
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
          fe,
          {
            isOpen: H,
            title: "Create New Tag",
            onClose: () => {
              K(!1), delete window.__pendingTagTaskIds;
            },
            onConfirm: async () => {
              if (M.trim()) {
                K(!1);
                try {
                  await $e(M);
                } catch (g) {
                  console.error("[App] Failed to create tag:", g);
                }
              }
            },
            inputValue: M,
            onInputChange: L,
            inputPlaceholder: "Enter new tag name",
            confirmLabel: "Create",
            confirmDisabled: !M.trim(),
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
              de(l).length > 0 && /* @__PURE__ */ A("div", { className: "modal-section", children: [
                /* @__PURE__ */ k("label", { className: "modal-label", children: "Existing tags:" }),
                /* @__PURE__ */ k("div", { className: "modal-tags-list", children: de(l).map((g) => /* @__PURE__ */ A("span", { className: "modal-tag-chip", children: [
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
                      await Be(U.boardId), Q(null);
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
            isOpen: !!P,
            x: P?.x || 0,
            y: P?.y || 0,
            items: [
              {
                label: "🗑️ Delete Tag",
                isDanger: !0,
                onClick: async () => {
                  if (!P) return;
                  const g = l.filter((h) => h.tag?.split(" ").includes(P.tag));
                  if (confirm(`Delete tag "${P.tag}" and remove it from ${g.length} task(s)?`))
                    try {
                      await z(P.tag), V(null);
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
function nt(e, t = {}) {
  const a = new URLSearchParams(window.location.search), s = t.userType || a.get("userType") || "public", n = t.userId || a.get("userId") || "public", o = t.sessionId, c = { ...t, userType: s, userId: n, sessionId: o }, i = Je(e);
  i.render(/* @__PURE__ */ k(Ze, { ...c })), e.__root = i, console.log("[task-app] Mounted successfully", c);
}
function st(e) {
  e.__root?.unmount();
}
export {
  nt as mount,
  st as unmount
};
