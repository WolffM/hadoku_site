import { jsxs as w, jsx as k } from "react/jsx-runtime";
import { createRoot as K } from "react-dom/client";
import { useState as C, useRef as U, useEffect as J } from "react";
function H() {
  const t = Date.now().toString(36).toUpperCase().padStart(8, "0"), s = Array.from(crypto.getRandomValues(new Uint8Array(16))).map((a) => (a % 36).toString(36).toUpperCase()).join("");
  return t + s.slice(0, 18);
}
const B = (t) => `hadoku-${t}-tasks`, L = (t) => `hadoku-${t}-stats`;
function F(t = "public") {
  const s = localStorage.getItem(B(t));
  return s ? JSON.parse(s) : {
    version: 1,
    updatedAt: (/* @__PURE__ */ new Date()).toISOString(),
    tasks: []
  };
}
function I(t, s = "public") {
  t.updatedAt = (/* @__PURE__ */ new Date()).toISOString(), localStorage.setItem(B(s), JSON.stringify(t));
}
function R(t = "public") {
  const s = localStorage.getItem(L(t));
  return s ? JSON.parse(s) : {
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
function z(t, s = "public") {
  t.updatedAt = (/* @__PURE__ */ new Date()).toISOString(), localStorage.setItem(L(s), JSON.stringify(t));
}
function x(t, s, a = "public") {
  const e = R(a);
  e.counters[t]++, e.timeline.push({
    t: (/* @__PURE__ */ new Date()).toISOString(),
    event: t,
    id: s.id
  }), e.tasks[s.id] = {
    id: s.id,
    title: s.title,
    tag: s.tag,
    state: s.state,
    createdAt: s.createdAt,
    updatedAt: s.updatedAt,
    closedAt: s.closedAt
  }, z(e, a);
}
function q(t = "public") {
  return {
    async getTasks() {
      return F(t);
    },
    async getStats() {
      return R(t);
    },
    async createTask(s) {
      const a = F(t), e = (/* @__PURE__ */ new Date()).toISOString(), n = {
        id: H(),
        title: s.title,
        tag: s.tag || null,
        state: "Active",
        createdAt: e,
        updatedAt: e,
        closedAt: null
      };
      return a.tasks.push(n), I(a, t), x("created", n, t), n;
    },
    async patchTask(s, a) {
      const e = F(t), n = e.tasks.find((r) => r.id === s);
      if (!n)
        throw new Error("Task not found");
      return a.title !== void 0 && (n.title = a.title), a.tag !== void 0 && (n.tag = a.tag), n.updatedAt = (/* @__PURE__ */ new Date()).toISOString(), I(e, t), x("edited", n, t), n;
    },
    async completeTask(s) {
      const a = F(t), e = a.tasks.find((r) => r.id === s);
      if (!e)
        throw new Error("Task not found");
      const n = (/* @__PURE__ */ new Date()).toISOString();
      return e.state = "Completed", e.updatedAt = n, e.closedAt = n, I(a, t), x("completed", e, t), e;
    },
    async deleteTask(s) {
      const a = F(t), e = a.tasks.find((r) => r.id === s);
      if (!e)
        throw new Error("Task not found");
      const n = (/* @__PURE__ */ new Date()).toISOString();
      return e.state = "Deleted", e.updatedAt = n, e.closedAt = n, I(a, t), x("deleted", e, t), e;
    },
    async clearPublicTasks() {
      return localStorage.removeItem(B(t)), localStorage.removeItem(L(t)), { message: "All tasks cleared" };
    }
  };
}
function P(t) {
  return {
    "Content-Type": "application/json",
    "X-User-Type": t
  };
}
function V(t = "public") {
  const s = q(t);
  return t === "public" ? s : {
    async getTasks() {
      const a = await s.getTasks();
      return fetch(`/task/api?userType=${t}`).then((e) => e.json()).then((e) => {
        console.log("Background sync: tasks synced from server");
      }).catch((e) => console.error("Background sync failed:", e)), a;
    },
    async getStats() {
      const a = await s.getStats();
      return fetch(`/task/api/stats?userType=${t}`).then((e) => e.json()).then((e) => {
        console.log("Background sync: stats synced from server");
      }).catch((e) => console.error("Background sync failed:", e)), a;
    },
    async createTask(a) {
      const e = await s.createTask(a);
      return fetch("/task/api", {
        method: "POST",
        headers: P(t),
        body: JSON.stringify(a)
      }).catch((n) => console.error("Failed to sync createTask:", n)), e;
    },
    async patchTask(a, e) {
      const n = await s.patchTask(a, e);
      return fetch(`/task/api/${a}`, {
        method: "PATCH",
        headers: P(t),
        body: JSON.stringify(e)
      }).catch((r) => console.error("Failed to sync patchTask:", r)), n;
    },
    async completeTask(a) {
      const e = await s.completeTask(a);
      return fetch(`/task/api/${a}/complete`, {
        method: "POST",
        headers: P(t)
      }).catch((n) => console.error("Failed to sync completeTask:", n)), e;
    },
    async deleteTask(a) {
      await s.deleteTask(a), fetch(`/task/api/${a}`, {
        method: "DELETE",
        headers: P(t)
      }).catch((e) => console.error("Failed to sync deleteTask:", e));
    },
    async clearPublicTasks() {
      throw new Error("Clear operation only available for public users");
    }
  };
}
function X(t) {
  const s = (n) => n.replace(/\s+/g, "-"), a = t.match(/^["']([^"']+)["']\s*(.*)$/);
  if (a) {
    const n = a[1], o = a[2].match(/#[^\s#]+/g)?.map((u) => s(u.slice(1))) || [];
    return { title: n, tag: o.join(" ") || void 0 };
  }
  const e = t.match(/^(.+?)\s+(#.+)$/);
  if (e) {
    const n = e[1], o = e[2].match(/#[^\s#]+/g)?.map((u) => s(u.slice(1))) || [];
    return { title: n, tag: o.join(" ") || void 0 };
  }
  return { title: t };
}
function G(t, s = 6) {
  const a = t.flatMap((n) => n.tag?.split(" ") || []).filter(Boolean), e = {};
  return a.forEach((n) => e[n] = (e[n] || 0) + 1), Object.entries(e).sort((n, r) => r[1] - n[1]).slice(0, s).map(([n]) => n);
}
function j(t, s) {
  return t.filter((a) => a.tag?.split(" ").includes(s));
}
function Q(t, s, a) {
  return t.filter((e) => {
    if (a) {
      const n = e.tag?.split(" ") || [];
      return n.includes(a) && !s.some((r) => n.includes(r));
    } else {
      const n = e.tag?.split(" ") || [];
      return !s.some((r) => n.includes(r));
    }
  });
}
function W(t) {
  return Array.from(new Set(t.flatMap((s) => s.tag?.split(" ") || []).filter(Boolean)));
}
function Y({ userType: t, isPublic: s }) {
  const [a, e] = C([]), [n, r] = C(/* @__PURE__ */ new Set()), o = V(t);
  async function u() {
    await p();
  }
  async function p() {
    const c = await o.getTasks();
    e((c.tasks || []).filter((l) => l.state === "Active"));
  }
  function g() {
    try {
      const c = new BroadcastChannel("tasks");
      c.postMessage({ type: "tasks-updated" }), c.close();
    } catch (c) {
      console.warn("Failed to broadcast task update:", c);
    }
  }
  async function S(c) {
    if (c = c.trim(), !!c)
      try {
        const l = X(c);
        return await o.createTask(l), await p(), g(), !0;
      } catch (l) {
        return alert(l.message || "Failed to create task"), !1;
      }
  }
  async function b(c) {
    const l = `complete-${c}`;
    if (!n.has(l)) {
      r((i) => /* @__PURE__ */ new Set([...i, l]));
      try {
        await o.completeTask(c), await p(), g();
      } catch (i) {
        i?.message?.includes("404") || alert(i.message || "Failed to complete task");
      } finally {
        r((i) => {
          const T = new Set(i);
          return T.delete(l), T;
        });
      }
    }
  }
  async function A(c) {
    const l = `delete-${c}`;
    if (!n.has(l)) {
      r((i) => /* @__PURE__ */ new Set([...i, l]));
      try {
        await o.deleteTask(c), await p(), g();
      } catch (i) {
        i?.message?.includes("404") || alert(i.message || "Failed to delete task");
      } finally {
        r((i) => {
          const T = new Set(i);
          return T.delete(l), T;
        });
      }
    }
  }
  async function f(c) {
    const l = prompt("Enter tag (without #):");
    if (!l) return;
    const i = l.trim().replace(/\s+/g, "-"), T = a.find((N) => N.id === c);
    if (!T) return;
    const v = T.tag?.split(" ") || [];
    if (v.includes(i)) return;
    const $ = [...v, i].join(" ");
    try {
      await o.patchTask(c, { tag: $ }), await p(), g();
    } catch (N) {
      alert(N.message || "Failed to add tag");
    }
  }
  async function h(c, l) {
    try {
      await o.patchTask(c, l), await p(), g();
    } catch (i) {
      throw i;
    }
  }
  async function y(c) {
    if (confirm(`Clear all tasks with #${c} tag?`))
      try {
        const l = a.filter((i) => i.tag?.split(" ").includes(c));
        for (const i of l)
          await o.deleteTask(i.id);
        await p(), g();
      } catch (l) {
        alert(l.message || "Failed to clear tagged tasks");
      }
  }
  async function _(c) {
    if (confirm("Clear all remaining tasks?"))
      try {
        for (const l of c)
          await o.deleteTask(l.id);
        await p(), g();
      } catch (l) {
        alert(l.message || "Failed to clear remaining tasks");
      }
  }
  return {
    tasks: a,
    pendingOperations: n,
    initialLoad: u,
    reload: p,
    addTask: S,
    completeTask: b,
    deleteTask: A,
    addTagToTask: f,
    updateTaskTags: h,
    clearTasksByTag: y,
    clearRemainingTasks: _
  };
}
function Z({ tasks: t, onTaskUpdate: s }) {
  const [a, e] = C(null), [n, r] = C(null);
  function o(f, h) {
    f.dataTransfer.setData("text/plain", h), f.dataTransfer.effectAllowed = "copy";
  }
  function u(f, h) {
    f.preventDefault(), f.dataTransfer.dropEffect = "copy", e(h);
  }
  function p(f) {
    f.currentTarget.contains(f.relatedTarget) || e(null);
  }
  async function g(f, h) {
    f.preventDefault(), e(null);
    const y = f.dataTransfer.getData("text/plain"), _ = t.find((i) => i.id === y);
    if (!_) return;
    const c = _.tag?.split(" ") || [];
    if (c.includes(h)) {
      console.log(`Task already has tag: ${h}`);
      return;
    }
    const l = [...c, h].join(" ");
    console.log(`Adding tag "${h}" to task "${_.title}". New tags: "${l}"`);
    try {
      await s(y, { tag: l });
    } catch (i) {
      console.error("Failed to add tag:", i), alert(i.message || "Failed to add tag");
    }
  }
  function S(f, h) {
    f.preventDefault(), f.dataTransfer.dropEffect = "copy", r(h);
  }
  function b(f) {
    f.currentTarget.contains(f.relatedTarget) || r(null);
  }
  async function A(f, h) {
    f.preventDefault(), r(null);
    const y = f.dataTransfer.getData("text/plain"), _ = t.find((i) => i.id === y);
    if (!_) return;
    const c = _.tag?.split(" ") || [];
    if (c.includes(h)) {
      console.log(`Task already has tag: ${h}`);
      return;
    }
    const l = [...c, h].join(" ");
    console.log(`Adding tag "${h}" to task "${_.title}" via filter drop. New tags: "${l}"`);
    try {
      await s(y, { tag: l });
    } catch (i) {
      console.error("Failed to add tag via filter drop:", i), alert(i.message || "Failed to add tag");
    }
  }
  return {
    dragOverTag: a,
    dragOverFilter: n,
    onDragStart: o,
    onDragOver: u,
    onDragLeave: p,
    onDrop: g,
    onFilterDragOver: S,
    onFilterDragLeave: b,
    onFilterDrop: A
  };
}
function tt() {
  const [t, s] = C({});
  function a(o) {
    s((u) => {
      const p = u[o] || null;
      let g;
      return p === null ? g = "desc" : p === "desc" ? g = "asc" : g = null, { ...u, [o]: g };
    });
  }
  function e(o, u) {
    return u ? [...o].sort((p, g) => {
      const S = new Date(p.createdAt).getTime(), b = new Date(g.createdAt).getTime();
      return u === "asc" ? S - b : b - S;
    }) : o;
  }
  function n(o) {
    return o === "asc" ? "↑" : o === "desc" ? "↓" : "↕";
  }
  function r(o) {
    return o === "asc" ? "Sorted by age (oldest first) - click to sort newest first" : o === "desc" ? "Sorted by age (newest first) - click to disable sorting" : "Click to sort by age (newest first)";
  }
  return {
    sortDirections: t,
    toggleSort: a,
    sortTasksByAge: e,
    getSortIcon: n,
    getSortTitle: r
  };
}
function et(t) {
  const s = /* @__PURE__ */ new Date(), a = new Date(t), e = s.getTime() - a.getTime(), n = Math.floor(e / 1e3), r = Math.floor(n / 60), o = Math.floor(r / 60), u = Math.floor(o / 24);
  return n < 60 ? `${n}s ago` : r < 60 ? `${r}m ago` : o < 24 ? `${o}h ago` : `${u}d ago`;
}
function E({
  task: t,
  isDraggable: s = !0,
  pendingOperations: a,
  onComplete: e,
  onDelete: n,
  onAddTag: r,
  onDragStart: o
}) {
  const u = a.has(`complete-${t.id}`), p = a.has(`delete-${t.id}`);
  return /* @__PURE__ */ w(
    "li",
    {
      className: "task-app__item",
      draggable: s,
      onDragStart: o ? (g) => o(g, t.id) : void 0,
      children: [
        /* @__PURE__ */ w("div", { className: "task-app__item-content", children: [
          /* @__PURE__ */ w("div", { className: "task-app__item-title-row", children: [
            /* @__PURE__ */ k("div", { className: "task-app__item-title", children: t.title }),
            /* @__PURE__ */ k("div", { className: "task-app__item-age", children: et(t.createdAt) })
          ] }),
          t.tag && /* @__PURE__ */ k("div", { className: "task-app__item-tag", children: t.tag.split(" ").map((g) => `#${g}`).join(" ") })
        ] }),
        /* @__PURE__ */ w("div", { className: "task-app__item-actions", children: [
          /* @__PURE__ */ k(
            "button",
            {
              className: "task-app__action-btn task-app__complete-btn",
              onClick: () => e(t.id),
              title: "Complete task",
              disabled: u || p,
              children: u ? "⏳" : "✓"
            }
          ),
          /* @__PURE__ */ k(
            "button",
            {
              className: "task-app__action-btn task-app__delete-btn",
              onClick: () => n(t.id),
              title: "Delete task",
              disabled: u || p,
              children: p ? "⏳" : "×"
            }
          ),
          /* @__PURE__ */ k(
            "button",
            {
              className: "task-app__action-btn task-app__tag-btn",
              onClick: () => r(t.id),
              title: "Add tag",
              disabled: u || p,
              children: "🏷️"
            }
          )
        ] })
      ]
    }
  );
}
function M(t) {
  return t === 2 ? { columns: 2, useTags: 2, maxPerColumn: 1 / 0 } : t === 3 ? { columns: 3, useTags: 3, maxPerColumn: 1 / 0 } : t >= 4 && t <= 5 ? { columns: 2, useTags: 4, maxPerColumn: 10 } : { columns: 3, useTags: 6, maxPerColumn: 10 };
}
function at({
  tasks: t,
  topTags: s,
  filter: a,
  sortDirections: e,
  dragOverTag: n,
  pendingOperations: r,
  onComplete: o,
  onDelete: u,
  onAddTag: p,
  onDragStart: g,
  onDragOver: S,
  onDragLeave: b,
  onDrop: A,
  toggleSort: f,
  sortTasksByAge: h,
  getSortIcon: y,
  getSortTitle: _,
  clearTasksByTag: c,
  clearRemainingTasks: l
}) {
  const i = s.length, T = t.filter((d) => a ? d.tag?.split(" ").includes(a) || !1 : !0);
  if (i <= 1)
    return /* @__PURE__ */ k("ul", { className: "task-app__list", children: T.map((d) => /* @__PURE__ */ k(
      E,
      {
        task: d,
        pendingOperations: r,
        onComplete: o,
        onDelete: u,
        onAddTag: p,
        onDragStart: g
      },
      d.id
    )) });
  const v = M(i), $ = Q(t, s, a).filter((d) => a ? d.tag?.split(" ").includes(a) || !1 : !0), N = s.slice(0, v.useTags).filter((d) => a ? j(t, d).some((D) => D.tag?.split(" ").includes(a)) : !0), m = M(N.length);
  return /* @__PURE__ */ w("div", { className: "task-app__dynamic-layout", children: [
    N.length > 0 && /* @__PURE__ */ k("div", { className: `task-app__tag-grid task-app__tag-grid--${m.columns}col`, children: N.map((d) => {
      let O = j(t, d);
      return a && (O = O.filter((D) => D.tag?.split(" ").includes(a) || !1)), O = O.slice(0, v.maxPerColumn), /* @__PURE__ */ w(
        "div",
        {
          className: `task-app__tag-column ${n === d ? "task-app__tag-column--drag-over" : ""}`,
          onDragOver: (D) => S(D, d),
          onDragLeave: b,
          onDrop: (D) => A(D, d),
          children: [
            /* @__PURE__ */ w("div", { className: "task-app__tag-header-row", children: [
              /* @__PURE__ */ w("h3", { className: "task-app__tag-header", children: [
                "#",
                d
              ] }),
              /* @__PURE__ */ w("div", { className: "task-app__header-actions", children: [
                /* @__PURE__ */ k(
                  "button",
                  {
                    className: `task-app__sort-btn ${e[d] ? "task-app__sort-btn--active" : ""}`,
                    onClick: () => f(d),
                    title: _(e[d]),
                    children: y(e[d])
                  }
                ),
                /* @__PURE__ */ k(
                  "button",
                  {
                    className: "task-app__clear-tag-btn",
                    onClick: () => c(d),
                    title: `Clear all #${d} tasks`,
                    children: "🗑️"
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ k("ul", { className: "task-app__list task-app__list--column", children: h(O, e[d]).map((D) => /* @__PURE__ */ k(
              E,
              {
                task: D,
                isDraggable: !1,
                pendingOperations: r,
                onComplete: o,
                onDelete: u,
                onAddTag: p
              },
              D.id
            )) })
          ]
        },
        d
      );
    }) }),
    $.length > 0 && /* @__PURE__ */ w("div", { className: "task-app__remaining", children: [
      /* @__PURE__ */ w("div", { className: "task-app__tag-header-row", children: [
        /* @__PURE__ */ k("h3", { className: "task-app__remaining-header", children: "Other Tasks" }),
        /* @__PURE__ */ w("div", { className: "task-app__header-actions", children: [
          /* @__PURE__ */ k(
            "button",
            {
              className: `task-app__sort-btn ${e.other ? "task-app__sort-btn--active" : ""}`,
              onClick: () => f("other"),
              title: _(e.other),
              children: y(e.other)
            }
          ),
          /* @__PURE__ */ k(
            "button",
            {
              className: "task-app__clear-tag-btn",
              onClick: () => l($),
              title: "Clear all remaining tasks",
              children: "🗑️"
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ k("ul", { className: "task-app__list", children: h($, e.other).map((d) => /* @__PURE__ */ k(
        E,
        {
          task: d,
          pendingOperations: r,
          onComplete: o,
          onDelete: u,
          onAddTag: p,
          onDragStart: g
        },
        d.id
      )) })
    ] })
  ] });
}
function st(t = {}) {
  const { basename: s = "/task", apiUrl: a, environment: e, userType: n = "public" } = t, [r, o] = C(void 0), u = U(null), p = n === "public", {
    tasks: g,
    pendingOperations: S,
    initialLoad: b,
    reload: A,
    addTask: f,
    completeTask: h,
    deleteTask: y,
    addTagToTask: _,
    updateTaskTags: c,
    clearTasksByTag: l,
    clearRemainingTasks: i
  } = Y({ userType: n, isPublic: p }), T = Z({
    tasks: g,
    onTaskUpdate: c
  }), v = tt();
  J(() => {
    b(), u.current?.focus();
    try {
      const m = new BroadcastChannel("tasks");
      return m.onmessage = (d) => {
        d.data?.type === "tasks-updated" && A();
      }, () => m.close();
    } catch {
    }
  }, [n]);
  async function $(m) {
    await f(m) && u.current && (u.current.value = "", u.current.focus());
  }
  const N = G(g);
  return /* @__PURE__ */ w("div", { className: "task-app", children: [
    /* @__PURE__ */ k("h1", { className: "task-app__header", children: "Tasks" }),
    /* @__PURE__ */ w("div", { className: "task-app__controls", children: [
      /* @__PURE__ */ k(
        "input",
        {
          ref: u,
          className: "task-app__input",
          placeholder: "Type a task and press Enter…",
          onKeyDown: (m) => {
            m.key === "Enter" && !m.shiftKey && (m.preventDefault(), $(m.target.value)), m.key === "k" && (m.ctrlKey || m.metaKey) && (m.preventDefault(), u.current?.focus());
          }
        }
      ),
      /* @__PURE__ */ k(
        "button",
        {
          className: "task-app__info-btn",
          title: `Task syntax:
• New task → New task
• "New task" → New task
• "New task" #friend #soon → New task with tags`,
          children: "ℹ️"
        }
      )
    ] }),
    /* @__PURE__ */ w("div", { className: "task-app__filters", children: [
      /* @__PURE__ */ k("button", { onClick: () => o(void 0), className: r ? "" : "on", children: "All!" }),
      W(g).map(
        (m) => /* @__PURE__ */ w(
          "button",
          {
            onClick: () => o(m),
            className: `${r === m ? "on" : ""} ${T.dragOverFilter === m ? "task-app__filter-drag-over" : ""}`,
            onDragOver: (d) => T.onFilterDragOver(d, m),
            onDragLeave: T.onFilterDragLeave,
            onDrop: (d) => T.onFilterDrop(d, m),
            children: [
              "#",
              m
            ]
          },
          m
        )
      )
    ] }),
    /* @__PURE__ */ k(
      at,
      {
        tasks: g,
        topTags: N,
        filter: r,
        sortDirections: v.sortDirections,
        dragOverTag: T.dragOverTag,
        pendingOperations: S,
        onComplete: h,
        onDelete: y,
        onAddTag: _,
        onDragStart: T.onDragStart,
        onDragOver: T.onDragOver,
        onDragLeave: T.onDragLeave,
        onDrop: T.onDrop,
        toggleSort: v.toggleSort,
        sortTasksByAge: v.sortTasksByAge,
        getSortIcon: v.getSortIcon,
        getSortTitle: v.getSortTitle,
        clearTasksByTag: l,
        clearRemainingTasks: i
      }
    )
  ] });
}
function ct(t, s = {}) {
  const a = new URLSearchParams(window.location.search), e = s.userType || a.get("userType") || "public", n = { ...s, userType: e }, r = K(t);
  r.render(/* @__PURE__ */ k(st, { ...n })), t.__root = r, console.log("[task-app] Mounted successfully", n);
}
function it(t) {
  t.__root?.unmount();
}
export {
  ct as mount,
  it as unmount
};
