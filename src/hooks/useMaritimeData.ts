import { useCallback, useEffect, useMemo, useState } from "react";
import { api } from "../api";
import { crewTabs, emptyCrewForm, emptyDrillForm, emptyShipForm, emptyTaskForm } from "../constants";
import type { CrewMember, MaintenanceTask, Role, SafetyDrill, Ship, TaskStatus } from "../types";
import type { AppTab, CrewForm, DrillForm, EntityMap, ShipForm, TaskForm } from "../ui-types";
import { mapById } from "../utils/collections";

export function useMaritimeData() {
  const [activeTab, setActiveTab] = useState<AppTab>("Dashboard");
  const [role, setRole] = useState<Role>("admin");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedCrewId, setSelectedCrewId] = useState("");
  const [ships, setShips] = useState<Ship[]>([]);
  const [crew, setCrew] = useState<CrewMember[]>([]);
  const [tasks, setTasks] = useState<MaintenanceTask[]>([]);
  const [drills, setDrills] = useState<SafetyDrill[]>([]);
  const [shipForm, setShipForm] = useState<ShipForm>(emptyShipForm);
  const [crewForm, setCrewForm] = useState<CrewForm>(emptyCrewForm);
  const [taskForm, setTaskForm] = useState<TaskForm>(emptyTaskForm);
  const [drillForm, setDrillForm] = useState<DrillForm>(emptyDrillForm);
  const [message, setMessage] = useState("");

  const crewById = useMemo<EntityMap<CrewMember>>(() => mapById(crew), [crew]);
  const shipById = useMemo<EntityMap<Ship>>(() => mapById(ships), [ships]);

  const loadData = useCallback(async () => {
    const query = new URLSearchParams();
    if (selectedStatus) query.set("status", selectedStatus);

    const querySuffix = query.toString() ? `?${query.toString()}` : "";

    const [shipData, crewData, taskData, drillData] = await Promise.all([
      api.ships(),
      api.crew(),
      api.maintenance(querySuffix),
      api.drills()
    ]);

    setShips(shipData);
    setCrew(crewData);
    setTasks(taskData);
    setDrills(drillData);

    const defaultShipId = shipData[0]?.id ?? "";
    const defaultCrewId = crewData[0]?.id ?? "";

    setTaskForm((current) =>
      current.shipId ? current : { ...current, shipId: defaultShipId, assignedCrewId: defaultCrewId }
    );
    setDrillForm((current) =>
      current.shipId
        ? current
        : { ...current, shipId: defaultShipId, assignedCrewIds: crewData.slice(0, 2).map((member) => member.id) }
    );

    if ((!selectedCrewId || !crewData.some((member) => member.id === selectedCrewId)) && defaultCrewId) {
      setSelectedCrewId(defaultCrewId);
    }

    setCrewForm((current) => (current.shipId ? current : { ...current, shipId: defaultShipId }));
  }, [selectedCrewId, selectedStatus]);

  useEffect(() => {
    loadData().catch((error: Error) => setMessage(error.message));
  }, [loadData]);

  useEffect(() => {
    setActiveTab(role === "admin" ? "Dashboard" : crewTabs[0]);
  }, [role]);

  const createTask = async () => {
    await api.createMaintenance(taskForm);
    setTaskForm({ ...emptyTaskForm, shipId: ships[0]?.id ?? "", assignedCrewId: crew[0]?.id ?? "" });
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
    setCrewForm({ ...emptyCrewForm, shipId: ships[0]?.id ?? "" });
    setMessage("Crew member created.");
    await loadData();
  };

  const createDrill = async () => {
    await api.createDrill(drillForm);
    setDrillForm({
      ...emptyDrillForm,
      shipId: ships[0]?.id ?? "",
      assignedCrewIds: crew.slice(0, 2).map((member) => member.id)
    });
    setMessage("Safety drill scheduled.");
    await loadData();
  };

  const updateTaskStatus = async (id: string, status: TaskStatus) => {
    await api.updateMaintenance(id, { status, note: `Status changed to ${status}` });
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
    crewDrills: drills.filter((drill) => drill.assignedCrewIds.includes(selectedCrewId)),
    crewTasks: tasks.filter((task) => task.assignedCrewId === selectedCrewId),
    drillForm,
    drills,
    message,
    role,
    selectedCrewId,
    selectedStatus,
    shipForm,
    shipById,
    ships,
    crewForm,
    taskForm,
    tasks,
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
      setSelectedStatus,
      setShipForm,
      setTaskForm,
      updateTaskStatus
    }
  };
}
