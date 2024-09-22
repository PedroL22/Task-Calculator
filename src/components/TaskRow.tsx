import { TaskInput } from './TaskInput'

import type { TaskEntity } from '~/entities/TaskEntity'

type TaskRowProps = TaskEntity & {
  onChange: (id: string, key: keyof TaskEntity, value: string | number | undefined) => void
  onClose: () => void
}

export const TaskRow = (props: TaskRowProps) => {
  return (
    <div className='flex w-full items-center justify-between space-x-4'>
      <TaskInput
        placeholder='Task ID'
        value={props.code}
        onChange={(e) => props.onChange(props.id, 'code', e.target.value)}
      />

      <TaskInput
        placeholder='Percentage %'
        value={props.percentage}
        onChange={(e) => props.onChange(props.id, 'percentage', e.target.value)}
      />

      <TaskInput
        placeholder='Time'
        value={props.time === 0 ? '' : props.time}
        onChange={(e) => props.onChange(props.id, 'time', e.target.value)}
      />

      <button type='button' className='text-4xl' onClick={props.onClose}>
        ❌
      </button>
    </div>
  )
}
