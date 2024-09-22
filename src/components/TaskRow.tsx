import { TaskInput } from './TaskInput'

import type { TaskEntity } from '~/entities/TaskEntity'

type TaskRowProps = TaskEntity & {
  onClose: () => void
}

export const TaskRow = (props: TaskRowProps) => {
  return (
    <div className='flex w-full items-center justify-between space-x-6'>
      <TaskInput placeholder='Task ID' value={props.code} />

      <TaskInput placeholder='Percentage %' value={props.percentage} />

      <TaskInput placeholder='Time' value={props.time} />

      <button type='button' className='text-4xl' onClick={props.onClose}>
        ❌
      </button>
    </div>
  )
}
