import { jsxs as k, jsx as l, Fragment as Ge } from "react/jsx-runtime";
import { createRoot as Ze } from "react-dom/client";
import { useState as E, useMemo as _e, useEffect as G, useRef as re } from "react";
const H = `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
class Qe {
  constructor(a = "public", e = "public") {
    this.userType = a, this.userId = e;
  }
  // --- Storage Keys ---
  // Note: Always use the userType from constructor, not the one passed to methods
  // This ensures data stays in the same localStorage location regardless of authContext
  getTasksKey(a, e, o) {
    return `${this.userType}-${e || this.userId}-${o || "main"}-tasks`;
  }
  getStatsKey(a, e, o) {
    return `${this.userType}-${e || this.userId}-${o || "main"}-stats`;
  }
  getBoardsKey(a, e) {
    return `${this.userType}-${e || this.userId}-boards`;
  }
  // --- Tasks Operations ---
  async getTasks(a, e, o) {
    const n = this.getTasksKey(a, e, o), s = localStorage.getItem(n);
    return s ? JSON.parse(s) : {
      version: 1,
      updatedAt: (/* @__PURE__ */ new Date()).toISOString(),
      tasks: []
    };
  }
  async saveTasks(a, e, o, n) {
    const s = this.getTasksKey(a, e, o);
    n.updatedAt = (/* @__PURE__ */ new Date()).toISOString(), localStorage.setItem(s, JSON.stringify(n));
  }
  // --- Stats Operations ---
  async getStats(a, e, o) {
    const n = this.getStatsKey(a, e, o), s = localStorage.getItem(n);
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
  async saveStats(a, e, o, n) {
    const s = this.getStatsKey(a, e, o);
    n.updatedAt = (/* @__PURE__ */ new Date()).toISOString(), localStorage.setItem(s, JSON.stringify(n));
  }
  // --- Boards Operations ---
  async getBoards(a, e) {
    const o = this.getBoardsKey(a, e), n = localStorage.getItem(o);
    if (n)
      return JSON.parse(n);
    const s = {
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
    return await this.saveBoards(a, s, e), s;
  }
  async saveBoards(a, e, o) {
    const n = this.getBoardsKey(a, o);
    e.updatedAt = (/* @__PURE__ */ new Date()).toISOString(), localStorage.setItem(n, JSON.stringify(e));
  }
  // --- Cleanup Operations ---
  async deleteBoardData(a, e, o) {
    const n = this.getTasksKey(a, e, o), s = this.getStatsKey(a, e, o);
    localStorage.removeItem(n), localStorage.removeItem(s);
  }
}
function et() {
  const t = Date.now().toString(36).toUpperCase().padStart(8, "0"), a = crypto.getRandomValues(new Uint8Array(18)), e = Array.from(a).map((o) => (o % 36).toString(36).toUpperCase()).join("");
  return t + e;
}
function Oe(t, a) {
  const e = t.tasks.findIndex((o) => o.id === a);
  if (e < 0)
    throw new Error("Task not found");
  return { task: t.tasks[e], index: e };
}
function ue(t, a) {
  const e = t.boards.findIndex((o) => o.id === a);
  if (e < 0)
    throw new Error(`Board ${a} not found`);
  return { board: t.boards[e], index: e };
}
function pe(t, a, e, o) {
  return {
    ...t,
    updatedAt: o,
    boards: [
      ...t.boards.slice(0, a),
      e,
      ...t.boards.slice(a + 1)
    ]
  };
}
function tt(t, a, e, o) {
  return {
    ...t,
    updatedAt: o,
    counters: {
      ...t.counters,
      [e]: t.counters[e] + 1
    },
    timeline: [
      ...t.timeline,
      { t: o, event: e, id: a.id }
    ],
    tasks: {
      ...t.tasks,
      [a.id]: { ...a }
    }
  };
}
function Le(t, a, e, o) {
  const { task: n, index: s } = Oe(t, a), r = {
    ...n,
    state: e,
    closedAt: o,
    updatedAt: o
  }, i = [...t.tasks];
  return i.splice(s, 1), {
    updatedTasks: {
      ...t,
      tasks: i,
      updatedAt: o
    },
    closedTask: r
  };
}
async function se(t, a, e, o) {
  const n = (/* @__PURE__ */ new Date()).toISOString(), [s, r] = await Promise.all([
    t.getTasks(a.userType, a.userId, e),
    t.getStats(a.userType, a.userId, e)
  ]), { updatedTasks: i, statsEvents: c, result: u } = o(s, r, n);
  let d = r;
  for (const { task: h, eventType: y } of c)
    d = tt(d, h, y, n);
  return await Promise.all([
    t.saveTasks(a.userType, a.userId, e, i),
    t.saveStats(a.userType, a.userId, e, d)
  ]), u;
}
async function ie(t, a, e) {
  const o = (/* @__PURE__ */ new Date()).toISOString(), n = await t.getBoards(a.userType, a.userId), { updatedBoards: s, result: r } = e(n, o);
  return await t.saveBoards(a.userType, s, a.userId), r;
}
async function at(t, a) {
  const e = await t.getBoards(a.userType, a.userId), o = await Promise.all(
    e.boards.map(async (n) => {
      const s = await t.getTasks(a.userType, a.userId, n.id), r = await t.getStats(a.userType, a.userId, n.id);
      return {
        ...n,
        tasks: s.tasks,
        stats: r
      };
    })
  );
  return {
    ...e,
    boards: o
  };
}
async function nt(t, a, e, o = "main") {
  return se(t, a, o, (n, s, r) => {
    const i = e.id || et(), c = e.createdAt || r, u = {
      id: i,
      title: e.title,
      tag: e.tag ?? null,
      state: "Active",
      createdAt: c
    };
    return {
      updatedTasks: {
        ...n,
        tasks: [u, ...n.tasks],
        updatedAt: r
      },
      statsEvents: [{ task: u, eventType: "created" }],
      result: { ok: !0, id: i }
    };
  });
}
async function st(t, a, e, o, n = "main") {
  return se(t, a, n, (s, r, i) => {
    const { task: c, index: u } = Oe(s, e), d = {
      ...c,
      ...o,
      updatedAt: i
    }, h = [...s.tasks];
    return h[u] = d, {
      updatedTasks: {
        ...s,
        tasks: h,
        updatedAt: i
      },
      statsEvents: [{ task: d, eventType: "edited" }],
      result: { ok: !0, message: `Task ${e} updated` }
    };
  });
}
async function ot(t, a, e, o = "main") {
  return se(t, a, o, (n, s, r) => {
    const { updatedTasks: i, closedTask: c } = Le(n, e, "Completed", r);
    return {
      updatedTasks: i,
      statsEvents: [{ task: c, eventType: "completed" }],
      result: { ok: !0, message: `Task ${e} completed` }
    };
  });
}
async function rt(t, a, e, o = "main") {
  return se(t, a, o, (n, s, r) => {
    const { updatedTasks: i, closedTask: c } = Le(n, e, "Deleted", r);
    return {
      updatedTasks: i,
      statsEvents: [{ task: c, eventType: "deleted" }],
      result: { ok: !0, message: `Task ${e} deleted` }
    };
  });
}
async function it(t, a, e) {
  return ie(t, a, (o, n) => {
    if (o.boards.find((i) => i.id === e.id))
      throw new Error(`Board ${e.id} already exists`);
    const s = {
      id: e.id,
      name: e.name,
      tasks: [],
      tags: []
    };
    return {
      updatedBoards: {
        ...o,
        updatedAt: n,
        boards: [...o.boards, s]
      },
      result: { ok: !0, board: s }
    };
  });
}
async function lt(t, a, e) {
  if (e === "main")
    throw new Error("Cannot delete the main board");
  return ie(t, a, (o, n) => (ue(o, e), {
    updatedBoards: {
      ...o,
      updatedAt: n,
      boards: o.boards.filter((r) => r.id !== e)
    },
    result: { ok: !0, message: `Board ${e} deleted` }
  }));
}
async function ct(t, a, e) {
  return ie(t, a, (o, n) => {
    const { board: s, index: r } = ue(o, e.boardId), i = s.tags || [];
    if (i.includes(e.tag))
      return {
        updatedBoards: o,
        // No changes needed
        result: { ok: !0, message: `Tag ${e.tag} already exists` }
      };
    const c = {
      ...s,
      tags: [...i, e.tag]
    };
    return {
      updatedBoards: pe(o, r, c, n),
      result: { ok: !0, message: `Tag ${e.tag} added to board ${e.boardId}` }
    };
  });
}
async function dt(t, a, e) {
  return ie(t, a, (o, n) => {
    const { board: s, index: r } = ue(o, e.boardId), i = s.tags || [], c = {
      ...s,
      tags: i.filter((u) => u !== e.tag)
    };
    return {
      updatedBoards: pe(o, r, c, n),
      result: { ok: !0, message: `Tag ${e.tag} removed from board ${e.boardId}` }
    };
  });
}
async function ut(t, a, e) {
  return se(t, a, e.boardId, (o, n, s) => {
    let r = 0;
    const i = o.tasks.map((d) => {
      const h = e.updates.find((y) => y.taskId === d.id);
      return h ? (r++, {
        ...d,
        tag: h.tag || void 0,
        updatedAt: s
      }) : d;
    }), c = {
      ...o,
      tasks: i,
      updatedAt: s
    }, u = i.filter((d) => e.updates.find((h) => h.taskId === d.id)).map((d) => ({ task: d, eventType: "edited" }));
    return {
      updatedTasks: c,
      statsEvents: u,
      result: {
        ok: !0,
        message: `Updated ${r} task(s) on board ${e.boardId}`,
        updated: r
      }
    };
  });
}
async function gt(t, a, e) {
  const o = await se(t, a, e.boardId, (n, s, r) => {
    let i = 0;
    const c = n.tasks.map((h) => {
      if (e.taskIds.includes(h.id) && h.tag) {
        const T = h.tag.split(" ").filter(Boolean).filter((b) => b !== e.tag);
        return i++, {
          ...h,
          tag: T.length > 0 ? T.join(" ") : void 0,
          updatedAt: r
        };
      }
      return h;
    }), u = {
      ...n,
      tasks: c,
      updatedAt: r
    }, d = c.filter((h) => e.taskIds.includes(h.id)).map((h) => ({ task: h, eventType: "edited" }));
    return {
      updatedTasks: u,
      statsEvents: d,
      result: { clearedCount: i }
    };
  });
  return await ie(t, a, (n, s) => {
    const { board: r, index: i } = ue(n, e.boardId), c = r.tags || [], u = {
      ...r,
      tags: c.filter((d) => d !== e.tag)
    };
    return {
      updatedBoards: pe(n, i, u, s),
      result: { ok: !0 }
    };
  }), {
    ok: !0,
    message: `Cleared tag ${e.tag} from ${o.clearedCount} task(s) on board ${e.boardId}`,
    cleared: o.clearedCount
  };
}
function z(t, a, e = 50) {
  setTimeout(() => {
    try {
      const o = new BroadcastChannel("tasks");
      o.postMessage({ type: t, ...a }), o.close();
    } catch (o) {
      console.error("[localStorageApi] Broadcast failed:", o);
    }
  }, e);
}
function ht(t = "public", a = "public") {
  const e = new Qe(t, a), o = { userType: "registered", userId: a };
  return {
    async getBoards() {
      const n = await at(e, o), s = {
        version: n.version,
        updatedAt: n.updatedAt,
        boards: []
      };
      for (const r of n.boards) {
        const i = await e.getTasks(t, a, r.id), c = await e.getStats(t, a, r.id);
        s.boards.push({
          id: r.id,
          name: r.name,
          tasks: i.tasks,
          stats: c,
          tags: r.tags || []
        });
      }
      return s;
    },
    async createBoard(n) {
      console.debug("[localStorageApi] createBoard (using handler)", { userType: t, userId: a, boardId: n });
      const s = await it(
        e,
        o,
        { id: n, name: n }
      );
      return await e.saveTasks(t, a, n, {
        version: 1,
        updatedAt: (/* @__PURE__ */ new Date()).toISOString(),
        tasks: []
      }), await e.saveStats(t, a, n, {
        version: 2,
        updatedAt: (/* @__PURE__ */ new Date()).toISOString(),
        counters: { created: 0, completed: 0, edited: 0, deleted: 0 },
        timeline: [],
        tasks: {}
      }), z("boards-updated", { sessionId: H, userType: t, userId: a }), s.board;
    },
    async deleteBoard(n) {
      await lt(
        e,
        o,
        n
      ), await e.deleteBoardData(t, a, n), z("boards-updated", { sessionId: H, userType: t, userId: a });
    },
    async getTasks(n = "main") {
      return e.getTasks(t, a, n);
    },
    async getStats(n = "main") {
      return e.getStats(t, a, n);
    },
    async createTask(n, s = "main", r = !1) {
      console.log("[localStorageApi] createTask (using handler)", { data: n, boardId: s, suppressBroadcast: r });
      const i = await nt(
        e,
        o,
        n,
        s
      ), u = (await e.getTasks(t, a, s)).tasks.find((d) => d.id === i.id);
      if (!u)
        throw new Error("Task creation failed - task not found after creation");
      return r ? console.log("[localStorageApi] createTask: broadcast suppressed") : (console.log("[localStorageApi] createTask: broadcasting", {
        sessionId: H,
        boardId: s,
        taskId: i.id
      }), z("tasks-updated", { sessionId: H, userType: t, userId: a, boardId: s })), u;
    },
    async patchTask(n, s, r = "main", i = !1) {
      const c = {};
      s.title !== void 0 && (c.title = s.title), s.tag !== void 0 && s.tag !== null && (c.tag = s.tag), await st(
        e,
        o,
        n,
        c,
        r
      ), i || z("tasks-updated", { sessionId: H, userType: t, userId: a, boardId: r });
      const d = (await e.getTasks(t, a, r)).tasks.find((h) => h.id === n);
      if (!d)
        throw new Error("Task not found after update");
      return d;
    },
    async completeTask(n, s = "main") {
      const i = (await e.getTasks(t, a, s)).tasks.find((c) => c.id === n);
      if (!i)
        throw new Error("Task not found");
      return await ot(
        e,
        o,
        n,
        s
      ), z("tasks-updated", { sessionId: H, userType: t, userId: a, boardId: s }), {
        ...i,
        state: "Completed",
        closedAt: (/* @__PURE__ */ new Date()).toISOString(),
        updatedAt: (/* @__PURE__ */ new Date()).toISOString()
      };
    },
    async deleteTask(n, s = "main", r = !1) {
      console.log("[localStorageApi] deleteTask (using handler)", { id: n, boardId: s, suppressBroadcast: r });
      const c = (await e.getTasks(t, a, s)).tasks.find((u) => u.id === n);
      if (!c)
        throw new Error("Task not found");
      return await rt(
        e,
        o,
        n,
        s
      ), r ? console.log("[localStorageApi] deleteTask: broadcast suppressed") : (console.log("[localStorageApi] deleteTask: broadcasting", { sessionId: H }), z("tasks-updated", { sessionId: H, userType: t, userId: a, boardId: s })), {
        ...c,
        state: "Deleted",
        closedAt: (/* @__PURE__ */ new Date()).toISOString(),
        updatedAt: (/* @__PURE__ */ new Date()).toISOString()
      };
    },
    async createTag(n, s = "main") {
      await ct(
        e,
        o,
        { boardId: s, tag: n }
      ), z("boards-updated", { sessionId: H, userType: t, userId: a, boardId: s });
    },
    async deleteTag(n, s = "main") {
      await dt(
        e,
        o,
        { boardId: s, tag: n }
      ), z("boards-updated", { sessionId: H, userType: t, userId: a, boardId: s });
    },
    // User preferences (includes device-specific settings like theme)
    async getPreferences() {
      const n = `${t}-${a}-preferences`, s = localStorage.getItem(n);
      return s ? JSON.parse(s) : {
        version: 1,
        updatedAt: (/* @__PURE__ */ new Date()).toISOString(),
        theme: "light",
        showCompleteButton: !0,
        showDeleteButton: !0,
        showTagButton: !1
      };
    },
    async savePreferences(n) {
      const s = `${t}-${a}-preferences`, i = {
        ...await this.getPreferences(),
        ...n,
        version: 1,
        updatedAt: (/* @__PURE__ */ new Date()).toISOString()
      };
      localStorage.setItem(s, JSON.stringify(i));
    },
    // Batch operations
    async batchMoveTasks(n, s, r) {
      const i = await this.getBoards(), c = i.boards.find((b) => b.id === n), u = i.boards.find((b) => b.id === s);
      if (!c)
        throw new Error(`Source board ${n} not found`);
      if (!u)
        throw new Error(`Target board ${s} not found`);
      const d = c.tasks.filter((b) => r.includes(b.id));
      c.tasks = c.tasks.filter((b) => !r.includes(b.id)), u.tasks = [...u.tasks, ...d], i.updatedAt = (/* @__PURE__ */ new Date()).toISOString();
      const h = `${t}-${a}-boards`;
      localStorage.setItem(h, JSON.stringify(i));
      const y = `${t}-${a}-${n}-tasks`, T = `${t}-${a}-${s}-tasks`;
      return localStorage.setItem(y, JSON.stringify({
        version: 1,
        updatedAt: i.updatedAt,
        tasks: c.tasks
      })), localStorage.setItem(T, JSON.stringify({
        version: 1,
        updatedAt: i.updatedAt,
        tasks: u.tasks
      })), z("boards-updated", { sessionId: H, userType: t, userId: a }), { ok: !0, moved: d.length };
    },
    async batchUpdateTags(n, s) {
      console.log("[localStorageApi] batchUpdateTags", { boardId: n, updates: s }), await ut(
        e,
        o,
        { boardId: n, updates: s }
      ), z("tasks-updated", { sessionId: H, userType: t, userId: a, boardId: n });
    },
    async batchClearTag(n, s, r) {
      console.log("[localStorageApi] batchClearTag START", { boardId: n, tag: s, taskIds: r, taskCount: r.length });
      const i = await gt(
        e,
        o,
        { boardId: n, tag: s, taskIds: r }
      );
      console.log("[localStorageApi] batchClearTag result:", i), z("boards-updated", { sessionId: H, userType: t, userId: a, boardId: n }), console.log("[localStorageApi] batchClearTag END");
    },
    // User Management (localStorage only - no-op for validation)
    async validateKey(n) {
      return !n || n.length < 10 ? (console.warn("[localStorageApi] validateKey: Key too short (must be at least 10 characters)"), !1) : !0;
    },
    async setUserId(n) {
      return { ok: !0 };
    }
  };
}
async function pt(t, a, e, o) {
  for (const r of a.boards || []) {
    const i = r.id;
    if (r.tasks && r.tasks.length > 0) {
      const c = `${e}-${o}-${i}-tasks`, u = {
        version: 1,
        updatedAt: a.updatedAt || (/* @__PURE__ */ new Date()).toISOString(),
        tasks: r.tasks
      };
      window.localStorage.setItem(c, JSON.stringify(u));
    }
    if (r.stats) {
      const c = `${e}-${o}-${i}-stats`;
      window.localStorage.setItem(c, JSON.stringify(r.stats));
    }
  }
  const n = `${e}-${o}-boards`, s = {
    version: 1,
    updatedAt: a.updatedAt || (/* @__PURE__ */ new Date()).toISOString(),
    boards: (a.boards || []).map((r) => ({
      id: r.id,
      name: r.name,
      tags: r.tags || []
    }))
  };
  window.localStorage.setItem(n, JSON.stringify(s)), console.log("[api] Synced API data to localStorage:", {
    boards: a.boards?.length || 0,
    totalTasks: a.boards?.reduce((r, i) => r + (i.tasks?.length || 0), 0) || 0
  });
}
function W(t, a, e) {
  const o = {
    "Content-Type": "application/json",
    "X-User-Type": t
  };
  return a && (o["X-User-Id"] = a), e && (o["X-Session-Id"] = e), o;
}
function de(t = "public", a = "public", e) {
  const o = ht(t, a);
  return t === "public" ? o : {
    // Get boards - returns localStorage immediately (optimistic)
    async getBoards() {
      return await o.getBoards();
    },
    // Sync from API - called once on initial page load to get server state
    async syncFromApi() {
      try {
        console.log("[api] Syncing from API...");
        const n = await fetch(`/task/api/boards?userType=${t}&userId=${encodeURIComponent(a)}`, {
          headers: W(t, a, e)
        });
        if (!n.ok)
          throw new Error(`API returned ${n.status}`);
        const s = await n.json();
        if (!s || !s.boards || !Array.isArray(s.boards)) {
          console.error("[api] Invalid response structure:", s);
          return;
        }
        console.log("[api] Synced from API:", { boards: s.boards.length, totalTasks: s.boards.reduce((r, i) => r + (i.tasks?.length || 0), 0) }), await pt(o, s, t, a);
      } catch (n) {
        console.error("[api] Sync from API failed:", n);
      }
    },
    async createTask(n, s = "main", r = !1) {
      const i = await o.createTask(n, s, r);
      return fetch("/task/api", {
        method: "POST",
        headers: W(t, a, e),
        body: JSON.stringify({
          id: n.id || i.id,
          // Use provided ID (for moves) or client-generated ID
          ...n,
          boardId: s
        })
      }).then((c) => c.json()).then((c) => {
        c.ok && (c.id === i.id ? console.log("[api] Background sync: createTask completed (ID matched)") : console.warn("[api] Server returned different ID (unexpected):", { client: i.id, server: c.id }));
      }).catch((c) => console.error("[api] Failed to sync createTask:", c)), i;
    },
    async createTag(n, s = "main") {
      const r = await o.createTag(n, s);
      return fetch("/task/api/tags", {
        method: "POST",
        headers: W(t, a, e),
        body: JSON.stringify({ boardId: s, tag: n })
      }).then(() => console.log("[api] Background sync: createTag completed")).catch((i) => console.error("[api] Failed to sync createTag:", i)), r;
    },
    async deleteTag(n, s = "main") {
      const r = await o.deleteTag(n, s);
      return fetch("/task/api/tags/delete", {
        method: "POST",
        headers: W(t, a, e),
        body: JSON.stringify({ boardId: s, tag: n })
      }).then(() => console.log("[api] Background sync: deleteTag completed")).catch((i) => console.error("[api] Failed to sync deleteTag:", i)), r;
    },
    async patchTask(n, s, r = "main", i = !1) {
      const c = await o.patchTask(n, s, r, i);
      return fetch(`/task/api/${n}`, {
        method: "PATCH",
        headers: W(t, a, e),
        body: JSON.stringify({ ...s, boardId: r })
      }).then(() => console.log("[api] Background sync: patchTask completed")).catch((u) => console.error("[api] Failed to sync patchTask:", u)), c;
    },
    async completeTask(n, s = "main") {
      const r = await o.completeTask(n, s);
      return fetch(`/task/api/${n}/complete`, {
        method: "POST",
        headers: W(t, a, e),
        body: JSON.stringify({ boardId: s })
      }).then((i) => {
        if (!i.ok) throw new Error(`HTTP ${i.status}`);
        console.log("[api] Background sync: completeTask completed");
      }).catch((i) => console.error("[api] Failed to sync completeTask:", i)), r;
    },
    async deleteTask(n, s = "main", r = !1) {
      await o.deleteTask(n, s, r), fetch(`/task/api/${n}`, {
        method: "DELETE",
        headers: W(t, a, e),
        body: JSON.stringify({ boardId: s })
      }).then((i) => {
        if (!i.ok) throw new Error(`HTTP ${i.status}`);
        console.log("[api] Background sync: deleteTask completed");
      }).catch((i) => console.error("[api] Failed to sync deleteTask:", i));
    },
    // Board operations
    async createBoard(n) {
      const s = await o.createBoard(n);
      return fetch("/task/api/boards", {
        method: "POST",
        headers: W(t, a, e),
        body: JSON.stringify({ id: n, name: n })
      }).then(() => console.log("[api] Background sync: createBoard completed")).catch((r) => console.error("[api] Failed to sync createBoard:", r)), s;
    },
    async deleteBoard(n) {
      const s = await o.deleteBoard(n);
      return fetch(`/task/api/boards/${encodeURIComponent(n)}`, {
        method: "DELETE",
        headers: W(t, a, e)
      }).then(() => console.log("[api] Background sync: deleteBoard completed")).catch((r) => console.error("[api] Failed to sync deleteBoard:", r)), s;
    },
    // User preferences
    async getPreferences() {
      const n = await o.getPreferences();
      try {
        const s = await fetch("/task/api/preferences", {
          headers: W(t, a, e)
        });
        if (s.ok) {
          const r = await s.json(), i = {
            ...n,
            // Keep device-specific settings (theme, buttons)
            ...r,
            // Override with server preferences (experimentalThemes, alwaysVerticalLayout)
            // Ensure device-specific settings are never overwritten by server
            theme: n.theme,
            showCompleteButton: n.showCompleteButton,
            showDeleteButton: n.showDeleteButton,
            showTagButton: n.showTagButton
          };
          return await o.savePreferences(i), console.log("[api] Synced server preferences, preserved device-specific settings"), i;
        }
      } catch (s) {
        console.warn("[api] Failed to fetch preferences from server, using localStorage:", s);
      }
      return n;
    },
    async savePreferences(n) {
      await o.savePreferences(n);
      const { theme: s, showCompleteButton: r, showDeleteButton: i, showTagButton: c, ...u } = n;
      Object.keys(u).length > 0 && fetch("/task/api/preferences", {
        method: "PUT",
        headers: W(t, a, e),
        body: JSON.stringify(u)
      }).then(() => console.log("[api] Background sync: savePreferences completed (server-only)")).catch((d) => console.error("[api] Failed to sync savePreferences:", d));
    },
    // Batch operations
    async batchUpdateTags(n, s) {
      await o.batchUpdateTags(n, s), fetch("/task/api/batch-tag", {
        method: "PATCH",
        headers: W(t, a, e),
        body: JSON.stringify({ boardId: n, updates: s })
      }).then(() => console.log("[api] Background sync: batchUpdateTags completed")).catch((r) => console.error("[api] Failed to sync batchUpdateTags:", r));
    },
    async batchMoveTasks(n, s, r) {
      const i = await o.batchMoveTasks(n, s, r);
      return fetch("/task/api/batch-move", {
        method: "POST",
        headers: W(t, a, e),
        body: JSON.stringify({ sourceBoardId: n, targetBoardId: s, taskIds: r })
      }).then(() => console.log("[api] Background sync: batchMoveTasks completed")).catch((c) => console.error("[api] Failed to sync batchMoveTasks:", c)), i;
    },
    async batchClearTag(n, s, r) {
      await o.batchClearTag(n, s, r), fetch("/task/api/batch-clear-tag", {
        method: "POST",
        headers: W(t, a, e),
        body: JSON.stringify({ boardId: n, tag: s, taskIds: r })
      }).then(() => console.log("[api] Background sync: batchClearTag completed")).catch((i) => console.error("[api] Failed to sync batchClearTag:", i));
    },
    // User Management
    async validateKey(n) {
      try {
        return (await fetch("/task/api/validate-key", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ key: n })
        })).ok;
      } catch (s) {
        return console.error("[api] Failed to validate key:", s), !1;
      }
    }
  };
}
function mt(t) {
  t = t.trim();
  const a = (n) => n.trim().replace(/\s+/g, "-"), e = t.match(/^["']([^"']+)["']\s*(.*)$/);
  if (e) {
    const n = e[1].trim(), r = e[2].match(/#[^\s#]+/g)?.map((i) => a(i.slice(1))).filter(Boolean) || [];
    return { title: n, tag: r.length ? r.join(" ") : void 0 };
  }
  const o = t.match(/^(.+?)\s+(#.+)$/);
  if (o) {
    const n = o[1].trim(), r = o[2].match(/#[^\s#]+/g)?.map((i) => a(i.slice(1))).filter(Boolean) || [];
    return { title: n, tag: r.length ? r.join(" ") : void 0 };
  }
  return { title: t.trim() };
}
function ft(t, a = 6, e = []) {
  const o = t.flatMap((s) => s.tag?.split(" ") || []).filter(Boolean), n = {};
  return o.forEach((s) => n[s] = (n[s] || 0) + 1), e.filter(Boolean).forEach((s) => {
    n[s] || (n[s] = 0);
  }), Object.entries(n).sort((s, r) => r[1] - s[1]).slice(0, a).map(([s]) => s);
}
function Te(t, a) {
  return t.filter((e) => e.tag?.split(" ").includes(a));
}
function kt(t, a, e) {
  const o = Array.isArray(e) && e.length > 0;
  return t.filter((n) => {
    const s = n.tag?.split(" ") || [];
    return o ? e.some((i) => s.includes(i)) && !a.some((i) => s.includes(i)) : !a.some((r) => s.includes(r));
  });
}
function Pe(t) {
  return Array.from(new Set(t.flatMap((a) => a.tag?.split(" ") || []).filter(Boolean)));
}
async function ye(t, a, e, o, n = {}) {
  const { onError: s, suppress404: r = !0 } = n;
  if (a.has(t)) {
    console.log(`[withPendingOperation] Operation already pending: ${t}`);
    return;
  }
  e((i) => /* @__PURE__ */ new Set([...i, t]));
  try {
    return await o();
  } catch (i) {
    r && i?.message?.includes("404") || (s ? s(i) : console.error(`[withPendingOperation] Error in ${t}:`, i));
    return;
  } finally {
    e((i) => {
      const c = new Set(i);
      return c.delete(t), c;
    });
  }
}
function oe(t, a) {
  const e = t?.boards?.find((o) => o.id === a);
  return e ? (console.log(`[extractBoardTasks] Found board ${a}`, {
    taskCount: e.tasks?.length || 0
  }), {
    tasks: (e.tasks || []).filter((o) => o.state === "Active"),
    foundBoard: !0
  }) : (console.log(`[extractBoardTasks] Board not found: ${a}`), {
    tasks: [],
    foundBoard: !1
  });
}
function Tt({ userType: t, userId: a, sessionId: e }) {
  const [o, n] = E([]), [s, r] = E(/* @__PURE__ */ new Set()), i = _e(
    () => de(t, a || "public", e),
    [t, a, e]
  ), [c, u] = E(null), [d, h] = E("main");
  async function y() {
    console.log("[useTasks] initialLoad called"), "syncFromApi" in i && await i.syncFromApi(), await T();
  }
  async function T() {
    console.log("[useTasks] reload called", { currentBoardId: d, stack: new Error().stack?.split(`
`).slice(1, 4).join(`
`) });
    const m = await i.getBoards();
    u(m);
    const { tasks: S } = oe(m, d);
    n(S);
  }
  G(() => {
    console.log("[useTasks] User context changed, clearing state and reloading", { userType: t, userId: a }), n([]), r(/* @__PURE__ */ new Set()), u(null), h("main"), T();
  }, [t, a]), G(() => {
    console.log("[useTasks] Setting up BroadcastChannel listener", { currentBoardId: d, userType: t, userId: a });
    try {
      const m = new BroadcastChannel("tasks");
      return m.onmessage = (S) => {
        const g = S.data || {};
        if (console.log("[useTasks] BroadcastChannel message received", { msg: g, sessionId: H, currentBoardId: d, currentContext: { userType: t, userId: a } }), g.sessionId === H) {
          console.log("[useTasks] Ignoring own broadcast message");
          return;
        }
        if (g.userType !== t || g.userId !== a) {
          console.log("[useTasks] Ignoring message for different user context", {
            msgContext: { userType: g.userType, userId: g.userId },
            currentContext: { userType: t, userId: a }
          });
          return;
        }
        (g.type === "tasks-updated" || g.type === "boards-updated") && (console.log("[useTasks] BroadcastChannel: triggering reload for currentBoardId =", d), T());
      }, () => {
        console.log("[useTasks] Cleaning up BroadcastChannel listener", { currentBoardId: d }), m.close();
      };
    } catch (m) {
      console.error("[useTasks] Failed to setup BroadcastChannel", m);
    }
  }, [d, t, a]);
  async function b(m) {
    if (m = m.trim(), !!m)
      try {
        const S = mt(m);
        return await i.createTask(S, d), await T(), !0;
      } catch (S) {
        return alert(S.message || "Failed to create task"), !1;
      }
  }
  async function A(m) {
    await ye(
      `complete-${m}`,
      s,
      r,
      async () => {
        await i.completeTask(m, d), await T();
      },
      {
        onError: (S) => alert(S.message || "Failed to complete task")
      }
    );
  }
  async function R(m) {
    console.log("[useTasks] deleteTask START", { taskId: m, currentBoardId: d }), await ye(
      `delete-${m}`,
      s,
      r,
      async () => {
        console.log("[useTasks] deleteTask: calling api.deleteTask", { taskId: m, currentBoardId: d }), await i.deleteTask(m, d), console.log("[useTasks] deleteTask: calling reload"), await T(), console.log("[useTasks] deleteTask END");
      },
      {
        onError: (S) => alert(S.message || "Failed to delete task")
      }
    );
  }
  async function L(m) {
    const S = prompt("Enter tag (without #):");
    if (!S) return;
    const g = S.trim().replace(/^#+/, "").replace(/\s+/g, "-"), f = o.find((N) => N.id === m);
    if (!f) return;
    const v = f.tag?.split(" ") || [];
    if (v.includes(g)) return;
    const x = [...v, g].join(" ");
    try {
      await i.patchTask(m, { tag: x }, d), await T();
    } catch (N) {
      alert(N.message || "Failed to add tag");
    }
  }
  async function K(m, S, g = {}) {
    const { suppressBroadcast: f = !1, skipReload: v = !1 } = g;
    try {
      await i.patchTask(m, S, d, f), v || await T();
    } catch (x) {
      throw x;
    }
  }
  async function V(m) {
    console.log("[useTasks] bulkUpdateTaskTags START", { count: m.length });
    try {
      await i.batchUpdateTags(
        d,
        m.map((S) => ({ taskId: S.taskId, tag: S.tag || null }))
      ), console.log("[useTasks] bulkUpdateTaskTags: calling reload"), await T(), console.log("[useTasks] bulkUpdateTaskTags END");
    } catch (S) {
      throw console.error("[useTasks] bulkUpdateTaskTags ERROR", S), S;
    }
  }
  async function U(m) {
    console.log("[useTasks] deleteTag START", { tag: m, currentBoardId: d, taskCount: o.length });
    const S = o.filter((g) => g.tag?.split(" ").includes(m));
    if (console.log("[useTasks] deleteTag: found tasks with tag", { tag: m, count: S.length }), S.length === 0) {
      console.log("[useTasks] deleteTag: no tasks found with this tag, just deleting tag");
      try {
        await i.deleteTag(m, d), await T(), console.log("[useTasks] deleteTag END (no tasks to clear)");
      } catch (g) {
        console.error("[useTasks] deleteTag ERROR", g), console.error("[useTasks] deleteTag: Please fix this error:", g.message);
      }
      return;
    }
    try {
      console.log("[useTasks] deleteTag: starting batch clear"), await i.batchClearTag(
        d,
        m,
        S.map((g) => g.id)
      ), console.log("[useTasks] deleteTag: calling reload"), await T(), console.log("[useTasks] deleteTag END");
    } catch (g) {
      console.error("[useTasks] deleteTag ERROR", g), alert(g.message || "Failed to remove tag from tasks");
    }
  }
  async function J(m) {
    await i.createBoard(m), h(m);
    const S = await i.getBoards();
    u(S);
    const { tasks: g } = oe(S, m);
    n(g);
  }
  async function q(m, S) {
    if (console.log("[useTasks] moveTasksToBoard START", { targetBoardId: m, ids: S, currentBoardId: d }), !c) return;
    const g = /* @__PURE__ */ new Set();
    for (const f of c.boards)
      for (const v of f.tasks || [])
        S.includes(v.id) && g.add(f.id);
    console.log("[useTasks] moveTasksToBoard: source boards", { sourceBoardIds: Array.from(g) });
    try {
      if (g.size === 1) {
        const x = Array.from(g)[0];
        console.log("[useTasks] moveTasksToBoard: using batch API"), await i.batchMoveTasks(x, m, S);
      } else
        throw console.error("[useTasks] moveTasksToBoard: Cannot move tasks from multiple boards at once"), new Error("Cannot move tasks from multiple boards at once");
      console.log("[useTasks] moveTasksToBoard: switching to target board", { targetBoardId: m }), h(m);
      const f = await i.getBoards();
      u(f);
      const { tasks: v } = oe(f, m);
      n(v), console.log("[useTasks] moveTasksToBoard END");
    } catch (f) {
      console.error("[useTasks] moveTasksToBoard ERROR", f), alert(f.message || "Failed to move tasks");
    }
  }
  async function te(m) {
    if (await i.deleteBoard(m), d === m) {
      h("main");
      const S = await i.getBoards();
      u(S);
      const { tasks: g } = oe(S, "main");
      n(g);
    } else
      await T();
  }
  async function j(m) {
    await i.createTag(m, d), await T();
  }
  async function Q(m) {
    await i.deleteTag(m, d), await T();
  }
  function Y(m) {
    h(m);
    const { tasks: S, foundBoard: g } = oe(c, m);
    g ? n(S) : T();
  }
  return {
    // Task state
    tasks: o,
    pendingOperations: s,
    // Task operations
    addTask: b,
    completeTask: A,
    deleteTask: R,
    addTagToTask: L,
    updateTaskTags: K,
    bulkUpdateTaskTags: V,
    deleteTag: U,
    // Board state
    boards: c,
    currentBoardId: d,
    // Board operations
    createBoard: J,
    deleteBoard: te,
    switchBoard: Y,
    moveTasksToBoard: q,
    createTagOnBoard: j,
    deleteTagOnBoard: Q,
    // Lifecycle
    initialLoad: y,
    reload: T
  };
}
function yt({ tasks: t, onTaskUpdate: a, onBulkUpdate: e }) {
  const [o, n] = E(null), [s, r] = E(null), [i, c] = E(/* @__PURE__ */ new Set()), [u, d] = E(!1), [h, y] = E(null), [T, b] = E(null), A = re(null);
  function R(g) {
    let f = [];
    try {
      const v = g.dataTransfer.getData("application/x-hadoku-task-ids");
      v && (f = JSON.parse(v));
    } catch {
    }
    if (f.length === 0) {
      const v = g.dataTransfer.getData("text/plain");
      v && (f = [v]);
    }
    return f;
  }
  function L(g, f) {
    const v = i.has(f) && i.size > 0 ? Array.from(i) : [f];
    console.log("[useDragAndDrop] onDragStart", { taskId: f, idsToDrag: v, selectedCount: i.size }), g.dataTransfer.setData("text/plain", v[0]);
    try {
      g.dataTransfer.setData("application/x-hadoku-task-ids", JSON.stringify(v));
    } catch {
    }
    g.dataTransfer.effectAllowed = "copyMove";
    try {
      const x = g.currentTarget, N = x.closest && x.closest(".task-app__item") ? x.closest(".task-app__item") : x;
      N.classList.add("dragging");
      const B = N.cloneNode(!0);
      B.style.boxSizing = "border-box", B.style.width = `${N.offsetWidth}px`, B.style.height = `${N.offsetHeight}px`, B.style.opacity = "0.95", B.style.transform = "none", B.style.filter = "drop-shadow(0 6px 18px rgba(0,0,0,0.12))", B.classList.add("drag-image"), B.style.position = "absolute", B.style.top = "-9999px", B.style.left = "-9999px", document.body.appendChild(B), N.__dragImage = B, c((O) => {
        if (O.has(f)) return new Set(O);
        const P = new Set(O);
        return P.add(f), P;
      });
      try {
        const O = N.closest(".task-app__tag-column");
        if (O) {
          const P = O.querySelector(".task-app__tag-header") || O.querySelector("h3"), I = (P && P.textContent || "").trim().replace(/^#/, "");
          if (I)
            try {
              g.dataTransfer.setData("application/x-hadoku-task-source", I);
            } catch {
            }
        }
      } catch {
      }
      try {
        const O = N.getBoundingClientRect();
        let P = Math.round(g.clientX - O.left), w = Math.round(g.clientY - O.top);
        P = Math.max(0, Math.min(Math.round(B.offsetWidth - 1), P)), w = Math.max(0, Math.min(Math.round(B.offsetHeight - 1), w)), g.dataTransfer.setDragImage(B, P, w);
      } catch {
        g.dataTransfer.setDragImage(B, 0, 0);
      }
    } catch {
    }
  }
  function K(g) {
    try {
      const f = g.currentTarget;
      f.classList.remove("dragging");
      const v = f.__dragImage;
      v && v.parentNode && v.parentNode.removeChild(v), v && delete f.__dragImage;
    } catch {
    }
    try {
      q();
    } catch {
    }
  }
  function V(g) {
    if (g.button === 0) {
      try {
        const f = g.target;
        if (!f || f.closest && f.closest(".task-app__item, .task-app__controls, button, input, textarea, .task-app__item-actions"))
          return;
      } catch {
      }
      d(!0), A.current = { x: g.clientX, y: g.clientY }, y({ x: g.clientX, y: g.clientY, w: 0, h: 0 }), c(/* @__PURE__ */ new Set());
      try {
        document.body.classList.add("marquee-selecting");
      } catch {
      }
    }
  }
  function U(g) {
    if (!u || !A.current) return;
    const f = A.current.x, v = A.current.y, x = g.clientX, N = g.clientY, B = Math.min(f, x), O = Math.min(v, N), P = Math.abs(x - f), w = Math.abs(N - v);
    y({ x: B, y: O, w: P, h: w });
    const I = Array.from(document.querySelectorAll(".task-app__item")), M = /* @__PURE__ */ new Set();
    for (const F of I) {
      const D = F.getBoundingClientRect();
      if (!(D.right < B || D.left > B + P || D.bottom < O || D.top > O + w)) {
        const p = F.getAttribute("data-task-id");
        p && M.add(p), F.classList.add("selected");
      } else
        F.classList.remove("selected");
    }
    c(M);
  }
  function J(g) {
    d(!1), y(null), A.current = null;
    try {
      document.body.classList.remove("marquee-selecting");
    } catch {
    }
    try {
      b(Date.now());
    } catch {
    }
  }
  function q() {
    c(/* @__PURE__ */ new Set()), Array.from(document.querySelectorAll(".task-app__item.selected")).forEach((f) => f.classList.remove("selected"));
  }
  G(() => {
    function g(x) {
      if (x.button !== 0) return;
      const N = { target: x.target, clientX: x.clientX, clientY: x.clientY, button: x.button };
      try {
        V(N);
      } catch {
      }
    }
    function f(x) {
      const N = { clientX: x.clientX, clientY: x.clientY };
      try {
        U(N);
      } catch {
      }
    }
    function v(x) {
      const N = { clientX: x.clientX, clientY: x.clientY };
      try {
        J(N);
      } catch {
      }
    }
    return document.addEventListener("mousedown", g), document.addEventListener("mousemove", f), document.addEventListener("mouseup", v), () => {
      document.removeEventListener("mousedown", g), document.removeEventListener("mousemove", f), document.removeEventListener("mouseup", v);
    };
  }, []);
  function te(g, f) {
    g.preventDefault(), g.dataTransfer.dropEffect = "copy", n(f);
  }
  function j(g) {
    g.currentTarget.contains(g.relatedTarget) || n(null);
  }
  async function Q(g, f) {
    g.preventDefault(), n(null), console.log("[useDragAndDrop] onDrop START", { targetTag: f });
    const v = R(g);
    if (v.length === 0) return;
    let x = null;
    try {
      const B = g.dataTransfer.getData("application/x-hadoku-task-source");
      B && (x = B);
    } catch {
    }
    console.log("[useDragAndDrop] onDrop: processing", { targetTag: f, ids: v, srcTag: x, taskCount: v.length });
    const N = [];
    for (const B of v) {
      const O = t.find((F) => F.id === B);
      if (!O) continue;
      const P = O.tag?.split(" ").filter(Boolean) || [];
      if (f === "other") {
        if (P.length === 0) continue;
        N.push({ taskId: B, tag: "" });
        continue;
      }
      const w = P.includes(f);
      let I = P.slice();
      w || I.push(f), x && x !== f && (I = I.filter((F) => F !== x));
      const M = I.join(" ").trim();
      N.push({ taskId: B, tag: M });
    }
    console.log("[useDragAndDrop] onDrop: updating tasks", { updateCount: N.length });
    try {
      await e(N), console.log("[useDragAndDrop] onDrop: updates complete, clearing selection");
      try {
        q();
      } catch {
      }
    } catch (B) {
      console.error("Failed to add tag to one or more tasks:", B), alert(B.message || "Failed to add tags");
    }
    console.log("[useDragAndDrop] onDrop END");
  }
  function Y(g, f) {
    g.preventDefault(), g.dataTransfer.dropEffect = "copy", r(f);
  }
  function m(g) {
    g.currentTarget.contains(g.relatedTarget) || r(null);
  }
  async function S(g, f) {
    g.preventDefault(), r(null);
    const v = R(g);
    if (v.length === 0) return;
    console.log("[useDragAndDrop] onFilterDrop", { filterTag: f, ids: v, taskCount: v.length });
    const x = [];
    for (const N of v) {
      const B = t.find((w) => w.id === N);
      if (!B) continue;
      const O = B.tag?.split(" ").filter(Boolean) || [];
      if (O.includes(f)) {
        console.log(`Task ${N} already has tag: ${f}`);
        continue;
      }
      const P = [...O, f].join(" ");
      x.push({ taskId: N, tag: P });
    }
    if (x.length === 0) {
      console.log("No updates needed - all tasks already have this tag");
      return;
    }
    console.log(`Adding tag "${f}" to ${x.length} task(s) via filter drop`);
    try {
      await e(x);
      try {
        q();
      } catch {
      }
    } catch (N) {
      console.error("Failed to add tag via filter drop:", N), alert(N.message || "Failed to add tag");
    }
  }
  return {
    dragOverTag: o,
    dragOverFilter: s,
    setDragOverFilter: r,
    selectedIds: i,
    isSelecting: u,
    marqueeRect: h,
    selectionJustEndedAt: T,
    // selection handlers
    selectionStartHandler: V,
    selectionMoveHandler: U,
    selectionEndHandler: J,
    clearSelection: q,
    onDragStart: L,
    onDragEnd: K,
    onDragOver: te,
    onDragLeave: j,
    onDrop: Q,
    onFilterDragOver: Y,
    onFilterDragLeave: m,
    onFilterDrop: S
  };
}
function wt() {
  const [t, a] = E({});
  function e(r) {
    a((i) => {
      const u = (i[r] || "desc") === "desc" ? "asc" : "desc";
      return { ...i, [r]: u };
    });
  }
  function o(r, i) {
    return [...r].sort((c, u) => {
      const d = new Date(c.createdAt).getTime(), h = new Date(u.createdAt).getTime();
      return i === "asc" ? d - h : h - d;
    });
  }
  function n(r) {
    return r === "asc" ? "↑" : "↓";
  }
  function s(r) {
    return r === "asc" ? "Sorted by age (oldest first) - click to sort newest first" : "Sorted by age (newest first) - click to sort oldest first";
  }
  return {
    sortDirections: t,
    toggleSort: e,
    sortTasksByAge: o,
    getSortIcon: n,
    getSortTitle: s
  };
}
const we = 5, vt = 300, ce = "1.0", ve = "task-storage-version", bt = [
  /^tasks-/,
  // tasks-main, tasks-work
  /^stats-/,
  // stats-main, stats-work
  /^boards$/,
  // boards (without prefix)
  /^preferences$/
  // preferences (without prefix)
], St = {
  version: 1,
  updatedAt: (/* @__PURE__ */ new Date()).toISOString(),
  experimentalThemes: !1,
  alwaysVerticalLayout: !1,
  theme: "light",
  showCompleteButton: !0,
  showDeleteButton: !0,
  showTagButton: !1
};
function Ct(t, a) {
  const e = window.localStorage.getItem(ve);
  e !== ce && (console.log("[Preferences] Storage version mismatch, cleaning up orphaned keys", {
    current: e,
    expected: ce
  }), Object.keys(window.localStorage).forEach((o) => {
    const n = bt.some((r) => r.test(o)), s = o.includes(`${t}-${a}`);
    n && !s && (console.log("[Preferences] Removing orphaned key:", o), window.localStorage.removeItem(o));
  }), window.localStorage.setItem(ve, ce), console.log("[Preferences] Storage upgraded to version", ce));
}
function xt(t) {
  try {
    const a = sessionStorage.getItem("theme"), e = sessionStorage.getItem("showCompleteButton"), o = sessionStorage.getItem("showDeleteButton"), n = sessionStorage.getItem("showTagButton"), s = {};
    return a && !t.theme && (s.theme = a), e !== null && t.showCompleteButton === void 0 && (s.showCompleteButton = e === "true"), o !== null && t.showDeleteButton === void 0 && (s.showDeleteButton = o === "true"), n !== null && t.showTagButton === void 0 && (s.showTagButton = n === "true"), Object.keys(s).length > 0 ? (console.log("[Preferences] Migrating settings from sessionStorage to localStorage:", s), sessionStorage.removeItem("theme"), sessionStorage.removeItem("showCompleteButton"), sessionStorage.removeItem("showDeleteButton"), sessionStorage.removeItem("showTagButton"), s) : null;
  } catch (a) {
    return console.warn("[Preferences] Failed to migrate settings:", a), null;
  }
}
function Bt(t, a, e) {
  const [o, n] = E(St), [s, r] = E(!1);
  G(() => {
    (async () => {
      Ct(t, a), console.log("[usePreferences] Loading preferences...", { userType: t, userId: a, sessionId: e });
      const d = de(t, a, e), h = await d.getPreferences();
      if (console.log("[usePreferences] Loaded preferences:", h), h) {
        const y = xt(h);
        if (y) {
          const T = { ...h, ...y, updatedAt: (/* @__PURE__ */ new Date()).toISOString() };
          n(T), await d.savePreferences(T), console.log("[usePreferences] Applied and saved migrations");
        } else
          n(h), console.log("[usePreferences] Applied preferences to state");
      }
      r(!0);
    })();
  }, [t, a, e]);
  const i = async (u) => {
    const d = { ...o, ...u, updatedAt: (/* @__PURE__ */ new Date()).toISOString() };
    n(d), await de(t, a, e).savePreferences(d);
  }, c = o.theme?.endsWith("-dark") || o.theme === "dark";
  return {
    preferences: o,
    savePreferences: i,
    preferencesLoaded: s,
    isDarkTheme: c
  };
}
const Z = {
  width: 20,
  height: 20,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round"
}, Dt = () => /* @__PURE__ */ k("svg", { ...Z, children: [
  /* @__PURE__ */ l("circle", { cx: "12", cy: "12", r: "5" }),
  /* @__PURE__ */ l("line", { x1: "12", y1: "1", x2: "12", y2: "3" }),
  /* @__PURE__ */ l("line", { x1: "12", y1: "21", x2: "12", y2: "23" }),
  /* @__PURE__ */ l("line", { x1: "4.22", y1: "4.22", x2: "5.64", y2: "5.64" }),
  /* @__PURE__ */ l("line", { x1: "18.36", y1: "18.36", x2: "19.78", y2: "19.78" }),
  /* @__PURE__ */ l("line", { x1: "1", y1: "12", x2: "3", y2: "12" }),
  /* @__PURE__ */ l("line", { x1: "21", y1: "12", x2: "23", y2: "12" }),
  /* @__PURE__ */ l("line", { x1: "4.22", y1: "19.78", x2: "5.64", y2: "18.36" }),
  /* @__PURE__ */ l("line", { x1: "18.36", y1: "5.64", x2: "19.78", y2: "4.22" })
] }), $e = () => /* @__PURE__ */ l("svg", { ...Z, children: /* @__PURE__ */ l("path", { d: "M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" }) }), be = () => /* @__PURE__ */ k("svg", { ...Z, children: [
  /* @__PURE__ */ l("path", { d: "M12 21 C12 21 6.5 15 6.5 11 C6.5 8.5 8 7 10 7 C11 7 12 7.5 12 7.5 C12 7.5 13 7 14 7 C16 7 17.5 8.5 17.5 11 C17.5 15 12 21 12 21 Z", fill: "currentColor" }),
  /* @__PURE__ */ l("path", { d: "M9.5 7.5 L9 5 L11 5.5 Z", fill: "currentColor" }),
  /* @__PURE__ */ l("path", { d: "M14.5 7.5 L15 5 L13 5.5 Z", fill: "currentColor" }),
  /* @__PURE__ */ l("path", { d: "M12 7.5 L12 4 L12 5", stroke: "currentColor", strokeWidth: "1.5", fill: "none" }),
  /* @__PURE__ */ l("line", { x1: "10", y1: "10", x2: "10", y2: "11", stroke: "currentColor", strokeWidth: "1", opacity: "0.4" }),
  /* @__PURE__ */ l("line", { x1: "14", y1: "10", x2: "14", y2: "11", stroke: "currentColor", strokeWidth: "1", opacity: "0.4" }),
  /* @__PURE__ */ l("line", { x1: "9", y1: "13", x2: "9", y2: "14", stroke: "currentColor", strokeWidth: "1", opacity: "0.4" }),
  /* @__PURE__ */ l("line", { x1: "15", y1: "13", x2: "15", y2: "14", stroke: "currentColor", strokeWidth: "1", opacity: "0.4" }),
  /* @__PURE__ */ l("line", { x1: "11", y1: "16", x2: "11", y2: "17", stroke: "currentColor", strokeWidth: "1", opacity: "0.4" }),
  /* @__PURE__ */ l("line", { x1: "13", y1: "16", x2: "13", y2: "17", stroke: "currentColor", strokeWidth: "1", opacity: "0.4" })
] }), Se = () => /* @__PURE__ */ k("svg", { ...Z, children: [
  /* @__PURE__ */ l("path", { d: "M2 12c2-2 4-2 6 0s4 2 6 0 4-2 6 0" }),
  /* @__PURE__ */ l("path", { d: "M2 17c2-2 4-2 6 0s4 2 6 0 4-2 6 0" }),
  /* @__PURE__ */ l("path", { d: "M2 7c2-2 4-2 6 0s4 2 6 0 4-2 6 0" })
] }), Ce = () => /* @__PURE__ */ l("svg", { ...Z, children: /* @__PURE__ */ l("polygon", { points: "13 2 3 14 12 14 11 22 21 10 12 10 13 2" }) }), xe = () => /* @__PURE__ */ k("svg", { ...Z, children: [
  /* @__PURE__ */ l("path", { d: "M18 8h1a4 4 0 0 1 0 8h-1" }),
  /* @__PURE__ */ l("path", { d: "M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" }),
  /* @__PURE__ */ l("line", { x1: "6", y1: "1", x2: "6", y2: "4" }),
  /* @__PURE__ */ l("line", { x1: "10", y1: "1", x2: "10", y2: "4" }),
  /* @__PURE__ */ l("line", { x1: "14", y1: "1", x2: "14", y2: "4" })
] }), Be = () => /* @__PURE__ */ k("svg", { ...Z, children: [
  /* @__PURE__ */ l("circle", { cx: "12", cy: "12", r: "2", fill: "currentColor" }),
  /* @__PURE__ */ l("circle", { cx: "12", cy: "6", r: "2.5", fill: "none", stroke: "currentColor", strokeWidth: "2" }),
  /* @__PURE__ */ l("circle", { cx: "18", cy: "10", r: "2.5", fill: "none", stroke: "currentColor", strokeWidth: "2" }),
  /* @__PURE__ */ l("circle", { cx: "16", cy: "16", r: "2.5", fill: "none", stroke: "currentColor", strokeWidth: "2" }),
  /* @__PURE__ */ l("circle", { cx: "8", cy: "16", r: "2.5", fill: "none", stroke: "currentColor", strokeWidth: "2" }),
  /* @__PURE__ */ l("circle", { cx: "6", cy: "10", r: "2.5", fill: "none", stroke: "currentColor", strokeWidth: "2" })
] }), De = () => /* @__PURE__ */ l("svg", { ...Z, children: /* @__PURE__ */ l("path", { d: "M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z", fill: "currentColor" }) }), Nt = () => /* @__PURE__ */ k("svg", { ...Z, children: [
  /* @__PURE__ */ l("rect", { x: "11", y: "1", width: "2", height: "3", fill: "currentColor" }),
  /* @__PURE__ */ l("rect", { x: "16.5", y: "3.5", width: "3", height: "2", fill: "currentColor", transform: "rotate(45 18 4.5)" }),
  /* @__PURE__ */ l("rect", { x: "19", y: "11", width: "3", height: "2", fill: "currentColor" }),
  /* @__PURE__ */ l("rect", { x: "16.5", y: "18.5", width: "3", height: "2", fill: "currentColor", transform: "rotate(-45 18 19.5)" }),
  /* @__PURE__ */ l("rect", { x: "11", y: "20", width: "2", height: "3", fill: "currentColor" }),
  /* @__PURE__ */ l("rect", { x: "4.5", y: "18.5", width: "3", height: "2", fill: "currentColor", transform: "rotate(45 6 19.5)" }),
  /* @__PURE__ */ l("rect", { x: "2", y: "11", width: "3", height: "2", fill: "currentColor" }),
  /* @__PURE__ */ l("rect", { x: "4.5", y: "3.5", width: "3", height: "2", fill: "currentColor", transform: "rotate(-45 6 4.5)" }),
  /* @__PURE__ */ l("circle", { cx: "12", cy: "12", r: "7", fill: "currentColor" }),
  /* @__PURE__ */ l("circle", { cx: "12", cy: "12", r: "4", fill: "var(--color-bg-card)" })
] }), At = () => /* @__PURE__ */ k("svg", { ...Z, width: 16, height: 16, viewBox: "0 0 20 20", children: [
  /* @__PURE__ */ l(
    "path",
    {
      d: "M2 4 L12 4 L16 10 L12 16 L2 16 Z",
      fill: "currentColor"
    }
  ),
  /* @__PURE__ */ l("circle", { cx: "6", cy: "10", r: "1.5", fill: "white" })
] }), Ne = [
  {
    lightIcon: /* @__PURE__ */ l(Dt, {}),
    darkIcon: /* @__PURE__ */ l($e, {}),
    lightTheme: "light",
    darkTheme: "dark",
    lightLabel: "Light",
    darkLabel: "Dark"
  },
  {
    lightIcon: /* @__PURE__ */ l(be, {}),
    darkIcon: /* @__PURE__ */ l(be, {}),
    lightTheme: "strawberry-light",
    darkTheme: "strawberry-dark",
    lightLabel: "Strawberry Light",
    darkLabel: "Strawberry Dark"
  },
  {
    lightIcon: /* @__PURE__ */ l(Se, {}),
    darkIcon: /* @__PURE__ */ l(Se, {}),
    lightTheme: "ocean-light",
    darkTheme: "ocean-dark",
    lightLabel: "Ocean Light",
    darkLabel: "Ocean Dark"
  },
  {
    lightIcon: /* @__PURE__ */ l(Ce, {}),
    darkIcon: /* @__PURE__ */ l(Ce, {}),
    lightTheme: "cyberpunk-light",
    darkTheme: "cyberpunk-dark",
    lightLabel: "Cyberpunk Light",
    darkLabel: "Cyberpunk Dark"
  },
  {
    lightIcon: /* @__PURE__ */ l(xe, {}),
    darkIcon: /* @__PURE__ */ l(xe, {}),
    lightTheme: "coffee-light",
    darkTheme: "coffee-dark",
    lightLabel: "Coffee Light",
    darkLabel: "Coffee Dark"
  },
  {
    lightIcon: /* @__PURE__ */ l(Be, {}),
    darkIcon: /* @__PURE__ */ l(Be, {}),
    lightTheme: "lavender-light",
    darkTheme: "lavender-dark",
    lightLabel: "Lavender Light",
    darkLabel: "Lavender Dark"
  }
], Et = [
  {
    lightIcon: /* @__PURE__ */ l(De, {}),
    darkIcon: /* @__PURE__ */ l(De, {}),
    lightTheme: "pink-light",
    darkTheme: "pink-dark",
    lightLabel: "Pink Light",
    darkLabel: "Pink Dark"
  }
];
function Ie(t) {
  return t ? [...Ne, ...Et] : Ne;
}
function Mt(t, a) {
  const o = Ie(a).find(
    (n) => n.lightTheme === t || n.darkTheme === t
  );
  return o ? t.endsWith("-dark") || t === "dark" ? o.darkIcon : o.lightIcon : /* @__PURE__ */ l($e, {});
}
function _t(t, a, e) {
  const [o, n] = E(!1), s = re(null), r = t.theme || "light", i = (u) => a({ theme: u }), c = _e(
    () => Ie(t.experimentalThemes || !1),
    [t.experimentalThemes]
  );
  return G(() => {
    e.current && e.current.setAttribute("data-theme", r);
  }, [r, e]), G(() => {
    const u = window.matchMedia("(prefers-color-scheme: dark)"), d = (h) => {
      const y = h.matches, T = r.replace(/-light$|-dark$/, ""), b = r.endsWith("-dark") ? "dark" : r.endsWith("-light") ? "light" : null;
      if (b && T !== "light" && T !== "dark") {
        const A = y ? "dark" : "light";
        if (b !== A) {
          const R = `${T}-${A}`;
          console.log(`[Theme] Auto-switching from ${r} to ${R} (system preference)`), i(R);
        }
      }
    };
    return u.addEventListener ? u.addEventListener("change", d) : u.addListener(d), () => {
      u.removeEventListener ? u.removeEventListener("change", d) : u.removeListener(d);
    };
  }, [r, i]), {
    theme: r,
    showThemePicker: o,
    setShowThemePicker: n,
    themePickerRef: s,
    THEME_FAMILIES: c,
    setTheme: i
  };
}
function ge(t, a, e, o) {
  G(() => {
    if (!a) return;
    const n = (s) => {
      const r = s.target;
      t.current && t.current.contains(r) || o && r.closest(o) || e();
    };
    return document.addEventListener("mousedown", n), () => document.removeEventListener("mousedown", n);
  }, [t, a, e, o]);
}
function Ot() {
  const [t, a] = E(null), [e, o] = E(!1), [n, s] = E(!1), [r, i] = E(!1), [c, u] = E(null), [d, h] = E(""), [y, T] = E(null), [b, A] = E(null), [R, L] = E(""), [K, V] = E(null), [U, J] = E(null);
  return {
    confirmClearTag: t,
    setConfirmClearTag: a,
    showNewBoardDialog: e,
    setShowNewBoardDialog: o,
    showNewTagDialog: n,
    setShowNewTagDialog: s,
    showSettingsModal: r,
    setShowSettingsModal: i,
    editTagModal: c,
    setEditTagModal: u,
    editTagInput: d,
    setEditTagInput: h,
    boardContextMenu: y,
    setBoardContextMenu: T,
    tagContextMenu: b,
    setTagContextMenu: A,
    inputValue: R,
    setInputValue: L,
    validationError: K,
    setValidationError: V,
    pendingTaskOperation: U,
    setPendingTaskOperation: J
  };
}
const Ae = 768;
function Lt() {
  const [t, a] = E(() => typeof window > "u" ? !1 : window.innerWidth < Ae);
  return G(() => {
    if (typeof window > "u") return;
    const e = window.matchMedia(`(max-width: ${Ae - 1}px)`), o = (n) => {
      a(n.matches);
    };
    return e.addEventListener ? e.addEventListener("change", o) : e.addListener(o), o(e), () => {
      e.removeEventListener ? e.removeEventListener("change", o) : e.removeListener(o);
    };
  }, []), t;
}
function Pt({ isDarkTheme: t }) {
  return /* @__PURE__ */ l("div", { className: "task-app-loading", "data-dark-theme": t ? "true" : "false", children: /* @__PURE__ */ k("div", { className: "task-app-loading__skeleton", children: [
    /* @__PURE__ */ l("div", { className: "skeleton-header" }),
    /* @__PURE__ */ k("div", { className: "skeleton-boards", children: [
      /* @__PURE__ */ l("div", { className: "skeleton-board" }),
      /* @__PURE__ */ l("div", { className: "skeleton-board" }),
      /* @__PURE__ */ l("div", { className: "skeleton-board" })
    ] }),
    /* @__PURE__ */ l("div", { className: "skeleton-input" }),
    /* @__PURE__ */ k("div", { className: "skeleton-filters", children: [
      /* @__PURE__ */ l("div", { className: "skeleton-filter" }),
      /* @__PURE__ */ l("div", { className: "skeleton-filter" }),
      /* @__PURE__ */ l("div", { className: "skeleton-filter" })
    ] }),
    /* @__PURE__ */ k("div", { className: "skeleton-tasks", children: [
      /* @__PURE__ */ l("div", { className: "skeleton-task" }),
      /* @__PURE__ */ l("div", { className: "skeleton-task" }),
      /* @__PURE__ */ l("div", { className: "skeleton-task" })
    ] })
  ] }) });
}
function $t({
  theme: t,
  experimentalThemes: a,
  showThemePicker: e,
  onThemePickerToggle: o,
  onThemeChange: n,
  onSettingsClick: s,
  themePickerRef: r,
  THEME_FAMILIES: i
}) {
  return /* @__PURE__ */ k("div", { className: "task-app__header-container", children: [
    /* @__PURE__ */ l(
      "h1",
      {
        className: "task-app__header",
        onClick: s,
        style: { cursor: "pointer" },
        title: "Settings",
        children: "Tasks"
      }
    ),
    /* @__PURE__ */ k("div", { className: "theme-picker", ref: r, children: [
      /* @__PURE__ */ l(
        "button",
        {
          className: "theme-toggle-btn",
          onClick: o,
          "aria-label": "Choose theme",
          title: "Choose theme",
          children: Mt(t, a)
        }
      ),
      e && /* @__PURE__ */ k("div", { className: "theme-picker__dropdown", children: [
        /* @__PURE__ */ l("div", { className: "theme-picker__pills", children: i.map((c, u) => /* @__PURE__ */ k("div", { className: "theme-pill", children: [
          /* @__PURE__ */ l(
            "button",
            {
              className: `theme-pill__btn theme-pill__btn--light ${t === c.lightTheme ? "active" : ""}`,
              onClick: () => n(c.lightTheme),
              title: c.lightLabel,
              "aria-label": c.lightLabel,
              children: /* @__PURE__ */ l("div", { className: "theme-pill__icon", children: c.lightIcon })
            }
          ),
          /* @__PURE__ */ l(
            "button",
            {
              className: `theme-pill__btn theme-pill__btn--dark ${t === c.darkTheme ? "active" : ""}`,
              onClick: () => n(c.darkTheme),
              title: c.darkLabel,
              "aria-label": c.darkLabel,
              children: /* @__PURE__ */ l("div", { className: "theme-pill__icon", children: c.darkIcon })
            }
          )
        ] }, u)) }),
        /* @__PURE__ */ l(
          "button",
          {
            className: "theme-picker__settings-icon",
            onClick: () => {
              s(), o();
            },
            "aria-label": "Settings",
            title: "Settings",
            children: /* @__PURE__ */ l(Nt, {})
          }
        )
      ] })
    ] })
  ] });
}
function Fe({ onLongPress: t, delay: a = 500 }) {
  const e = re(null);
  return {
    onTouchStart: (r) => {
      const i = r.touches[0];
      e.current = window.setTimeout(() => {
        t(i.clientX, i.clientY);
      }, a);
    },
    onTouchEnd: () => {
      e.current && (clearTimeout(e.current), e.current = null);
    },
    onTouchMove: () => {
      e.current && (clearTimeout(e.current), e.current = null);
    }
  };
}
function me(t) {
  let a = [];
  try {
    const e = t.getData("application/x-hadoku-task-ids");
    e && (a = JSON.parse(e));
  } catch {
  }
  if (a.length === 0) {
    const e = t.getData("text/plain");
    e && (a = [e]);
  }
  return a;
}
function It({
  board: t,
  isActive: a,
  isDragOver: e,
  onSwitch: o,
  onContextMenu: n,
  onDragOverFilter: s,
  onMoveTasksToBoard: r,
  onClearSelection: i
}) {
  const c = Fe({
    onLongPress: (d, h) => n(t.id, d, h)
  }), u = t.id === "main";
  return /* @__PURE__ */ l(
    "button",
    {
      className: `board-btn ${a ? "board-btn--active" : ""} ${e ? "board-btn--drag-over" : ""}`,
      onClick: () => o(t.id),
      onContextMenu: (d) => {
        d.preventDefault(), !u && n(t.id, d.clientX, d.clientY);
      },
      ...u ? {} : c,
      "aria-pressed": a ? "true" : "false",
      onDragOver: (d) => {
        d.preventDefault(), d.dataTransfer.dropEffect = "move", s(`board:${t.id}`);
      },
      onDragLeave: (d) => {
        s(null);
      },
      onDrop: async (d) => {
        d.preventDefault(), s(null);
        const h = me(d.dataTransfer);
        if (h.length !== 0)
          try {
            await r(t.id, h);
            try {
              i();
            } catch {
            }
          } catch (y) {
            console.error("Failed moving tasks to board", y), alert(y.message || "Failed to move tasks");
          }
      },
      children: t.name
    }
  );
}
function Ft({
  boards: t,
  currentBoardId: a,
  userType: e,
  dragOverFilter: o,
  onBoardSwitch: n,
  onBoardContextMenu: s,
  onDragOverFilter: r,
  onMoveTasksToBoard: i,
  onClearSelection: c,
  onCreateBoardClick: u,
  onPendingOperation: d,
  onInitialLoad: h
}) {
  const [y, T] = E(!1), b = t && t.boards ? t.boards.slice(0, we) : [{ id: "main", name: "main", tasks: [], tags: [] }], A = !t || t.boards && t.boards.length < we, R = async (L) => {
    if (y) return;
    console.log("[BoardsSection] Manual refresh triggered"), T(!0);
    const K = L.currentTarget, V = new Promise((U, J) => {
      setTimeout(() => J(new Error("Sync timeout")), 5e3);
    });
    try {
      await Promise.race([h(), V]), console.log("[BoardsSection] Sync completed successfully");
    } catch (U) {
      console.error("[BoardsSection] Sync failed:", U);
    } finally {
      T(!1), K?.blur();
    }
  };
  return /* @__PURE__ */ k("div", { className: "task-app__boards", children: [
    /* @__PURE__ */ l("div", { className: "task-app__board-list", children: b.map((L) => /* @__PURE__ */ l(
      It,
      {
        board: L,
        isActive: a === L.id,
        isDragOver: o === `board:${L.id}`,
        onSwitch: n,
        onContextMenu: s,
        onDragOverFilter: r,
        onMoveTasksToBoard: i,
        onClearSelection: c
      },
      L.id
    )) }),
    /* @__PURE__ */ k("div", { className: "task-app__board-actions", children: [
      A && /* @__PURE__ */ l(
        "button",
        {
          className: `board-add-btn ${o === "add-board" ? "board-btn--drag-over" : ""}`,
          onClick: u,
          onDragOver: (L) => {
            L.preventDefault(), L.dataTransfer.dropEffect = "move", r("add-board");
          },
          onDragLeave: () => r(null),
          onDrop: (L) => {
            L.preventDefault(), r(null);
            const K = me(L.dataTransfer);
            K.length > 0 && (d({ type: "move-to-board", taskIds: K }), u());
          },
          "aria-label": "Create board",
          children: "＋"
        }
      ),
      e !== "public" && /* @__PURE__ */ l(
        "button",
        {
          className: `sync-btn ${y ? "spinning" : ""}`,
          onClick: R,
          disabled: y,
          title: "Sync from server",
          "aria-label": "Sync from server",
          children: /* @__PURE__ */ k("svg", { width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [
            /* @__PURE__ */ l("polyline", { points: "23 4 23 10 17 10" }),
            /* @__PURE__ */ l("polyline", { points: "1 20 1 14 7 14" }),
            /* @__PURE__ */ l("path", { d: "M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" })
          ] })
        }
      )
    ] })
  ] });
}
function Rt({
  tag: t,
  isActive: a,
  isDragOver: e,
  onToggle: o,
  onContextMenu: n,
  onDragOver: s,
  onDragLeave: r,
  onDrop: i
}) {
  const c = Fe({
    onLongPress: (u, d) => n(t, u, d)
  });
  return /* @__PURE__ */ k(
    "button",
    {
      onClick: () => o(t),
      onContextMenu: (u) => {
        u.preventDefault(), n(t, u.clientX, u.clientY);
      },
      ...c,
      className: `${a ? "on" : ""} ${e ? "task-app__filter-drag-over" : ""}`,
      onDragOver: (u) => s(u, t),
      onDragLeave: r,
      onDrop: (u) => i(u, t),
      children: [
        "#",
        t
      ]
    }
  );
}
function Kt({
  tags: t,
  selectedFilters: a,
  dragOverFilter: e,
  onToggleFilter: o,
  onTagContextMenu: n,
  onDragOver: s,
  onDragLeave: r,
  onDrop: i,
  onCreateTagClick: c,
  onPendingOperation: u
}) {
  const d = (h) => {
    h.preventDefault(), r(h);
    const y = me(h.dataTransfer);
    y.length > 0 && (u({ type: "apply-tag", taskIds: y }), c());
  };
  return /* @__PURE__ */ k("div", { className: "task-app__filters", children: [
    t.map((h) => /* @__PURE__ */ l(
      Rt,
      {
        tag: h,
        isActive: a.has(h),
        isDragOver: e === h,
        onToggle: o,
        onContextMenu: n,
        onDragOver: s,
        onDragLeave: r,
        onDrop: i
      },
      h
    )),
    /* @__PURE__ */ l(
      "button",
      {
        className: `task-app__filter-add ${e === "add-tag" ? "task-app__filter-drag-over" : ""}`,
        onClick: c,
        onDragOver: (h) => {
          h.preventDefault(), h.dataTransfer.dropEffect = "copy", s(h, "add-tag");
        },
        onDragLeave: r,
        onDrop: d,
        "aria-label": "Add tag",
        children: "＋"
      }
    )
  ] });
}
function Ut(t) {
  const a = /* @__PURE__ */ new Date(), e = new Date(t), o = a.getTime() - e.getTime(), n = Math.floor(o / 1e3), s = Math.floor(n / 60), r = Math.floor(s / 60), i = Math.floor(r / 24);
  return n < 60 ? `${n}s ago` : s < 60 ? `${s}m ago` : r < 24 ? `${r}h ago` : `${i}d ago`;
}
function he({
  task: t,
  isDraggable: a = !0,
  pendingOperations: e,
  onComplete: o,
  onDelete: n,
  onEditTag: s,
  onDragStart: r,
  onDragEnd: i,
  selected: c = !1,
  showCompleteButton: u = !0,
  showDeleteButton: d = !0,
  showTagButton: h = !1
}) {
  const y = e.has(`complete-${t.id}`), T = e.has(`delete-${t.id}`);
  return /* @__PURE__ */ k(
    "li",
    {
      className: `task-app__item ${c ? "selected" : ""}`,
      "data-task-id": t.id,
      draggable: a,
      onDragStart: r ? (b) => r(b, t.id) : void 0,
      onDragEnd: (b) => {
        if (b.currentTarget.classList.remove("dragging"), i)
          try {
            i(b);
          } catch {
          }
      },
      children: [
        /* @__PURE__ */ k("div", { className: "task-app__item-content", children: [
          /* @__PURE__ */ l("div", { className: "task-app__item-title", title: t.title, children: t.title }),
          /* @__PURE__ */ k("div", { className: "task-app__item-meta-row", children: [
            t.tag ? /* @__PURE__ */ l("div", { className: "task-app__item-tag", children: t.tag.split(" ").sort().map((b) => `#${b}`).join(" ") }) : /* @__PURE__ */ l("div", {}),
            /* @__PURE__ */ l("div", { className: "task-app__item-age", children: Ut(t.createdAt) })
          ] })
        ] }),
        /* @__PURE__ */ k("div", { className: "task-app__item-actions", children: [
          h && /* @__PURE__ */ l(
            "button",
            {
              className: "task-app__action-btn task-app__edit-tag-btn",
              onClick: () => s(t.id),
              title: "Edit tags",
              disabled: y || T,
              children: /* @__PURE__ */ l(At, {})
            }
          ),
          u && /* @__PURE__ */ l(
            "button",
            {
              className: "task-app__action-btn task-app__complete-btn",
              onClick: () => o(t.id),
              title: "Complete task",
              disabled: y || T,
              children: y ? "⏳" : "✓"
            }
          ),
          d && /* @__PURE__ */ l(
            "button",
            {
              className: "task-app__action-btn task-app__delete-btn",
              onClick: () => n(t.id),
              title: "Delete task",
              disabled: y || T,
              children: T ? "⏳" : "×"
            }
          )
        ] })
      ]
    }
  );
}
function Ee(t, a = !1) {
  if (t === 0)
    return { useTags: 0, maxPerColumn: 1 / 0, rows: [] };
  if (a) {
    const e = Array.from({ length: t }, (o, n) => ({
      columns: 1,
      tagIndices: [n]
    }));
    return {
      useTags: t,
      maxPerColumn: 1 / 0,
      rows: e
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
function Ht({
  tasks: t,
  topTags: a,
  isMobile: e = !1,
  filters: o,
  sortDirections: n,
  dragOverTag: s,
  pendingOperations: r,
  onComplete: i,
  onDelete: c,
  onEditTag: u,
  onDragStart: d,
  onDragEnd: h,
  selectedIds: y,
  onSelectionStart: T,
  onSelectionMove: b,
  onSelectionEnd: A,
  onDragOver: R,
  onDragLeave: L,
  onDrop: K,
  toggleSort: V,
  sortTasksByAge: U,
  getSortIcon: J,
  getSortTitle: q,
  deleteTag: te,
  onDeletePersistedTag: j,
  showCompleteButton: Q = !0,
  showDeleteButton: Y = !0,
  showTagButton: m = !1
}) {
  const S = (w, I) => /* @__PURE__ */ k(
    "div",
    {
      className: `task-app__tag-column ${s === w ? "task-app__tag-column--drag-over" : ""}`,
      onDragOver: (M) => R(M, w),
      onDragLeave: L,
      onDrop: (M) => K(M, w),
      children: [
        /* @__PURE__ */ k("div", { className: "task-app__tag-header-row", children: [
          /* @__PURE__ */ k("h3", { className: "task-app__tag-header", children: [
            "#",
            w
          ] }),
          /* @__PURE__ */ l(
            "button",
            {
              className: "task-app__sort-btn task-app__sort-btn--active",
              onClick: () => V(w),
              title: q(n[w] || "desc"),
              children: J(n[w] || "desc")
            }
          )
        ] }),
        /* @__PURE__ */ l("ul", { className: "task-app__list task-app__list--column", children: U(I, n[w] || "desc").map((M) => /* @__PURE__ */ l(
          he,
          {
            task: M,
            isDraggable: !0,
            pendingOperations: r,
            onComplete: i,
            onDelete: c,
            onEditTag: u,
            onDragStart: d,
            onDragEnd: h,
            selected: y ? y.has(M.id) : !1,
            showCompleteButton: Q,
            showDeleteButton: Y,
            showTagButton: m
          },
          M.id
        )) })
      ]
    },
    w
  ), g = (w, I) => {
    let M = Te(t, w);
    return v && (M = M.filter((F) => {
      const D = F.tag?.split(" ") || [];
      return o.some((ee) => D.includes(ee));
    })), M.slice(0, I);
  }, f = a.length, v = Array.isArray(o) && o.length > 0, x = t.filter((w) => {
    if (!v) return !0;
    const I = w.tag?.split(" ") || [];
    return o.some((M) => I.includes(M));
  }), N = Ee(f, e), B = v ? a.filter((w) => Te(t, w).some((M) => {
    const F = M.tag?.split(" ") || [];
    return o.some((D) => F.includes(D));
  })) : a.slice(0, N.useTags);
  if (B.length === 0)
    return /* @__PURE__ */ l("ul", { className: "task-app__list", children: x.map((w) => /* @__PURE__ */ l(
      he,
      {
        task: w,
        pendingOperations: r,
        onComplete: i,
        onDelete: c,
        onEditTag: u,
        onDragStart: d,
        onDragEnd: h,
        selected: y ? y.has(w.id) : !1,
        showCompleteButton: Q,
        showDeleteButton: Y,
        showTagButton: m
      },
      w.id
    )) });
  const O = kt(t, a, o).filter((w) => {
    if (!v) return !0;
    const I = w.tag?.split(" ") || [];
    return o.some((M) => I.includes(M));
  }), P = Ee(B.length, e);
  return /* @__PURE__ */ k("div", { className: "task-app__dynamic-layout", children: [
    P.rows.length > 0 && /* @__PURE__ */ l(Ge, { children: P.rows.map((w, I) => /* @__PURE__ */ l("div", { className: `task-app__tag-grid task-app__tag-grid--${w.columns}col`, children: w.tagIndices.map((M) => {
      const F = B[M];
      return F ? S(F, g(F, P.maxPerColumn)) : null;
    }) }, I)) }),
    O.length > 0 && /* @__PURE__ */ k(
      "div",
      {
        className: `task-app__remaining ${s === "other" ? "task-app__tag-column--drag-over" : ""}`,
        onDragOver: (w) => {
          w.preventDefault(), w.dataTransfer.dropEffect = "move", R(w, "other");
        },
        onDragLeave: (w) => L(w),
        onDrop: (w) => K(w, "other"),
        children: [
          /* @__PURE__ */ k("div", { className: "task-app__tag-header-row", children: [
            /* @__PURE__ */ l("h3", { className: "task-app__remaining-header", children: "Other Tasks" }),
            /* @__PURE__ */ l(
              "button",
              {
                className: "task-app__sort-btn task-app__sort-btn--active",
                onClick: () => V("other"),
                title: q(n.other || "desc"),
                children: J(n.other || "desc")
              }
            )
          ] }),
          /* @__PURE__ */ l("ul", { className: "task-app__list", children: U(O, n.other || "desc").map((w) => /* @__PURE__ */ l(
            he,
            {
              task: w,
              pendingOperations: r,
              onComplete: i,
              onDelete: c,
              onEditTag: u,
              onDragStart: d,
              onDragEnd: h,
              selected: y ? y.has(w.id) : !1,
              showCompleteButton: Q,
              showDeleteButton: Y,
              showTagButton: m
            },
            w.id
          )) })
        ]
      }
    )
  ] });
}
function le({
  isOpen: t,
  title: a,
  onClose: e,
  onConfirm: o,
  children: n,
  inputValue: s,
  onInputChange: r,
  inputPlaceholder: i,
  confirmLabel: c = "Confirm",
  cancelLabel: u = "Cancel",
  confirmDisabled: d = !1,
  confirmDanger: h = !1
}) {
  return t ? /* @__PURE__ */ l(
    "div",
    {
      className: "modal-overlay",
      onClick: e,
      children: /* @__PURE__ */ k(
        "div",
        {
          className: "modal-card",
          onClick: (T) => T.stopPropagation(),
          children: [
            /* @__PURE__ */ l("h3", { children: a }),
            n,
            r && /* @__PURE__ */ l(
              "input",
              {
                type: "text",
                className: "modal-input",
                value: s || "",
                onChange: (T) => r(T.target.value),
                placeholder: i,
                autoFocus: !0,
                onKeyDown: (T) => {
                  T.key === "Enter" && !d && (T.preventDefault(), o()), T.key === "Escape" && (T.preventDefault(), e());
                }
              }
            ),
            /* @__PURE__ */ k("div", { className: "modal-actions", children: [
              /* @__PURE__ */ l(
                "button",
                {
                  className: "modal-button",
                  onClick: e,
                  children: u
                }
              ),
              /* @__PURE__ */ l(
                "button",
                {
                  className: `modal-button ${h ? "modal-button--danger" : "modal-button--primary"}`,
                  onClick: o,
                  disabled: d,
                  children: c
                }
              )
            ] })
          ]
        }
      )
    }
  ) : null;
}
function Jt({ tag: t, count: a, isOpen: e, onClose: o, onConfirm: n }) {
  const s = async () => {
    t && (await n(t), o());
  };
  return /* @__PURE__ */ l(
    le,
    {
      isOpen: e,
      title: `Clear Tag #${t}?`,
      onClose: o,
      onConfirm: s,
      confirmLabel: "Clear Tag",
      confirmDanger: !0,
      children: t && /* @__PURE__ */ k("p", { children: [
        "This will remove ",
        /* @__PURE__ */ k("strong", { children: [
          "#",
          t
        ] }),
        " from",
        " ",
        /* @__PURE__ */ k("strong", { children: [
          a,
          " task(s)"
        ] }),
        " and delete the tag from the board."
      ] })
    }
  );
}
function Wt({
  isOpen: t,
  inputValue: a,
  validationError: e,
  pendingTaskOperation: o,
  onClose: n,
  onConfirm: s,
  onInputChange: r,
  validateBoardName: i
}) {
  const c = async () => {
    !a.trim() || i(a) || await s(a);
  }, u = !a.trim() || i(a) !== null;
  return /* @__PURE__ */ k(
    le,
    {
      isOpen: t,
      title: "Create New Board",
      onClose: n,
      onConfirm: c,
      inputValue: a,
      onInputChange: r,
      inputPlaceholder: "Board name",
      confirmLabel: "Create",
      confirmDisabled: u,
      children: [
        o?.type === "move-to-board" && o.taskIds.length > 0 && /* @__PURE__ */ k("p", { className: "modal-hint", children: [
          o.taskIds.length,
          " task",
          o.taskIds.length > 1 ? "s" : "",
          " will be moved to this board"
        ] }),
        e && /* @__PURE__ */ l("p", { className: "modal-error", style: { color: "var(--error-color, #d32f2f)", marginTop: "0.5rem" }, children: e })
      ]
    }
  );
}
function Vt({
  isOpen: t,
  inputValue: a,
  tasks: e,
  pendingTaskOperation: o,
  onClose: n,
  onConfirm: s,
  onInputChange: r
}) {
  const i = async () => {
    if (a.trim())
      try {
        await s(a);
      } catch (u) {
        console.error("[CreateTagModal] Failed to create tag:", u);
      }
  }, c = Pe(e);
  return /* @__PURE__ */ k(
    le,
    {
      isOpen: t,
      title: "Create New Tag",
      onClose: n,
      onConfirm: i,
      inputValue: a,
      onInputChange: r,
      inputPlaceholder: "Enter new tag name",
      confirmLabel: "Create",
      confirmDisabled: !a.trim(),
      children: [
        o?.type === "apply-tag" && o.taskIds.length > 0 && /* @__PURE__ */ k("p", { className: "modal-hint", children: [
          "This tag will be applied to ",
          o.taskIds.length,
          " task",
          o.taskIds.length > 1 ? "s" : ""
        ] }),
        c.length > 0 && /* @__PURE__ */ k("div", { className: "modal-section", children: [
          /* @__PURE__ */ l("label", { className: "modal-label", children: "Existing tags:" }),
          /* @__PURE__ */ l("div", { className: "modal-tags-list", children: c.map((u) => /* @__PURE__ */ k("span", { className: "modal-tag-chip", children: [
            "#",
            u
          ] }, u)) })
        ] })
      ]
    }
  );
}
async function jt(t, a) {
  const e = t.trim();
  if (!e)
    return { success: !1, error: "Key cannot be empty" };
  try {
    if (await a(e)) {
      const n = new URL(window.location.href);
      return n.searchParams.set("key", e), window.location.href = n.toString(), { success: !0 };
    } else
      return { success: !1, error: "Invalid key" };
  } catch (o) {
    return console.error("[Auth] Key validation failed:", o), { success: !1, error: "Failed to validate key" };
  }
}
function qt({
  isOpen: t,
  preferences: a,
  showCompleteButton: e,
  showDeleteButton: o,
  showTagButton: n,
  onClose: s,
  onSavePreferences: r,
  onValidateKey: i
}) {
  const [c, u] = E(""), [d, h] = E(null), [y, T] = E(!1), b = async () => {
    if (!c.trim() || y) return;
    T(!0), h(null);
    const A = await jt(c, i);
    A.success || (h(A.error || "Failed to validate key"), T(!1));
  };
  return /* @__PURE__ */ k(
    le,
    {
      isOpen: t,
      title: "Settings",
      onClose: s,
      onConfirm: s,
      confirmLabel: "Close",
      cancelLabel: "Close",
      children: [
        /* @__PURE__ */ k("div", { className: "settings-section", children: [
          /* @__PURE__ */ l("h4", { className: "settings-section-title", children: "User Management" }),
          /* @__PURE__ */ k("div", { className: "settings-field", children: [
            /* @__PURE__ */ l("label", { className: "settings-field-label", children: "Enter New Key" }),
            /* @__PURE__ */ k("div", { className: "settings-field-input-group", children: [
              /* @__PURE__ */ l(
                "input",
                {
                  type: "password",
                  name: "key",
                  autoComplete: "key",
                  className: "settings-text-input",
                  value: c,
                  onChange: (A) => {
                    u(A.target.value), h(null);
                  },
                  onKeyDown: (A) => {
                    A.key === "Enter" && c && !y && b();
                  },
                  placeholder: "Enter authentication key",
                  disabled: y
                }
              ),
              c && /* @__PURE__ */ l(
                "button",
                {
                  className: "settings-field-button",
                  onClick: b,
                  disabled: y,
                  children: y ? /* @__PURE__ */ l("span", { className: "spinner" }) : "↵"
                }
              )
            ] }),
            d && /* @__PURE__ */ l("span", { className: "settings-error", children: d })
          ] })
        ] }),
        /* @__PURE__ */ k("div", { className: "settings-section", children: [
          /* @__PURE__ */ l("h4", { className: "settings-section-title", children: "Preferences" }),
          /* @__PURE__ */ k("label", { className: "settings-option", children: [
            /* @__PURE__ */ l(
              "input",
              {
                type: "checkbox",
                checked: a.experimentalThemes || !1,
                onChange: (A) => {
                  r({ experimentalThemes: A.target.checked });
                }
              }
            ),
            /* @__PURE__ */ k("span", { className: "settings-label", children: [
              /* @__PURE__ */ l("strong", { children: "Experimental Themes" }),
              /* @__PURE__ */ l("span", { className: "settings-description", children: "Enable access to experimental theme options" })
            ] })
          ] }),
          /* @__PURE__ */ k("label", { className: "settings-option", children: [
            /* @__PURE__ */ l(
              "input",
              {
                type: "checkbox",
                checked: a.alwaysVerticalLayout || !1,
                onChange: (A) => {
                  r({ alwaysVerticalLayout: A.target.checked });
                }
              }
            ),
            /* @__PURE__ */ k("span", { className: "settings-label", children: [
              /* @__PURE__ */ l("strong", { children: "Always Use Vertical Layout" }),
              /* @__PURE__ */ l("span", { className: "settings-description", children: "Use mobile-style vertical task layout on all devices" })
            ] })
          ] }),
          /* @__PURE__ */ k("label", { className: "settings-option", children: [
            /* @__PURE__ */ l(
              "input",
              {
                type: "checkbox",
                checked: !e,
                onChange: (A) => {
                  r({ showCompleteButton: !A.target.checked });
                }
              }
            ),
            /* @__PURE__ */ k("span", { className: "settings-label", children: [
              /* @__PURE__ */ l("strong", { children: "Disable Complete Button" }),
              /* @__PURE__ */ l("span", { className: "settings-description", children: "Hide the checkmark (✓) button on task items" })
            ] })
          ] }),
          /* @__PURE__ */ k("label", { className: "settings-option", children: [
            /* @__PURE__ */ l(
              "input",
              {
                type: "checkbox",
                checked: !o,
                onChange: (A) => {
                  r({ showDeleteButton: !A.target.checked });
                }
              }
            ),
            /* @__PURE__ */ k("span", { className: "settings-label", children: [
              /* @__PURE__ */ l("strong", { children: "Disable Delete Button" }),
              /* @__PURE__ */ l("span", { className: "settings-description", children: "Hide the delete (×) button on task items" })
            ] })
          ] }),
          /* @__PURE__ */ k("label", { className: "settings-option", children: [
            /* @__PURE__ */ l(
              "input",
              {
                type: "checkbox",
                checked: n,
                onChange: (A) => {
                  r({ showTagButton: A.target.checked });
                }
              }
            ),
            /* @__PURE__ */ k("span", { className: "settings-label", children: [
              /* @__PURE__ */ l("strong", { children: "Enable Tag Button" }),
              /* @__PURE__ */ l("span", { className: "settings-description", children: "Show tag button on task items" })
            ] })
          ] })
        ] })
      ]
    }
  );
}
function Xt({
  isOpen: t,
  taskId: a,
  currentTag: e,
  editTagInput: o,
  boards: n,
  currentBoardId: s,
  onClose: r,
  onConfirm: i,
  onInputChange: c,
  onToggleTagPill: u
}) {
  const h = n?.boards?.find((b) => b.id === s)?.tags || [], y = e?.split(" ").filter(Boolean) || [], T = (b) => {
    b.key === "Enter" && (b.preventDefault(), i());
  };
  return /* @__PURE__ */ l(
    le,
    {
      isOpen: t,
      title: "Edit Tags",
      onClose: r,
      onConfirm: i,
      confirmLabel: "Save",
      cancelLabel: "Cancel",
      children: /* @__PURE__ */ k("div", { className: "edit-tag-modal", children: [
        h.length > 0 && /* @__PURE__ */ k("div", { className: "edit-tag-pills", children: [
          /* @__PURE__ */ l("label", { className: "edit-tag-label", children: "Select Tags" }),
          /* @__PURE__ */ l("div", { className: "edit-tag-pills-container", children: [...h].sort().map((b) => {
            const A = y.includes(b);
            return /* @__PURE__ */ k(
              "button",
              {
                className: `edit-tag-pill ${A ? "active" : ""}`,
                onClick: () => u(b),
                type: "button",
                children: [
                  "#",
                  b
                ]
              },
              b
            );
          }) })
        ] }),
        /* @__PURE__ */ k("div", { className: "edit-tag-field", children: [
          /* @__PURE__ */ l("label", { className: "edit-tag-label", children: "Add New Tag" }),
          /* @__PURE__ */ l(
            "input",
            {
              type: "text",
              className: "edit-tag-input",
              value: o,
              onChange: (b) => c(b.target.value),
              onKeyDown: T,
              placeholder: "Enter a tag",
              autoFocus: !0
            }
          ),
          /* @__PURE__ */ k("div", { className: "edit-tag-hint", children: [
            /* @__PURE__ */ l("div", { children: '"one tag" → #one-tag' }),
            /* @__PURE__ */ l("div", { children: '"#two #tags" → #two #tags' })
          ] })
        ] })
      ] })
    }
  );
}
function Re({ isOpen: t, x: a, y: e, items: o, className: n = "board-context-menu" }) {
  return t ? /* @__PURE__ */ l(
    "div",
    {
      className: n,
      style: {
        left: `${a}px`,
        top: `${e}px`
      },
      children: o.map((s, r) => /* @__PURE__ */ l(
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
function zt({
  isOpen: t,
  boardId: a,
  x: e,
  y: o,
  boards: n,
  onClose: s,
  onDeleteBoard: r
}) {
  return /* @__PURE__ */ l(
    Re,
    {
      isOpen: t,
      x: e,
      y: o,
      items: [
        {
          label: "🗑️ Delete Board",
          isDanger: !0,
          onClick: async () => {
            if (!a) return;
            const c = n?.boards?.find((u) => u.id === a)?.name || a;
            if (confirm(`Delete board "${c}"? All tasks on this board will be permanently deleted.`))
              try {
                await r(a), s();
              } catch (u) {
                console.error("[BoardContextMenu] Failed to delete board:", u), alert(u.message || "Failed to delete board");
              }
          }
        }
      ]
    }
  );
}
function Yt({
  isOpen: t,
  tag: a,
  x: e,
  y: o,
  onClose: n,
  onDeleteTag: s
}) {
  return /* @__PURE__ */ l(
    Re,
    {
      isOpen: t,
      x: e,
      y: o,
      className: "tag-context-menu",
      items: [
        {
          label: "🗑️ Delete Tag",
          isDanger: !0,
          onClick: async () => {
            if (console.log("[TagContextMenu] Delete Tag clicked!", { tag: a }), !a) {
              console.error("[TagContextMenu] No tag when Delete clicked!");
              return;
            }
            try {
              console.log("[TagContextMenu] Calling deleteTag for tag:", a), await s(a), console.log("[TagContextMenu] deleteTag completed successfully"), n();
            } catch (i) {
              console.error("[TagContextMenu] Failed to delete tag:", i), alert(i.message || "Failed to delete tag");
            }
          }
        }
      ]
    }
  );
}
const Me = [
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
function Gt() {
  return Me[Math.floor(Math.random() * Me.length)];
}
function Zt(t, a) {
  const e = t.trim();
  return e ? a.map((n) => n.id.toLowerCase()).includes(e.toLowerCase()) ? `Board "${e}" already exists` : null : "Board name cannot be empty";
}
function Qt(t = {}) {
  const { userType: a = "public", userId: e = "public", sessionId: o } = t, n = re(null), s = re(null), r = Lt(), [i] = E(() => Gt()), [c, u] = E(/* @__PURE__ */ new Set()), { preferences: d, savePreferences: h, preferencesLoaded: y, isDarkTheme: T } = Bt(a, e, o), { theme: b, showThemePicker: A, setShowThemePicker: R, themePickerRef: L, THEME_FAMILIES: K, setTheme: V } = _t(d, h, s), U = r || d.alwaysVerticalLayout || !1, J = d.showCompleteButton ?? !0, q = d.showDeleteButton ?? !0, te = d.showTagButton ?? !1, {
    tasks: j,
    pendingOperations: Q,
    initialLoad: Y,
    addTask: m,
    completeTask: S,
    deleteTask: g,
    updateTaskTags: f,
    bulkUpdateTaskTags: v,
    deleteTag: x,
    boards: N,
    currentBoardId: B,
    createBoard: O,
    deleteBoard: P,
    switchBoard: w,
    moveTasksToBoard: I,
    createTagOnBoard: M,
    deleteTagOnBoard: F
  } = Tt({ userType: a, userId: e, sessionId: o }), D = yt({
    tasks: j,
    onTaskUpdate: f,
    onBulkUpdate: v
  }), ee = wt(), p = Ot();
  ge(L, A, () => R(!1)), ge(
    { current: null },
    // Board context menu doesn't need a ref
    !!p.boardContextMenu,
    () => p.setBoardContextMenu(null),
    ".board-context-menu"
  ), ge(
    { current: null },
    // Tag context menu doesn't need a ref
    !!p.tagContextMenu,
    () => p.setTagContextMenu(null),
    ".tag-context-menu"
  ), G(() => {
    u(/* @__PURE__ */ new Set());
  }, [B]), G(() => {
    console.log("[App] User context changed, initializing...", { userType: a, userId: e }), Y(), n.current?.focus();
  }, [a, e]);
  const Ke = async (C) => {
    await m(C) && n.current && (n.current.value = "", n.current.focus());
  }, Ue = (C) => {
    const _ = j.filter(($) => $.tag?.split(" ").includes(C));
    p.setConfirmClearTag({ tag: C, count: _.length });
  }, He = async (C) => {
    const _ = C.trim().replace(/\s+/g, "-");
    try {
      if (await M(_), p.pendingTaskOperation?.type === "apply-tag" && p.pendingTaskOperation.taskIds.length > 0) {
        const $ = p.pendingTaskOperation.taskIds.map((X) => {
          const ae = j.find((Ye) => Ye.id === X)?.tag?.split(" ").filter(Boolean) || [], ne = [.../* @__PURE__ */ new Set([...ae, _])];
          return { taskId: X, tag: ne.join(" ") };
        });
        await v($), D.clearSelection();
      }
      p.setPendingTaskOperation(null), p.setShowNewTagDialog(!1), p.setInputValue("");
    } catch ($) {
      throw console.error("[App] Failed to create tag:", $), $;
    }
  }, Je = (C) => {
    const _ = j.find(($) => $.id === C);
    _ && (p.setEditTagModal({ taskId: C, currentTag: _.tag || null }), p.setEditTagInput(""));
  }, We = async () => {
    if (!p.editTagModal) return;
    const { taskId: C, currentTag: _ } = p.editTagModal, $ = _?.split(" ").filter(Boolean) || [], X = p.editTagInput.trim() ? p.editTagInput.trim().replace(/\s+/g, "-").split("#").filter(Boolean).map((ne) => ne.trim()) : [];
    for (const ne of X)
      await M(ne);
    const ae = [.../* @__PURE__ */ new Set([...$, ...X])].sort().join(" ");
    await f(C, { tag: ae }), p.setEditTagModal(null), p.setEditTagInput("");
  }, Ve = (C) => {
    if (!p.editTagModal) return;
    const { taskId: _, currentTag: $ } = p.editTagModal, X = $?.split(" ").filter(Boolean) || [];
    if (X.includes(C)) {
      const ae = X.filter((ne) => ne !== C).sort().join(" ");
      p.setEditTagModal({ taskId: _, currentTag: ae });
    } else {
      const ae = [...X, C].sort().join(" ");
      p.setEditTagModal({ taskId: _, currentTag: ae });
    }
  }, fe = (C) => Zt(C, N?.boards || []), je = async (C) => {
    const _ = C.trim(), $ = fe(_);
    if ($) {
      p.setValidationError($);
      return;
    }
    try {
      await O(_), p.pendingTaskOperation?.type === "move-to-board" && p.pendingTaskOperation.taskIds.length > 0 && (await I(_, p.pendingTaskOperation.taskIds), D.clearSelection()), p.setPendingTaskOperation(null), p.setValidationError(null), p.setShowNewBoardDialog(!1), p.setInputValue("");
    } catch (X) {
      console.error("[App] Failed to create board:", X), p.setValidationError(X.message || "Failed to create board");
    }
  }, qe = N?.boards?.find((C) => C.id === B)?.tags || [], Xe = Array.from(/* @__PURE__ */ new Set([...qe, ...Pe(j)])), ze = ft(j, U ? 3 : 6);
  return y ? /* @__PURE__ */ l(
    "div",
    {
      ref: s,
      className: "task-app-container task-app-fade-in",
      "data-dark-theme": T ? "true" : "false",
      onMouseDown: D.selectionStartHandler,
      onMouseMove: D.selectionMoveHandler,
      onMouseUp: D.selectionEndHandler,
      onMouseLeave: D.selectionEndHandler,
      onClick: (C) => {
        try {
          const _ = C.target;
          if (!_.closest || !_.closest(".task-app__item")) {
            if (D.selectionJustEndedAt && Date.now() - D.selectionJustEndedAt < vt)
              return;
            D.clearSelection();
          }
        } catch {
        }
      },
      children: /* @__PURE__ */ k("div", { className: "task-app", children: [
        /* @__PURE__ */ l(
          $t,
          {
            theme: b,
            experimentalThemes: d.experimentalThemes || !1,
            showThemePicker: A,
            onThemePickerToggle: () => R(!A),
            onThemeChange: V,
            onSettingsClick: () => p.setShowSettingsModal(!0),
            themePickerRef: L,
            THEME_FAMILIES: K
          }
        ),
        /* @__PURE__ */ l(
          Ft,
          {
            boards: N,
            currentBoardId: B,
            userType: a,
            dragOverFilter: D.dragOverFilter,
            onBoardSwitch: w,
            onBoardContextMenu: (C, _, $) => p.setBoardContextMenu({ boardId: C, x: _, y: $ }),
            onDragOverFilter: D.setDragOverFilter,
            onMoveTasksToBoard: I,
            onClearSelection: D.clearSelection,
            onCreateBoardClick: () => {
              p.setInputValue(""), p.setValidationError(null), p.setShowNewBoardDialog(!0);
            },
            onPendingOperation: p.setPendingTaskOperation,
            onInitialLoad: Y
          }
        ),
        /* @__PURE__ */ l("div", { className: "task-app__controls", children: /* @__PURE__ */ l(
          "input",
          {
            ref: n,
            className: "task-app__input",
            placeholder: i,
            onKeyDown: (C) => {
              C.key === "Enter" && !C.shiftKey && (C.preventDefault(), Ke(C.target.value)), C.key === "k" && (C.ctrlKey || C.metaKey) && (C.preventDefault(), n.current?.focus());
            }
          }
        ) }),
        /* @__PURE__ */ l(
          Kt,
          {
            tags: Xe,
            selectedFilters: c,
            dragOverFilter: D.dragOverFilter,
            onToggleFilter: (C) => {
              u((_) => {
                const $ = new Set(_);
                return $.has(C) ? $.delete(C) : $.add(C), $;
              });
            },
            onTagContextMenu: (C, _, $) => p.setTagContextMenu({ tag: C, x: _, y: $ }),
            onDragOver: D.onFilterDragOver,
            onDragLeave: D.onFilterDragLeave,
            onDrop: D.onFilterDrop,
            onCreateTagClick: () => {
              p.setInputValue(""), p.setShowNewTagDialog(!0);
            },
            onPendingOperation: p.setPendingTaskOperation
          }
        ),
        /* @__PURE__ */ l(
          Ht,
          {
            tasks: j,
            topTags: ze,
            isMobile: U,
            filters: Array.from(c),
            selectedIds: D.selectedIds,
            onSelectionStart: D.selectionStartHandler,
            onSelectionMove: D.selectionMoveHandler,
            onSelectionEnd: D.selectionEndHandler,
            sortDirections: ee.sortDirections,
            dragOverTag: D.dragOverTag,
            pendingOperations: Q,
            onComplete: S,
            onDelete: g,
            onEditTag: Je,
            onDragStart: D.onDragStart,
            onDragEnd: D.onDragEnd,
            onDragOver: D.onDragOver,
            onDragLeave: D.onDragLeave,
            onDrop: D.onDrop,
            toggleSort: ee.toggleSort,
            sortTasksByAge: ee.sortTasksByAge,
            getSortIcon: ee.getSortIcon,
            getSortTitle: ee.getSortTitle,
            deleteTag: Ue,
            onDeletePersistedTag: F,
            showCompleteButton: J,
            showDeleteButton: q,
            showTagButton: te
          }
        ),
        D.isSelecting && D.marqueeRect && /* @__PURE__ */ l(
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
        /* @__PURE__ */ l(
          Jt,
          {
            tag: p.confirmClearTag?.tag || null,
            count: p.confirmClearTag?.count || 0,
            isOpen: !!p.confirmClearTag,
            onClose: () => p.setConfirmClearTag(null),
            onConfirm: x
          }
        ),
        /* @__PURE__ */ l(
          Wt,
          {
            isOpen: p.showNewBoardDialog,
            inputValue: p.inputValue,
            validationError: p.validationError,
            pendingTaskOperation: p.pendingTaskOperation,
            onClose: () => {
              p.setShowNewBoardDialog(!1), p.setPendingTaskOperation(null), p.setValidationError(null);
            },
            onConfirm: je,
            onInputChange: (C) => {
              p.setInputValue(C), p.setValidationError(null);
            },
            validateBoardName: fe
          }
        ),
        /* @__PURE__ */ l(
          Vt,
          {
            isOpen: p.showNewTagDialog,
            inputValue: p.inputValue,
            tasks: j,
            pendingTaskOperation: p.pendingTaskOperation,
            onClose: () => {
              p.setShowNewTagDialog(!1), p.setPendingTaskOperation(null);
            },
            onConfirm: He,
            onInputChange: p.setInputValue
          }
        ),
        /* @__PURE__ */ l(
          qt,
          {
            isOpen: p.showSettingsModal,
            preferences: d,
            showCompleteButton: J,
            showDeleteButton: q,
            showTagButton: te,
            onClose: () => p.setShowSettingsModal(!1),
            onSavePreferences: h,
            onValidateKey: async (C) => await de(a, e, o).validateKey(C)
          }
        ),
        /* @__PURE__ */ l(
          Xt,
          {
            isOpen: !!p.editTagModal,
            taskId: p.editTagModal?.taskId || null,
            currentTag: p.editTagModal?.currentTag || null,
            editTagInput: p.editTagInput,
            boards: N,
            currentBoardId: B,
            onClose: () => {
              p.setEditTagModal(null), p.setEditTagInput("");
            },
            onConfirm: We,
            onInputChange: p.setEditTagInput,
            onToggleTagPill: Ve
          }
        ),
        /* @__PURE__ */ l(
          zt,
          {
            isOpen: !!p.boardContextMenu,
            boardId: p.boardContextMenu?.boardId || null,
            x: p.boardContextMenu?.x || 0,
            y: p.boardContextMenu?.y || 0,
            boards: N,
            onClose: () => p.setBoardContextMenu(null),
            onDeleteBoard: P
          }
        ),
        /* @__PURE__ */ l(
          Yt,
          {
            isOpen: !!p.tagContextMenu,
            tag: p.tagContextMenu?.tag || null,
            x: p.tagContextMenu?.x || 0,
            y: p.tagContextMenu?.y || 0,
            onClose: () => p.setTagContextMenu(null),
            onDeleteTag: x
          }
        )
      ] })
    }
  ) : /* @__PURE__ */ l(Pt, { isDarkTheme: T });
}
function sa(t, a = {}) {
  const e = new URLSearchParams(window.location.search), o = a.userType || e.get("userType") || "admin", n = a.userId || "test-admin", s = a.sessionId, r = { ...a, userType: o, userId: n, sessionId: s }, i = Ze(t);
  i.render(/* @__PURE__ */ l(Qt, { ...r })), t.__root = i, console.log("[task-app] Mounted successfully", r);
}
function oa(t) {
  t.__root?.unmount();
}
export {
  sa as mount,
  oa as unmount
};
