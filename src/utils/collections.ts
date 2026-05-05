import type { CrewMember } from "../types";
import type { EntityMap } from "../ui-types";

export function mapById<T extends { id: string }>(items: T[]): EntityMap<T> {
  return items.reduce<EntityMap<T>>((result, item) => {
    result[item.id] = item;
    return result;
  }, {});
}

export function formatCrewNames(ids: string[], crewById: EntityMap<CrewMember>) {
  return ids.map((id) => crewById[id]?.name ?? "Unknown crew").join(", ");
}
