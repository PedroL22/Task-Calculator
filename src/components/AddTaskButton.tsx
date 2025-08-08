import type { ComponentProps } from 'react'

export const AddTaskButton = (props: ComponentProps<'button'>) => (
  <button
    {...props}
    type='button'
    className='inline-flex h-14 cursor-pointer select-none items-center justify-center gap-2 whitespace-nowrap rounded-xl bg-emerald-500 px-7 font-semibold text-white text-xl shadow-sm transition-all ease-in hover:bg-emerald-600 hover:text-gray-300 active:scale-[.97] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-60 dark:bg-emerald-700 dark:hover:bg-emerald-800'
  >
    Add task
  </button>
)
