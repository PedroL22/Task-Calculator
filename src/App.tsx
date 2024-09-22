import { useState } from 'react'

import { AddTaskButton } from '~/components/AddTaskButton'
import { ExportButton } from '~/components/ExportButton'
import { TaskRow } from '~/components/TaskRow'

import { generateRandomID } from '~/utils/generateRandomID'

import type { TaskEntity } from '~/entities/TaskEntity'

export const App = () => {
  const [remainingTime, setRemainingTime] = useState(8)
  const [tasks, setTasks] = useState<TaskEntity[]>([
    { id: generateRandomID(), code: '', percentage: undefined, time: undefined },
  ])

  const addTask = () => {
    setTasks([...tasks, { id: generateRandomID(), code: '', percentage: undefined, time: undefined }])
  }

  const removeTask = (id: string) => {
    const newTasks = tasks.filter((task) => task.id !== id)
    setTasks(newTasks)
  }

  const handleExportData = () => {
    const dataToExport = tasks.map((task) => {
      return {
        code: task.code,
        percentage: task.percentage,
        time: task.time,
      }
    })

    console.log(dataToExport)
  }

  return (
    <main className='mx-auto max-w-screen-lg p-6'>
      <h1 className='font-medium text-5xl'>🕐Remaining time: {remainingTime}</h1>

      <div className='mt-10 flex flex-col'>
        <div className='mb-6 flex flex-col space-y-4'>
          {tasks.map((task) => {
            return (
              <TaskRow
                key={task.id}
                id={task.id}
                code={task.code}
                percentage={task.percentage}
                time={task.time}
                onClose={() => removeTask(task.id)}
              />
            )
          })}
        </div>

        <div className='flex items-center space-x-6'>
          <AddTaskButton onClick={addTask} />

          <ExportButton onClick={handleExportData} />
        </div>
      </div>
    </main>
  )
}
