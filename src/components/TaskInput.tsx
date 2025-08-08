import type { ComponentProps } from 'react'

type TaskInputProps = ComponentProps<'input'>
export const TaskInput = (props: TaskInputProps) => {
  return (
    <input
      {...props}
      placeholder={props.placeholder}
      onWheel={(e) => {
        if (props.type === 'number') {
          e.preventDefault()
          e.currentTarget.blur()
        }
        props.onWheel?.(e)
      }}
      className='w-full rounded-xl border border-gray-300 bg-gray-200 px-5 py-4 text-3xl leading-none outline-none [appearance:textfield] placeholder:text-gray-400 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 dark:placeholder:text-gray-500 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none'
    />
  )
}
