import { Toggle } from './Toggle'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog'

import { useConfigStore } from '~/store/useConfigStore'

export const SettingsDialog = () => {
  const {
    hoursToWork,
    setHoursToWork,
    defaultPercentage,
    setDefaultPercentage,
    exportWithCurrentDate,
    setExportWithCurrentDate,
  } = useConfigStore()

  return (
    <Dialog>
      <DialogTrigger className='select-none text-5xl'>⚙️</DialogTrigger>

      <DialogContent className='border-0 pb-5 dark:bg-gray-700'>
        <DialogHeader>
          <DialogTitle>Task Calculator Settings</DialogTitle>
        </DialogHeader>

        <div className='space-y-3 divide-y divide-gray-300 dark:divide-gray-500'>
          <div className='flex items-center justify-between pt-3'>
            <label htmlFor='hours-to-work' className='cursor-pointer select-none'>
              Hours to work
            </label>

            <input
              id='hours-to-work'
              value={hoursToWork}
              max='12'
              maxLength={2}
              className='flex w-20 items-center rounded-xl bg-gray-200 px-2.5 py-1 text-4xl outline-none focus:border-gray-600 dark:bg-gray-600'
              onChange={(e) => {
                let value = e.target.value.slice(0, 2)
                value = Math.min(Number.parseInt(value) || 0, 24).toString()
                setHoursToWork(Number(value))
              }}
            />
          </div>

          <div className='flex items-center justify-between pt-3'>
            <label htmlFor='default-percentage' className='cursor-pointer select-none'>
              Default percentage
            </label>

            <input
              id='default-percentage'
              value={defaultPercentage}
              max='100'
              maxLength={3}
              className='flex w-20 items-center rounded-xl bg-gray-200 px-2.5 py-1 text-4xl outline-none focus:border-gray-600 dark:bg-gray-600'
              onChange={(e) => {
                let value = e.target.value.slice(0, 3)
                value = Math.min(Number.parseInt(value) || 0, 100).toString()
                setDefaultPercentage(Number(value))
              }}
            />
          </div>

          <div className='flex items-center justify-between pt-3'>
            <label htmlFor='default-percentage' className='cursor-pointer select-none'>
              Export with current date
            </label>

            <Toggle value={exportWithCurrentDate} onToggle={setExportWithCurrentDate} />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}