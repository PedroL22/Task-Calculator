import type { ComponentProps } from 'react'

export const AddTaskButton = (props: ComponentProps<'button'>) => {
  return (
    <button
      {...props}
      type='button'
      className='w-fit select-none rounded-2xl bg-emerald-700 p-6 font-bold text-2xl transition-all ease-in hover:opacity-80'
    >
      Add new task
    </button>
  )
}
