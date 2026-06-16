export type DirectoryMetadata = {
  description?: string;
  note?: string;
  sources?: string[];
};

export function parseDirectoryMetadata(raw: string | null | undefined): DirectoryMetadata {
  if (!raw?.trim()) return {};
  try {
    const parsed = JSON.parse(raw) as DirectoryMetadata;
    return typeof parsed === "object" && parsed !== null ? parsed : {};
  } catch {
    return { description: raw.trim() };
  }
}

export function serializeDirectoryMetadata(data: DirectoryMetadata): string | null {
  const description = data.description?.trim() || undefined;
  const note = data.note?.trim() || undefined;
  const sources = data.sources?.length ? data.sources : undefined;
  if (!description && !note && !sources) return null;
  return JSON.stringify({
    ...(description ? { description } : {}),
    ...(note ? { note } : {}),
    ...(sources ? { sources } : {}),
  });
}

export function mergeDirectoryMetadata(
  existing: string | null | undefined,
  patch: Partial<DirectoryMetadata>,
): string | null {
  const current = parseDirectoryMetadata(existing);
  return serializeDirectoryMetadata({ ...current, ...patch });
}
