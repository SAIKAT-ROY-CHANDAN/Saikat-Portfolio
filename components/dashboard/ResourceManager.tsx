"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export interface FieldDef {
  key: string;
  label: string;
  type: "text" | "textarea" | "image" | "date";
  placeholder?: string;
}

interface Props {
  title: string;
  endpoint: string;
  fields: FieldDef[];
  displayKey: string;
  entries?: any[];
}

const emptyOf = (fields: FieldDef[]) =>
  Object.fromEntries(fields.map((f) => [f.key, ""]));

export default function ResourceManager({
  title,
  endpoint,
  fields,
  displayKey,
  entries = [],
}: Props) {
  const router = useRouter();
  const [form, setForm] = useState<Record<string, string>>(emptyOf(fields));
  const [editingId, setEditingId] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const items = entries;
  const hasDefaults = items.some((i) => i.isDefault);

  const submit = async () => {
    setBusy(true);
    setMsg(null);
    try {
      const method = editingId ? "PUT" : "POST";
      const url = editingId ? `${endpoint}/${editingId}` : endpoint;
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("save failed");
      setForm(emptyOf(fields));
      setEditingId(null);
      setMsg("Saved!");
      router.refresh();
    } catch {
      setMsg("Save failed — are you logged in as admin?");
    } finally {
      setBusy(false);
    }
  };

  const edit = (item: any) => {
    setEditingId(item._id ?? item.id);
    const next: Record<string, string> = {};
    for (const f of fields) {
      const v = item[f.key];
      next[f.key] = Array.isArray(v) ? v.join(", ") : (v ?? "");
    }
    setForm(next);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this item?")) return;
    await fetch(`${endpoint}/${id}`, { method: "DELETE" });
    router.refresh();
  };

  return (
    <div>
      <h2 className="text-xl font-bold text-white mb-4">
        {title} <span className="text-sm font-normal text-white-200">({items.length})</span>
      </h2>
      {hasDefaults && (
        <p className="text-[11px] text-white-200 bg-white/5 border border-white/10 rounded-lg px-3 py-2 mb-3">
          Showing the defaults from the homepage. Add your own entry to take
          over this list.
        </p>
      )}
      <div className="grid md:grid-cols-2 gap-3 p-4 rounded-2xl bg-[#04071D] border border-white/10">
        {fields.map((f) =>
          f.type === "textarea" ? (
            <textarea
              key={f.key}
              value={form[f.key]}
              onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
              placeholder={f.placeholder ?? f.label}
              rows={3}
              className="md:col-span-2 bg-gray-50 text-black-100 rounded-md p-2 text-sm border border-gray-300"
            />
          ) : (
            <input
              key={f.key}
              type={f.type === "image" ? "text" : f.type}
              value={form[f.key]}
              onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
              placeholder={f.placeholder ?? f.label}
              className="bg-gray-50 text-black-100 rounded-md p-2 text-sm border border-gray-300"
            />
          )
        )}
        <div className="md:col-span-2 flex gap-2 items-center">
          <button
            onClick={submit}
            disabled={busy}
            className="bg-white text-black-100 font-bold text-sm px-5 py-2 rounded-xl disabled:opacity-50"
          >
            {editingId ? "Update" : "Add"}
          </button>
          {editingId && (
            <button
              onClick={() => {
                setEditingId(null);
                setForm(emptyOf(fields));
              }}
              className="text-xs text-white-200 underline"
            >
              Cancel edit
            </button>
          )}
          {msg && <span className="text-xs text-white-100">{msg}</span>}
        </div>
      </div>

      <div className="mt-4 space-y-2">
        {items.map((item) => (
          <div
            key={item._id ?? item.id}
            className="flex items-center gap-3 p-3 rounded-xl bg-black-200 border border-white/10"
          >
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white truncate flex items-center gap-2">
                {String(item[displayKey] ?? "(untitled)").slice(0, 80)}
                {item.isDefault && (
                  <span className="shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/10 border border-white/20 text-white-200">
                    default
                  </span>
                )}
              </p>
              <p className="text-[11px] text-white-200 truncate">
                {item._id ?? item.id}
              </p>
            </div>
            {!item.isDefault && (
              <>
                <button
                  onClick={() => edit(item)}
                  className="text-xs font-bold px-3 py-1.5 rounded-lg bg-purple/30 border border-purple/50 text-white"
                >
                  Edit
                </button>
                <button
                  onClick={() => remove(item._id ?? item.id)}
                  className="text-xs font-bold px-3 py-1.5 rounded-lg bg-red-500/20 border border-red-500/50 text-red-200"
                >
                  Delete
                </button>
              </>
            )}
          </div>
        ))}
        {!items.length && (
          <p className="text-xs text-white-200">
            Nothing here yet — add your first item above.
          </p>
        )}
      </div>
    </div>
  );
}