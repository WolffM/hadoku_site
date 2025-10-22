import { jsx as r, jsxs as k, Fragment as _t } from "react/jsx-runtime";
import { createRoot as Lt } from "react-dom/client";
import { useState as N, useMemo as it, useEffect as Q, useRef as we } from "react";
const j = `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
class Et {
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
function It() {
  const t = Date.now().toString(36).toUpperCase().padStart(8, "0"), e = crypto.getRandomValues(new Uint8Array(18)), a = Array.from(e).map((o) => (o % 36).toString(36).toUpperCase()).join("");
  return t + a;
}
function se() {
  return (/* @__PURE__ */ new Date()).toISOString();
}
function Oe(t, e) {
  const a = t.tasks.findIndex((o) => o.id === e);
  if (a < 0)
    throw new Error("Task not found");
  return { task: t.tasks[a], index: a };
}
function Se(t, e) {
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
function Ot(t, e, a) {
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
function Ft(t, e, a) {
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
function $e(t, e, a) {
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
function $t(t, e, a) {
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
async function Mt(t, e) {
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
async function Pt(t, e, a, o = "main") {
  const s = se(), n = await t.getTasks(e.userType, e.userId, o), i = await t.getStats(e.userType, e.userId, o), c = a.id || It(), d = a.createdAt || s, p = {
    id: c,
    title: a.title,
    tag: a.tag ?? null,
    state: "Active",
    createdAt: d
  }, u = {
    ...n,
    tasks: [p, ...n.tasks],
    updatedAt: s
  }, v = Ot(i, p, s);
  return await t.saveTasks(e.userType, e.userId, o, u), await t.saveStats(e.userType, e.userId, o, v), { ok: !0, id: c };
}
async function Rt(t, e, a, o, s = "main") {
  const n = se(), i = await t.getTasks(e.userType, e.userId, s), c = await t.getStats(e.userType, e.userId, s), { task: d, index: p } = Oe(i, a), u = {
    ...d,
    ...o,
    updatedAt: n
  }, v = [...i.tasks];
  v[p] = u;
  const I = {
    ...i,
    tasks: v,
    updatedAt: n
  }, w = $e(c, u, n);
  return await t.saveTasks(e.userType, e.userId, s, I), await t.saveStats(e.userType, e.userId, s, w), { ok: !0, message: `Task ${a} updated` };
}
async function Ut(t, e, a, o = "main") {
  const s = se(), n = await t.getTasks(e.userType, e.userId, o), i = await t.getStats(e.userType, e.userId, o), { task: c, index: d } = Oe(n, a), p = {
    ...c,
    state: "Completed",
    closedAt: s,
    updatedAt: s
  }, u = [...n.tasks];
  u.splice(d, 1);
  const v = {
    ...n,
    tasks: u,
    updatedAt: s
  }, I = Ft(i, p, s);
  return await t.saveTasks(e.userType, e.userId, o, v), await t.saveStats(e.userType, e.userId, o, I), { ok: !0, message: `Task ${a} completed` };
}
async function Kt(t, e, a, o = "main") {
  const s = se(), n = await t.getTasks(e.userType, e.userId, o), i = await t.getStats(e.userType, e.userId, o), { task: c, index: d } = Oe(n, a), p = {
    ...c,
    state: "Deleted",
    closedAt: s,
    updatedAt: s
  }, u = [...n.tasks];
  u.splice(d, 1);
  const v = {
    ...n,
    tasks: u,
    updatedAt: s
  }, I = $t(i, p, s);
  return await t.saveTasks(e.userType, e.userId, o, v), await t.saveStats(e.userType, e.userId, o, I), { ok: !0, message: `Task ${a} deleted` };
}
async function Jt(t, e, a) {
  const o = se(), s = await t.getBoards(e.userType, e.userId);
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
async function Wt(t, e, a) {
  if (a === "main")
    throw new Error("Cannot delete the main board");
  const o = se(), s = await t.getBoards(e.userType, e.userId);
  Se(s, a);
  const n = {
    ...s,
    updatedAt: o,
    boards: s.boards.filter((i) => i.id !== a)
  };
  return await t.saveBoards(e.userType, n, e.userId), { ok: !0, message: `Board ${a} deleted` };
}
async function Ht(t, e, a) {
  const o = se(), s = await t.getBoards(e.userType, e.userId), { board: n, index: i } = Se(s, a.boardId), c = n.tags || [];
  if (c.includes(a.tag))
    return { ok: !0, message: `Tag ${a.tag} already exists` };
  const d = {
    ...n,
    tags: [...c, a.tag]
  }, p = Fe(s, i, d, o);
  return await t.saveBoards(e.userType, p, e.userId), { ok: !0, message: `Tag ${a.tag} added to board ${a.boardId}` };
}
async function jt(t, e, a) {
  const o = se(), s = await t.getBoards(e.userType, e.userId), { board: n, index: i } = Se(s, a.boardId), c = n.tags || [], d = {
    ...n,
    tags: c.filter((u) => u !== a.tag)
  }, p = Fe(s, i, d, o);
  return await t.saveBoards(e.userType, p, e.userId), { ok: !0, message: `Tag ${a.tag} removed from board ${a.boardId}` };
}
async function Xt(t, e, a) {
  const o = se(), s = await t.getTasks(e.userType, e.userId, a.boardId), n = await t.getStats(e.userType, e.userId, a.boardId);
  let i = 0;
  const c = s.tasks.map((u) => {
    const v = a.updates.find((I) => I.taskId === u.id);
    return v ? (i++, {
      ...u,
      tag: v.tag || void 0,
      updatedAt: o
    }) : u;
  }), d = {
    ...s,
    tasks: c,
    updatedAt: o
  };
  let p = n;
  for (const u of c)
    a.updates.find((v) => v.taskId === u.id) && (p = $e(p, u, o));
  return await t.saveTasks(e.userType, e.userId, a.boardId, d), await t.saveStats(e.userType, e.userId, a.boardId, p), {
    ok: !0,
    message: `Updated ${i} task(s) on board ${a.boardId}`,
    updated: i
  };
}
async function qt(t, e, a) {
  const o = se(), s = await t.getTasks(e.userType, e.userId, a.boardId), n = await t.getStats(e.userType, e.userId, a.boardId), i = await t.getBoards(e.userType, e.userId);
  let c = 0;
  const d = s.tasks.map((O) => {
    if (a.taskIds.includes(O.id) && O.tag) {
      const V = O.tag.split(" ").filter(Boolean).filter((K) => K !== a.tag);
      return c++, {
        ...O,
        tag: V.length > 0 ? V.join(" ") : void 0,
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
    a.taskIds.includes(O.id) && (u = $e(u, O, o));
  const { board: v, index: I } = Se(i, a.boardId), w = v.tags || [], A = {
    ...v,
    tags: w.filter((O) => O !== a.tag)
  }, M = Fe(i, I, A, o);
  return await t.saveTasks(e.userType, e.userId, a.boardId, p), await t.saveStats(e.userType, e.userId, a.boardId, u), await t.saveBoards(e.userType, M, e.userId), {
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
function Vt(t = "public", e = "public") {
  const a = new Et(t, e), o = { userType: "registered", userId: e };
  return {
    async getBoards() {
      const s = await Mt(a, o), n = {
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
      const n = await Jt(
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
      }), te("boards-updated", { sessionId: j, userType: t, userId: e }), n.board;
    },
    async deleteBoard(s) {
      await Wt(
        a,
        o,
        s
      ), await a.deleteBoardData(t, e, s), te("boards-updated", { sessionId: j, userType: t, userId: e });
    },
    async getTasks(s = "main") {
      return a.getTasks(t, e, s);
    },
    async getStats(s = "main") {
      return a.getStats(t, e, s);
    },
    async createTask(s, n = "main", i = !1) {
      console.log("[localStorageApi] createTask (using handler)", { data: s, boardId: n, suppressBroadcast: i });
      const c = await Pt(
        a,
        o,
        s,
        n
      ), p = (await a.getTasks(t, e, n)).tasks.find((u) => u.id === c.id);
      if (!p)
        throw new Error("Task creation failed - task not found after creation");
      return i ? console.log("[localStorageApi] createTask: broadcast suppressed") : (console.log("[localStorageApi] createTask: broadcasting", {
        sessionId: j,
        boardId: n,
        taskId: c.id
      }), te("tasks-updated", { sessionId: j, userType: t, userId: e, boardId: n })), p;
    },
    async patchTask(s, n, i = "main", c = !1) {
      const d = {};
      n.title !== void 0 && (d.title = n.title), n.tag !== void 0 && n.tag !== null && (d.tag = n.tag), await Rt(
        a,
        o,
        s,
        d,
        i
      ), c || te("tasks-updated", { sessionId: j, userType: t, userId: e, boardId: i });
      const u = (await a.getTasks(t, e, i)).tasks.find((v) => v.id === s);
      if (!u)
        throw new Error("Task not found after update");
      return u;
    },
    async completeTask(s, n = "main") {
      const c = (await a.getTasks(t, e, n)).tasks.find((d) => d.id === s);
      if (!c)
        throw new Error("Task not found");
      return await Ut(
        a,
        o,
        s,
        n
      ), te("tasks-updated", { sessionId: j, userType: t, userId: e, boardId: n }), {
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
      return await Kt(
        a,
        o,
        s,
        n
      ), i ? console.log("[localStorageApi] deleteTask: broadcast suppressed") : (console.log("[localStorageApi] deleteTask: broadcasting", { sessionId: j }), te("tasks-updated", { sessionId: j, userType: t, userId: e, boardId: n })), {
        ...d,
        state: "Deleted",
        closedAt: (/* @__PURE__ */ new Date()).toISOString(),
        updatedAt: (/* @__PURE__ */ new Date()).toISOString()
      };
    },
    async createTag(s, n = "main") {
      await Ht(
        a,
        o,
        { boardId: n, tag: s }
      ), te("boards-updated", { sessionId: j, userType: t, userId: e, boardId: n });
    },
    async deleteTag(s, n = "main") {
      await jt(
        a,
        o,
        { boardId: n, tag: s }
      ), te("boards-updated", { sessionId: j, userType: t, userId: e, boardId: n });
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
      const u = d.tasks.filter((A) => i.includes(A.id));
      d.tasks = d.tasks.filter((A) => !i.includes(A.id)), p.tasks = [...p.tasks, ...u], c.updatedAt = (/* @__PURE__ */ new Date()).toISOString();
      const v = `${t}-${e}-boards`;
      localStorage.setItem(v, JSON.stringify(c));
      const I = `${t}-${e}-${s}-tasks`, w = `${t}-${e}-${n}-tasks`;
      return localStorage.setItem(I, JSON.stringify({
        version: 1,
        updatedAt: c.updatedAt,
        tasks: d.tasks
      })), localStorage.setItem(w, JSON.stringify({
        version: 1,
        updatedAt: c.updatedAt,
        tasks: p.tasks
      })), te("boards-updated", { sessionId: j, userType: t, userId: e }), { ok: !0, moved: u.length };
    },
    async batchUpdateTags(s, n) {
      console.log("[localStorageApi] batchUpdateTags", { boardId: s, updates: n }), await Xt(
        a,
        o,
        { boardId: s, updates: n }
      ), te("tasks-updated", { sessionId: j, userType: t, userId: e, boardId: s });
    },
    async batchClearTag(s, n, i) {
      console.log("[localStorageApi] batchClearTag START", { boardId: s, tag: n, taskIds: i, taskCount: i.length });
      const c = await qt(
        a,
        o,
        { boardId: s, tag: n, taskIds: i }
      );
      console.log("[localStorageApi] batchClearTag result:", c), te("boards-updated", { sessionId: j, userType: t, userId: e, boardId: s }), console.log("[localStorageApi] batchClearTag END");
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
async function zt(t, e, a, o) {
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
function H(t, e, a) {
  const o = {
    "Content-Type": "application/json",
    "X-User-Type": t
  };
  return e && (o["X-User-Id"] = e), a && (o["X-Session-Id"] = a), o;
}
function ye(t = "public", e = "public", a) {
  const o = Vt(t, e);
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
          headers: H(t, e, a)
        });
        if (!s.ok)
          throw new Error(`API returned ${s.status}`);
        const n = await s.json();
        if (!n || !n.boards || !Array.isArray(n.boards)) {
          console.error("[api] Invalid response structure:", n);
          return;
        }
        console.log("[api] Synced from API:", { boards: n.boards.length, totalTasks: n.boards.reduce((i, c) => i + (c.tasks?.length || 0), 0) }), await zt(o, n, t, e);
      } catch (s) {
        console.error("[api] Sync from API failed:", s);
      }
    },
    async createTask(s, n = "main", i = !1) {
      const c = await o.createTask(s, n, i);
      return fetch("/task/api", {
        method: "POST",
        headers: H(t, e, a),
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
        headers: H(t, e, a),
        body: JSON.stringify({ boardId: n, tag: s })
      }).then(() => console.log("[api] Background sync: createTag completed")).catch((c) => console.error("[api] Failed to sync createTag:", c)), i;
    },
    async deleteTag(s, n = "main") {
      const i = await o.deleteTag(s, n);
      return fetch("/task/api/tags/delete", {
        method: "POST",
        headers: H(t, e, a),
        body: JSON.stringify({ boardId: n, tag: s })
      }).then(() => console.log("[api] Background sync: deleteTag completed")).catch((c) => console.error("[api] Failed to sync deleteTag:", c)), i;
    },
    async patchTask(s, n, i = "main", c = !1) {
      const d = await o.patchTask(s, n, i, c);
      return fetch(`/task/api/${s}`, {
        method: "PATCH",
        headers: H(t, e, a),
        body: JSON.stringify({ ...n, boardId: i })
      }).then(() => console.log("[api] Background sync: patchTask completed")).catch((p) => console.error("[api] Failed to sync patchTask:", p)), d;
    },
    async completeTask(s, n = "main") {
      const i = await o.completeTask(s, n);
      return fetch(`/task/api/${s}/complete`, {
        method: "POST",
        headers: H(t, e, a),
        body: JSON.stringify({ boardId: n })
      }).then((c) => {
        if (!c.ok) throw new Error(`HTTP ${c.status}`);
        console.log("[api] Background sync: completeTask completed");
      }).catch((c) => console.error("[api] Failed to sync completeTask:", c)), i;
    },
    async deleteTask(s, n = "main", i = !1) {
      await o.deleteTask(s, n, i), fetch(`/task/api/${s}`, {
        method: "DELETE",
        headers: H(t, e, a),
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
        headers: H(t, e, a),
        body: JSON.stringify({ id: s, name: s })
      }).then(() => console.log("[api] Background sync: createBoard completed")).catch((i) => console.error("[api] Failed to sync createBoard:", i)), n;
    },
    async deleteBoard(s) {
      const n = await o.deleteBoard(s);
      return fetch(`/task/api/boards/${encodeURIComponent(s)}`, {
        method: "DELETE",
        headers: H(t, e, a)
      }).then(() => console.log("[api] Background sync: deleteBoard completed")).catch((i) => console.error("[api] Failed to sync deleteBoard:", i)), n;
    },
    // User preferences
    async getPreferences() {
      const s = await o.getPreferences();
      try {
        const n = await fetch("/task/api/preferences", {
          headers: H(t, e, a)
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
        headers: H(t, e, a),
        body: JSON.stringify(p)
      }).then(() => console.log("[api] Background sync: savePreferences completed (server-only)")).catch((u) => console.error("[api] Failed to sync savePreferences:", u));
    },
    // Batch operations
    async batchUpdateTags(s, n) {
      await o.batchUpdateTags(s, n), fetch("/task/api/batch-tag", {
        method: "PATCH",
        headers: H(t, e, a),
        body: JSON.stringify({ boardId: s, updates: n })
      }).then(() => console.log("[api] Background sync: batchUpdateTags completed")).catch((i) => console.error("[api] Failed to sync batchUpdateTags:", i));
    },
    async batchMoveTasks(s, n, i) {
      const c = await o.batchMoveTasks(s, n, i);
      return fetch("/task/api/batch-move", {
        method: "POST",
        headers: H(t, e, a),
        body: JSON.stringify({ sourceBoardId: s, targetBoardId: n, taskIds: i })
      }).then(() => console.log("[api] Background sync: batchMoveTasks completed")).catch((d) => console.error("[api] Failed to sync batchMoveTasks:", d)), c;
    },
    async batchClearTag(s, n, i) {
      await o.batchClearTag(s, n, i), fetch("/task/api/batch-clear-tag", {
        method: "POST",
        headers: H(t, e, a),
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
          headers: H(t, e, a),
          body: JSON.stringify({ newUserId: s })
        })).json();
      } catch (n) {
        return console.error("[api] Failed to set userId:", n), { ok: !1, message: "Failed to set userId" };
      }
    }
  };
}
function Yt(t) {
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
function Gt(t, e = 6, a = []) {
  const o = t.flatMap((n) => n.tag?.split(" ") || []).filter(Boolean), s = {};
  return o.forEach((n) => s[n] = (s[n] || 0) + 1), a.filter(Boolean).forEach((n) => {
    s[n] || (s[n] = 0);
  }), Object.entries(s).sort((n, i) => i[1] - n[1]).slice(0, e).map(([n]) => n);
}
function qe(t, e) {
  return t.filter((a) => a.tag?.split(" ").includes(e));
}
function Zt(t, e, a) {
  const o = Array.isArray(a) && a.length > 0;
  return t.filter((s) => {
    const n = s.tag?.split(" ") || [];
    return o ? a.some((c) => n.includes(c)) && !e.some((c) => n.includes(c)) : !e.some((i) => n.includes(i));
  });
}
function Le(t) {
  return Array.from(new Set(t.flatMap((e) => e.tag?.split(" ") || []).filter(Boolean)));
}
async function Ve(t, e, a, o, s = {}) {
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
function Qt({ userType: t, userId: e, sessionId: a }) {
  const [o, s] = N([]), [n, i] = N(/* @__PURE__ */ new Set()), c = it(
    () => ye(t, e || "public", a),
    [t, e, a]
  ), [d, p] = N(null), [u, v] = N("main");
  async function I() {
    console.log("[useTasks] initialLoad called"), "syncFromApi" in c && await c.syncFromApi(), await w();
  }
  async function w() {
    console.log("[useTasks] reload called", { currentBoardId: u, stack: new Error().stack?.split(`
`).slice(1, 4).join(`
`) });
    const m = await c.getBoards();
    p(m);
    const { tasks: T } = ke(m, u);
    s(T);
  }
  Q(() => {
    console.log("[useTasks] User context changed, clearing state and reloading", { userType: t, userId: e }), s([]), i(/* @__PURE__ */ new Set()), p(null), v("main"), w();
  }, [t, e]), Q(() => {
    console.log("[useTasks] Setting up BroadcastChannel listener", { currentBoardId: u, userType: t, userId: e });
    try {
      const m = new BroadcastChannel("tasks");
      return m.onmessage = (T) => {
        const g = T.data || {};
        if (console.log("[useTasks] BroadcastChannel message received", { msg: g, sessionId: j, currentBoardId: u, currentContext: { userType: t, userId: e } }), g.sessionId === j) {
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
        (g.type === "tasks-updated" || g.type === "boards-updated") && (console.log("[useTasks] BroadcastChannel: triggering reload for currentBoardId =", u), w());
      }, () => {
        console.log("[useTasks] Cleaning up BroadcastChannel listener", { currentBoardId: u }), m.close();
      };
    } catch (m) {
      console.error("[useTasks] Failed to setup BroadcastChannel", m);
    }
  }, [u, t, e]);
  async function A(m) {
    if (m = m.trim(), !!m)
      try {
        const T = Yt(m);
        return await c.createTask(T, u), await w(), !0;
      } catch (T) {
        return alert(T.message || "Failed to create task"), !1;
      }
  }
  async function M(m) {
    await Ve(
      `complete-${m}`,
      n,
      i,
      async () => {
        await c.completeTask(m, u), await w();
      },
      {
        onError: (T) => alert(T.message || "Failed to complete task")
      }
    );
  }
  async function O(m) {
    console.log("[useTasks] deleteTask START", { taskId: m, currentBoardId: u }), await Ve(
      `delete-${m}`,
      n,
      i,
      async () => {
        console.log("[useTasks] deleteTask: calling api.deleteTask", { taskId: m, currentBoardId: u }), await c.deleteTask(m, u), console.log("[useTasks] deleteTask: calling reload"), await w(), console.log("[useTasks] deleteTask END");
      },
      {
        onError: (T) => alert(T.message || "Failed to delete task")
      }
    );
  }
  async function X(m) {
    const T = prompt("Enter tag (without #):");
    if (!T) return;
    const g = T.trim().replace(/^#+/, "").replace(/\s+/g, "-"), f = o.find((D) => D.id === m);
    if (!f) return;
    const b = f.tag?.split(" ") || [];
    if (b.includes(g)) return;
    const S = [...b, g].join(" ");
    try {
      await c.patchTask(m, { tag: S }, u), await w();
    } catch (D) {
      alert(D.message || "Failed to add tag");
    }
  }
  async function V(m, T, g = {}) {
    const { suppressBroadcast: f = !1, skipReload: b = !1 } = g;
    try {
      await c.patchTask(m, T, u, f), b || await w();
    } catch (S) {
      throw S;
    }
  }
  async function K(m) {
    console.log("[useTasks] bulkUpdateTaskTags START", { count: m.length });
    try {
      await c.batchUpdateTags(
        u,
        m.map((T) => ({ taskId: T.taskId, tag: T.tag || null }))
      ), console.log("[useTasks] bulkUpdateTaskTags: calling reload"), await w(), console.log("[useTasks] bulkUpdateTaskTags END");
    } catch (T) {
      throw console.error("[useTasks] bulkUpdateTaskTags ERROR", T), T;
    }
  }
  async function q(m) {
    console.log("[useTasks] deleteTag START", { tag: m, currentBoardId: u, taskCount: o.length });
    const T = o.filter((g) => g.tag?.split(" ").includes(m));
    if (console.log("[useTasks] deleteTag: found tasks with tag", { tag: m, count: T.length }), T.length === 0) {
      console.log("[useTasks] deleteTag: no tasks found with this tag, just deleting tag");
      try {
        await c.deleteTag(m, u), await w(), console.log("[useTasks] deleteTag END (no tasks to clear)");
      } catch (g) {
        console.error("[useTasks] deleteTag ERROR", g), console.error("[useTasks] deleteTag: Please fix this error:", g.message);
      }
      return;
    }
    try {
      console.log("[useTasks] deleteTag: starting batch clear"), await c.batchClearTag(
        u,
        m,
        T.map((g) => g.id)
      ), console.log("[useTasks] deleteTag: calling reload"), await w(), console.log("[useTasks] deleteTag END");
    } catch (g) {
      console.error("[useTasks] deleteTag ERROR", g), alert(g.message || "Failed to remove tag from tasks");
    }
  }
  async function z(m) {
    await c.createBoard(m), v(m);
    const T = await c.getBoards();
    p(T);
    const { tasks: g } = ke(T, m);
    s(g);
  }
  async function ee(m, T) {
    if (console.log("[useTasks] moveTasksToBoard START", { targetBoardId: m, ids: T, currentBoardId: u }), !d) return;
    const g = /* @__PURE__ */ new Set();
    for (const f of d.boards)
      for (const b of f.tasks || [])
        T.includes(b.id) && g.add(f.id);
    console.log("[useTasks] moveTasksToBoard: source boards", { sourceBoardIds: Array.from(g) });
    try {
      if (g.size === 1) {
        const S = Array.from(g)[0];
        console.log("[useTasks] moveTasksToBoard: using batch API"), await c.batchMoveTasks(S, m, T);
      } else
        throw console.error("[useTasks] moveTasksToBoard: Cannot move tasks from multiple boards at once"), new Error("Cannot move tasks from multiple boards at once");
      console.log("[useTasks] moveTasksToBoard: switching to target board", { targetBoardId: m }), v(m);
      const f = await c.getBoards();
      p(f);
      const { tasks: b } = ke(f, m);
      s(b), console.log("[useTasks] moveTasksToBoard END");
    } catch (f) {
      console.error("[useTasks] moveTasksToBoard ERROR", f), alert(f.message || "Failed to move tasks");
    }
  }
  async function Y(m) {
    if (await c.deleteBoard(m), u === m) {
      v("main");
      const T = await c.getBoards();
      p(T);
      const { tasks: g } = ke(T, "main");
      s(g);
    } else
      await w();
  }
  async function le(m) {
    await c.createTag(m, u), await w();
  }
  async function de(m) {
    await c.deleteTag(m, u), await w();
  }
  function F(m) {
    v(m);
    const { tasks: T, foundBoard: g } = ke(d, m);
    g ? s(T) : w();
  }
  return {
    // Task state
    tasks: o,
    pendingOperations: n,
    // Task operations
    addTask: A,
    completeTask: M,
    deleteTask: O,
    addTagToTask: X,
    updateTaskTags: V,
    bulkUpdateTaskTags: K,
    deleteTag: q,
    // Board state
    boards: d,
    currentBoardId: u,
    // Board operations
    createBoard: z,
    deleteBoard: Y,
    switchBoard: F,
    moveTasksToBoard: ee,
    createTagOnBoard: le,
    deleteTagOnBoard: de,
    // Lifecycle
    initialLoad: I,
    reload: w
  };
}
function ea({ tasks: t, onTaskUpdate: e, onBulkUpdate: a }) {
  const [o, s] = N(null), [n, i] = N(null), [c, d] = N(/* @__PURE__ */ new Set()), [p, u] = N(!1), [v, I] = N(null), [w, A] = N(null), M = we(null);
  function O(g) {
    let f = [];
    try {
      const b = g.dataTransfer.getData("application/x-hadoku-task-ids");
      b && (f = JSON.parse(b));
    } catch {
    }
    if (f.length === 0) {
      const b = g.dataTransfer.getData("text/plain");
      b && (f = [b]);
    }
    return f;
  }
  function X(g, f) {
    const b = c.has(f) && c.size > 0 ? Array.from(c) : [f];
    console.log("[useDragAndDrop] onDragStart", { taskId: f, idsToDrag: b, selectedCount: c.size }), g.dataTransfer.setData("text/plain", b[0]);
    try {
      g.dataTransfer.setData("application/x-hadoku-task-ids", JSON.stringify(b));
    } catch {
    }
    g.dataTransfer.effectAllowed = "copyMove";
    try {
      const S = g.currentTarget, D = S.closest && S.closest(".task-app__item") ? S.closest(".task-app__item") : S;
      D.classList.add("dragging");
      const x = D.cloneNode(!0);
      x.style.boxSizing = "border-box", x.style.width = `${D.offsetWidth}px`, x.style.height = `${D.offsetHeight}px`, x.style.opacity = "0.95", x.style.transform = "none", x.style.filter = "drop-shadow(0 6px 18px rgba(0,0,0,0.12))", x.classList.add("drag-image"), x.style.position = "absolute", x.style.top = "-9999px", x.style.left = "-9999px", document.body.appendChild(x), D.__dragImage = x, d((_) => {
        if (_.has(f)) return new Set(_);
        const P = new Set(_);
        return P.add(f), P;
      });
      try {
        const _ = D.closest(".task-app__tag-column");
        if (_) {
          const P = _.querySelector(".task-app__tag-header") || _.querySelector("h3"), y = (P && P.textContent || "").trim().replace(/^#/, "");
          if (y)
            try {
              g.dataTransfer.setData("application/x-hadoku-task-source", y);
            } catch {
            }
        }
      } catch {
      }
      try {
        const _ = D.getBoundingClientRect();
        let P = Math.round(g.clientX - _.left), U = Math.round(g.clientY - _.top);
        P = Math.max(0, Math.min(Math.round(x.offsetWidth - 1), P)), U = Math.max(0, Math.min(Math.round(x.offsetHeight - 1), U)), g.dataTransfer.setDragImage(x, P, U);
      } catch {
        g.dataTransfer.setDragImage(x, 0, 0);
      }
    } catch {
    }
  }
  function V(g) {
    try {
      const f = g.currentTarget;
      f.classList.remove("dragging");
      const b = f.__dragImage;
      b && b.parentNode && b.parentNode.removeChild(b), b && delete f.__dragImage;
    } catch {
    }
    try {
      ee();
    } catch {
    }
  }
  function K(g) {
    if (g.button === 0) {
      try {
        const f = g.target;
        if (!f || f.closest && f.closest(".task-app__item, .task-app__controls, button, input, textarea, .task-app__item-actions"))
          return;
      } catch {
      }
      u(!0), M.current = { x: g.clientX, y: g.clientY }, I({ x: g.clientX, y: g.clientY, w: 0, h: 0 }), d(/* @__PURE__ */ new Set());
      try {
        document.body.classList.add("marquee-selecting");
      } catch {
      }
    }
  }
  function q(g) {
    if (!p || !M.current) return;
    const f = M.current.x, b = M.current.y, S = g.clientX, D = g.clientY, x = Math.min(f, S), _ = Math.min(b, D), P = Math.abs(S - f), U = Math.abs(D - b);
    I({ x, y: _, w: P, h: U });
    const y = Array.from(document.querySelectorAll(".task-app__item")), R = /* @__PURE__ */ new Set();
    for (const L of y) {
      const J = L.getBoundingClientRect();
      if (!(J.right < x || J.left > x + P || J.bottom < _ || J.top > _ + U)) {
        const ae = L.getAttribute("data-task-id");
        ae && R.add(ae), L.classList.add("selected");
      } else
        L.classList.remove("selected");
    }
    d(R);
  }
  function z(g) {
    u(!1), I(null), M.current = null;
    try {
      document.body.classList.remove("marquee-selecting");
    } catch {
    }
    try {
      A(Date.now());
    } catch {
    }
  }
  function ee() {
    d(/* @__PURE__ */ new Set()), Array.from(document.querySelectorAll(".task-app__item.selected")).forEach((f) => f.classList.remove("selected"));
  }
  Q(() => {
    function g(S) {
      if (S.button !== 0) return;
      const D = { target: S.target, clientX: S.clientX, clientY: S.clientY, button: S.button };
      try {
        K(D);
      } catch {
      }
    }
    function f(S) {
      const D = { clientX: S.clientX, clientY: S.clientY };
      try {
        q(D);
      } catch {
      }
    }
    function b(S) {
      const D = { clientX: S.clientX, clientY: S.clientY };
      try {
        z(D);
      } catch {
      }
    }
    return document.addEventListener("mousedown", g), document.addEventListener("mousemove", f), document.addEventListener("mouseup", b), () => {
      document.removeEventListener("mousedown", g), document.removeEventListener("mousemove", f), document.removeEventListener("mouseup", b);
    };
  }, []);
  function Y(g, f) {
    g.preventDefault(), g.dataTransfer.dropEffect = "copy", s(f);
  }
  function le(g) {
    g.currentTarget.contains(g.relatedTarget) || s(null);
  }
  async function de(g, f) {
    g.preventDefault(), s(null), console.log("[useDragAndDrop] onDrop START", { targetTag: f });
    const b = O(g);
    if (b.length === 0) return;
    let S = null;
    try {
      const x = g.dataTransfer.getData("application/x-hadoku-task-source");
      x && (S = x);
    } catch {
    }
    console.log("[useDragAndDrop] onDrop: processing", { targetTag: f, ids: b, srcTag: S, taskCount: b.length });
    const D = [];
    for (const x of b) {
      const _ = t.find((L) => L.id === x);
      if (!_) continue;
      const P = _.tag?.split(" ").filter(Boolean) || [];
      if (f === "other") {
        if (P.length === 0) continue;
        D.push({ taskId: x, tag: "" });
        continue;
      }
      const U = P.includes(f);
      let y = P.slice();
      U || y.push(f), S && S !== f && (y = y.filter((L) => L !== S));
      const R = y.join(" ").trim();
      D.push({ taskId: x, tag: R });
    }
    console.log("[useDragAndDrop] onDrop: updating tasks", { updateCount: D.length });
    try {
      await a(D), console.log("[useDragAndDrop] onDrop: updates complete, clearing selection");
      try {
        ee();
      } catch {
      }
    } catch (x) {
      console.error("Failed to add tag to one or more tasks:", x), alert(x.message || "Failed to add tags");
    }
    console.log("[useDragAndDrop] onDrop END");
  }
  function F(g, f) {
    g.preventDefault(), g.dataTransfer.dropEffect = "copy", i(f);
  }
  function m(g) {
    g.currentTarget.contains(g.relatedTarget) || i(null);
  }
  async function T(g, f) {
    g.preventDefault(), i(null);
    const b = O(g);
    if (b.length === 0) return;
    console.log("[useDragAndDrop] onFilterDrop", { filterTag: f, ids: b, taskCount: b.length });
    const S = [];
    for (const D of b) {
      const x = t.find((U) => U.id === D);
      if (!x) continue;
      const _ = x.tag?.split(" ").filter(Boolean) || [];
      if (_.includes(f)) {
        console.log(`Task ${D} already has tag: ${f}`);
        continue;
      }
      const P = [..._, f].join(" ");
      S.push({ taskId: D, tag: P });
    }
    if (S.length === 0) {
      console.log("No updates needed - all tasks already have this tag");
      return;
    }
    console.log(`Adding tag "${f}" to ${S.length} task(s) via filter drop`);
    try {
      await a(S);
      try {
        ee();
      } catch {
      }
    } catch (D) {
      console.error("Failed to add tag via filter drop:", D), alert(D.message || "Failed to add tag");
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
    selectionStartHandler: K,
    selectionMoveHandler: q,
    selectionEndHandler: z,
    clearSelection: ee,
    onDragStart: X,
    onDragEnd: V,
    onDragOver: Y,
    onDragLeave: le,
    onDrop: de,
    onFilterDragOver: F,
    onFilterDragLeave: m,
    onFilterDrop: T
  };
}
function ta() {
  const [t, e] = N({});
  function a(i) {
    e((c) => {
      const p = (c[i] || "desc") === "desc" ? "asc" : "desc";
      return { ...c, [i]: p };
    });
  }
  function o(i, c) {
    return [...i].sort((d, p) => {
      const u = new Date(d.createdAt).getTime(), v = new Date(p.createdAt).getTime();
      return c === "asc" ? u - v : v - u;
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
function ct({ onLongPress: t, delay: e = 500 }) {
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
function Ie(t) {
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
function aa({
  board: t,
  isActive: e,
  isDragOver: a,
  onSwitch: o,
  onContextMenu: s,
  onDragOverFilter: n,
  onMoveTasksToBoard: i,
  onClearSelection: c
}) {
  const d = ct({
    onLongPress: (u, v) => s(t.id, u, v)
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
        const v = Ie(u.dataTransfer);
        if (v.length !== 0)
          try {
            await i(t.id, v);
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
function sa({
  tag: t,
  isActive: e,
  isDragOver: a,
  onToggle: o,
  onContextMenu: s,
  onDragOver: n,
  onDragLeave: i,
  onDrop: c
}) {
  const d = ct({
    onLongPress: (p, u) => s(t, p, u)
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
function na(t) {
  const e = /* @__PURE__ */ new Date(), a = new Date(t), o = e.getTime() - a.getTime(), s = Math.floor(o / 1e3), n = Math.floor(s / 60), i = Math.floor(n / 60), c = Math.floor(i / 24);
  return s < 60 ? `${s}s ago` : n < 60 ? `${n}m ago` : i < 24 ? `${i}h ago` : `${c}d ago`;
}
const ne = {
  width: 20,
  height: 20,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round"
}, oa = () => /* @__PURE__ */ k("svg", { ...ne, children: [
  /* @__PURE__ */ r("circle", { cx: "12", cy: "12", r: "5" }),
  /* @__PURE__ */ r("line", { x1: "12", y1: "1", x2: "12", y2: "3" }),
  /* @__PURE__ */ r("line", { x1: "12", y1: "21", x2: "12", y2: "23" }),
  /* @__PURE__ */ r("line", { x1: "4.22", y1: "4.22", x2: "5.64", y2: "5.64" }),
  /* @__PURE__ */ r("line", { x1: "18.36", y1: "18.36", x2: "19.78", y2: "19.78" }),
  /* @__PURE__ */ r("line", { x1: "1", y1: "12", x2: "3", y2: "12" }),
  /* @__PURE__ */ r("line", { x1: "21", y1: "12", x2: "23", y2: "12" }),
  /* @__PURE__ */ r("line", { x1: "4.22", y1: "19.78", x2: "5.64", y2: "18.36" }),
  /* @__PURE__ */ r("line", { x1: "18.36", y1: "5.64", x2: "19.78", y2: "4.22" })
] }), lt = () => /* @__PURE__ */ r("svg", { ...ne, children: /* @__PURE__ */ r("path", { d: "M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" }) }), ze = () => /* @__PURE__ */ k("svg", { ...ne, children: [
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
] }), Ye = () => /* @__PURE__ */ k("svg", { ...ne, children: [
  /* @__PURE__ */ r("path", { d: "M2 12c2-2 4-2 6 0s4 2 6 0 4-2 6 0" }),
  /* @__PURE__ */ r("path", { d: "M2 17c2-2 4-2 6 0s4 2 6 0 4-2 6 0" }),
  /* @__PURE__ */ r("path", { d: "M2 7c2-2 4-2 6 0s4 2 6 0 4-2 6 0" })
] }), Ge = () => /* @__PURE__ */ r("svg", { ...ne, children: /* @__PURE__ */ r("polygon", { points: "13 2 3 14 12 14 11 22 21 10 12 10 13 2" }) }), Ze = () => /* @__PURE__ */ k("svg", { ...ne, children: [
  /* @__PURE__ */ r("path", { d: "M18 8h1a4 4 0 0 1 0 8h-1" }),
  /* @__PURE__ */ r("path", { d: "M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" }),
  /* @__PURE__ */ r("line", { x1: "6", y1: "1", x2: "6", y2: "4" }),
  /* @__PURE__ */ r("line", { x1: "10", y1: "1", x2: "10", y2: "4" }),
  /* @__PURE__ */ r("line", { x1: "14", y1: "1", x2: "14", y2: "4" })
] }), Qe = () => /* @__PURE__ */ k("svg", { ...ne, children: [
  /* @__PURE__ */ r("circle", { cx: "12", cy: "12", r: "2", fill: "currentColor" }),
  /* @__PURE__ */ r("circle", { cx: "12", cy: "6", r: "2.5", fill: "none", stroke: "currentColor", strokeWidth: "2" }),
  /* @__PURE__ */ r("circle", { cx: "18", cy: "10", r: "2.5", fill: "none", stroke: "currentColor", strokeWidth: "2" }),
  /* @__PURE__ */ r("circle", { cx: "16", cy: "16", r: "2.5", fill: "none", stroke: "currentColor", strokeWidth: "2" }),
  /* @__PURE__ */ r("circle", { cx: "8", cy: "16", r: "2.5", fill: "none", stroke: "currentColor", strokeWidth: "2" }),
  /* @__PURE__ */ r("circle", { cx: "6", cy: "10", r: "2.5", fill: "none", stroke: "currentColor", strokeWidth: "2" })
] }), et = () => /* @__PURE__ */ r("svg", { ...ne, children: /* @__PURE__ */ r("path", { d: "M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z", fill: "currentColor" }) }), ra = () => /* @__PURE__ */ k("svg", { ...ne, children: [
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
] }), ia = () => /* @__PURE__ */ k("svg", { ...ne, width: 16, height: 16, viewBox: "0 0 20 20", children: [
  /* @__PURE__ */ r(
    "path",
    {
      d: "M2 4 L12 4 L16 10 L12 16 L2 16 Z",
      fill: "currentColor"
    }
  ),
  /* @__PURE__ */ r("circle", { cx: "6", cy: "10", r: "1.5", fill: "white" })
] });
function Ee({
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
  showDeleteButton: v = !0,
  showTagButton: I = !1
}) {
  const w = a.has(`complete-${t.id}`), A = a.has(`delete-${t.id}`);
  return /* @__PURE__ */ k(
    "li",
    {
      className: `task-app__item ${p ? "selected" : ""}`,
      "data-task-id": t.id,
      draggable: e,
      onDragStart: c ? (M) => c(M, t.id) : void 0,
      onDragEnd: (M) => {
        if (M.currentTarget.classList.remove("dragging"), d)
          try {
            d(M);
          } catch {
          }
      },
      children: [
        /* @__PURE__ */ k("div", { className: "task-app__item-content", children: [
          /* @__PURE__ */ r("div", { className: "task-app__item-title", title: t.title, children: t.title }),
          /* @__PURE__ */ k("div", { className: "task-app__item-meta-row", children: [
            t.tag ? /* @__PURE__ */ r("div", { className: "task-app__item-tag", children: t.tag.split(" ").sort().map((M) => `#${M}`).join(" ") }) : /* @__PURE__ */ r("div", {}),
            /* @__PURE__ */ r("div", { className: "task-app__item-age", children: na(t.createdAt) })
          ] })
        ] }),
        /* @__PURE__ */ k("div", { className: "task-app__item-actions", children: [
          I && /* @__PURE__ */ r(
            "button",
            {
              className: "task-app__action-btn task-app__edit-tag-btn",
              onClick: () => i(t.id),
              title: "Edit tags",
              disabled: w || A,
              children: /* @__PURE__ */ r(ia, {})
            }
          ),
          u && /* @__PURE__ */ r(
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
function tt(t, e = !1) {
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
function ca({
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
  onDragStart: v,
  onDragEnd: I,
  selectedIds: w,
  onSelectionStart: A,
  onSelectionMove: M,
  onSelectionEnd: O,
  onDragOver: X,
  onDragLeave: V,
  onDrop: K,
  toggleSort: q,
  sortTasksByAge: z,
  getSortIcon: ee,
  getSortTitle: Y,
  deleteTag: le,
  onDeletePersistedTag: de,
  showCompleteButton: F = !0,
  showDeleteButton: m = !0,
  showTagButton: T = !1
}) {
  const g = (y, R) => /* @__PURE__ */ k(
    "div",
    {
      className: `task-app__tag-column ${n === y ? "task-app__tag-column--drag-over" : ""}`,
      onDragOver: (L) => X(L, y),
      onDragLeave: V,
      onDrop: (L) => K(L, y),
      children: [
        /* @__PURE__ */ k("div", { className: "task-app__tag-header-row", children: [
          /* @__PURE__ */ k("h3", { className: "task-app__tag-header", children: [
            "#",
            y
          ] }),
          /* @__PURE__ */ r(
            "button",
            {
              className: "task-app__sort-btn task-app__sort-btn--active",
              onClick: () => q(y),
              title: Y(s[y] || "desc"),
              children: ee(s[y] || "desc")
            }
          )
        ] }),
        /* @__PURE__ */ r("ul", { className: "task-app__list task-app__list--column", children: z(R, s[y] || "desc").map((L) => /* @__PURE__ */ r(
          Ee,
          {
            task: L,
            isDraggable: !0,
            pendingOperations: i,
            onComplete: c,
            onDelete: d,
            onAddTag: p,
            onEditTag: u,
            onDragStart: v,
            onDragEnd: I,
            selected: w ? w.has(L.id) : !1,
            showCompleteButton: F,
            showDeleteButton: m,
            showTagButton: T
          },
          L.id
        )) })
      ]
    },
    y
  ), f = (y, R) => {
    let L = qe(t, y);
    return S && (L = L.filter((J) => {
      const oe = J.tag?.split(" ") || [];
      return o.some((ae) => oe.includes(ae));
    })), L.slice(0, R);
  }, b = e.length, S = Array.isArray(o) && o.length > 0, D = t.filter((y) => {
    if (!S) return !0;
    const R = y.tag?.split(" ") || [];
    return o.some((L) => R.includes(L));
  }), x = tt(b, a), _ = S ? e.filter((y) => qe(t, y).some((L) => {
    const J = L.tag?.split(" ") || [];
    return o.some((oe) => J.includes(oe));
  })) : e.slice(0, x.useTags);
  if (_.length === 0)
    return /* @__PURE__ */ r("ul", { className: "task-app__list", children: D.map((y) => /* @__PURE__ */ r(
      Ee,
      {
        task: y,
        pendingOperations: i,
        onComplete: c,
        onDelete: d,
        onAddTag: p,
        onEditTag: u,
        onDragStart: v,
        onDragEnd: I,
        selected: w ? w.has(y.id) : !1,
        showCompleteButton: F,
        showDeleteButton: m,
        showTagButton: T
      },
      y.id
    )) });
  const P = Zt(t, e, o).filter((y) => {
    if (!S) return !0;
    const R = y.tag?.split(" ") || [];
    return o.some((L) => R.includes(L));
  }), U = tt(_.length, a);
  return /* @__PURE__ */ k("div", { className: "task-app__dynamic-layout", children: [
    U.rows.length > 0 && /* @__PURE__ */ r(_t, { children: U.rows.map((y, R) => /* @__PURE__ */ r("div", { className: `task-app__tag-grid task-app__tag-grid--${y.columns}col`, children: y.tagIndices.map((L) => {
      const J = _[L];
      return J ? g(J, f(J, U.maxPerColumn)) : null;
    }) }, R)) }),
    P.length > 0 && /* @__PURE__ */ k(
      "div",
      {
        className: `task-app__remaining ${n === "other" ? "task-app__tag-column--drag-over" : ""}`,
        onDragOver: (y) => {
          y.preventDefault(), y.dataTransfer.dropEffect = "move", X(y, "other");
        },
        onDragLeave: (y) => V(y),
        onDrop: (y) => K(y, "other"),
        children: [
          /* @__PURE__ */ k("div", { className: "task-app__tag-header-row", children: [
            /* @__PURE__ */ r("h3", { className: "task-app__remaining-header", children: "Other Tasks" }),
            /* @__PURE__ */ r(
              "button",
              {
                className: "task-app__sort-btn task-app__sort-btn--active",
                onClick: () => q("other"),
                title: Y(s.other || "desc"),
                children: ee(s.other || "desc")
              }
            )
          ] }),
          /* @__PURE__ */ r("ul", { className: "task-app__list", children: z(P, s.other || "desc").map((y) => /* @__PURE__ */ r(
            Ee,
            {
              task: y,
              pendingOperations: i,
              onComplete: c,
              onDelete: d,
              onAddTag: p,
              onEditTag: u,
              onDragStart: v,
              onDragEnd: I,
              selected: w ? w.has(y.id) : !1,
              showCompleteButton: F,
              showDeleteButton: m,
              showTagButton: T
            },
            y.id
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
  confirmDisabled: u = !1,
  confirmDanger: v = !1
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
                  w.key === "Enter" && !u && (w.preventDefault(), o()), w.key === "Escape" && (w.preventDefault(), a());
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
                  className: `modal-button ${v ? "modal-button--danger" : "modal-button--primary"}`,
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
function at({ isOpen: t, x: e, y: a, items: o, className: s = "board-context-menu" }) {
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
const st = [
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
function la() {
  return st[Math.floor(Math.random() * st.length)];
}
const nt = 768;
function da() {
  const [t, e] = N(() => typeof window > "u" ? !1 : window.innerWidth < nt);
  return Q(() => {
    if (typeof window > "u") return;
    const a = window.matchMedia(`(max-width: ${nt - 1}px)`), o = (s) => {
      e(s.matches);
    };
    return a.addEventListener ? a.addEventListener("change", o) : a.addListener(o), o(a), () => {
      a.removeEventListener ? a.removeEventListener("change", o) : a.removeListener(o);
    };
  }, []), t;
}
const ot = [
  {
    lightIcon: /* @__PURE__ */ r(oa, {}),
    darkIcon: /* @__PURE__ */ r(lt, {}),
    lightTheme: "light",
    darkTheme: "dark",
    lightLabel: "Light",
    darkLabel: "Dark"
  },
  {
    lightIcon: /* @__PURE__ */ r(ze, {}),
    darkIcon: /* @__PURE__ */ r(ze, {}),
    lightTheme: "strawberry-light",
    darkTheme: "strawberry-dark",
    lightLabel: "Strawberry Light",
    darkLabel: "Strawberry Dark"
  },
  {
    lightIcon: /* @__PURE__ */ r(Ye, {}),
    darkIcon: /* @__PURE__ */ r(Ye, {}),
    lightTheme: "ocean-light",
    darkTheme: "ocean-dark",
    lightLabel: "Ocean Light",
    darkLabel: "Ocean Dark"
  },
  {
    lightIcon: /* @__PURE__ */ r(Ge, {}),
    darkIcon: /* @__PURE__ */ r(Ge, {}),
    lightTheme: "cyberpunk-light",
    darkTheme: "cyberpunk-dark",
    lightLabel: "Cyberpunk Light",
    darkLabel: "Cyberpunk Dark"
  },
  {
    lightIcon: /* @__PURE__ */ r(Ze, {}),
    darkIcon: /* @__PURE__ */ r(Ze, {}),
    lightTheme: "coffee-light",
    darkTheme: "coffee-dark",
    lightLabel: "Coffee Light",
    darkLabel: "Coffee Dark"
  },
  {
    lightIcon: /* @__PURE__ */ r(Qe, {}),
    darkIcon: /* @__PURE__ */ r(Qe, {}),
    lightTheme: "lavender-light",
    darkTheme: "lavender-dark",
    lightLabel: "Lavender Light",
    darkLabel: "Lavender Dark"
  }
], ua = [
  {
    lightIcon: /* @__PURE__ */ r(et, {}),
    darkIcon: /* @__PURE__ */ r(et, {}),
    lightTheme: "pink-light",
    darkTheme: "pink-dark",
    lightLabel: "Pink Light",
    darkLabel: "Pink Dark"
  }
];
function dt(t) {
  return t ? [...ot, ...ua] : ot;
}
function ga(t, e) {
  const o = dt(e).find(
    (s) => s.lightTheme === t || s.darkTheme === t
  );
  return o ? t.endsWith("-dark") || t === "dark" ? o.darkIcon : o.lightIcon : /* @__PURE__ */ r(lt, {});
}
const rt = 5;
function pa(t = {}) {
  const { userType: e = "public", userId: a = "public", sessionId: o } = t, s = da(), [n] = N(() => la()), [i, c] = N(/* @__PURE__ */ new Set()), [d, p] = N(null), [u, v] = N(!1), [I, w] = N(!1), [A, M] = N(null), [O, X] = N(""), [V, K] = N(null), [q, z] = N(!1), [ee, Y] = N(!1), [le, de] = N(!1), [F, m] = N({
    version: 1,
    updatedAt: (/* @__PURE__ */ new Date()).toISOString(),
    experimentalThemes: !1,
    alwaysVerticalLayout: !1,
    // Device-specific defaults
    theme: "light",
    showCompleteButton: !0,
    showDeleteButton: !0,
    showTagButton: !1
  }), T = F.theme || "light", g = F.showCompleteButton ?? !0, f = F.showDeleteButton ?? !0, b = F.showTagButton ?? !1, S = (l) => he({ theme: l }), [D, x] = N(""), [_, P] = N(""), [U, y] = N(null), [R, L] = N(!1), [J, oe] = N(null), [ae, Ce] = N(!1), [re, De] = N(null), [ie, Be] = N(null), [ue, me] = N(null), [xe, ve] = N(""), ge = we(null), Ae = we(null), Ne = we(null), Me = s || F.alwaysVerticalLayout || !1, {
    tasks: ce,
    pendingOperations: ut,
    initialLoad: Pe,
    addTask: gt,
    completeTask: pt,
    deleteTask: ht,
    addTagToTask: mt,
    updateTaskTags: Re,
    bulkUpdateTaskTags: Ue,
    deleteTag: Ke,
    // board API
    boards: G,
    currentBoardId: pe,
    createBoard: ft,
    deleteBoard: kt,
    switchBoard: Tt,
    moveTasksToBoard: Je,
    createTagOnBoard: We,
    deleteTagOnBoard: yt
  } = Qt({ userType: e, userId: a, sessionId: o }), B = ea({
    tasks: ce,
    onTaskUpdate: Re,
    onBulkUpdate: Ue
  }), fe = ta(), wt = it(
    () => dt(F.experimentalThemes || !1),
    [F.experimentalThemes]
  );
  Q(() => {
    (async () => {
      console.log("[App] Loading preferences...", { userType: e, userId: a, sessionId: o });
      const C = await ye(e, a, o).getPreferences();
      console.log("[App] Loaded preferences:", C), C && (m(C), console.log("[App] Applied preferences to state"));
    })();
  }, [e, a, o]);
  const he = async (l) => {
    const h = { ...F, ...l, updatedAt: (/* @__PURE__ */ new Date()).toISOString() };
    m(h), await ye(e, a, o).savePreferences(h);
  }, He = async () => {
    if (!(!D.trim() || R)) {
      L(!0), oe(null);
      try {
        const h = await ye(e, a, o).setUserId(D.trim());
        h.ok ? (sessionStorage.setItem("displayUserId", D.trim()), oe(null), Y(!1), x("")) : oe(h.message || "Failed to update user ID");
      } catch {
        oe("Failed to update user ID");
      } finally {
        L(!1);
      }
    }
  }, je = async () => {
    if (!(!_.trim() || ae)) {
      Ce(!0), y(null);
      try {
        if (await ye(e, a, o).validateKey(_.trim())) {
          const C = new URL(window.location.href);
          C.searchParams.set("key", _.trim()), window.location.href = C.toString();
        } else
          y("Invalid key"), Ce(!1);
      } catch {
        y("Failed to validate key"), Ce(!1);
      }
    }
  };
  Q(() => {
    (() => {
      try {
        const h = sessionStorage.getItem("theme"), C = sessionStorage.getItem("showCompleteButton"), E = sessionStorage.getItem("showDeleteButton"), W = sessionStorage.getItem("showTagButton"), $ = {};
        if (h && !F.theme && ($.theme = h), C !== null && F.showCompleteButton === void 0 && ($.showCompleteButton = C === "true"), E !== null && F.showDeleteButton === void 0 && ($.showDeleteButton = E === "true"), W !== null && F.showTagButton === void 0 && ($.showTagButton = W === "true"), Object.keys($).length > 0) {
          console.log("[App] Migrating settings from sessionStorage to localStorage:", $);
          const Z = { ...F, ...$, updatedAt: (/* @__PURE__ */ new Date()).toISOString() };
          m(Z), sessionStorage.removeItem("theme"), sessionStorage.removeItem("showCompleteButton"), sessionStorage.removeItem("showDeleteButton"), sessionStorage.removeItem("showTagButton");
        }
      } catch (h) {
        console.warn("[App] Failed to migrate settings:", h);
      }
    })();
  }, [F.theme, F.showCompleteButton, F.showDeleteButton, F.showTagButton]), Q(() => {
    if (!q) return;
    const l = (h) => {
      Ne.current && !Ne.current.contains(h.target) && z(!1);
    };
    return document.addEventListener("mousedown", l), () => document.removeEventListener("mousedown", l);
  }, [q]), Q(() => {
    const l = window.matchMedia("(prefers-color-scheme: dark)"), h = (C) => {
      const E = C.matches, W = T.replace(/-light$|-dark$/, ""), $ = T.endsWith("-dark") ? "dark" : T.endsWith("-light") ? "light" : null;
      if ($ && W !== "light" && W !== "dark") {
        const Z = E ? "dark" : "light";
        if ($ !== Z) {
          const be = `${W}-${Z}`;
          console.log(`[Theme] Auto-switching from ${T} to ${be} (Dark Reader/system preference)`), S(be);
        }
      }
    };
    return l.addEventListener ? l.addEventListener("change", h) : l.addListener(h), () => {
      l.removeEventListener ? l.removeEventListener("change", h) : l.removeListener(h);
    };
  }, [T]), Q(() => {
    c(/* @__PURE__ */ new Set());
  }, [pe]), Q(() => {
    console.log("[App] User context changed, initializing...", { userType: e, userId: a }), Pe(), ge.current?.focus();
  }, [e, a]), Q(() => {
    Ae.current && Ae.current.setAttribute("data-theme", T);
  }, [T]), Q(() => {
    if (!q && !re && !ie) return;
    const l = (h) => {
      const C = h.target;
      C.closest(".theme-picker") || z(!1), C.closest(".board-context-menu") || De(null), C.closest(".tag-context-menu") || Be(null);
    };
    return document.addEventListener("mousedown", l), () => document.removeEventListener("mousedown", l);
  }, [q, re, ie]);
  async function vt(l) {
    await gt(l) && ge.current && (ge.current.value = "", ge.current.focus());
  }
  function bt(l) {
    const h = ce.filter((C) => C.tag?.split(" ").includes(l));
    p({ tag: l, count: h.length });
  }
  async function St(l) {
    const h = l.trim().replace(/\s+/g, "-");
    try {
      if (await We(h), A?.type === "apply-tag" && A.taskIds.length > 0) {
        const C = A.taskIds.map((E) => {
          const $ = ce.find((be) => be.id === E)?.tag?.split(" ").filter(Boolean) || [], Z = [.../* @__PURE__ */ new Set([...$, h])];
          return { taskId: E, tag: Z.join(" ") };
        });
        await Ue(C), B.clearSelection();
      }
      M(null);
    } catch (C) {
      throw console.error("[App] Failed to create tag:", C), C;
    }
  }
  function Ct(l) {
    const h = ce.find((C) => C.id === l);
    h && (me({ taskId: l, currentTag: h.tag || null }), ve(""));
  }
  async function Xe() {
    if (!ue) return;
    const { taskId: l, currentTag: h } = ue, C = h?.split(" ").filter(Boolean) || [], E = xe.trim() ? xe.trim().replace(/\s+/g, "-").split("#").filter(Boolean).map((Z) => Z.trim()) : [];
    for (const Z of E)
      await We(Z);
    const $ = [.../* @__PURE__ */ new Set([...C, ...E])].sort().join(" ");
    await Re(l, { tag: $ }), me(null), ve("");
  }
  function Dt(l) {
    if (!ue) return;
    const { taskId: h, currentTag: C } = ue, E = C?.split(" ").filter(Boolean) || [];
    if (E.includes(l)) {
      const $ = E.filter((Z) => Z !== l).sort().join(" ");
      me({ taskId: h, currentTag: $ });
    } else {
      const $ = [...E, l].sort().join(" ");
      me({ taskId: h, currentTag: $ });
    }
  }
  function _e(l) {
    const h = l.trim();
    return h ? (G?.boards?.map((E) => E.id.toLowerCase()) || []).includes(h.toLowerCase()) ? `Board "${h}" already exists` : null : "Board name cannot be empty";
  }
  async function Bt(l) {
    const h = l.trim(), C = _e(h);
    if (C) {
      K(C);
      return;
    }
    try {
      await ft(h), A?.type === "move-to-board" && A.taskIds.length > 0 && (await Je(h, A.taskIds), B.clearSelection()), M(null), K(null);
    } catch (E) {
      console.error("[App] Failed to create board:", E), K(E.message || "Failed to create board");
    }
  }
  const xt = G?.boards?.find((l) => l.id === pe)?.tags || [], At = Gt(ce, Me ? 3 : 6), Nt = T.endsWith("-dark") || T === "dark";
  return /* @__PURE__ */ r(
    "div",
    {
      ref: Ae,
      className: "task-app-container",
      "data-dark-theme": Nt ? "true" : "false",
      onMouseDown: B.selectionStartHandler,
      onMouseMove: B.selectionMoveHandler,
      onMouseUp: B.selectionEndHandler,
      onMouseLeave: B.selectionEndHandler,
      onClick: (l) => {
        try {
          const h = l.target;
          if (!h.closest || !h.closest(".task-app__item")) {
            if (B.selectionJustEndedAt && Date.now() - B.selectionJustEndedAt < 300)
              return;
            B.clearSelection();
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
              onClick: () => Y(!0),
              style: { cursor: "pointer" },
              title: "Settings",
              children: [
                "Tasks",
                e !== "public" ? ` - ${a || "user"}` : ""
              ]
            }
          ),
          /* @__PURE__ */ k("div", { className: "theme-picker", ref: Ne, children: [
            /* @__PURE__ */ r(
              "button",
              {
                className: "theme-toggle-btn",
                onClick: () => z(!q),
                "aria-label": "Choose theme",
                title: "Choose theme",
                children: ga(T, F.experimentalThemes || !1)
              }
            ),
            q && /* @__PURE__ */ k("div", { className: "theme-picker__dropdown", children: [
              /* @__PURE__ */ r("div", { className: "theme-picker__pills", children: wt.map((l, h) => /* @__PURE__ */ k("div", { className: "theme-pill", children: [
                /* @__PURE__ */ r(
                  "button",
                  {
                    className: `theme-pill__btn theme-pill__btn--light ${T === l.lightTheme ? "active" : ""}`,
                    onClick: () => S(l.lightTheme),
                    title: l.lightLabel,
                    "aria-label": l.lightLabel,
                    children: /* @__PURE__ */ r("div", { className: "theme-pill__icon", children: l.lightIcon })
                  }
                ),
                /* @__PURE__ */ r(
                  "button",
                  {
                    className: `theme-pill__btn theme-pill__btn--dark ${T === l.darkTheme ? "active" : ""}`,
                    onClick: () => S(l.darkTheme),
                    title: l.darkLabel,
                    "aria-label": l.darkLabel,
                    children: /* @__PURE__ */ r("div", { className: "theme-pill__icon", children: l.darkIcon })
                  }
                )
              ] }, h)) }),
              /* @__PURE__ */ r(
                "button",
                {
                  className: "theme-picker__settings-icon",
                  onClick: () => {
                    Y(!0), z(!1);
                  },
                  "aria-label": "Settings",
                  title: "Settings",
                  children: /* @__PURE__ */ r(ra, {})
                }
              )
            ] })
          ] })
        ] }),
        /* @__PURE__ */ k("div", { className: "task-app__boards", children: [
          /* @__PURE__ */ r("div", { className: "task-app__board-list", children: (G && G.boards ? G.boards.slice(0, rt) : [{ id: "main", name: "main", tasks: [], tags: [] }]).map((l) => /* @__PURE__ */ r(
            aa,
            {
              board: l,
              isActive: pe === l.id,
              isDragOver: B.dragOverFilter === `board:${l.id}`,
              onSwitch: Tt,
              onContextMenu: (h, C, E) => De({ boardId: h, x: C, y: E }),
              onDragOverFilter: B.setDragOverFilter,
              onMoveTasksToBoard: Je,
              onClearSelection: B.clearSelection
            },
            l.id
          )) }),
          /* @__PURE__ */ k("div", { className: "task-app__board-actions", children: [
            (!G || G.boards && G.boards.length < rt) && /* @__PURE__ */ r(
              "button",
              {
                className: `board-add-btn ${B.dragOverFilter === "add-board" ? "board-btn--drag-over" : ""}`,
                onClick: () => {
                  X(""), K(null), v(!0);
                },
                onDragOver: (l) => {
                  l.preventDefault(), l.dataTransfer.dropEffect = "move", B.setDragOverFilter("add-board");
                },
                onDragLeave: (l) => {
                  B.setDragOverFilter(null);
                },
                onDrop: async (l) => {
                  l.preventDefault(), B.setDragOverFilter(null);
                  const h = Ie(l.dataTransfer);
                  h.length > 0 && (X(""), M({ type: "move-to-board", taskIds: h }), v(!0));
                },
                "aria-label": "Create board",
                children: "＋"
              }
            ),
            e !== "public" && /* @__PURE__ */ r(
              "button",
              {
                className: `sync-btn ${le ? "spinning" : ""}`,
                onClick: async (l) => {
                  if (le) return;
                  console.log("[App] Manual refresh triggered"), de(!0);
                  const h = l.currentTarget, C = new Promise((E, W) => {
                    setTimeout(() => W(new Error("Sync timeout")), 5e3);
                  });
                  try {
                    await Promise.race([Pe(), C]), console.log("[App] Sync completed successfully");
                  } catch (E) {
                    console.error("[App] Sync failed:", E);
                  } finally {
                    de(!1), h && h.blur();
                  }
                },
                disabled: le,
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
              l.key === "Enter" && !l.shiftKey && (l.preventDefault(), vt(l.target.value)), l.key === "k" && (l.ctrlKey || l.metaKey) && (l.preventDefault(), ge.current?.focus());
            }
          }
        ) }),
        /* @__PURE__ */ k("div", { className: "task-app__filters", children: [
          (() => {
            const l = Le(ce);
            return Array.from(/* @__PURE__ */ new Set([...xt, ...l])).map((C) => /* @__PURE__ */ r(
              sa,
              {
                tag: C,
                isActive: i.has(C),
                isDragOver: B.dragOverFilter === C,
                onToggle: (E) => {
                  c((W) => {
                    const $ = new Set(W);
                    return $.has(E) ? $.delete(E) : $.add(E), $;
                  });
                },
                onContextMenu: (E, W, $) => Be({ tag: E, x: W, y: $ }),
                onDragOver: B.onFilterDragOver,
                onDragLeave: B.onFilterDragLeave,
                onDrop: B.onFilterDrop
              },
              C
            ));
          })(),
          /* @__PURE__ */ r(
            "button",
            {
              className: `task-app__filter-add ${B.dragOverFilter === "add-tag" ? "task-app__filter-drag-over" : ""}`,
              onClick: () => {
                X(""), w(!0);
              },
              onDragOver: (l) => {
                l.preventDefault(), l.dataTransfer.dropEffect = "copy", B.onFilterDragOver(l, "add-tag");
              },
              onDragLeave: B.onFilterDragLeave,
              onDrop: async (l) => {
                l.preventDefault(), B.onFilterDragLeave(l);
                const h = Ie(l.dataTransfer);
                h.length > 0 && (X(""), M({ type: "apply-tag", taskIds: h }), w(!0));
              },
              "aria-label": "Add tag",
              children: "＋"
            }
          )
        ] }),
        /* @__PURE__ */ r(
          ca,
          {
            tasks: ce,
            topTags: At,
            isMobile: Me,
            filters: Array.from(i),
            selectedIds: B.selectedIds,
            onSelectionStart: B.selectionStartHandler,
            onSelectionMove: B.selectionMoveHandler,
            onSelectionEnd: B.selectionEndHandler,
            sortDirections: fe.sortDirections,
            dragOverTag: B.dragOverTag,
            pendingOperations: ut,
            onComplete: pt,
            onDelete: ht,
            onAddTag: mt,
            onEditTag: Ct,
            onDragStart: B.onDragStart,
            onDragEnd: B.onDragEnd,
            onDragOver: B.onDragOver,
            onDragLeave: B.onDragLeave,
            onDrop: B.onDrop,
            toggleSort: fe.toggleSort,
            sortTasksByAge: fe.sortTasksByAge,
            getSortIcon: fe.getSortIcon,
            getSortTitle: fe.getSortTitle,
            deleteTag: bt,
            onDeletePersistedTag: yt,
            showCompleteButton: g,
            showDeleteButton: f,
            showTagButton: b
          }
        ),
        B.isSelecting && B.marqueeRect && /* @__PURE__ */ r(
          "div",
          {
            className: "marquee-overlay",
            style: {
              left: `${B.marqueeRect.x}px`,
              top: `${B.marqueeRect.y}px`,
              width: `${B.marqueeRect.w}px`,
              height: `${B.marqueeRect.h}px`
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
              p(null), await Ke(l);
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
            isOpen: u,
            title: "Create New Board",
            onClose: () => {
              v(!1), M(null), K(null);
            },
            onConfirm: async () => {
              if (!O.trim()) return;
              const l = _e(O);
              if (l) {
                K(l);
                return;
              }
              v(!1), await Bt(O);
            },
            inputValue: O,
            onInputChange: (l) => {
              X(l), K(null);
            },
            inputPlaceholder: "Board name",
            confirmLabel: "Create",
            confirmDisabled: !O.trim() || _e(O) !== null,
            children: [
              A?.type === "move-to-board" && A.taskIds.length > 0 && /* @__PURE__ */ k("p", { className: "modal-hint", children: [
                A.taskIds.length,
                " task",
                A.taskIds.length > 1 ? "s" : "",
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
              w(!1), M(null);
            },
            onConfirm: async () => {
              if (O.trim()) {
                w(!1);
                try {
                  await St(O);
                } catch (l) {
                  console.error("[App] Failed to create tag:", l);
                }
              }
            },
            inputValue: O,
            onInputChange: X,
            inputPlaceholder: "Enter new tag name",
            confirmLabel: "Create",
            confirmDisabled: !O.trim(),
            children: [
              A?.type === "apply-tag" && A.taskIds.length > 0 && /* @__PURE__ */ k("p", { className: "modal-hint", children: [
                "This tag will be applied to ",
                A.taskIds.length,
                " task",
                A.taskIds.length > 1 ? "s" : ""
              ] }),
              Le(ce).length > 0 && /* @__PURE__ */ k("div", { className: "modal-section", children: [
                /* @__PURE__ */ r("label", { className: "modal-label", children: "Existing tags:" }),
                /* @__PURE__ */ r("div", { className: "modal-tags-list", children: Le(ce).map((l) => /* @__PURE__ */ k("span", { className: "modal-tag-chip", children: [
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
            isOpen: ee,
            title: "Settings",
            onClose: () => Y(!1),
            onConfirm: () => Y(!1),
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
                        value: D || a,
                        onChange: (l) => x(l.target.value),
                        onKeyDown: (l) => {
                          l.key === "Enter" && D && D !== a && e !== "public" && !R && He();
                        },
                        placeholder: e === "public" ? "public" : a,
                        disabled: e === "public" || R
                      }
                    ),
                    D && D !== a && e !== "public" && /* @__PURE__ */ r(
                      "button",
                      {
                        className: "settings-field-button",
                        onClick: He,
                        disabled: R,
                        children: R ? /* @__PURE__ */ r("span", { className: "spinner" }) : "↵"
                      }
                    )
                  ] }),
                  J && /* @__PURE__ */ r("div", { className: "settings-error-message", children: J })
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
                        value: _,
                        onChange: (l) => {
                          P(l.target.value), y(null);
                        },
                        onKeyDown: (l) => {
                          l.key === "Enter" && _ && !ae && je();
                        },
                        placeholder: "Enter authentication key",
                        disabled: ae
                      }
                    ),
                    _ && /* @__PURE__ */ r(
                      "button",
                      {
                        className: "settings-field-button",
                        onClick: je,
                        disabled: ae,
                        children: ae ? /* @__PURE__ */ r("span", { className: "spinner" }) : "↵"
                      }
                    )
                  ] }),
                  U && /* @__PURE__ */ r("span", { className: "settings-error", children: U })
                ] })
              ] }),
              /* @__PURE__ */ k("div", { className: "settings-section", children: [
                /* @__PURE__ */ r("h4", { className: "settings-section-title", children: "Preferences" }),
                /* @__PURE__ */ k("label", { className: "settings-option", children: [
                  /* @__PURE__ */ r(
                    "input",
                    {
                      type: "checkbox",
                      checked: F.experimentalThemes || !1,
                      onChange: (l) => {
                        he({ experimentalThemes: l.target.checked });
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
                      checked: F.alwaysVerticalLayout || !1,
                      onChange: (l) => {
                        he({ alwaysVerticalLayout: l.target.checked });
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
                      checked: !g,
                      onChange: (l) => {
                        he({ showCompleteButton: !l.target.checked });
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
                      checked: !f,
                      onChange: (l) => {
                        he({ showDeleteButton: !l.target.checked });
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
                      checked: b,
                      onChange: (l) => {
                        he({ showTagButton: l.target.checked });
                      }
                    }
                  ),
                  /* @__PURE__ */ k("span", { className: "settings-label", children: [
                    /* @__PURE__ */ r("strong", { children: "Enable Tag Button" }),
                    /* @__PURE__ */ r("span", { className: "settings-description", children: "Show tag button on task items" })
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
              me(null), ve("");
            },
            onConfirm: Xe,
            confirmLabel: "Save",
            cancelLabel: "Cancel",
            children: /* @__PURE__ */ k("div", { className: "edit-tag-modal", children: [
              G?.boards?.find((l) => l.id === pe)?.tags && G.boards.find((l) => l.id === pe).tags.length > 0 && /* @__PURE__ */ k("div", { className: "edit-tag-pills", children: [
                /* @__PURE__ */ r("label", { className: "edit-tag-label", children: "Select Tags" }),
                /* @__PURE__ */ r("div", { className: "edit-tag-pills-container", children: [...G.boards.find((l) => l.id === pe).tags].sort().map((l) => {
                  const C = (ue?.currentTag?.split(" ").filter(Boolean) || []).includes(l);
                  return /* @__PURE__ */ k(
                    "button",
                    {
                      className: `edit-tag-pill ${C ? "active" : ""}`,
                      onClick: () => Dt(l),
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
                    value: xe,
                    onChange: (l) => {
                      ve(l.target.value);
                    },
                    onKeyDown: (l) => {
                      l.key === "Enter" && (l.preventDefault(), Xe());
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
          at,
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
                  const l = G?.boards?.find((h) => h.id === re.boardId)?.name || re.boardId;
                  if (confirm(`Delete board "${l}"? All tasks on this board will be permanently deleted.`))
                    try {
                      await kt(re.boardId), De(null);
                    } catch (h) {
                      console.error("[App] Failed to delete board:", h), alert(h.message || "Failed to delete board");
                    }
                }
              }
            ]
          }
        ),
        /* @__PURE__ */ r(
          at,
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
                    console.log("[App] Calling deleteTag for tag:", ie.tag), await Ke(ie.tag), console.log("[App] deleteTag completed successfully"), Be(null);
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
function Ta(t, e = {}) {
  const a = new URLSearchParams(window.location.search), o = e.userType || a.get("userType") || "admin", s = e.userId || "test-admin", n = e.sessionId, i = { ...e, userType: o, userId: s, sessionId: n }, c = Lt(t);
  c.render(/* @__PURE__ */ r(pa, { ...i })), t.__root = c, console.log("[task-app] Mounted successfully", i);
}
function ya(t) {
  t.__root?.unmount();
}
export {
  Ta as mount,
  ya as unmount
};
