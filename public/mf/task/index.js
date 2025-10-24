import { jsxs as k, jsx as i, Fragment as nt } from "react/jsx-runtime";
import { createRoot as st } from "react-dom/client";
import { useState as A, useMemo as $e, useEffect as Q, useRef as he } from "react";
const J = `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
function Te() {
  return localStorage.getItem("currentSessionId");
}
function me(t) {
  localStorage.setItem("currentSessionId", t), console.log("[Session] Stored sessionId:", t);
}
async function ot(t, n) {
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
function rt(t, n) {
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
class it {
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
function lt() {
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
function ct(t, n, e, a) {
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
  ]), { updatedTasks: l, statsEvents: d, result: c } = a(o, r, s);
  let u = r;
  for (const { task: h, eventType: p } of d)
    u = ct(u, h, p, s);
  return await Promise.all([
    t.saveTasks(n.userType, n.sessionId, e, l),
    t.saveStats(n.userType, n.sessionId, e, u)
  ]), c;
}
async function de(t, n, e) {
  const a = (/* @__PURE__ */ new Date()).toISOString(), s = await t.getBoards(n.userType, n.sessionId), { updatedBoards: o, result: r } = e(s, a);
  return await t.saveBoards(n.userType, o, n.sessionId), r;
}
async function dt(t, n) {
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
async function ut(t, n, e, a = "main") {
  return se(t, n, a, (s, o, r) => {
    const l = e.id || lt(), d = e.createdAt || r, c = {
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
async function gt(t, n, e, a, s = "main") {
  return se(t, n, s, (o, r, l) => {
    const { task: d, index: c } = Fe(o, e), u = {
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
async function ht(t, n, e, a = "main") {
  return se(t, n, a, (s, o, r) => {
    const { updatedTasks: l, closedTask: d } = Re(s, e, "Completed", r);
    return {
      updatedTasks: l,
      statsEvents: [{ task: d, eventType: "completed" }],
      result: { ok: !0, message: `Task ${e} completed` }
    };
  });
}
async function pt(t, n, e, a = "main") {
  return se(t, n, a, (s, o, r) => {
    const { updatedTasks: l, closedTask: d } = Re(s, e, "Deleted", r);
    return {
      updatedTasks: l,
      statsEvents: [{ task: d, eventType: "deleted" }],
      result: { ok: !0, message: `Task ${e} deleted` }
    };
  });
}
async function ft(t, n, e) {
  return de(t, n, (a, s) => {
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
async function mt(t, n, e) {
  if (e === "main")
    throw new Error("Cannot delete the main board");
  return de(t, n, (a, s) => (pe(a, e), {
    updatedBoards: {
      ...a,
      updatedAt: s,
      boards: a.boards.filter((r) => r.id !== e)
    },
    result: { ok: !0, message: `Board ${e} deleted` }
  }));
}
async function kt(t, n, e) {
  return de(t, n, (a, s) => {
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
async function Tt(t, n, e) {
  return de(t, n, (a, s) => {
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
async function yt(t, n, e) {
  return se(t, n, e.boardId, (a, s, o) => {
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
async function wt(t, n, e) {
  const a = await se(t, n, e.boardId, (s, o, r) => {
    let l = 0;
    const d = s.tasks.map((h) => {
      if (e.taskIds.includes(h.id) && h.tag) {
        const x = h.tag.split(" ").filter(Boolean).filter((w) => w !== e.tag);
        return l++, {
          ...h,
          tag: x.length > 0 ? x.join(" ") : void 0,
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
  return await de(t, n, (s, o) => {
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
function vt(t = "public", n = "public") {
  const e = new it(t, n), a = { userType: "registered", sessionId: n };
  return {
    async getBoards() {
      const s = await dt(e, a), o = {
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
      const o = await ft(
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
      }), Y("boards-updated", { sessionId: J, userType: t }), o.board;
    },
    async deleteBoard(s) {
      await mt(
        e,
        a,
        s
      ), await e.deleteBoardData(t, n, s), Y("boards-updated", { sessionId: J, userType: t });
    },
    async getTasks(s = "main") {
      return e.getTasks(t, n, s);
    },
    async getStats(s = "main") {
      return e.getStats(t, n, s);
    },
    async createTask(s, o = "main", r = !1) {
      console.log("[localStorageApi] createTask (using handler)", { data: s, boardId: o, suppressBroadcast: r });
      const l = await ut(
        e,
        a,
        s,
        o
      ), c = (await e.getTasks(t, n, o)).tasks.find((u) => u.id === l.id);
      if (!c)
        throw new Error("Task creation failed - task not found after creation");
      return r ? console.log("[localStorageApi] createTask: broadcast suppressed") : (console.log("[localStorageApi] createTask: broadcasting", {
        sessionId: J,
        boardId: o,
        taskId: l.id
      }), Y("tasks-updated", { sessionId: J, userType: t, boardId: o })), c;
    },
    async patchTask(s, o, r = "main", l = !1) {
      const d = {};
      o.title !== void 0 && (d.title = o.title), o.tag !== void 0 && o.tag !== null && (d.tag = o.tag), await gt(
        e,
        a,
        s,
        d,
        r
      ), l || Y("tasks-updated", { sessionId: J, userType: t, boardId: r });
      const u = (await e.getTasks(t, n, r)).tasks.find((h) => h.id === s);
      if (!u)
        throw new Error("Task not found after update");
      return u;
    },
    async completeTask(s, o = "main") {
      const l = (await e.getTasks(t, n, o)).tasks.find((d) => d.id === s);
      if (!l)
        throw new Error("Task not found");
      return await ht(
        e,
        a,
        s,
        o
      ), Y("tasks-updated", { sessionId: J, userType: t, boardId: o }), {
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
      return await pt(
        e,
        a,
        s,
        o
      ), r ? console.log("[localStorageApi] deleteTask: broadcast suppressed") : (console.log("[localStorageApi] deleteTask: broadcasting", { sessionId: J }), Y("tasks-updated", { sessionId: J, userType: t, boardId: o })), {
        ...d,
        state: "Deleted",
        closedAt: (/* @__PURE__ */ new Date()).toISOString(),
        updatedAt: (/* @__PURE__ */ new Date()).toISOString()
      };
    },
    async createTag(s, o = "main") {
      await kt(
        e,
        a,
        { boardId: o, tag: s }
      ), Y("boards-updated", { sessionId: J, userType: t, boardId: o });
    },
    async deleteTag(s, o = "main") {
      await Tt(
        e,
        a,
        { boardId: o, tag: s }
      ), Y("boards-updated", { sessionId: J, userType: t, boardId: o });
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
      const l = await this.getBoards(), d = l.boards.find((w) => w.id === s), c = l.boards.find((w) => w.id === o);
      if (!d)
        throw new Error(`Source board ${s} not found`);
      if (!c)
        throw new Error(`Target board ${o} not found`);
      const u = d.tasks.filter((w) => r.includes(w.id));
      d.tasks = d.tasks.filter((w) => !r.includes(w.id)), c.tasks = [...c.tasks, ...u], l.updatedAt = (/* @__PURE__ */ new Date()).toISOString();
      const h = `${t}-${n}-boards`;
      localStorage.setItem(h, JSON.stringify(l));
      const p = `${t}-${n}-${s}-tasks`, x = `${t}-${n}-${o}-tasks`;
      return localStorage.setItem(p, JSON.stringify({
        version: 1,
        updatedAt: l.updatedAt,
        tasks: d.tasks
      })), localStorage.setItem(x, JSON.stringify({
        version: 1,
        updatedAt: l.updatedAt,
        tasks: c.tasks
      })), Y("boards-updated", { sessionId: J, userType: t }), { ok: !0, moved: u.length };
    },
    async batchUpdateTags(s, o) {
      console.log("[localStorageApi] batchUpdateTags", { boardId: s, updates: o }), await yt(
        e,
        a,
        { boardId: s, updates: o }
      ), Y("tasks-updated", { sessionId: J, userType: t, boardId: s });
    },
    async batchClearTag(s, o, r) {
      console.log("[localStorageApi] batchClearTag START", { boardId: s, tag: o, taskIds: r, taskCount: r.length });
      const l = await wt(
        e,
        a,
        { boardId: s, tag: o, taskIds: r }
      );
      console.log("[localStorageApi] batchClearTag result:", l), Y("boards-updated", { sessionId: J, userType: t, boardId: s }), console.log("[localStorageApi] batchClearTag END");
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
async function bt(t, n, e, a) {
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
function ce(t = "public", n = "public") {
  const e = vt(t, n);
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
        console.log("[api] Synced from API:", { boards: s.boards.length, totalTasks: s.boards.reduce((o, r) => o + (r.tasks?.length || 0), 0) }), await bt(e, s, t, n);
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
      if (t !== "public")
        try {
          const a = await fetch("/task/api/preferences", {
            headers: j(t, n)
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
        headers: j(t, n),
        body: JSON.stringify(a)
      }).then(() => console.log("[api] Background sync: savePreferences completed")).catch((s) => console.error("[api] Failed to sync savePreferences:", s));
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
function St(t) {
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
function Ct(t, n = 6, e = []) {
  const a = t.flatMap((o) => o.tag?.split(" ") || []).filter(Boolean), s = {};
  return a.forEach((o) => s[o] = (s[o] || 0) + 1), e.filter(Boolean).forEach((o) => {
    s[o] || (s[o] = 0);
  }), Object.entries(s).sort((o, r) => r[1] - o[1]).slice(0, n).map(([o]) => o);
}
function be(t, n) {
  return t.filter((e) => e.tag?.split(" ").includes(n));
}
function xt(t, n, e) {
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
      const d = new Set(l);
      return d.delete(t), d;
    });
  }
}
function le(t, n) {
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
function Dt({ userType: t, sessionId: n }) {
  const [e, a] = A([]), [s, o] = A(/* @__PURE__ */ new Set()), r = $e(
    () => ce(t, n || "public"),
    [t, n]
  ), [l, d] = A(null), [c, u] = A("main");
  async function h() {
    console.log("[useTasks] initialLoad called"), "syncFromApi" in r && await r.syncFromApi(), await p();
  }
  async function p() {
    console.log("[useTasks] reload called", { currentBoardId: c, stack: new Error().stack?.split(`
`).slice(1, 4).join(`
`) });
    const m = await r.getBoards();
    d(m);
    const { tasks: v } = le(m, c);
    a(v);
  }
  Q(() => {
    console.log("[useTasks] User context changed, clearing state and reloading", { userType: t, sessionId: n }), a([]), o(/* @__PURE__ */ new Set()), d(null), u("main"), p();
  }, [t, n]), Q(() => {
    console.log("[useTasks] Setting up BroadcastChannel listener", { currentBoardId: c, userType: t, sessionId: n });
    try {
      const m = new BroadcastChannel("tasks");
      return m.onmessage = (v) => {
        const b = v.data || {};
        if (console.log("[useTasks] BroadcastChannel message received", { msg: b, sessionId: J, currentBoardId: c, currentContext: { userType: t, sessionId: n } }), b.sessionId === J) {
          console.log("[useTasks] Ignoring own broadcast message");
          return;
        }
        if (b.userType !== t || b.sessionId !== n) {
          console.log("[useTasks] Ignoring message for different user context", {
            msgContext: { userType: b.userType, sessionId: b.sessionId },
            currentContext: { userType: t, sessionId: n }
          });
          return;
        }
        (b.type === "tasks-updated" || b.type === "boards-updated") && (console.log("[useTasks] BroadcastChannel: triggering reload for currentBoardId =", c), p());
      }, () => {
        console.log("[useTasks] Cleaning up BroadcastChannel listener", { currentBoardId: c }), m.close();
      };
    } catch (m) {
      console.error("[useTasks] Failed to setup BroadcastChannel", m);
    }
  }, [c, t, n]);
  async function x(m) {
    if (m = m.trim(), !!m)
      try {
        const v = St(m);
        return await r.createTask(v, c), await p(), !0;
      } catch (v) {
        return alert(v.message || "Failed to create task"), !1;
      }
  }
  async function w(m) {
    await Se(
      `complete-${m}`,
      s,
      o,
      async () => {
        await r.completeTask(m, c), await p();
      },
      {
        onError: (v) => alert(v.message || "Failed to complete task")
      }
    );
  }
  async function N(m) {
    console.log("[useTasks] deleteTask START", { taskId: m, currentBoardId: c }), await Se(
      `delete-${m}`,
      s,
      o,
      async () => {
        console.log("[useTasks] deleteTask: calling api.deleteTask", { taskId: m, currentBoardId: c }), await r.deleteTask(m, c), console.log("[useTasks] deleteTask: calling reload"), await p(), console.log("[useTasks] deleteTask END");
      },
      {
        onError: (v) => alert(v.message || "Failed to delete task")
      }
    );
  }
  async function W(m) {
    const v = prompt("Enter tag (without #):");
    if (!v) return;
    const b = v.trim().replace(/^#+/, "").replace(/\s+/g, "-"), f = e.find((B) => B.id === m);
    if (!f) return;
    const T = f.tag?.split(" ") || [];
    if (T.includes(b)) return;
    const C = [...T, b].join(" ");
    try {
      await r.patchTask(m, { tag: C }, c), await p();
    } catch (B) {
      alert(B.message || "Failed to add tag");
    }
  }
  async function F(m, v, b = {}) {
    const { suppressBroadcast: f = !1, skipReload: T = !1 } = b;
    try {
      await r.patchTask(m, v, c, f), T || await p();
    } catch (C) {
      throw C;
    }
  }
  async function U(m) {
    console.log("[useTasks] bulkUpdateTaskTags START", { count: m.length });
    try {
      await r.batchUpdateTags(
        c,
        m.map((v) => ({ taskId: v.taskId, tag: v.tag || null }))
      ), console.log("[useTasks] bulkUpdateTaskTags: calling reload"), await p(), console.log("[useTasks] bulkUpdateTaskTags END");
    } catch (v) {
      throw console.error("[useTasks] bulkUpdateTaskTags ERROR", v), v;
    }
  }
  async function V(m) {
    console.log("[useTasks] deleteTag START", { tag: m, currentBoardId: c, taskCount: e.length });
    const v = e.filter((b) => b.tag?.split(" ").includes(m));
    if (console.log("[useTasks] deleteTag: found tasks with tag", { tag: m, count: v.length }), v.length === 0) {
      console.log("[useTasks] deleteTag: no tasks found with this tag, just deleting tag");
      try {
        await r.deleteTag(m, c), await p(), console.log("[useTasks] deleteTag END (no tasks to clear)");
      } catch (b) {
        console.error("[useTasks] deleteTag ERROR", b), console.error("[useTasks] deleteTag: Please fix this error:", b.message);
      }
      return;
    }
    try {
      console.log("[useTasks] deleteTag: starting batch clear"), await r.batchClearTag(
        c,
        m,
        v.map((b) => b.id)
      ), console.log("[useTasks] deleteTag: calling reload"), await p(), console.log("[useTasks] deleteTag END");
    } catch (b) {
      console.error("[useTasks] deleteTag ERROR", b), alert(b.message || "Failed to remove tag from tasks");
    }
  }
  async function H(m) {
    await r.createBoard(m), u(m);
    const v = await r.getBoards();
    d(v);
    const { tasks: b } = le(v, m);
    a(b);
  }
  async function z(m, v) {
    if (console.log("[useTasks] moveTasksToBoard START", { targetBoardId: m, ids: v, currentBoardId: c }), !l) return;
    const b = /* @__PURE__ */ new Set();
    for (const f of l.boards)
      for (const T of f.tasks || [])
        v.includes(T.id) && b.add(f.id);
    console.log("[useTasks] moveTasksToBoard: source boards", { sourceBoardIds: Array.from(b) });
    try {
      if (b.size === 1) {
        const C = Array.from(b)[0];
        console.log("[useTasks] moveTasksToBoard: using batch API"), await r.batchMoveTasks(C, m, v);
      } else
        throw console.error("[useTasks] moveTasksToBoard: Cannot move tasks from multiple boards at once"), new Error("Cannot move tasks from multiple boards at once");
      console.log("[useTasks] moveTasksToBoard: switching to target board", { targetBoardId: m }), u(m);
      const f = await r.getBoards();
      d(f);
      const { tasks: T } = le(f, m);
      a(T), console.log("[useTasks] moveTasksToBoard END");
    } catch (f) {
      console.error("[useTasks] moveTasksToBoard ERROR", f), alert(f.message || "Failed to move tasks");
    }
  }
  async function X(m) {
    if (await r.deleteBoard(m), c === m) {
      u("main");
      const v = await r.getBoards();
      d(v);
      const { tasks: b } = le(v, "main");
      a(b);
    } else
      await p();
  }
  async function ne(m) {
    await r.createTag(m, c), await p();
  }
  async function te(m) {
    await r.deleteTag(m, c), await p();
  }
  function G(m) {
    u(m);
    const { tasks: v, foundBoard: b } = le(l, m);
    b ? a(v) : p();
  }
  return {
    // Task state
    tasks: e,
    pendingOperations: s,
    // Task operations
    addTask: x,
    completeTask: w,
    deleteTask: N,
    addTagToTask: W,
    updateTaskTags: F,
    bulkUpdateTaskTags: U,
    deleteTag: V,
    // Board state
    boards: l,
    currentBoardId: c,
    // Board operations
    createBoard: H,
    deleteBoard: X,
    switchBoard: G,
    moveTasksToBoard: z,
    createTagOnBoard: ne,
    deleteTagOnBoard: te,
    // Lifecycle
    initialLoad: h,
    reload: p
  };
}
function Bt({ tasks: t, onTaskUpdate: n, onBulkUpdate: e }) {
  const [a, s] = A(null), [o, r] = A(null), [l, d] = A(/* @__PURE__ */ new Set()), [c, u] = A(!1), [h, p] = A(null), [x, w] = A(null), N = he(null);
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
  function F(f, T) {
    const C = l.has(T) && l.size > 0 ? Array.from(l) : [T];
    console.log("[useDragAndDrop] onDragStart", { taskId: T, idsToDrag: C, selectedCount: l.size }), f.dataTransfer.setData("text/plain", C[0]);
    try {
      f.dataTransfer.setData("application/x-hadoku-task-ids", JSON.stringify(C));
    } catch {
    }
    f.dataTransfer.effectAllowed = "copyMove";
    try {
      const B = f.currentTarget, M = B.closest && B.closest(".task-app__item") ? B.closest(".task-app__item") : B;
      M.classList.add("dragging");
      const D = M.cloneNode(!0);
      D.style.boxSizing = "border-box", D.style.width = `${M.offsetWidth}px`, D.style.height = `${M.offsetHeight}px`, D.style.opacity = "0.95", D.style.transform = "none", D.style.filter = "drop-shadow(0 6px 18px rgba(0,0,0,0.12))", D.classList.add("drag-image"), D.style.position = "absolute", D.style.top = "-9999px", D.style.left = "-9999px", document.body.appendChild(D), M.__dragImage = D, d((O) => {
        if (O.has(T)) return new Set(O);
        const P = new Set(O);
        return P.add(T), P;
      });
      try {
        const O = M.closest(".task-app__tag-column");
        if (O) {
          const P = O.querySelector(".task-app__tag-header") || O.querySelector("h3"), $ = (P && P.textContent || "").trim().replace(/^#/, "");
          if ($)
            try {
              f.dataTransfer.setData("application/x-hadoku-task-source", $);
            } catch {
            }
        }
      } catch {
      }
      try {
        const O = M.getBoundingClientRect();
        let P = Math.round(f.clientX - O.left), y = Math.round(f.clientY - O.top);
        P = Math.max(0, Math.min(Math.round(D.offsetWidth - 1), P)), y = Math.max(0, Math.min(Math.round(D.offsetHeight - 1), y)), f.dataTransfer.setDragImage(D, P, y);
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
  function V(f) {
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
    const T = N.current.x, C = N.current.y, B = f.clientX, M = f.clientY, D = Math.min(T, B), O = Math.min(C, M), P = Math.abs(B - T), y = Math.abs(M - C);
    p({ x: D, y: O, w: P, h: y });
    const $ = Array.from(document.querySelectorAll(".task-app__item")), L = /* @__PURE__ */ new Set();
    for (const K of $) {
      const Z = K.getBoundingClientRect();
      if (!(Z.right < D || Z.left > D + P || Z.bottom < O || Z.top > O + y)) {
        const re = K.getAttribute("data-task-id");
        re && L.add(re), K.classList.add("selected");
      } else
        K.classList.remove("selected");
    }
    d(L);
  }
  function z(f) {
    u(!1), p(null), N.current = null;
    try {
      document.body.classList.remove("marquee-selecting");
    } catch {
    }
    try {
      w(Date.now());
    } catch {
    }
  }
  function X() {
    d(/* @__PURE__ */ new Set()), Array.from(document.querySelectorAll(".task-app__item.selected")).forEach((T) => T.classList.remove("selected"));
  }
  Q(() => {
    function f(B) {
      if (B.button !== 0) return;
      const M = { target: B.target, clientX: B.clientX, clientY: B.clientY, button: B.button };
      try {
        V(M);
      } catch {
      }
    }
    function T(B) {
      const M = { clientX: B.clientX, clientY: B.clientY };
      try {
        H(M);
      } catch {
      }
    }
    function C(B) {
      const M = { clientX: B.clientX, clientY: B.clientY };
      try {
        z(M);
      } catch {
      }
    }
    return document.addEventListener("mousedown", f), document.addEventListener("mousemove", T), document.addEventListener("mouseup", C), () => {
      document.removeEventListener("mousedown", f), document.removeEventListener("mousemove", T), document.removeEventListener("mouseup", C);
    };
  }, []);
  function ne(f, T) {
    f.preventDefault(), f.dataTransfer.dropEffect = "copy", s(T);
  }
  function te(f) {
    f.currentTarget.contains(f.relatedTarget) || s(null);
  }
  async function G(f, T) {
    f.preventDefault(), s(null), console.log("[useDragAndDrop] onDrop START", { targetTag: T });
    const C = W(f);
    if (C.length === 0) return;
    let B = null;
    try {
      const D = f.dataTransfer.getData("application/x-hadoku-task-source");
      D && (B = D);
    } catch {
    }
    console.log("[useDragAndDrop] onDrop: processing", { targetTag: T, ids: C, srcTag: B, taskCount: C.length });
    const M = [];
    for (const D of C) {
      const O = t.find((K) => K.id === D);
      if (!O) continue;
      const P = O.tag?.split(" ").filter(Boolean) || [];
      if (T === "other") {
        if (P.length === 0) continue;
        M.push({ taskId: D, tag: "" });
        continue;
      }
      const y = P.includes(T);
      let $ = P.slice();
      y || $.push(T), B && B !== T && ($ = $.filter((K) => K !== B));
      const L = $.join(" ").trim();
      M.push({ taskId: D, tag: L });
    }
    console.log("[useDragAndDrop] onDrop: updating tasks", { updateCount: M.length });
    try {
      await e(M), console.log("[useDragAndDrop] onDrop: updates complete, clearing selection");
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
  function v(f) {
    f.currentTarget.contains(f.relatedTarget) || r(null);
  }
  async function b(f, T) {
    f.preventDefault(), r(null);
    const C = W(f);
    if (C.length === 0) return;
    console.log("[useDragAndDrop] onFilterDrop", { filterTag: T, ids: C, taskCount: C.length });
    const B = [];
    for (const M of C) {
      const D = t.find((y) => y.id === M);
      if (!D) continue;
      const O = D.tag?.split(" ").filter(Boolean) || [];
      if (O.includes(T)) {
        console.log(`Task ${M} already has tag: ${T}`);
        continue;
      }
      const P = [...O, T].join(" ");
      B.push({ taskId: M, tag: P });
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
    marqueeRect: h,
    selectionJustEndedAt: x,
    // selection handlers
    selectionStartHandler: V,
    selectionMoveHandler: H,
    selectionEndHandler: z,
    clearSelection: X,
    onDragStart: F,
    onDragEnd: U,
    onDragOver: ne,
    onDragLeave: te,
    onDrop: G,
    onFilterDragOver: m,
    onFilterDragLeave: v,
    onFilterDrop: b
  };
}
function Nt() {
  const [t, n] = A({});
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
const Ce = 5, At = 300, ge = "1.0", xe = "task-storage-version", Et = [
  /^tasks-/,
  // tasks-main, tasks-work
  /^stats-/,
  // stats-main, stats-work
  /^boards$/,
  // boards (without prefix)
  /^preferences$/
  // preferences (without prefix)
], Mt = {
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
  e !== ge && (console.log("[Preferences] Storage version mismatch, cleaning up orphaned keys", {
    current: e,
    expected: ge
  }), Object.keys(window.localStorage).forEach((a) => {
    const s = Et.some((r) => r.test(a)), o = a.includes(`${t}-${n}`);
    s && !o && (console.log("[Preferences] Removing orphaned key:", a), window.localStorage.removeItem(a));
  }), window.localStorage.setItem(xe, ge), console.log("[Preferences] Storage upgraded to version", ge));
}
function It(t) {
  try {
    const n = sessionStorage.getItem("theme"), e = sessionStorage.getItem("showCompleteButton"), a = sessionStorage.getItem("showDeleteButton"), s = sessionStorage.getItem("showTagButton"), o = {};
    return n && !t.theme && (o.theme = n), e !== null && t.showCompleteButton === void 0 && (o.showCompleteButton = e === "true"), a !== null && t.showDeleteButton === void 0 && (o.showDeleteButton = a === "true"), s !== null && t.showTagButton === void 0 && (o.showTagButton = s === "true"), Object.keys(o).length > 0 ? (console.log("[Preferences] Migrating settings from sessionStorage to localStorage:", o), sessionStorage.removeItem("theme"), sessionStorage.removeItem("showCompleteButton"), sessionStorage.removeItem("showDeleteButton"), sessionStorage.removeItem("showTagButton"), o) : null;
  } catch (n) {
    return console.warn("[Preferences] Failed to migrate settings:", n), null;
  }
}
function Ot(t, n, e = !1) {
  const [a, s] = A(Mt), [o, r] = A(!1);
  Q(() => {
    if (e) {
      r(!0);
      return;
    }
    (async () => {
      _t(t, n), console.log("[usePreferences] Loading preferences...", { userType: t, sessionId: n });
      const u = ce(t, n), h = await u.getPreferences();
      if (console.log("[usePreferences] Loaded preferences:", h), h) {
        const p = It(h);
        if (p) {
          const x = { ...h, ...p, updatedAt: (/* @__PURE__ */ new Date()).toISOString() };
          s(x), await u.savePreferences(x), console.log("[usePreferences] Applied and saved migrations");
        } else
          s(h), console.log("[usePreferences] Applied preferences to state");
      }
      r(!0);
    })();
  }, [t, n, e]);
  const l = async (c) => {
    const u = { ...a, ...c, updatedAt: (/* @__PURE__ */ new Date()).toISOString() };
    s(u), await ce(t, n).savePreferences(u);
  }, d = a.theme?.endsWith("-dark") || a.theme === "dark";
  return {
    preferences: a,
    savePreferences: l,
    preferencesLoaded: o,
    isDarkTheme: d,
    setPreferences: s
  };
}
const ee = {
  width: 20,
  height: 20,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round"
}, Lt = () => /* @__PURE__ */ k("svg", { ...ee, children: [
  /* @__PURE__ */ i("circle", { cx: "12", cy: "12", r: "5" }),
  /* @__PURE__ */ i("line", { x1: "12", y1: "1", x2: "12", y2: "3" }),
  /* @__PURE__ */ i("line", { x1: "12", y1: "21", x2: "12", y2: "23" }),
  /* @__PURE__ */ i("line", { x1: "4.22", y1: "4.22", x2: "5.64", y2: "5.64" }),
  /* @__PURE__ */ i("line", { x1: "18.36", y1: "18.36", x2: "19.78", y2: "19.78" }),
  /* @__PURE__ */ i("line", { x1: "1", y1: "12", x2: "3", y2: "12" }),
  /* @__PURE__ */ i("line", { x1: "21", y1: "12", x2: "23", y2: "12" }),
  /* @__PURE__ */ i("line", { x1: "4.22", y1: "19.78", x2: "5.64", y2: "18.36" }),
  /* @__PURE__ */ i("line", { x1: "18.36", y1: "5.64", x2: "19.78", y2: "4.22" })
] }), Ue = () => /* @__PURE__ */ i("svg", { ...ee, children: /* @__PURE__ */ i("path", { d: "M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" }) }), De = () => /* @__PURE__ */ k("svg", { ...ee, children: [
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
] }), Be = () => /* @__PURE__ */ k("svg", { ...ee, children: [
  /* @__PURE__ */ i("path", { d: "M2 12c2-2 4-2 6 0s4 2 6 0 4-2 6 0" }),
  /* @__PURE__ */ i("path", { d: "M2 17c2-2 4-2 6 0s4 2 6 0 4-2 6 0" }),
  /* @__PURE__ */ i("path", { d: "M2 7c2-2 4-2 6 0s4 2 6 0 4-2 6 0" })
] }), Ne = () => /* @__PURE__ */ i("svg", { ...ee, children: /* @__PURE__ */ i("polygon", { points: "13 2 3 14 12 14 11 22 21 10 12 10 13 2" }) }), Ae = () => /* @__PURE__ */ k("svg", { ...ee, children: [
  /* @__PURE__ */ i("path", { d: "M18 8h1a4 4 0 0 1 0 8h-1" }),
  /* @__PURE__ */ i("path", { d: "M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" }),
  /* @__PURE__ */ i("line", { x1: "6", y1: "1", x2: "6", y2: "4" }),
  /* @__PURE__ */ i("line", { x1: "10", y1: "1", x2: "10", y2: "4" }),
  /* @__PURE__ */ i("line", { x1: "14", y1: "1", x2: "14", y2: "4" })
] }), Ee = () => /* @__PURE__ */ k("svg", { ...ee, children: [
  /* @__PURE__ */ i("circle", { cx: "12", cy: "12", r: "2", fill: "currentColor" }),
  /* @__PURE__ */ i("circle", { cx: "12", cy: "6", r: "2.5", fill: "none", stroke: "currentColor", strokeWidth: "2" }),
  /* @__PURE__ */ i("circle", { cx: "18", cy: "10", r: "2.5", fill: "none", stroke: "currentColor", strokeWidth: "2" }),
  /* @__PURE__ */ i("circle", { cx: "16", cy: "16", r: "2.5", fill: "none", stroke: "currentColor", strokeWidth: "2" }),
  /* @__PURE__ */ i("circle", { cx: "8", cy: "16", r: "2.5", fill: "none", stroke: "currentColor", strokeWidth: "2" }),
  /* @__PURE__ */ i("circle", { cx: "6", cy: "10", r: "2.5", fill: "none", stroke: "currentColor", strokeWidth: "2" })
] }), Me = () => /* @__PURE__ */ i("svg", { ...ee, children: /* @__PURE__ */ i("path", { d: "M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z", fill: "currentColor" }) }), Pt = () => /* @__PURE__ */ k("svg", { ...ee, children: [
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
] }), $t = () => /* @__PURE__ */ k("svg", { ...ee, width: 16, height: 16, viewBox: "0 0 20 20", children: [
  /* @__PURE__ */ i(
    "path",
    {
      d: "M2 4 L12 4 L16 10 L12 16 L2 16 Z",
      fill: "currentColor"
    }
  ),
  /* @__PURE__ */ i("circle", { cx: "6", cy: "10", r: "1.5", fill: "white" })
] }), _e = [
  {
    lightIcon: /* @__PURE__ */ i(Lt, {}),
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
], Ft = [
  {
    lightIcon: /* @__PURE__ */ i(Me, {}),
    darkIcon: /* @__PURE__ */ i(Me, {}),
    lightTheme: "pink-light",
    darkTheme: "pink-dark",
    lightLabel: "Pink Light",
    darkLabel: "Pink Dark"
  }
];
function He(t) {
  return t ? [..._e, ...Ft] : _e;
}
function Rt(t, n) {
  const a = He(n).find(
    (s) => s.lightTheme === t || s.darkTheme === t
  );
  return a ? t.endsWith("-dark") || t === "dark" ? a.darkIcon : a.lightIcon : /* @__PURE__ */ i(Ue, {});
}
function Kt(t, n, e) {
  const [a, s] = A(!1), o = t.theme || "light", r = (d) => n({ theme: d }), l = $e(
    () => He(t.experimentalThemes || !1),
    [t.experimentalThemes]
  );
  return Q(() => {
    e.current && e.current.setAttribute("data-theme", o);
  }, [o, e]), Q(() => {
    const d = window.matchMedia("(prefers-color-scheme: dark)"), c = (u) => {
      const h = u.matches, p = o.replace(/-light$|-dark$/, ""), x = o.endsWith("-dark") ? "dark" : o.endsWith("-light") ? "light" : null;
      if (x && p !== "light" && p !== "dark") {
        const w = h ? "dark" : "light";
        if (x !== w) {
          const N = `${p}-${w}`;
          console.log(`[Theme] Auto-switching from ${o} to ${N} (system preference)`), r(N);
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
function Ie(t, n, e, a) {
  Q(() => {
    if (!n) return;
    const s = (o) => {
      const r = o.target;
      t.current && t.current.contains(r) || a && r.closest(a) || e();
    };
    return document.addEventListener("mousedown", s), () => document.removeEventListener("mousedown", s);
  }, [t, n, e, a]);
}
function Ut() {
  const [t, n] = A(null), [e, a] = A(!1), [s, o] = A(!1), [r, l] = A(!1), [d, c] = A(null), [u, h] = A(""), [p, x] = A(null), [w, N] = A(null), [W, F] = A(""), [U, V] = A(null), [H, z] = A(null);
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
    setBoardContextMenu: x,
    tagContextMenu: w,
    setTagContextMenu: N,
    inputValue: W,
    setInputValue: F,
    validationError: U,
    setValidationError: V,
    pendingTaskOperation: H,
    setPendingTaskOperation: z
  };
}
const Oe = 768;
function Ht() {
  const [t, n] = A(() => typeof window > "u" ? !1 : window.innerWidth < Oe);
  return Q(() => {
    if (typeof window > "u") return;
    const e = window.matchMedia(`(max-width: ${Oe - 1}px)`), a = (s) => {
      n(s.matches);
    };
    return e.addEventListener ? e.addEventListener("change", a) : e.addListener(a), a(e), () => {
      e.removeEventListener ? e.removeEventListener("change", a) : e.removeListener(a);
    };
  }, []), t;
}
function Jt({ isDarkTheme: t }) {
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
function Wt({
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
          children: Rt(t, n)
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
                children: /* @__PURE__ */ i(Pt, {})
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
function jt({
  board: t,
  isActive: n,
  isDragOver: e,
  onSwitch: a,
  onContextMenu: s,
  onDragOverFilter: o,
  onMoveTasksToBoard: r,
  onClearSelection: l
}) {
  const d = Je({
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
        const h = we(u.dataTransfer);
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
function Vt({
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
  const [p, x] = A(!1), w = t && t.boards ? t.boards.slice(0, Ce) : [{ id: "main", name: "main", tasks: [], tags: [] }], N = !t || t.boards && t.boards.length < Ce, W = async (F) => {
    if (p) return;
    console.log("[BoardsSection] Manual refresh triggered"), x(!0);
    const U = F.currentTarget, V = new Promise((H, z) => {
      setTimeout(() => z(new Error("Sync timeout")), 5e3);
    });
    try {
      await Promise.race([h(), V]), console.log("[BoardsSection] Sync completed successfully");
    } catch (H) {
      console.error("[BoardsSection] Sync failed:", H);
    } finally {
      x(!1), U?.blur();
    }
  };
  return /* @__PURE__ */ k("div", { className: "task-app__boards", children: [
    /* @__PURE__ */ i("div", { className: "task-app__board-list", children: w.map((F) => /* @__PURE__ */ i(
      jt,
      {
        board: F,
        isActive: n === F.id,
        isDragOver: a === `board:${F.id}`,
        onSwitch: s,
        onContextMenu: o,
        onDragOverFilter: r,
        onMoveTasksToBoard: l,
        onClearSelection: d
      },
      F.id
    )) }),
    /* @__PURE__ */ k("div", { className: "task-app__board-actions", children: [
      N && /* @__PURE__ */ i(
        "button",
        {
          className: `board-add-btn ${a === "add-board" ? "board-btn--drag-over" : ""}`,
          onClick: c,
          onDragOver: (F) => {
            F.preventDefault(), F.dataTransfer.dropEffect = "move", r("add-board");
          },
          onDragLeave: () => r(null),
          onDrop: (F) => {
            F.preventDefault(), r(null);
            const U = we(F.dataTransfer);
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
function zt({
  tag: t,
  isActive: n,
  isDragOver: e,
  onToggle: a,
  onContextMenu: s,
  onDragOver: o,
  onDragLeave: r,
  onDrop: l
}) {
  const d = Je({
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
function Xt({
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
    const p = we(h.dataTransfer);
    p.length > 0 && (c({ type: "apply-tag", taskIds: p }), d());
  };
  return /* @__PURE__ */ k("div", { className: "task-app__filters", children: [
    t.map((h) => /* @__PURE__ */ i(
      zt,
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
function qt(t) {
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
  showTagButton: h = !1
}) {
  const p = e.has(`complete-${t.id}`), x = e.has(`delete-${t.id}`);
  return /* @__PURE__ */ k(
    "li",
    {
      className: `task-app__item ${d ? "selected" : ""}`,
      "data-task-id": t.id,
      draggable: n,
      onDragStart: r ? (w) => r(w, t.id) : void 0,
      onDragEnd: (w) => {
        if (w.currentTarget.classList.remove("dragging"), l)
          try {
            l(w);
          } catch {
          }
      },
      children: [
        /* @__PURE__ */ k("div", { className: "task-app__item-content", children: [
          /* @__PURE__ */ i("div", { className: "task-app__item-title", title: t.title, children: t.title }),
          /* @__PURE__ */ k("div", { className: "task-app__item-meta-row", children: [
            t.tag ? /* @__PURE__ */ i("div", { className: "task-app__item-tag", children: t.tag.split(" ").sort().map((w) => `#${w}`).join(" ") }) : /* @__PURE__ */ i("div", {}),
            /* @__PURE__ */ i("div", { className: "task-app__item-age", children: qt(t.createdAt) })
          ] })
        ] }),
        /* @__PURE__ */ k("div", { className: "task-app__item-actions", children: [
          h && /* @__PURE__ */ i(
            "button",
            {
              className: "task-app__action-btn task-app__edit-tag-btn",
              onClick: () => o(t.id),
              title: "Edit tags",
              disabled: p || x,
              children: /* @__PURE__ */ i($t, {})
            }
          ),
          c && /* @__PURE__ */ i(
            "button",
            {
              className: "task-app__action-btn task-app__complete-btn",
              onClick: () => a(t.id),
              title: "Complete task",
              disabled: p || x,
              children: p ? "⏳" : "✓"
            }
          ),
          u && /* @__PURE__ */ i(
            "button",
            {
              className: "task-app__action-btn task-app__delete-btn",
              onClick: () => s(t.id),
              title: "Delete task",
              disabled: p || x,
              children: x ? "⏳" : "×"
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
function Yt({
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
  onSelectionStart: x,
  onSelectionMove: w,
  onSelectionEnd: N,
  onDragOver: W,
  onDragLeave: F,
  onDrop: U,
  toggleSort: V,
  sortTasksByAge: H,
  getSortIcon: z,
  getSortTitle: X,
  deleteTag: ne,
  onDeletePersistedTag: te,
  showCompleteButton: G = !0,
  showDeleteButton: m = !0,
  showTagButton: v = !1
}) {
  const b = (y, $) => /* @__PURE__ */ k(
    "div",
    {
      className: `task-app__tag-column ${o === y ? "task-app__tag-column--drag-over" : ""}`,
      onDragOver: (L) => W(L, y),
      onDragLeave: F,
      onDrop: (L) => U(L, y),
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
              onClick: () => V(y),
              title: X(s[y] || "desc"),
              children: z(s[y] || "desc")
            }
          )
        ] }),
        /* @__PURE__ */ i("ul", { className: "task-app__list task-app__list--column", children: H($, s[y] || "desc").map((L) => /* @__PURE__ */ i(
          ke,
          {
            task: L,
            isDraggable: !0,
            pendingOperations: r,
            onComplete: l,
            onDelete: d,
            onEditTag: c,
            onDragStart: u,
            onDragEnd: h,
            selected: p ? p.has(L.id) : !1,
            showCompleteButton: G,
            showDeleteButton: m,
            showTagButton: v
          },
          L.id
        )) })
      ]
    },
    y
  ), f = (y, $) => {
    let L = be(t, y);
    return C && (L = L.filter((K) => {
      const Z = K.tag?.split(" ") || [];
      return a.some((oe) => Z.includes(oe));
    })), L.slice(0, $);
  }, T = n.length, C = Array.isArray(a) && a.length > 0, B = t.filter((y) => {
    if (!C) return !0;
    const $ = y.tag?.split(" ") || [];
    return a.some((L) => $.includes(L));
  }), M = Le(T, e), D = C ? n.filter((y) => be(t, y).some((L) => {
    const K = L.tag?.split(" ") || [];
    return a.some((Z) => K.includes(Z));
  })) : n.slice(0, M.useTags);
  if (D.length === 0)
    return /* @__PURE__ */ i("ul", { className: "task-app__list", children: B.map((y) => /* @__PURE__ */ i(
      ke,
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
        showDeleteButton: m,
        showTagButton: v
      },
      y.id
    )) });
  const O = xt(t, n, a).filter((y) => {
    if (!C) return !0;
    const $ = y.tag?.split(" ") || [];
    return a.some((L) => $.includes(L));
  }), P = Le(D.length, e);
  return /* @__PURE__ */ k("div", { className: "task-app__dynamic-layout", children: [
    P.rows.length > 0 && /* @__PURE__ */ i(nt, { children: P.rows.map((y, $) => /* @__PURE__ */ i("div", { className: `task-app__tag-grid task-app__tag-grid--${y.columns}col`, children: y.tagIndices.map((L) => {
      const K = D[L];
      return K ? b(K, f(K, P.maxPerColumn)) : null;
    }) }, $)) }),
    O.length > 0 && /* @__PURE__ */ k(
      "div",
      {
        className: `task-app__remaining ${o === "other" ? "task-app__tag-column--drag-over" : ""}`,
        onDragOver: (y) => {
          y.preventDefault(), y.dataTransfer.dropEffect = "move", W(y, "other");
        },
        onDragLeave: (y) => F(y),
        onDrop: (y) => U(y, "other"),
        children: [
          /* @__PURE__ */ k("div", { className: "task-app__tag-header-row", children: [
            /* @__PURE__ */ i("h3", { className: "task-app__remaining-header", children: "Other Tasks" }),
            /* @__PURE__ */ i(
              "button",
              {
                className: "task-app__sort-btn task-app__sort-btn--active",
                onClick: () => V("other"),
                title: X(s.other || "desc"),
                children: z(s.other || "desc")
              }
            )
          ] }),
          /* @__PURE__ */ i("ul", { className: "task-app__list", children: H(O, s.other || "desc").map((y) => /* @__PURE__ */ i(
            ke,
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
              showDeleteButton: m,
              showTagButton: v
            },
            y.id
          )) })
        ]
      }
    )
  ] });
}
function ue({
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
          onClick: (x) => x.stopPropagation(),
          children: [
            /* @__PURE__ */ i("h3", { children: n }),
            s,
            r && /* @__PURE__ */ i(
              "input",
              {
                type: "text",
                className: "modal-input",
                value: o || "",
                onChange: (x) => r(x.target.value),
                placeholder: l,
                autoFocus: !0,
                onKeyDown: (x) => {
                  x.key === "Enter" && !u && (x.preventDefault(), a()), x.key === "Escape" && (x.preventDefault(), e());
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
function Gt({ tag: t, count: n, isOpen: e, onClose: a, onConfirm: s }) {
  const o = async () => {
    t && (await s(t), a());
  };
  return /* @__PURE__ */ i(
    ue,
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
function Zt({
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
    ue,
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
function Qt({
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
  }, d = Ke(e);
  return /* @__PURE__ */ k(
    ue,
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
async function ea(t, n) {
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
function ta({
  isOpen: t,
  preferences: n,
  showCompleteButton: e,
  showDeleteButton: a,
  showTagButton: s,
  onClose: o,
  onSavePreferences: r,
  onValidateKey: l
}) {
  const [d, c] = A(""), [u, h] = A(null), [p, x] = A(!1), w = async () => {
    if (!d.trim() || p) return;
    x(!0), h(null);
    const N = await ea(d, l);
    N.success || (h(N.error || "Failed to validate key"), x(!1));
  };
  return /* @__PURE__ */ k(
    ue,
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
                  onChange: (N) => {
                    c(N.target.value), h(null);
                  },
                  onKeyDown: (N) => {
                    N.key === "Enter" && d && !p && w();
                  },
                  placeholder: "Enter authentication key",
                  disabled: p
                }
              ),
              d && /* @__PURE__ */ i(
                "button",
                {
                  className: "settings-field-button",
                  onClick: w,
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
function aa({
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
  const h = s?.boards?.find((w) => w.id === o)?.tags || [], p = e?.split(" ").filter(Boolean) || [], x = (w) => {
    w.key === "Enter" && (w.preventDefault(), l());
  };
  return /* @__PURE__ */ i(
    ue,
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
          /* @__PURE__ */ i("div", { className: "edit-tag-pills-container", children: [...h].sort().map((w) => {
            const N = p.includes(w);
            return /* @__PURE__ */ k(
              "button",
              {
                className: `edit-tag-pill ${N ? "active" : ""}`,
                onClick: () => c(w),
                type: "button",
                children: [
                  "#",
                  w
                ]
              },
              w
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
              onChange: (w) => d(w.target.value),
              onKeyDown: x,
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
function na({
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
function sa({
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
function oa() {
  return Pe[Math.floor(Math.random() * Pe.length)];
}
function ra(t, n) {
  const e = t.trim();
  return e ? n.map((s) => s.id.toLowerCase()).includes(e.toLowerCase()) ? `Board "${e}" already exists` : null : "Board name cannot be empty";
}
function ia(t = {}) {
  const { userType: n = "public", sessionId: e = "public" } = t, a = he(null), s = he(null), [o] = A(() => typeof window < "u" && window.matchMedia ? window.matchMedia("(prefers-color-scheme: dark)").matches : !1), r = Ht(), [l] = A(() => oa()), [d, c] = A(/* @__PURE__ */ new Set()), [u, h] = A(!1), [p, x] = A(() => n === "public" && (typeof window < "u" ? localStorage.getItem("currentSessionId") : null) || e), { preferences: w, savePreferences: N, preferencesLoaded: W, isDarkTheme: F, setPreferences: U } = Ot(n, p, !0), { theme: V, showThemePicker: H, setShowThemePicker: z, THEME_FAMILIES: X, setTheme: ne } = Kt(w, N, s), te = r || w.alwaysVerticalLayout || !1, G = w.showCompleteButton ?? !0, m = w.showDeleteButton ?? !0, v = w.showTagButton ?? !1, {
    tasks: b,
    pendingOperations: f,
    initialLoad: T,
    addTask: C,
    completeTask: B,
    deleteTask: M,
    updateTaskTags: D,
    bulkUpdateTaskTags: O,
    deleteTag: P,
    boards: y,
    currentBoardId: $,
    createBoard: L,
    deleteBoard: K,
    switchBoard: Z,
    moveTasksToBoard: oe,
    createTagOnBoard: re,
    deleteTagOnBoard: je
  } = Dt({ userType: n, sessionId: p }), _ = Bt({
    tasks: b,
    onTaskUpdate: D,
    onBulkUpdate: O
  }), ie = Nt(), g = Ut();
  Ie(
    { current: null },
    // Board context menu doesn't need a ref
    !!g.boardContextMenu,
    () => g.setBoardContextMenu(null),
    ".board-context-menu"
  ), Ie(
    { current: null },
    // Tag context menu doesn't need a ref
    !!g.tagContextMenu,
    () => g.setTagContextMenu(null),
    ".tag-context-menu"
  ), Q(() => {
    c(/* @__PURE__ */ new Set());
  }, [$]), Q(() => {
    async function S() {
      console.log("[App] Initializing session...", { userType: n, sessionId: e });
      const E = Te(), I = await ot(e, n);
      let R = e;
      if (n === "public") {
        R = Te() || e, console.log("[App] Public user - using stable sessionId:", R);
        const q = await ce("public", R).getPreferences();
        q && (U(q), console.log("[App] Loaded public user preferences from localStorage:", q));
      } else
        R = e, I && (U(I), console.log("[App] Applied preferences from handshake:", I)), E && E !== e && (console.log("[App] SessionId changed, clearing old storage"), rt(E, n));
      R !== p && (console.log("[App] Updating effectiveSessionId:", { from: p, to: R }), x(R)), h(!0), console.log("[App] Loading data from API..."), await T();
    }
    S();
  }, [n, e]);
  const Ve = async (S) => {
    await C(S) && a.current && (a.current.value = "", a.current.focus());
  }, ze = (S) => {
    const E = b.filter((I) => I.tag?.split(" ").includes(S));
    g.setConfirmClearTag({ tag: S, count: E.length });
  }, Xe = async (S) => {
    const E = S.trim().replace(/\s+/g, "-");
    try {
      if (await re(E), g.pendingTaskOperation?.type === "apply-tag" && g.pendingTaskOperation.taskIds.length > 0) {
        const I = g.pendingTaskOperation.taskIds.map((R) => {
          const q = b.find((at) => at.id === R)?.tag?.split(" ").filter(Boolean) || [], ae = [.../* @__PURE__ */ new Set([...q, E])];
          return { taskId: R, tag: ae.join(" ") };
        });
        await O(I), _.clearSelection();
      }
      g.setPendingTaskOperation(null), g.setShowNewTagDialog(!1), g.setInputValue("");
    } catch (I) {
      throw console.error("[App] Failed to create tag:", I), I;
    }
  }, qe = (S) => {
    const E = b.find((I) => I.id === S);
    E && (g.setEditTagModal({ taskId: S, currentTag: E.tag || null }), g.setEditTagInput(""));
  }, Ye = async () => {
    if (!g.editTagModal) return;
    const { taskId: S, currentTag: E } = g.editTagModal, I = E?.split(" ").filter(Boolean) || [], R = g.editTagInput.trim() ? g.editTagInput.trim().replace(/\s+/g, "-").split("#").filter(Boolean).map((ae) => ae.trim()) : [];
    for (const ae of R)
      await re(ae);
    const q = [.../* @__PURE__ */ new Set([...I, ...R])].sort().join(" ");
    await D(S, { tag: q }), g.setEditTagModal(null), g.setEditTagInput("");
  }, Ge = (S) => {
    if (!g.editTagModal) return;
    const { taskId: E, currentTag: I } = g.editTagModal, R = I?.split(" ").filter(Boolean) || [];
    if (R.includes(S)) {
      const q = R.filter((ae) => ae !== S).sort().join(" ");
      g.setEditTagModal({ taskId: E, currentTag: q });
    } else {
      const q = [...R, S].sort().join(" ");
      g.setEditTagModal({ taskId: E, currentTag: q });
    }
  }, ve = (S) => ra(S, y?.boards || []), Ze = async (S) => {
    const E = S.trim(), I = ve(E);
    if (I) {
      g.setValidationError(I);
      return;
    }
    try {
      await L(E), g.pendingTaskOperation?.type === "move-to-board" && g.pendingTaskOperation.taskIds.length > 0 && (await oe(E, g.pendingTaskOperation.taskIds), _.clearSelection()), g.setPendingTaskOperation(null), g.setValidationError(null), g.setShowNewBoardDialog(!1), g.setInputValue("");
    } catch (R) {
      console.error("[App] Failed to create board:", R), g.setValidationError(R.message || "Failed to create board");
    }
  }, Qe = y?.boards?.find((S) => S.id === $)?.tags || [], et = Array.from(/* @__PURE__ */ new Set([...Qe, ...Ke(b)])), tt = Ct(b, te ? 3 : 6);
  return !u || !W ? /* @__PURE__ */ i(Jt, { isDarkTheme: W ? F : o }) : /* @__PURE__ */ i(
    "div",
    {
      ref: s,
      className: "task-app-container task-app-fade-in",
      "data-dark-theme": F ? "true" : "false",
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
            if (_.selectionJustEndedAt && Date.now() - _.selectionJustEndedAt < At)
              return;
            _.clearSelection();
          }
        } catch {
        }
      },
      children: /* @__PURE__ */ k("div", { className: "task-app", children: [
        /* @__PURE__ */ i(
          Wt,
          {
            theme: V,
            experimentalThemes: w.experimentalThemes || !1,
            showThemePicker: H,
            onThemePickerToggle: () => z(!H),
            onThemeChange: ne,
            onSettingsClick: () => g.setShowSettingsModal(!0),
            THEME_FAMILIES: X
          }
        ),
        /* @__PURE__ */ i(
          Vt,
          {
            boards: y,
            currentBoardId: $,
            userType: n,
            dragOverFilter: _.dragOverFilter,
            onBoardSwitch: Z,
            onBoardContextMenu: (S, E, I) => g.setBoardContextMenu({ boardId: S, x: E, y: I }),
            onDragOverFilter: _.setDragOverFilter,
            onMoveTasksToBoard: oe,
            onClearSelection: _.clearSelection,
            onCreateBoardClick: () => {
              g.setInputValue(""), g.setValidationError(null), g.setShowNewBoardDialog(!0);
            },
            onPendingOperation: g.setPendingTaskOperation,
            onInitialLoad: T
          }
        ),
        /* @__PURE__ */ i("div", { className: "task-app__controls", children: /* @__PURE__ */ i(
          "input",
          {
            ref: a,
            className: "task-app__input",
            placeholder: l,
            onKeyDown: (S) => {
              S.key === "Enter" && !S.shiftKey && (S.preventDefault(), Ve(S.target.value)), S.key === "k" && (S.ctrlKey || S.metaKey) && (S.preventDefault(), a.current?.focus());
            }
          }
        ) }),
        /* @__PURE__ */ i(
          Xt,
          {
            tags: et,
            selectedFilters: d,
            dragOverFilter: _.dragOverFilter,
            onToggleFilter: (S) => {
              c((E) => {
                const I = new Set(E);
                return I.has(S) ? I.delete(S) : I.add(S), I;
              });
            },
            onTagContextMenu: (S, E, I) => g.setTagContextMenu({ tag: S, x: E, y: I }),
            onDragOver: _.onFilterDragOver,
            onDragLeave: _.onFilterDragLeave,
            onDrop: _.onFilterDrop,
            onCreateTagClick: () => {
              g.setInputValue(""), g.setShowNewTagDialog(!0);
            },
            onPendingOperation: g.setPendingTaskOperation
          }
        ),
        /* @__PURE__ */ i(
          Yt,
          {
            tasks: b,
            topTags: tt,
            isMobile: te,
            filters: Array.from(d),
            selectedIds: _.selectedIds,
            onSelectionStart: _.selectionStartHandler,
            onSelectionMove: _.selectionMoveHandler,
            onSelectionEnd: _.selectionEndHandler,
            sortDirections: ie.sortDirections,
            dragOverTag: _.dragOverTag,
            pendingOperations: f,
            onComplete: B,
            onDelete: M,
            onEditTag: qe,
            onDragStart: _.onDragStart,
            onDragEnd: _.onDragEnd,
            onDragOver: _.onDragOver,
            onDragLeave: _.onDragLeave,
            onDrop: _.onDrop,
            toggleSort: ie.toggleSort,
            sortTasksByAge: ie.sortTasksByAge,
            getSortIcon: ie.getSortIcon,
            getSortTitle: ie.getSortTitle,
            deleteTag: ze,
            onDeletePersistedTag: je,
            showCompleteButton: G,
            showDeleteButton: m,
            showTagButton: v
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
          Gt,
          {
            tag: g.confirmClearTag?.tag || null,
            count: g.confirmClearTag?.count || 0,
            isOpen: !!g.confirmClearTag,
            onClose: () => g.setConfirmClearTag(null),
            onConfirm: P
          }
        ),
        /* @__PURE__ */ i(
          Zt,
          {
            isOpen: g.showNewBoardDialog,
            inputValue: g.inputValue,
            validationError: g.validationError,
            pendingTaskOperation: g.pendingTaskOperation,
            onClose: () => {
              g.setShowNewBoardDialog(!1), g.setPendingTaskOperation(null), g.setValidationError(null);
            },
            onConfirm: Ze,
            onInputChange: (S) => {
              g.setInputValue(S), g.setValidationError(null);
            },
            validateBoardName: ve
          }
        ),
        /* @__PURE__ */ i(
          Qt,
          {
            isOpen: g.showNewTagDialog,
            inputValue: g.inputValue,
            tasks: b,
            pendingTaskOperation: g.pendingTaskOperation,
            onClose: () => {
              g.setShowNewTagDialog(!1), g.setPendingTaskOperation(null);
            },
            onConfirm: Xe,
            onInputChange: g.setInputValue
          }
        ),
        /* @__PURE__ */ i(
          ta,
          {
            isOpen: g.showSettingsModal,
            preferences: w,
            showCompleteButton: G,
            showDeleteButton: m,
            showTagButton: v,
            onClose: () => g.setShowSettingsModal(!1),
            onSavePreferences: N,
            onValidateKey: async (S) => await ce(n, p).validateKey(S)
          }
        ),
        /* @__PURE__ */ i(
          aa,
          {
            isOpen: !!g.editTagModal,
            taskId: g.editTagModal?.taskId || null,
            currentTag: g.editTagModal?.currentTag || null,
            editTagInput: g.editTagInput,
            boards: y,
            currentBoardId: $,
            onClose: () => {
              g.setEditTagModal(null), g.setEditTagInput("");
            },
            onConfirm: Ye,
            onInputChange: g.setEditTagInput,
            onToggleTagPill: Ge
          }
        ),
        /* @__PURE__ */ i(
          na,
          {
            isOpen: !!g.boardContextMenu,
            boardId: g.boardContextMenu?.boardId || null,
            x: g.boardContextMenu?.x || 0,
            y: g.boardContextMenu?.y || 0,
            boards: y,
            onClose: () => g.setBoardContextMenu(null),
            onDeleteBoard: K
          }
        ),
        /* @__PURE__ */ i(
          sa,
          {
            isOpen: !!g.tagContextMenu,
            tag: g.tagContextMenu?.tag || null,
            x: g.tagContextMenu?.x || 0,
            y: g.tagContextMenu?.y || 0,
            onClose: () => g.setTagContextMenu(null),
            onDeleteTag: P
          }
        )
      ] })
    }
  );
}
function ga(t, n = {}) {
  const e = new URLSearchParams(window.location.search), a = n.userType || e.get("userType") || "admin", s = n.sessionId || "public-session", o = { ...n, userType: a, sessionId: s }, r = st(t);
  r.render(/* @__PURE__ */ i(ia, { ...o })), t.__root = r, console.log("[task-app] Mounted successfully", o);
}
function ha(t) {
  t.__root?.unmount();
}
export {
  ga as mount,
  ha as unmount
};
