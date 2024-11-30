import { useEffect, useState } from 'react'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '~/components/ui/dialog'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '~/components/ui/tooltip'
import { TaskInput } from './TaskInput'

import { cn } from '~/lib/utils'

import { toast } from 'sonner'
import type { TaskEntity } from '~/entities/TaskEntity'

type TaskRowProps = TaskEntity & {
  canDelete: boolean
  hoursToWork: number
  onChange: (id: string, key: keyof TaskEntity, value: string | number | undefined) => void
  onClose: () => void
}

export const TaskRow = (props: TaskRowProps) => {
  const [descriptionDialog, setDescriptionDialog] = useState(false)
  const [descriptionText, setDescriptionText] = useState(props.description || '')

  const getColorFromTime = (time: number, hoursToWork: number) => {
    const ratio = Math.min(time / hoursToWork, 1)
    if (ratio >= 0.9) return 'bg-red-600'
    if (ratio >= 0.8) return 'bg-red-500'
    if (ratio >= 0.7) return 'bg-orange-400'
    if (ratio >= 0.6) return 'bg-orange-500'
    if (ratio >= 0.5) return 'bg-yellow-400'
    if (ratio >= 0.4) return 'bg-yellow-500'
    if (ratio >= 0.3) return 'bg-lime-400'
    if (ratio >= 0.2) return 'bg-lime-500'
    if (ratio >= 0.1) return 'bg-green-500'
    return 'bg-green-500'
  }

  const taskColor = getColorFromTime(Number(props.time), props.hoursToWork)

  const handleSaveDescription = () => {
    props.onChange(props.id, 'description', descriptionText)

    setDescriptionText('')
    setDescriptionDialog(false)

    if (props.code.length) {
      toast.success(`Description saved ${props.code}!`)
    } else {
      toast.success('Description saved!')
    }
  }

  const descriptionToShow = props.description?.length
    ? props.description
    : descriptionText.length
      ? descriptionText
      : '-'

  useEffect(() => {
    setDescriptionText(props.description || '')
  }, [props.description])

  return (
    <div className='flex w-full items-center justify-between space-x-4'>
      <Dialog open={descriptionDialog} onOpenChange={setDescriptionDialog}>
        <DialogTrigger>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div aria-hidden className={cn('size-[5.5rem] shrink-0 cursor-pointer rounded-lg', taskColor)} />
              </TooltipTrigger>

              <TooltipContent side='bottom'>
                <p>{descriptionToShow}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </DialogTrigger>

        <DialogContent className='border-0 pb-5 dark:bg-gray-700'>
          <DialogHeader>
            <DialogTitle>
              <label htmlFor='description-input' className='cursor-pointer select-none'>
                Add a description to your task
              </label>
            </DialogTitle>

            <DialogDescription className='dark:text-gray-400'>
              A brief summary of the task and its objectives.
            </DialogDescription>
          </DialogHeader>

          <div className='flex flex-col'>
            <input
              id='description-input'
              placeholder='Task description'
              className='w-full resize-none rounded-md bg-gray-200 px-2.5 py-1.5 text-base text-black shadow-sm placeholder:text-gray-400 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 dark:bg-gray-500 dark:text-gray-200'
              value={descriptionText}
              onChange={(e) => setDescriptionText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSaveDescription()
                }
              }}
            />

            <button
              type='button'
              className='mt-3 self-end rounded-lg bg-gray-200 px-4 py-2 font-medium text-black text-lg transition-all ease-in hover:opacity-80 active:opacity-70'
              onClick={handleSaveDescription}
            >
              Save
            </button>
          </div>
        </DialogContent>
      </Dialog>

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
