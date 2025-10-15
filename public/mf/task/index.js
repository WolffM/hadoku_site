import { jsx as y, jsxs as _, Fragment as Le } from "react/jsx-runtime";
import { createRoot as Pe } from "react-dom/client";
import { useState as C, useMemo as Re, useEffect as Q, useRef as oe } from "react";
const J = `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
class Ie {
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
function fe(t, e) {
  const a = t.boards.findIndex((o) => o.id === e);
  if (a < 0)
    throw new Error(`Board ${e} not found`);
  return { board: t.boards[a], index: a };
}
function be(t, e, a, o) {
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
  const s = Z(), n = await t.getTasks(e.userType, e.userId, o), r = await t.getStats(e.userType, e.userId, o), c = a.id || je(), p = a.createdAt || s, m = {
    id: c,
    title: a.title,
    tag: a.tag ?? null,
    state: "Active",
    createdAt: p
  }, d = {
    ...n,
    tasks: [m, ...n.tasks],
    updatedAt: s
  }, h = Je(r, m, s);
  return await t.saveTasks(e.userType, e.userId, o, d), await t.saveStats(e.userType, e.userId, o, h), { ok: !0, id: c };
}
async function Ye(t, e, a, o, s = "main") {
  const n = Z(), r = await t.getTasks(e.userType, e.userId, s), c = await t.getStats(e.userType, e.userId, s), { task: p, index: m } = pe(r, a), d = {
    ...p,
    ...o,
    updatedAt: n
  }, h = [...r.tasks];
  h[m] = d;
  const D = {
    ...r,
    tasks: h,
    updatedAt: n
  }, S = He(c, d, n);
  return await t.saveTasks(e.userType, e.userId, s, D), await t.saveStats(e.userType, e.userId, s, S), { ok: !0, message: `Task ${a} updated` };
}
async function ze(t, e, a, o = "main") {
  const s = Z(), n = await t.getTasks(e.userType, e.userId, o), r = await t.getStats(e.userType, e.userId, o), { task: c, index: p } = pe(n, a), m = {
    ...c,
    state: "Completed",
    closedAt: s,
    updatedAt: s
  }, d = [...n.tasks];
  d.splice(p, 1);
  const h = {
    ...n,
    tasks: d,
    updatedAt: s
  }, D = Ue(r, m, s);
  return await t.saveTasks(e.userType, e.userId, o, h), await t.saveStats(e.userType, e.userId, o, D), { ok: !0, message: `Task ${a} completed` };
}
async function Ve(t, e, a, o = "main") {
  const s = Z(), n = await t.getTasks(e.userType, e.userId, o), r = await t.getStats(e.userType, e.userId, o), { task: c, index: p } = pe(n, a), m = {
    ...c,
    state: "Deleted",
    closedAt: s,
    updatedAt: s
  }, d = [...n.tasks];
  d.splice(p, 1);
  const h = {
    ...n,
    tasks: d,
    updatedAt: s
  }, D = Ke(r, m, s);
  return await t.saveTasks(e.userType, e.userId, o, h), await t.saveStats(e.userType, e.userId, o, D), { ok: !0, message: `Task ${a} deleted` };
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
  fe(s, a);
  const n = {
    ...s,
    updatedAt: o,
    boards: s.boards.filter((r) => r.id !== a)
  };
  return await t.saveBoards(e.userType, n, e.userId), { ok: !0, message: `Board ${a} deleted` };
}
async function Qe(t, e, a) {
  const o = Z(), s = await t.getBoards(e.userType, e.userId), { board: n, index: r } = fe(s, a.boardId), c = n.tags || [];
  if (c.includes(a.tag))
    return { ok: !0, message: `Tag ${a.tag} already exists` };
  const p = {
    ...n,
    tags: [...c, a.tag]
  }, m = be(s, r, p, o);
  return await t.saveBoards(e.userType, m, e.userId), { ok: !0, message: `Tag ${a.tag} added to board ${a.boardId}` };
}
async function Ze(t, e, a) {
  const o = Z(), s = await t.getBoards(e.userType, e.userId), { board: n, index: r } = fe(s, a.boardId), c = n.tags || [], p = {
    ...n,
    tags: c.filter((d) => d !== a.tag)
  }, m = be(s, r, p, o);
  return await t.saveBoards(e.userType, m, e.userId), { ok: !0, message: `Tag ${a.tag} removed from board ${a.boardId}` };
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
  const a = new Ie(t, e), o = { userType: "registered", userId: e };
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
      }), G("boards-updated", { sessionId: J, userType: t, userId: e }), n.board;
    },
    async deleteBoard(s) {
      await Ge(
        a,
        o,
        s
      ), await a.deleteBoardData(t, e, s), G("boards-updated", { sessionId: J, userType: t, userId: e });
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
      ), m = (await a.getTasks(t, e, n)).tasks.find((d) => d.id === c.id);
      if (!m)
        throw new Error("Task creation failed - task not found after creation");
      return r ? console.log("[localStorageApi] createTask: broadcast suppressed") : (console.log("[localStorageApi] createTask: broadcasting", {
        sessionId: J,
        boardId: n,
        taskId: c.id
      }), G("tasks-updated", { sessionId: J, userType: t, userId: e, boardId: n })), m;
    },
    async patchTask(s, n, r = "main", c = !1) {
      const p = {};
      n.title !== void 0 && (p.title = n.title), n.tag !== void 0 && n.tag !== null && (p.tag = n.tag), await Ye(
        a,
        o,
        s,
        p,
        r
      ), c || G("tasks-updated", { sessionId: J, userType: t, userId: e, boardId: r });
      const d = (await a.getTasks(t, e, r)).tasks.find((h) => h.id === s);
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
      ), G("tasks-updated", { sessionId: J, userType: t, userId: e, boardId: n });
      const c = (await a.getTasks(t, e, n)).tasks.find((p) => p.id === s);
      if (!c)
        throw new Error("Task not found after completion");
      return c;
    },
    async deleteTask(s, n = "main", r = !1) {
      console.log("[localStorageApi] deleteTask (using handler)", { id: s, boardId: n, suppressBroadcast: r });
      const p = (await a.getTasks(t, e, n)).tasks.find((m) => m.id === s);
      if (!p)
        throw new Error("Task not found");
      return await Ve(
        a,
        o,
        s,
        n
      ), r ? console.log("[localStorageApi] deleteTask: broadcast suppressed") : (console.log("[localStorageApi] deleteTask: broadcasting", { sessionId: J }), G("tasks-updated", { sessionId: J, userType: t, userId: e, boardId: n })), {
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
      ), G("boards-updated", { sessionId: J, userType: t, userId: e, boardId: n });
    },
    async deleteTag(s, n = "main") {
      await Ze(
        a,
        o,
        { boardId: n, tag: s }
      ), G("boards-updated", { sessionId: J, userType: t, userId: e, boardId: n });
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
      const p = `${a}-${o}-${c}-tasks`, m = {
        version: 1,
        updatedAt: e.updatedAt || (/* @__PURE__ */ new Date()).toISOString(),
        tasks: r.tasks
      };
      window.localStorage.setItem(p, JSON.stringify(m));
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
        console.log("[api] Synced from API:", { boards: n.boards.length, totalTasks: n.boards.reduce((r, c) => r + (c.tasks?.length || 0), 0) }), await tt(o, n, t, e);
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
      }).then((p) => p.json()).then((p) => {
        p.ok && (p.id === c.id ? console.log("[api] Background sync: createTask completed (ID matched)") : console.warn("[api] Server returned different ID (unexpected):", { client: c.id, server: p.id }));
      }).catch((p) => console.error("[api] Failed to sync createTask:", p)), c;
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
      const p = await o.patchTask(s, n, r, c);
      return fetch(`/task/api/${s}`, {
        method: "PATCH",
        headers: j(t, e, a),
        body: JSON.stringify({ ...n, boardId: r })
      }).then(() => console.log("[api] Background sync: patchTask completed")).catch((m) => console.error("[api] Failed to sync patchTask:", m)), p;
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
      for (const r of n)
        await o.patchTask(r.taskId, { tag: r.tag || void 0 }, s, !0);
      fetch("/task/api/batch-tag", {
        method: "PATCH",
        headers: j(t, e, a),
        body: JSON.stringify({ boardId: s, updates: n })
      }).then(() => console.log("[api] Background sync: batchUpdateTags completed")).catch((r) => console.error("[api] Failed to sync batchUpdateTags:", r));
    },
    async batchMoveTasks(s, n, r) {
      const c = await fetch("/task/api/batch-move", {
        method: "POST",
        headers: j(t, e, a),
        body: JSON.stringify({ sourceBoardId: s, targetBoardId: n, taskIds: r })
      });
      if (!c.ok)
        throw new Error(`Batch move failed: ${c.status}`);
      return console.log("[api] Batch move completed"), await c.json();
    },
    async batchClearTag(s, n, r) {
      for (const c of r) {
        const p = await o.getBoards().then((m) => m.boards.find((h) => h.id === s)?.tasks?.find((h) => h.id === c));
        if (p?.tag) {
          const d = p.tag.split(" ").filter(Boolean).filter((h) => h !== n);
          await o.patchTask(
            c,
            { tag: d.length > 0 ? d.join(" ") : void 0 },
            s,
            !0
          );
        }
      }
      await o.deleteTag(n, s), fetch("/task/api/batch-clear-tag", {
        method: "POST",
        headers: j(t, e, a),
        body: JSON.stringify({ boardId: s, tag: n, taskIds: r })
      }).then(() => console.log("[api] Background sync: batchClearTag completed")).catch((c) => console.error("[api] Failed to sync batchClearTag:", c));
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
function he(t, e) {
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
async function Te(t, e, a, o, s = {}) {
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
  const [o, s] = C([]), [n, r] = C(/* @__PURE__ */ new Set()), c = Re(
    () => ue(t, e || "public", a),
    [t, e, a]
  ), [p, m] = C(null), [d, h] = C("main");
  async function D() {
    console.log("[useTasks] initialLoad called"), "syncFromApi" in c && await c.syncFromApi(), await S();
  }
  async function S() {
    console.log("[useTasks] reload called", { currentBoardId: d, stack: new Error().stack?.split(`
`).slice(1, 4).join(`
`) });
    const i = await c.getBoards();
    m(i);
    const { tasks: l } = ae(i, d);
    s(l);
  }
  Q(() => {
    console.log("[useTasks] User context changed, clearing state and reloading", { userType: t, userId: e }), s([]), r(/* @__PURE__ */ new Set()), m(null), h("main"), S();
  }, [t, e]), Q(() => {
    console.log("[useTasks] Setting up BroadcastChannel listener", { currentBoardId: d, userType: t, userId: e });
    try {
      const i = new BroadcastChannel("tasks");
      return i.onmessage = (l) => {
        const g = l.data || {};
        if (console.log("[useTasks] BroadcastChannel message received", { msg: g, sessionId: J, currentBoardId: d, currentContext: { userType: t, userId: e } }), g.sessionId === J) {
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
        (g.type === "tasks-updated" || g.type === "boards-updated") && (console.log("[useTasks] BroadcastChannel: triggering reload for currentBoardId =", d), S());
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
        return await c.createTask(l, d), await S(), !0;
      } catch (l) {
        return alert(l.message || "Failed to create task"), !1;
      }
  }
  async function $(i) {
    await Te(
      `complete-${i}`,
      n,
      r,
      async () => {
        await c.completeTask(i, d), await S();
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
      r,
      async () => {
        console.log("[useTasks] deleteTask: calling api.deleteTask", { taskId: i, currentBoardId: d }), await c.deleteTask(i, d), console.log("[useTasks] deleteTask: calling reload"), await S(), console.log("[useTasks] deleteTask END");
      },
      {
        onError: (l) => alert(l.message || "Failed to delete task")
      }
    );
  }
  async function M(i) {
    const l = prompt("Enter tag (without #):");
    if (!l) return;
    const g = l.trim().replace(/^#+/, "").replace(/\s+/g, "-"), T = o.find((u) => u.id === i);
    if (!T) return;
    const w = T.tag?.split(" ") || [];
    if (w.includes(g)) return;
    const k = [...w, g].join(" ");
    try {
      await c.patchTask(i, { tag: k }, d), await S();
    } catch (u) {
      alert(u.message || "Failed to add tag");
    }
  }
  async function L(i, l, g = {}) {
    const { suppressBroadcast: T = !1, skipReload: w = !1 } = g;
    try {
      await c.patchTask(i, l, d, T), w || await S();
    } catch (k) {
      throw k;
    }
  }
  async function K(i) {
    console.log("[useTasks] bulkUpdateTaskTags START", { count: i.length });
    try {
      "batchUpdateTags" in c ? await c.batchUpdateTags(
        d,
        i.map((l) => ({ taskId: l.taskId, tag: l.tag || null }))
      ) : await ie(async () => {
        for (const { taskId: l, tag: g } of i)
          await c.patchTask(l, { tag: g }, d, !0);
      }, t, e), console.log("[useTasks] bulkUpdateTaskTags: calling reload"), await S(), console.log("[useTasks] bulkUpdateTaskTags END");
    } catch (l) {
      throw console.error("[useTasks] bulkUpdateTaskTags ERROR", l), l;
    }
  }
  async function U(i) {
    console.log("[useTasks] clearTasksByTag START", { tag: i, currentBoardId: d, taskCount: o.length });
    const l = o.filter((g) => g.tag?.split(" ").includes(i));
    if (console.log("[useTasks] clearTasksByTag: found tasks with tag", { tag: i, count: l.length }), l.length === 0) {
      console.log("[useTasks] clearTasksByTag: no tasks found with this tag, just deleting tag");
      try {
        await c.deleteTag(i, d), await S(), console.log("[useTasks] clearTasksByTag END (no tasks to clear)");
      } catch (g) {
        console.error("[useTasks] clearTasksByTag ERROR", g), console.error("[useTasks] clearTasksByTag: Please fix this error:", g.message);
      }
      return;
    }
    console.log("[useTasks] clearTasksByTag: proceeding without confirmation (dialogs blocked)", { taskCount: l.length });
    try {
      console.log("[useTasks] clearTasksByTag: starting batch clear"), "batchClearTag" in c ? await c.batchClearTag(
        d,
        i,
        l.map((g) => g.id)
      ) : await ie(async () => {
        for (const g of l) {
          const T = g.tag?.split(" ") || [], w = T.filter((u) => u !== i), k = w.length > 0 ? w.join(" ") : null;
          console.log("[useTasks] clearTasksByTag: patching task", { taskId: g.id, oldTags: T, newTags: w }), await c.patchTask(g.id, { tag: k }, d, !0);
        }
        console.log("[useTasks] clearTasksByTag: deleting tag from board", { tag: i, currentBoardId: d }), await c.deleteTag(i, d);
      }, t, e), console.log("[useTasks] clearTasksByTag: calling reload"), await S(), console.log("[useTasks] clearTasksByTag END");
    } catch (g) {
      console.error("[useTasks] clearTasksByTag ERROR", g), alert(g.message || "Failed to remove tag from tasks");
    }
  }
  async function I(i) {
    if (confirm("Clear all remaining tasks?"))
      try {
        for (const l of i)
          await c.deleteTask(l.id, d);
        await S();
      } catch (l) {
        alert(l.message || "Failed to clear remaining tasks");
      }
  }
  async function P(i) {
    await c.createBoard(i), h(i);
    const l = await c.getBoards();
    m(l);
    const { tasks: g } = ae(l, i);
    s(g);
  }
  async function V(i, l) {
    if (console.log("[useTasks] moveTasksToBoard START", { targetBoardId: i, ids: l, currentBoardId: d }), !p) return;
    const g = /* @__PURE__ */ new Set();
    for (const T of p.boards)
      for (const w of T.tasks || [])
        l.includes(w.id) && g.add(T.id);
    console.log("[useTasks] moveTasksToBoard: source boards", { sourceBoardIds: Array.from(g) });
    try {
      if ("batchMoveTasks" in c && g.size === 1) {
        const k = Array.from(g)[0];
        console.log("[useTasks] moveTasksToBoard: using batch API"), await c.batchMoveTasks(k, i, l);
      } else {
        const k = [];
        for (const u of p.boards)
          for (const B of u.tasks || [])
            l.includes(B.id) && k.push({ id: B.id, title: B.title, tag: B.tag || void 0, boardId: u.id, createdAt: B.createdAt });
        console.log("[useTasks] moveTasksToBoard: using old method, found tasks", { count: k.length }), await ie(async () => {
          for (const u of k)
            await c.createTask({ id: u.id, title: u.title, tag: u.tag, createdAt: u.createdAt }, i, !0), await c.deleteTask(u.id, u.boardId, !0);
        }, t, e);
      }
      console.log("[useTasks] moveTasksToBoard: switching to target board", { targetBoardId: i }), h(i);
      const T = await c.getBoards();
      m(T);
      const { tasks: w } = ae(T, i);
      s(w), console.log("[useTasks] moveTasksToBoard END");
    } catch (T) {
      console.error("[useTasks] moveTasksToBoard ERROR", T), alert(T.message || "Failed to move tasks");
    }
  }
  async function R(i) {
    if (await c.deleteBoard(i), d === i) {
      h("main");
      const l = await c.getBoards();
      m(l);
      const { tasks: g } = ae(l, "main");
      s(g);
    } else
      await S();
  }
  async function Y(i) {
    await c.createTag(i, d), await S();
  }
  async function H(i) {
    await c.deleteTag(i, d), await S();
  }
  function z(i) {
    h(i);
    const { tasks: l, foundBoard: g } = ae(p, i);
    g ? s(l) : S();
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
    bulkUpdateTaskTags: K,
    clearTasksByTag: U,
    clearRemainingTasks: I,
    // Board state
    boards: p,
    currentBoardId: d,
    // Board operations
    createBoard: P,
    deleteBoard: R,
    switchBoard: z,
    moveTasksToBoard: V,
    createTagOnBoard: Y,
    deleteTagOnBoard: H,
    // Lifecycle
    initialLoad: D,
    reload: S
  };
}
function ct({ tasks: t, onTaskUpdate: e, onBulkUpdate: a }) {
  const [o, s] = C(null), [n, r] = C(null), [c, p] = C(/* @__PURE__ */ new Set()), [m, d] = C(!1), [h, D] = C(null), [S, F] = C(null), $ = oe(null);
  function q(i, l) {
    const g = c.has(l) && c.size > 0 ? Array.from(c) : [l];
    console.log("[useDragAndDrop] onDragStart", { taskId: l, idsToDrag: g, selectedCount: c.size }), i.dataTransfer.setData("text/plain", g[0]);
    try {
      i.dataTransfer.setData("application/x-hadoku-task-ids", JSON.stringify(g));
    } catch {
    }
    i.dataTransfer.effectAllowed = "copyMove";
    try {
      const T = i.currentTarget, w = T.closest && T.closest(".task-app__item") ? T.closest(".task-app__item") : T;
      w.classList.add("dragging");
      const k = w.cloneNode(!0);
      k.style.boxSizing = "border-box", k.style.width = `${w.offsetWidth}px`, k.style.height = `${w.offsetHeight}px`, k.style.opacity = "0.95", k.style.transform = "none", k.style.filter = "drop-shadow(0 6px 18px rgba(0,0,0,0.12))", k.classList.add("drag-image"), k.style.position = "absolute", k.style.top = "-9999px", k.style.left = "-9999px", document.body.appendChild(k), w.__dragImage = k, p((u) => {
        if (u.has(l)) return new Set(u);
        const B = new Set(u);
        return B.add(l), B;
      });
      try {
        const u = w.closest(".task-app__tag-column");
        if (u) {
          const B = u.querySelector(".task-app__tag-header") || u.querySelector("h3"), N = (B && B.textContent || "").trim().replace(/^#/, "");
          if (N)
            try {
              i.dataTransfer.setData("application/x-hadoku-task-source", N);
            } catch {
            }
        }
      } catch {
      }
      try {
        const u = w.getBoundingClientRect();
        let B = Math.round(i.clientX - u.left), A = Math.round(i.clientY - u.top);
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
      const g = l.__dragImage;
      g && g.parentNode && g.parentNode.removeChild(g), g && delete l.__dragImage;
    } catch {
    }
    try {
      I();
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
  function K(i) {
    if (!m || !$.current) return;
    const l = $.current.x, g = $.current.y, T = i.clientX, w = i.clientY, k = Math.min(l, T), u = Math.min(g, w), B = Math.abs(T - l), A = Math.abs(w - g);
    D({ x: k, y: u, w: B, h: A });
    const N = Array.from(document.querySelectorAll(".task-app__item")), X = /* @__PURE__ */ new Set();
    for (const O of N) {
      const ee = O.getBoundingClientRect();
      if (!(ee.right < k || ee.left > k + B || ee.bottom < u || ee.top > u + A)) {
        const se = O.getAttribute("data-task-id");
        se && X.add(se), O.classList.add("selected");
      } else
        O.classList.remove("selected");
    }
    p(X);
  }
  function U(i) {
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
  function I() {
    p(/* @__PURE__ */ new Set()), Array.from(document.querySelectorAll(".task-app__item.selected")).forEach((l) => l.classList.remove("selected"));
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
        K(w);
      } catch {
      }
    }
    function g(T) {
      const w = { clientX: T.clientX, clientY: T.clientY };
      try {
        U(w);
      } catch {
      }
    }
    return document.addEventListener("mousedown", i), document.addEventListener("mousemove", l), document.addEventListener("mouseup", g), () => {
      document.removeEventListener("mousedown", i), document.removeEventListener("mousemove", l), document.removeEventListener("mouseup", g);
    };
  }, []);
  function P(i, l) {
    i.preventDefault(), i.dataTransfer.dropEffect = "copy", s(l);
  }
  function V(i) {
    i.currentTarget.contains(i.relatedTarget) || s(null);
  }
  async function R(i, l) {
    i.preventDefault(), s(null), console.log("[useDragAndDrop] onDrop START", { targetTag: l });
    let g = [];
    try {
      const k = i.dataTransfer.getData("application/x-hadoku-task-ids");
      k && (g = JSON.parse(k));
    } catch {
    }
    if (g.length === 0) {
      const k = i.dataTransfer.getData("text/plain");
      k && (g = [k]);
    }
    if (g.length === 0) return;
    let T = null;
    try {
      const k = i.dataTransfer.getData("application/x-hadoku-task-source");
      k && (T = k);
    } catch {
    }
    console.log("[useDragAndDrop] onDrop: processing", { targetTag: l, ids: g, srcTag: T, taskCount: g.length });
    const w = [];
    for (const k of g) {
      const u = t.find((O) => O.id === k);
      if (!u) continue;
      const B = u.tag?.split(" ").filter(Boolean) || [];
      if (l === "other") {
        if (B.length === 0) continue;
        w.push({ taskId: k, tag: "" });
        continue;
      }
      const A = B.includes(l);
      let N = B.slice();
      A || N.push(l), T && T !== l && (N = N.filter((O) => O !== T));
      const X = N.join(" ").trim();
      w.push({ taskId: k, tag: X });
    }
    console.log("[useDragAndDrop] onDrop: updating tasks", { updateCount: w.length });
    try {
      await a(w), console.log("[useDragAndDrop] onDrop: updates complete, clearing selection");
      try {
        I();
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
  function H(i) {
    i.currentTarget.contains(i.relatedTarget) || r(null);
  }
  async function z(i, l) {
    i.preventDefault(), r(null);
    const g = i.dataTransfer.getData("text/plain"), T = t.find((u) => u.id === g);
    if (!T) return;
    const w = T.tag?.split(" ") || [];
    if (w.includes(l)) {
      console.log(`Task already has tag: ${l}`);
      return;
    }
    const k = [...w, l].join(" ");
    console.log(`Adding tag "${l}" to task "${T.title}" via filter drop. New tags: "${k}"`);
    try {
      await e(g, { tag: k });
      try {
        I();
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
    isSelecting: m,
    marqueeRect: h,
    selectionJustEndedAt: S,
    // selection handlers
    selectionStartHandler: L,
    selectionMoveHandler: K,
    selectionEndHandler: U,
    clearSelection: I,
    onDragStart: q,
    onDragEnd: M,
    onDragOver: P,
    onDragLeave: V,
    onDrop: R,
    onFilterDragOver: Y,
    onFilterDragLeave: H,
    onFilterDrop: z
  };
}
function it() {
  const [t, e] = C({});
  function a(r) {
    e((c) => {
      const m = (c[r] || "desc") === "desc" ? "asc" : "desc";
      return { ...c, [r]: m };
    });
  }
  function o(r, c) {
    return [...r].sort((p, m) => {
      const d = new Date(p.createdAt).getTime(), h = new Date(m.createdAt).getTime();
      return c === "asc" ? d - h : h - d;
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
function Se({ onLongPress: t, delay: e = 500 }) {
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
  const p = Se({
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
      ...m ? {} : p,
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
            await r(t.id, h);
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
  const p = Se({
    onLongPress: (m, d) => s(t, m, d)
  });
  return /* @__PURE__ */ _(
    "button",
    {
      onClick: () => o(t),
      onContextMenu: (m) => {
        m.preventDefault(), s(t, m.clientX, m.clientY);
      },
      ...p,
      className: `${e ? "on" : ""} ${a ? "task-app__filter-drag-over" : ""}`,
      onDragOver: (m) => n(m, t),
      onDragLeave: r,
      onDrop: (m) => c(m, t),
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
  const m = a.has(`complete-${t.id}`), d = a.has(`delete-${t.id}`);
  return /* @__PURE__ */ _(
    "li",
    {
      className: `task-app__item ${p ? "selected" : ""}`,
      "data-task-id": t.id,
      draggable: e,
      onDragStart: r ? (h) => r(h, t.id) : void 0,
      onDragEnd: (h) => {
        if (h.currentTarget.classList.remove("dragging"), c)
          try {
            c(h);
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
  onComplete: r,
  onDelete: c,
  onAddTag: p,
  onDragStart: m,
  onDragEnd: d,
  selectedIds: h,
  onSelectionStart: D,
  onSelectionMove: S,
  onSelectionEnd: F,
  onDragOver: $,
  onDragLeave: q,
  onDrop: M,
  toggleSort: L,
  sortTasksByAge: K,
  getSortIcon: U,
  getSortTitle: I,
  clearTasksByTag: P,
  clearRemainingTasks: V,
  onDeletePersistedTag: R
}) {
  const Y = (u, B) => /* @__PURE__ */ _(
    "div",
    {
      className: `task-app__tag-column ${s === u ? "task-app__tag-column--drag-over" : ""}`,
      onDragOver: (A) => $(A, u),
      onDragLeave: q,
      onDrop: (A) => M(A, u),
      children: [
        /* @__PURE__ */ _("div", { className: "task-app__tag-header-row", children: [
          /* @__PURE__ */ _("h3", { className: "task-app__tag-header", children: [
            "#",
            u
          ] }),
          /* @__PURE__ */ y(
            "button",
            {
              className: "task-app__sort-btn task-app__sort-btn--active",
              onClick: () => L(u),
              title: I(o[u] || "desc"),
              children: U(o[u] || "desc")
            }
          )
        ] }),
        /* @__PURE__ */ y("ul", { className: "task-app__list task-app__list--column", children: K(B, o[u] || "desc").map((A) => /* @__PURE__ */ y(
          le,
          {
            task: A,
            isDraggable: !0,
            pendingOperations: n,
            onComplete: r,
            onDelete: c,
            onAddTag: p,
            onDragStart: m,
            onDragEnd: d,
            selected: h ? h.has(A.id) : !1
          },
          A.id
        )) })
      ]
    },
    u
  ), H = (u, B) => {
    let A = he(t, u);
    return i && (A = A.filter((N) => {
      const X = N.tag?.split(" ") || [];
      return a.some((O) => X.includes(O));
    })), A.slice(0, B);
  }, z = e.length, i = Array.isArray(a) && a.length > 0, l = t.filter((u) => {
    if (!i) return !0;
    const B = u.tag?.split(" ") || [];
    return a.some((A) => B.includes(A));
  }), g = ye(z), T = i ? e.filter((u) => he(t, u).some((A) => {
    const N = A.tag?.split(" ") || [];
    return a.some((X) => N.includes(X));
  })) : e.slice(0, g.useTags);
  if (T.length === 0)
    return /* @__PURE__ */ y("ul", { className: "task-app__list", children: l.map((u) => /* @__PURE__ */ y(
      le,
      {
        task: u,
        pendingOperations: n,
        onComplete: r,
        onDelete: c,
        onAddTag: p,
        onDragStart: m,
        onDragEnd: d,
        selected: h ? h.has(u.id) : !1
      },
      u.id
    )) });
  const w = nt(t, e, a).filter((u) => {
    if (!i) return !0;
    const B = u.tag?.split(" ") || [];
    return a.some((A) => B.includes(A));
  }), k = ye(T.length);
  return /* @__PURE__ */ _("div", { className: "task-app__dynamic-layout", children: [
    k.rows.length > 0 && /* @__PURE__ */ y(Le, { children: k.rows.map((u, B) => /* @__PURE__ */ y("div", { className: `task-app__tag-grid task-app__tag-grid--${u.columns}col`, children: u.tagIndices.map((A) => {
      const N = T[A];
      return N ? Y(N, H(N, k.maxPerColumn)) : null;
    }) }, B)) }),
    w.length > 0 && /* @__PURE__ */ _(
      "div",
      {
        className: `task-app__remaining ${s === "other" ? "task-app__tag-column--drag-over" : ""}`,
        onDragOver: (u) => {
          u.preventDefault(), u.dataTransfer.dropEffect = "move", $(u, "other");
        },
        onDragLeave: (u) => q(u),
        onDrop: (u) => M(u, "other"),
        children: [
          /* @__PURE__ */ _("div", { className: "task-app__tag-header-row", children: [
            /* @__PURE__ */ y("h3", { className: "task-app__remaining-header", children: "Other Tasks" }),
            /* @__PURE__ */ y(
              "button",
              {
                className: "task-app__sort-btn task-app__sort-btn--active",
                onClick: () => L("other"),
                title: I(o.other || "desc"),
                children: U(o.other || "desc")
              }
            )
          ] }),
          /* @__PURE__ */ y("ul", { className: "task-app__list", children: K(w, o.other || "desc").map((u) => /* @__PURE__ */ y(
            le,
            {
              task: u,
              pendingOperations: n,
              onComplete: r,
              onDelete: c,
              onAddTag: p,
              onDragStart: m,
              onDragEnd: d,
              selected: h ? h.has(u.id) : !1
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
            r && /* @__PURE__ */ y(
              "input",
              {
                type: "text",
                className: "modal-input",
                value: n || "",
                onChange: (S) => r(S.target.value),
                placeholder: c,
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
], pt = (t) => Be.find((e) => e.name === t)?.emoji || "🌙";
function ft(t = {}) {
  const { userType: e = "public", userId: a = "public", sessionId: o } = t, [s, n] = C(/* @__PURE__ */ new Set()), [r, c] = C(null), [p, m] = C(!1), [d, h] = C(!1), [D, S] = C(null), [F, $] = C(""), [q, M] = C(null), [L, K] = C("light"), [U, I] = C(!1), [P, V] = C(null), [R, Y] = C(null), H = oe(null), z = oe(null), {
    tasks: i,
    pendingOperations: l,
    initialLoad: g,
    addTask: T,
    completeTask: w,
    deleteTask: k,
    addTagToTask: u,
    updateTaskTags: B,
    bulkUpdateTaskTags: A,
    clearTasksByTag: N,
    clearRemainingTasks: X,
    // board API
    boards: O,
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
      K(v.theme);
    });
  }, [e, a, o]), Q(() => {
    ue(e, a, o).savePreferences({ theme: L });
  }, [L, e, a, o]), Q(() => {
    console.log("[App] User context changed, initializing...", { userType: e, userId: a }), g(), H.current?.focus();
  }, [e, a]), Q(() => {
    z.current && z.current.setAttribute("data-theme", L);
  }, [L]), Q(() => {
    if (!U && !P && !R) return;
    const f = (v) => {
      const x = v.target;
      x.closest(".theme-picker") || I(!1), x.closest(".board-context-menu") || V(null), x.closest(".tag-context-menu") || Y(null);
    };
    return document.addEventListener("mousedown", f), () => document.removeEventListener("mousedown", f);
  }, [U, P, R]);
  async function xe(f) {
    await T(f) && H.current && (H.current.value = "", H.current.focus());
  }
  function Ce(f) {
    const v = i.filter((x) => x.tag?.split(" ").includes(f));
    c({ tag: f, count: v.length });
  }
  async function Ne(f) {
    const v = f.trim().replace(/\s+/g, "-");
    try {
      if (await Ae(v), D?.type === "apply-tag" && D.taskIds.length > 0) {
        const x = D.taskIds.map((E) => {
          const W = i.find((Me) => Me.id === E)?.tag?.split(" ").filter(Boolean) || [], Ee = [.../* @__PURE__ */ new Set([...W, v])];
          return { taskId: E, tag: Ee.join(" ") };
        });
        await A(x), b.clearSelection();
      }
      S(null);
    } catch (x) {
      throw console.error("[App] Failed to create tag:", x), x;
    }
  }
  function re(f) {
    const v = f.trim();
    return v ? (O?.boards?.map((E) => E.id.toLowerCase()) || []).includes(v.toLowerCase()) ? `Board "${v}" already exists` : null : "Board name cannot be empty";
  }
  async function Oe(f) {
    const v = f.trim(), x = re(v);
    if (x) {
      M(x);
      return;
    }
    try {
      await me(v), D?.type === "move-to-board" && D.taskIds.length > 0 && (await ke(v, D.taskIds), b.clearSelection()), S(null), M(null);
    } catch (E) {
      console.error("[App] Failed to create board:", E), M(E.message || "Failed to create board");
    }
  }
  const $e = O?.boards?.find((f) => f.id === ee)?.tags || [], Fe = st(i, 6);
  return /* @__PURE__ */ y(
    "div",
    {
      ref: z,
      className: "task-app-container",
      onMouseDown: b.selectionStartHandler,
      onMouseMove: b.selectionMoveHandler,
      onMouseUp: b.selectionEndHandler,
      onMouseLeave: b.selectionEndHandler,
      onClick: (f) => {
        try {
          const v = f.target;
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
                onClick: () => I(!U),
                "aria-label": "Choose theme",
                title: "Choose theme",
                children: pt(L)
              }
            ),
            U && /* @__PURE__ */ y("div", { className: "theme-picker__dropdown", children: Be.map(({ name: f, emoji: v, label: x }) => /* @__PURE__ */ y(
              "button",
              {
                className: `theme-picker__option ${L === f ? "active" : ""}`,
                onClick: () => {
                  K(f), I(!1);
                },
                title: x,
                children: v
              },
              f
            )) })
          ] })
        ] }),
        /* @__PURE__ */ _("div", { className: "task-app__boards", children: [
          /* @__PURE__ */ y("div", { className: "task-app__board-list", children: (O && O.boards ? O.boards.slice(0, ve) : [{ id: "main", name: "main", tasks: [], tags: [] }]).map((f) => /* @__PURE__ */ y(
            lt,
            {
              board: f,
              isActive: ee === f.id,
              isDragOver: b.dragOverFilter === `board:${f.id}`,
              onSwitch: De,
              onContextMenu: (v, x, E) => V({ boardId: v, x, y: E }),
              onDragOverFilter: b.setDragOverFilter,
              onMoveTasksToBoard: ke,
              onClearSelection: b.clearSelection
            },
            f.id
          )) }),
          /* @__PURE__ */ _("div", { className: "task-app__board-actions", children: [
            (!O || O.boards && O.boards.length < ve) && /* @__PURE__ */ y(
              "button",
              {
                className: `board-add-btn ${b.dragOverFilter === "add-board" ? "board-btn--drag-over" : ""}`,
                onClick: () => {
                  $(""), M(null), m(!0);
                },
                onDragOver: (f) => {
                  f.preventDefault(), f.dataTransfer.dropEffect = "move", b.setDragOverFilter("add-board");
                },
                onDragLeave: (f) => {
                  b.setDragOverFilter(null);
                },
                onDrop: async (f) => {
                  f.preventDefault(), b.setDragOverFilter(null);
                  const v = ge(f.dataTransfer);
                  v.length > 0 && ($(""), S({ type: "move-to-board", taskIds: v }), m(!0));
                },
                "aria-label": "Create board",
                children: "＋"
              }
            ),
            e !== "public" && /* @__PURE__ */ y(
              "button",
              {
                className: "sync-btn",
                onClick: async (f) => {
                  console.log("[App] Manual refresh triggered"), await g(), f.currentTarget.blur();
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
            ref: H,
            className: "task-app__input",
            placeholder: "Type a task and press Enter…",
            onKeyDown: (f) => {
              f.key === "Enter" && !f.shiftKey && (f.preventDefault(), xe(f.target.value)), f.key === "k" && (f.ctrlKey || f.metaKey) && (f.preventDefault(), H.current?.focus());
            }
          }
        ) }),
        /* @__PURE__ */ _("div", { className: "task-app__filters", children: [
          (() => {
            const f = ce(i);
            return Array.from(/* @__PURE__ */ new Set([...$e, ...f])).map((x) => /* @__PURE__ */ y(
              dt,
              {
                tag: x,
                isActive: s.has(x),
                isDragOver: b.dragOverFilter === x,
                onToggle: (E) => {
                  n((ne) => {
                    const W = new Set(ne);
                    return W.has(E) ? W.delete(E) : W.add(E), W;
                  });
                },
                onContextMenu: (E, ne, W) => Y({ tag: E, x: ne, y: W }),
                onDragOver: b.onFilterDragOver,
                onDragLeave: b.onFilterDragLeave,
                onDrop: b.onFilterDrop
              },
              x
            ));
          })(),
          /* @__PURE__ */ y(
            "button",
            {
              className: `task-app__filter-add ${b.dragOverFilter === "add-tag" ? "task-app__filter-drag-over" : ""}`,
              onClick: () => {
                $(""), h(!0);
              },
              onDragOver: (f) => {
                f.preventDefault(), f.dataTransfer.dropEffect = "copy", b.onFilterDragOver(f, "add-tag");
              },
              onDragLeave: b.onFilterDragLeave,
              onDrop: async (f) => {
                f.preventDefault(), b.onFilterDragLeave(f);
                const v = ge(f.dataTransfer);
                v.length > 0 && ($(""), S({ type: "apply-tag", taskIds: v }), h(!0));
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
            onAddTag: u,
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
            isOpen: !!r,
            title: `Clear Tag #${r?.tag}?`,
            onClose: () => c(null),
            onConfirm: async () => {
              if (!r) return;
              const f = r.tag;
              c(null), await N(f);
            },
            confirmLabel: "Clear Tag",
            confirmDanger: !0,
            children: r && /* @__PURE__ */ _("p", { children: [
              "This will remove ",
              /* @__PURE__ */ _("strong", { children: [
                "#",
                r.tag
              ] }),
              " from",
              " ",
              /* @__PURE__ */ _("strong", { children: [
                r.count,
                " task(s)"
              ] }),
              " and delete the tag from the board."
            ] })
          }
        ),
        /* @__PURE__ */ _(
          de,
          {
            isOpen: p,
            title: "Create New Board",
            onClose: () => {
              m(!1), S(null), M(null);
            },
            onConfirm: async () => {
              if (!F.trim()) return;
              const f = re(F);
              if (f) {
                M(f);
                return;
              }
              m(!1), await Oe(F);
            },
            inputValue: F,
            onInputChange: (f) => {
              $(f), M(null);
            },
            inputPlaceholder: "Board name",
            confirmLabel: "Create",
            confirmDisabled: !F.trim() || re(F) !== null,
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
              if (F.trim()) {
                h(!1);
                try {
                  await Ne(F);
                } catch (f) {
                  console.error("[App] Failed to create tag:", f);
                }
              }
            },
            inputValue: F,
            onInputChange: $,
            inputPlaceholder: "Enter new tag name",
            confirmLabel: "Create",
            confirmDisabled: !F.trim(),
            children: [
              D?.type === "apply-tag" && D.taskIds.length > 0 && /* @__PURE__ */ _("p", { className: "modal-hint", children: [
                "This tag will be applied to ",
                D.taskIds.length,
                " task",
                D.taskIds.length > 1 ? "s" : ""
              ] }),
              ce(i).length > 0 && /* @__PURE__ */ _("div", { className: "modal-section", children: [
                /* @__PURE__ */ y("label", { className: "modal-label", children: "Existing tags:" }),
                /* @__PURE__ */ y("div", { className: "modal-tags-list", children: ce(i).map((f) => /* @__PURE__ */ _("span", { className: "modal-tag-chip", children: [
                  "#",
                  f
                ] }, f)) })
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
                  const f = O?.boards?.find((v) => v.id === P.boardId)?.name || P.boardId;
                  if (confirm(`Delete board "${f}"? All tasks on this board will be permanently deleted.`))
                    try {
                      await se(P.boardId), V(null);
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
                  const f = i.filter((v) => v.tag?.split(" ").includes(R.tag));
                  if (confirm(`Delete tag "${R.tag}" and remove it from ${f.length} task(s)?`))
                    try {
                      await N(R.tag), Y(null);
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
  const a = new URLSearchParams(window.location.search), o = e.userType || a.get("userType") || "public", s = e.userId || a.get("userId") || "public", n = e.sessionId, r = { ...e, userType: o, userId: s, sessionId: n }, c = Pe(t);
  c.render(/* @__PURE__ */ y(ft, { ...r })), t.__root = c, console.log("[task-app] Mounted successfully", r);
}
function wt(t) {
  t.__root?.unmount();
}
export {
  yt as mount,
  wt as unmount
};
