import { jsxs as k, jsx as i, Fragment as Ye } from "react/jsx-runtime";
import { createRoot as Ge } from "react-dom/client";
import { useState as M, useMemo as _e, useEffect as Z, useRef as oe } from "react";
const H = `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
class Ze {
  constructor(n = "public", e = "public") {
    this.userType = n, this.sessionId = e;
  }
  // --- Storage Keys ---
  // Note: Always use the userType from constructor, not the one passed to methods
  // This ensures data stays in the same localStorage location regardless of authContext
  getTasksKey(n, e, a) {
    return `${this.userType}-${e || this.sessionId}-${a || "main"}-tasks`;
  }
  getStatsKey(n, e, a) {
    return `${this.userType}-${e || this.sessionId}-${a || "main"}-stats`;
  }
  getBoardsKey(n, e) {
    return `${this.userType}-${e || this.sessionId}-boards`;
  }
  // --- Tasks Operations ---
  async getTasks(n, e, a) {
    const s = this.getTasksKey(n, e, a), o = localStorage.getItem(s);
    return o ? JSON.parse(o) : {
      version: 1,
      updatedAt: (/* @__PURE__ */ new Date()).toISOString(),
      tasks: []
    };
  }
  async saveTasks(n, e, a, s) {
    const o = this.getTasksKey(n, e, a);
    s.updatedAt = (/* @__PURE__ */ new Date()).toISOString(), localStorage.setItem(o, JSON.stringify(s));
  }
  // --- Stats Operations ---
  async getStats(n, e, a) {
    const s = this.getStatsKey(n, e, a), o = localStorage.getItem(s);
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
  async saveStats(n, e, a, s) {
    const o = this.getStatsKey(n, e, a);
    s.updatedAt = (/* @__PURE__ */ new Date()).toISOString(), localStorage.setItem(o, JSON.stringify(s));
  }
  // --- Boards Operations ---
  async getBoards(n, e) {
    const a = this.getBoardsKey(n, e), s = localStorage.getItem(a);
    if (s)
      return JSON.parse(s);
    const o = {
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
    return await this.saveBoards(n, o, e), o;
  }
  async saveBoards(n, e, a) {
    const s = this.getBoardsKey(n, a);
    e.updatedAt = (/* @__PURE__ */ new Date()).toISOString(), localStorage.setItem(s, JSON.stringify(e));
  }
  // --- Cleanup Operations ---
  async deleteBoardData(n, e, a) {
    const s = this.getTasksKey(n, e, a), o = this.getStatsKey(n, e, a);
    localStorage.removeItem(s), localStorage.removeItem(o);
  }
}
function Qe() {
  const t = Date.now().toString(36).toUpperCase().padStart(8, "0"), n = crypto.getRandomValues(new Uint8Array(18)), e = Array.from(n).map((a) => (a % 36).toString(36).toUpperCase()).join("");
  return t + e;
}
function Oe(t, n) {
  const e = t.tasks.findIndex((a) => a.id === n);
  if (e < 0)
    throw new Error("Task not found");
  return { task: t.tasks[e], index: e };
}
function ue(t, n) {
  const e = t.boards.findIndex((a) => a.id === n);
  if (e < 0)
    throw new Error(`Board ${n} not found`);
  return { board: t.boards[e], index: e };
}
function pe(t, n, e, a) {
  return {
    ...t,
    updatedAt: a,
    boards: [
      ...t.boards.slice(0, n),
      e,
      ...t.boards.slice(n + 1)
    ]
  };
}
function et(t, n, e, a) {
  return {
    ...t,
    updatedAt: a,
    counters: {
      ...t.counters,
      [e]: t.counters[e] + 1
    },
    timeline: [
      ...t.timeline,
      { t: a, event: e, id: n.id }
    ],
    tasks: {
      ...t.tasks,
      [n.id]: { ...n }
    }
  };
}
function Le(t, n, e, a) {
  const { task: s, index: o } = Oe(t, n), r = {
    ...s,
    state: e,
    closedAt: a,
    updatedAt: a
  }, l = [...t.tasks];
  return l.splice(o, 1), {
    updatedTasks: {
      ...t,
      tasks: l,
      updatedAt: a
    },
    closedTask: r
  };
}
async function ne(t, n, e, a) {
  const s = (/* @__PURE__ */ new Date()).toISOString(), [o, r] = await Promise.all([
    t.getTasks(n.userType, n.sessionId, e),
    t.getStats(n.userType, n.sessionId, e)
  ]), { updatedTasks: l, statsEvents: d, result: c } = a(o, r, s);
  let u = r;
  for (const { task: h, eventType: p } of d)
    u = et(u, h, p, s);
  return await Promise.all([
    t.saveTasks(n.userType, n.sessionId, e, l),
    t.saveStats(n.userType, n.sessionId, e, u)
  ]), c;
}
async function re(t, n, e) {
  const a = (/* @__PURE__ */ new Date()).toISOString(), s = await t.getBoards(n.userType, n.sessionId), { updatedBoards: o, result: r } = e(s, a);
  return await t.saveBoards(n.userType, o, n.sessionId), r;
}
async function tt(t, n) {
  const e = await t.getBoards(n.userType, n.sessionId), a = await Promise.all(
    e.boards.map(async (s) => {
      const o = await t.getTasks(n.userType, n.sessionId, s.id), r = await t.getStats(n.userType, n.sessionId, s.id);
      return {
        ...s,
        tasks: o.tasks,
        stats: r
      };
    })
  );
  return {
    ...e,
    boards: a
  };
}
async function at(t, n, e, a = "main") {
  return ne(t, n, a, (s, o, r) => {
    const l = e.id || Qe(), d = e.createdAt || r, c = {
      id: l,
      title: e.title,
      tag: e.tag ?? null,
      state: "Active",
      createdAt: d
    };
    return {
      updatedTasks: {
        ...s,
        tasks: [c, ...s.tasks],
        updatedAt: r
      },
      statsEvents: [{ task: c, eventType: "created" }],
      result: { ok: !0, id: l }
    };
  });
}
async function nt(t, n, e, a, s = "main") {
  return ne(t, n, s, (o, r, l) => {
    const { task: d, index: c } = Oe(o, e), u = {
      ...d,
      ...a,
      updatedAt: l
    }, h = [...o.tasks];
    return h[c] = u, {
      updatedTasks: {
        ...o,
        tasks: h,
        updatedAt: l
      },
      statsEvents: [{ task: u, eventType: "edited" }],
      result: { ok: !0, message: `Task ${e} updated` }
    };
  });
}
async function st(t, n, e, a = "main") {
  return ne(t, n, a, (s, o, r) => {
    const { updatedTasks: l, closedTask: d } = Le(s, e, "Completed", r);
    return {
      updatedTasks: l,
      statsEvents: [{ task: d, eventType: "completed" }],
      result: { ok: !0, message: `Task ${e} completed` }
    };
  });
}
async function ot(t, n, e, a = "main") {
  return ne(t, n, a, (s, o, r) => {
    const { updatedTasks: l, closedTask: d } = Le(s, e, "Deleted", r);
    return {
      updatedTasks: l,
      statsEvents: [{ task: d, eventType: "deleted" }],
      result: { ok: !0, message: `Task ${e} deleted` }
    };
  });
}
async function rt(t, n, e) {
  return re(t, n, (a, s) => {
    if (a.boards.find((l) => l.id === e.id))
      throw new Error(`Board ${e.id} already exists`);
    const o = {
      id: e.id,
      name: e.name,
      tasks: [],
      tags: []
    };
    return {
      updatedBoards: {
        ...a,
        updatedAt: s,
        boards: [...a.boards, o]
      },
      result: { ok: !0, board: o }
    };
  });
}
async function it(t, n, e) {
  if (e === "main")
    throw new Error("Cannot delete the main board");
  return re(t, n, (a, s) => (ue(a, e), {
    updatedBoards: {
      ...a,
      updatedAt: s,
      boards: a.boards.filter((r) => r.id !== e)
    },
    result: { ok: !0, message: `Board ${e} deleted` }
  }));
}
async function lt(t, n, e) {
  return re(t, n, (a, s) => {
    const { board: o, index: r } = ue(a, e.boardId), l = o.tags || [];
    if (l.includes(e.tag))
      return {
        updatedBoards: a,
        // No changes needed
        result: { ok: !0, message: `Tag ${e.tag} already exists` }
      };
    const d = {
      ...o,
      tags: [...l, e.tag]
    };
    return {
      updatedBoards: pe(a, r, d, s),
      result: { ok: !0, message: `Tag ${e.tag} added to board ${e.boardId}` }
    };
  });
}
async function ct(t, n, e) {
  return re(t, n, (a, s) => {
    const { board: o, index: r } = ue(a, e.boardId), l = o.tags || [], d = {
      ...o,
      tags: l.filter((c) => c !== e.tag)
    };
    return {
      updatedBoards: pe(a, r, d, s),
      result: { ok: !0, message: `Tag ${e.tag} removed from board ${e.boardId}` }
    };
  });
}
async function dt(t, n, e) {
  return ne(t, n, e.boardId, (a, s, o) => {
    let r = 0;
    const l = a.tasks.map((u) => {
      const h = e.updates.find((p) => p.taskId === u.id);
      return h ? (r++, {
        ...u,
        tag: h.tag || void 0,
        updatedAt: o
      }) : u;
    }), d = {
      ...a,
      tasks: l,
      updatedAt: o
    }, c = l.filter((u) => e.updates.find((h) => h.taskId === u.id)).map((u) => ({ task: u, eventType: "edited" }));
    return {
      updatedTasks: d,
      statsEvents: c,
      result: {
        ok: !0,
        message: `Updated ${r} task(s) on board ${e.boardId}`,
        updated: r
      }
    };
  });
}
async function ut(t, n, e) {
  const a = await ne(t, n, e.boardId, (s, o, r) => {
    let l = 0;
    const d = s.tasks.map((h) => {
      if (e.taskIds.includes(h.id) && h.tag) {
        const D = h.tag.split(" ").filter(Boolean).filter((v) => v !== e.tag);
        return l++, {
          ...h,
          tag: D.length > 0 ? D.join(" ") : void 0,
          updatedAt: r
        };
      }
      return h;
    }), c = {
      ...s,
      tasks: d,
      updatedAt: r
    }, u = d.filter((h) => e.taskIds.includes(h.id)).map((h) => ({ task: h, eventType: "edited" }));
    return {
      updatedTasks: c,
      statsEvents: u,
      result: { clearedCount: l }
    };
  });
  return await re(t, n, (s, o) => {
    const { board: r, index: l } = ue(s, e.boardId), d = r.tags || [], c = {
      ...r,
      tags: d.filter((u) => u !== e.tag)
    };
    return {
      updatedBoards: pe(s, l, c, o),
      result: { ok: !0 }
    };
  }), {
    ok: !0,
    message: `Cleared tag ${e.tag} from ${a.clearedCount} task(s) on board ${e.boardId}`,
    cleared: a.clearedCount
  };
}
function Y(t, n, e = 50) {
  setTimeout(() => {
    try {
      const a = new BroadcastChannel("tasks");
      a.postMessage({ type: t, ...n }), a.close();
    } catch (a) {
      console.error("[localStorageApi] Broadcast failed:", a);
    }
  }, e);
}
function gt(t = "public", n = "public") {
  const e = new Ze(t, n), a = { userType: "registered", sessionId: n };
  return {
    async getBoards() {
      const s = await tt(e, a), o = {
        version: s.version,
        updatedAt: s.updatedAt,
        boards: []
      };
      for (const r of s.boards) {
        const l = await e.getTasks(t, n, r.id), d = await e.getStats(t, n, r.id);
        o.boards.push({
          id: r.id,
          name: r.name,
          tasks: l.tasks,
          stats: d,
          tags: r.tags || []
        });
      }
      return o;
    },
    async createBoard(s) {
      console.debug("[localStorageApi] createBoard (using handler)", { userType: t, sessionId: n, boardId: s });
      const o = await rt(
        e,
        a,
        { id: s, name: s }
      );
      return await e.saveTasks(t, n, s, {
        version: 1,
        updatedAt: (/* @__PURE__ */ new Date()).toISOString(),
        tasks: []
      }), await e.saveStats(t, n, s, {
        version: 2,
        updatedAt: (/* @__PURE__ */ new Date()).toISOString(),
        counters: { created: 0, completed: 0, edited: 0, deleted: 0 },
        timeline: [],
        tasks: {}
      }), Y("boards-updated", { sessionId: H, userType: t }), o.board;
    },
    async deleteBoard(s) {
      await it(
        e,
        a,
        s
      ), await e.deleteBoardData(t, n, s), Y("boards-updated", { sessionId: H, userType: t });
    },
    async getTasks(s = "main") {
      return e.getTasks(t, n, s);
    },
    async getStats(s = "main") {
      return e.getStats(t, n, s);
    },
    async createTask(s, o = "main", r = !1) {
      console.log("[localStorageApi] createTask (using handler)", { data: s, boardId: o, suppressBroadcast: r });
      const l = await at(
        e,
        a,
        s,
        o
      ), c = (await e.getTasks(t, n, o)).tasks.find((u) => u.id === l.id);
      if (!c)
        throw new Error("Task creation failed - task not found after creation");
      return r ? console.log("[localStorageApi] createTask: broadcast suppressed") : (console.log("[localStorageApi] createTask: broadcasting", {
        sessionId: H,
        boardId: o,
        taskId: l.id
      }), Y("tasks-updated", { sessionId: H, userType: t, boardId: o })), c;
    },
    async patchTask(s, o, r = "main", l = !1) {
      const d = {};
      o.title !== void 0 && (d.title = o.title), o.tag !== void 0 && o.tag !== null && (d.tag = o.tag), await nt(
        e,
        a,
        s,
        d,
        r
      ), l || Y("tasks-updated", { sessionId: H, userType: t, boardId: r });
      const u = (await e.getTasks(t, n, r)).tasks.find((h) => h.id === s);
      if (!u)
        throw new Error("Task not found after update");
      return u;
    },
    async completeTask(s, o = "main") {
      const l = (await e.getTasks(t, n, o)).tasks.find((d) => d.id === s);
      if (!l)
        throw new Error("Task not found");
      return await st(
        e,
        a,
        s,
        o
      ), Y("tasks-updated", { sessionId: H, userType: t, boardId: o }), {
        ...l,
        state: "Completed",
        closedAt: (/* @__PURE__ */ new Date()).toISOString(),
        updatedAt: (/* @__PURE__ */ new Date()).toISOString()
      };
    },
    async deleteTask(s, o = "main", r = !1) {
      console.log("[localStorageApi] deleteTask (using handler)", { id: s, boardId: o, suppressBroadcast: r });
      const d = (await e.getTasks(t, n, o)).tasks.find((c) => c.id === s);
      if (!d)
        throw new Error("Task not found");
      return await ot(
        e,
        a,
        s,
        o
      ), r ? console.log("[localStorageApi] deleteTask: broadcast suppressed") : (console.log("[localStorageApi] deleteTask: broadcasting", { sessionId: H }), Y("tasks-updated", { sessionId: H, userType: t, boardId: o })), {
        ...d,
        state: "Deleted",
        closedAt: (/* @__PURE__ */ new Date()).toISOString(),
        updatedAt: (/* @__PURE__ */ new Date()).toISOString()
      };
    },
    async createTag(s, o = "main") {
      await lt(
        e,
        a,
        { boardId: o, tag: s }
      ), Y("boards-updated", { sessionId: H, userType: t, boardId: o });
    },
    async deleteTag(s, o = "main") {
      await ct(
        e,
        a,
        { boardId: o, tag: s }
      ), Y("boards-updated", { sessionId: H, userType: t, boardId: o });
    },
    // User preferences (includes device-specific settings like theme)
    async getPreferences() {
      const s = `${t}-${n}-preferences`, o = localStorage.getItem(s);
      return o ? JSON.parse(o) : {
        version: 1,
        updatedAt: (/* @__PURE__ */ new Date()).toISOString(),
        theme: "light",
        showCompleteButton: !0,
        showDeleteButton: !0,
        showTagButton: !1
      };
    },
    async savePreferences(s) {
      const o = `${t}-${n}-preferences`, l = {
        ...await this.getPreferences(),
        ...s,
        version: 1,
        updatedAt: (/* @__PURE__ */ new Date()).toISOString()
      };
      localStorage.setItem(o, JSON.stringify(l));
    },
    // Batch operations
    async batchMoveTasks(s, o, r) {
      const l = await this.getBoards(), d = l.boards.find((v) => v.id === s), c = l.boards.find((v) => v.id === o);
      if (!d)
        throw new Error(`Source board ${s} not found`);
      if (!c)
        throw new Error(`Target board ${o} not found`);
      const u = d.tasks.filter((v) => r.includes(v.id));
      d.tasks = d.tasks.filter((v) => !r.includes(v.id)), c.tasks = [...c.tasks, ...u], l.updatedAt = (/* @__PURE__ */ new Date()).toISOString();
      const h = `${t}-${n}-boards`;
      localStorage.setItem(h, JSON.stringify(l));
      const p = `${t}-${n}-${s}-tasks`, D = `${t}-${n}-${o}-tasks`;
      return localStorage.setItem(p, JSON.stringify({
        version: 1,
        updatedAt: l.updatedAt,
        tasks: d.tasks
      })), localStorage.setItem(D, JSON.stringify({
        version: 1,
        updatedAt: l.updatedAt,
        tasks: c.tasks
      })), Y("boards-updated", { sessionId: H, userType: t }), { ok: !0, moved: u.length };
    },
    async batchUpdateTags(s, o) {
      console.log("[localStorageApi] batchUpdateTags", { boardId: s, updates: o }), await dt(
        e,
        a,
        { boardId: s, updates: o }
      ), Y("tasks-updated", { sessionId: H, userType: t, boardId: s });
    },
    async batchClearTag(s, o, r) {
      console.log("[localStorageApi] batchClearTag START", { boardId: s, tag: o, taskIds: r, taskCount: r.length });
      const l = await ut(
        e,
        a,
        { boardId: s, tag: o, taskIds: r }
      );
      console.log("[localStorageApi] batchClearTag result:", l), Y("boards-updated", { sessionId: H, userType: t, boardId: s }), console.log("[localStorageApi] batchClearTag END");
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
async function ht(t, n, e, a) {
  for (const r of n.boards || []) {
    const l = r.id;
    if (r.tasks && r.tasks.length > 0) {
      const d = `${e}-${a}-${l}-tasks`, c = {
        version: 1,
        updatedAt: n.updatedAt || (/* @__PURE__ */ new Date()).toISOString(),
        tasks: r.tasks
      };
      window.localStorage.setItem(d, JSON.stringify(c));
    }
    if (r.stats) {
      const d = `${e}-${a}-${l}-stats`;
      window.localStorage.setItem(d, JSON.stringify(r.stats));
    }
  }
  const s = `${e}-${a}-boards`, o = {
    version: 1,
    updatedAt: n.updatedAt || (/* @__PURE__ */ new Date()).toISOString(),
    boards: (n.boards || []).map((r) => ({
      id: r.id,
      name: r.name,
      tags: r.tags || []
    }))
  };
  window.localStorage.setItem(s, JSON.stringify(o)), console.log("[api] Synced API data to localStorage:", {
    boards: n.boards?.length || 0,
    totalTasks: n.boards?.reduce((r, l) => r + (l.tasks?.length || 0), 0) || 0
  });
}
function j(t, n) {
  const e = {
    "Content-Type": "application/json",
    "X-User-Type": t
  };
  return n && (e["X-Session-Id"] = n), e;
}
function de(t = "public", n = "public") {
  const e = gt(t, n);
  return t === "public" ? e : {
    // Get boards - returns localStorage immediately (optimistic)
    async getBoards() {
      return await e.getBoards();
    },
    // Sync from API - called once on initial page load to get server state
    async syncFromApi() {
      try {
        console.log("[api] Syncing from API...");
        const a = await fetch(`/task/api/boards?userType=${t}&sessionId=${encodeURIComponent(n)}`, {
          headers: j(t, n)
        });
        if (!a.ok)
          throw new Error(`API returned ${a.status}`);
        const s = await a.json();
        if (!s || !s.boards || !Array.isArray(s.boards)) {
          console.error("[api] Invalid response structure:", s);
          return;
        }
        console.log("[api] Synced from API:", { boards: s.boards.length, totalTasks: s.boards.reduce((o, r) => o + (r.tasks?.length || 0), 0) }), await ht(e, s, t, n);
      } catch (a) {
        console.error("[api] Sync from API failed:", a);
      }
    },
    async createTask(a, s = "main", o = !1) {
      const r = await e.createTask(a, s, o);
      return fetch("/task/api", {
        method: "POST",
        headers: j(t, n),
        body: JSON.stringify({
          id: a.id || r.id,
          // Use provided ID (for moves) or client-generated ID
          ...a,
          boardId: s
        })
      }).then((l) => l.json()).then((l) => {
        l.ok && (l.id === r.id ? console.log("[api] Background sync: createTask completed (ID matched)") : console.warn("[api] Server returned different ID (unexpected):", { client: r.id, server: l.id }));
      }).catch((l) => console.error("[api] Failed to sync createTask:", l)), r;
    },
    async createTag(a, s = "main") {
      const o = await e.createTag(a, s);
      return fetch("/task/api/tags", {
        method: "POST",
        headers: j(t, n),
        body: JSON.stringify({ boardId: s, tag: a })
      }).then(() => console.log("[api] Background sync: createTag completed")).catch((r) => console.error("[api] Failed to sync createTag:", r)), o;
    },
    async deleteTag(a, s = "main") {
      const o = await e.deleteTag(a, s);
      return fetch("/task/api/tags/delete", {
        method: "POST",
        headers: j(t, n),
        body: JSON.stringify({ boardId: s, tag: a })
      }).then(() => console.log("[api] Background sync: deleteTag completed")).catch((r) => console.error("[api] Failed to sync deleteTag:", r)), o;
    },
    async patchTask(a, s, o = "main", r = !1) {
      const l = await e.patchTask(a, s, o, r);
      return fetch(`/task/api/${a}`, {
        method: "PATCH",
        headers: j(t, n),
        body: JSON.stringify({ ...s, boardId: o })
      }).then(() => console.log("[api] Background sync: patchTask completed")).catch((d) => console.error("[api] Failed to sync patchTask:", d)), l;
    },
    async completeTask(a, s = "main") {
      const o = await e.completeTask(a, s);
      return fetch(`/task/api/${a}/complete`, {
        method: "POST",
        headers: j(t, n),
        body: JSON.stringify({ boardId: s })
      }).then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        console.log("[api] Background sync: completeTask completed");
      }).catch((r) => console.error("[api] Failed to sync completeTask:", r)), o;
    },
    async deleteTask(a, s = "main", o = !1) {
      await e.deleteTask(a, s, o), fetch(`/task/api/${a}`, {
        method: "DELETE",
        headers: j(t, n),
        body: JSON.stringify({ boardId: s })
      }).then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        console.log("[api] Background sync: deleteTask completed");
      }).catch((r) => console.error("[api] Failed to sync deleteTask:", r));
    },
    // Board operations
    async createBoard(a) {
      const s = await e.createBoard(a);
      return fetch("/task/api/boards", {
        method: "POST",
        headers: j(t, n),
        body: JSON.stringify({ id: a, name: a })
      }).then(() => console.log("[api] Background sync: createBoard completed")).catch((o) => console.error("[api] Failed to sync createBoard:", o)), s;
    },
    async deleteBoard(a) {
      const s = await e.deleteBoard(a);
      return fetch(`/task/api/boards/${encodeURIComponent(a)}`, {
        method: "DELETE",
        headers: j(t, n)
      }).then(() => console.log("[api] Background sync: deleteBoard completed")).catch((o) => console.error("[api] Failed to sync deleteBoard:", o)), s;
    },
    // User preferences
    async getPreferences() {
      const a = await e.getPreferences();
      try {
        const s = await fetch("/task/api/preferences", {
          headers: j(t, n)
        });
        if (s.ok) {
          const o = await s.json(), r = {
            ...a,
            // Keep device-specific settings (theme, buttons)
            ...o,
            // Override with server preferences (experimentalThemes, alwaysVerticalLayout)
            // Ensure device-specific settings are never overwritten by server
            theme: a.theme,
            showCompleteButton: a.showCompleteButton,
            showDeleteButton: a.showDeleteButton,
            showTagButton: a.showTagButton
          };
          return await e.savePreferences(r), console.log("[api] Synced server preferences, preserved device-specific settings"), r;
        }
      } catch (s) {
        console.warn("[api] Failed to fetch preferences from server, using localStorage:", s);
      }
      return a;
    },
    async savePreferences(a) {
      await e.savePreferences(a);
      const { theme: s, showCompleteButton: o, showDeleteButton: r, showTagButton: l, ...d } = a;
      Object.keys(d).length > 0 && fetch("/task/api/preferences", {
        method: "PUT",
        headers: j(t, n),
        body: JSON.stringify(d)
      }).then(() => console.log("[api] Background sync: savePreferences completed (server-only)")).catch((c) => console.error("[api] Failed to sync savePreferences:", c));
    },
    // Batch operations
    async batchUpdateTags(a, s) {
      await e.batchUpdateTags(a, s), fetch("/task/api/batch-tag", {
        method: "PATCH",
        headers: j(t, n),
        body: JSON.stringify({ boardId: a, updates: s })
      }).then(() => console.log("[api] Background sync: batchUpdateTags completed")).catch((o) => console.error("[api] Failed to sync batchUpdateTags:", o));
    },
    async batchMoveTasks(a, s, o) {
      const r = await e.batchMoveTasks(a, s, o);
      return fetch("/task/api/batch-move", {
        method: "POST",
        headers: j(t, n),
        body: JSON.stringify({ sourceBoardId: a, targetBoardId: s, taskIds: o })
      }).then(() => console.log("[api] Background sync: batchMoveTasks completed")).catch((l) => console.error("[api] Failed to sync batchMoveTasks:", l)), r;
    },
    async batchClearTag(a, s, o) {
      await e.batchClearTag(a, s, o), fetch("/task/api/batch-clear-tag", {
        method: "POST",
        headers: j(t, n),
        body: JSON.stringify({ boardId: a, tag: s, taskIds: o })
      }).then(() => console.log("[api] Background sync: batchClearTag completed")).catch((r) => console.error("[api] Failed to sync batchClearTag:", r));
    },
    // User Management
    async validateKey(a) {
      try {
        return (await fetch("/task/api/validate-key", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ key: a })
        })).ok;
      } catch (s) {
        return console.error("[api] Failed to validate key:", s), !1;
      }
    }
  };
}
function pt(t) {
  t = t.trim();
  const n = (s) => s.trim().replace(/\s+/g, "-"), e = t.match(/^["']([^"']+)["']\s*(.*)$/);
  if (e) {
    const s = e[1].trim(), r = e[2].match(/#[^\s#]+/g)?.map((l) => n(l.slice(1))).filter(Boolean) || [];
    return { title: s, tag: r.length ? r.join(" ") : void 0 };
  }
  const a = t.match(/^(.+?)\s+(#.+)$/);
  if (a) {
    const s = a[1].trim(), r = a[2].match(/#[^\s#]+/g)?.map((l) => n(l.slice(1))).filter(Boolean) || [];
    return { title: s, tag: r.length ? r.join(" ") : void 0 };
  }
  return { title: t.trim() };
}
function mt(t, n = 6, e = []) {
  const a = t.flatMap((o) => o.tag?.split(" ") || []).filter(Boolean), s = {};
  return a.forEach((o) => s[o] = (s[o] || 0) + 1), e.filter(Boolean).forEach((o) => {
    s[o] || (s[o] = 0);
  }), Object.entries(s).sort((o, r) => r[1] - o[1]).slice(0, n).map(([o]) => o);
}
function Te(t, n) {
  return t.filter((e) => e.tag?.split(" ").includes(n));
}
function ft(t, n, e) {
  const a = Array.isArray(e) && e.length > 0;
  return t.filter((s) => {
    const o = s.tag?.split(" ") || [];
    return a ? e.some((l) => o.includes(l)) && !n.some((l) => o.includes(l)) : !n.some((r) => o.includes(r));
  });
}
function Ie(t) {
  return Array.from(new Set(t.flatMap((n) => n.tag?.split(" ") || []).filter(Boolean)));
}
async function ye(t, n, e, a, s = {}) {
  const { onError: o, suppress404: r = !0 } = s;
  if (n.has(t)) {
    console.log(`[withPendingOperation] Operation already pending: ${t}`);
    return;
  }
  e((l) => /* @__PURE__ */ new Set([...l, t]));
  try {
    return await a();
  } catch (l) {
    r && l?.message?.includes("404") || (o ? o(l) : console.error(`[withPendingOperation] Error in ${t}:`, l));
    return;
  } finally {
    e((l) => {
      const d = new Set(l);
      return d.delete(t), d;
    });
  }
}
function se(t, n) {
  const e = t?.boards?.find((a) => a.id === n);
  return e ? (console.log(`[extractBoardTasks] Found board ${n}`, {
    taskCount: e.tasks?.length || 0
  }), {
    tasks: (e.tasks || []).filter((a) => a.state === "Active"),
    foundBoard: !0
  }) : (console.log(`[extractBoardTasks] Board not found: ${n}`), {
    tasks: [],
    foundBoard: !1
  });
}
function kt({ userType: t, sessionId: n }) {
  const [e, a] = M([]), [s, o] = M(/* @__PURE__ */ new Set()), r = _e(
    () => de(t, n || "public"),
    [t, n]
  ), [l, d] = M(null), [c, u] = M("main");
  async function h() {
    console.log("[useTasks] initialLoad called"), "syncFromApi" in r && await r.syncFromApi(), await p();
  }
  async function p() {
    console.log("[useTasks] reload called", { currentBoardId: c, stack: new Error().stack?.split(`
`).slice(1, 4).join(`
`) });
    const f = await r.getBoards();
    d(f);
    const { tasks: b } = se(f, c);
    a(b);
  }
  Z(() => {
    console.log("[useTasks] User context changed, clearing state and reloading", { userType: t, sessionId: n }), a([]), o(/* @__PURE__ */ new Set()), d(null), u("main"), p();
  }, [t, n]), Z(() => {
    console.log("[useTasks] Setting up BroadcastChannel listener", { currentBoardId: c, userType: t, sessionId: n });
    try {
      const f = new BroadcastChannel("tasks");
      return f.onmessage = (b) => {
        const B = b.data || {};
        if (console.log("[useTasks] BroadcastChannel message received", { msg: B, sessionId: H, currentBoardId: c, currentContext: { userType: t, sessionId: n } }), B.sessionId === H) {
          console.log("[useTasks] Ignoring own broadcast message");
          return;
        }
        if (B.userType !== t || B.sessionId !== n) {
          console.log("[useTasks] Ignoring message for different user context", {
            msgContext: { userType: B.userType, sessionId: B.sessionId },
            currentContext: { userType: t, sessionId: n }
          });
          return;
        }
        (B.type === "tasks-updated" || B.type === "boards-updated") && (console.log("[useTasks] BroadcastChannel: triggering reload for currentBoardId =", c), p());
      }, () => {
        console.log("[useTasks] Cleaning up BroadcastChannel listener", { currentBoardId: c }), f.close();
      };
    } catch (f) {
      console.error("[useTasks] Failed to setup BroadcastChannel", f);
    }
  }, [c, t, n]);
  async function D(f) {
    if (f = f.trim(), !!f)
      try {
        const b = pt(f);
        return await r.createTask(b, c), await p(), !0;
      } catch (b) {
        return alert(b.message || "Failed to create task"), !1;
      }
  }
  async function v(f) {
    await ye(
      `complete-${f}`,
      s,
      o,
      async () => {
        await r.completeTask(f, c), await p();
      },
      {
        onError: (b) => alert(b.message || "Failed to complete task")
      }
    );
  }
  async function A(f) {
    console.log("[useTasks] deleteTask START", { taskId: f, currentBoardId: c }), await ye(
      `delete-${f}`,
      s,
      o,
      async () => {
        console.log("[useTasks] deleteTask: calling api.deleteTask", { taskId: f, currentBoardId: c }), await r.deleteTask(f, c), console.log("[useTasks] deleteTask: calling reload"), await p(), console.log("[useTasks] deleteTask END");
      },
      {
        onError: (b) => alert(b.message || "Failed to delete task")
      }
    );
  }
  async function R(f) {
    const b = prompt("Enter tag (without #):");
    if (!b) return;
    const B = b.trim().replace(/^#+/, "").replace(/\s+/g, "-"), m = e.find((x) => x.id === f);
    if (!m) return;
    const T = m.tag?.split(" ") || [];
    if (T.includes(B)) return;
    const S = [...T, B].join(" ");
    try {
      await r.patchTask(f, { tag: S }, c), await p();
    } catch (x) {
      alert(x.message || "Failed to add tag");
    }
  }
  async function $(f, b, B = {}) {
    const { suppressBroadcast: m = !1, skipReload: T = !1 } = B;
    try {
      await r.patchTask(f, b, c, m), T || await p();
    } catch (S) {
      throw S;
    }
  }
  async function K(f) {
    console.log("[useTasks] bulkUpdateTaskTags START", { count: f.length });
    try {
      await r.batchUpdateTags(
        c,
        f.map((b) => ({ taskId: b.taskId, tag: b.tag || null }))
      ), console.log("[useTasks] bulkUpdateTaskTags: calling reload"), await p(), console.log("[useTasks] bulkUpdateTaskTags END");
    } catch (b) {
      throw console.error("[useTasks] bulkUpdateTaskTags ERROR", b), b;
    }
  }
  async function J(f) {
    console.log("[useTasks] deleteTag START", { tag: f, currentBoardId: c, taskCount: e.length });
    const b = e.filter((B) => B.tag?.split(" ").includes(f));
    if (console.log("[useTasks] deleteTag: found tasks with tag", { tag: f, count: b.length }), b.length === 0) {
      console.log("[useTasks] deleteTag: no tasks found with this tag, just deleting tag");
      try {
        await r.deleteTag(f, c), await p(), console.log("[useTasks] deleteTag END (no tasks to clear)");
      } catch (B) {
        console.error("[useTasks] deleteTag ERROR", B), console.error("[useTasks] deleteTag: Please fix this error:", B.message);
      }
      return;
    }
    try {
      console.log("[useTasks] deleteTag: starting batch clear"), await r.batchClearTag(
        c,
        f,
        b.map((B) => B.id)
      ), console.log("[useTasks] deleteTag: calling reload"), await p(), console.log("[useTasks] deleteTag END");
    } catch (B) {
      console.error("[useTasks] deleteTag ERROR", B), alert(B.message || "Failed to remove tag from tasks");
    }
  }
  async function U(f) {
    await r.createBoard(f), u(f);
    const b = await r.getBoards();
    d(b);
    const { tasks: B } = se(b, f);
    a(B);
  }
  async function W(f, b) {
    if (console.log("[useTasks] moveTasksToBoard START", { targetBoardId: f, ids: b, currentBoardId: c }), !l) return;
    const B = /* @__PURE__ */ new Set();
    for (const m of l.boards)
      for (const T of m.tasks || [])
        b.includes(T.id) && B.add(m.id);
    console.log("[useTasks] moveTasksToBoard: source boards", { sourceBoardIds: Array.from(B) });
    try {
      if (B.size === 1) {
        const S = Array.from(B)[0];
        console.log("[useTasks] moveTasksToBoard: using batch API"), await r.batchMoveTasks(S, f, b);
      } else
        throw console.error("[useTasks] moveTasksToBoard: Cannot move tasks from multiple boards at once"), new Error("Cannot move tasks from multiple boards at once");
      console.log("[useTasks] moveTasksToBoard: switching to target board", { targetBoardId: f }), u(f);
      const m = await r.getBoards();
      d(m);
      const { tasks: T } = se(m, f);
      a(T), console.log("[useTasks] moveTasksToBoard END");
    } catch (m) {
      console.error("[useTasks] moveTasksToBoard ERROR", m), alert(m.message || "Failed to move tasks");
    }
  }
  async function X(f) {
    if (await r.deleteBoard(f), c === f) {
      u("main");
      const b = await r.getBoards();
      d(b);
      const { tasks: B } = se(b, "main");
      a(B);
    } else
      await p();
  }
  async function q(f) {
    await r.createTag(f, c), await p();
  }
  async function ae(f) {
    await r.deleteTag(f, c), await p();
  }
  function G(f) {
    u(f);
    const { tasks: b, foundBoard: B } = se(l, f);
    B ? a(b) : p();
  }
  return {
    // Task state
    tasks: e,
    pendingOperations: s,
    // Task operations
    addTask: D,
    completeTask: v,
    deleteTask: A,
    addTagToTask: R,
    updateTaskTags: $,
    bulkUpdateTaskTags: K,
    deleteTag: J,
    // Board state
    boards: l,
    currentBoardId: c,
    // Board operations
    createBoard: U,
    deleteBoard: X,
    switchBoard: G,
    moveTasksToBoard: W,
    createTagOnBoard: q,
    deleteTagOnBoard: ae,
    // Lifecycle
    initialLoad: h,
    reload: p
  };
}
function Tt({ tasks: t, onTaskUpdate: n, onBulkUpdate: e }) {
  const [a, s] = M(null), [o, r] = M(null), [l, d] = M(/* @__PURE__ */ new Set()), [c, u] = M(!1), [h, p] = M(null), [D, v] = M(null), A = oe(null);
  function R(m) {
    let T = [];
    try {
      const S = m.dataTransfer.getData("application/x-hadoku-task-ids");
      S && (T = JSON.parse(S));
    } catch {
    }
    if (T.length === 0) {
      const S = m.dataTransfer.getData("text/plain");
      S && (T = [S]);
    }
    return T;
  }
  function $(m, T) {
    const S = l.has(T) && l.size > 0 ? Array.from(l) : [T];
    console.log("[useDragAndDrop] onDragStart", { taskId: T, idsToDrag: S, selectedCount: l.size }), m.dataTransfer.setData("text/plain", S[0]);
    try {
      m.dataTransfer.setData("application/x-hadoku-task-ids", JSON.stringify(S));
    } catch {
    }
    m.dataTransfer.effectAllowed = "copyMove";
    try {
      const x = m.currentTarget, E = x.closest && x.closest(".task-app__item") ? x.closest(".task-app__item") : x;
      E.classList.add("dragging");
      const N = E.cloneNode(!0);
      N.style.boxSizing = "border-box", N.style.width = `${E.offsetWidth}px`, N.style.height = `${E.offsetHeight}px`, N.style.opacity = "0.95", N.style.transform = "none", N.style.filter = "drop-shadow(0 6px 18px rgba(0,0,0,0.12))", N.classList.add("drag-image"), N.style.position = "absolute", N.style.top = "-9999px", N.style.left = "-9999px", document.body.appendChild(N), E.__dragImage = N, d((L) => {
        if (L.has(T)) return new Set(L);
        const I = new Set(L);
        return I.add(T), I;
      });
      try {
        const L = E.closest(".task-app__tag-column");
        if (L) {
          const I = L.querySelector(".task-app__tag-header") || L.querySelector("h3"), F = (I && I.textContent || "").trim().replace(/^#/, "");
          if (F)
            try {
              m.dataTransfer.setData("application/x-hadoku-task-source", F);
            } catch {
            }
        }
      } catch {
      }
      try {
        const L = E.getBoundingClientRect();
        let I = Math.round(m.clientX - L.left), y = Math.round(m.clientY - L.top);
        I = Math.max(0, Math.min(Math.round(N.offsetWidth - 1), I)), y = Math.max(0, Math.min(Math.round(N.offsetHeight - 1), y)), m.dataTransfer.setDragImage(N, I, y);
      } catch {
        m.dataTransfer.setDragImage(N, 0, 0);
      }
    } catch {
    }
  }
  function K(m) {
    try {
      const T = m.currentTarget;
      T.classList.remove("dragging");
      const S = T.__dragImage;
      S && S.parentNode && S.parentNode.removeChild(S), S && delete T.__dragImage;
    } catch {
    }
    try {
      X();
    } catch {
    }
  }
  function J(m) {
    if (m.button === 0) {
      try {
        const T = m.target;
        if (!T || T.closest && T.closest(".task-app__item, .task-app__controls, button, input, textarea, .task-app__item-actions"))
          return;
      } catch {
      }
      u(!0), A.current = { x: m.clientX, y: m.clientY }, p({ x: m.clientX, y: m.clientY, w: 0, h: 0 }), d(/* @__PURE__ */ new Set());
      try {
        document.body.classList.add("marquee-selecting");
      } catch {
      }
    }
  }
  function U(m) {
    if (!c || !A.current) return;
    const T = A.current.x, S = A.current.y, x = m.clientX, E = m.clientY, N = Math.min(T, x), L = Math.min(S, E), I = Math.abs(x - T), y = Math.abs(E - S);
    p({ x: N, y: L, w: I, h: y });
    const F = Array.from(document.querySelectorAll(".task-app__item")), O = /* @__PURE__ */ new Set();
    for (const w of F) {
      const V = w.getBoundingClientRect();
      if (!(V.right < N || V.left > N + I || V.bottom < L || V.top > L + y)) {
        const le = w.getAttribute("data-task-id");
        le && O.add(le), w.classList.add("selected");
      } else
        w.classList.remove("selected");
    }
    d(O);
  }
  function W(m) {
    u(!1), p(null), A.current = null;
    try {
      document.body.classList.remove("marquee-selecting");
    } catch {
    }
    try {
      v(Date.now());
    } catch {
    }
  }
  function X() {
    d(/* @__PURE__ */ new Set()), Array.from(document.querySelectorAll(".task-app__item.selected")).forEach((T) => T.classList.remove("selected"));
  }
  Z(() => {
    function m(x) {
      if (x.button !== 0) return;
      const E = { target: x.target, clientX: x.clientX, clientY: x.clientY, button: x.button };
      try {
        J(E);
      } catch {
      }
    }
    function T(x) {
      const E = { clientX: x.clientX, clientY: x.clientY };
      try {
        U(E);
      } catch {
      }
    }
    function S(x) {
      const E = { clientX: x.clientX, clientY: x.clientY };
      try {
        W(E);
      } catch {
      }
    }
    return document.addEventListener("mousedown", m), document.addEventListener("mousemove", T), document.addEventListener("mouseup", S), () => {
      document.removeEventListener("mousedown", m), document.removeEventListener("mousemove", T), document.removeEventListener("mouseup", S);
    };
  }, []);
  function q(m, T) {
    m.preventDefault(), m.dataTransfer.dropEffect = "copy", s(T);
  }
  function ae(m) {
    m.currentTarget.contains(m.relatedTarget) || s(null);
  }
  async function G(m, T) {
    m.preventDefault(), s(null), console.log("[useDragAndDrop] onDrop START", { targetTag: T });
    const S = R(m);
    if (S.length === 0) return;
    let x = null;
    try {
      const N = m.dataTransfer.getData("application/x-hadoku-task-source");
      N && (x = N);
    } catch {
    }
    console.log("[useDragAndDrop] onDrop: processing", { targetTag: T, ids: S, srcTag: x, taskCount: S.length });
    const E = [];
    for (const N of S) {
      const L = t.find((w) => w.id === N);
      if (!L) continue;
      const I = L.tag?.split(" ").filter(Boolean) || [];
      if (T === "other") {
        if (I.length === 0) continue;
        E.push({ taskId: N, tag: "" });
        continue;
      }
      const y = I.includes(T);
      let F = I.slice();
      y || F.push(T), x && x !== T && (F = F.filter((w) => w !== x));
      const O = F.join(" ").trim();
      E.push({ taskId: N, tag: O });
    }
    console.log("[useDragAndDrop] onDrop: updating tasks", { updateCount: E.length });
    try {
      await e(E), console.log("[useDragAndDrop] onDrop: updates complete, clearing selection");
      try {
        X();
      } catch {
      }
    } catch (N) {
      console.error("Failed to add tag to one or more tasks:", N), alert(N.message || "Failed to add tags");
    }
    console.log("[useDragAndDrop] onDrop END");
  }
  function f(m, T) {
    m.preventDefault(), m.dataTransfer.dropEffect = "copy", r(T);
  }
  function b(m) {
    m.currentTarget.contains(m.relatedTarget) || r(null);
  }
  async function B(m, T) {
    m.preventDefault(), r(null);
    const S = R(m);
    if (S.length === 0) return;
    console.log("[useDragAndDrop] onFilterDrop", { filterTag: T, ids: S, taskCount: S.length });
    const x = [];
    for (const E of S) {
      const N = t.find((y) => y.id === E);
      if (!N) continue;
      const L = N.tag?.split(" ").filter(Boolean) || [];
      if (L.includes(T)) {
        console.log(`Task ${E} already has tag: ${T}`);
        continue;
      }
      const I = [...L, T].join(" ");
      x.push({ taskId: E, tag: I });
    }
    if (x.length === 0) {
      console.log("No updates needed - all tasks already have this tag");
      return;
    }
    console.log(`Adding tag "${T}" to ${x.length} task(s) via filter drop`);
    try {
      await e(x);
      try {
        X();
      } catch {
      }
    } catch (E) {
      console.error("Failed to add tag via filter drop:", E), alert(E.message || "Failed to add tag");
    }
  }
  return {
    dragOverTag: a,
    dragOverFilter: o,
    setDragOverFilter: r,
    selectedIds: l,
    isSelecting: c,
    marqueeRect: h,
    selectionJustEndedAt: D,
    // selection handlers
    selectionStartHandler: J,
    selectionMoveHandler: U,
    selectionEndHandler: W,
    clearSelection: X,
    onDragStart: $,
    onDragEnd: K,
    onDragOver: q,
    onDragLeave: ae,
    onDrop: G,
    onFilterDragOver: f,
    onFilterDragLeave: b,
    onFilterDrop: B
  };
}
function yt() {
  const [t, n] = M({});
  function e(r) {
    n((l) => {
      const c = (l[r] || "desc") === "desc" ? "asc" : "desc";
      return { ...l, [r]: c };
    });
  }
  function a(r, l) {
    return [...r].sort((d, c) => {
      const u = new Date(d.createdAt).getTime(), h = new Date(c.createdAt).getTime();
      return l === "asc" ? u - h : h - u;
    });
  }
  function s(r) {
    return r === "asc" ? "↑" : "↓";
  }
  function o(r) {
    return r === "asc" ? "Sorted by age (oldest first) - click to sort newest first" : "Sorted by age (newest first) - click to sort oldest first";
  }
  return {
    sortDirections: t,
    toggleSort: e,
    sortTasksByAge: a,
    getSortIcon: s,
    getSortTitle: o
  };
}
const we = 5, wt = 300, ce = "1.0", ve = "task-storage-version", vt = [
  /^tasks-/,
  // tasks-main, tasks-work
  /^stats-/,
  // stats-main, stats-work
  /^boards$/,
  // boards (without prefix)
  /^preferences$/
  // preferences (without prefix)
], bt = {
  version: 1,
  updatedAt: (/* @__PURE__ */ new Date()).toISOString(),
  experimentalThemes: !1,
  alwaysVerticalLayout: !1,
  theme: "light",
  showCompleteButton: !0,
  showDeleteButton: !0,
  showTagButton: !1
};
function St(t, n) {
  const e = window.localStorage.getItem(ve);
  e !== ce && (console.log("[Preferences] Storage version mismatch, cleaning up orphaned keys", {
    current: e,
    expected: ce
  }), Object.keys(window.localStorage).forEach((a) => {
    const s = vt.some((r) => r.test(a)), o = a.includes(`${t}-${n}`);
    s && !o && (console.log("[Preferences] Removing orphaned key:", a), window.localStorage.removeItem(a));
  }), window.localStorage.setItem(ve, ce), console.log("[Preferences] Storage upgraded to version", ce));
}
function Ct(t) {
  try {
    const n = sessionStorage.getItem("theme"), e = sessionStorage.getItem("showCompleteButton"), a = sessionStorage.getItem("showDeleteButton"), s = sessionStorage.getItem("showTagButton"), o = {};
    return n && !t.theme && (o.theme = n), e !== null && t.showCompleteButton === void 0 && (o.showCompleteButton = e === "true"), a !== null && t.showDeleteButton === void 0 && (o.showDeleteButton = a === "true"), s !== null && t.showTagButton === void 0 && (o.showTagButton = s === "true"), Object.keys(o).length > 0 ? (console.log("[Preferences] Migrating settings from sessionStorage to localStorage:", o), sessionStorage.removeItem("theme"), sessionStorage.removeItem("showCompleteButton"), sessionStorage.removeItem("showDeleteButton"), sessionStorage.removeItem("showTagButton"), o) : null;
  } catch (n) {
    return console.warn("[Preferences] Failed to migrate settings:", n), null;
  }
}
function xt(t, n) {
  const [e, a] = M(bt), [s, o] = M(!1);
  Z(() => {
    (async () => {
      St(t, n), console.log("[usePreferences] Loading preferences...", { userType: t, sessionId: n });
      const c = de(t, n), u = await c.getPreferences();
      if (console.log("[usePreferences] Loaded preferences:", u), u) {
        const h = Ct(u);
        if (h) {
          const p = { ...u, ...h, updatedAt: (/* @__PURE__ */ new Date()).toISOString() };
          a(p), await c.savePreferences(p), console.log("[usePreferences] Applied and saved migrations");
        } else
          a(u), console.log("[usePreferences] Applied preferences to state");
      }
      o(!0);
    })();
  }, [t, n]);
  const r = async (d) => {
    const c = { ...e, ...d, updatedAt: (/* @__PURE__ */ new Date()).toISOString() };
    a(c), await de(t, n).savePreferences(c);
  }, l = e.theme?.endsWith("-dark") || e.theme === "dark";
  return {
    preferences: e,
    savePreferences: r,
    preferencesLoaded: s,
    isDarkTheme: l
  };
}
const Q = {
  width: 20,
  height: 20,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round"
}, Bt = () => /* @__PURE__ */ k("svg", { ...Q, children: [
  /* @__PURE__ */ i("circle", { cx: "12", cy: "12", r: "5" }),
  /* @__PURE__ */ i("line", { x1: "12", y1: "1", x2: "12", y2: "3" }),
  /* @__PURE__ */ i("line", { x1: "12", y1: "21", x2: "12", y2: "23" }),
  /* @__PURE__ */ i("line", { x1: "4.22", y1: "4.22", x2: "5.64", y2: "5.64" }),
  /* @__PURE__ */ i("line", { x1: "18.36", y1: "18.36", x2: "19.78", y2: "19.78" }),
  /* @__PURE__ */ i("line", { x1: "1", y1: "12", x2: "3", y2: "12" }),
  /* @__PURE__ */ i("line", { x1: "21", y1: "12", x2: "23", y2: "12" }),
  /* @__PURE__ */ i("line", { x1: "4.22", y1: "19.78", x2: "5.64", y2: "18.36" }),
  /* @__PURE__ */ i("line", { x1: "18.36", y1: "5.64", x2: "19.78", y2: "4.22" })
] }), Pe = () => /* @__PURE__ */ i("svg", { ...Q, children: /* @__PURE__ */ i("path", { d: "M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" }) }), be = () => /* @__PURE__ */ k("svg", { ...Q, children: [
  /* @__PURE__ */ i("path", { d: "M12 21 C12 21 6.5 15 6.5 11 C6.5 8.5 8 7 10 7 C11 7 12 7.5 12 7.5 C12 7.5 13 7 14 7 C16 7 17.5 8.5 17.5 11 C17.5 15 12 21 12 21 Z", fill: "currentColor" }),
  /* @__PURE__ */ i("path", { d: "M9.5 7.5 L9 5 L11 5.5 Z", fill: "currentColor" }),
  /* @__PURE__ */ i("path", { d: "M14.5 7.5 L15 5 L13 5.5 Z", fill: "currentColor" }),
  /* @__PURE__ */ i("path", { d: "M12 7.5 L12 4 L12 5", stroke: "currentColor", strokeWidth: "1.5", fill: "none" }),
  /* @__PURE__ */ i("line", { x1: "10", y1: "10", x2: "10", y2: "11", stroke: "currentColor", strokeWidth: "1", opacity: "0.4" }),
  /* @__PURE__ */ i("line", { x1: "14", y1: "10", x2: "14", y2: "11", stroke: "currentColor", strokeWidth: "1", opacity: "0.4" }),
  /* @__PURE__ */ i("line", { x1: "9", y1: "13", x2: "9", y2: "14", stroke: "currentColor", strokeWidth: "1", opacity: "0.4" }),
  /* @__PURE__ */ i("line", { x1: "15", y1: "13", x2: "15", y2: "14", stroke: "currentColor", strokeWidth: "1", opacity: "0.4" }),
  /* @__PURE__ */ i("line", { x1: "11", y1: "16", x2: "11", y2: "17", stroke: "currentColor", strokeWidth: "1", opacity: "0.4" }),
  /* @__PURE__ */ i("line", { x1: "13", y1: "16", x2: "13", y2: "17", stroke: "currentColor", strokeWidth: "1", opacity: "0.4" })
] }), Se = () => /* @__PURE__ */ k("svg", { ...Q, children: [
  /* @__PURE__ */ i("path", { d: "M2 12c2-2 4-2 6 0s4 2 6 0 4-2 6 0" }),
  /* @__PURE__ */ i("path", { d: "M2 17c2-2 4-2 6 0s4 2 6 0 4-2 6 0" }),
  /* @__PURE__ */ i("path", { d: "M2 7c2-2 4-2 6 0s4 2 6 0 4-2 6 0" })
] }), Ce = () => /* @__PURE__ */ i("svg", { ...Q, children: /* @__PURE__ */ i("polygon", { points: "13 2 3 14 12 14 11 22 21 10 12 10 13 2" }) }), xe = () => /* @__PURE__ */ k("svg", { ...Q, children: [
  /* @__PURE__ */ i("path", { d: "M18 8h1a4 4 0 0 1 0 8h-1" }),
  /* @__PURE__ */ i("path", { d: "M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" }),
  /* @__PURE__ */ i("line", { x1: "6", y1: "1", x2: "6", y2: "4" }),
  /* @__PURE__ */ i("line", { x1: "10", y1: "1", x2: "10", y2: "4" }),
  /* @__PURE__ */ i("line", { x1: "14", y1: "1", x2: "14", y2: "4" })
] }), Be = () => /* @__PURE__ */ k("svg", { ...Q, children: [
  /* @__PURE__ */ i("circle", { cx: "12", cy: "12", r: "2", fill: "currentColor" }),
  /* @__PURE__ */ i("circle", { cx: "12", cy: "6", r: "2.5", fill: "none", stroke: "currentColor", strokeWidth: "2" }),
  /* @__PURE__ */ i("circle", { cx: "18", cy: "10", r: "2.5", fill: "none", stroke: "currentColor", strokeWidth: "2" }),
  /* @__PURE__ */ i("circle", { cx: "16", cy: "16", r: "2.5", fill: "none", stroke: "currentColor", strokeWidth: "2" }),
  /* @__PURE__ */ i("circle", { cx: "8", cy: "16", r: "2.5", fill: "none", stroke: "currentColor", strokeWidth: "2" }),
  /* @__PURE__ */ i("circle", { cx: "6", cy: "10", r: "2.5", fill: "none", stroke: "currentColor", strokeWidth: "2" })
] }), De = () => /* @__PURE__ */ i("svg", { ...Q, children: /* @__PURE__ */ i("path", { d: "M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z", fill: "currentColor" }) }), Dt = () => /* @__PURE__ */ k("svg", { ...Q, children: [
  /* @__PURE__ */ i("rect", { x: "11", y: "1", width: "2", height: "3", fill: "currentColor" }),
  /* @__PURE__ */ i("rect", { x: "16.5", y: "3.5", width: "3", height: "2", fill: "currentColor", transform: "rotate(45 18 4.5)" }),
  /* @__PURE__ */ i("rect", { x: "19", y: "11", width: "3", height: "2", fill: "currentColor" }),
  /* @__PURE__ */ i("rect", { x: "16.5", y: "18.5", width: "3", height: "2", fill: "currentColor", transform: "rotate(-45 18 19.5)" }),
  /* @__PURE__ */ i("rect", { x: "11", y: "20", width: "2", height: "3", fill: "currentColor" }),
  /* @__PURE__ */ i("rect", { x: "4.5", y: "18.5", width: "3", height: "2", fill: "currentColor", transform: "rotate(45 6 19.5)" }),
  /* @__PURE__ */ i("rect", { x: "2", y: "11", width: "3", height: "2", fill: "currentColor" }),
  /* @__PURE__ */ i("rect", { x: "4.5", y: "3.5", width: "3", height: "2", fill: "currentColor", transform: "rotate(-45 6 4.5)" }),
  /* @__PURE__ */ i("circle", { cx: "12", cy: "12", r: "7", fill: "currentColor" }),
  /* @__PURE__ */ i("circle", { cx: "12", cy: "12", r: "4", fill: "var(--color-bg-card)" })
] }), Nt = () => /* @__PURE__ */ k("svg", { ...Q, width: 16, height: 16, viewBox: "0 0 20 20", children: [
  /* @__PURE__ */ i(
    "path",
    {
      d: "M2 4 L12 4 L16 10 L12 16 L2 16 Z",
      fill: "currentColor"
    }
  ),
  /* @__PURE__ */ i("circle", { cx: "6", cy: "10", r: "1.5", fill: "white" })
] }), Ne = [
  {
    lightIcon: /* @__PURE__ */ i(Bt, {}),
    darkIcon: /* @__PURE__ */ i(Pe, {}),
    lightTheme: "light",
    darkTheme: "dark",
    lightLabel: "Light",
    darkLabel: "Dark"
  },
  {
    lightIcon: /* @__PURE__ */ i(be, {}),
    darkIcon: /* @__PURE__ */ i(be, {}),
    lightTheme: "strawberry-light",
    darkTheme: "strawberry-dark",
    lightLabel: "Strawberry Light",
    darkLabel: "Strawberry Dark"
  },
  {
    lightIcon: /* @__PURE__ */ i(Se, {}),
    darkIcon: /* @__PURE__ */ i(Se, {}),
    lightTheme: "ocean-light",
    darkTheme: "ocean-dark",
    lightLabel: "Ocean Light",
    darkLabel: "Ocean Dark"
  },
  {
    lightIcon: /* @__PURE__ */ i(Ce, {}),
    darkIcon: /* @__PURE__ */ i(Ce, {}),
    lightTheme: "cyberpunk-light",
    darkTheme: "cyberpunk-dark",
    lightLabel: "Cyberpunk Light",
    darkLabel: "Cyberpunk Dark"
  },
  {
    lightIcon: /* @__PURE__ */ i(xe, {}),
    darkIcon: /* @__PURE__ */ i(xe, {}),
    lightTheme: "coffee-light",
    darkTheme: "coffee-dark",
    lightLabel: "Coffee Light",
    darkLabel: "Coffee Dark"
  },
  {
    lightIcon: /* @__PURE__ */ i(Be, {}),
    darkIcon: /* @__PURE__ */ i(Be, {}),
    lightTheme: "lavender-light",
    darkTheme: "lavender-dark",
    lightLabel: "Lavender Light",
    darkLabel: "Lavender Dark"
  }
], At = [
  {
    lightIcon: /* @__PURE__ */ i(De, {}),
    darkIcon: /* @__PURE__ */ i(De, {}),
    lightTheme: "pink-light",
    darkTheme: "pink-dark",
    lightLabel: "Pink Light",
    darkLabel: "Pink Dark"
  }
];
function $e(t) {
  return t ? [...Ne, ...At] : Ne;
}
function Et(t, n) {
  const a = $e(n).find(
    (s) => s.lightTheme === t || s.darkTheme === t
  );
  return a ? t.endsWith("-dark") || t === "dark" ? a.darkIcon : a.lightIcon : /* @__PURE__ */ i(Pe, {});
}
function Mt(t, n, e) {
  const [a, s] = M(!1), o = oe(null), r = t.theme || "light", l = (c) => n({ theme: c }), d = _e(
    () => $e(t.experimentalThemes || !1),
    [t.experimentalThemes]
  );
  return Z(() => {
    e.current && e.current.setAttribute("data-theme", r);
  }, [r, e]), Z(() => {
    const c = window.matchMedia("(prefers-color-scheme: dark)"), u = (h) => {
      const p = h.matches, D = r.replace(/-light$|-dark$/, ""), v = r.endsWith("-dark") ? "dark" : r.endsWith("-light") ? "light" : null;
      if (v && D !== "light" && D !== "dark") {
        const A = p ? "dark" : "light";
        if (v !== A) {
          const R = `${D}-${A}`;
          console.log(`[Theme] Auto-switching from ${r} to ${R} (system preference)`), l(R);
        }
      }
    };
    return c.addEventListener ? c.addEventListener("change", u) : c.addListener(u), () => {
      c.removeEventListener ? c.removeEventListener("change", u) : c.removeListener(u);
    };
  }, [r, l]), {
    theme: r,
    showThemePicker: a,
    setShowThemePicker: s,
    themePickerRef: o,
    THEME_FAMILIES: d,
    setTheme: l
  };
}
function ge(t, n, e, a) {
  Z(() => {
    if (!n) return;
    const s = (o) => {
      const r = o.target;
      t.current && t.current.contains(r) || a && r.closest(a) || e();
    };
    return document.addEventListener("mousedown", s), () => document.removeEventListener("mousedown", s);
  }, [t, n, e, a]);
}
function _t() {
  const [t, n] = M(null), [e, a] = M(!1), [s, o] = M(!1), [r, l] = M(!1), [d, c] = M(null), [u, h] = M(""), [p, D] = M(null), [v, A] = M(null), [R, $] = M(""), [K, J] = M(null), [U, W] = M(null);
  return {
    confirmClearTag: t,
    setConfirmClearTag: n,
    showNewBoardDialog: e,
    setShowNewBoardDialog: a,
    showNewTagDialog: s,
    setShowNewTagDialog: o,
    showSettingsModal: r,
    setShowSettingsModal: l,
    editTagModal: d,
    setEditTagModal: c,
    editTagInput: u,
    setEditTagInput: h,
    boardContextMenu: p,
    setBoardContextMenu: D,
    tagContextMenu: v,
    setTagContextMenu: A,
    inputValue: R,
    setInputValue: $,
    validationError: K,
    setValidationError: J,
    pendingTaskOperation: U,
    setPendingTaskOperation: W
  };
}
const Ae = 768;
function Ot() {
  const [t, n] = M(() => typeof window > "u" ? !1 : window.innerWidth < Ae);
  return Z(() => {
    if (typeof window > "u") return;
    const e = window.matchMedia(`(max-width: ${Ae - 1}px)`), a = (s) => {
      n(s.matches);
    };
    return e.addEventListener ? e.addEventListener("change", a) : e.addListener(a), a(e), () => {
      e.removeEventListener ? e.removeEventListener("change", a) : e.removeListener(a);
    };
  }, []), t;
}
function Lt({ isDarkTheme: t }) {
  return /* @__PURE__ */ i("div", { className: "task-app-loading", "data-dark-theme": t ? "true" : "false", children: /* @__PURE__ */ k("div", { className: "task-app-loading__skeleton", children: [
    /* @__PURE__ */ i("div", { className: "skeleton-header" }),
    /* @__PURE__ */ k("div", { className: "skeleton-boards", children: [
      /* @__PURE__ */ i("div", { className: "skeleton-board" }),
      /* @__PURE__ */ i("div", { className: "skeleton-board" }),
      /* @__PURE__ */ i("div", { className: "skeleton-board" })
    ] }),
    /* @__PURE__ */ i("div", { className: "skeleton-input" }),
    /* @__PURE__ */ k("div", { className: "skeleton-filters", children: [
      /* @__PURE__ */ i("div", { className: "skeleton-filter" }),
      /* @__PURE__ */ i("div", { className: "skeleton-filter" }),
      /* @__PURE__ */ i("div", { className: "skeleton-filter" })
    ] }),
    /* @__PURE__ */ k("div", { className: "skeleton-tasks", children: [
      /* @__PURE__ */ i("div", { className: "skeleton-task" }),
      /* @__PURE__ */ i("div", { className: "skeleton-task" }),
      /* @__PURE__ */ i("div", { className: "skeleton-task" })
    ] })
  ] }) });
}
function It({
  theme: t,
  experimentalThemes: n,
  showThemePicker: e,
  onThemePickerToggle: a,
  onThemeChange: s,
  onSettingsClick: o,
  themePickerRef: r,
  THEME_FAMILIES: l
}) {
  return /* @__PURE__ */ k("div", { className: "task-app__header-container", children: [
    /* @__PURE__ */ i(
      "h1",
      {
        className: "task-app__header",
        onClick: o,
        style: { cursor: "pointer" },
        title: "Settings",
        children: "Tasks"
      }
    ),
    /* @__PURE__ */ k("div", { className: "theme-picker", ref: r, children: [
      /* @__PURE__ */ i(
        "button",
        {
          className: "theme-toggle-btn",
          onClick: a,
          "aria-label": "Choose theme",
          title: "Choose theme",
          children: Et(t, n)
        }
      ),
      e && /* @__PURE__ */ k("div", { className: "theme-picker__dropdown", children: [
        /* @__PURE__ */ i("div", { className: "theme-picker__pills", children: l.map((d, c) => /* @__PURE__ */ k("div", { className: "theme-pill", children: [
          /* @__PURE__ */ i(
            "button",
            {
              className: `theme-pill__btn theme-pill__btn--light ${t === d.lightTheme ? "active" : ""}`,
              onClick: () => s(d.lightTheme),
              title: d.lightLabel,
              "aria-label": d.lightLabel,
              children: /* @__PURE__ */ i("div", { className: "theme-pill__icon", children: d.lightIcon })
            }
          ),
          /* @__PURE__ */ i(
            "button",
            {
              className: `theme-pill__btn theme-pill__btn--dark ${t === d.darkTheme ? "active" : ""}`,
              onClick: () => s(d.darkTheme),
              title: d.darkLabel,
              "aria-label": d.darkLabel,
              children: /* @__PURE__ */ i("div", { className: "theme-pill__icon", children: d.darkIcon })
            }
          )
        ] }, c)) }),
        /* @__PURE__ */ i(
          "button",
          {
            className: "theme-picker__settings-icon",
            onClick: () => {
              o(), a();
            },
            "aria-label": "Settings",
            title: "Settings",
            children: /* @__PURE__ */ i(Dt, {})
          }
        )
      ] })
    ] })
  ] });
}
function Fe({ onLongPress: t, delay: n = 500 }) {
  const e = oe(null);
  return {
    onTouchStart: (r) => {
      const l = r.touches[0];
      e.current = window.setTimeout(() => {
        t(l.clientX, l.clientY);
      }, n);
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
  let n = [];
  try {
    const e = t.getData("application/x-hadoku-task-ids");
    e && (n = JSON.parse(e));
  } catch {
  }
  if (n.length === 0) {
    const e = t.getData("text/plain");
    e && (n = [e]);
  }
  return n;
}
function Pt({
  board: t,
  isActive: n,
  isDragOver: e,
  onSwitch: a,
  onContextMenu: s,
  onDragOverFilter: o,
  onMoveTasksToBoard: r,
  onClearSelection: l
}) {
  const d = Fe({
    onLongPress: (u, h) => s(t.id, u, h)
  }), c = t.id === "main";
  return /* @__PURE__ */ i(
    "button",
    {
      className: `board-btn ${n ? "board-btn--active" : ""} ${e ? "board-btn--drag-over" : ""}`,
      onClick: () => a(t.id),
      onContextMenu: (u) => {
        u.preventDefault(), !c && s(t.id, u.clientX, u.clientY);
      },
      ...c ? {} : d,
      "aria-pressed": n ? "true" : "false",
      onDragOver: (u) => {
        u.preventDefault(), u.dataTransfer.dropEffect = "move", o(`board:${t.id}`);
      },
      onDragLeave: (u) => {
        o(null);
      },
      onDrop: async (u) => {
        u.preventDefault(), o(null);
        const h = me(u.dataTransfer);
        if (h.length !== 0)
          try {
            await r(t.id, h);
            try {
              l();
            } catch {
            }
          } catch (p) {
            console.error("Failed moving tasks to board", p), alert(p.message || "Failed to move tasks");
          }
      },
      children: t.name
    }
  );
}
function $t({
  boards: t,
  currentBoardId: n,
  userType: e,
  dragOverFilter: a,
  onBoardSwitch: s,
  onBoardContextMenu: o,
  onDragOverFilter: r,
  onMoveTasksToBoard: l,
  onClearSelection: d,
  onCreateBoardClick: c,
  onPendingOperation: u,
  onInitialLoad: h
}) {
  const [p, D] = M(!1), v = t && t.boards ? t.boards.slice(0, we) : [{ id: "main", name: "main", tasks: [], tags: [] }], A = !t || t.boards && t.boards.length < we, R = async ($) => {
    if (p) return;
    console.log("[BoardsSection] Manual refresh triggered"), D(!0);
    const K = $.currentTarget, J = new Promise((U, W) => {
      setTimeout(() => W(new Error("Sync timeout")), 5e3);
    });
    try {
      await Promise.race([h(), J]), console.log("[BoardsSection] Sync completed successfully");
    } catch (U) {
      console.error("[BoardsSection] Sync failed:", U);
    } finally {
      D(!1), K?.blur();
    }
  };
  return /* @__PURE__ */ k("div", { className: "task-app__boards", children: [
    /* @__PURE__ */ i("div", { className: "task-app__board-list", children: v.map(($) => /* @__PURE__ */ i(
      Pt,
      {
        board: $,
        isActive: n === $.id,
        isDragOver: a === `board:${$.id}`,
        onSwitch: s,
        onContextMenu: o,
        onDragOverFilter: r,
        onMoveTasksToBoard: l,
        onClearSelection: d
      },
      $.id
    )) }),
    /* @__PURE__ */ k("div", { className: "task-app__board-actions", children: [
      A && /* @__PURE__ */ i(
        "button",
        {
          className: `board-add-btn ${a === "add-board" ? "board-btn--drag-over" : ""}`,
          onClick: c,
          onDragOver: ($) => {
            $.preventDefault(), $.dataTransfer.dropEffect = "move", r("add-board");
          },
          onDragLeave: () => r(null),
          onDrop: ($) => {
            $.preventDefault(), r(null);
            const K = me($.dataTransfer);
            K.length > 0 && (u({ type: "move-to-board", taskIds: K }), c());
          },
          "aria-label": "Create board",
          children: "＋"
        }
      ),
      e !== "public" && /* @__PURE__ */ i(
        "button",
        {
          className: `sync-btn ${p ? "spinning" : ""}`,
          onClick: R,
          disabled: p,
          title: "Sync from server",
          "aria-label": "Sync from server",
          children: /* @__PURE__ */ k("svg", { width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [
            /* @__PURE__ */ i("polyline", { points: "23 4 23 10 17 10" }),
            /* @__PURE__ */ i("polyline", { points: "1 20 1 14 7 14" }),
            /* @__PURE__ */ i("path", { d: "M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" })
          ] })
        }
      )
    ] })
  ] });
}
function Ft({
  tag: t,
  isActive: n,
  isDragOver: e,
  onToggle: a,
  onContextMenu: s,
  onDragOver: o,
  onDragLeave: r,
  onDrop: l
}) {
  const d = Fe({
    onLongPress: (c, u) => s(t, c, u)
  });
  return /* @__PURE__ */ k(
    "button",
    {
      onClick: () => a(t),
      onContextMenu: (c) => {
        c.preventDefault(), s(t, c.clientX, c.clientY);
      },
      ...d,
      className: `${n ? "on" : ""} ${e ? "task-app__filter-drag-over" : ""}`,
      onDragOver: (c) => o(c, t),
      onDragLeave: r,
      onDrop: (c) => l(c, t),
      children: [
        "#",
        t
      ]
    }
  );
}
function Rt({
  tags: t,
  selectedFilters: n,
  dragOverFilter: e,
  onToggleFilter: a,
  onTagContextMenu: s,
  onDragOver: o,
  onDragLeave: r,
  onDrop: l,
  onCreateTagClick: d,
  onPendingOperation: c
}) {
  const u = (h) => {
    h.preventDefault(), r(h);
    const p = me(h.dataTransfer);
    p.length > 0 && (c({ type: "apply-tag", taskIds: p }), d());
  };
  return /* @__PURE__ */ k("div", { className: "task-app__filters", children: [
    t.map((h) => /* @__PURE__ */ i(
      Ft,
      {
        tag: h,
        isActive: n.has(h),
        isDragOver: e === h,
        onToggle: a,
        onContextMenu: s,
        onDragOver: o,
        onDragLeave: r,
        onDrop: l
      },
      h
    )),
    /* @__PURE__ */ i(
      "button",
      {
        className: `task-app__filter-add ${e === "add-tag" ? "task-app__filter-drag-over" : ""}`,
        onClick: d,
        onDragOver: (h) => {
          h.preventDefault(), h.dataTransfer.dropEffect = "copy", o(h, "add-tag");
        },
        onDragLeave: r,
        onDrop: u,
        "aria-label": "Add tag",
        children: "＋"
      }
    )
  ] });
}
function Kt(t) {
  const n = /* @__PURE__ */ new Date(), e = new Date(t), a = n.getTime() - e.getTime(), s = Math.floor(a / 1e3), o = Math.floor(s / 60), r = Math.floor(o / 60), l = Math.floor(r / 24);
  return s < 60 ? `${s}s ago` : o < 60 ? `${o}m ago` : r < 24 ? `${r}h ago` : `${l}d ago`;
}
function he({
  task: t,
  isDraggable: n = !0,
  pendingOperations: e,
  onComplete: a,
  onDelete: s,
  onEditTag: o,
  onDragStart: r,
  onDragEnd: l,
  selected: d = !1,
  showCompleteButton: c = !0,
  showDeleteButton: u = !0,
  showTagButton: h = !1
}) {
  const p = e.has(`complete-${t.id}`), D = e.has(`delete-${t.id}`);
  return /* @__PURE__ */ k(
    "li",
    {
      className: `task-app__item ${d ? "selected" : ""}`,
      "data-task-id": t.id,
      draggable: n,
      onDragStart: r ? (v) => r(v, t.id) : void 0,
      onDragEnd: (v) => {
        if (v.currentTarget.classList.remove("dragging"), l)
          try {
            l(v);
          } catch {
          }
      },
      children: [
        /* @__PURE__ */ k("div", { className: "task-app__item-content", children: [
          /* @__PURE__ */ i("div", { className: "task-app__item-title", title: t.title, children: t.title }),
          /* @__PURE__ */ k("div", { className: "task-app__item-meta-row", children: [
            t.tag ? /* @__PURE__ */ i("div", { className: "task-app__item-tag", children: t.tag.split(" ").sort().map((v) => `#${v}`).join(" ") }) : /* @__PURE__ */ i("div", {}),
            /* @__PURE__ */ i("div", { className: "task-app__item-age", children: Kt(t.createdAt) })
          ] })
        ] }),
        /* @__PURE__ */ k("div", { className: "task-app__item-actions", children: [
          h && /* @__PURE__ */ i(
            "button",
            {
              className: "task-app__action-btn task-app__edit-tag-btn",
              onClick: () => o(t.id),
              title: "Edit tags",
              disabled: p || D,
              children: /* @__PURE__ */ i(Nt, {})
            }
          ),
          c && /* @__PURE__ */ i(
            "button",
            {
              className: "task-app__action-btn task-app__complete-btn",
              onClick: () => a(t.id),
              title: "Complete task",
              disabled: p || D,
              children: p ? "⏳" : "✓"
            }
          ),
          u && /* @__PURE__ */ i(
            "button",
            {
              className: "task-app__action-btn task-app__delete-btn",
              onClick: () => s(t.id),
              title: "Delete task",
              disabled: p || D,
              children: D ? "⏳" : "×"
            }
          )
        ] })
      ]
    }
  );
}
function Ee(t, n = !1) {
  if (t === 0)
    return { useTags: 0, maxPerColumn: 1 / 0, rows: [] };
  if (n) {
    const e = Array.from({ length: t }, (a, s) => ({
      columns: 1,
      tagIndices: [s]
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
function Ut({
  tasks: t,
  topTags: n,
  isMobile: e = !1,
  filters: a,
  sortDirections: s,
  dragOverTag: o,
  pendingOperations: r,
  onComplete: l,
  onDelete: d,
  onEditTag: c,
  onDragStart: u,
  onDragEnd: h,
  selectedIds: p,
  onSelectionStart: D,
  onSelectionMove: v,
  onSelectionEnd: A,
  onDragOver: R,
  onDragLeave: $,
  onDrop: K,
  toggleSort: J,
  sortTasksByAge: U,
  getSortIcon: W,
  getSortTitle: X,
  deleteTag: q,
  onDeletePersistedTag: ae,
  showCompleteButton: G = !0,
  showDeleteButton: f = !0,
  showTagButton: b = !1
}) {
  const B = (y, F) => /* @__PURE__ */ k(
    "div",
    {
      className: `task-app__tag-column ${o === y ? "task-app__tag-column--drag-over" : ""}`,
      onDragOver: (O) => R(O, y),
      onDragLeave: $,
      onDrop: (O) => K(O, y),
      children: [
        /* @__PURE__ */ k("div", { className: "task-app__tag-header-row", children: [
          /* @__PURE__ */ k("h3", { className: "task-app__tag-header", children: [
            "#",
            y
          ] }),
          /* @__PURE__ */ i(
            "button",
            {
              className: "task-app__sort-btn task-app__sort-btn--active",
              onClick: () => J(y),
              title: X(s[y] || "desc"),
              children: W(s[y] || "desc")
            }
          )
        ] }),
        /* @__PURE__ */ i("ul", { className: "task-app__list task-app__list--column", children: U(F, s[y] || "desc").map((O) => /* @__PURE__ */ i(
          he,
          {
            task: O,
            isDraggable: !0,
            pendingOperations: r,
            onComplete: l,
            onDelete: d,
            onEditTag: c,
            onDragStart: u,
            onDragEnd: h,
            selected: p ? p.has(O.id) : !1,
            showCompleteButton: G,
            showDeleteButton: f,
            showTagButton: b
          },
          O.id
        )) })
      ]
    },
    y
  ), m = (y, F) => {
    let O = Te(t, y);
    return S && (O = O.filter((w) => {
      const V = w.tag?.split(" ") || [];
      return a.some((g) => V.includes(g));
    })), O.slice(0, F);
  }, T = n.length, S = Array.isArray(a) && a.length > 0, x = t.filter((y) => {
    if (!S) return !0;
    const F = y.tag?.split(" ") || [];
    return a.some((O) => F.includes(O));
  }), E = Ee(T, e), N = S ? n.filter((y) => Te(t, y).some((O) => {
    const w = O.tag?.split(" ") || [];
    return a.some((V) => w.includes(V));
  })) : n.slice(0, E.useTags);
  if (N.length === 0)
    return /* @__PURE__ */ i("ul", { className: "task-app__list", children: x.map((y) => /* @__PURE__ */ i(
      he,
      {
        task: y,
        pendingOperations: r,
        onComplete: l,
        onDelete: d,
        onEditTag: c,
        onDragStart: u,
        onDragEnd: h,
        selected: p ? p.has(y.id) : !1,
        showCompleteButton: G,
        showDeleteButton: f,
        showTagButton: b
      },
      y.id
    )) });
  const L = ft(t, n, a).filter((y) => {
    if (!S) return !0;
    const F = y.tag?.split(" ") || [];
    return a.some((O) => F.includes(O));
  }), I = Ee(N.length, e);
  return /* @__PURE__ */ k("div", { className: "task-app__dynamic-layout", children: [
    I.rows.length > 0 && /* @__PURE__ */ i(Ye, { children: I.rows.map((y, F) => /* @__PURE__ */ i("div", { className: `task-app__tag-grid task-app__tag-grid--${y.columns}col`, children: y.tagIndices.map((O) => {
      const w = N[O];
      return w ? B(w, m(w, I.maxPerColumn)) : null;
    }) }, F)) }),
    L.length > 0 && /* @__PURE__ */ k(
      "div",
      {
        className: `task-app__remaining ${o === "other" ? "task-app__tag-column--drag-over" : ""}`,
        onDragOver: (y) => {
          y.preventDefault(), y.dataTransfer.dropEffect = "move", R(y, "other");
        },
        onDragLeave: (y) => $(y),
        onDrop: (y) => K(y, "other"),
        children: [
          /* @__PURE__ */ k("div", { className: "task-app__tag-header-row", children: [
            /* @__PURE__ */ i("h3", { className: "task-app__remaining-header", children: "Other Tasks" }),
            /* @__PURE__ */ i(
              "button",
              {
                className: "task-app__sort-btn task-app__sort-btn--active",
                onClick: () => J("other"),
                title: X(s.other || "desc"),
                children: W(s.other || "desc")
              }
            )
          ] }),
          /* @__PURE__ */ i("ul", { className: "task-app__list", children: U(L, s.other || "desc").map((y) => /* @__PURE__ */ i(
            he,
            {
              task: y,
              pendingOperations: r,
              onComplete: l,
              onDelete: d,
              onEditTag: c,
              onDragStart: u,
              onDragEnd: h,
              selected: p ? p.has(y.id) : !1,
              showCompleteButton: G,
              showDeleteButton: f,
              showTagButton: b
            },
            y.id
          )) })
        ]
      }
    )
  ] });
}
function ie({
  isOpen: t,
  title: n,
  onClose: e,
  onConfirm: a,
  children: s,
  inputValue: o,
  onInputChange: r,
  inputPlaceholder: l,
  confirmLabel: d = "Confirm",
  cancelLabel: c = "Cancel",
  confirmDisabled: u = !1,
  confirmDanger: h = !1
}) {
  return t ? /* @__PURE__ */ i(
    "div",
    {
      className: "modal-overlay",
      onClick: e,
      children: /* @__PURE__ */ k(
        "div",
        {
          className: "modal-card",
          onClick: (D) => D.stopPropagation(),
          children: [
            /* @__PURE__ */ i("h3", { children: n }),
            s,
            r && /* @__PURE__ */ i(
              "input",
              {
                type: "text",
                className: "modal-input",
                value: o || "",
                onChange: (D) => r(D.target.value),
                placeholder: l,
                autoFocus: !0,
                onKeyDown: (D) => {
                  D.key === "Enter" && !u && (D.preventDefault(), a()), D.key === "Escape" && (D.preventDefault(), e());
                }
              }
            ),
            /* @__PURE__ */ k("div", { className: "modal-actions", children: [
              /* @__PURE__ */ i(
                "button",
                {
                  className: "modal-button",
                  onClick: e,
                  children: c
                }
              ),
              /* @__PURE__ */ i(
                "button",
                {
                  className: `modal-button ${h ? "modal-button--danger" : "modal-button--primary"}`,
                  onClick: a,
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
function Ht({ tag: t, count: n, isOpen: e, onClose: a, onConfirm: s }) {
  const o = async () => {
    t && (await s(t), a());
  };
  return /* @__PURE__ */ i(
    ie,
    {
      isOpen: e,
      title: `Clear Tag #${t}?`,
      onClose: a,
      onConfirm: o,
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
          n,
          " task(s)"
        ] }),
        " and delete the tag from the board."
      ] })
    }
  );
}
function Jt({
  isOpen: t,
  inputValue: n,
  validationError: e,
  pendingTaskOperation: a,
  onClose: s,
  onConfirm: o,
  onInputChange: r,
  validateBoardName: l
}) {
  const d = async () => {
    !n.trim() || l(n) || await o(n);
  }, c = !n.trim() || l(n) !== null;
  return /* @__PURE__ */ k(
    ie,
    {
      isOpen: t,
      title: "Create New Board",
      onClose: s,
      onConfirm: d,
      inputValue: n,
      onInputChange: r,
      inputPlaceholder: "Board name",
      confirmLabel: "Create",
      confirmDisabled: c,
      children: [
        a?.type === "move-to-board" && a.taskIds.length > 0 && /* @__PURE__ */ k("p", { className: "modal-hint", children: [
          a.taskIds.length,
          " task",
          a.taskIds.length > 1 ? "s" : "",
          " will be moved to this board"
        ] }),
        e && /* @__PURE__ */ i("p", { className: "modal-error", style: { color: "var(--error-color, #d32f2f)", marginTop: "0.5rem" }, children: e })
      ]
    }
  );
}
function Wt({
  isOpen: t,
  inputValue: n,
  tasks: e,
  pendingTaskOperation: a,
  onClose: s,
  onConfirm: o,
  onInputChange: r
}) {
  const l = async () => {
    if (n.trim())
      try {
        await o(n);
      } catch (c) {
        console.error("[CreateTagModal] Failed to create tag:", c);
      }
  }, d = Ie(e);
  return /* @__PURE__ */ k(
    ie,
    {
      isOpen: t,
      title: "Create New Tag",
      onClose: s,
      onConfirm: l,
      inputValue: n,
      onInputChange: r,
      inputPlaceholder: "Enter new tag name",
      confirmLabel: "Create",
      confirmDisabled: !n.trim(),
      children: [
        a?.type === "apply-tag" && a.taskIds.length > 0 && /* @__PURE__ */ k("p", { className: "modal-hint", children: [
          "This tag will be applied to ",
          a.taskIds.length,
          " task",
          a.taskIds.length > 1 ? "s" : ""
        ] }),
        d.length > 0 && /* @__PURE__ */ k("div", { className: "modal-section", children: [
          /* @__PURE__ */ i("label", { className: "modal-label", children: "Existing tags:" }),
          /* @__PURE__ */ i("div", { className: "modal-tags-list", children: d.map((c) => /* @__PURE__ */ k("span", { className: "modal-tag-chip", children: [
            "#",
            c
          ] }, c)) })
        ] })
      ]
    }
  );
}
async function Vt(t, n) {
  const e = t.trim();
  if (!e)
    return { success: !1, error: "Key cannot be empty" };
  try {
    if (await n(e)) {
      const s = new URL(window.location.href);
      return s.searchParams.set("key", e), window.location.href = s.toString(), { success: !0 };
    } else
      return { success: !1, error: "Invalid key" };
  } catch (a) {
    return console.error("[Auth] Key validation failed:", a), { success: !1, error: "Failed to validate key" };
  }
}
function jt({
  isOpen: t,
  preferences: n,
  showCompleteButton: e,
  showDeleteButton: a,
  showTagButton: s,
  onClose: o,
  onSavePreferences: r,
  onValidateKey: l
}) {
  const [d, c] = M(""), [u, h] = M(null), [p, D] = M(!1), v = async () => {
    if (!d.trim() || p) return;
    D(!0), h(null);
    const A = await Vt(d, l);
    A.success || (h(A.error || "Failed to validate key"), D(!1));
  };
  return /* @__PURE__ */ k(
    ie,
    {
      isOpen: t,
      title: "Settings",
      onClose: o,
      onConfirm: o,
      confirmLabel: "Close",
      cancelLabel: "Close",
      children: [
        /* @__PURE__ */ k("div", { className: "settings-section", children: [
          /* @__PURE__ */ i("h4", { className: "settings-section-title", children: "User Management" }),
          /* @__PURE__ */ k("div", { className: "settings-field", children: [
            /* @__PURE__ */ i("label", { className: "settings-field-label", children: "Enter New Key" }),
            /* @__PURE__ */ k("div", { className: "settings-field-input-group", children: [
              /* @__PURE__ */ i(
                "input",
                {
                  type: "password",
                  name: "key",
                  autoComplete: "key",
                  className: "settings-text-input",
                  value: d,
                  onChange: (A) => {
                    c(A.target.value), h(null);
                  },
                  onKeyDown: (A) => {
                    A.key === "Enter" && d && !p && v();
                  },
                  placeholder: "Enter authentication key",
                  disabled: p
                }
              ),
              d && /* @__PURE__ */ i(
                "button",
                {
                  className: "settings-field-button",
                  onClick: v,
                  disabled: p,
                  children: p ? /* @__PURE__ */ i("span", { className: "spinner" }) : "↵"
                }
              )
            ] }),
            u && /* @__PURE__ */ i("span", { className: "settings-error", children: u })
          ] })
        ] }),
        /* @__PURE__ */ k("div", { className: "settings-section", children: [
          /* @__PURE__ */ i("h4", { className: "settings-section-title", children: "Preferences" }),
          /* @__PURE__ */ k("label", { className: "settings-option", children: [
            /* @__PURE__ */ i(
              "input",
              {
                type: "checkbox",
                checked: n.experimentalThemes || !1,
                onChange: (A) => {
                  r({ experimentalThemes: A.target.checked });
                }
              }
            ),
            /* @__PURE__ */ k("span", { className: "settings-label", children: [
              /* @__PURE__ */ i("strong", { children: "Experimental Themes" }),
              /* @__PURE__ */ i("span", { className: "settings-description", children: "Enable access to experimental theme options" })
            ] })
          ] }),
          /* @__PURE__ */ k("label", { className: "settings-option", children: [
            /* @__PURE__ */ i(
              "input",
              {
                type: "checkbox",
                checked: n.alwaysVerticalLayout || !1,
                onChange: (A) => {
                  r({ alwaysVerticalLayout: A.target.checked });
                }
              }
            ),
            /* @__PURE__ */ k("span", { className: "settings-label", children: [
              /* @__PURE__ */ i("strong", { children: "Always Use Vertical Layout" }),
              /* @__PURE__ */ i("span", { className: "settings-description", children: "Use mobile-style vertical task layout on all devices" })
            ] })
          ] }),
          /* @__PURE__ */ k("label", { className: "settings-option", children: [
            /* @__PURE__ */ i(
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
              /* @__PURE__ */ i("strong", { children: "Disable Complete Button" }),
              /* @__PURE__ */ i("span", { className: "settings-description", children: "Hide the checkmark (✓) button on task items" })
            ] })
          ] }),
          /* @__PURE__ */ k("label", { className: "settings-option", children: [
            /* @__PURE__ */ i(
              "input",
              {
                type: "checkbox",
                checked: !a,
                onChange: (A) => {
                  r({ showDeleteButton: !A.target.checked });
                }
              }
            ),
            /* @__PURE__ */ k("span", { className: "settings-label", children: [
              /* @__PURE__ */ i("strong", { children: "Disable Delete Button" }),
              /* @__PURE__ */ i("span", { className: "settings-description", children: "Hide the delete (×) button on task items" })
            ] })
          ] }),
          /* @__PURE__ */ k("label", { className: "settings-option", children: [
            /* @__PURE__ */ i(
              "input",
              {
                type: "checkbox",
                checked: s,
                onChange: (A) => {
                  r({ showTagButton: A.target.checked });
                }
              }
            ),
            /* @__PURE__ */ k("span", { className: "settings-label", children: [
              /* @__PURE__ */ i("strong", { children: "Enable Tag Button" }),
              /* @__PURE__ */ i("span", { className: "settings-description", children: "Show tag button on task items" })
            ] })
          ] })
        ] })
      ]
    }
  );
}
function qt({
  isOpen: t,
  taskId: n,
  currentTag: e,
  editTagInput: a,
  boards: s,
  currentBoardId: o,
  onClose: r,
  onConfirm: l,
  onInputChange: d,
  onToggleTagPill: c
}) {
  const h = s?.boards?.find((v) => v.id === o)?.tags || [], p = e?.split(" ").filter(Boolean) || [], D = (v) => {
    v.key === "Enter" && (v.preventDefault(), l());
  };
  return /* @__PURE__ */ i(
    ie,
    {
      isOpen: t,
      title: "Edit Tags",
      onClose: r,
      onConfirm: l,
      confirmLabel: "Save",
      cancelLabel: "Cancel",
      children: /* @__PURE__ */ k("div", { className: "edit-tag-modal", children: [
        h.length > 0 && /* @__PURE__ */ k("div", { className: "edit-tag-pills", children: [
          /* @__PURE__ */ i("label", { className: "edit-tag-label", children: "Select Tags" }),
          /* @__PURE__ */ i("div", { className: "edit-tag-pills-container", children: [...h].sort().map((v) => {
            const A = p.includes(v);
            return /* @__PURE__ */ k(
              "button",
              {
                className: `edit-tag-pill ${A ? "active" : ""}`,
                onClick: () => c(v),
                type: "button",
                children: [
                  "#",
                  v
                ]
              },
              v
            );
          }) })
        ] }),
        /* @__PURE__ */ k("div", { className: "edit-tag-field", children: [
          /* @__PURE__ */ i("label", { className: "edit-tag-label", children: "Add New Tag" }),
          /* @__PURE__ */ i(
            "input",
            {
              type: "text",
              className: "edit-tag-input",
              value: a,
              onChange: (v) => d(v.target.value),
              onKeyDown: D,
              placeholder: "Enter a tag",
              autoFocus: !0
            }
          ),
          /* @__PURE__ */ k("div", { className: "edit-tag-hint", children: [
            /* @__PURE__ */ i("div", { children: '"one tag" → #one-tag' }),
            /* @__PURE__ */ i("div", { children: '"#two #tags" → #two #tags' })
          ] })
        ] })
      ] })
    }
  );
}
function Re({ isOpen: t, x: n, y: e, items: a, className: s = "board-context-menu" }) {
  return t ? /* @__PURE__ */ i(
    "div",
    {
      className: s,
      style: {
        left: `${n}px`,
        top: `${e}px`
      },
      children: a.map((o, r) => /* @__PURE__ */ i(
        "button",
        {
          className: `context-menu-item ${o.isDanger ? "context-menu-item--danger" : ""}`,
          onClick: o.onClick,
          children: o.label
        },
        r
      ))
    }
  ) : null;
}
function Xt({
  isOpen: t,
  boardId: n,
  x: e,
  y: a,
  boards: s,
  onClose: o,
  onDeleteBoard: r
}) {
  return /* @__PURE__ */ i(
    Re,
    {
      isOpen: t,
      x: e,
      y: a,
      items: [
        {
          label: "🗑️ Delete Board",
          isDanger: !0,
          onClick: async () => {
            if (!n) return;
            const d = s?.boards?.find((c) => c.id === n)?.name || n;
            if (confirm(`Delete board "${d}"? All tasks on this board will be permanently deleted.`))
              try {
                await r(n), o();
              } catch (c) {
                console.error("[BoardContextMenu] Failed to delete board:", c), alert(c.message || "Failed to delete board");
              }
          }
        }
      ]
    }
  );
}
function zt({
  isOpen: t,
  tag: n,
  x: e,
  y: a,
  onClose: s,
  onDeleteTag: o
}) {
  return /* @__PURE__ */ i(
    Re,
    {
      isOpen: t,
      x: e,
      y: a,
      className: "tag-context-menu",
      items: [
        {
          label: "🗑️ Delete Tag",
          isDanger: !0,
          onClick: async () => {
            if (console.log("[TagContextMenu] Delete Tag clicked!", { tag: n }), !n) {
              console.error("[TagContextMenu] No tag when Delete clicked!");
              return;
            }
            try {
              console.log("[TagContextMenu] Calling deleteTag for tag:", n), await o(n), console.log("[TagContextMenu] deleteTag completed successfully"), s();
            } catch (l) {
              console.error("[TagContextMenu] Failed to delete tag:", l), alert(l.message || "Failed to delete tag");
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
function Yt() {
  return Me[Math.floor(Math.random() * Me.length)];
}
function Gt(t, n) {
  const e = t.trim();
  return e ? n.map((s) => s.id.toLowerCase()).includes(e.toLowerCase()) ? `Board "${e}" already exists` : null : "Board name cannot be empty";
}
function Zt(t = {}) {
  const { userType: n = "public", sessionId: e = "public" } = t, a = oe(null), s = oe(null), o = Ot(), [r] = M(() => Yt()), [l, d] = M(/* @__PURE__ */ new Set()), { preferences: c, savePreferences: u, preferencesLoaded: h, isDarkTheme: p } = xt(n, e), { theme: D, showThemePicker: v, setShowThemePicker: A, themePickerRef: R, THEME_FAMILIES: $, setTheme: K } = Mt(c, u, s), J = o || c.alwaysVerticalLayout || !1, U = c.showCompleteButton ?? !0, W = c.showDeleteButton ?? !0, X = c.showTagButton ?? !1, {
    tasks: q,
    pendingOperations: ae,
    initialLoad: G,
    addTask: f,
    completeTask: b,
    deleteTask: B,
    updateTaskTags: m,
    bulkUpdateTaskTags: T,
    deleteTag: S,
    boards: x,
    currentBoardId: E,
    createBoard: N,
    deleteBoard: L,
    switchBoard: I,
    moveTasksToBoard: y,
    createTagOnBoard: F,
    deleteTagOnBoard: O
  } = kt({ userType: n, sessionId: e }), w = Tt({
    tasks: q,
    onTaskUpdate: m,
    onBulkUpdate: T
  }), V = yt(), g = _t();
  ge(R, v, () => A(!1)), ge(
    { current: null },
    // Board context menu doesn't need a ref
    !!g.boardContextMenu,
    () => g.setBoardContextMenu(null),
    ".board-context-menu"
  ), ge(
    { current: null },
    // Tag context menu doesn't need a ref
    !!g.tagContextMenu,
    () => g.setTagContextMenu(null),
    ".tag-context-menu"
  ), Z(() => {
    d(/* @__PURE__ */ new Set());
  }, [E]), Z(() => {
    console.log("[App] User context changed, initializing...", { userType: n, sessionId: e }), G(), a.current?.focus();
  }, [n, e]);
  const le = async (C) => {
    await f(C) && a.current && (a.current.value = "", a.current.focus());
  }, Ke = (C) => {
    const _ = q.filter((P) => P.tag?.split(" ").includes(C));
    g.setConfirmClearTag({ tag: C, count: _.length });
  }, Ue = async (C) => {
    const _ = C.trim().replace(/\s+/g, "-");
    try {
      if (await F(_), g.pendingTaskOperation?.type === "apply-tag" && g.pendingTaskOperation.taskIds.length > 0) {
        const P = g.pendingTaskOperation.taskIds.map((z) => {
          const ee = q.find((ze) => ze.id === z)?.tag?.split(" ").filter(Boolean) || [], te = [.../* @__PURE__ */ new Set([...ee, _])];
          return { taskId: z, tag: te.join(" ") };
        });
        await T(P), w.clearSelection();
      }
      g.setPendingTaskOperation(null), g.setShowNewTagDialog(!1), g.setInputValue("");
    } catch (P) {
      throw console.error("[App] Failed to create tag:", P), P;
    }
  }, He = (C) => {
    const _ = q.find((P) => P.id === C);
    _ && (g.setEditTagModal({ taskId: C, currentTag: _.tag || null }), g.setEditTagInput(""));
  }, Je = async () => {
    if (!g.editTagModal) return;
    const { taskId: C, currentTag: _ } = g.editTagModal, P = _?.split(" ").filter(Boolean) || [], z = g.editTagInput.trim() ? g.editTagInput.trim().replace(/\s+/g, "-").split("#").filter(Boolean).map((te) => te.trim()) : [];
    for (const te of z)
      await F(te);
    const ee = [.../* @__PURE__ */ new Set([...P, ...z])].sort().join(" ");
    await m(C, { tag: ee }), g.setEditTagModal(null), g.setEditTagInput("");
  }, We = (C) => {
    if (!g.editTagModal) return;
    const { taskId: _, currentTag: P } = g.editTagModal, z = P?.split(" ").filter(Boolean) || [];
    if (z.includes(C)) {
      const ee = z.filter((te) => te !== C).sort().join(" ");
      g.setEditTagModal({ taskId: _, currentTag: ee });
    } else {
      const ee = [...z, C].sort().join(" ");
      g.setEditTagModal({ taskId: _, currentTag: ee });
    }
  }, fe = (C) => Gt(C, x?.boards || []), Ve = async (C) => {
    const _ = C.trim(), P = fe(_);
    if (P) {
      g.setValidationError(P);
      return;
    }
    try {
      await N(_), g.pendingTaskOperation?.type === "move-to-board" && g.pendingTaskOperation.taskIds.length > 0 && (await y(_, g.pendingTaskOperation.taskIds), w.clearSelection()), g.setPendingTaskOperation(null), g.setValidationError(null), g.setShowNewBoardDialog(!1), g.setInputValue("");
    } catch (z) {
      console.error("[App] Failed to create board:", z), g.setValidationError(z.message || "Failed to create board");
    }
  }, je = x?.boards?.find((C) => C.id === E)?.tags || [], qe = Array.from(/* @__PURE__ */ new Set([...je, ...Ie(q)])), Xe = mt(q, J ? 3 : 6);
  return h ? /* @__PURE__ */ i(
    "div",
    {
      ref: s,
      className: "task-app-container task-app-fade-in",
      "data-dark-theme": p ? "true" : "false",
      onMouseDown: w.selectionStartHandler,
      onMouseMove: w.selectionMoveHandler,
      onMouseUp: w.selectionEndHandler,
      onMouseLeave: w.selectionEndHandler,
      onClick: (C) => {
        try {
          const _ = C.target;
          if (!_.closest || !_.closest(".task-app__item")) {
            if (w.selectionJustEndedAt && Date.now() - w.selectionJustEndedAt < wt)
              return;
            w.clearSelection();
          }
        } catch {
        }
      },
      children: /* @__PURE__ */ k("div", { className: "task-app", children: [
        /* @__PURE__ */ i(
          It,
          {
            theme: D,
            experimentalThemes: c.experimentalThemes || !1,
            showThemePicker: v,
            onThemePickerToggle: () => A(!v),
            onThemeChange: K,
            onSettingsClick: () => g.setShowSettingsModal(!0),
            themePickerRef: R,
            THEME_FAMILIES: $
          }
        ),
        /* @__PURE__ */ i(
          $t,
          {
            boards: x,
            currentBoardId: E,
            userType: n,
            dragOverFilter: w.dragOverFilter,
            onBoardSwitch: I,
            onBoardContextMenu: (C, _, P) => g.setBoardContextMenu({ boardId: C, x: _, y: P }),
            onDragOverFilter: w.setDragOverFilter,
            onMoveTasksToBoard: y,
            onClearSelection: w.clearSelection,
            onCreateBoardClick: () => {
              g.setInputValue(""), g.setValidationError(null), g.setShowNewBoardDialog(!0);
            },
            onPendingOperation: g.setPendingTaskOperation,
            onInitialLoad: G
          }
        ),
        /* @__PURE__ */ i("div", { className: "task-app__controls", children: /* @__PURE__ */ i(
          "input",
          {
            ref: a,
            className: "task-app__input",
            placeholder: r,
            onKeyDown: (C) => {
              C.key === "Enter" && !C.shiftKey && (C.preventDefault(), le(C.target.value)), C.key === "k" && (C.ctrlKey || C.metaKey) && (C.preventDefault(), a.current?.focus());
            }
          }
        ) }),
        /* @__PURE__ */ i(
          Rt,
          {
            tags: qe,
            selectedFilters: l,
            dragOverFilter: w.dragOverFilter,
            onToggleFilter: (C) => {
              d((_) => {
                const P = new Set(_);
                return P.has(C) ? P.delete(C) : P.add(C), P;
              });
            },
            onTagContextMenu: (C, _, P) => g.setTagContextMenu({ tag: C, x: _, y: P }),
            onDragOver: w.onFilterDragOver,
            onDragLeave: w.onFilterDragLeave,
            onDrop: w.onFilterDrop,
            onCreateTagClick: () => {
              g.setInputValue(""), g.setShowNewTagDialog(!0);
            },
            onPendingOperation: g.setPendingTaskOperation
          }
        ),
        /* @__PURE__ */ i(
          Ut,
          {
            tasks: q,
            topTags: Xe,
            isMobile: J,
            filters: Array.from(l),
            selectedIds: w.selectedIds,
            onSelectionStart: w.selectionStartHandler,
            onSelectionMove: w.selectionMoveHandler,
            onSelectionEnd: w.selectionEndHandler,
            sortDirections: V.sortDirections,
            dragOverTag: w.dragOverTag,
            pendingOperations: ae,
            onComplete: b,
            onDelete: B,
            onEditTag: He,
            onDragStart: w.onDragStart,
            onDragEnd: w.onDragEnd,
            onDragOver: w.onDragOver,
            onDragLeave: w.onDragLeave,
            onDrop: w.onDrop,
            toggleSort: V.toggleSort,
            sortTasksByAge: V.sortTasksByAge,
            getSortIcon: V.getSortIcon,
            getSortTitle: V.getSortTitle,
            deleteTag: Ke,
            onDeletePersistedTag: O,
            showCompleteButton: U,
            showDeleteButton: W,
            showTagButton: X
          }
        ),
        w.isSelecting && w.marqueeRect && /* @__PURE__ */ i(
          "div",
          {
            className: "marquee-overlay",
            style: {
              left: `${w.marqueeRect.x}px`,
              top: `${w.marqueeRect.y}px`,
              width: `${w.marqueeRect.w}px`,
              height: `${w.marqueeRect.h}px`
            }
          }
        ),
        /* @__PURE__ */ i(
          Ht,
          {
            tag: g.confirmClearTag?.tag || null,
            count: g.confirmClearTag?.count || 0,
            isOpen: !!g.confirmClearTag,
            onClose: () => g.setConfirmClearTag(null),
            onConfirm: S
          }
        ),
        /* @__PURE__ */ i(
          Jt,
          {
            isOpen: g.showNewBoardDialog,
            inputValue: g.inputValue,
            validationError: g.validationError,
            pendingTaskOperation: g.pendingTaskOperation,
            onClose: () => {
              g.setShowNewBoardDialog(!1), g.setPendingTaskOperation(null), g.setValidationError(null);
            },
            onConfirm: Ve,
            onInputChange: (C) => {
              g.setInputValue(C), g.setValidationError(null);
            },
            validateBoardName: fe
          }
        ),
        /* @__PURE__ */ i(
          Wt,
          {
            isOpen: g.showNewTagDialog,
            inputValue: g.inputValue,
            tasks: q,
            pendingTaskOperation: g.pendingTaskOperation,
            onClose: () => {
              g.setShowNewTagDialog(!1), g.setPendingTaskOperation(null);
            },
            onConfirm: Ue,
            onInputChange: g.setInputValue
          }
        ),
        /* @__PURE__ */ i(
          jt,
          {
            isOpen: g.showSettingsModal,
            preferences: c,
            showCompleteButton: U,
            showDeleteButton: W,
            showTagButton: X,
            onClose: () => g.setShowSettingsModal(!1),
            onSavePreferences: u,
            onValidateKey: async (C) => await de(n, e).validateKey(C)
          }
        ),
        /* @__PURE__ */ i(
          qt,
          {
            isOpen: !!g.editTagModal,
            taskId: g.editTagModal?.taskId || null,
            currentTag: g.editTagModal?.currentTag || null,
            editTagInput: g.editTagInput,
            boards: x,
            currentBoardId: E,
            onClose: () => {
              g.setEditTagModal(null), g.setEditTagInput("");
            },
            onConfirm: Je,
            onInputChange: g.setEditTagInput,
            onToggleTagPill: We
          }
        ),
        /* @__PURE__ */ i(
          Xt,
          {
            isOpen: !!g.boardContextMenu,
            boardId: g.boardContextMenu?.boardId || null,
            x: g.boardContextMenu?.x || 0,
            y: g.boardContextMenu?.y || 0,
            boards: x,
            onClose: () => g.setBoardContextMenu(null),
            onDeleteBoard: L
          }
        ),
        /* @__PURE__ */ i(
          zt,
          {
            isOpen: !!g.tagContextMenu,
            tag: g.tagContextMenu?.tag || null,
            x: g.tagContextMenu?.x || 0,
            y: g.tagContextMenu?.y || 0,
            onClose: () => g.setTagContextMenu(null),
            onDeleteTag: S
          }
        )
      ] })
    }
  ) : /* @__PURE__ */ i(Lt, { isDarkTheme: p });
}
function na(t, n = {}) {
  const e = new URLSearchParams(window.location.search), a = n.userType || e.get("userType") || "admin", s = n.sessionId || "public-session", o = { ...n, userType: a, sessionId: s }, r = Ge(t);
  r.render(/* @__PURE__ */ i(Zt, { ...o })), t.__root = r, console.log("[task-app] Mounted successfully", o);
}
function sa(t) {
  t.__root?.unmount();
}
export {
  na as mount,
  sa as unmount
};
