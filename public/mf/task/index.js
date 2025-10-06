import { jsxs as _, jsx as m } from "react/jsx-runtime";
import { createRoot as L } from "react-dom/client";
import { useState as O, useRef as M, useEffect as E } from "react";
function A(t) {
  return {
    "Content-Type": "application/json",
    "X-User-Type": t
  };
}
function B(t = "public") {
  return {
    async getTasks() {
      return (await fetch(`/api/task?userType=${t}`)).json();
    },
    async getStats() {
      return (await fetch(`/api/stats?userType=${t}`)).json();
    },
    async createTask(e) {
      return (await fetch("/api/task", { method: "POST", headers: A(t), body: JSON.stringify(e) })).json();
    },
    async patchTask(e, s) {
      return (await fetch(`/api/task/${e}`, { method: "PATCH", headers: A(t), body: JSON.stringify(s) })).json();
    },
    async completeTask(e) {
      return (await fetch(`/api/task/${e}/complete`, { method: "POST", headers: A(t) })).json();
    },
    async deleteTask(e) {
      return (await fetch(`/api/task/${e}`, { method: "DELETE", headers: A(t) })).json();
    },
    async clearPublicTasks() {
      if (t !== "public")
        throw new Error("Only public users can clear tasks");
      return (await fetch("/api/task/clear", { method: "POST", headers: A(t) })).json();
    }
  };
}
function R(t) {
  const e = (a) => a.replace(/\s+/g, "-"), s = t.match(/^["']([^"']+)["']\s*(.*)$/);
  if (s) {
    const a = s[1], n = s[2].match(/#[^\s#]+/g)?.map((u) => e(u.slice(1))) || [];
    return { title: a, tag: n.join(" ") || void 0 };
  }
  const c = t.match(/^(.+?)\s+(#.+)$/);
  if (c) {
    const a = c[1], n = c[2].match(/#[^\s#]+/g)?.map((u) => e(u.slice(1))) || [];
    return { title: a, tag: n.join(" ") || void 0 };
  }
  return { title: t };
}
function I(t, e = 6) {
  const s = t.flatMap((a) => a.tag?.split(" ") || []).filter(Boolean), c = {};
  return s.forEach((a) => c[a] = (c[a] || 0) + 1), Object.entries(c).sort((a, l) => l[1] - a[1]).slice(0, e).map(([a]) => a);
}
function j(t, e) {
  return t.filter((s) => s.tag?.split(" ").includes(e));
}
function K(t, e, s) {
  return t.filter((c) => {
    if (s) {
      const a = c.tag?.split(" ") || [];
      return a.includes(s) && !e.some((l) => a.includes(l));
    } else {
      const a = c.tag?.split(" ") || [];
      return !e.some((l) => a.includes(l));
    }
  });
}
function H(t) {
  return Array.from(new Set(t.flatMap((e) => e.tag?.split(" ") || []).filter(Boolean)));
}
function U({ userType: t, isPublic: e }) {
  const [s, c] = O([]), [a, l] = O(/* @__PURE__ */ new Set()), n = B(t);
  async function u() {
    if (e)
      try {
        await n.clearPublicTasks();
      } catch (r) {
        console.warn("Failed to clear public tasks:", r);
      }
    await f();
  }
  async function f() {
    const r = await n.getTasks();
    c((r.tasks || []).filter((i) => i.state === "Active"));
  }
  function p() {
    try {
      const r = new BroadcastChannel("tasks");
      r.postMessage({ type: "tasks-updated" }), r.close();
    } catch (r) {
      console.warn("Failed to broadcast task update:", r);
    }
  }
  async function b(r) {
    if (r = r.trim(), !!r)
      try {
        const i = R(r);
        return await n.createTask(i), await f(), p(), !0;
      } catch (i) {
        return alert(i.message || "Failed to create task"), !1;
      }
  }
  async function N(r) {
    const i = `complete-${r}`;
    if (!a.has(i)) {
      l((o) => /* @__PURE__ */ new Set([...o, i]));
      try {
        await n.completeTask(r), await f(), p();
      } catch (o) {
        o?.message?.includes("404") || alert(o.message || "Failed to complete task");
      } finally {
        l((o) => {
          const T = new Set(o);
          return T.delete(i), T;
        });
      }
    }
  }
  async function S(r) {
    const i = `delete-${r}`;
    if (!a.has(i)) {
      l((o) => /* @__PURE__ */ new Set([...o, i]));
      try {
        await n.deleteTask(r), await f(), p();
      } catch (o) {
        o?.message?.includes("404") || alert(o.message || "Failed to delete task");
      } finally {
        l((o) => {
          const T = new Set(o);
          return T.delete(i), T;
        });
      }
    }
  }
  async function g(r) {
    const i = prompt("Enter tag (without #):");
    if (!i) return;
    const o = i.trim().replace(/\s+/g, "-"), T = s.find(($) => $.id === r);
    if (!T) return;
    const v = T.tag?.split(" ") || [];
    if (v.includes(o)) return;
    const C = [...v, o].join(" ");
    try {
      await n.patchTask(r, { tag: C }), await f(), p();
    } catch ($) {
      alert($.message || "Failed to add tag");
    }
  }
  async function h(r, i) {
    try {
      await n.patchTask(r, i), await f(), p();
    } catch (o) {
      throw o;
    }
  }
  async function w(r) {
    if (confirm(`Clear all tasks with #${r} tag?`))
      try {
        const i = s.filter((o) => o.tag?.split(" ").includes(r));
        for (const o of i)
          await n.deleteTask(o.id);
        await f(), p();
      } catch (i) {
        alert(i.message || "Failed to clear tagged tasks");
      }
  }
  async function y(r) {
    if (confirm("Clear all remaining tasks?"))
      try {
        for (const i of r)
          await n.deleteTask(i.id);
        await f(), p();
      } catch (i) {
        alert(i.message || "Failed to clear remaining tasks");
      }
  }
  return {
    tasks: s,
    pendingOperations: a,
    initialLoad: u,
    reload: f,
    addTask: b,
    completeTask: N,
    deleteTask: S,
    addTagToTask: g,
    updateTaskTags: h,
    clearTasksByTag: w,
    clearRemainingTasks: y
  };
}
function z({ tasks: t, onTaskUpdate: e }) {
  const [s, c] = O(null), [a, l] = O(null);
  function n(g, h) {
    g.dataTransfer.setData("text/plain", h), g.dataTransfer.effectAllowed = "copy";
  }
  function u(g, h) {
    g.preventDefault(), g.dataTransfer.dropEffect = "copy", c(h);
  }
  function f(g) {
    g.currentTarget.contains(g.relatedTarget) || c(null);
  }
  async function p(g, h) {
    g.preventDefault(), c(null);
    const w = g.dataTransfer.getData("text/plain"), y = t.find((o) => o.id === w);
    if (!y) return;
    const r = y.tag?.split(" ") || [];
    if (r.includes(h)) {
      console.log(`Task already has tag: ${h}`);
      return;
    }
    const i = [...r, h].join(" ");
    console.log(`Adding tag "${h}" to task "${y.title}". New tags: "${i}"`);
    try {
      await e(w, { tag: i });
    } catch (o) {
      console.error("Failed to add tag:", o), alert(o.message || "Failed to add tag");
    }
  }
  function b(g, h) {
    g.preventDefault(), g.dataTransfer.dropEffect = "copy", l(h);
  }
  function N(g) {
    g.currentTarget.contains(g.relatedTarget) || l(null);
  }
  async function S(g, h) {
    g.preventDefault(), l(null);
    const w = g.dataTransfer.getData("text/plain"), y = t.find((o) => o.id === w);
    if (!y) return;
    const r = y.tag?.split(" ") || [];
    if (r.includes(h)) {
      console.log(`Task already has tag: ${h}`);
      return;
    }
    const i = [...r, h].join(" ");
    console.log(`Adding tag "${h}" to task "${y.title}" via filter drop. New tags: "${i}"`);
    try {
      await e(w, { tag: i });
    } catch (o) {
      console.error("Failed to add tag via filter drop:", o), alert(o.message || "Failed to add tag");
    }
  }
  return {
    dragOverTag: s,
    dragOverFilter: a,
    onDragStart: n,
    onDragOver: u,
    onDragLeave: f,
    onDrop: p,
    onFilterDragOver: b,
    onFilterDragLeave: N,
    onFilterDrop: S
  };
}
function J() {
  const [t, e] = O({});
  function s(n) {
    e((u) => {
      const f = u[n] || null;
      let p;
      return f === null ? p = "desc" : f === "desc" ? p = "asc" : p = null, { ...u, [n]: p };
    });
  }
  function c(n, u) {
    return u ? [...n].sort((f, p) => {
      const b = new Date(f.createdAt).getTime(), N = new Date(p.createdAt).getTime();
      return u === "asc" ? b - N : N - b;
    }) : n;
  }
  function a(n) {
    return n === "asc" ? "↑" : n === "desc" ? "↓" : "↕";
  }
  function l(n) {
    return n === "asc" ? "Sorted by age (oldest first) - click to sort newest first" : n === "desc" ? "Sorted by age (newest first) - click to disable sorting" : "Click to sort by age (newest first)";
  }
  return {
    sortDirections: t,
    toggleSort: s,
    sortTasksByAge: c,
    getSortIcon: a,
    getSortTitle: l
  };
}
function q(t) {
  const e = /* @__PURE__ */ new Date(), s = new Date(t), c = e.getTime() - s.getTime(), a = Math.floor(c / 1e3), l = Math.floor(a / 60), n = Math.floor(l / 60), u = Math.floor(n / 24);
  return a < 60 ? `${a}s ago` : l < 60 ? `${l}m ago` : n < 24 ? `${n}h ago` : `${u}d ago`;
}
function x({
  task: t,
  isDraggable: e = !0,
  pendingOperations: s,
  onComplete: c,
  onDelete: a,
  onAddTag: l,
  onDragStart: n
}) {
  const u = s.has(`complete-${t.id}`), f = s.has(`delete-${t.id}`);
  return /* @__PURE__ */ _(
    "li",
    {
      className: "task-app__item",
      draggable: e,
      onDragStart: n ? (p) => n(p, t.id) : void 0,
      children: [
        /* @__PURE__ */ _("div", { className: "task-app__item-content", children: [
          /* @__PURE__ */ _("div", { className: "task-app__item-title-row", children: [
            /* @__PURE__ */ m("div", { className: "task-app__item-title", children: t.title }),
            /* @__PURE__ */ m("div", { className: "task-app__item-age", children: q(t.createdAt) })
          ] }),
          t.tag && /* @__PURE__ */ m("div", { className: "task-app__item-tag", children: t.tag.split(" ").map((p) => `#${p}`).join(" ") })
        ] }),
        /* @__PURE__ */ _("div", { className: "task-app__item-actions", children: [
          /* @__PURE__ */ m(
            "button",
            {
              className: "task-app__action-btn task-app__complete-btn",
              onClick: () => c(t.id),
              title: "Complete task",
              disabled: u || f,
              children: u ? "⏳" : "✓"
            }
          ),
          /* @__PURE__ */ m(
            "button",
            {
              className: "task-app__action-btn task-app__delete-btn",
              onClick: () => a(t.id),
              title: "Delete task",
              disabled: u || f,
              children: f ? "⏳" : "×"
            }
          ),
          /* @__PURE__ */ m(
            "button",
            {
              className: "task-app__action-btn task-app__tag-btn",
              onClick: () => l(t.id),
              title: "Add tag",
              disabled: u || f,
              children: "🏷️"
            }
          )
        ] })
      ]
    }
  );
}
function P(t) {
  return t === 2 ? { columns: 2, useTags: 2, maxPerColumn: 1 / 0 } : t === 3 ? { columns: 3, useTags: 3, maxPerColumn: 1 / 0 } : t >= 4 && t <= 5 ? { columns: 2, useTags: 4, maxPerColumn: 10 } : { columns: 3, useTags: 6, maxPerColumn: 10 };
}
function X({
  tasks: t,
  topTags: e,
  filter: s,
  sortDirections: c,
  dragOverTag: a,
  pendingOperations: l,
  onComplete: n,
  onDelete: u,
  onAddTag: f,
  onDragStart: p,
  onDragOver: b,
  onDragLeave: N,
  onDrop: S,
  toggleSort: g,
  sortTasksByAge: h,
  getSortIcon: w,
  getSortTitle: y,
  clearTasksByTag: r,
  clearRemainingTasks: i
}) {
  const o = e.length, T = t.filter((d) => s ? d.tag?.split(" ").includes(s) || !1 : !0);
  if (o <= 1)
    return /* @__PURE__ */ m("ul", { className: "task-app__list", children: T.map((d) => /* @__PURE__ */ m(
      x,
      {
        task: d,
        pendingOperations: l,
        onComplete: n,
        onDelete: u,
        onAddTag: f,
        onDragStart: p
      },
      d.id
    )) });
  const v = P(o), C = K(t, e, s).filter((d) => s ? d.tag?.split(" ").includes(s) || !1 : !0), $ = e.slice(0, v.useTags).filter((d) => s ? j(t, d).some((D) => D.tag?.split(" ").includes(s)) : !0), k = P($.length);
  return /* @__PURE__ */ _("div", { className: "task-app__dynamic-layout", children: [
    $.length > 0 && /* @__PURE__ */ m("div", { className: `task-app__tag-grid task-app__tag-grid--${k.columns}col`, children: $.map((d) => {
      let F = j(t, d);
      return s && (F = F.filter((D) => D.tag?.split(" ").includes(s) || !1)), F = F.slice(0, v.maxPerColumn), /* @__PURE__ */ _(
        "div",
        {
          className: `task-app__tag-column ${a === d ? "task-app__tag-column--drag-over" : ""}`,
          onDragOver: (D) => b(D, d),
          onDragLeave: N,
          onDrop: (D) => S(D, d),
          children: [
            /* @__PURE__ */ _("div", { className: "task-app__tag-header-row", children: [
              /* @__PURE__ */ _("h3", { className: "task-app__tag-header", children: [
                "#",
                d
              ] }),
              /* @__PURE__ */ _("div", { className: "task-app__header-actions", children: [
                /* @__PURE__ */ m(
                  "button",
                  {
                    className: `task-app__sort-btn ${c[d] ? "task-app__sort-btn--active" : ""}`,
                    onClick: () => g(d),
                    title: y(c[d]),
                    children: w(c[d])
                  }
                ),
                /* @__PURE__ */ m(
                  "button",
                  {
                    className: "task-app__clear-tag-btn",
                    onClick: () => r(d),
                    title: `Clear all #${d} tasks`,
                    children: "🗑️"
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ m("ul", { className: "task-app__list task-app__list--column", children: h(F, c[d]).map((D) => /* @__PURE__ */ m(
              x,
              {
                task: D,
                isDraggable: !1,
                pendingOperations: l,
                onComplete: n,
                onDelete: u,
                onAddTag: f
              },
              D.id
            )) })
          ]
        },
        d
      );
    }) }),
    C.length > 0 && /* @__PURE__ */ _("div", { className: "task-app__remaining", children: [
      /* @__PURE__ */ _("div", { className: "task-app__tag-header-row", children: [
        /* @__PURE__ */ m("h3", { className: "task-app__remaining-header", children: "Other Tasks" }),
        /* @__PURE__ */ _("div", { className: "task-app__header-actions", children: [
          /* @__PURE__ */ m(
            "button",
            {
              className: `task-app__sort-btn ${c.other ? "task-app__sort-btn--active" : ""}`,
              onClick: () => g("other"),
              title: y(c.other),
              children: w(c.other)
            }
          ),
          /* @__PURE__ */ m(
            "button",
            {
              className: "task-app__clear-tag-btn",
              onClick: () => i(C),
              title: "Clear all remaining tasks",
              children: "🗑️"
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ m("ul", { className: "task-app__list", children: h(C, c.other).map((d) => /* @__PURE__ */ m(
        x,
        {
          task: d,
          pendingOperations: l,
          onComplete: n,
          onDelete: u,
          onAddTag: f,
          onDragStart: p
        },
        d.id
      )) })
    ] })
  ] });
}
function G(t = {}) {
  const { basename: e = "/task", apiUrl: s, environment: c, userType: a = "public" } = t, [l, n] = O(void 0), u = M(null), f = a === "public", {
    tasks: p,
    pendingOperations: b,
    initialLoad: N,
    reload: S,
    addTask: g,
    completeTask: h,
    deleteTask: w,
    addTagToTask: y,
    updateTaskTags: r,
    clearTasksByTag: i,
    clearRemainingTasks: o
  } = U({ userType: a, isPublic: f }), T = z({
    tasks: p,
    onTaskUpdate: r
  }), v = J();
  E(() => {
    N(), u.current?.focus();
    try {
      const k = new BroadcastChannel("tasks");
      return k.onmessage = (d) => {
        d.data?.type === "tasks-updated" && S();
      }, () => k.close();
    } catch {
    }
  }, [a]);
  async function C(k) {
    await g(k) && u.current && (u.current.value = "", u.current.focus());
  }
  const $ = I(p);
  return /* @__PURE__ */ _("div", { className: "task-app", children: [
    /* @__PURE__ */ m("h1", { className: "task-app__header", children: "Tasks" }),
    /* @__PURE__ */ _("div", { className: "task-app__controls", children: [
      /* @__PURE__ */ m(
        "input",
        {
          ref: u,
          className: "task-app__input",
          placeholder: "Type a task and press Enter…",
          onKeyDown: (k) => {
            k.key === "Enter" && !k.shiftKey && (k.preventDefault(), C(k.target.value)), k.key === "k" && (k.ctrlKey || k.metaKey) && (k.preventDefault(), u.current?.focus());
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
    /* @__PURE__ */ _("div", { className: "task-app__filters", children: [
      /* @__PURE__ */ m("button", { onClick: () => n(void 0), className: l ? "" : "on", children: "All!" }),
      H(p).map(
        (k) => /* @__PURE__ */ _(
          "button",
          {
            onClick: () => n(k),
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
      X,
      {
        tasks: p,
        topTags: $,
        filter: l,
        sortDirections: v.sortDirections,
        dragOverTag: T.dragOverTag,
        pendingOperations: b,
        onComplete: h,
        onDelete: w,
        onAddTag: y,
        onDragStart: T.onDragStart,
        onDragOver: T.onDragOver,
        onDragLeave: T.onDragLeave,
        onDrop: T.onDrop,
        toggleSort: v.toggleSort,
        sortTasksByAge: v.sortTasksByAge,
        getSortIcon: v.getSortIcon,
        getSortTitle: v.getSortTitle,
        clearTasksByTag: i,
        clearRemainingTasks: o
      }
    )
  ] });
}
function Y(t, e = {}) {
  const s = new URLSearchParams(window.location.search), c = e.userType || s.get("userType") || "public", a = { ...e, userType: c }, l = L(t);
  l.render(/* @__PURE__ */ m(G, { ...a })), t.__root = l, console.log("[task-app] Mounted successfully", a);
}
function Z(t) {
  t.__root?.unmount();
}
export {
  Y as mount,
  Z as unmount
};
