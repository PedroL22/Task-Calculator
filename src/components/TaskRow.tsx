import { useEffect, useState } from 'react'

import { toast } from 'sonner'
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
  const [percentageInput, setPercentageInput] = useState(
    props.percentage == null || props.percentage === 0 || Number.isNaN(props.percentage)
      ? ''
      : props.percentage.toString()
  )
  const [timeInput, setTimeInput] = useState(
    props.time == null || props.time === 0 || Number.isNaN(props.time) ? '' : props.time.toString()
  )

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
      toast.success(`Description saved for ${props.code}!`)
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

  useEffect(() => {
    if (props.percentage == null || props.percentage === 0 || Number.isNaN(props.percentage)) {
      setPercentageInput('')
      return
    }
    const current = Number(percentageInput.replace(',', '.'))
    if (props.percentage !== current) {
      setPercentageInput(props.percentage.toString())
    }
  }, [props.percentage])

  useEffect(() => {
    if (props.time == null || props.time === 0 || Number.isNaN(props.time)) {
      setTimeInput('')
      return
    }
    const current = Number(timeInput.replace(',', '.'))
    if (props.time !== current) {
      setTimeInput(props.time.toString())
    }
  }, [props.time])

  return (
    <div className='flex w-full items-center justify-between space-x-4 rounded-2xl border border-gray-300/60 bg-white/70 px-5 py-4 shadow-sm backdrop-blur dark:border-gray-600/50 dark:bg-gray-800/60'>
      <Dialog open={descriptionDialog} onOpenChange={setDescriptionDialog}>
        <DialogTrigger>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div
                  aria-hidden
                  className={cn(
                    'size-18 shrink-0 cursor-pointer rounded-lg ring-2 ring-transparent transition-all hover:brightness-110 focus-visible:outline-none focus-visible:ring-emerald-400',
                    taskColor
                  )}
                />
              </TooltipTrigger>

              <TooltipContent side='bottom'>
                <p>{descriptionToShow}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </DialogTrigger>

        <DialogContent className='border-0 bg-white pb-5 dark:bg-gray-700'>
          <DialogHeader>
            <DialogTitle>
              <label htmlFor='description-input' className='cursor-pointer select-none'>
                Add a description to your task
              </label>
            </DialogTitle>

            <DialogDescription className='text-gray-500 dark:text-gray-400'>
              A brief summary of the task and its objectives.
            </DialogDescription>
          </DialogHeader>

          <div className='flex flex-col'>
            <input
              id='description-input'
              placeholder='Task description'
              className='w-full resize-none rounded-md bg-gray-100 px-2.5 py-1.5 text-base text-gray-900 shadow-sm placeholder:text-gray-400 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 dark:bg-gray-500 dark:text-gray-200'
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
              className='mt-3 cursor-pointer self-end rounded-lg bg-emerald-500 px-4 py-2 font-medium text-lg text-white transition-all ease-in hover:bg-emerald-600 active:opacity-70'
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
        type='text'
        inputMode='numeric'
        value={percentageInput}
        maxLength={5}
        onChange={(e) => {
          const raw = e.target.value.replace(',', '.')
          if (/^\d*(?:[.]?\d*)?$/.test(raw)) {
            setPercentageInput(e.target.value)
            if (raw === '' || raw === '.' || /\.$/.test(raw)) return
            const num = Math.min(Math.max(Number.parseFloat(raw) || 0, 0), 100)
            props.onChange(props.id, 'percentage', Number.isNaN(num) ? undefined : Math.round(num))
          }
        }}
        onBlur={() => {
          let raw = percentageInput.replace(',', '.')
          if (raw === '' || raw === '.') {
            setPercentageInput('')
            props.onChange(props.id, 'percentage', undefined)
            return
          }
          if (/\.$/.test(raw)) raw = raw.slice(0, -1)
          const num = Math.min(Math.max(Number.parseFloat(raw) || 0, 0), 100)
          setPercentageInput(num ? num.toString() : '')
          props.onChange(props.id, 'percentage', num || undefined)
        }}
      />

      <TaskInput
        placeholder='Time'
        type='text'
        inputMode='decimal'
        value={timeInput}
        maxLength={6}
        onChange={(e) => {
          const raw = e.target.value.replace(',', '.')
          if (/^\d*(?:[.]?\d*)?$/.test(raw)) {
            setTimeInput(e.target.value)
            if (raw === '' || raw === '.' || /\.$/.test(raw)) return
            const num = Math.min(Math.max(Number.parseFloat(raw) || 0, 0), 12)
            props.onChange(props.id, 'time', Number.isNaN(num) ? undefined : num)
          }
        }}
        onBlur={() => {
          let raw = timeInput.replace(',', '.')
          if (raw === '' || raw === '.') {
            setTimeInput('')
            props.onChange(props.id, 'time', undefined)
            return
          }
          if (/\.$/.test(raw)) raw = raw.slice(0, -1)
          const num = Math.min(Math.max(Number.parseFloat(raw) || 0, 0), 12)
          setTimeInput(num ? num.toString() : '')
          props.onChange(props.id, 'time', num || undefined)
        }}
      />

      <button
        type='button'
        title='Delete task'
        disabled={!props.canDelete}
        className='cursor-pointer select-none rounded-lg p-2 text-2xl transition-all ease-in hover:bg-red-50 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40 dark:hover:bg-red-950/40'
        onClick={props.onClose}
      >
        ❌
      </button>
    </div>
  )
}
