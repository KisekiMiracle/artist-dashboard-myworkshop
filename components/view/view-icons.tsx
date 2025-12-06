"use client";

import TablerCalendarWeek from "~iconify/tabler/calendar-week";
import TablerLayoutKanban from "~iconify/tabler/layout-kanban";
import TablerList from "~iconify/tabler/list";
import TablerTable from "~iconify/tabler/table";

export function KanbanIcon() {
  return <TablerLayoutKanban width={21} height={21} />;
}

export function ListIcon() {
  return <TablerList width={21} height={21} />;
}

export function TableIcon() {
  return <TablerTable width={21} height={21} />;
}

export function CalendarIcon() {
  return <TablerCalendarWeek width={21} height={21} />;
}
