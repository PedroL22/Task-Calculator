import { TaskInput } from './TaskInput'

import type { TaskEntity } from '~/entities/TaskEntity'

type TaskRowProps = TaskEntity & {
  canDelete: boolean
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
        type='number'
        value={props.percentage === 0 ? '' : props.percentage}
        onChange={(e) => props.onChange(props.id, 'percentage', e.target.value)}
      />

      <TaskInput
        placeholder='Time'
        type='number'
        value={props.time === 0 ? '' : props.time}
        onChange={(e) => props.onChange(props.id, 'time', e.target.value)}
      />

      <button
        type='button'
        disabled={!props.canDelete}
        className='text-4xl disabled:cursor-not-allowed disabled:opacity-50'
        onClick={props.onClose}
      >
        ❌
      </button>
    </div>
  )
}
