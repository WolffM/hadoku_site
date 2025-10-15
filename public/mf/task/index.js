import { jsx as h, jsxs as C, Fragment as Pe } from "react/jsx-runtime";
import { createRoot as Ie } from "react-dom/client";
import { useState as O, useMemo as Re, useEffect as ee, useRef as re } from "react";
const P = `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
class Ue {
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
function Je() {
  const t = Date.now().toString(36).toUpperCase().padStart(8, "0"), e = crypto.getRandomValues(new Uint8Array(18)), a = Array.from(e).map((o) => (o % 36).toString(36).toUpperCase()).join("");
  return t + a;
}
function V() {
  return (/* @__PURE__ */ new Date()).toISOString();
}
function me(t, e) {
  const a = t.tasks.findIndex((o) => o.id === e);
  if (a < 0)
    throw new Error("Task not found");
  return { task: t.tasks[a], index: a };
}
function ce(t, e) {
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
function je(t, e, a) {
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
function Ke(t, e, a) {
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
function Te(t, e, a) {
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
function He(t, e, a) {
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
async function Xe(t, e) {
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
async function qe(t, e, a, o = "main") {
  const s = V(), n = await t.getTasks(e.userType, e.userId, o), r = await t.getStats(e.userType, e.userId, o), c = a.id || Je(), g = a.createdAt || s, f = {
    id: c,
    title: a.title,
    tag: a.tag ?? null,
    state: "Active",
    createdAt: g
  }, l = {
    ...n,
    tasks: [f, ...n.tasks],
    updatedAt: s
  }, k = je(r, f, s);
  return await t.saveTasks(e.userType, e.userId, o, l), await t.saveStats(e.userType, e.userId, o, k), { ok: !0, id: c };
}
async function Ye(t, e, a, o, s = "main") {
  const n = V(), r = await t.getTasks(e.userType, e.userId, s), c = await t.getStats(e.userType, e.userId, s), { task: g, index: f } = me(r, a), l = {
    ...g,
    ...o,
    updatedAt: n
  }, k = [...r.tasks];
  k[f] = l;
  const A = {
    ...r,
    tasks: k,
    updatedAt: n
  }, v = Te(c, l, n);
  return await t.saveTasks(e.userType, e.userId, s, A), await t.saveStats(e.userType, e.userId, s, v), { ok: !0, message: `Task ${a} updated` };
}
async function ze(t, e, a, o = "main") {
  const s = V(), n = await t.getTasks(e.userType, e.userId, o), r = await t.getStats(e.userType, e.userId, o), { task: c, index: g } = me(n, a), f = {
    ...c,
    state: "Completed",
    closedAt: s,
    updatedAt: s
  }, l = [...n.tasks];
  l.splice(g, 1);
  const k = {
    ...n,
    tasks: l,
    updatedAt: s
  }, A = Ke(r, f, s);
  return await t.saveTasks(e.userType, e.userId, o, k), await t.saveStats(e.userType, e.userId, o, A), { ok: !0, message: `Task ${a} completed` };
}
async function Ve(t, e, a, o = "main") {
  const s = V(), n = await t.getTasks(e.userType, e.userId, o), r = await t.getStats(e.userType, e.userId, o), { task: c, index: g } = me(n, a), f = {
    ...c,
    state: "Deleted",
    closedAt: s,
    updatedAt: s
  }, l = [...n.tasks];
  l.splice(g, 1);
  const k = {
    ...n,
    tasks: l,
    updatedAt: s
  }, A = He(r, f, s);
  return await t.saveTasks(e.userType, e.userId, o, k), await t.saveStats(e.userType, e.userId, o, A), { ok: !0, message: `Task ${a} deleted` };
}
async function We(t, e, a) {
  const o = V(), s = await t.getBoards(e.userType, e.userId);
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
async function Ge(t, e, a) {
  if (a === "main")
    throw new Error("Cannot delete the main board");
  const o = V(), s = await t.getBoards(e.userType, e.userId);
  ce(s, a);
  const n = {
    ...s,
    updatedAt: o,
    boards: s.boards.filter((r) => r.id !== a)
  };
  return await t.saveBoards(e.userType, n, e.userId), { ok: !0, message: `Board ${a} deleted` };
}
async function Qe(t, e, a) {
  const o = V(), s = await t.getBoards(e.userType, e.userId), { board: n, index: r } = ce(s, a.boardId), c = n.tags || [];
  if (c.includes(a.tag))
    return { ok: !0, message: `Tag ${a.tag} already exists` };
  const g = {
    ...n,
    tags: [...c, a.tag]
  }, f = ke(s, r, g, o);
  return await t.saveBoards(e.userType, f, e.userId), { ok: !0, message: `Tag ${a.tag} added to board ${a.boardId}` };
}
async function Ze(t, e, a) {
  const o = V(), s = await t.getBoards(e.userType, e.userId), { board: n, index: r } = ce(s, a.boardId), c = n.tags || [], g = {
    ...n,
    tags: c.filter((l) => l !== a.tag)
  }, f = ke(s, r, g, o);
  return await t.saveBoards(e.userType, f, e.userId), { ok: !0, message: `Tag ${a.tag} removed from board ${a.boardId}` };
}
async function et(t, e, a) {
  const o = V(), s = await t.getTasks(e.userType, e.userId, a.boardId), n = await t.getStats(e.userType, e.userId, a.boardId);
  let r = 0;
  const c = s.tasks.map((l) => {
    const k = a.updates.find((A) => A.taskId === l.id);
    return k ? (r++, {
      ...l,
      tag: k.tag || void 0,
      updatedAt: o
    }) : l;
  }), g = {
    ...s,
    tasks: c,
    updatedAt: o
  };
  let f = n;
  for (const l of c)
    a.updates.find((k) => k.taskId === l.id) && (f = Te(f, l, o));
  return await t.saveTasks(e.userType, e.userId, a.boardId, g), await t.saveStats(e.userType, e.userId, a.boardId, f), {
    ok: !0,
    message: `Updated ${r} task(s) on board ${a.boardId}`,
    updated: r
  };
}
async function tt(t, e, a) {
  const o = V(), s = await t.getTasks(e.userType, e.userId, a.boardId), n = await t.getStats(e.userType, e.userId, a.boardId), r = await t.getBoards(e.userType, e.userId);
  let c = 0;
  const g = s.tasks.map(($) => {
    if (a.taskIds.includes($.id) && $.tag) {
      const M = $.tag.split(" ").filter(Boolean).filter((K) => K !== a.tag);
      return c++, {
        ...$,
        tag: M.length > 0 ? M.join(" ") : void 0,
        updatedAt: o
      };
    }
    return $;
  }), f = {
    ...s,
    tasks: g,
    updatedAt: o
  };
  let l = n;
  for (const $ of g)
    a.taskIds.includes($.id) && (l = Te(l, $, o));
  const { board: k, index: A } = ce(r, a.boardId), v = k.tags || [], _ = {
    ...k,
    tags: v.filter(($) => $ !== a.tag)
  }, F = ke(r, A, _, o);
  return await t.saveTasks(e.userType, e.userId, a.boardId, f), await t.saveStats(e.userType, e.userId, a.boardId, l), await t.saveBoards(e.userType, F, e.userId), {
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
function at(t = "public", e = "public") {
  const a = new Ue(t, e), o = { userType: "registered", userId: e };
  return {
    async getBoards() {
      const s = await Xe(a, o), n = {
        version: s.version,
        updatedAt: s.updatedAt,
        boards: []
      };
      for (const r of s.boards) {
        const c = await a.getTasks(t, e, r.id), g = await a.getStats(t, e, r.id);
        n.boards.push({
          id: r.id,
          name: r.name,
          tasks: c.tasks,
          stats: g,
          tags: r.tags || []
        });
      }
      return n;
    },
    async createBoard(s) {
      console.debug("[localStorageApi] createBoard (using handler)", { userType: t, userId: e, boardId: s });
      const n = await We(
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
      }), z("boards-updated", { sessionId: P, userType: t, userId: e }), n.board;
    },
    async deleteBoard(s) {
      await Ge(
        a,
        o,
        s
      ), await a.deleteBoardData(t, e, s), z("boards-updated", { sessionId: P, userType: t, userId: e });
    },
    async getTasks(s = "main") {
      return a.getTasks(t, e, s);
    },
    async getStats(s = "main") {
      return a.getStats(t, e, s);
    },
    async createTask(s, n = "main", r = !1) {
      console.log("[localStorageApi] createTask (using handler)", { data: s, boardId: n, suppressBroadcast: r });
      const c = await qe(
        a,
        o,
        s,
        n
      ), f = (await a.getTasks(t, e, n)).tasks.find((l) => l.id === c.id);
      if (!f)
        throw new Error("Task creation failed - task not found after creation");
      return r ? console.log("[localStorageApi] createTask: broadcast suppressed") : (console.log("[localStorageApi] createTask: broadcasting", {
        sessionId: P,
        boardId: n,
        taskId: c.id
      }), z("tasks-updated", { sessionId: P, userType: t, userId: e, boardId: n })), f;
    },
    async patchTask(s, n, r = "main", c = !1) {
      const g = {};
      n.title !== void 0 && (g.title = n.title), n.tag !== void 0 && n.tag !== null && (g.tag = n.tag), await Ye(
        a,
        o,
        s,
        g,
        r
      ), c || z("tasks-updated", { sessionId: P, userType: t, userId: e, boardId: r });
      const l = (await a.getTasks(t, e, r)).tasks.find((k) => k.id === s);
      if (!l)
        throw new Error("Task not found after update");
      return l;
    },
    async completeTask(s, n = "main") {
      const c = (await a.getTasks(t, e, n)).tasks.find((g) => g.id === s);
      if (!c)
        throw new Error("Task not found");
      return await ze(
        a,
        o,
        s,
        n
      ), z("tasks-updated", { sessionId: P, userType: t, userId: e, boardId: n }), {
        ...c,
        state: "Completed",
        closedAt: (/* @__PURE__ */ new Date()).toISOString(),
        updatedAt: (/* @__PURE__ */ new Date()).toISOString()
      };
    },
    async deleteTask(s, n = "main", r = !1) {
      console.log("[localStorageApi] deleteTask (using handler)", { id: s, boardId: n, suppressBroadcast: r });
      const g = (await a.getTasks(t, e, n)).tasks.find((f) => f.id === s);
      if (!g)
        throw new Error("Task not found");
      return await Ve(
        a,
        o,
        s,
        n
      ), r ? console.log("[localStorageApi] deleteTask: broadcast suppressed") : (console.log("[localStorageApi] deleteTask: broadcasting", { sessionId: P }), z("tasks-updated", { sessionId: P, userType: t, userId: e, boardId: n })), {
        ...g,
        state: "Deleted",
        closedAt: (/* @__PURE__ */ new Date()).toISOString(),
        updatedAt: (/* @__PURE__ */ new Date()).toISOString()
      };
    },
    async createTag(s, n = "main") {
      await Qe(
        a,
        o,
        { boardId: n, tag: s }
      ), z("boards-updated", { sessionId: P, userType: t, userId: e, boardId: n });
    },
    async deleteTag(s, n = "main") {
      await Ze(
        a,
        o,
        { boardId: n, tag: s }
      ), z("boards-updated", { sessionId: P, userType: t, userId: e, boardId: n });
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
      const c = await this.getBoards(), g = c.boards.find((_) => _.id === s), f = c.boards.find((_) => _.id === n);
      if (!g)
        throw new Error(`Source board ${s} not found`);
      if (!f)
        throw new Error(`Target board ${n} not found`);
      const l = g.tasks.filter((_) => r.includes(_.id));
      g.tasks = g.tasks.filter((_) => !r.includes(_.id)), f.tasks = [...f.tasks, ...l], c.updatedAt = (/* @__PURE__ */ new Date()).toISOString();
      const k = `${t}-${e}-boards`;
      localStorage.setItem(k, JSON.stringify(c));
      const A = `${t}-${e}-${s}-tasks`, v = `${t}-${e}-${n}-tasks`;
      return localStorage.setItem(A, JSON.stringify({
        version: 1,
        updatedAt: c.updatedAt,
        tasks: g.tasks
      })), localStorage.setItem(v, JSON.stringify({
        version: 1,
        updatedAt: c.updatedAt,
        tasks: f.tasks
      })), z("boards-updated", { sessionId: P, userType: t, userId: e }), { ok: !0, moved: l.length };
    },
    async batchUpdateTags(s, n) {
      console.log("[localStorageApi] batchUpdateTags", { boardId: s, updates: n }), await et(
        a,
        o,
        { boardId: s, updates: n }
      ), z("tasks-updated", { sessionId: P, userType: t, userId: e, boardId: s });
    },
    async batchClearTag(s, n, r) {
      console.log("[localStorageApi] batchClearTag", { boardId: s, tag: n, taskIds: r }), await tt(
        a,
        o,
        { boardId: s, tag: n, taskIds: r }
      ), z("boards-updated", { sessionId: P, userType: t, userId: e, boardId: s });
    }
  };
}
async function st(t, e, a, o) {
  for (const r of e.boards || []) {
    const c = r.id;
    if (r.tasks && r.tasks.length > 0) {
      const g = `${a}-${o}-${c}-tasks`, f = {
        version: 1,
        updatedAt: e.updatedAt || (/* @__PURE__ */ new Date()).toISOString(),
        tasks: r.tasks
      };
      window.localStorage.setItem(g, JSON.stringify(f));
    }
    if (r.stats) {
      const g = `${a}-${o}-${c}-stats`;
      window.localStorage.setItem(g, JSON.stringify(r.stats));
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
function j(t, e, a) {
  const o = {
    "Content-Type": "application/json",
    "X-User-Type": t
  };
  return e && (o["X-User-Id"] = e), a && (o["X-Session-Id"] = a), o;
}
function pe(t = "public", e = "public", a) {
  const o = at(t, e);
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
          headers: j(t, e, a)
        });
        if (!s.ok)
          throw new Error(`API returned ${s.status}`);
        const n = await s.json();
        if (!n || !n.boards || !Array.isArray(n.boards)) {
          console.error("[api] Invalid response structure:", n);
          return;
        }
        console.log("[api] Synced from API:", { boards: n.boards.length, totalTasks: n.boards.reduce((r, c) => r + (c.tasks?.length || 0), 0) }), await st(o, n, t, e);
      } catch (s) {
        console.error("[api] Sync from API failed:", s);
      }
    },
    async createTask(s, n = "main", r = !1) {
      const c = await o.createTask(s, n, r);
      return fetch("/task/api", {
        method: "POST",
        headers: j(t, e, a),
        body: JSON.stringify({
          id: s.id || c.id,
          // Use provided ID (for moves) or client-generated ID
          ...s,
          boardId: n
        })
      }).then((g) => g.json()).then((g) => {
        g.ok && (g.id === c.id ? console.log("[api] Background sync: createTask completed (ID matched)") : console.warn("[api] Server returned different ID (unexpected):", { client: c.id, server: g.id }));
      }).catch((g) => console.error("[api] Failed to sync createTask:", g)), c;
    },
    async createTag(s, n = "main") {
      const r = await o.createTag(s, n);
      return fetch("/task/api/tags", {
        method: "POST",
        headers: j(t, e, a),
        body: JSON.stringify({ boardId: n, tag: s })
      }).then(() => console.log("[api] Background sync: createTag completed")).catch((c) => console.error("[api] Failed to sync createTag:", c)), r;
    },
    async deleteTag(s, n = "main") {
      const r = await o.deleteTag(s, n);
      return fetch("/task/api/tags", {
        method: "DELETE",
        headers: j(t, e, a),
        body: JSON.stringify({ boardId: n, tag: s })
      }).then(() => console.log("[api] Background sync: deleteTag completed")).catch((c) => console.error("[api] Failed to sync deleteTag:", c)), r;
    },
    async patchTask(s, n, r = "main", c = !1) {
      const g = await o.patchTask(s, n, r, c);
      return fetch(`/task/api/${s}`, {
        method: "PATCH",
        headers: j(t, e, a),
        body: JSON.stringify({ ...n, boardId: r })
      }).then(() => console.log("[api] Background sync: patchTask completed")).catch((f) => console.error("[api] Failed to sync patchTask:", f)), g;
    },
    async completeTask(s, n = "main") {
      const r = await o.completeTask(s, n);
      return fetch(`/task/api/${s}/complete`, {
        method: "POST",
        headers: j(t, e, a),
        body: JSON.stringify({ boardId: n })
      }).then(() => console.log("[api] Background sync: completeTask completed")).catch((c) => console.error("[api] Failed to sync completeTask:", c)), r;
    },
    async deleteTask(s, n = "main", r = !1) {
      await o.deleteTask(s, n, r), fetch(`/task/api/${s}`, {
        method: "DELETE",
        headers: j(t, e, a),
        body: JSON.stringify({ boardId: n })
      }).then(() => console.log("[api] Background sync: deleteTask completed")).catch((c) => console.error("[api] Failed to sync deleteTask:", c));
    },
    // Board operations
    async createBoard(s) {
      const n = await o.createBoard(s);
      return fetch("/task/api/boards", {
        method: "POST",
        headers: j(t, e, a),
        body: JSON.stringify({ id: s, name: s })
      }).then(() => console.log("[api] Background sync: createBoard completed")).catch((r) => console.error("[api] Failed to sync createBoard:", r)), n;
    },
    async deleteBoard(s) {
      const n = await o.deleteBoard(s);
      return fetch(`/task/api/boards/${encodeURIComponent(s)}`, {
        method: "DELETE",
        headers: j(t, e, a)
      }).then(() => console.log("[api] Background sync: deleteBoard completed")).catch((r) => console.error("[api] Failed to sync deleteBoard:", r)), n;
    },
    // User preferences
    async getPreferences() {
      return await o.getPreferences();
    },
    async savePreferences(s) {
      await o.savePreferences(s), fetch("/task/api/preferences", {
        method: "PUT",
        headers: j(t, e, a),
        body: JSON.stringify(s)
      }).then(() => console.log("[api] Background sync: savePreferences completed")).catch((n) => console.error("[api] Failed to sync savePreferences:", n));
    },
    // Batch operations
    async batchUpdateTags(s, n) {
      await o.batchUpdateTags(s, n), fetch("/task/api/batch-tag", {
        method: "PATCH",
        headers: j(t, e, a),
        body: JSON.stringify({ boardId: s, updates: n })
      }).then(() => console.log("[api] Background sync: batchUpdateTags completed")).catch((r) => console.error("[api] Failed to sync batchUpdateTags:", r));
    },
    async batchMoveTasks(s, n, r) {
      const c = await o.batchMoveTasks(s, n, r);
      return fetch("/task/api/batch-move", {
        method: "POST",
        headers: j(t, e, a),
        body: JSON.stringify({ sourceBoardId: s, targetBoardId: n, taskIds: r })
      }).then(() => console.log("[api] Background sync: batchMoveTasks completed")).catch((g) => console.error("[api] Failed to sync batchMoveTasks:", g)), c;
    },
    async batchClearTag(s, n, r) {
      await o.batchClearTag(s, n, r), fetch("/task/api/batch-clear-tag", {
        method: "POST",
        headers: j(t, e, a),
        body: JSON.stringify({ boardId: s, tag: n, taskIds: r })
      }).then(() => console.log("[api] Background sync: batchClearTag completed")).catch((c) => console.error("[api] Failed to sync batchClearTag:", c));
    }
  };
}
function nt(t) {
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
function ot(t, e = 6, a = []) {
  const o = t.flatMap((n) => n.tag?.split(" ") || []).filter(Boolean), s = {};
  return o.forEach((n) => s[n] = (s[n] || 0) + 1), a.filter(Boolean).forEach((n) => {
    s[n] || (s[n] = 0);
  }), Object.entries(s).sort((n, r) => r[1] - n[1]).slice(0, e).map(([n]) => n);
}
function we(t, e) {
  return t.filter((a) => a.tag?.split(" ").includes(e));
}
function rt(t, e, a) {
  const o = Array.isArray(a) && a.length > 0;
  return t.filter((s) => {
    const n = s.tag?.split(" ") || [];
    return o ? a.some((c) => n.includes(c)) && !e.some((c) => n.includes(c)) : !e.some((r) => n.includes(r));
  });
}
function le(t) {
  return Array.from(new Set(t.flatMap((e) => e.tag?.split(" ") || []).filter(Boolean)));
}
function ct(t, e, a, o = 50) {
  setTimeout(() => {
    try {
      const s = new BroadcastChannel("tasks");
      s.postMessage({ type: "tasks-updated", sessionId: t, userType: e, userId: a }), s.close();
    } catch (s) {
      console.error("[useTasks] Broadcast failed:", s);
    }
  }, o);
}
async function ve(t, e, a, o, s = {}) {
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
      const g = new Set(c);
      return g.delete(t), g;
    });
  }
}
async function de(t, e, a) {
  await t(), console.log("[withBulkOperation] Broadcasting bulk update with delay"), ct(P, e, a);
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
function it({ userType: t, userId: e, sessionId: a }) {
  const [o, s] = O([]), [n, r] = O(/* @__PURE__ */ new Set()), c = Re(
    () => pe(t, e || "public", a),
    [t, e, a]
  ), [g, f] = O(null), [l, k] = O("main");
  async function A() {
    console.log("[useTasks] initialLoad called"), "syncFromApi" in c && await c.syncFromApi(), await v();
  }
  async function v() {
    console.log("[useTasks] reload called", { currentBoardId: l, stack: new Error().stack?.split(`
`).slice(1, 4).join(`
`) });
    const p = await c.getBoards();
    f(p);
    const { tasks: i } = se(p, l);
    s(i);
  }
  ee(() => {
    console.log("[useTasks] User context changed, clearing state and reloading", { userType: t, userId: e }), s([]), r(/* @__PURE__ */ new Set()), f(null), k("main"), v();
  }, [t, e]), ee(() => {
    console.log("[useTasks] Setting up BroadcastChannel listener", { currentBoardId: l, userType: t, userId: e });
    try {
      const p = new BroadcastChannel("tasks");
      return p.onmessage = (i) => {
        const d = i.data || {};
        if (console.log("[useTasks] BroadcastChannel message received", { msg: d, sessionId: P, currentBoardId: l, currentContext: { userType: t, userId: e } }), d.sessionId === P) {
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
        console.log("[useTasks] Cleaning up BroadcastChannel listener", { currentBoardId: l }), p.close();
      };
    } catch (p) {
      console.error("[useTasks] Failed to setup BroadcastChannel", p);
    }
  }, [l, t, e]);
  async function _(p) {
    if (p = p.trim(), !!p)
      try {
        const i = nt(p);
        return await c.createTask(i, l), await v(), !0;
      } catch (i) {
        return alert(i.message || "Failed to create task"), !1;
      }
  }
  async function F(p) {
    await ve(
      `complete-${p}`,
      n,
      r,
      async () => {
        await c.completeTask(p, l), await v();
      },
      {
        onError: (i) => alert(i.message || "Failed to complete task")
      }
    );
  }
  async function $(p) {
    console.log("[useTasks] deleteTask START", { taskId: p, currentBoardId: l }), await ve(
      `delete-${p}`,
      n,
      r,
      async () => {
        console.log("[useTasks] deleteTask: calling api.deleteTask", { taskId: p, currentBoardId: l }), await c.deleteTask(p, l), console.log("[useTasks] deleteTask: calling reload"), await v(), console.log("[useTasks] deleteTask END");
      },
      {
        onError: (i) => alert(i.message || "Failed to delete task")
      }
    );
  }
  async function I(p) {
    const i = prompt("Enter tag (without #):");
    if (!i) return;
    const d = i.trim().replace(/^#+/, "").replace(/\s+/g, "-"), T = o.find((u) => u.id === p);
    if (!T) return;
    const y = T.tag?.split(" ") || [];
    if (y.includes(d)) return;
    const w = [...y, d].join(" ");
    try {
      await c.patchTask(p, { tag: w }, l), await v();
    } catch (u) {
      alert(u.message || "Failed to add tag");
    }
  }
  async function M(p, i, d = {}) {
    const { suppressBroadcast: T = !1, skipReload: y = !1 } = d;
    try {
      await c.patchTask(p, i, l, T), y || await v();
    } catch (w) {
      throw w;
    }
  }
  async function K(p) {
    console.log("[useTasks] bulkUpdateTaskTags START", { count: p.length });
    try {
      "batchUpdateTags" in c ? await c.batchUpdateTags(
        l,
        p.map((i) => ({ taskId: i.taskId, tag: i.tag || null }))
      ) : await de(async () => {
        for (const { taskId: i, tag: d } of p)
          await c.patchTask(i, { tag: d }, l, !0);
      }, t, e), console.log("[useTasks] bulkUpdateTaskTags: calling reload"), await v(), console.log("[useTasks] bulkUpdateTaskTags END");
    } catch (i) {
      throw console.error("[useTasks] bulkUpdateTaskTags ERROR", i), i;
    }
  }
  async function H(p) {
    console.log("[useTasks] clearTasksByTag START", { tag: p, currentBoardId: l, taskCount: o.length });
    const i = o.filter((d) => d.tag?.split(" ").includes(p));
    if (console.log("[useTasks] clearTasksByTag: found tasks with tag", { tag: p, count: i.length }), i.length === 0) {
      console.log("[useTasks] clearTasksByTag: no tasks found with this tag, just deleting tag");
      try {
        await c.deleteTag(p, l), await v(), console.log("[useTasks] clearTasksByTag END (no tasks to clear)");
      } catch (d) {
        console.error("[useTasks] clearTasksByTag ERROR", d), console.error("[useTasks] clearTasksByTag: Please fix this error:", d.message);
      }
      return;
    }
    console.log("[useTasks] clearTasksByTag: proceeding without confirmation (dialogs blocked)", { taskCount: i.length });
    try {
      console.log("[useTasks] clearTasksByTag: starting batch clear"), "batchClearTag" in c ? await c.batchClearTag(
        l,
        p,
        i.map((d) => d.id)
      ) : await de(async () => {
        for (const d of i) {
          const T = d.tag?.split(" ") || [], y = T.filter((u) => u !== p), w = y.length > 0 ? y.join(" ") : null;
          console.log("[useTasks] clearTasksByTag: patching task", { taskId: d.id, oldTags: T, newTags: y }), await c.patchTask(d.id, { tag: w }, l, !0);
        }
        console.log("[useTasks] clearTasksByTag: deleting tag from board", { tag: p, currentBoardId: l }), await c.deleteTag(p, l);
      }, t, e), console.log("[useTasks] clearTasksByTag: calling reload"), await v(), console.log("[useTasks] clearTasksByTag END");
    } catch (d) {
      console.error("[useTasks] clearTasksByTag ERROR", d), alert(d.message || "Failed to remove tag from tasks");
    }
  }
  async function q(p) {
    if (confirm("Clear all remaining tasks?"))
      try {
        for (const i of p)
          await c.deleteTask(i.id, l);
        await v();
      } catch (i) {
        alert(i.message || "Failed to clear remaining tasks");
      }
  }
  async function E(p) {
    await c.createBoard(p), k(p);
    const i = await c.getBoards();
    f(i);
    const { tasks: d } = se(i, p);
    s(d);
  }
  async function Q(p, i) {
    if (console.log("[useTasks] moveTasksToBoard START", { targetBoardId: p, ids: i, currentBoardId: l }), !g) return;
    const d = /* @__PURE__ */ new Set();
    for (const T of g.boards)
      for (const y of T.tasks || [])
        i.includes(y.id) && d.add(T.id);
    console.log("[useTasks] moveTasksToBoard: source boards", { sourceBoardIds: Array.from(d) });
    try {
      if ("batchMoveTasks" in c && d.size === 1) {
        const w = Array.from(d)[0];
        console.log("[useTasks] moveTasksToBoard: using batch API"), await c.batchMoveTasks(w, p, i);
      } else {
        const w = [];
        for (const u of g.boards)
          for (const D of u.tasks || [])
            i.includes(D.id) && w.push({ id: D.id, title: D.title, tag: D.tag || void 0, boardId: u.id, createdAt: D.createdAt });
        console.log("[useTasks] moveTasksToBoard: using old method, found tasks", { count: w.length }), await de(async () => {
          for (const u of w)
            await c.createTask({ id: u.id, title: u.title, tag: u.tag, createdAt: u.createdAt }, p, !0), await c.deleteTask(u.id, u.boardId, !0);
        }, t, e);
      }
      console.log("[useTasks] moveTasksToBoard: switching to target board", { targetBoardId: p }), k(p);
      const T = await c.getBoards();
      f(T);
      const { tasks: y } = se(T, p);
      s(y), console.log("[useTasks] moveTasksToBoard END");
    } catch (T) {
      console.error("[useTasks] moveTasksToBoard ERROR", T), alert(T.message || "Failed to move tasks");
    }
  }
  async function J(p) {
    if (await c.deleteBoard(p), l === p) {
      k("main");
      const i = await c.getBoards();
      f(i);
      const { tasks: d } = se(i, "main");
      s(d);
    } else
      await v();
  }
  async function W(p) {
    await c.createTag(p, l), await v();
  }
  async function X(p) {
    await c.deleteTag(p, l), await v();
  }
  function G(p) {
    k(p);
    const { tasks: i, foundBoard: d } = se(g, p);
    d ? s(i) : v();
  }
  return {
    // Task state
    tasks: o,
    pendingOperations: n,
    // Task operations
    addTask: _,
    completeTask: F,
    deleteTask: $,
    addTagToTask: I,
    updateTaskTags: M,
    bulkUpdateTaskTags: K,
    clearTasksByTag: H,
    clearRemainingTasks: q,
    // Board state
    boards: g,
    currentBoardId: l,
    // Board operations
    createBoard: E,
    deleteBoard: J,
    switchBoard: G,
    moveTasksToBoard: Q,
    createTagOnBoard: W,
    deleteTagOnBoard: X,
    // Lifecycle
    initialLoad: A,
    reload: v
  };
}
function lt({ tasks: t, onTaskUpdate: e, onBulkUpdate: a }) {
  const [o, s] = O(null), [n, r] = O(null), [c, g] = O(/* @__PURE__ */ new Set()), [f, l] = O(!1), [k, A] = O(null), [v, _] = O(null), F = re(null);
  function $(i) {
    let d = [];
    try {
      const T = i.dataTransfer.getData("application/x-hadoku-task-ids");
      T && (d = JSON.parse(T));
    } catch {
    }
    if (d.length === 0) {
      const T = i.dataTransfer.getData("text/plain");
      T && (d = [T]);
    }
    return d;
  }
  function I(i, d) {
    const T = c.has(d) && c.size > 0 ? Array.from(c) : [d];
    console.log("[useDragAndDrop] onDragStart", { taskId: d, idsToDrag: T, selectedCount: c.size }), i.dataTransfer.setData("text/plain", T[0]);
    try {
      i.dataTransfer.setData("application/x-hadoku-task-ids", JSON.stringify(T));
    } catch {
    }
    i.dataTransfer.effectAllowed = "copyMove";
    try {
      const y = i.currentTarget, w = y.closest && y.closest(".task-app__item") ? y.closest(".task-app__item") : y;
      w.classList.add("dragging");
      const u = w.cloneNode(!0);
      u.style.boxSizing = "border-box", u.style.width = `${w.offsetWidth}px`, u.style.height = `${w.offsetHeight}px`, u.style.opacity = "0.95", u.style.transform = "none", u.style.filter = "drop-shadow(0 6px 18px rgba(0,0,0,0.12))", u.classList.add("drag-image"), u.style.position = "absolute", u.style.top = "-9999px", u.style.left = "-9999px", document.body.appendChild(u), w.__dragImage = u, g((D) => {
        if (D.has(d)) return new Set(D);
        const b = new Set(D);
        return b.add(d), b;
      });
      try {
        const D = w.closest(".task-app__tag-column");
        if (D) {
          const b = D.querySelector(".task-app__tag-header") || D.querySelector("h3"), R = (b && b.textContent || "").trim().replace(/^#/, "");
          if (R)
            try {
              i.dataTransfer.setData("application/x-hadoku-task-source", R);
            } catch {
            }
        }
      } catch {
      }
      try {
        const D = w.getBoundingClientRect();
        let b = Math.round(i.clientX - D.left), N = Math.round(i.clientY - D.top);
        b = Math.max(0, Math.min(Math.round(u.offsetWidth - 1), b)), N = Math.max(0, Math.min(Math.round(u.offsetHeight - 1), N)), i.dataTransfer.setDragImage(u, b, N);
      } catch {
        i.dataTransfer.setDragImage(u, 0, 0);
      }
    } catch {
    }
  }
  function M(i) {
    try {
      const d = i.currentTarget;
      d.classList.remove("dragging");
      const T = d.__dragImage;
      T && T.parentNode && T.parentNode.removeChild(T), T && delete d.__dragImage;
    } catch {
    }
    try {
      E();
    } catch {
    }
  }
  function K(i) {
    if (i.button === 0) {
      try {
        const d = i.target;
        if (!d || d.closest && d.closest(".task-app__item, .task-app__controls, button, input, textarea, .task-app__item-actions"))
          return;
      } catch {
      }
      l(!0), F.current = { x: i.clientX, y: i.clientY }, A({ x: i.clientX, y: i.clientY, w: 0, h: 0 }), g(/* @__PURE__ */ new Set());
      try {
        document.body.classList.add("marquee-selecting");
      } catch {
      }
    }
  }
  function H(i) {
    if (!f || !F.current) return;
    const d = F.current.x, T = F.current.y, y = i.clientX, w = i.clientY, u = Math.min(d, y), D = Math.min(T, w), b = Math.abs(y - d), N = Math.abs(w - T);
    A({ x: u, y: D, w: b, h: N });
    const R = Array.from(document.querySelectorAll(".task-app__item")), L = /* @__PURE__ */ new Set();
    for (const Y of R) {
      const te = Y.getBoundingClientRect();
      if (!(te.right < u || te.left > u + b || te.bottom < D || te.top > D + N)) {
        const ne = Y.getAttribute("data-task-id");
        ne && L.add(ne), Y.classList.add("selected");
      } else
        Y.classList.remove("selected");
    }
    g(L);
  }
  function q(i) {
    l(!1), A(null), F.current = null;
    try {
      document.body.classList.remove("marquee-selecting");
    } catch {
    }
    try {
      _(Date.now());
    } catch {
    }
  }
  function E() {
    g(/* @__PURE__ */ new Set()), Array.from(document.querySelectorAll(".task-app__item.selected")).forEach((d) => d.classList.remove("selected"));
  }
  ee(() => {
    function i(y) {
      if (y.button !== 0) return;
      const w = { target: y.target, clientX: y.clientX, clientY: y.clientY, button: y.button };
      try {
        K(w);
      } catch {
      }
    }
    function d(y) {
      const w = { clientX: y.clientX, clientY: y.clientY };
      try {
        H(w);
      } catch {
      }
    }
    function T(y) {
      const w = { clientX: y.clientX, clientY: y.clientY };
      try {
        q(w);
      } catch {
      }
    }
    return document.addEventListener("mousedown", i), document.addEventListener("mousemove", d), document.addEventListener("mouseup", T), () => {
      document.removeEventListener("mousedown", i), document.removeEventListener("mousemove", d), document.removeEventListener("mouseup", T);
    };
  }, []);
  function Q(i, d) {
    i.preventDefault(), i.dataTransfer.dropEffect = "copy", s(d);
  }
  function J(i) {
    i.currentTarget.contains(i.relatedTarget) || s(null);
  }
  async function W(i, d) {
    i.preventDefault(), s(null), console.log("[useDragAndDrop] onDrop START", { targetTag: d });
    const T = $(i);
    if (T.length === 0) return;
    let y = null;
    try {
      const u = i.dataTransfer.getData("application/x-hadoku-task-source");
      u && (y = u);
    } catch {
    }
    console.log("[useDragAndDrop] onDrop: processing", { targetTag: d, ids: T, srcTag: y, taskCount: T.length });
    const w = [];
    for (const u of T) {
      const D = t.find((Y) => Y.id === u);
      if (!D) continue;
      const b = D.tag?.split(" ").filter(Boolean) || [];
      if (d === "other") {
        if (b.length === 0) continue;
        w.push({ taskId: u, tag: "" });
        continue;
      }
      const N = b.includes(d);
      let R = b.slice();
      N || R.push(d), y && y !== d && (R = R.filter((Y) => Y !== y));
      const L = R.join(" ").trim();
      w.push({ taskId: u, tag: L });
    }
    console.log("[useDragAndDrop] onDrop: updating tasks", { updateCount: w.length });
    try {
      await a(w), console.log("[useDragAndDrop] onDrop: updates complete, clearing selection");
      try {
        E();
      } catch {
      }
    } catch (u) {
      console.error("Failed to add tag to one or more tasks:", u), alert(u.message || "Failed to add tags");
    }
    console.log("[useDragAndDrop] onDrop END");
  }
  function X(i, d) {
    i.preventDefault(), i.dataTransfer.dropEffect = "copy", r(d);
  }
  function G(i) {
    i.currentTarget.contains(i.relatedTarget) || r(null);
  }
  async function p(i, d) {
    i.preventDefault(), r(null);
    const T = $(i);
    if (T.length === 0) return;
    console.log("[useDragAndDrop] onFilterDrop", { filterTag: d, ids: T, taskCount: T.length });
    const y = [];
    for (const w of T) {
      const u = t.find((N) => N.id === w);
      if (!u) continue;
      const D = u.tag?.split(" ").filter(Boolean) || [];
      if (D.includes(d)) {
        console.log(`Task ${w} already has tag: ${d}`);
        continue;
      }
      const b = [...D, d].join(" ");
      y.push({ taskId: w, tag: b });
    }
    if (y.length === 0) {
      console.log("No updates needed - all tasks already have this tag");
      return;
    }
    console.log(`Adding tag "${d}" to ${y.length} task(s) via filter drop`);
    try {
      await a(y);
      try {
        E();
      } catch {
      }
    } catch (w) {
      console.error("Failed to add tag via filter drop:", w), alert(w.message || "Failed to add tag");
    }
  }
  return {
    dragOverTag: o,
    dragOverFilter: n,
    setDragOverFilter: r,
    selectedIds: c,
    isSelecting: f,
    marqueeRect: k,
    selectionJustEndedAt: v,
    // selection handlers
    selectionStartHandler: K,
    selectionMoveHandler: H,
    selectionEndHandler: q,
    clearSelection: E,
    onDragStart: I,
    onDragEnd: M,
    onDragOver: Q,
    onDragLeave: J,
    onDrop: W,
    onFilterDragOver: X,
    onFilterDragLeave: G,
    onFilterDrop: p
  };
}
function dt() {
  const [t, e] = O({});
  function a(r) {
    e((c) => {
      const f = (c[r] || "desc") === "desc" ? "asc" : "desc";
      return { ...c, [r]: f };
    });
  }
  function o(r, c) {
    return [...r].sort((g, f) => {
      const l = new Date(g.createdAt).getTime(), k = new Date(f.createdAt).getTime();
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
function De({ onLongPress: t, delay: e = 500 }) {
  const a = re(null);
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
function fe(t) {
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
function ut({
  board: t,
  isActive: e,
  isDragOver: a,
  onSwitch: o,
  onContextMenu: s,
  onDragOverFilter: n,
  onMoveTasksToBoard: r,
  onClearSelection: c
}) {
  const g = De({
    onLongPress: (l, k) => s(t.id, l, k)
  }), f = t.id === "main";
  return /* @__PURE__ */ h(
    "button",
    {
      className: `board-btn ${e ? "board-btn--active" : ""} ${a ? "board-btn--drag-over" : ""}`,
      onClick: () => o(t.id),
      onContextMenu: (l) => {
        l.preventDefault(), !f && s(t.id, l.clientX, l.clientY);
      },
      ...f ? {} : g,
      "aria-pressed": e ? "true" : "false",
      onDragOver: (l) => {
        l.preventDefault(), l.dataTransfer.dropEffect = "move", n(`board:${t.id}`);
      },
      onDragLeave: (l) => {
        n(null);
      },
      onDrop: async (l) => {
        l.preventDefault(), n(null);
        const k = fe(l.dataTransfer);
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
function gt({
  tag: t,
  isActive: e,
  isDragOver: a,
  onToggle: o,
  onContextMenu: s,
  onDragOver: n,
  onDragLeave: r,
  onDrop: c
}) {
  const g = De({
    onLongPress: (f, l) => s(t, f, l)
  });
  return /* @__PURE__ */ C(
    "button",
    {
      onClick: () => o(t),
      onContextMenu: (f) => {
        f.preventDefault(), s(t, f.clientX, f.clientY);
      },
      ...g,
      className: `${e ? "on" : ""} ${a ? "task-app__filter-drag-over" : ""}`,
      onDragOver: (f) => n(f, t),
      onDragLeave: r,
      onDrop: (f) => c(f, t),
      children: [
        "#",
        t
      ]
    }
  );
}
function pt(t) {
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
  selected: g = !1
}) {
  const f = a.has(`complete-${t.id}`), l = a.has(`delete-${t.id}`);
  return /* @__PURE__ */ C(
    "li",
    {
      className: `task-app__item ${g ? "selected" : ""}`,
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
        /* @__PURE__ */ C("div", { className: "task-app__item-content", children: [
          /* @__PURE__ */ h("div", { className: "task-app__item-title", title: t.title, children: t.title }),
          /* @__PURE__ */ C("div", { className: "task-app__item-meta-row", children: [
            t.tag ? /* @__PURE__ */ h("div", { className: "task-app__item-tag", children: t.tag.split(" ").map((k) => `#${k}`).join(" ") }) : /* @__PURE__ */ h("div", {}),
            /* @__PURE__ */ h("div", { className: "task-app__item-age", children: pt(t.createdAt) })
          ] })
        ] }),
        /* @__PURE__ */ C("div", { className: "task-app__item-actions", children: [
          /* @__PURE__ */ h(
            "button",
            {
              className: "task-app__action-btn task-app__complete-btn",
              onClick: () => o(t.id),
              title: "Complete task",
              disabled: f || l,
              children: f ? "⏳" : "✓"
            }
          ),
          /* @__PURE__ */ h(
            "button",
            {
              className: "task-app__action-btn task-app__delete-btn",
              onClick: () => s(t.id),
              title: "Delete task",
              disabled: f || l,
              children: l ? "⏳" : "×"
            }
          )
        ] })
      ]
    }
  );
}
function be(t) {
  return t === 0 ? { useTags: 0, maxPerColumn: 1 / 0, rows: [] } : t === 1 ? {
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
function ft({
  tasks: t,
  topTags: e,
  filters: a,
  sortDirections: o,
  dragOverTag: s,
  pendingOperations: n,
  onComplete: r,
  onDelete: c,
  onAddTag: g,
  onDragStart: f,
  onDragEnd: l,
  selectedIds: k,
  onSelectionStart: A,
  onSelectionMove: v,
  onSelectionEnd: _,
  onDragOver: F,
  onDragLeave: $,
  onDrop: I,
  toggleSort: M,
  sortTasksByAge: K,
  getSortIcon: H,
  getSortTitle: q,
  clearTasksByTag: E,
  clearRemainingTasks: Q,
  onDeletePersistedTag: J
}) {
  const W = (u, D) => /* @__PURE__ */ C(
    "div",
    {
      className: `task-app__tag-column ${s === u ? "task-app__tag-column--drag-over" : ""}`,
      onDragOver: (b) => F(b, u),
      onDragLeave: $,
      onDrop: (b) => I(b, u),
      children: [
        /* @__PURE__ */ C("div", { className: "task-app__tag-header-row", children: [
          /* @__PURE__ */ C("h3", { className: "task-app__tag-header", children: [
            "#",
            u
          ] }),
          /* @__PURE__ */ h(
            "button",
            {
              className: "task-app__sort-btn task-app__sort-btn--active",
              onClick: () => M(u),
              title: q(o[u] || "desc"),
              children: H(o[u] || "desc")
            }
          )
        ] }),
        /* @__PURE__ */ h("ul", { className: "task-app__list task-app__list--column", children: K(D, o[u] || "desc").map((b) => /* @__PURE__ */ h(
          ue,
          {
            task: b,
            isDraggable: !0,
            pendingOperations: n,
            onComplete: r,
            onDelete: c,
            onAddTag: g,
            onDragStart: f,
            onDragEnd: l,
            selected: k ? k.has(b.id) : !1
          },
          b.id
        )) })
      ]
    },
    u
  ), X = (u, D) => {
    let b = we(t, u);
    return p && (b = b.filter((N) => {
      const R = N.tag?.split(" ") || [];
      return a.some((L) => R.includes(L));
    })), b.slice(0, D);
  }, G = e.length, p = Array.isArray(a) && a.length > 0, i = t.filter((u) => {
    if (!p) return !0;
    const D = u.tag?.split(" ") || [];
    return a.some((b) => D.includes(b));
  }), d = be(G), T = p ? e.filter((u) => we(t, u).some((b) => {
    const N = b.tag?.split(" ") || [];
    return a.some((R) => N.includes(R));
  })) : e.slice(0, d.useTags);
  if (T.length === 0)
    return /* @__PURE__ */ h("ul", { className: "task-app__list", children: i.map((u) => /* @__PURE__ */ h(
      ue,
      {
        task: u,
        pendingOperations: n,
        onComplete: r,
        onDelete: c,
        onAddTag: g,
        onDragStart: f,
        onDragEnd: l,
        selected: k ? k.has(u.id) : !1
      },
      u.id
    )) });
  const y = rt(t, e, a).filter((u) => {
    if (!p) return !0;
    const D = u.tag?.split(" ") || [];
    return a.some((b) => D.includes(b));
  }), w = be(T.length);
  return /* @__PURE__ */ C("div", { className: "task-app__dynamic-layout", children: [
    w.rows.length > 0 && /* @__PURE__ */ h(Pe, { children: w.rows.map((u, D) => /* @__PURE__ */ h("div", { className: `task-app__tag-grid task-app__tag-grid--${u.columns}col`, children: u.tagIndices.map((b) => {
      const N = T[b];
      return N ? W(N, X(N, w.maxPerColumn)) : null;
    }) }, D)) }),
    y.length > 0 && /* @__PURE__ */ C(
      "div",
      {
        className: `task-app__remaining ${s === "other" ? "task-app__tag-column--drag-over" : ""}`,
        onDragOver: (u) => {
          u.preventDefault(), u.dataTransfer.dropEffect = "move", F(u, "other");
        },
        onDragLeave: (u) => $(u),
        onDrop: (u) => I(u, "other"),
        children: [
          /* @__PURE__ */ C("div", { className: "task-app__tag-header-row", children: [
            /* @__PURE__ */ h("h3", { className: "task-app__remaining-header", children: "Other Tasks" }),
            /* @__PURE__ */ h(
              "button",
              {
                className: "task-app__sort-btn task-app__sort-btn--active",
                onClick: () => M("other"),
                title: q(o.other || "desc"),
                children: H(o.other || "desc")
              }
            )
          ] }),
          /* @__PURE__ */ h("ul", { className: "task-app__list", children: K(y, o.other || "desc").map((u) => /* @__PURE__ */ h(
            ue,
            {
              task: u,
              pendingOperations: n,
              onComplete: r,
              onDelete: c,
              onAddTag: g,
              onDragStart: f,
              onDragEnd: l,
              selected: k ? k.has(u.id) : !1
            },
            u.id
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
  confirmLabel: g = "Confirm",
  cancelLabel: f = "Cancel",
  confirmDisabled: l = !1,
  confirmDanger: k = !1
}) {
  return t ? /* @__PURE__ */ h(
    "div",
    {
      className: "modal-overlay",
      onClick: a,
      children: /* @__PURE__ */ C(
        "div",
        {
          className: "modal-card",
          onClick: (v) => v.stopPropagation(),
          children: [
            /* @__PURE__ */ h("h3", { children: e }),
            s,
            r && /* @__PURE__ */ h(
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
            /* @__PURE__ */ C("div", { className: "modal-actions", children: [
              /* @__PURE__ */ h(
                "button",
                {
                  className: "modal-button",
                  onClick: a,
                  children: f
                }
              ),
              /* @__PURE__ */ h(
                "button",
                {
                  className: `modal-button ${k ? "modal-button--danger" : "modal-button--primary"}`,
                  onClick: o,
                  disabled: l,
                  children: g
                }
              )
            ] })
          ]
        }
      )
    }
  ) : null;
}
function Se({ isOpen: t, x: e, y: a, items: o }) {
  return t ? /* @__PURE__ */ h(
    "div",
    {
      className: "board-context-menu",
      style: {
        left: `${e}px`,
        top: `${a}px`
      },
      children: o.map((s, n) => /* @__PURE__ */ h(
        "button",
        {
          className: `context-menu-item ${s.isDanger ? "context-menu-item--danger" : ""}`,
          onClick: s.onClick,
          children: s.label
        },
        n
      ))
    }
  ) : null;
}
const Be = 5, Ae = [
  { name: "light", emoji: "☀️", label: "Light theme" },
  { name: "dark", emoji: "🌙", label: "Dark theme" },
  { name: "strawberry", emoji: "🍓", label: "Strawberry theme" },
  { name: "ocean", emoji: "🌊", label: "Ocean theme" },
  { name: "cyberpunk", emoji: "🤖", label: "Cyberpunk theme" },
  { name: "coffee", emoji: "☕", label: "Coffee theme" },
  { name: "lavender", emoji: "🪻", label: "Lavender theme" }
], mt = (t) => Ae.find((e) => e.name === t)?.emoji || "🌙";
function kt(t = {}) {
  const { userType: e = "public", userId: a = "public", sessionId: o } = t, [s, n] = O(/* @__PURE__ */ new Set()), [r, c] = O(null), [g, f] = O(!1), [l, k] = O(!1), [A, v] = O(null), [_, F] = O(""), [$, I] = O(null), [M, K] = O("light"), [H, q] = O(!1), [E, Q] = O(null), [J, W] = O(null), X = re(null), G = re(null), {
    tasks: p,
    pendingOperations: i,
    initialLoad: d,
    addTask: T,
    completeTask: y,
    deleteTask: w,
    addTagToTask: u,
    updateTaskTags: D,
    bulkUpdateTaskTags: b,
    clearTasksByTag: N,
    clearRemainingTasks: R,
    // board API
    boards: L,
    currentBoardId: Y,
    createBoard: te,
    deleteBoard: he,
    switchBoard: ne,
    moveTasksToBoard: ye,
    createTagOnBoard: Ce,
    deleteTagOnBoard: _e
  } = it({ userType: e, userId: a, sessionId: o }), B = lt({
    tasks: p,
    onTaskUpdate: D,
    onBulkUpdate: b
  }), ae = dt();
  ee(() => {
    pe(e, a, o).getPreferences().then((S) => {
      K(S.theme);
    });
  }, [e, a, o]), ee(() => {
    pe(e, a, o).savePreferences({ theme: M });
  }, [M, e, a, o]), ee(() => {
    console.log("[App] User context changed, initializing...", { userType: e, userId: a }), d(), X.current?.focus();
  }, [e, a]), ee(() => {
    G.current && G.current.setAttribute("data-theme", M);
  }, [M]), ee(() => {
    if (!H && !E && !J) return;
    const m = (S) => {
      const x = S.target;
      x.closest(".theme-picker") || q(!1), x.closest(".board-context-menu") || Q(null), x.closest(".tag-context-menu") || W(null);
    };
    return document.addEventListener("mousedown", m), () => document.removeEventListener("mousedown", m);
  }, [H, E, J]);
  async function xe(m) {
    await T(m) && X.current && (X.current.value = "", X.current.focus());
  }
  function Ne(m) {
    const S = p.filter((x) => x.tag?.split(" ").includes(m));
    c({ tag: m, count: S.length });
  }
  async function Oe(m) {
    const S = m.trim().replace(/\s+/g, "-");
    try {
      if (await Ce(S), A?.type === "apply-tag" && A.taskIds.length > 0) {
        const x = A.taskIds.map((U) => {
          const Z = p.find((Le) => Le.id === U)?.tag?.split(" ").filter(Boolean) || [], Me = [.../* @__PURE__ */ new Set([...Z, S])];
          return { taskId: U, tag: Me.join(" ") };
        });
        await b(x), B.clearSelection();
      }
      v(null);
    } catch (x) {
      throw console.error("[App] Failed to create tag:", x), x;
    }
  }
  function ie(m) {
    const S = m.trim();
    return S ? (L?.boards?.map((U) => U.id.toLowerCase()) || []).includes(S.toLowerCase()) ? `Board "${S}" already exists` : null : "Board name cannot be empty";
  }
  async function $e(m) {
    const S = m.trim(), x = ie(S);
    if (x) {
      I(x);
      return;
    }
    try {
      await te(S), A?.type === "move-to-board" && A.taskIds.length > 0 && (await ye(S, A.taskIds), B.clearSelection()), v(null), I(null);
    } catch (U) {
      console.error("[App] Failed to create board:", U), I(U.message || "Failed to create board");
    }
  }
  const Fe = L?.boards?.find((m) => m.id === Y)?.tags || [], Ee = ot(p, 6);
  return /* @__PURE__ */ h(
    "div",
    {
      ref: G,
      className: "task-app-container",
      onMouseDown: B.selectionStartHandler,
      onMouseMove: B.selectionMoveHandler,
      onMouseUp: B.selectionEndHandler,
      onMouseLeave: B.selectionEndHandler,
      onClick: (m) => {
        try {
          const S = m.target;
          if (!S.closest || !S.closest(".task-app__item")) {
            if (B.selectionJustEndedAt && Date.now() - B.selectionJustEndedAt < 300)
              return;
            B.clearSelection();
          }
        } catch {
        }
      },
      children: /* @__PURE__ */ C("div", { className: "task-app", children: [
        /* @__PURE__ */ C("div", { className: "task-app__header-container", children: [
          /* @__PURE__ */ h("h1", { className: "task-app__header", children: "Tasks" }),
          /* @__PURE__ */ C("div", { className: "theme-picker", children: [
            /* @__PURE__ */ h(
              "button",
              {
                className: "theme-toggle-btn",
                onClick: () => q(!H),
                "aria-label": "Choose theme",
                title: "Choose theme",
                children: mt(M)
              }
            ),
            H && /* @__PURE__ */ h("div", { className: "theme-picker__dropdown", children: Ae.map(({ name: m, emoji: S, label: x }) => /* @__PURE__ */ h(
              "button",
              {
                className: `theme-picker__option ${M === m ? "active" : ""}`,
                onClick: () => {
                  K(m), q(!1);
                },
                title: x,
                children: S
              },
              m
            )) })
          ] })
        ] }),
        /* @__PURE__ */ C("div", { className: "task-app__boards", children: [
          /* @__PURE__ */ h("div", { className: "task-app__board-list", children: (L && L.boards ? L.boards.slice(0, Be) : [{ id: "main", name: "main", tasks: [], tags: [] }]).map((m) => /* @__PURE__ */ h(
            ut,
            {
              board: m,
              isActive: Y === m.id,
              isDragOver: B.dragOverFilter === `board:${m.id}`,
              onSwitch: ne,
              onContextMenu: (S, x, U) => Q({ boardId: S, x, y: U }),
              onDragOverFilter: B.setDragOverFilter,
              onMoveTasksToBoard: ye,
              onClearSelection: B.clearSelection
            },
            m.id
          )) }),
          /* @__PURE__ */ C("div", { className: "task-app__board-actions", children: [
            (!L || L.boards && L.boards.length < Be) && /* @__PURE__ */ h(
              "button",
              {
                className: `board-add-btn ${B.dragOverFilter === "add-board" ? "board-btn--drag-over" : ""}`,
                onClick: () => {
                  F(""), I(null), f(!0);
                },
                onDragOver: (m) => {
                  m.preventDefault(), m.dataTransfer.dropEffect = "move", B.setDragOverFilter("add-board");
                },
                onDragLeave: (m) => {
                  B.setDragOverFilter(null);
                },
                onDrop: async (m) => {
                  m.preventDefault(), B.setDragOverFilter(null);
                  const S = fe(m.dataTransfer);
                  S.length > 0 && (F(""), v({ type: "move-to-board", taskIds: S }), f(!0));
                },
                "aria-label": "Create board",
                children: "＋"
              }
            ),
            e !== "public" && /* @__PURE__ */ h(
              "button",
              {
                className: "sync-btn",
                onClick: async (m) => {
                  console.log("[App] Manual refresh triggered"), await d(), m.currentTarget.blur();
                },
                title: "Sync from server",
                "aria-label": "Sync from server",
                children: /* @__PURE__ */ C("svg", { width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [
                  /* @__PURE__ */ h("polyline", { points: "23 4 23 10 17 10" }),
                  /* @__PURE__ */ h("polyline", { points: "1 20 1 14 7 14" }),
                  /* @__PURE__ */ h("path", { d: "M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" })
                ] })
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ h("div", { className: "task-app__controls", children: /* @__PURE__ */ h(
          "input",
          {
            ref: X,
            className: "task-app__input",
            placeholder: "Type a task and press Enter…",
            onKeyDown: (m) => {
              m.key === "Enter" && !m.shiftKey && (m.preventDefault(), xe(m.target.value)), m.key === "k" && (m.ctrlKey || m.metaKey) && (m.preventDefault(), X.current?.focus());
            }
          }
        ) }),
        /* @__PURE__ */ C("div", { className: "task-app__filters", children: [
          (() => {
            const m = le(p);
            return Array.from(/* @__PURE__ */ new Set([...Fe, ...m])).map((x) => /* @__PURE__ */ h(
              gt,
              {
                tag: x,
                isActive: s.has(x),
                isDragOver: B.dragOverFilter === x,
                onToggle: (U) => {
                  n((oe) => {
                    const Z = new Set(oe);
                    return Z.has(U) ? Z.delete(U) : Z.add(U), Z;
                  });
                },
                onContextMenu: (U, oe, Z) => W({ tag: U, x: oe, y: Z }),
                onDragOver: B.onFilterDragOver,
                onDragLeave: B.onFilterDragLeave,
                onDrop: B.onFilterDrop
              },
              x
            ));
          })(),
          /* @__PURE__ */ h(
            "button",
            {
              className: `task-app__filter-add ${B.dragOverFilter === "add-tag" ? "task-app__filter-drag-over" : ""}`,
              onClick: () => {
                F(""), k(!0);
              },
              onDragOver: (m) => {
                m.preventDefault(), m.dataTransfer.dropEffect = "copy", B.onFilterDragOver(m, "add-tag");
              },
              onDragLeave: B.onFilterDragLeave,
              onDrop: async (m) => {
                m.preventDefault(), B.onFilterDragLeave(m);
                const S = fe(m.dataTransfer);
                S.length > 0 && (F(""), v({ type: "apply-tag", taskIds: S }), k(!0));
              },
              "aria-label": "Add tag",
              children: "＋"
            }
          )
        ] }),
        /* @__PURE__ */ h(
          ft,
          {
            tasks: p,
            topTags: Ee,
            filters: Array.from(s),
            selectedIds: B.selectedIds,
            onSelectionStart: B.selectionStartHandler,
            onSelectionMove: B.selectionMoveHandler,
            onSelectionEnd: B.selectionEndHandler,
            sortDirections: ae.sortDirections,
            dragOverTag: B.dragOverTag,
            pendingOperations: i,
            onComplete: y,
            onDelete: w,
            onAddTag: u,
            onDragStart: B.onDragStart,
            onDragEnd: B.onDragEnd,
            onDragOver: B.onDragOver,
            onDragLeave: B.onDragLeave,
            onDrop: B.onDrop,
            toggleSort: ae.toggleSort,
            sortTasksByAge: ae.sortTasksByAge,
            getSortIcon: ae.getSortIcon,
            getSortTitle: ae.getSortTitle,
            clearTasksByTag: Ne,
            clearRemainingTasks: R,
            onDeletePersistedTag: _e
          }
        ),
        B.isSelecting && B.marqueeRect && /* @__PURE__ */ h(
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
        /* @__PURE__ */ h(
          ge,
          {
            isOpen: !!r,
            title: `Clear Tag #${r?.tag}?`,
            onClose: () => c(null),
            onConfirm: async () => {
              if (!r) return;
              const m = r.tag;
              c(null), await N(m);
            },
            confirmLabel: "Clear Tag",
            confirmDanger: !0,
            children: r && /* @__PURE__ */ C("p", { children: [
              "This will remove ",
              /* @__PURE__ */ C("strong", { children: [
                "#",
                r.tag
              ] }),
              " from",
              " ",
              /* @__PURE__ */ C("strong", { children: [
                r.count,
                " task(s)"
              ] }),
              " and delete the tag from the board."
            ] })
          }
        ),
        /* @__PURE__ */ C(
          ge,
          {
            isOpen: g,
            title: "Create New Board",
            onClose: () => {
              f(!1), v(null), I(null);
            },
            onConfirm: async () => {
              if (!_.trim()) return;
              const m = ie(_);
              if (m) {
                I(m);
                return;
              }
              f(!1), await $e(_);
            },
            inputValue: _,
            onInputChange: (m) => {
              F(m), I(null);
            },
            inputPlaceholder: "Board name",
            confirmLabel: "Create",
            confirmDisabled: !_.trim() || ie(_) !== null,
            children: [
              A?.type === "move-to-board" && A.taskIds.length > 0 && /* @__PURE__ */ C("p", { className: "modal-hint", children: [
                A.taskIds.length,
                " task",
                A.taskIds.length > 1 ? "s" : "",
                " will be moved to this board"
              ] }),
              $ && /* @__PURE__ */ h("p", { className: "modal-error", style: { color: "var(--error-color, #d32f2f)", marginTop: "0.5rem" }, children: $ })
            ]
          }
        ),
        /* @__PURE__ */ C(
          ge,
          {
            isOpen: l,
            title: "Create New Tag",
            onClose: () => {
              k(!1), v(null);
            },
            onConfirm: async () => {
              if (_.trim()) {
                k(!1);
                try {
                  await Oe(_);
                } catch (m) {
                  console.error("[App] Failed to create tag:", m);
                }
              }
            },
            inputValue: _,
            onInputChange: F,
            inputPlaceholder: "Enter new tag name",
            confirmLabel: "Create",
            confirmDisabled: !_.trim(),
            children: [
              A?.type === "apply-tag" && A.taskIds.length > 0 && /* @__PURE__ */ C("p", { className: "modal-hint", children: [
                "This tag will be applied to ",
                A.taskIds.length,
                " task",
                A.taskIds.length > 1 ? "s" : ""
              ] }),
              le(p).length > 0 && /* @__PURE__ */ C("div", { className: "modal-section", children: [
                /* @__PURE__ */ h("label", { className: "modal-label", children: "Existing tags:" }),
                /* @__PURE__ */ h("div", { className: "modal-tags-list", children: le(p).map((m) => /* @__PURE__ */ C("span", { className: "modal-tag-chip", children: [
                  "#",
                  m
                ] }, m)) })
              ] })
            ]
          }
        ),
        /* @__PURE__ */ h(
          Se,
          {
            isOpen: !!E,
            x: E?.x || 0,
            y: E?.y || 0,
            items: [
              {
                label: "🗑️ Delete Board",
                isDanger: !0,
                onClick: async () => {
                  if (!E) return;
                  const m = L?.boards?.find((S) => S.id === E.boardId)?.name || E.boardId;
                  if (confirm(`Delete board "${m}"? All tasks on this board will be permanently deleted.`))
                    try {
                      await he(E.boardId), Q(null);
                    } catch (S) {
                      console.error("[App] Failed to delete board:", S), alert(S.message || "Failed to delete board");
                    }
                }
              }
            ]
          }
        ),
        /* @__PURE__ */ h(
          Se,
          {
            isOpen: !!J,
            x: J?.x || 0,
            y: J?.y || 0,
            items: [
              {
                label: "🗑️ Delete Tag",
                isDanger: !0,
                onClick: async () => {
                  if (!J) return;
                  const m = p.filter((S) => S.tag?.split(" ").includes(J.tag));
                  if (confirm(`Delete tag "${J.tag}" and remove it from ${m.length} task(s)?`))
                    try {
                      await N(J.tag), W(null);
                    } catch (S) {
                      console.error("[App] Failed to delete tag:", S), alert(S.message || "Failed to delete tag");
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
function vt(t, e = {}) {
  const a = new URLSearchParams(window.location.search), o = e.userType || a.get("userType") || "public", s = e.userId || a.get("userId") || "public", n = e.sessionId, r = { ...e, userType: o, userId: s, sessionId: n }, c = Ie(t);
  c.render(/* @__PURE__ */ h(kt, { ...r })), t.__root = c, console.log("[task-app] Mounted successfully", r);
}
function bt(t) {
  t.__root?.unmount();
}
export {
  vt as mount,
  bt as unmount
};
