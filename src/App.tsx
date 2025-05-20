import { useEffect, useState } from 'react'

import { ClipboardTextIcon } from '@phosphor-icons/react/dist/ssr'
import { AnimatePresence, LayoutGroup, motion } from 'motion/react'
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
  const { tasks, addTask, removeTask, updateTask, resetTasks } = useTaskStore()
  const [remainingTime, setRemainingTime] = useState(8)

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
    const totalHours = tasks.reduce((acc, task) => acc + (task.time || 0), 0)
    setRemainingTime(hoursToWork - totalHours)
  }, [tasks, hoursToWork])

  return (
    <main className='mx-auto min-h-screen max-w-(--breakpoint-lg) p-6'>
      <LayoutGroup>
        <div className='space-y-4'>
          <h1 className='font-medium text-5xl'>⏳Remaining time: {remainingTime}</h1>

          <h2 className='flex items-center space-x-2 font-medium text-4xl'>
            <span>🕐Hours to work:</span>

            <input
              value={hoursToWork}
              max='12'
              maxLength={2}
              className='flex w-14 items-center rounded-xl px-2.5 py-1 text-4xl outline-none focus:border-gray-700 dark:bg-gray-700'
              onChange={(e) => {
                let value = e.target.value.slice(0, 2)
                value = Math.min(Number.parseInt(value) || 0, 24).toString()
                setHoursToWork(Number(value))
              }}
            />
          </h2>
        </div>

        <motion.div className='mt-10 flex flex-col' layout>
          <motion.div className='mb-6 flex flex-col space-y-4' layout>
            <AnimatePresence>
              {tasks.length ? (
                tasks.map((task) => (
                  <motion.div
                    key={task.id}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20, transition: { duration: 0.1 } }}
                    transition={{ duration: 0.3 }}
                    layout
                  >
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
                ))
              ) : (
                <p className='text-2xl'>No tasks added.</p>
              )}
            </AnimatePresence>
          </motion.div>

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
