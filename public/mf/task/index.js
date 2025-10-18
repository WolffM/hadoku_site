import { jsx as c, jsxs as y, Fragment as ft } from "react/jsx-runtime";
import { createRoot as kt } from "react-dom/client";
import { useState as _, useMemo as qe, useEffect as j, useRef as de } from "react";
const J = `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
class Tt {
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
function yt() {
  const t = Date.now().toString(36).toUpperCase().padStart(8, "0"), e = crypto.getRandomValues(new Uint8Array(18)), a = Array.from(e).map((o) => (o % 36).toString(36).toUpperCase()).join("");
  return t + a;
}
function Z() {
  return (/* @__PURE__ */ new Date()).toISOString();
}
function be(t, e) {
  const a = t.tasks.findIndex((o) => o.id === e);
  if (a < 0)
    throw new Error("Task not found");
  return { task: t.tasks[a], index: a };
}
function me(t, e) {
  const a = t.boards.findIndex((o) => o.id === e);
  if (a < 0)
    throw new Error(`Board ${e} not found`);
  return { board: t.boards[a], index: a };
}
function Se(t, e, a, o) {
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
function wt(t, e, a) {
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
function vt(t, e, a) {
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
function De(t, e, a) {
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
function bt(t, e, a) {
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
async function St(t, e) {
  const a = await t.getBoards(e.userType, e.userId), o = await Promise.all(
    a.boards.map(async (s) => {
      const n = await t.getTasks(e.userType, e.userId, s.id), r = await t.getStats(e.userType, e.userId, s.id);
      return {
        ...s,
        tasks: n.tasks,
        stats: r
      };
    })
  );
  return {
    ...a,
    boards: o
  };
}
async function Dt(t, e, a, o = "main") {
  const s = Z(), n = await t.getTasks(e.userType, e.userId, o), r = await t.getStats(e.userType, e.userId, o), i = a.id || yt(), d = a.createdAt || s, h = {
    id: i,
    title: a.title,
    tag: a.tag ?? null,
    state: "Active",
    createdAt: d
  }, u = {
    ...n,
    tasks: [h, ...n.tasks],
    updatedAt: s
  }, k = wt(r, h, s);
  return await t.saveTasks(e.userType, e.userId, o, u), await t.saveStats(e.userType, e.userId, o, k), { ok: !0, id: i };
}
async function Ct(t, e, a, o, s = "main") {
  const n = Z(), r = await t.getTasks(e.userType, e.userId, s), i = await t.getStats(e.userType, e.userId, s), { task: d, index: h } = be(r, a), u = {
    ...d,
    ...o,
    updatedAt: n
  }, k = [...r.tasks];
  k[h] = u;
  const B = {
    ...r,
    tasks: k,
    updatedAt: n
  }, x = De(i, u, n);
  return await t.saveTasks(e.userType, e.userId, s, B), await t.saveStats(e.userType, e.userId, s, x), { ok: !0, message: `Task ${a} updated` };
}
async function xt(t, e, a, o = "main") {
  const s = Z(), n = await t.getTasks(e.userType, e.userId, o), r = await t.getStats(e.userType, e.userId, o), { task: i, index: d } = be(n, a), h = {
    ...i,
    state: "Completed",
    closedAt: s,
    updatedAt: s
  }, u = [...n.tasks];
  u.splice(d, 1);
  const k = {
    ...n,
    tasks: u,
    updatedAt: s
  }, B = vt(r, h, s);
  return await t.saveTasks(e.userType, e.userId, o, k), await t.saveStats(e.userType, e.userId, o, B), { ok: !0, message: `Task ${a} completed` };
}
async function At(t, e, a, o = "main") {
  const s = Z(), n = await t.getTasks(e.userType, e.userId, o), r = await t.getStats(e.userType, e.userId, o), { task: i, index: d } = be(n, a), h = {
    ...i,
    state: "Deleted",
    closedAt: s,
    updatedAt: s
  }, u = [...n.tasks];
  u.splice(d, 1);
  const k = {
    ...n,
    tasks: u,
    updatedAt: s
  }, B = bt(r, h, s);
  return await t.saveTasks(e.userType, e.userId, o, k), await t.saveStats(e.userType, e.userId, o, B), { ok: !0, message: `Task ${a} deleted` };
}
async function Bt(t, e, a) {
  const o = Z(), s = await t.getBoards(e.userType, e.userId);
  if (s.boards.find((i) => i.id === a.id))
    throw new Error(`Board ${a.id} already exists`);
  const n = {
    id: a.id,
    name: a.name,
    tasks: [],
    tags: []
  }, r = {
    ...s,
    updatedAt: o,
    boards: [...s.boards, n]
  };
  return await t.saveBoards(e.userType, r, e.userId), { ok: !0, board: n };
}
async function _t(t, e, a) {
  if (a === "main")
    throw new Error("Cannot delete the main board");
  const o = Z(), s = await t.getBoards(e.userType, e.userId);
  me(s, a);
  const n = {
    ...s,
    updatedAt: o,
    boards: s.boards.filter((r) => r.id !== a)
  };
  return await t.saveBoards(e.userType, n, e.userId), { ok: !0, message: `Board ${a} deleted` };
}
async function Nt(t, e, a) {
  const o = Z(), s = await t.getBoards(e.userType, e.userId), { board: n, index: r } = me(s, a.boardId), i = n.tags || [];
  if (i.includes(a.tag))
    return { ok: !0, message: `Tag ${a.tag} already exists` };
  const d = {
    ...n,
    tags: [...i, a.tag]
  }, h = Se(s, r, d, o);
  return await t.saveBoards(e.userType, h, e.userId), { ok: !0, message: `Tag ${a.tag} added to board ${a.boardId}` };
}
async function Lt(t, e, a) {
  const o = Z(), s = await t.getBoards(e.userType, e.userId), { board: n, index: r } = me(s, a.boardId), i = n.tags || [], d = {
    ...n,
    tags: i.filter((u) => u !== a.tag)
  }, h = Se(s, r, d, o);
  return await t.saveBoards(e.userType, h, e.userId), { ok: !0, message: `Tag ${a.tag} removed from board ${a.boardId}` };
}
async function Ot(t, e, a) {
  const o = Z(), s = await t.getTasks(e.userType, e.userId, a.boardId), n = await t.getStats(e.userType, e.userId, a.boardId);
  let r = 0;
  const i = s.tasks.map((u) => {
    const k = a.updates.find((B) => B.taskId === u.id);
    return k ? (r++, {
      ...u,
      tag: k.tag || void 0,
      updatedAt: o
    }) : u;
  }), d = {
    ...s,
    tasks: i,
    updatedAt: o
  };
  let h = n;
  for (const u of i)
    a.updates.find((k) => k.taskId === u.id) && (h = De(h, u, o));
  return await t.saveTasks(e.userType, e.userId, a.boardId, d), await t.saveStats(e.userType, e.userId, a.boardId, h), {
    ok: !0,
    message: `Updated ${r} task(s) on board ${a.boardId}`,
    updated: r
  };
}
async function Et(t, e, a) {
  const o = Z(), s = await t.getTasks(e.userType, e.userId, a.boardId), n = await t.getStats(e.userType, e.userId, a.boardId), r = await t.getBoards(e.userType, e.userId);
  let i = 0;
  const d = s.tasks.map((O) => {
    if (a.taskIds.includes(O.id) && O.tag) {
      const X = O.tag.split(" ").filter(Boolean).filter((P) => P !== a.tag);
      return i++, {
        ...O,
        tag: X.length > 0 ? X.join(" ") : void 0,
        updatedAt: o
      };
    }
    return O;
  }), h = {
    ...s,
    tasks: d,
    updatedAt: o
  };
  let u = n;
  for (const O of d)
    a.taskIds.includes(O.id) && (u = De(u, O, o));
  const { board: k, index: B } = me(r, a.boardId), x = k.tags || [], L = {
    ...k,
    tags: x.filter((O) => O !== a.tag)
  }, M = Se(r, B, L, o);
  return await t.saveTasks(e.userType, e.userId, a.boardId, h), await t.saveStats(e.userType, e.userId, a.boardId, u), await t.saveBoards(e.userType, M, e.userId), {
    ok: !0,
    message: `Cleared tag ${a.tag} from ${i} task(s) on board ${a.boardId}`,
    cleared: i
  };
}
function z(t, e, a = 50) {
  setTimeout(() => {
    try {
      const o = new BroadcastChannel("tasks");
      o.postMessage({ type: t, ...e }), o.close();
    } catch (o) {
      console.error("[localStorageApi] Broadcast failed:", o);
    }
  }, a);
}
function It(t = "public", e = "public") {
  const a = new Tt(t, e), o = { userType: "registered", userId: e };
  return {
    async getBoards() {
      const s = await St(a, o), n = {
        version: s.version,
        updatedAt: s.updatedAt,
        boards: []
      };
      for (const r of s.boards) {
        const i = await a.getTasks(t, e, r.id), d = await a.getStats(t, e, r.id);
        n.boards.push({
          id: r.id,
          name: r.name,
          tasks: i.tasks,
          stats: d,
          tags: r.tags || []
        });
      }
      return n;
    },
    async createBoard(s) {
      console.debug("[localStorageApi] createBoard (using handler)", { userType: t, userId: e, boardId: s });
      const n = await Bt(
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
      }), z("boards-updated", { sessionId: J, userType: t, userId: e }), n.board;
    },
    async deleteBoard(s) {
      await _t(
        a,
        o,
        s
      ), await a.deleteBoardData(t, e, s), z("boards-updated", { sessionId: J, userType: t, userId: e });
    },
    async getTasks(s = "main") {
      return a.getTasks(t, e, s);
    },
    async getStats(s = "main") {
      return a.getStats(t, e, s);
    },
    async createTask(s, n = "main", r = !1) {
      console.log("[localStorageApi] createTask (using handler)", { data: s, boardId: n, suppressBroadcast: r });
      const i = await Dt(
        a,
        o,
        s,
        n
      ), h = (await a.getTasks(t, e, n)).tasks.find((u) => u.id === i.id);
      if (!h)
        throw new Error("Task creation failed - task not found after creation");
      return r ? console.log("[localStorageApi] createTask: broadcast suppressed") : (console.log("[localStorageApi] createTask: broadcasting", {
        sessionId: J,
        boardId: n,
        taskId: i.id
      }), z("tasks-updated", { sessionId: J, userType: t, userId: e, boardId: n })), h;
    },
    async patchTask(s, n, r = "main", i = !1) {
      const d = {};
      n.title !== void 0 && (d.title = n.title), n.tag !== void 0 && n.tag !== null && (d.tag = n.tag), await Ct(
        a,
        o,
        s,
        d,
        r
      ), i || z("tasks-updated", { sessionId: J, userType: t, userId: e, boardId: r });
      const u = (await a.getTasks(t, e, r)).tasks.find((k) => k.id === s);
      if (!u)
        throw new Error("Task not found after update");
      return u;
    },
    async completeTask(s, n = "main") {
      const i = (await a.getTasks(t, e, n)).tasks.find((d) => d.id === s);
      if (!i)
        throw new Error("Task not found");
      return await xt(
        a,
        o,
        s,
        n
      ), z("tasks-updated", { sessionId: J, userType: t, userId: e, boardId: n }), {
        ...i,
        state: "Completed",
        closedAt: (/* @__PURE__ */ new Date()).toISOString(),
        updatedAt: (/* @__PURE__ */ new Date()).toISOString()
      };
    },
    async deleteTask(s, n = "main", r = !1) {
      console.log("[localStorageApi] deleteTask (using handler)", { id: s, boardId: n, suppressBroadcast: r });
      const d = (await a.getTasks(t, e, n)).tasks.find((h) => h.id === s);
      if (!d)
        throw new Error("Task not found");
      return await At(
        a,
        o,
        s,
        n
      ), r ? console.log("[localStorageApi] deleteTask: broadcast suppressed") : (console.log("[localStorageApi] deleteTask: broadcasting", { sessionId: J }), z("tasks-updated", { sessionId: J, userType: t, userId: e, boardId: n })), {
        ...d,
        state: "Deleted",
        closedAt: (/* @__PURE__ */ new Date()).toISOString(),
        updatedAt: (/* @__PURE__ */ new Date()).toISOString()
      };
    },
    async createTag(s, n = "main") {
      await Nt(
        a,
        o,
        { boardId: n, tag: s }
      ), z("boards-updated", { sessionId: J, userType: t, userId: e, boardId: n });
    },
    async deleteTag(s, n = "main") {
      await Lt(
        a,
        o,
        { boardId: n, tag: s }
      ), z("boards-updated", { sessionId: J, userType: t, userId: e, boardId: n });
    },
    // User preferences (server-synced settings only, NOT theme)
    async getPreferences() {
      const s = `${t}-${e}-preferences`, n = localStorage.getItem(s);
      if (n) {
        const r = JSON.parse(n), { theme: i, ...d } = r;
        return d;
      }
      return {
        version: 1,
        updatedAt: (/* @__PURE__ */ new Date()).toISOString()
      };
    },
    async savePreferences(s) {
      const n = `${t}-${e}-preferences`, i = {
        ...await this.getPreferences(),
        ...s,
        version: 1,
        updatedAt: (/* @__PURE__ */ new Date()).toISOString()
      };
      localStorage.setItem(n, JSON.stringify(i));
    },
    // Batch operations
    async batchMoveTasks(s, n, r) {
      const i = await this.getBoards(), d = i.boards.find((L) => L.id === s), h = i.boards.find((L) => L.id === n);
      if (!d)
        throw new Error(`Source board ${s} not found`);
      if (!h)
        throw new Error(`Target board ${n} not found`);
      const u = d.tasks.filter((L) => r.includes(L.id));
      d.tasks = d.tasks.filter((L) => !r.includes(L.id)), h.tasks = [...h.tasks, ...u], i.updatedAt = (/* @__PURE__ */ new Date()).toISOString();
      const k = `${t}-${e}-boards`;
      localStorage.setItem(k, JSON.stringify(i));
      const B = `${t}-${e}-${s}-tasks`, x = `${t}-${e}-${n}-tasks`;
      return localStorage.setItem(B, JSON.stringify({
        version: 1,
        updatedAt: i.updatedAt,
        tasks: d.tasks
      })), localStorage.setItem(x, JSON.stringify({
        version: 1,
        updatedAt: i.updatedAt,
        tasks: h.tasks
      })), z("boards-updated", { sessionId: J, userType: t, userId: e }), { ok: !0, moved: u.length };
    },
    async batchUpdateTags(s, n) {
      console.log("[localStorageApi] batchUpdateTags", { boardId: s, updates: n }), await Ot(
        a,
        o,
        { boardId: s, updates: n }
      ), z("tasks-updated", { sessionId: J, userType: t, userId: e, boardId: s });
    },
    async batchClearTag(s, n, r) {
      console.log("[localStorageApi] batchClearTag START", { boardId: s, tag: n, taskIds: r, taskCount: r.length });
      const i = await Et(
        a,
        o,
        { boardId: s, tag: n, taskIds: r }
      );
      console.log("[localStorageApi] batchClearTag result:", i), z("boards-updated", { sessionId: J, userType: t, userId: e, boardId: s }), console.log("[localStorageApi] batchClearTag END");
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
async function $t(t, e, a, o) {
  for (const r of e.boards || []) {
    const i = r.id;
    if (r.tasks && r.tasks.length > 0) {
      const d = `${a}-${o}-${i}-tasks`, h = {
        version: 1,
        updatedAt: e.updatedAt || (/* @__PURE__ */ new Date()).toISOString(),
        tasks: r.tasks
      };
      window.localStorage.setItem(d, JSON.stringify(h));
    }
    if (r.stats) {
      const d = `${a}-${o}-${i}-stats`;
      window.localStorage.setItem(d, JSON.stringify(r.stats));
    }
  }
  const s = `${a}-${o}-boards`, n = {
    version: 1,
    updatedAt: e.updatedAt || (/* @__PURE__ */ new Date()).toISOString(),
    boards: (e.boards || []).map((r) => ({
      id: r.id,
      name: r.name,
      tags: r.tags || []
    }))
  };
  window.localStorage.setItem(s, JSON.stringify(n)), console.log("[api] Synced API data to localStorage:", {
    boards: e.boards?.length || 0,
    totalTasks: e.boards?.reduce((r, i) => r + (i.tasks?.length || 0), 0) || 0
  });
}
function K(t, e, a) {
  const o = {
    "Content-Type": "application/json",
    "X-User-Type": t
  };
  return e && (o["X-User-Id"] = e), a && (o["X-Session-Id"] = a), o;
}
function he(t = "public", e = "public", a) {
  const o = It(t, e);
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
          headers: K(t, e, a)
        });
        if (!s.ok)
          throw new Error(`API returned ${s.status}`);
        const n = await s.json();
        if (!n || !n.boards || !Array.isArray(n.boards)) {
          console.error("[api] Invalid response structure:", n);
          return;
        }
        console.log("[api] Synced from API:", { boards: n.boards.length, totalTasks: n.boards.reduce((r, i) => r + (i.tasks?.length || 0), 0) }), await $t(o, n, t, e);
      } catch (s) {
        console.error("[api] Sync from API failed:", s);
      }
    },
    async createTask(s, n = "main", r = !1) {
      const i = await o.createTask(s, n, r);
      return fetch("/task/api", {
        method: "POST",
        headers: K(t, e, a),
        body: JSON.stringify({
          id: s.id || i.id,
          // Use provided ID (for moves) or client-generated ID
          ...s,
          boardId: n
        })
      }).then((d) => d.json()).then((d) => {
        d.ok && (d.id === i.id ? console.log("[api] Background sync: createTask completed (ID matched)") : console.warn("[api] Server returned different ID (unexpected):", { client: i.id, server: d.id }));
      }).catch((d) => console.error("[api] Failed to sync createTask:", d)), i;
    },
    async createTag(s, n = "main") {
      const r = await o.createTag(s, n);
      return fetch("/task/api/tags", {
        method: "POST",
        headers: K(t, e, a),
        body: JSON.stringify({ boardId: n, tag: s })
      }).then(() => console.log("[api] Background sync: createTag completed")).catch((i) => console.error("[api] Failed to sync createTag:", i)), r;
    },
    async deleteTag(s, n = "main") {
      const r = await o.deleteTag(s, n);
      return fetch("/task/api/tags/delete", {
        method: "POST",
        headers: K(t, e, a),
        body: JSON.stringify({ boardId: n, tag: s })
      }).then(() => console.log("[api] Background sync: deleteTag completed")).catch((i) => console.error("[api] Failed to sync deleteTag:", i)), r;
    },
    async patchTask(s, n, r = "main", i = !1) {
      const d = await o.patchTask(s, n, r, i);
      return fetch(`/task/api/${s}`, {
        method: "PATCH",
        headers: K(t, e, a),
        body: JSON.stringify({ ...n, boardId: r })
      }).then(() => console.log("[api] Background sync: patchTask completed")).catch((h) => console.error("[api] Failed to sync patchTask:", h)), d;
    },
    async completeTask(s, n = "main") {
      const r = await o.completeTask(s, n);
      return fetch(`/task/api/${s}/complete`, {
        method: "POST",
        headers: K(t, e, a),
        body: JSON.stringify({ boardId: n })
      }).then((i) => {
        if (!i.ok) throw new Error(`HTTP ${i.status}`);
        console.log("[api] Background sync: completeTask completed");
      }).catch((i) => console.error("[api] Failed to sync completeTask:", i)), r;
    },
    async deleteTask(s, n = "main", r = !1) {
      await o.deleteTask(s, n, r), fetch(`/task/api/${s}`, {
        method: "DELETE",
        headers: K(t, e, a),
        body: JSON.stringify({ boardId: n })
      }).then((i) => {
        if (!i.ok) throw new Error(`HTTP ${i.status}`);
        console.log("[api] Background sync: deleteTask completed");
      }).catch((i) => console.error("[api] Failed to sync deleteTask:", i));
    },
    // Board operations
    async createBoard(s) {
      const n = await o.createBoard(s);
      return fetch("/task/api/boards", {
        method: "POST",
        headers: K(t, e, a),
        body: JSON.stringify({ id: s, name: s })
      }).then(() => console.log("[api] Background sync: createBoard completed")).catch((r) => console.error("[api] Failed to sync createBoard:", r)), n;
    },
    async deleteBoard(s) {
      const n = await o.deleteBoard(s);
      return fetch(`/task/api/boards/${encodeURIComponent(s)}`, {
        method: "DELETE",
        headers: K(t, e, a)
      }).then(() => console.log("[api] Background sync: deleteBoard completed")).catch((r) => console.error("[api] Failed to sync deleteBoard:", r)), n;
    },
    // User preferences
    async getPreferences() {
      try {
        const s = await fetch("/task/api/preferences", {
          headers: K(t, e, a)
        });
        if (s.ok) {
          const n = await s.json();
          return await o.savePreferences(n), console.log("[api] Synced preferences from server"), n;
        }
      } catch (s) {
        console.warn("[api] Failed to fetch preferences from server, using localStorage:", s);
      }
      return await o.getPreferences();
    },
    async savePreferences(s) {
      await o.savePreferences(s), fetch("/task/api/preferences", {
        method: "PUT",
        headers: K(t, e, a),
        body: JSON.stringify(s)
      }).then(() => console.log("[api] Background sync: savePreferences completed")).catch((n) => console.error("[api] Failed to sync savePreferences:", n));
    },
    // Batch operations
    async batchUpdateTags(s, n) {
      await o.batchUpdateTags(s, n), fetch("/task/api/batch-tag", {
        method: "PATCH",
        headers: K(t, e, a),
        body: JSON.stringify({ boardId: s, updates: n })
      }).then(() => console.log("[api] Background sync: batchUpdateTags completed")).catch((r) => console.error("[api] Failed to sync batchUpdateTags:", r));
    },
    async batchMoveTasks(s, n, r) {
      const i = await o.batchMoveTasks(s, n, r);
      return fetch("/task/api/batch-move", {
        method: "POST",
        headers: K(t, e, a),
        body: JSON.stringify({ sourceBoardId: s, targetBoardId: n, taskIds: r })
      }).then(() => console.log("[api] Background sync: batchMoveTasks completed")).catch((d) => console.error("[api] Failed to sync batchMoveTasks:", d)), i;
    },
    async batchClearTag(s, n, r) {
      await o.batchClearTag(s, n, r), fetch("/task/api/batch-clear-tag", {
        method: "POST",
        headers: K(t, e, a),
        body: JSON.stringify({ boardId: s, tag: n, taskIds: r })
      }).then(() => console.log("[api] Background sync: batchClearTag completed")).catch((i) => console.error("[api] Failed to sync batchClearTag:", i));
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
          headers: K(t, e, a),
          body: JSON.stringify({ newUserId: s })
        })).json();
      } catch (n) {
        return console.error("[api] Failed to set userId:", n), { ok: !1, message: "Failed to set userId" };
      }
    }
  };
}
function Ft(t) {
  t = t.trim();
  const e = (s) => s.trim().replace(/\s+/g, "-"), a = t.match(/^["']([^"']+)["']\s*(.*)$/);
  if (a) {
    const s = a[1].trim(), r = a[2].match(/#[^\s#]+/g)?.map((i) => e(i.slice(1))).filter(Boolean) || [];
    return { title: s, tag: r.length ? r.join(" ") : void 0 };
  }
  const o = t.match(/^(.+?)\s+(#.+)$/);
  if (o) {
    const s = o[1].trim(), r = o[2].match(/#[^\s#]+/g)?.map((i) => e(i.slice(1))).filter(Boolean) || [];
    return { title: s, tag: r.length ? r.join(" ") : void 0 };
  }
  return { title: t.trim() };
}
function Mt(t, e = 6, a = []) {
  const o = t.flatMap((n) => n.tag?.split(" ") || []).filter(Boolean), s = {};
  return o.forEach((n) => s[n] = (s[n] || 0) + 1), a.filter(Boolean).forEach((n) => {
    s[n] || (s[n] = 0);
  }), Object.entries(s).sort((n, r) => r[1] - n[1]).slice(0, e).map(([n]) => n);
}
function Ee(t, e) {
  return t.filter((a) => a.tag?.split(" ").includes(e));
}
function Pt(t, e, a) {
  const o = Array.isArray(a) && a.length > 0;
  return t.filter((s) => {
    const n = s.tag?.split(" ") || [];
    return o ? a.some((i) => n.includes(i)) && !e.some((i) => n.includes(i)) : !e.some((r) => n.includes(r));
  });
}
function ye(t) {
  return Array.from(new Set(t.flatMap((e) => e.tag?.split(" ") || []).filter(Boolean)));
}
async function Ie(t, e, a, o, s = {}) {
  const { onError: n, suppress404: r = !0 } = s;
  if (e.has(t)) {
    console.log(`[withPendingOperation] Operation already pending: ${t}`);
    return;
  }
  a((i) => /* @__PURE__ */ new Set([...i, t]));
  try {
    return await o();
  } catch (i) {
    r && i?.message?.includes("404") || (n ? n(i) : console.error(`[withPendingOperation] Error in ${t}:`, i));
    return;
  } finally {
    a((i) => {
      const d = new Set(i);
      return d.delete(t), d;
    });
  }
}
function le(t, e) {
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
function Rt({ userType: t, userId: e, sessionId: a }) {
  const [o, s] = _([]), [n, r] = _(/* @__PURE__ */ new Set()), i = qe(
    () => he(t, e || "public", a),
    [t, e, a]
  ), [d, h] = _(null), [u, k] = _("main");
  async function B() {
    console.log("[useTasks] initialLoad called"), "syncFromApi" in i && await i.syncFromApi(), await x();
  }
  async function x() {
    console.log("[useTasks] reload called", { currentBoardId: u, stack: new Error().stack?.split(`
`).slice(1, 4).join(`
`) });
    const f = await i.getBoards();
    h(f);
    const { tasks: T } = le(f, u);
    s(T);
  }
  j(() => {
    console.log("[useTasks] User context changed, clearing state and reloading", { userType: t, userId: e }), s([]), r(/* @__PURE__ */ new Set()), h(null), k("main"), x();
  }, [t, e]), j(() => {
    console.log("[useTasks] Setting up BroadcastChannel listener", { currentBoardId: u, userType: t, userId: e });
    try {
      const f = new BroadcastChannel("tasks");
      return f.onmessage = (T) => {
        const g = T.data || {};
        if (console.log("[useTasks] BroadcastChannel message received", { msg: g, sessionId: J, currentBoardId: u, currentContext: { userType: t, userId: e } }), g.sessionId === J) {
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
        (g.type === "tasks-updated" || g.type === "boards-updated") && (console.log("[useTasks] BroadcastChannel: triggering reload for currentBoardId =", u), x());
      }, () => {
        console.log("[useTasks] Cleaning up BroadcastChannel listener", { currentBoardId: u }), f.close();
      };
    } catch (f) {
      console.error("[useTasks] Failed to setup BroadcastChannel", f);
    }
  }, [u, t, e]);
  async function L(f) {
    if (f = f.trim(), !!f)
      try {
        const T = Ft(f);
        return await i.createTask(T, u), await x(), !0;
      } catch (T) {
        return alert(T.message || "Failed to create task"), !1;
      }
  }
  async function M(f) {
    await Ie(
      `complete-${f}`,
      n,
      r,
      async () => {
        await i.completeTask(f, u), await x();
      },
      {
        onError: (T) => alert(T.message || "Failed to complete task")
      }
    );
  }
  async function O(f) {
    console.log("[useTasks] deleteTask START", { taskId: f, currentBoardId: u }), await Ie(
      `delete-${f}`,
      n,
      r,
      async () => {
        console.log("[useTasks] deleteTask: calling api.deleteTask", { taskId: f, currentBoardId: u }), await i.deleteTask(f, u), console.log("[useTasks] deleteTask: calling reload"), await x(), console.log("[useTasks] deleteTask END");
      },
      {
        onError: (T) => alert(T.message || "Failed to delete task")
      }
    );
  }
  async function W(f) {
    const T = prompt("Enter tag (without #):");
    if (!T) return;
    const g = T.trim().replace(/^#+/, "").replace(/\s+/g, "-"), m = o.find((D) => D.id === f);
    if (!m) return;
    const v = m.tag?.split(" ") || [];
    if (v.includes(g)) return;
    const S = [...v, g].join(" ");
    try {
      await i.patchTask(f, { tag: S }, u), await x();
    } catch (D) {
      alert(D.message || "Failed to add tag");
    }
  }
  async function X(f, T, g = {}) {
    const { suppressBroadcast: m = !1, skipReload: v = !1 } = g;
    try {
      await i.patchTask(f, T, u, m), v || await x();
    } catch (S) {
      throw S;
    }
  }
  async function P(f) {
    console.log("[useTasks] bulkUpdateTaskTags START", { count: f.length });
    try {
      await i.batchUpdateTags(
        u,
        f.map((T) => ({ taskId: T.taskId, tag: T.tag || null }))
      ), console.log("[useTasks] bulkUpdateTaskTags: calling reload"), await x(), console.log("[useTasks] bulkUpdateTaskTags END");
    } catch (T) {
      throw console.error("[useTasks] bulkUpdateTaskTags ERROR", T), T;
    }
  }
  async function $(f) {
    console.log("[useTasks] deleteTag START", { tag: f, currentBoardId: u, taskCount: o.length });
    const T = o.filter((g) => g.tag?.split(" ").includes(f));
    if (console.log("[useTasks] deleteTag: found tasks with tag", { tag: f, count: T.length }), T.length === 0) {
      console.log("[useTasks] deleteTag: no tasks found with this tag, just deleting tag");
      try {
        await i.deleteTag(f, u), await x(), console.log("[useTasks] deleteTag END (no tasks to clear)");
      } catch (g) {
        console.error("[useTasks] deleteTag ERROR", g), console.error("[useTasks] deleteTag: Please fix this error:", g.message);
      }
      return;
    }
    try {
      console.log("[useTasks] deleteTag: starting batch clear"), await i.batchClearTag(
        u,
        f,
        T.map((g) => g.id)
      ), console.log("[useTasks] deleteTag: calling reload"), await x(), console.log("[useTasks] deleteTag END");
    } catch (g) {
      console.error("[useTasks] deleteTag ERROR", g), alert(g.message || "Failed to remove tag from tasks");
    }
  }
  async function q(f) {
    await i.createBoard(f), k(f);
    const T = await i.getBoards();
    h(T);
    const { tasks: g } = le(T, f);
    s(g);
  }
  async function U(f, T) {
    if (console.log("[useTasks] moveTasksToBoard START", { targetBoardId: f, ids: T, currentBoardId: u }), !d) return;
    const g = /* @__PURE__ */ new Set();
    for (const m of d.boards)
      for (const v of m.tasks || [])
        T.includes(v.id) && g.add(m.id);
    console.log("[useTasks] moveTasksToBoard: source boards", { sourceBoardIds: Array.from(g) });
    try {
      if (g.size === 1) {
        const S = Array.from(g)[0];
        console.log("[useTasks] moveTasksToBoard: using batch API"), await i.batchMoveTasks(S, f, T);
      } else
        throw console.error("[useTasks] moveTasksToBoard: Cannot move tasks from multiple boards at once"), new Error("Cannot move tasks from multiple boards at once");
      console.log("[useTasks] moveTasksToBoard: switching to target board", { targetBoardId: f }), k(f);
      const m = await i.getBoards();
      h(m);
      const { tasks: v } = le(m, f);
      s(v), console.log("[useTasks] moveTasksToBoard END");
    } catch (m) {
      console.error("[useTasks] moveTasksToBoard ERROR", m), alert(m.message || "Failed to move tasks");
    }
  }
  async function Q(f) {
    if (await i.deleteBoard(f), u === f) {
      k("main");
      const T = await i.getBoards();
      h(T);
      const { tasks: g } = le(T, "main");
      s(g);
    } else
      await x();
  }
  async function re(f) {
    await i.createTag(f, u), await x();
  }
  async function Y(f) {
    await i.deleteTag(f, u), await x();
  }
  function H(f) {
    k(f);
    const { tasks: T, foundBoard: g } = le(d, f);
    g ? s(T) : x();
  }
  return {
    // Task state
    tasks: o,
    pendingOperations: n,
    // Task operations
    addTask: L,
    completeTask: M,
    deleteTask: O,
    addTagToTask: W,
    updateTaskTags: X,
    bulkUpdateTaskTags: P,
    deleteTag: $,
    // Board state
    boards: d,
    currentBoardId: u,
    // Board operations
    createBoard: q,
    deleteBoard: Q,
    switchBoard: H,
    moveTasksToBoard: U,
    createTagOnBoard: re,
    deleteTagOnBoard: Y,
    // Lifecycle
    initialLoad: B,
    reload: x
  };
}
function Ut({ tasks: t, onTaskUpdate: e, onBulkUpdate: a }) {
  const [o, s] = _(null), [n, r] = _(null), [i, d] = _(/* @__PURE__ */ new Set()), [h, u] = _(!1), [k, B] = _(null), [x, L] = _(null), M = de(null);
  function O(g) {
    let m = [];
    try {
      const v = g.dataTransfer.getData("application/x-hadoku-task-ids");
      v && (m = JSON.parse(v));
    } catch {
    }
    if (m.length === 0) {
      const v = g.dataTransfer.getData("text/plain");
      v && (m = [v]);
    }
    return m;
  }
  function W(g, m) {
    const v = i.has(m) && i.size > 0 ? Array.from(i) : [m];
    console.log("[useDragAndDrop] onDragStart", { taskId: m, idsToDrag: v, selectedCount: i.size }), g.dataTransfer.setData("text/plain", v[0]);
    try {
      g.dataTransfer.setData("application/x-hadoku-task-ids", JSON.stringify(v));
    } catch {
    }
    g.dataTransfer.effectAllowed = "copyMove";
    try {
      const S = g.currentTarget, D = S.closest && S.closest(".task-app__item") ? S.closest(".task-app__item") : S;
      D.classList.add("dragging");
      const p = D.cloneNode(!0);
      p.style.boxSizing = "border-box", p.style.width = `${D.offsetWidth}px`, p.style.height = `${D.offsetHeight}px`, p.style.opacity = "0.95", p.style.transform = "none", p.style.filter = "drop-shadow(0 6px 18px rgba(0,0,0,0.12))", p.classList.add("drag-image"), p.style.position = "absolute", p.style.top = "-9999px", p.style.left = "-9999px", document.body.appendChild(p), D.__dragImage = p, d((A) => {
        if (A.has(m)) return new Set(A);
        const b = new Set(A);
        return b.add(m), b;
      });
      try {
        const A = D.closest(".task-app__tag-column");
        if (A) {
          const b = A.querySelector(".task-app__tag-header") || A.querySelector("h3"), I = (b && b.textContent || "").trim().replace(/^#/, "");
          if (I)
            try {
              g.dataTransfer.setData("application/x-hadoku-task-source", I);
            } catch {
            }
        }
      } catch {
      }
      try {
        const A = D.getBoundingClientRect();
        let b = Math.round(g.clientX - A.left), E = Math.round(g.clientY - A.top);
        b = Math.max(0, Math.min(Math.round(p.offsetWidth - 1), b)), E = Math.max(0, Math.min(Math.round(p.offsetHeight - 1), E)), g.dataTransfer.setDragImage(p, b, E);
      } catch {
        g.dataTransfer.setDragImage(p, 0, 0);
      }
    } catch {
    }
  }
  function X(g) {
    try {
      const m = g.currentTarget;
      m.classList.remove("dragging");
      const v = m.__dragImage;
      v && v.parentNode && v.parentNode.removeChild(v), v && delete m.__dragImage;
    } catch {
    }
    try {
      U();
    } catch {
    }
  }
  function P(g) {
    if (g.button === 0) {
      try {
        const m = g.target;
        if (!m || m.closest && m.closest(".task-app__item, .task-app__controls, button, input, textarea, .task-app__item-actions"))
          return;
      } catch {
      }
      u(!0), M.current = { x: g.clientX, y: g.clientY }, B({ x: g.clientX, y: g.clientY, w: 0, h: 0 }), d(/* @__PURE__ */ new Set());
      try {
        document.body.classList.add("marquee-selecting");
      } catch {
      }
    }
  }
  function $(g) {
    if (!h || !M.current) return;
    const m = M.current.x, v = M.current.y, S = g.clientX, D = g.clientY, p = Math.min(m, S), A = Math.min(v, D), b = Math.abs(S - m), E = Math.abs(D - v);
    B({ x: p, y: A, w: b, h: E });
    const I = Array.from(document.querySelectorAll(".task-app__item")), G = /* @__PURE__ */ new Set();
    for (const F of I) {
      const ae = F.getBoundingClientRect();
      if (!(ae.right < p || ae.left > p + b || ae.bottom < A || ae.top > A + E)) {
        const ie = F.getAttribute("data-task-id");
        ie && G.add(ie), F.classList.add("selected");
      } else
        F.classList.remove("selected");
    }
    d(G);
  }
  function q(g) {
    u(!1), B(null), M.current = null;
    try {
      document.body.classList.remove("marquee-selecting");
    } catch {
    }
    try {
      L(Date.now());
    } catch {
    }
  }
  function U() {
    d(/* @__PURE__ */ new Set()), Array.from(document.querySelectorAll(".task-app__item.selected")).forEach((m) => m.classList.remove("selected"));
  }
  j(() => {
    function g(S) {
      if (S.button !== 0) return;
      const D = { target: S.target, clientX: S.clientX, clientY: S.clientY, button: S.button };
      try {
        P(D);
      } catch {
      }
    }
    function m(S) {
      const D = { clientX: S.clientX, clientY: S.clientY };
      try {
        $(D);
      } catch {
      }
    }
    function v(S) {
      const D = { clientX: S.clientX, clientY: S.clientY };
      try {
        q(D);
      } catch {
      }
    }
    return document.addEventListener("mousedown", g), document.addEventListener("mousemove", m), document.addEventListener("mouseup", v), () => {
      document.removeEventListener("mousedown", g), document.removeEventListener("mousemove", m), document.removeEventListener("mouseup", v);
    };
  }, []);
  function Q(g, m) {
    g.preventDefault(), g.dataTransfer.dropEffect = "copy", s(m);
  }
  function re(g) {
    g.currentTarget.contains(g.relatedTarget) || s(null);
  }
  async function Y(g, m) {
    g.preventDefault(), s(null), console.log("[useDragAndDrop] onDrop START", { targetTag: m });
    const v = O(g);
    if (v.length === 0) return;
    let S = null;
    try {
      const p = g.dataTransfer.getData("application/x-hadoku-task-source");
      p && (S = p);
    } catch {
    }
    console.log("[useDragAndDrop] onDrop: processing", { targetTag: m, ids: v, srcTag: S, taskCount: v.length });
    const D = [];
    for (const p of v) {
      const A = t.find((F) => F.id === p);
      if (!A) continue;
      const b = A.tag?.split(" ").filter(Boolean) || [];
      if (m === "other") {
        if (b.length === 0) continue;
        D.push({ taskId: p, tag: "" });
        continue;
      }
      const E = b.includes(m);
      let I = b.slice();
      E || I.push(m), S && S !== m && (I = I.filter((F) => F !== S));
      const G = I.join(" ").trim();
      D.push({ taskId: p, tag: G });
    }
    console.log("[useDragAndDrop] onDrop: updating tasks", { updateCount: D.length });
    try {
      await a(D), console.log("[useDragAndDrop] onDrop: updates complete, clearing selection");
      try {
        U();
      } catch {
      }
    } catch (p) {
      console.error("Failed to add tag to one or more tasks:", p), alert(p.message || "Failed to add tags");
    }
    console.log("[useDragAndDrop] onDrop END");
  }
  function H(g, m) {
    g.preventDefault(), g.dataTransfer.dropEffect = "copy", r(m);
  }
  function f(g) {
    g.currentTarget.contains(g.relatedTarget) || r(null);
  }
  async function T(g, m) {
    g.preventDefault(), r(null);
    const v = O(g);
    if (v.length === 0) return;
    console.log("[useDragAndDrop] onFilterDrop", { filterTag: m, ids: v, taskCount: v.length });
    const S = [];
    for (const D of v) {
      const p = t.find((E) => E.id === D);
      if (!p) continue;
      const A = p.tag?.split(" ").filter(Boolean) || [];
      if (A.includes(m)) {
        console.log(`Task ${D} already has tag: ${m}`);
        continue;
      }
      const b = [...A, m].join(" ");
      S.push({ taskId: D, tag: b });
    }
    if (S.length === 0) {
      console.log("No updates needed - all tasks already have this tag");
      return;
    }
    console.log(`Adding tag "${m}" to ${S.length} task(s) via filter drop`);
    try {
      await a(S);
      try {
        U();
      } catch {
      }
    } catch (D) {
      console.error("Failed to add tag via filter drop:", D), alert(D.message || "Failed to add tag");
    }
  }
  return {
    dragOverTag: o,
    dragOverFilter: n,
    setDragOverFilter: r,
    selectedIds: i,
    isSelecting: h,
    marqueeRect: k,
    selectionJustEndedAt: x,
    // selection handlers
    selectionStartHandler: P,
    selectionMoveHandler: $,
    selectionEndHandler: q,
    clearSelection: U,
    onDragStart: W,
    onDragEnd: X,
    onDragOver: Q,
    onDragLeave: re,
    onDrop: Y,
    onFilterDragOver: H,
    onFilterDragLeave: f,
    onFilterDrop: T
  };
}
function Kt() {
  const [t, e] = _({});
  function a(r) {
    e((i) => {
      const h = (i[r] || "desc") === "desc" ? "asc" : "desc";
      return { ...i, [r]: h };
    });
  }
  function o(r, i) {
    return [...r].sort((d, h) => {
      const u = new Date(d.createdAt).getTime(), k = new Date(h.createdAt).getTime();
      return i === "asc" ? u - k : k - u;
    });
  }
  function s(r) {
    return r === "asc" ? "↑" : "↓";
  }
  function n(r) {
    return r === "asc" ? "Sorted by age (oldest first) - click to sort newest first" : "Sorted by age (newest first) - click to sort oldest first";
  }
  return {
    sortDirections: t,
    toggleSort: a,
    sortTasksByAge: o,
    getSortIcon: s,
    getSortTitle: n
  };
}
function Ve({ onLongPress: t, delay: e = 500 }) {
  const a = de(null);
  return {
    onTouchStart: (r) => {
      const i = r.touches[0];
      a.current = window.setTimeout(() => {
        t(i.clientX, i.clientY);
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
function ve(t) {
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
function Jt({
  board: t,
  isActive: e,
  isDragOver: a,
  onSwitch: o,
  onContextMenu: s,
  onDragOverFilter: n,
  onMoveTasksToBoard: r,
  onClearSelection: i
}) {
  const d = Ve({
    onLongPress: (u, k) => s(t.id, u, k)
  }), h = t.id === "main";
  return /* @__PURE__ */ c(
    "button",
    {
      className: `board-btn ${e ? "board-btn--active" : ""} ${a ? "board-btn--drag-over" : ""}`,
      onClick: () => o(t.id),
      onContextMenu: (u) => {
        u.preventDefault(), !h && s(t.id, u.clientX, u.clientY);
      },
      ...h ? {} : d,
      "aria-pressed": e ? "true" : "false",
      onDragOver: (u) => {
        u.preventDefault(), u.dataTransfer.dropEffect = "move", n(`board:${t.id}`);
      },
      onDragLeave: (u) => {
        n(null);
      },
      onDrop: async (u) => {
        u.preventDefault(), n(null);
        const k = ve(u.dataTransfer);
        if (k.length !== 0)
          try {
            await r(t.id, k);
            try {
              i();
            } catch {
            }
          } catch (B) {
            console.error("Failed moving tasks to board", B), alert(B.message || "Failed to move tasks");
          }
      },
      children: t.name
    }
  );
}
function Wt({
  tag: t,
  isActive: e,
  isDragOver: a,
  onToggle: o,
  onContextMenu: s,
  onDragOver: n,
  onDragLeave: r,
  onDrop: i
}) {
  const d = Ve({
    onLongPress: (h, u) => s(t, h, u)
  });
  return /* @__PURE__ */ y(
    "button",
    {
      onClick: () => o(t),
      onContextMenu: (h) => {
        h.preventDefault(), s(t, h.clientX, h.clientY);
      },
      ...d,
      className: `${e ? "on" : ""} ${a ? "task-app__filter-drag-over" : ""}`,
      onDragOver: (h) => n(h, t),
      onDragLeave: r,
      onDrop: (h) => i(h, t),
      children: [
        "#",
        t
      ]
    }
  );
}
function Ht(t) {
  const e = /* @__PURE__ */ new Date(), a = new Date(t), o = e.getTime() - a.getTime(), s = Math.floor(o / 1e3), n = Math.floor(s / 60), r = Math.floor(n / 60), i = Math.floor(r / 24);
  return s < 60 ? `${s}s ago` : n < 60 ? `${n}m ago` : r < 24 ? `${r}h ago` : `${i}d ago`;
}
function we({
  task: t,
  isDraggable: e = !0,
  pendingOperations: a,
  onComplete: o,
  onDelete: s,
  onAddTag: n,
  onDragStart: r,
  onDragEnd: i,
  selected: d = !1
}) {
  const h = a.has(`complete-${t.id}`), u = a.has(`delete-${t.id}`);
  return /* @__PURE__ */ y(
    "li",
    {
      className: `task-app__item ${d ? "selected" : ""}`,
      "data-task-id": t.id,
      draggable: e,
      onDragStart: r ? (k) => r(k, t.id) : void 0,
      onDragEnd: (k) => {
        if (k.currentTarget.classList.remove("dragging"), i)
          try {
            i(k);
          } catch {
          }
      },
      children: [
        /* @__PURE__ */ y("div", { className: "task-app__item-content", children: [
          /* @__PURE__ */ c("div", { className: "task-app__item-title", title: t.title, children: t.title }),
          /* @__PURE__ */ y("div", { className: "task-app__item-meta-row", children: [
            t.tag ? /* @__PURE__ */ c("div", { className: "task-app__item-tag", children: t.tag.split(" ").map((k) => `#${k}`).join(" ") }) : /* @__PURE__ */ c("div", {}),
            /* @__PURE__ */ c("div", { className: "task-app__item-age", children: Ht(t.createdAt) })
          ] })
        ] }),
        /* @__PURE__ */ y("div", { className: "task-app__item-actions", children: [
          /* @__PURE__ */ c(
            "button",
            {
              className: "task-app__action-btn task-app__complete-btn",
              onClick: () => o(t.id),
              title: "Complete task",
              disabled: h || u,
              children: h ? "⏳" : "✓"
            }
          ),
          /* @__PURE__ */ c(
            "button",
            {
              className: "task-app__action-btn task-app__delete-btn",
              onClick: () => s(t.id),
              title: "Delete task",
              disabled: h || u,
              children: u ? "⏳" : "×"
            }
          )
        ] })
      ]
    }
  );
}
function $e(t, e = !1) {
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
function jt({
  tasks: t,
  topTags: e,
  isMobile: a = !1,
  filters: o,
  sortDirections: s,
  dragOverTag: n,
  pendingOperations: r,
  onComplete: i,
  onDelete: d,
  onAddTag: h,
  onDragStart: u,
  onDragEnd: k,
  selectedIds: B,
  onSelectionStart: x,
  onSelectionMove: L,
  onSelectionEnd: M,
  onDragOver: O,
  onDragLeave: W,
  onDrop: X,
  toggleSort: P,
  sortTasksByAge: $,
  getSortIcon: q,
  getSortTitle: U,
  deleteTag: Q,
  onDeletePersistedTag: re
}) {
  const Y = (p, A) => /* @__PURE__ */ y(
    "div",
    {
      className: `task-app__tag-column ${n === p ? "task-app__tag-column--drag-over" : ""}`,
      onDragOver: (b) => O(b, p),
      onDragLeave: W,
      onDrop: (b) => X(b, p),
      children: [
        /* @__PURE__ */ y("div", { className: "task-app__tag-header-row", children: [
          /* @__PURE__ */ y("h3", { className: "task-app__tag-header", children: [
            "#",
            p
          ] }),
          /* @__PURE__ */ c(
            "button",
            {
              className: "task-app__sort-btn task-app__sort-btn--active",
              onClick: () => P(p),
              title: U(s[p] || "desc"),
              children: q(s[p] || "desc")
            }
          )
        ] }),
        /* @__PURE__ */ c("ul", { className: "task-app__list task-app__list--column", children: $(A, s[p] || "desc").map((b) => /* @__PURE__ */ c(
          we,
          {
            task: b,
            isDraggable: !0,
            pendingOperations: r,
            onComplete: i,
            onDelete: d,
            onAddTag: h,
            onDragStart: u,
            onDragEnd: k,
            selected: B ? B.has(b.id) : !1
          },
          b.id
        )) })
      ]
    },
    p
  ), H = (p, A) => {
    let b = Ee(t, p);
    return T && (b = b.filter((E) => {
      const I = E.tag?.split(" ") || [];
      return o.some((G) => I.includes(G));
    })), b.slice(0, A);
  }, f = e.length, T = Array.isArray(o) && o.length > 0, g = t.filter((p) => {
    if (!T) return !0;
    const A = p.tag?.split(" ") || [];
    return o.some((b) => A.includes(b));
  }), m = $e(f, a), v = T ? e.filter((p) => Ee(t, p).some((b) => {
    const E = b.tag?.split(" ") || [];
    return o.some((I) => E.includes(I));
  })) : e.slice(0, m.useTags);
  if (v.length === 0)
    return /* @__PURE__ */ c("ul", { className: "task-app__list", children: g.map((p) => /* @__PURE__ */ c(
      we,
      {
        task: p,
        pendingOperations: r,
        onComplete: i,
        onDelete: d,
        onAddTag: h,
        onDragStart: u,
        onDragEnd: k,
        selected: B ? B.has(p.id) : !1
      },
      p.id
    )) });
  const S = Pt(t, e, o).filter((p) => {
    if (!T) return !0;
    const A = p.tag?.split(" ") || [];
    return o.some((b) => A.includes(b));
  }), D = $e(v.length, a);
  return /* @__PURE__ */ y("div", { className: "task-app__dynamic-layout", children: [
    D.rows.length > 0 && /* @__PURE__ */ c(ft, { children: D.rows.map((p, A) => /* @__PURE__ */ c("div", { className: `task-app__tag-grid task-app__tag-grid--${p.columns}col`, children: p.tagIndices.map((b) => {
      const E = v[b];
      return E ? Y(E, H(E, D.maxPerColumn)) : null;
    }) }, A)) }),
    S.length > 0 && /* @__PURE__ */ y(
      "div",
      {
        className: `task-app__remaining ${n === "other" ? "task-app__tag-column--drag-over" : ""}`,
        onDragOver: (p) => {
          p.preventDefault(), p.dataTransfer.dropEffect = "move", O(p, "other");
        },
        onDragLeave: (p) => W(p),
        onDrop: (p) => X(p, "other"),
        children: [
          /* @__PURE__ */ y("div", { className: "task-app__tag-header-row", children: [
            /* @__PURE__ */ c("h3", { className: "task-app__remaining-header", children: "Other Tasks" }),
            /* @__PURE__ */ c(
              "button",
              {
                className: "task-app__sort-btn task-app__sort-btn--active",
                onClick: () => P("other"),
                title: U(s.other || "desc"),
                children: q(s.other || "desc")
              }
            )
          ] }),
          /* @__PURE__ */ c("ul", { className: "task-app__list", children: $(S, s.other || "desc").map((p) => /* @__PURE__ */ c(
            we,
            {
              task: p,
              pendingOperations: r,
              onComplete: i,
              onDelete: d,
              onAddTag: h,
              onDragStart: u,
              onDragEnd: k,
              selected: B ? B.has(p.id) : !1
            },
            p.id
          )) })
        ]
      }
    )
  ] });
}
function pe({
  isOpen: t,
  title: e,
  onClose: a,
  onConfirm: o,
  children: s,
  inputValue: n,
  onInputChange: r,
  inputPlaceholder: i,
  confirmLabel: d = "Confirm",
  cancelLabel: h = "Cancel",
  confirmDisabled: u = !1,
  confirmDanger: k = !1
}) {
  return t ? /* @__PURE__ */ c(
    "div",
    {
      className: "modal-overlay",
      onClick: a,
      children: /* @__PURE__ */ y(
        "div",
        {
          className: "modal-card",
          onClick: (x) => x.stopPropagation(),
          children: [
            /* @__PURE__ */ c("h3", { children: e }),
            s,
            r && /* @__PURE__ */ c(
              "input",
              {
                type: "text",
                className: "modal-input",
                value: n || "",
                onChange: (x) => r(x.target.value),
                placeholder: i,
                autoFocus: !0,
                onKeyDown: (x) => {
                  x.key === "Enter" && !u && (x.preventDefault(), o()), x.key === "Escape" && (x.preventDefault(), a());
                }
              }
            ),
            /* @__PURE__ */ y("div", { className: "modal-actions", children: [
              /* @__PURE__ */ c(
                "button",
                {
                  className: "modal-button",
                  onClick: a,
                  children: h
                }
              ),
              /* @__PURE__ */ c(
                "button",
                {
                  className: `modal-button ${k ? "modal-button--danger" : "modal-button--primary"}`,
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
function Fe({ isOpen: t, x: e, y: a, items: o, className: s = "board-context-menu" }) {
  return t ? /* @__PURE__ */ c(
    "div",
    {
      className: s,
      style: {
        left: `${e}px`,
        top: `${a}px`
      },
      children: o.map((n, r) => /* @__PURE__ */ c(
        "button",
        {
          className: `context-menu-item ${n.isDanger ? "context-menu-item--danger" : ""}`,
          onClick: n.onClick,
          children: n.label
        },
        r
      ))
    }
  ) : null;
}
const te = {
  width: 20,
  height: 20,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round"
}, Xt = () => /* @__PURE__ */ y("svg", { ...te, children: [
  /* @__PURE__ */ c("circle", { cx: "12", cy: "12", r: "5" }),
  /* @__PURE__ */ c("line", { x1: "12", y1: "1", x2: "12", y2: "3" }),
  /* @__PURE__ */ c("line", { x1: "12", y1: "21", x2: "12", y2: "23" }),
  /* @__PURE__ */ c("line", { x1: "4.22", y1: "4.22", x2: "5.64", y2: "5.64" }),
  /* @__PURE__ */ c("line", { x1: "18.36", y1: "18.36", x2: "19.78", y2: "19.78" }),
  /* @__PURE__ */ c("line", { x1: "1", y1: "12", x2: "3", y2: "12" }),
  /* @__PURE__ */ c("line", { x1: "21", y1: "12", x2: "23", y2: "12" }),
  /* @__PURE__ */ c("line", { x1: "4.22", y1: "19.78", x2: "5.64", y2: "18.36" }),
  /* @__PURE__ */ c("line", { x1: "18.36", y1: "5.64", x2: "19.78", y2: "4.22" })
] }), ze = () => /* @__PURE__ */ c("svg", { ...te, children: /* @__PURE__ */ c("path", { d: "M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" }) }), Me = () => /* @__PURE__ */ y("svg", { ...te, children: [
  /* @__PURE__ */ c("path", { d: "M12 21 C12 21 6.5 15 6.5 11 C6.5 8.5 8 7 10 7 C11 7 12 7.5 12 7.5 C12 7.5 13 7 14 7 C16 7 17.5 8.5 17.5 11 C17.5 15 12 21 12 21 Z", fill: "currentColor" }),
  /* @__PURE__ */ c("path", { d: "M9.5 7.5 L9 5 L11 5.5 Z", fill: "currentColor" }),
  /* @__PURE__ */ c("path", { d: "M14.5 7.5 L15 5 L13 5.5 Z", fill: "currentColor" }),
  /* @__PURE__ */ c("path", { d: "M12 7.5 L12 4 L12 5", stroke: "currentColor", strokeWidth: "1.5", fill: "none" }),
  /* @__PURE__ */ c("line", { x1: "10", y1: "10", x2: "10", y2: "11", stroke: "currentColor", strokeWidth: "1", opacity: "0.4" }),
  /* @__PURE__ */ c("line", { x1: "14", y1: "10", x2: "14", y2: "11", stroke: "currentColor", strokeWidth: "1", opacity: "0.4" }),
  /* @__PURE__ */ c("line", { x1: "9", y1: "13", x2: "9", y2: "14", stroke: "currentColor", strokeWidth: "1", opacity: "0.4" }),
  /* @__PURE__ */ c("line", { x1: "15", y1: "13", x2: "15", y2: "14", stroke: "currentColor", strokeWidth: "1", opacity: "0.4" }),
  /* @__PURE__ */ c("line", { x1: "11", y1: "16", x2: "11", y2: "17", stroke: "currentColor", strokeWidth: "1", opacity: "0.4" }),
  /* @__PURE__ */ c("line", { x1: "13", y1: "16", x2: "13", y2: "17", stroke: "currentColor", strokeWidth: "1", opacity: "0.4" })
] }), Pe = () => /* @__PURE__ */ y("svg", { ...te, children: [
  /* @__PURE__ */ c("path", { d: "M2 12c2-2 4-2 6 0s4 2 6 0 4-2 6 0" }),
  /* @__PURE__ */ c("path", { d: "M2 17c2-2 4-2 6 0s4 2 6 0 4-2 6 0" }),
  /* @__PURE__ */ c("path", { d: "M2 7c2-2 4-2 6 0s4 2 6 0 4-2 6 0" })
] }), Re = () => /* @__PURE__ */ c("svg", { ...te, children: /* @__PURE__ */ c("polygon", { points: "13 2 3 14 12 14 11 22 21 10 12 10 13 2" }) }), Ue = () => /* @__PURE__ */ y("svg", { ...te, children: [
  /* @__PURE__ */ c("path", { d: "M18 8h1a4 4 0 0 1 0 8h-1" }),
  /* @__PURE__ */ c("path", { d: "M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" }),
  /* @__PURE__ */ c("line", { x1: "6", y1: "1", x2: "6", y2: "4" }),
  /* @__PURE__ */ c("line", { x1: "10", y1: "1", x2: "10", y2: "4" }),
  /* @__PURE__ */ c("line", { x1: "14", y1: "1", x2: "14", y2: "4" })
] }), Ke = () => /* @__PURE__ */ y("svg", { ...te, children: [
  /* @__PURE__ */ c("circle", { cx: "12", cy: "12", r: "2", fill: "currentColor" }),
  /* @__PURE__ */ c("circle", { cx: "12", cy: "6", r: "2.5", fill: "none", stroke: "currentColor", strokeWidth: "2" }),
  /* @__PURE__ */ c("circle", { cx: "18", cy: "10", r: "2.5", fill: "none", stroke: "currentColor", strokeWidth: "2" }),
  /* @__PURE__ */ c("circle", { cx: "16", cy: "16", r: "2.5", fill: "none", stroke: "currentColor", strokeWidth: "2" }),
  /* @__PURE__ */ c("circle", { cx: "8", cy: "16", r: "2.5", fill: "none", stroke: "currentColor", strokeWidth: "2" }),
  /* @__PURE__ */ c("circle", { cx: "6", cy: "10", r: "2.5", fill: "none", stroke: "currentColor", strokeWidth: "2" })
] }), Je = () => /* @__PURE__ */ c("svg", { ...te, children: /* @__PURE__ */ c("path", { d: "M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z", fill: "currentColor" }) }), qt = () => /* @__PURE__ */ y("svg", { ...te, children: [
  /* @__PURE__ */ c("circle", { cx: "12", cy: "12", r: "3" }),
  /* @__PURE__ */ c("path", { d: "M12 1v6m0 6v6M4.2 4.2l4.2 4.2m5.6 5.6l4.2 4.2M1 12h6m6 0h6M4.2 19.8l4.2-4.2m5.6-5.6l4.2-4.2" })
] }), We = [
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
function Vt() {
  return We[Math.floor(Math.random() * We.length)];
}
const He = 768;
function zt() {
  const [t, e] = _(() => typeof window > "u" ? !1 : window.innerWidth < He);
  return j(() => {
    if (typeof window > "u") return;
    const a = window.matchMedia(`(max-width: ${He - 1}px)`), o = (s) => {
      e(s.matches);
    };
    return a.addEventListener ? a.addEventListener("change", o) : a.addListener(o), o(a), () => {
      a.removeEventListener ? a.removeEventListener("change", o) : a.removeListener(o);
    };
  }, []), t;
}
const je = [
  {
    lightIcon: /* @__PURE__ */ c(Xt, {}),
    darkIcon: /* @__PURE__ */ c(ze, {}),
    lightTheme: "light",
    darkTheme: "dark",
    lightLabel: "Light",
    darkLabel: "Dark"
  },
  {
    lightIcon: /* @__PURE__ */ c(Me, {}),
    darkIcon: /* @__PURE__ */ c(Me, {}),
    lightTheme: "strawberry-light",
    darkTheme: "strawberry-dark",
    lightLabel: "Strawberry Light",
    darkLabel: "Strawberry Dark"
  },
  {
    lightIcon: /* @__PURE__ */ c(Pe, {}),
    darkIcon: /* @__PURE__ */ c(Pe, {}),
    lightTheme: "ocean-light",
    darkTheme: "ocean-dark",
    lightLabel: "Ocean Light",
    darkLabel: "Ocean Dark"
  },
  {
    lightIcon: /* @__PURE__ */ c(Re, {}),
    darkIcon: /* @__PURE__ */ c(Re, {}),
    lightTheme: "cyberpunk-light",
    darkTheme: "cyberpunk-dark",
    lightLabel: "Cyberpunk Light",
    darkLabel: "Cyberpunk Dark"
  },
  {
    lightIcon: /* @__PURE__ */ c(Ue, {}),
    darkIcon: /* @__PURE__ */ c(Ue, {}),
    lightTheme: "coffee-light",
    darkTheme: "coffee-dark",
    lightLabel: "Coffee Light",
    darkLabel: "Coffee Dark"
  },
  {
    lightIcon: /* @__PURE__ */ c(Ke, {}),
    darkIcon: /* @__PURE__ */ c(Ke, {}),
    lightTheme: "lavender-light",
    darkTheme: "lavender-dark",
    lightLabel: "Lavender Light",
    darkLabel: "Lavender Dark"
  }
], Yt = [
  {
    lightIcon: /* @__PURE__ */ c(Je, {}),
    darkIcon: /* @__PURE__ */ c(Je, {}),
    lightTheme: "pink-light",
    darkTheme: "pink-dark",
    lightLabel: "Pink Light",
    darkLabel: "Pink Dark"
  }
];
function Ye(t) {
  return t ? [...je, ...Yt] : je;
}
function Gt(t, e) {
  const o = Ye(e).find(
    (s) => s.lightTheme === t || s.darkTheme === t
  );
  return o ? t.endsWith("-dark") || t === "dark" ? o.darkIcon : o.lightIcon : /* @__PURE__ */ c(ze, {});
}
const Xe = 5;
function Zt(t = {}) {
  const { userType: e = "public", userId: a = "public", sessionId: o } = t, s = zt(), [n] = _(() => Vt()), [r, i] = _(/* @__PURE__ */ new Set()), [d, h] = _(null), [u, k] = _(!1), [B, x] = _(!1), [L, M] = _(null), [O, W] = _(""), [X, P] = _(null), [$, q] = _("light"), [U, Q] = _(!1), [re, Y] = _(!1), [H, f] = _({
    version: 1,
    updatedAt: (/* @__PURE__ */ new Date()).toISOString(),
    experimentalThemes: !1,
    alwaysVerticalLayout: !1
  }), [T, g] = _(""), [m, v] = _(""), [S, D] = _(null), [p, A] = _(!1), [b, E] = _(!1), [I, G] = _(null), [F, ae] = _(null), oe = de(null), ie = de(null), fe = de(null), Ce = s || H.alwaysVerticalLayout || !1, {
    tasks: se,
    pendingOperations: Ge,
    initialLoad: xe,
    addTask: Ze,
    completeTask: Qe,
    deleteTask: et,
    addTagToTask: tt,
    updateTaskTags: at,
    bulkUpdateTaskTags: Ae,
    deleteTag: Be,
    // board API
    boards: ee,
    currentBoardId: ke,
    createBoard: st,
    deleteBoard: nt,
    switchBoard: ot,
    moveTasksToBoard: _e,
    createTagOnBoard: rt,
    deleteTagOnBoard: it
  } = Rt({ userType: e, userId: a, sessionId: o }), C = Ut({
    tasks: se,
    onTaskUpdate: at,
    onBulkUpdate: Ae
  }), ce = Kt(), ct = qe(
    () => Ye(H.experimentalThemes || !1),
    [H.experimentalThemes]
  );
  j(() => {
    (async () => {
      const N = await he(e, a, o).getPreferences();
      N && f(N);
    })();
  }, [e, a, o]);
  const Ne = async (l) => {
    const w = { ...H, ...l, updatedAt: (/* @__PURE__ */ new Date()).toISOString() };
    f(w), await he(e, a, o).savePreferences(w);
  }, Le = async () => {
    if (!T.trim() || p) return;
    A(!0), await new Promise((w) => setTimeout(w, 300));
    const l = new URL(window.location.href);
    l.searchParams.set("userId", T.trim()), window.location.href = l.toString();
  }, Oe = async () => {
    if (!(!m.trim() || b)) {
      E(!0), D(null);
      try {
        if (await he(e, a, o).validateKey(m.trim())) {
          const N = new URL(window.location.href);
          N.searchParams.set("key", m.trim()), window.location.href = N.toString();
        } else
          D("Invalid key"), E(!1);
      } catch {
        D("Failed to validate key"), E(!1);
      }
    }
  };
  j(() => {
    const l = sessionStorage.getItem("theme");
    l && q(l);
  }, []), j(() => {
    sessionStorage.setItem("theme", $);
  }, [$]), j(() => {
    if (!U) return;
    const l = (w) => {
      fe.current && !fe.current.contains(w.target) && Q(!1);
    };
    return document.addEventListener("mousedown", l), () => document.removeEventListener("mousedown", l);
  }, [U]), j(() => {
    const l = window.matchMedia("(prefers-color-scheme: dark)"), w = (N) => {
      const R = N.matches, ne = $.replace(/-light$|-dark$/, ""), V = $.endsWith("-dark") ? "dark" : $.endsWith("-light") ? "light" : null;
      if (V && ne !== "light" && ne !== "dark") {
        const ue = R ? "dark" : "light";
        if (V !== ue) {
          const ge = `${ne}-${ue}`;
          console.log(`[Theme] Auto-switching from ${$} to ${ge} (Dark Reader/system preference)`), q(ge);
        }
      }
    };
    return l.addEventListener ? l.addEventListener("change", w) : l.addListener(w), () => {
      l.removeEventListener ? l.removeEventListener("change", w) : l.removeListener(w);
    };
  }, [$]), j(() => {
    i(/* @__PURE__ */ new Set());
  }, [ke]), j(() => {
    console.log("[App] User context changed, initializing...", { userType: e, userId: a }), xe(), oe.current?.focus();
  }, [e, a]), j(() => {
    ie.current && ie.current.setAttribute("data-theme", $);
  }, [$]), j(() => {
    if (!U && !I && !F) return;
    const l = (w) => {
      const N = w.target;
      N.closest(".theme-picker") || Q(!1), N.closest(".board-context-menu") || G(null), N.closest(".tag-context-menu") || ae(null);
    };
    return document.addEventListener("mousedown", l), () => document.removeEventListener("mousedown", l);
  }, [U, I, F]);
  async function lt(l) {
    await Ze(l) && oe.current && (oe.current.value = "", oe.current.focus());
  }
  function dt(l) {
    const w = se.filter((N) => N.tag?.split(" ").includes(l));
    h({ tag: l, count: w.length });
  }
  async function ut(l) {
    const w = l.trim().replace(/\s+/g, "-");
    try {
      if (await rt(w), L?.type === "apply-tag" && L.taskIds.length > 0) {
        const N = L.taskIds.map((R) => {
          const V = se.find((ge) => ge.id === R)?.tag?.split(" ").filter(Boolean) || [], ue = [.../* @__PURE__ */ new Set([...V, w])];
          return { taskId: R, tag: ue.join(" ") };
        });
        await Ae(N), C.clearSelection();
      }
      M(null);
    } catch (N) {
      throw console.error("[App] Failed to create tag:", N), N;
    }
  }
  function Te(l) {
    const w = l.trim();
    return w ? (ee?.boards?.map((R) => R.id.toLowerCase()) || []).includes(w.toLowerCase()) ? `Board "${w}" already exists` : null : "Board name cannot be empty";
  }
  async function gt(l) {
    const w = l.trim(), N = Te(w);
    if (N) {
      P(N);
      return;
    }
    try {
      await st(w), L?.type === "move-to-board" && L.taskIds.length > 0 && (await _e(w, L.taskIds), C.clearSelection()), M(null), P(null);
    } catch (R) {
      console.error("[App] Failed to create board:", R), P(R.message || "Failed to create board");
    }
  }
  const pt = ee?.boards?.find((l) => l.id === ke)?.tags || [], ht = Mt(se, Ce ? 3 : 6), mt = $.endsWith("-dark") || $ === "dark";
  return /* @__PURE__ */ c(
    "div",
    {
      ref: ie,
      className: "task-app-container",
      "data-dark-theme": mt ? "true" : "false",
      onMouseDown: C.selectionStartHandler,
      onMouseMove: C.selectionMoveHandler,
      onMouseUp: C.selectionEndHandler,
      onMouseLeave: C.selectionEndHandler,
      onClick: (l) => {
        try {
          const w = l.target;
          if (!w.closest || !w.closest(".task-app__item")) {
            if (C.selectionJustEndedAt && Date.now() - C.selectionJustEndedAt < 300)
              return;
            C.clearSelection();
          }
        } catch {
        }
      },
      children: /* @__PURE__ */ y("div", { className: "task-app", children: [
        /* @__PURE__ */ y("div", { className: "task-app__header-container", children: [
          /* @__PURE__ */ y(
            "h1",
            {
              className: "task-app__header",
              onClick: () => Y(!0),
              style: { cursor: "pointer" },
              title: "Settings",
              children: [
                "Tasks",
                e !== "public" && a !== "public" ? ` - ${a}` : ""
              ]
            }
          ),
          /* @__PURE__ */ y("div", { className: "theme-picker", ref: fe, children: [
            /* @__PURE__ */ c(
              "button",
              {
                className: "theme-toggle-btn",
                onClick: () => Q(!U),
                "aria-label": "Choose theme",
                title: "Choose theme",
                children: Gt($, H.experimentalThemes || !1)
              }
            ),
            U && /* @__PURE__ */ y("div", { className: "theme-picker__dropdown", children: [
              /* @__PURE__ */ c("div", { className: "theme-picker__pills", children: ct.map((l, w) => /* @__PURE__ */ y("div", { className: "theme-pill", children: [
                /* @__PURE__ */ c(
                  "button",
                  {
                    className: `theme-pill__btn theme-pill__btn--light ${$ === l.lightTheme ? "active" : ""}`,
                    onClick: () => q(l.lightTheme),
                    title: l.lightLabel,
                    "aria-label": l.lightLabel,
                    children: /* @__PURE__ */ c("div", { className: "theme-pill__icon", children: l.lightIcon })
                  }
                ),
                /* @__PURE__ */ c(
                  "button",
                  {
                    className: `theme-pill__btn theme-pill__btn--dark ${$ === l.darkTheme ? "active" : ""}`,
                    onClick: () => q(l.darkTheme),
                    title: l.darkLabel,
                    "aria-label": l.darkLabel,
                    children: /* @__PURE__ */ c("div", { className: "theme-pill__icon", children: l.darkIcon })
                  }
                )
              ] }, w)) }),
              /* @__PURE__ */ c(
                "button",
                {
                  className: "theme-picker__settings-icon",
                  onClick: () => {
                    Y(!0), Q(!1);
                  },
                  "aria-label": "Settings",
                  title: "Settings",
                  children: /* @__PURE__ */ c(qt, {})
                }
              )
            ] })
          ] })
        ] }),
        /* @__PURE__ */ y("div", { className: "task-app__boards", children: [
          /* @__PURE__ */ c("div", { className: "task-app__board-list", children: (ee && ee.boards ? ee.boards.slice(0, Xe) : [{ id: "main", name: "main", tasks: [], tags: [] }]).map((l) => /* @__PURE__ */ c(
            Jt,
            {
              board: l,
              isActive: ke === l.id,
              isDragOver: C.dragOverFilter === `board:${l.id}`,
              onSwitch: ot,
              onContextMenu: (w, N, R) => G({ boardId: w, x: N, y: R }),
              onDragOverFilter: C.setDragOverFilter,
              onMoveTasksToBoard: _e,
              onClearSelection: C.clearSelection
            },
            l.id
          )) }),
          /* @__PURE__ */ y("div", { className: "task-app__board-actions", children: [
            (!ee || ee.boards && ee.boards.length < Xe) && /* @__PURE__ */ c(
              "button",
              {
                className: `board-add-btn ${C.dragOverFilter === "add-board" ? "board-btn--drag-over" : ""}`,
                onClick: () => {
                  W(""), P(null), k(!0);
                },
                onDragOver: (l) => {
                  l.preventDefault(), l.dataTransfer.dropEffect = "move", C.setDragOverFilter("add-board");
                },
                onDragLeave: (l) => {
                  C.setDragOverFilter(null);
                },
                onDrop: async (l) => {
                  l.preventDefault(), C.setDragOverFilter(null);
                  const w = ve(l.dataTransfer);
                  w.length > 0 && (W(""), M({ type: "move-to-board", taskIds: w }), k(!0));
                },
                "aria-label": "Create board",
                children: "＋"
              }
            ),
            e !== "public" && /* @__PURE__ */ c(
              "button",
              {
                className: "sync-btn",
                onClick: async (l) => {
                  console.log("[App] Manual refresh triggered"), await xe(), l.currentTarget.blur();
                },
                title: "Sync from server",
                "aria-label": "Sync from server",
                children: /* @__PURE__ */ y("svg", { width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [
                  /* @__PURE__ */ c("polyline", { points: "23 4 23 10 17 10" }),
                  /* @__PURE__ */ c("polyline", { points: "1 20 1 14 7 14" }),
                  /* @__PURE__ */ c("path", { d: "M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" })
                ] })
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ c("div", { className: "task-app__controls", children: /* @__PURE__ */ c(
          "input",
          {
            ref: oe,
            className: "task-app__input",
            placeholder: n,
            onKeyDown: (l) => {
              l.key === "Enter" && !l.shiftKey && (l.preventDefault(), lt(l.target.value)), l.key === "k" && (l.ctrlKey || l.metaKey) && (l.preventDefault(), oe.current?.focus());
            }
          }
        ) }),
        /* @__PURE__ */ y("div", { className: "task-app__filters", children: [
          (() => {
            const l = ye(se);
            return Array.from(/* @__PURE__ */ new Set([...pt, ...l])).map((N) => /* @__PURE__ */ c(
              Wt,
              {
                tag: N,
                isActive: r.has(N),
                isDragOver: C.dragOverFilter === N,
                onToggle: (R) => {
                  i((ne) => {
                    const V = new Set(ne);
                    return V.has(R) ? V.delete(R) : V.add(R), V;
                  });
                },
                onContextMenu: (R, ne, V) => ae({ tag: R, x: ne, y: V }),
                onDragOver: C.onFilterDragOver,
                onDragLeave: C.onFilterDragLeave,
                onDrop: C.onFilterDrop
              },
              N
            ));
          })(),
          /* @__PURE__ */ c(
            "button",
            {
              className: `task-app__filter-add ${C.dragOverFilter === "add-tag" ? "task-app__filter-drag-over" : ""}`,
              onClick: () => {
                W(""), x(!0);
              },
              onDragOver: (l) => {
                l.preventDefault(), l.dataTransfer.dropEffect = "copy", C.onFilterDragOver(l, "add-tag");
              },
              onDragLeave: C.onFilterDragLeave,
              onDrop: async (l) => {
                l.preventDefault(), C.onFilterDragLeave(l);
                const w = ve(l.dataTransfer);
                w.length > 0 && (W(""), M({ type: "apply-tag", taskIds: w }), x(!0));
              },
              "aria-label": "Add tag",
              children: "＋"
            }
          )
        ] }),
        /* @__PURE__ */ c(
          jt,
          {
            tasks: se,
            topTags: ht,
            isMobile: Ce,
            filters: Array.from(r),
            selectedIds: C.selectedIds,
            onSelectionStart: C.selectionStartHandler,
            onSelectionMove: C.selectionMoveHandler,
            onSelectionEnd: C.selectionEndHandler,
            sortDirections: ce.sortDirections,
            dragOverTag: C.dragOverTag,
            pendingOperations: Ge,
            onComplete: Qe,
            onDelete: et,
            onAddTag: tt,
            onDragStart: C.onDragStart,
            onDragEnd: C.onDragEnd,
            onDragOver: C.onDragOver,
            onDragLeave: C.onDragLeave,
            onDrop: C.onDrop,
            toggleSort: ce.toggleSort,
            sortTasksByAge: ce.sortTasksByAge,
            getSortIcon: ce.getSortIcon,
            getSortTitle: ce.getSortTitle,
            deleteTag: dt,
            onDeletePersistedTag: it
          }
        ),
        C.isSelecting && C.marqueeRect && /* @__PURE__ */ c(
          "div",
          {
            className: "marquee-overlay",
            style: {
              left: `${C.marqueeRect.x}px`,
              top: `${C.marqueeRect.y}px`,
              width: `${C.marqueeRect.w}px`,
              height: `${C.marqueeRect.h}px`
            }
          }
        ),
        /* @__PURE__ */ c(
          pe,
          {
            isOpen: !!d,
            title: `Clear Tag #${d?.tag}?`,
            onClose: () => h(null),
            onConfirm: async () => {
              if (!d) return;
              const l = d.tag;
              h(null), await Be(l);
            },
            confirmLabel: "Clear Tag",
            confirmDanger: !0,
            children: d && /* @__PURE__ */ y("p", { children: [
              "This will remove ",
              /* @__PURE__ */ y("strong", { children: [
                "#",
                d.tag
              ] }),
              " from",
              " ",
              /* @__PURE__ */ y("strong", { children: [
                d.count,
                " task(s)"
              ] }),
              " and delete the tag from the board."
            ] })
          }
        ),
        /* @__PURE__ */ y(
          pe,
          {
            isOpen: u,
            title: "Create New Board",
            onClose: () => {
              k(!1), M(null), P(null);
            },
            onConfirm: async () => {
              if (!O.trim()) return;
              const l = Te(O);
              if (l) {
                P(l);
                return;
              }
              k(!1), await gt(O);
            },
            inputValue: O,
            onInputChange: (l) => {
              W(l), P(null);
            },
            inputPlaceholder: "Board name",
            confirmLabel: "Create",
            confirmDisabled: !O.trim() || Te(O) !== null,
            children: [
              L?.type === "move-to-board" && L.taskIds.length > 0 && /* @__PURE__ */ y("p", { className: "modal-hint", children: [
                L.taskIds.length,
                " task",
                L.taskIds.length > 1 ? "s" : "",
                " will be moved to this board"
              ] }),
              X && /* @__PURE__ */ c("p", { className: "modal-error", style: { color: "var(--error-color, #d32f2f)", marginTop: "0.5rem" }, children: X })
            ]
          }
        ),
        /* @__PURE__ */ y(
          pe,
          {
            isOpen: B,
            title: "Create New Tag",
            onClose: () => {
              x(!1), M(null);
            },
            onConfirm: async () => {
              if (O.trim()) {
                x(!1);
                try {
                  await ut(O);
                } catch (l) {
                  console.error("[App] Failed to create tag:", l);
                }
              }
            },
            inputValue: O,
            onInputChange: W,
            inputPlaceholder: "Enter new tag name",
            confirmLabel: "Create",
            confirmDisabled: !O.trim(),
            children: [
              L?.type === "apply-tag" && L.taskIds.length > 0 && /* @__PURE__ */ y("p", { className: "modal-hint", children: [
                "This tag will be applied to ",
                L.taskIds.length,
                " task",
                L.taskIds.length > 1 ? "s" : ""
              ] }),
              ye(se).length > 0 && /* @__PURE__ */ y("div", { className: "modal-section", children: [
                /* @__PURE__ */ c("label", { className: "modal-label", children: "Existing tags:" }),
                /* @__PURE__ */ c("div", { className: "modal-tags-list", children: ye(se).map((l) => /* @__PURE__ */ y("span", { className: "modal-tag-chip", children: [
                  "#",
                  l
                ] }, l)) })
              ] })
            ]
          }
        ),
        /* @__PURE__ */ y(
          pe,
          {
            isOpen: re,
            title: "Settings",
            onClose: () => Y(!1),
            onConfirm: () => Y(!1),
            confirmLabel: "Close",
            cancelLabel: "Close",
            children: [
              /* @__PURE__ */ y("div", { className: "settings-section", children: [
                /* @__PURE__ */ c("h4", { className: "settings-section-title", children: "User Management" }),
                /* @__PURE__ */ y("div", { className: "settings-field", children: [
                  /* @__PURE__ */ c("label", { className: "settings-field-label", children: "Current User ID" }),
                  /* @__PURE__ */ y("div", { className: "settings-field-input-group", children: [
                    /* @__PURE__ */ c(
                      "input",
                      {
                        type: "text",
                        className: "settings-text-input",
                        value: T || a,
                        onChange: (l) => g(l.target.value),
                        onKeyDown: (l) => {
                          l.key === "Enter" && T && T !== a && e !== "public" && !p && Le();
                        },
                        placeholder: e === "public" ? "public" : a,
                        disabled: e === "public" || p
                      }
                    ),
                    T && T !== a && e !== "public" && /* @__PURE__ */ c(
                      "button",
                      {
                        className: "settings-field-button",
                        onClick: Le,
                        disabled: p,
                        children: p ? /* @__PURE__ */ c("span", { className: "spinner" }) : "↵"
                      }
                    )
                  ] })
                ] }),
                /* @__PURE__ */ y("div", { className: "settings-field", children: [
                  /* @__PURE__ */ c("label", { className: "settings-field-label", children: "Enter New Key" }),
                  /* @__PURE__ */ y("div", { className: "settings-field-input-group", children: [
                    /* @__PURE__ */ c(
                      "input",
                      {
                        type: "password",
                        name: "key",
                        autoComplete: "key",
                        className: "settings-text-input",
                        value: m,
                        onChange: (l) => {
                          v(l.target.value), D(null);
                        },
                        onKeyDown: (l) => {
                          l.key === "Enter" && m && !b && Oe();
                        },
                        placeholder: "Enter authentication key",
                        disabled: b
                      }
                    ),
                    m && /* @__PURE__ */ c(
                      "button",
                      {
                        className: "settings-field-button",
                        onClick: Oe,
                        disabled: b,
                        children: b ? /* @__PURE__ */ c("span", { className: "spinner" }) : "↵"
                      }
                    )
                  ] }),
                  S && /* @__PURE__ */ c("span", { className: "settings-error", children: S })
                ] })
              ] }),
              /* @__PURE__ */ y("div", { className: "settings-section", children: [
                /* @__PURE__ */ c("h4", { className: "settings-section-title", children: "Preferences" }),
                /* @__PURE__ */ y("label", { className: "settings-option", children: [
                  /* @__PURE__ */ c(
                    "input",
                    {
                      type: "checkbox",
                      checked: H.experimentalThemes || !1,
                      onChange: (l) => {
                        Ne({ experimentalThemes: l.target.checked });
                      }
                    }
                  ),
                  /* @__PURE__ */ y("span", { className: "settings-label", children: [
                    /* @__PURE__ */ c("strong", { children: "Experimental Themes" }),
                    /* @__PURE__ */ c("span", { className: "settings-description", children: "Enable access to experimental theme options" })
                  ] })
                ] }),
                /* @__PURE__ */ y("label", { className: "settings-option", children: [
                  /* @__PURE__ */ c(
                    "input",
                    {
                      type: "checkbox",
                      checked: H.alwaysVerticalLayout || !1,
                      onChange: (l) => {
                        Ne({ alwaysVerticalLayout: l.target.checked });
                      }
                    }
                  ),
                  /* @__PURE__ */ y("span", { className: "settings-label", children: [
                    /* @__PURE__ */ c("strong", { children: "Always Use Vertical Layout" }),
                    /* @__PURE__ */ c("span", { className: "settings-description", children: "Use mobile-style vertical task layout on all devices" })
                  ] })
                ] })
              ] })
            ]
          }
        ),
        /* @__PURE__ */ c(
          Fe,
          {
            isOpen: !!I,
            x: I?.x || 0,
            y: I?.y || 0,
            items: [
              {
                label: "🗑️ Delete Board",
                isDanger: !0,
                onClick: async () => {
                  if (!I) return;
                  const l = ee?.boards?.find((w) => w.id === I.boardId)?.name || I.boardId;
                  if (confirm(`Delete board "${l}"? All tasks on this board will be permanently deleted.`))
                    try {
                      await nt(I.boardId), G(null);
                    } catch (w) {
                      console.error("[App] Failed to delete board:", w), alert(w.message || "Failed to delete board");
                    }
                }
              }
            ]
          }
        ),
        /* @__PURE__ */ c(
          Fe,
          {
            isOpen: !!F,
            x: F?.x || 0,
            y: F?.y || 0,
            className: "tag-context-menu",
            items: [
              {
                label: "🗑️ Delete Tag",
                isDanger: !0,
                onClick: async () => {
                  if (console.log("[App] Delete Tag clicked!", { tagContextMenu: F }), !F) {
                    console.error("[App] No tagContextMenu when Delete Tag clicked!");
                    return;
                  }
                  try {
                    console.log("[App] Calling deleteTag for tag:", F.tag), await Be(F.tag), console.log("[App] deleteTag completed successfully"), ae(null);
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
function sa(t, e = {}) {
  const a = new URLSearchParams(window.location.search), o = e.userType || a.get("userType") || "public", s = e.userId || a.get("userId") || "public", n = e.sessionId, r = { ...e, userType: o, userId: s, sessionId: n }, i = kt(t);
  i.render(/* @__PURE__ */ c(Zt, { ...r })), t.__root = i, console.log("[task-app] Mounted successfully", r);
}
function na(t) {
  t.__root?.unmount();
}
export {
  sa as mount,
  na as unmount
};
