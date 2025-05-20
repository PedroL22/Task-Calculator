import type { ComponentProps } from 'react'

type TaskInputProps = ComponentProps<'input'>
export const TaskInput = (props: TaskInputProps) => {
  return (
    <input
      {...props}
      placeholder={props.placeholder}
      className='w-full rounded-xl border-4 bg-gray-200 p-5 text-4xl outline-none [appearance:textfield] focus:border-gray-400 dark:text-black dark:placeholder:text-gray-600 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none'
    />
  )
}
