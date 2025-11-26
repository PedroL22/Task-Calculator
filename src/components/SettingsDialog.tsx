import { Toggle } from './Toggle'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog'

import { useEffect, useState } from 'react'
import { useConfigStore } from '~/store/useConfigStore'

import { cn } from '~/lib/utils'

type SettingsDialogProps = {
  variant?: 'default' | 'small'
}

export const SettingsDialog = ({ variant = 'default' }: SettingsDialogProps) => {
  const {
    hoursToWork,
    setHoursToWork,
    defaultPercentage,
    setDefaultPercentage,
    exportWithCurrentDate,
    setExportWithCurrentDate,
    exportWithTotalHours,
    setExportWithTotalHours,
  } = useConfigStore()

  const [hoursToWorkInput, setHoursToWorkInput] = useState(hoursToWork.toString())

  useEffect(() => {
    setHoursToWorkInput(hoursToWork.toString())
  }, [hoursToWork])

  return (
    <Dialog>
      <DialogTrigger
        title='Settings'
        className={cn('cursor-pointer select-none text-5xl', variant === 'small' && 'text-3xl')}
      >
        ⚙️
      </DialogTrigger>

      <DialogContent aria-describedby='task calculator settings' className='border-0 bg-white pb-5 dark:bg-gray-700'>
        <DialogHeader>
          <DialogTitle>Task Calculator Settings</DialogTitle>

          <DialogDescription className='text-gray-500 dark:text-gray-400'>
            All changes are saved automatically.
          </DialogDescription>
        </DialogHeader>

        <div className='space-y-3 divide-y divide-gray-300 dark:divide-gray-500'>
          <div className='flex items-center justify-between pb-3'>
            <label htmlFor='hours-to-work' className='w-full cursor-pointer select-none'>
              Hours to work
            </label>

            <input
              id='hours-to-work'
              type='text'
              placeholder='8'
              max='12'
              inputMode='decimal'
              value={hoursToWorkInput}
              className='flex w-20 items-center rounded-xl bg-gray-200 px-2.5 py-1 text-center text-3xl outline-none focus:border-gray-600 dark:bg-gray-600'
              onChange={(e) => {
                const val = e.target.value
                if (/^\d*(?:[.,]?\d*)?$/.test(val)) {
                  if (val === '') {
                    setHoursToWorkInput('0')
                    setHoursToWork(0)
                    return
                  }
                  setHoursToWorkInput(val)
                  if (/^[.,]$/.test(val) || /[.,]$/.test(val)) return
                  const normalized = val.replace(',', '.')
                  const num = Number.parseFloat(normalized)
                  if (!Number.isNaN(num)) {
                    const clamped = Math.min(Math.max(num, 0), 12)
                    setHoursToWork(clamped)
                  }
                }
              }}
              onBlur={() => {
                let val = hoursToWorkInput
                if (/^[.,]$/.test(val)) {
                  setHoursToWorkInput(hoursToWork.toString())
                  return
                }
                if (/[.,]$/.test(val)) val = val.slice(0, -1)
                const normalized = val.replace(',', '.')
                const num = Number.parseFloat(normalized)
                if (!Number.isNaN(num)) {
                  const clamped = Math.min(Math.max(num, 0), 12)
                  setHoursToWork(clamped)
                  setHoursToWorkInput(clamped.toString())
                } else {
                  setHoursToWorkInput(hoursToWork.toString())
                }
              }}
            />
          </div>

          <div className='flex items-center justify-between pb-3'>
            <label htmlFor='default-percentage' className='w-full cursor-pointer select-none'>
              Default percentage
            </label>

            <input
              id='default-percentage'
              value={defaultPercentage}
              max='100'
              maxLength={3}
              className='flex w-20 items-center rounded-xl bg-gray-200 px-2.5 py-1 text-center text-3xl outline-none focus:border-gray-600 dark:bg-gray-600'
              onChange={(e) => {
                let value = e.target.value.slice(0, 3)
                value = Math.min(Number.parseInt(value) || 0, 100).toString()
                setDefaultPercentage(Number(value))
              }}
            />
          </div>

          <div className='flex items-center justify-between pb-3'>
            <label htmlFor='export-with-date' className='w-full cursor-pointer select-none'>
              Export with current date
            </label>

            <Toggle id='export-with-date' value={exportWithCurrentDate} onToggle={setExportWithCurrentDate} />
          </div>

          <div className='flex items-center justify-between pb-3'>
            <label htmlFor='export-with-total-hours' className='w-full cursor-pointer select-none'>
              Export with total hours
            </label>

            <Toggle id='export-with-total-hours' value={exportWithTotalHours} onToggle={setExportWithTotalHours} />
          </div>
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <button
              type='button'
              className='mt-5 cursor-pointer self-end rounded-lg bg-gray-200 px-4 py-2 font-medium text-gray-700 text-xl transition-all ease-in hover:bg-gray-300 active:opacity-70 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500'
            >
              Close
            </button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
