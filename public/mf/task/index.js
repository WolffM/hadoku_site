import { jsx as h, jsxs as C, Fragment as Le } from "react/jsx-runtime";
import { createRoot as Pe } from "react-dom/client";
import { useState as O, useMemo as Ie, useEffect as ee, useRef as re } from "react";
const U = `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
class Re {
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
function Ue() {
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
function fe(t, e, a, o) {
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
function Je(t, e, a) {
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
function je(t, e, a) {
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
function ke(t, e, a) {
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
async function Ke(t, e) {
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
async function Xe(t, e, a, o = "main") {
  const s = V(), n = await t.getTasks(e.userType, e.userId, o), r = await t.getStats(e.userType, e.userId, o), c = a.id || Ue(), u = a.createdAt || s, p = {
    id: c,
    title: a.title,
    tag: a.tag ?? null,
    state: "Active",
    createdAt: u
  }, l = {
    ...n,
    tasks: [p, ...n.tasks],
    updatedAt: s
  }, k = Je(r, p, s);
  return await t.saveTasks(e.userType, e.userId, o, l), await t.saveStats(e.userType, e.userId, o, k), { ok: !0, id: c };
}
async function qe(t, e, a, o, s = "main") {
  const n = V(), r = await t.getTasks(e.userType, e.userId, s), c = await t.getStats(e.userType, e.userId, s), { task: u, index: p } = me(r, a), l = {
    ...u,
    ...o,
    updatedAt: n
  }, k = [...r.tasks];
  k[p] = l;
  const D = {
    ...r,
    tasks: k,
    updatedAt: n
  }, w = ke(c, l, n);
  return await t.saveTasks(e.userType, e.userId, s, D), await t.saveStats(e.userType, e.userId, s, w), { ok: !0, message: `Task ${a} updated` };
}
async function Ye(t, e, a, o = "main") {
  const s = V(), n = await t.getTasks(e.userType, e.userId, o), r = await t.getStats(e.userType, e.userId, o), { task: c, index: u } = me(n, a), p = {
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
  }, D = je(r, p, s);
  return await t.saveTasks(e.userType, e.userId, o, k), await t.saveStats(e.userType, e.userId, o, D), { ok: !0, message: `Task ${a} completed` };
}
async function ze(t, e, a, o = "main") {
  const s = V(), n = await t.getTasks(e.userType, e.userId, o), r = await t.getStats(e.userType, e.userId, o), { task: c, index: u } = me(n, a), p = {
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
  }, D = He(r, p, s);
  return await t.saveTasks(e.userType, e.userId, o, k), await t.saveStats(e.userType, e.userId, o, D), { ok: !0, message: `Task ${a} deleted` };
}
async function Ve(t, e, a) {
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
async function We(t, e, a) {
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
async function Ge(t, e, a) {
  const o = V(), s = await t.getBoards(e.userType, e.userId), { board: n, index: r } = ce(s, a.boardId), c = n.tags || [];
  if (c.includes(a.tag))
    return { ok: !0, message: `Tag ${a.tag} already exists` };
  const u = {
    ...n,
    tags: [...c, a.tag]
  }, p = fe(s, r, u, o);
  return await t.saveBoards(e.userType, p, e.userId), { ok: !0, message: `Tag ${a.tag} added to board ${a.boardId}` };
}
async function Qe(t, e, a) {
  const o = V(), s = await t.getBoards(e.userType, e.userId), { board: n, index: r } = ce(s, a.boardId), c = n.tags || [], u = {
    ...n,
    tags: c.filter((l) => l !== a.tag)
  }, p = fe(s, r, u, o);
  return await t.saveBoards(e.userType, p, e.userId), { ok: !0, message: `Tag ${a.tag} removed from board ${a.boardId}` };
}
async function Ze(t, e, a) {
  const o = V(), s = await t.getTasks(e.userType, e.userId, a.boardId), n = await t.getStats(e.userType, e.userId, a.boardId);
  let r = 0;
  const c = s.tasks.map((l) => {
    const k = a.updates.find((D) => D.taskId === l.id);
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
  let p = n;
  for (const l of c)
    a.updates.find((k) => k.taskId === l.id) && (p = ke(p, l, o));
  return await t.saveTasks(e.userType, e.userId, a.boardId, u), await t.saveStats(e.userType, e.userId, a.boardId, p), {
    ok: !0,
    message: `Updated ${r} task(s) on board ${a.boardId}`,
    updated: r
  };
}
async function et(t, e, a) {
  const o = V(), s = await t.getTasks(e.userType, e.userId, a.boardId), n = await t.getStats(e.userType, e.userId, a.boardId), r = await t.getBoards(e.userType, e.userId);
  let c = 0;
  const u = s.tasks.map(($) => {
    if (a.taskIds.includes($.id) && $.tag) {
      const M = $.tag.split(" ").filter(Boolean).filter((H) => H !== a.tag);
      return c++, {
        ...$,
        tag: M.length > 0 ? M.join(" ") : void 0,
        updatedAt: o
      };
    }
    return $;
  }), p = {
    ...s,
    tasks: u,
    updatedAt: o
  };
  let l = n;
  for (const $ of u)
    a.taskIds.includes($.id) && (l = ke(l, $, o));
  const { board: k, index: D } = ce(r, a.boardId), w = k.tags || [], _ = {
    ...k,
    tags: w.filter(($) => $ !== a.tag)
  }, F = fe(r, D, _, o);
  return await t.saveTasks(e.userType, e.userId, a.boardId, p), await t.saveStats(e.userType, e.userId, a.boardId, l), await t.saveBoards(e.userType, F, e.userId), {
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
function tt(t = "public", e = "public") {
  const a = new Re(t, e), o = { userType: "registered", userId: e };
  return {
    async getBoards() {
      const s = await Ke(a, o), n = {
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
      const n = await Ve(
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
      }), z("boards-updated", { sessionId: U, userType: t, userId: e }), n.board;
    },
    async deleteBoard(s) {
      await We(
        a,
        o,
        s
      ), await a.deleteBoardData(t, e, s), z("boards-updated", { sessionId: U, userType: t, userId: e });
    },
    async getTasks(s = "main") {
      return a.getTasks(t, e, s);
    },
    async getStats(s = "main") {
      return a.getStats(t, e, s);
    },
    async createTask(s, n = "main", r = !1) {
      console.log("[localStorageApi] createTask (using handler)", { data: s, boardId: n, suppressBroadcast: r });
      const c = await Xe(
        a,
        o,
        s,
        n
      ), p = (await a.getTasks(t, e, n)).tasks.find((l) => l.id === c.id);
      if (!p)
        throw new Error("Task creation failed - task not found after creation");
      return r ? console.log("[localStorageApi] createTask: broadcast suppressed") : (console.log("[localStorageApi] createTask: broadcasting", {
        sessionId: U,
        boardId: n,
        taskId: c.id
      }), z("tasks-updated", { sessionId: U, userType: t, userId: e, boardId: n })), p;
    },
    async patchTask(s, n, r = "main", c = !1) {
      const u = {};
      n.title !== void 0 && (u.title = n.title), n.tag !== void 0 && n.tag !== null && (u.tag = n.tag), await qe(
        a,
        o,
        s,
        u,
        r
      ), c || z("tasks-updated", { sessionId: U, userType: t, userId: e, boardId: r });
      const l = (await a.getTasks(t, e, r)).tasks.find((k) => k.id === s);
      if (!l)
        throw new Error("Task not found after update");
      return l;
    },
    async completeTask(s, n = "main") {
      const c = (await a.getTasks(t, e, n)).tasks.find((u) => u.id === s);
      if (!c)
        throw new Error("Task not found");
      return await Ye(
        a,
        o,
        s,
        n
      ), z("tasks-updated", { sessionId: U, userType: t, userId: e, boardId: n }), {
        ...c,
        state: "Completed",
        closedAt: (/* @__PURE__ */ new Date()).toISOString(),
        updatedAt: (/* @__PURE__ */ new Date()).toISOString()
      };
    },
    async deleteTask(s, n = "main", r = !1) {
      console.log("[localStorageApi] deleteTask (using handler)", { id: s, boardId: n, suppressBroadcast: r });
      const u = (await a.getTasks(t, e, n)).tasks.find((p) => p.id === s);
      if (!u)
        throw new Error("Task not found");
      return await ze(
        a,
        o,
        s,
        n
      ), r ? console.log("[localStorageApi] deleteTask: broadcast suppressed") : (console.log("[localStorageApi] deleteTask: broadcasting", { sessionId: U }), z("tasks-updated", { sessionId: U, userType: t, userId: e, boardId: n })), {
        ...u,
        state: "Deleted",
        closedAt: (/* @__PURE__ */ new Date()).toISOString(),
        updatedAt: (/* @__PURE__ */ new Date()).toISOString()
      };
    },
    async createTag(s, n = "main") {
      await Ge(
        a,
        o,
        { boardId: n, tag: s }
      ), z("boards-updated", { sessionId: U, userType: t, userId: e, boardId: n });
    },
    async deleteTag(s, n = "main") {
      await Qe(
        a,
        o,
        { boardId: n, tag: s }
      ), z("boards-updated", { sessionId: U, userType: t, userId: e, boardId: n });
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
      const c = await this.getBoards(), u = c.boards.find((_) => _.id === s), p = c.boards.find((_) => _.id === n);
      if (!u)
        throw new Error(`Source board ${s} not found`);
      if (!p)
        throw new Error(`Target board ${n} not found`);
      const l = u.tasks.filter((_) => r.includes(_.id));
      u.tasks = u.tasks.filter((_) => !r.includes(_.id)), p.tasks = [...p.tasks, ...l], c.updatedAt = (/* @__PURE__ */ new Date()).toISOString();
      const k = `${t}-${e}-boards`;
      localStorage.setItem(k, JSON.stringify(c));
      const D = `${t}-${e}-${s}-tasks`, w = `${t}-${e}-${n}-tasks`;
      return localStorage.setItem(D, JSON.stringify({
        version: 1,
        updatedAt: c.updatedAt,
        tasks: u.tasks
      })), localStorage.setItem(w, JSON.stringify({
        version: 1,
        updatedAt: c.updatedAt,
        tasks: p.tasks
      })), z("boards-updated", { sessionId: U, userType: t, userId: e }), { ok: !0, moved: l.length };
    },
    async batchUpdateTags(s, n) {
      console.log("[localStorageApi] batchUpdateTags", { boardId: s, updates: n }), await Ze(
        a,
        o,
        { boardId: s, updates: n }
      ), z("tasks-updated", { sessionId: U, userType: t, userId: e, boardId: s });
    },
    async batchClearTag(s, n, r) {
      console.log("[localStorageApi] batchClearTag START", { boardId: s, tag: n, taskIds: r, taskCount: r.length });
      const c = await et(
        a,
        o,
        { boardId: s, tag: n, taskIds: r }
      );
      console.log("[localStorageApi] batchClearTag result:", c), z("boards-updated", { sessionId: U, userType: t, userId: e, boardId: s }), console.log("[localStorageApi] batchClearTag END");
    }
  };
}
async function at(t, e, a, o) {
  for (const r of e.boards || []) {
    const c = r.id;
    if (r.tasks && r.tasks.length > 0) {
      const u = `${a}-${o}-${c}-tasks`, p = {
        version: 1,
        updatedAt: e.updatedAt || (/* @__PURE__ */ new Date()).toISOString(),
        tasks: r.tasks
      };
      window.localStorage.setItem(u, JSON.stringify(p));
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
function j(t, e, a) {
  const o = {
    "Content-Type": "application/json",
    "X-User-Type": t
  };
  return e && (o["X-User-Id"] = e), a && (o["X-Session-Id"] = a), o;
}
function ge(t = "public", e = "public", a) {
  const o = tt(t, e);
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
        console.log("[api] Synced from API:", { boards: n.boards.length, totalTasks: n.boards.reduce((r, c) => r + (c.tasks?.length || 0), 0) }), await at(o, n, t, e);
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
      }).then((u) => u.json()).then((u) => {
        u.ok && (u.id === c.id ? console.log("[api] Background sync: createTask completed (ID matched)") : console.warn("[api] Server returned different ID (unexpected):", { client: c.id, server: u.id }));
      }).catch((u) => console.error("[api] Failed to sync createTask:", u)), c;
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
      const u = await o.patchTask(s, n, r, c);
      return fetch(`/task/api/${s}`, {
        method: "PATCH",
        headers: j(t, e, a),
        body: JSON.stringify({ ...n, boardId: r })
      }).then(() => console.log("[api] Background sync: patchTask completed")).catch((p) => console.error("[api] Failed to sync patchTask:", p)), u;
    },
    async completeTask(s, n = "main") {
      const r = await o.completeTask(s, n);
      return fetch(`/task/api/${s}/complete`, {
        method: "POST",
        headers: j(t, e, a),
        body: JSON.stringify({ boardId: n })
      }).then((c) => {
        if (!c.ok) throw new Error(`HTTP ${c.status}`);
        console.log("[api] Background sync: completeTask completed");
      }).catch((c) => console.error("[api] Failed to sync completeTask:", c)), r;
    },
    async deleteTask(s, n = "main", r = !1) {
      await o.deleteTask(s, n, r), fetch(`/task/api/${s}`, {
        method: "DELETE",
        headers: j(t, e, a),
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
      }).then(() => console.log("[api] Background sync: batchMoveTasks completed")).catch((u) => console.error("[api] Failed to sync batchMoveTasks:", u)), c;
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
function st(t) {
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
function nt(t, e = 6, a = []) {
  const o = t.flatMap((n) => n.tag?.split(" ") || []).filter(Boolean), s = {};
  return o.forEach((n) => s[n] = (s[n] || 0) + 1), a.filter(Boolean).forEach((n) => {
    s[n] || (s[n] = 0);
  }), Object.entries(s).sort((n, r) => r[1] - n[1]).slice(0, e).map(([n]) => n);
}
function ye(t, e) {
  return t.filter((a) => a.tag?.split(" ").includes(e));
}
function ot(t, e, a) {
  const o = Array.isArray(a) && a.length > 0;
  return t.filter((s) => {
    const n = s.tag?.split(" ") || [];
    return o ? a.some((c) => n.includes(c)) && !e.some((c) => n.includes(c)) : !e.some((r) => n.includes(r));
  });
}
function le(t) {
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
function rt({ userType: t, userId: e, sessionId: a }) {
  const [o, s] = O([]), [n, r] = O(/* @__PURE__ */ new Set()), c = Ie(
    () => ge(t, e || "public", a),
    [t, e, a]
  ), [u, p] = O(null), [l, k] = O("main");
  async function D() {
    console.log("[useTasks] initialLoad called"), "syncFromApi" in c && await c.syncFromApi(), await w();
  }
  async function w() {
    console.log("[useTasks] reload called", { currentBoardId: l, stack: new Error().stack?.split(`
`).slice(1, 4).join(`
`) });
    const f = await c.getBoards();
    p(f);
    const { tasks: i } = se(f, l);
    s(i);
  }
  ee(() => {
    console.log("[useTasks] User context changed, clearing state and reloading", { userType: t, userId: e }), s([]), r(/* @__PURE__ */ new Set()), p(null), k("main"), w();
  }, [t, e]), ee(() => {
    console.log("[useTasks] Setting up BroadcastChannel listener", { currentBoardId: l, userType: t, userId: e });
    try {
      const f = new BroadcastChannel("tasks");
      return f.onmessage = (i) => {
        const d = i.data || {};
        if (console.log("[useTasks] BroadcastChannel message received", { msg: d, sessionId: U, currentBoardId: l, currentContext: { userType: t, userId: e } }), d.sessionId === U) {
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
        (d.type === "tasks-updated" || d.type === "boards-updated") && (console.log("[useTasks] BroadcastChannel: triggering reload for currentBoardId =", l), w());
      }, () => {
        console.log("[useTasks] Cleaning up BroadcastChannel listener", { currentBoardId: l }), f.close();
      };
    } catch (f) {
      console.error("[useTasks] Failed to setup BroadcastChannel", f);
    }
  }, [l, t, e]);
  async function _(f) {
    if (f = f.trim(), !!f)
      try {
        const i = st(f);
        return await c.createTask(i, l), await w(), !0;
      } catch (i) {
        return alert(i.message || "Failed to create task"), !1;
      }
  }
  async function F(f) {
    await we(
      `complete-${f}`,
      n,
      r,
      async () => {
        await c.completeTask(f, l), await w();
      },
      {
        onError: (i) => alert(i.message || "Failed to complete task")
      }
    );
  }
  async function $(f) {
    console.log("[useTasks] deleteTask START", { taskId: f, currentBoardId: l }), await we(
      `delete-${f}`,
      n,
      r,
      async () => {
        console.log("[useTasks] deleteTask: calling api.deleteTask", { taskId: f, currentBoardId: l }), await c.deleteTask(f, l), console.log("[useTasks] deleteTask: calling reload"), await w(), console.log("[useTasks] deleteTask END");
      },
      {
        onError: (i) => alert(i.message || "Failed to delete task")
      }
    );
  }
  async function P(f) {
    const i = prompt("Enter tag (without #):");
    if (!i) return;
    const d = i.trim().replace(/^#+/, "").replace(/\s+/g, "-"), T = o.find((g) => g.id === f);
    if (!T) return;
    const y = T.tag?.split(" ") || [];
    if (y.includes(d)) return;
    const b = [...y, d].join(" ");
    try {
      await c.patchTask(f, { tag: b }, l), await w();
    } catch (g) {
      alert(g.message || "Failed to add tag");
    }
  }
  async function M(f, i, d = {}) {
    const { suppressBroadcast: T = !1, skipReload: y = !1 } = d;
    try {
      await c.patchTask(f, i, l, T), y || await w();
    } catch (b) {
      throw b;
    }
  }
  async function H(f) {
    console.log("[useTasks] bulkUpdateTaskTags START", { count: f.length });
    try {
      await c.batchUpdateTags(
        l,
        f.map((i) => ({ taskId: i.taskId, tag: i.tag || null }))
      ), console.log("[useTasks] bulkUpdateTaskTags: calling reload"), await w(), console.log("[useTasks] bulkUpdateTaskTags END");
    } catch (i) {
      throw console.error("[useTasks] bulkUpdateTaskTags ERROR", i), i;
    }
  }
  async function K(f) {
    console.log("[useTasks] clearTasksByTag START", { tag: f, currentBoardId: l, taskCount: o.length });
    const i = o.filter((d) => d.tag?.split(" ").includes(f));
    if (console.log("[useTasks] clearTasksByTag: found tasks with tag", { tag: f, count: i.length }), i.length === 0) {
      console.log("[useTasks] clearTasksByTag: no tasks found with this tag, just deleting tag");
      try {
        await c.deleteTag(f, l), await w(), console.log("[useTasks] clearTasksByTag END (no tasks to clear)");
      } catch (d) {
        console.error("[useTasks] clearTasksByTag ERROR", d), console.error("[useTasks] clearTasksByTag: Please fix this error:", d.message);
      }
      return;
    }
    try {
      console.log("[useTasks] clearTasksByTag: starting batch clear"), await c.batchClearTag(
        l,
        f,
        i.map((d) => d.id)
      ), console.log("[useTasks] clearTasksByTag: calling reload"), await w(), console.log("[useTasks] clearTasksByTag END");
    } catch (d) {
      console.error("[useTasks] clearTasksByTag ERROR", d), alert(d.message || "Failed to remove tag from tasks");
    }
  }
  async function q(f) {
    if (confirm("Clear all remaining tasks?"))
      try {
        for (const i of f)
          await c.deleteTask(i.id, l);
        await w();
      } catch (i) {
        alert(i.message || "Failed to clear remaining tasks");
      }
  }
  async function E(f) {
    await c.createBoard(f), k(f);
    const i = await c.getBoards();
    p(i);
    const { tasks: d } = se(i, f);
    s(d);
  }
  async function Q(f, i) {
    if (console.log("[useTasks] moveTasksToBoard START", { targetBoardId: f, ids: i, currentBoardId: l }), !u) return;
    const d = /* @__PURE__ */ new Set();
    for (const T of u.boards)
      for (const y of T.tasks || [])
        i.includes(y.id) && d.add(T.id);
    console.log("[useTasks] moveTasksToBoard: source boards", { sourceBoardIds: Array.from(d) });
    try {
      if (d.size === 1) {
        const b = Array.from(d)[0];
        console.log("[useTasks] moveTasksToBoard: using batch API"), await c.batchMoveTasks(b, f, i);
      } else
        throw console.error("[useTasks] moveTasksToBoard: Cannot move tasks from multiple boards at once"), new Error("Cannot move tasks from multiple boards at once");
      console.log("[useTasks] moveTasksToBoard: switching to target board", { targetBoardId: f }), k(f);
      const T = await c.getBoards();
      p(T);
      const { tasks: y } = se(T, f);
      s(y), console.log("[useTasks] moveTasksToBoard END");
    } catch (T) {
      console.error("[useTasks] moveTasksToBoard ERROR", T), alert(T.message || "Failed to move tasks");
    }
  }
  async function J(f) {
    if (await c.deleteBoard(f), l === f) {
      k("main");
      const i = await c.getBoards();
      p(i);
      const { tasks: d } = se(i, "main");
      s(d);
    } else
      await w();
  }
  async function W(f) {
    await c.createTag(f, l), await w();
  }
  async function X(f) {
    await c.deleteTag(f, l), await w();
  }
  function G(f) {
    k(f);
    const { tasks: i, foundBoard: d } = se(u, f);
    d ? s(i) : w();
  }
  return {
    // Task state
    tasks: o,
    pendingOperations: n,
    // Task operations
    addTask: _,
    completeTask: F,
    deleteTask: $,
    addTagToTask: P,
    updateTaskTags: M,
    bulkUpdateTaskTags: H,
    clearTasksByTag: K,
    clearRemainingTasks: q,
    // Board state
    boards: u,
    currentBoardId: l,
    // Board operations
    createBoard: E,
    deleteBoard: J,
    switchBoard: G,
    moveTasksToBoard: Q,
    createTagOnBoard: W,
    deleteTagOnBoard: X,
    // Lifecycle
    initialLoad: D,
    reload: w
  };
}
function ct({ tasks: t, onTaskUpdate: e, onBulkUpdate: a }) {
  const [o, s] = O(null), [n, r] = O(null), [c, u] = O(/* @__PURE__ */ new Set()), [p, l] = O(!1), [k, D] = O(null), [w, _] = O(null), F = re(null);
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
  function P(i, d) {
    const T = c.has(d) && c.size > 0 ? Array.from(c) : [d];
    console.log("[useDragAndDrop] onDragStart", { taskId: d, idsToDrag: T, selectedCount: c.size }), i.dataTransfer.setData("text/plain", T[0]);
    try {
      i.dataTransfer.setData("application/x-hadoku-task-ids", JSON.stringify(T));
    } catch {
    }
    i.dataTransfer.effectAllowed = "copyMove";
    try {
      const y = i.currentTarget, b = y.closest && y.closest(".task-app__item") ? y.closest(".task-app__item") : y;
      b.classList.add("dragging");
      const g = b.cloneNode(!0);
      g.style.boxSizing = "border-box", g.style.width = `${b.offsetWidth}px`, g.style.height = `${b.offsetHeight}px`, g.style.opacity = "0.95", g.style.transform = "none", g.style.filter = "drop-shadow(0 6px 18px rgba(0,0,0,0.12))", g.classList.add("drag-image"), g.style.position = "absolute", g.style.top = "-9999px", g.style.left = "-9999px", document.body.appendChild(g), b.__dragImage = g, u((A) => {
        if (A.has(d)) return new Set(A);
        const v = new Set(A);
        return v.add(d), v;
      });
      try {
        const A = b.closest(".task-app__tag-column");
        if (A) {
          const v = A.querySelector(".task-app__tag-header") || A.querySelector("h3"), I = (v && v.textContent || "").trim().replace(/^#/, "");
          if (I)
            try {
              i.dataTransfer.setData("application/x-hadoku-task-source", I);
            } catch {
            }
        }
      } catch {
      }
      try {
        const A = b.getBoundingClientRect();
        let v = Math.round(i.clientX - A.left), N = Math.round(i.clientY - A.top);
        v = Math.max(0, Math.min(Math.round(g.offsetWidth - 1), v)), N = Math.max(0, Math.min(Math.round(g.offsetHeight - 1), N)), i.dataTransfer.setDragImage(g, v, N);
      } catch {
        i.dataTransfer.setDragImage(g, 0, 0);
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
  function H(i) {
    if (i.button === 0) {
      try {
        const d = i.target;
        if (!d || d.closest && d.closest(".task-app__item, .task-app__controls, button, input, textarea, .task-app__item-actions"))
          return;
      } catch {
      }
      l(!0), F.current = { x: i.clientX, y: i.clientY }, D({ x: i.clientX, y: i.clientY, w: 0, h: 0 }), u(/* @__PURE__ */ new Set());
      try {
        document.body.classList.add("marquee-selecting");
      } catch {
      }
    }
  }
  function K(i) {
    if (!p || !F.current) return;
    const d = F.current.x, T = F.current.y, y = i.clientX, b = i.clientY, g = Math.min(d, y), A = Math.min(T, b), v = Math.abs(y - d), N = Math.abs(b - T);
    D({ x: g, y: A, w: v, h: N });
    const I = Array.from(document.querySelectorAll(".task-app__item")), L = /* @__PURE__ */ new Set();
    for (const Y of I) {
      const te = Y.getBoundingClientRect();
      if (!(te.right < g || te.left > g + v || te.bottom < A || te.top > A + N)) {
        const ne = Y.getAttribute("data-task-id");
        ne && L.add(ne), Y.classList.add("selected");
      } else
        Y.classList.remove("selected");
    }
    u(L);
  }
  function q(i) {
    l(!1), D(null), F.current = null;
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
    u(/* @__PURE__ */ new Set()), Array.from(document.querySelectorAll(".task-app__item.selected")).forEach((d) => d.classList.remove("selected"));
  }
  ee(() => {
    function i(y) {
      if (y.button !== 0) return;
      const b = { target: y.target, clientX: y.clientX, clientY: y.clientY, button: y.button };
      try {
        H(b);
      } catch {
      }
    }
    function d(y) {
      const b = { clientX: y.clientX, clientY: y.clientY };
      try {
        K(b);
      } catch {
      }
    }
    function T(y) {
      const b = { clientX: y.clientX, clientY: y.clientY };
      try {
        q(b);
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
      const g = i.dataTransfer.getData("application/x-hadoku-task-source");
      g && (y = g);
    } catch {
    }
    console.log("[useDragAndDrop] onDrop: processing", { targetTag: d, ids: T, srcTag: y, taskCount: T.length });
    const b = [];
    for (const g of T) {
      const A = t.find((Y) => Y.id === g);
      if (!A) continue;
      const v = A.tag?.split(" ").filter(Boolean) || [];
      if (d === "other") {
        if (v.length === 0) continue;
        b.push({ taskId: g, tag: "" });
        continue;
      }
      const N = v.includes(d);
      let I = v.slice();
      N || I.push(d), y && y !== d && (I = I.filter((Y) => Y !== y));
      const L = I.join(" ").trim();
      b.push({ taskId: g, tag: L });
    }
    console.log("[useDragAndDrop] onDrop: updating tasks", { updateCount: b.length });
    try {
      await a(b), console.log("[useDragAndDrop] onDrop: updates complete, clearing selection");
      try {
        E();
      } catch {
      }
    } catch (g) {
      console.error("Failed to add tag to one or more tasks:", g), alert(g.message || "Failed to add tags");
    }
    console.log("[useDragAndDrop] onDrop END");
  }
  function X(i, d) {
    i.preventDefault(), i.dataTransfer.dropEffect = "copy", r(d);
  }
  function G(i) {
    i.currentTarget.contains(i.relatedTarget) || r(null);
  }
  async function f(i, d) {
    i.preventDefault(), r(null);
    const T = $(i);
    if (T.length === 0) return;
    console.log("[useDragAndDrop] onFilterDrop", { filterTag: d, ids: T, taskCount: T.length });
    const y = [];
    for (const b of T) {
      const g = t.find((N) => N.id === b);
      if (!g) continue;
      const A = g.tag?.split(" ").filter(Boolean) || [];
      if (A.includes(d)) {
        console.log(`Task ${b} already has tag: ${d}`);
        continue;
      }
      const v = [...A, d].join(" ");
      y.push({ taskId: b, tag: v });
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
    } catch (b) {
      console.error("Failed to add tag via filter drop:", b), alert(b.message || "Failed to add tag");
    }
  }
  return {
    dragOverTag: o,
    dragOverFilter: n,
    setDragOverFilter: r,
    selectedIds: c,
    isSelecting: p,
    marqueeRect: k,
    selectionJustEndedAt: w,
    // selection handlers
    selectionStartHandler: H,
    selectionMoveHandler: K,
    selectionEndHandler: q,
    clearSelection: E,
    onDragStart: P,
    onDragEnd: M,
    onDragOver: Q,
    onDragLeave: J,
    onDrop: W,
    onFilterDragOver: X,
    onFilterDragLeave: G,
    onFilterDrop: f
  };
}
function it() {
  const [t, e] = O({});
  function a(r) {
    e((c) => {
      const p = (c[r] || "desc") === "desc" ? "asc" : "desc";
      return { ...c, [r]: p };
    });
  }
  function o(r, c) {
    return [...r].sort((u, p) => {
      const l = new Date(u.createdAt).getTime(), k = new Date(p.createdAt).getTime();
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
function pe(t) {
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
function lt({
  board: t,
  isActive: e,
  isDragOver: a,
  onSwitch: o,
  onContextMenu: s,
  onDragOverFilter: n,
  onMoveTasksToBoard: r,
  onClearSelection: c
}) {
  const u = De({
    onLongPress: (l, k) => s(t.id, l, k)
  }), p = t.id === "main";
  return /* @__PURE__ */ h(
    "button",
    {
      className: `board-btn ${e ? "board-btn--active" : ""} ${a ? "board-btn--drag-over" : ""}`,
      onClick: () => o(t.id),
      onContextMenu: (l) => {
        l.preventDefault(), !p && s(t.id, l.clientX, l.clientY);
      },
      ...p ? {} : u,
      "aria-pressed": e ? "true" : "false",
      onDragOver: (l) => {
        l.preventDefault(), l.dataTransfer.dropEffect = "move", n(`board:${t.id}`);
      },
      onDragLeave: (l) => {
        n(null);
      },
      onDrop: async (l) => {
        l.preventDefault(), n(null);
        const k = pe(l.dataTransfer);
        if (k.length !== 0)
          try {
            await r(t.id, k);
            try {
              c();
            } catch {
            }
          } catch (D) {
            console.error("Failed moving tasks to board", D), alert(D.message || "Failed to move tasks");
          }
      },
      children: t.name
    }
  );
}
function dt({
  tag: t,
  isActive: e,
  isDragOver: a,
  onToggle: o,
  onContextMenu: s,
  onDragOver: n,
  onDragLeave: r,
  onDrop: c
}) {
  const u = De({
    onLongPress: (p, l) => s(t, p, l)
  });
  return /* @__PURE__ */ C(
    "button",
    {
      onClick: () => o(t),
      onContextMenu: (p) => {
        p.preventDefault(), s(t, p.clientX, p.clientY);
      },
      ...u,
      className: `${e ? "on" : ""} ${a ? "task-app__filter-drag-over" : ""}`,
      onDragOver: (p) => n(p, t),
      onDragLeave: r,
      onDrop: (p) => c(p, t),
      children: [
        "#",
        t
      ]
    }
  );
}
function ut(t) {
  const e = /* @__PURE__ */ new Date(), a = new Date(t), o = e.getTime() - a.getTime(), s = Math.floor(o / 1e3), n = Math.floor(s / 60), r = Math.floor(n / 60), c = Math.floor(r / 24);
  return s < 60 ? `${s}s ago` : n < 60 ? `${n}m ago` : r < 24 ? `${r}h ago` : `${c}d ago`;
}
function de({
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
  const p = a.has(`complete-${t.id}`), l = a.has(`delete-${t.id}`);
  return /* @__PURE__ */ C(
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
        /* @__PURE__ */ C("div", { className: "task-app__item-content", children: [
          /* @__PURE__ */ h("div", { className: "task-app__item-title", title: t.title, children: t.title }),
          /* @__PURE__ */ C("div", { className: "task-app__item-meta-row", children: [
            t.tag ? /* @__PURE__ */ h("div", { className: "task-app__item-tag", children: t.tag.split(" ").map((k) => `#${k}`).join(" ") }) : /* @__PURE__ */ h("div", {}),
            /* @__PURE__ */ h("div", { className: "task-app__item-age", children: ut(t.createdAt) })
          ] })
        ] }),
        /* @__PURE__ */ C("div", { className: "task-app__item-actions", children: [
          /* @__PURE__ */ h(
            "button",
            {
              className: "task-app__action-btn task-app__complete-btn",
              onClick: () => o(t.id),
              title: "Complete task",
              disabled: p || l,
              children: p ? "⏳" : "✓"
            }
          ),
          /* @__PURE__ */ h(
            "button",
            {
              className: "task-app__action-btn task-app__delete-btn",
              onClick: () => s(t.id),
              title: "Delete task",
              disabled: p || l,
              children: l ? "⏳" : "×"
            }
          )
        ] })
      ]
    }
  );
}
function ve(t) {
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
function gt({
  tasks: t,
  topTags: e,
  filters: a,
  sortDirections: o,
  dragOverTag: s,
  pendingOperations: n,
  onComplete: r,
  onDelete: c,
  onAddTag: u,
  onDragStart: p,
  onDragEnd: l,
  selectedIds: k,
  onSelectionStart: D,
  onSelectionMove: w,
  onSelectionEnd: _,
  onDragOver: F,
  onDragLeave: $,
  onDrop: P,
  toggleSort: M,
  sortTasksByAge: H,
  getSortIcon: K,
  getSortTitle: q,
  clearTasksByTag: E,
  clearRemainingTasks: Q,
  onDeletePersistedTag: J
}) {
  const W = (g, A) => /* @__PURE__ */ C(
    "div",
    {
      className: `task-app__tag-column ${s === g ? "task-app__tag-column--drag-over" : ""}`,
      onDragOver: (v) => F(v, g),
      onDragLeave: $,
      onDrop: (v) => P(v, g),
      children: [
        /* @__PURE__ */ C("div", { className: "task-app__tag-header-row", children: [
          /* @__PURE__ */ C("h3", { className: "task-app__tag-header", children: [
            "#",
            g
          ] }),
          /* @__PURE__ */ h(
            "button",
            {
              className: "task-app__sort-btn task-app__sort-btn--active",
              onClick: () => M(g),
              title: q(o[g] || "desc"),
              children: K(o[g] || "desc")
            }
          )
        ] }),
        /* @__PURE__ */ h("ul", { className: "task-app__list task-app__list--column", children: H(A, o[g] || "desc").map((v) => /* @__PURE__ */ h(
          de,
          {
            task: v,
            isDraggable: !0,
            pendingOperations: n,
            onComplete: r,
            onDelete: c,
            onAddTag: u,
            onDragStart: p,
            onDragEnd: l,
            selected: k ? k.has(v.id) : !1
          },
          v.id
        )) })
      ]
    },
    g
  ), X = (g, A) => {
    let v = ye(t, g);
    return f && (v = v.filter((N) => {
      const I = N.tag?.split(" ") || [];
      return a.some((L) => I.includes(L));
    })), v.slice(0, A);
  }, G = e.length, f = Array.isArray(a) && a.length > 0, i = t.filter((g) => {
    if (!f) return !0;
    const A = g.tag?.split(" ") || [];
    return a.some((v) => A.includes(v));
  }), d = ve(G), T = f ? e.filter((g) => ye(t, g).some((v) => {
    const N = v.tag?.split(" ") || [];
    return a.some((I) => N.includes(I));
  })) : e.slice(0, d.useTags);
  if (T.length === 0)
    return /* @__PURE__ */ h("ul", { className: "task-app__list", children: i.map((g) => /* @__PURE__ */ h(
      de,
      {
        task: g,
        pendingOperations: n,
        onComplete: r,
        onDelete: c,
        onAddTag: u,
        onDragStart: p,
        onDragEnd: l,
        selected: k ? k.has(g.id) : !1
      },
      g.id
    )) });
  const y = ot(t, e, a).filter((g) => {
    if (!f) return !0;
    const A = g.tag?.split(" ") || [];
    return a.some((v) => A.includes(v));
  }), b = ve(T.length);
  return /* @__PURE__ */ C("div", { className: "task-app__dynamic-layout", children: [
    b.rows.length > 0 && /* @__PURE__ */ h(Le, { children: b.rows.map((g, A) => /* @__PURE__ */ h("div", { className: `task-app__tag-grid task-app__tag-grid--${g.columns}col`, children: g.tagIndices.map((v) => {
      const N = T[v];
      return N ? W(N, X(N, b.maxPerColumn)) : null;
    }) }, A)) }),
    y.length > 0 && /* @__PURE__ */ C(
      "div",
      {
        className: `task-app__remaining ${s === "other" ? "task-app__tag-column--drag-over" : ""}`,
        onDragOver: (g) => {
          g.preventDefault(), g.dataTransfer.dropEffect = "move", F(g, "other");
        },
        onDragLeave: (g) => $(g),
        onDrop: (g) => P(g, "other"),
        children: [
          /* @__PURE__ */ C("div", { className: "task-app__tag-header-row", children: [
            /* @__PURE__ */ h("h3", { className: "task-app__remaining-header", children: "Other Tasks" }),
            /* @__PURE__ */ h(
              "button",
              {
                className: "task-app__sort-btn task-app__sort-btn--active",
                onClick: () => M("other"),
                title: q(o.other || "desc"),
                children: K(o.other || "desc")
              }
            )
          ] }),
          /* @__PURE__ */ h("ul", { className: "task-app__list", children: H(y, o.other || "desc").map((g) => /* @__PURE__ */ h(
            de,
            {
              task: g,
              pendingOperations: n,
              onComplete: r,
              onDelete: c,
              onAddTag: u,
              onDragStart: p,
              onDragEnd: l,
              selected: k ? k.has(g.id) : !1
            },
            g.id
          )) })
        ]
      }
    )
  ] });
}
function ue({
  isOpen: t,
  title: e,
  onClose: a,
  onConfirm: o,
  children: s,
  inputValue: n,
  onInputChange: r,
  inputPlaceholder: c,
  confirmLabel: u = "Confirm",
  cancelLabel: p = "Cancel",
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
          onClick: (w) => w.stopPropagation(),
          children: [
            /* @__PURE__ */ h("h3", { children: e }),
            s,
            r && /* @__PURE__ */ h(
              "input",
              {
                type: "text",
                className: "modal-input",
                value: n || "",
                onChange: (w) => r(w.target.value),
                placeholder: c,
                autoFocus: !0,
                onKeyDown: (w) => {
                  w.key === "Enter" && !l && (w.preventDefault(), o()), w.key === "Escape" && (w.preventDefault(), a());
                }
              }
            ),
            /* @__PURE__ */ C("div", { className: "modal-actions", children: [
              /* @__PURE__ */ h(
                "button",
                {
                  className: "modal-button",
                  onClick: a,
                  children: p
                }
              ),
              /* @__PURE__ */ h(
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
  return t ? /* @__PURE__ */ h(
    "div",
    {
      className: s,
      style: {
        left: `${e}px`,
        top: `${a}px`
      },
      children: o.map((n, r) => /* @__PURE__ */ h(
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
const Se = 5, Be = [
  { name: "light", emoji: "☀️", label: "Light theme" },
  { name: "dark", emoji: "🌙", label: "Dark theme" },
  { name: "strawberry", emoji: "🍓", label: "Strawberry theme" },
  { name: "ocean", emoji: "🌊", label: "Ocean theme" },
  { name: "cyberpunk", emoji: "🤖", label: "Cyberpunk theme" },
  { name: "coffee", emoji: "☕", label: "Coffee theme" },
  { name: "lavender", emoji: "🪻", label: "Lavender theme" }
], pt = (t) => Be.find((e) => e.name === t)?.emoji || "🌙";
function mt(t = {}) {
  const { userType: e = "public", userId: a = "public", sessionId: o } = t, [s, n] = O(/* @__PURE__ */ new Set()), [r, c] = O(null), [u, p] = O(!1), [l, k] = O(!1), [D, w] = O(null), [_, F] = O(""), [$, P] = O(null), [M, H] = O("light"), [K, q] = O(!1), [E, Q] = O(null), [J, W] = O(null), X = re(null), G = re(null), {
    tasks: f,
    pendingOperations: i,
    initialLoad: d,
    addTask: T,
    completeTask: y,
    deleteTask: b,
    addTagToTask: g,
    updateTaskTags: A,
    bulkUpdateTaskTags: v,
    clearTasksByTag: N,
    clearRemainingTasks: I,
    // board API
    boards: L,
    currentBoardId: Y,
    createBoard: te,
    deleteBoard: Te,
    switchBoard: ne,
    moveTasksToBoard: he,
    createTagOnBoard: Ae,
    deleteTagOnBoard: Ce
  } = rt({ userType: e, userId: a, sessionId: o }), S = ct({
    tasks: f,
    onTaskUpdate: A,
    onBulkUpdate: v
  }), ae = it();
  ee(() => {
    ge(e, a, o).getPreferences().then((B) => {
      B.theme && H(B.theme);
    });
  }, [e, a, o]), ee(() => {
    ge(e, a, o).savePreferences({ theme: M });
  }, [M, e, a, o]), ee(() => {
    console.log("[App] User context changed, initializing...", { userType: e, userId: a }), d(), X.current?.focus();
  }, [e, a]), ee(() => {
    G.current && G.current.setAttribute("data-theme", M);
  }, [M]), ee(() => {
    if (!K && !E && !J) return;
    const m = (B) => {
      const x = B.target;
      x.closest(".theme-picker") || q(!1), x.closest(".board-context-menu") || Q(null), x.closest(".tag-context-menu") || W(null);
    };
    return document.addEventListener("mousedown", m), () => document.removeEventListener("mousedown", m);
  }, [K, E, J]);
  async function _e(m) {
    await T(m) && X.current && (X.current.value = "", X.current.focus());
  }
  function xe(m) {
    const B = f.filter((x) => x.tag?.split(" ").includes(m));
    c({ tag: m, count: B.length });
  }
  async function Ne(m) {
    const B = m.trim().replace(/\s+/g, "-");
    try {
      if (await Ae(B), D?.type === "apply-tag" && D.taskIds.length > 0) {
        const x = D.taskIds.map((R) => {
          const Z = f.find((Me) => Me.id === R)?.tag?.split(" ").filter(Boolean) || [], Ee = [.../* @__PURE__ */ new Set([...Z, B])];
          return { taskId: R, tag: Ee.join(" ") };
        });
        await v(x), S.clearSelection();
      }
      w(null);
    } catch (x) {
      throw console.error("[App] Failed to create tag:", x), x;
    }
  }
  function ie(m) {
    const B = m.trim();
    return B ? (L?.boards?.map((R) => R.id.toLowerCase()) || []).includes(B.toLowerCase()) ? `Board "${B}" already exists` : null : "Board name cannot be empty";
  }
  async function Oe(m) {
    const B = m.trim(), x = ie(B);
    if (x) {
      P(x);
      return;
    }
    try {
      await te(B), D?.type === "move-to-board" && D.taskIds.length > 0 && (await he(B, D.taskIds), S.clearSelection()), w(null), P(null);
    } catch (R) {
      console.error("[App] Failed to create board:", R), P(R.message || "Failed to create board");
    }
  }
  const $e = L?.boards?.find((m) => m.id === Y)?.tags || [], Fe = nt(f, 6);
  return /* @__PURE__ */ h(
    "div",
    {
      ref: G,
      className: "task-app-container",
      onMouseDown: S.selectionStartHandler,
      onMouseMove: S.selectionMoveHandler,
      onMouseUp: S.selectionEndHandler,
      onMouseLeave: S.selectionEndHandler,
      onClick: (m) => {
        try {
          const B = m.target;
          if (!B.closest || !B.closest(".task-app__item")) {
            if (S.selectionJustEndedAt && Date.now() - S.selectionJustEndedAt < 300)
              return;
            S.clearSelection();
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
                onClick: () => q(!K),
                "aria-label": "Choose theme",
                title: "Choose theme",
                children: pt(M)
              }
            ),
            K && /* @__PURE__ */ h("div", { className: "theme-picker__dropdown", children: Be.map(({ name: m, emoji: B, label: x }) => /* @__PURE__ */ h(
              "button",
              {
                className: `theme-picker__option ${M === m ? "active" : ""}`,
                onClick: () => {
                  H(m), q(!1);
                },
                title: x,
                children: B
              },
              m
            )) })
          ] })
        ] }),
        /* @__PURE__ */ C("div", { className: "task-app__boards", children: [
          /* @__PURE__ */ h("div", { className: "task-app__board-list", children: (L && L.boards ? L.boards.slice(0, Se) : [{ id: "main", name: "main", tasks: [], tags: [] }]).map((m) => /* @__PURE__ */ h(
            lt,
            {
              board: m,
              isActive: Y === m.id,
              isDragOver: S.dragOverFilter === `board:${m.id}`,
              onSwitch: ne,
              onContextMenu: (B, x, R) => Q({ boardId: B, x, y: R }),
              onDragOverFilter: S.setDragOverFilter,
              onMoveTasksToBoard: he,
              onClearSelection: S.clearSelection
            },
            m.id
          )) }),
          /* @__PURE__ */ C("div", { className: "task-app__board-actions", children: [
            (!L || L.boards && L.boards.length < Se) && /* @__PURE__ */ h(
              "button",
              {
                className: `board-add-btn ${S.dragOverFilter === "add-board" ? "board-btn--drag-over" : ""}`,
                onClick: () => {
                  F(""), P(null), p(!0);
                },
                onDragOver: (m) => {
                  m.preventDefault(), m.dataTransfer.dropEffect = "move", S.setDragOverFilter("add-board");
                },
                onDragLeave: (m) => {
                  S.setDragOverFilter(null);
                },
                onDrop: async (m) => {
                  m.preventDefault(), S.setDragOverFilter(null);
                  const B = pe(m.dataTransfer);
                  B.length > 0 && (F(""), w({ type: "move-to-board", taskIds: B }), p(!0));
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
              m.key === "Enter" && !m.shiftKey && (m.preventDefault(), _e(m.target.value)), m.key === "k" && (m.ctrlKey || m.metaKey) && (m.preventDefault(), X.current?.focus());
            }
          }
        ) }),
        /* @__PURE__ */ C("div", { className: "task-app__filters", children: [
          (() => {
            const m = le(f);
            return Array.from(/* @__PURE__ */ new Set([...$e, ...m])).map((x) => /* @__PURE__ */ h(
              dt,
              {
                tag: x,
                isActive: s.has(x),
                isDragOver: S.dragOverFilter === x,
                onToggle: (R) => {
                  n((oe) => {
                    const Z = new Set(oe);
                    return Z.has(R) ? Z.delete(R) : Z.add(R), Z;
                  });
                },
                onContextMenu: (R, oe, Z) => W({ tag: R, x: oe, y: Z }),
                onDragOver: S.onFilterDragOver,
                onDragLeave: S.onFilterDragLeave,
                onDrop: S.onFilterDrop
              },
              x
            ));
          })(),
          /* @__PURE__ */ h(
            "button",
            {
              className: `task-app__filter-add ${S.dragOverFilter === "add-tag" ? "task-app__filter-drag-over" : ""}`,
              onClick: () => {
                F(""), k(!0);
              },
              onDragOver: (m) => {
                m.preventDefault(), m.dataTransfer.dropEffect = "copy", S.onFilterDragOver(m, "add-tag");
              },
              onDragLeave: S.onFilterDragLeave,
              onDrop: async (m) => {
                m.preventDefault(), S.onFilterDragLeave(m);
                const B = pe(m.dataTransfer);
                B.length > 0 && (F(""), w({ type: "apply-tag", taskIds: B }), k(!0));
              },
              "aria-label": "Add tag",
              children: "＋"
            }
          )
        ] }),
        /* @__PURE__ */ h(
          gt,
          {
            tasks: f,
            topTags: Fe,
            filters: Array.from(s),
            selectedIds: S.selectedIds,
            onSelectionStart: S.selectionStartHandler,
            onSelectionMove: S.selectionMoveHandler,
            onSelectionEnd: S.selectionEndHandler,
            sortDirections: ae.sortDirections,
            dragOverTag: S.dragOverTag,
            pendingOperations: i,
            onComplete: y,
            onDelete: b,
            onAddTag: g,
            onDragStart: S.onDragStart,
            onDragEnd: S.onDragEnd,
            onDragOver: S.onDragOver,
            onDragLeave: S.onDragLeave,
            onDrop: S.onDrop,
            toggleSort: ae.toggleSort,
            sortTasksByAge: ae.sortTasksByAge,
            getSortIcon: ae.getSortIcon,
            getSortTitle: ae.getSortTitle,
            clearTasksByTag: xe,
            clearRemainingTasks: I,
            onDeletePersistedTag: Ce
          }
        ),
        S.isSelecting && S.marqueeRect && /* @__PURE__ */ h(
          "div",
          {
            className: "marquee-overlay",
            style: {
              left: `${S.marqueeRect.x}px`,
              top: `${S.marqueeRect.y}px`,
              width: `${S.marqueeRect.w}px`,
              height: `${S.marqueeRect.h}px`
            }
          }
        ),
        /* @__PURE__ */ h(
          ue,
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
          ue,
          {
            isOpen: u,
            title: "Create New Board",
            onClose: () => {
              p(!1), w(null), P(null);
            },
            onConfirm: async () => {
              if (!_.trim()) return;
              const m = ie(_);
              if (m) {
                P(m);
                return;
              }
              p(!1), await Oe(_);
            },
            inputValue: _,
            onInputChange: (m) => {
              F(m), P(null);
            },
            inputPlaceholder: "Board name",
            confirmLabel: "Create",
            confirmDisabled: !_.trim() || ie(_) !== null,
            children: [
              D?.type === "move-to-board" && D.taskIds.length > 0 && /* @__PURE__ */ C("p", { className: "modal-hint", children: [
                D.taskIds.length,
                " task",
                D.taskIds.length > 1 ? "s" : "",
                " will be moved to this board"
              ] }),
              $ && /* @__PURE__ */ h("p", { className: "modal-error", style: { color: "var(--error-color, #d32f2f)", marginTop: "0.5rem" }, children: $ })
            ]
          }
        ),
        /* @__PURE__ */ C(
          ue,
          {
            isOpen: l,
            title: "Create New Tag",
            onClose: () => {
              k(!1), w(null);
            },
            onConfirm: async () => {
              if (_.trim()) {
                k(!1);
                try {
                  await Ne(_);
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
              D?.type === "apply-tag" && D.taskIds.length > 0 && /* @__PURE__ */ C("p", { className: "modal-hint", children: [
                "This tag will be applied to ",
                D.taskIds.length,
                " task",
                D.taskIds.length > 1 ? "s" : ""
              ] }),
              le(f).length > 0 && /* @__PURE__ */ C("div", { className: "modal-section", children: [
                /* @__PURE__ */ h("label", { className: "modal-label", children: "Existing tags:" }),
                /* @__PURE__ */ h("div", { className: "modal-tags-list", children: le(f).map((m) => /* @__PURE__ */ C("span", { className: "modal-tag-chip", children: [
                  "#",
                  m
                ] }, m)) })
              ] })
            ]
          }
        ),
        /* @__PURE__ */ h(
          be,
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
                  const m = L?.boards?.find((B) => B.id === E.boardId)?.name || E.boardId;
                  if (confirm(`Delete board "${m}"? All tasks on this board will be permanently deleted.`))
                    try {
                      await Te(E.boardId), Q(null);
                    } catch (B) {
                      console.error("[App] Failed to delete board:", B), alert(B.message || "Failed to delete board");
                    }
                }
              }
            ]
          }
        ),
        /* @__PURE__ */ h(
          be,
          {
            isOpen: !!J,
            x: J?.x || 0,
            y: J?.y || 0,
            className: "tag-context-menu",
            items: [
              {
                label: "🗑️ Delete Tag",
                isDanger: !0,
                onClick: async () => {
                  if (console.log("[App] Delete Tag clicked!", { tagContextMenu: J }), !J) {
                    console.error("[App] No tagContextMenu when Delete Tag clicked!");
                    return;
                  }
                  try {
                    console.log("[App] Calling clearTasksByTag for tag:", J.tag), await N(J.tag), console.log("[App] clearTasksByTag completed successfully"), W(null);
                  } catch (m) {
                    console.error("[App] Failed to delete tag:", m), alert(m.message || "Failed to delete tag");
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
function yt(t, e = {}) {
  const a = new URLSearchParams(window.location.search), o = e.userType || a.get("userType") || "public", s = e.userId || a.get("userId") || "public", n = e.sessionId, r = { ...e, userType: o, userId: s, sessionId: n }, c = Pe(t);
  c.render(/* @__PURE__ */ h(mt, { ...r })), t.__root = c, console.log("[task-app] Mounted successfully", r);
}
function wt(t) {
  t.__root?.unmount();
}
export {
  yt as mount,
  wt as unmount
};
