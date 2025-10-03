import { jsxs as d, jsx as l } from "react/jsx-runtime";
import { createRoot as ct } from "react-dom/client";
import { useState as v, useRef as lt, useEffect as dt } from "react";
function N(c) {
  return {
    "Content-Type": "application/json",
    "X-User-Type": c
  };
}
function ut(c = "public") {
  return {
    async getTasks() {
      return (await fetch(`/api/task?userType=${c}`)).json();
    },
    async getStats() {
      return (await fetch(`/api/stats?userType=${c}`)).json();
    },
    async createTask(u) {
      if (c === "public")
        throw new Error("Public users cannot create tasks");
      return (await fetch("/api/task", { method: "POST", headers: N(c), body: JSON.stringify(u) })).json();
    },
    async patchTask(u, T) {
      if (c === "public")
        throw new Error("Public users cannot modify tasks");
      return (await fetch(`/api/task/${u}`, { method: "PATCH", headers: N(c), body: JSON.stringify(T) })).json();
    },
    async completeTask(u) {
      if (c === "public")
        throw new Error("Public users cannot complete tasks");
      return (await fetch(`/api/task/${u}/complete`, { method: "POST", headers: N(c) })).json();
    },
    async deleteTask(u) {
      if (c === "public")
        throw new Error("Public users cannot delete tasks");
      return (await fetch(`/api/task/${u}`, { method: "DELETE", headers: N(c) })).json();
    },
    async clearPublicTasks() {
      if (c !== "public")
        throw new Error("Only public users can clear tasks");
      return (await fetch("/api/task/clear", { method: "POST", headers: N(c) })).json();
    }
  };
}
function pt(c = {}) {
  const { basename: u = "/task", apiUrl: T, environment: C, userType: w = "public" } = c, [f, R] = v([]), [p, O] = v(void 0), [K, S] = v(null), [I, P] = v(null), [h, U] = v({}), [D, $] = v(/* @__PURE__ */ new Set()), y = lt(null), H = w === "public", g = ut(w);
  dt(() => {
    J(), y.current?.focus();
    try {
      const t = new BroadcastChannel("tasks");
      return t.onmessage = (a) => {
        a.data?.type === "tasks-updated" && m();
      }, () => t.close();
    } catch {
    }
  }, [w]);
  async function J() {
    if (H)
      try {
        await g.clearPublicTasks();
      } catch (t) {
        console.warn("Failed to clear public tasks:", t);
      }
    await m();
  }
  async function m() {
    const t = await g.getTasks();
    R((t.tasks || []).filter((a) => a.state === "Active"));
  }
  function _() {
    try {
      const t = new BroadcastChannel("tasks");
      t.postMessage({ type: "tasks-updated" }), t.close();
    } catch (t) {
      console.warn("Failed to broadcast task update:", t);
    }
  }
  async function q(t) {
    if (t = t.trim(), !!t)
      try {
        const a = X(t);
        await g.createTask(a), await m(), _(), y.current && (y.current.value = "", y.current.focus());
      } catch (a) {
        alert(a.message || "Failed to create task");
      }
  }
  function X(t) {
    const a = t.match(/^["']([^"']+)["']\s*(.*)$/);
    if (a) {
      const s = a[1], r = a[2].match(/#\w+/g)?.map((o) => o.slice(1)) || [];
      return { title: s, tag: r.join(" ") || void 0 };
    }
    const e = t.match(/^(.+?)\s+(#.+)$/);
    if (e) {
      const s = e[1], r = e[2].match(/#\w+/g)?.map((o) => o.slice(1)) || [];
      return { title: s, tag: r.join(" ") || void 0 };
    }
    return { title: t };
  }
  function z() {
    const t = f.flatMap((e) => e.tag?.split(" ") || []).filter(Boolean), a = {};
    return t.forEach((e) => a[e] = (a[e] || 0) + 1), Object.entries(a).sort((e, s) => s[1] - e[1]).slice(0, 6).map(([e]) => e);
  }
  function x(t) {
    return f.filter((a) => a.tag?.split(" ").includes(t));
  }
  function j(t) {
    return f.filter((a) => {
      if (p) {
        const e = a.tag?.split(" ") || [];
        return e.includes(p) && !t.some((s) => e.includes(s));
      } else {
        const e = a.tag?.split(" ") || [];
        return !t.some((s) => e.includes(s));
      }
    });
  }
  async function G(t) {
    const a = prompt("Enter tag (without #):");
    if (!a) return;
    const e = f.find((r) => r.id === t);
    if (!e) return;
    const s = e.tag?.split(" ") || [];
    if (s.includes(a)) return;
    const i = [...s, a].join(" ");
    try {
      await g.patchTask(t, { tag: i }), await m(), _();
    } catch (r) {
      alert(r.message || "Failed to add tag");
    }
  }
  async function Q(t) {
    const a = `complete-${t}`;
    if (!D.has(a)) {
      $((e) => /* @__PURE__ */ new Set([...e, a]));
      try {
        await g.completeTask(t), await m(), _();
      } catch (e) {
        e?.message?.includes("404") || alert(e.message || "Failed to complete task");
      } finally {
        $((e) => {
          const s = new Set(e);
          return s.delete(a), s;
        });
      }
    }
  }
  async function V(t) {
    const a = `delete-${t}`;
    if (!D.has(a)) {
      $((e) => /* @__PURE__ */ new Set([...e, a]));
      try {
        await g.deleteTask(t), await m(), _();
      } catch (e) {
        e?.message?.includes("404") || alert(e.message || "Failed to delete task");
      } finally {
        $((e) => {
          const s = new Set(e);
          return s.delete(a), s;
        });
      }
    }
  }
  async function W(t) {
    if (confirm(`Clear all tasks with #${t} tag?`))
      try {
        const a = x(t);
        for (const e of a)
          await g.deleteTask(e.id);
        await m(), _();
      } catch (a) {
        alert(a.message || "Failed to clear tagged tasks");
      }
  }
  async function Y(t) {
    if (confirm("Clear all remaining tasks?"))
      try {
        const a = j(t);
        for (const e of a)
          await g.deleteTask(e.id);
        await m(), _();
      } catch (a) {
        alert(a.message || "Failed to clear remaining tasks");
      }
  }
  function Z(t) {
    const a = /* @__PURE__ */ new Date(), e = new Date(t), s = a.getTime() - e.getTime(), i = Math.floor(s / 1e3), r = Math.floor(i / 60), o = Math.floor(r / 60), n = Math.floor(o / 24);
    return i < 60 ? `${i}s ago` : r < 60 ? `${r}m ago` : o < 24 ? `${o}h ago` : `${n}d ago`;
  }
  function A(t, a) {
    return a ? [...t].sort((e, s) => {
      const i = new Date(e.createdAt).getTime(), r = new Date(s.createdAt).getTime();
      return a === "asc" ? i - r : r - i;
    }) : t;
  }
  function E(t) {
    U((a) => {
      const e = a[t] || null;
      let s;
      return e === null ? s = "desc" : e === "desc" ? s = "asc" : s = null, { ...a, [t]: s };
    });
  }
  function M(t) {
    return t === "asc" ? "↑" : t === "desc" ? "↓" : "↕";
  }
  function L(t) {
    return t === "asc" ? "Sorted by age (oldest first) - click to sort newest first" : t === "desc" ? "Sorted by age (newest first) - click to disable sorting" : "Click to sort by age (newest first)";
  }
  function tt(t, a) {
    t.dataTransfer.setData("text/plain", a), t.dataTransfer.effectAllowed = "copy";
  }
  function at(t, a) {
    t.preventDefault(), t.dataTransfer.dropEffect = "copy", S(a);
  }
  function et(t) {
    t.currentTarget.contains(t.relatedTarget) || S(null);
  }
  async function st(t, a) {
    t.preventDefault(), S(null);
    const e = t.dataTransfer.getData("text/plain"), s = f.find((o) => o.id === e);
    if (!s) return;
    const i = s.tag?.split(" ") || [];
    if (i.includes(a)) {
      console.log(`Task already has tag: ${a}`);
      return;
    }
    const r = [...i, a].join(" ");
    console.log(`Adding tag "${a}" to task "${s.title}". New tags: "${r}"`);
    try {
      const o = await g.patchTask(e, { tag: r });
      console.log("Patch result:", o), await m(), _();
    } catch (o) {
      console.error("Failed to add tag:", o), alert(o.message || "Failed to add tag");
    }
  }
  function nt(t, a) {
    t.preventDefault(), t.dataTransfer.dropEffect = "copy", P(a);
  }
  function rt(t) {
    t.currentTarget.contains(t.relatedTarget) || P(null);
  }
  async function it(t, a) {
    t.preventDefault(), P(null);
    const e = t.dataTransfer.getData("text/plain"), s = f.find((o) => o.id === e);
    if (!s) return;
    const i = s.tag?.split(" ") || [];
    if (i.includes(a)) {
      console.log(`Task already has tag: ${a}`);
      return;
    }
    const r = [...i, a].join(" ");
    console.log(`Adding tag "${a}" to task "${s.title}" via filter drop. New tags: "${r}"`);
    try {
      const o = await g.patchTask(e, { tag: r });
      console.log("Filter drop result:", o), await m(), _();
    } catch (o) {
      console.error("Failed to add tag via filter drop:", o), alert(o.message || "Failed to add tag");
    }
  }
  function F(t, a = !0) {
    const e = D.has(`complete-${t.id}`), s = D.has(`delete-${t.id}`);
    return /* @__PURE__ */ d(
      "li",
      {
        className: "task-app__item",
        draggable: a,
        onDragStart: (i) => tt(i, t.id),
        children: [
          /* @__PURE__ */ d("div", { className: "task-app__item-content", children: [
            /* @__PURE__ */ d("div", { className: "task-app__item-title-row", children: [
              /* @__PURE__ */ l("div", { className: "task-app__item-title", children: t.title }),
              /* @__PURE__ */ l("div", { className: "task-app__item-age", children: Z(t.createdAt) })
            ] }),
            t.tag && /* @__PURE__ */ l("div", { className: "task-app__item-tag", children: t.tag.split(" ").map((i) => `#${i}`).join(" ") })
          ] }),
          /* @__PURE__ */ d("div", { className: "task-app__item-actions", children: [
            /* @__PURE__ */ l(
              "button",
              {
                className: "task-app__action-btn task-app__complete-btn",
                onClick: () => Q(t.id),
                title: "Complete task",
                disabled: e || s,
                style: { opacity: e ? 0.3 : void 0 },
                children: e ? "⏳" : "✓"
              }
            ),
            /* @__PURE__ */ l(
              "button",
              {
                className: "task-app__action-btn task-app__delete-btn",
                onClick: () => V(t.id),
                title: "Delete task",
                disabled: e || s,
                style: { opacity: s ? 0.3 : void 0 },
                children: s ? "⏳" : "×"
              }
            ),
            /* @__PURE__ */ l(
              "button",
              {
                className: "task-app__action-btn task-app__tag-btn",
                onClick: () => G(t.id),
                title: "Add tag",
                disabled: e || s,
                children: "🏷️"
              }
            )
          ] })
        ]
      },
      t.id
    );
  }
  function ot() {
    const t = z(), a = t.length, e = f.filter((n) => p ? n.tag?.split(" ").includes(p) || !1 : !0);
    if (a <= 1)
      return /* @__PURE__ */ l("ul", { className: "task-app__list", children: e.map((n) => F(n)) });
    const s = B(a), i = j(t).filter((n) => p ? n.tag?.split(" ").includes(p) || !1 : !0), r = t.slice(0, s.useTags).filter((n) => p ? x(n).some((k) => k.tag?.split(" ").includes(p)) : !0), o = B(r.length);
    return /* @__PURE__ */ d("div", { className: "task-app__dynamic-layout", children: [
      r.length > 0 && /* @__PURE__ */ l("div", { className: `task-app__tag-grid task-app__tag-grid--${o.columns}col`, children: r.map((n) => {
        let b = x(n);
        return p && (b = b.filter((k) => k.tag?.split(" ").includes(p) || !1)), b = b.slice(0, s.maxPerColumn), /* @__PURE__ */ d(
          "div",
          {
            className: `task-app__tag-column ${K === n ? "task-app__tag-column--drag-over" : ""}`,
            onDragOver: (k) => at(k, n),
            onDragLeave: et,
            onDrop: (k) => st(k, n),
            children: [
              /* @__PURE__ */ d("div", { className: "task-app__tag-header-row", children: [
                /* @__PURE__ */ d("h3", { className: "task-app__tag-header", children: [
                  "#",
                  n
                ] }),
                /* @__PURE__ */ d("div", { className: "task-app__header-actions", children: [
                  /* @__PURE__ */ l(
                    "button",
                    {
                      className: `task-app__sort-btn ${h[n] ? "task-app__sort-btn--active" : ""}`,
                      onClick: () => E(n),
                      title: L(h[n]),
                      children: M(h[n])
                    }
                  ),
                  /* @__PURE__ */ l(
                    "button",
                    {
                      className: "task-app__clear-tag-btn",
                      onClick: () => W(n),
                      title: `Clear all #${n} tasks`,
                      children: "🗑️"
                    }
                  )
                ] })
              ] }),
              /* @__PURE__ */ l("ul", { className: "task-app__list task-app__list--column", children: A(b, h[n]).map((k) => F(k, !1)) })
            ]
          },
          n
        );
      }) }),
      i.length > 0 && /* @__PURE__ */ d("div", { className: "task-app__remaining", children: [
        /* @__PURE__ */ d("div", { className: "task-app__tag-header-row", children: [
          /* @__PURE__ */ l("h3", { className: "task-app__remaining-header", children: "Other Tasks" }),
          /* @__PURE__ */ d("div", { className: "task-app__header-actions", children: [
            /* @__PURE__ */ l(
              "button",
              {
                className: `task-app__sort-btn ${h.other ? "task-app__sort-btn--active" : ""}`,
                onClick: () => E("other"),
                title: L(h.other),
                children: M(h.other)
              }
            ),
            /* @__PURE__ */ l(
              "button",
              {
                className: "task-app__clear-tag-btn",
                onClick: () => Y(t),
                title: "Clear all remaining tasks",
                children: "🗑️"
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ l("ul", { className: "task-app__list", children: A(i, h.other).map((n) => F(n)) })
      ] })
    ] });
  }
  function B(t) {
    return t === 2 ? { columns: 2, useTags: 2, maxPerColumn: 1 / 0 } : t === 3 ? { columns: 3, useTags: 3, maxPerColumn: 1 / 0 } : t >= 4 && t <= 5 ? { columns: 2, useTags: 4, maxPerColumn: 10 } : { columns: 3, useTags: 6, maxPerColumn: 10 };
  }
  return /* @__PURE__ */ d("div", { className: "task-app", children: [
    /* @__PURE__ */ l("h1", { className: "task-app__header", children: "Tasks" }),
    /* @__PURE__ */ d("div", { className: "task-app__controls", children: [
      /* @__PURE__ */ l(
        "input",
        {
          ref: y,
          className: "task-app__input",
          placeholder: "Type a task and press Enter…",
          onKeyDown: (t) => {
            t.key === "Enter" && !t.shiftKey && (t.preventDefault(), q(t.target.value)), t.key === "k" && (t.ctrlKey || t.metaKey) && (t.preventDefault(), y.current?.focus());
          }
        }
      ),
      /* @__PURE__ */ l(
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
    /* @__PURE__ */ d("div", { className: "task-app__filters", children: [
      /* @__PURE__ */ l("button", { onClick: () => O(void 0), className: p ? "" : "on", children: "All!" }),
      Array.from(new Set(f.flatMap((t) => t.tag?.split(" ") || []).filter(Boolean))).map(
        (t) => /* @__PURE__ */ d(
          "button",
          {
            onClick: () => O(t),
            className: `${p === t ? "on" : ""} ${I === t ? "task-app__filter-drag-over" : ""}`,
            onDragOver: (a) => nt(a, t),
            onDragLeave: rt,
            onDrop: (a) => it(a, t),
            children: [
              "#",
              t
            ]
          },
          t
        )
      )
    ] }),
    ot()
  ] });
}
function kt(c, u = {}) {
  const T = new URLSearchParams(window.location.search), C = u.userType || T.get("userType") || "public", w = { ...u, userType: C }, f = ct(c);
  f.render(/* @__PURE__ */ l(pt, { ...w })), c.__root = f, console.log("[task-app] Mounted successfully", w);
}
function ht(c) {
  c.__root?.unmount();
}
export {
  kt as mount,
  ht as unmount
};
