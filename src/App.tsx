import { useEffect, useState } from 'react'

import { ClipboardText } from '@phosphor-icons/react/dist/ssr'
import { MagicMotion } from 'react-magic-motion'
import { toast } from 'sonner'
import { AddTaskButton } from '~/components/AddTaskButton'
import { ExportButton } from '~/components/ExportButton'
import { ResetButton } from '~/components/ResetButton'
import { TaskRow } from '~/components/TaskRow'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '~/components/ui/dialog'

import { useConfigStore } from '~/store/useConfigStore'
import { useTaskStore } from '~/store/useTaskStore'

export const App = () => {
  const { hoursToWork, setHoursToWork } = useConfigStore()
  const { tasks, addTask, removeTask, updateTask, resetTasks } = useTaskStore()
  const [remainingTime, setRemainingTime] = useState(8)

  const dataToExport = tasks.map(({ code, percentage, time }) => ({ code, percentage, time }))

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(
      dataToExport.map((task) => `${task.code}, ${task.percentage}%, ${task.time}`).join('\n')
    )

    toast.success('Tasks copied to clipboard!')
  }

  useEffect(() => {
    const totalHours = tasks.reduce((acc, task) => acc + (task.time || 0), 0)
    setRemainingTime(hoursToWork - totalHours)
  }, [tasks, hoursToWork])

  return (
    <MagicMotion>
      <main className='mx-auto max-w-screen-lg p-6'>
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

        <div className='mt-10 flex flex-col'>
          <div className='mb-6 flex flex-col space-y-4'>
            {tasks.length ? (
              tasks.map((task) => (
                <TaskRow
                  key={task.id}
                  id={task.id}
                  code={task.code}
                  percentage={task.percentage}
                  time={task.time}
                  canDelete={tasks.length > 1}
                  onChange={updateTask}
                  onClose={() => removeTask(task.id)}
                />
              ))
            ) : (
              <p className='text-2xl'>No tasks added.</p>
            )}
          </div>

          <div className='flex items-center space-x-4'>
            <AddTaskButton onClick={addTask} />

            <Dialog>
              <DialogTrigger disabled={tasks.some((task) => task.code === '' || !task.percentage || !task.time)}>
                <ExportButton disabled={tasks.some((task) => task.code === '' || !task.percentage || !task.time)} />
              </DialogTrigger>

              <DialogContent className='border-none bg-white dark:bg-gray-700'>
                <DialogHeader>
                  <DialogTitle>Export tasks</DialogTitle>
                </DialogHeader>

                <div className='relative flex select-all flex-col rounded-lg bg-gray-200 p-3 text-xl dark:bg-gray-500 dark:text-gray-200'>
                  <button
                    type='button'
                    className='absolute top-2 right-2 select-none rounded-full p-1 transition-all ease-in dark:active:bg-gray-700 dark:hover:bg-gray-600'
                    onClick={handleCopyToClipboard}
                  >
                    <ClipboardText size={28} />
                  </button>

                  {dataToExport.map((task) => (
                    <p key={task.code} className='font-mono'>
                      {task.code}, {task.percentage}%, {task.time}
                    </p>
                  ))}
                </div>

                <DialogFooter>
                  <DialogClose className='rounded-lg bg-gray-200 px-4 py-2 font-medium text-black text-xl'>
                    Close
                  </DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <ResetButton onClick={resetTasks} />
          </div>
        </div>
      </main>
    </MagicMotion>
  )
}
