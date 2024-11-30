import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

type ConfigStore = {
  hoursToWork: number
  setHoursToWork: (hours: number) => void
  defaultPercentage: number
  setDefaultPercentage: (percentage: number) => void
  exportWithCurrentDate: boolean
  setExportWithCurrentDate: (value: boolean) => void
}

export const useConfigStore = create<ConfigStore>()(
  persist(
    (set) => ({
      hoursToWork: 8,
      setHoursToWork: (hours) => set({ hoursToWork: hours }),
      defaultPercentage: 100,
      setDefaultPercentage: (percentage) => set({ defaultPercentage: percentage }),
      exportWithCurrentDate: false,
      setExportWithCurrentDate: (value) => set({ exportWithCurrentDate: value }),
    }),
    {
      name: 'config',
      storage: createJSONStorage(() => localStorage),
    }
  )
)
