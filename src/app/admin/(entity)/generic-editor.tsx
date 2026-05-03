import { saveEntityAction } from "./editor-actions";

export type EditorField =
  | { kind: "text"; name: string; label: string; defaultValue?: string | null; required?: boolean }
  | { kind: "textarea"; name: string; label: string; defaultValue?: string | null; rows?: number }
  | { kind: "select"; name: string; label: string; defaultValue?: string | null; options: { value: string; label: string }[] }
  | { kind: "checkbox"; name: string; label: string; defaultChecked?: boolean }
  | { kind: "datetime"; name: string; label: string; defaultValue?: string | null };

type Props = {
  entity: "article" | "event" | "job" | "property" | "directory";
  id: string;
  fields: EditorField[];
  detailHref?: string;
};

export function GenericEditor({ entity, id, fields, detailHref }: Props) {
  return (
    <form action={saveEntityAction} className="space-y-4">
      <input type="hidden" name="__entity" value={entity} />
      <input type="hidden" name="__id" value={id} />
      {fields.map((f) => (
        <FieldRow key={f.name} field={f} />
      ))}
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-zinc-200 pt-4 dark:border-zinc-700">
        {detailHref ? (
          <a
            href={detailHref}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-zinc-600 underline dark:text-zinc-400"
          >
            Open public page ↗
          </a>
        ) : (
          <span />
        )}
        <button
          type="submit"
          className="rounded-full bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900"
        >
          Save changes
        </button>
      </div>
    </form>
  );
}

function FieldRow({ field }: { field: EditorField }) {
  const baseInput =
    "block w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 shadow-sm focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100";
  const labelClass =
    "block text-xs font-semibold uppercase tracking-wide text-zinc-700 dark:text-zinc-300";
  switch (field.kind) {
    case "text":
      return (
        <div className="space-y-1">
          <label htmlFor={field.name} className={labelClass}>
            {field.label}
          </label>
          <input
            id={field.name}
            name={field.name}
            type="text"
            required={field.required}
            defaultValue={field.defaultValue ?? ""}
            className={baseInput}
          />
        </div>
      );
    case "textarea":
      return (
        <div className="space-y-1">
          <label htmlFor={field.name} className={labelClass}>
            {field.label}
          </label>
          <textarea
            id={field.name}
            name={field.name}
            rows={field.rows ?? 8}
            defaultValue={field.defaultValue ?? ""}
            className={`${baseInput} font-mono text-xs leading-relaxed`}
          />
        </div>
      );
    case "select":
      return (
        <div className="space-y-1">
          <label htmlFor={field.name} className={labelClass}>
            {field.label}
          </label>
          <select
            id={field.name}
            name={field.name}
            defaultValue={field.defaultValue ?? ""}
            className={baseInput}
          >
            {field.options.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>
      );
    case "checkbox":
      return (
        <div className="flex items-center gap-2">
          <input
            id={field.name}
            name={field.name}
            type="checkbox"
            defaultChecked={field.defaultChecked}
            className="h-4 w-4 rounded border-zinc-300"
          />
          <label htmlFor={field.name} className="text-sm text-zinc-800 dark:text-zinc-200">
            {field.label}
          </label>
        </div>
      );
    case "datetime":
      return (
        <div className="space-y-1">
          <label htmlFor={field.name} className={labelClass}>
            {field.label}
          </label>
          <input
            id={field.name}
            name={field.name}
            type="datetime-local"
            defaultValue={field.defaultValue ?? ""}
            className={baseInput}
          />
        </div>
      );
  }
}
