import { jsx as y, jsxs as _, Fragment as Le } from "react/jsx-runtime";
import { createRoot as Pe } from "react-dom/client";
import { useState as N, useMemo as Re, useEffect as Q, useRef as oe } from "react";
const J = `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
class Je {
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
function Z() {
  return (/* @__PURE__ */ new Date()).toISOString();
}
function fe(t, e) {
  const a = t.tasks.findIndex((o) => o.id === e);
  if (a < 0)
    throw new Error("Task not found");
  return { task: t.tasks[a], index: a };
}
function pe(t, e) {
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
function Ie(t, e, a) {
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
function Ke(t, e, a) {
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
      const n = await t.getTasks(e.userType, e.userId, s.id), c = await t.getStats(e.userType, e.userId, s.id);
      return {
        ...s,
        tasks: n.tasks,
        stats: c
      };
    })
  );
  return {
    ...a,
    boards: o
  };
}
async function qe(t, e, a, o = "main") {
  const s = Z(), n = await t.getTasks(e.userType, e.userId, o), c = await t.getStats(e.userType, e.userId, o), r = a.id || Ue(), u = a.createdAt || s, m = {
    id: r,
    title: a.title,
    tag: a.tag ?? null,
    state: "Active",
    createdAt: u
  }, d = {
    ...n,
    tasks: [m, ...n.tasks],
    updatedAt: s
  }, h = je(c, m, s);
  return await t.saveTasks(e.userType, e.userId, o, d), await t.saveStats(e.userType, e.userId, o, h), { ok: !0, id: r };
}
async function Ye(t, e, a, o, s = "main") {
  const n = Z(), c = await t.getTasks(e.userType, e.userId, s), r = await t.getStats(e.userType, e.userId, s), { task: u, index: m } = fe(c, a), d = {
    ...u,
    ...o,
    updatedAt: n
  }, h = [...c.tasks];
  h[m] = d;
  const D = {
    ...c,
    tasks: h,
    updatedAt: n
  }, S = Ke(r, d, n);
  return await t.saveTasks(e.userType, e.userId, s, D), await t.saveStats(e.userType, e.userId, s, S), { ok: !0, message: `Task ${a} updated` };
}
async function ze(t, e, a, o = "main") {
  const s = Z(), n = await t.getTasks(e.userType, e.userId, o), c = await t.getStats(e.userType, e.userId, o), { task: r, index: u } = fe(n, a), m = {
    ...r,
    state: "Completed",
    closedAt: s,
    updatedAt: s
  }, d = [...n.tasks];
  d.splice(u, 1);
  const h = {
    ...n,
    tasks: d,
    updatedAt: s
  }, D = Ie(c, m, s);
  return await t.saveTasks(e.userType, e.userId, o, h), await t.saveStats(e.userType, e.userId, o, D), { ok: !0, message: `Task ${a} completed` };
}
async function Ve(t, e, a, o = "main") {
  const s = Z(), n = await t.getTasks(e.userType, e.userId, o), c = await t.getStats(e.userType, e.userId, o), { task: r, index: u } = fe(n, a), m = {
    ...r,
    state: "Deleted",
    closedAt: s,
    updatedAt: s
  }, d = [...n.tasks];
  d.splice(u, 1);
  const h = {
    ...n,
    tasks: d,
    updatedAt: s
  }, D = He(c, m, s);
  return await t.saveTasks(e.userType, e.userId, o, h), await t.saveStats(e.userType, e.userId, o, D), { ok: !0, message: `Task ${a} deleted` };
}
async function We(t, e, a) {
  const o = Z(), s = await t.getBoards(e.userType, e.userId);
  if (s.boards.find((r) => r.id === a.id))
    throw new Error(`Board ${a.id} already exists`);
  const n = {
    id: a.id,
    name: a.name,
    tasks: [],
    tags: []
  }, c = {
    ...s,
    updatedAt: o,
    boards: [...s.boards, n]
  };
  return await t.saveBoards(e.userType, c, e.userId), { ok: !0, board: n };
}
async function Ge(t, e, a) {
  if (a === "main")
    throw new Error("Cannot delete the main board");
  const o = Z(), s = await t.getBoards(e.userType, e.userId);
  pe(s, a);
  const n = {
    ...s,
    updatedAt: o,
    boards: s.boards.filter((c) => c.id !== a)
  };
  return await t.saveBoards(e.userType, n, e.userId), { ok: !0, message: `Board ${a} deleted` };
}
async function Qe(t, e, a) {
  const o = Z(), s = await t.getBoards(e.userType, e.userId), { board: n, index: c } = pe(s, a.boardId), r = n.tags || [];
  if (r.includes(a.tag))
    return { ok: !0, message: `Tag ${a.tag} already exists` };
  const u = {
    ...n,
    tags: [...r, a.tag]
  }, m = Se(s, c, u, o);
  return await t.saveBoards(e.userType, m, e.userId), { ok: !0, message: `Tag ${a.tag} added to board ${a.boardId}` };
}
async function Ze(t, e, a) {
  const o = Z(), s = await t.getBoards(e.userType, e.userId), { board: n, index: c } = pe(s, a.boardId), r = n.tags || [], u = {
    ...n,
    tags: r.filter((d) => d !== a.tag)
  }, m = Se(s, c, u, o);
  return await t.saveBoards(e.userType, m, e.userId), { ok: !0, message: `Tag ${a.tag} removed from board ${a.boardId}` };
}
function V(t, e, a = 50) {
  setTimeout(() => {
    try {
      const o = new BroadcastChannel("tasks");
      o.postMessage({ type: t, ...e }), o.close();
    } catch (o) {
      console.error("[localStorageApi] Broadcast failed:", o);
    }
  }, a);
}
function et(t = "public", e = "public") {
  const a = new Je(t, e), o = { userType: "registered", userId: e };
  return {
    async getBoards() {
      const s = await Xe(a, o), n = {
        version: s.version,
        updatedAt: s.updatedAt,
        boards: []
      };
      for (const c of s.boards) {
        const r = await a.getTasks(t, e, c.id), u = await a.getStats(t, e, c.id);
        n.boards.push({
          id: c.id,
          name: c.name,
          tasks: r.tasks,
          stats: u,
          tags: c.tags || []
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
      }), V("boards-updated", { sessionId: J, userType: t, userId: e }), n.board;
    },
    async deleteBoard(s) {
      await Ge(
        a,
        o,
        s
      ), await a.deleteBoardData(t, e, s), V("boards-updated", { sessionId: J, userType: t, userId: e });
    },
    async getTasks(s = "main") {
      return a.getTasks(t, e, s);
    },
    async getStats(s = "main") {
      return a.getStats(t, e, s);
    },
    async createTask(s, n = "main", c = !1) {
      console.log("[localStorageApi] createTask (using handler)", { data: s, boardId: n, suppressBroadcast: c });
      const r = await qe(
        a,
        o,
        s,
        n
      ), m = (await a.getTasks(t, e, n)).tasks.find((d) => d.id === r.id);
      if (!m)
        throw new Error("Task creation failed - task not found after creation");
      return c ? console.log("[localStorageApi] createTask: broadcast suppressed") : (console.log("[localStorageApi] createTask: broadcasting", {
        sessionId: J,
        boardId: n,
        taskId: r.id
      }), V("tasks-updated", { sessionId: J, userType: t, userId: e, boardId: n })), m;
    },
    async patchTask(s, n, c = "main", r = !1) {
      const u = {};
      n.title !== void 0 && (u.title = n.title), n.tag !== void 0 && n.tag !== null && (u.tag = n.tag), await Ye(
        a,
        o,
        s,
        u,
        c
      ), r || V("tasks-updated", { sessionId: J, userType: t, userId: e, boardId: c });
      const d = (await a.getTasks(t, e, c)).tasks.find((h) => h.id === s);
      if (!d)
        throw new Error("Task not found after update");
      return d;
    },
    async completeTask(s, n = "main") {
      const r = (await a.getTasks(t, e, n)).tasks.find((u) => u.id === s);
      if (!r)
        throw new Error("Task not found");
      return await ze(
        a,
        o,
        s,
        n
      ), V("tasks-updated", { sessionId: J, userType: t, userId: e, boardId: n }), {
        ...r,
        state: "Completed",
        closedAt: (/* @__PURE__ */ new Date()).toISOString(),
        updatedAt: (/* @__PURE__ */ new Date()).toISOString()
      };
    },
    async deleteTask(s, n = "main", c = !1) {
      console.log("[localStorageApi] deleteTask (using handler)", { id: s, boardId: n, suppressBroadcast: c });
      const u = (await a.getTasks(t, e, n)).tasks.find((m) => m.id === s);
      if (!u)
        throw new Error("Task not found");
      return await Ve(
        a,
        o,
        s,
        n
      ), c ? console.log("[localStorageApi] deleteTask: broadcast suppressed") : (console.log("[localStorageApi] deleteTask: broadcasting", { sessionId: J }), V("tasks-updated", { sessionId: J, userType: t, userId: e, boardId: n })), {
        ...u,
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
      ), V("boards-updated", { sessionId: J, userType: t, userId: e, boardId: n });
    },
    async deleteTag(s, n = "main") {
      await Ze(
        a,
        o,
        { boardId: n, tag: s }
      ), V("boards-updated", { sessionId: J, userType: t, userId: e, boardId: n });
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
      const n = `${t}-${e}-preferences`, r = {
        ...await this.getPreferences(),
        ...s,
        updatedAt: (/* @__PURE__ */ new Date()).toISOString()
      };
      localStorage.setItem(n, JSON.stringify(r));
    },
    // Batch operations
    async batchMoveTasks(s, n, c) {
      const r = await this.getBoards(), u = r.boards.find((x) => x.id === s), m = r.boards.find((x) => x.id === n);
      if (!u)
        throw new Error(`Source board ${s} not found`);
      if (!m)
        throw new Error(`Target board ${n} not found`);
      const d = u.tasks.filter((x) => c.includes(x.id));
      u.tasks = u.tasks.filter((x) => !c.includes(x.id)), m.tasks = [...m.tasks, ...d], r.updatedAt = (/* @__PURE__ */ new Date()).toISOString();
      const h = `${t}-${e}-boards`;
      localStorage.setItem(h, JSON.stringify(r));
      const D = `${t}-${e}-${s}-tasks`, S = `${t}-${e}-${n}-tasks`;
      return localStorage.setItem(D, JSON.stringify({
        version: 1,
        updatedAt: r.updatedAt,
        tasks: u.tasks
      })), localStorage.setItem(S, JSON.stringify({
        version: 1,
        updatedAt: r.updatedAt,
        tasks: m.tasks
      })), V("boards-updated", { sessionId: J, userType: t, userId: e }), { ok: !0, moved: d.length };
    }
  };
}
async function tt(t, e, a, o) {
  for (const c of e.boards || []) {
    const r = c.id;
    if (c.tasks && c.tasks.length > 0) {
      const u = `${a}-${o}-${r}-tasks`, m = {
        version: 1,
        updatedAt: e.updatedAt || (/* @__PURE__ */ new Date()).toISOString(),
        tasks: c.tasks
      };
      window.localStorage.setItem(u, JSON.stringify(m));
    }
    if (c.stats) {
      const u = `${a}-${o}-${r}-stats`;
      window.localStorage.setItem(u, JSON.stringify(c.stats));
    }
  }
  const s = `${a}-${o}-boards`, n = {
    version: 1,
    updatedAt: e.updatedAt || (/* @__PURE__ */ new Date()).toISOString(),
    boards: (e.boards || []).map((c) => ({
      id: c.id,
      name: c.name,
      tags: c.tags || []
    }))
  };
  window.localStorage.setItem(s, JSON.stringify(n)), console.log("[api] Synced API data to localStorage:", {
    boards: e.boards?.length || 0,
    totalTasks: e.boards?.reduce((c, r) => c + (r.tasks?.length || 0), 0) || 0
  });
}
function j(t, e, a) {
  const o = {
    "Content-Type": "application/json",
    "X-User-Type": t
  };
  return e && (o["X-User-Id"] = e), a && (o["X-Session-Id"] = a), o;
}
function ue(t = "public", e = "public", a) {
  const o = et(t, e);
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
        console.log("[api] Synced from API:", { boards: n.boards.length, totalTasks: n.boards.reduce((c, r) => c + (r.tasks?.length || 0), 0) }), await tt(o, n, t, e);
      } catch (s) {
        console.error("[api] Sync from API failed:", s);
      }
    },
    async createTask(s, n = "main", c = !1) {
      const r = await o.createTask(s, n, c);
      return fetch("/task/api", {
        method: "POST",
        headers: j(t, e, a),
        body: JSON.stringify({
          id: s.id || r.id,
          // Use provided ID (for moves) or client-generated ID
          ...s,
          boardId: n
        })
      }).then((u) => u.json()).then((u) => {
        u.ok && (u.id === r.id ? console.log("[api] Background sync: createTask completed (ID matched)") : console.warn("[api] Server returned different ID (unexpected):", { client: r.id, server: u.id }));
      }).catch((u) => console.error("[api] Failed to sync createTask:", u)), r;
    },
    async createTag(s, n = "main") {
      const c = await o.createTag(s, n);
      return fetch("/task/api/tags", {
        method: "POST",
        headers: j(t, e, a),
        body: JSON.stringify({ boardId: n, tag: s })
      }).then(() => console.log("[api] Background sync: createTag completed")).catch((r) => console.error("[api] Failed to sync createTag:", r)), c;
    },
    async deleteTag(s, n = "main") {
      const c = await o.deleteTag(s, n);
      return fetch("/task/api/tags", {
        method: "DELETE",
        headers: j(t, e, a),
        body: JSON.stringify({ boardId: n, tag: s })
      }).then(() => console.log("[api] Background sync: deleteTag completed")).catch((r) => console.error("[api] Failed to sync deleteTag:", r)), c;
    },
    async patchTask(s, n, c = "main", r = !1) {
      const u = await o.patchTask(s, n, c, r);
      return fetch(`/task/api/${s}`, {
        method: "PATCH",
        headers: j(t, e, a),
        body: JSON.stringify({ ...n, boardId: c })
      }).then(() => console.log("[api] Background sync: patchTask completed")).catch((m) => console.error("[api] Failed to sync patchTask:", m)), u;
    },
    async completeTask(s, n = "main") {
      const c = await o.completeTask(s, n);
      return fetch(`/task/api/${s}/complete`, {
        method: "POST",
        headers: j(t, e, a),
        body: JSON.stringify({ boardId: n })
      }).then(() => console.log("[api] Background sync: completeTask completed")).catch((r) => console.error("[api] Failed to sync completeTask:", r)), c;
    },
    async deleteTask(s, n = "main", c = !1) {
      await o.deleteTask(s, n, c), fetch(`/task/api/${s}`, {
        method: "DELETE",
        headers: j(t, e, a),
        body: JSON.stringify({ boardId: n })
      }).then(() => console.log("[api] Background sync: deleteTask completed")).catch((r) => console.error("[api] Failed to sync deleteTask:", r));
    },
    // Board operations
    async createBoard(s) {
      const n = await o.createBoard(s);
      return fetch("/task/api/boards", {
        method: "POST",
        headers: j(t, e, a),
        body: JSON.stringify({ id: s, name: s })
      }).then(() => console.log("[api] Background sync: createBoard completed")).catch((c) => console.error("[api] Failed to sync createBoard:", c)), n;
    },
    async deleteBoard(s) {
      const n = await o.deleteBoard(s);
      return fetch(`/task/api/boards/${encodeURIComponent(s)}`, {
        method: "DELETE",
        headers: j(t, e, a)
      }).then(() => console.log("[api] Background sync: deleteBoard completed")).catch((c) => console.error("[api] Failed to sync deleteBoard:", c)), n;
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
      for (const c of n)
        await o.patchTask(c.taskId, { tag: c.tag || void 0 }, s, !0);
      fetch("/task/api/batch-tag", {
        method: "PATCH",
        headers: j(t, e, a),
        body: JSON.stringify({ boardId: s, updates: n })
      }).then(() => console.log("[api] Background sync: batchUpdateTags completed")).catch((c) => console.error("[api] Failed to sync batchUpdateTags:", c));
    },
    async batchMoveTasks(s, n, c) {
      const r = await o.batchMoveTasks(s, n, c);
      return fetch("/task/api/batch-move", {
        method: "POST",
        headers: j(t, e, a),
        body: JSON.stringify({ sourceBoardId: s, targetBoardId: n, taskIds: c })
      }).then(() => console.log("[api] Background sync: batchMoveTasks completed")).catch((u) => console.error("[api] Failed to sync batchMoveTasks:", u)), r;
    },
    async batchClearTag(s, n, c) {
      for (const r of c) {
        const u = await o.getBoards().then((m) => m.boards.find((h) => h.id === s)?.tasks?.find((h) => h.id === r));
        if (u?.tag) {
          const d = u.tag.split(" ").filter(Boolean).filter((h) => h !== n);
          await o.patchTask(
            r,
            { tag: d.length > 0 ? d.join(" ") : void 0 },
            s,
            !0
          );
        }
      }
      await o.deleteTag(n, s), fetch("/task/api/batch-clear-tag", {
        method: "POST",
        headers: j(t, e, a),
        body: JSON.stringify({ boardId: s, tag: n, taskIds: c })
      }).then(() => console.log("[api] Background sync: batchClearTag completed")).catch((r) => console.error("[api] Failed to sync batchClearTag:", r));
    }
  };
}
function at(t) {
  t = t.trim();
  const e = (s) => s.trim().replace(/\s+/g, "-"), a = t.match(/^["']([^"']+)["']\s*(.*)$/);
  if (a) {
    const s = a[1].trim(), c = a[2].match(/#[^\s#]+/g)?.map((r) => e(r.slice(1))).filter(Boolean) || [];
    return { title: s, tag: c.length ? c.join(" ") : void 0 };
  }
  const o = t.match(/^(.+?)\s+(#.+)$/);
  if (o) {
    const s = o[1].trim(), c = o[2].match(/#[^\s#]+/g)?.map((r) => e(r.slice(1))).filter(Boolean) || [];
    return { title: s, tag: c.length ? c.join(" ") : void 0 };
  }
  return { title: t.trim() };
}
function st(t, e = 6, a = []) {
  const o = t.flatMap((n) => n.tag?.split(" ") || []).filter(Boolean), s = {};
  return o.forEach((n) => s[n] = (s[n] || 0) + 1), a.filter(Boolean).forEach((n) => {
    s[n] || (s[n] = 0);
  }), Object.entries(s).sort((n, c) => c[1] - n[1]).slice(0, e).map(([n]) => n);
}
function he(t, e) {
  return t.filter((a) => a.tag?.split(" ").includes(e));
}
function nt(t, e, a) {
  const o = Array.isArray(a) && a.length > 0;
  return t.filter((s) => {
    const n = s.tag?.split(" ") || [];
    return o ? a.some((r) => n.includes(r)) && !e.some((r) => n.includes(r)) : !e.some((c) => n.includes(c));
  });
}
function ce(t) {
  return Array.from(new Set(t.flatMap((e) => e.tag?.split(" ") || []).filter(Boolean)));
}
function ot(t, e, a, o = 50) {
  setTimeout(() => {
    try {
      const s = new BroadcastChannel("tasks");
      s.postMessage({ type: "tasks-updated", sessionId: t, userType: e, userId: a }), s.close();
    } catch (s) {
      console.error("[useTasks] Broadcast failed:", s);
    }
  }, o);
}
async function Te(t, e, a, o, s = {}) {
  const { onError: n, suppress404: c = !0 } = s;
  if (e.has(t)) {
    console.log(`[withPendingOperation] Operation already pending: ${t}`);
    return;
  }
  a((r) => /* @__PURE__ */ new Set([...r, t]));
  try {
    return await o();
  } catch (r) {
    c && r?.message?.includes("404") || (n ? n(r) : console.error(`[withPendingOperation] Error in ${t}:`, r));
    return;
  } finally {
    a((r) => {
      const u = new Set(r);
      return u.delete(t), u;
    });
  }
}
async function ie(t, e, a) {
  await t(), console.log("[withBulkOperation] Broadcasting bulk update with delay"), ot(J, e, a);
}
function ae(t, e) {
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
  const [o, s] = N([]), [n, c] = N(/* @__PURE__ */ new Set()), r = Re(
    () => ue(t, e || "public", a),
    [t, e, a]
  ), [u, m] = N(null), [d, h] = N("main");
  async function D() {
    console.log("[useTasks] initialLoad called"), "syncFromApi" in r && await r.syncFromApi(), await S();
  }
  async function S() {
    console.log("[useTasks] reload called", { currentBoardId: d, stack: new Error().stack?.split(`
`).slice(1, 4).join(`
`) });
    const i = await r.getBoards();
    m(i);
    const { tasks: l } = ae(i, d);
    s(l);
  }
  Q(() => {
    console.log("[useTasks] User context changed, clearing state and reloading", { userType: t, userId: e }), s([]), c(/* @__PURE__ */ new Set()), m(null), h("main"), S();
  }, [t, e]), Q(() => {
    console.log("[useTasks] Setting up BroadcastChannel listener", { currentBoardId: d, userType: t, userId: e });
    try {
      const i = new BroadcastChannel("tasks");
      return i.onmessage = (l) => {
        const f = l.data || {};
        if (console.log("[useTasks] BroadcastChannel message received", { msg: f, sessionId: J, currentBoardId: d, currentContext: { userType: t, userId: e } }), f.sessionId === J) {
          console.log("[useTasks] Ignoring own broadcast message");
          return;
        }
        if (f.userType !== t || f.userId !== e) {
          console.log("[useTasks] Ignoring message for different user context", {
            msgContext: { userType: f.userType, userId: f.userId },
            currentContext: { userType: t, userId: e }
          });
          return;
        }
        (f.type === "tasks-updated" || f.type === "boards-updated") && (console.log("[useTasks] BroadcastChannel: triggering reload for currentBoardId =", d), S());
      }, () => {
        console.log("[useTasks] Cleaning up BroadcastChannel listener", { currentBoardId: d }), i.close();
      };
    } catch (i) {
      console.error("[useTasks] Failed to setup BroadcastChannel", i);
    }
  }, [d, t, e]);
  async function x(i) {
    if (i = i.trim(), !!i)
      try {
        const l = at(i);
        return await r.createTask(l, d), await S(), !0;
      } catch (l) {
        return alert(l.message || "Failed to create task"), !1;
      }
  }
  async function F(i) {
    await Te(
      `complete-${i}`,
      n,
      c,
      async () => {
        await r.completeTask(i, d), await S();
      },
      {
        onError: (l) => alert(l.message || "Failed to complete task")
      }
    );
  }
  async function q(i) {
    console.log("[useTasks] deleteTask START", { taskId: i, currentBoardId: d }), await Te(
      `delete-${i}`,
      n,
      c,
      async () => {
        console.log("[useTasks] deleteTask: calling api.deleteTask", { taskId: i, currentBoardId: d }), await r.deleteTask(i, d), console.log("[useTasks] deleteTask: calling reload"), await S(), console.log("[useTasks] deleteTask END");
      },
      {
        onError: (l) => alert(l.message || "Failed to delete task")
      }
    );
  }
  async function M(i) {
    const l = prompt("Enter tag (without #):");
    if (!l) return;
    const f = l.trim().replace(/^#+/, "").replace(/\s+/g, "-"), T = o.find((g) => g.id === i);
    if (!T) return;
    const w = T.tag?.split(" ") || [];
    if (w.includes(f)) return;
    const k = [...w, f].join(" ");
    try {
      await r.patchTask(i, { tag: k }, d), await S();
    } catch (g) {
      alert(g.message || "Failed to add tag");
    }
  }
  async function L(i, l, f = {}) {
    const { suppressBroadcast: T = !1, skipReload: w = !1 } = f;
    try {
      await r.patchTask(i, l, d, T), w || await S();
    } catch (k) {
      throw k;
    }
  }
  async function H(i) {
    console.log("[useTasks] bulkUpdateTaskTags START", { count: i.length });
    try {
      "batchUpdateTags" in r ? await r.batchUpdateTags(
        d,
        i.map((l) => ({ taskId: l.taskId, tag: l.tag || null }))
      ) : await ie(async () => {
        for (const { taskId: l, tag: f } of i)
          await r.patchTask(l, { tag: f }, d, !0);
      }, t, e), console.log("[useTasks] bulkUpdateTaskTags: calling reload"), await S(), console.log("[useTasks] bulkUpdateTaskTags END");
    } catch (l) {
      throw console.error("[useTasks] bulkUpdateTaskTags ERROR", l), l;
    }
  }
  async function I(i) {
    console.log("[useTasks] clearTasksByTag START", { tag: i, currentBoardId: d, taskCount: o.length });
    const l = o.filter((f) => f.tag?.split(" ").includes(i));
    if (console.log("[useTasks] clearTasksByTag: found tasks with tag", { tag: i, count: l.length }), l.length === 0) {
      console.log("[useTasks] clearTasksByTag: no tasks found with this tag, just deleting tag");
      try {
        await r.deleteTag(i, d), await S(), console.log("[useTasks] clearTasksByTag END (no tasks to clear)");
      } catch (f) {
        console.error("[useTasks] clearTasksByTag ERROR", f), console.error("[useTasks] clearTasksByTag: Please fix this error:", f.message);
      }
      return;
    }
    console.log("[useTasks] clearTasksByTag: proceeding without confirmation (dialogs blocked)", { taskCount: l.length });
    try {
      console.log("[useTasks] clearTasksByTag: starting batch clear"), "batchClearTag" in r ? await r.batchClearTag(
        d,
        i,
        l.map((f) => f.id)
      ) : await ie(async () => {
        for (const f of l) {
          const T = f.tag?.split(" ") || [], w = T.filter((g) => g !== i), k = w.length > 0 ? w.join(" ") : null;
          console.log("[useTasks] clearTasksByTag: patching task", { taskId: f.id, oldTags: T, newTags: w }), await r.patchTask(f.id, { tag: k }, d, !0);
        }
        console.log("[useTasks] clearTasksByTag: deleting tag from board", { tag: i, currentBoardId: d }), await r.deleteTag(i, d);
      }, t, e), console.log("[useTasks] clearTasksByTag: calling reload"), await S(), console.log("[useTasks] clearTasksByTag END");
    } catch (f) {
      console.error("[useTasks] clearTasksByTag ERROR", f), alert(f.message || "Failed to remove tag from tasks");
    }
  }
  async function U(i) {
    if (confirm("Clear all remaining tasks?"))
      try {
        for (const l of i)
          await r.deleteTask(l.id, d);
        await S();
      } catch (l) {
        alert(l.message || "Failed to clear remaining tasks");
      }
  }
  async function P(i) {
    await r.createBoard(i), h(i);
    const l = await r.getBoards();
    m(l);
    const { tasks: f } = ae(l, i);
    s(f);
  }
  async function W(i, l) {
    if (console.log("[useTasks] moveTasksToBoard START", { targetBoardId: i, ids: l, currentBoardId: d }), !u) return;
    const f = /* @__PURE__ */ new Set();
    for (const T of u.boards)
      for (const w of T.tasks || [])
        l.includes(w.id) && f.add(T.id);
    console.log("[useTasks] moveTasksToBoard: source boards", { sourceBoardIds: Array.from(f) });
    try {
      if ("batchMoveTasks" in r && f.size === 1) {
        const k = Array.from(f)[0];
        console.log("[useTasks] moveTasksToBoard: using batch API"), await r.batchMoveTasks(k, i, l);
      } else {
        const k = [];
        for (const g of u.boards)
          for (const B of g.tasks || [])
            l.includes(B.id) && k.push({ id: B.id, title: B.title, tag: B.tag || void 0, boardId: g.id, createdAt: B.createdAt });
        console.log("[useTasks] moveTasksToBoard: using old method, found tasks", { count: k.length }), await ie(async () => {
          for (const g of k)
            await r.createTask({ id: g.id, title: g.title, tag: g.tag, createdAt: g.createdAt }, i, !0), await r.deleteTask(g.id, g.boardId, !0);
        }, t, e);
      }
      console.log("[useTasks] moveTasksToBoard: switching to target board", { targetBoardId: i }), h(i);
      const T = await r.getBoards();
      m(T);
      const { tasks: w } = ae(T, i);
      s(w), console.log("[useTasks] moveTasksToBoard END");
    } catch (T) {
      console.error("[useTasks] moveTasksToBoard ERROR", T), alert(T.message || "Failed to move tasks");
    }
  }
  async function R(i) {
    if (await r.deleteBoard(i), d === i) {
      h("main");
      const l = await r.getBoards();
      m(l);
      const { tasks: f } = ae(l, "main");
      s(f);
    } else
      await S();
  }
  async function Y(i) {
    await r.createTag(i, d), await S();
  }
  async function K(i) {
    await r.deleteTag(i, d), await S();
  }
  function z(i) {
    h(i);
    const { tasks: l, foundBoard: f } = ae(u, i);
    f ? s(l) : S();
  }
  return {
    // Task state
    tasks: o,
    pendingOperations: n,
    // Task operations
    addTask: x,
    completeTask: F,
    deleteTask: q,
    addTagToTask: M,
    updateTaskTags: L,
    bulkUpdateTaskTags: H,
    clearTasksByTag: I,
    clearRemainingTasks: U,
    // Board state
    boards: u,
    currentBoardId: d,
    // Board operations
    createBoard: P,
    deleteBoard: R,
    switchBoard: z,
    moveTasksToBoard: W,
    createTagOnBoard: Y,
    deleteTagOnBoard: K,
    // Lifecycle
    initialLoad: D,
    reload: S
  };
}
function ct({ tasks: t, onTaskUpdate: e, onBulkUpdate: a }) {
  const [o, s] = N(null), [n, c] = N(null), [r, u] = N(/* @__PURE__ */ new Set()), [m, d] = N(!1), [h, D] = N(null), [S, x] = N(null), F = oe(null);
  function q(i, l) {
    const f = r.has(l) && r.size > 0 ? Array.from(r) : [l];
    console.log("[useDragAndDrop] onDragStart", { taskId: l, idsToDrag: f, selectedCount: r.size }), i.dataTransfer.setData("text/plain", f[0]);
    try {
      i.dataTransfer.setData("application/x-hadoku-task-ids", JSON.stringify(f));
    } catch {
    }
    i.dataTransfer.effectAllowed = "copyMove";
    try {
      const T = i.currentTarget, w = T.closest && T.closest(".task-app__item") ? T.closest(".task-app__item") : T;
      w.classList.add("dragging");
      const k = w.cloneNode(!0);
      k.style.boxSizing = "border-box", k.style.width = `${w.offsetWidth}px`, k.style.height = `${w.offsetHeight}px`, k.style.opacity = "0.95", k.style.transform = "none", k.style.filter = "drop-shadow(0 6px 18px rgba(0,0,0,0.12))", k.classList.add("drag-image"), k.style.position = "absolute", k.style.top = "-9999px", k.style.left = "-9999px", document.body.appendChild(k), w.__dragImage = k, u((g) => {
        if (g.has(l)) return new Set(g);
        const B = new Set(g);
        return B.add(l), B;
      });
      try {
        const g = w.closest(".task-app__tag-column");
        if (g) {
          const B = g.querySelector(".task-app__tag-header") || g.querySelector("h3"), O = (B && B.textContent || "").trim().replace(/^#/, "");
          if (O)
            try {
              i.dataTransfer.setData("application/x-hadoku-task-source", O);
            } catch {
            }
        }
      } catch {
      }
      try {
        const g = w.getBoundingClientRect();
        let B = Math.round(i.clientX - g.left), A = Math.round(i.clientY - g.top);
        B = Math.max(0, Math.min(Math.round(k.offsetWidth - 1), B)), A = Math.max(0, Math.min(Math.round(k.offsetHeight - 1), A)), i.dataTransfer.setDragImage(k, B, A);
      } catch {
        i.dataTransfer.setDragImage(k, 0, 0);
      }
    } catch {
    }
  }
  function M(i) {
    try {
      const l = i.currentTarget;
      l.classList.remove("dragging");
      const f = l.__dragImage;
      f && f.parentNode && f.parentNode.removeChild(f), f && delete l.__dragImage;
    } catch {
    }
    try {
      U();
    } catch {
    }
  }
  function L(i) {
    if (i.button === 0) {
      try {
        const l = i.target;
        if (!l || l.closest && l.closest(".task-app__item, .task-app__controls, button, input, textarea, .task-app__item-actions"))
          return;
      } catch {
      }
      d(!0), F.current = { x: i.clientX, y: i.clientY }, D({ x: i.clientX, y: i.clientY, w: 0, h: 0 }), u(/* @__PURE__ */ new Set());
      try {
        document.body.classList.add("marquee-selecting");
      } catch {
      }
    }
  }
  function H(i) {
    if (!m || !F.current) return;
    const l = F.current.x, f = F.current.y, T = i.clientX, w = i.clientY, k = Math.min(l, T), g = Math.min(f, w), B = Math.abs(T - l), A = Math.abs(w - f);
    D({ x: k, y: g, w: B, h: A });
    const O = Array.from(document.querySelectorAll(".task-app__item")), X = /* @__PURE__ */ new Set();
    for (const $ of O) {
      const ee = $.getBoundingClientRect();
      if (!(ee.right < k || ee.left > k + B || ee.bottom < g || ee.top > g + A)) {
        const se = $.getAttribute("data-task-id");
        se && X.add(se), $.classList.add("selected");
      } else
        $.classList.remove("selected");
    }
    u(X);
  }
  function I(i) {
    d(!1), D(null), F.current = null;
    try {
      document.body.classList.remove("marquee-selecting");
    } catch {
    }
    try {
      x(Date.now());
    } catch {
    }
  }
  function U() {
    u(/* @__PURE__ */ new Set()), Array.from(document.querySelectorAll(".task-app__item.selected")).forEach((l) => l.classList.remove("selected"));
  }
  Q(() => {
    function i(T) {
      if (T.button !== 0) return;
      const w = { target: T.target, clientX: T.clientX, clientY: T.clientY, button: T.button };
      try {
        L(w);
      } catch {
      }
    }
    function l(T) {
      const w = { clientX: T.clientX, clientY: T.clientY };
      try {
        H(w);
      } catch {
      }
    }
    function f(T) {
      const w = { clientX: T.clientX, clientY: T.clientY };
      try {
        I(w);
      } catch {
      }
    }
    return document.addEventListener("mousedown", i), document.addEventListener("mousemove", l), document.addEventListener("mouseup", f), () => {
      document.removeEventListener("mousedown", i), document.removeEventListener("mousemove", l), document.removeEventListener("mouseup", f);
    };
  }, []);
  function P(i, l) {
    i.preventDefault(), i.dataTransfer.dropEffect = "copy", s(l);
  }
  function W(i) {
    i.currentTarget.contains(i.relatedTarget) || s(null);
  }
  async function R(i, l) {
    i.preventDefault(), s(null), console.log("[useDragAndDrop] onDrop START", { targetTag: l });
    let f = [];
    try {
      const k = i.dataTransfer.getData("application/x-hadoku-task-ids");
      k && (f = JSON.parse(k));
    } catch {
    }
    if (f.length === 0) {
      const k = i.dataTransfer.getData("text/plain");
      k && (f = [k]);
    }
    if (f.length === 0) return;
    let T = null;
    try {
      const k = i.dataTransfer.getData("application/x-hadoku-task-source");
      k && (T = k);
    } catch {
    }
    console.log("[useDragAndDrop] onDrop: processing", { targetTag: l, ids: f, srcTag: T, taskCount: f.length });
    const w = [];
    for (const k of f) {
      const g = t.find(($) => $.id === k);
      if (!g) continue;
      const B = g.tag?.split(" ").filter(Boolean) || [];
      if (l === "other") {
        if (B.length === 0) continue;
        w.push({ taskId: k, tag: "" });
        continue;
      }
      const A = B.includes(l);
      let O = B.slice();
      A || O.push(l), T && T !== l && (O = O.filter(($) => $ !== T));
      const X = O.join(" ").trim();
      w.push({ taskId: k, tag: X });
    }
    console.log("[useDragAndDrop] onDrop: updating tasks", { updateCount: w.length });
    try {
      await a(w), console.log("[useDragAndDrop] onDrop: updates complete, clearing selection");
      try {
        U();
      } catch {
      }
    } catch (k) {
      console.error("Failed to add tag to one or more tasks:", k), alert(k.message || "Failed to add tags");
    }
    console.log("[useDragAndDrop] onDrop END");
  }
  function Y(i, l) {
    i.preventDefault(), i.dataTransfer.dropEffect = "copy", c(l);
  }
  function K(i) {
    i.currentTarget.contains(i.relatedTarget) || c(null);
  }
  async function z(i, l) {
    i.preventDefault(), c(null);
    const f = i.dataTransfer.getData("text/plain"), T = t.find((g) => g.id === f);
    if (!T) return;
    const w = T.tag?.split(" ") || [];
    if (w.includes(l)) {
      console.log(`Task already has tag: ${l}`);
      return;
    }
    const k = [...w, l].join(" ");
    console.log(`Adding tag "${l}" to task "${T.title}" via filter drop. New tags: "${k}"`);
    try {
      await e(f, { tag: k });
      try {
        U();
      } catch {
      }
    } catch (g) {
      console.error("Failed to add tag via filter drop:", g), alert(g.message || "Failed to add tag");
    }
  }
  return {
    dragOverTag: o,
    dragOverFilter: n,
    setDragOverFilter: c,
    selectedIds: r,
    isSelecting: m,
    marqueeRect: h,
    selectionJustEndedAt: S,
    // selection handlers
    selectionStartHandler: L,
    selectionMoveHandler: H,
    selectionEndHandler: I,
    clearSelection: U,
    onDragStart: q,
    onDragEnd: M,
    onDragOver: P,
    onDragLeave: W,
    onDrop: R,
    onFilterDragOver: Y,
    onFilterDragLeave: K,
    onFilterDrop: z
  };
}
function it() {
  const [t, e] = N({});
  function a(c) {
    e((r) => {
      const m = (r[c] || "desc") === "desc" ? "asc" : "desc";
      return { ...r, [c]: m };
    });
  }
  function o(c, r) {
    return [...c].sort((u, m) => {
      const d = new Date(u.createdAt).getTime(), h = new Date(m.createdAt).getTime();
      return r === "asc" ? d - h : h - d;
    });
  }
  function s(c) {
    return c === "asc" ? "↑" : "↓";
  }
  function n(c) {
    return c === "asc" ? "Sorted by age (oldest first) - click to sort newest first" : "Sorted by age (newest first) - click to sort oldest first";
  }
  return {
    sortDirections: t,
    toggleSort: a,
    sortTasksByAge: o,
    getSortIcon: s,
    getSortTitle: n
  };
}
function be({ onLongPress: t, delay: e = 500 }) {
  const a = oe(null);
  return {
    onTouchStart: (c) => {
      const r = c.touches[0];
      a.current = window.setTimeout(() => {
        t(r.clientX, r.clientY);
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
function ge(t) {
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
  onMoveTasksToBoard: c,
  onClearSelection: r
}) {
  const u = be({
    onLongPress: (d, h) => s(t.id, d, h)
  }), m = t.id === "main";
  return /* @__PURE__ */ y(
    "button",
    {
      className: `board-btn ${e ? "board-btn--active" : ""} ${a ? "board-btn--drag-over" : ""}`,
      onClick: () => o(t.id),
      onContextMenu: (d) => {
        d.preventDefault(), !m && s(t.id, d.clientX, d.clientY);
      },
      ...m ? {} : u,
      "aria-pressed": e ? "true" : "false",
      onDragOver: (d) => {
        d.preventDefault(), d.dataTransfer.dropEffect = "move", n(`board:${t.id}`);
      },
      onDragLeave: (d) => {
        n(null);
      },
      onDrop: async (d) => {
        d.preventDefault(), n(null);
        const h = ge(d.dataTransfer);
        if (h.length !== 0)
          try {
            await c(t.id, h);
            try {
              r();
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
  onDragLeave: c,
  onDrop: r
}) {
  const u = be({
    onLongPress: (m, d) => s(t, m, d)
  });
  return /* @__PURE__ */ _(
    "button",
    {
      onClick: () => o(t),
      onContextMenu: (m) => {
        m.preventDefault(), s(t, m.clientX, m.clientY);
      },
      ...u,
      className: `${e ? "on" : ""} ${a ? "task-app__filter-drag-over" : ""}`,
      onDragOver: (m) => n(m, t),
      onDragLeave: c,
      onDrop: (m) => r(m, t),
      children: [
        "#",
        t
      ]
    }
  );
}
function ut(t) {
  const e = /* @__PURE__ */ new Date(), a = new Date(t), o = e.getTime() - a.getTime(), s = Math.floor(o / 1e3), n = Math.floor(s / 60), c = Math.floor(n / 60), r = Math.floor(c / 24);
  return s < 60 ? `${s}s ago` : n < 60 ? `${n}m ago` : c < 24 ? `${c}h ago` : `${r}d ago`;
}
function le({
  task: t,
  isDraggable: e = !0,
  pendingOperations: a,
  onComplete: o,
  onDelete: s,
  onAddTag: n,
  onDragStart: c,
  onDragEnd: r,
  selected: u = !1
}) {
  const m = a.has(`complete-${t.id}`), d = a.has(`delete-${t.id}`);
  return /* @__PURE__ */ _(
    "li",
    {
      className: `task-app__item ${u ? "selected" : ""}`,
      "data-task-id": t.id,
      draggable: e,
      onDragStart: c ? (h) => c(h, t.id) : void 0,
      onDragEnd: (h) => {
        if (h.currentTarget.classList.remove("dragging"), r)
          try {
            r(h);
          } catch {
          }
      },
      children: [
        /* @__PURE__ */ _("div", { className: "task-app__item-content", children: [
          /* @__PURE__ */ y("div", { className: "task-app__item-title", title: t.title, children: t.title }),
          /* @__PURE__ */ _("div", { className: "task-app__item-meta-row", children: [
            t.tag ? /* @__PURE__ */ y("div", { className: "task-app__item-tag", children: t.tag.split(" ").map((h) => `#${h}`).join(" ") }) : /* @__PURE__ */ y("div", {}),
            /* @__PURE__ */ y("div", { className: "task-app__item-age", children: ut(t.createdAt) })
          ] })
        ] }),
        /* @__PURE__ */ _("div", { className: "task-app__item-actions", children: [
          /* @__PURE__ */ y(
            "button",
            {
              className: "task-app__action-btn task-app__complete-btn",
              onClick: () => o(t.id),
              title: "Complete task",
              disabled: m || d,
              children: m ? "⏳" : "✓"
            }
          ),
          /* @__PURE__ */ y(
            "button",
            {
              className: "task-app__action-btn task-app__delete-btn",
              onClick: () => s(t.id),
              title: "Delete task",
              disabled: m || d,
              children: d ? "⏳" : "×"
            }
          )
        ] })
      ]
    }
  );
}
function ye(t) {
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
  onComplete: c,
  onDelete: r,
  onAddTag: u,
  onDragStart: m,
  onDragEnd: d,
  selectedIds: h,
  onSelectionStart: D,
  onSelectionMove: S,
  onSelectionEnd: x,
  onDragOver: F,
  onDragLeave: q,
  onDrop: M,
  toggleSort: L,
  sortTasksByAge: H,
  getSortIcon: I,
  getSortTitle: U,
  clearTasksByTag: P,
  clearRemainingTasks: W,
  onDeletePersistedTag: R
}) {
  const Y = (g, B) => /* @__PURE__ */ _(
    "div",
    {
      className: `task-app__tag-column ${s === g ? "task-app__tag-column--drag-over" : ""}`,
      onDragOver: (A) => F(A, g),
      onDragLeave: q,
      onDrop: (A) => M(A, g),
      children: [
        /* @__PURE__ */ _("div", { className: "task-app__tag-header-row", children: [
          /* @__PURE__ */ _("h3", { className: "task-app__tag-header", children: [
            "#",
            g
          ] }),
          /* @__PURE__ */ y(
            "button",
            {
              className: "task-app__sort-btn task-app__sort-btn--active",
              onClick: () => L(g),
              title: U(o[g] || "desc"),
              children: I(o[g] || "desc")
            }
          )
        ] }),
        /* @__PURE__ */ y("ul", { className: "task-app__list task-app__list--column", children: H(B, o[g] || "desc").map((A) => /* @__PURE__ */ y(
          le,
          {
            task: A,
            isDraggable: !0,
            pendingOperations: n,
            onComplete: c,
            onDelete: r,
            onAddTag: u,
            onDragStart: m,
            onDragEnd: d,
            selected: h ? h.has(A.id) : !1
          },
          A.id
        )) })
      ]
    },
    g
  ), K = (g, B) => {
    let A = he(t, g);
    return i && (A = A.filter((O) => {
      const X = O.tag?.split(" ") || [];
      return a.some(($) => X.includes($));
    })), A.slice(0, B);
  }, z = e.length, i = Array.isArray(a) && a.length > 0, l = t.filter((g) => {
    if (!i) return !0;
    const B = g.tag?.split(" ") || [];
    return a.some((A) => B.includes(A));
  }), f = ye(z), T = i ? e.filter((g) => he(t, g).some((A) => {
    const O = A.tag?.split(" ") || [];
    return a.some((X) => O.includes(X));
  })) : e.slice(0, f.useTags);
  if (T.length === 0)
    return /* @__PURE__ */ y("ul", { className: "task-app__list", children: l.map((g) => /* @__PURE__ */ y(
      le,
      {
        task: g,
        pendingOperations: n,
        onComplete: c,
        onDelete: r,
        onAddTag: u,
        onDragStart: m,
        onDragEnd: d,
        selected: h ? h.has(g.id) : !1
      },
      g.id
    )) });
  const w = nt(t, e, a).filter((g) => {
    if (!i) return !0;
    const B = g.tag?.split(" ") || [];
    return a.some((A) => B.includes(A));
  }), k = ye(T.length);
  return /* @__PURE__ */ _("div", { className: "task-app__dynamic-layout", children: [
    k.rows.length > 0 && /* @__PURE__ */ y(Le, { children: k.rows.map((g, B) => /* @__PURE__ */ y("div", { className: `task-app__tag-grid task-app__tag-grid--${g.columns}col`, children: g.tagIndices.map((A) => {
      const O = T[A];
      return O ? Y(O, K(O, k.maxPerColumn)) : null;
    }) }, B)) }),
    w.length > 0 && /* @__PURE__ */ _(
      "div",
      {
        className: `task-app__remaining ${s === "other" ? "task-app__tag-column--drag-over" : ""}`,
        onDragOver: (g) => {
          g.preventDefault(), g.dataTransfer.dropEffect = "move", F(g, "other");
        },
        onDragLeave: (g) => q(g),
        onDrop: (g) => M(g, "other"),
        children: [
          /* @__PURE__ */ _("div", { className: "task-app__tag-header-row", children: [
            /* @__PURE__ */ y("h3", { className: "task-app__remaining-header", children: "Other Tasks" }),
            /* @__PURE__ */ y(
              "button",
              {
                className: "task-app__sort-btn task-app__sort-btn--active",
                onClick: () => L("other"),
                title: U(o.other || "desc"),
                children: I(o.other || "desc")
              }
            )
          ] }),
          /* @__PURE__ */ y("ul", { className: "task-app__list", children: H(w, o.other || "desc").map((g) => /* @__PURE__ */ y(
            le,
            {
              task: g,
              pendingOperations: n,
              onComplete: c,
              onDelete: r,
              onAddTag: u,
              onDragStart: m,
              onDragEnd: d,
              selected: h ? h.has(g.id) : !1
            },
            g.id
          )) })
        ]
      }
    )
  ] });
}
function de({
  isOpen: t,
  title: e,
  onClose: a,
  onConfirm: o,
  children: s,
  inputValue: n,
  onInputChange: c,
  inputPlaceholder: r,
  confirmLabel: u = "Confirm",
  cancelLabel: m = "Cancel",
  confirmDisabled: d = !1,
  confirmDanger: h = !1
}) {
  return t ? /* @__PURE__ */ y(
    "div",
    {
      className: "modal-overlay",
      onClick: a,
      children: /* @__PURE__ */ _(
        "div",
        {
          className: "modal-card",
          onClick: (S) => S.stopPropagation(),
          children: [
            /* @__PURE__ */ y("h3", { children: e }),
            s,
            c && /* @__PURE__ */ y(
              "input",
              {
                type: "text",
                className: "modal-input",
                value: n || "",
                onChange: (S) => c(S.target.value),
                placeholder: r,
                autoFocus: !0,
                onKeyDown: (S) => {
                  S.key === "Enter" && !d && (S.preventDefault(), o()), S.key === "Escape" && (S.preventDefault(), a());
                }
              }
            ),
            /* @__PURE__ */ _("div", { className: "modal-actions", children: [
              /* @__PURE__ */ y(
                "button",
                {
                  className: "modal-button",
                  onClick: a,
                  children: m
                }
              ),
              /* @__PURE__ */ y(
                "button",
                {
                  className: `modal-button ${h ? "modal-button--danger" : "modal-button--primary"}`,
                  onClick: o,
                  disabled: d,
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
function we({ isOpen: t, x: e, y: a, items: o }) {
  return t ? /* @__PURE__ */ y(
    "div",
    {
      className: "board-context-menu",
      style: {
        left: `${e}px`,
        top: `${a}px`
      },
      children: o.map((s, n) => /* @__PURE__ */ y(
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
const ve = 5, Be = [
  { name: "light", emoji: "☀️", label: "Light theme" },
  { name: "dark", emoji: "🌙", label: "Dark theme" },
  { name: "strawberry", emoji: "🍓", label: "Strawberry theme" },
  { name: "ocean", emoji: "🌊", label: "Ocean theme" },
  { name: "cyberpunk", emoji: "🤖", label: "Cyberpunk theme" },
  { name: "coffee", emoji: "☕", label: "Coffee theme" },
  { name: "lavender", emoji: "🪻", label: "Lavender theme" }
], ft = (t) => Be.find((e) => e.name === t)?.emoji || "🌙";
function pt(t = {}) {
  const { userType: e = "public", userId: a = "public", sessionId: o } = t, [s, n] = N(/* @__PURE__ */ new Set()), [c, r] = N(null), [u, m] = N(!1), [d, h] = N(!1), [D, S] = N(null), [x, F] = N(""), [q, M] = N(null), [L, H] = N("light"), [I, U] = N(!1), [P, W] = N(null), [R, Y] = N(null), K = oe(null), z = oe(null), {
    tasks: i,
    pendingOperations: l,
    initialLoad: f,
    addTask: T,
    completeTask: w,
    deleteTask: k,
    addTagToTask: g,
    updateTaskTags: B,
    bulkUpdateTaskTags: A,
    clearTasksByTag: O,
    clearRemainingTasks: X,
    // board API
    boards: $,
    currentBoardId: ee,
    createBoard: me,
    deleteBoard: se,
    switchBoard: De,
    moveTasksToBoard: ke,
    createTagOnBoard: Ae,
    deleteTagOnBoard: _e
  } = rt({ userType: e, userId: a, sessionId: o }), b = ct({
    tasks: i,
    onTaskUpdate: B,
    onBulkUpdate: A
  }), te = it();
  Q(() => {
    ue(e, a, o).getPreferences().then((v) => {
      H(v.theme);
    });
  }, [e, a, o]), Q(() => {
    ue(e, a, o).savePreferences({ theme: L });
  }, [L, e, a, o]), Q(() => {
    console.log("[App] User context changed, initializing...", { userType: e, userId: a }), f(), K.current?.focus();
  }, [e, a]), Q(() => {
    z.current && z.current.setAttribute("data-theme", L);
  }, [L]), Q(() => {
    if (!I && !P && !R) return;
    const p = (v) => {
      const C = v.target;
      C.closest(".theme-picker") || U(!1), C.closest(".board-context-menu") || W(null), C.closest(".tag-context-menu") || Y(null);
    };
    return document.addEventListener("mousedown", p), () => document.removeEventListener("mousedown", p);
  }, [I, P, R]);
  async function xe(p) {
    await T(p) && K.current && (K.current.value = "", K.current.focus());
  }
  function Ce(p) {
    const v = i.filter((C) => C.tag?.split(" ").includes(p));
    r({ tag: p, count: v.length });
  }
  async function Ne(p) {
    const v = p.trim().replace(/\s+/g, "-");
    try {
      if (await Ae(v), D?.type === "apply-tag" && D.taskIds.length > 0) {
        const C = D.taskIds.map((E) => {
          const G = i.find((Me) => Me.id === E)?.tag?.split(" ").filter(Boolean) || [], Ee = [.../* @__PURE__ */ new Set([...G, v])];
          return { taskId: E, tag: Ee.join(" ") };
        });
        await A(C), b.clearSelection();
      }
      S(null);
    } catch (C) {
      throw console.error("[App] Failed to create tag:", C), C;
    }
  }
  function re(p) {
    const v = p.trim();
    return v ? ($?.boards?.map((E) => E.id.toLowerCase()) || []).includes(v.toLowerCase()) ? `Board "${v}" already exists` : null : "Board name cannot be empty";
  }
  async function Oe(p) {
    const v = p.trim(), C = re(v);
    if (C) {
      M(C);
      return;
    }
    try {
      await me(v), D?.type === "move-to-board" && D.taskIds.length > 0 && (await ke(v, D.taskIds), b.clearSelection()), S(null), M(null);
    } catch (E) {
      console.error("[App] Failed to create board:", E), M(E.message || "Failed to create board");
    }
  }
  const $e = $?.boards?.find((p) => p.id === ee)?.tags || [], Fe = st(i, 6);
  return /* @__PURE__ */ y(
    "div",
    {
      ref: z,
      className: "task-app-container",
      onMouseDown: b.selectionStartHandler,
      onMouseMove: b.selectionMoveHandler,
      onMouseUp: b.selectionEndHandler,
      onMouseLeave: b.selectionEndHandler,
      onClick: (p) => {
        try {
          const v = p.target;
          if (!v.closest || !v.closest(".task-app__item")) {
            if (b.selectionJustEndedAt && Date.now() - b.selectionJustEndedAt < 300)
              return;
            b.clearSelection();
          }
        } catch {
        }
      },
      children: /* @__PURE__ */ _("div", { className: "task-app", children: [
        /* @__PURE__ */ _("div", { className: "task-app__header-container", children: [
          /* @__PURE__ */ y("h1", { className: "task-app__header", children: "Tasks" }),
          /* @__PURE__ */ _("div", { className: "theme-picker", children: [
            /* @__PURE__ */ y(
              "button",
              {
                className: "theme-toggle-btn",
                onClick: () => U(!I),
                "aria-label": "Choose theme",
                title: "Choose theme",
                children: ft(L)
              }
            ),
            I && /* @__PURE__ */ y("div", { className: "theme-picker__dropdown", children: Be.map(({ name: p, emoji: v, label: C }) => /* @__PURE__ */ y(
              "button",
              {
                className: `theme-picker__option ${L === p ? "active" : ""}`,
                onClick: () => {
                  H(p), U(!1);
                },
                title: C,
                children: v
              },
              p
            )) })
          ] })
        ] }),
        /* @__PURE__ */ _("div", { className: "task-app__boards", children: [
          /* @__PURE__ */ y("div", { className: "task-app__board-list", children: ($ && $.boards ? $.boards.slice(0, ve) : [{ id: "main", name: "main", tasks: [], tags: [] }]).map((p) => /* @__PURE__ */ y(
            lt,
            {
              board: p,
              isActive: ee === p.id,
              isDragOver: b.dragOverFilter === `board:${p.id}`,
              onSwitch: De,
              onContextMenu: (v, C, E) => W({ boardId: v, x: C, y: E }),
              onDragOverFilter: b.setDragOverFilter,
              onMoveTasksToBoard: ke,
              onClearSelection: b.clearSelection
            },
            p.id
          )) }),
          /* @__PURE__ */ _("div", { className: "task-app__board-actions", children: [
            (!$ || $.boards && $.boards.length < ve) && /* @__PURE__ */ y(
              "button",
              {
                className: `board-add-btn ${b.dragOverFilter === "add-board" ? "board-btn--drag-over" : ""}`,
                onClick: () => {
                  F(""), M(null), m(!0);
                },
                onDragOver: (p) => {
                  p.preventDefault(), p.dataTransfer.dropEffect = "move", b.setDragOverFilter("add-board");
                },
                onDragLeave: (p) => {
                  b.setDragOverFilter(null);
                },
                onDrop: async (p) => {
                  p.preventDefault(), b.setDragOverFilter(null);
                  const v = ge(p.dataTransfer);
                  v.length > 0 && (F(""), S({ type: "move-to-board", taskIds: v }), m(!0));
                },
                "aria-label": "Create board",
                children: "＋"
              }
            ),
            e !== "public" && /* @__PURE__ */ y(
              "button",
              {
                className: "sync-btn",
                onClick: async (p) => {
                  console.log("[App] Manual refresh triggered"), await f(), p.currentTarget.blur();
                },
                title: "Sync from server",
                "aria-label": "Sync from server",
                children: /* @__PURE__ */ _("svg", { width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [
                  /* @__PURE__ */ y("polyline", { points: "23 4 23 10 17 10" }),
                  /* @__PURE__ */ y("polyline", { points: "1 20 1 14 7 14" }),
                  /* @__PURE__ */ y("path", { d: "M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" })
                ] })
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ y("div", { className: "task-app__controls", children: /* @__PURE__ */ y(
          "input",
          {
            ref: K,
            className: "task-app__input",
            placeholder: "Type a task and press Enter…",
            onKeyDown: (p) => {
              p.key === "Enter" && !p.shiftKey && (p.preventDefault(), xe(p.target.value)), p.key === "k" && (p.ctrlKey || p.metaKey) && (p.preventDefault(), K.current?.focus());
            }
          }
        ) }),
        /* @__PURE__ */ _("div", { className: "task-app__filters", children: [
          (() => {
            const p = ce(i);
            return Array.from(/* @__PURE__ */ new Set([...$e, ...p])).map((C) => /* @__PURE__ */ y(
              dt,
              {
                tag: C,
                isActive: s.has(C),
                isDragOver: b.dragOverFilter === C,
                onToggle: (E) => {
                  n((ne) => {
                    const G = new Set(ne);
                    return G.has(E) ? G.delete(E) : G.add(E), G;
                  });
                },
                onContextMenu: (E, ne, G) => Y({ tag: E, x: ne, y: G }),
                onDragOver: b.onFilterDragOver,
                onDragLeave: b.onFilterDragLeave,
                onDrop: b.onFilterDrop
              },
              C
            ));
          })(),
          /* @__PURE__ */ y(
            "button",
            {
              className: `task-app__filter-add ${b.dragOverFilter === "add-tag" ? "task-app__filter-drag-over" : ""}`,
              onClick: () => {
                F(""), h(!0);
              },
              onDragOver: (p) => {
                p.preventDefault(), p.dataTransfer.dropEffect = "copy", b.onFilterDragOver(p, "add-tag");
              },
              onDragLeave: b.onFilterDragLeave,
              onDrop: async (p) => {
                p.preventDefault(), b.onFilterDragLeave(p);
                const v = ge(p.dataTransfer);
                v.length > 0 && (F(""), S({ type: "apply-tag", taskIds: v }), h(!0));
              },
              "aria-label": "Add tag",
              children: "＋"
            }
          )
        ] }),
        /* @__PURE__ */ y(
          gt,
          {
            tasks: i,
            topTags: Fe,
            filters: Array.from(s),
            selectedIds: b.selectedIds,
            onSelectionStart: b.selectionStartHandler,
            onSelectionMove: b.selectionMoveHandler,
            onSelectionEnd: b.selectionEndHandler,
            sortDirections: te.sortDirections,
            dragOverTag: b.dragOverTag,
            pendingOperations: l,
            onComplete: w,
            onDelete: k,
            onAddTag: g,
            onDragStart: b.onDragStart,
            onDragEnd: b.onDragEnd,
            onDragOver: b.onDragOver,
            onDragLeave: b.onDragLeave,
            onDrop: b.onDrop,
            toggleSort: te.toggleSort,
            sortTasksByAge: te.sortTasksByAge,
            getSortIcon: te.getSortIcon,
            getSortTitle: te.getSortTitle,
            clearTasksByTag: Ce,
            clearRemainingTasks: X,
            onDeletePersistedTag: _e
          }
        ),
        b.isSelecting && b.marqueeRect && /* @__PURE__ */ y(
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
        /* @__PURE__ */ y(
          de,
          {
            isOpen: !!c,
            title: `Clear Tag #${c?.tag}?`,
            onClose: () => r(null),
            onConfirm: async () => {
              if (!c) return;
              const p = c.tag;
              r(null), await O(p);
            },
            confirmLabel: "Clear Tag",
            confirmDanger: !0,
            children: c && /* @__PURE__ */ _("p", { children: [
              "This will remove ",
              /* @__PURE__ */ _("strong", { children: [
                "#",
                c.tag
              ] }),
              " from",
              " ",
              /* @__PURE__ */ _("strong", { children: [
                c.count,
                " task(s)"
              ] }),
              " and delete the tag from the board."
            ] })
          }
        ),
        /* @__PURE__ */ _(
          de,
          {
            isOpen: u,
            title: "Create New Board",
            onClose: () => {
              m(!1), S(null), M(null);
            },
            onConfirm: async () => {
              if (!x.trim()) return;
              const p = re(x);
              if (p) {
                M(p);
                return;
              }
              m(!1), await Oe(x);
            },
            inputValue: x,
            onInputChange: (p) => {
              F(p), M(null);
            },
            inputPlaceholder: "Board name",
            confirmLabel: "Create",
            confirmDisabled: !x.trim() || re(x) !== null,
            children: [
              D?.type === "move-to-board" && D.taskIds.length > 0 && /* @__PURE__ */ _("p", { className: "modal-hint", children: [
                D.taskIds.length,
                " task",
                D.taskIds.length > 1 ? "s" : "",
                " will be moved to this board"
              ] }),
              q && /* @__PURE__ */ y("p", { className: "modal-error", style: { color: "var(--error-color, #d32f2f)", marginTop: "0.5rem" }, children: q })
            ]
          }
        ),
        /* @__PURE__ */ _(
          de,
          {
            isOpen: d,
            title: "Create New Tag",
            onClose: () => {
              h(!1), S(null);
            },
            onConfirm: async () => {
              if (x.trim()) {
                h(!1);
                try {
                  await Ne(x);
                } catch (p) {
                  console.error("[App] Failed to create tag:", p);
                }
              }
            },
            inputValue: x,
            onInputChange: F,
            inputPlaceholder: "Enter new tag name",
            confirmLabel: "Create",
            confirmDisabled: !x.trim(),
            children: [
              D?.type === "apply-tag" && D.taskIds.length > 0 && /* @__PURE__ */ _("p", { className: "modal-hint", children: [
                "This tag will be applied to ",
                D.taskIds.length,
                " task",
                D.taskIds.length > 1 ? "s" : ""
              ] }),
              ce(i).length > 0 && /* @__PURE__ */ _("div", { className: "modal-section", children: [
                /* @__PURE__ */ y("label", { className: "modal-label", children: "Existing tags:" }),
                /* @__PURE__ */ y("div", { className: "modal-tags-list", children: ce(i).map((p) => /* @__PURE__ */ _("span", { className: "modal-tag-chip", children: [
                  "#",
                  p
                ] }, p)) })
              ] })
            ]
          }
        ),
        /* @__PURE__ */ y(
          we,
          {
            isOpen: !!P,
            x: P?.x || 0,
            y: P?.y || 0,
            items: [
              {
                label: "🗑️ Delete Board",
                isDanger: !0,
                onClick: async () => {
                  if (!P) return;
                  const p = $?.boards?.find((v) => v.id === P.boardId)?.name || P.boardId;
                  if (confirm(`Delete board "${p}"? All tasks on this board will be permanently deleted.`))
                    try {
                      await se(P.boardId), W(null);
                    } catch (v) {
                      console.error("[App] Failed to delete board:", v), alert(v.message || "Failed to delete board");
                    }
                }
              }
            ]
          }
        ),
        /* @__PURE__ */ y(
          we,
          {
            isOpen: !!R,
            x: R?.x || 0,
            y: R?.y || 0,
            items: [
              {
                label: "🗑️ Delete Tag",
                isDanger: !0,
                onClick: async () => {
                  if (!R) return;
                  const p = i.filter((v) => v.tag?.split(" ").includes(R.tag));
                  if (confirm(`Delete tag "${R.tag}" and remove it from ${p.length} task(s)?`))
                    try {
                      await O(R.tag), Y(null);
                    } catch (v) {
                      console.error("[App] Failed to delete tag:", v), alert(v.message || "Failed to delete tag");
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
  const a = new URLSearchParams(window.location.search), o = e.userType || a.get("userType") || "public", s = e.userId || a.get("userId") || "public", n = e.sessionId, c = { ...e, userType: o, userId: s, sessionId: n }, r = Pe(t);
  r.render(/* @__PURE__ */ y(pt, { ...c })), t.__root = r, console.log("[task-app] Mounted successfully", c);
}
function wt(t) {
  t.__root?.unmount();
}
export {
  yt as mount,
  wt as unmount
};
