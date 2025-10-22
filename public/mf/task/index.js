import { jsx as r, jsxs as T, Fragment as Bt } from "react/jsx-runtime";
import { createRoot as xt } from "react-dom/client";
import { useState as L, useMemo as st, useEffect as Z, useRef as Te } from "react";
const W = `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
class At {
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
function Nt() {
  const t = Date.now().toString(36).toUpperCase().padStart(8, "0"), e = crypto.getRandomValues(new Uint8Array(18)), a = Array.from(e).map((o) => (o % 36).toString(36).toUpperCase()).join("");
  return t + a;
}
function ae() {
  return (/* @__PURE__ */ new Date()).toISOString();
}
function _e(t, e) {
  const a = t.tasks.findIndex((o) => o.id === e);
  if (a < 0)
    throw new Error("Task not found");
  return { task: t.tasks[a], index: a };
}
function ve(t, e) {
  const a = t.boards.findIndex((o) => o.id === e);
  if (a < 0)
    throw new Error(`Board ${e} not found`);
  return { board: t.boards[a], index: a };
}
function Le(t, e, a, o) {
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
function _t(t, e, a) {
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
function Lt(t, e, a) {
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
function Ee(t, e, a) {
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
function Et(t, e, a) {
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
async function Ot(t, e) {
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
async function It(t, e, a, o = "main") {
  const s = ae(), n = await t.getTasks(e.userType, e.userId, o), i = await t.getStats(e.userType, e.userId, o), c = a.id || Nt(), d = a.createdAt || s, p = {
    id: c,
    title: a.title,
    tag: a.tag ?? null,
    state: "Active",
    createdAt: d
  }, g = {
    ...n,
    tasks: [p, ...n.tasks],
    updatedAt: s
  }, v = _t(i, p, s);
  return await t.saveTasks(e.userType, e.userId, o, g), await t.saveStats(e.userType, e.userId, o, v), { ok: !0, id: c };
}
async function $t(t, e, a, o, s = "main") {
  const n = ae(), i = await t.getTasks(e.userType, e.userId, s), c = await t.getStats(e.userType, e.userId, s), { task: d, index: p } = _e(i, a), g = {
    ...d,
    ...o,
    updatedAt: n
  }, v = [...i.tasks];
  v[p] = g;
  const O = {
    ...i,
    tasks: v,
    updatedAt: n
  }, w = Ee(c, g, n);
  return await t.saveTasks(e.userType, e.userId, s, O), await t.saveStats(e.userType, e.userId, s, w), { ok: !0, message: `Task ${a} updated` };
}
async function Ft(t, e, a, o = "main") {
  const s = ae(), n = await t.getTasks(e.userType, e.userId, o), i = await t.getStats(e.userType, e.userId, o), { task: c, index: d } = _e(n, a), p = {
    ...c,
    state: "Completed",
    closedAt: s,
    updatedAt: s
  }, g = [...n.tasks];
  g.splice(d, 1);
  const v = {
    ...n,
    tasks: g,
    updatedAt: s
  }, O = Lt(i, p, s);
  return await t.saveTasks(e.userType, e.userId, o, v), await t.saveStats(e.userType, e.userId, o, O), { ok: !0, message: `Task ${a} completed` };
}
async function Mt(t, e, a, o = "main") {
  const s = ae(), n = await t.getTasks(e.userType, e.userId, o), i = await t.getStats(e.userType, e.userId, o), { task: c, index: d } = _e(n, a), p = {
    ...c,
    state: "Deleted",
    closedAt: s,
    updatedAt: s
  }, g = [...n.tasks];
  g.splice(d, 1);
  const v = {
    ...n,
    tasks: g,
    updatedAt: s
  }, O = Et(i, p, s);
  return await t.saveTasks(e.userType, e.userId, o, v), await t.saveStats(e.userType, e.userId, o, O), { ok: !0, message: `Task ${a} deleted` };
}
async function Pt(t, e, a) {
  const o = ae(), s = await t.getBoards(e.userType, e.userId);
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
async function Rt(t, e, a) {
  if (a === "main")
    throw new Error("Cannot delete the main board");
  const o = ae(), s = await t.getBoards(e.userType, e.userId);
  ve(s, a);
  const n = {
    ...s,
    updatedAt: o,
    boards: s.boards.filter((i) => i.id !== a)
  };
  return await t.saveBoards(e.userType, n, e.userId), { ok: !0, message: `Board ${a} deleted` };
}
async function Ut(t, e, a) {
  const o = ae(), s = await t.getBoards(e.userType, e.userId), { board: n, index: i } = ve(s, a.boardId), c = n.tags || [];
  if (c.includes(a.tag))
    return { ok: !0, message: `Tag ${a.tag} already exists` };
  const d = {
    ...n,
    tags: [...c, a.tag]
  }, p = Le(s, i, d, o);
  return await t.saveBoards(e.userType, p, e.userId), { ok: !0, message: `Tag ${a.tag} added to board ${a.boardId}` };
}
async function Kt(t, e, a) {
  const o = ae(), s = await t.getBoards(e.userType, e.userId), { board: n, index: i } = ve(s, a.boardId), c = n.tags || [], d = {
    ...n,
    tags: c.filter((g) => g !== a.tag)
  }, p = Le(s, i, d, o);
  return await t.saveBoards(e.userType, p, e.userId), { ok: !0, message: `Tag ${a.tag} removed from board ${a.boardId}` };
}
async function Jt(t, e, a) {
  const o = ae(), s = await t.getTasks(e.userType, e.userId, a.boardId), n = await t.getStats(e.userType, e.userId, a.boardId);
  let i = 0;
  const c = s.tasks.map((g) => {
    const v = a.updates.find((O) => O.taskId === g.id);
    return v ? (i++, {
      ...g,
      tag: v.tag || void 0,
      updatedAt: o
    }) : g;
  }), d = {
    ...s,
    tasks: c,
    updatedAt: o
  };
  let p = n;
  for (const g of c)
    a.updates.find((v) => v.taskId === g.id) && (p = Ee(p, g, o));
  return await t.saveTasks(e.userType, e.userId, a.boardId, d), await t.saveStats(e.userType, e.userId, a.boardId, p), {
    ok: !0,
    message: `Updated ${i} task(s) on board ${a.boardId}`,
    updated: i
  };
}
async function Wt(t, e, a) {
  const o = ae(), s = await t.getTasks(e.userType, e.userId, a.boardId), n = await t.getStats(e.userType, e.userId, a.boardId), i = await t.getBoards(e.userType, e.userId);
  let c = 0;
  const d = s.tasks.map((I) => {
    if (a.taskIds.includes(I.id) && I.tag) {
      const z = I.tag.split(" ").filter(Boolean).filter((J) => J !== a.tag);
      return c++, {
        ...I,
        tag: z.length > 0 ? z.join(" ") : void 0,
        updatedAt: o
      };
    }
    return I;
  }), p = {
    ...s,
    tasks: d,
    updatedAt: o
  };
  let g = n;
  for (const I of d)
    a.taskIds.includes(I.id) && (g = Ee(g, I, o));
  const { board: v, index: O } = ve(i, a.boardId), w = v.tags || [], A = {
    ...v,
    tags: w.filter((I) => I !== a.tag)
  }, F = Le(i, O, A, o);
  return await t.saveTasks(e.userType, e.userId, a.boardId, p), await t.saveStats(e.userType, e.userId, a.boardId, g), await t.saveBoards(e.userType, F, e.userId), {
    ok: !0,
    message: `Cleared tag ${a.tag} from ${c} task(s) on board ${a.boardId}`,
    cleared: c
  };
}
function te(t, e, a = 50) {
  setTimeout(() => {
    try {
      const o = new BroadcastChannel("tasks");
      o.postMessage({ type: t, ...e }), o.close();
    } catch (o) {
      console.error("[localStorageApi] Broadcast failed:", o);
    }
  }, a);
}
function Ht(t = "public", e = "public") {
  const a = new At(t, e), o = { userType: "registered", userId: e };
  return {
    async getBoards() {
      const s = await Ot(a, o), n = {
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
      const n = await Pt(
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
      }), te("boards-updated", { sessionId: W, userType: t, userId: e }), n.board;
    },
    async deleteBoard(s) {
      await Rt(
        a,
        o,
        s
      ), await a.deleteBoardData(t, e, s), te("boards-updated", { sessionId: W, userType: t, userId: e });
    },
    async getTasks(s = "main") {
      return a.getTasks(t, e, s);
    },
    async getStats(s = "main") {
      return a.getStats(t, e, s);
    },
    async createTask(s, n = "main", i = !1) {
      console.log("[localStorageApi] createTask (using handler)", { data: s, boardId: n, suppressBroadcast: i });
      const c = await It(
        a,
        o,
        s,
        n
      ), p = (await a.getTasks(t, e, n)).tasks.find((g) => g.id === c.id);
      if (!p)
        throw new Error("Task creation failed - task not found after creation");
      return i ? console.log("[localStorageApi] createTask: broadcast suppressed") : (console.log("[localStorageApi] createTask: broadcasting", {
        sessionId: W,
        boardId: n,
        taskId: c.id
      }), te("tasks-updated", { sessionId: W, userType: t, userId: e, boardId: n })), p;
    },
    async patchTask(s, n, i = "main", c = !1) {
      const d = {};
      n.title !== void 0 && (d.title = n.title), n.tag !== void 0 && n.tag !== null && (d.tag = n.tag), await $t(
        a,
        o,
        s,
        d,
        i
      ), c || te("tasks-updated", { sessionId: W, userType: t, userId: e, boardId: i });
      const g = (await a.getTasks(t, e, i)).tasks.find((v) => v.id === s);
      if (!g)
        throw new Error("Task not found after update");
      return g;
    },
    async completeTask(s, n = "main") {
      const c = (await a.getTasks(t, e, n)).tasks.find((d) => d.id === s);
      if (!c)
        throw new Error("Task not found");
      return await Ft(
        a,
        o,
        s,
        n
      ), te("tasks-updated", { sessionId: W, userType: t, userId: e, boardId: n }), {
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
      return await Mt(
        a,
        o,
        s,
        n
      ), i ? console.log("[localStorageApi] deleteTask: broadcast suppressed") : (console.log("[localStorageApi] deleteTask: broadcasting", { sessionId: W }), te("tasks-updated", { sessionId: W, userType: t, userId: e, boardId: n })), {
        ...d,
        state: "Deleted",
        closedAt: (/* @__PURE__ */ new Date()).toISOString(),
        updatedAt: (/* @__PURE__ */ new Date()).toISOString()
      };
    },
    async createTag(s, n = "main") {
      await Ut(
        a,
        o,
        { boardId: n, tag: s }
      ), te("boards-updated", { sessionId: W, userType: t, userId: e, boardId: n });
    },
    async deleteTag(s, n = "main") {
      await Kt(
        a,
        o,
        { boardId: n, tag: s }
      ), te("boards-updated", { sessionId: W, userType: t, userId: e, boardId: n });
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
      const c = await this.getBoards(), d = c.boards.find((A) => A.id === s), p = c.boards.find((A) => A.id === n);
      if (!d)
        throw new Error(`Source board ${s} not found`);
      if (!p)
        throw new Error(`Target board ${n} not found`);
      const g = d.tasks.filter((A) => i.includes(A.id));
      d.tasks = d.tasks.filter((A) => !i.includes(A.id)), p.tasks = [...p.tasks, ...g], c.updatedAt = (/* @__PURE__ */ new Date()).toISOString();
      const v = `${t}-${e}-boards`;
      localStorage.setItem(v, JSON.stringify(c));
      const O = `${t}-${e}-${s}-tasks`, w = `${t}-${e}-${n}-tasks`;
      return localStorage.setItem(O, JSON.stringify({
        version: 1,
        updatedAt: c.updatedAt,
        tasks: d.tasks
      })), localStorage.setItem(w, JSON.stringify({
        version: 1,
        updatedAt: c.updatedAt,
        tasks: p.tasks
      })), te("boards-updated", { sessionId: W, userType: t, userId: e }), { ok: !0, moved: g.length };
    },
    async batchUpdateTags(s, n) {
      console.log("[localStorageApi] batchUpdateTags", { boardId: s, updates: n }), await Jt(
        a,
        o,
        { boardId: s, updates: n }
      ), te("tasks-updated", { sessionId: W, userType: t, userId: e, boardId: s });
    },
    async batchClearTag(s, n, i) {
      console.log("[localStorageApi] batchClearTag START", { boardId: s, tag: n, taskIds: i, taskCount: i.length });
      const c = await Wt(
        a,
        o,
        { boardId: s, tag: n, taskIds: i }
      );
      console.log("[localStorageApi] batchClearTag result:", c), te("boards-updated", { sessionId: W, userType: t, userId: e, boardId: s }), console.log("[localStorageApi] batchClearTag END");
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
async function jt(t, e, a, o) {
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
function we(t = "public", e = "public", a) {
  const o = Ht(t, e);
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
        console.log("[api] Synced from API:", { boards: n.boards.length, totalTasks: n.boards.reduce((i, c) => i + (c.tasks?.length || 0), 0) }), await jt(o, n, t, e);
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
      const s = await o.getPreferences();
      try {
        const n = await fetch("/task/api/preferences", {
          headers: X(t, e, a)
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
        headers: X(t, e, a),
        body: JSON.stringify(p)
      }).then(() => console.log("[api] Background sync: savePreferences completed (server-only)")).catch((g) => console.error("[api] Failed to sync savePreferences:", g));
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
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ key: s })
        })).ok;
      } catch (n) {
        return console.error("[api] Failed to validate key:", n), !1;
      }
    }
  };
}
function Vt(t) {
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
function qt(t, e = 6, a = []) {
  const o = t.flatMap((n) => n.tag?.split(" ") || []).filter(Boolean), s = {};
  return o.forEach((n) => s[n] = (s[n] || 0) + 1), a.filter(Boolean).forEach((n) => {
    s[n] || (s[n] = 0);
  }), Object.entries(s).sort((n, i) => i[1] - n[1]).slice(0, e).map(([n]) => n);
}
function We(t, e) {
  return t.filter((a) => a.tag?.split(" ").includes(e));
}
function Xt(t, e, a) {
  const o = Array.isArray(a) && a.length > 0;
  return t.filter((s) => {
    const n = s.tag?.split(" ") || [];
    return o ? a.some((c) => n.includes(c)) && !e.some((c) => n.includes(c)) : !e.some((i) => n.includes(i));
  });
}
function xe(t) {
  return Array.from(new Set(t.flatMap((e) => e.tag?.split(" ") || []).filter(Boolean)));
}
async function He(t, e, a, o, s = {}) {
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
function fe(t, e) {
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
function zt({ userType: t, userId: e, sessionId: a }) {
  const [o, s] = L([]), [n, i] = L(/* @__PURE__ */ new Set()), c = st(
    () => we(t, e || "public", a),
    [t, e, a]
  ), [d, p] = L(null), [g, v] = L("main");
  async function O() {
    console.log("[useTasks] initialLoad called"), "syncFromApi" in c && await c.syncFromApi(), await w();
  }
  async function w() {
    console.log("[useTasks] reload called", { currentBoardId: g, stack: new Error().stack?.split(`
`).slice(1, 4).join(`
`) });
    const k = await c.getBoards();
    p(k);
    const { tasks: f } = fe(k, g);
    s(f);
  }
  Z(() => {
    console.log("[useTasks] User context changed, clearing state and reloading", { userType: t, userId: e }), s([]), i(/* @__PURE__ */ new Set()), p(null), v("main"), w();
  }, [t, e]), Z(() => {
    console.log("[useTasks] Setting up BroadcastChannel listener", { currentBoardId: g, userType: t, userId: e });
    try {
      const k = new BroadcastChannel("tasks");
      return k.onmessage = (f) => {
        const u = f.data || {};
        if (console.log("[useTasks] BroadcastChannel message received", { msg: u, sessionId: W, currentBoardId: g, currentContext: { userType: t, userId: e } }), u.sessionId === W) {
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
        (u.type === "tasks-updated" || u.type === "boards-updated") && (console.log("[useTasks] BroadcastChannel: triggering reload for currentBoardId =", g), w());
      }, () => {
        console.log("[useTasks] Cleaning up BroadcastChannel listener", { currentBoardId: g }), k.close();
      };
    } catch (k) {
      console.error("[useTasks] Failed to setup BroadcastChannel", k);
    }
  }, [g, t, e]);
  async function A(k) {
    if (k = k.trim(), !!k)
      try {
        const f = Vt(k);
        return await c.createTask(f, g), await w(), !0;
      } catch (f) {
        return alert(f.message || "Failed to create task"), !1;
      }
  }
  async function F(k) {
    await He(
      `complete-${k}`,
      n,
      i,
      async () => {
        await c.completeTask(k, g), await w();
      },
      {
        onError: (f) => alert(f.message || "Failed to complete task")
      }
    );
  }
  async function I(k) {
    console.log("[useTasks] deleteTask START", { taskId: k, currentBoardId: g }), await He(
      `delete-${k}`,
      n,
      i,
      async () => {
        console.log("[useTasks] deleteTask: calling api.deleteTask", { taskId: k, currentBoardId: g }), await c.deleteTask(k, g), console.log("[useTasks] deleteTask: calling reload"), await w(), console.log("[useTasks] deleteTask END");
      },
      {
        onError: (f) => alert(f.message || "Failed to delete task")
      }
    );
  }
  async function H(k) {
    const f = prompt("Enter tag (without #):");
    if (!f) return;
    const u = f.trim().replace(/^#+/, "").replace(/\s+/g, "-"), h = o.find((x) => x.id === k);
    if (!h) return;
    const S = h.tag?.split(" ") || [];
    if (S.includes(u)) return;
    const C = [...S, u].join(" ");
    try {
      await c.patchTask(k, { tag: C }, g), await w();
    } catch (x) {
      alert(x.message || "Failed to add tag");
    }
  }
  async function z(k, f, u = {}) {
    const { suppressBroadcast: h = !1, skipReload: S = !1 } = u;
    try {
      await c.patchTask(k, f, g, h), S || await w();
    } catch (C) {
      throw C;
    }
  }
  async function J(k) {
    console.log("[useTasks] bulkUpdateTaskTags START", { count: k.length });
    try {
      await c.batchUpdateTags(
        g,
        k.map((f) => ({ taskId: f.taskId, tag: f.tag || null }))
      ), console.log("[useTasks] bulkUpdateTaskTags: calling reload"), await w(), console.log("[useTasks] bulkUpdateTaskTags END");
    } catch (f) {
      throw console.error("[useTasks] bulkUpdateTaskTags ERROR", f), f;
    }
  }
  async function j(k) {
    console.log("[useTasks] deleteTag START", { tag: k, currentBoardId: g, taskCount: o.length });
    const f = o.filter((u) => u.tag?.split(" ").includes(k));
    if (console.log("[useTasks] deleteTag: found tasks with tag", { tag: k, count: f.length }), f.length === 0) {
      console.log("[useTasks] deleteTag: no tasks found with this tag, just deleting tag");
      try {
        await c.deleteTag(k, g), await w(), console.log("[useTasks] deleteTag END (no tasks to clear)");
      } catch (u) {
        console.error("[useTasks] deleteTag ERROR", u), console.error("[useTasks] deleteTag: Please fix this error:", u.message);
      }
      return;
    }
    try {
      console.log("[useTasks] deleteTag: starting batch clear"), await c.batchClearTag(
        g,
        k,
        f.map((u) => u.id)
      ), console.log("[useTasks] deleteTag: calling reload"), await w(), console.log("[useTasks] deleteTag END");
    } catch (u) {
      console.error("[useTasks] deleteTag ERROR", u), alert(u.message || "Failed to remove tag from tasks");
    }
  }
  async function Y(k) {
    await c.createBoard(k), v(k);
    const f = await c.getBoards();
    p(f);
    const { tasks: u } = fe(f, k);
    s(u);
  }
  async function Q(k, f) {
    if (console.log("[useTasks] moveTasksToBoard START", { targetBoardId: k, ids: f, currentBoardId: g }), !d) return;
    const u = /* @__PURE__ */ new Set();
    for (const h of d.boards)
      for (const S of h.tasks || [])
        f.includes(S.id) && u.add(h.id);
    console.log("[useTasks] moveTasksToBoard: source boards", { sourceBoardIds: Array.from(u) });
    try {
      if (u.size === 1) {
        const C = Array.from(u)[0];
        console.log("[useTasks] moveTasksToBoard: using batch API"), await c.batchMoveTasks(C, k, f);
      } else
        throw console.error("[useTasks] moveTasksToBoard: Cannot move tasks from multiple boards at once"), new Error("Cannot move tasks from multiple boards at once");
      console.log("[useTasks] moveTasksToBoard: switching to target board", { targetBoardId: k }), v(k);
      const h = await c.getBoards();
      p(h);
      const { tasks: S } = fe(h, k);
      s(S), console.log("[useTasks] moveTasksToBoard END");
    } catch (h) {
      console.error("[useTasks] moveTasksToBoard ERROR", h), alert(h.message || "Failed to move tasks");
    }
  }
  async function ee(k) {
    if (await c.deleteBoard(k), g === k) {
      v("main");
      const f = await c.getBoards();
      p(f);
      const { tasks: u } = fe(f, "main");
      s(u);
    } else
      await w();
  }
  async function re(k) {
    await c.createTag(k, g), await w();
  }
  async function ce(k) {
    await c.deleteTag(k, g), await w();
  }
  function ne(k) {
    v(k);
    const { tasks: f, foundBoard: u } = fe(d, k);
    u ? s(f) : w();
  }
  return {
    // Task state
    tasks: o,
    pendingOperations: n,
    // Task operations
    addTask: A,
    completeTask: F,
    deleteTask: I,
    addTagToTask: H,
    updateTaskTags: z,
    bulkUpdateTaskTags: J,
    deleteTag: j,
    // Board state
    boards: d,
    currentBoardId: g,
    // Board operations
    createBoard: Y,
    deleteBoard: ee,
    switchBoard: ne,
    moveTasksToBoard: Q,
    createTagOnBoard: re,
    deleteTagOnBoard: ce,
    // Lifecycle
    initialLoad: O,
    reload: w
  };
}
function Yt({ tasks: t, onTaskUpdate: e, onBulkUpdate: a }) {
  const [o, s] = L(null), [n, i] = L(null), [c, d] = L(/* @__PURE__ */ new Set()), [p, g] = L(!1), [v, O] = L(null), [w, A] = L(null), F = Te(null);
  function I(u) {
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
  function H(u, h) {
    const S = c.has(h) && c.size > 0 ? Array.from(c) : [h];
    console.log("[useDragAndDrop] onDragStart", { taskId: h, idsToDrag: S, selectedCount: c.size }), u.dataTransfer.setData("text/plain", S[0]);
    try {
      u.dataTransfer.setData("application/x-hadoku-task-ids", JSON.stringify(S));
    } catch {
    }
    u.dataTransfer.effectAllowed = "copyMove";
    try {
      const C = u.currentTarget, x = C.closest && C.closest(".task-app__item") ? C.closest(".task-app__item") : C;
      x.classList.add("dragging");
      const B = x.cloneNode(!0);
      B.style.boxSizing = "border-box", B.style.width = `${x.offsetWidth}px`, B.style.height = `${x.offsetHeight}px`, B.style.opacity = "0.95", B.style.transform = "none", B.style.filter = "drop-shadow(0 6px 18px rgba(0,0,0,0.12))", B.classList.add("drag-image"), B.style.position = "absolute", B.style.top = "-9999px", B.style.left = "-9999px", document.body.appendChild(B), x.__dragImage = B, d((E) => {
        if (E.has(h)) return new Set(E);
        const M = new Set(E);
        return M.add(h), M;
      });
      try {
        const E = x.closest(".task-app__tag-column");
        if (E) {
          const M = E.querySelector(".task-app__tag-header") || E.querySelector("h3"), y = (M && M.textContent || "").trim().replace(/^#/, "");
          if (y)
            try {
              u.dataTransfer.setData("application/x-hadoku-task-source", y);
            } catch {
            }
        }
      } catch {
      }
      try {
        const E = x.getBoundingClientRect();
        let M = Math.round(u.clientX - E.left), K = Math.round(u.clientY - E.top);
        M = Math.max(0, Math.min(Math.round(B.offsetWidth - 1), M)), K = Math.max(0, Math.min(Math.round(B.offsetHeight - 1), K)), u.dataTransfer.setDragImage(B, M, K);
      } catch {
        u.dataTransfer.setDragImage(B, 0, 0);
      }
    } catch {
    }
  }
  function z(u) {
    try {
      const h = u.currentTarget;
      h.classList.remove("dragging");
      const S = h.__dragImage;
      S && S.parentNode && S.parentNode.removeChild(S), S && delete h.__dragImage;
    } catch {
    }
    try {
      Q();
    } catch {
    }
  }
  function J(u) {
    if (u.button === 0) {
      try {
        const h = u.target;
        if (!h || h.closest && h.closest(".task-app__item, .task-app__controls, button, input, textarea, .task-app__item-actions"))
          return;
      } catch {
      }
      g(!0), F.current = { x: u.clientX, y: u.clientY }, O({ x: u.clientX, y: u.clientY, w: 0, h: 0 }), d(/* @__PURE__ */ new Set());
      try {
        document.body.classList.add("marquee-selecting");
      } catch {
      }
    }
  }
  function j(u) {
    if (!p || !F.current) return;
    const h = F.current.x, S = F.current.y, C = u.clientX, x = u.clientY, B = Math.min(h, C), E = Math.min(S, x), M = Math.abs(C - h), K = Math.abs(x - S);
    O({ x: B, y: E, w: M, h: K });
    const y = Array.from(document.querySelectorAll(".task-app__item")), R = /* @__PURE__ */ new Set();
    for (const N of y) {
      const P = N.getBoundingClientRect();
      if (!(P.right < B || P.left > B + M || P.bottom < E || P.top > E + K)) {
        const V = N.getAttribute("data-task-id");
        V && R.add(V), N.classList.add("selected");
      } else
        N.classList.remove("selected");
    }
    d(R);
  }
  function Y(u) {
    g(!1), O(null), F.current = null;
    try {
      document.body.classList.remove("marquee-selecting");
    } catch {
    }
    try {
      A(Date.now());
    } catch {
    }
  }
  function Q() {
    d(/* @__PURE__ */ new Set()), Array.from(document.querySelectorAll(".task-app__item.selected")).forEach((h) => h.classList.remove("selected"));
  }
  Z(() => {
    function u(C) {
      if (C.button !== 0) return;
      const x = { target: C.target, clientX: C.clientX, clientY: C.clientY, button: C.button };
      try {
        J(x);
      } catch {
      }
    }
    function h(C) {
      const x = { clientX: C.clientX, clientY: C.clientY };
      try {
        j(x);
      } catch {
      }
    }
    function S(C) {
      const x = { clientX: C.clientX, clientY: C.clientY };
      try {
        Y(x);
      } catch {
      }
    }
    return document.addEventListener("mousedown", u), document.addEventListener("mousemove", h), document.addEventListener("mouseup", S), () => {
      document.removeEventListener("mousedown", u), document.removeEventListener("mousemove", h), document.removeEventListener("mouseup", S);
    };
  }, []);
  function ee(u, h) {
    u.preventDefault(), u.dataTransfer.dropEffect = "copy", s(h);
  }
  function re(u) {
    u.currentTarget.contains(u.relatedTarget) || s(null);
  }
  async function ce(u, h) {
    u.preventDefault(), s(null), console.log("[useDragAndDrop] onDrop START", { targetTag: h });
    const S = I(u);
    if (S.length === 0) return;
    let C = null;
    try {
      const B = u.dataTransfer.getData("application/x-hadoku-task-source");
      B && (C = B);
    } catch {
    }
    console.log("[useDragAndDrop] onDrop: processing", { targetTag: h, ids: S, srcTag: C, taskCount: S.length });
    const x = [];
    for (const B of S) {
      const E = t.find((N) => N.id === B);
      if (!E) continue;
      const M = E.tag?.split(" ").filter(Boolean) || [];
      if (h === "other") {
        if (M.length === 0) continue;
        x.push({ taskId: B, tag: "" });
        continue;
      }
      const K = M.includes(h);
      let y = M.slice();
      K || y.push(h), C && C !== h && (y = y.filter((N) => N !== C));
      const R = y.join(" ").trim();
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
  function ne(u, h) {
    u.preventDefault(), u.dataTransfer.dropEffect = "copy", i(h);
  }
  function k(u) {
    u.currentTarget.contains(u.relatedTarget) || i(null);
  }
  async function f(u, h) {
    u.preventDefault(), i(null);
    const S = I(u);
    if (S.length === 0) return;
    console.log("[useDragAndDrop] onFilterDrop", { filterTag: h, ids: S, taskCount: S.length });
    const C = [];
    for (const x of S) {
      const B = t.find((K) => K.id === x);
      if (!B) continue;
      const E = B.tag?.split(" ").filter(Boolean) || [];
      if (E.includes(h)) {
        console.log(`Task ${x} already has tag: ${h}`);
        continue;
      }
      const M = [...E, h].join(" ");
      C.push({ taskId: x, tag: M });
    }
    if (C.length === 0) {
      console.log("No updates needed - all tasks already have this tag");
      return;
    }
    console.log(`Adding tag "${h}" to ${C.length} task(s) via filter drop`);
    try {
      await a(C);
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
    marqueeRect: v,
    selectionJustEndedAt: w,
    // selection handlers
    selectionStartHandler: J,
    selectionMoveHandler: j,
    selectionEndHandler: Y,
    clearSelection: Q,
    onDragStart: H,
    onDragEnd: z,
    onDragOver: ee,
    onDragLeave: re,
    onDrop: ce,
    onFilterDragOver: ne,
    onFilterDragLeave: k,
    onFilterDrop: f
  };
}
function Gt() {
  const [t, e] = L({});
  function a(i) {
    e((c) => {
      const p = (c[i] || "desc") === "desc" ? "asc" : "desc";
      return { ...c, [i]: p };
    });
  }
  function o(i, c) {
    return [...i].sort((d, p) => {
      const g = new Date(d.createdAt).getTime(), v = new Date(p.createdAt).getTime();
      return c === "asc" ? g - v : v - g;
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
function nt({ onLongPress: t, delay: e = 500 }) {
  const a = Te(null);
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
function Ne(t) {
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
function Zt({
  board: t,
  isActive: e,
  isDragOver: a,
  onSwitch: o,
  onContextMenu: s,
  onDragOverFilter: n,
  onMoveTasksToBoard: i,
  onClearSelection: c
}) {
  const d = nt({
    onLongPress: (g, v) => s(t.id, g, v)
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
        const v = Ne(g.dataTransfer);
        if (v.length !== 0)
          try {
            await i(t.id, v);
            try {
              c();
            } catch {
            }
          } catch (O) {
            console.error("Failed moving tasks to board", O), alert(O.message || "Failed to move tasks");
          }
      },
      children: t.name
    }
  );
}
function Qt({
  tag: t,
  isActive: e,
  isDragOver: a,
  onToggle: o,
  onContextMenu: s,
  onDragOver: n,
  onDragLeave: i,
  onDrop: c
}) {
  const d = nt({
    onLongPress: (p, g) => s(t, p, g)
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
function ea(t) {
  const e = /* @__PURE__ */ new Date(), a = new Date(t), o = e.getTime() - a.getTime(), s = Math.floor(o / 1e3), n = Math.floor(s / 60), i = Math.floor(n / 60), c = Math.floor(i / 24);
  return s < 60 ? `${s}s ago` : n < 60 ? `${n}m ago` : i < 24 ? `${i}h ago` : `${c}d ago`;
}
const se = {
  width: 20,
  height: 20,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round"
}, ta = () => /* @__PURE__ */ T("svg", { ...se, children: [
  /* @__PURE__ */ r("circle", { cx: "12", cy: "12", r: "5" }),
  /* @__PURE__ */ r("line", { x1: "12", y1: "1", x2: "12", y2: "3" }),
  /* @__PURE__ */ r("line", { x1: "12", y1: "21", x2: "12", y2: "23" }),
  /* @__PURE__ */ r("line", { x1: "4.22", y1: "4.22", x2: "5.64", y2: "5.64" }),
  /* @__PURE__ */ r("line", { x1: "18.36", y1: "18.36", x2: "19.78", y2: "19.78" }),
  /* @__PURE__ */ r("line", { x1: "1", y1: "12", x2: "3", y2: "12" }),
  /* @__PURE__ */ r("line", { x1: "21", y1: "12", x2: "23", y2: "12" }),
  /* @__PURE__ */ r("line", { x1: "4.22", y1: "19.78", x2: "5.64", y2: "18.36" }),
  /* @__PURE__ */ r("line", { x1: "18.36", y1: "5.64", x2: "19.78", y2: "4.22" })
] }), ot = () => /* @__PURE__ */ r("svg", { ...se, children: /* @__PURE__ */ r("path", { d: "M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" }) }), je = () => /* @__PURE__ */ T("svg", { ...se, children: [
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
] }), Ve = () => /* @__PURE__ */ T("svg", { ...se, children: [
  /* @__PURE__ */ r("path", { d: "M2 12c2-2 4-2 6 0s4 2 6 0 4-2 6 0" }),
  /* @__PURE__ */ r("path", { d: "M2 17c2-2 4-2 6 0s4 2 6 0 4-2 6 0" }),
  /* @__PURE__ */ r("path", { d: "M2 7c2-2 4-2 6 0s4 2 6 0 4-2 6 0" })
] }), qe = () => /* @__PURE__ */ r("svg", { ...se, children: /* @__PURE__ */ r("polygon", { points: "13 2 3 14 12 14 11 22 21 10 12 10 13 2" }) }), Xe = () => /* @__PURE__ */ T("svg", { ...se, children: [
  /* @__PURE__ */ r("path", { d: "M18 8h1a4 4 0 0 1 0 8h-1" }),
  /* @__PURE__ */ r("path", { d: "M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" }),
  /* @__PURE__ */ r("line", { x1: "6", y1: "1", x2: "6", y2: "4" }),
  /* @__PURE__ */ r("line", { x1: "10", y1: "1", x2: "10", y2: "4" }),
  /* @__PURE__ */ r("line", { x1: "14", y1: "1", x2: "14", y2: "4" })
] }), ze = () => /* @__PURE__ */ T("svg", { ...se, children: [
  /* @__PURE__ */ r("circle", { cx: "12", cy: "12", r: "2", fill: "currentColor" }),
  /* @__PURE__ */ r("circle", { cx: "12", cy: "6", r: "2.5", fill: "none", stroke: "currentColor", strokeWidth: "2" }),
  /* @__PURE__ */ r("circle", { cx: "18", cy: "10", r: "2.5", fill: "none", stroke: "currentColor", strokeWidth: "2" }),
  /* @__PURE__ */ r("circle", { cx: "16", cy: "16", r: "2.5", fill: "none", stroke: "currentColor", strokeWidth: "2" }),
  /* @__PURE__ */ r("circle", { cx: "8", cy: "16", r: "2.5", fill: "none", stroke: "currentColor", strokeWidth: "2" }),
  /* @__PURE__ */ r("circle", { cx: "6", cy: "10", r: "2.5", fill: "none", stroke: "currentColor", strokeWidth: "2" })
] }), Ye = () => /* @__PURE__ */ r("svg", { ...se, children: /* @__PURE__ */ r("path", { d: "M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z", fill: "currentColor" }) }), aa = () => /* @__PURE__ */ T("svg", { ...se, children: [
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
] }), sa = () => /* @__PURE__ */ T("svg", { ...se, width: 16, height: 16, viewBox: "0 0 20 20", children: [
  /* @__PURE__ */ r(
    "path",
    {
      d: "M2 4 L12 4 L16 10 L12 16 L2 16 Z",
      fill: "currentColor"
    }
  ),
  /* @__PURE__ */ r("circle", { cx: "6", cy: "10", r: "1.5", fill: "white" })
] });
function Ae({
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
  showDeleteButton: v = !0,
  showTagButton: O = !1
}) {
  const w = a.has(`complete-${t.id}`), A = a.has(`delete-${t.id}`);
  return /* @__PURE__ */ T(
    "li",
    {
      className: `task-app__item ${p ? "selected" : ""}`,
      "data-task-id": t.id,
      draggable: e,
      onDragStart: c ? (F) => c(F, t.id) : void 0,
      onDragEnd: (F) => {
        if (F.currentTarget.classList.remove("dragging"), d)
          try {
            d(F);
          } catch {
          }
      },
      children: [
        /* @__PURE__ */ T("div", { className: "task-app__item-content", children: [
          /* @__PURE__ */ r("div", { className: "task-app__item-title", title: t.title, children: t.title }),
          /* @__PURE__ */ T("div", { className: "task-app__item-meta-row", children: [
            t.tag ? /* @__PURE__ */ r("div", { className: "task-app__item-tag", children: t.tag.split(" ").sort().map((F) => `#${F}`).join(" ") }) : /* @__PURE__ */ r("div", {}),
            /* @__PURE__ */ r("div", { className: "task-app__item-age", children: ea(t.createdAt) })
          ] })
        ] }),
        /* @__PURE__ */ T("div", { className: "task-app__item-actions", children: [
          O && /* @__PURE__ */ r(
            "button",
            {
              className: "task-app__action-btn task-app__edit-tag-btn",
              onClick: () => i(t.id),
              title: "Edit tags",
              disabled: w || A,
              children: /* @__PURE__ */ r(sa, {})
            }
          ),
          g && /* @__PURE__ */ r(
            "button",
            {
              className: "task-app__action-btn task-app__complete-btn",
              onClick: () => o(t.id),
              title: "Complete task",
              disabled: w || A,
              children: w ? "⏳" : "✓"
            }
          ),
          v && /* @__PURE__ */ r(
            "button",
            {
              className: "task-app__action-btn task-app__delete-btn",
              onClick: () => s(t.id),
              title: "Delete task",
              disabled: w || A,
              children: A ? "⏳" : "×"
            }
          )
        ] })
      ]
    }
  );
}
function Ge(t, e = !1) {
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
function na({
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
  onDragStart: v,
  onDragEnd: O,
  selectedIds: w,
  onSelectionStart: A,
  onSelectionMove: F,
  onSelectionEnd: I,
  onDragOver: H,
  onDragLeave: z,
  onDrop: J,
  toggleSort: j,
  sortTasksByAge: Y,
  getSortIcon: Q,
  getSortTitle: ee,
  deleteTag: re,
  onDeletePersistedTag: ce,
  showCompleteButton: ne = !0,
  showDeleteButton: k = !0,
  showTagButton: f = !1
}) {
  const u = (y, R) => /* @__PURE__ */ T(
    "div",
    {
      className: `task-app__tag-column ${n === y ? "task-app__tag-column--drag-over" : ""}`,
      onDragOver: (N) => H(N, y),
      onDragLeave: z,
      onDrop: (N) => J(N, y),
      children: [
        /* @__PURE__ */ T("div", { className: "task-app__tag-header-row", children: [
          /* @__PURE__ */ T("h3", { className: "task-app__tag-header", children: [
            "#",
            y
          ] }),
          /* @__PURE__ */ r(
            "button",
            {
              className: "task-app__sort-btn task-app__sort-btn--active",
              onClick: () => j(y),
              title: ee(s[y] || "desc"),
              children: Q(s[y] || "desc")
            }
          )
        ] }),
        /* @__PURE__ */ r("ul", { className: "task-app__list task-app__list--column", children: Y(R, s[y] || "desc").map((N) => /* @__PURE__ */ r(
          Ae,
          {
            task: N,
            isDraggable: !0,
            pendingOperations: i,
            onComplete: c,
            onDelete: d,
            onAddTag: p,
            onEditTag: g,
            onDragStart: v,
            onDragEnd: O,
            selected: w ? w.has(N.id) : !1,
            showCompleteButton: ne,
            showDeleteButton: k,
            showTagButton: f
          },
          N.id
        )) })
      ]
    },
    y
  ), h = (y, R) => {
    let N = We(t, y);
    return C && (N = N.filter((P) => {
      const ie = P.tag?.split(" ") || [];
      return o.some((V) => ie.includes(V));
    })), N.slice(0, R);
  }, S = e.length, C = Array.isArray(o) && o.length > 0, x = t.filter((y) => {
    if (!C) return !0;
    const R = y.tag?.split(" ") || [];
    return o.some((N) => R.includes(N));
  }), B = Ge(S, a), E = C ? e.filter((y) => We(t, y).some((N) => {
    const P = N.tag?.split(" ") || [];
    return o.some((ie) => P.includes(ie));
  })) : e.slice(0, B.useTags);
  if (E.length === 0)
    return /* @__PURE__ */ r("ul", { className: "task-app__list", children: x.map((y) => /* @__PURE__ */ r(
      Ae,
      {
        task: y,
        pendingOperations: i,
        onComplete: c,
        onDelete: d,
        onAddTag: p,
        onEditTag: g,
        onDragStart: v,
        onDragEnd: O,
        selected: w ? w.has(y.id) : !1,
        showCompleteButton: ne,
        showDeleteButton: k,
        showTagButton: f
      },
      y.id
    )) });
  const M = Xt(t, e, o).filter((y) => {
    if (!C) return !0;
    const R = y.tag?.split(" ") || [];
    return o.some((N) => R.includes(N));
  }), K = Ge(E.length, a);
  return /* @__PURE__ */ T("div", { className: "task-app__dynamic-layout", children: [
    K.rows.length > 0 && /* @__PURE__ */ r(Bt, { children: K.rows.map((y, R) => /* @__PURE__ */ r("div", { className: `task-app__tag-grid task-app__tag-grid--${y.columns}col`, children: y.tagIndices.map((N) => {
      const P = E[N];
      return P ? u(P, h(P, K.maxPerColumn)) : null;
    }) }, R)) }),
    M.length > 0 && /* @__PURE__ */ T(
      "div",
      {
        className: `task-app__remaining ${n === "other" ? "task-app__tag-column--drag-over" : ""}`,
        onDragOver: (y) => {
          y.preventDefault(), y.dataTransfer.dropEffect = "move", H(y, "other");
        },
        onDragLeave: (y) => z(y),
        onDrop: (y) => J(y, "other"),
        children: [
          /* @__PURE__ */ T("div", { className: "task-app__tag-header-row", children: [
            /* @__PURE__ */ r("h3", { className: "task-app__remaining-header", children: "Other Tasks" }),
            /* @__PURE__ */ r(
              "button",
              {
                className: "task-app__sort-btn task-app__sort-btn--active",
                onClick: () => j("other"),
                title: ee(s.other || "desc"),
                children: Q(s.other || "desc")
              }
            )
          ] }),
          /* @__PURE__ */ r("ul", { className: "task-app__list", children: Y(M, s.other || "desc").map((y) => /* @__PURE__ */ r(
            Ae,
            {
              task: y,
              pendingOperations: i,
              onComplete: c,
              onDelete: d,
              onAddTag: p,
              onEditTag: g,
              onDragStart: v,
              onDragEnd: O,
              selected: w ? w.has(y.id) : !1,
              showCompleteButton: ne,
              showDeleteButton: k,
              showTagButton: f
            },
            y.id
          )) })
        ]
      }
    )
  ] });
}
function ke({
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
  confirmDanger: v = !1
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
          onClick: (w) => w.stopPropagation(),
          children: [
            /* @__PURE__ */ r("h3", { children: e }),
            s,
            i && /* @__PURE__ */ r(
              "input",
              {
                type: "text",
                className: "modal-input",
                value: n || "",
                onChange: (w) => i(w.target.value),
                placeholder: c,
                autoFocus: !0,
                onKeyDown: (w) => {
                  w.key === "Enter" && !g && (w.preventDefault(), o()), w.key === "Escape" && (w.preventDefault(), a());
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
                  className: `modal-button ${v ? "modal-button--danger" : "modal-button--primary"}`,
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
function Ze({ isOpen: t, x: e, y: a, items: o, className: s = "board-context-menu" }) {
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
const Qe = [
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
function oa() {
  return Qe[Math.floor(Math.random() * Qe.length)];
}
const et = 768;
function ra() {
  const [t, e] = L(() => typeof window > "u" ? !1 : window.innerWidth < et);
  return Z(() => {
    if (typeof window > "u") return;
    const a = window.matchMedia(`(max-width: ${et - 1}px)`), o = (s) => {
      e(s.matches);
    };
    return a.addEventListener ? a.addEventListener("change", o) : a.addListener(o), o(a), () => {
      a.removeEventListener ? a.removeEventListener("change", o) : a.removeListener(o);
    };
  }, []), t;
}
const tt = [
  {
    lightIcon: /* @__PURE__ */ r(ta, {}),
    darkIcon: /* @__PURE__ */ r(ot, {}),
    lightTheme: "light",
    darkTheme: "dark",
    lightLabel: "Light",
    darkLabel: "Dark"
  },
  {
    lightIcon: /* @__PURE__ */ r(je, {}),
    darkIcon: /* @__PURE__ */ r(je, {}),
    lightTheme: "strawberry-light",
    darkTheme: "strawberry-dark",
    lightLabel: "Strawberry Light",
    darkLabel: "Strawberry Dark"
  },
  {
    lightIcon: /* @__PURE__ */ r(Ve, {}),
    darkIcon: /* @__PURE__ */ r(Ve, {}),
    lightTheme: "ocean-light",
    darkTheme: "ocean-dark",
    lightLabel: "Ocean Light",
    darkLabel: "Ocean Dark"
  },
  {
    lightIcon: /* @__PURE__ */ r(qe, {}),
    darkIcon: /* @__PURE__ */ r(qe, {}),
    lightTheme: "cyberpunk-light",
    darkTheme: "cyberpunk-dark",
    lightLabel: "Cyberpunk Light",
    darkLabel: "Cyberpunk Dark"
  },
  {
    lightIcon: /* @__PURE__ */ r(Xe, {}),
    darkIcon: /* @__PURE__ */ r(Xe, {}),
    lightTheme: "coffee-light",
    darkTheme: "coffee-dark",
    lightLabel: "Coffee Light",
    darkLabel: "Coffee Dark"
  },
  {
    lightIcon: /* @__PURE__ */ r(ze, {}),
    darkIcon: /* @__PURE__ */ r(ze, {}),
    lightTheme: "lavender-light",
    darkTheme: "lavender-dark",
    lightLabel: "Lavender Light",
    darkLabel: "Lavender Dark"
  }
], ia = [
  {
    lightIcon: /* @__PURE__ */ r(Ye, {}),
    darkIcon: /* @__PURE__ */ r(Ye, {}),
    lightTheme: "pink-light",
    darkTheme: "pink-dark",
    lightLabel: "Pink Light",
    darkLabel: "Pink Dark"
  }
];
function rt(t) {
  return t ? [...tt, ...ia] : tt;
}
function ca(t, e) {
  const o = rt(e).find(
    (s) => s.lightTheme === t || s.darkTheme === t
  );
  return o ? t.endsWith("-dark") || t === "dark" ? o.darkIcon : o.lightIcon : /* @__PURE__ */ r(ot, {});
}
const at = 5;
function la(t = {}) {
  const { userType: e = "public", userId: a = "public", sessionId: o } = t, s = ra(), [n] = L(() => oa()), [i, c] = L(/* @__PURE__ */ new Set()), [d, p] = L(null), [g, v] = L(!1), [O, w] = L(!1), [A, F] = L(null), [I, H] = L(""), [z, J] = L(null), [j, Y] = L(!1), [Q, ee] = L(!1), [re, ce] = L(!1), [ne, k] = L(!1), [f, u] = L({
    version: 1,
    updatedAt: (/* @__PURE__ */ new Date()).toISOString(),
    experimentalThemes: !1,
    alwaysVerticalLayout: !1,
    // Device-specific defaults
    theme: "light",
    showCompleteButton: !0,
    showDeleteButton: !0,
    showTagButton: !1
  }), h = f.theme || "light", S = f.showCompleteButton ?? !0, C = f.showDeleteButton ?? !0, x = f.showTagButton ?? !1, B = (l) => ue({ theme: l }), [E, M] = L(""), [K, y] = L(null), [R, N] = L(!1), [P, ie] = L(null), [V, be] = L(null), [le, he] = L(null), [Se, ye] = L(""), de = Te(null), Ce = Te(null), De = Te(null), Oe = s || f.alwaysVerticalLayout || !1, {
    tasks: oe,
    pendingOperations: it,
    initialLoad: Ie,
    addTask: ct,
    completeTask: lt,
    deleteTask: dt,
    addTagToTask: gt,
    updateTaskTags: $e,
    bulkUpdateTaskTags: Fe,
    deleteTag: Me,
    // board API
    boards: G,
    currentBoardId: ge,
    createBoard: ut,
    deleteBoard: pt,
    switchBoard: ht,
    moveTasksToBoard: Pe,
    createTagOnBoard: Re,
    deleteTagOnBoard: mt
  } = zt({ userType: e, userId: a, sessionId: o }), D = Yt({
    tasks: oe,
    onTaskUpdate: $e,
    onBulkUpdate: Fe
  }), me = Gt(), ft = st(
    () => rt(f.experimentalThemes || !1),
    [f.experimentalThemes]
  ), kt = () => {
    const l = "1.0", m = "task-storage-version", b = window.localStorage.getItem(m);
    if (b !== l) {
      console.log("[App] Storage version mismatch, cleaning up orphaned keys", {
        current: b,
        expected: l
      });
      const _ = [
        /^tasks-/,
        // tasks-main, tasks-work
        /^stats-/,
        // stats-main, stats-work
        /^boards$/,
        // boards (without prefix)
        /^preferences$/
        // preferences (without prefix)
      ];
      Object.keys(window.localStorage).forEach((U) => {
        const $ = _.some((pe) => pe.test(U)), q = U.includes(`${e}-${a}`);
        $ && !q && (console.log("[App] Removing orphaned key:", U), window.localStorage.removeItem(U));
      }), window.localStorage.setItem(m, l), console.log("[App] Storage upgraded to version", l);
    }
  };
  Z(() => {
    (async () => {
      kt(), console.log("[App] Loading preferences...", { userType: e, userId: a, sessionId: o });
      const b = await we(e, a, o).getPreferences();
      console.log("[App] Loaded preferences:", b), b && (u(b), console.log("[App] Applied preferences to state")), k(!0);
    })();
  }, [e, a, o]);
  const ue = async (l) => {
    const m = { ...f, ...l, updatedAt: (/* @__PURE__ */ new Date()).toISOString() };
    u(m), await we(e, a, o).savePreferences(m);
  }, Ue = async () => {
    if (!(!E.trim() || R)) {
      N(!0), y(null);
      try {
        if (await we(e, a, o).validateKey(E.trim())) {
          const b = new URL(window.location.href);
          b.searchParams.set("key", E.trim()), window.location.href = b.toString();
        } else
          y("Invalid key"), N(!1);
      } catch {
        y("Failed to validate key"), N(!1);
      }
    }
  };
  Z(() => {
    (() => {
      try {
        const m = sessionStorage.getItem("theme"), b = sessionStorage.getItem("showCompleteButton"), _ = sessionStorage.getItem("showDeleteButton"), U = sessionStorage.getItem("showTagButton"), $ = {};
        if (m && !f.theme && ($.theme = m), b !== null && f.showCompleteButton === void 0 && ($.showCompleteButton = b === "true"), _ !== null && f.showDeleteButton === void 0 && ($.showDeleteButton = _ === "true"), U !== null && f.showTagButton === void 0 && ($.showTagButton = U === "true"), Object.keys($).length > 0) {
          console.log("[App] Migrating settings from sessionStorage to localStorage:", $);
          const q = { ...f, ...$, updatedAt: (/* @__PURE__ */ new Date()).toISOString() };
          u(q), sessionStorage.removeItem("theme"), sessionStorage.removeItem("showCompleteButton"), sessionStorage.removeItem("showDeleteButton"), sessionStorage.removeItem("showTagButton");
        }
      } catch (m) {
        console.warn("[App] Failed to migrate settings:", m);
      }
    })();
  }, [f.theme, f.showCompleteButton, f.showDeleteButton, f.showTagButton]), Z(() => {
    if (!j) return;
    const l = (m) => {
      De.current && !De.current.contains(m.target) && Y(!1);
    };
    return document.addEventListener("mousedown", l), () => document.removeEventListener("mousedown", l);
  }, [j]), Z(() => {
    const l = window.matchMedia("(prefers-color-scheme: dark)"), m = (b) => {
      const _ = b.matches, U = h.replace(/-light$|-dark$/, ""), $ = h.endsWith("-dark") ? "dark" : h.endsWith("-light") ? "light" : null;
      if ($ && U !== "light" && U !== "dark") {
        const q = _ ? "dark" : "light";
        if ($ !== q) {
          const pe = `${U}-${q}`;
          console.log(`[Theme] Auto-switching from ${h} to ${pe} (system preference)`), B(pe);
        }
      }
    };
    return l.addEventListener ? l.addEventListener("change", m) : l.addListener(m), () => {
      l.removeEventListener ? l.removeEventListener("change", m) : l.removeListener(m);
    };
  }, [h]), Z(() => {
    c(/* @__PURE__ */ new Set());
  }, [ge]), Z(() => {
    console.log("[App] User context changed, initializing...", { userType: e, userId: a }), Ie(), de.current?.focus();
  }, [e, a]), Z(() => {
    Ce.current && Ce.current.setAttribute("data-theme", h);
  }, [h]), Z(() => {
    if (!j && !P && !V) return;
    const l = (m) => {
      const b = m.target;
      b.closest(".theme-picker") || Y(!1), b.closest(".board-context-menu") || ie(null), b.closest(".tag-context-menu") || be(null);
    };
    return document.addEventListener("mousedown", l), () => document.removeEventListener("mousedown", l);
  }, [j, P, V]);
  async function Tt(l) {
    await ct(l) && de.current && (de.current.value = "", de.current.focus());
  }
  function yt(l) {
    const m = oe.filter((b) => b.tag?.split(" ").includes(l));
    p({ tag: l, count: m.length });
  }
  async function wt(l) {
    const m = l.trim().replace(/\s+/g, "-");
    try {
      if (await Re(m), A?.type === "apply-tag" && A.taskIds.length > 0) {
        const b = A.taskIds.map((_) => {
          const $ = oe.find((pe) => pe.id === _)?.tag?.split(" ").filter(Boolean) || [], q = [.../* @__PURE__ */ new Set([...$, m])];
          return { taskId: _, tag: q.join(" ") };
        });
        await Fe(b), D.clearSelection();
      }
      F(null);
    } catch (b) {
      throw console.error("[App] Failed to create tag:", b), b;
    }
  }
  function vt(l) {
    const m = oe.find((b) => b.id === l);
    m && (he({ taskId: l, currentTag: m.tag || null }), ye(""));
  }
  async function Ke() {
    if (!le) return;
    const { taskId: l, currentTag: m } = le, b = m?.split(" ").filter(Boolean) || [], _ = Se.trim() ? Se.trim().replace(/\s+/g, "-").split("#").filter(Boolean).map((q) => q.trim()) : [];
    for (const q of _)
      await Re(q);
    const $ = [.../* @__PURE__ */ new Set([...b, ..._])].sort().join(" ");
    await $e(l, { tag: $ }), he(null), ye("");
  }
  function bt(l) {
    if (!le) return;
    const { taskId: m, currentTag: b } = le, _ = b?.split(" ").filter(Boolean) || [];
    if (_.includes(l)) {
      const $ = _.filter((q) => q !== l).sort().join(" ");
      he({ taskId: m, currentTag: $ });
    } else {
      const $ = [..._, l].sort().join(" ");
      he({ taskId: m, currentTag: $ });
    }
  }
  function Be(l) {
    const m = l.trim();
    return m ? (G?.boards?.map((_) => _.id.toLowerCase()) || []).includes(m.toLowerCase()) ? `Board "${m}" already exists` : null : "Board name cannot be empty";
  }
  async function St(l) {
    const m = l.trim(), b = Be(m);
    if (b) {
      J(b);
      return;
    }
    try {
      await ut(m), A?.type === "move-to-board" && A.taskIds.length > 0 && (await Pe(m, A.taskIds), D.clearSelection()), F(null), J(null);
    } catch (_) {
      console.error("[App] Failed to create board:", _), J(_.message || "Failed to create board");
    }
  }
  const Ct = G?.boards?.find((l) => l.id === ge)?.tags || [], Dt = qt(oe, Oe ? 3 : 6), Je = h.endsWith("-dark") || h === "dark";
  return ne ? /* @__PURE__ */ r(
    "div",
    {
      ref: Ce,
      className: "task-app-container task-app-fade-in",
      "data-dark-theme": Je ? "true" : "false",
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
          /* @__PURE__ */ r(
            "h1",
            {
              className: "task-app__header",
              onClick: () => ee(!0),
              style: { cursor: "pointer" },
              title: "Settings",
              children: "Tasks"
            }
          ),
          /* @__PURE__ */ T("div", { className: "theme-picker", ref: De, children: [
            /* @__PURE__ */ r(
              "button",
              {
                className: "theme-toggle-btn",
                onClick: () => Y(!j),
                "aria-label": "Choose theme",
                title: "Choose theme",
                children: ca(h, f.experimentalThemes || !1)
              }
            ),
            j && /* @__PURE__ */ T("div", { className: "theme-picker__dropdown", children: [
              /* @__PURE__ */ r("div", { className: "theme-picker__pills", children: ft.map((l, m) => /* @__PURE__ */ T("div", { className: "theme-pill", children: [
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
                    ee(!0), Y(!1);
                  },
                  "aria-label": "Settings",
                  title: "Settings",
                  children: /* @__PURE__ */ r(aa, {})
                }
              )
            ] })
          ] })
        ] }),
        /* @__PURE__ */ T("div", { className: "task-app__boards", children: [
          /* @__PURE__ */ r("div", { className: "task-app__board-list", children: (G && G.boards ? G.boards.slice(0, at) : [{ id: "main", name: "main", tasks: [], tags: [] }]).map((l) => /* @__PURE__ */ r(
            Zt,
            {
              board: l,
              isActive: ge === l.id,
              isDragOver: D.dragOverFilter === `board:${l.id}`,
              onSwitch: ht,
              onContextMenu: (m, b, _) => ie({ boardId: m, x: b, y: _ }),
              onDragOverFilter: D.setDragOverFilter,
              onMoveTasksToBoard: Pe,
              onClearSelection: D.clearSelection
            },
            l.id
          )) }),
          /* @__PURE__ */ T("div", { className: "task-app__board-actions", children: [
            (!G || G.boards && G.boards.length < at) && /* @__PURE__ */ r(
              "button",
              {
                className: `board-add-btn ${D.dragOverFilter === "add-board" ? "board-btn--drag-over" : ""}`,
                onClick: () => {
                  H(""), J(null), v(!0);
                },
                onDragOver: (l) => {
                  l.preventDefault(), l.dataTransfer.dropEffect = "move", D.setDragOverFilter("add-board");
                },
                onDragLeave: (l) => {
                  D.setDragOverFilter(null);
                },
                onDrop: async (l) => {
                  l.preventDefault(), D.setDragOverFilter(null);
                  const m = Ne(l.dataTransfer);
                  m.length > 0 && (H(""), F({ type: "move-to-board", taskIds: m }), v(!0));
                },
                "aria-label": "Create board",
                children: "＋"
              }
            ),
            e !== "public" && /* @__PURE__ */ r(
              "button",
              {
                className: `sync-btn ${re ? "spinning" : ""}`,
                onClick: async (l) => {
                  if (re) return;
                  console.log("[App] Manual refresh triggered"), ce(!0);
                  const m = l.currentTarget, b = new Promise((_, U) => {
                    setTimeout(() => U(new Error("Sync timeout")), 5e3);
                  });
                  try {
                    await Promise.race([Ie(), b]), console.log("[App] Sync completed successfully");
                  } catch (_) {
                    console.error("[App] Sync failed:", _);
                  } finally {
                    ce(!1), m && m.blur();
                  }
                },
                disabled: re,
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
            ref: de,
            className: "task-app__input",
            placeholder: n,
            onKeyDown: (l) => {
              l.key === "Enter" && !l.shiftKey && (l.preventDefault(), Tt(l.target.value)), l.key === "k" && (l.ctrlKey || l.metaKey) && (l.preventDefault(), de.current?.focus());
            }
          }
        ) }),
        /* @__PURE__ */ T("div", { className: "task-app__filters", children: [
          (() => {
            const l = xe(oe);
            return Array.from(/* @__PURE__ */ new Set([...Ct, ...l])).map((b) => /* @__PURE__ */ r(
              Qt,
              {
                tag: b,
                isActive: i.has(b),
                isDragOver: D.dragOverFilter === b,
                onToggle: (_) => {
                  c((U) => {
                    const $ = new Set(U);
                    return $.has(_) ? $.delete(_) : $.add(_), $;
                  });
                },
                onContextMenu: (_, U, $) => be({ tag: _, x: U, y: $ }),
                onDragOver: D.onFilterDragOver,
                onDragLeave: D.onFilterDragLeave,
                onDrop: D.onFilterDrop
              },
              b
            ));
          })(),
          /* @__PURE__ */ r(
            "button",
            {
              className: `task-app__filter-add ${D.dragOverFilter === "add-tag" ? "task-app__filter-drag-over" : ""}`,
              onClick: () => {
                H(""), w(!0);
              },
              onDragOver: (l) => {
                l.preventDefault(), l.dataTransfer.dropEffect = "copy", D.onFilterDragOver(l, "add-tag");
              },
              onDragLeave: D.onFilterDragLeave,
              onDrop: async (l) => {
                l.preventDefault(), D.onFilterDragLeave(l);
                const m = Ne(l.dataTransfer);
                m.length > 0 && (H(""), F({ type: "apply-tag", taskIds: m }), w(!0));
              },
              "aria-label": "Add tag",
              children: "＋"
            }
          )
        ] }),
        /* @__PURE__ */ r(
          na,
          {
            tasks: oe,
            topTags: Dt,
            isMobile: Oe,
            filters: Array.from(i),
            selectedIds: D.selectedIds,
            onSelectionStart: D.selectionStartHandler,
            onSelectionMove: D.selectionMoveHandler,
            onSelectionEnd: D.selectionEndHandler,
            sortDirections: me.sortDirections,
            dragOverTag: D.dragOverTag,
            pendingOperations: it,
            onComplete: lt,
            onDelete: dt,
            onAddTag: gt,
            onEditTag: vt,
            onDragStart: D.onDragStart,
            onDragEnd: D.onDragEnd,
            onDragOver: D.onDragOver,
            onDragLeave: D.onDragLeave,
            onDrop: D.onDrop,
            toggleSort: me.toggleSort,
            sortTasksByAge: me.sortTasksByAge,
            getSortIcon: me.getSortIcon,
            getSortTitle: me.getSortTitle,
            deleteTag: yt,
            onDeletePersistedTag: mt,
            showCompleteButton: S,
            showDeleteButton: C,
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
          ke,
          {
            isOpen: !!d,
            title: `Clear Tag #${d?.tag}?`,
            onClose: () => p(null),
            onConfirm: async () => {
              if (!d) return;
              const l = d.tag;
              p(null), await Me(l);
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
          ke,
          {
            isOpen: g,
            title: "Create New Board",
            onClose: () => {
              v(!1), F(null), J(null);
            },
            onConfirm: async () => {
              if (!I.trim()) return;
              const l = Be(I);
              if (l) {
                J(l);
                return;
              }
              v(!1), await St(I);
            },
            inputValue: I,
            onInputChange: (l) => {
              H(l), J(null);
            },
            inputPlaceholder: "Board name",
            confirmLabel: "Create",
            confirmDisabled: !I.trim() || Be(I) !== null,
            children: [
              A?.type === "move-to-board" && A.taskIds.length > 0 && /* @__PURE__ */ T("p", { className: "modal-hint", children: [
                A.taskIds.length,
                " task",
                A.taskIds.length > 1 ? "s" : "",
                " will be moved to this board"
              ] }),
              z && /* @__PURE__ */ r("p", { className: "modal-error", style: { color: "var(--error-color, #d32f2f)", marginTop: "0.5rem" }, children: z })
            ]
          }
        ),
        /* @__PURE__ */ T(
          ke,
          {
            isOpen: O,
            title: "Create New Tag",
            onClose: () => {
              w(!1), F(null);
            },
            onConfirm: async () => {
              if (I.trim()) {
                w(!1);
                try {
                  await wt(I);
                } catch (l) {
                  console.error("[App] Failed to create tag:", l);
                }
              }
            },
            inputValue: I,
            onInputChange: H,
            inputPlaceholder: "Enter new tag name",
            confirmLabel: "Create",
            confirmDisabled: !I.trim(),
            children: [
              A?.type === "apply-tag" && A.taskIds.length > 0 && /* @__PURE__ */ T("p", { className: "modal-hint", children: [
                "This tag will be applied to ",
                A.taskIds.length,
                " task",
                A.taskIds.length > 1 ? "s" : ""
              ] }),
              xe(oe).length > 0 && /* @__PURE__ */ T("div", { className: "modal-section", children: [
                /* @__PURE__ */ r("label", { className: "modal-label", children: "Existing tags:" }),
                /* @__PURE__ */ r("div", { className: "modal-tags-list", children: xe(oe).map((l) => /* @__PURE__ */ T("span", { className: "modal-tag-chip", children: [
                  "#",
                  l
                ] }, l)) })
              ] })
            ]
          }
        ),
        /* @__PURE__ */ T(
          ke,
          {
            isOpen: Q,
            title: "Settings",
            onClose: () => ee(!1),
            onConfirm: () => ee(!1),
            confirmLabel: "Close",
            cancelLabel: "Close",
            children: [
              /* @__PURE__ */ T("div", { className: "settings-section", children: [
                /* @__PURE__ */ r("h4", { className: "settings-section-title", children: "User Management" }),
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
                        value: E,
                        onChange: (l) => {
                          M(l.target.value), y(null);
                        },
                        onKeyDown: (l) => {
                          l.key === "Enter" && E && !R && Ue();
                        },
                        placeholder: "Enter authentication key",
                        disabled: R
                      }
                    ),
                    E && /* @__PURE__ */ r(
                      "button",
                      {
                        className: "settings-field-button",
                        onClick: Ue,
                        disabled: R,
                        children: R ? /* @__PURE__ */ r("span", { className: "spinner" }) : "↵"
                      }
                    )
                  ] }),
                  K && /* @__PURE__ */ r("span", { className: "settings-error", children: K })
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
                        ue({ experimentalThemes: l.target.checked });
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
                        ue({ alwaysVerticalLayout: l.target.checked });
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
                      checked: !S,
                      onChange: (l) => {
                        ue({ showCompleteButton: !l.target.checked });
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
                      checked: !C,
                      onChange: (l) => {
                        ue({ showDeleteButton: !l.target.checked });
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
                        ue({ showTagButton: l.target.checked });
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
          ke,
          {
            isOpen: !!le,
            title: "Edit Tags",
            onClose: () => {
              he(null), ye("");
            },
            onConfirm: Ke,
            confirmLabel: "Save",
            cancelLabel: "Cancel",
            children: /* @__PURE__ */ T("div", { className: "edit-tag-modal", children: [
              G?.boards?.find((l) => l.id === ge)?.tags && G.boards.find((l) => l.id === ge).tags.length > 0 && /* @__PURE__ */ T("div", { className: "edit-tag-pills", children: [
                /* @__PURE__ */ r("label", { className: "edit-tag-label", children: "Select Tags" }),
                /* @__PURE__ */ r("div", { className: "edit-tag-pills-container", children: [...G.boards.find((l) => l.id === ge).tags].sort().map((l) => {
                  const b = (le?.currentTag?.split(" ").filter(Boolean) || []).includes(l);
                  return /* @__PURE__ */ T(
                    "button",
                    {
                      className: `edit-tag-pill ${b ? "active" : ""}`,
                      onClick: () => bt(l),
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
                    value: Se,
                    onChange: (l) => {
                      ye(l.target.value);
                    },
                    onKeyDown: (l) => {
                      l.key === "Enter" && (l.preventDefault(), Ke());
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
          Ze,
          {
            isOpen: !!P,
            x: P?.x || 0,
            y: P?.y || 0,
            items: [
              {
                label: "🗑️ Delete Board",
                isDanger: !0,
                onClick: async () => {
                  if (!P) return;
                  const l = G?.boards?.find((m) => m.id === P.boardId)?.name || P.boardId;
                  if (confirm(`Delete board "${l}"? All tasks on this board will be permanently deleted.`))
                    try {
                      await pt(P.boardId), ie(null);
                    } catch (m) {
                      console.error("[App] Failed to delete board:", m), alert(m.message || "Failed to delete board");
                    }
                }
              }
            ]
          }
        ),
        /* @__PURE__ */ r(
          Ze,
          {
            isOpen: !!V,
            x: V?.x || 0,
            y: V?.y || 0,
            className: "tag-context-menu",
            items: [
              {
                label: "🗑️ Delete Tag",
                isDanger: !0,
                onClick: async () => {
                  if (console.log("[App] Delete Tag clicked!", { tagContextMenu: V }), !V) {
                    console.error("[App] No tagContextMenu when Delete Tag clicked!");
                    return;
                  }
                  try {
                    console.log("[App] Calling deleteTag for tag:", V.tag), await Me(V.tag), console.log("[App] deleteTag completed successfully"), be(null);
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
  ) : /* @__PURE__ */ r("div", { className: "task-app-loading", "data-dark-theme": Je ? "true" : "false", children: /* @__PURE__ */ T("div", { className: "task-app-loading__skeleton", children: [
    /* @__PURE__ */ r("div", { className: "skeleton-header" }),
    /* @__PURE__ */ T("div", { className: "skeleton-boards", children: [
      /* @__PURE__ */ r("div", { className: "skeleton-board" }),
      /* @__PURE__ */ r("div", { className: "skeleton-board" }),
      /* @__PURE__ */ r("div", { className: "skeleton-board" })
    ] }),
    /* @__PURE__ */ r("div", { className: "skeleton-input" }),
    /* @__PURE__ */ T("div", { className: "skeleton-filters", children: [
      /* @__PURE__ */ r("div", { className: "skeleton-filter" }),
      /* @__PURE__ */ r("div", { className: "skeleton-filter" }),
      /* @__PURE__ */ r("div", { className: "skeleton-filter" })
    ] }),
    /* @__PURE__ */ T("div", { className: "skeleton-tasks", children: [
      /* @__PURE__ */ r("div", { className: "skeleton-task" }),
      /* @__PURE__ */ r("div", { className: "skeleton-task" }),
      /* @__PURE__ */ r("div", { className: "skeleton-task" })
    ] })
  ] }) });
}
function ha(t, e = {}) {
  const a = new URLSearchParams(window.location.search), o = e.userType || a.get("userType") || "admin", s = e.userId || "test-admin", n = e.sessionId, i = { ...e, userType: o, userId: s, sessionId: n }, c = xt(t);
  c.render(/* @__PURE__ */ r(la, { ...i })), t.__root = c, console.log("[task-app] Mounted successfully", i);
}
function ma(t) {
  t.__root?.unmount();
}
export {
  ha as mount,
  ma as unmount
};
