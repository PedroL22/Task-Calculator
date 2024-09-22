import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

type ConfigStore = {
  hoursToWork: number
  setHoursToWork: (hours: number) => void
}

export const useConfigStore = create<ConfigStore>()(
  persist(
    (set) => ({
      hoursToWork: 8,
      setHoursToWork: (hours) => set({ hoursToWork: hours }),
    }),
    {
      name: 'config',
      storage: createJSONStorage(() => sessionStorage),
    }
  )
)
