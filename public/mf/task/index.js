import { jsxs as C, jsx as y, Fragment as Fe } from "react/jsx-runtime";
import { createRoot as Ee } from "react-dom/client";
import { useState as N, useMemo as Me, useEffect as G, useRef as oe } from "react";
const I = `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
class Le {
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
function Pe() {
  const t = Date.now().toString(36).toUpperCase().padStart(8, "0"), e = crypto.getRandomValues(new Uint8Array(18)), a = Array.from(e).map((o) => (o % 36).toString(36).toUpperCase()).join("");
  return t + a;
}
function Q() {
  return (/* @__PURE__ */ new Date()).toISOString();
}
function ge(t, e) {
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
function ve(t, e, a, o) {
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
function Ie(t, e, a) {
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
function Re(t, e, a) {
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
function je(t, e, a) {
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
function Je(t, e, a) {
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
async function Ue(t, e) {
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
async function Ke(t, e, a, o = "main") {
  const s = Q(), n = await t.getTasks(e.userType, e.userId, o), r = await t.getStats(e.userType, e.userId, o), c = a.id || Pe(), p = {
    id: c,
    title: a.title,
    tag: a.tag ?? null,
    state: "Active",
    createdAt: s
  }, k = {
    ...n,
    tasks: [p, ...n.tasks],
    updatedAt: s
  }, m = Ie(r, p, s);
  return await t.saveTasks(e.userType, e.userId, o, k), await t.saveStats(e.userType, e.userId, o, m), { ok: !0, id: c };
}
async function Xe(t, e, a, o, s = "main") {
  const n = Q(), r = await t.getTasks(e.userType, e.userId, s), c = await t.getStats(e.userType, e.userId, s), { task: p, index: k } = ge(r, a), m = {
    ...p,
    ...o,
    updatedAt: n
  }, v = [...r.tasks];
  v[k] = m;
  const A = {
    ...r,
    tasks: v,
    updatedAt: n
  }, b = je(c, m, n);
  return await t.saveTasks(e.userType, e.userId, s, A), await t.saveStats(e.userType, e.userId, s, b), { ok: !0, message: `Task ${a} updated` };
}
async function He(t, e, a, o = "main") {
  const s = Q(), n = await t.getTasks(e.userType, e.userId, o), r = await t.getStats(e.userType, e.userId, o), { task: c, index: p } = ge(n, a), k = {
    ...c,
    state: "Completed",
    closedAt: s,
    updatedAt: s
  }, m = [...n.tasks];
  m.splice(p, 1);
  const v = {
    ...n,
    tasks: m,
    updatedAt: s
  }, A = Re(r, k, s);
  return await t.saveTasks(e.userType, e.userId, o, v), await t.saveStats(e.userType, e.userId, o, A), { ok: !0, message: `Task ${a} completed` };
}
async function qe(t, e, a, o = "main") {
  const s = Q(), n = await t.getTasks(e.userType, e.userId, o), r = await t.getStats(e.userType, e.userId, o), { task: c, index: p } = ge(n, a), k = {
    ...c,
    state: "Deleted",
    closedAt: s,
    updatedAt: s
  }, m = [...n.tasks];
  m.splice(p, 1);
  const v = {
    ...n,
    tasks: m,
    updatedAt: s
  }, A = Je(r, k, s);
  return await t.saveTasks(e.userType, e.userId, o, v), await t.saveStats(e.userType, e.userId, o, A), { ok: !0, message: `Task ${a} deleted` };
}
async function Ye(t, e, a) {
  const o = Q(), s = await t.getBoards(e.userType, e.userId);
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
async function ze(t, e, a) {
  if (a === "main")
    throw new Error("Cannot delete the main board");
  const o = Q(), s = await t.getBoards(e.userType, e.userId);
  pe(s, a);
  const n = {
    ...s,
    updatedAt: o,
    boards: s.boards.filter((r) => r.id !== a)
  };
  return await t.saveBoards(e.userType, n, e.userId), { ok: !0, message: `Board ${a} deleted` };
}
async function Ve(t, e, a) {
  const o = Q(), s = await t.getBoards(e.userType, e.userId), { board: n, index: r } = pe(s, a.boardId), c = n.tags || [];
  if (c.includes(a.tag))
    return { ok: !0, message: `Tag ${a.tag} already exists` };
  const p = {
    ...n,
    tags: [...c, a.tag]
  }, k = ve(s, r, p, o);
  return await t.saveBoards(e.userType, k, e.userId), { ok: !0, message: `Tag ${a.tag} added to board ${a.boardId}` };
}
async function We(t, e, a) {
  const o = Q(), s = await t.getBoards(e.userType, e.userId), { board: n, index: r } = pe(s, a.boardId), c = n.tags || [], p = {
    ...n,
    tags: c.filter((m) => m !== a.tag)
  }, k = ve(s, r, p, o);
  return await t.saveBoards(e.userType, k, e.userId), { ok: !0, message: `Tag ${a.tag} removed from board ${a.boardId}` };
}
function W(t, e, a = 50) {
  setTimeout(() => {
    try {
      const o = new BroadcastChannel("tasks");
      o.postMessage({ type: t, ...e }), o.close();
    } catch (o) {
      console.error("[localStorageApi] Broadcast failed:", o);
    }
  }, a);
}
function Ge(t = "public", e = "public") {
  const a = new Le(t, e), o = { userType: "registered", userId: e };
  return {
    async getBoards() {
      const s = await Ue(a, o), n = {
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
      const n = await Ye(
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
      }), W("boards-updated", { sessionId: I, userType: t, userId: e }), n.board;
    },
    async deleteBoard(s) {
      await ze(
        a,
        o,
        s
      ), await a.deleteBoardData(t, e, s), W("boards-updated", { sessionId: I, userType: t, userId: e });
    },
    async getTasks(s = "main") {
      return a.getTasks(t, e, s);
    },
    async getStats(s = "main") {
      return a.getStats(t, e, s);
    },
    async createTask(s, n = "main", r = !1) {
      console.log("[localStorageApi] createTask (using handler)", { data: s, boardId: n, suppressBroadcast: r });
      const c = await Ke(
        a,
        o,
        s,
        n
      ), k = (await a.getTasks(t, e, n)).tasks.find((m) => m.id === c.id);
      if (!k)
        throw new Error("Task creation failed - task not found after creation");
      return r ? console.log("[localStorageApi] createTask: broadcast suppressed") : (console.log("[localStorageApi] createTask: broadcasting", {
        sessionId: I,
        boardId: n,
        taskId: c.id
      }), W("tasks-updated", { sessionId: I, userType: t, userId: e, boardId: n })), k;
    },
    async patchTask(s, n, r = "main", c = !1) {
      const p = {};
      n.title !== void 0 && (p.title = n.title), n.tag !== void 0 && n.tag !== null && (p.tag = n.tag), await Xe(
        a,
        o,
        s,
        p,
        r
      ), c || W("tasks-updated", { sessionId: I, userType: t, userId: e, boardId: r });
      const m = (await a.getTasks(t, e, r)).tasks.find((v) => v.id === s);
      if (!m)
        throw new Error("Task not found after update");
      return m;
    },
    async completeTask(s, n = "main") {
      await He(
        a,
        o,
        s,
        n
      ), W("tasks-updated", { sessionId: I, userType: t, userId: e, boardId: n });
      const c = (await a.getTasks(t, e, n)).tasks.find((p) => p.id === s);
      if (!c)
        throw new Error("Task not found after completion");
      return c;
    },
    async deleteTask(s, n = "main", r = !1) {
      console.log("[localStorageApi] deleteTask (using handler)", { id: s, boardId: n, suppressBroadcast: r });
      const p = (await a.getTasks(t, e, n)).tasks.find((k) => k.id === s);
      if (!p)
        throw new Error("Task not found");
      return await qe(
        a,
        o,
        s,
        n
      ), r ? console.log("[localStorageApi] deleteTask: broadcast suppressed") : (console.log("[localStorageApi] deleteTask: broadcasting", { sessionId: I }), W("tasks-updated", { sessionId: I, userType: t, userId: e, boardId: n })), {
        ...p,
        state: "Deleted",
        closedAt: (/* @__PURE__ */ new Date()).toISOString(),
        updatedAt: (/* @__PURE__ */ new Date()).toISOString()
      };
    },
    async createTag(s, n = "main") {
      await Ve(
        a,
        o,
        { boardId: n, tag: s }
      ), W("boards-updated", { sessionId: I, userType: t, userId: e, boardId: n });
    },
    async deleteTag(s, n = "main") {
      await We(
        a,
        o,
        { boardId: n, tag: s }
      ), W("boards-updated", { sessionId: I, userType: t, userId: e, boardId: n });
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
async function Qe(t, e, a, o) {
  for (const r of e.boards || []) {
    const c = r.id;
    if (r.tasks && r.tasks.length > 0) {
      const p = `${a}-${o}-${c}-tasks`, k = {
        version: 1,
        updatedAt: e.updatedAt || (/* @__PURE__ */ new Date()).toISOString(),
        tasks: r.tasks
      };
      window.localStorage.setItem(p, JSON.stringify(k));
    }
    if (r.stats) {
      const p = `${a}-${o}-${c}-stats`;
      window.localStorage.setItem(p, JSON.stringify(r.stats));
    }
  }
  const s = `${a}-${o}-boards`, n = {
    version: 1,
    updatedAt: e.updatedAt || (/* @__PURE__ */ new Date()).toISOString(),
    boards: e.boards.map((r) => ({
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
function H(t, e, a) {
  const o = {
    "Content-Type": "application/json",
    "X-User-Type": t
  };
  return e && (o["X-User-Id"] = e), a && (o["X-Session-Id"] = a), o;
}
function ue(t = "public", e = "public", a) {
  const o = Ge(t, e);
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
          headers: H(t, e, a)
        });
        if (!s.ok)
          throw new Error(`API returned ${s.status}`);
        const n = await s.json();
        console.log("[api] Synced from API:", { boards: n.boards?.length || 0, totalTasks: n.boards?.reduce((r, c) => r + (c.tasks?.length || 0), 0) || 0 }), await Qe(o, n, t, e);
      } catch (s) {
        console.error("[api] Sync from API failed:", s);
      }
    },
    async createTask(s, n = "main", r = !1) {
      const c = await o.createTask(s, n, r);
      return fetch("/task/api", {
        method: "POST",
        headers: H(t, e, a),
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
        headers: H(t, e, a),
        body: JSON.stringify({ boardId: n, tag: s })
      }).then(() => console.log("[api] Background sync: createTag completed")).catch((c) => console.error("[api] Failed to sync createTag:", c)), r;
    },
    async deleteTag(s, n = "main") {
      const r = await o.deleteTag(s, n);
      return fetch("/task/api/tags", {
        method: "DELETE",
        headers: H(t, e, a),
        body: JSON.stringify({ boardId: n, tag: s })
      }).then(() => console.log("[api] Background sync: deleteTag completed")).catch((c) => console.error("[api] Failed to sync deleteTag:", c)), r;
    },
    async patchTask(s, n, r = "main", c = !1) {
      const p = await o.patchTask(s, n, r, c);
      return fetch(`/task/api/${s}`, {
        method: "PATCH",
        headers: H(t, e, a),
        body: JSON.stringify({ ...n, boardId: r })
      }).then(() => console.log("[api] Background sync: patchTask completed")).catch((k) => console.error("[api] Failed to sync patchTask:", k)), p;
    },
    async completeTask(s, n = "main") {
      const r = await o.completeTask(s, n);
      return fetch(`/task/api/${s}/complete`, {
        method: "POST",
        headers: H(t, e, a),
        body: JSON.stringify({ boardId: n })
      }).then(() => console.log("[api] Background sync: completeTask completed")).catch((c) => console.error("[api] Failed to sync completeTask:", c)), r;
    },
    async deleteTask(s, n = "main", r = !1) {
      await o.deleteTask(s, n, r), fetch(`/task/api/${s}`, {
        method: "DELETE",
        headers: H(t, e, a),
        body: JSON.stringify({ boardId: n })
      }).then(() => console.log("[api] Background sync: deleteTask completed")).catch((c) => console.error("[api] Failed to sync deleteTask:", c));
    },
    // Board operations
    async createBoard(s) {
      const n = await o.createBoard(s);
      return fetch("/task/api/boards", {
        method: "POST",
        headers: H(t, e, a),
        body: JSON.stringify({ id: s, name: s })
      }).then(() => console.log("[api] Background sync: createBoard completed")).catch((r) => console.error("[api] Failed to sync createBoard:", r)), n;
    },
    async deleteBoard(s) {
      const n = await o.deleteBoard(s);
      return fetch(`/task/api/boards/${encodeURIComponent(s)}`, {
        method: "DELETE",
        headers: H(t, e, a)
      }).then(() => console.log("[api] Background sync: deleteBoard completed")).catch((r) => console.error("[api] Failed to sync deleteBoard:", r)), n;
    },
    // User preferences
    async getPreferences() {
      return await o.getPreferences();
    },
    async savePreferences(s) {
      await o.savePreferences(s), fetch("/task/api/preferences", {
        method: "PUT",
        headers: H(t, e, a),
        body: JSON.stringify(s)
      }).then(() => console.log("[api] Background sync: savePreferences completed")).catch((n) => console.error("[api] Failed to sync savePreferences:", n));
    }
  };
}
function Ze(t) {
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
function et(t, e = 6, a = []) {
  const o = t.flatMap((n) => n.tag?.split(" ") || []).filter(Boolean), s = {};
  return o.forEach((n) => s[n] = (s[n] || 0) + 1), a.filter(Boolean).forEach((n) => {
    s[n] || (s[n] = 0);
  }), Object.entries(s).sort((n, r) => r[1] - n[1]).slice(0, e).map(([n]) => n);
}
function fe(t, e) {
  return t.filter((a) => a.tag?.split(" ").includes(e));
}
function tt(t, e, a) {
  const o = Array.isArray(a) && a.length > 0;
  return t.filter((s) => {
    const n = s.tag?.split(" ") || [];
    return o ? a.some((c) => n.includes(c)) && !e.some((c) => n.includes(c)) : !e.some((r) => n.includes(r));
  });
}
function re(t) {
  return Array.from(new Set(t.flatMap((e) => e.tag?.split(" ") || []).filter(Boolean)));
}
function at(t, e, a, o = 50) {
  setTimeout(() => {
    try {
      const s = new BroadcastChannel("tasks");
      s.postMessage({ type: "tasks-updated", sessionId: t, userType: e, userId: a }), s.close();
    } catch (s) {
      console.error("[useTasks] Broadcast failed:", s);
    }
  }, o);
}
async function ke(t, e, a, o, s = {}) {
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
async function ce(t, e, a) {
  await t(), console.log("[withBulkOperation] Broadcasting bulk update with delay"), at(I, e, a);
}
function ne(t, e) {
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
function st({ userType: t, userId: e, sessionId: a }) {
  const [o, s] = N([]), [n, r] = N(/* @__PURE__ */ new Set()), c = Me(
    () => ue(t, e || "public", a),
    [t, e, a]
  ), [p, k] = N(null), [m, v] = N("main");
  async function A() {
    console.log("[useTasks] initialLoad called"), "syncFromApi" in c && await c.syncFromApi(), await b();
  }
  async function b() {
    console.log("[useTasks] reload called", { currentBoardId: m, stack: new Error().stack?.split(`
`).slice(1, 4).join(`
`) });
    const i = await c.getBoards();
    k(i);
    const { tasks: l } = ne(i, m);
    s(l);
  }
  G(() => {
    console.log("[useTasks] User context changed, clearing state and reloading", { userType: t, userId: e }), s([]), r(/* @__PURE__ */ new Set()), k(null), v("main"), b();
  }, [t, e]), G(() => {
    console.log("[useTasks] Setting up BroadcastChannel listener", { currentBoardId: m, userType: t, userId: e });
    try {
      const i = new BroadcastChannel("tasks");
      return i.onmessage = (l) => {
        const g = l.data || {};
        if (console.log("[useTasks] BroadcastChannel message received", { msg: g, sessionId: I, currentBoardId: m, currentContext: { userType: t, userId: e } }), g.sessionId === I) {
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
        (g.type === "tasks-updated" || g.type === "boards-updated") && (console.log("[useTasks] BroadcastChannel: triggering reload for currentBoardId =", m), b());
      }, () => {
        console.log("[useTasks] Cleaning up BroadcastChannel listener", { currentBoardId: m }), i.close();
      };
    } catch (i) {
      console.error("[useTasks] Failed to setup BroadcastChannel", i);
    }
  }, [m, t, e]);
  async function L(i) {
    if (i = i.trim(), !!i)
      try {
        const l = Ze(i);
        return await c.createTask(l, m), await b(), !0;
      } catch (l) {
        return alert(l.message || "Failed to create task"), !1;
      }
  }
  async function O(i) {
    await ke(
      `complete-${i}`,
      n,
      r,
      async () => {
        await c.completeTask(i, m), await b();
      },
      {
        onError: (l) => alert(l.message || "Failed to complete task")
      }
    );
  }
  async function P(i) {
    console.log("[useTasks] deleteTask START", { taskId: i, currentBoardId: m }), await ke(
      `delete-${i}`,
      n,
      r,
      async () => {
        console.log("[useTasks] deleteTask: calling api.deleteTask", { taskId: i, currentBoardId: m }), await c.deleteTask(i, m), console.log("[useTasks] deleteTask: calling reload"), await b(), console.log("[useTasks] deleteTask END");
      },
      {
        onError: (l) => alert(l.message || "Failed to delete task")
      }
    );
  }
  async function q(i) {
    const l = prompt("Enter tag (without #):");
    if (!l) return;
    const g = l.trim().replace(/^#+/, "").replace(/\s+/g, "-"), h = o.find((d) => d.id === i);
    if (!h) return;
    const S = h.tag?.split(" ") || [];
    if (S.includes(g)) return;
    const f = [...S, g].join(" ");
    try {
      await c.patchTask(i, { tag: f }, m), await b();
    } catch (d) {
      alert(d.message || "Failed to add tag");
    }
  }
  async function R(i, l, g = {}) {
    const { suppressBroadcast: h = !1, skipReload: S = !1 } = g;
    try {
      await c.patchTask(i, l, m, h), S || await b();
    } catch (f) {
      throw f;
    }
  }
  async function K(i) {
    console.log("[useTasks] bulkUpdateTaskTags START", { count: i.length });
    try {
      await ce(async () => {
        for (const { taskId: l, tag: g } of i)
          await c.patchTask(l, { tag: g }, m, !0);
      }, t, e), console.log("[useTasks] bulkUpdateTaskTags: calling reload"), await b(), console.log("[useTasks] bulkUpdateTaskTags END");
    } catch (l) {
      throw console.error("[useTasks] bulkUpdateTaskTags ERROR", l), l;
    }
  }
  async function $(i) {
    console.log("[useTasks] clearTasksByTag START", { tag: i, currentBoardId: m, taskCount: o.length });
    const l = o.filter((g) => g.tag?.split(" ").includes(i));
    if (console.log("[useTasks] clearTasksByTag: found tasks with tag", { tag: i, count: l.length }), l.length === 0) {
      console.log("[useTasks] clearTasksByTag: no tasks found with this tag, just deleting tag");
      try {
        await c.deleteTag(i, m), await b(), console.log("[useTasks] clearTasksByTag END (no tasks to clear)");
      } catch (g) {
        console.error("[useTasks] clearTasksByTag ERROR", g), console.error("[useTasks] clearTasksByTag: Please fix this error:", g.message);
      }
      return;
    }
    console.log("[useTasks] clearTasksByTag: proceeding without confirmation (dialogs blocked)", { taskCount: l.length });
    try {
      console.log("[useTasks] clearTasksByTag: starting to patch tasks"), await ce(async () => {
        for (const g of l) {
          const h = g.tag?.split(" ") || [], S = h.filter((d) => d !== i), f = S.length > 0 ? S.join(" ") : null;
          console.log("[useTasks] clearTasksByTag: patching task", { taskId: g.id, oldTags: h, newTags: S }), await c.patchTask(g.id, { tag: f }, m, !0);
        }
        console.log("[useTasks] clearTasksByTag: deleting tag from board", { tag: i, currentBoardId: m }), await c.deleteTag(i, m);
      }, t, e), console.log("[useTasks] clearTasksByTag: calling reload"), await b(), console.log("[useTasks] clearTasksByTag END");
    } catch (g) {
      console.error("[useTasks] clearTasksByTag ERROR", g), alert(g.message || "Failed to remove tag from tasks");
    }
  }
  async function E(i) {
    if (confirm("Clear all remaining tasks?"))
      try {
        for (const l of i)
          await c.deleteTask(l.id, m);
        await b();
      } catch (l) {
        alert(l.message || "Failed to clear remaining tasks");
      }
  }
  async function M(i) {
    await c.createBoard(i), v(i);
    const l = await c.getBoards();
    k(l);
    const { tasks: g } = ne(l, i);
    s(g);
  }
  async function Y(i, l) {
    if (console.log("[useTasks] moveTasksToBoard START", { targetBoardId: i, ids: l, currentBoardId: m }), !p) return;
    const g = [];
    for (const f of p.boards)
      for (const d of f.tasks || [])
        l.includes(d.id) && g.push({ id: d.id, title: d.title, tag: d.tag || void 0, boardId: f.id });
    console.log("[useTasks] moveTasksToBoard: found tasks to move", { count: g.length }), await ce(async () => {
      for (const f of g)
        await c.createTask({ title: f.title, tag: f.tag }, i, !0), await c.deleteTask(f.id, f.boardId, !0);
    }, t, e), console.log("[useTasks] moveTasksToBoard: switching to target board", { targetBoardId: i }), v(i);
    const h = await c.getBoards();
    k(h);
    const { tasks: S } = ne(h, i);
    s(S), console.log("[useTasks] moveTasksToBoard END");
  }
  async function X(i) {
    if (await c.deleteBoard(i), m === i) {
      v("main");
      const l = await c.getBoards();
      k(l);
      const { tasks: g } = ne(l, "main");
      s(g);
    } else
      await b();
  }
  async function z(i) {
    await c.createTag(i, m), await b();
  }
  async function F(i) {
    await c.deleteTag(i, m), await b();
  }
  function Z(i) {
    v(i);
    const { tasks: l, foundBoard: g } = ne(p, i);
    g ? s(l) : b();
  }
  return {
    // Task state
    tasks: o,
    pendingOperations: n,
    // Task operations
    addTask: L,
    completeTask: O,
    deleteTask: P,
    addTagToTask: q,
    updateTaskTags: R,
    bulkUpdateTaskTags: K,
    clearTasksByTag: $,
    clearRemainingTasks: E,
    // Board state
    boards: p,
    currentBoardId: m,
    // Board operations
    createBoard: M,
    deleteBoard: X,
    switchBoard: Z,
    moveTasksToBoard: Y,
    createTagOnBoard: z,
    deleteTagOnBoard: F,
    // Lifecycle
    initialLoad: A,
    reload: b
  };
}
function nt({ tasks: t, onTaskUpdate: e, onBulkUpdate: a }) {
  const [o, s] = N(null), [n, r] = N(null), [c, p] = N(/* @__PURE__ */ new Set()), [k, m] = N(!1), [v, A] = N(null), [b, L] = N(null), O = oe(null);
  function P(i, l) {
    const g = c.has(l) && c.size > 0 ? Array.from(c) : [l];
    console.log("[useDragAndDrop] onDragStart", { taskId: l, idsToDrag: g, selectedCount: c.size }), i.dataTransfer.setData("text/plain", g[0]);
    try {
      i.dataTransfer.setData("application/x-hadoku-task-ids", JSON.stringify(g));
    } catch {
    }
    i.dataTransfer.effectAllowed = "copyMove";
    try {
      const h = i.currentTarget, S = h.closest && h.closest(".task-app__item") ? h.closest(".task-app__item") : h;
      S.classList.add("dragging");
      const f = S.cloneNode(!0);
      f.style.boxSizing = "border-box", f.style.width = `${S.offsetWidth}px`, f.style.height = `${S.offsetHeight}px`, f.style.opacity = "0.95", f.style.transform = "none", f.style.filter = "drop-shadow(0 6px 18px rgba(0,0,0,0.12))", f.classList.add("drag-image"), f.style.position = "absolute", f.style.top = "-9999px", f.style.left = "-9999px", document.body.appendChild(f), S.__dragImage = f, p((d) => {
        if (d.has(l)) return new Set(d);
        const _ = new Set(d);
        return _.add(l), _;
      });
      try {
        const d = S.closest(".task-app__tag-column");
        if (d) {
          const _ = d.querySelector(".task-app__tag-header") || d.querySelector("h3"), x = (_ && _.textContent || "").trim().replace(/^#/, "");
          if (x)
            try {
              i.dataTransfer.setData("application/x-hadoku-task-source", x);
            } catch {
            }
        }
      } catch {
      }
      try {
        const d = S.getBoundingClientRect();
        let _ = Math.round(i.clientX - d.left), B = Math.round(i.clientY - d.top);
        _ = Math.max(0, Math.min(Math.round(f.offsetWidth - 1), _)), B = Math.max(0, Math.min(Math.round(f.offsetHeight - 1), B)), i.dataTransfer.setDragImage(f, _, B);
      } catch {
        i.dataTransfer.setDragImage(f, 0, 0);
      }
    } catch {
    }
  }
  function q(i) {
    try {
      const l = i.currentTarget;
      l.classList.remove("dragging");
      const g = l.__dragImage;
      g && g.parentNode && g.parentNode.removeChild(g), g && delete l.__dragImage;
    } catch {
    }
    try {
      E();
    } catch {
    }
  }
  function R(i) {
    if (i.button === 0) {
      try {
        const l = i.target;
        if (!l || l.closest && l.closest(".task-app__item, .task-app__controls, button, input, textarea, .task-app__item-actions"))
          return;
      } catch {
      }
      m(!0), O.current = { x: i.clientX, y: i.clientY }, A({ x: i.clientX, y: i.clientY, w: 0, h: 0 }), p(/* @__PURE__ */ new Set());
      try {
        document.body.classList.add("marquee-selecting");
      } catch {
      }
    }
  }
  function K(i) {
    if (!k || !O.current) return;
    const l = O.current.x, g = O.current.y, h = i.clientX, S = i.clientY, f = Math.min(l, h), d = Math.min(g, S), _ = Math.abs(h - l), B = Math.abs(S - g);
    A({ x: f, y: d, w: _, h: B });
    const x = Array.from(document.querySelectorAll(".task-app__item")), j = /* @__PURE__ */ new Set();
    for (const J of x) {
      const te = J.getBoundingClientRect();
      if (!(te.right < f || te.left > f + _ || te.bottom < d || te.top > d + B)) {
        const ae = J.getAttribute("data-task-id");
        ae && j.add(ae), J.classList.add("selected");
      } else
        J.classList.remove("selected");
    }
    p(j);
  }
  function $(i) {
    m(!1), A(null), O.current = null;
    try {
      document.body.classList.remove("marquee-selecting");
    } catch {
    }
    try {
      L(Date.now());
    } catch {
    }
  }
  function E() {
    p(/* @__PURE__ */ new Set()), Array.from(document.querySelectorAll(".task-app__item.selected")).forEach((l) => l.classList.remove("selected"));
  }
  G(() => {
    function i(h) {
      if (h.button !== 0) return;
      const S = { target: h.target, clientX: h.clientX, clientY: h.clientY, button: h.button };
      try {
        R(S);
      } catch {
      }
    }
    function l(h) {
      const S = { clientX: h.clientX, clientY: h.clientY };
      try {
        K(S);
      } catch {
      }
    }
    function g(h) {
      const S = { clientX: h.clientX, clientY: h.clientY };
      try {
        $(S);
      } catch {
      }
    }
    return document.addEventListener("mousedown", i), document.addEventListener("mousemove", l), document.addEventListener("mouseup", g), () => {
      document.removeEventListener("mousedown", i), document.removeEventListener("mousemove", l), document.removeEventListener("mouseup", g);
    };
  }, []);
  function M(i, l) {
    i.preventDefault(), i.dataTransfer.dropEffect = "copy", s(l);
  }
  function Y(i) {
    i.currentTarget.contains(i.relatedTarget) || s(null);
  }
  async function X(i, l) {
    i.preventDefault(), s(null), console.log("[useDragAndDrop] onDrop START", { targetTag: l });
    let g = [];
    try {
      const f = i.dataTransfer.getData("application/x-hadoku-task-ids");
      f && (g = JSON.parse(f));
    } catch {
    }
    if (g.length === 0) {
      const f = i.dataTransfer.getData("text/plain");
      f && (g = [f]);
    }
    if (g.length === 0) return;
    let h = null;
    try {
      const f = i.dataTransfer.getData("application/x-hadoku-task-source");
      f && (h = f);
    } catch {
    }
    console.log("[useDragAndDrop] onDrop: processing", { targetTag: l, ids: g, srcTag: h, taskCount: g.length });
    const S = [];
    for (const f of g) {
      const d = t.find((J) => J.id === f);
      if (!d) continue;
      const _ = d.tag?.split(" ").filter(Boolean) || [];
      if (l === "other") {
        if (_.length === 0) continue;
        S.push({ taskId: f, tag: "" });
        continue;
      }
      const B = _.includes(l);
      let x = _.slice();
      B || x.push(l), h && h !== l && (x = x.filter((J) => J !== h));
      const j = x.join(" ").trim();
      S.push({ taskId: f, tag: j });
    }
    console.log("[useDragAndDrop] onDrop: updating tasks", { updateCount: S.length });
    try {
      await a(S), console.log("[useDragAndDrop] onDrop: updates complete, clearing selection");
      try {
        E();
      } catch {
      }
    } catch (f) {
      console.error("Failed to add tag to one or more tasks:", f), alert(f.message || "Failed to add tags");
    }
    console.log("[useDragAndDrop] onDrop END");
  }
  function z(i, l) {
    i.preventDefault(), i.dataTransfer.dropEffect = "copy", r(l);
  }
  function F(i) {
    i.currentTarget.contains(i.relatedTarget) || r(null);
  }
  async function Z(i, l) {
    i.preventDefault(), r(null);
    const g = i.dataTransfer.getData("text/plain"), h = t.find((d) => d.id === g);
    if (!h) return;
    const S = h.tag?.split(" ") || [];
    if (S.includes(l)) {
      console.log(`Task already has tag: ${l}`);
      return;
    }
    const f = [...S, l].join(" ");
    console.log(`Adding tag "${l}" to task "${h.title}" via filter drop. New tags: "${f}"`);
    try {
      await e(g, { tag: f });
      try {
        E();
      } catch {
      }
    } catch (d) {
      console.error("Failed to add tag via filter drop:", d), alert(d.message || "Failed to add tag");
    }
  }
  return {
    dragOverTag: o,
    dragOverFilter: n,
    setDragOverFilter: r,
    selectedIds: c,
    isSelecting: k,
    marqueeRect: v,
    selectionJustEndedAt: b,
    // selection handlers
    selectionStartHandler: R,
    selectionMoveHandler: K,
    selectionEndHandler: $,
    clearSelection: E,
    onDragStart: P,
    onDragEnd: q,
    onDragOver: M,
    onDragLeave: Y,
    onDrop: X,
    onFilterDragOver: z,
    onFilterDragLeave: F,
    onFilterDrop: Z
  };
}
function ot() {
  const [t, e] = N({});
  function a(r) {
    e((c) => {
      const k = (c[r] || "desc") === "desc" ? "asc" : "desc";
      return { ...c, [r]: k };
    });
  }
  function o(r, c) {
    return [...r].sort((p, k) => {
      const m = new Date(p.createdAt).getTime(), v = new Date(k.createdAt).getTime();
      return c === "asc" ? m - v : v - m;
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
function he({ onLongPress: t, delay: e = 500 }) {
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
function rt(t) {
  const e = /* @__PURE__ */ new Date(), a = new Date(t), o = e.getTime() - a.getTime(), s = Math.floor(o / 1e3), n = Math.floor(s / 60), r = Math.floor(n / 60), c = Math.floor(r / 24);
  return s < 60 ? `${s}s ago` : n < 60 ? `${n}m ago` : r < 24 ? `${r}h ago` : `${c}d ago`;
}
function ie({
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
  const k = a.has(`complete-${t.id}`), m = a.has(`delete-${t.id}`);
  return /* @__PURE__ */ C(
    "li",
    {
      className: `task-app__item ${p ? "selected" : ""}`,
      "data-task-id": t.id,
      draggable: e,
      onDragStart: r ? (v) => r(v, t.id) : void 0,
      onDragEnd: (v) => {
        if (v.currentTarget.classList.remove("dragging"), c)
          try {
            c(v);
          } catch {
          }
      },
      children: [
        /* @__PURE__ */ C("div", { className: "task-app__item-content", children: [
          /* @__PURE__ */ y("div", { className: "task-app__item-title", title: t.title, children: t.title }),
          /* @__PURE__ */ C("div", { className: "task-app__item-meta-row", children: [
            t.tag ? /* @__PURE__ */ y("div", { className: "task-app__item-tag", children: t.tag.split(" ").map((v) => `#${v}`).join(" ") }) : /* @__PURE__ */ y("div", {}),
            /* @__PURE__ */ y("div", { className: "task-app__item-age", children: rt(t.createdAt) })
          ] })
        ] }),
        /* @__PURE__ */ C("div", { className: "task-app__item-actions", children: [
          /* @__PURE__ */ y(
            "button",
            {
              className: "task-app__action-btn task-app__complete-btn",
              onClick: () => o(t.id),
              title: "Complete task",
              disabled: k || m,
              children: k ? "⏳" : "✓"
            }
          ),
          /* @__PURE__ */ y(
            "button",
            {
              className: "task-app__action-btn task-app__delete-btn",
              onClick: () => s(t.id),
              title: "Delete task",
              disabled: k || m,
              children: m ? "⏳" : "×"
            }
          )
        ] })
      ]
    }
  );
}
function Te(t) {
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
function ct({
  tasks: t,
  topTags: e,
  filters: a,
  sortDirections: o,
  dragOverTag: s,
  pendingOperations: n,
  onComplete: r,
  onDelete: c,
  onAddTag: p,
  onDragStart: k,
  onDragEnd: m,
  selectedIds: v,
  onSelectionStart: A,
  onSelectionMove: b,
  onSelectionEnd: L,
  onDragOver: O,
  onDragLeave: P,
  onDrop: q,
  toggleSort: R,
  sortTasksByAge: K,
  getSortIcon: $,
  getSortTitle: E,
  clearTasksByTag: M,
  clearRemainingTasks: Y,
  onDeletePersistedTag: X
}) {
  const z = (d, _) => /* @__PURE__ */ C(
    "div",
    {
      className: `task-app__tag-column ${s === d ? "task-app__tag-column--drag-over" : ""}`,
      onDragOver: (B) => O(B, d),
      onDragLeave: P,
      onDrop: (B) => q(B, d),
      children: [
        /* @__PURE__ */ C("div", { className: "task-app__tag-header-row", children: [
          /* @__PURE__ */ C("h3", { className: "task-app__tag-header", children: [
            "#",
            d
          ] }),
          /* @__PURE__ */ y(
            "button",
            {
              className: "task-app__sort-btn task-app__sort-btn--active",
              onClick: () => R(d),
              title: E(o[d] || "desc"),
              children: $(o[d] || "desc")
            }
          )
        ] }),
        /* @__PURE__ */ y("ul", { className: "task-app__list task-app__list--column", children: K(_, o[d] || "desc").map((B) => /* @__PURE__ */ y(
          ie,
          {
            task: B,
            isDraggable: !0,
            pendingOperations: n,
            onComplete: r,
            onDelete: c,
            onAddTag: p,
            onDragStart: k,
            onDragEnd: m,
            selected: v ? v.has(B.id) : !1
          },
          B.id
        )) })
      ]
    },
    d
  ), F = (d, _) => {
    let B = fe(t, d);
    return i && (B = B.filter((x) => {
      const j = x.tag?.split(" ") || [];
      return a.some((J) => j.includes(J));
    })), B.slice(0, _);
  }, Z = e.length, i = Array.isArray(a) && a.length > 0, l = t.filter((d) => {
    if (!i) return !0;
    const _ = d.tag?.split(" ") || [];
    return a.some((B) => _.includes(B));
  }), g = Te(Z), h = i ? e.filter((d) => fe(t, d).some((B) => {
    const x = B.tag?.split(" ") || [];
    return a.some((j) => x.includes(j));
  })) : e.slice(0, g.useTags);
  if (h.length === 0)
    return /* @__PURE__ */ y("ul", { className: "task-app__list", children: l.map((d) => /* @__PURE__ */ y(
      ie,
      {
        task: d,
        pendingOperations: n,
        onComplete: r,
        onDelete: c,
        onAddTag: p,
        onDragStart: k,
        onDragEnd: m,
        selected: v ? v.has(d.id) : !1
      },
      d.id
    )) });
  const S = tt(t, e, a).filter((d) => {
    if (!i) return !0;
    const _ = d.tag?.split(" ") || [];
    return a.some((B) => _.includes(B));
  }), f = Te(h.length);
  return /* @__PURE__ */ C("div", { className: "task-app__dynamic-layout", children: [
    f.rows.length > 0 && /* @__PURE__ */ y(Fe, { children: f.rows.map((d, _) => /* @__PURE__ */ y("div", { className: `task-app__tag-grid task-app__tag-grid--${d.columns}col`, children: d.tagIndices.map((B) => {
      const x = h[B];
      return x ? z(x, F(x, f.maxPerColumn)) : null;
    }) }, _)) }),
    S.length > 0 && /* @__PURE__ */ C(
      "div",
      {
        className: `task-app__remaining ${s === "other" ? "task-app__tag-column--drag-over" : ""}`,
        onDragOver: (d) => {
          d.preventDefault(), d.dataTransfer.dropEffect = "move", O(d, "other");
        },
        onDragLeave: (d) => P(d),
        onDrop: (d) => q(d, "other"),
        children: [
          /* @__PURE__ */ C("div", { className: "task-app__tag-header-row", children: [
            /* @__PURE__ */ y("h3", { className: "task-app__remaining-header", children: "Other Tasks" }),
            /* @__PURE__ */ y(
              "button",
              {
                className: "task-app__sort-btn task-app__sort-btn--active",
                onClick: () => R("other"),
                title: E(o.other || "desc"),
                children: $(o.other || "desc")
              }
            )
          ] }),
          /* @__PURE__ */ y("ul", { className: "task-app__list", children: K(S, o.other || "desc").map((d) => /* @__PURE__ */ y(
            ie,
            {
              task: d,
              pendingOperations: n,
              onComplete: r,
              onDelete: c,
              onAddTag: p,
              onDragStart: k,
              onDragEnd: m,
              selected: v ? v.has(d.id) : !1
            },
            d.id
          )) })
        ]
      }
    )
  ] });
}
function le({
  isOpen: t,
  title: e,
  onClose: a,
  onConfirm: o,
  children: s,
  inputValue: n,
  onInputChange: r,
  inputPlaceholder: c,
  confirmLabel: p = "Confirm",
  cancelLabel: k = "Cancel",
  confirmDisabled: m = !1,
  confirmDanger: v = !1
}) {
  return t ? /* @__PURE__ */ y(
    "div",
    {
      className: "modal-overlay",
      onClick: a,
      children: /* @__PURE__ */ C(
        "div",
        {
          className: "modal-card",
          onClick: (b) => b.stopPropagation(),
          children: [
            /* @__PURE__ */ y("h3", { children: e }),
            s,
            r && /* @__PURE__ */ y(
              "input",
              {
                type: "text",
                className: "modal-input",
                value: n || "",
                onChange: (b) => r(b.target.value),
                placeholder: c,
                autoFocus: !0,
                onKeyDown: (b) => {
                  b.key === "Enter" && !m && (b.preventDefault(), o()), b.key === "Escape" && (b.preventDefault(), a());
                }
              }
            ),
            /* @__PURE__ */ C("div", { className: "modal-actions", children: [
              /* @__PURE__ */ y(
                "button",
                {
                  className: "modal-button",
                  onClick: a,
                  children: k
                }
              ),
              /* @__PURE__ */ y(
                "button",
                {
                  className: `modal-button ${v ? "modal-button--danger" : "modal-button--primary"}`,
                  onClick: o,
                  disabled: m,
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
function ye({ isOpen: t, x: e, y: a, items: o }) {
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
function de(t) {
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
const we = 5, Se = [
  { name: "light", emoji: "☀️", label: "Light theme" },
  { name: "dark", emoji: "🌙", label: "Dark theme" },
  { name: "strawberry", emoji: "🍓", label: "Strawberry theme" },
  { name: "ocean", emoji: "🌊", label: "Ocean theme" },
  { name: "cyberpunk", emoji: "🤖", label: "Cyberpunk theme" },
  { name: "coffee", emoji: "☕", label: "Coffee theme" },
  { name: "lavender", emoji: "🪻", label: "Lavender theme" }
], it = (t) => Se.find((e) => e.name === t)?.emoji || "🌙";
function lt(t = {}) {
  const { userType: e = "public", userId: a = "public", sessionId: o } = t, [s, n] = N(/* @__PURE__ */ new Set()), [r, c] = N(null), [p, k] = N(!1), [m, v] = N(!1), [A, b] = N(null), [L, O] = N(""), [P, q] = N("light"), [R, K] = N(!1), [$, E] = N(null), [M, Y] = N(null), X = oe(null), z = oe(null), {
    tasks: F,
    pendingOperations: Z,
    initialLoad: i,
    addTask: l,
    completeTask: g,
    deleteTask: h,
    addTagToTask: S,
    updateTaskTags: f,
    bulkUpdateTaskTags: d,
    clearTasksByTag: _,
    clearRemainingTasks: B,
    // board API
    boards: x,
    currentBoardId: j,
    createBoard: J,
    deleteBoard: te,
    switchBoard: me,
    moveTasksToBoard: ae,
    createTagOnBoard: be,
    deleteTagOnBoard: De
  } = st({ userType: e, userId: a, sessionId: o }), w = nt({
    tasks: F,
    onTaskUpdate: f,
    onBulkUpdate: d
  }), se = ot();
  G(() => {
    ue(e, a, o).getPreferences().then((T) => {
      q(T.theme);
    });
  }, [e, a, o]), G(() => {
    ue(e, a, o).savePreferences({ theme: P });
  }, [P, e, a, o]), G(() => {
    console.log("[App] User context changed, initializing...", { userType: e, userId: a }), i(), X.current?.focus();
  }, [e, a]), G(() => {
    z.current && z.current.setAttribute("data-theme", P);
  }, [P]), G(() => {
    if (!R && !$ && !M) return;
    const u = (T) => {
      const D = T.target;
      D.closest(".theme-picker") || K(!1), D.closest(".board-context-menu") || E(null), D.closest(".tag-context-menu") || Y(null);
    };
    return document.addEventListener("mousedown", u), () => document.removeEventListener("mousedown", u);
  }, [R, $, M]);
  async function Be(u) {
    await l(u) && X.current && (X.current.value = "", X.current.focus());
  }
  function _e(u) {
    const T = F.filter((D) => D.tag?.split(" ").includes(u));
    c({ tag: u, count: T.length });
  }
  async function Ae(u) {
    const T = u.trim().replace(/\s+/g, "-");
    try {
      if (await be(T), A?.type === "apply-tag" && A.taskIds.length > 0) {
        const D = A.taskIds.map((ee) => {
          const V = F.find(($e) => $e.id === ee)?.tag?.split(" ").filter(Boolean) || [], Oe = [.../* @__PURE__ */ new Set([...V, T])];
          return { taskId: ee, tag: Oe.join(" ") };
        });
        await d(D), w.clearSelection();
      }
      b(null);
    } catch (D) {
      throw console.error("[App] Failed to create tag:", D), D;
    }
  }
  async function xe(u) {
    const T = u.trim();
    try {
      await J(T), A?.type === "move-to-board" && A.taskIds.length > 0 && (await ae(T, A.taskIds), w.clearSelection()), b(null);
    } catch (D) {
      throw console.error("[App] Failed to create board:", D), D;
    }
  }
  const Ce = x?.boards?.find((u) => u.id === j)?.tags || [], Ne = et(F, 6);
  return /* @__PURE__ */ y(
    "div",
    {
      ref: z,
      className: "task-app-container",
      onMouseDown: w.selectionStartHandler,
      onMouseMove: w.selectionMoveHandler,
      onMouseUp: w.selectionEndHandler,
      onMouseLeave: w.selectionEndHandler,
      onClick: (u) => {
        try {
          const T = u.target;
          if (!T.closest || !T.closest(".task-app__item")) {
            if (w.selectionJustEndedAt && Date.now() - w.selectionJustEndedAt < 300)
              return;
            w.clearSelection();
          }
        } catch {
        }
      },
      children: /* @__PURE__ */ C("div", { className: "task-app", children: [
        /* @__PURE__ */ C("div", { className: "task-app__header-container", children: [
          /* @__PURE__ */ y("h1", { className: "task-app__header", children: "Tasks" }),
          /* @__PURE__ */ C("div", { className: "theme-picker", children: [
            /* @__PURE__ */ y(
              "button",
              {
                className: "theme-toggle-btn",
                onClick: () => K(!R),
                "aria-label": "Choose theme",
                title: "Choose theme",
                children: it(P)
              }
            ),
            R && /* @__PURE__ */ y("div", { className: "theme-picker__dropdown", children: Se.map(({ name: u, emoji: T, label: D }) => /* @__PURE__ */ y(
              "button",
              {
                className: `theme-picker__option ${P === u ? "active" : ""}`,
                onClick: () => {
                  q(u), K(!1);
                },
                title: D,
                children: T
              },
              u
            )) })
          ] })
        ] }),
        /* @__PURE__ */ C("div", { className: "task-app__boards", children: [
          /* @__PURE__ */ y("div", { className: "task-app__board-list", children: (x && x.boards ? x.boards.slice(0, we) : [{ id: "main", name: "main" }]).map((u) => /* @__PURE__ */ y(
            "button",
            {
              className: `board-btn ${j === u.id ? "board-btn--active" : ""} ${w.dragOverFilter === `board:${u.id}` ? "board-btn--drag-over" : ""}`,
              onClick: () => me(u.id),
              onContextMenu: (T) => {
                T.preventDefault(), u.id !== "main" && E({ boardId: u.id, x: T.clientX, y: T.clientY });
              },
              ...u.id !== "main" ? he({
                onLongPress: (T, D) => E({ boardId: u.id, x: T, y: D })
              }) : {},
              "aria-pressed": j === u.id ? "true" : "false",
              onDragOver: (T) => {
                T.preventDefault(), T.dataTransfer.dropEffect = "move", w.setDragOverFilter(`board:${u.id}`);
              },
              onDragLeave: (T) => {
                w.setDragOverFilter(null);
              },
              onDrop: async (T) => {
                T.preventDefault(), w.setDragOverFilter(null);
                const D = de(T.dataTransfer);
                if (D.length !== 0)
                  try {
                    await ae(u.id, D);
                    try {
                      w.clearSelection();
                    } catch {
                    }
                  } catch (ee) {
                    console.error("Failed moving tasks to board", ee), alert(ee.message || "Failed to move tasks");
                  }
              },
              children: u.name
            },
            u.id
          )) }),
          /* @__PURE__ */ y("div", { className: "task-app__board-actions", children: (!x || x.boards && x.boards.length < we) && /* @__PURE__ */ y(
            "button",
            {
              className: `board-add-btn ${w.dragOverFilter === "add-board" ? "board-btn--drag-over" : ""}`,
              onClick: () => {
                O(""), k(!0);
              },
              onDragOver: (u) => {
                u.preventDefault(), u.dataTransfer.dropEffect = "move", w.setDragOverFilter("add-board");
              },
              onDragLeave: (u) => {
                w.setDragOverFilter(null);
              },
              onDrop: async (u) => {
                u.preventDefault(), w.setDragOverFilter(null);
                const T = de(u.dataTransfer);
                T.length > 0 && (O(""), b({ type: "move-to-board", taskIds: T }), k(!0));
              },
              "aria-label": "Create board",
              children: "＋"
            }
          ) })
        ] }),
        /* @__PURE__ */ y("div", { className: "task-app__controls", children: /* @__PURE__ */ y(
          "input",
          {
            ref: X,
            className: "task-app__input",
            placeholder: "Type a task and press Enter…",
            onKeyDown: (u) => {
              u.key === "Enter" && !u.shiftKey && (u.preventDefault(), Be(u.target.value)), u.key === "k" && (u.ctrlKey || u.metaKey) && (u.preventDefault(), X.current?.focus());
            }
          }
        ) }),
        /* @__PURE__ */ C("div", { className: "task-app__filters", children: [
          (() => {
            const u = re(F);
            return Array.from(/* @__PURE__ */ new Set([...Ce, ...u])).map((D) => {
              const ee = s.has(D);
              return /* @__PURE__ */ C(
                "button",
                {
                  onClick: () => {
                    n((U) => {
                      const V = new Set(U);
                      return V.has(D) ? V.delete(D) : V.add(D), V;
                    });
                  },
                  onContextMenu: (U) => {
                    U.preventDefault(), Y({ tag: D, x: U.clientX, y: U.clientY });
                  },
                  ...he({
                    onLongPress: (U, V) => Y({ tag: D, x: U, y: V })
                  }),
                  className: `${ee ? "on" : ""} ${w.dragOverFilter === D ? "task-app__filter-drag-over" : ""}`,
                  onDragOver: (U) => w.onFilterDragOver(U, D),
                  onDragLeave: w.onFilterDragLeave,
                  onDrop: (U) => w.onFilterDrop(U, D),
                  children: [
                    "#",
                    D
                  ]
                },
                D
              );
            });
          })(),
          /* @__PURE__ */ y(
            "button",
            {
              className: `task-app__filter-add ${w.dragOverFilter === "add-tag" ? "task-app__filter-drag-over" : ""}`,
              onClick: () => {
                O(""), v(!0);
              },
              onDragOver: (u) => {
                u.preventDefault(), u.dataTransfer.dropEffect = "copy", w.onFilterDragOver(u, "add-tag");
              },
              onDragLeave: w.onFilterDragLeave,
              onDrop: async (u) => {
                u.preventDefault(), w.onFilterDragLeave(u);
                const T = de(u.dataTransfer);
                T.length > 0 && (O(""), b({ type: "apply-tag", taskIds: T }), v(!0));
              },
              "aria-label": "Add tag",
              children: "＋"
            }
          )
        ] }),
        /* @__PURE__ */ y(
          ct,
          {
            tasks: F,
            topTags: Ne,
            filters: Array.from(s),
            selectedIds: w.selectedIds,
            onSelectionStart: w.selectionStartHandler,
            onSelectionMove: w.selectionMoveHandler,
            onSelectionEnd: w.selectionEndHandler,
            sortDirections: se.sortDirections,
            dragOverTag: w.dragOverTag,
            pendingOperations: Z,
            onComplete: g,
            onDelete: h,
            onAddTag: S,
            onDragStart: w.onDragStart,
            onDragEnd: w.onDragEnd,
            onDragOver: w.onDragOver,
            onDragLeave: w.onDragLeave,
            onDrop: w.onDrop,
            toggleSort: se.toggleSort,
            sortTasksByAge: se.sortTasksByAge,
            getSortIcon: se.getSortIcon,
            getSortTitle: se.getSortTitle,
            clearTasksByTag: _e,
            clearRemainingTasks: B,
            onDeletePersistedTag: De
          }
        ),
        w.isSelecting && w.marqueeRect && /* @__PURE__ */ y(
          "div",
          {
            className: "marquee-overlay",
            style: {
              left: `${w.marqueeRect.x}px`,
              top: `${w.marqueeRect.y}px`,
              width: `${w.marqueeRect.w}px`,
              height: `${w.marqueeRect.h}px`
            }
          }
        ),
        /* @__PURE__ */ y(
          le,
          {
            isOpen: !!r,
            title: `Clear Tag #${r?.tag}?`,
            onClose: () => c(null),
            onConfirm: async () => {
              if (!r) return;
              const u = r.tag;
              c(null), await _(u);
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
        /* @__PURE__ */ y(
          le,
          {
            isOpen: p,
            title: "Create New Board",
            onClose: () => {
              k(!1), b(null);
            },
            onConfirm: async () => {
              if (L.trim()) {
                k(!1);
                try {
                  await xe(L);
                } catch (u) {
                  console.error("[App] Failed to create board:", u);
                }
              }
            },
            inputValue: L,
            onInputChange: O,
            inputPlaceholder: "Board name",
            confirmLabel: "Create",
            confirmDisabled: !L.trim(),
            children: A?.type === "move-to-board" && A.taskIds.length > 0 && /* @__PURE__ */ C("p", { className: "modal-hint", children: [
              A.taskIds.length,
              " task",
              A.taskIds.length > 1 ? "s" : "",
              " will be moved to this board"
            ] })
          }
        ),
        /* @__PURE__ */ C(
          le,
          {
            isOpen: m,
            title: "Create New Tag",
            onClose: () => {
              v(!1), b(null);
            },
            onConfirm: async () => {
              if (L.trim()) {
                v(!1);
                try {
                  await Ae(L);
                } catch (u) {
                  console.error("[App] Failed to create tag:", u);
                }
              }
            },
            inputValue: L,
            onInputChange: O,
            inputPlaceholder: "Enter new tag name",
            confirmLabel: "Create",
            confirmDisabled: !L.trim(),
            children: [
              A?.type === "apply-tag" && A.taskIds.length > 0 && /* @__PURE__ */ C("p", { className: "modal-hint", children: [
                "This tag will be applied to ",
                A.taskIds.length,
                " task",
                A.taskIds.length > 1 ? "s" : ""
              ] }),
              re(F).length > 0 && /* @__PURE__ */ C("div", { className: "modal-section", children: [
                /* @__PURE__ */ y("label", { className: "modal-label", children: "Existing tags:" }),
                /* @__PURE__ */ y("div", { className: "modal-tags-list", children: re(F).map((u) => /* @__PURE__ */ C("span", { className: "modal-tag-chip", children: [
                  "#",
                  u
                ] }, u)) })
              ] })
            ]
          }
        ),
        /* @__PURE__ */ y(
          ye,
          {
            isOpen: !!$,
            x: $?.x || 0,
            y: $?.y || 0,
            items: [
              {
                label: "🗑️ Delete Board",
                isDanger: !0,
                onClick: async () => {
                  if (!$) return;
                  const u = x?.boards?.find((T) => T.id === $.boardId)?.name || $.boardId;
                  if (confirm(`Delete board "${u}"? All tasks on this board will be permanently deleted.`))
                    try {
                      await te($.boardId), E(null);
                    } catch (T) {
                      console.error("[App] Failed to delete board:", T), alert(T.message || "Failed to delete board");
                    }
                }
              }
            ]
          }
        ),
        /* @__PURE__ */ y(
          ye,
          {
            isOpen: !!M,
            x: M?.x || 0,
            y: M?.y || 0,
            items: [
              {
                label: "🗑️ Delete Tag",
                isDanger: !0,
                onClick: async () => {
                  if (!M) return;
                  const u = F.filter((T) => T.tag?.split(" ").includes(M.tag));
                  if (confirm(`Delete tag "${M.tag}" and remove it from ${u.length} task(s)?`))
                    try {
                      await _(M.tag), Y(null);
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
function mt(t, e = {}) {
  const a = new URLSearchParams(window.location.search), o = e.userType || a.get("userType") || "public", s = e.userId || a.get("userId") || "public", n = e.sessionId, r = { ...e, userType: o, userId: s, sessionId: n }, c = Ee(t);
  c.render(/* @__PURE__ */ y(lt, { ...r })), t.__root = c, console.log("[task-app] Mounted successfully", r);
}
function ft(t) {
  t.__root?.unmount();
}
export {
  mt as mount,
  ft as unmount
};
