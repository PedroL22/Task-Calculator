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
  reorderTasks: (newOrder: TaskEntity[]) => void
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
          tasks: state.tasks.map((task) => {
            if (task.id !== id) return task
            if (key === 'time' || key === 'percentage') {
              if (value === undefined || value === null || value === '') return { ...task, [key]: undefined }
              const num = Number(value)
              return { ...task, [key]: Number.isNaN(num) ? undefined : num }
            }
            return { ...task, [key]: value }
          }),
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

      reorderTasks: (newOrder) => set({ tasks: newOrder }),
    }),
    {
      name: 'tasks',
      storage: createJSONStorage(() => localStorage),
    }
  )
)
