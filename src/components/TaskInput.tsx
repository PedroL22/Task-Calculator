import type { ComponentProps } from 'react'

type TaskInputProps = ComponentProps<'input'> & {
  isDragging: boolean
}

export const TaskInput = (props: TaskInputProps) => {
  return (
    <input
      {...props}
      placeholder={props.placeholder}
      data-is-dragging={props.isDragging}
      className='w-full rounded-xl border-4 bg-gray-200 p-5 text-4xl outline-none transition-all ease-in [appearance:textfield] focus:border-gray-400 data-[is-dragging=true]:shadow-xl dark:text-black dark:placeholder:text-gray-600 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none'
    />
  )
}
