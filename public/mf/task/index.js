import { jsxs as w, jsx as m } from "react/jsx-runtime";
import { createRoot as K } from "react-dom/client";
import { useState as C, useRef as U, useEffect as J } from "react";
function H() {
  const t = Date.now().toString(36).toUpperCase().padStart(8, "0"), a = Array.from(crypto.getRandomValues(new Uint8Array(16))).map((e) => (e % 36).toString(36).toUpperCase()).join("");
  return t + a.slice(0, 18);
}
const P = "hadoku-public-tasks", L = "hadoku-public-stats";
function F() {
  const t = localStorage.getItem(P);
  return t ? JSON.parse(t) : {
    version: 1,
    updatedAt: (/* @__PURE__ */ new Date()).toISOString(),
    tasks: []
  };
}
function I(t) {
  t.updatedAt = (/* @__PURE__ */ new Date()).toISOString(), localStorage.setItem(P, JSON.stringify(t));
}
function R() {
  const t = localStorage.getItem(L);
  return t ? JSON.parse(t) : {
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
function z(t) {
  t.updatedAt = (/* @__PURE__ */ new Date()).toISOString(), localStorage.setItem(L, JSON.stringify(t));
}
function x(t, a) {
  const e = R();
  e.counters[t]++, e.timeline.push({
    t: (/* @__PURE__ */ new Date()).toISOString(),
    event: t,
    id: a.id
  }), e.tasks[a.id] = {
    id: a.id,
    title: a.title,
    tag: a.tag,
    state: a.state,
    createdAt: a.createdAt,
    updatedAt: a.updatedAt,
    closedAt: a.closedAt
  }, z(e);
}
function Y() {
  return {
    async getTasks() {
      return F();
    },
    async getStats() {
      return R();
    },
    async createTask(t) {
      const a = F(), e = (/* @__PURE__ */ new Date()).toISOString(), s = {
        id: H(),
        title: t.title,
        tag: t.tag || null,
        state: "Active",
        createdAt: e,
        updatedAt: e,
        closedAt: null
      };
      return a.tasks.push(s), I(a), x("created", s), s;
    },
    async patchTask(t, a) {
      const e = F(), s = e.tasks.find((n) => n.id === t);
      if (!s)
        throw new Error("Task not found");
      return a.title !== void 0 && (s.title = a.title), a.tag !== void 0 && (s.tag = a.tag), s.updatedAt = (/* @__PURE__ */ new Date()).toISOString(), I(e), x("edited", s), s;
    },
    async completeTask(t) {
      const a = F(), e = a.tasks.find((n) => n.id === t);
      if (!e)
        throw new Error("Task not found");
      const s = (/* @__PURE__ */ new Date()).toISOString();
      return e.state = "Completed", e.updatedAt = s, e.closedAt = s, I(a), x("completed", e), e;
    },
    async deleteTask(t) {
      const a = F(), e = a.tasks.find((n) => n.id === t);
      if (!e)
        throw new Error("Task not found");
      const s = (/* @__PURE__ */ new Date()).toISOString();
      return e.state = "Deleted", e.updatedAt = s, e.closedAt = s, I(a), x("deleted", e), e;
    },
    async clearPublicTasks() {
      return localStorage.removeItem(P), localStorage.removeItem(L), { message: "All tasks cleared" };
    }
  };
}
function E(t) {
  return {
    "Content-Type": "application/json",
    "X-User-Type": t
  };
}
function q(t = "public") {
  return t === "public" ? Y() : {
    async getTasks() {
      return (await fetch(`/task/api?userType=${t}`)).json();
    },
    async getStats() {
      return (await fetch(`/task/api/stats?userType=${t}`)).json();
    },
    async createTask(a) {
      return (await fetch("/task/api", { method: "POST", headers: E(t), body: JSON.stringify(a) })).json();
    },
    async patchTask(a, e) {
      return (await fetch(`/task/api/${a}`, { method: "PATCH", headers: E(t), body: JSON.stringify(e) })).json();
    },
    async completeTask(a) {
      return (await fetch(`/task/api/${a}/complete`, { method: "POST", headers: E(t) })).json();
    },
    async deleteTask(a) {
      return (await fetch(`/task/api/${a}`, { method: "DELETE", headers: E(t) })).json();
    },
    async clearPublicTasks() {
      throw new Error("Clear operation only available for public users");
    }
  };
}
function G(t) {
  const a = (n) => n.replace(/\s+/g, "-"), e = t.match(/^["']([^"']+)["']\s*(.*)$/);
  if (e) {
    const n = e[1], r = e[2].match(/#[^\s#]+/g)?.map((u) => a(u.slice(1))) || [];
    return { title: n, tag: r.join(" ") || void 0 };
  }
  const s = t.match(/^(.+?)\s+(#.+)$/);
  if (s) {
    const n = s[1], r = s[2].match(/#[^\s#]+/g)?.map((u) => a(u.slice(1))) || [];
    return { title: n, tag: r.join(" ") || void 0 };
  }
  return { title: t };
}
function V(t, a = 6) {
  const e = t.flatMap((n) => n.tag?.split(" ") || []).filter(Boolean), s = {};
  return e.forEach((n) => s[n] = (s[n] || 0) + 1), Object.entries(s).sort((n, l) => l[1] - n[1]).slice(0, a).map(([n]) => n);
}
function M(t, a) {
  return t.filter((e) => e.tag?.split(" ").includes(a));
}
function X(t, a, e) {
  return t.filter((s) => {
    if (e) {
      const n = s.tag?.split(" ") || [];
      return n.includes(e) && !a.some((l) => n.includes(l));
    } else {
      const n = s.tag?.split(" ") || [];
      return !a.some((l) => n.includes(l));
    }
  });
}
function Q(t) {
  return Array.from(new Set(t.flatMap((a) => a.tag?.split(" ") || []).filter(Boolean)));
}
function W({ userType: t, isPublic: a }) {
  const [e, s] = C([]), [n, l] = C(/* @__PURE__ */ new Set()), r = q(t);
  async function u() {
    await g();
  }
  async function g() {
    const o = await r.getTasks();
    s((o.tasks || []).filter((c) => c.state === "Active"));
  }
  function p() {
    try {
      const o = new BroadcastChannel("tasks");
      o.postMessage({ type: "tasks-updated" }), o.close();
    } catch (o) {
      console.warn("Failed to broadcast task update:", o);
    }
  }
  async function S(o) {
    if (o = o.trim(), !!o)
      try {
        const c = G(o);
        return await r.createTask(c), await g(), p(), !0;
      } catch (c) {
        return alert(c.message || "Failed to create task"), !1;
      }
  }
  async function b(o) {
    const c = `complete-${o}`;
    if (!n.has(c)) {
      l((i) => /* @__PURE__ */ new Set([...i, c]));
      try {
        await r.completeTask(o), await g(), p();
      } catch (i) {
        i?.message?.includes("404") || alert(i.message || "Failed to complete task");
      } finally {
        l((i) => {
          const T = new Set(i);
          return T.delete(c), T;
        });
      }
    }
  }
  async function A(o) {
    const c = `delete-${o}`;
    if (!n.has(c)) {
      l((i) => /* @__PURE__ */ new Set([...i, c]));
      try {
        await r.deleteTask(o), await g(), p();
      } catch (i) {
        i?.message?.includes("404") || alert(i.message || "Failed to delete task");
      } finally {
        l((i) => {
          const T = new Set(i);
          return T.delete(c), T;
        });
      }
    }
  }
  async function f(o) {
    const c = prompt("Enter tag (without #):");
    if (!c) return;
    const i = c.trim().replace(/\s+/g, "-"), T = e.find((N) => N.id === o);
    if (!T) return;
    const v = T.tag?.split(" ") || [];
    if (v.includes(i)) return;
    const O = [...v, i].join(" ");
    try {
      await r.patchTask(o, { tag: O }), await g(), p();
    } catch (N) {
      alert(N.message || "Failed to add tag");
    }
  }
  async function h(o, c) {
    try {
      await r.patchTask(o, c), await g(), p();
    } catch (i) {
      throw i;
    }
  }
  async function y(o) {
    if (confirm(`Clear all tasks with #${o} tag?`))
      try {
        const c = e.filter((i) => i.tag?.split(" ").includes(o));
        for (const i of c)
          await r.deleteTask(i.id);
        await g(), p();
      } catch (c) {
        alert(c.message || "Failed to clear tagged tasks");
      }
  }
  async function _(o) {
    if (confirm("Clear all remaining tasks?"))
      try {
        for (const c of o)
          await r.deleteTask(c.id);
        await g(), p();
      } catch (c) {
        alert(c.message || "Failed to clear remaining tasks");
      }
  }
  return {
    tasks: e,
    pendingOperations: n,
    initialLoad: u,
    reload: g,
    addTask: S,
    completeTask: b,
    deleteTask: A,
    addTagToTask: f,
    updateTaskTags: h,
    clearTasksByTag: y,
    clearRemainingTasks: _
  };
}
function Z({ tasks: t, onTaskUpdate: a }) {
  const [e, s] = C(null), [n, l] = C(null);
  function r(f, h) {
    f.dataTransfer.setData("text/plain", h), f.dataTransfer.effectAllowed = "copy";
  }
  function u(f, h) {
    f.preventDefault(), f.dataTransfer.dropEffect = "copy", s(h);
  }
  function g(f) {
    f.currentTarget.contains(f.relatedTarget) || s(null);
  }
  async function p(f, h) {
    f.preventDefault(), s(null);
    const y = f.dataTransfer.getData("text/plain"), _ = t.find((i) => i.id === y);
    if (!_) return;
    const o = _.tag?.split(" ") || [];
    if (o.includes(h)) {
      console.log(`Task already has tag: ${h}`);
      return;
    }
    const c = [...o, h].join(" ");
    console.log(`Adding tag "${h}" to task "${_.title}". New tags: "${c}"`);
    try {
      await a(y, { tag: c });
    } catch (i) {
      console.error("Failed to add tag:", i), alert(i.message || "Failed to add tag");
    }
  }
  function S(f, h) {
    f.preventDefault(), f.dataTransfer.dropEffect = "copy", l(h);
  }
  function b(f) {
    f.currentTarget.contains(f.relatedTarget) || l(null);
  }
  async function A(f, h) {
    f.preventDefault(), l(null);
    const y = f.dataTransfer.getData("text/plain"), _ = t.find((i) => i.id === y);
    if (!_) return;
    const o = _.tag?.split(" ") || [];
    if (o.includes(h)) {
      console.log(`Task already has tag: ${h}`);
      return;
    }
    const c = [...o, h].join(" ");
    console.log(`Adding tag "${h}" to task "${_.title}" via filter drop. New tags: "${c}"`);
    try {
      await a(y, { tag: c });
    } catch (i) {
      console.error("Failed to add tag via filter drop:", i), alert(i.message || "Failed to add tag");
    }
  }
  return {
    dragOverTag: e,
    dragOverFilter: n,
    onDragStart: r,
    onDragOver: u,
    onDragLeave: g,
    onDrop: p,
    onFilterDragOver: S,
    onFilterDragLeave: b,
    onFilterDrop: A
  };
}
function tt() {
  const [t, a] = C({});
  function e(r) {
    a((u) => {
      const g = u[r] || null;
      let p;
      return g === null ? p = "desc" : g === "desc" ? p = "asc" : p = null, { ...u, [r]: p };
    });
  }
  function s(r, u) {
    return u ? [...r].sort((g, p) => {
      const S = new Date(g.createdAt).getTime(), b = new Date(p.createdAt).getTime();
      return u === "asc" ? S - b : b - S;
    }) : r;
  }
  function n(r) {
    return r === "asc" ? "↑" : r === "desc" ? "↓" : "↕";
  }
  function l(r) {
    return r === "asc" ? "Sorted by age (oldest first) - click to sort newest first" : r === "desc" ? "Sorted by age (newest first) - click to disable sorting" : "Click to sort by age (newest first)";
  }
  return {
    sortDirections: t,
    toggleSort: e,
    sortTasksByAge: s,
    getSortIcon: n,
    getSortTitle: l
  };
}
function et(t) {
  const a = /* @__PURE__ */ new Date(), e = new Date(t), s = a.getTime() - e.getTime(), n = Math.floor(s / 1e3), l = Math.floor(n / 60), r = Math.floor(l / 60), u = Math.floor(r / 24);
  return n < 60 ? `${n}s ago` : l < 60 ? `${l}m ago` : r < 24 ? `${r}h ago` : `${u}d ago`;
}
function j({
  task: t,
  isDraggable: a = !0,
  pendingOperations: e,
  onComplete: s,
  onDelete: n,
  onAddTag: l,
  onDragStart: r
}) {
  const u = e.has(`complete-${t.id}`), g = e.has(`delete-${t.id}`);
  return /* @__PURE__ */ w(
    "li",
    {
      className: "task-app__item",
      draggable: a,
      onDragStart: r ? (p) => r(p, t.id) : void 0,
      children: [
        /* @__PURE__ */ w("div", { className: "task-app__item-content", children: [
          /* @__PURE__ */ w("div", { className: "task-app__item-title-row", children: [
            /* @__PURE__ */ m("div", { className: "task-app__item-title", children: t.title }),
            /* @__PURE__ */ m("div", { className: "task-app__item-age", children: et(t.createdAt) })
          ] }),
          t.tag && /* @__PURE__ */ m("div", { className: "task-app__item-tag", children: t.tag.split(" ").map((p) => `#${p}`).join(" ") })
        ] }),
        /* @__PURE__ */ w("div", { className: "task-app__item-actions", children: [
          /* @__PURE__ */ m(
            "button",
            {
              className: "task-app__action-btn task-app__complete-btn",
              onClick: () => s(t.id),
              title: "Complete task",
              disabled: u || g,
              children: u ? "⏳" : "✓"
            }
          ),
          /* @__PURE__ */ m(
            "button",
            {
              className: "task-app__action-btn task-app__delete-btn",
              onClick: () => n(t.id),
              title: "Delete task",
              disabled: u || g,
              children: g ? "⏳" : "×"
            }
          ),
          /* @__PURE__ */ m(
            "button",
            {
              className: "task-app__action-btn task-app__tag-btn",
              onClick: () => l(t.id),
              title: "Add tag",
              disabled: u || g,
              children: "🏷️"
            }
          )
        ] })
      ]
    }
  );
}
function B(t) {
  return t === 2 ? { columns: 2, useTags: 2, maxPerColumn: 1 / 0 } : t === 3 ? { columns: 3, useTags: 3, maxPerColumn: 1 / 0 } : t >= 4 && t <= 5 ? { columns: 2, useTags: 4, maxPerColumn: 10 } : { columns: 3, useTags: 6, maxPerColumn: 10 };
}
function at({
  tasks: t,
  topTags: a,
  filter: e,
  sortDirections: s,
  dragOverTag: n,
  pendingOperations: l,
  onComplete: r,
  onDelete: u,
  onAddTag: g,
  onDragStart: p,
  onDragOver: S,
  onDragLeave: b,
  onDrop: A,
  toggleSort: f,
  sortTasksByAge: h,
  getSortIcon: y,
  getSortTitle: _,
  clearTasksByTag: o,
  clearRemainingTasks: c
}) {
  const i = a.length, T = t.filter((d) => e ? d.tag?.split(" ").includes(e) || !1 : !0);
  if (i <= 1)
    return /* @__PURE__ */ m("ul", { className: "task-app__list", children: T.map((d) => /* @__PURE__ */ m(
      j,
      {
        task: d,
        pendingOperations: l,
        onComplete: r,
        onDelete: u,
        onAddTag: g,
        onDragStart: p
      },
      d.id
    )) });
  const v = B(i), O = X(t, a, e).filter((d) => e ? d.tag?.split(" ").includes(e) || !1 : !0), N = a.slice(0, v.useTags).filter((d) => e ? M(t, d).some((D) => D.tag?.split(" ").includes(e)) : !0), k = B(N.length);
  return /* @__PURE__ */ w("div", { className: "task-app__dynamic-layout", children: [
    N.length > 0 && /* @__PURE__ */ m("div", { className: `task-app__tag-grid task-app__tag-grid--${k.columns}col`, children: N.map((d) => {
      let $ = M(t, d);
      return e && ($ = $.filter((D) => D.tag?.split(" ").includes(e) || !1)), $ = $.slice(0, v.maxPerColumn), /* @__PURE__ */ w(
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
                /* @__PURE__ */ m(
                  "button",
                  {
                    className: `task-app__sort-btn ${s[d] ? "task-app__sort-btn--active" : ""}`,
                    onClick: () => f(d),
                    title: _(s[d]),
                    children: y(s[d])
                  }
                ),
                /* @__PURE__ */ m(
                  "button",
                  {
                    className: "task-app__clear-tag-btn",
                    onClick: () => o(d),
                    title: `Clear all #${d} tasks`,
                    children: "🗑️"
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ m("ul", { className: "task-app__list task-app__list--column", children: h($, s[d]).map((D) => /* @__PURE__ */ m(
              j,
              {
                task: D,
                isDraggable: !1,
                pendingOperations: l,
                onComplete: r,
                onDelete: u,
                onAddTag: g
              },
              D.id
            )) })
          ]
        },
        d
      );
    }) }),
    O.length > 0 && /* @__PURE__ */ w("div", { className: "task-app__remaining", children: [
      /* @__PURE__ */ w("div", { className: "task-app__tag-header-row", children: [
        /* @__PURE__ */ m("h3", { className: "task-app__remaining-header", children: "Other Tasks" }),
        /* @__PURE__ */ w("div", { className: "task-app__header-actions", children: [
          /* @__PURE__ */ m(
            "button",
            {
              className: `task-app__sort-btn ${s.other ? "task-app__sort-btn--active" : ""}`,
              onClick: () => f("other"),
              title: _(s.other),
              children: y(s.other)
            }
          ),
          /* @__PURE__ */ m(
            "button",
            {
              className: "task-app__clear-tag-btn",
              onClick: () => c(O),
              title: "Clear all remaining tasks",
              children: "🗑️"
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ m("ul", { className: "task-app__list", children: h(O, s.other).map((d) => /* @__PURE__ */ m(
        j,
        {
          task: d,
          pendingOperations: l,
          onComplete: r,
          onDelete: u,
          onAddTag: g,
          onDragStart: p
        },
        d.id
      )) })
    ] })
  ] });
}
function st(t = {}) {
  const { basename: a = "/task", apiUrl: e, environment: s, userType: n = "public" } = t, [l, r] = C(void 0), u = U(null), g = n === "public", {
    tasks: p,
    pendingOperations: S,
    initialLoad: b,
    reload: A,
    addTask: f,
    completeTask: h,
    deleteTask: y,
    addTagToTask: _,
    updateTaskTags: o,
    clearTasksByTag: c,
    clearRemainingTasks: i
  } = W({ userType: n, isPublic: g }), T = Z({
    tasks: p,
    onTaskUpdate: o
  }), v = tt();
  J(() => {
    b(), u.current?.focus();
    try {
      const k = new BroadcastChannel("tasks");
      return k.onmessage = (d) => {
        d.data?.type === "tasks-updated" && A();
      }, () => k.close();
    } catch {
    }
  }, [n]);
  async function O(k) {
    await f(k) && u.current && (u.current.value = "", u.current.focus());
  }
  const N = V(p);
  return /* @__PURE__ */ w("div", { className: "task-app", children: [
    /* @__PURE__ */ m("h1", { className: "task-app__header", children: "Tasks" }),
    /* @__PURE__ */ w("div", { className: "task-app__controls", children: [
      /* @__PURE__ */ m(
        "input",
        {
          ref: u,
          className: "task-app__input",
          placeholder: "Type a task and press Enter…",
          onKeyDown: (k) => {
            k.key === "Enter" && !k.shiftKey && (k.preventDefault(), O(k.target.value)), k.key === "k" && (k.ctrlKey || k.metaKey) && (k.preventDefault(), u.current?.focus());
          }
        }
      ),
      /* @__PURE__ */ m(
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
      /* @__PURE__ */ m("button", { onClick: () => r(void 0), className: l ? "" : "on", children: "All" }),
      Q(p).map(
        (k) => /* @__PURE__ */ w(
          "button",
          {
            onClick: () => r(k),
            className: `${l === k ? "on" : ""} ${T.dragOverFilter === k ? "task-app__filter-drag-over" : ""}`,
            onDragOver: (d) => T.onFilterDragOver(d, k),
            onDragLeave: T.onFilterDragLeave,
            onDrop: (d) => T.onFilterDrop(d, k),
            children: [
              "#",
              k
            ]
          },
          k
        )
      )
    ] }),
    /* @__PURE__ */ m(
      at,
      {
        tasks: p,
        topTags: N,
        filter: l,
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
        clearTasksByTag: c,
        clearRemainingTasks: i
      }
    )
  ] });
}
function it(t, a = {}) {
  const e = new URLSearchParams(window.location.search), s = a.userType || e.get("userType") || "public", n = { ...a, userType: s }, l = K(t);
  l.render(/* @__PURE__ */ m(st, { ...n })), t.__root = l, console.log("[task-app] Mounted successfully", n);
}
function ct(t) {
  t.__root?.unmount();
}
export {
  it as mount,
  ct as unmount
};
