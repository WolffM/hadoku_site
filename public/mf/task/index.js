import { jsxs as k, jsx as i, Fragment as at } from "react/jsx-runtime";
import { createRoot as nt } from "react-dom/client";
import { useState as A, useMemo as $e, useEffect as Z, useRef as ge } from "react";
const H = `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
function ke() {
  return localStorage.getItem("currentSessionId");
}
function fe(t) {
  localStorage.setItem("currentSessionId", t), console.log("[Session] Stored sessionId:", t);
}
async function st(t, n) {
  const e = ke();
  if (n === "public") {
    if (e)
      return console.log("[Session] Public user - using existing sessionId:", e), null;
    const a = `public-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    return fe(a), console.log("[Session] Public user - created stable sessionId:", a), null;
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
    return console.log("[Session] Handshake successful:", s), fe(t), s.preferences;
  } catch (a) {
    return console.error("[Session] Handshake failed:", a), fe(t), null;
  }
}
function ot(t, n) {
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
class rt {
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
function it() {
  const t = Date.now().toString(36).toUpperCase().padStart(8, "0"), n = crypto.getRandomValues(new Uint8Array(18)), e = Array.from(n).map((a) => (a % 36).toString(36).toUpperCase()).join("");
  return t + e;
}
function Fe(t, n) {
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
function Te(t, n, e, a) {
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
function lt(t, n, e, a) {
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
function Re(t, n, e, a) {
  const { task: s, index: o } = Fe(t, n), r = {
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
  ]), { updatedTasks: l, statsEvents: c, result: d } = a(o, r, s);
  let u = r;
  for (const { task: g, eventType: p } of c)
    u = lt(u, g, p, s);
  return await Promise.all([
    t.saveTasks(n.userType, n.sessionId, e, l),
    t.saveStats(n.userType, n.sessionId, e, u)
  ]), d;
}
async function le(t, n, e) {
  const a = (/* @__PURE__ */ new Date()).toISOString(), s = await t.getBoards(n.userType, n.sessionId), { updatedBoards: o, result: r } = e(s, a);
  return await t.saveBoards(n.userType, o, n.sessionId), r;
}
async function ct(t, n) {
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
async function dt(t, n, e, a = "main") {
  return se(t, n, a, (s, o, r) => {
    const l = e.id || it(), c = e.createdAt || r, d = {
      id: l,
      title: e.title,
      tag: e.tag ?? null,
      state: "Active",
      createdAt: c
    };
    return {
      updatedTasks: {
        ...s,
        tasks: [d, ...s.tasks],
        updatedAt: r
      },
      statsEvents: [{ task: d, eventType: "created" }],
      result: { ok: !0, id: l }
    };
  });
}
async function ut(t, n, e, a, s = "main") {
  return se(t, n, s, (o, r, l) => {
    const { task: c, index: d } = Fe(o, e), u = {
      ...c,
      ...a,
      updatedAt: l
    }, g = [...o.tasks];
    return g[d] = u, {
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
async function gt(t, n, e, a = "main") {
  return se(t, n, a, (s, o, r) => {
    const { updatedTasks: l, closedTask: c } = Re(s, e, "Completed", r);
    return {
      updatedTasks: l,
      statsEvents: [{ task: c, eventType: "completed" }],
      result: { ok: !0, message: `Task ${e} completed` }
    };
  });
}
async function ht(t, n, e, a = "main") {
  return se(t, n, a, (s, o, r) => {
    const { updatedTasks: l, closedTask: c } = Re(s, e, "Deleted", r);
    return {
      updatedTasks: l,
      statsEvents: [{ task: c, eventType: "deleted" }],
      result: { ok: !0, message: `Task ${e} deleted` }
    };
  });
}
async function pt(t, n, e) {
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
async function ft(t, n, e) {
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
async function mt(t, n, e) {
  return le(t, n, (a, s) => {
    const { board: o, index: r } = pe(a, e.boardId), l = o.tags || [];
    if (l.includes(e.tag))
      return {
        updatedBoards: a,
        // No changes needed
        result: { ok: !0, message: `Tag ${e.tag} already exists` }
      };
    const c = {
      ...o,
      tags: [...l, e.tag]
    };
    return {
      updatedBoards: Te(a, r, c, s),
      result: { ok: !0, message: `Tag ${e.tag} added to board ${e.boardId}` }
    };
  });
}
async function kt(t, n, e) {
  return le(t, n, (a, s) => {
    const { board: o, index: r } = pe(a, e.boardId), l = o.tags || [], c = {
      ...o,
      tags: l.filter((d) => d !== e.tag)
    };
    return {
      updatedBoards: Te(a, r, c, s),
      result: { ok: !0, message: `Tag ${e.tag} removed from board ${e.boardId}` }
    };
  });
}
async function Tt(t, n, e) {
  return se(t, n, e.boardId, (a, s, o) => {
    let r = 0;
    const l = a.tasks.map((u) => {
      const g = e.updates.find((p) => p.taskId === u.id);
      return g ? (r++, {
        ...u,
        tag: g.tag || void 0,
        updatedAt: o
      }) : u;
    }), c = {
      ...a,
      tasks: l,
      updatedAt: o
    }, d = l.filter((u) => e.updates.find((g) => g.taskId === u.id)).map((u) => ({ task: u, eventType: "edited" }));
    return {
      updatedTasks: c,
      statsEvents: d,
      result: {
        ok: !0,
        message: `Updated ${r} task(s) on board ${e.boardId}`,
        updated: r
      }
    };
  });
}
async function yt(t, n, e) {
  const a = await se(t, n, e.boardId, (s, o, r) => {
    let l = 0;
    const c = s.tasks.map((g) => {
      if (e.taskIds.includes(g.id) && g.tag) {
        const v = g.tag.split(" ").filter(Boolean).filter((b) => b !== e.tag);
        return l++, {
          ...g,
          tag: v.length > 0 ? v.join(" ") : void 0,
          updatedAt: r
        };
      }
      return g;
    }), d = {
      ...s,
      tasks: c,
      updatedAt: r
    }, u = c.filter((g) => e.taskIds.includes(g.id)).map((g) => ({ task: g, eventType: "edited" }));
    return {
      updatedTasks: d,
      statsEvents: u,
      result: { clearedCount: l }
    };
  });
  return await le(t, n, (s, o) => {
    const { board: r, index: l } = pe(s, e.boardId), c = r.tags || [], d = {
      ...r,
      tags: c.filter((u) => u !== e.tag)
    };
    return {
      updatedBoards: Te(s, l, d, o),
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
function wt(t = "public", n = "public") {
  const e = new rt(t, n), a = { userType: "registered", sessionId: n };
  return {
    async getBoards() {
      const s = await ct(e, a), o = {
        version: s.version,
        updatedAt: s.updatedAt,
        boards: []
      };
      for (const r of s.boards) {
        const l = await e.getTasks(t, n, r.id), c = await e.getStats(t, n, r.id);
        o.boards.push({
          id: r.id,
          name: r.name,
          tasks: l.tasks,
          stats: c,
          tags: r.tags || []
        });
      }
      return o;
    },
    async createBoard(s) {
      console.debug("[localStorageApi] createBoard (using handler)", { userType: t, sessionId: n, boardId: s });
      const o = await pt(
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
      await ft(
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
      const l = await dt(
        e,
        a,
        s,
        o
      ), d = (await e.getTasks(t, n, o)).tasks.find((u) => u.id === l.id);
      if (!d)
        throw new Error("Task creation failed - task not found after creation");
      return r ? console.log("[localStorageApi] createTask: broadcast suppressed") : (console.log("[localStorageApi] createTask: broadcasting", {
        sessionId: H,
        boardId: o,
        taskId: l.id
      }), Y("tasks-updated", { sessionId: H, userType: t, boardId: o })), d;
    },
    async patchTask(s, o, r = "main", l = !1) {
      const c = {};
      o.title !== void 0 && (c.title = o.title), o.tag !== void 0 && o.tag !== null && (c.tag = o.tag), await ut(
        e,
        a,
        s,
        c,
        r
      ), l || Y("tasks-updated", { sessionId: H, userType: t, boardId: r });
      const u = (await e.getTasks(t, n, r)).tasks.find((g) => g.id === s);
      if (!u)
        throw new Error("Task not found after update");
      return u;
    },
    async completeTask(s, o = "main") {
      const l = (await e.getTasks(t, n, o)).tasks.find((c) => c.id === s);
      if (!l)
        throw new Error("Task not found");
      return await gt(
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
      const c = (await e.getTasks(t, n, o)).tasks.find((d) => d.id === s);
      if (!c)
        throw new Error("Task not found");
      return await ht(
        e,
        a,
        s,
        o
      ), r ? console.log("[localStorageApi] deleteTask: broadcast suppressed") : (console.log("[localStorageApi] deleteTask: broadcasting", { sessionId: H }), Y("tasks-updated", { sessionId: H, userType: t, boardId: o })), {
        ...c,
        state: "Deleted",
        closedAt: (/* @__PURE__ */ new Date()).toISOString(),
        updatedAt: (/* @__PURE__ */ new Date()).toISOString()
      };
    },
    async createTag(s, o = "main") {
      await mt(
        e,
        a,
        { boardId: o, tag: s }
      ), Y("boards-updated", { sessionId: H, userType: t, boardId: o });
    },
    async deleteTag(s, o = "main") {
      await kt(
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
      const l = await this.getBoards(), c = l.boards.find((b) => b.id === s), d = l.boards.find((b) => b.id === o);
      if (!c)
        throw new Error(`Source board ${s} not found`);
      if (!d)
        throw new Error(`Target board ${o} not found`);
      const u = c.tasks.filter((b) => r.includes(b.id));
      c.tasks = c.tasks.filter((b) => !r.includes(b.id)), d.tasks = [...d.tasks, ...u], l.updatedAt = (/* @__PURE__ */ new Date()).toISOString();
      const g = `${t}-${n}-boards`;
      localStorage.setItem(g, JSON.stringify(l));
      const p = `${t}-${n}-${s}-tasks`, v = `${t}-${n}-${o}-tasks`;
      return localStorage.setItem(p, JSON.stringify({
        version: 1,
        updatedAt: l.updatedAt,
        tasks: c.tasks
      })), localStorage.setItem(v, JSON.stringify({
        version: 1,
        updatedAt: l.updatedAt,
        tasks: d.tasks
      })), Y("boards-updated", { sessionId: H, userType: t }), { ok: !0, moved: u.length };
    },
    async batchUpdateTags(s, o) {
      console.log("[localStorageApi] batchUpdateTags", { boardId: s, updates: o }), await Tt(
        e,
        a,
        { boardId: s, updates: o }
      ), Y("tasks-updated", { sessionId: H, userType: t, boardId: s });
    },
    async batchClearTag(s, o, r) {
      console.log("[localStorageApi] batchClearTag START", { boardId: s, tag: o, taskIds: r, taskCount: r.length });
      const l = await yt(
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
async function vt(t, n, e, a) {
  for (const r of n.boards || []) {
    const l = r.id;
    if (r.tasks && r.tasks.length > 0) {
      const c = `${e}-${a}-${l}-tasks`, d = {
        version: 1,
        updatedAt: n.updatedAt || (/* @__PURE__ */ new Date()).toISOString(),
        tasks: r.tasks
      };
      window.localStorage.setItem(c, JSON.stringify(d));
    }
    if (r.stats) {
      const c = `${e}-${a}-${l}-stats`;
      window.localStorage.setItem(c, JSON.stringify(r.stats));
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
function he(t = "public", n = "public") {
  const e = wt(t, n);
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
        console.log("[api] Synced from API:", { boards: s.boards.length, totalTasks: s.boards.reduce((o, r) => o + (r.tasks?.length || 0), 0) }), await vt(e, s, t, n);
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
      }).then(() => console.log("[api] Background sync: patchTask completed")).catch((c) => console.error("[api] Failed to sync patchTask:", c)), l;
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
      if (t !== "public")
        try {
          const a = await fetch("/task/api/preferences", {
            headers: V(t, n)
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
        headers: V(t, n),
        body: JSON.stringify(a)
      }).then(() => console.log("[api] Background sync: savePreferences completed")).catch((s) => console.error("[api] Failed to sync savePreferences:", s));
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
function bt(t) {
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
function St(t, n = 6, e = []) {
  const a = t.flatMap((o) => o.tag?.split(" ") || []).filter(Boolean), s = {};
  return a.forEach((o) => s[o] = (s[o] || 0) + 1), e.filter(Boolean).forEach((o) => {
    s[o] || (s[o] = 0);
  }), Object.entries(s).sort((o, r) => r[1] - o[1]).slice(0, n).map(([o]) => o);
}
function be(t, n) {
  return t.filter((e) => e.tag?.split(" ").includes(n));
}
function Ct(t, n, e) {
  const a = Array.isArray(e) && e.length > 0;
  return t.filter((s) => {
    const o = s.tag?.split(" ") || [];
    return a ? e.some((l) => o.includes(l)) && !n.some((l) => o.includes(l)) : !n.some((r) => o.includes(r));
  });
}
function Ke(t) {
  return Array.from(new Set(t.flatMap((n) => n.tag?.split(" ") || []).filter(Boolean)));
}
async function Se(t, n, e, a, s = {}) {
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
      const c = new Set(l);
      return c.delete(t), c;
    });
  }
}
function ie(t, n) {
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
function xt({ userType: t, sessionId: n }) {
  const [e, a] = A([]), [s, o] = A(/* @__PURE__ */ new Set()), r = $e(
    () => he(t, n || "public"),
    [t, n]
  ), [l, c] = A(null), [d, u] = A("main");
  async function g() {
    console.log("[useTasks] initialLoad called"), "syncFromApi" in r && await r.syncFromApi(), await p();
  }
  async function p() {
    console.log("[useTasks] reload called", { currentBoardId: d, stack: new Error().stack?.split(`
`).slice(1, 4).join(`
`) });
    const m = await r.getBoards();
    c(m);
    const { tasks: y } = ie(m, d);
    a(y);
  }
  Z(() => {
    console.log("[useTasks] User context changed, clearing state and reloading", { userType: t, sessionId: n }), a([]), o(/* @__PURE__ */ new Set()), c(null), u("main"), p();
  }, [t, n]), Z(() => {
    console.log("[useTasks] Setting up BroadcastChannel listener", { currentBoardId: d, userType: t, sessionId: n });
    try {
      const m = new BroadcastChannel("tasks");
      return m.onmessage = (y) => {
        const x = y.data || {};
        if (console.log("[useTasks] BroadcastChannel message received", { msg: x, sessionId: H, currentBoardId: d, currentContext: { userType: t, sessionId: n } }), x.sessionId === H) {
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
        (x.type === "tasks-updated" || x.type === "boards-updated") && (console.log("[useTasks] BroadcastChannel: triggering reload for currentBoardId =", d), p());
      }, () => {
        console.log("[useTasks] Cleaning up BroadcastChannel listener", { currentBoardId: d }), m.close();
      };
    } catch (m) {
      console.error("[useTasks] Failed to setup BroadcastChannel", m);
    }
  }, [d, t, n]);
  async function v(m) {
    if (m = m.trim(), !!m)
      try {
        const y = bt(m);
        return await r.createTask(y, d), await p(), !0;
      } catch (y) {
        return alert(y.message || "Failed to create task"), !1;
      }
  }
  async function b(m) {
    await Se(
      `complete-${m}`,
      s,
      o,
      async () => {
        await r.completeTask(m, d), await p();
      },
      {
        onError: (y) => alert(y.message || "Failed to complete task")
      }
    );
  }
  async function N(m) {
    console.log("[useTasks] deleteTask START", { taskId: m, currentBoardId: d }), await Se(
      `delete-${m}`,
      s,
      o,
      async () => {
        console.log("[useTasks] deleteTask: calling api.deleteTask", { taskId: m, currentBoardId: d }), await r.deleteTask(m, d), console.log("[useTasks] deleteTask: calling reload"), await p(), console.log("[useTasks] deleteTask END");
      },
      {
        onError: (y) => alert(y.message || "Failed to delete task")
      }
    );
  }
  async function J(m) {
    const y = prompt("Enter tag (without #):");
    if (!y) return;
    const x = y.trim().replace(/^#+/, "").replace(/\s+/g, "-"), f = e.find((B) => B.id === m);
    if (!f) return;
    const T = f.tag?.split(" ") || [];
    if (T.includes(x)) return;
    const C = [...T, x].join(" ");
    try {
      await r.patchTask(m, { tag: C }, d), await p();
    } catch (B) {
      alert(B.message || "Failed to add tag");
    }
  }
  async function $(m, y, x = {}) {
    const { suppressBroadcast: f = !1, skipReload: T = !1 } = x;
    try {
      await r.patchTask(m, y, d, f), T || await p();
    } catch (C) {
      throw C;
    }
  }
  async function U(m) {
    console.log("[useTasks] bulkUpdateTaskTags START", { count: m.length });
    try {
      await r.batchUpdateTags(
        d,
        m.map((y) => ({ taskId: y.taskId, tag: y.tag || null }))
      ), console.log("[useTasks] bulkUpdateTaskTags: calling reload"), await p(), console.log("[useTasks] bulkUpdateTaskTags END");
    } catch (y) {
      throw console.error("[useTasks] bulkUpdateTaskTags ERROR", y), y;
    }
  }
  async function W(m) {
    console.log("[useTasks] deleteTag START", { tag: m, currentBoardId: d, taskCount: e.length });
    const y = e.filter((x) => x.tag?.split(" ").includes(m));
    if (console.log("[useTasks] deleteTag: found tasks with tag", { tag: m, count: y.length }), y.length === 0) {
      console.log("[useTasks] deleteTag: no tasks found with this tag, just deleting tag");
      try {
        await r.deleteTag(m, d), await p(), console.log("[useTasks] deleteTag END (no tasks to clear)");
      } catch (x) {
        console.error("[useTasks] deleteTag ERROR", x), console.error("[useTasks] deleteTag: Please fix this error:", x.message);
      }
      return;
    }
    try {
      console.log("[useTasks] deleteTag: starting batch clear"), await r.batchClearTag(
        d,
        m,
        y.map((x) => x.id)
      ), console.log("[useTasks] deleteTag: calling reload"), await p(), console.log("[useTasks] deleteTag END");
    } catch (x) {
      console.error("[useTasks] deleteTag ERROR", x), alert(x.message || "Failed to remove tag from tasks");
    }
  }
  async function j(m) {
    await r.createBoard(m), u(m);
    const y = await r.getBoards();
    c(y);
    const { tasks: x } = ie(y, m);
    a(x);
  }
  async function z(m, y) {
    if (console.log("[useTasks] moveTasksToBoard START", { targetBoardId: m, ids: y, currentBoardId: d }), !l) return;
    const x = /* @__PURE__ */ new Set();
    for (const f of l.boards)
      for (const T of f.tasks || [])
        y.includes(T.id) && x.add(f.id);
    console.log("[useTasks] moveTasksToBoard: source boards", { sourceBoardIds: Array.from(x) });
    try {
      if (x.size === 1) {
        const C = Array.from(x)[0];
        console.log("[useTasks] moveTasksToBoard: using batch API"), await r.batchMoveTasks(C, m, y);
      } else
        throw console.error("[useTasks] moveTasksToBoard: Cannot move tasks from multiple boards at once"), new Error("Cannot move tasks from multiple boards at once");
      console.log("[useTasks] moveTasksToBoard: switching to target board", { targetBoardId: m }), u(m);
      const f = await r.getBoards();
      c(f);
      const { tasks: T } = ie(f, m);
      a(T), console.log("[useTasks] moveTasksToBoard END");
    } catch (f) {
      console.error("[useTasks] moveTasksToBoard ERROR", f), alert(f.message || "Failed to move tasks");
    }
  }
  async function X(m) {
    if (await r.deleteBoard(m), d === m) {
      u("main");
      const y = await r.getBoards();
      c(y);
      const { tasks: x } = ie(y, "main");
      a(x);
    } else
      await p();
  }
  async function ee(m) {
    await r.createTag(m, d), await p();
  }
  async function te(m) {
    await r.deleteTag(m, d), await p();
  }
  function G(m) {
    u(m);
    const { tasks: y, foundBoard: x } = ie(l, m);
    x ? a(y) : p();
  }
  return {
    // Task state
    tasks: e,
    pendingOperations: s,
    // Task operations
    addTask: v,
    completeTask: b,
    deleteTask: N,
    addTagToTask: J,
    updateTaskTags: $,
    bulkUpdateTaskTags: U,
    deleteTag: W,
    // Board state
    boards: l,
    currentBoardId: d,
    // Board operations
    createBoard: j,
    deleteBoard: X,
    switchBoard: G,
    moveTasksToBoard: z,
    createTagOnBoard: ee,
    deleteTagOnBoard: te,
    // Lifecycle
    initialLoad: g,
    reload: p
  };
}
function Dt({ tasks: t, onTaskUpdate: n, onBulkUpdate: e }) {
  const [a, s] = A(null), [o, r] = A(null), [l, c] = A(/* @__PURE__ */ new Set()), [d, u] = A(!1), [g, p] = A(null), [v, b] = A(null), N = ge(null);
  function J(f) {
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
  function $(f, T) {
    const C = l.has(T) && l.size > 0 ? Array.from(l) : [T];
    console.log("[useDragAndDrop] onDragStart", { taskId: T, idsToDrag: C, selectedCount: l.size }), f.dataTransfer.setData("text/plain", C[0]);
    try {
      f.dataTransfer.setData("application/x-hadoku-task-ids", JSON.stringify(C));
    } catch {
    }
    f.dataTransfer.effectAllowed = "copyMove";
    try {
      const B = f.currentTarget, E = B.closest && B.closest(".task-app__item") ? B.closest(".task-app__item") : B;
      E.classList.add("dragging");
      const D = E.cloneNode(!0);
      D.style.boxSizing = "border-box", D.style.width = `${E.offsetWidth}px`, D.style.height = `${E.offsetHeight}px`, D.style.opacity = "0.95", D.style.transform = "none", D.style.filter = "drop-shadow(0 6px 18px rgba(0,0,0,0.12))", D.classList.add("drag-image"), D.style.position = "absolute", D.style.top = "-9999px", D.style.left = "-9999px", document.body.appendChild(D), E.__dragImage = D, c((L) => {
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
              f.dataTransfer.setData("application/x-hadoku-task-source", F);
            } catch {
            }
        }
      } catch {
      }
      try {
        const L = E.getBoundingClientRect();
        let I = Math.round(f.clientX - L.left), w = Math.round(f.clientY - L.top);
        I = Math.max(0, Math.min(Math.round(D.offsetWidth - 1), I)), w = Math.max(0, Math.min(Math.round(D.offsetHeight - 1), w)), f.dataTransfer.setDragImage(D, I, w);
      } catch {
        f.dataTransfer.setDragImage(D, 0, 0);
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
      X();
    } catch {
    }
  }
  function W(f) {
    if (f.button === 0) {
      try {
        const T = f.target;
        if (!T || T.closest && T.closest(".task-app__item, .task-app__controls, button, input, textarea, .task-app__item-actions"))
          return;
      } catch {
      }
      u(!0), N.current = { x: f.clientX, y: f.clientY }, p({ x: f.clientX, y: f.clientY, w: 0, h: 0 }), c(/* @__PURE__ */ new Set());
      try {
        document.body.classList.add("marquee-selecting");
      } catch {
      }
    }
  }
  function j(f) {
    if (!d || !N.current) return;
    const T = N.current.x, C = N.current.y, B = f.clientX, E = f.clientY, D = Math.min(T, B), L = Math.min(C, E), I = Math.abs(B - T), w = Math.abs(E - C);
    p({ x: D, y: L, w: I, h: w });
    const F = Array.from(document.querySelectorAll(".task-app__item")), P = /* @__PURE__ */ new Set();
    for (const R of F) {
      const q = R.getBoundingClientRect();
      if (!(q.right < D || q.left > D + I || q.bottom < L || q.top > L + w)) {
        const de = R.getAttribute("data-task-id");
        de && P.add(de), R.classList.add("selected");
      } else
        R.classList.remove("selected");
    }
    c(P);
  }
  function z(f) {
    u(!1), p(null), N.current = null;
    try {
      document.body.classList.remove("marquee-selecting");
    } catch {
    }
    try {
      b(Date.now());
    } catch {
    }
  }
  function X() {
    c(/* @__PURE__ */ new Set()), Array.from(document.querySelectorAll(".task-app__item.selected")).forEach((T) => T.classList.remove("selected"));
  }
  Z(() => {
    function f(B) {
      if (B.button !== 0) return;
      const E = { target: B.target, clientX: B.clientX, clientY: B.clientY, button: B.button };
      try {
        W(E);
      } catch {
      }
    }
    function T(B) {
      const E = { clientX: B.clientX, clientY: B.clientY };
      try {
        j(E);
      } catch {
      }
    }
    function C(B) {
      const E = { clientX: B.clientX, clientY: B.clientY };
      try {
        z(E);
      } catch {
      }
    }
    return document.addEventListener("mousedown", f), document.addEventListener("mousemove", T), document.addEventListener("mouseup", C), () => {
      document.removeEventListener("mousedown", f), document.removeEventListener("mousemove", T), document.removeEventListener("mouseup", C);
    };
  }, []);
  function ee(f, T) {
    f.preventDefault(), f.dataTransfer.dropEffect = "copy", s(T);
  }
  function te(f) {
    f.currentTarget.contains(f.relatedTarget) || s(null);
  }
  async function G(f, T) {
    f.preventDefault(), s(null), console.log("[useDragAndDrop] onDrop START", { targetTag: T });
    const C = J(f);
    if (C.length === 0) return;
    let B = null;
    try {
      const D = f.dataTransfer.getData("application/x-hadoku-task-source");
      D && (B = D);
    } catch {
    }
    console.log("[useDragAndDrop] onDrop: processing", { targetTag: T, ids: C, srcTag: B, taskCount: C.length });
    const E = [];
    for (const D of C) {
      const L = t.find((R) => R.id === D);
      if (!L) continue;
      const I = L.tag?.split(" ").filter(Boolean) || [];
      if (T === "other") {
        if (I.length === 0) continue;
        E.push({ taskId: D, tag: "" });
        continue;
      }
      const w = I.includes(T);
      let F = I.slice();
      w || F.push(T), B && B !== T && (F = F.filter((R) => R !== B));
      const P = F.join(" ").trim();
      E.push({ taskId: D, tag: P });
    }
    console.log("[useDragAndDrop] onDrop: updating tasks", { updateCount: E.length });
    try {
      await e(E), console.log("[useDragAndDrop] onDrop: updates complete, clearing selection");
      try {
        X();
      } catch {
      }
    } catch (D) {
      console.error("Failed to add tag to one or more tasks:", D), alert(D.message || "Failed to add tags");
    }
    console.log("[useDragAndDrop] onDrop END");
  }
  function m(f, T) {
    f.preventDefault(), f.dataTransfer.dropEffect = "copy", r(T);
  }
  function y(f) {
    f.currentTarget.contains(f.relatedTarget) || r(null);
  }
  async function x(f, T) {
    f.preventDefault(), r(null);
    const C = J(f);
    if (C.length === 0) return;
    console.log("[useDragAndDrop] onFilterDrop", { filterTag: T, ids: C, taskCount: C.length });
    const B = [];
    for (const E of C) {
      const D = t.find((w) => w.id === E);
      if (!D) continue;
      const L = D.tag?.split(" ").filter(Boolean) || [];
      if (L.includes(T)) {
        console.log(`Task ${E} already has tag: ${T}`);
        continue;
      }
      const I = [...L, T].join(" ");
      B.push({ taskId: E, tag: I });
    }
    if (B.length === 0) {
      console.log("No updates needed - all tasks already have this tag");
      return;
    }
    console.log(`Adding tag "${T}" to ${B.length} task(s) via filter drop`);
    try {
      await e(B);
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
    isSelecting: d,
    marqueeRect: g,
    selectionJustEndedAt: v,
    // selection handlers
    selectionStartHandler: W,
    selectionMoveHandler: j,
    selectionEndHandler: z,
    clearSelection: X,
    onDragStart: $,
    onDragEnd: U,
    onDragOver: ee,
    onDragLeave: te,
    onDrop: G,
    onFilterDragOver: m,
    onFilterDragLeave: y,
    onFilterDrop: x
  };
}
function Bt() {
  const [t, n] = A({});
  function e(r) {
    n((l) => {
      const d = (l[r] || "desc") === "desc" ? "asc" : "desc";
      return { ...l, [r]: d };
    });
  }
  function a(r, l) {
    return [...r].sort((c, d) => {
      const u = new Date(c.createdAt).getTime(), g = new Date(d.createdAt).getTime();
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
const Ce = 5, Nt = 300, ue = "1.0", xe = "task-storage-version", At = [
  /^tasks-/,
  // tasks-main, tasks-work
  /^stats-/,
  // stats-main, stats-work
  /^boards$/,
  // boards (without prefix)
  /^preferences$/
  // preferences (without prefix)
], Et = {
  version: 1,
  updatedAt: (/* @__PURE__ */ new Date()).toISOString(),
  experimentalThemes: !1,
  alwaysVerticalLayout: !1,
  theme: "light",
  showCompleteButton: !0,
  showDeleteButton: !0,
  showTagButton: !1
};
function _t(t, n) {
  const e = window.localStorage.getItem(xe);
  e !== ue && (console.log("[Preferences] Storage version mismatch, cleaning up orphaned keys", {
    current: e,
    expected: ue
  }), Object.keys(window.localStorage).forEach((a) => {
    const s = At.some((r) => r.test(a)), o = a.includes(`${t}-${n}`);
    s && !o && (console.log("[Preferences] Removing orphaned key:", a), window.localStorage.removeItem(a));
  }), window.localStorage.setItem(xe, ue), console.log("[Preferences] Storage upgraded to version", ue));
}
function Mt(t) {
  try {
    const n = sessionStorage.getItem("theme"), e = sessionStorage.getItem("showCompleteButton"), a = sessionStorage.getItem("showDeleteButton"), s = sessionStorage.getItem("showTagButton"), o = {};
    return n && !t.theme && (o.theme = n), e !== null && t.showCompleteButton === void 0 && (o.showCompleteButton = e === "true"), a !== null && t.showDeleteButton === void 0 && (o.showDeleteButton = a === "true"), s !== null && t.showTagButton === void 0 && (o.showTagButton = s === "true"), Object.keys(o).length > 0 ? (console.log("[Preferences] Migrating settings from sessionStorage to localStorage:", o), sessionStorage.removeItem("theme"), sessionStorage.removeItem("showCompleteButton"), sessionStorage.removeItem("showDeleteButton"), sessionStorage.removeItem("showTagButton"), o) : null;
  } catch (n) {
    return console.warn("[Preferences] Failed to migrate settings:", n), null;
  }
}
function It(t, n, e = !1) {
  const [a, s] = A(Et), [o, r] = A(!1);
  Z(() => {
    if (e) {
      r(!0);
      return;
    }
    (async () => {
      _t(t, n), console.log("[usePreferences] Loading preferences...", { userType: t, sessionId: n });
      const u = he(t, n), g = await u.getPreferences();
      if (console.log("[usePreferences] Loaded preferences:", g), g) {
        const p = Mt(g);
        if (p) {
          const v = { ...g, ...p, updatedAt: (/* @__PURE__ */ new Date()).toISOString() };
          s(v), await u.savePreferences(v), console.log("[usePreferences] Applied and saved migrations");
        } else
          s(g), console.log("[usePreferences] Applied preferences to state");
      }
      r(!0);
    })();
  }, [t, n, e]);
  const l = async (d) => {
    const u = { ...a, ...d, updatedAt: (/* @__PURE__ */ new Date()).toISOString() };
    s(u), await he(t, n).savePreferences(u);
  }, c = a.theme?.endsWith("-dark") || a.theme === "dark";
  return {
    preferences: a,
    savePreferences: l,
    preferencesLoaded: o,
    isDarkTheme: c,
    setPreferences: s
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
}, Ot = () => /* @__PURE__ */ k("svg", { ...Q, children: [
  /* @__PURE__ */ i("circle", { cx: "12", cy: "12", r: "5" }),
  /* @__PURE__ */ i("line", { x1: "12", y1: "1", x2: "12", y2: "3" }),
  /* @__PURE__ */ i("line", { x1: "12", y1: "21", x2: "12", y2: "23" }),
  /* @__PURE__ */ i("line", { x1: "4.22", y1: "4.22", x2: "5.64", y2: "5.64" }),
  /* @__PURE__ */ i("line", { x1: "18.36", y1: "18.36", x2: "19.78", y2: "19.78" }),
  /* @__PURE__ */ i("line", { x1: "1", y1: "12", x2: "3", y2: "12" }),
  /* @__PURE__ */ i("line", { x1: "21", y1: "12", x2: "23", y2: "12" }),
  /* @__PURE__ */ i("line", { x1: "4.22", y1: "19.78", x2: "5.64", y2: "18.36" }),
  /* @__PURE__ */ i("line", { x1: "18.36", y1: "5.64", x2: "19.78", y2: "4.22" })
] }), Ue = () => /* @__PURE__ */ i("svg", { ...Q, children: /* @__PURE__ */ i("path", { d: "M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" }) }), De = () => /* @__PURE__ */ k("svg", { ...Q, children: [
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
] }), Be = () => /* @__PURE__ */ k("svg", { ...Q, children: [
  /* @__PURE__ */ i("path", { d: "M2 12c2-2 4-2 6 0s4 2 6 0 4-2 6 0" }),
  /* @__PURE__ */ i("path", { d: "M2 17c2-2 4-2 6 0s4 2 6 0 4-2 6 0" }),
  /* @__PURE__ */ i("path", { d: "M2 7c2-2 4-2 6 0s4 2 6 0 4-2 6 0" })
] }), Ne = () => /* @__PURE__ */ i("svg", { ...Q, children: /* @__PURE__ */ i("polygon", { points: "13 2 3 14 12 14 11 22 21 10 12 10 13 2" }) }), Ae = () => /* @__PURE__ */ k("svg", { ...Q, children: [
  /* @__PURE__ */ i("path", { d: "M18 8h1a4 4 0 0 1 0 8h-1" }),
  /* @__PURE__ */ i("path", { d: "M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" }),
  /* @__PURE__ */ i("line", { x1: "6", y1: "1", x2: "6", y2: "4" }),
  /* @__PURE__ */ i("line", { x1: "10", y1: "1", x2: "10", y2: "4" }),
  /* @__PURE__ */ i("line", { x1: "14", y1: "1", x2: "14", y2: "4" })
] }), Ee = () => /* @__PURE__ */ k("svg", { ...Q, children: [
  /* @__PURE__ */ i("circle", { cx: "12", cy: "12", r: "2", fill: "currentColor" }),
  /* @__PURE__ */ i("circle", { cx: "12", cy: "6", r: "2.5", fill: "none", stroke: "currentColor", strokeWidth: "2" }),
  /* @__PURE__ */ i("circle", { cx: "18", cy: "10", r: "2.5", fill: "none", stroke: "currentColor", strokeWidth: "2" }),
  /* @__PURE__ */ i("circle", { cx: "16", cy: "16", r: "2.5", fill: "none", stroke: "currentColor", strokeWidth: "2" }),
  /* @__PURE__ */ i("circle", { cx: "8", cy: "16", r: "2.5", fill: "none", stroke: "currentColor", strokeWidth: "2" }),
  /* @__PURE__ */ i("circle", { cx: "6", cy: "10", r: "2.5", fill: "none", stroke: "currentColor", strokeWidth: "2" })
] }), _e = () => /* @__PURE__ */ i("svg", { ...Q, children: /* @__PURE__ */ i("path", { d: "M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z", fill: "currentColor" }) }), Lt = () => /* @__PURE__ */ k("svg", { ...Q, children: [
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
] }), Pt = () => /* @__PURE__ */ k("svg", { ...Q, width: 16, height: 16, viewBox: "0 0 20 20", children: [
  /* @__PURE__ */ i(
    "path",
    {
      d: "M2 4 L12 4 L16 10 L12 16 L2 16 Z",
      fill: "currentColor"
    }
  ),
  /* @__PURE__ */ i("circle", { cx: "6", cy: "10", r: "1.5", fill: "white" })
] }), Me = [
  {
    lightIcon: /* @__PURE__ */ i(Ot, {}),
    darkIcon: /* @__PURE__ */ i(Ue, {}),
    lightTheme: "light",
    darkTheme: "dark",
    lightLabel: "Light",
    darkLabel: "Dark"
  },
  {
    lightIcon: /* @__PURE__ */ i(De, {}),
    darkIcon: /* @__PURE__ */ i(De, {}),
    lightTheme: "strawberry-light",
    darkTheme: "strawberry-dark",
    lightLabel: "Strawberry Light",
    darkLabel: "Strawberry Dark"
  },
  {
    lightIcon: /* @__PURE__ */ i(Be, {}),
    darkIcon: /* @__PURE__ */ i(Be, {}),
    lightTheme: "ocean-light",
    darkTheme: "ocean-dark",
    lightLabel: "Ocean Light",
    darkLabel: "Ocean Dark"
  },
  {
    lightIcon: /* @__PURE__ */ i(Ne, {}),
    darkIcon: /* @__PURE__ */ i(Ne, {}),
    lightTheme: "cyberpunk-light",
    darkTheme: "cyberpunk-dark",
    lightLabel: "Cyberpunk Light",
    darkLabel: "Cyberpunk Dark"
  },
  {
    lightIcon: /* @__PURE__ */ i(Ae, {}),
    darkIcon: /* @__PURE__ */ i(Ae, {}),
    lightTheme: "coffee-light",
    darkTheme: "coffee-dark",
    lightLabel: "Coffee Light",
    darkLabel: "Coffee Dark"
  },
  {
    lightIcon: /* @__PURE__ */ i(Ee, {}),
    darkIcon: /* @__PURE__ */ i(Ee, {}),
    lightTheme: "lavender-light",
    darkTheme: "lavender-dark",
    lightLabel: "Lavender Light",
    darkLabel: "Lavender Dark"
  }
], $t = [
  {
    lightIcon: /* @__PURE__ */ i(_e, {}),
    darkIcon: /* @__PURE__ */ i(_e, {}),
    lightTheme: "pink-light",
    darkTheme: "pink-dark",
    lightLabel: "Pink Light",
    darkLabel: "Pink Dark"
  }
];
function He(t) {
  return t ? [...Me, ...$t] : Me;
}
function Ft(t, n) {
  const a = He(n).find(
    (s) => s.lightTheme === t || s.darkTheme === t
  );
  return a ? t.endsWith("-dark") || t === "dark" ? a.darkIcon : a.lightIcon : /* @__PURE__ */ i(Ue, {});
}
function Rt(t, n, e) {
  const [a, s] = A(!1), o = t.theme || "light", r = (c) => n({ theme: c }), l = $e(
    () => He(t.experimentalThemes || !1),
    [t.experimentalThemes]
  );
  return Z(() => {
    e.current && e.current.setAttribute("data-theme", o);
  }, [o, e]), Z(() => {
    const c = window.matchMedia("(prefers-color-scheme: dark)"), d = (u) => {
      const g = u.matches, p = o.replace(/-light$|-dark$/, ""), v = o.endsWith("-dark") ? "dark" : o.endsWith("-light") ? "light" : null;
      if (v && p !== "light" && p !== "dark") {
        const b = g ? "dark" : "light";
        if (v !== b) {
          const N = `${p}-${b}`;
          console.log(`[Theme] Auto-switching from ${o} to ${N} (system preference)`), r(N);
        }
      }
    };
    return c.addEventListener ? c.addEventListener("change", d) : c.addListener(d), () => {
      c.removeEventListener ? c.removeEventListener("change", d) : c.removeListener(d);
    };
  }, [o, r]), {
    theme: o,
    showThemePicker: a,
    setShowThemePicker: s,
    THEME_FAMILIES: l,
    setTheme: r
  };
}
function Ie(t, n, e, a) {
  Z(() => {
    if (!n) return;
    const s = (o) => {
      const r = o.target;
      t.current && t.current.contains(r) || a && r.closest(a) || e();
    };
    return document.addEventListener("mousedown", s), () => document.removeEventListener("mousedown", s);
  }, [t, n, e, a]);
}
function Kt() {
  const [t, n] = A(null), [e, a] = A(!1), [s, o] = A(!1), [r, l] = A(!1), [c, d] = A(null), [u, g] = A(""), [p, v] = A(null), [b, N] = A(null), [J, $] = A(""), [U, W] = A(null), [j, z] = A(null);
  return {
    confirmClearTag: t,
    setConfirmClearTag: n,
    showNewBoardDialog: e,
    setShowNewBoardDialog: a,
    showNewTagDialog: s,
    setShowNewTagDialog: o,
    showSettingsModal: r,
    setShowSettingsModal: l,
    editTagModal: c,
    setEditTagModal: d,
    editTagInput: u,
    setEditTagInput: g,
    boardContextMenu: p,
    setBoardContextMenu: v,
    tagContextMenu: b,
    setTagContextMenu: N,
    inputValue: J,
    setInputValue: $,
    validationError: U,
    setValidationError: W,
    pendingTaskOperation: j,
    setPendingTaskOperation: z
  };
}
const Oe = 768;
function Ut() {
  const [t, n] = A(() => typeof window > "u" ? !1 : window.innerWidth < Oe);
  return Z(() => {
    if (typeof window > "u") return;
    const e = window.matchMedia(`(max-width: ${Oe - 1}px)`), a = (s) => {
      n(s.matches);
    };
    return e.addEventListener ? e.addEventListener("change", a) : e.addListener(a), a(e), () => {
      e.removeEventListener ? e.removeEventListener("change", a) : e.removeListener(a);
    };
  }, []), t;
}
function Ht({ isDarkTheme: t }) {
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
function Jt({
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
          children: Ft(t, n)
        }
      ),
      e && /* @__PURE__ */ k(
        "div",
        {
          className: "theme-picker__dropdown",
          onClick: (l) => l.stopPropagation(),
          children: [
            /* @__PURE__ */ i("div", { className: "theme-picker__pills", children: r.map((l, c) => /* @__PURE__ */ k("div", { className: "theme-pill", children: [
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
                children: /* @__PURE__ */ i(Lt, {})
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
function Je({ onLongPress: t, delay: n = 500 }) {
  const e = ge(null);
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
function ye(t) {
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
function Wt({
  board: t,
  isActive: n,
  isDragOver: e,
  onSwitch: a,
  onContextMenu: s,
  onDragOverFilter: o,
  onMoveTasksToBoard: r,
  onClearSelection: l
}) {
  const c = Je({
    onLongPress: (u, g) => s(t.id, u, g)
  }), d = t.id === "main";
  return /* @__PURE__ */ i(
    "button",
    {
      className: `board-btn ${n ? "board-btn--active" : ""} ${e ? "board-btn--drag-over" : ""}`,
      onClick: () => a(t.id),
      onContextMenu: (u) => {
        u.preventDefault(), !d && s(t.id, u.clientX, u.clientY);
      },
      ...d ? {} : c,
      "aria-pressed": n ? "true" : "false",
      onDragOver: (u) => {
        u.preventDefault(), u.dataTransfer.dropEffect = "move", o(`board:${t.id}`);
      },
      onDragLeave: (u) => {
        o(null);
      },
      onDrop: async (u) => {
        u.preventDefault(), o(null);
        const g = ye(u.dataTransfer);
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
function jt({
  boards: t,
  currentBoardId: n,
  userType: e,
  dragOverFilter: a,
  onBoardSwitch: s,
  onBoardContextMenu: o,
  onDragOverFilter: r,
  onMoveTasksToBoard: l,
  onClearSelection: c,
  onCreateBoardClick: d,
  onPendingOperation: u,
  onInitialLoad: g
}) {
  const [p, v] = A(!1), b = t && t.boards ? t.boards.slice(0, Ce) : [{ id: "main", name: "main", tasks: [], tags: [] }], N = !t || t.boards && t.boards.length < Ce, J = async ($) => {
    if (p) return;
    console.log("[BoardsSection] Manual refresh triggered"), v(!0);
    const U = $.currentTarget, W = new Promise((j, z) => {
      setTimeout(() => z(new Error("Sync timeout")), 5e3);
    });
    try {
      await Promise.race([g(), W]), console.log("[BoardsSection] Sync completed successfully");
    } catch (j) {
      console.error("[BoardsSection] Sync failed:", j);
    } finally {
      v(!1), U?.blur();
    }
  };
  return /* @__PURE__ */ k("div", { className: "task-app__boards", children: [
    /* @__PURE__ */ i("div", { className: "task-app__board-list", children: b.map(($) => /* @__PURE__ */ i(
      Wt,
      {
        board: $,
        isActive: n === $.id,
        isDragOver: a === `board:${$.id}`,
        onSwitch: s,
        onContextMenu: o,
        onDragOverFilter: r,
        onMoveTasksToBoard: l,
        onClearSelection: c
      },
      $.id
    )) }),
    /* @__PURE__ */ k("div", { className: "task-app__board-actions", children: [
      N && /* @__PURE__ */ i(
        "button",
        {
          className: `board-add-btn ${a === "add-board" ? "board-btn--drag-over" : ""}`,
          onClick: d,
          onDragOver: ($) => {
            $.preventDefault(), $.dataTransfer.dropEffect = "move", r("add-board");
          },
          onDragLeave: () => r(null),
          onDrop: ($) => {
            $.preventDefault(), r(null);
            const U = ye($.dataTransfer);
            U.length > 0 && (u({ type: "move-to-board", taskIds: U }), d());
          },
          "aria-label": "Create board",
          children: "＋"
        }
      ),
      e !== "public" && /* @__PURE__ */ i(
        "button",
        {
          className: `sync-btn ${p ? "spinning" : ""}`,
          onClick: J,
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
function Vt({
  tag: t,
  isActive: n,
  isDragOver: e,
  onToggle: a,
  onContextMenu: s,
  onDragOver: o,
  onDragLeave: r,
  onDrop: l
}) {
  const c = Je({
    onLongPress: (d, u) => s(t, d, u)
  });
  return /* @__PURE__ */ k(
    "button",
    {
      onClick: () => a(t),
      onContextMenu: (d) => {
        d.preventDefault(), s(t, d.clientX, d.clientY);
      },
      ...c,
      className: `${n ? "on" : ""} ${e ? "task-app__filter-drag-over" : ""}`,
      onDragOver: (d) => o(d, t),
      onDragLeave: r,
      onDrop: (d) => l(d, t),
      children: [
        "#",
        t
      ]
    }
  );
}
function zt({
  tags: t,
  selectedFilters: n,
  dragOverFilter: e,
  onToggleFilter: a,
  onTagContextMenu: s,
  onDragOver: o,
  onDragLeave: r,
  onDrop: l,
  onCreateTagClick: c,
  onPendingOperation: d
}) {
  const u = (g) => {
    g.preventDefault(), r(g);
    const p = ye(g.dataTransfer);
    p.length > 0 && (d({ type: "apply-tag", taskIds: p }), c());
  };
  return /* @__PURE__ */ k("div", { className: "task-app__filters", children: [
    t.map((g) => /* @__PURE__ */ i(
      Vt,
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
        onClick: c,
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
function Xt(t) {
  const n = /* @__PURE__ */ new Date(), e = new Date(t), a = n.getTime() - e.getTime(), s = Math.floor(a / 1e3), o = Math.floor(s / 60), r = Math.floor(o / 60), l = Math.floor(r / 24);
  return s < 60 ? `${s}s ago` : o < 60 ? `${o}m ago` : r < 24 ? `${r}h ago` : `${l}d ago`;
}
function me({
  task: t,
  isDraggable: n = !0,
  pendingOperations: e,
  onComplete: a,
  onDelete: s,
  onEditTag: o,
  onDragStart: r,
  onDragEnd: l,
  selected: c = !1,
  showCompleteButton: d = !0,
  showDeleteButton: u = !0,
  showTagButton: g = !1
}) {
  const p = e.has(`complete-${t.id}`), v = e.has(`delete-${t.id}`);
  return /* @__PURE__ */ k(
    "li",
    {
      className: `task-app__item ${c ? "selected" : ""}`,
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
            /* @__PURE__ */ i("div", { className: "task-app__item-age", children: Xt(t.createdAt) })
          ] })
        ] }),
        /* @__PURE__ */ k("div", { className: "task-app__item-actions", children: [
          g && /* @__PURE__ */ i(
            "button",
            {
              className: "task-app__action-btn task-app__edit-tag-btn",
              onClick: () => o(t.id),
              title: "Edit tags",
              disabled: p || v,
              children: /* @__PURE__ */ i(Pt, {})
            }
          ),
          d && /* @__PURE__ */ i(
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
function Le(t, n = !1) {
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
function qt({
  tasks: t,
  topTags: n,
  isMobile: e = !1,
  filters: a,
  sortDirections: s,
  dragOverTag: o,
  pendingOperations: r,
  onComplete: l,
  onDelete: c,
  onEditTag: d,
  onDragStart: u,
  onDragEnd: g,
  selectedIds: p,
  onSelectionStart: v,
  onSelectionMove: b,
  onSelectionEnd: N,
  onDragOver: J,
  onDragLeave: $,
  onDrop: U,
  toggleSort: W,
  sortTasksByAge: j,
  getSortIcon: z,
  getSortTitle: X,
  deleteTag: ee,
  onDeletePersistedTag: te,
  showCompleteButton: G = !0,
  showDeleteButton: m = !0,
  showTagButton: y = !1
}) {
  const x = (w, F) => /* @__PURE__ */ k(
    "div",
    {
      className: `task-app__tag-column ${o === w ? "task-app__tag-column--drag-over" : ""}`,
      onDragOver: (P) => J(P, w),
      onDragLeave: $,
      onDrop: (P) => U(P, w),
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
              onClick: () => W(w),
              title: X(s[w] || "desc"),
              children: z(s[w] || "desc")
            }
          )
        ] }),
        /* @__PURE__ */ i("ul", { className: "task-app__list task-app__list--column", children: j(F, s[w] || "desc").map((P) => /* @__PURE__ */ i(
          me,
          {
            task: P,
            isDraggable: !0,
            pendingOperations: r,
            onComplete: l,
            onDelete: c,
            onEditTag: d,
            onDragStart: u,
            onDragEnd: g,
            selected: p ? p.has(P.id) : !1,
            showCompleteButton: G,
            showDeleteButton: m,
            showTagButton: y
          },
          P.id
        )) })
      ]
    },
    w
  ), f = (w, F) => {
    let P = be(t, w);
    return C && (P = P.filter((R) => {
      const q = R.tag?.split(" ") || [];
      return a.some((oe) => q.includes(oe));
    })), P.slice(0, F);
  }, T = n.length, C = Array.isArray(a) && a.length > 0, B = t.filter((w) => {
    if (!C) return !0;
    const F = w.tag?.split(" ") || [];
    return a.some((P) => F.includes(P));
  }), E = Le(T, e), D = C ? n.filter((w) => be(t, w).some((P) => {
    const R = P.tag?.split(" ") || [];
    return a.some((q) => R.includes(q));
  })) : n.slice(0, E.useTags);
  if (D.length === 0)
    return /* @__PURE__ */ i("ul", { className: "task-app__list", children: B.map((w) => /* @__PURE__ */ i(
      me,
      {
        task: w,
        pendingOperations: r,
        onComplete: l,
        onDelete: c,
        onEditTag: d,
        onDragStart: u,
        onDragEnd: g,
        selected: p ? p.has(w.id) : !1,
        showCompleteButton: G,
        showDeleteButton: m,
        showTagButton: y
      },
      w.id
    )) });
  const L = Ct(t, n, a).filter((w) => {
    if (!C) return !0;
    const F = w.tag?.split(" ") || [];
    return a.some((P) => F.includes(P));
  }), I = Le(D.length, e);
  return /* @__PURE__ */ k("div", { className: "task-app__dynamic-layout", children: [
    I.rows.length > 0 && /* @__PURE__ */ i(at, { children: I.rows.map((w, F) => /* @__PURE__ */ i("div", { className: `task-app__tag-grid task-app__tag-grid--${w.columns}col`, children: w.tagIndices.map((P) => {
      const R = D[P];
      return R ? x(R, f(R, I.maxPerColumn)) : null;
    }) }, F)) }),
    L.length > 0 && /* @__PURE__ */ k(
      "div",
      {
        className: `task-app__remaining ${o === "other" ? "task-app__tag-column--drag-over" : ""}`,
        onDragOver: (w) => {
          w.preventDefault(), w.dataTransfer.dropEffect = "move", J(w, "other");
        },
        onDragLeave: (w) => $(w),
        onDrop: (w) => U(w, "other"),
        children: [
          /* @__PURE__ */ k("div", { className: "task-app__tag-header-row", children: [
            /* @__PURE__ */ i("h3", { className: "task-app__remaining-header", children: "Other Tasks" }),
            /* @__PURE__ */ i(
              "button",
              {
                className: "task-app__sort-btn task-app__sort-btn--active",
                onClick: () => W("other"),
                title: X(s.other || "desc"),
                children: z(s.other || "desc")
              }
            )
          ] }),
          /* @__PURE__ */ i("ul", { className: "task-app__list", children: j(L, s.other || "desc").map((w) => /* @__PURE__ */ i(
            me,
            {
              task: w,
              pendingOperations: r,
              onComplete: l,
              onDelete: c,
              onEditTag: d,
              onDragStart: u,
              onDragEnd: g,
              selected: p ? p.has(w.id) : !1,
              showCompleteButton: G,
              showDeleteButton: m,
              showTagButton: y
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
  confirmLabel: c = "Confirm",
  cancelLabel: d = "Cancel",
  confirmDisabled: u = !1,
  confirmDanger: g = !1
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
            /* @__PURE__ */ k("div", { className: "modal-actions", children: [
              /* @__PURE__ */ i(
                "button",
                {
                  className: "modal-button",
                  onClick: e,
                  children: d
                }
              ),
              /* @__PURE__ */ i(
                "button",
                {
                  className: `modal-button ${g ? "modal-button--danger" : "modal-button--primary"}`,
                  onClick: a,
                  disabled: u,
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
function Yt({ tag: t, count: n, isOpen: e, onClose: a, onConfirm: s }) {
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
function Gt({
  isOpen: t,
  inputValue: n,
  validationError: e,
  pendingTaskOperation: a,
  onClose: s,
  onConfirm: o,
  onInputChange: r,
  validateBoardName: l
}) {
  const c = async () => {
    !n.trim() || l(n) || await o(n);
  }, d = !n.trim() || l(n) !== null;
  return /* @__PURE__ */ k(
    ce,
    {
      isOpen: t,
      title: "Create New Board",
      onClose: s,
      onConfirm: c,
      inputValue: n,
      onInputChange: r,
      inputPlaceholder: "Board name",
      confirmLabel: "Create",
      confirmDisabled: d,
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
function Zt({
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
      } catch (d) {
        console.error("[CreateTagModal] Failed to create tag:", d);
      }
  }, c = Ke(e);
  return /* @__PURE__ */ k(
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
        a?.type === "apply-tag" && a.taskIds.length > 0 && /* @__PURE__ */ k("p", { className: "modal-hint", children: [
          "This tag will be applied to ",
          a.taskIds.length,
          " task",
          a.taskIds.length > 1 ? "s" : ""
        ] }),
        c.length > 0 && /* @__PURE__ */ k("div", { className: "modal-section", children: [
          /* @__PURE__ */ i("label", { className: "modal-label", children: "Existing tags:" }),
          /* @__PURE__ */ i("div", { className: "modal-tags-list", children: c.map((d) => /* @__PURE__ */ k("span", { className: "modal-tag-chip", children: [
            "#",
            d
          ] }, d)) })
        ] })
      ]
    }
  );
}
async function Qt(t, n) {
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
function ea({
  isOpen: t,
  preferences: n,
  showCompleteButton: e,
  showDeleteButton: a,
  showTagButton: s,
  onClose: o,
  onSavePreferences: r,
  onValidateKey: l
}) {
  const [c, d] = A(""), [u, g] = A(null), [p, v] = A(!1), b = async () => {
    if (!c.trim() || p) return;
    v(!0), g(null);
    const N = await Qt(c, l);
    N.success || (g(N.error || "Failed to validate key"), v(!1));
  };
  return /* @__PURE__ */ k(
    ce,
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
                  value: c,
                  onChange: (N) => {
                    d(N.target.value), g(null);
                  },
                  onKeyDown: (N) => {
                    N.key === "Enter" && c && !p && b();
                  },
                  placeholder: "Enter authentication key",
                  disabled: p
                }
              ),
              c && /* @__PURE__ */ i(
                "button",
                {
                  className: "settings-field-button",
                  onClick: b,
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
                onChange: (N) => {
                  r({ experimentalThemes: N.target.checked });
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
                onChange: (N) => {
                  r({ alwaysVerticalLayout: N.target.checked });
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
                onChange: (N) => {
                  r({ showCompleteButton: !N.target.checked });
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
                onChange: (N) => {
                  r({ showDeleteButton: !N.target.checked });
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
                onChange: (N) => {
                  r({ showTagButton: N.target.checked });
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
function ta({
  isOpen: t,
  taskId: n,
  currentTag: e,
  editTagInput: a,
  boards: s,
  currentBoardId: o,
  onClose: r,
  onConfirm: l,
  onInputChange: c,
  onToggleTagPill: d
}) {
  const g = s?.boards?.find((b) => b.id === o)?.tags || [], p = e?.split(" ").filter(Boolean) || [], v = (b) => {
    b.key === "Enter" && (b.preventDefault(), l());
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
      children: /* @__PURE__ */ k("div", { className: "edit-tag-modal", children: [
        g.length > 0 && /* @__PURE__ */ k("div", { className: "edit-tag-pills", children: [
          /* @__PURE__ */ i("label", { className: "edit-tag-label", children: "Select Tags" }),
          /* @__PURE__ */ i("div", { className: "edit-tag-pills-container", children: [...g].sort().map((b) => {
            const N = p.includes(b);
            return /* @__PURE__ */ k(
              "button",
              {
                className: `edit-tag-pill ${N ? "active" : ""}`,
                onClick: () => d(b),
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
              onChange: (b) => c(b.target.value),
              onKeyDown: v,
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
function We({ isOpen: t, x: n, y: e, items: a, className: s = "board-context-menu" }) {
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
function aa({
  isOpen: t,
  boardId: n,
  x: e,
  y: a,
  boards: s,
  onClose: o,
  onDeleteBoard: r
}) {
  return /* @__PURE__ */ i(
    We,
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
            const c = s?.boards?.find((d) => d.id === n)?.name || n;
            if (confirm(`Delete board "${c}"? All tasks on this board will be permanently deleted.`))
              try {
                await r(n), o();
              } catch (d) {
                console.error("[BoardContextMenu] Failed to delete board:", d), alert(d.message || "Failed to delete board");
              }
          }
        }
      ]
    }
  );
}
function na({
  isOpen: t,
  tag: n,
  x: e,
  y: a,
  onClose: s,
  onDeleteTag: o
}) {
  return /* @__PURE__ */ i(
    We,
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
const Pe = [
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
function sa() {
  return Pe[Math.floor(Math.random() * Pe.length)];
}
function oa(t, n) {
  const e = t.trim();
  return e ? n.map((s) => s.id.toLowerCase()).includes(e.toLowerCase()) ? `Board "${e}" already exists` : null : "Board name cannot be empty";
}
function ra(t = {}) {
  const { userType: n = "public", sessionId: e = "public" } = t, a = ge(null), s = ge(null), o = Ut(), [r] = A(() => sa()), [l, c] = A(/* @__PURE__ */ new Set()), [d, u] = A(!1), [g, p] = A(e), { preferences: v, savePreferences: b, preferencesLoaded: N, isDarkTheme: J, setPreferences: $ } = It(n, g, !0), { theme: U, showThemePicker: W, setShowThemePicker: j, THEME_FAMILIES: z, setTheme: X } = Rt(v, b, s), ee = o || v.alwaysVerticalLayout || !1, te = v.showCompleteButton ?? !0, G = v.showDeleteButton ?? !0, m = v.showTagButton ?? !1, {
    tasks: y,
    pendingOperations: x,
    initialLoad: f,
    addTask: T,
    completeTask: C,
    deleteTask: B,
    updateTaskTags: E,
    bulkUpdateTaskTags: D,
    deleteTag: L,
    boards: I,
    currentBoardId: w,
    createBoard: F,
    deleteBoard: P,
    switchBoard: R,
    moveTasksToBoard: q,
    createTagOnBoard: oe,
    deleteTagOnBoard: de
  } = xt({ userType: n, sessionId: g }), M = Dt({
    tasks: y,
    onTaskUpdate: E,
    onBulkUpdate: D
  }), re = Bt(), h = Kt();
  Ie(
    { current: null },
    // Board context menu doesn't need a ref
    !!h.boardContextMenu,
    () => h.setBoardContextMenu(null),
    ".board-context-menu"
  ), Ie(
    { current: null },
    // Tag context menu doesn't need a ref
    !!h.tagContextMenu,
    () => h.setTagContextMenu(null),
    ".tag-context-menu"
  ), Z(() => {
    c(/* @__PURE__ */ new Set());
  }, [w]), Z(() => {
    async function S() {
      console.log("[App] Initializing session...", { userType: n, sessionId: e });
      const _ = ke(), O = await st(e, n);
      let K = e;
      n === "public" ? (K = ke() || e, console.log("[App] Public user - using stable sessionId:", K)) : (K = e, O && ($(O), console.log("[App] Applied preferences from handshake:", O)), _ && _ !== e && (console.log("[App] SessionId changed, clearing old storage"), ot(_, n))), p(K), u(!0), console.log("[App] Loading data from API..."), await f();
    }
    S();
  }, [n, e]);
  const je = async (S) => {
    await T(S) && a.current && (a.current.value = "", a.current.focus());
  }, Ve = (S) => {
    const _ = y.filter((O) => O.tag?.split(" ").includes(S));
    h.setConfirmClearTag({ tag: S, count: _.length });
  }, ze = async (S) => {
    const _ = S.trim().replace(/\s+/g, "-");
    try {
      if (await oe(_), h.pendingTaskOperation?.type === "apply-tag" && h.pendingTaskOperation.taskIds.length > 0) {
        const O = h.pendingTaskOperation.taskIds.map((K) => {
          const ae = y.find((tt) => tt.id === K)?.tag?.split(" ").filter(Boolean) || [], ne = [.../* @__PURE__ */ new Set([...ae, _])];
          return { taskId: K, tag: ne.join(" ") };
        });
        await D(O), M.clearSelection();
      }
      h.setPendingTaskOperation(null), h.setShowNewTagDialog(!1), h.setInputValue("");
    } catch (O) {
      throw console.error("[App] Failed to create tag:", O), O;
    }
  }, Xe = (S) => {
    const _ = y.find((O) => O.id === S);
    _ && (h.setEditTagModal({ taskId: S, currentTag: _.tag || null }), h.setEditTagInput(""));
  }, qe = async () => {
    if (!h.editTagModal) return;
    const { taskId: S, currentTag: _ } = h.editTagModal, O = _?.split(" ").filter(Boolean) || [], K = h.editTagInput.trim() ? h.editTagInput.trim().replace(/\s+/g, "-").split("#").filter(Boolean).map((ne) => ne.trim()) : [];
    for (const ne of K)
      await oe(ne);
    const ae = [.../* @__PURE__ */ new Set([...O, ...K])].sort().join(" ");
    await E(S, { tag: ae }), h.setEditTagModal(null), h.setEditTagInput("");
  }, Ye = (S) => {
    if (!h.editTagModal) return;
    const { taskId: _, currentTag: O } = h.editTagModal, K = O?.split(" ").filter(Boolean) || [];
    if (K.includes(S)) {
      const ae = K.filter((ne) => ne !== S).sort().join(" ");
      h.setEditTagModal({ taskId: _, currentTag: ae });
    } else {
      const ae = [...K, S].sort().join(" ");
      h.setEditTagModal({ taskId: _, currentTag: ae });
    }
  }, we = (S) => oa(S, I?.boards || []), Ge = async (S) => {
    const _ = S.trim(), O = we(_);
    if (O) {
      h.setValidationError(O);
      return;
    }
    try {
      await F(_), h.pendingTaskOperation?.type === "move-to-board" && h.pendingTaskOperation.taskIds.length > 0 && (await q(_, h.pendingTaskOperation.taskIds), M.clearSelection()), h.setPendingTaskOperation(null), h.setValidationError(null), h.setShowNewBoardDialog(!1), h.setInputValue("");
    } catch (K) {
      console.error("[App] Failed to create board:", K), h.setValidationError(K.message || "Failed to create board");
    }
  }, Ze = I?.boards?.find((S) => S.id === w)?.tags || [], Qe = Array.from(/* @__PURE__ */ new Set([...Ze, ...Ke(y)])), et = St(y, ee ? 3 : 6);
  return !d || !N ? /* @__PURE__ */ i(Ht, { isDarkTheme: J }) : /* @__PURE__ */ i(
    "div",
    {
      ref: s,
      className: "task-app-container task-app-fade-in",
      "data-dark-theme": J ? "true" : "false",
      onMouseDown: M.selectionStartHandler,
      onMouseMove: M.selectionMoveHandler,
      onMouseUp: M.selectionEndHandler,
      onMouseLeave: M.selectionEndHandler,
      onClick: (S) => {
        try {
          const _ = S.target;
          if (_.closest && _.closest(".theme-picker"))
            return;
          if (!_.closest || !_.closest(".task-app__item")) {
            if (M.selectionJustEndedAt && Date.now() - M.selectionJustEndedAt < Nt)
              return;
            M.clearSelection();
          }
        } catch {
        }
      },
      children: /* @__PURE__ */ k("div", { className: "task-app", children: [
        /* @__PURE__ */ i(
          Jt,
          {
            theme: U,
            experimentalThemes: v.experimentalThemes || !1,
            showThemePicker: W,
            onThemePickerToggle: () => j(!W),
            onThemeChange: X,
            onSettingsClick: () => h.setShowSettingsModal(!0),
            THEME_FAMILIES: z
          }
        ),
        /* @__PURE__ */ i(
          jt,
          {
            boards: I,
            currentBoardId: w,
            userType: n,
            dragOverFilter: M.dragOverFilter,
            onBoardSwitch: R,
            onBoardContextMenu: (S, _, O) => h.setBoardContextMenu({ boardId: S, x: _, y: O }),
            onDragOverFilter: M.setDragOverFilter,
            onMoveTasksToBoard: q,
            onClearSelection: M.clearSelection,
            onCreateBoardClick: () => {
              h.setInputValue(""), h.setValidationError(null), h.setShowNewBoardDialog(!0);
            },
            onPendingOperation: h.setPendingTaskOperation,
            onInitialLoad: f
          }
        ),
        /* @__PURE__ */ i("div", { className: "task-app__controls", children: /* @__PURE__ */ i(
          "input",
          {
            ref: a,
            className: "task-app__input",
            placeholder: r,
            onKeyDown: (S) => {
              S.key === "Enter" && !S.shiftKey && (S.preventDefault(), je(S.target.value)), S.key === "k" && (S.ctrlKey || S.metaKey) && (S.preventDefault(), a.current?.focus());
            }
          }
        ) }),
        /* @__PURE__ */ i(
          zt,
          {
            tags: Qe,
            selectedFilters: l,
            dragOverFilter: M.dragOverFilter,
            onToggleFilter: (S) => {
              c((_) => {
                const O = new Set(_);
                return O.has(S) ? O.delete(S) : O.add(S), O;
              });
            },
            onTagContextMenu: (S, _, O) => h.setTagContextMenu({ tag: S, x: _, y: O }),
            onDragOver: M.onFilterDragOver,
            onDragLeave: M.onFilterDragLeave,
            onDrop: M.onFilterDrop,
            onCreateTagClick: () => {
              h.setInputValue(""), h.setShowNewTagDialog(!0);
            },
            onPendingOperation: h.setPendingTaskOperation
          }
        ),
        /* @__PURE__ */ i(
          qt,
          {
            tasks: y,
            topTags: et,
            isMobile: ee,
            filters: Array.from(l),
            selectedIds: M.selectedIds,
            onSelectionStart: M.selectionStartHandler,
            onSelectionMove: M.selectionMoveHandler,
            onSelectionEnd: M.selectionEndHandler,
            sortDirections: re.sortDirections,
            dragOverTag: M.dragOverTag,
            pendingOperations: x,
            onComplete: C,
            onDelete: B,
            onEditTag: Xe,
            onDragStart: M.onDragStart,
            onDragEnd: M.onDragEnd,
            onDragOver: M.onDragOver,
            onDragLeave: M.onDragLeave,
            onDrop: M.onDrop,
            toggleSort: re.toggleSort,
            sortTasksByAge: re.sortTasksByAge,
            getSortIcon: re.getSortIcon,
            getSortTitle: re.getSortTitle,
            deleteTag: Ve,
            onDeletePersistedTag: de,
            showCompleteButton: te,
            showDeleteButton: G,
            showTagButton: m
          }
        ),
        M.isSelecting && M.marqueeRect && /* @__PURE__ */ i(
          "div",
          {
            className: "marquee-overlay",
            style: {
              left: `${M.marqueeRect.x}px`,
              top: `${M.marqueeRect.y}px`,
              width: `${M.marqueeRect.w}px`,
              height: `${M.marqueeRect.h}px`
            }
          }
        ),
        /* @__PURE__ */ i(
          Yt,
          {
            tag: h.confirmClearTag?.tag || null,
            count: h.confirmClearTag?.count || 0,
            isOpen: !!h.confirmClearTag,
            onClose: () => h.setConfirmClearTag(null),
            onConfirm: L
          }
        ),
        /* @__PURE__ */ i(
          Gt,
          {
            isOpen: h.showNewBoardDialog,
            inputValue: h.inputValue,
            validationError: h.validationError,
            pendingTaskOperation: h.pendingTaskOperation,
            onClose: () => {
              h.setShowNewBoardDialog(!1), h.setPendingTaskOperation(null), h.setValidationError(null);
            },
            onConfirm: Ge,
            onInputChange: (S) => {
              h.setInputValue(S), h.setValidationError(null);
            },
            validateBoardName: we
          }
        ),
        /* @__PURE__ */ i(
          Zt,
          {
            isOpen: h.showNewTagDialog,
            inputValue: h.inputValue,
            tasks: y,
            pendingTaskOperation: h.pendingTaskOperation,
            onClose: () => {
              h.setShowNewTagDialog(!1), h.setPendingTaskOperation(null);
            },
            onConfirm: ze,
            onInputChange: h.setInputValue
          }
        ),
        /* @__PURE__ */ i(
          ea,
          {
            isOpen: h.showSettingsModal,
            preferences: v,
            showCompleteButton: te,
            showDeleteButton: G,
            showTagButton: m,
            onClose: () => h.setShowSettingsModal(!1),
            onSavePreferences: b,
            onValidateKey: async (S) => await he(n, g).validateKey(S)
          }
        ),
        /* @__PURE__ */ i(
          ta,
          {
            isOpen: !!h.editTagModal,
            taskId: h.editTagModal?.taskId || null,
            currentTag: h.editTagModal?.currentTag || null,
            editTagInput: h.editTagInput,
            boards: I,
            currentBoardId: w,
            onClose: () => {
              h.setEditTagModal(null), h.setEditTagInput("");
            },
            onConfirm: qe,
            onInputChange: h.setEditTagInput,
            onToggleTagPill: Ye
          }
        ),
        /* @__PURE__ */ i(
          aa,
          {
            isOpen: !!h.boardContextMenu,
            boardId: h.boardContextMenu?.boardId || null,
            x: h.boardContextMenu?.x || 0,
            y: h.boardContextMenu?.y || 0,
            boards: I,
            onClose: () => h.setBoardContextMenu(null),
            onDeleteBoard: P
          }
        ),
        /* @__PURE__ */ i(
          na,
          {
            isOpen: !!h.tagContextMenu,
            tag: h.tagContextMenu?.tag || null,
            x: h.tagContextMenu?.x || 0,
            y: h.tagContextMenu?.y || 0,
            onClose: () => h.setTagContextMenu(null),
            onDeleteTag: L
          }
        )
      ] })
    }
  );
}
function ua(t, n = {}) {
  const e = new URLSearchParams(window.location.search), a = n.userType || e.get("userType") || "admin", s = n.sessionId || "public-session", o = { ...n, userType: a, sessionId: s }, r = nt(t);
  r.render(/* @__PURE__ */ i(ra, { ...o })), t.__root = r, console.log("[task-app] Mounted successfully", o);
}
function ga(t) {
  t.__root?.unmount();
}
export {
  ua as mount,
  ga as unmount
};
