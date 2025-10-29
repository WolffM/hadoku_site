import { jsxs as m, jsx as i, Fragment as it } from "react/jsx-runtime";
import { createRoot as lt } from "react-dom/client";
import { useState as A, useMemo as Ue, useEffect as ee, useRef as he } from "react";
const j = `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
function Te() {
  return localStorage.getItem("currentSessionId");
}
function me(t) {
  localStorage.setItem("currentSessionId", t), console.log("[Session] Stored sessionId:", t);
}
async function ct(t, n) {
  const e = Te();
  if (n === "public") {
    if (e)
      return console.log("[Session] Public user - using existing sessionId:", e), null;
    const a = `public-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    return me(a), console.log("[Session] Public user - created stable sessionId:", a), null;
  }
  console.log("[Session] Performing handshake...", { oldSessionId: e, newSessionId: t, userType: n });
  try {
    const a = await fetch("/task/api/session/handshake", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-User-Type": n,
        "X-Session-Id": t
      },
      body: JSON.stringify({
        oldSessionId: e,
        newSessionId: t
      })
    });
    if (!a.ok)
      throw new Error(`Handshake failed: ${a.status}`);
    const s = await a.json();
    return console.log("[Session] Handshake successful:", s), me(t), s.preferences;
  } catch (a) {
    return console.error("[Session] Handshake failed:", a), me(t), null;
  }
}
function dt(t, n) {
  if (!t) return;
  const e = [];
  for (let a = 0; a < localStorage.length; a++) {
    const s = localStorage.key(a);
    s && s.includes(`${n}-${t}-`) && e.push(s);
  }
  console.log("[Session] Clearing old storage keys:", e.length), e.forEach((a) => {
    console.log("[Session] Removing:", a), localStorage.removeItem(a);
  });
}
class ut {
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
function gt() {
  const t = Date.now().toString(36).toUpperCase().padStart(8, "0"), n = crypto.getRandomValues(new Uint8Array(18)), e = Array.from(n).map((a) => (a % 36).toString(36).toUpperCase()).join("");
  return t + e;
}
function He(t, n) {
  const e = t.tasks.findIndex((a) => a.id === n);
  if (e < 0)
    throw new Error("Task not found");
  return { task: t.tasks[e], index: e };
}
function pe(t, n) {
  const e = t.boards.findIndex((a) => a.id === n);
  if (e < 0)
    throw new Error(`Board ${n} not found`);
  return { board: t.boards[e], index: e };
}
function ye(t, n, e, a) {
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
function ht(t, n, e, a) {
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
function We(t, n, e, a) {
  const { task: s, index: o } = He(t, n), r = {
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
async function se(t, n, e, a) {
  const s = (/* @__PURE__ */ new Date()).toISOString(), [o, r] = await Promise.all([
    t.getTasks(n.userType, n.sessionId, e),
    t.getStats(n.userType, n.sessionId, e)
  ]), { updatedTasks: l, statsEvents: d, result: c } = a(o, r, s);
  let u = r;
  for (const { task: g, eventType: p } of d)
    u = ht(u, g, p, s);
  return await Promise.all([
    t.saveTasks(n.userType, n.sessionId, e, l),
    t.saveStats(n.userType, n.sessionId, e, u)
  ]), c;
}
async function le(t, n, e) {
  const a = (/* @__PURE__ */ new Date()).toISOString(), s = await t.getBoards(n.userType, n.sessionId), { updatedBoards: o, result: r } = e(s, a);
  return await t.saveBoards(n.userType, o, n.sessionId), r;
}
async function pt(t, n) {
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
async function ft(t, n, e, a = "main") {
  return se(t, n, a, (s, o, r) => {
    const l = e.id || gt(), d = e.createdAt || r, c = {
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
async function mt(t, n, e, a, s = "main") {
  return se(t, n, s, (o, r, l) => {
    const { task: d, index: c } = He(o, e), u = {
      ...d,
      ...a,
      updatedAt: l
    }, g = [...o.tasks];
    return g[c] = u, {
      updatedTasks: {
        ...o,
        tasks: g,
        updatedAt: l
      },
      statsEvents: [{ task: u, eventType: "edited" }],
      result: { ok: !0, message: `Task ${e} updated` }
    };
  });
}
async function kt(t, n, e, a = "main") {
  return se(t, n, a, (s, o, r) => {
    const { updatedTasks: l, closedTask: d } = We(s, e, "Completed", r);
    return {
      updatedTasks: l,
      statsEvents: [{ task: d, eventType: "completed" }],
      result: { ok: !0, message: `Task ${e} completed` }
    };
  });
}
async function Tt(t, n, e, a = "main") {
  return se(t, n, a, (s, o, r) => {
    const { updatedTasks: l, closedTask: d } = We(s, e, "Deleted", r);
    return {
      updatedTasks: l,
      statsEvents: [{ task: d, eventType: "deleted" }],
      result: { ok: !0, message: `Task ${e} deleted` }
    };
  });
}
async function yt(t, n, e) {
  return le(t, n, (a, s) => {
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
async function wt(t, n, e) {
  if (e === "main")
    throw new Error("Cannot delete the main board");
  return le(t, n, (a, s) => (pe(a, e), {
    updatedBoards: {
      ...a,
      updatedAt: s,
      boards: a.boards.filter((r) => r.id !== e)
    },
    result: { ok: !0, message: `Board ${e} deleted` }
  }));
}
async function vt(t, n, e) {
  return le(t, n, (a, s) => {
    const { board: o, index: r } = pe(a, e.boardId), l = o.tags || [];
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
      updatedBoards: ye(a, r, d, s),
      result: { ok: !0, message: `Tag ${e.tag} added to board ${e.boardId}` }
    };
  });
}
async function bt(t, n, e) {
  return le(t, n, (a, s) => {
    const { board: o, index: r } = pe(a, e.boardId), l = o.tags || [], d = {
      ...o,
      tags: l.filter((c) => c !== e.tag)
    };
    return {
      updatedBoards: ye(a, r, d, s),
      result: { ok: !0, message: `Tag ${e.tag} removed from board ${e.boardId}` }
    };
  });
}
async function St(t, n, e) {
  return se(t, n, e.boardId, (a, s, o) => {
    let r = 0;
    const l = a.tasks.map((u) => {
      const g = e.updates.find((p) => p.taskId === u.id);
      return g ? (r++, {
        ...u,
        tag: g.tag || void 0,
        updatedAt: o
      }) : u;
    }), d = {
      ...a,
      tasks: l,
      updatedAt: o
    }, c = l.filter((u) => e.updates.find((g) => g.taskId === u.id)).map((u) => ({ task: u, eventType: "edited" }));
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
async function Ct(t, n, e) {
  const a = await se(t, n, e.boardId, (s, o, r) => {
    let l = 0;
    const d = s.tasks.map((g) => {
      if (e.taskIds.includes(g.id) && g.tag) {
        const v = g.tag.split(" ").filter(Boolean).filter((y) => y !== e.tag);
        return l++, {
          ...g,
          tag: v.length > 0 ? v.join(" ") : void 0,
          updatedAt: r
        };
      }
      return g;
    }), c = {
      ...s,
      tasks: d,
      updatedAt: r
    }, u = d.filter((g) => e.taskIds.includes(g.id)).map((g) => ({ task: g, eventType: "edited" }));
    return {
      updatedTasks: c,
      statsEvents: u,
      result: { clearedCount: l }
    };
  });
  return await le(t, n, (s, o) => {
    const { board: r, index: l } = pe(s, e.boardId), d = r.tags || [], c = {
      ...r,
      tags: d.filter((u) => u !== e.tag)
    };
    return {
      updatedBoards: ye(s, l, c, o),
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
function xt(t = "public", n = "public") {
  const e = new ut(t, n), a = { userType: "registered", sessionId: n };
  return {
    async getBoards() {
      const s = await pt(e, a), o = {
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
      const o = await yt(
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
      }), Y("boards-updated", { sessionId: j, userType: t }), o.board;
    },
    async deleteBoard(s) {
      await wt(
        e,
        a,
        s
      ), await e.deleteBoardData(t, n, s), Y("boards-updated", { sessionId: j, userType: t });
    },
    async getTasks(s = "main") {
      return e.getTasks(t, n, s);
    },
    async getStats(s = "main") {
      return e.getStats(t, n, s);
    },
    async createTask(s, o = "main", r = !1) {
      console.log("[localStorageApi] createTask (using handler)", { data: s, boardId: o, suppressBroadcast: r });
      const l = await ft(
        e,
        a,
        s,
        o
      ), c = (await e.getTasks(t, n, o)).tasks.find((u) => u.id === l.id);
      if (!c)
        throw new Error("Task creation failed - task not found after creation");
      return r ? console.log("[localStorageApi] createTask: broadcast suppressed") : (console.log("[localStorageApi] createTask: broadcasting", {
        sessionId: j,
        boardId: o,
        taskId: l.id
      }), Y("tasks-updated", { sessionId: j, userType: t, boardId: o })), c;
    },
    async patchTask(s, o, r = "main", l = !1) {
      const d = {};
      o.title !== void 0 && (d.title = o.title), o.tag !== void 0 && o.tag !== null && (d.tag = o.tag), await mt(
        e,
        a,
        s,
        d,
        r
      ), l || Y("tasks-updated", { sessionId: j, userType: t, boardId: r });
      const u = (await e.getTasks(t, n, r)).tasks.find((g) => g.id === s);
      if (!u)
        throw new Error("Task not found after update");
      return u;
    },
    async completeTask(s, o = "main") {
      const l = (await e.getTasks(t, n, o)).tasks.find((d) => d.id === s);
      if (!l)
        throw new Error("Task not found");
      return await kt(
        e,
        a,
        s,
        o
      ), Y("tasks-updated", { sessionId: j, userType: t, boardId: o }), {
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
      return await Tt(
        e,
        a,
        s,
        o
      ), r ? console.log("[localStorageApi] deleteTask: broadcast suppressed") : (console.log("[localStorageApi] deleteTask: broadcasting", { sessionId: j }), Y("tasks-updated", { sessionId: j, userType: t, boardId: o })), {
        ...d,
        state: "Deleted",
        closedAt: (/* @__PURE__ */ new Date()).toISOString(),
        updatedAt: (/* @__PURE__ */ new Date()).toISOString()
      };
    },
    async createTag(s, o = "main") {
      await vt(
        e,
        a,
        { boardId: o, tag: s }
      ), Y("boards-updated", { sessionId: j, userType: t, boardId: o });
    },
    async deleteTag(s, o = "main") {
      await bt(
        e,
        a,
        { boardId: o, tag: s }
      ), Y("boards-updated", { sessionId: j, userType: t, boardId: o });
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
      const l = await this.getBoards(), d = l.boards.find((y) => y.id === s), c = l.boards.find((y) => y.id === o);
      if (!d)
        throw new Error(`Source board ${s} not found`);
      if (!c)
        throw new Error(`Target board ${o} not found`);
      const u = d.tasks.filter((y) => r.includes(y.id));
      d.tasks = d.tasks.filter((y) => !r.includes(y.id)), c.tasks = [...c.tasks, ...u], l.updatedAt = (/* @__PURE__ */ new Date()).toISOString();
      const g = `${t}-${n}-boards`;
      localStorage.setItem(g, JSON.stringify(l));
      const p = `${t}-${n}-${s}-tasks`, v = `${t}-${n}-${o}-tasks`;
      return localStorage.setItem(p, JSON.stringify({
        version: 1,
        updatedAt: l.updatedAt,
        tasks: d.tasks
      })), localStorage.setItem(v, JSON.stringify({
        version: 1,
        updatedAt: l.updatedAt,
        tasks: c.tasks
      })), Y("boards-updated", { sessionId: j, userType: t }), { ok: !0, moved: u.length };
    },
    async batchUpdateTags(s, o) {
      console.log("[localStorageApi] batchUpdateTags", { boardId: s, updates: o }), await St(
        e,
        a,
        { boardId: s, updates: o }
      ), Y("tasks-updated", { sessionId: j, userType: t, boardId: s });
    },
    async batchClearTag(s, o, r) {
      console.log("[localStorageApi] batchClearTag START", { boardId: s, tag: o, taskIds: r, taskCount: r.length });
      const l = await Ct(
        e,
        a,
        { boardId: s, tag: o, taskIds: r }
      );
      console.log("[localStorageApi] batchClearTag result:", l), Y("boards-updated", { sessionId: j, userType: t, boardId: s }), console.log("[localStorageApi] batchClearTag END");
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
async function Dt(t, n, e, a) {
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
function X(t, n) {
  const e = {
    "Content-Type": "application/json",
    "X-User-Type": t
  };
  return n && (e["X-Session-Id"] = n), e;
}
function ie(t = "public", n = "public") {
  const e = xt(t, n);
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
          headers: X(t, n)
        });
        if (!a.ok)
          throw new Error(`API returned ${a.status}`);
        const s = await a.json();
        if (!s || !s.boards || !Array.isArray(s.boards)) {
          console.error("[api] Invalid response structure:", s);
          return;
        }
        console.log("[api] Synced from API:", { boards: s.boards.length, totalTasks: s.boards.reduce((o, r) => o + (r.tasks?.length || 0), 0) }), await Dt(e, s, t, n);
      } catch (a) {
        console.error("[api] Sync from API failed:", a);
      }
    },
    async createTask(a, s = "main", o = !1) {
      const r = await e.createTask(a, s, o);
      return fetch("/task/api", {
        method: "POST",
        headers: X(t, n),
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
        headers: X(t, n),
        body: JSON.stringify({ boardId: s, tag: a })
      }).then(() => console.log("[api] Background sync: createTag completed")).catch((r) => console.error("[api] Failed to sync createTag:", r)), o;
    },
    async deleteTag(a, s = "main") {
      const o = await e.deleteTag(a, s);
      return fetch("/task/api/tags/delete", {
        method: "POST",
        headers: X(t, n),
        body: JSON.stringify({ boardId: s, tag: a })
      }).then(() => console.log("[api] Background sync: deleteTag completed")).catch((r) => console.error("[api] Failed to sync deleteTag:", r)), o;
    },
    async patchTask(a, s, o = "main", r = !1) {
      const l = await e.patchTask(a, s, o, r);
      return fetch(`/task/api/${a}`, {
        method: "PATCH",
        headers: X(t, n),
        body: JSON.stringify({ ...s, boardId: o })
      }).then(() => console.log("[api] Background sync: patchTask completed")).catch((d) => console.error("[api] Failed to sync patchTask:", d)), l;
    },
    async completeTask(a, s = "main") {
      const o = await e.completeTask(a, s);
      return fetch(`/task/api/${a}/complete`, {
        method: "POST",
        headers: X(t, n),
        body: JSON.stringify({ boardId: s })
      }).then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        console.log("[api] Background sync: completeTask completed");
      }).catch((r) => console.error("[api] Failed to sync completeTask:", r)), o;
    },
    async deleteTask(a, s = "main", o = !1) {
      await e.deleteTask(a, s, o), fetch(`/task/api/${a}`, {
        method: "DELETE",
        headers: X(t, n),
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
        headers: X(t, n),
        body: JSON.stringify({ id: a, name: a })
      }).then(() => console.log("[api] Background sync: createBoard completed")).catch((o) => console.error("[api] Failed to sync createBoard:", o)), s;
    },
    async deleteBoard(a) {
      const s = await e.deleteBoard(a);
      return fetch(`/task/api/boards/${encodeURIComponent(a)}`, {
        method: "DELETE",
        headers: X(t, n)
      }).then(() => console.log("[api] Background sync: deleteBoard completed")).catch((o) => console.error("[api] Failed to sync deleteBoard:", o)), s;
    },
    // User preferences
    async getPreferences() {
      if (t !== "public")
        try {
          const a = await fetch("/task/api/preferences", {
            headers: X(t, n)
          });
          if (a.ok) {
            const s = await a.json();
            return console.log("[api] Fetched preferences from server:", s), await e.savePreferences(s), s;
          }
        } catch (a) {
          console.warn("[api] Failed to fetch preferences from server, using localStorage:", a);
        }
      return await e.getPreferences();
    },
    async savePreferences(a) {
      await e.savePreferences(a), t !== "public" && fetch("/task/api/preferences", {
        method: "PUT",
        headers: X(t, n),
        body: JSON.stringify(a)
      }).then(() => console.log("[api] Background sync: savePreferences completed")).catch((s) => console.error("[api] Failed to sync savePreferences:", s));
    },
    // Batch operations
    async batchUpdateTags(a, s) {
      await e.batchUpdateTags(a, s), fetch("/task/api/batch-tag", {
        method: "PATCH",
        headers: X(t, n),
        body: JSON.stringify({ boardId: a, updates: s })
      }).then(() => console.log("[api] Background sync: batchUpdateTags completed")).catch((o) => console.error("[api] Failed to sync batchUpdateTags:", o));
    },
    async batchMoveTasks(a, s, o) {
      const r = await e.batchMoveTasks(a, s, o);
      return fetch("/task/api/batch-move", {
        method: "POST",
        headers: X(t, n),
        body: JSON.stringify({ sourceBoardId: a, targetBoardId: s, taskIds: o })
      }).then(() => console.log("[api] Background sync: batchMoveTasks completed")).catch((l) => console.error("[api] Failed to sync batchMoveTasks:", l)), r;
    },
    async batchClearTag(a, s, o) {
      await e.batchClearTag(a, s, o), fetch("/task/api/batch-clear-tag", {
        method: "POST",
        headers: X(t, n),
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
function Bt(t) {
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
function Nt(t, n = 6, e = []) {
  const a = t.flatMap((o) => o.tag?.split(" ") || []).filter(Boolean), s = {};
  return a.forEach((o) => s[o] = (s[o] || 0) + 1), e.filter(Boolean).forEach((o) => {
    s[o] || (s[o] = 0);
  }), Object.entries(s).sort((o, r) => r[1] - o[1]).slice(0, n).map(([o]) => o);
}
function Ce(t, n) {
  return t.filter((e) => e.tag?.split(" ").includes(n));
}
function At(t, n, e) {
  const a = Array.isArray(e) && e.length > 0;
  return t.filter((s) => {
    const o = s.tag?.split(" ") || [];
    return a ? e.some((l) => o.includes(l)) && !n.some((l) => o.includes(l)) : !n.some((r) => o.includes(r));
  });
}
function Je(t) {
  return Array.from(new Set(t.flatMap((n) => n.tag?.split(" ") || []).filter(Boolean)));
}
async function xe(t, n, e, a, s = {}) {
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
function re(t, n) {
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
function Et({ userType: t, sessionId: n }) {
  const [e, a] = A([]), [s, o] = A(/* @__PURE__ */ new Set()), r = Ue(
    () => ie(t, n || "public"),
    [t, n]
  ), [l, d] = A(null), [c, u] = A("main");
  async function g() {
    console.log("[useTasks] initialLoad called"), "syncFromApi" in r && await r.syncFromApi(), await p();
  }
  async function p() {
    console.log("[useTasks] reload called", { currentBoardId: c, stack: new Error().stack?.split(`
`).slice(1, 4).join(`
`) });
    const k = await r.getBoards();
    d(k);
    const { tasks: b } = re(k, c);
    a(b);
  }
  ee(() => {
    console.log("[useTasks] User context changed, clearing state and reloading", { userType: t, sessionId: n }), a([]), o(/* @__PURE__ */ new Set()), d(null), u("main"), p();
  }, [t, n]), ee(() => {
    console.log("[useTasks] Setting up BroadcastChannel listener", { currentBoardId: c, userType: t, sessionId: n });
    try {
      const k = new BroadcastChannel("tasks");
      return k.onmessage = (b) => {
        const x = b.data || {};
        if (console.log("[useTasks] BroadcastChannel message received", { msg: x, sessionId: j, currentBoardId: c, currentContext: { userType: t, sessionId: n } }), x.sessionId === j) {
          console.log("[useTasks] Ignoring own broadcast message");
          return;
        }
        if (x.userType !== t || x.sessionId !== n) {
          console.log("[useTasks] Ignoring message for different user context", {
            msgContext: { userType: x.userType, sessionId: x.sessionId },
            currentContext: { userType: t, sessionId: n }
          });
          return;
        }
        (x.type === "tasks-updated" || x.type === "boards-updated") && (console.log("[useTasks] BroadcastChannel: triggering reload for currentBoardId =", c), p());
      }, () => {
        console.log("[useTasks] Cleaning up BroadcastChannel listener", { currentBoardId: c }), k.close();
      };
    } catch (k) {
      console.error("[useTasks] Failed to setup BroadcastChannel", k);
    }
  }, [c, t, n]);
  async function v(k) {
    if (k = k.trim(), !!k)
      try {
        const b = Bt(k);
        return await r.createTask(b, c), await p(), !0;
      } catch (b) {
        return alert(b.message || "Failed to create task"), !1;
      }
  }
  async function y(k) {
    await xe(
      `complete-${k}`,
      s,
      o,
      async () => {
        await r.completeTask(k, c), await p();
      },
      {
        onError: (b) => alert(b.message || "Failed to complete task")
      }
    );
  }
  async function N(k) {
    console.log("[useTasks] deleteTask START", { taskId: k, currentBoardId: c }), await xe(
      `delete-${k}`,
      s,
      o,
      async () => {
        console.log("[useTasks] deleteTask: calling api.deleteTask", { taskId: k, currentBoardId: c }), await r.deleteTask(k, c), console.log("[useTasks] deleteTask: calling reload"), await p(), console.log("[useTasks] deleteTask END");
      },
      {
        onError: (b) => alert(b.message || "Failed to delete task")
      }
    );
  }
  async function W(k) {
    const b = prompt("Enter tag (without #):");
    if (!b) return;
    const x = b.trim().replace(/^#+/, "").replace(/\s+/g, "-"), f = e.find((D) => D.id === k);
    if (!f) return;
    const T = f.tag?.split(" ") || [];
    if (T.includes(x)) return;
    const C = [...T, x].join(" ");
    try {
      await r.patchTask(k, { tag: C }, c), await p();
    } catch (D) {
      alert(D.message || "Failed to add tag");
    }
  }
  async function L(k, b, x = {}) {
    const { suppressBroadcast: f = !1, skipReload: T = !1 } = x;
    try {
      await r.patchTask(k, b, c, f), T || await p();
    } catch (C) {
      throw C;
    }
  }
  async function U(k) {
    console.log("[useTasks] bulkUpdateTaskTags START", { count: k.length });
    try {
      await r.batchUpdateTags(
        c,
        k.map((b) => ({ taskId: b.taskId, tag: b.tag || null }))
      ), console.log("[useTasks] bulkUpdateTaskTags: calling reload"), await p(), console.log("[useTasks] bulkUpdateTaskTags END");
    } catch (b) {
      throw console.error("[useTasks] bulkUpdateTaskTags ERROR", b), b;
    }
  }
  async function J(k) {
    console.log("[useTasks] deleteTag START", { tag: k, currentBoardId: c, taskCount: e.length });
    const b = e.filter((x) => x.tag?.split(" ").includes(k));
    if (console.log("[useTasks] deleteTag: found tasks with tag", { tag: k, count: b.length }), b.length === 0) {
      console.log("[useTasks] deleteTag: no tasks found with this tag, just deleting tag");
      try {
        await r.deleteTag(k, c), await p(), console.log("[useTasks] deleteTag END (no tasks to clear)");
      } catch (x) {
        console.error("[useTasks] deleteTag ERROR", x), console.error("[useTasks] deleteTag: Please fix this error:", x.message);
      }
      return;
    }
    try {
      console.log("[useTasks] deleteTag: starting batch clear"), await r.batchClearTag(
        c,
        k,
        b.map((x) => x.id)
      ), console.log("[useTasks] deleteTag: calling reload"), await p(), console.log("[useTasks] deleteTag END");
    } catch (x) {
      console.error("[useTasks] deleteTag ERROR", x), alert(x.message || "Failed to remove tag from tasks");
    }
  }
  async function H(k) {
    await r.createBoard(k), u(k);
    const b = await r.getBoards();
    d(b);
    const { tasks: x } = re(b, k);
    a(x);
  }
  async function V(k, b) {
    if (console.log("[useTasks] moveTasksToBoard START", { targetBoardId: k, ids: b, currentBoardId: c }), !l) return;
    const x = /* @__PURE__ */ new Set();
    for (const f of l.boards)
      for (const T of f.tasks || [])
        b.includes(T.id) && x.add(f.id);
    console.log("[useTasks] moveTasksToBoard: source boards", { sourceBoardIds: Array.from(x) });
    try {
      if (x.size === 1) {
        const C = Array.from(x)[0];
        console.log("[useTasks] moveTasksToBoard: using batch API"), await r.batchMoveTasks(C, k, b);
      } else
        throw console.error("[useTasks] moveTasksToBoard: Cannot move tasks from multiple boards at once"), new Error("Cannot move tasks from multiple boards at once");
      console.log("[useTasks] moveTasksToBoard: switching to target board", { targetBoardId: k }), u(k);
      const f = await r.getBoards();
      d(f);
      const { tasks: T } = re(f, k);
      a(T), console.log("[useTasks] moveTasksToBoard END");
    } catch (f) {
      console.error("[useTasks] moveTasksToBoard ERROR", f), alert(f.message || "Failed to move tasks");
    }
  }
  async function q(k) {
    if (await r.deleteBoard(k), c === k) {
      u("main");
      const b = await r.getBoards();
      d(b);
      const { tasks: x } = re(b, "main");
      a(x);
    } else
      await p();
  }
  async function ae(k) {
    await r.createTag(k, c), await p();
  }
  async function ne(k) {
    await r.deleteTag(k, c), await p();
  }
  function z(k) {
    u(k);
    const { tasks: b, foundBoard: x } = re(l, k);
    x ? a(b) : p();
  }
  return {
    // Task state
    tasks: e,
    pendingOperations: s,
    // Task operations
    addTask: v,
    completeTask: y,
    deleteTask: N,
    addTagToTask: W,
    updateTaskTags: L,
    bulkUpdateTaskTags: U,
    deleteTag: J,
    // Board state
    boards: l,
    currentBoardId: c,
    // Board operations
    createBoard: H,
    deleteBoard: q,
    switchBoard: z,
    moveTasksToBoard: V,
    createTagOnBoard: ae,
    deleteTagOnBoard: ne,
    // Lifecycle
    initialLoad: g,
    reload: p
  };
}
function Mt({ tasks: t, onTaskUpdate: n, onBulkUpdate: e }) {
  const [a, s] = A(null), [o, r] = A(null), [l, d] = A(/* @__PURE__ */ new Set()), [c, u] = A(!1), [g, p] = A(null), [v, y] = A(null), N = he(null);
  function W(f) {
    let T = [];
    try {
      const C = f.dataTransfer.getData("application/x-hadoku-task-ids");
      C && (T = JSON.parse(C));
    } catch {
    }
    if (T.length === 0) {
      const C = f.dataTransfer.getData("text/plain");
      C && (T = [C]);
    }
    return T;
  }
  function L(f, T) {
    const C = l.has(T) && l.size > 0 ? Array.from(l) : [T];
    console.log("[useDragAndDrop] onDragStart", { taskId: T, idsToDrag: C, selectedCount: l.size }), f.dataTransfer.setData("text/plain", C[0]);
    try {
      f.dataTransfer.setData("application/x-hadoku-task-ids", JSON.stringify(C));
    } catch {
    }
    f.dataTransfer.effectAllowed = "copyMove";
    try {
      const D = f.currentTarget, M = D.closest && D.closest(".task-app__item") ? D.closest(".task-app__item") : D;
      M.classList.add("dragging");
      const B = M.cloneNode(!0);
      B.style.boxSizing = "border-box", B.style.width = `${M.offsetWidth}px`, B.style.height = `${M.offsetHeight}px`, B.style.opacity = "0.95", B.style.transform = "none", B.style.filter = "drop-shadow(0 6px 18px rgba(0,0,0,0.12))", B.classList.add("drag-image"), B.style.position = "absolute", B.style.top = "-9999px", B.style.left = "-9999px", document.body.appendChild(B), M.__dragImage = B, d((P) => {
        if (P.has(T)) return new Set(P);
        const $ = new Set(P);
        return $.add(T), $;
      });
      try {
        const P = M.closest(".task-app__tag-column");
        if (P) {
          const $ = P.querySelector(".task-app__tag-header") || P.querySelector("h3"), F = ($ && $.textContent || "").trim().replace(/^#/, "");
          if (F)
            try {
              f.dataTransfer.setData("application/x-hadoku-task-source", F);
            } catch {
            }
        }
      } catch {
      }
      try {
        const P = M.getBoundingClientRect();
        let $ = Math.round(f.clientX - P.left), w = Math.round(f.clientY - P.top);
        $ = Math.max(0, Math.min(Math.round(B.offsetWidth - 1), $)), w = Math.max(0, Math.min(Math.round(B.offsetHeight - 1), w)), f.dataTransfer.setDragImage(B, $, w);
      } catch {
        f.dataTransfer.setDragImage(B, 0, 0);
      }
    } catch {
    }
  }
  function U(f) {
    try {
      const T = f.currentTarget;
      T.classList.remove("dragging");
      const C = T.__dragImage;
      C && C.parentNode && C.parentNode.removeChild(C), C && delete T.__dragImage;
    } catch {
    }
    try {
      q();
    } catch {
    }
  }
  function J(f) {
    if (f.button === 0) {
      try {
        const T = f.target;
        if (!T || T.closest && T.closest(".task-app__item, .task-app__controls, button, input, textarea, .task-app__item-actions"))
          return;
      } catch {
      }
      u(!0), N.current = { x: f.clientX, y: f.clientY }, p({ x: f.clientX, y: f.clientY, w: 0, h: 0 }), d(/* @__PURE__ */ new Set());
      try {
        document.body.classList.add("marquee-selecting");
      } catch {
      }
    }
  }
  function H(f) {
    if (!c || !N.current) return;
    const T = N.current.x, C = N.current.y, D = f.clientX, M = f.clientY, B = Math.min(T, D), P = Math.min(C, M), $ = Math.abs(D - T), w = Math.abs(M - C);
    p({ x: B, y: P, w: $, h: w });
    const F = Array.from(document.querySelectorAll(".task-app__item")), I = /* @__PURE__ */ new Set();
    for (const R of F) {
      const Z = R.getBoundingClientRect();
      if (!(Z.right < B || Z.left > B + $ || Z.bottom < P || Z.top > P + w)) {
        const ue = R.getAttribute("data-task-id");
        ue && I.add(ue), R.classList.add("selected");
      } else
        R.classList.remove("selected");
    }
    d(I);
  }
  function V(f) {
    u(!1), p(null), N.current = null;
    try {
      document.body.classList.remove("marquee-selecting");
    } catch {
    }
    try {
      y(Date.now());
    } catch {
    }
  }
  function q() {
    d(/* @__PURE__ */ new Set()), Array.from(document.querySelectorAll(".task-app__item.selected")).forEach((T) => T.classList.remove("selected"));
  }
  ee(() => {
    function f(D) {
      if (D.button !== 0) return;
      const M = { target: D.target, clientX: D.clientX, clientY: D.clientY, button: D.button };
      try {
        J(M);
      } catch {
      }
    }
    function T(D) {
      const M = { clientX: D.clientX, clientY: D.clientY };
      try {
        H(M);
      } catch {
      }
    }
    function C(D) {
      const M = { clientX: D.clientX, clientY: D.clientY };
      try {
        V(M);
      } catch {
      }
    }
    return document.addEventListener("mousedown", f), document.addEventListener("mousemove", T), document.addEventListener("mouseup", C), () => {
      document.removeEventListener("mousedown", f), document.removeEventListener("mousemove", T), document.removeEventListener("mouseup", C);
    };
  }, []);
  function ae(f, T) {
    f.preventDefault(), f.dataTransfer.dropEffect = "copy", s(T);
  }
  function ne(f) {
    f.currentTarget.contains(f.relatedTarget) || s(null);
  }
  async function z(f, T) {
    f.preventDefault(), s(null), console.log("[useDragAndDrop] onDrop START", { targetTag: T });
    const C = W(f);
    if (C.length === 0) return;
    let D = null;
    try {
      const B = f.dataTransfer.getData("application/x-hadoku-task-source");
      B && (D = B);
    } catch {
    }
    console.log("[useDragAndDrop] onDrop: processing", { targetTag: T, ids: C, srcTag: D, taskCount: C.length });
    const M = [];
    for (const B of C) {
      const P = t.find((R) => R.id === B);
      if (!P) continue;
      const $ = P.tag?.split(" ").filter(Boolean) || [];
      if (T === "other") {
        if ($.length === 0) continue;
        M.push({ taskId: B, tag: "" });
        continue;
      }
      const w = $.includes(T);
      let F = $.slice();
      w || F.push(T), D && D !== T && (F = F.filter((R) => R !== D));
      const I = F.join(" ").trim();
      M.push({ taskId: B, tag: I });
    }
    console.log("[useDragAndDrop] onDrop: updating tasks", { updateCount: M.length });
    try {
      await e(M), console.log("[useDragAndDrop] onDrop: updates complete, clearing selection");
      try {
        q();
      } catch {
      }
    } catch (B) {
      console.error("Failed to add tag to one or more tasks:", B), alert(B.message || "Failed to add tags");
    }
    console.log("[useDragAndDrop] onDrop END");
  }
  function k(f, T) {
    f.preventDefault(), f.dataTransfer.dropEffect = "copy", r(T);
  }
  function b(f) {
    f.currentTarget.contains(f.relatedTarget) || r(null);
  }
  async function x(f, T) {
    f.preventDefault(), r(null);
    const C = W(f);
    if (C.length === 0) return;
    console.log("[useDragAndDrop] onFilterDrop", { filterTag: T, ids: C, taskCount: C.length });
    const D = [];
    for (const M of C) {
      const B = t.find((w) => w.id === M);
      if (!B) continue;
      const P = B.tag?.split(" ").filter(Boolean) || [];
      if (P.includes(T)) {
        console.log(`Task ${M} already has tag: ${T}`);
        continue;
      }
      const $ = [...P, T].join(" ");
      D.push({ taskId: M, tag: $ });
    }
    if (D.length === 0) {
      console.log("No updates needed - all tasks already have this tag");
      return;
    }
    console.log(`Adding tag "${T}" to ${D.length} task(s) via filter drop`);
    try {
      await e(D);
      try {
        q();
      } catch {
      }
    } catch (M) {
      console.error("Failed to add tag via filter drop:", M), alert(M.message || "Failed to add tag");
    }
  }
  return {
    dragOverTag: a,
    dragOverFilter: o,
    setDragOverFilter: r,
    selectedIds: l,
    isSelecting: c,
    marqueeRect: g,
    selectionJustEndedAt: v,
    // selection handlers
    selectionStartHandler: J,
    selectionMoveHandler: H,
    selectionEndHandler: V,
    clearSelection: q,
    onDragStart: L,
    onDragEnd: U,
    onDragOver: ae,
    onDragLeave: ne,
    onDrop: z,
    onFilterDragOver: k,
    onFilterDragLeave: b,
    onFilterDrop: x
  };
}
function _t() {
  const [t, n] = A({});
  function e(r) {
    n((l) => {
      const c = (l[r] || "desc") === "desc" ? "asc" : "desc";
      return { ...l, [r]: c };
    });
  }
  function a(r, l) {
    return [...r].sort((d, c) => {
      const u = new Date(d.createdAt).getTime(), g = new Date(c.createdAt).getTime();
      return l === "asc" ? u - g : g - u;
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
const De = 5, It = 300, ge = "1.0", Be = "task-storage-version", Lt = [
  /^tasks-/,
  // tasks-main, tasks-work
  /^stats-/,
  // stats-main, stats-work
  /^boards$/,
  // boards (without prefix)
  /^preferences$/
  // preferences (without prefix)
], Ne = {
  version: 1,
  updatedAt: (/* @__PURE__ */ new Date()).toISOString(),
  experimentalThemes: !1,
  alwaysVerticalLayout: !1,
  theme: "light",
  showCompleteButton: !0,
  showDeleteButton: !0,
  showTagButton: !1
};
function Ot(t, n) {
  const e = window.localStorage.getItem(Be);
  e !== ge && (console.log("[Preferences] Storage version mismatch, cleaning up orphaned keys", {
    current: e,
    expected: ge
  }), Object.keys(window.localStorage).forEach((a) => {
    const s = Lt.some((r) => r.test(a)), o = a.includes(`${t}-${n}`);
    s && !o && (console.log("[Preferences] Removing orphaned key:", a), window.localStorage.removeItem(a));
  }), window.localStorage.setItem(Be, ge), console.log("[Preferences] Storage upgraded to version", ge));
}
function Pt(t) {
  try {
    const n = sessionStorage.getItem("theme"), e = sessionStorage.getItem("showCompleteButton"), a = sessionStorage.getItem("showDeleteButton"), s = sessionStorage.getItem("showTagButton"), o = {};
    return n && !t.theme && (o.theme = n), e !== null && t.showCompleteButton === void 0 && (o.showCompleteButton = e === "true"), a !== null && t.showDeleteButton === void 0 && (o.showDeleteButton = a === "true"), s !== null && t.showTagButton === void 0 && (o.showTagButton = s === "true"), Object.keys(o).length > 0 ? (console.log("[Preferences] Migrating settings from sessionStorage to localStorage:", o), sessionStorage.removeItem("theme"), sessionStorage.removeItem("showCompleteButton"), sessionStorage.removeItem("showDeleteButton"), sessionStorage.removeItem("showTagButton"), o) : null;
  } catch (n) {
    return console.warn("[Preferences] Failed to migrate settings:", n), null;
  }
}
function $t(t, n, e = !1) {
  const [a, s] = A(null), [o, r] = A(!1);
  ee(() => {
    if (e) {
      r(!0);
      return;
    }
    (async () => {
      Ot(t, n), console.log("[usePreferences] Loading preferences...", { userType: t, sessionId: n });
      const u = ie(t, n), g = await u.getPreferences();
      if (console.log("[usePreferences] Loaded preferences:", g), g) {
        const p = Pt(g);
        if (p) {
          const v = { ...g, ...p, updatedAt: (/* @__PURE__ */ new Date()).toISOString() };
          s(v), await u.savePreferences(v), console.log("[usePreferences] Applied and saved migrations");
        } else
          s(g), console.log("[usePreferences] Applied preferences to state");
      }
      r(!0);
    })();
  }, [t, n, e]);
  const l = async (c) => {
    const u = { ...a, ...c, updatedAt: (/* @__PURE__ */ new Date()).toISOString() };
    s(u), await ie(t, n).savePreferences(u);
  }, d = a?.theme?.endsWith("-dark") || a?.theme === "dark";
  return {
    preferences: a,
    savePreferences: l,
    preferencesLoaded: o,
    isDarkTheme: d,
    setPreferences: s,
    setPreferencesLoaded: r
  };
}
const G = {
  width: 20,
  height: 20,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round"
}, Ft = () => /* @__PURE__ */ m("svg", { ...G, children: [
  /* @__PURE__ */ i("circle", { cx: "12", cy: "12", r: "5" }),
  /* @__PURE__ */ i("line", { x1: "12", y1: "1", x2: "12", y2: "3" }),
  /* @__PURE__ */ i("line", { x1: "12", y1: "21", x2: "12", y2: "23" }),
  /* @__PURE__ */ i("line", { x1: "4.22", y1: "4.22", x2: "5.64", y2: "5.64" }),
  /* @__PURE__ */ i("line", { x1: "18.36", y1: "18.36", x2: "19.78", y2: "19.78" }),
  /* @__PURE__ */ i("line", { x1: "1", y1: "12", x2: "3", y2: "12" }),
  /* @__PURE__ */ i("line", { x1: "21", y1: "12", x2: "23", y2: "12" }),
  /* @__PURE__ */ i("line", { x1: "4.22", y1: "19.78", x2: "5.64", y2: "18.36" }),
  /* @__PURE__ */ i("line", { x1: "18.36", y1: "5.64", x2: "19.78", y2: "4.22" })
] }), je = () => /* @__PURE__ */ i("svg", { ...G, children: /* @__PURE__ */ i("path", { d: "M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" }) }), Ae = () => /* @__PURE__ */ m("svg", { ...G, children: [
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
] }), Ee = () => /* @__PURE__ */ m("svg", { ...G, children: [
  /* @__PURE__ */ i("path", { d: "M2 12c2-2 4-2 6 0s4 2 6 0 4-2 6 0" }),
  /* @__PURE__ */ i("path", { d: "M2 17c2-2 4-2 6 0s4 2 6 0 4-2 6 0" }),
  /* @__PURE__ */ i("path", { d: "M2 7c2-2 4-2 6 0s4 2 6 0 4-2 6 0" })
] }), Me = () => /* @__PURE__ */ i("svg", { ...G, children: /* @__PURE__ */ i("polygon", { points: "13 2 3 14 12 14 11 22 21 10 12 10 13 2" }) }), _e = () => /* @__PURE__ */ m("svg", { ...G, children: [
  /* @__PURE__ */ i("path", { d: "M18 8h1a4 4 0 0 1 0 8h-1" }),
  /* @__PURE__ */ i("path", { d: "M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" }),
  /* @__PURE__ */ i("line", { x1: "6", y1: "1", x2: "6", y2: "4" }),
  /* @__PURE__ */ i("line", { x1: "10", y1: "1", x2: "10", y2: "4" }),
  /* @__PURE__ */ i("line", { x1: "14", y1: "1", x2: "14", y2: "4" })
] }), Ie = () => /* @__PURE__ */ m("svg", { ...G, children: [
  /* @__PURE__ */ i("circle", { cx: "12", cy: "12", r: "2", fill: "currentColor" }),
  /* @__PURE__ */ i("circle", { cx: "12", cy: "6", r: "2.5", fill: "none", stroke: "currentColor", strokeWidth: "2" }),
  /* @__PURE__ */ i("circle", { cx: "18", cy: "10", r: "2.5", fill: "none", stroke: "currentColor", strokeWidth: "2" }),
  /* @__PURE__ */ i("circle", { cx: "16", cy: "16", r: "2.5", fill: "none", stroke: "currentColor", strokeWidth: "2" }),
  /* @__PURE__ */ i("circle", { cx: "8", cy: "16", r: "2.5", fill: "none", stroke: "currentColor", strokeWidth: "2" }),
  /* @__PURE__ */ i("circle", { cx: "6", cy: "10", r: "2.5", fill: "none", stroke: "currentColor", strokeWidth: "2" })
] }), Le = () => /* @__PURE__ */ i("svg", { ...G, children: /* @__PURE__ */ i("path", { d: "M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z", fill: "currentColor" }) }), Oe = () => /* @__PURE__ */ m("svg", { ...G, children: [
  /* @__PURE__ */ i("path", { d: "M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z", fill: "currentColor" }),
  /* @__PURE__ */ i("path", { d: "M2 21c0-3 1.85-5.36 5.08-6C9 14.5 11 14 11 20", stroke: "currentColor", strokeWidth: "2", fill: "none" }),
  /* @__PURE__ */ i("path", { d: "M11 8c3 2 5 4 7 7", stroke: "white", strokeWidth: "1.5", opacity: "0.4" })
] }), Rt = () => /* @__PURE__ */ m("svg", { ...G, children: [
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
] }), Kt = () => /* @__PURE__ */ m("svg", { ...G, width: 16, height: 16, viewBox: "0 0 20 20", children: [
  /* @__PURE__ */ i(
    "path",
    {
      d: "M2 4 L12 4 L16 10 L12 16 L2 16 Z",
      fill: "currentColor"
    }
  ),
  /* @__PURE__ */ i("circle", { cx: "6", cy: "10", r: "1.5", fill: "white" })
] }), Pe = [
  {
    lightIcon: /* @__PURE__ */ i(Ft, {}),
    darkIcon: /* @__PURE__ */ i(je, {}),
    lightTheme: "light",
    darkTheme: "dark",
    lightLabel: "Light",
    darkLabel: "Dark"
  },
  {
    lightIcon: /* @__PURE__ */ i(_e, {}),
    darkIcon: /* @__PURE__ */ i(_e, {}),
    lightTheme: "coffee-light",
    darkTheme: "coffee-dark",
    lightLabel: "Coffee Light",
    darkLabel: "Coffee Dark"
  },
  {
    lightIcon: /* @__PURE__ */ i(Oe, {}),
    darkIcon: /* @__PURE__ */ i(Oe, {}),
    lightTheme: "nature-light",
    darkTheme: "nature-dark",
    lightLabel: "Nature Light",
    darkLabel: "Nature Dark"
  },
  {
    lightIcon: /* @__PURE__ */ i(Ie, {}),
    darkIcon: /* @__PURE__ */ i(Ie, {}),
    lightTheme: "lavender-light",
    darkTheme: "lavender-dark",
    lightLabel: "Lavender Light",
    darkLabel: "Lavender Dark"
  },
  {
    lightIcon: /* @__PURE__ */ i(Ae, {}),
    darkIcon: /* @__PURE__ */ i(Ae, {}),
    lightTheme: "strawberry-light",
    darkTheme: "strawberry-dark",
    lightLabel: "Strawberry Light",
    darkLabel: "Strawberry Dark"
  },
  {
    lightIcon: /* @__PURE__ */ i(Ee, {}),
    darkIcon: /* @__PURE__ */ i(Ee, {}),
    lightTheme: "ocean-light",
    darkTheme: "ocean-dark",
    lightLabel: "Ocean Light",
    darkLabel: "Ocean Dark"
  }
], Ut = [
  {
    lightIcon: /* @__PURE__ */ i(Me, {}),
    darkIcon: /* @__PURE__ */ i(Me, {}),
    lightTheme: "cyberpunk-light",
    darkTheme: "cyberpunk-dark",
    lightLabel: "Cyberpunk Light",
    darkLabel: "Cyberpunk Dark"
  },
  {
    lightIcon: /* @__PURE__ */ i(Le, {}),
    darkIcon: /* @__PURE__ */ i(Le, {}),
    lightTheme: "pink-light",
    darkTheme: "pink-dark",
    lightLabel: "Pink Light",
    darkLabel: "Pink Dark"
  }
];
function Ve(t) {
  return t ? [...Pe, ...Ut] : Pe;
}
function Ht(t, n) {
  const a = Ve(n).find(
    (s) => s.lightTheme === t || s.darkTheme === t
  );
  return a ? t.endsWith("-dark") || t === "dark" ? a.darkIcon : a.lightIcon : /* @__PURE__ */ i(je, {});
}
function Wt(t, n, e, a = !0) {
  const [s, o] = A(!1), [r, l] = A(!1), c = typeof window < "u" && window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light", u = t?.theme || c, g = (v) => n({ theme: v }), p = Ue(
    () => Ve(t?.experimentalThemes || !1),
    [t?.experimentalThemes]
  );
  return ee(() => {
    if (!t) {
      console.log("[Theme] Waiting for preferences to be loaded (preferences is null)"), l(!1);
      return;
    }
    console.log(`[Theme] Applying theme: ${u} (preferences loaded)`), l(!1), document.documentElement.setAttribute("data-theme", u), e.current && e.current.setAttribute("data-theme", u);
    const v = setTimeout(() => {
      console.log(`[Theme] Theme ready: ${u}`), l(!0);
    }, 50);
    return () => clearTimeout(v);
  }, [u, e, t]), ee(() => {
    const v = window.matchMedia("(prefers-color-scheme: dark)"), y = (N) => {
      const W = N.matches, L = u.replace(/-light$|-dark$/, ""), U = u.endsWith("-dark") ? "dark" : u.endsWith("-light") ? "light" : null;
      if (U && L !== "light" && L !== "dark") {
        const J = W ? "dark" : "light";
        if (U !== J) {
          const H = `${L}-${J}`;
          console.log(`[Theme] Auto-switching from ${u} to ${H} (system preference)`), g(H);
        }
      }
    };
    return v.addEventListener ? v.addEventListener("change", y) : v.addListener(y), () => {
      v.removeEventListener ? v.removeEventListener("change", y) : v.removeListener(y);
    };
  }, [u, g]), {
    theme: u,
    showThemePicker: s,
    setShowThemePicker: o,
    THEME_FAMILIES: p,
    setTheme: g,
    isThemeReady: r
  };
}
function $e(t, n, e, a) {
  ee(() => {
    if (!n) return;
    const s = (o) => {
      const r = o.target;
      t.current && t.current.contains(r) || a && r.closest(a) || e();
    };
    return document.addEventListener("mousedown", s), () => document.removeEventListener("mousedown", s);
  }, [t, n, e, a]);
}
function Jt() {
  const [t, n] = A(null), [e, a] = A(!1), [s, o] = A(!1), [r, l] = A(!1), [d, c] = A(null), [u, g] = A(""), [p, v] = A(null), [y, N] = A(null), [W, L] = A(""), [U, J] = A(null), [H, V] = A(null);
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
    setEditTagInput: g,
    boardContextMenu: p,
    setBoardContextMenu: v,
    tagContextMenu: y,
    setTagContextMenu: N,
    inputValue: W,
    setInputValue: L,
    validationError: U,
    setValidationError: J,
    pendingTaskOperation: H,
    setPendingTaskOperation: V
  };
}
const Fe = 768;
function jt() {
  const [t, n] = A(() => typeof window > "u" ? !1 : window.innerWidth < Fe);
  return ee(() => {
    if (typeof window > "u") return;
    const e = window.matchMedia(`(max-width: ${Fe - 1}px)`), a = (s) => {
      n(s.matches);
    };
    return e.addEventListener ? e.addEventListener("change", a) : e.addListener(a), a(e), () => {
      e.removeEventListener ? e.removeEventListener("change", a) : e.removeListener(a);
    };
  }, []), t;
}
function Vt({ isDarkTheme: t }) {
  return /* @__PURE__ */ i("div", { className: "task-app-loading", "data-dark-theme": t ? "true" : "false", children: /* @__PURE__ */ m("div", { className: "task-app-loading__skeleton", children: [
    /* @__PURE__ */ m("div", { className: "skeleton-header-row", children: [
      /* @__PURE__ */ i("div", { className: "skeleton-header" }),
      /* @__PURE__ */ i("div", { className: "skeleton-theme-button" })
    ] }),
    /* @__PURE__ */ m("div", { className: "skeleton-boards", children: [
      /* @__PURE__ */ i("div", { className: "skeleton-board" }),
      /* @__PURE__ */ i("div", { className: "skeleton-board" }),
      /* @__PURE__ */ i("div", { className: "skeleton-board-add" })
    ] }),
    /* @__PURE__ */ i("div", { className: "skeleton-input" }),
    /* @__PURE__ */ m("div", { className: "skeleton-filters", children: [
      /* @__PURE__ */ i("div", { className: "skeleton-filter" }),
      /* @__PURE__ */ i("div", { className: "skeleton-filter" }),
      /* @__PURE__ */ i("div", { className: "skeleton-filter" }),
      /* @__PURE__ */ i("div", { className: "skeleton-filter-add" })
    ] }),
    /* @__PURE__ */ m("div", { className: "skeleton-column", children: [
      /* @__PURE__ */ i("div", { className: "skeleton-column-header" }),
      /* @__PURE__ */ i("div", { className: "skeleton-task" }),
      /* @__PURE__ */ i("div", { className: "skeleton-task" }),
      /* @__PURE__ */ i("div", { className: "skeleton-task" })
    ] })
  ] }) });
}
function Xt({
  theme: t,
  experimentalThemes: n,
  showThemePicker: e,
  onThemePickerToggle: a,
  onThemeChange: s,
  onSettingsClick: o,
  THEME_FAMILIES: r
}) {
  return /* @__PURE__ */ m("div", { className: "task-app__header-container", children: [
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
    /* @__PURE__ */ m("div", { className: "theme-picker", children: [
      /* @__PURE__ */ i(
        "button",
        {
          className: "theme-toggle-btn",
          onClick: a,
          "aria-label": "Choose theme",
          title: "Choose theme",
          children: Ht(t, n)
        }
      ),
      e && /* @__PURE__ */ m(
        "div",
        {
          className: "theme-picker__dropdown",
          onClick: (l) => l.stopPropagation(),
          children: [
            /* @__PURE__ */ i("div", { className: "theme-picker__pills", children: r.map((l, d) => /* @__PURE__ */ m("div", { className: "theme-pill", children: [
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
                children: /* @__PURE__ */ i(Rt, {})
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
function Xe({ onLongPress: t, delay: n = 500 }) {
  const e = he(null);
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
function we(t) {
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
function qt({
  board: t,
  isActive: n,
  isDragOver: e,
  onSwitch: a,
  onContextMenu: s,
  onDragOverFilter: o,
  onMoveTasksToBoard: r,
  onClearSelection: l
}) {
  const d = Xe({
    onLongPress: (u, g) => s(t.id, u, g)
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
        const g = we(u.dataTransfer);
        if (g.length !== 0)
          try {
            await r(t.id, g);
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
function zt({
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
  onInitialLoad: g
}) {
  const [p, v] = A(!1), y = t && t.boards ? t.boards.slice(0, De) : [{ id: "main", name: "main", tasks: [], tags: [] }], N = !t || t.boards && t.boards.length < De, W = async (L) => {
    if (p) return;
    console.log("[BoardsSection] Manual refresh triggered"), v(!0);
    const U = L.currentTarget, J = new Promise((H, V) => {
      setTimeout(() => V(new Error("Sync timeout")), 5e3);
    });
    try {
      await Promise.race([g(), J]), console.log("[BoardsSection] Sync completed successfully");
    } catch (H) {
      console.error("[BoardsSection] Sync failed:", H);
    } finally {
      v(!1), U?.blur();
    }
  };
  return /* @__PURE__ */ m("div", { className: "task-app__boards", children: [
    /* @__PURE__ */ i("div", { className: "task-app__board-list", children: y.map((L) => /* @__PURE__ */ i(
      qt,
      {
        board: L,
        isActive: n === L.id,
        isDragOver: a === `board:${L.id}`,
        onSwitch: s,
        onContextMenu: o,
        onDragOverFilter: r,
        onMoveTasksToBoard: l,
        onClearSelection: d
      },
      L.id
    )) }),
    /* @__PURE__ */ m("div", { className: "task-app__board-actions", children: [
      N && /* @__PURE__ */ i(
        "button",
        {
          className: `board-add-btn ${a === "add-board" ? "board-btn--drag-over" : ""}`,
          onClick: c,
          onDragOver: (L) => {
            L.preventDefault(), L.dataTransfer.dropEffect = "move", r("add-board");
          },
          onDragLeave: () => r(null),
          onDrop: (L) => {
            L.preventDefault(), r(null);
            const U = we(L.dataTransfer);
            U.length > 0 && (u({ type: "move-to-board", taskIds: U }), c());
          },
          "aria-label": "Create board",
          children: "＋"
        }
      ),
      e !== "public" && /* @__PURE__ */ i(
        "button",
        {
          className: `sync-btn ${p ? "spinning" : ""}`,
          onClick: W,
          disabled: p,
          title: "Sync from server",
          "aria-label": "Sync from server",
          children: /* @__PURE__ */ m("svg", { width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [
            /* @__PURE__ */ i("polyline", { points: "23 4 23 10 17 10" }),
            /* @__PURE__ */ i("polyline", { points: "1 20 1 14 7 14" }),
            /* @__PURE__ */ i("path", { d: "M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" })
          ] })
        }
      )
    ] })
  ] });
}
function Yt({
  tag: t,
  isActive: n,
  isDragOver: e,
  onToggle: a,
  onContextMenu: s,
  onDragOver: o,
  onDragLeave: r,
  onDrop: l
}) {
  const d = Xe({
    onLongPress: (c, u) => s(t, c, u)
  });
  return /* @__PURE__ */ m(
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
function Gt({
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
  const u = (g) => {
    g.preventDefault(), r(g);
    const p = we(g.dataTransfer);
    p.length > 0 && (c({ type: "apply-tag", taskIds: p }), d());
  };
  return /* @__PURE__ */ m("div", { className: "task-app__filters", children: [
    t.map((g) => /* @__PURE__ */ i(
      Yt,
      {
        tag: g,
        isActive: n.has(g),
        isDragOver: e === g,
        onToggle: a,
        onContextMenu: s,
        onDragOver: o,
        onDragLeave: r,
        onDrop: l
      },
      g
    )),
    /* @__PURE__ */ i(
      "button",
      {
        className: `task-app__filter-add ${e === "add-tag" ? "task-app__filter-drag-over" : ""}`,
        onClick: d,
        onDragOver: (g) => {
          g.preventDefault(), g.dataTransfer.dropEffect = "copy", o(g, "add-tag");
        },
        onDragLeave: r,
        onDrop: u,
        "aria-label": "Add tag",
        children: "＋"
      }
    )
  ] });
}
function Zt(t) {
  const n = /* @__PURE__ */ new Date(), e = new Date(t), a = n.getTime() - e.getTime(), s = Math.floor(a / 1e3), o = Math.floor(s / 60), r = Math.floor(o / 60), l = Math.floor(r / 24);
  return s < 60 ? `${s}s ago` : o < 60 ? `${o}m ago` : r < 24 ? `${r}h ago` : `${l}d ago`;
}
function ke({
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
  showTagButton: g = !1
}) {
  const p = e.has(`complete-${t.id}`), v = e.has(`delete-${t.id}`);
  return /* @__PURE__ */ m(
    "li",
    {
      className: `task-app__item ${d ? "selected" : ""}`,
      "data-task-id": t.id,
      draggable: n,
      onDragStart: r ? (y) => r(y, t.id) : void 0,
      onDragEnd: (y) => {
        if (y.currentTarget.classList.remove("dragging"), l)
          try {
            l(y);
          } catch {
          }
      },
      children: [
        /* @__PURE__ */ m("div", { className: "task-app__item-content", children: [
          /* @__PURE__ */ i("div", { className: "task-app__item-title", title: t.title, children: t.title }),
          /* @__PURE__ */ m("div", { className: "task-app__item-meta-row", children: [
            t.tag ? /* @__PURE__ */ i("div", { className: "task-app__item-tag", children: t.tag.split(" ").sort().map((y) => `#${y}`).join(" ") }) : /* @__PURE__ */ i("div", {}),
            /* @__PURE__ */ i("div", { className: "task-app__item-age", children: Zt(t.createdAt) })
          ] })
        ] }),
        /* @__PURE__ */ m("div", { className: "task-app__item-actions", children: [
          g && /* @__PURE__ */ i(
            "button",
            {
              className: "task-app__action-btn task-app__edit-tag-btn",
              onClick: () => o(t.id),
              title: "Edit tags",
              disabled: p || v,
              children: /* @__PURE__ */ i(Kt, {})
            }
          ),
          c && /* @__PURE__ */ i(
            "button",
            {
              className: "task-app__action-btn task-app__complete-btn",
              onClick: () => a(t.id),
              title: "Complete task",
              disabled: p || v,
              children: p ? "⏳" : "✓"
            }
          ),
          u && /* @__PURE__ */ i(
            "button",
            {
              className: "task-app__action-btn task-app__delete-btn",
              onClick: () => s(t.id),
              title: "Delete task",
              disabled: p || v,
              children: v ? "⏳" : "×"
            }
          )
        ] })
      ]
    }
  );
}
function Re(t, n = !1) {
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
function Qt({
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
  onDragEnd: g,
  selectedIds: p,
  onSelectionStart: v,
  onSelectionMove: y,
  onSelectionEnd: N,
  onDragOver: W,
  onDragLeave: L,
  onDrop: U,
  toggleSort: J,
  sortTasksByAge: H,
  getSortIcon: V,
  getSortTitle: q,
  deleteTag: ae,
  onDeletePersistedTag: ne,
  showCompleteButton: z = !0,
  showDeleteButton: k = !0,
  showTagButton: b = !1
}) {
  const x = (w, F) => /* @__PURE__ */ m(
    "div",
    {
      className: `task-app__tag-column ${o === w ? "task-app__tag-column--drag-over" : ""}`,
      onDragOver: (I) => W(I, w),
      onDragLeave: L,
      onDrop: (I) => U(I, w),
      children: [
        /* @__PURE__ */ m("div", { className: "task-app__tag-header-row", children: [
          /* @__PURE__ */ m("h3", { className: "task-app__tag-header", children: [
            "#",
            w
          ] }),
          /* @__PURE__ */ i(
            "button",
            {
              className: "task-app__sort-btn task-app__sort-btn--active",
              onClick: () => J(w),
              title: q(s[w] || "desc"),
              children: V(s[w] || "desc")
            }
          )
        ] }),
        /* @__PURE__ */ i("ul", { className: "task-app__list task-app__list--column", children: H(F, s[w] || "desc").map((I) => /* @__PURE__ */ i(
          ke,
          {
            task: I,
            isDraggable: !0,
            pendingOperations: r,
            onComplete: l,
            onDelete: d,
            onEditTag: c,
            onDragStart: u,
            onDragEnd: g,
            selected: p ? p.has(I.id) : !1,
            showCompleteButton: z,
            showDeleteButton: k,
            showTagButton: b
          },
          I.id
        )) })
      ]
    },
    w
  ), f = (w, F) => {
    let I = Ce(t, w);
    return C && (I = I.filter((R) => {
      const Z = R.tag?.split(" ") || [];
      return a.some((de) => Z.includes(de));
    })), I.slice(0, F);
  }, T = n.length, C = Array.isArray(a) && a.length > 0, D = t.filter((w) => {
    if (!C) return !0;
    const F = w.tag?.split(" ") || [];
    return a.some((I) => F.includes(I));
  }), M = Re(T, e), B = C ? n.filter((w) => Ce(t, w).some((I) => {
    const R = I.tag?.split(" ") || [];
    return a.some((Z) => R.includes(Z));
  })) : n.slice(0, M.useTags);
  if (B.length === 0)
    return /* @__PURE__ */ i("ul", { className: "task-app__list", children: D.map((w) => /* @__PURE__ */ i(
      ke,
      {
        task: w,
        pendingOperations: r,
        onComplete: l,
        onDelete: d,
        onEditTag: c,
        onDragStart: u,
        onDragEnd: g,
        selected: p ? p.has(w.id) : !1,
        showCompleteButton: z,
        showDeleteButton: k,
        showTagButton: b
      },
      w.id
    )) });
  const P = At(t, n, a).filter((w) => {
    if (!C) return !0;
    const F = w.tag?.split(" ") || [];
    return a.some((I) => F.includes(I));
  }), $ = Re(B.length, e);
  return /* @__PURE__ */ m("div", { className: "task-app__dynamic-layout", children: [
    $.rows.length > 0 && /* @__PURE__ */ i(it, { children: $.rows.map((w, F) => /* @__PURE__ */ i("div", { className: `task-app__tag-grid task-app__tag-grid--${w.columns}col`, children: w.tagIndices.map((I) => {
      const R = B[I];
      return R ? x(R, f(R, $.maxPerColumn)) : null;
    }) }, F)) }),
    P.length > 0 && /* @__PURE__ */ m(
      "div",
      {
        className: `task-app__remaining ${o === "other" ? "task-app__tag-column--drag-over" : ""}`,
        onDragOver: (w) => {
          w.preventDefault(), w.dataTransfer.dropEffect = "move", W(w, "other");
        },
        onDragLeave: (w) => L(w),
        onDrop: (w) => U(w, "other"),
        children: [
          /* @__PURE__ */ m("div", { className: "task-app__tag-header-row", children: [
            /* @__PURE__ */ i("h3", { className: "task-app__remaining-header", children: "Other Tasks" }),
            /* @__PURE__ */ i(
              "button",
              {
                className: "task-app__sort-btn task-app__sort-btn--active",
                onClick: () => J("other"),
                title: q(s.other || "desc"),
                children: V(s.other || "desc")
              }
            )
          ] }),
          /* @__PURE__ */ i("ul", { className: "task-app__list", children: H(P, s.other || "desc").map((w) => /* @__PURE__ */ i(
            ke,
            {
              task: w,
              pendingOperations: r,
              onComplete: l,
              onDelete: d,
              onEditTag: c,
              onDragStart: u,
              onDragEnd: g,
              selected: p ? p.has(w.id) : !1,
              showCompleteButton: z,
              showDeleteButton: k,
              showTagButton: b
            },
            w.id
          )) })
        ]
      }
    )
  ] });
}
function ce({
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
  confirmDanger: g = !1
}) {
  return t ? /* @__PURE__ */ i(
    "div",
    {
      className: "modal-overlay",
      onClick: e,
      children: /* @__PURE__ */ m(
        "div",
        {
          className: "modal-card",
          onClick: (v) => v.stopPropagation(),
          children: [
            /* @__PURE__ */ i("h3", { children: n }),
            s,
            r && /* @__PURE__ */ i(
              "input",
              {
                type: "text",
                className: "modal-input",
                value: o || "",
                onChange: (v) => r(v.target.value),
                placeholder: l,
                autoFocus: !0,
                onKeyDown: (v) => {
                  v.key === "Enter" && !u && (v.preventDefault(), a()), v.key === "Escape" && (v.preventDefault(), e());
                }
              }
            ),
            /* @__PURE__ */ m("div", { className: "modal-actions", children: [
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
                  className: `modal-button ${g ? "modal-button--danger" : "modal-button--primary"}`,
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
function ea({ tag: t, count: n, isOpen: e, onClose: a, onConfirm: s }) {
  const o = async () => {
    t && (await s(t), a());
  };
  return /* @__PURE__ */ i(
    ce,
    {
      isOpen: e,
      title: `Clear Tag #${t}?`,
      onClose: a,
      onConfirm: o,
      confirmLabel: "Clear Tag",
      confirmDanger: !0,
      children: t && /* @__PURE__ */ m("p", { children: [
        "This will remove ",
        /* @__PURE__ */ m("strong", { children: [
          "#",
          t
        ] }),
        " from",
        " ",
        /* @__PURE__ */ m("strong", { children: [
          n,
          " task(s)"
        ] }),
        " and delete the tag from the board."
      ] })
    }
  );
}
function ta({
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
  return /* @__PURE__ */ m(
    ce,
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
        a?.type === "move-to-board" && a.taskIds.length > 0 && /* @__PURE__ */ m("p", { className: "modal-hint", children: [
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
function aa({
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
  }, d = Je(e);
  return /* @__PURE__ */ m(
    ce,
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
        a?.type === "apply-tag" && a.taskIds.length > 0 && /* @__PURE__ */ m("p", { className: "modal-hint", children: [
          "This tag will be applied to ",
          a.taskIds.length,
          " task",
          a.taskIds.length > 1 ? "s" : ""
        ] }),
        d.length > 0 && /* @__PURE__ */ m("div", { className: "modal-section", children: [
          /* @__PURE__ */ i("label", { className: "modal-label", children: "Existing tags:" }),
          /* @__PURE__ */ i("div", { className: "modal-tags-list", children: d.map((c) => /* @__PURE__ */ m("span", { className: "modal-tag-chip", children: [
            "#",
            c
          ] }, c)) })
        ] })
      ]
    }
  );
}
async function na(t, n) {
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
function sa({
  isOpen: t,
  preferences: n,
  showCompleteButton: e,
  showDeleteButton: a,
  showTagButton: s,
  onClose: o,
  onSavePreferences: r,
  onValidateKey: l
}) {
  const [d, c] = A(""), [u, g] = A(null), [p, v] = A(!1), y = async () => {
    if (!d.trim() || p) return;
    v(!0), g(null);
    const N = await na(d, l);
    N.success || (g(N.error || "Failed to validate key"), v(!1));
  };
  return /* @__PURE__ */ m(
    ce,
    {
      isOpen: t,
      title: "Settings",
      onClose: o,
      onConfirm: o,
      confirmLabel: "Close",
      cancelLabel: "Close",
      children: [
        /* @__PURE__ */ m("div", { className: "settings-section", children: [
          /* @__PURE__ */ i("h4", { className: "settings-section-title", children: "User Management" }),
          /* @__PURE__ */ m("div", { className: "settings-field", children: [
            /* @__PURE__ */ i("label", { className: "settings-field-label", children: "Enter New Key" }),
            /* @__PURE__ */ m("div", { className: "settings-field-input-group", children: [
              /* @__PURE__ */ i(
                "input",
                {
                  type: "password",
                  name: "key",
                  autoComplete: "key",
                  className: "settings-text-input",
                  value: d,
                  onChange: (N) => {
                    c(N.target.value), g(null);
                  },
                  onKeyDown: (N) => {
                    N.key === "Enter" && d && !p && y();
                  },
                  placeholder: "Enter authentication key",
                  disabled: p
                }
              ),
              d && /* @__PURE__ */ i(
                "button",
                {
                  className: "settings-field-button",
                  onClick: y,
                  disabled: p,
                  children: p ? /* @__PURE__ */ i("span", { className: "spinner" }) : "↵"
                }
              )
            ] }),
            u && /* @__PURE__ */ i("span", { className: "settings-error", children: u })
          ] })
        ] }),
        /* @__PURE__ */ m("div", { className: "settings-section", children: [
          /* @__PURE__ */ i("h4", { className: "settings-section-title", children: "Preferences" }),
          /* @__PURE__ */ m("label", { className: "settings-option", children: [
            /* @__PURE__ */ i(
              "input",
              {
                type: "checkbox",
                checked: n.experimentalThemes || !1,
                onChange: (N) => {
                  r({ experimentalThemes: N.target.checked });
                }
              }
            ),
            /* @__PURE__ */ m("span", { className: "settings-label", children: [
              /* @__PURE__ */ i("strong", { children: "Experimental Themes" }),
              /* @__PURE__ */ i("span", { className: "settings-description", children: "Enable access to experimental theme options" })
            ] })
          ] }),
          /* @__PURE__ */ m("label", { className: "settings-option", children: [
            /* @__PURE__ */ i(
              "input",
              {
                type: "checkbox",
                checked: n.alwaysVerticalLayout || !1,
                onChange: (N) => {
                  r({ alwaysVerticalLayout: N.target.checked });
                }
              }
            ),
            /* @__PURE__ */ m("span", { className: "settings-label", children: [
              /* @__PURE__ */ i("strong", { children: "Always Use Vertical Layout" }),
              /* @__PURE__ */ i("span", { className: "settings-description", children: "Use mobile-style vertical task layout on all devices" })
            ] })
          ] }),
          /* @__PURE__ */ m("label", { className: "settings-option", children: [
            /* @__PURE__ */ i(
              "input",
              {
                type: "checkbox",
                checked: !e,
                onChange: (N) => {
                  r({ showCompleteButton: !N.target.checked });
                }
              }
            ),
            /* @__PURE__ */ m("span", { className: "settings-label", children: [
              /* @__PURE__ */ i("strong", { children: "Disable Complete Button" }),
              /* @__PURE__ */ i("span", { className: "settings-description", children: "Hide the checkmark (✓) button on task items" })
            ] })
          ] }),
          /* @__PURE__ */ m("label", { className: "settings-option", children: [
            /* @__PURE__ */ i(
              "input",
              {
                type: "checkbox",
                checked: !a,
                onChange: (N) => {
                  r({ showDeleteButton: !N.target.checked });
                }
              }
            ),
            /* @__PURE__ */ m("span", { className: "settings-label", children: [
              /* @__PURE__ */ i("strong", { children: "Disable Delete Button" }),
              /* @__PURE__ */ i("span", { className: "settings-description", children: "Hide the delete (×) button on task items" })
            ] })
          ] }),
          /* @__PURE__ */ m("label", { className: "settings-option", children: [
            /* @__PURE__ */ i(
              "input",
              {
                type: "checkbox",
                checked: s,
                onChange: (N) => {
                  r({ showTagButton: N.target.checked });
                }
              }
            ),
            /* @__PURE__ */ m("span", { className: "settings-label", children: [
              /* @__PURE__ */ i("strong", { children: "Enable Tag Button" }),
              /* @__PURE__ */ i("span", { className: "settings-description", children: "Show tag button on task items" })
            ] })
          ] })
        ] })
      ]
    }
  );
}
function oa({
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
  const g = s?.boards?.find((y) => y.id === o)?.tags || [], p = e?.split(" ").filter(Boolean) || [], v = (y) => {
    y.key === "Enter" && (y.preventDefault(), l());
  };
  return /* @__PURE__ */ i(
    ce,
    {
      isOpen: t,
      title: "Edit Tags",
      onClose: r,
      onConfirm: l,
      confirmLabel: "Save",
      cancelLabel: "Cancel",
      children: /* @__PURE__ */ m("div", { className: "edit-tag-modal", children: [
        g.length > 0 && /* @__PURE__ */ m("div", { className: "edit-tag-pills", children: [
          /* @__PURE__ */ i("label", { className: "edit-tag-label", children: "Select Tags" }),
          /* @__PURE__ */ i("div", { className: "edit-tag-pills-container", children: [...g].sort().map((y) => {
            const N = p.includes(y);
            return /* @__PURE__ */ m(
              "button",
              {
                className: `edit-tag-pill ${N ? "active" : ""}`,
                onClick: () => c(y),
                type: "button",
                children: [
                  "#",
                  y
                ]
              },
              y
            );
          }) })
        ] }),
        /* @__PURE__ */ m("div", { className: "edit-tag-field", children: [
          /* @__PURE__ */ i("label", { className: "edit-tag-label", children: "Add New Tag" }),
          /* @__PURE__ */ i(
            "input",
            {
              type: "text",
              className: "edit-tag-input",
              value: a,
              onChange: (y) => d(y.target.value),
              onKeyDown: v,
              placeholder: "Enter a tag",
              autoFocus: !0
            }
          ),
          /* @__PURE__ */ m("div", { className: "edit-tag-hint", children: [
            /* @__PURE__ */ i("div", { children: '"one tag" → #one-tag' }),
            /* @__PURE__ */ i("div", { children: '"#two #tags" → #two #tags' })
          ] })
        ] })
      ] })
    }
  );
}
function qe({ isOpen: t, x: n, y: e, items: a, className: s = "board-context-menu" }) {
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
function ra({
  isOpen: t,
  boardId: n,
  x: e,
  y: a,
  boards: s,
  onClose: o,
  onDeleteBoard: r
}) {
  return /* @__PURE__ */ i(
    qe,
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
function ia({
  isOpen: t,
  tag: n,
  x: e,
  y: a,
  onClose: s,
  onDeleteTag: o
}) {
  return /* @__PURE__ */ i(
    qe,
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
const Ke = [
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
  return Ke[Math.floor(Math.random() * Ke.length)];
}
function ca(t, n) {
  const e = t.trim();
  return e ? n.map((s) => s.id.toLowerCase()).includes(e.toLowerCase()) ? `Board "${e}" already exists` : null : "Board name cannot be empty";
}
function da(t = {}) {
  const { userType: n = "public", sessionId: e = "public" } = t, a = he(null), s = he(null), [o] = A(() => typeof window < "u" && window.matchMedia ? window.matchMedia("(prefers-color-scheme: dark)").matches : !1), r = jt(), [l] = A(() => la()), [d, c] = A(/* @__PURE__ */ new Set()), [u, g] = A(!1), [p, v] = A(() => n === "public" && (typeof window < "u" ? localStorage.getItem("currentSessionId") : null) || e), { preferences: y, savePreferences: N, preferencesLoaded: W, isDarkTheme: L, setPreferences: U, setPreferencesLoaded: J } = $t(n, p, !0), { theme: H, showThemePicker: V, setShowThemePicker: q, THEME_FAMILIES: ae, setTheme: ne, isThemeReady: z } = Wt(y, N, s, W), k = r || y.alwaysVerticalLayout || !1, b = y.showCompleteButton ?? !0, x = y.showDeleteButton ?? !0, f = y.showTagButton ?? !1, {
    tasks: T,
    pendingOperations: C,
    initialLoad: D,
    addTask: M,
    completeTask: B,
    deleteTask: P,
    updateTaskTags: $,
    bulkUpdateTaskTags: w,
    deleteTag: F,
    boards: I,
    currentBoardId: R,
    createBoard: Z,
    deleteBoard: de,
    switchBoard: ue,
    moveTasksToBoard: ve,
    createTagOnBoard: be,
    deleteTagOnBoard: ze
  } = Et({ userType: n, sessionId: p }), _ = Mt({
    tasks: T,
    onTaskUpdate: $,
    onBulkUpdate: w
  }), oe = _t(), h = Jt();
  $e(
    { current: null },
    // Board context menu doesn't need a ref
    !!h.boardContextMenu,
    () => h.setBoardContextMenu(null),
    ".board-context-menu"
  ), $e(
    { current: null },
    // Tag context menu doesn't need a ref
    !!h.tagContextMenu,
    () => h.setTagContextMenu(null),
    ".tag-context-menu"
  ), ee(() => {
    c(/* @__PURE__ */ new Set());
  }, [R]), ee(() => {
    async function S() {
      console.log("[App] Initializing session...", { userType: n, sessionId: e });
      const E = Te(), O = await ct(e, n);
      let K = e;
      if (n === "public") {
        K = Te() || e, console.log("[App] Public user - using stable sessionId:", K);
        const Q = await ie("public", K).getPreferences();
        console.log("[App] Loaded public user preferences from localStorage:", Q), U(Q || Ne), J(!0);
      } else
        K = e, console.log("[App] Applied preferences from handshake:", O), U(O || Ne), J(!0), E && E !== e && (console.log("[App] SessionId changed, clearing old storage"), dt(E, n));
      K !== p && (console.log("[App] Updating effectiveSessionId:", { from: p, to: K }), v(K)), console.log("[App] Loading data from API..."), await D(), g(!0);
    }
    S();
  }, [n, e]);
  const Ye = async (S) => {
    await M(S) && a.current && (a.current.value = "", a.current.focus());
  }, Ge = (S) => {
    const E = T.filter((O) => O.tag?.split(" ").includes(S));
    h.setConfirmClearTag({ tag: S, count: E.length });
  }, Ze = async (S) => {
    const E = S.trim().replace(/\s+/g, "-");
    try {
      if (await be(E), h.pendingTaskOperation?.type === "apply-tag" && h.pendingTaskOperation.taskIds.length > 0) {
        const O = h.pendingTaskOperation.taskIds.map((K) => {
          const Q = T.find((rt) => rt.id === K)?.tag?.split(" ").filter(Boolean) || [], te = [.../* @__PURE__ */ new Set([...Q, E])];
          return { taskId: K, tag: te.join(" ") };
        });
        await w(O), _.clearSelection();
      }
      h.setPendingTaskOperation(null), h.setShowNewTagDialog(!1), h.setInputValue("");
    } catch (O) {
      throw console.error("[App] Failed to create tag:", O), O;
    }
  }, Qe = (S) => {
    const E = T.find((O) => O.id === S);
    E && (h.setEditTagModal({ taskId: S, currentTag: E.tag || null }), h.setEditTagInput(""));
  }, et = async () => {
    if (!h.editTagModal) return;
    const { taskId: S, currentTag: E } = h.editTagModal, O = E?.split(" ").filter(Boolean) || [], K = h.editTagInput.trim() ? h.editTagInput.trim().replace(/\s+/g, "-").split("#").filter(Boolean).map((te) => te.trim()) : [];
    for (const te of K)
      await be(te);
    const Q = [.../* @__PURE__ */ new Set([...O, ...K])].sort().join(" ");
    await $(S, { tag: Q }), h.setEditTagModal(null), h.setEditTagInput("");
  }, tt = (S) => {
    if (!h.editTagModal) return;
    const { taskId: E, currentTag: O } = h.editTagModal, K = O?.split(" ").filter(Boolean) || [];
    if (K.includes(S)) {
      const Q = K.filter((te) => te !== S).sort().join(" ");
      h.setEditTagModal({ taskId: E, currentTag: Q });
    } else {
      const Q = [...K, S].sort().join(" ");
      h.setEditTagModal({ taskId: E, currentTag: Q });
    }
  }, Se = (S) => ca(S, I?.boards || []), at = async (S) => {
    const E = S.trim(), O = Se(E);
    if (O) {
      h.setValidationError(O);
      return;
    }
    try {
      await Z(E), h.pendingTaskOperation?.type === "move-to-board" && h.pendingTaskOperation.taskIds.length > 0 && (await ve(E, h.pendingTaskOperation.taskIds), _.clearSelection()), h.setPendingTaskOperation(null), h.setValidationError(null), h.setShowNewBoardDialog(!1), h.setInputValue("");
    } catch (K) {
      console.error("[App] Failed to create board:", K), h.setValidationError(K.message || "Failed to create board");
    }
  }, nt = I?.boards?.find((S) => S.id === R)?.tags || [], st = Array.from(/* @__PURE__ */ new Set([...nt, ...Je(T)])), ot = Nt(T, k ? 3 : 6);
  return !u || !z || !W ? (console.log(`[App] Still loading - isLoaded: ${u}, isThemeReady: ${z}, preferencesLoaded: ${W}`), /* @__PURE__ */ i(Vt, { isDarkTheme: o })) : (console.log(`[App] Rendering app - theme: ${H}, isLoaded: ${u}, isThemeReady: ${z}`), /* @__PURE__ */ i(
    "div",
    {
      ref: s,
      className: "task-app-container task-app-fade-in",
      "data-dark-theme": L ? "true" : "false",
      onMouseDown: _.selectionStartHandler,
      onMouseMove: _.selectionMoveHandler,
      onMouseUp: _.selectionEndHandler,
      onMouseLeave: _.selectionEndHandler,
      onClick: (S) => {
        try {
          const E = S.target;
          if (E.closest && E.closest(".theme-picker"))
            return;
          if (!E.closest || !E.closest(".task-app__item")) {
            if (_.selectionJustEndedAt && Date.now() - _.selectionJustEndedAt < It)
              return;
            _.clearSelection();
          }
        } catch {
        }
      },
      children: /* @__PURE__ */ m("div", { className: "task-app", children: [
        /* @__PURE__ */ i(
          Xt,
          {
            theme: H,
            experimentalThemes: y.experimentalThemes || !1,
            showThemePicker: V,
            onThemePickerToggle: () => q(!V),
            onThemeChange: ne,
            onSettingsClick: () => h.setShowSettingsModal(!0),
            THEME_FAMILIES: ae
          }
        ),
        /* @__PURE__ */ i(
          zt,
          {
            boards: I,
            currentBoardId: R,
            userType: n,
            dragOverFilter: _.dragOverFilter,
            onBoardSwitch: ue,
            onBoardContextMenu: (S, E, O) => h.setBoardContextMenu({ boardId: S, x: E, y: O }),
            onDragOverFilter: _.setDragOverFilter,
            onMoveTasksToBoard: ve,
            onClearSelection: _.clearSelection,
            onCreateBoardClick: () => {
              h.setInputValue(""), h.setValidationError(null), h.setShowNewBoardDialog(!0);
            },
            onPendingOperation: h.setPendingTaskOperation,
            onInitialLoad: D
          }
        ),
        /* @__PURE__ */ i("div", { className: "task-app__controls", children: /* @__PURE__ */ i(
          "input",
          {
            ref: a,
            className: "task-app__input",
            placeholder: l,
            onKeyDown: (S) => {
              S.key === "Enter" && !S.shiftKey && (S.preventDefault(), Ye(S.target.value)), S.key === "k" && (S.ctrlKey || S.metaKey) && (S.preventDefault(), a.current?.focus());
            }
          }
        ) }),
        /* @__PURE__ */ i(
          Gt,
          {
            tags: st,
            selectedFilters: d,
            dragOverFilter: _.dragOverFilter,
            onToggleFilter: (S) => {
              c((E) => {
                const O = new Set(E);
                return O.has(S) ? O.delete(S) : O.add(S), O;
              });
            },
            onTagContextMenu: (S, E, O) => h.setTagContextMenu({ tag: S, x: E, y: O }),
            onDragOver: _.onFilterDragOver,
            onDragLeave: _.onFilterDragLeave,
            onDrop: _.onFilterDrop,
            onCreateTagClick: () => {
              h.setInputValue(""), h.setShowNewTagDialog(!0);
            },
            onPendingOperation: h.setPendingTaskOperation
          }
        ),
        /* @__PURE__ */ i(
          Qt,
          {
            tasks: T,
            topTags: ot,
            isMobile: k,
            filters: Array.from(d),
            selectedIds: _.selectedIds,
            onSelectionStart: _.selectionStartHandler,
            onSelectionMove: _.selectionMoveHandler,
            onSelectionEnd: _.selectionEndHandler,
            sortDirections: oe.sortDirections,
            dragOverTag: _.dragOverTag,
            pendingOperations: C,
            onComplete: B,
            onDelete: P,
            onEditTag: Qe,
            onDragStart: _.onDragStart,
            onDragEnd: _.onDragEnd,
            onDragOver: _.onDragOver,
            onDragLeave: _.onDragLeave,
            onDrop: _.onDrop,
            toggleSort: oe.toggleSort,
            sortTasksByAge: oe.sortTasksByAge,
            getSortIcon: oe.getSortIcon,
            getSortTitle: oe.getSortTitle,
            deleteTag: Ge,
            onDeletePersistedTag: ze,
            showCompleteButton: b,
            showDeleteButton: x,
            showTagButton: f
          }
        ),
        _.isSelecting && _.marqueeRect && /* @__PURE__ */ i(
          "div",
          {
            className: "marquee-overlay",
            style: {
              left: `${_.marqueeRect.x}px`,
              top: `${_.marqueeRect.y}px`,
              width: `${_.marqueeRect.w}px`,
              height: `${_.marqueeRect.h}px`
            }
          }
        ),
        /* @__PURE__ */ i(
          ea,
          {
            tag: h.confirmClearTag?.tag || null,
            count: h.confirmClearTag?.count || 0,
            isOpen: !!h.confirmClearTag,
            onClose: () => h.setConfirmClearTag(null),
            onConfirm: F
          }
        ),
        /* @__PURE__ */ i(
          ta,
          {
            isOpen: h.showNewBoardDialog,
            inputValue: h.inputValue,
            validationError: h.validationError,
            pendingTaskOperation: h.pendingTaskOperation,
            onClose: () => {
              h.setShowNewBoardDialog(!1), h.setPendingTaskOperation(null), h.setValidationError(null);
            },
            onConfirm: at,
            onInputChange: (S) => {
              h.setInputValue(S), h.setValidationError(null);
            },
            validateBoardName: Se
          }
        ),
        /* @__PURE__ */ i(
          aa,
          {
            isOpen: h.showNewTagDialog,
            inputValue: h.inputValue,
            tasks: T,
            pendingTaskOperation: h.pendingTaskOperation,
            onClose: () => {
              h.setShowNewTagDialog(!1), h.setPendingTaskOperation(null);
            },
            onConfirm: Ze,
            onInputChange: h.setInputValue
          }
        ),
        /* @__PURE__ */ i(
          sa,
          {
            isOpen: h.showSettingsModal,
            preferences: y,
            showCompleteButton: b,
            showDeleteButton: x,
            showTagButton: f,
            onClose: () => h.setShowSettingsModal(!1),
            onSavePreferences: N,
            onValidateKey: async (S) => await ie(n, p).validateKey(S)
          }
        ),
        /* @__PURE__ */ i(
          oa,
          {
            isOpen: !!h.editTagModal,
            taskId: h.editTagModal?.taskId || null,
            currentTag: h.editTagModal?.currentTag || null,
            editTagInput: h.editTagInput,
            boards: I,
            currentBoardId: R,
            onClose: () => {
              h.setEditTagModal(null), h.setEditTagInput("");
            },
            onConfirm: et,
            onInputChange: h.setEditTagInput,
            onToggleTagPill: tt
          }
        ),
        /* @__PURE__ */ i(
          ra,
          {
            isOpen: !!h.boardContextMenu,
            boardId: h.boardContextMenu?.boardId || null,
            x: h.boardContextMenu?.x || 0,
            y: h.boardContextMenu?.y || 0,
            boards: I,
            onClose: () => h.setBoardContextMenu(null),
            onDeleteBoard: de
          }
        ),
        /* @__PURE__ */ i(
          ia,
          {
            isOpen: !!h.tagContextMenu,
            tag: h.tagContextMenu?.tag || null,
            x: h.tagContextMenu?.x || 0,
            y: h.tagContextMenu?.y || 0,
            onClose: () => h.setTagContextMenu(null),
            onDeleteTag: F
          }
        )
      ] })
    }
  ));
}
function fa(t, n = {}) {
  const e = new URLSearchParams(window.location.search), a = n.userType || e.get("userType") || "admin", s = n.sessionId || "public-session", o = { ...n, userType: a, sessionId: s }, r = lt(t);
  r.render(/* @__PURE__ */ i(da, { ...o })), t.__root = r, console.log("[task-app] Mounted successfully", o);
}
function ma(t) {
  t.__root?.unmount();
}
export {
  fa as mount,
  ma as unmount
};
