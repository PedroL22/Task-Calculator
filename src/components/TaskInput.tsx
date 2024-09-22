import type { ComponentProps } from 'react'

type TaskInputProps = ComponentProps<'input'> & {
  title?: string
}

export const TaskInput = (props: TaskInputProps) => {
  return (
    <input
      {...props}
      placeholder={props.placeholder}
      className='w-full rounded-xl border-4 p-5 text-4xl outline-none focus:border-gray-400 dark:text-black dark:placeholder:text-gray-600'
    />
  )
}
