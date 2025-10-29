import { jsxs as m, jsx as i, Fragment as nt } from "react/jsx-runtime";
import { createRoot as st } from "react-dom/client";
import { useState as A, useMemo as Fe, useEffect as ee, useRef as he } from "react";
const H = `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
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
function Re(t, n) {
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
function Ke(t, n, e, a) {
  const { task: s, index: o } = Re(t, n), r = {
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
async function ce(t, n, e) {
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
    const { task: d, index: c } = Re(o, e), u = {
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
    const { updatedTasks: l, closedTask: d } = Ke(s, e, "Completed", r);
    return {
      updatedTasks: l,
      statsEvents: [{ task: d, eventType: "completed" }],
      result: { ok: !0, message: `Task ${e} completed` }
    };
  });
}
async function pt(t, n, e, a = "main") {
  return se(t, n, a, (s, o, r) => {
    const { updatedTasks: l, closedTask: d } = Ke(s, e, "Deleted", r);
    return {
      updatedTasks: l,
      statsEvents: [{ task: d, eventType: "deleted" }],
      result: { ok: !0, message: `Task ${e} deleted` }
    };
  });
}
async function ft(t, n, e) {
  return ce(t, n, (a, s) => {
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
  return ce(t, n, (a, s) => (pe(a, e), {
    updatedBoards: {
      ...a,
      updatedAt: s,
      boards: a.boards.filter((r) => r.id !== e)
    },
    result: { ok: !0, message: `Board ${e} deleted` }
  }));
}
async function kt(t, n, e) {
  return ce(t, n, (a, s) => {
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
  return ce(t, n, (a, s) => {
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
        const C = h.tag.split(" ").filter(Boolean).filter((v) => v !== e.tag);
        return l++, {
          ...h,
          tag: C.length > 0 ? C.join(" ") : void 0,
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
  return await ce(t, n, (s, o) => {
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
function G(t, n, e = 50) {
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
      }), G("boards-updated", { sessionId: H, userType: t }), o.board;
    },
    async deleteBoard(s) {
      await mt(
        e,
        a,
        s
      ), await e.deleteBoardData(t, n, s), G("boards-updated", { sessionId: H, userType: t });
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
        sessionId: H,
        boardId: o,
        taskId: l.id
      }), G("tasks-updated", { sessionId: H, userType: t, boardId: o })), c;
    },
    async patchTask(s, o, r = "main", l = !1) {
      const d = {};
      o.title !== void 0 && (d.title = o.title), o.tag !== void 0 && o.tag !== null && (d.tag = o.tag), await gt(
        e,
        a,
        s,
        d,
        r
      ), l || G("tasks-updated", { sessionId: H, userType: t, boardId: r });
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
      ), G("tasks-updated", { sessionId: H, userType: t, boardId: o }), {
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
      ), r ? console.log("[localStorageApi] deleteTask: broadcast suppressed") : (console.log("[localStorageApi] deleteTask: broadcasting", { sessionId: H }), G("tasks-updated", { sessionId: H, userType: t, boardId: o })), {
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
      ), G("boards-updated", { sessionId: H, userType: t, boardId: o });
    },
    async deleteTag(s, o = "main") {
      await Tt(
        e,
        a,
        { boardId: o, tag: s }
      ), G("boards-updated", { sessionId: H, userType: t, boardId: o });
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
      const p = `${t}-${n}-${s}-tasks`, C = `${t}-${n}-${o}-tasks`;
      return localStorage.setItem(p, JSON.stringify({
        version: 1,
        updatedAt: l.updatedAt,
        tasks: d.tasks
      })), localStorage.setItem(C, JSON.stringify({
        version: 1,
        updatedAt: l.updatedAt,
        tasks: c.tasks
      })), G("boards-updated", { sessionId: H, userType: t }), { ok: !0, moved: u.length };
    },
    async batchUpdateTags(s, o) {
      console.log("[localStorageApi] batchUpdateTags", { boardId: s, updates: o }), await yt(
        e,
        a,
        { boardId: s, updates: o }
      ), G("tasks-updated", { sessionId: H, userType: t, boardId: s });
    },
    async batchClearTag(s, o, r) {
      console.log("[localStorageApi] batchClearTag START", { boardId: s, tag: o, taskIds: r, taskCount: r.length });
      const l = await wt(
        e,
        a,
        { boardId: s, tag: o, taskIds: r }
      );
      console.log("[localStorageApi] batchClearTag result:", l), G("boards-updated", { sessionId: H, userType: t, boardId: s }), console.log("[localStorageApi] batchClearTag END");
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
function le(t = "public", n = "public") {
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
function Ue(t) {
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
function Dt({ userType: t, sessionId: n }) {
  const [e, a] = A([]), [s, o] = A(/* @__PURE__ */ new Set()), r = Fe(
    () => le(t, n || "public"),
    [t, n]
  ), [l, d] = A(null), [c, u] = A("main");
  async function h() {
    console.log("[useTasks] initialLoad called"), "syncFromApi" in r && await r.syncFromApi(), await p();
  }
  async function p() {
    console.log("[useTasks] reload called", { currentBoardId: c, stack: new Error().stack?.split(`
`).slice(1, 4).join(`
`) });
    const k = await r.getBoards();
    d(k);
    const { tasks: y } = ie(k, c);
    a(y);
  }
  ee(() => {
    console.log("[useTasks] User context changed, clearing state and reloading", { userType: t, sessionId: n }), a([]), o(/* @__PURE__ */ new Set()), d(null), u("main"), p();
  }, [t, n]), ee(() => {
    console.log("[useTasks] Setting up BroadcastChannel listener", { currentBoardId: c, userType: t, sessionId: n });
    try {
      const k = new BroadcastChannel("tasks");
      return k.onmessage = (y) => {
        const x = y.data || {};
        if (console.log("[useTasks] BroadcastChannel message received", { msg: x, sessionId: H, currentBoardId: c, currentContext: { userType: t, sessionId: n } }), x.sessionId === H) {
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
  async function C(k) {
    if (k = k.trim(), !!k)
      try {
        const y = St(k);
        return await r.createTask(y, c), await p(), !0;
      } catch (y) {
        return alert(y.message || "Failed to create task"), !1;
      }
  }
  async function v(k) {
    await Se(
      `complete-${k}`,
      s,
      o,
      async () => {
        await r.completeTask(k, c), await p();
      },
      {
        onError: (y) => alert(y.message || "Failed to complete task")
      }
    );
  }
  async function N(k) {
    console.log("[useTasks] deleteTask START", { taskId: k, currentBoardId: c }), await Se(
      `delete-${k}`,
      s,
      o,
      async () => {
        console.log("[useTasks] deleteTask: calling api.deleteTask", { taskId: k, currentBoardId: c }), await r.deleteTask(k, c), console.log("[useTasks] deleteTask: calling reload"), await p(), console.log("[useTasks] deleteTask END");
      },
      {
        onError: (y) => alert(y.message || "Failed to delete task")
      }
    );
  }
  async function V(k) {
    const y = prompt("Enter tag (without #):");
    if (!y) return;
    const x = y.trim().replace(/^#+/, "").replace(/\s+/g, "-"), f = e.find((B) => B.id === k);
    if (!f) return;
    const T = f.tag?.split(" ") || [];
    if (T.includes(x)) return;
    const S = [...T, x].join(" ");
    try {
      await r.patchTask(k, { tag: S }, c), await p();
    } catch (B) {
      alert(B.message || "Failed to add tag");
    }
  }
  async function $(k, y, x = {}) {
    const { suppressBroadcast: f = !1, skipReload: T = !1 } = x;
    try {
      await r.patchTask(k, y, c, f), T || await p();
    } catch (S) {
      throw S;
    }
  }
  async function U(k) {
    console.log("[useTasks] bulkUpdateTaskTags START", { count: k.length });
    try {
      await r.batchUpdateTags(
        c,
        k.map((y) => ({ taskId: y.taskId, tag: y.tag || null }))
      ), console.log("[useTasks] bulkUpdateTaskTags: calling reload"), await p(), console.log("[useTasks] bulkUpdateTaskTags END");
    } catch (y) {
      throw console.error("[useTasks] bulkUpdateTaskTags ERROR", y), y;
    }
  }
  async function W(k) {
    console.log("[useTasks] deleteTag START", { tag: k, currentBoardId: c, taskCount: e.length });
    const y = e.filter((x) => x.tag?.split(" ").includes(k));
    if (console.log("[useTasks] deleteTag: found tasks with tag", { tag: k, count: y.length }), y.length === 0) {
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
        y.map((x) => x.id)
      ), console.log("[useTasks] deleteTag: calling reload"), await p(), console.log("[useTasks] deleteTag END");
    } catch (x) {
      console.error("[useTasks] deleteTag ERROR", x), alert(x.message || "Failed to remove tag from tasks");
    }
  }
  async function J(k) {
    await r.createBoard(k), u(k);
    const y = await r.getBoards();
    d(y);
    const { tasks: x } = ie(y, k);
    a(x);
  }
  async function X(k, y) {
    if (console.log("[useTasks] moveTasksToBoard START", { targetBoardId: k, ids: y, currentBoardId: c }), !l) return;
    const x = /* @__PURE__ */ new Set();
    for (const f of l.boards)
      for (const T of f.tasks || [])
        y.includes(T.id) && x.add(f.id);
    console.log("[useTasks] moveTasksToBoard: source boards", { sourceBoardIds: Array.from(x) });
    try {
      if (x.size === 1) {
        const S = Array.from(x)[0];
        console.log("[useTasks] moveTasksToBoard: using batch API"), await r.batchMoveTasks(S, k, y);
      } else
        throw console.error("[useTasks] moveTasksToBoard: Cannot move tasks from multiple boards at once"), new Error("Cannot move tasks from multiple boards at once");
      console.log("[useTasks] moveTasksToBoard: switching to target board", { targetBoardId: k }), u(k);
      const f = await r.getBoards();
      d(f);
      const { tasks: T } = ie(f, k);
      a(T), console.log("[useTasks] moveTasksToBoard END");
    } catch (f) {
      console.error("[useTasks] moveTasksToBoard ERROR", f), alert(f.message || "Failed to move tasks");
    }
  }
  async function q(k) {
    if (await r.deleteBoard(k), c === k) {
      u("main");
      const y = await r.getBoards();
      d(y);
      const { tasks: x } = ie(y, "main");
      a(x);
    } else
      await p();
  }
  async function te(k) {
    await r.createTag(k, c), await p();
  }
  async function ae(k) {
    await r.deleteTag(k, c), await p();
  }
  function Q(k) {
    u(k);
    const { tasks: y, foundBoard: x } = ie(l, k);
    x ? a(y) : p();
  }
  return {
    // Task state
    tasks: e,
    pendingOperations: s,
    // Task operations
    addTask: C,
    completeTask: v,
    deleteTask: N,
    addTagToTask: V,
    updateTaskTags: $,
    bulkUpdateTaskTags: U,
    deleteTag: W,
    // Board state
    boards: l,
    currentBoardId: c,
    // Board operations
    createBoard: J,
    deleteBoard: q,
    switchBoard: Q,
    moveTasksToBoard: X,
    createTagOnBoard: te,
    deleteTagOnBoard: ae,
    // Lifecycle
    initialLoad: h,
    reload: p
  };
}
function Bt({ tasks: t, onTaskUpdate: n, onBulkUpdate: e }) {
  const [a, s] = A(null), [o, r] = A(null), [l, d] = A(/* @__PURE__ */ new Set()), [c, u] = A(!1), [h, p] = A(null), [C, v] = A(null), N = he(null);
  function V(f) {
    let T = [];
    try {
      const S = f.dataTransfer.getData("application/x-hadoku-task-ids");
      S && (T = JSON.parse(S));
    } catch {
    }
    if (T.length === 0) {
      const S = f.dataTransfer.getData("text/plain");
      S && (T = [S]);
    }
    return T;
  }
  function $(f, T) {
    const S = l.has(T) && l.size > 0 ? Array.from(l) : [T];
    console.log("[useDragAndDrop] onDragStart", { taskId: T, idsToDrag: S, selectedCount: l.size }), f.dataTransfer.setData("text/plain", S[0]);
    try {
      f.dataTransfer.setData("application/x-hadoku-task-ids", JSON.stringify(S));
    } catch {
    }
    f.dataTransfer.effectAllowed = "copyMove";
    try {
      const B = f.currentTarget, E = B.closest && B.closest(".task-app__item") ? B.closest(".task-app__item") : B;
      E.classList.add("dragging");
      const D = E.cloneNode(!0);
      D.style.boxSizing = "border-box", D.style.width = `${E.offsetWidth}px`, D.style.height = `${E.offsetHeight}px`, D.style.opacity = "0.95", D.style.transform = "none", D.style.filter = "drop-shadow(0 6px 18px rgba(0,0,0,0.12))", D.classList.add("drag-image"), D.style.position = "absolute", D.style.top = "-9999px", D.style.left = "-9999px", document.body.appendChild(D), E.__dragImage = D, d((O) => {
        if (O.has(T)) return new Set(O);
        const I = new Set(O);
        return I.add(T), I;
      });
      try {
        const O = E.closest(".task-app__tag-column");
        if (O) {
          const I = O.querySelector(".task-app__tag-header") || O.querySelector("h3"), F = (I && I.textContent || "").trim().replace(/^#/, "");
          if (F)
            try {
              f.dataTransfer.setData("application/x-hadoku-task-source", F);
            } catch {
            }
        }
      } catch {
      }
      try {
        const O = E.getBoundingClientRect();
        let I = Math.round(f.clientX - O.left), w = Math.round(f.clientY - O.top);
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
      const S = T.__dragImage;
      S && S.parentNode && S.parentNode.removeChild(S), S && delete T.__dragImage;
    } catch {
    }
    try {
      q();
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
      u(!0), N.current = { x: f.clientX, y: f.clientY }, p({ x: f.clientX, y: f.clientY, w: 0, h: 0 }), d(/* @__PURE__ */ new Set());
      try {
        document.body.classList.add("marquee-selecting");
      } catch {
      }
    }
  }
  function J(f) {
    if (!c || !N.current) return;
    const T = N.current.x, S = N.current.y, B = f.clientX, E = f.clientY, D = Math.min(T, B), O = Math.min(S, E), I = Math.abs(B - T), w = Math.abs(E - S);
    p({ x: D, y: O, w: I, h: w });
    const F = Array.from(document.querySelectorAll(".task-app__item")), P = /* @__PURE__ */ new Set();
    for (const K of F) {
      const z = K.getBoundingClientRect();
      if (!(z.right < D || z.left > D + I || z.bottom < O || z.top > O + w)) {
        const ue = K.getAttribute("data-task-id");
        ue && P.add(ue), K.classList.add("selected");
      } else
        K.classList.remove("selected");
    }
    d(P);
  }
  function X(f) {
    u(!1), p(null), N.current = null;
    try {
      document.body.classList.remove("marquee-selecting");
    } catch {
    }
    try {
      v(Date.now());
    } catch {
    }
  }
  function q() {
    d(/* @__PURE__ */ new Set()), Array.from(document.querySelectorAll(".task-app__item.selected")).forEach((T) => T.classList.remove("selected"));
  }
  ee(() => {
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
        J(E);
      } catch {
      }
    }
    function S(B) {
      const E = { clientX: B.clientX, clientY: B.clientY };
      try {
        X(E);
      } catch {
      }
    }
    return document.addEventListener("mousedown", f), document.addEventListener("mousemove", T), document.addEventListener("mouseup", S), () => {
      document.removeEventListener("mousedown", f), document.removeEventListener("mousemove", T), document.removeEventListener("mouseup", S);
    };
  }, []);
  function te(f, T) {
    f.preventDefault(), f.dataTransfer.dropEffect = "copy", s(T);
  }
  function ae(f) {
    f.currentTarget.contains(f.relatedTarget) || s(null);
  }
  async function Q(f, T) {
    f.preventDefault(), s(null), console.log("[useDragAndDrop] onDrop START", { targetTag: T });
    const S = V(f);
    if (S.length === 0) return;
    let B = null;
    try {
      const D = f.dataTransfer.getData("application/x-hadoku-task-source");
      D && (B = D);
    } catch {
    }
    console.log("[useDragAndDrop] onDrop: processing", { targetTag: T, ids: S, srcTag: B, taskCount: S.length });
    const E = [];
    for (const D of S) {
      const O = t.find((K) => K.id === D);
      if (!O) continue;
      const I = O.tag?.split(" ").filter(Boolean) || [];
      if (T === "other") {
        if (I.length === 0) continue;
        E.push({ taskId: D, tag: "" });
        continue;
      }
      const w = I.includes(T);
      let F = I.slice();
      w || F.push(T), B && B !== T && (F = F.filter((K) => K !== B));
      const P = F.join(" ").trim();
      E.push({ taskId: D, tag: P });
    }
    console.log("[useDragAndDrop] onDrop: updating tasks", { updateCount: E.length });
    try {
      await e(E), console.log("[useDragAndDrop] onDrop: updates complete, clearing selection");
      try {
        q();
      } catch {
      }
    } catch (D) {
      console.error("Failed to add tag to one or more tasks:", D), alert(D.message || "Failed to add tags");
    }
    console.log("[useDragAndDrop] onDrop END");
  }
  function k(f, T) {
    f.preventDefault(), f.dataTransfer.dropEffect = "copy", r(T);
  }
  function y(f) {
    f.currentTarget.contains(f.relatedTarget) || r(null);
  }
  async function x(f, T) {
    f.preventDefault(), r(null);
    const S = V(f);
    if (S.length === 0) return;
    console.log("[useDragAndDrop] onFilterDrop", { filterTag: T, ids: S, taskCount: S.length });
    const B = [];
    for (const E of S) {
      const D = t.find((w) => w.id === E);
      if (!D) continue;
      const O = D.tag?.split(" ").filter(Boolean) || [];
      if (O.includes(T)) {
        console.log(`Task ${E} already has tag: ${T}`);
        continue;
      }
      const I = [...O, T].join(" ");
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
        q();
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
    selectionJustEndedAt: C,
    // selection handlers
    selectionStartHandler: W,
    selectionMoveHandler: J,
    selectionEndHandler: X,
    clearSelection: q,
    onDragStart: $,
    onDragEnd: U,
    onDragOver: te,
    onDragLeave: ae,
    onDrop: Q,
    onFilterDragOver: k,
    onFilterDragLeave: y,
    onFilterDrop: x
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
function Lt(t, n, e = !1) {
  const [a, s] = A(Mt), [o, r] = A(!1);
  ee(() => {
    if (e) {
      r(!0);
      return;
    }
    (async () => {
      _t(t, n), console.log("[usePreferences] Loading preferences...", { userType: t, sessionId: n });
      const u = le(t, n), h = await u.getPreferences();
      if (console.log("[usePreferences] Loaded preferences:", h), h) {
        const p = It(h);
        if (p) {
          const C = { ...h, ...p, updatedAt: (/* @__PURE__ */ new Date()).toISOString() };
          s(C), await u.savePreferences(C), console.log("[usePreferences] Applied and saved migrations");
        } else
          s(h), console.log("[usePreferences] Applied preferences to state");
      }
      r(!0);
    })();
  }, [t, n, e]);
  const l = async (c) => {
    const u = { ...a, ...c, updatedAt: (/* @__PURE__ */ new Date()).toISOString() };
    s(u), await le(t, n).savePreferences(u);
  }, d = a.theme?.endsWith("-dark") || a.theme === "dark";
  return {
    preferences: a,
    savePreferences: l,
    preferencesLoaded: o,
    isDarkTheme: d,
    setPreferences: s
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
}, Ot = () => /* @__PURE__ */ m("svg", { ...Z, children: [
  /* @__PURE__ */ i("circle", { cx: "12", cy: "12", r: "5" }),
  /* @__PURE__ */ i("line", { x1: "12", y1: "1", x2: "12", y2: "3" }),
  /* @__PURE__ */ i("line", { x1: "12", y1: "21", x2: "12", y2: "23" }),
  /* @__PURE__ */ i("line", { x1: "4.22", y1: "4.22", x2: "5.64", y2: "5.64" }),
  /* @__PURE__ */ i("line", { x1: "18.36", y1: "18.36", x2: "19.78", y2: "19.78" }),
  /* @__PURE__ */ i("line", { x1: "1", y1: "12", x2: "3", y2: "12" }),
  /* @__PURE__ */ i("line", { x1: "21", y1: "12", x2: "23", y2: "12" }),
  /* @__PURE__ */ i("line", { x1: "4.22", y1: "19.78", x2: "5.64", y2: "18.36" }),
  /* @__PURE__ */ i("line", { x1: "18.36", y1: "5.64", x2: "19.78", y2: "4.22" })
] }), He = () => /* @__PURE__ */ i("svg", { ...Z, children: /* @__PURE__ */ i("path", { d: "M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" }) }), De = () => /* @__PURE__ */ m("svg", { ...Z, children: [
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
] }), Be = () => /* @__PURE__ */ m("svg", { ...Z, children: [
  /* @__PURE__ */ i("path", { d: "M2 12c2-2 4-2 6 0s4 2 6 0 4-2 6 0" }),
  /* @__PURE__ */ i("path", { d: "M2 17c2-2 4-2 6 0s4 2 6 0 4-2 6 0" }),
  /* @__PURE__ */ i("path", { d: "M2 7c2-2 4-2 6 0s4 2 6 0 4-2 6 0" })
] }), Ne = () => /* @__PURE__ */ i("svg", { ...Z, children: /* @__PURE__ */ i("polygon", { points: "13 2 3 14 12 14 11 22 21 10 12 10 13 2" }) }), Ae = () => /* @__PURE__ */ m("svg", { ...Z, children: [
  /* @__PURE__ */ i("path", { d: "M18 8h1a4 4 0 0 1 0 8h-1" }),
  /* @__PURE__ */ i("path", { d: "M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" }),
  /* @__PURE__ */ i("line", { x1: "6", y1: "1", x2: "6", y2: "4" }),
  /* @__PURE__ */ i("line", { x1: "10", y1: "1", x2: "10", y2: "4" }),
  /* @__PURE__ */ i("line", { x1: "14", y1: "1", x2: "14", y2: "4" })
] }), Ee = () => /* @__PURE__ */ m("svg", { ...Z, children: [
  /* @__PURE__ */ i("circle", { cx: "12", cy: "12", r: "2", fill: "currentColor" }),
  /* @__PURE__ */ i("circle", { cx: "12", cy: "6", r: "2.5", fill: "none", stroke: "currentColor", strokeWidth: "2" }),
  /* @__PURE__ */ i("circle", { cx: "18", cy: "10", r: "2.5", fill: "none", stroke: "currentColor", strokeWidth: "2" }),
  /* @__PURE__ */ i("circle", { cx: "16", cy: "16", r: "2.5", fill: "none", stroke: "currentColor", strokeWidth: "2" }),
  /* @__PURE__ */ i("circle", { cx: "8", cy: "16", r: "2.5", fill: "none", stroke: "currentColor", strokeWidth: "2" }),
  /* @__PURE__ */ i("circle", { cx: "6", cy: "10", r: "2.5", fill: "none", stroke: "currentColor", strokeWidth: "2" })
] }), Me = () => /* @__PURE__ */ i("svg", { ...Z, children: /* @__PURE__ */ i("path", { d: "M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z", fill: "currentColor" }) }), _e = () => /* @__PURE__ */ m("svg", { ...Z, children: [
  /* @__PURE__ */ i("path", { d: "M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z", fill: "currentColor" }),
  /* @__PURE__ */ i("path", { d: "M2 21c0-3 1.85-5.36 5.08-6C9 14.5 11 14 11 20", stroke: "currentColor", strokeWidth: "2", fill: "none" }),
  /* @__PURE__ */ i("path", { d: "M11 8c3 2 5 4 7 7", stroke: "white", strokeWidth: "1.5", opacity: "0.4" })
] }), Pt = () => /* @__PURE__ */ m("svg", { ...Z, children: [
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
] }), $t = () => /* @__PURE__ */ m("svg", { ...Z, width: 16, height: 16, viewBox: "0 0 20 20", children: [
  /* @__PURE__ */ i(
    "path",
    {
      d: "M2 4 L12 4 L16 10 L12 16 L2 16 Z",
      fill: "currentColor"
    }
  ),
  /* @__PURE__ */ i("circle", { cx: "6", cy: "10", r: "1.5", fill: "white" })
] }), Ie = [
  {
    lightIcon: /* @__PURE__ */ i(Ot, {}),
    darkIcon: /* @__PURE__ */ i(He, {}),
    lightTheme: "light",
    darkTheme: "dark",
    lightLabel: "Light",
    darkLabel: "Dark"
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
    lightIcon: /* @__PURE__ */ i(_e, {}),
    darkIcon: /* @__PURE__ */ i(_e, {}),
    lightTheme: "nature-light",
    darkTheme: "nature-dark",
    lightLabel: "Nature Light",
    darkLabel: "Nature Dark"
  },
  {
    lightIcon: /* @__PURE__ */ i(Ee, {}),
    darkIcon: /* @__PURE__ */ i(Ee, {}),
    lightTheme: "lavender-light",
    darkTheme: "lavender-dark",
    lightLabel: "Lavender Light",
    darkLabel: "Lavender Dark"
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
  }
], Ft = [
  {
    lightIcon: /* @__PURE__ */ i(Ne, {}),
    darkIcon: /* @__PURE__ */ i(Ne, {}),
    lightTheme: "cyberpunk-light",
    darkTheme: "cyberpunk-dark",
    lightLabel: "Cyberpunk Light",
    darkLabel: "Cyberpunk Dark"
  },
  {
    lightIcon: /* @__PURE__ */ i(Me, {}),
    darkIcon: /* @__PURE__ */ i(Me, {}),
    lightTheme: "pink-light",
    darkTheme: "pink-dark",
    lightLabel: "Pink Light",
    darkLabel: "Pink Dark"
  }
];
function We(t) {
  return t ? [...Ie, ...Ft] : Ie;
}
function Rt(t, n) {
  const a = We(n).find(
    (s) => s.lightTheme === t || s.darkTheme === t
  );
  return a ? t.endsWith("-dark") || t === "dark" ? a.darkIcon : a.lightIcon : /* @__PURE__ */ i(He, {});
}
function Kt(t, n, e) {
  const [a, s] = A(!1), o = t.theme || "light", r = (d) => n({ theme: d }), l = Fe(
    () => We(t.experimentalThemes || !1),
    [t.experimentalThemes]
  );
  return ee(() => {
    o === "light" ? document.documentElement.removeAttribute("data-theme") : document.documentElement.setAttribute("data-theme", o);
  }, [o]), ee(() => {
    const d = window.matchMedia("(prefers-color-scheme: dark)"), c = (u) => {
      const h = u.matches, p = o.replace(/-light$|-dark$/, ""), C = o.endsWith("-dark") ? "dark" : o.endsWith("-light") ? "light" : null;
      if (C && p !== "light" && p !== "dark") {
        const v = h ? "dark" : "light";
        if (C !== v) {
          const N = `${p}-${v}`;
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
function Le(t, n, e, a) {
  ee(() => {
    if (!n) return;
    const s = (o) => {
      const r = o.target;
      t.current && t.current.contains(r) || a && r.closest(a) || e();
    };
    return document.addEventListener("mousedown", s), () => document.removeEventListener("mousedown", s);
  }, [t, n, e, a]);
}
function Ut() {
  const [t, n] = A(null), [e, a] = A(!1), [s, o] = A(!1), [r, l] = A(!1), [d, c] = A(null), [u, h] = A(""), [p, C] = A(null), [v, N] = A(null), [V, $] = A(""), [U, W] = A(null), [J, X] = A(null);
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
    setBoardContextMenu: C,
    tagContextMenu: v,
    setTagContextMenu: N,
    inputValue: V,
    setInputValue: $,
    validationError: U,
    setValidationError: W,
    pendingTaskOperation: J,
    setPendingTaskOperation: X
  };
}
const Oe = 768;
function Ht() {
  const [t, n] = A(() => typeof window > "u" ? !1 : window.innerWidth < Oe);
  return ee(() => {
    if (typeof window > "u") return;
    const e = window.matchMedia(`(max-width: ${Oe - 1}px)`), a = (s) => {
      n(s.matches);
    };
    return e.addEventListener ? e.addEventListener("change", a) : e.addListener(a), a(e), () => {
      e.removeEventListener ? e.removeEventListener("change", a) : e.removeListener(a);
    };
  }, []), t;
}
function Wt({ isDarkTheme: t }) {
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
function Jt({
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
          children: Rt(t, n)
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
  const [p, C] = A(!1), v = t && t.boards ? t.boards.slice(0, Ce) : [{ id: "main", name: "main", tasks: [], tags: [] }], N = !t || t.boards && t.boards.length < Ce, V = async ($) => {
    if (p) return;
    console.log("[BoardsSection] Manual refresh triggered"), C(!0);
    const U = $.currentTarget, W = new Promise((J, X) => {
      setTimeout(() => X(new Error("Sync timeout")), 5e3);
    });
    try {
      await Promise.race([h(), W]), console.log("[BoardsSection] Sync completed successfully");
    } catch (J) {
      console.error("[BoardsSection] Sync failed:", J);
    } finally {
      C(!1), U?.blur();
    }
  };
  return /* @__PURE__ */ m("div", { className: "task-app__boards", children: [
    /* @__PURE__ */ i("div", { className: "task-app__board-list", children: v.map(($) => /* @__PURE__ */ i(
      jt,
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
    /* @__PURE__ */ m("div", { className: "task-app__board-actions", children: [
      N && /* @__PURE__ */ i(
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
            const U = we($.dataTransfer);
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
          onClick: V,
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
function Xt({
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
function qt({
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
  return /* @__PURE__ */ m("div", { className: "task-app__filters", children: [
    t.map((h) => /* @__PURE__ */ i(
      Xt,
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
function zt(t) {
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
  const p = e.has(`complete-${t.id}`), C = e.has(`delete-${t.id}`);
  return /* @__PURE__ */ m(
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
        /* @__PURE__ */ m("div", { className: "task-app__item-content", children: [
          /* @__PURE__ */ i("div", { className: "task-app__item-title", title: t.title, children: t.title }),
          /* @__PURE__ */ m("div", { className: "task-app__item-meta-row", children: [
            t.tag ? /* @__PURE__ */ i("div", { className: "task-app__item-tag", children: t.tag.split(" ").sort().map((v) => `#${v}`).join(" ") }) : /* @__PURE__ */ i("div", {}),
            /* @__PURE__ */ i("div", { className: "task-app__item-age", children: zt(t.createdAt) })
          ] })
        ] }),
        /* @__PURE__ */ m("div", { className: "task-app__item-actions", children: [
          h && /* @__PURE__ */ i(
            "button",
            {
              className: "task-app__action-btn task-app__edit-tag-btn",
              onClick: () => o(t.id),
              title: "Edit tags",
              disabled: p || C,
              children: /* @__PURE__ */ i($t, {})
            }
          ),
          c && /* @__PURE__ */ i(
            "button",
            {
              className: "task-app__action-btn task-app__complete-btn",
              onClick: () => a(t.id),
              title: "Complete task",
              disabled: p || C,
              children: p ? "⏳" : "✓"
            }
          ),
          u && /* @__PURE__ */ i(
            "button",
            {
              className: "task-app__action-btn task-app__delete-btn",
              onClick: () => s(t.id),
              title: "Delete task",
              disabled: p || C,
              children: C ? "⏳" : "×"
            }
          )
        ] })
      ]
    }
  );
}
function Pe(t, n = !1) {
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
  onSelectionStart: C,
  onSelectionMove: v,
  onSelectionEnd: N,
  onDragOver: V,
  onDragLeave: $,
  onDrop: U,
  toggleSort: W,
  sortTasksByAge: J,
  getSortIcon: X,
  getSortTitle: q,
  deleteTag: te,
  onDeletePersistedTag: ae,
  showCompleteButton: Q = !0,
  showDeleteButton: k = !0,
  showTagButton: y = !1
}) {
  const x = (w, F) => /* @__PURE__ */ m(
    "div",
    {
      className: `task-app__tag-column ${o === w ? "task-app__tag-column--drag-over" : ""}`,
      onDragOver: (P) => V(P, w),
      onDragLeave: $,
      onDrop: (P) => U(P, w),
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
              onClick: () => W(w),
              title: q(s[w] || "desc"),
              children: X(s[w] || "desc")
            }
          )
        ] }),
        /* @__PURE__ */ i("ul", { className: "task-app__list task-app__list--column", children: J(F, s[w] || "desc").map((P) => /* @__PURE__ */ i(
          ke,
          {
            task: P,
            isDraggable: !0,
            pendingOperations: r,
            onComplete: l,
            onDelete: d,
            onEditTag: c,
            onDragStart: u,
            onDragEnd: h,
            selected: p ? p.has(P.id) : !1,
            showCompleteButton: Q,
            showDeleteButton: k,
            showTagButton: y
          },
          P.id
        )) })
      ]
    },
    w
  ), f = (w, F) => {
    let P = be(t, w);
    return S && (P = P.filter((K) => {
      const z = K.tag?.split(" ") || [];
      return a.some((oe) => z.includes(oe));
    })), P.slice(0, F);
  }, T = n.length, S = Array.isArray(a) && a.length > 0, B = t.filter((w) => {
    if (!S) return !0;
    const F = w.tag?.split(" ") || [];
    return a.some((P) => F.includes(P));
  }), E = Pe(T, e), D = S ? n.filter((w) => be(t, w).some((P) => {
    const K = P.tag?.split(" ") || [];
    return a.some((z) => K.includes(z));
  })) : n.slice(0, E.useTags);
  if (D.length === 0)
    return /* @__PURE__ */ i("ul", { className: "task-app__list", children: B.map((w) => /* @__PURE__ */ i(
      ke,
      {
        task: w,
        pendingOperations: r,
        onComplete: l,
        onDelete: d,
        onEditTag: c,
        onDragStart: u,
        onDragEnd: h,
        selected: p ? p.has(w.id) : !1,
        showCompleteButton: Q,
        showDeleteButton: k,
        showTagButton: y
      },
      w.id
    )) });
  const O = xt(t, n, a).filter((w) => {
    if (!S) return !0;
    const F = w.tag?.split(" ") || [];
    return a.some((P) => F.includes(P));
  }), I = Pe(D.length, e);
  return /* @__PURE__ */ m("div", { className: "task-app__dynamic-layout", children: [
    I.rows.length > 0 && /* @__PURE__ */ i(nt, { children: I.rows.map((w, F) => /* @__PURE__ */ i("div", { className: `task-app__tag-grid task-app__tag-grid--${w.columns}col`, children: w.tagIndices.map((P) => {
      const K = D[P];
      return K ? x(K, f(K, I.maxPerColumn)) : null;
    }) }, F)) }),
    O.length > 0 && /* @__PURE__ */ m(
      "div",
      {
        className: `task-app__remaining ${o === "other" ? "task-app__tag-column--drag-over" : ""}`,
        onDragOver: (w) => {
          w.preventDefault(), w.dataTransfer.dropEffect = "move", V(w, "other");
        },
        onDragLeave: (w) => $(w),
        onDrop: (w) => U(w, "other"),
        children: [
          /* @__PURE__ */ m("div", { className: "task-app__tag-header-row", children: [
            /* @__PURE__ */ i("h3", { className: "task-app__remaining-header", children: "Other Tasks" }),
            /* @__PURE__ */ i(
              "button",
              {
                className: "task-app__sort-btn task-app__sort-btn--active",
                onClick: () => W("other"),
                title: q(s.other || "desc"),
                children: X(s.other || "desc")
              }
            )
          ] }),
          /* @__PURE__ */ i("ul", { className: "task-app__list", children: J(O, s.other || "desc").map((w) => /* @__PURE__ */ i(
            ke,
            {
              task: w,
              pendingOperations: r,
              onComplete: l,
              onDelete: d,
              onEditTag: c,
              onDragStart: u,
              onDragEnd: h,
              selected: p ? p.has(w.id) : !1,
              showCompleteButton: Q,
              showDeleteButton: k,
              showTagButton: y
            },
            w.id
          )) })
        ]
      }
    )
  ] });
}
function de({
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
      children: /* @__PURE__ */ m(
        "div",
        {
          className: "modal-card",
          onClick: (C) => C.stopPropagation(),
          children: [
            /* @__PURE__ */ i("h3", { children: n }),
            s,
            r && /* @__PURE__ */ i(
              "input",
              {
                type: "text",
                className: "modal-input",
                value: o || "",
                onChange: (C) => r(C.target.value),
                placeholder: l,
                autoFocus: !0,
                onKeyDown: (C) => {
                  C.key === "Enter" && !u && (C.preventDefault(), a()), C.key === "Escape" && (C.preventDefault(), e());
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
    de,
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
  return /* @__PURE__ */ m(
    de,
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
  }, d = Ue(e);
  return /* @__PURE__ */ m(
    de,
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
  const [d, c] = A(""), [u, h] = A(null), [p, C] = A(!1), v = async () => {
    if (!d.trim() || p) return;
    C(!0), h(null);
    const N = await ea(d, l);
    N.success || (h(N.error || "Failed to validate key"), C(!1));
  };
  return /* @__PURE__ */ m(
    de,
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
                    c(N.target.value), h(null);
                  },
                  onKeyDown: (N) => {
                    N.key === "Enter" && d && !p && v();
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
  const h = s?.boards?.find((v) => v.id === o)?.tags || [], p = e?.split(" ").filter(Boolean) || [], C = (v) => {
    v.key === "Enter" && (v.preventDefault(), l());
  };
  return /* @__PURE__ */ i(
    de,
    {
      isOpen: t,
      title: "Edit Tags",
      onClose: r,
      onConfirm: l,
      confirmLabel: "Save",
      cancelLabel: "Cancel",
      children: /* @__PURE__ */ m("div", { className: "edit-tag-modal", children: [
        h.length > 0 && /* @__PURE__ */ m("div", { className: "edit-tag-pills", children: [
          /* @__PURE__ */ i("label", { className: "edit-tag-label", children: "Select Tags" }),
          /* @__PURE__ */ i("div", { className: "edit-tag-pills-container", children: [...h].sort().map((v) => {
            const N = p.includes(v);
            return /* @__PURE__ */ m(
              "button",
              {
                className: `edit-tag-pill ${N ? "active" : ""}`,
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
        /* @__PURE__ */ m("div", { className: "edit-tag-field", children: [
          /* @__PURE__ */ i("label", { className: "edit-tag-label", children: "Add New Tag" }),
          /* @__PURE__ */ i(
            "input",
            {
              type: "text",
              className: "edit-tag-input",
              value: a,
              onChange: (v) => d(v.target.value),
              onKeyDown: C,
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
function je({ isOpen: t, x: n, y: e, items: a, className: s = "board-context-menu" }) {
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
    je,
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
    je,
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
const $e = [
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
  return $e[Math.floor(Math.random() * $e.length)];
}
function ra(t, n) {
  const e = t.trim();
  return e ? n.map((s) => s.id.toLowerCase()).includes(e.toLowerCase()) ? `Board "${e}" already exists` : null : "Board name cannot be empty";
}
function ia(t = {}) {
  const { userType: n = "public", sessionId: e = "public" } = t, a = he(null), s = he(null), [o] = A(() => typeof window < "u" && window.matchMedia ? window.matchMedia("(prefers-color-scheme: dark)").matches : !1), r = Ht(), [l] = A(() => oa()), [d, c] = A(/* @__PURE__ */ new Set()), [u, h] = A(!1), [p, C] = A(() => n === "public" && (typeof window < "u" ? localStorage.getItem("currentSessionId") : null) || e), { preferences: v, savePreferences: N, isDarkTheme: V, setPreferences: $ } = Lt(n, p, !0), { theme: U, showThemePicker: W, setShowThemePicker: J, THEME_FAMILIES: X, setTheme: q } = Kt(v, N), te = r || v.alwaysVerticalLayout || !1, ae = v.showCompleteButton ?? !0, Q = v.showDeleteButton ?? !0, k = v.showTagButton ?? !1, {
    tasks: y,
    pendingOperations: x,
    initialLoad: f,
    addTask: T,
    completeTask: S,
    deleteTask: B,
    updateTaskTags: E,
    bulkUpdateTaskTags: D,
    deleteTag: O,
    boards: I,
    currentBoardId: w,
    createBoard: F,
    deleteBoard: P,
    switchBoard: K,
    moveTasksToBoard: z,
    createTagOnBoard: oe,
    deleteTagOnBoard: ue
  } = Dt({ userType: n, sessionId: p }), _ = Bt({
    tasks: y,
    onTaskUpdate: E,
    onBulkUpdate: D
  }), re = Nt(), g = Ut();
  Le(
    { current: null },
    // Board context menu doesn't need a ref
    !!g.boardContextMenu,
    () => g.setBoardContextMenu(null),
    ".board-context-menu"
  ), Le(
    { current: null },
    // Tag context menu doesn't need a ref
    !!g.tagContextMenu,
    () => g.setTagContextMenu(null),
    ".tag-context-menu"
  ), ee(() => {
    c(/* @__PURE__ */ new Set());
  }, [w]), ee(() => {
    async function b() {
      console.log("[App] Initializing session...", { userType: n, sessionId: e });
      const M = Te(), L = await ot(e, n);
      let R = e;
      if (n === "public") {
        R = Te() || e, console.log("[App] Public user - using stable sessionId:", R);
        const Y = await le("public", R).getPreferences();
        Y && ($(Y), console.log("[App] Loaded public user preferences from localStorage:", Y));
      } else
        R = e, L && ($(L), console.log("[App] Applied preferences from handshake:", L)), M && M !== e && (console.log("[App] SessionId changed, clearing old storage"), rt(M, n));
      R !== p && (console.log("[App] Updating effectiveSessionId:", { from: p, to: R }), C(R)), console.log("[App] Loading data from API..."), await f(), h(!0);
    }
    b();
  }, [n, e]);
  const Ve = async (b) => {
    await T(b) && a.current && (a.current.value = "", a.current.focus());
  }, Xe = (b) => {
    const M = y.filter((L) => L.tag?.split(" ").includes(b));
    g.setConfirmClearTag({ tag: b, count: M.length });
  }, qe = async (b) => {
    const M = b.trim().replace(/\s+/g, "-");
    try {
      if (await oe(M), g.pendingTaskOperation?.type === "apply-tag" && g.pendingTaskOperation.taskIds.length > 0) {
        const L = g.pendingTaskOperation.taskIds.map((R) => {
          const Y = y.find((at) => at.id === R)?.tag?.split(" ").filter(Boolean) || [], ne = [.../* @__PURE__ */ new Set([...Y, M])];
          return { taskId: R, tag: ne.join(" ") };
        });
        await D(L), _.clearSelection();
      }
      g.setPendingTaskOperation(null), g.setShowNewTagDialog(!1), g.setInputValue("");
    } catch (L) {
      throw console.error("[App] Failed to create tag:", L), L;
    }
  }, ze = (b) => {
    const M = y.find((L) => L.id === b);
    M && (g.setEditTagModal({ taskId: b, currentTag: M.tag || null }), g.setEditTagInput(""));
  }, Ye = async () => {
    if (!g.editTagModal) return;
    const { taskId: b, currentTag: M } = g.editTagModal, L = M?.split(" ").filter(Boolean) || [], R = g.editTagInput.trim() ? g.editTagInput.trim().replace(/\s+/g, "-").split("#").filter(Boolean).map((ne) => ne.trim()) : [];
    for (const ne of R)
      await oe(ne);
    const Y = [.../* @__PURE__ */ new Set([...L, ...R])].sort().join(" ");
    await E(b, { tag: Y }), g.setEditTagModal(null), g.setEditTagInput("");
  }, Ge = (b) => {
    if (!g.editTagModal) return;
    const { taskId: M, currentTag: L } = g.editTagModal, R = L?.split(" ").filter(Boolean) || [];
    if (R.includes(b)) {
      const Y = R.filter((ne) => ne !== b).sort().join(" ");
      g.setEditTagModal({ taskId: M, currentTag: Y });
    } else {
      const Y = [...R, b].sort().join(" ");
      g.setEditTagModal({ taskId: M, currentTag: Y });
    }
  }, ve = (b) => ra(b, I?.boards || []), Ze = async (b) => {
    const M = b.trim(), L = ve(M);
    if (L) {
      g.setValidationError(L);
      return;
    }
    try {
      await F(M), g.pendingTaskOperation?.type === "move-to-board" && g.pendingTaskOperation.taskIds.length > 0 && (await z(M, g.pendingTaskOperation.taskIds), _.clearSelection()), g.setPendingTaskOperation(null), g.setValidationError(null), g.setShowNewBoardDialog(!1), g.setInputValue("");
    } catch (R) {
      console.error("[App] Failed to create board:", R), g.setValidationError(R.message || "Failed to create board");
    }
  }, Qe = I?.boards?.find((b) => b.id === w)?.tags || [], et = Array.from(/* @__PURE__ */ new Set([...Qe, ...Ue(y)])), tt = Ct(y, te ? 3 : 6);
  return u ? /* @__PURE__ */ i(
    "div",
    {
      ref: s,
      className: "task-app-container task-app-fade-in",
      "data-dark-theme": V ? "true" : "false",
      onMouseDown: _.selectionStartHandler,
      onMouseMove: _.selectionMoveHandler,
      onMouseUp: _.selectionEndHandler,
      onMouseLeave: _.selectionEndHandler,
      onClick: (b) => {
        try {
          const M = b.target;
          if (M.closest && M.closest(".theme-picker"))
            return;
          if (!M.closest || !M.closest(".task-app__item")) {
            if (_.selectionJustEndedAt && Date.now() - _.selectionJustEndedAt < At)
              return;
            _.clearSelection();
          }
        } catch {
        }
      },
      children: /* @__PURE__ */ m("div", { className: "task-app", children: [
        /* @__PURE__ */ i(
          Jt,
          {
            theme: U,
            experimentalThemes: v.experimentalThemes || !1,
            showThemePicker: W,
            onThemePickerToggle: () => J(!W),
            onThemeChange: q,
            onSettingsClick: () => g.setShowSettingsModal(!0),
            THEME_FAMILIES: X
          }
        ),
        /* @__PURE__ */ i(
          Vt,
          {
            boards: I,
            currentBoardId: w,
            userType: n,
            dragOverFilter: _.dragOverFilter,
            onBoardSwitch: K,
            onBoardContextMenu: (b, M, L) => g.setBoardContextMenu({ boardId: b, x: M, y: L }),
            onDragOverFilter: _.setDragOverFilter,
            onMoveTasksToBoard: z,
            onClearSelection: _.clearSelection,
            onCreateBoardClick: () => {
              g.setInputValue(""), g.setValidationError(null), g.setShowNewBoardDialog(!0);
            },
            onPendingOperation: g.setPendingTaskOperation,
            onInitialLoad: f
          }
        ),
        /* @__PURE__ */ i("div", { className: "task-app__controls", children: /* @__PURE__ */ i(
          "input",
          {
            ref: a,
            className: "task-app__input",
            placeholder: l,
            onKeyDown: (b) => {
              b.key === "Enter" && !b.shiftKey && (b.preventDefault(), Ve(b.target.value)), b.key === "k" && (b.ctrlKey || b.metaKey) && (b.preventDefault(), a.current?.focus());
            }
          }
        ) }),
        /* @__PURE__ */ i(
          qt,
          {
            tags: et,
            selectedFilters: d,
            dragOverFilter: _.dragOverFilter,
            onToggleFilter: (b) => {
              c((M) => {
                const L = new Set(M);
                return L.has(b) ? L.delete(b) : L.add(b), L;
              });
            },
            onTagContextMenu: (b, M, L) => g.setTagContextMenu({ tag: b, x: M, y: L }),
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
            tasks: y,
            topTags: tt,
            isMobile: te,
            filters: Array.from(d),
            selectedIds: _.selectedIds,
            onSelectionStart: _.selectionStartHandler,
            onSelectionMove: _.selectionMoveHandler,
            onSelectionEnd: _.selectionEndHandler,
            sortDirections: re.sortDirections,
            dragOverTag: _.dragOverTag,
            pendingOperations: x,
            onComplete: S,
            onDelete: B,
            onEditTag: ze,
            onDragStart: _.onDragStart,
            onDragEnd: _.onDragEnd,
            onDragOver: _.onDragOver,
            onDragLeave: _.onDragLeave,
            onDrop: _.onDrop,
            toggleSort: re.toggleSort,
            sortTasksByAge: re.sortTasksByAge,
            getSortIcon: re.getSortIcon,
            getSortTitle: re.getSortTitle,
            deleteTag: Xe,
            onDeletePersistedTag: ue,
            showCompleteButton: ae,
            showDeleteButton: Q,
            showTagButton: k
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
            onConfirm: O
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
            onInputChange: (b) => {
              g.setInputValue(b), g.setValidationError(null);
            },
            validateBoardName: ve
          }
        ),
        /* @__PURE__ */ i(
          Qt,
          {
            isOpen: g.showNewTagDialog,
            inputValue: g.inputValue,
            tasks: y,
            pendingTaskOperation: g.pendingTaskOperation,
            onClose: () => {
              g.setShowNewTagDialog(!1), g.setPendingTaskOperation(null);
            },
            onConfirm: qe,
            onInputChange: g.setInputValue
          }
        ),
        /* @__PURE__ */ i(
          ta,
          {
            isOpen: g.showSettingsModal,
            preferences: v,
            showCompleteButton: ae,
            showDeleteButton: Q,
            showTagButton: k,
            onClose: () => g.setShowSettingsModal(!1),
            onSavePreferences: N,
            onValidateKey: async (b) => await le(n, p).validateKey(b)
          }
        ),
        /* @__PURE__ */ i(
          aa,
          {
            isOpen: !!g.editTagModal,
            taskId: g.editTagModal?.taskId || null,
            currentTag: g.editTagModal?.currentTag || null,
            editTagInput: g.editTagInput,
            boards: I,
            currentBoardId: w,
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
            boards: I,
            onClose: () => g.setBoardContextMenu(null),
            onDeleteBoard: P
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
            onDeleteTag: O
          }
        )
      ] })
    }
  ) : /* @__PURE__ */ i(Wt, { isDarkTheme: o });
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
