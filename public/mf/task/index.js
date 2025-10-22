import { jsx as r, jsxs as T, Fragment as Et } from "react/jsx-runtime";
import { createRoot as It } from "react-dom/client";
import { useState as A, useMemo as lt, useEffect as Z, useRef as ve } from "react";
const H = `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
class Ot {
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
function te() {
  return (/* @__PURE__ */ new Date()).toISOString();
}
function $e(t, e) {
  const a = t.tasks.findIndex((o) => o.id === e);
  if (a < 0)
    throw new Error("Task not found");
  return { task: t.tasks[a], index: a };
}
function De(t, e) {
  const a = t.boards.findIndex((o) => o.id === e);
  if (a < 0)
    throw new Error(`Board ${e} not found`);
  return { board: t.boards[a], index: a };
}
function Me(t, e, a, o) {
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
function $t(t, e, a) {
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
function Mt(t, e, a) {
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
function Pe(t, e, a) {
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
function Pt(t, e, a) {
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
async function Rt(t, e) {
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
async function Ut(t, e, a, o = "main") {
  const s = te(), n = await t.getTasks(e.userType, e.userId, o), i = await t.getStats(e.userType, e.userId, o), c = a.id || Ft(), d = a.createdAt || s, p = {
    id: c,
    title: a.title,
    tag: a.tag ?? null,
    state: "Active",
    createdAt: d
  }, u = {
    ...n,
    tasks: [p, ...n.tasks],
    updatedAt: s
  }, w = $t(i, p, s);
  return await t.saveTasks(e.userType, e.userId, o, u), await t.saveStats(e.userType, e.userId, o, w), { ok: !0, id: c };
}
async function Kt(t, e, a, o, s = "main") {
  const n = te(), i = await t.getTasks(e.userType, e.userId, s), c = await t.getStats(e.userType, e.userId, s), { task: d, index: p } = $e(i, a), u = {
    ...d,
    ...o,
    updatedAt: n
  }, w = [...i.tasks];
  w[p] = u;
  const I = {
    ...i,
    tasks: w,
    updatedAt: n
  }, y = Pe(c, u, n);
  return await t.saveTasks(e.userType, e.userId, s, I), await t.saveStats(e.userType, e.userId, s, y), { ok: !0, message: `Task ${a} updated` };
}
async function Jt(t, e, a, o = "main") {
  const s = te(), n = await t.getTasks(e.userType, e.userId, o), i = await t.getStats(e.userType, e.userId, o), { task: c, index: d } = $e(n, a), p = {
    ...c,
    state: "Completed",
    closedAt: s,
    updatedAt: s
  }, u = [...n.tasks];
  u.splice(d, 1);
  const w = {
    ...n,
    tasks: u,
    updatedAt: s
  }, I = Mt(i, p, s);
  return await t.saveTasks(e.userType, e.userId, o, w), await t.saveStats(e.userType, e.userId, o, I), { ok: !0, message: `Task ${a} completed` };
}
async function Wt(t, e, a, o = "main") {
  const s = te(), n = await t.getTasks(e.userType, e.userId, o), i = await t.getStats(e.userType, e.userId, o), { task: c, index: d } = $e(n, a), p = {
    ...c,
    state: "Deleted",
    closedAt: s,
    updatedAt: s
  }, u = [...n.tasks];
  u.splice(d, 1);
  const w = {
    ...n,
    tasks: u,
    updatedAt: s
  }, I = Pt(i, p, s);
  return await t.saveTasks(e.userType, e.userId, o, w), await t.saveStats(e.userType, e.userId, o, I), { ok: !0, message: `Task ${a} deleted` };
}
async function Ht(t, e, a) {
  const o = te(), s = await t.getBoards(e.userType, e.userId);
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
async function jt(t, e, a) {
  if (a === "main")
    throw new Error("Cannot delete the main board");
  const o = te(), s = await t.getBoards(e.userType, e.userId);
  De(s, a);
  const n = {
    ...s,
    updatedAt: o,
    boards: s.boards.filter((i) => i.id !== a)
  };
  return await t.saveBoards(e.userType, n, e.userId), { ok: !0, message: `Board ${a} deleted` };
}
async function Xt(t, e, a) {
  const o = te(), s = await t.getBoards(e.userType, e.userId), { board: n, index: i } = De(s, a.boardId), c = n.tags || [];
  if (c.includes(a.tag))
    return { ok: !0, message: `Tag ${a.tag} already exists` };
  const d = {
    ...n,
    tags: [...c, a.tag]
  }, p = Me(s, i, d, o);
  return await t.saveBoards(e.userType, p, e.userId), { ok: !0, message: `Tag ${a.tag} added to board ${a.boardId}` };
}
async function qt(t, e, a) {
  const o = te(), s = await t.getBoards(e.userType, e.userId), { board: n, index: i } = De(s, a.boardId), c = n.tags || [], d = {
    ...n,
    tags: c.filter((u) => u !== a.tag)
  }, p = Me(s, i, d, o);
  return await t.saveBoards(e.userType, p, e.userId), { ok: !0, message: `Tag ${a.tag} removed from board ${a.boardId}` };
}
async function Vt(t, e, a) {
  const o = te(), s = await t.getTasks(e.userType, e.userId, a.boardId), n = await t.getStats(e.userType, e.userId, a.boardId);
  let i = 0;
  const c = s.tasks.map((u) => {
    const w = a.updates.find((I) => I.taskId === u.id);
    return w ? (i++, {
      ...u,
      tag: w.tag || void 0,
      updatedAt: o
    }) : u;
  }), d = {
    ...s,
    tasks: c,
    updatedAt: o
  };
  let p = n;
  for (const u of c)
    a.updates.find((w) => w.taskId === u.id) && (p = Pe(p, u, o));
  return await t.saveTasks(e.userType, e.userId, a.boardId, d), await t.saveStats(e.userType, e.userId, a.boardId, p), {
    ok: !0,
    message: `Updated ${i} task(s) on board ${a.boardId}`,
    updated: i
  };
}
async function zt(t, e, a) {
  const o = te(), s = await t.getTasks(e.userType, e.userId, a.boardId), n = await t.getStats(e.userType, e.userId, a.boardId), i = await t.getBoards(e.userType, e.userId);
  let c = 0;
  const d = s.tasks.map((O) => {
    if (a.taskIds.includes(O.id) && O.tag) {
      const q = O.tag.split(" ").filter(Boolean).filter((K) => K !== a.tag);
      return c++, {
        ...O,
        tag: q.length > 0 ? q.join(" ") : void 0,
        updatedAt: o
      };
    }
    return O;
  }), p = {
    ...s,
    tasks: d,
    updatedAt: o
  };
  let u = n;
  for (const O of d)
    a.taskIds.includes(O.id) && (u = Pe(u, O, o));
  const { board: w, index: I } = De(i, a.boardId), y = w.tags || [], N = {
    ...w,
    tags: y.filter((O) => O !== a.tag)
  }, $ = Me(i, I, N, o);
  return await t.saveTasks(e.userType, e.userId, a.boardId, p), await t.saveStats(e.userType, e.userId, a.boardId, u), await t.saveBoards(e.userType, $, e.userId), {
    ok: !0,
    message: `Cleared tag ${a.tag} from ${c} task(s) on board ${a.boardId}`,
    cleared: c
  };
}
function ee(t, e, a = 50) {
  setTimeout(() => {
    try {
      const o = new BroadcastChannel("tasks");
      o.postMessage({ type: t, ...e }), o.close();
    } catch (o) {
      console.error("[localStorageApi] Broadcast failed:", o);
    }
  }, a);
}
function Yt(t = "public", e = "public") {
  const a = new Ot(t, e), o = { userType: "registered", userId: e };
  return {
    async getBoards() {
      const s = await Rt(a, o), n = {
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
      const n = await Ht(
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
      }), ee("boards-updated", { sessionId: H, userType: t, userId: e }), n.board;
    },
    async deleteBoard(s) {
      await jt(
        a,
        o,
        s
      ), await a.deleteBoardData(t, e, s), ee("boards-updated", { sessionId: H, userType: t, userId: e });
    },
    async getTasks(s = "main") {
      return a.getTasks(t, e, s);
    },
    async getStats(s = "main") {
      return a.getStats(t, e, s);
    },
    async createTask(s, n = "main", i = !1) {
      console.log("[localStorageApi] createTask (using handler)", { data: s, boardId: n, suppressBroadcast: i });
      const c = await Ut(
        a,
        o,
        s,
        n
      ), p = (await a.getTasks(t, e, n)).tasks.find((u) => u.id === c.id);
      if (!p)
        throw new Error("Task creation failed - task not found after creation");
      return i ? console.log("[localStorageApi] createTask: broadcast suppressed") : (console.log("[localStorageApi] createTask: broadcasting", {
        sessionId: H,
        boardId: n,
        taskId: c.id
      }), ee("tasks-updated", { sessionId: H, userType: t, userId: e, boardId: n })), p;
    },
    async patchTask(s, n, i = "main", c = !1) {
      const d = {};
      n.title !== void 0 && (d.title = n.title), n.tag !== void 0 && n.tag !== null && (d.tag = n.tag), await Kt(
        a,
        o,
        s,
        d,
        i
      ), c || ee("tasks-updated", { sessionId: H, userType: t, userId: e, boardId: i });
      const u = (await a.getTasks(t, e, i)).tasks.find((w) => w.id === s);
      if (!u)
        throw new Error("Task not found after update");
      return u;
    },
    async completeTask(s, n = "main") {
      const c = (await a.getTasks(t, e, n)).tasks.find((d) => d.id === s);
      if (!c)
        throw new Error("Task not found");
      return await Jt(
        a,
        o,
        s,
        n
      ), ee("tasks-updated", { sessionId: H, userType: t, userId: e, boardId: n }), {
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
      return await Wt(
        a,
        o,
        s,
        n
      ), i ? console.log("[localStorageApi] deleteTask: broadcast suppressed") : (console.log("[localStorageApi] deleteTask: broadcasting", { sessionId: H }), ee("tasks-updated", { sessionId: H, userType: t, userId: e, boardId: n })), {
        ...d,
        state: "Deleted",
        closedAt: (/* @__PURE__ */ new Date()).toISOString(),
        updatedAt: (/* @__PURE__ */ new Date()).toISOString()
      };
    },
    async createTag(s, n = "main") {
      await Xt(
        a,
        o,
        { boardId: n, tag: s }
      ), ee("boards-updated", { sessionId: H, userType: t, userId: e, boardId: n });
    },
    async deleteTag(s, n = "main") {
      await qt(
        a,
        o,
        { boardId: n, tag: s }
      ), ee("boards-updated", { sessionId: H, userType: t, userId: e, boardId: n });
    },
    // User preferences (includes device-specific settings like theme)
    async getPreferences() {
      const s = `${t}-${e}-preferences`, n = localStorage.getItem(s);
      return n ? JSON.parse(n) : {
        version: 1,
        updatedAt: (/* @__PURE__ */ new Date()).toISOString(),
        theme: "light",
        showCompleteButton: !0,
        showDeleteButton: !0,
        showTagButton: !1
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
      const u = d.tasks.filter((N) => i.includes(N.id));
      d.tasks = d.tasks.filter((N) => !i.includes(N.id)), p.tasks = [...p.tasks, ...u], c.updatedAt = (/* @__PURE__ */ new Date()).toISOString();
      const w = `${t}-${e}-boards`;
      localStorage.setItem(w, JSON.stringify(c));
      const I = `${t}-${e}-${s}-tasks`, y = `${t}-${e}-${n}-tasks`;
      return localStorage.setItem(I, JSON.stringify({
        version: 1,
        updatedAt: c.updatedAt,
        tasks: d.tasks
      })), localStorage.setItem(y, JSON.stringify({
        version: 1,
        updatedAt: c.updatedAt,
        tasks: p.tasks
      })), ee("boards-updated", { sessionId: H, userType: t, userId: e }), { ok: !0, moved: u.length };
    },
    async batchUpdateTags(s, n) {
      console.log("[localStorageApi] batchUpdateTags", { boardId: s, updates: n }), await Vt(
        a,
        o,
        { boardId: s, updates: n }
      ), ee("tasks-updated", { sessionId: H, userType: t, userId: e, boardId: s });
    },
    async batchClearTag(s, n, i) {
      console.log("[localStorageApi] batchClearTag START", { boardId: s, tag: n, taskIds: i, taskCount: i.length });
      const c = await zt(
        a,
        o,
        { boardId: s, tag: n, taskIds: i }
      );
      console.log("[localStorageApi] batchClearTag result:", c), ee("boards-updated", { sessionId: H, userType: t, userId: e, boardId: s }), console.log("[localStorageApi] batchClearTag END");
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
async function Gt(t, e, a, o) {
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
function W(t, e, a) {
  const o = {
    "Content-Type": "application/json",
    "X-User-Type": t
  };
  return e && (o["X-User-Id"] = e), a && (o["X-Session-Id"] = a), o;
}
function we(t = "public", e = "public", a) {
  const o = Yt(t, e);
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
          headers: W(t, e, a)
        });
        if (!s.ok)
          throw new Error(`API returned ${s.status}`);
        const n = await s.json();
        if (!n || !n.boards || !Array.isArray(n.boards)) {
          console.error("[api] Invalid response structure:", n);
          return;
        }
        console.log("[api] Synced from API:", { boards: n.boards.length, totalTasks: n.boards.reduce((i, c) => i + (c.tasks?.length || 0), 0) }), await Gt(o, n, t, e);
      } catch (s) {
        console.error("[api] Sync from API failed:", s);
      }
    },
    async createTask(s, n = "main", i = !1) {
      const c = await o.createTask(s, n, i);
      return fetch("/task/api", {
        method: "POST",
        headers: W(t, e, a),
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
        headers: W(t, e, a),
        body: JSON.stringify({ boardId: n, tag: s })
      }).then(() => console.log("[api] Background sync: createTag completed")).catch((c) => console.error("[api] Failed to sync createTag:", c)), i;
    },
    async deleteTag(s, n = "main") {
      const i = await o.deleteTag(s, n);
      return fetch("/task/api/tags/delete", {
        method: "POST",
        headers: W(t, e, a),
        body: JSON.stringify({ boardId: n, tag: s })
      }).then(() => console.log("[api] Background sync: deleteTag completed")).catch((c) => console.error("[api] Failed to sync deleteTag:", c)), i;
    },
    async patchTask(s, n, i = "main", c = !1) {
      const d = await o.patchTask(s, n, i, c);
      return fetch(`/task/api/${s}`, {
        method: "PATCH",
        headers: W(t, e, a),
        body: JSON.stringify({ ...n, boardId: i })
      }).then(() => console.log("[api] Background sync: patchTask completed")).catch((p) => console.error("[api] Failed to sync patchTask:", p)), d;
    },
    async completeTask(s, n = "main") {
      const i = await o.completeTask(s, n);
      return fetch(`/task/api/${s}/complete`, {
        method: "POST",
        headers: W(t, e, a),
        body: JSON.stringify({ boardId: n })
      }).then((c) => {
        if (!c.ok) throw new Error(`HTTP ${c.status}`);
        console.log("[api] Background sync: completeTask completed");
      }).catch((c) => console.error("[api] Failed to sync completeTask:", c)), i;
    },
    async deleteTask(s, n = "main", i = !1) {
      await o.deleteTask(s, n, i), fetch(`/task/api/${s}`, {
        method: "DELETE",
        headers: W(t, e, a),
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
        headers: W(t, e, a),
        body: JSON.stringify({ id: s, name: s })
      }).then(() => console.log("[api] Background sync: createBoard completed")).catch((i) => console.error("[api] Failed to sync createBoard:", i)), n;
    },
    async deleteBoard(s) {
      const n = await o.deleteBoard(s);
      return fetch(`/task/api/boards/${encodeURIComponent(s)}`, {
        method: "DELETE",
        headers: W(t, e, a)
      }).then(() => console.log("[api] Background sync: deleteBoard completed")).catch((i) => console.error("[api] Failed to sync deleteBoard:", i)), n;
    },
    // User preferences
    async getPreferences() {
      const s = await o.getPreferences();
      try {
        const n = await fetch("/task/api/preferences", {
          headers: W(t, e, a)
        });
        if (n.ok) {
          const i = await n.json(), c = {
            ...s,
            // Keep device-specific settings (theme, buttons)
            ...i,
            // Override with server preferences (experimentalThemes, alwaysVerticalLayout)
            // Ensure device-specific settings are never overwritten by server
            theme: s.theme,
            showCompleteButton: s.showCompleteButton,
            showDeleteButton: s.showDeleteButton,
            showTagButton: s.showTagButton
          };
          return await o.savePreferences(c), console.log("[api] Synced server preferences, preserved device-specific settings"), c;
        }
      } catch (n) {
        console.warn("[api] Failed to fetch preferences from server, using localStorage:", n);
      }
      return s;
    },
    async savePreferences(s) {
      await o.savePreferences(s);
      const { theme: n, showCompleteButton: i, showDeleteButton: c, showTagButton: d, ...p } = s;
      Object.keys(p).length > 0 && fetch("/task/api/preferences", {
        method: "PUT",
        headers: W(t, e, a),
        body: JSON.stringify(p)
      }).then(() => console.log("[api] Background sync: savePreferences completed (server-only)")).catch((u) => console.error("[api] Failed to sync savePreferences:", u));
    },
    // Batch operations
    async batchUpdateTags(s, n) {
      await o.batchUpdateTags(s, n), fetch("/task/api/batch-tag", {
        method: "PATCH",
        headers: W(t, e, a),
        body: JSON.stringify({ boardId: s, updates: n })
      }).then(() => console.log("[api] Background sync: batchUpdateTags completed")).catch((i) => console.error("[api] Failed to sync batchUpdateTags:", i));
    },
    async batchMoveTasks(s, n, i) {
      const c = await o.batchMoveTasks(s, n, i);
      return fetch("/task/api/batch-move", {
        method: "POST",
        headers: W(t, e, a),
        body: JSON.stringify({ sourceBoardId: s, targetBoardId: n, taskIds: i })
      }).then(() => console.log("[api] Background sync: batchMoveTasks completed")).catch((d) => console.error("[api] Failed to sync batchMoveTasks:", d)), c;
    },
    async batchClearTag(s, n, i) {
      await o.batchClearTag(s, n, i), fetch("/task/api/batch-clear-tag", {
        method: "POST",
        headers: W(t, e, a),
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
          headers: W(t, e, a),
          body: JSON.stringify({ newUserId: s })
        })).json();
      } catch (n) {
        return console.error("[api] Failed to set userId:", n), { ok: !1, message: "Failed to set userId" };
      }
    }
  };
}
function Zt(t) {
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
function Qt(t, e = 6, a = []) {
  const o = t.flatMap((n) => n.tag?.split(" ") || []).filter(Boolean), s = {};
  return o.forEach((n) => s[n] = (s[n] || 0) + 1), a.filter(Boolean).forEach((n) => {
    s[n] || (s[n] = 0);
  }), Object.entries(s).sort((n, i) => i[1] - n[1]).slice(0, e).map(([n]) => n);
}
function ze(t, e) {
  return t.filter((a) => a.tag?.split(" ").includes(e));
}
function ea(t, e, a) {
  const o = Array.isArray(a) && a.length > 0;
  return t.filter((s) => {
    const n = s.tag?.split(" ") || [];
    return o ? a.some((c) => n.includes(c)) && !e.some((c) => n.includes(c)) : !e.some((i) => n.includes(i));
  });
}
function Ie(t) {
  return Array.from(new Set(t.flatMap((e) => e.tag?.split(" ") || []).filter(Boolean)));
}
async function Ye(t, e, a, o, s = {}) {
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
function Te(t, e) {
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
function ta({ userType: t, userId: e, sessionId: a }) {
  const [o, s] = A([]), [n, i] = A(/* @__PURE__ */ new Set()), c = lt(
    () => we(t, e || "public", a),
    [t, e, a]
  ), [d, p] = A(null), [u, w] = A("main");
  async function I() {
    console.log("[useTasks] initialLoad called"), "syncFromApi" in c && await c.syncFromApi(), await y();
  }
  async function y() {
    console.log("[useTasks] reload called", { currentBoardId: u, stack: new Error().stack?.split(`
`).slice(1, 4).join(`
`) });
    const k = await c.getBoards();
    p(k);
    const { tasks: f } = Te(k, u);
    s(f);
  }
  Z(() => {
    console.log("[useTasks] User context changed, clearing state and reloading", { userType: t, userId: e }), s([]), i(/* @__PURE__ */ new Set()), p(null), w("main"), y();
  }, [t, e]), Z(() => {
    console.log("[useTasks] Setting up BroadcastChannel listener", { currentBoardId: u, userType: t, userId: e });
    try {
      const k = new BroadcastChannel("tasks");
      return k.onmessage = (f) => {
        const g = f.data || {};
        if (console.log("[useTasks] BroadcastChannel message received", { msg: g, sessionId: H, currentBoardId: u, currentContext: { userType: t, userId: e } }), g.sessionId === H) {
          console.log("[useTasks] Ignoring own broadcast message");
          return;
        }
        if (g.userType !== t || g.userId !== e) {
          console.log("[useTasks] Ignoring message for different user context", {
            msgContext: { userType: g.userType, userId: g.userId },
            currentContext: { userType: t, userId: e }
          });
          return;
        }
        (g.type === "tasks-updated" || g.type === "boards-updated") && (console.log("[useTasks] BroadcastChannel: triggering reload for currentBoardId =", u), y());
      }, () => {
        console.log("[useTasks] Cleaning up BroadcastChannel listener", { currentBoardId: u }), k.close();
      };
    } catch (k) {
      console.error("[useTasks] Failed to setup BroadcastChannel", k);
    }
  }, [u, t, e]);
  async function N(k) {
    if (k = k.trim(), !!k)
      try {
        const f = Zt(k);
        return await c.createTask(f, u), await y(), !0;
      } catch (f) {
        return alert(f.message || "Failed to create task"), !1;
      }
  }
  async function $(k) {
    await Ye(
      `complete-${k}`,
      n,
      i,
      async () => {
        await c.completeTask(k, u), await y();
      },
      {
        onError: (f) => alert(f.message || "Failed to complete task")
      }
    );
  }
  async function O(k) {
    console.log("[useTasks] deleteTask START", { taskId: k, currentBoardId: u }), await Ye(
      `delete-${k}`,
      n,
      i,
      async () => {
        console.log("[useTasks] deleteTask: calling api.deleteTask", { taskId: k, currentBoardId: u }), await c.deleteTask(k, u), console.log("[useTasks] deleteTask: calling reload"), await y(), console.log("[useTasks] deleteTask END");
      },
      {
        onError: (f) => alert(f.message || "Failed to delete task")
      }
    );
  }
  async function j(k) {
    const f = prompt("Enter tag (without #):");
    if (!f) return;
    const g = f.trim().replace(/^#+/, "").replace(/\s+/g, "-"), h = o.find((x) => x.id === k);
    if (!h) return;
    const b = h.tag?.split(" ") || [];
    if (b.includes(g)) return;
    const S = [...b, g].join(" ");
    try {
      await c.patchTask(k, { tag: S }, u), await y();
    } catch (x) {
      alert(x.message || "Failed to add tag");
    }
  }
  async function q(k, f, g = {}) {
    const { suppressBroadcast: h = !1, skipReload: b = !1 } = g;
    try {
      await c.patchTask(k, f, u, h), b || await y();
    } catch (S) {
      throw S;
    }
  }
  async function K(k) {
    console.log("[useTasks] bulkUpdateTaskTags START", { count: k.length });
    try {
      await c.batchUpdateTags(
        u,
        k.map((f) => ({ taskId: f.taskId, tag: f.tag || null }))
      ), console.log("[useTasks] bulkUpdateTaskTags: calling reload"), await y(), console.log("[useTasks] bulkUpdateTaskTags END");
    } catch (f) {
      throw console.error("[useTasks] bulkUpdateTaskTags ERROR", f), f;
    }
  }
  async function X(k) {
    console.log("[useTasks] deleteTag START", { tag: k, currentBoardId: u, taskCount: o.length });
    const f = o.filter((g) => g.tag?.split(" ").includes(k));
    if (console.log("[useTasks] deleteTag: found tasks with tag", { tag: k, count: f.length }), f.length === 0) {
      console.log("[useTasks] deleteTag: no tasks found with this tag, just deleting tag");
      try {
        await c.deleteTag(k, u), await y(), console.log("[useTasks] deleteTag END (no tasks to clear)");
      } catch (g) {
        console.error("[useTasks] deleteTag ERROR", g), console.error("[useTasks] deleteTag: Please fix this error:", g.message);
      }
      return;
    }
    try {
      console.log("[useTasks] deleteTag: starting batch clear"), await c.batchClearTag(
        u,
        k,
        f.map((g) => g.id)
      ), console.log("[useTasks] deleteTag: calling reload"), await y(), console.log("[useTasks] deleteTag END");
    } catch (g) {
      console.error("[useTasks] deleteTag ERROR", g), alert(g.message || "Failed to remove tag from tasks");
    }
  }
  async function V(k) {
    await c.createBoard(k), w(k);
    const f = await c.getBoards();
    p(f);
    const { tasks: g } = Te(f, k);
    s(g);
  }
  async function Q(k, f) {
    if (console.log("[useTasks] moveTasksToBoard START", { targetBoardId: k, ids: f, currentBoardId: u }), !d) return;
    const g = /* @__PURE__ */ new Set();
    for (const h of d.boards)
      for (const b of h.tasks || [])
        f.includes(b.id) && g.add(h.id);
    console.log("[useTasks] moveTasksToBoard: source boards", { sourceBoardIds: Array.from(g) });
    try {
      if (g.size === 1) {
        const S = Array.from(g)[0];
        console.log("[useTasks] moveTasksToBoard: using batch API"), await c.batchMoveTasks(S, k, f);
      } else
        throw console.error("[useTasks] moveTasksToBoard: Cannot move tasks from multiple boards at once"), new Error("Cannot move tasks from multiple boards at once");
      console.log("[useTasks] moveTasksToBoard: switching to target board", { targetBoardId: k }), w(k);
      const h = await c.getBoards();
      p(h);
      const { tasks: b } = Te(h, k);
      s(b), console.log("[useTasks] moveTasksToBoard END");
    } catch (h) {
      console.error("[useTasks] moveTasksToBoard ERROR", h), alert(h.message || "Failed to move tasks");
    }
  }
  async function z(k) {
    if (await c.deleteBoard(k), u === k) {
      w("main");
      const f = await c.getBoards();
      p(f);
      const { tasks: g } = Te(f, "main");
      s(g);
    } else
      await y();
  }
  async function ie(k) {
    await c.createTag(k, u), await y();
  }
  async function ce(k) {
    await c.deleteTag(k, u), await y();
  }
  function se(k) {
    w(k);
    const { tasks: f, foundBoard: g } = Te(d, k);
    g ? s(f) : y();
  }
  return {
    // Task state
    tasks: o,
    pendingOperations: n,
    // Task operations
    addTask: N,
    completeTask: $,
    deleteTask: O,
    addTagToTask: j,
    updateTaskTags: q,
    bulkUpdateTaskTags: K,
    deleteTag: X,
    // Board state
    boards: d,
    currentBoardId: u,
    // Board operations
    createBoard: V,
    deleteBoard: z,
    switchBoard: se,
    moveTasksToBoard: Q,
    createTagOnBoard: ie,
    deleteTagOnBoard: ce,
    // Lifecycle
    initialLoad: I,
    reload: y
  };
}
function aa({ tasks: t, onTaskUpdate: e, onBulkUpdate: a }) {
  const [o, s] = A(null), [n, i] = A(null), [c, d] = A(/* @__PURE__ */ new Set()), [p, u] = A(!1), [w, I] = A(null), [y, N] = A(null), $ = ve(null);
  function O(g) {
    let h = [];
    try {
      const b = g.dataTransfer.getData("application/x-hadoku-task-ids");
      b && (h = JSON.parse(b));
    } catch {
    }
    if (h.length === 0) {
      const b = g.dataTransfer.getData("text/plain");
      b && (h = [b]);
    }
    return h;
  }
  function j(g, h) {
    const b = c.has(h) && c.size > 0 ? Array.from(c) : [h];
    console.log("[useDragAndDrop] onDragStart", { taskId: h, idsToDrag: b, selectedCount: c.size }), g.dataTransfer.setData("text/plain", b[0]);
    try {
      g.dataTransfer.setData("application/x-hadoku-task-ids", JSON.stringify(b));
    } catch {
    }
    g.dataTransfer.effectAllowed = "copyMove";
    try {
      const S = g.currentTarget, x = S.closest && S.closest(".task-app__item") ? S.closest(".task-app__item") : S;
      x.classList.add("dragging");
      const B = x.cloneNode(!0);
      B.style.boxSizing = "border-box", B.style.width = `${x.offsetWidth}px`, B.style.height = `${x.offsetHeight}px`, B.style.opacity = "0.95", B.style.transform = "none", B.style.filter = "drop-shadow(0 6px 18px rgba(0,0,0,0.12))", B.classList.add("drag-image"), B.style.position = "absolute", B.style.top = "-9999px", B.style.left = "-9999px", document.body.appendChild(B), x.__dragImage = B, d((_) => {
        if (_.has(h)) return new Set(_);
        const M = new Set(_);
        return M.add(h), M;
      });
      try {
        const _ = x.closest(".task-app__tag-column");
        if (_) {
          const M = _.querySelector(".task-app__tag-header") || _.querySelector("h3"), v = (M && M.textContent || "").trim().replace(/^#/, "");
          if (v)
            try {
              g.dataTransfer.setData("application/x-hadoku-task-source", v);
            } catch {
            }
        }
      } catch {
      }
      try {
        const _ = x.getBoundingClientRect();
        let M = Math.round(g.clientX - _.left), P = Math.round(g.clientY - _.top);
        M = Math.max(0, Math.min(Math.round(B.offsetWidth - 1), M)), P = Math.max(0, Math.min(Math.round(B.offsetHeight - 1), P)), g.dataTransfer.setDragImage(B, M, P);
      } catch {
        g.dataTransfer.setDragImage(B, 0, 0);
      }
    } catch {
    }
  }
  function q(g) {
    try {
      const h = g.currentTarget;
      h.classList.remove("dragging");
      const b = h.__dragImage;
      b && b.parentNode && b.parentNode.removeChild(b), b && delete h.__dragImage;
    } catch {
    }
    try {
      Q();
    } catch {
    }
  }
  function K(g) {
    if (g.button === 0) {
      try {
        const h = g.target;
        if (!h || h.closest && h.closest(".task-app__item, .task-app__controls, button, input, textarea, .task-app__item-actions"))
          return;
      } catch {
      }
      u(!0), $.current = { x: g.clientX, y: g.clientY }, I({ x: g.clientX, y: g.clientY, w: 0, h: 0 }), d(/* @__PURE__ */ new Set());
      try {
        document.body.classList.add("marquee-selecting");
      } catch {
      }
    }
  }
  function X(g) {
    if (!p || !$.current) return;
    const h = $.current.x, b = $.current.y, S = g.clientX, x = g.clientY, B = Math.min(h, S), _ = Math.min(b, x), M = Math.abs(S - h), P = Math.abs(x - b);
    I({ x: B, y: _, w: M, h: P });
    const v = Array.from(document.querySelectorAll(".task-app__item")), R = /* @__PURE__ */ new Set();
    for (const L of v) {
      const U = L.getBoundingClientRect();
      if (!(U.right < B || U.left > B + M || U.bottom < _ || U.top > _ + P)) {
        const de = L.getAttribute("data-task-id");
        de && R.add(de), L.classList.add("selected");
      } else
        L.classList.remove("selected");
    }
    d(R);
  }
  function V(g) {
    u(!1), I(null), $.current = null;
    try {
      document.body.classList.remove("marquee-selecting");
    } catch {
    }
    try {
      N(Date.now());
    } catch {
    }
  }
  function Q() {
    d(/* @__PURE__ */ new Set()), Array.from(document.querySelectorAll(".task-app__item.selected")).forEach((h) => h.classList.remove("selected"));
  }
  Z(() => {
    function g(S) {
      if (S.button !== 0) return;
      const x = { target: S.target, clientX: S.clientX, clientY: S.clientY, button: S.button };
      try {
        K(x);
      } catch {
      }
    }
    function h(S) {
      const x = { clientX: S.clientX, clientY: S.clientY };
      try {
        X(x);
      } catch {
      }
    }
    function b(S) {
      const x = { clientX: S.clientX, clientY: S.clientY };
      try {
        V(x);
      } catch {
      }
    }
    return document.addEventListener("mousedown", g), document.addEventListener("mousemove", h), document.addEventListener("mouseup", b), () => {
      document.removeEventListener("mousedown", g), document.removeEventListener("mousemove", h), document.removeEventListener("mouseup", b);
    };
  }, []);
  function z(g, h) {
    g.preventDefault(), g.dataTransfer.dropEffect = "copy", s(h);
  }
  function ie(g) {
    g.currentTarget.contains(g.relatedTarget) || s(null);
  }
  async function ce(g, h) {
    g.preventDefault(), s(null), console.log("[useDragAndDrop] onDrop START", { targetTag: h });
    const b = O(g);
    if (b.length === 0) return;
    let S = null;
    try {
      const B = g.dataTransfer.getData("application/x-hadoku-task-source");
      B && (S = B);
    } catch {
    }
    console.log("[useDragAndDrop] onDrop: processing", { targetTag: h, ids: b, srcTag: S, taskCount: b.length });
    const x = [];
    for (const B of b) {
      const _ = t.find((L) => L.id === B);
      if (!_) continue;
      const M = _.tag?.split(" ").filter(Boolean) || [];
      if (h === "other") {
        if (M.length === 0) continue;
        x.push({ taskId: B, tag: "" });
        continue;
      }
      const P = M.includes(h);
      let v = M.slice();
      P || v.push(h), S && S !== h && (v = v.filter((L) => L !== S));
      const R = v.join(" ").trim();
      x.push({ taskId: B, tag: R });
    }
    console.log("[useDragAndDrop] onDrop: updating tasks", { updateCount: x.length });
    try {
      await a(x), console.log("[useDragAndDrop] onDrop: updates complete, clearing selection");
      try {
        Q();
      } catch {
      }
    } catch (B) {
      console.error("Failed to add tag to one or more tasks:", B), alert(B.message || "Failed to add tags");
    }
    console.log("[useDragAndDrop] onDrop END");
  }
  function se(g, h) {
    g.preventDefault(), g.dataTransfer.dropEffect = "copy", i(h);
  }
  function k(g) {
    g.currentTarget.contains(g.relatedTarget) || i(null);
  }
  async function f(g, h) {
    g.preventDefault(), i(null);
    const b = O(g);
    if (b.length === 0) return;
    console.log("[useDragAndDrop] onFilterDrop", { filterTag: h, ids: b, taskCount: b.length });
    const S = [];
    for (const x of b) {
      const B = t.find((P) => P.id === x);
      if (!B) continue;
      const _ = B.tag?.split(" ").filter(Boolean) || [];
      if (_.includes(h)) {
        console.log(`Task ${x} already has tag: ${h}`);
        continue;
      }
      const M = [..._, h].join(" ");
      S.push({ taskId: x, tag: M });
    }
    if (S.length === 0) {
      console.log("No updates needed - all tasks already have this tag");
      return;
    }
    console.log(`Adding tag "${h}" to ${S.length} task(s) via filter drop`);
    try {
      await a(S);
      try {
        Q();
      } catch {
      }
    } catch (x) {
      console.error("Failed to add tag via filter drop:", x), alert(x.message || "Failed to add tag");
    }
  }
  return {
    dragOverTag: o,
    dragOverFilter: n,
    setDragOverFilter: i,
    selectedIds: c,
    isSelecting: p,
    marqueeRect: w,
    selectionJustEndedAt: y,
    // selection handlers
    selectionStartHandler: K,
    selectionMoveHandler: X,
    selectionEndHandler: V,
    clearSelection: Q,
    onDragStart: j,
    onDragEnd: q,
    onDragOver: z,
    onDragLeave: ie,
    onDrop: ce,
    onFilterDragOver: se,
    onFilterDragLeave: k,
    onFilterDrop: f
  };
}
function sa() {
  const [t, e] = A({});
  function a(i) {
    e((c) => {
      const p = (c[i] || "desc") === "desc" ? "asc" : "desc";
      return { ...c, [i]: p };
    });
  }
  function o(i, c) {
    return [...i].sort((d, p) => {
      const u = new Date(d.createdAt).getTime(), w = new Date(p.createdAt).getTime();
      return c === "asc" ? u - w : w - u;
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
function dt({ onLongPress: t, delay: e = 500 }) {
  const a = ve(null);
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
function Fe(t) {
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
function na({
  board: t,
  isActive: e,
  isDragOver: a,
  onSwitch: o,
  onContextMenu: s,
  onDragOverFilter: n,
  onMoveTasksToBoard: i,
  onClearSelection: c
}) {
  const d = dt({
    onLongPress: (u, w) => s(t.id, u, w)
  }), p = t.id === "main";
  return /* @__PURE__ */ r(
    "button",
    {
      className: `board-btn ${e ? "board-btn--active" : ""} ${a ? "board-btn--drag-over" : ""}`,
      onClick: () => o(t.id),
      onContextMenu: (u) => {
        u.preventDefault(), !p && s(t.id, u.clientX, u.clientY);
      },
      ...p ? {} : d,
      "aria-pressed": e ? "true" : "false",
      onDragOver: (u) => {
        u.preventDefault(), u.dataTransfer.dropEffect = "move", n(`board:${t.id}`);
      },
      onDragLeave: (u) => {
        n(null);
      },
      onDrop: async (u) => {
        u.preventDefault(), n(null);
        const w = Fe(u.dataTransfer);
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
function oa({
  tag: t,
  isActive: e,
  isDragOver: a,
  onToggle: o,
  onContextMenu: s,
  onDragOver: n,
  onDragLeave: i,
  onDrop: c
}) {
  const d = dt({
    onLongPress: (p, u) => s(t, p, u)
  });
  return /* @__PURE__ */ T(
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
function ra(t) {
  const e = /* @__PURE__ */ new Date(), a = new Date(t), o = e.getTime() - a.getTime(), s = Math.floor(o / 1e3), n = Math.floor(s / 60), i = Math.floor(n / 60), c = Math.floor(i / 24);
  return s < 60 ? `${s}s ago` : n < 60 ? `${n}m ago` : i < 24 ? `${i}h ago` : `${c}d ago`;
}
const ae = {
  width: 20,
  height: 20,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round"
}, ia = () => /* @__PURE__ */ T("svg", { ...ae, children: [
  /* @__PURE__ */ r("circle", { cx: "12", cy: "12", r: "5" }),
  /* @__PURE__ */ r("line", { x1: "12", y1: "1", x2: "12", y2: "3" }),
  /* @__PURE__ */ r("line", { x1: "12", y1: "21", x2: "12", y2: "23" }),
  /* @__PURE__ */ r("line", { x1: "4.22", y1: "4.22", x2: "5.64", y2: "5.64" }),
  /* @__PURE__ */ r("line", { x1: "18.36", y1: "18.36", x2: "19.78", y2: "19.78" }),
  /* @__PURE__ */ r("line", { x1: "1", y1: "12", x2: "3", y2: "12" }),
  /* @__PURE__ */ r("line", { x1: "21", y1: "12", x2: "23", y2: "12" }),
  /* @__PURE__ */ r("line", { x1: "4.22", y1: "19.78", x2: "5.64", y2: "18.36" }),
  /* @__PURE__ */ r("line", { x1: "18.36", y1: "5.64", x2: "19.78", y2: "4.22" })
] }), ut = () => /* @__PURE__ */ r("svg", { ...ae, children: /* @__PURE__ */ r("path", { d: "M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" }) }), Ge = () => /* @__PURE__ */ T("svg", { ...ae, children: [
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
] }), Ze = () => /* @__PURE__ */ T("svg", { ...ae, children: [
  /* @__PURE__ */ r("path", { d: "M2 12c2-2 4-2 6 0s4 2 6 0 4-2 6 0" }),
  /* @__PURE__ */ r("path", { d: "M2 17c2-2 4-2 6 0s4 2 6 0 4-2 6 0" }),
  /* @__PURE__ */ r("path", { d: "M2 7c2-2 4-2 6 0s4 2 6 0 4-2 6 0" })
] }), Qe = () => /* @__PURE__ */ r("svg", { ...ae, children: /* @__PURE__ */ r("polygon", { points: "13 2 3 14 12 14 11 22 21 10 12 10 13 2" }) }), et = () => /* @__PURE__ */ T("svg", { ...ae, children: [
  /* @__PURE__ */ r("path", { d: "M18 8h1a4 4 0 0 1 0 8h-1" }),
  /* @__PURE__ */ r("path", { d: "M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" }),
  /* @__PURE__ */ r("line", { x1: "6", y1: "1", x2: "6", y2: "4" }),
  /* @__PURE__ */ r("line", { x1: "10", y1: "1", x2: "10", y2: "4" }),
  /* @__PURE__ */ r("line", { x1: "14", y1: "1", x2: "14", y2: "4" })
] }), tt = () => /* @__PURE__ */ T("svg", { ...ae, children: [
  /* @__PURE__ */ r("circle", { cx: "12", cy: "12", r: "2", fill: "currentColor" }),
  /* @__PURE__ */ r("circle", { cx: "12", cy: "6", r: "2.5", fill: "none", stroke: "currentColor", strokeWidth: "2" }),
  /* @__PURE__ */ r("circle", { cx: "18", cy: "10", r: "2.5", fill: "none", stroke: "currentColor", strokeWidth: "2" }),
  /* @__PURE__ */ r("circle", { cx: "16", cy: "16", r: "2.5", fill: "none", stroke: "currentColor", strokeWidth: "2" }),
  /* @__PURE__ */ r("circle", { cx: "8", cy: "16", r: "2.5", fill: "none", stroke: "currentColor", strokeWidth: "2" }),
  /* @__PURE__ */ r("circle", { cx: "6", cy: "10", r: "2.5", fill: "none", stroke: "currentColor", strokeWidth: "2" })
] }), at = () => /* @__PURE__ */ r("svg", { ...ae, children: /* @__PURE__ */ r("path", { d: "M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z", fill: "currentColor" }) }), ca = () => /* @__PURE__ */ T("svg", { ...ae, children: [
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
] }), la = () => /* @__PURE__ */ T("svg", { ...ae, width: 16, height: 16, viewBox: "0 0 20 20", children: [
  /* @__PURE__ */ r(
    "path",
    {
      d: "M2 4 L12 4 L16 10 L12 16 L2 16 Z",
      fill: "currentColor"
    }
  ),
  /* @__PURE__ */ r("circle", { cx: "6", cy: "10", r: "1.5", fill: "white" })
] });
function Oe({
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
  showCompleteButton: u = !0,
  showDeleteButton: w = !0,
  showTagButton: I = !1
}) {
  const y = a.has(`complete-${t.id}`), N = a.has(`delete-${t.id}`);
  return /* @__PURE__ */ T(
    "li",
    {
      className: `task-app__item ${p ? "selected" : ""}`,
      "data-task-id": t.id,
      draggable: e,
      onDragStart: c ? ($) => c($, t.id) : void 0,
      onDragEnd: ($) => {
        if ($.currentTarget.classList.remove("dragging"), d)
          try {
            d($);
          } catch {
          }
      },
      children: [
        /* @__PURE__ */ T("div", { className: "task-app__item-content", children: [
          /* @__PURE__ */ r("div", { className: "task-app__item-title", title: t.title, children: t.title }),
          /* @__PURE__ */ T("div", { className: "task-app__item-meta-row", children: [
            t.tag ? /* @__PURE__ */ r("div", { className: "task-app__item-tag", children: t.tag.split(" ").sort().map(($) => `#${$}`).join(" ") }) : /* @__PURE__ */ r("div", {}),
            /* @__PURE__ */ r("div", { className: "task-app__item-age", children: ra(t.createdAt) })
          ] })
        ] }),
        /* @__PURE__ */ T("div", { className: "task-app__item-actions", children: [
          I && /* @__PURE__ */ r(
            "button",
            {
              className: "task-app__action-btn task-app__edit-tag-btn",
              onClick: () => i(t.id),
              title: "Edit tags",
              disabled: y || N,
              children: /* @__PURE__ */ r(la, {})
            }
          ),
          u && /* @__PURE__ */ r(
            "button",
            {
              className: "task-app__action-btn task-app__complete-btn",
              onClick: () => o(t.id),
              title: "Complete task",
              disabled: y || N,
              children: y ? "⏳" : "✓"
            }
          ),
          w && /* @__PURE__ */ r(
            "button",
            {
              className: "task-app__action-btn task-app__delete-btn",
              onClick: () => s(t.id),
              title: "Delete task",
              disabled: y || N,
              children: N ? "⏳" : "×"
            }
          )
        ] })
      ]
    }
  );
}
function st(t, e = !1) {
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
function da({
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
  onEditTag: u,
  onDragStart: w,
  onDragEnd: I,
  selectedIds: y,
  onSelectionStart: N,
  onSelectionMove: $,
  onSelectionEnd: O,
  onDragOver: j,
  onDragLeave: q,
  onDrop: K,
  toggleSort: X,
  sortTasksByAge: V,
  getSortIcon: Q,
  getSortTitle: z,
  deleteTag: ie,
  onDeletePersistedTag: ce,
  showCompleteButton: se = !0,
  showDeleteButton: k = !0,
  showTagButton: f = !1
}) {
  const g = (v, R) => /* @__PURE__ */ T(
    "div",
    {
      className: `task-app__tag-column ${n === v ? "task-app__tag-column--drag-over" : ""}`,
      onDragOver: (L) => j(L, v),
      onDragLeave: q,
      onDrop: (L) => K(L, v),
      children: [
        /* @__PURE__ */ T("div", { className: "task-app__tag-header-row", children: [
          /* @__PURE__ */ T("h3", { className: "task-app__tag-header", children: [
            "#",
            v
          ] }),
          /* @__PURE__ */ r(
            "button",
            {
              className: "task-app__sort-btn task-app__sort-btn--active",
              onClick: () => X(v),
              title: z(s[v] || "desc"),
              children: Q(s[v] || "desc")
            }
          )
        ] }),
        /* @__PURE__ */ r("ul", { className: "task-app__list task-app__list--column", children: V(R, s[v] || "desc").map((L) => /* @__PURE__ */ r(
          Oe,
          {
            task: L,
            isDraggable: !0,
            pendingOperations: i,
            onComplete: c,
            onDelete: d,
            onAddTag: p,
            onEditTag: u,
            onDragStart: w,
            onDragEnd: I,
            selected: y ? y.has(L.id) : !1,
            showCompleteButton: se,
            showDeleteButton: k,
            showTagButton: f
          },
          L.id
        )) })
      ]
    },
    v
  ), h = (v, R) => {
    let L = ze(t, v);
    return S && (L = L.filter((U) => {
      const le = U.tag?.split(" ") || [];
      return o.some((de) => le.includes(de));
    })), L.slice(0, R);
  }, b = e.length, S = Array.isArray(o) && o.length > 0, x = t.filter((v) => {
    if (!S) return !0;
    const R = v.tag?.split(" ") || [];
    return o.some((L) => R.includes(L));
  }), B = st(b, a), _ = S ? e.filter((v) => ze(t, v).some((L) => {
    const U = L.tag?.split(" ") || [];
    return o.some((le) => U.includes(le));
  })) : e.slice(0, B.useTags);
  if (_.length === 0)
    return /* @__PURE__ */ r("ul", { className: "task-app__list", children: x.map((v) => /* @__PURE__ */ r(
      Oe,
      {
        task: v,
        pendingOperations: i,
        onComplete: c,
        onDelete: d,
        onAddTag: p,
        onEditTag: u,
        onDragStart: w,
        onDragEnd: I,
        selected: y ? y.has(v.id) : !1,
        showCompleteButton: se,
        showDeleteButton: k,
        showTagButton: f
      },
      v.id
    )) });
  const M = ea(t, e, o).filter((v) => {
    if (!S) return !0;
    const R = v.tag?.split(" ") || [];
    return o.some((L) => R.includes(L));
  }), P = st(_.length, a);
  return /* @__PURE__ */ T("div", { className: "task-app__dynamic-layout", children: [
    P.rows.length > 0 && /* @__PURE__ */ r(Et, { children: P.rows.map((v, R) => /* @__PURE__ */ r("div", { className: `task-app__tag-grid task-app__tag-grid--${v.columns}col`, children: v.tagIndices.map((L) => {
      const U = _[L];
      return U ? g(U, h(U, P.maxPerColumn)) : null;
    }) }, R)) }),
    M.length > 0 && /* @__PURE__ */ T(
      "div",
      {
        className: `task-app__remaining ${n === "other" ? "task-app__tag-column--drag-over" : ""}`,
        onDragOver: (v) => {
          v.preventDefault(), v.dataTransfer.dropEffect = "move", j(v, "other");
        },
        onDragLeave: (v) => q(v),
        onDrop: (v) => K(v, "other"),
        children: [
          /* @__PURE__ */ T("div", { className: "task-app__tag-header-row", children: [
            /* @__PURE__ */ r("h3", { className: "task-app__remaining-header", children: "Other Tasks" }),
            /* @__PURE__ */ r(
              "button",
              {
                className: "task-app__sort-btn task-app__sort-btn--active",
                onClick: () => X("other"),
                title: z(s.other || "desc"),
                children: Q(s.other || "desc")
              }
            )
          ] }),
          /* @__PURE__ */ r("ul", { className: "task-app__list", children: V(M, s.other || "desc").map((v) => /* @__PURE__ */ r(
            Oe,
            {
              task: v,
              pendingOperations: i,
              onComplete: c,
              onDelete: d,
              onAddTag: p,
              onEditTag: u,
              onDragStart: w,
              onDragEnd: I,
              selected: y ? y.has(v.id) : !1,
              showCompleteButton: se,
              showDeleteButton: k,
              showTagButton: f
            },
            v.id
          )) })
        ]
      }
    )
  ] });
}
function ye({
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
  confirmDisabled: u = !1,
  confirmDanger: w = !1
}) {
  return t ? /* @__PURE__ */ r(
    "div",
    {
      className: "modal-overlay",
      onClick: a,
      children: /* @__PURE__ */ T(
        "div",
        {
          className: "modal-card",
          onClick: (y) => y.stopPropagation(),
          children: [
            /* @__PURE__ */ r("h3", { children: e }),
            s,
            i && /* @__PURE__ */ r(
              "input",
              {
                type: "text",
                className: "modal-input",
                value: n || "",
                onChange: (y) => i(y.target.value),
                placeholder: c,
                autoFocus: !0,
                onKeyDown: (y) => {
                  y.key === "Enter" && !u && (y.preventDefault(), o()), y.key === "Escape" && (y.preventDefault(), a());
                }
              }
            ),
            /* @__PURE__ */ T("div", { className: "modal-actions", children: [
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
                  disabled: u,
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
function nt({ isOpen: t, x: e, y: a, items: o, className: s = "board-context-menu" }) {
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
const ot = [
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
function ua() {
  return ot[Math.floor(Math.random() * ot.length)];
}
const rt = 768;
function ga() {
  const [t, e] = A(() => typeof window > "u" ? !1 : window.innerWidth < rt);
  return Z(() => {
    if (typeof window > "u") return;
    const a = window.matchMedia(`(max-width: ${rt - 1}px)`), o = (s) => {
      e(s.matches);
    };
    return a.addEventListener ? a.addEventListener("change", o) : a.addListener(o), o(a), () => {
      a.removeEventListener ? a.removeEventListener("change", o) : a.removeListener(o);
    };
  }, []), t;
}
const it = [
  {
    lightIcon: /* @__PURE__ */ r(ia, {}),
    darkIcon: /* @__PURE__ */ r(ut, {}),
    lightTheme: "light",
    darkTheme: "dark",
    lightLabel: "Light",
    darkLabel: "Dark"
  },
  {
    lightIcon: /* @__PURE__ */ r(Ge, {}),
    darkIcon: /* @__PURE__ */ r(Ge, {}),
    lightTheme: "strawberry-light",
    darkTheme: "strawberry-dark",
    lightLabel: "Strawberry Light",
    darkLabel: "Strawberry Dark"
  },
  {
    lightIcon: /* @__PURE__ */ r(Ze, {}),
    darkIcon: /* @__PURE__ */ r(Ze, {}),
    lightTheme: "ocean-light",
    darkTheme: "ocean-dark",
    lightLabel: "Ocean Light",
    darkLabel: "Ocean Dark"
  },
  {
    lightIcon: /* @__PURE__ */ r(Qe, {}),
    darkIcon: /* @__PURE__ */ r(Qe, {}),
    lightTheme: "cyberpunk-light",
    darkTheme: "cyberpunk-dark",
    lightLabel: "Cyberpunk Light",
    darkLabel: "Cyberpunk Dark"
  },
  {
    lightIcon: /* @__PURE__ */ r(et, {}),
    darkIcon: /* @__PURE__ */ r(et, {}),
    lightTheme: "coffee-light",
    darkTheme: "coffee-dark",
    lightLabel: "Coffee Light",
    darkLabel: "Coffee Dark"
  },
  {
    lightIcon: /* @__PURE__ */ r(tt, {}),
    darkIcon: /* @__PURE__ */ r(tt, {}),
    lightTheme: "lavender-light",
    darkTheme: "lavender-dark",
    lightLabel: "Lavender Light",
    darkLabel: "Lavender Dark"
  }
], pa = [
  {
    lightIcon: /* @__PURE__ */ r(at, {}),
    darkIcon: /* @__PURE__ */ r(at, {}),
    lightTheme: "pink-light",
    darkTheme: "pink-dark",
    lightLabel: "Pink Light",
    darkLabel: "Pink Dark"
  }
];
function gt(t) {
  return t ? [...it, ...pa] : it;
}
function ha(t, e) {
  const o = gt(e).find(
    (s) => s.lightTheme === t || s.darkTheme === t
  );
  return o ? t.endsWith("-dark") || t === "dark" ? o.darkIcon : o.lightIcon : /* @__PURE__ */ r(ut, {});
}
const ct = 5;
function ma(t = {}) {
  const { userType: e = "public", userId: a = "public", sessionId: o } = t, s = ga(), [n] = A(() => ua()), [i, c] = A(/* @__PURE__ */ new Set()), [d, p] = A(null), [u, w] = A(!1), [I, y] = A(!1), [N, $] = A(null), [O, j] = A(""), [q, K] = A(null), [X, V] = A(!1), [Q, z] = A(!1), [ie, ce] = A(!1), [se, k] = A(!1), [f, g] = A({
    version: 1,
    updatedAt: (/* @__PURE__ */ new Date()).toISOString(),
    experimentalThemes: !1,
    alwaysVerticalLayout: !1,
    // Device-specific defaults
    theme: "light",
    showCompleteButton: !0,
    showDeleteButton: !0,
    showTagButton: !1
  }), h = f.theme || "light", b = f.showCompleteButton ?? !0, S = f.showDeleteButton ?? !0, x = f.showTagButton ?? !1, B = (l) => he({ theme: l }), [_, M] = A(""), [P, v] = A(""), [R, L] = A(null), [U, le] = A(!1), [de, be] = A(null), [me, Be] = A(!1), [ne, xe] = A(null), [oe, Ae] = A(null), [ue, fe] = A(null), [Ne, Se] = A(""), ge = ve(null), _e = ve(null), Le = ve(null), Re = s || f.alwaysVerticalLayout || !1, {
    tasks: re,
    pendingOperations: pt,
    initialLoad: Ue,
    addTask: ht,
    completeTask: mt,
    deleteTask: ft,
    addTagToTask: kt,
    updateTaskTags: Ke,
    bulkUpdateTaskTags: Je,
    deleteTag: We,
    // board API
    boards: Y,
    currentBoardId: pe,
    createBoard: Tt,
    deleteBoard: yt,
    switchBoard: wt,
    moveTasksToBoard: He,
    createTagOnBoard: je,
    deleteTagOnBoard: vt
  } = ta({ userType: e, userId: a, sessionId: o }), D = aa({
    tasks: re,
    onTaskUpdate: Ke,
    onBulkUpdate: Je
  }), ke = sa(), bt = lt(
    () => gt(f.experimentalThemes || !1),
    [f.experimentalThemes]
  );
  Z(() => {
    (async () => {
      console.log("[App] Loading preferences...", { userType: e, userId: a, sessionId: o });
      const C = await we(e, a, o).getPreferences();
      console.log("[App] Loaded preferences:", C), C && (g(C), console.log("[App] Applied preferences to state")), k(!0);
    })();
  }, [e, a, o]);
  const he = async (l) => {
    const m = { ...f, ...l, updatedAt: (/* @__PURE__ */ new Date()).toISOString() };
    g(m), await we(e, a, o).savePreferences(m);
  }, Xe = async () => {
    if (!(!_.trim() || U)) {
      le(!0), be(null);
      try {
        const m = await we(e, a, o).setUserId(_.trim());
        m.ok ? (sessionStorage.setItem("displayUserId", _.trim()), be(null), z(!1), M("")) : be(m.message || "Failed to update user ID");
      } catch {
        be("Failed to update user ID");
      } finally {
        le(!1);
      }
    }
  }, qe = async () => {
    if (!(!P.trim() || me)) {
      Be(!0), L(null);
      try {
        if (await we(e, a, o).validateKey(P.trim())) {
          const C = new URL(window.location.href);
          C.searchParams.set("key", P.trim()), window.location.href = C.toString();
        } else
          L("Invalid key"), Be(!1);
      } catch {
        L("Failed to validate key"), Be(!1);
      }
    }
  };
  Z(() => {
    (() => {
      try {
        const m = sessionStorage.getItem("theme"), C = sessionStorage.getItem("showCompleteButton"), E = sessionStorage.getItem("showDeleteButton"), J = sessionStorage.getItem("showTagButton"), F = {};
        if (m && !f.theme && (F.theme = m), C !== null && f.showCompleteButton === void 0 && (F.showCompleteButton = C === "true"), E !== null && f.showDeleteButton === void 0 && (F.showDeleteButton = E === "true"), J !== null && f.showTagButton === void 0 && (F.showTagButton = J === "true"), Object.keys(F).length > 0) {
          console.log("[App] Migrating settings from sessionStorage to localStorage:", F);
          const G = { ...f, ...F, updatedAt: (/* @__PURE__ */ new Date()).toISOString() };
          g(G), sessionStorage.removeItem("theme"), sessionStorage.removeItem("showCompleteButton"), sessionStorage.removeItem("showDeleteButton"), sessionStorage.removeItem("showTagButton");
        }
      } catch (m) {
        console.warn("[App] Failed to migrate settings:", m);
      }
    })();
  }, [f.theme, f.showCompleteButton, f.showDeleteButton, f.showTagButton]), Z(() => {
    if (!X) return;
    const l = (m) => {
      Le.current && !Le.current.contains(m.target) && V(!1);
    };
    return document.addEventListener("mousedown", l), () => document.removeEventListener("mousedown", l);
  }, [X]), Z(() => {
    const l = window.matchMedia("(prefers-color-scheme: dark)"), m = (C) => {
      const E = C.matches, J = h.replace(/-light$|-dark$/, ""), F = h.endsWith("-dark") ? "dark" : h.endsWith("-light") ? "light" : null;
      if (F && J !== "light" && J !== "dark") {
        const G = E ? "dark" : "light";
        if (F !== G) {
          const Ce = `${J}-${G}`;
          console.log(`[Theme] Auto-switching from ${h} to ${Ce} (Dark Reader/system preference)`), B(Ce);
        }
      }
    };
    return l.addEventListener ? l.addEventListener("change", m) : l.addListener(m), () => {
      l.removeEventListener ? l.removeEventListener("change", m) : l.removeListener(m);
    };
  }, [h]), Z(() => {
    c(/* @__PURE__ */ new Set());
  }, [pe]), Z(() => {
    console.log("[App] User context changed, initializing...", { userType: e, userId: a }), Ue(), ge.current?.focus();
  }, [e, a]), Z(() => {
    _e.current && _e.current.setAttribute("data-theme", h);
  }, [h]), Z(() => {
    if (!X && !ne && !oe) return;
    const l = (m) => {
      const C = m.target;
      C.closest(".theme-picker") || V(!1), C.closest(".board-context-menu") || xe(null), C.closest(".tag-context-menu") || Ae(null);
    };
    return document.addEventListener("mousedown", l), () => document.removeEventListener("mousedown", l);
  }, [X, ne, oe]);
  async function St(l) {
    await ht(l) && ge.current && (ge.current.value = "", ge.current.focus());
  }
  function Ct(l) {
    const m = re.filter((C) => C.tag?.split(" ").includes(l));
    p({ tag: l, count: m.length });
  }
  async function Dt(l) {
    const m = l.trim().replace(/\s+/g, "-");
    try {
      if (await je(m), N?.type === "apply-tag" && N.taskIds.length > 0) {
        const C = N.taskIds.map((E) => {
          const F = re.find((Ce) => Ce.id === E)?.tag?.split(" ").filter(Boolean) || [], G = [.../* @__PURE__ */ new Set([...F, m])];
          return { taskId: E, tag: G.join(" ") };
        });
        await Je(C), D.clearSelection();
      }
      $(null);
    } catch (C) {
      throw console.error("[App] Failed to create tag:", C), C;
    }
  }
  function Bt(l) {
    const m = re.find((C) => C.id === l);
    m && (fe({ taskId: l, currentTag: m.tag || null }), Se(""));
  }
  async function Ve() {
    if (!ue) return;
    const { taskId: l, currentTag: m } = ue, C = m?.split(" ").filter(Boolean) || [], E = Ne.trim() ? Ne.trim().replace(/\s+/g, "-").split("#").filter(Boolean).map((G) => G.trim()) : [];
    for (const G of E)
      await je(G);
    const F = [.../* @__PURE__ */ new Set([...C, ...E])].sort().join(" ");
    await Ke(l, { tag: F }), fe(null), Se("");
  }
  function xt(l) {
    if (!ue) return;
    const { taskId: m, currentTag: C } = ue, E = C?.split(" ").filter(Boolean) || [];
    if (E.includes(l)) {
      const F = E.filter((G) => G !== l).sort().join(" ");
      fe({ taskId: m, currentTag: F });
    } else {
      const F = [...E, l].sort().join(" ");
      fe({ taskId: m, currentTag: F });
    }
  }
  function Ee(l) {
    const m = l.trim();
    return m ? (Y?.boards?.map((E) => E.id.toLowerCase()) || []).includes(m.toLowerCase()) ? `Board "${m}" already exists` : null : "Board name cannot be empty";
  }
  async function At(l) {
    const m = l.trim(), C = Ee(m);
    if (C) {
      K(C);
      return;
    }
    try {
      await Tt(m), N?.type === "move-to-board" && N.taskIds.length > 0 && (await He(m, N.taskIds), D.clearSelection()), $(null), K(null);
    } catch (E) {
      console.error("[App] Failed to create board:", E), K(E.message || "Failed to create board");
    }
  }
  const Nt = Y?.boards?.find((l) => l.id === pe)?.tags || [], _t = Qt(re, Re ? 3 : 6), Lt = h.endsWith("-dark") || h === "dark";
  return se ? /* @__PURE__ */ r(
    "div",
    {
      ref: _e,
      className: "task-app-container",
      "data-dark-theme": Lt ? "true" : "false",
      onMouseDown: D.selectionStartHandler,
      onMouseMove: D.selectionMoveHandler,
      onMouseUp: D.selectionEndHandler,
      onMouseLeave: D.selectionEndHandler,
      onClick: (l) => {
        try {
          const m = l.target;
          if (!m.closest || !m.closest(".task-app__item")) {
            if (D.selectionJustEndedAt && Date.now() - D.selectionJustEndedAt < 300)
              return;
            D.clearSelection();
          }
        } catch {
        }
      },
      children: /* @__PURE__ */ T("div", { className: "task-app", children: [
        /* @__PURE__ */ T("div", { className: "task-app__header-container", children: [
          /* @__PURE__ */ T(
            "h1",
            {
              className: "task-app__header",
              onClick: () => z(!0),
              style: { cursor: "pointer" },
              title: "Settings",
              children: [
                "Tasks",
                e !== "public" ? ` - ${a || "user"}` : ""
              ]
            }
          ),
          /* @__PURE__ */ T("div", { className: "theme-picker", ref: Le, children: [
            /* @__PURE__ */ r(
              "button",
              {
                className: "theme-toggle-btn",
                onClick: () => V(!X),
                "aria-label": "Choose theme",
                title: "Choose theme",
                children: ha(h, f.experimentalThemes || !1)
              }
            ),
            X && /* @__PURE__ */ T("div", { className: "theme-picker__dropdown", children: [
              /* @__PURE__ */ r("div", { className: "theme-picker__pills", children: bt.map((l, m) => /* @__PURE__ */ T("div", { className: "theme-pill", children: [
                /* @__PURE__ */ r(
                  "button",
                  {
                    className: `theme-pill__btn theme-pill__btn--light ${h === l.lightTheme ? "active" : ""}`,
                    onClick: () => B(l.lightTheme),
                    title: l.lightLabel,
                    "aria-label": l.lightLabel,
                    children: /* @__PURE__ */ r("div", { className: "theme-pill__icon", children: l.lightIcon })
                  }
                ),
                /* @__PURE__ */ r(
                  "button",
                  {
                    className: `theme-pill__btn theme-pill__btn--dark ${h === l.darkTheme ? "active" : ""}`,
                    onClick: () => B(l.darkTheme),
                    title: l.darkLabel,
                    "aria-label": l.darkLabel,
                    children: /* @__PURE__ */ r("div", { className: "theme-pill__icon", children: l.darkIcon })
                  }
                )
              ] }, m)) }),
              /* @__PURE__ */ r(
                "button",
                {
                  className: "theme-picker__settings-icon",
                  onClick: () => {
                    z(!0), V(!1);
                  },
                  "aria-label": "Settings",
                  title: "Settings",
                  children: /* @__PURE__ */ r(ca, {})
                }
              )
            ] })
          ] })
        ] }),
        /* @__PURE__ */ T("div", { className: "task-app__boards", children: [
          /* @__PURE__ */ r("div", { className: "task-app__board-list", children: (Y && Y.boards ? Y.boards.slice(0, ct) : [{ id: "main", name: "main", tasks: [], tags: [] }]).map((l) => /* @__PURE__ */ r(
            na,
            {
              board: l,
              isActive: pe === l.id,
              isDragOver: D.dragOverFilter === `board:${l.id}`,
              onSwitch: wt,
              onContextMenu: (m, C, E) => xe({ boardId: m, x: C, y: E }),
              onDragOverFilter: D.setDragOverFilter,
              onMoveTasksToBoard: He,
              onClearSelection: D.clearSelection
            },
            l.id
          )) }),
          /* @__PURE__ */ T("div", { className: "task-app__board-actions", children: [
            (!Y || Y.boards && Y.boards.length < ct) && /* @__PURE__ */ r(
              "button",
              {
                className: `board-add-btn ${D.dragOverFilter === "add-board" ? "board-btn--drag-over" : ""}`,
                onClick: () => {
                  j(""), K(null), w(!0);
                },
                onDragOver: (l) => {
                  l.preventDefault(), l.dataTransfer.dropEffect = "move", D.setDragOverFilter("add-board");
                },
                onDragLeave: (l) => {
                  D.setDragOverFilter(null);
                },
                onDrop: async (l) => {
                  l.preventDefault(), D.setDragOverFilter(null);
                  const m = Fe(l.dataTransfer);
                  m.length > 0 && (j(""), $({ type: "move-to-board", taskIds: m }), w(!0));
                },
                "aria-label": "Create board",
                children: "＋"
              }
            ),
            e !== "public" && /* @__PURE__ */ r(
              "button",
              {
                className: `sync-btn ${ie ? "spinning" : ""}`,
                onClick: async (l) => {
                  if (ie) return;
                  console.log("[App] Manual refresh triggered"), ce(!0);
                  const m = l.currentTarget, C = new Promise((E, J) => {
                    setTimeout(() => J(new Error("Sync timeout")), 5e3);
                  });
                  try {
                    await Promise.race([Ue(), C]), console.log("[App] Sync completed successfully");
                  } catch (E) {
                    console.error("[App] Sync failed:", E);
                  } finally {
                    ce(!1), m && m.blur();
                  }
                },
                disabled: ie,
                title: "Sync from server",
                "aria-label": "Sync from server",
                children: /* @__PURE__ */ T("svg", { width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [
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
              l.key === "Enter" && !l.shiftKey && (l.preventDefault(), St(l.target.value)), l.key === "k" && (l.ctrlKey || l.metaKey) && (l.preventDefault(), ge.current?.focus());
            }
          }
        ) }),
        /* @__PURE__ */ T("div", { className: "task-app__filters", children: [
          (() => {
            const l = Ie(re);
            return Array.from(/* @__PURE__ */ new Set([...Nt, ...l])).map((C) => /* @__PURE__ */ r(
              oa,
              {
                tag: C,
                isActive: i.has(C),
                isDragOver: D.dragOverFilter === C,
                onToggle: (E) => {
                  c((J) => {
                    const F = new Set(J);
                    return F.has(E) ? F.delete(E) : F.add(E), F;
                  });
                },
                onContextMenu: (E, J, F) => Ae({ tag: E, x: J, y: F }),
                onDragOver: D.onFilterDragOver,
                onDragLeave: D.onFilterDragLeave,
                onDrop: D.onFilterDrop
              },
              C
            ));
          })(),
          /* @__PURE__ */ r(
            "button",
            {
              className: `task-app__filter-add ${D.dragOverFilter === "add-tag" ? "task-app__filter-drag-over" : ""}`,
              onClick: () => {
                j(""), y(!0);
              },
              onDragOver: (l) => {
                l.preventDefault(), l.dataTransfer.dropEffect = "copy", D.onFilterDragOver(l, "add-tag");
              },
              onDragLeave: D.onFilterDragLeave,
              onDrop: async (l) => {
                l.preventDefault(), D.onFilterDragLeave(l);
                const m = Fe(l.dataTransfer);
                m.length > 0 && (j(""), $({ type: "apply-tag", taskIds: m }), y(!0));
              },
              "aria-label": "Add tag",
              children: "＋"
            }
          )
        ] }),
        /* @__PURE__ */ r(
          da,
          {
            tasks: re,
            topTags: _t,
            isMobile: Re,
            filters: Array.from(i),
            selectedIds: D.selectedIds,
            onSelectionStart: D.selectionStartHandler,
            onSelectionMove: D.selectionMoveHandler,
            onSelectionEnd: D.selectionEndHandler,
            sortDirections: ke.sortDirections,
            dragOverTag: D.dragOverTag,
            pendingOperations: pt,
            onComplete: mt,
            onDelete: ft,
            onAddTag: kt,
            onEditTag: Bt,
            onDragStart: D.onDragStart,
            onDragEnd: D.onDragEnd,
            onDragOver: D.onDragOver,
            onDragLeave: D.onDragLeave,
            onDrop: D.onDrop,
            toggleSort: ke.toggleSort,
            sortTasksByAge: ke.sortTasksByAge,
            getSortIcon: ke.getSortIcon,
            getSortTitle: ke.getSortTitle,
            deleteTag: Ct,
            onDeletePersistedTag: vt,
            showCompleteButton: b,
            showDeleteButton: S,
            showTagButton: x
          }
        ),
        D.isSelecting && D.marqueeRect && /* @__PURE__ */ r(
          "div",
          {
            className: "marquee-overlay",
            style: {
              left: `${D.marqueeRect.x}px`,
              top: `${D.marqueeRect.y}px`,
              width: `${D.marqueeRect.w}px`,
              height: `${D.marqueeRect.h}px`
            }
          }
        ),
        /* @__PURE__ */ r(
          ye,
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
            children: d && /* @__PURE__ */ T("p", { children: [
              "This will remove ",
              /* @__PURE__ */ T("strong", { children: [
                "#",
                d.tag
              ] }),
              " from",
              " ",
              /* @__PURE__ */ T("strong", { children: [
                d.count,
                " task(s)"
              ] }),
              " and delete the tag from the board."
            ] })
          }
        ),
        /* @__PURE__ */ T(
          ye,
          {
            isOpen: u,
            title: "Create New Board",
            onClose: () => {
              w(!1), $(null), K(null);
            },
            onConfirm: async () => {
              if (!O.trim()) return;
              const l = Ee(O);
              if (l) {
                K(l);
                return;
              }
              w(!1), await At(O);
            },
            inputValue: O,
            onInputChange: (l) => {
              j(l), K(null);
            },
            inputPlaceholder: "Board name",
            confirmLabel: "Create",
            confirmDisabled: !O.trim() || Ee(O) !== null,
            children: [
              N?.type === "move-to-board" && N.taskIds.length > 0 && /* @__PURE__ */ T("p", { className: "modal-hint", children: [
                N.taskIds.length,
                " task",
                N.taskIds.length > 1 ? "s" : "",
                " will be moved to this board"
              ] }),
              q && /* @__PURE__ */ r("p", { className: "modal-error", style: { color: "var(--error-color, #d32f2f)", marginTop: "0.5rem" }, children: q })
            ]
          }
        ),
        /* @__PURE__ */ T(
          ye,
          {
            isOpen: I,
            title: "Create New Tag",
            onClose: () => {
              y(!1), $(null);
            },
            onConfirm: async () => {
              if (O.trim()) {
                y(!1);
                try {
                  await Dt(O);
                } catch (l) {
                  console.error("[App] Failed to create tag:", l);
                }
              }
            },
            inputValue: O,
            onInputChange: j,
            inputPlaceholder: "Enter new tag name",
            confirmLabel: "Create",
            confirmDisabled: !O.trim(),
            children: [
              N?.type === "apply-tag" && N.taskIds.length > 0 && /* @__PURE__ */ T("p", { className: "modal-hint", children: [
                "This tag will be applied to ",
                N.taskIds.length,
                " task",
                N.taskIds.length > 1 ? "s" : ""
              ] }),
              Ie(re).length > 0 && /* @__PURE__ */ T("div", { className: "modal-section", children: [
                /* @__PURE__ */ r("label", { className: "modal-label", children: "Existing tags:" }),
                /* @__PURE__ */ r("div", { className: "modal-tags-list", children: Ie(re).map((l) => /* @__PURE__ */ T("span", { className: "modal-tag-chip", children: [
                  "#",
                  l
                ] }, l)) })
              ] })
            ]
          }
        ),
        /* @__PURE__ */ T(
          ye,
          {
            isOpen: Q,
            title: "Settings",
            onClose: () => z(!1),
            onConfirm: () => z(!1),
            confirmLabel: "Close",
            cancelLabel: "Close",
            children: [
              /* @__PURE__ */ T("div", { className: "settings-section", children: [
                /* @__PURE__ */ r("h4", { className: "settings-section-title", children: "User Management" }),
                /* @__PURE__ */ T("div", { className: "settings-field", children: [
                  /* @__PURE__ */ r("label", { className: "settings-field-label", children: "Current User ID" }),
                  /* @__PURE__ */ T("div", { className: "settings-field-input-group", children: [
                    /* @__PURE__ */ r(
                      "input",
                      {
                        type: "text",
                        className: "settings-text-input",
                        value: _ || a,
                        onChange: (l) => M(l.target.value),
                        onKeyDown: (l) => {
                          l.key === "Enter" && _ && _ !== a && e !== "public" && !U && Xe();
                        },
                        placeholder: e === "public" ? "public" : a,
                        disabled: e === "public" || U
                      }
                    ),
                    _ && _ !== a && e !== "public" && /* @__PURE__ */ r(
                      "button",
                      {
                        className: "settings-field-button",
                        onClick: Xe,
                        disabled: U,
                        children: U ? /* @__PURE__ */ r("span", { className: "spinner" }) : "↵"
                      }
                    )
                  ] }),
                  de && /* @__PURE__ */ r("div", { className: "settings-error-message", children: de })
                ] }),
                /* @__PURE__ */ T("div", { className: "settings-field", children: [
                  /* @__PURE__ */ r("label", { className: "settings-field-label", children: "Enter New Key" }),
                  /* @__PURE__ */ T("div", { className: "settings-field-input-group", children: [
                    /* @__PURE__ */ r(
                      "input",
                      {
                        type: "password",
                        name: "key",
                        autoComplete: "key",
                        className: "settings-text-input",
                        value: P,
                        onChange: (l) => {
                          v(l.target.value), L(null);
                        },
                        onKeyDown: (l) => {
                          l.key === "Enter" && P && !me && qe();
                        },
                        placeholder: "Enter authentication key",
                        disabled: me
                      }
                    ),
                    P && /* @__PURE__ */ r(
                      "button",
                      {
                        className: "settings-field-button",
                        onClick: qe,
                        disabled: me,
                        children: me ? /* @__PURE__ */ r("span", { className: "spinner" }) : "↵"
                      }
                    )
                  ] }),
                  R && /* @__PURE__ */ r("span", { className: "settings-error", children: R })
                ] })
              ] }),
              /* @__PURE__ */ T("div", { className: "settings-section", children: [
                /* @__PURE__ */ r("h4", { className: "settings-section-title", children: "Preferences" }),
                /* @__PURE__ */ T("label", { className: "settings-option", children: [
                  /* @__PURE__ */ r(
                    "input",
                    {
                      type: "checkbox",
                      checked: f.experimentalThemes || !1,
                      onChange: (l) => {
                        he({ experimentalThemes: l.target.checked });
                      }
                    }
                  ),
                  /* @__PURE__ */ T("span", { className: "settings-label", children: [
                    /* @__PURE__ */ r("strong", { children: "Experimental Themes" }),
                    /* @__PURE__ */ r("span", { className: "settings-description", children: "Enable access to experimental theme options" })
                  ] })
                ] }),
                /* @__PURE__ */ T("label", { className: "settings-option", children: [
                  /* @__PURE__ */ r(
                    "input",
                    {
                      type: "checkbox",
                      checked: f.alwaysVerticalLayout || !1,
                      onChange: (l) => {
                        he({ alwaysVerticalLayout: l.target.checked });
                      }
                    }
                  ),
                  /* @__PURE__ */ T("span", { className: "settings-label", children: [
                    /* @__PURE__ */ r("strong", { children: "Always Use Vertical Layout" }),
                    /* @__PURE__ */ r("span", { className: "settings-description", children: "Use mobile-style vertical task layout on all devices" })
                  ] })
                ] }),
                /* @__PURE__ */ T("label", { className: "settings-option", children: [
                  /* @__PURE__ */ r(
                    "input",
                    {
                      type: "checkbox",
                      checked: !b,
                      onChange: (l) => {
                        he({ showCompleteButton: !l.target.checked });
                      }
                    }
                  ),
                  /* @__PURE__ */ T("span", { className: "settings-label", children: [
                    /* @__PURE__ */ r("strong", { children: "Disable Complete Button" }),
                    /* @__PURE__ */ r("span", { className: "settings-description", children: "Hide the checkmark (✓) button on task items" })
                  ] })
                ] }),
                /* @__PURE__ */ T("label", { className: "settings-option", children: [
                  /* @__PURE__ */ r(
                    "input",
                    {
                      type: "checkbox",
                      checked: !S,
                      onChange: (l) => {
                        he({ showDeleteButton: !l.target.checked });
                      }
                    }
                  ),
                  /* @__PURE__ */ T("span", { className: "settings-label", children: [
                    /* @__PURE__ */ r("strong", { children: "Disable Delete Button" }),
                    /* @__PURE__ */ r("span", { className: "settings-description", children: "Hide the delete (×) button on task items" })
                  ] })
                ] }),
                /* @__PURE__ */ T("label", { className: "settings-option", children: [
                  /* @__PURE__ */ r(
                    "input",
                    {
                      type: "checkbox",
                      checked: x,
                      onChange: (l) => {
                        he({ showTagButton: l.target.checked });
                      }
                    }
                  ),
                  /* @__PURE__ */ T("span", { className: "settings-label", children: [
                    /* @__PURE__ */ r("strong", { children: "Enable Tag Button" }),
                    /* @__PURE__ */ r("span", { className: "settings-description", children: "Show tag button on task items" })
                  ] })
                ] })
              ] })
            ]
          }
        ),
        /* @__PURE__ */ r(
          ye,
          {
            isOpen: !!ue,
            title: "Edit Tags",
            onClose: () => {
              fe(null), Se("");
            },
            onConfirm: Ve,
            confirmLabel: "Save",
            cancelLabel: "Cancel",
            children: /* @__PURE__ */ T("div", { className: "edit-tag-modal", children: [
              Y?.boards?.find((l) => l.id === pe)?.tags && Y.boards.find((l) => l.id === pe).tags.length > 0 && /* @__PURE__ */ T("div", { className: "edit-tag-pills", children: [
                /* @__PURE__ */ r("label", { className: "edit-tag-label", children: "Select Tags" }),
                /* @__PURE__ */ r("div", { className: "edit-tag-pills-container", children: [...Y.boards.find((l) => l.id === pe).tags].sort().map((l) => {
                  const C = (ue?.currentTag?.split(" ").filter(Boolean) || []).includes(l);
                  return /* @__PURE__ */ T(
                    "button",
                    {
                      className: `edit-tag-pill ${C ? "active" : ""}`,
                      onClick: () => xt(l),
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
              /* @__PURE__ */ T("div", { className: "edit-tag-field", children: [
                /* @__PURE__ */ r("label", { className: "edit-tag-label", children: "Add New Tag" }),
                /* @__PURE__ */ r(
                  "input",
                  {
                    type: "text",
                    className: "edit-tag-input",
                    value: Ne,
                    onChange: (l) => {
                      Se(l.target.value);
                    },
                    onKeyDown: (l) => {
                      l.key === "Enter" && (l.preventDefault(), Ve());
                    },
                    placeholder: "Enter a tag",
                    autoFocus: !0
                  }
                ),
                /* @__PURE__ */ T("div", { className: "edit-tag-hint", children: [
                  /* @__PURE__ */ r("div", { children: '"one tag" → #one-tag' }),
                  /* @__PURE__ */ r("div", { children: '"#two #tags" → #two #tags' })
                ] })
              ] })
            ] })
          }
        ),
        /* @__PURE__ */ r(
          nt,
          {
            isOpen: !!ne,
            x: ne?.x || 0,
            y: ne?.y || 0,
            items: [
              {
                label: "🗑️ Delete Board",
                isDanger: !0,
                onClick: async () => {
                  if (!ne) return;
                  const l = Y?.boards?.find((m) => m.id === ne.boardId)?.name || ne.boardId;
                  if (confirm(`Delete board "${l}"? All tasks on this board will be permanently deleted.`))
                    try {
                      await yt(ne.boardId), xe(null);
                    } catch (m) {
                      console.error("[App] Failed to delete board:", m), alert(m.message || "Failed to delete board");
                    }
                }
              }
            ]
          }
        ),
        /* @__PURE__ */ r(
          nt,
          {
            isOpen: !!oe,
            x: oe?.x || 0,
            y: oe?.y || 0,
            className: "tag-context-menu",
            items: [
              {
                label: "🗑️ Delete Tag",
                isDanger: !0,
                onClick: async () => {
                  if (console.log("[App] Delete Tag clicked!", { tagContextMenu: oe }), !oe) {
                    console.error("[App] No tagContextMenu when Delete Tag clicked!");
                    return;
                  }
                  try {
                    console.log("[App] Calling deleteTag for tag:", oe.tag), await We(oe.tag), console.log("[App] deleteTag completed successfully"), Ae(null);
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
  ) : null;
}
function wa(t, e = {}) {
  const a = new URLSearchParams(window.location.search), o = e.userType || a.get("userType") || "admin", s = e.userId || "test-admin", n = e.sessionId, i = { ...e, userType: o, userId: s, sessionId: n }, c = It(t);
  c.render(/* @__PURE__ */ r(ma, { ...i })), t.__root = c, console.log("[task-app] Mounted successfully", i);
}
function va(t) {
  t.__root?.unmount();
}
export {
  wa as mount,
  va as unmount
};
