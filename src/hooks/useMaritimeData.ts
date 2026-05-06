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

  const crewById = useMemo<EntityMap<CrewMember>>(() => mapById(crew), [crew]);
  const shipById = useMemo<EntityMap<Ship>>(() => mapById(ships), [ships]);

  const loadData = useCallback(async () => {
    const [
      shipData,
      crewData,
      maintenancePageData,
      drillPageData,
      shipPageData,
      crewPageData,
      crewTaskData,
      crewDrillData
    ] = await Promise.all([
      api.ships(),
      api.crew(),
      api.paginatedMaintenance({
        page: maintenancePage,
        limit: maintenancePageSize,
        status: selectedStatus || undefined,
        shipId: maintenanceShipId || undefined,
        dueFrom: maintenanceDueFrom || undefined,
        dueTo: maintenanceDueTo || undefined
      }),
      api.paginatedDrills({
        page: drillPage,
        limit: drillPageSize,
        status: selectedDrillStatus || undefined,
        shipId: drillShipId || undefined,
        scheduledFrom: drillScheduledFrom || undefined,
        scheduledTo: drillScheduledTo || undefined
      }),
      api.paginatedShips(shipPage, shipPageSize),
      api.paginatedCrew({ page: crewPage, limit: crewPageSize, shipId: crewShipId || undefined }),
      selectedCrewId ? api.maintenance({ crewId: selectedCrewId }) : Promise.resolve([]),
      selectedCrewId ? api.drills({ crewId: selectedCrewId }) : Promise.resolve([])
    ]);

    setShips(shipData);
    setCrew(crewData);

    setTasks(maintenancePageData.items);
    setTaskTotal(maintenancePageData.total);

    setDrills(drillPageData.items);
    setDrillTotal(drillPageData.total);

    setShipRows(shipPageData.items);
    setShipTotal(shipPageData.total);

    setCrewRows(crewPageData.items);
    setCrewTotal(crewPageData.total);

    setCrewTasks(crewTaskData);
    setCrewDrills(crewDrillData);

    const defaultCrewId = crewData[0]?.id ?? "";

    if ((!selectedCrewId || !crewData.some((member) => member.id === selectedCrewId)) && defaultCrewId) {
      setSelectedCrewId(defaultCrewId);
    }

  }, [
    crewPage,
    crewPageSize,
    crewShipId,
    drillPage,
    drillPageSize,
    drillScheduledFrom,
    drillScheduledTo,
    drillShipId,
    maintenanceDueFrom,
    maintenanceDueTo,
    maintenancePage,
    maintenancePageSize,
    maintenanceShipId,
    selectedCrewId,
    selectedDrillStatus,
    selectedStatus,
    shipPage,
    shipPageSize
  ]);

  useEffect(() => {
    loadData().catch((error: Error) => setMessage(error.message));
  }, [loadData]);

  useEffect(() => {
    setActiveTab(role === "admin" ? "Dashboard" : crewTabs[0]);
  }, [role]);

  useEffect(() => {
    if (!message) return;
    const id = window.setTimeout(() => setMessage(""), 5000);
    return () => window.clearTimeout(id);
  }, [message]);

  const createTask = async () => {
    await api.createMaintenance(taskForm);
    setTaskForm(emptyTaskForm);
    setMessage("Maintenance task created.");
    await loadData();
  };

  const createShip = async () => {
    await api.createShip(shipForm);
    setShipForm(emptyShipForm);
    setMessage("Ship created.");
    await loadData();
  };

  const createCrewMember = async () => {
    await api.createCrewMember(crewForm);
    setCrewForm(emptyCrewForm);
    setMessage("Crew member created.");
    await loadData();
  };

  const createDrill = async () => {
    await api.createDrill(drillForm);
    setDrillForm(emptyDrillForm);
    setMessage("Safety drill scheduled.");
    await loadData();
  };

  const updateTaskStatus = async (id: string, status: TaskStatus, note?: string) => {
    const body: { status: TaskStatus; note?: string } = { status };
    if (note?.trim()) body.note = note.trim();
    await api.updateMaintenance(id, body);
    setMessage("Task updated.");
    await loadData();
  };

  const markAttendance = async (drillId: string) => {
    if (!selectedCrewId) return;
    await api.markAttendance(drillId, selectedCrewId);
    setMessage("Attendance marked.");
    await loadData();
  };

  const completeDrill = async (drillId: string) => {
    await api.completeDrill(drillId, "Drill completed by crew.");
    setMessage("Drill completed.");
    await loadData();
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
