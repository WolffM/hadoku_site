import { jsxs as k, jsx as i, Fragment as ze } from "react/jsx-runtime";
import { createRoot as Ye } from "react-dom/client";
import { useState as _, useMemo as Me, useEffect as z, useRef as ce } from "react";
const H = `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
class Ge {
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
function Ze() {
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
function he(t, n, e, a) {
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
function Qe(t, n, e, a) {
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
async function ae(t, n, e, a) {
  const s = (/* @__PURE__ */ new Date()).toISOString(), [o, r] = await Promise.all([
    t.getTasks(n.userType, n.sessionId, e),
    t.getStats(n.userType, n.sessionId, e)
  ]), { updatedTasks: l, statsEvents: d, result: c } = a(o, r, s);
  let g = r;
  for (const { task: h, eventType: p } of d)
    g = Qe(g, h, p, s);
  return await Promise.all([
    t.saveTasks(n.userType, n.sessionId, e, l),
    t.saveStats(n.userType, n.sessionId, e, g)
  ]), c;
}
async function se(t, n, e) {
  const a = (/* @__PURE__ */ new Date()).toISOString(), s = await t.getBoards(n.userType, n.sessionId), { updatedBoards: o, result: r } = e(s, a);
  return await t.saveBoards(n.userType, o, n.sessionId), r;
}
async function et(t, n) {
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
async function tt(t, n, e, a = "main") {
  return ae(t, n, a, (s, o, r) => {
    const l = e.id || Ze(), d = e.createdAt || r, c = {
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
async function at(t, n, e, a, s = "main") {
  return ae(t, n, s, (o, r, l) => {
    const { task: d, index: c } = Oe(o, e), g = {
      ...d,
      ...a,
      updatedAt: l
    }, h = [...o.tasks];
    return h[c] = g, {
      updatedTasks: {
        ...o,
        tasks: h,
        updatedAt: l
      },
      statsEvents: [{ task: g, eventType: "edited" }],
      result: { ok: !0, message: `Task ${e} updated` }
    };
  });
}
async function nt(t, n, e, a = "main") {
  return ae(t, n, a, (s, o, r) => {
    const { updatedTasks: l, closedTask: d } = Le(s, e, "Completed", r);
    return {
      updatedTasks: l,
      statsEvents: [{ task: d, eventType: "completed" }],
      result: { ok: !0, message: `Task ${e} completed` }
    };
  });
}
async function st(t, n, e, a = "main") {
  return ae(t, n, a, (s, o, r) => {
    const { updatedTasks: l, closedTask: d } = Le(s, e, "Deleted", r);
    return {
      updatedTasks: l,
      statsEvents: [{ task: d, eventType: "deleted" }],
      result: { ok: !0, message: `Task ${e} deleted` }
    };
  });
}
async function ot(t, n, e) {
  return se(t, n, (a, s) => {
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
async function rt(t, n, e) {
  if (e === "main")
    throw new Error("Cannot delete the main board");
  return se(t, n, (a, s) => (ue(a, e), {
    updatedBoards: {
      ...a,
      updatedAt: s,
      boards: a.boards.filter((r) => r.id !== e)
    },
    result: { ok: !0, message: `Board ${e} deleted` }
  }));
}
async function it(t, n, e) {
  return se(t, n, (a, s) => {
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
      updatedBoards: he(a, r, d, s),
      result: { ok: !0, message: `Tag ${e.tag} added to board ${e.boardId}` }
    };
  });
}
async function lt(t, n, e) {
  return se(t, n, (a, s) => {
    const { board: o, index: r } = ue(a, e.boardId), l = o.tags || [], d = {
      ...o,
      tags: l.filter((c) => c !== e.tag)
    };
    return {
      updatedBoards: he(a, r, d, s),
      result: { ok: !0, message: `Tag ${e.tag} removed from board ${e.boardId}` }
    };
  });
}
async function ct(t, n, e) {
  return ae(t, n, e.boardId, (a, s, o) => {
    let r = 0;
    const l = a.tasks.map((g) => {
      const h = e.updates.find((p) => p.taskId === g.id);
      return h ? (r++, {
        ...g,
        tag: h.tag || void 0,
        updatedAt: o
      }) : g;
    }), d = {
      ...a,
      tasks: l,
      updatedAt: o
    }, c = l.filter((g) => e.updates.find((h) => h.taskId === g.id)).map((g) => ({ task: g, eventType: "edited" }));
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
async function dt(t, n, e) {
  const a = await ae(t, n, e.boardId, (s, o, r) => {
    let l = 0;
    const d = s.tasks.map((h) => {
      if (e.taskIds.includes(h.id) && h.tag) {
        const N = h.tag.split(" ").filter(Boolean).filter((b) => b !== e.tag);
        return l++, {
          ...h,
          tag: N.length > 0 ? N.join(" ") : void 0,
          updatedAt: r
        };
      }
      return h;
    }), c = {
      ...s,
      tasks: d,
      updatedAt: r
    }, g = d.filter((h) => e.taskIds.includes(h.id)).map((h) => ({ task: h, eventType: "edited" }));
    return {
      updatedTasks: c,
      statsEvents: g,
      result: { clearedCount: l }
    };
  });
  return await se(t, n, (s, o) => {
    const { board: r, index: l } = ue(s, e.boardId), d = r.tags || [], c = {
      ...r,
      tags: d.filter((g) => g !== e.tag)
    };
    return {
      updatedBoards: he(s, l, c, o),
      result: { ok: !0 }
    };
  }), {
    ok: !0,
    message: `Cleared tag ${e.tag} from ${a.clearedCount} task(s) on board ${e.boardId}`,
    cleared: a.clearedCount
  };
}
function X(t, n, e = 50) {
  setTimeout(() => {
    try {
      const a = new BroadcastChannel("tasks");
      a.postMessage({ type: t, ...n }), a.close();
    } catch (a) {
      console.error("[localStorageApi] Broadcast failed:", a);
    }
  }, e);
}
function ut(t = "public", n = "public") {
  const e = new Ge(t, n), a = { userType: "registered", sessionId: n };
  return {
    async getBoards() {
      const s = await et(e, a), o = {
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
      const o = await ot(
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
      }), X("boards-updated", { sessionId: H, userType: t }), o.board;
    },
    async deleteBoard(s) {
      await rt(
        e,
        a,
        s
      ), await e.deleteBoardData(t, n, s), X("boards-updated", { sessionId: H, userType: t });
    },
    async getTasks(s = "main") {
      return e.getTasks(t, n, s);
    },
    async getStats(s = "main") {
      return e.getStats(t, n, s);
    },
    async createTask(s, o = "main", r = !1) {
      console.log("[localStorageApi] createTask (using handler)", { data: s, boardId: o, suppressBroadcast: r });
      const l = await tt(
        e,
        a,
        s,
        o
      ), c = (await e.getTasks(t, n, o)).tasks.find((g) => g.id === l.id);
      if (!c)
        throw new Error("Task creation failed - task not found after creation");
      return r ? console.log("[localStorageApi] createTask: broadcast suppressed") : (console.log("[localStorageApi] createTask: broadcasting", {
        sessionId: H,
        boardId: o,
        taskId: l.id
      }), X("tasks-updated", { sessionId: H, userType: t, boardId: o })), c;
    },
    async patchTask(s, o, r = "main", l = !1) {
      const d = {};
      o.title !== void 0 && (d.title = o.title), o.tag !== void 0 && o.tag !== null && (d.tag = o.tag), await at(
        e,
        a,
        s,
        d,
        r
      ), l || X("tasks-updated", { sessionId: H, userType: t, boardId: r });
      const g = (await e.getTasks(t, n, r)).tasks.find((h) => h.id === s);
      if (!g)
        throw new Error("Task not found after update");
      return g;
    },
    async completeTask(s, o = "main") {
      const l = (await e.getTasks(t, n, o)).tasks.find((d) => d.id === s);
      if (!l)
        throw new Error("Task not found");
      return await nt(
        e,
        a,
        s,
        o
      ), X("tasks-updated", { sessionId: H, userType: t, boardId: o }), {
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
      return await st(
        e,
        a,
        s,
        o
      ), r ? console.log("[localStorageApi] deleteTask: broadcast suppressed") : (console.log("[localStorageApi] deleteTask: broadcasting", { sessionId: H }), X("tasks-updated", { sessionId: H, userType: t, boardId: o })), {
        ...d,
        state: "Deleted",
        closedAt: (/* @__PURE__ */ new Date()).toISOString(),
        updatedAt: (/* @__PURE__ */ new Date()).toISOString()
      };
    },
    async createTag(s, o = "main") {
      await it(
        e,
        a,
        { boardId: o, tag: s }
      ), X("boards-updated", { sessionId: H, userType: t, boardId: o });
    },
    async deleteTag(s, o = "main") {
      await lt(
        e,
        a,
        { boardId: o, tag: s }
      ), X("boards-updated", { sessionId: H, userType: t, boardId: o });
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
      const l = await this.getBoards(), d = l.boards.find((b) => b.id === s), c = l.boards.find((b) => b.id === o);
      if (!d)
        throw new Error(`Source board ${s} not found`);
      if (!c)
        throw new Error(`Target board ${o} not found`);
      const g = d.tasks.filter((b) => r.includes(b.id));
      d.tasks = d.tasks.filter((b) => !r.includes(b.id)), c.tasks = [...c.tasks, ...g], l.updatedAt = (/* @__PURE__ */ new Date()).toISOString();
      const h = `${t}-${n}-boards`;
      localStorage.setItem(h, JSON.stringify(l));
      const p = `${t}-${n}-${s}-tasks`, N = `${t}-${n}-${o}-tasks`;
      return localStorage.setItem(p, JSON.stringify({
        version: 1,
        updatedAt: l.updatedAt,
        tasks: d.tasks
      })), localStorage.setItem(N, JSON.stringify({
        version: 1,
        updatedAt: l.updatedAt,
        tasks: c.tasks
      })), X("boards-updated", { sessionId: H, userType: t }), { ok: !0, moved: g.length };
    },
    async batchUpdateTags(s, o) {
      console.log("[localStorageApi] batchUpdateTags", { boardId: s, updates: o }), await ct(
        e,
        a,
        { boardId: s, updates: o }
      ), X("tasks-updated", { sessionId: H, userType: t, boardId: s });
    },
    async batchClearTag(s, o, r) {
      console.log("[localStorageApi] batchClearTag START", { boardId: s, tag: o, taskIds: r, taskCount: r.length });
      const l = await dt(
        e,
        a,
        { boardId: s, tag: o, taskIds: r }
      );
      console.log("[localStorageApi] batchClearTag result:", l), X("boards-updated", { sessionId: H, userType: t, boardId: s }), console.log("[localStorageApi] batchClearTag END");
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
async function gt(t, n, e, a) {
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
function V(t, n) {
  const e = {
    "Content-Type": "application/json",
    "X-User-Type": t
  };
  return n && (e["X-Session-Id"] = n), e;
}
function de(t = "public", n = "public") {
  const e = ut(t, n);
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
          headers: V(t, n)
        });
        if (!a.ok)
          throw new Error(`API returned ${a.status}`);
        const s = await a.json();
        if (!s || !s.boards || !Array.isArray(s.boards)) {
          console.error("[api] Invalid response structure:", s);
          return;
        }
        console.log("[api] Synced from API:", { boards: s.boards.length, totalTasks: s.boards.reduce((o, r) => o + (r.tasks?.length || 0), 0) }), await gt(e, s, t, n);
      } catch (a) {
        console.error("[api] Sync from API failed:", a);
      }
    },
    async createTask(a, s = "main", o = !1) {
      const r = await e.createTask(a, s, o);
      return fetch("/task/api", {
        method: "POST",
        headers: V(t, n),
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
        headers: V(t, n),
        body: JSON.stringify({ boardId: s, tag: a })
      }).then(() => console.log("[api] Background sync: createTag completed")).catch((r) => console.error("[api] Failed to sync createTag:", r)), o;
    },
    async deleteTag(a, s = "main") {
      const o = await e.deleteTag(a, s);
      return fetch("/task/api/tags/delete", {
        method: "POST",
        headers: V(t, n),
        body: JSON.stringify({ boardId: s, tag: a })
      }).then(() => console.log("[api] Background sync: deleteTag completed")).catch((r) => console.error("[api] Failed to sync deleteTag:", r)), o;
    },
    async patchTask(a, s, o = "main", r = !1) {
      const l = await e.patchTask(a, s, o, r);
      return fetch(`/task/api/${a}`, {
        method: "PATCH",
        headers: V(t, n),
        body: JSON.stringify({ ...s, boardId: o })
      }).then(() => console.log("[api] Background sync: patchTask completed")).catch((d) => console.error("[api] Failed to sync patchTask:", d)), l;
    },
    async completeTask(a, s = "main") {
      const o = await e.completeTask(a, s);
      return fetch(`/task/api/${a}/complete`, {
        method: "POST",
        headers: V(t, n),
        body: JSON.stringify({ boardId: s })
      }).then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        console.log("[api] Background sync: completeTask completed");
      }).catch((r) => console.error("[api] Failed to sync completeTask:", r)), o;
    },
    async deleteTask(a, s = "main", o = !1) {
      await e.deleteTask(a, s, o), fetch(`/task/api/${a}`, {
        method: "DELETE",
        headers: V(t, n),
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
        headers: V(t, n),
        body: JSON.stringify({ id: a, name: a })
      }).then(() => console.log("[api] Background sync: createBoard completed")).catch((o) => console.error("[api] Failed to sync createBoard:", o)), s;
    },
    async deleteBoard(a) {
      const s = await e.deleteBoard(a);
      return fetch(`/task/api/boards/${encodeURIComponent(a)}`, {
        method: "DELETE",
        headers: V(t, n)
      }).then(() => console.log("[api] Background sync: deleteBoard completed")).catch((o) => console.error("[api] Failed to sync deleteBoard:", o)), s;
    },
    // User preferences
    async getPreferences() {
      const a = await e.getPreferences();
      try {
        const s = await fetch("/task/api/preferences", {
          headers: V(t, n)
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
        headers: V(t, n),
        body: JSON.stringify(d)
      }).then(() => console.log("[api] Background sync: savePreferences completed (server-only)")).catch((c) => console.error("[api] Failed to sync savePreferences:", c));
    },
    // Batch operations
    async batchUpdateTags(a, s) {
      await e.batchUpdateTags(a, s), fetch("/task/api/batch-tag", {
        method: "PATCH",
        headers: V(t, n),
        body: JSON.stringify({ boardId: a, updates: s })
      }).then(() => console.log("[api] Background sync: batchUpdateTags completed")).catch((o) => console.error("[api] Failed to sync batchUpdateTags:", o));
    },
    async batchMoveTasks(a, s, o) {
      const r = await e.batchMoveTasks(a, s, o);
      return fetch("/task/api/batch-move", {
        method: "POST",
        headers: V(t, n),
        body: JSON.stringify({ sourceBoardId: a, targetBoardId: s, taskIds: o })
      }).then(() => console.log("[api] Background sync: batchMoveTasks completed")).catch((l) => console.error("[api] Failed to sync batchMoveTasks:", l)), r;
    },
    async batchClearTag(a, s, o) {
      await e.batchClearTag(a, s, o), fetch("/task/api/batch-clear-tag", {
        method: "POST",
        headers: V(t, n),
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
function ht(t) {
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
function pt(t, n = 6, e = []) {
  const a = t.flatMap((o) => o.tag?.split(" ") || []).filter(Boolean), s = {};
  return a.forEach((o) => s[o] = (s[o] || 0) + 1), e.filter(Boolean).forEach((o) => {
    s[o] || (s[o] = 0);
  }), Object.entries(s).sort((o, r) => r[1] - o[1]).slice(0, n).map(([o]) => o);
}
function ke(t, n) {
  return t.filter((e) => e.tag?.split(" ").includes(n));
}
function mt(t, n, e) {
  const a = Array.isArray(e) && e.length > 0;
  return t.filter((s) => {
    const o = s.tag?.split(" ") || [];
    return a ? e.some((l) => o.includes(l)) && !n.some((l) => o.includes(l)) : !n.some((r) => o.includes(r));
  });
}
function Ie(t) {
  return Array.from(new Set(t.flatMap((n) => n.tag?.split(" ") || []).filter(Boolean)));
}
async function Te(t, n, e, a, s = {}) {
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
function ne(t, n) {
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
function ft({ userType: t, sessionId: n }) {
  const [e, a] = _([]), [s, o] = _(/* @__PURE__ */ new Set()), r = Me(
    () => de(t, n || "public"),
    [t, n]
  ), [l, d] = _(null), [c, g] = _("main");
  async function h() {
    console.log("[useTasks] initialLoad called"), "syncFromApi" in r && await r.syncFromApi(), await p();
  }
  async function p() {
    console.log("[useTasks] reload called", { currentBoardId: c, stack: new Error().stack?.split(`
`).slice(1, 4).join(`
`) });
    const f = await r.getBoards();
    d(f);
    const { tasks: S } = ne(f, c);
    a(S);
  }
  z(() => {
    console.log("[useTasks] User context changed, clearing state and reloading", { userType: t, sessionId: n }), a([]), o(/* @__PURE__ */ new Set()), d(null), g("main"), p();
  }, [t, n]), z(() => {
    console.log("[useTasks] Setting up BroadcastChannel listener", { currentBoardId: c, userType: t, sessionId: n });
    try {
      const f = new BroadcastChannel("tasks");
      return f.onmessage = (S) => {
        const B = S.data || {};
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
  async function N(f) {
    if (f = f.trim(), !!f)
      try {
        const S = ht(f);
        return await r.createTask(S, c), await p(), !0;
      } catch (S) {
        return alert(S.message || "Failed to create task"), !1;
      }
  }
  async function b(f) {
    await Te(
      `complete-${f}`,
      s,
      o,
      async () => {
        await r.completeTask(f, c), await p();
      },
      {
        onError: (S) => alert(S.message || "Failed to complete task")
      }
    );
  }
  async function A(f) {
    console.log("[useTasks] deleteTask START", { taskId: f, currentBoardId: c }), await Te(
      `delete-${f}`,
      s,
      o,
      async () => {
        console.log("[useTasks] deleteTask: calling api.deleteTask", { taskId: f, currentBoardId: c }), await r.deleteTask(f, c), console.log("[useTasks] deleteTask: calling reload"), await p(), console.log("[useTasks] deleteTask END");
      },
      {
        onError: (S) => alert(S.message || "Failed to delete task")
      }
    );
  }
  async function j(f) {
    const S = prompt("Enter tag (without #):");
    if (!S) return;
    const B = S.trim().replace(/^#+/, "").replace(/\s+/g, "-"), m = e.find((x) => x.id === f);
    if (!m) return;
    const T = m.tag?.split(" ") || [];
    if (T.includes(B)) return;
    const v = [...T, B].join(" ");
    try {
      await r.patchTask(f, { tag: v }, c), await p();
    } catch (x) {
      alert(x.message || "Failed to add tag");
    }
  }
  async function P(f, S, B = {}) {
    const { suppressBroadcast: m = !1, skipReload: T = !1 } = B;
    try {
      await r.patchTask(f, S, c, m), T || await p();
    } catch (v) {
      throw v;
    }
  }
  async function K(f) {
    console.log("[useTasks] bulkUpdateTaskTags START", { count: f.length });
    try {
      await r.batchUpdateTags(
        c,
        f.map((S) => ({ taskId: S.taskId, tag: S.tag || null }))
      ), console.log("[useTasks] bulkUpdateTaskTags: calling reload"), await p(), console.log("[useTasks] bulkUpdateTaskTags END");
    } catch (S) {
      throw console.error("[useTasks] bulkUpdateTaskTags ERROR", S), S;
    }
  }
  async function J(f) {
    console.log("[useTasks] deleteTag START", { tag: f, currentBoardId: c, taskCount: e.length });
    const S = e.filter((B) => B.tag?.split(" ").includes(f));
    if (console.log("[useTasks] deleteTag: found tasks with tag", { tag: f, count: S.length }), S.length === 0) {
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
        S.map((B) => B.id)
      ), console.log("[useTasks] deleteTag: calling reload"), await p(), console.log("[useTasks] deleteTag END");
    } catch (B) {
      console.error("[useTasks] deleteTag ERROR", B), alert(B.message || "Failed to remove tag from tasks");
    }
  }
  async function U(f) {
    await r.createBoard(f), g(f);
    const S = await r.getBoards();
    d(S);
    const { tasks: B } = ne(S, f);
    a(B);
  }
  async function W(f, S) {
    if (console.log("[useTasks] moveTasksToBoard START", { targetBoardId: f, ids: S, currentBoardId: c }), !l) return;
    const B = /* @__PURE__ */ new Set();
    for (const m of l.boards)
      for (const T of m.tasks || [])
        S.includes(T.id) && B.add(m.id);
    console.log("[useTasks] moveTasksToBoard: source boards", { sourceBoardIds: Array.from(B) });
    try {
      if (B.size === 1) {
        const v = Array.from(B)[0];
        console.log("[useTasks] moveTasksToBoard: using batch API"), await r.batchMoveTasks(v, f, S);
      } else
        throw console.error("[useTasks] moveTasksToBoard: Cannot move tasks from multiple boards at once"), new Error("Cannot move tasks from multiple boards at once");
      console.log("[useTasks] moveTasksToBoard: switching to target board", { targetBoardId: f }), g(f);
      const m = await r.getBoards();
      d(m);
      const { tasks: T } = ne(m, f);
      a(T), console.log("[useTasks] moveTasksToBoard END");
    } catch (m) {
      console.error("[useTasks] moveTasksToBoard ERROR", m), alert(m.message || "Failed to move tasks");
    }
  }
  async function R(f) {
    if (await r.deleteBoard(f), c === f) {
      g("main");
      const S = await r.getBoards();
      d(S);
      const { tasks: B } = ne(S, "main");
      a(B);
    } else
      await p();
  }
  async function te(f) {
    await r.createTag(f, c), await p();
  }
  async function Z(f) {
    await r.deleteTag(f, c), await p();
  }
  function G(f) {
    g(f);
    const { tasks: S, foundBoard: B } = ne(l, f);
    B ? a(S) : p();
  }
  return {
    // Task state
    tasks: e,
    pendingOperations: s,
    // Task operations
    addTask: N,
    completeTask: b,
    deleteTask: A,
    addTagToTask: j,
    updateTaskTags: P,
    bulkUpdateTaskTags: K,
    deleteTag: J,
    // Board state
    boards: l,
    currentBoardId: c,
    // Board operations
    createBoard: U,
    deleteBoard: R,
    switchBoard: G,
    moveTasksToBoard: W,
    createTagOnBoard: te,
    deleteTagOnBoard: Z,
    // Lifecycle
    initialLoad: h,
    reload: p
  };
}
function kt({ tasks: t, onTaskUpdate: n, onBulkUpdate: e }) {
  const [a, s] = _(null), [o, r] = _(null), [l, d] = _(/* @__PURE__ */ new Set()), [c, g] = _(!1), [h, p] = _(null), [N, b] = _(null), A = ce(null);
  function j(m) {
    let T = [];
    try {
      const v = m.dataTransfer.getData("application/x-hadoku-task-ids");
      v && (T = JSON.parse(v));
    } catch {
    }
    if (T.length === 0) {
      const v = m.dataTransfer.getData("text/plain");
      v && (T = [v]);
    }
    return T;
  }
  function P(m, T) {
    const v = l.has(T) && l.size > 0 ? Array.from(l) : [T];
    console.log("[useDragAndDrop] onDragStart", { taskId: T, idsToDrag: v, selectedCount: l.size }), m.dataTransfer.setData("text/plain", v[0]);
    try {
      m.dataTransfer.setData("application/x-hadoku-task-ids", JSON.stringify(v));
    } catch {
    }
    m.dataTransfer.effectAllowed = "copyMove";
    try {
      const x = m.currentTarget, E = x.closest && x.closest(".task-app__item") ? x.closest(".task-app__item") : x;
      E.classList.add("dragging");
      const D = E.cloneNode(!0);
      D.style.boxSizing = "border-box", D.style.width = `${E.offsetWidth}px`, D.style.height = `${E.offsetHeight}px`, D.style.opacity = "0.95", D.style.transform = "none", D.style.filter = "drop-shadow(0 6px 18px rgba(0,0,0,0.12))", D.classList.add("drag-image"), D.style.position = "absolute", D.style.top = "-9999px", D.style.left = "-9999px", document.body.appendChild(D), E.__dragImage = D, d((O) => {
        if (O.has(T)) return new Set(O);
        const L = new Set(O);
        return L.add(T), L;
      });
      try {
        const O = E.closest(".task-app__tag-column");
        if (O) {
          const L = O.querySelector(".task-app__tag-header") || O.querySelector("h3"), $ = (L && L.textContent || "").trim().replace(/^#/, "");
          if ($)
            try {
              m.dataTransfer.setData("application/x-hadoku-task-source", $);
            } catch {
            }
        }
      } catch {
      }
      try {
        const O = E.getBoundingClientRect();
        let L = Math.round(m.clientX - O.left), w = Math.round(m.clientY - O.top);
        L = Math.max(0, Math.min(Math.round(D.offsetWidth - 1), L)), w = Math.max(0, Math.min(Math.round(D.offsetHeight - 1), w)), m.dataTransfer.setDragImage(D, L, w);
      } catch {
        m.dataTransfer.setDragImage(D, 0, 0);
      }
    } catch {
    }
  }
  function K(m) {
    try {
      const T = m.currentTarget;
      T.classList.remove("dragging");
      const v = T.__dragImage;
      v && v.parentNode && v.parentNode.removeChild(v), v && delete T.__dragImage;
    } catch {
    }
    try {
      R();
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
      g(!0), A.current = { x: m.clientX, y: m.clientY }, p({ x: m.clientX, y: m.clientY, w: 0, h: 0 }), d(/* @__PURE__ */ new Set());
      try {
        document.body.classList.add("marquee-selecting");
      } catch {
      }
    }
  }
  function U(m) {
    if (!c || !A.current) return;
    const T = A.current.x, v = A.current.y, x = m.clientX, E = m.clientY, D = Math.min(T, x), O = Math.min(v, E), L = Math.abs(x - T), w = Math.abs(E - v);
    p({ x: D, y: O, w: L, h: w });
    const $ = Array.from(document.querySelectorAll(".task-app__item")), y = /* @__PURE__ */ new Set();
    for (const F of $) {
      const u = F.getBoundingClientRect();
      if (!(u.right < D || u.left > D + L || u.bottom < O || u.top > O + w)) {
        const ie = F.getAttribute("data-task-id");
        ie && y.add(ie), F.classList.add("selected");
      } else
        F.classList.remove("selected");
    }
    d(y);
  }
  function W(m) {
    g(!1), p(null), A.current = null;
    try {
      document.body.classList.remove("marquee-selecting");
    } catch {
    }
    try {
      b(Date.now());
    } catch {
    }
  }
  function R() {
    d(/* @__PURE__ */ new Set()), Array.from(document.querySelectorAll(".task-app__item.selected")).forEach((T) => T.classList.remove("selected"));
  }
  z(() => {
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
    function v(x) {
      const E = { clientX: x.clientX, clientY: x.clientY };
      try {
        W(E);
      } catch {
      }
    }
    return document.addEventListener("mousedown", m), document.addEventListener("mousemove", T), document.addEventListener("mouseup", v), () => {
      document.removeEventListener("mousedown", m), document.removeEventListener("mousemove", T), document.removeEventListener("mouseup", v);
    };
  }, []);
  function te(m, T) {
    m.preventDefault(), m.dataTransfer.dropEffect = "copy", s(T);
  }
  function Z(m) {
    m.currentTarget.contains(m.relatedTarget) || s(null);
  }
  async function G(m, T) {
    m.preventDefault(), s(null), console.log("[useDragAndDrop] onDrop START", { targetTag: T });
    const v = j(m);
    if (v.length === 0) return;
    let x = null;
    try {
      const D = m.dataTransfer.getData("application/x-hadoku-task-source");
      D && (x = D);
    } catch {
    }
    console.log("[useDragAndDrop] onDrop: processing", { targetTag: T, ids: v, srcTag: x, taskCount: v.length });
    const E = [];
    for (const D of v) {
      const O = t.find((F) => F.id === D);
      if (!O) continue;
      const L = O.tag?.split(" ").filter(Boolean) || [];
      if (T === "other") {
        if (L.length === 0) continue;
        E.push({ taskId: D, tag: "" });
        continue;
      }
      const w = L.includes(T);
      let $ = L.slice();
      w || $.push(T), x && x !== T && ($ = $.filter((F) => F !== x));
      const y = $.join(" ").trim();
      E.push({ taskId: D, tag: y });
    }
    console.log("[useDragAndDrop] onDrop: updating tasks", { updateCount: E.length });
    try {
      await e(E), console.log("[useDragAndDrop] onDrop: updates complete, clearing selection");
      try {
        R();
      } catch {
      }
    } catch (D) {
      console.error("Failed to add tag to one or more tasks:", D), alert(D.message || "Failed to add tags");
    }
    console.log("[useDragAndDrop] onDrop END");
  }
  function f(m, T) {
    m.preventDefault(), m.dataTransfer.dropEffect = "copy", r(T);
  }
  function S(m) {
    m.currentTarget.contains(m.relatedTarget) || r(null);
  }
  async function B(m, T) {
    m.preventDefault(), r(null);
    const v = j(m);
    if (v.length === 0) return;
    console.log("[useDragAndDrop] onFilterDrop", { filterTag: T, ids: v, taskCount: v.length });
    const x = [];
    for (const E of v) {
      const D = t.find((w) => w.id === E);
      if (!D) continue;
      const O = D.tag?.split(" ").filter(Boolean) || [];
      if (O.includes(T)) {
        console.log(`Task ${E} already has tag: ${T}`);
        continue;
      }
      const L = [...O, T].join(" ");
      x.push({ taskId: E, tag: L });
    }
    if (x.length === 0) {
      console.log("No updates needed - all tasks already have this tag");
      return;
    }
    console.log(`Adding tag "${T}" to ${x.length} task(s) via filter drop`);
    try {
      await e(x);
      try {
        R();
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
    selectionJustEndedAt: N,
    // selection handlers
    selectionStartHandler: J,
    selectionMoveHandler: U,
    selectionEndHandler: W,
    clearSelection: R,
    onDragStart: P,
    onDragEnd: K,
    onDragOver: te,
    onDragLeave: Z,
    onDrop: G,
    onFilterDragOver: f,
    onFilterDragLeave: S,
    onFilterDrop: B
  };
}
function Tt() {
  const [t, n] = _({});
  function e(r) {
    n((l) => {
      const c = (l[r] || "desc") === "desc" ? "asc" : "desc";
      return { ...l, [r]: c };
    });
  }
  function a(r, l) {
    return [...r].sort((d, c) => {
      const g = new Date(d.createdAt).getTime(), h = new Date(c.createdAt).getTime();
      return l === "asc" ? g - h : h - g;
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
const ye = 5, yt = 300, le = "1.0", we = "task-storage-version", wt = [
  /^tasks-/,
  // tasks-main, tasks-work
  /^stats-/,
  // stats-main, stats-work
  /^boards$/,
  // boards (without prefix)
  /^preferences$/
  // preferences (without prefix)
], vt = {
  version: 1,
  updatedAt: (/* @__PURE__ */ new Date()).toISOString(),
  experimentalThemes: !1,
  alwaysVerticalLayout: !1,
  theme: "light",
  showCompleteButton: !0,
  showDeleteButton: !0,
  showTagButton: !1
};
function bt(t, n) {
  const e = window.localStorage.getItem(we);
  e !== le && (console.log("[Preferences] Storage version mismatch, cleaning up orphaned keys", {
    current: e,
    expected: le
  }), Object.keys(window.localStorage).forEach((a) => {
    const s = wt.some((r) => r.test(a)), o = a.includes(`${t}-${n}`);
    s && !o && (console.log("[Preferences] Removing orphaned key:", a), window.localStorage.removeItem(a));
  }), window.localStorage.setItem(we, le), console.log("[Preferences] Storage upgraded to version", le));
}
function St(t) {
  try {
    const n = sessionStorage.getItem("theme"), e = sessionStorage.getItem("showCompleteButton"), a = sessionStorage.getItem("showDeleteButton"), s = sessionStorage.getItem("showTagButton"), o = {};
    return n && !t.theme && (o.theme = n), e !== null && t.showCompleteButton === void 0 && (o.showCompleteButton = e === "true"), a !== null && t.showDeleteButton === void 0 && (o.showDeleteButton = a === "true"), s !== null && t.showTagButton === void 0 && (o.showTagButton = s === "true"), Object.keys(o).length > 0 ? (console.log("[Preferences] Migrating settings from sessionStorage to localStorage:", o), sessionStorage.removeItem("theme"), sessionStorage.removeItem("showCompleteButton"), sessionStorage.removeItem("showDeleteButton"), sessionStorage.removeItem("showTagButton"), o) : null;
  } catch (n) {
    return console.warn("[Preferences] Failed to migrate settings:", n), null;
  }
}
function Ct(t, n) {
  const [e, a] = _(vt), [s, o] = _(!1);
  z(() => {
    (async () => {
      bt(t, n), console.log("[usePreferences] Loading preferences...", { userType: t, sessionId: n });
      const c = de(t, n), g = await c.getPreferences();
      if (console.log("[usePreferences] Loaded preferences:", g), g) {
        const h = St(g);
        if (h) {
          const p = { ...g, ...h, updatedAt: (/* @__PURE__ */ new Date()).toISOString() };
          a(p), await c.savePreferences(p), console.log("[usePreferences] Applied and saved migrations");
        } else
          a(g), console.log("[usePreferences] Applied preferences to state");
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
const Y = {
  width: 20,
  height: 20,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round"
}, xt = () => /* @__PURE__ */ k("svg", { ...Y, children: [
  /* @__PURE__ */ i("circle", { cx: "12", cy: "12", r: "5" }),
  /* @__PURE__ */ i("line", { x1: "12", y1: "1", x2: "12", y2: "3" }),
  /* @__PURE__ */ i("line", { x1: "12", y1: "21", x2: "12", y2: "23" }),
  /* @__PURE__ */ i("line", { x1: "4.22", y1: "4.22", x2: "5.64", y2: "5.64" }),
  /* @__PURE__ */ i("line", { x1: "18.36", y1: "18.36", x2: "19.78", y2: "19.78" }),
  /* @__PURE__ */ i("line", { x1: "1", y1: "12", x2: "3", y2: "12" }),
  /* @__PURE__ */ i("line", { x1: "21", y1: "12", x2: "23", y2: "12" }),
  /* @__PURE__ */ i("line", { x1: "4.22", y1: "19.78", x2: "5.64", y2: "18.36" }),
  /* @__PURE__ */ i("line", { x1: "18.36", y1: "5.64", x2: "19.78", y2: "4.22" })
] }), Pe = () => /* @__PURE__ */ i("svg", { ...Y, children: /* @__PURE__ */ i("path", { d: "M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" }) }), ve = () => /* @__PURE__ */ k("svg", { ...Y, children: [
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
] }), be = () => /* @__PURE__ */ k("svg", { ...Y, children: [
  /* @__PURE__ */ i("path", { d: "M2 12c2-2 4-2 6 0s4 2 6 0 4-2 6 0" }),
  /* @__PURE__ */ i("path", { d: "M2 17c2-2 4-2 6 0s4 2 6 0 4-2 6 0" }),
  /* @__PURE__ */ i("path", { d: "M2 7c2-2 4-2 6 0s4 2 6 0 4-2 6 0" })
] }), Se = () => /* @__PURE__ */ i("svg", { ...Y, children: /* @__PURE__ */ i("polygon", { points: "13 2 3 14 12 14 11 22 21 10 12 10 13 2" }) }), Ce = () => /* @__PURE__ */ k("svg", { ...Y, children: [
  /* @__PURE__ */ i("path", { d: "M18 8h1a4 4 0 0 1 0 8h-1" }),
  /* @__PURE__ */ i("path", { d: "M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" }),
  /* @__PURE__ */ i("line", { x1: "6", y1: "1", x2: "6", y2: "4" }),
  /* @__PURE__ */ i("line", { x1: "10", y1: "1", x2: "10", y2: "4" }),
  /* @__PURE__ */ i("line", { x1: "14", y1: "1", x2: "14", y2: "4" })
] }), xe = () => /* @__PURE__ */ k("svg", { ...Y, children: [
  /* @__PURE__ */ i("circle", { cx: "12", cy: "12", r: "2", fill: "currentColor" }),
  /* @__PURE__ */ i("circle", { cx: "12", cy: "6", r: "2.5", fill: "none", stroke: "currentColor", strokeWidth: "2" }),
  /* @__PURE__ */ i("circle", { cx: "18", cy: "10", r: "2.5", fill: "none", stroke: "currentColor", strokeWidth: "2" }),
  /* @__PURE__ */ i("circle", { cx: "16", cy: "16", r: "2.5", fill: "none", stroke: "currentColor", strokeWidth: "2" }),
  /* @__PURE__ */ i("circle", { cx: "8", cy: "16", r: "2.5", fill: "none", stroke: "currentColor", strokeWidth: "2" }),
  /* @__PURE__ */ i("circle", { cx: "6", cy: "10", r: "2.5", fill: "none", stroke: "currentColor", strokeWidth: "2" })
] }), Be = () => /* @__PURE__ */ i("svg", { ...Y, children: /* @__PURE__ */ i("path", { d: "M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z", fill: "currentColor" }) }), Bt = () => /* @__PURE__ */ k("svg", { ...Y, children: [
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
] }), Dt = () => /* @__PURE__ */ k("svg", { ...Y, width: 16, height: 16, viewBox: "0 0 20 20", children: [
  /* @__PURE__ */ i(
    "path",
    {
      d: "M2 4 L12 4 L16 10 L12 16 L2 16 Z",
      fill: "currentColor"
    }
  ),
  /* @__PURE__ */ i("circle", { cx: "6", cy: "10", r: "1.5", fill: "white" })
] }), De = [
  {
    lightIcon: /* @__PURE__ */ i(xt, {}),
    darkIcon: /* @__PURE__ */ i(Pe, {}),
    lightTheme: "light",
    darkTheme: "dark",
    lightLabel: "Light",
    darkLabel: "Dark"
  },
  {
    lightIcon: /* @__PURE__ */ i(ve, {}),
    darkIcon: /* @__PURE__ */ i(ve, {}),
    lightTheme: "strawberry-light",
    darkTheme: "strawberry-dark",
    lightLabel: "Strawberry Light",
    darkLabel: "Strawberry Dark"
  },
  {
    lightIcon: /* @__PURE__ */ i(be, {}),
    darkIcon: /* @__PURE__ */ i(be, {}),
    lightTheme: "ocean-light",
    darkTheme: "ocean-dark",
    lightLabel: "Ocean Light",
    darkLabel: "Ocean Dark"
  },
  {
    lightIcon: /* @__PURE__ */ i(Se, {}),
    darkIcon: /* @__PURE__ */ i(Se, {}),
    lightTheme: "cyberpunk-light",
    darkTheme: "cyberpunk-dark",
    lightLabel: "Cyberpunk Light",
    darkLabel: "Cyberpunk Dark"
  },
  {
    lightIcon: /* @__PURE__ */ i(Ce, {}),
    darkIcon: /* @__PURE__ */ i(Ce, {}),
    lightTheme: "coffee-light",
    darkTheme: "coffee-dark",
    lightLabel: "Coffee Light",
    darkLabel: "Coffee Dark"
  },
  {
    lightIcon: /* @__PURE__ */ i(xe, {}),
    darkIcon: /* @__PURE__ */ i(xe, {}),
    lightTheme: "lavender-light",
    darkTheme: "lavender-dark",
    lightLabel: "Lavender Light",
    darkLabel: "Lavender Dark"
  }
], Nt = [
  {
    lightIcon: /* @__PURE__ */ i(Be, {}),
    darkIcon: /* @__PURE__ */ i(Be, {}),
    lightTheme: "pink-light",
    darkTheme: "pink-dark",
    lightLabel: "Pink Light",
    darkLabel: "Pink Dark"
  }
];
function $e(t) {
  return t ? [...De, ...Nt] : De;
}
function At(t, n) {
  const a = $e(n).find(
    (s) => s.lightTheme === t || s.darkTheme === t
  );
  return a ? t.endsWith("-dark") || t === "dark" ? a.darkIcon : a.lightIcon : /* @__PURE__ */ i(Pe, {});
}
function Et(t, n, e) {
  const [a, s] = _(!1), o = t.theme || "light", r = (d) => n({ theme: d }), l = Me(
    () => $e(t.experimentalThemes || !1),
    [t.experimentalThemes]
  );
  return z(() => {
    e.current && e.current.setAttribute("data-theme", o);
  }, [o, e]), z(() => {
    const d = window.matchMedia("(prefers-color-scheme: dark)"), c = (g) => {
      const h = g.matches, p = o.replace(/-light$|-dark$/, ""), N = o.endsWith("-dark") ? "dark" : o.endsWith("-light") ? "light" : null;
      if (N && p !== "light" && p !== "dark") {
        const b = h ? "dark" : "light";
        if (N !== b) {
          const A = `${p}-${b}`;
          console.log(`[Theme] Auto-switching from ${o} to ${A} (system preference)`), r(A);
        }
      }
    };
    return d.addEventListener ? d.addEventListener("change", c) : d.addListener(c), () => {
      d.removeEventListener ? d.removeEventListener("change", c) : d.removeListener(c);
    };
  }, [o, r]), {
    theme: o,
    showThemePicker: a,
    setShowThemePicker: s,
    THEME_FAMILIES: l,
    setTheme: r
  };
}
function Ne(t, n, e, a) {
  z(() => {
    if (!n) return;
    const s = (o) => {
      const r = o.target;
      t.current && t.current.contains(r) || a && r.closest(a) || e();
    };
    return document.addEventListener("mousedown", s), () => document.removeEventListener("mousedown", s);
  }, [t, n, e, a]);
}
function _t() {
  const [t, n] = _(null), [e, a] = _(!1), [s, o] = _(!1), [r, l] = _(!1), [d, c] = _(null), [g, h] = _(""), [p, N] = _(null), [b, A] = _(null), [j, P] = _(""), [K, J] = _(null), [U, W] = _(null);
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
    editTagInput: g,
    setEditTagInput: h,
    boardContextMenu: p,
    setBoardContextMenu: N,
    tagContextMenu: b,
    setTagContextMenu: A,
    inputValue: j,
    setInputValue: P,
    validationError: K,
    setValidationError: J,
    pendingTaskOperation: U,
    setPendingTaskOperation: W
  };
}
const Ae = 768;
function Mt() {
  const [t, n] = _(() => typeof window > "u" ? !1 : window.innerWidth < Ae);
  return z(() => {
    if (typeof window > "u") return;
    const e = window.matchMedia(`(max-width: ${Ae - 1}px)`), a = (s) => {
      n(s.matches);
    };
    return e.addEventListener ? e.addEventListener("change", a) : e.addListener(a), a(e), () => {
      e.removeEventListener ? e.removeEventListener("change", a) : e.removeListener(a);
    };
  }, []), t;
}
function Ot({ isDarkTheme: t }) {
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
function Lt({
  theme: t,
  experimentalThemes: n,
  showThemePicker: e,
  onThemePickerToggle: a,
  onThemeChange: s,
  onSettingsClick: o,
  THEME_FAMILIES: r
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
    /* @__PURE__ */ k("div", { className: "theme-picker", children: [
      /* @__PURE__ */ i(
        "button",
        {
          className: "theme-toggle-btn",
          onClick: a,
          "aria-label": "Choose theme",
          title: "Choose theme",
          children: At(t, n)
        }
      ),
      e && /* @__PURE__ */ k(
        "div",
        {
          className: "theme-picker__dropdown",
          onClick: (l) => l.stopPropagation(),
          children: [
            /* @__PURE__ */ i("div", { className: "theme-picker__pills", children: r.map((l, d) => /* @__PURE__ */ k("div", { className: "theme-pill", children: [
              /* @__PURE__ */ i(
                "button",
                {
                  className: `theme-pill__btn theme-pill__btn--light ${t === l.lightTheme ? "active" : ""}`,
                  onClick: () => s(l.lightTheme),
                  title: l.lightLabel,
                  "aria-label": l.lightLabel,
                  children: /* @__PURE__ */ i("div", { className: "theme-pill__icon", children: l.lightIcon })
                }
              ),
              /* @__PURE__ */ i(
                "button",
                {
                  className: `theme-pill__btn theme-pill__btn--dark ${t === l.darkTheme ? "active" : ""}`,
                  onClick: () => s(l.darkTheme),
                  title: l.darkLabel,
                  "aria-label": l.darkLabel,
                  children: /* @__PURE__ */ i("div", { className: "theme-pill__icon", children: l.darkIcon })
                }
              )
            ] }, d)) }),
            /* @__PURE__ */ i(
              "button",
              {
                className: "theme-picker__settings-icon",
                onClick: () => {
                  o(), a();
                },
                "aria-label": "Settings",
                title: "Settings",
                children: /* @__PURE__ */ i(Bt, {})
              }
            )
          ]
        }
      )
    ] }),
    e && /* @__PURE__ */ i(
      "div",
      {
        className: "theme-picker__overlay",
        onClick: a
      }
    )
  ] });
}
function Fe({ onLongPress: t, delay: n = 500 }) {
  const e = ce(null);
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
function pe(t) {
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
function It({
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
    onLongPress: (g, h) => s(t.id, g, h)
  }), c = t.id === "main";
  return /* @__PURE__ */ i(
    "button",
    {
      className: `board-btn ${n ? "board-btn--active" : ""} ${e ? "board-btn--drag-over" : ""}`,
      onClick: () => a(t.id),
      onContextMenu: (g) => {
        g.preventDefault(), !c && s(t.id, g.clientX, g.clientY);
      },
      ...c ? {} : d,
      "aria-pressed": n ? "true" : "false",
      onDragOver: (g) => {
        g.preventDefault(), g.dataTransfer.dropEffect = "move", o(`board:${t.id}`);
      },
      onDragLeave: (g) => {
        o(null);
      },
      onDrop: async (g) => {
        g.preventDefault(), o(null);
        const h = pe(g.dataTransfer);
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
function Pt({
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
  onPendingOperation: g,
  onInitialLoad: h
}) {
  const [p, N] = _(!1), b = t && t.boards ? t.boards.slice(0, ye) : [{ id: "main", name: "main", tasks: [], tags: [] }], A = !t || t.boards && t.boards.length < ye, j = async (P) => {
    if (p) return;
    console.log("[BoardsSection] Manual refresh triggered"), N(!0);
    const K = P.currentTarget, J = new Promise((U, W) => {
      setTimeout(() => W(new Error("Sync timeout")), 5e3);
    });
    try {
      await Promise.race([h(), J]), console.log("[BoardsSection] Sync completed successfully");
    } catch (U) {
      console.error("[BoardsSection] Sync failed:", U);
    } finally {
      N(!1), K?.blur();
    }
  };
  return /* @__PURE__ */ k("div", { className: "task-app__boards", children: [
    /* @__PURE__ */ i("div", { className: "task-app__board-list", children: b.map((P) => /* @__PURE__ */ i(
      It,
      {
        board: P,
        isActive: n === P.id,
        isDragOver: a === `board:${P.id}`,
        onSwitch: s,
        onContextMenu: o,
        onDragOverFilter: r,
        onMoveTasksToBoard: l,
        onClearSelection: d
      },
      P.id
    )) }),
    /* @__PURE__ */ k("div", { className: "task-app__board-actions", children: [
      A && /* @__PURE__ */ i(
        "button",
        {
          className: `board-add-btn ${a === "add-board" ? "board-btn--drag-over" : ""}`,
          onClick: c,
          onDragOver: (P) => {
            P.preventDefault(), P.dataTransfer.dropEffect = "move", r("add-board");
          },
          onDragLeave: () => r(null),
          onDrop: (P) => {
            P.preventDefault(), r(null);
            const K = pe(P.dataTransfer);
            K.length > 0 && (g({ type: "move-to-board", taskIds: K }), c());
          },
          "aria-label": "Create board",
          children: "＋"
        }
      ),
      e !== "public" && /* @__PURE__ */ i(
        "button",
        {
          className: `sync-btn ${p ? "spinning" : ""}`,
          onClick: j,
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
function $t({
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
    onLongPress: (c, g) => s(t, c, g)
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
function Ft({
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
  const g = (h) => {
    h.preventDefault(), r(h);
    const p = pe(h.dataTransfer);
    p.length > 0 && (c({ type: "apply-tag", taskIds: p }), d());
  };
  return /* @__PURE__ */ k("div", { className: "task-app__filters", children: [
    t.map((h) => /* @__PURE__ */ i(
      $t,
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
        onDrop: g,
        "aria-label": "Add tag",
        children: "＋"
      }
    )
  ] });
}
function Rt(t) {
  const n = /* @__PURE__ */ new Date(), e = new Date(t), a = n.getTime() - e.getTime(), s = Math.floor(a / 1e3), o = Math.floor(s / 60), r = Math.floor(o / 60), l = Math.floor(r / 24);
  return s < 60 ? `${s}s ago` : o < 60 ? `${o}m ago` : r < 24 ? `${r}h ago` : `${l}d ago`;
}
function ge({
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
  showDeleteButton: g = !0,
  showTagButton: h = !1
}) {
  const p = e.has(`complete-${t.id}`), N = e.has(`delete-${t.id}`);
  return /* @__PURE__ */ k(
    "li",
    {
      className: `task-app__item ${d ? "selected" : ""}`,
      "data-task-id": t.id,
      draggable: n,
      onDragStart: r ? (b) => r(b, t.id) : void 0,
      onDragEnd: (b) => {
        if (b.currentTarget.classList.remove("dragging"), l)
          try {
            l(b);
          } catch {
          }
      },
      children: [
        /* @__PURE__ */ k("div", { className: "task-app__item-content", children: [
          /* @__PURE__ */ i("div", { className: "task-app__item-title", title: t.title, children: t.title }),
          /* @__PURE__ */ k("div", { className: "task-app__item-meta-row", children: [
            t.tag ? /* @__PURE__ */ i("div", { className: "task-app__item-tag", children: t.tag.split(" ").sort().map((b) => `#${b}`).join(" ") }) : /* @__PURE__ */ i("div", {}),
            /* @__PURE__ */ i("div", { className: "task-app__item-age", children: Rt(t.createdAt) })
          ] })
        ] }),
        /* @__PURE__ */ k("div", { className: "task-app__item-actions", children: [
          h && /* @__PURE__ */ i(
            "button",
            {
              className: "task-app__action-btn task-app__edit-tag-btn",
              onClick: () => o(t.id),
              title: "Edit tags",
              disabled: p || N,
              children: /* @__PURE__ */ i(Dt, {})
            }
          ),
          c && /* @__PURE__ */ i(
            "button",
            {
              className: "task-app__action-btn task-app__complete-btn",
              onClick: () => a(t.id),
              title: "Complete task",
              disabled: p || N,
              children: p ? "⏳" : "✓"
            }
          ),
          g && /* @__PURE__ */ i(
            "button",
            {
              className: "task-app__action-btn task-app__delete-btn",
              onClick: () => s(t.id),
              title: "Delete task",
              disabled: p || N,
              children: N ? "⏳" : "×"
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
function Kt({
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
  onDragStart: g,
  onDragEnd: h,
  selectedIds: p,
  onSelectionStart: N,
  onSelectionMove: b,
  onSelectionEnd: A,
  onDragOver: j,
  onDragLeave: P,
  onDrop: K,
  toggleSort: J,
  sortTasksByAge: U,
  getSortIcon: W,
  getSortTitle: R,
  deleteTag: te,
  onDeletePersistedTag: Z,
  showCompleteButton: G = !0,
  showDeleteButton: f = !0,
  showTagButton: S = !1
}) {
  const B = (w, $) => /* @__PURE__ */ k(
    "div",
    {
      className: `task-app__tag-column ${o === w ? "task-app__tag-column--drag-over" : ""}`,
      onDragOver: (y) => j(y, w),
      onDragLeave: P,
      onDrop: (y) => K(y, w),
      children: [
        /* @__PURE__ */ k("div", { className: "task-app__tag-header-row", children: [
          /* @__PURE__ */ k("h3", { className: "task-app__tag-header", children: [
            "#",
            w
          ] }),
          /* @__PURE__ */ i(
            "button",
            {
              className: "task-app__sort-btn task-app__sort-btn--active",
              onClick: () => J(w),
              title: R(s[w] || "desc"),
              children: W(s[w] || "desc")
            }
          )
        ] }),
        /* @__PURE__ */ i("ul", { className: "task-app__list task-app__list--column", children: U($, s[w] || "desc").map((y) => /* @__PURE__ */ i(
          ge,
          {
            task: y,
            isDraggable: !0,
            pendingOperations: r,
            onComplete: l,
            onDelete: d,
            onEditTag: c,
            onDragStart: g,
            onDragEnd: h,
            selected: p ? p.has(y.id) : !1,
            showCompleteButton: G,
            showDeleteButton: f,
            showTagButton: S
          },
          y.id
        )) })
      ]
    },
    w
  ), m = (w, $) => {
    let y = ke(t, w);
    return v && (y = y.filter((F) => {
      const u = F.tag?.split(" ") || [];
      return a.some((re) => u.includes(re));
    })), y.slice(0, $);
  }, T = n.length, v = Array.isArray(a) && a.length > 0, x = t.filter((w) => {
    if (!v) return !0;
    const $ = w.tag?.split(" ") || [];
    return a.some((y) => $.includes(y));
  }), E = Ee(T, e), D = v ? n.filter((w) => ke(t, w).some((y) => {
    const F = y.tag?.split(" ") || [];
    return a.some((u) => F.includes(u));
  })) : n.slice(0, E.useTags);
  if (D.length === 0)
    return /* @__PURE__ */ i("ul", { className: "task-app__list", children: x.map((w) => /* @__PURE__ */ i(
      ge,
      {
        task: w,
        pendingOperations: r,
        onComplete: l,
        onDelete: d,
        onEditTag: c,
        onDragStart: g,
        onDragEnd: h,
        selected: p ? p.has(w.id) : !1,
        showCompleteButton: G,
        showDeleteButton: f,
        showTagButton: S
      },
      w.id
    )) });
  const O = mt(t, n, a).filter((w) => {
    if (!v) return !0;
    const $ = w.tag?.split(" ") || [];
    return a.some((y) => $.includes(y));
  }), L = Ee(D.length, e);
  return /* @__PURE__ */ k("div", { className: "task-app__dynamic-layout", children: [
    L.rows.length > 0 && /* @__PURE__ */ i(ze, { children: L.rows.map((w, $) => /* @__PURE__ */ i("div", { className: `task-app__tag-grid task-app__tag-grid--${w.columns}col`, children: w.tagIndices.map((y) => {
      const F = D[y];
      return F ? B(F, m(F, L.maxPerColumn)) : null;
    }) }, $)) }),
    O.length > 0 && /* @__PURE__ */ k(
      "div",
      {
        className: `task-app__remaining ${o === "other" ? "task-app__tag-column--drag-over" : ""}`,
        onDragOver: (w) => {
          w.preventDefault(), w.dataTransfer.dropEffect = "move", j(w, "other");
        },
        onDragLeave: (w) => P(w),
        onDrop: (w) => K(w, "other"),
        children: [
          /* @__PURE__ */ k("div", { className: "task-app__tag-header-row", children: [
            /* @__PURE__ */ i("h3", { className: "task-app__remaining-header", children: "Other Tasks" }),
            /* @__PURE__ */ i(
              "button",
              {
                className: "task-app__sort-btn task-app__sort-btn--active",
                onClick: () => J("other"),
                title: R(s.other || "desc"),
                children: W(s.other || "desc")
              }
            )
          ] }),
          /* @__PURE__ */ i("ul", { className: "task-app__list", children: U(O, s.other || "desc").map((w) => /* @__PURE__ */ i(
            ge,
            {
              task: w,
              pendingOperations: r,
              onComplete: l,
              onDelete: d,
              onEditTag: c,
              onDragStart: g,
              onDragEnd: h,
              selected: p ? p.has(w.id) : !1,
              showCompleteButton: G,
              showDeleteButton: f,
              showTagButton: S
            },
            w.id
          )) })
        ]
      }
    )
  ] });
}
function oe({
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
  confirmDisabled: g = !1,
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
          onClick: (N) => N.stopPropagation(),
          children: [
            /* @__PURE__ */ i("h3", { children: n }),
            s,
            r && /* @__PURE__ */ i(
              "input",
              {
                type: "text",
                className: "modal-input",
                value: o || "",
                onChange: (N) => r(N.target.value),
                placeholder: l,
                autoFocus: !0,
                onKeyDown: (N) => {
                  N.key === "Enter" && !g && (N.preventDefault(), a()), N.key === "Escape" && (N.preventDefault(), e());
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
function Ut({ tag: t, count: n, isOpen: e, onClose: a, onConfirm: s }) {
  const o = async () => {
    t && (await s(t), a());
  };
  return /* @__PURE__ */ i(
    oe,
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
function Ht({
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
    oe,
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
function Jt({
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
    oe,
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
async function Wt(t, n) {
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
function Vt({
  isOpen: t,
  preferences: n,
  showCompleteButton: e,
  showDeleteButton: a,
  showTagButton: s,
  onClose: o,
  onSavePreferences: r,
  onValidateKey: l
}) {
  const [d, c] = _(""), [g, h] = _(null), [p, N] = _(!1), b = async () => {
    if (!d.trim() || p) return;
    N(!0), h(null);
    const A = await Wt(d, l);
    A.success || (h(A.error || "Failed to validate key"), N(!1));
  };
  return /* @__PURE__ */ k(
    oe,
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
                    A.key === "Enter" && d && !p && b();
                  },
                  placeholder: "Enter authentication key",
                  disabled: p
                }
              ),
              d && /* @__PURE__ */ i(
                "button",
                {
                  className: "settings-field-button",
                  onClick: b,
                  disabled: p,
                  children: p ? /* @__PURE__ */ i("span", { className: "spinner" }) : "↵"
                }
              )
            ] }),
            g && /* @__PURE__ */ i("span", { className: "settings-error", children: g })
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
function jt({
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
  const h = s?.boards?.find((b) => b.id === o)?.tags || [], p = e?.split(" ").filter(Boolean) || [], N = (b) => {
    b.key === "Enter" && (b.preventDefault(), l());
  };
  return /* @__PURE__ */ i(
    oe,
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
          /* @__PURE__ */ i("div", { className: "edit-tag-pills-container", children: [...h].sort().map((b) => {
            const A = p.includes(b);
            return /* @__PURE__ */ k(
              "button",
              {
                className: `edit-tag-pill ${A ? "active" : ""}`,
                onClick: () => c(b),
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
          /* @__PURE__ */ i("label", { className: "edit-tag-label", children: "Add New Tag" }),
          /* @__PURE__ */ i(
            "input",
            {
              type: "text",
              className: "edit-tag-input",
              value: a,
              onChange: (b) => d(b.target.value),
              onKeyDown: N,
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
function qt({
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
function Xt({
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
const _e = [
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
function zt() {
  return _e[Math.floor(Math.random() * _e.length)];
}
function Yt(t, n) {
  const e = t.trim();
  return e ? n.map((s) => s.id.toLowerCase()).includes(e.toLowerCase()) ? `Board "${e}" already exists` : null : "Board name cannot be empty";
}
function Gt(t = {}) {
  const { userType: n = "public", sessionId: e = "public" } = t, a = ce(null), s = ce(null), o = Mt(), [r] = _(() => zt()), [l, d] = _(/* @__PURE__ */ new Set()), { preferences: c, savePreferences: g, preferencesLoaded: h, isDarkTheme: p } = Ct(n, e), { theme: N, showThemePicker: b, setShowThemePicker: A, THEME_FAMILIES: j, setTheme: P } = Et(c, g, s), K = o || c.alwaysVerticalLayout || !1, J = c.showCompleteButton ?? !0, U = c.showDeleteButton ?? !0, W = c.showTagButton ?? !1, {
    tasks: R,
    pendingOperations: te,
    initialLoad: Z,
    addTask: G,
    completeTask: f,
    deleteTask: S,
    updateTaskTags: B,
    bulkUpdateTaskTags: m,
    deleteTag: T,
    boards: v,
    currentBoardId: x,
    createBoard: E,
    deleteBoard: D,
    switchBoard: O,
    moveTasksToBoard: L,
    createTagOnBoard: w,
    deleteTagOnBoard: $
  } = ft({ userType: n, sessionId: e }), y = kt({
    tasks: R,
    onTaskUpdate: B,
    onBulkUpdate: m
  }), F = Tt(), u = _t();
  Ne(
    { current: null },
    // Board context menu doesn't need a ref
    !!u.boardContextMenu,
    () => u.setBoardContextMenu(null),
    ".board-context-menu"
  ), Ne(
    { current: null },
    // Tag context menu doesn't need a ref
    !!u.tagContextMenu,
    () => u.setTagContextMenu(null),
    ".tag-context-menu"
  ), z(() => {
    d(/* @__PURE__ */ new Set());
  }, [x]), z(() => {
    console.log("[App] User context changed, initializing...", { userType: n, sessionId: e }), Z(), a.current?.focus();
  }, [n, e]);
  const re = async (C) => {
    await G(C) && a.current && (a.current.value = "", a.current.focus());
  }, ie = (C) => {
    const M = R.filter((I) => I.tag?.split(" ").includes(C));
    u.setConfirmClearTag({ tag: C, count: M.length });
  }, Ke = async (C) => {
    const M = C.trim().replace(/\s+/g, "-");
    try {
      if (await w(M), u.pendingTaskOperation?.type === "apply-tag" && u.pendingTaskOperation.taskIds.length > 0) {
        const I = u.pendingTaskOperation.taskIds.map((q) => {
          const Q = R.find((Xe) => Xe.id === q)?.tag?.split(" ").filter(Boolean) || [], ee = [.../* @__PURE__ */ new Set([...Q, M])];
          return { taskId: q, tag: ee.join(" ") };
        });
        await m(I), y.clearSelection();
      }
      u.setPendingTaskOperation(null), u.setShowNewTagDialog(!1), u.setInputValue("");
    } catch (I) {
      throw console.error("[App] Failed to create tag:", I), I;
    }
  }, Ue = (C) => {
    const M = R.find((I) => I.id === C);
    M && (u.setEditTagModal({ taskId: C, currentTag: M.tag || null }), u.setEditTagInput(""));
  }, He = async () => {
    if (!u.editTagModal) return;
    const { taskId: C, currentTag: M } = u.editTagModal, I = M?.split(" ").filter(Boolean) || [], q = u.editTagInput.trim() ? u.editTagInput.trim().replace(/\s+/g, "-").split("#").filter(Boolean).map((ee) => ee.trim()) : [];
    for (const ee of q)
      await w(ee);
    const Q = [.../* @__PURE__ */ new Set([...I, ...q])].sort().join(" ");
    await B(C, { tag: Q }), u.setEditTagModal(null), u.setEditTagInput("");
  }, Je = (C) => {
    if (!u.editTagModal) return;
    const { taskId: M, currentTag: I } = u.editTagModal, q = I?.split(" ").filter(Boolean) || [];
    if (q.includes(C)) {
      const Q = q.filter((ee) => ee !== C).sort().join(" ");
      u.setEditTagModal({ taskId: M, currentTag: Q });
    } else {
      const Q = [...q, C].sort().join(" ");
      u.setEditTagModal({ taskId: M, currentTag: Q });
    }
  }, me = (C) => Yt(C, v?.boards || []), We = async (C) => {
    const M = C.trim(), I = me(M);
    if (I) {
      u.setValidationError(I);
      return;
    }
    try {
      await E(M), u.pendingTaskOperation?.type === "move-to-board" && u.pendingTaskOperation.taskIds.length > 0 && (await L(M, u.pendingTaskOperation.taskIds), y.clearSelection()), u.setPendingTaskOperation(null), u.setValidationError(null), u.setShowNewBoardDialog(!1), u.setInputValue("");
    } catch (q) {
      console.error("[App] Failed to create board:", q), u.setValidationError(q.message || "Failed to create board");
    }
  }, Ve = v?.boards?.find((C) => C.id === x)?.tags || [], je = Array.from(/* @__PURE__ */ new Set([...Ve, ...Ie(R)])), qe = pt(R, K ? 3 : 6);
  return h ? /* @__PURE__ */ i(
    "div",
    {
      ref: s,
      className: "task-app-container task-app-fade-in",
      "data-dark-theme": p ? "true" : "false",
      onMouseDown: y.selectionStartHandler,
      onMouseMove: y.selectionMoveHandler,
      onMouseUp: y.selectionEndHandler,
      onMouseLeave: y.selectionEndHandler,
      onClick: (C) => {
        try {
          const M = C.target;
          if (M.closest && M.closest(".theme-picker"))
            return;
          if (!M.closest || !M.closest(".task-app__item")) {
            if (y.selectionJustEndedAt && Date.now() - y.selectionJustEndedAt < yt)
              return;
            y.clearSelection();
          }
        } catch {
        }
      },
      children: /* @__PURE__ */ k("div", { className: "task-app", children: [
        /* @__PURE__ */ i(
          Lt,
          {
            theme: N,
            experimentalThemes: c.experimentalThemes || !1,
            showThemePicker: b,
            onThemePickerToggle: () => A(!b),
            onThemeChange: P,
            onSettingsClick: () => u.setShowSettingsModal(!0),
            THEME_FAMILIES: j
          }
        ),
        /* @__PURE__ */ i(
          Pt,
          {
            boards: v,
            currentBoardId: x,
            userType: n,
            dragOverFilter: y.dragOverFilter,
            onBoardSwitch: O,
            onBoardContextMenu: (C, M, I) => u.setBoardContextMenu({ boardId: C, x: M, y: I }),
            onDragOverFilter: y.setDragOverFilter,
            onMoveTasksToBoard: L,
            onClearSelection: y.clearSelection,
            onCreateBoardClick: () => {
              u.setInputValue(""), u.setValidationError(null), u.setShowNewBoardDialog(!0);
            },
            onPendingOperation: u.setPendingTaskOperation,
            onInitialLoad: Z
          }
        ),
        /* @__PURE__ */ i("div", { className: "task-app__controls", children: /* @__PURE__ */ i(
          "input",
          {
            ref: a,
            className: "task-app__input",
            placeholder: r,
            onKeyDown: (C) => {
              C.key === "Enter" && !C.shiftKey && (C.preventDefault(), re(C.target.value)), C.key === "k" && (C.ctrlKey || C.metaKey) && (C.preventDefault(), a.current?.focus());
            }
          }
        ) }),
        /* @__PURE__ */ i(
          Ft,
          {
            tags: je,
            selectedFilters: l,
            dragOverFilter: y.dragOverFilter,
            onToggleFilter: (C) => {
              d((M) => {
                const I = new Set(M);
                return I.has(C) ? I.delete(C) : I.add(C), I;
              });
            },
            onTagContextMenu: (C, M, I) => u.setTagContextMenu({ tag: C, x: M, y: I }),
            onDragOver: y.onFilterDragOver,
            onDragLeave: y.onFilterDragLeave,
            onDrop: y.onFilterDrop,
            onCreateTagClick: () => {
              u.setInputValue(""), u.setShowNewTagDialog(!0);
            },
            onPendingOperation: u.setPendingTaskOperation
          }
        ),
        /* @__PURE__ */ i(
          Kt,
          {
            tasks: R,
            topTags: qe,
            isMobile: K,
            filters: Array.from(l),
            selectedIds: y.selectedIds,
            onSelectionStart: y.selectionStartHandler,
            onSelectionMove: y.selectionMoveHandler,
            onSelectionEnd: y.selectionEndHandler,
            sortDirections: F.sortDirections,
            dragOverTag: y.dragOverTag,
            pendingOperations: te,
            onComplete: f,
            onDelete: S,
            onEditTag: Ue,
            onDragStart: y.onDragStart,
            onDragEnd: y.onDragEnd,
            onDragOver: y.onDragOver,
            onDragLeave: y.onDragLeave,
            onDrop: y.onDrop,
            toggleSort: F.toggleSort,
            sortTasksByAge: F.sortTasksByAge,
            getSortIcon: F.getSortIcon,
            getSortTitle: F.getSortTitle,
            deleteTag: ie,
            onDeletePersistedTag: $,
            showCompleteButton: J,
            showDeleteButton: U,
            showTagButton: W
          }
        ),
        y.isSelecting && y.marqueeRect && /* @__PURE__ */ i(
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
        /* @__PURE__ */ i(
          Ut,
          {
            tag: u.confirmClearTag?.tag || null,
            count: u.confirmClearTag?.count || 0,
            isOpen: !!u.confirmClearTag,
            onClose: () => u.setConfirmClearTag(null),
            onConfirm: T
          }
        ),
        /* @__PURE__ */ i(
          Ht,
          {
            isOpen: u.showNewBoardDialog,
            inputValue: u.inputValue,
            validationError: u.validationError,
            pendingTaskOperation: u.pendingTaskOperation,
            onClose: () => {
              u.setShowNewBoardDialog(!1), u.setPendingTaskOperation(null), u.setValidationError(null);
            },
            onConfirm: We,
            onInputChange: (C) => {
              u.setInputValue(C), u.setValidationError(null);
            },
            validateBoardName: me
          }
        ),
        /* @__PURE__ */ i(
          Jt,
          {
            isOpen: u.showNewTagDialog,
            inputValue: u.inputValue,
            tasks: R,
            pendingTaskOperation: u.pendingTaskOperation,
            onClose: () => {
              u.setShowNewTagDialog(!1), u.setPendingTaskOperation(null);
            },
            onConfirm: Ke,
            onInputChange: u.setInputValue
          }
        ),
        /* @__PURE__ */ i(
          Vt,
          {
            isOpen: u.showSettingsModal,
            preferences: c,
            showCompleteButton: J,
            showDeleteButton: U,
            showTagButton: W,
            onClose: () => u.setShowSettingsModal(!1),
            onSavePreferences: g,
            onValidateKey: async (C) => await de(n, e).validateKey(C)
          }
        ),
        /* @__PURE__ */ i(
          jt,
          {
            isOpen: !!u.editTagModal,
            taskId: u.editTagModal?.taskId || null,
            currentTag: u.editTagModal?.currentTag || null,
            editTagInput: u.editTagInput,
            boards: v,
            currentBoardId: x,
            onClose: () => {
              u.setEditTagModal(null), u.setEditTagInput("");
            },
            onConfirm: He,
            onInputChange: u.setEditTagInput,
            onToggleTagPill: Je
          }
        ),
        /* @__PURE__ */ i(
          qt,
          {
            isOpen: !!u.boardContextMenu,
            boardId: u.boardContextMenu?.boardId || null,
            x: u.boardContextMenu?.x || 0,
            y: u.boardContextMenu?.y || 0,
            boards: v,
            onClose: () => u.setBoardContextMenu(null),
            onDeleteBoard: D
          }
        ),
        /* @__PURE__ */ i(
          Xt,
          {
            isOpen: !!u.tagContextMenu,
            tag: u.tagContextMenu?.tag || null,
            x: u.tagContextMenu?.x || 0,
            y: u.tagContextMenu?.y || 0,
            onClose: () => u.setTagContextMenu(null),
            onDeleteTag: T
          }
        )
      ] })
    }
  ) : /* @__PURE__ */ i(Ot, { isDarkTheme: p });
}
function aa(t, n = {}) {
  const e = new URLSearchParams(window.location.search), a = n.userType || e.get("userType") || "admin", s = n.sessionId || "public-session", o = { ...n, userType: a, sessionId: s }, r = Ye(t);
  r.render(/* @__PURE__ */ i(Gt, { ...o })), t.__root = r, console.log("[task-app] Mounted successfully", o);
}
function na(t) {
  t.__root?.unmount();
}
export {
  aa as mount,
  na as unmount
};
