import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

import { generateRandomID } from '~/utils/generateRandomID'

import type { TaskEntity } from '~/entities/TaskEntity'

interface TaskStore {
  tasks: TaskEntity[]
  addTask: () => void
  removeTask: (id: string) => void
  updateTask: (id: string, key: keyof TaskEntity, value: any) => void
  resetTasks: () => void
}

const createDefaultTask = (): TaskEntity => ({
  id: generateRandomID(),
  code: '',
  percentage: 100,
  time: undefined,
})

export const useTaskStore = create<TaskStore>()(
  persist(
    (set) => ({
      tasks: [createDefaultTask()],

      addTask: () =>
        set((state) => ({
          tasks: [...state.tasks, createDefaultTask()],
        })),

      removeTask: (id: string) =>
        set((state) => ({
          tasks: state.tasks.filter((task) => task.id !== id),
        })),

      updateTask: (id: string, key: keyof TaskEntity, value: any) =>
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === id
              ? {
                  ...task,
                  [key]: key === 'time' || key === 'percentage' ? Number(value) : value,
                }
              : task
          ),
        })),

      resetTasks: () =>
        set(() => ({
          tasks: [createDefaultTask()],
        })),
    }),
    {
      name: 'tasks',
      storage: createJSONStorage(() => sessionStorage),
    }
  )
)
