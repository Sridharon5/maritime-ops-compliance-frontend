/** Tailwind width classes for `table-fixed` maintenance grid */
export const maintenanceTableColumns = {
  sNo: "w-[6%]",
  task: "w-[22%]",
  ship: "w-[14%]",
  crew: "w-[14%]",
  due: "w-[10%]",
  status: "w-[10%]",
  notes: "w-[16%]",
  actions: "w-[8%]"
} as const;

export const shipRegistryColumns = {
  sNo: "w-[15%]",
  name: "w-[50%] min-w-[160px]",
  imo: "w-[35%]"
} as const;

export const crewRegistryColumns = {
  sNo: "w-[12%]",
  name: "w-[30%] min-w-[120px]",
  role: "w-[26%]",
  ship: "w-[32%]"
} as const;
