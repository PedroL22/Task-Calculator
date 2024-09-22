import { useEffect, useState } from 'react'

import { AddTaskButton } from '~/components/AddTaskButton'
import { ExportButton } from '~/components/ExportButton'
import { ResetButton } from '~/components/ResetButton'
import { TaskRow } from '~/components/TaskRow'

import { generateRandomID } from '~/utils/generateRandomID'

import type { TaskEntity } from '~/entities/TaskEntity'

export const App = () => {
  const [hoursToWork, setHoursToWork] = useState(8)
  const [remainingTime, setRemainingTime] = useState(8)
  const [tasks, setTasks] = useState<TaskEntity[]>([
    { id: generateRandomID(), code: '', percentage: undefined, time: undefined },
  ])

  const addTask = () => {
    setTasks((prevTasks) => [
      ...prevTasks,
      { id: generateRandomID(), code: '', percentage: undefined, time: undefined },
    ])
  }

  const removeTask = (id: string) => {
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id))
  }

  const updateTask = (id: string, key: keyof TaskEntity, value: any) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) => (task.id === id ? { ...task, [key]: key === 'time' ? Number(value) : value } : task))
    )
  }

  const handleExportData = () => {
    const dataToExport = tasks.map(({ code, percentage, time }) => ({ code, percentage, time }))
    console.log(dataToExport)
  }

  const handleResetData = () => {
    setHoursToWork(8)
    setTasks([{ id: generateRandomID(), code: '', percentage: undefined, time: undefined }])
  }

  useEffect(() => {
    const totalHours = tasks.reduce((acc, task) => acc + (task.time || 0), 0)
    setRemainingTime(hoursToWork - totalHours)
  }, [tasks, hoursToWork])

  return (
    <main className='mx-auto max-w-screen-lg p-6'>
      <div className='space-y-4'>
        <h1 className='font-medium text-5xl'>⏳Remaining time: {remainingTime}</h1>

        <h2 className='flex items-center space-x-2 font-medium text-4xl'>
          <span>🕐Hours to work:</span>

          <input
            value={hoursToWork}
            onChange={(e) => setHoursToWork(Number(e.target.value))}
            className='flex w-14 items-center rounded-xl px-2.5 py-1 text-4xl outline-none focus:border-gray-700 dark:bg-gray-700 dark:text-white'
          />
        </h2>
      </div>

      <div className='mt-10 flex flex-col'>
        <div className='mb-6 flex flex-col space-y-4'>
          {tasks.map((task) => (
            <TaskRow
              key={task.id}
              id={task.id}
              code={task.code}
              percentage={task.percentage}
              time={task.time}
              onChange={updateTask}
              onClose={() => removeTask(task.id)}
            />
          ))}
        </div>

        <div className='flex items-center space-x-4'>
          <AddTaskButton onClick={addTask} />

          <ExportButton onClick={handleExportData} />

          <ResetButton onClick={handleResetData} />
        </div>
      </div>
    </main>
  )
}
