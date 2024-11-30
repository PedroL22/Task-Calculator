import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

import { generateRandomID } from '~/utils/generateRandomID'
import { useConfigStore } from './useConfigStore'

import type { TaskEntity } from '~/entities/TaskEntity'

interface TaskStore {
  tasks: TaskEntity[]
  addTask: () => void
  removeTask: (id: string) => void
  updateTask: (id: string, key: keyof TaskEntity, value: any) => void
  resetTasks: () => void
}

const createDefaultTask = (): TaskEntity => {
  const defaultPercentage = useConfigStore.getState().defaultPercentage

  return {
    id: generateRandomID(),
    description: undefined,
    code: '',
    percentage: defaultPercentage,
    time: undefined,
  }
}

export const useTaskStore = create<TaskStore>()(
  persist(
    (set) => ({
      tasks: [createDefaultTask()],

      addTask: () =>
        set((state) => {
          const defaultPercentage = useConfigStore.getState().defaultPercentage

          return {
            tasks: [
              ...state.tasks,
              {
                id: generateRandomID(),
                description: undefined,
                code: '',
                percentage: defaultPercentage,
                time: undefined,
              },
            ],
          }
        }),

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
        set(() => {
          const defaultPercentage = useConfigStore.getState().defaultPercentage

          return {
            tasks: [
              {
                id: generateRandomID(),
                description: undefined,
                code: '',
                percentage: defaultPercentage,
                time: undefined,
              },
            ],
          }
        }),
    }),
    {
      name: 'tasks',
      storage: createJSONStorage(() => localStorage),
    }
  )
)
