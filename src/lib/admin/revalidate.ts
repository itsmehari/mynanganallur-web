import { revalidatePath, revalidateTag } from "next/cache";

export type EntityKind =
  | "article"
  | "event"
  | "job"
  | "open_to_work"
  | "property"
  | "directory";

export const ENTITY_TAG: Record<EntityKind, string> = {
  article: "articles",
  event: "events",
  job: "jobs",
  open_to_work: "open_to_work",
  property: "properties",
  directory: "directory",
};

const ENTITY_PATHS: Record<EntityKind, string[]> = {
  article: ["/", "/local-news"],
  event: ["/", "/local-events"],
  job: ["/", "/jobs"],
  open_to_work: ["/", "/careers/open-to-work"],
  property: ["/", "/properties"],
  directory: ["/", "/directory"],
};

export function revalidateForEntity(kind: EntityKind, slug?: string): void {
  try {
    revalidateTag(ENTITY_TAG[kind], "max");
  } catch {
    /* tag may not be registered yet */
  }
  for (const path of ENTITY_PATHS[kind]) {
    try {
      revalidatePath(path);
    } catch {
      /* idem */
    }
  }
  if (slug) {
    const detailMap: Record<EntityKind, string> = {
      article: `/local-news/${slug}`,
      event: `/local-events/${slug}`,
      job: `/jobs/${slug}`,
      open_to_work: `/careers/open-to-work/${slug}`,
      property: `/properties/${slug}`,
      directory: `/directory`,
    };
    try {
      revalidatePath(detailMap[kind]);
    } catch {
      /* idem */
    }
  }
}
