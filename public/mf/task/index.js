import { jsx as T, jsxs as O, Fragment as Ue } from "react/jsx-runtime";
import { createRoot as Je } from "react-dom/client";
import { useState as N, useMemo as je, useEffect as V, useRef as ce } from "react";
const R = `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
class He {
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
function Ke() {
  const t = Date.now().toString(36).toUpperCase().padStart(8, "0"), e = crypto.getRandomValues(new Uint8Array(18)), a = Array.from(e).map((o) => (o % 36).toString(36).toUpperCase()).join("");
  return t + a;
}
function G() {
  return (/* @__PURE__ */ new Date()).toISOString();
}
function fe(t, e) {
  const a = t.tasks.findIndex((o) => o.id === e);
  if (a < 0)
    throw new Error("Task not found");
  return { task: t.tasks[a], index: a };
}
function ie(t, e) {
  const a = t.boards.findIndex((o) => o.id === e);
  if (a < 0)
    throw new Error(`Board ${e} not found`);
  return { board: t.boards[a], index: a };
}
function ke(t, e, a, o) {
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
function qe(t, e, a) {
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
function Xe(t, e, a) {
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
function he(t, e, a) {
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
function We(t, e, a) {
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
async function ze(t, e) {
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
async function Ye(t, e, a, o = "main") {
  const s = G(), n = await t.getTasks(e.userType, e.userId, o), r = await t.getStats(e.userType, e.userId, o), c = a.id || Ke(), u = a.createdAt || s, g = {
    id: c,
    title: a.title,
    tag: a.tag ?? null,
    state: "Active",
    createdAt: u
  }, l = {
    ...n,
    tasks: [g, ...n.tasks],
    updatedAt: s
  }, k = qe(r, g, s);
  return await t.saveTasks(e.userType, e.userId, o, l), await t.saveStats(e.userType, e.userId, o, k), { ok: !0, id: c };
}
async function Ve(t, e, a, o, s = "main") {
  const n = G(), r = await t.getTasks(e.userType, e.userId, s), c = await t.getStats(e.userType, e.userId, s), { task: u, index: g } = fe(r, a), l = {
    ...u,
    ...o,
    updatedAt: n
  }, k = [...r.tasks];
  k[g] = l;
  const A = {
    ...r,
    tasks: k,
    updatedAt: n
  }, v = he(c, l, n);
  return await t.saveTasks(e.userType, e.userId, s, A), await t.saveStats(e.userType, e.userId, s, v), { ok: !0, message: `Task ${a} updated` };
}
async function Ge(t, e, a, o = "main") {
  const s = G(), n = await t.getTasks(e.userType, e.userId, o), r = await t.getStats(e.userType, e.userId, o), { task: c, index: u } = fe(n, a), g = {
    ...c,
    state: "Completed",
    closedAt: s,
    updatedAt: s
  }, l = [...n.tasks];
  l.splice(u, 1);
  const k = {
    ...n,
    tasks: l,
    updatedAt: s
  }, A = Xe(r, g, s);
  return await t.saveTasks(e.userType, e.userId, o, k), await t.saveStats(e.userType, e.userId, o, A), { ok: !0, message: `Task ${a} completed` };
}
async function Qe(t, e, a, o = "main") {
  const s = G(), n = await t.getTasks(e.userType, e.userId, o), r = await t.getStats(e.userType, e.userId, o), { task: c, index: u } = fe(n, a), g = {
    ...c,
    state: "Deleted",
    closedAt: s,
    updatedAt: s
  }, l = [...n.tasks];
  l.splice(u, 1);
  const k = {
    ...n,
    tasks: l,
    updatedAt: s
  }, A = We(r, g, s);
  return await t.saveTasks(e.userType, e.userId, o, k), await t.saveStats(e.userType, e.userId, o, A), { ok: !0, message: `Task ${a} deleted` };
}
async function Ze(t, e, a) {
  const o = G(), s = await t.getBoards(e.userType, e.userId);
  if (s.boards.find((c) => c.id === a.id))
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
async function et(t, e, a) {
  if (a === "main")
    throw new Error("Cannot delete the main board");
  const o = G(), s = await t.getBoards(e.userType, e.userId);
  ie(s, a);
  const n = {
    ...s,
    updatedAt: o,
    boards: s.boards.filter((r) => r.id !== a)
  };
  return await t.saveBoards(e.userType, n, e.userId), { ok: !0, message: `Board ${a} deleted` };
}
async function tt(t, e, a) {
  const o = G(), s = await t.getBoards(e.userType, e.userId), { board: n, index: r } = ie(s, a.boardId), c = n.tags || [];
  if (c.includes(a.tag))
    return { ok: !0, message: `Tag ${a.tag} already exists` };
  const u = {
    ...n,
    tags: [...c, a.tag]
  }, g = ke(s, r, u, o);
  return await t.saveBoards(e.userType, g, e.userId), { ok: !0, message: `Tag ${a.tag} added to board ${a.boardId}` };
}
async function at(t, e, a) {
  const o = G(), s = await t.getBoards(e.userType, e.userId), { board: n, index: r } = ie(s, a.boardId), c = n.tags || [], u = {
    ...n,
    tags: c.filter((l) => l !== a.tag)
  }, g = ke(s, r, u, o);
  return await t.saveBoards(e.userType, g, e.userId), { ok: !0, message: `Tag ${a.tag} removed from board ${a.boardId}` };
}
async function st(t, e, a) {
  const o = G(), s = await t.getTasks(e.userType, e.userId, a.boardId), n = await t.getStats(e.userType, e.userId, a.boardId);
  let r = 0;
  const c = s.tasks.map((l) => {
    const k = a.updates.find((A) => A.taskId === l.id);
    return k ? (r++, {
      ...l,
      tag: k.tag || void 0,
      updatedAt: o
    }) : l;
  }), u = {
    ...s,
    tasks: c,
    updatedAt: o
  };
  let g = n;
  for (const l of c)
    a.updates.find((k) => k.taskId === l.id) && (g = he(g, l, o));
  return await t.saveTasks(e.userType, e.userId, a.boardId, u), await t.saveStats(e.userType, e.userId, a.boardId, g), {
    ok: !0,
    message: `Updated ${r} task(s) on board ${a.boardId}`,
    updated: r
  };
}
async function nt(t, e, a) {
  const o = G(), s = await t.getTasks(e.userType, e.userId, a.boardId), n = await t.getStats(e.userType, e.userId, a.boardId), r = await t.getBoards(e.userType, e.userId);
  let c = 0;
  const u = s.tasks.map((_) => {
    if (a.taskIds.includes(_.id) && _.tag) {
      const q = _.tag.split(" ").filter(Boolean).filter((M) => M !== a.tag);
      return c++, {
        ..._,
        tag: q.length > 0 ? q.join(" ") : void 0,
        updatedAt: o
      };
    }
    return _;
  }), g = {
    ...s,
    tasks: u,
    updatedAt: o
  };
  let l = n;
  for (const _ of u)
    a.taskIds.includes(_.id) && (l = he(l, _, o));
  const { board: k, index: A } = ie(r, a.boardId), v = k.tags || [], x = {
    ...k,
    tags: v.filter((_) => _ !== a.tag)
  }, E = ke(r, A, x, o);
  return await t.saveTasks(e.userType, e.userId, a.boardId, g), await t.saveStats(e.userType, e.userId, a.boardId, l), await t.saveBoards(e.userType, E, e.userId), {
    ok: !0,
    message: `Cleared tag ${a.tag} from ${c} task(s) on board ${a.boardId}`,
    cleared: c
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
function ot(t = "public", e = "public") {
  const a = new He(t, e), o = { userType: "registered", userId: e };
  return {
    async getBoards() {
      const s = await ze(a, o), n = {
        version: s.version,
        updatedAt: s.updatedAt,
        boards: []
      };
      for (const r of s.boards) {
        const c = await a.getTasks(t, e, r.id), u = await a.getStats(t, e, r.id);
        n.boards.push({
          id: r.id,
          name: r.name,
          tasks: c.tasks,
          stats: u,
          tags: r.tags || []
        });
      }
      return n;
    },
    async createBoard(s) {
      console.debug("[localStorageApi] createBoard (using handler)", { userType: t, userId: e, boardId: s });
      const n = await Ze(
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
      }), z("boards-updated", { sessionId: R, userType: t, userId: e }), n.board;
    },
    async deleteBoard(s) {
      await et(
        a,
        o,
        s
      ), await a.deleteBoardData(t, e, s), z("boards-updated", { sessionId: R, userType: t, userId: e });
    },
    async getTasks(s = "main") {
      return a.getTasks(t, e, s);
    },
    async getStats(s = "main") {
      return a.getStats(t, e, s);
    },
    async createTask(s, n = "main", r = !1) {
      console.log("[localStorageApi] createTask (using handler)", { data: s, boardId: n, suppressBroadcast: r });
      const c = await Ye(
        a,
        o,
        s,
        n
      ), g = (await a.getTasks(t, e, n)).tasks.find((l) => l.id === c.id);
      if (!g)
        throw new Error("Task creation failed - task not found after creation");
      return r ? console.log("[localStorageApi] createTask: broadcast suppressed") : (console.log("[localStorageApi] createTask: broadcasting", {
        sessionId: R,
        boardId: n,
        taskId: c.id
      }), z("tasks-updated", { sessionId: R, userType: t, userId: e, boardId: n })), g;
    },
    async patchTask(s, n, r = "main", c = !1) {
      const u = {};
      n.title !== void 0 && (u.title = n.title), n.tag !== void 0 && n.tag !== null && (u.tag = n.tag), await Ve(
        a,
        o,
        s,
        u,
        r
      ), c || z("tasks-updated", { sessionId: R, userType: t, userId: e, boardId: r });
      const l = (await a.getTasks(t, e, r)).tasks.find((k) => k.id === s);
      if (!l)
        throw new Error("Task not found after update");
      return l;
    },
    async completeTask(s, n = "main") {
      const c = (await a.getTasks(t, e, n)).tasks.find((u) => u.id === s);
      if (!c)
        throw new Error("Task not found");
      return await Ge(
        a,
        o,
        s,
        n
      ), z("tasks-updated", { sessionId: R, userType: t, userId: e, boardId: n }), {
        ...c,
        state: "Completed",
        closedAt: (/* @__PURE__ */ new Date()).toISOString(),
        updatedAt: (/* @__PURE__ */ new Date()).toISOString()
      };
    },
    async deleteTask(s, n = "main", r = !1) {
      console.log("[localStorageApi] deleteTask (using handler)", { id: s, boardId: n, suppressBroadcast: r });
      const u = (await a.getTasks(t, e, n)).tasks.find((g) => g.id === s);
      if (!u)
        throw new Error("Task not found");
      return await Qe(
        a,
        o,
        s,
        n
      ), r ? console.log("[localStorageApi] deleteTask: broadcast suppressed") : (console.log("[localStorageApi] deleteTask: broadcasting", { sessionId: R }), z("tasks-updated", { sessionId: R, userType: t, userId: e, boardId: n })), {
        ...u,
        state: "Deleted",
        closedAt: (/* @__PURE__ */ new Date()).toISOString(),
        updatedAt: (/* @__PURE__ */ new Date()).toISOString()
      };
    },
    async createTag(s, n = "main") {
      await tt(
        a,
        o,
        { boardId: n, tag: s }
      ), z("boards-updated", { sessionId: R, userType: t, userId: e, boardId: n });
    },
    async deleteTag(s, n = "main") {
      await at(
        a,
        o,
        { boardId: n, tag: s }
      ), z("boards-updated", { sessionId: R, userType: t, userId: e, boardId: n });
    },
    // User preferences
    async getPreferences() {
      const s = `${t}-${e}-preferences`, n = localStorage.getItem(s);
      return n ? JSON.parse(n) : {
        version: 1,
        updatedAt: (/* @__PURE__ */ new Date()).toISOString(),
        theme: "light"
      };
    },
    async savePreferences(s) {
      const n = `${t}-${e}-preferences`, c = {
        ...await this.getPreferences(),
        ...s,
        updatedAt: (/* @__PURE__ */ new Date()).toISOString()
      };
      localStorage.setItem(n, JSON.stringify(c));
    },
    // Batch operations
    async batchMoveTasks(s, n, r) {
      const c = await this.getBoards(), u = c.boards.find((x) => x.id === s), g = c.boards.find((x) => x.id === n);
      if (!u)
        throw new Error(`Source board ${s} not found`);
      if (!g)
        throw new Error(`Target board ${n} not found`);
      const l = u.tasks.filter((x) => r.includes(x.id));
      u.tasks = u.tasks.filter((x) => !r.includes(x.id)), g.tasks = [...g.tasks, ...l], c.updatedAt = (/* @__PURE__ */ new Date()).toISOString();
      const k = `${t}-${e}-boards`;
      localStorage.setItem(k, JSON.stringify(c));
      const A = `${t}-${e}-${s}-tasks`, v = `${t}-${e}-${n}-tasks`;
      return localStorage.setItem(A, JSON.stringify({
        version: 1,
        updatedAt: c.updatedAt,
        tasks: u.tasks
      })), localStorage.setItem(v, JSON.stringify({
        version: 1,
        updatedAt: c.updatedAt,
        tasks: g.tasks
      })), z("boards-updated", { sessionId: R, userType: t, userId: e }), { ok: !0, moved: l.length };
    },
    async batchUpdateTags(s, n) {
      console.log("[localStorageApi] batchUpdateTags", { boardId: s, updates: n }), await st(
        a,
        o,
        { boardId: s, updates: n }
      ), z("tasks-updated", { sessionId: R, userType: t, userId: e, boardId: s });
    },
    async batchClearTag(s, n, r) {
      console.log("[localStorageApi] batchClearTag START", { boardId: s, tag: n, taskIds: r, taskCount: r.length });
      const c = await nt(
        a,
        o,
        { boardId: s, tag: n, taskIds: r }
      );
      console.log("[localStorageApi] batchClearTag result:", c), z("boards-updated", { sessionId: R, userType: t, userId: e, boardId: s }), console.log("[localStorageApi] batchClearTag END");
    }
  };
}
async function rt(t, e, a, o) {
  for (const r of e.boards || []) {
    const c = r.id;
    if (r.tasks && r.tasks.length > 0) {
      const u = `${a}-${o}-${c}-tasks`, g = {
        version: 1,
        updatedAt: e.updatedAt || (/* @__PURE__ */ new Date()).toISOString(),
        tasks: r.tasks
      };
      window.localStorage.setItem(u, JSON.stringify(g));
    }
    if (r.stats) {
      const u = `${a}-${o}-${c}-stats`;
      window.localStorage.setItem(u, JSON.stringify(r.stats));
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
    totalTasks: e.boards?.reduce((r, c) => r + (c.tasks?.length || 0), 0) || 0
  });
}
function K(t, e, a) {
  const o = {
    "Content-Type": "application/json",
    "X-User-Type": t
  };
  return e && (o["X-User-Id"] = e), a && (o["X-Session-Id"] = a), o;
}
function pe(t = "public", e = "public", a) {
  const o = ot(t, e);
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
        console.log("[api] Synced from API:", { boards: n.boards.length, totalTasks: n.boards.reduce((r, c) => r + (c.tasks?.length || 0), 0) }), await rt(o, n, t, e);
      } catch (s) {
        console.error("[api] Sync from API failed:", s);
      }
    },
    async createTask(s, n = "main", r = !1) {
      const c = await o.createTask(s, n, r);
      return fetch("/task/api", {
        method: "POST",
        headers: K(t, e, a),
        body: JSON.stringify({
          id: s.id || c.id,
          // Use provided ID (for moves) or client-generated ID
          ...s,
          boardId: n
        })
      }).then((u) => u.json()).then((u) => {
        u.ok && (u.id === c.id ? console.log("[api] Background sync: createTask completed (ID matched)") : console.warn("[api] Server returned different ID (unexpected):", { client: c.id, server: u.id }));
      }).catch((u) => console.error("[api] Failed to sync createTask:", u)), c;
    },
    async createTag(s, n = "main") {
      const r = await o.createTag(s, n);
      return fetch("/task/api/tags", {
        method: "POST",
        headers: K(t, e, a),
        body: JSON.stringify({ boardId: n, tag: s })
      }).then(() => console.log("[api] Background sync: createTag completed")).catch((c) => console.error("[api] Failed to sync createTag:", c)), r;
    },
    async deleteTag(s, n = "main") {
      const r = await o.deleteTag(s, n);
      return fetch("/task/api/tags/delete", {
        method: "POST",
        headers: K(t, e, a),
        body: JSON.stringify({ boardId: n, tag: s })
      }).then(() => console.log("[api] Background sync: deleteTag completed")).catch((c) => console.error("[api] Failed to sync deleteTag:", c)), r;
    },
    async patchTask(s, n, r = "main", c = !1) {
      const u = await o.patchTask(s, n, r, c);
      return fetch(`/task/api/${s}`, {
        method: "PATCH",
        headers: K(t, e, a),
        body: JSON.stringify({ ...n, boardId: r })
      }).then(() => console.log("[api] Background sync: patchTask completed")).catch((g) => console.error("[api] Failed to sync patchTask:", g)), u;
    },
    async completeTask(s, n = "main") {
      const r = await o.completeTask(s, n);
      return fetch(`/task/api/${s}/complete`, {
        method: "POST",
        headers: K(t, e, a),
        body: JSON.stringify({ boardId: n })
      }).then((c) => {
        if (!c.ok) throw new Error(`HTTP ${c.status}`);
        console.log("[api] Background sync: completeTask completed");
      }).catch((c) => console.error("[api] Failed to sync completeTask:", c)), r;
    },
    async deleteTask(s, n = "main", r = !1) {
      await o.deleteTask(s, n, r), fetch(`/task/api/${s}`, {
        method: "DELETE",
        headers: K(t, e, a),
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
      const c = await o.batchMoveTasks(s, n, r);
      return fetch("/task/api/batch-move", {
        method: "POST",
        headers: K(t, e, a),
        body: JSON.stringify({ sourceBoardId: s, targetBoardId: n, taskIds: r })
      }).then(() => console.log("[api] Background sync: batchMoveTasks completed")).catch((u) => console.error("[api] Failed to sync batchMoveTasks:", u)), c;
    },
    async batchClearTag(s, n, r) {
      await o.batchClearTag(s, n, r), fetch("/task/api/batch-clear-tag", {
        method: "POST",
        headers: K(t, e, a),
        body: JSON.stringify({ boardId: s, tag: n, taskIds: r })
      }).then(() => console.log("[api] Background sync: batchClearTag completed")).catch((c) => console.error("[api] Failed to sync batchClearTag:", c));
    }
  };
}
function ct(t) {
  t = t.trim();
  const e = (s) => s.trim().replace(/\s+/g, "-"), a = t.match(/^["']([^"']+)["']\s*(.*)$/);
  if (a) {
    const s = a[1].trim(), r = a[2].match(/#[^\s#]+/g)?.map((c) => e(c.slice(1))).filter(Boolean) || [];
    return { title: s, tag: r.length ? r.join(" ") : void 0 };
  }
  const o = t.match(/^(.+?)\s+(#.+)$/);
  if (o) {
    const s = o[1].trim(), r = o[2].match(/#[^\s#]+/g)?.map((c) => e(c.slice(1))).filter(Boolean) || [];
    return { title: s, tag: r.length ? r.join(" ") : void 0 };
  }
  return { title: t.trim() };
}
function it(t, e = 6, a = []) {
  const o = t.flatMap((n) => n.tag?.split(" ") || []).filter(Boolean), s = {};
  return o.forEach((n) => s[n] = (s[n] || 0) + 1), a.filter(Boolean).forEach((n) => {
    s[n] || (s[n] = 0);
  }), Object.entries(s).sort((n, r) => r[1] - n[1]).slice(0, e).map(([n]) => n);
}
function ye(t, e) {
  return t.filter((a) => a.tag?.split(" ").includes(e));
}
function lt(t, e, a) {
  const o = Array.isArray(a) && a.length > 0;
  return t.filter((s) => {
    const n = s.tag?.split(" ") || [];
    return o ? a.some((c) => n.includes(c)) && !e.some((c) => n.includes(c)) : !e.some((r) => n.includes(r));
  });
}
function de(t) {
  return Array.from(new Set(t.flatMap((e) => e.tag?.split(" ") || []).filter(Boolean)));
}
async function we(t, e, a, o, s = {}) {
  const { onError: n, suppress404: r = !0 } = s;
  if (e.has(t)) {
    console.log(`[withPendingOperation] Operation already pending: ${t}`);
    return;
  }
  a((c) => /* @__PURE__ */ new Set([...c, t]));
  try {
    return await o();
  } catch (c) {
    r && c?.message?.includes("404") || (n ? n(c) : console.error(`[withPendingOperation] Error in ${t}:`, c));
    return;
  } finally {
    a((c) => {
      const u = new Set(c);
      return u.delete(t), u;
    });
  }
}
function se(t, e) {
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
function dt({ userType: t, userId: e, sessionId: a }) {
  const [o, s] = N([]), [n, r] = N(/* @__PURE__ */ new Set()), c = je(
    () => pe(t, e || "public", a),
    [t, e, a]
  ), [u, g] = N(null), [l, k] = N("main");
  async function A() {
    console.log("[useTasks] initialLoad called"), "syncFromApi" in c && await c.syncFromApi(), await v();
  }
  async function v() {
    console.log("[useTasks] reload called", { currentBoardId: l, stack: new Error().stack?.split(`
`).slice(1, 4).join(`
`) });
    const m = await c.getBoards();
    g(m);
    const { tasks: i } = se(m, l);
    s(i);
  }
  V(() => {
    console.log("[useTasks] User context changed, clearing state and reloading", { userType: t, userId: e }), s([]), r(/* @__PURE__ */ new Set()), g(null), k("main"), v();
  }, [t, e]), V(() => {
    console.log("[useTasks] Setting up BroadcastChannel listener", { currentBoardId: l, userType: t, userId: e });
    try {
      const m = new BroadcastChannel("tasks");
      return m.onmessage = (i) => {
        const d = i.data || {};
        if (console.log("[useTasks] BroadcastChannel message received", { msg: d, sessionId: R, currentBoardId: l, currentContext: { userType: t, userId: e } }), d.sessionId === R) {
          console.log("[useTasks] Ignoring own broadcast message");
          return;
        }
        if (d.userType !== t || d.userId !== e) {
          console.log("[useTasks] Ignoring message for different user context", {
            msgContext: { userType: d.userType, userId: d.userId },
            currentContext: { userType: t, userId: e }
          });
          return;
        }
        (d.type === "tasks-updated" || d.type === "boards-updated") && (console.log("[useTasks] BroadcastChannel: triggering reload for currentBoardId =", l), v());
      }, () => {
        console.log("[useTasks] Cleaning up BroadcastChannel listener", { currentBoardId: l }), m.close();
      };
    } catch (m) {
      console.error("[useTasks] Failed to setup BroadcastChannel", m);
    }
  }, [l, t, e]);
  async function x(m) {
    if (m = m.trim(), !!m)
      try {
        const i = ct(m);
        return await c.createTask(i, l), await v(), !0;
      } catch (i) {
        return alert(i.message || "Failed to create task"), !1;
      }
  }
  async function E(m) {
    await we(
      `complete-${m}`,
      n,
      r,
      async () => {
        await c.completeTask(m, l), await v();
      },
      {
        onError: (i) => alert(i.message || "Failed to complete task")
      }
    );
  }
  async function _(m) {
    console.log("[useTasks] deleteTask START", { taskId: m, currentBoardId: l }), await we(
      `delete-${m}`,
      n,
      r,
      async () => {
        console.log("[useTasks] deleteTask: calling api.deleteTask", { taskId: m, currentBoardId: l }), await c.deleteTask(m, l), console.log("[useTasks] deleteTask: calling reload"), await v(), console.log("[useTasks] deleteTask END");
      },
      {
        onError: (i) => alert(i.message || "Failed to delete task")
      }
    );
  }
  async function I(m) {
    const i = prompt("Enter tag (without #):");
    if (!i) return;
    const d = i.trim().replace(/^#+/, "").replace(/\s+/g, "-"), h = o.find((w) => w.id === m);
    if (!h) return;
    const y = h.tag?.split(" ") || [];
    if (y.includes(d)) return;
    const S = [...y, d].join(" ");
    try {
      await c.patchTask(m, { tag: S }, l), await v();
    } catch (w) {
      alert(w.message || "Failed to add tag");
    }
  }
  async function q(m, i, d = {}) {
    const { suppressBroadcast: h = !1, skipReload: y = !1 } = d;
    try {
      await c.patchTask(m, i, l, h), y || await v();
    } catch (S) {
      throw S;
    }
  }
  async function M(m) {
    console.log("[useTasks] bulkUpdateTaskTags START", { count: m.length });
    try {
      await c.batchUpdateTags(
        l,
        m.map((i) => ({ taskId: i.taskId, tag: i.tag || null }))
      ), console.log("[useTasks] bulkUpdateTaskTags: calling reload"), await v(), console.log("[useTasks] bulkUpdateTaskTags END");
    } catch (i) {
      throw console.error("[useTasks] bulkUpdateTaskTags ERROR", i), i;
    }
  }
  async function U(m) {
    console.log("[useTasks] clearTasksByTag START", { tag: m, currentBoardId: l, taskCount: o.length });
    const i = o.filter((d) => d.tag?.split(" ").includes(m));
    if (console.log("[useTasks] clearTasksByTag: found tasks with tag", { tag: m, count: i.length }), i.length === 0) {
      console.log("[useTasks] clearTasksByTag: no tasks found with this tag, just deleting tag");
      try {
        await c.deleteTag(m, l), await v(), console.log("[useTasks] clearTasksByTag END (no tasks to clear)");
      } catch (d) {
        console.error("[useTasks] clearTasksByTag ERROR", d), console.error("[useTasks] clearTasksByTag: Please fix this error:", d.message);
      }
      return;
    }
    try {
      console.log("[useTasks] clearTasksByTag: starting batch clear"), await c.batchClearTag(
        l,
        m,
        i.map((d) => d.id)
      ), console.log("[useTasks] clearTasksByTag: calling reload"), await v(), console.log("[useTasks] clearTasksByTag END");
    } catch (d) {
      console.error("[useTasks] clearTasksByTag ERROR", d), alert(d.message || "Failed to remove tag from tasks");
    }
  }
  async function Y(m) {
    if (confirm("Clear all remaining tasks?"))
      try {
        for (const i of m)
          await c.deleteTask(i.id, l);
        await v();
      } catch (i) {
        alert(i.message || "Failed to clear remaining tasks");
      }
  }
  async function J(m) {
    await c.createBoard(m), k(m);
    const i = await c.getBoards();
    g(i);
    const { tasks: d } = se(i, m);
    s(d);
  }
  async function Z(m, i) {
    if (console.log("[useTasks] moveTasksToBoard START", { targetBoardId: m, ids: i, currentBoardId: l }), !u) return;
    const d = /* @__PURE__ */ new Set();
    for (const h of u.boards)
      for (const y of h.tasks || [])
        i.includes(y.id) && d.add(h.id);
    console.log("[useTasks] moveTasksToBoard: source boards", { sourceBoardIds: Array.from(d) });
    try {
      if (d.size === 1) {
        const S = Array.from(d)[0];
        console.log("[useTasks] moveTasksToBoard: using batch API"), await c.batchMoveTasks(S, m, i);
      } else
        throw console.error("[useTasks] moveTasksToBoard: Cannot move tasks from multiple boards at once"), new Error("Cannot move tasks from multiple boards at once");
      console.log("[useTasks] moveTasksToBoard: switching to target board", { targetBoardId: m }), k(m);
      const h = await c.getBoards();
      g(h);
      const { tasks: y } = se(h, m);
      s(y), console.log("[useTasks] moveTasksToBoard END");
    } catch (h) {
      console.error("[useTasks] moveTasksToBoard ERROR", h), alert(h.message || "Failed to move tasks");
    }
  }
  async function j(m) {
    if (await c.deleteBoard(m), l === m) {
      k("main");
      const i = await c.getBoards();
      g(i);
      const { tasks: d } = se(i, "main");
      s(d);
    } else
      await v();
  }
  async function ee(m) {
    await c.createTag(m, l), await v();
  }
  async function P(m) {
    await c.deleteTag(m, l), await v();
  }
  function Q(m) {
    k(m);
    const { tasks: i, foundBoard: d } = se(u, m);
    d ? s(i) : v();
  }
  return {
    // Task state
    tasks: o,
    pendingOperations: n,
    // Task operations
    addTask: x,
    completeTask: E,
    deleteTask: _,
    addTagToTask: I,
    updateTaskTags: q,
    bulkUpdateTaskTags: M,
    clearTasksByTag: U,
    clearRemainingTasks: Y,
    // Board state
    boards: u,
    currentBoardId: l,
    // Board operations
    createBoard: J,
    deleteBoard: j,
    switchBoard: Q,
    moveTasksToBoard: Z,
    createTagOnBoard: ee,
    deleteTagOnBoard: P,
    // Lifecycle
    initialLoad: A,
    reload: v
  };
}
function ut({ tasks: t, onTaskUpdate: e, onBulkUpdate: a }) {
  const [o, s] = N(null), [n, r] = N(null), [c, u] = N(/* @__PURE__ */ new Set()), [g, l] = N(!1), [k, A] = N(null), [v, x] = N(null), E = ce(null);
  function _(i) {
    let d = [];
    try {
      const h = i.dataTransfer.getData("application/x-hadoku-task-ids");
      h && (d = JSON.parse(h));
    } catch {
    }
    if (d.length === 0) {
      const h = i.dataTransfer.getData("text/plain");
      h && (d = [h]);
    }
    return d;
  }
  function I(i, d) {
    const h = c.has(d) && c.size > 0 ? Array.from(c) : [d];
    console.log("[useDragAndDrop] onDragStart", { taskId: d, idsToDrag: h, selectedCount: c.size }), i.dataTransfer.setData("text/plain", h[0]);
    try {
      i.dataTransfer.setData("application/x-hadoku-task-ids", JSON.stringify(h));
    } catch {
    }
    i.dataTransfer.effectAllowed = "copyMove";
    try {
      const y = i.currentTarget, S = y.closest && y.closest(".task-app__item") ? y.closest(".task-app__item") : y;
      S.classList.add("dragging");
      const w = S.cloneNode(!0);
      w.style.boxSizing = "border-box", w.style.width = `${S.offsetWidth}px`, w.style.height = `${S.offsetHeight}px`, w.style.opacity = "0.95", w.style.transform = "none", w.style.filter = "drop-shadow(0 6px 18px rgba(0,0,0,0.12))", w.classList.add("drag-image"), w.style.position = "absolute", w.style.top = "-9999px", w.style.left = "-9999px", document.body.appendChild(w), S.__dragImage = w, u((f) => {
        if (f.has(d)) return new Set(f);
        const C = new Set(f);
        return C.add(d), C;
      });
      try {
        const f = S.closest(".task-app__tag-column");
        if (f) {
          const C = f.querySelector(".task-app__tag-header") || f.querySelector("h3"), F = (C && C.textContent || "").trim().replace(/^#/, "");
          if (F)
            try {
              i.dataTransfer.setData("application/x-hadoku-task-source", F);
            } catch {
            }
        }
      } catch {
      }
      try {
        const f = S.getBoundingClientRect();
        let C = Math.round(i.clientX - f.left), D = Math.round(i.clientY - f.top);
        C = Math.max(0, Math.min(Math.round(w.offsetWidth - 1), C)), D = Math.max(0, Math.min(Math.round(w.offsetHeight - 1), D)), i.dataTransfer.setDragImage(w, C, D);
      } catch {
        i.dataTransfer.setDragImage(w, 0, 0);
      }
    } catch {
    }
  }
  function q(i) {
    try {
      const d = i.currentTarget;
      d.classList.remove("dragging");
      const h = d.__dragImage;
      h && h.parentNode && h.parentNode.removeChild(h), h && delete d.__dragImage;
    } catch {
    }
    try {
      J();
    } catch {
    }
  }
  function M(i) {
    if (i.button === 0) {
      try {
        const d = i.target;
        if (!d || d.closest && d.closest(".task-app__item, .task-app__controls, button, input, textarea, .task-app__item-actions"))
          return;
      } catch {
      }
      l(!0), E.current = { x: i.clientX, y: i.clientY }, A({ x: i.clientX, y: i.clientY, w: 0, h: 0 }), u(/* @__PURE__ */ new Set());
      try {
        document.body.classList.add("marquee-selecting");
      } catch {
      }
    }
  }
  function U(i) {
    if (!g || !E.current) return;
    const d = E.current.x, h = E.current.y, y = i.clientX, S = i.clientY, w = Math.min(d, y), f = Math.min(h, S), C = Math.abs(y - d), D = Math.abs(S - h);
    A({ x: w, y: f, w: C, h: D });
    const F = Array.from(document.querySelectorAll(".task-app__item")), W = /* @__PURE__ */ new Set();
    for (const X of F) {
      const H = X.getBoundingClientRect();
      if (!(H.right < w || H.left > w + C || H.bottom < f || H.top > f + D)) {
        const oe = X.getAttribute("data-task-id");
        oe && W.add(oe), X.classList.add("selected");
      } else
        X.classList.remove("selected");
    }
    u(W);
  }
  function Y(i) {
    l(!1), A(null), E.current = null;
    try {
      document.body.classList.remove("marquee-selecting");
    } catch {
    }
    try {
      x(Date.now());
    } catch {
    }
  }
  function J() {
    u(/* @__PURE__ */ new Set()), Array.from(document.querySelectorAll(".task-app__item.selected")).forEach((d) => d.classList.remove("selected"));
  }
  V(() => {
    function i(y) {
      if (y.button !== 0) return;
      const S = { target: y.target, clientX: y.clientX, clientY: y.clientY, button: y.button };
      try {
        M(S);
      } catch {
      }
    }
    function d(y) {
      const S = { clientX: y.clientX, clientY: y.clientY };
      try {
        U(S);
      } catch {
      }
    }
    function h(y) {
      const S = { clientX: y.clientX, clientY: y.clientY };
      try {
        Y(S);
      } catch {
      }
    }
    return document.addEventListener("mousedown", i), document.addEventListener("mousemove", d), document.addEventListener("mouseup", h), () => {
      document.removeEventListener("mousedown", i), document.removeEventListener("mousemove", d), document.removeEventListener("mouseup", h);
    };
  }, []);
  function Z(i, d) {
    i.preventDefault(), i.dataTransfer.dropEffect = "copy", s(d);
  }
  function j(i) {
    i.currentTarget.contains(i.relatedTarget) || s(null);
  }
  async function ee(i, d) {
    i.preventDefault(), s(null), console.log("[useDragAndDrop] onDrop START", { targetTag: d });
    const h = _(i);
    if (h.length === 0) return;
    let y = null;
    try {
      const w = i.dataTransfer.getData("application/x-hadoku-task-source");
      w && (y = w);
    } catch {
    }
    console.log("[useDragAndDrop] onDrop: processing", { targetTag: d, ids: h, srcTag: y, taskCount: h.length });
    const S = [];
    for (const w of h) {
      const f = t.find((X) => X.id === w);
      if (!f) continue;
      const C = f.tag?.split(" ").filter(Boolean) || [];
      if (d === "other") {
        if (C.length === 0) continue;
        S.push({ taskId: w, tag: "" });
        continue;
      }
      const D = C.includes(d);
      let F = C.slice();
      D || F.push(d), y && y !== d && (F = F.filter((X) => X !== y));
      const W = F.join(" ").trim();
      S.push({ taskId: w, tag: W });
    }
    console.log("[useDragAndDrop] onDrop: updating tasks", { updateCount: S.length });
    try {
      await a(S), console.log("[useDragAndDrop] onDrop: updates complete, clearing selection");
      try {
        J();
      } catch {
      }
    } catch (w) {
      console.error("Failed to add tag to one or more tasks:", w), alert(w.message || "Failed to add tags");
    }
    console.log("[useDragAndDrop] onDrop END");
  }
  function P(i, d) {
    i.preventDefault(), i.dataTransfer.dropEffect = "copy", r(d);
  }
  function Q(i) {
    i.currentTarget.contains(i.relatedTarget) || r(null);
  }
  async function m(i, d) {
    i.preventDefault(), r(null);
    const h = _(i);
    if (h.length === 0) return;
    console.log("[useDragAndDrop] onFilterDrop", { filterTag: d, ids: h, taskCount: h.length });
    const y = [];
    for (const S of h) {
      const w = t.find((D) => D.id === S);
      if (!w) continue;
      const f = w.tag?.split(" ").filter(Boolean) || [];
      if (f.includes(d)) {
        console.log(`Task ${S} already has tag: ${d}`);
        continue;
      }
      const C = [...f, d].join(" ");
      y.push({ taskId: S, tag: C });
    }
    if (y.length === 0) {
      console.log("No updates needed - all tasks already have this tag");
      return;
    }
    console.log(`Adding tag "${d}" to ${y.length} task(s) via filter drop`);
    try {
      await a(y);
      try {
        J();
      } catch {
      }
    } catch (S) {
      console.error("Failed to add tag via filter drop:", S), alert(S.message || "Failed to add tag");
    }
  }
  return {
    dragOverTag: o,
    dragOverFilter: n,
    setDragOverFilter: r,
    selectedIds: c,
    isSelecting: g,
    marqueeRect: k,
    selectionJustEndedAt: v,
    // selection handlers
    selectionStartHandler: M,
    selectionMoveHandler: U,
    selectionEndHandler: Y,
    clearSelection: J,
    onDragStart: I,
    onDragEnd: q,
    onDragOver: Z,
    onDragLeave: j,
    onDrop: ee,
    onFilterDragOver: P,
    onFilterDragLeave: Q,
    onFilterDrop: m
  };
}
function gt() {
  const [t, e] = N({});
  function a(r) {
    e((c) => {
      const g = (c[r] || "desc") === "desc" ? "asc" : "desc";
      return { ...c, [r]: g };
    });
  }
  function o(r, c) {
    return [...r].sort((u, g) => {
      const l = new Date(u.createdAt).getTime(), k = new Date(g.createdAt).getTime();
      return c === "asc" ? l - k : k - l;
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
function Ae({ onLongPress: t, delay: e = 500 }) {
  const a = ce(null);
  return {
    onTouchStart: (r) => {
      const c = r.touches[0];
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
function me(t) {
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
function pt({
  board: t,
  isActive: e,
  isDragOver: a,
  onSwitch: o,
  onContextMenu: s,
  onDragOverFilter: n,
  onMoveTasksToBoard: r,
  onClearSelection: c
}) {
  const u = Ae({
    onLongPress: (l, k) => s(t.id, l, k)
  }), g = t.id === "main";
  return /* @__PURE__ */ T(
    "button",
    {
      className: `board-btn ${e ? "board-btn--active" : ""} ${a ? "board-btn--drag-over" : ""}`,
      onClick: () => o(t.id),
      onContextMenu: (l) => {
        l.preventDefault(), !g && s(t.id, l.clientX, l.clientY);
      },
      ...g ? {} : u,
      "aria-pressed": e ? "true" : "false",
      onDragOver: (l) => {
        l.preventDefault(), l.dataTransfer.dropEffect = "move", n(`board:${t.id}`);
      },
      onDragLeave: (l) => {
        n(null);
      },
      onDrop: async (l) => {
        l.preventDefault(), n(null);
        const k = me(l.dataTransfer);
        if (k.length !== 0)
          try {
            await r(t.id, k);
            try {
              c();
            } catch {
            }
          } catch (A) {
            console.error("Failed moving tasks to board", A), alert(A.message || "Failed to move tasks");
          }
      },
      children: t.name
    }
  );
}
function mt({
  tag: t,
  isActive: e,
  isDragOver: a,
  onToggle: o,
  onContextMenu: s,
  onDragOver: n,
  onDragLeave: r,
  onDrop: c
}) {
  const u = Ae({
    onLongPress: (g, l) => s(t, g, l)
  });
  return /* @__PURE__ */ O(
    "button",
    {
      onClick: () => o(t),
      onContextMenu: (g) => {
        g.preventDefault(), s(t, g.clientX, g.clientY);
      },
      ...u,
      className: `${e ? "on" : ""} ${a ? "task-app__filter-drag-over" : ""}`,
      onDragOver: (g) => n(g, t),
      onDragLeave: r,
      onDrop: (g) => c(g, t),
      children: [
        "#",
        t
      ]
    }
  );
}
function ft(t) {
  const e = /* @__PURE__ */ new Date(), a = new Date(t), o = e.getTime() - a.getTime(), s = Math.floor(o / 1e3), n = Math.floor(s / 60), r = Math.floor(n / 60), c = Math.floor(r / 24);
  return s < 60 ? `${s}s ago` : n < 60 ? `${n}m ago` : r < 24 ? `${r}h ago` : `${c}d ago`;
}
function ue({
  task: t,
  isDraggable: e = !0,
  pendingOperations: a,
  onComplete: o,
  onDelete: s,
  onAddTag: n,
  onDragStart: r,
  onDragEnd: c,
  selected: u = !1
}) {
  const g = a.has(`complete-${t.id}`), l = a.has(`delete-${t.id}`);
  return /* @__PURE__ */ O(
    "li",
    {
      className: `task-app__item ${u ? "selected" : ""}`,
      "data-task-id": t.id,
      draggable: e,
      onDragStart: r ? (k) => r(k, t.id) : void 0,
      onDragEnd: (k) => {
        if (k.currentTarget.classList.remove("dragging"), c)
          try {
            c(k);
          } catch {
          }
      },
      children: [
        /* @__PURE__ */ O("div", { className: "task-app__item-content", children: [
          /* @__PURE__ */ T("div", { className: "task-app__item-title", title: t.title, children: t.title }),
          /* @__PURE__ */ O("div", { className: "task-app__item-meta-row", children: [
            t.tag ? /* @__PURE__ */ T("div", { className: "task-app__item-tag", children: t.tag.split(" ").map((k) => `#${k}`).join(" ") }) : /* @__PURE__ */ T("div", {}),
            /* @__PURE__ */ T("div", { className: "task-app__item-age", children: ft(t.createdAt) })
          ] })
        ] }),
        /* @__PURE__ */ O("div", { className: "task-app__item-actions", children: [
          /* @__PURE__ */ T(
            "button",
            {
              className: "task-app__action-btn task-app__complete-btn",
              onClick: () => o(t.id),
              title: "Complete task",
              disabled: g || l,
              children: g ? "⏳" : "✓"
            }
          ),
          /* @__PURE__ */ T(
            "button",
            {
              className: "task-app__action-btn task-app__delete-btn",
              onClick: () => s(t.id),
              title: "Delete task",
              disabled: g || l,
              children: l ? "⏳" : "×"
            }
          )
        ] })
      ]
    }
  );
}
function ve(t, e = !1) {
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
function kt({
  tasks: t,
  topTags: e,
  isMobile: a = !1,
  filters: o,
  sortDirections: s,
  dragOverTag: n,
  pendingOperations: r,
  onComplete: c,
  onDelete: u,
  onAddTag: g,
  onDragStart: l,
  onDragEnd: k,
  selectedIds: A,
  onSelectionStart: v,
  onSelectionMove: x,
  onSelectionEnd: E,
  onDragOver: _,
  onDragLeave: I,
  onDrop: q,
  toggleSort: M,
  sortTasksByAge: U,
  getSortIcon: Y,
  getSortTitle: J,
  clearTasksByTag: Z,
  clearRemainingTasks: j,
  onDeletePersistedTag: ee
}) {
  const P = (f, C) => /* @__PURE__ */ O(
    "div",
    {
      className: `task-app__tag-column ${n === f ? "task-app__tag-column--drag-over" : ""}`,
      onDragOver: (D) => _(D, f),
      onDragLeave: I,
      onDrop: (D) => q(D, f),
      children: [
        /* @__PURE__ */ O("div", { className: "task-app__tag-header-row", children: [
          /* @__PURE__ */ O("h3", { className: "task-app__tag-header", children: [
            "#",
            f
          ] }),
          /* @__PURE__ */ T(
            "button",
            {
              className: "task-app__sort-btn task-app__sort-btn--active",
              onClick: () => M(f),
              title: J(s[f] || "desc"),
              children: Y(s[f] || "desc")
            }
          )
        ] }),
        /* @__PURE__ */ T("ul", { className: "task-app__list task-app__list--column", children: U(C, s[f] || "desc").map((D) => /* @__PURE__ */ T(
          ue,
          {
            task: D,
            isDraggable: !0,
            pendingOperations: r,
            onComplete: c,
            onDelete: u,
            onAddTag: g,
            onDragStart: l,
            onDragEnd: k,
            selected: A ? A.has(D.id) : !1
          },
          D.id
        )) })
      ]
    },
    f
  ), Q = (f, C) => {
    let D = ye(t, f);
    return i && (D = D.filter((F) => {
      const W = F.tag?.split(" ") || [];
      return o.some((X) => W.includes(X));
    })), D.slice(0, C);
  }, m = e.length, i = Array.isArray(o) && o.length > 0, d = t.filter((f) => {
    if (!i) return !0;
    const C = f.tag?.split(" ") || [];
    return o.some((D) => C.includes(D));
  }), h = ve(m, a), y = i ? e.filter((f) => ye(t, f).some((D) => {
    const F = D.tag?.split(" ") || [];
    return o.some((W) => F.includes(W));
  })) : e.slice(0, h.useTags);
  if (y.length === 0)
    return /* @__PURE__ */ T("ul", { className: "task-app__list", children: d.map((f) => /* @__PURE__ */ T(
      ue,
      {
        task: f,
        pendingOperations: r,
        onComplete: c,
        onDelete: u,
        onAddTag: g,
        onDragStart: l,
        onDragEnd: k,
        selected: A ? A.has(f.id) : !1
      },
      f.id
    )) });
  const S = lt(t, e, o).filter((f) => {
    if (!i) return !0;
    const C = f.tag?.split(" ") || [];
    return o.some((D) => C.includes(D));
  }), w = ve(y.length, a);
  return /* @__PURE__ */ O("div", { className: "task-app__dynamic-layout", children: [
    w.rows.length > 0 && /* @__PURE__ */ T(Ue, { children: w.rows.map((f, C) => /* @__PURE__ */ T("div", { className: `task-app__tag-grid task-app__tag-grid--${f.columns}col`, children: f.tagIndices.map((D) => {
      const F = y[D];
      return F ? P(F, Q(F, w.maxPerColumn)) : null;
    }) }, C)) }),
    S.length > 0 && /* @__PURE__ */ O(
      "div",
      {
        className: `task-app__remaining ${n === "other" ? "task-app__tag-column--drag-over" : ""}`,
        onDragOver: (f) => {
          f.preventDefault(), f.dataTransfer.dropEffect = "move", _(f, "other");
        },
        onDragLeave: (f) => I(f),
        onDrop: (f) => q(f, "other"),
        children: [
          /* @__PURE__ */ O("div", { className: "task-app__tag-header-row", children: [
            /* @__PURE__ */ T("h3", { className: "task-app__remaining-header", children: "Other Tasks" }),
            /* @__PURE__ */ T(
              "button",
              {
                className: "task-app__sort-btn task-app__sort-btn--active",
                onClick: () => M("other"),
                title: J(s.other || "desc"),
                children: Y(s.other || "desc")
              }
            )
          ] }),
          /* @__PURE__ */ T("ul", { className: "task-app__list", children: U(S, s.other || "desc").map((f) => /* @__PURE__ */ T(
            ue,
            {
              task: f,
              pendingOperations: r,
              onComplete: c,
              onDelete: u,
              onAddTag: g,
              onDragStart: l,
              onDragEnd: k,
              selected: A ? A.has(f.id) : !1
            },
            f.id
          )) })
        ]
      }
    )
  ] });
}
function ge({
  isOpen: t,
  title: e,
  onClose: a,
  onConfirm: o,
  children: s,
  inputValue: n,
  onInputChange: r,
  inputPlaceholder: c,
  confirmLabel: u = "Confirm",
  cancelLabel: g = "Cancel",
  confirmDisabled: l = !1,
  confirmDanger: k = !1
}) {
  return t ? /* @__PURE__ */ T(
    "div",
    {
      className: "modal-overlay",
      onClick: a,
      children: /* @__PURE__ */ O(
        "div",
        {
          className: "modal-card",
          onClick: (v) => v.stopPropagation(),
          children: [
            /* @__PURE__ */ T("h3", { children: e }),
            s,
            r && /* @__PURE__ */ T(
              "input",
              {
                type: "text",
                className: "modal-input",
                value: n || "",
                onChange: (v) => r(v.target.value),
                placeholder: c,
                autoFocus: !0,
                onKeyDown: (v) => {
                  v.key === "Enter" && !l && (v.preventDefault(), o()), v.key === "Escape" && (v.preventDefault(), a());
                }
              }
            ),
            /* @__PURE__ */ O("div", { className: "modal-actions", children: [
              /* @__PURE__ */ T(
                "button",
                {
                  className: "modal-button",
                  onClick: a,
                  children: g
                }
              ),
              /* @__PURE__ */ T(
                "button",
                {
                  className: `modal-button ${k ? "modal-button--danger" : "modal-button--primary"}`,
                  onClick: o,
                  disabled: l,
                  children: u
                }
              )
            ] })
          ]
        }
      )
    }
  ) : null;
}
function be({ isOpen: t, x: e, y: a, items: o, className: s = "board-context-menu" }) {
  return t ? /* @__PURE__ */ T(
    "div",
    {
      className: s,
      style: {
        left: `${e}px`,
        top: `${a}px`
      },
      children: o.map((n, r) => /* @__PURE__ */ T(
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
const Se = [
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
function ht() {
  return Se[Math.floor(Math.random() * Se.length)];
}
const Be = 768;
function Tt() {
  const [t, e] = N(() => typeof window > "u" ? !1 : window.innerWidth < Be);
  return V(() => {
    if (typeof window > "u") return;
    const a = window.matchMedia(`(max-width: ${Be - 1}px)`), o = (s) => {
      e(s.matches);
    };
    return a.addEventListener ? a.addEventListener("change", o) : a.addListener(o), o(a), () => {
      a.removeEventListener ? a.removeEventListener("change", o) : a.removeListener(o);
    };
  }, []), t;
}
const De = 5, Ce = [
  { name: "light", emoji: "☀️", label: "Light theme" },
  { name: "dark", emoji: "🌙", label: "Dark theme" },
  { name: "strawberry", emoji: "🍓", label: "Strawberry theme" },
  { name: "ocean", emoji: "🌊", label: "Ocean theme" },
  { name: "cyberpunk", emoji: "🤖", label: "Cyberpunk theme" },
  { name: "coffee", emoji: "☕", label: "Coffee theme" },
  { name: "lavender", emoji: "🪻", label: "Lavender theme" }
], yt = (t) => Ce.find((e) => e.name === t)?.emoji || "🌙";
function wt(t = {}) {
  const { userType: e = "public", userId: a = "public", sessionId: o } = t, s = Tt(), [n] = N(() => ht()), [r, c] = N(/* @__PURE__ */ new Set()), [u, g] = N(null), [l, k] = N(!1), [A, v] = N(!1), [x, E] = N(null), [_, I] = N(""), [q, M] = N(null), [U, Y] = N("light"), [J, Z] = N(!1), [j, ee] = N(null), [P, Q] = N(null), m = ce(null), i = ce(null), {
    tasks: d,
    pendingOperations: h,
    initialLoad: y,
    addTask: S,
    completeTask: w,
    deleteTask: f,
    addTagToTask: C,
    updateTaskTags: D,
    bulkUpdateTaskTags: F,
    clearTasksByTag: W,
    clearRemainingTasks: X,
    // board API
    boards: H,
    currentBoardId: ne,
    createBoard: oe,
    deleteBoard: xe,
    switchBoard: _e,
    moveTasksToBoard: Te,
    createTagOnBoard: Oe,
    deleteTagOnBoard: Ne
  } = dt({ userType: e, userId: a, sessionId: o }), b = ut({
    tasks: d,
    onTaskUpdate: D,
    onBulkUpdate: F
  }), ae = gt();
  V(() => {
    pe(e, a, o).getPreferences().then((B) => {
      B.theme && Y(B.theme);
    });
  }, [e, a, o]), V(() => {
    pe(e, a, o).savePreferences({ theme: U });
  }, [U, e, a, o]), V(() => {
    c(/* @__PURE__ */ new Set());
  }, [ne]), V(() => {
    console.log("[App] User context changed, initializing...", { userType: e, userId: a }), y(), m.current?.focus();
  }, [e, a]), V(() => {
    i.current && i.current.setAttribute("data-theme", U);
  }, [U]), V(() => {
    if (!J && !j && !P) return;
    const p = (B) => {
      const $ = B.target;
      $.closest(".theme-picker") || Z(!1), $.closest(".board-context-menu") || ee(null), $.closest(".tag-context-menu") || Q(null);
    };
    return document.addEventListener("mousedown", p), () => document.removeEventListener("mousedown", p);
  }, [J, j, P]);
  async function $e(p) {
    await S(p) && m.current && (m.current.value = "", m.current.focus());
  }
  function Fe(p) {
    const B = d.filter(($) => $.tag?.split(" ").includes(p));
    g({ tag: p, count: B.length });
  }
  async function Ee(p) {
    const B = p.trim().replace(/\s+/g, "-");
    try {
      if (await Oe(B), x?.type === "apply-tag" && x.taskIds.length > 0) {
        const $ = x.taskIds.map((L) => {
          const te = d.find((Ie) => Ie.id === L)?.tag?.split(" ").filter(Boolean) || [], Re = [.../* @__PURE__ */ new Set([...te, B])];
          return { taskId: L, tag: Re.join(" ") };
        });
        await F($), b.clearSelection();
      }
      E(null);
    } catch ($) {
      throw console.error("[App] Failed to create tag:", $), $;
    }
  }
  function le(p) {
    const B = p.trim();
    return B ? (H?.boards?.map((L) => L.id.toLowerCase()) || []).includes(B.toLowerCase()) ? `Board "${B}" already exists` : null : "Board name cannot be empty";
  }
  async function Me(p) {
    const B = p.trim(), $ = le(B);
    if ($) {
      M($);
      return;
    }
    try {
      await oe(B), x?.type === "move-to-board" && x.taskIds.length > 0 && (await Te(B, x.taskIds), b.clearSelection()), E(null), M(null);
    } catch (L) {
      console.error("[App] Failed to create board:", L), M(L.message || "Failed to create board");
    }
  }
  const Pe = H?.boards?.find((p) => p.id === ne)?.tags || [], Le = it(d, s ? 3 : 6);
  return /* @__PURE__ */ T(
    "div",
    {
      ref: i,
      className: "task-app-container",
      onMouseDown: b.selectionStartHandler,
      onMouseMove: b.selectionMoveHandler,
      onMouseUp: b.selectionEndHandler,
      onMouseLeave: b.selectionEndHandler,
      onClick: (p) => {
        try {
          const B = p.target;
          if (!B.closest || !B.closest(".task-app__item")) {
            if (b.selectionJustEndedAt && Date.now() - b.selectionJustEndedAt < 300)
              return;
            b.clearSelection();
          }
        } catch {
        }
      },
      children: /* @__PURE__ */ O("div", { className: "task-app", children: [
        /* @__PURE__ */ O("div", { className: "task-app__header-container", children: [
          /* @__PURE__ */ T("h1", { className: "task-app__header", children: "Tasks" }),
          /* @__PURE__ */ O("div", { className: "theme-picker", children: [
            /* @__PURE__ */ T(
              "button",
              {
                className: "theme-toggle-btn",
                onClick: () => Z(!J),
                "aria-label": "Choose theme",
                title: "Choose theme",
                children: yt(U)
              }
            ),
            J && /* @__PURE__ */ T("div", { className: "theme-picker__dropdown", children: Ce.map(({ name: p, emoji: B, label: $ }) => /* @__PURE__ */ T(
              "button",
              {
                className: `theme-picker__option ${U === p ? "active" : ""}`,
                onClick: () => {
                  Y(p), Z(!1);
                },
                title: $,
                children: B
              },
              p
            )) })
          ] })
        ] }),
        /* @__PURE__ */ O("div", { className: "task-app__boards", children: [
          /* @__PURE__ */ T("div", { className: "task-app__board-list", children: (H && H.boards ? H.boards.slice(0, De) : [{ id: "main", name: "main", tasks: [], tags: [] }]).map((p) => /* @__PURE__ */ T(
            pt,
            {
              board: p,
              isActive: ne === p.id,
              isDragOver: b.dragOverFilter === `board:${p.id}`,
              onSwitch: _e,
              onContextMenu: (B, $, L) => ee({ boardId: B, x: $, y: L }),
              onDragOverFilter: b.setDragOverFilter,
              onMoveTasksToBoard: Te,
              onClearSelection: b.clearSelection
            },
            p.id
          )) }),
          /* @__PURE__ */ O("div", { className: "task-app__board-actions", children: [
            (!H || H.boards && H.boards.length < De) && /* @__PURE__ */ T(
              "button",
              {
                className: `board-add-btn ${b.dragOverFilter === "add-board" ? "board-btn--drag-over" : ""}`,
                onClick: () => {
                  I(""), M(null), k(!0);
                },
                onDragOver: (p) => {
                  p.preventDefault(), p.dataTransfer.dropEffect = "move", b.setDragOverFilter("add-board");
                },
                onDragLeave: (p) => {
                  b.setDragOverFilter(null);
                },
                onDrop: async (p) => {
                  p.preventDefault(), b.setDragOverFilter(null);
                  const B = me(p.dataTransfer);
                  B.length > 0 && (I(""), E({ type: "move-to-board", taskIds: B }), k(!0));
                },
                "aria-label": "Create board",
                children: "＋"
              }
            ),
            e !== "public" && /* @__PURE__ */ T(
              "button",
              {
                className: "sync-btn",
                onClick: async (p) => {
                  console.log("[App] Manual refresh triggered"), await y(), p.currentTarget.blur();
                },
                title: "Sync from server",
                "aria-label": "Sync from server",
                children: /* @__PURE__ */ O("svg", { width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [
                  /* @__PURE__ */ T("polyline", { points: "23 4 23 10 17 10" }),
                  /* @__PURE__ */ T("polyline", { points: "1 20 1 14 7 14" }),
                  /* @__PURE__ */ T("path", { d: "M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" })
                ] })
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ T("div", { className: "task-app__controls", children: /* @__PURE__ */ T(
          "input",
          {
            ref: m,
            className: "task-app__input",
            placeholder: n,
            onKeyDown: (p) => {
              p.key === "Enter" && !p.shiftKey && (p.preventDefault(), $e(p.target.value)), p.key === "k" && (p.ctrlKey || p.metaKey) && (p.preventDefault(), m.current?.focus());
            }
          }
        ) }),
        /* @__PURE__ */ O("div", { className: "task-app__filters", children: [
          (() => {
            const p = de(d);
            return Array.from(/* @__PURE__ */ new Set([...Pe, ...p])).map(($) => /* @__PURE__ */ T(
              mt,
              {
                tag: $,
                isActive: r.has($),
                isDragOver: b.dragOverFilter === $,
                onToggle: (L) => {
                  c((re) => {
                    const te = new Set(re);
                    return te.has(L) ? te.delete(L) : te.add(L), te;
                  });
                },
                onContextMenu: (L, re, te) => Q({ tag: L, x: re, y: te }),
                onDragOver: b.onFilterDragOver,
                onDragLeave: b.onFilterDragLeave,
                onDrop: b.onFilterDrop
              },
              $
            ));
          })(),
          /* @__PURE__ */ T(
            "button",
            {
              className: `task-app__filter-add ${b.dragOverFilter === "add-tag" ? "task-app__filter-drag-over" : ""}`,
              onClick: () => {
                I(""), v(!0);
              },
              onDragOver: (p) => {
                p.preventDefault(), p.dataTransfer.dropEffect = "copy", b.onFilterDragOver(p, "add-tag");
              },
              onDragLeave: b.onFilterDragLeave,
              onDrop: async (p) => {
                p.preventDefault(), b.onFilterDragLeave(p);
                const B = me(p.dataTransfer);
                B.length > 0 && (I(""), E({ type: "apply-tag", taskIds: B }), v(!0));
              },
              "aria-label": "Add tag",
              children: "＋"
            }
          )
        ] }),
        /* @__PURE__ */ T(
          kt,
          {
            tasks: d,
            topTags: Le,
            isMobile: s,
            filters: Array.from(r),
            selectedIds: b.selectedIds,
            onSelectionStart: b.selectionStartHandler,
            onSelectionMove: b.selectionMoveHandler,
            onSelectionEnd: b.selectionEndHandler,
            sortDirections: ae.sortDirections,
            dragOverTag: b.dragOverTag,
            pendingOperations: h,
            onComplete: w,
            onDelete: f,
            onAddTag: C,
            onDragStart: b.onDragStart,
            onDragEnd: b.onDragEnd,
            onDragOver: b.onDragOver,
            onDragLeave: b.onDragLeave,
            onDrop: b.onDrop,
            toggleSort: ae.toggleSort,
            sortTasksByAge: ae.sortTasksByAge,
            getSortIcon: ae.getSortIcon,
            getSortTitle: ae.getSortTitle,
            clearTasksByTag: Fe,
            clearRemainingTasks: X,
            onDeletePersistedTag: Ne
          }
        ),
        b.isSelecting && b.marqueeRect && /* @__PURE__ */ T(
          "div",
          {
            className: "marquee-overlay",
            style: {
              left: `${b.marqueeRect.x}px`,
              top: `${b.marqueeRect.y}px`,
              width: `${b.marqueeRect.w}px`,
              height: `${b.marqueeRect.h}px`
            }
          }
        ),
        /* @__PURE__ */ T(
          ge,
          {
            isOpen: !!u,
            title: `Clear Tag #${u?.tag}?`,
            onClose: () => g(null),
            onConfirm: async () => {
              if (!u) return;
              const p = u.tag;
              g(null), await W(p);
            },
            confirmLabel: "Clear Tag",
            confirmDanger: !0,
            children: u && /* @__PURE__ */ O("p", { children: [
              "This will remove ",
              /* @__PURE__ */ O("strong", { children: [
                "#",
                u.tag
              ] }),
              " from",
              " ",
              /* @__PURE__ */ O("strong", { children: [
                u.count,
                " task(s)"
              ] }),
              " and delete the tag from the board."
            ] })
          }
        ),
        /* @__PURE__ */ O(
          ge,
          {
            isOpen: l,
            title: "Create New Board",
            onClose: () => {
              k(!1), E(null), M(null);
            },
            onConfirm: async () => {
              if (!_.trim()) return;
              const p = le(_);
              if (p) {
                M(p);
                return;
              }
              k(!1), await Me(_);
            },
            inputValue: _,
            onInputChange: (p) => {
              I(p), M(null);
            },
            inputPlaceholder: "Board name",
            confirmLabel: "Create",
            confirmDisabled: !_.trim() || le(_) !== null,
            children: [
              x?.type === "move-to-board" && x.taskIds.length > 0 && /* @__PURE__ */ O("p", { className: "modal-hint", children: [
                x.taskIds.length,
                " task",
                x.taskIds.length > 1 ? "s" : "",
                " will be moved to this board"
              ] }),
              q && /* @__PURE__ */ T("p", { className: "modal-error", style: { color: "var(--error-color, #d32f2f)", marginTop: "0.5rem" }, children: q })
            ]
          }
        ),
        /* @__PURE__ */ O(
          ge,
          {
            isOpen: A,
            title: "Create New Tag",
            onClose: () => {
              v(!1), E(null);
            },
            onConfirm: async () => {
              if (_.trim()) {
                v(!1);
                try {
                  await Ee(_);
                } catch (p) {
                  console.error("[App] Failed to create tag:", p);
                }
              }
            },
            inputValue: _,
            onInputChange: I,
            inputPlaceholder: "Enter new tag name",
            confirmLabel: "Create",
            confirmDisabled: !_.trim(),
            children: [
              x?.type === "apply-tag" && x.taskIds.length > 0 && /* @__PURE__ */ O("p", { className: "modal-hint", children: [
                "This tag will be applied to ",
                x.taskIds.length,
                " task",
                x.taskIds.length > 1 ? "s" : ""
              ] }),
              de(d).length > 0 && /* @__PURE__ */ O("div", { className: "modal-section", children: [
                /* @__PURE__ */ T("label", { className: "modal-label", children: "Existing tags:" }),
                /* @__PURE__ */ T("div", { className: "modal-tags-list", children: de(d).map((p) => /* @__PURE__ */ O("span", { className: "modal-tag-chip", children: [
                  "#",
                  p
                ] }, p)) })
              ] })
            ]
          }
        ),
        /* @__PURE__ */ T(
          be,
          {
            isOpen: !!j,
            x: j?.x || 0,
            y: j?.y || 0,
            items: [
              {
                label: "🗑️ Delete Board",
                isDanger: !0,
                onClick: async () => {
                  if (!j) return;
                  const p = H?.boards?.find((B) => B.id === j.boardId)?.name || j.boardId;
                  if (confirm(`Delete board "${p}"? All tasks on this board will be permanently deleted.`))
                    try {
                      await xe(j.boardId), ee(null);
                    } catch (B) {
                      console.error("[App] Failed to delete board:", B), alert(B.message || "Failed to delete board");
                    }
                }
              }
            ]
          }
        ),
        /* @__PURE__ */ T(
          be,
          {
            isOpen: !!P,
            x: P?.x || 0,
            y: P?.y || 0,
            className: "tag-context-menu",
            items: [
              {
                label: "🗑️ Delete Tag",
                isDanger: !0,
                onClick: async () => {
                  if (console.log("[App] Delete Tag clicked!", { tagContextMenu: P }), !P) {
                    console.error("[App] No tagContextMenu when Delete Tag clicked!");
                    return;
                  }
                  try {
                    console.log("[App] Calling clearTasksByTag for tag:", P.tag), await W(P.tag), console.log("[App] clearTasksByTag completed successfully"), Q(null);
                  } catch (p) {
                    console.error("[App] Failed to delete tag:", p), alert(p.message || "Failed to delete tag");
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
function Dt(t, e = {}) {
  const a = new URLSearchParams(window.location.search), o = e.userType || a.get("userType") || "public", s = e.userId || a.get("userId") || "public", n = e.sessionId, r = { ...e, userType: o, userId: s, sessionId: n }, c = Je(t);
  c.render(/* @__PURE__ */ T(wt, { ...r })), t.__root = c, console.log("[task-app] Mounted successfully", r);
}
function At(t) {
  t.__root?.unmount();
}
export {
  Dt as mount,
  At as unmount
};
