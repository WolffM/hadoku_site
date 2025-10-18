import { jsx as r, jsxs as k, Fragment as It } from "react/jsx-runtime";
import { createRoot as Ot } from "react-dom/client";
import { useState as B, useMemo as dt, useEffect as W, useRef as we } from "react";
const q = `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
class $t {
  constructor(e = "public", a = "public") {
    this.userType = e, this.userId = a;
  }
  // --- Storage Keys ---
  // Note: Always use the userType from constructor, not the one passed to methods
  // This ensures data stays in the same localStorage location regardless of authContext
  getTasksKey(e, a, o) {
    return `${this.userType}-${a || this.userId}-${o || "main"}-tasks`;
  }
  getStatsKey(e, a, o) {
    return `${this.userType}-${a || this.userId}-${o || "main"}-stats`;
  }
  getBoardsKey(e, a) {
    return `${this.userType}-${a || this.userId}-boards`;
  }
  // --- Tasks Operations ---
  async getTasks(e, a, o) {
    const s = this.getTasksKey(e, a, o), n = localStorage.getItem(s);
    return n ? JSON.parse(n) : {
      version: 1,
      updatedAt: (/* @__PURE__ */ new Date()).toISOString(),
      tasks: []
    };
  }
  async saveTasks(e, a, o, s) {
    const n = this.getTasksKey(e, a, o);
    s.updatedAt = (/* @__PURE__ */ new Date()).toISOString(), localStorage.setItem(n, JSON.stringify(s));
  }
  // --- Stats Operations ---
  async getStats(e, a, o) {
    const s = this.getStatsKey(e, a, o), n = localStorage.getItem(s);
    return n ? JSON.parse(n) : {
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
  async saveStats(e, a, o, s) {
    const n = this.getStatsKey(e, a, o);
    s.updatedAt = (/* @__PURE__ */ new Date()).toISOString(), localStorage.setItem(n, JSON.stringify(s));
  }
  // --- Boards Operations ---
  async getBoards(e, a) {
    const o = this.getBoardsKey(e, a), s = localStorage.getItem(o);
    if (s)
      return JSON.parse(s);
    const n = {
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
    return await this.saveBoards(e, n, a), n;
  }
  async saveBoards(e, a, o) {
    const s = this.getBoardsKey(e, o);
    a.updatedAt = (/* @__PURE__ */ new Date()).toISOString(), localStorage.setItem(s, JSON.stringify(a));
  }
  // --- Cleanup Operations ---
  async deleteBoardData(e, a, o) {
    const s = this.getTasksKey(e, a, o), n = this.getStatsKey(e, a, o);
    localStorage.removeItem(s), localStorage.removeItem(n);
  }
}
function Ft() {
  const t = Date.now().toString(36).toUpperCase().padStart(8, "0"), e = crypto.getRandomValues(new Uint8Array(18)), a = Array.from(e).map((o) => (o % 36).toString(36).toUpperCase()).join("");
  return t + a;
}
function ne() {
  return (/* @__PURE__ */ new Date()).toISOString();
}
function $e(t, e) {
  const a = t.tasks.findIndex((o) => o.id === e);
  if (a < 0)
    throw new Error("Task not found");
  return { task: t.tasks[a], index: a };
}
function Ce(t, e) {
  const a = t.boards.findIndex((o) => o.id === e);
  if (a < 0)
    throw new Error(`Board ${e} not found`);
  return { board: t.boards[a], index: a };
}
function Fe(t, e, a, o) {
  return {
    ...t,
    updatedAt: o,
    boards: [
      ...t.boards.slice(0, e),
      a,
      ...t.boards.slice(e + 1)
    ]
  };
}
function Mt(t, e, a) {
  return {
    ...t,
    updatedAt: a,
    counters: {
      ...t.counters,
      created: t.counters.created + 1
    },
    timeline: [
      ...t.timeline,
      { t: a, event: "created", id: e.id }
    ],
    tasks: {
      ...t.tasks,
      [e.id]: { ...e }
    }
  };
}
function Pt(t, e, a) {
  return {
    ...t,
    updatedAt: a,
    counters: {
      ...t.counters,
      completed: t.counters.completed + 1
    },
    timeline: [
      ...t.timeline,
      { t: a, event: "completed", id: e.id }
    ],
    tasks: {
      ...t.tasks,
      [e.id]: { ...e }
    }
  };
}
function Me(t, e, a) {
  return {
    ...t,
    updatedAt: a,
    counters: {
      ...t.counters,
      edited: t.counters.edited + 1
    },
    timeline: [
      ...t.timeline,
      { t: a, event: "edited", id: e.id }
    ],
    tasks: {
      ...t.tasks,
      [e.id]: { ...e }
    }
  };
}
function Rt(t, e, a) {
  return {
    ...t,
    updatedAt: a,
    counters: {
      ...t.counters,
      deleted: t.counters.deleted + 1
    },
    timeline: [
      ...t.timeline,
      { t: a, event: "deleted", id: e.id }
    ],
    tasks: {
      ...t.tasks,
      [e.id]: { ...e }
    }
  };
}
async function Ut(t, e) {
  const a = await t.getBoards(e.userType, e.userId), o = await Promise.all(
    a.boards.map(async (s) => {
      const n = await t.getTasks(e.userType, e.userId, s.id), i = await t.getStats(e.userType, e.userId, s.id);
      return {
        ...s,
        tasks: n.tasks,
        stats: i
      };
    })
  );
  return {
    ...a,
    boards: o
  };
}
async function Kt(t, e, a, o = "main") {
  const s = ne(), n = await t.getTasks(e.userType, e.userId, o), i = await t.getStats(e.userType, e.userId, o), c = a.id || Ft(), d = a.createdAt || s, p = {
    id: c,
    title: a.title,
    tag: a.tag ?? null,
    state: "Active",
    createdAt: d
  }, g = {
    ...n,
    tasks: [p, ...n.tasks],
    updatedAt: s
  }, w = Mt(i, p, s);
  return await t.saveTasks(e.userType, e.userId, o, g), await t.saveStats(e.userType, e.userId, o, w), { ok: !0, id: c };
}
async function Jt(t, e, a, o, s = "main") {
  const n = ne(), i = await t.getTasks(e.userType, e.userId, s), c = await t.getStats(e.userType, e.userId, s), { task: d, index: p } = $e(i, a), g = {
    ...d,
    ...o,
    updatedAt: n
  }, w = [...i.tasks];
  w[p] = g;
  const I = {
    ...i,
    tasks: w,
    updatedAt: n
  }, v = Me(c, g, n);
  return await t.saveTasks(e.userType, e.userId, s, I), await t.saveStats(e.userType, e.userId, s, v), { ok: !0, message: `Task ${a} updated` };
}
async function Wt(t, e, a, o = "main") {
  const s = ne(), n = await t.getTasks(e.userType, e.userId, o), i = await t.getStats(e.userType, e.userId, o), { task: c, index: d } = $e(n, a), p = {
    ...c,
    state: "Completed",
    closedAt: s,
    updatedAt: s
  }, g = [...n.tasks];
  g.splice(d, 1);
  const w = {
    ...n,
    tasks: g,
    updatedAt: s
  }, I = Pt(i, p, s);
  return await t.saveTasks(e.userType, e.userId, o, w), await t.saveStats(e.userType, e.userId, o, I), { ok: !0, message: `Task ${a} completed` };
}
async function Ht(t, e, a, o = "main") {
  const s = ne(), n = await t.getTasks(e.userType, e.userId, o), i = await t.getStats(e.userType, e.userId, o), { task: c, index: d } = $e(n, a), p = {
    ...c,
    state: "Deleted",
    closedAt: s,
    updatedAt: s
  }, g = [...n.tasks];
  g.splice(d, 1);
  const w = {
    ...n,
    tasks: g,
    updatedAt: s
  }, I = Rt(i, p, s);
  return await t.saveTasks(e.userType, e.userId, o, w), await t.saveStats(e.userType, e.userId, o, I), { ok: !0, message: `Task ${a} deleted` };
}
async function jt(t, e, a) {
  const o = ne(), s = await t.getBoards(e.userType, e.userId);
  if (s.boards.find((c) => c.id === a.id))
    throw new Error(`Board ${a.id} already exists`);
  const n = {
    id: a.id,
    name: a.name,
    tasks: [],
    tags: []
  }, i = {
    ...s,
    updatedAt: o,
    boards: [...s.boards, n]
  };
  return await t.saveBoards(e.userType, i, e.userId), { ok: !0, board: n };
}
async function Xt(t, e, a) {
  if (a === "main")
    throw new Error("Cannot delete the main board");
  const o = ne(), s = await t.getBoards(e.userType, e.userId);
  Ce(s, a);
  const n = {
    ...s,
    updatedAt: o,
    boards: s.boards.filter((i) => i.id !== a)
  };
  return await t.saveBoards(e.userType, n, e.userId), { ok: !0, message: `Board ${a} deleted` };
}
async function qt(t, e, a) {
  const o = ne(), s = await t.getBoards(e.userType, e.userId), { board: n, index: i } = Ce(s, a.boardId), c = n.tags || [];
  if (c.includes(a.tag))
    return { ok: !0, message: `Tag ${a.tag} already exists` };
  const d = {
    ...n,
    tags: [...c, a.tag]
  }, p = Fe(s, i, d, o);
  return await t.saveBoards(e.userType, p, e.userId), { ok: !0, message: `Tag ${a.tag} added to board ${a.boardId}` };
}
async function Vt(t, e, a) {
  const o = ne(), s = await t.getBoards(e.userType, e.userId), { board: n, index: i } = Ce(s, a.boardId), c = n.tags || [], d = {
    ...n,
    tags: c.filter((g) => g !== a.tag)
  }, p = Fe(s, i, d, o);
  return await t.saveBoards(e.userType, p, e.userId), { ok: !0, message: `Tag ${a.tag} removed from board ${a.boardId}` };
}
async function zt(t, e, a) {
  const o = ne(), s = await t.getTasks(e.userType, e.userId, a.boardId), n = await t.getStats(e.userType, e.userId, a.boardId);
  let i = 0;
  const c = s.tasks.map((g) => {
    const w = a.updates.find((I) => I.taskId === g.id);
    return w ? (i++, {
      ...g,
      tag: w.tag || void 0,
      updatedAt: o
    }) : g;
  }), d = {
    ...s,
    tasks: c,
    updatedAt: o
  };
  let p = n;
  for (const g of c)
    a.updates.find((w) => w.taskId === g.id) && (p = Me(p, g, o));
  return await t.saveTasks(e.userType, e.userId, a.boardId, d), await t.saveStats(e.userType, e.userId, a.boardId, p), {
    ok: !0,
    message: `Updated ${i} task(s) on board ${a.boardId}`,
    updated: i
  };
}
async function Yt(t, e, a) {
  const o = ne(), s = await t.getTasks(e.userType, e.userId, a.boardId), n = await t.getStats(e.userType, e.userId, a.boardId), i = await t.getBoards(e.userType, e.userId);
  let c = 0;
  const d = s.tasks.map((_) => {
    if (a.taskIds.includes(_.id) && _.tag) {
      const V = _.tag.split(" ").filter(Boolean).filter((R) => R !== a.tag);
      return c++, {
        ..._,
        tag: V.length > 0 ? V.join(" ") : void 0,
        updatedAt: o
      };
    }
    return _;
  }), p = {
    ...s,
    tasks: d,
    updatedAt: o
  };
  let g = n;
  for (const _ of d)
    a.taskIds.includes(_.id) && (g = Me(g, _, o));
  const { board: w, index: I } = Ce(i, a.boardId), v = w.tags || [], N = {
    ...w,
    tags: v.filter((_) => _ !== a.tag)
  }, F = Fe(i, I, N, o);
  return await t.saveTasks(e.userType, e.userId, a.boardId, p), await t.saveStats(e.userType, e.userId, a.boardId, g), await t.saveBoards(e.userType, F, e.userId), {
    ok: !0,
    message: `Cleared tag ${a.tag} from ${c} task(s) on board ${a.boardId}`,
    cleared: c
  };
}
function Q(t, e, a = 50) {
  setTimeout(() => {
    try {
      const o = new BroadcastChannel("tasks");
      o.postMessage({ type: t, ...e }), o.close();
    } catch (o) {
      console.error("[localStorageApi] Broadcast failed:", o);
    }
  }, a);
}
function Gt(t = "public", e = "public") {
  const a = new $t(t, e), o = { userType: "registered", userId: e };
  return {
    async getBoards() {
      const s = await Ut(a, o), n = {
        version: s.version,
        updatedAt: s.updatedAt,
        boards: []
      };
      for (const i of s.boards) {
        const c = await a.getTasks(t, e, i.id), d = await a.getStats(t, e, i.id);
        n.boards.push({
          id: i.id,
          name: i.name,
          tasks: c.tasks,
          stats: d,
          tags: i.tags || []
        });
      }
      return n;
    },
    async createBoard(s) {
      console.debug("[localStorageApi] createBoard (using handler)", { userType: t, userId: e, boardId: s });
      const n = await jt(
        a,
        o,
        { id: s, name: s }
      );
      return await a.saveTasks(t, e, s, {
        version: 1,
        updatedAt: (/* @__PURE__ */ new Date()).toISOString(),
        tasks: []
      }), await a.saveStats(t, e, s, {
        version: 2,
        updatedAt: (/* @__PURE__ */ new Date()).toISOString(),
        counters: { created: 0, completed: 0, edited: 0, deleted: 0 },
        timeline: [],
        tasks: {}
      }), Q("boards-updated", { sessionId: q, userType: t, userId: e }), n.board;
    },
    async deleteBoard(s) {
      await Xt(
        a,
        o,
        s
      ), await a.deleteBoardData(t, e, s), Q("boards-updated", { sessionId: q, userType: t, userId: e });
    },
    async getTasks(s = "main") {
      return a.getTasks(t, e, s);
    },
    async getStats(s = "main") {
      return a.getStats(t, e, s);
    },
    async createTask(s, n = "main", i = !1) {
      console.log("[localStorageApi] createTask (using handler)", { data: s, boardId: n, suppressBroadcast: i });
      const c = await Kt(
        a,
        o,
        s,
        n
      ), p = (await a.getTasks(t, e, n)).tasks.find((g) => g.id === c.id);
      if (!p)
        throw new Error("Task creation failed - task not found after creation");
      return i ? console.log("[localStorageApi] createTask: broadcast suppressed") : (console.log("[localStorageApi] createTask: broadcasting", {
        sessionId: q,
        boardId: n,
        taskId: c.id
      }), Q("tasks-updated", { sessionId: q, userType: t, userId: e, boardId: n })), p;
    },
    async patchTask(s, n, i = "main", c = !1) {
      const d = {};
      n.title !== void 0 && (d.title = n.title), n.tag !== void 0 && n.tag !== null && (d.tag = n.tag), await Jt(
        a,
        o,
        s,
        d,
        i
      ), c || Q("tasks-updated", { sessionId: q, userType: t, userId: e, boardId: i });
      const g = (await a.getTasks(t, e, i)).tasks.find((w) => w.id === s);
      if (!g)
        throw new Error("Task not found after update");
      return g;
    },
    async completeTask(s, n = "main") {
      const c = (await a.getTasks(t, e, n)).tasks.find((d) => d.id === s);
      if (!c)
        throw new Error("Task not found");
      return await Wt(
        a,
        o,
        s,
        n
      ), Q("tasks-updated", { sessionId: q, userType: t, userId: e, boardId: n }), {
        ...c,
        state: "Completed",
        closedAt: (/* @__PURE__ */ new Date()).toISOString(),
        updatedAt: (/* @__PURE__ */ new Date()).toISOString()
      };
    },
    async deleteTask(s, n = "main", i = !1) {
      console.log("[localStorageApi] deleteTask (using handler)", { id: s, boardId: n, suppressBroadcast: i });
      const d = (await a.getTasks(t, e, n)).tasks.find((p) => p.id === s);
      if (!d)
        throw new Error("Task not found");
      return await Ht(
        a,
        o,
        s,
        n
      ), i ? console.log("[localStorageApi] deleteTask: broadcast suppressed") : (console.log("[localStorageApi] deleteTask: broadcasting", { sessionId: q }), Q("tasks-updated", { sessionId: q, userType: t, userId: e, boardId: n })), {
        ...d,
        state: "Deleted",
        closedAt: (/* @__PURE__ */ new Date()).toISOString(),
        updatedAt: (/* @__PURE__ */ new Date()).toISOString()
      };
    },
    async createTag(s, n = "main") {
      await qt(
        a,
        o,
        { boardId: n, tag: s }
      ), Q("boards-updated", { sessionId: q, userType: t, userId: e, boardId: n });
    },
    async deleteTag(s, n = "main") {
      await Vt(
        a,
        o,
        { boardId: n, tag: s }
      ), Q("boards-updated", { sessionId: q, userType: t, userId: e, boardId: n });
    },
    // User preferences (server-synced settings only, NOT theme)
    async getPreferences() {
      const s = `${t}-${e}-preferences`, n = localStorage.getItem(s);
      if (n) {
        const i = JSON.parse(n), { theme: c, ...d } = i;
        return d;
      }
      return {
        version: 1,
        updatedAt: (/* @__PURE__ */ new Date()).toISOString()
      };
    },
    async savePreferences(s) {
      const n = `${t}-${e}-preferences`, c = {
        ...await this.getPreferences(),
        ...s,
        version: 1,
        updatedAt: (/* @__PURE__ */ new Date()).toISOString()
      };
      localStorage.setItem(n, JSON.stringify(c));
    },
    // Batch operations
    async batchMoveTasks(s, n, i) {
      const c = await this.getBoards(), d = c.boards.find((N) => N.id === s), p = c.boards.find((N) => N.id === n);
      if (!d)
        throw new Error(`Source board ${s} not found`);
      if (!p)
        throw new Error(`Target board ${n} not found`);
      const g = d.tasks.filter((N) => i.includes(N.id));
      d.tasks = d.tasks.filter((N) => !i.includes(N.id)), p.tasks = [...p.tasks, ...g], c.updatedAt = (/* @__PURE__ */ new Date()).toISOString();
      const w = `${t}-${e}-boards`;
      localStorage.setItem(w, JSON.stringify(c));
      const I = `${t}-${e}-${s}-tasks`, v = `${t}-${e}-${n}-tasks`;
      return localStorage.setItem(I, JSON.stringify({
        version: 1,
        updatedAt: c.updatedAt,
        tasks: d.tasks
      })), localStorage.setItem(v, JSON.stringify({
        version: 1,
        updatedAt: c.updatedAt,
        tasks: p.tasks
      })), Q("boards-updated", { sessionId: q, userType: t, userId: e }), { ok: !0, moved: g.length };
    },
    async batchUpdateTags(s, n) {
      console.log("[localStorageApi] batchUpdateTags", { boardId: s, updates: n }), await zt(
        a,
        o,
        { boardId: s, updates: n }
      ), Q("tasks-updated", { sessionId: q, userType: t, userId: e, boardId: s });
    },
    async batchClearTag(s, n, i) {
      console.log("[localStorageApi] batchClearTag START", { boardId: s, tag: n, taskIds: i, taskCount: i.length });
      const c = await Yt(
        a,
        o,
        { boardId: s, tag: n, taskIds: i }
      );
      console.log("[localStorageApi] batchClearTag result:", c), Q("boards-updated", { sessionId: q, userType: t, userId: e, boardId: s }), console.log("[localStorageApi] batchClearTag END");
    },
    // User Management (localStorage only - no-op for validation)
    async validateKey(s) {
      return !s || s.length < 10 ? (console.warn("[localStorageApi] validateKey: Key too short (must be at least 10 characters)"), !1) : !0;
    },
    async setUserId(s) {
      return { ok: !0 };
    }
  };
}
async function Zt(t, e, a, o) {
  for (const i of e.boards || []) {
    const c = i.id;
    if (i.tasks && i.tasks.length > 0) {
      const d = `${a}-${o}-${c}-tasks`, p = {
        version: 1,
        updatedAt: e.updatedAt || (/* @__PURE__ */ new Date()).toISOString(),
        tasks: i.tasks
      };
      window.localStorage.setItem(d, JSON.stringify(p));
    }
    if (i.stats) {
      const d = `${a}-${o}-${c}-stats`;
      window.localStorage.setItem(d, JSON.stringify(i.stats));
    }
  }
  const s = `${a}-${o}-boards`, n = {
    version: 1,
    updatedAt: e.updatedAt || (/* @__PURE__ */ new Date()).toISOString(),
    boards: (e.boards || []).map((i) => ({
      id: i.id,
      name: i.name,
      tags: i.tags || []
    }))
  };
  window.localStorage.setItem(s, JSON.stringify(n)), console.log("[api] Synced API data to localStorage:", {
    boards: e.boards?.length || 0,
    totalTasks: e.boards?.reduce((i, c) => i + (c.tasks?.length || 0), 0) || 0
  });
}
function X(t, e, a) {
  const o = {
    "Content-Type": "application/json",
    "X-User-Type": t
  };
  return e && (o["X-User-Id"] = e), a && (o["X-Session-Id"] = a), o;
}
function ye(t = "public", e = "public", a) {
  const o = Gt(t, e);
  return t === "public" ? o : {
    // Get boards - returns localStorage immediately (optimistic)
    async getBoards() {
      return await o.getBoards();
    },
    // Sync from API - called once on initial page load to get server state
    async syncFromApi() {
      try {
        console.log("[api] Syncing from API...");
        const s = await fetch(`/task/api/boards?userType=${t}&userId=${encodeURIComponent(e)}`, {
          headers: X(t, e, a)
        });
        if (!s.ok)
          throw new Error(`API returned ${s.status}`);
        const n = await s.json();
        if (!n || !n.boards || !Array.isArray(n.boards)) {
          console.error("[api] Invalid response structure:", n);
          return;
        }
        console.log("[api] Synced from API:", { boards: n.boards.length, totalTasks: n.boards.reduce((i, c) => i + (c.tasks?.length || 0), 0) }), await Zt(o, n, t, e);
      } catch (s) {
        console.error("[api] Sync from API failed:", s);
      }
    },
    async createTask(s, n = "main", i = !1) {
      const c = await o.createTask(s, n, i);
      return fetch("/task/api", {
        method: "POST",
        headers: X(t, e, a),
        body: JSON.stringify({
          id: s.id || c.id,
          // Use provided ID (for moves) or client-generated ID
          ...s,
          boardId: n
        })
      }).then((d) => d.json()).then((d) => {
        d.ok && (d.id === c.id ? console.log("[api] Background sync: createTask completed (ID matched)") : console.warn("[api] Server returned different ID (unexpected):", { client: c.id, server: d.id }));
      }).catch((d) => console.error("[api] Failed to sync createTask:", d)), c;
    },
    async createTag(s, n = "main") {
      const i = await o.createTag(s, n);
      return fetch("/task/api/tags", {
        method: "POST",
        headers: X(t, e, a),
        body: JSON.stringify({ boardId: n, tag: s })
      }).then(() => console.log("[api] Background sync: createTag completed")).catch((c) => console.error("[api] Failed to sync createTag:", c)), i;
    },
    async deleteTag(s, n = "main") {
      const i = await o.deleteTag(s, n);
      return fetch("/task/api/tags/delete", {
        method: "POST",
        headers: X(t, e, a),
        body: JSON.stringify({ boardId: n, tag: s })
      }).then(() => console.log("[api] Background sync: deleteTag completed")).catch((c) => console.error("[api] Failed to sync deleteTag:", c)), i;
    },
    async patchTask(s, n, i = "main", c = !1) {
      const d = await o.patchTask(s, n, i, c);
      return fetch(`/task/api/${s}`, {
        method: "PATCH",
        headers: X(t, e, a),
        body: JSON.stringify({ ...n, boardId: i })
      }).then(() => console.log("[api] Background sync: patchTask completed")).catch((p) => console.error("[api] Failed to sync patchTask:", p)), d;
    },
    async completeTask(s, n = "main") {
      const i = await o.completeTask(s, n);
      return fetch(`/task/api/${s}/complete`, {
        method: "POST",
        headers: X(t, e, a),
        body: JSON.stringify({ boardId: n })
      }).then((c) => {
        if (!c.ok) throw new Error(`HTTP ${c.status}`);
        console.log("[api] Background sync: completeTask completed");
      }).catch((c) => console.error("[api] Failed to sync completeTask:", c)), i;
    },
    async deleteTask(s, n = "main", i = !1) {
      await o.deleteTask(s, n, i), fetch(`/task/api/${s}`, {
        method: "DELETE",
        headers: X(t, e, a),
        body: JSON.stringify({ boardId: n })
      }).then((c) => {
        if (!c.ok) throw new Error(`HTTP ${c.status}`);
        console.log("[api] Background sync: deleteTask completed");
      }).catch((c) => console.error("[api] Failed to sync deleteTask:", c));
    },
    // Board operations
    async createBoard(s) {
      const n = await o.createBoard(s);
      return fetch("/task/api/boards", {
        method: "POST",
        headers: X(t, e, a),
        body: JSON.stringify({ id: s, name: s })
      }).then(() => console.log("[api] Background sync: createBoard completed")).catch((i) => console.error("[api] Failed to sync createBoard:", i)), n;
    },
    async deleteBoard(s) {
      const n = await o.deleteBoard(s);
      return fetch(`/task/api/boards/${encodeURIComponent(s)}`, {
        method: "DELETE",
        headers: X(t, e, a)
      }).then(() => console.log("[api] Background sync: deleteBoard completed")).catch((i) => console.error("[api] Failed to sync deleteBoard:", i)), n;
    },
    // User preferences
    async getPreferences() {
      try {
        const s = await fetch("/task/api/preferences", {
          headers: X(t, e, a)
        });
        if (s.ok) {
          const n = await s.json();
          return await o.savePreferences(n), console.log("[api] Synced preferences from server"), n;
        }
      } catch (s) {
        console.warn("[api] Failed to fetch preferences from server, using localStorage:", s);
      }
      return await o.getPreferences();
    },
    async savePreferences(s) {
      await o.savePreferences(s), fetch("/task/api/preferences", {
        method: "PUT",
        headers: X(t, e, a),
        body: JSON.stringify(s)
      }).then(() => console.log("[api] Background sync: savePreferences completed")).catch((n) => console.error("[api] Failed to sync savePreferences:", n));
    },
    // Batch operations
    async batchUpdateTags(s, n) {
      await o.batchUpdateTags(s, n), fetch("/task/api/batch-tag", {
        method: "PATCH",
        headers: X(t, e, a),
        body: JSON.stringify({ boardId: s, updates: n })
      }).then(() => console.log("[api] Background sync: batchUpdateTags completed")).catch((i) => console.error("[api] Failed to sync batchUpdateTags:", i));
    },
    async batchMoveTasks(s, n, i) {
      const c = await o.batchMoveTasks(s, n, i);
      return fetch("/task/api/batch-move", {
        method: "POST",
        headers: X(t, e, a),
        body: JSON.stringify({ sourceBoardId: s, targetBoardId: n, taskIds: i })
      }).then(() => console.log("[api] Background sync: batchMoveTasks completed")).catch((d) => console.error("[api] Failed to sync batchMoveTasks:", d)), c;
    },
    async batchClearTag(s, n, i) {
      await o.batchClearTag(s, n, i), fetch("/task/api/batch-clear-tag", {
        method: "POST",
        headers: X(t, e, a),
        body: JSON.stringify({ boardId: s, tag: n, taskIds: i })
      }).then(() => console.log("[api] Background sync: batchClearTag completed")).catch((c) => console.error("[api] Failed to sync batchClearTag:", c));
    },
    // User Management
    async validateKey(s) {
      try {
        return (await fetch("/task/api/validate-key", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-User-Type": t,
            "X-User-Id": e,
            "X-Session-Id": s
          }
        })).ok;
      } catch (n) {
        return console.error("[api] Failed to validate key:", n), !1;
      }
    },
    async setUserId(s) {
      try {
        return await (await fetch("/task/api/user/set-id", {
          method: "POST",
          headers: X(t, e, a),
          body: JSON.stringify({ newUserId: s })
        })).json();
      } catch (n) {
        return console.error("[api] Failed to set userId:", n), { ok: !1, message: "Failed to set userId" };
      }
    }
  };
}
function Qt(t) {
  t = t.trim();
  const e = (s) => s.trim().replace(/\s+/g, "-"), a = t.match(/^["']([^"']+)["']\s*(.*)$/);
  if (a) {
    const s = a[1].trim(), i = a[2].match(/#[^\s#]+/g)?.map((c) => e(c.slice(1))).filter(Boolean) || [];
    return { title: s, tag: i.length ? i.join(" ") : void 0 };
  }
  const o = t.match(/^(.+?)\s+(#.+)$/);
  if (o) {
    const s = o[1].trim(), i = o[2].match(/#[^\s#]+/g)?.map((c) => e(c.slice(1))).filter(Boolean) || [];
    return { title: s, tag: i.length ? i.join(" ") : void 0 };
  }
  return { title: t.trim() };
}
function ea(t, e = 6, a = []) {
  const o = t.flatMap((n) => n.tag?.split(" ") || []).filter(Boolean), s = {};
  return o.forEach((n) => s[n] = (s[n] || 0) + 1), a.filter(Boolean).forEach((n) => {
    s[n] || (s[n] = 0);
  }), Object.entries(s).sort((n, i) => i[1] - n[1]).slice(0, e).map(([n]) => n);
}
function Ye(t, e) {
  return t.filter((a) => a.tag?.split(" ").includes(e));
}
function ta(t, e, a) {
  const o = Array.isArray(a) && a.length > 0;
  return t.filter((s) => {
    const n = s.tag?.split(" ") || [];
    return o ? a.some((c) => n.includes(c)) && !e.some((c) => n.includes(c)) : !e.some((i) => n.includes(i));
  });
}
function Ee(t) {
  return Array.from(new Set(t.flatMap((e) => e.tag?.split(" ") || []).filter(Boolean)));
}
async function Ge(t, e, a, o, s = {}) {
  const { onError: n, suppress404: i = !0 } = s;
  if (e.has(t)) {
    console.log(`[withPendingOperation] Operation already pending: ${t}`);
    return;
  }
  a((c) => /* @__PURE__ */ new Set([...c, t]));
  try {
    return await o();
  } catch (c) {
    i && c?.message?.includes("404") || (n ? n(c) : console.error(`[withPendingOperation] Error in ${t}:`, c));
    return;
  } finally {
    a((c) => {
      const d = new Set(c);
      return d.delete(t), d;
    });
  }
}
function ke(t, e) {
  const a = t?.boards?.find((o) => o.id === e);
  return a ? (console.log(`[extractBoardTasks] Found board ${e}`, {
    taskCount: a.tasks?.length || 0
  }), {
    tasks: (a.tasks || []).filter((o) => o.state === "Active"),
    foundBoard: !0
  }) : (console.log(`[extractBoardTasks] Board not found: ${e}`), {
    tasks: [],
    foundBoard: !1
  });
}
function aa({ userType: t, userId: e, sessionId: a }) {
  const [o, s] = B([]), [n, i] = B(/* @__PURE__ */ new Set()), c = dt(
    () => ye(t, e || "public", a),
    [t, e, a]
  ), [d, p] = B(null), [g, w] = B("main");
  async function I() {
    console.log("[useTasks] initialLoad called"), "syncFromApi" in c && await c.syncFromApi(), await v();
  }
  async function v() {
    console.log("[useTasks] reload called", { currentBoardId: g, stack: new Error().stack?.split(`
`).slice(1, 4).join(`
`) });
    const m = await c.getBoards();
    p(m);
    const { tasks: y } = ke(m, g);
    s(y);
  }
  W(() => {
    console.log("[useTasks] User context changed, clearing state and reloading", { userType: t, userId: e }), s([]), i(/* @__PURE__ */ new Set()), p(null), w("main"), v();
  }, [t, e]), W(() => {
    console.log("[useTasks] Setting up BroadcastChannel listener", { currentBoardId: g, userType: t, userId: e });
    try {
      const m = new BroadcastChannel("tasks");
      return m.onmessage = (y) => {
        const u = y.data || {};
        if (console.log("[useTasks] BroadcastChannel message received", { msg: u, sessionId: q, currentBoardId: g, currentContext: { userType: t, userId: e } }), u.sessionId === q) {
          console.log("[useTasks] Ignoring own broadcast message");
          return;
        }
        if (u.userType !== t || u.userId !== e) {
          console.log("[useTasks] Ignoring message for different user context", {
            msgContext: { userType: u.userType, userId: u.userId },
            currentContext: { userType: t, userId: e }
          });
          return;
        }
        (u.type === "tasks-updated" || u.type === "boards-updated") && (console.log("[useTasks] BroadcastChannel: triggering reload for currentBoardId =", g), v());
      }, () => {
        console.log("[useTasks] Cleaning up BroadcastChannel listener", { currentBoardId: g }), m.close();
      };
    } catch (m) {
      console.error("[useTasks] Failed to setup BroadcastChannel", m);
    }
  }, [g, t, e]);
  async function N(m) {
    if (m = m.trim(), !!m)
      try {
        const y = Qt(m);
        return await c.createTask(y, g), await v(), !0;
      } catch (y) {
        return alert(y.message || "Failed to create task"), !1;
      }
  }
  async function F(m) {
    await Ge(
      `complete-${m}`,
      n,
      i,
      async () => {
        await c.completeTask(m, g), await v();
      },
      {
        onError: (y) => alert(y.message || "Failed to complete task")
      }
    );
  }
  async function _(m) {
    console.log("[useTasks] deleteTask START", { taskId: m, currentBoardId: g }), await Ge(
      `delete-${m}`,
      n,
      i,
      async () => {
        console.log("[useTasks] deleteTask: calling api.deleteTask", { taskId: m, currentBoardId: g }), await c.deleteTask(m, g), console.log("[useTasks] deleteTask: calling reload"), await v(), console.log("[useTasks] deleteTask END");
      },
      {
        onError: (y) => alert(y.message || "Failed to delete task")
      }
    );
  }
  async function j(m) {
    const y = prompt("Enter tag (without #):");
    if (!y) return;
    const u = y.trim().replace(/^#+/, "").replace(/\s+/g, "-"), h = o.find((A) => A.id === m);
    if (!h) return;
    const S = h.tag?.split(" ") || [];
    if (S.includes(u)) return;
    const b = [...S, u].join(" ");
    try {
      await c.patchTask(m, { tag: b }, g), await v();
    } catch (A) {
      alert(A.message || "Failed to add tag");
    }
  }
  async function V(m, y, u = {}) {
    const { suppressBroadcast: h = !1, skipReload: S = !1 } = u;
    try {
      await c.patchTask(m, y, g, h), S || await v();
    } catch (b) {
      throw b;
    }
  }
  async function R(m) {
    console.log("[useTasks] bulkUpdateTaskTags START", { count: m.length });
    try {
      await c.batchUpdateTags(
        g,
        m.map((y) => ({ taskId: y.taskId, tag: y.tag || null }))
      ), console.log("[useTasks] bulkUpdateTaskTags: calling reload"), await v(), console.log("[useTasks] bulkUpdateTaskTags END");
    } catch (y) {
      throw console.error("[useTasks] bulkUpdateTaskTags ERROR", y), y;
    }
  }
  async function M(m) {
    console.log("[useTasks] deleteTag START", { tag: m, currentBoardId: g, taskCount: o.length });
    const y = o.filter((u) => u.tag?.split(" ").includes(m));
    if (console.log("[useTasks] deleteTag: found tasks with tag", { tag: m, count: y.length }), y.length === 0) {
      console.log("[useTasks] deleteTag: no tasks found with this tag, just deleting tag");
      try {
        await c.deleteTag(m, g), await v(), console.log("[useTasks] deleteTag END (no tasks to clear)");
      } catch (u) {
        console.error("[useTasks] deleteTag ERROR", u), console.error("[useTasks] deleteTag: Please fix this error:", u.message);
      }
      return;
    }
    try {
      console.log("[useTasks] deleteTag: starting batch clear"), await c.batchClearTag(
        g,
        m,
        y.map((u) => u.id)
      ), console.log("[useTasks] deleteTag: calling reload"), await v(), console.log("[useTasks] deleteTag END");
    } catch (u) {
      console.error("[useTasks] deleteTag ERROR", u), alert(u.message || "Failed to remove tag from tasks");
    }
  }
  async function z(m) {
    await c.createBoard(m), w(m);
    const y = await c.getBoards();
    p(y);
    const { tasks: u } = ke(y, m);
    s(u);
  }
  async function H(m, y) {
    if (console.log("[useTasks] moveTasksToBoard START", { targetBoardId: m, ids: y, currentBoardId: g }), !d) return;
    const u = /* @__PURE__ */ new Set();
    for (const h of d.boards)
      for (const S of h.tasks || [])
        y.includes(S.id) && u.add(h.id);
    console.log("[useTasks] moveTasksToBoard: source boards", { sourceBoardIds: Array.from(u) });
    try {
      if (u.size === 1) {
        const b = Array.from(u)[0];
        console.log("[useTasks] moveTasksToBoard: using batch API"), await c.batchMoveTasks(b, m, y);
      } else
        throw console.error("[useTasks] moveTasksToBoard: Cannot move tasks from multiple boards at once"), new Error("Cannot move tasks from multiple boards at once");
      console.log("[useTasks] moveTasksToBoard: switching to target board", { targetBoardId: m }), w(m);
      const h = await c.getBoards();
      p(h);
      const { tasks: S } = ke(h, m);
      s(S), console.log("[useTasks] moveTasksToBoard END");
    } catch (h) {
      console.error("[useTasks] moveTasksToBoard ERROR", h), alert(h.message || "Failed to move tasks");
    }
  }
  async function G(m) {
    if (await c.deleteBoard(m), g === m) {
      w("main");
      const y = await c.getBoards();
      p(y);
      const { tasks: u } = ke(y, "main");
      s(u);
    } else
      await v();
  }
  async function de(m) {
    await c.createTag(m, g), await v();
  }
  async function ee(m) {
    await c.deleteTag(m, g), await v();
  }
  function Z(m) {
    w(m);
    const { tasks: y, foundBoard: u } = ke(d, m);
    u ? s(y) : v();
  }
  return {
    // Task state
    tasks: o,
    pendingOperations: n,
    // Task operations
    addTask: N,
    completeTask: F,
    deleteTask: _,
    addTagToTask: j,
    updateTaskTags: V,
    bulkUpdateTaskTags: R,
    deleteTag: M,
    // Board state
    boards: d,
    currentBoardId: g,
    // Board operations
    createBoard: z,
    deleteBoard: G,
    switchBoard: Z,
    moveTasksToBoard: H,
    createTagOnBoard: de,
    deleteTagOnBoard: ee,
    // Lifecycle
    initialLoad: I,
    reload: v
  };
}
function sa({ tasks: t, onTaskUpdate: e, onBulkUpdate: a }) {
  const [o, s] = B(null), [n, i] = B(null), [c, d] = B(/* @__PURE__ */ new Set()), [p, g] = B(!1), [w, I] = B(null), [v, N] = B(null), F = we(null);
  function _(u) {
    let h = [];
    try {
      const S = u.dataTransfer.getData("application/x-hadoku-task-ids");
      S && (h = JSON.parse(S));
    } catch {
    }
    if (h.length === 0) {
      const S = u.dataTransfer.getData("text/plain");
      S && (h = [S]);
    }
    return h;
  }
  function j(u, h) {
    const S = c.has(h) && c.size > 0 ? Array.from(c) : [h];
    console.log("[useDragAndDrop] onDragStart", { taskId: h, idsToDrag: S, selectedCount: c.size }), u.dataTransfer.setData("text/plain", S[0]);
    try {
      u.dataTransfer.setData("application/x-hadoku-task-ids", JSON.stringify(S));
    } catch {
    }
    u.dataTransfer.effectAllowed = "copyMove";
    try {
      const b = u.currentTarget, A = b.closest && b.closest(".task-app__item") ? b.closest(".task-app__item") : b;
      A.classList.add("dragging");
      const D = A.cloneNode(!0);
      D.style.boxSizing = "border-box", D.style.width = `${A.offsetWidth}px`, D.style.height = `${A.offsetHeight}px`, D.style.opacity = "0.95", D.style.transform = "none", D.style.filter = "drop-shadow(0 6px 18px rgba(0,0,0,0.12))", D.classList.add("drag-image"), D.style.position = "absolute", D.style.top = "-9999px", D.style.left = "-9999px", document.body.appendChild(D), A.__dragImage = D, d((O) => {
        if (O.has(h)) return new Set(O);
        const E = new Set(O);
        return E.add(h), E;
      });
      try {
        const O = A.closest(".task-app__tag-column");
        if (O) {
          const E = O.querySelector(".task-app__tag-header") || O.querySelector("h3"), T = (E && E.textContent || "").trim().replace(/^#/, "");
          if (T)
            try {
              u.dataTransfer.setData("application/x-hadoku-task-source", T);
            } catch {
            }
        }
      } catch {
      }
      try {
        const O = A.getBoundingClientRect();
        let E = Math.round(u.clientX - O.left), P = Math.round(u.clientY - O.top);
        E = Math.max(0, Math.min(Math.round(D.offsetWidth - 1), E)), P = Math.max(0, Math.min(Math.round(D.offsetHeight - 1), P)), u.dataTransfer.setDragImage(D, E, P);
      } catch {
        u.dataTransfer.setDragImage(D, 0, 0);
      }
    } catch {
    }
  }
  function V(u) {
    try {
      const h = u.currentTarget;
      h.classList.remove("dragging");
      const S = h.__dragImage;
      S && S.parentNode && S.parentNode.removeChild(S), S && delete h.__dragImage;
    } catch {
    }
    try {
      H();
    } catch {
    }
  }
  function R(u) {
    if (u.button === 0) {
      try {
        const h = u.target;
        if (!h || h.closest && h.closest(".task-app__item, .task-app__controls, button, input, textarea, .task-app__item-actions"))
          return;
      } catch {
      }
      g(!0), F.current = { x: u.clientX, y: u.clientY }, I({ x: u.clientX, y: u.clientY, w: 0, h: 0 }), d(/* @__PURE__ */ new Set());
      try {
        document.body.classList.add("marquee-selecting");
      } catch {
      }
    }
  }
  function M(u) {
    if (!p || !F.current) return;
    const h = F.current.x, S = F.current.y, b = u.clientX, A = u.clientY, D = Math.min(h, b), O = Math.min(S, A), E = Math.abs(b - h), P = Math.abs(A - S);
    I({ x: D, y: O, w: E, h: P });
    const T = Array.from(document.querySelectorAll(".task-app__item")), U = /* @__PURE__ */ new Set();
    for (const L of T) {
      const K = L.getBoundingClientRect();
      if (!(K.right < D || K.left > D + E || K.bottom < O || K.top > O + P)) {
        const le = L.getAttribute("data-task-id");
        le && U.add(le), L.classList.add("selected");
      } else
        L.classList.remove("selected");
    }
    d(U);
  }
  function z(u) {
    g(!1), I(null), F.current = null;
    try {
      document.body.classList.remove("marquee-selecting");
    } catch {
    }
    try {
      N(Date.now());
    } catch {
    }
  }
  function H() {
    d(/* @__PURE__ */ new Set()), Array.from(document.querySelectorAll(".task-app__item.selected")).forEach((h) => h.classList.remove("selected"));
  }
  W(() => {
    function u(b) {
      if (b.button !== 0) return;
      const A = { target: b.target, clientX: b.clientX, clientY: b.clientY, button: b.button };
      try {
        R(A);
      } catch {
      }
    }
    function h(b) {
      const A = { clientX: b.clientX, clientY: b.clientY };
      try {
        M(A);
      } catch {
      }
    }
    function S(b) {
      const A = { clientX: b.clientX, clientY: b.clientY };
      try {
        z(A);
      } catch {
      }
    }
    return document.addEventListener("mousedown", u), document.addEventListener("mousemove", h), document.addEventListener("mouseup", S), () => {
      document.removeEventListener("mousedown", u), document.removeEventListener("mousemove", h), document.removeEventListener("mouseup", S);
    };
  }, []);
  function G(u, h) {
    u.preventDefault(), u.dataTransfer.dropEffect = "copy", s(h);
  }
  function de(u) {
    u.currentTarget.contains(u.relatedTarget) || s(null);
  }
  async function ee(u, h) {
    u.preventDefault(), s(null), console.log("[useDragAndDrop] onDrop START", { targetTag: h });
    const S = _(u);
    if (S.length === 0) return;
    let b = null;
    try {
      const D = u.dataTransfer.getData("application/x-hadoku-task-source");
      D && (b = D);
    } catch {
    }
    console.log("[useDragAndDrop] onDrop: processing", { targetTag: h, ids: S, srcTag: b, taskCount: S.length });
    const A = [];
    for (const D of S) {
      const O = t.find((L) => L.id === D);
      if (!O) continue;
      const E = O.tag?.split(" ").filter(Boolean) || [];
      if (h === "other") {
        if (E.length === 0) continue;
        A.push({ taskId: D, tag: "" });
        continue;
      }
      const P = E.includes(h);
      let T = E.slice();
      P || T.push(h), b && b !== h && (T = T.filter((L) => L !== b));
      const U = T.join(" ").trim();
      A.push({ taskId: D, tag: U });
    }
    console.log("[useDragAndDrop] onDrop: updating tasks", { updateCount: A.length });
    try {
      await a(A), console.log("[useDragAndDrop] onDrop: updates complete, clearing selection");
      try {
        H();
      } catch {
      }
    } catch (D) {
      console.error("Failed to add tag to one or more tasks:", D), alert(D.message || "Failed to add tags");
    }
    console.log("[useDragAndDrop] onDrop END");
  }
  function Z(u, h) {
    u.preventDefault(), u.dataTransfer.dropEffect = "copy", i(h);
  }
  function m(u) {
    u.currentTarget.contains(u.relatedTarget) || i(null);
  }
  async function y(u, h) {
    u.preventDefault(), i(null);
    const S = _(u);
    if (S.length === 0) return;
    console.log("[useDragAndDrop] onFilterDrop", { filterTag: h, ids: S, taskCount: S.length });
    const b = [];
    for (const A of S) {
      const D = t.find((P) => P.id === A);
      if (!D) continue;
      const O = D.tag?.split(" ").filter(Boolean) || [];
      if (O.includes(h)) {
        console.log(`Task ${A} already has tag: ${h}`);
        continue;
      }
      const E = [...O, h].join(" ");
      b.push({ taskId: A, tag: E });
    }
    if (b.length === 0) {
      console.log("No updates needed - all tasks already have this tag");
      return;
    }
    console.log(`Adding tag "${h}" to ${b.length} task(s) via filter drop`);
    try {
      await a(b);
      try {
        H();
      } catch {
      }
    } catch (A) {
      console.error("Failed to add tag via filter drop:", A), alert(A.message || "Failed to add tag");
    }
  }
  return {
    dragOverTag: o,
    dragOverFilter: n,
    setDragOverFilter: i,
    selectedIds: c,
    isSelecting: p,
    marqueeRect: w,
    selectionJustEndedAt: v,
    // selection handlers
    selectionStartHandler: R,
    selectionMoveHandler: M,
    selectionEndHandler: z,
    clearSelection: H,
    onDragStart: j,
    onDragEnd: V,
    onDragOver: G,
    onDragLeave: de,
    onDrop: ee,
    onFilterDragOver: Z,
    onFilterDragLeave: m,
    onFilterDrop: y
  };
}
function na() {
  const [t, e] = B({});
  function a(i) {
    e((c) => {
      const p = (c[i] || "desc") === "desc" ? "asc" : "desc";
      return { ...c, [i]: p };
    });
  }
  function o(i, c) {
    return [...i].sort((d, p) => {
      const g = new Date(d.createdAt).getTime(), w = new Date(p.createdAt).getTime();
      return c === "asc" ? g - w : w - g;
    });
  }
  function s(i) {
    return i === "asc" ? "↑" : "↓";
  }
  function n(i) {
    return i === "asc" ? "Sorted by age (oldest first) - click to sort newest first" : "Sorted by age (newest first) - click to sort oldest first";
  }
  return {
    sortDirections: t,
    toggleSort: a,
    sortTasksByAge: o,
    getSortIcon: s,
    getSortTitle: n
  };
}
function ut({ onLongPress: t, delay: e = 500 }) {
  const a = we(null);
  return {
    onTouchStart: (i) => {
      const c = i.touches[0];
      a.current = window.setTimeout(() => {
        t(c.clientX, c.clientY);
      }, e);
    },
    onTouchEnd: () => {
      a.current && (clearTimeout(a.current), a.current = null);
    },
    onTouchMove: () => {
      a.current && (clearTimeout(a.current), a.current = null);
    }
  };
}
function Oe(t) {
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
function oa({
  board: t,
  isActive: e,
  isDragOver: a,
  onSwitch: o,
  onContextMenu: s,
  onDragOverFilter: n,
  onMoveTasksToBoard: i,
  onClearSelection: c
}) {
  const d = ut({
    onLongPress: (g, w) => s(t.id, g, w)
  }), p = t.id === "main";
  return /* @__PURE__ */ r(
    "button",
    {
      className: `board-btn ${e ? "board-btn--active" : ""} ${a ? "board-btn--drag-over" : ""}`,
      onClick: () => o(t.id),
      onContextMenu: (g) => {
        g.preventDefault(), !p && s(t.id, g.clientX, g.clientY);
      },
      ...p ? {} : d,
      "aria-pressed": e ? "true" : "false",
      onDragOver: (g) => {
        g.preventDefault(), g.dataTransfer.dropEffect = "move", n(`board:${t.id}`);
      },
      onDragLeave: (g) => {
        n(null);
      },
      onDrop: async (g) => {
        g.preventDefault(), n(null);
        const w = Oe(g.dataTransfer);
        if (w.length !== 0)
          try {
            await i(t.id, w);
            try {
              c();
            } catch {
            }
          } catch (I) {
            console.error("Failed moving tasks to board", I), alert(I.message || "Failed to move tasks");
          }
      },
      children: t.name
    }
  );
}
function ra({
  tag: t,
  isActive: e,
  isDragOver: a,
  onToggle: o,
  onContextMenu: s,
  onDragOver: n,
  onDragLeave: i,
  onDrop: c
}) {
  const d = ut({
    onLongPress: (p, g) => s(t, p, g)
  });
  return /* @__PURE__ */ k(
    "button",
    {
      onClick: () => o(t),
      onContextMenu: (p) => {
        p.preventDefault(), s(t, p.clientX, p.clientY);
      },
      ...d,
      className: `${e ? "on" : ""} ${a ? "task-app__filter-drag-over" : ""}`,
      onDragOver: (p) => n(p, t),
      onDragLeave: i,
      onDrop: (p) => c(p, t),
      children: [
        "#",
        t
      ]
    }
  );
}
function ia(t) {
  const e = /* @__PURE__ */ new Date(), a = new Date(t), o = e.getTime() - a.getTime(), s = Math.floor(o / 1e3), n = Math.floor(s / 60), i = Math.floor(n / 60), c = Math.floor(i / 24);
  return s < 60 ? `${s}s ago` : n < 60 ? `${n}m ago` : i < 24 ? `${i}h ago` : `${c}d ago`;
}
const oe = {
  width: 20,
  height: 20,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round"
}, ca = () => /* @__PURE__ */ k("svg", { ...oe, children: [
  /* @__PURE__ */ r("circle", { cx: "12", cy: "12", r: "5" }),
  /* @__PURE__ */ r("line", { x1: "12", y1: "1", x2: "12", y2: "3" }),
  /* @__PURE__ */ r("line", { x1: "12", y1: "21", x2: "12", y2: "23" }),
  /* @__PURE__ */ r("line", { x1: "4.22", y1: "4.22", x2: "5.64", y2: "5.64" }),
  /* @__PURE__ */ r("line", { x1: "18.36", y1: "18.36", x2: "19.78", y2: "19.78" }),
  /* @__PURE__ */ r("line", { x1: "1", y1: "12", x2: "3", y2: "12" }),
  /* @__PURE__ */ r("line", { x1: "21", y1: "12", x2: "23", y2: "12" }),
  /* @__PURE__ */ r("line", { x1: "4.22", y1: "19.78", x2: "5.64", y2: "18.36" }),
  /* @__PURE__ */ r("line", { x1: "18.36", y1: "5.64", x2: "19.78", y2: "4.22" })
] }), gt = () => /* @__PURE__ */ r("svg", { ...oe, children: /* @__PURE__ */ r("path", { d: "M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" }) }), Ze = () => /* @__PURE__ */ k("svg", { ...oe, children: [
  /* @__PURE__ */ r("path", { d: "M12 21 C12 21 6.5 15 6.5 11 C6.5 8.5 8 7 10 7 C11 7 12 7.5 12 7.5 C12 7.5 13 7 14 7 C16 7 17.5 8.5 17.5 11 C17.5 15 12 21 12 21 Z", fill: "currentColor" }),
  /* @__PURE__ */ r("path", { d: "M9.5 7.5 L9 5 L11 5.5 Z", fill: "currentColor" }),
  /* @__PURE__ */ r("path", { d: "M14.5 7.5 L15 5 L13 5.5 Z", fill: "currentColor" }),
  /* @__PURE__ */ r("path", { d: "M12 7.5 L12 4 L12 5", stroke: "currentColor", strokeWidth: "1.5", fill: "none" }),
  /* @__PURE__ */ r("line", { x1: "10", y1: "10", x2: "10", y2: "11", stroke: "currentColor", strokeWidth: "1", opacity: "0.4" }),
  /* @__PURE__ */ r("line", { x1: "14", y1: "10", x2: "14", y2: "11", stroke: "currentColor", strokeWidth: "1", opacity: "0.4" }),
  /* @__PURE__ */ r("line", { x1: "9", y1: "13", x2: "9", y2: "14", stroke: "currentColor", strokeWidth: "1", opacity: "0.4" }),
  /* @__PURE__ */ r("line", { x1: "15", y1: "13", x2: "15", y2: "14", stroke: "currentColor", strokeWidth: "1", opacity: "0.4" }),
  /* @__PURE__ */ r("line", { x1: "11", y1: "16", x2: "11", y2: "17", stroke: "currentColor", strokeWidth: "1", opacity: "0.4" }),
  /* @__PURE__ */ r("line", { x1: "13", y1: "16", x2: "13", y2: "17", stroke: "currentColor", strokeWidth: "1", opacity: "0.4" })
] }), Qe = () => /* @__PURE__ */ k("svg", { ...oe, children: [
  /* @__PURE__ */ r("path", { d: "M2 12c2-2 4-2 6 0s4 2 6 0 4-2 6 0" }),
  /* @__PURE__ */ r("path", { d: "M2 17c2-2 4-2 6 0s4 2 6 0 4-2 6 0" }),
  /* @__PURE__ */ r("path", { d: "M2 7c2-2 4-2 6 0s4 2 6 0 4-2 6 0" })
] }), et = () => /* @__PURE__ */ r("svg", { ...oe, children: /* @__PURE__ */ r("polygon", { points: "13 2 3 14 12 14 11 22 21 10 12 10 13 2" }) }), tt = () => /* @__PURE__ */ k("svg", { ...oe, children: [
  /* @__PURE__ */ r("path", { d: "M18 8h1a4 4 0 0 1 0 8h-1" }),
  /* @__PURE__ */ r("path", { d: "M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" }),
  /* @__PURE__ */ r("line", { x1: "6", y1: "1", x2: "6", y2: "4" }),
  /* @__PURE__ */ r("line", { x1: "10", y1: "1", x2: "10", y2: "4" }),
  /* @__PURE__ */ r("line", { x1: "14", y1: "1", x2: "14", y2: "4" })
] }), at = () => /* @__PURE__ */ k("svg", { ...oe, children: [
  /* @__PURE__ */ r("circle", { cx: "12", cy: "12", r: "2", fill: "currentColor" }),
  /* @__PURE__ */ r("circle", { cx: "12", cy: "6", r: "2.5", fill: "none", stroke: "currentColor", strokeWidth: "2" }),
  /* @__PURE__ */ r("circle", { cx: "18", cy: "10", r: "2.5", fill: "none", stroke: "currentColor", strokeWidth: "2" }),
  /* @__PURE__ */ r("circle", { cx: "16", cy: "16", r: "2.5", fill: "none", stroke: "currentColor", strokeWidth: "2" }),
  /* @__PURE__ */ r("circle", { cx: "8", cy: "16", r: "2.5", fill: "none", stroke: "currentColor", strokeWidth: "2" }),
  /* @__PURE__ */ r("circle", { cx: "6", cy: "10", r: "2.5", fill: "none", stroke: "currentColor", strokeWidth: "2" })
] }), st = () => /* @__PURE__ */ r("svg", { ...oe, children: /* @__PURE__ */ r("path", { d: "M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z", fill: "currentColor" }) }), la = () => /* @__PURE__ */ k("svg", { ...oe, children: [
  /* @__PURE__ */ r("rect", { x: "11", y: "1", width: "2", height: "3", fill: "currentColor" }),
  /* @__PURE__ */ r("rect", { x: "16.5", y: "3.5", width: "3", height: "2", fill: "currentColor", transform: "rotate(45 18 4.5)" }),
  /* @__PURE__ */ r("rect", { x: "19", y: "11", width: "3", height: "2", fill: "currentColor" }),
  /* @__PURE__ */ r("rect", { x: "16.5", y: "18.5", width: "3", height: "2", fill: "currentColor", transform: "rotate(-45 18 19.5)" }),
  /* @__PURE__ */ r("rect", { x: "11", y: "20", width: "2", height: "3", fill: "currentColor" }),
  /* @__PURE__ */ r("rect", { x: "4.5", y: "18.5", width: "3", height: "2", fill: "currentColor", transform: "rotate(45 6 19.5)" }),
  /* @__PURE__ */ r("rect", { x: "2", y: "11", width: "3", height: "2", fill: "currentColor" }),
  /* @__PURE__ */ r("rect", { x: "4.5", y: "3.5", width: "3", height: "2", fill: "currentColor", transform: "rotate(-45 6 4.5)" }),
  /* @__PURE__ */ r("circle", { cx: "12", cy: "12", r: "7", fill: "currentColor" }),
  /* @__PURE__ */ r("circle", { cx: "12", cy: "12", r: "4", fill: "var(--color-bg-card)" })
] }), da = () => /* @__PURE__ */ k("svg", { ...oe, width: 16, height: 16, viewBox: "0 0 20 20", children: [
  /* @__PURE__ */ r(
    "path",
    {
      d: "M2 4 L12 4 L16 10 L12 16 L2 16 Z",
      fill: "currentColor"
    }
  ),
  /* @__PURE__ */ r("circle", { cx: "6", cy: "10", r: "1.5", fill: "white" })
] });
function Ie({
  task: t,
  isDraggable: e = !0,
  pendingOperations: a,
  onComplete: o,
  onDelete: s,
  onAddTag: n,
  onEditTag: i,
  onDragStart: c,
  onDragEnd: d,
  selected: p = !1,
  showCompleteButton: g = !0,
  showDeleteButton: w = !0,
  showTagButton: I = !1,
  isMobile: v = !1
}) {
  const N = a.has(`complete-${t.id}`), F = a.has(`delete-${t.id}`);
  return /* @__PURE__ */ k(
    "li",
    {
      className: `task-app__item ${p ? "selected" : ""}`,
      "data-task-id": t.id,
      draggable: e,
      onDragStart: c ? (_) => c(_, t.id) : void 0,
      onDragEnd: (_) => {
        if (_.currentTarget.classList.remove("dragging"), d)
          try {
            d(_);
          } catch {
          }
      },
      children: [
        /* @__PURE__ */ k("div", { className: "task-app__item-content", children: [
          /* @__PURE__ */ r("div", { className: "task-app__item-title", title: t.title, children: t.title }),
          /* @__PURE__ */ k("div", { className: "task-app__item-meta-row", children: [
            t.tag ? /* @__PURE__ */ r("div", { className: "task-app__item-tag", children: t.tag.split(" ").sort().map((_) => `#${_}`).join(" ") }) : /* @__PURE__ */ r("div", {}),
            /* @__PURE__ */ r("div", { className: "task-app__item-age", children: ia(t.createdAt) })
          ] })
        ] }),
        /* @__PURE__ */ k("div", { className: "task-app__item-actions", children: [
          (I || v) && /* @__PURE__ */ r(
            "button",
            {
              className: "task-app__action-btn task-app__edit-tag-btn",
              onClick: () => i(t.id),
              title: "Edit tags",
              disabled: N || F,
              children: /* @__PURE__ */ r(da, {})
            }
          ),
          g && /* @__PURE__ */ r(
            "button",
            {
              className: "task-app__action-btn task-app__complete-btn",
              onClick: () => o(t.id),
              title: "Complete task",
              disabled: N || F,
              children: N ? "⏳" : "✓"
            }
          ),
          w && /* @__PURE__ */ r(
            "button",
            {
              className: "task-app__action-btn task-app__delete-btn",
              onClick: () => s(t.id),
              title: "Delete task",
              disabled: N || F,
              children: F ? "⏳" : "×"
            }
          )
        ] })
      ]
    }
  );
}
function nt(t, e = !1) {
  if (t === 0)
    return { useTags: 0, maxPerColumn: 1 / 0, rows: [] };
  if (e) {
    const a = Array.from({ length: t }, (o, s) => ({
      columns: 1,
      tagIndices: [s]
    }));
    return {
      useTags: t,
      maxPerColumn: 1 / 0,
      rows: a
    };
  }
  return t === 1 ? {
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
function ua({
  tasks: t,
  topTags: e,
  isMobile: a = !1,
  filters: o,
  sortDirections: s,
  dragOverTag: n,
  pendingOperations: i,
  onComplete: c,
  onDelete: d,
  onAddTag: p,
  onEditTag: g,
  onDragStart: w,
  onDragEnd: I,
  selectedIds: v,
  onSelectionStart: N,
  onSelectionMove: F,
  onSelectionEnd: _,
  onDragOver: j,
  onDragLeave: V,
  onDrop: R,
  toggleSort: M,
  sortTasksByAge: z,
  getSortIcon: H,
  getSortTitle: G,
  deleteTag: de,
  onDeletePersistedTag: ee,
  showCompleteButton: Z = !0,
  showDeleteButton: m = !0,
  showTagButton: y = !1
}) {
  const u = (T, U) => /* @__PURE__ */ k(
    "div",
    {
      className: `task-app__tag-column ${n === T ? "task-app__tag-column--drag-over" : ""}`,
      onDragOver: (L) => j(L, T),
      onDragLeave: V,
      onDrop: (L) => R(L, T),
      children: [
        /* @__PURE__ */ k("div", { className: "task-app__tag-header-row", children: [
          /* @__PURE__ */ k("h3", { className: "task-app__tag-header", children: [
            "#",
            T
          ] }),
          /* @__PURE__ */ r(
            "button",
            {
              className: "task-app__sort-btn task-app__sort-btn--active",
              onClick: () => M(T),
              title: G(s[T] || "desc"),
              children: H(s[T] || "desc")
            }
          )
        ] }),
        /* @__PURE__ */ r("ul", { className: "task-app__list task-app__list--column", children: z(U, s[T] || "desc").map((L) => /* @__PURE__ */ r(
          Ie,
          {
            task: L,
            isDraggable: !0,
            pendingOperations: i,
            onComplete: c,
            onDelete: d,
            onAddTag: p,
            onEditTag: g,
            onDragStart: w,
            onDragEnd: I,
            selected: v ? v.has(L.id) : !1,
            showCompleteButton: Z,
            showDeleteButton: m,
            showTagButton: y,
            isMobile: a
          },
          L.id
        )) })
      ]
    },
    T
  ), h = (T, U) => {
    let L = Ye(t, T);
    return b && (L = L.filter((K) => {
      const te = K.tag?.split(" ") || [];
      return o.some((le) => te.includes(le));
    })), L.slice(0, U);
  }, S = e.length, b = Array.isArray(o) && o.length > 0, A = t.filter((T) => {
    if (!b) return !0;
    const U = T.tag?.split(" ") || [];
    return o.some((L) => U.includes(L));
  }), D = nt(S, a), O = b ? e.filter((T) => Ye(t, T).some((L) => {
    const K = L.tag?.split(" ") || [];
    return o.some((te) => K.includes(te));
  })) : e.slice(0, D.useTags);
  if (O.length === 0)
    return /* @__PURE__ */ r("ul", { className: "task-app__list", children: A.map((T) => /* @__PURE__ */ r(
      Ie,
      {
        task: T,
        pendingOperations: i,
        onComplete: c,
        onDelete: d,
        onAddTag: p,
        onEditTag: g,
        onDragStart: w,
        onDragEnd: I,
        selected: v ? v.has(T.id) : !1,
        showCompleteButton: Z,
        showDeleteButton: m,
        showTagButton: y,
        isMobile: a
      },
      T.id
    )) });
  const E = ta(t, e, o).filter((T) => {
    if (!b) return !0;
    const U = T.tag?.split(" ") || [];
    return o.some((L) => U.includes(L));
  }), P = nt(O.length, a);
  return /* @__PURE__ */ k("div", { className: "task-app__dynamic-layout", children: [
    P.rows.length > 0 && /* @__PURE__ */ r(It, { children: P.rows.map((T, U) => /* @__PURE__ */ r("div", { className: `task-app__tag-grid task-app__tag-grid--${T.columns}col`, children: T.tagIndices.map((L) => {
      const K = O[L];
      return K ? u(K, h(K, P.maxPerColumn)) : null;
    }) }, U)) }),
    E.length > 0 && /* @__PURE__ */ k(
      "div",
      {
        className: `task-app__remaining ${n === "other" ? "task-app__tag-column--drag-over" : ""}`,
        onDragOver: (T) => {
          T.preventDefault(), T.dataTransfer.dropEffect = "move", j(T, "other");
        },
        onDragLeave: (T) => V(T),
        onDrop: (T) => R(T, "other"),
        children: [
          /* @__PURE__ */ k("div", { className: "task-app__tag-header-row", children: [
            /* @__PURE__ */ r("h3", { className: "task-app__remaining-header", children: "Other Tasks" }),
            /* @__PURE__ */ r(
              "button",
              {
                className: "task-app__sort-btn task-app__sort-btn--active",
                onClick: () => M("other"),
                title: G(s.other || "desc"),
                children: H(s.other || "desc")
              }
            )
          ] }),
          /* @__PURE__ */ r("ul", { className: "task-app__list", children: z(E, s.other || "desc").map((T) => /* @__PURE__ */ r(
            Ie,
            {
              task: T,
              pendingOperations: i,
              onComplete: c,
              onDelete: d,
              onAddTag: p,
              onEditTag: g,
              onDragStart: w,
              onDragEnd: I,
              selected: v ? v.has(T.id) : !1,
              showCompleteButton: Z,
              showDeleteButton: m,
              showTagButton: y,
              isMobile: a
            },
            T.id
          )) })
        ]
      }
    )
  ] });
}
function Te({
  isOpen: t,
  title: e,
  onClose: a,
  onConfirm: o,
  children: s,
  inputValue: n,
  onInputChange: i,
  inputPlaceholder: c,
  confirmLabel: d = "Confirm",
  cancelLabel: p = "Cancel",
  confirmDisabled: g = !1,
  confirmDanger: w = !1
}) {
  return t ? /* @__PURE__ */ r(
    "div",
    {
      className: "modal-overlay",
      onClick: a,
      children: /* @__PURE__ */ k(
        "div",
        {
          className: "modal-card",
          onClick: (v) => v.stopPropagation(),
          children: [
            /* @__PURE__ */ r("h3", { children: e }),
            s,
            i && /* @__PURE__ */ r(
              "input",
              {
                type: "text",
                className: "modal-input",
                value: n || "",
                onChange: (v) => i(v.target.value),
                placeholder: c,
                autoFocus: !0,
                onKeyDown: (v) => {
                  v.key === "Enter" && !g && (v.preventDefault(), o()), v.key === "Escape" && (v.preventDefault(), a());
                }
              }
            ),
            /* @__PURE__ */ k("div", { className: "modal-actions", children: [
              /* @__PURE__ */ r(
                "button",
                {
                  className: "modal-button",
                  onClick: a,
                  children: p
                }
              ),
              /* @__PURE__ */ r(
                "button",
                {
                  className: `modal-button ${w ? "modal-button--danger" : "modal-button--primary"}`,
                  onClick: o,
                  disabled: g,
                  children: d
                }
              )
            ] })
          ]
        }
      )
    }
  ) : null;
}
function ot({ isOpen: t, x: e, y: a, items: o, className: s = "board-context-menu" }) {
  return t ? /* @__PURE__ */ r(
    "div",
    {
      className: s,
      style: {
        left: `${e}px`,
        top: `${a}px`
      },
      children: o.map((n, i) => /* @__PURE__ */ r(
        "button",
        {
          className: `context-menu-item ${n.isDanger ? "context-menu-item--danger" : ""}`,
          onClick: n.onClick,
          children: n.label
        },
        i
      ))
    }
  ) : null;
}
const rt = [
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
function ga() {
  return rt[Math.floor(Math.random() * rt.length)];
}
const it = 768;
function pa() {
  const [t, e] = B(() => typeof window > "u" ? !1 : window.innerWidth < it);
  return W(() => {
    if (typeof window > "u") return;
    const a = window.matchMedia(`(max-width: ${it - 1}px)`), o = (s) => {
      e(s.matches);
    };
    return a.addEventListener ? a.addEventListener("change", o) : a.addListener(o), o(a), () => {
      a.removeEventListener ? a.removeEventListener("change", o) : a.removeListener(o);
    };
  }, []), t;
}
const ct = [
  {
    lightIcon: /* @__PURE__ */ r(ca, {}),
    darkIcon: /* @__PURE__ */ r(gt, {}),
    lightTheme: "light",
    darkTheme: "dark",
    lightLabel: "Light",
    darkLabel: "Dark"
  },
  {
    lightIcon: /* @__PURE__ */ r(Ze, {}),
    darkIcon: /* @__PURE__ */ r(Ze, {}),
    lightTheme: "strawberry-light",
    darkTheme: "strawberry-dark",
    lightLabel: "Strawberry Light",
    darkLabel: "Strawberry Dark"
  },
  {
    lightIcon: /* @__PURE__ */ r(Qe, {}),
    darkIcon: /* @__PURE__ */ r(Qe, {}),
    lightTheme: "ocean-light",
    darkTheme: "ocean-dark",
    lightLabel: "Ocean Light",
    darkLabel: "Ocean Dark"
  },
  {
    lightIcon: /* @__PURE__ */ r(et, {}),
    darkIcon: /* @__PURE__ */ r(et, {}),
    lightTheme: "cyberpunk-light",
    darkTheme: "cyberpunk-dark",
    lightLabel: "Cyberpunk Light",
    darkLabel: "Cyberpunk Dark"
  },
  {
    lightIcon: /* @__PURE__ */ r(tt, {}),
    darkIcon: /* @__PURE__ */ r(tt, {}),
    lightTheme: "coffee-light",
    darkTheme: "coffee-dark",
    lightLabel: "Coffee Light",
    darkLabel: "Coffee Dark"
  },
  {
    lightIcon: /* @__PURE__ */ r(at, {}),
    darkIcon: /* @__PURE__ */ r(at, {}),
    lightTheme: "lavender-light",
    darkTheme: "lavender-dark",
    lightLabel: "Lavender Light",
    darkLabel: "Lavender Dark"
  }
], ha = [
  {
    lightIcon: /* @__PURE__ */ r(st, {}),
    darkIcon: /* @__PURE__ */ r(st, {}),
    lightTheme: "pink-light",
    darkTheme: "pink-dark",
    lightLabel: "Pink Light",
    darkLabel: "Pink Dark"
  }
];
function pt(t) {
  return t ? [...ct, ...ha] : ct;
}
function ma(t, e) {
  const o = pt(e).find(
    (s) => s.lightTheme === t || s.darkTheme === t
  );
  return o ? t.endsWith("-dark") || t === "dark" ? o.darkIcon : o.lightIcon : /* @__PURE__ */ r(gt, {});
}
const lt = 5;
function fa(t = {}) {
  const { userType: e = "public", userId: a = "public", sessionId: o } = t, s = pa(), [n] = B(() => ga()), [i, c] = B(/* @__PURE__ */ new Set()), [d, p] = B(null), [g, w] = B(!1), [I, v] = B(!1), [N, F] = B(null), [_, j] = B(""), [V, R] = B(null), [M, z] = B("light"), [H, G] = B(!1), [de, ee] = B(!1), [Z, m] = B(!1), [y, u] = B({
    version: 1,
    updatedAt: (/* @__PURE__ */ new Date()).toISOString(),
    experimentalThemes: !1,
    alwaysVerticalLayout: !1
  }), [h, S] = B(!0), [b, A] = B(!0), [D, O] = B(!1), [E, P] = B(""), [T, U] = B(""), [L, K] = B(null), [te, le] = B(!1), [Pe, ve] = B(null), [he, De] = B(!1), [re, xe] = B(null), [ie, Be] = B(null), [ue, me] = B(null), [Ae, be] = B(""), ge = we(null), Ne = we(null), _e = we(null), Re = s || y.alwaysVerticalLayout || !1, {
    tasks: ce,
    pendingOperations: ht,
    initialLoad: Ue,
    addTask: mt,
    completeTask: ft,
    deleteTask: kt,
    addTagToTask: Tt,
    updateTaskTags: Ke,
    bulkUpdateTaskTags: Je,
    deleteTag: We,
    // board API
    boards: Y,
    currentBoardId: pe,
    createBoard: yt,
    deleteBoard: wt,
    switchBoard: vt,
    moveTasksToBoard: He,
    createTagOnBoard: je,
    deleteTagOnBoard: bt
  } = aa({ userType: e, userId: a, sessionId: o }), x = sa({
    tasks: ce,
    onTaskUpdate: Ke,
    onBulkUpdate: Je
  }), fe = na(), St = dt(
    () => pt(y.experimentalThemes || !1),
    [y.experimentalThemes]
  );
  W(() => {
    (async () => {
      const C = await ye(e, a, o).getPreferences();
      C && u(C);
    })();
  }, [e, a, o]);
  const Xe = async (l) => {
    const f = { ...y, ...l, updatedAt: (/* @__PURE__ */ new Date()).toISOString() };
    u(f), await ye(e, a, o).savePreferences(f);
  }, qe = async () => {
    if (!(!E.trim() || te)) {
      le(!0), ve(null);
      try {
        const f = await ye(e, a, o).setUserId(E.trim());
        f.ok ? (sessionStorage.setItem("displayUserId", E.trim()), ve(null), ee(!1), P("")) : ve(f.message || "Failed to update user ID");
      } catch {
        ve("Failed to update user ID");
      } finally {
        le(!1);
      }
    }
  }, Ve = async () => {
    if (!(!T.trim() || he)) {
      De(!0), K(null);
      try {
        if (await ye(e, a, o).validateKey(T.trim())) {
          const C = new URL(window.location.href);
          C.searchParams.set("key", T.trim()), window.location.href = C.toString();
        } else
          K("Invalid key"), De(!1);
      } catch {
        K("Failed to validate key"), De(!1);
      }
    }
  };
  W(() => {
    const l = sessionStorage.getItem("theme");
    l && z(l);
  }, []), W(() => {
    sessionStorage.setItem("theme", M);
  }, [M]), W(() => {
    const l = sessionStorage.getItem("showCompleteButton"), f = sessionStorage.getItem("showDeleteButton"), C = sessionStorage.getItem("showTagButton");
    l !== null && S(l === "true"), f !== null && A(f === "true"), C !== null && O(C === "true");
  }, []), W(() => {
    sessionStorage.setItem("showCompleteButton", String(h));
  }, [h]), W(() => {
    sessionStorage.setItem("showDeleteButton", String(b));
  }, [b]), W(() => {
    sessionStorage.setItem("showTagButton", String(D));
  }, [D]), W(() => {
    if (!H) return;
    const l = (f) => {
      _e.current && !_e.current.contains(f.target) && G(!1);
    };
    return document.addEventListener("mousedown", l), () => document.removeEventListener("mousedown", l);
  }, [H]), W(() => {
    const l = window.matchMedia("(prefers-color-scheme: dark)"), f = (C) => {
      const $ = C.matches, ae = M.replace(/-light$|-dark$/, ""), J = M.endsWith("-dark") ? "dark" : M.endsWith("-light") ? "light" : null;
      if (J && ae !== "light" && ae !== "dark") {
        const se = $ ? "dark" : "light";
        if (J !== se) {
          const Se = `${ae}-${se}`;
          console.log(`[Theme] Auto-switching from ${M} to ${Se} (Dark Reader/system preference)`), z(Se);
        }
      }
    };
    return l.addEventListener ? l.addEventListener("change", f) : l.addListener(f), () => {
      l.removeEventListener ? l.removeEventListener("change", f) : l.removeListener(f);
    };
  }, [M]), W(() => {
    c(/* @__PURE__ */ new Set());
  }, [pe]), W(() => {
    console.log("[App] User context changed, initializing...", { userType: e, userId: a }), Ue(), ge.current?.focus();
  }, [e, a]), W(() => {
    Ne.current && Ne.current.setAttribute("data-theme", M);
  }, [M]), W(() => {
    if (!H && !re && !ie) return;
    const l = (f) => {
      const C = f.target;
      C.closest(".theme-picker") || G(!1), C.closest(".board-context-menu") || xe(null), C.closest(".tag-context-menu") || Be(null);
    };
    return document.addEventListener("mousedown", l), () => document.removeEventListener("mousedown", l);
  }, [H, re, ie]);
  async function Ct(l) {
    await mt(l) && ge.current && (ge.current.value = "", ge.current.focus());
  }
  function Dt(l) {
    const f = ce.filter((C) => C.tag?.split(" ").includes(l));
    p({ tag: l, count: f.length });
  }
  async function xt(l) {
    const f = l.trim().replace(/\s+/g, "-");
    try {
      if (await je(f), N?.type === "apply-tag" && N.taskIds.length > 0) {
        const C = N.taskIds.map(($) => {
          const J = ce.find((Se) => Se.id === $)?.tag?.split(" ").filter(Boolean) || [], se = [.../* @__PURE__ */ new Set([...J, f])];
          return { taskId: $, tag: se.join(" ") };
        });
        await Je(C), x.clearSelection();
      }
      F(null);
    } catch (C) {
      throw console.error("[App] Failed to create tag:", C), C;
    }
  }
  function Bt(l) {
    const f = ce.find((C) => C.id === l);
    f && (me({ taskId: l, currentTag: f.tag || null }), be(""));
  }
  async function ze() {
    if (!ue) return;
    const { taskId: l, currentTag: f } = ue, C = f?.split(" ").filter(Boolean) || [], $ = Ae.trim() ? Ae.trim().replace(/\s+/g, "-").split("#").filter(Boolean).map((se) => se.trim()) : [];
    for (const se of $)
      await je(se);
    const J = [.../* @__PURE__ */ new Set([...C, ...$])].sort().join(" ");
    await Ke(l, { tag: J }), me(null), be("");
  }
  function At(l) {
    if (!ue) return;
    const { taskId: f, currentTag: C } = ue, $ = C?.split(" ").filter(Boolean) || [];
    if ($.includes(l)) {
      const J = $.filter((se) => se !== l).sort().join(" ");
      me({ taskId: f, currentTag: J });
    } else {
      const J = [...$, l].sort().join(" ");
      me({ taskId: f, currentTag: J });
    }
  }
  function Le(l) {
    const f = l.trim();
    return f ? (Y?.boards?.map(($) => $.id.toLowerCase()) || []).includes(f.toLowerCase()) ? `Board "${f}" already exists` : null : "Board name cannot be empty";
  }
  async function Nt(l) {
    const f = l.trim(), C = Le(f);
    if (C) {
      R(C);
      return;
    }
    try {
      await yt(f), N?.type === "move-to-board" && N.taskIds.length > 0 && (await He(f, N.taskIds), x.clearSelection()), F(null), R(null);
    } catch ($) {
      console.error("[App] Failed to create board:", $), R($.message || "Failed to create board");
    }
  }
  const _t = Y?.boards?.find((l) => l.id === pe)?.tags || [], Lt = ea(ce, Re ? 3 : 6), Et = M.endsWith("-dark") || M === "dark";
  return /* @__PURE__ */ r(
    "div",
    {
      ref: Ne,
      className: "task-app-container",
      "data-dark-theme": Et ? "true" : "false",
      onMouseDown: x.selectionStartHandler,
      onMouseMove: x.selectionMoveHandler,
      onMouseUp: x.selectionEndHandler,
      onMouseLeave: x.selectionEndHandler,
      onClick: (l) => {
        try {
          const f = l.target;
          if (!f.closest || !f.closest(".task-app__item")) {
            if (x.selectionJustEndedAt && Date.now() - x.selectionJustEndedAt < 300)
              return;
            x.clearSelection();
          }
        } catch {
        }
      },
      children: /* @__PURE__ */ k("div", { className: "task-app", children: [
        /* @__PURE__ */ k("div", { className: "task-app__header-container", children: [
          /* @__PURE__ */ k(
            "h1",
            {
              className: "task-app__header",
              onClick: () => ee(!0),
              style: { cursor: "pointer" },
              title: "Settings",
              children: [
                "Tasks",
                e !== "public" && a !== "public" ? ` - ${a}` : ""
              ]
            }
          ),
          /* @__PURE__ */ k("div", { className: "theme-picker", ref: _e, children: [
            /* @__PURE__ */ r(
              "button",
              {
                className: "theme-toggle-btn",
                onClick: () => G(!H),
                "aria-label": "Choose theme",
                title: "Choose theme",
                children: ma(M, y.experimentalThemes || !1)
              }
            ),
            H && /* @__PURE__ */ k("div", { className: "theme-picker__dropdown", children: [
              /* @__PURE__ */ r("div", { className: "theme-picker__pills", children: St.map((l, f) => /* @__PURE__ */ k("div", { className: "theme-pill", children: [
                /* @__PURE__ */ r(
                  "button",
                  {
                    className: `theme-pill__btn theme-pill__btn--light ${M === l.lightTheme ? "active" : ""}`,
                    onClick: () => z(l.lightTheme),
                    title: l.lightLabel,
                    "aria-label": l.lightLabel,
                    children: /* @__PURE__ */ r("div", { className: "theme-pill__icon", children: l.lightIcon })
                  }
                ),
                /* @__PURE__ */ r(
                  "button",
                  {
                    className: `theme-pill__btn theme-pill__btn--dark ${M === l.darkTheme ? "active" : ""}`,
                    onClick: () => z(l.darkTheme),
                    title: l.darkLabel,
                    "aria-label": l.darkLabel,
                    children: /* @__PURE__ */ r("div", { className: "theme-pill__icon", children: l.darkIcon })
                  }
                )
              ] }, f)) }),
              /* @__PURE__ */ r(
                "button",
                {
                  className: "theme-picker__settings-icon",
                  onClick: () => {
                    ee(!0), G(!1);
                  },
                  "aria-label": "Settings",
                  title: "Settings",
                  children: /* @__PURE__ */ r(la, {})
                }
              )
            ] })
          ] })
        ] }),
        /* @__PURE__ */ k("div", { className: "task-app__boards", children: [
          /* @__PURE__ */ r("div", { className: "task-app__board-list", children: (Y && Y.boards ? Y.boards.slice(0, lt) : [{ id: "main", name: "main", tasks: [], tags: [] }]).map((l) => /* @__PURE__ */ r(
            oa,
            {
              board: l,
              isActive: pe === l.id,
              isDragOver: x.dragOverFilter === `board:${l.id}`,
              onSwitch: vt,
              onContextMenu: (f, C, $) => xe({ boardId: f, x: C, y: $ }),
              onDragOverFilter: x.setDragOverFilter,
              onMoveTasksToBoard: He,
              onClearSelection: x.clearSelection
            },
            l.id
          )) }),
          /* @__PURE__ */ k("div", { className: "task-app__board-actions", children: [
            (!Y || Y.boards && Y.boards.length < lt) && /* @__PURE__ */ r(
              "button",
              {
                className: `board-add-btn ${x.dragOverFilter === "add-board" ? "board-btn--drag-over" : ""}`,
                onClick: () => {
                  j(""), R(null), w(!0);
                },
                onDragOver: (l) => {
                  l.preventDefault(), l.dataTransfer.dropEffect = "move", x.setDragOverFilter("add-board");
                },
                onDragLeave: (l) => {
                  x.setDragOverFilter(null);
                },
                onDrop: async (l) => {
                  l.preventDefault(), x.setDragOverFilter(null);
                  const f = Oe(l.dataTransfer);
                  f.length > 0 && (j(""), F({ type: "move-to-board", taskIds: f }), w(!0));
                },
                "aria-label": "Create board",
                children: "＋"
              }
            ),
            e !== "public" && /* @__PURE__ */ r(
              "button",
              {
                className: `sync-btn ${Z ? "spinning" : ""}`,
                onClick: async (l) => {
                  if (Z) return;
                  console.log("[App] Manual refresh triggered"), m(!0);
                  const f = new Promise((C, $) => {
                    setTimeout(() => $(new Error("Sync timeout")), 5e3);
                  });
                  try {
                    await Promise.race([Ue(), f]), console.log("[App] Sync completed successfully");
                  } catch (C) {
                    console.error("[App] Sync failed:", C);
                  } finally {
                    m(!1), l.currentTarget.blur();
                  }
                },
                disabled: Z,
                title: "Sync from server",
                "aria-label": "Sync from server",
                children: /* @__PURE__ */ k("svg", { width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [
                  /* @__PURE__ */ r("polyline", { points: "23 4 23 10 17 10" }),
                  /* @__PURE__ */ r("polyline", { points: "1 20 1 14 7 14" }),
                  /* @__PURE__ */ r("path", { d: "M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" })
                ] })
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ r("div", { className: "task-app__controls", children: /* @__PURE__ */ r(
          "input",
          {
            ref: ge,
            className: "task-app__input",
            placeholder: n,
            onKeyDown: (l) => {
              l.key === "Enter" && !l.shiftKey && (l.preventDefault(), Ct(l.target.value)), l.key === "k" && (l.ctrlKey || l.metaKey) && (l.preventDefault(), ge.current?.focus());
            }
          }
        ) }),
        /* @__PURE__ */ k("div", { className: "task-app__filters", children: [
          (() => {
            const l = Ee(ce);
            return Array.from(/* @__PURE__ */ new Set([..._t, ...l])).map((C) => /* @__PURE__ */ r(
              ra,
              {
                tag: C,
                isActive: i.has(C),
                isDragOver: x.dragOverFilter === C,
                onToggle: ($) => {
                  c((ae) => {
                    const J = new Set(ae);
                    return J.has($) ? J.delete($) : J.add($), J;
                  });
                },
                onContextMenu: ($, ae, J) => Be({ tag: $, x: ae, y: J }),
                onDragOver: x.onFilterDragOver,
                onDragLeave: x.onFilterDragLeave,
                onDrop: x.onFilterDrop
              },
              C
            ));
          })(),
          /* @__PURE__ */ r(
            "button",
            {
              className: `task-app__filter-add ${x.dragOverFilter === "add-tag" ? "task-app__filter-drag-over" : ""}`,
              onClick: () => {
                j(""), v(!0);
              },
              onDragOver: (l) => {
                l.preventDefault(), l.dataTransfer.dropEffect = "copy", x.onFilterDragOver(l, "add-tag");
              },
              onDragLeave: x.onFilterDragLeave,
              onDrop: async (l) => {
                l.preventDefault(), x.onFilterDragLeave(l);
                const f = Oe(l.dataTransfer);
                f.length > 0 && (j(""), F({ type: "apply-tag", taskIds: f }), v(!0));
              },
              "aria-label": "Add tag",
              children: "＋"
            }
          )
        ] }),
        /* @__PURE__ */ r(
          ua,
          {
            tasks: ce,
            topTags: Lt,
            isMobile: Re,
            filters: Array.from(i),
            selectedIds: x.selectedIds,
            onSelectionStart: x.selectionStartHandler,
            onSelectionMove: x.selectionMoveHandler,
            onSelectionEnd: x.selectionEndHandler,
            sortDirections: fe.sortDirections,
            dragOverTag: x.dragOverTag,
            pendingOperations: ht,
            onComplete: ft,
            onDelete: kt,
            onAddTag: Tt,
            onEditTag: Bt,
            onDragStart: x.onDragStart,
            onDragEnd: x.onDragEnd,
            onDragOver: x.onDragOver,
            onDragLeave: x.onDragLeave,
            onDrop: x.onDrop,
            toggleSort: fe.toggleSort,
            sortTasksByAge: fe.sortTasksByAge,
            getSortIcon: fe.getSortIcon,
            getSortTitle: fe.getSortTitle,
            deleteTag: Dt,
            onDeletePersistedTag: bt,
            showCompleteButton: h,
            showDeleteButton: b,
            showTagButton: D
          }
        ),
        x.isSelecting && x.marqueeRect && /* @__PURE__ */ r(
          "div",
          {
            className: "marquee-overlay",
            style: {
              left: `${x.marqueeRect.x}px`,
              top: `${x.marqueeRect.y}px`,
              width: `${x.marqueeRect.w}px`,
              height: `${x.marqueeRect.h}px`
            }
          }
        ),
        /* @__PURE__ */ r(
          Te,
          {
            isOpen: !!d,
            title: `Clear Tag #${d?.tag}?`,
            onClose: () => p(null),
            onConfirm: async () => {
              if (!d) return;
              const l = d.tag;
              p(null), await We(l);
            },
            confirmLabel: "Clear Tag",
            confirmDanger: !0,
            children: d && /* @__PURE__ */ k("p", { children: [
              "This will remove ",
              /* @__PURE__ */ k("strong", { children: [
                "#",
                d.tag
              ] }),
              " from",
              " ",
              /* @__PURE__ */ k("strong", { children: [
                d.count,
                " task(s)"
              ] }),
              " and delete the tag from the board."
            ] })
          }
        ),
        /* @__PURE__ */ k(
          Te,
          {
            isOpen: g,
            title: "Create New Board",
            onClose: () => {
              w(!1), F(null), R(null);
            },
            onConfirm: async () => {
              if (!_.trim()) return;
              const l = Le(_);
              if (l) {
                R(l);
                return;
              }
              w(!1), await Nt(_);
            },
            inputValue: _,
            onInputChange: (l) => {
              j(l), R(null);
            },
            inputPlaceholder: "Board name",
            confirmLabel: "Create",
            confirmDisabled: !_.trim() || Le(_) !== null,
            children: [
              N?.type === "move-to-board" && N.taskIds.length > 0 && /* @__PURE__ */ k("p", { className: "modal-hint", children: [
                N.taskIds.length,
                " task",
                N.taskIds.length > 1 ? "s" : "",
                " will be moved to this board"
              ] }),
              V && /* @__PURE__ */ r("p", { className: "modal-error", style: { color: "var(--error-color, #d32f2f)", marginTop: "0.5rem" }, children: V })
            ]
          }
        ),
        /* @__PURE__ */ k(
          Te,
          {
            isOpen: I,
            title: "Create New Tag",
            onClose: () => {
              v(!1), F(null);
            },
            onConfirm: async () => {
              if (_.trim()) {
                v(!1);
                try {
                  await xt(_);
                } catch (l) {
                  console.error("[App] Failed to create tag:", l);
                }
              }
            },
            inputValue: _,
            onInputChange: j,
            inputPlaceholder: "Enter new tag name",
            confirmLabel: "Create",
            confirmDisabled: !_.trim(),
            children: [
              N?.type === "apply-tag" && N.taskIds.length > 0 && /* @__PURE__ */ k("p", { className: "modal-hint", children: [
                "This tag will be applied to ",
                N.taskIds.length,
                " task",
                N.taskIds.length > 1 ? "s" : ""
              ] }),
              Ee(ce).length > 0 && /* @__PURE__ */ k("div", { className: "modal-section", children: [
                /* @__PURE__ */ r("label", { className: "modal-label", children: "Existing tags:" }),
                /* @__PURE__ */ r("div", { className: "modal-tags-list", children: Ee(ce).map((l) => /* @__PURE__ */ k("span", { className: "modal-tag-chip", children: [
                  "#",
                  l
                ] }, l)) })
              ] })
            ]
          }
        ),
        /* @__PURE__ */ k(
          Te,
          {
            isOpen: de,
            title: "Settings",
            onClose: () => ee(!1),
            onConfirm: () => ee(!1),
            confirmLabel: "Close",
            cancelLabel: "Close",
            children: [
              /* @__PURE__ */ k("div", { className: "settings-section", children: [
                /* @__PURE__ */ r("h4", { className: "settings-section-title", children: "User Management" }),
                /* @__PURE__ */ k("div", { className: "settings-field", children: [
                  /* @__PURE__ */ r("label", { className: "settings-field-label", children: "Current User ID" }),
                  /* @__PURE__ */ k("div", { className: "settings-field-input-group", children: [
                    /* @__PURE__ */ r(
                      "input",
                      {
                        type: "text",
                        className: "settings-text-input",
                        value: E || a,
                        onChange: (l) => P(l.target.value),
                        onKeyDown: (l) => {
                          l.key === "Enter" && E && E !== a && e !== "public" && !te && qe();
                        },
                        placeholder: e === "public" ? "public" : a,
                        disabled: e === "public" || te
                      }
                    ),
                    E && E !== a && e !== "public" && /* @__PURE__ */ r(
                      "button",
                      {
                        className: "settings-field-button",
                        onClick: qe,
                        disabled: te,
                        children: te ? /* @__PURE__ */ r("span", { className: "spinner" }) : "↵"
                      }
                    )
                  ] }),
                  Pe && /* @__PURE__ */ r("div", { className: "settings-error-message", children: Pe })
                ] }),
                /* @__PURE__ */ k("div", { className: "settings-field", children: [
                  /* @__PURE__ */ r("label", { className: "settings-field-label", children: "Enter New Key" }),
                  /* @__PURE__ */ k("div", { className: "settings-field-input-group", children: [
                    /* @__PURE__ */ r(
                      "input",
                      {
                        type: "password",
                        name: "key",
                        autoComplete: "key",
                        className: "settings-text-input",
                        value: T,
                        onChange: (l) => {
                          U(l.target.value), K(null);
                        },
                        onKeyDown: (l) => {
                          l.key === "Enter" && T && !he && Ve();
                        },
                        placeholder: "Enter authentication key",
                        disabled: he
                      }
                    ),
                    T && /* @__PURE__ */ r(
                      "button",
                      {
                        className: "settings-field-button",
                        onClick: Ve,
                        disabled: he,
                        children: he ? /* @__PURE__ */ r("span", { className: "spinner" }) : "↵"
                      }
                    )
                  ] }),
                  L && /* @__PURE__ */ r("span", { className: "settings-error", children: L })
                ] })
              ] }),
              /* @__PURE__ */ k("div", { className: "settings-section", children: [
                /* @__PURE__ */ r("h4", { className: "settings-section-title", children: "Preferences" }),
                /* @__PURE__ */ k("label", { className: "settings-option", children: [
                  /* @__PURE__ */ r(
                    "input",
                    {
                      type: "checkbox",
                      checked: y.experimentalThemes || !1,
                      onChange: (l) => {
                        Xe({ experimentalThemes: l.target.checked });
                      }
                    }
                  ),
                  /* @__PURE__ */ k("span", { className: "settings-label", children: [
                    /* @__PURE__ */ r("strong", { children: "Experimental Themes" }),
                    /* @__PURE__ */ r("span", { className: "settings-description", children: "Enable access to experimental theme options" })
                  ] })
                ] }),
                /* @__PURE__ */ k("label", { className: "settings-option", children: [
                  /* @__PURE__ */ r(
                    "input",
                    {
                      type: "checkbox",
                      checked: y.alwaysVerticalLayout || !1,
                      onChange: (l) => {
                        Xe({ alwaysVerticalLayout: l.target.checked });
                      }
                    }
                  ),
                  /* @__PURE__ */ k("span", { className: "settings-label", children: [
                    /* @__PURE__ */ r("strong", { children: "Always Use Vertical Layout" }),
                    /* @__PURE__ */ r("span", { className: "settings-description", children: "Use mobile-style vertical task layout on all devices" })
                  ] })
                ] }),
                /* @__PURE__ */ k("label", { className: "settings-option", children: [
                  /* @__PURE__ */ r(
                    "input",
                    {
                      type: "checkbox",
                      checked: !h,
                      onChange: (l) => {
                        S(!l.target.checked);
                      }
                    }
                  ),
                  /* @__PURE__ */ k("span", { className: "settings-label", children: [
                    /* @__PURE__ */ r("strong", { children: "Disable Complete Button" }),
                    /* @__PURE__ */ r("span", { className: "settings-description", children: "Hide the checkmark (✓) button on task items" })
                  ] })
                ] }),
                /* @__PURE__ */ k("label", { className: "settings-option", children: [
                  /* @__PURE__ */ r(
                    "input",
                    {
                      type: "checkbox",
                      checked: !b,
                      onChange: (l) => {
                        A(!l.target.checked);
                      }
                    }
                  ),
                  /* @__PURE__ */ k("span", { className: "settings-label", children: [
                    /* @__PURE__ */ r("strong", { children: "Disable Delete Button" }),
                    /* @__PURE__ */ r("span", { className: "settings-description", children: "Hide the delete (×) button on task items" })
                  ] })
                ] }),
                /* @__PURE__ */ k("label", { className: "settings-option", children: [
                  /* @__PURE__ */ r(
                    "input",
                    {
                      type: "checkbox",
                      checked: D,
                      onChange: (l) => {
                        O(l.target.checked);
                      }
                    }
                  ),
                  /* @__PURE__ */ k("span", { className: "settings-label", children: [
                    /* @__PURE__ */ r("strong", { children: "Enable Tag Button" }),
                    /* @__PURE__ */ r("span", { className: "settings-description", children: "Show tag button on desktop (always visible on mobile)" })
                  ] })
                ] })
              ] })
            ]
          }
        ),
        /* @__PURE__ */ r(
          Te,
          {
            isOpen: !!ue,
            title: "Edit Tags",
            onClose: () => {
              me(null), be("");
            },
            onConfirm: ze,
            confirmLabel: "Save",
            cancelLabel: "Cancel",
            children: /* @__PURE__ */ k("div", { className: "edit-tag-modal", children: [
              Y?.boards?.find((l) => l.id === pe)?.tags && Y.boards.find((l) => l.id === pe).tags.length > 0 && /* @__PURE__ */ k("div", { className: "edit-tag-pills", children: [
                /* @__PURE__ */ r("label", { className: "edit-tag-label", children: "Select Tags" }),
                /* @__PURE__ */ r("div", { className: "edit-tag-pills-container", children: [...Y.boards.find((l) => l.id === pe).tags].sort().map((l) => {
                  const C = (ue?.currentTag?.split(" ").filter(Boolean) || []).includes(l);
                  return /* @__PURE__ */ k(
                    "button",
                    {
                      className: `edit-tag-pill ${C ? "active" : ""}`,
                      onClick: () => At(l),
                      type: "button",
                      children: [
                        "#",
                        l
                      ]
                    },
                    l
                  );
                }) })
              ] }),
              /* @__PURE__ */ k("div", { className: "edit-tag-field", children: [
                /* @__PURE__ */ r("label", { className: "edit-tag-label", children: "Add New Tag" }),
                /* @__PURE__ */ r(
                  "input",
                  {
                    type: "text",
                    className: "edit-tag-input",
                    value: Ae,
                    onChange: (l) => {
                      be(l.target.value);
                    },
                    onKeyDown: (l) => {
                      l.key === "Enter" && (l.preventDefault(), ze());
                    },
                    placeholder: "Enter a tag",
                    autoFocus: !0
                  }
                ),
                /* @__PURE__ */ k("div", { className: "edit-tag-hint", children: [
                  /* @__PURE__ */ r("div", { children: '"one tag" → #one-tag' }),
                  /* @__PURE__ */ r("div", { children: '"#two #tags" → #two #tags' })
                ] })
              ] })
            ] })
          }
        ),
        /* @__PURE__ */ r(
          ot,
          {
            isOpen: !!re,
            x: re?.x || 0,
            y: re?.y || 0,
            items: [
              {
                label: "🗑️ Delete Board",
                isDanger: !0,
                onClick: async () => {
                  if (!re) return;
                  const l = Y?.boards?.find((f) => f.id === re.boardId)?.name || re.boardId;
                  if (confirm(`Delete board "${l}"? All tasks on this board will be permanently deleted.`))
                    try {
                      await wt(re.boardId), xe(null);
                    } catch (f) {
                      console.error("[App] Failed to delete board:", f), alert(f.message || "Failed to delete board");
                    }
                }
              }
            ]
          }
        ),
        /* @__PURE__ */ r(
          ot,
          {
            isOpen: !!ie,
            x: ie?.x || 0,
            y: ie?.y || 0,
            className: "tag-context-menu",
            items: [
              {
                label: "🗑️ Delete Tag",
                isDanger: !0,
                onClick: async () => {
                  if (console.log("[App] Delete Tag clicked!", { tagContextMenu: ie }), !ie) {
                    console.error("[App] No tagContextMenu when Delete Tag clicked!");
                    return;
                  }
                  try {
                    console.log("[App] Calling deleteTag for tag:", ie.tag), await We(ie.tag), console.log("[App] deleteTag completed successfully"), Be(null);
                  } catch (l) {
                    console.error("[App] Failed to delete tag:", l), alert(l.message || "Failed to delete tag");
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
function va(t, e = {}) {
  const a = new URLSearchParams(window.location.search), o = e.userType || a.get("userType") || "admin", s = e.userId || "test-admin", n = e.sessionId, i = { ...e, userType: o, userId: s, sessionId: n }, c = Ot(t);
  c.render(/* @__PURE__ */ r(fa, { ...i })), t.__root = c, console.log("[task-app] Mounted successfully", i);
}
function ba(t) {
  t.__root?.unmount();
}
export {
  va as mount,
  ba as unmount
};
