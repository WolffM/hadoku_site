import { jsx as h, jsxs as A, Fragment as Le } from "react/jsx-runtime";
import { createRoot as Pe } from "react-dom/client";
import { useState as C, useMemo as Ie, useEffect as Q, useRef as oe } from "react";
const j = `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
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
function je() {
  const t = Date.now().toString(36).toUpperCase().padStart(8, "0"), e = crypto.getRandomValues(new Uint8Array(18)), a = Array.from(e).map((o) => (o % 36).toString(36).toUpperCase()).join("");
  return t + a;
}
function Z() {
  return (/* @__PURE__ */ new Date()).toISOString();
}
function pe(t, e) {
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
function Ue(t, e, a) {
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
function He(t, e, a) {
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
function Ke(t, e, a) {
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
  const s = Z(), n = await t.getTasks(e.userType, e.userId, o), r = await t.getStats(e.userType, e.userId, o), c = a.id || je(), p = {
    id: c,
    title: a.title,
    tag: a.tag ?? null,
    state: "Active",
    createdAt: s
  }, f = {
    ...n,
    tasks: [p, ...n.tasks],
    updatedAt: s
  }, d = Je(r, p, s);
  return await t.saveTasks(e.userType, e.userId, o, f), await t.saveStats(e.userType, e.userId, o, d), { ok: !0, id: c };
}
async function Ye(t, e, a, o, s = "main") {
  const n = Z(), r = await t.getTasks(e.userType, e.userId, s), c = await t.getStats(e.userType, e.userId, s), { task: p, index: f } = pe(r, a), d = {
    ...p,
    ...o,
    updatedAt: n
  }, y = [...r.tasks];
  y[f] = d;
  const D = {
    ...r,
    tasks: y,
    updatedAt: n
  }, b = He(c, d, n);
  return await t.saveTasks(e.userType, e.userId, s, D), await t.saveStats(e.userType, e.userId, s, b), { ok: !0, message: `Task ${a} updated` };
}
async function ze(t, e, a, o = "main") {
  const s = Z(), n = await t.getTasks(e.userType, e.userId, o), r = await t.getStats(e.userType, e.userId, o), { task: c, index: p } = pe(n, a), f = {
    ...c,
    state: "Completed",
    closedAt: s,
    updatedAt: s
  }, d = [...n.tasks];
  d.splice(p, 1);
  const y = {
    ...n,
    tasks: d,
    updatedAt: s
  }, D = Ue(r, f, s);
  return await t.saveTasks(e.userType, e.userId, o, y), await t.saveStats(e.userType, e.userId, o, D), { ok: !0, message: `Task ${a} completed` };
}
async function Ve(t, e, a, o = "main") {
  const s = Z(), n = await t.getTasks(e.userType, e.userId, o), r = await t.getStats(e.userType, e.userId, o), { task: c, index: p } = pe(n, a), f = {
    ...c,
    state: "Deleted",
    closedAt: s,
    updatedAt: s
  }, d = [...n.tasks];
  d.splice(p, 1);
  const y = {
    ...n,
    tasks: d,
    updatedAt: s
  }, D = Ke(r, f, s);
  return await t.saveTasks(e.userType, e.userId, o, y), await t.saveStats(e.userType, e.userId, o, D), { ok: !0, message: `Task ${a} deleted` };
}
async function We(t, e, a) {
  const o = Z(), s = await t.getBoards(e.userType, e.userId);
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
  const o = Z(), s = await t.getBoards(e.userType, e.userId);
  me(s, a);
  const n = {
    ...s,
    updatedAt: o,
    boards: s.boards.filter((r) => r.id !== a)
  };
  return await t.saveBoards(e.userType, n, e.userId), { ok: !0, message: `Board ${a} deleted` };
}
async function Qe(t, e, a) {
  const o = Z(), s = await t.getBoards(e.userType, e.userId), { board: n, index: r } = me(s, a.boardId), c = n.tags || [];
  if (c.includes(a.tag))
    return { ok: !0, message: `Tag ${a.tag} already exists` };
  const p = {
    ...n,
    tags: [...c, a.tag]
  }, f = Se(s, r, p, o);
  return await t.saveBoards(e.userType, f, e.userId), { ok: !0, message: `Tag ${a.tag} added to board ${a.boardId}` };
}
async function Ze(t, e, a) {
  const o = Z(), s = await t.getBoards(e.userType, e.userId), { board: n, index: r } = me(s, a.boardId), c = n.tags || [], p = {
    ...n,
    tags: c.filter((d) => d !== a.tag)
  }, f = Se(s, r, p, o);
  return await t.saveBoards(e.userType, f, e.userId), { ok: !0, message: `Tag ${a.tag} removed from board ${a.boardId}` };
}
function G(t, e, a = 50) {
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
  const a = new Re(t, e), o = { userType: "registered", userId: e };
  return {
    async getBoards() {
      const s = await Xe(a, o), n = {
        version: s.version,
        updatedAt: s.updatedAt,
        boards: []
      };
      for (const r of s.boards) {
        const c = await a.getTasks(t, e, r.id), p = await a.getStats(t, e, r.id);
        n.boards.push({
          id: r.id,
          name: r.name,
          tasks: c.tasks,
          stats: p,
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
      }), G("boards-updated", { sessionId: j, userType: t, userId: e }), n.board;
    },
    async deleteBoard(s) {
      await Ge(
        a,
        o,
        s
      ), await a.deleteBoardData(t, e, s), G("boards-updated", { sessionId: j, userType: t, userId: e });
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
      ), f = (await a.getTasks(t, e, n)).tasks.find((d) => d.id === c.id);
      if (!f)
        throw new Error("Task creation failed - task not found after creation");
      return r ? console.log("[localStorageApi] createTask: broadcast suppressed") : (console.log("[localStorageApi] createTask: broadcasting", {
        sessionId: j,
        boardId: n,
        taskId: c.id
      }), G("tasks-updated", { sessionId: j, userType: t, userId: e, boardId: n })), f;
    },
    async patchTask(s, n, r = "main", c = !1) {
      const p = {};
      n.title !== void 0 && (p.title = n.title), n.tag !== void 0 && n.tag !== null && (p.tag = n.tag), await Ye(
        a,
        o,
        s,
        p,
        r
      ), c || G("tasks-updated", { sessionId: j, userType: t, userId: e, boardId: r });
      const d = (await a.getTasks(t, e, r)).tasks.find((y) => y.id === s);
      if (!d)
        throw new Error("Task not found after update");
      return d;
    },
    async completeTask(s, n = "main") {
      await ze(
        a,
        o,
        s,
        n
      ), G("tasks-updated", { sessionId: j, userType: t, userId: e, boardId: n });
      const c = (await a.getTasks(t, e, n)).tasks.find((p) => p.id === s);
      if (!c)
        throw new Error("Task not found after completion");
      return c;
    },
    async deleteTask(s, n = "main", r = !1) {
      console.log("[localStorageApi] deleteTask (using handler)", { id: s, boardId: n, suppressBroadcast: r });
      const p = (await a.getTasks(t, e, n)).tasks.find((f) => f.id === s);
      if (!p)
        throw new Error("Task not found");
      return await Ve(
        a,
        o,
        s,
        n
      ), r ? console.log("[localStorageApi] deleteTask: broadcast suppressed") : (console.log("[localStorageApi] deleteTask: broadcasting", { sessionId: j }), G("tasks-updated", { sessionId: j, userType: t, userId: e, boardId: n })), {
        ...p,
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
      ), G("boards-updated", { sessionId: j, userType: t, userId: e, boardId: n });
    },
    async deleteTag(s, n = "main") {
      await Ze(
        a,
        o,
        { boardId: n, tag: s }
      ), G("boards-updated", { sessionId: j, userType: t, userId: e, boardId: n });
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
    }
  };
}
async function tt(t, e, a, o) {
  for (const r of e.boards || []) {
    const c = r.id;
    if (r.tasks && r.tasks.length > 0) {
      const p = `${a}-${o}-${c}-tasks`, f = {
        version: 1,
        updatedAt: e.updatedAt || (/* @__PURE__ */ new Date()).toISOString(),
        tasks: r.tasks
      };
      window.localStorage.setItem(p, JSON.stringify(f));
    }
    if (r.stats) {
      const p = `${a}-${o}-${c}-stats`;
      window.localStorage.setItem(p, JSON.stringify(r.stats));
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
function X(t, e, a) {
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
          headers: X(t, e, a)
        });
        if (!s.ok)
          throw new Error(`API returned ${s.status}`);
        const n = await s.json();
        if (!n || !n.boards || !Array.isArray(n.boards)) {
          console.error("[api] Invalid response structure:", n);
          return;
        }
        console.log("[api] Synced from API:", { boards: n.boards.length, totalTasks: n.boards.reduce((r, c) => r + (c.tasks?.length || 0), 0) }), await tt(o, n, t, e);
      } catch (s) {
        console.error("[api] Sync from API failed:", s);
      }
    },
    async createTask(s, n = "main", r = !1) {
      const c = await o.createTask(s, n, r);
      return fetch("/task/api", {
        method: "POST",
        headers: X(t, e, a),
        body: JSON.stringify({
          id: c.id,
          // Send client ID to server
          ...s,
          boardId: n
        })
      }).then((p) => p.json()).then((p) => {
        p.ok && (p.id === c.id ? console.log("[api] Background sync: createTask completed (ID matched)") : console.warn("[api] Server returned different ID (unexpected):", { client: c.id, server: p.id }));
      }).catch((p) => console.error("[api] Failed to sync createTask:", p)), c;
    },
    async createTag(s, n = "main") {
      const r = await o.createTag(s, n);
      return fetch("/task/api/tags", {
        method: "POST",
        headers: X(t, e, a),
        body: JSON.stringify({ boardId: n, tag: s })
      }).then(() => console.log("[api] Background sync: createTag completed")).catch((c) => console.error("[api] Failed to sync createTag:", c)), r;
    },
    async deleteTag(s, n = "main") {
      const r = await o.deleteTag(s, n);
      return fetch("/task/api/tags", {
        method: "DELETE",
        headers: X(t, e, a),
        body: JSON.stringify({ boardId: n, tag: s })
      }).then(() => console.log("[api] Background sync: deleteTag completed")).catch((c) => console.error("[api] Failed to sync deleteTag:", c)), r;
    },
    async patchTask(s, n, r = "main", c = !1) {
      const p = await o.patchTask(s, n, r, c);
      return fetch(`/task/api/${s}`, {
        method: "PATCH",
        headers: X(t, e, a),
        body: JSON.stringify({ ...n, boardId: r })
      }).then(() => console.log("[api] Background sync: patchTask completed")).catch((f) => console.error("[api] Failed to sync patchTask:", f)), p;
    },
    async completeTask(s, n = "main") {
      const r = await o.completeTask(s, n);
      return fetch(`/task/api/${s}/complete`, {
        method: "POST",
        headers: X(t, e, a),
        body: JSON.stringify({ boardId: n })
      }).then(() => console.log("[api] Background sync: completeTask completed")).catch((c) => console.error("[api] Failed to sync completeTask:", c)), r;
    },
    async deleteTask(s, n = "main", r = !1) {
      await o.deleteTask(s, n, r), fetch(`/task/api/${s}`, {
        method: "DELETE",
        headers: X(t, e, a),
        body: JSON.stringify({ boardId: n })
      }).then(() => console.log("[api] Background sync: deleteTask completed")).catch((c) => console.error("[api] Failed to sync deleteTask:", c));
    },
    // Board operations
    async createBoard(s) {
      const n = await o.createBoard(s);
      return fetch("/task/api/boards", {
        method: "POST",
        headers: X(t, e, a),
        body: JSON.stringify({ id: s, name: s })
      }).then(() => console.log("[api] Background sync: createBoard completed")).catch((r) => console.error("[api] Failed to sync createBoard:", r)), n;
    },
    async deleteBoard(s) {
      const n = await o.deleteBoard(s);
      return fetch(`/task/api/boards/${encodeURIComponent(s)}`, {
        method: "DELETE",
        headers: X(t, e, a)
      }).then(() => console.log("[api] Background sync: deleteBoard completed")).catch((r) => console.error("[api] Failed to sync deleteBoard:", r)), n;
    },
    // User preferences
    async getPreferences() {
      return await o.getPreferences();
    },
    async savePreferences(s) {
      await o.savePreferences(s), fetch("/task/api/preferences", {
        method: "PUT",
        headers: X(t, e, a),
        body: JSON.stringify(s)
      }).then(() => console.log("[api] Background sync: savePreferences completed")).catch((n) => console.error("[api] Failed to sync savePreferences:", n));
    }
  };
}
function at(t) {
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
function st(t, e = 6, a = []) {
  const o = t.flatMap((n) => n.tag?.split(" ") || []).filter(Boolean), s = {};
  return o.forEach((n) => s[n] = (s[n] || 0) + 1), a.filter(Boolean).forEach((n) => {
    s[n] || (s[n] = 0);
  }), Object.entries(s).sort((n, r) => r[1] - n[1]).slice(0, e).map(([n]) => n);
}
function Te(t, e) {
  return t.filter((a) => a.tag?.split(" ").includes(e));
}
function nt(t, e, a) {
  const o = Array.isArray(a) && a.length > 0;
  return t.filter((s) => {
    const n = s.tag?.split(" ") || [];
    return o ? a.some((c) => n.includes(c)) && !e.some((c) => n.includes(c)) : !e.some((r) => n.includes(r));
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
async function he(t, e, a, o, s = {}) {
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
      const p = new Set(c);
      return p.delete(t), p;
    });
  }
}
async function ie(t, e, a) {
  await t(), console.log("[withBulkOperation] Broadcasting bulk update with delay"), ot(j, e, a);
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
  const [o, s] = C([]), [n, r] = C(/* @__PURE__ */ new Set()), c = Ie(
    () => ue(t, e || "public", a),
    [t, e, a]
  ), [p, f] = C(null), [d, y] = C("main");
  async function D() {
    console.log("[useTasks] initialLoad called"), "syncFromApi" in c && await c.syncFromApi(), await b();
  }
  async function b() {
    console.log("[useTasks] reload called", { currentBoardId: d, stack: new Error().stack?.split(`
`).slice(1, 4).join(`
`) });
    const i = await c.getBoards();
    f(i);
    const { tasks: l } = ae(i, d);
    s(l);
  }
  Q(() => {
    console.log("[useTasks] User context changed, clearing state and reloading", { userType: t, userId: e }), s([]), r(/* @__PURE__ */ new Set()), f(null), y("main"), b();
  }, [t, e]), Q(() => {
    console.log("[useTasks] Setting up BroadcastChannel listener", { currentBoardId: d, userType: t, userId: e });
    try {
      const i = new BroadcastChannel("tasks");
      return i.onmessage = (l) => {
        const m = l.data || {};
        if (console.log("[useTasks] BroadcastChannel message received", { msg: m, sessionId: j, currentBoardId: d, currentContext: { userType: t, userId: e } }), m.sessionId === j) {
          console.log("[useTasks] Ignoring own broadcast message");
          return;
        }
        if (m.userType !== t || m.userId !== e) {
          console.log("[useTasks] Ignoring message for different user context", {
            msgContext: { userType: m.userType, userId: m.userId },
            currentContext: { userType: t, userId: e }
          });
          return;
        }
        (m.type === "tasks-updated" || m.type === "boards-updated") && (console.log("[useTasks] BroadcastChannel: triggering reload for currentBoardId =", d), b());
      }, () => {
        console.log("[useTasks] Cleaning up BroadcastChannel listener", { currentBoardId: d }), i.close();
      };
    } catch (i) {
      console.error("[useTasks] Failed to setup BroadcastChannel", i);
    }
  }, [d, t, e]);
  async function F(i) {
    if (i = i.trim(), !!i)
      try {
        const l = at(i);
        return await c.createTask(l, d), await b(), !0;
      } catch (l) {
        return alert(l.message || "Failed to create task"), !1;
      }
  }
  async function $(i) {
    await he(
      `complete-${i}`,
      n,
      r,
      async () => {
        await c.completeTask(i, d), await b();
      },
      {
        onError: (l) => alert(l.message || "Failed to complete task")
      }
    );
  }
  async function q(i) {
    console.log("[useTasks] deleteTask START", { taskId: i, currentBoardId: d }), await he(
      `delete-${i}`,
      n,
      r,
      async () => {
        console.log("[useTasks] deleteTask: calling api.deleteTask", { taskId: i, currentBoardId: d }), await c.deleteTask(i, d), console.log("[useTasks] deleteTask: calling reload"), await b(), console.log("[useTasks] deleteTask END");
      },
      {
        onError: (l) => alert(l.message || "Failed to delete task")
      }
    );
  }
  async function M(i) {
    const l = prompt("Enter tag (without #):");
    if (!l) return;
    const m = l.trim().replace(/^#+/, "").replace(/\s+/g, "-"), T = o.find((u) => u.id === i);
    if (!T) return;
    const v = T.tag?.split(" ") || [];
    if (v.includes(m)) return;
    const k = [...v, m].join(" ");
    try {
      await c.patchTask(i, { tag: k }, d), await b();
    } catch (u) {
      alert(u.message || "Failed to add tag");
    }
  }
  async function L(i, l, m = {}) {
    const { suppressBroadcast: T = !1, skipReload: v = !1 } = m;
    try {
      await c.patchTask(i, l, d, T), v || await b();
    } catch (k) {
      throw k;
    }
  }
  async function H(i) {
    console.log("[useTasks] bulkUpdateTaskTags START", { count: i.length });
    try {
      await ie(async () => {
        for (const { taskId: l, tag: m } of i)
          await c.patchTask(l, { tag: m }, d, !0);
      }, t, e), console.log("[useTasks] bulkUpdateTaskTags: calling reload"), await b(), console.log("[useTasks] bulkUpdateTaskTags END");
    } catch (l) {
      throw console.error("[useTasks] bulkUpdateTaskTags ERROR", l), l;
    }
  }
  async function J(i) {
    console.log("[useTasks] clearTasksByTag START", { tag: i, currentBoardId: d, taskCount: o.length });
    const l = o.filter((m) => m.tag?.split(" ").includes(i));
    if (console.log("[useTasks] clearTasksByTag: found tasks with tag", { tag: i, count: l.length }), l.length === 0) {
      console.log("[useTasks] clearTasksByTag: no tasks found with this tag, just deleting tag");
      try {
        await c.deleteTag(i, d), await b(), console.log("[useTasks] clearTasksByTag END (no tasks to clear)");
      } catch (m) {
        console.error("[useTasks] clearTasksByTag ERROR", m), console.error("[useTasks] clearTasksByTag: Please fix this error:", m.message);
      }
      return;
    }
    console.log("[useTasks] clearTasksByTag: proceeding without confirmation (dialogs blocked)", { taskCount: l.length });
    try {
      console.log("[useTasks] clearTasksByTag: starting to patch tasks"), await ie(async () => {
        for (const m of l) {
          const T = m.tag?.split(" ") || [], v = T.filter((u) => u !== i), k = v.length > 0 ? v.join(" ") : null;
          console.log("[useTasks] clearTasksByTag: patching task", { taskId: m.id, oldTags: T, newTags: v }), await c.patchTask(m.id, { tag: k }, d, !0);
        }
        console.log("[useTasks] clearTasksByTag: deleting tag from board", { tag: i, currentBoardId: d }), await c.deleteTag(i, d);
      }, t, e), console.log("[useTasks] clearTasksByTag: calling reload"), await b(), console.log("[useTasks] clearTasksByTag END");
    } catch (m) {
      console.error("[useTasks] clearTasksByTag ERROR", m), alert(m.message || "Failed to remove tag from tasks");
    }
  }
  async function R(i) {
    if (confirm("Clear all remaining tasks?"))
      try {
        for (const l of i)
          await c.deleteTask(l.id, d);
        await b();
      } catch (l) {
        alert(l.message || "Failed to clear remaining tasks");
      }
  }
  async function P(i) {
    await c.createBoard(i), y(i);
    const l = await c.getBoards();
    f(l);
    const { tasks: m } = ae(l, i);
    s(m);
  }
  async function V(i, l) {
    if (console.log("[useTasks] moveTasksToBoard START", { targetBoardId: i, ids: l, currentBoardId: d }), !p) return;
    const m = [];
    for (const k of p.boards)
      for (const u of k.tasks || [])
        l.includes(u.id) && m.push({ id: u.id, title: u.title, tag: u.tag || void 0, boardId: k.id });
    console.log("[useTasks] moveTasksToBoard: found tasks to move", { count: m.length }), await ie(async () => {
      for (const k of m)
        await c.createTask({ title: k.title, tag: k.tag }, i, !0), await c.deleteTask(k.id, k.boardId, !0);
    }, t, e), console.log("[useTasks] moveTasksToBoard: switching to target board", { targetBoardId: i }), y(i);
    const T = await c.getBoards();
    f(T);
    const { tasks: v } = ae(T, i);
    s(v), console.log("[useTasks] moveTasksToBoard END");
  }
  async function I(i) {
    if (await c.deleteBoard(i), d === i) {
      y("main");
      const l = await c.getBoards();
      f(l);
      const { tasks: m } = ae(l, "main");
      s(m);
    } else
      await b();
  }
  async function Y(i) {
    await c.createTag(i, d), await b();
  }
  async function U(i) {
    await c.deleteTag(i, d), await b();
  }
  function z(i) {
    y(i);
    const { tasks: l, foundBoard: m } = ae(p, i);
    m ? s(l) : b();
  }
  return {
    // Task state
    tasks: o,
    pendingOperations: n,
    // Task operations
    addTask: F,
    completeTask: $,
    deleteTask: q,
    addTagToTask: M,
    updateTaskTags: L,
    bulkUpdateTaskTags: H,
    clearTasksByTag: J,
    clearRemainingTasks: R,
    // Board state
    boards: p,
    currentBoardId: d,
    // Board operations
    createBoard: P,
    deleteBoard: I,
    switchBoard: z,
    moveTasksToBoard: V,
    createTagOnBoard: Y,
    deleteTagOnBoard: U,
    // Lifecycle
    initialLoad: D,
    reload: b
  };
}
function ct({ tasks: t, onTaskUpdate: e, onBulkUpdate: a }) {
  const [o, s] = C(null), [n, r] = C(null), [c, p] = C(/* @__PURE__ */ new Set()), [f, d] = C(!1), [y, D] = C(null), [b, F] = C(null), $ = oe(null);
  function q(i, l) {
    const m = c.has(l) && c.size > 0 ? Array.from(c) : [l];
    console.log("[useDragAndDrop] onDragStart", { taskId: l, idsToDrag: m, selectedCount: c.size }), i.dataTransfer.setData("text/plain", m[0]);
    try {
      i.dataTransfer.setData("application/x-hadoku-task-ids", JSON.stringify(m));
    } catch {
    }
    i.dataTransfer.effectAllowed = "copyMove";
    try {
      const T = i.currentTarget, v = T.closest && T.closest(".task-app__item") ? T.closest(".task-app__item") : T;
      v.classList.add("dragging");
      const k = v.cloneNode(!0);
      k.style.boxSizing = "border-box", k.style.width = `${v.offsetWidth}px`, k.style.height = `${v.offsetHeight}px`, k.style.opacity = "0.95", k.style.transform = "none", k.style.filter = "drop-shadow(0 6px 18px rgba(0,0,0,0.12))", k.classList.add("drag-image"), k.style.position = "absolute", k.style.top = "-9999px", k.style.left = "-9999px", document.body.appendChild(k), v.__dragImage = k, p((u) => {
        if (u.has(l)) return new Set(u);
        const _ = new Set(u);
        return _.add(l), _;
      });
      try {
        const u = v.closest(".task-app__tag-column");
        if (u) {
          const _ = u.querySelector(".task-app__tag-header") || u.querySelector("h3"), N = (_ && _.textContent || "").trim().replace(/^#/, "");
          if (N)
            try {
              i.dataTransfer.setData("application/x-hadoku-task-source", N);
            } catch {
            }
        }
      } catch {
      }
      try {
        const u = v.getBoundingClientRect();
        let _ = Math.round(i.clientX - u.left), B = Math.round(i.clientY - u.top);
        _ = Math.max(0, Math.min(Math.round(k.offsetWidth - 1), _)), B = Math.max(0, Math.min(Math.round(k.offsetHeight - 1), B)), i.dataTransfer.setDragImage(k, _, B);
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
      const m = l.__dragImage;
      m && m.parentNode && m.parentNode.removeChild(m), m && delete l.__dragImage;
    } catch {
    }
    try {
      R();
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
      d(!0), $.current = { x: i.clientX, y: i.clientY }, D({ x: i.clientX, y: i.clientY, w: 0, h: 0 }), p(/* @__PURE__ */ new Set());
      try {
        document.body.classList.add("marquee-selecting");
      } catch {
      }
    }
  }
  function H(i) {
    if (!f || !$.current) return;
    const l = $.current.x, m = $.current.y, T = i.clientX, v = i.clientY, k = Math.min(l, T), u = Math.min(m, v), _ = Math.abs(T - l), B = Math.abs(v - m);
    D({ x: k, y: u, w: _, h: B });
    const N = Array.from(document.querySelectorAll(".task-app__item")), K = /* @__PURE__ */ new Set();
    for (const O of N) {
      const ee = O.getBoundingClientRect();
      if (!(ee.right < k || ee.left > k + _ || ee.bottom < u || ee.top > u + B)) {
        const se = O.getAttribute("data-task-id");
        se && K.add(se), O.classList.add("selected");
      } else
        O.classList.remove("selected");
    }
    p(K);
  }
  function J(i) {
    d(!1), D(null), $.current = null;
    try {
      document.body.classList.remove("marquee-selecting");
    } catch {
    }
    try {
      F(Date.now());
    } catch {
    }
  }
  function R() {
    p(/* @__PURE__ */ new Set()), Array.from(document.querySelectorAll(".task-app__item.selected")).forEach((l) => l.classList.remove("selected"));
  }
  Q(() => {
    function i(T) {
      if (T.button !== 0) return;
      const v = { target: T.target, clientX: T.clientX, clientY: T.clientY, button: T.button };
      try {
        L(v);
      } catch {
      }
    }
    function l(T) {
      const v = { clientX: T.clientX, clientY: T.clientY };
      try {
        H(v);
      } catch {
      }
    }
    function m(T) {
      const v = { clientX: T.clientX, clientY: T.clientY };
      try {
        J(v);
      } catch {
      }
    }
    return document.addEventListener("mousedown", i), document.addEventListener("mousemove", l), document.addEventListener("mouseup", m), () => {
      document.removeEventListener("mousedown", i), document.removeEventListener("mousemove", l), document.removeEventListener("mouseup", m);
    };
  }, []);
  function P(i, l) {
    i.preventDefault(), i.dataTransfer.dropEffect = "copy", s(l);
  }
  function V(i) {
    i.currentTarget.contains(i.relatedTarget) || s(null);
  }
  async function I(i, l) {
    i.preventDefault(), s(null), console.log("[useDragAndDrop] onDrop START", { targetTag: l });
    let m = [];
    try {
      const k = i.dataTransfer.getData("application/x-hadoku-task-ids");
      k && (m = JSON.parse(k));
    } catch {
    }
    if (m.length === 0) {
      const k = i.dataTransfer.getData("text/plain");
      k && (m = [k]);
    }
    if (m.length === 0) return;
    let T = null;
    try {
      const k = i.dataTransfer.getData("application/x-hadoku-task-source");
      k && (T = k);
    } catch {
    }
    console.log("[useDragAndDrop] onDrop: processing", { targetTag: l, ids: m, srcTag: T, taskCount: m.length });
    const v = [];
    for (const k of m) {
      const u = t.find((O) => O.id === k);
      if (!u) continue;
      const _ = u.tag?.split(" ").filter(Boolean) || [];
      if (l === "other") {
        if (_.length === 0) continue;
        v.push({ taskId: k, tag: "" });
        continue;
      }
      const B = _.includes(l);
      let N = _.slice();
      B || N.push(l), T && T !== l && (N = N.filter((O) => O !== T));
      const K = N.join(" ").trim();
      v.push({ taskId: k, tag: K });
    }
    console.log("[useDragAndDrop] onDrop: updating tasks", { updateCount: v.length });
    try {
      await a(v), console.log("[useDragAndDrop] onDrop: updates complete, clearing selection");
      try {
        R();
      } catch {
      }
    } catch (k) {
      console.error("Failed to add tag to one or more tasks:", k), alert(k.message || "Failed to add tags");
    }
    console.log("[useDragAndDrop] onDrop END");
  }
  function Y(i, l) {
    i.preventDefault(), i.dataTransfer.dropEffect = "copy", r(l);
  }
  function U(i) {
    i.currentTarget.contains(i.relatedTarget) || r(null);
  }
  async function z(i, l) {
    i.preventDefault(), r(null);
    const m = i.dataTransfer.getData("text/plain"), T = t.find((u) => u.id === m);
    if (!T) return;
    const v = T.tag?.split(" ") || [];
    if (v.includes(l)) {
      console.log(`Task already has tag: ${l}`);
      return;
    }
    const k = [...v, l].join(" ");
    console.log(`Adding tag "${l}" to task "${T.title}" via filter drop. New tags: "${k}"`);
    try {
      await e(m, { tag: k });
      try {
        R();
      } catch {
      }
    } catch (u) {
      console.error("Failed to add tag via filter drop:", u), alert(u.message || "Failed to add tag");
    }
  }
  return {
    dragOverTag: o,
    dragOverFilter: n,
    setDragOverFilter: r,
    selectedIds: c,
    isSelecting: f,
    marqueeRect: y,
    selectionJustEndedAt: b,
    // selection handlers
    selectionStartHandler: L,
    selectionMoveHandler: H,
    selectionEndHandler: J,
    clearSelection: R,
    onDragStart: q,
    onDragEnd: M,
    onDragOver: P,
    onDragLeave: V,
    onDrop: I,
    onFilterDragOver: Y,
    onFilterDragLeave: U,
    onFilterDrop: z
  };
}
function it() {
  const [t, e] = C({});
  function a(r) {
    e((c) => {
      const f = (c[r] || "desc") === "desc" ? "asc" : "desc";
      return { ...c, [r]: f };
    });
  }
  function o(r, c) {
    return [...r].sort((p, f) => {
      const d = new Date(p.createdAt).getTime(), y = new Date(f.createdAt).getTime();
      return c === "asc" ? d - y : y - d;
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
function be({ onLongPress: t, delay: e = 500 }) {
  const a = oe(null);
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
  onMoveTasksToBoard: r,
  onClearSelection: c
}) {
  const p = be({
    onLongPress: (d, y) => s(t.id, d, y)
  }), f = t.id === "main";
  return /* @__PURE__ */ h(
    "button",
    {
      className: `board-btn ${e ? "board-btn--active" : ""} ${a ? "board-btn--drag-over" : ""}`,
      onClick: () => o(t.id),
      onContextMenu: (d) => {
        d.preventDefault(), !f && s(t.id, d.clientX, d.clientY);
      },
      ...f ? {} : p,
      "aria-pressed": e ? "true" : "false",
      onDragOver: (d) => {
        d.preventDefault(), d.dataTransfer.dropEffect = "move", n(`board:${t.id}`);
      },
      onDragLeave: (d) => {
        n(null);
      },
      onDrop: async (d) => {
        d.preventDefault(), n(null);
        const y = ge(d.dataTransfer);
        if (y.length !== 0)
          try {
            await r(t.id, y);
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
  const p = be({
    onLongPress: (f, d) => s(t, f, d)
  });
  return /* @__PURE__ */ A(
    "button",
    {
      onClick: () => o(t),
      onContextMenu: (f) => {
        f.preventDefault(), s(t, f.clientX, f.clientY);
      },
      ...p,
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
function ut(t) {
  const e = /* @__PURE__ */ new Date(), a = new Date(t), o = e.getTime() - a.getTime(), s = Math.floor(o / 1e3), n = Math.floor(s / 60), r = Math.floor(n / 60), c = Math.floor(r / 24);
  return s < 60 ? `${s}s ago` : n < 60 ? `${n}m ago` : r < 24 ? `${r}h ago` : `${c}d ago`;
}
function le({
  task: t,
  isDraggable: e = !0,
  pendingOperations: a,
  onComplete: o,
  onDelete: s,
  onAddTag: n,
  onDragStart: r,
  onDragEnd: c,
  selected: p = !1
}) {
  const f = a.has(`complete-${t.id}`), d = a.has(`delete-${t.id}`);
  return /* @__PURE__ */ A(
    "li",
    {
      className: `task-app__item ${p ? "selected" : ""}`,
      "data-task-id": t.id,
      draggable: e,
      onDragStart: r ? (y) => r(y, t.id) : void 0,
      onDragEnd: (y) => {
        if (y.currentTarget.classList.remove("dragging"), c)
          try {
            c(y);
          } catch {
          }
      },
      children: [
        /* @__PURE__ */ A("div", { className: "task-app__item-content", children: [
          /* @__PURE__ */ h("div", { className: "task-app__item-title", title: t.title, children: t.title }),
          /* @__PURE__ */ A("div", { className: "task-app__item-meta-row", children: [
            t.tag ? /* @__PURE__ */ h("div", { className: "task-app__item-tag", children: t.tag.split(" ").map((y) => `#${y}`).join(" ") }) : /* @__PURE__ */ h("div", {}),
            /* @__PURE__ */ h("div", { className: "task-app__item-age", children: ut(t.createdAt) })
          ] })
        ] }),
        /* @__PURE__ */ A("div", { className: "task-app__item-actions", children: [
          /* @__PURE__ */ h(
            "button",
            {
              className: "task-app__action-btn task-app__complete-btn",
              onClick: () => o(t.id),
              title: "Complete task",
              disabled: f || d,
              children: f ? "⏳" : "✓"
            }
          ),
          /* @__PURE__ */ h(
            "button",
            {
              className: "task-app__action-btn task-app__delete-btn",
              onClick: () => s(t.id),
              title: "Delete task",
              disabled: f || d,
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
  onComplete: r,
  onDelete: c,
  onAddTag: p,
  onDragStart: f,
  onDragEnd: d,
  selectedIds: y,
  onSelectionStart: D,
  onSelectionMove: b,
  onSelectionEnd: F,
  onDragOver: $,
  onDragLeave: q,
  onDrop: M,
  toggleSort: L,
  sortTasksByAge: H,
  getSortIcon: J,
  getSortTitle: R,
  clearTasksByTag: P,
  clearRemainingTasks: V,
  onDeletePersistedTag: I
}) {
  const Y = (u, _) => /* @__PURE__ */ A(
    "div",
    {
      className: `task-app__tag-column ${s === u ? "task-app__tag-column--drag-over" : ""}`,
      onDragOver: (B) => $(B, u),
      onDragLeave: q,
      onDrop: (B) => M(B, u),
      children: [
        /* @__PURE__ */ A("div", { className: "task-app__tag-header-row", children: [
          /* @__PURE__ */ A("h3", { className: "task-app__tag-header", children: [
            "#",
            u
          ] }),
          /* @__PURE__ */ h(
            "button",
            {
              className: "task-app__sort-btn task-app__sort-btn--active",
              onClick: () => L(u),
              title: R(o[u] || "desc"),
              children: J(o[u] || "desc")
            }
          )
        ] }),
        /* @__PURE__ */ h("ul", { className: "task-app__list task-app__list--column", children: H(_, o[u] || "desc").map((B) => /* @__PURE__ */ h(
          le,
          {
            task: B,
            isDraggable: !0,
            pendingOperations: n,
            onComplete: r,
            onDelete: c,
            onAddTag: p,
            onDragStart: f,
            onDragEnd: d,
            selected: y ? y.has(B.id) : !1
          },
          B.id
        )) })
      ]
    },
    u
  ), U = (u, _) => {
    let B = Te(t, u);
    return i && (B = B.filter((N) => {
      const K = N.tag?.split(" ") || [];
      return a.some((O) => K.includes(O));
    })), B.slice(0, _);
  }, z = e.length, i = Array.isArray(a) && a.length > 0, l = t.filter((u) => {
    if (!i) return !0;
    const _ = u.tag?.split(" ") || [];
    return a.some((B) => _.includes(B));
  }), m = ye(z), T = i ? e.filter((u) => Te(t, u).some((B) => {
    const N = B.tag?.split(" ") || [];
    return a.some((K) => N.includes(K));
  })) : e.slice(0, m.useTags);
  if (T.length === 0)
    return /* @__PURE__ */ h("ul", { className: "task-app__list", children: l.map((u) => /* @__PURE__ */ h(
      le,
      {
        task: u,
        pendingOperations: n,
        onComplete: r,
        onDelete: c,
        onAddTag: p,
        onDragStart: f,
        onDragEnd: d,
        selected: y ? y.has(u.id) : !1
      },
      u.id
    )) });
  const v = nt(t, e, a).filter((u) => {
    if (!i) return !0;
    const _ = u.tag?.split(" ") || [];
    return a.some((B) => _.includes(B));
  }), k = ye(T.length);
  return /* @__PURE__ */ A("div", { className: "task-app__dynamic-layout", children: [
    k.rows.length > 0 && /* @__PURE__ */ h(Le, { children: k.rows.map((u, _) => /* @__PURE__ */ h("div", { className: `task-app__tag-grid task-app__tag-grid--${u.columns}col`, children: u.tagIndices.map((B) => {
      const N = T[B];
      return N ? Y(N, U(N, k.maxPerColumn)) : null;
    }) }, _)) }),
    v.length > 0 && /* @__PURE__ */ A(
      "div",
      {
        className: `task-app__remaining ${s === "other" ? "task-app__tag-column--drag-over" : ""}`,
        onDragOver: (u) => {
          u.preventDefault(), u.dataTransfer.dropEffect = "move", $(u, "other");
        },
        onDragLeave: (u) => q(u),
        onDrop: (u) => M(u, "other"),
        children: [
          /* @__PURE__ */ A("div", { className: "task-app__tag-header-row", children: [
            /* @__PURE__ */ h("h3", { className: "task-app__remaining-header", children: "Other Tasks" }),
            /* @__PURE__ */ h(
              "button",
              {
                className: "task-app__sort-btn task-app__sort-btn--active",
                onClick: () => L("other"),
                title: R(o.other || "desc"),
                children: J(o.other || "desc")
              }
            )
          ] }),
          /* @__PURE__ */ h("ul", { className: "task-app__list", children: H(v, o.other || "desc").map((u) => /* @__PURE__ */ h(
            le,
            {
              task: u,
              pendingOperations: n,
              onComplete: r,
              onDelete: c,
              onAddTag: p,
              onDragStart: f,
              onDragEnd: d,
              selected: y ? y.has(u.id) : !1
            },
            u.id
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
  onInputChange: r,
  inputPlaceholder: c,
  confirmLabel: p = "Confirm",
  cancelLabel: f = "Cancel",
  confirmDisabled: d = !1,
  confirmDanger: y = !1
}) {
  return t ? /* @__PURE__ */ h(
    "div",
    {
      className: "modal-overlay",
      onClick: a,
      children: /* @__PURE__ */ A(
        "div",
        {
          className: "modal-card",
          onClick: (b) => b.stopPropagation(),
          children: [
            /* @__PURE__ */ h("h3", { children: e }),
            s,
            r && /* @__PURE__ */ h(
              "input",
              {
                type: "text",
                className: "modal-input",
                value: n || "",
                onChange: (b) => r(b.target.value),
                placeholder: c,
                autoFocus: !0,
                onKeyDown: (b) => {
                  b.key === "Enter" && !d && (b.preventDefault(), o()), b.key === "Escape" && (b.preventDefault(), a());
                }
              }
            ),
            /* @__PURE__ */ A("div", { className: "modal-actions", children: [
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
                  className: `modal-button ${y ? "modal-button--danger" : "modal-button--primary"}`,
                  onClick: o,
                  disabled: d,
                  children: p
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
const ve = 5, De = [
  { name: "light", emoji: "☀️", label: "Light theme" },
  { name: "dark", emoji: "🌙", label: "Dark theme" },
  { name: "strawberry", emoji: "🍓", label: "Strawberry theme" },
  { name: "ocean", emoji: "🌊", label: "Ocean theme" },
  { name: "cyberpunk", emoji: "🤖", label: "Cyberpunk theme" },
  { name: "coffee", emoji: "☕", label: "Coffee theme" },
  { name: "lavender", emoji: "🪻", label: "Lavender theme" }
], pt = (t) => De.find((e) => e.name === t)?.emoji || "🌙";
function mt(t = {}) {
  const { userType: e = "public", userId: a = "public", sessionId: o } = t, [s, n] = C(/* @__PURE__ */ new Set()), [r, c] = C(null), [p, f] = C(!1), [d, y] = C(!1), [D, b] = C(null), [F, $] = C(""), [q, M] = C(null), [L, H] = C("light"), [J, R] = C(!1), [P, V] = C(null), [I, Y] = C(null), U = oe(null), z = oe(null), {
    tasks: i,
    pendingOperations: l,
    initialLoad: m,
    addTask: T,
    completeTask: v,
    deleteTask: k,
    addTagToTask: u,
    updateTaskTags: _,
    bulkUpdateTaskTags: B,
    clearTasksByTag: N,
    clearRemainingTasks: K,
    // board API
    boards: O,
    currentBoardId: ee,
    createBoard: fe,
    deleteBoard: se,
    switchBoard: Be,
    moveTasksToBoard: ke,
    createTagOnBoard: _e,
    deleteTagOnBoard: Ae
  } = rt({ userType: e, userId: a, sessionId: o }), S = ct({
    tasks: i,
    onTaskUpdate: _,
    onBulkUpdate: B
  }), te = it();
  Q(() => {
    ue(e, a, o).getPreferences().then((w) => {
      H(w.theme);
    });
  }, [e, a, o]), Q(() => {
    ue(e, a, o).savePreferences({ theme: L });
  }, [L, e, a, o]), Q(() => {
    console.log("[App] User context changed, initializing...", { userType: e, userId: a }), m(), U.current?.focus();
  }, [e, a]), Q(() => {
    z.current && z.current.setAttribute("data-theme", L);
  }, [L]), Q(() => {
    if (!J && !P && !I) return;
    const g = (w) => {
      const x = w.target;
      x.closest(".theme-picker") || R(!1), x.closest(".board-context-menu") || V(null), x.closest(".tag-context-menu") || Y(null);
    };
    return document.addEventListener("mousedown", g), () => document.removeEventListener("mousedown", g);
  }, [J, P, I]);
  async function xe(g) {
    await T(g) && U.current && (U.current.value = "", U.current.focus());
  }
  function Ce(g) {
    const w = i.filter((x) => x.tag?.split(" ").includes(g));
    c({ tag: g, count: w.length });
  }
  async function Ne(g) {
    const w = g.trim().replace(/\s+/g, "-");
    try {
      if (await _e(w), D?.type === "apply-tag" && D.taskIds.length > 0) {
        const x = D.taskIds.map((E) => {
          const W = i.find((Me) => Me.id === E)?.tag?.split(" ").filter(Boolean) || [], Ee = [.../* @__PURE__ */ new Set([...W, w])];
          return { taskId: E, tag: Ee.join(" ") };
        });
        await B(x), S.clearSelection();
      }
      b(null);
    } catch (x) {
      throw console.error("[App] Failed to create tag:", x), x;
    }
  }
  function re(g) {
    const w = g.trim();
    return w ? (O?.boards?.map((E) => E.id.toLowerCase()) || []).includes(w.toLowerCase()) ? `Board "${w}" already exists` : null : "Board name cannot be empty";
  }
  async function Oe(g) {
    const w = g.trim(), x = re(w);
    if (x) {
      M(x);
      return;
    }
    try {
      await fe(w), D?.type === "move-to-board" && D.taskIds.length > 0 && (await ke(w, D.taskIds), S.clearSelection()), b(null), M(null);
    } catch (E) {
      console.error("[App] Failed to create board:", E), M(E.message || "Failed to create board");
    }
  }
  const $e = O?.boards?.find((g) => g.id === ee)?.tags || [], Fe = st(i, 6);
  return /* @__PURE__ */ h(
    "div",
    {
      ref: z,
      className: "task-app-container",
      onMouseDown: S.selectionStartHandler,
      onMouseMove: S.selectionMoveHandler,
      onMouseUp: S.selectionEndHandler,
      onMouseLeave: S.selectionEndHandler,
      onClick: (g) => {
        try {
          const w = g.target;
          if (!w.closest || !w.closest(".task-app__item")) {
            if (S.selectionJustEndedAt && Date.now() - S.selectionJustEndedAt < 300)
              return;
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
                onClick: () => R(!J),
                "aria-label": "Choose theme",
                title: "Choose theme",
                children: pt(L)
              }
            ),
            J && /* @__PURE__ */ h("div", { className: "theme-picker__dropdown", children: De.map(({ name: g, emoji: w, label: x }) => /* @__PURE__ */ h(
              "button",
              {
                className: `theme-picker__option ${L === g ? "active" : ""}`,
                onClick: () => {
                  H(g), R(!1);
                },
                title: x,
                children: w
              },
              g
            )) })
          ] })
        ] }),
        /* @__PURE__ */ A("div", { className: "task-app__boards", children: [
          /* @__PURE__ */ h("div", { className: "task-app__board-list", children: (O && O.boards ? O.boards.slice(0, ve) : [{ id: "main", name: "main", tasks: [], tags: [] }]).map((g) => /* @__PURE__ */ h(
            lt,
            {
              board: g,
              isActive: ee === g.id,
              isDragOver: S.dragOverFilter === `board:${g.id}`,
              onSwitch: Be,
              onContextMenu: (w, x, E) => V({ boardId: w, x, y: E }),
              onDragOverFilter: S.setDragOverFilter,
              onMoveTasksToBoard: ke,
              onClearSelection: S.clearSelection
            },
            g.id
          )) }),
          /* @__PURE__ */ h("div", { className: "task-app__board-actions", children: (!O || O.boards && O.boards.length < ve) && /* @__PURE__ */ h(
            "button",
            {
              className: `board-add-btn ${S.dragOverFilter === "add-board" ? "board-btn--drag-over" : ""}`,
              onClick: () => {
                $(""), M(null), f(!0);
              },
              onDragOver: (g) => {
                g.preventDefault(), g.dataTransfer.dropEffect = "move", S.setDragOverFilter("add-board");
              },
              onDragLeave: (g) => {
                S.setDragOverFilter(null);
              },
              onDrop: async (g) => {
                g.preventDefault(), S.setDragOverFilter(null);
                const w = ge(g.dataTransfer);
                w.length > 0 && ($(""), b({ type: "move-to-board", taskIds: w }), f(!0));
              },
              "aria-label": "Create board",
              children: "＋"
            }
          ) })
        ] }),
        /* @__PURE__ */ h("div", { className: "task-app__controls", children: /* @__PURE__ */ h(
          "input",
          {
            ref: U,
            className: "task-app__input",
            placeholder: "Type a task and press Enter…",
            onKeyDown: (g) => {
              g.key === "Enter" && !g.shiftKey && (g.preventDefault(), xe(g.target.value)), g.key === "k" && (g.ctrlKey || g.metaKey) && (g.preventDefault(), U.current?.focus());
            }
          }
        ) }),
        /* @__PURE__ */ A("div", { className: "task-app__filters", children: [
          (() => {
            const g = ce(i);
            return Array.from(/* @__PURE__ */ new Set([...$e, ...g])).map((x) => /* @__PURE__ */ h(
              dt,
              {
                tag: x,
                isActive: s.has(x),
                isDragOver: S.dragOverFilter === x,
                onToggle: (E) => {
                  n((ne) => {
                    const W = new Set(ne);
                    return W.has(E) ? W.delete(E) : W.add(E), W;
                  });
                },
                onContextMenu: (E, ne, W) => Y({ tag: E, x: ne, y: W }),
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
                $(""), y(!0);
              },
              onDragOver: (g) => {
                g.preventDefault(), g.dataTransfer.dropEffect = "copy", S.onFilterDragOver(g, "add-tag");
              },
              onDragLeave: S.onFilterDragLeave,
              onDrop: async (g) => {
                g.preventDefault(), S.onFilterDragLeave(g);
                const w = ge(g.dataTransfer);
                w.length > 0 && ($(""), b({ type: "apply-tag", taskIds: w }), y(!0));
              },
              "aria-label": "Add tag",
              children: "＋"
            }
          )
        ] }),
        /* @__PURE__ */ h(
          gt,
          {
            tasks: i,
            topTags: Fe,
            filters: Array.from(s),
            selectedIds: S.selectedIds,
            onSelectionStart: S.selectionStartHandler,
            onSelectionMove: S.selectionMoveHandler,
            onSelectionEnd: S.selectionEndHandler,
            sortDirections: te.sortDirections,
            dragOverTag: S.dragOverTag,
            pendingOperations: l,
            onComplete: v,
            onDelete: k,
            onAddTag: u,
            onDragStart: S.onDragStart,
            onDragEnd: S.onDragEnd,
            onDragOver: S.onDragOver,
            onDragLeave: S.onDragLeave,
            onDrop: S.onDrop,
            toggleSort: te.toggleSort,
            sortTasksByAge: te.sortTasksByAge,
            getSortIcon: te.getSortIcon,
            getSortTitle: te.getSortTitle,
            clearTasksByTag: Ce,
            clearRemainingTasks: K,
            onDeletePersistedTag: Ae
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
          de,
          {
            isOpen: !!r,
            title: `Clear Tag #${r?.tag}?`,
            onClose: () => c(null),
            onConfirm: async () => {
              if (!r) return;
              const g = r.tag;
              c(null), await N(g);
            },
            confirmLabel: "Clear Tag",
            confirmDanger: !0,
            children: r && /* @__PURE__ */ A("p", { children: [
              "This will remove ",
              /* @__PURE__ */ A("strong", { children: [
                "#",
                r.tag
              ] }),
              " from",
              " ",
              /* @__PURE__ */ A("strong", { children: [
                r.count,
                " task(s)"
              ] }),
              " and delete the tag from the board."
            ] })
          }
        ),
        /* @__PURE__ */ A(
          de,
          {
            isOpen: p,
            title: "Create New Board",
            onClose: () => {
              f(!1), b(null), M(null);
            },
            onConfirm: async () => {
              if (!F.trim()) return;
              const g = re(F);
              if (g) {
                M(g);
                return;
              }
              f(!1), await Oe(F);
            },
            inputValue: F,
            onInputChange: (g) => {
              $(g), M(null);
            },
            inputPlaceholder: "Board name",
            confirmLabel: "Create",
            confirmDisabled: !F.trim() || re(F) !== null,
            children: [
              D?.type === "move-to-board" && D.taskIds.length > 0 && /* @__PURE__ */ A("p", { className: "modal-hint", children: [
                D.taskIds.length,
                " task",
                D.taskIds.length > 1 ? "s" : "",
                " will be moved to this board"
              ] }),
              q && /* @__PURE__ */ h("p", { className: "modal-error", style: { color: "var(--error-color, #d32f2f)", marginTop: "0.5rem" }, children: q })
            ]
          }
        ),
        /* @__PURE__ */ A(
          de,
          {
            isOpen: d,
            title: "Create New Tag",
            onClose: () => {
              y(!1), b(null);
            },
            onConfirm: async () => {
              if (F.trim()) {
                y(!1);
                try {
                  await Ne(F);
                } catch (g) {
                  console.error("[App] Failed to create tag:", g);
                }
              }
            },
            inputValue: F,
            onInputChange: $,
            inputPlaceholder: "Enter new tag name",
            confirmLabel: "Create",
            confirmDisabled: !F.trim(),
            children: [
              D?.type === "apply-tag" && D.taskIds.length > 0 && /* @__PURE__ */ A("p", { className: "modal-hint", children: [
                "This tag will be applied to ",
                D.taskIds.length,
                " task",
                D.taskIds.length > 1 ? "s" : ""
              ] }),
              ce(i).length > 0 && /* @__PURE__ */ A("div", { className: "modal-section", children: [
                /* @__PURE__ */ h("label", { className: "modal-label", children: "Existing tags:" }),
                /* @__PURE__ */ h("div", { className: "modal-tags-list", children: ce(i).map((g) => /* @__PURE__ */ A("span", { className: "modal-tag-chip", children: [
                  "#",
                  g
                ] }, g)) })
              ] })
            ]
          }
        ),
        /* @__PURE__ */ h(
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
                  const g = O?.boards?.find((w) => w.id === P.boardId)?.name || P.boardId;
                  if (confirm(`Delete board "${g}"? All tasks on this board will be permanently deleted.`))
                    try {
                      await se(P.boardId), V(null);
                    } catch (w) {
                      console.error("[App] Failed to delete board:", w), alert(w.message || "Failed to delete board");
                    }
                }
              }
            ]
          }
        ),
        /* @__PURE__ */ h(
          we,
          {
            isOpen: !!I,
            x: I?.x || 0,
            y: I?.y || 0,
            items: [
              {
                label: "🗑️ Delete Tag",
                isDanger: !0,
                onClick: async () => {
                  if (!I) return;
                  const g = i.filter((w) => w.tag?.split(" ").includes(I.tag));
                  if (confirm(`Delete tag "${I.tag}" and remove it from ${g.length} task(s)?`))
                    try {
                      await N(I.tag), Y(null);
                    } catch (w) {
                      console.error("[App] Failed to delete tag:", w), alert(w.message || "Failed to delete tag");
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
