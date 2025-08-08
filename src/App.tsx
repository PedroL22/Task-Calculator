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

  const progress = Math.min((totalHours / hoursToWork) * 100 || 0, 100)

  return (
    <main className='mx-auto min-h-screen max-w-(--breakpoint-lg) p-6'>
      <LayoutGroup>
        <div className='space-y-6 rounded-3xl border border-gray-300/60 bg-gradient-to-br from-gray-50/90 via-white/80 to-gray-100/70 p-8 shadow-lg backdrop-blur dark:border-gray-700/60 dark:from-gray-800/90 dark:via-gray-800/70 dark:to-gray-900/60'>
          <div className='flex flex-col items-start gap-6 md:flex-row md:items-end md:justify-between'>
            <div className='space-y-2'>
              <h1 className='font-bold text-5xl'>⏳Task Calculator</h1>

              <p className='font-medium text-base text-gray-600 dark:text-gray-400'>
                Organize, estimate and export your work hours.
              </p>
            </div>

            <div className='flex flex-col items-start gap-2 md:items-end'>
              <span className='text-gray-500 text-sm uppercase tracking-wide dark:text-gray-400'>Remaining Time</span>
              <div className='flex items-baseline gap-2'>
                <span className='font-semibold text-4xl'>{remainingTime.toFixed(2)}</span>
                <span className='text-base text-gray-500 dark:text-gray-400'>hrs</span>
              </div>
            </div>
          </div>

          <div className='space-y-3'>
            <div className='flex items-center gap-4'>
              <label htmlFor='hours-work-input' className='font-medium text-lg'>
                🕐Hours to work
              </label>
              <input
                id='hours-work-input'
                type='text'
                max='12'
                inputMode='decimal'
                value={hoursToWorkInput}
                placeholder='8'
                className='flex w-18 items-center rounded-lg border border-gray-300 bg-gray-200 px-3 py-1.5 text-center text-2xl outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100'
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

            <div className='h-3 w-full rounded-full bg-gray-200 dark:bg-gray-700'>
              <div
                className='h-full rounded-full bg-gradient-to-r from-emerald-500 via-emerald-400 to-sky-400 transition-all'
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className='flex justify-between text-gray-500 text-sm dark:text-gray-400'>
              <span>Total logged: {totalHours.toFixed(2)}h</span>
              <span>{progress.toFixed(1)}%</span>
            </div>
          </div>
        </div>

        <motion.div className='mt-10 flex flex-col' layout>
          <div className='mb-8 flex flex-col space-y-5'>
            {tasks.map((task, index) => (
              <motion.div key={task.id} layout className='relative flex items-center space-x-2'>
                <div className='-left-12 absolute flex flex-col'>
                  <button
                    type='button'
                    title='Move up'
                    className='cursor-pointer rounded-md p-1 text-gray-500 transition-all ease-in hover:bg-gray-300 hover:text-gray-800 active:scale-95 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-40 dark:hover:bg-gray-700'
                    disabled={index === 0}
                    onClick={() => moveTask(index, -1)}
                  >
                    <CaretUpIcon size={28} weight='bold' />
                  </button>

                  <button
                    type='button'
                    title='Move down'
                    className='cursor-pointer rounded-md p-1 text-gray-500 transition-all ease-in hover:bg-gray-300 hover:text-gray-800 active:scale-95 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-40 dark:hover:bg-gray-700'
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

          <motion.div className='flex flex-wrap items-center gap-4' layout>
            <AddTaskButton onClick={addTask} />

            <Dialog>
              <DialogTrigger asChild>
                <ExportButton disabled={tasks.some((task) => task.code === '' || !task.percentage || !task.time)} />
              </DialogTrigger>

              <DialogContent className='border-none bg-white/90 backdrop-blur-sm dark:bg-gray-800/90'>
                <DialogHeader>
                  <DialogTitle>Export tasks</DialogTitle>

                  <DialogDescription className='dark:text-gray-400'>
                    Your tasks are automatically saved and will be available in future sessions.
                  </DialogDescription>
                </DialogHeader>

                <div className='relative flex max-h-[320px] flex-col overflow-auto rounded-lg bg-gray-100 p-4 text-lg dark:bg-gray-700/70 dark:text-gray-200'>
                  <button
                    type='button'
                    title='Copy to clipboard'
                    className='absolute top-2 right-2 cursor-pointer select-none rounded-full p-1 text-gray-600 transition-all ease-in hover:bg-gray-200 hover:text-gray-900 active:scale-95 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-gray-100'
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
                      className='cursor-pointer rounded-lg bg-gray-200 px-5 py-2 font-medium text-lg text-white shadow transition-all ease-in hover:bg-gray-300 active:scale-95 dark:bg-gray-700 dark:hover:bg-gray-600'
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

            <div className='ml-auto flex items-center gap-4'>
              <SettingsDialog variant='default' />
            </div>
          </motion.div>
        </motion.div>
      </LayoutGroup>
    </main>
  )
}
