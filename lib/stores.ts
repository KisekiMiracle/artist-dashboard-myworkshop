import { create } from "zustand";

export interface Task {
  id: string;
  title: string;
  description?: string;
  status?: "todo" | "in-progress" | "done";
  priority?: "low" | "medium" | "high";
  category?: "category_1" | "category_2";
  creationDate?: Date;
  dueDate?: Date;
  updateDate?: Date;
}

export interface TaskStore {
  tasks: Array<Task>;
  addTask: (task: Task) => void;
  removeTask: (task: Task) => void;
  updateTasks: (newTask: Array<Task>) => void;
  updateTaskCategory: (
    activeID: number | string,
    overID: number | string
  ) => void;
}

const updateIndividualTask = (
  tasks: Array<Task>,
  activeID: number | string,
  overID: number | string
) => {
  const over = tasks.find((entry) => entry.id === overID);
  const active = tasks.find((entry) => entry.id === activeID);
  if (active && over) active.category = over.category;

  return tasks;
};

export const useTaskStore = create<TaskStore>((set) => ({
  tasks: [],
  addTask: (task) =>
    set((state) => ({
      tasks: [...state.tasks, task],
    })),
  removeTask: (task) =>
    set((state) => ({
      tasks: state.tasks.filter((t) => t !== task),
    })),
  updateTasks: (newTasks) => set({ tasks: newTasks }),
  updateTaskCategory: (activeID, overID) =>
    set((state) => ({
      tasks: updateIndividualTask(state.tasks, activeID, overID),
    })),
}));
