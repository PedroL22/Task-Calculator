import { useEffect, useState } from 'react'

import { CaretDownIcon, CaretUpIcon, ClipboardTextIcon } from '@phosphor-icons/react'
import { LayoutGroup, motion } from 'motion/react'
import { toast } from 'sonner'
import { AddTaskButton } from '~/components/AddTaskButton'
import { ExportButton } from '~/components/ExportButton'
import { ResetButton } from '~/components/ResetButton'
import { TaskRow } from '~/components/TaskRow'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '~/components/ui/dialog'
import { SettingsDialog } from './components/SettingsDialog'

import { useConfigStore } from '~/store/useConfigStore'
import { useTaskStore } from '~/store/useTaskStore'

export const App = () => {
  const { hoursToWork, setHoursToWork, exportWithCurrentDate, exportWithTotalHours } = useConfigStore()
  const { tasks, addTask, removeTask, updateTask, resetTasks, reorderTasks } = useTaskStore()
  const [remainingTime, setRemainingTime] = useState(hoursToWork)
  const [hoursToWorkInput, setHoursToWorkInput] = useState(hoursToWork.toString())

  useEffect(() => {
    setHoursToWorkInput(hoursToWork.toString())
  }, [hoursToWork])

  const dataLines = tasks.map(({ code, percentage, time }) => `${code}, ${percentage}%, ${time}`)
  const totalHours = tasks.reduce((sum, t) => sum + (t.time || 0), 0)

  const buildExportText = () => {
    const lines: string[] = []

    if (exportWithCurrentDate) {
      lines.push(`Report for ${new Date().toLocaleDateString()}`)
      lines.push('')
    }

    lines.push(...dataLines)

    if (exportWithTotalHours) {
      lines.push('')
      lines.push(`Total hours: ${totalHours}`)
    }

    return lines.join('\n')
  }

  const handleCopyToClipboard = () => {
    const text = buildExportText()

    navigator.clipboard.writeText(text)

    toast.success('Tasks copied to clipboard!')
  }

  useEffect(() => {
    setRemainingTime(hoursToWork - totalHours)
  }, [hoursToWork, totalHours])

  const moveTask = (index: number, direction: -1 | 1) => {
    const target = index + direction

    if (target < 0 || target >= tasks.length) return

    const newTasks = [...tasks]
    const [moved] = newTasks.splice(index, 1)
    newTasks.splice(target, 0, moved)
    reorderTasks(newTasks)
  }

  return (
    <main className='mx-auto min-h-screen max-w-(--breakpoint-lg) p-6'>
      <LayoutGroup>
        <div className='space-y-4'>
          <h1 className='font-medium text-5xl'>⏳Remaining time: {remainingTime}</h1>

          <h2 className='flex items-center space-x-2 font-medium text-4xl'>
            <span>🕐Hours to work:</span>

            <input
              type='text'
              max='12'
              inputMode='decimal'
              value={hoursToWorkInput}
              placeholder='8'
              className='flex w-20 items-center rounded-xl px-2.5 py-1 text-center text-4xl outline-none focus:border-gray-700 dark:bg-gray-700'
              onChange={(e) => {
                const val = e.target.value
                if (/^\d*(?:[.,]\d*)?$/.test(val)) {
                  if (val === '') {
                    setHoursToWorkInput('0')
                    setHoursToWork(0)
                    return
                  }
                  setHoursToWorkInput(val)
                  const normalized = val.replace(',', '.')
                  const num = Number.parseFloat(normalized)
                  if (!Number.isNaN(num)) {
                    const clamped = Math.min(Math.max(num, 0), 12)
                    setHoursToWork(clamped)
                  }
                }
              }}
              onBlur={() => {
                let normalized = hoursToWorkInput.replace(',', '.')
                if (/^[.,]$/.test(normalized)) normalized = '0'
                if (/\.$/.test(normalized)) normalized = normalized.slice(0, -1)
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
          </h2>
        </div>

        <motion.div className='mt-10 flex flex-col' layout>
          <div className='mb-6 flex flex-col space-y-4'>
            {tasks.map((task, index) => (
              <motion.div key={task.id} layout className='relative flex items-center space-x-2'>
                <div className='-left-12 absolute flex flex-col'>
                  <button
                    type='button'
                    title='Move up'
                    className='cursor-pointer transition-all ease-in hover:opacity-80 disabled:cursor-not-allowed'
                    disabled={index === 0}
                    onClick={() => moveTask(index, -1)}
                  >
                    <CaretUpIcon size={28} weight='bold' />
                  </button>

                  <button
                    type='button'
                    title='Move down'
                    className='cursor-pointer transition-all ease-in hover:opacity-80 disabled:cursor-not-allowed'
                    disabled={index === tasks.length - 1}
                    onClick={() => moveTask(index, 1)}
                  >
                    <CaretDownIcon size={28} weight='bold' />
                  </button>
                </div>

                <TaskRow
                  id={task.id}
                  description={task.description}
                  code={task.code}
                  percentage={task.percentage}
                  time={task.time}
                  canDelete={tasks.length > 1}
                  hoursToWork={hoursToWork}
                  onChange={updateTask}
                  onClose={() => removeTask(task.id)}
                />
              </motion.div>
            ))}
          </div>

          <motion.div className='flex items-center space-x-4' layout>
            <AddTaskButton onClick={addTask} />

            <Dialog>
              <DialogTrigger asChild>
                <ExportButton disabled={tasks.some((task) => task.code === '' || !task.percentage || !task.time)} />
              </DialogTrigger>

              <DialogContent className='border-none bg-white dark:bg-gray-700'>
                <DialogHeader>
                  <DialogTitle>Export tasks</DialogTitle>

                  <DialogDescription className='dark:text-gray-400'>
                    Your tasks are automatically saved and will be available in future sessions.
                  </DialogDescription>
                </DialogHeader>

                <div className='relative flex flex-col rounded-lg bg-gray-200 p-3 text-xl dark:bg-gray-500 dark:text-gray-200'>
                  <button
                    type='button'
                    title='Copy to clipboard'
                    className='absolute top-2 right-2 cursor-pointer select-none rounded-full p-1 transition-all ease-in dark:active:bg-gray-700 dark:hover:bg-gray-600'
                    onClick={handleCopyToClipboard}
                  >
                    <ClipboardTextIcon size={28} />
                  </button>

                  <pre className='whitespace-pre-wrap font-mono'>{buildExportText()}</pre>
                </div>

                <DialogFooter>
                  <div className='flex w-full items-center justify-between'>
                    <SettingsDialog variant='small' />

                    <button
                      type='button'
                      className='cursor-pointer rounded-lg bg-gray-200 px-4 py-2 font-medium text-black text-xl transition-all ease-in hover:opacity-80 active:opacity-70'
                      onClick={handleCopyToClipboard}
                    >
                      Copy
                    </button>
                  </div>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <ResetButton
              disabled={tasks.length === 1 && !tasks[0].code && tasks[0].percentage === 100 && !tasks[0].time}
              onClick={resetTasks}
            />

            <SettingsDialog variant='default' />
          </motion.div>
        </motion.div>
      </LayoutGroup>
    </main>
  )
}
