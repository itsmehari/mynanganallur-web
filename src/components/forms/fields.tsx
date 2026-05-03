/**
 * Shared form primitives for /submit/* and /admin/* routes.
 *
 * Pure, dependency-free, semantic HTML. Tailwind only. No client state.
 * Designed for use inside `<form action={serverAction}>` so values come from
 * FormData and validation happens server-side.
 */
import type { ReactNode, SelectHTMLAttributes } from "react";

const baseInput =
  "block w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm text-[var(--foreground)] shadow-sm placeholder:text-[var(--muted)] focus:border-[var(--accent)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/30 disabled:cursor-not-allowed disabled:opacity-60";

type FieldShellProps = {
  id: string;
  label: string;
  hint?: string;
  required?: boolean;
  error?: string;
  children: ReactNode;
};

export function FieldShell({
  id,
  label,
  hint,
  required,
  error,
  children,
}: FieldShellProps) {
  return (
    <div className="space-y-1.5">
      <label
        htmlFor={id}
        className="block text-sm font-medium text-[var(--foreground)]"
      >
        {label}
        {required ? (
          <span aria-hidden="true" className="ml-1 text-rose-600">
            *
          </span>
        ) : null}
      </label>
      {children}
      {hint ? (
        <p
          id={`${id}-hint`}
          className="text-xs text-[var(--muted)]"
        >
          {hint}
        </p>
      ) : null}
      {error ? (
        <p
          id={`${id}-error`}
          role="alert"
          className="text-xs font-medium text-rose-600"
        >
          {error}
        </p>
      ) : null}
    </div>
  );
}

type TextFieldProps = {
  id: string;
  name?: string;
  label: string;
  hint?: string;
  required?: boolean;
  error?: string;
  defaultValue?: string;
  placeholder?: string;
  type?: "text" | "email" | "url" | "tel" | "datetime-local" | "date" | "number";
  autoComplete?: string;
  inputMode?: "text" | "email" | "tel" | "numeric" | "url";
  maxLength?: number;
  pattern?: string;
};

export function TextField({
  id,
  name,
  label,
  hint,
  required,
  error,
  defaultValue,
  placeholder,
  type = "text",
  autoComplete,
  inputMode,
  maxLength,
  pattern,
}: TextFieldProps) {
  return (
    <FieldShell
      id={id}
      label={label}
      hint={hint}
      required={required}
      error={error}
    >
      <input
        id={id}
        name={name ?? id}
        type={type}
        defaultValue={defaultValue}
        placeholder={placeholder}
        required={required}
        autoComplete={autoComplete}
        inputMode={inputMode}
        maxLength={maxLength}
        pattern={pattern}
        aria-describedby={[
          hint ? `${id}-hint` : null,
          error ? `${id}-error` : null,
        ]
          .filter(Boolean)
          .join(" ") || undefined}
        aria-invalid={error ? true : undefined}
        className={baseInput}
      />
    </FieldShell>
  );
}

type TextAreaProps = {
  id: string;
  name?: string;
  label: string;
  hint?: string;
  required?: boolean;
  error?: string;
  defaultValue?: string;
  placeholder?: string;
  rows?: number;
  maxLength?: number;
};

export function TextArea({
  id,
  name,
  label,
  hint,
  required,
  error,
  defaultValue,
  placeholder,
  rows = 6,
  maxLength,
}: TextAreaProps) {
  return (
    <FieldShell
      id={id}
      label={label}
      hint={hint}
      required={required}
      error={error}
    >
      <textarea
        id={id}
        name={name ?? id}
        defaultValue={defaultValue}
        placeholder={placeholder}
        required={required}
        rows={rows}
        maxLength={maxLength}
        aria-describedby={[
          hint ? `${id}-hint` : null,
          error ? `${id}-error` : null,
        ]
          .filter(Boolean)
          .join(" ") || undefined}
        aria-invalid={error ? true : undefined}
        className={`${baseInput} resize-y leading-relaxed`}
      />
    </FieldShell>
  );
}

type SelectFieldOption = { value: string; label: string };

type SelectFieldProps = {
  id: string;
  name?: string;
  label: string;
  hint?: string;
  required?: boolean;
  error?: string;
  defaultValue?: string;
  options: SelectFieldOption[];
  emptyLabel?: string;
} & Pick<SelectHTMLAttributes<HTMLSelectElement>, "multiple">;

export function SelectField({
  id,
  name,
  label,
  hint,
  required,
  error,
  defaultValue,
  options,
  emptyLabel,
  multiple,
}: SelectFieldProps) {
  return (
    <FieldShell
      id={id}
      label={label}
      hint={hint}
      required={required}
      error={error}
    >
      <select
        id={id}
        name={name ?? id}
        defaultValue={defaultValue ?? ""}
        required={required}
        multiple={multiple}
        aria-describedby={[
          hint ? `${id}-hint` : null,
          error ? `${id}-error` : null,
        ]
          .filter(Boolean)
          .join(" ") || undefined}
        aria-invalid={error ? true : undefined}
        className={baseInput}
      >
        {emptyLabel && !multiple ? (
          <option value="" disabled>
            {emptyLabel}
          </option>
        ) : null}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </FieldShell>
  );
}

type CheckboxFieldProps = {
  id: string;
  name?: string;
  label: string;
  hint?: string;
  defaultChecked?: boolean;
};

export function CheckboxField({
  id,
  name,
  label,
  hint,
  defaultChecked,
}: CheckboxFieldProps) {
  return (
    <div className="flex items-start gap-3">
      <input
        id={id}
        name={name ?? id}
        type="checkbox"
        defaultChecked={defaultChecked}
        className="mt-0.5 h-4 w-4 rounded border-[var(--border)] text-[var(--accent)] focus:ring-[var(--accent)]"
      />
      <label htmlFor={id} className="text-sm text-[var(--foreground)]">
        {label}
        {hint ? (
          <span className="ml-1 block text-xs text-[var(--muted)]">{hint}</span>
        ) : null}
      </label>
    </div>
  );
}

type PhoneFieldProps = {
  id: string;
  name?: string;
  label: string;
  hint?: string;
  required?: boolean;
  error?: string;
  defaultValue?: string;
  placeholder?: string;
};

/** Indian mobile field — accepts 10-digit numbers, optional leading +91/0. */
export function PhoneField(props: PhoneFieldProps) {
  return (
    <TextField
      {...props}
      type="tel"
      autoComplete="tel"
      inputMode="tel"
      pattern="[0-9+\\- ]{10,15}"
      placeholder={props.placeholder ?? "+91 98XXX XXXXX"}
      maxLength={20}
    />
  );
}

type HoneypotFieldProps = {
  /** Field name pretending to be relevant — bots fill all fields. */
  name?: string;
};

/**
 * Hidden anti-spam field. Bots fill it; humans never see it. Server checks for
 * any value and rejects if non-empty. Visually hidden but kept in the tab order
 * with `tabIndex={-1}` so screen readers don't announce it.
 */
export function HoneypotField({ name = "company_url" }: HoneypotFieldProps) {
  return (
    <div
      aria-hidden="true"
      style={{
        position: "absolute",
        left: "-9999px",
        top: "auto",
        width: 1,
        height: 1,
        overflow: "hidden",
      }}
    >
      <label>
        Leave this empty
        <input
          type="text"
          name={name}
          tabIndex={-1}
          autoComplete="off"
          defaultValue=""
        />
      </label>
    </div>
  );
}

type FormStatusProps = {
  status?: "idle" | "ok" | "error";
  message?: string;
};

export function FormStatus({ status, message }: FormStatusProps) {
  if (!status || status === "idle" || !message) return null;
  const isOk = status === "ok";
  return (
    <div
      role={isOk ? "status" : "alert"}
      aria-live="polite"
      className={`rounded-lg border px-4 py-3 text-sm ${
        isOk
          ? "border-emerald-300 bg-emerald-50 text-emerald-900"
          : "border-rose-300 bg-rose-50 text-rose-900"
      }`}
    >
      {message}
    </div>
  );
}

type SubmitButtonProps = {
  label: string;
  pendingLabel?: string;
};

export function SubmitButton({ label }: SubmitButtonProps) {
  return (
    <button
      type="submit"
      className="inline-flex items-center justify-center rounded-full bg-[var(--accent)] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/40"
    >
      {label}
    </button>
  );
}
