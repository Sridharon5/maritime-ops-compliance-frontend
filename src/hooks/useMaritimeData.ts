import { useCallback, useEffect, useMemo, useState } from "react";
import { api } from "../api";
import { crewTabs, emptyCrewForm, emptyDrillForm, emptyShipForm, emptyTaskForm } from "../constants";
import type { CrewMember, DrillStatusFilter, MaintenanceTask, Role, SafetyDrill, Ship, TaskStatus } from "../types";
import type { AppTab, CrewForm, DrillForm, EntityMap, ShipForm, TaskForm } from "../ui-types";
import { mapById } from "../utils/collections";

export function useMaritimeData() {
  const [activeTab, setActiveTab] = useState<AppTab>("Dashboard");
  const [role, setRole] = useState<Role>("admin");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedDrillStatus, setSelectedDrillStatus] = useState<DrillStatusFilter>("");
  const [selectedCrewId, setSelectedCrewId] = useState("");

  const [maintenanceShipId, setMaintenanceShipId] = useState("");
  const [maintenanceDueFrom, setMaintenanceDueFrom] = useState("");
  const [maintenanceDueTo, setMaintenanceDueTo] = useState("");
  const [maintenancePage, setMaintenancePage] = useState(1);
  const [maintenancePageSize, setMaintenancePageSize] = useState(5);

  const [drillShipId, setDrillShipId] = useState("");
  const [drillScheduledFrom, setDrillScheduledFrom] = useState("");
  const [drillScheduledTo, setDrillScheduledTo] = useState("");
  const [drillPage, setDrillPage] = useState(1);
  const [drillPageSize, setDrillPageSize] = useState(6);

  const [shipPage, setShipPage] = useState(1);
  const [shipPageSize, setShipPageSize] = useState(5);

  const [crewShipId, setCrewShipId] = useState("");
  const [crewPage, setCrewPage] = useState(1);
  const [crewPageSize, setCrewPageSize] = useState(5);

  const [ships, setShips] = useState<Ship[]>([]);
  const [crew, setCrew] = useState<CrewMember[]>([]);
  const [tasks, setTasks] = useState<MaintenanceTask[]>([]);
  const [drills, setDrills] = useState<SafetyDrill[]>([]);
  const [shipRows, setShipRows] = useState<Ship[]>([]);
  const [shipTotal, setShipTotal] = useState(0);
  const [crewRows, setCrewRows] = useState<CrewMember[]>([]);
  const [crewTotal, setCrewTotal] = useState(0);
  const [taskTotal, setTaskTotal] = useState(0);
  const [drillTotal, setDrillTotal] = useState(0);
  const [crewTasks, setCrewTasks] = useState<MaintenanceTask[]>([]);
  const [crewDrills, setCrewDrills] = useState<SafetyDrill[]>([]);

  const [shipForm, setShipForm] = useState<ShipForm>(emptyShipForm);
  const [crewForm, setCrewForm] = useState<CrewForm>(emptyCrewForm);
  const [taskForm, setTaskForm] = useState<TaskForm>(emptyTaskForm);
  const [drillForm, setDrillForm] = useState<DrillForm>(emptyDrillForm);
  const [message, setMessage] = useState("");
  const [loadError, setLoadError] = useState("");
  const [pendingRequests, setPendingRequests] = useState(0);

  const crewById = useMemo<EntityMap<CrewMember>>(() => mapById(crew), [crew]);
  const shipById = useMemo<EntityMap<Ship>>(() => mapById(ships), [ships]);
  const isLoading = pendingRequests > 0;

  const runRequest = useCallback(async <T>(request: () => Promise<T>): Promise<T> => {
    setLoadError("");
    setPendingRequests((current) => current + 1);
    try {
      return await request();
    } catch (error) {
      const text = error instanceof Error ? error.message : "Request failed";
      setLoadError(text);
      throw error;
    } finally {
      setPendingRequests((current) => Math.max(0, current - 1));
    }
  }, []);

  const fetchBaseData = useCallback(async () => {
    const [shipData, crewData] = await runRequest(() => Promise.all([api.ships(), api.crew()]));
    setShips(shipData);
    setCrew(crewData);
    const defaultCrewId = crewData[0]?.id ?? "";
    if (defaultCrewId) {
      setSelectedCrewId((current) => (current && crewData.some((member) => member.id === current) ? current : defaultCrewId));
    }
  }, [runRequest]);

  const fetchMaintenancePage = useCallback(async () => {
    const data = await runRequest(() =>
      api.paginatedMaintenance({
        page: maintenancePage,
        limit: maintenancePageSize,
        status: selectedStatus || undefined,
        shipId: maintenanceShipId || undefined,
        dueFrom: maintenanceDueFrom || undefined,
        dueTo: maintenanceDueTo || undefined
      })
    );
    setTasks(data.items);
    setTaskTotal(data.total);
  }, [maintenanceDueFrom, maintenanceDueTo, maintenancePage, maintenancePageSize, maintenanceShipId, runRequest, selectedStatus]);

  const fetchDrillPage = useCallback(async () => {
    const data = await runRequest(() =>
      api.paginatedDrills({
        page: drillPage,
        limit: drillPageSize,
        status: selectedDrillStatus || undefined,
        shipId: drillShipId || undefined,
        scheduledFrom: drillScheduledFrom || undefined,
        scheduledTo: drillScheduledTo || undefined
      })
    );
    setDrills(data.items);
    setDrillTotal(data.total);
  }, [drillPage, drillPageSize, drillScheduledFrom, drillScheduledTo, drillShipId, runRequest, selectedDrillStatus]);

  const fetchShipPage = useCallback(async () => {
    const data = await runRequest(() => api.paginatedShips(shipPage, shipPageSize));
    setShipRows(data.items);
    setShipTotal(data.total);
  }, [runRequest, shipPage, shipPageSize]);

  const fetchCrewPage = useCallback(async () => {
    const data = await runRequest(() => api.paginatedCrew({ page: crewPage, limit: crewPageSize, shipId: crewShipId || undefined }));
    setCrewRows(data.items);
    setCrewTotal(data.total);
  }, [crewPage, crewPageSize, crewShipId, runRequest]);

  const fetchCrewWork = useCallback(async () => {
    if (!selectedCrewId) {
      setCrewTasks([]);
      setCrewDrills([]);
      return;
    }
    const [taskData, drillData] = await runRequest(() =>
      Promise.all([api.maintenance({ crewId: selectedCrewId }), api.drills({ crewId: selectedCrewId })])
    );
    setCrewTasks(taskData);
    setCrewDrills(drillData);
  }, [runRequest, selectedCrewId]);

  useEffect(() => {
    fetchBaseData().catch(() => {});
  }, [fetchBaseData]);

  useEffect(() => {
    setActiveTab(role === "admin" ? "Dashboard" : crewTabs[0]);
  }, [role]);

  useEffect(() => {
    if (role !== "admin" || activeTab !== "Maintenance") return;
    fetchMaintenancePage().catch(() => {});
  }, [activeTab, fetchMaintenancePage, role]);

  useEffect(() => {
    if (role !== "admin" || activeTab !== "Drills") return;
    fetchDrillPage().catch(() => {});
  }, [activeTab, fetchDrillPage, role]);

  useEffect(() => {
    if (role !== "admin" || activeTab !== "Ships") return;
    fetchShipPage().catch(() => {});
  }, [activeTab, fetchShipPage, role]);

  useEffect(() => {
    if (role !== "admin" || activeTab !== "Crew") return;
    fetchCrewPage().catch(() => {});
  }, [activeTab, fetchCrewPage, role]);

  useEffect(() => {
    if (role !== "crew" || activeTab !== "My Work") return;
    fetchCrewWork().catch(() => {});
  }, [activeTab, fetchCrewWork, role, selectedCrewId]);

  useEffect(() => {
    if (!message) return;
    const id = window.setTimeout(() => setMessage(""), 5000);
    return () => window.clearTimeout(id);
  }, [message]);

  const createTask = async () => {
    try {
      await runRequest(() => api.createMaintenance(taskForm));
      setTaskForm(emptyTaskForm);
      setMessage("Maintenance task created.");
      if (role === "admin" && activeTab === "Maintenance") await fetchMaintenancePage();
    } catch {}
  };

  const createShip = async () => {
    try {
      await runRequest(() => api.createShip(shipForm));
      setShipForm(emptyShipForm);
      setMessage("Ship created.");
      await fetchBaseData();
      if (role === "admin" && activeTab === "Ships") await fetchShipPage();
    } catch {}
  };

  const createCrewMember = async () => {
    try {
      await runRequest(() => api.createCrewMember(crewForm));
      setCrewForm(emptyCrewForm);
      setMessage("Crew member created.");
      await fetchBaseData();
      if (role === "admin" && activeTab === "Crew") await fetchCrewPage();
    } catch {}
  };

  const createDrill = async () => {
    try {
      await runRequest(() => api.createDrill(drillForm));
      setDrillForm(emptyDrillForm);
      setMessage("Safety drill scheduled.");
      if (role === "admin" && activeTab === "Drills") await fetchDrillPage();
    } catch {}
  };

  const updateTaskStatus = async (id: string, status: TaskStatus, note?: string) => {
    try {
      const body: { status: TaskStatus; note?: string } = { status };
      if (note?.trim()) body.note = note.trim();
      await runRequest(() => api.updateMaintenance(id, body));
      setMessage("Task updated.");
      if (role === "admin" && activeTab === "Maintenance") await fetchMaintenancePage();
      if (role === "crew" && activeTab === "My Work") await fetchCrewWork();
    } catch {}
  };

  const markAttendance = async (drillId: string) => {
    try {
      if (!selectedCrewId) return;
      await runRequest(() => api.markAttendance(drillId, selectedCrewId));
      setMessage("Attendance marked.");
      if (role === "crew" && activeTab === "My Work") await fetchCrewWork();
    } catch {}
  };

  const completeDrill = async (drillId: string) => {
    try {
      await runRequest(() => api.completeDrill(drillId, "Drill completed by crew."));
      setMessage("Drill completed.");
      if (role === "crew" && activeTab === "My Work") await fetchCrewWork();
    } catch {}
  };

  return {
    activeTab,
    crew,
    crewById,
    crewDrills,
    crewRows,
    crewPage,
    crewPageSize,
    crewTasks,
    crewTotal,
    crewForm,
    drillForm,
    drills,
    drillPage,
    drillPageSize,
    drillScheduledFrom,
    drillScheduledTo,
    drillShipId,
    drillTotal,
    maintenanceDueFrom,
    maintenanceDueTo,
    maintenancePage,
    maintenancePageSize,
    maintenanceShipId,
    loadError,
    isLoading,
    message,
    role,
    selectedCrewId,
    selectedDrillStatus,
    selectedStatus,
    shipForm,
    shipById,
    shipPage,
    shipPageSize,
    shipRows,
    ships,
    shipTotal,
    taskForm,
    tasks,
    taskTotal,
    crewShipId,
    actions: {
      completeDrill,
      createCrewMember,
      createDrill,
      createShip,
      createTask,
      markAttendance,
      setActiveTab,
      setCrewForm,
      setDrillForm,
      setRole,
      setSelectedCrewId,
      setSelectedDrillStatus,
      setSelectedStatus,
      setShipForm,
      setTaskForm,
      updateTaskStatus,
      setMaintenanceShipId,
      setMaintenanceDueFrom,
      setMaintenanceDueTo,
      setMaintenancePage,
      setMaintenancePageSize,
      setDrillShipId,
      setDrillScheduledFrom,
      setDrillScheduledTo,
      setDrillPage,
      setDrillPageSize,
      setShipPage,
      setShipPageSize,
      setCrewShipId,
      setCrewPage,
      setCrewPageSize
    }
  };
}
