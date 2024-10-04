import { TaskInput } from './TaskInput'

import type { TaskEntity } from '~/entities/TaskEntity'
import { cn } from '~/lib/utils'

type TaskRowProps = TaskEntity & {
  canDelete: boolean
  hoursToWork: number
  onChange: (id: string, key: keyof TaskEntity, value: string | number | undefined) => void
  onClose: () => void
}

export const TaskRow = (props: TaskRowProps) => {
  const getColorFromTime = (time: number, hoursToWork: number) => {
    const ratio = Math.min(time / hoursToWork, 1)
    if (ratio >= 0.875) return 'bg-red-500'
    if (ratio >= 0.75) return 'bg-red-300'
    if (ratio >= 0.625) return 'bg-orange-500'
    if (ratio >= 0.5) return 'bg-orange-300'
    if (ratio >= 0.375) return 'bg-yellow-500'
    if (ratio >= 0.25) return 'bg-yellow-300'
    if (ratio >= 0.125) return 'bg-green-400'
    return 'bg-green-500'
  }

  const taskColor = getColorFromTime(Number(props.time), props.hoursToWork)

  return (
    <div className='flex w-full items-center justify-between space-x-4'>
      <div aria-hidden className={cn('size-[5.5rem] shrink-0 rounded-lg', taskColor)} />

      <TaskInput
        placeholder='Task ID'
        value={props.code}
        onChange={(e) => props.onChange(props.id, 'code', e.target.value)}
      />

      <TaskInput
        placeholder='Percentage %'
        type='number'
        value={props.percentage === 0 ? '' : props.percentage}
        max='100'
        maxLength={3}
        onChange={(e) => {
          let value = e.target.value.slice(0, 3)
          value = Math.min(Number.parseInt(value) || 0, 100).toString()
          props.onChange(props.id, 'percentage', value)
        }}
      />

      <TaskInput
        placeholder='Time'
        type='number'
        value={props.time === 0 ? '' : props.time}
        max='24'
        maxLength={4}
        onChange={(e) => {
          let value = e.target.value.slice(0, 4)
          value = Math.min(Number.parseFloat(value) || 0, 24).toString()
          props.onChange(props.id, 'time', value)
        }}
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
