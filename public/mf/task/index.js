import { jsxs as A, jsx as h, Fragment as xe } from "react/jsx-runtime";
import { createRoot as Ne } from "react-dom/client";
import { useState as N, useMemo as $e, useEffect as ee, useRef as ue } from "react";
const M = `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
class Fe {
  constructor(e = "public", s = "public") {
    this.userType = e, this.userId = s;
  }
  // --- Storage Keys ---
  // Note: Always use the userType from constructor, not the one passed to methods
  // This ensures data stays in the same localStorage location regardless of authContext
  getTasksKey(e, s, r) {
    return `${this.userType}-${s || this.userId}-${r || "main"}-tasks`;
  }
  getStatsKey(e, s, r) {
    return `${this.userType}-${s || this.userId}-${r || "main"}-stats`;
  }
  getBoardsKey(e, s) {
    return `${this.userType}-${s || this.userId}-boards`;
  }
  // --- Tasks Operations ---
  async getTasks(e, s, r) {
    const t = this.getTasksKey(e, s, r), n = localStorage.getItem(t);
    return n ? JSON.parse(n) : {
      version: 1,
      updatedAt: (/* @__PURE__ */ new Date()).toISOString(),
      tasks: []
    };
  }
  async saveTasks(e, s, r, t) {
    const n = this.getTasksKey(e, s, r);
    t.updatedAt = (/* @__PURE__ */ new Date()).toISOString(), localStorage.setItem(n, JSON.stringify(t));
  }
  // --- Stats Operations ---
  async getStats(e, s, r) {
    const t = this.getStatsKey(e, s, r), n = localStorage.getItem(t);
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
  async saveStats(e, s, r, t) {
    const n = this.getStatsKey(e, s, r);
    t.updatedAt = (/* @__PURE__ */ new Date()).toISOString(), localStorage.setItem(n, JSON.stringify(t));
  }
  // --- Boards Operations ---
  async getBoards(e, s) {
    const r = this.getBoardsKey(e, s), t = localStorage.getItem(r);
    if (t)
      return JSON.parse(t);
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
    return await this.saveBoards(e, n, s), n;
  }
  async saveBoards(e, s, r) {
    const t = this.getBoardsKey(e, r);
    s.updatedAt = (/* @__PURE__ */ new Date()).toISOString(), localStorage.setItem(t, JSON.stringify(s));
  }
  // --- Cleanup Operations ---
  async deleteBoardData(e, s, r) {
    const t = this.getTasksKey(e, s, r), n = this.getStatsKey(e, s, r);
    localStorage.removeItem(t), localStorage.removeItem(n);
  }
}
function Oe() {
  const a = Date.now().toString(36).toUpperCase().padStart(8, "0"), e = crypto.getRandomValues(new Uint8Array(18)), s = Array.from(e).map((r) => (r % 36).toString(36).toUpperCase()).join("");
  return a + s;
}
function te() {
  return (/* @__PURE__ */ new Date()).toISOString();
}
function Ee(a, e, s) {
  return {
    ...a,
    updatedAt: s,
    counters: {
      ...a.counters,
      created: a.counters.created + 1
    },
    timeline: [
      ...a.timeline,
      { t: s, event: "created", id: e.id }
    ],
    tasks: {
      ...a.tasks,
      [e.id]: { ...e }
    }
  };
}
function Pe(a, e, s) {
  return {
    ...a,
    updatedAt: s,
    counters: {
      ...a.counters,
      completed: a.counters.completed + 1
    },
    timeline: [
      ...a.timeline,
      { t: s, event: "completed", id: e.id }
    ],
    tasks: {
      ...a.tasks,
      [e.id]: { ...e }
    }
  };
}
function Me(a, e, s) {
  return {
    ...a,
    updatedAt: s,
    counters: {
      ...a.counters,
      edited: a.counters.edited + 1
    },
    timeline: [
      ...a.timeline,
      { t: s, event: "edited", id: e.id }
    ],
    tasks: {
      ...a.tasks,
      [e.id]: { ...e }
    }
  };
}
function Ie(a, e, s) {
  return {
    ...a,
    updatedAt: s,
    counters: {
      ...a.counters,
      deleted: a.counters.deleted + 1
    },
    timeline: [
      ...a.timeline,
      { t: s, event: "deleted", id: e.id }
    ],
    tasks: {
      ...a.tasks,
      [e.id]: { ...e }
    }
  };
}
async function Le(a, e) {
  const s = await a.getBoards(e.userType, e.userId), r = await Promise.all(
    s.boards.map(async (t) => {
      const n = await a.getTasks(e.userType, e.userId, t.id), o = await a.getStats(e.userType, e.userId, t.id);
      return {
        ...t,
        tasks: n.tasks,
        stats: o
      };
    })
  );
  return {
    ...s,
    boards: r
  };
}
async function Re(a, e, s, r = "main") {
  if (e.userType === "public")
    throw new Error("Forbidden: Public users cannot create tasks");
  const t = te(), n = await a.getTasks(e.userType, e.userId, r), o = await a.getStats(e.userType, e.userId, r), c = s.id || Oe(), m = {
    id: c,
    title: s.title,
    tag: s.tag ?? null,
    state: "Active",
    createdAt: t
  }, y = {
    ...n,
    tasks: [m, ...n.tasks],
    updatedAt: t
  }, p = Ee(o, m, t);
  return await a.saveTasks(e.userType, e.userId, r, y), await a.saveStats(e.userType, e.userId, r, p), { ok: !0, id: c };
}
async function Ue(a, e, s, r, t = "main") {
  if (e.userType === "public")
    throw new Error("Forbidden: Public users cannot update tasks");
  const n = te(), o = await a.getTasks(e.userType, e.userId, t), c = await a.getStats(e.userType, e.userId, t), m = o.tasks.findIndex((q) => q.id === s);
  if (m < 0)
    throw new Error("Task not found");
  const p = {
    ...o.tasks[m],
    ...r,
    updatedAt: n
  }, v = [...o.tasks];
  v[m] = p;
  const F = {
    ...o,
    tasks: v,
    updatedAt: n
  }, _ = Me(c, p, n);
  return await a.saveTasks(e.userType, e.userId, t, F), await a.saveStats(e.userType, e.userId, t, _), { ok: !0, message: `Task ${s} updated` };
}
async function Je(a, e, s, r = "main") {
  if (e.userType === "public")
    throw new Error("Forbidden: Public users cannot complete tasks");
  const t = te(), n = await a.getTasks(e.userType, e.userId, r), o = await a.getStats(e.userType, e.userId, r), c = n.tasks.findIndex((_) => _.id === s);
  if (c < 0)
    throw new Error("Task not found");
  const y = {
    ...n.tasks[c],
    state: "Completed",
    closedAt: t,
    updatedAt: t
  }, p = [...n.tasks];
  p.splice(c, 1);
  const v = {
    ...n,
    tasks: p,
    updatedAt: t
  }, F = Pe(o, y, t);
  return await a.saveTasks(e.userType, e.userId, r, v), await a.saveStats(e.userType, e.userId, r, F), { ok: !0, message: `Task ${s} completed` };
}
async function Ke(a, e, s, r = "main") {
  const t = te(), n = await a.getTasks(e.userType, e.userId, r), o = await a.getStats(e.userType, e.userId, r), c = n.tasks.findIndex((_) => _.id === s);
  if (c < 0)
    throw new Error("Task not found");
  const y = {
    ...n.tasks[c],
    state: "Deleted",
    closedAt: t,
    updatedAt: t
  }, p = [...n.tasks];
  p.splice(c, 1);
  const v = {
    ...n,
    tasks: p,
    updatedAt: t
  }, F = Ie(o, y, t);
  return await a.saveTasks(e.userType, e.userId, r, v), await a.saveStats(e.userType, e.userId, r, F), { ok: !0, message: `Task ${s} deleted` };
}
async function je(a, e, s) {
  if (e.userType === "public")
    throw new Error("Forbidden: Public users cannot create boards");
  const r = te(), t = await a.getBoards(e.userType, e.userId);
  if (t.boards.find((c) => c.id === s.id))
    throw new Error(`Board ${s.id} already exists`);
  const n = {
    id: s.id,
    name: s.name,
    tasks: [],
    tags: []
  }, o = {
    ...t,
    updatedAt: r,
    boards: [...t.boards, n]
  };
  return await a.saveBoards(e.userType, o, e.userId), { ok: !0, board: n };
}
async function Xe(a, e, s) {
  if (e.userType === "public")
    throw new Error("Forbidden: Public users cannot delete boards");
  if (s === "main")
    throw new Error("Cannot delete the main board");
  const r = te(), t = await a.getBoards(e.userType, e.userId);
  if (t.boards.findIndex((c) => c.id === s) < 0)
    throw new Error(`Board ${s} not found`);
  const o = {
    ...t,
    updatedAt: r,
    boards: t.boards.filter((c) => c.id !== s)
  };
  return await a.saveBoards(e.userType, o, e.userId), { ok: !0, message: `Board ${s} deleted` };
}
async function He(a, e, s) {
  if (e.userType === "public")
    throw new Error("Forbidden: Public users cannot create tags");
  const r = te(), t = await a.getBoards(e.userType, e.userId), n = t.boards.findIndex((p) => p.id === s.boardId);
  if (n < 0)
    throw new Error(`Board ${s.boardId} not found`);
  const o = t.boards[n], c = o.tags || [];
  if (c.includes(s.tag))
    return { ok: !0, message: `Tag ${s.tag} already exists` };
  const m = {
    ...o,
    tags: [...c, s.tag]
  }, y = {
    ...t,
    updatedAt: r,
    boards: [
      ...t.boards.slice(0, n),
      m,
      ...t.boards.slice(n + 1)
    ]
  };
  return await a.saveBoards(e.userType, y, e.userId), { ok: !0, message: `Tag ${s.tag} added to board ${s.boardId}` };
}
async function qe(a, e, s) {
  if (e.userType === "public")
    throw new Error("Forbidden: Public users cannot delete tags");
  const r = te(), t = await a.getBoards(e.userType, e.userId), n = t.boards.findIndex((p) => p.id === s.boardId);
  if (n < 0)
    throw new Error(`Board ${s.boardId} not found`);
  const o = t.boards[n], c = o.tags || [], m = {
    ...o,
    tags: c.filter((p) => p !== s.tag)
  }, y = {
    ...t,
    updatedAt: r,
    boards: [
      ...t.boards.slice(0, n),
      m,
      ...t.boards.slice(n + 1)
    ]
  };
  return await a.saveBoards(e.userType, y, e.userId), { ok: !0, message: `Tag ${s.tag} removed from board ${s.boardId}` };
}
function Z(a, e, s = 50) {
  setTimeout(() => {
    try {
      const r = new BroadcastChannel("tasks");
      r.postMessage({ type: a, ...e }), r.close();
    } catch (r) {
      console.error("[localStorageApi] Broadcast failed:", r);
    }
  }, s);
}
function Ye(a = "public", e = "public") {
  const s = new Fe(a, e), r = { userType: "registered", userId: e };
  return {
    async getBoards() {
      const t = await Le(s, r), n = {
        version: t.version,
        updatedAt: t.updatedAt,
        boards: []
      };
      for (const o of t.boards) {
        const c = await s.getTasks(a, e, o.id), m = await s.getStats(a, e, o.id);
        n.boards.push({
          id: o.id,
          name: o.name,
          tasks: c.tasks,
          stats: m,
          tags: o.tags || []
        });
      }
      return n;
    },
    async createBoard(t) {
      console.debug("[localStorageApi] createBoard (using handler)", { userType: a, userId: e, boardId: t });
      const n = await je(
        s,
        r,
        { id: t, name: t }
      );
      return await s.saveTasks(a, e, t, {
        version: 1,
        updatedAt: (/* @__PURE__ */ new Date()).toISOString(),
        tasks: []
      }), await s.saveStats(a, e, t, {
        version: 2,
        updatedAt: (/* @__PURE__ */ new Date()).toISOString(),
        counters: { created: 0, completed: 0, edited: 0, deleted: 0 },
        timeline: [],
        tasks: {}
      }), Z("boards-updated", { sessionId: M, userType: a, userId: e }), n.board;
    },
    async deleteBoard(t) {
      await Xe(
        s,
        r,
        t
      ), await s.deleteBoardData(a, e, t), Z("boards-updated", { sessionId: M, userType: a, userId: e });
    },
    async getTasks(t = "main") {
      return s.getTasks(a, e, t);
    },
    async getStats(t = "main") {
      return s.getStats(a, e, t);
    },
    async createTask(t, n = "main", o = !1) {
      console.log("[localStorageApi] createTask (using handler)", { data: t, boardId: n, suppressBroadcast: o });
      const c = await Re(
        s,
        r,
        t,
        n
      ), y = (await s.getTasks(a, e, n)).tasks.find((p) => p.id === c.id);
      if (!y)
        throw new Error("Task creation failed - task not found after creation");
      return o ? console.log("[localStorageApi] createTask: broadcast suppressed") : (console.log("[localStorageApi] createTask: broadcasting", {
        sessionId: M,
        boardId: n,
        taskId: c.id
      }), Z("tasks-updated", { sessionId: M, userType: a, userId: e, boardId: n })), y;
    },
    async patchTask(t, n, o = "main", c = !1) {
      const m = {};
      n.title !== void 0 && (m.title = n.title), n.tag !== void 0 && n.tag !== null && (m.tag = n.tag), await Ue(
        s,
        r,
        t,
        m,
        o
      ), c || Z("tasks-updated", { sessionId: M, userType: a, userId: e, boardId: o });
      const p = (await s.getTasks(a, e, o)).tasks.find((v) => v.id === t);
      if (!p)
        throw new Error("Task not found after update");
      return p;
    },
    async completeTask(t, n = "main") {
      await Je(
        s,
        r,
        t,
        n
      ), Z("tasks-updated", { sessionId: M, userType: a, userId: e, boardId: n });
      const c = (await s.getTasks(a, e, n)).tasks.find((m) => m.id === t);
      if (!c)
        throw new Error("Task not found after completion");
      return c;
    },
    async deleteTask(t, n = "main", o = !1) {
      console.log("[localStorageApi] deleteTask (using handler)", { id: t, boardId: n, suppressBroadcast: o });
      const m = (await s.getTasks(a, e, n)).tasks.find((y) => y.id === t);
      if (!m)
        throw new Error("Task not found");
      return await Ke(
        s,
        r,
        t,
        n
      ), o ? console.log("[localStorageApi] deleteTask: broadcast suppressed") : (console.log("[localStorageApi] deleteTask: broadcasting", { sessionId: M }), Z("tasks-updated", { sessionId: M, userType: a, userId: e, boardId: n })), {
        ...m,
        state: "Deleted",
        closedAt: (/* @__PURE__ */ new Date()).toISOString(),
        updatedAt: (/* @__PURE__ */ new Date()).toISOString()
      };
    },
    async createTag(t, n = "main") {
      await He(
        s,
        r,
        { boardId: n, tag: t }
      ), Z("boards-updated", { sessionId: M, userType: a, userId: e, boardId: n });
    },
    async deleteTag(t, n = "main") {
      await qe(
        s,
        r,
        { boardId: n, tag: t }
      ), Z("boards-updated", { sessionId: M, userType: a, userId: e, boardId: n });
    },
    // User preferences
    async getPreferences() {
      const t = `${a}-${e}-preferences`, n = localStorage.getItem(t);
      return n ? JSON.parse(n) : {
        version: 1,
        updatedAt: (/* @__PURE__ */ new Date()).toISOString(),
        theme: "light"
      };
    },
    async savePreferences(t) {
      const n = `${a}-${e}-preferences`, c = {
        ...await this.getPreferences(),
        ...t,
        updatedAt: (/* @__PURE__ */ new Date()).toISOString()
      };
      localStorage.setItem(n, JSON.stringify(c));
    }
  };
}
async function ze(a, e, s, r) {
  for (const o of e.boards || []) {
    const c = o.id;
    if (o.tasks && o.tasks.length > 0) {
      const m = `${s}-${r}-${c}-tasks`, y = {
        version: 1,
        updatedAt: e.updatedAt || (/* @__PURE__ */ new Date()).toISOString(),
        tasks: o.tasks
      };
      window.localStorage.setItem(m, JSON.stringify(y));
    }
    if (o.stats) {
      const m = `${s}-${r}-${c}-stats`;
      window.localStorage.setItem(m, JSON.stringify(o.stats));
    }
  }
  const t = `${s}-${r}-boards`, n = {
    version: 1,
    updatedAt: e.updatedAt || (/* @__PURE__ */ new Date()).toISOString(),
    boards: e.boards.map((o) => ({
      id: o.id,
      name: o.name,
      tags: o.tags || []
    }))
  };
  window.localStorage.setItem(t, JSON.stringify(n)), console.log("[api] Synced API data to localStorage:", {
    boards: e.boards?.length || 0,
    totalTasks: e.boards?.reduce((o, c) => o + (c.tasks?.length || 0), 0) || 0
  });
}
function W(a, e, s) {
  const r = {
    "Content-Type": "application/json",
    "X-User-Type": a
  };
  return e && (r["X-User-Id"] = e), s && (r["X-Session-Id"] = s), r;
}
function ge(a = "public", e = "public", s) {
  const r = Ye(a, e);
  return a === "public" ? r : {
    // Get boards - returns localStorage immediately (optimistic)
    async getBoards() {
      return await r.getBoards();
    },
    // Sync from API - called once on initial page load to get server state
    async syncFromApi() {
      try {
        console.log("[api] Syncing from API...");
        const t = await fetch(`/task/api/boards?userType=${a}&userId=${encodeURIComponent(e)}`, {
          headers: W(a, e, s)
        });
        if (!t.ok)
          throw new Error(`API returned ${t.status}`);
        const n = await t.json();
        console.log("[api] Synced from API:", { boards: n.boards?.length || 0, totalTasks: n.boards?.reduce((o, c) => o + (c.tasks?.length || 0), 0) || 0 }), await ze(r, n, a, e);
      } catch (t) {
        console.error("[api] Sync from API failed:", t);
      }
    },
    async createTask(t, n = "main", o = !1) {
      const c = await r.createTask(t, n, o);
      return fetch("/task/api", {
        method: "POST",
        headers: W(a, e, s),
        body: JSON.stringify({
          id: c.id,
          // Send client ID to server
          ...t,
          boardId: n
        })
      }).then((m) => m.json()).then((m) => {
        m.ok && (m.id === c.id ? console.log("[api] Background sync: createTask completed (ID matched)") : console.warn("[api] Server returned different ID (unexpected):", { client: c.id, server: m.id }));
      }).catch((m) => console.error("[api] Failed to sync createTask:", m)), c;
    },
    async createTag(t, n = "main") {
      const o = await r.createTag(t, n);
      return fetch("/task/api/tags", {
        method: "POST",
        headers: W(a, e, s),
        body: JSON.stringify({ boardId: n, tag: t })
      }).then(() => console.log("[api] Background sync: createTag completed")).catch((c) => console.error("[api] Failed to sync createTag:", c)), o;
    },
    async deleteTag(t, n = "main") {
      const o = await r.deleteTag(t, n);
      return fetch("/task/api/tags", {
        method: "DELETE",
        headers: W(a, e, s),
        body: JSON.stringify({ boardId: n, tag: t })
      }).then(() => console.log("[api] Background sync: deleteTag completed")).catch((c) => console.error("[api] Failed to sync deleteTag:", c)), o;
    },
    async patchTask(t, n, o = "main", c = !1) {
      const m = await r.patchTask(t, n, o, c);
      return fetch(`/task/api/${t}`, {
        method: "PATCH",
        headers: W(a, e, s),
        body: JSON.stringify({ ...n, boardId: o })
      }).then(() => console.log("[api] Background sync: patchTask completed")).catch((y) => console.error("[api] Failed to sync patchTask:", y)), m;
    },
    async completeTask(t, n = "main") {
      const o = await r.completeTask(t, n);
      return fetch(`/task/api/${t}/complete`, {
        method: "POST",
        headers: W(a, e, s),
        body: JSON.stringify({ boardId: n })
      }).then(() => console.log("[api] Background sync: completeTask completed")).catch((c) => console.error("[api] Failed to sync completeTask:", c)), o;
    },
    async deleteTask(t, n = "main", o = !1) {
      await r.deleteTask(t, n, o), fetch(`/task/api/${t}`, {
        method: "DELETE",
        headers: W(a, e, s),
        body: JSON.stringify({ boardId: n })
      }).then(() => console.log("[api] Background sync: deleteTask completed")).catch((c) => console.error("[api] Failed to sync deleteTask:", c));
    },
    // Board operations
    async createBoard(t) {
      const n = await r.createBoard(t);
      return fetch("/task/api/boards", {
        method: "POST",
        headers: W(a, e, s),
        body: JSON.stringify({ id: t, name: t })
      }).then(() => console.log("[api] Background sync: createBoard completed")).catch((o) => console.error("[api] Failed to sync createBoard:", o)), n;
    },
    async deleteBoard(t) {
      const n = await r.deleteBoard(t);
      return fetch(`/task/api/boards/${encodeURIComponent(t)}`, {
        method: "DELETE",
        headers: W(a, e, s)
      }).then(() => console.log("[api] Background sync: deleteBoard completed")).catch((o) => console.error("[api] Failed to sync deleteBoard:", o)), n;
    },
    // User preferences
    async getPreferences() {
      return await r.getPreferences();
    },
    async savePreferences(t) {
      await r.savePreferences(t), fetch("/task/api/preferences", {
        method: "PUT",
        headers: W(a, e, s),
        body: JSON.stringify(t)
      }).then(() => console.log("[api] Background sync: savePreferences completed")).catch((n) => console.error("[api] Failed to sync savePreferences:", n));
    }
  };
}
function Ve(a) {
  a = a.trim();
  const e = (t) => t.trim().replace(/\s+/g, "-"), s = a.match(/^["']([^"']+)["']\s*(.*)$/);
  if (s) {
    const t = s[1].trim(), o = s[2].match(/#[^\s#]+/g)?.map((c) => e(c.slice(1))).filter(Boolean) || [];
    return { title: t, tag: o.length ? o.join(" ") : void 0 };
  }
  const r = a.match(/^(.+?)\s+(#.+)$/);
  if (r) {
    const t = r[1].trim(), o = r[2].match(/#[^\s#]+/g)?.map((c) => e(c.slice(1))).filter(Boolean) || [];
    return { title: t, tag: o.length ? o.join(" ") : void 0 };
  }
  return { title: a.trim() };
}
function We(a, e = 6, s = []) {
  const r = a.flatMap((n) => n.tag?.split(" ") || []).filter(Boolean), t = {};
  return r.forEach((n) => t[n] = (t[n] || 0) + 1), s.filter(Boolean).forEach((n) => {
    t[n] || (t[n] = 0);
  }), Object.entries(t).sort((n, o) => o[1] - n[1]).slice(0, e).map(([n]) => n);
}
function fe(a, e) {
  return a.filter((s) => s.tag?.split(" ").includes(e));
}
function Ge(a, e, s) {
  const r = Array.isArray(s) && s.length > 0;
  return a.filter((t) => {
    const n = t.tag?.split(" ") || [];
    return r ? s.some((c) => n.includes(c)) && !e.some((c) => n.includes(c)) : !e.some((o) => n.includes(o));
  });
}
function re(a) {
  return Array.from(new Set(a.flatMap((e) => e.tag?.split(" ") || []).filter(Boolean)));
}
function ce(a, e, s, r = 50) {
  setTimeout(() => {
    try {
      const t = new BroadcastChannel("tasks");
      t.postMessage({ type: "tasks-updated", sessionId: a, userType: e, userId: s }), t.close();
    } catch (t) {
      console.error("[useTasks] Broadcast failed:", t);
    }
  }, r);
}
function Qe({ userType: a, userId: e, sessionId: s }) {
  const [r, t] = N([]), [n, o] = N(/* @__PURE__ */ new Set()), c = $e(
    () => ge(a, e || "public", s),
    [a, e, s]
  ), [m, y] = N(null), [p, v] = N("main");
  async function F() {
    console.log("[useTasks] initialLoad called"), "syncFromApi" in c && await c.syncFromApi(), await _();
  }
  async function _() {
    console.log("[useTasks] reload called", { currentBoardId: p, stack: new Error().stack?.split(`
`).slice(1, 4).join(`
`) });
    const i = await c.getBoards();
    y(i);
    const l = i.boards.find((d) => d.id === p);
    l ? (console.log("[useTasks] reload: found current board", { boardId: l.id, taskCount: l.tasks?.length || 0 }), t((l.tasks || []).filter((d) => d.state === "Active"))) : (console.log("[useTasks] reload: board not found", { currentBoardId: p }), t([]));
  }
  ee(() => {
    console.log("[useTasks] User context changed, clearing state and reloading", { userType: a, userId: e }), t([]), o(/* @__PURE__ */ new Set()), y(null), v("main"), _();
  }, [a, e]), ee(() => {
    console.log("[useTasks] Setting up BroadcastChannel listener", { currentBoardId: p, userType: a, userId: e });
    try {
      const i = new BroadcastChannel("tasks");
      return i.onmessage = (l) => {
        const d = l.data || {};
        if (console.log("[useTasks] BroadcastChannel message received", { msg: d, sessionId: M, currentBoardId: p, currentContext: { userType: a, userId: e } }), d.sessionId === M) {
          console.log("[useTasks] Ignoring own broadcast message");
          return;
        }
        if (d.userType !== a || d.userId !== e) {
          console.log("[useTasks] Ignoring message for different user context", {
            msgContext: { userType: d.userType, userId: d.userId },
            currentContext: { userType: a, userId: e }
          });
          return;
        }
        (d.type === "tasks-updated" || d.type === "boards-updated") && (console.log("[useTasks] BroadcastChannel: triggering reload for currentBoardId =", p), _());
      }, () => {
        console.log("[useTasks] Cleaning up BroadcastChannel listener", { currentBoardId: p }), i.close();
      };
    } catch (i) {
      console.error("[useTasks] Failed to setup BroadcastChannel", i);
    }
  }, [p, a, e]);
  async function q(i) {
    if (i = i.trim(), !!i)
      try {
        const l = Ve(i);
        return await c.createTask(l, p), await _(), !0;
      } catch (l) {
        return alert(l.message || "Failed to create task"), !1;
      }
  }
  async function j(i) {
    const l = `complete-${i}`;
    if (!n.has(l)) {
      o((d) => /* @__PURE__ */ new Set([...d, l]));
      try {
        await c.completeTask(i, p), await _();
      } catch (d) {
        d?.message?.includes("404") || alert(d.message || "Failed to complete task");
      } finally {
        o((d) => {
          const k = new Set(d);
          return k.delete(l), k;
        });
      }
    }
  }
  async function Y(i) {
    console.log("[useTasks] deleteTask START", { taskId: i, currentBoardId: p });
    const l = `delete-${i}`;
    if (n.has(l)) {
      console.log("[useTasks] deleteTask: already pending, skipping", { operationKey: l });
      return;
    }
    o((d) => /* @__PURE__ */ new Set([...d, l]));
    try {
      console.log("[useTasks] deleteTask: calling api.deleteTask", { taskId: i, currentBoardId: p }), await c.deleteTask(i, p), console.log("[useTasks] deleteTask: calling reload"), await _(), console.log("[useTasks] deleteTask END");
    } catch (d) {
      d?.message?.includes("404") || alert(d.message || "Failed to delete task");
    } finally {
      o((d) => {
        const k = new Set(d);
        return k.delete(l), k;
      });
    }
  }
  async function E(i) {
    const l = prompt("Enter tag (without #):");
    if (!l) return;
    const d = l.trim().replace(/^#+/, "").replace(/\s+/g, "-"), k = r.find((g) => g.id === i);
    if (!k) return;
    const b = k.tag?.split(" ") || [];
    if (b.includes(d)) return;
    const f = [...b, d].join(" ");
    try {
      await c.patchTask(i, { tag: f }, p), await _();
    } catch (g) {
      alert(g.message || "Failed to add tag");
    }
  }
  async function I(i, l, d = {}) {
    const { suppressBroadcast: k = !1, skipReload: b = !1 } = d;
    try {
      await c.patchTask(i, l, p, k), b || await _();
    } catch (f) {
      throw f;
    }
  }
  async function C(i) {
    console.log("[useTasks] bulkUpdateTaskTags START", { count: i.length });
    try {
      for (const { taskId: l, tag: d } of i)
        await c.patchTask(l, { tag: d }, p, !0);
      console.log("[useTasks] bulkUpdateTaskTags: broadcasting bulk update with delay"), ce(M, a, e), console.log("[useTasks] bulkUpdateTaskTags: calling reload"), await _(), console.log("[useTasks] bulkUpdateTaskTags END");
    } catch (l) {
      throw console.error("[useTasks] bulkUpdateTaskTags ERROR", l), l;
    }
  }
  async function O(i) {
    console.log("[useTasks] clearTasksByTag START", { tag: i, currentBoardId: p, taskCount: r.length });
    const l = r.filter((d) => d.tag?.split(" ").includes(i));
    if (console.log("[useTasks] clearTasksByTag: found tasks with tag", { tag: i, count: l.length }), l.length === 0) {
      console.log("[useTasks] clearTasksByTag: no tasks found with this tag, just deleting tag");
      try {
        await c.deleteTag(i, p), await _(), console.log("[useTasks] clearTasksByTag END (no tasks to clear)");
      } catch (d) {
        console.error("[useTasks] clearTasksByTag ERROR", d), console.error("[useTasks] clearTasksByTag: Please fix this error:", d.message);
      }
      return;
    }
    console.log("[useTasks] clearTasksByTag: proceeding without confirmation (dialogs blocked)", { taskCount: l.length });
    try {
      console.log("[useTasks] clearTasksByTag: starting to patch tasks");
      for (const d of l) {
        const k = d.tag?.split(" ") || [], b = k.filter((g) => g !== i), f = b.length > 0 ? b.join(" ") : null;
        console.log("[useTasks] clearTasksByTag: patching task", { taskId: d.id, oldTags: k, newTags: b }), await c.patchTask(d.id, { tag: f }, p, !0);
      }
      console.log("[useTasks] clearTasksByTag: deleting tag from board", { tag: i, currentBoardId: p }), await c.deleteTag(i, p), console.log("[useTasks] clearTasksByTag: broadcasting bulk update with delay"), ce(M, a, e), console.log("[useTasks] clearTasksByTag: calling reload"), await _(), console.log("[useTasks] clearTasksByTag END");
    } catch (d) {
      console.error("[useTasks] clearTasksByTag ERROR", d), alert(d.message || "Failed to remove tag from tasks");
    }
  }
  async function L(i) {
    if (confirm("Clear all remaining tasks?"))
      try {
        for (const l of i)
          await c.deleteTask(l.id, p);
        await _();
      } catch (l) {
        alert(l.message || "Failed to clear remaining tasks");
      }
  }
  async function R(i) {
    await c.createBoard(i), v(i);
    const l = await c.getBoards();
    y(l);
    const d = l.boards.find((k) => k.id === i);
    d ? (console.log("[useTasks] createBoard: switched to new board", { boardId: i, taskCount: d.tasks?.length || 0 }), t((d.tasks || []).filter((k) => k.state === "Active"))) : (console.log("[useTasks] createBoard: new board not found (should be empty)", { boardId: i }), t([]));
  }
  async function U(i, l) {
    if (console.log("[useTasks] moveTasksToBoard START", { targetBoardId: i, ids: l, currentBoardId: p }), !m) return;
    const d = [];
    for (const f of m.boards)
      for (const g of f.tasks || [])
        l.includes(g.id) && d.push({ id: g.id, title: g.title, tag: g.tag || void 0, boardId: f.id });
    console.log("[useTasks] moveTasksToBoard: found tasks to move", { count: d.length });
    for (const f of d)
      await c.createTask({ title: f.title, tag: f.tag }, i, !0), await c.deleteTask(f.id, f.boardId, !0);
    console.log("[useTasks] moveTasksToBoard: broadcasting bulk update with delay"), ce(M, a, e), console.log("[useTasks] moveTasksToBoard: switching to target board", { targetBoardId: i }), v(i);
    const k = await c.getBoards();
    y(k);
    const b = k.boards.find((f) => f.id === i);
    b && (console.log("[useTasks] moveTasksToBoard: loaded target board tasks", { count: b.tasks?.length || 0 }), t((b.tasks || []).filter((f) => f.state === "Active"))), console.log("[useTasks] moveTasksToBoard END");
  }
  async function G(i) {
    if (await c.deleteBoard(i), p === i) {
      v("main");
      const l = await c.getBoards();
      y(l);
      const d = l.boards.find((k) => k.id === "main");
      d ? (console.log("[useTasks] deleteBoard: switched to main board", { taskCount: d.tasks?.length || 0 }), t((d.tasks || []).filter((k) => k.state === "Active"))) : (console.log("[useTasks] deleteBoard: main board not found"), t([]));
    } else
      await _();
  }
  async function P(i) {
    await c.createTag(i, p), await _();
  }
  async function V(i) {
    await c.deleteTag(i, p), await _();
  }
  function X(i) {
    v(i);
    const l = m?.boards.find((d) => d.id === i);
    l ? t((l.tasks || []).filter((d) => d.state === "Active")) : _();
  }
  return {
    // Task state
    tasks: r,
    pendingOperations: n,
    // Task operations
    addTask: q,
    completeTask: j,
    deleteTask: Y,
    addTagToTask: E,
    updateTaskTags: I,
    bulkUpdateTaskTags: C,
    clearTasksByTag: O,
    clearRemainingTasks: L,
    // Board state
    boards: m,
    currentBoardId: p,
    // Board operations
    createBoard: R,
    deleteBoard: G,
    switchBoard: X,
    moveTasksToBoard: U,
    createTagOnBoard: P,
    deleteTagOnBoard: V,
    // Lifecycle
    initialLoad: F,
    reload: _
  };
}
function Ze({ tasks: a, onTaskUpdate: e, onBulkUpdate: s }) {
  const [r, t] = N(null), [n, o] = N(null), [c, m] = N(/* @__PURE__ */ new Set()), [y, p] = N(!1), [v, F] = N(null), [_, q] = N(null), j = ue(null);
  function Y(i, l) {
    const d = c.has(l) && c.size > 0 ? Array.from(c) : [l];
    console.log("[useDragAndDrop] onDragStart", { taskId: l, idsToDrag: d, selectedCount: c.size }), i.dataTransfer.setData("text/plain", d[0]);
    try {
      i.dataTransfer.setData("application/x-hadoku-task-ids", JSON.stringify(d));
    } catch {
    }
    i.dataTransfer.effectAllowed = "copyMove";
    try {
      const k = i.currentTarget, b = k.closest && k.closest(".task-app__item") ? k.closest(".task-app__item") : k;
      b.classList.add("dragging");
      const f = b.cloneNode(!0);
      f.style.boxSizing = "border-box", f.style.width = `${b.offsetWidth}px`, f.style.height = `${b.offsetHeight}px`, f.style.opacity = "0.95", f.style.transform = "none", f.style.filter = "drop-shadow(0 6px 18px rgba(0,0,0,0.12))", f.classList.add("drag-image"), f.style.position = "absolute", f.style.top = "-9999px", f.style.left = "-9999px", document.body.appendChild(f), b.__dragImage = f, m((g) => {
        if (g.has(l)) return new Set(g);
        const B = new Set(g);
        return B.add(l), B;
      });
      try {
        const g = b.closest(".task-app__tag-column");
        if (g) {
          const B = g.querySelector(".task-app__tag-header") || g.querySelector("h3"), $ = (B && B.textContent || "").trim().replace(/^#/, "");
          if ($)
            try {
              i.dataTransfer.setData("application/x-hadoku-task-source", $);
            } catch {
            }
        }
      } catch {
      }
      try {
        const g = b.getBoundingClientRect();
        let B = Math.round(i.clientX - g.left), D = Math.round(i.clientY - g.top);
        B = Math.max(0, Math.min(Math.round(f.offsetWidth - 1), B)), D = Math.max(0, Math.min(Math.round(f.offsetHeight - 1), D)), i.dataTransfer.setDragImage(f, B, D);
      } catch {
        i.dataTransfer.setDragImage(f, 0, 0);
      }
    } catch {
    }
  }
  function E(i) {
    try {
      const l = i.currentTarget;
      l.classList.remove("dragging");
      const d = l.__dragImage;
      d && d.parentNode && d.parentNode.removeChild(d), d && delete l.__dragImage;
    } catch {
    }
    try {
      L();
    } catch {
    }
  }
  function I(i) {
    if (i.button === 0) {
      try {
        const l = i.target;
        if (!l || l.closest && l.closest(".task-app__item, .task-app__controls, button, input, textarea, .task-app__item-actions"))
          return;
      } catch {
      }
      p(!0), j.current = { x: i.clientX, y: i.clientY }, F({ x: i.clientX, y: i.clientY, w: 0, h: 0 }), m(/* @__PURE__ */ new Set());
      try {
        document.body.classList.add("marquee-selecting");
      } catch {
      }
    }
  }
  function C(i) {
    if (!y || !j.current) return;
    const l = j.current.x, d = j.current.y, k = i.clientX, b = i.clientY, f = Math.min(l, k), g = Math.min(d, b), B = Math.abs(k - l), D = Math.abs(b - d);
    F({ x: f, y: g, w: B, h: D });
    const $ = Array.from(document.querySelectorAll(".task-app__item")), z = /* @__PURE__ */ new Set();
    for (const H of $) {
      const J = H.getBoundingClientRect();
      if (!(J.right < f || J.left > f + B || J.bottom < g || J.top > g + D)) {
        const ne = H.getAttribute("data-task-id");
        ne && z.add(ne), H.classList.add("selected");
      } else
        H.classList.remove("selected");
    }
    m(z);
  }
  function O(i) {
    p(!1), F(null), j.current = null;
    try {
      document.body.classList.remove("marquee-selecting");
    } catch {
    }
    try {
      q(Date.now());
    } catch {
    }
  }
  function L() {
    m(/* @__PURE__ */ new Set()), Array.from(document.querySelectorAll(".task-app__item.selected")).forEach((l) => l.classList.remove("selected"));
  }
  ee(() => {
    function i(k) {
      if (k.button !== 0) return;
      const b = { target: k.target, clientX: k.clientX, clientY: k.clientY, button: k.button };
      try {
        I(b);
      } catch {
      }
    }
    function l(k) {
      const b = { clientX: k.clientX, clientY: k.clientY };
      try {
        C(b);
      } catch {
      }
    }
    function d(k) {
      const b = { clientX: k.clientX, clientY: k.clientY };
      try {
        O(b);
      } catch {
      }
    }
    return document.addEventListener("mousedown", i), document.addEventListener("mousemove", l), document.addEventListener("mouseup", d), () => {
      document.removeEventListener("mousedown", i), document.removeEventListener("mousemove", l), document.removeEventListener("mouseup", d);
    };
  }, []);
  function R(i, l) {
    i.preventDefault(), i.dataTransfer.dropEffect = "copy", t(l);
  }
  function U(i) {
    i.currentTarget.contains(i.relatedTarget) || t(null);
  }
  async function G(i, l) {
    i.preventDefault(), t(null), console.log("[useDragAndDrop] onDrop START", { targetTag: l });
    let d = [];
    try {
      const f = i.dataTransfer.getData("application/x-hadoku-task-ids");
      f && (d = JSON.parse(f));
    } catch {
    }
    if (d.length === 0) {
      const f = i.dataTransfer.getData("text/plain");
      f && (d = [f]);
    }
    if (d.length === 0) return;
    let k = null;
    try {
      const f = i.dataTransfer.getData("application/x-hadoku-task-source");
      f && (k = f);
    } catch {
    }
    console.log("[useDragAndDrop] onDrop: processing", { targetTag: l, ids: d, srcTag: k, taskCount: d.length });
    const b = [];
    for (const f of d) {
      const g = a.find((H) => H.id === f);
      if (!g) continue;
      const B = g.tag?.split(" ").filter(Boolean) || [];
      if (l === "other") {
        if (B.length === 0) continue;
        b.push({ taskId: f, tag: "" });
        continue;
      }
      const D = B.includes(l);
      let $ = B.slice();
      D || $.push(l), k && k !== l && ($ = $.filter((H) => H !== k));
      const z = $.join(" ").trim();
      b.push({ taskId: f, tag: z });
    }
    console.log("[useDragAndDrop] onDrop: updating tasks", { updateCount: b.length });
    try {
      await s(b), console.log("[useDragAndDrop] onDrop: updates complete, clearing selection");
      try {
        L();
      } catch {
      }
    } catch (f) {
      console.error("Failed to add tag to one or more tasks:", f), alert(f.message || "Failed to add tags");
    }
    console.log("[useDragAndDrop] onDrop END");
  }
  function P(i, l) {
    i.preventDefault(), i.dataTransfer.dropEffect = "copy", o(l);
  }
  function V(i) {
    i.currentTarget.contains(i.relatedTarget) || o(null);
  }
  async function X(i, l) {
    i.preventDefault(), o(null);
    const d = i.dataTransfer.getData("text/plain"), k = a.find((g) => g.id === d);
    if (!k) return;
    const b = k.tag?.split(" ") || [];
    if (b.includes(l)) {
      console.log(`Task already has tag: ${l}`);
      return;
    }
    const f = [...b, l].join(" ");
    console.log(`Adding tag "${l}" to task "${k.title}" via filter drop. New tags: "${f}"`);
    try {
      await e(d, { tag: f });
      try {
        L();
      } catch {
      }
    } catch (g) {
      console.error("Failed to add tag via filter drop:", g), alert(g.message || "Failed to add tag");
    }
  }
  return {
    dragOverTag: r,
    dragOverFilter: n,
    setDragOverFilter: o,
    selectedIds: c,
    isSelecting: y,
    marqueeRect: v,
    selectionJustEndedAt: _,
    // selection handlers
    selectionStartHandler: I,
    selectionMoveHandler: C,
    selectionEndHandler: O,
    clearSelection: L,
    onDragStart: Y,
    onDragEnd: E,
    onDragOver: R,
    onDragLeave: U,
    onDrop: G,
    onFilterDragOver: P,
    onFilterDragLeave: V,
    onFilterDrop: X
  };
}
function et() {
  const [a, e] = N({});
  function s(o) {
    e((c) => {
      const y = (c[o] || "desc") === "desc" ? "asc" : "desc";
      return { ...c, [o]: y };
    });
  }
  function r(o, c) {
    return [...o].sort((m, y) => {
      const p = new Date(m.createdAt).getTime(), v = new Date(y.createdAt).getTime();
      return c === "asc" ? p - v : v - p;
    });
  }
  function t(o) {
    return o === "asc" ? "↑" : "↓";
  }
  function n(o) {
    return o === "asc" ? "Sorted by age (oldest first) - click to sort newest first" : "Sorted by age (newest first) - click to sort oldest first";
  }
  return {
    sortDirections: a,
    toggleSort: s,
    sortTasksByAge: r,
    getSortIcon: t,
    getSortTitle: n
  };
}
function tt(a) {
  const e = /* @__PURE__ */ new Date(), s = new Date(a), r = e.getTime() - s.getTime(), t = Math.floor(r / 1e3), n = Math.floor(t / 60), o = Math.floor(n / 60), c = Math.floor(o / 24);
  return t < 60 ? `${t}s ago` : n < 60 ? `${n}m ago` : o < 24 ? `${o}h ago` : `${c}d ago`;
}
function ie({
  task: a,
  isDraggable: e = !0,
  pendingOperations: s,
  onComplete: r,
  onDelete: t,
  onAddTag: n,
  onDragStart: o,
  onDragEnd: c,
  selected: m = !1
}) {
  const y = s.has(`complete-${a.id}`), p = s.has(`delete-${a.id}`);
  return /* @__PURE__ */ A(
    "li",
    {
      className: `task-app__item ${m ? "selected" : ""}`,
      "data-task-id": a.id,
      draggable: e,
      onDragStart: o ? (v) => o(v, a.id) : void 0,
      onDragEnd: (v) => {
        if (v.currentTarget.classList.remove("dragging"), c)
          try {
            c(v);
          } catch {
          }
      },
      children: [
        /* @__PURE__ */ A("div", { className: "task-app__item-content", children: [
          /* @__PURE__ */ h("div", { className: "task-app__item-title", title: a.title, children: a.title }),
          /* @__PURE__ */ A("div", { className: "task-app__item-meta-row", children: [
            a.tag ? /* @__PURE__ */ h("div", { className: "task-app__item-tag", children: a.tag.split(" ").map((v) => `#${v}`).join(" ") }) : /* @__PURE__ */ h("div", {}),
            /* @__PURE__ */ h("div", { className: "task-app__item-age", children: tt(a.createdAt) })
          ] })
        ] }),
        /* @__PURE__ */ A("div", { className: "task-app__item-actions", children: [
          /* @__PURE__ */ h(
            "button",
            {
              className: "task-app__action-btn task-app__complete-btn",
              onClick: () => r(a.id),
              title: "Complete task",
              disabled: y || p,
              children: y ? "⏳" : "✓"
            }
          ),
          /* @__PURE__ */ h(
            "button",
            {
              className: "task-app__action-btn task-app__delete-btn",
              onClick: () => t(a.id),
              title: "Delete task",
              disabled: y || p,
              children: p ? "⏳" : "×"
            }
          )
        ] })
      ]
    }
  );
}
function me(a) {
  return a === 0 ? { useTags: 0, maxPerColumn: 1 / 0, rows: [] } : a === 1 ? {
    useTags: 1,
    maxPerColumn: 1 / 0,
    rows: [{ columns: 1, tagIndices: [0] }]
  } : a === 2 ? {
    useTags: 2,
    maxPerColumn: 1 / 0,
    rows: [{ columns: 2, tagIndices: [0, 1] }]
  } : a === 3 ? {
    useTags: 3,
    maxPerColumn: 1 / 0,
    rows: [{ columns: 3, tagIndices: [0, 1, 2] }]
  } : a === 4 ? {
    useTags: 4,
    maxPerColumn: 10,
    rows: [
      { columns: 3, tagIndices: [0, 1, 2] },
      { columns: 1, tagIndices: [3] }
    ]
  } : a === 5 ? {
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
function at({
  tasks: a,
  topTags: e,
  filters: s,
  sortDirections: r,
  dragOverTag: t,
  pendingOperations: n,
  onComplete: o,
  onDelete: c,
  onAddTag: m,
  onDragStart: y,
  onDragEnd: p,
  selectedIds: v,
  onSelectionStart: F,
  onSelectionMove: _,
  onSelectionEnd: q,
  onDragOver: j,
  onDragLeave: Y,
  onDrop: E,
  toggleSort: I,
  sortTasksByAge: C,
  getSortIcon: O,
  getSortTitle: L,
  clearTasksByTag: R,
  clearRemainingTasks: U,
  onDeletePersistedTag: G
}) {
  const P = (g, B) => /* @__PURE__ */ A(
    "div",
    {
      className: `task-app__tag-column ${t === g ? "task-app__tag-column--drag-over" : ""}`,
      onDragOver: (D) => j(D, g),
      onDragLeave: Y,
      onDrop: (D) => E(D, g),
      children: [
        /* @__PURE__ */ A("div", { className: "task-app__tag-header-row", children: [
          /* @__PURE__ */ A("h3", { className: "task-app__tag-header", children: [
            "#",
            g
          ] }),
          /* @__PURE__ */ h(
            "button",
            {
              className: "task-app__sort-btn task-app__sort-btn--active",
              onClick: () => I(g),
              title: L(r[g] || "desc"),
              children: O(r[g] || "desc")
            }
          )
        ] }),
        /* @__PURE__ */ h("ul", { className: "task-app__list task-app__list--column", children: C(B, r[g] || "desc").map((D) => /* @__PURE__ */ h(
          ie,
          {
            task: D,
            isDraggable: !0,
            pendingOperations: n,
            onComplete: o,
            onDelete: c,
            onAddTag: m,
            onDragStart: y,
            onDragEnd: p,
            selected: v ? v.has(D.id) : !1
          },
          D.id
        )) })
      ]
    },
    g
  ), V = (g, B) => {
    let D = fe(a, g);
    return i && (D = D.filter(($) => {
      const z = $.tag?.split(" ") || [];
      return s.some((H) => z.includes(H));
    })), D.slice(0, B);
  }, X = e.length, i = Array.isArray(s) && s.length > 0, l = a.filter((g) => {
    if (!i) return !0;
    const B = g.tag?.split(" ") || [];
    return s.some((D) => B.includes(D));
  }), d = me(X), k = i ? e.filter((g) => fe(a, g).some((D) => {
    const $ = D.tag?.split(" ") || [];
    return s.some((z) => $.includes(z));
  })) : e.slice(0, d.useTags);
  if (k.length === 0)
    return /* @__PURE__ */ h("ul", { className: "task-app__list", children: l.map((g) => /* @__PURE__ */ h(
      ie,
      {
        task: g,
        pendingOperations: n,
        onComplete: o,
        onDelete: c,
        onAddTag: m,
        onDragStart: y,
        onDragEnd: p,
        selected: v ? v.has(g.id) : !1
      },
      g.id
    )) });
  const b = Ge(a, e, s).filter((g) => {
    if (!i) return !0;
    const B = g.tag?.split(" ") || [];
    return s.some((D) => B.includes(D));
  }), f = me(k.length);
  return /* @__PURE__ */ A("div", { className: "task-app__dynamic-layout", children: [
    f.rows.length > 0 && /* @__PURE__ */ h(xe, { children: f.rows.map((g, B) => /* @__PURE__ */ h("div", { className: `task-app__tag-grid task-app__tag-grid--${g.columns}col`, children: g.tagIndices.map((D) => {
      const $ = k[D];
      return $ ? P($, V($, f.maxPerColumn)) : null;
    }) }, B)) }),
    b.length > 0 && /* @__PURE__ */ A(
      "div",
      {
        className: `task-app__remaining ${t === "other" ? "task-app__tag-column--drag-over" : ""}`,
        onDragOver: (g) => {
          g.preventDefault(), g.dataTransfer.dropEffect = "move", j(g, "other");
        },
        onDragLeave: (g) => Y(g),
        onDrop: (g) => E(g, "other"),
        children: [
          /* @__PURE__ */ A("div", { className: "task-app__tag-header-row", children: [
            /* @__PURE__ */ h("h3", { className: "task-app__remaining-header", children: "Other Tasks" }),
            /* @__PURE__ */ h(
              "button",
              {
                className: "task-app__sort-btn task-app__sort-btn--active",
                onClick: () => I("other"),
                title: L(r.other || "desc"),
                children: O(r.other || "desc")
              }
            )
          ] }),
          /* @__PURE__ */ h("ul", { className: "task-app__list", children: C(b, r.other || "desc").map((g) => /* @__PURE__ */ h(
            ie,
            {
              task: g,
              pendingOperations: n,
              onComplete: o,
              onDelete: c,
              onAddTag: m,
              onDragStart: y,
              onDragEnd: p,
              selected: v ? v.has(g.id) : !1
            },
            g.id
          )) })
        ]
      }
    )
  ] });
}
function le({
  isOpen: a,
  title: e,
  onClose: s,
  onConfirm: r,
  children: t,
  inputValue: n,
  onInputChange: o,
  inputPlaceholder: c,
  confirmLabel: m = "Confirm",
  cancelLabel: y = "Cancel",
  confirmDisabled: p = !1,
  confirmDanger: v = !1
}) {
  return a ? /* @__PURE__ */ h(
    "div",
    {
      className: "modal-overlay",
      onClick: s,
      children: /* @__PURE__ */ A(
        "div",
        {
          className: "modal-card",
          onClick: (_) => _.stopPropagation(),
          children: [
            /* @__PURE__ */ h("h3", { children: e }),
            t,
            o && /* @__PURE__ */ h(
              "input",
              {
                type: "text",
                className: "modal-input",
                value: n || "",
                onChange: (_) => o(_.target.value),
                placeholder: c,
                autoFocus: !0,
                onKeyDown: (_) => {
                  _.key === "Enter" && !p && (_.preventDefault(), r()), _.key === "Escape" && (_.preventDefault(), s());
                }
              }
            ),
            /* @__PURE__ */ A("div", { className: "modal-actions", children: [
              /* @__PURE__ */ h(
                "button",
                {
                  className: "modal-button",
                  onClick: s,
                  children: y
                }
              ),
              /* @__PURE__ */ h(
                "button",
                {
                  className: `modal-button ${v ? "modal-button--danger" : "modal-button--primary"}`,
                  onClick: r,
                  disabled: p,
                  children: m
                }
              )
            ] })
          ]
        }
      )
    }
  ) : null;
}
function ke({ isOpen: a, x: e, y: s, items: r }) {
  return a ? /* @__PURE__ */ h(
    "div",
    {
      className: "board-context-menu",
      style: {
        left: `${e}px`,
        top: `${s}px`
      },
      children: r.map((t, n) => /* @__PURE__ */ h(
        "button",
        {
          className: `context-menu-item ${t.isDanger ? "context-menu-item--danger" : ""}`,
          onClick: t.onClick,
          children: t.label
        },
        n
      ))
    }
  ) : null;
}
function de(a) {
  let e = [];
  try {
    const s = a.getData("application/x-hadoku-task-ids");
    s && (e = JSON.parse(s));
  } catch {
  }
  if (e.length === 0) {
    const s = a.getData("text/plain");
    s && (e = [s]);
  }
  return e;
}
function st(a = {}) {
  const { basename: e = "/task", apiUrl: s, environment: r, userType: t = "public", userId: n = "public", sessionId: o } = a, [c, m] = N(/* @__PURE__ */ new Set()), [y, p] = N([]), [v, F] = N(null), [_, q] = N(!1), [j, Y] = N(!1), [E, I] = N(""), [C, O] = N("light"), [L, R] = N(!1), [U, G] = N(null), [P, V] = N(null), X = ue(null), i = ue(null), {
    tasks: l,
    pendingOperations: d,
    initialLoad: k,
    addTask: b,
    completeTask: f,
    deleteTask: g,
    addTagToTask: B,
    updateTaskTags: D,
    bulkUpdateTaskTags: $,
    clearTasksByTag: z,
    clearRemainingTasks: H,
    // board API
    boards: J,
    currentBoardId: se,
    createBoard: ne,
    deleteBoard: Te,
    switchBoard: he,
    moveTasksToBoard: pe,
    createTagOnBoard: ye,
    deleteTagOnBoard: we
  } = Qe({ userType: t, userId: n, sessionId: o }), S = Ze({
    tasks: l,
    onTaskUpdate: D,
    onBulkUpdate: $
  }), ae = et();
  ee(() => {
    ge(t, n, o).getPreferences().then((T) => {
      O(T.theme);
    });
  }, [t, n, o]), ee(() => {
    ge(t, n, o).savePreferences({ theme: C });
  }, [C, t, n, o]), ee(() => {
    console.log("[App] User context changed, initializing...", { userType: t, userId: n }), k(), X.current?.focus();
  }, [t, n]), ee(() => {
    i.current && i.current.setAttribute("data-theme", C);
  }, [C]), ee(() => {
    if (!L && !U && !P) return;
    const u = (T) => {
      const w = T.target;
      w.closest(".theme-picker") || R(!1), w.closest(".board-context-menu") || G(null), w.closest(".tag-context-menu") || V(null);
    };
    return document.addEventListener("mousedown", u), () => document.removeEventListener("mousedown", u);
  }, [L, U, P]);
  async function ve(u) {
    await b(u) && X.current && (X.current.value = "", X.current.focus());
  }
  function be(u) {
    const T = l.filter((w) => w.tag?.split(" ").includes(u));
    F({ tag: u, count: T.length });
  }
  async function Se(u) {
    const T = u.trim().replace(/\s+/g, "-");
    try {
      await ye(T);
      const w = window.__pendingTagTaskIds;
      if (w && w.length > 0) {
        const Q = w.map((x) => {
          const oe = l.find((Ce) => Ce.id === x)?.tag?.split(" ").filter(Boolean) || [], Ae = [.../* @__PURE__ */ new Set([...oe, T])];
          return { taskId: x, tag: Ae.join(" ") };
        });
        await $(Q), S.clearSelection(), delete window.__pendingTagTaskIds;
      }
    } catch (w) {
      throw console.error("[App] Failed to create tag:", w), w;
    }
  }
  async function _e(u) {
    const T = u.trim();
    try {
      const w = window.__pendingBoardTaskIds;
      await ne(T), w && w.length > 0 && (await pe(T, w), S.clearSelection(), delete window.__pendingBoardTaskIds);
    } catch (w) {
      throw console.error("[App] Failed to create board:", w), w;
    }
  }
  const De = J?.boards?.find((u) => u.id === se)?.tags || [], Be = We(l, 6);
  return /* @__PURE__ */ h(
    "div",
    {
      ref: i,
      className: "task-app-container",
      onMouseDown: S.selectionStartHandler,
      onMouseMove: S.selectionMoveHandler,
      onMouseUp: S.selectionEndHandler,
      onMouseLeave: S.selectionEndHandler,
      onClick: (u) => {
        try {
          const T = u.target;
          if (!T.closest || !T.closest(".task-app__item")) {
            try {
              const w = S.selectionJustEndedAt;
              if (w && Date.now() - w < 300)
                return;
            } catch {
            }
            S.clearSelection();
          }
        } catch {
        }
      },
      children: /* @__PURE__ */ A("div", { className: "task-app", children: [
        /* @__PURE__ */ A("div", { className: "task-app__header-container", children: [
          /* @__PURE__ */ h("h1", { className: "task-app__header", children: "Tasks" }),
          /* @__PURE__ */ A("div", { className: "theme-picker", children: [
            /* @__PURE__ */ h(
              "button",
              {
                className: "theme-toggle-btn",
                onClick: () => R(!L),
                "aria-label": "Choose theme",
                title: "Choose theme",
                children: C === "light" ? "☀️" : C === "dark" ? "🌙" : C === "strawberry" ? "🍓" : C === "ocean" ? "🌊" : C === "cyberpunk" ? "🤖" : C === "coffee" ? "☕" : "🪻"
              }
            ),
            L && /* @__PURE__ */ A("div", { className: "theme-picker__dropdown", children: [
              /* @__PURE__ */ h(
                "button",
                {
                  className: `theme-picker__option ${C === "light" ? "active" : ""}`,
                  onClick: () => {
                    O("light"), R(!1);
                  },
                  title: "Light theme",
                  children: "☀️"
                }
              ),
              /* @__PURE__ */ h(
                "button",
                {
                  className: `theme-picker__option ${C === "dark" ? "active" : ""}`,
                  onClick: () => {
                    O("dark"), R(!1);
                  },
                  title: "Dark theme",
                  children: "🌙"
                }
              ),
              /* @__PURE__ */ h(
                "button",
                {
                  className: `theme-picker__option ${C === "strawberry" ? "active" : ""}`,
                  onClick: () => {
                    O("strawberry"), R(!1);
                  },
                  title: "Strawberry theme",
                  children: "🍓"
                }
              ),
              /* @__PURE__ */ h(
                "button",
                {
                  className: `theme-picker__option ${C === "ocean" ? "active" : ""}`,
                  onClick: () => {
                    O("ocean"), R(!1);
                  },
                  title: "Ocean theme",
                  children: "🌊"
                }
              ),
              /* @__PURE__ */ h(
                "button",
                {
                  className: `theme-picker__option ${C === "cyberpunk" ? "active" : ""}`,
                  onClick: () => {
                    O("cyberpunk"), R(!1);
                  },
                  title: "Cyberpunk theme",
                  children: "🤖"
                }
              ),
              /* @__PURE__ */ h(
                "button",
                {
                  className: `theme-picker__option ${C === "coffee" ? "active" : ""}`,
                  onClick: () => {
                    O("coffee"), R(!1);
                  },
                  title: "Coffee theme",
                  children: "☕"
                }
              ),
              /* @__PURE__ */ h(
                "button",
                {
                  className: `theme-picker__option ${C === "lavender" ? "active" : ""}`,
                  onClick: () => {
                    O("lavender"), R(!1);
                  },
                  title: "Lavender theme",
                  children: "🪻"
                }
              )
            ] })
          ] })
        ] }),
        /* @__PURE__ */ A("div", { className: "task-app__boards", children: [
          /* @__PURE__ */ h("div", { className: "task-app__board-list", children: (J && J.boards ? J.boards.slice(0, 5) : [{ id: "main", name: "main" }]).map((u) => /* @__PURE__ */ h(
            "button",
            {
              className: `board-btn ${se === u.id ? "board-btn--active" : ""} ${S.dragOverFilter === `board:${u.id}` ? "board-btn--drag-over" : ""}`,
              onClick: () => he(u.id),
              onContextMenu: (T) => {
                T.preventDefault(), u.id !== "main" && G({ boardId: u.id, x: T.clientX, y: T.clientY });
              },
              onTouchStart: (T) => {
                if (u.id === "main") return;
                const w = setTimeout(() => {
                  const Q = T.touches[0];
                  G({ boardId: u.id, x: Q.clientX, y: Q.clientY });
                }, 500);
                T.currentTarget.__longPressTimer = w;
              },
              onTouchEnd: (T) => {
                const w = T.currentTarget.__longPressTimer;
                w && (clearTimeout(w), T.currentTarget.__longPressTimer = null);
              },
              onTouchMove: (T) => {
                const w = T.currentTarget.__longPressTimer;
                w && (clearTimeout(w), T.currentTarget.__longPressTimer = null);
              },
              "aria-pressed": se === u.id ? "true" : "false",
              onDragOver: (T) => {
                T.preventDefault(), T.dataTransfer.dropEffect = "move";
                try {
                  S.setDragOverFilter?.(`board:${u.id}`);
                } catch {
                }
              },
              onDragLeave: (T) => {
                try {
                  S.setDragOverFilter?.(null);
                } catch {
                }
              },
              onDrop: async (T) => {
                T.preventDefault();
                try {
                  S.setDragOverFilter?.(null);
                } catch {
                }
                const w = de(T.dataTransfer);
                if (w.length !== 0)
                  try {
                    await pe(u.id, w);
                    try {
                      S.clearSelection();
                    } catch {
                    }
                  } catch (Q) {
                    console.error("Failed moving tasks to board", Q), alert(Q.message || "Failed to move tasks");
                  }
              },
              children: u.name
            },
            u.id
          )) }),
          /* @__PURE__ */ h("div", { className: "task-app__board-actions", children: (!J || J.boards && J.boards.length < 5) && /* @__PURE__ */ h(
            "button",
            {
              className: `board-add-btn ${S.dragOverFilter === "add-board" ? "board-btn--drag-over" : ""}`,
              onClick: () => {
                I(""), q(!0);
              },
              onDragOver: (u) => {
                u.preventDefault(), u.dataTransfer.dropEffect = "move";
                try {
                  S.setDragOverFilter?.("add-board");
                } catch {
                }
              },
              onDragLeave: (u) => {
                try {
                  S.setDragOverFilter?.(null);
                } catch {
                }
              },
              onDrop: async (u) => {
                u.preventDefault();
                try {
                  S.setDragOverFilter?.(null);
                } catch {
                }
                const T = de(u.dataTransfer);
                T.length > 0 && (I(""), window.__pendingBoardTaskIds = T, q(!0));
              },
              "aria-label": "Create board",
              children: "＋"
            }
          ) })
        ] }),
        /* @__PURE__ */ h("div", { className: "task-app__controls", children: /* @__PURE__ */ h(
          "input",
          {
            ref: X,
            className: "task-app__input",
            placeholder: "Type a task and press Enter…",
            onKeyDown: (u) => {
              u.key === "Enter" && !u.shiftKey && (u.preventDefault(), ve(u.target.value)), u.key === "k" && (u.ctrlKey || u.metaKey) && (u.preventDefault(), X.current?.focus());
            }
          }
        ) }),
        /* @__PURE__ */ A("div", { className: "task-app__filters", children: [
          (() => {
            const u = re(l);
            return Array.from(/* @__PURE__ */ new Set([...De, ...u, ...y])).map((w) => {
              const Q = c.has(w);
              return /* @__PURE__ */ A(
                "button",
                {
                  onClick: () => {
                    m((x) => {
                      const K = new Set(x);
                      return K.has(w) ? K.delete(w) : K.add(w), K;
                    });
                  },
                  onContextMenu: (x) => {
                    x.preventDefault(), V({ tag: w, x: x.clientX, y: x.clientY });
                  },
                  onTouchStart: (x) => {
                    const K = setTimeout(() => {
                      const oe = x.touches[0];
                      V({ tag: w, x: oe.clientX, y: oe.clientY });
                    }, 500);
                    x.currentTarget.__longPressTimer = K;
                  },
                  onTouchEnd: (x) => {
                    const K = x.currentTarget.__longPressTimer;
                    K && (clearTimeout(K), x.currentTarget.__longPressTimer = null);
                  },
                  onTouchMove: (x) => {
                    const K = x.currentTarget.__longPressTimer;
                    K && (clearTimeout(K), x.currentTarget.__longPressTimer = null);
                  },
                  className: `${Q ? "on" : ""} ${S.dragOverFilter === w ? "task-app__filter-drag-over" : ""}`,
                  onDragOver: (x) => S.onFilterDragOver(x, w),
                  onDragLeave: S.onFilterDragLeave,
                  onDrop: (x) => S.onFilterDrop(x, w),
                  children: [
                    "#",
                    w
                  ]
                },
                w
              );
            });
          })(),
          /* @__PURE__ */ h(
            "button",
            {
              className: `task-app__filter-add ${S.dragOverFilter === "add-tag" ? "task-app__filter-drag-over" : ""}`,
              onClick: () => {
                I(""), Y(!0);
              },
              onDragOver: (u) => {
                u.preventDefault(), u.dataTransfer.dropEffect = "copy", S.onFilterDragOver(u, "add-tag");
              },
              onDragLeave: S.onFilterDragLeave,
              onDrop: async (u) => {
                u.preventDefault(), S.onFilterDragLeave(u);
                const T = de(u.dataTransfer);
                T.length > 0 && (I(""), window.__pendingTagTaskIds = T, Y(!0));
              },
              "aria-label": "Add tag",
              children: "＋"
            }
          )
        ] }),
        /* @__PURE__ */ h(
          at,
          {
            tasks: l,
            topTags: Be,
            filters: Array.from(c),
            selectedIds: S.selectedIds,
            onSelectionStart: S.selectionStartHandler,
            onSelectionMove: S.selectionMoveHandler,
            onSelectionEnd: S.selectionEndHandler,
            sortDirections: ae.sortDirections,
            dragOverTag: S.dragOverTag,
            pendingOperations: d,
            onComplete: f,
            onDelete: g,
            onAddTag: B,
            onDragStart: S.onDragStart,
            onDragEnd: S.onDragEnd,
            onDragOver: S.onDragOver,
            onDragLeave: S.onDragLeave,
            onDrop: S.onDrop,
            toggleSort: ae.toggleSort,
            sortTasksByAge: ae.sortTasksByAge,
            getSortIcon: ae.getSortIcon,
            getSortTitle: ae.getSortTitle,
            clearTasksByTag: be,
            clearRemainingTasks: H,
            onDeletePersistedTag: we
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
          le,
          {
            isOpen: !!v,
            title: `Clear Tag #${v?.tag}?`,
            onClose: () => F(null),
            onConfirm: async () => {
              if (!v) return;
              const u = v.tag;
              F(null), await z(u);
            },
            confirmLabel: "Clear Tag",
            confirmDanger: !0,
            children: v && /* @__PURE__ */ A("p", { children: [
              "This will remove ",
              /* @__PURE__ */ A("strong", { children: [
                "#",
                v.tag
              ] }),
              " from",
              " ",
              /* @__PURE__ */ A("strong", { children: [
                v.count,
                " task(s)"
              ] }),
              " and delete the tag from the board."
            ] })
          }
        ),
        /* @__PURE__ */ h(
          le,
          {
            isOpen: _,
            title: "Create New Board",
            onClose: () => {
              q(!1), delete window.__pendingBoardTaskIds;
            },
            onConfirm: async () => {
              if (E.trim()) {
                q(!1);
                try {
                  await _e(E);
                } catch (u) {
                  console.error("[App] Failed to create board:", u);
                }
              }
            },
            inputValue: E,
            onInputChange: I,
            inputPlaceholder: "Board name",
            confirmLabel: "Create",
            confirmDisabled: !E.trim(),
            children: (() => {
              const u = window.__pendingBoardTaskIds;
              return u && u.length > 0 ? /* @__PURE__ */ A("p", { className: "modal-hint", children: [
                u.length,
                " task",
                u.length > 1 ? "s" : "",
                " will be moved to this board"
              ] }) : null;
            })()
          }
        ),
        /* @__PURE__ */ A(
          le,
          {
            isOpen: j,
            title: "Create New Tag",
            onClose: () => {
              Y(!1), delete window.__pendingTagTaskIds;
            },
            onConfirm: async () => {
              if (E.trim()) {
                Y(!1);
                try {
                  await Se(E);
                } catch (u) {
                  console.error("[App] Failed to create tag:", u);
                }
              }
            },
            inputValue: E,
            onInputChange: I,
            inputPlaceholder: "Enter new tag name",
            confirmLabel: "Create",
            confirmDisabled: !E.trim(),
            children: [
              (() => {
                const u = window.__pendingTagTaskIds;
                return u && u.length > 0 ? /* @__PURE__ */ A("p", { className: "modal-hint", children: [
                  "This tag will be applied to ",
                  u.length,
                  " task",
                  u.length > 1 ? "s" : ""
                ] }) : null;
              })(),
              re(l).length > 0 && /* @__PURE__ */ A("div", { className: "modal-section", children: [
                /* @__PURE__ */ h("label", { className: "modal-label", children: "Existing tags:" }),
                /* @__PURE__ */ h("div", { className: "modal-tags-list", children: re(l).map((u) => /* @__PURE__ */ A("span", { className: "modal-tag-chip", children: [
                  "#",
                  u
                ] }, u)) })
              ] })
            ]
          }
        ),
        /* @__PURE__ */ h(
          ke,
          {
            isOpen: !!U,
            x: U?.x || 0,
            y: U?.y || 0,
            items: [
              {
                label: "🗑️ Delete Board",
                isDanger: !0,
                onClick: async () => {
                  if (!U) return;
                  const u = J?.boards?.find((T) => T.id === U.boardId)?.name || U.boardId;
                  if (confirm(`Delete board "${u}"? All tasks on this board will be permanently deleted.`))
                    try {
                      await Te(U.boardId), G(null);
                    } catch (T) {
                      console.error("[App] Failed to delete board:", T), alert(T.message || "Failed to delete board");
                    }
                }
              }
            ]
          }
        ),
        /* @__PURE__ */ h(
          ke,
          {
            isOpen: !!P,
            x: P?.x || 0,
            y: P?.y || 0,
            items: [
              {
                label: "🗑️ Delete Tag",
                isDanger: !0,
                onClick: async () => {
                  if (!P) return;
                  const u = l.filter((T) => T.tag?.split(" ").includes(P.tag));
                  if (confirm(`Delete tag "${P.tag}" and remove it from ${u.length} task(s)?`))
                    try {
                      await z(P.tag), V(null);
                    } catch (T) {
                      console.error("[App] Failed to delete tag:", T), alert(T.message || "Failed to delete tag");
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
function it(a, e = {}) {
  const s = new URLSearchParams(window.location.search), r = e.userType || s.get("userType") || "public", t = e.userId || s.get("userId") || "public", n = e.sessionId, o = { ...e, userType: r, userId: t, sessionId: n }, c = Ne(a);
  c.render(/* @__PURE__ */ h(st, { ...o })), a.__root = c, console.log("[task-app] Mounted successfully", o);
}
function lt(a) {
  a.__root?.unmount();
}
export {
  it as mount,
  lt as unmount
};
